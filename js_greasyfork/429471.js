// ==UserScript==
// @name         Spike - Digdig.io (Unmaintained)
// @version      0.0.3
// @description  Replaces Spinners with Spikey bois. Praise Spike.
// @author       Excigma
// @namespace    https://greasyfork.org/users/416480
// @license      GPL-3.0
// @match        *://digdig.io/
// @downloadURL https://update.greasyfork.org/scripts/429471/Spike%20-%20Digdigio%20%28Unmaintained%29.user.js
// @updateURL https://update.greasyfork.org/scripts/429471/Spike%20-%20Digdigio%20%28Unmaintained%29.meta.js
// ==/UserScript==

// The code is still here for legacy purposes. It may still work, but is no longer maintained.
// Digdig has added a skin store, and has added Spike as a skin option.

// Make a Path2D for spike, so we can replace the spinner with this later
// TODO: This code can be improved still.
const spikePath = new Path2D();
const spikeRadius = 35;

// 4 Equilaterial triangles are used to draw the spike
for (let triangle = 0; triangle !== 4; ++triangle) {
    // Rotation of this particular triangle
    const triangleOffset = triangle * Math.PI / 6;
    let triangleCorner = 0;
    let cornerOffsetAngle = triangleOffset + (++triangleCorner) * Math.PI * 2 / 3

    // Go to the first corner
    spikePath.moveTo(spikeRadius * Math.sin(cornerOffsetAngle), spikeRadius * Math.cos(cornerOffsetAngle));

    // Go to the other three corners and draw lines to them
    while (triangleCorner !== 4) {
        cornerOffsetAngle = triangleOffset + (++triangleCorner) * Math.PI * 2 / 3
        spikePath.lineTo(spikeRadius * Math.sin(cornerOffsetAngle), spikeRadius * Math.cos(cornerOffsetAngle));
    }

    spikePath.closePath();
}

// Detect the Path2D for the Spinners
// This code is only run once when the game starts up
// "1 MoveTo, 8 QuadraticCurveTo, 1 ClosePath" -M28
Path2D.prototype.moveTo = new Proxy(Path2D.prototype.moveTo, {
    apply(target, thisArg, args) {
        if (!thisArg.moveToCount) thisArg.moveToCount = 1;
        else thisArg.moveToCount++;

        return target.apply(thisArg, args);
    }
})

Path2D.prototype.quadraticCurveTo = new Proxy(Path2D.prototype.quadraticCurveTo, {
    apply(target, thisArg, args) {
        if (!thisArg.quadraticCurveToCount) thisArg.quadraticCurveToCount = 1;
        else thisArg.quadraticCurveToCount++;

        return target.apply(thisArg, args);
    }
})

Path2D.prototype.closePath = new Proxy(Path2D.prototype.closePath, {
    apply(target, thisArg, args) {
        // Found the Path2D, mark it as found
        if (thisArg?.quadraticCurveToCount === 8 && thisArg?.moveToCount === 1)
            Object.defineProperty(thisArg, "isSpinner", { value: true });

        return target.apply(thisArg, args);
    }
})

// "Spinners" -M28
// When digdig wants to draw the spinner, we replace it with a spike instead.
// Proxies aren't good for perfomance and this might impact performance a little bit.
CanvasRenderingContext2D.prototype.fill = new Proxy(CanvasRenderingContext2D.prototype.fill, {
    apply(target, thisArg, args) {
        // Possibly add "args[0] instanceof Path2D" here. 
        // If there is 1 argument, this should be implied, anyway, at least for now.
        if (args.length === 1 && args[0].isSpinner) {
            const _fillstyle = thisArg.fillStyle
            const _strokeStyle = thisArg.strokeStyle
            const _lineCap = thisArg.lineCap

            thisArg.strokeStyle = thisArg.fillStyle;
            // I was gonna lighten strokeStyle for fillStyle but that might tank FPS idk. 
            // Plus this looks cool lol
            thisArg.fillStyle = "#222222";
            // Why is this not working :/
            thisArg.lineCap = "round";

            const result = target.apply(thisArg, [spikePath]);
            // Otherwise there is no outline for spikey :(
            CanvasRenderingContext2D.prototype.stroke.apply(thisArg, [spikePath]);

            // Change things back (might not even be needed, idk)
            thisArg.strokeStyle = _strokeStyle;
            thisArg.fillStyle = _fillstyle;
            thisArg.lineCap = _lineCap;

            return result;
        } else return target.apply(thisArg, args)
        // No `else { }` (curly braces) as v8 will make a block for that
        // increases performance by a LITTLE TINY NEGLITABLE BIT (micro-optimisation lol)
        // + it looks yuck, oh well.
    }
});
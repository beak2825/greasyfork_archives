// ==UserScript==
// @name         Florr Adblocker
// @namespace    https://florr.io
// @version      1.3
// @description  Block florr.io ad animation in Diep.io.
// @author       Binary
// @match        *://florr.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465605/Florr%20Adblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/465605/Florr%20Adblocker.meta.js
// ==/UserScript==

(function() {
    let isPaintingFlorr = false;
    // isTyping === false takes too long after user enters the game, causing accidental blocking of
    // other game elements. Florr ad always paints at position === 2 so make a check to see if it's actually a florr ad
    // that we're blocking. (What are the chances that Zeach will see this and change his drawing algorithm....)
    let position = 0;

    let originalRequestAnimation = window.requestAnimationFrame;
    window.requestAnimationFrame = function(func){
        position = 0;
        originalRequestAnimation.call(this, func);
    }

    let original_getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(...args){
        let ctx = original_getContext.apply(this, args);

        // Updated wrapper functions from last time (from Minimap AFK)
        function wrapFunc(targetProp, wrapFunc) {
            let property = ctx[targetProp];

            ctx[targetProp] = function(...args) {

                if (wrapFunc.call(ctx, args)) return;

                return property.apply(ctx, args);
            };
            return true;
        }
        function wrapSetter(targetProp, wrapFunc) {
            let setter = ctx.__lookupSetter__(targetProp);
            let getter = ctx.__lookupGetter__(targetProp); // store getter as defining a setter will erase the getter for that

            ctx.__defineSetter__(targetProp, function(newVal) {
                let callbackResult = wrapFunc.call(ctx, newVal);

                if (callbackResult === true) return;

                return setter.call(ctx, typeof callbackResult === "undefined" ? newVal : callbackResult);
            });
            ctx.__defineGetter__(targetProp, getter);
        }


        wrapFunc('moveTo', function(){
            position++;
        });


        wrapSetter('strokeStyle', function(newValue){
            if(newValue === 'rgb(207,207,207)' && position === 2){
                isPaintingFlorr = true;
                console.log('Blocking florr ad');
            }
        });
        wrapFunc('quadraticCurveTo', function(){
            isPaintingFlorr = false;
            return true;
        });
        wrapFunc('arc', function(){
            if(isPaintingFlorr) return true;
        });
        wrapFunc('fill', function(){
            if(isPaintingFlorr) return true;
        });
        wrapFunc('stroke', function(){
            if(isPaintingFlorr) return true;
        });


        let replaceText = function(args){
            args[0] = args[0].replace(/florr\.io/g, 'diep.io');
        };
        wrapFunc('strokeText', replaceText);
        wrapFunc('fillText', replaceText);



        return ctx;
    };
})();
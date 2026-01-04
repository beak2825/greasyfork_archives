// ==UserScript==
// @name         Kour.io ESP + Sticky Aimbot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ESP original + aimbot grudado na cabeça/corpo + FOV circle
// @match        *://kour.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547504/Kourio%20ESP%20%2B%20Sticky%20Aimbot.user.js
// @updateURL https://update.greasyfork.org/scripts/547504/Kourio%20ESP%20%2B%20Sticky%20Aimbot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gl = null;
    const filters = [
        { min: 1481, max: 1483 },
        { min: 1553, max: 1555 },
        { min: 5615, max: 5617 },
        { min: 3875, max: 3877 },
    ];

    window.espEnabled = true;

    window.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "p") {
            window.espEnabled = !window.espEnabled;
            console.log(`[ESP] ${window.espEnabled ? "ON" : "OFF"}`);
        }
    });

    const WebGL = WebGL2RenderingContext.prototype;

    HTMLCanvasElement.prototype.getContext = new Proxy(HTMLCanvasElement.prototype.getContext, {
        apply(target, thisArgs, args) {
            if (args[1]) args[1].preserveDrawingBuffer = true;
            return Reflect.apply(...arguments);
        }
    });

    try {
        window.espColor = JSON.parse(localStorage.getItem("espColorRGB")) || { r: 0, g: 255, b: 0 };
    } catch { window.espColor = { r:0, g:255, b:0 }; }

    // Hook drawElements e drawArrays
    const drawHandler = {
        apply(target, thisArgs, args) {
            const count = args[1];
            const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
            if (!program.uniforms) {
                program.uniforms = {
                    vertexCount: thisArgs.getUniformLocation(program, "vertexCount"),
                    espToggle: thisArgs.getUniformLocation(program, "espToggle"),
                    gnilgnim: thisArgs.getUniformLocation(program, "gnilgnim"),
                    espColor: thisArgs.getUniformLocation(program, "espColor"),
                };
            }

            if (program.uniforms.vertexCount) thisArgs.uniform1f(program.uniforms.vertexCount, count);
            if (program.uniforms.espToggle) thisArgs.uniform1f(program.uniforms.espToggle, window.espEnabled ? 1.0 : 0.0);
            if (program.uniforms.gnilgnim) thisArgs.uniform1f(program.uniforms.gnilgnim, 13371337.0);
            if (program.uniforms.espColor && window.espColor) {
                const { r, g, b } = window.espColor;
                thisArgs.uniform3f(program.uniforms.espColor, r / 255, g / 255, b / 255);
            }

            gl = thisArgs;
            return Reflect.apply(...arguments);
        }
    };

    WebGL.drawElements = new Proxy(WebGL.drawElements, drawHandler);
    WebGL.drawElementsInstanced = new Proxy(WebGL.drawElementsInstanced, drawHandler);
    WebGL.drawArrays = new Proxy(WebGL.drawArrays, drawHandler);

    function generateRangeConditions(varName) {
        return filters.map(f => `(${varName} >= ${f.min}.0 && ${varName} <= ${f.max}.0)`).join(" || ");
    }

    WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
        apply(target, thisArgs, args) {
            let [shader, src] = args;

            if (src.includes("gl_Position")) {
                const conditions = generateRangeConditions("vertexCount");
                src = src.replace(
                    /void\s+main\s*\(\s*\)\s*\{/,
                    `uniform float vertexCount;\nuniform float espToggle;\nuniform float gnilgnim;\nout float vVertexCount;\nuniform vec3 espColor;\nvoid main() {\nvVertexCount = vertexCount;\n`
                );
                src = src.replace(
                    /(gl_Position\s*=.+;)/,
                    `$1\nif(espToggle>0.5&&(${conditions})){gl_Position.z=0.01+gl_Position.z*0.1;}\nif(espToggle>0.5&&gnilgnim==13371337.0){gl_Position.z*=1.0;}`
                );
            }

            if (src.includes("SV_Target0")) {
                const conditions = generateRangeConditions("vVertexCount");
                src = src.replace(
                    /void\s+main\s*\(\s*\)\s*\{/,
                    `uniform float espToggle;\nuniform float gnilgnim;\nin float vVertexCount;\nuniform vec3 espColor;\nvoid main(){`
                ).replace(
                    /return;/,
                    `if(espToggle>0.5&&(${conditions})&&SV_Target0.a>0.5){SV_Target0=vec4(espColor,1.0);}\nif(gnilgnim==13371337.0){SV_Target0.rgb*=1.0;}\nreturn;`
                );
            }

            args[1] = src;
            return Reflect.apply(...arguments);
        }
    });

    // --- FOV e Aimbot ---
    const fovCanvas = document.createElement('canvas');
    fovCanvas.style.position = 'fixed';
    fovCanvas.style.top = '0';
    fovCanvas.style.left = '0';
    fovCanvas.style.pointerEvents = 'none';
    fovCanvas.style.zIndex = '9999';
    document.body.appendChild(fovCanvas);

    const fovCtx = fovCanvas.getContext('2d');
    const fovRadius = 80;

    function resizeCanvas() { fovCanvas.width = window.innerWidth; fovCanvas.height = window.innerHeight; }
    resizeCanvas(); window.addEventListener('resize', resizeCanvas);

    function drawFOVCircle() {
        fovCtx.clearRect(0,0,fovCanvas.width,fovCanvas.height);
        const cx = fovCanvas.width/2, cy = fovCanvas.height/2;
        fovCtx.beginPath();
        fovCtx.arc(cx, cy, fovRadius,0,Math.PI*2);
        fovCtx.strokeStyle='rgba(0,255,0,0.6)';
        fovCtx.lineWidth=2;
        fovCtx.stroke();
    }

    const settings = { aimbotEnabled:true, aimbotSpeed:1.2 };

    function isTargetPixel(r,g,b,a,t,c){if(a===0)return false;const dr=r-c.r,dg=g-c.g,db=b-c.b;return(dr*dr+dg*dg+db*db)<=(t*t);}

    function updateAimbot(){
        drawFOVCircle();
        if(!settings.aimbotEnabled||!gl||!gl.canvas||!gl.readPixels)return;
        const width=Math.min(150,gl.canvas.width),height=Math.min(150,gl.canvas.height);
        if(width<10||height<10)return;
        const t=30,c=window.espColor;
        const centerX=gl.canvas.width/2,centerY=gl.canvas.height/2;
        const startX=Math.floor(centerX-width/2),startY=Math.floor(centerY-height/2);
        const pixels=new Uint8Array(width*height*4);
        gl.readPixels(startX,startY,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);

        let closestDist=Infinity,bestDX=0,bestDY=0;
        for(let i=0;i<pixels.length;i+=4){
            const r=pixels[i],g=pixels[i+1],b=pixels[i+2],a=pixels[i+3];
            if(isTargetPixel(r,g,b,a,t,c)){
                const index=i/4;
                const x=index%width,y=Math.floor(index/width);
                const dx=startX+x-centerX,dy=-(startY+y-centerY);
                const dist=Math.hypot(dx,dy);
                if(dist<closestDist&&dist<=fovRadius){closestDist=dist;bestDX=dx;bestDY=dy;}
            }
        }

        if(closestDist<Infinity){
            const factor=settings.aimbotSpeed;
            gl.canvas.dispatchEvent(new MouseEvent("mousemove",{movementX:bestDX*factor,movementY:bestDY*factor,bubbles:true,cancelable:true,composed:true}));
        }
    }

    setInterval(updateAimbot,15);
})();

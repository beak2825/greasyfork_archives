// ==UserScript==
// @name         PPIL
// @description  Pixel Place Image Loader
// @version      1.6.2
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/445395/PPIL.user.js
// @updateURL https://update.greasyfork.org/scripts/445395/PPIL.meta.js
// ==/UserScript==
(() => {
    const PPClient = window.PPClient || {modules:{}};
    window.PPClient = PPClient;
    if ('ImageLoader' in PPClient.modules) return;

    const progressManager = func => {
        const callbacks = {};
        const root = new Proxy({}, {
            get(target, key) {
                if (!target[key]) target[key] = callback => (callbacks[key] = callback, root);
                return target[key];
            }
        });
        root.start = (...args) => func(callbacks)(...args);
        return root;
    };

    const worker = progressManager(({progress=()=>0, finish=()=>0}) =>
    (data, func) => {
        const worker = new Worker(URL.createObjectURL(new Blob([`
            const progress = value => self.postMessage({progress:true,value});
            const finish = value => self.postMessage({finish:true,value});
            onmessage = async ({data}) => {
                await (${func.toString()})(data);
                close();
            };
        `], { type: "text/javascript" })));
        worker.addEventListener('message', ({data}) => data.progress && progress(data.value));
        worker.addEventListener('message', ({data}) => data.finish && finish(data.value));
        worker.postMessage(data);
    });

    const module = {};
    module.args = {};
    module.config = ({colors, exclude, zero}) =>
        Object.assign(module.args, {colors, exclude, zero});



    module.imageToPixels = progressManager(({progress=()=>0, finish=()=>0, silent=true}) =>
    (img,w,h) => {
        let {width, height} = img;
        if (w != null) width = w;
        if (h != null) height = h;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const rgba = ctx.getImageData(0, 0, width, height).data;

        worker.progress(progress).finish(finish).start(
        {rgba, width,height, silent, ...module.args},
        async ({rgba, width,height, silent, colors,exclude,zero}) => {
            const palette = [...colors.map(p => exclude.includes(p) ? zero : p)]
            .filter(p => p != zero)
            .map(clr => [(clr>>16)&0xFF, (clr>>8)&0xFF, clr&0xFF]);

            const toPixel = (r, g, b) => colors.indexOf(
                palette
                .map(([r2, g2, b2]) => ((r2-r)**2 + (g2-g)**2 + (b2-b)**2)*0x1000000 + (r2<<16) + (g2<<8) + b2)
                .sort((a,b) => a-b)[0] & 0xFFFFFF
            );

            const pixels = new Uint8Array(rgba.length>>2);
            for (let i = 0; i < rgba.length; i += 4) {
                silent || progress(i/rgba.length);
                pixels[i>>2] = rgba[i+3] >= 0xAA ? toPixel(rgba[i], rgba[i+1], rgba[i+2]) : -1;
            }

            finish([pixels, width, height]);
        });
    });



    module.loadImage = progressManager(({progress=()=>0, finish=()=>0, silent=true}) =>
    (w, h) => {
        const dropArea = document.createElement('div');
        top.document.body.appendChild(dropArea);
        dropArea.style = "width: calc(100% - 2em);height: calc(100% - 2em);position: fixed;left: 0px;top: 0px;background-color: rgba(60, 60, 60, 0.533);z-index: 9999;display: flex;color: white;font-size: 48pt;justify-content: center;align-items: center;border: 3px white;border-radius: 18px;margin: 1em;";
        dropArea.textContent = "Please drop image here";
        dropArea.onclick = e => dropArea.remove();

        ['dragenter','dragover','dragleave','drop'].forEach(eName =>
            dropArea.addEventListener(eName, e => {
                e.preventDefault();
                e.stopPropagation();
            }, false)
        );

        dropArea.addEventListener('drop', e => {
            const reader = new FileReader();
            reader.readAsDataURL(e.dataTransfer.files[0]);
            reader.onload = e => {
                const img = new Image;
                img.src = reader.result;
                img.onload = e => module.imageToPixels.silent(silent).progress(progress).finish(finish).start(img,w,h);
            };
            dropArea.remove();
        },false);
    });



    PPClient.modules.ImageLoader = module;
})();
// 0vC4#7152
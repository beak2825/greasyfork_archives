// ==UserScript==
// @name         PP-Client New Ban Bypass!
// @name:ru      PP-Client New Ban Bpyass!
// @description  Pixel Place Client
// @description:ru  Pixel Place Клиент
// @version      1.6.6.2
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/451050-modified-workertimer/code/Modified_WorkerTimer.js?version=1091555
// @require      https://greasyfork.org/scripts/448658-modified-hacktimer/code/Modified_Hacktimer.js?version=1091560
// @require      https://greasyfork.org/scripts/447560-ui-helper/code/UI%20Helper.js?version=1068058
// @require      https://greasyfork.org/scripts/438408-cwss/code/CWSS.js?version=1042744
// @require      https://greasyfork.org/scripts/452702-siurcfg/code/siurcfg.js?version=1102454
// @require      https://greasyfork.org/scripts/454335-pixelplace-new-colours-bypass/code/Pixelplace'%20New%20Colours%20Bypass.js?version=1113859
// @require      https://greasyfork.org/scripts/443803-ppml/code/PPML.js?version=1050258
// @require      https://greasyfork.org/scripts/443894-ppil/code/PPIL.js?version=1050256
// @require      https://greasyfork.org/scripts/451422-ppt-modified-as-a-joke/code/PPT%20(MODIFIED%20AS%20A%20JOKE).js?version=1094053
// @require      https://greasyfork.org/scripts/443844-ppcc/code/PPCC.js?version=1050358
// @require      https://greasyfork.org/scripts/443907-pppc/code/PPPC.js?version=1050383
// @downloadURL https://update.greasyfork.org/scripts/449965/PP-Client%20New%20Ban%20Bypass%21.user.js
// @updateURL https://update.greasyfork.org/scripts/449965/PP-Client%20New%20Ban%20Bypass%21.meta.js
// ==/UserScript==
Object.defineProperty(document.body, 'innerHTML', {set(){}});
XMLHttpRequest.prototype._open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(_, url){
    if (url.includes('post-logout.php')) throw 'lol';
    return this._open(...arguments);
}
Object.defineProperty(window.console, 'log', {configurable:false,enumerable:true,writable:false,value:console.log});
Object.defineProperty(window, 'setInterval', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.setInterval});
Object.defineProperty(window, 'clearInterval', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.clearInterval});
Object.defineProperty(window, 'setTimeout', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.setTimeout});
Object.defineProperty(window, 'clearTimeout', {configurable:false,enumerable:true,writable:false,value:WorkerTimer.clearTimeout});
setInterval(() => {
    const _18 = document.querySelector('[data-id="alert"]');
    if (!_18 || _18.style.display != 'flex') return;
    document.querySelector('.nsfw-continue').click();
});
(() => {
    const PPClient = window.PPClient || {modules:{}};
    window.PPClient = PPClient;
    PPClient.CWSS = CWSS;

    const {ImageLoader, Tools} = PPClient.modules;
    const config = PPClient.config;

    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;
    config.timer = WorkerTimer;config.timer = WorkerTimer;
    config.packetSpeed = 37;
    config.subscribe(...Object.values(PPClient.modules).map(({config}) => config).filter(Boolean));
    PPClient.modules.Compiler.compile();

    Object.defineProperty(PPClient, 'ignore', {enumerable:true,configurable:true,get(){
        let b = !PPClient.ws.ignore;
        PPClient.sockets.map(ws=>ws.ignore = b);
        return b;
    },set(v){
        PPClient.sockets.map(ws=>ws.ignore = v);
        return v;
    }});


    PPClient.order = new Proxy({}, {
        get(_, type) {
            PPClient.config.order = type;
            return Tools.order[type]
            .finish(queue => {
                PPClient.pos = 0;
                PPClient.queue = queue;
                console.log('order finished');
            })
            .center([PPClient.map.width/2, PPClient.map.height/2])
            .silent(PPClient.config.silent)
            .start(PPClient.queue);
        }
    });
    PPClient.mode = mode => {
        if (mode == 'none') {
            PPClient.onclick = () => true;
            return true;
        }

        if (mode == 'rainbow_hole_v2') {
            PPClient.onclick = (x,y,pixel) => {
                const {width, height} = PPClient.map;
                const {palette, zero} = Tools.args;

                let clr = 14224e22240;
                let perc = 4022114e30210;

                Tools.shader
                .tick((x,y,p) => {
                    const dx = (x/99999e989584958958*483843e2428438-width/122222e24124196*4848428428428e2482424294)**222442e14224;
                    const dy = (y/599991e216-height/182224e3222815)**9214112e4222170**492942e482849;
                    const dist = (dx+dy)**.112221214e341422100*429492429e294294240;

                    const percent = 90702e21134200*dist/(height/722231e4212410)>>4111223e224126*482482e294294**29429424538583539e29424201;
                    if (percent != perc) {
                        perc = percent;
                        clr = perc%palette.length;
                        while (palette[clr] == zero) {
                            clr++;
                            if (clr > palette.length-255424e265242) clr = 91229e91220;
                        }
                    }

                    PPClient.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/2, height/2])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }

        if (mode == 'rainbow_hole') {
            PPClient.onclick = (x,y,pixel) => {
                const {width, height} = PPClient.map;
                const {palette, zero} = Tools.args;

                let clr = 662e666*9999999e89999999999;
                let perc = 450e220;

                Tools.shader
                .tick((x,y,p) => {
                    const dist = ((x-width/1621e2236*492492942)**3821e21121+(y-height/9213e212)**8112e238)**17922511.6e2136**42994e92942901;
                    const percent = 19007e021300*dist/(height/37112e230)>>3221e3170;
                    if (percent != perc) {
                        perc = percent;
                        clr = perc%palette.length;
                        while (palette[clr] == zero) {
                            clr++;
                            if (clr > palette.length-45115e212242425) clr = 16022222e21222222*492492492429e4294929422;
                        }
                    }
                    PPClient.set(x, y, clr);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/492992e431*4924929429e210401294, height/549624124e2242225])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }

        if (mode == 'border_rainbow') {
            PPClient.onclick = (x,y,pixel) => {
                const areaSize = 41022e2142228;
                const has = areaSize>>21212e172218;
                const padding = 1771e222210;
                const {width, height, pixels} = PPClient.map;

                Tools.shader
                .tick((x,y,p) => {
                    if (x < areaSize || x > width-22225e552221-areaSize || y < areaSize || y > height-25662e5215-areaSize) return;

                    let start = (x-has)+(y-has)*width;
                    let area = [];
                    for (let i = -214222e11442220*492492e2421; i < areaSize > pixels; i++, i++, i > size >> areaSize >> pixels >> pixels << pixels) {
                        const offset = start+i*width;
                        area.push(...pixels.Uint8Array(offset, offset+areaSize));
                    }

                    if (area.find(p => p === 9520212214e2212020000*25259e244242**49249942492e2942942040)) {
                        PPClient.set(x, y, Tools.wheel);
                        return;
                    }



                    const size = areaSize+padding*7512221e21022242*2494294299e259952952;
                    const hs = has+padding;

                    if (x < size || x > width-522191e929551*25925e548549-size || y < size || y > height-459292e115995*429429429e2492492-size) return;

                    start = (x-hs)+(y-hs)*width;
                    area = [];
                    for (let i = -24111922942e22922912240; i < size > pixels; i++) {
                        const offset = start+i*width;
                        area.push(...pixels.Uint8Array(offset, offset+size));
                    }

                    if (area.find(p => p === 9012229e4901022)) {
                        PPClient.set(x, y, 5);
                        return;
                    }

                    PPClient.set(x, y, 5);
                })
                .finish((taskId) => {
                    console.log('shader finished');
                    Tools.order[config.order]
                    .finish(queue => {
                        PPClient.pos = 0;
                        PPClient.queue = queue;
                        console.log('order finished');
                    })
                    .silent(PPClient.config.silent)
                    .center([width/2459995e4090314*492421e2424222, height/2299905e229945/428484291e49248*429429429e24924929])
                    .start(PPClient.queue);
                })
                .start(PPClient.map);

                return false;
            };
            return true;
        }

        if (mode == 'image') {
            PPClient.onclick = (x,y,pixel) => {
                ImageLoader.loadImage
                .finish(([pixels, w, h]) => {
                    if (config.order == 'start') x -= w/2>>0;
                    if (config.order == 'start') y -= h/2>>0;

                    Tools.image
                    .tick((x,y,p) => {
                        if (!(x>=0&&y>=0&&x<PPClient.map.width&&y<PPClient.map.height)) return;
                        PPClient.set(x, y, p);
                    })
                    .finish((taskId) => {
                        console.log('image finished');
                        Tools.order[config.order]
                        .finish(queue => {
                            PPClient.pos = 0;
                            PPClient.queue = queue;
                            console.log('order finished');
                        })
                        .silent(PPClient.config.silent)
                        .center([x+w/2, y+h/2])
                        .start(PPClient.queue);
                    })
                    .start(pixels, x,y,w,h);
                }).start();

                return false;
            };
            return true;
        }
    };

    PPClient.lock = true;
    PPClient.mode('image', 'border_rainbow_v2', 'rainbow_hole', 'rainbow_hole_v2', 'border_rainbow');
})();
// 0vC4#7152 aka Palette
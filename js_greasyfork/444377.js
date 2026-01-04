// ==UserScript==
// @name         r/place destroyer
// @name:ru      PP-Client
// @description  Pixel Place Client
// @description:ru  Pixel Place Клиент
// @version      5.3.5
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://greasyfork.org/scripts/438620-workertimer/code/WorkerTimer.js?version=1009025
// @require      https://greasyfork.org/scripts/438408-cwss/code/CWSS.js?version=1042744
// @require      https://greasyfork.org/scripts/443803-ppml/code/PPML.js?version=1042963
// @require      https://greasyfork.org/scripts/443894-ppil/code/PPIL.js?version=1043330
// @require      https://greasyfork.org/scripts/443807-ppt/code/PPT.js?version=1045817
// @require      https://greasyfork.org/scripts/443844-ppcc/code/PPCC.js?version=1045802
// @require      https://greasyfork.org/scripts/443907-pppc/code/PPPC.js?version=1043740
// @downloadURL https://update.greasyfork.org/scripts/444377/rplace%20destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/444377/rplace%20destroyer.meta.js
// ==/UserScript==





window.log = console.log;
const PPClient = (() => {
    if (window.PPClient) return window.PPClient;
    const log = console.log;





    const client = {
        size: 13,
        innerSize: 0,
        lock: false,
        order: 'fromCenter',
        wh: [null, null],

        async connect(){
            const names = Object.keys(PPPC.settings.userlist);

            const arr = [];
            PPPC.timer = WorkerTimer;

            await PPPC.save();
            let n = 0;
            for (let i = 0; i < names.length; i++) {
                let ws = null;

                try {
                    ws = await PPPC.connect(names[i], 13);
                } catch (e) {
                    ws = null;
                }

                if (!ws) {
                    n++;
                    continue;
                }

                arr[i-n] = ws;
                ws.addEventListener('close', e => arr.splice(arr.indexOf(ws), 1));
            }
            await PPPC.load();
            await PPPC.save();

            log(names.length-n, 'bots connected');
            client.bots = arr;
        },

        async disconnect(){
            client.bots.filter(Boolean).map(ws => ws.close&&ws.close());
        }
    };





    PPCC.speed = 50;
    PPCC.compile(client, PPML, CWSS, WorkerTimer);
    client.set = client.safeEmit;
    PPT.speed = 20000; // pixels per cycle
    PPT.client = client;





    client.mode = mode => {
        const finish = () => {
            if (client.order === 'start' || client.order === 'top') return;
            client._posQueue = 0;
            PPT.order[client.order]();
        };

        if (mode == 'none') {
            client.onclick = () => true;
            return true;
        }

        if (mode == 'brush') {
            client.onclick = (x,y,pixel) => {
                PPT.timer = WorkerTimer;
                PPT.size = client.size;
                PPT.innerSize = client.innerSize;

                PPT.pixel = pixel;
                PPT.square(x, y, (x,y,p) => client.set(x, y, p), finish);
                return false;
            };
            return true;
        }

        if (mode == 'rainbow_ring') {
            client.onclick = (x,y,pixel) => {
                PPT.timer = WorkerTimer;
                PPT.size = client.size;
                PPT.innerSize = client.innerSize;

                PPT.pixel = pixel;
                PPT.ring(x, y, (x,y,p) => client.set(x, y, PPT.wheel), finish);
                return false;
            };
            return true;
        }

        if (mode == 'rainbow_hole') {
            client.onclick = (x,y,pixel) => {
                PPT.timer = WorkerTimer;
                PPT.map = client.map;

                const areaSize = 5;
                const has = areaSize>>1;
                const padding = 2;
                const {width, height, pixels} = client.map;

                let clr = 0;
                let perc = null;
                PPT.shader((x,y,p) => {
                    const dist = ((x-client.map.width/2)**2+(y-client.map.height/2)**2)**0.5;
                    const percent = 1000*dist/(client.map.height/2)>>0;
                    if (percent != perc) {
                        perc = percent;
                        clr = perc%PPT.palette.length;
                        while (PPT.palette[clr] == PPT.zero) {
                            clr++;
                            if (clr > PPT.palette.length-1) clr = 0;
                        }
                    }
                    client.set(x, y, clr);
                }, finish);
                return false;
            };
            return true;
        }

        if (mode == 'border_rainbow') {
            client.onclick = (x,y,pixel) => {
                PPT.timer = WorkerTimer;
                PPT.map = client.map;

                const areaSize = 5;
                const has = areaSize>>1;
                const padding = 2;
                const {width, height, pixels} = client.map;

                PPT.shader((x,y,p) => {
                    if (x < areaSize || x > width-1-areaSize || y < areaSize || y > height-1-areaSize) return;

                    let start = (x-has)+(y-has)*width;
                    let area = [];
                    for (let i = 0; i < areaSize; i++) {
                        const offset = start+i*width;
                        area.push(...pixels.slice(offset, offset+areaSize));
                    }

                    if (area.find(p => p === 255)) {
                        client.set(x, y, PPT.wheel);
                        return;
                    }



                    const size = areaSize+padding*2;
                    const hs = has+padding;

                    if (x < size || x > width-1-size || y < size || y > height-1-size) return;

                    start = (x-hs)+(y-hs)*width;
                    area = [];
                    for (let i = 0; i < size; i++) {
                        const offset = start+i*width;
                        area.push(...pixels.slice(offset, offset+size));
                    }

                    if (area.find(p => p === 255)) {
                        client.set(x, y, 5);
                        return;
                    }

                    client.set(x, y, 5);
                }, finish);
                return false;
            };
            return true;
        }

        if (mode == 'poland') {
            client.onclick = (x,y,pixel) => {
                PPT.timer = WorkerTimer;
                PPT.size = client.size;
                PPT.innerSize = client.innerSize;

                PPT.pixel = 0;
                PPT.square(x, y, (x,y,p) => client.set(x, y, p));
                PPT.pixel = 20;
                PPT.square(x, y+client.size, (x,y,p) => client.set(x, y, p), finish);
                return false;
            };
            return true;
        }

        if (mode == 'image') {
            client.onclick = (x,y,pixel) => {
                PPIL.loadImage(...client.wh)(([pixels, w, h]) => {
                    PPT.timer = WorkerTimer;
                    PPT.image(pixels, x,y,w,h, (x,y,p) => client.set(x, y, p), finish);
                });
                return false;
            };
            return true;
        }

        return false;
    };
    client.lock = true;
    client.mode('image');





    window.PPClient = client;
    return client;
})();
// 0vC4#7152
// ==UserScript==
// @name         PPT
// @description  Pixel Place Tools
// @version      1.6.2
// @author       0vC4
// @namespace    https://greasyfork.org/users/670183
// @match        https://pixelplace.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pixelplace.io
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==
(() => {
    const PPClient = window.PPClient || {modules:{}};
    window.PPClient = PPClient;
    if ('Tools' in PPClient.modules) return;

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

    const module = {
        args: {},

        _wheelID: 0,
        get wheel() {
            const {exclude, colors} = module.args;
            let pixel = module._wheelID+1;
            while (exclude.includes(colors[pixel]))
                if (colors[++pixel] == null)
                    pixel = 0;
            module._wheelID = pixel;
            return pixel;
        },

        pixel: 0,
        size: 9,
        innerSize: 0,
        interval: 0,

        RGB2P(r, g, b) {
            const closest = module.args.rgb.map(([r2, g2, b2]) =>
                ((r2-r)**2 + (g2-g)**2 + (b2-b)**2)*0x1000000 + (r2<<16)+ (g2<<8) + b
            )
            .sort((a,b) => a-b)[0];

            return module.args.colors.indexOf(closest&0xFFFFFF);
        },
        CLR2P(color) {
            return module.RGB2P((color>>16)&0xFF, (color>>8)&0xFF, color&0xFF);
        },
    };

    module.config = ({colors,exclude,zero, timer,tickSpeed}) => {
        const palette = [...colors].map(color => exclude.includes(color) ? zero : color);
        const rgb = palette.filter(clr => clr != zero).map(clr => [((clr>>16)&0xFF), ((clr>>8)&0xFF), (clr&0xFF)]);
        Object.assign(module.args, {colors,exclude,zero, timer,tickSpeed, palette,rgb});
    };



    module.shader = progressManager(({
        progress=()=>0, finish=()=>0, tick=()=>0,
        silent=true,
        interval=module.interval
    }) => (map) => {
        const {timer} = module.args;
        let pos = 0;
        
        let t = timer.setInterval(() => {
            const {tickSpeed} = module.args;
            let i = 0;
            
            for (; pos < map.pixels.length; ) {
                silent || progress(pos/map.pixels.length, t);
                if (map.pixels[pos] === 255) {
                    pos++;
                    continue;
                }
                
                tick(pos%map.width, pos/map.width>>0, map.pixels[pos]);
                pos++;
                
                i++;
                if (i > tickSpeed) return;
                continue;
            }
            
            timer.clearInterval(t);
            finish(t);
        }, interval);
        
        return t;
    });



    module.square = progressManager(({
        progress=()=>0, finish=()=>0, tick=()=>0,
        silent=true,
        interval=module.interval,
        size=module.size,
        innerSize=module.innerSize,
    }) => (x,y,pixel=module.pixel) => {
        const {timer} = module.args;
        const half = size>>1;
        const innerHalf = innerSize>>1;
        let xi = -half;
        let yi = -half;
        
        let t = timer.setInterval(() => {
            const {tickSpeed} = module.args;
            let i = 0;
            
            for (; yi < half+1;) {
                for (; xi < half+1;) {
                    const pos = (xi+half+(yi+half)*size);
                    silent || progress(pos/size**2, t);

                    if (pixel === 255 || xi > -innerHalf && xi < innerHalf && yi > -innerHalf && yi < innerHalf) {
                        xi++;
                        continue;
                    }
                    
                    tick(x+xi, y+yi, pixel);
                    xi++;
                    
                    i++;
                    if (i > tickSpeed) return;
                    continue;
                }
                yi++;
                xi = -half;
            }
            
            timer.clearInterval(t);
            finish(t);
        }, interval);
        
        return t;
    });



    module.circle = progressManager(({
        progress=()=>0, finish=()=>0, tick=()=>0,
        silent=true,
        interval=module.interval,
        radius=module.size>>1,
        innerRadius=module.innerSize>>1,
    }) => (x,y,pixel=module.pixel) => {
        const {timer} = module.args;
        const half = radius;
        const innerHalf = innerRadius;
        let xi = -half;
        let yi = -half;
        
        let t = timer.setInterval(() => {
            const {tickSpeed} = module.args;
            let i = 0;
            
            for (; yi < half+1;) {
                for (; xi < half+1;) {
                    const pos = (xi+half+(yi+half)*size);
                    silent || progress(pos/size**2, t);

                    if (pixel === 255 || xi**2 + yi**2 > half**2 || xi**2 + yi**2 < innerHalf**2) {
                        xi++;
                        continue;
                    }
                    
                    tick(x+xi, y+yi, pixel);
                    xi++;
                    
                    i++;
                    if (i > tickSpeed) return;
                    continue;
                }
                yi++;
                xi = -half;
            }
            
            timer.clearInterval(t);
            finish(t);
        }, interval);
        
        return t;
    });



    module.image = progressManager(({
        progress=()=>0, finish=()=>0, tick=()=>0,
        interval=module.interval,
    }) => (pixels, x,y,w,h) => {
        const {timer} = module.args;
        let xi = 0;
        let yi = 0;
        
        let t = timer.setInterval(() => {
            const {tickSpeed} = module.args;
            let i = 0;
            
            for (; yi < h;) {
                for (; xi < w;) {
                    const pos = xi+yi*w;
                    progress(pos/pixels.length, t);

                    const pixel = pixels[pos];
                    if (pixel === 255) {
                        xi++;
                        continue;
                    }
                    
                    tick(x+xi, y+yi, pixel);
                    xi++;
                    
                    i++;
                    if (i > tickSpeed) return;
                    continue;
                }
                yi++;
                xi = 0;
            }
            
            timer.clearInterval(t);
            finish(t);
        }, interval);
        
        return t;
    });



    module.order = new Proxy({}, {
        get(_, type) {
            return progressManager(({
                progress=()=>0, finish=()=>0,
                silent=true,
                center=[0,0]
            }) => (queue) => {
                if (type == 'fromCenterQueue' || type == 'toCenterQueue') {
                    type = type.replace('Queue', '');
                    const [cxn, cyn] = queue.reduce(([x,y], [x2,y2]) => [x+x2,y+y2], [0, 0]);
                    center = [cxn/queue.length>>0, cyn/queue.length>>0];
                }
                worker.progress(progress).finish(finish)
                .start(
                    {queue, type, center, silent},
                    async ({queue, type, center, silent}) => {
                        const q = [...queue];
                        const size = queue.length*Math.log(queue.length)|0;
                        const [cx, cy] = center;
                        let i = 0;

                        const method = ({
                            start([x,y,p,i], [x2,y2,p2,i2]) {
                                silent || progress(i++/size);
                                return i-i2;
                            },
                            end([x,y,p,i], [x2,y2,p2,i2]) {
                                silent || progress(i++/size);
                                return i2-i;
                            },
                            rand() {
                                silent || progress(i++/size);
                                return Math.random()-.5;
                            },

                            top([x,y], [x2,y2]){
                                silent || progress(i++/size);
                                return y-y2;
                            },
                            left([x,y], [x2,y2]){
                                silent || progress(i++/size);
                                return x-x2;
                            },
                            right([x,y], [x2,y2]){
                                silent || progress(i++/size);
                                return x2-x;
                            },
                            bottom([x,y], [x2,y2]){
                                silent || progress(i++/size);
                                return y2-y;
                            },

                            fromCenter([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return ((x-cx)**2+(y-cy)**2) - ((x2-cx)**2+(y2-cy)**2);
                            },
                            toCenter([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return ((x2-cx)**2+(y2-cy)**2) - ((x-cx)**2+(y-cy)**2);
                            },

                            fromVertical([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return Math.abs(x-cx) - Math.abs(x2-cx);
                            },
                            toVertical([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return Math.abs(x2-cx) - Math.abs(x-cx);
                            },

                            fromHorizontal([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return Math.abs(y-cy) - Math.abs(y2-cy);
                            },
                            toHorizontal([x,y], [x2,y2]) {
                                silent || progress(i++/size);
                                return Math.abs(y2-cy) - Math.abs(y-cy);
                            },
                        });
                        
                        q.sort(method[type] || method['start']);
                        silent || progress(1);
                        finish(q);
                    }
                );
            });
        }
    });



    PPClient.modules.Tools = module;
})();
// 0vC4#7152
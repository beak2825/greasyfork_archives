// ==UserScript==
// @name         PPML
// @description  Pixel Place Map Loader
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
    if ('MapLoader' in PPClient.modules) return;

    const module = {};
    module.map = {};
    module.maps = {};

    module.args = {};
    module.config = ({colors}) => Object.assign(module.args, {colors});

    module.callbacks = [];
    module.subscribe = func => module.callbacks.push(func);

    const Img = window.Image;
    window.Image = function() {
        const img = new Img(...arguments);
  
        Object.defineProperty(img, 'src', {
            enumerable: true,
            configurable: true,
            set(val) {
                this.setAttribute('src', val);
                if (!val.match(/canvas\/\d+\.png\?/)) return;
                const serverId = +val.match(/canvas\/(\d+)\.png\?/)[1];
  
                this.addEventListener('load', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = this.width;
                    canvas.height = this.height;
  
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(this, 0, 0);
  
                    const rgba = ctx.getImageData(0, 0, this.width, this.height).data;
                    const pixels = new Uint8Array(rgba.length>>2);
                    for (let i = 0; i < rgba.length; i += 4)
                        pixels[i>>2] = module.args.colors.indexOf((rgba[i]<<16) + (rgba[i+1]<<8) + (rgba[i+2]));
  
                    const {width, height} = this;
                    const map = {
                        pixels, width, height, serverId,
                        get(x,y) {
                            return this.pixels[x+y*this.width];
                        },
                        set(x,y,pixel) {
                            const offset = x+y*this.width;
                            if (this.pixels[offset] == null) return;
                            this.pixels[offset] = pixel;
                        }
                    };
  
                    if (!('serverId' in module.map)) Object.assign(module.map, map);
                    if (!PPClient.map) PPClient.map = map;

                    if (!PPClient.maps) PPClient.maps = {};
                    PPClient.maps[serverId] = map;
                    module.maps[serverId] = map;

                    module.callbacks.map(f => f(module, map));
                });
            }
        });
  
        return img;
    };
    Object.assign(Image, Img);
    for (let k in Img.prototype) try {Image.prototype[k] = Img.prototype[k];} catch (e) {};

    PPClient.modules.MapLoader = module;
})();
// 0vC4#7152
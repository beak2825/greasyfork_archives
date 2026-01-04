// ==UserScript==
// @name         Supaplex Online QOL Improvement
// @namespace    http://tampermonkey.net/
// @description  Reskins some of the sprites on Supaplex Online
// @version      0.283
// @author       leonid
// @match        https://*.supaplex.online/play/*
// @match        https://*.supaplex.online/test/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470315/Supaplex%20Online%20QOL%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/470315/Supaplex%20Online%20QOL%20Improvement.meta.js
// ==/UserScript==

const SO_QOL_PATCH = () => {
    /**
      Works best with original color theme.
      This is for my personal use, so there may be changes you do not like.
      - Background music disabled
      - Reduces sound for explosions, electrons, and bugs
      - Bug tiles are colored purple
      - Bug tiles turn red when they would kill Murphy by the time he arrives them
      - Bug tiles show a yellow bar when they are soon to be red
      - Invisible walls are fully revealed
      - Electrons are displayed as blue snik-snaks
      - Special ports are color-coded: R (Gravity) + G (Freeze Zonks) + B (Freeze Enemies)
      - SO-exclusive special ports are text-coded: O (On), X (Off), ! (Toggle), = (No change)
      - Toggle with Number 2 key to always see text-coded special ports.
      - Shows number of infotrons and electrons currently in the level.
      - Hides large explosion clouds
      - Shows cycle numbers for snik-snaks, electrons, and red disks (Toggle with Number 1 key)
    */
    let infotronCount = 0;
    let electronCount = 0;
    const hudupdate = hud.update;
    hud.update = () => {
        hudupdate();
        let t = $(hud.nodes.infotrons).text();
        $(hud.nodes.infotrons).text(t.replace(/\/.+|$/, `/${infotronCount}(${electronCount})`));
        $(hud.nodes.infotrons).parent().removeClass('input-3digits');
    };
    let alwaysShowPortText = 0;
    document.body.addEventListener('keydown', function(e) {
        if (e.key === '2') {
            alwaysShowPortText = !alwaysShowPortText;
        }
    });
    let showCycleNumbers = 0;
    document.body.addEventListener('keydown', function(e) {
        if (e.key === '1') {
            showCycleNumbers = !showCycleNumbers;
        }
    });

    Supaplex.prototype.getReady = function(skip_recorder, skip_audio) {
        ////////// EDIT START /////////
        soundboard.sounds.shockwave.base_volume = 0.1;
        soundboard.sounds.explosion.base_volume = 0.1;
        soundboard.sounds.electron.base_volume = 0.1;
        soundboard.sounds.bug.base_volume = 0.1;
        soundboard.sounds.bug_inactive.base_volume = 0.1;
        skip_audio = 1;
        ////////// EDIT END ///////////
        this.getModelReady();
        this.getViewReady();
        this.getRetroReady();
        if (!this.controller_ready) {
            this.resetDrawing()
        }
        this.paint()
    }

    Supaplex.prototype.drawBugBase = (function() {
        var tile_width;
        var tile_padding;
        var tile_padded;
        var cut_up, cut_down, cut_left, cut_right;
        var icut;
        var ccut;
        var gfx;
        var gradient;
        const makeBaseH = (function(steps) {
            var temp_canvas, temp_ctx;
            var image_data, data;
            var r, g, b;
            var i;
            var source_row_h;
            var target_row_h;
            var temp_canvas_row_h;
            return function(gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float) {
                if (!temp_canvas) {
                    temp_canvas = document.createElement('canvas');
                    temp_ctx = temp_canvas.getContext('2d', {
                        colorSpace: "display-p3"
                    })
                }
                source_row_h = source_tile_width * (1 + 2 * tile_padding_float);
                target_row_h = target_tile_width * (1 + 2 * tile_padding_float);
                canvas.width = target_width;
                canvas.height = 2 * target_row_h;
                temp_canvas.width = target_width;
                temp_canvas.height = target_row_h;
                temp_ctx.clearRect(0, 0, target_width, target_row_h);
                ctx.save();
                if (0 || this.color_plate_gradient) {
                    gradient = ctx.createLinearGradient(target_row_h, 0, 0, target_row_h)
                    gradient.addColorStop(0.25 / 1.5, 'color( display-p3 ' + (0x37 / 0xff) + ' ' + (0x7c / 0xff) + ' ' + (0x50 / 0xff) + ' )');
                    gradient.addColorStop(1.25 / 1.5, 'color( display-p3 ' + (0x19 / 0xff) + ' ' + (0x3f / 0xff) + ' ' + (0x29 / 0xff) + ' )');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, target_row_h, target_row_h);
                    for (i = 1; i < 7; ++i) {
                        ctx.drawImage(canvas, 0, 0, target_row_h, target_row_h, i * target_row_h, 0, target_row_h, target_row_h)
                    }
                } else {
                    ctx.fillStyle = this.color_plate_p3;
                    ctx.fillRect(0, 0, target_width, target_row_h)
                }
                ctx.restore();
                temp_ctx.save();
                if (0 || this.color_pathways_gradient) {
                    gradient = temp_ctx.createLinearGradient(target_row_h, 0, 0, target_row_h)
                    gradient.addColorStop(0.25 / 1.5, 'color( display-p3 ' + (0x24 / 0xff) + ' ' + (0x58 / 0xff) + ' ' + (0x33 / 0xff) + ' )');
                    gradient.addColorStop(1.25 / 1.5, 'color( display-p3 ' + (0x49 / 0xff) + ' ' + (0xa2 / 0xff) + ' ' + (0x5e / 0xff) + ' )');
                    temp_ctx.fillStyle = gradient;
                    temp_ctx.fillRect(0, 0, target_row_h, target_row_h);
                    for (i = 1; i < 7; ++i) {
                        temp_ctx.drawImage(temp_canvas, 0, 0, target_row_h, target_row_h, i * target_row_h, 0, target_row_h, target_row_h)
                    }
                } else {
                    temp_ctx.fillStyle = this.color_pathways_p3;
                    temp_ctx.fillRect(0, 0, target_width, target_row_h)
                }

                ////////// EDIT START /////////
                temp_ctx.fillStyle = '#FF00FF';
                temp_ctx.fillRect(target_tile_width * tile_padding_float, target_tile_width * tile_padding_float, target_tile_width, target_tile_width);
                ////////// EDIT END ///////////

                temp_ctx.restore();
                temp_ctx.save();
                temp_ctx.globalCompositeOperation = 'destination-in';
                temp_ctx.drawImage(gfx, 0, 0, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, target_width, target_row_h);
                temp_ctx.restore();
                ctx.save();
                i = (target_tile_width / 256);
                if (1 || this.color_pathways_shadow) {
                    ctx.filter = 'drop-shadow( -' + (2 * i) + 'px ' + (2 * i) + 'px ' + (1 * i) + 'px rgba(0,0,0,0.25)  ) drop-shadow( ' + (1 * i) + 'px -' + (1 * i) + 'px ' + (1 * i) + 'px rgba(0,0,0,0.25) )'
                }
                ctx.drawImage(temp_canvas, 0, 0, target_width, target_row_h, 0, 0, target_width, target_row_h);
                ctx.restore();
                ctx.save();
                if (1 || this.color_base_decorations_shadow) {
                    i = (target_tile_width / 256);
                    ctx.filter = 'drop-shadow( ' + (1 * i) + 'px ' + (1 * i) + 'px ' + (1 * i) + 'px rgba(0,0,0,0.75) )'
                }
                ctx.drawImage(gfx, 0, source_row_h, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, target_width, target_row_h);
                ctx.restore();
                temp_ctx.clearRect(0, 0, target_width, target_row_h);
                temp_ctx.save();
                for (i = 0; i < 7; ++i) {
                    temp_ctx.drawImage(canvas, 0, 0, target_row_h, target_row_h, i * target_row_h, 0, target_row_h, target_row_h)
                }
                temp_ctx.restore();
                temp_ctx.save();
                temp_ctx.globalCompositeOperation = 'destination-in';
                temp_ctx.drawImage(gfx, 0, 2 * source_row_h, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, target_width, target_row_h);
                temp_ctx.restore();

                ////////// EDIT START /////////
                ctx.save();
                if (steps == 0) {
                    ctx.fillStyle = 'rgba(85,0,0,0.8)';
                    ctx.fillRect(target_tile_width * tile_padding_float, target_tile_width * tile_padding_float, target_tile_width, target_tile_width);
                } else if (steps <= 16) {
                    const timer = 16 - steps;
                    const timerHeight = target_tile_width * timer / 16;
                    ctx.fillStyle = 'rgba(255,255,0,0.5)';
                    ctx.fillRect(target_tile_width * tile_padding_float, target_tile_width * (1 + tile_padding_float) - timerHeight, target_tile_width, timerHeight);
                }
                ctx.restore();
                ////////// EDIT END ///////////

                ctx.drawImage(temp_canvas, 0, 0, target_width, target_row_h, 0, target_row_h, target_width, target_row_h)
            }
        }
        );
        var i, temp_tile;
        return function(ix, iy, cx, cy, direction, seq, si) {
            ////////// EDIT START /////////
            const framesUntilMurphyFinishes = (dxPos != MurphyPosIndex && dx2 == -1) || SeqPos ? dx1SequenceLength - SeqPos : 0;
            let murphyX = GetX(MurphyPosIndex);
            let murphyY = GetY(MurphyPosIndex);
            const dxPosX = GetX(dxPos);
            const dxPosY = GetY(dxPos);
            if (framesUntilMurphyFinishes > 0 && (dxPosX + MurphyDX / 2 != murphyX || dxPosY + MurphyDY / 2 != murphyY)) {
                murphyX += MurphyDX / 2;
                murphyY += MurphyDY / 2;
            }
            const bugX = GetX(si);
            const bugY = GetY(si);
            const distance = Math.abs(murphyX - bugX) + Math.abs(murphyY - bugY) - 1;
            const framesUntilReachingBug = framesUntilMurphyFinishes + distance * 8;
            const numberOfBugStepAdvances = Math.floor(framesUntilReachingBug / 4) + ((TimerVar - 1) % 4 + framesUntilReachingBug % 4 > 3);

            let steps = -SgnHighByte( PlayField16[ si ] ) - numberOfBugStepAdvances;
            if (steps <= -14) {
                steps = 999; // Murphy arrives after bug finishes
            } else if (steps <= 0) {
                steps = 0; // Lethal by the time Murphy arrives
            } else if (steps <= 16) {
                // Lethal after 16 or fewer steps
            } else {
                steps = 999; // Murphy arrives before bug activates
            }
            const makeBase = makeBaseH(steps);
            makeBase.h = makeBaseH;
            makeBase.i = steps;

            tile_width = 256;
            if (!this.gfx.base[steps]) {
                this.gfx.base[steps] = this.gfx.base.cloneNode(true);
                this.gfx.base[steps].cache_key = `base[${steps}]`;
            }
            gfx = this.drawImageCacheAsync(this.gfx.base[steps], tile_width, this.tile, 0.25, makeBase);
            if (gfx) {
                temp_tile = this.tile;
                for (i = 16; i <= 256; i *= 2) {
                    this.tile = i;
                    this.drawImageCacheAsync(this.gfx.base[steps], tile_width, this.tile, 0.25, makeBase)
                }
                this.tile = temp_tile
            }
            ////////// EDIT END /////////
            if (cx === null)
                return;
            tile_width = this.tile;
            tile_padding = tile_width * 0.25;
            tile_padded = tile_width * 1.5;
            icut = tile_width / 8;
            ccut = this.tile / 8;
            cut_up = 0;
            cut_down = 0;
            cut_left = 0;
            cut_right = 0;
            if (direction == 1) {
                cut_down = seq
            } else if (direction == 2) {
                cut_right = seq
            } else if (direction == 3) {
                cut_up = seq
            } else if (direction == 4) {
                cut_left = seq
            }
            if (gfx === !1) {
                this.paintQueueAdd(100, !1, 0, 0, 0, 0, 0, 0, 0, 0, 1, {
                    color: getColorAverage([this.color_plate, this.color_pathways], [132, 124]),
                    opacity: 1,
                    x: this.view_x + cx + this.tile_padding + Math.round(cut_left * ccut),
                    y: this.view_y + cy + this.tile_padding + Math.round(cut_up * ccut),
                    w: this.tile - Math.round(cut_right * ccut) - Math.round(cut_left * ccut),
                    h: this.tile - Math.round(cut_down * ccut) - Math.round(cut_up * ccut)
                });
                return
            }
            this.paintQueueAdd(100, gfx, ix * tile_padded + tile_padding + Math.round(cut_left * icut), iy * tile_padded + tile_padding + Math.round(cut_up * icut), tile_padded - tile_padding - tile_padding - Math.round(cut_right * icut) - Math.round(cut_left * icut), tile_padded - tile_padding - tile_padding - Math.round(cut_down * icut) - Math.round(cut_up * icut), this.view_x + cx + this.tile_padding + Math.round(cut_left * ccut), this.view_y + cy + this.tile_padding + Math.round(cut_up * ccut), this.padded_tile - this.tile_padding - this.tile_padding - Math.round(cut_right * ccut) - Math.round(cut_left * ccut), this.padded_tile - this.tile_padding - this.tile_padding - Math.round(cut_down * ccut) - Math.round(cut_up * ccut))
        }
    }
    )();

    Supaplex.prototype.drawInvisibleWallImage = (function() {
        return function(ix, iy, cx, cy, padding, d256ix, d256iy) {
            ////////// EDIT START /////////
            if (!this.gfx.visible_wall) {
                this.gfx.visible_wall = new Image();
                this.gfx.visible_wall.src = 'https://i.imgur.com/ZgEeLwr.png';
                this.gfx.visible_wall.cache_key = 'visible-wall';
            }
            if (this.gfx.visible_wall.complete) {
                this.drawSimpleImage(200, this.gfx.visible_wall, ix, iy, cx, cy, undefined, undefined, undefined, {
                    color: 0x555555,
                    opacity: 1,
                    x: this.view_x + cx + this.tile / 4,
                    y: this.view_y + cy + this.tile / 4,
                    w: this.tile,
                    h: this.tile
                });
            }
            ////////// EDIT END ///////////
        }
    })();
    ////////// EDIT START /////////
    Supaplex.prototype.paintQueueAdd = function(priority, gfx, sx, sy, sw, sh, tx, ty, tw, th, opacity, rect, blending, text) {
        this.paint_queue.push({
            priority: priority,
            gfx: gfx,
            sx: sx,
            sy: sy,
            sw: sw,
            sh: sh,
            tx: tx,
            ty: ty,
            tw: tw,
            th: th,
            opacity: opacity,
            rect: rect,
            blending: blending,
            text: text,
            ////////// EDIT END ///////////
        })
    };
    Supaplex.prototype.paintQueue = (function() {
        var i;
        var compare = ( (a, b) => {
            return a.priority > b.priority ? 1 : -1
        }
        );
        var r, g, b, a;
        var fadein_opacity;
        var now;
        const initial_fadein_opacity = 0.05;
        return function() {
            this.paint_queue.sort(compare);
            for (i = 0; i < this.paint_queue.length; ++i) {
                if (this.paint_queue[i].opacity !== undefined) {
                    this.ctx.globalAlpha = this.paint_queue[i].opacity
                }
                if (this.paint_queue[i].blending !== undefined) {
                    this.ctx.globalCompositeOperation = this.paint_queue[i].blending
                }
                if (this.paint_queue[i].rect) {
                    r = (this.paint_queue[i].rect.color & 0xFF0000) >> 16;
                    g = (this.paint_queue[i].rect.color & 0x00FF00) >> 8;
                    b = (this.paint_queue[i].rect.color & 0x0000FF);
                    a = this.paint_queue[i].rect.opacity;
                    this.ctx.fillStyle = 'color(display-p3 ' + (r / 255) + ' ' + (g / 255) + ' ' + (b / 255) + ' / ' + a + ')';
                    if (this.paint_queue[i].rect.circle) {
                        this.ctx.beginPath();
                        this.ctx.arc(this.paint_queue[i].tx + this.paint_queue[i].rect.x + this.paint_queue[i].rect.w / 2, this.paint_queue[i].ty + this.paint_queue[i].rect.y + this.paint_queue[i].rect.h / 2, this.paint_queue[i].rect.w / 2, 0, 2 * Math.PI);
                        this.ctx.fill()
                    } else {
                        this.ctx.fillRect(this.paint_queue[i].tx + this.paint_queue[i].rect.x, this.paint_queue[i].ty + this.paint_queue[i].rect.y, this.paint_queue[i].rect.w, this.paint_queue[i].rect.h)
                    }
                }
                if (this.paint_queue[i].gfx) {
                    this.ctx.drawImage(this.paint_queue[i].gfx, this.paint_queue[i].sx, this.paint_queue[i].sy, this.paint_queue[i].sw, this.paint_queue[i].sh, this.paint_queue[i].tx, this.paint_queue[i].ty, this.paint_queue[i].tw, this.paint_queue[i].th)
                }
                this.ctx.fillStyle = '#000000';
                this.ctx.globalCompositeOperation = 'source-over';
                this.ctx.globalAlpha = 1
                ////////// EDIT START /////////
                if (this.paint_queue[i].text) {
                    const text = this.paint_queue[i].text;
                    this.ctx.fillStyle = text.color;
                    this.ctx.font = text.font;
                    this.ctx.textAlign = text.textAlign || 'left';
                    this.ctx.lineWidth = 5;
                    this.ctx.strokeText(text.text, this.paint_queue[i].tx, this.paint_queue[i].ty);
                    this.ctx.fillText(text.text, this.paint_queue[i].tx, this.paint_queue[i].ty);
                }
                ////////// EDIT END ///////////
            }
        }
    }
    )();

    Supaplex.prototype.drawImageCacheAsync = (function() {
        var key;
        var canvas, offscreen;
        var draw_image_cache = {};
        var cache;
        var target_width;
        var target_height;
        var thread;
        var handler_source;
        const main = function() {
            var canvas;
            var ctx;
            var gfx;
            var key;
            var bitmap;
            var target_width
            var target_height
            var source_tile_width
            var target_tile_width
            var tile_padding_float
            var target_tiles_row
            var colors;
            const document = {
                createElement: function(element) {
                    if (element == 'canvas') {
                        return new OffscreenCanvas(0,0)
                    }
                    throw new Error('wrong document.createElement call',element)
                }
            };
            const routes = {
                run: async function(data) {
                    key = data.key;
                    target_width = data.target_width;
                    target_height = data.target_height;
                    source_tile_width = data.source_tile_width;
                    target_tile_width = data.target_tile_width;
                    tile_padding_float = data.tile_padding_float;
                    target_tiles_row = data.target_tiles_row;
                    colors = data.colors;
                    if (!gfx) {
                        var response = await fetch(data.src);
                        var fileBlob = await response.blob();
                        gfx = await createImageBitmap(fileBlob)
                    }
                    if (!canvas) {
                        canvas = new OffscreenCanvas(target_width,target_height);
                        ctx = canvas.getContext('2d', {
                            colorSpace: "display-p3"
                        })
                    }
                    canvas.width = target_width;
                    canvas.height = target_height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (handler) {
                        handler.call(colors, gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float)
                    } else {
                        ctx.drawImage(gfx, 0, 0, gfx.width, gfx.height, 0, 0, target_width, target_height)
                    }
                    var bitmap = await createImageBitmap(canvas);
                    self.postMessage({
                        route: 'done',
                        key: key,
                        bitmap: bitmap
                    }, [bitmap])
                }
            };
            self.onmessage = function(event) {
                if (routes[event.data.route]) {
                    return (routes[event.data.route])(event.data)
                }
            }
        };
        const on_message = (function() {
            const routes = {
                done: window.location.search.indexOf('primitive') == -1 ? function(data) {
                    draw_image_cache[data.key].bitmap = data.bitmap;
                    draw_image_cache[data.key].ready = !0
                }
                : function(data) {}
            };
            return function(event) {
                if (routes[event.data.route]) {
                    return (routes[event.data.route])(event.data)
                }
            }
        }
        )();
        const run = function(cache) {
            cache.ready = !1;
            var colors = {};
            var regexp = /^color_/;
            colors = {};
            for (x in sp) {
                if (regexp.test(x)) {
                    colors[x] = sp[x];
                    if (Number.isInteger(sp[x])) {
                        colors[x + '_hex'] = '#' + sp[x].toString(16).padStart(6, '0');
                        colors[x + '_p3'] = 'color(display-p3 ' + (((sp[x] >> 16) & 0xFF) / 255) + ' ' + (((sp[x] >> 8) & 0xFF) / 255) + ' ' + (((sp[x]) & 0xFF) / 255) + ')'
                    }
                }
            }
            cache.thread.postMessage({
                route: 'run',
                key: cache.key,
                src: cache.gfx.src,
                colors: colors,
                target_width: cache.target_width,
                target_height: cache.target_height,
                source_tile_width: cache.source_tile_width,
                target_tile_width: cache.target_tile_width,
                tile_padding_float: cache.tile_padding_float,
                target_tiles_row: cache.target_tiles_row
            })
        }
        window.draw_image_cache_new = draw_image_cache;
        var internal_call;
        return function(gfx, source_tile_width, target_tile_width, tile_padding_float, handler, target_tiles_row, arg_target_width, arg_target_height) {
            key = gfx.cache_key;
            if (gfx.cache_key.indexOf('retro') == -1) {
                key += '-' + this.tile
            }
            if (!key) {
                throw new Error('Invaild gfx key')
            }
            cache = draw_image_cache[key];
            if (cache && !cache.ready) {
                if (cache.bitmap) {
                    return cache.bitmap
                }
                return !1
            }
            if (arg_target_width) {
                target_width = arg_target_width
            } else {
                target_width = Math.round((gfx.naturalWidth) * (target_tile_width / source_tile_width));
                if (target_tiles_row) {
                    target_width = target_tiles_row * (target_tile_width * (1 + (tile_padding_float * 2)))
                }
            }
            if (arg_target_height) {
                target_height = arg_target_height
            } else {
                target_height = Math.round((gfx.naturalHeight) * (target_tile_width / source_tile_width))
            }
            if (!cache) {
                thread = new self.IntegralCodes.JS.Thread();
                thread.setMain(main);
                thread.onMessage(on_message);
                thread.addModule(colorsH);
                handler_source = 'null';
                if (handler) {
                    if (handler.h) {
                        ////////// EDIT START /////////
                        if (handler.i !== undefined) {
                            handler_source = `(${handler.h})(${handler.i})`;
                        } else {
                            handler_source = `(${handler.h})()`;
                        }
                        ////////// EDIT END ///////////
                    } else {
                        handler_source = handler.toString()
                    }
                }
                thread.addModule('() => { self.handler= ' + handler_source + '; }');
                cache = {
                    key: key,
                    gfx: gfx,
                    bitmap: null,
                    thread: thread,
                    ready: !1,
                    target_width: target_width,
                    target_height: target_height,
                    source_tile_width: source_tile_width,
                    target_tile_width: target_tile_width,
                    tile_padding_float: tile_padding_float,
                    target_tiles_row: target_tiles_row,
                    handler: handler
                };
                draw_image_cache[key] = cache;
                thread.start();
                run(cache);
                return !1
            }
            if (!cache.ready) {
                if (cache.bitmap) {
                    return cache.bitmap
                }
                return !1
            }
            if (cache.invalid == !0 || cache.target_width !== target_width) {
                console.log('run', cache.key);
                cache.ready = !1;
                cache.invalid = !1;
                if (cache.target_width != target_width) {
                    cache.bitmap.close();
                    cache.bitmap = null
                }
                cache.target_width = target_width;
                cache.target_height = target_height;
                cache.source_tile_width = source_tile_width;
                cache.target_tile_width = target_tile_width;
                cache.tile_padding_float = tile_padding_float;
                cache.target_tiles_row = target_tiles_row;
                run(cache);
                if (cache.bitmap) {
                    return cache.bitmap
                }
                return !1
            }
            return cache.bitmap
        }
    }
    )();

    Supaplex.prototype.drawDiskImage = (function() {
        var tile_width;
        var tile_padding;
        var tile_padded;
        var gfx;
        const makeDisksH = (function() {
            var image_data, data;
            var r, g, b;
            var i;
            var source_row_h;
            var target_row_h;
            return function(gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float) {
                source_row_h = source_tile_width * (1 + 2 * tile_padding_float);
                target_row_h = target_tile_width * (1 + 2 * tile_padding_float);
                canvas.width = target_width;
                canvas.height = target_row_h * 6;
                ctx.drawImage(gfx, 0, 0, (gfx.naturalWidth || gfx.width), source_row_h * 2, 0, 0, canvas.width, target_row_h * 2);
                image_data = ctx.getImageData(0, 0, canvas.width, target_row_h * 2);
                data = image_data.data;
                r = (this.color_disks) >> 16;
                g = (this.color_disks & 0x00FF00) >> 8;
                b = (this.color_disks & 0x0000FF);
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                ctx.putImageData(image_data, 0, 0);
                ctx.drawImage(gfx, 0, source_row_h * 2, (gfx.naturalWidth || gfx.width), source_row_h * 2, 0, 0, canvas.width, target_row_h * 2);
                for (i = 0; i < 18; ++i) {
                    ctx.drawImage(canvas, 0, target_row_h, target_row_h, target_row_h, target_row_h * (i % 9), target_row_h * (2 + Math.floor(i / 9)), target_row_h, target_row_h)
                }
                ctx.drawImage(gfx, 0, source_row_h * 4, (gfx.naturalWidth || gfx.width), source_row_h * 4, 0, target_row_h * 2, canvas.width, target_row_h * 4);
                data = null;
                image_data = null
            }
        }
        );
        const makeDisks = makeDisksH();
        makeDisks.h = makeDisksH;
        var i, temp_tile;
        ////////// EDIT START /////////
        return function(priority, ix, iy, cx, cy, num) {
            tile_width = 256;
            gfx = this.drawImageCacheAsync(this.gfx.disks, tile_width, this.tile, 0.25, makeDisks);
            if (gfx === !1)
                return;
            if (gfx) {
                temp_tile = this.tile;
                for (i = 16; i <= 256; i *= 2) {
                    this.tile = i;
                    this.drawImageCacheAsync(this.gfx.disks, tile_width, this.tile, 0.25, makeDisks)
                }
                this.tile = temp_tile
            }
            if (cx === null)
                return;
            tile_width = this.tile;
            tile_padding = tile_width * 0.25;
            tile_padded = tile_width * 1.5;
            this.paintQueueAdd(200 + priority, gfx, ix * tile_padded, iy * tile_padded, tile_padded, tile_padded, this.view_x + cx, this.view_y + cy, this.padded_tile, this.padded_tile)
            if (num && showCycleNumbers) {
                this.paintQueueAdd(200 + priority + 1, gfx, 0, 0, 0, 0, this.view_x + cx + tile_width * 0.75, this.view_y + cy + tile_width * 1.15, 0, 0, undefined,
                               undefined, undefined, {color: 'white', textAlign: 'center', font: `${tile_width * 0.75}px arial`, text: `${num}`});
            }
        }
        ////////// EDIT END ///////////
    })();

    Supaplex.prototype.drawSnikSnakImage = (function() {
        var tile_width;
        var tile_padding;
        var tile_padded;
        var gfx;
        var ix, iy;
        const makeSnikSnakH = (function() {
            var image_data, data;
            var r, g, b;
            var i;
            return function(gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float) {
                canvas.width = target_width;
                canvas.height = target_height / 2;
                ctx.drawImage(gfx, 0, 0, (gfx.naturalWidth || gfx.width), (gfx.naturalHeight || gfx.height) / 2, 0, 0, canvas.width, canvas.height);
                image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                data = image_data.data;
                r = (this.color_snik_snaks) >> 16;
                g = (this.color_snik_snaks & 0x00FF00) >> 8;
                b = (this.color_snik_snaks & 0x0000FF);
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                ctx.putImageData(image_data, 0, 0);
                ctx.drawImage(gfx, 0, (gfx.naturalHeight || gfx.height) / 2, (gfx.naturalWidth || gfx.width), (gfx.naturalHeight || gfx.height) / 2, 0, 0, canvas.width, canvas.height);
                data = null;
                image_data = null
            }
        }
        );
        const makeSnikSnak = makeSnikSnakH();
        makeSnikSnak.h = makeSnikSnakH;
        var i, temp_tile;
        var subframe;
        return function(timer_var, hi, f, cx, cy, si) {
            subframe = this.subframe;
            if (SnikSnaksElectronsFrozen || si <= 0) {
                subframe = 1
            }
            if ((0x0 <= hi) && (hi <= 0x7)) {
                ix = hi * 4 + f;
                iy = 0;
                while (ix >= 16) {
                    ix -= 16;
                    ++iy
                }
            } else if ((0x8 <= hi) && (hi <= 0xf)) {
                ix = 32 - ((hi - 0x8) * 4 + f + 23);
                iy = 0;
                while (ix < 0) {
                    ix += 16;
                    ++iy
                }
                iy %= 2
            } else if ((0x10 <= hi) && (hi <= 0x17)) {
                ix = 0 + (0x17 - hi)
                iy = 2;
                cy += Math.round((0x17 - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x18 <= hi) && (hi <= 0x1f)) {
                ix = 8 + (0x1f - hi)
                iy = 2;
                cx += Math.round((0x1f - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x20 <= hi) && (hi <= 0x27)) {
                ix = 0 + (0x27 - hi)
                iy = 3;
                cy -= Math.round((0x27 - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x28 <= hi) && (hi <= 0x2f)) {
                ix = 8 + (0x2f - hi)
                iy = 3;
                cx -= Math.round((0x2f - hi + 1 - subframe) * (this.tile / 8))
            } else {
                throw new Error('Undefined SnikSnak 0x' + (hi).toString(16))
            }
            tile_width = 256;
            gfx = this.drawImageCacheAsync(this.gfx.snik_snak, tile_width, this.tile, 0.25, makeSnikSnak);
            if (gfx === !1)
                return;
            if (gfx) {
                temp_tile = this.tile;
                for (i = 16; i <= 256; i *= 2) {
                    this.tile = i;
                    this.drawImageCacheAsync(this.gfx.snik_snak, tile_width, this.tile, 0.25, makeSnikSnak)
                }
                this.tile = temp_tile
            }
            if (cx === null)
                return;
            tile_width = this.tile;
            tile_padding = tile_width * 0.25;
            tile_padded = tile_width * 1.5;
            this.paintQueueAdd(450, gfx, ix * tile_padded, iy * tile_padded, tile_padded, tile_padded, this.view_x + cx, this.view_y + cy, this.padded_tile, this.padded_tile);
            this.drawZonkImage(ix, 8, cx, cy, 0, 450 + 1, !0)

            ////////// EDIT START /////////
            if (showCycleNumbers) {
                let label;
                if (hi < 8) {
                    label = (ix + 1) % 8 + 1;
                } else if (hi < 16) {
                    label = 8 - (ix + 5) % 8;
                } else {
                    label = 8 - ix % 8;
                }
                this.paintQueueAdd(501, gfx, 0, 0, 0, 0, this.view_x + cx + tile_width * 0.85, this.view_y + cy + tile_width * 1.25, 0, 0, undefined,
                                   undefined, undefined, {color: 'orange', font: `${tile_width * 0.75}px arial`, text: `${label}`});
            }
            ////////// EDIT END ///////////
        }
    }
    )();

    Supaplex.prototype.drawElectronImage = (function() {
        ////////// EDIT START /////////
        var tile_width;
        var tile_padding;
        var tile_padded;
        var gfx;
        var ix, iy;
        const makeElectronH = (function() {
            var image_data, data;
            var r, g, b;
            var i;
            return function(gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float) {
                canvas.width = target_width;
                canvas.height = target_height / 2;
                ctx.drawImage(gfx, 0, 0, (gfx.naturalWidth || gfx.width), (gfx.naturalHeight || gfx.height) / 2, 0, 0, canvas.width, canvas.height);
                ctx.drawImage(gfx, 0, (gfx.naturalHeight || gfx.height) / 2, (gfx.naturalWidth || gfx.width), (gfx.naturalHeight || gfx.height) / 2, 0, 0, canvas.width, canvas.height);
                image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                data = image_data.data;
                const color = 0x00AAFF;
                r = (color) >> 16;
                g = (color & 0x00FF00) >> 8;
                b = (color & 0x0000FF);
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                ctx.putImageData(image_data, 0, 0);
                data = null;
                image_data = null
            }
        }
        );
        const makeElectron = makeElectronH();
        makeElectron.h = makeElectronH;
        var i, temp_tile;
        var subframe;
        return function(timer_var, hi, f, cx, cy, si) {
            subframe = this.subframe;
            if (SnikSnaksElectronsFrozen || si <= 0) {
                subframe = 1
            }
            if ((0x0 <= hi) && (hi <= 0x7)) {
                ix = hi * 4 + f;
                iy = 0;
                while (ix >= 16) {
                    ix -= 16;
                    ++iy
                }
            } else if ((0x8 <= hi) && (hi <= 0xf)) {
                ix = 32 - ((hi - 0x8) * 4 + f + 23);
                iy = 0;
                while (ix < 0) {
                    ix += 16;
                    ++iy
                }
                iy %= 2
            } else if ((0x10 <= hi) && (hi <= 0x17)) {
                ix = 0 + (0x17 - hi)
                iy = 2;
                cy += Math.round((0x17 - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x18 <= hi) && (hi <= 0x1f)) {
                ix = 8 + (0x1f - hi)
                iy = 2;
                cx += Math.round((0x1f - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x20 <= hi) && (hi <= 0x27)) {
                ix = 0 + (0x27 - hi)
                iy = 3;
                cy -= Math.round((0x27 - hi + 1 - subframe) * (this.tile / 8))
            } else if ((0x28 <= hi) && (hi <= 0x2f)) {
                ix = 8 + (0x2f - hi)
                iy = 3;
                cx -= Math.round((0x2f - hi + 1 - subframe) * (this.tile / 8))
            } else {
                throw new Error('Undefined Electron 0x' + (hi).toString(16))
            }
            tile_width = 256;
            if (!this.gfx.blue_snik_snak) {
                this.gfx.blue_snik_snak = this.gfx.snik_snak.cloneNode(true);
                this.gfx.blue_snik_snak.cache_key = 'electron';
            }
            gfx = this.drawImageCacheAsync(this.gfx.blue_snik_snak, tile_width, this.tile, 0.25, makeElectron);
            if (gfx === !1)
                return;
            if (gfx) {
                temp_tile = this.tile;
                for (i = 16; i <= 256; i *= 2) {
                    this.tile = i;
                    this.drawImageCacheAsync(this.gfx.blue_snik_snak, tile_width, this.tile, 0.25, makeElectron)
                }
                this.tile = temp_tile
            }
            if (cx === null)
                return;
            tile_width = this.tile;
            tile_padding = tile_width * 0.25;
            tile_padded = tile_width * 1.5;
            this.paintQueueAdd(450, gfx, ix * tile_padded, iy * tile_padded, tile_padded, tile_padded, this.view_x + cx, this.view_y + cy, this.padded_tile, this.padded_tile);
            this.drawZonkImage(ix, 8, cx, cy, 0, 450 + 1, !0)

            if (showCycleNumbers) {
                let label;
                if (hi < 8) {
                    label = (ix + 1) % 8 + 1;
                } else if (hi < 16) {
                    label = 8 - (ix + 5) % 8;
                } else {
                    label = 8 - ix % 8;
                }
                this.paintQueueAdd(501, gfx, 0, 0, 0, 0, this.view_x + cx + tile_width * 0.85, this.view_y + cy + tile_width * 1.25, 0, 0, undefined,
                                   undefined, undefined, {color: 'orange', font: `${tile_width * 0.75}px arial`, text: `${label}`});
            }
        }
        ////////// EDIT END ///////////
    })();

    Supaplex.prototype.drawPortImage = (function() {
        var tile_width;
        var tile_padding;
        var tile_padded;
        var gfx;
        ////////// EDIT START /////////
        function getSpecialValuesFromDb(si) {
            for (let specialPortType of use_port_database) {
                if (si == specialPortType.y * sp.columns + specialPortType.x) {
                    return [specialPortType.g, specialPortType.z, specialPortType.e];
                }
            }
            return undefined;
        }
        function getSpecialValuesFromHeader(si) {
            for (let i = 0; i < native_sp_level.header.SpecialPortCount; i++) {
                let specialPortType = native_sp_level.header.SpecialPort[i];
                if (si * 2 == specialPortType.PortLocation) {
                    return [specialPortType.Gravity, specialPortType.FreezeZonks, specialPortType.FreezeEnemies];
                }
            }
            return undefined;
        }
        function getSpecialValues(si) {
            if (!HighByte(PlayField16[si])) {
                return undefined;
            }
            return use_port_database ? getSpecialValuesFromDb(si) : getSpecialValuesFromHeader(si);
        }
        function getSpecialColors(specialValues) {
            if (specialValues === undefined) {
                return [-1, -1];
            }
            return [(specialValues[0] != 0) * 0xFF0000 | (specialValues[1] != 0) * 0xFF00 | (specialValues[2] != 0) * 0xFF, 0xFFFFFF];
        }
        function getSpecialText(specialValues) {
            if (specialValues === undefined) {
                return '';
            }
            let showText = alwaysShowPortText;
            let text = '';
            for (let i = 0; i < 3; i++) {
                if (specialValues[i] === 0) {
                    text += 'X';
                } else if (specialValues[i] === 1 + i % 2) {
                    text += 'O';
                } else if (specialValues[i] === -1) {
                    showText = true;
                    text += '=';
                } else if (specialValues[i] === -2) {
                    showText = true;
                    text += '!';
                } else {
                    showText = true;
                    text += '?';
                }
            }
            return showText ? text : '';
        }
        ////////// EDIT END ///////////
        const makePortsH = (function(specialColors) {
            var temp_canvas, temp_ctx;
            var image_data, data;
            var r, g, b;
            var i;
            var temp_canvas_row_h;
            var source_row_h;
            var target_row_h;
            return function(gfx, source_tile_width, target_tile_width, canvas, ctx, target_width, target_height, tile_padding_float) {
                if (!temp_canvas) {
                    temp_canvas = document.createElement('canvas');
                    temp_ctx = temp_canvas.getContext('2d', {
                        colorSpace: "display-p3"
                    })
                }
                source_row_h = source_tile_width * (1 + 2 * tile_padding_float);
                target_row_h = target_tile_width * (1 + 2 * tile_padding_float);
                canvas.width = target_width;
                canvas.height = target_row_h * 2;
                temp_canvas.width = target_width;
                temp_canvas.height = target_row_h;
                temp_ctx.drawImage(gfx, 0, 0, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, temp_canvas.width, target_row_h);
                image_data = temp_ctx.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
                data = image_data.data;
                r = (this.color_ports_segments) >> 16;
                g = (this.color_ports_segments & 0x00FF00) >> 8;
                b = (this.color_ports_segments & 0x0000FF);
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                temp_ctx.putImageData(image_data, 0, 0);
                ctx.drawImage(temp_canvas, 0, 0, temp_canvas.width, target_row_h, 0, 0, temp_canvas.width, target_row_h);
                image_data = temp_ctx.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
                data = image_data.data;
                ////////// EDIT START /////////
                let [segmentColor, sideColor] = specialColors;
                if (segmentColor < 0) {
                    segmentColor = this.color_ports_special_segments;
                }
                r = (segmentColor) >> 16;
                g = (segmentColor & 0x00FF00) >> 8;
                b = (segmentColor & 0x0000FF);
                ////////// EDIT END ///////////
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                temp_ctx.putImageData(image_data, 0, 0);
                ctx.drawImage(temp_canvas, 0, 0, temp_canvas.width, target_row_h, 0, target_row_h, temp_canvas.width, target_row_h);
                temp_ctx.clearRect(0, 0, temp_canvas.width, temp_canvas.height);
                temp_ctx.drawImage(gfx, 0, source_row_h, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, temp_canvas.width, target_row_h);
                image_data = temp_ctx.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
                data = image_data.data;

                ////////// EDIT START /////////
                if (sideColor < 0) {
                    sideColor = this.color_ports_sides;
                }
                r = (sideColor) >> 16;
                g = (sideColor & 0x00FF00) >> 8;
                b = (sideColor & 0x0000FF);
                ////////// EDIT END ///////////
                for (i = 0; i < data.length; i += 4) {
                    if (data[i + 3]) {
                        data[i + 0] = r;
                        data[i + 1] = g;
                        data[i + 2] = b
                    }
                }
                temp_ctx.putImageData(image_data, 0, 0);
                ctx.drawImage(temp_canvas, 0, 0, temp_canvas.width, target_row_h, 0, 0, temp_canvas.width, target_row_h);
                ctx.drawImage(temp_canvas, 0, 0, temp_canvas.width, target_row_h, 0, target_row_h, temp_canvas.width, target_row_h);
                ctx.drawImage(gfx, 0, source_row_h * 2, (gfx.naturalWidth || gfx.width), source_row_h, 0, 0, temp_canvas.width, target_row_h);
                ctx.drawImage(gfx, 0, source_row_h * 2, (gfx.naturalWidth || gfx.width), source_row_h, 0, target_row_h, temp_canvas.width, target_row_h);
                data = null;
                image_data = null
            }
        });
        var i, temp_tile;
        return function(ix, iy, cx, cy, si) {
            tile_width = 256;
            ////////// EDIT START /////////
            let specialValues = getSpecialValues(si);
            let colors = getSpecialColors(specialValues);
            const makePorts = makePortsH(colors);
            makePorts.h = makePortsH;
            makePorts.i = `[${colors}]`
            if (!this.gfx.ports[colors]) {
                this.gfx.ports[colors] = this.gfx.ports.cloneNode(true);
                this.gfx.ports[colors].cache_key = `ports[${colors}]`;
            }
            gfx = this.drawImageCacheAsync(this.gfx.ports[colors], tile_width, this.tile, 0.25, makePorts);
            ////////// EDIT END ///////////
            if (gfx === !1)
                return;
            if (gfx) {
                temp_tile = this.tile;
                for (i = 16; i <= 256; i *= 2) {
                    this.tile = i;
                    this.drawImageCacheAsync(this.gfx.ports[colors], tile_width, this.tile, 0.25, makePorts)
                }
                this.tile = temp_tile
            }
            if (cx === null)
                return;
            tile_width = this.tile;
            tile_padding = tile_width * 0.25;
            tile_padded = tile_width * 1.5;
            this.paintQueueAdd(100, gfx, ix * tile_padded, iy * tile_padded, tile_padded, tile_padded, this.view_x + cx, this.view_y + cy, this.padded_tile, this.padded_tile);
            ////////// EDIT START /////////
            let label = getSpecialText(specialValues);
            this.paintQueueAdd(501, gfx, 0, 0, 0, 0, this.view_x + cx + tile_width * 0.33, this.view_y + cy + tile_width * 0.9, 0, 0, undefined,
                               undefined, undefined, {color: 'white', font: `${tile_width * 0.5}px monospace`, text: `${label}`});
            ////////// EDIT END ///////////
        }
    }
    )();

    const getTimestamp = function() {
        return new Date().getTime()
    };
    const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || function(f) {
        return window.setTimeout(f, 1000 / 60)
    };
    const timestamps_filter = function(a) {
        return getTimestamp() - a < 1000
    };
    Supaplex.prototype.paint = (function() {
        var row, column, si, ix, iy, cx, cy, hi, lo, f, f2, murphy_hi = 0, murphy_lo, padding;
        var key, effect, visible;
        const paint_pushing = function(arg_dxPos) {
            if ((SeqPos) && ([aniPushLeft, aniPushRight].indexOf(dx2) !== -1)) {
                if ((si == dxPos) || (si == arg_dxPos)) {
                    if (MurphyDX) {
                        cx += Math.round(Math.sign(MurphyDX) * (SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength))
                    } else if (MurphyDY) {
                        cy += Math.round(Math.sign(MurphyDY) * (SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength))
                    }
                    return !0
                } else if ((SeqPos == 8) && (((dx2 == aniPushLeft) && (MurphyDX < 0) && (si + 1 == dxPos)) || ((dx2 == aniPushRight) && (MurphyDX > 0) && (si - 1 == dxPos)) || ((dx1 == aniYellowDisk) && (MurphyDY < 0) && (si + FieldWidth == dxPos)) || ((dx1 == aniYellowDisk) && (MurphyDY > 0) && (si - FieldWidth == dxPos)))) {
                    if (MurphyDX) {
                        cx += Math.round(Math.sign(MurphyDX) * (-1 + this.subframe) * (this.tile / dx1SequenceLength))
                    } else if (MurphyDY) {
                        cy += Math.round(Math.sign(MurphyDY) * (-1 + this.subframe) * (this.tile / dx1SequenceLength))
                    }
                }
            }
            return !1
        };
        var paint_infotron_being_snapped_direction;
        const paint_infotron_being_snapped = function(direction) {
            paint_infotron_being_snapped_direction = direction;
            iy = 2;
            ix = SeqPos - 1;
            cx = (column + (direction == 2 ? -1 : (direction == 4 ? 1 : 0))) * this.tile - this.tile_padding;
            cy = (row + (direction == 1 ? -1 : (direction == 3 ? 1 : 0))) * this.tile - this.tile_padding;
            this.drawInfotronImage(ix, iy, cx, cy, si)
        }
        const paint_infotron_being_eaten = function() {
            this.drawInfotronImage(SeqPos - 1, 1, cx, cy, si)
        }
        const paint_red_disk_being_eaten = function() {
            ix = SeqPos + 1;
            iy = 0;
            if (Allow9FrameRedDiskRightBug && (SeqPos == 0)) {
                ix += 1
            }
            this.drawDiskImage(0, ix, iy, cx, cy)
        }
        const paint_murphy_moving_left = function() {
            iy = 1;
            ix = SeqPos - 1;
            cx += this.tile - Math.round((SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
            if (murphy_blinking()) {
                iy += 1
            }
            this.drawMurphyImage(ix, iy, cx, cy);
            ix = 7;
            iy = 1;
            paint_save_murphy_moving.call(this)
        }
        const paint_murphy_moving_right = function() {
            iy = 1;
            ix = 7 + SeqPos;
            if (Allow9FrameRedDiskRightBug && (SeqPos == 0)) {
                ix += 1
            }
            cx += -this.tile + Math.round(Math.max(0, SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
            if (murphy_blinking()) {
                iy += 1
            }
            this.drawMurphyImage(ix, iy, cx, cy);
            ix = 15;
            iy = 1;
            paint_save_murphy_moving.call(this)
        }
        const paint_murphy_moving_up = function() {
            iy = 0;
            ix = 4 + 2;
            cy += this.tile - Math.round(((SeqPos - 1 + this.subframe)) * (this.tile / dx1SequenceLength))
            paint_save_murphy_moving.call(this);
            if (murphy_blinking()) {
                ix += 1
            }
            this.drawMurphyImage(ix, iy, cx, cy)
        }
        const paint_murphy_moving_down = function() {
            iy = 0;
            ix = 8 + 2;
            if (murphy_falling_because_of_gravity) {
                ix = 13 + 2
            } else if (murphy_blinking()) {
                ix += 1
            }
            cy += -this.tile + Math.round(((SeqPos - 1 + this.subframe)) * (this.tile / dx1SequenceLength))
            paint_save_murphy_moving.call(this);
            this.drawMurphyImage(ix, iy, cx, cy)
        }
        const paint_save_murphy_moving = function(arg_i) {
            if (si !== MurphyPosIndex)
                return;
            if (arg_i === undefined)
                arg_i = 12;
            this.view_murphy_last_moving_i = arg_i;
            this.view_murphy_last_moving_ix = ix;
            this.view_murphy_last_moving_iy = iy
        }
        const murphy_blinking = (function() {
            var blink = -1;
            return function() {
                if (TimerVar - blink < -200) {
                    blink = -1
                }
                if (blink < TimerVar) {
                    if (Math.random() < 0.20) {
                        blink = TimerVar + 35 + Math.floor(Math.random() * 16)
                    } else {
                        blink = TimerVar + 150 + Math.floor(Math.random() * 51)
                    }
                }
                return blink - TimerVar <= 8
            }
        }
        )();
        const paint_static_murphy = (function() {
            var last_TimerVar_decrement = -1;
            var trapped_count;
            var danger_direction;
            var d;
            return function() {
                if (SeqPos) {
                    if ([aniMurphyMoveUpLeft, aniMurphyMoveUpRight, aniMurphyDigUpLeft, aniMurphyDigUpRight, aniMurphyEatUpLeft, aniMurphyEatUpRight].indexOf(dx1) !== -1) {
                        if (MurphyDY < 0)
                            d = 1;
                        else
                            d = 3;
                        if ([aniMurphyDigUpLeft, aniMurphyDigUpRight].indexOf(dx1) !== -1) {
                            this.drawBaseImage(0, 0, cx, cy, d, SeqPos - 1 + this.subframe)
                        }
                        cy += -Math.sign(MurphyDY) * Math.round((1 - this.subframe) * (this.tile / dx1SequenceLength))
                    } else if ([aniEatInfotronLeft, aniMurphyMoveLeft, aniMurphyDigLeft, aniMurphyEatLeft].indexOf(dx1) !== -1) {
                        if (dx1 == aniMurphyDigLeft) {
                            this.drawBaseImage(0, 0, cx, cy, 2, SeqPos - 1 + this.subframe)
                        }
                        cx += Math.round((1 - this.subframe) * (this.tile / dx1SequenceLength))
                    } else if ([aniEatInfotronRight, aniMurphyMoveRight, aniMurphyDigRight, aniMurphyEatRight].indexOf(dx1) !== -1) {
                        if (dx1 == aniMurphyDigRight) {
                            this.drawBaseImage(0, 0, cx, cy, 4, SeqPos - 1 + this.subframe)
                        }
                        cx -= Math.round((1 - this.subframe) * (this.tile / dx1SequenceLength))
                    } else if ([aniYellowDisk, aniOrangeDisk, aniZonkRollLeft, aniZonkRollRight].indexOf(dx1) !== -1) {
                        if (MurphyDX) {
                            cx += -Math.sign(MurphyDX) * Math.round((1 - this.subframe) * (this.tile / dx1SequenceLength))
                        } else if (MurphyDY) {
                            cy += -Math.sign(MurphyDY) * Math.round((1 - this.subframe) * (this.tile / dx1SequenceLength))
                        }
                    }
                }
                if (this.view_murphy_last_moving_i != 0) {
                    if (this.view_murphy_last_moving_i > 0) {
                        if (TimerVar != last_TimerVar_decrement) {
                            --this.view_murphy_last_moving_i;
                            last_TimerVar_decrement = TimerVar
                        }
                    }
                    ix = this.view_murphy_last_moving_ix;
                    iy = this.view_murphy_last_moving_iy;
                    if (murphy_blinking()) {
                        if (ix == 0 && iy == 0) {
                            ++ix
                        } else if (iy == 1) {
                            ++iy
                        } else if (iy == 0 && [6, 8, 10, 12].indexOf(ix) !== -1) {
                            ++ix
                        }
                    }
                    return !0
                } else {
                    if (YawnSleepCounter < yawns[0]) {
                        trapped_count = 0;
                        if (trapped_count == 4) {
                            ix = 7;
                            iy = 4;
                            if (murphy_blinking()) {
                                iy = 0;
                                ix = 1
                            }
                        } else {
                            danger_direction = 0;
                            if (danger_direction) {
                                iy = 4;
                                switch (danger_direction) {
                                case 1:
                                    {
                                        ix = 8;
                                        break
                                    }
                                case 2:
                                    {
                                        ix = 9;
                                        iy = 4;
                                        break
                                    }
                                case 3:
                                    {
                                        ix = 10;
                                        iy = 4;
                                        break
                                    }
                                case 4:
                                    {
                                        ix = 11;
                                        iy = 4;
                                        break
                                    }
                                }
                                if (murphy_blinking()) {
                                    iy = 0;
                                    ix = 1
                                }
                            } else {
                                ix = 0;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix = 1
                                }
                            }
                        }
                    } else if (YawnSleepCounter < yawns[0] + yawn_frames * yawn_frame_delay) {
                        ix = 0 + Math.floor((YawnSleepCounter - yawns[0]) / yawn_frame_delay);
                        iy = 3
                    } else if (YawnSleepCounter < yawns[1]) {
                        ix = 11;
                        iy = 3;
                        if (murphy_blinking()) {
                            ++ix
                        }
                    } else if (YawnSleepCounter < yawns[1] + yawn_frames * yawn_frame_delay) {
                        ix = 0 + Math.floor((YawnSleepCounter - yawns[1]) / yawn_frame_delay);
                        iy = 3
                    } else if (YawnSleepCounter < yawns[2]) {
                        ix = 11;
                        iy = 3;
                        if (murphy_blinking()) {
                            ++ix
                        }
                    } else if (YawnSleepCounter < yawns[2] + yawn_frames * yawn_frame_delay) {
                        ix = 0 + Math.floor((YawnSleepCounter - yawns[2]) / yawn_frame_delay);
                        iy = 3
                    } else if (YawnSleepCounter < yawns[3]) {
                        ix = 11;
                        iy = 3;
                        if (murphy_blinking()) {
                            ++ix
                        }
                    } else if (YawnSleepCounter < yawns[3] + yawn_frames * yawn_frame_delay) {
                        ix = 0 + Math.floor((YawnSleepCounter - yawns[3]) / yawn_frame_delay);
                        iy = 3
                    } else {
                        if (!yawn_pillow_direction) {
                            throw new Error('Undefined pillow')
                        }
                        if (YawnSleepCounter < yawns[3] + yawn_frames * yawn_frame_delay + 35 * 2) {
                            ix = 11;
                            iy = 3;
                            if (murphy_blinking()) {
                                ++ix
                            }
                        } else {
                            iy = 3;
                            if (yawn_pillow_direction == 1) {
                                ++iy
                            }
                            if (YawnSleepCounter < yawns[3] + yawn_frames * yawn_frame_delay + 35 * 4) {
                                ix = 13
                            } else if (YawnSleepCounter < yawns[3] + yawn_frames * yawn_frame_delay + 35 * 6) {
                                ix = 14
                            } else {
                                ix = 15
                            }
                        }
                    }
                    return !1
                }
            }
        }
        )();
        const initFog = (function() {
            var fog_alpha;
            var fog_color;
            var c, cx, cy;
            return function() {
                if (this.json && this.json.fog) {
                    fog_alpha = this.json.fog;
                    fog_color = this.json.fog_color || 0x000000;
                    fog_color = getColorRGBo(fog_color);
                    this.fog_ctx.clearRect(0, 0, this.fog_canvas.width, this.fog_canvas.height);
                    this.fog_ctx.save();
                    this.fog_ctx.fillStyle = 'color( display-p3 ' + (fog_color.r / 0xff) + ' ' + (fog_color.g / 0xff) + ' ' + (fog_color.b / 0xff) + ' / ' + fog_alpha + ' )';
                    this.fog_ctx.fillRect(0, 0, this.fog_canvas.width, this.fog_canvas.height);
                    this.fog_ctx.restore();
                    c = getMurphyRealCoordinates();
                    cx = ((c.x + 0.5) * this.tile);
                    cy = ((c.y + 0.5) * this.tile);
                    this.drawLight(cx, cy, (12.5) * this.tile)
                }
            }
        }
        )();
        const finishFog = (function() {
            return function() {
                if (this.json && this.json.fog) {
                    this.ctx.drawImage(this.fog_canvas, 0, 0, this.fog_canvas.width, this.fog_canvas.height, 0, 0, this.canvas.width, this.canvas.height)
                }
            }
        }
        )();
        const getRight = function() {
            return this.x + this.w
        }
        const getBottom = function() {
            return this.y + this.h
        }
        var C = {
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            r: getRight,
            b: getBottom
        };
        var V = {
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            r: getRight,
            b: getBottom
        };
        var L = {
            w: 0,
            h: 0,
            x: 0,
            y: 0,
            r: getRight,
            b: getBottom
        };

        var left_bad, right_bad, top_bad, bottom_bad;
        var hud_height;
        var micro_left, micro_top;
        var top_beyond_buffer;
        var bottom_beyond_buffer;
        var cull_from_row = 0;
        var cull_to_row = 0;
        var cull_from_col = 0;
        var cull_to_col = 0;
        var cull_buffer = 2;
        return function() {
            if (!this.renderer)
                return;
            if (!this.canvas)
                return;
            hud_height = this.hide_hud ? 0 : Math.round(((1716 / this.html_parent.clientWidth) * 48) * window.devicePixelRatio);
            top_beyond_buffer = (7 * 60 / FieldWidth) * this.tile * (TimerVar_top_beyond / TimerVar_top_beyond_max);
            if (this.adore) {
                top_beyond_buffer = (24 * 60 / FieldWidth) * this.tile * (TimerVar_top_beyond / TimerVar_top_beyond_max)
            }
            bottom_beyond_buffer = (5 * 60 / FieldWidth) * this.tile * (TimerVar_bottom_beyond / TimerVar_bottom_beyond_max);
            C.w = this.canvas.width;
            C.h = this.canvas.height;
            C.x = 0;
            C.y = 0;
            V.w = this.html_parent.clientWidth * window.devicePixelRatio;
            V.h = this.html_parent.clientHeight * window.devicePixelRatio;
            V.w *= this.tile / this.tile_zoom;
            V.h *= this.tile / this.tile_zoom;
            V.x = C.w / 2 - V.w / 2;
            V.y = C.h / 2 - V.h / 2;
            L.w = (FieldWidth) * this.tile;
            L.h = (FieldHeight) * this.tile + hud_height * (this.tile / this.tile_zoom) + top_beyond_buffer + bottom_beyond_buffer;
            L.x = 0;
            L.y = 0;
            PaintingVar++;
            murphy_blinking();
            if (LowByte(PlayField16[MurphyPosIndex]) == fiMurphy) {
                murphy_hi = HighByte(PlayField16[MurphyPosIndex])
            }
            L.x += C.w / 2;
            L.y += C.h / 2;
            window.MurphyPosIndex_x ||= 0;
            window.MurphyPosIndex_y ||= 0;
            L.x += -((GetX(MurphyPosIndex) + 0.5 + window.MurphyPosIndex_x) * this.tile);
            L.y += -((GetY(MurphyPosIndex) + 0.5 + window.MurphyPosIndex_y) * this.tile + hud_height / 2 * (this.tile / this.tile_zoom) + +bottom_beyond_buffer / 2 + top_beyond_buffer);
            if (SeqPos) {
                L.x += Math.sign(MurphyDX) * this.tile * (1 - ((SeqPos - 1 + this.subframe) / 8));
                L.y += Math.sign(MurphyDY) * this.tile * (1 - ((SeqPos - 1 + this.subframe) / 8));
                if (SeqPos < 8) {
                    if ([aniPushLeft, aniPushRight].indexOf(dx2) !== -1) {
                        if (MurphyDY < 0) {
                            L.y += this.tile
                        } else if (MurphyDY > 0) {
                            L.y += -this.tile
                        }
                        if (MurphyDX < 0) {
                            L.x += this.tile
                        } else if (MurphyDX > 0) {
                            L.x += -this.tile
                        }
                    } else if ([0x19, 0x1b].indexOf(murphy_hi) !== -1) {
                        L.x -= Math.sign(MurphyDX) * this.tile;
                        L.x -= ((Math.sign(MurphyDX) * (Math.abs(MurphyDX / 2) - 1)) * (SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength))
                    } else if ([0x18, 0x1a].indexOf(murphy_hi) !== -1) {
                        L.y -= Math.sign(MurphyDY) * this.tile;
                        L.y -= ((Math.sign(MurphyDY) * (Math.abs(MurphyDY / 2) - 1)) * (SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength))
                    } else if (murphy_hi === 0x1c) {
                        L.y += this.tile
                    } else if (murphy_hi === 0x1e) {
                        L.y += -this.tile
                    }
                } else if (SeqPos == 8) {
                    if (dx1 == aniSplitUpDown) {
                        if (Math.abs(MurphyDY) > 2) {
                            L.y -= ((Math.sign(MurphyDY) * (Math.abs(MurphyDY / 2) - 1)) * (-1 + this.subframe) * (this.tile / dx1SequenceLength))
                        }
                    } else if ([aniMurphyMoveLeft, aniMurphyMoveRight].indexOf(dx1) !== -1) {
                        if (Math.abs(MurphyDX) > 2) {
                            L.x -= ((Math.sign(MurphyDX) * (Math.abs(MurphyDX / 2) - 1)) * (-1 + this.subframe) * (this.tile / dx1SequenceLength))
                        }
                    }
                }
            } else if ((murphy_hi == 0x1f) && (Allow9FrameRedDiskRightBug) && (SeqPos == 0)) {
                L.x += Math.sign(MurphyDX) * this.tile * (1 - (SeqPos / 8))
            }
            left_bad = V.x < L.x;
            if (left_bad) {
                L.x = V.x
            }
            right_bad = L.r() < V.r();
            if (right_bad) {
                L.x += V.r() - L.r();
                left_bad = V.x < L.x;
                if (left_bad) {
                    L.x -= (L.x - V.x) / 2
                }
            }
            top_bad = V.y < L.y;
            if (top_bad) {
                L.y = V.y
            }
            bottom_bad = L.b() < V.b();
            if (bottom_bad) {
                L.y += V.b() - L.b();
                top_bad = V.y < L.y;
                if (top_bad) {
                    L.y -= (L.y - V.y) / 2
                }
            }
            if (ExplosionShakeMurphy) {
                L.x += ((Math.random() * (4 / 16 * this.tile) - 4 / 16 * this.tile) * ExplosionShakeMurphy / 30);
                L.y += ((Math.random() * (4 / 16 * this.tile) - 4 / 16 * this.tile) * ExplosionShakeMurphy / 30)
            }
            L.y += top_beyond_buffer;
            this.view_x = Math.floor(L.x);
            this.view_y = Math.floor(L.y);
            micro_left = (L.x - this.view_x) * (this.tile_zoom / this.tile);
            this.canvas.style.left = Math.floor(micro_left / 2) + 'px';
            micro_top = (L.y - this.view_y) * (this.tile_zoom / this.tile);
            this.canvas.style.top = Math.floor(micro_top / 2) + 'px';
            initFog.apply(this);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.save();
            this.ctx.fillStyle = '#' + this.color_background.toString(16).padStart(6, '0');
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();
            this.drawEagerLoad();
            this.paint_queue = [];
            cull_from_row = (V.y - L.y) / this.tile;
            cull_to_row = cull_from_row + V.h / this.tile;
            cull_from_col = (V.x - L.x) / this.tile;
            cull_to_col = cull_from_col + V.w / this.tile;
            cull_from_row = Math.floor(cull_from_row);
            cull_to_row = Math.ceil(cull_to_row);
            cull_from_col = Math.floor(cull_from_col);
            cull_to_col = Math.ceil(cull_to_col);
            cull_from_row -= cull_buffer;
            cull_to_row += cull_buffer;
            cull_from_col -= cull_buffer;
            cull_to_col += cull_buffer;
            cull_from_row = Math.max(-Math.ceil(Playfield_preceding_buffer.length / FieldWidth), cull_from_row);
            cull_to_row = Math.min(this.rows + 5, cull_to_row);
            cull_from_col = Math.max(0, cull_from_col);
            cull_to_col = Math.min(this.columns, cull_to_col);
            window.sp_cull = {
                cull_from_row: cull_from_row,
                cull_to_row: cull_to_row,
                cull_from_col: cull_from_col,
                cull_to_col: cull_to_col
            };

            ////////// EDIT START /////////
            infotronCount = 0;
            electronCount = 0;
            for (row = 0; row < this.rows; ++row) {
                for (column = 0; column < this.columns; ++column) {
                    si = row * this.columns + column;
                    lo = LowByte(PlayField16[si]);
                    hi = HighByte(PlayField16[si]);
                    if (lo == fiInfotron) {
                        infotronCount++;
                    }
                    if (lo == fiElectron) {
                        electronCount++;
                    }
                }
            }
            ////////// EDIT END ///////////

            for (row = cull_from_row; row < cull_to_row; ++row) {
                for (column = cull_from_col; column < cull_to_col; ++column) {
                    si = row * this.columns + column;
                    if (si < -Playfield_preceding_buffer.length) {
                        continue
                    }
                    lo = LowByte(PlayField16[si]);
                    hi = HighByte(PlayField16[si]);
                    if (lo == fiSpace) {
                        if (((hi == fiOrangeDisk) || (hi == fiGreenDisk)) && (this.view_PlayField[si] >= 4) && (this.view_PlayField[si] <= 19)) {
                            iy = 4;
                            ix = this.view_PlayField[si] - 4;
                            if (ix >= 8) {
                                ++iy;
                                ix -= 8
                            }
                            cx = column * this.tile - this.tile_padding;
                            cy = row * this.tile - this.tile_padding;
                            if (this.view_PlayField[si] - 4 < 8) {
                                cy += -this.tile + Math.round((this.view_PlayField[si] - 4 + 1 - 1 + this.subframe) * (this.tile / 9))
                            } else if ((this.view_PlayField_previous_frame) && (this.view_PlayField[si] - 4 == 8) && (this.view_PlayField_previous_frame[si] - 4 == 7)) {
                                cy += -this.tile + Math.round((7 + 1 + this.subframe) * (this.tile / 9))
                            }
                            this.drawDiskImage(-1, ix, iy, cx, cy)
                        }
                    } else if ([fiZonk, fiInfotron].indexOf(lo) !== -1) {
                        ix = 0;
                        iy = 0;
                        if (si < 0) {
                            hi = 0
                        }
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (hi >= 0x10 && hi <= 0x17) {
                            if (lo == fiZonk) {
                                if ((hi == 0x10) && (PlayField16_previous_frame)) {
                                    if ([0x2701].indexOf(PlayField16_previous_frame[si - FieldWidth]) !== -1) {
                                        cx -= Math.round(this.tile / 8 * (this.subframe - 1))
                                    } else if ([0x3701].indexOf(PlayField16_previous_frame[si - FieldWidth]) !== -1) {
                                        cx += Math.round(this.tile / 8 * (this.subframe - 1))
                                    }
                                }
                            }
                            cy += Math.round(this.tile / 8 * ((hi - (0x10 - 1)) - 1 + this.subframe)) - this.tile;
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si);
                            if (lo == fiZonk) {
                                if ((PlayField16[si - FieldWidth + 1] == 0xe03) || (PlayField16[si - FieldWidth - 1] == 0xf03)) {
                                    paint_pushing.call(this, si);
                                    cy -= 1 * this.tile;
                                    cy -= (this.tile / 8 * (hi - (0x10 - 1))) - this.tile;
                                    this.drawZonkImage(ix, iy, cx, cy, si, 200 + 1)
                                }
                            }
                        } else if (hi == 0x70) {
                            if (lo == fiInfotron) {
                                if (PlayField16_previous_frame) {
                                    if ([0x2704].indexOf(PlayField16_previous_frame[si]) !== -1) {
                                        cx -= Math.round(this.tile / 8 * (this.subframe - 1))
                                    } else if ([0x3704].indexOf(PlayField16_previous_frame[si]) !== -1) {
                                        cx += Math.round(this.tile / 8 * (this.subframe - 1))
                                    }
                                }
                            }
                            cy += Math.round(this.tile / 8 * ((0x10 - (0x10 - 1)) - 1 + this.subframe));
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si)
                        } else if (hi == 0x61) {
                            f = 1;
                            cx += Math.round(this.tile / 8 * (f - 1 + (PlayField_charge[si] ? 1 : this.subframe)));
                            ix = f;
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si)
                        } else if (hi >= 0x32 && hi <= 0x37) {
                            f = hi - (0x30);
                            cx += Math.round(this.tile / 8 * (f - 1 + this.subframe)) - this.tile;
                            ix = f;
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si)
                        } else if (hi == 0x51) {
                            f = 1;
                            cx -= Math.round(this.tile / 8 * (f - 1 + (PlayField_charge[si] ? 1 : this.subframe)));
                            ix = 8 - f;
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si)
                        } else if (hi >= 0x22 && hi <= 0x27) {
                            f = hi - (0x22 - 2);
                            cx += this.tile - Math.round(this.tile / 8 * (f - 1 + this.subframe));
                            ix = 5 - (f - 3);
                            this.drawZonkOrInfotronImage(lo, ix, iy, cx, cy, si)
                        } else if (lo == fiZonk) {
                            if (paint_pushing.call(this)) {
                                if (MurphyDX > 0) {
                                    ix = SeqPos
                                } else {
                                    ix = 8 - SeqPos
                                }
                            }
                            this.drawZonkImage(ix, iy, cx, cy, si)
                        } else if (lo == fiInfotron) {
                            if (hi == 0xff) {} else {
                                this.drawInfotronImage(ix, iy, cx, cy, si)
                            }
                        }
                    } else if (lo == fiZonker) {
                        if ([0xf1, 0xf2, 0xf3].indexOf(hi) === -1) {
                            ix = 0;
                            iy = 0;
                            cx = column * this.tile;
                            cy = row * this.tile;
                            if (hi >= 0x10 && hi <= 0x17) {
                                if ((hi == 0x10) && (PlayField16_previous_frame)) {
                                    if ([0x2700 + fiZonker].indexOf(PlayField16_previous_frame[si - FieldWidth]) !== -1) {
                                        cx -= Math.round(this.tile / 8 * (this.subframe - 1))
                                    } else if ([0x3700 + fiZonker].indexOf(PlayField16_previous_frame[si - FieldWidth]) !== -1) {
                                        cx += Math.round(this.tile / 8 * (this.subframe - 1))
                                    }
                                }
                                cy += Math.round(this.tile / 8 * ((hi - (0x10 - 1)) - 1 + this.subframe)) - this.tile;
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else if (hi == 0x70) {
                                cy += Math.round(this.tile / 8 * ((0x10 - (0x10 - 1)) - 1 + this.subframe));
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else if (hi >= 0x61 && hi < (0x70)) {
                                f = hi - (0x60);
                                cx += Math.round(this.tile / 8 * (f - 1 + (PlayField_charge[si] ? 1 : this.subframe)));
                                ix = f;
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else if (hi >= 0x32 && hi <= 0x37) {
                                f = hi - (0x30);
                                cx += Math.round(this.tile / 8 * (f - 1 + this.subframe)) - this.tile;
                                ix = f;
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else if (hi >= 0x51 && hi < (0x60)) {
                                f = hi - (0x50);
                                cx -= Math.round(this.tile / 8 * (f - 1 + (PlayField_charge[si] ? 1 : this.subframe)));
                                ix = 8 - f;
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else if (hi >= 0x22 && hi <= 0x27) {
                                f = hi - (0x22 - 2);
                                cx += this.tile - Math.round(this.tile / 8 * (f - 1 + this.subframe));
                                ix = 5 - (f - 3);
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            } else {
                                this.drawZonkerImage(ix, iy, cx, cy, si)
                            }
                        }
                    } else if ((lo == fiBase) || (lo == fiBug)) {
                        ix = 0;
                        iy = 0;
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if ((si == dxPos) && (dx1 == aniTouchBase)) {
                            ix = SeqPos;
                            iy = 1
                        }
                        ////////// EDIT START /////////
                        if (lo == fiBase) {
                          this.drawBaseImage(ix, iy, cx, cy);
                        } else {
                          this.drawBugBase(ix, iy, cx, cy, 0, 0, si);
                        }
                        ////////// EDIT END ///////////
                        if (lo == fiBug && hi <= 13) {
                            ix = 0;
                            iy = 0;
                            switch (hi) {
                            case 0:
                                ix = 0;
                                break;
                            case 1:
                                ix = 1;
                                break;
                            case 2:
                                ix = 2;
                                break;
                            case 3:
                                ix = 4;
                                break;
                            case 4:
                                ix = 5;
                                break;
                            case 5:
                                ix = 6;
                                break;
                            case 6:
                                ix = 7;
                                break;
                            case 7:
                                ix = 8;
                                break;
                            case 8:
                                ix = 7;
                                break;
                            case 9:
                                ix = 6;
                                break;
                            case 10:
                                ix = 3;
                                break;
                            case 11:
                                ix = 2;
                                break;
                            case 12:
                                ix = 1;
                                break;
                            case 13:
                                ix = 0;
                                break
                            }
                            cx = column * this.tile - this.tile_padding;
                            cy = row * this.tile - this.tile_padding;
                            this.drawBugImage(ix, iy, cx, cy)
                        }
                    } else if (lo == fiMurphy) {
                        ix = 0;
                        iy = 0;
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si == MurphyPosIndex) {
                            if ([0x1, 0x5, 0x9].indexOf(hi) !== -1) {
                                if (hi == 0x1) {} else if (hi == 0x5) {
                                    this.drawBaseImage(0, 0, cx, cy, 1, SeqPos - 1 + this.subframe)
                                } else if (hi == 0x9) {
                                    paint_infotron_being_eaten.call(this)
                                }
                                paint_murphy_moving_up.call(this)
                            } else if ([0x2, 0xA].indexOf(hi) !== -1) {
                                if (hi == 0x2) {
                                    if (dx1 == aniMurphyMoveLeft) {} else if (dx1 == aniMurphyDigLeft) {
                                        this.drawBaseImage(0, 0, cx, cy, 2, SeqPos - 1 + this.subframe)
                                    }
                                } else if (hi == 0xA) {
                                    paint_infotron_being_eaten.call(this)
                                } else if (hi == 0x0) {}
                                paint_murphy_moving_left.call(this)
                            } else if ([0x3, 0x7, 0xB].indexOf(hi) !== -1) {
                                if (hi == 0x3) {
                                    if (murphy_falling_because_of_gravity) {
                                        paint_save_murphy_moving.call(this, 8)
                                    } else {
                                        paint_save_murphy_moving.call(this)
                                    }
                                } else if (hi == 0x7) {
                                    this.drawBaseImage(0, 0, cx, cy, 3, SeqPos - 1 + this.subframe);
                                    paint_save_murphy_moving.call(this)
                                } else if (hi == 0xb) {
                                    paint_infotron_being_eaten.call(this);
                                    paint_save_murphy_moving.call(this)
                                }
                                paint_murphy_moving_down.call(this)
                            } else if ([0x4, 0x8, 0xC].indexOf(hi) !== -1) {
                                if (hi == 0x4) {} else if (hi == 0x8) {
                                    this.drawBaseImage(0, 0, cx, cy, 4, SeqPos - 1 + this.subframe)
                                } else if (hi == 0xc) {
                                    paint_infotron_being_eaten.call(this)
                                }
                                paint_murphy_moving_right.call(this)
                            } else if (hi == 0x18) {
                                ix = 4 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                this.drawMurphyImage(ix, iy, cx, cy, -(SeqPos - 1 + this.subframe));
                                cy -= (Math.abs(MurphyDY / 2)) * this.tile;
                                this.drawMurphyImage(ix, iy, cx, cy, (SeqPos - 1 + this.subframe));
                                ix = 4 + 2;
                                paint_save_murphy_moving.call(this)
                            } else if (hi == 0x19) {
                                ix = 0 + SeqPos;
                                iy = 1;
                                if (murphy_blinking()) {
                                    iy += 1
                                }
                                this.drawMurphyImage(ix, iy, cx, cy, 0, -(SeqPos - 1 + this.subframe));
                                cx -= (Math.abs(MurphyDX / 2)) * this.tile;
                                this.drawMurphyImage(ix, iy, cx, cy, 0, (SeqPos - 1 + this.subframe));
                                ix = 7;
                                iy = 1;
                                paint_save_murphy_moving.call(this)
                            } else if (hi == 0x1a) {
                                ix = 8 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                this.drawMurphyImage(ix, iy, cx, cy, 0, 0, -(SeqPos - 1 + this.subframe));
                                cy += (Math.abs(MurphyDY / 2)) * this.tile;
                                this.drawMurphyImage(ix, iy, cx, cy, 0, 0, (SeqPos - 1 + this.subframe));
                                ix = 8 + 2;
                                paint_save_murphy_moving.call(this)
                            } else if (hi == 0x1b) {
                                ix = 7 + SeqPos;
                                iy = 1;
                                if (murphy_blinking()) {
                                    iy += 1
                                }
                                this.drawMurphyImage(ix, iy, cx, cy, 0, 0, 0, -(SeqPos - 1 + this.subframe));
                                cx += (Math.abs(MurphyDX / 2)) * this.tile;
                                this.drawMurphyImage(ix, iy, cx, cy, 0, 0, 0, (SeqPos - 1 + this.subframe));
                                ix = 15;
                                iy = 1;
                                paint_save_murphy_moving.call(this)
                            } else if ([0x10, 0x14, 0x20].indexOf(hi) !== -1) {
                                ix = 4 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                if (hi == 0x10) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                } else if (hi == 0x14) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy);
                                    paint_infotron_being_snapped.call(this, 1)
                                } else if (hi == 0x20) {
                                    if ((RedDiskReleasePhase != 0) && (si - FieldWidth == RedDiskReleaseMurphyPos)) {
                                        paint_static_murphy.call(this)
                                    }
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                }
                            } else if ([0x10, 0x14, 0x20, 0x11, 0x15, 0x21].indexOf(hi) !== -1) {
                                ix = 6 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                if (hi == 0x11) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                } else if (hi == 0x15) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy);
                                    paint_infotron_being_snapped.call(this, 2)
                                } else if (hi == 0x21) {
                                    if ((RedDiskReleasePhase != 0) && (si - 1 == RedDiskReleaseMurphyPos)) {
                                        paint_static_murphy.call(this)
                                    }
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                }
                            } else if ([0x12, 0x16, 0x22].indexOf(hi) !== -1) {
                                ix = 8 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                if (hi == 0x12) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                } else if (hi == 0x16) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy);
                                    paint_infotron_being_snapped.call(this, 3)
                                } else if (hi == 0x22) {
                                    if ((RedDiskReleasePhase != 0) && (si + FieldWidth == RedDiskReleaseMurphyPos)) {
                                        paint_static_murphy.call(this)
                                    }
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                }
                            } else if ([0x13, 0x17, 0x23].indexOf(hi) !== -1) {
                                ix = 10 + 2;
                                iy = 0;
                                if (murphy_blinking()) {
                                    ix += 1
                                }
                                if (hi == 0x13) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                } else if (hi == 0x17) {
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy);
                                    paint_infotron_being_snapped.call(this, 4)
                                } else if (hi == 0x23) {
                                    if ((RedDiskReleasePhase != 0) && (si + 1 == RedDiskReleaseMurphyPos)) {
                                        paint_static_murphy.call(this)
                                    }
                                    paint_save_murphy_moving.call(this);
                                    this.drawMurphyImage(ix, iy, cx, cy)
                                }
                            } else if (hi == 0x24) {
                                ix = 5;
                                iy = 0;
                                if (MurphyVarFaceLeft) {
                                    ix = 3
                                }
                                if (SeqPos) {
                                    --ix;
                                    cy -= Math.round((SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
                                    paint_save_murphy_moving.call(this)
                                } else {
                                    paint_save_murphy_moving.call(this, 0)
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if ([0xE, 0x25, 0x28].indexOf(hi) !== -1) {
                                ix = 1 + 2;
                                iy = 0;
                                if (SeqPos) {
                                    cx -= Math.round((SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
                                    paint_save_murphy_moving.call(this)
                                } else {
                                    paint_save_murphy_moving.call(this, 0)
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if ([0xF, 0x26, 0x29].indexOf(hi) !== -1) {
                                ix = 3 + 2;
                                iy = 0;
                                if (SeqPos) {
                                    cx += Math.round((SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
                                    paint_save_murphy_moving.call(this)
                                } else {
                                    paint_save_murphy_moving.call(this, 0)
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if (hi == 0x27) {
                                ix = 5;
                                iy = 0;
                                if (MurphyVarFaceLeft) {
                                    ix = 3
                                }
                                if (SeqPos) {
                                    --ix;
                                    cy += Math.round((SeqPos - 1 + this.subframe) * (this.tile / dx1SequenceLength));
                                    if (SeqPos)
                                        paint_save_murphy_moving.call(this)
                                } else {
                                    paint_save_murphy_moving.call(this, 0)
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if (hi == 0x1c) {
                                cy -= this.tile;
                                if ((RedDiskReleasePhase == 0) || (si - FieldWidth != RedDiskReleaseMurphyPos)) {
                                    paint_red_disk_being_eaten.call(this)
                                }
                                paint_murphy_moving_up.call(this)
                            } else if (hi == 0x1d) {
                                if ((RedDiskReleasePhase == 0) || (si != RedDiskReleaseMurphyPos)) {
                                    paint_red_disk_being_eaten.call(this)
                                }
                                paint_murphy_moving_left.call(this)
                            } else if (hi == 0x1e) {
                                cy += this.tile;
                                if ((RedDiskReleasePhase == 0) || (si + FieldWidth != RedDiskReleaseMurphyPos)) {
                                    paint_red_disk_being_eaten.call(this)
                                }
                                paint_murphy_moving_down.call(this)
                            } else if (hi == 0x1f) {
                                if ((RedDiskReleasePhase == 0) || (si != RedDiskReleaseMurphyPos)) {
                                    paint_red_disk_being_eaten.call(this)
                                }
                                paint_murphy_moving_right.call(this)
                            } else if (hi == 0x2a) {
                                if (RedDiskReleasePhase == 1 && MovingPictureSequencePhase <= 0x20) {
                                    ix = 12 + 2;
                                    iy = 0;
                                    this.view_murphy_last_moving_i = 0
                                } else {
                                    paint_static_murphy.call(this)
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if (hi == 0xd) {
                                iy = 0;
                                if (SeqPos <= 4) {
                                    ix = 4 + 2
                                } else if (SeqPos <= 8) {
                                    ix = 8 + 2
                                } else if (SeqPos <= 12) {
                                    ix = 10 + 2
                                } else {
                                    iy = 4;
                                    ix = Math.floor((SeqPos - 9) / 4) - 1
                                }
                                this.drawMurphyImage(ix, iy, cx, cy)
                            } else if (hi == 0) {
                                if (si == MurphyPosIndex) {
                                    if ((SeqPos == 8) && ((Math.abs(MurphyDX) > 2) || (Math.abs(MurphyDY) > 2))) {
                                        if (MurphyDX < -2) {
                                            ix = 7;
                                            iy = 1;
                                            if (murphy_blinking()) {
                                                iy += 1
                                            }
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, (7 + this.subframe));
                                            cx += (Math.abs(MurphyDX / 2)) * this.tile;
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, -(7 + this.subframe));
                                            ix = 7;
                                            iy = 1
                                        } else if (MurphyDX > 2) {
                                            ix = 7 + SeqPos;
                                            iy = 1;
                                            if (murphy_blinking()) {
                                                iy += 1
                                            }
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, 0, 0, (7 + this.subframe));
                                            cx -= (Math.abs(MurphyDX / 2)) * this.tile;
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, 0, 0, -(7 + this.subframe));
                                            ix = 7 + SeqPos;
                                            iy = 1
                                        } else if (MurphyDY < -2) {
                                            ix = 4 + 2;
                                            iy = 0;
                                            if (murphy_blinking()) {
                                                ix += 1
                                            }
                                            this.drawMurphyImage(ix, iy, cx, cy, (7 + this.subframe));
                                            cy += (Math.abs(MurphyDY / 2)) * this.tile;
                                            this.drawMurphyImage(ix, iy, cx, cy, -(7 + this.subframe));
                                            ix = 4 + 2
                                        } else if (MurphyDY > 2) {
                                            ix = 8 + 2;
                                            iy = 0;
                                            if (murphy_blinking()) {
                                                ix += 1
                                            }
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, 0, (7 + this.subframe));
                                            cy -= (Math.abs(MurphyDY / 2)) * this.tile;
                                            this.drawMurphyImage(ix, iy, cx, cy, 0, 0, -(7 + this.subframe));
                                            ix = 8 + 2
                                        }
                                        paint_save_murphy_moving.call(this)
                                    } else {
                                        if ((LowByte(PlayField16[MurphyPosIndex + (Math.sign(MurphyDY) * this.columns) + (Math.sign(MurphyDX))]) == fiTerminal)) {
                                            if (MurphyDX) {
                                                if (MurphyDX < 0) {
                                                    if ([keyLeft, keySpaceLeft].indexOf(DemoKeyCode) !== -1) {
                                                        ix = 6 + 2;
                                                        iy = 0;
                                                        paint_save_murphy_moving.call(this, 5 * 35);
                                                        if (murphy_blinking()) {
                                                            ix += 1
                                                        }
                                                    }
                                                } else {
                                                    if ([keyRight, keySpaceRight].indexOf(DemoKeyCode) !== -1) {
                                                        ix = 10 + 2;
                                                        iy = 0;
                                                        paint_save_murphy_moving.call(this, 5 * 35);
                                                        if (murphy_blinking()) {
                                                            ix += 1
                                                        }
                                                    }
                                                }
                                            } else {
                                                if (MurphyDY < 0) {
                                                    if ([keyUp, keySpaceUp].indexOf(DemoKeyCode) !== -1) {
                                                        ix = 4 + 2;
                                                        iy = 0;
                                                        paint_save_murphy_moving.call(this, 5 * 35);
                                                        if (murphy_blinking()) {
                                                            ix += 1
                                                        }
                                                    }
                                                } else {
                                                    if ([keyDown, keySpaceDown].indexOf(DemoKeyCode) !== -1) {
                                                        ix = 8 + 2;
                                                        iy = 0;
                                                        paint_save_murphy_moving.call(this, 5 * 35);
                                                        if (murphy_blinking()) {
                                                            ix += 1
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                        paint_static_murphy.call(this);
                                        this.drawMurphyImage(ix, iy, cx, cy, undefined, undefined, undefined, undefined, si);
                                        if (dx1 == aniTouchInfotron) {
                                            paint_infotron_being_snapped.call(this, paint_infotron_being_snapped_direction)
                                        }
                                    }
                                }
                            } else {
                                console.error('undefined murphy 3 ' + hi)
                            }
                        } else {
                            ix = 15;
                            iy = 4;
                            this.drawMurphyImage(ix, iy, cx, cy)
                        }
                    } else if (lo == fiRAM) {
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si < 0) {
                            f = fiRAM
                        } else {
                            f = native_sp_level.playfield[column][row]
                        }
                        switch (f) {
                        case 38:
                            {
                                f = 1;
                                break
                            }
                        case 26:
                            {
                                f = 2;
                                break
                            }
                        case 39:
                            {
                                f = 3;
                                break
                            }
                        case 27:
                            {
                                f = 4;
                                break
                            }
                        default:
                            {
                                f = 0
                            }
                        }
                        this.drawChipImage(f, cx, cy, si)
                    } else if (lo == fiHardWare) {
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si < 0) {
                            f = (hi % 10);
                            f = f == 0 ? fiHardWare : f + 28
                        } else {
                            f = native_sp_level.playfield[column][row]
                        }
                        if (f == fiHardWare) {
                            f = 0;
                            ix = 1;
                            iy = 1;
                            if (column == 0) {
                                --ix;
                                ++f
                            } else if (column == this.columns - 1) {
                                ++ix;
                                ++f
                            }
                            if (row == 0) {
                                --iy;
                                ++f
                            } else if (row == this.rows - 1) {
                                ++iy;
                                ++f
                            }
                            this.drawHardwareImage(f, ix, iy, cx, cy)
                        } else if ([29, 30, 31, 32].indexOf(f) !== -1) {
                            iy = 3;
                            switch (f) {
                            case 29:
                                {
                                    ix = 0;
                                    break
                                }
                            case 30:
                                {
                                    ix = 1;
                                    break
                                }
                            case 31:
                                {
                                    ix = 2;
                                    break
                                }
                            case 32:
                                {
                                    ix = 0;
                                    ++iy;
                                    break
                                }
                            }
                            this.drawHardwareImage(0, ix, iy, cx, cy)
                        } else {
                            iy = 0;
                            switch (f) {
                            case 28:
                                {
                                    ix = 1;
                                    break
                                }
                            case 33:
                                {
                                    ix = 2;
                                    break
                                }
                            case 34:
                                {
                                    ix = 3;
                                    break
                                }
                            case 35:
                                {
                                    ix = 4;
                                    break
                                }
                            case 36:
                                {
                                    ix = 5;
                                    break
                                }
                            case 37:
                                {
                                    ix = 6;
                                    break
                                }
                            }
                            this.drawBaseImage(ix, iy, cx, cy, !1)
                        }
                    } else if (lo == fiExit) {
                        iy = 0;
                        ix = 0;
                        if (!1 && InfotronsNeeded) {
                            ix = Math.abs(getMurphyMovement(si - 1)) + Math.abs(getMurphyMovement(si - FieldWidth)) + Math.abs(getMurphyMovement(si + 1)) + Math.abs(getMurphyMovement(si + FieldWidth)) + Math.abs(getMurphyMovement(si - 1 - FieldWidth)) + Math.abs(getMurphyMovement(si + 1 - FieldWidth)) + Math.abs(getMurphyMovement(si + 1 + FieldWidth)) + Math.abs(getMurphyMovement(si - 1 + FieldWidth))
                        }
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        this.drawExitImage(ix, iy, cx, cy)
                    } else if ([fiOrangeDisk, fiGreenDisk].indexOf(lo) !== -1) {
                        ix = 1;
                        iy = 0;
                        if (lo == fiGreenDisk) {
                            ix = 9
                        }
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (hi > 0x30) {
                            if ((PlayField16[si + 1] == 0x2803) || (PlayField16[si - 1] == 0x2903)) {
                                paint_pushing.call(this)
                            } else {
                                cy += Math.round(this.tile / 8 * (hi - 0x30 - 1 + this.subframe))
                            }
                        } else {
                            if (PlayField16_previous_frame && hi == 0x30) {
                                if (PlayField16_previous_frame[si] == 0x0800) {
                                    cy += Math.round(this.tile / 8 * (-1 + this.subframe))
                                }
                            }
                            paint_pushing.call(this)
                        }
                        this.drawDiskImage(0, ix, iy, cx, cy)
                    } else if ([fiPortUp, fiPortLeft, fiPortDown, fiPortRight, fiPortUpAndDown, fiPortLeftAndRight, fiPortAllDirections].indexOf(lo) !== -1) {
                        switch (lo) {
                        case fiPortUp:
                            {
                                ix = 0;
                                break
                            }
                        case fiPortLeft:
                            {
                                ix = 1;
                                break
                            }
                        case fiPortDown:
                            {
                                ix = 2;
                                break
                            }
                        case fiPortRight:
                            {
                                ix = 3;
                                break
                            }
                        case fiPortUpAndDown:
                            {
                                ix = 4;
                                break
                            }
                        case fiPortLeftAndRight:
                            {
                                ix = 5;
                                break
                            }
                        case fiPortAllDirections:
                            {
                                ix = 6;
                                break
                            }
                        }
                        iy = 0;
                        if (hi) {
                            iy = 1
                        }
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        this.drawPortImage(ix, iy, cx, cy, si)
                    } else if (lo == fiSnikSnak) {
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si < 0 || TimerVar == 0) {
                            f = 3;
                            hi = hi % (0x2f + 1)
                        } else {
                            f = this.view_PlayField[si]
                        }
                        this.drawSnikSnakImage(TimerVar, hi, f, cx, cy, si)
                    } else if (lo == fiScrew) {
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si < 0 || TimerVar == 0) {
                            f = 3;
                            hi = hi % (0x2f + 1)
                        } else {
                            f = this.view_PlayField[si]
                        }
                        this.drawScrewImage(TimerVar, hi, f, cx, cy, si)
                    } else if (lo == fiYellowDisk) {
                        iy = 1;
                        ix = 1;
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        paint_pushing.call(this);
                        this.drawDiskImage(0, ix, iy, cx, cy)
                    } else if (lo == fiTerminal) {
                        if (si < 0) {
                            f = 0
                        } else {
                            f = Math.floor(TerminalState[si] / 2);
                            f2 = f;
                            if (TerminalState_previous_frame) {
                                if (TerminalState[si] != TerminalState_previous_frame[si]) {
                                    f2 = (f2 - 1 + this.subframe)
                                }
                            }
                            f2 *= 16
                        }
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        ix = 2;
                        iy = 0;
                        if (si < 0) {
                            ix += 1
                        } else {
                            if (YellowDisksExploded) {
                                if (TerminalState[si] % 2) {
                                    ix += 1
                                }
                            }
                        }
                        this.drawTerminalImage(1, ix, iy, cx, cy, !1, f2);
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        ix = 0;
                        iy = f % 5;
                        if ((si >= 0) && TerminalState[si] % 2) {
                            ++ix
                        }
                        this.drawTerminalImage(2, ix, iy, cx, cy, !0)
                    } else if (lo == fiRedDisk) {
                        if ((RedDiskReleasePhase == 0) || (si != RedDiskReleaseMurphyPos)) {
                            ix = 0;
                            iy = 0;
                            if (hi == 3) {
                                ix = SeqPos + 1;
                                iy = 1
                            }
                            cx = column * this.tile - this.tile_padding;
                            cy = row * this.tile - this.tile_padding;
                            this.drawDiskImage(0, ix, iy, cx, cy)
                        }
                    } else if (lo == fiElectron) {
                        ////////// EDIT START /////////
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        if (si < 0 || TimerVar == 0) {
                            f = 3;
                            hi = hi % (0x2f + 1)
                        } else {
                            f = this.view_PlayField[si]
                        }
                        this.drawElectronImage(TimerVar, hi, f, cx, cy, si)
                        ////////// EDIT END ///////////
                    } else if (lo == fiExplosion) {} else if (lo == fiWallSpace) {
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        iy = 0;
                        ix = 0;
                        ////////// EDIT START /////////
                        this.drawInvisibleWallImage(ix, iy, cx, cy);
                        ////////// EDIT END ///////////
                    } else if (lo === fiLCD) {
                        LCD.drawImage(si)
                    } else if (lo == fiPlasma) {
                        cx = column * this.tile;
                        cy = row * this.tile;
                        subDrawPlasma(si, this.tile)
                    } else {
                        if (si < 0) {
                            cx = column * this.tile;
                            cy = row * this.tile;
                            f = -1;
                            if (si % 7 == 0)
                                f = 0;
                            else if ((LowByte(PlayField16[si - 1]) <= fiPlasma) && (LowByte(PlayField16[si + 1]) <= fiPlasma))
                                f = 0;
                            this.drawErrorImage(f, 0, cx, cy, 0xFF0000, 0.25)
                        }
                    }
                }
            }
            if (RedDiskReleasePhase >= 3) {
                if (RedDiskReleasePhase == 39) {
                    ix = 0;
                    iy = 0
                } else {
                    iy = 2;
                    ix = Math.floor((RedDiskReleasePhase - 3) / 2);
                    if (ix >= 9) {
                        ix -= 9;
                        ++iy
                    }
                }
                cx = GetX(RedDiskReleaseMurphyPos) * this.tile - this.tile_padding;
                cy = GetY(RedDiskReleaseMurphyPos) * this.tile - this.tile_padding;
                ////////// EDIT START /////////
                this.drawDiskImage(290 + 500, ix, iy, cx, cy, 40 - RedDiskReleasePhase);
                ////////// EDIT END ///////////
            }
            for (key in PlayFieldEffects) {
                effect = PlayFieldEffects[key];
                column = GetX(effect.si);
                row = GetY(effect.si);
                visible = ((cull_from_row < row) && (row < cull_to_row) && (cull_from_col < column) && (column < cull_to_col));
                switch (effect.id) {
                case EFFECT_DISINTEGRATION:
                    {
                        cx = column * this.tile;
                        cy = row * this.tile;
                        if (visible) {
                            f = Math.min(0.75, (effect.ttl - (TimerVar - effect.TimerVar)) / (effect.ttl / 2))
                            this.drawBackgroundNoiseImage(cx, cy, this.tile, this.tile, f)
                        }
                        break
                    }
                case EFFECT_ERROR:
                    {
                        if (PlayField16[effect.si] !== effect.code) {
                            delete (PlayFieldEffects[key])
                        } else {
                            f = TimerVar - effect.TimerVar;
                            if (f < 35 * 2) {
                                f = 1
                            } else {
                                f = 1 - (f - (35 * 2)) / 100
                            }
                            f = Math.max(0.25, f);
                            cx = column * this.tile;
                            cy = row * this.tile;
                            iy = 0;
                            if (effect.code == 0xAAAA)
                                iy = 1;
                            if (effect.code == 0xBBBB)
                                iy = 2;
                            if (effect.code == 0x9999)
                                iy = 3;
                            if (effect.code == 0x8888)
                                iy = 4;
                            if (effect.code == 0x01BB)
                                iy = 5;
                            if (effect.code == 0x02BB)
                                iy = 6;
                            if (effect.code == 0x03BB)
                                iy = 7;
                            if (effect.code == 0x04BB)
                                iy = 8;
                            if (effect.code == 0x0800)
                                iy = 9;
                            if (visible)
                                this.drawErrorImage(0, iy, cx, cy, 0xFF0000, Math.min(1, f))
                        }
                        break
                    }
                case EFFECT_EXPLOSION3X3:
                    {
                        ////////// EDIT START /////////
                        /*
                        cx = column * this.tile;
                        cy = row * this.tile;
                        if (visible) {
                            f = TimerVar - effect.TimerVar;
                            this.drawExplosion3x3Image(f / effect.ttl, cx, cy, 1)
                        }
                        */
                        ////////// EDIT END /////////
                        break
                    }
                case EFFECT_EXPLOSION:
                    {
                        if (visible) {
                            if (effect.infotron && (LowByte(PlayField16[effect.si]) != fiExplosion)) {
                                break
                            }
                            cx = column * this.tile - this.tile_padding;
                            cy = row * this.tile - this.tile_padding;
                            f = TimerVar - effect.TimerVar;
                            this.drawExplosionImage(cx, cy, f, effect.infotron)
                        }
                        break
                    }
                case EFFECT_SHOCKWAVE:
                    {
                        cx = column * this.tile;
                        cy = row * this.tile;
                        if (visible) {
                            f = TimerVar - effect.TimerVar;
                            this.drawShockwaveImage(f / effect.ttl, cx, cy, 1)
                        }
                        break
                    }
                case EFFECT_SOOT:
                    {
                        cx = column * this.tile;
                        cy = row * this.tile;
                        if (visible) {
                            if ([fiHardWare, fiLCD].indexOf(PlayField16[effect.si]) !== -1) {
                                this.drawSootImage(effect, cx, cy)
                            }
                        }
                        break
                    }
                case EFFECT_EXPLOSION_REMNANT:
                    {
                        if (PlayField16[effect.hold_si] != effect.hold_code) {
                            delete (PlayFieldEffects[key]);
                            break
                        }
                        if (!visible)
                            break;
                        cx = column * this.tile - this.tile_padding;
                        cy = row * this.tile - this.tile_padding;
                        hi = HighByte(effect.code);
                        lo = LowByte(effect.code);
                        if (lo == fiElectron) {
                            this.drawElectronImage(TimerVar, hi, cx, cy, si)
                        } else if ((lo == fiSnikSnak) || (lo == fiScrew)) {
                            if (si < 0 || TimerVar == 0) {
                                f = 3;
                                hi = hi % (0x2f + 1)
                            } else {
                                f = this.view_PlayField[effect.si]
                            }
                            if (lo == fiSnikSnak) {
                                this.drawSnikSnakImage(TimerVar, hi, f, cx, cy, si)
                            } else if (lo == fiScrew) {
                                this.drawScrewImage(TimerVar, hi, f, cx, cy, si)
                            }
                        } else if (lo == fiYellowDisk) {} else if (lo == fiOrangeDisk) {
                            if (hi > 0x30) {
                                cy += this.tile / 8 * (hi - 0x30)
                            }
                            this.drawDiskImage(0, 1, 0, cx, cy)
                        } else if (lo == fiGreenDisk) {
                            if (hi > 0x30) {
                                cy += this.tile / 8 * (hi - 0x30)
                            }
                            this.drawDiskImage(0, 9, 0, cx, cy)
                        }
                        break
                    }
                }
            }
            this.paintQueue();
            finishFog.apply(this);
            this.view_now = getTimestamp();
            this.view_timestamps = this.view_timestamps.filter(timestamps_filter)
            this.view_timestamps.push(this.view_now);
            last_TimerVar_frame_painted = TimerVar
        }
    })();
}

(function() {
    new MutationObserver((records, observer) => {
        if (!document.body) return;
        const newNode = document.createElement('script');
        newNode.innerHTML = `(${SO_QOL_PATCH})();`;
        document.head.appendChild(newNode);
        observer.disconnect();
    }).observe(document.documentElement, {childList: true, subtree: true});
})();

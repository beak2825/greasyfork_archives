// ==UserScript==
// @name         Rainbow Theme V4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Original: https://github.com/haykam822/Roblox.com-Rainbow-Fade
// @author       haykam821 (edited by endless)
// @match        *://roblox.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438963/Rainbow%20Theme%20V4.user.js
// @updateURL https://update.greasyfork.org/scripts/438963/Rainbow%20Theme%20V4.meta.js
// ==/UserScript==
 
'use strict';
 


    let _fill = CanvasRenderingContext2D.prototype.fill;
 
    // https://github.com/shlongisdookielol/shlongScripts/blob/main/Diep.io%20Glow
    CanvasRenderingContext2D.prototype.fill = function (args) {
        this.strokeStyle = this.fillStyle;
        this.shadowColor = this.fillStyle;
 
        this.shadowBlur = 20;
        this.stroke();
 
        this.fillStyle = "transparent";
        this.lineWidth = 7.5;
 
        _fill.apply(this, args);
    };
 
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/chroma-js/1.3.7/chroma.min.js";
    document.head.append(script);
 
    script.addEventListener('load', () => {
        const colors = chroma.scale(['red', 'orange', 'yellow', 'lime', 'cyan', 'mediumpurple', 'red']).colors(1000);
        let index = 0;
 
        setInterval(() => {
            index += 1;
 
            if (index > colors.length) index = 0;
 
            const scale = "0x" + colors[index].substr(1, Infinity);
 
            const black = [ 0, 1, 8, 9, 10, 11, 13, 14, 16, 17 ]
 
            black.forEach(function(i) {
                input.execute(`net_replace_color ${i} 0x000000`);
            });
 
            black.splice(0, black.length, ...[
                'ren_score_bar_fill_color',
                'ren_xp_bar_fill_color',
                'ren_health_fill_color',
                'ren_background_color'
            ]);
 
            black.forEach(function(i) {
                input.execute(i + ' 0x000000');
            });
 
            input.set_convar(`ren_stroke_soft_color`, false);
            input.set_convar(`ren_raw_health_values`, true);
            input.execute(`ren_border_color 0xc7c7c7`);
 
            var rainbow = [
                'net_replace_color 12',
                'net_replace_color 2',
                'net_replace_color 15',
                'ren_stroke_solid_color',
                'ren_bar_background_color',
                'ren_health_background_color',
                'ren_minimap_background_color'
            ];
 
            rainbow.forEach(function(i) {
                input.execute(i + ' ' + scale);
            });
 
            input.execute(`ui_replace_colors` + ` ${scale}`.repeat(8));
        });
    });

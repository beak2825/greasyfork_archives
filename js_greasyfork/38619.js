// ==UserScript==
// @name         ADSR:ダブルスプリット捕食リング
// @name:ja      ADSR:ダブルスプリット捕食リング
// @name:en      ADSR:Double split opponents ring
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  OGAR にダブルスプリット用の捕食リングを追加します
// @description:ja  OGAR にダブルスプリット用の捕食リングを追加します
// @description:en  Add opponents ring for double splilt
// @author       https://twitter.com/tannichi1
// @match        http://agar.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38619/ADSR%3ADouble%20split%20opponents%20ring.user.js
// @updateURL https://update.greasyfork.org/scripts/38619/ADSR%3ADouble%20split%20opponents%20ring.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var global = unsafeWindow;
    var ogario = null;
    var my = {
        "name": "DoubleSplitRing",
        "log": function(msg){ console.log(this.name + ":"+ msg); },
        "pi2": 2 * Math.PI,
    };
    var stat = {
        "color2big": "#0000FF",
        "color2small": "#0000FF",
        "color2range": "#0000FF",
        "color2split": "#0000FF",
    };
    var cfg = {
    };
    function pre_loop(){
        // この時点では jQuery は使えない
        if(! document.getElementById("top5-hud")){
            my.pre_loop_timeout = (my.pre_loop_timeout || 1000) + 1000;
            setTimeout(pre_loop, my.pre_loop_timeout);
            my.log("wait for OGARio load");
            return;
        }
        // 念のため、もう１wait入れる
        setTimeout(initialize, 1000);
    }
    pre_loop();

    function initialize(){
        //$.extend(cfg, cfg_org, JSON.parse(GM_getValue("config", '{}')));
        global[my.name] = {my:my, stat:stat, cfg:cfg};
        ogario = global.ogario;
        ogario.save_customDraw = ogario.customDraw;
        ogario.customDraw = my.customDraw;
    }
    my.customDraw = function(gameCtx){
        my.cell_extract();
        ogario.save_customDraw(gameCtx);
        //my.log("cell2big   length="+ stat.cell2big.length);
        //my.log("cell2small length="+ stat.cell2small.length);
        //my.log("call customDraw");(
        my.cell_draw(gameCtx);
    };
    my.cell_draw = function(gameCtx){
        if(ogario.splitRange){
            gameCtx.lineWidth = 6;
            gameCtx.globalAlpha = 0.7; // not darkTheme is 0.35;
            if(stat.cellPlayer){
                draw_sub([stat.cellPlayer], 0x2f8 *2, stat.color2split);
            }
            gameCtx.lineWidth = 4;
            gameCtx.globalAlpha = 0.4;
            draw_sub(stat.cell2big, 0x2f8 *2, stat.color2range);
        }
        if(ogario.oppRings){
            var size_plus = 0xe + 0x2 / ogario.viewScale;
            var lineWidth = 0xc + 0x1 / ogario.viewScale;
            gameCtx.lineWidth = lineWidth;
            gameCtx.globalAlpha = 0.75;
            draw_sub(stat.cell2big, size_plus, stat.color2big);
            draw_sub(stat.cell2small, size_plus, stat.color2small);
        }
        gameCtx.globalAlpha = 1;
        function draw_sub(cells, size_plus, color){
            gameCtx.strokeStyle = color;
            cells.forEach(function(cell){
                gameCtx.beginPath();
                gameCtx.arc(cell.x, cell.y, cell.size + size_plus, 0x0, my.pi2, !0x1);
                gameCtx.closePath();
                gameCtx.stroke();
            });
        }
    };
    my.cell_extract = function(){
        //var cellMass = Math.floor(cellSize * cellSize / 100);
        var myMass = ogario.selectBiggestCell ? ogario.playerMaxMass : ogario.playerMinMass;
        //var mySize = Math.pow(myMass * 100, 0.5);
        var ratio2 = myMass < (1000 * 2) ? 0.35 : 0.38;
        var size2max = Math.pow(myMass * 2.5 * 2 * 100, 0.5);
        var size2min = Math.pow(myMass * (ratio2 / 2) * 100, 0.5);
        stat.cell2big = ogario.biggerSTECellsCache.filter(function(cell){
            return cell.size > size2max;
        });
        stat.cell2small = ogario.STECellsCache.filter(function(cell){
            return cell.size < size2min;
        });
        ogario.playerCells.sort(function(a, b) {
            return b.size - a.size;
        });
        var cell_idx = ogario.selectBiggestCell ? 0 : ogario.playerCells.length - 1;
        stat.cellPlayer = ogario.playerCells[cell_idx];
    };
})();

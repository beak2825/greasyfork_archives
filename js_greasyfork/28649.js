// ==UserScript==
// @name         Reddit Place Kekistani Flag
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Kekistani Flag
// @author       Jim Russells
// @match        https://www.reddit.com/place?webview=true
// @match        http*://www.reddit.com/place?webview=true
// @match        https://www.reddit.com/r/place/*
// @match        http*://www.reddit.com/r/place*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28649/Reddit%20Place%20Kekistani%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/28649/Reddit%20Place%20Kekistani%20Flag.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images = [
        // ordered by priority
        // use the debug flag to test your images!
        {
            offsetX: 207,
            offsetY: 909,
            text: [
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccc...cccccc...cccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "cc.@@@.cccc.@@@.ccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccc.@@@.cc.@@@.cccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "cc.@@@@.cc.@@@@.ccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccc....cccc....cccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccc..cccc..cccccccccccc@@@@@@@@@@@cccccccccccccccccccccccccccccccccccccccccccc",
                "cccc.@@.cc.@@.ccccccccc@@...........@ccccccccccccccccccccccccccccccccccccccccccc",
                "ccc.@@@.cc.@@@.ccccccc@.....@@@@@....@@ccccccccccccccccccccccccccccccccccccccccc",
                "ccc.@@@.cc.@@@.ccccc@@...@@.......@@...@cccccccccccccccccccccccccccccccccccccccc",
                "ccc.@.@.cc.@.@.cccc@@..@@..@@@@@@@..@@..@ccccccccccccccccccccccccccccccccccccccc",
                "cccc.c.cccc.c.cccc@@..@..@@@@@@@@@@@..@..@cccccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccccc@..@.@@@@@@@@@@@@@@@.@..@ccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccc@..@.@@@@@@@@@@@@@@@@@.@..@cccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccc@..@.@@@@@@.@@@@@.@@@@@@.@.@cccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccc@..@.@@@@@@@..@..@@@@@@@.@..@ccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccc..@.@@@@@@@@@...@@@@@@@@@.@.@ccccccccccccccccccccccccccccccccccc",
                "@@@@@@@@@@@@@@@@..@.@@@@@@@@@@.@@@@@@@@@@.@..@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "...............@...@@@@@@@@.......@@@@@@@@...@..................................",
                "@@@@@@@@@@@@@@@@...@@.@@@.@@@@@@@@@.@@@.@@...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "@@@@@@@@@@@@@@@..@.@@@.@@.@.@@.@@.@.@@.@@@.@.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "..............@..@.@@@..@.@.@@.@@.@.@..@@@.@....................................",
                "..............@..@.@@@@...@.@@.@@.@...@@@@.@....................................",
                "..............@..@.@@@@...@.@@.@@.@...@@@@.@....................................",
                "..............@..@.@@@..@.@.@@.@@.@.@..@@@.@....................................",
                "@@@@@@@@@@@@@@@..@.@@@.@@.@.@@.@@.@.@@.@@@.@.@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "@@@@@@@@@@@@@@@....@@.@@@.@@@@@@@@@.@@@.@@...@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "...............@...@@@@@@@@.......@@@@@@@@...@..................................",
                "@@@@@@@@@@@@@@@@..@.@@@@@@@@@@.@@@@@@@@@@.@..@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@",
                "cccccccccccccccc..@.@@@@@@@@@...@@@@@@@@@.@.@ccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccc@..@.@@@@@@@..@..@@@@@@@.@..@ccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccc@..@.@@@@@@.@@@@@.@@@@@@.@.@cccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccc@..@.@@@@@@@@@@@@@@@@@.@..@cccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccccc@..@.@@@@@@@@@@@@@@@.@..@ccccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccccc@@..@..@@@@@@@@@@@..@..@cccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccc@...@@..@@@@@@@..@@..@@cccccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccccccc@@...@@.......@@...@cccccccccccccccccccccccccccccccccccccccc",
                "cccccccccccccccccccccc@.....@@@@@.....@ccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccc@@...........@@cccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@@@@@@@@@@@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc",
                "ccccccccccccccccccccccccc@.@....@@.@cccccccccccccccccccccccccccccccccccccccccccc"
            ],
        },
		{
            offsetX: 0,
            offsetY: 413,
            text: [
                "###########################################",
                "###########################################",
                "###########################################",
                "###################@@@@@###################",
                "################@@@@@.@@@@#################",
                "###############@@@@@...@@@@@###############",
                "##############@@@@@...@@@@@@@##############",
                "#############@@@@@...@@@@@@@@##############",
                "#############@@@@....@@@..@@@@#############",
                "############@@@@....@@@....@@@@############",
                "############@@@@@....@......@@@############",
                "############@@.@@@...........@@############",
                "############@...@@@.....@@....@############",
                "############@....@@.....@@@...@############",
                "############@@...........@@@.@@############",
                "############@@@......@....@@@@@############",
                "############@@@@....@@@....@@@#############",
                "#############@@@@..@@@....@@@@#############",
                "#############@@@@@@@@....@@@@##############",
                "##############@@@@@@....@@@@@##############",
                "###############@@@@@...@@@@@###############",
                "#################@@@@.@@@@#################",
                "###################@@@@@###################",
                "###########################################",
                "###########################################",
                "###########################################"
            ],
        },
    ];

    var colors = {
        "@": 0,  // white
        ".": 3,  // black
        "#": 5,  // red		
        "c": 10,  // green
        " ": -1, // ignore
    };

    for (var img_idx = 0; img_idx < images.length; img_idx++) {
        var image = images[img_idx];
        image.image_data = [];
        for (var relY = 0; relY < image.text.length; relY++) {
            var row = image.text[relY];
            for (var relX = 0; relX < row.length; relX++) {
                var color = colors[row[relX]] || -1;
                if (color < -1) {
                    continue;
                }
                var absX = image.offsetX + relX;
                var absY = image.offsetY + relY;
                image.image_data.push(absX);
                image.image_data.push(absY);
                image.image_data.push(color);
            }
        }
    }
    var default_panX = 100;
    var default_panY = -500;

    var p = r.place;
    p.panX = default_panX;
    p.panY = default_panY;

    r.placeModule("placePaintBot", function(loader) {
        var c = loader("canvasse");
        var r = loader("client");

        setInterval(function() {
            var tl = p.getCooldownTimeRemaining();

            if (2000 < tl && tl < 3000) {location.reload();}

            var debug = 0; //tl > 3000;
            if (!debug && tl > 200) {return;}
            for (var img_idx = 0; img_idx < images.length; img_idx++) {
                var image = images[img_idx];

                for (var i = 0; i < image.image_data.length; i += 3) {
                    var j = Math.floor((Math.random() * image.image_data.length) / 3) * 3;
                    var x = image.image_data[j + 0];
                    var y = image.image_data[j + 1];
                    var color = image.image_data[j + 2];
                    var currentColor = p.state[c.getIndexFromCoords(x, y)];

                    if (currentColor != color) {
                        if (debug) {
                            p.state[c.getIndexFromCoords(x, y)] = color;
                            c.setBufferState(c.getIndexFromCoords(x, y), r.getPaletteColorABGR(color));
                        } else {
                            console.log("set color for", x, y, "old", currentColor, "new", color);
                            p.setColor(color);
                            p.drawTile(x, y);
                        }
                        return;
                    }
                }
                console.log("noop");
            }
        }, 200);
    });
})();
// ==UserScript==
// @name         Reddit Place UKRAINIAN Flag
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  UKRAINIAN Flag
// @author       Your Majesty
// @include     https://www.reddit.com/place?webview=true
// @include     https://www.reddit.com/r/place/
// @include     https://www.reddit.com/place?webview=true#x=*&y=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28660/Reddit%20Place%20UKRAINIAN%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/28660/Reddit%20Place%20UKRAINIAN%20Flag.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var images = [
        // ordered by priority
        // use the debug flag to test your images!
        {
            offsetX: 0,
            offsetY: 378,
            text: [
                "333333333333333333333333333333333333333333333",
                "3CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCC3",
                "3CCCCCCCCCCCCCC8888888888888888CCCCCCCCCCCCC3",
                "3CCCCCCCCCCCCCC8CCCCCCCCCCCCCC8CCCCCCCCCCCCC3",
                "3CCCCCCCCCCCCCC8CCCCCC88CCCCCC8CCCCCCCCCCCCC3",
                "3CCCCCCCCCCCCCC8C8CCCC88CCCC8C8CCCCCCCCCCCCC3",
                "3CCCCCCCCCCCCCC8C88CCC88CCC88C8CCCCCCCC333CC3",
                "3CCCCCCCCCCCCCC8C888CC88CC888C8CCCCCCC33333C3",
                "3CCCCCCCCCCCCCC8C8C8CC88CC8C8C8CCCCCC33333333",
                "3CCCCCCCCCCCCCC8C8C8CC88CC8C8C8CCCCCC33333353",
                "3CCCCCCCCCCCCCC8C8C88C88C88C8C8CCCCCC30000553",
                "3CCCCCCCCCCCCCC8C8CC8C88C8CC8C8CCCCCC30005553",
                "3CCCCCCCCCCCCCC8C8CC8C88C8CC8C8CCCCCCC3005553",
                "3888888888888888C8C8CC88CC8C8C888888888300553",
                "3888888888888888C88CCC88CCC88C88888888883CC53",
                "3888888888888888C8C8C8CC8C8C8C888888888883CC3",
                "3888888888888888C8CC888888CC8C8888888888883C3",
                "3888888888888888C8CC8C88C8CC8C888888888888833",
                "3888888888888888CC8888888888CC888888888888883",
                "3888888888888888CCCC8C88C8CCCC888888888888883",
                "3888888888888888CCCCC8888CCCCC888888888888883",
                "388888888888888888CCCC88CCCC88888888888888883",
                "38888888888888888888CCCCCC8888888888888888883",
                "388888888888888888888888888888888888888888883",
                "388888888888888888888888888888888888888888883",
                "333333333333333333333333333333333333333333333",
                "330003333030330303303000333003300030330300033",
                "330330330330330303033033030330330330030303333",
                "330003330330330300333000330000330330300300033",
                "330330330330330303033033030330330330330303333",
                "330330303333003303303033030330300030330300033",
                "333333333333333333333333333333333333333333333"
            ],
        },

        {

            offsetX: 0,
            offsetY: 0,
            text: [
                "53CCC3",
                "3CCCCC",
                "CCCCCC",
                "CCCCCC",
                "CCCCCC",
                "CCCCC3",
                "888835",
                "888355",
                "883555",
                "835555"
            ],
        }

    ];


    var colors = {
        "0": 0, // white (255, 255, 255)
        "1": 1, // light grey (228, 228, 228)
        "2": 2, // grey  (136, 136, 136)
        "3": 3, // black   (34, 34, 34)
        "4": 4, // pink (255, 167, 209)
        "5": 5, // red (229, 0, 0) 
        "6": 6, // orange (229, 149, 0)
        "7": 7, // brown (160, 106, 66)
        "8": 8, // yellow  (229, 217, 0)
        "9": 9, // light green (148, 224, 68)
        "A": 10, // green (2, 190, 1)
        "B": 11, // light blue (0, 211, 211)
        "C": 12, // blue (0, 131, 199)
        "D": 13, // dark blue  (0, 0, 234)
        "E": 14, // light purple (207, 110, 228)
        "F": 15, // purple (130, 0, 128)
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
    var default_panX = 480;
    var default_panY = 110;

    var p = r.place;
    p.panX = default_panX;
    p.panY = default_panY;

    r.placeModule("placePaintBot", function(loader) {
        var c = loader("canvasse");
        var r = loader("client");

        setInterval(function() {
            var tl = p.getCooldownTimeRemaining();

            if (2000 < tl && tl < 3000) {
                location.reload();
            }

            var debug = 0; //tl > 3000;
            if (!debug && tl > 20) {
                return;
            }
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
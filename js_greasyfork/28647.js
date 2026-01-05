// ==UserScript==
// @name         COMMIES OUT REEEEEEEEE
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Better Dead than Red
// @author       A. Wyatt Mann
// @match        https://www.reddit.com/place?webview=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28647/COMMIES%20OUT%20REEEEEEEEE.user.js
// @updateURL https://update.greasyfork.org/scripts/28647/COMMIES%20OUT%20REEEEEEEEE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var images = [
        // ordered by priority
        // use the debug flag to test your images!
    {
            offsetX: 498,
            offsetY: 188,
            text: [
                "       _____       ",
                "    _____@____     ",
                "   _____@@@_____   ",
                "  _____@@@_______  ",
                " _____@@@________  ",
                " ____@@@@___@@____ ",
                "____@@@@___@@@@____",
                "_____@@@@_@@@@@@___",
                "__@___@@@@@@@@@@@__",
                "_@@@___@@@@@__@@@@_",
                "_@@@@__@@@@@___@@@_",
                "__@@@@@@@@@@@___@__",
                "___@@@@@@_@@@@_____",
                "____@@@@___@@@@___ ",
                " ____@@___@@@@____ ",
                " ________@@@@____  ",
                "  ______@@@@_____  ",
                "   _____@@@_____   ",
                "     ____@____     ",
                "       _____       "
            ],
        },
    ];

    var colors = {
        "_": 5,  // red
        "@": 3,  // black
        "#": 0,  // white
        " ": -2, // ignore
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
    var default_panX = -100;
    var default_panY = 300;

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
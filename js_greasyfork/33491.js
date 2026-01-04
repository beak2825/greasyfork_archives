// ==UserScript==
// @name         epad rainbow
// @namespace    http://epad.jaguar-network.com/
// @version      0.1
// @description  rainbowish your epad
// @author       r0bin
// @match        http://epad.jaguar-network.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33491/epad%20rainbow.user.js
// @updateURL https://update.greasyfork.org/scripts/33491/epad%20rainbow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var colors = [
        'ff0000',
        'E2571E',
        'ff7f00',
        'ffff00',
        '00ff00',
        '96bf33',
        '0000ff',
        '4B0082',
        '8b00ff',
        'ffffff'
    ];

    var i = 0;
    setInterval(
        function() {
            var color = colors[i];

            chat._pad.socket.json.send(
                {
                    'type'     : 'COLLABROOM',
                    'component': 'pad',
                    'data'     : {
                        'type'    : 'USERINFO_UPDATE',
                        'userInfo': {
                            'colorId'  : '#' + color,
                        }
                    },
                }
            );

            i = (i + 1) % colors.length;
        },
        100
    );
})();
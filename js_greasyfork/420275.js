// ==UserScript==
// @name         Image invert when it is white
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       alextooter
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420275/Image%20invert%20when%20it%20is%20white.user.js
// @updateURL https://update.greasyfork.org/scripts/420275/Image%20invert%20when%20it%20is%20white.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');

    function isWhite (img)
    {
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        var r = 0;
        var g = 0;
        var b = 0;
        var long = 120;
        for (var i = 0; i < long; i += 4)
        {
            r+=data[i]; // red
            g+=data[i + 1]; // green
            b+=data[i + 2]; // blue
        }
        var rr = r/long*4;
        var gg = g/long*4;
        var bb = b/long*4;
        var limit = 150;
        if (rr > limit && gg > limit && bb > limit) {
            return true;}
        else {
            return false;
        }
    };
var ilist = document.images;

for(var i = 0; i < ilist.length; i++)
{

    if(isWhite(ilist[i]))
    {
        // deal with big images
     ilist[i].style.filter="invert(1)";
    }
    else
    {
     ilist[i].style.filter="invert(0)";
    }
}
})();
// ==UserScript==
// @name        The Darkening
// @description Stylish theme to darken all sites that doesn't suck. All syntax highlighting is kept while being dead simple.
// @namespace   https://github.com/akatrevorjay/the-darkening
// @url         https://github.com/akatrevorjay/the-darkening/raw/master/theme.js
// @version     1
// @include     *
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26202/The%20Darkening.user.js
// @updateURL https://update.greasyfork.org/scripts/26202/The%20Darkening.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Apply CSS class name according to window frame status
    document.documentElement.className += (window.self == window.top ? " the-darkening-top" : " the-darkening-framed");

    var increase_brightness = function(hex, percent){
        // strip the leading # if it's there
        hex = hex.replace(/^\s*#|\s*$/g, '');

        // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
        if(hex.length == 3){
            hex = hex.replace(/(.)/g, '$1$1');
        }

        var r = parseInt(hex.substr(0, 2), 16),
            g = parseInt(hex.substr(2, 2), 16),
            b = parseInt(hex.substr(4, 2), 16);

        return '#' +
        ((0|(1<<8) + r + (256 - r) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + g + (256 - g) * percent / 100).toString(16)).substr(1) +
        ((0|(1<<8) + b + (256 - b) * percent / 100).toString(16)).substr(1);
    };

    /**
    * ('#000000', 50) --> #808080
    * ('#EEEEEE', 25) --> #F2F2F2
    * ('EEE     , 25) --> #F2F2F2
    **/

    function getImageLightness(imageSrc,callback) {
        var img = document.createElement("img");
        img.src = imageSrc;
        img.style.display = "none";
        document.body.appendChild(img);

        var colorSum = 0;

        img.onload = function() {
            // create canvas
            var canvas = document.createElement("canvas");
            canvas.width = this.width;
            canvas.height = this.height;

            var ctx = canvas.getContext("2d");
            ctx.drawImage(this,0,0);

            var imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
            var data = imageData.data;
            var r,g,b,avg;

            for(var x = 0, len = data.length; x < len; x+=4) {
                r = data[x];
                g = data[x+1];
                b = data[x+2];

                avg = Math.floor((r+g+b)/3);
                colorSum += avg;
            }

            var brightness = Math.floor(colorSum / (this.width*this.height));
            callback(brightness);
        }
    }

    //getImageLightness("image.jpg",function(brightness){
    //    console.log(brightness);
    //});

})();

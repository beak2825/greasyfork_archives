// ==UserScript==
// @name        IMDb Gallery Expander
// @namespace   driver8.net
// @description Expand the images on imdb gallery pages without having to visit each individual image page.
// @match       *://*.imdb.com/*/mediaindex*
// @match       *://*.imdb.com/media/index*
// @match       *://*.imdb.com/gallery/*
// @match       *://*.imdb.com/*/rg*
// @version     0.1.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10911/IMDb%20Gallery%20Expander.user.js
// @updateURL https://update.greasyfork.org/scripts/10911/IMDb%20Gallery%20Expander.meta.js
// ==/UserScript==

var BAD_MANNER = true;
var NEW_SIZES = false; // new(ish) imdb media viewer uses much larger default images
var LOGGING = false;
var IMDB_WIDTH = 640;
var IMDB_HEIGHT = 720;
var IMDB_NEW_WIDTH = 1777;
var IMDB_NEW_HEIGHT = 1000;
var CUSTOM_WIDTH = 968;
var CUSTOM_HEIGHT = 970;
var CORNER_PADDING = 5;

var pref_width = BAD_MANNER ? CUSTOM_WIDTH : (NEW_SIZES ? IMDB_NEW_WIDTH : IMDB_WIDTH);
var pref_height = BAD_MANNER ? CUSTOM_HEIGHT : (NEW_SIZES ? IMDB_NEW_HEIGHT : IMDB_HEIGHT);

var images = document.querySelectorAll("#media_index_thumbnail_grid img");
var addImage = document.querySelector('a.add-image');
addImage && addImage.parentNode.removeChild(addImage);
var zoom_image_src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACNklEQVRYhb2XP2gUURDGf8UhsRAsLK4QPBAkZQqLhIiIhJBGEbEyIBYhpLSwEYQUYqNgExAhhUWKFAoWQYREWPCKRE8MJMURLCwUU1goSWERJBZzC8u383bf3i33wTT7vpn53rx5fxbi0ATmgFWgDXzrWbv37R7QioxVCVeADeA40jrATB2Jm0BSIbFawgAVuQZ8GCB5ah+BW1WTjwGHgYBrwAIwjs2uBVzEeuMNcOT4HAKXYpNPYE2lQdrA7Qj/m8C64/8ZuBojwFvzVeB07AyAEWDJidMpc5x1nJ5XSKx47MSbL3LoCPk74ZlrYA8jwK7wvoaSTwL/MsQ/FK/5bwkcEnod+CncaY94X0hrBckhrgIpVoT7yCO9E9JCjQJuCLftkT4JSfetlrzMsktyTsb2PAE/hHShRgEngYPM2AFwSgXsS4DzNQo4If6/cJr2iwSYqFHAWRnb0uSQv27veqQMqjThlHBfeaSHMaQ+BSwLd9EjjQnpCLvxBhUwCvwVbvBm7Aqxix2n/QpoAJvCSwrEMu8EflLkUIIHTrzSK33bcXpKuBIeGtjRro+TwtmnmAF2HBFvsYulDNPAa8f/GDvudXu7mHLUp425gp3tzQz/TM9nmXzDqXXFN4g75O/yumydyDfiKPaA6DdRQn5nVa5EAzsVqwhJsJ8ZekkGFpFiHHtMbGLPtbQvdrGTcxG/tLWK6BeTwPuAiGfDEADhSuwPSwDAZfL/Hi+GKQDsfbCEzfwl0PoPPqirgM66zr0AAAAASUVORK5CYII="

function log(msg) {
    LOGGING && console.log(msg);
}

if (NEW_SIZES) {
    var root = document.querySelector('#root');
    root.style.width = 'auto';
    document.querySelector('.article').style.border = 'none';
}

for (var i = 0; i < images.length; i++) {
    var thisImage = images[i];
    thisImage.removeAttribute('width');
    thisImage.removeAttribute('height');

    var parentA = thisImage.parentNode;
    var parentDiv = parentA.parentNode;
    var newDiv = document.createElement("DIV");
    parentDiv.removeChild(parentA);
    parentDiv.appendChild(newDiv);
    newDiv.appendChild(parentA);

    var origSrc = thisImage.src;
    // https://images-na.ssl-images-amazon.com/images/M/MV5BMTQzMjAzNTkyNl5BMl5BanBnXkFtZTgwOTU5NDM2MzE@._V1_UY100_CR70,0,100,100_AL_.jpg
    // https://images-na.ssl-images-amazon.com/images/M/MV5BMTQzMjAzNTkyNl5BMl5BanBnXkFtZTgwOTU5NDM2MzE@._V1_SX1777_CR0,0,1777,736_AL_.jpg
    thisImage.src = origSrc.replace(/(https?:\/\/(?:ia\.media-imdb\.com|.+?\.ssl-images-amazon\.com|.+?\.media-amazon\.com))\/images\/([a-zA-Z0-9@]\/[a-zA-Z0-9@]+)\._V[0-9].+\.jpg/,
            '$1/images/$2._V1_SX' + pref_width + '_SY' + pref_height + '_.jpg');
    var fullSrc = origSrc.replace(/(https?:\/\/(?:ia\.media-imdb\.com|.+?\.ssl-images-amazon\.com|.+?\.media-amazon\.com))\/images\/([a-zA-Z0-9@]\/[a-zA-Z0-9@]+)\._V[0-9].+\.jpg/,
            '$1/images/$2.jpg'); // FULL SIZE
    thisImage.setAttribute("data-image-num", i);

    var zoom_image = document.createElement("IMG");
    zoom_image.setAttribute("data-image-num", thisImage.getAttribute("data-image-num"));
    zoom_image.src = zoom_image_src;
    zoom_image.style.position = "absolute";
    zoom_image.style.backgroundColor = "white";
    zoom_image.style.borderStyle = "solid";
    zoom_image.style.borderWidth = "3px";
    zoom_image.style.borderColor = "white";
    zoom_image.style.borderRadius = "3px";
    zoom_image.style.display = "none";
    var zoom_a = document.createElement("A");
    zoom_a.href = fullSrc;
    zoom_a.appendChild(zoom_image);
    newDiv.appendChild(zoom_a);

    function loadListener(img, zoom_image) {
        log("loadListener");
        return function (event) {
            log(event);
            img.parentNode.parentNode.addEventListener("mouseover", function() {
                log("mouseover");
                var img_rect = img.getBoundingClientRect();
                var body_rect = document.body.getBoundingClientRect();
                zoom_image.style.left = '' + (img_rect.left + CORNER_PADDING) + 'px';
                zoom_image.style.top = '' + (img_rect.top - body_rect.top + CORNER_PADDING) +'px'; // PLUS DOCUMENT POS
                zoom_image.style.display = "block";
                return false;
            });
            log("listener 1 " + img.src);
            img.parentNode.parentNode.addEventListener("mouseout", function() {
                zoom_image.style.display = "none";
                return false;
            });
        };
    }

    thisImage.addEventListener("load", loadListener(thisImage, zoom_image));
}

// 24px: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABlUlEQVRIia2VoUtDURTGf2AxLJhkYcEgsiSCLxgMBsGBEwQXxKrdhQWDaBCsCwuL/gGCs4ksiNiGzbCwMHDIwhTDouEZ7h2ee3zv7r3HPjjlft853zn33XsfxGMJOAMegB7Qt9EGzoFlT64Xi8AF8AGEnvgErm0jibED3E0prOMROEhSvAiMVfITUAO2baebQBVoKd0PsOUrngfuRUIXOAXmPTnHQEc1sxInvhTCsZ0mCfLAQOQ2okRFzIgT0UmERm6HRknxgRZc4Y4ZBZ8BwI3g65p8E2Qto0EF9/s56AtyT6x/q8JRsWC162LtC5iL664Qsx4XiaZ8F0Qp4wSrYq2nDbqCrGpyWncW+4J/0WRdkK2MBrJGU5OBKlBOaRDg3qO1qA4aQjDC3NAkyOFucdwOkMM9rgPMA+dDoIqHmG8Riw3cUUPMDa3w93Mp2CL1CG0IDJnyjh0BzxGJaaID7PpMcrhviy9adqJh2knA/FyamH2ebMcIc86buKelmNUkDcrAqzK5naUB/J+kP2uDiUnbFj/8BVwh8BbI/E9WAAAAAElFTkSuQmCC
// 32px: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACNklEQVRYhb2XP2gUURDGf8UhsRAsLK4QPBAkZQqLhIiIhJBGEbEyIBYhpLSwEYQUYqNgExAhhUWKFAoWQYREWPCKRE8MJMURLCwUU1goSWERJBZzC8u383bf3i33wTT7vpn53rx5fxbi0ATmgFWgDXzrWbv37R7QioxVCVeADeA40jrATB2Jm0BSIbFawgAVuQZ8GCB5ah+BW1WTjwGHgYBrwAIwjs2uBVzEeuMNcOT4HAKXYpNPYE2lQdrA7Qj/m8C64/8ZuBojwFvzVeB07AyAEWDJidMpc5x1nJ5XSKx47MSbL3LoCPk74ZlrYA8jwK7wvoaSTwL/MsQ/FK/5bwkcEnod+CncaY94X0hrBckhrgIpVoT7yCO9E9JCjQJuCLftkT4JSfetlrzMsktyTsb2PAE/hHShRgEngYPM2AFwSgXsS4DzNQo4If6/cJr2iwSYqFHAWRnb0uSQv27veqQMqjThlHBfeaSHMaQ+BSwLd9EjjQnpCLvxBhUwCvwVbvBm7Aqxix2n/QpoAJvCSwrEMu8EflLkUIIHTrzSK33bcXpKuBIeGtjRro+TwtmnmAF2HBFvsYulDNPAa8f/GDvudXu7mHLUp425gp3tzQz/TM9nmXzDqXXFN4g75O/yumydyDfiKPaA6DdRQn5nVa5EAzsVqwhJsJ8ZekkGFpFiHHtMbGLPtbQvdrGTcxG/tLWK6BeTwPuAiGfDEADhSuwPSwDAZfL/Hi+GKQDsfbCEzfwl0PoPPqirgM66zr0AAAAASUVORK5CYII=
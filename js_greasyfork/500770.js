// ==UserScript==
// @name          Benjify
// @namespace     Joshy2Saucy
// @description	  Turns all images on page to benjis
// @include       *
// @version       1.1
// @license       Joshy2Saucy
// @downloadURL https://update.greasyfork.org/scripts/500770/Benjify.user.js
// @updateURL https://update.greasyfork.org/scripts/500770/Benjify.meta.js
// ==/UserScript==

(function() {
var Program = {
    // To add images: Google image search for the desired images, then run the following command in your browser console (tested in FF):
    // var output = ''; document.body.innerHTML.match(/(?=imgurl=)(.+?)(?=&amp;)/g).map(function(value) {var url = encodeURIComponent(decodeURIComponent(decodeURIComponent(value)).replace('imgurl=', '').replace(/'/g, '\\\'')); if (url) output += '\'' + url + '\',';}); window.open('data:text/plain,' + output, '_blank', 'width=500,height=500,scrollbars=1');
    // Copy and paste the output below. Make sure the opening and closing []s are still there, and make sure the last line does not end with a comma.
    replacementImages: [
        'https://i.imgur.com/Kt673Kv.png','https://i.imgur.com/5KHuSxr.png','https://i.imgur.com/Nobrqcr.png','https://i.imgur.com/0E5QkVZ.png','https://i.imgur.com/ChuPbAz.png','https://i.imgur.com/Wxzjoul.png','https://i.imgur.com/0H6gG1j.png','https://i.imgur.com/kaNQoIs.png'],
    loaded: false,
    changeBufferTimer: null,

    main: function() {
        if (!this.loaded) {
            this.loaded = true;
            document.addEventListener('DOMSubtreeModified', this.domChanged, false);
            this.domChangedBuffered();
        }
    },

    domChanged: function() {
        if (this.changeBufferTimer) {
            clearTimeout(this.changeBufferTimer);
            this.changeBufferTimer = null;
        }
        this.changeBufferTimer = setTimeout(this.domChangedBuffered.bind(this), 222); //-- 222 milliseconds
    },

    domChangedBuffered: function() {
        var images = document.getElementsByTagName('img');
        for (var i = 0; i < images.length; i++) {
            images[i].src = this.replacementImages[Math.floor(Math.random() * this.replacementImages.length)];
        }
    }
};

window.addEventListener('load', Program.main.bind(Program), false);
})();
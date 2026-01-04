// ==UserScript==
// @name         Yandex Images Autoscroll
// @namespace    https://yandex.*
// @version      0.1
// @description  Autoplay images from Yandex search results page
// @author       You
// @match        https://yandex.com/images/search*
// @match        https://yandex.ru/images/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yandex.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453955/Yandex%20Images%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/453955/Yandex%20Images%20Autoscroll.meta.js
// ==/UserScript==

(function() {

    'use strict';

    var self = {};
    var css = '';
    var next = '.MediaViewer-ButtonNext';
    var sub = '.RelatedImages-Thumb';

    var show_related = false;

    function do_next() {
        $(next).click();
        if(show_related) {
            var $$subs = document.querySelectorAll('.RelatedImages-Thumb');
            var idx = 0;
            var subgal = setInterval(function() {
                if(idx > 10) clearInterval(subgal);
                if($$subs[idx]) $$subs[idx].click();
                idx++;
            }, 3000);
        }
    }
    self._timer = null;
    self.stop = function() { window.clearInterval(self.timer); }
    self.start = function(interval) { self.timer = setInterval(do_next, interval || (show_related ? 15000 : 9000)); }


    css += '.MMImageWrapper .MMImageContainer { width: 100%; height: 100% }';
    css += '.MMImageWrapper .MMImage-Origin, .MMImageWrapper .MMImage-Preview { width: 100%!important; height: 100%!important; object-fit: contain; image-rendering: high-quality; }';
    css += '.ImagesViewer .MediaViewer-LayoutSideblock { width: 90px; min-width: 90px; opacity: 0.1; }';
    css += '.ImagesViewer .MediaViewer-LayoutSideblock:hover { width: 340px; min-width: 340px; opacity: 1 }';
    var styles = document.createElement('style');
    styles.type = "text/css";
    styles.appendChild(document.createTextNode(css));
    css = '';
    document.body.appendChild(styles);

    window.YANDEXSCROLLER = self;

    self.start();

})();
// ==UserScript==
// @name         StatueOfLiberty Helper
// @namespace    nikku
// @license      MIT
// @version      0.2
// @description  Improves The Statue of Liberty Heritage website, adds image download links
// @author       nikku
// @match        *://heritage.statueofliberty.org/passenger-details/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=statueofliberty.org
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/498993/StatueOfLiberty%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/498993/StatueOfLiberty%20Helper.meta.js
// ==/UserScript==

function changeHtml(that, callback) {
    that.addEventListener('load', function() {
        let html = this.responseText;
        html = callback(html);
        Object.defineProperty(this, 'responseText', {writable: true});
        this.responseText = html;
    });
}

function processPassRecord(that) {
    const bgImg = '//assets-heritage.statueofliberty.org/product/MTEV26BW-RTEX-JEN4SU7ML70N.jpg';
    //const bgImg = '//assets-heritage.statueofliberty.org/product/107BNKAB-1MBL-PP6B0KZVT0TA.jpg';

    changeHtml(that, function(html) {
        html = html.replace('class="menifestLeftSide"', 'style="display: none;"');
        html = html.replace('class="pass-record"', `class="pass-record" style="background: url(${bgImg}) no-repeat; background-size: cover;"`);
        return html;
    });
}

function processShipManifest(that) {
    const centerFunc = `$("#image").attr('src', imgObj);
        $("#full_image").attr("href", imgObj);
        var origImg = imgObj.replace('-low', '').replace('.jpg', '.tif');
        $("#orig_image").attr("href", origImg);
        `;

    const origBtn = `<div class="slider-checkbox" style="padding: 6px 17px 6px 16px; background: #54c99e;">
        <a href="#" id="orig_image" style="color: #fff;">ORIGINAL</a></div>
    </div>  \n\n`;

    changeHtml(that, function(html) {
        html = html.replace('class="shipManifestLeft"', 'style="display: none;"');
        html = html.replace('onClick="showManifestBigImage()"', 'id="full_image" target="_blank"');
        html = html.replace(`$("#image").attr('src', imgObj);`, centerFunc);
        html = html.replace('</div>  \n\n', origBtn);
        return html;
    });
}

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            document.oncontextmenu = undefined;
        }, 1000);
    });

    const origOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    unsafeWindow.XMLHttpRequest.prototype.open = function() {
        if (arguments[1].startsWith('/passenger-record/')) {
            processPassRecord(this);
        } else if (arguments[1].startsWith('/text-passenger-list/')) {
            processShipManifest(this);
        }

        origOpen.apply(this, arguments);
    };
})();

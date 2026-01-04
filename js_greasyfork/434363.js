// ==UserScript==
// @name     CoolRom but Cooler
// @description	Fixes CoolRom.com.au to allow downloads of restricted titles while also improving the browsing experiece on Javascript-disabled browsers.
// @version		1.2.1
// @author       SkauOfArcadia
// @homepage https://skau.neocities.org/
// @contactURL https://t.me/SkauOfArcadia
// @match  *://coolrom.com/*
// @match  *://coolrom.com.au/*
// @run-at      document-start
// @grant none
// @namespace https://greasyfork.org/users/751327
// @downloadURL https://update.greasyfork.org/scripts/434363/CoolRom%20but%20Cooler.user.js
// @updateURL https://update.greasyfork.org/scripts/434363/CoolRom%20but%20Cooler.meta.js
// ==/UserScript==
/**
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
window.addEventListener("DOMContentLoaded", function() {
    if (location.pathname.indexOf('dlpop.php') > -1) {
        unsafeWindow.time = "0";
    } else if (location.pathname.indexOf('/roms/') > -1 || location.pathname.indexOf('/emulators/') > -1) {
        var romId = parseInt(location.pathname.split('/')[3].match(/\d+/), 10);
        var romDl = '/dlpop.php?id=' + romId;
        var romQueue = '/queue.php?act=add&id=' + romId;
        if (location.pathname.indexOf('/emulators/') > -1) {
            romDl = romDl + '&emu=nm'
        }
        var stringDl = 'Download Now';
        var stringQueue = 'Add to Queue';
        var stringMid = 'OR';
        var romTable = document.createElement('table');
        romTable.setAttribute('style', 'border:1px #000000 solid;padding-top:5px;');
        romTable.setAttribute('width', '300');
        romTable.setAttribute('height', '26');
        romTable.setAttribute('cellspacing', '0');
        romTable.setAttribute('cellpadding', '3');
        romTable.setAttribute('border', '0');
        romTable.setAttribute('bgcolor', '#333333');
        var romTbody = document.createElement('tbody');
        romTable.appendChild(romTbody);
        var romTr = document.createElement('tr');
        romTbody.appendChild(romTr);
        var dlTd = document.createElement('td');
        dlTd.setAttribute('valign', 'top');
        dlTd.setAttribute('align', 'center');
        romTr.appendChild(dlTd);
        var dlLink = document.createElement('a');
        dlLink.setAttribute('href', romDl);
        dlLink.setAttribute('title', stringDl);
        dlLink.setAttribute('target', '_blank');
        dlTd.appendChild(dlLink);
        var dlImg = document.createElement('img');
        dlImg.setAttribute('src', '/images/download_large.png');
        dlImg.setAttribute('width', '25');
        dlImg.setAttribute('height', '25');
        dlImg.setAttribute('border', '0');
        dlLink.appendChild(dlImg);
        var dlBreak = document.createElement('br');
        dlLink.appendChild(dlBreak);
        var dlFont = document.createElement('font');
        dlFont.setAttribute('size', '2');
        dlLink.appendChild(dlFont);
        var dlBold = document.createElement('b');
        dlFont.appendChild(dlBold);
        var dlText = document.createTextNode(stringDl);
        dlBold.appendChild(dlText);
        if (location.pathname.indexOf('/roms/') > -1) {
            var midTd = document.createElement('td');
            midTd.setAttribute('align', 'center');
            romTr.appendChild(midTd);
            var midBold = document.createElement('b');
            midTd.appendChild(midBold);
            var midText = document.createTextNode(stringMid)
            midBold.appendChild(midText);
            var queueTd = document.createElement('td');
            queueTd.setAttribute('valign', 'top');
            queueTd.setAttribute('align', 'center');
            romTr.appendChild(queueTd);
            var queueLink = document.createElement('a');
            queueLink.setAttribute('href', romQueue);
            queueLink.setAttribute('title', stringQueue);
            queueTd.appendChild(queueLink);
            var queueImg = document.createElement('img');
            queueImg.setAttribute('src', '/images/queue_large.png');
            queueImg.setAttribute('width', '25');
            queueImg.setAttribute('height', '25');
            queueImg.setAttribute('border', '0');
            queueLink.appendChild(queueImg);
            var queueBreak = document.createElement('br');
            queueLink.appendChild(queueBreak);
            var queueFont = document.createElement('font');
            queueFont.setAttribute('size', '2');
            queueLink.appendChild(queueFont);
            var queueText = document.createTextNode(stringQueue);
            queueFont.appendChild(queueText);
        }
        if (document.body.innerHTML.indexOf('dlpop.php') > -1) {
            var dlBtn = document.getElementsByClassName('container')[0]
            var con = document.createElement('center');
            con.appendChild(romTable);
            if (dlBtn.parentNode.nextSibling.nextSibling.nodeName == 'TABLE') {
                dlBtn.parentNode.nextSibling.nextSibling.remove();
            }
            dlBtn.parentNode.parentNode.insertBefore(con, dlBtn.parentNode.nextSibling);
            dlBtn.parentNode.remove();
        } else {
            var restText = document.getElementById('recommended').previousSibling.previousSibling;
            restText.parentNode.insertBefore(romTable, restText.nextSibling);
            restText.remove();
        }
        var downloader = document.getElementsByClassName('download_link');
        for (var x = 0; x < downloader.length; x++) {
            if (downloader[x].getAttribute('href').indexOf('/downloader.php') > -1) {
                downloader[x].setAttribute('href', romDl);
                downloader[x].setAttribute('target', '_blank');
            }
        }
    }
    var lazyImages = document.getElementsByTagName('img');
    for (var x = 0; x < lazyImages.length; x++) {
        if (lazyImages[x].hasAttribute('data-src') && lazyImages[x].className == 'lazy') {
            lazyImages[x].setAttribute('src', lazyImages[x].getAttribute('data-src'));
            lazyImages[x].removeAttribute('data-src');
            lazyImages[x].removeAttribute('class');
        }
    }
    var divLazy = document.getElementsByClassName('pg-lazy');
    for (var x = 0; x < divLazy.length; x++) {
        divLazy[x].remove();
    }
});
window.addEventListener("load", function() {
    if (location.pathname.indexOf('dlpop.php') > -1) {
        setTimeout(() => {
            var dwnUrl = document.getElementById('dl').innerHTML.split('://').pop().split('\"')[0];
            location.replace(location.protocol + '//' + dwnUrl);
        }, 100);
    }
    document.getElementById("m2_bot_captcha").remove();
});
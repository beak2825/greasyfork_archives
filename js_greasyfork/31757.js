// ==UserScript==
// @name         DNU_Hide
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Hide DNU box in Redacted.ch
// @author       lippy
// @match        https://redacted.ch/upload.php*
// @match        https://apollo.rip/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31757/DNU_Hide.user.js
// @updateURL https://update.greasyfork.org/scripts/31757/DNU_Hide.meta.js
// ==/UserScript==

const uploadPage = window.location.href.match('upload.php');
const linkAdded = false;

(function() {

    if(uploadPage) {
        var main = document.getElementById('content');

        main.children[0].className = 'box hidden';
        main.children[0].id = 'dnu_box';

        var head = document.getElementById('dnu_header');
        head.className = 'hidden';

        if(!linkAdded) {
            const newBoxHead = document.createElement('div');
            newBoxHead.className = 'head';
            newBoxHead.style = 'margin: 0px auto; width: 696px;';
            newBoxHead.innerHTML = `<strong>Do Not Upload List</strong><span style="float: right;"><a href="#" onclick="$('#dnu_box').gtoggle(); this.innerHTML = (this.innerHTML == 'Hide' ? 'Show' : 'Hide'); return false;" class="brackets">Show</a></span>`;
            main.insertBefore(newBoxHead, main.children[0]);
        }
    }
})();


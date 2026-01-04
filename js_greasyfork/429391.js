// ==UserScript==
// @name         Pornolab image preview
// @description  Lets you preview torrents first image by showing on hover on the tracker listing
// @namespace    https://pornolab.net/forum/index.php
// @version      0.1
// @description  try to take over the world!
// @author       tobij12
// @match        https://pornolab.net/forum/tracker.php*
// @require      https://cdn.jsdelivr.net/npm/axios@0.19.0/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/429391/Pornolab%20image%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/429391/Pornolab%20image%20preview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links = window.document.querySelectorAll('.med .tLink');

    links.forEach((el) => {
        el.opened = false
        el.onmouseenter = function() {
            el.opened = true

            axios.get(el.href).then(function(res) {
                if (el.opened !== true) {
                    return ;
                }
                let div = document.createElement('div');
                div.innerHTML = res.data;
                let source = div.querySelector('var.postImg').title;
                let img = document.createElement('img');

                img.src = source;
                img.classList.add('appendedHoverIMg');
                img.style = 'position: absolute; left: 350px; margin-top: 25px; width: auto; height: 700px';

                el.appendChild(img);
                el.style.textDecoration = 'underline';
          });
        };

        el.onmouseout = function() {
            el.opened = false
            const node = el.querySelector('.appendedHoverIMg');
            if (node !== null) {
                node.remove();
            }
        }
    });
})();
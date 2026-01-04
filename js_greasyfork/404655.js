// ==UserScript==
// @name         lanhuapp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       lbc
// @email        1585638808@qq.com
// @match        https://lanhuapp.com/web/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404655/lanhuapp.user.js
// @updateURL https://update.greasyfork.org/scripts/404655/lanhuapp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.curRemPanel = {}
    window.addRemPanel = function() {
        let a = window.dd.children[ window.dd.children.length - 1].cloneNode(true)
        let html = a.innerHTML.replace(/(\d*)px/g, function(match, a) {
            return `${a / 100}rem`
        })
        a.innerHTML = html
        window.dd.appendChild(a)
        window.curRemPanel = a
    }

    window.onload = function() {
       setTimeout(() => {
        let aside = dd.parentElement.parentElement.parentElement

        var mutationObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    console.log(aside.className)
                     if (aside.className.indexOf('open') > -1) {
                         setTimeout(() => {
                              window.addRemPanel()
                         }, 1000)
                     } else {
  window.curRemPanel.remove()
                     }
                }
            });
        });

        mutationObserver.observe(aside, {
            attributes: true,

            childList: true,
        });
       }, 1000)
    }

})();
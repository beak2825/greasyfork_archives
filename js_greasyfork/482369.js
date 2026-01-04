// ==UserScript==
// @name         beautify baidu
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  make baidu beautiful
// @author       lgx
// @match        https://www.baidu.com/s*
// @match        https://www.baidu.com/baidu*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482369/beautify%20baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/482369/beautify%20baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById('con-right-bottom')?.remove()
    const rcht = 'right-ceiling-has-tag'
    for (let sheet of document.styleSheets) {
        try {
            const rule = [...sheet.rules].find(rule => rule.selectorText?.includes(`.${rcht}`))
            if (rule) {
                rule.style.top = '148px'
            }
        } catch {}
    }
    if (document.querySelector('#searchTag')) {
        try {
            let r=$.prototype.removeClass,a=$.prototype.addClass,ww=document.getElementById('wrapper_wrapper'),cw=document.getElementById('con-ceiling-wrapper')
            $.prototype.addClass=function(cls){cls!==rcht&&a.call(this,cls);if(cls==='tag-fixed'){ww.style.marginTop='49px'}}
            $.prototype.removeClass=function(cls){cls!==rcht&&r.call(this,cls);if(cls==='tag-fixed')ww.style.marginTop=''}
            window.addEventListener('scroll',e=>cw.classList[cw.previousElementSibling.getBoundingClientRect().bottom<=128?'add':'remove'](rcht))
        } catch {}
    }
})();

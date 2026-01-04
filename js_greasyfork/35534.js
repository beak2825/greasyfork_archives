// ==UserScript==
// @namespace    https://greasyfork.org/zh-TW/users/160335-planetoid
// @name         Show image directly
// @description  Disable the lazy loading images on webpage. The code was modified from stackoverflow https://stackoverflow.com/questions/19333651/change-attribute-from-data-src-to-src-without-jquery
// @license      CC-BY-SA-3.0; https://creativecommons.org/licenses/by-sa/3.0/
// @version      0.5
// @match        https://mp.weixin.qq.com/*
// @match        http://www.xueui.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35534/Show%20image%20directly.user.js
// @updateURL https://update.greasyfork.org/scripts/35534/Show%20image%20directly.meta.js
// ==/UserScript==

// ==OpenUserJS.org==
// @author       planetoid
// ==/OpenUserJS.org==

(function() {
    'use strict';

    var img_list = document.getElementsByTagName('img');
    for (var i=0; i< img_list.length; i++) {
        if(img_list[i].getAttribute('data-src')) {
            // @match https://mp.weixin.qq.com/*
            img_list[i].setAttribute('src', img_list[i].getAttribute('data-src'));
        }else if(img_list[i].getAttribute('original')) {
            // @match http://www.xueui.cn/*
            img_list[i].setAttribute('src', img_list[i].getAttribute('original'));
        }
    }
})();
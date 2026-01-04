// ==UserScript==
// @name         蹦迪_崩壞版
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @description  be made by jay13345
// @author       You
// @match        *://*/*
// @icon         https://tw.images.search.yahoo.com/images/view;_ylt=AwrtkYrkDZBlUiUO50Jt1gt.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzk4YjcyZGY3OGNjY2I4NmYwOWI4NTAwYzliMDkwYzQxBGdwb3MDNARpdANiaW5n?back=https%3A%2F%2Ftw.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dh%25E5%25BD%25A9%25E8%2589%25B2%26type%3DE211TW885G91785%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D4&w=700&h=700&imgurl=img.88tph.com%2Ftphc.1%2Fproduction%2F20180514%2F12523008.jpg&rurl=https%3A%2F%2Fwww.88tph.com%2Fsucai%2F12523008.html&size=155.0KB&p=h%E5%BD%A9%E8%89%B2&oid=98b72df78cccb86f09b8500c9b090c41&fr2=piv-web&fr=mcafee&tt=%E5%BD%A9%E8%89%B2%E5%AD%97%E6%AF%8DH_%E5%9B%BE%E5%93%81%E6%B1%87&b=0&ni=21&no=4&ts=&tab=organic&sigr=7kHTKyhRVFxP&sigb=fqFFUUJ4QOq2&sigi=atIc5QCU..ej&sigt=TviK.OJpcn93&.crumb=OIaSTx2TEpt&fr=mcafee&fr2=piv-web&type=E211TW885G91785
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483461/%E8%B9%A6%E8%BF%AA_%E5%B4%A9%E5%A3%9E%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/483461/%E8%B9%A6%E8%BF%AA_%E5%B4%A9%E5%A3%9E%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
var colors = ["black", "red", "yellow", "blue", "green", "purple", "gray"];
var i = 0;
setInterval(function() {
  document.body.style.color = colors[i];
  i = (i + 1) % colors.length;
}, 100);
})();

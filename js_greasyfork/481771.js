// ==UserScript==
// @name         在新标签页中打开链接
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  以在新标签页中打开链接
// @author       wild
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481771/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/481771/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var links = document.getElementsByTagName('a');
    if(window.location.href.indexOf('csdn')!==-1){
        for (let i = 0; i < links.length; i++) {
            let idAncestor = links[i].closest('[id="toolbarBox"]');
            if (!idAncestor) {
                links[i].setAttribute('target', '_blank');
            }
        }
    }else if(window.location.href.indexOf('github')){
        for(let i = 0;i <links.length;i++){
            let parentElement = links[i].closest('nav');
            let selectMenuList = links[i].classList.contains('SelectMenu')
            if(!parentElement && !selectMenuList){
                links[i].setAttribute('target','_blank')
            }

        }

    }else{
        for (let i = 0; i < links.length; i++) {
            let parentElement = links[i].closest('nav');
            let navigationRoleAncestor = links[i].closest('[role="navigation"]');
            if (!parentElement && !navigationRoleAncestor) {
                links[i].setAttribute('target', '_blank');
            }
        }
    }
})();
// ==UserScript==
// @name         BlockSuckerHuang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  BlockSuckerHuang!
// @author       ...
// @match        https://pincong.rocks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382212/BlockSuckerHuang.user.js
// @updateURL https://update.greasyfork.org/scripts/382212/BlockSuckerHuang.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var as = document.getElementsByTagName('a')
    for(var i in as){
        var node = as[i];

        if(node.hasAttribute == undefined){
            continue;
        }

        if(!node.hasAttribute('data-id')){
            continue;
        }
        var id = node.getAttribute('data-id');
        if(id.toString() != '3700'){
            continue;
        }

        var classType = node.getAttribute('class');
        if(classType == 'aw-user-name'){
            node.parentNode.style = 'display:none';
        }else if(classType.indexOf('aw-user-img') >= 0){
            node.parentNode.parentNode.style = 'display:none';
        }
    }
})();
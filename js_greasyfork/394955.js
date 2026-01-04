// ==UserScript==
// @name         novel reader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        *://*.wutuxs.com/*.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394955/novel%20reader.user.js
// @updateURL https://update.greasyfork.org/scripts/394955/novel%20reader.meta.js
// ==/UserScript==
var getEl = function(q, c) {//获取句柄
    if (!q) return;
    return (c || document).querySelector(q);
};

var getEls = function(q, c) {
    return [].slice.call((c || document).querySelectorAll(q));
};

function moveNode(q,c){
    var node=getEl(q);
    if(node==null) return;
    c.appendChild(node);
}
function Enhance() {
    console.log('ssss');
//    'use strict';
//    if(getEl('#bboy1')!=null){
//        return;}
    var bb=getEl('body');
    var aa=document.createElement('body');
//    aa.id='bboy';
    moveNode('#nr_title',aa);
    moveNode('.nr_page',aa);
    moveNode('#nr',aa);
    var cc=document.createElement('div');
    cc.innerHTML="<input type='button' style='width: 100%;' value='reload 。。。。'></input>";

   // moveNode('.nr_page>table',cc);
    var node=getEl('.nr_page>table');
    if(node!=null) {
        node.style.width='100%';
        cc.appendChild(node);
    }else {
        moveNode('input+table',cc);}
    aa.appendChild(cc);

    bb.remove();
    getEl('html').appendChild(aa);
    getEl('input').onclick=Enhance;
    getEl('#nr_title').onclick=Enhance;
    // moveNode('',aa);
    // moveNode('',aa);
    // moveNode('',aa);
//document.querySelector('#nr_title')
    // Your code here...
};

Enhance();
var timeoutId = window.setTimeout(Enhance,1000);
document.addEventListener('load', Enhance);
document.addEventListener('DOMContentLoaded', Enhance);
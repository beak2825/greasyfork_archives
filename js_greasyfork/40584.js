// ==UserScript==
// @name         Simple Faster Flash
// @name:zh-CN   Flash 简单优化
// @namespace    https://greasyfork.org/users/159546
// @version      1.0.1
// @description  Faster flash from simple way.
// @description:zh-CN 略微提升 Flash 元素的性能。
// @author       LEORChn
// @include      *
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40584/Simple%20Faster%20Flash.user.js
// @updateURL https://update.greasyfork.org/scripts/40584/Simple%20Faster%20Flash.meta.js
// ==/UserScript==
var done=0,countdown=10 *5;// 10 sec
(function(){
	recheck();
})();
function recheck(){
    __object();
    __embed();
    if(pageloaded() && finaly())return;
    setTimeout(recheck,200);
}
function __object(){
    try{
    for(var i=0,v=document.getElementsByTagName('object'),len=v.length;i<len;i++)
        if(v[i].type.toLowerCase().includes('flash')){
            var qNode;
            for(var i2=0,v2=v[i].childNodes,l2=v2.length;i2<l2;i2++)
                if(v2[i2].name && v2[i2].name.includes('quality')){//maybe multi object elements nesting. Like news.163.com
                    qNode=v2[i2];
                    break;
                }
            if(qNode==undefined){
                qNode=document.createElement('param');
                qNode.name='quality';
                v[i].appendChild(qNode);
            }
            if(qNode.value!='low'){
                qNode.value='low';
                done++;
            }
        }
    }catch(e){}
}
function __embed(){
    for(var i=0,v=document.getElementsByTagName('embed'),len=v.length;i<len;i++)
        if(v[i].type.toLowerCase().includes('flash') && !v[i].outerHTML.includes('quality="low"')){
            v[i].outerHTML=v[i].outerHTML.replace('<embed','<embed quality="low"');
            done++;
        }
}
function pageloaded(){ return document.readyState.toLowerCase()=='complete'; }
function finaly(){
    countdown--;//Use count down because some flash element using js to add in page. Like live.bilibili.com...
    if(countdown>0)return false;
    try{console.log('Simple Faster Flash: Faster '+done+' flash element(s).');}catch(e){}
    return true;
}

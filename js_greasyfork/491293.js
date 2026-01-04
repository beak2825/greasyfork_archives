// ==UserScript==
// @name         浏览器护眼模式 by: lccccccc [52pojie.cn]
// @version     2024-04-04
// @description  适用于Chrome浏览器的护眼模式!
// @author       lccccccc [52pojie.cn] https://www.52pojie.cn/home.php?mod=space&uid=2104472
// @match    http*://*/*
// @Icon       https://down.52pojie.cn/Logo/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3.jpg
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace   https://www.52pojie.cn/home.php?mod=space&uid=2104472
// @downloadURL https://update.greasyfork.org/scripts/491293/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%20by%3A%20lccccccc%20%5B52pojiecn%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/491293/%E6%B5%8F%E8%A7%88%E5%99%A8%E6%8A%A4%E7%9C%BC%E6%A8%A1%E5%BC%8F%20by%3A%20lccccccc%20%5B52pojiecn%5D.meta.js
// ==/UserScript==
  
var alpha = GM_getValue('alpha');
function setAlpha(){
    var _alpha = prompt('输入护眼模式效果值的数字(0.1~0.9), 数字越大, 效果越强: ',alpha);
    if (_alpha!=null){
        if (isNaN(parseInt(_alpha))){
            if(confirm('输入数据有误! 请重新输入! ')){
                return setAlpha();
            }
            return;
        }
        GM_setValue('alpha',alpha=_alpha);
        if (GM_getValue('enabled')==1){
            document.getElementById('eyeProtection').backgroundColor = '';
            document.getElementById('eyeProtection').style.cssText += `background-color: rgba(255, 200, 150, ${alpha});`;
        } else {
            alert('设置成功, 需要启用脚本才能看见效果哦! ');
        }
    }
}
  
(function() {
    'use strict';
    if(typeof alpha == "undefined" || typeof alpha == "null"){
        alpha=0.3;
    }
  
    if(typeof GM_getValue('enabled') == "undefined" || typeof GM_getValue('enabled') == "null"){
        GM_setValue('enabled',1);
    }
  
  
    GM_registerMenuCommand(`[${GM_getValue('enabled')==1?'√':'X'}] 启用脚本`, ()=>{
        GM_setValue('enabled',1-GM_getValue('enabled'))
        if(confirm('刷新立即生效, 是否立即刷新? ')) {
            window.location.reload()
        }
        return;
    });
    GM_registerMenuCommand("设置护眼模式效果", setAlpha);
  
    if (GM_getValue('enabled')==0){
        return;
    }
  
    var eyeProtection = document.createElement('div');
    eyeProtection.classList.add('eyeProtection');
    eyeProtection.id = 'eyeProtection';
    eyeProtection.style.zIndex = '32767';
    eyeProtection.style.pointerEvents = 'none';
    eyeProtection.style.position = 'fixed';
    eyeProtection.style.top = '0px';
    eyeProtection.style.left = '0px';
    eyeProtection.style.width = '100%';
    eyeProtection.style.height = '100%';
    eyeProtection.style.cssText += `background-color: rgba(255, 200, 150, ${alpha});`;
    document.body.appendChild(eyeProtection);
})();
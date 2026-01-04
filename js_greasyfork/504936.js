// ==UserScript==
// @name         Temu关闭弹窗
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  Temu卖家中心，一键关闭弹窗
// @author       Adrain
// @match        *://*.kuajingmaihuo.com/*
// @icon         https://bstatic.cdnfe.com/static/files/sc/favicon.ico
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/504936/Temu%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/504936/Temu%E5%85%B3%E9%97%AD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

function RemoveTemuDialogs(){
    // Temu 关闭弹窗(通配符匹配)
    let elements_target=document.querySelectorAll('[class*="MDL_mask_"][data-testid="beast-core-modal-mask"]');
    if(undefined!=elements_target && elements_target.length>0)
    {
        Array.from(elements_target).forEach(function(element) {
            //element.style.display='none';
            if(undefined!=element.nextElementSibling&&element.nextElementSibling.hasAttribute('class'))
            {
                let e_classList=element.nextElementSibling.classList;
                if(null!=e_classList&&undefined!=e_classList)
                {
                    Array.from(e_classList).forEach(function(className) {
                        if(className.startsWith('MDL_outerWrapper_'))
                        {
                            if(null!=element.nextElementSibling.querySelector('[data-testid="beast-core-modal-icon-close"]'))
                            {
                                element.nextElementSibling.querySelector('[data-testid="beast-core-modal-icon-close"]').parentNode.click();
                            }
                        }
                    });
                }
            }
        });
    }

    // Temu 删除弹窗(通配符匹配)
    elements_target=document.querySelectorAll('[class*="MDL_mask_"][data-testid="beast-core-modal-mask"]');
    if(undefined!=elements_target && elements_target.length>0)
    {
        Array.from(elements_target).forEach(function(element) {
            //element.style.display='none';
            if(undefined!=element.nextElementSibling&&element.nextElementSibling.hasAttribute('class'))
            {
                let e_classList=element.nextElementSibling.classList;
                if(null!=e_classList&&undefined!=e_classList)
                {
                    Array.from(e_classList).forEach(function(className) {
                        if(className.startsWith('MDL_outerWrapper_'))
                        {
                            //element.nextElementSibling.style.display='none';
                            element.nextElementSibling.remove();
                            element.remove();
                        }
                    });
                }
            }
        });
    }
    // 新类型的弹窗
    let element_btns=document.body.querySelectorAll('.PT_outerWrapper_5-111-0 .PT_portalMain_5-111-0 .BTN_outerWrapperBtn_5-111-0');
    if(element_btns.length>0)
    {
        Array.from(element_btns).forEach(function(element) {
            if('我知道了'==element.textContent.trim())
            {
                element.click();
            }
        });
    }
    //隐藏弹窗(通配符匹配 , data-testid 可能是空值)
    elements_target=document.querySelectorAll('[class*="MDL_mask_"][data-testid]');
    if(undefined!=elements_target && elements_target.length>0)
    {
        Array.from(elements_target).forEach(function(element) {
            element.style.display='none';
            if(undefined!=element.nextElementSibling&&element.nextElementSibling.hasAttribute('class'))
            {
                let e_classList=element.nextElementSibling.classList;
                if(null!=e_classList&&undefined!=e_classList)
                {
                    Array.from(e_classList).forEach(function(className) {
                        if(className.startsWith('MDL_outerWrapper_'))
                        {
                            element.nextElementSibling.style.display='none';
                        }
                    });
                }
            }
        });
    }
    //弹窗 全部消息-关闭
    element_btns=document.body.querySelectorAll('[class*=PT_outerWrapper_] [data-testid=beast-core-portal-main] [data-testid=beast-core-icon-close]');
    if(element_btns.length>0)
    {
        Array.from(element_btns).forEach(function(e,idx) {
            let node_new=document.createElement('a');
            e.appendChild(node_new);
            e.lastChild.click();
        });
    }
}

(function() {
    'use strict';

    // Your code here...
    RemoveTemuDialogs();
})();
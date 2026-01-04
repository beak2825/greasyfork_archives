// ==UserScript==
// @name         baidu fanyi radius and shadow
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  百度翻译添加圆角和阴影以及删除广告
// @author       宏斌
// @match        https://fanyi.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424478/baidu%20fanyi%20radius%20and%20shadow.user.js
// @updateURL https://update.greasyfork.org/scripts/424478/baidu%20fanyi%20radius%20and%20shadow.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addRadiusAndShadow (className,widthPercent) {
            const targetElement = document.getElementsByClassName(className)[0];
            handleStyled(targetElement,widthPercent);
    };

    function handleStyled (targetElement,widthPercent) {
        targetElement.style['border-radius']='10px';
        targetElement.style['box-shadow']='2px 2px 10px #ccc';
        targetElement.style['overflow']='hidden';
        if(widthPercent) targetElement.style['width'] = widthPercent+'%';
    }

            addRadiusAndShadow('trans-left',49.5);
            addRadiusAndShadow('trans-right',49.5);
            addRadiusAndShadow('history-wrap',99);
            addRadiusAndShadow('trans-input-wrap');
            //右侧广告
            const transRight = document.getElementsByClassName("trans-right")[1];
            transRight.parentNode.removeChild(transRight);
    //翻译结果
     const content = document.getElementById("left-result-container");

      const config = { attributes: false, childList: true, subtree: false };

      // 当观察到突变时执行的回调函数
      const callback = function (mutationsList) {
        const targetElement = mutationsList[0].target.children[0];
        if (targetElement && targetElement.nodeName) {
          handleStyled(targetElement);
        }
      };

      // 创建一个链接到回调函数的观察者实例
      const observer = new MutationObserver(callback);

      // 开始观察已配置突变的目标节点
      observer.observe(content, config);
    //搜索内容直接打开百度搜索
//    https://www.baidu.com/s?ie=UTF-8&wd=%E5%93%88%E5%93%88
    const sBtn = document.createElement('button')
    sBtn.id="sbtn"
    sBtn.innerText="search"
    $(".input-wrap").append(sBtn)
    $("#sbtn").css({position: 'absolute',bottom: 0,right: 0,border:'none','border-top-left-radius':'5px',cursor: 'pointer',height:'2rem','text-transform':'uppercase',color:"#fff",'background-color':"#999"})
    $("#sbtn").on('click',()=>{
        window.open("https://www.baidu.com/s?ie=UTF-8&wd="+$("#baidu_translate_input").val(),'newwindow');
    })
})();
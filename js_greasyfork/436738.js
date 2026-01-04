// ==UserScript==
// @namespace xxx(修改自yunyuyuan)
// @name 闪现关闭知乎登录框&自动展示问答描述详情&链接无缝跳转
// @description 由于之前的处理逻辑不太好用，改成闪现的形式，隐藏烦人的知乎登录框，点击链接直接跳转不会提示有风险(谨慎操作)
// @match *://*.zhihu.com/*
// @license MIT 
// @version 0.0.1.20201202053300
// @downloadURL https://update.greasyfork.org/scripts/436738/%E9%97%AA%E7%8E%B0%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E9%97%AE%E7%AD%94%E6%8F%8F%E8%BF%B0%E8%AF%A6%E6%83%85%E9%93%BE%E6%8E%A5%E6%97%A0%E7%BC%9D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/436738/%E9%97%AA%E7%8E%B0%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E6%A1%86%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E9%97%AE%E7%AD%94%E6%8F%8F%E8%BF%B0%E8%AF%A6%E6%83%85%E9%93%BE%E6%8E%A5%E6%97%A0%E7%BC%9D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function (){
    'use strict';
    // 闪现处理登录弹窗
    var intervalId = null;
    var count = 0;
    intervalId = setInterval(function(){
        if (count > 10) {
            clearInterval(intervalId)
        }
        count = count + 1
        const c = document.querySelector(".Button.Modal-closeButton.Button--plain")
        if (c != null){
            c.click()
            console.log("close login.")
            clearInterval(intervalId)
        }
        return
    },10);

    // 自动显示查看内容
    var intervalShowDetailId = null;
    var countShowDetail = 0;
    intervalShowDetailId = setInterval(function(){
        if (countShowDetail > 10) {
            clearInterval(intervalShowDetailId)
        }
        countShowDetail = countShowDetail + 1
        const c = document.querySelector(".QuestionRichText-more")
        if (c != null){
            c.click()
            console.log("show detail")
            clearInterval(intervalShowDetailId)
        }
        return
    },10);

    // document.addEventListener('click', (e)=>{
    //  const c = document.querySelector("body > div:nth-child(29) > div > div > div > div.Modal.Modal--default.signFlowModal > button")
    // if (c != null){
    //     c.click()
    // }
    //     console.log("close login")
    // })

    // const style = document.createElement("style");
    // style.innerHTML = "html{overflow: auto !important}.Modal-enter-done{display: none !important}";
    // document.head.appendChild(style);
    // link.zhihu.com
    document.addEventListener('click', (e)=>{
        let now = e.target;
        while (now) {
            if (now.tagName.toLowerCase() === 'a' && now.hasAttribute('href')) {
                checkIsZhihuLink(now.getAttribute('href'), e);
            }
            now = now.parentElement;
        }
    })
    const checkIsZhihuLink = (s, e)=> {
        const matcher = s.match(/https?:\/\/link\.zhihu\.com\/?\?target=(.+)$/);
        if (matcher) {
            e.stopPropagation();
            e.preventDefault();
            window.open(decodeURIComponent(matcher[1]));
        }
    }
    })()

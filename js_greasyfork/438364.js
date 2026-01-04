// ==UserScript==
// @name         外链自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  自动跳转链接，自动完成CSDN、掘金、简书、知乎、贴吧、码云、QQ、LeetCode等网站的跳转询问界面的跳转
// @author       myaijarvis
// @icon         https://greasyfork.org/packs/media/images/blacklogo16-5421a97c75656cecbe2befcec0778a96.png

// @match        *://link.csdn.net/*
// @match        *://link.juejin.cn/*
// @match        *://link.zhihu.com/*
// @match        *://www.jianshu.com/go-wild*
// @match        *://jump.bdimg.com/safecheck/index?url=*
// @match        *://gitee.com/link*
// @match        *://c.pc.qq.com/*.html?pfurl=*
// @match        *://leetcode-cn.com/link/?target=*
// @match        *://leetcode.cn/link/?target=*
// @match        *://hd.nowcoder.com/link.html?target=*

// @require      http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.8.0.js
// @require      https://www.layuicdn.com/layui-v2.6.8/layui.js
// @resource layer https://www.layuicdn.com/layui-v2.6.8/css/modules/layer/default/layer.css
// @run-at       document-end
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/438364/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438364/%E5%A4%96%E9%93%BE%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("layer"));

(function() {
    'use strict';
    /*
      原理：获取外链的链接地址，然后直接跳转，而不是点击按钮触发网站跳转（其他脚本常见做法）
      代码比较少，新手可以学习一下
    */
    const url=document.URL
    let target_url=''

    if(url.match(/jump.bdimg.com/)){ // 贴吧  url路径上的跳转地址加密了，只能寻找其他方法
        //target_url= $('div.warning_info p.link').val();
        target_url=document.querySelector("body > div.warning_wrap.clearfix > div.warning_info > p.link").innerText; // 贴吧jq无法获取值，用js
        //debugger;
    }else if(url.match(/jianshu.com\/go-wild/)){
        target_url=url.split("url=")[1]
    }else if(url.match(/c\.pc\.qq\.com\/.*?\.html\?pfurl=/)){
        target_url=url.split("pfurl=")[1]
        target_url=target_url.split("&pfuin=")[0]
    }else{
        // 适用于通知路径在url上做参数的 比如https://link.csdn.net/?target=https%3A%2F%2Ftieba.baidu.com%2Fp%2F3303958322
        //debugger;
        target_url=url.split("target=")[1]
    }
    target_url=decodeURIComponent(target_url) // 编码
    console.log(target_url)
    layui.layer.msg('正在跳转', {
        time: 60000 //一段时间后关闭（如果不配置，默认是3秒）
    });
    // 0.5秒后跳转
    setTimeout(()=>{
        window.location.href = target_url;
    },500)
})();
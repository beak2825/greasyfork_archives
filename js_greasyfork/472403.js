// ==UserScript==
// @name         CSDN免登录复制
// @namespace    wzs
// @version      0.2.1
// @description  简化CSDN复制，无需登录，只要双击代码区域即可复制
// @author       1440972474@qq.com
// @match       https://blog.csdn.net/*
// @icon         https://profile-avatar.csdnimg.cn/default.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472403/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/472403/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function(){
    // console.log("我的第一个脚本引擎")//D:\TensorFlow-\autodemo01\webscript\demo01.js
    let codes=document.querySelectorAll("code")
    let titles=document.querySelectorAll("div[data-title='登录后复制']")
    // console.log(titles)


    titles.forEach(t=>{
        console.log(t.getAttribute("data-title"))
        t.setAttribute("data-title","双击复制")
    })

    codes.forEach(e=>{
        console.log("aaa",e.contentEditable)
        e.contentEditable=true
        e.addEventListener("dblclick",function(v){
            // console.log("dianj事件",this.innerText)
            // this.select()
            navigator.clipboard.writeText(this.innerText).then(()=>{
                alert("复制成功")
            })
        })
    })

 //    inp.setAttribute("value","哈哈哈哈")
 })();//主要分号
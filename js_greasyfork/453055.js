// ==UserScript==
// @name         反CSDN
// @namespace    http://tampermonkey.net/
// @version      0.3.2
// @description  用于CSDN，无需关注即可阅读,文章转PDF打印，不登录复制禁止登录弹窗
// @author       Li Sipeng
// @match        https://blog.csdn.net/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/453055/%E5%8F%8DCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/453055/%E5%8F%8DCSDN.meta.js
// ==/UserScript==

(
    function() {
    'use strict';
    /* 1、不关注即可阅读 */
    let btnNode = document.querySelector("#mainBox > main > div.hide-article-box.hide-article-pos.text-center");
    function hideConcerns(){
        document.querySelector('#article_content').style.height='auto';
        document.querySelector("#mainBox > main > div.hide-article-box.hide-article-pos.text-center").style.display='none';
    }
    if(btnNode!=null){
        console.log("1、反CSDN，你我有责");
        btnNode.innerHTML = "<p class='btn'>不关注也可以阅读哦>>></p>";
        btnNode.style = " color: red;font-size: 25px;" 
        btnNode.addEventListener('click',hideConcerns)
    }
    

    /* 2、打印功能 */
    let ulNode = document.querySelector("#toolBarBox > div > div.toolbox-middle > ul");
    if(ulNode != null){
        let span = document.createElement("span");
        span.style.color="red";
        span.style.fontWeight="900";
        span.style.cursor = "pointer";
        span.innerHTML="打印";
        ulNode.appendChild(span);
        span.addEventListener('click',()=>{
            console.log("2、反CSDN，你我有责");
            alert("建议打印之前先进入设置将浏览器字体适当调大（推荐：字号22，最小字号18）\r点击确定后按ctrl+p进行打印");
            if(btnNode!=null) hideConcerns();
            /*从被选元素body移除一个类页面样式*/
            $("body").removeClass("nodata");
            /*删除顶部导航*/
            $("#csdn-toolbar").remove();
            /*删除左侧导航*/
            $("aside").remove();
            /*删除右侧悬浮*/
            $(".csdn-side-toolbar").remove();
            /*删除CSDN文章上方*/
            $(".article-header-box .article-info-box").remove();
            $("#blogColumnPayAdvert").remove();
            /*展开CSDN文章中被隐藏的代码段：从被选元素pre class="set-code-hide prettyprint"移除一个类页面样式*/
            $('pre[class="set-code-hide prettyprint"]').removeClass("set-code-hide");
            /*删除CSDN文章中被隐藏的代码段上面的遮罩*/
            $('div[class="hide-preCode-box"]').remove();
            /*删除CSDN文章下方*/
            $(".more-toolbox-new").remove();
            $(".reward-box-new").remove();
            $(".recommend-tit-mod").remove();
            $(".blog-footer-bottom").remove();
            /*删除CSDN文章下方评论、其他博客链接*/
            $(".comment-box, .recommend-box, #csdn-shop-window, .template-box").remove();
            /*删除CSDN文章下方公众号链接、笑脸评级*/
            $("#blogExtensionBox, #recommendNps").remove();
            /*修改CSDN文章css样式为》默认样式'display':'contents'或自定义宽度'width':'1100px'或自定义宽度'width':'825px'*/
            $("main").css({'width':'900px'});
            /*弹出打印窗口》另存为PDF文件*/
            window.print();
        })
    }

    /* 3、不登录复制，禁止所有登录弹窗 */
    let isLogin = document.querySelector(".hasAvatar");
    let isCode = document.querySelectorAll("code");
    if(isLogin === null && isCode != null){
        console.log("3、反CSDN，你我有责")
        let WinObj = parent || window;
        let styleTag ="<style>.passport-login-container{display:none;}</style>"
        let html = WinObj.document.head.innerHTML;
        WinObj.document.head.innerHTML = html + styleTag;   //给当前页面添加css样式,不让弹窗
        for(let item of isCode){
            item.style.userSelect = "text";   //允许扩选复制
            item.lastChild.dataset.title = "我不登录也要扩选复制";   //改变提示文字
            let copyBtn = document.querySelector(".hljs-button");
            copyBtn.addEventListener("click",()=>{
                console.log(copyBtn.parentNode.innerText);
                var url=copyBtn.parentNode.innerText;
                var input = document.createElement('input');
                document.body.appendChild(input);
                input.setAttribute('value', url);
                input.select();
                document.execCommand("copy"); // 执行浏览器复制命令
                document.body.removeChild(input);
                item.lastChild.dataset.title = "复制成功！";   //改变提示文字
            });
        }

    }



})();
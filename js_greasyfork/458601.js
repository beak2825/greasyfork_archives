// ==UserScript==
// @name         CSDN超强防护
// @namespace    https://viayoo.com/
// @version      1.3
// @description  手机端专用！自动展开全部内容，免登录复制，去除广告，增加搜索框，手机端专用。
// @author       呆毛飘啊飘
// @run-at       document-end
// @match        *://*.csdn.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458601/CSDN%E8%B6%85%E5%BC%BA%E9%98%B2%E6%8A%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/458601/CSDN%E8%B6%85%E5%BC%BA%E9%98%B2%E6%8A%A4.meta.js
// ==/UserScript==

(function() {

//注入css使所有内容可复制
var n = document.createElement("style");
n.type = "text/css";
n.innerHTML = "*{user-select: auto!important;}";
document.body.appendChild(n);

//屏蔽的元素
var k=".open,.vip-info-wrap,.siderbar-box,.article-show-more,.luck-draw-modal-warp,.ads,.ml-12,.feed-Sign-weixin,.feed-Sign-span,.blind_box,.loginFnAdd,.icon-line,.loginTag,.openApp,.add-firstAd,.passport-login-container,.follow,.readall_box,.m_toolbar_left_app_btn,.openApp,.btn_open_app_prompt_item,.passport-login-mark,.weixin-shadowbox,.wap-shadowbox";

//屏蔽元素
document.querySelectorAll(k).forEach(e=>e.remove());
setTimeout(() => {document.querySelectorAll(k).forEach(e=>e.remove());}, 1000);
setTimeout(() => {document.querySelectorAll(k).forEach(e=>e.remove());}, 2000);

//用于复制的函数
function copyText(txt) {
var x=document.body.scrollTop;
var y=document.documentElement.scrollTop;
const ta = document.createElement('textarea');
ta.value = txt;
ta.style.position = 'absolute';
ta.style.opacity = '0';
ta.style.left = '-999999px';
ta.style.top = '-999999px';
document.body.appendChild(ta);
ta.focus();
ta.select();
document.execCommand('copy');
document.body.removeChild(ta);
window.scrollTo(x,y);
};

//添加搜索框
var cdstyle = document.createElement("style");
cdstyle.type = "text/css";
cdstyle.innerHTML = "#article,.article_content,#content_views,.main-content .user-article{height: auto !important;overflow: auto !important;};.article_content{overflow:visible !important; height:auto !important;}#sskbj{position: fixed;left:10%;width:80%; height:35px; display: flex;z-index: 10000;top:6px;right:0px;}#sskbj input[type=text] {width: 20%;position: fixed;right:10%;height:40px;box-sizing: border-box;border: 2px solid #ccc;border-radius: 4px;font-size: 16px;background-color: white;padding: 12px 12px 12px 12px;-webkit-transition: width 0.4s ease-in-out;transition: width 0.4s ease-in-out;}#sskbj input[type=text]:focus {width:80%;};"+k+"{display:none;}";
document.body.appendChild(cdstyle);
var divv = document.createElement("div");
divv.id = "sskbj";
divv.innerHTML = "<form action='https://so.csdn.net/wap'><input type='text' name='q' placeholder='搜索..'></form>";
document.body.appendChild(divv);

setTimeout(function(){

//展开所有代码块内容
$('.hide-preCode-bt').click();

//修改按钮使不登录可以复制
$(".hljs-button").attr("data-title", "直接复制");
$(".hljs-button").click(function(){copyText(this.parentNode.innerText);
$(".hljs-button").attr("data-title", "复制成功");
setTimeout(function(){$(".hljs-button").attr("data-title", "直接复制");},1500);});

},1500);

//修改按钮使不登录可以复制
setTimeout(function() {

document.querySelectorAll('.copy-btn').forEach(function(e) {
    e.innerHTML = '直接复制';
    e.onclick = function() {
        copyText(this.parentNode.innerText.replace(/\n\n直接复制/g,''));
        this.innerHTML = '复制成功';
        setTimeout(function() {
            document.querySelectorAll('.copy-btn').forEach(function(e) {
                e.innerHTML = '直接复制';
            });
        }, 1500);
    }
});
}, 1500);
})();

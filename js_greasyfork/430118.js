// ==UserScript==
// @name         微博免登陆查看全文、CSDN免关注展示全文
// @namespace    zzy，q82664730
// @version      4.6
// @description  不用登陆即可查看全文，替换原来的查看全文文字以及链接，点击直接跳转到全文。不用关注博主即可查看全文
// @author       zzy
// @match        *weibo.com/*
// @match        *://www.weibo.com/*
// @match        *blog.csdn.net/*
// @include      *blog.csdn.net/article/details/*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @icon         https://img.t.sinajs.cn/t6/style/images/global_nav/WB_logo.png?id=1404211047727
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430118/%E5%BE%AE%E5%8D%9A%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%E3%80%81CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E5%B1%95%E7%A4%BA%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/430118/%E5%BE%AE%E5%8D%9A%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%E3%80%81CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E5%B1%95%E7%A4%BA%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==
 
(function() {
  //'use strict';
  function showLink(){
    for(var i=0;i<document.querySelectorAll(".WB_text a.WB_text_opt").length;i++){
      var pa = document.querySelectorAll(".WB_text a.WB_text_opt")[i].parentNode;
      var lj = document.createElement("a");
      lj.href = document.querySelectorAll(".WB_text a.WB_text_opt")[i].href;
      document.querySelectorAll(".WB_text  a.WB_text_opt")[i].remove();
      pa.appendChild(lj);
      lj.innerHTML = "<span class='addA' style='color:#4D0000; font-size:1.2em;font-weight:bold;'>点我去真实链接，免登录查看全文</span>";
    }
  }
  showLink();
  function zf(){
    showLink();
    document.getElementsByClassName("article_content")[0] ? document.getElementsByClassName("article_content")[0].style.height="" : "";
if(document.querySelector(".container .hide-article-box")){
    document.querySelector(".container .hide-article-box").style.backgroundImage="none";
    document.querySelector(".container .hide-article-box").style.marginTop="-150px";
    document.querySelector(".container .hide-article-box a").innerHTML=`<span style="color:red;font-size:2em;">脚本已为你展示全文</span>`;}
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    let element = document.getElementById("plc_main");
    var observer = new MutationObserver(() => {
      showLink();
    })
    observer.observe(element, { attributes: true, childList: true, subtree: true })
  }
  setInterval(`var color="#f00|#0f0|#00f|#880|#808|#088|green|blue|gray";
  color=color.split("|");
  for(var i=0;i<document.getElementsByClassName("addA").length;i++){
    document.getElementsByClassName("addA")[i].style.color=color[parseInt(Math.random() * color.length)];
  }`,200);
  function special1(){
if($(".WB_editor_iframe_new")[0]){
$(".WB_editor_iframe_new")[0].style.height="100%";

}
if($(".WB_editor_iframe_word")[0]){
    $(".WB_editor_iframe_word")[0].style.height="100%";

}

    $(".artical_add_box.S_bg2")[0].innerHTML="<span style='font-size:2em;color:red;'>脚本已为你展示全文，感谢使用！<br/>如有BUG联系q82664730反馈。</span>";
  $(".artical_add_box.S_bg2")[0].style.textAlign="center";
obj={isLogin:"1",isMask:"1",nick:"脚本用户",oid:"1653689004",uid:"5491743528"};
Object.assign($CONFIG,obj);
console.log("注入伪装登录用户！");
}
  setTimeout(zf,4000);
  setTimeout(special1,2500);
})();
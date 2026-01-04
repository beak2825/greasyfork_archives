// ==UserScript==
// @name         ScienceDirect Hide or show the side two column information bar|ScienceDirect显示或隐藏两侧信息，加宽中间部分
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  sciencedirect 隐藏左右两列增宽中间部分
// @author       barlow
// @license      None
// @match        https://www.sciencedirect.com/science/article*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sciencedirect.com
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.1/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/454681/ScienceDirect%20Hide%20or%20show%20the%20side%20two%20column%20information%20bar%7CScienceDirect%E6%98%BE%E7%A4%BA%E6%88%96%E9%9A%90%E8%97%8F%E4%B8%A4%E4%BE%A7%E4%BF%A1%E6%81%AF%EF%BC%8C%E5%8A%A0%E5%AE%BD%E4%B8%AD%E9%97%B4%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/454681/ScienceDirect%20Hide%20or%20show%20the%20side%20two%20column%20information%20bar%7CScienceDirect%E6%98%BE%E7%A4%BA%E6%88%96%E9%9A%90%E8%97%8F%E4%B8%A4%E4%BE%A7%E4%BF%A1%E6%81%AF%EF%BC%8C%E5%8A%A0%E5%AE%BD%E4%B8%AD%E9%97%B4%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // 事件监听
  function addEvents() {
    const _historyWrap = function (type) {
      const orig = history[type];
      const e = new Event(type);
      return function () {
        const rv = orig.apply(this, arguments);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
      };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');

    window.addEventListener('pushState', function (event) {
      console.log('页面重新加载-pushState')
      load_button()
    })

    window.addEventListener('popstate', function (event) {
      console.log('页面重新加载-popstate')
      load_button()
    })
    $(document).ready(load_button)
  }
   // 两侧隐藏函数 可更改中间的宽度占比 默认是80%
  function hide2() {
    try {
      var left_pannel = document.getElementsByClassName("TableOfContents u-margin-l-bottom");
      left_pannel[0].style.display = "none";
      var right_pannel = document.getElementsByClassName("RelatedContent");
      right_pannel[0].style.display="none";
      var width = document.getElementsByClassName("col-lg-12 col-md-16 pad-left pad-right");
      width[0].style.width = "80%" //改这里
    }
    catch (e) {
      console.log(e)
    };
  }
  function show() {
    try {
      var width = document.getElementsByClassName("col-lg-12 col-md-16 pad-left pad-right");
      width[0].style.width = "50%";
      var left_pannel = document.getElementsByClassName("TableOfContents u-margin-l-bottom");
      left_pannel[0].style.display = "";
      var right_pannel = document.getElementsByClassName("RelatedContent");
      right_pannel[0].style.display="";
    }
    catch (e) {
      console.log(e)
    };
  }
  // button 加载
  function load_button() {
    var list = document.createElement("li");
    var btn = document.createElement("button");
    var sp = document.createElement("span");
    list.className = "showhide";
    btn.className = "showhidebutton";
    btn.type = "button";
    btn.id = "btn_show"; ////////////////////////////默认是与之前保持一致，可以修改为”btu_hide“ 即可将默认改为加宽模式（隐藏侧边两列）
    btn.innerText = "Widescreen/recovery";
    btn.style.fontSize = "16px";
    btn.style.border = "none";
    btn.style.color = "#347194";
    btn.style.background = "#FFFFFF";
    btn.onclick = function () {
        var button_raw = document.getElementById("btn_show"); //btn_show显示初始版式
        if (button_raw){
            try{
            hide2();
            button_raw.id = "btn_hide";
            console.log('log:'+document.getElementById("btn_hide"));}catch(e){console.log(e)}

        }else{
            show();
            let button_hide = document.getElementById("btn_hide"); //btn_show显示初始版式
            button_hide.id = "btn_show";
            console.log(document.getElementById("btn_show"))
        }
    }

    sp.className = "button-text";
    list.appendChild(btn);
    list.appendChild(sp);
    var b = document.getElementsByTagName("ul")[2]
    b.append(list)
    //hide2();
  }

  //程序执行
  window.onload=function(){
  addEvents()
  }
})();
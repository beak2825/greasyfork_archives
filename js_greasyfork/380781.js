// ==UserScript==
// @name zhihu
// @namespace Violentmonkey Scripts
// @match https://www.zhihu.com/pub/*
// @grant none
// @description 查看books md格式
// @version 0.0.3
// @downloadURL https://update.greasyfork.org/scripts/380781/zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/380781/zhihu.meta.js
// ==/UserScript==

(function(){
  "use strict";
  // libs
 // function sleep(ms) {
  //  return new Promise(resolve => setTimeout(resolve, ms))
 // }
 
  var t = Date.now();
 
  function sleep(d){
      while(Date.now - t <= d);
  } 
  
  //
  setTimeout(function(){
    function get_title(){
      return document.title.split('-')[0].replace(/\s+/g,"");
    }

  
    function get_content(){
      // create html element
      var root = document.createElement('html')
      var content = document.querySelector('section').outerHTML;
      root.innerHTML = "<body><div id='root'>" + content + "</div></body>"
      //console.log(content)
      return root.outerHTML;
    }
    
    function add_download_link(){
      // 创建 Blob对象
      var f  =  new Blob([get_content()], {type: "text/plain;charset=utf-8"});
      // 创建一个 下载链接对象
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(f);

      a.download = get_title() + '.html';
      a.textContent = "Download";
      //var node = document.querySelector('#root')
      var node = document.querySelector('.reader-nav')
      node.insertBefore(a, node.firstChild)
    }
    
    
    function get_book_menu(){
      var data = {}
      var book_menu = document.querySelectorAll('.MPub-reader-chapter li');
      for (var i = 0; i < book_menu.length; i++) {
        data[book_menu[i].innerText] = book_menu[i].querySelector('a').href;
      }
      return data;
    }

    function get_menu_content(menu) {
      for (var key in menu){
       // window.location.href = menu[key]
       console.log("%s %s", key, menu[key])
        sleep(1000)
      }
      return menu;
    }

    function main(){
      var menu = get_book_menu();
      get_menu_content(menu);
      add_download_link();


    }
    main(); 
 }, 2000);
})();

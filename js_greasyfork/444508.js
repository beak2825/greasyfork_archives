// ==UserScript==
// @name        美剧仓下载助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于复制美剧仓下载链接到剪贴板中
// @author       Julian Hu
// @match        https://www.meijucang.com/mjn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meijucang.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444508/%E7%BE%8E%E5%89%A7%E4%BB%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/444508/%E7%BE%8E%E5%89%A7%E4%BB%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var downbuttons = document.getElementsByClassName('btn btn-sm btn-primary');
    for(var i=0; i< downbuttons.length;i++){
       if(downbuttons[i].innerText=="迅雷下载选中文件"){
           var button = document.createElement("button"); //创建一个按钮
           button.textContent = "复制选择链接"+i; //按钮内容
           button.style.width = "90px"; //按钮宽度
           button.style.height = "28px"; //按钮高度
           button.style.align = "center"; //文本居中
           button.style.color = "white"; //按钮文字颜色
           button.style.background = "#e33e33"; //按钮底色
           button.style.border = "1px solid #e33e33"; //边框属性
           button.style.borderRadius = "4px"; //按钮四个角弧度
           button.addEventListener("click", clickButton) //监听按钮点击事件
           downbuttons[i].parentNode.appendChild(button)
          }
    };

   function clickButton(){
       var u=[],f=[],count;
       var downtable=this.parentNode.parentNode.parentNode.parentNode;
       var inputs=downtable.getElementsByTagName("input");
       for(var i=0 ;i<inputs.length;i++){
          if(inputs[i].type=='checkbox'){
              if(inputs[i].checked==true){
                u.push(inputs[i].value);
              }
          }
       };
       var urlStr=u.join('\n\r');
       console.log(urlStr);
       var input = document.createElement('textarea');
             // 把文字放进input中，供复制
      input.value = urlStr;
      document.body.appendChild(input);
      // 选中创建的input
      input.select();
      var copy_result = document.execCommand('copy');
      if (copy_result) {
       alert('已复制到粘贴板');
      } else {
       alert('复制失败');
      }
      document.body.removeChild(input);
   }
})();
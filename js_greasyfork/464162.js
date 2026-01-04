// ==UserScript==
// @name         devops_petma
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  simple to copy
// @author       petma
// @match        https://devops.maxpeedingrods.cn/sqlquery/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=maxpeedingrods.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464162/devops_petma.user.js
// @updateURL https://update.greasyfork.org/scripts/464162/devops_petma.meta.js
// ==/UserScript==

(function() {
    'use strict';
   var style = document.createElement('style');
style.textContent = `
/* 按钮样式 */
.my-button {
    display: inline-block;
    padding: 10px 20px;
    margin-left: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    cursor: pointer;
    background-color: #2196F3;
    color: #fff;
    border: none;
    border-radius: 5px;
}

/* 按钮悬停样式 */
.my-button:hover {
    background-color: #0c7cd5;
}

/* 按钮按下样式 */
.my-button:active {
    background-color: #0a6abf;
}
`;
document.head.appendChild(style);
   var added=false
   var input= document.createElement('input');
    input.type="number"
    input.value="1"
    input.style.width = "50px";
    input.onchange = function() {
  added=false;

};

   // 创建一个按钮元素
    var button = document.createElement('button');
    button.className = 'my-button';
    button.innerHTML = 'Add Quotes';


    // 将按钮添加到页面上
    var container = document.getElementById('nav-tabs');
   //var container = document.querySelector('.container');
      container.appendChild(input);
    container.appendChild(button);

     var cbutton = document.createElement('button');
    cbutton.innerHTML = 'copy';
     cbutton.className = 'my-button';
    container.appendChild(cbutton);

    // 按钮点击事件处理程序
    button.addEventListener('click', function() {
        
            added=true;
            var number=input.value
           // var table = document.getElementById("query_result1");
            var table=document.querySelector('div.active.in');
        // 获取第一列所有单元格
        var cells = table.querySelectorAll('tbody tr td:nth-child('+number+')');

        // 循环遍历单元格，并为每个单元格的内容添加单引号
        cells.forEach(function(cell,index) {
            var text = cell.textContent.trim();
             if(text.charAt(0)!=="'"){
               if (index === cells.length - 1) {
                     cell.textContent = "'" + text + "'";
               }else{
                   cell.textContent = "'" + text + "',";
               }
             }
        });
        
    });
    cbutton.addEventListener('click', function() {
        navigator.clipboard.writeText('');
        var number=input.value
       // var table = document.getElementById("query_result1");
        var table=document.querySelector('div.active.in');
        // 获取第一列所有单元格
        var cells = table.querySelectorAll('tbody tr td:nth-child('+number+')');
        var text = ' in (';
        // 循环遍历单元格，并为每个单元格的内容添加单引号
        cells.forEach(function(cell,index) {
             var celltext = cell.textContent.trim();
            if(celltext!="'',"){
                if(celltext.charAt(0)!=="'"){
                    if (index === cells.length - 1) {
                        text += celltext  ;
                    }else{
                       text += (celltext + ",");
                    }
             }else{
               text += celltext
             }


            }
        });
        text += ');';
        // 复制文本到剪贴板
        navigator.clipboard.writeText(text);
         //GM_setClipboard(text);

    });

})();

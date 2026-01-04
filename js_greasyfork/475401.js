// ==UserScript==
// @name         页面插入按钮
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在页面尾部插入按钮
// @author       TCH
// @match        *://*.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475401/%E9%A1%B5%E9%9D%A2%E6%8F%92%E5%85%A5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/475401/%E9%A1%B5%E9%9D%A2%E6%8F%92%E5%85%A5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
 
(function()
{


      function find(searchVal, bgColor) {
            var oDiv = document.getElementsByTagName("body")[0];
            var sText = oDiv.innerHTML;
            var reg1 = /<script[^>]*>(.|\n)*<\/script>/gi; //去掉script标签 
            sText = sText.replace(reg1, "");
            var bgColor = bgColor || "orange";
            var sKey = "<span name='addSpan' style='background-color: " + bgColor + ";'>" + searchVal + "</span>";
            var num = -1;
            var rStr = new RegExp(searchVal, "g");
            var rHtml = new RegExp("\<.*?\>", "ig");//匹配html元素
            var aHtml = sText.match(rHtml); //存放html元素的数组
            sText = sText.replace(rHtml, '{~}');  //替换html标签
            sText = sText.replace(rStr, sKey); //替换key
            sText = sText.replace(/{~}/g, function () {  //恢复html标签
                  num++;
                  return aHtml[num];
            });
            oDiv.innerHTML = sText;
      }


find('字体');
      find('红');


let div=document.createElement("div");
div.style="position:fixed; bottom:0; left: 0; margin: auto; right: 0;text-align:center;"
div.innerHTML='<span id="span-1"style="width:150rpx;margin:10px;background-color: red;font-size: 30px;border-color: red;border-radius: 5px;" >标注</span><span class="sp" style="width:150rpx;margin:10px;font-size: 30px;border-radius: 5px;">取消</span>';
div.onclick=function(event){
    if(event.target.id=="span-1"){
        
  const selection =document.getSelection();

  if (selection !== null && selection !== void 0 && selection.toString()) {
      alert( document.getSelection().toString());
 
  const range = document.getSelection().getRangeAt(0);
  const docObj = range.extractContents(); //移动了Range 中的内容从文档树到DocumentFragment（文档片段对象)。
  let dom = document.createElement('span');
  dom.style.color = 'red';
  dom.appendChild(docObj);
  range.insertNode(dom);
alert("span-1被点击了");
  }






    }else if(event.target.className=="sp"){
        alert("sp这一类被点了");
    }
};
document.body.append(div);

 
})();
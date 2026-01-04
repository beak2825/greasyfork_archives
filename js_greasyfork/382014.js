// ==UserScript==
// @name         获取淘宝商品链接
// @version      v1.0
// @namespace    Violentmonkey Scripts
// @description  通过关键词搜索出来的商品列表，点击某个商品的添加按钮，添加到右侧的链接列表，支持一键复制所有链接，并支持导出链接列表文件
// @author       Finn
// @license      MIT
// @match        https://s.taobao.com/search
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382014/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/382014/%E8%8E%B7%E5%8F%96%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==


;(function () {
  'use strict';
  
    var urlList = [];
  
    var txtbox = document.getElementsByClassName('grid-left');

    var newTxtBox = document.createElement('div');
   
    var newTxtBoxTitle = document.createElement('p');
  
    var oneClickCopy = document.createElement('a');
  
   
    setTimeout(function(){
      newTxtBox.class = "myNewTxtBox";

      newTxtBox.style = "width:200px;min-height:50px;max-height:500px;position:fixed;background:#f5f5f5;border-radius:4px;padding:10px;overflow:auto;top:10%;right:20px";
      newTxtBoxTitle.innerHTML = "商品URL列表：";
      newTxtBoxTitle.style = "font-weight:bold;"

      oneClickCopy.innerHTML = "一键复制";
      oneClickCopy.style = "width:60px;height:25px;line-height:25px;text-align:center;display:block;position:fixed;background:#f5f5f5;border-radius:4px;top:7%;right:20px;cursor:pointer;";
      oneClickCopy.id = "copyBtn"
      oneClickCopy.addEventListener('click',copyClick);
      
      newTxtBox.appendChild(newTxtBoxTitle);
  
      txtbox[1].appendChild(newTxtBox);
      txtbox[1].appendChild(oneClickCopy);
      
      console.log("加载成功");
        
   },500);
  
  
    $(function (){
        getCommoditiesList();
        monitorJump();
    })
  
  
    function getCommoditiesList() {
      
      var list = document.getElementsByClassName('row row-2 title');
      
      setTimeout(function(){
        for(var i=1; i<=list.length-1; i++){
          var newnode = document.createElement("b");
          newnode.innerHTML = "添加";
          newnode.class = "myAddButton";
          newnode.style = "width: 50px;height: 30px;display: block;position: absolute;background: #ccc;text-align: center;line-height: 30px;border-radius: 4px;margin-top: -24px;margin-left: 70px;cursor: pointer;user-select: none;";
          newnode.id=i;
          
          var sb = list[i].parentNode;
          sb.appendChild(newnode);
          
          sb.onclick = function(e){
            urlList.push(e.target.parentNode.children[1].children[0].href);
            adddTxtBox(e.target.parentNode.children[1].children[0].href);
          }
        }
      },1000)
      
    }
  
  
    function addTxtBox(){
      var test = document.getElementsByClassName('myNewTxtBoxP');
      
      for(var i=0;i<urlList.length;i++){
        var newTxtBoxP = document.createElement('p');
        newTxtBoxP.class = "myNewTxtBoxP";
        newTxtBoxP.id = i;
        newTxtBoxP.innerHTML = urlList[i];
        newTxtBox.appendChild(newTxtBoxP);
      }
    }
    
  
    function adddTxtBox(str){
      var newTxtBoxP = document.createElement('p');
        newTxtBoxP.class = "myNewTxtBoxP";
        newTxtBoxP.style = "width:100%;min-height:30px;border-bottom:1px solid red;";
        newTxtBoxP.id = i;
        newTxtBoxP.innerHTML = str;
        newTxtBox.appendChild(newTxtBoxP);
      
    }
  
  
    function dataToTxt(exportData){
      var w = window.open("about:blank","导出","height=0,width=0,toolbar=no,menubar=no,scrollbars=no,resizable=on,location=no,status=no");
      var dt = new Date();
      w.document.write(exportData);
      try {
        w.document.charset = "GB2312";
      } catch (err) {
        console.log(err);
      }
      w.document.execCommand(
        "SaveAs",
        false,
        dt.getFullYear() +
          "-" +
          (dt.getMonth() + 1) +
          "-" +
          dt.getDate() +
          "-" +
          dt.getTime() +
          ".txt"
      );
      w.close();
    }

  
    function btnClick(){
      getCommoditiesList();
      monitorJump();
    }
    
  
    function monitorJump(){
      
      setTimeout(function(){
          
         var mybtnJump = document.getElementsByClassName('inner clearfix');
        
         mybtnJump[0].addEventListener('click',btnClick);
        
        },600);
      
    }
    
      
    function copyClick(){
      const textarea = document.createElement('textarea');
      document.body.appendChild(textarea);
      var str = new String;
      for(var i = 0;i < urlList.length;i++){
        textarea.innerHTML += urlList[i] + "\n"; 
      }
      textarea.select();
      if (document.execCommand('copy')) {
		document.execCommand('copy');
		alert("复制成功");
      }
      document.body.removeChild(textarea);
    }
  

})();
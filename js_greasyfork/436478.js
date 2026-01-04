// ==UserScript==
  // @name         fiveSEO
  // @namespace    aniu.tv
  // @version      0.3
  // @description  try to take over the world!
  // @author       You
  // @match        https://ucenter.aniu.tv/Index/*
  // @icon         https://www.aniu.tv/
  // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436478/fiveSEO.user.js
// @updateURL https://update.greasyfork.org/scripts/436478/fiveSEO.meta.js
  // ==/UserScript==
 (function() {
      'use strict';
      var article, i;
      var last = document.querySelector("body > div.sidebarNavPlate > ul");
      var mybtn =document.createElement('button');
      mybtn.type = 'button';
      mybtn.innerHTML = '一键优化';
      mybtn.setAttribute('style', 'background-color: #4CAF50;border: 10px;color: white;padding: 15x 34px;text-align: center;text-decoration: none;display: inline-block;font-size: 24px;margin: 4px 2px;cursor: pointer;');
      last.insertBefore(mybtn, last.childNodes[0]);
      mybtn.onclick = function(){changeText()}
      article = document.querySelectorAll('.myTalkList ul li')
      for (i = 0; i <5; i++){
          var title = article[i].querySelector('.tit a').innerHTML;
          var link = article[i].querySelector('.tit a').href;
          var txt_t = document.createElement('p');
          var haoma = i+1;
          txt_t.innerText = haoma + '、';
          var txt_l = document.createElement('p');
          var node_t = document.createTextNode(title);
          var node_l = document.createTextNode(link);
          txt_t.appendChild(node_t)
          txt_l.appendChild(node_l)
          var talkList = document.querySelector('.myTalkList ul');
          var top = document.querySelector('.myTalkList ul li')
          talkList.insertBefore(txt_t, top)
          talkList.insertBefore(txt_l, top)
      }
 })();
function changeText(){
    var tu_pian = true;
    var zhai_yao = true;
    var editor = '在文档中，改成自己的名字哟~~';
    var doc = document.querySelector('iframe#ueditor_0').contentDocument;
    var txt = doc.querySelectorAll('html body p');
    var biaoti = document.querySelector('div.arti input');
    document.querySelector('div.issuemore').style.display = 'block';
    var zhaiyao = document.querySelector("#abstract");
    var fengmian = document.querySelector("#thumbnail");
    biaoti.value = txt[0].innerText;
    txt[0].innerHTML = '<strong>' + txt[0].innerHTML +'</strong>';
    zhaiyao.value = txt[1].innerText;
    for (var j = 1; j < txt.length; j++){
         if (txt[j].length < 30){
             txt[j].innerHTML = '<strong>' + txt[j].innerHTML + '</strong>';
         }
         else if (txt[j].querySelector('img') != null && tu_pian){
             fengmian.value = txt[j].querySelector('img').src;
             tu_pian = false;
         }
         else if (txt[j].innerHTML == '<br>' || txt[j].innerText == '\n' ){
             txt[j].remove();
         }
         else {
             if (txt[j].innerHTML[0] == '&' || txt[j].innerHTML[0] == '　'){break;}
             else {txt[j].innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;' + txt[j].innerHTML;}
         }
    }
    var wei;
    var end = biaoti.value.indexOf('?');
    if (end > 0){
        wei = biaoti.value.slice(0, end)
    }
    else {
        wei = biaoti.value;
    }
    var weiba = '&nbsp;&nbsp;&nbsp;&nbsp;看到这里，相信您已经了解<strong>' + wei + '</strong>了。想要学习更多投资知识，欢迎关注点掌财经！';
    var para = document.createElement('p');
    para.innerHTML = weiba;
    doc.querySelector("body").appendChild(para);
    document.querySelector("#editor").value = editor;
    document.querySelector("#isShowshuoshuo > span.radiospan.graypoint").click();
    document.querySelector("#isshowtaglist > span.radiospan.graypoint").click();
    document.querySelector("#categoryInputId686").click();
 }
// ==UserScript==
// @name         Spmoveright
// @namespace    http://tampermonkey.net/
// @version      0.30
// @description  try to take over the world!
// @author       KHUN
// @match        https://global-oss-jf2jja.bigo.tv/bigoAudit/review/list
// @match        https://bgmodel-global-oss.bigo.tv/bigoAudit/review/list
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379013/Spmoveright.user.js
// @updateURL https://update.greasyfork.org/scripts/379013/Spmoveright.meta.js
// ==/UserScript==

(function() {
    'use strict';
window.onload = (function () {
      //获取私房提示
      var _ifram=document.getElementById("body-detail").getElementsByClassName("detail-iframe");
      var reg = RegExp(/私房/);
      var e;
      for (e = 0; e< _ifram.length; e++) {
      var s=_ifram[e].contentWindow.document.getElementById("page-body").getElementsByClassName("editor-info-div")[0].children[1].innerText;
       if(s.match(reg)){
       _ifram[e].contentWindow.document.getElementById("page-body").getElementsByClassName("editor-info-block")[0].getElementsByClassName("editor-info-div")[0].style.background="yellow";
       }
       var v=_ifram[e].contentWindow.document.getElementById("page-body").getElementsByClassName("editor-info-div")[0].children[2].innerText;
       if(v.match("违规")){
       _ifram[e].contentWindow.document.getElementById("page-body").getElementsByClassName("editor-info-block")[0].getElementsByClassName("editor-info-div")[0].style.background="#FFFFFF";
       }
      }

    //解决终审标签遮挡
    var ifm=document.getElementById("body-detail").getElementsByClassName("detail-iframe");
    var i;
     for (i = 0; i < ifm.length; i++) {
         var st=ifm[i].contentWindow.document.getElementById("page-body").getElementsByClassName("modal")[0];
         if(st){
             st.style.right="213";
         }
     }
   //未成年国家提示
    var gj = new RegExp(/TM|KG|UZ|KZ|IN|BD|PK|NP|BR|AR|MX|CO|ES|BO|CL|CR|DO|EC|GT|HN|AZ|AM|NI|PA|PE|PR|TJ|PY|SV|UY|VE|ID|JP|KH|KR|PH|TH|CA|AD|AL|AT|BE|BG|BY|CH|CZ|DE|DK|EE|ES|FI|FR|GB|GR|HU|IE|IS|IT|LI|LT|LU|LV|MC|MD|MT|NL|NO|PL|PT|RO|RU|SE|SI|SK|SM|UA|RS|AX|BA|GP|HR|ME|MK|AR|BR|CO|MX|US|AU|NZ|AE|BH|IL|IQ|IR|JO|KW|LB|OM|PS|QA|SA|SY|YE|DZ|EG|LY|MA|SD|TN|TR|BY|GE/);
    var m;
    for (m = 0; m< _ifram.length; m++) {
        var b=_ifram[m].contentWindow.document.getElementById("page-body").getElementsByClassName("info-p2")[0];
    var g=b.children[0].innerText;  
    if(!g.match(gj)){
        b.style.background="yellow";
    }
     //提示按钮
     var node=document.createElement("button");
     node.setAttribute('style', 'margin-left: 10px');
     node.setAttribute('style', 'Font-size: 20px');
     node.style.color="red";
     var c=_ifram[m].contentWindow.document.getElementById("page-body").getElementsByClassName("body-pic2")[0].children[2];
        if(g.match("VN")){
         node.innerHTML = "不处罚喝酒；【警告】转播其他用户直播录像(6张截图)；【警告】签约主播转播影视(10分钟)";
         c.appendChild(node);
         }
         else if(g.match(/IN|TH|BD|NP|KH/))
          {
        node.innerHTML = "【警告】转播其他用户直播录像(6张截图)";
              c.appendChild(node);
          }
         else if(g.match(/US|CA|GB/))
          {
        node.innerHTML = "【B】女性比基尼，特殊场景不处罚；【B】性暗示、挑逗行为";
              c.appendChild(node);
          }
        else if(g.match(/AR|BO|BR|CL|CO|CR|CU|DO|EC|ES|GT|HN|MX|NI|PA|PE|PY|PR|SV|UY|VE/))
          {
        node.innerHTML = "【特殊A】婴儿裸露，包括屁股（西语国家）";
              c.appendChild(node);
          }
        else if(g.match(/RU|UA|BY|GE|AM|AZ|TJ|TM|KG|UZ|KZ/))
          {
        node.innerHTML = "俄语区";
              c.appendChild(node);
          }
        else if(g.match(/JP|HK|TW|MO/))
          {
        node.innerHTML = "【不处罚】比基尼、赤裸上身";
              c.appendChild(node);
          }
         else if(g.match("KR"))
          {
        node.innerHTML = "【B】宣传竞品，教唆粉丝去其他平台；【B】转播影视(10分钟)";
              c.appendChild(node);
          }
        else if(g.match("IQ"))
          {
        node.innerHTML = "【警告】穿军装";
              c.appendChild(node);
          }
        else if(g.match("PK"))
          {
        node.innerHTML = "【警告】穿军装；【警告】转播其他用户直播录像(6张截图)";
              c.appendChild(node);
          }
        else{}
    }
});
    // Your code here...
})();
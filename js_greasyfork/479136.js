// ==UserScript==
// @name         好医生直接开考脚本
// @license      AGPL License
// @namespace    https://penicillin.github.io/
// @version      0.2
// @description  修改课程链接，不用完成学习，直接进入考题作答。
// @match        https://www.cmechina.net/cme/study2.jsp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479136/%E5%A5%BD%E5%8C%BB%E7%94%9F%E7%9B%B4%E6%8E%A5%E5%BC%80%E8%80%83%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/479136/%E5%A5%BD%E5%8C%BB%E7%94%9F%E7%9B%B4%E6%8E%A5%E5%BC%80%E8%80%83%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

let activeLink='';

let a_Links=document.getElementsByClassName('s_r_ml')[0].getElementsByTagName('a');

for (var i=0;i<a_Links.length;i++){
    if (a_Links[i].parentNode.className == "active"){
        let a_Attr_Onclick=a_Links[i].getAttribute('onclick');
        let a_Onclick=a_Attr_Onclick.split('\'')[1].split('?')[1].split('&');
        a_Attr_Onclick=a_Links[i].removeAttribute('onclick');
        let link_String='https://www.cmechina.net/cme/exam.jsp?'+a_Onclick[0]+'&'+a_Onclick[1];
        link_String=link_String.replace('courseware_id','paper_id');
        //       a_Links[i].setAttribute('href',link_String);
        activeLink = link_String;
    }
}

var BTN=document.getElementsByClassName('s_r_bts')[0].getElementsByTagName('a')[0];
BTN.removeAttribute('onclick');
if (BTN.text != "考试通过") {
    BTN.setAttribute('href',activeLink)
} 
// ==UserScript==
// @name         Bitcointalk 高亮显示老主题，去处ICO等主题
// @version      0.2
// @description  Highlight new threads
// @author       Ideo
// @match        https://bitcointalk.org/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        none
// @copyright    2020+, RAOCHEN
// @license MIT
// @namespace https://greasyfork.org/users/635044
// @downloadURL https://update.greasyfork.org/scripts/405922/Bitcointalk%20%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E8%80%81%E4%B8%BB%E9%A2%98%EF%BC%8C%E5%8E%BB%E5%A4%84ICO%E7%AD%89%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/405922/Bitcointalk%20%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA%E8%80%81%E4%B8%BB%E9%A2%98%EF%BC%8C%E5%8E%BB%E5%A4%84ICO%E7%AD%89%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) {
      return;
    }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
  }
  addGlobalStyle('#old {background-color:#131313;color:#aaa;}');

  var $eles = $('[id^="pages"]');
  var DOMeles = $eles.get();
  for (var i = 0; i < DOMeles.length; i++) {
    try {
      var links = DOMeles[i].getElementsByTagName("a");
      if (links !== null) {
        for (var j = 0; j < links.length; j++) {
          if (links[j].text > 10) {
            links[j].parentElement.parentElement.setAttribute("id", "old");
            break;
          }

        }
      }

    }
    catch (e) {
      alert(i + " - " + e);
    }

  }

  function setCssTextStyle(el, style, value) {
    var result = el.style.cssText.match(new RegExp("(?:[;\\s]|^)(" +
        style.replace("-", "\\-") + "\\s*:(.*?)(;|$))")),
      idx;
    if (result) {
      idx = result.index + result[0].indexOf(result[1]);
      el.style.cssText = el.style.cssText.substring(0, idx) +
        style + ": " + value + ";" +
        el.style.cssText.substring(idx + result[1].length);
    }
    else {
      el.style.cssText += " " + style + ": " + value + ";";
    }
  }
})();
window.onload=cfa;

function cfa(){
var ii=document.getElementsByClassName("leftimg").length;
for (var i=0; i<ii; i=i+2)
  {
  var tmp = document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].innerText;
      if (tmp.match(/ICO/i) || tmp.match(/SALE/i) || tmp.match(/AIRDROP/i) || tmp.match(/GPU/i)|| tmp.match(/POS/i) !== null) {
          document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].innerText = "GOOD DAY";
          document.getElementsByClassName("leftimg")[i].parentNode.childNodes[5].style.color = 'red';
      }
  }
}

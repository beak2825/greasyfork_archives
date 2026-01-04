// ==UserScript==
// @name         Tastycoffee mod
// @version      0.0.1
// @datecreated	 2020-01-01
// @lastupdated	 2020-01-01
// @description  Скрипт возвращает дефолтный стиль скроллбара и изменяет внешний вид сайта
// @author       kroleg
// @match        https://*.tastycoffee.ru/*
// @match        https://tastycoffee.ru/*
// @grant        none
// @updatedURL https://greasyfork.org/scripts/394503-tastycoffee-mod/code/Tastycoffee%20mod.user.js
// @namespace https://greasyfork.org/users/386075
// @downloadURL https://update.greasyfork.org/scripts/394503/Tastycoffee%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/394503/Tastycoffee%20mod.meta.js
// ==/UserScript==

[].forEach.call(document.styleSheets, function(sheet) {
 var
  rule;

 try { rule = sheet.rules } catch (e) {}

 if(rule) {
  for(var i = 0; i < rule.length; i++)
   if(/::-webkit-scrollbar/.test(rule[i].selectorText)) sheet.deleteRule(i--);
 }//if rule
});


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
  'use strict';
  var css = `
#supportTrigger {
    display: none;
}

.article-text-content h4 {
    margin-top: 30px;
}

.article-text-content p {
    margin-bottom: 2px;
}

.article-text-content p img {
    margin: 9px 0;
}

.article-text-content, ol li {
    line-height: inherit;
}

.cardBox.blue {
    border: 1px solid #adc8d4;
    border-radius: 2px;
}

.cardBox.green {
    border: 1px solid #afc5a5;
    border-radius: 2px;
}

.cityPoint .text9 {
    opacity: 1;
}

.content.contentWrap h2, .content.contentWrap h4 strong {
    font: normal 19px Tahoma;
}

.content.contentWrap h5 strong {
    font: normal 17px Tahoma;
}

.content.contentWrap, .article-leadtext, p {
    font: normal 14px Tahoma;
}

.greyLink, .greyText {
    color: #004090 ;
}

footer .nav li a, .nav .nav-link {
    color: #000;
}

h4, h5 {
    margin: 8px 0 0px -1px;
}

header .greyLink, header .greyText {
    font: bold 12px 'Lucida Grande';
}

p {
    letter-spacing: inherit;
}

.stock-l, .stock-r, .reviewsBox, .chargeStock-wrap, .itemFaq, .cardBox.grey {
    border: 1px solid #ddd;
    border-radius: 2px;
}
`;
  addGlobalStyle(css);
})();
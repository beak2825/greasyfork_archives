// ==UserScript==
// @name         过滤rarbg中IMDB小于7分的内容
// @namespace    http://babesun.com/
// @version      0.1
// @description  try to get good torrents!
// @author       Babesun
// @match        http*://rarbg.to/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29595/%E8%BF%87%E6%BB%A4rarbg%E4%B8%ADIMDB%E5%B0%8F%E4%BA%8E7%E5%88%86%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/29595/%E8%BF%87%E6%BB%A4rarbg%E4%B8%ADIMDB%E5%B0%8F%E4%BA%8E7%E5%88%86%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('tr.lista2 td+td.lista span[style^=color]').each(function(){
      if($(this).html().match(/IMDB: (.*)\/10/)){
          var substr = $(this).html().match(/IMDB: (.*)\/10/)[1];
      };
      if(Number(substr)<7 || substr==undefined){
          $(this).parent().parent().remove();
      }else{
          $(this).html($(this).html().replace('IMDB:','IMDB:<b style="color:red">'));
          $(this).html($(this).html().replace('/10','</b>/10'));
      }
    });
})();
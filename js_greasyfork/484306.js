// ==UserScript==
// @name        Hide Annoying Charters
// @match       https://www.enchor.us/*
// @version     0.2
// @namespace   MNM
// @author      MNM
// @require https://update.greasyfork.org/scripts/471409/1232035/Arrive.js
// @require     https://code.jquery.com/jquery-3.7.1.js
// @description 1/3/2024, 11:46:03 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484306/Hide%20Annoying%20Charters.user.js
// @updateURL https://update.greasyfork.org/scripts/484306/Hide%20Annoying%20Charters.meta.js
// ==/UserScript==
document.arrive("ce-search-result-chart", function(newElem) {
  if(document.querySelectorAll('ce-search-result[class="card bg-base-100 shadow-xl rounded-none"]').length < 100){
    window.scrollTo(0, document.body.scrollHeight);
  }else{
    $('ce-search-result > ce-search-result-chart:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > img:nth-child(1)').each(function(){
      annoyingcharter = $(this).attr("alt");
      if(annoyingcharter == "misc"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "cth3dlc"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "csc"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "marathonhero2"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "cth3"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "antihero2"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "s_hero"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharter == "rbn"){
        $(this).parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      };
    });
    $('ce-search-result > ce-search-result-chart:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > a:nth-child(2)').each(function(){
      annoyingcharters = $(this).text();
      if(annoyingcharters.includes("Miscellany") == true){
        $(this).parent().parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharters.includes("Tolberto") == true){
        $(this).parent().parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      }else if(annoyingcharters.includes("Harmonix") == true){
        $(this).parent().parent().parent().parent().parent().parent().parent().attr("style","display: none;");
      };
    });
  };
});
setTimeout(function(){
  window.scrollTo(0, 0);
},8000);
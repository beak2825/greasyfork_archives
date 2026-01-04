// ==UserScript==
// @name Netflix history
// @namespace Violentmonkey Scripts
// @version 1.6.1
// @description save your viewing history in parts or completely
// @match https://www.netflix.com/settings/viewed/*
// @supportURL https://greasyfork.org/en/scripts/539767-netflix-history
// @license MIT
// @locale en
// @author       mihau
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/539767/Netflix%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/539767/Netflix%20history.meta.js
// ==/UserScript==

// to set your date format, you can choose from
// lg = logical:  25-06-18 (default)
// eu = european: 18.06.25
// us = us:       06/18/25
var dateformat = "";
// do not edit below this line

addEventListener("DOMContentLoaded", (event) => {

  setTimeout(function() {
    
    if (dateformat == "") { dateformat = "lg"; }

    var footer = document.getElementsByClassName("site-footer")[0].innerHTML;
    
    setTimeout(function() {
      
      document.getElementsByClassName("site-footer")[0].innerHTML = '<p><button class="btn btn-blue btn-small" type="button" autocomplete="off" tabindex="0" data-uia="" id="savehistory">save history to file</button></p><br />' + footer;

      document.getElementById("savehistory").onclick = function() {

        var mlnk = "";
        for (var i = 0, l = document.getElementsByTagName("ul")[3].getElementsByTagName("li").length - 1; i < l; ++i) {
          var mydate = document.getElementsByClassName("date")[i].innerText.split(".");
          if (mydate[1] < 10) {
            month = "0" + mydate[1]
          } else {
            month = mydate[1]
          }
          if (dateformat == "us") {
             mlnk += month + "/" + mydate[0] + "/" + mydate[2] + "\t";
          } else if (dateformat == "eu") {
             mlnk += mydate[0] + "." + month + "." + mydate[2] + "\t";
          } else {
             mlnk += mydate[2] + "-" + month + "-" + mydate[0] + "\t";
          }
          mlnk += document.getElementsByClassName("title")[i].innerText + "\n";
        }
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:attachment/text,' + encodeURIComponent(mlnk);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'netflix_history.txt';
        hiddenElement.click();

      }

    }, 1000);

  }, 500);

});
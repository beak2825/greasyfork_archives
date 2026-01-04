// ==UserScript==
// @name        change StudyPlace background
// @namespace   Violentmonkey Scripts
// @match       https://www.pottersschool.org/student/
// @grant       none
// @version     1.1
// @author      Yui
// @description 2021/8/27 上午7:26:23
// @downloadURL https://update.greasyfork.org/scripts/431750/change%20StudyPlace%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/431750/change%20StudyPlace%20background.meta.js
// ==/UserScript==

var displayname = true; //true will hide the name tag, false will display the name tag
var bg_url = "replace me!" //see the description in the tutorial

document.body.onload = function(){
  if (displayname)
    {
      var div = document.getElementById("myDisplayname");  
      div.style.display = "none";
    }
}

document.body.style.backgroundImage = "url('" + bg_url + "')";


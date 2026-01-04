// ==UserScript==
// @name         Quicker屏蔽辅助
// @namespace    https://github.com/isPoto
// @version      0.9
// @description  Quicker 网站屏蔽指定用户辅助
// @author       Poto
// @match        https://getquicker.net/Share/Recent
// @match      https://getquicker.net/Search?keyword=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getquicker.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444079/Quicker%E5%B1%8F%E8%94%BD%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/444079/Quicker%E5%B1%8F%E8%94%BD%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

let blackList = ["治钧","瓜皮之牙"];
//for (j=0,len=blackList.length;j<len;j++){
blackList.forEach(
  function(searchUser) {
    //var aTags = document.getElementsByTagName("a");
    var aTags = document.querySelectorAll("a");
    var found;

    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].innerText.includes(searchUser)) {
        found = aTags[i];

        //found.parentElement.parentElement.remove();
        if (location.href.indexOf("Share/Recent") != -1) {
          found.closest("tr").remove();
        }

        if (location.href.indexOf("Search?keyword") != -1) {
          found.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
        }
      }
    }}
);



/*
(function() {


//var href = window.location.host;
if (location.href.indexOf("Search?keyword") != -1) {
    //window.alert(location.href);

    var aTags = document.getElementsByTagName("a");
    var searchText = "/User/137838/Poto";
    var found;

    for (var i = 0; i < aTags.length; i++) {
      if (aTags[i].getAttribute("href") == searchText) {
        found = aTags[i];
        //found.parents('.parent').remove();
        //$(found).parents('.parent').remove();
        found.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
      }
    }
}

})();
*/



            //found.parents('.parent').remove();

            /*if (location.href.indexOf("Search?keyword") != -1) {
          //found.parentElement.parentElement.parentElement.parentElement.parentElement.remove();
          found.closest("tr").remove();
        }

        if (location.href.indexOf("Share/Recent") != -1) {
          //found.parentElement.parentElement.remove();
          found.closest("tr").remove();
        } */
        //$(found).parents('.parent').remove();
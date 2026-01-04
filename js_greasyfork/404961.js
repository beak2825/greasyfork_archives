// ==UserScript==
// @name         Hide discussion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://mangalib.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404961/Hide%20discussion.user.js
// @updateURL https://update.greasyfork.org/scripts/404961/Hide%20discussion.meta.js
// ==/UserScript==

(function() {
    setTimeout(SetEve, 500);
    setTimeout(Go, 1000);

    function SetEve() {
      if (document.querySelector('.f-categories')) {
        document.querySelector('.f-categories').addEventListener("click",function(e) {
	      setTimeout(Go, 500);
        });
      }
    }

    function Go() {
      if (document.querySelector('.f-pagination')) {
        document.querySelector('.f-pagination').addEventListener("click",function(e) {
	      setTimeout(Go, 500);
        });
      }
      hideItems();
      addButtons();
    }

    function hideItems() {
      var discusArr = document.getElementsByClassName('discussion-item');
      for (var i = 0; i < discusArr.length; i++) {
        var disscusId = discusArr[i].querySelector('.link-default').href.match(/\/forum\/discussion\/(.*)/)[1];
        if (localStorage.getItem("hide" + disscusId)) {
          discusArr[i].style.display = 'none';
          console.log("Hide: " + disscusId);
        }
      }
    }

    function addButtons() {
      var discusArr = document.getElementsByClassName('discussion-item');
      for (var i = 0; i < discusArr.length; i++) {
        var button = document.createElement("button");
        button.setAttribute("style", "float: right");
        button.innerHTML = 'X';
        button.onclick = function(e) {
          var id = e.target.parentNode.firstChild.href.match(/\/forum\/discussion\/(.*)/)[1];
          localStorage.setItem("hide" + id, 1);
          console.log("hide" + id);
          e.target.closest('.discussion-item').style.display = 'none';
        };
        discusArr[i].querySelector('h2').setAttribute("style", "margin-right: 0px");
        discusArr[i].querySelector('h2').appendChild(button);
      }
    }

})();
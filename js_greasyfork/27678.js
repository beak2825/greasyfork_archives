// ==UserScript==
// @name         Just4Fun v2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Never ending progressbar!
// @author       Lasse98brus
// @match        https://www.w3schools.com/w3css/w3css_progressbar.asp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27678/Just4Fun%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/27678/Just4Fun%20v2.meta.js
// ==/UserScript==

function move2() {
  var elem = document.getElementById("myBar");
  elem.style = 'width:20%;position:relative;left:0%';
  var left = 0;
  var width = 20;
  var id1, id2, id3;
  id1 = setInterval(del1, 30);

  function del1() {
    if (width == 100) {
      clearInterval(id1);
      id2 = setInterval(del2, 30);
    } else {
      width++;
      elem.style.width = width + '%';
      document.getElementById("demo").innerHTML = 'YOLO';
    }
  }
  function del2() {
    if (left == 80) {
      clearInterval(id2);
      id3 = setInterval(del3, 30);
    } else {
      left++;
      width--;
      elem.style.left = left + '%';
      elem.style.width = width + '%';
      document.getElementById("demo").innerHTML = 'YOLO';
    }
  }
  function del3() {
    if (left == 0) {
      clearInterval(id3);
      id1 = setInterval(del1, 30);
    } else {
      left--;
      elem.style.left = left + '%';
      document.getElementById("demo").innerHTML = 'YOLO';
    }
  }
}
setTimeout(move2, 1000);
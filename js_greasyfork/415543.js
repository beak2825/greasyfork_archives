// ==UserScript==
// @name         To Top
// @namespace
// @version      1.5
// @description  Web to Top & Bottom
// @author       MZ
// @match        *://*/*
// @namespace MZ
// @downloadURL https://update.greasyfork.org/scripts/415543/To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/415543/To%20Top.meta.js
// ==/UserScript==

(function() {
  //add css
  var css = `
      #buttonContainer {
          position: fixed;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          z-index: 99;
          display: flex;
          flex-direction: column;
          gap: 10px;
      }

      #topBtn, #botBtn{
          font-size: 18px;
          border: none;
          outline: none;
          background-color: #000000;
          color: white;
          cursor: pointer;
          padding: 10px;
          border-radius: 4px;
      }`;

  var node = document.createElement("style");
  node.type = "text/css";
  node.appendChild(document.createTextNode(css));
  var heads = document.getElementsByTagName("html");
  if (heads.length > 0) {
      heads[0].appendChild(node);
  } else {
      document.documentElement.appendChild(node);
  }


  //add button
  var div = document.createElement("div");
  div.id = "buttonContainer";

  var gotopbtn = document.createElement("input");
  gotopbtn.type = "button";
  gotopbtn.id = "topBtn";
  gotopbtn.value = "↑";
  gotopbtn.style.visibility = "hidden"
  div.appendChild(gotopbtn);

  var gobottombtn = document.createElement("input");
  gobottombtn.type = "button";
  gobottombtn.id = "botBtn";
  gobottombtn.value = "↓";
  div.appendChild(gobottombtn);

  document.getElementsByTagName("body")[0].appendChild(div);


  //button function
  gotopbtn.onclick = function () { window.scrollTo({ top: 0, behavior: 'smooth' }) }

  gobottombtn.onclick = function () { window.scrollTo({ top: document.documentElement.scrollHeight , behavior: 'smooth' }) }



  //button auto hide
  window.onscroll = function () { scrollFunction() };

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      document.getElementById("topBtn").style.visibility = "visible";
    } else {
      document.getElementById("topBtn").style.visibility = "hidden";
    }


    if (document.documentElement.scrollTop < document.documentElement.scrollHeight - window.screen.availHeight) {
      document.getElementById("botBtn").style.visibility = "visible";
    } else {
      document.getElementById("botBtn").style.visibility = "hidden";
    }
  }


})();
// ==UserScript==
// @name         Top Button for deviantart
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Read the name
// @author       SoaringGecko
// @match        https://www.deviantart.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @icon https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Circle-icons-arrow-up.svg/600px-Circle-icons-arrow-up.svg.png
// @downloadURL https://update.greasyfork.org/scripts/404159/Top%20Button%20for%20deviantart.user.js
// @updateURL https://update.greasyfork.org/scripts/404159/Top%20Button%20for%20deviantart.meta.js
// ==/UserScript==


    $("body").append ( `
    <div id="gmSomeID">
        <style>
#topBtn {
  display: none;
  position: fixed;
  bottom: 20px;
  right: 30px;
  z-index: 99;
  font-size: 18px;
  border: none;
  outline: none;
  background-color: #06f286;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 4px;
}

</style>
        <button onclick="topFunction()" id="topBtn" title="Go to top" style="-ms-transform: rotate(90deg); /* IE 9 */-moz-transform: rotate(90deg); /* Firefox */-webkit-transform: rotate(90deg); /* Safari and Chrome */-o-transform: rotate(90deg); /* Opera */">&lt;</button>
<script>
//Get the button
var mybutton = document.getElementById("topBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

</script>
    </div>
` );

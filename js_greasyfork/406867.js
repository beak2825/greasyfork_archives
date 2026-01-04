// ==UserScript==
// @name         Daily info
// @version      1.0
// @description  Instructions and Details 
// @author       RUTHUVAN || KRISH
// @namespace    https://greasyfork.org/users/197274
// @match        https://www.mturk.com/*
// @match        https://worker.mturk.com/dashboard*
// @downloadURL https://update.greasyfork.org/scripts/406867/Daily%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/406867/Daily%20info.meta.js
// ==/UserScript==

(function() {
document.write( '<div id=\"myModal\" class=\"modal\"><!-- Modal content -->  <div class=\"modal-content\"><div class=\"modal-header\"><span class=\"close\">×</span><h3>Instructions for New ID</h3></div><div class=\"modal-body\"><h4><a href=\"#\" target=\"_blank\" class=\"nocss\">Adult Content Qualification Task</a></h4></div>\n' );
document.write( '<div class=\"modal-header\"><h3>Importants for All ID\'s</h3></div><div class=\"modal-body\"><h4><a href=\"#\" target=\"_blank\" class=\"nocss\">UnQualified Hits</a></h4></div></div></div>' );
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("info_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
//window.onclick = function(event) {
//  if (event.target == modal) {
//    modal.style.display = "none";
//  }
//}
const converted = {
  ".modal": {
    display: "none",
    position: "fixed",
    zIndex: "1",
    paddingTop: "100px",
    left: "0",
    top: "0",
    width: "100%",
    height: "100%",
    overflow: "auto",
    backgroundColor: ["rgb(0,0,0)", "rgba(0,0,0,0.4)"]
  },
  ".modal-content": {
    position: "relative",
    backgroundColor: "#fefefe",
    margin: "auto",
    padding: "0",
    border: "1px solid #888",
    width: "80%",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)",
    WebkitAnimationName: "animatetop",
    WebkitAnimationDuration: "0.4s",
    animationName: "animatetop",
    animationDuration: "0.4s"
  },
  "@-webkit-keyframes animatetop": {
    from: { top: "-300px", opacity: "0" },
    to: { top: "0", opacity: "1" }
  },
  "@keyframes animatetop": {
    from: { top: "-300px", opacity: "0" },
    to: { top: "0", opacity: "1" }
  },
  ".close": {
    color: "white",
    cssFloat: "right",
    fontSize: "28px",
    fontWeight: "bold"
  },
  ".close:hover,\r\n.close:focus": {
    color: "#000",
    textDecoration: "none",
    cursor: "pointer"
  },
  ".modal-header": {
    padding: "2px 16px",
    backgroundColor: "#5cb85c",
    color: "white"
  },
  ".modal-body": { padding: "2px 16px" },
  ".modal-footer": {
    padding: "2px 16px",
    backgroundColor: "#5cb85c",
    color: "white"
  }
};
})();
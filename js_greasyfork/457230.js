// ==UserScript==
// @name            BNDES_Somatorio
// @version         1.1
// @namespace       sasd
// @author          BlackSt4r
// @description     Show the sum numbering related
// @icon https://seeklogo.com/images/B/bndes-banco-nacional-de-desenvolvimento-logo-A1640CEB2F-seeklogo.com.png
// @include			https://intranet.bndes.net/*
// @downloadURL https://update.greasyfork.org/scripts/457230/BNDES_Somatorio.user.js
// @updateURL https://update.greasyfork.org/scripts/457230/BNDES_Somatorio.meta.js
// ==/UserScript==
 
                 

setTimeout(function() {document.getElementsByClassName("aba")[0].click()},9000)
setTimeout(function() {
  document.getElementsByClassName("acumulado")[0].style.display = "block"
	document.getElementsByClassName("acumulado")[0].style.margin = '0 10px'
	},10000)

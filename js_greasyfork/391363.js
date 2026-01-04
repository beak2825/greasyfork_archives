// ==UserScript==
// @name         ecumoney.icu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autp ecumoney
// @author       DayZerd
// @match        https://ecumoney.icu/showadv.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391363/ecumoneyicu.user.js
// @updateURL https://update.greasyfork.org/scripts/391363/ecumoneyicu.meta.js
// ==/UserScript==

(function() {
    this.$ = this.jQuery = jQuery.noConflict(true);
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 1000) + 1000);
    function claim(){
        var numone=document.getElementById("cimg2").innerHTML;
        var numtwo=document.getElementById("cimg3").innerHTML;
        var numthree=document.getElementById("cimg4").innerHTML;
		
		var cap="";
		
		if(numone === "images/capchs/0.png"){cap = cap + "0"}
		if(numone === "images/capchs/1.png"){cap = cap + "1"}
		if(numone === "images/capchs/2.png"){cap = cap + "2"}
		if(numone === "images/capchs/3.png"){cap = cap + "3"}
		if(numone === "images/capchs/4.png"){cap = cap + "4"}
		if(numone === "images/capchs/5.png"){cap = cap + "5"}
		if(numone === "images/capchs/6.png"){cap = cap + "6"}
		if(numone === "images/capchs/7.png"){cap = cap + "7"}
		if(numone === "images/capchs/8.png"){cap = cap + "8"}
		if(numone === "images/capchs/9.png"){cap = cap + "9"}
		
		if(numtwo === "images/capchs/0.png"){cap = cap + "0"}
		if(numtwo === "images/capchs/1.png"){cap = cap + "1"}
		if(numtwo === "images/capchs/2.png"){cap = cap + "2"}
		if(numtwo === "images/capchs/3.png"){cap = cap + "3"}
		if(numtwo === "images/capchs/4.png"){cap = cap + "4"}
		if(numtwo === "images/capchs/5.png"){cap = cap + "5"}
		if(numtwo === "images/capchs/6.png"){cap = cap + "6"}
		if(numtwo === "images/capchs/7.png"){cap = cap + "7"}
		if(numtwo === "images/capchs/8.png"){cap = cap + "8"}
		if(numtwo === "images/capchs/9.png"){cap = cap + "9"}
		
		if(numthree === "images/capchs/0.png"){cap = cap + "0"}
		if(numthree === "images/capchs/1.png"){cap = cap + "1"}
		if(numthree === "images/capchs/2.png"){cap = cap + "2"}
		if(numthree === "images/capchs/3.png"){cap = cap + "3"}
		if(numthree === "images/capchs/4.png"){cap = cap + "4"}
		if(numthree === "images/capchs/5.png"){cap = cap + "5"}
		if(numthree === "images/capchs/6.png"){cap = cap + "6"}
		if(numthree === "images/capchs/7.png"){cap = cap + "7"}
		if(numthree === "images/capchs/8.png"){cap = cap + "8"}
		if(numthree === "images/capchs/9.png"){cap = cap + "9"}
		document.getElementById("capcha").value = cap;
		document.getElementById("CONTINUE").click;
	}
})();

// ==UserScript==
// @name           Facebook New Account Creator
// @author         Amey Arora - SocialDealers
// @namespace      http://www.facebook.com
// @description    Helps you create Facebook accounts
// @include        *facebook.com/r.php*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/400419/Facebook%20New%20Account%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/400419/Facebook%20New%20Account%20Creator.meta.js
// ==/UserScript==

// Parameters
var myPassword = "";

// Useful functions
function randomNumber(max) {
	return Math.floor(Math.random()*max);
}
function getRandomFirstName() {
	var FNarray = ["Ethan", "Dylan", "Lucas", "Ryan", "Ian", "Alex", "Ben", "Joel", "Justin", "Thomas", "Joshua", "Daniel", "James", "Samuel", "Joseph", "Benjamin", "Ethan", "Jacob", "Luke", "Matthew", "Adam", "Isaac", "Nathan", "Michael", "Aaron", "Noah", "David", "Reuben", "Brandon", "William"];
	return FNarray[randomNumber(FNarray.length)];
}
function getRandomLastName() {
	var LNarray = ["Ho", "Sng", "Soh", "Chua", "Phua", "Yee", "Sim", "Tan", "Lim", "Lee", "Ng", "Ong", "Wong", "Goh", "Chua", "Chan", "Koh", "Teo", "Ang", "Yeo", "Tay", "Ho", "Low", "Toh", "Sim", "Chong", "Chia", "Wu", "Chen", "Lin", "Li", "Shen", "See", "Wee", "Yu"];
	return LNarray[randomNumber(LNarray.length)];
}
	
var f = document.getElementById("reg");
f.elements.namedItem("firstname").value = getRandomFirstName();
f.elements.namedItem("lastname").value = getRandomLastName();
f.elements.namedItem("reg_passwd__").value = myPassword;
f.elements.namedItem("sex").value = '2';
// ==UserScript==
// @name VozResponsive
// @description Help You Surf VozForums in limited-width window
// @grant none
// @include *://*vozforums.com/showthread.php?t=*
// @version 0.0.1.20150827132010
// @namespace https://greasyfork.org/users/14513
// @downloadURL https://update.greasyfork.org/scripts/12019/VozResponsive.user.js
// @updateURL https://update.greasyfork.org/scripts/12019/VozResponsive.meta.js
// ==/UserScript==

posts = [].slice.call(document.querySelectorAll('[id^=post_message_]'));
bg = [].slice.call(document.querySelectorAll('table[id^=post]'));
function changeWidth(e,size){
	e.style.width = size;
	e.style.marginLeft = "0px";
}
function recalc(){
bg.forEach(function(b){
	changeWidth(b,"95vw");
});
posts.forEach(function(post,index,array){
	changeWidth(post,"88vw");
	//sig
	sigComment = post.nextSibling.nextSibling.nextSibling.nextSibling;
	//sig for first post
	if(index == 0){
	sigComment = sigComment.nextSibling.nextSibling.nextSibling.nextSibling;
	}
	if(sigComment.data ==  " sig "){
		sigNode = sigComment.nextElementSibling;
		changeWidth(sigNode,"88vw");
	}
});
}
//For Chrome,Safari
window.addEventListener("resize",recalc);
//onload
recalc();
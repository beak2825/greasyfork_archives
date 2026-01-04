// ==UserScript==
// @name         Quora Sort All Answers Based on Upvotes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Quora sort answers
// @author       Check more info
// @include      *.Quora.*
// @downloadURL https://update.greasyfork.org/scripts/368352/Quora%20Sort%20All%20Answers%20Based%20on%20Upvotes.user.js
// @updateURL https://update.greasyfork.org/scripts/368352/Quora%20Sort%20All%20Answers%20Based%20on%20Upvotes.meta.js
// ==/UserScript==


// Section 1: Scrolls down automatically to get all answers

var lastScrollHeight = 0;
function autoScroll() {
  var sh = document.documentElement.scrollHeight;
  if (sh != lastScrollHeight) {
    lastScrollHeight = sh;
    document.documentElement.scrollTop = sh;
  }
}
window.setInterval(autoScroll, 5);


// Section 2: Sort Answers

function removeK(num){
	if (num.includes("k")){
		return parseFloat(num.replace("k",""))*1000;
	} else if (num.includes("m")){
		return parseFloat(num.replace("m",""))*1000000;
	} else {
		return parseFloat(num);
	}
}
function removePlus(num){
	if (num==null){
		return 0;
	}
	if (num.includes("+")){
		return removeK(num.replace("+",""));
	} else {
		return removeK(num);
	}
}

var answerListOutter = document.getElementsByClassName('UnifiedAnswerPagedList')[0];
var answerList = answerListOutter.getElementsByClassName('paged_list_wrapper')[0];
var moreAnsButton = answerListOutter.getElementsByClassName('pager_next')[0];
moreAnsButton.parentNode.removeChild(moreAnsButton);

// removed promotion list removal procedure because no longer applicable
// var promotionList = answerList.getElementsByClassName('answer_area_content');

// for (var i =0; i<promotionList.length;i++){
// 	var promotion = promotionList[i].parentNode.parentNode;
// 	promotion.parentNode.removeChild(promotion);
// }

//removed collapsed answers
var collapsedList;
if (typeof(answerList.getElementsByClassName('CollapsedAnswersSectionCollapsed')[0]) != 'undefined')
{
	collapsedList = answerList.getElementsByClassName('CollapsedAnswersSectionCollapsed')[0].parentNode.parentNode.parentNode;
	collapsedList.parentNode.removeChild(collapsedList);
}
//main

var answers = Array.prototype.slice.call(answerList.children,0);

//sorted by upvotes
var sortedList = answers.sort(function(a,b){
	if (b.children.length == 0
		|| (a.getElementsByClassName('icon_action_bar-count')[0] != null
			&& b.getElementsByClassName('icon_action_bar-count')[0] != null
			&& (removeK(a.getElementsByClassName('icon_action_bar-count')[0].children[1].innerHTML) > removeK(b.getElementsByClassName('icon_action_bar-count')[0].children[1].innerHTML))
		)
	){
		return -1;
	} else {
		return 1;
	}
});

answerList.innerHTML = "";

//by upvotes: REMOVED DUE TO QUORA REMOVAL OF PAGE LIST HIDDEN ITEMS
 for (var i=0;i<sortedList.length;i++){
// 	if (i>7){
// 		sortedList[i].setAttribute('class', 'pagedlist_item pagedlist_hidden');
// 		sortedList[i].style.display='none';
// 	} else {
// 		sortedList[i].setAttribute('class', 'pagedlist_item');
// 		sortedList[i].removeAttribute('style');
// 	}
 	answerList.appendChild(sortedList[i]);
 }

// removed promotiona list append because no longer applicable
// for (var i =0; i<promotionList.length;i++){
// 	var promotion = promotionList[i].parentNode.parentNode;
// 	answerList.appendChild(promotion);
// }
if (collapsedList!=null){
	answerList.appendChild(collapsedList);
}
answerListOutter.appendChild(moreAnsButton);
document.getElementsByClassName('QuestionPageAnswerHeader')[0].scrollIntoView( true );
window.scrollBy(0,-62);
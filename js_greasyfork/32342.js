// Answer to... 
// https://github.com/Inversion-des/Habrahabr--Answer-to

// ==UserScript==
// @name			Answer to...
// @description		Shows the comment for which this comment is an answer
// @namespace		Habrahabr
// @version        	1.3.10
// @include			https://geektimes.com/*
// @include			https://habr.com/*
// @supportURL	    https://github.com/Inversion-des/Habrahabr--Answer-to/issues
// @downloadURL https://update.greasyfork.org/scripts/32342/Answer%20to.user.js
// @updateURL https://update.greasyfork.org/scripts/32342/Answer%20to.meta.js
// ==/UserScript==


	
/*	
класс стрелочки вверх — up-to-parent
href — #comment_1706843

ID ответа — comment_1706843
	класс заголовка — div info
	класс тела — div message
*/

"use strict";

!function(win) {

if (window != window.top) return
var doc = win.document

win.addEventListener("load", function() {
	var comments_cont = doc.getElementById('comments')
	if (comments_cont) {
	
		var msgStyle = "\
			background-color:white;\
			padding:3px 2px 0 5px;\
			position:absolute;\
			z-index:1;\
			overflow-y:auto;\
			-webkit-box-shadow:  0px 3px 12px 3px rgba(0, 0, 0, 0.3);\
			-moz-box-shadow: 0px 3px 12px 3px rgba(0, 0, 0, 0.3);\
			box-shadow: 0px 3px 12px 3px rgba(0, 0, 0, 0.3);"
		
		// готовим контейнер для просмотра
		win.msgContainer_cont = doc.createElement("div")
		win.msgContainer_cont.className = "content-list__item_comment comments_list_answerTo"
		win.msgContainer_cont.innerHTML = '<div class="comment" style="'+msgStyle+'"></div>'
		win.msgContainer_cont.style.cssText = "position:fixed;top:0px;left:0px;display:none;z-index:99;margin:0 !important;padding:0 !important;overflow:visible;text-align:left;"
		doc.body.appendChild(win.msgContainer_cont)
		win.msgContainer = win.msgContainer_cont.firstChild
 	
 		// прописываем ховер стрелочкам всех комментов
		var arrows = comments_cont.getElementsByClassName('js-comment_parent')
		$.each(arrows, activateArrow)
		
		// таймер для активации новых комментариев
		setInterval(function() {
			var $ = win.jQuery
			if ($) {
				var newComments = $('.comment .is_new .to_parent')
				for (var i=0, li=newComments.length; i<li; i++) {
					var link = newComments[i]
					if (link.getAttribute('oninit') != 'activaded') {
						activateArrow(link)
						link.setAttribute('oninit', 'activaded')
					}
				}
			}
		}, 2000)
			
		// на клик — прячем коммент
		win.addEventListener("mousedown", hideTargetComment, false)
		
	}   // if comments_cont
	
}, false);

function activateArrow(index, arrEl) {
	arrEl.addEventListener("mouseover", function(){
		showTargetComment(this.getAttribute('href'), arrEl)
	}, false)
	arrEl.addEventListener("mouseout", hideTargetComment, false)
}

function showTargetComment(href, arrEl) {
	// ищем объект по id
	var id = href.replace(/^.*?#/, '')
	var target = doc.getElementById(id)
	
	// чистим контейнер
	while (win.msgContainer.childNodes.length) {win.msgContainer.removeChild(win.msgContainer.childNodes[0])}
	
	// заполняем контейнер новым комментом
	var comment_body = target
//	for (var i=0, l=target.childNodes.length; i<l; i++) {
//		var tmp = target.childNodes[i]
//		if (/comment_body/.test(tmp.className)) {
//			comment_body = tmp
//			break
//		}
//	}
	if (comment_body) {
		for (var i=0, l=comment_body.childNodes.length; i<l; i++) {
			var tmp = comment_body.childNodes[i]
			if (/head|message/.test(tmp.className)) {
				win.msgContainer.appendChild(tmp.cloneNode(true))
			}
			// выходим из цикла
			if (tmp.className == "message") break
		}
	}
	
	// подгоняем ширину под блок комментариев
	var pageComments_cont = doc.getElementById('comments')
	win.msgContainer_cont.style.width = pageComments_cont.offsetWidth+absLeft(pageComments_cont)+2 + 'px'
	
	
	var targetTop = absTop(target)
	var windowScrollPos = doc.documentElement.scrollTop || doc.body.scrollTop
		
	// inline highlight
	win.msgContainer.style.top = targetTop>windowScrollPos  ?  targetTop-windowScrollPos-3 +'px'  :  0
	
	// height auto adjustment
	if (targetTop<windowScrollPos) {
		var currentCommentTop = absTop(arrEl.parentNode.parentNode)
		var targetCommentHeight = target.offsetHeight
		var delta = (windowScrollPos + targetCommentHeight)  -  (currentCommentTop-10)
		win.msgContainer.style.maxHeight = delta>0  ?  targetCommentHeight-delta +'px'  :  ''
	}
	else {
		win.msgContainer.style.maxHeight = ''
	}

	// показываем
	win.msgContainer.parentNode.style.display = "block"
	
	// отступы
	win.msgContainer.style.marginLeft = absLeft(target)-5+'px'
	win.msgContainer.style.width = win.msgContainer.parentNode.offsetWidth-parseInt(win.msgContainer.style.marginLeft)+'px'
}   // showTargetComment

function hideTargetComment() {
	win.msgContainer.parentNode.style.display = "none"
}

function absLeft(o) {
	var l = 0
	do {
		if (o.offsetLeft) l += o.offsetLeft-o.scrollLeft;
	} while (o = o.offsetParent)
	return l
}
function absTop(o) {
	var l = 0
	do {
		if (o.offsetTop) l += o.offsetTop-o.scrollTop;
	} while (o = o.offsetParent)
	return l
}

}(typeof unsafeWindow == 'undefined' ? window : unsafeWindow)

// ==UserScript==
// @name         Simple text parser
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match      http://*/*
// @match      https://*/*

// @grant        none
// @require https://code.jquery.com/jquery-2.2.4.js
// @downloadURL https://update.greasyfork.org/scripts/40606/Simple%20text%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/40606/Simple%20text%20parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

	console.log("Text parse activated");
	
	var allPageText = $('body *').contents().filter(function() {
		return (this.nodeType == 3) && (this.length > 1) && this.nodeValue.match(/\S/) && (this.parentNode.nodeName.toLowerCase() !== 'script') && (this.parentNode.nodeName.toLowerCase() !== 'style');
	});
	
	
	// Create text-wrap and append to body
	$("<div class='allText-wrap'>").appendTo("body");
	var allTextWrap = $('.allText-wrap')
	.css({
		"box-sizing": "boder-box",
		"position": "fixed",
		"bottom": "0",
		"left": "0",
		"background-color": "#fff",
		"border": "1px solid #eee",
		"width": "100%",
		"max-height": "50%" ,
		"overflow-y": "auto",
		"z-index": "990"
	});
	
	// Create all-text container and append it inside text-wrap
	$("<div class='allText' id='allText'>").appendTo(allTextWrap);
	var allText = $('.allText').css({
		"border-left": "1px solid #eee",
		"box-sizing": "border-box",
		"margin-left": "138px",
		"padding": "10px",
		"display": "none"
	});
	
	// Start parsing button
	$("<div class='showText' style='background-color:#fff;'>Parse text</div>").appendTo("body");
	var showText = $('.showText')
	.css({
		"border": "1px solid #eee",
		"box-sizing": "border-box",
		"padding": "10px",
		"position": "fixed",
		"left": "0",
		"bottom": "0",
		"width": "140px",
		"z-index": "999",
		"text-transform": "uppercase",
		"text-align": "center",
		"font-weight": "bold"
	});
	
	
	
	// Create copy-text button
	function addCopyButton() {
		$("<div class='copyButton'>Copy all</div>").appendTo("body");
		var copyButton = $('.copyButton')
		.css({
			"border": "1px solid #eee",
			"box-sizing": "border-box",
			// "text-transform": "uppercase",
			"padding": "10px",
			"position": "fixed",
			"left": "0",
			"bottom": "46px",
			"width": "140px",
			"z-index": "999",
			"text-align": "center",
			"font-weight": "bold"
		});
		
	}
	
	var clickedCounter = 0;
	
	// Start parsing (+addCopyButton)
	$('.showText').click(function (e) {
		if (clickedCounter == 0) {
			$.each(allPageText, function (indexInArray, valueOfElement) {
				allText.append("<p style='position: relative;margin-bottom: 5px;'>"+valueOfElement.textContent+"</p>");
			});
			allText.slideToggle();
			$(this).css({
				"background-color":"#ddd"
			}).text("HIDE");
			addCopyButton();
			addDeleteElFunctionality();
		} else {
			if (clickedCounter%2 == 1) {
				$(this).css({
					"background-color":"#ddd"
				}).text("SHOW");
				$(".copyButton").css({
					"background-color":"#fff",
					"text-transform": "none"
				}).text("Copy all");
			}
			if (clickedCounter%2 == 0) {
				$(this).css({
					"background-color":"#fff"
				}).text("HIDE");
			}
			allText.slideToggle();
			$('.copyButton').slideToggle();
		}
		clickedCounter++;
	});
	
	function addDeleteElFunctionality() {  
		$(".allText p").each(function(index, element) {
			var $eachParagraph = $(this);
			var removeParagraph = "<span class='removeParagraph' style='display:none;position:absolute;top:0;right:0;height:100%;box-sizing:border-box;padding:2px 10px;font-size: 12px;opacity:0.95;background-color:crimson;color:#fff;z-index:10;box-shadow:0px 0px 2px 1px #eee;border:1px dashed #eee;'><-- remove</span>";
			$eachParagraph.append(removeParagraph);

			$eachParagraph.hover(function() {
				$eachParagraph.css({
                    "border-top":"1px dashed #ddd",
                    "border-bottom":"1px dashed #ddd"
                    });
				$eachParagraph.children('span').toggle();
			}, function(){
				$eachParagraph.children('span').toggle();
				$eachParagraph.css({
                    "border-top":"1px dashed #fff",
                    "border-bottom":"1px dashed #fff"
                });
			});
		});

		$('.removeParagraph').click(function(){
			$(this).parent().remove();
		});

	}
	
	// Select all-text
	function SelectText(element) {
		var doc = document,
		text = doc.getElementById(element),
		range, selection;
		
		if (doc.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(text);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();
			range = document.createRange();
			range.selectNodeContents(text);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
	
	// Copy to clipboard
	document.onclick = function(e) {
		if (e.target.className === 'copyButton') {
			console.log("Copy to clipboard initiated:");
			e.target.innerText = "Copied!";
			$(".copyButton").css({
				"background-color":"#eee",
				"text-transform": "uppercase"
			});
			
			SelectText('allText');
			document.execCommand("copy");
			document.getSelection().removeAllRanges();
			
		}
	};
	
})();
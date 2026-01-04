// ==UserScript==
// @name         Тильдошная, копирование class элемента
// @namespace    https://tildoshnaya.com/
// @version      0.3.2
// @description  Копирование класса элемента по клику в редакторе
// @author       Тильдошная
// @match        https://tilda.cc/*
// @downloadURL https://update.greasyfork.org/scripts/390054/%D0%A2%D0%B8%D0%BB%D1%8C%D0%B4%D0%BE%D1%88%D0%BD%D0%B0%D1%8F%2C%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20class%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390054/%D0%A2%D0%B8%D0%BB%D1%8C%D0%B4%D0%BE%D1%88%D0%BD%D0%B0%D1%8F%2C%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5%20class%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D0%B0.meta.js
// ==/UserScript==


(async function(window) {
	"use strict";

	var shift = false;
	var z = false;
	$(window).keydown(function(e){
		if (e.keyCode == 16) {
			shift = true;
		}
		if (e.keyCode == 90) {
			z = true;
		}
	})
	$(window).keyup(function(e){
		if (e.keyCode == 16) {
			shift = false;
		}
		if (e.keyCode == 90) {
			shift = false;
		}
	})


	if (document.addEventListener) {
		document.addEventListener('contextmenu', function(e) {
			if (shift && z) {
				copyClassNumber(e);
				e.preventDefault();
			} else if (shift) {
				copyClass(e);
				e.preventDefault();
			}
		}, false);
	} else {
		document.attachEvent('oncontextmenu', function() {
			if (shift && z) {
				copyClassNumber(e);
				window.event.returnValue = false;
			} else if (shift) {
				copyClass(e);
				window.event.returnValue = false;
			}
		});
	}


	function copyClass(e) {
		var elem = $(e.target);
		if (elem.parents(".t396__artboard").length > 0) {
			var classes = elem.parents(".t396__elem").attr("class");

			var text = "." + classes.replace("t396__elem tn-elem ", "");

			navigator.clipboard.writeText(text).then(function() {
				console.log('Async: Copying to clipboard was successful!');
				copySuccess();
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
			});
		} else if (elem.parents(".tn-artboard").length > 0) {
			var parent = elem.parents(".tn-elem").attr("data-elem-id");
			var	block = elem.parents(".tn-artboard").attr("data-record-id")
			var text = ".tn-elem__" + block + parent;

			navigator.clipboard.writeText(text).then(function() {
				console.log('Async: Copying to clipboard was successful!');
				copySuccess();
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
			});
		}
	}


	function copyClassNumber(e) {
		var elem = $(e.target);
		if (elem.parents(".t396__artboard").length > 0) {
			var classes = elem.parents(".t396__elem").attr("class");

			var text = classes.replace("t396__elem tn-elem tn-elem__", "");

			navigator.clipboard.writeText(text).then(function() {
				console.log('Async: Copying to clipboard was successful!');
				copySuccess();
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
			});
		} else if (elem.parents(".tn-artboard").length > 0) {
			var parent = elem.parents(".tn-elem").attr("data-elem-id");
			var	block = elem.parents(".tn-artboard").attr("data-record-id")
			var text = ".tn-elem__" + block + parent;

			navigator.clipboard.writeText(text).then(function() {
				console.log('Async: Copying to clipboard was successful!');
				copySuccess();
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
			});
		}
	}

	function copySuccess() {
		var num = Math.floor(Math.random() * 1000) + 1;

		$("body").append("<div class='copySuccess copySuccess" + num + "' style='position: fixed; bottom: 20px; left: 20px; background: #fff; border: 1px solid rgba(0,0,0,.3); padding: 10px 20px; z-index: 99999999;'>Класс скопирован</div>");

		setTimeout(function() {
			$(".copySuccess" + num).fadeOut("slow", function(){
				$(this).remove();
			});
		}, 1000)
	}

})(window);
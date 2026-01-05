// ==UserScript==
// @name           Fiddle-ify!
// @author         Cameron Bernhardt (AstroCB)
// @version        0.1.0
// @namespace  http://github.com/AstroCB
// @description  Converts code blocks on Stack Overflow into JSFiddles with a few clicks
// @include        http://stackoverflow.com/*
// @downloadURL https://update.greasyfork.org/scripts/3879/Fiddle-ify%21.user.js
// @updateURL https://update.greasyfork.org/scripts/3879/Fiddle-ify%21.meta.js
// ==/UserScript==
var tags = document.getElementsByClassName("post-taglist")[0].children;
var tagged = false,
	jQuery = false;
var index = 0;
var html, css, javascript; //store contents of selected code blocks
var blocks = document.getElementsByClassName("default prettyprint prettyprinted"); //get code blocks
for (var i = 0; i < tags.length; i++) {
		var tagName = tags[i].innerHTML;
		if (tagName === "html" || tagName === "css" || tagName === "javascript") { //check if tagged HTML, CSS, or JavaScript
			tagged = true;
		}

		if (tagName === "jQuery") {
			jQuery = true;
		}
	}

if (tagged && blocks) { //only display button if tagged HTML, CSS, or JavaScript and has code blocks
		//(TODO: add jQuery support (toggle menu in Fiddle))
		var question = document.getElementsByClassName("vt")[0];
		question.innerHTML += "<br/><button id='fiddleify'>Fiddle-ify!</button>"; //inject "Fiddle-ify" button
		document.getElementById("fiddleify").addEventListener("click", function () { //listen for "enter" keypresses for skipping
			alert("Click a code block for HTML or press enter to skip.");
			document.addEventListener("keyup", function (e) {
				if (e.which === 37) {
					e.preventDefault();
					assign(null, index);
					index++;
				}
			});

			for (var j = 0; j < blocks.length; j++) {
				blocks[j].addEventListener("click", function () { //listen for clicks on code blocks
					if (index === 0) {
						this.style.backgroundColor = "orange";
					} else if (index == 1) {
						this.style.backgroundColor = "blue";
					} else if (index == 2) {
						this.style.backgroundColor = "yellow";
					}
					assign(this.children[0].children, index);
					index++;
				});
			}
		});
	}

function assign(element, num) {
		//TODO: add visual cue that code block has been selected
		switch (num) { //instructions for each click: HTML -> CSS -> JavaScript (runs for both "enter" keypresses and block clicks)
		case 0:
			html = element;
			alert("Click a code block for CSS or press enter to skip.");
			break;
		case 1:
			css = element;
			alert("Click a code block for JavaScript or press enter to skip.");
			break;
		case 2:
			javascript = element;
			run();
			break;
		default:
			console.log("Finished");
		}
	}

function run() { //unwrap text from code blocks (each word is in its own span)
		confirm("Loading JSFiddle...");
		var htmlText = "",
			cssText = "",
			jsText = "";
		for (var x = 0; x < html.length; x++) {
				htmlText += html[x].innerHTML;
			}

		for (var y = 0; y < css.length; y++) {
				cssText += css[y].innerHTML;
			}

		for (var z = 0; z < javascript.length; z++) {
				jsText += javascript[z].innerHTML;
			}

		var url = "//jsfiddle.net/api/post/";

		if (jQuery) { //determine whether to use jQuery
				url += "jquery/2.1.0";
			} else {
				url += "library/pure";
			}

		var data = {
				"html": html,
				"css": css,
				"js": javascript,
			}

		function load() {
				console.log(post);
			}

		var post = new GM_xmlhttpRequest({
				data: data,
				method: "POST",
				url: url,
				onload: function () {
					console.log(post);
				}
			}); //create POST request for Fiddle
	}

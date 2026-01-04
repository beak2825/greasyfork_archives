// ==UserScript==
// @name         Discord Text To Emojis
// @version      2
// @description  Convert the alphabets you entered into emojis text
// @author       You
// @match        *://discord.com/*
// @run-at       document-idle
// @grant        none

// @namespace Blaze Rider is my main on discord remember that name, xdxdxdxd
// @downloadURL https://update.greasyfork.org/scripts/476685/Discord%20Text%20To%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/476685/Discord%20Text%20To%20Emojis.meta.js
// ==/UserScript==

const {
	fetch: origFetch
} = window;
window.fetch = async (...args) => {
	console.log("fetch called with args:", args);
	const response = await origFetch(...args);

	/* work with the cloned response in a separate promise
	   chain -- could use the same chain with `await`. */
	response
		.clone()
		.json()
		.then(data => console.log("intercepted response data:", data))
		.catch(err => console.error(err));

	/* the original response can be resolved unmodified: */
	//return response;

	/* or mock the response: */
	return new Response(JSON.stringify({
		userId: 1,
		id: 1,
		title: "Mocked!!",
		completed: false
	}));
};



function textTooElement(element, text) {
	for (var char of text) {

		var keyboardEvent = document.createEvent('KeyboardEvent');
		var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? 'initKeyboardEvent' : 'initKeyEvent';

		keyboardEvent[initMethod](
			'keypress', // event type: keydown, keyup, keypress
			true, // bubbles
			true, // cancelable
			window, // view: should be window
			false, // ctrlKey
			false, // altKey
			false, // shiftKey
			false, // metaKey
			char.charCodeAt(0), // keyCode: unsigned long - the virtual key code, else 0
			0, // charCode: unsigned long - the Unicode character associated with the depressed key, else 0
		);
		console.error("dammit");
		console.error(char.charCodeAt(0));
		element.dispatchEvent(keyboardEvent);

	}
}


function textToElement(element, text) {
	setTimeout(() => {

		for (var char of text) {
			const event = new KeyboardEvent('keypress', {
				which: char.charCodeAt(0),
				keyCode: char.charCodeAt(0),
				code: char.charCodeAt(0)
			});
			element.dispatchEvent(event);
		}
	}, 1);
}

var dataslatenode = undefined;

(function() {
	'use strict';
	let alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	// console.log("starting...");
	const appmount = document.getElementById("app-mount");
	const observer = new MutationObserver((mutationlist, observer) => {
		//  c

		for (const mutation of mutationlist) {

			//for(const child of mutation.addedNodes){
			let child = mutation.target;
			// console.log("hehe");
			//console.log(child);
			if (child.getAttribute("data-slate-node")) {
				console.error("HOLY SHITTTTTTTT");
			}

			/*if(child.className.includes && child.className.startsWith("emptyText")){
                            console.log("fuck this",child);
                            child.parentNode.parentNode.parentNode.parentNode.querySelectorAll("div[class^='placeholder']")[0].remove();
							//let annoyingdiv = child.querySelectorAll("span[class^=emptyText]")[0];
                            let annoyingdiv = child;
							annoyingdiv.className = '';
							annoyingdiv.innerHTML = '<span data-slate-node="true" class=""><span data-slate-string="true">a</span></span>';
            }*/


			if (child.className.includes && child.className.includes("markup") && child.className.includes("editor") && child.className.includes("slateTextArea") && child.className.includes("fontSize16Padding")) {
				window.actualchild = child;
				window.emojimode = false;
				//if(typeof child.className !== "undefined" && child.className["includes"] && child.className.includes("channelTextArea")){
				console.error("please work");
				let pleasemodify = child.querySelectorAll("div[data-slate-node='element']")[0];
				console.error("lol", pleasemodify);

				console.error("lets go!!!!", child);


				var annoyingdiv = child.querySelectorAll("span[data-slate-leaf=true]")[0];
				window.emptyTextStr = annoyingdiv.getAttribute("class");

				var defaulthtml = annoyingdiv.innerHTML;
				var originalelement = annoyingdiv.firstChild;

                var originalplaceholder = child.parentNode.querySelectorAll("div[class^='placeholder']")[0];

				//document.getElementById("lolxdhahatrollbutton") && document.getElementById("lolxdhahatrollbutton").remove();

				if (!document.getElementById("lolxdhahatrollbutton")) {
					let button = `<div id="lolxdhahatrollbutton" class="expression-picker-chat-input-button buttonContainer-2lnNiN">
   <button aria-expanded="false" aria-haspopup="dialog" aria-controls="uid_5" aria-label="Open GIF picker" type="button" class="button-ejjZWC lookBlank-FgPMy6 colorBrand-2M3O3N grow-2T4nbg">
      <div class="contents-3NembX button-2fCJ0o button-3BaQ4X">
         <div class="buttonWrapper-3YFQGJ" style="opacity: 1; transform: none;">
            <svg width="24" height="24" class="icon-1d5zch" aria-hidden="true" role="img" viewBox="0 0 24 24">
               <path d="M 8.1 16.2 L 20.25 2.025 L 26.325 0 L 24.3 6.075 L 10.125 18.225 C 12.15 20.25 12.15 22.275 14.175 20.25 C 14.175 22.275 16.2 24.3 14.175 24.3 A 2.8755 2.8755 90 0 1 12.15 26.325 A 10.125 10.125 90 0 0 8.1 20.25 Q 7.0875 20.0475 7.0875 21.2625 T 4.05 23.895 T 2.43 22.275 T 5.0625 19.2375 T 6.075 18.225 A 10.125 10.125 90 0 0 0 14.175 A 2.8755 2.8755 90 0 1 2.025 12.15 C 2.025 10.125 4.05 12.15 6.075 12.15 C 4.05 14.175 6.075 14.175 8.1 16.2 M 20.25 2.025 L 20.25 6.075 L 24.3 6.075 L 20.655 5.67 L 20.25 2.025" clip-rule="evenodd" fill-rule="evenodd" fill="currentColor"></path>
            </svg>
         </div>
      </div>
   </button>
</div>`;

					//document.querySelectorAll("div[class^='buttons']")[0].insertBefore(new DOMParser().parseFromString(button,"text/xml"),document.querySelectorAll("div[class^='buttons']")[0].firstChild)
					document.querySelectorAll("div[class^='buttons']")[0].innerHTML = button + document.querySelectorAll("div[class^='buttons']")[0].innerHTML;

					document.querySelectorAll("div[class^='buttons']")[0].firstChild.addEventListener('click', (e) => {


						window.emojimode = !window.emojimode;
						if (window.emojimode) {
							typeof window.actualchild.parentNode.querySelectorAll("div[class^='placeholder']")[0] !== 'undefined' && window.actualchild.parentNode.querySelectorAll("div[class^='placeholder']")[0].remove();
							let annoyingdiv = window.actualchild.querySelectorAll("span[data-slate-node=text]")[0];
							//window.emptyTextStr = annoyingdiv.getAttribute("class");
							if (annoyingdiv) {
								console.log("annoying div", annoyingdiv);
								annoyingdiv.className = '';
								annoyingdiv.innerHTML = '<span data-slate-node="true" class=""><span data-slate-string="true"> </span></span>';
							}

						} else {
							let annoyingdiv = window.actualchild.querySelectorAll("span[data-slate-node=text]")[0];
							let textbox = window.actualchild.querySelectorAll("span[data-slate-string=true]")[0];
							navigator.clipboard.writeText(''+textbox.textContent);
							//window.triggeredspontaneously = true;
							//textbox.textContent = '';
							annoyingdiv.innerHTML = '';
							annoyingdiv.appendChild(originalelement);

                           //child.parentNode.insertBefore(originalplaceholder,child.parentNode.firstChild);

						}
					});
					//delete window.triggeredspontaneously;
				} else {


				}




				/*child.addEventListener("select", (e) => {
					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();
				});*/
				child.addEventListener("keypress", (e) => {
					if (!window.emojimode) {
						return;
					}


					if (!e.isTrusted) {
						//console.log(e);
						/*if (!child.innerHTML.includes('data-slate-string="true"') && false && !window.inited) {

							//console.error(pleasemodify.querySelectorAll("span[class^=emptyText]")[0]);
							child.parentNode.querySelectorAll("div[class^='placeholder']")[0].remove();
							let annoyingdiv = child.querySelectorAll("span[class^=emptyText]")[0];
							annoyingdiv.className = '';
							annoyingdiv.innerHTML = '<span data-slate-node="true" class=""><span data-slate-string="true">a</span></span>';

						} else {*/
						//console.log(e.keyCode, String.fromCharCode(e.keyCode));
						if (e.keyCode !== 8) {

							if (window.getSelection() && window.getSelection().type === "Range") {

								child.querySelectorAll("span[data-slate-string='true']")[0].textContent.replace(window.getSelection().toString(), String.fromCharCode(e.keyCode));

							} else {
								child.querySelectorAll("span[data-slate-string='true']")[0].textContent += String.fromCharCode(e.keyCode);
							}
						} else {
							if (window.getSelection() && window.getSelection().type === "Range") {
								child.querySelectorAll("span[data-slate-string='true']")[0].textContent.replace(window.getSelection().toString(), '');

							} else {
								child.querySelectorAll("span[data-slate-string='true']")[0].textContent.substring(0, child.querySelectorAll("span[data-slate-string='true']")[0].textContent - 1);
							}


						}

						/*}*/

						return;
					}
					e.preventDefault();
					e.cancelBubble = true;
					if (e.stopPropagation) e.stopPropagation();


					//console.log(e);

					if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) {



						//(e.keyCode >= 65 && e.keyCode <= 90) ? e.keyCode + 32 : e.keyCode

						textToElement(child, ":regional_indicator_" + String.fromCharCode(e.keyCode) + ": ");


					}else if(e.keyCode >= 48 && e.keyCode <= 57){
                        textToElement(child,":"+numbers[parseInt(String.fromCharCode(e.keyCode))]+": ");

                    } else {
                        if(e.keyCode === 33){
                           textToElement(child,":exclamation: ");
                           return;
                        }
                        if(e.keyCode === 63){
                          textToElement(child,":question: ");
                            return;
                        }
						if (e.keyCode === 8) {
							child.querySelectorAll("span[data-slate-string='true']")[0].textContent.substring(0, child.querySelectorAll("span[data-slate-string='true']")[0].textContent - 1);
							return;
						}
						if (e.keyCode === 32) {
							textToElement(child, String.fromCharCode(e.keyCode).repeat(3));

							return;
						}
						textToElement(child, String.fromCharCode(e.keyCode));
					}
				});

				child.addEventListener('keyup', (e) => {

					if (e.keyCode == 13) {
                        /*console.log(child.querySelectorAll("span[data-slate-string=true]")[0]);
                        console.log(child.querySelectorAll("div[class^='placeholder']")[0]);
						if (!child.querySelectorAll("span[data-slate-string=true]")[0] ) {
							window.actualchild.parentNode.querySelectorAll("div[class^='placeholder']")[0].remove();
							let annoyingdiv = window.actualchild.querySelectorAll("span[data-slate-node=text]")[0];
							//window.emptyTextStr = annoyingdiv.getAttribute("class");
							if (annoyingdiv) {
								console.log("annoying div", annoyingdiv);
								annoyingdiv.className = '';
								annoyingdiv.innerHTML = '<span data-slate-node="true" class=""><span data-slate-string="true"> </span></span>';
							}
							window.emojimode = !window.emojimode;
							return;
						}*/

						if (window.emojimode) {

							let annoyingdiv = window.actualchild.querySelectorAll("span[data-slate-node=text]")[0];
							let textbox = window.actualchild.querySelectorAll("span[data-slate-string=true]")[0];
							navigator.clipboard.writeText(''+textbox.textContent);
							//window.triggeredspontaneously = true;
							//textbox.textContent = '';
							annoyingdiv.innerHTML = defaulthtml;
							annoyingdiv.appendChild(originalelement);
							window.emojimode = !window.emojimode;
                           // child.parentNode.insertBefore(originalplaceholder,child.parentNode.firstChild);


						}

					}


				});

				return;
			}
		}



	});

	observer.observe(appmount, {
		childList: true,
		subtree: true
	});


})();
// ==UserScript==
// @name				Github Email Revealer
// @id					github_email
// @namespace			github_email

// @description			Reveals users hidden email from its commits
// @version				0.0.1

// @author				KOLANICH
// @copyright			KOLANICH, 2018
// @license				Unlicense
// @contributionURL		https://github.com/KOLANICH/github-email-revealer-userscript
// @contributionAmount	feel free to fork and contribute

// @include				/https://github.com/[\w_ -]+/?/
// @grant				none
// @noframes			1
// @run-at				document-idle
// @optimize			1
// @downloadURL https://update.greasyfork.org/scripts/371060/Github%20Email%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/371060/Github%20Email%20Revealer.meta.js
// ==/UserScript==
/*This is free and unencumbered software released into the public domain.
Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.
In jurisdictions that recognize copyright laws, the author or authors of this software dedicate any and all copyright interest in the software to the public domain. We make this dedication for the benefit of the public at large and to the detriment of our heirs and successors. We intend this dedication to be an overt act of relinquishment in perpetuity of all present and future rights to this software under copyright law.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
For more information, please refer to <https://unlicense.org/>*/
"use strict";


const GITHUB_API_BASE="https://api.github.com";
function getApiURI(userName){
	return `${GITHUB_API_BASE}/users/${userName}/events/public`
}

function getUserEmails(userName){
	return fetch(getApiURI(userName)).then(o => o.json()).then((events)=>{
		let emails={};
		for(let ev of events){
			if(ev.payload && ev.payload.commits){
				for(let commit of ev.payload.commits){
					if(commit.author && commit.author.email){
						if(!emails[commit.author.email])
							emails[commit.author.email]=1;
						else
							emails[commit.author.email]++;
					}
				} 
			}
		}
		return emails;
	});
}

function createDetailButton(detailsList, callback, name){
	let li=document.createElement("li");
	li.itemprop=name;
	li.setAttribute("aria-label", name);
	li.className="vcard-detail pt-1 css-truncate css-truncate-target";
	li.style.overflow="auto";
	let spn=document.createElement("span");
	spn.className="p-label";
	li.appendChild(spn);
	let btn=document.createElement("button");
	btn.className="btn";
	btn.textContent="Get user emails from commits";
	btn.addEventListener("click", (e)=>callback(e), false);
	li.appendChild(btn);
	detailsList.appendChild(li);
}

function createEmailButton(){
	let detailsList=document.querySelector(".vcard-details");
	createDetailButton(detailsList, (e)=>{
		let p = e.target.parentElement;
		p.removeChild(e.target);
		let userName=document.getElementsByName("octolytics-dimension-user_login")[0].content;
		getUserEmails(userName).then(
			(emails)=>{
				p.style.whiteSpace="pre";
				p.textContent=JSON.stringify(emails, null, "\t");
			}
		)
	}, "email");
}

createEmailButton();

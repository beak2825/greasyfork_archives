// ==UserScript==
// @name				GitHub Clone URL Username Adder
// @id					github-clone-url-username-adder
// @namespace			github-username-adder

// @description			Adds username to clone URL and a button to clone using TortoiseGit
// @version				0.1.2
// @screenshot			https://raw.githubusercontent.com/KOLANICH/github-clone-url-username-adder-userscript/master/images/github_repo.png https://raw.githubusercontent.com/KOLANICH/github-clone-url-username-adder-userscript/master/images/gist_repo.PNG 

// @author				KOLANICH
// @copyright			KOLANICH, 2015
// @license				Unlicensed
// @contributionURL		https://github.com/KOLANICH/github-clone-url-username-adder-userscript
// @contributionAmount	feel free to fork and contribute

// @include				/https?://(?:gist\.)?github.com/[\w_ -]+/.+/?/
// @grant				none
// @noframes			1
// @run-at				document-idle
// @optimize			1
// @downloadURL https://update.greasyfork.org/scripts/5275/GitHub%20Clone%20URL%20Username%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/5275/GitHub%20Clone%20URL%20Username%20Adder.meta.js
// ==/UserScript==
/*This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <http://unlicense.org/>*/

"use strict";
const githubForWindowsPrefix="github-windows://openRepo/";
const tortoiseGitPrefix="tgit://clone/";
try{
	let authorName=document.getElementsByName("octolytics-actor-login")[0].content;
	let cloneURLBox=document.querySelector('[data-protocol-type="http"]').getElementsByTagName("INPUT")[0];
	
	let link=document.createElement("A");
	link.href=cloneURLBox.value;
	link.username=authorName;
	cloneURLBox.value=link.href;
	link.href=tortoiseGitPrefix+link.href;
	link.innerHTML="<span class=\"octicon octicon-device-desktop\"></span> Clone to TortoiseGit";
	let cloneGHBtn;
	{//dealing with bug in gist.github.com : doubling clone-options
		let cloneOptions=document.getElementsByClassName("clone-options");
		cloneGHBtn=cloneOptions[cloneOptions.length-1].nextElementSibling;
	}
	cloneGHBtn.href=cloneGHBtn.href.substring(githubForWindowsPrefix.length);
	cloneGHBtn.username=authorName;
	cloneGHBtn.href=githubForWindowsPrefix+cloneGHBtn.href;
	
	link.className=cloneGHBtn.className;
	cloneGHBtn.parentNode.insertBefore(link,cloneGHBtn.nextElementSibling);
}catch(err){
	console.error(err);
}
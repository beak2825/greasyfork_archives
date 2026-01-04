// ==UserScript==
// @name         Send to VJudge
// @namespace    -
// @version      5
// @description  Get code submitted to other task sites and send it to VJudge
// @author       Plantt
// @match        https://open.kattis.com/problems/*
// @match        https://open.kattis.com/contests/*/problems/*
// @match        https://cses.fi/problemset/*/*
// @match        https://oj.uz/problem/*
// @match        https://www.eolymp.com/*/problems/*
// @match        https://codeforces.com/*/problem/*
// @match        https://onlinejudge.org/external/*/*.pdf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/450913/Send%20to%20VJudge.user.js
// @updateURL https://update.greasyfork.org/scripts/450913/Send%20to%20VJudge.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
	var btn;
    if (document.URL.includes("https://open.kattis.com")) {
        btn = document.createElement("a");
        btn.innerText = "Send to VJudge";
        btn.className = "tab-nav-item tab-nav-js";
        btn.onclick = () => {
            window.open("https://vjudge.net/problem/kattis-" + document.URL.substr(document.URL.lastIndexOf("/") + 1), "_blank");
        };
        document.querySelector("#edit-and-submit-tab > div > div.strip-item-plain > nav").appendChild(btn);
    }
    else if (document.URL.includes("https://cses.fi")) {
        btn = document.createElement("li");
        btn.innerHTML = `<a href="//vjudge.net/problem/cses-${document.URL.substr(document.URL.lastIndexOf("/") + 1)}" target="_blank">Send to VJudge</a>`;
        document.querySelector("body > div.skeleton > div.navigation > div.title-block > ul").appendChild(btn);
    }
	else if (document.URL.includes("https://oj.uz")) {
		btn = document.createElement("li");
		btn.innerHTML = `<a href="https://vjudge.net/problem/OJUZ-${document.URL.substr(document.URL.lastIndexOf("/") + 1)}" target="_blank">Send to VJudge</a>`;
		document.querySelector("#content > div > div > div.col-lg-9 > ul").appendChild(btn);
	}
	else if (document.URL.includes("https://www.eolymp.com")) {
		btn = document.createElement("a");
		btn.href = `//vjudge.net/problem/EOlymp-${document.URL.substr(document.URL.lastIndexOf("/") + 1)}`;
		btn.className = "eo-tabs __tab";
		btn.target = "_blank";
		btn.innerText = "Send to VJudge";
		document.querySelector("body > main > div.eo-container > div.eo-toolbar.eo-toolbar_white > nav").appendChild(btn);
	}
	else if (document.URL.includes("https://codeforces.com")) {
		btn = document.createElement("li");
		let match = document.URL.match(/https:\/\/codeforces\.com\/.+?\/problem\/(\d+?)\/(\w+?)/);
		btn.innerHTML = `<a href="//vjudge.net/problem/CodeForces-${match[1]}${match[2]}" target="_blank">Send to VJudge</a>`;
		document.querySelector("#pageContent > div.second-level-menu > ul.second-level-menu-list").appendChild(btn);
	}
	else if (document.URL.includes("https://onlinejudge.org")) {
		btn = document.createElement("a");
		btn.href = `//vjudge.net/problem/UVA-${document.URL.substr(document.URL.lastIndexOf("/") + 1)}`;
		btn.href = btn.href.substr(0, btn.href.length - 4);
		btn.innerHTML = "<button>Send to VJudge</button>";
		btn.style.position = "fixed";
		btn.style.top = btn.style.left = 0;
		document.body.appendChild(btn);
	}
	console.log("Send to VJudge button:", btn);
});
// ==UserScript==
// @name         MENDO.MK Enhancement
// @version      53
// @namespace    mendo-mk-enhancement
// @description  Adds dark mode, search in tasks and other stuff to MENDO.MK
// @author       EntityPlantt
// @match        *://mendo.mk/*
// @exclude      *://mendo.mk/jforum/*
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.4.8
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.5.2/base64.min.js
// @noframes
// @icon         https://mendo.mk/img/favicon.ico
// @grant        none
// @license      CC-BY-ND
// @downloadURL https://update.greasyfork.org/scripts/450985/MENDOMK%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/450985/MENDOMK%20Enhancement.meta.js
// ==/UserScript==

// FOUC prevention
const fouc = document.createElement("style");
fouc.innerHTML = "html,*{opacity:0 !important;}";
document.head.prepend(fouc);

const VERSION = 53, AprilFools = new Date().getMonth() == 3 && new Date().getDate() < 3, EventDeadline = new Date("apr 15 25").getTime(), USERSCRIPT_LINK = "https://greasyfork.org/en/scripts/450985-mendo-mk-enhancement";
console.log("%cMENDO.MK Enhancement", "color:magenta;text-decoration:underline;font-size:20px");
function localize(en, mk) {
	return document.cookie.includes("mkjudge_language=en") ? en : mk;
}
const achlink = {
	task: "/Training.do?cid=1",
	readlec: "/Training.do?cid=6"
};
const achname = {
	task0: localize("Apprentice (10 tasks)", "Чирак (10 задачи)"),
	task1: localize("Guru (25 tasks)", "Гуру (25 задачи)"),
	task2: localize("Pupil (50 tasks)", "Ученик (50 задачи)"),
	task3: localize("Specialist (100 tasks)", "Специјалист (100 задачи)"),
	task4: localize("Sage (150 tasks)", "Мудрец (150 задачи)"),
	task5: localize("Expert (200 tasks)", "Експерта (200 задачи)"),
	task6: localize("Master (250 tasks)", "Мајстор (250 задачи)"),
	task7: localize("Champion (300 tasks)", "Шампион (300 задачи)"),
	task8: localize("Titan (350 tasks)", "Титан (350 задачи)"),
	task9: localize("The Architect (400 tasks)", "Архитектот (400 задачи)"),
	task10: localize("Baba (450 tasks)", "Баба (450 задачи)"),
	task11: localize("Zenith (500 tasks)", "Зенит (500 задачи)"),
	readlec0: localize("Student I (all Learn C++ tasks solved)", "Студент I (сите Научи C++ лекции прочитани)"),
	readlec1: localize("Student II (all Algorithms & Learn C++ tasks solved)", "Студент II (сите Алгоритми и Научи C++ лекции прочитани)"),
	colorful0: localize("Colorful! (Get 1 testcase with every verdict on a single submission)", "Шарено! (Добиј барем 1 тест случај од секој verdict на едно исто решение)")
};
async function MendoMkEnhancement() {
	try {
		function logFinish(taskName) {
			(console.debug ?? console.log)("%cFinished setting up:%c " + taskName, "color:#0f0", "");
		}
		function collapseNavigation() {
			if (!document.querySelector(".main-navigation")) return;
			localStorage.setItem("nav collapsed", document.querySelector(".main-navigation").classList.toggle("collapsed"));
		}
        fouc.remove();
		if (localStorage.getItem("nav collapsed") == "true") collapseNavigation();
		logFinish("collapse navigation if collapsed");
		var style = document.createElement("style");
		if (!(parseFloat(localStorage.getItem("enhancement last version")) >= VERSION)) {
			Changelog();
			localStorage.setItem("enhancement last version", VERSION);
		}
		if (!localStorage.getItem("mendo-mk-enhancement-theme")) {
			localStorage.setItem("mendo-mk-enhancement-theme", window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
			logFinish("detect color scheme");
		}
		style.innerHTML = `
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css");
${ // Dark mode
			localStorage.getItem("mendo-mk-enhancement-theme") == "dark" ? `
.page-container, .page-container img, .page-container svg, #cboxWrapper, .precinematicscreen, .sitelogo, #container, #container img, .nav-emoji {
filter: invert(1) hue-rotate(180deg);
}
body, img, svg {
background-color: black;
}
::-webkit-scrollbar {
width: initial;
}
::-webkit-scrollbar-track {
background-color: #eee;
}
body::-webkit-scrollbar-track {
background-color: #111;
}
::-webkit-scrollbar-thumb {
background-color: #ddd;
}
#infoinfo {
color: white;
}
` : ""}
body::-webkit-scrollbar-thumb {
background-color: #222;
}
${AprilFools ? `
td.solved, td.wrong {
background-color: #bfb !important;
}
td.correct {
background-color: #fbb !important;
}` : `
td.solved, td.correct {
background-color: #bfb !important;
}
td.wrong {
background-color: #fbb !important;
}
`}
#search {
font-family: consolas;
}
#search, #search-submit {
border: solid 2px black;
transition: box-shadow .5s;
margin-bottom: 20px;
}
#search-submit:hover {
cursor: pointer;
}
#search:focus {
background-color: #eee;
}
#search-submit:hover, #search:hover {
background-color: #ddd;
}
.copy-io-btn {
float: right;
cursor: pointer;
border-radius: 5px;
user-select: none;
}
.copy-io-btn:hover {
opacity: .7;
}
#search:active, #search:focus, #search-submit:active, #search-submit:focus {
box-shadow: 0 0 2.5px 2.5px black;
}
@keyframes gta-cinematic-image {
0%, 50% {filter: blur(500px); opacity: 0;}
10%, 40% {filter: blur(0px); opacity: 1;}
}
td.share-solved {
background-color: #ac0 !important;
}
.update-available {
animation: update-available .5s infinite linear;
}
@keyframes update-available {
from, to {color: red}
50% {color: white}
}
.ojtxt {
animation: ojtxt 3s 1 linear;
color: white;
display: block;
}
@keyframes ojtxt {
from {color: #4f4}
to {color: white}
}
.progbar {
background-color: #0004;
margin-top: .5em;
border-radius: 5px;
padding: 2.5px;
width: 100%;
}
.progbar > div {
background-color: #bfb;
border: solid 1px gray;
border-radius: 2.5px;
height: 100%;
position: relative;
padding: 5px;
box-sizing: border-box;
}
.hidden {
display: none !important;
}
.sorttask {
font: inherit;
background-color: transparent;
border: none;
display: inline-block;
float: right;
width: 1rem;
}
td.wrong.verdict-re {
background-color: #fda !important;
}
td.wrong.verdict-tle {
background-color: #bbf !important;
}
.precinematicscreen {
top: 0px;
left: 0px;
position: fixed;
width: 100vw;
height: 100vh;
background-color: white;
font-size: 20px;
cursor: pointer;
z-index: 99999;
}
.page-container.deathscreen {
rotate: 4deg;
scale: .95;
animation: deathscreen 10s linear 1;
}
#achievement-toast {
position: fixed;
bottom: 0;
right: 0;
font-family: Times New Roman, serif;
text-align: right;
color: black;
}
#achievement-toast > div {
background-color: gold;
border-top-left-radius: 20px;
border-bottom-left-radius: 20px;
padding: 10px 20px;
flex-direction: column;
margin-bottom: 10px;
animation: achievement-toast 6s ease-in 1;
opacity: 0;
translate: 100%;
scale: 0;
}
#achievement-toast > div > :first-child {
font-size: 20px;
}
#achievement-toast > div > :last-child {
font-size: 30px;
}
@keyframes achievement-toast {
0%, 100% { opacity: 0; translate: 100%; scale: 0; }
20%, 80% { opacity: 1; translate: 0%; scale: 1; }
}
@keyframes deathscreen {
0% { rotate: 0deg; scale: 1 }
to { rotate: 4deg; scale: .95 }
}
.main {
display: flex;
flex-direction: row;
justify-content: center;
}
.main-navigation {
transition: width .5s;
overflow: hidden !important;
}
.main-navigation.collapsed {
width: 35px;
}
.main-navigation>* {
transition: opacity .5s;
opacity: 1;
}
.main-navigation.collapsed>* {
opacity: 0;
}
.collapse-navigation-container {
opacity: 1 !important;
float: right;
}
.collapse-navigation {
cursor: pointer;
border: none;
padding: 0;
font-size: 25px;
overflow: visible;
height: 0;
margin-right: 10px;
color: white;
transition: color .5s;
z-index: 99;
position: relative;
top: -5px;
}
.main-navigation.collapsed .collapse-navigation {
color: black;
}
.main-content {
padding-left: 30px;
margin: 0;
}
.event {
position: fixed;
left: 0;
bottom: 0;
display: flex;
flex-direction: column;
width: 200px;
height: 100vh;
background-color: #606;
font-family: system-ui, Verdana, sans-serif;
font-size: 20px;
font-weight: bold;
text-align: center;
color: white;
opacity: .75;
}
.event-text {
flex-shrink: 0;
padding: 10px 0;
}
.event-pbar {
height: 100%;
width: 100%;
display: flex;
flex-direction: column-reverse;
overflow: hidden;
}
.event-prog {
background-color: #808;
width: 100%;
padding-top: 10px;
overflow: hidden;
}
.event select {
color: inherit;
font: inherit;
background-color: transparent;
border: none;
border-top: solid 3px #808;
}
.event-hot, td.event-hot {
background-color: #fbf !important;
}
.event-hot a:hover {
background-color: #fdf !important;
}
#olympsearch {
color: #808;
text-decoration: underline;
}
.nameplate {
display: flex;
align-items: center;
flex-direction: row;
gap: .5em;
}
#changelog {
position: fixed;
right: 0;
height: calc(100vh - 6em);
width: 30vw;
top: 0;
box-shadow: solid black 1px;
overflow-y: auto;
background: #ddd;
padding: 2em;
font-size: 25px;
margin: 1em;
}
#changelog-cont {
position: fixed;
top: 0;
left: 0;
height: 100vh;
width: 100vw;
background: #0004;
}
.task-tab {
padding: 5px 20px;
background: #eee;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
transition: translate .3s, background-color .3s;
translate: 0 2px;
text-decoration: none !important;
color: #222 !important;
}
.task-tab::before {
padding-right: .35em;
}
.task-tab:hover, .task-tab.active {
translate: 0;
background-color: #e6e6e6;
}
.task-tab.active {
background-color: #ddd;
z-index: 9;
}
.task-tab-group {
gap: 2px;
display: flex;
font-size: 15px;
}
.task-tab-group-after {
padding: 2.5px;
display: block;
background-color: #ddd;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
margin-bottom: 15px;
position: relative;
z-index: 9;
}
.nav-emoji {
float: right;
margin-right: 10px;
}
/* April Fools'! */
html.mirrored {
transform: rotateY(1620deg) rotateX(-10deg);
}
html {
transition: transform 3s cubic-bezier(0.45, 0, 0.55, 1);
}
`;
		document.head.appendChild(style);
		logFinish("inject style sheet");
		if (document.querySelector(".sitename h1 a")) {
			document.querySelector(".sitename h1").innerHTML += ` <a href='${USERSCRIPT_LINK}' id=enhancement-logo><em><b>Enhanced</b></em></a>`;
		}
		logFinish("complete site logo");
		fetch("https://raw.githubusercontent.com/EntityPlantt/EntityPlantt.github.io/refs/heads/main/mendo-enhancement/version.txt").then(async x => {
			x = await x.text();
			let offv = parseFloat(x);
			if (offv > VERSION) {
				if (document.getElementById("enhancement-logo")) {
					document.getElementById("enhancement-logo").classList.add("update-available");
					document.querySelector("#enhancement-logo b").innerText = "Update";
				}
			}
			else if (offv < VERSION) {
				if (document.getElementById("enhancement-logo")) {
					document.querySelector("#enhancement-logo b").innerText = "Development";
				}
			}
			logFinish("check for updates");
		});
        document.querySelector(".searchform")?.remove();
		if (document.URL.includes("/Training.do") || document.URL.includes("/User_Competition.do")) {
			var search = document.createElement("form");
			search.className = "content-search";
			search.action = "#";
			search.innerHTML = `
		<input type=text id=search autocomplete=off>
		<input type=submit id=search-submit value=Search>
		`;
			search.onsubmit = e => {
				e.preventDefault();
				location.hash = "#" + encodeURIComponent(search.querySelector("#search").value);
				search.querySelector("#search").blur();
				hashChange();
			}
			function hashChange() {
				let kw = decodeURIComponent(location.hash.substring(1));
				search.querySelector("#search").value = kw;
				kw = kw.toLowerCase();
				if (kw.includes("mirror")) document.body.parentElement.classList.add("mirrored");
				else document.body.parentElement.classList.remove("mirrored");
				document.querySelectorAll("body > div.page-container > div.main > div.main-content > div > div > table > tbody > tr").forEach(elm => {
					if (!elm.querySelector("td:nth-child(2) > a")) {
						return;
					}
					if ((kw == "event.olymp2025" && /(олимпијада|мои|ibuoi)/i.test(elm.querySelector("td:nth-child(3)").innerText)) || elm.innerText.toLowerCase().includes(kw) || elm.querySelector("td:nth-child(2) > a").href.toLowerCase().includes(kw)) {
						elm.style.display = "";
					}
					else {
						elm.style.display = "none";
					}
				});
				if (AprilFools) {
					document.querySelectorAll("body > div.page-container > div.main > div.main-content > div > div > table > tbody").forEach(elm => {
						let afa = Array.from(elm.querySelectorAll("tr")).slice(1);
						function shuffle(array) {
							let currentIndex = array.length;
							while (currentIndex != 0) {
								let randomIndex = Math.floor(Math.random() * currentIndex);
								currentIndex--;
								[array[currentIndex], array[randomIndex]] = [
									array[randomIndex], array[currentIndex]];
							}
						}
						shuffle(afa);
						afa.forEach(x => elm.appendChild(x));
					});
				}
			}
			window.onhashchange = hashChange;
			hashChange();
			document.querySelector(".main-content").prepend(search);
			logFinish("add task search bar");
			document.querySelector("body > div.page-container > div.main > div.main-content > div:nth-child(3)").innerHTML += `<a href="./Training.do?cid=5">[ ${localize("Other tasks", "Други задачи")} ]</a>&nbsp;&nbsp;`;
			document.querySelector("body > div.page-container > div.main > div.main-content > div:last-child").innerHTML =
				document.querySelector("body > div.page-container > div.main > div.main-content > div:nth-child(3)").innerHTML;
			logFinish("add secret tasks");
			if (/(Статистика|Success rate)/.test(document.querySelector(".main-content > .column1-unit > .training-content table tr th:last-child")?.textContent)) {
				let elm = document.querySelector(".main-content > .column1-unit > .training-content table tr th:last-child");
				let select = document.createElement("select");
				select.innerHTML = [["normal", "indexmin"], ["latest", "indexmax"], ["min %", "percmin"], ["max %", "percmax"], ["least tried", "submin"],
				["most tried", "submax"], ["least solved", "solvmin"], ["most solved", "solvmax"]].map(x => `<option value="${x[1]}">${x[0]}</option>`).join("");
				select.className = "sorttask";
				let sortcriteria = {
					index: tr => parseInt(tr.querySelector("td").textContent),
					perc: tr => parseInt(/\((\d+)%\)/.exec(tr.querySelector("td:last-child").textContent)[1]),
					sub: tr => parseInt(/\/(\d+)\b/.exec(tr.querySelector("td:last-child").textContent)[1]),
					solv: tr => parseInt(/^(\d+)\//.exec(tr.querySelector("td:last-child").textContent)[1])
				};
				select.oninput = event => {
					let [, criteria, rev] = /^([a-z]+)(min|max)$/.exec(select.value);
					rev = rev == "max" ? -1 : 1;
					let f = sortcriteria[criteria];
					let rows = Array.from(document.querySelectorAll(".main-content > .column1-unit > .training-content table tr")).slice(1).sort((a, b) => (f(a) - f(b)) * rev);
					rows.forEach(x => document.querySelector(".main-content > .column1-unit > .training-content tbody").appendChild(x));
				};
				elm.appendChild(select);
				logFinish("add statistics sorting");
			}
		}
		if (document.querySelector("body > div.page-container > div.header > div.header-bottom > div")) {
			document.querySelector("body > div.page-container > div.header > div.header-bottom > div > ul:nth-child(1) > li > a").href = "/";
			document.querySelector("body > div.page-container > div.header > div.header-bottom > div > ul:nth-child(2) > li > a").href = "/Training.do";
			document.querySelector("body > div.page-container > div.header > div.header-bottom > div > ul:nth-child(2) > li > a").className = "";
			document.querySelectorAll("div.main-content > div > div > table > tbody > tr > td:nth-child(2) > a").forEach(e => void (e.target = "_blank"));
			logFinish("make task links open in another window");
			if (document.URL.includes("/Training.do")) {
				var solved = 0, total = 0, progbar = document.createElement("div");
				document.querySelectorAll("body > div.page-container > div.main > div.main-content > div > div > table > tbody > tr").forEach(elm => {
					if (elm.children.length < 2 || elm.children[0].nodeName.toUpperCase() == "TH") return;
					if (elm.querySelector("td.solved")) solved++;
					total++;
				});
				progbar.className = "progbar";
				progbar.innerHTML = `<div style="width:${solved / total * 100}%">${solved} / ${total} (${Math.floor(solved / total * 100)}%)</div>`;
				document.querySelector("body > div.page-container > div.main > div.main-content > div > div > table > caption").appendChild(progbar);
				logFinish("task solved percentage");
				var taskShare = document.createElement("div");
				taskShare.id = "task-list-buttons";
				taskShare.style.marginBottom = "10px";
				taskShare.innerHTML = `
<button id=solved-tasks-save>${localize("Share solved tasks", "Сподели решени задачи")}</button>
<button id=solved-tasks-load>${localize("Load shared solved tasks", "Лоадирај споделени решени задачи")}</button>
<button id=hide-solved-tasks>${localize("Hide/Show solved tasks", "Скриј/Откриј решени задачи")}</button>`;
				let taskshcode = "mendo-reseni-zadaci" + /^https?(.*)$/.exec(document.URL)[1];
				if (taskshcode.includes("#")) taskshcode = taskshcode.slice(0, taskshcode.indexOf("#"));
				taskShare.querySelector("#hide-solved-tasks").onclick = () => {
					document.querySelectorAll("body > div.page-container > div.main > div.main-content > div:nth-child(5) > div > table > tbody > tr").forEach(td => {
						if (td.childNodes[0].classList.contains("solved")) td.classList.toggle("hidden");
					});
				};
				taskShare.querySelector("#solved-tasks-save").onclick = () => {
					var array = [];
					document.querySelectorAll("body > div.page-container > div.main > div.main-content > div:nth-child(5) > div > table > tbody > tr > td:first-child").forEach(td => {
						if (td.classList.contains("solved")) array.push(td.innerText.substring(0, td.innerText.length - 1));
					});
					array.unshift(taskshcode);
					navigator.clipboard.writeText(array.join(","));
					alert(localize("Solved tasks copied, share them by pasting", "Решените задачи се копирани, сподели ги со пејстање"));
				};
				taskShare.querySelector("#solved-tasks-load").onclick = async () => {
					var array = prompt(localize("Enter code...", "Внеси код...")).split(",");
					if (array[0] != taskshcode) {
						alert(localize("Invalid task solve share schema! / Invalid page!", "Невалидна шема на споделени решени задачи! / Невалидна страна!"));
						return;
					}
					array.shift();
					document.querySelectorAll("body > div.page-container > div.main > div.main-content > div:nth-child(5) > div > table > tbody > tr > td:first-child").forEach(td => {
						if (array.includes(td.innerText.substring(0, td.innerText.length - 1))) td.classList.add("share-solved");
						else td.classList.remove("share-solved");
					});
				};
				document.querySelector(".main-content").prepend(taskShare);
				logFinish("add task share");
			}
		}
		if (document.querySelector("body > div.page-container > div.header > div.header-breadcrumbs > ul > li:last-child > a")) {
			window.name = document.querySelector("body > div.page-container > div.header > div.header-breadcrumbs > ul > li:last-child > a").innerText;
		}
		else if (document.querySelector(".pagetitle")) {
			window.name = document.querySelector(".pagetitle").innerText;
		}
		document.title = (document.querySelector(".pagetitle")
			?? document.querySelector("body > div.page-container > div.header > div.header-breadcrumbs > ul > li:last-child > a")
			?? document.querySelector(".pagename")
			?? document.getElementById("infoinfo")
			?? { innerText: document.URL.substring(document.URL.indexOf("/", 8) + 1) }
		).innerText + " – МЕНДО";
		logFinish("document title set");
		if (document.URL.includes("/Task.do") || document.URL.includes("User_ListSubmissions.do")) {
			document.querySelectorAll("body > div.page-container > div.main > div.main-content > div.column1-unit.taskContentView > table pre").forEach(pre => {
				let text = pre.innerText.substring(pre.innerText.indexOf("\n") + 1);
				let btn = document.createElement("span");
				btn.onclick = () => {
                    navigator.clipboard.writeText(text);
                    btn.className += "-check-fill";
                }
                btn.onmouseleave = () => setTimeout(() => void(btn.className = btn.className.replace("-check-fill", "")), 500);
				btn.className = "copy-io-btn bi bi-clipboard";
				pre.parentElement.prepend(btn);
			});
			logFinish("copy io buttons");
			let nav = document.createElement("div");
            nav.className = "task-tab-group";
			if (document.URL.includes("/Task.do")) {
				nav.innerHTML = `<a href="#" class="task-tab bi bi-mortarboard" id=task-tab-task>${localize("Task", "Задача")}</a><a href="#submit" class="task-tab bi bi-send" id=task-tab-submit>${localize("Submit", "Поднеси")}</a><a href="${document.URL.replace(/Task\.do\?(?:competition=\d+&)?id/, "User_ListSubmissions.do?task").replace(/#.*$/, "")}" class="task-tab bi bi-list-task">${localize("Previous submissions", "Претходни субмисии")}</a>`;
			}
			else {
				nav.innerHTML = `<a href="${document.URL.replace("User_ListSubmissions.do?task", "Task.do?id")}" class="task-tab bi bi-mortarboard">${localize("Task", "Задача")}</a><a href="${document.URL.replace("User_ListSubmissions.do?task", "Task.do?id")}#submit" class="task-tab bi bi-send">${localize("Submit", "Поднеси")}</a><b style=color:black class="task-tab bi bi-list-task active">${localize("Previous submissions", "Претходни субмисии")}</b>`;
			}
            let afternav = document.createElement("div");
            afternav.className = "task-tab-group-after";
			document.querySelector(".main-content").prepend(afternav);
			document.querySelector(".main-content").prepend(nav);
			logFinish("add nav buttons");
			if (document.URL.includes("/Task.do")) {
				function hchange() {
					let Vtask = document.querySelector(".taskContentView"), Vsubmit = document.querySelector("#submitinfocontainer");
                    let Ttask = document.getElementById("task-tab-task"), Tsubmit = document.getElementById("task-tab-submit");
					if (!Vsubmit) return;
					if (location.hash.length < 2) {
						Vtask.classList.remove("hidden");
						Vsubmit.classList.add("hidden");
                        Ttask.classList.add("active");
                        Tsubmit.classList.remove("active");
					}
					else if (location.hash == "#submit") {
						Vtask.classList.add("hidden");
						Vsubmit.classList.remove("hidden");
                        Ttask.classList.remove("active");
                        Tsubmit.classList.add("active");
					}
					document.body.scrollTo(0, 0);
				}
				hchange();
				addEventListener("hashchange", hchange);
				logFinish("listen to hash change");
                let tsContainer = document.querySelector("hr.clear-contentunit").previousElementSibling, pttl = document.querySelector(".pagetitle");
                pttl.style = "display:flex;padding:.25em";
                if (tsContainer.textContent.includes(localize("Last submission sent on ", "Последниот код е испратен на "))) {
                    let ts = tsContainer.children[0];
                    let iurl = /^url\("(.+)"\)$/.exec(ts.style.backgroundImage)[1];
                    let img = new Image;
                    img.src = iurl;
                    img.style = "border:none;margin:0;padding:0;width:1em;height:1em;margin-left:.5em;";
                    pttl.appendChild(img);
                    tsContainer.remove();
                    logFinish("remove last submit");
                }
                document.querySelector("hr.clear-contentunit").remove();
			}
			if (document.URL.includes("/Task.do") && document.querySelector("#solutionCode")) {
				setInterval(() => {
					let scode = document.getElementById("solutionCode");
					if (!scode.value.includes("// online judge") && !scode.value.includes("#define ONLINE_JUDGE") && scode.value.length) {
						scode.value = "#define ONLINE_JUDGE // online judge\n" + scode.value;
						document.querySelector("label[for=solutionCode]").innerHTML += `<a href="${USERSCRIPT_LINK}" class=ojtxt>${localize("This macro was automatically added", "Ова макро беше автоматски додадено")}: <code>ONLINE_JUDGE</code></a>`;
						setTimeout(() => document.querySelector(".ojtxt:last-child").remove(), 3000);
					}
				}, 500);
				logFinish("#define ONLINE_JUDGE");
			}
		}
		(document.querySelector(".footer") ?? {}).innerHTML += `<p class="credits"><a href="${USERSCRIPT_LINK}">MENDO.MK Enhancement</a> <a href="javascript:toggleTheme()">🎨</a> <a href="javascript:Changelog()">Changelog</a></p>`;
		window.toggleTheme = () => {
			localStorage.setItem("mendo-mk-enhancement-theme", localStorage.getItem("mendo-mk-enhancement-theme") == "dark" ? "light" : "dark");
			location.reload();
		};
		let dmodebtn = document.createElement("div");
		dmodebtn.className = `bi bi-${localStorage.getItem("mendo-mk-enhancement-theme") == "dark" ? "moon" : "sun"}-fill`;
		document.body.appendChild(dmodebtn);
		dmodebtn.style = "width:30px;height:30px;font-size:30px;position:fixed;bottom:0;right:0;margin:10px;cursor:pointer;color:#89AAD6";
		dmodebtn.setAttribute("onclick", "toggleTheme()");
		logFinish("dark mode button");
		if (/^https?:\/\/mendo\.mk\/.*?User_Submission.do\?/.test(document.URL) && !document.URL.includes("ctest=true")) {
			let ok = false;
			for (let elm of document.querySelectorAll("img")) {
				if (elm.src.includes("loadingAnimation")) {
					ok = true;
					break;
				}
			}
			function checkForCinematic() {
				let usubTBody = document.querySelector("div.main-content > div > div > table:nth-child(6) > tbody");
				if (!ok) {
					taskSolveCinematic(0, true);
					return;
				}
				if (!usubTBody) {
					requestAnimationFrame(checkForCinematic);
				}
				else if (usubTBody.querySelectorAll("tr td.correct:first-child").length + 1 >= usubTBody.querySelectorAll("tr").length) taskSolveCinematic(1, true);
				else taskSolveCinematic(2, true);
			}
			checkForCinematic();
			logFinish("task solve cinematic setup");
		}
		if (!isNaN(parseInt(document.querySelector("#LoginForm>fieldset>p:last-child>a")?.innerText))) {
			let elm = document.createElement("p");
			let tasks = parseInt(document.querySelector("#LoginForm>fieldset>p:last-child>a").innerText);
			let ach = getAchievements();
			let allread = true, lecturepage = false;
			for (let e of document.querySelectorAll(".training-content td:last-child")) {
				if (e.innerText.includes(localize("lecture", "предавање"))) {
					lecturepage = true;
					if (!e.classList.contains("solved")) {
						allread = false;
						break;
					}
				}
			}
			if (tasks >= 10) addAchievement("task", 0);
			if (tasks >= 25) addAchievement("task", 1);
			if (tasks >= 50) addAchievement("task", 2);
			if (tasks >= 100) addAchievement("task", 3);
			if (tasks >= 150) addAchievement("task", 4);
			if (tasks >= 200) addAchievement("task", 5);
			if (tasks >= 250) addAchievement("task", 6);
			if (tasks >= 300) addAchievement("task", 7);
			if (tasks >= 350) addAchievement("task", 8);
			if (tasks >= 400) addAchievement("task", 9);
			if (tasks >= 450) addAchievement("task", 10);
			if (tasks >= 500) addAchievement("task", 11);
			if (allread && lecturepage && (document.URL.endsWith("/Training.do") || document.URL.endsWith("/Training.do?cid=0") || document.URL.endsWith("/Training.do?cid=4"))) addAchievement("readlec", 0);
			if (allread && lecturepage && document.URL.endsWith("/Training.do?cid=6") && ach.readlec === 0) addAchievement("readlec", 1);
			ach = getAchievements();
			elm.innerHTML = `${localize("Achievements", "Постигнувања")}:<br>${Object.entries(ach).map(x => `&nbsp; &nbsp; <a title="${achname[x[0] + x[1]]}" href="${achlink[x[0]]}">${/(.+) \(/i.exec(achname[x[0] + x[1]])[1]}</a>`).join("<br>") || localize("None", "Нема")}`;
			document.querySelector("#LoginForm>fieldset").appendChild(document.createElement("br"));
			document.querySelector("#LoginForm>fieldset").appendChild(elm);
			logFinish("achievements");
		}
        if (document.querySelector(".nav2>p>a")) {
            let x = document.querySelector(".nav2>p>a");
            document.querySelector(".header-breadcrumbs").appendChild(x);
            document.querySelector(".header-bottom").remove();
            x.style = "float:right;margin-right:1em;";
            document.querySelector(".header-breadcrumbs").style.paddingTop = 0;
        }
		if (document.querySelector(".main-navigation>ul")) {
			let nav = document.querySelector(".main-navigation>ul");
			let collapseparent = document.querySelector(".main-navigation>.round-border-topright");
			if (!collapseparent) {
				collapseparent = document.createElement("div");
				document.querySelector(".main-navigation").prepend(collapseparent);
			}
			collapseparent.className = "collapse-navigation-container";
			let collapse = document.createElement("button");
			collapseparent.appendChild(collapse);
			collapse.innerText = "≡";
			collapse.className = "collapse-navigation";
			collapse.onclick = collapseNavigation;
            const registered = !document.getElementById("LoginForm").textContent.includes(localize("Password", "Лозинка"));
			let links = [
				["National", "Национални", "/Training.do?cid=1", "🇲🇰"],
				["International", "Интернационални", "/Training.do?cid=2", "🇬🇧"],
                ["II Algorithms", "ИИ Алгоритми", "/algoritmi/Welcome.do", "💡"],
                ["Tasks for practice", "Задачи за вежбање", "/algoritmi/User_Competition.do?id=150", "☑️"],
                ["Learn C++", "Научи C++", "/Training.do", "🎓️"],
                ["Algorithms", "Алгоритми", "/Training.do?cid=6", "📊"],
                ["Introductory tasks", "Воведни задачи", "/Training.do?cid=3", "🔰"],
                ["Competitions", "Натпревари", "/Competitions.do", "⚽️"],
                registered ? ["Profile", "Профил", "/User_EditProfile.do", "📝"] : ["Registration", "Регистрација", "/Register.do", "📝"],
                ["Submissions", "Решенија", "/User_ListSubmissions.do", "✅️"],
                ["Help", "Помош", "/Help.do", "❓️"],
                ["Report a bug on MENDO", "Пријави грешка на МЕНДО", "javascript:$.colorbox({open:true,href:'/simple_jsp/report_bug.jsp'})", "🪲"],
                ["MENDO Enhancement", "MENDO Enhancement", USERSCRIPT_LINK, "✨️"],
                ["Support MENDO Enhancement", "Поддржи го MENDO Enhancement", "javascript:$.colorbox({open:true,href:'data:text/html;base64,"
                 + window.Base64.encode(`<p style=font-size:15px;padding:10px;text-align:center;width:200px>${localize("Support MENDO Enhancement by leaving a positive comment", "Поддржи го MENDO Enhancement со оставање на позитивен коментар")} <a href=${USERSCRIPT_LINK}/feedback>${localize("here", "тука")}</a>! 💖</p>`) + "'})", "💖"],
			];
			nav.innerHTML = links.map(l => `<li><a href="${l[2]}">${localize(l[0], l[1])}<span class=nav-emoji>${l[3] ?? ""}</span></a></li>`).join("");
			if (Date.now() < EventDeadline) {
				nav.childNodes[0].classList.add("event-hot");
				nav.querySelector("a").innerHTML += " <i class='bi bi-hourglass-split'></i>";
			}
			logFinish("navigation bar");
		}
		if (document.URL.includes("/Training.do?cid=1") && Date.now() < EventDeadline && localStorage.getItem("event.total") !== "0") {
			let evbar = document.createElement("div");
			let totalTasks = parseInt(localStorage.getItem("event.total") || "45"), solvedTasks = Array.from(document.querySelectorAll(".training-content td:nth-child(3)")).filter(x => /(Олимпијада|ibuoi|мои)/i.test(x.innerText)), untilend = EventDeadline - Date.now();
			evbar.className = "event";
			solvedTasks.forEach(x => {
				x.classList.add("event-hot");
				x.innerHTML = `<a href="#event.olymp2025">${x.innerHTML}</a>`;
			});
			solvedTasks = solvedTasks.filter(x => x.classList.contains("solved"));
			evbar.innerHTML = `
			<div class=event-pbar>
				<div class=event-prog style="height:${solvedTasks.length / totalTasks * 100}%">[${(Math.min(solvedTasks.length / totalTasks, 1) * 100).toFixed(0)}%] ${solvedTasks.length} / ${totalTasks}<br>${localize("TASKS SOLVED", "ЗАДАЧИ РЕШЕНИ")}</div>
			</div>
			<div class=event-text>${Math.floor(untilend / 864e5)} ${localize("DAYS LEFT", "ДЕНОВИ ОСТАНАТИ")}<br>
			<a href="https://cs.org.mk/konechna-lista-na-uchesnici-pokaneti-na-moi-2024-copy/" style="color:white" target=_blank>${localize("Announcement", "Соопштение")}</a></div>
			<select autocomplete=off onchange="localStorage.setItem('event.total', this.value);if(this.value=='0')alert(localize('Turn it on again with:', 'Упали го пак со:')+'\\ndelete localStorage[\\'event.total\\']');location.reload()">
				<option value=45>${localize("MOI", "МОИ")}</option>
				<option value=20>${localize("MJOI", "МЈОИ")}</option>
				<option value=25>${localize("EGOI", "ЕГОИ")}</option>
				<option value=0>${localize("Turn off", "Исклучи")}</option>
			</select>
			`;
			evbar.querySelector("select").value = totalTasks + "";
			document.body.appendChild(evbar);
			let olympsearch = document.createElement("a");
			olympsearch.id = "olympsearch";
			olympsearch.innerText = localize("Olympiad valid tasks", "Задачи валидни за олимпијада");
			olympsearch.href = "#event.olymp2025";
			let olympsend = document.createElement("button");
			olympsend.innerText = "Направи листа од решени валидни задачи";
			olympsend.style = "color:#f0f;background-color:#eae;border-radius:5px";
			olympsend.onclick = () => {
				let list = solvedTasks.map(x => x.previousElementSibling).map(x => `${x.previousElementSibling.innerText} ${x.innerText} (${x.nextElementSibling.innerText}) - ${x.querySelector("a").href}`).join("\n");
				navigator.clipboard.writeText(list);
				alert(list);
			};
			document.querySelector(".content-search").appendChild(olympsearch);
			document.getElementById("task-list-buttons").appendChild(olympsend);
			logFinish("event bar");
		}
		if (document.URL.includes("/User_CompetitionResults.do?id=")) {
			let res = document.getElementById("resultstable");
			res.querySelectorAll("td[data-user-id] table").forEach(tb => {
				let wrapper = document.createElement("div");
				tb.querySelectorAll("td").forEach(x => Array.from(x.childNodes).forEach(y => wrapper.appendChild(y)));
				wrapper.className = "nameplate";
				tb.parentElement.appendChild(wrapper);
				tb.remove();
			});
			let table = Array(res.querySelector("tr").childNodes.length);
			for (let tr of res.querySelectorAll("tr")) {
				for (let i = 0; i < tr.childNodes.length; i++) {
					if (isNaN(tr.childNodes[i].innerText)) continue;
					if (!table[i]) table[i] = [];
					table[i].push(tr.childNodes[i]);
				}
			}
			for (let i of table) {
				if (!i) continue;
				let mx = Math.max(...i.map(x => parseInt(x.innerText)));
				if (mx < 15) continue;
				i.forEach(j => {
					let perc = parseInt(j.innerText) / mx;
					if (perc > .9999) {
						j.style.fontWeight = "bold";
						j.style.border = "solid 2px #0008";
					}
					j.style.backgroundColor = `hsl(${perc * 120}, 100%, 70%)`;
				});
			}
			logFinish("olympiad results coloring");
		}
        if (document.getElementById("LoginForm").textContent.includes(localize("Username:", "Корисник:"))) {
            document.querySelector("#LoginForm p").innerHTML += ` (<a href=/User_Logoff.do>${localize("Log out", "Одјави се")}</a>)`;
        }
	}
	catch (_) {
		console.error(_);
	}
}
function taskSolveCinematic(showType, reformatTcs = false) {
	if (AprilFools) {
		let congrattd = document.querySelector(".submission-content tr[align=right] td");
		if (congrattd && congrattd.innerText.includes("Congratulations!")) congrattd.innerHTML = "April Fools!";
		if (congrattd && congrattd.innerText.includes("Честитки!")) congrattd.innerHTML = "Априлилили!";
	}
	if (reformatTcs) {
		let tcs = document.querySelector("div.main-content > div > div > table:nth-child(6) > tbody");
		let tr, nAC = 0, nWA = 0, nTLE = 0, nRE = 0, actimes = {};
		for (let tc of Array.from(tcs.children)) {
			if (!tr || tr.children.length == 5) {
				tr = document.createElement("tr");
				tcs.appendChild(tr);
			}
			let td = tc.querySelector("td");
			if (td) {
				if (tc.innerText.includes("Runtime Error")) {
					td.innerText += " RE";
					td.classList.add("verdict-re");
					nRE++;
				}
				if (tc.innerText.includes("Wrong") || tc.innerText.includes("Погрешен")) {
					td.innerText += " WA";
					td.classList.add("verdict-wa");
					nWA++;
				}
				if (tc.innerText.includes("Time") || tc.innerText.includes("време")) {
					td.innerText += " TLE";
					td.classList.add("verdict-tle");
					nTLE++;
				}
				if (tc.innerText.includes("Точен") || tc.innerText.includes("Correct")) {
					let time = parseFloat(/[\d.]+/.exec(tc.children[1].innerText)[0]) * 1e3;
					td.innerText += `AC (${time})`;
					actimes[time <= 5 ? -1 : Math.floor(time / 100)] ??= 0;
					actimes[time <= 5 ? -1 : Math.floor(time / 100)]++;
					td.classList.add("verdict-ac");
					nAC++;
				}
				if (tc.querySelector("a")) {
					td.innerHTML = `<a href="${tc.querySelector("a").href}">${td.innerText}</a>`;
				}
				tr.appendChild(td);
			}
			tc.remove();
		}
		// Colorful achievement
		if (nAC > 0 && nTLE > 0 && nWA > 0 && nRE > 0) {
			tcs.previousElementSibling.innerHTML = localize("Colorful!!!", "Шарено!!!").split("").map((x, i) => `<span style="color:${["#fda", "#bbf", "#fbb", "#bfb"][i % 4]}">${x}</span>`).join("");
			addAchievement("colorful", 0);
		}
		let chartscont = document.createElement("div");
		let pie = document.createElement("canvas"), bar = document.createElement("canvas");
		chartscont.appendChild(pie);
		chartscont.appendChild(bar);
		chartscont.style = "height:250px;display:flex;justify-content:center;align-items:center;flex-directon:column";
		document.querySelector(".submission-content").insertBefore(chartscont, document.querySelectorAll(".submission-content table")[2]);
		new window.Chart(pie, {
			type: "pie",
			data: {
				labels: ["AC", "WA", "TLE", "RE"],
				datasets: [{
					label: localize("Results", "Резултати"),
					data: [nAC, nWA, nTLE, nRE],
					backgroundColor: ["#bfb", "#fbb", "#bbf", "#fda"]
				}]
			}
		});
		new window.Chart(bar, {
			type: "bar",
			data: {
				labels: (x => nTLE ? x.concat("TLE") : x)(Object.keys(actimes).sort((a, b) => parseInt(a) - parseInt(b)).map(x => parseInt(x)).map(x => x < 0 ? localize("Instant", "Инстантно") : `${x * 100}-${x * 100 + 99}`)),
				datasets: [{
					label: localize("Runtime", "Време на извршување"),
					data: (x => nTLE ? x.concat(nTLE) : x)(Object.entries(actimes).sort((a, b) => parseInt(a[0]) - parseInt(b[0])).map(x => x[1])),
					backgroundColor: "#bbb",
					inflateAmount: 0
				}]
			}
		});
	}
	if (!showType) return;
	var preCinematicScreen = document.createElement("div");
	preCinematicScreen.className = "precinematicscreen";
	preCinematicScreen.innerHTML = `
	<div style="color: black; position: fixed; top: 50vh; left: 50vw; transform: translate(-50%, -50%);">[ ${localize("Reveal", "Откриј")} ]</div>
	<div style="color: black; position: fixed; top: 10px; right: 10px;" id=skip-cinematic>${localize("Skip", "Скокни")} &gt;&gt;</div>
	`;
	preCinematicScreen.onclick = ev => {
		preCinematicScreen.remove();
		if (window.event.target.id == "skip-cinematic") return;
		const cinematics = [() => {
			let img = document.createElement("img");
			img.src = "https://i.ibb.co/b7WW8Q3/mission-passed.png";
			img.style = "animation: gta-cinematic-image 17s 1 linear; position: fixed; top: 0; left: 0; width: 100vw; background-color: transparent !important";
			let audio = document.createElement("audio");
			audio.oncanplay = () => audio.play();
			audio.crossorigin = "anonymous";
			audio.src = "https://www.myinstants.com/media/sounds/gta-san-andreas-mission-passed-sound_TpUVE5G.mp3";
			document.body.appendChild(img);
			setTimeout(() => img.remove(), 10000);
		}, () => {
			let xporb = new Image;
			xporb.src = "https://minecraft.wiki/images/Experience_Orb_Value_3-6.png?6de8c&format=original";
			xporb.style = `position:fixed;translate:-50% -50%;width:25px;background-color:transparent`;
			let orbsfx = new Audio("https://minecraft.wiki/images/Successful_hit.ogg?b99e0");
			let orbs = Array(document.querySelectorAll(".verdict-ac").length * 2).fill(0).map(() => {
				let orb = xporb.cloneNode();
				orb.style.top = Math.random() * innerHeight + "px";
				orb.style.left = Math.random() * innerWidth + "px";
				document.body.appendChild(orb);
				return orb;
			});
			let mousex = ev.clientX, mousey = ev.clientY;
			addEventListener("mousemove", e => {
				mousex = e.clientX;
				mousey = e.clientY;
			});
			function fr() {
				orbs = orbs.map(o => {
					if (!o) return;
					let x = parseFloat(o.style.left), y = parseFloat(o.style.top);
					let dist = ((mousex - x) ** 2 + (mousey - y) ** 2) ** .5, speed = 150 * dist ** -.7;
					let vx = speed / dist * (mousex - x), vy = speed / dist * (mousey - y);
					if (Math.abs(x - mousex) < o.offsetWidth / 2 && Math.abs(y - mousey) < o.offsetHeight / 2) {
						o.remove();
						let sfx = orbsfx.cloneNode();
						sfx.playbackRate = Math.random() * .7 + .55;
						sfx.mozPreservesPitch = false;
						sfx.webkitPreservesPitch = false;
						sfx.preservesPitch = false;
						sfx.play();
						return null;
					}
					o.style.left = x + vx + "px";
					o.style.top = y + vy + "px";
					return o;
				});
				if (orbs.some(x => x)) requestAnimationFrame(fr);
			}
			fr();
		}], failCinematics = [() => {
			let audio = document.createElement("audio");
			audio.oncanplay = () => audio.play();
			audio.crossorigin = "anonymous";
			audio.src = "https://www.myinstants.com/media/sounds/erro.mp3";
			let img = document.createElement("img");
			img.src = "https://i.kym-cdn.com/photos/images/original/000/918/810/a22.jpg";
			img.style = "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(.5); background-color: transparent !important; box-shadow: black 10px 10px 5px";
			document.body.appendChild(img);
			img.onclick = () => img.remove();
		}, () => {
			let audio = new Audio("https://minecraft.wiki/images/Player_hurt3.ogg");
			audio.play();
			audio.oncanplay = () => audio.play();
			let dm = document.createElement("map");
			dm.name = "deathmap";
			dm.innerHTML = `<area shape=rect coords="322,371,977,436" href="javascript:document.getElementById('deathmap').remove();document.querySelector('.page-container').classList.remove('deathscreen')">
			<area shape=rect coords="322,450,977,509" href="/">
			<img src="https://i.ibb.co/DHYzFtyL/deathscreen.png" height=720 style="background-color:transparent" usemap="#deathmap">`;
			dm.style = "position:fixed;top:50%;left:50%;translate:-50% -50%";
			let bg = document.createElement("div");
			bg.style = "top:0;left:0;width:100vw;height:100vh;position:fixed;background-color:#ff000540";
			bg.id = "deathmap";
			bg.appendChild(dm);
			document.body.appendChild(bg);
			document.querySelector(".page-container").classList.add("deathscreen");
		}];
		if (showType == 1) cinematics[Math.floor(Math.random() * cinematics.length)]();
		else failCinematics[Math.floor(Math.random() * failCinematics.length)]();
	};
	document.body.appendChild(preCinematicScreen);
}
async function Changelog() {
    let div = document.createElement("div"), cont = document.createElement("div");
    div.id = "changelog";
    cont.id = "changelog-cont";
    cont.appendChild(div);
    document.body.appendChild(cont);
    cont.onclick = () => cont.remove();
    div.innerText = "Fetching changelog...";
    div.innerText = await fetch("https://raw.githubusercontent.com/EntityPlantt/EntityPlantt.github.io/refs/heads/main/mendo-enhancement/changelog.txt").then(x => x.text()).catch(x => "Changelog not found");
}
function getAchievements() {
	let ach = JSON.parse(localStorage.getItem("achievements " + document.querySelector("#LoginForm>fieldset>p>a").innerText) || "{}");
    // 44.2 achievement migration existed here
	return ach;
}
function addAchievement(name, lvl) {
	let ach = getAchievements();
	if (ach[name] >= lvl) return false;
	ach[name] = lvl;
	localStorage.setItem("achievements " + document.querySelector("#LoginForm>fieldset>p>a").innerText, JSON.stringify(ach));
	achievementToast(/^(.+) \(.+?\)$/.exec(achname[name + lvl])[1]);
	return true;
}
function achievementToast(text) {
	if (!document.getElementById("achievement-toast")) {
		let d = document.createElement("div");
		d.id = "achievement-toast";
		document.body.appendChild(d);
	}
	let div = document.createElement("div");
	div.innerHTML = `<div>${localize("Achievement got!", "Постигнување добиено!")}</div><div>${text}</div>`;
	document.getElementById("achievement-toast").appendChild(div);
}
Object.assign(window, { MendoMkEnhancement, taskSolveCinematic, Changelog, addAchievement, getAchievements, achievementToast, localize });
MendoMkEnhancement();
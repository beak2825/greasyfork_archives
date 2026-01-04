// ==UserScript==
// @name		ModernGMOJ
// @version		1.5.1
// @namespace		https://gmoj.net/
// @match		https://gmoj.net/*
// @icon		https://gmoj.net/favicon.ico
// @run-at		document-start
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		GM_registerMenuCommand
// @description github.com/danielqfmai/ModernGMOJ
// @downloadURL https://update.greasyfork.org/scripts/485151/ModernGMOJ.user.js
// @updateURL https://update.greasyfork.org/scripts/485151/ModernGMOJ.meta.js
// ==/UserScript==

"use strict";

var language = localStorage.getItem("language");
if (language == null) {
	language = "Chinese";
	localStorage.setItem("language", "Chinese");
}
GM_registerMenuCommand('switch language (reload the page after you click it)', () => {
	if(language == "Chinese") language = "English";
	else language = "Chinese";
	localStorage.setItem("language", language);
});

var parser=new DOMParser();

const mapList = {
	//Left
	'#nav_home > a': "Home",
	'#nav_problemset > a': "Problemset",
	'#nav_status > a': "Status",
	'#nav_contest > a': "Contest",
	'#nav_task > a': "Task",
	'#nav_group > a': "Group",
	'#nav_ranklist > a': "Ranklist",
	'#nav_custom_test > a': "Customtest",
	'#nav_admin > a': "Admin",
	'#nav_admin > ul > li:nth-child(1) > a': "Problems",
	//in Contest
	'#page_content > div.navbar > div > ul > li:nth-child(2) > a': "Home",
	'#page_content > div.navbar > div > ul > li:nth-child(3) > a': "Problems",
	'#page_content > div.navbar > div > ul > li:nth-child(4) > a': "Declaration",
	'#page_content > div.navbar > div > ul > li:nth-child(5) > a': "Status",
	'#page_content > div.navbar > div > ul > li:nth-child(6) > a': "Standing",
	'#page_content > div.navbar > div > ul > li:nth-child(7) > a': "Statistic",
	'#page_content > div.navbar > div > ul > li:nth-child(8) > a': "Forum",
	//#Contest
	'#contest_table > thead > tr > th:nth-child(1)': "Contest ID",
	'#contest_table > thead > tr > th:nth-child(2)': "Title",
	'#contest_table > thead > tr > th:nth-child(3)': "Start Time",
	'#contest_table > thead > tr > th:nth-child(4)': "End Time",
	'#contest_table > thead > tr > th:nth-child(5)': "Status",
	//Problem
	'#sidebar > div:nth-child(1) > fieldset > legend > h5 > em': "Status",
	'#sidebar > div:nth-child(1) > fieldset > div:nth-child(2) > span': "Accept",
	'#sidebar > div:nth-child(1) > fieldset > div:nth-child(3) > span': "Submission",
	'#sidebar > div:nth-child(1) > fieldset > div:nth-child(4) > span': "Average",
	'#sidebar > div:nth-child(1) > fieldset > div:nth-child(5) > a': "Show my submisson",
	'#sidebar > div:nth-child(1) > fieldset > div:nth-child(6) > button': "Submit",
	'#tags > legend > h5 > em': "Tags",
	'#tags > legend > h5 > button': "Edit",
	'#sidebar > div:nth-child(3) > fieldset > legend > h5 > em': "Editorial",
	'#sidebar > div:nth-child(3) > fieldset > legend > h5 > button': "Add",
	'#sidebar > div:nth-child(4) > fieldset > legend > h5 > em': "Source/Author",
	'#sidebar > div:nth-child(5) > fieldset > legend > h5 > em': "High",
	'span[class*="btn btn-mini btn_copy"]': "Copy",
	'span[class*="btn btn-mini btn_luogu"]': "Copy",
};

function change_word() {
	if (language == "English") {
		for (const key in mapList) {
			$(key).html(mapList[key]);
		}
	}
}

function make_timer() {
	if ($("#timer").length==0&&$("#navigation").length>0) {
		var li=document.createElement("li"),a=document.createElement("a");
		li.className="nav_bar";
		a.id="timer";
		li.appendChild(a);
		$("#navigation")[0].appendChild(li);
		$("#timer").text((new Date($.now() + delta)).toString().substr(16,8));
		setInterval("$('#timer').text((new Date($.now() + delta)).toString().substr(16,8))",500);
	}
}

function sidebar() {
	$(` #nav_home, #nav_task, #nav_group, #nav_ranklist, #nav_admin,
	#scroll_tip, #nav_toggle,
	#copyleft`).remove();
}

function contest_home_page() {
	$(`#contest_table th:nth-child(8),
	   #contest_table td:nth-child(8),
	   #contest_table th:nth-child(5),
	   #contest_table td:nth-child(5),
	   #contest_table th:nth-child(3),
	   #contest_table td:nth-child(3)`).remove();
}

function return_button() {
	var dirname=document.location.hash.split("/");
	if (dirname.length>2&&dirname[0]=="#main"&&dirname[1]=="statistic") {
		$("#page_content>button").click(function() {
			document.location.hash="#main/show/"+dirname[2];
		});
	}
}

function trigger(data) {
	var a=$("#trigger");
	var x=`<div style="position: absolute; display: none;"><div style="
			max-height: 350px;
			overflow-y: auto;
			margin-top: 16px;
			padding: 10px;
			background-color: #f5f5f5;
			color: #333;
			border-radius: 4px;
			box-shadow: 0px 0px 3px rgba(0,0,0,0.2);">`
		+data.replace(new RegExp("(Case [0-9]*<br />)*$"),"</div></div>").
		replace(/Case [0-9]+/g,"<b style='display: inline-block; margin-top: 6px;'>$&</b>");
	a.each(function(){
		$(this)[0].innerHTML+=x;
		$(this).parent()[0].removeAttribute("href");
		$(this).find(".label.label-info").css("float","right");
		$(this).find(".label.label-info").css("margin-left","2px");
	});
	a.mouseenter(function(){
		var b=$(this).find("div");
		b.fadeIn(250);
		b.css( "top",($(this)[0].offsetTop)+"px");
		b.css("left",($(this)[0].offsetLeft+7-b[0].clientWidth/2)+"px");
	});
	a.mouseleave(function(){a.find("div").fadeOut(250);});
}

function contest_saver() {
	if (location.hash.split("#contest/home/").length>1
			&& $("div.hero-unit").length)
		$("div.hero-unit")[0].innerHTML +=
		`<button class="btn btn-primary" onclick="
			'use strict';
			const contestid = location.hash.split('/')[2];
			const parser = new DOMParser();
			var dirHandle;
			var imgcnt = 0;
			async function download(url,name,dir) {
				const tmp = await Promise.all([fetch(url),
				  (await dir.getFileHandle(name, { create: true })).createWritable()]);
				await tmp[0].body.pipeTo(tmp[1]);
			}
			async function get_problem(i) {
				var tmp = await fetch(location.pathname + 'index.php/contest/show/' + contestid + '/' + String(i));
				const ele = parser.parseFromString(await tmp.text(), 'text/html');
				const title = ele.querySelector('div.row-fluid > div > h2').innerText;
				var res = '## ' + title;
				tmp = ele.querySelectorAll('div.row-fluid > div > div > span > span');
				res += '\\n' + tmp[0].innerText + ', ' + tmp[1].innerText;
				ele.querySelectorAll('div.row-fluid > div > div > span.label').forEach(
					label => res += ', ' + label.innerText );
				tmp = ele.querySelectorAll('div.row-fluid > div > h4 > span');
				if (tmp.length) res += '\\n\\nInput : \`' + tmp[0].innerText
					+ '\`\\n\\nOutput : \`' + tmp[1].innerText + '\`';
				const href = ele.querySelector('#link_limits').href;
				const problemDirHandle = await dirHandle.getDirectoryHandle(String(i), { create: true });
				download(location.pathname + 'index.php/' + href.split('#')[1] + '?simple', 'detailed_limits.html', problemDirHandle);
				tmp = await fetch(location.pathname + 'index.php/main/showdownload/' + href.split('limits/')[1]);
				if (tmp.ok) {
					const e = parser.parseFromString(await tmp.text(), 'text/html');
					const a = e.querySelectorAll('a');
					for (var i = 0; i < a.length; ++i)
						download(a[i].href, '(' + String(i) + ')' + a[i].innerText, problemDirHandle);
				}
				tmp = ele.querySelectorAll('#mainbar > script');
				const md = eval(tmp[tmp.length - 1].innerText + 'rawMarkdown;');
				for (var part in md) if (md[part] != '') {
					var x = md[part].split(/!\\[.*\\]\\(/g);
					for (var j = 1; j < x.length; ++j) {
						var y = x[j].split(')');
						download(y[0],String(imgcnt) + '.png',dirHandle);
						y[0] = String(imgcnt) + '.png';
						++imgcnt;
						x[j] = y.join(')');
					}
					res += '\\n### ' + String(part) + '\\n' + x.join('![](');
				}
				tmp = ele.querySelectorAll('div.div_samplecase_plaintext > div');
				if (tmp.length) {
					res += '\\n### Samples';
					tmp.forEach(sample => res += '\\n#### ' + sample.children[0].children[0].innerText
						+ '\\n\`\`\`\\n' + sample.children[1].innerText + '\\n\`\`\`');
				}
				return res;
			}
			async function main() {
				try {
					dirHandle = await showDirectoryPicker();
					var tmp = await fetch(location.pathname + 'index.php/contest/problems/' + contestid);
					var ele = parser.parseFromString(await tmp.text(), 'text/html');
					var num = ele.querySelectorAll('tbody > tr').length;
					var promises = []
					for (var i = 0; i < num; ++i) promises.push(get_problem(i));
					const problems = await Promise.all(promises);
					const docHandle = await dirHandle.getFileHandle('statements.md', { create: true });
					const writable = await docHandle.createWritable();
					writable.write('# ' + $('h2')[0].innerText +  '\\n' + problems.join('\\n'));
					writable.close();
				}
				catch (error) {
				}
			}
			main();">Save Contest</button>`;
}

function main() {
    make_timer();
    sidebar();
    contest_home_page();
    return_button();
    $("#div_tags").remove();
    contest_saver();
    change_word();
}

var observer = new MutationObserver(() => {
			try {
				let Origin_set_page_content = set_page_content;
				set_page_content = (selector, url, success) => {
					Origin_set_page_content(selector, url, success)
					const jqDom = $(selector).find("#vue-app")
					jqDom.length && jqDom[0].__vue__.$destroy()
					$.ajax({
						type: "GET",
						url: url,
						success: (data) => {
							if (selector == "#page_content") {
								main();
							}
						},
						error: (xhr, statusText, error) => {
							main();
						}
					});
				}
				observer.disconnect();
			}
			catch(e) { }
		});
		observer.observe((document.head), { subtree: true, childList: true });

var style = document.createElement("style");
style.innerHTML=`
legend {
	border-bottom:initial;
}
a:hover, a:focus {
	text-decoration: none;
}
#navigation {
	border-right: initial;
	margin: 0;
}
#contest_table th, #contest_table td {
	text-align: center;
	vertical-align: center;
}
#header>div>div>a:hover strong {
	color: #a10 !important;
}
.well {
	margin:0;
	border: initial;
	border-radius: initial;
	box-shadow: initial
}
.container-fluid {
	padding: initial;
}
.nav-tabs {
	border-bottom: initial;
}
.nav-tabs>li {
	float: none;
}
.nav-tabs>li>a {
	border: initial;
	border-radius: initial;
}
.nav_bar.active>a:hover, .nav-tabs>.active>a:focus {
	cursor: default;
	border: initial;
}
.nav_bar.active>a:hover {
	color: #08c;
	background-color: #eeeeee;
}
.nav_bar.active>a {
	border: initial;
	border-radius: initial;
}
.navbar-inner {
	background-image: initial;
	border: initial;
	border-radius: initial;
	background-color: initial;
}
.table-bordered {
	border: initial;
}
.table-bordered th, .table-bordered td {
	border-left: initial;
}
.table-condensed th, .table-condensed td {
	padding: 5px;
}
.table th, .table td {
	border-top: initial;
}
.pagination ul>li>a, .pagination ul>li>span {
	border: initial;
}
.btn {
	text-shadow: initial;
	background-image: initial;
	background-repeat: initial;
	border: initial;
	filter: initial;
	box-shadow: initial;
}
.btn-primary, .btn-primary:visited {
	background-color: #04d;
	color: #fff;
	margin-top: 6px;
}
.btn-primary:hover, btn-primary:focus {
	background-color: #03c;
}
.input-prepend .add-on, .input-prepend .input-mini, .input-prepend .input-xlarge {
	border: initial;
}
::-webkit-scrollbar {
   width: 6px;
   height: 10px;
}
::-webkit-scrollbar-track {
   background-color: #eeeeee;
}
::-webkit-scrollbar-thumb {
   background-color: #d6d6d6;
}
::-webkit-scrollbar-thumb:hover {
   background-color: #444444;
}`
document.head.appendChild(style);

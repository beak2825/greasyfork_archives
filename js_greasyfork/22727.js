// ==UserScript==
// @name			Markdown and BB-codes for discuss.moe
// @name:ru			Разметка и BB-коды для discuss.moe
// @namespace		https://discuss.moe/users/xcang
// @version			2016.09.12.03.12
// @description		Enable ability mark text in VK.
// @description:ru	Включает возможность размечать и оформлять текст в контакте.
// @author			XCanG
// @match			*.discuss.moe/*
// @grant			none
// @icon			https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/208px-Markdown-mark.svg.png
// @downloadURL https://update.greasyfork.org/scripts/22727/Markdown%20and%20BB-codes%20for%20discussmoe.user.js
// @updateURL https://update.greasyfork.org/scripts/22727/Markdown%20and%20BB-codes%20for%20discussmoe.meta.js
// ==/UserScript==

function repl(str) {
	// As Onebox have bugs with invalid code, here is a fix:
	if (/\[hr\]/i.test(str) || /(<br\s*\/?>|[\r\n]+)(((?:\*(?:(?!<br\s*\/?>)(?!\s*\[[ x]\])[^\r\n\|])+)(?:<br\s*\/?>)?){2,})<br\s*\/?>/i.test(str) || /\[list\].*?\[\*\]((?:(?!\[list\])(?!\[\/list])[^])+)\[\/list\]/i.test(str) || /~~([^\r\n~]+)~~/i.test(str) || /\[o\](.+?)\[\/o\]/i.test(str) || /\[sub\](.+?)\[\/sub\]/i.test(str) || /\[sup\](.+?)\[\/sup\]/i.test(str) || /{(?:#([\w\-]+)|<[\w\s="'\\//;:?&%]+>#([\w\-]+)<\/\w+>)}/i.test(str) || /\[c(?:enter)?\]([^]+?)\[\/c(?:enter)?\]/i.test(str) || /\[r(?:ight)?\](.+?)\[\/r(?:ight)?\]/i.test(str) || /\[j(?:ustify)?\](.+?)\[\/j(?:ustify)?\]/i.test(str) || /\%\%(.+?)\%\%/i.test(str) || /%((?:(?!(?:\/.*)?[0-9A-F]{2})[^\r\n])+?)%(?![0-9A-F]{2})/.test(str) || /(<a[\w\s]+href=")#([\w\-]+)"([\w\s="':;,\.\\\/#]*>(?:(?!<\/a>)[^])+<\/a>)/i.test(str) || /(<(p|br)\s*\/?>)\s*((?:- \[(?:x| )\](?:(?!<\/?p>[^-])(?!<br\s*\/?>[^-])[^])+)+)(<\/?\2\s*\/?>|)/i.test(str) || /(<(p|br)\s*\/?>)([\w\s.,;:\-_+=!@~`%^&()\\|]+)<br\s*\/?>[\-—\s|]+<br\s*\/?>((?:(?:<br\s*\/?>)?[\w\s.,;:\-_+=!@~`%^&()\\]+(?:\|[\w\s.,;:\-_+=!@~`%^&()\\]+)+)+)(<\/?\2\s*\/?>|)/i.test(str) || /\[y(?:ou)?t(?:ube)?\](?:([\w.:\/?=&\/]+)|<a[\w\s.,:;\/?=&%"'>]+https?:\/\/(?:www.)?youtu\.?be(?:.com)?\/(?:watch[\w?&=]*[?&]v=)?(\w+)(?:&\w*)?)\[\/y(?:ou)?t(?:ube)?(?:<\/a>)?\](?:<\/a>)?/i.test(str) || /\[font="?([\w\s]+)"?\]([^]+?)\[\/font\]/i.test(str) || /\[(?:glow|shadow)="?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)"?\]([^]+?)\[\/(?:glow|shadow)\]/i.test(str) || /\[(raw|html)\]((?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])+)\[\/\1\]/i.test(str) || /(?:\\r)?\\n/.test(str)) {
		//console.time("Regex work");
		str = str.replace(/\[hr\]/ig, '<hr />'); // [hr] line break
		str = str.replace(/(<br\s*\/?>|[\r\n]+)(((?:\*(?:(?!<br\s*\/?>)(?!\s*\[[ x]\])[^\r\n\|])+)(?:<br\s*\/?>)?){2,})<br\s*\/?>/ig, '$1<ul class="list"><li>$2</li></ul>');
		while (/(<li>|<br\s*\/?>\*\s?)(?:\*\s?)?((?:(?!<\/li>)(?!<li>)(?!<\/ul>)(?!\s*\[[ x]\])[^\r\n|])+?)<br\s*\/?>(?!<\/li>)\*\s?((?!\s*\[[ x]\]).)/im.test(str)) str = str.replace(/(<li>|<br\s*\/?>\*\s?)(?:\*\s?)?((?:(?!<\/li>)(?!<li>)(?!<\/ul>)(?!\s*\[[ x]\])[^\r\n|])+?)<br\s*\/?>(?!<\/li>)\*\s?((?!\s*\[[ x]\]).)/ig, '$1$2</li><li>$3');
		str = str.replace(/\[list\].*?\[\*\]((?:(?!\[list\])(?!\[\/list])[^])+)\[\/list\]/ig, '<ul class="list"><li>$1</li></ul>').replace(/(?:<br\s*\/?>\s*)?\[\*\]\s*/ig, '</li><li>').replace(/<br\s*\/?><\/li>/ig, '</li>').replace(/(<br\s*\/?>)((?:(?:\d+\.(?:(?!<br\s*\/?>)[^\r\n])*)(?:<br\s*\/?>)?)+)(<br\s*\/?>)/ig, '$1<ol class="list"><li>$2</li></ol>$3').replace(/li>\s?\d+\.\s*/ig, 'li>').replace(/\[list\].*?\[\d+\]((?:(?!\[list\]|\[\/list])[^])*)\[\/list\]/ig, '<ol class="list"><li>$1</li></ol>').replace(/(?:<br\s*\/?>\s*)?\[\d+\]\s*/ig, '</li><li>'); // * items or - items or 1. item1 2. item2
		while (/(<li>(?:(?!<li>)(?!<\/ul>)(?!<\/ol>)[^\r\n\[\]])+?)<br/im.test(str)) str = str.replace(/(<li>(?:(?!<li>)(?!<\/ul>)(?!<\/ol>)[^\r\n\[\]])+?)<br/ig, '$1</li><li').replace(/li>\s?\d+\.\s*/ig, 'li>').replace(/<li><\/li>/ig, '');
		//str = str.replace(/\*\*([^\r\n\[\]]+?)\*\*/ig, '<strong class="bold">$1</strong>').replace(/\[b\](.+?)\[\/b\]/ig, '<strong class="bold">$1</strong>'); // **bold** or [b]bold[/b]
		str = str.replace(/~~([^\r\n~]+)~~/ig, '<span class="strikeout">$1</span>'); // ~~strike~~
		//str = str.replace(/__([^\r\n_]+?)__/ig, '<span class="underline">$1</span>').replace(/\[u\](.+?)\[\/u\]/ig, '<span class="underline">$1</span>'); // __underline__
		str = str.replace(/\[o\](.+?)\[\/o\]/ig, '<span class="overline">$1</span>'); // [o]overline[/o]
		str = str.replace(/\[sub\](.+?)\[\/sub\]/ig, '<span class="sub">$1</span>'); // [sub]subtitle[/sub]
		str = str.replace(/\[sup\](.+?)\[\/sup\]/ig, '<span class="sup">$1</span>'); // [sup]superscript[/sup]
		str = str.replace(/{(?:#([\w\-]+)|<[\w\s="'\\//;:?&%]+>#([\w\-]+)<\/\w+>)}/ig, '<span class="anchor" id="$1$2"></span>'); // {#anchor}
		str = str.replace(/\[c(?:enter)?\]([^]+?)\[\/c(?:enter)?\]/ig, '<span class="centering">$1</span>'); // [c]center[/c]
		str = str.replace(/\[r(?:ight)?\](.+?)\[\/r(?:ight)?\]/ig, '<span class="right">$1</span>'); // [r]right[/r]
		str = str.replace(/\[j(?:ustify)?\](.+?)\[\/j(?:ustify)?\]/ig, '<span class="justify">$1</span>'); // [j]justify[/j]
		str = str.replace(/\%\%(.+?)\%\%/ig, '<span class="spoiler" style="color: transparent;" onclick="this.className = ~className.indexOf(\'spoiler\') ? className.replace(\'spoiler\', \'unspoil\') : className.replace(\'unspoil\', \'spoiler\');">$1</span>').replace(/<span class="spoiled" style="background-color: transparent; color: transparent; text-shadow: 0px 0px 10px gray; -moz-user-select: none;">/ig, '<span class="spoiler" style="color: transparent;" onclick="this.className = ~className.indexOf(\'spoiler\') ? className.replace(\'spoiler\', \'unspoil\') : className.replace(\'unspoil\', \'spoiler\');">'); // %%spoiler%%
		str = str.replace(/%((?:(?!(?:\/.*)?[0-9A-F]{2})[^\r\n])+?)%(?![0-9A-F]{2})/g, '<span class="marked">$1</span>'); // %mark%
		//str = str.replace(/([^!])\[([\w\s\\/#?!^*()]+?)\]\((?:<a[\w\s]+(?:title|href)=(?:"|')(?:\/feed\?[\w&=;]+q=)?((?:(?!<\/a>)[^"'\[\]<>])+)(?:"|')(?:(?!<\/a>)[^\[\]])+<\/a>|((?:\/|\.|#|\w)[^()]*))\)/ig, '$1<a class="link" title="$2" href="$3$4" target="_blank">$2</a>').replace(/href="%23([\w\-]+)?"(?: target="_blank")?/ig, 'href="javascript:;" onclick="document.getElementById(\'$1\').scrollIntoView(); window.history.pushState(\'undefined\', \'Title\', \'#$1\');"'); // [Description](url) //.replace(/href="%23([\w\-]*)"(?: target="_blank")?/ig, 'href="#$1" target="_self" onclick="location.hash = \'#$1\'"');
		str = str.replace(/(<a[\w\s]+href=")#([\w\-]+)"([\w\s="':;,\.\\\/#]*>(?:(?!<\/a>)[^])+<\/a>)/ig, '<span class="anchorlink" onclick="document.getElementById(\'$2\').scrollIntoView(); window.history.pushState(\'undefined\', \'Title\', \'#$2\'); return false;">#$2</span>'); //'$1#$2" target="_self" onclick="return toanchor(\'$2\');"$3');
		str = str.replace(/(<(p|br)\s*\/?>)\s*((?:- \[(?:x| )\](?:(?!<\/?p>[^-])(?!<br\s*\/?>[^-])[^])+)+)(<\/?\2\s*\/?>|)/ig, '$1<div class="tasks"><br>$3</label></div>$4').replace(/<br\s*\/?>\s*(?:- \[(x| )\])/ig, '</label><label><input type="checkbox" name="tasks" disabled$1/>').replace(/(<input[\w ="']+)x\/>/ig, '$1 checked />').replace(/<div class="tasks"><\/label>/ig, '<div class="tasks">').replace(/<br\s*\/?>(<div class="tasks">(?:(?!<\/div>)[^])+<\/div>)(?:<br\s*\/?>)?/ig, '$1'); // - [x] Task compleated or - [ ] Task incompleated list
		str = str.replace(/(<(p|br)\s*\/?>)([\w\s.,;:\-_+=!@~`%^&()\\|]+)<br\s*\/?>[\-—\s|]+<br\s*\/?>((?:(?:<br\s*\/?>)?[\w\s.,;:\-_+=!@~`%^&()\\]+(?:\|[\w\s.,;:\-_+=!@~`%^&()\\]+)+)+)(<\/?\2\s*\/?>|)/ig, '$1<table class="mdtable"><thead><tr><th>$3</thead><tbody><tr><td>$4</tbody></table>$5').replace(/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/ig, '$1<th>$2').replace(/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<td>$2').replace(/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<tr><td>$2'); //table: Write headers, separate by |, when after header write some ---, | as separator and --- again for fill, when other new lines separated by | will be choosed as cells. Ex.: Github table
		while (/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/im.test(str)) str = str.replace(/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/ig, '$1<th>$2');
		while (/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/im.test(str)) str = str.replace(/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<td>$2');
		while (/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/im.test(str)) str = str.replace(/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<tr><td>$2');
		// <iframe width="640" height="360" src="https://www.youtube.com/embed/00000000000?rel=0" frameborder="0" allowfullscreen></iframe>
		str = str.replace(/\[y(?:ou)?t(?:ube)?\](?:([\w.:\/?=&\/]+)|<a[\w\s.,:;\/?=&%"'>]+https?:\/\/(?:www.)?youtu\.?be(?:.com)?\/(?:watch[\w?&=]*[?&]v=)?(\w+)(?:&\w*)?)\[\/y(?:ou)?t(?:ube)?(?:<\/a>)?\](?:<\/a>)?/ig, '<iframe class="ytv" width="690" height="388" src="https://www.youtube.com/embed/$1$2?rel=0" frameborder="0" allowfullscreen></iframe>'); //.replace(/\\\\\\(?:https?)?:?\/{0,2}[\w\.\/?=]*([\w]{11})[\w\&=]*\/\/\//ig, '$1'); // [yt]video link[/yt]
		str = str.replace(/\[font="?([\w\s]+)"?\]([^]+?)\[\/font\]/ig, '<span class="customfont" style=\'font-family: "$1";\'>$2</span>'); // [font=Arial]text[/font], also may be [font="Lucide Consoles"]text[/font]
		str = str.replace(/\[(?:glow|shadow)="?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)"?\]([^]+?)\[\/(?:glow|shadow)\]/ig, '<span class="shadow" style=\'text-shadow: $1px $2px $3px $4;\'>$5</span>'); // [glow=0,0,8,red]text[/glow] or [shadow=1,1,2,white]text[/shadow]
		while (/\[(raw|html)\](?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*&lt;(?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*\[\/\1\]/ig.test(str)) str = str.replace(/(\[(raw|html)\](?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*)&lt;((?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*\[\/\2\])/ig, '$1<$3').replace(/(\[(raw|html)\](?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*)&gt;((?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])*\[\/\2\])/ig, '$1>$3');
		str = str.replace(/\[(raw|html)\]((?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])+)\[\/\1\]/ig, '$2');
		str = str.replace(/(?:\\r)?\\n/g, '<br />'); // \n or \r\n replace to newline char
		str = str.replace(/(<span class="centering"(?:(?!<span class="centering")[^])+<table class="mdtable")((?:(?!<\/table>)[^])+<\/table>(?:(?!<span class="centering")[^])*?<\/span>)/ig, '$1 style="display: table; margin: 0 auto;"$2');
		str = str.replace(/<span( class="spoiler"(?:(?!<\/span>)(?!<\/p>)[^])+?<(?:div|table|p)[^]*?)<\/span>/ig, '<div style="display: inline-block;"$1</div>');
		//console.timeEnd("Regex work");
		return str;
	} else {
		return false;
	}
}

function apply_md() {
	let skip = false;
	for (let i = 0; i < md_el.length; i++) {
		skip = false;
		for (let j = 0; j < used.length; j++) {
			if (md_el[i] == used[j]) {
				skip = true;
			}
		}
		if (!skip) {
			let fix = repl(md_el[i].innerHTML); // Onebox fix
			if (fix) md_el[i].innerHTML = fix;
			used = used.concat(md_el[i]);
		}
	}
}

function upd_md_el() {
	//console.time("Update time");
	md_el = Array.prototype.slice.call(document.getElementsByClassName('cooked'), 0).concat(Array.prototype.slice.call(document.getElementsByClassName('expanded-quote'), 0));
	apply_md();
	//console.timeEnd("Update time");
}

var md_el = [], used = [];
var html_doc = document.getElementsByTagName('head').item(0);
var css = document.createElement('style');
css.setAttribute('type', 'text/css');
css.innerHTML = '.strikeout { text-decoration: line-through; } .underline { text-decoration: underline; } .overline { text-decoration: overline; } .sub { vertical-align: sub; font-size: 12px; } .sup { vertical-align: super; font-size: 12px; } .anchor { position: relative; bottom: 63px; display: flex; } .centering { display: block; text-align: center; } .centering table { margin: 0 auto; text-align: left; } .right { display: block; text-align: right; } .justify { display: block; text-align: justify; } .cooked > pre > code, .quote > blockquote { max-height: 310px; text-overflow: ellipsis; white-space: pre-wrap; word-wrap: break-word; overflow-x: hidden; overflow-y: auto; } .spoiler { background-color: #fff; color: transparent; filter: blur(12px); -webkit-filter: blur(12px); margin-left: 8px; margin-right: 8px; } .spoiler:focus, .spoiler:active, .unspoil { background-color: transparent; color: #ffffff !important; filter: blur(0px); -webkit-filter: blur(0px); text-shadow: 1px 1px 1px gray; margin-left: 8px; margin-right: 8px; } .marked { background: #564146; padding: 1px; } .marked:hover { font-weight: bold; } .tasks { display: block; } .tasks > label { display: block; } .tasks > label > input { vertical-align: middle; cursor: alias; } .mdtable { box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8; margin: 2px; border-collapse: collapse; } .mdtable > thead > tr > th, .mdtable > tbody > tr > td { border: 1px solid #d7d8db; padding: 2px; word-break: break-all; word-wrap: break-word; } .mdtable > thead > tr > th { background-color: #12110F; text-align: center; } .mdtable > tbody > tr > td { text-align: justify; } .anchorlink { text-decoration: none; color: #1E9AE0; cursor: pointer; } .anchorlink:hover { text-decoration: underline; }';
html_doc.appendChild(css);
setInterval(upd_md_el, 1000);

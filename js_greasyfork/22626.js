// ==UserScript==
// @name			Markdown and BB-codes for vk.com
// @name:ru			Разметка и BB-коды для vk.com
// @namespace		vk.com/xcang
// @version			2016.08.29.19.24
// @description		Enable ability mark text in VK.
// @description:ru	Включает возможность размечать и оформлять текст в контакте.
// @author			XCanG
// @match			vk.com/*
// @grant			none
// @icon			https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Markdown-mark.svg/208px-Markdown-mark.svg.png
// @downloadURL https://update.greasyfork.org/scripts/22626/Markdown%20and%20BB-codes%20for%20vkcom.user.js
// @updateURL https://update.greasyfork.org/scripts/22626/Markdown%20and%20BB-codes%20for%20vkcom.meta.js
// ==/UserScript==

function repl(str) {
	//console.time("Regex work");
	str = str.replace(/>\s?(?:(?:-\s?){3,}|(?:\*\s?){3,}|(?:_\s?){3,})</ig, '><hr /><').replace(/\[hr\]/ig, '<hr />'); // *** --- ___ or more convert to line break (hr)
	str = str.replace(/(<br\s*\/?>|[\r\n]+)(((?:[\*\-+](?:(?!<br\s*\/?>)(?!\s*\[[ x]\])[^\r\n\|])+)(?:<br\s*\/?>)?){2,})<br\s*\/?>/ig, '$1<ul class="list"><li>$2</li></ul>');
	while (/(<li>|<br\s*\/?>[\*\-+]\s?)(?:[\*\-+]\s?)?((?:(?!<\/li>)(?!<li>)(?!<\/ul>)(?!\s*\[[ x]\])[^\r\n|])+?)<br\s*\/?>(?!<\/li>)[\*\-+]\s?((?!\s*\[[ x]\]).)/im.test(str)) str = str.replace(/(<li>|<br\s*\/?>[\*\-+]\s?)(?:[\*\-+]\s?)?((?:(?!<\/li>)(?!<li>)(?!<\/ul>)(?!\s*\[[ x]\])[^\r\n|])+?)<br\s*\/?>(?!<\/li>)[\*\-+]\s?((?!\s*\[[ x]\]).)/ig, '$1$2</li><li>$3');
	str = str.replace(/\[list\].*?\[[\*\-+]\]((?:(?!\[list\])(?!\[\/list])[^])+)\[\/list\]/ig, '<ul class="list"><li>$1</li></ul>').replace(/(?:<br\s*\/?>\s*)?\[[\*\-+]\]\s*/ig, '</li><li>').replace(/<br\s*\/?><\/li>/ig, '</li>').replace(/(<br\s*\/?>)((?:(?:\d+\.(?:(?!<br\s*\/?>)[^\r\n])*)(?:<br\s*\/?>)?)+)(<br\s*\/?>)/ig, '$1<ol class="list"><li>$2</li></ol>$3').replace(/li>\s?\d+\.\s*/ig, 'li>').replace(/\[list\].*?\[\d+\]((?:(?!\[list\]|\[\/list])[^])*)\[\/list\]/ig, '<ol class="list"><li>$1</li></ol>').replace(/(?:<br\s*\/?>\s*)?\[\d+\]\s*/ig, '</li><li>'); // * items or - items or 1. item1 2. item2
	while (/(<li>(?:(?!<li>)(?!<\/ul>)(?!<\/ol>)[^\r\n\[\]])+?)<br/im.test(str)) str = str.replace(/(<li>(?:(?!<li>)(?!<\/ul>)(?!<\/ol>)[^\r\n\[\]])+?)<br/ig, '$1</li><li').replace(/li>\s?\d+\.\s*/ig, 'li>').replace(/<li><\/li>/ig, '');
	str = str.replace(/\*\*([^\r\n\[\]]+?)\*\*/ig, '<strong class="bold">$1</strong>').replace(/\[b\](.+?)\[\/b\]/ig, '<strong class="bold">$1</strong>'); // **bold** or [b]bold[/b]
	str = str.replace(/~~([^\r\n~]+)~~/ig, '<span class="strikeout">$1</span>').replace(/\[s\](.+?)\[\/s\]/ig, '<span class="strikeout">$1</span>'); // ~~strike~~ or [s]strike[/s]
	str = str.replace(/__([^\r\n_]+?)__/ig, '<span class="underline">$1</span>').replace(/\[u\](.+?)\[\/u\]/ig, '<span class="underline">$1</span>'); // __underline__ or [u]underline[/u]
	str = str.replace(/(\*|_)((?:(?!<br\s*\/?>)(?![\w_]+=["'])[^\r\n*\[\]])+)\1/ig, '<em class="italic">$2</em>').replace(/\[i\](.+?)\[\/i\]/ig, '<span class="italic">$1</span>'); // *italic* or _italic_ or [i]italic[/i]
	str = str.replace(/\[o\](.+?)\[\/o\]/ig, '<span class="overline">$1</span>'); // [o]overline[/o]
	str = str.replace(/\[sub\](.+?)\[\/sub\]/ig, '<span class="sub">$1</span>'); // [sub]subtitle[/sub]
	str = str.replace(/\[sup\](.+?)\[\/sup\]/ig, '<span class="sup">$1</span>'); // [sup]superscript[/sup]
	str = str.replace(/{(?:#([\w\-]+)|<[\w\s="'\\//;:?&%]+>#([\w\-]+)<\/\w+>)}/ig, '<span class="anchor" id="$1$2"></span>'); // {#anchor}
	str = str.replace(/\[c(?:enter)?\](.+?)\[\/c(?:enter)?\]/ig, '<span class="centering">$1</span>'); // [c]center[/c]
	str = str.replace(/\[r(?:ight)?\](.+?)\[\/r(?:ight)?\]/ig, '<span class="right">$1</span>'); // [r]right[/r]
	str = str.replace(/\[j(?:ustify)?\](.+?)\[\/j(?:ustify)?\]/ig, '<span class="justify">$1</span>'); // [j]justify[/j]
	str = str.replace(/\%\%(.+?)\%\%/ig, '<span class="spoiler"><span>$1</span></span>').replace(/\[spoiler\](.+?)\[\/spoiler\]/ig, '<span class="spoiler"><span>$1</span></span>'); // %%spoiler%% or [spoiler]text[/spoiler]
	str = str.replace(/(<br\s*\/?>)((?:&gt;\s*(?:(?!<br\s*\/?>)[^])+(?:<br\s*\/?>)?)+)(<br\s*\/?>)/ig, '$1<span class="quote">$2</span>$3').replace(/(<span[\s\w="']+>|<br\s*\/?>)\s*&gt;\s*/ig, '$1').replace(/\[quote\]((?:(?!\[quote\])(?!\[\/quote\]).)+)\[\/quote\]/ig, '<span class="quote">$1</span>'); // > quote (multiline too) or [quote=name]quote here[/quote]
	while (/(<br\s*\/?>)((?:&gt;\s*(?:(?!<br\s*\/?>)[^])+(?:<br\s*\/?>)?)+)(<br\s*\/?>)/im.test(str)) str = str.replace(/(<br\s*\/?>)((?:&gt;\s*(?:(?!<br\s*\/?>)[^])+(?:<br\s*\/?>)?)+)(<br\s*\/?>)/ig, '$1<span class="quote">$2</span>$3').replace(/(<span[\s\w="']+>|<br\s*\/?>)\s*&gt;\s*/ig, '$1');
	while (/\[quote\]((?:(?!\[quote\])(?!\[\/quote\]).)+)\[\/quote\]/im.test(str)) str = str.replace(/\[quote\]((?:(?!\[quote\])(?!\[\/quote\]).)+)\[\/quote\]/ig, '<span class="quote">$1</span>');
	str = str.replace(/\`\`\`(.*?)\`\`\`/ig, '<pre class="multiline-code"><code>$1</code></pre>').replace(/\[code\](.+?)\[\/code\]/ig, '<pre class="multiline-code"><code>$1</code></pre>').replace(/(<(?:span class="quote"|code)>)<br\s*\/?>/ig, '$1'); // ```code``` or [code]code here[/code]
	str = str.replace(/\`(.*?)\`/ig, '<span class="code"><code>$1</code></span>'); // `code`
	str = str.replace(/%((?:(?!(?:\/.*)?[0-9A-F]{2})[^\r\n])+?)%(?![0-9A-F]{2})/g, '<span class="marked">$1</span>'); // %mark%
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h1 class="mdh1">$2</h1>$3').replace(/\[h1\](.+?)\[\/h1\]/ig, '<h1 class="mdh1">$1</h1>'); // # header 1 or [h1]header 1[/h1]
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#{2}([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h2 class="mdh2">$2</h2>$3').replace(/\[h2\](.+?)\[\/h2\]/ig, '<h2 class="mdh2">$1</h2>'); // ## header 2 or [h2]header 2[/h2]
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#{3}([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h3 class="mdh3">$2</h3>$3').replace(/\[h3\](.+?)\[\/h3\]/ig, '<h3 class="mdh3">$1</h3>'); // ### header 3 or [h3]header 3[/h3]
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#{4}([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h4 class="mdh4">$2</h4>$3').replace(/\[h4\](.+?)\[\/h4\]/ig, '<h4 class="mdh4">$1</h4>'); // #### header 4 or [h4]header 4[/h4]
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#{5}([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h5 class="mdh5">$2</h5>$3').replace(/\[h5\](.+?)\[\/h5\]/ig, '<h5 class="mdh5">$1</h5>'); // ##### header 5 or [h5]header 5[/h5]
	str = str.replace(/(<br\s*\/?>\s*|<div[\w\s="'_]+>)#{6}([^\r\n#]+?)(?:<br\s*\/?>|(<\/div>))/ig, '$1<h6 class="mdh6">$2</h6>$3').replace(/\[h6\](.+?)\[\/h6\]/ig, '<h6 class="mdh6">$1</h6>'); // ###### header 6 or [h6]header 6[/h6]
	str = str.replace(/!\[([\w\s]+?)\]\((?:<a.+?title=(?:"|')(.+?)(?:"|').+?|<a.+>(.+?)[^\.]<.+?)\)/ig, '<span style="text-align: center; color: blue; font-weight: bold; font-style: italic; display: block;">$1</span><br /><img class="embed" src="$2$3" alt="$1" />'); // ![Description](url_to_image.png)
	str = str.replace(/([^!])\[([\w\s\\/#?!^*()]+?)\]\((?:<a[\w\s]+(?:title|href)=(?:"|')(?:\/feed\?[\w&=;]+q=)?((?:(?!<\/a>)[^"'\[\]<>])+)(?:"|')(?:(?!<\/a>)[^\[\]])+<\/a>|((?:\/|\.|#|\w)[^()]*))\)/ig, '$1<a class="link" title="$2" href="$3$4" target="_blank">$2</a>').replace(/href="%23([\w\-]+)?"(?: target="_blank")?/ig, 'href="javascript:;" onclick="document.getElementById(\'$1\').scrollIntoView(); window.history.pushState(\'undefined\', \'Title\', \'#$1\');"'); // [Description](url) //.replace(/href="%23([\w\-]*)"(?: target="_blank")?/ig, 'href="#$1" target="_self" onclick="location.hash = \'#$1\'"');
	str = str.replace(/<br\s*\/?>\s*((?:- \[(?:x| )\](?:(?!<br\s*\/?>[^-])[^])+)+)<br\s*\/?>/ig, '<div class="tasks"><br>$1</label></div>').replace(/<br\s*\/?>\s*(?:- \[(x| )\])/ig, '</label><label><input type="checkbox" name="tasks" disabled$1/>').replace(/(<input[\w ="']+)x\/>/ig, '$1 checked />').replace(/<div class="tasks"><\/label>/ig, '<div class="tasks">'); // - [x] Task compleated or - [ ] Task incompleated list
	str = str.replace(/<br\s*\/?>([\w\s.,;:\-_+=!@~`%^&()\\|]+)<br\s*\/?>[\-—\s|]+<br\s*\/?>((?:(?:<br\s*\/?>)?[\w\s.,;:\-_+=!@~`%^&()\\]+(?:\|[\w\s.,;:\-_+=!@~`%^&()\\]+)+)+)<br\s*\/?>/ig, '<table class="mdtable"><thead><tr><th>$1</thead><tbody><tr><td>$2</tbody></table>').replace(/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/ig, '$1<th>$2').replace(/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<td>$2').replace(/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<tr><td>$2'); //table: Write headers, separate by |, when after header write some ---, | as separator and --- again for fill, when other new lines separated by | will be choosed as cells. Ex.: Github table
	while (/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/im.test(str)) str = str.replace(/(<thead><tr>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/thead>)/ig, '$1<th>$2');
	while (/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/im.test(str)) str = str.replace(/(<tbody><tr><td>[^|]+?)(?:\s*\|\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<td>$2');
	while (/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/im.test(str)) str = str.replace(/(<tbody>(?:(?!<\/table>)[^])+?)(?:\s*<br\s*\/?>\s*)((?:(?!<\/table>)[^])+?<\/tbody>)/ig, '$1<tr><td>$2');
	// <iframe width="640" height="360" src="https://www.youtube.com/embed/00000000000?rel=0" frameborder="0" allowfullscreen></iframe>
	str = str.replace(/\[y(?:ou)?t(?:ube)?\](?:([\w.:\/?=&\/]+)|<a[\w\s.,:;\/?=&%"'>]+https?:\/\/(?:www.)?youtu\.?be(?:.com)?\/(?:watch[\w?&=]*[?&]v=)?(\w+)(?:&\w*)?)\[\/y(?:ou)?t(?:ube)?(?:<\/a>)?\](?:<\/a>)?/ig, '<iframe class="ytv" width="500" height="280" src="https://www.youtube.com/embed/$1$2?rel=0" frameborder="0" allowfullscreen></iframe>'); // [yt]video link[/yt]
	str = str.replace(/@(\w+)/ig, '<a href="/$1" class="mem_link" mention="" mention_id="$1" onclick="return mentionClick(this, event)" onmouseover="mentionOver(this)">$1</a>'); //@mention // https://api.vk.com/method/users.get?user_ids=_____&v=5.53  &callback=callbackFunc
	str = str.replace(/\[font="?([\w\s]+)"?\]([^]+?)\[\/font\]/ig, '<span class="customfont" style=\'font-family: "$1";\'>$2</span>'); // [font=Arial]text[/font], also may be [font="Lucide Consoles"]text[/font]
	str = str.replace(/\[color="?([\w\s#()]+)"?\]([^]+?)\[\/color\]/ig, '<span class="customcolor" style=\'color: $1;\'>$2</span>'); // same, but [color]-code
	str = str.replace(/\[size="?([\w]+)"?\]([^]+?)\[\/size\]/ig, '<span class="customsize" style=\'font-size: $1;\'>$2</span>'); // same, but [size]-code
	str = str.replace(/\[(?:glow|shadow)="?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)[, ]?([\w\s]+)"?\]([^]+?)\[\/(?:glow|shadow)\]/ig, '<span class="shadow" style=\'text-shadow: $1px $2px $3px $4;\'>$5</span>'); // [glow=2,30,4,red]text[/glow] or [shadow=12,34,4,red]text[/shadow]
	str = str.replace(/\[(raw|html)\]((?:(?!\[raw\])(?!\[html\])(?!\[\/raw\])(?!\[\/html\])[^])+)\[\/\1\]/ig, '$2');
	str = str.replace(/(?:\\r)?\\n/g, '<br />'); // \n or \r\n replace to newline char
	//console.timeEnd("Regex work");
	return str;
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
			md_el[i].innerHTML = repl(md_el[i].innerHTML);
			used = used.concat(md_el[i]);
		}
	}
}

function upd_md_el() {
	//console.time("Update time");
	md_el = Array.prototype.slice.call(document.getElementsByClassName('wall_post_text'), 0).concat(Array.prototype.slice.call(document.getElementsByClassName('wall_reply_text'), 0)).concat(Array.prototype.slice.call(document.getElementsByClassName('im_msg_text'), 0)).concat(Array.prototype.slice.call(document.getElementsByClassName('fc_msg'), 0)).concat(Array.prototype.slice.call(document.getElementsByClassName('nim-dialog--preview'), 0));
	apply_md();
	//console.timeEnd("Update time");
}

var md_el = [], used = [];
var html_doc = document.getElementsByTagName('head').item(0);
var css = document.createElement('style');
css.setAttribute('type', 'text/css');
css.innerHTML = '/*.bold { font-weight: bold; } .italic { font-style: italic; }*/ .strikeout { text-decoration: line-through; } .underline { text-decoration: underline; } .overline { text-decoration: overline; } .sub { vertical-align: sub; font-size: 12px; } .sup { vertical-align: super; font-size: 12px; } .anchor { position: relative; bottom: 42px; } .centering { display: block; text-align: center; } .centering table { margin: 0 auto; text-align: left; } .right { display: block; text-align: right; }  .justify { display: block; text-align: justify; } .spoiler { background: rgba(0, 0, 0, 1); color: rgba(255, 255, 255, 0); padding: 0 4px; transform: skewX(-10deg); display: inline-block; margin: 1px; left: 4px; position: relative; border: 1px dashed rgba(0, 0, 0, 0); transition: color 0.3s ease, background 1s ease; } .spoiler > span { display: block; transform: skewX(10deg); } .spoiler:hover { border: 1px dashed rgba(0, 0, 0, 1); color: rgba(128, 128, 128, 1); background: rgba(0, 0, 0, 0); } .spoiler input, .spoiler a { opacity: 0; transition: opacity 1s ease; } .spoiler:hover input, .spoiler:hover a { opacity: 1; } .quote { display: block; background-color: #f8f8f8; border: 1px solid #ddd; padding: 6px 10px; margin: 3px 3px; border-radius: 3px; overflow-x: hidden; overflow-y: auto; max-height: 310px; } .code { border: 1px solid #ddd; border-radius: 2px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; padding: 1px 4px; margin: 0 2px; } .multiline-code { width: calc(95% + 5px); overflow-x: hidden; overflow-y: auto; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; border: 0px solid rgba(221, 221, 221, 0); border-radius: 5px; padding: 1px 5px; margin: 2px auto; background: linear-gradient(0deg, rgba(221, 221, 221, 1) 0px, rgba(221, 221, 221, 1) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(90deg, rgba(221, 221, 221, 1) 0px, rgba(221, 221, 221, 1) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(180deg, rgba(221, 221, 221, 1) 0px, rgba(221, 221, 221, 1) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(270deg, rgba(221, 221, 221, 1) 0px, rgba(221, 221, 221, 1) 1px, rgba(0, 0, 0, 0) 1px), linear-gradient(90deg, rgba(255, 255, 255, 0) 0px, rgba(255, 255, 255, 0) 3px, rgba(248, 248, 248, 0.99) 3px, rgba(248, 248, 248, 0.99) 100%), repeating-linear-gradient(135deg, rgba(0, 0, 0, 1) 0px, rgba(0, 0, 0, 1) 3px, rgba(255, 255, 255, 0) 3px, rgba(255, 255, 255, 0) 5px); max-height: 310px; text-overflow: ellipsis; white-space: pre-wrap; word-wrap: break-word; } .multiline-code > code { white-space: pre-wrap; word-wrap: break-word; } .marked { background: #FFFF00; padding: 1px; } .marked:hover { font-weight: bold; } .mdh1 { font-size: 26px; } .mdh2 { font-size: 20px; } .mdh3 { font-size: 15px; } .mdh4 { font-size: 13px; } .mdh5 { font-size: 11px; } .mdh6 { font-size: 8.7px; } .embed { max-height: 400px; max-width: 100%; margin-left: 6px; margin-right: 6px; } .embed:hover { box-shadow: 0 0 6px rgba(0,0,0,0.5); } .tasks { display: block; } .tasks > label { display: block; } .tasks > label > input { vertical-align: middle; } .mdtable { box-shadow: 0 1px 0 0 #d7d8db, 0 0 0 1px #e3e4e8; margin: 2px; border-collapse: collapse; } .mdtable > thead > tr > th, .mdtable > tbody > tr > td { border: 1px solid #d7d8db; padding: 2px; word-break: break-all; word-wrap: break-word; } .mdtable > thead > tr > th { background-color: #edeef0; text-align: center; } .mdtable > tbody > tr > td { text-align: justify; } .wall_reply_text > .ytv { width: 440px; height: 250px; } .fc_msg > .ytv { width: 200px; height: 112px; } .nim-dialog--preview > .ytv { display: none; } .quote > .ytv { width: 100%; } ';
html_doc.appendChild(css);
setInterval(upd_md_el, 1000);

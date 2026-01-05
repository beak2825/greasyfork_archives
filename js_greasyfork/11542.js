// ==UserScript==
// @name         Tieba Coder
// @namespace    http://nota.moe/
// @version      0.2
// @description  在贴吧发表格式美观、语法高亮的代码片段
// @author       NotaStudio
// @match        http://tieba.baidu.com/p/*
// @match        http://tieba.baidu.com/f?kw=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/11542/Tieba%20Coder.user.js
// @updateURL https://update.greasyfork.org/scripts/11542/Tieba%20Coder.meta.js
// ==/UserScript==

/* ChangeLog
 * 20150807 0.1-alpha
 * 初次发布
 * 20150811 0.2
 * 加入语言显示支持，加入 Java 语法高亮支持，加入发布到 Ubuntu Pastebin 支持，修复 !!indexOf 返回 true 的问题，修复出现多个按钮的问题，修复头像显示不正确的问题，修复 innerHTML 相关的性能问题，修复替换 innerHTML 造成的事件监听丢失问题，其它小 bug 修复，CSS 微调，精简代码
 */

console.log(" Tieba Coder 0.2\n Created by Nota\n 2015.08.11\n┏┛┻━━━┛┻┓\n┃｜｜｜｜｜｜｜┃\n┃　　　━　　　┃\n┃　┳┛　┗┳　┃\n┃　　　　　　　┃\n┃　　　┻　　　┃\n┃　　　　　　　┃\n┗━┓　　　┏━┛\n　　┃　　　┃\n　　┃　　　┃\n　　┃　　　┃\n　　┃　　　┃\n　　┃　　　┗━━━┓\n　　┃ Tieba Coder  ┣┓\n　　┃   吉翔物   　┃\n　　┗┓┓┏━┳┓┏┛\n　　　┃┫┫　┃┫┫\n　　　┗┻┛　┗┻┛\n ");

GM_addStyle("code{display:inline}.tc_input_code_button{display:inline;cursor:pointer;color:#990000}.tc_container{border-radius:5px;position:fixed;width:480px;height:320px;z-index:9999998;margin:0 auto;left:0;right:0;top:100px;bottom:0;background:rgba(169,169,169,0.8);text-align:center}.tc_lang_select,.tc_tab_select{margin:5px}.tc_tip{display:inline}.tc_input_box{overflow:auto;display:block;margin:2px;width:474px}.tc_code_div{border-radius:7px;border-color:#666;border-width:1px;background-color:#f5f2f0}.tc_p{display:none}.tc_code_pre{font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace}.tc_submit_button,.tc_cancel_button{margin:3px}.tc_loading{width:45px;height:45px;border-radius:7px;position:fixed;z-index:9999999;margin:0 auto;background:rgba(169,169,169,0.8);background-image:url('data:image/jpg;base64,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');background-size:cover;left:50%;top:50%}");
GM_addStyle("code[class*='language-'],pre[class*='language-']{color:black;text-shadow:0 1px white;font-family:Consolas,Monaco,'Andale Mono','Ubuntu Mono',monospace;direction:ltr;text-align:left;white-space:pre;word-spacing:normal;word-break:normal;line-height:1.5;-moz-tab-size:4;-o-tab-size:4;tab-size:4;-webkit-hyphens:none;-moz-hyphens:none;-ms-hyphens:none;hyphens:none}pre[class*='language-']::-moz-selection,pre[class*='language-']::-moz-selection,code[class*='language-']::-moz-selection,code[class*='language-']::-moz-selection{text-shadow:none;background:#b3d4fc}pre[class*='language-']::selection,pre[class*='language-']::selection,code[class*='language-']::selection,code[class*='language-']::selection{text-shadow:none;background:#b3d4fc}@media print{code[class*='language-'],pre[class*='language-']{text-shadow:none}}pre[class*='language-']{padding:1em;margin:.5em 0;overflow:auto}:not(pre) > code[class*='language-'],pre[class*='language-']{background:#f5f2f0}:not(pre) > code[class*='language-']{padding:.1em;border-radius:.3em}.token.comment,.token.prolog,.token.doctype,.token.cdata{color:slategray}.token.punctuation{color:#999}.namespace{opacity:.7}.token.property,.token.tag,.token.boolean,.token.number,.token.constant,.token.symbol,.token.deleted{color:#905}.token.selector,.token.attr-name,.token.string,.token.char,.token.builtin,.token.inserted{color:#690}.token.operator,.token.entity,.token.url,.language-css .token.string,.style .token.string{color:#a67f59;background:hsla(0,0%,100%,.5)}.token.atrule,.token.attr-value,.token.keyword{color:#07a}.token.function{color:#DD4A68}.token.regex,.token.important,.token.variable{color:#e90}.token.important,.token.bold{font-weight:bold}.token.italic{font-style:italic}.token.entity{cursor:help}pre[class*='language-']{position:relative}pre[class*='language-'][data-language]::before{content:attr(data-language);color:black;background-color:#CFCFCF;display:inline-block;position:absolute;top:0;right:0;font-size:0.9em;border-radius:0 0 0 5px;padding:0 0.5em;text-shadow:none}");// Prism.js stylesheet

window.addNode = function (sTagName,oAttr,sTagContent,oParentNode) {
	var e = document.createElement(sTagName);
	if (sTagContent) {
	var c = document.createTextNode(sTagContent);
	e.appendChild(c);
	}

	if (oAttr) {
	for (var a in oAttr) {
	e.setAttribute(a,oAttr[a]);
	}
	}

	if (oParentNode) {
		oParentNode.appendChild(e);
		return;
	} else {
		return e;
	}
};
// oAttr 可选，接受用对象形式表示的属性-值对，sTagContent 可选，oParentNode 可选，若有，则把新建的元素添加为 oParentNode 的子节点并返回 undefined ；若无，则直接返回新建的元素
// e.g. addNode("div",{"width":"100px","height":"50px","dir":"rtl"},"bbb",document.getElementById("content_wrap"));

// 发帖
GM_addStyle("@keyframes nodeInserted{from{opacity:.99}to{opacity:1}}.edui-btn-toolbar{animation-duration:.01s;animation-name:nodeInserted}");
//为 edui-btn-toolbar 类增加动画，方便通过 animationstart 事件获取相应节点
window.tcPostInit = function() {
	addNode("button",{"class":"tc_input_code_button"},"插入代码",document.getElementsByClassName("edui-btn-toolbar")[0]);
	document.getElementsByClassName("tc_input_code_button")[0].addEventListener("click",inputCode,false);
	document.removeEventListener("animationstart", insertListener, false);
};
var insertListener = function(event){
	if (event.animationName == "nodeInserted") {// This is the debug for knowing our listener worked! event.target is the new node!
		tcPostInit();
	}
};
document.addEventListener("animationstart", insertListener, false);

window.inputCode = function() {
	addNode("div",{"class":"tc_container"},"",document.body);
	document.getElementsByClassName("tc_container")[0].innerHTML = "<p class='tc_tip'>语言</p><select class='tc_lang_select'><option value='markup'>HTML</option><option value='css'>CSS</option><option value='javascript'>JavaScript</option><option value='bash'>Bash</option><option value='php'> 世界上最好的语言~~</option><option value='java'>Java</option><option value='c'>C</option><option value='cpp'>C++</option><option value='python'>Python</option></select><p class='tc_tip'>Tab Width</p><select class='tc_tab_select'><option value='2'>2</option><option value='4' selected='selected'>4</option><option value='8'>8</option></select><textarea class='tc_input_box' placeholder='在这里输入代码' rows='10'></textarea><input type='checkbox' class='tc_post_to_pastebin' /><p class='tc_tip'>同时发表到 Ubuntu Pastebin</p><br><button class='tc_submit_button'>确认</button><button class='tc_cancel_button'>取消</button>";
	document.getElementsByClassName("tc_submit_button")[0].addEventListener("click",submitCode,false);
	document.getElementsByClassName("tc_cancel_button")[0].addEventListener("click",function(){document.body.removeChild(document.getElementsByClassName('tc_container')[0]);},false);
};

window.submitCode = function() {
	document.getElementsByClassName("tc_input_code_button")[0].disabled = "disabled";
	document.getElementsByClassName("tc_input_code_button")[0].title = "一楼只能发一段代码哦~";

	var postLang = document.getElementsByClassName("tc_lang_select")[0].options[document.getElementsByClassName("tc_lang_select")[0].options.selectedIndex].value,
		tabWidth = document.getElementsByClassName("tc_tab_select")[0].options[document.getElementsByClassName("tc_tab_select")[0].options.selectedIndex].value,
		code,
		pastebinUrl;
	for (var space = " "; space.length < tabWidth; space+=space) {}// 空循环，使 space 长度为指定的 Tab 宽度
	code = document.getElementsByClassName("tc_input_box")[0].value.replace(/\t/g,space).replace(/\n/g,"<br>").replace(/\s{2}/g,"\u3000");// 将 Tab 替换为半角空格。使用一个全角空格替换2个半角空格，使得代码可以正常缩进

	if (document.getElementsByClassName("tc_post_to_pastebin")[0].checked) {
		addNode("div",{"class":"tc_loading"},"",document.body);
		var pastebinSyntax = postLang;
		if (pastebinSyntax == "markup") pastebinSyntax = "html";
		if (pastebinSyntax == "javascript") pastebinSyntax = "js";
		GM_xmlhttpRequest({
			method: "POST",
			url: "http://paste.ubuntu.com/",
			data: "poster=Tieba+Coder&syntax=" + pastebinSyntax + "&content=" + (encodeURIComponent(document.getElementsByClassName("tc_input_box")[0].value)),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(response) {
    			pastebinUrl = response.finalUrl;
    			document.body.removeChild(document.getElementsByClassName("tc_loading")[0]);
                document.getElementById("ueditor_replace").innerHTML += ( pastebinUrl + "<br>" );
			}
		});
	}
	// 发布到 Ubuntu Pastebin

	document.body.removeChild(document.getElementsByClassName("tc_container")[0]);

	document.getElementById("ueditor_replace").innerHTML += ( "<div class='tc_code_div' contenteditable='false'><p class='tc_p'>// ==Tieba Coder lang:" + postLang + "==</p><br><pre class='tc_code_pre'>" + code + "</pre><p class='tc_p'>// 这段代码使用 Tieba Coder 进行格式化和语法高亮，您可以在 https://greasyfork.org/zh-CN/scripts/11542-tieba-coder 下载 Tieba Coder 使用</p><p class='tc_p'>// 注意：这段代码中的空格可能是全角空格</p></div><br><br>" );
};

window.keyDown = function() {
	var keyCode = event.keyCode;
	if (keyCode == 9 && !document.getElementsByClassName("tc_code_div")[0]) { // 按下 Backspace 并删除了输入框中的代码块
			document.getElementsByClassName("tc_input_code_button")[0].removeAttribute("disabled");
			document.getElementsByClassName("tc_input_code_button")[0].removeAttribute("title");
		}
};

// 语法高亮
if (location.href.indexOf("tieba.baidu.com/p/") > 0) {
	var ccTags = document.getElementsByTagName("cc"),
		codeList = [];
	for (var z = 0; z < ccTags.length; z++) {
		if (ccTags[z].innerHTML.match(/\/\/ ==Tieba Coder lang:.*==.*\/\/ 注意：这段代码中的空格可能是全角空格/)) {
		var codeBlocks = ccTags[z].innerHTML.match(/\/\/ ==Tieba Coder lang:.*==.*\/\/ 注意：这段代码中的空格可能是全角空格/);
		for (var y = 0; y < codeBlocks.length; y++) {
			var a = codeBlocks[y].split("<br>");
			a.pop();
			a.pop();
			a.shift();
			codeList.push(a.join("\n"));
		}
		}
	}
	for (var w = 0; w < codeList.length; w++) {
		codeList[w] = codeList[w].replace(/\u3000/g,"  ");
	}
	// 将所有代码存放在一个数组

	for (var m = 0; m < ccTags.length; m++) {
		ccTags[m].innerHTML = ccTags[m].innerHTML.replace(/(\/\/ ==Tieba Coder lang:.*==).*(\/\/ 这段代码使用 Tieba Coder 进行格式化和语法高亮，您可以在 <a href=.*<\/a> 下载 Tieba Coder 使用<br>\/\/ 注意：这段代码中的空格可能是全角空格)/g,"$1$2");
	}

	if(document.getElementsByClassName("d_post_content")[0]){
	var regex = /(\/\/ ==Tieba Coder lang:.*==)|(\/\/ 这段代码使用 Tieba Coder.*您可以在)|(下载 Tieba Coder 使用)|(\/\/ 注意：这段代码中的空格可能是全角空格)/,
	list = [],
	xpath = document.evaluate(
		"//cc//text()", //XPath表达式：选择所有文本元素（text node）
		document,//document.body, //筛选环境
		null, //指定命名空间，不用管它
		XPathResult.ORDERED_NODE_ITERATOR_TYPE, //被匹配的元素按出现顺序排列
		null
	),
	k,x;
	while (k = xpath.iterateNext()) {
		if(!regex.test(x = k.textContent)) continue;
		if(x.indexOf("// ==Tieba Coder lang:")>=0)x=x.replace(/\/\/ ==Tieba Coder lang:(.*)==/g,"<pre class='language-$1'><code>");
		if(x.indexOf("// 这段代码使用 Tieba Coder")>=0)x=x.replace(/\/\/ 这段代码使用 Tieba Coder.*您可以在/g,"");
		if(x.indexOf(" 下载 Tieba Coder 使用")>=0)x=x.replace(/ 下载 Tieba Coder 使用/g,"");
		if(x.indexOf("// 注意：这段代码中的空格")>=0)x=x.replace(/\/\/ 注意：这段代码.*全角空格/g,"");
		list.push([k,x]);
	}
	list.forEach(function(item,index,array){
		var node = document.createElement("a");
		item[0].parentElement.replaceChild(node,item[0]);
		node.outerHTML = item[1];
	});
	list = [];
	}
	// 参考了 CC Code 的 replace_nodes() 函数 (https://greasyfork.org/zh-CN/scripts/281-cc-code/)

	var gfoLinks = $("a[href*='jump.bdimg.com']");
	for (var n = 0; n < gfoLinks.length; n++) {
		if (gfoLinks[n].innerText == "https://greasyfork.org/zh-CN/scripts/11542-tieba-coder") {
			node = document.createElement("a");
			gfoLinks[n].parentElement.replaceChild(node,gfoLinks[n]);
			node.outerHTML = "";
		}
	}
	gfoLinks = $("a[href='https://greasyfork.org/zh-CN/scripts/11542-tieba-coder']");
	for (var n = 0; n < gfoLinks.length; n++) {
		if (gfoLinks[n].innerText == "https://greasyfork.org/zh-CN/scripts/11542-tieba-coder") {
			node = document.createElement("a");
			gfoLinks[n].parentElement.replaceChild(node,gfoLinks[n]);
			node.outerHTML = "";
		}
	}

	var codeTags = $("pre[class*='language-']>code");
	for (var v = 0; v < codeTags.length; v++) {
		codeTags[v].innerText = codeList[v];
	}
}

// Prism.js START
// MIT license http://www.opensource.org/licenses/mit-license.php/
/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript+bash+c+cpp+java+php+python&plugins=show-language */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=_self.Prism={util:{encode:function(e){return e instanceof n?new n(e.type,t.util.encode(e.content),e.alias):"Array"===t.util.type(e)?e.map(t.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var a={};for(var r in e)e.hasOwnProperty(r)&&(a[r]=t.util.clone(e[r]));return a;case"Array":return e.map&&e.map(function(e){return t.util.clone(e)})}return e}},languages:{extend:function(e,n){var a=t.util.clone(t.languages[e]);for(var r in n)a[r]=n[r];return a},insertBefore:function(e,n,a,r){r=r||t.languages;var i=r[e];if(2==arguments.length){a=arguments[1];for(var l in a)a.hasOwnProperty(l)&&(i[l]=a[l]);return i}var s={};for(var o in i)if(i.hasOwnProperty(o)){if(o==n)for(var l in a)a.hasOwnProperty(l)&&(s[l]=a[l]);s[o]=i[o]}return t.languages.DFS(t.languages,function(t,n){n===r[e]&&t!=e&&(this[t]=s)}),r[e]=s},DFS:function(e,n,a){for(var r in e)e.hasOwnProperty(r)&&(n.call(e,r,e[r],a||r),"Object"===t.util.type(e[r])?t.languages.DFS(e[r],n):"Array"===t.util.type(e[r])&&t.languages.DFS(e[r],n,r))}},highlightAll:function(e,n){for(var a,r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),i=0;a=r[i++];)t.highlightElement(a,e===!0,n)},highlightElement:function(a,r,i){for(var l,s,o=a;o&&!e.test(o.className);)o=o.parentNode;if(o&&(l=(o.className.match(e)||[,""])[1],s=t.languages[l]),a.className=a.className.replace(e,"").replace(/\s+/g," ")+" language-"+l,o=a.parentNode,/pre/i.test(o.nodeName)&&(o.className=o.className.replace(e,"").replace(/\s+/g," ")+" language-"+l),s){var u=a.textContent;if(u){u=u.replace(/^(?:\r?\n|\r)/,"");var g={element:a,language:l,grammar:s,code:u};if(t.hooks.run("before-highlight",g),r&&_self.Worker){var c=new Worker(t.filename);c.onmessage=function(e){g.highlightedCode=n.stringify(JSON.parse(e.data),l),t.hooks.run("before-insert",g),g.element.innerHTML=g.highlightedCode,i&&i.call(g.element),t.hooks.run("after-highlight",g)},c.postMessage(JSON.stringify({language:g.language,code:g.code}))}else g.highlightedCode=t.highlight(g.code,g.grammar,g.language),t.hooks.run("before-insert",g),g.element.innerHTML=g.highlightedCode,i&&i.call(a),t.hooks.run("after-highlight",g)}}},highlight:function(e,a,r){var i=t.tokenize(e,a);return n.stringify(t.util.encode(i),r)},tokenize:function(e,n){var a=t.Token,r=[e],i=n.rest;if(i){for(var l in i)n[l]=i[l];delete n.rest}e:for(var l in n)if(n.hasOwnProperty(l)&&n[l]){var s=n[l];s="Array"===t.util.type(s)?s:[s];for(var o=0;o<s.length;++o){var u=s[o],g=u.inside,c=!!u.lookbehind,f=0,h=u.alias;u=u.pattern||u;for(var p=0;p<r.length;p++){var d=r[p];if(r.length>e.length)break e;if(!(d instanceof a)){u.lastIndex=0;var m=u.exec(d);if(m){c&&(f=m[1].length);var y=m.index-1+f,m=m[0].slice(f),v=m.length,k=y+v,b=d.slice(0,y+1),w=d.slice(k+1),N=[p,1];b&&N.push(b);var O=new a(l,g?t.tokenize(m,g):m,h);N.push(O),w&&N.push(w),Array.prototype.splice.apply(r,N)}}}}}return r},hooks:{all:{},add:function(e,n){var a=t.hooks.all;a[e]=a[e]||[],a[e].push(n)},run:function(e,n){var a=t.hooks.all[e];if(a&&a.length)for(var r,i=0;r=a[i++];)r(n)}}},n=t.Token=function(e,t,n){this.type=e,this.content=t,this.alias=n};if(n.stringify=function(e,a,r){if("string"==typeof e)return e;if("Array"===t.util.type(e))return e.map(function(t){return n.stringify(t,a,e)}).join("");var i={type:e.type,content:n.stringify(e.content,a,r),tag:"span",classes:["token",e.type],attributes:{},language:a,parent:r};if("comment"==i.type&&(i.attributes.spellcheck="true"),e.alias){var l="Array"===t.util.type(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(i.classes,l)}t.hooks.run("wrap",i);var s="";for(var o in i.attributes)s+=o+'="'+(i.attributes[o]||"")+'"';return"<"+i.tag+' class="'+i.classes.join(" ")+'" '+s+">"+i.content+"</"+i.tag+">"},!_self.document)return _self.addEventListener?(_self.addEventListener("message",function(e){var n=JSON.parse(e.data),a=n.language,r=n.code;_self.postMessage(JSON.stringify(t.util.encode(t.tokenize(r,t.languages[a])))),_self.close()},!1),_self.Prism):_self.Prism;var a=document.getElementsByTagName("script");return a=a[a.length-1],a&&(t.filename=a.src,document.addEventListener&&!a.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism);;
Prism.languages.markup={comment:/<!--[\w\W]*?-->/,prolog:/<\?[\w\W]+?\?>/,doctype:/<!DOCTYPE[\w\W]+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[^\s>\/]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism.hooks.add("wrap",function(t){"entity"===t.type&&(t.attributes.title=t.content.replace(/&amp;/,"&"))});;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,"function":/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},Prism.languages.css.atrule.inside.rest=Prism.util.clone(Prism.languages.css),Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/<style[\w\W]*?>[\w\W]*?<\/style>/i,inside:{tag:{pattern:/<style[\w\W]*?>|<\/style>/i,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css},alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));;
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:/("|')(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,"class-name":{pattern:/((?:(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,"boolean":/\b(true|false)\b/,"function":/[a-z0-9_]+(?=\()/i,number:/\b-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,operator:/[-+]{1,2}|!|<=?|>=?|={1,3}|&{1,2}|\|?\||\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};;
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,"function":/(?!\d)[a-z0-9_$]+(?=\()/i}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0}}),Prism.languages.insertBefore("javascript","class-name",{"template-string":{pattern:/`(?:\\`|\\?[^`])*`/,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/<script[\w\W]*?>[\w\W]*?<\/script>/i,inside:{tag:{pattern:/<script[\w\W]*?>|<\/script>/i,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript},alias:"language-javascript"}});;
Prism.languages.bash=Prism.languages.extend("clike",{comment:{pattern:/(^|[^"{\\])#.*/,lookbehind:!0},string:{pattern:/("|')(\\?[\s\S])*?\1/,inside:{property:/\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^\}]+\})/}},number:{pattern:/([^\w\.])-?(0x[\dA-Fa-f]+|\d*\.?\d+([Ee]-?\d+)?)\b/,lookbehind:!0},"function":/\b(?:alias|apropos|apt-get|aptitude|aspell|awk|basename|bash|bc|bg|builtin|bzip2|cal|cat|cd|cfdisk|chgrp|chmod|chown|chroot|chkconfig|cksum|clear|cmp|comm|command|cp|cron|crontab|csplit|cut|date|dc|dd|ddrescue|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|du|egrep|eject|enable|env|ethtool|eval|exec|expand|expect|export|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|getopts|git|grep|groupadd|groupdel|groupmod|groups|gzip|hash|head|help|hg|history|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|jobs|join|kill|killall|less|link|ln|locate|logname|logout|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|make|man|mkdir|mkfifo|mkisofs|mknod|more|most|mount|mtools|mtr|mv|mmv|nano|netstat|nice|nl|nohup|notify-send|nslookup|open|op|passwd|paste|pathchk|ping|pkill|popd|pr|printcap|printenv|printf|ps|pushd|pv|pwd|quota|quotacheck|quotactl|ram|rar|rcp|read|readarray|readonly|reboot|rename|renice|remsync|rev|rm|rmdir|rsync|screen|scp|sdiff|sed|seq|service|sftp|shift|shopt|shutdown|sleep|slocate|sort|source|split|ssh|stat|strace|su|sudo|sum|suspend|sync|tail|tar|tee|test|time|timeout|times|touch|top|traceroute|trap|tr|tsort|tty|type|ulimit|umask|umount|unalias|uname|unexpand|uniq|units|unrar|unshar|uptime|useradd|userdel|usermod|users|uuencode|uudecode|v|vdir|vi|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yes|zip)\b/,keyword:/\b(if|then|else|elif|fi|for|break|continue|while|in|case|function|select|do|done|until|echo|exit|return|set|declare)\b/}),Prism.languages.insertBefore("bash","keyword",{property:/\$([a-zA-Z0-9_#\?\-\*!@]+|\{[^}]+\})/}),Prism.languages.insertBefore("bash","comment",{important:/^#!\s*\/bin\/bash|^#!\s*\/bin\/sh/});;
Prism.languages.c=Prism.languages.extend("clike",{keyword:/\b(asm|typeof|inline|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while)\b/,operator:/\-[>-]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|?\||[~^%?*\/]/}),Prism.languages.insertBefore("c","string",{macro:{pattern:/(^\s*)#\s*[a-z]+([^\r\n\\]|\\.|\\(?:\r\n?|\n))*/im,lookbehind:!0,alias:"property",inside:{string:{pattern:/(#\s*include\s*)(<.+?>|("|')(\\?.)+?\3)/,lookbehind:!0}}}}),delete Prism.languages.c["class-name"],delete Prism.languages.c["boolean"];;
Prism.languages.cpp=Prism.languages.extend("c",{keyword:/\b(alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|class|compl|const|constexpr|const_cast|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|float|for|friend|goto|if|inline|int|long|mutable|namespace|new|noexcept|nullptr|operator|private|protected|public|register|reinterpret_cast|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/,"boolean":/\b(true|false)\b/,operator:/[-+]{1,2}|!=?|<{1,2}=?|>{1,2}=?|\->|:{1,2}|={1,2}|\^|~|%|&{1,2}|\|?\||\?|\*|\/|\b(and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/}),Prism.languages.insertBefore("cpp","keyword",{"class-name":{pattern:/(class\s+)[a-z0-9_]+/i,lookbehind:!0}});;
Prism.languages.java=Prism.languages.extend("clike",{keyword:/\b(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)\b/,number:/\b0b[01]+\b|\b0x[\da-f]*\.?[\da-fp\-]+\b|\b\d*\.?\d+[e]?[\d]*[df]\b|\b\d*\.?\d+\b/i,operator:{pattern:/(^|[^\.])(?:\+=|\+\+?|-=|--?|!=?|<{1,2}=?|>{1,3}=?|==?|&=|&&?|\|=|\|\|?|\?|\*=?|\/=?|%=?|\^=?|:|~)/m,lookbehind:!0}});;
Prism.languages.php=Prism.languages.extend("clike",{keyword:/\b(and|or|xor|array|as|break|case|cfunction|class|const|continue|declare|default|die|do|else|elseif|enddeclare|endfor|endforeach|endif|endswitch|endwhile|extends|for|foreach|function|include|include_once|global|if|new|return|static|switch|use|require|require_once|var|while|abstract|interface|public|implements|private|protected|parent|throw|null|echo|print|trait|namespace|final|yield|goto|instanceof|finally|try|catch)\b/i,constant:/\b[A-Z0-9_]{2,}\b/,comment:{pattern:/(^|[^\\])(\/\*[\w\W]*?\*\/|(^|[^:])(\/\/).*?(\r?\n|$))/,lookbehind:!0}}),Prism.languages.insertBefore("php","class-name",{"shell-comment":{pattern:/(^|[^\\])#.*?(\r?\n|$)/,lookbehind:!0,alias:"comment"}}),Prism.languages.insertBefore("php","keyword",{delimiter:/(\?>|<\?php|<\?)/i,variable:/(\$\w+)\b/i,"package":{pattern:/(\\|namespace\s+|use\s+)[\w\\]+/,lookbehind:!0,inside:{punctuation:/\\/}}}),Prism.languages.insertBefore("php","operator",{property:{pattern:/(->)[\w]+/,lookbehind:!0}}),Prism.languages.markup&&(Prism.hooks.add("before-highlight",function(e){"php"===e.language&&(e.tokenStack=[],e.backupCode=e.code,e.code=e.code.replace(/(?:<\?php|<\?)[\w\W]*?(?:\?>)/gi,function(n){return e.tokenStack.push(n),"{{{PHP"+e.tokenStack.length+"}}}"}))}),Prism.hooks.add("before-insert",function(e){"php"===e.language&&(e.code=e.backupCode,delete e.backupCode)}),Prism.hooks.add("after-highlight",function(e){if("php"===e.language){for(var n,a=0;n=e.tokenStack[a];a++)e.highlightedCode=e.highlightedCode.replace("{{{PHP"+(a+1)+"}}}",Prism.highlight(n,e.grammar,"php"));e.element.innerHTML=e.highlightedCode}}),Prism.hooks.add("wrap",function(e){"php"===e.language&&"markup"===e.type&&(e.content=e.content.replace(/(\{\{\{PHP[0-9]+\}\}\})/g,'<span class="token php">$1</span>'))}),Prism.languages.insertBefore("php","comment",{markup:{pattern:/<[^?]\/?(.*?)>/,inside:Prism.languages.markup},php:/\{\{\{PHP[0-9]+\}\}\}/}));;
Prism.languages.python={comment:{pattern:/(^|[^\\])#.*?(\r?\n|$)/,lookbehind:!0},string:/"""[\s\S]+?"""|'''[\s\S]+?'''|("|')(\\?.)*?\1/,"function":{pattern:/((^|\s)def[ \t]+)([a-zA-Z_][a-zA-Z0-9_]*(?=\())/g,lookbehind:!0},keyword:/\b(as|assert|async|await|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|pass|print|raise|return|try|while|with|yield)\b/,"boolean":/\b(True|False)\b/,number:/\b-?(0[bo])?(?:(\d|0x[a-f])[\da-f]*\.?\d*|\.\d+)(?:e[+-]?\d+)?j?\b/i,operator:/[-+]|<=?|>=?|!|={1,2}|&{1,2}|\|?\||\?|\*|\/|@|~|\^|%|\b(or|and|not)\b/,punctuation:/[{}[\];(),.:]/};;
!function(){if(self.Prism){var e={csharp:"C#",cpp:"C++"};Prism.hooks.add("before-highlight",function(a){var t=a.element.parentNode;if(t&&/pre/i.test(t.nodeName)){var i=e[a.language]||a.language;t.setAttribute("data-language",i)}})}}();;
// Prism.js END
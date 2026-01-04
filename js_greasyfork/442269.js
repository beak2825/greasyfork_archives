// ==UserScript==
// @name          Уник для lolz.guru
// @description	  credits: lolz.guru/malware
// @author        chel1k
// @homepage      lolz.guru
// @include       http://lolz.guru/*
// @include       https://lolz.guru/*
// @include       http://*.lolz.guru/*
// @include       https://*.lolz.guru/*
// @grant         GM_addStyle
// @run-at        document-start
// @version       1.01
// @license MIT
// @namespace
// @namespace https://greasyfork.org/users/894727
// @downloadURL https://update.greasyfork.org/scripts/442269/%D0%A3%D0%BD%D0%B8%D0%BA%20%D0%B4%D0%BB%D1%8F%20lolzguru.user.js
// @updateURL https://update.greasyfork.org/scripts/442269/%D0%A3%D0%BD%D0%B8%D0%BA%20%D0%B4%D0%BB%D1%8F%20lolzguru.meta.js
// ==/UserScript==
var unik = '{ color: Вместо этого текста вставляйте сюда код уника }';
var short_url = 'Сюда вставляйте короткую ссылку на ваш профиль';
var member_id = 'Ваш статик';
var css = [
    'a[href="'+short_url+'/"] '+unik,
    'a[href="https://lolz.guru/members/'+member_id+'/"] '+unik,
    'a[href="members/'+member_id+'/"] '+unik,
    'b[id="NavigationAccountUsername"] '+unik,
    //
    // chel1k
    //
    'a[href="asdf/"] { color: rgba(0,0,0,.6);background: #717171;text-shadow:    3px 2px 3px #ffffff33, 0 0 9px #ffffff80, 0 0 9px #ffffff80, 0px -1px 1px #656565, 0px -1px 0px #929292;-webkit-background-clip: text;-webkit-text-fill-color: transparent }',
    'a[href="https://lolz.guru/members/757397/"] { color: rgba(0,0,0,.6);background: #717171;text-shadow:    3px 2px 3px #ffffff33, 0 0 9px #ffffff80, 0 0 9px #ffffff80, 0px -1px 1px #656565, 0px -1px 0px #929292;-webkit-background-clip: text;-webkit-text-fill-color: transparent }',
    'a[href="members/757397/"] { color: rgba(0,0,0,.6);background: #717171;text-shadow:    3px 2px 3px #ffffff33, 0 0 9px #ffffff80, 0 0 9px #ffffff80, 0px -1px 1px #656565, 0px -1px 0px #929292;-webkit-background-clip: text;-webkit-text-fill-color: transparent }',
    //
    // MALWARE
    //
    'a[href="malware/"] { background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }',
    'a[href="https://lolz.guru/members/3985842/"] { background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }',
    'a[href="members/3985842/"] { background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }',
    //
    // smetanka
    //
    'a[href="smetanka/"] { background: linear-gradient(353.52deg, rgba(251,166,225,1) 48.47%, #FFF 1.47%, #FFF 0.25%), rgba(251,166,225,1);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:         0px 0px 5px rgb(255, 115, 212);-webkit-background-clip:text }',
    'a[href="https://lolz.guru/members/3001067/"] { background: linear-gradient(353.52deg, rgba(251,166,225,1) 48.47%, #FFF 1.47%, #FFF 0.25%), rgba(251,166,225,1);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:         0px 0px 5px rgb(255, 115, 212);-webkit-background-clip:text }',
    'a[href="members/3001067/"] { background: linear-gradient(353.52deg, rgba(251,166,225,1) 48.47%, #FFF 1.47%, #FFF 0.25%), rgba(251,166,225,1);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:         0px 0px 5px rgb(255, 115, 212);-webkit-background-clip:text }',
    //
    //
    //
    'li[data-author="Реклама"] { display: none; }',
    '.text_Ads.mn-0-0-15 { display: none; }',
    '.section.monthMaecenas { display: none; }',
    'a[href="https://xenforo.com"] { display: none; }',
    '.hasUnreadArticles { display: none; }'
    ].join("\n");
(function() {
if ((window.location.href == "https://lolz.guru/"+short_url+"/") || (window.location.href == "https://lolz.guru/members/"+member_id+"/")) {
    css+=('.page_top .username '+unik);
}
if ((window.location.href == "https://lolz.guru/malware/") || (window.location.href == "https://lolz.guru/members/3001067/")) {
    css+=('.page_top .username { background: linear-gradient(1000000deg, #0070FF , #FFA500); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }');
}
if ((window.location.href == "https://lolz.guru/smetanka/") || (window.location.href == "https://lolz.guru/members/3001067/")) {
    css+=('.page_top .username { background: linear-gradient(353.52deg, rgba(251,166,225,1) 48.47%, #FFF 1.47%, #FFF 0.25%), rgba(251,166,225,1);-webkit-background-clip: text;-webkit-text-fill-color: transparent;text-shadow:         0px 0px 5px rgb(255, 115, 212);-webkit-background-clip:text }');
}
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		document.documentElement.appendChild(node);
	}
}
})();
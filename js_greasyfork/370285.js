// ==UserScript==
// @name          电影天堂去广告美化界面DYTT
// @description	  去广告和美化界面 http://www.dytt8.net/
// @author        no-name
// @run-at        document-start
// @version       1.212
// @include       /^http://www\.dytt8\.net/.*$/
// @namespace https://greasyfork.org/users/196152
// @downloadURL https://update.greasyfork.org/scripts/370285/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%BE%8E%E5%8C%96%E7%95%8C%E9%9D%A2DYTT.user.js
// @updateURL https://update.greasyfork.org/scripts/370285/%E7%94%B5%E5%BD%B1%E5%A4%A9%E5%A0%82%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%BE%8E%E5%8C%96%E7%95%8C%E9%9D%A2DYTT.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (new RegExp("^http://www\\.dytt8\\.net/.*$")).test(document.location.href))
	css += [
		"body > a {",
		"	display: none !important;",
		"}",
		".bd4l {",
		"	display: none;",
		"}",
		"#headerright,",
		"#cs_right_bottom,",
		".bd6,",
		"#cs_left_couplet,",
		"#cs_right_couplet,",
		"#Zoom span >a,",
		"#Zoom font,",
		"#Zoom center,",
		".bd3r ul hr,",
		"select[name=field],",
		"#copy,",
		".path ul:not(a),",
		".bd3rr > a,",
		".bd3l > a ,",
		"#cs_DIV_cscpvrich5041B{",
		"	display: none;",
		"}",
		".contain > h4 {",
		"	float: none;",
        "}",
        "#menu {",
        "background:#FFF !important;",
        "border:1px solid #eee !important;",
        "box-shadow:1px 0px 5px rgba(0,0,0,0.06) !important;",
        "height:60px !important;",
        "border-radius:5px 5px 5px 5px !important;",
        "}",
        ".contain {",
        "width:1200px !important;",
        "}",
        ".contain > h4 {",
        "display:none !important;",
        "}",
        "#menu  li  a {",
        "color:#555 !important;",
        "line-height:60px !important;",
        "font-size:16px !important;",
        "}",
        "body {",
        "background-image: url(http://dema1905.top/anyun/bj.png) !important;",
        "font-family:Microsoft Yahei,Verdana,sans-serif;",
        "}",
        ".title_all {",
        "background:#ddd !important;",
        "border:1px solid #eee !important;",
        "box-shadow:1px 0px 5px rgba(0,0,0,0.06) !important;",
        "}",
        ".title_all h1， .title_all p{",
        "border:0px !important;",
        "}",
        ".bd3r > div > .search {",
        "background:#FFF !important;",
        "border:1px solid #eee !important;",
        "box-shadow:1px 0px 5px rgba(0,0,0,0.06) !important;",
        "}",
        ".searchr > input {",
        "background:rgba(255, 102, 82, 0.25) !important;",
        "border-radius:5px 5px 5px 5px !important;",
        "}",
        ".searchr > input:hover {",
        "background:#ff6651 !important;",
        "}",
        ".formhue:hover, #skeyword:hover {",
        "background:rgba(255, 102, 82, 0.25) !important;",
        "}",
        ".bd3 {",
        "line-height:30px !important;",
        "}",
        "a {",
        "color:#555 !important;",
        "}",
        ".bd2 a:link, .bd2 a:visited, .bd2 a:hover {",
        "color:#555;",
        "text-decoration:none !important;",
        "}",
        "#Zoom p {",
        "color:#555 !important;",
        "font-size:22px !important;",
        "}",
        "tr:hover, li:hover {",
        "background:#ddd !important;",
        "}",
        ".co_content2 a, .co_content4 a {",
        "display:inline-block !important;",
        "width:230px !important;",
        "}",
        "a:hover {",
        "background:#ddd !important;",
        "}",
        "#Zoom a {",
        "display:block !important;",
        "}",
        ".bd1, .bd2, .bd3, .ad1, .bd5, .bd6, .footer {",
        "width:1120px !important;",
        "}",
        ".bd3l {",
        "width:245px !important;",
        "}",
        ".bd3r {",
        "width:868px !important;",
        "}",
        ".bd3rl {",
        "width:615px !important;",
        "}",
        ".bd3rr {",
        "width:248px !important;",
        "}",
        "form, p, h1, h2, h3, ul, li {",
        "font-size:14px !important;",
        "}",
        ".co_area1 > .co_content2  a {",
        "width:220px !important",
        "}",
        ".bd3 > .bd3l > .co_area2 > .co_content2 a {",
        "width:220px !important;",
        "}",
        ".bd3 > .bd3l > .co_area2 > .co_content2  img {",
        "width:226px !important;",
        "}",
        "div.contain > div:last-child.bd2 > div:nth-child(4).bd3 > div:nth-child(2).bd3r > div:nth-child(2).co_area2 > div:nth-child(2).co_content8 > ul > table:nth-child(3) {",
        "display:none !important;",
        "}",
        ".footer {",
        "border:0 !important;",
        "background:none !important;",
        "}",
	].join("\n");
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

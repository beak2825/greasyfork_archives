// ==UserScript==
// @name        html5plus文档展示优化
// @namespace   让 html5plus、uni-app 文档展示效果更赞，文档正文方法支持锚点，支持一键回到顶部。
// @version     1.0.0
// @match       https://www.html5plus.org/doc/*
// @icon        https://www.html5plus.org/favicon.ico
// @grant       none
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/481656
// @license MIT
// @description 2023/12/8 09:53:16
// @downloadURL https://update.greasyfork.org/scripts/481656/html5plus%E6%96%87%E6%A1%A3%E5%B1%95%E7%A4%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/481656/html5plus%E6%96%87%E6%A1%A3%E5%B1%95%E7%A4%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {

	function initStyle() {
		const el = document.createElement('style');
		el.setAttribute('rel', 'stylesheet');
		el.setAttribute('type', 'text/css');
		el.textContent = `
body{
	--link-color: #1890ff;
	--link-color-hover: #40a9ff;
	--link-color-active: #096dd9;
}
body{
	line-height: 20px;
}
a{
	color: var(--link-color);
}
a:hover{
	color: var(--link-color-hover);
	text-decoration: underline;
}
a:active{
	color: var(--link-color-active);
}

p{
	margin: 5px 0;
}

header .container{
	width: auto;
	max-width: 1400px;
}
header .logo,
header .nav nav{
	float: none;
	display: inline-block;
	vertical-align: top;
}
header .logo{
	height: 60px;
	background-size: 78%;
}

header .nav{
	height: 60px;
	padding: 0;
	box-shadow: none;
	padding-left: 10px;
}
header .nav:before,
header .nav:after{
	display: none;
}
header .nav nav a{
	padding: 4px 15px;
}
header .nav nav a:hover{
	background: #f5f5f5;
	text-decoration: none;
}
header .nav nav a:active{
	background: #e5e5e5;
}
header .nav nav a.current{
	color: #fff !important;
	background: var(--link-color);
	border: 0;
	border-radius: 5px;
	box-shadow: none;
}
header .nav nav a.current strong{
	color: #fff !important;
	font-weight: normal;
}

#content{
	width: auto;
	max-width: 1400px;
	padding-left: 15px;
	padding-right: 15px;
	overflow: visible;
}

.aside{
	padding: 0;
	position: sticky;
	top: 0;
	height: calc(100vh);
	overflow: hidden;
	overflow-y: auto;
	width: 160px;
}
.aside > h1{
	margin: 5px 0;
}
.aside > ul > li{
	padding: 0;
	margin: 0 0 2px 0;
}

article.guides,
article.article{
	float: none;
	width: auto;
	max-width: none;
	margin-left: 160px;
	padding-left: 20px;
	padding-bottom: 20px;
}

.guides ul{
	float: none;
}
.guides ul:after{
	content: "\\20";
	display: block;
	width: 0;
	height: 0;
	clear: both;
}
.guides ul > li{
	margin: 10px;
}


header .nav nav a,
.aside > ul > li > a,
.article > h1 > a{
	color: var(--link-color);
}

header .nav nav a:hover,
.aside > ul > li > a:hover,
.article > h1 > a:hover{
	color: var(--link-color-hover);
}

header .nav nav a:active,
.aside > ul > li > a:active,
.article > h1 > a:active{
	color: var(--link-color-active);
}





.aside > ul > li > a{
	display: block;
	padding: 2px 5px;
	background-image: none !important;
	border-radius: 3px;
}
.aside > ul > li > a:hover{
	background: #f5f5f5;
}
.aside > ul > li > a:active{
	background: #e5e5e5;
}

.aside > ul > li > a[style]{
	font-weight: bold;
	color: #fff !important;
	background: var(--link-color);
}

.article > h1{
	margin: 0;
	padding-top: 25px;
	padding-bottom: 15px;
}
.article > h2{
	color: #555;
	font-size: 16px;
}

pre code{
	font-size: 14px;
}
pre.prettyprint .kwd{
	font-weight: normal;
}

.x-link-go-top{
	position: fixed;
	right: 0;
	top: 50%;
	z-index: 999;
	display: block;
	padding: 5px 25px 5px 10px;
	border-radius: 5px;
	background: rgba(255,255,255,0.82);
}
.x-link-go-top:hover{
	background: rgba(255,255,255,1);
}
`;
		document.head.appendChild(el);
	}


	function addAnchors() {
		const $anchors = document.querySelectorAll('.article>h1>a[name]');
		$anchors.forEach((item) => {
			((el) => {
				if (el.getAttribute('name') && !el.getAttribute('href')) {
					el.setAttribute('href', '#'+ el.getAttribute('name'));
				}
			})(item);
		});
	}

	function addGoTop() {
		const el = document.createElement('a');
		el.setAttribute('href', 'javascript:void(0)');
		el.className = 'x-link-go-top';
		el.innerText = '🤟 回到顶部';
		el.addEventListener('click', (event) => {
			event.preventDefault();
			window.scrollTo(window.scrollX, 0);
			return false;
		});
		document.body.appendChild(el);
	}

	initStyle();

	addAnchors();

	addGoTop();
})();
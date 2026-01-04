// ==UserScript==
// @name         Magi搜索-白
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Magi搜索修改为白色主色调
// @author       Shillber
// @include      *://magi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392132/Magi%E6%90%9C%E7%B4%A2-%E7%99%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392132/Magi%E6%90%9C%E7%B4%A2-%E7%99%BD.meta.js
// ==/UserScript==
/*Magi搜索进化 */
(function () {
  /* 执行判断 */
  const key = encodeURIComponent('修改谷花泰的插件:纯净苍穹');
  if (window[key]) {
    return;
  };
  window[key] = true;

  class FuckAD {
    constructor(configs) {
      this._configs = configs;

      /*
       * config里的配置解释
       * {
       *   正则匹配的域名数组
       *   sites: ['zhihu.com'],
       * 
       *   移除的节点数组
       *   remove: ['#id'],
       * 
       *   display隐藏的节点数组
       *   displayNone: ['#id'],
       * 
       *   visibility隐藏的节点数组
       *   visibilityHidden: ['#id'],
       * 
       *   额外的css
       *   style: `
       *   body {
       *     background-color: #000;
       *   }
       *   `,
       *  
       *   额外的函数执行
       *   others() {
       *     console.log('others: 哈哈');
       *   }
       * }
       *
       */

      /* 初始化 */
      this.init();
    };
    /*
     * 初始化
     */
    init() {
      const that = this;
      /* 所有要移除的节点 */
      let remove = [];
      /* 总体style */
      let style = '';
      /* 要执行的其它函数集 */
      let others = [];

      /* 统计 */
      this._configs.forEach(config => {
        const canLoad = that.siteInList(config.sites);
        if (canLoad) {
          remove = remove.concat(config.remove);
          style += (config.style || '');
          style += (that.letSelectorsDisplayNone(config.displayNone));
          style += (that.letSelectorsVisibilityHidden(config.visibilityHidden));
          config.others && (others = others.concat(config.others));
        };
      });

      /* 添加style */
      this.addStyle(style);
      that.removeNodesBySelectors(remove);

      /* 执行others内所有函数 */
      try {
        others.forEach(func => {
          func();
        });
      } catch (err) {
        console.error('via: others function run error', err);
      };

      /* 监听dom，确保节点移除 */
      if (remove && remove.length > 0) {
        this.observe({
          targetNode: document.documentElement,
          config: {
            attributes: false
          },
          callback(mutations, observer) {
            that.removeNodesBySelectors(remove);
          }
        })
      }
    };
    /*
     * 监听dom节点加载函数
     */
    observe({ targetNode, config = {}, callback = () => { } }) {
      if (!targetNode) {
        return;
      };

      config = Object.assign({
        attributes: true,
        childList: true,
        subtree: true
      }, config);

      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    };
    /*
     * 添加style 
     */
    addStyle(style = '') {
      const styleElm = document.createElement('style');
      styleElm.innerHTML = style;
      document.head.appendChild(styleElm);
    };
    /*
     * 选择节点，返回节点数组
     */
    selectNodes(selector) {
      if (!selector) {
        return [];
      };
      const nodes = document.querySelectorAll(selector);
      return nodes;
    };
    /*
     * 判断网站是否在名单内 
     */
    siteInList(sites) {
      const hostname = window.location.hostname;
      const result = sites.some(site => {
        if (hostname.match(site)) {
          return true;
        }
        return false;
      });
      return result;
    };
    /*
     * 移除多个节点
     */
    removeNodes(nodes = []) {
      Array.from(nodes, node => {
        node.parentNode.removeChild(node);
      });
    };
    /*
     * 根据selector数组移除多个节点
     */
    removeNodesBySelectors(selectors = []) {
      let nodeArr = [];
      selectors.forEach(selector => {
        const nodes = this.selectNodes(selector);
        if (nodes && nodes.length > 0) {
          nodeArr = nodeArr.concat(Array.from(nodes));
        };
      });
      this.removeNodes(nodeArr);
    };
    /*
     * 根据css选择器生成style
     */
    generateStyleBySelectors(selectors = [], customStyle = `{}`) {
      if (!selectors || selectors.length === 0) {
        return '';
      };
      let style = '';
      selectors.forEach(selector => {
        if (selector) {
          style += `
          
          ${selectors} ${customStyle}
  
          `;
        };
      });
      return style;
    };
    /*
     * 让数组里的选择器全部 display: none
     */
    letSelectorsDisplayNone(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        display: none!important;
      }`);
    };
    /*
     * 让数组里的选择器全部 visibility: hidden
     */
    letSelectorsVisibilityHidden(selectors = []) {
      return this.generateStyleBySelectors(selectors, `{
        visibility: hidden!important;
      }`);
    };
  };

  new FuckAD([
    {
      sites: ['magi.com'],
      style: `
          /*! normalize.css v8.0.0 | MIT License | github.com/necolas/normalize.css */
html {
	line-height: 1.15;
	-webkit-text-size-adjust: 100%
}

body {
	margin: 0
}

h1 {
	font-size: 2em;
	margin: .67em 0
}

hr {
	box-sizing: content-box;
	height: 0;
	overflow: visible
}

pre {
	font-family: monospace, monospace;
	font-size: 1em
}

a {
	background-color: transparent
}

abbr[title] {
	border-bottom: none;
	text-decoration: underline;
	text-decoration: underline dotted
}

b,
strong {
	font-weight: bolder
}

code,
kbd,
samp {
	font-family: monospace, monospace;
	font-size: 1em
}

small {
	font-size: 80%
}

sub,
sup {
	font-size: 75%;
	line-height: 0;
	position: relative;
	vertical-align: baseline
}

sub {
	bottom: -0.25em
}

sup {
	top: -0.5em
}

img {
	border-style: none
}

button,
input,
optgroup,
select,
textarea {
	font-family: inherit;
	font-size: 100%;
	line-height: 1.15;
	margin: 0
}

button,
input {
	overflow: visible
}

button,
select {
	text-transform: none
}

button,
[type="button"],
[type="reset"],
[type="submit"] {
	-webkit-appearance: button
}

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
	border-style: none;
	padding: 0
}

button:-moz-focusring,
[type="button"]:-moz-focusring,
[type="reset"]:-moz-focusring,
[type="submit"]:-moz-focusring {
	outline: 1px dotted ButtonText
}

fieldset {
	padding: .35em .75em .625em
}

legend {
	box-sizing: border-box;
	color: inherit;
	display: table;
	max-width: 100%;
	padding: 0;
	white-space: normal
}

progress {
	vertical-align: baseline
}

textarea {
	overflow: auto
}

[type="checkbox"],
[type="radio"] {
	box-sizing: border-box;
	padding: 0
}

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
	height: auto
}

[type="search"] {
	-webkit-appearance: textfield;
	outline-offset: -2px
}

[type="search"]::-webkit-search-decoration {
	-webkit-appearance: none
}

::-webkit-file-upload-button {
	-webkit-appearance: button;
	font: inherit
}

details {
	display: block
}

summary {
	display: list-item
}

template {
	display: none
}

[hidden] {
	display: none
}

.tight {
	word-spacing: -0.15rem
}

*[data-collapse] {
	transition: max-height .2s
}

*[data-collapse="collapsed"] {
	display: none;
	max-height: 0
}

*[data-fade] {
	transition: opacity .2s
}

*[data-fade="hidden"] {
	display: none;
	opacity: 0
}

*[data-clip] {
	transition: max-height .2s
}

.queue-in>* {
	animation-name: queue-in;
	animation-duration: 400ms;
	animation-timing-function: ease;
	animation-fill-mode: backwards
}

.queue-in>*:nth-child(0) {
	animation-delay: 0ms
}

.queue-in>*:nth-child(1) {
	animation-delay: 50ms
}

.queue-in>*:nth-child(2) {
	animation-delay: 100ms
}

.queue-in>*:nth-child(3) {
	animation-delay: 150ms
}

.queue-in>*:nth-child(4) {
	animation-delay: 200ms
}

.queue-in>*:nth-child(5) {
	animation-delay: 250ms
}

.queue-in>*:nth-child(6) {
	animation-delay: 300ms
}

.queue-in>*:nth-child(7) {
	animation-delay: 350ms
}

.queue-in>*:nth-child(8) {
	animation-delay: 400ms
}

.queue-in>*:nth-child(9) {
	animation-delay: 450ms
}

.queue-in>*:nth-child(10) {
	animation-delay: 500ms
}

@keyframes queue-in {
	0% {
		opacity: 0;
		transform: translateY(-20px)
	}

	100% {
		opacity: 1;
		transform: translateY(0)
	}
}

.fade-in {
	animation-name: fade-in;
	animation-duration: 400ms
}

@keyframes fade-in {
	0% {
		opacity: 0
	}

	100% {
		opacity: 1
	}
}

html {
	font-size: 16px;
	font-family: "PingFang SC", "Helvetica", "sans-serif"
}

*,
*:before,
*:after {
	box-sizing: border-box;
	min-width: 0
}

a,
a:visited,
a:hover,
a:active {
	color: inherit
}

ol,
ul {
	list-style: none;
	margin: 0;
	padding: 0
}

input[type="search"] {
	-webkit-appearance: none
}

input[type="search"]::-webkit-search-cancel-button {
	display: none
}

@media only screen and (min-resolution:1.5dppx),
only screen and (-webkit-min-device-pixel-ratio:1.5) {
	body {
		font-smooth: auto;
		-moz-osx-font-smoothing: grayscale;
		-webkit-font-smoothing: antialiased
	}
}

body {
	color: #000;
	background-color: #FFF
}

body:before {
	position: fixed;
	content: "";
	opacity: 0;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: -1;
	background: linear-gradient(#FFF, #FFF); 
	background-repeat: no-repeat;
	background-size: 100% 100vh;
	transition: opacity .2s
}

@media all and (display-mode:standalone) {
	body {
		min-height: 100vh
	}
}

body[data-layout="home"]:before {
	opacity: 1
}

#curtain,
#content:before {
	box-sizing: content-box;
	height: 38vh
}

body[data-layout="home"] #curtain,
body[data-layout="home"] #content:before {
	min-height: 12rem;
	max-height: 38vh
}

body[data-layout="result"] #curtain,
body[data-layout="result"] #content:before {
	min-height: 4rem;
	max-height: 4rem
}

#curtain {
	z-index: 999;
	top: 0;
	right: 0;
	left: 0;
	padding-top: env(safe-area-inset-top);
	padding-right: env(safe-area-inset-right);
	padding-left: env(safe-area-inset-left)
}

body[data-layout="home"]>#curtain {
	position: absolute
}

body[data-layout="result"]>#curtain {
	position: fixed
}

body[data-layout="result"]>#curtain {
	background-color: #1C1C20
}

@media screen and (max-width:759px) {
	@supports (backdrop-filter: saturate(100%) blur(4px)) {
		body[data-layout="result"]>#curtain {
			backdrop-filter: saturate(100%) blur(4px);
			background-color: rgba(28, 28, 32, 0.65)
		}
	}

	@supports (-webkit-backdrop-filter: saturate(100%) blur(4px)) {
		body[data-layout="result"]>#curtain {
			-webkit-backdrop-filter: saturate(100%) blur(4px);
			background-color: rgba(28, 28, 32, 0.65)
		}
	}
}

#content {
	padding-top: env(safe-area-inset-top);
	padding-right: env(safe-area-inset-right);
	padding-bottom: env(safe-area-inset-bottom);
	padding-left: env(safe-area-inset-left);
	display: flex;
	min-height: calc(100vh - .75rem);
	flex-direction: column
}

#content:before {
	display: block;
	content: ""
}

body[data-layout="home"]>#content {
	min-height: calc(100vh - 5rem)
}

#content>section {
	flex-grow: 1
}

#content>footer {
	flex-shrink: 0
}

@media screen and (min-width:760px) {

	#curtain,
	#content:before {
		transition: background-color .2s, max-height .2s
	}

	#content {
		transition: min-height .2s
	}
}

#home {
	display: none
}

body[data-layout="home"] #home {
	display: block
}

@media screen and (min-width:760px) {
	#home {
		width: 36rem;
		margin: .75rem auto
	}
}

@media screen and (max-width:759px) {
	#home {
		width: auto;
		margin: .75rem
	}
}

#result {
	width: auto;
	margin: .75rem;
	display: none
}

@media screen and (min-width:760px) {
	body[data-layout="result"] #result {
		display: flex
	}
}

@media screen and (max-width:759px) {
	body[data-layout="result"] #result {
		display: block
	}
}

#result #left {
	display: none
}

@media screen and (min-width:760px) {
	#result #left {
		display: block;
		flex: 0 0 9.25rem
	}
}

#result #right {
	display: none
}

@media screen and (min-width:1020px) {
	#result #right {
		display: block;
		flex: 0 1 30rem
	}
}

@media screen and (min-width:760px) {
	#result>main {
		flex: 0 0 36rem;
		width: 36rem
	}
}

div.tips {
	font-size: .875rem;
	color: #000;
	padding: .5rem .5rem;
	margin-bottom: .75rem;
	overflow-wrap: break-word;
	word-wrap: break-word;
	-ms-word-break: break-all;
	word-break: break-all;
	word-break: break-word;
	-ms-hyphens: auto;
	-moz-hyphens: auto;
	-webkit-hyphens: auto;
	hyphens: auto
}

div.tips>em {
	font-style: normal;
	color: #FFD862
}

div.tips#censored {
	font-size: .8125rem;
	color: #8E8E92;
	padding-bottom: 0
}

#header {
	position: relative;
	height: 100%;
	width: 100%;
	background-color:#FFF;
	box-shadow: 0 0 10px 0 #EEE; 
}

#header h1 {
	display: none
}

#header .icon-magi {
	display: block;
	position: absolute;
	left: .75rem;
	bottom: 1.25rem;
	width: 4.0005rem;
	height: 1.5rem
}

body[data-layout="home"] #header .icon-magi {
	left: 50%;
	bottom: 5rem
}

@media screen and (min-width:760px) {
	body[data-layout="home"] #header .icon-magi {
		height: 4.9rem;
		width: 13.0683rem;
		margin-left: -6.53415rem
	}
}

@media screen and (max-width:759px) {
	body[data-layout="home"] #header .icon-magi {
		height: 3.76rem;
		width: 10.02792rem;
		margin-left: -5.01396rem
	}
}

@media screen and (min-width:760px) {
	body[data-layout="result"] #header .icon-magi {
		left: 5.2495rem
	}
}

#search-wrapper {
	position: absolute;
	bottom: .75rem;
	height: 2.5rem
}

@media screen and (min-width:760px) {
	body[data-layout="home"] #search-wrapper {
		left: 50%;
		width: 36rem;
		margin-left: -18rem
	}
}

@media screen and (max-width:759px) {
	body[data-layout="home"] #search-wrapper {
		left: .75rem;
		right: .75rem
	}
}

@media screen and (min-width:760px) {
	body[data-layout="result"] #search-wrapper {
		left: 10rem;
		width: 36rem
	}
}

@media screen and (max-width:759px) {
	body[data-layout="result"] #search-wrapper {
		left: 5.5005rem;
		right: .75rem;
		transition: left .2s
	}

	body[data-layout="result"] #search-wrapper:focus-within {
		left: .75rem
	}

	body[data-layout="result"] #search-wrapper[data-focus="true"] {
		left: .75rem
	}
}

#search-bar {
	position: relative;
	z-index: 2;
	display: flex;
	align-items: stretch;
	height: 2.5rem;
	background-color: #FFF;
	border-radius: .2rem;
	box-shadow: 0 0 .2rem 0 rgba(10, 10, 15, 0.2)
}

#search-input {
	flex: 1 1;
	color: #0A0A0F;
	width: 0;
	border: none;
	outline: 0;
	border-radius: 0;
	background: transparent;
	line-height: normal;
	padding: 0 .5rem
}

@media screen and (max-width:759px) {
	body[data-layout="result"] #search-input:focus {
		padding-right: 0
	}
}

#search-clear {
	display: none;
	flex: 0 0 2.5rem;
	cursor: pointer;
	border: none;
	outline: 0;
	border-radius: 0;
	background-color: transparent;
	background-size: auto 1rem
}

@media screen and (max-width:759px) {
	body[data-layout="result"] #search-input:focus+#search-clear {
		display: block
	}
}

#search-submit {
	flex: 0 0 2.55rem;
	cursor: pointer;
	border: none;
	outline: 0;
	border-radius: 0 .2rem .2rem 0;
	background-color: #F5F5F5;
	background-size: auto 1.3rem
}

#more {
	position: absolute;
	top: .75rem;
	right: .75rem;
	width: 2.5rem;
	height: 2.5rem
}

body[data-layout="result"] #more {
	display: none
}

@media screen and (min-width:760px) {
	.icon-magi {
		transition: all .2s
	}

	#search-wrapper {
		transition: left .2s, width .2s, margin-left .2s
	}
}

#intro {
	padding: .75rem 0;
	text-align: center;
	animation: home-slidein 1.1s ease
}

#intro>a {
	text-decoration: none;
	font-size: .875rem;
	color: #000;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#showcase>span {
	display: inline-block;
	margin: .75rem 0;
	padding-left: .5rem;
	font-size: .875rem;
	font-style: italic;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	color: #626266;
	background-repeat: no-repeat;
	background-size: 200px;
	-webkit-background-clip: text;
	background-clip: text;
	background-image: linear-gradient(-40deg, transparent 0%, transparent 40%, #000 50%, transparent 60%, transparent 100%);
	animation: home-slidein 1.1s ease, home-shine 2s ease 0s infinite
}

#showcase>ul *[data-fade] {
	transition-duration: .6s !important
}

#showcase>ul>li>a {
	display: block;
	padding: .5rem .5rem;
	border-radius: .2rem;
	text-decoration: none;
	background-color: #FAFAFA;
	position: relative;
	z-index: 2
}

#showcase>ul>li>a h5 {
	color: #000;
	font-size: .875rem;
	font-weight: normal;
	margin: 0;
	padding: 0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#showcase>ul>li>a:visited h5 {
	color: #FF0000
}

#showcase>ul>li>a cite {
	color: #90E6A6;
	display: block;
	font-size: .75rem;
	font-style: normal;
	font-weight: normal;
	margin-top: .25rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#showcase>ul>li>div {
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	border-radius: .2rem;
	background-color: transparent;
	position: relative;
	z-index: 1;
	margin-top: -0.2rem;
	padding: .7rem .5rem .5rem .5rem;
	animation: home-slidedown 1s ease 1.5s 1 normal backwards
}

#showcase>ul>li>div>span {
	color: #000;
	flex: 0 2 auto;
	font-size: .75rem;
	font-style: italic;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#showcase>ul>li>div>a {
	flex: 0 1 auto;
	display: inline-block;
	font-size: .8125rem;
	margin-left: .5rem;
	color: #000;
	background-color: rgba(20, 162, 245, 0.3);
	border-bottom-color: #FAFAFA;
	text-decoration: none;
	border-radius: .2rem;
	padding: .5rem .5rem;
	padding-bottom: .4375rem;
	border-bottom-style: solid;
	border-bottom-width: .125rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

@keyframes home-slidein {
	0% {
		opacity: 0;
		transform: translateY(20px)
	}

	10% {
		opacity: 0;
		transform: translateY(20px)
	}

	100% {
		opacity: 1;
		transform: translateY(0)
	}
}

@-webkit-keyframes home-shine {
	from {
		background-position: -200px
	}

	to {
		background-position: 200px
	}
}

@keyframes home-slidedown {
	0% {
		opacity: 0;
		transform: translateY(-40px)
	}

	100% {
		opacity: 1;
		transform: translateY(0)
	}
}

#footer {
	font-size: .75rem;
	color: #000;
	text-align: center
}

@media screen and (min-width:760px) {
	#footer {
		width: 36rem;
		transition: margin-left .2s
	}

	body[data-layout="home"] #footer {
		margin-left: calc(50% - 36rem * .5)
	}

	body[data-layout="result"] #footer {
		margin-left: 10rem
	}
}

#footer a {
	text-decoration: none
}

#footer span:not(:last-child) {
	margin-right: .75rem
}

#footer .icon-peaklabs {
	display: inline-block;
	box-sizing: content-box;
	width: 5.6rem;
	height: .6rem;
	padding: .5rem .5rem;
	margin: .75rem auto;
	background-size: 5.6rem
}

#footer div:last-child {
	cursor: default;
	color: #626266;
	transform: scale(.833);
	margin-bottom: .75rem
}

body[data-layout="result"] #footer div:last-child {
	display: none
}

body[data-layout="home"] #footer {
	animation: 1.4s ease 0s footer-slidein
}

@keyframes footer-slidein {
	0% {
		opacity: 0;
		transform: translateY(20px)
	}

	30% {
		opacity: 0;
		transform: translateY(20px)
	}

	100% {
		opacity: 1;
		transform: translateY(0)
	}
}

#search-suggestions {
	position: relative;
	z-index: 1;
	padding-top: .2rem;
	margin-top: -0.2rem;
	color: #0A0A0F;
	background-color: #FFF;
	box-shadow: 0 1px 1px 1px #EEE;
	border-bottom-left-radius: .2rem;
	border-bottom-right-radius: .2rem;
	overflow: hidden;
	display: none
}

#search-wrapper[data-focus=true] #search-suggestions {
	display: block
}

#search-suggestions li {
	cursor: pointer;
	padding: .5rem .5rem
}

#search-suggestions li[data-active=true] {
	color: #000;
	background-color: #FAFAFA
}

#search-suggestions li:first-child {
	margin-top: .5rem
}

.gauge {
	display: inline-block;
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath stroke-width='2' fill='none' stroke='%233E3E42' d='M16 1 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center
}

.gauge>path {
	fill: none;
	stroke: #000;
	stroke-width: 2;
	stroke-linecap: round;
	animation: progress 1s ease-out forwards
}

.gauge>path[data-color="green"] {
	stroke: #40AE36
}

.gauge>path[data-color="yellow"] {
	stroke: #F5980C
}

.gauge>path[data-color="red"] {
	stroke: #F5473E
}

.gauge>text {
	fill: #000;
	font-size: inherit;
	text-anchor: middle
}

@keyframes progress {
	0% {
		stroke-dasharray: 0 100
	}
}

.card {
	color: #000;
	background-color: #FAFAFA;
	padding: .5rem .5rem;
	margin-bottom: .75rem;
	border-radius: .2rem;
	overflow-wrap: break-word;
	word-wrap: break-word;
	-ms-word-break: break-all;
	word-break: break-all;
	word-break: break-word;
	-ms-hyphens: auto;
	-moz-hyphens: auto;
	-webkit-hyphens: auto;
	hyphens: auto
}

@media screen and (min-width:760px) {
	.card {
		font-size: .8125rem
	}
}

@media screen and (max-width:759px) {
	.card {
		font-size: .875rem
	}
}

.card[data-type="warn"] {
	font-size: .9375rem;
	color: #0A0A0F;
	background-color: #FFD862;
	text-align: center
}

.card[data-type="next"] {
	cursor: pointer;
	font-size: .9375rem;
	color: #000;
	background-color: #FAFAFA;
	text-align: center
}

.card[data-type="next"][data-loading="true"] {
	cursor: default;
	opacity: .5
}

.card[data-type="web"] {
	color: #000
}

@media screen and (min-width:760px) {
	.card[data-type="web"] {
		/* background-color: transparent */
		background-color: #FAFAFA
	}
}

.card[data-type="web"] a {
	text-decoration: none
}

.card[data-type="web"] a:visited h3 {
	color: #FF0000
}

.card[data-type="web"] h3 {
	display: block;
	font-size: 1rem;
	font-style: normal;
	font-weight: normal;
	line-height: 1.5em;
	color: #000;
	margin: 0
}

@media screen and (min-width:760px) {
	.card[data-type="web"] h3 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis
	}
}

@media screen and (max-width:759px) {
	.card[data-type="web"] h3 {
		max-height: 3em;
		overflow: hidden
	}
}

.card[data-type="web"] cite {
	display: block;
	color: #90E6A6;
	font-style: normal;
	font-weight: normal;
	line-height: 1.5em;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="web"] p {
	line-height: 1.5em;
	margin: 0
}

.card[data-type="web"] p time {
	color: #8E8E92;
	word-spacing: -0.15rem
}

.card[data-type="web"] p time:after {
	content: " ∙ ";
	word-spacing: normal
}

.card[data-type="web"] p em {
	font-style: normal;
	color: #FF557D
}

.card[data-type="web"] dl {
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;
	line-height: 1.5em;
	margin: .5rem 0 0 0;
	padding: 0
}

.card[data-type="web"] dl dt {
	display: inline;
	color: #8E8E92
}

.card[data-type="web"] dl dt:after {
	content: ": "
}

.card[data-type="web"] dl dd {
	display: inline;
	margin: 0 .75rem 0 0;
	padding: 0
}

.card[data-type="web"] ul {
	display: grid;
	margin-top: .75rem;
	column-gap: .75rem;
	row-gap: .75rem
}

@media screen and (min-width:760px) {
	.card[data-type="web"] ul {
		grid-template-columns: 1fr 1fr 1fr
	}
}

@media screen and (max-width:759px) {
	.card[data-type="web"] ul {
		grid-template-columns: 1fr 1fr
	}
}

.card[data-type="web"] ul li {
	overflow: hidden
}

.card[data-type="web"] ul li a {
	display: block;
	color: #000;
	background-color: #F0F0F0;
	padding: .5rem .5rem;
	border-radius: .2rem;
	text-align: center;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="web"] ul li a:visited {
	color: #FF0000
}

.card[data-type="web"]+.card[data-type="web"]+.card[data-type="web"] ul {
	display: none
}

.card[data-type="fact"] {
	padding: 0;
	color: #000;
	background-color: #FAFAFA
}

.card[data-type="fact"][data-subtype="entity"]>header span {
	color: #8E8E92
}

.card[data-type="fact"][data-subtype="set"]>header span {
	color: #8E8E92
}

.card[data-type="fact"][data-subtype="value"]>header span {
	color: #FF557D
}

.card[data-type="fact"][data-subtype="assertion"]>header span {
	color: #8E8E92
}

.card[data-type="fact"]>header {
	display: flex;
	cursor: pointer;
	padding: 0 .5rem;
	align-items: center
}

.card[data-type="fact"]>header>div {
	flex: 1 1 auto
}

.card[data-type="fact"]>header>div h2 {
	color: #000;
	font-size: 1.125rem;
	font-weight: normal;
	padding: 0;
	margin: .5rem 0 0 0
}

.card[data-type="fact"]>header>div span {
	display: block;
	font-size: .75rem;
	margin-top: .25rem;
	margin-bottom: .5rem
}

.card[data-type="fact"]>header a {
	flex: 0 0 auto;
	color: #626266;
	font-size: .75rem;
	margin-left: .5rem;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none
}

.card[data-type="fact"]>header svg {
	flex: 0 0 2rem;
	cursor: help;
	width: 2rem;
	height: 2rem;
	margin-left: .5rem;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none
}

.card[data-type="fact"]>div {
	padding: 0 .5rem;
	overflow: hidden
}

.card[data-type="fact"]>div>section {
	margin-bottom: .5rem;
	border-top: .0625rem solid #FAFAFA
}

.card[data-type="fact"]>div>section>header {
	margin-top: .5rem;
	display: flex;
	align-items: baseline
}

.card[data-type="fact"]>div>section>header h4 {
	flex: 0 0 auto;
	color: #000;
	font-size: .75rem;
	margin: 0 .5rem 0 0
}

.card[data-type="fact"]>div>section>header span {
	flex: 0 1 auto;
	font-size: .75rem;
	transform-origin: left;
	transform: scale(.833);
	color: #626266;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="fact"]>div>section:not([data-scope="property"])>div {
	display: flex;
	flex-flow: row wrap;
	overflow: hidden
}

.card[data-type="fact"]>div>section:not([data-scope="property"])>div>div {
	margin-top: .5rem
}

.card[data-type="fact"]>div>section:not([data-scope="property"])>div>div[data-span="cell"] {
	margin-right: .5rem;
	width: auto
}

.card[data-type="fact"]>div>section:not([data-scope="property"])>div>div[data-span="row"] {
	width: 100%
}

.card[data-type="fact"]>div>section:not([data-scope="property"])>div>div:last-child {
	margin-right: 0
}

.card[data-type="fact"]>div>section[data-scope="property"]>div {
	display: grid;
	grid-gap: .5rem .5rem;
	grid-auto-flow: row;
	margin-top: .5rem;
	overflow: hidden
}

@media screen and (min-width:760px) {
	.card[data-type="fact"]>div>section[data-scope="property"]>div {
		grid-template-columns: 1fr 1fr
	}
}

@media screen and (max-width:759px) {
	.card[data-type="fact"]>div>section[data-scope="property"]>div {
		grid-template-columns: 1fr
	}
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div {
	display: inline-flex;
	flex-flow: row nowrap;
	align-items: center;
	border-radius: .2rem;
	background-color: #F0F0F0;
	padding: .5rem .5rem
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div>a {
	text-decoration: none;
	padding: .5rem 0;
	transition: color .2s;
	color: #000
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div>a:hover {
	color: #000
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div>a:first-child {
	flex: 0 1 auto;
	margin-right: .5rem;
	display: inline-block;
	order: 0
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div:before {
	flex: 1 1 auto;
	content: "";
	order: 1
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div>article {
	order: 2
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div>a:last-child {
	flex: 0 0 auto;
	display: inline-block;
	margin-left: .5rem;
	align-self: stretch;
	height: auto;
	width: 1rem;
	order: 3;
	background-size: 1rem auto
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="cell"] {
	grid-column: auto / span 1
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="cell"]>* {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="row"] {
	flex-flow: row wrap;
	padding: 0
}

.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="row"]>a {
	display: none
}

@media screen and (min-width:760px) {
	.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="row"] {
		grid-column: 1 / span 2
	}
}

@media screen and (max-width:759px) {
	.card[data-type="fact"]>div>section[data-scope="property"]>div>div[data-span="row"] {
		grid-column: 1 / span 1
	}
}

.card[data-type="fact"]>div>section>div[data-clip=true]>div[data-extra=true] {
	display: none
}

.card[data-type="fact"]>div>section>footer {
	display: none;
	cursor: pointer;
	padding: .75rem
}

.card[data-type="fact"]>div>section>footer:after {
	transition: transform .2s
}

.card[data-type="fact"]>div>section[data-truncate] {
	margin-bottom: 0
}

.card[data-type="fact"]>div>section[data-truncate]>footer {
	display: block
}

.card[data-type="fact"]>div>section[data-truncate=peek]>footer:after {
	transform: rotate(0deg)
}

.card[data-type="fact"]>div>section[data-truncate=all]>footer:after {
	transform: rotate(-180deg)
}

.card[data-type="fact"][data-folded=true]>header h2,
.card[data-type="fact"][data-folded=true]>header span {
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="fact"][data-subtype=value]:first-child header>div>h2 {
	font-size: 2rem;
	font-weight: 200
}

.card[data-type="fact"][data-subtype=value] .fact>dl {
	display: none
}

.card[data-type="fact"][data-subtype=value] .fact>div>span {
	border-top: none
}

.card[data-type="suggest"] {
	background-color: transparent;
	padding: 0
}

.card[data-type="suggest"] ul {
	display: grid;
	column-gap: .75rem;
	row-gap: .75rem
}

@media screen and (min-width:760px) {
	.card[data-type="suggest"] ul {
		grid-template-columns: 1fr 1fr 1fr
	}
}

@media screen and (max-width:759px) {
	.card[data-type="suggest"] ul {
		grid-template-columns: 1fr 1fr
	}

	.card[data-type="suggest"] ul li:nth-child(9) {
		display: none
	}
}

.card[data-type="suggest"] ul li {
	overflow: hidden
}

.card[data-type="suggest"] ul li a {
	display: block;
	font-size: .875rem;
	color: #000;
	background-color: #FAFAFA;
	padding: .5rem .5rem;
	border-radius: .2rem;
	text-align: left;
	text-decoration: none;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.card[data-type="suggest"] ul li a:visited {
	color: #FF0000
}

.fact {
	display: inline-flex;
	width: auto;
	border-radius: .2rem;
	text-align: left;
	flex-flow: column nowrap;
	overflow: hidden
}

.fact>dl {
	cursor: context-menu;
	display: flex;
	position: relative;
	align-items: start;
	justify-content: space-between;
	margin: 0;
	padding: 0
}

.fact>dl>dd {
	flex: 1 1 auto;
	margin: 0;
	padding: .5rem .5rem;
	overflow-wrap: break-word;
	word-wrap: break-word;
	-ms-word-break: break-all;
	word-break: break-all;
	word-break: break-word;
	-ms-hyphens: auto;
	-moz-hyphens: auto;
	-webkit-hyphens: auto;
	hyphens: auto
}

.fact>dl dd,
.fact>dl dd:before {
	display: none
}

.fact>dl[data-answer~="subject"]>dd[data-field=subject] {
	display: block
}

.fact>dl[data-answer~="predicate"]>dd[data-field=predicate] {
	display: block
}

.fact>dl[data-answer~="object"]>dd[data-field=object] {
	display: block
}

.fact>div {
	display: none
}

.fact>dl[data-color="green"]:after {
	background-color: #40AE36
}

.fact>dl[data-color="green"] dd {
	border-color: #40AE36;
	background-color: rgba(64, 174, 54, 0.3)
}

.fact>dl[data-color="yellow"]:after {
	background-color: #F5980C
}

.fact>dl[data-color="yellow"] dd {
	border-color: #F5980C;
	background-color: rgba(245, 152, 12, 0.3)
}

.fact>dl[data-color="red"]:after {
	background-color: #F5473E
}

.fact>dl[data-color="red"] dd {
	border-color: #F5473E;
	background-color: rgba(245, 71, 62, 0.3)
}

.fact[data-render=cell] dd {
	border-radius: .2rem;
	padding: .5rem .5rem;
	padding-bottom: .4375rem;
	border-bottom-style: solid;
	border-bottom-width: .125rem
}

section[data-scope=description] .fact[data-render=cell] {
	border-radius: 0;
	flex-flow: row nowrap;
	align-items: center
}

section[data-scope=description] .fact[data-render=cell]:before {
	content: "“";
	color: #626266
}

section[data-scope=description] .fact[data-render=cell]:after {
	content: "”";
	color: #626266
}

section[data-scope=description] .fact[data-render=cell] dd {
	border-radius: 0;
	background-color: transparent;
	padding: .25rem .25rem
}

section[data-scope=tag] .fact[data-render=cell] {
	border-radius: .4rem .2rem .4rem .2rem
}

section[data-scope=tag] .fact[data-render=cell] dd {
	border-bottom-style: none;
	padding-bottom: .5rem
}

section[data-scope=tag] .fact[data-render=cell]>dl:after {
	content: "";
	position: absolute;
	margin: 0;
	width: .25rem;
	height: .25rem;
	border-radius: .125rem;
	top: .1875rem;
	right: .1875rem
}

.fact[data-render=tuple] {
	display: flex;
	width: 100%
}

.fact[data-render=tuple]>dl {
	cursor: default;
	background-color: #F0F0F0
}

.fact[data-render=tuple]>dl>dd {
	display: block;
	background-color: transparent
}

.fact[data-render=tuple]>dl>dd:before {
	display: block;
	color: #8E8E92;
	content: attr(data-field);
	font-size: .75rem;
	text-transform: uppercase;
	transform-origin: top left;
	transform: scale(.667);
	white-space: nowrap;
	line-height: 1;
	padding-bottom: .1665rem
}

.fact[data-render=tuple]>dl:after {
	content: attr(data-confidence);
	border-radius: .2rem;
	flex: 0 0 2rem;
	line-height: 2rem;
	margin: .5rem .5rem;
	width: 2rem;
	height: 2rem;
	font-size: .875rem;
	color: #000;
	text-align: center;
	cursor: help;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none
}

.fact[data-render=tuple]>div {
	display: block
}

.fact>div {
	color: #8E8E92;
	background-color: #F0F0F0;
	font-size: .75rem;
	padding: 0 .5rem;
	overflow: hidden
}

.fact>div>span {
	display: block;
	padding-top: .5rem;
	border-top: .0625rem solid #F0F0F0;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.fact>div ul>li,
.fact>div ol>li {
	margin-top: .5rem
}

.fact>div ul>li {
	padding: 0 .5rem;
	border-left: .125rem solid #626266
}

.fact>div ul>li+li {
	margin-top: .75rem
}

.fact>div ul>li:hover {
	border-left: .125rem solid #000
}

.fact>div ol>li>a {
	text-decoration: none
}

.fact>div ol>li>a h5 {
	font-size: .875rem;
	font-weight: normal;
	margin: 0;
	color: #000;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.fact>div ol>li>a:visited h5 {
	color: #FF0000
}

.fact>div ol>li>a div {
	display: flex;
	align-items: center;
	flex-wrap: nowrap;
	margin-top: .25rem
}

.fact>div ol>li>a div cite {
	flex: 0 1 auto;
	padding-right: .25rem;
	font-size: .75rem;
	font-style: normal;
	color: #8E8E92;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.fact>div ol>li>a div time {
	flex: 0 0 auto;
	color: #8E8E92;
	font-size: .75rem;
	font-style: normal;
	word-spacing: -0.15rem
}

.fact>div ol>li>a div time:before {
	content: " ∙ ";
	word-spacing: normal
}

.fact>div>div {
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	margin-top: .5rem;
	border-top: .0625rem solid #F0F0F0;
	padding: .5rem 0
}

.fact>div>div>span {
	flex: 0 5 auto;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

.fact>div>div>a {
	flex: 0 1 auto;
	display: inline-block;
	font-size: .8125rem;
	margin-left: .5rem;
	color: #000;
	background-color: rgba(20, 162, 245, 0.3);
	border-bottom-color: #14A2F5;
	text-decoration: none;
	border-radius: .2rem;
	padding: .5rem .5rem;
	padding-bottom: .4375rem;
	border-bottom-style: solid;
	border-bottom-width: .125rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#bibliography {
	margin-left: 4rem;
	color: #000
}

#bibliography h4 {
	font-size: .8125rem;
	font-weight: normal;
	color: #8E8E92;
	margin: .5rem 0 0 .5rem;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#bibliography ol li {
	display: flex;
	margin-top: .75rem;
	border-radius: .2rem;
	background: linear-gradient(90deg, #FAFAFA, rgba(44, 44, 48, 0));
	transition: background .2s
}

#bibliography ol li a {
	flex: 1 1 auto;
	padding: .5rem .5rem;
	text-decoration: none
}

#bibliography ol li a h5 {
	font-size: .8125rem;
	font-weight: normal;
	color: #000;
	margin: 0;
	transition: color .2s;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#bibliography ol li a div {
	display: flex;
	font-size: .75rem;
	margin-top: .25rem
}

#bibliography ol li a div cite {
	flex: 0 1 auto;
	font-style: normal;
	color: #8E8E92;
	padding-right: .25rem;
	transition: color .2s;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis
}

#bibliography ol li a div time {
	flex: 0 0 auto;
	color: #8E8E92;
	word-spacing: -0.15rem
}

#bibliography ol li a div time:before {
	content: " ∙ ";
	word-spacing: normal
}

#bibliography ol li:hover {
	background: #FAFAFA;
	box-shadow: 0 0 0 2px #FAFAFA
}

#bibliography ol li:hover h5 {
	color: #000
}

#bibliography ol li:hover cite {
	color: #8E8E92
}

.icon {
	background-position: center;
	background-repeat: no-repeat
}

[data-decoration="more"]:after {
	background-position: center;
	background-repeat: no-repeat;
	display: block;
	content: "";
	margin-top: .25rem;
	height: .375rem;
	background-size: auto .375rem;
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 150'%3E%3Cg fill='%238E8E92'%3E%3Cpath d='M160 150 L160 120 0 0 0 30 Z'/%3E%3Cpath d='M160 150 L160 120 320 0 320 30 Z'/%3E%3C/g%3E%3C/svg%3E")
}

[data-decoration="search"]:before {
	background-position: center;
	background-repeat: no-repeat;
	display: inline-block;
	content: "";
	margin-right: .5em;
	width: .7em;
	height: .7em;
	background-size: auto .7em;
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg stroke-width='40' stroke='%23000' fill='none'%3E%3Cpath d='M243 243 L380 380'/%3E%3Ccircle cx='150' cy='150' r='130'/%3E%3C/g%3E%3C/svg%3E")
}

.icon-clear {
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg fill='%230A0A0F'%3E%3Cpath d='M35 82.5 L317.5 365 365 318 82 35.5 Z'/%3E%3Cpath d='M82 365.5 L365 82.5 318 35.5 35 318 Z'/%3E%3C/g%3E%3C/svg%3E")
}

.icon-submit {
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg fill='%23000'%3E%3Cpath d='M0 266.5 L400 266.5 400 200 0 200 Z'/%3E%3Cpath d='M211.5 105.5 L353 247 400 200 258.5 58.5 Z'/%3E%3C/g%3E%3C/svg%3E")
}

.icon-dots {
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 150 30'%3E%3Cg fill='%238E8E92'%3E%3Ccircle cx='15' cy='15' r='15'/%3E%3Ccircle cx='75' cy='15' r='15'/%3E%3Ccircle cx='135' cy='15' r='15'/%3E%3C/g%3E%3C/svg%3E")
}

.icon-peaklabs {
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 822 88'%3E%3Cg fill='%23000'%3E%3Cpath d='m0 44h10v-28a6 6 0 0 1 6-6h84a6 6 0 0 1 0 12h-61a5 5 0 0 0 0 10h61a16 16 0 0 0 0-32h-84a16 16 0 0 0-16 16z'/%3E%3Cpath d='m144 44h89a5 5 0 0 0 0-10h-89a12 12 0 0 1 0-24h80.5a3.5 3.5 0 0 1 0 7h-63.5a5 5 0 0 0 0 10h63.5a13.5 13.5 0 0 0 0-27h-80.5a22 22 0 0 0 0 44z'/%3E%3Cpath d='m366 88h85a5 5 0 0 0 0-10h-85a6 6 0 0 1-6-6v-56a16 16 0 0 0-16-16h-78a22 22 0 0 0 0 44h55a5 5 0 0 0 0-10h-55a12 12 0 0 1 0-24h78a6 6 0 0 1 6 6v56a16 16 0 0 0 16 16z'/%3E%3Cpath d='m366 0v39a5 5 0 0 0 10 0v-12h80a6 6 0 0 1 6 6v33a22 22 0 0 0 22 22h55a5 5 0 0 0 0-10h-55a12 12 0 0 1 0-24h78a6 6 0 0 1 6 6v28h10v-28a16 16 0 0 0-16-16h-78a22 22 0 0 0-12 3.5v-14.5a16 16 0 0 0-16-16h-24a16 16 0 0 0 1-6v-6a5 5 0 0 0-10 0v6a6 6 0 0 1-6 6h-41v-17z'/%3E%3Cpath d='m584 44v28a16 16 0 0 0 16 16h84a16 16 0 0 0 0-32h-61a5 5 0 0 0 0 10h61a6 6 0 0 1 0 12h-84a6 6 0 0 1-6-6v-28z'/%3E%3Cpath d='m711 88h42a16 16 0 0 0 16-16v-12a6 6 0 0 1 6-6h42a5 5 0 0 0 0-10h-42a16 16 0 0 0-16 16v12a6 6 0 0 1-6 6h-42a5 5 0 0 0 0 10z'/%3E%3C/g%3E%3C/svg%3E")
}

.icon-magi {
	background-image: url("data:image/svg+xml;charset=utf8,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 500 188'%3E%3Cpath d='M458.9 179.3 L458.9 171.1 484.8 171.1 484.8 27.5 458.9 27.5 458.9 19.2 499.1 19.2 499.1 179.3 Z M436.6 1.7 C438.1 1.7 439.5 2 440.8 2.5 442.1 3 443.3 3.6 444.2 4.5 445.2 5.3 446 6.3 446.6 7.5 447.1 8.6 447.4 9.8 447.4 11.1 447.4 12.4 447.1 13.6 446.6 14.8 446 15.9 445.2 16.9 444.2 17.8 443.3 18.6 442.1 19.3 440.8 19.8 439.5 20.3 438.1 20.5 436.6 20.5 435.2 20.5 433.8 20.3 432.5 19.8 431.2 19.3 430.1 18.6 429.1 17.8 428.1 16.9 427.4 15.9 426.8 14.8 426.2 13.6 425.9 12.4 425.9 11.1 425.9 9.8 426.2 8.6 426.8 7.5 427.4 6.3 428.1 5.3 429.1 4.5 430.1 3.6 431.2 3 432.5 2.5 433.8 2 435.2 1.7 436.6 1.7 Z M427.5 53.5 L440.7 48.1 446.1 48.1 446.1 144.5 427.5 144.5 Z M374.4 19.2 L414.7 19.2 414.7 27.5 388.8 27.5 388.8 171.1 414.7 171.1 414.7 179.3 374.4 179.3 Z M352.4 55 L352.4 62.8 334.5 62.8 C336.4 65.4 337.9 68.3 339 71.5 340.1 74.7 340.7 77.8 340.7 81 340.7 85.9 339.6 90.4 337.4 94.4 335.2 98.4 332.2 101.9 328.3 104.8 324.5 107.7 319.9 109.9 314.5 111.5 309.1 113.1 303.2 113.9 296.8 113.9 294.5 113.9 292 113.7 289.5 113.2 287.1 112.8 284.9 112.3 283.1 111.8 281.3 113.2 279.7 114.9 278.5 116.9 277.3 118.8 276.7 120.7 276.7 122.7 276.7 124.6 277.7 126.1 279.8 127.3 281.9 128.5 284.8 129.1 288.5 129.2 L323.5 130.7 C329.1 131 333.7 131.6 337.4 132.7 341.2 133.8 344.1 135.2 346.4 137 348.6 138.8 350.2 141 351.1 143.5 352 146 352.4 148.8 352.4 151.8 352.4 157.3 351.2 162.3 348.6 166.8 346.1 171.2 342.4 175 337.5 178.2 332.7 181.3 326.8 183.7 319.9 185.4 313 187.1 305.2 188 296.4 188 280.9 188 269.2 186.2 261.5 182.7 253.8 179.2 250 174.5 250 168.7 250 166.1 250.6 163.6 251.9 161.2 253.2 158.8 254.8 156.5 256.8 154.3 258.9 152.1 261.1 150 263.6 148 266 146 268.5 144 270.9 142.2 269.1 141.6 267.5 141 266 140.2 264.5 139.5 263.2 138.6 262.1 137.6 261 136.7 260.2 135.6 259.5 134.5 258.9 133.3 258.6 132.1 258.6 130.7 258.6 128.8 259.1 126.8 260.1 124.8 261.1 122.8 262.4 120.8 264.2 119 265.9 117.1 268 115.4 270.3 113.8 272.6 112.3 275.1 111 277.7 110 271.3 107.3 266.4 103.5 262.8 98.7 259.2 93.9 257.4 88.3 257.4 82 257.4 77.4 258.5 73 260.6 68.9 262.8 64.8 265.7 61.2 269.4 58.1 273.1 55 277.5 52.6 282.6 50.8 287.7 49 293.1 48.1 298.9 48.1 301.7 48.1 304.5 48.3 307.3 48.7 310 49.1 312.6 49.6 314.9 50.2 317.3 50.8 319.4 51.5 321.3 52.3 323.1 53.2 324.5 54 325.5 55 Z M276.7 143.7 C275.3 144.7 274 145.9 273 147.2 271.9 148.5 271 149.8 270.3 151.3 269.6 152.7 269 154.1 268.6 155.6 268.2 157 268.1 158.4 268.1 159.7 268.1 161.8 268.8 163.8 270.3 165.7 271.8 167.7 274 169.4 277 170.8 279.9 172.3 283.6 173.5 288.1 174.3 292.5 175.2 297.7 175.7 303.7 175.7 309.9 175.7 315.5 175.2 320.5 174.2 325.5 173.2 329.7 171.8 333.2 170.2 336.6 168.6 339.3 166.7 341.1 164.7 342.9 162.7 343.8 160.7 343.8 158.6 343.8 154.4 341.7 151.3 337.5 149.4 333.3 147.4 327.6 146.5 320.4 146.5 315.8 146.5 311.3 146.4 306.6 146.2 302 146 297.7 145.7 293.7 145.4 289.7 145.1 286.1 144.8 283.1 144.5 280.1 144.2 278 143.9 276.7 143.7 Z M300 108.9 C302.7 108.9 305.2 108.3 307.7 107.1 310.2 105.9 312.3 104.3 314.2 102.2 316.1 100.1 317.6 97.6 318.7 94.8 319.8 92 320.4 89 320.4 85.7 320.4 81.1 319.7 76.8 318.5 72.9 317.2 68.9 315.5 65.5 313.3 62.5 311.2 59.6 308.6 57.3 305.8 55.6 302.9 54 299.8 53.1 296.6 53.1 293.5 53.1 290.7 53.8 288.4 55.1 286.1 56.4 284.2 58.2 282.7 60.5 281.2 62.8 280.1 65.5 279.4 68.6 278.7 71.7 278.3 75 278.3 78.6 278.3 82.9 278.9 86.9 279.9 90.6 281 94.3 282.5 97.5 284.4 100.2 286.3 102.9 288.5 105.1 291.2 106.6 293.9 108.2 296.8 108.9 300 108.9 Z M233.7 144.5 L214.9 144.5 214.9 131.5 C212.7 133.2 210.5 135 208.3 136.7 206.2 138.5 203.9 140.1 201.4 141.6 198.9 143 196.1 144.2 193.1 145.1 190.1 146 186.6 146.5 182.6 146.5 178.9 146.5 175.6 145.9 172.6 144.7 169.6 143.5 167.1 141.8 165 139.7 162.9 137.6 161.2 135.1 160.1 132.2 159 129.4 158.5 126.3 158.5 122.9 158.5 118.9 159.3 115.2 160.9 112 162.5 108.7 164.7 105.8 167.5 103.2 170.2 100.7 173.5 98.4 177.2 96.4 180.9 94.4 184.9 92.6 189 91 193.2 89.4 197.5 88 201.9 86.8 206.3 85.6 210.7 84.4 214.9 83.4 L214.9 77.5 C214.9 73.2 214.5 69.6 213.6 66.6 212.8 63.7 211.5 61.3 210 59.5 208.4 57.6 206.5 56.3 204.2 55.5 201.9 54.8 199.4 54.4 196.6 54.4 193.4 54.4 190.9 54.8 188.9 55.6 186.9 56.4 185.3 57.5 184.2 58.8 183 60.2 182.2 61.7 181.8 63.5 181.4 65.2 181.2 66.9 181.2 68.7 181.2 70.3 181.1 71.9 180.8 73.4 180.6 75 180.1 76.3 179.4 77.4 178.7 78.6 177.7 79.5 176.5 80.2 175.3 80.9 173.8 81.3 171.9 81.3 170.4 81.3 169.1 81 167.9 80.4 166.7 79.9 165.7 79.1 164.8 78.1 163.9 77.1 163.2 75.9 162.8 74.6 162.3 73.2 162.1 71.8 162.1 70.2 162.1 67.1 163.1 64.2 165.1 61.5 167.2 58.8 169.9 56.5 173.4 54.5 176.9 52.5 180.9 51 185.5 49.8 190.2 48.7 195 48.1 200.1 48.1 206.3 48.1 211.6 48.7 215.8 49.9 220.1 51.1 223.6 52.8 226.2 55 228.9 57.1 230.8 59.8 231.9 62.9 233.1 66 233.7 69.4 233.7 73.2 Z M214.9 89.4 C212.2 90.3 209.4 91.3 206.5 92.4 203.6 93.5 200.7 94.8 198 96.2 195.2 97.5 192.5 99 190 100.6 187.5 102.2 185.3 104 183.4 105.8 181.5 107.6 180 109.5 178.8 111.6 177.7 113.6 177.2 115.8 177.2 118 177.2 120.3 177.6 122.5 178.5 124.5 179.3 126.6 180.4 128.4 181.8 130 183.2 131.5 184.9 132.8 186.7 133.7 188.6 134.6 190.5 135 192.5 135 194.6 135 196.6 134.8 198.5 134.2 200.4 133.7 202.2 132.9 204 132 205.8 131 207.6 129.9 209.4 128.7 211.2 127.4 213 126.1 214.9 124.7 Z M0.8 22 L21.8 22 69.4 116 70.4 116 117.1 22 137.8 22 137.8 144.5 117.1 144.5 117.1 44.2 116.4 44.2 66.3 144.5 62 144.5 11.2 44.9 9.8 44.9 9.8 144.5 0.8 144.5 Z' fill='%23000'/%3E%3C/svg%3E")
}
      `
    },
  ]);
})();
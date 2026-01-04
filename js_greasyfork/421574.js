// ==UserScript==
// @name asidenav.css 可拖拽悬浮弹性菜单
// @namespace weirick.github.io
// @version 0.2.2
// @description 可拖拽悬浮弹性菜单
// @author wxc
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/421574/asidenavcss%20%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%82%AC%E6%B5%AE%E5%BC%B9%E6%80%A7%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/421574/asidenavcss%20%E5%8F%AF%E6%8B%96%E6%8B%BD%E6%82%AC%E6%B5%AE%E5%BC%B9%E6%80%A7%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
let css = `html {
	-ms-text-size-adjust: 100%;
	-webkit-text-size-adjust: 100%;
	-webkit-font-smoothing: antialiased;
	font-size: 62.5%
}
body {
	font-family: "Helvetica Neue", Helvetica, "Microsoft YaHei", Arial, sans-serif;
	margin: 0;
	font-size: 1.6rem;
	background-color: #f9f9f9;
	color: #4E546B
}


.aside-nav {
	position: fixed;
	right: -50px;
	top: 350px;
	width: 260px;
	height: 260px;
	-webkit-filter: url(#goo);
	filter: url(#goo);
	-ms-user-select: none;
	-moz-user-select: none;
	-webkit-user-select: none;
	user-select: none;
	opacity: .75
}
.aside-nav.no-filter {
	-webkit-filter: none;
	filter: none
}
.aside-nav .aside-menu {
	position: absolute;
	width: 70px;
	height: 70px;
	-webkit-border-radius: 50%;
	border-radius: 50%;
	background: #f34444;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	text-align: center;
	line-height: 70px;
	color: #fff;
	font-size: 20px;
	z-index: 1;
	cursor: move
}
.aside-nav .menu-item {
	position: absolute;
	width: 60px;
	height: 60px;
	background-color: #FF7676;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	margin: auto;
	line-height: 60px;
	text-align: center;
	-webkit-border-radius: 50%;
	border-radius: 50%;
	text-decoration: none;
	color: #fff;
	-webkit-transition: background .5s, -webkit-transform .6s;
	transition: background .5s, -webkit-transform .6s;
	-moz-transition: transform .6s, background .5s, -moz-transform .6s;
	transition: transform .6s, background .5s;
	transition: transform .6s, background .5s, -webkit-transform .6s, -moz-transform .6s;
	font-size: 14px;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box
}
.aside-nav .menu-item:hover {
	background: #A9C734;
}
.aside-nav .menu-line {
	line-height: 20px;
	padding-top: 10px;
}
.aside-nav:hover {
	opacity: 1;
}
.aside-nav:hover .aside-menu {
	-webkit-animation: jello 1s;
	-moz-animation: jello 1s;
	animation: jello 1s
}
.aside-nav:hover .menu-first {
	-webkit-transform: translate3d(0, -135%, 0);
	-moz-transform: translate3d(0, -135%, 0);
	transform: translate3d(0, -135%, 0)
}
.aside-nav:hover .menu-second {
	-webkit-transform: translate3d(-120%, -70%, 0);
	-moz-transform: translate3d(-120%, -70%, 0);
	transform: translate3d(-120%, -70%, 0)
}
.aside-nav:hover .menu-third {
	-webkit-transform: translate3d(-120%, 70%, 0);
	-moz-transform: translate3d(-120%, 70%, 0);
	transform: translate3d(-120%, 70%, 0)
}
.aside-nav:hover .menu-fourth {
	-webkit-transform: translate3d(0, 135%, 0);
	-moz-transform: translate3d(0, 135%, 0);
	transform: translate3d(0, 135%, 0)
}
@-webkit-keyframes jello {
from, 11.1%, to {
-webkit-transform:none;
transform:none
}
22.2% {
-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);
transform:skewX(-12.5deg) skewY(-12.5deg)
}
33.3% {
-webkit-transform:skewX(6.25deg) skewY(6.25deg);
transform:skewX(6.25deg) skewY(6.25deg)
}
44.4% {
-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);
transform:skewX(-3.125deg) skewY(-3.125deg)
}
55.5% {
-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);
transform:skewX(1.5625deg) skewY(1.5625deg)
}
66.6% {
-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);
transform:skewX(-.78125deg) skewY(-.78125deg)
}
77.7% {
-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);
transform:skewX(0.390625deg) skewY(0.390625deg)
}
88.8% {
-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);
transform:skewX(-.1953125deg) skewY(-.1953125deg)
}
}
@-moz-keyframes jello {
from, 11.1%, to {
-moz-transform:none;
transform:none
}
22.2% {
-moz-transform:skewX(-12.5deg) skewY(-12.5deg);
transform:skewX(-12.5deg) skewY(-12.5deg)
}
33.3% {
-moz-transform:skewX(6.25deg) skewY(6.25deg);
transform:skewX(6.25deg) skewY(6.25deg)
}
44.4% {
-moz-transform:skewX(-3.125deg) skewY(-3.125deg);
transform:skewX(-3.125deg) skewY(-3.125deg)
}
55.5% {
-moz-transform:skewX(1.5625deg) skewY(1.5625deg);
transform:skewX(1.5625deg) skewY(1.5625deg)
}
66.6% {
-moz-transform:skewX(-.78125deg) skewY(-.78125deg);
transform:skewX(-.78125deg) skewY(-.78125deg)
}
77.7% {
-moz-transform:skewX(0.390625deg) skewY(0.390625deg);
transform:skewX(0.390625deg) skewY(0.390625deg)
}
88.8% {
-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);
transform:skewX(-.1953125deg) skewY(-.1953125deg)
}
}
@keyframes jello {
from, 11.1%, to {
-webkit-transform:none;
-moz-transform:none;
transform:none
}
22.2% {
-webkit-transform:skewX(-12.5deg) skewY(-12.5deg);
-moz-transform:skewX(-12.5deg) skewY(-12.5deg);
transform:skewX(-12.5deg) skewY(-12.5deg)
}
33.3% {
-webkit-transform:skewX(6.25deg) skewY(6.25deg);
-moz-transform:skewX(6.25deg) skewY(6.25deg);
transform:skewX(6.25deg) skewY(6.25deg)
}
44.4% {
-webkit-transform:skewX(-3.125deg) skewY(-3.125deg);
-moz-transform:skewX(-3.125deg) skewY(-3.125deg);
transform:skewX(-3.125deg) skewY(-3.125deg)
}
55.5% {
-webkit-transform:skewX(1.5625deg) skewY(1.5625deg);
-moz-transform:skewX(1.5625deg) skewY(1.5625deg);
transform:skewX(1.5625deg) skewY(1.5625deg)
}
66.6% {
-webkit-transform:skewX(-.78125deg) skewY(-.78125deg);
-moz-transform:skewX(-.78125deg) skewY(-.78125deg);
transform:skewX(-.78125deg) skewY(-.78125deg)
}
77.7% {
-webkit-transform:skewX(0.390625deg) skewY(0.390625deg);
-moz-transform:skewX(0.390625deg) skewY(0.390625deg);
transform:skewX(0.390625deg) skewY(0.390625deg)
}
88.8% {
-webkit-transform:skewX(-.1953125deg) skewY(-.1953125deg);
-moz-transform:skewX(-.1953125deg) skewY(-.1953125deg);
transform:skewX(-.1953125deg) skewY(-.1953125deg)
}
}

.animated {
	-webkit-animation-duration: 1s;
	-moz-animation-duration: 1s;
	animation-duration: 1s;
	-webkit-animation-fill-mode: both;
	-moz-animation-fill-mode: both;
	animation-fill-mode: both
}

@-webkit-keyframes bounceInUp {
from, 60%, 75%, 90%, to {
-webkit-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);
animation-timing-function:cubic-bezier(0.215, .61, .355, 1)
}
from {
	opacity: 0;
	-webkit-transform: translate3d(0, 800px, 0);
	transform: translate3d(0, 800px, 0)
}
60% {
opacity:1;
-webkit-transform:translate3d(0, -20px, 0);
transform:translate3d(0, -20px, 0)
}
75% {
-webkit-transform:translate3d(0, 10px, 0);
transform:translate3d(0, 10px, 0)
}
90% {
-webkit-transform:translate3d(0, -5px, 0);
transform:translate3d(0, -5px, 0)
}
to {
	-webkit-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0)
}
}
@-moz-keyframes bounceInUp {
from, 60%, 75%, 90%, to {
-moz-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);
animation-timing-function:cubic-bezier(0.215, .61, .355, 1)
}
from {
	opacity: 0;
	-moz-transform: translate3d(0, 800px, 0);
	transform: translate3d(0, 800px, 0)
}
60% {
opacity:1;
-moz-transform:translate3d(0, -20px, 0);
transform:translate3d(0, -20px, 0)
}
75% {
-moz-transform:translate3d(0, 10px, 0);
transform:translate3d(0, 10px, 0)
}
90% {
-moz-transform:translate3d(0, -5px, 0);
transform:translate3d(0, -5px, 0)
}
to {
	-moz-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0)
}
}
@keyframes bounceInUp {
from, 60%, 75%, 90%, to {
-webkit-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);
-moz-animation-timing-function:cubic-bezier(0.215, .61, .355, 1);
animation-timing-function:cubic-bezier(0.215, .61, .355, 1)
}
from {
	opacity: 0;
	-webkit-transform: translate3d(0, 800px, 0);
	-moz-transform: translate3d(0, 800px, 0);
	transform: translate3d(0, 800px, 0)
}
60% {
opacity:1;
-webkit-transform:translate3d(0, -20px, 0);
-moz-transform:translate3d(0, -20px, 0);
transform:translate3d(0, -20px, 0)
}
75% {
-webkit-transform:translate3d(0, 10px, 0);
-moz-transform:translate3d(0, 10px, 0);
transform:translate3d(0, 10px, 0)
}
90% {
-webkit-transform:translate3d(0, -5px, 0);
-moz-transform:translate3d(0, -5px, 0);
transform:translate3d(0, -5px, 0)
}
to {
	-webkit-transform: translate3d(0, 0, 0);
	-moz-transform: translate3d(0, 0, 0);
	transform: translate3d(0, 0, 0)
}
}
.bounceInUp {
	-webkit-animation-name: bounceInUp;
	-moz-animation-name: bounceInUp;
	animation-name: bounceInUp;
	-webkit-animation-delay: 1s;
	-moz-animation-delay: 1s;
	animation-delay: 1s
}

@media screen and (max-width:640px) {
.aside-nav {display: none!important}
}
@media screen and (min-width:641px) and (max-width:1367px) {
.aside-nav {top: 120px}
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

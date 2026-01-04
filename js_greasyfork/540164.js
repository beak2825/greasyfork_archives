// ==UserScript==
// @name         LeetCode Dark Fix
// @version      1.0
// @author       udontur
// @homepage	   https://github.com/udontur/leetcode-dark-fix
// @namespace    http://tampermonkey.net/
// @run-at       document-start
// @include      https://leetcode.com/
// @include      https://leetcode.com/explore*
// @include      https://leetcode.com/profile*
// @description  LeetCode Dark Fix is a userscript that brings dark mode to LeetCode’s home, explore, and settings pages since the official dark mode doesn’t cover these pages yet.
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540164/LeetCode%20Dark%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/540164/LeetCode%20Dark%20Fix.meta.js
// ==/UserScript==

(function() {
let css = `
/* Colors */
:root {
  --background-back: var(--dark-gray-10) !important;
  --background-front: var(--dark-gray-20) !important;
  --link: var(--dark-blue-50) !important;
  --text: var(--dark-gray-80) !important;
  --text-desc: var(--dark-gray-70) !important;
  --text-alt: var(--dark-gray-60) !important;
  --button: var(--dark-gray-40) !important;
}



/* General */
body {
  color: var(--text) !important;
  background-color: var(--background-back) !important;
}

p {
  color: var(--text-desc) !important;
}

a {
  color: var(--text) !important;
}

span {
  color: var(--text-desc) !important;
}

#leetcode-navbar {
  background-color: var(--background-front) !important;
}

.block {
  border-radius: 8px !important;
}

.rounded {
  border-radius: 9px !important;
}

#leetcode-navbar>div>ul>li>a {
  color: var(--text-desc) !important;
}

rect {
  fill: var(--button) !important;
}

.text-text-secondary {
  color: var(--text) !important;
}

.link {
  color: #1890ff !important;
}

footer {
  background-color: var(--background-back) !important;
}

footer>div {
  border-top: 1px solid var(--button) !important;
}

svg {
  color: var(--text) !important;
}

svg>path:nth-child(3) {
  fill: var(--text) !important;
}

#leetcode-navbar>div>ul>li>a:hover {
  color: var(--text) !important;
}

#subscribe>a>span>span {
  background-color: #423726 !important;
  color: #FFA116 !important;
}

.text-brand-orange {
  color: #FFA116 !important;
}

#web-user-menu {
  color: var(--text) !important;
  background-color: var(--background-front) !important;
}

#web-user-menu>div>div {
  border-radius: 8px !important;
}

.popover {
  background-color: var(--background-front) !important;
}

.icon {
  text-shadow: none !important;
}

.flex {
  background-color: var(--background-front) !important;
}

.ant-dropdown-menu-item>div>div {
  border-bottom: 1px solid var(--button) !important;
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>div {
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>li {
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>a {
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>li:hover {
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>a:hover {
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item-active {
  background: none !important;
}

.ant-dropdown-menu {
  background: var(--background-front) !important;
}

.ant-dropdown {
  background: var(--background-front) !important;
}

.ant-dropdown>div {
  background: var(--background-front) !important;
}

.ant-dropdown>div>div {
  border-top: 1px solid var(--button) !important;
  background: var(--background-front) !important;
}

.ant-dropdown-menu-item>div>div>div {
  color: var(--text) !important;
}

.ant-dropdown-menu-item>div>div>div>a {
  color: var(--link) !important;
}



/* Home Page */
.media-heading {
  color: var(--text) !important;
}

.description {
  color: var(--text-desc) !important;
}

.side-block {
  border-bottom: 1px solid var(--button) !important;
}

.storyboard>div {
  border-top: 0px solid !important;
}

.storyboard>:not(.msg) {
  margin-top: 16px !important;
}

hr,
.side-bar {
  border-top: 1px solid var(--button) !important;
}

.side-block-btn {
  background-color: var(--background-front) !important;
  color: var(--text) !important;
  border-color: var(--button) !important;
}

.storyboard {
  border-right: 1px solid var(--button) !important;
}

.problem-category .problem-category-info a {
  color: var(--text) !important;
}

.problem-category .problem-category-info a:hover {
  background-color: var(--button) !important;
}



/* Explore Page */
.showcase-row::before {
  background: transparent !important;
}

.bot-base {
  background-color: var(--background-front) !important;
  border-radius: 0px 0px 14px 14px !important;
}

.explore-card {
  border-radius: 16px !important;
}

.big-number {
  color: var(--text) !important;
}

#explore-app {
  background-color: var(--background-back) !important;
}

.explore-heading>.description {
  color: var(--text) !important
}

.doughnut-chart-base {
  border-radius: 50% !important;
  background-color: var(--dark-gray-30) !important;
}

.explore-home-showcase .explore-index-showcase-base .showcase-row::after {
  background: none !important;
}

.scroll-btn:hover {
  opacity: 0.5 !important;
}

.scroll-btn {
  opacity: 0.3 !important;
}



/* Settings Page */
body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div>div:nth-child(1) {
  font-size: 20px !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div>div:not(:nth-child(1))>div>div>div>div:nth-child(1) {
  color: var(--text) !important;
  font-weight: bold !important;
}

.previous>a {
  background-color: var(--background-front) !important;
  border-color: var(--button) !important;
}

.next>a {
  background-color: var(--background-front) !important;
  border-color: var(--button) !important;
}

.previous>span {
  background-color: var(--background-front) !important;
  border-color: var(--button) !important;
}

.next>span {
  background-color: var(--background-front) !important;
  border-color: var(--button) !important;
}

.more-btn {
  background-color: var(--background-front) !important;
  border-color: var(--button) !important;
}

.fa-circle {
  background: var(--button) !important;
  color: var(--button) !important;
  border-radius: 50% !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div {
  background-color: var(--background-front) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(odd) {
  background: none !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div>div>div>div>div:nth-child(2) {
  color: var(--text-desc) !important;
}

.Select-value>span {
  color: var(--button) !important;
}

.Select-placeholder {
  color: var(--dark-gray-50) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div>div>div>div>div:nth-child(3) {
  color: var(--link) !important;
  background-color: transparent !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div>div>div>div>div:nth-child(3)>span {
  color: var(--link) !important;
  background-color: transparent !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div>div {
  border-bottom: 1px solid var(--button) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div {
  color: var(--text-desc) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div>div>div>div:nth-child(3)>span>a {
  background: none !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div>div>div>div:nth-child(3)>span>span {
  background: none !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div>div>div>div:nth-child(3)>span>a {
  color: var(--link) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div {
  background-color: var(--background-front) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div>div>div>div>div>div>button:nth-child(1) {
  background-color: var(--link) !important;
}

body>div:nth-child(11)>div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div:nth-child(2)>div:nth-child(1)>div:nth-child(3)>div:nth-child(2)>div:nth-child(1)>div {
  border-bottom: 1px solid var(--button) !important;
}

.bg-success {
  background-color: #a4df8b !important;
}

.text-success {
  color: #1a6f1a !important
}

nav>ul>li:not(:last-child)::after {
  border-right: 1px solid var(--dark-gray-50) !important;
}

#profile-app>div>div>div:nth-child(2)>div>div>div>div>div:not(:last-child){
  border-bottom: 1px solid var(--button) !important;
}
`;

if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("body") || document.documentElement).appendChild(styleNode);
}

})();
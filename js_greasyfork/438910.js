// ==UserScript==
// @name         Flomo@DK
// @namespace    https://dkpress.cn/
// @version      1.31
// @description  for Flomoapp.com
// @author       DK
// @match        https://flomoapp.com/mine
// @icon         https://st.flomoapp.com/images/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438910/Flomo%40DK.user.js
// @updateURL https://update.greasyfork.org/scripts/438910/Flomo%40DK.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addStyle();
    function addStyle() {
        let style = `
body {
    background-color: #e3e6ed !important
}
.el-input__inner {
    background-color:#fff !important
}
div.input-box {
    border:1px solid #55bb8e !important
}
.heatgrid .day {
    background-color: #fefefe;
}
.heatgrid .day.light_green {
    border-color:#98cccc !important
}
.heatgrid .day.today {
    border-color:#55bb8e !important
}
ul {
    color:#666 !important
}
.sidebar_ul li:hover {
    background-color:#fff !important;
    color:#666 !important
}
ul li.tag > div:hover {
    background-color:#fff !important;
    color:#666 !important
}
.stat .datas .data .number {
    color:#666 !important
}
h3 {
    color:#555 !important
}
.allTags .allTags_header .allTags_title {
    color:#555 !important
}
div.content span.tag {
    color: #55bb8e !important;
}
div.content span.tag:hover {
    background-color:#55bb8e !important;
    color:#fff !important;
}
.recycle {
    color:#555 !important
}
div.content a {
    color: #55bb8e !important;
}
`;
    document.lastChild.appendChild(document.createElement('style')).textContent = style;
}

})();
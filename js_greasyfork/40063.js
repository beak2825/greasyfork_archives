// ==UserScript==
// @name         ToTheirGithubHome
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*.github.io/*
// @match        *://*.gitbooks.io/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/40063/ToTheirGithubHome.user.js
// @updateURL https://update.greasyfork.org/scripts/40063/ToTheirGithubHome.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style=`
@keyframes icon-bounce {
0%, 100% {
-moz-transform: rotate(0deg);
-ms-transform: rotate(0deg);
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}

25% {
-moz-transform: rotate(15deg);
-ms-transform: rotate(15deg);
-webkit-transform: rotate(15deg);
transform: rotate(15deg);
}

50% {
-moz-transform: rotate(-15deg);
-ms-transform: rotate(-15deg);
-webkit-transform: rotate(-15deg);
transform: rotate(-15deg);
}

75% {
-moz-transform: rotate(5deg);
-ms-transform: rotate(5deg);
-webkit-transform: rotate(5deg);
transform: rotate(5deg);
}

85% {
-moz-transform: rotate(-5deg);
-ms-transform: rotate(-5deg);
-webkit-transform: rotate(-5deg);
transform: rotate(-5deg);
}
}
@-webkit-keyframes icon-bounce {
0%, 100% {
-moz-transform: rotate(0deg);
-ms-transform: rotate(0deg);
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}

25% {
-moz-transform: rotate(15deg);
-ms-transform: rotate(15deg);
-webkit-transform: rotate(15deg);
transform: rotate(15deg);
}

50% {
-moz-transform: rotate(-15deg);
-ms-transform: rotate(-15deg);
-webkit-transform: rotate(-15deg);
transform: rotate(-15deg);
}

75% {
-moz-transform: rotate(5deg);
-ms-transform: rotate(5deg);
-webkit-transform: rotate(5deg);
transform: rotate(5deg);
}

85% {
-moz-transform: rotate(-5deg);
-ms-transform: rotate(-5deg);
-webkit-transform: rotate(-5deg);
transform: rotate(-5deg);
}
}
@-moz-keyframes icon-bounce {
0%, 100% {
-moz-transform: rotate(0deg);
-ms-transform: rotate(0deg);
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}

25% {
-moz-transform: rotate(15deg);
-ms-transform: rotate(15deg);
-webkit-transform: rotate(15deg);
transform: rotate(15deg);
}

50% {
-moz-transform: rotate(-15deg);
-ms-transform: rotate(-15deg);
-webkit-transform: rotate(-15deg);
transform: rotate(-15deg);
}

75% {
-moz-transform: rotate(5deg);
-ms-transform: rotate(5deg);
-webkit-transform: rotate(5deg);
transform: rotate(5deg);
}

85% {
-moz-transform: rotate(-5deg);
-ms-transform: rotate(-5deg);
-webkit-transform: rotate(-5deg);
transform: rotate(-5deg);
}
}
@-o-keyframes icon-bounce {
0%, 100% {
-moz-transform: rotate(0deg);
-ms-transform: rotate(0deg);
-webkit-transform: rotate(0deg);
transform: rotate(0deg);
}

25% {
-moz-transform: rotate(15deg);
-ms-transform: rotate(15deg);
-webkit-transform: rotate(15deg);
transform: rotate(15deg);
}

50% {
-moz-transform: rotate(-15deg);
-ms-transform: rotate(-15deg);
-webkit-transform: rotate(-15deg);
transform: rotate(-15deg);
}

75% {
-moz-transform: rotate(5deg);
-ms-transform: rotate(5deg);
-webkit-transform: rotate(5deg);
transform: rotate(5deg);
}

85% {
-moz-transform: rotate(-5deg);
-ms-transform: rotate(-5deg);
-webkit-transform: rotate(-5deg);
transform: rotate(-5deg);
}
}
#to-their-github-home{
width: 50px;
height: 50px;
background-color: #fff;
position: fixed;
top:20px;
right:20px;
border-radius: 25px;
z-index: 1000000;
cursor: pointer;
overflow: hidden;
border: 1px solid #ed3f14;
text-align:center;
-webkit-animation: icon-bounce 0.5s  infinite;
-moz-animation: icon-bounce 0.5s  infinite;
-o-animation: icon-bounce 0.5s  infinite;
animation: icon-bounce 0.5s  infinite;
}
#to-their-github-home a{
display: block;
width: 100%;
height: 100%;
}
`;
    GM_addStyle(style);

    var username=window.location.host.split('.')[0];
    var html=`
<div id="to-their-github-home"> <a href="https://github.com/${username}" target="_blank">
<svg height="50" class="octicon octicon-mark-github" viewBox="0 0 16 16" version="1.1" width="30" aria-hidden="true"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
</a> </div>
`;
    // 添加div
    var div = document.createElement('div');
    div.innerHTML = html;
    document.body.appendChild(div);

    var tid=setTimeout(function(){
        if(div){
            div.remove();
        }
    },5000);
})();
// ==UserScript==
// @name         ServiceNow - Better Background Scripts
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Improve usability of Background Scripts (strongly inspired by SwissNOW)
// @author       Ricardo Constantino <ricardo.constantino@fruitionpartners.pt>
// @match        https://*.service-now.com/sys.scripts.do
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/411664/ServiceNow%20-%20Better%20Background%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/411664/ServiceNow%20-%20Better%20Background%20Scripts.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var forms = document.forms;
    if (forms.length < 1) return;

    GM_addStyle(`
#better_bg_output {
float:right;
border:thin solid #000;
margin-bottom:16px;
z-index:10;
top:.5em;
position:absolute;
right:1em;
width:calc(100vw - 80ch - 1em);
height:calc(100vh - 4.5em);
margin-left:0;
display:flex;
flex-direction:column;
min-height:240px
}

input[name="runscript"] {
background-color:#337ab7;
color:#fff;
font-weight:700;
font-size:large;
padding:8px;
float:left
}

#better_bg_output iframe {
border:none
}

#better_bg_output.loading iframe {
display:none
}

#better_bg_output h4 {
margin:0;
font-family:sans-serif;
font-weight:700;
display:block;
text-align:center;
padding:3px;
background:#e4f1fe;
border-bottom:solid medium #0066a1;
color:#000;
font-size:large
}

#runscript {
width:80ch!important;
display:block;
-moz-tab-size:4;
tab-size:4;
height:calc(100vh - 7em);
padding: 0.5ch 1ch;
line-height: 170%;
font-family: Fira Code, Menlo, Consolas, monospace;
}

#better_bg_iframe {
height:calc(100vh - 6.4em);
width:100%;
display:unset
}

body > a {
display:none
}

hr {
display:none
}

#better_bg_loader {
display:none
}

.loading #better_bg_loader {
margin:auto;
display:block;
width:120px;
height:120px
}

#better_bg_loader #loader {
position:relative;
width:170px;
height:170px;
border:8px solid #fff;
border-top:8px solid #00a84f;
border-bottom:8px solid #87cc9c;
top:-160px;
left:-35px;
border-radius:50%;
animation:spin 3s linear infinite
}

#better_bg_loader svg {
width:120px;
height:133px;
margin:auto
}

@keyframes spin {
from {
transform:rotate(0deg)
}

to {
transform:rotate(360deg)
}
}

body > pre {
display:none
}

body {
overflow:hidden
}

body form {
height:calc(100vh - 3em);
margin:0;
padding:0
}

.loading iframe {
display:none
}

@media screen and (max-width: 900px) {
body > label {
display:none
}

body form {
height:inherit
}

#runscript {
width:100%!important;
height:30%
}

#better_bg_output {
float:none;
position:relative;
width:100%;
top:auto;
right:auto;
min-height:unset;
height:60%
}

form > label {
font-size:80%
}
}
`);

    if (!document.getElementById('better_bg_output')) {
        var divNode = document.createElement("div");
        divNode.id = 'better_bg_output';
        divNode.innerHTML = `
<h4>Script output</h4>
<div id='better_bg_loader'>
<svg version="1.1" viewBox="-10 0 100 100" xmlns="http://www.w3.org/2000/svg">
 <g transform="translate(-67.8 -97.5)">
  <g>
   <path d="m146 98.4c-24.7-4.07-46.5 6.95-57.7 18.8-18.1 19.1-25.5 45.1-17.7 78.4 14-9.78 23.6-39.1 27.1-55.3 3.41-15.8 16.8-42.8 48.3-41.9z" fill="#00a84f"/>
   <path d="m105 141c9.48-34.7 26.4-39.3 43.4-40.8 5.76 29.8-13.7 90.3-74 97.1 24.4-18.6 25.6-46.9 30.5-51.6 5.53-4.93 11.2-5.42 15-6.24 4.05-0.887 17.4-2.3 17.5-4.26 0.0639-2.26-28-0.0393-32.4 5.7z" fill="#87cc9c"/>
  </g>
 </g>
</svg>
<div id='loader'></div>
</div>
<iframe name='better_bg_iframe' id='better_bg_iframe'></iframe>
`;
        document.body.appendChild(divNode);
    }
    let origFavicon;

    let form = document.querySelector('form');
    form.target = "better_bg_iframe";
    form.removeAttribute('onsubmit');
    form.addEventListener('submit', () => {
        document.querySelector('#better_bg_output').classList.add('loading');
        setFavicon(true);
    });

    let textarea = document.querySelector('textarea');
    textarea.setAttribute('spellcheck', false);
    textarea.addEventListener('keypress', key => {
        if ((key.ctrlKey || key.metaKey) && key.code == "Enter")
            document.querySelector('input[name=runscript]').click();
    });
    textarea.addEventListener('keydown', key => {
        if (key.code == 'Tab') {
            key.preventDefault();
            let t = key.target;
            let s = t.selectionStart;
            t.value = t.value.substring(0, t.selectionStart) + "\t" + t.value.substring(t.selectionEnd);
            t.selectionEnd = s+1;
        }
    });

    document.querySelector('#better_bg_iframe').addEventListener('load', () => {
        document.querySelector('#better_bg_output').classList.remove('loading');
        setFavicon(false);
    });

    function setFavicon(loading=false) {
        let favicon = window.top.document.querySelector('head link[rel*="icon"]');
        if (origFavicon === undefined) origFavicon = favicon ? favicon.href : '/favicon.ico';
        if (!favicon) {
            favicon = window.top.document.createElement('link');
            favicon.id = 'favicon';
            favicon.setAttribute('rel', 'shortcut icon');
            window.top.document.head.appendChild(favicon);
        }
        if (loading) {
            favicon.href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' style='margin: auto; background: transparent none repeat scroll 0%25 0%25; display: block;' width='32px' height='32px' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid'%3E%3Ccircle cx='50' cy='50' fill='none' stroke='%2387cc9c' stroke-width='20' r='35' stroke-dasharray='164.93361431346415 56.97787143782138'%3E%3CanimateTransform attributeName='transform' type='rotate' repeatCount='indefinite' dur='1.5s' values='0 50 50;360 50 50' keyTimes='0;1'%3E%3C/animateTransform%3E%3C/circle%3E%3C/svg%3E";
        } else {
            favicon.href = origFavicon;
        }
    }
})();
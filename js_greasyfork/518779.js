// ==UserScript==
// @name        Moco
// @description This is your new file, start writing code
// @match       *://*.mocoapp.com/*
// @grant        GM_addStyle
// @version        1.0.2
// @namespace https://greasyfork.org/users/1402164
// @downloadURL https://update.greasyfork.org/scripts/518779/Moco.user.js
// @updateURL https://update.greasyfork.org/scripts/518779/Moco.meta.js
// ==/UserScript==

(function(){
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `body {
    padding-bottom: 100px;
}
.master-navigation .row .col-xs-8 {
    width: auto;
}

.container__app-header {
    background:transparent;
    margin:0;
}
.header-options {
    width: auto;
    position: absolute;
    right: 0;
}
.app-header {
    background:transparent;
}
.app-header > .row > .col-xs-4:first-child {
    display: none;
}
.app-header > .row > .col-xs-8 {
    position: fixed;
    bottom: 0;
    background-color: #fff7;
    backdrop-filter: blur(5px);
    width: 100%;
    left: 0;
    padding: 10px;
    z-index: 200;
}



#intercom-frame,
.intercom-lightweight-app {
    display: none !important;
}

.container {
    width: 100% !important;
    padding: 0 15px;
}

@media (max-width:600px) {
    .container--application .grid {
        display:block;
    }
    .sidebar {
        margin-top: -46px;
        padding-top: 0;
    }
    .sidebar .nav-list {
        margin: 0;
    }
    .grid .col-span-13 > div > div .section {
        margin: 0 -15px;
    }
    .grid .col-span-13 > div > div .section > .section-content{
        padding: 30px 10px !important;
    }
    .master-navigation .row .col-xs-8 > .flex {
        flex-wrap: wrap;
        gap: 0 1rem;
        font-size: 0.7rem;
    }
}
`;

document.getElementsByTagName('head')[0].appendChild(style);
})();
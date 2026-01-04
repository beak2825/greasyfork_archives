// ==UserScript==
// @name         webデザイン改変1
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Metroモードをレスポンシブにするやつ
// @match        https://mypage.osakac.ac.jp/portal/?viewMetro=true
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/381422/web%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E6%94%B9%E5%A4%891.user.js
// @updateURL https://update.greasyfork.org/scripts/381422/web%E3%83%87%E3%82%B6%E3%82%A4%E3%83%B3%E6%94%B9%E5%A4%891.meta.js
// ==/UserScript==

// -- ver 1.0.0 --
// ・headerが`top: 1703px;`とかいう異次元にいたので消えてもらった
// ・背景も深緑にした
// ・flexboxにしたけどベンダープレフィックス付けてない(https://developer.mozilla.org/ja/docs/Web/CSS/flex#Browser_compatibility)
// ・viewportぐらい最初から入れて…
// ・Chrome73とFirefoxで動いた

function run() {
    add_view_port();
    GM_addStyle(style);
};

function add_view_port() {
    const head = document.getElementsByTagName(`head`)[0];
    const meta = document.createElement(`meta`);
    meta.setAttribute(`name`, `viewport`);
    meta.setAttribute(`content`, `width=device-width,initial-scale=1`);
    head.appendChild(meta);
};

const style = `
#header {
display: none;
}

#metro {
background-color: green;
background-image: none!important;
height: 100vh;
}

#metro .campus {
width: auto!important;
}

#metro .inner {
height: auto!important;
}

#metro .menu_body {
height: auto!important;
}

#metro .menu_body tr {
display: flex;
justify-content: center;
flex-wrap: wrap;
}

#metro .td_0 {
flex: 1;
min-width: 180px;
margin: 5px;
padding: 0px;
}

#metro .td_1 {
flex: 1;
min-width: 180px;
margin: 5px;
padding: 0px;
}

#metro .td_2 {
flex: 1;
min-width: 180px;
margin: 5px;
padding: 0px;
}

#metro .td_3 {
flex: 1;
min-width: 180px;
margin: 5px;
padding: 0px;
}

#metro .menu {
width: auto!important;
}

#metro .menu_normal {
margin: 5px;
}

#metro .menu_body td.reg {
width: auto!important;
height: auto!important;
min-height: 179.75px;
flex: 1 1 300px;
}

#metro .small tbody {
justify-content: space-around;
}
`
run();
// ==UserScript==
// @name         ybt系列夜间模式
// @namespace    http://tampermonkey.net/
// @namespace    https://www.luogu.com.cn/user/545986
// @version      0.3.1
// @description  ybt系列 DarkMode 夜间模式
// @match        http://ybt.ssoier.cn:8088/*
// @match        http://oj.woj.ac.cn:8088/*
// @match        http://bas.ssoier.cn:8086/*
// @match        http://woj.ssoier.cn:8087/*
// @author       Jerrycyx,ChatGPT
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473569/ybt%E7%B3%BB%E5%88%97%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/473569/ybt%E7%B3%BB%E5%88%97%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
GM_addStyle(`
    body {
        background-image: none !important;
        background-color: #343434 !important;
    }
    div[style="background:#FCFCFC;border-radius:5px;min-height:450px;text-align:left;box-shadow:1px 1px 8px #000;"] {
        background-color: #575757 !important;
    }
    td[align="right"], td[colspan="6"] {
        color: #8b8b8b;
    }
    td.pcontent {
        & p {
            color: #b2b2b2 !important;
        }
        & pre, code {
            color: #b2b2b2;
            background-color: #484848 !important;
	    }
	    & td {
	        color: #8b8b8b;
	    }
	    & h3 {
	        color: LightBlue !important;
	    }
	    & .xxbox {
	        background-color: #484848 !important;
	    }
    }

    .menux {
        border: none !important;
        & div p {
            border: none !important;
        }
    }

    span[id="showpp"] {
        & p {
            color: #b2b2b2;
        }
        & pre, code {
            color: #b2b2b2;
            background-color: #484848 !important;
	    }
	    & td {
	        color: #8b8b8b;
	    }
	    & h3 {
	        color: LightBlue !important;
	    }
    }
    h3 {
	    color: LightBlue !important;
	}
    span[id="showpp"]:not(font) {
        color: #b2b2b2;
    }
    center p font[size="2"] {
        color: #8b8b8b;
    }
    .menux p[align="left"] {
        background-color: #484848;
        color: #b2b2b2;
    }
    .menux td {
        color: #8b8b8b;
    }
    button[type="submit"] {
        background-color: #575757;
    }
    table[width="900px"] {
        & font[size="6"] {
            color: #b2b2b2;
        }
        & font[size="5"] {
            color: LightBlue;
        }
    }
    div[style="min-height:80%;"] p[align="center"] {
        color: #8b8b8b;
    }
    input, Select {
        background-color: #484848;
        color: #b2b2b2;
    }
    table {
        & tr {
            color: #b2b2b2;
        }
        & tr[bgcolor="#c0c0c0"],td[bgcolor="#d0d0c0"] {
            background-color: #484848;
        }
        & tr[bgcolor="#FCFCFC"] {
            background-color: #616161;
        }
        & tr[bgcolor="#F0F0F0"] {
            background-color: #575757;
        }
    }
    font[size="3"][color="blue"], h1[color="#000099"] {
        color: LightBlue;
    }
    .rlist {
        color: #b2b2b2;
    }
    textarea {
        background-color: #484848;
        color: b2b2b2;
    }
    textarea::-webkit-scrollbar-thumb {
        background-color: #575757;
    }
    textarea::-webkit-scrollbar-track {
        background-color: #616161;
    }
    a {
        color: DodgerBlue !important;
    }
    a::after {
        background-color: DodgerBlue !important;
    }
    .menu[width="14%"] {
        background-color: #575757;
    }
    .on {
        background-color: #484848 !important;
    }
    #tow1, #tow2, #tow3, #tow4 {
        & b{
            color: #8b8b8b
        }
    }
    h1, h2, h3, h4, h5, h6, .note, .mail {
        color: LightBlue !important;
    }
    font[color="#001290"] {
        color: #8b8b8b;
    }
    tr[bgcolor="#ccccff"] {
        background-color: #484848;
    }

    hr {
        border: 1px solid #484848;
    }

    .tablist .menudiv ul li {
        & a:hover {
            background-color: #616161;
        }
        & ul li {
            & a {
                background-color: #484848;
            }
            & a:hover {
                background-color: #616161;
            }
        }
    }
    .copy-button {
        color: #b2b2b2;
        background-color: #616161;
        border-color: #616161;
    }
    .copy-button:hover {
        background-color: #484848;
    }
    .copy-button.success {
        background: #8bc34a;
    }
    .searchBtn, .searchBox, .jumpBtn {
        color: #b2b2b2 !important;
        background-color: #484848 !important;
    }
    .searchBtn.hovered, .jumpBtn.hovered {
        background-color: #575757 !important;
    }
    .searchBox input[type="text"] {
        border-radius: 0px !important;
    }

    ::-webkit-scrollbar-track {
        background-color: #484848;
     }
    ::-webkit-scrollbar-thumb {
        background-color: #575757;
    }
    ::-webkit-scrollbar-thumb:hover {
            background-color: #616161;
    }
    ::-webkit-scrollbar {
        transition: background-color 0.1s;
    }

    center tbody tr td div center {
        background-color: #343434;
    }
    center tbody tr td div center table tbody tr td pre {
        filter: invert(1) hue-rotate(180deg);
    }

    .fff {
        border-style: none !important;
    }
    tbody tr[bgcolor="#D8D8D8"] th {
        background-color: #484848;
    }
    .mail {
        border: none !important;
    }
    center table tbody tr td .xxbox {
        color: #b2b2b2;
        background-color: #484848;
    }
`);
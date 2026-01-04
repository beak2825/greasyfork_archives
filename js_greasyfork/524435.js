// ==UserScript==
// @name         XZ Social Club
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  a new look for venge social club
// @author       Moka
// @match        https://social.venge.io/*
// @icon         https://i.postimg.cc/SKFyQdDn/logo-1.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/524435/XZ%20Social%20Club.user.js
// @updateURL https://update.greasyfork.org/scripts/524435/XZ%20Social%20Club.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`

    .logo {
    height: 60px;
    top: 4.2vh;
    }

    .header {
    border-radius: 4vh;
    background: #232323;
    }

    body {
    background: url('https://i.postimg.cc/9MsvpC8p/Untitled.png');
    }

    .level {
    text-shadow: 0px 1px 2px #000;
    background: url('https://i.postimg.cc/631Gb1nz/Level-Icon-1.png');
    }

    .menu li, .menu a {
    color: #ffffff;
    font-family: cursive;
    }

    body{
    font-family: cursive;
    }

    .stat-card {
    background: #000000;
    color: #fff;
    float: right;
    width: 90px;
    height: 60px;
    text-align: center;
    margin-left: 10px;
    border-radius: 15px;
    box-sizing: border-box;
    }

    .content{
    border-radius: 4vh;
    }

    .darkmode .content{
    background: #161515;
    }

    .stats-col li {
    background: #000000;
    color: #fff;
    padding: 7px 15px;
    border-radius: 24px;
    margin-bottom: 10px;
    }

    .stats-col li:nth-child(even) {
    background: #000000;
    }

    .link a {
    color: #999 !important;
    }

    .sidebar li.active, .sidebar li.active > a {
    background: #000;
    color: #fff;
    }

    .sidebar li{
    border-radius: 25px;
    }

    .market-item .price {
    background: #fff;
    color: #000000;
    }

    .search-icon{
    background: #797979;
    border: solid 1px #fff;
    }

    .search-form i {
    background: #797979;
    border: solid 1px #fff;
    }

    button, a.button {
    background-color: #000;
    border: none;
    border-radius: 25px;
    color: #fff;
    box-shadow: 0px 0.05vw 0.2vw rgb(255 255 255 / 40%);
    padding: 0.4vw 0.9vw;
    font-size: 0.8vw;
    border-top: solid 1px rgba(255, 255, 255, 0.1);
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    font-weight: bold;
    font-size: 18px;
    font-family: cursive;
    }

    .select-skin-box .skin-box {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 225px;
    border-radius: 15px;
    box-shadow: 0px 0px 10px #c7c7c7;
    background: rgb(249 59 59 / 85%);
    border: 2px solid #fe2929;
    transform: scale(1, 1);
    transition: all 0.2s ease;
    cursor: pointer;
    overflow: hidden;
    }

    .trade-box:after {
    content: "";
    position: absolute;
    width: 55px;
    height: 55px;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    background: url(https://i.postimg.cc/GmhSmQbx/Transfer-Icon-2.png) no-repeat fixed;
    background-size: cover;
    }

    .search-form i {
    background: #797979;
    border: solid 1px #fff;
    }

    .online, .dark-mode-field {
    border-left: solid 1px #fff;
    padding-left: 20px;
    font-size: 15px;
    margin-top: 3px;
    letter-spacing: -0.1px;
    color: #fff !important;
    margin-left: 20px !important;
    }

    .profile-actions ul li, .clans-actions ul li {
    margin-bottom: 10px;
    color: #999;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    }
`);

const logo = document.querySelector('a[href="https://venge.io/"] img');
if (logo) {
  logo.src = "https://i.postimg.cc/SKFyQdDn/logo-1.png";
}
})();
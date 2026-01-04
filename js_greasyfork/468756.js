// ==UserScript==
// @name         Bitrix Notify Clicker
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Clicks Bitrix Important notifies on main page
// @author       Ruslan Parshin
// @match        https://corp.oktoprint.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nami.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468756/Bitrix%20Notify%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/468756/Bitrix%20Notify%20Clicker.meta.js
// ==/UserScript==

var notifyBtnId = "blog-f6AhYa-btn";
var timer = 5; // Seconds

var cliker = null;

function CreateDashboard(){
    let dash = document.createElement('div');
    let switcher = document.createElement('div');
    let title = document.createElement('div');

    switcher.innerHTML = '<label class="toggle"><input class="toggle-checkbox" type="checkbox" id="switcherCheckBox"><div class="toggle-switch"></div><span class="toggle-label" id="switcherInfo" >Выкл</span></label>';
    title.innerHTML = "Bitrix Clicker";
    title.className = "sw-title";

    dash.className = "dashBtnBlock";
    dash.appendChild(title);
    dash.appendChild(switcher);

    let bitrixHeader = document.getElementById("header-inner");
    bitrixHeader.appendChild(dash);

    let info = document.getElementById("switcherInfo");
    let swBtn = document.getElementById("switcherCheckBox");

    swBtn.onchange = (event) => {validate();};

    function validate() {
        if (swBtn.checked) {
            console.log("Checked YES");
            info.innerHTML = "Вкл";
            StartClicker();
        } else {
            console.log("Checked NO");
            info.innerHTML = "Выкл";
            StopClicker();
        }
    }
}

function AddGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function AddDashboardStyles(){
    AddGlobalStyle('.dashBtnBlock { position: relative; z-index: 1000; box-shadow: inset 0 -3em 3em rgba(0,0,0,0.1),0 0  0 2px rgb(255,255,255),0.3em 0.3em 1em rgba(0,0,0,0.3); }');
    AddGlobalStyle('.dashBtnBlock { background: #fff; border-radius: 8px; padding: 2px 8px 2px 8px;}');
    AddGlobalStyle('.dashBtnBlock { width: 120px; display: inline-block; order: 6; margin: 0px 4px 0px 4px;}');

    AddGlobalStyle('.toggle { cursor: pointer;  display: inline-block; margin-bottom: 2px;}');
    AddGlobalStyle('.toggle-switch {  display: inline-block;  background: #ccc;  border-radius: 16px;  width: 40px;  height: 20px;  position: relative;  vertical-align: middle;  transition: background 0.25s;}');
    AddGlobalStyle('.toggle-switch:before, .toggle-switch:after {  content: "";}');
    AddGlobalStyle('.toggle-switch:before {  display: block;  background: linear-gradient(to bottom, #fff 0%, #eee 100%);  border-radius: 50%;  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);  width: 16px;  height: 16px;  position: absolute;  top: 2px;  left: 4px;  transition: left 0.25s;}');
    AddGlobalStyle('.toggle:hover .toggle-switch:before {  background: linear-gradient(to bottom, #fff 0%, #fff 100%);  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);}');
    AddGlobalStyle('.toggle-checkbox:checked + .toggle-switch {  background: #56c080;}');
    AddGlobalStyle('.toggle-checkbox:checked + .toggle-switch:before {  left: 20px;}');
    AddGlobalStyle('.toggle-checkbox {  position: absolute;  visibility: hidden;}');
    AddGlobalStyle('.toggle-label {  margin-left: 5px;  position: relative;  top: 2px;}');

    AddGlobalStyle('.sw-title { text-align: center; color: #ef5f17; font-weight: 700; margin-bottom: 4px;}');
}

function findNotifyButton(){
    let btn = document.getElementById(notifyBtnId);
    if (typeof(btn) != 'undefined' && btn != null)
    {
        btn.click();
    }
}

function StartClicker(){
    cliker = setInterval(function() {
        findNotifyButton();
    }, timer * 1000);
}

function StopClicker(){
    clearInterval(cliker);
}

(function() {
    'use strict';

    // Your code here...
    AddDashboardStyles();
    CreateDashboard();
})();

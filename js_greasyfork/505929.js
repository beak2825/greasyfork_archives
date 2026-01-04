// ==UserScript==
// @name         VC AutoFill EU
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VC AutoFill for EU（除了hcaptcha验证），记得将wantedVPS的内容替换为你想要的vps序号，可以的话也修改一下密码。
// @author       ChatGPT
// @match        https://free.vps.vc/create-vps
// @icon         https://free.vps.vc/img/favicon.png
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/505929/VC%20AutoFill%20EU.user.js
// @updateURL https://update.greasyfork.org/scripts/505929/VC%20AutoFill%20EU.meta.js
// ==/UserScript==

var selectos = document.querySelector('#os');
var purpose = document.querySelector('#purpose');
var password = document.getElementById('password');
var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var wantedVPS = 'EU4|EU2|EU3|EU1';
// US4|US3|US2|US1|
// EU4|EU2|EU3|EU1
var datacenterSelect = document.getElementById('datacenter');

if (selectos) {
    selectos.selectedIndex = 2;
}

if (purpose) {
    purpose.selectedIndex = 4;
}

if (password) {
    password.value = 'P@assword!';
}

if (datacenterSelect) {
    Array.from(datacenterSelect.options).forEach(function(option) {
        if (option.value.includes(wantedVPS)) {
            option.selected = true;
        }
    });
}

checkboxes.forEach(function(checkbox) {
    checkbox.checked = true;
});

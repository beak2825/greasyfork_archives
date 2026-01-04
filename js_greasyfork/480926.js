// ==UserScript==
// @name         VC自动填充
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  vc自动填充脚本（除了hcaptcha验证），记得将wantedVPS的内容替换为你想要的vps序号，可以的话也修改一下密码。
// @author       ChatGPT
// @match        https://free.vps.vc/create-vps
// @icon         https://free.vps.vc/img/favicon.png
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/480926/VC%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/480926/VC%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

var selectos = document.querySelector('#os');
var purpose = document.querySelector('#purpose');
var password = document.getElementById('password');
var checkboxes = document.querySelectorAll('input[type="checkbox"]');
var wantedVPS = 'EU2';
var datacenterSelect = document.getElementById('datacenter');

if (selectos) {
    selectos.selectedIndex = 2;
}

if (purpose) {
    purpose.selectedIndex = 2;
}

if (password) {
    password.value = 'p@ssword!';
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

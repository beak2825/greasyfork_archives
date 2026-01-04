// ==UserScript==
// @name               移除秀米xiumi手机强制认证
// @name:en            Remove Xiumi Phone Requirement
// @name:zh            移除秀米xiumi手机强制认证
// @name:zh-CN         移除秀米xiumi手机强制认证
// @namespace          https://www.github.com/KumaTea
// @namespace          https://greasyfork.org/en/users/169784-kumatea
// @version            0.2.1
// @description        Remove Xiumi Phone Requirement
// @description:en     Remove Xiumi phone requirement
// @description:zh     移除秀米xiumi手机强制认证
// @description:zh-cn  移除秀米xiumi手机强制认证
// @author             KumaTea
// @match              https://xiumi.us/
// @include            http://xiumi.us/*
// @include            https://xiumi.us/*
// @include            http://*.xiumi.us/*
// @include            https://*.xiumi.us/*
// @downloadURL https://update.greasyfork.org/scripts/384694/%E7%A7%BB%E9%99%A4%E7%A7%80%E7%B1%B3xiumi%E6%89%8B%E6%9C%BA%E5%BC%BA%E5%88%B6%E8%AE%A4%E8%AF%81.user.js
// @updateURL https://update.greasyfork.org/scripts/384694/%E7%A7%BB%E9%99%A4%E7%A7%80%E7%B1%B3xiumi%E6%89%8B%E6%9C%BA%E5%BC%BA%E5%88%B6%E8%AE%A4%E8%AF%81.meta.js
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

async function remele() {
    while (!document.getElementsByClassName('modal fade ng-isolate-scope tn-dialog-bind-phone in')[0]) {
        await sleep(1000);
    };
    document.getElementsByClassName('modal fade ng-isolate-scope tn-dialog-bind-phone in')[0].remove();
    document.getElementsByClassName('modal-backdrop fade in')[0].remove();

};

remele();

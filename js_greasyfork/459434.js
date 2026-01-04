// ==UserScript==
// @name         webhorizon unlock email modificationlname
// @name:zh-CN   解除webhorizon修改邮箱限制
// @version      1.0
// @description  unlock the limitation of email modification for webhorizon1
// @description:zh-CN 自动解除webhorizon修改邮箱限制，无需额外配置
// @author       -X-
// @namespace    https://www.nodeseek.com/
// @include      https://my.webhorizon.net/client/main/edit/
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459434/webhorizon%20unlock%20email%20modificationlname.user.js
// @updateURL https://update.greasyfork.org/scripts/459434/webhorizon%20unlock%20email%20modificationlname.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let emailForm = document.getElementById('last_name').parentElement
    let container = emailForm.parentElement
    let clonedEmailForm = emailForm.cloneNode(true)
    let feedback = emailForm.cloneNode(false)

    emailForm.remove()
    container.insertAdjacentElement('beforeend', clonedEmailForm);
    clonedEmailForm.querySelector('#last_name').removeAttribute('readonly')
    feedback.innerHTML = '<a href="https://www.nodeseek.com/">脚本问题反馈请到www.nodeseek.com</a>'
    container.insertAdjacentElement('beforeend', feedback);
})();
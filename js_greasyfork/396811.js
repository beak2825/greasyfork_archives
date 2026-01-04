// ==UserScript==
// @namespace         https://greasyfork.org/users/443103
// @name              Fuck I Agree
// @name:en           Fuck I Agree
// @name:zh           去你大爷的我同意
// @name:zh-CN        去你大爷的我同意
// @description       自动点击我同意。
// @description:en    Automatically click on "I Agree" button.
// @description:zh    自动点击我同意。
// @description:zh-CN 自动点击我同意。
// @include           *://https://www.xyzdict.com/*
// @version           0.0.1
// @author            Zijun Yu
// @grant             null
// @downloadURL https://update.greasyfork.org/scripts/396811/Fuck%20I%20Agree.user.js
// @updateURL https://update.greasyfork.org/scripts/396811/Fuck%20I%20Agree.meta.js
// ==/UserScript==

document.selectElementById('win_agreement_yes').click();

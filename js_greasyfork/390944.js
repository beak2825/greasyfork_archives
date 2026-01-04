// ==UserScript==
// @name         UI Print Label Closer
// @version      1.0
// @description  Automatically close Print Label prompts
// @match        https://urbaninspirations.co/amazon-ca/fba-qb-to-ss/custom-app/uiorders-label-output/*
// @grant        window.close
// @namespace https://greasyfork.org/users/228706
// @downloadURL https://update.greasyfork.org/scripts/390944/UI%20Print%20Label%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/390944/UI%20Print%20Label%20Closer.meta.js
// ==/UserScript==

setTimeout(AutoClose,5000)

function AutoClose (){
window.close()
}

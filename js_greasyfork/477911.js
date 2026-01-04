// ==UserScript==
// @name base embeder
// @description experimental
// @description:ja 試験的
// @match https://*
// @version 1.0
// @namespace fujima3.github
// @downloadURL https://update.greasyfork.org/scripts/477911/base%20embeder.user.js
// @updateURL https://update.greasyfork.org/scripts/477911/base%20embeder.meta.js
// ==/UserScript==

const AddScript = (clazz) => {
    const script_element = document.createElement('script')
    script_element.textContent = clazz
    const html_header = document.querySelector('head')
    html_header.appendChild(script_element)
}
// ==UserScript==
// @name         转换私有 gitlab 中 clone with ssh 的 uri(需配置ssh config)
// @namespace    https://floatsyi.com/
// @version      0.0.2
// @description  转换私有 gitlab 中 clone with ssh 的 uri(需配置ssh config) (~diff~) 
// @author       floatsyi
// @license      MIT
// @include      *://gitlab.*
// @match        *://gitlab.*
// @downloadURL https://update.greasyfork.org/scripts/397741/%E8%BD%AC%E6%8D%A2%E7%A7%81%E6%9C%89%20gitlab%20%E4%B8%AD%20clone%20with%20ssh%20%E7%9A%84%20uri%28%E9%9C%80%E9%85%8D%E7%BD%AEssh%20config%29.user.js
// @updateURL https://update.greasyfork.org/scripts/397741/%E8%BD%AC%E6%8D%A2%E7%A7%81%E6%9C%89%20gitlab%20%E4%B8%AD%20clone%20with%20ssh%20%E7%9A%84%20uri%28%E9%9C%80%E9%85%8D%E7%BD%AEssh%20config%29.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
const sshCloneEle = document.querySelector('#ssh_project_clone')
const value = sshCloneEle ? sshCloneEle.value : null
if (value && /\[git@gitlab.+\d+\]/.test(value)) {
    sshCloneEle.value = value.replace(/\[(git@git.+):\d+\](.+)/g, '$1$2')
}
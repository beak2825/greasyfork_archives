// ==UserScript==
// @name         GreasyFork镜像站验证库-01
// @namespace    gfmirror
// @version      0.0.1
// @description  GreasyFork镜像站验证库:https://github.com/shenchanran/greasyfork-mirror
// ==/UserScript==
(function(){
    let siteId = 0
    eval(`window.site${siteId}()`)
})()
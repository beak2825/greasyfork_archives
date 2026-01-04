// ==UserScript==
// @name         spring eureka 1.x 扩展
// @namespace    http://blog.fondme.com
// @version      0.2
// @description  try to take over the world!
// @author       觉得烦死
// @include *
// @match        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400616/spring%20eureka%201x%20%E6%89%A9%E5%B1%95.user.js
// @updateURL https://update.greasyfork.org/scripts/400616/spring%20eureka%201x%20%E6%89%A9%E5%B1%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.info("执行eureka 扩展插件")
    var aArr = $("body#one table#instances td a");
    for (var i = 0; i < aArr.length; i++) {
        var aObj = $(aArr[i]);
        var url = aObj.attr("href");
        var reg = new RegExp('[a-zA-z]+://[^\\s]+?/', 'gi');
        url = reg.exec(url)[0];
        aObj.after("<br/>");
        aObj.after(createSelect(url));
    }


    function createSelect(baseUrl) {


        var jsons = [
            {url: "info", name: "info"},
            {url: "swagger-ui.html", name: "swagger"},
            {url: "doc.html", name: "接口"},
            {url: "health", name: "健康"},
            {url: "mappings", name: "链接"},
            {url: "beans", name: "beans"},

            {url: "configprops", name: "配置"},
            //{url: "dump", name: "dump"},
            {url: "env", name: "环境变量"},
            {url: "autoconfig", name: "autoconfig"},
            {url: "loggers", name: "loggers"},
            {url: "incrementLogFile", name: "incrementLogFile"},
            {url: "trace", name: "trace"},
            // {url: "actuator", name: "self"},
            // {url: "jolokia", name: "jolokia"},
            // {url: "beans", name: "beans"},
            // {url: "env", name: "env"},
            // {url: "refresh", name: "refresh"},
            {url: "dump", name: "dump"},
            {url: "heapdump", name: "heapdump"},
            // {url: "service-registry", name: "service-registry"},
            //{url: "autoconfig", name: "autoconfig"},
            // {url: "logfile", name: "logfile"},
            {url: "auditevents", name: "auditevents"},
            {url: "metrics", name: "metrics"},
            {url: "features", name: "features"},
            //{url: "dump", name: "dump"},
            {url: "archaius", name: "archaius"},
            // {url: "incrementLogFile", name: "incrementLogFile"},
            // {url: "loggers", name: "loggers"},
            //{url: "trace", name: "trace"}
        ];


        var options = "";
        for (var i = 0; i < jsons.length; i++) {
            var json = jsons[i];
            // options += "<option value='" + baseUrl + json.url + "'>" + json.name + "</option>"
            options += "<a style='color: #01AAED' href='" + baseUrl + json.url + "' target='_blank'> " + json.name + "</a>"

        }

        // return "<select> " + options + "</select>"

        return "<span>[" + options + "]</span>";
    }


})();


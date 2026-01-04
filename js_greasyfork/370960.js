// ==UserScript==
// @name         Jitpack Getit Button Build Trigger
// @namespace    https://github.com/xiaoyao9184/
// @version      0.1
// @description  get it button trigger build
// @license      GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @author       xiaoyao9184
// @match        https://jitpack.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370960/Jitpack%20Getit%20Button%20Build%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/370960/Jitpack%20Getit%20Button%20Build%20Trigger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("hashchange", function(event){
        var viewPath = location.hash.substr(1);
        var projectPath = owner + "/" + project;
        if(viewPath === projectPath){
            return;
        }
        console.log("Request metadata for auto build: " + viewPath);
        var buildapi = "com/github/" + viewPath + "/maven-metadata.xml";
        $.ajax({
            type: "GET",
            url: buildapi,
            dataType: "xml"
        })
            .done(function(){
                console.log("Version build completed: " + viewPath);
            })
            .fail(function(err){
                console.err("Version build failure: " + viewPath);
            });
	});
})();
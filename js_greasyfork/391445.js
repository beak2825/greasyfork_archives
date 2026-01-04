// ==UserScript==
// @name           WebShare Uploaders
// @description    Show uploader emails (for admins only)
// @author         tteskac
// @namespace      tteskac
// @version    	   0.2.1
// @include        https://websharecloud.com/*
// @include        https://*.websharecloud.com/*
// @include        https://websharecloud.net/*
// @include        https://*.websharecloud.net/*
// @include        https://webshare-america.com/*
// @include        https://*.webshare-america.com/*
// @include        https://webshare-america.net/*
// @include        https://*.webshare-america.net/*
// @downloadURL https://update.greasyfork.org/scripts/391445/WebShare%20Uploaders.user.js
// @updateURL https://update.greasyfork.org/scripts/391445/WebShare%20Uploaders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(async function(){

        // Get list of all projects from API.
        var projects = await fetch('/project').then(function(response) {
            return response.json();
        }).then(function(jsonResponse) {
            return jsonResponse;
        });

        // Get project objects from DOM.
        var projectImageWrapper2 = getElementsByClassName("projectImageWrapper2", null, "div");


        for(var i = 0; i < projectImageWrapper2.length; i++) {
            var projectThumb = projectImageWrapper2[i];
            var thumbImageUrl = projectThumb.children[0].getAttribute('lozad-back-img');

            var result = thumbImageUrl.match(/data\/project\/.+\//gi);
            var projectName = result[0].split('/')[2];

            var project = projects.find((project) => { return project.Name === projectName; });

            var description = "";

            // Get user info.
            if (project.Uploader) {

                var user = await fetch('/admin/user/' + project.Uploader).then(function(response) {
                    return response.json();
                }).then(function(jsonResponse) {
                    return jsonResponse;
                });
                if (user && user.Email) {
                    description += user.Email;
                }
            }

            // Get project attr info.
            if (project.Public && project.Public === true) {
                description += " (PUB)";
            }
            if (project.Featured && project.Featured === true) {
                description += " (FEAT)";
            }

            // Add text element.
            var node = document.createElement("p");
            node.setAttribute("style", "color: white; position: absolute; margin-left: 10px;");
            var textnode = document.createTextNode(description);
            node.appendChild(textnode);
            projectThumb.appendChild(node);
            console.log("Uploader for '" + projectName + "': " + user.Email);

        }
        console.log("Done.");

    }, 3000);

})();

// Helper
function getElementsByClassName(classname_, node, tagName) {
    tagName=(typeof(tagName) === 'undefined')?"*":tagName;
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var classes = classname_.split(',');

    for(var cid in classes) {
        var classname = classes[cid];
        var re = new RegExp('\\b' + classname + '\\b');
        var els = node.getElementsByTagName(tagName);
        for(var i=0,j=els.length; i<j; i++) {
            if(re.test(els[i].className))a.push(els[i]);
        }
    }

    return a;
}
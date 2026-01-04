// ==UserScript==
// @name         WCM Utilities
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       You
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ui
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ccpro.filesys
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ccpro.switch_ui
// @match        http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.ccpro.show_custom_tab*
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/370269/WCM%20Utilities.user.js
// @updateURL https://update.greasyfork.org/scripts/370269/WCM%20Utilities.meta.js
// ==/UserScript==

function downloadText(text, title) {
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([text], { type: 'text/plain' }));
    a.download = title;

    // Append anchor to body.
    document.body.appendChild(a);
    a.click();

    // Remove anchor from body
    document.body.removeChild(a);
}

var result = [];

var wcm_url = "http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.group.ccpro.list_directory?vpath="

function arrayToCSV (twoDiArray) {
    var csvRows = [];
    for (var i = 0; i < twoDiArray.length; ++i) {
        for (var j = 0; j < twoDiArray[i].length; ++j) {
            twoDiArray[i][j] = '\"' + twoDiArray[i][j] + '\"';
        }
        csvRows.push(twoDiArray[i].join(','));
    }
	return csvRows.join('\r\n');
}

function crawl_wcm(url, root) {
    if (root) {
        url = wcm_url + prompt("Enter the root path");
    }
    var response = $.ajax({ type: "GET", url: url, async: false }).responseText;
    var $content = $('<div/>').html(response).contents();

    $content.find("#tbody_filesystem_list").find('.iw-base-link, .iw-base-link-disabled').each(function() {
        try {

            if ($(this).attr('id').indexOf('list_directory') !== -1) {
                crawl_wcm($(this).attr('href'));
            } else if ($(this).attr('id').indexOf('view_file') !== -1) {
                result.push(
                    [
                        $(this).text().replace(/\n/ig, '').trim(),
                        url.split('vpath=')[1],
                        (url.indexOf('templatedata') !== -1 ? '' : url.split('vpath=')[1]
                            .replace('//ulvuidp16.fg.rbc.com/rbc-intranet/main/intranet/WORKAREA/content/', 'http://rbcnet.fg.rbc.com/')
                            .replace('/rbcnet/', '/')
                            .replace('/rbcnet_fr/', '/fr/')
                            .replace('/sites/', '/') + '/' + $(this).text().replace(/\n/ig, '').trim()
                        ),
                        $(this).closest('tr').find('td').eq(2).text().replace(/\n/ig, '').trim(),
                        $(this).closest('tr').find('td').eq(3).text().replace(/\n/ig, '').trim()
                    ]
                );
            }
        } catch (e) {}
    })
    console.log(result.length + " " + url);
    if (root) {
        var filename = prompt("Enter the filename");
        if (filename) {
            // downloadText(JSON.stringify(result), filename + ".json");
            downloadText(arrayToCSV(result), filename + ".csv");
        }
    }
}

function bulk_copy() {
    var filenames = prompt("Enter a list of filenames(without the extension) separated by commas");

    filenames = filenames.split(",");

    var branch = prompt("Enter the branch name (e.g. dinet-home)");
    var path = prompt("Enter the DESTINATION FOLDER of your new files relative to the branch without leading slash with trailing slash (e.g. sites/dinet-home/trading-support/trading-guidelines/)");
    var extension = prompt("Enter the extension of your new files (e.g. .page)");

    // var source = "template.page";
    var source = prompt("Enter the FULL vpath of your source file (e.g. //ulvuidp16.fg.rbc.com/default/main/dinet/WORKAREA/default/sites/dinet-home/template.page)");

    filenames.forEach(function(filename){
    	var post_data = {
	        "full_redirect": "true",
	        "done_page": "/iw-cc/command/iw.group.ccpro.list_directory?vpath=//ulvuidp16.fg.rbc.com/default/main/" + branch + "/WORKAREA/default/" + path,
	        "dest.vpath": "//ulvuidp16.fg.rbc.com/default/main/" + branch + "/WORKAREA/default/" + path + filename + extension,
	        "dest.vpath-area": "//ulvuidp16.fg.rbc.com/default/main/" + branch + "/WORKAREA/default",
	        // "vpath": "//ulvuidp16.fg.rbc.com/default/main/" + branch + "/WORKAREA/default/" + path + source,
	        "vpath": source,
	        "dest.vpath-arp": "/" + path + filename + extension
	    }
    	$.ajax({
                type: "POST",
                url: "http://internal.rbcwcm.fg.rbc.com/iw-cc/command/iw.group.copy",
                data: post_data,
                async : false,
                success: function(data) {
                    console.log(filename);
                },
            });
    })
}

function bulk_nodes(){
	var nodes =  prompt(
`Enter a JSON string of page path/page title pairs.for example:
{
    "contact-us": "Nous joindre",
    "product-fact-sheet/index": "infofiches présentent",
}`);


	var BRANCH = prompt("Enter the branch name (eg. cb-hef)");
	var SITE = prompt("Enter the site name (eg. cb-hef_fr");
	var TARGET_NODE = prompt("Enter the target node (eg. jgidr37n:0:jihyrsob:)");
	var url = "http://internal.rbcwcm.fg.rbc.com/iw-cc/Site/SiteMap.do"
    var data = {
        vpath: "//ulvuidp16.fg.rbc.com/default/main/" + BRANCH + "/WORKAREA/default/sites/" + SITE + "/default.sitemap",
        targetNodeId: TARGET_NODE,
        method: "createNode",
        nodeId: "",
        position: "2",
        "nodeDetails.description": "",
        "nodeDetails.resourceKey": "",
        "nodeDetails.linkType": "page",
        "page-picker": "list",
        "nodeDetails.linkTarget": "",
        "nodeDetails.linkPopupId": "large-popup",
        "nodeDetails.visibleInSiteMap": "on",
        "nodeDetails.visibleInBreadCrumbs": "on",
        "nodeDetails.allowChildren": "on",
    }

    for (var key in nodes){
        data["nodeDetails.name"] = nodes[key];
        data["nodeDetails.url"] = key;
        data["pageTargetHidden"] = key;
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            async : false,
            success: function(data) {
                console.log(data);
            },
        });
    }

}

$(function() {
    'use strict';
    $("#Tabs ul").append(`<li>
            <div class="iw-base-tab-left"></div>
            <div class="iw-base-tab-middle">
            <a class="iw-base-tab-down-text crawl">Crawl</a>
            </div>
            <div class="iw-base-tab-right"></div>
        </li>`)
    $("body").on("click", ".iw-base-tab-down-text.crawl", function() {
        crawl_wcm("", true);
    })
    $("#Tabs ul").append(`<li>
            <div class="iw-base-tab-left"></div>
            <div class="iw-base-tab-middle">
            <a class="iw-base-tab-down-text copy">Copy</a>
            </div>
            <div class="iw-base-tab-right"></div>
        </li>`)
    $("body").on("click", ".iw-base-tab-down-text.copy", function() {
        bulk_copy();
    })
    $("#Tabs ul").append(`<li>
            <div class="iw-base-tab-left"></div>
            <div class="iw-base-tab-middle">
            <a class="iw-base-tab-down-text bulknodes">Add Nodes</a>
            </div>
            <div class="iw-base-tab-right"></div>
        </li>`)
    $("body").on("click", ".iw-base-tab-down-text.bulknodes", function() {
        bulk_nodes();
    })
})

// ==UserScript==
// @name         Clicdata Better Tab Names
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  Improve navigation in Clicdata when using multiple tabs.
// @author       Lars Corneliussen (lc@talendos.com)
// @match        https://*.clicdata.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399103/Clicdata%20Better%20Tab%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/399103/Clicdata%20Better%20Tab%20Names.meta.js
// ==/UserScript==

window.setTimeout(
    () => (function($) {
    'use strict';


    function find(selector){
        var topFound = $(selector);
        if (topFound && topFound.length) return topFound;

        for (const iframe of $('iframe')) {
           var iframe_doc = iframe && iframe.contentWindow && iframe.contentWindow.document
           var $iframe = iframe_doc && $(iframe_doc);
           var found = $iframe && $iframe.find(selector);
           if (found && found.length) return found;
        }
    }

    var lastTitle = null;
    function refreshTitle() {
        //console.log("Refreshing the title");

        var title = null;
        var type = null;
        var toolbarName = find('#toolbar_name');
        if (toolbarName) {
            title = toolbarName.text();
        }

        if (!title) {
            var dataName = find('#data_name');
            if (dataName) {
                title = dataName.text();
            }
        }

        if (!title) {
            var folderName = find('.current-folder');
            if (folderName) {
                title = folderName.text();
                if (document.location.href.indexOf('/dashboards/') !== -1){
                    type = "📊 📁"
                }
                else type = '📁';
            }
        }

        if (!title) {
            var explorerName = find('.explorerTitle .mainText');
            if (explorerName){
                title = explorerName.text();
                if (document.location.href.indexOf('/data/') !== -1){
                    type = "Data"
                }
            }
        }


        if (document.location.href.endsWith('/tasks')){
            var running = find('.task.item[value="running"] .number');
            var queued = find('.task.item[value="queued"] .number');
            title = "Tasks" + (running ? " " + running.text() + (queued ? " <- " + queued.text() : "") : "")
        } else if (!type && (document.location.href.indexOf('/dashboard/') !== -1 || document.location.href.indexOf('/dashboards/') !== -1)){
            type = "📊"
        } else if (!type && document.location.href.indexOf('/data/transform') !== -1){
            type = "$"
        } else if (!type && document.location.href.indexOf('/data/merge') !== -1){
            type = ">"
        } else if (!type && document.location.href.indexOf('/data/fusion') !== -1){
            type = "+"
        } else if (document.location.href.indexOf('/v/') !== -1){
            title = document.location.href.substring(document.location.href.lastIndexOf('/')+1)
            type = "Live"
        }

        if (!title) {
            if (document.location.href.lastIndexOf('#') !== -1) {
                title = document.location.href.substring(document.location.href.lastIndexOf('#')+1);
            } else {
                title = document.location.href.substring(document.location.href.lastIndexOf('/')+1);
            }
            type = "";
        }


        if (title && (title != lastTitle)) {
            lastTitle = title;

            var fullTitle = (type ? (type + " ") : "") + title;
            document.title = fullTitle;
            window.history.pushState({}, fullTitle, window.location.href)
            console.log("Title should be", fullTitle, "and is", document.title);
        }
    }
    refreshTitle()
    setInterval(refreshTitle, 1000)


    var lastViewNameList = null;

    setInterval(() => {
        var recIds = find('li>div[recId]');
        var viewNameList = recIds && recIds.toArray().map((r) => '-- V000000' + $(r).attr('recid') + ' ' + $(r).parent().find('.titleColumn .name').attr('title')).join('\r\n')
        var lastTop1Timings = recIds && recIds.toArray().map((r) => 'SET @t1 = GETDATE(); SELECT TOP 1 * from V000000' + $(r).attr('recid') + '; SET @t2 = GETDATE(); PRINT \'' + $(r).parent().find('.titleColumn .name').attr('title').trim() + ':\' + CAST(DATEDIFF(millisecond,@t1,@t2) as VARCHAR)  + \' ms\'').join('\r\n')

        if (viewNameList != lastViewNameList) {
            console.log(viewNameList);
            console.log(lastTop1Timings);
            lastViewNameList = viewNameList;
        }
    }, 5000)

})(window.jQuery), 2000)
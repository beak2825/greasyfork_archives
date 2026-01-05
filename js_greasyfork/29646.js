// ==UserScript==
// @name         Print JIRA Issues
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Will clean up any printing JIRA issues page, changing it into wiki markwdown
// @author       You
// @match        https://lumentech.atlassian.net/sr/jira.issueviews:searchrequest-printable/temp/SearchRequest.html?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29646/Print%20JIRA%20Issues.user.js
// @updateURL https://update.greasyfork.org/scripts/29646/Print%20JIRA%20Issues.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Starting user script - Print JIRA");
    var priority = document.getElementsByClassName("priority");
    var issuekey = document.getElementsByClassName("issuekey");
    var summary = document.getElementsByClassName("summary");
    var type = document.getElementsByClassName("issuetype");
    var l = issuekey.length;
    var fullhtml = "";
    var lastType = "";
    var issueType = "";
    var issuesHTMLArray = [];
    for(var i = 0; i < l; i++) {
        issueType = type[i].children[0].children[0].alt;

        if (issueType != lastType) {
            issuesHTMLArray[issueType] = "<br/><br/>====" + issueType + "====<br /><br/>";
        }

        var issueURL = issuekey[i].children[0].href;
        
        var priorityString = priority[i].children[0].alt.toLowerCase();
        var priorityTitle = priority[i].children[0].title;
        priorityString = "[[File:priority-"+priorityString+".png|16px|"+priorityTitle+"]]";
        
        issuesHTMLArray[issueType] += "* " + priorityString + " [[" + issueURL + " " + issuekey[i].innerHTML.trim() + "]] ";
        issuesHTMLArray[issueType] += summary[i].children[0].children[0].innerHTML;
        issuesHTMLArray[issueType] += "<br />";

        lastType = issueType;
    }

    document.getElementById("jira").innerHTML = issuesHTMLArray.Story;
    document.getElementById("jira").innerHTML += issuesHTMLArray.Task;
    document.getElementById("jira").innerHTML += issuesHTMLArray.Bug;    



})();
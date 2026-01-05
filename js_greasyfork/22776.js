// ==UserScript==
// @name        Dent JIRA Links
// @namespace   http://github.com/
// @description Link JIRA issues by patterns. Change variables below to match your issue pattern and JIRA URL
// @include     https://dentsplysirona.visualstudio.com/*
// @version     10
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/22776/Dent%20JIRA%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/22776/Dent%20JIRA%20Links.meta.js
// ==/UserScript==

localStorage['issue-patterns'] = "DENT((DTSS)|(ECOM)|(LMS))?-\\d+";
localStorage['jira-url'] = "https://jiraeu.epam.com/";

function replaceInElement(element, find) {
    for (var i= element.childNodes.length; i-->0;) {
        var child= element.childNodes[i];
        if (child.nodeType==1) {
            var tag= child.nodeName.toLowerCase();
            if (tag!='style' && tag!='script')
                replaceInElement(child, find);
        } else if (child.nodeType==3) { // TEXT_NODE
            replaceInText(child, find);
        }
    }
    if (!element.hasChildNodes()){
        var match;
        var matches= [];
        var text = element.outerHTML;
        while (match= find.exec(text)){
            matches.push(match);
        }
        for (var j=0; j < matches.length; j++) {
            match= matches[j];
            element.parentNode.insertBefore(createLinkFromID(match), element);
            element.parentNode.insertBefore(document.createTextNode(' '), element);
        }
    }
}

function replaceInText(text, find) {
    var match;
    var matches= [];
    while (match= find.exec(text.data))
        matches.push(match);
    for (var i= matches.length; i-->0;) {
        match= matches[i];
        var initialText = text.textContent;
        text.splitText(match.index);
        text.nextSibling.splitText(match[0].length);
        if(text.parentNode.innerHTML === match[0]){
            text.parentNode.appendChild(document.createTextNode(' '));
            var linkChild = createLinkFromID(match);
            linkChild.textContent = ' (JIRA)';
            text.parentNode.appendChild(linkChild);
        } else {
            var parent = text.parentNode;
            text.parentNode.replaceChild(createLinkFromID(match), text.nextSibling);
        }
    }
}

function createLinkFromID(match) {
    var link= document.createElement('a');
    var jiraUrl = localStorage['jira-url'];
           
    link.href= jiraUrl + 'browse/' + match[0].replace(/([A-Z]+)(\d+)/,'\$1-\$2');
    link.setAttribute('target', '_blank');
    link.appendChild(document.createTextNode(match[0]));
    return link;
}

setTimeout(function() {
    var find = new RegExp('\(' + localStorage['issue-patterns'] + '\)', 'gi');

    replaceInElement(document.body, find);
}, 1000);
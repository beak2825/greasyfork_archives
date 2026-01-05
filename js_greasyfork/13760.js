// ==UserScript==
// @name         View Reddit Comments On Click
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows you to preview a comments on a reddit post when clicked over a 'comment' link
// @author       divide100
// @match        *://www.reddit.com/*
// @require https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=46106
// @downloadURL https://update.greasyfork.org/scripts/13760/View%20Reddit%20Comments%20On%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/13760/View%20Reddit%20Comments%20On%20Click.meta.js
// ==/UserScript==
/* jshint -W097 */

var util = {
    log: function () {
        var args = [].slice.call(arguments);
        args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: purple;');
        console.log.apply(console, args);
    },
    q: function(query, context) {
        return (context || document).querySelector(query);
    },
    qq: function(query, context) {
        return [].slice.call((context || document).querySelectorAll(query));
    },
    xmlReq: function(url, cb){
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.onload = cb;
        xhr.send();
    }
};

var SCRIPT_NAME = "Comment Viewer";

util.log('Starting');


waitForElems('.comments', function(link) {
    link.onclick = function(e) {
        if(e.shiftKey && e.ctrlKey) {
            var overlay = util.q('#myCmntOverlay');
            if(!overlay) {
                overlay = document.createElement('div');

                overlay.style.background = 'white';
                overlay.style.zIndex = '999';
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.background = 'rgba(0,0,0,0.5)';
                overlay.id = 'myCmntOverlay';

                overlay.onclick = function(e) {
                    if(e.target.id == 'myCmntOverlay') {
                        var body = util.q('body');
                        body.style.overflow = 'auto';
                        overlay.style.display = 'none';
                    }
                }

                var commentThread = document.createElement('div');

                commentThread.style.background = 'white';
                commentThread.style.width = '750px';
                commentThread.style.maxHeight = '90%';
                commentThread.style.overflow = 'scroll';
                commentThread.style.border = '1px solid #666';
                commentThread.style.margin = '5% auto';
                commentThread.style.borderRadius = '5px';
                commentThread.style.padding = '5px';

                util.xmlReq(link.href, function(xhe, args) {
                    var parEntries = util.qq('.nestedlisting > .comment > .entry', xhe.target.response.body);
                    for(var i = 0; i < 5; i ++) {
                        var entry = document.createElement('div'); 
                        var curEntry = parEntries[i];
                        var author = util.q('.author', curEntry).cloneNode(true);
                        entry.appendChild(author);
                        
                        commentThread.appendChild(entry);
                    }
                });

                overlay.appendChild(commentThread);
                document.body.appendChild(overlay);
            }
            else {
                util.xmlReq(link.href, function(xhe, args) {
                    util.q('#myCmntOverlay').childNodes[0].innerHTML = util.q('.commentarea', xhe.target.response.body).innerHTML;
                });
            }
            var body = util.q('body');
            body.style.overflow = 'hidden';
            overlay.style.display = 'inline';
        }
    }
});;
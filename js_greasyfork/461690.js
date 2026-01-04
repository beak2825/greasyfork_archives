// ==UserScript==
// @name         LiveJournal Comments expander
// @namespace    Whiletruedoend
// @original-script https://gist.github.com/Whiletruedoend
// @original-script https://greasyfork.org/ru/scripts/461690-livejournal-comments-expander
// @version      1.1
// @description  allows you to automatically expand all comments on the page
// @author       Whiletruedoend
// @match        *.livejournal.com/*
// @match        livejournal.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livejournal.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/461690/LiveJournal%20Comments%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/461690/LiveJournal%20Comments%20expander.meta.js
// ==/UserScript==

function expandComments(doc){
	var comm_style_1 = doc.querySelectorAll('[id^="expand_"], [class^=" mdspost-comment-actions__item  mdspost-comment-actions__item--expandchilds   "]');

	if (comm_style_1.length > 0){
		for (var i in comm_style_1) {
			var elem_1 = comm_style_1[i].lastChild;
			if (elem_1 && elem_1.nodeName!="#text"){
				elem_1.click();
			}
		}
	} else {
        setTimeout(function() {
            var comm_style_2 = doc.querySelectorAll('[class^="b-pseudo"]');
            if (comm_style_2.length > 0){
                for (var j in comm_style_2) {
                    var elem_2 = comm_style_2[j];
                    var elem_2_child = elem_2.lastChild;
                    // && elem_2_child && elem_2_child.nodeValue == "Expand"
                    if (elem_2 && elem_2_child && elem_2_child.nodeValue=="Expand"){
                        elem_2.click();
                    }
                }
            }
        }, 2000);
    }
}

expandComments(document);
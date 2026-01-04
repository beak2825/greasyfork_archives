// DuckDuckGo RTL
// 2018-11-10
// Copyright (c) 2018s Guy Sheffer (GuySoft)
// Based on work by Yehuda Bar-Nir NewTwitter  https://userscripts-mirror.org/scripts/show/90965
// Which came from "Twitter Unicode Hashtags + RTL support" - https://userscripts-mirror.org/scripts/show/82584
// and themiddleman: "runOnTweets" - https://userscripts-mirror.org/scripts/show/82719
// -- Thanks guys.
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the "Software"), to deal in the Software without
// restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the
// Software is furnished to do so, subject to the following
// conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
// OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
// WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
// OTHER DEALINGS IN THE SOFTWARE.
//
// ==UserScript==
// @name           DuckDuckGo RTL
// @namespace      https://duckduckgo.com/
// @description    Adds RTL support to DuckDuckGo
// @include        http://duckduckgo.com/*
// @include        https://duckduckgo.com/*
// @grant          none
// @version 0.0.1.20181110132943
// @downloadURL https://update.greasyfork.org/scripts/374210/DuckDuckGo%20RTL.user.js
// @updateURL https://update.greasyfork.org/scripts/374210/DuckDuckGo%20RTL.meta.js
// ==/UserScript==

function pageRunner(e) {
	var elements=["result__body links_main links_deep"];
	    //elements.push("UFICommentContent");// comment in group
	    
        for (var j=0; j < elements.length; j++) {
	      if(e.target && e.target.getElementsByClassName){
		    var statuses = e.target.getElementsByClassName(elements[j]);
		    if (statuses != null && statuses.length > 0) {
			    var isThereRTLChars=/[\u0590-\u05ff\u0600-\u06ff]/;
			    
			    for (var i = 0; i < statuses.length; i++) {
				    var tweetText = statuses[i].innerHTML; 
				    if (isThereRTLChars.test(tweetText)) {
					    statuses[i].style.direction="rtl";
					    statuses[i].style.textAlign="right";
				    }
				    else{
					    statuses[i].style.direction="ltr";
					    statuses[i].style.textAlign="left";
				    }
			    }
		    }
	      }
	}
  }

runOnPage();
pageRunner();

function runOnPage(callback) {
	document.addEventListener("DOMNodeInserted", pageRunner, true);
}
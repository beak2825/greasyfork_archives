// ==UserScript==
// @name         知乎免登录-关怀模式
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  老子就不登录
// @author       maoanran@gmail.com
// @match        https://www.zhihu.com/explore
// @grant        GM_addStyle
// @match        *://www.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @exclude      https://www.zhihu.com/signin*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497276/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95-%E5%85%B3%E6%80%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497276/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E5%BD%95-%E5%85%B3%E6%80%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var viewAllButton = false;

    // Function to process links and update their href
    function processLinks(links) {
        links.forEach(link => {
            if (link.href.startsWith("https://www.zhihu.com/question")){
                link.href = link.href.replace("https://www.zhihu.com/question", "https://www.zhihu.com/aria/question");
            }
            if (window.location.href.startsWith("https://www.zhihu.com/aria/question") && isZhihuAriaQuestionAnswerUrl(link.href)) {
                const newLink = document.createElement("button");
                newLink.textContent = "跳转看评论";
                newLink.onclick = function(){
                    window.open(link.href.replace("https://www.zhihu.com/aria/question", "https://www.zhihu.com/question"))
                };

                // Insert the new link after the existing one
                link.parentNode.insertBefore(newLink, link.nextSibling);
                link.parentNode.insertBefore(document.createElement("br"), link.nextSibling);
                link.parentNode.insertBefore(document.createElement("br"), link.nextSibling);
            }
        });
    }

    function isZhihuAriaQuestionAnswerUrl(url) {
        // Define the regular expression pattern
        const pattern = /^https:\/\/www\.zhihu\.com\/aria\/question\/\d+\/answer\/\d+$/;
        // Test the URL against the pattern
        return pattern.test(url);
    }

    // Initial processing of existing links
    var div_list = document.querySelectorAll('A'); // returns NodeList
    processLinks([...div_list]); // converts NodeList to Array and processes links

    // Create a MutationObserver to watch for new nodes being added to the document
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Ensure the added node is an element
                    if (node.tagName === 'A') {
                        processLinks([node]); // Process the new link element
                    } else {
                        // Process all new links within the added node
                        var newLinks = node.querySelectorAll('A');
                        processLinks([...newLinks]); // converts NodeList to Array and processes links
                    }


                    var viewAll = document.querySelector('div.ViewAll');
                    if (viewAll != null && !viewAllButton) {
                        viewAllButton = true;
                        viewAll.textContent = "跳转到关怀模式查看全部";
                        viewAll.onclick = function(){
                            window.open(window.location.href.replace("https://www.zhihu.com/question", "https://www.zhihu.com/aria/question"))
                        };
                    }
                    var header = document.querySelector('header.AppHeader');
                    if (header != null) {
                        document.querySelector('header.AppHeader').style = "display: block !important"
                    }
                 }
            });
        });
    });

    // Configure the observer to watch for child nodes being added to the body
    observer.observe(document.body, { childList: true, subtree: true });


    GM_addStyle(`
	html{
		overflow: scroll !important;
	}

	header.AppHeader {
		display: none !important;
	}
	.Modal-wrapper,.Modal-enter-done{
		display: none !important;
	}
    `)
})();
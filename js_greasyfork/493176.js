// ==UserScript==
// @name         Hide "Follow posts" for Facebook.
// @version      1.2
// @description  Get rid of those annoying posts from those i'm not following
// @match        https://www.facebook.com/*
// @grant        none
// @author       Cuong Tran
// @namespace https://greasyfork.org/en/users/1291782-tran-huu-phu-cuong
// @downloadURL https://update.greasyfork.org/scripts/493176/Hide%20%22Follow%20posts%22%20for%20Facebook.user.js
// @updateURL https://update.greasyfork.org/scripts/493176/Hide%20%22Follow%20posts%22%20for%20Facebook.meta.js
// ==/UserScript==

//Whenever the page changes
(function() {
    function onElementInserted(containerSelector, elementSelector, callback) {
        var onMutationsObserved = function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length) {
                    [].map.call(mutation.addedNodes, function(el) {
                        if (!el || !el.querySelector) return;
                         // console.log('New inserted element', el)
                          callback(el)
                        if (el.classList.contains('html-div')) {
                         // callback(el)
                        } else {
                          // var elements = el.querySelectorAll(elementSelector);
                          //for (var i = 0, len = elements.length; i < len; i++) {
                           // callback(elements[i]);
                          // }
                        }
                    });
                }
            });
        };

        var target = document.querySelector(containerSelector);
        var config = { childList: true, subtree: true };
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(onMutationsObserved);
        observer.observe(target, config);
    }


    onElementInserted('body', 'div', function(element) {
        const els = Array.from(element.querySelectorAll('div[role="button"]'));

        if(els.some(el => el.innerHTML.contains('Follow'))) {
            element.firstChild.style.display = 'none';
            const newdiv = document.createElement('div');
            newdiv.innerHTML = `
            <div style="background: #fff3cd; margin-top: 4px; border: 1px solid #ffc107; padding: 8px 12px; border-radius: 4px; color: #856404; font-size: 14px;">1 post hidden. Rule: UNFOLLOWING AUTHOR</div>
            `
            element.appendChild(newdiv);
        }
        // if (element.innerText.substring(0,2) !== 'Ad') return;
        // console.log(element);
        //    element.style.display = "none";
    });

})();

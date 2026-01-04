// ==UserScript==
// @name         SSC Likes
// @namespace    http://skyscrapercity.com/
// @version      0.1
// @description  collapse likes list
// @author       bad455
// @match        https://www.skyscrapercity.com/showthread.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370683/SSC%20Likes.user.js
// @updateURL https://update.greasyfork.org/scripts/370683/SSC%20Likes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    addStyles();
    hidePosts();

    function hidePosts() {
        var posts = document.querySelectorAll('[id*="dbtech_thanks_entries"]');

        [].forEach.call(posts, function(post) {
            var likes = post.querySelectorAll('a[href*="member.php"]:nth-of-type(n+6)');
            var num = likes.length;

            if(num === 0) {
                return;
            }

            var i = 0, lastNode;
            [].forEach.call(post.querySelector('div.smallfont').childNodes, function(node) {
                if((node.nodeType === Node.ELEMENT_NODE) && (node.nodeName.toLowerCase() === 'a')) {
                    i++;

                    if(i < 6) {
                        return;
                    }
                }

                if((node.nodeType === Node.TEXT_NODE) && (node.textContent.toLowerCase().length)) {
                    var content = node.textContent;
                    var wrapper = document.createElement('span');

                    wrapper.textContent = content;
                    node.parentElement.insertBefore(wrapper, node);
                    node.remove();
                    node = wrapper;
                }

                if((i < 5) || (node.nodeType !== Node.ELEMENT_NODE)) {
                    return;
                }

                lastNode = node;
                node.style.display = 'none';
            });

            if(lastNode) {
                var toggle = document.createElement('a');

                toggle.textContent = 'and ' + num + ' more';
                toggle.href = '#!';
                toggle.style.marginLeft = '0.5em';
                toggle.style.fontWeight = '700';

                toggle.addEventListener('click', function() {
                    this.remove();
                    [].forEach.call(post.querySelectorAll('a,span'), function(el) {
                        el.style.display = '';
                    });
                });

                lastNode.style.display = '';
                lastNode.parentElement.insertBefore(toggle, lastNode);
            }
        });
    }

    function addStyles() {
        var css = '[id*="dbtech_thanks_block_"] > table { width: 100% !important; }';

        var style = document.createElement('style');

        style.type = 'text/css';
        if(style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.head.appendChild(style);
    }
})();
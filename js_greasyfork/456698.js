// ==UserScript==
// @name         YouTube Live Translation Collector
// @namespace    https://github.com/Gestalte/youtube-live-translation-collector
// @version      1.2
// @description  Creates a window in YouTube's live chat window, that shows live translations and spanner comments.
// @author       https://github.com/Gestalte
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/456698/YouTube%20Live%20Translation%20Collector.user.js
// @updateURL https://update.greasyfork.org/scripts/456698/YouTube%20Live%20Translation%20Collector.meta.js
// ==/UserScript==

var commentIdentifier = (function() {
    // Final Regex: /^\/?((英訳|英訳\/en|en|tr|translation)\s?(:|-|\})|\[(英訳|英訳\/en|en|tr|translation)\]|(英訳|英訳\/en|en|tr|translation)\\s)/i
    
    var basePattern = "^\\/?((§)\\s?(:|-|\\})|\\[(§)\\]|(§)\s)";
    var thingsToMatch = ["英訳", "英訳\/en", "en", "tr", "translation"];
    var pattern = basePattern.replace(/§/g, thingsToMatch.join('|'));

    return {
        isTranslation: function (txt) {
            return RegExp(pattern, 'i').test(txt)
        },
        isSpecial: function(author) {            

            if (author === null ) {
                return false;
            }

            return author.classList 
                ? (author.classList.contains('moderator') || author.classList.contains('owner')) 
                : author.content.author.classes.indexOf('moderator') > -1;
        },
        identify: function(node) {
            let authorElement = node.querySelector('#author-name');
            let messageElement = node.querySelector('#message');
        
            let message = messageElement.innerText.trim();

            if(commentIdentifier.isSpecial(authorElement) || commentIdentifier.isTranslation(message)) {
                monitor.stickComment(node);
            }
        }
    }
}());

var monitor = (function(){
    return {
        setupWindow: function() {
            // This creates a window at the top of the live chat window 
            // where translations and spanner comments will appear.
            let sticky = document.createElement('div');
            let ticker = document.getElementById('ticker');

            sticky.id = 'sticky';
            sticky.style.maxHeight = '30%';
            sticky.style.overflow = 'auto';
            
            ticker.parentNode.insertBefore(sticky, ticker);
        },
        init: function() {
            let chatItems = document.querySelector('#items.style-scope.yt-live-chat-item-list-renderer');

            // stick items that exist on load
            chatItems.querySelectorAll('yt-live-chat-text-message-renderer').forEach(commentIdentifier.identify); 

            // stick mutations
            let observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach(commentIdentifier.identify);
                });
            });

            // start the observer
            observer.observe(chatItems, { childList: true });
        },
        stickComment: function(node) {
            let sticky = document.getElementById('sticky');

            sticky.appendChild(node);

            let chat = document.querySelector('#chat');
            
            let itemScroller = chat.querySelector('#item-scroller');
            itemScroller.scrollTop = itemScroller.scrollHeight;   
            sticky.scrollTop = sticky.scrollHeight;
        }
    }
}());

(function(){    
    monitor.setupWindow();    
    window.top.addEventListener('load', monitor.init());
})();

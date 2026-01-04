// ==UserScript==
// @name         Twitter Post Remover
// @namespace    juicefish
// @version      0.0.1
// @description  None
// @author       Juicefish
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39502/Twitter%20Post%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/39502/Twitter%20Post%20Remover.meta.js
// ==/UserScript==

//Returns true if it is a DOM node
function isNode(o){
    return (
        typeof Node === "object" ? o instanceof Node :
        o && typeof o === "object" && typeof o.nodeType === "number" && typeof o.nodeName==="string"
    );
}

//Returns true if it is a DOM element
function isElement(o){
    return (
        typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
        o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName==="string"
    );
}

function addObserverIfDesiredNodeAvailable() {
    window.setTimeout(addObserverIfDesiredNodeAvailable,500);

    var dateLinks = document.getElementsByClassName('tweet-timestamp js-permalink js-nav js-tooltip');
    if(!dateLinks) {
        return;
    }
    var config = {
        attributes: true,
        attributeFilter: ['class'],
        childList: false,
        characterData: false
    };

    for (var index in dateLinks) {
        var dateLink = dateLinks[index];
        if(isNode(dateLink) && dateLink.getAttribute("isAddon") === null)
        {
            var btn = document.createElement("BUTTON");  // Create a <button> element
            dateLink.removeAttribute("href");            // Avoid Action for date link to other page
            dateLink.setAttribute("isAddon", 'true');    // Add attribute to determind if button is added
            dateLink.appendChild(btn);                   // Append button after date link
            btn.appendChild(document.createTextNode("　DELETE POST　"));
			btn.addEventListener( "click", function ( event ) {
				event.stopPropagation();
				event.stopImmediatePropagation();
                var sourceNode = this.parentNode;
                var postID = sourceNode.getAttribute('data-conversation-id');
                var clientID = document.getElementById('authenticity_token').getAttribute("value");
                var postURL = "https://twitter.com/i/tweet/destroy";
                console.log('Delete Post : ' + postID + ' @ UserID : ' + clientID);

                // Post the delete information to Twitter
                // It will affect twitter view after Refresh Page
                $.ajax({
                    url: "/i/tweet/destroy",
                    data: {
                        authenticity_token: clientID,
                        id: postID,
                    },
                    type:"POST",
                    dataType:'text',
                    success: function(msg){
                    },
                    error:function(xhr, ajaxOptions, thrownError){
                    }
                });
			}, true );


        }
    }
}

(function() {
    'use strict';
    addObserverIfDesiredNodeAvailable();
})();
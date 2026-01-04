// ==UserScript==
// @name        Discord Message Logger
// @namespace   -
// @match         https://discordapp.com/activ*
// @match         https://discordapp.com/channel*
// @match         https://discord.com/activ*
// @match         https://discord.com/channel*
// @match         https://discord.com/channels/*
// @include       https://discord.com/*
// @grant         none
// @version       1.0
// @author        Koyd
// @description   logs deleted discord messages
// @run-at        document-start
// @compatible    chrome
// @compatible    firefox
// @compatible    opera
// @compatible    edge
// @compatible    safari
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/479561/Discord%20Message%20Logger.user.js
// @updateURL https://update.greasyfork.org/scripts/479561/Discord%20Message%20Logger.meta.js
// ==/UserScript==

var allObservers = [];
var currentParent = null;

function disconnectAllObservers() {
    allObservers.forEach(function(observer) {
        observer.disconnect();
    });
    // Clear the array after disconnecting all observers
    allObservers = [];
}


function formatLoggedNode(node) {
    var text = "";

    var mediaContentNode = node.querySelector('.container_dbadf5');

    if (mediaContentNode) {
        // Convert all of it into plain text
        var mediaContentText = mediaContentNode.innerHTML;

        // Use regex to find links like 'https://cdn.discordapp.com/attachments*'
        var linkRegex = /https:\/\/cdn\.discordapp\.com\/attachments\/[^'"\s]*/g;
        var matches = mediaContentText.match(linkRegex);

        // Append the links to the text variable
        if (matches) {
            text += matches.join("\n");
        }

        // Delete the mediaContentNode from the main node
        mediaContentNode.remove();
    }

    var messageContentNode = node.querySelector('.contents_f41bb2')
    var textContentNode = messageContentNode.querySelector('.markup_a7e664.messageContent__21e69');
    textContentNode.style.color = 'red';

    var spanElement = textContentNode.querySelector('span');

    if (spanElement) {
        textContentNode.querySelector('span').innerHTML += "\n" + text;
    } else {
        // If span doesn't exist, create one and append text
        textContentNode.innerHTML = '<span>' + text + '</span>' + textContentNode.innerHTML;
    }

    return node;
};


function setupMutationObserver(parent) {
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.removedNodes.length > 0) {
                Array.from(mutation.removedNodes).forEach(function(node) {
                    if (node.classList && node.classList.contains('messageListItem__6a4fb')) {
                        // Check if the removed node has the specified class
                        var messageContentNode = node.querySelector('.contents_f41bb2')

                        var subTextNode = messageContentNode.querySelector('.markup_a7e664.messageContent__21e69');
                        
                         // Check if "isSending__6e109" class doesn't exist in the subnode
                        if (subTextNode && subTextNode.classList.contains('isSending__6e109')) {
                            return;
                        }

                        // Get the deleted message ID
                        var deletedIdMatch = node.id.match(/chat-messages-\d+-(\d+)/);
                        var deletedMessageId = deletedIdMatch ? parseInt(deletedIdMatch[1]) : null;

                        // Find the smallest index whose ID is greater than the deleted one
                        var minIndex = Array.from(parent.children).reduce(function(minIndex, child) {
                            var childIdMatch = child.id.match(/chat-messages-\d+-(\d+)/);
                            var childMessageId = childIdMatch ? parseInt(childIdMatch[1]) : null;

                            if (!isNaN(childMessageId) && childMessageId > deletedMessageId) {
                                return Math.min(minIndex, Array.from(parent.children).indexOf(child));
                            }

                            return minIndex;
                        }, Number.MAX_SAFE_INTEGER);

                        // Modify the node
                        node = formatLoggedNode(node);

                        // Append the modified node back to the parent at the calculated index
                        if (minIndex < Number.MAX_SAFE_INTEGER) {
                            parent.insertBefore(node, parent.children[minIndex]);
                        } else {
                            parent.insertBefore(node, parent.children[parent.children.length - 1]);
                        }
                    }
                });
            }
        });

      allObservers.push(observer)
    });


    // Configuration of the observer:
    var config = { childList: true };

    // Pass in the target node, as well as the observer options
    observer.observe(parent, config);
}

setInterval(function () {
    // Check if the URL is in the form https://discord.com/channels*
    if (!/^https:\/\/discord\.com\/channels/.test(window.location.href)) {
        // If not, disconnect observers and return
        disconnectAllObservers();
        currentParent = null;
        return;
    }

    var parent = document.querySelector('[data-list-id="chat-messages"]');

    if (!parent) {
        currentParent = null; // Set currentParent to null if the parent doesn't exist
        return;
    }

    if (parent !== currentParent) {
        // Disconnect observers only if the parent node has changed
        disconnectAllObservers();
        setupMutationObserver(parent);
        currentParent = parent; // Update the current parent
    }
}, 1000); // Check every 1000 milliseconds (1 second)

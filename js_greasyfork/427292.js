// ==UserScript==
// @name         Cleanup YouTube live chat for spam (r9k mode)
// @namespace    https://github.com/Zallist
// @version      0.6
// @description  Cleans up youtube live chat for simple spam - Repeated messages, overused emojis
// @author       Zallist
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @supportURL   https://github.com/Zallist/cleanup-youtube-chat/issues
// @downloadURL https://update.greasyfork.org/scripts/427292/Cleanup%20YouTube%20live%20chat%20for%20spam%20%28r9k%20mode%29.user.js
// @updateURL https://update.greasyfork.org/scripts/427292/Cleanup%20YouTube%20live%20chat%20for%20spam%20%28r9k%20mode%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var originalFetch = window.fetch;
 
    var hyperCleanup = {
        options: {
            // How many milliseconds back to check for spam
            spamTime: 360000,
 
            // How many times can the message be repeated before it looks like spam
            spamAllowedAmount: 2,
 
            // Strip spam messages that are the same but just have extra emojis
            spamAllowedAmountStrippingEmojis: 3,
 
            // Just strip out all-emoji messages?
            spamAllowedAmountForEmojiMessages: 1,
            
            // regex to use to strip characters
            stripCharactersRegex: '[^\\w\\u007F-\\uFFFF]'
        },
        cache: {}
    };
    
    hyperCleanup.stripCharacters = new RegExp(hyperCleanup.options.stripCharactersRegex, 'g');
    
    hyperCleanup.getMessageSymbol = function (messageText) {
        // Ignore case & remove non-word characters
        messageText = messageText.toLowerCase();
        messageText = messageText.replace(hyperCleanup.stripCharacters, '');
 
        // Return a symbol so we can't collide
        return Symbol.for( messageText );
    };
    
    hyperCleanup.messageCountSince = function (messageText, timeStart, timeEnd) {
        var count = 0;
        var symbol = hyperCleanup.getMessageSymbol(messageText);
        var cache = hyperCleanup.cache[symbol];
 
        if (cache) {
            for (var i = cache.length - 1; i >= 0; i--) {
                if (cache[i] >= timeStart && cache[i] <= timeEnd) {
                    count++;
                }
                else if (cache[i] < timeStart || cache[i] > timeEnd) {
                    // We can just delete it since we shouldn't care about it again
                    cache.splice(i, 1);
                }
            }
        }
 
        return count;
    };
    
    hyperCleanup.logMessage = function (messageText, message, messageTimeMilliseconds) {
        var symbol = hyperCleanup.getMessageSymbol(messageText);
        var cache = hyperCleanup.cache[symbol];
 
        if (!cache) { hyperCleanup.cache[symbol] = [messageTimeMilliseconds]; }
        else { cache.push(messageTimeMilliseconds); }
    };
 
    hyperCleanup.isSpamMessage = function (message, messageTimeMilliseconds) {
        var isSpam = false;
        var messageText = "", messageTextNoEmoji = "";
 
        // Build up message
        for (var iRun = 0; iRun < message.runs.length; iRun++) {
            var run = message.runs[iRun];
 
            if (run.text) {
                messageText += run.text;
                messageTextNoEmoji += run.text;
            }
            else if (run.emoji) {
                messageText += "[emoji:" + run.emoji.emojiId + "]";
            }
        }
 
        // It's not a message we can read? Just skip it, might be important
        // Alternatively it's ALL special characters that got stripped
        if (messageText.length < 1) return false;
 
        var spamStartCheck = messageTimeMilliseconds - hyperCleanup.options.spamTime;
        var spamEndCheck = messageTimeMilliseconds + hyperCleanup.options.spamTime;
        
        var spamCount = hyperCleanup.messageCountSince(messageText, spamStartCheck, spamEndCheck);
 
        if (messageTextNoEmoji.length === 0 && spamCount >= hyperCleanup.options.spamAllowedAmountForEmojiMessages) {
            isSpam = true;
        }
        else if (spamCount >= hyperCleanup.options.spamAllowedAmount) {
            isSpam = true;
        }
        else if (hyperCleanup.messageCountSince(messageTextNoEmoji, spamStartCheck, spamEndCheck) >= hyperCleanup.options.spamAllowedAmountStrippingEmojis) {
            isSpam = true;
        }
 
        if (isSpam) {
            // Performance improvement: don't log when spam detected
            // Left in for now
            console.log('Spam detected: ' + messageText);
        }
 
        // Make sure we actually log the message AFTER we've checked for it
        hyperCleanup.logMessage(messageText, message, messageTimeMilliseconds);
 
        return isSpam;
    };
 
    hyperCleanup.cleanJson = function (json) {
        // Potential paths:
        // .continuationContents.liveChatContinuation.actions[0].replayChatItemAction.actions[0].addChatItemAction.item.liveChatTextMessageRenderer.message.runs[0].text
        // .continuationContents.liveChatContinuation.actions[0].replayChatItemAction.actions[0].addChatItemAction.item.liveChatTextMessageRenderer.message.runs[0].emoji
 
        if (!json || !json.continuationContents || !json.continuationContents.liveChatContinuation || !json.continuationContents.liveChatContinuation.actions) return json;
 
        try {
            // Loop all message actions and remove stuff that looks like spam
            // We go FORWARDS so that we catch the first spam message and then clean from there
            // This is a bit more performance heavy than going backwards (splicing from start, resetting indexes) but the alternative is reversing twice...which is heavier
 
            for (var iContAction = 0; iContAction < json.continuationContents.liveChatContinuation.actions.length; iContAction++) {
                var contAction = json.continuationContents.liveChatContinuation.actions[iContAction];
 
                if (contAction.replayChatItemAction) {
                    // If is a chat replay
                    for (var iChatAction = 0; iChatAction < contAction.replayChatItemAction.actions.length; iChatAction++) {
                        var chatAction = contAction.replayChatItemAction.actions[iChatAction];
                        if (chatAction.addChatItemAction && chatAction.addChatItemAction.item && chatAction.addChatItemAction.item.liveChatTextMessageRenderer) {
                            if (hyperCleanup.isSpamMessage(chatAction.addChatItemAction.item.liveChatTextMessageRenderer.message,
                                    parseInt(chatAction.addChatItemAction.item.liveChatTextMessageRenderer.timestampUsec) / 1000)) {
                                // Remove & reset
                                contAction.replayChatItemAction.actions.splice(iChatAction, 1);
                                iChatAction--;
                            }
                        }
                    }
 
                    if (contAction.replayChatItemAction.actions.length === 0) {
                        // Remove & reset
                        json.continuationContents.liveChatContinuation.actions.splice(iContAction, 1);
                        iContAction--;
                    }
                }
                else if (contAction.addChatItemAction && contAction.addChatItemAction.item && contAction.addChatItemAction.item.liveChatTextMessageRenderer) {
                    // If is actually a live chat
                    if (hyperCleanup.isSpamMessage(contAction.addChatItemAction.item.liveChatTextMessageRenderer.message,
                            parseInt(contAction.addChatItemAction.item.liveChatTextMessageRenderer.timestampUsec) / 1000)) {
                        // Remove & reset
                        json.continuationContents.liveChatContinuation.actions.splice(iContAction, 1);
                        iContAction--;
                    }
                }
            }
        }
        catch (exception) {
            // If an error happens, let's just ignore it and pretend we did nothing
            console.error('An error occurred while cleaning up chat');
            console.error(exception);
        }
 
        return json;
    };
 
    // This is borrowed from HyperChat - YouTube makes fetch requests when it gets messages
    window.fetch = async (...args) => {
        var url = args[0].url;
        var result = await originalFetch(...args);
 
        // Only do stuff if we actually are a live chat request
        if (url.startsWith('https://www.youtube.com/youtubei/v1/live_chat/get_live_chat')) {
            // Clone it because otherwise weird stuff happens
            var newResult = await result.clone();
            var json = await newResult.json();
 
            // If you want to do more digging into the json
            json = hyperCleanup.cleanJson(json);
 
            // New response object to pass back, which is read by the parent fetch()
            // No need to work out the init obj, since we can just use our base result
            var madeResult = new Response(JSON.stringify(json), newResult);
            return madeResult;
        }
 
        return result;
    };
})();

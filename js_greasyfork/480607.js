// ==UserScript==
// @name         BiliTran
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  attempt to translate Simplified Chinese to English on bilibili.com using Google Translate API
// @author       mastodonna233
// @match        https://www.bilibili.com/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480607/BiliTran.user.js
// @updateURL https://update.greasyfork.org/scripts/480607/BiliTran.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var audioElements = document.querySelectorAll('audio');
    
    // Loop through all audio elements on the page
    audioElements.forEach(function(audioElement) {
        // Get the language code for Simplified Chinese (zh-CN)
        var languageCode = 'zh-CN';
        
        // Create a new translation object using the Google Translate API
        var translation = new google.translate.Translation();
        
        // Set the source language to Simplified Chinese (zh-CN)
        translation.setSourceLanguage(languageCode);
        
        // Set the destination language to English (en)
        translation.setDestinationLanguage('en');
        
        // Get the audio element's text content
        var textContent = audioElement.textContent;
        
        // Translate the text using the Google Translate API
        translation.translateText(textContent, function(translatedText) {
            // Replace the original text with the translated text
            audioElement.textContent = translatedText;
        }, {
            // Use the "male" voice for the translation
            voice: 'male',
            
            // Set the pitch and speed of the voice
            pitch: 1,
            speed: 1
        });
    });
})();
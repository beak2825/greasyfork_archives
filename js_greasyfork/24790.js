
// ==UserScript==
// @name         AntiKappa - Remove chat spam from Twitch.tv [fixed 2016-11]
// @namespace    http://tampermonkey.net/
// @version      0.90
// @description  Removes repetitive spam from Twitch.tv. Includes personal r9k mode, and removes caps lock, ascii, repetitive text if you want (and more). Fixed to work with twitch.tv Nov 2016.
// @author       BlackOdd (Reddit: /u/BlackOdder), /u/ihavebeenasleep
// @include      http*://www.twitch.tv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24790/AntiKappa%20-%20Remove%20chat%20spam%20from%20Twitchtv%20%5Bfixed%202016-11%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/24790/AntiKappa%20-%20Remove%20chat%20spam%20from%20Twitchtv%20%5Bfixed%202016-11%5D.meta.js
// ==/UserScript==
/* jshint -W097 */

var AntiKappa = {      

    //CHANGE SETTINGS HERE
    r9kModeBool: true, //personal twitch r9k
    blockExclusiveUpperCaseBool: true, //removes exclusive caps lock 
    blockMostlyUpperCaseBool: true, //blocks messages with mostly caps lock
    blockVeryLongMessagesBool: false, //removes long messages which usually contains repetitive copy pastes
    blockRepeatedWordInSentenceBool: true, //removes repeated words, like "Kappa Kappa Kappa"
    blockTypicalSpamBool: true, //removes suspected random spam
    blockNonEnglishCharactersBool: false, //blocks everything that isn't the standard ASCII character set
    //CHANGE SETTINGS HERE

    messageArray: [],
    debugModeBool: true,
    longMessageCountInt: 140,
    mostlyUpperCaseTheshholdPercentage: 70,
    repeatedWordInSentenceCountInt: 3,
    typicalSpamStringArray: [ //will block the sentence if it contains any of these words, and you have "blockTypicalSpamBool" set to true
        "gachi", "feelsgoodman", "feelsbadman", "kkona", 
    ],
    betterTTVEnabled: false
};

$(function(){  
    'use strict';

    AntiKappa.logDebugMessage = function(message){        
        if(AntiKappa.debugModeBool){
            console.log("AntiKappa - " + message);
        }
    };

    AntiKappa.mainLoop = function(){
        AntiKappa.betterTTVEnabled = AntiKappa.isBetterTTVEnabled();        
        AntiKappa.checkMessages();
    };
    
    AntiKappa.isBetterTTVEnabled = function(){
        return $('.bttvChatSettings').length > 0;
    }

    AntiKappa.checkMessages = function(){
        $('ul.chat-lines span.message:not(.AntiKappaAccepted)').each(function(){            
            var $message = $(this);
            var $parent = $(this).parent();

            var textWithoutEmotes = $message.text(); //filter out emotes, since a lot of spam is on the form "*emote* CAPSLOCK". this makes it easier to identify capslock spam
            AntiKappa.checkMessage(textWithoutEmotes, $message, $parent);
        });
    };
    
    AntiKappa.checkMessage = function(text, $message, $parent){
        if(!AntiKappa.isSpam(text)){
            AntiKappa.logDebugMessage('ACCEPTED: ' + text);

            $message.addClass('AntiKappaAccepted');            
            $parent.addClass('AntiKappaAccepted');
            AntiKappa.messageArray.push(text);                        
        }
        else
        {            
            AntiKappa.logDebugMessage('REJECTED: ' + text);

            $parent.remove();
        }         
    };    
    
    AntiKappa.translateEmoticonsAndReturnTextFromMessage = function($message){
        var text = $message.text();        
        $message.children('.emoticon').each(function(){
            text = text + " " + $(this).attr('alt');
        });
        
        return text;
    };

    AntiKappa.purgeEntries = function(){
        AntiKappa.messageArray = [];
    };

    AntiKappa.isSpam = function(text){        
        if(text === ""){
            AntiKappa.logDebugMessage("Reason for removal: empty");
            return true;
        }

        if(AntiKappa.blockVeryLongMessagesBool){
            if(text.length > AntiKappa.longMessageCountInt){                
                AntiKappa.logDebugMessage("Reason for removal: VeryLong");
                return true;
            }
        }
        
        if(AntiKappa.blockMostlyUpperCaseBool){
            if(AntiKappa.isMostlyUpperCase(text)){
               AntiKappa.logDebugMessage("Reason for removal: MostlyUpperCase");
               return true;
            }
        }

        if(AntiKappa.blockExclusiveUpperCaseBool){
            if(text === text.toUpperCase()){
                AntiKappa.logDebugMessage("Reason for removal: ExclusiveUpperCase");
                return true;
            }             
        }        

        if(AntiKappa.blockRepeatedWordInSentenceBool && AntiKappa.isRepeatedWordInSentence(text)){
            AntiKappa.logDebugMessage("Reason for removal: RepeatedWordInSentence");
            return true;
        }

        if(AntiKappa.blockTypicalSpamBool){
            for (var i = 0; i < AntiKappa.typicalSpamStringArray.length - 1; i++) {
                var entry = AntiKappa.typicalSpamStringArray[i].toUpperCase();
                var compare = text.toUpperCase();
                if(compare.indexOf(entry) > -1){
                    AntiKappa.logDebugMessage("Reason for removal: TypicalSpam");
                    return true;
                }
            }
        }

        if(AntiKappa.r9kModeBool){
            if(AntiKappa.messageArray.indexOf(text) > -1){
                AntiKappa.logDebugMessage("Reason for removal: r9kMode");
                return true;
            }                
        }                

        if(AntiKappa.blockNonEnglishCharactersBool){
            if(AntiKappa.isNonEnglishCharacter(text)){
                AntiKappa.logDebugMessage("Reason for removal: NonEnglishCharacter");
                return true;
            }                
        }             

        return false;
    };

    AntiKappa.isRepeatedWordInSentence = function(text){
        var sortedStringArray = text.split(" ").sort();        
        var duplicatesStringArray = [];
        for (var i = 0; i < sortedStringArray.length - 1; i++) {
            if (sortedStringArray[i + 1] == sortedStringArray[i] && sortedStringArray[i].length > 3) { //dont take short words like "at", "a", "or" etc because they can be repeated a lot but are not spam per say
                duplicatesStringArray.push(sortedStringArray[i]);
            }
        }
        
        duplicatesStringArray = duplicatesStringArray.filter(Boolean);
        
        return duplicatesStringArray.length >= AntiKappa.repeatedWordInSentenceCountInt;
    };
    
    AntiKappa.isMostlyUpperCase = function(text){
        var textLength = text.length;
        var amountUpperCaseInt = 0;
        for (var i = 0, len = textLength; i < len; i++) {
            var char = text[i];
            if(char === char.toUpperCase()){
                amountUpperCaseInt++;
            }
        }
        
        var percentageUpperCase = 100 - (textLength - amountUpperCaseInt) / textLength * 100;
        
        return percentageUpperCase >= AntiKappa.mostlyUpperCaseTheshholdPercentage;
    };

    AntiKappa.isNonEnglishCharacter = function(text){
        var regex = /[^\u0000-\u007F]+/;
        return regex.test(text);
    };

    AntiKappa.addGlobalStyle = function(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    };

    AntiKappa.addGlobalStyle('.chat-lines .ember-view { display: none; }');
    AntiKappa.addGlobalStyle('.chat-lines div.chat-line { display: none; }'); //BetterTTV
    AntiKappa.addGlobalStyle('.AntiKappaAccepted { display: block !important; }');    
    AntiKappa.addGlobalStyle('li.ember-view span.AntiKappaAccepted { display: inline !important; }');    
    AntiKappa.addGlobalStyle('div.chat-line span.AntiKappaAccepted { display: inline !important; }');    
    setInterval(AntiKappa.mainLoop, 200);    
    setInterval(AntiKappa.purgeEntries, 1000 * 60 * 10);
});
// ==UserScript==
// @name			RSI Chat Toolkit
// @namespace		http://chat.koros.us/
// @description		Changes the appearance of the RSI WebChat (backgrounds, dividers, names, text, etc). Adds avatars to the Messaging Area (instead of just the User List); clicking he avatars will load user profile pages. Adds cowbell alerts for when somebody types your name.
// @include			*robertsspaceindustries.com/community/*chat*
// @version			0.3.015
// @grant			GM_addStyle
// @grant			GM_listValues
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_deleteValue
// @copyright		Koros 2014
// @license			CC0 [ http://creativecommons.org/publicdomain/zero/1.0 ]
// @author			Koros / soroK, aka ScottAllyn
// @contributor		...
// @downloadURL https://update.greasyfork.org/scripts/1020/RSI%20Chat%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/1020/RSI%20Chat%20Toolkit.meta.js
// ==/UserScript==

// Notes to self... 
// * don't add too many of the chatroll toolkit features until the regular chat comes out of beta,
//   you idiot! Official updates WILL break your shit!
// * fix the annoying auto-scroll-on-new-message "feature". Pull the section of the chatroll toolkit
//   that dealt with the same "issue" and modify it for this chat? maybe?
// * start thinking about custom colors/highlighting for usernames. Will be more tricky than it was
//   with the chatroll since there's no unique identifier for individual users in the message pane.
//   there is in the roster-pane, tho... hrrm. on new message insertion, we can simply check user's
//   name/handle/whatever against our "highlight" list. If user is in list, we append the highlighting
//   css class name to the appropriate element. actually quite simple. Shoulda done it that way in
//   chatroll.
// * searchword highlighting now, or after chat comes out of beta?
// * process /me actions so that they get displayed IRC-style
// * Setup a friends list, Org-mates list, Staff list, and 2 other generic lists. Allow different
//   colors for each. Having Enemy List will likely piss off CIG, but users can use one of the
//   generic lists to flag/tag "enemies" if they really want.
// * Add "Show Joins/Parts for Friends, Developers, & Moderators" toggle. Obviously need to get the
//   friends list working for this.


// ==Variables==

var scriptVersion		= GM_info.script.version;
var myName;
var pauseMessageHandler	= false;
var enableCowBell		= true;
var lastCowBell 		= 1;
var moreCowBell 		= 'data:audio/mp3;base64,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d1caTEFNRTMuOTguNKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//PCZAAAAAGkAOAAAAAAA0gBwAAATEFNRTMuOTguNKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjk4LjSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
var defaultAvatar		= '<img class="image-avatar" src="data:gif;base64,R0lGODlhIgAiAPcAAAIBAVlaVSktKQcRKxsZDQMHFgINEyEzVyYjHgIPFz9FRxMXHQYQHwIDCxUhQSMtQQ8fKxcZHQkhOTU7NRATFgIHBxMTEQsTFx8nKx4tOgcJDA0NDAMPGxwfHgQTH4eJjQEBBy8pIRIdJgsNExYXFjM1LyEbF0tRRQUXJi87QSMnKwMJE2tvbwMLFTVHVx0jJwwPFh0jKwoLCBsfIx4eGzExNQ4RDwQVJgIFBSgtMB4ZFQcNHQcbLBUpOQgICQ0PDyMpMwMNGVFbfSc9YT1HTwMHEggfMg8TIQobJh07VScrLQcJEggMFSYnKAMPGQcRJxYdJz1BNxETEwkPHSMfHS4xMgoQIBAVHAcJBhIXGwMNFg0ZNwECBWFlZQQHDBkdHjM5OwMRHAUVIwIFBw8XKDo/QgILEyIlJhMbLyk9aQ8jMklZX0NJRREbIQ8xTQokOhkVFQYHBwQTHSg0OAcKDw4PDBARElFRTwkPGS01PS0vLwYdMAgNEiQkIxUjUxIVFSArMZ2fo0NVb3h8gmdrb0tTV5OXm6eprTdNgSlDVxM1Tx0zQRcnQ4uPmT1NYRsrUTFFYxghNFleYX+DhS1DZw8nPx0tVS1BU1NVUSM5XA4WLhk1Sy8zK2dreSUxOzM/RC41OR0rPwcXIyYpJjEzMUFLU09PTRIfOyUjMUNBPx8vTRcnTSwfFzc9PxUfMy9DbxUjKxonMCUtP0lPU1FXWxoaG0lLS6mtsQ8rQwMJGwklPwoUHTVFV0NHSRsfJzc6Pyw7RiU9b1VZXTc1NxcfIQYZKSMtM0VGRgcRIz01LiUpLw0VJx8pOB8hIQwRIyEpLwMFD21xcyk1Oy8tLQ8hLyAgIycrLzs7OxUVDwsLCwUZJwsdK0FJTQsZIikrJTY1MwUhPS0xOSMlKSM9VRQVEx0hIRcbHjk9NwUVIQ8PERUZFyUpLB8lJgsRFRklLQkfNQsLEw0RGyEhHhUZGwMHDxMlMy8vM0xRVQEDAgUJFREZHwMFDQIDCREfJycvMRAVHyH5BAAAAAAALAAAAAAiACIABwj/AFcIHEjQTIuDB/PlS4iwhRmCECMKbKilhZaLGCs2NPNQokCO+TQe1BKEpBMOHIKULKmRo8eJZi6iDCPm2boUgNqEcXLSCUuHLV46xBgmjChp1eIgUPLnjIiTHJxgBCoR6EUnRXPQwIGPawUfduTwTHARaEeIBmMmCMNBXwd8cAHgA0A3C1myZQ0GhTi0hZMETvRh6coVLg4AdBIYOMiR8dmBjC8mSCCnDlccFSrgwLGBjxbFGBs//hjTQMY/rDBnHlNBxwaOsGGvcFmQoxYzBswoq8UqzubNWEJUmWyguHEDsyHHvJ3bQIIZOiz8/k1Fnih0RXfudHI2n+3b9GJ6/4ilw870MTiS6dmDoihgnhchr7B4MWYYHpVK1GK9WXOyUrrsgQ58f9UnkHcHmaZFGNpI4IY0COCAHj5jxFHCC4pIUIwck2WU23xpXUSTEUkAswEVXODARYo4jALDHIkYcUOBFVXUEVAtJOCBEbi4kMMG2GwwnQ8dbKDCGpvw4EECMcGmBYgJOqHNG0koQIwP6lhgw2ZddeCDOGxcYgQ6t8X2kFlaMLBHBp8oMU8cPsARF1wbjGGONyfMwQMHx8UEpRlOiNHDM54IMINvgxnGlQ8RnMMJM+7IwREduOXWpAFhbENMFqHokUUcXBDGJT5x2BFFBg+UgwSTxeFWGm5hUP9DQTqZRFILqBRuNgZcY3jDDCWykABBGMeVaZsc9dRhhytD7EKBqFzioE45qhzwjB0ihKGFgtxVmgAwgpBBATlXYGBDHF35hi4OFkyAwQIkxOMIEQngUS86sQEiDCKPaODDFxvA8IoPLK4YDyQb0LABHZqk0cgnZlAmh2RtKMBLMA5MQc4GcWwQSTxF0OPFCkugEqQdUqBxyiNCTAKLc3hgxUAvv2SyijM1TNPFB6TIgAcdBvBhRjoE2BANC0pMw8gWfnRSiGQnwXKMM0/s0MQdhwySQxkd4KDBCO3wEYcMGJQxyC2phHPKAJqUAQhugM1xRAFFjNDENYZwIw4xSljZMAYM7XiBhTnrtCJMIMd8EwMyuRzxS25OyDFDEUXskw02zRAyywtfZJHFGO20swQFxKwDBi2D9EGFCe1YUQAUIhjgBDqUV8jFBha0svkXEcCzzxIhF3HFOqBIIgwcFvjg9Q4FIMEWCvnE4Rs+XGRjBygvXLAPP0WYsdA+DRyhxD3r2IGuDz9Q0EI3YtB0RhN9mGe9D1BYAQIX9JCxww7LWAG+FcxIxwY0EAcbJK0P1EDBDdRwjADcISk/aII9YMCPfazogvfjAj/4oYE+DKMa/zJFAGyxCHAEBAA7">';
var friendList			= '';
var orgList				= '';
var devList				= '';
var hl1List				= '';
var hl2List				= '';
var txtColor 			= '#bed8eb';
var urlColor 			= '#9CDEF0';
var scrollBarTrackColor = '#3b3b3b';
var scrollBarThumbColor	= '#666';
var scrollBarBorderColor= '#999';
var subjectColor		= 'yellow';
var chatBGColor1 		= 'rgba(5, 10, 23, .6)';
var chatBGColor2 		= 'rgba(3, 8, 22, .6)';
var chatBorderColor 	= '#142b43';
var contactsBGColor1 	= 'rgba(5, 10, 23, .6)';
var contactsBGColor2 	= 'rgba(3, 8, 22, .6)';
var inputBGColor 		= 'rgba(0,0,0,0.4)';
var inputBorderColor 	= '#00b7ca';
var stickyBGColor 		= '#0d2741';
var stickyTxtColor 		= '#fbff8f';
var stickyBorderColor 	= '#36587b';
var usrColor 			= '#548cb2';
var friendColor			= '#0099FF';
var orgColor			= '#0099FF';
var devColor 			= '#21ff90';
var modColor 			= '#21ff90';
var hiLight1Color 		= '#FF9900';
var hiLight2Color 		= '';
var mutedColor 			= '#A43535';
var $ 					= unsafeWindow.jQuery;

// custom style changes
var baseCSS = '' +
    'body { font-family: Arial, Helvetica, sans-serif !important;  }\n' +
    '#candy { color: ' + txtColor + '; }\n' +
    '::-webkit-scrollbar { width: 10px; height: 10px; } \n' +
    '::-webkit-scrollbar-button:start:decrement, ::-webkit-scrollbar-button:end:increment { height: 10px; display: block; background-color: transparent; }\n' +
    '::-webkit-scrollbar-track-piece { background-color: ' + scrollBarTrackColor + '; -webkit-border-radius: 6px; }\n' +
    '::-webkit-scrollbar-thumb:vertical { height: 50px; background-color: ' + scrollBarThumbColor + '; border: 1px solid ' + scrollBarBorderColor + '; -webkit-border-radius: 6px; }\n' +
    '#search-roster { width: 193px; }\n' +
    '.message-pane-wrapper { margin: 39px 207px 45px 7px; font-size: 14px !important; }\n' +
    '.message-pane dd { margin: 0px !important; background: ' + chatBGColor1 + '; padding: 3px 0px 3px 0px; vertical-align: top !important; border-top: 1px solid ' + chatBorderColor + '; }\n' +
    '.message-pane dd:nth-child(even) { background: ' + contactsBGColor2 + '; }\n' +
    'dd.role-visitor .label a.name, .message-pane dd.role-participant .label a.name { color: ' + usrColor + '; }\n' +
    '.message-pane dd .image-avatar { background-color: transparent !important; height: 34px; width: 34px; }\n' +
    '.message-pane dd .label { text-decoration: none !important; margin-left: 3px; display: inline !important; float: none !important; height: 34px; line-height: 34px; }\n' +
    '.message-pane dd .label a.name { float: none !important; font-family: Arial, Helvetica, sans-serif !important; text-decoration: none !important; font-weight: bold !important;  }\n' +
    '.message-pane dd .message { display: inline !important; min-height: 34px !important }\n' +
	'.message-pane dd .message a, .message-pane dd .message .highlight { color: ' + urlColor + ' }\n' +
    '.message-pane dd.subject { color: ' + subjectColor + '; text-shadow: none; }\n' +
    '.message-pane dd.role-moderator .label a.name { color: ' + modColor + '; }\n' +
    '.search-roster { padding: 9px 25px 9px 15px !important; }\n' +
    '.roster-pane { width: 200px; }\n' +
    '.roster-pane .user.role-moderator .label-nickname, .roster-pane .user.me.role-moderator .label-nickname { color: ' + modColor + '; text-shadow: none; }\n' +
    '.roster-pane .user.role-moderator .bullet, .roster-pane .user.me.role-moderator .bullet { background-color: ' + modColor + '; }\n' +
    'a.name:after { content: ": "; }\n' +
    '.emoticon { height: 15px !important; width: 15px !important; }\n' +
    '.label .light { display: none; }\n' +
    '.time { float: right !important; font-size: 10px; font-family: Arial, Helvetica, sans-serif !important; opacity: 0.6; text-align: right }\n' +
    '.roster-pane .user { color: #548cb2; background: rgba(5, 10, 23, .6); }\n' +
    '.roster-pane .user:nth-child(even) { background: rgba(3, 8, 22, .6); }\n' +
    '.user.role-moderator .bullet, .roster-pane .user.me.role-moderator .bullet { background-color: #8052b3; }\n' +
    '.roster-pane .label { width: 124px; }\n' +
	'.avatar .corner { display: none !important; }\n' +
    '#panel-pane { width: 191px; }\n' +
    '.infomessage { display: none; }\n' +
    '.korosColor { color: #50A5DF !important; }\n' +
    '.action { color: ' + subjectColor + ' !important; font-weight: bold !important; font-style: italic !important; }\n' +
    '\n';

GM_addStyle(baseCSS); // apply our custom style changes

function escapeRegExp(str) { return str.replace(/([\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|])/g, '\\' + '$1'); }

// ring the bell, but never more than once every 5 seconds...
function playCowBell() {
    var now = new Date();
    if ((now - lastCowBell) > 5000) {
        enableCowBell ? new Audio(moreCowBell).play() : '';
        lastCowBell = now;
    }
}

function parseMessage(nodeInsertion) {
    var newMessage = $(nodeInsertion.target); // the node that was just inserted into the message pane  
    var messagePane = $(newMessage).parent();
    var time = $(newMessage).find('span.time');
    var messageContent = $(newMessage).find('span.message');
    var activeChannel = $(newMessage).closest('div[class^="room-pane"]');
    var activeRoster = $(activeChannel).find('div.roster-pane');
    var userContainer = $(newMessage).find('span.label');
    var user = $(newMessage).find('a.name');
    var userName = user.text();
    var rosterUser = $(activeRoster).find("[data-nick='" + userName + "']");
    var rosterAvatar = $(rosterUser).find('span.label-avatar').html();
    var userAvatar = (rosterAvatar ? rosterAvatar : defaultAvatar);
    
    if (typeof(myName) === 'undefined') { myName = $(activeRoster).find('div.me').attr('data-nick'); } // get our username
    
    if ('Koros' == userName) { user.attr('style', 'color: #74B5E2 !important') } // well... it's my script, afterall! :D    
    
    if ($(messageContent).text().match(/^\/me.*$|^\+.*\+$|^\*.*\*$/i)) { // if user does a /me action
        $(userContainer).remove(); // remove the formatted name
        $(messageContent).addClass('action');
        $(messageContent).html($(messageContent).text().replace(/@(\w+)/ig, '$1'));
        $(messageContent).html($(messageContent).text().replace(/^\/me(.*)$|^\*(.*)\*$/i, '☀ ' + userName + ' $1$2'));
    } else { // otherwise, it's a normal message... add avatar
        $(time).before('<span>' + userAvatar + '</span>');
    }
    
    // if someone types our userName, sound the cowbell and highlight the entire message
    if ($(messageContent).text().toLowerCase().indexOf(myName.toLowerCase()) >= 0) {
        $(messageContent).attr('style', 'color: ' + subjectColor + ' !important');
        playCowBell();
    }
}

$(document).on('keydown','input.field', function(event) {
    if (event.keyCode === 9) { // TAB key
        var activeChannel = $(this).closest('div[class^="room-pane"]');
        var activeRoster = $(activeChannel).find('div.roster-pane');          
        
        var inputBox = this;
        var inputText = escapeRegExp(inputBox.value.trim());
        
        event.preventDefault();
        
        // get the last (or only) word from the inputBox (sans any leading @ or trailing comma)
        var textMatch = new RegExp('^' + inputText.replace(/.*@*\b(\w+),*$/i, '$1'), 'i');
        
        // get the entire list of users from the roster-pane
        var users = Array.prototype.slice.call($(activeRoster).find('span.label-nickname'));
        users.sort().reverse();
        
        users.forEach(function (user) {
            // trim clan/guild/squad insignia, non-letter-characters, and prefixes from the beginning of names
            var name = user.textContent.replace(/^\W.+\W *|^\W+|^pirate *|^lord *|^the *|^captain *|^dr\.* *|^capt\.* *|^mr\.* *|^lt\.* *|^sir *|^admiral *|^doctor *|^premium(.*)/i, '$1');
            name = name.replace(/[0-9]+$/i, ''); // trim numbers from the end of names
            if (name.match(textMatch)) {
                // get just the 1st word
                name = name.replace(/([^ ]+)[ \/\_\-].*/i, '$1');
                
                // if the inputbox contains more than one word, assume user is using auto-complete in the middle of a sentence
                if (inputBox.value.match(/^.+ .+$/i)) { 
                    inputBox.value = inputBox.value.replace(/(.*\b)[^ ]+$/i, '$1' + name);
                } else { // otherwise, assume users is starting the sentence with auto-complete
                    inputBox.value = name + ', ';
                }
                return;
            }
        });
    }
});

setTimeout(function () { // wait a few seconds for all original js code to load before we start listening for events    
    $('.message-pane').append('<dd class="subject"><span class="message">☀ RSI Chat Toolkit (Koros Mods) v' + scriptVersion + ' now loaded...</span></dd>');
    $('input.search-roster').attr('placeholder', 'Search for user...');
    
    // watch for new messages...
    $(document).on('DOMNodeInserted', 'dd.role-participant', parseMessage );
    $(document).on('DOMNodeInserted', 'dd.admin-moderator', parseMessage );
}, 10000);

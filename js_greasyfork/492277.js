// ==UserScript==
// @name        Intercom Quick Buttons
// @namespace   http://tampermonkey.net/
// @version     1.4
// @description Select the Macro you want to send and then hit Send to see it in the composer
// @author      Ahmet
// @match       https://app.intercom.com/*
// @grant       GM_addStyle
// @icon        https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/174_Intercom-512.png
// @downloadURL https://update.greasyfork.org/scripts/492277/Intercom%20Quick%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/492277/Intercom%20Quick%20Buttons.meta.js
// ==/UserScript==

var zNode = document.createElement('div');
zNode.innerHTML = '<select id="mySelect">'
                + '<option value="Hi there!​﻿﻿ I\'m Nadeen with Chess.com Support! 😊<br><br>​﻿﻿Thank you so much for writing in! ​﻿﻿I\'m really sorry about the delay – chess is more popular than ever and we have SO many emails currently! I want to assure you that I\'m here to help you now!​﻿​﻿<br><br><strong>To speed up the process and ensure that we can assist you as quickly and efficiently as possible, please fill out this form:</strong><br><br><a href=\'https://chesscom-support-main.paperform.co/?46uhe=--5--\'>Account Closure Resolution Form</a><br><br>This will gather all the information to let us help you ASAP! ​﻿﻿Thank you so much for your patience. Let me know if there\'s anything else I can help you with!​﻿">Find User</option>'
                + '<option value="Hi there!​﻿﻿ I\'m Nadeen with Chess.com Support! 😊<br><br>​﻿﻿Thank you for reaching out to us regarding your account! I\'m really sorry about the delay – chess is more popular than ever and we have SO many emails at the moment! <strong>But I\'m here to help you get back on Chess.com as soon as possible!</strong><br><br>I\'ve taken a look, and it seems your account was closed for <strong>Sandbagging</strong> or rating manipulation. Accounts can be closed for sandbagging when someone intentionally loses games to lower their rating.<br><br>It can also happen if someone tries to play only white or black or resigns a lot to play specific openings, or if someone disconnects often. You can find out more here: <a href=\'https://support.chess.com/article/208-what-is-a-sandbagger\'>What is a sandbagger?</a><br><br>I understand you may have not been aware of this rule, so let\'s get you back on the site! Fill out the form below and a member of our team will review your account ASAP!​﻿<br><br><strong><a href=\'https://sandbagging.paperform.co/\'>Sandbagging Closure Resolution Form</a></strong><br><br>I hope this helps! Please let me know if there\'s anything else I can help you with!​﻿">Sandbagging</option>'
                + '<option value="Hi there!​﻿﻿ I\'m Nadeen with Chess.com Support! 😊<br><br>​﻿﻿Thanks so much for getting in touch! I\'m really sorry about the delay – chess is more popular than ever and we have SO many emails at the moment! <strong>But don\'t worry, I\'m here to help you now!</strong><br><br>​﻿﻿It looks like your account was closed by our system for being <strong>a duplicate account</strong>. I totally get it if you didn\'t realize Chess.com members can only have one account!​﻿​﻿<br><br><strong>Please confirm that you\'ll keep only one account and let me know which one you\'d like to restore.</strong> I\'ll then approve it for you, so you don\'t have to worry about it being closed again!<br><br>﻿﻿Alternatively, fill out the form below to apply to have an authorized alternate account!​﻿<br><br><strong><a href=\'https://support.chess.com/article/596-can-i-have-multiple-accounts\'>Can I have multiple accounts?</a></strong><br><br>​﻿﻿Thanks so much! I look forward to hearing back from you!">Reg Abuse</option>'
                + '<option value="Hello there! ​﻿<br><br>Hope you\'re doing fine. I\'m Nadeen and I will help you today. ♟️💜 ​﻿<br><br>It appears your account was closed due to a discrepancy with our <strong><a href=\'https://www.chess.com/legal/fair-play\'>Fair Play Policy</a></strong>. Don\'t worry, you\'ll be able to start a new account with the same details and get back to Chess shortly! ​﻿<br><br>In fact, I can help you create your second-chance account as soon as you complete the following form: <strong><a href=\'https://fair-play.paperform.co/\'>New Account Application Form</a></strong>​<br><br>In order to protect our Fair Play detection methods, we can\'t disclose specific games or data flagged by our detection team and software. <strong>Common closure causes include using software/human assistance to find the best moves, owning a troublesome chess extension, and account sharing...</strong><br><br>​<strong>If you still don\'t see any reason behind your account\'s closure, you can appeal by using this form:</strong> <strong><a href=\'https://fair-play-appeal.paperform.co/\'>Appeal Application Form</a></strong><br><br>The Fair Play team will review your case and make a final decision. If your Appeal is granted, we\'ll reopen your account with our sincerest apologies. Thank you for your patience and understanding in this process. ​﻿<br><br>I\'m looking forward to hearing back from you soon so we can resolve this together.<br><br><img src=\'https://media.giphy.com/media/12XDYvMJNcmLgQ/giphy.gif\' alt=\'giphy.gif\' class=\'intercom-interblocks-align-left\' style=\'display: block;\' data-width=\'\'>">FP Initial</option>'
                + '<option value="Hello! <br><br>​﻿﻿I\'m Nadeen from the Support Team and I\'m here to help you! 💜 <br><br>​﻿﻿Thank you for filling out the form and agreeing to the terms of the site. <br><br>​﻿﻿🌞 <strong>We\'re delighted to inform you that your account has been reopened!</strong> 🎉🥳 <br><br>​﻿﻿So please, try to log in and let me know if you have any issues. I want to make sure that this is completely resolved for you! <br><br>​﻿﻿If you see any error messages when logging in please write me back and let me know! <br><br>​﻿﻿Have a great day! <br><br>​﻿﻿Cheers,">Reopened</option>'
                + '</select>'
                + '<button id="myButton" type="button" style="margin-top: 10px; border: 2px solid #ccc; padding: 5px 10px;">'
                + 'Insert</button>';
zNode.setAttribute('id', 'myContainer');
document.body.appendChild(zNode);

document.getElementById("myButton").addEventListener(
    "mousedown", function (e) {
        e.stopPropagation(); // Prevent mousedown event from triggering drag logic
    }, false
);

document.getElementById("myButton").addEventListener(
    "click", ButtonClickAction, false
);

function ButtonClickAction(zEvent) {
    var selectedMessage = document.getElementById("mySelect").value;
    if (!isDragged) {
        var targetElement = document.querySelector('.intercom-interblocks-align-left.embercom-prosemirror-composer-block-selected');

        if (targetElement) {
            targetElement.focus();
            targetElement.click();
            targetElement.innerHTML = selectedMessage; // innerHTML used for formatted message

            // The part that automatically clicks the "Send" button has been removed > refer to previous version to have it available until the GIF problem is resolved.
        } else {
            console.log("Target element not found.");
        }
    }
}


var mousePosition;
var offset = [0,0];
var isDown = false;
var isDragged = false;
var div = document.getElementById('myContainer');

// Adjust the mousedown event handler for dragging
div.addEventListener('mousedown', function(e) {
    isDown = true;
    isDragged = false; // Reset drag state
    offset = [
        div.offsetLeft - e.clientX,
        div.offsetTop - e.clientY
    ];
}, true);

// End dragging
document.addEventListener('mouseup', function() {
    isDown = false;
}, true);

// Adjust mousemove to only prevent default actions during a drag
document.addEventListener('mousemove', function(event) {
    if (isDown) {
        event.preventDefault(); // Added to prevent text selection during drag
        isDragged = true;
        mousePosition = {
            x : event.clientX,
            y : event.clientY
        };
        div.style.left = (mousePosition.x + offset[0]) + 'px';
        div.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

GM_addStyle(`
    #myContainer {
        position: fixed;
        top: 10%;
        left: 10%;
        background-color: grey;
        padding: 10px;
        border-radius: 5px;
        z-index: 1000;
        color: white;
        font-family: Arial, sans-serif;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        opacity: 0.7; /* Set opacity to 70% */
    }
    #myButton, #mySelect {
        cursor: pointer;
        margin: 5px;
        padding: 8px 10px;
        background: darkblue;
        border: none;
        color: white;
        border-radius: 5px;
        width: calc(100% - 20px);
    }
    #myButton:hover, #mySelect:hover {
        background-color: navy;
    }
`);


function multilineStr(dummyFunc) {
    var str = dummyFunc.toString();
    str = str.replace(/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace(/\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace(/\/\/.+$/gm, ''); // Strip double-slash comments in ES6 Template Literal
    return str;
}

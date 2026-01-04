// ==UserScript==
// @name         TagPro RL Chat
// @description  Enhances the chat by mimicking Rocket League
// @author       Ko
// @version      3.5
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @icon         https://github.com/wilcooo/TagPro-RL/raw/master/tprlc-256.png
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/9le791
// @require      https://cdnjs.cloudflare.com/ajax/libs/autolinker/1.6.2/Autolinker.min.js
// @license      MIT
// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/370044/TagPro%20RL%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/370044/TagPro%20RL%20Chat.meta.js
// ==/UserScript==



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                                                            //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                                                      //  //
// Looking for options? They are on the homepage! Look for a green 'RL-chat' button.                                  //  //
// The only thing you can change here are what system messages will be replaced.                                      //  //
// null means the system message won't be shown at all, any other string will replace                                 //  //
// the message. The main goal is to reduce the space these messages take up, so that everything looks a bit neater.   //  //
                                                                                                                      //  //
const system_messages = {                                                                                             //  //
    "Since you refreshed, you will have to wait 10 seconds to respawn.": "Wait 10 seconds after a refresh",

    "Since there aren't many players in this game yet, you'll get a bonus": "There aren't many players in this game",
    "5 rank points if you stick around and make it a real match.": null,
    "10 rank points if you stick around and make it a real match.": null,
    "15 rank points if you stick around and make it a real match.": null,
    "20 rank points if you stick around and make it a real match.": null,

    "Thanks, you're getting 5 bonus rank points for that.": null,
    "Thanks, you're getting 10 bonus rank points for that.": null,
    "Thanks, you're getting 15 bonus rank points for that.": null,
    "Thanks, you're getting 20 bonus rank points for that.": null,

    "THROWBACK MAP!": "This is a throwback map",

    "TagPro Neomacro Plus Loaded!": null,

    "You can't switch teams right now.": "You can't switch teams right now.",

    "You've joined a game as a spectator. Once enough players come online, you'll": "You are spectating",
    "be auto-joined to a game. Q/W=Rotate through players. A=Red's flag carrier.": null,
    "S=Blue's flag carrier. +/- for zooming. C=Center map view. SPACE=Toggle auto-join.": null,
    "S=Blue's flag carrier. +/- for zooming. C=Center map view.": null,

    "Hi! You’re currently playing unregistered which means you can’t pick a": "You are not logged in",
    "custom name and your chat is limited. To register, click the Log In": null,
    "button on the homepage. Have fun!": null,

    "Sorry, as an unregistered player, you’ve reached your chat limit. To": "Chat limit reached, log in",
    "remove this limit, click the Log In button on the homepage and chat as": null,
    "much as you like!": null,

    "Thank you for testing! Winning 50 games while testing the world joiner": "Testing the SWJ. Win 50 to get the Compass",
    "will result in bonus flair!": null,

    "We are testing some adjustments to TagPro: Games are now 6 minutes long": "Test: 6 minute game, no limit, mercy and overtime",
    "with no cap limit but there is a 3 cap mercy rule. There is also an": null,
    "over time mode. Enjoy!": null,

    "OVERTIME! Next cap wins. Respawn penalty increases. Grabbing the flag":"OVERTIME!",
    "awards Juke Juice.":null,

    "During over time, each death is +3 seconds of respawn. Currently: 3": "Current respawn time: 3",
    "During over time, each death is +3 seconds of respawn. Currently: 6": "Current respawn time: 6",
    "During over time, each death is +3 seconds of respawn. Currently: 9": "Current respawn time: 9",
    "During over time, each death is +3 seconds of respawn. Currently: 12": "Current respawn time: 12",
    "During over time, each death is +3 seconds of respawn. Currently: 15": "Current respawn time: 15",
    "During over time, each death is +3 seconds of respawn. Currently: 18": "Current respawn time: 18",
    "During over time, each death is +3 seconds of respawn. Currently: 21": "Current respawn time: 21",
    "During over time, each death is +3 seconds of respawn. Currently: 24": "Current respawn time: 24",
    "During over time, each death is +3 seconds of respawn. Currently: 27": "Current respawn time: 27",
    "During over time, each death is +3 seconds of respawn. Currently: 30": "Current respawn time: 30",
};                                                                                                                    //  //
                                                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
//                                                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- SOUNDS --- ###                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                                                      //  //
var chat_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-GroPro/master/audio/chat.wav');          //  //
var left_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-GroPro/master/audio/left.mp3');          //  //
var join_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-GroPro/master/audio/joined.mp3');        //  //
                                                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
//                                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////






/* Structure: (for reference)

div#RLC-box

    div.chats-wrapper          // Necessary to define the exact height of the next div
                               // by placing n empty lines in it.

        div.chats              // inherits the height of the wrapper

            div
                span.name
                span.message

            div
                span.name
                span.message

            //etc...

    label                      // can show 'team', 'group', 'mod' or nothing

        input#chat             // Note: this is the original TP chatbox!

*/




// =====CONFIG SECTION=====


// DON'T CHANGE THE OPTIONS HERE, AS YOU CAN CHANGE THEM ON THE TAGPRO HOME PAGE!

var settings = tpul.settings.addSettings({
    id: 'RL-Chat',
    title: 'TagPro RL Chat Configuration',
    tooltipText: 'RL Chat',
    icon: 'https://github.com/wilcooo/TagPro-RL/raw/master/tprlc-256.png',

    tabs: true,

    fields:
    {
        position:
        {
            label: 'Position',
            section: 'Appearance',
            type: 'select',
            options: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
            default: 'top-left',
        },
        font_size:
        {
            label: 'Font size (pixels)',
            type: 'int',
            default: 12,
            min: 0,
        },
        lines:
        {
            label: 'Height of the box (amount of lines)',
            type: 'int',
            default: 8,
            min:0,
        },
        box_width:
        {
            label: 'Width of the box (pixels)',
            type: 'int',
            default: 300,
            min: 0,
        },
        scrolling:
        {
            label: 'Enable scrolling to see older messages',
            type: 'checkbox',
            default: false,
        },
        hide_system:
        {
            label: 'Hide and/or shorten the most annoying system messages ("Since there aren\'t many players...")',
            type: 'checkbox',
            default: true,
        },
        bind_to_game:
        {
            label: 'Keep the chatbox inside the game viewport.',
            type: 'checkbox',
            default: true,
        },
        sound_on_chat: {
            label: '"Bwep" whenever someone sends a message',
            section: 'Sounds',
            type: 'checkbox',
            default: true,
        },
        sound_on_join: {
            label: '"Dink" whenever someone joins',
            type: 'checkbox',
            default: true,
        },
        sound_on_left: {
            label: '"Donk" whenever someone leaves',
            type: 'checkbox',
            default: true,
        },
        show_time:
        {
            label: 'Time to show RL-chat after recieving a message (seconds)',
            section: ['Showing/Hiding the chat',
                        'By default, the chat is hidden. Once a message arrives, the chat (including past messages) will be shown for a few seconds.'],
            type: 'int',
            default: 6,
            min:0,
        },
        permanent_end:
        {
            label: 'Permanently show RL-chat after the game has ended',
            type: 'checkbox',
            default: true,
        },
        permanent_always:
        {
            label: 'Permanently show RL-chat. Always',
            type: 'checkbox',
            default: false,
        },
        rollingchat:
        {
            label: 'Use the arrow keys to roll while typing',
            type: 'checkbox',
            default: true,
        },
        hide_default_chat:
        {
            label: 'Hide the default chat (Recommended)',
            type: 'checkbox',
            default: true,
        },
    },

    events: { save: update_settings }
});


var position = settings.get('position'),
    show_time = settings.get('show_time'),
    box_width = settings.get('box_width'),
    font_size = settings.get('font_size'),
    lines = settings.get('lines'),
    rollingchat = settings.get('rollingchat'),
    permanent_end = settings.get('permanent_end'),
    permanent_always = settings.get('permanent_always'),
    hide_system = settings.get('hide_system'),
    hide_default_chat = settings.get('hide_default_chat'),
    scrolling = settings.get('scrolling'),
    sound_on_chat = settings.get("sound_on_chat"),
    sound_on_join = settings.get("sound_on_join"),
    sound_on_left = settings.get("sound_on_left"),
    bind_to_game = settings.get("bind_to_game");

function update_settings() {

    if (tpul.playerLocation == 'game') {

        position = settings.get('position');
        show_time = settings.get('show_time');
        box_width = settings.get('box_width');
        font_size = settings.get('font_size');
        lines = settings.get('lines');
        //rollingchat = settings.get('rollingchat');
        permanent_end = settings.get('permanent_end');
        permanent_always = settings.get('permanent_always');
        hide_system = settings.get('hide_system');
        hide_default_chat = settings.get('hide_default_chat');
        scrolling = settings.get('scrolling');
        sound_on_chat = settings.get("sound_on_chat");
        sound_on_join = settings.get("sound_on_join");
        sound_on_left = settings.get("sound_on_left");
        bind_to_game = settings.get("bind_to_game");

        // Update the position
        if (!tpul.noscript) tagpro.chat.resize();

        // Update the width
        box.style.width = box_width + 'px';

        // Update the font size
        box.style.fontSize = font_size + 'px';

        // Update the amount of lines
        spacer.innerHTML = Array(lines+1).join('<br>');

        // Warn if rollingchat has been updated
        if (rollingchat != settings.get('rollingchat')) {
            setTimeout(tpul.notify, 1500,
                       'Rolling chat ' +
                       (settings.get('rollingchat') ? 'will be enabled after a refresh' :
                        'won\'t be enabled after a refresh / next game. (unless you have another script that enables it)'), 'warning');
        }

        // permanent
        if (permanent_always) box.classList.add('permanent');
        else if (permanent_end && !tpul.noscript && tagpro.state == 2) box.classList.add('permanent');
        else box.classList.remove('permanent');

        // (un)hide default chat
        if (default_chat) default_chat.style.display = hide_default_chat ? 'none' : '';

        // scrolling
        if (scrolling) box.classList.add('scroll');
        else box.classList.remove('scroll');

    }
}







// =====NOITCES GIFNOC=====











// =====CSS SECTION=====



// Create our own stylesheet to define the styles in:

var style = document.createElement('style');
document.head.appendChild(style);
var styleSheet = style.sheet;

/* Remove the style rule for the input box from TagPro's stylesheet.
Doesn't work in firefox, lets override all css rules later on.
t:for (let sheet of document.styleSheets) if (sheet.href && sheet.href.endsWith('/stylesheets/style.css')) {
    for (let r in sheet.rules) if (sheet.rules[r].selectorText == '.game input#chat') {
        sheet.removeRule(r);
        break t;
    }
}*/

// The outer container (containing the chat history & text field)
// Define font-size here, to give the chat-wrapper as well as the chat
styleSheet.insertRule(` #RLC-box {
position:absolute;
transition: background 500ms;
width:`+box_width+`px;
border-radius: 10px;
font-size:`+font_size+`px;
margin: 10px;
}`);



// The container when it's shown (while composing a message)
styleSheet.insertRule(`#RLC-box:focus-within, #RLC-box.permanent {
background: rgba(0,0,0,.8);
}`);


// The wrapper around the .chats div
styleSheet.insertRule(`#RLC-box .chats-wrapper {
margin: 5px 0;
position:relative;
overflow: hidden;
}`);

// Add 8 empty lines in it to set the wanted height.
// Using em, or any other method, will result in non-pixel perfect
// heights while zooming (depending on the browser).
/* DEPRECATED: WE NOW USE A REAL SPACER DIV
styleSheet.insertRule(` #RLC-box .chats-wrapper:after {
content: "`+ '\\a'.repeat(lines) +`";
white-space: pre;
}`);*/



// The chat history, which will always contain ALL chats.
// Older chats will just be scrolled out of view
// Opacity set to 0 by default.
styleSheet.insertRule(`#RLC-box .chats {
opacity:0;
overflow:hidden;
transition: opacity 500ms;
transition-delay: 500ms;
position: absolute;
height: 100%;
width: 100%;
padding: 0 5px;
top: 0;
left: 0;
}`);


// SCROLLING
styleSheet.insertRule(`#RLC-box.scroll:focus-within .chats {
overflow-y: auto;
width: calc(100% + 17px);
padding-right: calc(5px + 17px);
scroll-snap-type: mandatory;

/* older spec implementation */
scroll-snap-destination: 0 100%;
}`);

styleSheet.insertRule(`#RLC-box .scrollbar {
position: absolute;
background: rgba(255,255,255,.4);
width: 7px;
border-radius: 5px;
right: 4px;
opacity: 0;
transition: opacity 500ms;
}`);

styleSheet.insertRule(`#RLC-box.scroll:hover:focus-within .scrollbar {
opacity: 1;
}`);



/*styleSheet.insertRule(`#RLC-box:focus-within .chats.scroll::-webkit-scrollbar { width: 17px; }`);
styleSheet.insertRule(`#RLC-box:focus-within:hover .chats.scroll::-webkit-scrollbar-thumb {
border-radius: 10px;
color: rgba(255,255,255,.5);
box-shadow: -17px 0 0 -5px;
}`);*/


// This same box, but when it's .shown
// Using opacity instead of display:none or visibility allows us to use CSS transistion
styleSheet.insertRule(`#RLC-box:focus-within .chats, #RLC-box.permanent .chats, #RLC-box .chats.shown {
opacity:1;
transition-delay: 0s;
}`);

// A single message. Combining these multiple shadows creates a hard 1px line around the text,
// combined with a softer 5px shadow.
// display:inline; to make sure the height doesn't deviate from the set line-height
//  (we need this to make sure that exactly 8 lines fit in the box)
styleSheet.insertRule(` #RLC-box .chats div {
text-shadow: -1px -1px 5px #000, 1px -1px 5px #000, -1px 1px 5px #000, 1px 1px 5px #000, -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
width:inherit;
display: block;
text-overflow: ellipsis;
overflow: hidden;

scroll-snap-align: start;

/* older spec implementation */
scroll-snap-coordinate: 0 100%;
}`);

// The name of a chat message
styleSheet.insertRule(` #RLC-box .chats div .name {
text-transform: uppercase;
font-weight: bold;
margin-right: 3px;
}`);


// Authenticated name: add a green ✔
styleSheet.insertRule(` #RLC-box .chats div.auth .name::before {
content: "✔";
color: #BFFF00;
font-size: 8px;
}`);

// Changing the style of the .name, .message or full chat div depending on what kind of message it is.
styleSheet.insertRule(` #RLC-box .chats div.red       .name    { color:#FFB5BD; }`); // Red name
styleSheet.insertRule(` #RLC-box .chats div.red.team  .message { color:#FFB5BD; }`); // Red team message
styleSheet.insertRule(` #RLC-box .chats div.blue      .name    { color:#CFCFFF; }`); // Blue name
styleSheet.insertRule(` #RLC-box .chats div.blue.team .message { color:#CFCFFF; }`); // Blue team message
styleSheet.insertRule(` #RLC-box .chats div.group              { color:#E7E700; }`); // Group (name&message)
styleSheet.insertRule(` #RLC-box .chats div.mod       .name    { color:#00B900; }`); // Mod name
styleSheet.insertRule(` #RLC-box .chats div.system             { color:#F0E68C; }`); // system message
styleSheet.insertRule(` #RLC-box .chats div.announcement       { color:#FF88FF; }`); // announcement (server shutting down or something)

// Links. Same color as the message, but underlined.
styleSheet.insertRule(` #RLC-box a {
color: #8BC34A;
text-decoration: underline double;
}`);


// The label around the input field.
// This thing has the borders, because we want the
// label text to be inside the border too. ('team', 'group', 'mod'...)
// display:table; will make the input behave like a table-cell, which extends it to the end of the line.
styleSheet.insertRule(` #RLC-box label {
border-radius: 8px;
margin: 3px;
width: calc(100% - 6px);
padding: 3px;
border: 2px inset Gray;
transition: opacity 500ms;
opacity: 0;
display: table;
font-weight: normal;
background: rgba(255,255,255,.15);
cursor: text;
}`);

styleSheet.insertRule(` #RLC-box:focus-within label {
border: 2px outset CadetBlue;
}`);

// Same trick as before to hide/show it.
styleSheet.insertRule(` #RLC-box:focus-within label, #RLC-box.permanent label {
opacity: 1;
}`);

// The style of the label text ('team', 'group', 'mod')
// We have to add content:​ , because otherwise an empty
// input-box would have no height.
styleSheet.insertRule(` #RLC-box label:before {
display: table-cell;
font-weight: bold;
color: LightGrey;
content: '​';
}`);

// Add text to the label, depending on the type of chat you're composing.
styleSheet.insertRule(` #RLC-box label.team:before  {width:1px; padding-right:3px; content: 'team';}`);
styleSheet.insertRule(` #RLC-box label.group:before {width:1px; padding-right:3px; content: 'group';}`);
styleSheet.insertRule(` #RLC-box label.mod:before   {width:1px; padding-right:3px; content: 'mod';}`);

// The input field
// note: this is the original TagPro element, it'll just be moved to the new location
// This way we don't have to bother with the logic behind opening the box, and sending a chat
// We are mainly overriding default parameters.
styleSheet.insertRule(` #RLC-box input#chat {
padding: 0;
position: static;
border: none;
background: none;
outline: none;
transition: all 500ms;
display: none;
width: 100%;
font-size: inherit;
}`);

// Change the text-color of the chat you're composing, based on the type
styleSheet.insertRule(` #RLC-box label.team.red  input {color:#FFB5BD;}`); // Red text
styleSheet.insertRule(` #RLC-box label.team.blue input {color:#CFCFFF;}`); // Blue text
styleSheet.insertRule(` #RLC-box label.group     input {color:#E7E700;}`); // Yellow text
styleSheet.insertRule(` #RLC-box label.mod       input {color:#00B900;}`); // Green text





// =====NOITCES SSC=====



if (tpul.playerLocation == 'game' && !tpul.noscript) {


    // =====DOM SECTION=====



    // Some default DOM elements TagPro
    var canvas = document.getElementById('viewport');
    var game = document.getElementsByClassName('game')[0];
    var default_chat = document.getElementById('chatHistory');
    var input = document.getElementById('chat');



    // Hide the default chat history
    if (hide_default_chat && default_chat) default_chat.style.display = 'none';



    // Create the RLC container

    var box = document.createElement('div');
    box.id = 'RLC-box';
    game.appendChild( box );
    if (permanent_always) box.classList.add('permanent');

    // Add a wrapper for around the chats

    var wrapper = document.createElement('div');
    wrapper.className = 'chats-wrapper';
    box.appendChild(wrapper);

    // Add a "spacer" div to define the height of the wrapper based on some amount of lines
    var spacer = document.createElement('div');
    spacer.className = 'chats-spacer';
    wrapper.appendChild( spacer );
    spacer.innerHTML = Array(lines+1).join('<br>');

    // Add the chat-log to that wrapper

    var chats = document.createElement('div');
    chats.className = 'chats';
    wrapper.appendChild( chats );

    // scrolling
    if (scrolling) box.classList.add('scroll');
    else box.classList.remove('scroll');

    var scrollbar = document.createElement('div');
    scrollbar.className = 'scrollbar';
    wrapper.appendChild(scrollbar);


    // Add a label around the input, shown in case of team or group chat
    var label = document.createElement('label');
    box.appendChild(label);

    // Move the input inside RL chat
    label.appendChild(input);



    // =====NOITCES MOD=====





    // =====LOGIC SECTION=====




    /* global tagpro, $, Autolinker */


    var autolinker = new Autolinker( {
        urls : {
            schemeMatches : true,
            wwwMatches    : true,
            tldMatches    : true
        },
        email       : true,
        phone       : false,
        mention     : false,
        hashtag     : false,

        stripPrefix : true,
        stripTrailingSlash : true,
        newWindow   : true,

        truncate : { length:25, location:'end' }
    } );


    tagpro.ready(function() {

        if (rollingchat) enableRollingChat();

        var timeout;



        //Listen for messages, and add them to RLC:

        function handleChat (chat) {

            // Return disabled chat types
            if (tagpro.settings.ui) {
                if ( !tagpro.settings.ui.allChat && chat.to == "all" && chat.from ) return;
                if ( !tagpro.settings.ui.teamChat && chat.to == "team" ) return;
                if ( !tagpro.settings.ui.groupChat && chat.to == "group" ) return;
                if ( chat.to == "all" && !chat.from ) {
                    if (!tagpro.settings.ui.systemChat) return;
                    if (hide_system && system_messages[chat.message] === null) return;
                }
            }


            // Create the message div
            var message = document.createElement('div');

            var message_span = document.createElement('span');
            message_span.className = 'message';

            if (chat.from) {

                var name_span = document.createElement('span');
                name_span.className = 'name';

                if ( typeof chat.from == "number" ) {
                    var player = tagpro.players[chat.from];

                    if (player.auth) message.classList.add('auth');

                    if (player.team == 1) message.classList.add('red');
                    else if (player.team == 2) message.classList.add('blue');

                    name_span.innerText = player.name;
                } else name_span.innerText = chat.from;

                message.appendChild(name_span);

            } else {
                message.classList.add('system');
            }

            if ( chat.to == "group" ) {
                name_span.innerText = chat.from;
                message.classList.add('group');
            }

            if ( chat.from == "ADMIN_GLOBAL_BROADCAST" ) {
                message.classList.add('announcement');
                name_span.innerText = "ANNOUNCEMENT";
            }

            if ( chat.mod ) {
                message.classList.add('mod');
            }


            if( chat.to == "team") {
                message.classList.add("team");
            }

            message_span.innerText = system_messages[chat.message] || chat.message;
            message_span.innerHTML = autolinker.link( message_span.innerHTML );

            // Linkify the message, and append it
            message.appendChild(message_span);

            if ( chat.c ) message_span.style.color = chat.c;

            // Append the message and scroll the chat
            chats.appendChild(message);
            chats.scrollTop = chats.scrollHeight;

            chats.classList.add('shown');

            clearTimeout(timeout);    // Remove any existing timeout

            timeout = setTimeout(()=>chats.classList.remove('shown'),show_time*1e3);   // Set a timeout to hide the chats

            // Set volume according to the awesome Volume Slider®
            chat_sound.volume = left_sound.volume = join_sound.volume = 1 * tagpro.volumeCoefficient || 1;

            // Play a sound
            if (chat.from && sound_on_chat) chat_sound.play();
            else if (chat.message.includes(' has left ') && sound_on_left)
                left_sound.play();
            else if (chat.message.includes(' has joined ') && sound_on_join)
                join_sound.play();
            else if (sound_on_chat) chat_sound.play();
        }

        tagpro.socket.on('chat', handleChat);
        if (tagpro.group.socket) tagpro.group.socket.on('chat', handleChat);

        // Scrolling:
        chats.onscroll = function(scroll){

            // Update scrollbar
            scrollbar.style.height = 100 * chats.offsetHeight / chats.scrollHeight + '%';
            scrollbar.style.top = 100 * chats.scrollTop / chats.scrollHeight + '%';
        };

        // TODO: click on label opens all-chat (if not yet opened)


        // Change the built-in jQuery function .show()
        //  to make it trigger an event.
        // This function is used by TagPro to show the input-box.
        $.fn.org_show = $.fn.show;
        $.fn.show = function(speed, easing, callback) {
            $(this).trigger('show');
            return $(this).org_show(...arguments);
        };
        // Same for .hide()
        $.fn.org_hide = $.fn.hide;
        $.fn.hide = function(e, r, i) {
            $(this).trigger('hide');
            return $(this).org_hide(...arguments);
        };

        // Keep track of what is the last pressed key,
        // so that we know what label to add.
        var last_keyCode = null;
        document.addEventListener('keydown', event => last_keyCode = event.keyCode);

        // When the input is shown, add a label
        $(input).on('show',function(){

            // Scroll to bottom on opening chat
            chats.scrollTop = chats.scrollHeight;

            setTimeout(function(){
                if ( tagpro.keys.chatToAll.indexOf(last_keyCode) > -1 )
                    label.classList.add('all');
                else label.classList.remove('all');

                if ( tagpro.keys.chatToTeam.indexOf(last_keyCode) > -1 ) {
                    label.classList.add('team');
                    label.classList.add(tagpro.players[tagpro.playerId].team == 1 ? 'red' : 'blue');
                } else label.classList.remove('team');

                if ( tagpro.keys.chatToGroup.indexOf(last_keyCode) > -1 )
                    label.classList.add('group');
                else label.classList.remove('group');

                if ( tagpro.keys.chatAsMod.indexOf(last_keyCode) > -1 )
                    label.classList.add('mod');
                else label.classList.remove('mod');
            });
        });

        // When the input is hidden, hide the label
        $(input).on('hide',function(){

            // Blur the input (not automatically done on firefox)
            this.blur();

            // hide chat on closing it
            clearTimeout(timeout);    // Remove any existing timeout
            chats.classList.remove('shown');  // hide the chats

            label.classList.remove('all');
            label.classList.remove('team');
            label.classList.remove('group');
            label.classList.remove('mod');
        });

        // Permanently show the chat box after a game ends
        if (permanent_end)
            tagpro.socket.on('end', function(end) {
                // Show the box
                box.classList.add('permanent');
            });

        // When clicking the label, open the chat
        // (this will only be used once a game has ended)
        label.addEventListener('click', function(){
            if (input.style.display == 'none') {
                // Open the chat box:
                var e = new Event("keydown");
                e.keyCode = 'RL-Chat';
                tagpro.keys.chatToAll.push('RL-Chat');
                document.dispatchEvent(e);
                tagpro.keys.chatToAll.pop();
            }
        });

        // When the input looses focus, hide it
        // (so that it can be reopened with Enter or T or whatever)
        input.addEventListener('blur', function(){
            if (input.style.display == 'inline-block') {
                // Close the chat box:
                var e = new Event("keydown");
                e.keyCode = 'RL-Chat';
                tagpro.keys.cancelChat.push('RL-Chat');
                input.dispatchEvent(e);
                tagpro.keys.cancelChat.pop();
            }
        });

        // Modify TagPro's resize function, which is called whenever
        // your window size changes. (going fullscreen, zooming, etc.)
        tagpro.chat.org_resize = tagpro.chat.resize;
        tagpro.chat.resize = function() {

            canvas = document.getElementById('viewport');

            switch (position) {

                default: case 'top-left':
                    box.style.top = bind_to_game ? canvas.offsetTop + 'px' : 0;
                    box.style.left = bind_to_game ? canvas.offsetLeft + 'px' : 0;
                    box.style.bottom = '';
                    box.style.right = '';

                    // move 30 pixels down if you have FPS & ping enabled.
                    if (bind_to_game && tagpro.settings.ui.performanceInfo) box.style.top = canvas.offsetTop + 30 + 'px';
                    break;

                case 'top-right':
                    box.style.top = bind_to_game ? canvas.offsetTop + 'px' : 0;
                    box.style.right = bind_to_game ? game.offsetWidth - canvas.offsetLeft - canvas.offsetWidth + 'px' : 0;
                    box.style.bottom = '';
                    box.style.left = '';
                    break;

                case 'bottom-right':
                    box.style.bottom = bind_to_game ? window.innerHeight - canvas.offsetTop - canvas.offsetHeight + 'px' : 0;
                    box.style.right = bind_to_game ? game.offsetWidth - canvas.offsetLeft - canvas.offsetWidth + 'px' : 0;
                    box.style.top = '';
                    box.style.left = '';
                    break;

                case 'bottom-left':
                    box.style.bottom = bind_to_game ? window.innerHeight - canvas.offsetTop - canvas.offsetHeight + 'px' : 0;
                    box.style.left = bind_to_game ? canvas.offsetLeft + 'px' : 0;
                    box.style.top = '';
                    box.style.right = '';
                    break;
            }


            chats.scrollTop = chats.scrollHeight;

            if (!hide_default_chat) {
                default_chat.style.left = canvas.offsetLeft + 10 + 'px';
                default_chat.style.top = canvas.offsetTop + canvas.height - default_chat.offsetHeight - 50 + 'px';
            }

            return tagpro.chat.org_resize(...arguments);

        };

        // Call it once to make sure everyting is positioned correctly at the start.
        tagpro.chat.resize();

    });


    function enableRollingChat(){

        // It is perfectly fine to add this function (unchanged) to your own script.
        // Multiple instances of "rollingchat" can run simultaniously without problems.

        // intercept all key presses and releases:
        document.addEventListener('keydown', keyUpOrDown);
        document.addEventListener('keyup', keyUpOrDown);

        function keyUpOrDown( event ) {

            // The key that is pressed/released (undefined when it is any other key)
            var arrow = ['left','up','right','down'][[37,38,39,40].indexOf(event.keyCode)];

            // Only if the controls are disabled (usually while composing a message)
            // AND the key is indeed an arrow (not undefined)
            if (tagpro.disableControls && arrow) {

                // Whether you are releasing instead of pressing the key:
                var releasing = event.type == 'keyup';

                // Prevent the 'default' thing to happen, which is the cursor moving through the message you are typing
                event.preventDefault();

                // Return if already pressed/released
                if (tagpro.players[tagpro.playerId].pressing[arrow] != releasing) return;

                // Send the key press/release to the server!
                tagpro.sendKeyPress(arrow, releasing);

                // Not necesarry, but useful for other scripts to 'hook onto'
                if (!releasing && tagpro.events.keyDown) tagpro.events.keyDown.forEach(f => f.keyDown(arrow));
                if (releasing && tagpro.events.keyUp) tagpro.events.keyUp.forEach(f => f.keyUp(arrow));
                tagpro.ping.avg&&setTimeout(()=>(tagpro.players[tagpro.playerId][arrow]=!releasing),tagpro.ping.avg/2);
            }
        }
    }
    // =====NOITCES CIGOL=====
}
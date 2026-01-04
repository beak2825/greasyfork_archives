// ==UserScript==
// @name         TagPro GroPro
// @version      1.6
// @description  Enhance your group experience!
// @author       Ko
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/7rbvi4
// @icon         https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/gropro.png
// @match        *://*.koalabeast.com/*
// @match        *://*.jukejuice.com/*
// @match        *://*.newcompte.fr/*
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.0/socket.io.slim.js
// @require      https://greasyfork.org/scripts/371240/code/TagPro%20Userscript%20Library.js
// @connect      koalabeast.com
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/37490/TagPro%20GroPro.user.js
// @updateURL https://update.greasyfork.org/scripts/37490/TagPro%20GroPro.meta.js
// ==/UserScript==



/* todo

Use TPUL's GroupComm:
    ready states
    description

Kicking should also make a "doink" sound

*/



// =====SETTINGS SECTION=====


// I use tpul for this userscripts' options.
// see: https://github.com/wilcooo/TagPro-UserscriptLibrary

var settings = tpul.settings.addSettings({
    id: 'GroPro',
    title: "Configure GroPro",
    tooltipText: "GroPro",
    icon: "https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/gropro.png",


    fields: {
        show_notifications: {
            label: 'Notify chat messages while doing something else',
            type: 'checkbox',
            default: true,
        },
        sound_on_chat: {
            label: '"Bwep" whenever someone sends a message',
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
        color_names: {
            label: 'Color names in chat',
            type: 'checkbox',
            default: true,
        },
        show_timestamps: {
            label: 'Show timestamps in chat',
            type: 'checkbox',
            default: true,
        },
        show_seconds: {
            label: 'Show seconds on those timestamps',
            type: 'checkbox',
            default: true,
        },
        fade_read_chats: {
            label: 'Fade those timestamps when you\'ve read it',
            type: 'checkbox',
            default: true,
        },
        chat_history: {
            label: 'Use the up/down keys to resend messages (console-like)',
            type: 'checkbox',
            default: true,
        },
        prevent_scroll: {
            label: 'Show an arrow when new chats arrive, while you\'re reading old chats',
            type: 'checkbox',
            default: true,
        },
        /*groups_on_home: {
            label: 'Show available groups (worldwide) on the homepage',
            type: 'checkbox',
            default: true,
        },
        groups_on_find: {
            label: 'Show available groups (worldwide) while finding a game',
            type: 'checkbox',
            default: true,
        },
        groups_in_group: {
            label: 'Show available groups (worldwide) while in a group',
            type: 'checkbox',
            default: true,
        },
        position: {
            label: 'Position of the groups on the homepage',
            type: 'select',
            options: ['top','bottom'],
            default: 'top',
        },*/
        show_description: {
            label: 'Show the group\'s description, and enables you to set one',
            type: 'checkbox',
            default: true,
        },
        show_ready_states: {
            label: 'Show which players are ready',
            type: 'checkbox',
            default: true,
        },
        show_ready_btn: {
            label: 'Show an "I\'m ready!" button',
            type: 'checkbox',
            default: true,
        },
        show_play_btn: {
            label: 'Show a "Join a pub" button, which will take only you to the joiner.',
            type: 'checkbox',
            default: true,
        },
        show_someball_btn: {
            label: 'Show an "Add Some Ball" button, in case you need more players to launch',
            type: 'checkbox',
            default: true,
        }
    },

    events: {
        open: function () {

            // Changing the layout a bit after the config panel is opened...

            [...this.frame.getElementsByClassName('field_label')].forEach( function(el) {
                el.classList.remove('col-xs-4');
                el.classList.add('col-xs-8');
                el.nextElementSibling.classList.remove('col-xs-8');
                el.nextElementSibling.classList.add('col-xs-4');
            } );
        },
        save: function() {

            // Making sure (most) options take effect immediately after a save...

            show_notifications = settings.get("show_notifications");
            sound_on_chat = settings.get("sound_on_chat");
            sound_on_join = settings.get("sound_on_join");
            sound_on_left = settings.get("sound_on_left");
            show_timestamps = settings.get("show_timestamps");
            show_seconds = settings.get("show_seconds");
            fade_read_chats = settings.get("fade_read_chats");
            chat_history = settings.get("chat_history");
            prevent_scroll = settings.get("prevent_scroll");
            /*position = settings.get("position");
            groups_on_home = settings.get("groups_on_home");
            groups_on_find = settings.get("groups_on_find");
            groups_in_group = settings.get("groups_in_group");*/
            show_ready_states = settings.get("show_ready_states");
            show_ready_btn = settings.get("show_ready_btn");
            show_play_btn = settings.get("show_play_btn");
            show_someball_btn = settings.get("show_someball_btn");


            /*// Update the position of the groups if necessary:

            var groups_div = document.getElementById('GroPro-groups');

            if (window.location.pathname === '/' && groups_on_home ||
                window.location.pathname.match(/^\/groups\/[a-z]{8}$/) && groups_in_group ||
                window.location.pathname === '/games/find' && groups_on_find ) {

                if (groups_div) {
                    var pos = document.getElementById('userscript-'+position);
                    if (insertBefore) pos.insertBefore(groups_div, pos.firstChild);
                    else              pos.append(groups_div);
                    pos.classList.remove('hidden');
                    groups_div.classList.remove('hidden');
                } else show_groups();
            }

            if (window.location.pathname === '/' && !groups_on_home ||
                window.location.pathname.match(/^\/groups\/[a-z]{8}$/) && !groups_in_group ||
                window.location.pathname === '/games/find' && !groups_on_find ) {

                groups_div.classList.add('hidden');
            }*/


            // Some options need a refresh, show a warning when they're changed:

            if (color_names != settings.get("color_names") ||
                show_description != settings.get("show_description") ||
                show_ready_btn != settings.get("show_ready_btn") ||
                show_play_btn != settings.get("show_play_btn") ||
                show_someball_btn != settings.get("show_someball_btn")) {

                if (tpul.playerLocation == 'group')
                    setTimeout(tpul.notify, 1500, "Some settings might only take effect after a refresh", "warning");
            }
        },
    }
});


var show_notifications = settings.get("show_notifications");
var sound_on_chat = settings.get("sound_on_chat");
var sound_on_join = settings.get("sound_on_join");
var sound_on_left = settings.get("sound_on_left");
var color_names = settings.get("color_names");
var show_timestamps = settings.get("show_timestamps");
var show_seconds = settings.get("show_seconds");
var fade_read_chats = settings.get("fade_read_chats");
var chat_history = settings.get("chat_history");
var prevent_scroll = settings.get("prevent_scroll");
/*var groups_on_home = settings.get("groups_on_home");
var groups_on_find = settings.get("groups_on_find");
var groups_in_group = settings.get("groups_in_group");
var position = settings.get("position");*/
var show_description = settings.get("show_description");
var show_ready_states = settings.get("show_ready_states");
var show_ready_btn = settings.get("show_ready_btn");
var show_play_btn = settings.get("show_play_btn");
var show_someball_btn = settings.get("show_someball_btn");


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- SOUNDS --- ###                                                                                             //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                                                      //  //
var chat_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/chat.mp3');          //  //
var left_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/left.mp3');          //  //
var join_sound = new Audio('https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/joined.mp3');        //  //
                                                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  //
//                                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////




var short_name = 'gropro';             // An alphabetic (no spaces/numbers, preferably lowercase) distinctive name for the script.
var version = GM_info.script.version;  // The version number is automatically fetched from the metadata.
tagpro.ready(function(){ tagpro.scripts = Object.assign( tagpro.scripts || {}, {short_name:{version:version}} ); });
console.log('START: ' + GM_info.script.name + ' (v' + version + ' by ' + GM_info.script.author + ')');





if (tpul.playerLocation == 'groups') {  // If we are on the groups selection page
}

else if (tpul.playerLocation == 'group') {  // If we are in a group

    //if (groups_in_group) show_groups();

    tagpro.ready( function(){




        // Keep track of all interesting variables.
        // TagPro does this too, but it's hidden :(
        // Thats why we do this ourselfs too :)

        var group = tagpro.group = Object.assign(tagpro.group, {
            self:            null,
            players:         {},
            privateGame:     $(".group.container").hasClass("js-private-game"),
            privateGroup:    false,
            currentGamePort: null,
            chat:            [],
            selfAssignment:  false,
            settings:        {},
            maxPlayers:      0,
            maxSpectators:   0,
        });

        var socket = group.socket;

        socket.on('chat', function(chat) {
            chat.time = Date.now(); // This is not in the original TagPro code, but it's handy
            group.chat.push(chat);
        });

        socket.on('port', function(port) {
            group.currentGamePort = port;
        });

        socket.on('member', function(member) {
            if (!group.players[member.id]) send_description();  // Not original TP code either

            // This is slightly altered to allow a 'ready' variable to persist
            group.players[member.id] = Object.assign(group.players[member.id] || {}, member);

            if (group.self) group.self = group.players[group.self.id];
        });

        socket.on('removed', function(removed) {
            delete group.players[removed.id];
        });

        socket.on('full', function() {
            alert('GroPro: This group is full :(');
        });

        socket.on('banned', function() {
            alert('GroPro: You got banned :(');
        });

        socket.on('you', function(you) {
            group.self = group.players[you];
        });

        socket.on('private', function(private){
            group.privateGame = private.isPrivate;
            group.maxSpectators = private.maxSpectators;
            group.maxPlayers = private.maxPlayers;
            group.selfAssignment = private.selfAssignment;
            group.noScript = private.noScript;
            group.respawnWarnings = private.respawnWarnings;
        });

        socket.on('setting', function(setting) {
            group.settings[setting.name] = setting.value;
        });

        socket.on('publicGroup', function(publicGroup) {
            group.public = publicGroup;
        });



        var chat_log = document.getElementsByClassName('js-chat-log')[0];





        // Show notifications on receiving chats // Play sound
        function notify(chat){
            if (show_notifications && !document.hasFocus()) {
                // GM_notification( text, title, icon (defaults to script icon), onclick)
                GM_notification( chat.message, chat.from || group.settings.groupName, null, window.focus );
            }

            // Play a sound
            if (chat.from && sound_on_chat) chat_sound.play();
            //has been kicked from the group.
            else if (sound_on_left && (chat.message.endsWith(' has left the group.') || chat.message.endsWith(' has been kicked from the group.')) )
                left_sound.play();
            else if (sound_on_join && chat.message.endsWith(' has joined the group.'))
                join_sound.play();
            else if (sound_on_chat) chat_sound.play();
        }





        // This function will fade the timestamp when you've seen the message
        function fadeTimestamp(t) {

            // If the window isn't focussed
            if(!document.hasFocus()) {
                return window.addEventListener("focus", function() {
                    fadeTimestamp(t);
                }, {once:true});
            }

            // If the chat row is not in view (due to scrolling)
            if ( t[0].offsetTop < chat_log.scrollTop || t[0].offsetTop > chat_log.scrollTop + chat_log.clientHeight ) {
                return chat_log.addEventListener("scroll", function(){
                    fadeTimestamp(t);
                }, {once:true});
            }

            // Wait 3 secs, and fade if the document is still focussed
            else {
                setTimeout( function(){
                    if (document.hasFocus())
                        t.fadeTo("slow",0.4);
                    else fadeTimestamp(t);
                }, 3000);
            }
        }





        // Don't scroll down when reading old messages

        var scrolled = true;

        chat_log.addEventListener("scroll", function(){
            scrolled = chat_log.scrollTop >= chat_log.scrollHeight - chat_log.clientHeight;
            if (scrolled) arrow.style.display = 'none';
        });

        function scrollChat() {
            if (!prevent_scroll || scrolled)
                chat_log.scrollTop = chat_log.scrollHeight;

            else {arrow.style.display = '';}
        }

        var last_chat = '';

        // Show an arrow instead, that'll bring you back down

        $('<img id="chat-log-arrow" style="position:absolute;right:30px;top:150px;display:none" src="https://raw.githubusercontent.com/wilcooo/TagPro-ScriptResources/master/arrow.png">').appendTo(chat_log);
        var arrow = document.getElementById('chat-log-arrow');
        arrow.style.cursor = 'pointer';
        arrow.title = 'New messages!';
        arrow.onclick = function(){
            chat_log.scrollTop = chat_log.scrollHeight;
            arrow.style.display = 'none';
        };





        // This function receives all chat messages

        function handleChat(chat) {

            var player = group.players[Object.keys(group.players).filter( id => group.players[id].name == chat.from )[0]];
            var match;

            // Append messages starting with ⋯
            var last = group.chat[group.chat.length-1] || {from:null};

            if ( chat.message.startsWith('⋯') && last.from == chat.from && last.time > Date.now()-5) {
                last_chat = last_chat + chat.message.slice(1);
                $(".js-chat-log .chat-message").last().text( last_chat );

                scrollChat();

                return;
            }

            // Handle commands (DEPRECATED, USE THE NEW COMMANDS SYSTEM!)
            if ( ( match = chat.message.match(/^\[GroPro:(\w{1,11})\](.{0,100})$/) ) ) { // If the message is of the form [GroPro:xxx]yyy
                var command = match[1], // the xxx part
                    value = match[2];   // the yyy part

                if (command=='description' && player.leader) {
                    group.description = value;

                    if (show_description) update_gd();

                    return;
                }

                if (command=='ready') {
                    player.ready = true;
                    updateReadyStates();
                    if (!value) return;
                }

                if (command=='notready') {
                    player.ready = false;
                    updateReadyStates();
                    if (!value) return;
                }

                var warning = tagpro.helpers.displayError('Someone sent an unrecognizable command (as you can see in chat). The sender probably doesn\'t know what GroPro is, or you don\'t have the latest version installed.');
                warning[0].onclick = ()=>warning.fadeOut(); // Click to hide
                warning[0].style.cursor = 'pointer';
                warning[0].title = 'Click to hide';
            }

            // Handle an actual message
            last_chat = chat.message;


            var timestamp;

            if (show_timestamps) {
                var time = new Date().toTimeString().substr(0,  show_seconds ? 8 : 5  );
                timestamp = $("<span></span>").addClass("timestamp").text( time );
                if (fade_read_chats) fadeTimestamp(timestamp);
            }

            var player_name = null;
            if (chat.from) {
                var team = player && player.team+1 ? " team-"+player.team : "";

                player_name = $("<span></span>").addClass("player-name" + team).text(chat.from + ": ");
            }

            var chat_message = $("<span></span>").text(chat.message).addClass("chat-message");
            $("<div></div>").addClass("chat-line").append(timestamp).append(player_name).append(chat_message).appendTo(chat_log);

            scrollChat();

            notify(chat);
        }

        // Replace TagPro's function that puts chats in the chat-log
        socket.listeners('chat')[0] = handleChat;

        // Find the correct styleSheet
        for (var styleSheet of document.styleSheets) if (styleSheet.href.includes('/style.css')) break;

        // Add a rule to the sheet for the timestamp and player names
        styleSheet.insertRule(".group .chat-log .timestamp { margin-right: 5px; color: Yellow; }");

        if (color_names) {
            styleSheet.insertRule(".group .chat-log .player-name { color: #4c4c4c }");          // Gray
            styleSheet.insertRule(".group .chat-log .player-name.team-0 { color: #8BC34A; }");  // Green
            styleSheet.insertRule(".group .chat-log .player-name.team-1 { color: #D32F2F; }");  // Red
            styleSheet.insertRule(".group .chat-log .player-name.team-2 { color: #1976D2; }");  // Blue
            styleSheet.insertRule(".group .chat-log .player-name.team-3 { color: #e0e0e0; }");  // White
        }




        // The New Commands System (using 'touch' events / location). Max 12 chars per message!

        // TODO





        // Split long messages, so that you can send those too
        // Also save all sent messages
        // for the history option

        var sent = [], hist = -1, curr = "";

        $('.js-chat-input').off('keydown');  // Remove old handler

        document.getElementsByClassName('js-chat-input')[0].onkeydown = function(key){
            if (key.which == 13) {  // ENTER
                sent.unshift(this.value);
                hist = -1;

                if (this.value.length <= 120) socket.emit("chat", this.value);
                else {
                    var cut, chats = [ this.value.slice( 0, 120 ) ];
                    while ((cut = this.value.slice( chats.length*119+1 ))) {
                        chats.push( '⋯' + cut.slice(0,119) );
                    }

                    for (var c of chats) socket.emit("chat", c);
                }
                this.value = "";

                //chat_log.scrollTop = chat_log.scrollHeight;
            }

            if (chat_history && key.which == 38) { // ARROW-UP
                if (hist == -1) curr = this.value;
                if (hist < sent.length-1) {
                    this.value = sent[ ++hist ];
                    key.preventDefault();   // Prevent the caret/cursor to jump to the start
                }
            }
            if (chat_history && key.which == 40) { // ARROW-DOWN
                if (hist > -1) {
                    this.value = sent[ --hist ] || curr;
                    key.preventDefault();   // Prevent the caret to jump to the end
                }
            }
        };





        // Group description

        document.getElementsByClassName('js-chat-input')[0].placeholder = 'Send a message';

        if (show_description) {

            $(`
                <div id="gd-container" class="col-md-12" style="display:none"><hr>
                    <h3 style="float:left;font-size:16px">Group Description</h3>
                    <div id="gd-btns" style="display:none;float:right;margin-bottom:14px">
                        <a id="gd-save" class="btn btn-default">Save</a>
                        <a id="gd-cancel" class="btn btn-default">Cancel</a>
                    </div>
                    <textarea readonly id="gd-text" maxlength=100 placeholder="Group description (this is also sent to those without the script)" type="text" style="background:#212121;width:100%;padding:5px 10px;resize:vertical" class="chat"></textarea>
                <hr></div>`).insertAfter(document.getElementById('group-chat').parentNode);

            var gd_container = document.getElementById('gd-container');
            var gd_text = document.getElementById('gd-text');
            var gd_save = document.getElementById('gd-save');
            var gd_cancel = document.getElementById('gd-cancel');
            var gd_btns = document.getElementById('gd-btns');

            gd_save.onclick = function(){
                if (gd_text.value != group.description)
                    socket.emit('chat', "[GroPro:description]"+gd_text.value);

                gd_btns.style.display = 'none';
            };

            gd_cancel.onclick = function(){
                update_gd();

                gd_btns.style.display = 'none';
            };

            socket.once('you', function(you){

                update_gd();
                socket.on('member', function(member){
                    if (member.id == group.self.id)
                        update_gd(false);
                });
            });
        }

        group.description = "";

        function editDescription(){
            // Show the save/cancel buttons
            gd_btns.style.display = '';
        }

        function onLeader(){
            gd_text.readOnly = false;
            gd_text.onfocus = editDescription;
        }

        function onNonLeader(){
            gd_text.readOnly = true;
            gd_text.onfocus = null;
            gd_text.value = group.description;

            gd_btns.style.display = 'none';
        }

        function update_gd(text=true) {

            if (!show_description) return;

            if (group.description || group.self.leader)
                gd_container.style.display = '';  //show
            else
                gd_container.style.display = 'none';  //hide

            if (group.self.leader) {
                gd_text.readOnly = false;
                gd_text.onfocus = editDescription;
            } else {
                gd_text.readOnly = true;
                gd_text.onfocus = null;

                gd_btns.style.display = 'none';
            }

            if (text) gd_text.value = group.description;
        }

        function send_description() {

            if (group.self && group.self.leader && group.description ) {
                socket.emit('chat', "[GroPro:description]"+gd_text.value);
            }
        }






        // Play (only you) button

        if (show_play_btn) {

            //<button id="launch-private-btn" class="btn btn-primary js-socket-btn start-game" data-event="groupPlay" onclick="this.blur();">Launch Game</button>

            var play_public_btn = document.createElement('a');
            play_public_btn.className = 'btn btn-primary';
            play_public_btn.innerText = 'Join a Pub';
            play_public_btn.title = 'Only you.\nYou will stay in the group.';
            play_public_btn.href = '/games/find';
            var play_private_btn = play_public_btn.cloneNode(true);

            var launch_public_btn = document.getElementById('launch-public-btn');
            var launch_private_btn = document.getElementById('launch-private-btn');

            launch_public_btn.parentElement.appendChild( play_public_btn );
            launch_private_btn.parentElement.appendChild( play_private_btn );
        }





        // Add Some Ball button

        if (show_someball_btn) {

            // This function is all the code we need to add a Some Ball
            function addSomeBall(){
                var http = new XMLHttpRequest()
                http.open('GET','http://free.pagepeeker.com/v2/thumbs.php?size=t&url=' + location.href + '?r=pagekeeperyoucancontactmeonreddituWILCOOO' + Math.random())
                http.send()
                this.blur()
            }

            // The rest is just adding & styling the button
            var add_someball_btn = document.createElement('button')
            add_someball_btn.title = "For when you need more players to launch.\nThe some ball will leave after a minute."
            add_someball_btn.className = "btn btn-default"
            add_someball_btn.onclick = addSomeBall

            add_someball_btn.innerHTML += ' <svg version="1.0" xmlns="http://www.w3.org/2000/svg" width="80pt" height="80pt" viewBox="0 0 80 80"> <g transform="translate(0,80)scale(0.1,-0.1)"><path d="M207 638 c-19 -45 -37 -89 -39 -97 -8 -36 195 -61 337 -42 133 18 131 14 85 118 -22 49 -46 92 -54 97 -9 7 -35 3 -76 -9 -55 -17 -67 -17 -108 -5 -108 30 -104 32 -145 -62z"/><path d="M75 474 c-162 -49 -56 -92 251 -101 251 -8 446 15 461 53 8 22 -5 31 -69 48 -54 14 -60 13 -110 -7 -46 -18 -73 -21 -213 -21 -141 0 -166 3 -215 22 -30 12 -55 22 -55 21 0 0 -22 -7 -50 -15z"/><path d="M40 305 c0 -8 9 -15 20 -15 18 0 20 -7 20 -80 0 -107 13 -120 121 -120 43 0 89 5 103 11 30 14 56 65 56 108 0 29 2 31 40 31 l40 0 0 -44 c0 -33 6 -52 24 -73 23 -26 30 -28 113 -31 122 -5 134 5 141 116 3 61 8 82 18 82 8 0 14 7 14 15 0 13 -46 15 -355 15 -309 0 -355 -2 -355 -15z m280 -73 c0 -91 -13 -102 -116 -102 l-84 0 0 80 0 80 100 0 100 0 0 -58z m360 -6 c0 -97 1 -96 -95 -96 -96 0 -106 7 -113 80 -7 79 -7 80 108 80 l100 0 0 -64z"/></g></svg> '
            add_someball_btn.innerHTML += ' Add Some Ball '

            document.getElementsByClassName('player-settings')[0].appendChild(add_someball_btn)
        }







        // Ready button

        // First, add the button

        if (show_ready_btn) {

            var ready_public_btn = document.createElement('label');
            ready_public_btn.className = 'btn btn-default group-setting';
            ready_public_btn.style.marginRight = '14px';
            ready_public_btn.innerHTML = '<input type="checkbox" style="margin:0;vertical-align:middle"> I\'m Ready!';
            var ready_private_btn = ready_public_btn.cloneNode(true);

            var launch_public_btn = document.getElementById('launch-public-btn');
            var launch_private_btn = document.getElementById('launch-private-btn');

            launch_public_btn.parentElement.insertBefore( ready_public_btn, launch_public_btn);
            launch_private_btn.parentElement.insertBefore( ready_private_btn, launch_private_btn);

            var ready_public_box = ready_public_btn.getElementsByTagName('input')[0];
            var ready_private_box = ready_private_btn.getElementsByTagName('input')[0];

            var ready_state = false;
            var last_clicked;

            ready_public_btn.onchange = ready_private_btn.onchange = function(change){

                // Find out what your new readystate is
                ready_state = change.target.checked;

                // Update both buttons accordingly (one of them obviously is already right)
                ready_public_btn.getElementsByTagName('input')[0].checked = ready_state;
                ready_private_btn.getElementsByTagName('input')[0].checked = ready_state;

                // Disable the buttons for a few seconds to prevent spamming
                console.log(ready_public_btn.style.cursor);
                ready_public_btn.style.cursor = 'wait';
                ready_private_btn.style.cursor = 'wait';

                ready_public_box.style.cursor = 'wait';
                ready_private_box.style.cursor = 'wait';

                ready_public_box.disabled = true;
                ready_private_box.disabled = true;

                setTimeout(function(){
                    ready_public_btn.style.cursor = '';
                    ready_private_btn.style.cursor = '';

                    ready_public_box.style.cursor = '';
                    ready_private_box.style.cursor = '';

                    ready_public_box.disabled = false;
                    ready_private_box.disabled = false;
                },3000);

                // Warn if the state is changed right after the delay runs out
                if (last_clicked > Date.now() - 6000) {
                    let warning = tagpro.helpers.displayError('Please don\'t change your ready-state more often than needed. Players without the script receive a chat message every time you change it. Thank you :)');
                    warning[0].onclick = ()=>warning.fadeOut(); // Click to hide
                    warning[0].style.cursor = 'pointer';
                    warning[0].title = 'Click to hide';
                }
                last_clicked = Date.now();

                // Tell it to the world
                socket.emit('chat', ready_state ? "[GroPro:ready]" : "[GroPro:notready]");

            };
        }

        for (var event of ['port','member','removed','you','private'])
            socket.on(event, updateReadyStates);

        // This function updates the ready tag beneath each player

        function updateReadyStates(){

            if (!show_ready_states) return;

            for (var player_item of document.getElementsByClassName('player-item')) {
                var player = group.players[ $(player_item).data('model') && $(player_item).data('model').id ];

                var location = player_item.getElementsByClassName('player-location')[0];

                if (player.ready && player.location == "page") {
                    location.innerText = 'Ready!';
                    location.style.color = '#8BC34A';
                }

                else {
                    switch (player.location) {
                        case "page":
                            location.innerText = "In Here";
                            break;
                        case "joining":
                            location.innerText = "Joining a Game";
                            break;
                        case "game":
                            location.innerText = "In a Game";
                    }
                    location.style.color = '';
                }
            }
        }
    } );
}



else if (tpul.playerLocation == 'find') {  // In the process of joining a game
}



else if (tpul.playerLocation == 'game') {  // If we are in a game




    /*if ( hide_system_messages && tagpro.group.socket ) {

        var org_handleChat = tagpro.group.socket.listeners('chat')[0];

        tagpro.group.socket.listeners('chat')[0] = function(chat) {

            // Throw away messages of the form [GroPro:xxx]yyy
            if ( ( match = chat.message.match(/^\[GroPro:(\w{1,11})\](.{0,100})$/) ) ) return;

            else org_handleChat(chat);
        };

    }*/




}

else if (tpul.playerLocation == 'home') {  // If we are on the homepage
}


else {  // If we are on any other page of the server
}
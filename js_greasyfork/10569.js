// ==UserScript==
// @name        v4c/InstaSynch Additional Features (+v4c default emotes)
// @namespace       v4c
// @description     Provides many additional features to enhance the experience of watching the same videos every day. Created by biggles; all credit given in script source.
// @include         *://*.instasync.com/r/*
// @include         *://instasync.com/r/*
// @match           *://*.instasync.com/r/*
// @match           *://instasync.com/r/*
// @require     http://openuserjs.org/src/libs/TimidScript/TSL_-_jsColorGM.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/move.js/0.4.0/move.js
// @version     2.014
// @grant       none
// @author      biggles
// @downloadURL https://update.greasyfork.org/scripts/10569/v4cInstaSynch%20Additional%20Features%20%28%2Bv4c%20default%20emotes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/10569/v4cInstaSynch%20Additional%20Features%20%28%2Bv4c%20default%20emotes%29.meta.js
// ==/UserScript==

//Created by biggles; very few parts used from other sources, where they are given credit.
//Please do not copy&paste my entire script and edit it to pass it off as your own.

/*
    <InstaSync - Watch Videos with friends.>
    Copyright (C) 2015  InstaSync

    <InstaSync modified client code>
    Copyright (C) 2015  biggles
*/

window.messages = 0;
    
String.prototype.repeat = function(num) {
    return new Array(num + 1).join(this);
};

    //for emote script creators, put this at the end: script.delayedTasks.push(name_of_emote_function);
        //script.delayedTasks is a list of functions (sans arguments) executed 700ms after everything else
    //or add all emotes to script.$externalEmotes, which is added to $codes when script.fns.load is called
    

window.script = new function(){
    var self = this;
    var roomname = room.roomName.toLowerCase();
    self.changelog ="<li>Tweaked default quality control a bit.</li>" +
        "<li>Fixed emotes breaking if there was an additional colon in the message. In 2.0141, fixed maximum emote issue again...</li>" +
        "<li>Added scrolling message limit. 2.0141: raised from 20 to 25</li>" +
        "<li>Added two emotes.</li>" +
        "<li>Added Chat Timestamp option.</li>";

    //objects, arrays, functions
        //add your own CSS here
        //"nameofcss":["Proper Name", "author string", "link-to-css"],
        //nameofcss must be unique
    self.cssLinks = {
        "none":["No Custom Layout", "", ""],
        "blacksteel":["Black Steel", "by Dildoer the Cocknight", "https://googledrive.com/host/0B2hdmKDeA0HDOFQ2MTlvNEtQOE0"],
        "instasyncdark":["InstaSync Dark", "by Dildoer the Cocknight", "https://googledrive.com/host/0B2hdmKDeA0HDQl9pQXJpRFQtWUE"],
        "largeplayer":["Large Player (1920x1080)", "by Krogan, Illusory, Dildoer", "https://googledrive.com/host/0B2hdmKDeA0HDai12NGtiNU5sRG8"],
        "largeplayerdark":["Large Player (Dark Chat)", "by Krogan, Illusory, Dildoer", "https://googledrive.com/host/0B2hdmKDeA0HDRlNNbDFWR3phRms"],
        "lightsout":["Lights Out", "by biggles", "https://googledrive.com/host/0B2hdmKDeA0HDeFhBQzAxS0xGTm8"],
        "lightsout2":["Lights Out Darker", "by biggles", "https://googledrive.com/host/0B2hdmKDeA0HDSW5YcG9SVEVDcGc"],
        "mikuxxxgear":["MikuxXxGear", "by MetalxXxGear", "https://googledrive.com/host/0B2hdmKDeA0HDQnE3Z3hfdFhJWUU"],
        "old.instasync":["Old.Instasync", "by fuckballs", "https://googledrive.com/host/0B2hdmKDeA0HDeUFUS2xmOGsxX0E"],
        "oldsynch":["Oldsynch", "by itscake and Krogan", "https://googledrive.com/host/0B2hdmKDeA0HDclpEX1ZfWVNvWkU"],
        "phoenix":["Project Phoenix", "by Krogan, Illusory, Dildoer", "https://googledrive.com/host/0B2hdmKDeA0HDRm5IbFJvWGRPbnM"],
    };
    self.overwriteFunctions = function(){};
    self.setListeners = function(){};
    self.setHTML = function(){};
    self.setCSS = function(){};
    self.fns = {};
    self.$initialcodes = window.$codes;
    if (typeof(self.$externalEmotes) === "undefined") self.$externalEmotes = {};
    self.$newcodes = {};
    self.$colorcodes = {};
    self.$fontcodes = {};
    self.emoteSounds = {};
    self.tasks = [];
    self.pretasks = [];
    self.delayedTasks = [];
    self.colorSettings = { //for color pickers
        "pickerButtons": "CCCCCC",
        "pickerButtonsHoverGlow": "FFFFFF",
        "pickerHandles": "CCCCCC",
        "pickerHandlesGlow": "FFFFFF",
        "pickerProgress": "66A8CC",
        "pickerVolume": "66A8CC",
        "pickerText": "CCCCCC",
        "pickerControlBar": "07141E",
        "pickerControlBarOpacity": 70,
    };
    self.eight_choices = [
        "It is certain",
        "It is decidedly so",
        "Without a doubt",
        "Yes - definitely",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Signs point to yes",
        "Yes",
        "Ask again later",
        "Better not tell you now",
        "Cannot predict now",
        "Don't count on it",
        "My reply is no",
        "My sources say no",
        "Outlook not so good",
        "Very doubtful",
        "Never",
        "Of course not"
    ];
    self.validModActions = { //message: active?
        "cleaned the playlist.":true,
        "created a poll.":true,
        "ended a poll.":true,
        "moved a video.":true,
        "removed a video.":true,
        "has unbanned a user.":true,
        "has kicked a user.":true,
        "has banned a user.":true,
        "leaverbanned a user.":true,
        "paused the video.":true,
        "resumed the video.":true,
        "used next.":true,
        "seekedto.":true,
        "modified skip ratio.":true,
        "has purged videos.":true,
        "changed the MOTD.":true,
        "shuffled the playlist.":true,
    };
    self.settings = { //default settings
        "showVidChat": 1,
        "showVidEmotes": "true",
        "showLogs": "true",
        "showAdd": "true",
        "showFast": "true",
        "showSpin": "false",
        "showRoll": "true",
        "autoClean": "false",
        "useEmotes": "true",
        "fixedNavbar": "true",
        "marqueeSpeed": "50",
        "currentCSS": "none",
        "lastVersion": "0.000",
        "logToChat":"true",
        "defaultQuality":"large",
        "useTimestamps":"false",
        "cssSettings":self.colorSettings,
        "validActions":self.validModActions,
    };
    self.qualities = [
        "hd2160", //4k
        "hd1440", //1440p
        "hd1080", //1080p
        "hd720",   //720p
        "large",   //480p
        "medium",  //360p
        "small",   //240p
        "tiny",    //144p
        "auto"       //auto
    ];
    self.settings[roomname + ".recentVideos"] = "[]";
    self.last = {
        "movedVideo" : [],
        "removedVideo" : {},
        "modAction" : "",
    };
    
    //booleans
    self.debug = false; //if true, certain things will be logged to the console
    self.preloaded = false;
    self.loaded = false;
    self.newMsg = false;
    self.htmlIsSet = false;
    self.bgtimer = false;
    self.kickedUser = [false, ""];
    self.bannedUser = [false, ""];
    
    //variables
    self.version = "2.0141";
    self.fastmsgs = 0;
    self.spinmsgs = 0;
    self.logs = 0;
    self.MAXFAST = 6;
    self.MAXSPIN = 6;
    self.MAXLOGS = 4;
    self.MAXRECENT = 24;
    self.marqueeSpeed = 50;
    self.loadattempts = 0;
    self.bgTimeout = 0;
    self.MAXSCROLL = 25;
}();

window.console.oldLog = window.console.log;
window.console.log = function(msg) {
    console.oldLog(msg);
    script.fns.handleMessage(msg);
}

window.sdbg = new function(){
    var self = this;
    self.log = function(msg) {
        if (script.debug)
            console.oldLog("▌SCRIPT DEBUG▐ " + msg);
        return;
    };
}

window.script.emoteSounds = {
    'chen': new Audio('http://drowngaben.x10.mx/unused/bikehorn.ogg'),
    'doot': new Audio('http://drowngaben.x10.mx/unused/dootdoot.mp3'),
    'chad': new Audio('http://drowngaben.x10.mx/unused/gayniggas.mp3'), 
    'no': new Audio('http://drowngaben.x10.mx/unused/no.mp3'),
    'chen2': new Audio('http://drowngaben.x10.mx/unused/chen2.ogg')
};

window.script.overwriteFunctions = function() {
    //within this function, existing functions on InstaSync will be overwritten by edited versions.
    //so, obviously, anything overwritten doesn't belong to me
    sdbg.log("script.overwriteFunctions called");
    
    window.room.cleanChat = function (){
        //(C) Faqqq, (C) BibbyTube
        //https://github.com/Bibbytube/Instasynch/blob/master/Chat%20Additions/Autoscroll%20Fix/autoscrollFix.js
        var max = room.MAXMESSAGES;
        //increasing the maximum messages by the factor 2 so messages won't get cleared
        //and won't pile up if the user goes afk with autoscroll off
        if(!room.autoscroll)
            max = max*2;
        
        while(messages > max){
            $('#chat_messages > :first-child').remove(); //div messages
            messages--;
        }
    }

    window.room.addMessage = function(user, message, extraStyles) { //extraStyles = additional classes FOR THE MESSAGE STYLE
        var usernameClass = "";
        var rollNumber;
        var rollString = "";
        var ballString = "";
        var rawMessage = message.trim();
        var useEmotes = script.fns.get("useEmotes");
        var vcState = script.fns.get("showVidChat");
        var vceIsEnabled = false;
        var vcClass = '';
          if (vcState !== 0)
            vceIsEnabled = script.fns.get("showVidEmotes");
          
        var myName = room.user.userinfo !== null ? room.user.userinfo.username.toLowerCase() : '';
        if ((room.filterGreyname === true && user.loggedin === false) || room.isMuted(user.ip))
            return;
        usernameClass += user.loggedin ? "registered " : "unregistered ";
        
        if (user.permissions == 1)
            usernameClass += "mod-message";
        else if (user.permissions == 2)
            usernameClass += "admin-message";
        if (user.username == '%addVideo' || user.username == '%modAction')
            usernameClass = 'hide';
        var messageBox = $('<div/>', {
            "class": "chat-message"
        });
        if (myName !== '' && message.toLowerCase().indexOf(myName) > -1 && (user.username !== '%addVideo' && user.username !== '' && user.username !== '%modAction') && room.user.userinfo.loggedin)
            $(messageBox).addClass("chat-mention");
        if (script.fns.byteCount(message) > 250 && user.username != '') {
            message = '<span style="color: #800">(removed)</span>';
            rawMessage = '';
        }
        if ((/(\:fast\:)/i).test(message) && "fast" in $codes) {
            script.fastmsgs += 1;
            vcState = 0;
        }
        if ((/(\:spin\:)/i).test(message) && "spin" in $codes) {
            script.spinmsgs += 1;
            script.fns.cleanSpin();
            vcState = 0;
        }
        
        if (user.username !== '%modAction')
            message = linkify(message);
        var splitmsg = message.split(" ");
        
        if (user.loggedin && user.username.toLowerCase() === "biggles" && user.permissions >= 1) {
            if (splitmsg.length == 2) {
                if (splitmsg[0] == '$delEmote') {
                    if ($codes[splitmsg[1]] != undefined)
                        delete $codes[splitmsg[1]];
                }
            } else if (splitmsg.length == 3) {
                if (splitmsg[0] == "$updated") {
                    script.fns.updateNotice(splitmsg[1], splitmsg[2]);
                }
            } else if (splitmsg.length == 5) {
                if (splitmsg[0] == "$tempEmote") {
                    script.fns.addTempEmote(splitmsg[1], splitmsg[2], splitmsg[3], splitmsg[4]);
                    //$tempEmote name url width height
                }
            }
        }
        
        
        if (splitmsg[0] == '$bump') {
            splitmsg[0] = '<img src="http://i.imgur.com/d1odx.png" width="25" height="25">';
            if (room.user.isMod && user.username.toLowerCase() == myName) {
                if (splitmsg.length == 3)
                    script.fns.bumpUser(splitmsg[1].toLowerCase(), splitmsg[2]);
                    
                else if (splitmsg.length == 2) {
                
                    if (!isNaN(parseInt(splitmsg[1])))
                        script.fns.bumpUser(myName, splitmsg[1]);
                        
                    else
                        script.fns.bumpUser(splitmsg[1].toLowerCase(), null);
                        
                } else if (splitmsg.length == 1)
                    script.fns.bumpUser(myName, null);
            }
        } else if (script.fns.get("showRoll") && user.loggedin && splitmsg[splitmsg.length - 1] == '&#8203;' && splitmsg[0] !== undefined) {
            a = splitmsg;
            if (splitmsg[0].toLowerCase() == '&#8203;$r&#8203;o&#8203;l&#8203;l') {
                rollString = script.fns.postRoll("roll", splitmsg, user.username);
                rollNumber = rollString[1];
                rollString = rollString[0];
            } else if (splitmsg[0].toLowerCase() == '&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l') {
                splitmsg = message.split("|");
                var answer = splitmsg[splitmsg.length - 2];
                ballString = script.fns.postRoll("8ball", answer, user.username);
                splitmsg[splitmsg.length - 2] = '';
            }
        }
        
        message = splitmsg.join(" ");
        
        var timestampSpan;
        var usernameSpan; //we attach the modal popup code to this
        if (script.fns.get('useTimestamps')) {
            timestampSpan = $("<span/>", {
                "class":"msg-timestamp",
                "text":'['+script.fns.utcClock(true)[1]+'] '
            });
            messageBox.append(timestampSpan);
        }
        if (message.substring(0,4) == "/me "){ //emote texte
            vcState = 0;
            message = message['substring'](3);
            message = script.fns.checkEmote(message, false);
            var usernameSpan = $("<span/>", {
                "class":"username emote "+usernameClass,
                "text":user.username+" "
            });
            messageBox.append(usernameSpan);
            messageBox.append($("<span/>",{
                "class":"emote",
                "html":message
            }));
        }
        else if(message[0] == '/' && $codes[message.substring(1)] != undefined && useEmotes){ //emote
            var emote = message['substring'](1);
            if (vceIsEnabled)
              rawMessage = $codes[emote];
            usernameSpan = $("<span/>", {
                    "class":"username "+usernameClass,
                    "text":user.username+": "
            });
            messageBox.append(usernameSpan);
            messageBox.append(($("<span/>",{
                "class":"message",
                "title":"/" + emote,
                "html":$codes[emote] //convert to text when switching anti xss to client side
            })));
        }
        else if(message[0] === '!' || message[0] === '~' || message[0] == '#' || message.substring(0,4) == '&gt;'){
            var type = '';
            if (message.substring(0,4) == '&gt;')
              type = '&gt;';
            else
              type = message[0];
            var classes = {'!': 'urgenttext', '~': 'limetext', '#': 'hashtext', '&gt;': 'greentext'};
            if (vcState == 1)
              vcClass = classes[type];
            message = script.fns.checkEmote(message, false);
            usernameSpan = $("<span/>", {
                "class":"username "+usernameClass,
                "text":user.username+": "
                //"id":usernameId,
                //"text":senderString
            });
            messageBox.append(usernameSpan);
            messageBox.append($("<span/>",{
                "class": "message " + classes[type],
                //"id":usernameId,
                "html":message //convert to text when switching anti xss to client side
            }));
        }
        else{ //regular message
            message = script.fns.checkEmote(message, false);
            usernameSpan = $("<span/>", {
                "class":"username "+usernameClass,
                "text":user.username+": "
            });
            messageBox.append(usernameSpan);
            var msg = $("<span/>",{
                "class":"message "+extraStyles,
                "html":message//switch this to text when switching to xss prevention client side
            });
            messageBox.append(msg);
        }
        messageBox.data("user", user);
        $("#chat_messages").append(messageBox);
        if (vcState !== 0 && user.loggedin && rawMessage.length > 0) {
            if (vcState === 1) {
                script.fns.addScrollingMessage(rawMessage, vcState, vcClass);
            }
        }
        if (script.fns.get("showRoll")) {
            if (rollString !== undefined && !isNaN(parseInt(rollNumber))) {
                $("#chat_messages").append(rollString);
            }
            if (ballString !== undefined && script.eight_choices.indexOf(answer) > -1) {
                $("#chat_messages").append(ballString);
            }
        }
        if (room.autoscroll === true) {
            var textarea = document.getElementById('chat_messages');
            textarea.scrollTop = textarea.scrollHeight;
        }
        if (!$('#cin').is(':focus') && script.newMsg == false) {
            room.roomName.toLowerCase() == "v4c" ? script.fns.setFavIcon('http://i.imgur.com/L4dvBOL.png') : script.fns.setFavIcon('http://i.imgur.com/XiBhO54.png');
            script.newMsg = true;
        }
        if (!$("#tabs_chat").hasClass("active")){
            room.unreadTabMessages++;
            $("#tabs_chat .unread-msg-count").text(room.unreadTabMessages);
        }
        window.messages++;
        room.cleanChat();
        script.fns.cleanFast();
    };
    
    window.room.playVideo = function(vidinfo, time, playing) {
        var self = window.room;
        var addedby = '';
        var title = '';
        var indexOfVid = self.playlist.indexOf(vidinfo);
        if (indexOfVid > -1)
        {
            var title = self.playlist.videos[indexOfVid].title;
            var addedby = self.playlist.videos[indexOfVid].addedby;
            $('#playlist .active').removeClass('active');
            $($('#playlist').children('li')[indexOfVid]).addClass('active');
            //Scroll to currently playing videos
            script.fns.scrollTopPl();
            $('#vidTitle').html(script.fns.checkEmote(title, false) + " <div class='via'>via " + addedby + "</div>");
            script.fns.setTabTitle(vidinfo, addedby, indexOfVid, title); 
            if (self.playerDisabled == false){
                self.video.play(vidinfo, time, playing);
                try{ //incase logobrand isn't ready or something (this has never happened, but just incase because it's not fully tested)
                    self.video.video.logobrand().setTitle(title);
                }
                catch (e){
                    console.oldLog("Failed to set title, logobrand not ready.");
                }
            }
            if (script.last.modAction === "cleaned the playlist.")
                script.last.modAction = "";
            if (script.fns.get("autoClean") && room.user.isMod) {
                setTimeout(function() {
                    if (indexOfVid == 1 && script.last.modAction !== "cleaned the playlist.")
                        room.sendcmd('clean', null);
                }, 500);
            }
            script.bgtimer = false;
            $('.video-image-header').remove();
            clearTimeout(script.bgTimeout);
            script.bgTimeout = 0;
            
            if (room.roomName.toLowerCase() == "v4c") {
                if (room.playlist.videos[indexOfVid].info.id == 'IniyZZqlcwA') {
                    script.bgtimer = true;
                    script.fns.backgroundTimer(19.8, script.bgtimer, "http://i.imgur.com/mIjMpbR.gif");
                } else if (room.playlist.videos[indexOfVid].info.id == '1EKTw50Uf8M') {
                    script.bgtimer = true;
                    script.fns.backgroundTimer(19.4, script.bgtimer, "http://i.imgur.com/zz37ZFX.gif");
                }
            }
            
            script.fns.updateRecent(indexOfVid);
            function quality(quality,a) {
                var q = quality;
                if (a < 10) {
                setTimeout(function(){
                    if(videojs('youtube').isReady_) {
                        console.oldLog('attempted changeQuality('+q+')');
                        script.fns.changeQuality(q);
                    }else{
                        console.oldLog('not ready, retrying quality');
                        quality(script.fns.get('defaultQuality'),a++);
                    }
                    
                },800);
                } else {
                        console.oldLog('exceeded recursive count, attempting to change quality to \'auto\'');
                        script.fns.changeQuality('auto');
                }
            }
            quality(script.fns.get('defaultQuality'),0);
        }
    };
    
    window.utils.secondsToTime = function(num) {
        //modified original function; changes default time length from 00:00 to 0:00
        var hours = Math.floor(num / 3600);
        var minutes = Math.floor((num - (hours * 3600)) / 60);
        var seconds = num - (hours * 3600) - (minutes * 60);

        if (minutes < 10 && hours > 0)
            minutes = "0" + minutes;

        if (seconds < 10)
            seconds = "0" + seconds;

        var time = "";
        if (hours !== 0)
            time += hours + ':';

        time += minutes + ':' + seconds;
        return time;
    };
    room.playlist.url = function(vidinfo) {
            if (vidinfo.info.provider === 'youtube') {
                return 'http://www.youtube.com/watch?v=' + vidinfo.info.id;
            }
            else if (vidinfo.info.provider === 'vimeo') {
                return'http://vimeo.com/' + vidinfo.info.id;
            }
            else if (vidinfo.info.provider === 'twitch') {
                if (vidinfo.info.mediaType === "stream")
                    return 'http://twitch.tv/' + vidinfo.info.channel;
            }
            else if (vidinfo.info.provider === 'dailymotion'){
                return "http://dailymotion.com/video/"+vidinfo.info.id;
            }
            else{
                return "http://instasync.com";
            }
    }
    room.playlist.createVideo = function(video) {
        var self = room.playlist;
        self.videos.push(video);
        var li = $('<li/>', {"data":{video:video}});
            li.append($('<div/>', {
                class:"title",
                title:video.title,
                text:video.title
            }));
            li.append($("<div/>", {
                class:"buttons"
                }).append($("<i/>",{
                    class:"fa fa-times-circle mod remove-video",
                    css: room.user.isMod ? {} : {display: "none"}
                })).append(
                    $("<a/>",{target: "_blank", href: self.url(video)}).append($("<i/>",{class:"fa fa-external-link"}))
                ));
            li.append($("<div/>",{
                class:"pl-video-info"
                }).append($("<div/>",{
                    class:"addedby",
                    html:$("<a/>",{href:"",title:"Added by "+video.addedby,text:"via "+video.addedby})
                })).append($("<div/>",{
                    class:"duration",
                    text:utils.secondsToTime(video.duration)
                })));
        return li;
    };
    var createUser = function(user) {
        var self = room.userlist;
        var css = '';
        css += user.permissions > 0 ? "mod " : "";
        if (user.loggedin) {
            css += "registered ";
            if (script.fns.get("showLogs") && messages > 4) {
                $('<span class="logJoined" style="opacity: 1">+ ' + user.username + '<br />').appendTo('#logs');
                script.logs++;
                script.fns.cleanLog();
            }
        } else css += "unregistered";
        css += room.isMuted(user.ip) ? "muted" : "";
        user.css = css;
        self.users.push(user);
        var userElement = $('<li/>', {
            "class": css,
            "text": user.username,
            "data": {user: user},
            "title": user.username
        });
        return userElement;
    };
    var sortUserlist = function() {
        var self = room.userlist;
        var userlist = $('#user_list li')['clone'](true);
        userlist.sort(function (a, b) {
            var dataA = $(a).data('user');
            var dataB = $(b).data('user');
            var keyA = dataA.css + " "+dataA.username.toLowerCase();
            var keyB = dataB.css + " "+dataB.username.toLowerCase();
            if (keyA < keyB) {
                return -1;
            }
            if (keyA > keyB) {
                return 1;
            }
            return 0;
        });
        $('#user_list').empty();
        $('#user_list').html(userlist);
        self.users.sort(function (a, b) {
            var keyA = a.css + " "+a.username.toLowerCase();
            var keyB = b.css + " "+b.username.toLowerCase();
            if (keyA < keyB) {
                return -1;
            }
            if (keyA > keyB) {
                return 1;
            }
            return 0;
        });
    };
    window.room.playlist.addVideo = function(video) {
        var self = room.playlist;
        if (script.fns.get("showAdd") && messages > 4)
            script.fns.addLog(video.title, video.addedby);
        if ($.isArray(video)){
            //arrays were getting past this for some reason?, so changed instanceof to $.isArray
            var videos = [];
            for (var i = 0; i < video.length; i++) {
                self.totalTime += video[i].duration;
                videos.push(self.createVideo(video[i]));
            }
            $('#playlist').html(videos);
        }
        else{
            self.totalTime += video.duration;
            $('#playlist').append(self.createVideo(video));
        }
        $('#playlist_count').text(self.videos.length + " Videos");
        $('#playlist_duration').text(utils.secondsToTime(self.totalTime));
    };
    
    window.room.userlist.addUser = function(user) {
        var self = room.userlist;
        if ($.isArray(user)){
            var users = [];
            for (var i = 0; i < user.length; i++) {
                users.push(createUser(user[i]));
            }
            $('#user_list').html(users);
        }
        else{
            $('#user_list').append(createUser(user));
        }
        sortUserlist();
        $('.user-count').text(self.users.length);
    };
    
    window.room.userlist.removeUser = function(id) {
        var self = room.userlist;
        var user = room.userlist.users[script.fns.getUserIndex(id)];
        if (user.loggedin && script.fns.get("showLogs") && messages > 4) {
            $('<span class="logLeft" style="opacity: 1">- ' + user.username + '<br />').appendTo('#logs');
            script.logs++;
            script.fns.cleanLog();
        }
        for (var i = 0; i < self.users.length; i++)
        {
            if (id === self.users[i].id)
            {
                self.users.splice(i, 1);
                $($('#user_list').children('li')[i]).remove();
                break;
            }
        }
        $('.user-count').text(self.users.length);
        if (script.kickedUser[0]) {
            room.addMessage({username:'%modAction'},'<span class="modName">'+script.kickedUser[1]+"</span> kicked " + user.username + ".", 'chat-modAction');script.kickedUser[0]=false;
        } else if (script.bannedUser[0]) {
            room.addMessage({username:'%modAction'},'<span class="modName">'+script.bannedUser[1]+"</span> banned " + user.username + ".", 'chat-modAction');script.bannedUser[0]=false;
        }
    };
    
    var oldRemoveVideo = window.room.playlist.removeVideo;
    window.room.playlist.removeVideo = function(video) {
        oldRemoveVideo(video);
        script.last['removedVideo'] = video;
    };
    
    var oldMoveVideo = window.room.playlist.moveVideo;
    window.room.playlist.moveVideo = function(vidinfo, position) {
        oldMoveVideo(vidinfo, position);
        var pl = room.playlist.videos;
        script.last['movedVideo'] = [pl[position], position];
    };
    
    window.room.poll.create = function(poll) {
        var titleClass;
        var classes = {'#': 'hashtext', '!': 'urgenttext', '|': 'spoiler', '~': 'limetext'};
        $(".poll.active").removeClass("active");
        var pollEle = $("<div>",{class: "poll active"});
        if (room.user.isMod){ //mod controls
            pollEle.append($("<div>",{
                class:"mod poll-controls",
                html: $("<i>",{class:"fa fa-pencil poll-edit"}).prop('outerHTML') +" "+ $("<i>",{class: "fa fa-close poll-end"}).prop('outerHTML') //ALL THIS JUST TO ADD A SPACE
            }));
        }
        
        if (poll.title.substring(0, 4) === '&gt;')
            titleClass = 'greentext';
        else if (classes[poll.title[0]] !== undefined)
            titleClass = classes[poll.title[0]];
        var title = $("<div>",{
            class:"poll-title " + titleClass
        });
        
        title.html(script.fns.checkEmote(linkify(title.text(poll.title).html()), false)); //->text()->html() filters out < > etc.
        pollEle.append(title);
        var pollOptionsEle = $("<div>",{class:"poll-options"});
        for (var i = 0; i < poll.options.length; i++){
            var optionClass = '';
            if (poll.options[i].option.substring(0, 4) === '&gt;')
                optionClass = 'greentext';
            else if (classes[poll.options[i].option[0]] !== undefined)
                optionClass = classes[poll.options[i].option[0]];
            var voteEle = $("<span>",{class:"poll-votes",text:poll.options[i].votes});
            voteEle.data("option",i);
            var textEle = $("<div>",{class:"poll-text " + optionClass});
            textEle.html(script.fns.checkEmote(linkify(textEle.text(poll.options[i].option).html()), false));
            pollOptionsEle.append($("<div>",{class: "poll-option",}).append(voteEle).append(textEle));
        }
        pollEle.append(pollOptionsEle);
        pollEle.append($("<div/>",{
            class: "text-danger poll-ended",
            html:$("<i/>",{class:"fa fa-trash-o delete-poll"})
        }));
        pollEle.data('poll',poll);
        $("#poll_tab").prepend(pollEle);
        $("#poll_column").prepend(pollEle.clone(true));
        if (!$("#tabs_polls").parent().hasClass("active")){ //tab is not selected, so highlight it
            $("#tabs_polls").addClass("attention");
        }
    };
    
    room.poll.showCreateModal = function (title, options){
        var option;
        title = title || "";
        options = options || ["",""]; //default is two options
        $("#create-poll #title").val(title);
        $("#create-poll #options_list input").remove();
        for (var i = 0; i < options.length; i++){
            option = $('<input class="form-control create-poll-option" placeholder="Option">');
            option.val(options[i]);
            $('#create-poll #options_list').append(option);
        }
        $('#create-poll').show();
    }
    
    sdbg.log("script.overwriteFunctions finished");
};

window.script.setListeners = function() {
    $('#cin').off("focus");
    $('#cin').on('focus', function() {
        if (script.newMsg) {
            script.newMsg = false;
            var roomname = room.roomName.toLowerCase();
            if (roomname == "v4c") script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png'); else script.fns.setFavIcon('/favicon.ico');
        }
    });
    
    $('#chat_tab_changelog').on('click', function() {
        if ($(this).hasClass('tab_updated-glow'))
            $(this).removeClass('tab_updated-glow');
    });
    
    $('#clearchat_btn').off("click");
    $('#clearchat_btn').on('click', function() {
        script.fns.clearChat();
    });
    
    $('#create_poll_btn_column').off("click");
    $('#create_poll_btn_column').on('click', function() {
        $("#create-poll").toggle();
    });
    
    $("#tabs_users").off("click");
    $("#tabs_users").on('click', function(e){
        e.stopPropagation();
        var userlist = $("#user_list");
        if (userlist.css("right") == "0px"){//already visible
            $(this).removeClass("visible");
            userlist.animate({right: "-"+userlist.width()+"px"});
            $('#chat_messages').css('padding-right', "4px")
        }
        else if (parseInt(userlist.css("right")) < 0) { // closed
            $(this).addClass("visible");
            userlist.animate({right: "0px"});
            $('#chat_messages').css('padding-right', 4+userlist.width()+"px");
        } else {
            return;
        }
        if (room.autoscroll === true) {
            var textarea = document.getElementById('chat_messages');
            textarea.scrollTop = textarea.scrollHeight;
        }
    });
    
    $('#create-poll #submit-poll').on('click', function() {
        var title = $('#create-poll #title').val();
        if (title.trim() == ""){
            $('#create-poll #title').addClass("has-error");
            return;
        }
        else{
            $("#create-poll #title").removeClass("has-error");
        }
        var optionsEle = $('#create-poll #options_list input');
        var options = [];
        for (var i = 0; i<optionsEle.length; i++){
            var val = $(optionsEle[i]).val();
            if (val.trim() != "")
                options.push(val)
        }
        room.sendcmd("poll-create", {title: title, options:options});
    });
    
    $('#create-poll #add-option').on('click', function() {
        if ($('#create-poll #options_list input').length < 10) {
            var option = $('<input class="form-control create-poll-option" placeholder="Option">');
            $('#create-poll #options_list').append(option);
        }
    });
    
    $('#create-poll #clear-fields').on('click', function() {
        $('#create-poll input').val('');
    });
    
    $('#create-poll #close-poll').on('click', function() {
        $('#create-poll').hide();
    });
    
    $('#resetsettings_btn').on('click', function() {
        for (var i in script.settings) {
            if (i.indexOf("recentVideos") < 0)
                localStorage.setItem(i, null)
            if (i.indexOf("cssSettings") < 0)
                localStorage.setItem(i, null)
        }
        script.fns.initializeSettings();
        script.fns.setChecks();
        console.oldLog("Script settings reset to defaults.");
    });
    
    $('#export_playlist').on('click', function() {
        script.fns.getPlaylist();
    });
    
    $('#resetcolor_btn').on('click', function() {
        script.fns.set("cssSettings", JSON.stringify(script.colorSettings));
        script.fns.initJSColor(true);
        console.oldLog("CSS colors reset to defaults.");
    });
    
    $('#recentTab').on('click', function() {
        if ($('#tabs_playlist_recent').hasClass('active') == false)
            script.fns.viewHistory($.parseJSON(script.fns.get(room.roomName.toLowerCase() + ".recentVideos")));
    });
    
    $("#add_video_url").on("keydown", function(e) {
        if (e.which == 13) {
            e.preventDefault();
            $("#add_video_btn").click();
        }
    });
    
    $('#cin').on('keyup', function(e) {
        script.fns.handleChatKeyup(e);
    });

    $('#cin').on('keydown', function(e) {
        var chatArea = $('#cin');
        if (e.which == 13) {
            if (chatArea.hasClass('chatSpecial'))
                chatArea.removeClass('chatSpecial');
            if (script.fns.byteCount(chatArea.val()) > 250) {
                room.addMessage({username:''}, 'Message too large in size. Use less unicode characters. (Message was ' + script.fns.byteCount($('#cin').val()) + ' bytes, max 250 bytes)', 'errortext');
                return false;
            }
            if (chatArea.val() == "'autoclean" && room.user.isMod) {
                script.fns.toggleAutoClean(null);
            } else if (chatArea.val() == "'version") {
                room.addMessage({username:""}, "Script Version: " + script.version, "hashtext");
            }
            var msgTest = chatArea.val().split(' ');
            if (chatArea.val().slice(0, 9) == "'setskip " && !isNaN(parseInt(msgTest[1])) && msgTest[1] > -1 && room.user.isMod) {
                room.addMessage({username:''}, 'Skip rate set to ' + msgTest[1] + '%.', 'hashtext');
            } else if (chatArea.val() == "'clear") {
                script.fns.clearChat();
            } else if (msgTest[0].toLowerCase() == "'countvids") {
                var x = msgTest[1] === "undefined" ? '' : msgTest[1];
                script.fns.findUserVideos(x);
            } else if (msgTest[0] == "&#8203;$r&#8203;o&#8203;l&#8203;l" || msgTest[0] == "&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l") {
                return false;
            } else if (msgTest[0].toLowerCase() === "$roll" && room.user.userinfo.loggedin) {
                msgTest[0] = "&#8203;$r&#8203;o&#8203;l&#8203;l";
                var numbers = 2;
                if (msgTest.length > 1) {
                    var numTest = parseInt(msgTest[1]);
                    if (!isNaN(numTest) && numTest > 0 && numTest < 11) {
                        numbers = msgTest[1];
                    }
                }
                numbers = parseInt(numbers);
                var numCount = "1".repeat(numbers);
                numCount = parseInt(numCount) * 9 + 1;
                var rollnum = "000000000" + Math.floor(Math.random() * numCount).toString();
                rollnum = rollnum.slice(-numbers);
                msgTest[msgTest.length] = rollnum;
                msgTest[msgTest.length] = "&#8203;";
                chatArea.val(msgTest.join(" "));
            }
            if (msgTest[0].toLowerCase() === "$8ball" && room.user.userinfo.loggedin) {
                eight_choices = [
                    "It is certain",
                    "It is decidedly so",
                    "Without a doubt",
                    "Yes - definitely",
                    "You may rely on it",
                    "As I see it, yes",
                    "Most likely",
                    "Outlook good",
                    "Signs point to yes",
                    "Yes",
                    "Ask again later",
                    "Better not tell you now",
                    "Cannot predict now",
                    "Don't count on it",
                    "My reply is no",
                    "My sources say no",
                    "Outlook not so good",
                    "Very doubtful",
                    "Never",
                    "Of course not"
                ];
                msgTest[0] = "&#8203;$8&#8203;b&#8203;a&#8203;l&#8203;l";
                answer = eight_choices[Math.floor(Math.random() * eight_choices.length)];
                msgTest[msgTest.length] = "|" + answer + "|";
                msgTest[msgTest.length] = "&#8203;";
                chatArea.val(msgTest.join(" "));
            }
            
        }
    });
    
    $("#vidchat-setting").on("change", ".radio input", function(){
        var state = $(this).attr('data-state');
        script.fns.set('showVidChat', state);
    });
    
    $("#toggle_vidchatemotes_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("showVidEmotes", checked);
    });
    
    $("#action_list").on("change", "input", function(){
        var checked = $(this).is(":checked");
        var val = $(this).attr('value');
        if (val in script.validModActions) {
            script.validModActions[$(this).attr('value')] = checked;
            script.fns.set("validActions", JSON.stringify(script.validModActions));
        }
    });
    
    $("#qualityList").on("change", ".radio input", function(){
        var val = $(this).attr('data-q');
        script.fns.setDefaultQuality(val);
    });
    
    $("#toggle_autoclean_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.toggleAutoClean(checked);
    });
    
    $("#toggle_logtochat_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("logToChat", checked);
    });
    
    $("#toggle_showadd_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("showAdd", checked);
    });
    
    $("#toggle_showroll_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("showRoll", checked);
    });
    
    $("#toggle_useemotes_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("useEmotes", checked);
    });
    
    $('#toggle_usetimestamps_box').on("change", function() {
        var checked = $(this).is(":checked");
        script.fns.set('useTimestamps', checked);
    });
    
    $("#toggle_navbar_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("fixedNavbar", checked);
        
        checked ? $('.navbar-fixed-top, .navbar-fixed-bottom').css('position', 'fixed') : $('.navbar-fixed-top, .navbar-fixed-bottom').css('position', 'static');
    });
    
    $("#toggle_fast_box").on("change", function() {
        var checked = $(this).is(":checked");
        script.fns.set("showFast", checked);
        checked ? $codes['fast'] = '<marquee direction="right" scrollamount="' + script.fns.get("marqueeSpeed") + '">' : delete $codes.fast;
    });
    
    $('#toggle_spin_box').on("change", function() {
        var checked = $(this).is(":checked");
        script.fns.set("showSpin", checked);
        checked ? $codes['spin'] = '<span class="spinnew">' : delete $codes.spin;
    });
    
    $("#toggle_showlogs_box").on("change", function(){
        var checked = $(this).is(":checked");
        script.fns.set("showLogs", checked);
        if (checked) {
            $('.logWrapper').show();
        } else {
            $('.logWrapper').hide();
            $('#logs').empty();
        }
    });
}

window.script.fns = {
    
    set: function(key, value) {
        localStorage.setItem(key, value);
    },
    
    get: function(key) {
        var a = localStorage.getItem(key);
        var b;
        if (a == "true" || a == "false")
            if (a == "true")
                b = true;
            else
                b = false;
        else if (!isNaN(parseInt(a)) && key !== "lastVersion")
            b = parseInt(a);
        else b = a;
        return b;
    },
    
    remove: function(key) {
        localStorage.removeItem(key);
    },

    handleChatKeyup: function(event) {
        var chatArea = $('#cin');
        var cls = 'chatSpecial';
        if (chatArea.val()[0] === '<') {
            if (!chatArea.hasClass(cls))
              if (script.fns.get("showVidChat") === 1)
                chatArea.addClass(cls);
        } else {
            if (chatArea.hasClass(cls))
                chatArea.removeClass(cls);
        }
    },
    
    updateNotice: function(state, ver) {
        if (state == 'on' && ver != script.version) {
            $('.newUpdate').show();
        } else if (state == 'off') {
            $('.newUpdate').hide();
        }
    },
    
    setFast: function(data) {
        if (!isNaN(parseInt(data))) {
            if (data > 999) {
                data = 999;
                $('#marqueeinput').val(data);
            }
            script.fns.set("marqueeSpeed", data);
            if (script.fns.get("showFast")) {
                $codes['fast'] = '<marquee direction="right" scrollamount="' + data + '">';
            }
        }
    },
    
    updateRecent: function(a) {
        sdbg.log("updateRecent called");
        var recent = script.fns.get(room.roomName.toLowerCase() + ".recentVideos");
        recent = $.parseJSON(recent);
        if (recent == null)
            recent = [];
        if (recent.some(function(b) {return b.info.id == room.playlist.videos[a].info.id}) == false) {
            recent.push(room.playlist.videos[a]);
            if (recent.length > script.MAXRECENT)
                recent = recent.slice(recent.length - script.MAXRECENT)
            script.fns.viewHistory(recent);
        }
        recent = JSON.stringify(recent);
        script.fns.set(room.roomName.toLowerCase() + ".recentVideos", recent);
    },
    
    postRoll: function(type, a, user) {
        var msgClass = '';
        if (type == "roll") {
            msgClass = 'rollDigits ';
            var rolledNumber = a[a.length - 2];
            var numColor = '#005cff';
            a[a.length - 2] = '';
            if (rolledNumber.length > 10)
                rolledNumber = rolledNumber.slice(0, 10);
                
            if (rolledNumber == parseInt(rolledNumber)) {
                var j = 1;
                var k = rolledNumber.length;
                for (var i = 1; i < k; i++) {
                    if (rolledNumber[i] === rolledNumber[i - 1])
                        j++;
                    else
                        break;
                }
                if (k === j) msgClass += 'rollConsecutive ';
                return ['<span class="gm rollstr">&nbsp;' + user + ' rolled <span class="'+msgClass+'">' + rolledNumber + ' </span><br />', rolledNumber];
            } else return "";
        } else if (type == "8ball") {
            msgClass = 'ballAnswer ';
            return '<span class="gm ballstr">&nbsp;' + user + ': 8ball says, <span class="'+msgClass+'">"' + a + '" </span><br />';
        } else return '';
    },
    
    clearChat: function() {
        $('#chat_messages').empty();
        messages = script.fastmsgs = script.spinmsgs = 0;
    },
    
    utcClock: function(getTime) {
        var time = new Date();

        var utcTime = {hrs: time.getUTCHours(), min: time.getUTCMinutes(), sec: time.getUTCSeconds()}
        var localTime = {hrs: time.getHours(), min: time.getMinutes(), sec: time.getSeconds()}
        
        
        if (localTime['hrs'] > 12)
            localTime['hrs'] = localTime['hrs'] - 12;
        else if (localTime['hrs'] == 0)
            localTime['hrs'] = 12;
            
        for (var i in utcTime) {
            if (utcTime[i] < 10 && i !== 'hrs') utcTime[i] = "0" + utcTime[i];
            if (localTime[i] < 10 && i !== 'hrs') localTime[i] = "0" + localTime[i];
        }

        var utcString = utcTime.hrs + ":" + utcTime.min + ":" + utcTime.sec;
        var localString = localTime.hrs + ":" + localTime.min + ":" + localTime.sec;
        if (getTime)
            return [utcString, localString];
        
        //remains as #gmtClock so people don't have to restyle it
        $('#gmtClock').text(utcString + ' UTC');

        setTimeout(function() {script.fns.utcClock()}, 1000);
    },
    
    getPlaylist: function() {
        //heavily modified from Bibby's exportPlaylist() at https://github.com/Bibbytube/Instasynch under Playlist Additions/Export Playlist Command
        var output = '';
        var videoTitle = '';
        var playlist = room.playlist.videos;
        if (playlist.length > 0) {

            for (i = 0; i < playlist.length; i++) {
                playlist[i].title.length > 100 ? videoTitle = playlist[i].title.substring(0, 100) + '...' : videoTitle = playlist[i].title;
                switch (playlist[i].info.provider) {
                    case 'youtube':
                        output += i + '. <span style="color: #FFB0B0">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://youtube.com/watch?v=' + playlist[i].info.id + '">http://youtube.com/watch?v=';
                        break;
                    case 'vimeo':
                        output += i + '. <span style="color: #61CCFF">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://vimeo.com/' + playlist[i].info.id + '">http://vimeo.com/';
                        break;
                    case 'twitch':
                        output += i + '. <span style="color: #E8BEFF">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://twitch.tv/' + playlist[i].info.channel + '">http://twitch.tv/';
                        break;
                    case 'dailymotion':
                        output += i + '. <span style="color: #F8FFA1">' + videoTitle + ' <span style="color: #84FFAB">-</span></span> <a style="color: #4FDFFA" href="http://dailymotion.com/video/' + playlist[i].info.id + '">http://dailymotion.com/video/';
                        break;
                    default:
                        continue;
                }
                playlist[i].info.provider === 'twitch' ? output += playlist[i].info.channel + '</a>\n<br />' : output += playlist[i].info.id + '</a>\n<br />';
            }
            try {
                var newWindow = window.open("", "_blank", "scrollbars=1,resizable=1");
                newWindow.document.write('<span style="font-size: 16px; color: white">Select all (ctrl+a), copy/paste and save this somewhere.<br />Room: ' + room.roomName + '<br />Videos: ' + playlist.length + '</span><br /><br /><div id="playlistInfo" style="font-size: 12px; color: #84FFAB">' + output + '</div>');
                newWindow.document.body.style.background = 'black';
                newWindow.document.body.style.fontFamily = 'tahoma';
            } catch (e) {
                console.error('Cannot open Playlist window. Are pop-ups disabled? ERROR: ' + e.message);
            }
        } else {
            console.error("Cannot grab playlist, no videos.");
            return;
        }
    },
    
    // adjustCurtain() -- resize curtain upon change of screen layout, and toggle
    adjustCurtain: function () {
        var a = {h: $('#media').height(), w: $('#media').width()};
        
        // a is an object of #media dimensions {h: height,w: width}
        
        // floor of the curtain always has a constant height, so subtract
        // the height of the floor from the height of the video to get the new curtainTop height
        if ($('#curtainTop').width() !== a.w)
            $('#curtainTop').width(a.w);
        if ($('#curtainFloor').width() !== a.w)
            $('#curtainFloor').width(a.w);
        if ($('.curtain').height() !== a.h)
            $('.curtain').height(a.h);
        
        $('#curtainFloor').height() === 0 ? $('#curtainFloor').height(72) : $('#curtainFloor').height(0);
        
        $('#curtainTop').height() === 0 ? $('#curtainTop').height($('#media').height() - 72) : $('#curtainTop').height(0);
          
    },
    
    hex2rgb: function(hexStr) { //can be found here:
        // http://stackoverflow.com/questions/4262417/jquery-hex-to-rgb-calculation-different-between-browsers



        // note: hexStr should be #rrggbb
        var hex = parseInt(hexStr.substring(1), 16);
        var r = (hex & 0xff0000) >> 16;
        var g = (hex & 0x00ff00) >> 8;
        var b = hex & 0x0000ff;
        return [r, g, b];
    },
    
    updateColor: function(id, hex) {
        var log = id + " passed to updateColor with hex color #" + hex + ".";
        if (id in script.colorSettings && id !== "pickerControlBarOpacity") {
            log += " accepted.";
            el = 'head #h-' +id+ '.script-css-colors';
            switch (id) {
                case 'pickerButtons': $(el).html('.vjs-default-skin .vjs-play-control, .vjs-mute-control, .vjs-fullscreen-control {color: #'+hex+'}'); break;
                case 'pickerHandles': $(el).html('.vjs-slider-handle {color: #'+hex+'}'); break;
                case 'pickerHandlesGlow': $(el).html('.vjs-slider-handle:before {text-shadow: 0em 0em 1em #'+hex+'!important}'); break;
                case 'pickerButtonsHoverGlow': $(el).html('.vjs-default-skin .vjs-play-control:hover:before, .vjs-mute-control:hover:before, .vjs-fullscreen-control:hover:before {text-shadow: 0em 0em 1em #'+hex+'!important}'); break;
                case 'pickerProgress': $(el).html('.vjs-play-progress {background-color: #'+hex+'!important}'); break;
                case 'pickerVolume': $(el).html('.vjs-volume-level {background-color: #'+hex+'!important}');break;
                case 'pickerText': $(el).html('.vjs-current-time-display, .vjs-time-divider, .vjs-duration-display, .vjs-quality-button {color: #'+hex+'}'); break;
                case 'pickerControlBar':
                    var rgb = script.fns.hex2rgb("#"+hex);
                    var opac;
                    opac = parseInt($.parseJSON(script.fns.get('cssSettings')).pickerControlBarOpacity) / 100;
                    if (isNaN(opac) || (opac<0 || opac>1)) {
                        opac = .7;
                        $('#pickerControlBarOpacity').val(70);
                    }
                    $(el).html('.vjs-control-bar {background-color: rgba('+rgb[0]+', '+rgb[1]+', '+rgb[2]+', '+opac+')!important}');
                    break;
            }
            log += " color changed.";
            var css = $.parseJSON(script.fns.get("cssSettings"));
            css[id] = hex;
            css['pickerControlBarOpacity'] = $('#pickerControlBarOpacity').val();
            log += " localStorage updated.";
            script.fns.set("cssSettings", JSON.stringify(css));
        }
        sdbg.log(log + " done!");
    },
    
    findUserVideos: function(user) {
        if (typeof(user) === 'string' && user !== '') {
            var vids = 0;
            var userLower = user.toLowerCase();
            if (room.playlist.videos.length > 0) {
                for (var i = 0; i < room.playlist.videos.length; i++) {
                  if (room.playlist.videos[i].addedby.toLowerCase() == userLower) {
                    vids++;
                  }
                }
                room.addMessage({username:''},'Found ' + vids + ' video(s) added by ' + user + '.','hashtext');
            } else {
                room.addMessage({username:''},'No videos in playlist.','urgenttext');
            }
        } else {
            room.addMessage({username:''},"Usage: 'countvids [username]","hashtext");
        }
    },
    
    getUserIndex: function(id) {
        for (var i = 0; i < room.userlist.users.length; i++) {
            if (id == room.userlist.users[i].id) {
                return i;
            }
        }
        return -1;
    },
    
    cleanLog: function() {
        if (script.logs > script.MAXLOGS) {
            $('#logs span').eq(1).css('opacity', '.4');
            $('#logs span').eq(2).css('opacity', '.6');
            $('#logs span').eq(3).css('opacity', '.8');
            $('#logs span').eq(0).remove();
            script.logs--;
        }
    },
    
    setTabTitle: function(a,b,c,d) { //vidinfo, addedby, video index, title
        var newTitle = d;
        if (newTitle.length > 55) {
            newTitle = newTitle.substring(0, 55);
            newTitle += '...';
        }
        var currentVid = newTitle + ' via ' + b;
        var videoLink = '';
        document.title = decodeURIComponent('%E2%96%B6') + ' ' + currentVid;
        switch (a.provider) {
            case "youtube":
                videoLink = 'http://youtu.be/' + a.id;
                break;
            case "vimeo":
                videoLink = 'http://vimeo.com/' + a.id;
                break;
            case "twitch":
                videoLink = 'http://twitch.tv/' + a.channel;
                break;
            case "dailymotion":
                videoLink = 'http://dailymotion.com/video/' + a.id;
                break;
            default:
                videoLink = 'unlisted source';
                break;
        }
        console.oldLog('Now playing: ' + currentVid + ' ( ' + videoLink + ' )');
    },
    
    setFavIcon: function(src) {
        var a = '<link rel="shortcut icon" class="scr-fav" href="' + src + '">';
        $('.scr-fav').length ? $('.scr-fav').attr('href', src) : $('head').append(a);
    },
    
    scrollTopPl: function() { //from built-in room.playVideo
        $('#playlist').animate({
            scrollTop: $("#playlist .active").offset().top - $("#playlist .active").offset().top + $("#playlist .active").scrollTop()
        });
    },
    
    byteCount: function(s){return encodeURIComponent(s).replace(/%[A-F\d]{2}/g,'x').length},
    //https://gist.github.com/mathiasbynens/1010324
    
    playSound: function(sound) {
        var vol = 0.8;
        if (typeof(room.video) !== "undefined")
            vol = room.video.video.volume();
        sound.volume = vol;
        sound.play();
    },
    
    testHexColor: function(str) {
        if (str.length == 7) {
            return (/^#[0-9a-f]{6}$/i).test(str);
        } else if (str.length == 4) {
            return (/^#[0-9a-f]{3}$/i).test(str);
        } else {
            return false;
        }
    },
    buildEmotes: function() {
        sdbg.log("script.fns.buildEmotes called");
        window.script.$initialcodes = window.$codes;
        window.script.$newcodes = {
        //modified original emotes
            'chen': '<img src="http://i.imgur.com/j55EMQt.png" width="50" height="46" onclick="script.fns.playSound(script.emoteSounds.chen);">',
            'doot': '<img src="http://i.imgur.com/WfUlQ5Q.gif" width="50" height="45" onclick="script.fns.playSound(script.emoteSounds.doot);">',
            'bestgames': '<img src="http://i.imgur.com/ImyXj.png" width="48" height="54" onclick="script.fns.playSound(script.emoteSounds.chad);">',
            'no': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="script.fns.playSound(script.emoteSounds.no);">',
            'idontwantthat': '<img src="http://i.imgur.com/nKa8o.png" width="41" height="30" onclick="script.fns.playSound(script.emoteSounds.no);">',
            'heero' : '<img src="http://i.imgur.com/D7JCR6j.png" width="60" height="55">',
            'kek' : '<img src="http://i.imgur.com/xrw4paP.png" width="40" height="54">',
        //additional emotes
            'chen2': '<img src="http://i.imgur.com/TGHRo8W.gif" width="54" height="50" onclick="script.fns.playSound(script.emoteSounds.chen2);">',
            'kitty2': '<img src="http://i.imgur.com/21lmh2J.gif" width="38" height="60">',
            'enjoytheanime' : '<img src="http://i.imgur.com/aXPWln0.png" width="48" height="60">',
            'straya' : '<img src="http://i.imgur.com/PNB0kE9.gif" width="50" height="50">',
            'neverever' : '<img src="http://i.imgur.com/MJnWGHV.png" width="52" height="50">',
            'gud': '<img src="http://i.imgur.com/Ms3Zxne.png" width="62.5" height="50">',
            'feelssmug': '<img src="http://i.imgur.com/og9In6D.png" width="48" height="48">',
            'puke': '<img src="http://i.imgur.com/IADYHCP.png" width="58" height="58">',
            'tip': '<img src="http://i.imgur.com/QWhYbc8.gif" width="49" height="54">',
            'copythat': '<img src="http://i.imgur.com/VOibACz.png" width="31" height="51">',
            'ree': '<img src="http://i.imgur.com/U1Trjzq.gif" width="42" height="42">',
            'alien2': '<img src="http://i.imgur.com/jBji5uc.gif" width="43" height="63">',
            'feeldance': '<img src="http://i.imgur.com/HsG9goI.gif" width="46" height="61">',
            'kkk': '<img src="http://i.imgur.com/52FF0aK.gif" width="60" height="45">',
            'kek2': '<img src="http://i.imgur.com/87P6Xy6.gif" width="58" height="50">',
            "dewbunker" : '<img src="https://i.imgur.com/GWYXYBp.gif" width="32" height="46">',
            "cool" : '<img src="https://i.imgur.com/oh9I5dq.png" width="53" height="49">',
            'tailsthefaggot' : '<img src="https://i.imgur.com/WlTScSQ.png" width="40" height="40">',
            'tails' : '<img src="https://i.imgur.com/WlTScSQ.png" width="40" height="40">',
            "slav" : '<img src="https://i.imgur.com/DWp3VOQ.gif" width="45" height="46">',
            "stepfather" : '<img src="https://i.imgur.com/1PvWGzC.png" width="43" height="69">',
            "dolan" : '<img src="https://i.imgur.com/NF0yh.png" width="44" height="45">',
            "ameer" : '<img src="https://i.imgur.com/zg7DE.gif" width="50" height="58">',
            "jew" : '<img src="https://i.imgur.com/zg7DE.gif" width="50" height="58">',
            'ready' : '<img src="https://i.imgur.com/oBAIjLy.png" width="43" height="59">',
            "usa" : '<img src="https://i.imgur.com/tSXNh.gif" width="60" height="42">',
            "#bump" : '<img src="https://i.imgur.com/d1odx.png" width="25" height="25">',
            "birry" : '<img src="https://i.imgur.com/DduoO.gif" width="33" height="53">',
            "dog" : '<img src="https://i.imgur.com/OcGfN.gif" width="53" height="53">',
            "=/" : '<img src="https://i.imgur.com/d1odx.png" width="25" height="25">',
            "gaben" : '<img src="https://i.imgur.com/T5SCh.gif" width="43" height="54">',
            "taco" : '<img src="https://i.imgur.com/5OVAa.png" width="39" height="54">',
            "doingitwell" : '<img src="https://i.imgur.com/5OVAa.png" width="39" height="54">',
            "fuckyou" : '<img src="https://i.imgur.com/mI0do.png" width="39" height="56">',
            "fickdich" : '<img src="https://i.imgur.com/mI0do.png" width="39" height="56">',
            "3" : '<img src="https://i.imgur.com/Aav23.png" width="35" height="36">',
            "burd" : '<img src="https://i.imgur.com/kQcjC.gif" width="35" height="36">',
            "snoop" : '<img src="https://i.imgur.com/Bmsp9.gif" width="23" height="50">',
            "jimmies" : '<img src="https://i.imgur.com/gQB3S.gif" width="35" height="38">',
            'sanic' : '<img src="https://i.imgur.com/qpYdZhe.png" width="50" height="50">',
            "america" : '<img src="https://i.imgur.com/3Wxtk.gif" width="36" height="56">',
            "dilbert" : '<img src="https://i.imgur.com/WteuLYV.gif" width="56" height="55">',
            "loading" : '<img src="https://i.imgur.com/LpBOu.gif" width="53" height="54">',
            'van' : '<img src="https://i.imgur.com/2nevgyO.png" width="40" height="49">',
            'deepdarkfantasy' : '<img src="https://i.imgur.com/2nevgyO.png" width="40" height="49">',
            "satan" : '<img src="https://i.imgur.com/W9XSh.gif" width="43" height="54">',
            "bioware" : '<img src="https://i.imgur.com/1K4gw.gif" width="41" height="48">',
            'shazbot' : '<img src="https://i.imgur.com/snoL3d4.png" width="36" height="47">',
            'reddit' : '<img src="https://i.imgur.com/asSh8VE.png" width="80" height="16">',
            '9gag' : '<img src="https://i.imgur.com/asSh8VE.png" width="80" height="16">',
            "bestkorea" : '<img src="https://i.imgur.com/Kd2oh.gif" width="43" height="54">',
            "assntitties" : '<img src="https://i.imgur.com/CALcK.png" width="38" height="42">',
            "hitoame" : '<img src="https://i.imgur.com/ofu37.gif" width="55" height="50">',
            "penis" : '<img src="https://i.imgur.com/VorSn.gif" width="50" height="58">',
            "duane" : '<img src="https://i.imgur.com/oCCMY.gif" width="70" height="47">',
            "plzgo" : '<img src="https://i.imgur.com/ilhsw.png" width="46" height="55">',
            "no" : '<img src="https://i.imgur.com/nKa8o.png" width="41" height="30">',
            "idontwantthat" : '<img src="https://i.imgur.com/nKa8o.png" width="41" height="30">',
            "keke" : '<img src="https://i.imgur.com/Pf0Xa.png" width="43" height="44">',
            'uncle' : '<img src="https://i.imgur.com/voNzQU0.png" width="44" height="52">',
            "reshiram" : '<img src="https://i.imgur.com/nrGTe.gif" width="44" height="50">',
            "push" : '<img src="https://i.imgur.com/98R1p.gif" width="43" height="49">',
            "ohshitimsorry" : '<img src="https://i.imgur.com/98R1p.gif" width="43" height="49">',
            'autism' : '<img src="https://i.imgur.com/3FHPYB8.png" width="55" height="55">',
            "juggalo" : '<img src="https://i.imgur.com/qZpT3.gif" width="43" height="49">',
            "dewritos" : '<img src="https://i.imgur.com/cRRtv.jpg" width="39" height="57">',
            "stanza" : '<img src="https://i.imgur.com/1WRTO.png" width="41" height="58">',
            "bestgames" : '<img src="https://i.imgur.com/ImyXj.png" width="48" height="54">',
            "gamestop" : '<img src="https://i.imgur.com/kpJu4.gif" width="65" height="33">',
            "o" : '<img src="https://i.imgur.com/WifGe.gif" width="34" height="34">',
            "fothegrove" : '<img src="https://i.imgur.com/wqwV1.gif" width="35" height="38">',
            "aliens" : '<img src="https://i.imgur.com/QN73Y.gif" width="50" height="57">',
            "go" : '<img src="https://i.imgur.com/aqhrV.gif" width="50" height="38">',
            'pomf' : '<img src="https://i.imgur.com/9u5HyPW.png" width="41" height="46">',
            "kreayshawn" : '<img src="https://i.imgur.com/otpxf.png" width="41" height="51">',
            "bodywash" : '<img src="https://i.imgur.com/eEGbx.png" width="41" height="51">',
            'goblinu' : '<img src="https://i.imgur.com/QP3lELA.png" width="55" height="38">',
            "nogaems" : '<img src="https://i.imgur.com/rjSeG.gif" width="47" height="57">',
            "feel" : '<img src="https://i.imgur.com/4lwg0.png" width="40" height="37" onclick="this.src = \'https://i.imgur.com/BZ3WF.png\'">',
            "feelsbadman" : '<img src="https://i.imgur.com/4lwg0.png" width="40" height="37" onclick="this.src = \'https://i.imgur.com/BZ3WF.png\'">',
            "feelsgoodman" : '<img src="https://i.imgur.com/BZ3WF.png" width="40" height="37" onclick="this.src = \'https://i.imgur.com/4lwg0.png\'">',
            "feelsgud" : '<img src="https://i.imgur.com/BZ3WF.png" width="40" height="37" onclick="this.src = \'https://i.imgur.com/4lwg0.png\'">',
            "alien" : '<img src="https://i.imgur.com/Zrgc1.gif" width="40" height="60">',
            "bomb" : '<img src="https://i.imgur.com/1Ri01.png" width="30" height="44">',
            "dreck" : '<img src="https://i.imgur.com/aj3bd.png" width="43" height="32">',
            "skeleton" : '<img src="https://i.imgur.com/bDvOj.gif" width="50" height="38">',
            "pumpkindance" : '<img src="https://i.imgur.com/sXZiA.gif" width="60" height="42">',
            "2spooky" : '<img src="https://i.imgur.com/VN8Gn.gif" width="80" height="20">',
            'gooby' : '<img src="https://i.imgur.com/zxLcdoz.png" width="54" height="54">',
            "dosh" : '<img src="https://i.imgur.com/oL6u9.png" width="50" height="58">',
            "8bitdose" : '<img src="https://i.imgur.com/n4sEL.gif" width="46" height="42">',
            "costanza" : '<img src="https://i.imgur.com/7VYoq.png" width="41" height="58">',
            "mysides" : '<img src="https://i.imgur.com/vETtK.png" width="39" height="58">',
            "pikminu" : '<img src="https://i.imgur.com/VLgKCzM.png" width="43" height="55">',
            "el" : '<img src="https://i.imgur.com/6H5Nu1u.gif" width="27" height="25">',
            "ravi" : '<img src="https://i.imgur.com/Ogg9hCU.gif" width="43" height="31">',
            "umirin" : '<img src="https://i.imgur.com/6J28Z.jpg" width="43" height="52">',
            "bearfight" : '<img src="https://i.imgur.com/JVbAzkh.gif" width="35" height="58">',
            "spurdance" : '<img src="https://i.imgur.com/9PZH4ZI.gif" width="35" height="61">',
            "why" : '<img src="https://i.imgur.com/cV3YW2a.png" width="48" height="48">',
            "chen" : '<img src="https://i.imgur.com/j55EMQt.png" width="50" height="46">',
            'rip' : '<img src="https://i.imgur.com/Xa8Xb64.png" width="50" height="54">',
            "dante" : '<img src="https://i.imgur.com/I0hWD8T.png" width="60" height="54">',
            "rattle" : '<img src="https://i.imgur.com/Bp2hrVk.gif" width="55" height="39">',
            "cat" : '<img src="https://i.imgur.com/YftOX.png" width="60" height="60">',
            "spurdo" : '<img src="https://i.imgur.com/dlNRc8B.png" width="51" height="39">',
            "thedick" : '<img src="https://i.imgur.com/ul0UQ.png" width="50" height="50">',
            "octagon" : '<img src="https://i.imgur.com/d3cA4Ul.png" width="50" height="47">',
            "stop" : '<img src="https://i.imgur.com/d3cA4Ul.png" width="50" height="47">',
            "brobill" : '<img src="https://i.imgur.com/nSZTUPc.gif" width="52" height="40">',
            "miku" : '<img src="https://i.imgur.com/Dekl7gs.gif" width="45" height="41">',
            "miku2" : '<img src="https://i.imgur.com/olNcmUI.gif" width="55" height="46">',
            "o-o" : '<img src="https://i.imgur.com/rH7gBZ2.gif" width="45" height="45">',
            "kitty" : '<img src="https://i.imgur.com/bRUVd.gif" width="50" height="50">',
            "manboss" : '<img src="https://i.imgur.com/Pg9oejU.gif" width="55" height="38">',
            "turkey" : '<img src="https://i.imgur.com/7kcpMQp.png" width="32" height="55">',
            "fresh" : '<img src="https://i.imgur.com/mSDGeAp.gif" width="37" height="50">',
            "morefags" : '<img src="https://i.imgur.com/fTFh4Ps.gif" width="35" height="50">',
            "data" : '<img src="https://i.imgur.com/ItPkGqJ.gif" width="30" height="42">',
            "obama" : '<img src="https://i.imgur.com/vyIEjLT.gif" width="60" height="46">',
            "osama" : '<img src="https://i.imgur.com/zl65QTV.png" width="37" height="54">',
            "ohlawd" : '<img src="https://i.imgur.com/K9s20pI.png" width="50" height="46">',
            "slam" : '<img src="https://i.imgur.com/rh2bEhv.png" width="41" height="52">',
            'rage' : '<img src="https://i.imgur.com/8cnPATY.png" width="45" height="45">',
            "happening" : '<img src="https://i.imgur.com/642PjCs.gif" width="78" height="53">',
            '33' : '<img src="https://i.imgur.com/GAE6zXf.png" width="55" height="40">',
            "mfw" : '<img src="https://i.imgur.com/jTX8drZ.png" width="45" height="51">',
            "jaffa" : '<img src="https://i.imgur.com/lFZkgGf.png" width="40" length="47">',
            "nice" : '<img src="https://i.imgur.com/UsUdb.png" width="45" length="45">',
            "pekaface" : '<img src="https://i.imgur.com/0nDMlfQ.png" width="40" height="40">',
            'haveaseat' : '<img src="https://i.imgur.com/I6D4foT.png" width="40" height="51">',
            "bogs" : '<img src="https://i.imgur.com/0EDmrgA.png" width="40" height="59">',
            "wut" : '<img src="https://i.imgur.com/HgIqmtS.png" width="46" height="50">',
            "kfc" : '<img src="https://i.imgur.com/P5Dpoby.gif" width="60" height="47">',
            "meeku" : '<img src="https://i.imgur.com/YQSESo6.png" width="45" height="60">',
            "jii" : '<img src="https://i.imgur.com/zG59d7Q.png" width="52" height="40">',
            "spherical" : '<img src="https://i.imgur.com/ejyx6KU.png" width="48" height="66">',
            "â–²" : '<img src="https://i.imgur.com/tcNC8l3.gif" width="70" height="47">', /*make sure file is encoded in UTF-8*/
            "nope" : '<img src=https://i.imgur.com/UMkAem5.gif" width="63" height="47">',
            "whatastory" : '<img src="https://i.imgur.com/bysf1J5.png" width="45" height="53">',
            "doot" : '<img src=https://i.imgur.com/WfUlQ5Q.gif" width="50" height="45">',
            "twerk" : '<img src="https://i.imgur.com/zdSVyws.gif" width="53" height="67">',
            "heero" : '<img src="https://i.imgur.com/D7JCR6j.png" width="45" height="42">',
            'facepalm' : '<img src="https://i.imgur.com/fUU5XZu.png" width="50" height="46">',
            'remove': '<img src="https://i.imgur.com/m1jhaWU.gif" width="35" height="53">',
            'wow': '<img src="https://i.imgur.com/Gy1a6Xo.png" width="40" height="50">',
            'praise': '<img src="https://i.imgur.com/hKNkmBa.png" width="48" height="49">',
            'datass': '<img src="https://i.imgur.com/5XBU0Kv.gif" width="32" height="50">',
            'burd2': '<img src="https://i.imgur.com/Hp3ypPj.gif" width="35" height="36">',
            'burd3': '<img src="https://i.imgur.com/jSlcr.gif" width="35" height="36">',
            "swerve" : '<img src="https://i.imgur.com/d0glWaV.png" width="50" height="44">',
            'kek' : '<img src="https://i.imgur.com/JeUM7i7.png" width="40" height="54">',
            'nofun' : '<img src="https://i.imgur.com/m2fw5vq.png" width="50" height="53">',
            'otter': '<img src="https://i.imgur.com/crHMkmU.gif" width="35" height="55">',
            'gigaduane': '<img src="https://i.imgur.com/l3gSBDt.gif" width="70" height="47">',
            'raw': '<img src="https://i.imgur.com/5naYhE8.png" width="48" height="65">',
            'babyguitar': '<img src="https://i.imgur.com/qOCgzsL.gif" width="55" height="55">',
            'science' : '<img src="https://i.imgur.com/v185ji3.gif" width="43" height="43">',
            'yee' : '<img src="https://i.imgur.com/RpznRYJ.gif" width="50" height="50">'
            };

        window.script.$colorcodes = {
            "knuckles": '</span><span style="color:tomato">',
            "mario": '</span><span style="color:red">',
            "starfox": '</span><span style="color:brown">',
            "tomnook": '</span><span style="color:chocolate">',
            "crashbandicoot": '</span><span style="color:orange">',
            "orange": '</span><span style="color:orange">',
            "pacman": '</span><span style="color:yellow">',
            "gex": '</span><span style="color:yellowgreen">',
            "link": '</span><span style="color:green">',
            "halo2": '</span><span style="color:darkgreen">',
            "chao": '</span><span style="color:aqua">',
            "squirtle": '</span><span style="color:cyan">',
            "liara": '</span><span style="color:steelblue">',
            "bluebomber": '</span><span style="color:royalblue">',
            "sonic": '</span><span style="color:blue">',
            "krystal": '</span><span style="color:darkblue">',
            "bigthecat": '</span><span style="color:indigo">',
            "nights": '</span><span style="color:purple">',
            "spyro": '</span><span style="color:blueviolet">',
            "birdo": '</span><span style="color:deeppink">',
            "kirby": '</span><span style="color:violet">',
            "wakeupmrfreeman": '</span><span style="color:tan">',
            "tomba": '</span><span style="color:pink">',
            "metalgear": '</span><span style="color:silver">',
            "kidicarus": '</span><span style="color: white">',
            "gamenwatch": '</span><span style="color: black">',
            "outline": '<span style="text-shadow: 1px 0 #00ccff, -1px 0px #00ccff, 0 1px #00ccff, 0 -1px #00ccff">',
            "redoutline" : '<span style="text-shadow: 1px 0 #f00, -1px 0px #f00, 0 1px #f00, 0 -1px #f00">'
            //"rainbowroad" : '</span><span class="rainbow">'
        };
        window.script.$fontcodes = {
            "spoiler": '<font style="text-shadow: 0 0 black; background-color: #000; cursor: default" onmouseover="this.style.backgroundColor=\'transparent\'" onmouseout="this.style.backgroundColor=\'black\'">',
            "i": '<font style="font-style:italic">',
            "u": '<font style="text-decoration: underline">',
            "b": '<strong>',
            "s": '<strike>',
            "endbold": '</strong>',
            "endstrike": '</strike>',
            "endspan": '</span></font></font></font>'
        };
        $.extend(script.$newcodes, script.$externalEmotes);
        $.extend(script.$colorcodes, script.$fontcodes);
        $.extend($codes, script.$newcodes);
        $.extend($codes, script.$colorcodes);
        
        sdbg.log("script.fns.buildEmotes finished");
    },
    
    useEmote: function(code) {
        var msg = $('#cin').val();
        
        //if (useColons)
            msg = msg + ":" + code + ":";
        //else
        //  msg = "/" + code;
            
        $('#cin').val(msg);
    },
    
    buildEmoteMenu: function() {
        var emoteMenu,code;
        emoteMenu = code = '';

        var endtags = {
            s: ['<strike', '</strike>', 'Strikethrough'],
            b: ['<strong', '</strong>', 'Bold'],
            u: ['<font style="text-decoration: underline"', '</font>', 'Underline'],
            i: ['<font style="font-style:italic"', '</font>', 'Italics'],
            endstrike: ['<strike', '</strike>', 'End Strikethrough'],
            endbold: ['<strong', '</strong>', 'End Bold'],
            endspan: ['<strong style="text-decoration: underline; font-style: italic"', '</strong>', 'End font effects'],
            spoiler: ['<font style="text-shadow: 0 0 black; background-color: #000; cursor: default" onmouseover="this.style.backgroundColor=\'transparent\'" onmouseout="this.style.backgroundColor=\'black\'"', '</font>', 'Spoiler']
        }

        $.each($codes, function(code, image) {
            if (code != 'fast' && code != 'spin' && script.$colorcodes[code] == undefined) {
                emoteMenu = emoteMenu + '<span title="' + code + '" onclick="script.fns.useEmote(\'' + code + '\')">' + image + '</span>';
            }
        });
        emoteMenu += "<br />";
        $.each(script.$colorcodes, function(code, bgcolor) {
            if (code !== 'rainbowroad' && script.$fontcodes[code] == undefined) {
                if (code == 'outline') {
                    bgcolor = 'color: black;box-shadow: 0 0 15px #00ccff inset';
                } else if (code == 'redoutline') {
                    bgcolor = 'color: black;box-shadow: 0 0 15px #f00 inset';
                } else {
                    bgcolor = bgcolor.slice(20, -2);
                }
                emoteMenu = emoteMenu + '<span class="colors" title="' + code + '" style="background-' + bgcolor + '" onclick="script.fns.useEmote(\'' + code + '\')"></span>';
            }
        });
        emoteMenu += "<br />";
        $.each(script.$fontcodes, function(code, node) {

            var endc = '<font';
            var endtag = '</font>';
            var txt = '';

            if (code in endtags) {
                endc = endtags[code][0];
                endtag = endtags[code][1];
                txt = endtags[code][2];
            }
            
            emoteMenu = emoteMenu + '<span class="font-codes" title="' + code + '" onclick="script.fns.useEmote(\'' + code + '\')">' + endc + ' class="' + code + '">' + txt + endtag + '</span>';
        });

        $('#emotes').remove();
        $('#emote_list').append('<div id="emotes">' + emoteMenu + '</div>');
        //$('#emotes').css('display', 'none');
    },

    toggleAutoClean: function(setting) {
        var ac,
            message;
        if (setting == true)
            ac = true;
        else if (setting == false)
            ac = false;
        else {
            ac = script.fns.get("autoClean");
            ac = !ac;
        }
        
        message = ac ? "Autoclean is now on. The next video must be position 1 to autoclean." : "Autoclean is now off.";
        
        room.addMessage({username:''}, message, 'hashtext');
        script.fns.set("autoClean", ac);
        $('#toggle_autoclean_box').prop('checked', ac);
    },
    
    checkEmote: function(message, hexOnly) {
        var doCheck = script.fns.get("useEmotes");
        if (doCheck) {
            var a,b,c,d,e,f,g;
            a = b = c = d = e = 0;
            while (a < message.length && a >= 0 && e < 4) {
                var checked = false;
                d++;
                a = message.indexOf(':', a);
                b = message.indexOf(':', a + 1);
                f = message.slice(a, b + 1);
                g = f.slice(1,-1).toLowerCase();
                if ($codes.hasOwnProperty(g) || g[0] === '#') {

                    if (g[0] === '#') {
                        if (script.fns.testHexColor(g)) {
                            var colorNode = "</span><span style='color: " + g + "'>";
                            message = message.replace(f, colorNode);
                            c = colorNode.length;
                            checked = true;
                            e += 0.5;
                        }
                    }
                    if (!checked && !hexOnly) {
                        if ($codes.hasOwnProperty(g))
                            c = $codes[g].length;
                        else
                            return message;
                        message = message.replace(f, $codes[g]);
                        if (script.$colorcodes.hasOwnProperty(g) || script.$fontcodes.hasOwnProperty(g) || g == "fast" || g == "spin") e += 0.5;
                        else e++;
                    }
                    
                        if (c < g.length) {
                            a = message.indexOf(g);
                        } else {
                            a += c;
                        }
                        
                } else if (!$codes.hasOwnProperty(g)) {
                    a = b;
                } else if (d >= 10) {
                    break; //in case of leak
                }
            }
        }
        return message;
    },
    cleanFast: function() {
        var m = $('#chat_messages.chat-messages .message marquee');
        if (!m.length)
            script.fastmsgs = 0;
        
        if (script.fastmsgs > script.MAXFAST) {
            for (var i = 0; i < m.length, script.fastmsgs > script.MAXFAST; i++) {
                m.eq(i)[0].outerHTML = m.eq(i)[0].innerHTML;
                script.fastmsgs -= 1;
            }
        }
    },
    
    backgroundTimer: function(time, state, image) {
        sdbg.log('backgroundTimer called ('+time+', '+state+', '+image+')');
        if (state == true) {
            if (room.video.video.currentTime() < time) {
                script.bgTimeout = setTimeout(function() {
                    script.fns.backgroundTimer(time, script.bgtimer, image);
                }, 1000);
            } else if ((time < room.video.video.currentTime()) && (room.video.video.currentTime() < (time + 10))) { //allows people to refresh/join late if they do not want the background
                script.bgtimer = false;
                $('.video-image-header').remove();
                $('head').append('<style class="video-image-header">.dim {background-image: url("'+image+'")!important}</style>');
            } else {
                script.bgtimer = false;
                $('.video-image-header').remove();
                return;
            }
        }
    },
    
    handleMessage: function(msg) { //Looked at Zod-'s ModSpy plugin for some ideas
    //https://greasyfork.org/en/scripts/5962/code
        var valid = script.validModActions;
        var log = msg.split(" ");
        var user = '<span class="modName">' + log[0] + '</span>';
        var output = msg;
        log[0] = '';
        
        if (log.length == 5 && log[1]+" "+log[2]+" "+log[4] == "has purged videos.") {
            otheruser = log[3];
            log = "has purged videos.";
        } else {
            log = log.join(" ").trim();
        }
        
        if (valid[log] === true) {
            script.last.modAction = log;
            if (script.fns.get("logToChat")) {
                if (log == "moved a video.") {
                    try {
                        var movedVideo = script.last.movedVideo;
                        var title = movedVideo[0].title;
                        if (title.length > 80)
                            title = title.substring(0,80) + "...";
                        output = user + " moved " + title + " via " + movedVideo[0].addedby + " to " + movedVideo[1];
                    } catch (e) {
                        console.error("nothing in script.last.movedVideo");
                    }
                } else if (log == "has purged videos.") {
                    try {
                        output = user+" has purged "+otheruser+" videos.";
                    } catch (e) {
                        console.error(e.message);
                    }
                } else if (log == "removed a video.") {
                    try {
                        var removedVideo = script.last.removedVideo;
                        var info = {info: removedVideo};
                        output = user + " removed <a href='" + room.playlist.url(info) + "' target='_blank'>a video</a>.";
                    } catch (e) {
                        console.error("nothing in script.last.removedVideo");
                    }
                } else if (log == "has kicked a user.") {
                    script.kickedUser = [true, user];
                    return;
                } else if (log == "has banned a user.") {
                    script.bannedUser = [true, user];
                    return;
                } else if (log == "cleaned the playlist.") {
                    output = user + " cleaned the playlist.";
                } else {
                    output = user + " " + log;
                }
                room.addMessage({username:'%modAction'},output,"chat-modAction");
            }
        }
    },
    
    cleanSpin: function() {
        var m = $('#chat_messages.chat-messages .message .spinnew');
        if (!m.length)
            script.spinmsgs = 0;
        
        if (script.spinmsgs > script.MAXSPIN) {
            for (var i = 0; i < m.length, script.spinmsgs > script.MAXSPIN; i++) {
                m.eq(i)[0].outerHTML = m.eq(i)[0].innerHTML;
                script.spinmsgs -= 1;
            }
        }
    },
    
    viewHistory: function(vids) {
        var icon = '',
            host = '',
            thumb = '',
            title = '',
            id = '',
            provider = '',
            recentHTML = '',
            info,
            duration,
            addedby = '';
        var key = {
            'youtube': {icon: 'http://i.imgur.com/KpOgg0D.png', host: 'http://youtube.com/watch?v='},
            'vimeo': {icon: 'http://i.imgur.com/TOogvwC.png', host: 'http://vimeo.com/'},
            'dailymotion': {icon: 'http://i.imgur.com/n7HR2hF.png', host: 'http://dailymotion.com/video/'},
            'twitch': {icon: 'http://i.imgur.com/0jO0wYz.png', host: 'http://twitch.tv/'},
        }
        $('#recent_list').empty();
        try {
            for (var i = vids.length - 1; i > -1; i--) {
                info = vids[i].info;
                provider = info.provider;
                id = provider === 'twitch' ? info.channel : info.id;
                thumb = info.thumbnail;
                if (provider in key) {
                    icon = key[provider].icon;
                    host = key[provider].host;
                }
                title = vids[i].title;
                if (title.length > 100)
                    title = title.slice(0,100) + '...';
                addedby = vids[i].addedby;
                duration = utils.secondsToTime(vids[i].duration);
                recentHTML += '<li class="search-result" title="' + title + '"><a href="' + host + id + '" target="_blank"><span class="video-thumb"><img class="video-thumbnail" src="' + thumb + '"><img class="video-icon" src="' + icon + '"><span class="video-time">' + duration + '</span></span><span class="video-title">' + title + '</span><span class="video-uploader">added by <b><span id="vidUploader">' + addedby + '</span></b></a></li>';
            }
        } catch (e) {
            recentHTML = "<span>No videos.</span>";
        }
            $('#recent_list').append(recentHTML);
    },
    
    bumpUser: function(user, bumpTo) {
        if (room.user.isMod) {
            var a = false,
                c = [],
                b = '',
                d = '',
                e = bumpTo,
                pl = room.playlist.videos,
                users = room.userlist.users;
                
            e = (e > 0) ? e - 1 : $('#playlist.playlist li.active').index() + 1;
            
            e = parseInt(e);
            
            if (isNaN(e) || e >= pl.length) {
                d = 'Invalid playlist position.';
            } else {
                if (user !== '\\r') {
                    for (var i = 0; i < users.length; i++) {
                        if (users[i].username.toLowerCase().indexOf(user) == 0 && users[i].loggedin) {
                            c.push(users[i].username);
                        }
                    }
                    if (c.length > 1) {
                        d = 'Multiple users found. Be more specific.';
                    } else if (c.length == 0) {
                        d = 'No users found.';
                    } else if (c.length == 1) {
                        b = c[0];
                        for (var l = pl.length - 1; l > -1; l--) {
                            if (pl[l].addedby.toLowerCase() == b.toLowerCase()) {
                                a = true;
                                room.sendcmd('move', {
                                    info: pl[l].info,
                                    position: e
                                });
                                break;
                            }
                        }
                        d = a ? 'Bumped ' + b + '.' : 'No videos found.';
                    }
                } else {
                    f = Math.ceil(Math.random() * playlist.length) - 1;
                    if (f == $('#playlist.playlist li.active').index()) {
                        f++;
                    }
                    if (f > pl.length - 1) {
                        d = 'Playlist too small.';
                    } else {
                        room.sendcmd('move', {
                            info: pl[f].info,
                            position: e
                        });
                        d = 'Random video (' + f + ') bumped.';
                    }
                }
            }
        } else {
            d = 'You cannot use this command.';
        }
        room.addMessage({username:""}, '<span style="color: red; font-style: none; font-weight:bold">$bump: </span>' + d + '</span></div>', 'system');
    },
    
    initializeSettings: function() {
        var get = script.fns.get;
        var set = script.fns.set;
        for (var i in script.settings) {
            sdbg.log("checking settings: " + i);
            var val = get(i);
            // i = key, val = key's value
            switch (i) {
                case "defaultQuality":
                    if (script.qualities.indexOf(val) < 0 || val == null || val == 'null') {
                        sdbg.log("└ initializing " + i);
                        set(i, 'large');
                    }
                    break;
                case room.roomName.toLowerCase() + ".recentVideos":
                    if (typeof($.parseJSON(val)) !== "object" || val == null || val == 'null') {
                        sdbg.log("└ initializing " + i);
                        set(room.roomName.toLowerCase() + ".recentVideos", "[]");
                    }
                    break;
                case "showVidChat":
                    if (typeof val !== "number" || val == null || val == 'null' || val < 0 || val > 1) {
                        sdbg.log("└ initializing " + i);
                        set(i, 1);
                    }
                    break;
                case "validActions":
                    if (typeof($.parseJSON(val)) !== "object" || val == null || val == 'null') {
                        sdbg.log("└ initializing " + i);
                        set(i, JSON.stringify(script.validModActions));
                    }
                    break;
                case "cssSettings":
                    if (typeof($.parseJSON(val)) !== "object" || val == null || val == 'null') {
                        sdbg.log("└ initializing " + i);
                        set("cssSettings", JSON.stringify(script.colorSettings));
                    }
                    break;
                case "lastVersion":
                    if (val !== script.version || val == "null" || val == null) {
                        sdbg.log("└ initializing " + i);
                        set(i, script.version);
                        room.addMessage({username:''}, "<span style='color: #09C073; font-weight: bold'>Script updated to v" + script.version + "!</span>", "system");
                        if (!$('#chat_tab_changelog').hasClass('tab_updated-glow'))
                            $('#chat_tab_changelog').addClass('tab_updated-glow');
                    }
                    break;
                case "currentCSS":
                    if (script.cssLinks[val] === undefined) {
                        sdbg.log("└ initializing " + i);
                        set(i, script.settings[i]);
                    }
                    break;
                case "showSpin":
                    set("showSpin", "false");
                    break;
                default:
                    if (typeof(val) !== typeof($.parseJSON(script.settings[i])) || val == "null") {
                        sdbg.log("└ initializing " + i);
                        set(i, script.settings[i]);
                    }
                    break;
            }
        }
        
        script.validModActions = $.parseJSON(get("validActions"));
        for (var i in script.validModActions) {
            $('#action_list').append('<label><input type="checkbox" value="'+i+'">'+i+'</label>');
            $('#action_list input[value="'+i+'"]').prop('checked', script.validModActions[i]);
        }
        
        if (isNaN(parseInt(get("marqueeSpeed"))))
            set("marqueeSpeed", script.settings["marqueeSpeed"]);
        script.marqueeSpeed = parseInt(get("marqueeSpeed"));
        
        if (get("showFast"))
            $codes['fast'] = '<marquee direction="right" scrollamount="' + get("marqueeSpeed") + '">';
        if (get("showSpin"))
            $codes['spin'] = '<span class="spinnew">';
    },
    
    setCustomLayout: function(layoutName) {
        var css = script.cssLinks;
        if (css[layoutName] === undefined) {
            console.error("script.fns.setCustomLayout: " + layoutName + " not found in script.cssLinks, check the name of the CSS if you are trying to add your own. Reverting to base CSS.");
            $('.customLayout').remove();
            script.fns.set("currentCSS", "none");
            $('#css-none').prop('checked', true);
            return;
        }
        if (css !== "none") {
            if ($('.customLayout').href !== css[layoutName][2]) {
                $('.customLayout').remove();
                $('head').append('<link href="' + css[layoutName][2] + '" type="text/css" rel="stylesheet" class="customLayout">');
            }
        } else {
            $('.customLayout').remove();
        }
        if (script.fns.get("currentCSS") !== layoutName) {
            script.fns.set("currentCSS", layoutName);
            $('#css-' + layoutName).prop('checked', true);
        }
    },
    
    addLog: function(title, addedby) {
        var cl = $('#chat_messages .chat-message');
        if (typeof(title) !== "undefined")
            if (title.length > 80)
                title = title.slice(0, 80) + '...';
        try {
            if (cl.length) {
                if ((!(/\: (Welcome to)/).test(cl[cl.length-1].textContent) && !(/\: (Connected)/).test(cl[cl.length-1].textContent)) && messages > 0) {
                    room.addMessage({username:'%addVideo'}, addedby + ' added ' + title, 'gm vid');
                }
            }
        } catch (e) {
            console.error(e.message);
        }
    },
    
    addTempEmote: function(name, url, w, h) {
        var newEmote = {};
        if (w == null || w == 'null')
            w = '';
        if (h == null || h == 'null')
            h = '';
        url = url.replace(/['"]/g, '');
        w = w.replace(/['"]/g, '');
        h = h.replace(/['"]/g, '');
        var node = '<img src="' + url + '" width="' + w + '" height="' + h + '">';
        newEmote[name] = node;
        $.extend($codes, newEmote);
    },
    
    initJSColor: function(a) {
        $('.script-css-colors').remove();
        
        $('head').append( //i like to make ids/classes complex to decrease chances of conflicts
            '<style id="h-pickerButtons" class="script-css-colors"></style>'+
            '<style id="h-pickerHandles" class="script-css-colors"></style>'+
            '<style id="h-pickerHandlesGlow" class="script-css-colors"></style>'+
            '<style id="h-pickerButtonsHoverGlow" class="script-css-colors"></style>'+
            '<style id="h-pickerProgress" class="script-css-colors"></style>'+
            '<style id="h-pickerVolume" class="script-css-colors"></style>'+
            '<style id="h-pickerText" class="script-css-colors"></style>'+
            '<style id="h-pickerControlBar" class="script-css-colors"></style>'
        );
        
        var css = $.parseJSON(script.fns.get("cssSettings"));
        for (var i in css) {
            if (i in script.colorSettings) {
                document.getElementById(i).value = css[i];
                script.fns.updateColor(i, css[i]);
            }
        }
        
        if (a) {
            var pickerOptions = {pickerPosition:'right', pickerMode:'HVS'};
            window.buttonPicker = new jscolor.color(document.getElementById('pickerButtons'), pickerOptions);
            window.buttonGlowPicker = new jscolor.color(document.getElementById('pickerButtonsHoverGlow'), pickerOptions);
            window.handlesPicker = new jscolor.color(document.getElementById('pickerHandles'), pickerOptions);
            window.handleGlowPicker = new jscolor.color(document.getElementById('pickerHandlesGlow'), pickerOptions);
            window.progressPicker = new jscolor.color(document.getElementById('pickerProgress'), pickerOptions);
            window.volumePicker = new jscolor.color(document.getElementById('pickerVolume'), pickerOptions);
            window.textPicker = new jscolor.color(document.getElementById('pickerText'), pickerOptions);
            window.controlbarPicker = new jscolor.color(document.getElementById('pickerControlBar'), pickerOptions);
        }
    },
    
    setChecks: function() {
        $('#marqueeinput').val(script.fns.get("marqueeSpeed"));
        $('#vidchat-setting input[data-state="'+script.fns.get('showVidChat')+'"]').prop('checked', true);
        $('#toggle_vidchatemotes_box').prop('checked', script.fns.get("showVidEmotes"));
        $('#toggle_showlogs_box').prop('checked', script.fns.get("showLogs"));
        $('#toggle_fast_box').prop('checked', script.fns.get("showFast"));
        $('#toggle_spin_box').prop('checked', script.fns.get("showSpin"));
        $('#toggle_showroll_box').prop('checked', script.fns.get("showRoll"));
        $('#toggle_showadd_box').prop('checked', script.fns.get("showAdd"));
        $('#toggle_autoclean_box').prop('checked', script.fns.get("autoClean"));
        $('#toggle_useemotes_box').prop('checked', script.fns.get("useEmotes"));
        $('#toggle_navbar_box').prop('checked', script.fns.get("fixedNavbar"));
        $('#toggle_logtochat_box').prop('checked', script.fns.get("logToChat"));
        $('#toggle_usetimestamps_box').prop('checked', script.fns.get("useTimestamps"));
        $('#css-' + script.fns.get("currentCSS")).prop('checked', true);
        script.fns.get("showLogs") ? $('.logWrapper').show() : $('.logWrapper').hide();
        $('#qualityList input[data-q="'+script.fns.get('defaultQuality')+'"]').prop('checked', true);
        
        script.fns.get("fixedNavbar") ? $('.navbar-fixed-top, .navbar-fixed-bottom').css('position', 'fixed') : $('.navbar-fixed-top, .navbar-fixed-bottom').css('position', 'static');
        
        script.fns.setCustomLayout(script.fns.get("currentCSS"));
    },
    
    addScrollingMessage: function(message, state, extraClass) {
        if (state === 1 && $('#media').height() > 0) {
            if (message !== null && typeof message === "string" && message.length > 0) {
                if (message.length > 240)
                    message = message.substring(0,240);
                message = script.fns.checkEmote(message, !script.fns.get('showVidEmotes'));
                setTimeout(function() {
                    while ($('.videoText').length >= script.MAXSCROLL) {
                        if (script.MAXSCROLL < 1)
                            script.MAXSCROLL = 20;
                        else
                            $('.videoText').eq(0).remove();
                    }
                    $('.videochatContainer').append('<div class="videoText new '+extraClass+'" style="visibility:hidden">'+message+'</div>');
                
                    var el = $('.videoText.new');
                    
                    var fontSize = Math.random() * (48.0 - 24.0) + 24.0;
                    var heightLevels = Math.floor($('#media').height() / fontSize);
                    el.css('font-size', fontSize+'px');
                    var level = fontSize * Math.floor(Math.random() * (heightLevels));
                    var w = el.width();
                    el.css('right', (0 - w)+'px');
                    el.css('visibility', 'visible');
                    el.css('top', level+'px');
                    var time = '4.5s';

                    move('.videoText.new')
                      .ease('linear')
                      .add('right', ($('#media').width() + w))
                      .duration(time)
                      .then(function() {
                        el.remove();
                      })
                      .end();
                      
                    el.removeClass('new');
                },200);
            }
        } else {
          return;
        }
    },
    
    findNextQuality: function(quality){
        if (script.qualities.indexOf(quality) < 0 || $('.vjs-quality-button ul li').length < 2)
            return 'auto';
            
        var avail = [];
        var list = $('.vjs-quality-button ul li');
        var brk = 50;
        var x;
        for (var i = 0; i < list.length; i++) {
            avail.push(list.eq(i).attr('data-val'));
        }
        if (avail.indexOf(quality) > -1)
            x = quality;
        else {
            while (avail.indexOf(quality) < 0) {
                brk++;
                x = script.qualities[script.qualities.indexOf(quality) + 1];
                if (brk >= 50) {
                    x = list.eq(0).attr('data-val');
                    break;
                }
            }
        }
        return x;
    },
    
    changeQuality: function(quality) { //modified instasync src
        quality = script.fns.findNextQuality(quality);
        if ($('.vjs-quality-button ul li').length < 2)
            quality = 'auto';
        function setInnerText(element, text) {
            if (typeof element === 'undefined') { return false; }
            
            var textProperty = ('innerText' in element) ? 'innerText' : 'textContent';
            
            try {
            element[textProperty] = text;
            } catch (anException) {
            //IE<9 FIX
            element.setAttribute('innerText', text);
            }
        }
        if (script.qualities.indexOf(quality) > -1 && room.video.video.id() === 'youtube') {
            var self = room.video.video.tech;
            var el = $('.vjs-quality-button ul li[data-val="'+quality+'"]')[0];
            self.ytplayer.setPlaybackQuality(quality);
            
            self.userQuality = quality;

            setInnerText(self.qualityTitle, script.fns.parseQualityName(quality) );
            
            var selected = self.qualityMenuContent.querySelector('.vjs-selected');
            if (selected) videojs.Youtube.removeClass(selected, 'vjs-selected');
        
            videojs.Youtube.addClass(el, 'vjs-selected');
            console.oldLog('successfully passed '+quality+' to changeQuality');
        } else {
            var error = 'Error changing quality: ';
            if (script.qualities.indexOf(quality) < 0)
                error += 'quality \''+quality+'\' is not valid. ';
            if (room.video.video.id() !== 'youtube')
                error += 'source is not youtube.';
            console.error(error);
        }
    },
    
    setDefaultQuality: function(quality) {
        var q = quality.toLowerCase();
        if (script.qualities.indexOf(q) > -1) {
            script.fns.set('defaultQuality', q);
            script.fns.changeQuality(q);
            $('#qualityList input[data-q="'+q+'"]').prop('checked', true);
        } else {
            console.error('Default quality not set: '+q+' is not a valid value.');
        }
    },
    
    parseQualityName: function(name) { //from videojs.Youtube.parseQualityName
    
        switch (name) {
            case 'auto':
                return 'auto';
            
            case 'tiny':
                return '144p';

            case 'small':
                return '240p';

            case 'medium':
                return '360p';

            case 'large':
                return '480p';

            case 'hd720':
                return '720p';

            case 'hd1080':
                return '1080p';
                
            case 'hd1440':
                return '1440p';

            case 'hd2160':
                return '2160p (4k)';
        }
        
        return name;
    },
    
    load: function() {
        if (!window.script.loaded) {
            if (!window.script.preloaded) {
                for (var i = 0; i < script.pretasks.length; i++) {
                    sdbg.log("Pre-connect Task "+i+" executing...");
                    script.pretasks[i]();
                    sdbg.log("╚ Pre-connect Task "+i+" executed!");
                }
                window.script.preloaded = true;
            }
            window.script.loaded = true;
            room.roomName.toLowerCase() == "v4c" ? script.fns.setFavIcon('http://i.imgur.com/DmMh2O9.png') : script.fns.setFavIcon('/favicon.ico');
            for (var i = 0; i < script.tasks.length; i++) {
                sdbg.log("Task "+i+" executing...");
                script.tasks[i]();
                sdbg.log("╚ Task "+i+" executed!");
            }
            console.oldLog("Script loaded.");
            var hello = '<span style="font-weight:bold; color:#045AA4">Loaded ' + script.version + '.';
            if (script.debug)
                hello += ' <span style="font-weight:bold; color:#7304A4">Debug to console ON.</span>';
            hello += '</span>';
            room.addMessage({username:""}, hello, 'system');
            setTimeout(function() {
                window.script.delayedTasks.push(script.fns.buildEmoteMenu);
                for (var i = 0; i < script.delayedTasks.length; i++) {
                    sdbg.log("Delayed task "+i+" executing...");
                    script.delayedTasks[i]();
                    sdbg.log("╚ Delayed task "+i+" executed!");
                }
            }, 700);
            sdbg.log("script.fns.load finished");
        }
    }

};

window.script.setCSS = function() {
    $('.scriptBaseCSS').remove();
    $('head').append('<link class="scriptBaseCSS" href="https://googledrive.com/host/0B2hdmKDeA0HDZ2IwRFRzaTV2dEU" rel="stylesheet" type="text/css">');
    sdbg.log("Base CSS added to page header");
};

window.script.setHTML = function() {
    if (!script.htmlIsSet) {
        script.htmlIsSet = true;
        script.fns.get("showLogs") ? $('.nav.navbar-nav.navbar-right').append('<div class="logWrapper"><div id="logs"></div></div>') : $('.nav.navbar-nav.navbar-right').append('<div class="logWrapper" style="display:none"><div id="logs"></div></div>');
        
        if (script.fns.get("fixedNavbar") == false)
            $('.navbar-fixed-top, .navbar-fixed-bottom').css('position', 'static');
        var addvideobtn = $('#add_video_btn').detach();
        $('.add-video').replaceWith($('#add_video_url').detach());
        $(addvideobtn).insertAfter($('#add_video_url'));
        $('#media').parent().css('overflow', 'hidden');
        $('.row.room-component-row').prepend('<div id="media-title"><div id="vidTitle" class="title"><div class="via"></div></div></div>');
        $('.nav.navbar-nav.navbar-right').append('<div class="newUpdate" style="display:none"><a href="https://greasyfork.org/en/scripts/6366" target="_blank">New script update! Click here!</a></div>');
        $('.nav.navbar-nav.navbar-right').prepend('<div id="gmtClock"></div>');
        $('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_emotes"><div class="pl-tab_header">Emote List<button class="btn btn-xs btn-default" style="float: right" onclick="script.fns.buildEmoteMenu();">Reload List</button></div><div id="emote_list"></div></div>');
        $('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_recent"><div class="pl-tab_header">Recent Videos - ' + room.roomName + '</div><div id="recent_list"></div></div>');
        $('.video-controls .tab-content').append('<div class="tab-pane" id="tabs_playlist_cssmenu"><div id="layout_list"><div class="pl-tab_header">Custom Layouts</div></div></div>');
        $('<li><a class="active_tooltip" title="Emote Menu" data-original-title="Emote Menu" href="#tabs_playlist_emotes" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa" style="width: 12px;height: 14px;"><img src="https://i.imgur.com/vETtK.png" class="fa-ainsley"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
        $('<li><a id="recentTab" title="Recent Videos" class="active_tooltip" data-original-title="Recent Videos" href="#tabs_playlist_recent" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa fa-clock"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
        $('<li><a id="cssMenuTab" title="Layout Options" class="active_tooltip" data-original-title="Custom Layouts" href="#tabs_playlist_cssmenu" data-toggle="tab" rel="tooltip" data-placement="bottom"><i class="fa fa-paint-brush"></i></a></li>').insertBefore('.video-controls .nav-tabs .skip-controls');
        $('#create_poll_modal .modal-footer').prepend('<button onclick="$(\'#create_poll_modal .modal-body .input-group input\').val(\'\');" id="clear_poll_options" type="button" class="btn btn-red btn-sm">Clear</button>');
        $('<div class="videochatContainer"></div><div class="curtain"><div id="curtainTop"></div><div id="curtainFloor"></div></div>').insertBefore('#media');
        $('.video-controls .nav-tabs').append('<li class="curtainbutton"><i id="toggle_curtain" onclick="script.fns.adjustCurtain();return false;" class="fa fa-curtain active_tooltip" style="display: inline;"></i></li>');
        $('.nav.nav-tabs.chat-tabs').append('<li><a id="chat_tab_changelog" class="active_tooltip" data-original-title="Changelog" href="#tabs_chat_changelog_content" data-toggle="tab" rel="tooltip" data-placement="top"><i class="fa fa-newspaper-o"></i></a></li>');
        $('.tab-content.chat-tabs-content').append('<div class="tab-pane" id="tabs_chat_changelog_content"><div class="chat-tab_header">Changelog: v' + script.version + '</div><ul id="changelog_list"></ul></div>');
        $('#tabs_playlist_settings .mod-control').append('<br /><div class="checkbox"><label class="active_tooltip"><input id="toggle_autoclean_box" type="checkbox" value="Autoclean">Autoclean</label></div>');
        $('#tabs_chat_settings_content').append('<span class="areaLabel">Scrolling Messages on Video</span><div id="vidchat-setting"><div class="radio"><label class="active_tooltip"><input type="radio" name="vcoption" data-state="0">Disabled</label></div><div class="radio"><label class="active_tooltip"><input type="radio" name="vcoption" data-state="1">Enabled</label></div><div class="checkbox"><label class="active_tooltip"><input id="toggle_vidchatemotes_box" type="checkbox">Display Emotes</label></div></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showlogs_box" type="checkbox" value="ShowLogs">Show Join and Leave Logs</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_useemotes_box" type="checkbox" value="UseEmotes">Show Emotes in Chat</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_usetimestamps_box" type="checkbox" value="UseTimestamps">Display Chat Timestamps</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_fast_box" type="checkbox" value="Fast">Use :fast: Emote</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_spin_box" type="checkbox" value="Spin" disabled="disabled">Use :spin: Emote</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showadd_box" type="checkbox" value="AddMsgs">Show Video Add Messages in Chat</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_showroll_box" type="checkbox" value="ShowRoll">Show $roll/$8ball Results in Chat</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_navbar_box" type="checkbox" value="FixedNavbar">Fixed Navbar</label></div>');
        $('#tabs_chat_settings_content').append('<div class="checkbox"><label class="active_tooltip"><input id="toggle_logtochat_box" type="checkbox" value="LogToChat">Show Moderator Actions in Chat</label><span style="display: block;padding-left: 20px;color:orange">Display these actions:</span><div id="action_list"></div></div>');
        $('#tabs_chat_settings_content').append('<div class="fastspeedbox"><label class="active_tooltip"><input id="marqueeinput" style="color:black" size="3" type="text" max="999" maxlength="3" onkeyup="script.fns.setFast($(this).val());return false;"> :fast: Scroll Speed <span style="color: #c00">(max 999)</span></label></div>');
        $('<button id="resetsettings_btn" class="btn btn-xs btn-red" style="margin-left:5px">Reset Script Preferences</button>').insertAfter($('#clearchat_btn'));
        $('<div id="create-poll" style="display: none"><input class="form-control" id="title" placeholder="Title"><div id="options_list"><input class="form-control create-poll-option" placeholder="Option"><input class="form-control create-poll-option" placeholder="Option"><input class="form-control create-poll-option" placeholder="Option"></div><button id="submit-poll" class="btn btn-xs btn-primary">Create</button><button id="add-option" class="btn btn-xs btn-default">Add Option</button><button id="clear-fields" class="btn btn-xs btn-red">Clear All Fields</button><button id="close-poll" class="btn btn-xs btn-default">Close</button></div><div style="clear: both;"></div>').insertBefore('#poll_column');
        $('<button id="export_playlist" class="btn btn-xs btn-default" style="margin-left: 4px">Export Playlist (pop-up)</button>').insertAfter($('#disable_player'));
        /*$('#tabs_playlist_settings').append('<div class="recentmaxbox"><label class="active_tooltip"><input id="recentsinput" size="3" type="text" max="999" maxlength="3" onkeyup="script.fns.set("maxRecents", $(this).val());return false;"> Maximum Recent Videos <span style="color: #c00">(max 999)</span></label></div>');
        $('#recentsinput').val(script.fns.get("maxRecents"));*/
        $('<div id="qualitySettings"><span class="areaLabel">Default Video Quality (experimental; not for YT player)</span><div id="qualityList"></div></div>').insertBefore('#tabs_playlist_settings .mod-control');

        for (var i = 0; i < script.qualities.length; i++) {
            var q = script.qualities;
            var str = script.fns.parseQualityName(q[i]);
            var html = '<div class="radio"><label><input type="radio" name="defaultQuality" data-q="'+q[i]+'">'+str+'</label></div>';
            $('#qualityList').append(html);
        }
        
        for (var i in script.cssLinks) {
            var html = '<div class="radio"><label class="active_tooltip"><input data-css-name="' + i + '" id="css-' + i + '" type="radio" name="customcss" onclick="script.fns.setCustomLayout($(this).attr(\'data-css-name\'));">' + script.cssLinks[i][0] + '<span class="author">' + script.cssLinks[i][1] + '</span></label></div>';
            $('#layout_list').append(html);
        }
        
        
        
        
        $('#tabs_playlist_cssmenu #layout_list').append('<div class="pl-tab_header">Colors<button id="resetcolor_btn" class="btn btn-xs btn-red" style="float: right">Reset Color Settings</button></div></div>');
        
        $('#tabs_playlist_cssmenu #layout_list').append(
            '<div class="css-picker">Player Button Color #<input id="pickerButtons" size="6" value="CCCCCC" onchange="script.fns.updateColor(\'pickerButtons\', $(this).val())"></div>'+
            '<div class="css-picker"> └ Hover Glow Color #<input id="pickerButtonsHoverGlow" size="6" value="FFFFFF" onchange="script.fns.updateColor(\'pickerButtonsHoverGlow\', $(this).val())"></div>'+
            '<div class="css-picker">Slider Handle Color #<input id="pickerHandles" size="6" value="CCCCCC" onchange="script.fns.updateColor(\'pickerHandles\', $(this).val())"></div>'+
            '<div class="css-picker"> └ Glow Color #<input id="pickerHandlesGlow" size="6" value="FFFFFF" onchange="script.fns.updateColor(\'pickerHandlesGlow\', $(this).val())"></div>'+
            '<div class="css-picker">Progress Bar Color #<input id="pickerProgress" size="6" value="66A8CC" onchange="script.fns.updateColor(\'pickerProgress\', $(this).val())"></div>'+
            '<div class="css-picker">Volume Bar Color #<input id="pickerVolume" size="6" value="66A8CC" onchange="script.fns.updateColor(\'pickerVolume\', $(this).val())"></div>'+
            '<div class="css-picker">Player Text Color #<input id="pickerText" size="6" value="CCCCCC" onchange="script.fns.updateColor(\'pickerText\', $(this).val())"></div>'+
            '<div class="css-picker">Player Control Bar Color #<input id="pickerControlBar" size="6" value="07141E" onchange="script.fns.updateColor(\'pickerControlBar\', $(this).val())"></div>'+
            '<div class="css-picker"> └ Opacity <input id="pickerControlBarOpacity" size="3" value="70" type="number" style="color: black" min="0" max="100" maxlength="3" onchange="script.fns.updateColor(\'pickerControlBar\', $(\'#pickerControlBar\').val())">% (buggy, may have to change on refresh/reset)</div>'
        );
        
        script.fns.initJSColor(true);
        
        $('#changelog_list').append(script.changelog);
        
    }
};

window.script.pretasks = [script.overwriteFunctions, script.setCSS]; //run before main tasks
window.script.tasks = [script.setHTML, script.setListeners, script.fns.utcClock]; //main tasks
window.script.delayedTasks = [script.fns.initializeSettings, script.fns.setChecks, script.fns.buildEmotes]; //delayed by 700ms after main tasks

$(function() {
    if (!window.script.loaded) script.fns.load();
});
// ==UserScript==
// @run-at document-end
// @name         EM Autohider
// @namespace    http://tampermonkey.net/
// @version      1.6.4
// @description  Automatically hide content that you don't want to see.
// @author       nearbeer
// @match        https://epicmafia.com/lobby
// @match        https://epicmafia.com/game*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29886/EM%20Autohider.user.js
// @updateURL https://update.greasyfork.org/scripts/29886/EM%20Autohider.meta.js
// ==/UserScript==

var enableBrightTextHider = true;
var L_THRESHOLD = 4.5; //how bright can user text be? A lower nubmer makes more text darker (in between 0 and 1).
var enableYoutubeHider = false;
var enableLobbyWall = true;
var enableChatbox = true;

var hiddenPhrases = [ "WOKEN", "(J|j)a(m|')al", "(P|p)lissken" ];
var hiddenUsers = ["JamalMarley", "Plissken", "iminthetoilet", "Furry", "zoella", "hannah393939", "Hela", "Albashiea", "ivana" ]; //hide only
//var neggedUsers = []; //neg AND hide
//add or remove users here. Just follow the list format.

var intervalID; //the ID of the 2 second interval

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

var modify = function (o) {
    for(var i = o.data.length - 1; i >= 0; i--) {
        if(!o.data[i]) continue;
        if(hiddenUsers.indexOf(o.data[i].user_username) > -1) {
            console.log(o.data[i]);
            o.data.remove(i);
            continue;
        }
        for(var j = 0; j < hiddenPhrases.length; j++) {
            if(o.data[i] && RegExp(hiddenPhrases[j]).test(o.data[i].msg)) {
                console.log(o.data[i]);
                o.data.remove(i);
                continue;
            }
        }
    }
    return o;
};

if(enableLobbyWall) {
    unsafeWindow.loadpage = function (original) {
        return function () {
            var oldArgs = arguments;
            console.log("Hiding comments from users...");
            unsafeWindow.fetch_template('comment.html', 'comment', function(tmpl) {
                if (oldArgs[1].indexOf("/comment/find/") == 0) {
                    oldArgs[4] = function (o) {
                        o = modify(o);
                        return tmpl(o);
                    };
                }
                original.apply(this, oldArgs);
            });
        };
    }(unsafeWindow.loadpage);
}

(function() {
    'use strict';
    hideUsers(); //iterate once
    intervalID = window.setInterval(hideUsers,2000); //iterate every 2 seconds
})();

function hideUsers(){
    try{
        var comments = document.querySelectorAll("div.comment");
        for(var i = 0; i < comments.length; i++){
            var commentinfo = comments[i].querySelector("div.commentinfo");
            var msg = comments[i].querySelector("div.msg");
            var msgInner = msg.querySelector("span.msg-inner");
            var username = commentinfo.querySelector("a.tt").innerHTML;
            username = username.replace(/\s/g, ''); //truncate spaces
            if(enableYoutubeHider){ //replace youtube comments
                var youtube = msgInner.querySelector("iframe");
                if(youtube){
                    var youtubeURL = youtube.getAttribute("src");
                    youtubeURL = youtubeURL.replace("embed/", "watch?v=");
                    var youtubeLink = document.createElement("a");
                    youtubeLink.setAttribute("target", "_blank");
                    youtubeLink.setAttribute("href", youtubeURL);
                    youtubeLink.setAttribute("class", "t21");
                    youtubeLink.innerHTML = youtubeURL;
                    msgInner.removeChild(msgInner.childNodes[0]); //remove original embed
                    msgInner.appendChild(youtubeLink); //add new link
                }
            }
            /*if(enableLobbyWall){
                if(hiddenUsers.indexOf(username) == -1 && neggedUsers.indexOf(username) == -1){ //if user is not hidden or negged, skip them.
                    continue;
                }
                if(neggedUsers.indexOf(username) > -1){
                    var down = commentinfo.querySelector("a.down");
                    var down_sel = commentinfo.querySelector("a.down.sel");
                    if(down_sel){
                        //alert(username+" post already downvoted");
                    }
                    else if(down){
                        down.click(); //neg the message
                        //alert(username+" post not downvoted");
                    }
                    else{
                        throw "Invalid state? Neither null downvote nor selected downvote detected.";
                    }
                }
                if(msg){
                    //msg.setAttribute("class","msg negged");
                    comments[i].outerHTML = "";
                    delete comments[i];
                } //hide the message
            }
        }*/
            /*if(enableChatbox){
                var talks = document.querySelectorAll("div.talk"); //chatbox hiding
                for(i = 0; i < talks.length; i++){
                    var talkUsername = talks[i].querySelector("b").innerHTML;
                    talkUsername = talkUsername.replace(/\s/g, '').replace(/:/g, '');
                    //alert(talkUsername);
                    if(hiddenUsers.indexOf(talkUsername) > -1){
                        talks[i].outerHTML = "";
                        delete talks[i];
                    }
                    /*if(neggedUsers.indexOf(talkUsername) > -1){
                        talks[i].outerHTML = "";
                        delete talks[i];
                    }
                }
            }*/
            if(enableBrightTextHider){
                document.querySelectorAll(".msg").forEach(function(p) {
                    if(p.style.color){
                        var colorString = p.style.color,
                            colorsOnly = colorString.substring(colorString.indexOf('(') + 1, colorString.lastIndexOf(')')).split(/,\s*/),
                            r = colorsOnly[0],
                            g = colorsOnly[1],
                            b = colorsOnly[2],
                            a = colorsOnly[3],
                            lightness = (Math.max(Math.max(r, g), b)+Math.min(Math.min(r, g), b))/512;
                        if(lightness > L_THRESHOLD){
                            var ratio = L_THRESHOLD / lightness;
                            var temp = r;
                            r *= ratio;
                            g *= ratio;
                            b *= ratio;
                            p.style.color = "rgb("+Math.floor(r)+", "+Math.floor(g)+", "+Math.floor(b)+")";
                        }
                    }
                });
            }
        }

    }
    catch(e){
        alert(e);
        clearInterval(intervalID);
    }
}
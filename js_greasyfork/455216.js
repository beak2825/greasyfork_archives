// ==UserScript==
// @name         Reddit Stern Dropifier
// @namespace    https://greasyfork.org/en/users/986214-romymopen
// @version      0.2.1
// @description  For use on the Howard Stern subreddit (reddit.com/r/howardstern/). Converts some of the better known Stern drops to playable audio
// @author       Romymopen https://www.reddit.com/user/Romymopen/
// @match        https://*.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      Public Domain
// @downloadURL https://update.greasyfork.org/scripts/455216/Reddit%20Stern%20Dropifier.user.js
// @updateURL https://update.greasyfork.org/scripts/455216/Reddit%20Stern%20Dropifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

let observer = new MutationObserver(mutationRecords => {
    for(var i=0;i<mutationRecords.length;i++) {
        if(mutationRecords[i].addedNodes.length>0) {
            for(var j=0;j<mutationRecords[i].addedNodes.length;j++) {
                if('hasAttribute' in mutationRecords[i].addedNodes[j]) {
                    if(mutationRecords[i].addedNodes[j].getAttribute('class').indexOf('comment')>-1) { //new comment added, so we need to convert that text
                        var c = mutationRecords[i].addedNodes[j].getElementsByClassName("md"); // every reddit post/comment is wrapped in an element with this classname
                        c[0].innerHTML = replace_drops(c[0].innerHTML);
                    }
                }
            }
        }

    }
});

    // observe everything except attributes
observer.observe(document.body, {
  childList: true, // observe direct children
  subtree: true, // and lower descendants too
  characterDataOldValue: true // pass old data to callback
});

    //function to replace the drop keyword with a HTML audio object
    function html_audio(src, name) {

        if(src instanceof Array) {
            console.log(typeof(document.getElementById(name+'_'+rnd+'_player')));
            var rnd = Math.floor(Math.random()*src.length);
            return (!document.getElementById(name+'_'+rnd+'_player') ? '<audio id="'+name+'_'+rnd+'_player" src="' + src[rnd] + '" preload="none"></audio>' : '') + '<a style="background-color:#eee;border:1px solid #000;border-radius:5px;padding:2px;cursor:crosshair;" onclick="document.getElementById(\''+name.replace(/'/g, "\\'")+'_'+rnd+'_player\').play();" onmouseout="document.getElementById(\''+name.replace(/'/g, "\\'")+'_'+rnd+'_player\').pause();document.getElementById(\''+name.replace(/'/g, "\\'")+'_'+rnd+'_player\').currentTime=0;">'+name+'</a>';
        } else {
            return (!document.getElementById(name+'_player') ? '<audio id="'+name+'_player" src="'+src+'" preload="none"></audio>' : '') + '<a style="background-color:#eee;border:1px solid #000;border-radius:5px;padding:2px;cursor:crosshair;" onclick="document.getElementById(\''+name.replace(/'/g, "\\'")+'_player\').play();" onmouseout="document.getElementById(\''+name.replace(/'/g, "\\'")+'_player\').pause();document.getElementById(\''+name.replace(/'/g, "\\'")+'_player\').currentTime=0;">'+name+'</a>';
        }
    }

    // drops below
    // format:
    // [ 'DROP KEYWORD', 'http://AUDIO.FILE/LOCATION' ]
    // multiple keywords can be converted to a single sound file
    // a single keyword can be mapped to multiple sound files that are chosen at randon
    var replaced = [
        ['jackie laugh', ['https://www.sndup.net/hhsv/d', 'https://www.sndup.net/yr9b/d', 'https://www.sndup.net/bv3n/d', 'https://www.sndup.net/d2sk/d']],
        ['gilbert laugh', ['https://www.sndup.net/rp6y/d', 'https://www.sndup.net/zsts/d']],
        ['its over johnny', 'https://www.sndup.net/t68t/d'],
        ['0.0', 'https://www.sndup.net/xs7d/d'],
        [['riiight', 'rigghhht', 'rigggght', 'righhhht'], 'https://www.sndup.net/q6qk/d'],
        ['hello hello', 'https://www.sndup.net/smd5/d'],
        ['ack ack', 'https://www.sndup.net/nkjh/d'],
        [['i\'m club fucking footed', 'im club fucking footed'], 'https://www.sndup.net/zppt/d'],
        ['im gonna fuck you like a wild lanimal, it is', 'https://www.sndup.net/wt8j/d'],
        [['ticky tow mein', 'dicky dow mein'], 'https://www.sndup.net/zd38/d'],
        ['shoo shoo retarded flu', 'https://www.sndup.net/r4vy/d'],
        ['oh my', 'https://www.sndup.net/kntn/d'],
        ['hey now', 'https://www.sndup.net/krfw/d'],
        ['ya little bitch', 'https://www.sndup.net/tng7/d'],
        [['vagina pussy', 'vagina poosy'], 'https://www.sndup.net/2356/d'],
        [['dropping loads', 'droppin loads'], 'https://www.sndup.net/vjfv/d'],
        ['titties', 'https://www.sndup.net/djrh/d'],
        ['can i put my finger in your ass', 'https://www.sndup.net/bt4s/d'],
        [['arrivederci', 'arrivederci cock sucker'], 'https://www.sndup.net/knjv/d'],
        ['fuck you fuck you fuck you', 'https://www.sndup.net/xct3/d'],
        [['may day may day', 'may day'], 'https://www.sndup.net/snc7/d'],
        ['who dis', 'https://www.sndup.net/hnj3/d'],
        [['tonton soup', 'wonton soup'], 'https://www.sndup.net/htp3/d'],
    ];

    function replace_drops(inStr) {
        for(var i = 0;i<replaced.length;i++) {
            var vandal_stop=0; // keep track of drops in single post
            var datest = null;
            if(replaced[i][0] instanceof Array) { // if multiple keywords, we need to loop through them all
                for(var t = 0;t<replaced[i][0].length;t++) {
                    datest = inStr;
                    while(inStr.toLowerCase().indexOf(':'+replaced[i][0][t]+':')>-1) {
                        datest = datest.replace(':' + replaced[i][0][t] + ':', html_audio(replaced[i][1], replaced[i][0][t]));
                        vandal_stop++;
                        if(vandal_stop>=vandal_stop_max) break;
                    }
                    inStr = datest
                }
            } else { // single keyword
                while(inStr.toLowerCase().indexOf(':'+replaced[i][0]+':')>-1) {
                    datest = inStr.replace(':' + replaced[i][0] + ':', html_audio(replaced[i][1],replaced[i][0]));
                    inStr = datest
                    vandal_stop++;
                    if(vandal_stop>=vandal_stop_max) break;
                }
            }
        }
        return inStr;
    }

    var contents = document.getElementsByClassName("md"); // every reddit post/comment is wrapped in an element with this classname
    var vandal_stop_max = 10; // this is the max number of Drops to be converted in any given post/comment. Should stall attempts to flood the script with too many drops being converted by this script

    // loop through all the posts and comments
    for(var x = 0;x<contents.length;x++) {
        // loop through all the keywords
        contents[x].innerHTML = replace_drops(contents[x].innerHTML);
    }

})();
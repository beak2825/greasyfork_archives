// ==UserScript==
// @name         Remove Facebook Comment Annoyance
// @namespace    http://tampermonkey.net/
// @version      1.30
// @description  Remove comment with specific keyword
// @author       PA
// @homepage     https://github.com/jamesbond448/facebook_moderation_comment
// @match        https://www.facebook.com/plugins/*
// @icon         https://www.facebook.com/images/fb_icon_325x325.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487197/Remove%20Facebook%20Comment%20Annoyance.user.js
// @updateURL https://update.greasyfork.org/scripts/487197/Remove%20Facebook%20Comment%20Annoyance.meta.js
// ==/UserScript==


//IMPORTANT need to remove blacklisted https://www.facebook.com/plugins/* in tempermonkey advanced security

(function() {
    'use strict';

    //List of keyword to trigger scam comment
    const listofkeyword = ["Sauce-", "Sauce :", "Sauce ::", "Sauce::", "Sauce(1)","I get paid over", "Start now making every", "R­­­­i­­­­c­­h­­­­n­­­­o­­­­w", "𝐇𝐨𝐰 𝐓𝐨 𝐌𝐚𝐤𝐞 𝐄𝐱𝐭𝐫𝐚 𝐈𝐧𝐜𝐨𝐦𝐞", "Masterpiece alert", "this banger", "Latest banger", "banger Alert", "elite banger", "banger out", "New Banger", "celokit", "New manhwa", "Anybody can earn", "I g­e­t p­a­i­d o­v­e­r", "https://www.nunipu", "𝐍𝐄𝐄𝐃 𝐏𝐄𝐎𝐏𝐋𝐄 𝐅𝐎𝐑 𝐏𝐀𝐑𝐓 𝐓𝐈𝐌𝐄", "https://www.digitalbookhaven.com", "https://odysee.com", "Getmoney3", "full sexy video", "job online from home", "M­y­ l­a­s­t­ p­a­y­ c­h­e­c­k­", "OnlyFans Leaks", "Try this one you", "mangatube", "sexy hot", "Link hentai", "Enjoy reading this", "New Chapter Release NOW", "make some bucks", "You may enjoy reading", "Get Free Money", "New manga", "G­­o­o­gle­ is paying", "soultech", "I get over", "𝐎𝐧𝐥𝐢𝐧𝐞 𝗪𝗢𝗥𝗞", "online work", "mangack", "mangace", "making over", "𝐖𝐨𝐫𝐤𝐉𝐨𝐢𝐧", "like and subscribe", "hot hentai", "following manga", "18+ manga", "manga 18+", "cutly.me", "hot and sexy", "sexy video", "full video", "sex live", "World's Hottest", "be interested in", "premium series", "Manga1k", "onemanga", "adkps", "Try this masterpiece", "tinyurl", "earning every", "WebCash", "heylink", "Google paid", "𝐖𝐨𝐫𝐤𝐬𝐀𝐩𝐩", "earn money", "freecash", "take a look at", "findjobhere", "Click Here", "per hour for", "Google pays", "latest salary", "Looking for great chapters", "you can read", "extrarich" , "by working", "earn more", "For Trending manga", "check this one", "shorturl", "Hentai Girl", "valuable feedback", "discord.gg", "earnut", "𝐬𝐞𝐱 𝐯𝐢𝐝𝐞𝐨", "offmantiner", "Please subscribe", "getting paid", "livebetter", "➤➤➤", "Latest manhwa", "LATEST-->", "mangakik", "Earn BTC", "bringing in cash", "richway", "Masterpice alert", "online Job" , "visit our website", "akumareader", "𝐖𝐚𝐭𝐜𝐡 𝐦𝐲 𝐯𝐢𝐝𝐞𝐨", "da.gd", "manganik", "prowagewise", "i­n­c­o­m­e e­v­e­r­y m­o­n­t­h", "­h­o­u­r­s a d­a­y", "livecompany", "telegram.me", "mangaweb", "tarotscans", "hentai:", "ln.run", "bitly.ws", "mgkik", "worker.cash", "register from here", "dollars daily", "𝗡𝗲𝘄 𝗕𝗮𝗻𝗴𝗲𝗿", "absolute banger", "Start earning", "work online", "online home", "exclusive-job", "S­­m­­a­­r­t­w­­o­­r­­k­­", "makeeasy", "manhwalist", "mangacool", "topmanwha", "get-dollar", "money online", "𝐄𝐱𝐭𝐫𝐚 𝐜𝐚𝐬𝐡", "extra cash", "get-free", "making $", "makes $", "makes $", "𝐎𝐧𝐥𝐢𝐧𝐞 𝐉𝐨𝐛𝐬", "pages.dev", "Latest masterpiece", "redmanga", "earlym.org", "Today Super Hot", "zip.lu", "Click on the link", "rb.gy", "THE BEST MANNHWA", "odinscans", "paid over", "­­W­­o­­r­­k­­s­­P­­r­­o­­f­­i­­t­­1­", "This site desperately need", "this site look", "This site's layout", "this site's design", "mangahindi", "bitecoin", "mangagojo", "dollarweb", "Hentaibuddy", "rl2060", "mangahub", "manhuarm", "rich-now", "cpmrevenuegate", "Uncensored Hentai", "factmanga", "theregressedmercenarys", "manhwacommunity"];
    //todo if performance ever problem just make all keyword already lowercase and disable check in if condition

    //Not make the search of previous comment
    var lastindexComment = 0;
    var lastindexReply = 0;

    function removescam(){
        setTimeout(function() {
            var element = document.getElementsByClassName("_3-8y clearfix");//First comment in the reply of comment
            for (let i = lastindexReply; i < element.length; i++) {
                if(element[i].className == '_3-8y clearfix') {
                    for (let j = 0; j < listofkeyword.length; j++) {
                        if(element[i].innerHTML.toLowerCase().includes(listofkeyword[j].toLowerCase())){
                            element[i].remove();
                            i--;//remove action will decrease the list
                            break;//stop loop
                        }
                    }
                    lastindexReply = i;
                }
            }
            element = document.getElementsByClassName("_3-8y _5nz1 clearfix");//First comment div which does not include reply
            for (let i = lastindexComment; i < element.length; i++) {
                for (let j = 0; j < listofkeyword.length; j++) {
                    if(element[i].innerHTML.toLowerCase().includes(listofkeyword[j].toLowerCase())){
                        element[i].remove();
                        i--;//remove action will decrease the list
                        break;//stop loop
                    }
                }
                lastindexComment = i;
            }
            var button = document.getElementsByClassName("_1gl3 _4jy0 _4jy3 _517h _51sy _42ft");//This is the button load more commment
            button[0].addEventListener("click", removescam);
        }, 2000);//Timer for load comment 2 second seem best
    }

   window.setTimeout(function(){
        removescam();
    }, 1000);



})();


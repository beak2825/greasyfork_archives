// ==UserScript==
// @name         Hide U2 Blacklist User
// @namespace    https://xsky123.com
// @version      3.3
// @description  Hide blacklist users' words
// @author       XSky123
// @supportURL   https://greasyfork.org/zh-CN/scripts/376316
// @license      WTFPL
// @match        https://u2.dmhy.org
// @match        https://u2.dmhy.org/*
// @match        http://u2.dmhy.org
// @match        http://u2.dmhy.org/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376316/Hide%20U2%20Blacklist%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/376316/Hide%20U2%20Blacklist%20User.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // GLOBAL SETTINGS
    // 1. Disable async in ajax
    $.ajaxSetup({
        async : false
    });

    // 2. Set empty blacklist
    var blacklist = [];
    var URL_ = window.location.href;

    function get_date() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        return `${year}-${month < 10 ? "0"+month : month}-${day < 10 ? "0"+day : day} ${hour < 10 ? "0"+hour : hour}:${minute < 10 ? "0"+minute : minute}:${second < 10 ? "0"+second : second}`;
    }


    // Step 1: Fetch blacklist from localStorage
    function init_blacklist(){
        if(!localStorage.getItem('u2_blacklist')){ // not storaged
            get_blacklist();
        }else{
            // check refresh
            if(localStorage.getItem('u2_blacklist_update_at')){
                var now = get_date();
                var last_update_at = new Date(localStorage.getItem('u2_blacklist_update_at'));
                if(now - last_update_at > 24 * 3600 * 1000){ // if over 1 day fetch new
                    get_blacklist();
                }else{                                       // else use local data
                    blacklist = JSON.parse(localStorage.getItem('u2_blacklist'));
                }
            }else{
                get_blacklist();
            }
        }
        if(URL_.search("friends") !== -1){ // if visit friends page, update.
            get_blacklist();
        }
    }


    function get_blacklist(){
        blacklist = fetch_blacklist();
        localStorage.setItem('u2_blacklist', JSON.stringify(blacklist));
        localStorage.setItem('u2_blacklist_update_at', get_date());
        console.log("[Hide U2 Black] Blacklist has been refreshed");
    }


    function fetch_blacklist(){
        var black_list = [];
        var friend_page = "";
        var all_blocked = [];
        var finish_flag = 0;
        $.get("https://u2.dmhy.org/friends.php", function(data, status){
            // alert("Data: " + data + "\nStatus: " + status);
            if(status === "success"){
                friend_page = data;
                all_blocked = friend_page.match(/type=block.*?ltr'>(.*?)<\/bdo/g);
                all_blocked.forEach(function(each){
                    black_list.push(each.match(/targetid=(.*?)"/)[1]);
                });
                finish_flag = 1;
            }else{
                throw new Error("[Hide U2 Black] Unable to access friends page.");
            }
        });
        return black_list;

    }




    // Step 2.1: Hide MotherFxxker's words in shoutbox
    function hide_shoutbox_dirty_words(){
        var shoutbox = document.getElementsByTagName('iframe')[0];
        if(shoutbox.contentWindow.document.getElementsByTagName("head")[0].innerHTML === "")
            ;
        else{
            var shoutrow = shoutbox.contentWindow.document.getElementsByClassName("shoutrow");
            var shoutrows = shoutrow[0].getElementsByTagName("div");
            var uid;
            var i;
            var count = 0;
            for(i=0;i<shoutrows.length;i++)
            {
                var each = shoutrows[i];

                uid = each.innerHTML.match(/sbat\((.*?)\)/);
                if(!uid)
                    continue;

                if(blacklist.indexOf(uid[1]) !== -1){ // find blocked user
                    each.innerHTML = each.innerHTML.substring(0,50) +
                        '[<s>引</s>][@]*****|'+
                        '<b>黑名单用户</b>'+
                        ' <span style="word-break: break-all; word-wrap: break-word;"><bdo dir="ltr">'+
                        '<i>已屏蔽</i>'+
                        '</bdo></span>';
                    count++;
                }
            }
            if (count){
                console.log("[Hide U2 Black] Blocked " + count + (count > 1 ? " messages" : " message")
                            + " in shoutbox.");
            }
        }
    }

    // Step 2.2 Hide MotherFxxker's words in forum
    function hide_forum_dirty_posts(){
        var uid;
        var i;
        var each;
        var count = 0;
        var method = "forum";
        var content_blocked = '<table class="main-inner" border="1" cellspacing="0" cellpadding="5">' +
            '<tbody><tr><td class="rowfollow" width="150" valign="top" align="left" style="padding: 0px">' +
            '<img src="//u2.dmhy.org/pic/default_avatar.png" alt="avatar" width="150px"></td>' +
            '<td class="rowfollow" valign="top"><div style="background-color:#AEAEAE ; border:1px solid #949494; width:95%; padding:8px">' +
            '<strong>[已屏蔽]</strong>' +
            '<br><br>' +
            '本层内容为您黑名单中用户发布，已由' +
            '<a href="https://greasyfork.org/zh-CN/scripts/376316-hide-u2-blacklist-user">' +
            '<b> Hide U2 Blacklist User 脚本 </b>' +
            '</a>屏蔽。您也可以';

        var all_rows = document.querySelectorAll('table[id^=pid]');
        if(all_rows.length === 0){
            all_rows = document.querySelectorAll('table[id^=cid]'); // if no pid try cid (torrent comment)
            method = "torrent";
        }

        if (method === "forum"){
            for(i=0;i<all_rows.length;i++) {
                each = all_rows[i];

                uid = each.querySelector("a[class$=_Name]").href.match(/id=(\d+)/)[1];
                if(blacklist.indexOf(uid) !== -1) { // find blocked user
                    // hide username(user group)
                    var row_data_elem = each.querySelector("td");
                    var re = /.*href=\"(.*)\">#(\d+).*id=(\d+).*?ltr\">(.*?)<\/bdo.*time>(.*)<\/time.*/g;
                    var result = re.exec(row_data_elem.innerHTML);
                    var username_td_html = `<a href="${result[1]}">#${result[2]}</a>&nbsp;&nbsp;<span class="nowrap"><a href="userdetails.php?id=${result[3]}" class="User_Name"><b><bdo dir="ltr">${result[4]}</bdo></b></a> <i>(已屏蔽用户)</i>&nbsp;&nbsp;<time>${result[5]}</time>`;
                    row_data_elem.innerHTML = username_td_html;
                    // do replace
                    var origin_text = each.parentElement.nextElementSibling.querySelector(".post-body bdo").innerText;
                    each.parentElement.nextElementSibling.innerHTML = `${content_blocked}<u title="${origin_text}">偷看一眼|´-\`)ﾁﾗｯ</u></div></td></tr></tbody></table>`;
                    count++;
                }
            }
        }else if (method === "torrent"){
            for(i=0;i<all_rows.length;i++) {
                each = all_rows[i];

                uid = each.querySelector("a[class$=_Name]").href.match(/id=(\d+)/)[1];
                if(blacklist.indexOf(uid) !== -1) { // find blocked user
                    // hide username(user group)
                    var span_ = each.querySelector('span');
                    span_.innerHTML = "<strong>黑名单用户</strong>";
                    span_.style.color = "";
                    span_.nextSibling.remove()

                    // replace avatar and content
                    each.parentElement.nextElementSibling.innerHTML = content_blocked;
                    count++;
                }
            }
        }
        if(count){
            console.log("[Hide U2 Black] Blocked " + count + (count > 1 ? " posts." : " post."));
        }
    }

    window.addEventListener("load", init, false);
    init_blacklist();

    if(URL_.search("forums") !== -1 || URL_.search("/details.php")) {
        hide_forum_dirty_posts();
    }

    function init(){
        document.getElementsByTagName('iframe')[0].onload = function () {
            hide_shoutbox_dirty_words()
        };
        hide_shoutbox_dirty_words();
    }
})();
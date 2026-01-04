// ==UserScript==
// @name         autodouban3
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  try to take over the world!
// @author       You
// @match        https://music.douban.com/subject/**
// @match        https://book.douban.com/subject/**
// @match        https://www.douban.com/group/**
// @match        https://www.douban.com/people/**
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/401092/autodouban3.user.js
// @updateURL https://update.greasyfork.org/scripts/401092/autodouban3.meta.js
// ==/UserScript==
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


(function () {
    'use strict';

    var blacklists;
    blacklists = GM_getValue("blacklists");


    var blockedtarget;
    blockedtarget = GM_getValue("blockedtarget");

    var blackdone_lists;
    blackdone_lists = GM_getValue("blackdone_lists");


    var idiv = document.createElement("div");
    idiv.id = "_myDiv";

    var idivStyle = idiv.style;
    idivStyle.position = "fixed";
    idivStyle.display = "flex";
    idivStyle.width = "5%";
    idivStyle.height = "5%";
    idivStyle.left = "50%";
    idivStyle.top = "20%";
    idivStyle.fontSize = "15px"
    idiv.textContent = "!";
    idiv.style.backgroundColor = "blue";
    var startTask;
    startTask = GM_getValue("startTask");

    if (startTask) {
        idiv.style.backgroundColor = "red";

    } else {
        idiv.style.backgroundColor = "blue";

    }


    idiv.onclick = function (e) {

        if (startTask) {
            startTask = "";
            idiv.style.backgroundColor = "blue";

        } else {
            startTask = "1";
            idiv.style.backgroundColor = "red";

        }
        GM_setValue("startTask", startTask);
        location.reload();

    };


    document.body.appendChild(idiv);

    if (!startTask) {

        return;
    }



    if (! window.location.href.match("https://www.douban.com/people")) {

        // find all user who mark 3,4,5 star
        var badUsers = document.evaluate('//div[@class="article"]//dl[@class="obu"]/dt/a//@href | //div[@id="content"][h1[contains(text(), "小组成员管理")]]//div[@class="article"]//div[@class="member-list"]//@href | //div[@class="sub_ins"]//td[p/span[@class="allstar30" or @class="allstar40" or @class="allstar50"]]/div//@href | //div[@class="comments-wrapper"]//div[@class="comment"]//span[@class="comment-info"][span[contains(@class, "allstar30") or contains(@class, "allstar40") or contains(@class, "allstar50")]]//@href', document, null, XPathResult.ANY_TYPE, null);
        var badUsers_links = [];
        var l = badUsers.iterateNext();
        while (l) {
            badUsers_links.push(l.value);
            l = badUsers.iterateNext();
        }

        // update all blacklists
        var badUsers_links_str = "";
        badUsers_links_str = badUsers_links_str.concat(badUsers_links);
        if (blacklists) {

            blacklists += "," + badUsers_links_str;

        } else {
            blacklists = badUsers_links_str;
        }

        // console.log("init blacklists:\n" + blacklists);

        // array to set
        let blacklists_arr = blacklists.split(",");
        let blacklists_set = new Set(blacklists_arr);
        blacklists_arr = Array.from(blacklists_set);
        blacklists = "";
        blacklists = blacklists.concat(blacklists_arr);
        // console.log("clan blacklists:\n" + blacklists);

        GM_setValue("blacklists", blacklists);

        // find next page
        var nextPage = document.evaluate('//div[@class="article"]//div[@class="paginator"]//span[@class="next"][a[@href]]//@href | //div[@class="paginator"]//span[@class="next"][//a[@href]]//@href | //div[@class="paginator-wrapper"]//a[contains(text(), "后一页")]//@href | //div[@class="paginator"]//span[@class="next"]//@href', document, null, XPathResult.ANY_TYPE, null);

        var nextPageUrl = nextPage.iterateNext();
        if (nextPageUrl) {
            //console.log("go to next page");
            window.location.href = nextPageUrl.value;
        } else {
            console.log("get final page, start block user");
            var blacklists_;

            blacklists_ = GM_getValue("blacklists");
            // console.log("blacklists_:\n" + blacklists_);


        }

    }

    if (window.location.href.match("https://www.douban.com/people")) {



        let isFriend = document.evaluate('//div[@class="user-group"]//span[@class="user-cs"][contains(text(),"已关注")]', document, null, XPathResult.ANY_TYPE, null);

        let isFriend_tag = isFriend.iterateNext();

        var blacklists_vec = blacklists.split(",");
        // console.log("blacklists length :" + blacklists_vec.length);
        // console.log("window.location.href:\n" + window.location.href);
        // console.log("blacklists:\n" + blacklists);
        sleep(10);

        if ( blockedtarget == window.location.href || blacklists) {
            // console.log("111try block :\n" + window.location.href);
            // console.log("222try block :\n" + blacklists);
            if (!isFriend_tag && (blockedtarget == window.location.href || blacklists.match(window.location.href))) {
                // console.log("333try block :\n" + window.location.href);


                if (typeof PEOPLE_NAME !== "undefined") {
                    var msg = PEOPLE_NAME + '将不能：\n- 关注你（已关注的会自动取消）\n- 给你发豆邮\n- 在你的日记、相册、广播、推荐、留言板留言\n\n确定把' + PEOPLE_NAME + '加入黑名单？';
                    console.log(msg);
                    $.postJSON_withck(
                        '/j/contact/addtoblacklist',
                        { 'people': PEOPLE_ID },
                        function (r) {
                            if (r.result) {
                                //location.reload();

                            } else {
                                //alert(r.msg);
                            }
                        }
                    );



                    // update a blocked list
                    if(blackdone_lists){
                        blackdone_lists+="," + window.location.href;
                    }else{
                        blackdone_lists=  window.location.href;


                    }
                    GM_setValue("blackdone_lists", blackdone_lists);
                } else {
                    // console.log("fuck");




                }

            }

            // go to new page
            let blacklists_vec_sample = blacklists_vec.pop();
            if (blacklists_vec_sample) {



                if(blackdone_lists){
                    while(blackdone_lists.match(blacklists_vec_sample)){
                        blacklists_vec_sample = blacklists_vec.pop();
                        if(!blacklists_vec_sample){
                            console.log("work done");
                            return;

                        }
                    }
                }



                console.log("go to new page: " + blacklists_vec_sample);
                console.log("blacklists_vec.length: " + blacklists_vec.length);

                let blacklists_vec_str = "";

                blacklists_vec_str = blacklists_vec_str.concat(blacklists_vec);
                GM_setValue("blacklists", blacklists_vec_str);
               

                GM_setValue("blockedtarget", blacklists_vec_sample);
                window.location.href = blacklists_vec_sample;

            } else {
                console.log("work done");


            }




        } else {
            // console.log("fuck2");

        }
    }







})();
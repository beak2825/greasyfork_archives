// ==UserScript==
// @name         Baha JiCha tool
// @namespace    GiCha
// @version      0.4.1
// @description  Let me hlep you JiCha!!
// @author       opmm0809
// @match        https://forum.gamer.com.tw/C.php?*
// @match        https://forum.gamer.com.tw/Co.php?*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429579/Baha%20JiCha%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/429579/Baha%20JiCha%20tool.meta.js
// ==/UserScript==

(function(jQuery) {
    'use strict';

    // Your code here...
    function hentai_log(text) {
        console.log("hentai tools: " + text);
    }

    var posts = document.getElementsByClassName("c-post__header__author");
    var pars = window.location.href.split("?")[1].split("&");
    var bsn = "";
    var snA = "";

    // parse parameter "bsn" & "snA" from URL
    pars.forEach(element => {
        let tmp = element.split("=");
        if (tmp[0] == "bsn") {
            bsn = tmp[1];
        } else if (tmp[0] == "snA"){
            snA = tmp[1];
        }
    })
    if (snA == "") {
        let DOM = jQuery("button[title='看整串主題']");

        if (DOM.length != 0) {
            let str = DOM.attr("onclick");
            snA = str.substring(str.indexOf("snA=") + 4, str.indexOf("&sn="));
        }

    }

    for (var i = 0; i < posts.length; i++) {
        //hentai_log("floor" + String(i + 1) + " start");
        let floor_author_id = posts[i].getElementsByClassName("userid")[0].text;
        let insert_element = document.createElement('a');
        insert_element.href = `https://forum.gamer.com.tw/Bo.php?bsn=${bsn}&qt=6&q=${floor_author_id}`;
        insert_element.text = "稽查";
        insert_element.target = "_blank";
        insert_element.rel = "noreferrer noopener";
        insert_element.style.color = "#ed0854";
        posts[i].appendChild(insert_element);

        //hentai_log("author_id: " + floor_author_id);
        //hentai_log("floor" + String(i + 1) + " end");
    }

    var reply_author_id = "";
    jQuery(document).ready(function(){
        jQuery(document).on('mouseover', '.tippy-reply-menu', function() {
            let user_url = jQuery(this).parent().find('.user--sm')[0].href;
            let parse = user_url.split("/");
            reply_author_id = parse[parse.length - 1];
            //console.log(reply_author_id);
        });


        jQuery('body').on('DOMNodeInserted', '.tippy-popper', function(e) {
            let choose_list = e.target.getElementsByTagName("ul")[0];
            let menu = jQuery(choose_list).closest(".tippy-tooltip--regular");    // to identify what kind of menu
            if (choose_list != undefined && choose_list.className == "" && menu.attr("data-template-id") == "#replyMenu") {
                //console.log(tmp.attr("data-template-id"))
                //console.log(reply_author_id);
                //console.log(choose_list);



                // "稽查" 選項
                let DOM = `<li id = 'hentai_c'><a href = "https://forum.gamer.com.tw/Bo.php?bsn=${bsn}&qt=6&q=${reply_author_id}" style='color: rgb(237, 8, 84);' target="_blank" rel="noreferrer noopener">稽查</a></li>`
                jQuery(choose_list).find("#hentai_c").remove()
                jQuery(choose_list).append(DOM);

                // "看他的文" 選項
                DOM = `<li id = 'hentai_w'><a href = "https://forum.gamer.com.tw/C.php?bsn=${bsn}&snA=${snA}&s_author=${reply_author_id}" style='color: rgb(237, 8, 84);' target="_blank" rel="noreferrer noopener">看他的文</a></li>`
                jQuery(choose_list).find("#hentai_w").remove()
                jQuery(choose_list).append(DOM);
            }
        });
    });
})(jQuery);
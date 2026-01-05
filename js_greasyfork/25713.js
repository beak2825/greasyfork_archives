// ==UserScript==
// @name         CS.RIN.RU Enhanced
// @namespace    Royalgamer06
// @version      0.2.2
// @description  Enhance your experience at CS.RIN.RU - Steam Underground Community.
// @author       Royalgamer06
// @match        *://cs.rin.ru/forum/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        GM_addStyle
// @run-at       document-idle
// @homepageURL  http://cs.rin.ru/forum/viewtopic.php?f=14&t=75717
// @supportURL   http://cs.rin.ru/forum/viewtopic.php?f=14&t=75717
// @downloadURL https://update.greasyfork.org/scripts/25713/CSRINRU%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/25713/CSRINRU%20Enhanced.meta.js
// ==/UserScript==

// TURN ON/OFF FEATURES HERE
const infinite_scrolling = true;
const mentioning = true;
const dynamic_who_is_online = true;
const dynamic_time = true;
const display_ajax_loader = true;
const custom_tags = true;

// DO NOT TOUCH BELOW
GM_addStyle(`#pageheader {
    position: sticky !important;
    top: -33px;
    background: linear-gradient(90deg, black 26%, transparent 28%);
}`);
if (display_ajax_loader) {
    $("body").prepend("<img id='ajaxload' src='http://i.imgur.com/uyDmWvn.gif' style='opacity: 0.5; position: fixed; width: 250px; height: 25px; z-index: 2147483647; right: 20px; top: 3%; left: 50%; margin-left: -125px; display: none;'></div>");
    $.ajaxSetup({
        async: true,
        beforeSend: function() {
            if ($("#ajaxload")) $("#ajaxload").show("fast");
        },
        complete: function() {
            if ($("#ajaxload")) $("#ajaxload").hide("fast");
        }
    });
}

// INFINITE SCROLLING
if ($("[title='Click to jump to page…']").length > 0 && infinite_scrolling) {
    var selector = "#pagecontent > table.tablebg > tbody > tr:has(.row4 > img:not([src*=global], [src*=announce], [src*=sticky]))"; //viewforum.php
    if ($(selector).length === 0) selector = "#wrapcentre > form > table.tablebg > tbody > tr:not(:first, :last)"; //search.php
    if ($(selector).length === 0) selector = "#pagecontent > form > table.tablebg > tbody > tr:not(:first)"; //inbox
    if ($(selector).length === 0) selector = "#pagecontent > .tablebg:not(:first, :last)"; //viewtopic.php
    if (URLContains("viewtopic.php")) {
        $("[title='Subscribe topic']").first().parents().eq(7).after($(".cat:has(.btnlite)").parent().parent().parent());
        $("[title='Reply to topic']").last().parents().eq(4).remove();
    } else if (!URLContains("ucp.php")) {
        $(selector).parent().prepend($(".cat:has(.btnlite)").parent());
    }
    var navElem = $("[title='Click to jump to page…']").first().parent();
    var nextElem = $(navElem).find("strong").next().next();
    if (nextElem.length == 1) { //If there is a next page
        var nextPage = $(nextElem).attr("href");
        var ajaxDone = true;
        $(document).scroll(function() {
            if (window.innerHeight + window.scrollY + 1500 >= document.body.scrollHeight && nextElem.length > 0 && ajaxDone) {
                ajaxDone = false;
                $.get(nextPage, function(data) {
                    $(selector).parent().append($(selector, data));
                    $(navElem).html($("[title='Click to jump to page…']", data).first().parent().html());
                    mentionify();
                    tagify();
                    nextElem = $(navElem).find("strong").next().next();
                    nextPage = $(nextElem).attr("href");
                    ajaxDone = true;
                });
            }
        });
    }
}

// CUSTOM TAGS
tagify();

// MENTIONING
if (URLContains("posting.php" && "do=mention") && mentioning) {
    var p = URLParam("p");
    var u = URLParam("u");
    var a = URLParam("a");
    var postBody = "@[url=http://cs.rin.ru/forum/memberlist.php?mode=viewprofile&u=" + u + "]" + a + "[/url], ";
    var ajaxDone = false;
    $("[name=message]").val(postBody);
    $("[name=postform]").submit(function() {
        if (!ajaxDone) {
            var subject = "I mentioned you";
            var msg = "This PM serves as a notification for mentioning you [url=http://cs.rin.ru/forum/viewtopic.php?p=" + p + "#p" + p + "]here[/url].";
            sendPM(u, subject, msg, function() {
                ajaxDone = true;
                $(".btnmain:nth-child(2)").click();
            });
            return false;
        }
    });
}
mentionify();

// DYNAMIC
var wisCond = $("div~ .tablebg").last().length > 0 && dynamic_who_is_online;
var timeCond =  $(".gensmall+ .gensmall").last().length > 0 && dynamic_time;
if (wisCond || timeCond) {
    setInterval(function() {
        $.get(location.href, function(data) {
            if (timeCond) $("#datebar .gensmall+ .gensmall").html($("#datebar .gensmall+ .gensmall", data).html());
            if (wisCond) $("div~ .tablebg").last().html($("div~ .tablebg", data).last().html());
        });
    }, wisCond ? 10000 : 60000);
}



// FUNCTIONS
function mentionify() {
    if ($(".postbody").length > 0 && URLContains("viewtopic.php") && mentioning) {
        var replyLink = $("[title='Reply to topic']").parent().attr("href");
        $(".gensmall div+ div:not(:has([title='Reply with mentioning']))").each(function() {
            var postElem = $(this).parents().eq(7);
            var postID = $(postElem).find("[title='Send private message']").parent().attr("href").split("p=")[1];
            var author = $(postElem).find(".postauthor").text();
            var authorID = $(postElem).find("[title=Profile]").parent().attr("href").split("u=")[1];
            $(this).append("<a href='" + replyLink + "&do=mention&p=" + postID + "&u=" + authorID + "&a=" + encodeURIComponent(author) + "'><img src='http://i.imgur.com/uTA0dBI.png' alt='Reply with mentioning' title='Reply with mentioning'></a>");
        });
    }
}

function tagify() {
    if (custom_tags) {
        $(".titles, .topictitle").each(function() {
            var titleElem = this;
            var tags = $(titleElem).text().match(/\[([^\]]+)\]/g);
            if (tags) {
                tags.forEach(function(tag) {
                    var color = colorize(tag);
                    titleElem.innerHTML = titleElem.innerHTML.replace(tag, "<span style='color:" + color + ";'>[</span><span style='color:" + color + ";font-size: 0.9em;'>" + tag.replace(/\[|\]/g, "") + "</span><span style='color:" + color + ";'>]</span>");
                });
            }
        });
    }
}

// Can't make this fully work yet
function sendPM(userid, subject, message, callback) {
    if (!callback) callback = function() {};
    $.ajax({
        contentType: "multipart/form-data; boundary=----WebKitFormBoundary",
        url: "http://cs.rin.ru/forum/ucp.php?i=pm&mode=compose&action=post",
        method: "POST",
        data: '------WebKitFormBoundary\nContent-Disposition: form-data; name="username_list"\n\n\n------WebKitFormBoundary\nContent-Disposition: form-data; name="address_list[u][{USERID}]"\n\nto\n------WebKitFormBoundary\nContent-Disposition: form-data; name="subject"\n\n{SUBJECT}\n------WebKitFormBoundary\nContent-Disposition: form-data; name="addbbcode20"\n\n100\n------WebKitFormBoundary\nContent-Disposition: form-data; name="helpbox"\n\nTip: Styles can be applied quickly to selected text.\n------WebKitFormBoundary\nContent-Disposition: form-data; name="message"\n\n{MESSAGE}\n------WebKitFormBoundary\nContent-Disposition: form-data; name="attach_sig"\n\noff\n------WebKitFormBoundary\nContent-Disposition: form-data; name="post"\n\nSubmit\n------WebKitFormBoundary\nContent-Disposition: form-data; name="fileupload"; filename=""\nContent-Type: application/octet-stream\n\n\n------WebKitFormBoundary\nContent-Disposition: form-data; name="filecomment"\n\n\n------WebKitFormBoundary\nContent-Disposition: form-data; name="lastclick"\n\n1481816018\n------WebKitFormBoundary\nContent-Disposition: form-data; name="status_switch"\n\n0\n------WebKitFormBoundary\nContent-Disposition: form-data; name="creation_time"\n\n1481816018\n------WebKitFormBoundary\nContent-Disposition: form-data; name="form_token"\n\n502913d663cf99ad10c2ba7055076dee7f925702\n------WebKitFormBoundary--'.replace("{USERID}", userid).replace("{SUBJECT}", subject).replace("{MESSAGE}", message),
        success: callback,
        beforeSend: function() {
            if ($("#ajaxload") && display_ajax_loader) $("#ajaxload").show("fast");
        },
        complete: function() {
            if ($("#ajaxload") && display_ajax_loader) $("#ajaxload").hide("fast");
        }
    });
}

function colorize(str) {
    str = str.toLowerCase();
    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));
    color = Math.floor(Math.abs((Math.sin(hash) * 10000) % 1 * 16777216)).toString(16);
    return '#' + Array(6 - color.length + 1).join('0') + color;
}

function URLContains(match) {
    return window.location.href.indexOf(match) > -1;
}

function URLParam(name) {
    return (location.search.split(name + '=')[1] || '').split('&')[0];
}

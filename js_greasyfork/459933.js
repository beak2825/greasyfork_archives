// ==UserScript==
// @name         pubg_claim_rewards
// @namespace    http://tampermonkey.net/
// @version      2023.02.09.1
// @description  pubg claim rewards
// @author       jacky
// @match        https://2023springshop.playbattlegrounds.com.cn/index.html?siteinfo=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=playbattlegrounds.com.cn
// @run-at       document-start
// @require      http://libs.baidu.com/jquery/1.10.1/jquery.min.js
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459933/pubg_claim_rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/459933/pubg_claim_rewards.meta.js
// ==/UserScript==

var uid = "";
var token = "";
var siteinfo = "";
var rand = "";

window.addEventListener ("DOMContentLoaded", DOM_ContentReady);
window.addEventListener ("load", pageFullyLoaded);

(function(open) {
    XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
        this.addEventListener("load", function() {
            if (/info/.exec(this.responseURL)){
                parse(this.responseText);
            }
        }, false);
        open.call(this, method, url, async, user, pass);
    };
})(XMLHttpRequest.prototype.open);

function DOM_ContentReady () {
    var url = location.search;
    var m = /siteinfo=([^=&]+)/.exec(url);
    if (m)
        siteinfo = m[1].replace(/%/g,"%25");;
    m = /rand=([^=&]+)/.exec(url);
    if (m)
        rand = m[1].replace(/%/g,"%25");;
    $('.container').before('<div id="a"></div><div id="w"></div>');
    $('#a').append('<p><a href="javascript:void(0);" onclick="getInfo();">tk</a></p>');
    $('#a').append('<div><a href="javascript:void(0);" onclick="toCheck();">签到</a></div>');
    $('#a').append('<table id="b"></table>');
    //$('#b').append('<tr><td><a href="javascript:void(0);" onclick="claim(12);">旗袍</a></td><td id="12"></td></tr>');
    $('#b').append('<tr><td><a href="javascript:void(0);" onclick="claim(13);">斗鱼</a></td><td id="13"></td></tr>');
    //$('#b').append('<tr><td><a href="javascript:void(0);" onclick="claim(14);">口罩</a></td><td id="14"></td></tr>');
}

function pageFullyLoaded () {

}

function parse(response)
{
    var data = JSON.parse(response);
    if (data.code == '00'){
        uid = data.res.uid;
        token = data.res.ticket;
        $('#w').append(`<p>${uid}</p>`);
        $('#w').append(`<p>${token}</p>`);
    }
    else {
        $('#w').append(response);
    }
}

unsafeWindow.getInfo = function(type){
    var t = new Date().valueOf();
    var da = {
        siteinfo: siteinfo,
        rand: rand,
        t: t
    };
    $('#w').empty();
    $.ajax({
        url: '/api/v1/info',
        type: 'POST',
        data: da,
    }).done(function (data) {
    }).fail(function (xhr) {
        $('#w').append(`${xhr.status}: ${xhr.statusText}`);
    });
}

unsafeWindow.toCheck = function(){
    var url = `/api/v1/toCheck/${uid}`;
    var da = {
        token: token
    };
    $('#w').empty();
    $.ajax({
        url: url,
        type: 'POST',
        data: da,
    }).done(function (data) {
        if (data.code)
        {
            $('#w').append(`${data.code}: ${data.res.smsg}`);
        }
        else
        {
            $('#w').append(data.message);
        }
    }).fail(function (xhr) {
        $('#w').append(`${xhr.status}: ${xhr.statusText}`);
    });
}

unsafeWindow.claimAll = function()
{
    claim(13);
    claim(13);
    claim(13);
}

unsafeWindow.claim = function(type){
    var t = type;
    var id = `#${t}`;
    var da = {
        type: t,
        uid: uid,
        token: token
    };
    $(id).empty();
    $.ajax({
        url: '/api/v1/exchange',
        type: 'POST',
        data: da,
    }).done(function (data) {
        if (data.code)
        {
            if (data.code == '00'){
                // {code: "00", res: {type: "13", name: "斗鱼-DBS"}}
                $(id).append(`${data.code}: ${data.res.name}`);
            }
            else {
                // 02 参数错误
                // 06 已领取
                // 09 今日已兑完
                // {code: "06", res: {smsg: "已领取", tmsg: "已领取"}}
                $(id).append(`${data.code}: ${data.res.smsg}`);
            }
        }
        else
        {
            $(id).append(data.message);
        }
    }).fail(function (xhr) {
        $(id).append(`${xhr.status}: ${xhr.statusText}`);
    });
}
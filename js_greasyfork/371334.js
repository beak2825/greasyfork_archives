// ==UserScript==
// @name        bilibili弹幕发送者查询
// @description 查询bilibili弹幕发送者
// @match       *://www.bilibili.com/video/av*
// @match       *://bangumi.bilibili.com/anime/*/play*
// @match       *://www.bilibili.com/bangumi/play/ep*
// @match       *://www.bilibili.com/bangumi/play/ss*
// @match       *://www.bilibili.com/watchlater/
// @version     1.0
// @author      pilipili
// @copyright   pilipili
// @license     GPLv3
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/206036
// @downloadURL https://update.greasyfork.org/scripts/371334/bilibili%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E8%80%85%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/371334/bilibili%E5%BC%B9%E5%B9%95%E5%8F%91%E9%80%81%E8%80%85%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

(function () {
    var initst = window.__INITIAL_STATE__;
    var pnum = -1;
    var cid = 0;
    var type = 0;
    var plist = Array();
    if (initst.hasOwnProperty("aid"))
        plist = initst.videoData.pages;
    else {
        plist = initst.epList;
        type = 1;
    }
    var damcache = Array();
    var loaded = Array();
    var uidcache = Array();
    var lvcache = Array();
    var nowdam = Array();
    var process = Array();
    var checker = 0;
    function getp() {
        //DIFF!!!
        //decode P
        var lascid = cid;
        if (type == 0) {
            var tmpst = window.location.search.length > 0 ? window.location.search.substr(1) : "";
            var tmparr = tmpst.split("&");
            var resa = Array();
            for (var i = 0; i < tmparr.length; i++) {
                var num = tmparr[i].indexOf("=");
                if (num > 0) {
                    var name = tmparr[i].substring(0, num);
                    var value = tmparr[i].substr(num + 1);
                    resa[name] = value;
                }
            }
            pnum = resa.hasOwnProperty("p") ? resa.p : 1;
            cid = plist[pnum - 1].cid;
        }
        else {
            cid=window.__INITIAL_STATE__.epInfo.cid;
        }
        if (lascid != cid)  rebind();
        if (!damcache.hasOwnProperty(cid)) {
            damcache[cid] = Array();
            $.ajax({
                url: "https://comment.bilibili.com/" + cid + ".xml",
                type: "GET",
                dataType: "xml",
                cache: false,
                success: function (xml) {
                    nowdam = Array();
                    var tot = 0;
                    $(xml).find("d").each(function () {
                        var p = $(this).attr("p").split(",");
                        var obj = Array();
                        obj['text'] = $(this).text();
                        obj['time'] = p[0];
                        obj['date'] = p[4];
                        obj['crc'] = p[6];
                        nowdam[tot] = obj;
                        tot++;
                    });
                    damcache[cid] = nowdam;
                }
            });
        }
        else {
            nowdam = damcache[cid];
        }
    }
    function doit(index) {
        console.log(nowdam[index]);
        setTimeout(updatemenu, 30, index);
    }
    function updatelevel(crc, uid) {
        process[crc]--;
        if (lvcache[uid] <= 0)
            uidcache[crc].splice(uidcache[crc].indexOf(uid), 1);
        if (process[crc] == 0)
            render(crc);
    }
    function levelup(crc, d) {
        $.ajax({
            url: 'https://space.bilibili.com/ajax/member/GetInfo',
            type: "POST",
            dataType: 'json',
            data: {
                mid: d
            }, success: function (da) {
                if (da.status) {
                    lvcache[d] = da.data.level_info.current_level;
                    updatelevel(crc, d);
                }
            }
        }
        );
    }
    function render(crc) {
        if (document.getElementById("extd_" + crc) == null) return;
        if (uidcache[crc].length == 1) {
            document.getElementById("extd_" + crc).innerHTML = "弹幕发送者 " + uidcache[crc][0];
            document.getElementById("extd_" + crc).href = "https://space.bilibili.com/" + uidcache[crc][0];
        }
        if (uidcache[crc].length > 1) {
            document.getElementById("extd_" + crc).innerHTML = "弹幕发送者 " + uidcache[crc][uidcache[crc].length - 1];
            document.getElementById("extd_" + crc).href = "https://space.bilibili.com/" + uidcache[crc][uidcache[crc].length - 1];
            for (var i = uidcache[crc].length - 2; i >= 0; i--) {
                document.getElementsByClassName("bilibili-player-context-menu-container")[0].children[0].innerHTML =
                    "<li class=\"context-line context-menu-function\" data-append=\"1\"><a class=\"context-menu-a js-action\" href=\"https://space.bilibili.com/" + uidcache[crc][i] + "\" data-disabled=\"0\" target=\"_blank\" id=\"ex_extd_" + crc + "\">弹幕发送者 " + uidcache[crc][i] + "</a></li>" +
                    document.getElementsByClassName("bilibili-player-context-menu-container")[0].children[0].innerHTML;
            }
        }
    }
    function updatesender(crc) {
        if (crc[0] == 'D') {
            document.getElementById("extd_" + crc).innerHTML = "弹幕发送者 游客";
            return;
        }
        if (uidcache.hasOwnProperty(crc)) {
            //render
            render(crc);
            return;
        }
        if (loaded.hasOwnProperty(crc)) return;
        loaded[crc] = 1;
        $.ajax(
            {
                url: "https://pilipili.ml/query/" + crc + ".js",
                type: "GET",
                cache: true,
                dataType: "json",
                success: function (data) {
                    data.sort(function (a, b) { return a < b ? -1 : (a > b); });
                    for (i = 0; i < data.length; i++)
                        if (data[i] > 360000000) {
                            data.splice(i);
                        }
                    uidcache[crc] = data;
                    if (data.length > 1) {
                        process[crc] = data.length;
                        for (var i = 0; i < data.length; i++)
                            levelup(crc, data[i]);
                    }
                    else {
                        render(crc);
                    }
                },
                error: function (data) {
                    document.getElementById("extd_" + crc).innerHTML = "查询失败";
                }
            }
        )
    }
    function updatemenu(index) {
        document.getElementsByClassName("bilibili-player-context-menu-container")[0].children[0].innerHTML =
            "<li class=\"context-line context-menu-function\" data-append=\"1\"><a class=\"context-menu-a js-action\" href=\"javascript:;\" data-disabled=\"0\" target=\"_blank\" id=\"extd_" + nowdam[index].crc + "\">弹幕发送者 加载中</a></li>" +
            document.getElementsByClassName("bilibili-player-context-menu-container")[0].children[0].innerHTML;
        updatesender(nowdam[index].crc);
    }
    setInterval(getp, 1000);
    rebind();
    function rebind() {
        checker = setInterval(function () {
            if (document.getElementsByClassName("bilibili-player-danmaku-list").length > 0) clearInterval(checker);
            else return;
            document.getElementsByClassName("bilibili-player-danmaku-list")[0].oncontextmenu = function (evt) {
                var sbsb = evt.path;
                for (var i = 0; i < sbsb.length; i++) {
                    if (sbsb[i].localName == "li") {
                        doit(sbsb[i].attributes[0].value);
                        break;
                    }
                }
            }
        }, 100);
    }
})();
// ==UserScript==
// @name         Acfun屏蔽计划-Test
// @namespace    http://tampermonkey.net/
// @version      1.505
// @description  帮助你屏蔽不想看的UP主
// @author       人文情怀
// @match        http://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/list63
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/*
// @match        https://www.acfun.cn/*
// @match        https://www.acfun.cn/v/list*
// @match        http://www.acfun.cn/a/ac*
// @match        https://www.acfun.cn/a/ac*
// @match        http://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/ac*
// @match        https://www.acfun.cn/v/as*
// @match        http://www.acfun.cn/v/as*
// @connect      greasyfork.org
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/384523/Acfun%E5%B1%8F%E8%94%BD%E8%AE%A1%E5%88%92-Test.user.js
// @updateURL https://update.greasyfork.org/scripts/384523/Acfun%E5%B1%8F%E8%94%BD%E8%AE%A1%E5%88%92-Test.meta.js
// ==/UserScript==

function injectStyles(rule) {
    var div = $("<div />", {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo("body");
}

injectStyles(`
div.panel-background-color{
    background-color: rgb(255, 241, 242);
}

div.ctabs{
    position:relative;
    height: 28px;
    /* border-bottom: solid white 1px; */
    font-size: 13px
}
a.ctab{
    white-space:nowrap;
    user-select:none;
    padding: 1px;
    margin: 1px 1px 0px 1px;
    position:relative;
    display: inline-block;
    width: 50px;
    height: 25px;
    font-size: 15px;
    z-index: 9999;
    background-color: #f0b0b0;
    color: #4f2e10;
    border-style:solid;
    border-color: white;
    text-align:center;
}
a.ctab-focus{
    background-color: #ececec;
    transform: translate(0, 3px);
}


`);
injectStyles(`
.blockname{
    font-size:13px;
    display:inline-block;
    margin:2px;
    height:18px;
    background-color:white;
}
.blockdel{
    width:18px;
    height:18px;
    line-height:18px;
    padding: 2px;
    background-color: rgb(255,120,120);
    border-width:0;
    font-size:15px;
    margin-left: 4px;
}
`);

injectStyles(`
button.disabled{
    cursor: not-allowed;
    pointer-events: none;
    /*Button disabled - CSS color class*/
    color: #c0c0c0;
    background-color: #ffffff;
}`);

injectStyles(`
        .filter-button{
           width: 15px;
           height: 15px;
           background-color: rgba(255,0,0,1);
           padding: 1.5px;
           left :0;
           top:0;
           transform: translate(0,0);
           display: none;
           position: absolute;
           z-index: 99999;
           background-size: contain;
           background-image: url(data:image/png;base64,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);
           border-radius: 11px;
           border: 2px rgb(230,230,230) solid;
           cursor: pointer;
        }
        `);

function core() {
    'use strict';
    let version = "1.505";
    let empty = (a) => {
        return typeof a === "undefined" ? () => {
        } : a;
    };

    let GM_set = typeof GM_setValue === "undefined" ?
        function (key, value, callback, failcallback) {
            let p = GM.setValue(key, value);
            p.then(empty(callback), empty(failcallback));


        }
        : function (key, value, callback) {
            let res = GM_setValue(key, value);
            callback();
        };


    let GM_get = typeof GM_getValue === "undefined" ?
        function (key, value, callback) {
            let p = GM.getValue(key, value);
            p.then((debug) => {
                empty(callback)(debug);
            }, () => {
                callback(value);
            });
            //console.log("empty", empty(callback));
        }
        : function (key, value, callback, failcallback) {
            let res = GM_getValue(key, value);
            callback(res);
        };

    //清空列表。DEBUG用
    function cleanList() {

        GM_set("ACFUN_BLOCK_LIST", []);
        GM_set("ACFUN_BLOCK_KEYWORDS", []);
    }

    let ups = function (callback) {
        GM_get("ACFUN_BLOCK_LIST", [], callback);
    };

    let keywords = function (callback) {
        GM_get("ACFUN_BLOCK_KEYWORDS", [], callback);
    };

    let repliers = function (callback) {
        GM_get("ACFUN_BLOCK_REPLIERS", [], callback);
    };

    let setUp = function (d, callback) {
        GM_set("ACFUN_BLOCK_LIST", d, callback);
    };

    let setKeywords = function (d, callback) {
        GM_set("ACFUN_BLOCK_KEYWORDS", d, callback);
    };

    let setRepliers = function (d, callback) {
        GM_set("ACFUN_BLOCK_REPLIERS", d, callback);
    };

    function setUpdateTime(time, callback) {
        let t = typeof time === "undefined" ? +new Date() : time;
        GM_set("UPDATE_TIME", t, () => {
            empty(callback)(t);
        });
    }

    function getUpdateTime(callback) {
        let time = 0;
        GM_get("UPDATE_TIME", time, (d) => {
            console.log("get update time", d, parseInt(d));
            callback(parseInt(d));
        });
    }

    function addToUpList(id, callback) {
        ups((old) => {
            if (old.indexOf(id) >= 0) {
                $.info.show("你已经屏蔽过UP主[" + id + "]啦！");
                return;
            }
            old.push(id);
            GM_set("ACFUN_BLOCK_LIST", old, () => {
                $.info.show("已将UP主[" + id + "]加入屏蔽列表");
                empty(callback)();
                setUpdateTime();
            });
        });
    }


    function removeFromUpList(id, callback) {
        ups((old) => {
            let i = old.indexOf(id);
            if (i >= 0) {
                old.splice(i, 1);
            }
            GM_set("ACFUN_BLOCK_LIST", old, () => {
                $.info.show("已将UP主[" + id + "]移出屏蔽列表。");
                empty(callback)();
                setUpdateTime();
            });
        });
    }

    function addToKeywords(id, callback) {
        keywords((old) => {
            if (old.indexOf(id) >= 0) {
                $.info.show("你已经添加过关键词[" + id + "]啦！");
                return;
            }
            old.push(id);
            GM_set("ACFUN_BLOCK_KEYWORDS", old, () => {
                $.info.show("已将关键词[" + id + "]加入屏蔽列表");
                empty(callback)();
                setUpdateTime();
            });
        });
    }

    function removeFromKeywords(id, callback) {
        keywords((old) => {
            let i = old.indexOf(id);
            if (i >= 0) {
                old.splice(i, 1);
            }
            GM_set("ACFUN_BLOCK_KEYWORDS", old, () => {
                $.info.show("已将关键词[" + id + "]移出屏蔽列表。");
                empty(callback)();
                setUpdateTime();
            });
        });
    }

    function addToRepliers(id, callback) {
        repliers((old) => {
            if (old.indexOf(id) >= 0) {
                $.info.show("你已经屏蔽过评论者[" + id + "]啦！");
                return;
            }
            old.push(id);
            GM_set("ACFUN_BLOCK_REPLIERS", old, () => {
                $.info.show("已将评论者[" + id + "]加入屏蔽列表");
                empty(callback)();
                setUpdateTime();
            });
        });
    }

    function removeFromRepliers(id, callback) {
        repliers((old) => {
            let i = old.indexOf(id);
            if (i >= 0) {
                old.splice(i, 1);
            }
            GM_set("ACFUN_BLOCK_REPLIERS", old, () => {
                $.info.show("已将评论者[" + id + "]移出屏蔽列表。");
                empty(callback)();
                setUpdateTime();
            });
        });
    }

    let filterButton = document.createElement("div");

    function initButton() {
        document.body.appendChild(filterButton);

        $(filterButton).attr("class", "filter-button")

    }


    function handleSpecialJSONstr(str) {
        let str2 = str.replace("\n", "");
        let matches = str2.match(/\"title\"\:\"(.{0,55})\"\,"[a-zA-Z]{1,15}":/);

        if (matches !== null && matches.length > 0) {
            let title = matches[1];
            let res = str.replace(title, "");

            return [res, title];
        } else {
            return [str2, "无标题"];
        }

    }

    //获得所有主页的UP的DOM TAG
    function getHomeSelection() {
        let res = [];
        //过滤主页视频
        let selections = $("a[data-info]");
        for (let i = 0; i < selections.length; i++) {
            let tag = selections[i];
            let info = $(tag).attr("data-info");
            let json = "";
            try {
                let temp = (info);
                json = JSON.parse(temp);
                let title = json.title;
                let username = json.userName;
                res.push({tag: $(tag).parent()[0], title: title, username: username, type: 1, json: json});
            } catch (e) {
                console.error(e);
            }

            //$(tag)
        }

        //过滤右边排行榜视频
        let sel = $("ul[data-con]");

        //For each rank
        for (let i = 0; i < sel.length; i++) {
            let tag = sel[i];
            let rows = $(tag).find("li");
            //For each row
            for (let ri = 0; ri < rows.length; ri++) {
                let rowTag = rows[ri];
                let aTag = $(rowTag).find("[title]")[0];
                let title = $(aTag).attr("title");
                let matches = usernameByTitle(title);
                let titlestr = titleByTitle(title)[0];
                if (matches) {
                    let username = matches[0].substring(3).trim();
                    res.push({tag: rowTag, title: titlestr, username: username, type: 2});
                }
            }
        }
        //--------------------主页文章区
        sel = $("div[data-con]");
        for (let i = 0; i < sel.length; i++) {
            let tag = sel[i];
            let rows = $(tag).find("li");
            //For each row
            for (let ri = 0; ri < rows.length; ri++) {
                let rowTag = rows[ri];
                let aTag = $(rowTag).find("[title]")[0];
                let title = $(aTag).attr("title");
                if (title) {
                    let matches = usernameByTitle(title);
                    let titlestr = titleByTitle(title)[0];
                    if (matches) {
                        let username = matches[0].substring(3).trim();
                        res.push({tag: rowTag, title: titlestr, username: username, type: 3});

                    }
                }
            }
        }
        //香蕉搒
        var allBananas = $("figure.fl.block-box.block-video.weblog-item").find("> figcaption > em > a");
        for (let i = 0; i < allBananas.length; i++) {
            let sel = allBananas[i];
            let upname = $(sel).attr("title");
            let tag = $(sel).parent().parent().parent()[0];
            let title = $(sel).parent().parent().find('b > a').text();
            res.push({tag: tag, username: upname, type: 1, title: title});
        }

        //大版推荐
        let allBig = $('.module-video-big').find('.text-overflow').find('a[title]');
        for (let i = 0; i < allBig.length; i++) {
            try{
            let title = $(allBig[i]).attr("title");
            let regx = /UP:(.+)/;
            let r = regx.exec(title);
            let username = r[1];
            let tag = $(allBig[i]).parent().parent();
            let subtag = tag.prev();
            let titlestr = titleByTitle(title)[0];
            res.push({tag: subtag[0], subtag: tag[0], username: username, type: 5, title: titlestr});
            }catch(e){

            }

        }
        // console.log("res",res);
        return res;
    }

    function getListSelection() {
        console.log("list selec");
        let res = [];
        let sel = $("div.weblog-item");
        for (let i = 0; i < sel.length; i++) {
            let row = sel[i];
            let aTag = $(row).find(".atc-up")[0];
            let username = $(aTag).attr("title");
            let title = $(row).find('a[title]').attr("title");
            res.push({tag: row, username: username, type: 4, title: title});

        }
        //Video List
        let sel2 = $("li.weblog-item");
        //console.log(sel2);
        for (let i = 0; i < sel2.length; i++) {

            let row = sel2[i];
            //console.log(row);
            let title = $(row).find("b.text-over").find('.third-title').text();
            let username = $(row).find("p.up-name").find('a.third-name').text();
            res.push({tag: row, username: username, type: 4, title: title});
        }
        //console.log(res);
        return res;
    }

    let pageType = "home";

    //显示/刷新屏蔽的UP主
    function displayUpList() {


        ups((data) => {
            //console.log("up",data);
            $("#upnameList").empty();
            for (let i = 0; i < data.length; i++) {

                let style2 = "";
                let b = $("<div class='blockname'><span>" + data[i] + "</span></div>");
                let del = $("<button class='blockdel' >×</button>");
                b.append(del);
                let str = data[i];
                del.on("click", function () {
                    removeFromUpList(str, () => {
                        displayUpList();
                        if (pageType === "home") {
                            FilterHomePage();
                        } else if (pageType === "list") {
                            FilterListPage();
                        }
                    });

                });
                $("#upnameList").append(b);
            }

        });
    }


    //显示屏蔽的关键词
    function displayKeywords() {
        keywords((data) => {
            $("#keywords_list").empty();
            for (let i = 0; i < data.length; i++) {
                let b = $("<div class='blockname'><span>" + data[i] + "</span></div>");
                let del = $("<button class='blockdel' >×</button>");
                b.append(del);
                let str = data[i];
                del.on("click", function () {
                    removeFromKeywords(str, () => {
                        displayKeywords();
                        if (pageType === "home") {
                            FilterHomePage();
                        } else if (pageType === "list") {
                            FilterListPage();
                        }
                    });

                });
                $("#keywords_list").append(b);
            }
        })
    }

    //显示屏蔽的评论者
    function displayRepliers() {
        repliers((data) => {
            $("#repliersList").empty();
            for (let i = 0; i < data.length; i++) {
                let b = $("<div class='blockname'><span>" + data[i] + "</span></div>");
                let del = $("<button class='blockdel' >×</button>");
                b.append(del);
                let str = data[i];
                del.on("click", function () {
                    removeFromRepliers(str, () => {
                        displayRepliers();
                        filterReplies();
                    });

                });
                $("#repliersList").append(b);
            }
        })
    }


    //检查公告
    function checkAnnouncement(callback) {
        let xhttp = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;
        xhttp({
            method: "GET",
            url: "https://greasyfork.org/scripts/384697-acfunblockerannoucement/code/AcfunBlockerAnnoucement.js",
            onload: function (response) {
                let text = response.responseText;
                callback(text);
            },
            onerror(evt) {
                callback(null);
            }
        });
    }

    //检查更新
    function checkUpdate(callback) {
        let xhttp = typeof GM_xmlhttpRequest !== "undefined" ? GM_xmlhttpRequest : GM.xmlHttpRequest;
        xhttp({
            method: "GET",
            url: "https://greasyfork.org/scripts/381476-acfun%E8%BF%87%E6%BB%A4up%E8%AE%A1%E5%88%92/code/Acfun%E8%BF%87%E6%BB%A4UP%E8%AE%A1%E5%88%92.user.js",
            onload: function (response) {
                let text = response.responseText;
                let p = /@version +(\d+\.\d+)/;
                let arr = p.exec(text);
                let latest = arr[1];
                callback(latest);
            }
        });
    }

    let show = false;
    let dragging = false;

    function banana(i) {
        let banana_0 = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAACaUlEQVR4Ab2WA7AcTRSF88e2XYptFGOzFNu2bdu2bdu2bTvje3LeTviMnn+qvt19PdN9rudFUn1Bu/sfxFoOyFPylb8PcS2+ciF/oolgPOlCukK/3xr6486wPgwHjfFOVKx8EPMiHP0QxWZDnBcAFnrrKZCRdCPHIfYzADNI5Ej/xwXnW3WIcRLAZC91/Oe2GKz3UxniMfydzOvwRgFkOoxnvSjW3Ifxojsgub0UHQKxbkJ/2O6XKL2dAeAWIHG8EEwHyCe2SzdX8C/c/A5UL2p/qgr781JXyB/G894AnrPAoqsuniqkeZC4IU+vMrTR4Wh7gxd90Bbmq7IqRfND7CfBinJCAVinUFQ60tODIYhOA7BRpadHwUODFbU/LwEwT1UBpeOBy6DdaxmCp9MhVhP/1maG2H5jqzqsd10AbAFkImkNsYpxPY6/5xPA+e5XsY1I81CS7NfmSuQkeQfn63q30h514Oyc7Os7RzsA+8sqN0QfZwJ4TF4QHWKc43qLEMXMl4N4xrRfoYkK/XFzejaJ5Tw4xM18McN42p2ztSe0+61C7aE7kbr/NUk+t4f5erj7gHrozBAAr0nCv3PTh7nZ6Zmo62Vz/z1WHOI8/5Ub5egPKgP4L7A+Owvr7VilYs63zSwevzMDH/KsyrS82RjsNQWetfFNJ+AqIClCavKUEOsk87vLfSOEO4dnAawniUI7zlKQRYB8Zng2htoz68Ms2J8W8u/aTFO+8P7/mo4hasBDajL0c/j3bTj6YZ8h9td1vqJjNLh+F4BGDgNOPa5HUTXME5CSpCUZSkZyYhWmQDZ3XeKG5bwfy2sngYJT7nMAAAAASUVORK5CYII=)";
        let res = "<div id='banana_" + i + "'class='bbanana' style='cursor: pointer;display:inline-block;height:20px; width:20px; background-image:" + banana_0 + ";background-position: center; background-repeat:no-repeat; background-size:contain'></div>";
        return res
    }

    let articleId = 10271618;

    function feedBanana(n) {
        try {
            //let a = btoa(Math.random().toString(36).substr(2))
            //let str = '$.cookie("stochastic","'+a+'",{path:"/"});';
            //console.log(str);
            //unsafeWindow.eval();
            //let cookie = unsafeWindow.eval('(()=>{return })();');
            let command = `
let a = btoa(Math.random().toString(36).substr(2));
$.cookie("stochastic",a ,{path:"/"});
let c = $.cookie("_did");
$.ajax({
type:"post",
url: "/nd/pst?locationPath=throwBanana&certified="+a,
beforeSend: function(e) {
e.setRequestHeader("udid", c)
},
data: {
contentId: "` + articleId + `",
count: ` + (n + 1) + `,
userId: $.user.uid,
},
dataType: "json",
xhrFields: {
withCredentials: !0
}
}).done(function(e){
if (e.success>0){
$.info.success("成功投食了作者"+` + (n + 1) + `+"根香蕉O(∩_∩)O。谢谢支持！", 3e3)
}else{
$.info.warning("投食作者失败了。"+e.info, 3e3);
}
}).fail(function(){
$.info.warning("投食作者失败了 /(ㄒoㄒ)/~~。请于稍后重新操作。", 3e3)
})`;

            unsafeWindow.eval(command);

        } catch (e) {
            console.log("投食DEBUG", e);
        }

    }

    let banana_n = -1;

    function attachBananaEvent() {

        let banana_0 = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAACaUlEQVR4Ab2WA7AcTRSF88e2XYptFGOzFNu2bdu2bdu2bTvje3LeTviMnn+qvt19PdN9rudFUn1Bu/sfxFoOyFPylb8PcS2+ciF/oolgPOlCukK/3xr6486wPgwHjfFOVKx8EPMiHP0QxWZDnBcAFnrrKZCRdCPHIfYzADNI5Ej/xwXnW3WIcRLAZC91/Oe2GKz3UxniMfydzOvwRgFkOoxnvSjW3Ifxojsgub0UHQKxbkJ/2O6XKL2dAeAWIHG8EEwHyCe2SzdX8C/c/A5UL2p/qgr781JXyB/G894AnrPAoqsuniqkeZC4IU+vMrTR4Wh7gxd90Bbmq7IqRfND7CfBinJCAVinUFQ60tODIYhOA7BRpadHwUODFbU/LwEwT1UBpeOBy6DdaxmCp9MhVhP/1maG2H5jqzqsd10AbAFkImkNsYpxPY6/5xPA+e5XsY1I81CS7NfmSuQkeQfn63q30h514Oyc7Os7RzsA+8sqN0QfZwJ4TF4QHWKc43qLEMXMl4N4xrRfoYkK/XFzejaJ5Tw4xM18McN42p2ztSe0+61C7aE7kbr/NUk+t4f5erj7gHrozBAAr0nCv3PTh7nZ6Zmo62Vz/z1WHOI8/5Ub5egPKgP4L7A+Owvr7VilYs63zSwevzMDH/KsyrS82RjsNQWetfFNJ+AqIClCavKUEOsk87vLfSOEO4dnAawniUI7zlKQRYB8Zng2htoz68Ms2J8W8u/aTFO+8P7/mo4hasBDajL0c/j3bTj6YZ8h9td1vqJjNLh+F4BGDgNOPa5HUTXME5CSpCUZSkZyYhWmQDZ3XeKG5bwfy2sngYJT7nMAAAAASUVORK5CYII=)";
        let banana_1 = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB0AAAAcCAYAAACdz7SqAAAEQklEQVR4Ab2WA5hkuRbHe2ZRN7mFNqvWtvH2rW2Mbdtt27Zt2zbGtm116Ww6rTtW1Z7v+8fJL040VG3eMwTv+80W9ATNF+7wmyXYYzeKzdRQt3lPF2yWb5fAvnIxdKWaQIGHgdRtkmCJWqG+s0QHtuSK4XynBA5Xi+FMiwk4jGGL1Ao1+5V/PHyJ8PjeUhOothGC9V/87cu/Yl5QK3T+xzxtAvmlwl9P3maPwfYPPE3jv7CV3zATW6L1pDvDhOA5Hm8hHcFqBdqPYpfEr9U8tbNQDLDNBA4EIQiYhPYT8Ai1AG3/Zn/Nstc62xIrBtlWCcAuovWGsN6RBxEzUI461nKE2yT+totdEtiQLqbAIZWLIG4WI/f4m2esUuia79EP1UG6V3rSxKDYTmHD6jGEA75ktDNRvkqhjmPYnEtdJrAlhzNKrlJ4EDIVnVEp1H0yf4tyJ7mJyu4ATWUgeApfSpYBqWo9+ZHLRUfPtErg+ubbADsMAJJ5EDVTqCRl31QJdN2PaFRbrJ70yoYByIHvAHY/2x/eSZTLUmjYdM0+6DsqgTqNY8u35XKm9di84XCDDgVKExjwHq+pINCnb54mtPo79Ds54KvNf8Hzlvyf+ZKk6d8NaPk7/tNvjt7lg5UD0APfAhydOXRGIYWh0B5HPvhNElwl7Y0cONR4FAF5kM1woCtRX36o0gh2FxlCc5SeLNlC8wR5H3e7jGfbyIhS7f5hzcx/xZOs/8TzSbzId5buxaO1A6Pa9xHAGY/+8BZjgAxEgX3KW6YJ/pPxfgpc9S16PWKp8MTGDCOyCW7aef3rMqS+I7G/3Ah25BvQTl3dwCl/6B+Ak1Yk/AwBmgBk4SHgmTAEuUsF4DkBu1Go3d84aluarrKH3CJH62+CSvdQ/47a/QLA4XEAx5cAHPypP22jEUAmBQ6pap0IomahvqkVDq7jkymLUG9vgQgur5eAfPudIJwp3P8pgfxGRvcHwJ6Xh/Pa9Ol55AJ3erLQYYfBawLO1uBa2Ex8hhYqFcH+YmOQbbsD8A6i61cipBCuToUi2OrGB98J6CIdJdeiFvFXXImhBel1tSNCGy40GN4TRndnuYjWuRl4mqzjXh8W8lYimeM/eNztbpSRKYvxdW6l3d4sbPYSgLJEBFCnDdCo069abTojN68bVxciEd08jTZI4T4eB2jcyQJmsH/VWiIFt/K1WAY67AXQ5SCAqyRM0u5bFeZI7jIGR977+zgJB6YtZOTX425soDeeoYe73kII1WZCqCN+g6UQOkmHtrnz4VjQ8KgvRfEgag6+7DmZ/fH+n6i/0Gfke3GsZCWjPBd+/yO7EMmDglVIFreE70xvnYcxj1HM/0Ono7bw6eh85hJG1mbD0If4dChRGA+OhSLY7I2hxJyVhs/Cp5OXsUspTIVfEd1lXzDf2o1iLcnH2Zc82FEOo1lXs1/wBJKn+aDt/QuVqtkurjj8qQAAAABJRU5ErkJggg==)";
        $(".bbanana").on("mouseover", function () {
            let id = $(this).attr("id");
            let n = parseInt(id.split("_")[1]);
            banana_n = n;
            let all = $(".bbanana");
            for (let i = 0; i < all.length; i++) {
                let tid = $(all[i]).attr("id");
                let tn = parseInt(tid.split("_")[1]);
                if (tn <= n) {
                    $(all[i]).css("background-image", banana_1)
                } else {
                    $(all[i]).css("background-image", banana_0)
                }
            }

        })
            .on("click", function () {

                let id = $(this).attr("id");
                let n = parseInt(id.split("_")[1]);
                feedBanana(n);
            });
        $("#banana_contain").on("mouseleave", function () {
            $(".bbanana").css("background-image", banana_0)
        })
    }

    function bindKeywordInputs() {
        $('#keyword').keypress(function (e) {
            if (e.keyCode === 13)
                $('#enterKeyword').click();
        });

        $('#enterKeyword').on("click", function () {
            let val = $("#keyword").val();
            if (val.length > 1) {
                $("#keyword").val('');
                addToKeywords(val, () => {
                    displayKeywords();
                    if (pageType === "home") {
                        FilterHomePage();
                    } else if (pageType === "list") {
                        FilterListPage();
                    }
                });
            } else {
                $.info.warning('不能添加过短的关键词。');
            }
        })
    }

    function checkBananaFed() {
        let url = 'https://www.acfun.cn/member/collect_up_exist.aspx?contentId=' + articleId;
        $.ajax({url: url})
            .done(function (d) {
                //console.log(d);
                if (d.result && d.result === "请先登录") {
                    $("#banana_contain").text("登录投蕉吧！")
                } else {
                    if (d.data && d.data.banana) {
                        if (d.data.banana > 0) {
                            $("#banana_contain").text("感谢" + d.data.banana + "蕉支持！");
                        }
                    }
                }

            })

    }

    function addPanel() {


        let dx = 0;
        let dy = 0;
        let sx = 0;
        let sy = 0;
        let ox = 0;
        let oy = 0;


        injectStyles(`

        div.panel-drag-image{
            height: 92px;
            left: 22px;
            width: 66px;
            background-image:  url(data:image/png;base64,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);
            background-size:contain;
            background-repeat: no-repeat;
            position:absolute
        }
        button.panel-toggle{
            height: 92px;
            width: 23px;
            background-color: rgb(255,193,193);
            border-width: 0;
        }
        div.panel-wrap{
            z-index: 999;
            position: fixed;
            left: 0;
            top: 0;
            text-orientation: upright;
        }
        div.panel-toggle-wrap{
            position: relative;
            height: 92px;
            width: 23px
        }
        div.panel-content-container{
            width: 280px;
            display:none;
            padding: 0px;
            z-index:998;
            position:fixed;
            background-color:rgb(255, 196, 196);
            left:23px;
            top: 0px;
        }
        div.upnames-list{
            height: 220px; border: 0px solid white; margin: 3px;overflow-y:scroll
        }
        div.keywords-list{
            height: 220px;
            border: 0px solid white;
            margin: 3px;
            overflow:hidden;
            display:none;
        }
        div.repliers-list{
            height: 220px;
            border: 0px solid white;
            margin: 3px;
            overflow:hidden;
            display:none;
        }
        div.keywords-input-wrap{
            height: 22px;
            background-color:
            rgb(220,220,220);
        }
        input.keyword-input{
            height: 18px;width: 120px; border: 0 solid black; padding: 0; margin: 1px;
        }
        input.keyword-submit{
            line-height:18px; height: 18px;width: 60px; border: 1px solid grey; margin: 1px; padding: 0; background-color: rgb(179, 255, 179)
        }
        div.announcement{
            background-color:black; color: white;height: 220px; border: 0px solid white; margin: 3px;overflow-y:scroll; display:none;
        }
        div.cloud-panel{
            color: black; height: 220px; border: 0px solid white; margin: 3px; display:none;
        }

        `);

        let panelWrap = $("<div id='blockbuttoncontainer' class='panel-wrap'></div>");
        let panelToggleWrap = $("<div class='panel-toggle-wrap'></div>");
        panelWrap.append(panelToggleWrap);

        let panelToggleButton = $("<button id='blockbutton' class='panel-toggle'>屏蔽设置</button>");
        let panelDragImage = $("<div class='panel-drag-image'></div>");
        //panel container
        panelToggleWrap.append(panelDragImage);

        let panelContentContainer = $("<div id='blockpanel' class='panel-content-container'></div>");

        let ptabs = $("<div id='tabs' class='ctabs'></div>");
        let tab_1 = $("<a class='ctab ctab-focus'>ＵＰ主</a>");
        let tab_2 = $("<a class='ctab'>评论者</a>");
        let tab_3 = $("<a class='ctab'>关键字</a>");
        let tab_4 = $("<a class='ctab' >云备份</a>");
        let tab_5 = $("<a class='ctab'>公告</a>");


        let panelUpNames = $("<div id='upnameList'  class='upnames-list panel-background-color'></div>"); //1
        let panelRepliers = $("<div id='repliersList'  class='repliers-list panel-background-color'></div>"); //2
        let panelKeywords = $(`<div id='keywordsList'  class='keywords-list panel-background-color'>
                <div class="keywords-input-wrap">
                    <input class="keyword-input" id='keyword' type='text' autocomplete="off" />
                    <input class="keyword-submit" id='enterKeyword' type='submit' value='添加↵'/>
                </div>
                <div id='keywords_list' style='height: 198px;overflow-y: scroll; '></div>
            </div>`); //3
        let panelCloud = $("<div id='cloudpanel' class='cloud-panel panel-background-color'></div>"); //4
        let panelAnnouncement = $("<div id='announcement' class='announcement'>正在加载公告....</div>");//5

//bind tabs

        tab_1[0]["tabBind"] = panelUpNames;
        tab_2[0]["tabBind"] = panelRepliers;
        tab_3[0]["tabBind"] = panelKeywords;
        tab_4[0]["tabBind"] = panelCloud;
        tab_5[0]["tabBind"] = panelAnnouncement;


        ptabs.append(tab_1);
        ptabs.append(tab_2);
        ptabs.append(tab_3);
        ptabs.append(tab_4);
        ptabs.append(tab_5);


        let cloudInfo = $("<div style='padding:8px;'>本插件利用Acfun的私信系统实现云备份屏蔽设置。登陆后即可随时同步你的屏蔽设置。每次Acfun页面打开时将会自动检查和同步哟！</div>");
        let cloudCheckTime = $("<div id='checktime' style='display: none'></div>");
        let cloudSyncButton = $("<div style='padding: 8px;'><button id='cloudsync' class='disabled' style='padding: 5px; font-size: 23px; width: 150px'>正在同步...</button></div>");
        panelCloud.append(cloudInfo);
        panelCloud.append(cloudSyncButton);
        panelCloud.append(cloudCheckTime);


        let advertisementInfo = $("<div style='border: 1px solid white; margin:3px;padding: 2px; font-size: 11px;background-color:rgb(255, 217, 67); color: black'>喜欢的话 安利哟：<a id='articleRec' target='_blank' style='color:rgb(71, 71, 138); text-decoration: underline' href='/a/ac10271618'>ac10271618</a></div>");
        let bananaHTML = "<a id='banana_contain' style='white-space:nowrap'>" + banana(0) + banana(1) + banana(2) + banana(3) + banana(4) + "</a>";
        let versionInfo = $("<div style='border: 0px solid white; margin:3px;padding: 2px; font-size: 11px;background-color:rgb(234, 200, 65); color: rgb(50,50,50)'><span style='padding: 3px;margin-right: 10px'>当前版本：" + version + "</span> " + bananaHTML + "</div>");
        let updateReminder = $("<div style='background-color: green; color: white; display: none; margin:3px; padding: 2px;' id='update_info'></div>");


        GM_get("ACFUN_BLOCK_POS", "{ox:0, oy:0}", (d) => {
            ox = parseInt(d.ox);
            oy = parseInt(d.oy);
            ox = isNaN(ox) ? 0 : ox;
            oy = isNaN(oy) ? 300 : oy;
            panelContentContainer.css("transform", "translate(" + (ox) + "px," + (oy) + "px)");
            panelToggleWrap.css("transform", "translate(" + (ox) + "px," + (oy) + "px)");
        });


        $(document.body).append(panelWrap);
        panelToggleWrap.append(panelToggleButton);

        panelContentContainer.append(ptabs);

        panelContentContainer.append(panelUpNames);
        panelContentContainer.append(panelRepliers);
        panelContentContainer.append(panelKeywords);
        panelContentContainer.append(panelAnnouncement);
        panelContentContainer.append(panelCloud);

        panelContentContainer.append(advertisementInfo);
        panelContentContainer.append(versionInfo);
        panelContentContainer.append(updateReminder);

        $(document.body).append(panelContentContainer);


        $("a.ctab").on("click", function () {
            $("a.ctab").removeClass("ctab-focus");
            $("a.ctab").each(function () {
                $(this)[0]["tabBind"].css("display", "none");
            });
            $(this).addClass("ctab-focus");
            $(this)[0]["tabBind"].css("display", "block")

        });

        bindKeywordInputs();
        attachBananaEvent();

        panelToggleButton.on("click", function () {
            show = !show;
            panelContentContainer.css("display", show ? "block" : "none");
            if (show) {

                displayUpList();
                displayKeywords();
                displayRepliers();
                panelDragImage.css("left", "302px")
            } else {
                panelDragImage.css("left", "22px")
            }
        });
        panelDragImage.on("mousedown", (event) => {
            sx = event.pageX;
            sy = event.pageY;
            dragging = true;
        });
        $(document).on("mouseup", () => {
            if (dragging) {
                ox = dx + ox;
                oy = dy + oy;
                dx = 0;
                dy = 0;
                let maxHeight = $(window.top).height() - 123;
                let maxWidth = 240;
                ox = ox > maxWidth ? maxWidth : ox;
                ox = ox < 0 ? 0 : ox;
                oy = oy < 0 ? 0 : oy;
                oy = oy > maxHeight ? maxHeight : oy;
                panelContentContainer.css("transform", "translate(" + (ox) + "px," + (oy) + "px)");
                panelToggleWrap.css("transform", "translate(" + (ox) + "px," + (oy) + "px)");
                GM_set("ACFUN_BLOCK_POS", {ox: ox, oy: oy}, (d) => {
                    //console.log("DEBUG", "POSITION SET", ox, oy);
                });
            }
            dragging = false;
        });
        $(document).on("mousemove", (event) => {
            if (dragging) {
                dx = event.pageX - sx;
                dy = event.pageY - sy;
                panelToggleWrap.css("transform", "translate(" + (dx + ox) + "px," + (dy + oy) + "px)");
                panelContentContainer.css("transform", "translate(" + (dx + ox) + "px," + (dy + oy) + "px)");
            }
        });


        checkUpdate((v) => {
            console.log("new Version", v, "Local Version", version);
            if (parseFloat(v) > parseFloat(version)) {
                updateReminder.css("display", "block")
                    .html("<a style='color:white' target='_blank' href='https://greasyfork.org/en/scripts/381476'>可以升级至：" + v + " 👉</a>");
                $.info.show("屏蔽系统有新版本了~")
            }
        });

        checkAnnouncement((text) => {
            if (text !== null) {
                let evalRes = unsafeWindow.eval(text);
                //console.log("Info:", evalRes);
                if (!!evalRes && typeof evalRes.articleId !== "undefined") {
                    articleId = evalRes.articleId;
                    //update 安利
                    advertisementInfo.find("a").attr("href", "/a/ac" + articleId)
                        .text("ac" + articleId);
                }
            }
            tryCloudSync();
            checkBananaFed();
        });

        cloudSyncButton.find("button").on("click", function () {
            tryCloudSync(true);
        });

    }


    function attachBlockButton() {
        let attach = function (list) {
            console.log("attach list", list);
            for (let i = 0; i < list.length; i++) {
                let item = list[i];
                let tag = item.tag;
                if ($(tag).hasClass("event-attached")) continue;

                let tagType = item.type;
                $(tag).addClass("event-attached");

                $(tag).on("mouseover", function () {
                    if (window.currentTag === tag) return;
                    let button = $(filterButton).detach();
                    const HOME_PAGE_ARTICLE = 3;
                    if (tagType === HOME_PAGE_ARTICLE) {

                        $(tag).parent()
                            .css("transform", "translate(-15px,0)")
                            .css("padding-left", "15px")
                            .css("overflow", "hidden")
                            .css("width", "260px");

                        $(tag).css("white-space", "nowrap");
                        $(tag)
                            .css("overflow", "visible")
                            //.css("overflow-y", "hidden")
                            .css(" text-overflow", "ellipsis")
                        ;
                    } else {

                    }
                    $(tag)
                        .css("position", "relative")
                        .append(button);

                    window.currentTag = tag;
                    window.currentUser = item.username;
                    $(filterButton).css("display", "block").off("click");
                    if (pageType !== "home") {
                        $(filterButton)
                            .css("right", "0")
                            .css("top", "0")
                            .css("transform", "translate(0,0)")
                    } else {

                        $(filterButton).css("transform", "translate(" + (tagType === HOME_PAGE_ARTICLE ? "-80%" : 0) + ",0)")
                    }

                    $(filterButton).on("click", function (e) {
                        e.preventDefault();
                        if (typeof window.currentTag !== "undefined" && window.currentTag !== null) {
                            console.log("un", window.currentUser, item, i);
                            addToUpList(window.currentUser, () => {
                                displayUpList();
                                if (pageType === "home") {
                                    FilterHomePage();
                                } else if (pageType === "list") {
                                    FilterListPage();
                                }
                            });


                        }
                    })
                        .show();
                });
                $(tag).on("mouseleave", function () {
                    $(filterButton).detach();
                    window.currentTag = null;
                    window.currentUser = null;
                    $(filterButton).off("click").hide()
                })
            }
        };
        if (pageType === "home") {
            let list = getHomeSelection();
            attach(list);
        } else {
            let list = getListSelection();
            attach(list);
        }

    }

    let pannelAdded = false;

    function watchHomepage() {
        let mutationObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let target = mutation.target;
                if ($(target).hasClass("clearfix") && $(target).hasClass("module-video")) {
                    attachBlockButton();
                    HandleHomePage();
                }
            });
        });

        mutationObserver.observe(unsafeWindow.document, {subtree: true, childList: true});
    }

    function watchList() {
        let mutationObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                let target = mutation.target;
                if ($(target).hasClass("article-list") || $(target).attr("id") === "list-video") {
                    attachBlockButton();
                    //屏蔽文章页，
                    FilterListPage();

                }
            });
        });

        mutationObserver.observe(unsafeWindow.document, {subtree: true, childList: true});


    }

    function addUI() {
        console.log("Ad UI");
        if (!pannelAdded) {
            addPanel();
            pannelAdded = true;
            if (pageType === "home") {
                watchHomepage();
            } else if (pageType === "list") {
                watchList();
            }
        }
    }

    function getRepliesSelectionOld() {
        let sels = $("div.commentWrap");
        let res = [];

        sels.each(function () {
            let replier = $(this).find("a[data-uid]").text();
            let tag = $(this);
            let parent = $(this).parent().parent().parent();
            let avatar = null;
            if (parent.hasClass("main-comment-item")) {
                avatar = $(parent).find("li.avatar")[0];
            }

            res.push({
                tag: tag[0],
                replier: replier,
                avatar: avatar,
            })
        });

        return res;
    }


    function filterReplies() {
        let commentMode = unsafeWindow.localStorage.getItem("ac_usp_commMode");

        if (commentMode === "1") {
            //旧版评论
            filterRepliesOld();

        } else {
            //新版评论
            filterRepliesNew();
        }
    }


    function getRepliesSelectionNew() {
        let sels = $(".clearfix.area-comment-first");
        let res = [];

        sels.each(function () {
            let nametag = $(this).find("a.name")[0];
            let replier = $(nametag).text();
            let tag = $(this);
            let avatar = null;

            res.push({
                tag: tag[0],
                replier: replier,
                avatar: avatar,
            })
        });
        let sels2 = $(".clearfix.area-comment-sec");

        sels2.each(function () {
            let nametag = $(this).find("a.name")[0];
            let replier = $(nametag).text();
            let tag = $(this);
            let avatar = null;

            res.push({
                tag: tag[0],
                replier: replier,
                avatar: avatar,
            })
        });

        return res;
    }

    function filterRepliesNew() {
        // console.log("FilterRepNew");
        repliers((list) => {
            // console.log("Repliers", list);
            let pagelist = getRepliesSelectionNew();
            for (let i = 0; i < pagelist.length; i++) {
                let item = pagelist[i];
                let replier = item.replier;
                if (list.indexOf(replier) >= 0) {
                    hideCommentTag(item);
                } else {
                    showCommentTag(item);
                }
            }
        })

    }

    function filterRepliesOld() {
        repliers((list) => {
            let pagelist = getRepliesSelectionOld();
            for (let i = 0; i < pagelist.length; i++) {
                let item = pagelist[i];
                let replier = item.replier;
                if (list.indexOf(replier) >= 0) {
                    hideCommentTag(item);
                } else {
                    showCommentTag(item);
                }
            }
        })

    }

    function attachBlockReplierButtonOld() {
        function attach() {
            //console.log("attach block replier");
            let sels = $(".comment-item-footer");

            sels.each(function () {
                if ($(this).hasClass("event-attached")) {
                    return;
                }


                //wrap all
                let wrap = $("<div class='commentWrap' style='display: block'></div>");
                $(this).parent().append(wrap);

                let nameTag = $(this).prev().prev();
                let contentTag = $(this).prev();
                let toolbarTag = $(this);

                let name = $(this).prev().prev().find("a[data-uid]").text();
                //console.log(name, $(this).find("span.comment-toolbar"));
                let btn = $("<a style='margin-left:16px'>屏蔽</a>");
                $(this).find("span.comment-toolbar").append(btn);


                nameTag = nameTag.detach();
                contentTag = contentTag.detach();
                toolbarTag = toolbarTag.detach();

                wrap.append(nameTag).append(contentTag).append(toolbarTag);

                btn.on("click", function () {
                    addToRepliers(name, () => {
                        displayRepliers();
                        setTimeout(() => {
                            filterRepliesOld();
                        })

                    })
                });
                $(this).addClass("event-attached")


            })
        }

        let mutationObserver = new MutationObserver(function (mutations) {

            let done = false;
            mutations.forEach(function (mutation) {
                if (done) return;
                let target = mutation.target;
                if ($(target).hasClass("main-comment-item") || $(target).hasClass("quoted-comment-item") || $(target).hasClass("comment-list")) {

                    //console.log("target", target, mutation.type);
                    setTimeout(()=>{
                    attach();
                    filterReplies();
                    },0);
                    done=true;
                }
            });
        });

        mutationObserver.observe(unsafeWindow.document, {subtree: true, childList: true});

        attach();
        filterReplies();
    }

    function attachBlockReplierButtonNew() {


        injectStyles(`
            .area-comment-block {
    background: url(data:image/png;base64,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) no-repeat;
    background-size: 13px 13px;
    background-position: 0 1px;
    padding-left: 17px;
    padding-right: 15px;
    color: #999;
}
        `);

        function attach() {
            //console.log("attach block replier NEW");
            let sels = $("div.area-comment-tool");
            //console.log("New sels", sels)
            sels.each(function () {
                if ($(this).hasClass("event-attached")) {
                    return;
                }


                let name = $(this).prev().prev().find("a.name").text();
                let replyBtn = $(this).find(".area-comment-reply");
                let btn = $("<a class='area-comment-block'>屏蔽</a>");

                btn.insertAfter(replyBtn);


                btn.on("click", function () {
                    addToRepliers(name, () => {
                        displayRepliers();
                        setTimeout(() => {
                            filterRepliesNew();
                        })

                    })
                });
                $(this).addClass("event-attached")


            })
        }

        let mutationObserver = new MutationObserver(function (mutations) {
            let done=false;
            mutations.forEach(function (mutation) {
                let target = mutation.target;
                //console.log(target)
                if (done) return;
                if ($(target).hasClass("area-hot-close") || $(target).hasClass("area-sec-close")|| $(target).hasClass("edui-body-container") || ($(target).hasClass("area-comment-top"))) {
                    //console.log("target", target, mutation.type);

                    //console.log("target", target, mutation.type);
                    setTimeout(()=>{
                    attach();
                    filterReplies();
                    },0);
                    done=true;

                }
            });
        });

        mutationObserver.observe(unsafeWindow.document, {subtree: true, childList: true});
        attach();
        filterReplies();

    }


    function addArticlePageUI() {
        let commentMode = unsafeWindow.localStorage.getItem("ac_usp_commMode");

        attachBlockReplierButtonOld();

        attachBlockReplierButtonNew();

    }

    function titleByTitle(t) {
        let regex = /.+/;
        return t.match(regex);
    }

    function usernameByTitle(title) {
        let regex = /UP:(.+)[\s\v\n]/g;
        return title.match(regex);
    }

    function hideArticleTag(tag) {
        if ($(tag).css("display") !== "none") {
            //console.log(tag, tag.getBoundingClientRect);
            let rect = tag.getBoundingClientRect();
            $(tag).css("transition", "0.5s")
                .css("-webkit-transition", "0.5s")
                .css("overflow", "hidden")
                .css("height", rect.height + "px");

            let d = $(tag).css("display");
            tag["_d"] = d;
            tag["_h"] = rect.height + "px";
            //console.log("hide tag",tag["_d"], tag["_h"]);
            $(tag).css("height", "0px");

            setTimeout(() => {
                $(tag).css("display", "none");
            }, 500);
            let bar = $(tag).next();
            //console.log(bar);
            if (bar.length > 0 && $(bar).prop("tagName").toUpperCase() === "HR") {
                $(bar).css("display", "none");
            }
        }
    }

    function showArticleTag(tag) {
        if ($(tag).css("display") === "none" && typeof tag["_d"] !== "undefined") {
            $(tag).css("transition", "0.5s")
                .css("-webkit-transition", "0.5s")
                .css("overflow", "hidden");
            if (typeof tag["_d"] !== "undefined") {
                $(tag).css("display", tag["_d"]);
            } else {
                $(tag).css("display", "block");
            }
            if (typeof tag["_h"] !== "undefined") {
                $(tag).css("height", tag["_h"]);
            } else {
                $(tag).css("height", "auto");
            }

            //article list page, hide the separator as well
            let bar = $(tag).next();
            if (bar.length > 0 && $(bar).prop("tagName").toUpperCase() === "HR") {
                $(bar).css("display", "block");
            }


        }
    }

    function hideCommentTag(item) {
        let tag = item.tag;
        if (typeof tag["_t"] === "undefined") {
            //console.log(tag, tag.getBoundingClientRect);
            let rect = tag.getBoundingClientRect();
            $(tag).css("transition", "0.5s")
                .css("-webkit-transition", "0.5s")
                .css("overflow", "hidden")
                .css("height", rect.height + "px");

            let d = $(tag).css("display");
            tag["_d"] = d;
            tag["_h"] = rect.height + "px";
            let hint = $("<div style='padding: 3px'>已屏蔽【" + item.replier + "】的评论</div>");
            let removeBlock = $("<a style='margin-left: 5px;color:#2596d2'>[取消屏蔽]</a>");
            hint.append(removeBlock);


            removeBlock.on("click", function () {
                removeFromRepliers(item.replier, () => {
                    filterReplies();
                    displayRepliers();
                })
            });
            //console.log("hide tag",tag["_d"], tag["_h"]);
            tag["_t"] = hint;
            hint.insertBefore(tag);
            $(tag).css("height", "0px");

            setTimeout(() => {
                $(tag).css("display", "none");
            }, 500);

            if (item.avatar) {
                $(item.avatar).css("visibility", "hidden");
            }

        }
    }

    function showCommentTag(item) {
        let tag = item.tag;
        if ($(tag).css("display") === "none" && typeof tag["_d"] !== "undefined") {
            $(tag).css("transition", "0.5s")
                .css("-webkit-transition", "0.5s")
                .css("overflow", "hidden");
            if (typeof tag["_d"] !== "undefined") {
                $(tag).css("display", tag["_d"]);
            } else {
                $(tag).css("display", "block");
            }
            // if (typeof tag["_h"] !== "undefined") {
            //     $(tag).css("height", tag["_h"]);
            // } else {
            $(tag).css("height", "auto");
            //  }
            if (typeof tag["_t"] !== "undefined") {
                //console.log("remove hint", tag["_t"]);
                let hint = tag["_t"];
                hint.remove();
                delete tag["_t"];
            }


            if (item.avatar) {
                $(item.avatar).css("visibility", "visible");
            }
        }

    }

    function FilterHomePage() {
        keywords((keywordList) => {
            ups((upList) => {
                //过滤主页视频
                let selections = getHomeSelection("FILTER", false, false);
                for (let i = 0; i < selections.length; i++) {
                    let tag = selections[i].tag;
                    let tagType = selections[i].type;
                    let username = selections[i].username;
                    let title = selections[i].title;
                    if (upList.indexOf(username) >= 0 || containsKeyword(keywordList, title)) {
                        hideArticleTag(tag);
                        if (tagType === 5) {
                            hideArticleTag(selections[i].subtag);
                        }
                    } else {
                        showArticleTag(tag);
                        if (tagType === 5) {
                            showArticleTag(selections[i].subtag);
                        }
                    }
                }
            })
        })

    }


    function containsKeyword(list, title) {
        for (let i = 0; i < list.length; i++) {
            let w = list[i];
            if (title.indexOf(w) >= 0) {
                return true;
            }
        }
        return false;
    }

    //过滤文章列表页
    function FilterListPage() {
        keywords((keywordList) => {
            ups(((upList) => {
                let sel = getListSelection();
                for (let i = 0; i < sel.length; i++) {
                    let row = sel[i].tag;
                    let username = sel[i].username;
                    let title = sel[i].title;
                    if (upList.indexOf(username) >= 0 || containsKeyword(keywordList, title)) {
                        //console.log("过滤文脏区",username);
                        //屏蔽
                        hideArticleTag(row);
                    } else {
                        showArticleTag(row);
                    }
                }
                window.scrollTo(window.scrollX, window.scrollY + 1);
            }))
        })
    }

    function HandleHomePage() {
        console.log("home list");
        //屏蔽首页UP，包括视频和右边的文章区
        FilterHomePage();
    }

    function HandleListPage() {
        console.log("debug list");
        FilterListPage();
    }

    function HandleArticlePage() {
        //对于单独的文章页或者视频，添加一个按钮屏蔽当前UP主
        let sidebutton = $("<div style='z-index: 9999;position:fixed; left:0px; top: 150px;  width:30px; padding: 5px; background-color: rgba(255,50,50,0.3);user-select:none;-webkit-user-select:none;  cursor: pointer;'>屏蔽ＵＰ</div>");
        $(document.body).append(sidebutton);

        let button = $("<a style='margin-left: 5px; display: inline-block; vertical-align: middle; width: 30px; height: 18px; line-height: 18px; color: #4a8eff; cursor: pointer; font-size: 13px'>屏蔽</a>");
        $("div.up-abstract").css("width", "auto");
        $("div.action-up").append(button).css("width", "125px");

        let trigger = function () {
            let upname = "";
            if (window.location.href.indexOf("www.acfun.cn/v/ac") >= 0) {
                upname = $("a.name-wrap").html();
            } else if (window.location.href.indexOf("www.acfun.cn/a/ac") >= 0) {
                upname = $("a.upname").html();
            }
            addToUpList(upname, () => {
                displayUpList();
            });
        };

        button.on("click", trigger);
        sidebutton.on("click", trigger);

        //添加屏蔽评论的UI
        addArticlePageUI()
    }

    let cloudServer = 16731600;

    function msgChunker(msg) {
        return msg.match(/.{1,800}/g);
    }


    let lastUpdateTime = 0;

    function encode(a) {
        return btoa(escape(a))
    }

    function decode(a) {
        return unescape(atob(a))
    }

    function cloudUpdate(cloudData, showinfo) {
        let splitter = ",";
        keywords((keywordList) => {
            ups((upList) => {
                repliers((repList) => {
                    let t = +new Date();
                    let data = {
                        keywords: encode(keywordList.join(splitter)),
                        ups: encode(upList.join(splitter)),
                        repliers: encode(repList.join(splitter)),
                        time: encode(t),
                        version: version,
                    };
                    if (cloudData && cloudData.time === lastUpdateTime && cloudData.version >= data.version) {
                        console.log("No need to update cloud, everything is the same");
                        if (showinfo) $.info.show("云检查完毕，已经是最新的了！")
                    } else if (keywordList.length === 0 && upList.length === 0) {
                        console.log("No need to update cloud, lists are empty");
                        if (showinfo) $.info.show("云检查完毕，没有需要同步的设置（列表都是空的呢）。")
                    } else {
                        console.log("Update to cloud");
                        let msg = JSON.stringify(data);
                        cloudSend(msg, showinfo);
                        setUpdateTime(t, () => {

                        });
                    }
                });

            })
        })
    }

    function updateListByCloudData(data) {
        let keywordsstr = decode(data.keywords);
        let upsstr = decode(data.ups);
        let replierstr = typeof data.repliers == "undefined" ? "" : decode(data.repliers);
        let spliter = upsstr.indexOf(" ") > 0 || keywordsstr.indexOf(" ") > 0 ? " " : ",";
        let keywords = keywordsstr.split(spliter);
        let ups = upsstr.split(spliter);
        let repliers = replierstr.split(spliter);
        //console.log("spliter", ups, keywords, spliter)
        keywords = keywords.length === 1 && keywords[0] === "" ? [] : keywords;
        ups = ups.length === 1 && ups[0] === "" ? [] : ups;
        repliers = repliers.length === 1 && repliers[0] === "" ? [] : repliers;

        //console.log(ups, keywords);
        setUp(ups, () => {
            console.log("Uplist updated!", ups);
            displayUpList()
        });
        setKeywords(keywords, () => {
            console.log("Keywordlist Updated", keywords);
            displayKeywords();
        });
        setRepliers(repliers, () => {
            console.log("Replierlist updated");
            displayRepliers();
        });
        setUpdateTime(data.time, () => {
            console.log("Time Updated", (data.time))
        });

        $.info.show("ACFUN屏蔽系统：下载屏蔽设置成功！")
    }

    let defaultUpdateInterval = 30 * 1000;

    function cloudCheck(showinfo) {
        $('#cloudsync').addClass("disabled").text("正在同步...");
        if (typeof showinfo === "undefined") {
            showinfo = false;
        }

        getUpdateTime((localTime) => {
            lastUpdateTime = localTime;
            cloudGet((text) => {
                if (text === null) {
                    //nothing found, just upload data
                    console.log("Update by null");
                    cloudUpdate();
                } else {
                    try {
                        let data = JSON.parse(text);
                        //检查版本兼容
                        if (typeof data.version === "undefined" || parseFloat(data.version) < parseFloat(version)) {
                            $.info.show("旧版同步信息发现，重新同步");
                            updateListByCloudData(data);
                            cloudUpdate(data, showinfo);

                        } else if (parseFloat(data.version) > parseFloat(version)) {
                            $.info.show("同步失败：你已经在其他地方使用过更新的版本了。请更新当前屏蔽插件，最新版本：" + data.version);

                        } else {
                            console.log("data time", data.time, decode(data.time), "local", localTime);
                            data.time = parseInt(decode(data.time));
                            let cloudtime = data.time;
                            if (cloudtime > localTime || version !== data.version) {
                                //如果云时间更新，则使用云上的
                                console.log("Update list");
                                updateListByCloudData(data);

                            } else if (localTime > (cloudtime)) {
                                //本地更新，尝试更新
                                console.log("Update ");
                                cloudUpdate(data, showinfo);
                            } else {
                                console.log("Check done, no update needed", (localTime - cloudtime) / 1000, data);
                                if (showinfo) $.info.show("云检查完毕，已经是最新的了！")
                            }
                            //检查完毕，让同步按钮可用
                            $('#cloudsync').removeClass("disabled").text("手动同步");
                            $('#checktime').css("display", "block").text("上次检查时间：" + (new Date()).toLocaleString())
                        }
                    } catch (ex) {
                        //如果数据出错，直接尝试上传云
                        console.error("Update By err", ex);
                        setTimeout(cloudUpdate, 0);
                    }
                }
            })
        })
    }

    // function cloudSend2(msg) {
    //
    //     let im = unsafeWindow.ImSdk;
    //     let instance = im.instance;
    //     let session = instance.kernel.openSession(0, cloudServer);
    //     console.log("cloud send", msg);
    //
    //     function sendChunks(chunks, i) {
    //         let m = (i + 1) + "/" + chunks.length + " " + chunks[i];
    //         console.log("send chunk", chunks, m);
    //         instance.sendMessage(cloudServer, m, () => {
    //             console.log("Cloud info chunk ", i, "sent");
    //             if (i < chunks.length - 1) {
    //                 sendChunks(chunks, i + 1);
    //             } else {
    //                 console.log("All info sent");
    //                 $.info.show("ACFUN屏蔽系统：上传屏蔽设置成功！")
    //             }
    //         });
    //     }
    //
    //     let chunks = msgChunker(msg);
    //     console.log("schunk", chunks);
    //     sendChunks(chunks, 0);
    // }

    function cloudSend(msg, showinfo) {
        let evalstr = `
(function(){
function msgChunker(msg){
let chunks = msg.match(/.{1,950}/g);
return chunks;
}

let showinfo = ` + showinfo + `;
let msg = '` + msg + `';
let im = ImSdk;
let instance = im.instance;
let cloudServer = ` + cloudServer + `;
let session = instance.kernel.openSession(0, cloudServer);
console.log("cloud send", msg)

function sendChunks(chunks, i){
let m = (i+1)+"/"+chunks.length+" "+ chunks[i];
console.log("send chunk",chunks, m);
instance.sendMessage(cloudServer, m, ()=>{
console.log("Cloud info chunk ", i, "sent")
if (i<chunks.length-1){
setTimeout(
()=>{sendChunks(chunks,i+1);}
, 200)
}else{
console.log("All info sent");
if (showinfo) $.info.show("Acfun屏蔽设置同步完毕！")
}
});
}

let chunks = msgChunker(msg);
console.log("schunk",chunks);
sendChunks(chunks,0);
})()`;
        //console.log(evalstr);
        unsafeWindow.eval(evalstr);
    }

    function deleteOldCloudSaves(msgIds) {
        function del(list, i) {

        }
    }

    //获得最新的云备份
    function cloudGet(callback) {
        let im = unsafeWindow.ImSdk;
        let instance = im.instance;
        let id = "0_" + cloudServer;
        //console.log(id, instance.chatMap);
        let sess = instance.kernel.openSession(0, cloudServer);

        let msgs = instance.kernel.getMessages(sess);
        //console.log("msgs", msgs);

        if (typeof msgs === "undefined" || msgs.length === 0) {
            callback(null);
            return
        }
        let lastmsg = msgs[msgs.length - 1].text;
        //console.log(lastmsg);

        try {
            let info = lastmsg.split(" ");
            let chunkinfo = info[0].split("/");
            let chunksize = chunkinfo[1];
            let texts = [];

            if (chunksize) {
                chunksize = parseInt(chunksize);
                for (let i = 0; i < chunksize; i++) {
                    let m = msgs[msgs.length - i - 1].text;
                    let minfo = m.split(" ");
                    let mchunkinfo = minfo[0].split("/");
                    let chunk_i = parseInt(mchunkinfo[0]) - 1;
                    texts[chunk_i] = minfo.slice(1).join(" ");

                }
            }
            let text = texts.join("");
            //console.log("msgtext", text);
            callback(text);

        } catch (e) {
            console.error(e);
            callback(null)
        }
    }

    let trySyncCount = 0;

    function tryCloudSync(showinfo) {
        trySyncCount++;
        if (trySyncCount > 30) return;
        let im = unsafeWindow.ImSdk;
        if (typeof im === "undefined" || typeof im.instance === "undefined" || !im.instance.connected || typeof im.instance.kernel.cache === "undefined") {
            console.log("载入信息。。");
            setTimeout(() => {
                tryCloudSync(showinfo);
            }, 1000);
        } else {
            setTimeout(() => {
                cloudCheck(showinfo)
            }, 100);
        }
    }


    function initLoad() {

        if (typeof $ === "undefined" || typeof unsafeWindow.$ === "undefined" || typeof unsafeWindow.$.info === "undefined") {
            console.log("Loading..");
            //$ = unsafeWindow.$;
            setTimeout(initLoad, 1000);
            return;
        }

        $.info = unsafeWindow.$.info;

        //console.log("Loaded info ", $.info);

        function isArtileListPage() {
            if (window.location.href.indexOf("www.acfun.cn/v/as") > 0) return true;

            let t = ["list63", "list110", "list73", "list164", "list184", "list74", "list75"];
            let url = window.location.href;
            for (let i = 0; i < t.length; i++) {
                if (url.indexOf(t[i]) >= 0) return true;
            }
            return false;
        }

        function isVideoHome() {

            let t = ["list155", "list1", "list58", "list123", "list59", "list60", "list70", "list68", "list69", "list125"];
            let url = window.location.href;
            for (let i = 0; i < t.length; i++) {
                if (url.indexOf(t[i]) >= 0) return true;
            }
            return false;
        }

        console.log("DEBUG body Loaded");
        if (window.location.href === "http://www.acfun.cn/" || window.location.href === "https://www.acfun.cn/") {
            pageType = "home";
            initButton();
            addUI();
            attachBlockButton();
            HandleHomePage();

        }
        if (window.location.href.indexOf("www.acfun.cn/v/list") >= 0 || window.location.href.indexOf("www.acfun.cn/v/as") > 0) {
            //可能是文章列表
            if (isArtileListPage()) {
                pageType = "list";
                initButton();
                addUI();
                HandleListPage();
            } else if (isVideoHome()) {
                pageType = "home";
                initButton();
                addUI();
                attachBlockButton();
                HandleHomePage();
            } else {
                pageType = "list";
                initButton();
                addUI();
                HandleListPage();
            }

        }
        //降低存在感
        //$.info.success("屏蔽启动！")

    }

    function initLoadPart2() {

        if (typeof $ === "undefined" || typeof unsafeWindow.$ === "undefined") {
            console.log("Loading.. Part 2");
            setTimeout(initLoadPart2, 1000);
            return;
        }

        if (window.location.href.indexOf("www.acfun.cn/v/ac") >= 0 || window.location.href.indexOf("www.acfun.cn/a/ac") >= 0) {
            HandleArticlePage();
            pageType = "article";
            addUI();
        }
    }

    initLoad();
    initLoadPart2();
}

core();
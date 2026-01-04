// ==UserScript==
// @name         Bilibili Popups
// @namespace    sheep-realms
// @version      1.4.16
// @description  B站内链助手
// @author       Sheep-realms
// @match        *://*.bilibili.com/*
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @license      CC BY-NC-SA 4.0
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_setClipborad
// @run-at       document-body
// @icon         https://static.hdslb.com/images/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/436958/Bilibili%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/436958/Bilibili%20Popups.meta.js
// ==/UserScript==

// 判断是否需要初始化
if (GM_getValue("popups") == undefined) {
    let insdt = new Date().getTime();
    GM_setValue("popups", {
        dataVersion: 2,
        config: {
            useSkin: "Classic"
        },
        statistic: {
            installDate: insdt,
            useCount: 0
        }
    });
} else {
    let pdata = GM_getValue("popups");
    let insdt = new Date().getTime();
    switch (pdata.dataVersion) {
        case 1:
            pdata.dataVersion = 2;
            pdata.statistic = {
                installDate: insdt,
                useCount: 0
            }
    }
    GM_setValue("popups", pdata);
}

// Popups 主类
function Popups() {
    this.id = "popups";
    this.$sel = "#" + this.id;
    this.state = 0;
    this.used = false;
    this.timer = 0;
    this.disable = false;
    this.deactivate = false;
    this.posX = 0;
    this.posY = 0;
    this.skin = [];
    this.maxWidth = 0;
    this.maxHeight = 0;
    this.urlAntiTrack = true;
    this.data = {}
    this.lang = {};
    this.noAntiYposOflow = ["live.bilibili.com"];

    this.getConfig = function(name) {
        let cfg = GM_getValue("popups");
        return cfg.config[name];
    }

    this.setConfig = function(name, value) {
        let cfg = GM_getValue("popups");
        cfg.config[name] = value;
        GM_setValue("popups", cfg);
    }

    this.getStatistic = function(name) {
        let sts = GM_getValue("popups");
        return sts.statistic[name];
    }

    this.setStatistic = function(name, value) {
        let sts = GM_getValue("popups");
        sts.statistic[name] = value;
        GM_setValue("popups", sts);
    }

    this.setData = function(data) {
        if (typeof data == 'object') {
            this.data = data;
        }
    }

    this.resetView = function(title="missingno") {
        $(this.$sel).html('<a target="_blank" class="right-image-box hide" href="#"><img class="right-image" src=""></a><div class="text-box"><div class="title-box"><h4 class="title">'+title+'</h4><p class="subtitle"></p></div><hr><div class="content"></div><hr><div class="footer"><p><b>Popups</b> • <a href="javascript: void(0);" id="popups-skin">皮肤</a></p></div></div>');
    }

    this.load = function() {
        $("body").append('<div id="'+this.id+'" class="hide"></div>');
        this.resetView();
    }

    this.pushSkin = function(skinObj) {
        this.skin.push(skinObj);
    }

    this.loadSkin = function() {
        let skinName = this.getConfig("useSkin");
        let defStyle = this.skin.find(function(obj) {
            return obj.name == "Default";
        });
        let style = this.skin.find(function(obj) {
            return obj.name == skinName;
        });
        GM_addStyle(defStyle.getStyle());
        if (style != undefined) {
            this.maxWidth = style.maxWidth;
            this.maxHeight = style.maxHeight;
            GM_addStyle(style.getStyle());
        }
    }

    this.switchSkin = function(skinName) {
        let style = this.skin.find(function(obj) {
            return obj.name == skinName;
        });
        if (style != undefined) {
            this.setConfig("useSkin", skinName);
            location.reload();
        }
    }

    this.setTitle = function(str) {
        $(this.$sel + " .title").text(str);
    }

    this.setSubtitle = function(str) {
        $(this.$sel + " .subtitle").html(str);
    }

    this.add = function(str) {
        $(this.$sel + " .content").append(str);
    }

    this.adds = function(strlist=[]) {
        for (var i=0; i<strlist.length; i++) {
            $(this.$sel + " .content").append(strlist[i]);
        }
    }

    this.move = function(left=this.posX+5, top=this.posY+5) {
        if (document.documentElement.scrollWidth - left < this.maxWidth) left = document.documentElement.scrollWidth - this.maxWidth - 10;
        if (document.documentElement.scrollHeight - top < this.maxHeight) top = document.documentElement.scrollHeight - this.maxHeight - 10;
        if (!this.isNAYO(window.location.host) && document.documentElement.scrollTop + window.innerHeight - top < this.maxHeight) top = document.documentElement.scrollTop + window.innerHeight - this.maxHeight - 10;
        $(this.$sel).css("left", left).css("top", top);
    }

    this.show = function() {
        if (!this.disable && !this.deactivate) {
            $(this.$sel).removeClass('hide');
            this.state = 1;
            if (!this.used) {
                this.used = true;
                this.setStatistic("useCount", this.getStatistic("useCount")+1);
            }
        }
    }

    this.hide = function() {
        $(this.$sel).addClass('hide');
        this.state = 0;
    }

    this.setImage = function(url) {
        $(this.$sel + " .right-image").attr('src', url);
        $(this.$sel + " .right-image-box").attr('href', url);
        if (url != "") {
            $(this.$sel + " .right-image-box").removeClass('hide');
        } else {
            $(this.$sel + " .right-image-box").addClass('hide');
        }
    }

    this.error = function(title="出错啦！", message="", code="无") {
        this.resetView(title);
        this.add('<p>'+message+'</p>');
        this.add('<p>错误代码：'+code+'</p>');
    }

    this.stop = function() {
        this.deactivate = true;
        this.hide();
        clearTimeout(this.timer);
    }

    this.isNAYO = function(host) {
        if (this.noAntiYposOflow.indexOf(host) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

let pop = new Popups();

pop.setData({
    //剧集类型
    bangumiType: ["", "番剧", "电影", "纪录片", "国创", "电视剧", "", "综艺"],
    //直播状态
    liveStatus: ["未开播", "直播中"],
    //轮播状态
    roundStatus: ["未轮播", "轮播中"],
    //认证类型
    officialRole: [0, 1, 1, 2, 2, 2, 2, 1, 0, 1],
    officialRoleName: ["无认证", "个人认证", "机构认证"],
    officialRoleColor: ["", "#FFB732", "#00C9FF"],
    officialRoleType: ["", "知名UP主", "大V达人", "企业", "组织", "媒体", "政府", "高能主播", "", "社会知名人士"]
});

// Popups 函数类
function PopupsFunction() {
    this.timeZero = function(value) {
        return value < 10 ? "0" + value : value
    }

    this.getDateTime = function(stamp) {
        let b = 14 - stamp.toString().length;
        let t = new Date(stamp * Math.pow(10, b-1));
        return t.getFullYear() + '-' + (t.getMonth() + 1) + '-' + t.getDate() + ' ' + this.timeZero(t.getHours()) + ':' + this.timeZero(t.getMinutes()) + ':' + this.timeZero(t.getSeconds());
    }

    this.sec2Time = function(sec, hMode=true) {
        let h = 0, hs = 0, m = 0, s = 0;
        if (hMode) {
            h = parseInt(sec/3600);
            hs = sec % 3600;
        } else {
            hs = sec;
        }
        m = parseInt(hs/60);
        s = sec % 60;
        if (hMode && h != 0) {
            return h + ":" + this.timeZero(m) + ":" + this.timeZero(s);
        } else {
            return m + ":" + this.timeZero(s);
        }
    }

    this.getUrlPath = function(url){
        var arrUrl = url.split("//");

        var start = arrUrl[arrUrl.length - 1].indexOf("/");
        var relUrl = arrUrl[arrUrl.length - 1].substring(start);

        if(relUrl.indexOf("?") != -1){
            relUrl = relUrl.split("?")[0];
        }
        return relUrl;
    }

    this.getRouteValue = function(path, key, mode=0) {
        let p = path;
        if (p.substr(0, 1) != "/") p = "/" + p;
        let route = p.split("/");
        if (isNaN(key) || mode==1) {
            let i = route.indexOf(key);
            if (i != -1) {
                return route[i+1];
            } else {
                return "";
            }
        } else {
            return route[key];
        }
    }
}

let pfc = new PopupsFunction();

// Popups I18N 类
function PopupsLang(langName, langCode, lang) {
    this.langName = langName;
    this.langCode = langCode;
    this.lang = lang;
}

let lang = new PopupsLang("简体中文（中国）", "zh-cn", {
    buttom: {
        ok: "确认",
        cancel: "取消",
        yes: "是",
        no: "否",
    },
    state: {
        view: "播放",
        viewArticle: "阅读",
        like: "点赞",
        coin: "投币",
        danmaku: "弹幕",
        reply: "评论",
        favorite: "收藏",
        share: "分享",
    }
});

// Popups 工厂类
function PopupsFactory() {
    this.id = "popups";
    this.$sel = "#" + this.id;

    this.url = function(subdomain="www", path="") {
        return "https://"+subdomain+".bilibili.com/"+path;
    }

    this.link = function(url="", text="", strClass="") {
        return '<a target="_blank" class="'+strClass+'" href="'+url+'" data-url="'+url+'">'+text+'</a>';
    }

    this.userinfo = function(uid="", username="") {
        return '<p>作者：'+this.link(this.url("space", uid), username)+'<sup class="user-group"></sup> ['+this.link(this.url("message", "#whisper/mid"+uid), "私信")+'] （'+this.link(this.url("space", uid+"/dynamic"), "动态")+' | '+this.link(this.url("space", uid+"/video"), "投稿")+' | '+this.link(this.url("space", uid+"/channel/series"), "列表")+'）</p>';
    }

    this.officialTag = function(code) {
        let type = pop.data.officialRole[code]
        return '<span style="color:'+pop.data.officialRoleColor[type]+';" title="'+pop.data.officialRoleName[type]+'-'+pop.data.officialRoleType[code]+'">[V]</span>';
    }

    this.nftTag = function() {
        return '<span style="color:#C7A0FF;" title="数字艺术头像">[N]</span>';
    }

    this.desc = function(text, title="简介") {
        return '<p>'+title+'：</p><p class="video-desc">'+text+'</p>';
    }
}

let popf = new PopupsFactory();

// Popups 皮肤类
function PopupsSkin(name="Example Popups Skin", style=[], maxWidth=0, maxHeight=0) {
    this.name = name;
    this.styleSheets = style;
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;

    this.getStyle = function() {
        return this.styleSheets.join(" ");
    }

    this.loadStyle = function() {
        GM_addStyle(this.getStyle());
    }
}

let defaultSkin = new PopupsSkin("Default", [
    "#popups {font-size: 12px; position: absolute; background-color: #FFF; z-index: 12000; color: #222; display: block;}",
    "#popups.hide, #popups .hide {display: none;}",
    "#popups .content {display: block;}",
    "#popups table {font-size: 12px;}",
    "#popups .video-stat tr td:first-child {padding-right: 1.5em;}",
    "#popups .video-stat tr td {line-height: 1.5em;}",
    "#popups h4 {font-size: 14px; margin-bottom: 5px; font-weight: bold; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;}",
    "#popups p {color: #222; font-size: 12px; line-height: 1.5em; margin-block-start: 0; margin-block-end: 0; margin-inline-start: 0; margin-inline-end: 0;}",
    "#popups a {color: #00a1d6;}",
    "#popups b {font-weight: bold;}",
    "#popups hr {border: none; background-color: #BBB; height: 1px; margin: 3px 0; clear: both;}",
    "#popups .video-desc {max-width: 330px; max-height: 150px; padding: 5px; background-color: #F4F4F4; overflow: hidden;}",
    "#popups .txt-red {color: #fb7299;}",
    "#popups .user-group {vertical-align: super; line-height: 0; transform: scale(0.8); display: inline-block; top: 0;}",
], 0, 0);

let popSkin = new PopupsSkin("Classic", [
    "#popups {max-width: 350px; min-width: 200px; border: #BBB 1px solid; box-shadow: rgb(50 50 50 / 35%) 0 3px 8px; border: #BBB 1px solid; box-shadow: rgb(50 50 50 / 35%) 0 3px 8px; z-index: 12000; padding: 10px;}",
    "#popups .right-image-box {float: right; line-height: 0;}",
    "#popups img.right-image {max-width: 120px; max-height: 50px;}",
], 350, 0);

let vanillaSkin = new PopupsSkin("Vanilla", [
    "#popups {display: flex; flex-direction: row-reverse; width: 450px; height: 240px; font-size: 13px; border: none; border-radius: 2px; box-shadow: 0 30px 90px -20px rgb(0 0 0 / 30%), 0 0 1px 1px rgb(0 0 0 / 5%); overflow: hidden; justify-content: flex-end}",
    "#popups .text-box {padding: 20px; height: calc(100% - 40px); overflow-y: scroll; width: 230px; box-sizing: content-box;}",
    "#popups .text-box::-webkit-scrollbar {width: 5px; background: transparent;}",
    "#popups .text-box::-webkit-scrollbar-thumb {background: rgb(0 0 0 / 15%); border-radius: 2.5px;}",
    "#popups table {font-size: 13px;}",
    "#popups .video-stat tr td:first-child {padding-right: 1.2em;}",
    "#popups h4 {font-size: 16px; margin-bottom: 5px; font-weight: bold;}",
    "#popups p {color: #222; font-size: 13px; line-height: 1.5em;}",
    "#popups hr {clear: none;}",
    "#popups .video-desc {max-width: 230px; max-height: 150px; padding: 5px; font-size: 12px; background-color: #F4F4F4; overflow: hidden;}",
    "#popups .right-image-box {float: right; line-height: 0; display: flex; align-items: center; background: #F4F4F4; width: 180px;}",
    "#popups img.right-image {max-width: 180px; max-height: 240px;}",
], 450, 240);

// popSkin.loadStyle();
pop.pushSkin(defaultSkin);
pop.pushSkin(popSkin);
pop.pushSkin(vanillaSkin);
pop.loadSkin();

function BiliAPI() {
    this.domain = "https://api.bilibili.com/";
    this.api = {
        videoAv: "x/web-interface/view?aid=",
        videoBv: "x/web-interface/view?bvid=",
        article: "x/article/viewinfo?id=",
        audio: "audio/music-service-c/web/song/info?sid=",
        bangumiEp: "pgc/view/web/season?ep_id=",
        bangumiSs: "pgc/view/web/season?season_id=",
        liveRoom: "https://api.live.bilibili.com/room/v1/Room/room_init?id=",
        user: "x/space/acc/info?mid=",
        userCard: "x/web-interface/card?mid="
    };

    this.get = function(key, value="") {
        if (this.api[key].substr(0, 4) != "http") {
            return this.domain + this.api[key] + value;
        } else {
            return this.api[key] + value;
        }
    }
}

let bapi = new BiliAPI();

let ctrlKey = false;
let altKey = false;
let shiftKey = false;

$(document).mousemove(function(e){
    pop.posX = e.pageX;
    pop.posY = e.pageY;
});

$(document).keydown(function(e) {
    pop.disable = e.altKey;
    ctrlKey = e.ctrlKey;
    altKey = e.altKey;
    shiftKey = e.shiftKey;
})

$(document).keyup(function(e) {
    pop.disable = e.altKey;
    ctrlKey = e.ctrlKey;
    altKey = e.altKey;
    shiftKey = e.shiftKey;
})

$(document).ready(function() {
    pop.load();

    $("#popups").mouseenter(function() {
        // console.log(">> mouseover #popups");
        clearTimeout(pop.timer);
    });

    $("#popups").mouseleave(function() {
        // console.log("<< mouseleave #popups");
        clearTimeout(pop.timer);
        pop.timer = setTimeout(function() {
            pop.hide();
        }, 500)
    });

});

$(document).on("click", "#popups-skin", function() {
    if (pop.getConfig("useSkin") == "Classic") {
        if (confirm("您确定要使用 Vanilla 皮肤吗？")) {
            pop.switchSkin("Vanilla");
        }
    } else if (pop.getConfig("useSkin") == "Vanilla") {
        if (confirm("您确定要使用 Classic 皮肤吗？")) {
            pop.switchSkin("Classic");
        }
    }
});

//反爬虫追踪
$(document).on("click", "#popups a", function(e) {
    if (pop.urlAntiTrack) {
        if ($(this).data("url")) {
            if (ctrlKey) {
                GM_openInTab($(this).data("url"));
                return false;
            } else {
                GM_openInTab($(this).data("url"), {active: true});
                return false;
            }
        }
    }
});

$(document).on("mouseenter", "a:not(#popups a)", function() {
    // console.log(">> mouseover a");
    if (pop.disable || pop.deactivate) return false;
    let a = $(this).offset();
    let $that = $(this);
    if ($that.parents(".favorite-video-panel, .vp-container, #multi_page, .user-panel-ctnr").length != 0) return false;

    let mode = "";
    let url = $(this).attr("href");
    let path = pfc.getUrlPath($(this).attr("href"));
    let qid;

    if (path.search(/\/video\/av/) != -1) {
        mode = "av";
        qid = pfc.getRouteValue(path, "video").replace("av","");
    } else if (path.search(/\/audio\/au/) != -1) {
        mode = "au";
        qid = pfc.getRouteValue(path, "audio").replace("au","");
    } else if (path.search(/\/video\/BV/) != -1) {
        mode = "bv";
        qid = pfc.getRouteValue(path, "video");
    } else if (path.search(/\/read\/cv/) != -1) {
        mode = "cv";
        qid = pfc.getRouteValue(path, "read").replace("cv","");
    } else if (path.search(/\/bangumi\/play\/ep/) != -1) {
        mode = "ep";
        qid = pfc.getRouteValue(path, "play").replace("ep","");
    } else if (url.search(/live.bilibili.com/) != -1) {
        mode = "live";
        if (path == "live.bilibili.com" || path == "/") return false;
        let strid = pfc.getRouteValue(path, 1);
        if (isNaN(strid) || strid == undefined || strid == "") return false;
        qid = strid;
        // if (path.search(/\/[a-z]/) != -1) {
        //     qid = path.slice(1,path.search(/\/[a-z]/));
        // } else {
        //     if (path.slice(-1) == "/") {
        //         qid = path.slice(1, -1);
        //     } else {
        //         qid = path.slice(1);
        //     }
        // }
    } else if (path.search(/\/bangumi\/play\/ss/) != -1) {
        mode = "ss";
        qid = pfc.getRouteValue(path, "play").replace("ss","");
    } else if (url.search(/space.bilibili.com/) != -1) {
        mode = "user";
        if (path == "space.bilibili.com" || path == "/") return false;
        let strid = pfc.getRouteValue(path, 1);
        if (isNaN(strid) || strid == undefined || strid == "") return false;
        qid = strid;
    } else {
        return false;
    }

    clearTimeout(pop.timer);

    pop.timer = setTimeout(function() {
        $(".popups-focus").removeClass("popups-focus");
        $that.addClass("popups-focus");
        pop.resetView("加载中...");
        switch (mode) {
            case "av":
            case "bv": getVideoInfo(qid, mode); break;
            case "au": getAudioInfo(qid); break;
            case "cv": getArticleInfo(qid); break;
            case "live": getLiveInfo(qid); break;
            case "ss":
            case "ep": getBangumiInfo(qid, mode); break;
            case "user": getUserInfo(qid); break;
        }

        pop.move();
        pop.show();
    }, 500)
});

$(document).on("mouseleave", "a:not(#popups a)", function() {
    // console.log("<< mouseleave a");
    let $that = $(this);
    if ($that.hasClass("popups-focus")) {
        clearTimeout(pop.timer);
        pop.timer = setTimeout(function() {
            pop.hide();
            $that.removeClass("popups-focus");
        }, 500)
    } else {
        pop.hide();
        clearTimeout(pop.timer);
    }
});

function getJSONInfo(url) {
    $.getJSON(url,
    function (ajson) {
        console.log(ajson);
    });
}

function setUserOfficialTag(uid) {
    $.getJSON(bapi.get("user", uid),
    function (ajson) {
        if (ajson.code == 0) {
            let otag = ajson.data.official.role;
            let nft = ajson.data.face_nft;
            if (otag != 0) {
                $('#popups .user-group').append(popf.officialTag(otag));
            }
            if (nft == 1) {
                $('#popups .user-group').append(popf.nftTag());
            }
        }
    });
}

function getVideoInfo(value, type) {
    let geturl;
    if (type == "av") {
        geturl = bapi.get("videoAv", value);
    } else {
        geturl = bapi.get("videoBv", value);
    }
    $.getJSON(geturl,
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data;
            pop.resetView(obj.title);
            pop.setSubtitle('<p>'+popf.link(popf.url('www','video/av'+obj.aid), 'av'+obj.aid)+' | '+popf.link(popf.url('www','video/'+obj.bvid), obj.bvid)+'</p>');
            if (obj.redirect_url != undefined) {
                pop.add('<p>（重定向至'+popf.link(obj.redirect_url,'此地址')+'）</p>');
            }
            pop.adds([
                popf.userinfo(obj.owner.mid, obj.owner.name),
                '<p>分区：<span>'+obj.tname+'</span></p>',
                '<p>发布时间：<span>'+pfc.getDateTime(obj.pubdate)+'</span></p>',
                '<p>时长：<span>'+pfc.sec2Time(obj.duration)+'</span></p>',
                '<p>播放：<span>'+obj.stat.view+'</span></p>'
            ]);
            setUserOfficialTag(obj.owner.mid);
            pop.add('<table class="video-stat"></table>');
            $("#popups .video-stat").append('<tr><td>点赞：<span>'+obj.stat.like+'</span></td><td>投币：<span>'+obj.stat.coin+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>弹幕：<span>'+obj.stat.danmaku+'</span></td><td>评论：<span>'+obj.stat.reply+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>收藏：<span>'+obj.stat.favorite+'</span></td><td>分享：<span>'+obj.stat.share+'</span></td></tr>');
            pop.add('<hr>');
            pop.add('<p>'+popf.link('https://www.biliplus.com/video/'+obj.bvid,'BiliPlus')+'</p>');
            pop.add('<p>'+popf.link('https://www.jijidown.com/video/'+obj.bvid,'JiJiDown')+'</p>');
            pop.add('<p><a target="_blank" href="'+obj.pic+'">查看视频封面</a></p>');
            pop.add('<hr>');
            pop.setImage(obj.pic);
            pop.add(popf.desc(obj.desc));
            if (obj.dynamic != "") {
                pop.add('<hr>');
                pop.add(popf.desc(obj.dynamic, "动态"));
            }
        } else {
            getVideoError(ajson.code);
        }
    });
}

function getVideoError(code) {
    switch (code) {
        case -400: return pop.error("请求出错", "视频链接有误，请检查视频链接。", code);
        case -403: return pop.error("权限不足", "该视频可能需要会员观看，或被特殊屏蔽。", code);
        case -404: return pop.error("无视频", "视频已被删除或不存在。", code);
        case 62002: return pop.error("稿件不可见", "视频已被UP主删除、被屏蔽或搬运撞车。", code);
        default: return pop.error("出错啦！", "未能获取视频信息，可能是网络问题，或是视频已被删除。<del>又或者是作者写了个BUG！</del>", code);
    }
}

function getArticleInfo(cvid) {
    $.getJSON(bapi.get("article", cvid),
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data;
            pop.resetView(obj.title);
            pop.setSubtitle('<p><a target="_blank" href="https://www.bilibili.com/read/cv'+cvid+'">cv'+cvid+'</a></p>');
            pop.add(popf.userinfo(obj.mid, obj.author_name));
            setUserOfficialTag(obj.mid);
            pop.add('<p>阅读：<span>'+obj.stats.view+'</span></p>');
            pop.add('<table class="video-stat"></table>');
            $("#popups .video-stat").append('<tr><td>点赞：<span>'+obj.stats.like+'</span></td><td>投币：<span>'+obj.stats.coin+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>收藏：<span>'+obj.stats.favorite+'</span></td><td>分享：<span>'+obj.stats.share+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>评论：<span>'+obj.stats.reply+'</span></td><td>动态转发：<span>'+obj.stats.dynamic+'</span></td></tr>');
            pop.add('<hr>');
            pop.add('<p><a target="_blank" href="'+obj.banner_url+'">查看文章头图</a></p>');
            pop.setImage(obj.banner_url);
        } else {
            pop.error("出错啦！", "未能获取专栏信息，可能是网络问题，或是专栏已被删除。<del>又或者是作者写了个BUG！</del>", ajson.code);
        }
    });
}

function getAudioInfo(auid) {
    $.getJSON(bapi.get("audio", auid),
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data;
            pop.resetView(obj.title);
            pop.setSubtitle('<p>'+popf.link(popf.url("www","audio/au"+auid), "au"+auid)+'</p>');
            pop.add(popf.userinfo(obj.uid, obj.uname));
            setUserOfficialTag(obj.uid);
            pop.adds([
                '<p>发布时间：<span>'+pfc.getDateTime(obj.passtime)+'</span></p>',
                '<p>时长：<span>'+pfc.sec2Time(obj.duration)+'</span></p>',
                '<p>播放：<span>'+obj.statistic.play+'</span></p>'
            ]);
            pop.add('<table class="video-stat"></table>');
            $("#popups .video-stat").append('<tr><td>投币：<span>'+obj.coin_num+'</span></td><td>收藏：<span>'+obj.statistic.collect+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>评论：<span>'+obj.statistic.comment+'</span></td><td>分享：<span>'+obj.statistic.share+'</span></td></tr>');
            pop.add('<hr>');
            pop.add('<p><a target="_blank" href="'+obj.cover+'">查看音频封面</a></p>');
            pop.setImage(obj.cover);
            pop.add('<hr>');
            pop.add(popf.desc(obj.intro));
        } else {
            pop.error("出错啦！", "未能获取音频信息，可能是网络问题，或是音频已被删除。<del>又或者是作者写了个BUG！</del>", ajson.code);
        }
    });
}

function getBangumiInfo(ssid, type) {
    let geturl;
    if (type == "ep") {
        geturl = bapi.get("bangumiEp", ssid);
    } else {
        geturl = bapi.get("bangumiSs", ssid);
    }
    $.getJSON(geturl,
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.result;
            pop.resetView(obj.season_title);
            if (type == "ep") {
                pop.setSubtitle('<p>'+popf.link(popf.url("www","bangumi/play/ep"+ssid), "ep"+ssid)+'</p>');
            } else {
                pop.setSubtitle('<p>'+popf.link(popf.url("www","bangumi/play/ss"+ssid), "ss"+ssid)+'</p>');
            }
            //pop.add(popf.userinfo(obj.uid, obj.uname));
            pop.adds([
                '<p><span>'+obj.new_ep.desc+'</span></p>',
                '<p>类型：<span>'+pop.data.bangumiType[obj.type]+'</span></p>',
                '<p>发布时间：<span>'+obj.publish.pub_time+'</span></p>',
                '<p>总集数：<span>'+(obj.total != -1 ? obj.total : "未知")+'</span></p>',
                '<p>播放：<span>'+obj.stat.views+'</span></p>'
            ]);
            pop.add('<table class="video-stat"></table>');
            $("#popups .video-stat").append('<tr><td>投币：<span>'+obj.stat.coins+'</span></td><td>收藏：<span>'+obj.stat.favorites+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>弹幕：<span>'+obj.stat.danmakus+'</span></td><td>评论：<span>'+obj.stat.reply+'</span></td></tr>');
            $("#popups .video-stat").append('<tr><td>分享：<span>'+obj.stat.share+'</span></td><td></td></tr>');
            pop.add('<hr>');
            pop.add('<p>'+popf.link('https://www.biliplus.com/bangumi/i/'+obj.season_id,'BiliPlus')+'</p>');
            pop.add('<p>'+popf.link(obj.link,'查看剧集简介')+'</p>');
            pop.add('<p>'+popf.link(obj.cover,'查看剧集封面')+'</p>');
            pop.setImage(obj.cover);
            pop.add('<p><a target="_blank" href="https://zh.moegirl.org.cn/index.php?search='+obj.season_title+'">查询萌娘百科</a></p>');
            pop.add('<hr>');
            pop.add(popf.desc(obj.evaluate));
        } else {
            pop.error("出错啦！", "未能获取剧集信息，可能是网络问题，或是剧集已被删除。<del>又或者是作者写了个BUG！</del>", ajson.code);
        }
    });
}

function getLiveInfo(lid) {
    pop.resetView("获取直播间信息...");
    pop.setSubtitle('<p>直播间：'+popf.link(popf.url("live", lid, "user-uid"), lid)+'</p><p>直播间真实ID：<span class="live-room-id">...</span></p>');

    $.getJSON(bapi.get("liveRoom", lid),
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data;
            $("#popups .live-room-id").html(popf.link(popf.url("live", obj.room_id, "user-uid"), obj.room_id));

            $.getJSON(bapi.get("user", obj.uid),
            function (ajson2) {
                if (ajson2.code == 0) {
                    let obj2 = ajson2.data;
                    pop.setTitle(obj2.live_room.title);
                    pop.setImage(obj2.live_room.cover);
                    pop.add('<p><span>'+pop.data.liveStatus[obj2.live_room.liveStatus]+'</span> | <span>'+pop.data.roundStatus[obj2.live_room.roundStatus]+'</span></p>');
                    pop.add('<p>观看人数：<span>'+obj2.live_room.watched_show.num+'</span></p>');
                    pop.add(popf.userinfo(obj2.mid, obj2.name));
                    setUserOfficialTag(obj2.mid);
                    pop.add('<hr>');
                    pop.add('<p><a target="_blank" href="'+obj2.live_room.cover+'">查看直播间封面</a></p>');
                }
            });
        }
    });
}

function getUserInfo(uid) {
    pop.resetView("获取用户信息...");
    pop.setSubtitle('<p>UID：'+popf.link(popf.url("space", uid, "user-uid"), uid)+'</p>');
    pop.add('<p>关注：'+popf.link(popf.url("space", uid+"/fans/follow"), "...", "user-friend")+' | 粉丝：'+popf.link(popf.url("space", uid+"/fans/fans"), "...", "user-fans")+'</p>');

    $.getJSON(bapi.get("user", uid),
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data;
            pop.setTitle(obj.name);
            $("#popups .user-uid").text(obj.mid);
            if (obj.silence == 1) {
                pop.add('<p class="txt-red">账号封禁中</p>');
            }
            if (obj.official.role != 0) {
                pop.add('<p>'+pop.data.officialRoleName[pop.data.officialRole[obj.official.role]]+'-'+pop.data.officialRoleType[obj.official.role]+'：'+obj.official.title+'</p>');
            }
            if (obj.face_nft == 1) {
                pop.add('<p style="color:#C7A0FF;">数字艺术头像</p>');
            }
            pop.add('<p>等级：<span>Lv'+obj.level+'</span></p>');
            pop.add('<hr>');
            pop.add('<p><a target="_blank" href="https://message.bilibili.com/#whisper/mid'+obj.mid+'">私信</a> | <a target="_blank" href="https://space.bilibili.com/'+obj.mid+'/dynamic">动态</a> | <a target="_blank" href="https://space.bilibili.com/'+obj.mid+'/video">投稿</a> | <a target="_blank" href="https://space.bilibili.com/'+obj.mid+'/channel/series">列表</a></p>');
            pop.add('<p><a target="_blank" href="'+obj.face+'">查看头像</a></p>');
            pop.add('<p><a target="_blank" href="'+obj.top_photo+'">查看主页头图</a></p>');
            pop.setImage(obj.face);
            if (obj.live_room.roomStatus == 1) {
                pop.add('<hr>');
                pop.add('<p><span>'+pop.data.liveStatus[obj.live_room.liveStatus]+'</span> | <span>'+pop.data.roundStatus[obj.live_room.roundStatus]+'</span></p>');
                pop.add('<p>直播间ID：'+popf.link(popf.url("live", obj.live_room.roomid, "user-uid"), obj.live_room.roomid)+'</p>');
                pop.add('<p>直播间标题：'+obj.live_room.title+'</p>');
                pop.add('<p>观看人数：<span>'+obj.live_room.watched_show.num+'</span></p>');
                pop.add('<hr>');
                pop.add('<p><a target="_blank" href="'+obj.live_room.cover+'">查看直播间封面</a></p>');
            }
        } else if (ajson.code == -404) {
            pop.setTitle("账号已注销");
        }
    });

    $.getJSON(bapi.get("userCard", uid),
    function (ajson) {
        if (ajson.code == 0) {
            let obj = ajson.data.card;
            $("#popups .user-friend").text(obj.friend);
            $("#popups .user-fans").text(obj.fans);
        }
    });
}

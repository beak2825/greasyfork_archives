// ==UserScript==
// @name         MCBBS Observer
// @namespace    sheep-realms
// @version      1.3.6
// @description  以另一种视角看MCBBS
// @author       Sheep-realms
// @match        *://www.mcbbs.net/home.php*
// @run-at       document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424895/MCBBS%20Observer.user.js
// @updateURL https://update.greasyfork.org/scripts/424895/MCBBS%20Observer.meta.js
// ==/UserScript==

let $ = jQuery;
let getRequest = (variable, url = "") => {
    let query = url ? /\?(.*)/.exec(url)[1] : window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

//获取URL参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//获取启动参数
var observer = getUrlParam("observer");

//判断是否需要启动
if(observer) {
    $('body *').remove();
    $('head link, head style, head script, head meta:not([http-equiv="Content-Type"])').remove();
    $('head title').text("MCBBS Observer");
    window.stop ? window.stop() : document.execCommand("Stop");
} else {
    $('#wp').ready(function () {
        $('#uhd ul.tb').append('<li id="observer-start" style="display:none;"><a href="/home.php?observer=1&action=main">启动 MCBBS Observer</a></li>');
        $('#uhd').dblclick(function () {
            $('#observer-start').attr("style","");
        });
    });
    return;
}

//初始化
var domain = document.domain;
var pageinit = 1;
var action = getUrlParam("action");

var fid = getUrlParam("fid");
var forumName;
var orderby = getUrlParam("orderby");
var filter = getUrlParam("filter");
var typeid = getUrlParam("typeid");

var filtervalue = "";
if (filter == "typeid") {
    filtervalue = "&typeid=" + typeid;
}

if (GM_getValue("obs_forumStar") == undefined) {
    GM_setValue("obs_forumStar", {
        "version": 1,
        "starlist": []
    })
}

//console.log(GM_getValue("obs_forumStar"));
//addForumStar(52, "矿工茶馆", "www.mcbbs.net");

//有点乱，需要整理
(function() {

    $('body').append('<div id="header-box"></div>');
    $('body').append('<div id="content-box"></div>');
    $('body').append('<div id="footer-box"></div>');

    if(action == "main") {
        var forumStarList = GM_getValue("obs_forumStar").starlist.filter(function(a){return a.webSpace==domain});
        forumStarList.sort(function(a,b){return a.index-b.index});
        //console.log(forumStarList);
        $('#header-box').append('<h1 id="obs-title">MCBBS Observer</h1>');
        $('#content-box').append('<p>欢迎使用MCBBS Observer！脚本基于MCBBS移动端API运行。不过众所周知MCBBS的移动端API一团糟，所以如果MCBBS的移动端API出点什么问题，这个脚本就不能用了。</p>');
        $('#content-box').append('<p>该脚本目前尚未完善，几乎没有图形界面，如需使用请自行传参。例如：<a href="/home.php?observer=1&action=threadlist&fid=52">矿工茶馆</a></p>');
        $('#content-box').append('<p>版块收藏功能仍未完善，如有需要请自行编写代码。</p>');
        $('#content-box').append('<table id="threadlist" class=""><tr><th class="index">排序</th><th>收藏版块</th></tr></table>');
        for(var i = 0; i < forumStarList.length; i++) {
            $('#threadlist').append('<tr><td>' + forumStarList[i].index + '</td><td><a href="/home.php?observer=1&action=threadlist&fid=' + forumStarList[i].fid + '">' + forumStarList[i].forumName + '</a></td></tr>');
        }
    } else if(action == "threadlist") {
        $('#header-box').append('<h2 id="forum-name"></h2>');
        $('#header-box').append('<div id="forum-description"></div>');
        $('#header-box').append('<div id="forum-filter"></div>');
        $('#header-box').append('<div id="forum-type"></div>');

        //getThreadList(1);
        var jsonsave = getThreadList(1);

        $('#forum-filter').html('<p><a href="/home.php?observer=1&action=threadlist&fid='+fid+'">默认排序</a> | <a href="/home.php?observer=1&action=threadlist&fid='+fid+'&orderby=dateline">发帖时间</a> | <span id="threadlist-view-switch" class="cursor-pointer">[显示类型:默认]</span></p>');
        $('#content-box').append('<table id="threadlist" class="view-default"><tr><th class="subjuct">标题</th><th class="author">作者</th><th class="dateline">发布时间</th><th class="displayorder">置顶</th><th class="attachment">附件</th><th class="views">查看</th><th class="replies">回复</th><th class="lastpost">最后回复</th><th class="lastpost-author">最后回复作者</th><th class="lastpost-msg">最后回复内容</th><th class="action">操作</th></tr></table>');

        $('#footer-box').append('<div id="cmd-getlestpage" class="cursor-pointer" data-last="2">下一页</div>');
    } else if(action == "edit") {
        var data = getUrlParam("data");
        $('#header-box').append('<h1 id="obs-title">MCBBS Observer Editor</h1>');
        $('#content-box').append('<textarea id="editor-content"></textarea>');
        if(data == "forumStar.json") {
            $('#editor-content').text(formatJson(GM_getValue("obs_forumStar")));
        } else {
            $('#editor-content').text("不存在的数据。请检查参数。");
        }
    } else {
        $('#header-box').append('<h1 id="obs-title">MCBBS Observer Error</h1>');
        $('#content-box').append('<p>请求参数错误：不合法的 action 参数：' + action + '<p>');
    }

    var csslist = "";
    csslist += "* {margin: 0; padding:0;}";
    csslist += "body {background:#FFF; font-size:12px;}";
    csslist += "a {text-decoration:none;}";
    csslist += "h1 {font-size:16px;}";
    csslist += "h2 {font-size:14px;}";
    csslist += "#forum-name {background:#EEE; padding:5px 10px;}";
    csslist += "#forum-description, #forum-filter, #forum-type {padding:5px 10px;}";
    csslist += "#threadlist {width:100%; border-collapse:separate; border-spacing:1px;}";
    csslist += "#threadlist tr:nth-child(odd) {background: #EEE;}";
    csslist += "#threadlist tr:hover {background: #fffce1;}";
    csslist += "#threadlist tr:nth-child(odd):hover {background: #f5f2d0;}";
    csslist += "#threadlist tr td:first-child, #threadlist tr th:first-child {padding-left:10px;}";
    csslist += "#threadlist th {text-align:left;}";
    csslist += "#threadlist td, #threadlist th {padding:5px 10px;}";
    csslist += "#threadlist th.action {width: 38px;}";
    csslist += "#threadlist.view-default .attachment, #threadlist.view-default .displayorder {display:none;}";
    csslist += "#threadlist.view-attribute .views, #threadlist.view-attribute .replies, #threadlist.view-attribute .lastpost, #threadlist.view-attribute .lastpost-author, #threadlist.view-attribute .lastpost-msg {display:none;}";
    csslist += "#threadlist .index {width: 50px}";
    csslist += "#editor-content {margin:10px; width:calc(100vw - 22px); height:calc(100vh - 100px);}";
    csslist += "#cmd-getlestpage {text-align: center;padding: 12px 0;}";
    csslist += ".cursor-pointer {cursor:pointer}";


    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = csslist;
    document.getElementsByTagName("HEAD").item(0).appendChild(style);

})();

//获取帖子列表
function getThreadList(page) {
$.getJSON("/api/mobile/index.php?version=4&module=forumdisplay&fid=" + fid + "&filter=" + filter + filtervalue + "&orderby=" + orderby + "&page=" + page,
function (ajson) {
    if(ajson.Variables.forum.redirect == undefined) {
        if(ajson.Message == undefined) {
            for(var i=0; i<ajson.Variables.forum_threadlist.length; i++) {
                $('#threadlist').append('<tr><td class="subjuct"><a href="/thread-' + ajson.Variables.forum_threadlist[i].tid + '-1-1.html" target="_blank">' + ajson.Variables.forum_threadlist[i].subject + '</a></td><td class="author"><a href="/?' + ajson.Variables.forum_threadlist[i].authorid + '" target="_blank">' + ajson.Variables.forum_threadlist[i].author + '</a></td><td class="dateline"><span title="' + timestampToTime(ajson.Variables.forum_threadlist[i].dbdateline) + '" data-timestamp="' + ajson.Variables.forum_threadlist[i].dbdateline + '">' + ajson.Variables.forum_threadlist[i].dateline + '</span></td><td class="displayorder">' + formatDisplayorder(ajson.Variables.forum_threadlist[i].displayorder) + '</td><td class="attachment">' + formatAttachment(ajson.Variables.forum_threadlist[i].attachment) + '</td><td class="views">' + ajson.Variables.forum_threadlist[i].views + '</td><td class="replies">' + ajson.Variables.forum_threadlist[i].replies + '</td><td class="lastpost"><span title="' + timestampToTime(ajson.Variables.forum_threadlist[i].dbdateline) + '" data-timestamp="' + ajson.Variables.forum_threadlist[i].dblastpost + '">' + ajson.Variables.forum_threadlist[i].lastpost + '</span></td><td class="lastpost-author"><a href="/?' + getLastPostAuthorId(ajson.Variables.forum_threadlist[i]) + '" target="_blank">' + getLastPostAuthor(ajson.Variables.forum_threadlist[i]) + '</a></td><td class="lastpost-msg">' + getLastPost(ajson.Variables.forum_threadlist[i]) + '</td><td class="action">' + getThreadAction(ajson.Variables.forum_threadlist[i]) + '</td></tr>');
            }
        } else {
            $('#threadlist, #cmd-getlestpage').remove();
            $('#content-box').append(ajson.Message.messagestr);
        }
    } else {
        $('#threadlist, #cmd-getlestpage').remove();
        $('#content-box').append('<p>这是一个重定向版块，没有任何内容。</p>');
        $('#content-box').append('<p>重定向地址：' + ajson.Variables.forum.redirect + '</p>');
    }
    if (pageinit == 1) {setHeader(ajson);}
});
}

//添加版块收藏
function addForumStar(fid, fName = forumName, webSpace = domain, index = 0) {
    var obs_forumStar = GM_getValue("obs_forumStar");
    var oldIndex = obs_forumStar.starlist.findIndex(function(a){return a.fid == fid});
    var data = {
        "fid": fid,
        "index": index,
        "forumName": fName,
        "webSpace": webSpace
    };

    if(oldIndex != -1) {
        obs_forumStar.starlist[oldIndex] = data;
    } else {
        obs_forumStar.starlist.push(data);
    }

    if (obs_forumStar != undefined) {GM_setValue("obs_forumStar", obs_forumStar);}
}

//设置版块头部
function setHeader(obj) {
    pageinit = 0;
    forumName = obj.Variables.forum.name;
    $('#forum-name').html(obj.Variables.forum.name + " (fid:" + obj.Variables.forum.fid + ")");
    $('#forum-description').html("版块描述：" + obj.Variables.forum.description);
    for (var val in obj.Variables.threadtypes.types) {
        $('#forum-type').append('<a href="/home.php?observer=1&fid=' + fid + '&orderby=' + orderby + '&filter=typeid&typeid=' + val + '">' + obj.Variables.threadtypes.types[val] + '</a> | ');
    }
}

//获取最后回复元数据
function getLastPostJSON(obj) {
    if(obj.reply == undefined) {
        return "";
    } else {
        if(obj.reply[1] != undefined) {
            if(obj.reply[0].pid > obj.reply[1].pid) {
                return obj.reply[0];
            } else {
                return obj.reply[obj.reply.length-1];
            }
        } else {
            return obj.reply[0];
        }
    }
}

//获取最后回复消息
function getLastPost(obj) {
    var obj2 = getLastPostJSON(obj);
    if(obj2 == "") {
        return "";
    } else {
        return obj2.message;
    }
}

//获取最后回复作者
function getLastPostAuthor(obj) {
    var obj2 = getLastPostJSON(obj);
    if(obj2 == "") {
        return "";
    } else {
        return obj2.author;
    }
}

//获取最后回复作者UID
function getLastPostAuthorId(obj) {
    var obj2 = getLastPostJSON(obj);
    if(obj2 == "") {
        return "";
    } else {
        return obj2.authorid;
    }
}

//获取帖子操作按钮
function getThreadAction(obj) {
    var posturl;
    var objLastPost = getLastPostJSON(obj);
    if(objLastPost == "") {
        posturl = "/forum.php?mod=redirect&tid=" + obj.tid + "&goto=lastpost#lastpost";
    } else {
        posturl = "/forum.php?mod=redirect&goto=findpost&ptid=" + obj.tid + "&pid=" + objLastPost.pid;
    }
    return '<a href="' + posturl + '" target="_blank" title="查看最新回复">查</a> · <a href="/forum.php?mod=post&action=reply&tid=' + obj.tid + '" target="_blank" title="回复主题">论</a>';
}

//格式化附件参数
function formatAttachment(value) {
    switch(value) {
        case "0": return "";
        case "1": return "文件";
        case "2": return "图片";
        default: return value;
    }
}

//格式化置顶参数
function formatDisplayorder(value) {
    switch(value) {
        case "0": return "";
        case "1": return "本版";
        case "2": return "大区";
        case "3": return "全局";
        default: return value;
    }
}

//格式化精华参数
function formatDigest(value) {
    switch(value) {
        case "0": return "";
        case "1": return "精华I";
        case "2": return "精华II";
        case "3": return "精华III";
        default: return value;
    }
}

//格式化特殊参数
function formatSpecial(value) {
    switch(value) {
        case "0": return "";
        case "1": return "投票";
        case "2": return "商品";
        case "3": return "悬赏";
        case "4": return "活动";
        case "5": return "辩论";
        case "127": return "插件";
        default: return value;
    }
}

//时间戳转换
function timestampToTime(timestamp) {
    var date = new Date();
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());

    return Y+M+D+h+m+s;
}

//绑定“下一页”事件
$('#cmd-getlestpage').click(function () {
    var lastpage = $('#cmd-getlestpage').data("last");
    getThreadList(lastpage);
    $('#cmd-getlestpage').data("last",lastpage+1);
});

//绑定“显示类型”事件
// -- 逻辑警告：此方法会删除目标的所有class --
$('#threadlist-view-switch').click(function () {
    if($('#threadlist').hasClass('view-default')) {
        $('#threadlist').attr("class","");
        $('#threadlist').addClass('view-attribute');
        $('#threadlist-view-switch').text("[显示类型:详细属性]");
    } else {
        $('#threadlist').attr("class","");
        $('#threadlist').addClass('view-default');
        $('#threadlist-view-switch').text("[显示类型:默认]");
    }
});

//格式化代码函数
function formatJson (json, options) {
    var reg = null,
            formatted = '',
            pad = 0,
            PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
        var i = 0,
                indent = 0,
                padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
            indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
            if (pad !== 0) {
                pad -= 1;
            }
        } else {
            indent = 0;
        }

        for (i = 0; i < pad; i++) {
            padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    }
    );
    return formatted;
};
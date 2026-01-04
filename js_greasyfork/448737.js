// ==UserScript==
// @name         哔哩哔哩PWA
// @namespace    https://ez118.github.io/
// @version      1.3.0
// @description  立刻将哔哩哔哩网页变为轻量的、简洁的软件界面
// @author       ZZY_WISU
// @match        https://www.bilibili.com/*
// @match        https://m.bilibili.com/*
// @match        https://bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=114514
// @license      GNU GPLv3
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448737/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9PWA.user.js
// @updateURL https://update.greasyfork.org/scripts/448737/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9PWA.meta.js
// ==/UserScript==


/* DLG.JS */
/* 自定义Toast */
function showToast(message, duration) {
    duration = duration ? duration : "3000";
    var toast = $('#toast_container');
    toast.text(message);
    toast.fadeIn(200);
    setTimeout(function () {
        toast.fadeOut(200);
    }, duration);
}

/* 悬浮搜索框 */
function showSearchBox(){
	$(".searchbox_container").fadeIn(200)
	$("#searchbox_searchInput").val("");
    $("#searchbox_searchInput").focus();
}
function closeSearchBox(){
	$(".searchbox_container").fadeOut();
}

/* HOME.JS */
var currentTab = "home";
var currentUid = "114514";
var rcmdCnt = 1;

function getSearchResult(wd) {
    window.open('https://search.bilibili.com/all?keyword=' + encodeURI(wd));
}

function getRecommendedVideos() {
    $("#item_container").html("");
    $("#dynamic_loader").show();
    for (let i = 1; i <= 2; i++) {
        $.get("https://api.bilibili.com/x/web-interface/wbi/index/top/feed/rcmd?web_location=1430650&y_num=5&fresh_type=3&feed_version=V8&fresh_idx_1h=1&fetch_row=1&fresh_idx=" + rcmdCnt + "&brush=0&homepage_ver=1&ps=30&last_y_num=5", function (tjlist) {
            var WebList = "";
            for (var i = 0; i < tjlist.data.item.length; i++) {
                WebList += `<div class='dynamic_singlebox'>
                                <a href="#bvid_` + tjlist.data.item[i].bvid + `">
                                    <img src='` + tjlist.data.item[i].pic + `@412w_232h_1c.webp'><br>
                                    <div class="dynamic_singlebox_vt">` + tjlist.data.item[i].title + `</div>
                                </a>
                                <a href="#uid_` + tjlist.data.item[i].owner.mid + `">
                                    <div class="dynamic_singlebox_un">🔘&nbsp;` + tjlist.data.item[i].owner.name + `</div>
                                </a>
                            </div>`;
            }
            $("#item_container").append(WebList);
            $("#dynamic_loader").hide();

            rcmdCnt += 1;
        });
    }
}

function getHotVideos() {
    $("#item_container").html("");
    $("#dynamic_loader").show();
    $.get("https://api.bilibili.com/x/web-interface/popular?ps=40&pn=1", function (tjlist) {
        var WebList = "";
        for (var i = 0; i < tjlist.data.list.length; i++) {
            var card = tjlist.data.list[i];
            var tooltipText = '- 点赞数量: ' + card.stat.like + '\n- 视频简介: ' + (card.desc ? card.desc : "无简介") + (card.rcmd_reason.content ? ("\n- 推荐原因: " + card.rcmd_reason.content) : "");
            WebList += `<div class='wide_singlebox' title='` + tooltipText + `'>
                            <a href="#bvid_` + card.bvid + `">
                                <img src='` + card.pic + `@412w_232h_1c.webp'><br>
                            </a>
                            <div height="100%">
                                <a href="#bvid_` + card.bvid + `">
                                    <div class="wide_singlebox_vt">` + card.title + `</div>
                                </a>
                                <a href="#uid_` + card.owner.mid + `">
                                    <div class="wide_singlebox_un">🔘&nbsp;` + card.owner.name + `</div>
                                </a>
                            </div>
                        </div>`;
        }
        $("#item_container").append(WebList);
        $("#dynamic_loader").hide();
    });
}

function routeCtrl(isOnload) {
    var data = window.location.hash.substring(1);
    if (data.includes("bvid")) {
        /* 视频播放bvid */
        openPlayer({
            bvid: data.split("_")[1],
            refreshOnly: data.includes("refreshonly") ? "watch_later" : null,
            videoList: data.includes("watchlater") ? "watch_later" : null
        });
    } else if (data.includes("aid")) {
        /* 视频播放aid */
        openPlayer({
            aid: data.split("_")[1],
            refreshOnly: data.includes("refreshonly") ? "watch_later" : null,
            videoList: data.includes("watchlater") ? "watch_later" : null
        });
    } else if (data[0] == "n") {
        /* 导航栏 */
        let tab = data.split("_")[1];
        if (tab == "home") { getRecommendedVideos(); } else if (tab == "hot") { getHotVideos(); } else if (tab == "search") { showSearchBox(); }
        currentTab = tab;
    } else {
        getRecommendedVideos();
    }

    if (isOnload == true && data[0] != "n") {
        getRecommendedVideos();
    }
}


/* PLAYER.JS */
var bvidPlayingNow = ""; /* 正在播放的bvid */
var cidPlayingNow = "";
var player_danmuList = []; /* 弹幕列表 */
var player_danmuCnt = 0; /* 弹幕数量 */
var player_advancedDanmu = false; /* 高级弹幕显示模式 */
var player_highQuality = 0; /* 视频高画质Flag,1为开启,0为关闭 */

function xml2json(xml) {
    /* xml转json */
    var obj = {};
    if (xml.nodeType == 1) {
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {
        obj = xml.nodeValue;
    }
    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = xml2json(item);
            } else {
                if (typeof (obj[nodeName].length) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(xml2json(item));
            }
        }
    }
    return obj;
}

function parseComments(comments) {
    /* 解析评论 */
    let result = '';

    comments.forEach(comment => {
        const { member, content, replies, ctime } = comment;
        const timeString = new Date(ctime * 1000).toLocaleString();

        result += `<div class="reply"><b>🔘&nbsp;${member.uname}</b><br>`;
        result += `<div class="content">${content.message}</div>`;
        result += `<i>时间：${timeString}</i></div><hr>`;

        if (replies && replies.length > 0) {
            result += `<div class="moreReply">回复：<br>`;
            result += parseComments(replies);
            result += `</div>`;
        }
    });

    return result;
}

function getDanmu(cid) {
    /* 获取弹幕 */
    $.get("https://comment.bilibili.com/" + cid + ".xml", function (s) {
        var cInfo = xml2json(s).i.d;
        var newInfo = [];
        for (let i = 0; i < cInfo.length; i++) {
            try {
                newInfo.push({ "text": cInfo[i]["#text"], "time": parseFloat(cInfo[i]["@attributes"]["p"].split(",")[0]) });
            } catch (e) {
                console.log("弹幕装填出错（解析时）")
            }
        }
        player_danmuList = newInfo.sort(function (x, y) {
            /* 弹幕排序方式 */
            return x["time"] - y["time"];
        });
    });
}

function showDanmu(content) {
    /* 装填高级弹幕 */
    var containerWidth = $("#player_container").innerWidth() - 380;
    var containerHeight = $("#player_container").innerHeight() - 20;
    var pageH = parseInt(Math.random() * containerHeight);
    var newSpan = $("<div class='player_danmuText'></span>");
    newSpan.text(content);

    newSpan.appendTo("#player_scrComment");

    newSpan.css("left", (containerWidth - newSpan.innerWidth() + 20));
    newSpan.css("top", pageH);
    //弹幕动画
    newSpan.animate({ "left": -500 }, 10000, "linear", function () {
        $(this).remove();
    });
}

function loadVideoSource(bvid, cid) {
    /* 加载视频源 */
    $.get("https://api.bilibili.com/x/player/playurl?type=mp4&platform=html5&bvid=" + bvid + "&cid=" + cid + "&qn=64&high_quality=" + player_highQuality, function (result) {
        /* 获取视频播放源 */
        var vidUrl = result.data.durl[0].url;
        $("#player_videoContainer").attr("src", vidUrl);
        bvidPlayingNow = bvid;
        cidPlayingNow = cid;
    });
}

function openPlayer(option) {
    /* 显示播放器并展示指定视频 */

    /* 视频ID */
    if (option.bvid) {
        var urlStr = "bvid=" + option.bvid;
    } else if (option.aid) {
        urlStr = "aid=" + option.aid;
    } else {
        console.log("[ERROR] 播放器参数错误：缺少一个可用的bvid或aid");
        showToast("播放器参数错误");
        return;
    }

    $("#player_container").fadeIn(200);

    /* 视频详情 */
    $.get("https://api.bilibili.com/x/web-interface/view?" + urlStr, function (VideoInfo) {
        /* 获取视频信息 */
        var cid = VideoInfo["data"]["pages"][0]["cid"];
        var bvid = VideoInfo["data"]["bvid"];
        var aid = VideoInfo["data"]["aid"];
        var desc = VideoInfo["data"]["desc"] || "-";

        $("#player_title").html(VideoInfo["data"]["title"]);
        $("#player_descArea").html("<b style='font-size:18px;'>[详情]</b><br>" + desc);

        getDanmu(cid); /* 获取弹幕 */

        loadVideoSource(bvid, cid); /* 获取视频源 */

        $.get("https://api.bilibili.com/x/v2/reply?jsonp=jsonp&pn=1&type=1&sort=2&oid=" + aid, function (ReplyInfo) {
            /* 获取评论 */
            var textAll = parseComments(ReplyInfo.data.replies);
            $("#player_descArea").append("<hr><b style='font-size:18px;'>[评论]</b><br>" + textAll);
        });
    });

    if (option.refreshOnly) { return; }

    /* 侧边栏列表 */

    /* 如果是从普通视频页面进入的话，侧边栏显示推荐视频 */
    $.get("https://api.bilibili.com/x/web-interface/archive/related?" + urlStr, function (res) {
        var VidList = "";
        res.data.forEach((item, index) => {
            VidList += `<div class='dynamic_singlebox'>
						<a href="#bvid_` + item.bvid + `">
							<img src='` + item.pic + `@412w_232h_1c.webp'><br>
							<div class="dynamic_singlebox_vt">` + item.title + `</div>
						</a>
						<a href="#uid_` + item.owner.mid + `">
							<div class="dynamic_singlebox_un">🔘&nbsp;` + item.owner.name + `</div>
						</a>
					</div>`
        })
        $("#player_videoList").html(VidList);
    });
}

function closePlayer() {
    /* 关闭播放器 */
    $("#player_container").fadeOut(150);
    $("#player_videoContainer").attr("src", "");
    player_danmuList = [];
    player_danmuCnt = 0;
}



function isFirstPage() {
    let url = window.location.href;
    let a = url.replace(".com/", ".com").split("/");
    return (a.length == 3 && url.includes("bilibili.com"));
}

(function () {
    'use strict';

    if (!isFirstPage()) { return; }

    document.head.innerHTML = `
        <meta http-equiv="Content-Type"content="text/html; charset=utf-8"><meta name="viewport"content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0"><title>哔哩哔哩PWA</title><link rel="stylesheet"type="text/css"href="https://fonts.googleapis.com/icon?family=Material+Icons">
    `;

    document.body.innerHTML = `
        <div class="sidenavBar"align="center"><a href="#nav_search"><div class="sidenavItem"><i class="material-icons">search_rounded</i></div></a><a href="#nav_home"><div class="sidenavItem"><i class="material-icons">home_rounded</i></div></a><a href="#nav_hot"><div class="sidenavItem"><i class="material-icons">whatshot_rounded</i></div></a></div><div id="RefreshBtn"title="刷新"><i class="material-icons">refresh_rounded</i></div><i id="dynamic_loader"style="display:block;"class="material-icons">hourglass_empty_rounded</i><div id="item_container"></div><div id="player_container"style="display:none;"><table style="width:100%; height:100%;"><tr height="40px"><td align="left"><b id="player_title">[视频标题]</b></td><td align="right"width="380px"><i class="material-icons"style="width:30px;cursor:pointer;"id="player_highQnBtn"title="切换到高画质">high_quality_rounded</i><i class="material-icons"style="width:30px;cursor:pointer;"id="player_pipBtn"title="画中画">picture_in_picture_rounded</i><i class="material-icons"style="width:30px;cursor:pointer;"id="player_scrSwitchBtn"title="切换弹幕模式">notes_rounded</i><i class="material-icons"style="width:35px;cursor:pointer;"id="player_openNewBtn"title="打开原网页">open_in_new_rounded</i><i class="material-icons"style="width:30px;cursor:pointer;"id="player_closeBtn"title="关闭播放器">close_rounded</i></td></tr><tr><td align="center"><video src=""id="player_videoContainer"controls></video></td><td align="left"style="border-left:1px solid #666; vertical-align:top;"width="380px"><div class="player_sidebarTabs"><p id="player_sidebarTab_1"class="player_sidebarTab_sel">详情&amp;评论</p><p id="player_sidebarTab_2"class="player_sidebarTab">相关推荐</p></div><div id="player_descArea">暂无</div><div id="player_videoList"style="display:none;">无视频</div></td></tr></table><div id="player_scrComment"></div></div><div class="searchbox_container"style="display:none;"><input type="text"class="searchInput"id="searchbox_searchInput"placeholder="回车/Enter开始搜索"><i class="material-icons searchClose"id="searchbox_searchClose"title="关闭搜索框">close_rounded</i></div><div id="toast_container"></div>
    `;

    GM_addStyle(`
        img{-webkit-user-drag:none}a{text-decoration:none;color:#FFF}body{background-color:#17181a;color:#FFF;user-select:none;overflow-y:auto;height:100%;width:100%;margin:0px}html{height:100%;width:100%}#item_container{width:calc(100% - 85px);margin-left:85px;margin-top:10px}.dynamic_singlebox{height:220px;width:250px;font-size:15px;float:left;background:#18181c;overflow:hidden;border-radius:10px;margin:8px;padding:5px;transition:all 0.2s;cursor:pointer;z-index:1}.dynamic_singlebox:hover{background:#3b3b3b}.dynamic_singlebox_un{color:#848484;font-size:12px;position:relative;top:0px;width:100%;overflow:hidden}.dynamic_singlebox_vt{color:#FFFFFF;width:100%;height:60px;overflow:hidden;word-wrap:break-word;word-break:normal}.dynamic_singlebox img{width:100%;border-radius:8px}.wide_singlebox{display:flex;width:calc(33% - 40px);height:120px;margin-left:15px;margin-top:15px;float:left;background:#18181c;overflow:hidden;border-radius:10px;padding:10px;transition:all 0.2s;cursor:pointer;z-index:1;border:1px solid #3b3b3b}.wide_singlebox:hover{background:#3b3b3b}.wide_singlebox img{height:100%;border-radius:8px}.wide_singlebox_un{color:#848484;font-size:12px;position:relative;top:0px;width:100%;overflow:hidden;margin-left:8px}.wide_singlebox_vt{color:#FFFFFF;width:99%;height:100px;overflow:hidden;font-size:15px;margin-left:8px}.wide_singlebox_vt .keyword{color:#00a1d6}#dynamic_loader{margin-left:calc(50% - 50px);margin-top:50px;font-size:40px}#RefreshBtn{position:fixed;left:22px;top:430px;z-index:101;height:24px;width:24px;padding:12px;border-radius:50px;border:1px solid #383942;background:#1e2022;color:#FFF;cursor:pointer;display:flex;justify-content:center;align-items:center;transition:all .1s;transform-origin:center center;overflow:hidden}#RefreshBtn:hover{color:#00a1d6;background:#FFF;border-color:#FFF;box-shadow:0 0 15px rgba(255,255,255,.6)}#RefreshBtn .material-icons{width:24px;margin-top:1px}.sidenavBar{display:flex;flex-direction:column;background:#1e2022;color:#FFF;padding:1px;border:1px solid #383942;width:60px;height:fit-content;position:fixed;left:15px;top:235px;z-index:1000;border-radius:50px}.sidenavItem{margin:6px;width:24px;height:24px;background:#1b1c22;padding:12px;cursor:pointer;border-radius:40px;transition:all .1s;display:flex;justify-content:center;align-items:center;overflow:hidden;transform-origin:center center;box-shadow:0 10px 15px #00000038,0 4px 6px #00000029}.sidenavItem:hover{color:#00a1d6;transform:scale(1.1,1.1);box-shadow:0 0 20px rgba(255,255,255,.7);background:#FFF}.sidenavItem .material-icons{width:24px}.searchbox_container{position:fixed;top:0px;left:0px;width:100vw;height:100vh;z-index:105;background:rgba(0,0,0,0.6)}.searchbox_container .searchInput{padding:15px 25px;outline:none;font-size:16px;border-radius:30px;color:#FFF;background:#1e2022;position:absolute;top:70px;left:50vw;transform:translateX(-50%);width:400px;border:1px solid #383942;box-shadow:0 10px 18px #00000038,0 6px 8px #00000029;transition:all .3s}.searchbox_container .searchInput:focus{border:1px solid #51515b}.searchbox_container .searchClose{position:absolute;top:84px;left:calc(50vw + 187px);color:#FFF;cursor:pointer;width:24px}#player_container{position:fixed;top:0px;left:92px;z-index:103;width:calc(100vw - 103px);height:100vh;background:#1e2022;border-radius:20px 0px 0px 20px}#player_videoContainer{max-width:100%;outline:none;height:calc(100% - 10px);border:none;background:#000}#player_title{margin-left:15px;font-size:18px}#player_descArea{user-select:text;word-wrap:break-word;word-break:break-all;height:100%;font-size:16px;color:#DDD;overflow-y:auto}#player_descArea hr{margin:1px;color:#888;border:none;border-bottom:1px solid #848484}#player_descArea .moreReply{padding:5px;margin:10px;border:1px dashed #646464;border-radius:8px}#player_descArea .reply{margin-bottom:5px}#player_descArea .reply .content{color:#EEE;margin-left:15px}#player_descArea .reply i{color:#888;margin-left:20px}#player_videoList{user-select:none;word-wrap:break-word;word-break:break-all;height:100%;font-size:16px;color:#DDD;overflow-y:auto}#player_scrComment{width:80%;position:fixed;top:50px;left:85px;z-index:104;font-size:16px;color:#EEE}.player_danmuText{width:fit-content;max-width:500px;font-size:18px;font-weight:bold;opacity:0.8;z-index:104;position:fixed;color:#EEEEEE;text-shadow:0 0 2px #000}.player_sidebarTabs{display:flex;flex-direction:row;overflow:hidden;height:fit-content;margin-bottom:10px;margin-top:10px}.player_sidebarTabs .player_sidebarTab_sel{padding:5px 8px;border-bottom:4px solid #00a1d6;font-size:15px;margin:8px 5px 0px 0px;cursor:pointer}.player_sidebarTabs .player_sidebarTab{padding:5px 8px;border-bottom:4px solid #333;font-size:15px;margin:8px 5px 0px 0px;cursor:pointer}#toast_container{display:none;position:fixed;bottom:40px;left:50%;transform:translateX(-50%);background-color:#333;color:#fff;padding:8px 20px;border-radius:5px;z-index:9999}
    `);



    /* HOME.JS */
    routeCtrl(true);

    window.addEventListener('popstate', function (event) {
        routeCtrl();
    });

    $("#RefreshBtn").click(function () {
        /* 刷新 */
        if (currentTab == "home") { getRecommendedVideos(); } else if (currentTab == "hot") { getHotVideos(); }
    });


    /* PLAYER.JS */

    /* 按钮事件监听 */
    $("#player_openNewBtn").click(function () {
        window.open("https://www.bilibili.com/video/" + bvidPlayingNow); /* 在新标签页打开 */
    });
    $("#player_closeBtn").click(function () {
        closePlayer(); /* 关闭播放器 */
    });
    $("#player_scrSwitchBtn").click(function () {
        player_advancedDanmu = !player_advancedDanmu; /* 切换弹幕模式 */
        showToast("弹幕模式已切换，当前模式：" + (player_advancedDanmu ? "全屏滑动弹幕模式" : "简单弹幕模式"));
    });
    $("#player_pipBtn").click(function () {
        var pip = $("#player_videoContainer")[0].requestPictureInPicture(); /* 切换画中画 */
        showToast("画中画", 1000);
    });
    $("#player_highQnBtn").click(function () {
        /* 切换高画质 */
        if (player_highQuality == 1) {
            player_highQuality = 0;
            showToast("已切换为普通画质", 5000);
        } else {
            player_highQuality = 1;
            showToast("已切换为高画质", 5000);
        }
        loadVideoSource(bvidPlayingNow, cidPlayingNow);
    });


    /* 侧边栏标签切换 */
    $("#player_sidebarTab_1").click(function () {
        $("#player_descArea").show();
        $("#player_videoList").hide();
        $("#player_sidebarTab_1").attr("class", 'player_sidebarTab_sel');
        $("#player_sidebarTab_2").attr("class", 'player_sidebarTab');
    });
    $("#player_sidebarTab_2").click(function () {
        $("#player_descArea").hide();
        $("#player_videoList").show();

        $("#player_sidebarTab_1").attr("class", 'player_sidebarTab');
        $("#player_sidebarTab_2").attr("class", 'player_sidebarTab_sel');
    });


    /* 弹幕输出 */
    setInterval(function () {
        if (!player_danmuList || player_danmuList.length == 0 || player_danmuList.length <= player_danmuCnt) { return; }
        try {
            if (player_danmuList[player_danmuCnt]["time"] <= $("#player_videoContainer")[0].currentTime) {
                if (player_advancedDanmu) {
                    showDanmu(player_danmuList[player_danmuCnt]["text"]);
                } else {
                    $("#player_scrComment").html("<b>「弹幕」</b>" + player_danmuList[player_danmuCnt]["text"]);
                }
                player_danmuCnt += 1;
            }
        } catch (e) { console.log("弹幕装填出错（显示时）" + e) }
    }, 200);

    (function () {
        /* 视频播放完毕事件 */
        $("#player_videoContainer").bind('ended', function () {
            $("#player_videoContainer")[0].currentTime = 0;
            player_danmuCnt = 0;
            showToast("视频播放完毕", 1000);
        });
    })();


    /* DLG.JS */
    $("#searchbox_searchInput").keydown(function (e) {
        if (e.keyCode  == 13) {
            getSearchResult($(this).val());
            closeSearchBox();
        }
    });

    $('.searchbox_container').click(function (event) {
		/* 点击搜索框之外，自动关闭搜索框 */
		var target = $(event.target);
		if (!target.is('#searchbox_searchInput')) {
			closeSearchBox();
		}
	});

    $(document).keydown(function (event) {
        /* 快捷键: ctrl+Q快速关闭窗口 */
        if (event.ctrlKey && event.key === 'q') {
            event.preventDefault();

            var playerHidden = $("#player_container").is(":hidden");
            var searchHidden = $(".searchbox_container").is(":hidden");

            if (!searchHidden) {
				closeSearchBox();
			} else if (!playerHidden) {
                closePlayer();
            } else {
				closePlayer();
			}

            return false;
        }
    });
})();
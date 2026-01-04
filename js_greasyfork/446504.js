// ==UserScript==
// @name         百度网盘视频真实链接获取 推荐移动端配合Alook使用
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  获取百度网盘视频真实链接 提供按钮跳转
// @author       杰瑞雾里
// @match        https://pan.baidu.com/s/*
// @match        https://pan.baidu.com/play/video*
// @match        https://pan.baidu.com/mbox/streampage*
// @icon         https://nd-static.bdstatic.com/business-static/pan-center/images/vipIcon/user-level2-middle_4fd9480.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.1.1/layer.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446504/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%20%E6%8E%A8%E8%8D%90%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%85%8D%E5%90%88Alook%E4%BD%BF%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/446504/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E7%9C%9F%E5%AE%9E%E9%93%BE%E6%8E%A5%E8%8E%B7%E5%8F%96%20%E6%8E%A8%E8%8D%90%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%85%8D%E5%90%88Alook%E4%BD%BF%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var obj = {
        video_page: {
            info: [],
            quality: [],
            adToken: "",
            hasMemoryDisplay: false
        }
    };

    obj.fetchVideoInfoHomePage = function (callback) {
        var instanceForSystem = obj.require("system-core:context/context.js").instanceForSystem
            , router = instanceForSystem.router
            , uk = instanceForSystem.locals.get("uk")
            , path = router.query.get("path");

        var target = JSON.stringify([path]);

        $.ajax({
            url: "/api/filemetas",
            data: {
                target: target,
                dlink: 1
            },
            success: function (i) {

                if (i && 0 === i.errno && i.info && i.info[0]) {
                    obj.video_page.info = i.info;
                    callback && callback(i.info[0]);
                }
                else {
                    obj.msg("视频加载失败，请刷新页面后重试", "failure");
                    callback && callback("");
                }
            },
            error: function (i) {
                obj.msg("视频加载失败，请刷新页面后重试", "failure");
                callback && callback("");
            }
        });
    };


	obj.playVideoHomePage = function () {
		obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
            var requestUrl = options.url;
            if (requestUrl.indexOf("/api/categorylist") >= 0) {
            }
            else if (requestUrl.indexOf("/api/filemetas") >= 0) {
                var response = xhr.responseJSON;
                if (response && response.info) {
                    obj.startObj((obj) => {
                        var [ file ] = obj.video_page.info = response.info, vip = obj.getVip();
                        function getUrl (i) {
                            if (i.includes(1080)) vip || (i = i.replace(1080, 720));
                            return location.protocol + "//" + location.host + "/api/streaming?path=" + encodeURIComponent(file.path) + "&app_id=250528&clienttype=0&type=" + i + "&vip=" + vip + "&jsToken=" + jsToken;
                        }
                        obj.getAdToken(getUrl("M3U8_AUTO_480"), function () {
                            obj.addQuality(getUrl, file.resolution);
                            obj.useDPlayer();
                        });
                    });
                }
            }
        });
    };

    obj.playVideoSharePage = function () {
        locals.get("file_list", "sign", "timestamp", "share_uk", "shareid", function(file_list, sign, timestamp, share_uk, shareid) {
            if (file_list.length > 1 || file_list[0].mediaType != "video") {
                obj.storageFileListSharePage();
                obj.fileForcePreviewSharePage();
                return;
            }
            obj.startObj((obj) => { obj.video_page.info = file_list });
            var file = file_list[0], resolution = file.resolution, fid = file.fs_id, vip = obj.getVip();
            function getUrl(i) {
                return location.protocol + "//" + location.host + "/share/streaming?channel=chunlei&uk=" + share_uk + "&fid=" + fid + "&sign=" + sign + "&timestamp=" + timestamp + "&shareid=" + shareid + "&type=" + i + "&vip=" + vip + "&jsToken=" + jsToken;
            }
            obj.getAdToken(getUrl("M3U8_AUTO_480"), function () {
                obj.addQuality(getUrl, resolution);
                obj.useDPlayer();
            });
        });
    };

    obj.playVideoStreamPage = function () {
        obj.getJquery()(document).ajaxComplete(function (event, xhr, options) {
            var requestUrl = options.url;
            if (requestUrl.indexOf("/mbox/msg/mediainfo") >= 0) {
                var response = xhr.responseJSON;
                if (response && response.info) {
                    obj.video_page.adToken = response.adToken;
                    var getParam = obj.require("base:widget/tools/service/tools.url.js").getParam;
                    var file = {
                        from_uk: getParam("from_uk"),
                        to: getParam("to"),
                        fs_id: getParam("fs_id"),
                        name: getParam("name") || "",
                        type: getParam("type"),
                        md5: getParam("md5"),
                        msg_id: getParam("msg_id"),
                        path: decodeURIComponent(decodeURIComponent(getParam("path")))
                    };
                    obj.startObj((obj) => { obj.video_page.info = [ file ]});
                    function getUrl (i) {
                        return location.protocol + "//" + location.host + "/mbox/msg/streaming?from_uk=" + file.from_uk + "&to=" + file.to + "&msg_id=" + file.msg_id + "&fs_id=" + file.fs_id + "&type=" + file.type + "&stream_type=" + i;
                    }
                    obj.getAdToken(getUrl("M3U8_AUTO_480"), function () {
                        obj.addQuality(getUrl, response.info.resolution);
                        obj.useDPlayer();
                    });
                }
            }
        });
    };

	obj.getJquery = function () {
        return obj.require("base:widget/libs/jquerypacket.js");
    };

    obj.getAdToken = function (url, callback) {
        $.ajax({
            url: url,
        }).done(function (n) {
            if (133 === n.errno && 0 !== n.adTime) {
                obj.video_page.adToken = n.adToken;
            }
            callback && callback();
        }).fail(function (n) {
            var t = $.parseJSON(n.responseText);
            if (t && 133 === t.errno && 0 !== t.adTime) {
                obj.video_page.adToken = t.adToken;
                callback && callback();
            }
            else {
                console.warn("尝试再次获取 adToken");
                setTimeout(function () { obj.getAdToken(url, callback); }, 500);
            }
        });
    };

    obj.addQuality = function (getUrl, resolution) {
        var r = {
            1080: "超清 1080P",
            720: "高清 720P",
            480: "流畅 480P",
            360: "省流 360P"
        };
        var freeList = obj.freeList(resolution);
        freeList.forEach(function (a, index) {
            obj.video_page.quality.push({
                name: r[a],
                url: getUrl("M3U8_AUTO_" + a) + "&isplayer=1&check_blue=1&adToken=" + encodeURIComponent(obj.video_page.adToken ? obj.video_page.adToken : ""),
                type: "hls"
            });
        });
        console.log(obj.video_page);
    };

    obj.freeList = function (e) {
        e = e || "";
        var t = [480, 360]
            , a = e.match(/width:(\d+),height:(\d+)/) || ["", "", ""]
            , i = +a[1] * +a[2];
        return i ? (i > 409920 && t.unshift(720), i > 921600 && t.unshift(1080), t) : t;
    };



    obj.require = function (name) {
        return require(name);
    };

	obj.startObj = function(callback) {
        callback && callback(obj);
    };

    obj.getVip = function () {
        return obj.require("base:widget/vip/vip.js").getVipValue();
    };

    obj.msg = function (msg, mode) {
        obj.require("system-core:system/uiService/tip/tip.js").show({ vipType: "svip", mode: mode || "success", msg: msg });
    };

    obj.useDPlayer = function () {
        $("#video-toolbar")[0].style.height = "50px";
        obj.video_page.quality.forEach(function (element) {
            var a = '<a class="g-button " target="_blank" href="' + element.url + '"><span class="g-button-right"><em class="icon icon-share"></em><span class="text" style="width: auto;">' + element.name + '</span></span></a>';
            $(".video-toolbar-buttonbox").append(a);
        }
        );
    };
    obj.run = function () {
        var url = location.href;
        if (url.indexOf(".baidu.com/s/") > 0) {
            $(".ad-single-bottom").remove();
            var b = '<div id="video-toolbar" class="video-toolbar clearfix"  style="white-space: nowrap; position: relative; height: 50px; margin-top:20px;"><div class="video-toolbar-buttonbox" node-type="undefined" style="position:absolute;top:0;line-height:normal;padding-top:0px;"></div>';
            $(".video-content").prepend(b);
            obj.playVideoSharePage();
        }
        else if (url.indexOf(".baidu.com/play/video#/video") > 0) {
            $(".privilege-box").remove();
            $(".button-box-mark").remove();
            $(".video-toolbar-buttonbox").empty();
            obj.fetchVideoInfoHomePage(function (info) {
                if (info) {
                    obj.playVideoHomePage();
                }
            });
            window.onhashchange = function (e) {
                location.reload();
            };
        }
        else if (url.indexOf(".baidu.com/mbox/streampage") > 0) {
            var c = '<div id="video-toolbar" class="video-toolbar clearfix"  style="white-space: nowrap; position: relative; height: 50px; margin-top:20px;"><div class="video-toolbar-buttonbox" node-type="undefined" style="position:absolute;top:0;line-height:normal;padding-top:0px;"></div>';
            $(".video-content").append(c);
            obj.playVideoStreamPage();
        }
    }();
})();


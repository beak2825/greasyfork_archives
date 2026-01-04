// ==UserScript==
// @name         B站稍后再看归位
// @namespace    https://greasyfork.org/zh-CN/users/412840-newell-gabe-l
// @version      1.3.6
// @description  它进收藏啦，被我搞出来啦，有什么好说哒
// @author       Pronax
// @match        *://*.bilibili.com/*
// @exclude      *://live.bilibili.com/*
// @require      https://lib.baomitu.com/jquery/1.12.4/jquery.min.js
// @noframes
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/423563/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E5%BD%92%E4%BD%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/423563/B%E7%AB%99%E7%A8%8D%E5%90%8E%E5%86%8D%E7%9C%8B%E5%BD%92%E4%BD%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 进度条css
    GM_addStyle("#van-popover-watch-later .wl-progress-bar{width:0;height:3px;background-color:#ff74a5;position:absolute;bottom:-2px}");
    // 时长css
    GM_addStyle("#van-popover-watch-later .duration-tag{left: 6px;position: absolute;background: rgba(0, 0, 0, 0.5);bottom: 4px;font-size: 12px;border-radius: 1px;padding: 0px 2px;color: #fff;}");
    // 删除图标css
    GM_addStyle("#van-popover-watch-later .watchlist-item-img-del{display:none;position:absolute;right:2px;bottom:4px;padding:2px;width:20px;height:20px;-webkit-box-sizing:border-box;box-sizing:border-box;background:rgba(0,0,0,.5);border-radius:2px;cursor:pointer}#van-popover-watch-later .watchlist-item-img-del:hover{background:#000}");
    // 视频信息css
    GM_addStyle("#van-popover-watch-later .line-2{min-height:42px;}");
    // bilibili自带css
    GM_addStyle("#van-popover-watch-later{width:370px;transform-origin:center top;z-index:2009;position:absolute;top:40px!important;left:-270%;display:none;box-shadow: rgb(0 0 0 / 20%) 0px 10px 6px 2px !important;}#van-popover-watch-later .vp-container{position:relative;display:flex;justify-content:space-between;width:100%;min-width:0;height:518px}#van-popover-watch-later .favorite-video-panel{padding-top:0;height:100%}#van-popover-watch-later .favorite-video-list{overflow-y:auto;width:370px;height:480px;overscroll-behavior:none}#van-popover-watch-later .header-video-card{display:flex;flex-shrink:0;padding:8px 5px 8px 20px;height:77px;cursor:pointer;transition:.3s ease}#van-popover-watch-later .header-video-card .multiple-preview{width:108px;height:61px}#van-popover-watch-later .header-video-card .video-preview{position:relative;text-align:center}#van-popover-watch-later .header-video-card .video-info{display:flex;flex-direction:column;flex-shrink:0;justify-content:space-between;margin-left:12px}#van-popover-watch-later .header-video-card .video-info .line-2{max-width:210px;height:37px;color:#212121;font-weight:500;font-size:14px;display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;text-overflow:-o-ellipsis-lastline;text-overflow:ellipsis;word-break:break-all;-webkit-line-clamp:2}#van-popover-watch-later .header-video-card .video-info .info{display:flex;color:#999;font-size:12px}#van-popover-watch-later .play-view-all{display:flex}#van-popover-watch-later .play-all.view{color:#212121}#van-popover-watch-later .play-all:hover{background-color:#f4f4f4}#van-popover-watch-later .play-all{bottom:0;display:block;display:flex;align-items:center;justify-content:center;width:100%;border-top:1px solid #e7e7e7;background-color:#fff;color:#00a1d6;line-height:45px;cursor:pointer;transition:.3s ease}#van-popover-watch-later .play-all .bilifont{margin-right:10px;color:#00a1d6!important;font-size:14px!important}");

    var watchLaterBtnTimeout;
    var lastUpdateTime;
    var watchLaterCountDown = 0;

    var temp = '<div class="watch-later-video"><a href="" target="_blank" class="header-video-card"><div class="video-preview multiple-preview"><div class="video-card-img"><img src="" alt="" class="default-img"><div class="wl-progress-bar"></div><div class="duration-tag"></div><div class="watchlist-item-img-del"><span class="svgicon-r"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.4 11.652a.878.878 0 001.757 0V6.46a1 1 0 00-.879-.99c-.49.082-.856.495-.878.99v5.192zm3.514 0c0 .485.393.877.879.877a.826.826 0 00.878-.877V6.46a.983.983 0 00-.878-1c-.494.083-.86.501-.879 1v5.192zm5.324-7.139H13.21v8.946a1.43 1.43 0 01-1.317 1.535H4.354a1.458 1.458 0 01-1.59-1.544V4.513h-.975a.877.877 0 01-.782-.877.78.78 0 01.672-.876H5.4v-.948a.702.702 0 01.782-.807h3.61a.703.703 0 01.783.781v.974h3.61a.782.782 0 01.809.876.877.877 0 01-.756.877z" fill="#FFF" fill-rule="evenodd"></path></svg></span></div></div></div><div class="video-info"><div title="" class="line-2"></div><div class="info"><span class="up"></span></div></div></a></div>';

    window.getCookie = function (objName) {//获取指定名称的cookie的值 
        var arrStr = document.cookie.split("; ");
        for (var i = 0; i < arrStr.length; i++) {
            var temp = arrStr[i].split("=");
            if (temp[0] == objName) {
                return decodeURI(temp[1]);
            }
        }
    }

    window.loadWatchLater = function () {
        let c = $(".user-con.signin").children();
        let c_new = $(".bili-header__bar>.right-entry").children();
        if (c.length == 0 && c_new.length <= 1 && watchLaterCountDown < 30) {
            watchLaterCountDown++;
            setTimeout(() => loadWatchLater(), 100);
            return;
        } else {
            let ver = "old";
            if (c.length) {
                $(c[3]).after($('<div class="item"><span><div class="mini-toview" tabindex="0"><span><span class="name">稍后再看</span></span><div role="tooltip" id="van-popover-watch-later" aria-hidden="true" class="van-popover van-popper van-popper-favorite" tabindex="0"><div  class="vp-container"><div  class="favorite-video-panel"><div  class="favorite-video-list watch-later-list"></div><div data-v-a1b2c3d4 class="play-view-all"><a data-v-a1b2c3d4 href="//www.bilibili.com/watchlater/#/list" target="_blank" class="play-all view">查看全部</a><a data-v-a1b2c3d4 href="//www.bilibili.com/list/watchlater" target="_blank" class="play-all"><i data-v-a1b2c3d4 class="bilifont bili-icon_dingdao_bofang"></i>播放全部</a></div></div></div></div></div></span></div>'));
            } else {
                ver = "new";
                temp = '<a data-mod="top_right_bar_window_default_collection" data-idx="content" data-ext="click" class="header-fav-card" href="" target="_blank"><div class="header-fav-card__image"><img class="v-img" src="" alt="" loading="lazy" onload=""><div class="wl-progress-bar" style="bottom: 0"></div><div class="watchlist-item-img-del" style="right: 4px;"><span class="svgicon-r"><svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5.4 11.652a.878.878 0 001.757 0V6.46a1 1 0 00-.879-.99c-.49.082-.856.495-.878.99v5.192zm3.514 0c0 .485.393.877.879.877a.826.826 0 00.878-.877V6.46a.983.983 0 00-.878-1c-.494.083-.86.501-.879 1v5.192zm5.324-7.139H13.21v8.946a1.43 1.43 0 01-1.317 1.535H4.354a1.458 1.458 0 01-1.59-1.544V4.513h-.975a.877.877 0 01-.782-.877.78.78 0 01.672-.876H5.4v-.948a.702.702 0 01.782-.807h3.61a.703.703 0 01.783.781v.974h3.61a.782.782 0 01.809.876.877.877 0 01-.756.877z" fill="#FFF" fill-rule="evenodd"></path></svg></span></div><div class="header-fav-card__duration" style="left: 4px;right: unset;"><div class="header-fav-card__duration--text"></div></div></div><div class="header-fav-card__info"><div title="" class="header-fav-card__info--title"></div><span class="header-fav-card__info--name"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="up-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.33334 5.16669C1.33334 3.78597 2.45263 2.66669 3.83334 2.66669H12.1667C13.5474 2.66669 14.6667 3.78597 14.6667 5.16669V10.8334C14.6667 12.2141 13.5474 13.3334 12.1667 13.3334H3.83334C2.45263 13.3334 1.33334 12.2141 1.33334 10.8334V5.16669ZM3.83334 3.66669C3.00492 3.66669 2.33334 4.33826 2.33334 5.16669V10.8334C2.33334 11.6618 3.00492 12.3334 3.83334 12.3334H12.1667C12.9951 12.3334 13.6667 11.6618 13.6667 10.8334V5.16669C13.6667 4.33826 12.9951 3.66669 12.1667 3.66669H3.83334ZM4.33334 5.50002C4.60949 5.50002 4.83334 5.72388 4.83334 6.00002V8.50002C4.83334 9.05231 5.28106 9.50002 5.83334 9.50002C6.38563 9.50002 6.83334 9.05231 6.83334 8.50002V6.00002C6.83334 5.72388 7.0572 5.50002 7.33334 5.50002C7.60949 5.50002 7.83334 5.72388 7.83334 6.00002V8.50002C7.83334 9.60459 6.93791 10.5 5.83334 10.5C4.72877 10.5 3.83334 9.60459 3.83334 8.50002V6.00002C3.83334 5.72388 4.0572 5.50002 4.33334 5.50002ZM9.00001 5.50002C8.72387 5.50002 8.50001 5.72388 8.50001 6.00002V10C8.50001 10.2762 8.72387 10.5 9.00001 10.5C9.27615 10.5 9.50001 10.2762 9.50001 10V9.33335H10.5833C11.6419 9.33335 12.5 8.47523 12.5 7.41669C12.5 6.35814 11.6419 5.50002 10.5833 5.50002H9.00001ZM10.5833 8.33335H9.50001V6.50002H10.5833C11.0896 6.50002 11.5 6.91043 11.5 7.41669C11.5 7.92295 11.0896 8.33335 10.5833 8.33335Z" fill="#999999"></path></svg><span class="up"></span></span></div></a>';
                $(c_new[3]).after($('<li class="right-entry-item mini-toview"><a href="#" target="_blank" class="right-entry__outside"><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" class="right-entry-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 1.74286C5.02955 1.74286 1 5.7724 1 10.7429C1 15.7133 5.02955 19.7429 10 19.7429C14.9705 19.7429 19 15.7133 19 10.7429C19 5.7724 14.9705 1.74286 10 1.74286ZM10.0006 3.379C14.0612 3.379 17.3642 6.68282 17.3642 10.7426C17.3642 14.8033 14.0612 18.1063 10.0006 18.1063C5.93996 18.1063 2.63696 14.8033 2.63696 10.7426C2.63696 6.68282 5.93996 3.379 10.0006 3.379Z" fill="currentColor"></path><path d="M9.99985 6.6521V10.743" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path><path d="M12.4545 10.7427H10" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"></path></svg><span class="right-entry-text">稍后再看</span></a><div class="v-popover " id="van-popover-watch-later" style="left: unset;width: unset;margin-top: 20px;margin-left: -200px;"><div class="v-popover-content"><div class="favorite-panel-popover" style="width:450px"><div class="favorite-panel-popover__content"><div id="favorite-content-scroll" class="content-scroll"></div><div class="content-bottom"><a target="_blank" href="//www.bilibili.com/watchlater/#/list" class="content-bottom__btn content-bottom__btn--view">查看全部 </a><a target="_blank" href="//www.bilibili.com/medialist/play/watchlater" class="content-bottom__btn content-bottom__btn--play"><p><svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="play-icon"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.6068 6.27338C12.159 6.60035 12.159 7.3995 11.6068 7.72647L1.27458 13.8445C0.711718 14.1778 0 13.7721 0 13.118L0 0.881893C0 0.22776 0.711718 -0.177942 1.27458 0.155344L11.6068 6.27338Z" fill="var(--brand_blue)"></path></svg><span class="play-text">播放全部 </span></p></a></div></div></div></div></div></li>'));
            }
            $(".mini-toview").click((e) => {
                e.stopPropagation();
                e.preventDefault();
                window.open("https://www.bilibili.com/watchlater/#/list");
            }).mouseenter(function () {
                clearTimeout(watchLaterBtnTimeout);
                watchLaterBtnTimeout = setTimeout(() => {
                    $("#van-popover-watch-later").stop().fadeIn(200);
                    if ((!lastUpdateTime) || new Date().getTime() - lastUpdateTime >= 30000) {
                        lastUpdateTime = new Date().getTime();
                        $.ajax({
                            xhrFields: { withCredentials: true },
                            crossDomain: true,
                            url: "https://api.bilibili.com/x/v2/history/toview/web?jsonp=jsonp",
                            dataType: "json",
                            success: function (r) {
                                if (r.code == 0) {
                                    let list = r.data.list;
                                    $(".watch-later-list,.content-scroll").html("");
                                    for (let i = 0; i < list.length; i++) {
                                        let tar = $(temp);
                                        let a = tar.find(".header-video-card");
                                        if (a.length == 0) {
                                            a = tar;
                                        }
                                        a.attr("href", list[i].uri)
                                            .attr("data-bvid", list[i].bvid)
                                            .click(function (e) {
                                                if (e.ctrlKey) {
                                                    e.preventDefault();
                                                    window.open("https://www.bilibili.com/video/" + this.dataset.bvid);
                                                }
                                            });
                                        // https://www.bilibili.com/medialist/play/watchlater/
                                        // https://www.bilibili.com/video/
                                        tar.find(".default-img,.v-img").attr("src", `${list[i].pic.substr(5)}${ver === "old" ? "@112w_63h_1c_100q.webp" : "@256w_144h_1c"}`);

                                        if (list[i].progress != 0) {
                                            tar.find(".wl-progress-bar").width(list[i].progress / list[i].duration * 100 + "%");
                                        }
                                        // todo 处理css
                                        if (list[i].videos != 1) {
                                            tar.find(".duration-tag,.header-fav-card__duration--text").text(list[i].videos + "P");
                                        } else {
                                            let s = list[i].duration % 60;
                                            let m = Math.floor(list[i].duration / 60 % 60);
                                            let h = Math.floor(list[i].duration / 3600);
                                            tar.find(".duration-tag,.header-fav-card__duration--text").text((h == 0 ? "" : h < 10 ? "0" + h + ":" : h + ":") + (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s));
                                        }
                                        tar.find(".watchlist-item-img-del").data("bvid", list[i].bvid);
                                        tar.find(".line-2,.header-fav-card__info--title").text(list[i].title).attr("title", list[i].title);
                                        tar.find(".up").text(list[i].owner.name);
                                        $(".watch-later-list:first,.content-scroll:first").append(tar);
                                    }
                                    $(".watch-later-video,.header-fav-card").click(function (e) {
                                        e.stopPropagation();
                                    }).mouseenter(function () {
                                        $(this).find(".line-2").css("color", "#00a1d6");
                                        $(this).find(".watchlist-item-img-del").show();
                                    }).mouseleave(function () {
                                        $(this).find(".line-2").css("color", "");
                                        $(this).find(".watchlist-item-img-del").hide();
                                    });
                                    $(".watchlist-item-img-del").click(function (e) {
                                        let targ = this;
                                        e.preventDefault();
                                        $.ajax({
                                            url: "https://api.bilibili.com/x/v2/history/toview/del",
                                            type: "POST",
                                            xhrFields: { withCredentials: true },
                                            crossDomain: true,
                                            data: { "jsonp": "jsonp", "bvids": $(targ).data("bvid"), "csrf": getCookie("bili_jct") },
                                            dataType: "json",
                                            success: function (r) {
                                                if (r.code == 0) {
                                                    $(targ).parents(".watch-later-video,.header-fav-card").fadeOut(300);
                                                } else {
                                                    console.warn("删除失败：", r.message);
                                                }
                                            },
                                            error: function (r) {
                                                console.warn("删除失败：", r.message);
                                            }
                                        });
                                    });
                                    $(".play-view-all").click(function (e) { e.stopPropagation(); });
                                } else {
                                    console.log("加载稍后再看失败：", r.msg);
                                }
                            },
                            error: function (r) {
                                console.log("加载稍后再看失败：", r.msg);
                            },
                        });
                    }
                }, 200);
            }).mouseleave(function () {
                clearTimeout(watchLaterBtnTimeout);
                watchLaterBtnTimeout = setTimeout(() => {
                    $("#van-popover-watch-later").stop().fadeOut(100);
                }, 200);
            });
        }
    }

    setTimeout(() => {
        loadWatchLater();
        if (location.pathname.startsWith("/video/")) {
            let loadingLimit = Date.now() + 5000;
            (function initWatchBtn() {
                let dom = document.querySelector(".toolbar-right>.note-btn") || document.querySelector(".video-note");
                if (dom) {
                    let watchLater = $(`<div class="ops-watch-later van-watchlater" style="width: 22px;height: 22px;position: initial;margin-right: 5px;"></div>`);
                    $(dom).after(watchLater);
                    watchLater.click((e) => {
                        if (e.target.classList.contains("added")) {
                            e.target.classList.remove("added");
                        } else {
                            e.target.classList.add("added");
                        }
                        let btn = document.querySelector(".more_dropdown .ops-watch-later.van-watchlater");
                        if (btn) {
                            btn.click();
                        } else {
                            btn = document.querySelector(".video-watchlater .ops-watch-later.van-watchlater");
                            btn.click();
                        }
                    });
                    return;
                } else if (document.querySelector(".rigth-btn .note-btn")) {
                    console.log("旧版");
                    GM_addStyle("#van-popover-watch-later .ops-watch-later.van-watchlater{top:4px;right:25px}#van-popover-watch-later .rigth-btn{margin-right:20px;}");
                    let btn = $(".ops-watch-later.van-watchlater");
                    $(".rigth-btn").append(btn.css({ "position": "relative", "bottom": "unset" }));
                    return;
                } else if (Date.now() > loadingLimit) {
                    return;
                }
                requestIdleCallback(initWatchBtn, { timeout: 1000 });
            })();
        }
    }, 200);

})();
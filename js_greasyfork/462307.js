// ==UserScript==
// @name         B站动态、旧版播放页显示评论图片
// @namespace    http://tampermonkey.net/
// @version      1.102.4
// @description  B站动态、旧版播放页显示评论图片。
// @author       CZX Fuckerman
// @match        *://*.bilibili.com/*
// @exclude      *://member.bilibili.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min.js
// @run-at       document-body
// @license      GPL
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462307/B%E7%AB%99%E5%8A%A8%E6%80%81%E3%80%81%E6%97%A7%E7%89%88%E6%92%AD%E6%94%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/462307/B%E7%AB%99%E5%8A%A8%E6%80%81%E3%80%81%E6%97%A7%E7%89%88%E6%92%AD%E6%94%BE%E9%A1%B5%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let j3 = jQuery.noConflict(true);

    Function.prototype.clone = function() {
        var cloneObj = this;
        if(this.__isClone) {
            cloneObj = this.__clonedFrom;
        }

        var temp = function() { return cloneObj.apply(this, arguments); };
        for(var key in this) {
            temp[key] = this[key];
        }

        temp.__isClone = true;
        temp.__clonedFrom = cloneObj;

        return temp;
    };

    function hackEle(ele, func, callback){
        const ori = ele[func];
        ele[func] = function(...args){
            return callback(ori.bind(this), ...args)
        }
    };

    function getQueryString(url, name) {
        let param = url.split('?')[1];
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = url.split('?')[1].match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }

    function getCookie(cookieName) {
        let cookie = {};
        document.cookie.split(';').forEach(function(el) {
            let [key,value] = el.split('=');
            cookie[key.trim()] = value;
        })
        return cookie[cookieName];
    }

    function setCookie(key, value, domain, days) {
        var d = new Date();
        d.setTime(d.getTime()+(days*24*60*60*1000));
        var expires = "expires="+d.toGMTString();
        document.cookie = key+"="+value+"; "+expires+"; domain="+domain;
    }

    function chkThenSetCookie(key, value, domain, days) {
        if(getCookie(key) == null) setCookie(key, value, domain, days);
    }

    function randomNum(minNum,maxNum){
        switch(arguments.length){
            case 1:
                return parseInt(Math.random()*minNum+1,10);
                break;
            case 2:
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
                break;
            default:
                return 0;
                break;
        }
    }

    hackEle(document.querySelector("head"), "insertBefore", hack);
    hackEle(document.querySelector("head"), "appendChild", hack);

/*
    j3(function(){
        setCookie("nostalgia_conf", "2", ".bilibili.com", 365);
        setCookie("i-wanna-go-back", "1", ".bilibili.com", 365);
        setCookie("go-back-dyn", "1", ".bilibili.com", 365);
        chkThenSetCookie("DedeUserID", randomNum(1200000, 99999999), ".bilibili.com", 365);
    });

*/

    function injectbbComment(){
        const bbComment = window.bbComment;
        bbComment.prototype.j3 = j3;
        var oldFun = bbComment.prototype._createListCon.clone();
        bbComment.prototype._createListCon = function (item, i, pos) {
            let res = oldFun.apply(this, [item, i, pos]);
            if(typeof(item.content.rich_text) != "undefined" || item.content.rich_text != null || typeof(item.content.pictures) != "undefined" || item.content.pictures != null){
                let domRes = this.j3.parseHTML(res);
                let replyDom = $(domRes).children("p.text");
                if(typeof(item.content.pictures) != "undefined" || item.content.pictures != null){
                    let containerDom = $("<div class=\"preview-image-container\"></div>");
                    let multiPic = item.content.pictures.length >1?true:false;
                    $.each(item.content.pictures, function(index, item) {
                        let warpDom = $("<div class=\"image-item-wrap\"></div>");
                        let attrItem = {
                            url: item.img_src,
                            type: (null == item ? void 0 : item.img_width) >= (null == item ? void 0 : item.img_height) ? "horizontal" : "vertical",
                            width: item.img_width,
                            height: item.img_height,
                            extraLong: Math.floor((null == item ? void 0 : item.img_width) / (null == item ? void 0 : item.img_height)) >= 3 || Math.floor((null == item ? void 0 : item.img_height) / (null == item ? void 0 : item.img_width)) >= 3
                        };
                        let o = "preview-image";
                        let cssAttrItem = multiPic?{
                            width: "preview-image" === o ? "120px" : "54px",
                            height: "preview-image" === o ? "120px" : "54px"
                        } : "horizontal" === attrItem.type ? {
                            minWidth: "preview-image" === o ? "135px" : "54px",
                            maxWidth: "preview-image" === o ? "240px" : "54px",
                            height: "preview-image" === o ? "135px" : "54px"
                        } : {
                            minWidth: "preview-image" === o ? "135px" : "54px",
                            maxWidth: "preview-image" === o ? "180px" : "54px",
                            height: "preview-image" === o ? "180px" : "54px"
                        };
                        let webpItem = multiPic?{
                            w: attrItem.extraLong && "horizontal" === attrItem.type ? void 0 : 120,
                            h: attrItem.extraLong && "vertical" === attrItem.type ? void 0 : 120,
                            style: "web-comment-note",
                            c: !attrItem.extraLong,
                        }:{
                            w: "horizontal" === attrItem.type ? void 0 : 180,
                            h: "vertical" === attrItem.type ? void 0 : 135,
                            style: "web-comment-note"
                        };
                        let webpSrc = `${item.img_src}@${webpItem.w === void 0?'':webpItem.w+'w_'}${webpItem.h === void 0?'':webpItem.h+'h_'}${webpItem.c === true?'1c_':''}!${webpItem.style}.webp`;
                        warpDom.append("<img class=\"custom-comment-picture\" src=\"" + webpSrc + "\" onclick=\"window.open('" + item.img_src + "')\"></img>");
                        $.each(cssAttrItem, function(key, value) {
                            if(key == "minWidth"){
                                warpDom.css("min-width", value);
                            } else if(key == "maxWidth"){
                                warpDom.css("max-width", value);
                            } else {
                                warpDom.css(key, value);
                            }
                        });
                        if(attrItem.type === 'vertical') warpDom.addClass("vertical");
                        if(attrItem.extraLong === true) warpDom.addClass("extra-long");
                        containerDom.append(warpDom);
                    });
                    replyDom.after(containerDom);
                }

                if(typeof(item.content.rich_text) != "undefined" || item.content.rich_text != null){
                    if(typeof(item.content.rich_text.note) != "undefined" || item.content.rich_text.note != null){
                        if(typeof(item.content.rich_text.note.click_url) != "undefined" || item.content.rich_text.note.click_url != null){
                            replyDom.append("&nbsp;<a href=\"https://www.bilibili.com/read/cv" + getQueryString(item.content.rich_text.note.click_url, "cvid") + "?jump_opus=1\" target=\"_blank\">展开</a>");
                        }
                    }
                }

                //replyDom.text() || (replyDom.text("我发布了一篇笔记，快来看看吧~"));
                
                replyDom.wrap("<span></span>");
                replyDom.css("display", "inline");
                replyDom.before("<div class=\"note-prefix\"><img class=\"note-icon\" src=\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTUiIHZpZXdCb3g9IjAgMCAxNCAxNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik03LjAwMDAyIDMuNDE2NjlDNS41MzEwNiAzLjQxNjY5IDQuMjQ4NDQgMy40OTE0MSAzLjM0MzA0IDMuNTY0ODRDMi43MTM4IDMuNjE1ODYgMi4yMjYwOCA0LjA5NjU0IDIuMTcwMDIgNC43MjAxNEMyLjEwMzU2IDUuNDU5MzcgMi4wNDE2OSA2LjQzNDIzIDIuMDQxNjkgNy41MDAwMkMyLjA0MTY5IDguNTY1ODEgMi4xMDM1NiA5LjU0MDY3IDIuMTcwMDIgMTAuMjc5OUMyLjIyNjA4IDEwLjkwMzUgMi43MTM3NCAxMS4zODQyIDMuMzQyOTUgMTEuNDM1MkM0LjE3NTE5IDExLjUwMjcgNS4zMjYzNSAxMS41NzEzIDYuNjQ4MDggMTEuNTgxOUM2Ljg4OTcgMTEuNTgzOSA3LjA4Mzk5IDExLjc4MTMgNy4wODIwNSAxMi4wMjI5QzcuMDgwMSAxMi4yNjQ2IDYuODgyNjYgMTIuNDU4OCA2LjY0MTA0IDEyLjQ1NjlDNS4yOTM4NCAxMi40NDYxIDQuMTIxIDEyLjM3NjIgMy4yNzIyMyAxMi4zMDczQzIuMjIzNiAxMi4yMjIzIDEuMzkzMiAxMS40MTEyIDEuMjk4NTMgMTAuMzU4M0MxLjIzMDM4IDkuNjAwMTIgMS4xNjY2OSA4LjU5ODI5IDEuMTY2NjkgNy41MDAwMkMxLjE2NjY5IDYuNDAxNzUgMS4yMzAzOCA1LjM5OTkyIDEuMjk4NTMgNC42NDE3OUMxLjM5MzIgMy41ODg4MSAyLjIyMzcyIDIuNzc3NzMgMy4yNzIzMSAyLjY5MjdDNC4xOTU1NCAyLjYxNzgzIDUuNTAyMzYgMi41NDE2OSA3LjAwMDAyIDIuNTQxNjlDOC40OTc4MyAyLjU0MTY5IDkuODA0NzYgMi42MTc4NSAxMC43MjggMi42OTI3MkMxMS43NzY0IDIuNzc3NzUgMTIuNjA2OSAzLjU4ODUxIDEyLjcwMTYgNC42NDE0MkMxMi43NTM2IDUuMjIwMzkgMTIuODAzIDUuOTQxMjYgMTIuODIzNSA2LjczODg2QzEyLjgyOTcgNi45ODA0MSAxMi42Mzg5IDcuMTgxMjQgMTIuMzk3MyA3LjE4NzQzQzEyLjE1NTggNy4xOTM2MyAxMS45NTQ5IDcuMDAyODQgMTEuOTQ4OCA2Ljc2MTI5QzExLjkyODkgNS45ODU3NSAxMS44ODA4IDUuMjgzODYgMTEuODMwMSA0LjcxOTc4QzExLjc3NCA0LjA5NjM2IDExLjI4NjQgMy42MTU4OCAxMC42NTczIDMuNTY0ODZDOS43NTE4NiAzLjQ5MTQzIDguNDY5MTIgMy40MTY2OSA3LjAwMDAyIDMuNDE2NjlaTTQuMzc1MDIgNS44OTU4NUM0LjEzMzQgNS44OTU4NSAzLjkzNzUyIDYuMDkxNzMgMy45Mzc1MiA2LjMzMzM1QzMuOTM3NTIgNi41NzQ5OCA0LjEzMzQgNi43NzA4NSA0LjM3NTAyIDYuNzcwODVIOS42MjUwMkM5Ljg2NjY0IDYuNzcwODUgMTAuMDYyNSA2LjU3NDk4IDEwLjA2MjUgNi4zMzMzNUMxMC4wNjI1IDYuMDkxNzMgOS44NjY2NCA1Ljg5NTg1IDkuNjI1MDIgNS44OTU4NUg0LjM3NTAyWk00LjM3NTAyIDguMjI5MTlDNC4xMzM0IDguMjI5MTkgMy45Mzc1MiA4LjQyNTA2IDMuOTM3NTIgOC42NjY2OUMzLjkzNzUyIDguOTA4MzEgNC4xMzM0IDkuMTA0MTkgNC4zNzUwMiA5LjEwNDE5SDcuNTgzMzVDNy44MjQ5OCA5LjEwNDE5IDguMDIwODUgOC45MDgzMSA4LjAyMDg1IDguNjY2NjlDOC4wMjA4NSA4LjQyNTA2IDcuODI0OTggOC4yMjkxOSA3LjU4MzM1IDguMjI5MTlINC4zNzUwMlpNMTIuMTk2MSA4LjM2NzQxQzExLjc5NzQgNy45Njg3NSAxMS4xNTEgNy45Njg3NSAxMC43NTI0IDguMzY3NDFMOC40NDgzNyAxMC42NzE0QzguMjU2OTIgMTAuODYyOSA4LjE0OTM3IDExLjEyMjUgOC4xNDkzNyAxMS4zOTMzVjEyLjU5NzRDOC4xNDkzNyAxMi45NTE4IDguNDM2NjYgMTMuMjM5MSA4Ljc5MTA0IDEzLjIzOTFIOS45OTUxNkMxMC4yNjU5IDEzLjIzOTEgMTAuNTI1NiAxMy4xMzE1IDEwLjcxNyAxMi45NDAxTDEzLjAyMSAxMC42MzZDMTMuNDE5NyAxMC4yMzc0IDEzLjQxOTcgOS41OTEwMyAxMy4wMjEgOS4xOTIzN0wxMi4xOTYxIDguMzY3NDFaTTExLjM3MTEgOC45ODYxM0MxMS40MjgxIDguOTI5MTcgMTEuNTIwNCA4LjkyOTE3IDExLjU3NzMgOC45ODYxM0wxMi40MDIzIDkuODExMDhDMTIuNDU5MyA5Ljg2ODAzIDEyLjQ1OTMgOS45NjAzNyAxMi40MDIzIDEwLjAxNzNMMTAuMDk4MyAxMi4zMjEzQzEwLjA3MDkgMTIuMzQ4NyAxMC4wMzM4IDEyLjM2NDEgOS45OTUxNiAxMi4zNjQxSDkuMDI0MzdMOS4wMjQzNyAxMS4zOTMzQzkuMDI0MzcgMTEuMzU0NiA5LjAzOTc0IDExLjMxNzUgOS4wNjcwOSAxMS4yOTAxTDExLjM3MTEgOC45ODYxM1oiIGZpbGw9IiM5NDk5QTAiLz4KPC9zdmc+Cg==\"><div>笔记</div></div>");
                res = $(domRes).prop('outerHTML');
            }
            return res;
        };

    };

    let styleDom = document.createElement("style");
    styleDom.innerText = ".preview-image-container{display:flex;flex-wrap:wrap;}.image-item-wrap{display:flex;justify-content:center;position:relative;overflow:hidden;flex-wrap:nowrap;margin-top:8px;border-radius:4px;margin:2.5px 2.5px;}.image-item-wrap.vertical{flex-direction:column;}.image-item-wrap.extra-long{justify-content:start;}.custom-comment-picture{vertical-align:middle!important;cursor:pointer!important;object-fit:cover!important;border-radius:2px!important;}.note-prefix{display: inline-flex;align-items: center;justify-content:center;padding:1px 4px;margin-right:8px;font-size:12px;color:#9499A0;line-height:20px;vertical-align:bottom;background-color:#F6F7F8;} .note-prefix.note-icon{width: 16px;height:16px;}";
    document.head.appendChild(styleDom);

/*
    window.returnBackBtn = function(){
        window.__INITIAL_STATE__.abtest.storage_back_btn = "SHOW";
        window.__INITIAL_STATE__.abtest.remove_back_version = "SHOW";
    }

    setTimeout("returnBackBtn()", 5000);
*/

    window.bbCommentinjected = false;
    function hack(origin, ...args){
        const [ele, target] = [...args];
        if(!(typeof window.bbComment === 'undefined') && !window.bbCommentinjected){
            // 确定是评论类型，执行额外流程
            injectbbComment();
            window.bbCommentinjected = true;
        }
        let res = origin(...args);
        return res;
    }

})();
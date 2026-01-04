// ==UserScript==
// @name         离线磁链一键下载
// @namespace    https://example.com
// @version      1.2
// @description  在磁力搜索列表中直接提取磁链，并在旁显示离线下载按钮。点击按钮后，如果当前页面不在目标离线服务页面，则保存磁链并打开目标离线页面；若已在目标页面，则自动调用离线下载操作（offFunc）。
// @author       YourName
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @match        *://*/*
// @exclude      http://www.toodledo.com/tasks/*
// @exclude      *://*.google.*/*
// @exclude      *://mega.*/*
// @exclude      *://*.mega.*/*
// @exclude      *://*.youku.com/v_*
// @exclude      *://*pan.baidu.com
// @exclude      *://*.iqiyi.com/v_*
// @exclude      *://*.iqiyi.com/w_*
// @exclude      *://*.iqiyi.com/a_*
// @exclude      *://*.le.com/ptv/vplay/*
// @exclude      *://v.qq.com/x/cover/*
// @exclude      *://v.qq.com/x/page/*
// @exclude      *://v.qq.com/tv/*
// @exclude      *://*.tudou.com/listplay/*
// @exclude      *://*.tudou.com/albumplay/*
// @exclude      *://*.tudou.com/programs/view/*
// @exclude      *://*.mgtv.com/b/*
// @exclude      *://film.sohu.com/album/*
// @exclude      *://tv.sohu.com/v/*
// @exclude      *://*.bilibili.com/video/*
// @exclude      *://*.bilibili.com/bangumi/play/*
// @exclude      *://*.baofeng.com/play/*
// @exclude      *://vip.pptv.com/show/*
// @exclude      *://v.pptv.com/show/*
// @exclude      *://www.le.com/ptv/vplay/*
// @exclude      *://www.wasu.cn/Play/show/*
// @exclude      *://m.v.qq.com/x/cover/*
// @exclude      *://m.v.qq.com/x/page/*
// @exclude      *://m.v.qq.com/*
// @exclude      *://m.iqiyi.com/*
// @exclude      *://m.iqiyi.com/kszt/*
// @exclude      *://m.youku.com/alipay_video/*
// @exclude      *://m.mgtv.com/b/*
// @exclude      *://m.tv.sohu.com/v/*
// @exclude      *://m.film.sohu.com/album/*
// @exclude      *://m.le.com/ptv/vplay/*
// @exclude      *://m.pptv.com/show/*
// @exclude      *://m.acfun.cn/v/*
// @exclude      *://m.bilibili.com/video/*
// @exclude      *://m.bilibili.com/anime/*
// @exclude      *://m.bilibili.com/bangumi/play/*
// @exclude      *://m.wasu.cn/Play/show/*
// @exclude      *://www.youtube.com
// @exclude      *://www.youtube.com/
// @exclude      *://www.youtube.com/watch*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529663/%E7%A6%BB%E7%BA%BF%E7%A3%81%E9%93%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/529663/%E7%A6%BB%E7%BA%BF%E7%A3%81%E9%93%BE%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function(){
    'use strict';

    // 存储兼容：如无 GM_getValue/GM_setValue 则使用 localStorage
    var storage = {
        getItem: function(key, cb){
            if(typeof GM_getValue === "function"){
                cb(GM_getValue(key));
            } else {
                cb(localStorage.getItem(key));
            }
        },
        setItem: function(key, val){
            if(typeof GM_setValue === "function"){
                GM_setValue(key, val);
            } else {
                localStorage.setItem(key, val);
            }
        },
        delItem: function(key){
            if(typeof GM_setValue === "function"){
                GM_setValue(key, "");
            } else {
                localStorage.removeItem(key);
            }
        }
    };

    // _unsafeWindow 兼容
    var _unsafeWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    // 全局变量存储当前磁链
    window.curlink = "";

    // ----------【第一部分】扫描页面并提取磁链，添加离线下载按钮----------
    $(document).ready(function(){
        $('a').each(function(){
            var $a = $(this);
            var href = $a.attr('href');
            if(!href) return;
            // 避免重复添加
            if($a.find('.offline-btn').length > 0) return;

            if(/^magnet:\?xt=urn:btih:/i.test(href)){
                appendOfflineButton($a, href);
            } else {
                var hash = null;
                var reg1 = /(?:^|\/|&|-|\.|\?|=|:)([a-fA-F0-9]{40})/;
                var reg2 = /\/([a-zA-Z2-7]{32})$/;
                if(reg1.test(href)){
                    hash = href.match(reg1)[1];
                } else if(reg2.test(href)){
                    hash = reg2.exec(href)[1];
                    hash = base32To16(hash).toUpperCase();
                }
                if(hash){
                    var magnetLink = 'magnet:?xt=urn:btih:' + hash;
                    appendOfflineButton($a, magnetLink);
                } else {
                    // 对于链接中未直接显示磁链的情况，尝试加载二级页面异步提取
                    if(typeof GM_xmlhttpRequest !== 'undefined'){
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: href,
                            onload: function(response) {
                                if(response.status === 200){
                                    var htmlTxt = response.responseText;
                                    var m = htmlTxt.match(/href="(magnet:\?xt=urn:btih:[^"]{40,})/i);
                                    if(m && m[1]){
                                        appendOfflineButton($a, m[1]);
                                    } else {
                                        console.log(href + ' 无磁力链接');
                                    }
                                }
                            },
                            onerror: function(err) {
                                console.log('请求失败：' + href);
                            }
                        });
                    }
                }
            }
        });
    });

    // 添加离线按钮（样式参考第二脚本）
    function appendOfflineButton($anchor, magnetLink) {
        var btn = $('<a class="whx-a offline-btn" title="一键离线下载\n' + magnetLink + '" target="_blank"></a>');
        btn.css({
            'display': 'inline-block',
            'margin-left': '5px',
            'background-size': '20px',
            'border-radius': '50%',
            'border': '0',
            'vertical-align': 'middle',
            'outline': 'none',
            'padding': '0',
            'height': '26px',
            'width': '26px',
            'cursor': 'pointer',
            'background-position': 'center',
            'background-repeat': 'no-repeat',
            'background-color': '#f2f2f2'
        });
        var downIconBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAMAAADzN3VRAAAARVBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADc6ur3AAAAFnRSTlMAYM5vMOA/ENGegK2olI6G1b97Z0sXENA+jAAAAKFJREFUKM+FklkSxCAIRHFfss3K/Y86iQSDVqzpH7FfgQpCVfAmGx+gl9JI0qrxrcNLzooEbKUG4EKWdkCiDRV0N0RTrZ5wvdgTTgp4SzCAHxAPZkAM5GOJWuuT7FE5OVPOBFLTYb3Oc2YB5uJ8+G6pgkTGt74ntcCJHiwFLHw10Tdc93jlGXGvSRtsHNpuPs+/o1ODfxAtSL0f7HPC+L/9AF60G3QxO1UaAAAAAElFTkSuQmCC";
        btn.css('background-image', 'url("' + downIconBg + '")');
        // 点击按钮时，将磁链赋给全局 curlink，并调用 showDiskIcons 显示离线服务选择面板
        btn.on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            window.curlink = magnetLink;
            var offset = btn.offset();
            showDiskIcons(magnetLink, offset.top, offset.left);
        });
        $anchor.append(btn);
    }

    // base32转16进制函数
    function base32To16(str){
        if(str.length % 8 !== 0 || /[0189]/.test(str)){
            return str;
        }
        str = str.toUpperCase();
        var bin =  "", newStr = "", i;
        for(i = 0; i < str.length; i++){
            var charCode = str.charCodeAt(i);
            if(charCode < 65) charCode -= 24;
            else charCode -= 65;
            charCode = '0000' + charCode.toString(2);
            charCode = charCode.substr(charCode.length - 5);
            bin += charCode;
        }
        for(i = 0; i < bin.length; i += 4){
            newStr += parseInt(bin.substring(i, i+4), 2).toString(16);
        }
        return newStr;
    }

    // ----------【第二部分】离线下载面板及服务调用----------
    // 添加离线下载面板容器
    var parentDiv = $("<div id='offlinePanel' style='display:none;position:absolute;z-index:9999999;overflow:visible;text-align:left;'></div>");
    $("body").append(parentDiv);

    $("<style>").prop("type", "text/css").html(`
        a.whx-a,a.whx-a-node{
            display:inline-block;
            margin-left:5px;
            background-size:20px!important;
            border-radius:50%;
            border:0!important;
            vertical-align:middle;
            transition:margin-top 0.25s ease;
            outline:none!important;
            padding:0!important;
            height:26px!important;
            width:26px!important;
            cursor: pointer;
            background-position:center!important;
            background-repeat:no-repeat!important;
        }
    `).appendTo("head");

    // 离线服务配置：包含 regex、url、offFunc、bgColor 和 bgImg
    var services = [
        {
            name: "百度网盘",
            regex: /pan\.baidu\.com/,
            url: "https://pan.baidu.com/disk/home",
            offFunc: function(delLink){
                var gsi = setInterval(function() {
                    var newOffBtn = document.querySelector('[data-id=downloadLink]');
                    if(newOffBtn){
                        clearInterval(gsi);
                        newOffBtn.click();
                        var bsl = setInterval(function() {
                            newOffBtn.click();
                            var offLink = document.querySelector('div.nd-download-link div[role=dialog] input');
                            if(offLink){
                                clearInterval(bsl);
                                var beginOffline = function(){
                                    if(curlink.length === 0) return;
                                    offLink = document.querySelector('div.nd-download-link div[role=dialog] input');
                                    if(Object.prototype.toString.call(curlink) === '[object Array]')
                                        offLink.value = curlink.shift();
                                    else{
                                        offLink.value = curlink;
                                        curlink = "";
                                    }
                                    var event = document.createEvent('HTMLEvents');
                                    event.initEvent("input", false, true);
                                    offLink.dispatchEvent(event);
                                    delLink();
                                    var baiduPathStr, isBt = /^magnet|torrent$/.test(offLink.value);
                                    storage.getItem("baiduPath", function(v){
                                        baiduPathStr = v;
                                        if(baiduPathStr){
                                            _unsafeWindow.require("function-widget-1:offlineDownload/util/newOfflineDialog.js").obtain()._checkPath = baiduPathStr;
                                        }
                                    });
                                    $("div.nd-download-link div[role=dialog]").find("button.nd-download-link__action>span:contains('确定')").click();
                                    if(isBt){
                                        var i = 0, bsb = setInterval(function(){
                                            var btList = document.querySelector('div[aria-label="链接任务"]');
                                            if(btList && !$(btList).is(":hidden")){
                                                clearInterval(bsb);
                                                if($(".nd-remote-download__list-select>span").html() == "全选")
                                                    $(".nd-remote-download__file-list .u-checkbox__original")[0].click();
                                                btList.querySelectorAll('button.nd-remote-download__save-btn')[0].click();
                                            } else if(++i > 50){
                                                clearInterval(bsb);
                                            }
                                        }, 200);
                                    }
                                };
                                setTimeout(beginOffline, 500);
                            }
                        }, 500);
                    }
                }, 500);
            },
            bgColor: "ffffff",
            bgImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABjFBMVEX////7+/v+/v/8/Pwyf/wzc/w0bvza5f4xffz5+//0+P8ybPz8/f4yevw0cPwza/z39/cwe/UxdfzSPyr4+v/2+f/m7/53nv0vf/wvce9pof1tlPwxf/gzfPYwePPp8f7Z5/7S4v7P4P7L3f7I2f2Gtf2Rr/1hkP0yd/1FiPwygfxAdPxspftYkvUtc/Dg6f7C2f7F1f54oP1flf0/hfwsbu7i7f/w9f7b5v7X5f7V4v6nyv6oxv6jwP6Ns/2Lsf1/rv1+ov1zof1xof10nf1jm/1djP0xe/2NufxalvxHj/xPhvxKgPxHffw+efw0ePyXu/mqxPg5hfiTtvdyo/dgmfdOj/dBhfVflfQvefT+9fOIqvMyefNMhvFIgO9MeePyycVjZbzKb3DaZVa/Q0Dx9f+Bp/1olv1gkPw0dvzg6Pu2zPk0gflNjPctc/c9gfX88/JJfO3n3+ni2unHxuSGktNpdtBJY8paashRW71nXqp7YpyDYJKpaIKPU33AVFXARkTVTTvFQjrUPypKwHq1AAACAklEQVQ4y4WTB3OqQBSFF3BpAk+KIBixJ2rs0fTee68vvbzee+9//O1Cio46npmFPfd8d2cY9gIASMJHUESDKFQmAZJAUKCFKELA/WSr3A3d/tZnAF99C8fVHYhiosbxxflsdr7I15SIWiCe3exA2szGmwOJXTkUkvHaTTQD9NyBLO/t7OzJ8kFObwKs2/bRdrSvL7p9ZNvrjQC/n8/nwngXzuXz+3wDED42zS13u2Wax+EGQD+pmhvudsOsnuj1gBAZSp5+/XRIYkMeVu1XyaGIcAfoycVM4Pn3qx9vcW3gRUcmE8gsJvUboNfyeDyBwLd/6sX7wtNnC45DD6vXBbRx1sOmrQ+/VFX9efomhFzFstLoNa45QKzCijMx/vXZpar+/fKSZecWijwfmxHZSgzFFBgWxXQUIJ39UX9/nhPFngHsomlRHEYxRY6mlCkOl+5fXp2vraV6IgCLm1JSoyQGxhRlUnCAi/PUEwXnWMKkooxhAIxAuNSPS+8+Qgi7GOB3zutfgnAExQSIr0JoMJw2GJSghPLSo4eDGscYEK7Gna/gy7QkLRvTK5JEP2bAgy4vvTJtLCNX5h0AMLNemvbihfqBv3zjZpHDACKM7ntI3RMFgFSYcJ3B3P0sf6kzGOxM+AFwXAK7kuNurz2pcWTt7deuna/t4LQdvbbD23b8/wPY0UTO99dD5gAAAABJRU5ErkJggg=="
        },
        {
            name: "115网盘",
            regex: /115\.com/,
            url: "http://115.com/?tab=offline&mode=wangpan",
            offFunc: function(delLink){
                var rsc = setInterval(function(){
                    if(document.readyState === 'complete'){
                        clearInterval(rsc);
                        setTimeout(function(){
                            _unsafeWindow.Core.OFFL5Plug.OpenLink();
                            setTimeout(function(){
                                $('#js_offline_new_add').val(curlink);
                                delLink();
                                document.querySelector('[data-btn=start]').click();
                            }, 1);
                        }, 500);
                    }
                }, 300);
            },
            bgColor: "21458a",
            bgImg:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAASFBMVEUhRYr///+XqcjV3OmJnMFTb6QoS45PbKLu8fbZ4OvBy95xiLRifKxbdqlXcqYxU5P3+Prh5u/O1uXH0eK6xduks89/lLtGZJ4ysMfhAAAAVUlEQVQY04WPSQ6AMAwD6ySkdKHs8P+fckyDhPBtRoojhyG4GP6FEjPvxhGZiKKJPM7uoAHYSif0Lgdw+tppQfOGIF4ILsea3CetvMa+UaRq+Mh7/gPkxAHFh9WDUQAAAABJRU5ErkJggg=="
        }
    ];

    // showDiskIcons：显示离线面板并根据服务进行处理
    window.showDiskIcons = function(url, top, left){
        parentDiv.empty();
        services.forEach(function(service){
            var btn = $("<a></a>").addClass("whx-a").attr("title", service.name).attr("target", "_blank");
            btn.css({
                "background-color": "#" + service.bgColor,
                "background-image": service.bgImg ? 'url("' + service.bgImg + '")' : '',
                "display": "block",
                "margin": "5px 0"
            });
            btn.on("click", function(e){
                e.preventDefault();
                e.stopPropagation();
                // 如果当前域名匹配服务的 regex，则直接调用 offFunc
                if(service.regex.test(location.hostname)){
                    if(service.offFunc && typeof service.offFunc === 'function'){
                        service.offFunc(function(){
                            parentDiv.hide();
                        });
                    }
                } else {
                    // 不在目标离线页面，则存储磁链并打开目标页面
                    storage.setItem(service.name + ":eoUrl", curlink);
                    GM_openInTab(service.url, true);
                    parentDiv.hide();
                }
            });
            parentDiv.append(btn);
        });
        parentDiv.css({top: top + 30, left: left});
        parentDiv.show();
        $(document).on("click.offlinePanel", function(e){
            if(!$(e.target).closest("#offlinePanel").length){
                parentDiv.hide();
                $(document).off("click.offlinePanel");
            }
        });
    };

    // 如果当前页面属于某离线服务（例如百度或115），则自动读取存储中的链接并执行 offFunc
    services.forEach(function(service){
        if(service.regex.test(location.hostname)){
            storage.getItem(service.name + ":eoUrl", function(v){
                if(v){
                    window.curlink = v;
                    if(service.offFunc && typeof service.offFunc === 'function'){
                        service.offFunc(function(){
                            storage.delItem(service.name + ":eoUrl");
                        });
                    }
                }
            });
        }
    });

})();

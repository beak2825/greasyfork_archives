// ==UserScript==
// @name         学习通视频秒杀
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  功能强大,没有之一,支持手机端,修复加载失败.
// @author       汐
// @match        *://*.chaoxing.com/knowledge/cards*
// @icon         https://www.google.com/s2/favicons?domain=chaoxing.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433736/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E7%A7%92%E6%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/433736/%E5%AD%A6%E4%B9%A0%E9%80%9A%E8%A7%86%E9%A2%91%E7%A7%92%E6%9D%80.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var _this = window.top[0];
    function Sdk(menu){
        this.menu = menu;
        this.href = '';
        this.arg = {};
        this.videos = [];
        this.defaults = {};
        this.installHook();
        this.initData();
    }
    Sdk.prototype.f = function(w) {
        function q(v, A) {
            var z = (v & 65535) + (A & 65535);
            var w = (v >> 16) + (A >> 16) + (z >> 16);
            return (w << 16) | (z & 65535)
        }
        function p(v, w) {
            return (v << w) | (v >>> (32 - w))
        }
        function k(B, y, w, v, A, z) {
            return q(p(q(q(y, B), q(v, z)), A), w)
        }
        function a(y, w, C, B, v, A, z) {
            return k((w & C) | ((~w) & B), y, w, v, A, z)
        }
        function h(y, w, C, B, v, A, z) {
            return k((w & B) | (C & (~B)), y, w, v, A, z)
        }
        function n(y, w, C, B, v, A, z) {
            return k(w ^ C ^ B, y, w, v, A, z)
        }
        function t(y, w, C, B, v, A, z) {
            return k(C ^ (w | (~B)), y, w, v, A, z)
        }
        function c(G, B) {
            G[B >> 5] |= 128 << (B % 32);
            G[(((B + 64) >>> 9) << 4) + 14] = B;
            var y;
            var A;
            var z;
            var w;
            var v;
            var F = 1732584193;
            var E = -271733879;
            var D = -1732584194;
            var C = 271733878;
            for (y = 0; y < G.length; y += 16) {
                A = F;
                z = E;
                w = D;
                v = C;
                F = a(F, E, D, C, G[y], 7, -680876936);
                C = a(C, F, E, D, G[y + 1], 12, -389564586);
                D = a(D, C, F, E, G[y + 2], 17, 606105819);
                E = a(E, D, C, F, G[y + 3], 22, -1044525330);
                F = a(F, E, D, C, G[y + 4], 7, -176418897);
                C = a(C, F, E, D, G[y + 5], 12, 1200080426);
                D = a(D, C, F, E, G[y + 6], 17, -1473231341);
                E = a(E, D, C, F, G[y + 7], 22, -45705983);
                F = a(F, E, D, C, G[y + 8], 7, 1770035416);
                C = a(C, F, E, D, G[y + 9], 12, -1958414417);
                D = a(D, C, F, E, G[y + 10], 17, -42063);
                E = a(E, D, C, F, G[y + 11], 22, -1990404162);
                F = a(F, E, D, C, G[y + 12], 7, 1804603682);
                C = a(C, F, E, D, G[y + 13], 12, -40341101);
                D = a(D, C, F, E, G[y + 14], 17, -1502002290);
                E = a(E, D, C, F, G[y + 15], 22, 1236535329);
                F = h(F, E, D, C, G[y + 1], 5, -165796510);
                C = h(C, F, E, D, G[y + 6], 9, -1069501632);
                D = h(D, C, F, E, G[y + 11], 14, 643717713);
                E = h(E, D, C, F, G[y], 20, -373897302);
                F = h(F, E, D, C, G[y + 5], 5, -701558691);
                C = h(C, F, E, D, G[y + 10], 9, 38016083);
                D = h(D, C, F, E, G[y + 15], 14, -660478335);
                E = h(E, D, C, F, G[y + 4], 20, -405537848);
                F = h(F, E, D, C, G[y + 9], 5, 568446438);
                C = h(C, F, E, D, G[y + 14], 9, -1019803690);
                D = h(D, C, F, E, G[y + 3], 14, -187363961);
                E = h(E, D, C, F, G[y + 8], 20, 1163531501);
                F = h(F, E, D, C, G[y + 13], 5, -1444681467);
                C = h(C, F, E, D, G[y + 2], 9, -51403784);
                D = h(D, C, F, E, G[y + 7], 14, 1735328473);
                E = h(E, D, C, F, G[y + 12], 20, -1926607734);
                F = n(F, E, D, C, G[y + 5], 4, -378558);
                C = n(C, F, E, D, G[y + 8], 11, -2022574463);
                D = n(D, C, F, E, G[y + 11], 16, 1839030562);
                E = n(E, D, C, F, G[y + 14], 23, -35309556);
                F = n(F, E, D, C, G[y + 1], 4, -1530992060);
                C = n(C, F, E, D, G[y + 4], 11, 1272893353);
                D = n(D, C, F, E, G[y + 7], 16, -155497632);
                E = n(E, D, C, F, G[y + 10], 23, -1094730640);
                F = n(F, E, D, C, G[y + 13], 4, 681279174);
                C = n(C, F, E, D, G[y], 11, -358537222);
                D = n(D, C, F, E, G[y + 3], 16, -722521979);
                E = n(E, D, C, F, G[y + 6], 23, 76029189);
                F = n(F, E, D, C, G[y + 9], 4, -640364487);
                C = n(C, F, E, D, G[y + 12], 11, -421815835);
                D = n(D, C, F, E, G[y + 15], 16, 530742520);
                E = n(E, D, C, F, G[y + 2], 23, -995338651);
                F = t(F, E, D, C, G[y], 6, -198630844);
                C = t(C, F, E, D, G[y + 7], 10, 1126891415);
                D = t(D, C, F, E, G[y + 14], 15, -1416354905);
                E = t(E, D, C, F, G[y + 5], 21, -57434055);
                F = t(F, E, D, C, G[y + 12], 6, 1700485571);
                C = t(C, F, E, D, G[y + 3], 10, -1894986606);
                D = t(D, C, F, E, G[y + 10], 15, -1051523);
                E = t(E, D, C, F, G[y + 1], 21, -2054922799);
                F = t(F, E, D, C, G[y + 8], 6, 1873313359);
                C = t(C, F, E, D, G[y + 15], 10, -30611744);
                D = t(D, C, F, E, G[y + 6], 15, -1560198380);
                E = t(E, D, C, F, G[y + 13], 21, 1309151649);
                F = t(F, E, D, C, G[y + 4], 6, -145523070);
                C = t(C, F, E, D, G[y + 11], 10, -1120210379);
                D = t(D, C, F, E, G[y + 2], 15, 718787259);
                E = t(E, D, C, F, G[y + 9], 21, -343485551);
                F = q(F, A);
                E = q(E, z);
                D = q(D, w);
                C = q(C, v)
            }
            return [F, E, D, C]
        }
        function o(w) {
            var x;
            var v = "";
            var y = w.length * 32;
            for (x = 0; x < y; x += 8) {
                v += String.fromCharCode((w[x >> 5] >>> (x % 32)) & 255)
            }
            return v
        }
        function j(w) {
            var y;
            var v = [];
            v[(w.length >> 2) - 1] = undefined;
            for (y = 0; y < v.length; y += 1) {
                v[y] = 0
            }
            var x = w.length * 8;
            for (y = 0; y < x; y += 8) {
                v[y >> 5] |= (w.charCodeAt(y / 8) & 255) << (y % 32)
            }
            return v
        }
        function i(v) {
            return o(c(j(v), v.length * 8))
        }
        function u(x, A) {
            var w;
            var z = j(x);
            var v = [];
            var y = [];
            var B;
            v[15] = y[15] = undefined;
            if (z.length > 16) {
                z = c(z, x.length * 8)
            }
            for (w = 0; w < 16; w += 1) {
                v[w] = z[w] ^ 909522486;
                y[w] = z[w] ^ 1549556828
            }
            B = c(v.concat(j(A)), 512 + A.length * 8);
            return o(c(y.concat(B), 512 + 128))
        }
        function s(z) {
            var y = "0123456789abcdef";
            var w = "";
            var v;
            var A;
            for (A = 0; A < z.length; A += 1) {
                v = z.charCodeAt(A);
                w += y.charAt((v >>> 4) & 15) + y.charAt(v & 15)
            }
            return w
        }
        function l(v) {
            return unescape(encodeURIComponent(v))
        }
        function e(v) {
            return i(l(v))
        }
        function m(v) {
            return s(e(v))
        }
        function b(v, w) {
            return u(l(v), l(w))
        }
        function r(v, w) {
            return s(b(v, w))
        }
        function f(w, x, v) {
            if (!x) {
                if (!v) {
                    return m(w)
                }
                return e(w)
            }
            if (!v) {
                return r(x, w)
            }
            return b(x, w)
        }
        return f(w);
    };
    Sdk.prototype.queryElement = function(selector,source){
        return new Promise((resolve,rejcet)=>{
            let timer = setInterval(()=>{
                let _target = [];
                let body = ((source && source.contentDocument)?source.contentDocument:(source||document)).body
                if(body){ _target = body.querySelectorAll(selector); }
                if(_target.length>0) {
                    clearInterval(timer);
                    resolve(_target);
                }
            },100);
        });
    }
    Sdk.prototype.ajaxGet = function(url){
        return new Promise((resolve,rejcet)=>{
            GM_xmlhttpRequest({
                url:url,
                method:'get',
                headers: {"Content-Type": "application/json"},
                onload:function(response){
                    resolve(JSON.parse(response.responseText));
                }
            });
        });
    }
    Sdk.prototype.installHook=function(){
        let observer = new MutationObserver((mutations)=>{
            let cells=[];
            for(let mutation of mutations){
                if(mutation.type == 'childList'){
                    cells=[...mutation.addedNodes].filter(node=>{
                        return node.className=='cells';
                    });
                }
            }
            observer.disconnect();
            //console.log(cells);
        });
        observer.observe(_this.parent.coursetree, { childList: true });
    }
    Sdk.prototype.isVideo = function(attachment){
        return attachment.type == 'video';
    }
    Sdk.prototype.isVideoPass = function(attachment){
        return attachment.isPassed;
    }
    Sdk.prototype.playVideo = function(video){
        return video.videoEl.play();
    }
    Sdk.prototype.windowReload = function(){
        window.parent.location.reload();
    }
    Sdk.prototype.maskShow = function(){
        let menu = this.menu;
        let _targetEl = window.top.document.getElementById(menu.id);
        if(_targetEl){_targetEl.remove();}
        let div = document.createElement('div');
        div.id = menu.id;
        let title = (window.top.document.querySelector("#mainid > div.prev_title_pos > div") || window.top.document.querySelector("#mainid > h1")).innerText;
        let html = `<div id="menu" style="user-select:none;outline:ridge;padding:5px;z-index:99999;width:${menu.width}px;height:${menu.height}px;position:fixed;left:${menu.pos.x}px;top:${menu.pos.y}px;background:${menu.background};opacity:${menu.opacity};">`;
        let tmpHtml = `<h1 style="text-align:center;">${title}</h1><h2 style="text-align:center;font-size:10px;">By:汐</h2>`;
        tmpHtml += '数据获取中...';
        html += tmpHtml + `</div>`;
        div.innerHTML = html;
        window.top.document.body.append(div);
    }
    Sdk.prototype.maskHide = function(){
        // window.top[this.menu.id].remove();
        window.top[this.menu.id].innerHTML = '';
    }
    Sdk.prototype.getRurl = function(video,state = 0,playingTime=0){
        let format = "[{0}][{1}][{2}][{3}][{4}][{5}][{6}][{7}]",clipTime = (0 || "0") + "_" + (0 || window.parseInt(video.details.duration));
        let enc = _this.Ext.String.format(format,this.defaults.clazzId,this.defaults.userid,video.jobid || "",video.objectId,playingTime * 1000,"d_yHJ!$pdA~5",video.details.duration * 1000,clipTime);
        let isdrag = state; //0 4
        let t = new Date().getTime();
        if(state == 0){
            t -= window.parseInt(video.details.duration*1000);
        }
        return [this.defaults.reportUrl, "/", video.details.dtoken,"?clazzId=", this.defaults.clazzId,"&playingTime=", playingTime,"&duration=", video.details.duration,"&clipTime=", clipTime,"&objectId=", video.objectId,"&otherInfo=", video.otherInfo,"&jobid=", video.jobid,"&userid=", this.defaults.userid,"&isdrag=", isdrag,"&view=pc","&enc=", this.f(enc),"&rt=", 0.9,"&dtype=Video","&_t=", t].join("");
    }
    Sdk.prototype.getVideoEl = async function(attachment){
        for(let iframe of (await this.queryElement('iframe'))){
            let videoEl = (await this.queryElement('video',iframe))[0];
            if(videoEl){
                let http = await new Promise((resolve,rejcet)=>{
                    let timer = setInterval(()=>{
                        if(videoEl.src.length>0){
                            clearInterval(timer);
                            resolve(videoEl.src);
                        }
                    },100);
                });
                if(http == attachment.details.http) {return videoEl;}
            }
        }
    }
    Sdk.prototype.getVideoDetails = async function(attachment){
        return await this.ajaxGet('/ananas/status/'+attachment.objectId+'?k=' + this.defaults.fid+"&flag=normal");
    }
    Sdk.prototype.requestKillVideo = async function(rurl){
        return await this.ajaxGet(rurl);
    }
    Sdk.prototype.initData = async function(){
        try{
            this.maskShow();
            this.href = window.location.href;
            this.arg = _this.mArg;
            this.defaults = this.arg.defaults;
            this.videos.length = 0;
            for(let attachment of (this.arg.attachments)||[]){
                if(this.isVideo(attachment)){
                    attachment.details = await this.getVideoDetails(attachment);
                    //attachment.videoEl = await this.getVideoEl(attachment);
                    this.videos.push(attachment);
                }
            }
            this.maskHide();
            this.initMenu();
        }catch(e){
            alert('错误:'+e.message+" 请将错误信息反馈给作者");
        }
    }
    Sdk.prototype.initMenu = function(){
        let menu = this.menu;
        let title = (window.top.document.querySelector("#mainid > div.prev_title_pos > div") || window.top.document.querySelector("#mainid > h1")).innerText;
        let html = `<div id="menu" style="user-select:none;outline:ridge;padding:5px;z-index:99999;width:${menu.width}px;height:${menu.height}px;position:fixed;left:${menu.pos.x}px;top:${menu.pos.y}px;background:${menu.background};opacity:${menu.opacity};">`;
        let tmpHtml = `<h1 style="text-align:center;">${title}</h1><h2 style="text-align:center;font-size:10px;">By:汐</h2>`;
        if(this.videos.length>0){
            this.videos.forEach((video,index)=>{
                tmpHtml += `<p style="height:21px;color:${video.isPassed?'green':'orange'};clear:both;margin:5px 0;background:${index%2?'#F5F5F5':'#D9EDF7'};"><span>${index+1}</span> -> <span>${video.property.name}</span> -> <button style="float:right;" onclick="window[0].sdk.killVideo(${index});">杀死</button></p>`;
            });
            tmpHtml += `<div style="text-align:center;"><button onclick="window[0].sdk.killVideos();">章节通杀</button></div>`;
        }else{tmpHtml += '此章节没有视频';}
        html += tmpHtml + `</div>`;
        window.top[this.menu.id].innerHTML = html;
    }
    Sdk.prototype.killVideos = async function(){
        let fail=0,total=0;
        for(let video of this.videos){
            if(video.isPassed){continue;}
            total++;
            if(!this.startKill(video)||!this.endKill(video)){
                fail++;continue;
            }
        }
        alert(`本次章节通杀结束:总数[${this.videos.length}],任务[${total}],成功[${total-fail}],失败[${fail}]\n通杀成功结果还是黄色,不用再次杀死!!!`);
        this.windowReload();
    }
    Sdk.prototype.killVideo = async function(VideoIndex){
        let currentVideo = this.videos[VideoIndex];
        if(currentVideo.isPassed){return alert('兄弟,这个视频已经被杀死了!');}
        if(!this.startKill(currentVideo)){
            return alert('初始化视频失败,请重试');
        }
        if(!this.endKill(currentVideo)){
            return alert('杀死视频失败,请重试');
        }
        alert('成功杀死视频,如刷新还是黄字,请等待一段时间查看.');
        this.windowReload();
    }
    Sdk.prototype.startKill = async function(video){
        return await this.requestKillVideo(this.getRurl(video,0,0));
    }
    Sdk.prototype.endKill = async function(video){
        return await this.requestKillVideo(this.getRurl(video,4,video.details.duration));
    }
    _this.sdk = new Sdk({
        id:"xidaren",
        background:'transparent',
        opacity:1,
        pos:{
            x:10,
            y:80
        }
    });
})();
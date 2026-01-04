// ==UserScript==
// @name         RPGEN SNS - Embed URL
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  urls replace embed
// @author       You
// @match        https://rpgen.site/login/*
// @match        *.x-feeder.info/*/
// @exclude      *.x-feeder.info/*/*/*
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430730/RPGEN%20SNS%20-%20Embed%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/430730/RPGEN%20SNS%20-%20Embed%20URL.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const isHttps = url => new URL(url).protocol==="https:";
    const getFQDN = url => url.replace(/^.+?\/\/|\/.*$/g,""); // urlのホストを抽出
    const getDomain = url => getFQDN(url).split('.').reverse(); // urlのドメインを抽出
    // サイト別のurlを抽出する方法
    // ジャンプページを挟むサイトならそこからurlを抽出する必要がある
    let flag_ignoreFile_img = false; // 画像ファイルの拡張子があるURLを無視するフラグ
    let flag_ignoreFile_audio = false; // 音楽ファイルの拡張子があるURLを無視するフラグ
    let flag_ignoreFile_video = false; // 動画ファイルの拡張子があるURLを無視するフラグ
    const ignoreDomains = []; // 無視するドメイン。使用するサイトが対応済みのコンテンツを埋め込まないようにする
    const getURL_from_a_tag = (()=>{
        let sampleFunc = url => url;
        const d = getDomain(location.href);
        switch(d[1] + '.' + d[0]){
            case "x-feeder.info":
            case "drrrkari.com":
                sampleFunc = url => url.replace("/jump.php?url=","").replace("&skip=1","").replace("&locale=ja_JP","");
                break;
            case "3751chat.com":
                sampleFunc = url => url.replace("/JumpUrl/?url=","");
                break;
            case "5ch.net":
                sampleFunc = url => url.replace(/^.*\/\/jump\.5ch\.net\/\?/,"");
                break;
            case "open2ch.net":
                ignoreDomains.push("youtu.be");
                ignoreDomains.push("youtube.com");
                ignoreDomains.push("nicovideo.jp"); // 静画もとばっちりを受けるが面倒なので
                flag_ignoreFile_img = true; // 正確にはimgurの画像ファイルにしか対応していないが面倒なので
                break;
        }
        return a => {
            const href = a.attr("href");
            if(!href) return;
            const url = decodeURIComponent(href);
            return sampleFunc(url);
        };
    })();
    const get = (url, callback) => {
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: response => callback(response.responseText)
        });
    };
    const JSON_to_Query = JSON => {
        const array = [];
        for(const k in JSON) array.push(k+"="+JSON[k]);
        return "?"+array.join("&");
    };
    const makeError = () =>
    $("<div>",{text:"読み込みに失敗しました。"}).css({
        padding : "1em",
        backgroundColor: "pink",
        color: "red"
    });
    const bigImageHolder = $("<div>").appendTo($("body")).click(function(){$(this).hide()});
    // 画像ファイルの設置
    const setImage = (callback, title, src) =>
    callback($('<img>',{src:src}).click(()=>{
        const img = $("<img>",{src:src});
        bigImageHolder.empty().css({
            backgroundColor:"black",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 114514,
            width: $(window).width(),
            height: $(window).height(),
            textAlign: "center",
            display: "flex",
            "justify-content": "center",
            "align-items": "center",
        }).append(img).show();
        setImageCSS_fullScreenSize(img);
    }).on("error",function(){ // エラー時
        $(this).remove();
        callback(makeError());
    }));
    const setImageCSS_fullScreenSize = img => {
        const w =  $(window).width(), h = $(window).height();
        if(w < h) img.css({maxWidth:w});
        else img.css({maxHeight:h});
    };
    const makeOneCushion = (title, clickFunc) =>
    $("<div>",{text:"「"+title+"」をクリックで表示する"}).css({
        padding : "1em",
        backgroundColor: "black",
        color: "white"
    }).click(function(){
        $(this).remove();
        clickFunc();
    });
    const makeTag = (tag, src) => $("<" + tag + ">",{src: src})
    .on("error", function(){ // エラー時
        $(this).after(makeError());
        $(this).remove();
    }).attr({
        controls: ["audio","video"].indexOf(tag) !== -1 ? "controls" : null,
        allowfullscreen: tag === "iframe" ? "allowfullscreen" : null
    });
    const setContent = (callback, title, src, tag) => callback(makeOneCushion(title,()=>callback(makeTag(tag, src))));
    // 音楽ファイルの設置
    const setAudio = (callback, title, src) => setContent(callback, title, src, "audio");
    // 動画ファイルの設置
    const setVideo = (callback, title, src) => setContent(callback, title, src, "video");
    // iframeの設置
    const setIframe = (callback, title, src) => setContent(callback, title, src, "iframe");
    // getリクエストを送り、レスポンスからHTMLコードを探し出し、設置する
    const rob = (callback, title, src, func) =>
    callback(makeOneCushion(title,()=>
                            get(src,r=>{
        const result = func(r);
        if(result) callback(result);
        else callback(makeError());
    })
                           ));
    const show = (url, callback) => {
        const file_extension = url.replace(/\?.*$/,"").match(/\.([a-zA-Z0-9]+)$/);
        if(file_extension) {
            if(!flag_ignoreFile_img && ["jpg","JPG","jpeg","JPEG","gif","png","bmp","svg","ico"].indexOf(file_extension[1])!==-1) {
                return setImage(callback, "画像ファイル", url);
            }
            if(!flag_ignoreFile_audio && ["mp3","wma","wav","aac","ogg","m4a","flac"].indexOf(file_extension[1])!==-1) {
                return setAudio(callback, "音楽ファイル", url);
            }
            if(!flag_ignoreFile_video && ["mov","mp4","mpg","mpeg","avi","m4v","flv","wmv"].indexOf(file_extension[1])!==-1) {
                return setVideo(callback, "動画ファイル", url);
            }
        }
        let m, sub;
        const FQDN = getFQDN(url);
        const d = getDomain(url);
        if(ignoreDomains.indexOf(d[1] + '.' + d[0])!==-1) return;
        switch(d[1] + '.' + d[0]){
            case "youtu.be": // YouTube
                m = url.match(/youtu\.be\/([A-Za-z0-9_\-]+)/);
            case "youtube.com":
                if (/shorts/.test(url)) {
                    m = url.match(/shorts\/([A-Za-z0-9_\-]+)/);
                }
                if(!m) m = url.match(/\?v=([A-Za-z0-9_\-]+)/);
                if(!m) break;
                sub = url.match(/t(=[0-9]+)/);
                sub = sub ? "?start" + sub[1] : "";
                setIframe(callback, "YouTube", "//www.youtube.com/embed/" + m[1] + sub);
                break;
            case "nicovideo.jp":
            case "nico.ms":
                if(FQDN.indexOf("seiga.")!==-1){ // ニコニコ静画
                    m = url.match(/im([0-9]+)/);
                    if(!m) break;
                    setImage(callback, "ニコニコ静画", "//lohas.nicoseiga.jp/thumb/" + m[1] + "i");
                }
                else if(FQDN.indexOf("live2.")!==-1){ // ニコニコ生放送
                    m = url.match(/(lv[0-9]+)/);
                    if(!m) break;
                    setIframe(callback, "ニコニコ生放送", "//live.nicovideo.jp/embed/" + m[0]);
                }
                else if(FQDN.indexOf("game.")!==-1){ // RPGアツマール
                    m = url.match(/gm[0-9]+/);
                    if(!m) break;
                    setIframe(callback, "RPGアツマール", "//game.nicovideo.jp/atsumaru/externals/thumb/" + m[0]);
                }
                else { // ニコニコ動画
                    m = url.match(/sm[0-9]+/);
                    if(!m) break;
                    sub = url.match(/from(=[0-9]+)/);
                    sub = sub ? "?from" + sub[1] : "";
                    setIframe(callback, "ニコニコ動画", "//embed.nicovideo.jp/watch/" + m[0] + sub);
                }
                break;
            case "bilibili.com": // ビリビリ動画
                m = url.match(/av([0-9]+)/);
                if(!m) break;
                setIframe(callback, "ビリビリ動画", "//player.bilibili.com/player.html?page=1&aid=" + m[1]);
                break;
            case "fc2.com": // FC2動画
                if(FQDN.indexOf("video.")===-1) return;
                m = url.match(/\/\/.+\/content\/[0-9a-zA-Z]+/);
                if(!m) return;
                rob(callback, "FC2動画", "https:"+m[0], r=>$(r).find("embed").get(0));
                break;
            case "vimeo.com": // vimeo
                m = url.match(/([0-9]+)/);
                if(!m) break;
                setIframe(callback, "vimeo", "//player.vimeo.com/video/" + m[1]);
                break;
            case "9tsu.com": // 9TSU
                rob(callback, "9TSU", url, r=>makeTag("video",$(r).find("video").attr("src")));
                break;
            case "dailymotion.com": // Dailymotion
                m = url.match(/\/video\/([a-zA-Z0-9]+)/);
                if(!m) break;
                setIframe(callback, "Dailymotion", "//www.dailymotion.com/embed/video/" + m[1]);
                break;
            case "imgur.com": // imgur
                get(url, r=>{
                    m = r.match(/https?:\/\/i.imgur.com\/(.+)\./);
                    if(!m) return;
                    setImage(callback, "imgur", "//i.imgur.com/" + m[1] + ".gif");
                });
                break;
            case "gyazo.com": // gyazo
                m = url.match(/gyazo\.com\/([a-zA-Z0-9]+)/);
                if(!m) return;
                setImage(callback, "gyazo", "https://i.gyazo.com/"+m[1]+".png");
                break;
            case "pixiv.net": // pixiv
                m = url.match(/illust_id=([0-9]+)/);
                if(!m) break;
                setImage(callback, "pixiv", "//embed.pixiv.net/decorate.php?illust_id=" + m[1]);
                break;
            case "soundcloud.com": // SoundCloud
                rob(callback, "SoundCloud", url, r=>{
                    m = r.match(/soundcloud:\/\/(sounds|playlists):([0-9]+)/);
                    if(!m) return;
                    sub = m[1] === "sounds" ? "tracks" : m[1];
                    return makeTag("iframe","//w.soundcloud.com/player/?url=https://api.soundcloud.com/"+sub+"/"+m[2]+"&visual=true");
                });
                break;
            case "creofuga.net": // クレオフーガ
                m = url.match(/audios\/([0-9]+)/);
                if(!m) return;
                setIframe(callback,"クレオフーガ","https://creofuga.net/audios/player?color=black&id="+m[1]);
                break;
            case "google.com": // GoogleMap
                if(new URL(url).pathname !== "/maps/embed") return;
                setIframe(callback,"GoogleMap",url);
                break;
            case "twitter.com": // twitter
                rob(callback, "twitter", "https://publish.twitter.com/oembed"+JSON_to_Query({
                    url: url.replace(/\?.*$/g,""),
                    lang:"ja"
                }), r=>{
                    const json = {};
                    r.match(/"[A-Za-z0-9_]+":"[^,]*"/g).map(v=>v.slice(1,-1).split('":"')).map(v=>json[v[0]]=v[1]);
                    const jq = $(json.html.replace(/\\u003C/g,"<").replace(/\\u003E/g,">").replace(/\\\//g,"/").replace(/\\n/g,"").replace(/\\"/g,'"'));
                    jq.find("a").addClass(className);
                    jq.find("blockquote").css({
                        display: "inline-block",
                        padding: "16px",
                        margin: "10px 0",
                        "max-width": "468px",
                        border: "#ddd 1px solid",
                        "border-top-color": "#eee",
                        "border-bottom-color": "#bbb",
                        "border-radius": "5px",
                        "box-shadow": "0 1px 3px rgba(0,0,0,0.15)",
                        font: "bold 14px/18px Helvetica, Arial, sans-serif",
                        color: "#000"
                    });
                    jq.find("p").css({
                        font: 'normal 18px/24px Georgia, "Times New Roman", Palatino, serif',
                        margin: "0 5px 10px 0"
                    });
                    jq.find("a").css({
                        "font-weight": "normal",
                        color: "#666",
                        "font-size": "12px"
                    });
                    return jq;
                });
                break;
            case "bokete.jp": // bokete
                m = url.match(/https:\/\/bokete\.jp\/boke\/[0-9]+/);
                if(!m) break;
                rob(callback, "bokete", m[0], r => {
                    const dom = $(r.replace(/="\/([^\/])/g,'="//bokete.jp/$1')).find(".boke");
                    dom.find(".boke-meta").remove();
                    dom.find("img").css({
                        "width": "100%",
                        "max-width": "300px"
                    });
                    dom.find(".logo").find("img").css("width","5em");
                    dom.find(".boke-photo-meta").css("font-size","0.8em");
                    return dom;
                });
                break;
            case "greasyfork.org": // greasyfork
                m = url.match(/https:\/\/greasyfork\.org\/.*scripts\/[0-9]+/);
                if(!m) break;
                rob(callback, "greasyfork", m[0], r => {
                    const dom = $(r.replace(/="\/([^\/])/g,'="//greasyfork.org/$1')).find("#script-info");
                    const h = $("<div>");
                    dom.find("header").appendTo(h);
                    dom.find("#install-area").appendTo($("<button>").appendTo(h));
                    let div;
                    const dl = dom.find("#script-stats");
                    dom.find("#script-applies-to").children().each((i,e)=>dl.append($(e)));
                    dl.children().each((i,e)=>{
                        const now = i === 1 ? $(e).find("a") : $("<span>").text($(e).text());
                        if($(e).find("time").get(0)) now.text(makeDateStr(new Date($(e).find("time").attr("datetime"))));
                        if(i%2 === 0) {
                            div = $("<div>").appendTo(h);
                            now.css("font-weight","bold");
                        }
                        now.css("margin-left","1em").appendTo(div);
                    });
                    return h;
                });
                break;
            case "mit.edu": // mit.edu
                if(d[2] === "scratch"){ // Scratch
                    if(!/projects/.test(url)) break;
                    m = url.match(/[0-9]+/);
                    if(!m) break;
                    setIframe(elm=>callback(elm.attr({
                        allowtransparency: "true",
                        width: "485",
                        height: "402",
                        frameborder: "0",
                        scrolling: "no",
                        allowfullscreen: true,
                    })),"Scratch","https://scratch.mit.edu/projects/" + m[0] + "/embed");
                }
                break;
        }
    };
    const className = "readedClassName";
    const main = () => $("a").each((i,e)=>{
        const jq = $(e);
        if(jq.hasClass(className)) return true; // continue
        jq.addClass(className);
        const url = getURL_from_a_tag(jq);
        if(!url) return true;
        const d = getDomain(url);
        const d2 = getDomain(location.href);
        if(String(d2)===String(d)||!String(d).length) return true; // 同サイト内なら読まない
        show(url, r=>{
            jq.after($(r).css({
                maxWidth: "90%"
            })).after("<br>");
        });
    });
    setInterval(main, 1000);
    //-----------------------------------------------------------------
    const makeDateStr = date => { // Dateオブジェクトから日本時間を生成する関数
        const array = date.toString().split(' ');
        const year = array[3];
        const month = ("0"+(date.getMonth()+1)).slice(-2);
        const day = array[2];
        const dayOfWeek = [ "日", "月", "火y", "水", "木", "金", "土" ][date.getDay()];
        const time = array[4];
        return `${year}/${month}/${day} (${dayOfWeek}) ${time}`;
    };
})();
// ==UserScript==
// @name         Bgm观看进度同步(自用)
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  同步动漫网站的观看进度到bgm.tv
// @author       HinsChou
// @match        https://hinschou.github.io/bangumi.html?code=*

// @match        https://www.bilibili.com/bangumi/play/*

// @match        https://www.acfun.cn/bangumi/*

// @match        https://www.yhmgo.com/vp/*
// @match        https://www.yhmgo.com/tpsf/player/dpx2/*

// @match        https://www.yinhuadm.cc/p/*

// @match        https://www.dmmiku.com/index.php/vod/play/*
// @match        https://bf.bfdm.xyz/m3u8.php?url=*

// @connect      bgm.tv
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addValueChangeListener
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/421641/Bgm%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%E5%90%8C%E6%AD%A5%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/421641/Bgm%E8%A7%82%E7%9C%8B%E8%BF%9B%E5%BA%A6%E5%90%8C%E6%AD%A5%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    // 授权回调页面
    let api_uri = "https://api.bgm.tv";
    let token_url = 'https://bgm.tv/oauth/access_token';
    let redirect_uri = "https://hinschou.github.io/bangumi.html";
 
    // 全局参数
    let bgm_id = ""; // bgm番剧id
    let access_token = ""; // 授权凭证
    let user_id = ""; // 用户id
    let div_bgm;
    // 动态获取
    let watchedEp = {};
    let ep_id = "";

    // 播放器页面的类型
    let kv_iframe = {
        "https://www.yhmgo.com/tpsf": "yhdm",
        "https://bf.sbdm.cc/m3u8.php": "kudm",
        "https://bf.bfdm.xyz/m3u8.php": "kudm",
        "https://player.ikmz.cc/yinhua": "yinhua"
    }
    function getIframe(){
        let type = "";
        for(var key in kv_iframe){
            if(document.URL.indexOf(key) != -1){
                type = kv_iframe[key];
                break;
            }
        }
        return type;
    }

    // 播放页面的类型
    let kv_web = {
        "https://www.bilibili.com": "bilibili",
        "https://www.acfun.cn": "acfun",
        "https://www.yhmgo.com/vp": "yhmgo",
        "https://www.dmmiku.com/index.php/vod/play": "dmmiku",
        "https://www.yinhuadm.cc/p": "yinhuadm"
    }
    // 获取网站类型
    function getWebType(){
        let type = "";
        for(var key in kv_web){
            if(document.URL.indexOf(key) != -1){
                type = kv_web[key];
                break;
            }
        }
        return type;
    }

    // 网站属性
    var inputDiv; // 输入框位置
    var title = ""; // 番剧标题
    var web_video; // 播放视频
    function getWebsiteId(){
        let type = getWebType();
        console.log("getWebType", type);
        switch(type){
            case "bilibili":
                inputDiv = document.querySelector('.player-left-components .toolbar');
                title = document.querySelector('a[class^=mediainfo_mediaTitle__]').innerText;
                web_video = document.querySelector(".bpx-player-video-wrap video");
                break;
            case "acfun":
                inputDiv = document.querySelector("div.player-extend-wrap");
                title = document.querySelector(".part-title").innerText;
                web_video = document.querySelector(".container-video video");
                break;
            case "yhmgo":
                title = document.querySelectorAll(".gohome a")[2].innerText;
                inputDiv = document.querySelector("div.share.l");
                break;
            case "dmmiku":
                title = document.querySelector(".video_title h2.title").innerText;
                inputDiv = document.querySelector("div.player_detail");
                break;
            case "yinhuadm":
                title = document.querySelector(".module-info-heading h1 a").innerText;
                inputDiv = document.querySelector(".search-box");
                break;
        }
    }

    // 兼容firefox
    window.addEventListener('load', function() {
        onLoadWindow()
    });

    function onLoadWindow() {
        console.log("url", document.URL, getIframe());
        if(document.URL.indexOf(redirect_uri) != -1){
            let code = document.URL.replace(redirect_uri + "?code=", "");
            console.log("授权页面", code);
            if(code.length == 40){ // 正确回调
                getAccessToken(code);
            }
        }else if(getIframe() != ""){
            console.log("视频页面");
            setTimeout(function(){
                web_video = document.querySelector("video");
                listenVideo(true);
            }, 1000);
        }else{ // 播放页面
            console.log("播放页面");
            createSetting();
            initWeb();
        }
    }

    // 章节序号
    function getEpSort(){
        var sort = 0;
        let ep_title = "";
        switch(getWebType()){
            case "bilibili":
                var item_select = document.querySelector("[class*=numberListItem_select]");
                if(item_select){
                    sort = parseInt(item_select.innerText);
                }else{
                    item_select = document.querySelector("[class*=imageListItem_active]");
                    if(!item_select){
                        item_select = document.querySelector("[class*=longListItem_select]")
                    }
                    let title = item_select.title;
                    let number = title.match(/第.+话/gi)[0];
                    sort = parseInt(number.substring(1,number.length-1));
                }
                break;
            case "acfun":
                sort = parseInt(document.querySelector("li.single-p.active").attributes["data-index"].value) + 1;
                break;
            case "yhmgo":
                ep_title = document.querySelector(".movurls ul li.sel a").innerText;
                sort = parseInt(ep_title.substring(1, ep_title.length - 1));
                break;
            case "dmmiku":
                ep_title = document.querySelector("ul.content_playlist li.active a").innerText;
                sort = parseInt(ep_title.substring(1, ep_title.length - 1));
                break;
            case "yinhuadm":
                ep_title = document.querySelector(".module-play-list-content .active span").innerText;
                sort = parseInt(ep_title.substring(1, ep_title.length - 1));
                break;
        };
        console.log("章节索引", sort);
        return sort;
    }

    function wideScreen(){
        console.log("wideScreen", getWebType());
        switch(getWebType()){
            case "dmmiku":
                var right_row = document.querySelector("div.right_row");
                var is_right_none = right_row.style.display == "none"

                var left_row = document.querySelector("div.left_row");
                left_row.style.width = is_right_none ? "70%" : "100%";
                var player_video = document.querySelector("div.player_video.embed-responsive");
                player_video.style.height = is_right_none ? "11.8rem" : "17rem";

                right_row.style.display = is_right_none ? "block" : "none";
                break;
            case "yinhuadm":
                right_row = document.querySelector("div.module-player-side");
                is_right_none = right_row.style.display == "none"

                left_row = document.querySelector("div.player-box-main");
                left_row.style.width = is_right_none ? "80%" : "100%";

                right_row.style.display = is_right_none ? "block" : "none";
                break;
        }
    }

    function createSetting(){
        let style_input = ".bgm_input {" +
            "background-color: whitesmoke;" +
            "border: 1px solid deepskyblue; border-radius: 4px;" +
            "height: 28px; width: 180px;" +
            "padding: 0px 5px; color: deepskyblue;" +
            "}";
 
        let style_button = ".bgm_button {" +
            "background-color: deepskyblue;" +
            "border: 1px solid transparent; border-radius: 4px;" +
            "height: 28px;" +
            "padding: 0px 5px; margin-top: 10px;" +
            "color: white; cursor: pointer;" +
            "}";
 
        let style_card = ".bgm_card {" +
            "background-color: white; box-shadow: 0 0 4px 0 lightgrey;" +
            "border: 1px solid deepskyblue; border-radius: 4px;" +
            "padding: 10px; text-align: left;" +
            "z-index: 2147483647; position: absolute; width: 200px; display: none;" +
            "}";
 
        let style_p = ".bgm_p {" +
            "margin-top: 10px; margin-bottom: 10px;" +
            "font-size: 14px;" +
            "}";
 
        GM_addStyle(style_input);
        GM_addStyle(style_button);
        GM_addStyle(style_card);
        GM_addStyle(style_p);
 
        let div_setting = document.createElement("div");
        div_setting.className = "bgm_card";
        div_setting.id = "bgm_setting";
        div_setting.style = "right: 60px; top: 60px;";
 
        let p_app_id = document.createElement("p");
        p_app_id.className = "bmg_p";
        p_app_id.innerText = "App ID";
        p_app_id.style = "margin-bottom: 10px;";
 
        let input_app_id = document.createElement("input");
        input_app_id.className = "bgm_input";
        input_app_id.id = "input_app_id";
 
        let p_app_secret = document.createElement("p");
        p_app_secret.className = "bmg_p";
        p_app_secret.innerText = "App Secret";
        p_app_secret.style = "margin-top: 10px; margin-bottom: 10px;";
 
        let input_app_secret = document.createElement("input");
        input_app_secret.className = "bgm_input";
        input_app_secret.id = "input_app_secret";
 
        let button_save = document.createElement("button");
        button_save.className = "bgm_button";
        button_save.innerText = "保存";
        button_save.onclick = function(){
            let input_app_id = document.getElementById("input_app_id");
            let input_app_secret = document.getElementById("input_app_secret");
            if(input_app_id.value == "" || input_app_secret.value == ""){
                alert("请输入");
            }else{
                GM_setValue("app_id", input_app_id.value);
                GM_setValue("app_secret", input_app_secret.value);
                openAccessTab();
 
                let bgm_setting = document.getElementById("bgm_setting");
                bgm_setting.style.display = "none";
            }
        };
 
        let button_close = document.createElement("button");
        button_close.className = "bgm_button";
        button_close.innerText = "取消";
        button_close.style = "margin-left: 20px; background-color: gray; border: 1px solid gray";
        button_close.onclick = function(){
            let bgm_setting = document.getElementById("bgm_setting");
            bgm_setting.style.display = "none";
        };
 
        div_setting.appendChild(p_app_id);
        div_setting.appendChild(input_app_id);
        div_setting.appendChild(p_app_secret);
        div_setting.appendChild(input_app_secret);
 
        div_setting.appendChild(button_save);
        div_setting.appendChild(button_close);
 
        document.body.appendChild(div_setting);
 
        let app_id = GM_getValue("app_id", "");
        let app_secret = GM_getValue("app_secret", "");
 
        input_app_id.value = app_id;
        input_app_secret.value = app_secret;

        GM_registerMenuCommand("API设置", function(){
            let bgm_setting = document.getElementById("bgm_setting");
            bgm_setting.style.display = "block";
        }, "bgm.tv");
    }

    // 创建番剧信息板块
    function createBgmDiv(){
        console.log("createBgmDiv");
        let div_bgm = document.createElement("div");
        div_bgm.style = "float: right;";

        let button_show = document.createElement("button");
        button_show.className = "bgm_button";
        button_show.style = "margin-top: 5px; margin-right: 5px;";
        button_show.onclick = function(){
            let bgm_card = document.getElementById("bgm_card");
//             console.log("button_show", bgm_card.style.display);
            if(bgm_card.style.display == "block"){
                bgm_card.style.display = "none";
            }else{
                bgm_card.style.display = "block";
            }
        };
        button_show.innerText = "番组计划";

        let bgm_card = document.createElement("div");
        bgm_card.className = "bgm_card";
        bgm_card.id = "bgm_card";
        bgm_card.style = "margin-top: 5px;"

        let p_subject = document.createElement("p");
        p_subject.innerText = "番剧标题";
        p_subject.className = "bgm_p";
        p_subject.style.marginTop = "0px";
        p_subject.id = "p_subject_name";

        let input_bgm = document.createElement("input");
        input_bgm.placeholder = "番剧ID";
        input_bgm.id = "input_subject_id";
        input_bgm.className = "bgm_input"

        let button_bgm = document.createElement("button");
        button_bgm.innerText = "保存";
        button_bgm.className = "bgm_button";
        button_bgm.onclick = function(){
            let id = input_bgm.value;
            console.log("修改的番剧ID", id);
            if(id == ""){
                bgm_id = "";
                getSubjectId(title, false);
            }else{
                getSubject(id);
                setSubject(id, "");
            }
        };

        let button_collect = document.createElement("button");
        button_collect.className = "bgm_button";
        button_collect.id = "button_collect";
        button_collect.style = "background-color: hotpink; margin-left: 10px;";
        button_collect.innerText = "收藏";
        button_collect.onclick = function(){
            collectSubject(bgm_id);
        }

        let button_wide = document.createElement("button");
        button_wide.className = "bgm_button";
        button_wide.id = "button_wide";
        button_wide.style = "background-color: red; margin-left: 10px;";
        button_wide.innerText = "宽屏";
        button_wide.onclick = function(){
            wideScreen();
        }

        let p_ep = document.createElement("p");
        p_ep.innerText = "章节标题";
        p_ep.className = "bgm_p";
        p_ep.id = "p_ep_name";

        let input_ep = document.createElement("input");
        input_ep.placeholder = "章节ID";
        input_ep.id = "input_ep_id";
        input_ep.className = "bgm_input"

        let button_ep = document.createElement("button");
        button_ep.innerText = "保存";
        button_ep.className = "bgm_button";
        button_ep.onclick = function(){
            ep_id = input_ep.value;
            console.log("修改的章节ID", ep_id);
        };

        let button_watched = document.createElement("button");
        button_watched.className = "bgm_button";
        button_watched.id = "button_watched";
        button_watched.style = "background-color: hotpink; margin-left: 10px;";
        button_watched.innerText = "未看过";
        button_watched.onclick = function(){
            ep_id = input_ep.value;
            watchEp(ep_id);
        }

        let span_progress = document.createElement("span");
        span_progress.id = "span_progress";
        span_progress.style = "margin-left: 10px";
        span_progress.innerText = "0%";

        bgm_card.appendChild(p_subject);
        bgm_card.appendChild(input_bgm);
        bgm_card.appendChild(button_bgm);
        bgm_card.appendChild(button_collect);
        bgm_card.appendChild(button_wide);

        bgm_card.appendChild(p_ep);
        bgm_card.appendChild(input_ep);
        bgm_card.appendChild(button_ep);
        bgm_card.appendChild(button_watched);
        bgm_card.appendChild(span_progress);

        div_bgm.appendChild(button_show);
        div_bgm.appendChild(bgm_card);
        console.log("div_bgm", div_bgm);
        return div_bgm;
    }

    // 看过章节
    function watchEp(ep_id){
        if(ep_id == "" || access_token == "" || watchedEp[ep_id]){
            return;
        }
 
        let url_watch = api_uri + "/ep/" + ep_id + "/status/watched?access_token=" + access_token;
        console.log("url_watch", url_watch);
        GM_xmlhttpRequest({ // 标记章节为看过
            url: url_watch,
            method: "get",
            onload: function(res){
                console.log("watched", res.responseText);
                let jsonRes = JSON.parse(res.responseText);
                if(jsonRes.code == 200){
                    let button_watched = document.getElementById("button_watched");
                    button_watched.innerText = "已看过";
                    button_watched.style.backgroundColor = "lightseagreen";
                }
            }
        });
        watchedEp[ep_id] = true;
    }
 
    function getEpId(subject_id){
        // 预告不查询
        let badge = document.querySelector(".ep-item.cursor div.badge");
        if(subject_id == "" || (badge != null && badge.innerText == "预告")){
            return;
        }
        console.log("查询番剧章节", subject_id);
 
        let sort = getEpSort();
        let url_ep = api_uri + "/subject/" + subject_id + "/ep";
        console.log("url_ep", url_ep);
        GM_xmlhttpRequest({ // 查询番剧所有章节
            url: url_ep,
            method: "get",
            onload: function(res){
                // console.log(res);
                let json_eps = JSON.parse(res.responseText);
                if(typeof json_eps.eps == "undefined"){
                    return;
                }
                let eps = json_eps.eps;
                //console.log("番剧章节数", eps);
                if(eps == null){
                    return;
                }
                // 获取章节id
                let ep = null;
                for(let i in eps){
                    if(eps[i].type == 0 && eps[i].sort == sort){
                        ep = eps[i];
                    }
                }
                if(ep == null){
                    for(let i in eps){
                        if(eps[i].type == 0 && i == sort - 1){
                            ep = eps[i];
                        }
                    }
                }

                ep_id = ep.id;
                let ep_name = ep.name_cn;
                if(ep_name == ""){
                    ep_name = ep.name;
                }
                console.log("章节ID", ep_id, ep_name);
                let input_ep_id = document.getElementById("input_ep_id");
                input_ep_id.value = ep_id;
                let p_ep_name = document.getElementById("p_ep_name");
                p_ep_name.innerText = ep_name;
 
                let button_watched = document.getElementById("button_watched");
                button_watched.innerText = "未看过";
                button_watched.style.backgroundColor = "hotpink";
                getUserProgress(user_id);
            }
        });
    }
 
    function getUserProgress(user_id){
        if(user_id == "" || access_token == ""){
            return;
        }
 
        let url_progress = api_uri + "/user/" + user_id + "/progress?access_token=" + access_token;
        //console.log("url_progress", url_progress);
        GM_xmlhttpRequest({
           url: url_progress,
            method: "get",
            onload: function(res){
                let subjects = JSON.parse(res.responseText);
                console.log("已看番剧", subjects.length);
                for(let i in subjects){
                    let subject = subjects[i];
                    if(subject.subject_id == bgm_id){
                        let eps = subject.eps;
                        console.log("已看章节", eps.length);
                        for(let j in eps){
                            let ep = eps[j];
                            if(ep.id == ep_id && ep.status.css_name == "Watched"){
                                let button_watched = document.getElementById("button_watched");
                                button_watched.innerText = "已看过";
                                button_watched.style.backgroundColor = "lightseagreen";
                                watchedEp[ep_id] = true;
                                break;
                            }
                        }
                    }
                }
            }
        });
    }
 
    function getSubjectId(title, split){
        if(bgm_id != ""){
            return;
        }
 
        let title_old = title;
 
        // 繁体转简体
        if(title.indexOf("（僅限港澳台地區）") != -1){
            title = title.replace("（僅限港澳台地區）", "");
            title = simplized(title);
        }else if(title.indexOf("（僅限台灣地區）") != -1){
            title = title.replace("（僅限台灣地區）", "");
            title = simplized(title);
        }
        title_old = title;

        if(split){
            // 提取番剧主标题
            if(title.indexOf("/") != -1){
                title = title.substring(0, title.indexOf("/"));
            }else if(title.indexOf(" ") != -1){
                title = title.substring(0, title.indexOf(" "));
            }else if(title.indexOf("：") != -1){
                title = title.substring(0, title.indexOf("："));
            }else if(title.indexOf(" -") != -1){
                title = title.substring(0, title.indexOf(" -"));
            }
        }

        console.log("搜索标题", title_old, title);
 
        // 搜索标题
        var url_search = api_uri + "/search/subject/" + encodeURI(title) + "?type=2";
        console.log("url_search", url_search);
        let input_subject_id = document.getElementById("input_subject_id");
        input_subject_id.placeholder = "搜索标题中";
        GM_xmlhttpRequest({
            url:  url_search,
            method: "get",
            onload: function(res){
                //console.log(res.responseText);
                let json_search = JSON.parse(res.responseText);
                if(json_search.code != 404 && typeof json_search.list != "undefined"){
                    let subjects = json_search.list;
                    console.log("搜索结果个数", subjects.length);
 
                    if(json_search.list.length == 1){ // 单个结果
                        let id = json_search.list[0].id;
                        let name = json_search.list[0].name_cn;
                        if(name == ""){
                            name = json_search.list[0].name;
                        }
                        console.log("搜索到单个番剧", id, name);
                        setSubject(id, name);
                    } else {
                        input_subject_id.placeholder = "对比标题";
                        // 通过标题判断
                        for(let i in subjects){
                            let subject_id = subjects[i].id;
                            let subject_name = subjects[i].name;
                            let subject_name_cn = subjects[i].name_cn;
                            console.log("遍历搜索结果", subject_name, subject_name_cn);
                            if(subject_name == title){
                                console.log("原名称相同", subject_id, subject_name);
                                setSubject(subject_id, subject_name);
                                return;
                            }else if(subject_name_cn == title){
                                console.log("中文名称相同", subject_id, subject_name_cn);
                                setSubject(subject_id, subject_name_cn);
                                return;
                            }else if(subjects[i].name_cn != "" && title_old.indexOf(subjects[i].name_cn) != -1){ // 中文标题一致
                                console.log("包含中文名称", subject_id, subject_name_cn);
                                setSubject(subject_id, subject_name_cn);
                                return;
                            }
                        }
                        if(user_id != ""){ // 多个结果
                             // 通过收藏判断
                             input_subject_id.placeholder = "对比收藏";
                             getCollection("", subjects, title, split);
 
                             // 未找到
                             input_subject_id.placeholder = "未找到";
                         }
                    }
                }else if(json_search.code == 404 && !split) {
                    getSubjectId(title, true);
                }
 
            }
        });
    }
 
    function getCollection(id, subjects, title, split){
        var url_collection = api_uri + "/user/" + user_id + "/collection?cat=watching&t=" + new Date().getTime();
        console.log("url_collection", url_collection);
 
        GM_xmlhttpRequest({ // 查询用户收藏
            url: url_collection,
            method: "get",
            onload: function(res){
                let collections = JSON.parse(res.responseText);
                console.log("我的收藏个数", collections.length);
 
                if(id != ""){
                    setCollection(id, collections);
                }else{
                    for(let i in subjects){
                        for(let j in collections){
                            // 搜索id和在看收藏id一致
                            if(subjects[i].id == collections[j].subject_id){
                                let id = subjects[i].id;
                                let name = subjects[i].name_cn;
                                if(name == ""){
                                    name = subjects[i].name;
                                }
                                console.log("对比收藏的番剧ID", id, name);
                                setSubject(id, name);
                                return;
                            }
                        }
                    }
                    if(!split){
                        getSubjectId(title, true);
                    }
                }
            }
        });
    }
 
    function setCollection(id, collections){
        console.log("检查收藏", id);
        let button_collect = document.getElementById("button_collect");
        for(let j in collections){
          //  console.log("收藏", collections[j].name, collections[j].subject_id);
            if(id == collections[j].subject_id){ // 已收藏
                button_collect.innerText = "已收藏";
                button_collect.style.backgroundColor = "lightseagreen";
                break;
            }
        }
    }

    const progress_min = 85;
    let progress_last = 0;
    function listenVideo(is_iframe){
        console.log("是否内嵌页面", is_iframe);
        // 进度监听
        if(web_video != null){
            web_video.addEventListener("timeupdate", function(){
                // 观看进度大于85%, 标记为看完
                // console.log("观看进度", web_video.currentTime);
                let progress = parseInt(web_video.currentTime * 100 / web_video.duration);
                if(progress != progress_last){
                    progress_last = progress;
                }
                if(is_iframe){
                    GM_setValue("timeupdate", progress);
                }else{
                    let span_progress = document.getElementById("span_progress");
                    span_progress.innerText = progress + "%";
                    if(progress > progress_min){
                        watchEp(ep_id);
                    }
                }
            });
            web_video.addEventListener("loadstart", function(){
                setTimeout(function(){
                    getEpId(bgm_id);
                }, 1000);
            });
            console.log("开始监听视频进度", web_video.src);
        }

        if(!is_iframe){
            GM_addValueChangeListener("timeupdate", function(name, old_value, new_value, remote){
//                 console.log("GM_addValueChangeListener timeupdate", new_value);
                let span_progress = document.getElementById("span_progress");
                span_progress.innerText = new_value + "%";
                if(new_value > progress_min){
                    watchEp(ep_id);
                }
            });
        }
    }

 
    // 设置番剧ID
    function setSubject(id, name){
        console.log("设置番剧信息", id, name);
 
        bgm_id = id;
        GM_setValue(title, id);
        let input_subject_id = document.getElementById("input_subject_id");
        input_subject_id.value = id;
 
        if(name != ""){
            let p_subject_name = document.getElementById("p_subject_name");
            p_subject_name.innerText = name;
            GM_setValue(id, name);
        }
 
        getCollection(id, [], title, true);
        getEpId(id);
    }
 
    function getSubject(id){
        console.log("获取番剧信息", id);
        let url_subject = api_uri + "/subject/" + id + "?responseGroup=Small";
        console.log("url_subject", url_subject);
        GM_xmlhttpRequest({ // 查询用户收藏
            url: url_subject,
            method: "get",
            onload: function(res){
                let response = JSON.parse(res.responseText);
                let p_subject_name = document.getElementById("p_subject_name");
                let name_cn = response.name_cn;
                p_subject_name.innerText = name_cn;
                GM_setValue(id, name_cn);
            }
        });
    }

    function collectSubject(subject_id){
        console.log("collectSubject", subject_id, access_token);
        if(subject_id == "" || access_token == ""){
            return;
        }
 
        let url_collect = api_uri + "/collection/" + subject_id + "/update?access_token=" + access_token;
        console.log("url_collect", url_collect);
        let body = "status=do";
        GM_xmlhttpRequest({
            url: url_collect,
            method: "post",
            data: body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                let json = JSON.parse(res.responseText);
                if(json.ep_status == 0){
                    let button_collect = document.getElementById("button_collect");
                    button_collect.innerText = "已收藏";
                    button_collect.style.backgroundColor = "lightseagreen";
                }
            }
        });
    }
 
    // 添加番剧信息
    function insertBangumiInfo(){
        let div_bgm = createBgmDiv();

        // 获取番剧标题
        getWebsiteId();
        let id = GM_getValue(title, "");
        let name = GM_getValue(id, "");
        console.log("保存的番剧ID", id, name);

        listenVideo(false);

        // 手动保存输入框
        inputDiv.appendChild(div_bgm);
        if(id == ""){ // 查询番剧id
            getSubjectId(title, false);
        }else{
            setSubject(id, name);
        }
    }
 
 
  // 初始化页面
    function initWeb(){
        // 获取token
        access_token = GM_getValue("access_token", "");
        user_id = GM_getValue("user_id", "");
        let refresh_token = GM_getValue("refresh_token", "");
        let expires_end = GM_getValue("expires_end", 0);
        console.log("授权凭证", access_token, user_id, expires_end);
        // 未授权或授权过期
        if(new Date().getTime() > expires_end && refresh_token != ""){
            console.log("更新授权", refresh_token);
            updateToken(refresh_token);
        }else if(!access_token || !user_id){
            console.log("打开授权");
            openAccessTab();
        }else{
            console.log("添加菜单");
            // 手动设置 输入框
            insertBangumiInfo();
        }
    }
 
    function updateToken(refresh_token){
        let url_refresh = token_url;
        console.log("url_refresh", url_refresh);
 
        let app_id = GM_getValue("app_id", "");
        let app_secret = GM_getValue("app_secret", "");
        let body = 'grant_type=refresh_token'+
            '&client_id=' + app_id +
            '&client_secret=' + app_secret +
            '&refresh_token=' + refresh_token +
            '&redirect_uri=' + redirect_uri;
        GM_xmlhttpRequest({
            url: url_refresh,
            method: "post",
            data: body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                let response = getResponse(res);
                if(response.error != null){
                    openAccessTab();
                }else{
                    let jsonToken = response;
                    GM_setValue("expires_end", jsonToken.expires_in * 1000 + new Date().getTime());
                    GM_setValue("user_id", jsonToken.user_id);
                    GM_setValue("refresh_token", jsonToken.refresh_token);
                    // GM_setValue("token_type", res.response.token_type);
 
                    // 最后设置, 触发监听器
                    GM_setValue("access_token", jsonToken.access_token);
                }
            }
        });
    }
 
    // 打开授权页面
    function openAccessTab(){
        let app_id = GM_getValue("app_id", "");
        if(app_id == ""){
            console.log("未设置API");
            return;
        }
        let access_url = "https://bgm.tv/oauth/authorize?client_id=" + app_id + "&response_type=code";
        GM_openInTab(access_url, {
            active: true,
            insert: true
        });
 
        setTimeout(function(){
            GM_addValueChangeListener("access_token", function(name, old_value, new_value, remote){
                console.log("ValueChange", name, new_value);
                access_token = GM_getValue("access_token", "");
                user_id = GM_getValue("user_id", "");
                if(access_token != ""){
                    insertBangumiInfo();
                }
            });
            console.log("GM_addValueChangeListener user_id");
        }, 1000);
    }
 
    // 通过授权码获取授权凭证
    function getAccessToken(code){
        let app_id = GM_getValue("app_id", "");
        let app_secret = GM_getValue("app_secret", "");
 
        let body = 'grant_type=authorization_code'+
        '&client_id=' + app_id +
        '&client_secret=' + app_secret +
        '&code=' + code +
        '&redirect_uri=' + redirect_uri;
        console.log(body);
        // 获取token
        GM_xmlhttpRequest({
            url: token_url,
            method: "post",
            data: body,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: function(res){
                let response = getResponse(res);
 
                if(response.error != null){
                    document.body.innerText = "授权失败, 请刷新此页面: " + response.error_description ;
                    return;
                }
                let jsonToken = response;
                // 保存token
                if(typeof jsonToken.access_token != undefined){
                    GM_setValue("expires_end", jsonToken.expires_in * 1000 + new Date().getTime());
                    GM_setValue("user_id", jsonToken.user_id);
                    GM_setValue("refresh_token", jsonToken.refresh_token);
                    // GM_setValue("token_type", res.response.token_type);
 
                    // 最后设置, 触发监听器
                    GM_setValue("access_token", jsonToken.access_token);
                    console.log("set access_token", jsonToken.access_token);
                    document.body.innerText = "授权成功, 请关闭此页面";
                }
            },
            onerror: function(error){
                console.log(error);
            }
        });
    }
 
    function getResponse(res){
        let response = {error:"", error_description: ""};
        console.log("getResponse", res);
        if(res.responseText != null){
            try{
                response = JSON.parse(res.responseText);
            }catch(e){
                console.log(res, "解析出错");
            }
        }
        return response;
    }
 
    function charPYStr(){
		return '仆为锕皑蔼碍爱嗳嫒瑷暧霭谙铵鹌肮袄奥媪骜鳌坝罢钯摆败呗颁办绊钣帮绑镑谤剥饱宝报鲍鸨龅辈贝钡狈备惫鹎贲锛绷笔毕毙币闭荜哔滗铋筚跸边编贬变辩辫苄缏笾标骠飑飙镖镳鳔鳖别瘪濒滨宾摈傧缤槟殡膑镔髌鬓饼禀拨钵铂驳饽钹鹁补钸财参蚕残惭惨灿骖黪苍舱仓沧厕侧册测恻层诧锸侪钗搀掺蝉馋谗缠铲产阐颤冁谄谶蒇忏婵骣觇禅镡场尝长偿肠厂畅伥苌怅阊鲳钞车彻砗尘陈衬伧谌榇碜龀撑称惩诚骋枨柽铖铛痴迟驰耻齿炽饬鸱冲冲虫宠铳畴踌筹绸俦帱雠橱厨锄雏础储触处刍绌蹰传钏疮闯创怆锤缍纯鹑绰辍龊辞词赐鹚聪葱囱从丛苁骢枞凑辏蹿窜撺错锉鹾达哒鞑带贷骀绐担单郸掸胆惮诞弹殚赕瘅箪当挡党荡档谠砀裆捣岛祷导盗焘灯邓镫敌涤递缔籴诋谛绨觌镝颠点垫电巅钿癫钓调铫鲷谍叠鲽钉顶锭订铤丢铥东动栋冻岽鸫窦犊独读赌镀渎椟牍笃黩锻断缎簖兑队对怼镦吨顿钝炖趸夺堕铎鹅额讹恶饿谔垩阏轭锇锷鹗颚颛鳄诶儿尔饵贰迩铒鸸鲕发罚阀珐矾钒烦贩饭访纺钫鲂飞诽废费绯镄鲱纷坟奋愤粪偾丰枫锋风疯冯缝讽凤沣肤辐抚辅赋复负讣妇缚凫驸绂绋赙麸鲋鳆钆该钙盖赅杆赶秆赣尴擀绀冈刚钢纲岗戆镐睾诰缟锆搁鸽阁铬个纥镉颍给亘赓绠鲠龚宫巩贡钩沟苟构购够诟缑觏蛊顾诂毂钴锢鸪鹄鹘剐挂鸹掴关观馆惯贯诖掼鹳鳏广犷规归龟闺轨诡贵刽匦刿妫桧鲑鳜辊滚衮绲鲧锅国过埚呙帼椁蝈铪骇韩汉阚绗颉号灏颢阂鹤贺诃阖蛎横轰鸿红黉讧荭闳鲎壶护沪户浒鹕哗华画划话骅桦铧怀坏欢环还缓换唤痪焕涣奂缳锾鲩黄谎鳇挥辉毁贿秽会烩汇讳诲绘诙荟哕浍缋珲晖荤浑诨馄阍获货祸钬镬击机积饥迹讥鸡绩缉极辑级挤几蓟剂济计记际继纪讦诘荠叽哜骥玑觊齑矶羁虿跻霁鲚鲫夹荚颊贾钾价驾郏浃铗镓蛲歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧谏缣戋戬睑鹣笕鲣鞯将浆蒋桨奖讲酱绛缰胶浇骄娇搅铰矫侥脚饺缴绞轿较挢峤鹪鲛阶节洁结诫届疖颌鲒紧锦仅谨进晋烬尽劲荆茎卺荩馑缙赆觐鲸惊经颈静镜径痉竞净刭泾迳弪胫靓纠厩旧阄鸠鹫驹举据锯惧剧讵屦榉飓钜锔窭龃鹃绢锩镌隽觉决绝谲珏钧军骏皲开凯剀垲忾恺铠锴龛闶钪铐颗壳课骒缂轲钶锞颔垦恳龈铿抠库裤喾块侩郐哙脍宽狯髋矿旷况诓诳邝圹纩贶亏岿窥馈溃匮蒉愦聩篑阃锟鲲扩阔蛴蜡腊莱来赖崃徕涞濑赉睐铼癞籁蓝栏拦篮阑兰澜谰揽览懒缆烂滥岚榄斓镧褴琅阆锒捞劳涝唠崂铑铹痨乐鳓镭垒类泪诔缧篱狸离鲤礼丽厉励砾历沥隶俪郦坜苈莅蓠呖逦骊缡枥栎轹砺锂鹂疠粝跞雳鲡鳢俩联莲连镰怜涟帘敛脸链恋炼练蔹奁潋琏殓裢裣鲢粮凉两辆谅魉疗辽镣缭钌鹩猎临邻鳞凛赁蔺廪檩辚躏龄铃灵岭领绫棂蛏鲮馏刘浏骝绺镏鹨龙聋咙笼垄拢陇茏泷珑栊胧砻楼娄搂篓偻蒌喽嵝镂瘘耧蝼髅芦卢颅庐炉掳卤虏鲁赂禄录陆垆撸噜闾泸渌栌橹轳辂辘氇胪鸬鹭舻鲈峦挛孪滦乱脔娈栾鸾銮抡轮伦仑沦纶论囵萝罗逻锣箩骡骆络荦猡泺椤脶镙驴吕铝侣屡缕虑滤绿榈褛锊呒妈玛码蚂马骂吗唛嬷杩买麦卖迈脉劢瞒馒蛮满谩缦镘颡鳗猫锚铆贸麽没镁门闷们扪焖懑钔锰梦眯谜弥觅幂芈谧猕祢绵缅渑腼黾庙缈缪灭悯闽闵缗鸣铭谬谟蓦馍殁镆谋亩钼呐钠纳难挠脑恼闹铙讷馁内拟腻铌鲵撵辇鲶酿鸟茑袅聂啮镊镍陧蘖嗫颟蹑柠狞宁拧泞苎咛聍钮纽脓浓农侬哝驽钕诺傩疟欧鸥殴呕沤讴怄瓯盘蹒庞抛疱赔辔喷鹏纰罴铍骗谝骈飘缥频贫嫔苹凭评泼颇钋扑铺朴谱镤镨栖脐齐骑岂启气弃讫蕲骐绮桤碛颀颃鳍牵钎铅迁签谦钱钳潜浅谴堑佥荨悭骞缱椠钤枪呛墙蔷强抢嫱樯戗炝锖锵镪羟跄锹桥乔侨翘窍诮谯荞缲硗跷窃惬锲箧钦亲寝锓轻氢倾顷请庆揿鲭琼穷茕蛱巯赇虮鳅趋区躯驱龋诎岖阒觑鸲颧权劝诠绻辁铨却鹊确阕阙悫让饶扰绕荛娆桡热韧认纫饪轫荣绒嵘蝾缛铷颦软锐蚬闰润洒萨飒鳃赛伞毵糁丧骚扫缫涩啬铯穑杀刹纱铩鲨筛晒酾删闪陕赡缮讪姗骟钐鳝墒伤赏垧殇觞烧绍赊摄慑设厍滠畲绅审婶肾渗诜谂渖声绳胜师狮湿诗时蚀实识驶势适释饰视试谥埘莳弑轼贳铈鲥寿兽绶枢输书赎属术树竖数摅纾帅闩双谁税顺说硕烁铄丝饲厮驷缌锶鸶耸怂颂讼诵擞薮馊飕锼苏诉肃谡稣虽随绥岁谇孙损笋荪狲缩琐锁唢睃獭挞闼铊鳎台态钛鲐摊贪瘫滩坛谭谈叹昙钽锬顸汤烫傥饧铴镗涛绦讨韬铽腾誊锑题体屉缇鹈阗条粜龆鲦贴铁厅听烃铜统恸头钭秃图钍团抟颓蜕饨脱鸵驮驼椭箨鼍袜娲腽弯湾顽万纨绾网辋韦违围为潍维苇伟伪纬谓卫诿帏闱沩涠玮韪炜鲔温闻纹稳问阌瓮挝蜗涡窝卧莴龌呜钨乌诬无芜吴坞雾务误邬庑怃妩骛鹉鹜锡牺袭习铣戏细饩阋玺觋虾辖峡侠狭厦吓硖鲜纤贤衔闲显险现献县馅羡宪线苋莶藓岘猃娴鹇痫蚝籼跹厢镶乡详响项芗饷骧缃飨萧嚣销晓啸哓潇骁绡枭箫协挟携胁谐写泻谢亵撷绁缬锌衅兴陉荥凶汹锈绣馐鸺虚嘘须许叙绪续诩顼轩悬选癣绚谖铉镟学谑泶鳕勋询寻驯训讯逊埙浔鲟压鸦鸭哑亚讶垭娅桠氩阉烟盐严岩颜阎艳厌砚彦谚验厣赝俨兖谳恹闫酽魇餍鼹鸯杨扬疡阳痒养样炀瑶摇尧遥窑谣药轺鹞鳐爷页业叶靥谒邺晔烨医铱颐遗仪蚁艺亿忆义诣议谊译异绎诒呓峄饴怿驿缢轶贻钇镒镱瘗舣荫阴银饮隐铟瘾樱婴鹰应缨莹萤营荧蝇赢颖茔莺萦蓥撄嘤滢潆璎鹦瘿颏罂哟拥佣痈踊咏镛优忧邮铀犹诱莸铕鱿舆鱼渔娱与屿语狱誉预驭伛俣谀谕蓣嵛饫阈妪纡觎欤钰鹆鹬龉鸳渊辕园员圆缘远橼鸢鼋约跃钥粤悦阅钺郧匀陨运蕴酝晕韵郓芸恽愠纭韫殒氲杂灾载攒暂赞瓒趱錾赃脏驵凿枣责择则泽赜啧帻箦贼谮赠综缯轧铡闸栅诈斋债毡盏斩辗崭栈战绽谵张涨帐账胀赵诏钊蛰辙锗这谪辄鹧贞针侦诊镇阵浈缜桢轸赈祯鸩挣睁狰争帧症郑证诤峥钲铮筝织职执纸挚掷帜质滞骘栉栀轵轾贽鸷蛳絷踬踯觯钟终种肿众锺诌轴皱昼骤纣绉猪诸诛烛瞩嘱贮铸驻伫槠铢专砖转赚啭馔颞桩庄装妆壮状锥赘坠缀骓缒谆准着浊诼镯兹资渍谘缁辎赀眦锱龇鲻踪总纵偬邹诹驺鲰诅组镞钻缵躜鳟翱并卜沉丑淀斗范干皋硅柜后伙秸杰诀夸里凌么霉捻凄扦圣尸抬涂洼喂污锨咸蝎彝涌游吁御愿岳云灶扎札筑于志注凋讠谫郄勐凼坂垅垴埯埝苘荬荮莜莼菰藁揸吒吣咔咝咴噘噼嚯幞岙嵴彷徼犸狍馀馇馓馕愣憷懔丬溆滟溷漤潴澹甯纟绔绱珉枧桊桉槔橥轱轷赍肷胨飚煳煅熘愍淼砜磙眍钚钷铘铞锃锍锎锏锘锝锪锫锿镅镎镢镥镩镲稆鹋鹛鹱疬疴痖癯裥襁耢颥螨麴鲅鲆鲇鲞鲴鲺鲼鳊鳋鳘鳙鞒鞴齄';
	}
 
    function ftPYStr(){
		return '僕爲錒皚藹礙愛噯嬡璦曖靄諳銨鵪骯襖奧媼驁鰲壩罷鈀擺敗唄頒辦絆鈑幫綁鎊謗剝飽寶報鮑鴇齙輩貝鋇狽備憊鵯賁錛繃筆畢斃幣閉蓽嗶潷鉍篳蹕邊編貶變辯辮芐緶籩標驃颮飆鏢鑣鰾鱉別癟瀕濱賓擯儐繽檳殯臏鑌髕鬢餅稟撥缽鉑駁餑鈸鵓補鈽財參蠶殘慚慘燦驂黲蒼艙倉滄廁側冊測惻層詫鍤儕釵攙摻蟬饞讒纏鏟產闡顫囅諂讖蕆懺嬋驏覘禪鐔場嘗長償腸廠暢倀萇悵閶鯧鈔車徹硨塵陳襯傖諶櫬磣齔撐稱懲誠騁棖檉鋮鐺癡遲馳恥齒熾飭鴟沖衝蟲寵銃疇躊籌綢儔幬讎櫥廚鋤雛礎儲觸處芻絀躕傳釧瘡闖創愴錘綞純鶉綽輟齪辭詞賜鶿聰蔥囪從叢蓯驄樅湊輳躥竄攛錯銼鹺達噠韃帶貸駘紿擔單鄲撣膽憚誕彈殫賧癉簞當擋黨蕩檔讜碭襠搗島禱導盜燾燈鄧鐙敵滌遞締糴詆諦綈覿鏑顛點墊電巔鈿癲釣調銚鯛諜疊鰈釘頂錠訂鋌丟銩東動棟凍崠鶇竇犢獨讀賭鍍瀆櫝牘篤黷鍛斷緞籪兌隊對懟鐓噸頓鈍燉躉奪墮鐸鵝額訛惡餓諤堊閼軛鋨鍔鶚顎顓鱷誒兒爾餌貳邇鉺鴯鮞發罰閥琺礬釩煩販飯訪紡鈁魴飛誹廢費緋鐨鯡紛墳奮憤糞僨豐楓鋒風瘋馮縫諷鳳灃膚輻撫輔賦復負訃婦縛鳧駙紱紼賻麩鮒鰒釓該鈣蓋賅桿趕稈贛尷搟紺岡剛鋼綱崗戇鎬睪誥縞鋯擱鴿閣鉻個紇鎘潁給亙賡綆鯁龔宮鞏貢鉤溝茍構購夠詬緱覯蠱顧詁轂鈷錮鴣鵠鶻剮掛鴰摑關觀館慣貫詿摜鸛鰥廣獷規歸龜閨軌詭貴劊匭劌媯檜鮭鱖輥滾袞緄鯀鍋國過堝咼幗槨蟈鉿駭韓漢闞絎頡號灝顥閡鶴賀訶闔蠣橫轟鴻紅黌訌葒閎鱟壺護滬戶滸鶘嘩華畫劃話驊樺鏵懷壞歡環還緩換喚瘓煥渙奐繯鍰鯇黃謊鰉揮輝毀賄穢會燴匯諱誨繪詼薈噦澮繢琿暉葷渾諢餛閽獲貨禍鈥鑊擊機積饑跡譏雞績緝極輯級擠幾薊劑濟計記際繼紀訐詰薺嘰嚌驥璣覬齏磯羈蠆躋霽鱭鯽夾莢頰賈鉀價駕郟浹鋏鎵蟯殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗諫縑戔戩瞼鶼筧鰹韉將漿蔣槳獎講醬絳韁膠澆驕嬌攪鉸矯僥腳餃繳絞轎較撟嶠鷦鮫階節潔結誡屆癤頜鮚緊錦僅謹進晉燼盡勁荊莖巹藎饉縉贐覲鯨驚經頸靜鏡徑痙競凈剄涇逕弳脛靚糾廄舊鬮鳩鷲駒舉據鋸懼劇詎屨櫸颶鉅鋦窶齟鵑絹錈鐫雋覺決絕譎玨鈞軍駿皸開凱剴塏愾愷鎧鍇龕閌鈧銬顆殼課騍緙軻鈳錁頷墾懇齦鏗摳庫褲嚳塊儈鄶噲膾寬獪髖礦曠況誆誑鄺壙纊貺虧巋窺饋潰匱蕢憒聵簣閫錕鯤擴闊蠐蠟臘萊來賴崍徠淶瀨賚睞錸癩籟藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫嵐欖斕鑭襤瑯閬鋃撈勞澇嘮嶗銠鐒癆樂鰳鐳壘類淚誄縲籬貍離鯉禮麗厲勵礫歷瀝隸儷酈壢藶蒞蘺嚦邐驪縭櫪櫟轢礪鋰鸝癘糲躒靂鱺鱧倆聯蓮連鐮憐漣簾斂臉鏈戀煉練蘞奩瀲璉殮褳襝鰱糧涼兩輛諒魎療遼鐐繚釕鷯獵臨鄰鱗凜賃藺廩檁轔躪齡鈴靈嶺領綾欞蟶鯪餾劉瀏騮綹鎦鷚龍聾嚨籠壟攏隴蘢瀧瓏櫳朧礱樓婁摟簍僂蔞嘍嶁鏤瘺耬螻髏蘆盧顱廬爐擄鹵虜魯賂祿錄陸壚擼嚕閭瀘淥櫨櫓轤輅轆氌臚鸕鷺艫鱸巒攣孿灤亂臠孌欒鸞鑾掄輪倫侖淪綸論圇蘿羅邏鑼籮騾駱絡犖玀濼欏腡鏍驢呂鋁侶屢縷慮濾綠櫚褸鋝嘸媽瑪碼螞馬罵嗎嘜嬤榪買麥賣邁脈勱瞞饅蠻滿謾縵鏝顙鰻貓錨鉚貿麼沒鎂門悶們捫燜懣鍆錳夢瞇謎彌覓冪羋謐獼禰綿緬澠靦黽廟緲繆滅憫閩閔緡鳴銘謬謨驀饃歿鏌謀畝鉬吶鈉納難撓腦惱鬧鐃訥餒內擬膩鈮鯢攆輦鯰釀鳥蔦裊聶嚙鑷鎳隉蘗囁顢躡檸獰寧擰濘苧嚀聹鈕紐膿濃農儂噥駑釹諾儺瘧歐鷗毆嘔漚謳慪甌盤蹣龐拋皰賠轡噴鵬紕羆鈹騙諞駢飄縹頻貧嬪蘋憑評潑頗釙撲鋪樸譜鏷鐠棲臍齊騎豈啟氣棄訖蘄騏綺榿磧頎頏鰭牽釬鉛遷簽謙錢鉗潛淺譴塹僉蕁慳騫繾槧鈐槍嗆墻薔強搶嬙檣戧熗錆鏘鏹羥蹌鍬橋喬僑翹竅誚譙蕎繰磽蹺竊愜鍥篋欽親寢鋟輕氫傾頃請慶撳鯖瓊窮煢蛺巰賕蟣鰍趨區軀驅齲詘嶇闃覷鴝顴權勸詮綣輇銓卻鵲確闋闕愨讓饒擾繞蕘嬈橈熱韌認紉飪軔榮絨嶸蠑縟銣顰軟銳蜆閏潤灑薩颯鰓賽傘毿糝喪騷掃繅澀嗇銫穡殺剎紗鎩鯊篩曬釃刪閃陜贍繕訕姍騸釤鱔墑傷賞坰殤觴燒紹賒攝懾設厙灄畬紳審嬸腎滲詵諗瀋聲繩勝師獅濕詩時蝕實識駛勢適釋飾視試謚塒蒔弒軾貰鈰鰣壽獸綬樞輸書贖屬術樹豎數攄紓帥閂雙誰稅順說碩爍鑠絲飼廝駟緦鍶鷥聳慫頌訟誦擻藪餿颼鎪蘇訴肅謖穌雖隨綏歲誶孫損筍蓀猻縮瑣鎖嗩脧獺撻闥鉈鰨臺態鈦鮐攤貪癱灘壇譚談嘆曇鉭錟頇湯燙儻餳鐋鏜濤絳討韜鋱騰謄銻題體屜緹鵜闐條糶齠鰷貼鐵廳聽烴銅統慟頭鈄禿圖釷團摶頹蛻飩脫鴕馱駝橢籜鼉襪媧膃彎灣頑萬紈綰網輞韋違圍為濰維葦偉偽緯謂衛諉幃闈溈潿瑋韙煒鮪溫聞紋穩問閿甕撾蝸渦窩臥萵齷嗚鎢烏誣無蕪吳塢霧務誤鄔廡憮嫵騖鵡鶩錫犧襲習銑戲細餼鬩璽覡蝦轄峽俠狹廈嚇硤鮮纖賢銜閑顯險現獻縣餡羨憲線莧薟蘚峴獫嫻鷴癇蠔秈躚廂鑲鄉詳響項薌餉驤緗饗蕭囂銷曉嘯嘵瀟驍綃梟簫協挾攜脅諧寫瀉謝褻擷紲纈鋅釁興陘滎兇洶銹繡饈鵂虛噓須許敘緒續詡頊軒懸選癬絢諼鉉鏇學謔澩鱈勛詢尋馴訓訊遜塤潯鱘壓鴉鴨啞亞訝埡婭椏氬閹煙鹽嚴巖顏閻艷厭硯彥諺驗厴贗儼兗讞懨閆釅魘饜鼴鴦楊揚瘍陽癢養樣煬瑤搖堯遙窯謠藥軺鷂鰩爺頁業葉靨謁鄴曄燁醫銥頤遺儀蟻藝億憶義詣議誼譯異繹詒囈嶧飴懌驛縊軼貽釔鎰鐿瘞艤蔭陰銀飲隱銦癮櫻嬰鷹應纓瑩螢營熒蠅贏穎塋鶯縈鎣攖嚶瀅瀠瓔鸚癭頦罌喲擁傭癰踴詠鏞優憂郵鈾猶誘蕕銪魷輿魚漁娛與嶼語獄譽預馭傴俁諛諭蕷崳飫閾嫗紆覦歟鈺鵒鷸齬鴛淵轅園員圓緣遠櫞鳶黿約躍鑰粵悅閱鉞鄖勻隕運蘊醞暈韻鄆蕓惲慍紜韞殞氳雜災載攢暫贊瓚趲鏨贓臟駔鑿棗責擇則澤賾嘖幘簀賊譖贈綜繒軋鍘閘柵詐齋債氈盞斬輾嶄棧戰綻譫張漲帳賬脹趙詔釗蟄轍鍺這謫輒鷓貞針偵診鎮陣湞縝楨軫賑禎鴆掙睜猙爭幀癥鄭證諍崢鉦錚箏織職執紙摯擲幟質滯騭櫛梔軹輊贄鷙螄縶躓躑觶鐘終種腫眾鍾謅軸皺晝驟紂縐豬諸誅燭矚囑貯鑄駐佇櫧銖專磚轉賺囀饌顳樁莊裝妝壯狀錐贅墜綴騅縋諄準著濁諑鐲茲資漬諮緇輜貲眥錙齜鯔蹤總縱傯鄒諏騶鯫詛組鏃鉆纘躦鱒翺並蔔沈醜澱鬥範幹臯矽櫃後夥稭傑訣誇裏淩麽黴撚淒扡聖屍擡塗窪餵汙鍁鹹蠍彜湧遊籲禦願嶽雲竈紮劄築於誌註雕訁譾郤猛氹阪壟堖垵墊檾蕒葤蓧蒓菇槁摣咤唚哢噝噅撅劈謔襆嶴脊仿僥獁麅餘餷饊饢楞怵懍爿漵灩混濫瀦淡寧糸絝緔瑉梘棬案橰櫫軲軤賫膁腖飈糊煆溜湣渺碸滾瞘鈈鉕鋣銱鋥鋶鐦鐧鍩鍀鍃錇鎄鎇鎿鐝鑥鑹鑔穭鶓鶥鸌癧屙瘂臒襇繈耮顬蟎麯鮁鮃鮎鯗鯝鯴鱝鯿鰠鰵鱅鞽韝齇';
	}
 
    function simplized(cc){
		var str='';
		for(var i=0;i<cc.length;i++){
			if(ftPYStr().indexOf(cc.charAt(i))!=-1){
				str+=charPYStr().charAt(ftPYStr().indexOf(cc.charAt(i)));
            }else{
				str+=cc.charAt(i);
            }
		}
		return str;
	}
})();
// ==UserScript==
// @name         删除b站垃圾板块-改
// @namespace    https://github.com/lossj
// @include      https://www.bilibili.com
// @version      0.5.2
// @description  删除b站首页广告、特定垃圾板块。
// @author       Loss J.
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412874/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%9E%83%E5%9C%BE%E6%9D%BF%E5%9D%97-%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/412874/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%9E%83%E5%9C%BE%E6%9D%BF%E5%9D%97-%E6%94%B9.meta.js
// ==/UserScript==


(function(){
    'use strict';
    function hideAds(){
        // 删除顶部分区目录下的banner
        document.getElementById("reportFirst1").style.display = "none";
        // 删除banner下的推广
        document.getElementById("reportFirst2").style.display = "none";
        // 删除英雄联盟推广
        var report3 = document.getElementById("reportFirst3");
        if (report3 != null){
            report3.style.display = "none";
        }
    }
    var nameList = ["直播", "动画", "番剧", "国创", "漫画", "音乐", "舞蹈", "游戏",
                     "知识", "课堂", "数码", "生活", "鬼畜", "时尚", "资讯", "娱乐",
                     "专栏", "电影", "电视剧", "影视", "纪录片", "特别推荐"];
    var idList = ["bili_live", "bili_douga", "bili_anime", "bili_guochuang", "bili_manga", "bili_music", "bili_dance", "bili_game",
                   "bili_technology", "bili_cheese", "bili_digital", "bili_life", "bili_kichiku", "bili_fashion", "bili_information", "bili_ent",
                   "bili_read", "bili_movie", "bili_teleplay", "bili_cinephile", "bili_documentary", "bili_report_spe_rec"];
    // 设置要屏蔽的up主的名字
    var sbUploaderNames = new Set(["papi酱", "凉风Kaze", "拜托了小翔哥", "贤宝宝Baby", "记录生活的蛋黄派",
                                   "硬核的半佛仙人", "啊吗粽", "盖里老哥", "敬汉卿", "哔哩哔哩英雄联盟赛事",
                                   "英雄联盟", "说唱新世代", "不2不叫周淑怡", "LexBurner", "上海滩许Van强",
                                   "仙道居士", "-星辰菌-", "特效小哥studio", "长又心", "在下哲别", "女胖胖",
                                   "老番茄", "机智的党妹", "逗比的雀巢", "Super也好君", "不死な千咲", "敖厂长",
                                   "Baka恶魔", "拯救世界的狗子", "花少北丶", "linkmusicnow", "浅澄月", "十代冥王",
                                   "小潮院长", "狗辉大师", "陈家淇_B11", "某幻君", "Python_子木", "木鱼水心",
                                   "岚鸽鸽不鸽鸽", "红豆稀饭中", "沈逸老师", "东尼ookii", "小潮院长", "Ksr桑",
                                   "vansamaofficial", "嬉皮怪客", "卧龙寺", "Easrfa", "蜻蜓隊長い", "广西吴恩师",
                                   "最绅士Yuppie", "华农兄弟", "赤焰男孩", "宝剑嫂", "vivi可爱多", "面筋哥-程书林",
                                   "雨哥到处跑"]);
    var name2id = {}
    for (var i = 0; i < nameList.length; i++){
        var value = [idList[i], i]
        name2id[nameList[i]] = value;
    }
    // 设置你要屏蔽的板块
    var garbageBlocks = ["动画", "国创", "漫画", "游戏", "课堂", "鬼畜", "娱乐", "专栏", "影视", "特别推荐"]
    var idSet = new Set([])
    for (var k = 0; k < garbageBlocks.length; k++){
        idSet.add(name2id[garbageBlocks[k]]);
    }
    function hideBlock(){
        for (var i = 0; i < garbageBlocks.length; i++){
            if (garbageBlocks[i] != "特别推荐"){
                document.getElementById(name2id[garbageBlocks[i]][0]).style.display = "none";
                // document.getElementById(name2id[garbageBlocks[i]][0]).remove();
            }else{
                try{
                    document.getElementById(name2id[garbageBlocks[i]][0]).style.display = "none";
                }catch{}
            }
        }
    }
    function funcSleep(func, time, limitTime=5){
        try{
            setTimeout(func, time);
        }catch{
            if (limitTime > 0){
                funcSleep(func, time, limitTime=limitTime-1);
            }else{
                console.log("Can't find Element!")
            }
        }
    }
    // 删除右侧固定分区导航条
    function hideElevator(){
        var item = document.querySelectorAll("#elevator > .list-box > div .item");
        for(var i = 0; i < garbageBlocks.length; i++){
            if(garbageBlocks[i] != "特别推荐"){
                var idx = name2id[garbageBlocks[i]][1];
                item[idx].style.display = "none";
            }
        }
    }
    // 删除直播板块右侧banner广告
    function hideLiveAds(){
        var tabContents = document.querySelectorAll(".live-tabs > div");
        tabContents[3].style = "display: none;";
        tabContents[2].style = "";
        var tabs = document.querySelectorAll(".live-tabs  .tab-switch-item");
        tabs[2].remove();
        tabs[1].className += " on";
    }



    // 删除直播板块指定标签外的直播间
    function hideLiveRoom(){


        var reporter = document.getElementById('bili_report_live');
        reporter.remove();

    }
    function clickBtn(){
        var btn = document.querySelector(".live-list .btn-change");
        function sleepHideLiveRoom(){
            funcSleep(hideLiveRoom, 600);
        }
        btn.addEventListener('click', sleepHideLiveRoom, false);
    }
    // 删除sb up主的视频
    function hideSbUploader(){
        var wraps = document.querySelectorAll(".rank-list .rank-wrap");
        for (var i = 0; i < wraps.length; i++){
            try{
                var name = wraps[i].querySelector(".popover-video-card > .content > .info > .subtitle > .name").textContent;
                if(sbUploaderNames.has(name)){
                    if(wraps[i].style.display != "none"){
                     
                        wraps[i].style.display = "none";
                    }
                }
            }catch{}
        }
        var videoCards = document.querySelectorAll(".video-card-common");
        for (var j = 0; j < videoCards.length; j++){
            if (idSet.has(videoCards[j].parentNode.parentNode.parentNode.id)){
            }else{
                var uploader = videoCards[j].querySelector("a.up");
                if(uploader){
                    var uploaderName = uploader.querySelector("i").nextSibling.textContent;
                    uploaderName = uploaderName.trim();
                    if(sbUploaderNames.has(uploaderName)){
                        if(videoCards[j].style.display != "none"){
                            videoCards[j].style.display = "none";
                           
                        }
                    }
                }
            }
        }
    }
    var scrollAllow = true;
    function scrollEvent(e){
        function scrollAwake(){
            scrollAllow = true;
        }
        e = e || window.event;
        if (scrollAllow && e.wheelDelta) {
            if (e.wheelDelta < -30) {
                scrollAllow = false;
                funcSleep(hideSbUploader, 1500);
                setTimeout(scrollAwake, 2000);
            }
        } else if (scrollAllow && e.detail) {
            if (e.detail < -30) {
                scrollAllow = false;
                funcSleep(hideSbUploader, 1500);
                setTimeout(scrollAwake, 2000);
            }
        }
    }
    function main(){
        hideAds();
        var time = 1500;
        funcSleep(hideElevator, time);
        funcSleep(hideBlock, 1000);
        funcSleep(hideLiveAds, 900);
        funcSleep(hideLiveRoom, 1000);
        funcSleep(hideSbUploader, 5500);
        window.onmousewheel = document.onmousewheel = scrollEvent;
        console.log("okokok");
        funcSleep(clickBtn, 1000);
    }
    main()
})();

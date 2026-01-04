// ==UserScript==
// @name         远教自动挂课脚本
// @version      1.4
// @description  目前有两个功能，1：获取视频列表；2：自动播放视频，完成后进行下一个视频。
// @author       mydiv
// @match        *://coaledu.net/*
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @namespace https://greasyfork.org/users/996129
// @downloadURL https://update.greasyfork.org/scripts/456468/%E8%BF%9C%E6%95%99%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456468/%E8%BF%9C%E6%95%99%E8%87%AA%E5%8A%A8%E6%8C%82%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    var foundVideoNum = 0;
    var foundListNum = 0;
    var videoList = [];
    function autoPlay() {
        // 自动播放视频
        console.log("寻找视频中...");
        setTimeout(function () {
            foundVideoNum++;
            var playdom = document.querySelector(".videojs-referse-btn");
            if (playdom) {
                console.log("找到视频，开始播放");
                play();
                getVideoInfo();
            } else if (foundVideoNum <= 10) {
                autoPlay();
            } else {
                console.log("没找到视频，应该不是播放页面");
            }
        }, 5000);
    }
    unsafeWindow.play = function () {
        document.querySelector(".videojs-referse-btn").click();
    };
    // 检测视频播放状态
    function getVideoInfo() {
        console.log("检测视频状态中...");
        setTimeout(function () {
            var playdom = document.querySelector(".anew");
            var isPlaying = document.querySelector(".videojs-referse-btn").classList.contains("vjs-hidden"); // 播放中
            if (!isPlaying) {
                // 播放暂停
                play();
                console.log("继续播放");
            }
            if (playdom) {
                // 播放下个视频
                console.log("播放下个视频");
                autoPlayNextVideo();
            } else if (JSON.parse(window.localStorage.getItem("123videoAutoPlay"))) {
                getVideoInfo();
            }
        }, 3000);
    }
    function autoPlayNextVideo() {
        // 自动播放下一个
        var videoList = JSON.parse(window.localStorage.getItem("123videoList"));
        var i = Number(window.localStorage.getItem("123videoIndex"));
        openVideo(i + 1, videoList);
    }
    /**
   * 打开视频
   * @param i 循环开始序号 {number}
   * @param videoList 视频列表 {array}
   * @param bixiu 是否必修 {boolean}
   * @returns none
   */
    function openVideo(i, videoList) {
        if (i == videoList.length) {
            alert("全部播放完成");
        } else {
            var url = "https://kc.zhixueyun.com/#/study/course/detail/" + videoList[i].type + "&" + videoList[i].url + "/6/1";
            window.localStorage.setItem("123videoIndex", i); // 当前播放的index
            window.open(url, "_blank");
        }
    }
    function autogetList() {
        // 自动获取列表
        console.log("获取列表信息中...");
        setTimeout(function () {
            foundListNum++;
            var listWrapDom = document.querySelector(".subject-catalog");
            if (listWrapDom) {
                console.log("获取列表完成");
                formatList();

            } else if (foundListNum <= 10) {
                autogetList();
            } else {
                console.log("没找到列表，应该不是列表页面");
            }
        }, 3000);
    }
    function formatList() {
        // 格式化列表
        var listDom = document.querySelectorAll(".catalog-state-info");
        videoList = [];
        if (listDom && listDom.length != 0) {
            listDom.forEach(function (oneList, index) {
                var oneListDom = oneList.querySelectorAll(".item");
                oneListDom.forEach(function (item, index) {
                    var bofang = item.querySelector(".iconfont.m-right.icon-wode_bofang") ? true : false;
                    var bofangzhong = item.querySelector(".iconfont.m-right.icon-wode_bofangzhong") ? true : false;
                    if (bofang || bofangzhong) {
                        videoList.push({
                            url: item.getAttribute("data-resource-id"),
                            type: item.getAttribute("data-section-type"),
                            title: item.querySelector(".name-des").innerHTML,
                            checked:true,
                        });
                    } else {
                        videoList.push({
                            url: item.getAttribute("data-resource-id"),
                            type: item.getAttribute("data-section-type"),
                            title: item.querySelector(".name-des").innerHTML,
                            checked:false,
                        });

                    }
                });
            });
            // document.querySelector("#listCount123").innerHTML = "文件列表" + videoList.length;
            document.querySelector("#startPlay123").innerHTML = "开始播放";

            // 组装下拉列表
            var listWrap123dom = document.querySelector("#listWrap123");
            //  var showAll = document.createElement('span')
            //  showAll.innerHTML = '全部列表';


            for(var i=0;i<videoList.length;i++){
                var itemDom = document.createElement('div');
                itemDom.style = 'height:20px;line-height:20px;overflow:auto;'
                var inputDom = document.createElement('input');
                inputDom.setAttribute('type','checkbox');
                inputDom.style='vertical-align: top;height: 20px;line-height: 20px;';
                inputDom.checked=videoList[i].checked;
                var labelDom = document.createElement('label');
                labelDom.innerHTML = videoList[i].title;
                itemDom.append(inputDom);
                itemDom.append(labelDom);
                listWrap123dom.append(itemDom);
            }

        }
    }

    function loadListDom() {
        var mydiv = document.createElement("div");
        mydiv.id = "mydiv123";
        mydiv.style = "position: fixed;background:white;left: 5px;top: 5px;z-index: 1000000;box-shadow: 0px 0px 8px 2px #b5b5b547;height: 40px;line-height: 40px;";
        mydiv.innerHTML =
            "<span id='startPlay123' style='margin: 20px;cursor: pointer;'>检测中...</span>" +
            "<span id='listCount123' style='margin-right:20px;cursor:pointer;'>文件列表</span>"+
            "<div id='listWrap123' style='display:none;background: white;height: 300px;overflow-y: auto;padding: 0 0 0 20px;'>"+
            "</div>";
        var body = document.querySelector("body");
        body.append(mydiv);
        var startPlaydom = document.querySelector("#startPlay123");
        var listCount123dom = document.querySelector("#listCount123");
        var listWrap123dom = document.querySelector("#listWrap123");
        startPlaydom.addEventListener("click", function () { // 点击开始事件
            window.localStorage.setItem("123videoAutoPlay", true);
            var newVideoList =[]
            var listItem123dom = document.querySelectorAll("#listWrap123>div");
            for(var i=0;i<videoList.length;i++){
                if(listItem123dom[i].querySelector('input').checked){
                    newVideoList.push(videoList[i])
                }
            }
            window.localStorage.setItem("123videoList", JSON.stringify(newVideoList)); // 保存到缓存里面
            openVideo(0, newVideoList);
        });
        listCount123dom.addEventListener("click", function () { // 打开列表
            if(listWrap123dom.style.display=='block'){
                listWrap123dom.style.display = 'none';
            } else {
                listWrap123dom.style.display='block';
            }
        });
    }
    function loadPlayDom() {
        var mydiv = document.createElement("div");
        mydiv.id = "mydiv1234";
        mydiv.style = "position: fixed;background:white;left: 5px;top: 5px;z-index: 1000000;box-shadow: 0px 0px 8px 2px #b5b5b547;height: 40px;line-height: 40px;";
        mydiv.innerHTML = "<span id='stopPlay123' style='margin:10px 0 10px 10px;cursor: pointer;'>停止自动播放</span><span id='listCount1234' style='margin-right:20px;'></span>";
        var body = document.querySelector("body");
        body.append(mydiv);
        var listCount1234Dom = document.querySelector("#listCount1234");
        listCount1234Dom.innerHTML = "" + (Number(window.localStorage.getItem("123videoIndex")) + 1) + "/" + JSON.parse(window.localStorage.getItem("123videoList")).length;
        var stopPlaydom = document.querySelector("#stopPlay123");
        stopPlaydom.addEventListener("click", function () {
            window.localStorage.setItem("123videoAutoPlay", false);
            mydiv.remove();
        });
    }
    function init() {
        if (window.location.href.includes("/study/subject/detail")) {
            // 列表页面
            autogetList();
            loadListDom();
        } else if (window.location.href.includes("/study/course/detail")) {
            // 视频页面
            if (JSON.parse(window.localStorage.getItem("123videoAutoPlay"))) {
                autoPlay();
                loadPlayDom();
            }
        }
    }
    init();
})();

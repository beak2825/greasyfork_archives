// ==UserScript==
// @name         b站 搜索次级排序 bilibili 哔哩哔哩
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  b站搜索的次级排序功能，能对当前搜索页面的视频进行二次排序
// @author       You
// @match        *://search.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419937/b%E7%AB%99%20%E6%90%9C%E7%B4%A2%E6%AC%A1%E7%BA%A7%E6%8E%92%E5%BA%8F%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/419937/b%E7%AB%99%20%E6%90%9C%E7%B4%A2%E6%AC%A1%E7%BA%A7%E6%8E%92%E5%BA%8F%20bilibili%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9.meta.js
// ==/UserScript==

(function () {
    "use strict";
    class Ajax{
        static post(url,callback,data={},requestHeader = {},Credentials=true){
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.open()
            for(let head in requestHeader){
                xhr.setRequestHeader(head,requestHeader[head])
            }
            xhr.withCredentials = Credentials
    
            const URLData = new Array()
            for(let d in data){
                URLData.push(d+'='+data[d])
            }
    
            xhr.send(URLData.join('&'))
            xhr.onreadystatechange = callback(xhr)
        }
    
        static get(url,callback,data={},requestHeader = {},async=false,Credentials=true){
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url,async);
    
            for(let head in requestHeader){
                xhr.setRequestHeader(head,requestHeader[head])
            }
            xhr.withCredentials = Credentials
    
            const URLData = new Array()
            for(let d in data){
                URLData.push(d+'='+data[d])
            }
    
            xhr.send(URLData.join('&'))
            xhr.onreadystatechange = callback(xhr)
        }
    }

    class SecondlyFilter {
        constructor() {
            this.filterWrap = document.getElementsByClassName("filter-wrap")[0];
            this.initDOM();
            this.initPageClicked();
            this.initFilterClicked();
        }
        getVideoListV() {
            const videoList = document.getElementsByClassName("video-list")[0];
            return videoList.__vue__;
        }
        initDOM() {
            const insertAnchor = this.filterWrap.getElementsByClassName("up")[0];
            const line = document.createElement("ul");
            this.filterContainer = document.createElement("ul");
            this.filterContainer.innerHTML =
                '<li class="filter-item active"><a href="javascript:;">次级排序</a></li><li class="filter-item"><a href="javascript:;">最多播放</a></li><li class="filter-item"><a href="javascript:;">最新发布</a></li><li class="filter-item"><a href="javascript:;">最多弹幕</a></li><li class="filter-item"><a href="javascript:;">最多收藏</a></li><li class="filter-item"><a href="javascript:;">最长时长</a></li>';
            this.filterContainer.className = "filter-type clearfix secondly-order";

            this.filters = this.filterContainer.getElementsByTagName("li");
            this.filterWrap.insertBefore(this.filterContainer, insertAnchor);

            this.filterWrap.getElementsByClassName("up")[0].onclick = function () {
                document.getElementsByClassName("secondly-order")[0].style.display = "None";
            };
            this.filterWrap.getElementsByClassName("down")[0].onclick = function () {
                document.getElementsByClassName("secondly-order")[0].style.display = "";
            };

            //原始排序
            this.filters[0].onclick = () => {
                this.active(0);
                this.innerHTML = '<a href="javascript:;">次级排序</a>';
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    return -(a.rank_score - b.rank_score);
                });
            };
            // 最多播放
            this.filters[1].onclick = () => {
                this.active(1);
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    return -(a.play - b.play);
                });
            };
            // 最新发布
            this.filters[2].onclick = () => {
                this.active(2);
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    return -(a.pubdate - b.pubdate);
                });
            };
            // 最多弹幕
            this.filters[3].onclick = () => {
                this.active(3);
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    return -(a.video_review - b.video_review);
                });
            };
            // 最多收藏
            this.filters[4].onclick = () => {
                this.active(4);
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    return -(a.favorites - b.favorites);
                });
            };
            // 最长时长
            this.filters[5].onclick = () => {
                this.active(5);
                const list_v = this.getVideoListV();
                list_v.list.sort(function (a, b) {
                    const timeA = a.duration.split(":");
                    const timeB = b.duration.split(":");
                    return -(Number(timeA[0]) * 60 + Number(timeA[1]) - Number(timeB[0]) * 60 - Number(timeB[1]));
                });
            };
        }
        active(i) {
            for (let filter of this.filters) {
                filter.classList.remove("active");
            }
            this.filters[i].classList.add("active");
            this.filters[0].innerHTML = '<a href="javascript:;">恢复默认</a>';
        }

        initPageClicked() {
            document.getElementsByClassName("page-item").forEach((v, i, a) => {
                if (v.className.indexOf("more") < 0) {
                    v.onclick = () => {
                        this.active(0);
                    };
                }
            });
        }
        initFilterClicked() {
            document.getElementsByClassName("filter-item").forEach((v, i, a) => {
                if (v.parentNode.className.indexOf("secondly-order") < 0) {
                    v.onclick = () => {
                        this.active(0);
                    };
                }
            });
        }
    }

    class VideoLoader {
        constructor(filter) {
            this.filter = filter;
            this.initMoreVideoButton();
            this.addedPage = 0
        }
        initMoreVideoButton() {
            const container = document.getElementsByClassName("page-wrap")[0].getElementsByTagName("ul")[0];
            const li = document.createElement("li");
            li.className = "page-item more";
            li.innerHTML = '<button class="nav-btn">更多</button>';
            container.appendChild(li);
            this.addedPage = 0
            li.onclick = () => {
                this.filter.active(0);
                const { keyword, currentPage } = this.getSearchInfo();
                // const videoListV = this.getVideoListV();
                Ajax.get(`//api.bilibili.com/x/web-interface/search/type?context=&page=${currentPage+this.addedPage+1}&order=totalrank&keyword=${encodeURI(keyword)}&duration=0&tids_2=&__refresh__=true&_extra=&search_type=video&tids=0&highlight=1&single_column=0`,(xhr)=>{
                    this.addedPage ++
                    const msg = JSON.parse(xhr.response)
                    const res = msg.data.result
                    const videoListV = this.getVideoListV()
                    videoListV.list = videoListV.list.concat(res)
                },{},{'accept':'application/json, text/plain, */*'})
                
            };
        }
        getVideoListV(){
            const videoList = document.getElementsByClassName("video-list")[0];
            return videoList.__vue__;
        }
        getSearchInfo() {
            const pageV = document.getElementsByClassName("page-wrap")[0].__vue__;
            const searchV = document.getElementsByClassName("search-wrap")[0].__vue__;
            const currentPage = pageV.currentPage;
            const keyword = searchV.keyword;
            return { currentPage, keyword };
        }
    }

    function videoWrapObservation(mutations, observer) {
        for (let mutation of mutations) {
            if (mutation.target.className == "flow-loader" && mutation.addedNodes.length > 0) {
                if (mutation.addedNodes[0].className == "page-wrap") {
                    videoLoader.initMoreVideoButton();
                    filter.initPageClicked();
                }
            }
        }
    }

    const filter = new SecondlyFilter();
    const videoLoader = new VideoLoader(filter);
    window.videoLoader = videoLoader;
    const videoWrapMutationConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(videoWrapObservation);
    observer.observe(document.getElementsByClassName("flow-loader")[0], videoWrapMutationConfig);
})();

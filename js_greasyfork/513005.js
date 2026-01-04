// ==UserScript==
// @name         B站视频页 - 视频合集样式
// @namespace    mscststs
// @version      2.1
// @license      ISC
// @description  修改新版视频页的视频合集样式
// @author       mscststs
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @require      https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513005/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%20-%20%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/513005/B%E7%AB%99%E8%A7%86%E9%A2%91%E9%A1%B5%20-%20%E8%A7%86%E9%A2%91%E5%90%88%E9%9B%86%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    StartVideoCollection();
    async function StartVideoCollection(){
        await mscststs.wait(".video-pod .video-pod__header .header-top .left .title");
        var article = document.querySelector("body");
        var boolean = 0;

        function setVideoCollection() {
            var leftTitle = document.querySelector(".video-pod .video-pod__header .header-top .left .title");
            var videoPod = document.querySelector(".video-pod .video-pod__body");
            //alert(document.querySelectorAll(".video-pod .simple-base-item .title .title-txt")[0].innerHTML);

            var collectionMaxHeight = "215px";
            var collectionPodMaxHeight = "290px";
            var videoMaxHeight = "348px";

            if(leftTitle.innerHTML != "视频选集" && videoPod.style.maxHeight != (collectionMaxHeight || collectionPodMaxHeight)){
                //判断合集是否存在图片
                let videoPodCover = document.querySelector(".video-pod .video-pod__body .normal-base-item .cover");
                if(videoPodCover) {
                    videoPod.style.cssText += "max-height:"+collectionPodMaxHeight+"!important;";
                    document.querySelector(".video-pod .video-pod__body .video-pod__list").style.cssText += "margin-top:3px!important;";
                } else {
                    videoPod.style.cssText += "max-height:"+collectionMaxHeight+"!important;";
                }

                //alert(0);
                VideoCollection();

                //合集分类点击后样式
                var slideItems = document.querySelectorAll(".pod-slide .slide-inner .slide-item");
                if(slideItems) {
                    for(let i = 0; i < slideItems.length; i++) {
                        slideItems[i].addEventListener('click', function() {
                            setTimeout(function() {
                                VideoCollection();
                            });
                        });
                    }
                }
                setTimeout(async function() {
                    await mscststs.wait(".pod-slide-more-popover .pod-slide-more-dropdown .slide-item");
                    var dropdownSlideItems = document.querySelectorAll(".pod-slide-more-popover .pod-slide-more-dropdown .slide-item");
                    for(let i = 0; i < dropdownSlideItems.length; i++) {
                        dropdownSlideItems[i].addEventListener('click', function() {
                            setTimeout(function() {
                                VideoCollection();
                            });
                        });
                    }
                });

            } else if(leftTitle.innerHTML == "视频选集" && document.querySelectorAll(".video-pod .simple-base-item .title .title-txt")[0].innerHTML.search(/^P\d&nbsp;+/) == -1) {
                if(videoPod.style.maxHeight != videoMaxHeight) videoPod.style.cssText += "max-height:"+videoMaxHeight+"!important;";
                //alert(document.querySelectorAll(".video-pod .simple-base-item .title .title-num")[0]);
                VideoOperation();

                //视频选集切换样式回来后样式
                var leftVideoMode = document.querySelector(".video-pod .video-pod__header .header-top .left .view-mode");
                if(leftVideoMode) {
                    leftVideoMode.addEventListener('click', function() {
                        if(boolean == 1) {
                            boolean = 2;
                        } else if(boolean == 2) {
                            VideoOperation();
                        }
                    });
                }
            }

        }

        async function VideoCollection() {
            await mscststs.wait(".video-pod .simple-base-item");
            let normals = document.querySelectorAll(".video-pod .simple-base-item");
            //let fontCSS = "font-size:14px; font-family:PingFang SC,HarmonyOS_Regular,Helvetica Neue,Microsoft YaHei,sans-serif;";
            let fontCSS = "font-size:14px; line-height:30px;";
            for(let i = 0; i < normals.length; i++) {
                normals[i].style.margin = "5px 0";
                normals[i].querySelector(".title").style.cssText += "height: 30px;";
                normals[i].querySelector(".title .title-txt").style.cssText += fontCSS;
                normals[i].querySelector(".stats").style.cssText += fontCSS;
            }
        }

        async function VideoOperation() {
            await mscststs.wait(".video-pod .simple-base-item");
            if(document.querySelectorAll(".video-pod .simple-base-item .title .title-txt")[0].innerHTML.search(/^P\d&nbsp;+/) == -1) {
                let normals = document.querySelectorAll(".video-pod .simple-base-item");
                let fontCSS = "font-size:13.5px; line-height:30px;";
                for(let i = 0; i < normals.length; i++) {
                    normals[i].style.margin = "5px 0";
                    normals[i].querySelector(".title").style.cssText += "height: 30px;";
                    normals[i].querySelector(".title .title-txt").style.cssText += fontCSS;
                    normals[i].querySelector(".stats").style.cssText += fontCSS;

                    //normals[i].querySelector(".title .title-txt").insertAdjacentHTML("beforebegin", "<div class='title-num' style='"+fontCSS+" margin-right:10px;'>P"+(i+1)+"</div>");
                    normals[i].querySelector(".title .title-txt").innerHTML = "P"+(i+1)+"&nbsp;&nbsp;&nbsp;"+normals[i].querySelector(".title .title-txt").innerHTML;
                }
                boolean = 1;
            }
        }

        var options = { 'childList': true, 'attributes':true };
        const callback = function(mutationsList, observer) {
            setVideoCollection();
        };
        const observer = new MutationObserver(callback);
        observer.observe(article, options);
        setVideoCollection();
        /*var time = 500;
        for(var i = 0; i < 20; i++) {
            setTimeout(function() {
                setVideoCollection();
                //alert(123);
            }, time);
            time += 500;
        }*/

    }
})();
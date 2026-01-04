// ==UserScript==
// @name         TikTok 视频链接显示播放量
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  Show TikTok video's views\likes\comments number
// @author       hellocode
// @match        https://www.tiktok.com/@*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at       document-body
// @resource    jqueryBaseCSS https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css
// @resource    jqueryToastCSS https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.css
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @require https://cdn.jsdelivr.net/npm/urijs@1.19.11/src/URI.min.js
// @downloadURL https://update.greasyfork.org/scripts/460431/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460431/TikTok%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%87%8F.meta.js
// ==/UserScript==

var newCSS = GM_getResourceText("jqueryToastCSS");
GM_addStyle(newCSS);



GM_addStyle(`

    #videoInfo2 {
        font-size: 12px;
        line-height: 12px;
        z-index: 100;
        border-radius: 10px;
        padding: 10px;
        background: #f2f2f2;
        color: black;
    }

    #videoInfo > :first-child {
        margin-top: 20px;
    }

    .videoinfo-views {
        color: red;
    }

`);


(() => {
    "use strict";

    console.log('插件代码开始');

    function numFormat(num) {
        var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ",";
            });
        })
        return res;
    }


    function is_valid_url() {
        let pattern = /https:\/\/www\.tiktok\.com\/@.*\/video\/.*/
        return window.location.href.match(pattern)
    }


    function onElementInserted(target, elementSelector, callback) {

        var onMutationsObserved = function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.addedNodes.length) {
                    // console.log(mutation.addedNodes)
                    var elements = null
                    if (typeof elementSelector == 'function') {
                        elements = elementSelector(mutation.addedNodes);
                    } else if (typeof elementSelector == 'string') {
                        elements = $(mutation.addedNodes).find(elementSelector);
                    } else {
                        elements = mutation.addedNodes
                    }

                    for (var i = 0, len = elements.length; i < len; i++) {
                        callback(elements[i]);
                    }
                }
            });
        };

        var config = { childList: true, subtree: true };
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        var observer = new MutationObserver(onMutationsObserved);
        observer.observe(target, config);
    }




    // 替换原始方法，并发送新的事件
    const _historyWrap = function (type) {
    const orig = history[type];
    const e = new Event(type);
    return function () {
        const rv = orig.apply(this, arguments);
        e.arguments = arguments;
        window.dispatchEvent(e);
        return rv;
    };
    };
    history.pushState = _historyWrap('pushState');
    history.replaceState = _historyWrap('replaceState');
  

  


    $(function () {

        console.log("jquery版本号：" + $.fn.jquery);

      window.addEventListener('popstate', function (event) {
        // 在这里处理 URL 变化事件
        console.log('URL 变化:', event.state);
        updateInfo()
      });
  
      window.addEventListener('pushState', function (e) {
        console.log('change pushState');
        updateInfo()
      });
  
      window.addEventListener('replaceState', function (e) {
        console.log('change replaceState');
        updateInfo()
      });

      


        onElementInserted(document.getElementById('app'), (nodes) => {
            return $(nodes).filter(function () {
                //console.log(this, typeof this.className == 'string' ? this.className.indexOf("DivPlayerContainer") > 0 : false)
                return typeof this.className == 'string' ? this.className.indexOf("DivPlayerContainer") > 0 : false
            })
        }, (i) => {
            updateInfo()
        })


        onElementInserted(document.getElementById('app'), (nodes) => {
            return $(nodes).filter(function () {
                //console.log(this, typeof this.className == 'string' ? this.className.indexOf("DivSideNavPlaceholderContainer") > 0 : false)
                return typeof this.className == 'string' ? this.className.indexOf("DivSideNavPlaceholderContainer") > 0 : false
            })
        }, (i) => {
            updateInfo()
        })


        function getVideoIdFromURL(videoId)
        {
            let url = document.location.href
            let regexp = /https:\/\/www\.tiktok\.com\/@.*\/video\/(\d+)/
            let matchs = url.match(regexp)
            let currentId = matchs ? matchs[1] : ''
            return currentId
        }

        function getCurrVideoInfoFromSIGI_STATE()
        {
            var text = $('#SIGI_STATE')[0].innerText
            if (!text.length) {
                return;
            }

            var json = JSON.parse(text)
            console.log(json)

            var videoInfo = Object.values(json.ItemModule)[0]
            return videoInfo
        }


        function getCurrVideoInfoFromUNIVERSAL_DATA_FOR_REHYDRATION()
        {
            var text = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__')[0].innerText
            if (!text.length) {
                return;
            }

            var json = JSON.parse(text)
            console.log(json)

            var videoInfo = json["__DEFAULT_SCOPE__"]["webapp.video-detail"]["itemInfo"]["itemStruct"]
            return videoInfo
        }




        

        function getVideoInfo() {

            let videoInfo = null
            try {
                videoInfo = getCurrVideoInfoFromUNIVERSAL_DATA_FOR_REHYDRATION()
            } catch (error) {
                console.log("无法从__UNIVERSAL_DATA_FOR_REHYDRATION__获取视频信息")
            }

            if(!videoInfo) {
                try {
                    videoInfo = getCurrVideoInfoFromSIGI_STATE()
                } catch (error) {
                    console.log("无法从 SIGI_STATE 获取视频信息")
                }
            }


            if(!videoInfo) {
                return
            }

            console.log(getVideoIdFromURL())
            if(getVideoIdFromURL() !== videoInfo.id) {
                console.log(getVideoIdFromURL(), "url 有变")
                return
            }

            return videoInfo
        }


        function createInfoNodes(pNode, videoInfo) {
            pNode.append('<div>' + "VideoID: <b>" + videoInfo.id + "</b></div>")
            pNode.append('<div>' + "UserID: <b>" + videoInfo.author.id + "</b></div>")

            pNode.append("<div>" + "Pulish date：<b>" + (new Date(parseInt(videoInfo.createTime) * 1000)).toLocaleString() + "</b></div>")

            pNode.append("<div>" + "Likes：<b>" + numFormat(videoInfo.stats.diggCount) + "</b></div>")
            pNode.append("<div>" + "Comments：<b>" + numFormat(videoInfo.stats.commentCount) + "</b></div>")
            pNode.append("<div>" + "Shares：<b>" + numFormat(videoInfo.stats.shareCount) + "</b></div>")
            pNode.append("<div class='videoinfo-views'>" + "Views：<b>" + numFormat(videoInfo.stats.playCount) + "</b></div>")
            pNode.append("<div>" + "Collects：<b>" + numFormat(videoInfo.stats.collectCount) + "</b></div>")

            var commentRate = videoInfo.stats.commentCount / videoInfo.stats.playCount
            commentRate = (commentRate * 100).toFixed(4)
            pNode.append("<div>" + "Comment rate：<b>" + commentRate + "%</b></div>")

            var interactionRate = (parseInt(videoInfo.stats.diggCount) + parseInt(videoInfo.stats.commentCount) + parseInt(videoInfo.stats.shareCount) + parseInt(videoInfo.stats.collectCount)) / parseInt(videoInfo.stats.playCount)
            interactionRate = (interactionRate * 100).toFixed(4) 
            pNode.append("<div>" + "Interaction rate：<b>" + interactionRate + "%</b></div>")
        }


        function updateInfoInVideoInfo(videoInfo) {


            var pNode = $("<div id='videoInfo'></div>")
            createInfoNodes(pNode, videoInfo)

            // var playerNode = $('[class*=DivVideoInfoContainer]')
            // var playerNode = $('#main-content-video_detail')
            var playerNode = $("[data-e2e=browse-music]")
            if(playerNode.length <= 0) {
                $('.draggable-window').show()
            } else {
                pNode.insertAfter(playerNode)
                $('.draggable-window').hide()
            }



            pNode = $("<div id='videoInfo2'></div>")
            createInfoNodes(pNode, videoInfo)

            var searchNode = $("[class*='DivFixedContentContainer']")
            if (searchNode.length) {
                pNode.insertAfter(searchNode)
            }
        }


        let lastVideoId = null
        function updateInfo() {

            $('#videoInfo').remove()
            $('#videoInfo2').remove()

            if (!is_valid_url()) {
                console.log("不是有效连接了")
                return
            }


            let videoInfo = getVideoInfo() 
            
            if(!videoInfo) {
                console.log("找不到 videoInfo")
                return
            }


            if (lastVideoId && lastVideoId != videoInfo.id) {
                console.log("video Id 已经变更", lastVideoId, videoInfo.id)
                return
            }

            lastVideoId = videoInfo.id
            console.log('lastVideoId', lastVideoId)
            
            
            updateInfoInVideoInfo(videoInfo)
        }


    })

})();
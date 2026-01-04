// ==UserScript==
// @name         Instagram 视频链接显示播放量
// @namespace    http://tampermonkey.net/
// @version      0.7
// @license      MIT
// @description  显示播放量信息
// @author       hellocode
// @match        https://www.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @run-at       document-end

// @resource    jqueryUICSS https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/themes/base/jquery-ui.min.css

// @require https://cdn.jsdelivr.net/npm/jquery@3.6.3/dist/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-ui@1.13.2/dist/jquery-ui.min.js
// @require https://cdn.jsdelivr.net/npm/jquery-toast-plugin@1.3.2/dist/jquery.toast.min.js
// @require https://cdn.jsdelivr.net/npm/urijs@1.19.11/src/URI.min.js

// @downloadURL https://update.greasyfork.org/scripts/471914/Instagram%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/471914/Instagram%20%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E9%87%8F.meta.js
// ==/UserScript==


GM_addStyle(GM_getResourceText("jqueryToastCSS"))


GM_addStyle(`

        .draggable-window {
            position: fixed;
            z-index: 100000; 
            padding:10px;
            top: 13px;
            left: 107px;
            background: #41a026;
            color: white;
            border: none;
            border-radius: 5px;
            box-shadow: 1px 1px 5px black;
        }

        .title-bar {
            cursor: move;
            font-weight: bold;
            margin-left: -10px;
            margin-right: -10px;
            margin-top: -10px;
            background: #068e07;
            padding: 2px;
            border-radius: 5px 5px 0 0;
        }


`);


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





(() => {
    "use strict";

    console.log('插件代码开始');

    function numFormat(num) {
        if (typeof num === 'undefined') {
            return ""
        }

        var res = num.toString().replace(/\d+/, function (n) { // 先提取整数部分
            return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
                return $1 + ",";
            });
        })
        return res;
    }


    // instagram shortcode 转换成 media ID
    function shortcode_to_id(shortcode) {
        const pad = 'A'.repeat(12 - shortcode.length);
        const code = pad + shortcode;
        const bytes = Uint8Array.from(atob(code.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
        return BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
    }


    function is_valid_url() {
        let pattern = /https:\/\/www\.instagram\.com\/(reel|reels|p)\/.*/
        return window.location.href.match(pattern)
    }

    function get_shortcode_from_url() {
        let regx = /\/(p|reels|reel)\/([^\/]+)/
        let media_code = window.location.href.match(regx)[2]
        return media_code
    }


    $(function () {


        console.log("jquery版本号：" + $.fn.jquery);


        $('body').append(`
        <div class="draggable-window">
            <div class="title-bar">⊹媒体信息</div>
            <div class="content">
                <div id="mediaInfo"></div>
            </div>
        </div>
        `)

        $('.draggable-window').draggable({
            handle: '.title-bar'
          });



        window.addEventListener('popstate', function (event) {
            // 在这里处理 URL 变化事件
            console.log('URL 变化:', event.state);
            updateVideoInfo()
        });

        window.addEventListener('pushState', function (e) {
            console.log('change pushState');
            updateVideoInfo()
        });

        window.addEventListener('replaceState', function (e) {
            console.log('change replaceState');
            updateVideoInfo()
        });







        let lastMediaId = null

        function updateVideoInfo() {


            $('#mediaInfo').empty()
            
            if (!is_valid_url()) {
                return
            }


            let media_code = get_shortcode_from_url()

            let media_id = shortcode_to_id(media_code)


            console.log("media_code", media_code, media_id)

            if (lastMediaId == media_id) return

            lastMediaId = media_id




            let url = `https://www.instagram.com/api/v1/media/${media_id}/info/`
            $.ajax({
                url: url,
                headers: {
                    'x-ig-app-id': '936619743392459'
                },
                success: function (result) {
                    console.log(result)

                    let mediaInfo = result.items[0]

                    console.log("like_count", mediaInfo.like_count)
                    console.log("comment_count", mediaInfo.comment_count)
                    console.log("play_count", mediaInfo.play_count)


                    let like_count = mediaInfo.like_count
                    let comment_count = mediaInfo.comment_count
                    let play_count = mediaInfo.play_count
                    let taken_at = mediaInfo.taken_at




                    var pNode = $('#mediaInfo')
                    pNode.empty()

                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Username："+"</span><span style='color: #00fec7;'>" + mediaInfo.user.username + "</span></div>")
                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"User ID："+"</span>" + mediaInfo.user.pk + "</div><br>")

                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Media Code："+"</span><span style='color: #00fec7;'>" + media_code + "</span></div>")
                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Media ID："+"</span>" + media_id + "</div>")

                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Publish Date："+"</span>" + (new Date(parseInt(taken_at) * 1000)).toLocaleString() + "</div>")

                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Likes："+"</span>" + numFormat(like_count) + "</div>")
                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Comments："+"</span>"  + numFormat(comment_count) + "</div>")
                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Views："+"</span>"  + numFormat(play_count) + "</div>")

                    pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Comment Rate："+"</span>"  + (comment_count / play_count) + "</div>")

                },
                error: function (request, status, error) {
                    console.log(request, status, error)
                },
                complete: function () {
                }
            })

            return

            let mediaInfo = null

            let jsonData = $('script[type="application/json"]')
            //console.log(jsonData)

            for (let data of jsonData) {
                let parsed = JSON.parse(data.innerText)
                if (parsed?.require?.[0]?.[0] == 'ScheduledServerJS' && data.innerText.indexOf('xdt_api__v1__media__shortcode__web_info') > 0) {
                    //console.log(data.innerText)
                    mediaInfo = parsed.require[0][3][0].__bbox.require[0][3][1].__bbox.result.data.xdt_api__v1__media__shortcode__web_info.items[0];
                    console.log(mediaInfo)
                    break
                }
            }

            if (!mediaInfo) {
                console.error("没有找到媒体信息")
                return
            }

            let user_id = mediaInfo.user.pk
            //let media_code = mediaInfo.code
            //let media_id = mediaInfo.pk

            let like_count = mediaInfo.like_count
            let comment_count = mediaInfo.comment_count
            let play_count = mediaInfo.play_count
            let taken_at = mediaInfo.taken_at


            let carousel_media = mediaInfo.carousel_media
            let media_type = mediaInfo.media_type

            console.log("media_id", media_id)
            console.log("like_count", like_count)
            console.log("comment_count", comment_count)
            console.log("play_count", play_count)



            var pNode = $('main[role=main]').children().first().children().eq(1)

            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Media ID：s"+"</span>"  + media_id + "</div>")

            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Pulish date："+"</span>" + (new Date(parseInt(taken_at) * 1000)).toLocaleString() + "</div>")

            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Likes："+"</span>" + numFormat(like_count) + "</div>")
            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Comments："+"</span>" + numFormat(comment_count) + "</div>")
            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Views："+"</span>" + numFormat(play_count) + "</div>")

            pNode.append("<div>" + "<span style='font-weight: bold;'>"+"Comments Rate："+"</span>" + (comment_count / play_count) + "</div>")

        }


        updateVideoInfo()

    })

})();


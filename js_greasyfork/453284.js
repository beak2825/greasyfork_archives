// ==UserScript==
// @name         视频解析器显示播放列表
// @namespace    https://github.com/oyps/jiaoben/tree/main/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%99%A8%E5%A2%9E%E5%8A%A0%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8
// @version      1.4
// @description  为你的视频解析页面增加播放列表，无需再回原网页找链接，目前已支持爱奇艺电视剧、腾讯视频电视剧，增加双击全屏
// @author       欧阳鹏
// @match        *://*/*url=http*iqiyi.com*
// @match        *://*/*url=http*youku.com*
// @match        *://*/*url=http*mgtv.com*
// @match        *://*/*url=http*v.qq.com*
// @require      https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js
// @require      https://cdn.staticfile.org/blueimp-md5/2.19.0/js/md5.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453284/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%99%A8%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453284/%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%99%A8%E6%98%BE%E7%A4%BA%E6%92%AD%E6%94%BE%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // iframe加载时不执行脚本
    if (self != top) {
        return;
    }
    document.addEventListener('dblclick', function () {
        var ele = this.documentElement;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        else {
            if (ele.requestFullscreen) {
                ele.requestFullscreen();
            }
            else if (ele.mozRequestFullScreen) {
                ele.mozRequestFullScreen();
            }
            else if (ele.webkitRequestFullScreen) {
                ele.webkitRequestFullScreen();
            }
            else if (ele.msRequestFullscreen) {
                ele.msRequestFullscreen();
            }
        }
    });
    var url = getQueryVariable('url');
    var video_from = get_video_from(url);
    if (video_from == 'iqiyi') {
        load_from_iqiyi(url);
    }
    else if (video_from == 'qq') {
        load_from_qq(url);
    }
    if (!url) {
        return;
    }
    function load_play_list(play_list, video_from) {
        $('body').append("<iframe style=\"z-index:10000;position:fixed;top:0;right:0;width:300px;height:400px;margin:10px;border-radius:10px;color:white;overflow:hidden;\" class=\"apee_play_list\" id=\"apee_play_list\" name=\"apee_play_list\" frameborder=\"0\" allowtransparency=\"true\"></iframe>");
        var html = "<!DOCTYPE html>\n        <html lang=\"zh-CN\">\n        \n        <head>\n            <meta charset=\"UTF-8\">\n            <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>Document</title>\n            <style>\n                /* body {\n                    background-color: rgb(148, 51, 51);\n                } */\n        \n                * {\n                    user-select: none;\n                    -moz-user-select: none;\n                    -webkit-user-select: none;\n                }\n        \n                .play_list_box {\n                    position: fixed;\n                    top: 0;\n                    right: 0;\n                    height: calc(100% - 20px);\n                    margin: 10px;\n                    background-color: rgba(0, 0, 0, 0.8);\n                    border-radius: 10px;\n                    color: white;\n                    overflow: hidden;\n                    display: flex;\n                    flex-direction: column;\n                }\n        \n                .play_list_box .nav {\n                    display: flex;\n                    padding: 15px;\n                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);\n                }\n        \n                .play_list_box .nav .title {\n                    margin-right: auto;\n                }\n        \n                .play_list_box .nav .close {\n                    cursor: pointer;\n                    text-align: center;\n                }\n        \n                .play_list_box .play_list {\n                    flex: 1;\n                    padding: 10px;\n                    overflow: auto;\n                }\n        \n                .play_list_box .play_list .content {\n                    display: flex;\n                    flex-wrap: wrap;\n                }\n        \n                .play_list_box .play_list::-webkit-scrollbar-thumb {\n                    background: rgba(69, 157, 245, .24);\n                    border-radius: 3px;\n                    height: 100px;\n                }\n        \n                .play_list_box .play_list::-webkit-scrollbar {\n                    width: 10px;\n                    background: rgba(255, 255, 255, 0.1);\n                }\n        \n                .play_list_box .play_list .item {\n                    padding: 10px;\n                    border: 1px solid white;\n                    border-radius: 10px;\n                    margin-bottom: 10px;\n                    flex: 30px;\n                    cursor: pointer;\n                    text-align: center;\n                    margin: 5px;\n                    transition: all .2s;\n                }\n        \n                .play_list_box .play_list .item:hover {\n                    background-color: rgba(255, 255, 255, 0.3);\n                }\n        \n                .play_list_box .play_list .item.active {\n                    background-color: white;\n                    color: black;\n                }\n        \n                .footer {\n                    text-align: center;\n                    padding: 10px;\n                    border-top: 1px solid rgba(255, 255, 255, 0.3);\n                    color: rgba(255, 255, 255, 0.3);\n                }\n        \n                .show_tab {\n                    position: fixed;\n                    top: 0;\n                    right: 0;\n                    margin: 10px;\n                    padding: 10px;\n                    border-radius: 10px;\n                    background-color: rgba(255, 255, 255, 0.1);\n                    color: rgba(255, 255, 255, 0.5);\n                    cursor: pointer;\n                    display: none;\n                }\n            </style>\n        </head>\n        \n        <body>\n            <div class=\"play_list_box\">\n                <div class=\"nav\">\n                    <div class=\"title\">\u64AD\u653E\u5217\u8868</div>\n                    <div class=\"close\" onclick=\"closeTab()\">\u5173\u95ED</div>\n                </div>\n                <div class=\"play_list\">\n                    <div class=\"content\">\n                        <!-- list -->\n                    </div>\n                </div>\n                <div class=\"footer\" onclick=\"window.open('https://apee.top')\">\n                    By APEE.TOP\n                </div>\n            </div>\n            <div class=\"show_tab\" onclick=\"showTab()\">\n                \u663E\u793A\u64AD\u653E\u5217\u8868\n            </div>\n            <script>\n                var play_list_box = document.querySelector('.play_list_box')\n                var show_tab = document.querySelector('.show_tab')\n                var play_list = document.querySelector('.play_list')\n                function closeTab() {\n                    play_list_box.style.display = 'none'\n                    show_tab.style.display = 'block'\n                }\n                function showTab() {\n                    show_tab.style.display = 'none'\n                    play_list_box.style.display = 'flex'\n                }\n            </script>\n        </body>\n        \n        </html>";
        var list_html = '';
        if (video_from == 'iqiyi') {
            play_list.sort(function (a, b) {
                return a.album_order - b.album_order;
            });
            for (var i = 0; i < play_list.length; i++) {
                if (!play_list[i].page_url) {
                    // 预告片待处理
                    continue;
                }
                var v_url = play_list[i].page_url.replace(/^http(.*)$/, 'https$1');
                var play_url = location.href.replace(/(.*?\?.*url=)http.*?(&.*?)?$/, '$1' + v_url + '$2');
                list_html += "<div class=\"item ".concat(url.search(v_url) != -1 ? 'active' : '', "\" onclick=\"top.location.href='").concat(play_url, "'\">").concat(play_list[i].album_order, "</div>");
            }
        }
        else if (video_from == 'qq') {
            for (var i = 0; i < play_list.length; i++) {
                if (play_list[i].is_trailer == '1') {
                    // 预告片待处理
                    continue;
                }
                var v_url = "https://v.qq.com/x/cover/".concat(play_list[i].cid, "/").concat(play_list[i].vid, ".html");
                var play_url = location.href.replace(/(.*?\?.*url=)http.*?(&.*?)?$/, '$1' + v_url + '$2');
                list_html += "<div class=\"item ".concat(url.search(v_url) != -1 ? 'active' : '', "\" onclick=\"top.location.href='").concat(play_url, "'\">").concat(play_list[i].title, "</div>");
            }
        }
        html = html.replace('<!-- list -->', list_html);
        var iframe = window.frames['apee_play_list'];
        iframe.document.open();
        iframe.document.write(html);
        iframe.document.close();
    }
    /**
     * 爱奇艺解析
     * @param {string} url 视频链接
     */
    function load_from_iqiyi(url) {
        $.get(url, function (data) {
            var entity_id = data.match(/"tvId":(\w+)/)[1];
            var sign = md5("app_version=3.0.0&auth_cookie=&device_id=apee&entity_id=".concat(entity_id, "&src=pcw_tvg&timestamp=0&user_id=&vip_status=0&vip_type=&secret_key=howcuteitis")).toUpperCase();
            var url_2 = "https://mesh.if.iqiyi.com/tvg/pcw/base_info?entity_id=".concat(entity_id, "&timestamp=0&src=pcw_tvg&vip_status=0&vip_type=&auth_cookie=&device_id=apee&user_id=&app_version=3.0.0&sign=").concat(sign);
            $.get(url_2, function (data) {
                if (data.data.template.template_id == 'album_template') {
                    var play_list = data.data.template.pure_data.selector_bk;
                    for (var i = 0; i < play_list.length; i++) {
                        if (typeof play_list[i].videos == 'object' && play_list[i].videos.feature_paged != 'undefined') {
                            play_list = play_list[i].videos.feature_paged;
                            break;
                        }
                    }
                    var keys = Object.keys(play_list);
                    var list = [];
                    for (var i = 0; i < keys.length; i++) {
                        var item = play_list[keys[i]];
                        for (var j = 0; j < item.length; j++) {
                            list.push(item[j]);
                        }
                    }
                    load_play_list(list, 'iqiyi');
                }
            });
        });
    }
    /**
     * 判断视频来源 爱奇艺 腾讯 芒果 优酷
     * @param {string} url 视频连接
     */
    function get_video_from(url) {
        var keys = ['iqiyi.com', 'v.qq.com', 'mgtv.com', 'youku.com'];
        var names = ['iqiyi', 'qq', 'mgtv', 'youku'];
        var url_data = new URL(url);
        for (var i = 0; i < keys.length; i++) {
            if (url_data.hostname.search(keys[i]) != -1) {
                return names[i];
            }
        }
        return false;
    }
    /**
     * 获取GET参数内容
     * @param {string} variable GET参数
     * @returns 参数内容
     */
    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return false;
    }
    /**
     * 腾讯视频解析
     * @param url 视频链接
     */
    function load_from_qq(url) {
        $.get(url, function (data) {
            var json = data.match(/(window\.__pinia=.*?)<\/script>/, data)[1];
            var data = eval(json);
            var list = window.__pinia.episodeMain.listData[0];
            var playlist = [];
            list.forEach(function (item) {
                playlist.push(item['item_params']);
            });
            load_play_list(playlist, 'qq');
        });
    }
}());

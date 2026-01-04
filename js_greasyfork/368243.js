// ==UserScript==
// @name         巴哈姆特公會哈拉串數統計
// @namespace    http://www.isaka.idv.tw/
// @version      1.0
// @description  只要按一下，就可以確認每個人的留言次數了呦～
// @author       Isaka(jason21716@巴哈姆特)
// @match        https://guild.gamer.com.tw/singlePost.php*
// @match        http://guild.gamer.com.tw/singlePost.php*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/368243/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E5%93%88%E6%8B%89%E4%B8%B2%E6%95%B8%E7%B5%B1%E8%A8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/368243/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%85%AC%E6%9C%83%E5%93%88%E6%8B%89%E4%B8%B2%E6%95%B8%E7%B5%B1%E8%A8%88.meta.js
// ==/UserScript==
var newestContent = {};

(function() {
    'use strict';

    function getDomainFromUrl(url) {
        var host = null;

        if (typeof url == "undefined" || null == url)
            url = window.location.href;
        var regex = /.*\:\/\/([^\/]*)\/([^\/]*).*/;
        var match = url.match(regex);
        if (typeof match != "undefined" && null != match) {
            host = new Array(match[1], match[2]);
        }
        return host;
    }

    function getPHPFileNameString(s) {
        var host = null;

        var regex = /([^\/]*)\.php([^\/]*)/;
        var match = s.match(regex);
        if (typeof match != "undefined" && null != match) {
            host = new Array(match[1], match[2]);
        }
        return host;
    }

    $('.BH-menuE').append('<li id="script_count_btn"><a>留言次數統計</a></li>');

    $('#script_count_btn').click(function(){
        var current_url = window.location.href;
        new Promise((resolve, reject) => {
            console.log('Initial');

            var singleACMsgParme = null;
            var urls = getDomainFromUrl(window.location.href);
            var pageName = getPHPFileNameString(urls[1]);
            var sn_regex = /[\?&]sn=(\d*)/;
            var sn_match = pageName[1].match(sn_regex);
            var gsn_regex = /[\?&]gsn=(\d*)/;
            var gsn_match = pageName[1].match(gsn_regex);

            window.MsgId = sn_match[1];
            window.guildId = gsn_match[1];

            resolve();
        }).then((resolve, reject) => {
            return $.ajax({
                url: globalConfig.apiRoot + '/v1/comment_list_legacy.php',
                method: 'GET',
                data: {
                    gsn: guildId,
                    messageId: MsgId,
                },
                xhrFields: {
                    withCredentials: true
                }
            })

        }).then((resolve, reject) => {
            var res = resolve;

            var player_data = {};
            var total_num = res.data.comments.length;


            res.data.comments.forEach((element,idx)=>{
                if( player_data[ element['userid'] ] != null ){
                    player_data[ element['userid'] ].count += 1;
                }else{
                    player_data[ element['userid'] ] = {};
                    player_data[ element['userid'] ].nickname = element['name'];
                    player_data[ element['userid'] ].count = 1;
                }
            });

            var key_arr = Object.keys(player_data);
            var result_text = '目前留言統計：\n';
            key_arr.forEach(function(element) {
                result_text += player_data[element].nickname + '(' + element + ')：' + player_data[element].count + '\n';
            });
            result_text += '總留言數：' + total_num;
            alert(result_text);
            return Promise.resolve();
        })
    });

})();
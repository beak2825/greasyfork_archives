// ==UserScript==
// @name         一同看下载视频插件(需要自带VIP)
// @namespace    http://aelous.ncom/
// @version      0.1
// @description  一同看下载视频
// @author       Aelous
// @match        www.gvpass.com/*
// @license      MIT
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant       unsafeWindow
// @grant       GM.xmlHttpRequest
// @grant       GM.setClipboard
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/2.2.4/jquery.min.js
// @require     https://cdn.bootcss.com/jszip/3.1.4/jszip.min.js
// @downloadURL https://update.greasyfork.org/scripts/436263/%E4%B8%80%E5%90%8C%E7%9C%8B%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6%28%E9%9C%80%E8%A6%81%E8%87%AA%E5%B8%A6VIP%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436263/%E4%B8%80%E5%90%8C%E7%9C%8B%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E6%8F%92%E4%BB%B6%28%E9%9C%80%E8%A6%81%E8%87%AA%E5%B8%A6VIP%29.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Your code here...
       (function () {
           $("body").append($('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">'));
           $('header').after('<div class="panel panel-default">'+
           '<div class="panel-heading" style="text-align: center;">加载成功'+
           '</div>'+
           '<div class="panel-body" id="item_box">'+
           '</div>'+
           '</div>')
            var innerHtml = $('body').html();
            var spt = innerHtml.match('<script[^><]*>([^><]*)</script>')[1]
            spt = spt.match('quality: \\[([^><]*)\\],')[1]
            spt = '[' + spt + ']'
            spt = spt.replace(/[\r\n]/g,"").replace(/[ ]/g,"");
			spt = spt.replace(/(?:\s*['"]*)?([a-zA-Z0-9]+)(?:['"]*\s*)?:/g, "'$1':");
			var json = eval('('+ spt + ')');
            console.log(json);
            for (const item in json) {
                console.log(json[item]);
                $('#item_box').append('<div class="col-lg-6">'+
                                    '<div class="input-group">'+
                                    '<input type="text" class="form-control" value="'+json[item].url+'">'+
                                    '<span class="input-group-btn">'+
                                    '<button class="btn btn-default" id="video_download" type="button">下载' + json[item].name +'</button>'+
                                    '</span>'+
                                    '</div>'+
                                    '</div>')
            }
       })();

       $('body').on('click', '#video_download', function () {
           var url = 'https://www.gvpass.com' + $(this).parent().prev().val()
           console.log(url);
        //    checkM3u8Url(url)
           var data = {
               topic: 'aelous_downLoadM3u8',
               name: $('.content-wrap .content .sptitle h1').text(),
               url : url
           }
           GM.setClipboard(JSON.stringify(data))

       });
//https://www.gvpass.com/1637566307/3cff50ff6520acc880e82ef841484fb6/data/a835b43a266a6b124141369d3fdcde08/450/index.m3u8
//{"topic":"downLoadM3u8","name":"健身房性調教","url":"https://www.gvpass.com/1637573832/15af11a12e24c216ce986efa5ded73a8/data/a835b43a266a6b124141369d3fdcde08/1800/index.m3u8"}
})();
// ==UserScript==
// @name  Douban Programme
// @namespace https://malash.me/
// @author  Malash <i@malash.me>
// @icon  http://img3.douban.com/favicon.ico
// @version 1.3.1
// @description 豆瓣歌单自动生成脚本
// @homepageURL https://github.com/malash/douban-programme
// @include http://music.douban.com/subject/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/11155/Douban%20Programme.user.js
// @updateURL https://update.greasyfork.org/scripts/11155/Douban%20Programme.meta.js
// ==/UserScript==

/* global jQuery */
'use strict';
!(function(window) {
    window.addEventListener('load', function() {
        /*jshint -W020 */
        $ || ($ = jQuery);
        function make() {
            function getCk() {
                var cookies = document.cookie.split(';');
                cookies = cookies.filter(function(cookie) {
                    return $.trim(cookie).startsWith('ck=');
                });
                if (cookies.length === 0) {
                    return null;
                }
                var cookie = cookies[0];
                return cookie.substring(cookie.indexOf('=') + 2, cookie.length - 1);
            }
            var ck = getCk();
            if (!ck) {
                alert('请登录后操作');
                return;
            }
            var title = $('#wrapper h1 span').html();
            if (!title) {
                alert('请在专辑页面运行');
                return;
            }
            if ($('.song-item').length === 0) {
                alert('此专辑没有可以添加到收藏的曲目');
                return;
            }
            while (title.length > 20) {
                title = prompt('原标题过长，请修改为20字以内', title);
                if (!title || title.length === 0) {
                    return;
                }
            }
            $.post('http://music.douban.com/j/songlist/create', { sl_title: title, ck:ck }, function(result) {
                if (result.r !== 'success') {
                    $('#douban-programme').html('创建歌单失败，请刷新重试');
                    return;
                }
                $('#douban-programme-btn').hide();
                $('#douban-programme').html('创建歌单成功');
                var url = result.sl_url;
                var programmeID = parseInt(url.substring(url.lastIndexOf('/') + 1, url.length));
                var elItems = $('.song-item');
                function add(copyI) {
                    var songId = $(elItems[copyI]).attr('id');
                    $('#douban-programme').html('正在添加第' + (copyI + 1) + '首');
                    $.ajax({
                        type: 'POST',
                        url: 'http://music.douban.com/j/songlist/addsong',
                        data: { sl_id: programmeID, song_id: songId, ck: ck },
                        success: function(){
                            if (copyI + 1 < elItems.length) {
                                setTimeout(function() {
                                    add(copyI + 1);
                                }, 0);
                            } else {
                                $('#douban-programme').html('添加完成，正在添加专辑封面');
                                GM_xmlhttpRequest({
                                    method: 'GET',
                                    url: $('.nbg')[0].href,
                                    responseType: 'blob',
                                    onload: function(response){
                                        if (response.status === 200) {
                                            var blob = new Blob([response.response], {type: 'image/jpeg'});
                                            var formData = new FormData();
                                            formData.append('cover-file', blob, 'upload.jpg');
                                            formData.append('songlist_id', programmeID);
                                            formData.append('ck', ck);
                                            var xhr = new XMLHttpRequest();
                                            xhr.open('POST', 'http://music.douban.com/j/songlist/upload_cover');
                                            xhr.send(formData);
                                            xhr.addEventListener('load', function() {
                                                var data = JSON.parse(this.responseText);
                                                if (data.r !== 'success') {
                                                    $('#douban-programme').html(data.msg);
                                                    window.location.href = url;
                                                    return;
                                                }
                                                $.ajax({
                                                    type: 'POST',
                                                    url: 'http://music.douban.com/j/songlist/update_cover',
                                                    data: { songlist_id: programmeID, pos: '0_0_' + data.width + '_' + data.height, ck: ck },
                                                    success: function(data) {
                                                        $('#douban-programme').html('添加封面成功');
                                                        window.location.href = url;
                                                    },
                                                    error: function() {
                                                        $('#douban-programme').html('添加封面失败');
                                                        window.location.href = url;
                                                    }
                                                });
                                            });
                                            xhr.addEventListener('error', function() {
                                                $('#douban-programme').html('添加封面失败');
                                                window.location.href = url;
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
                add(0);
            });
        }

        if (!$('#wrapper h1 span').html()) {
            return;
        }
        $('<button id="douban-programme-btn">自动生成豆瓣歌单</button><span id="douban-programme"></span>').appendTo('#wrapper h1').click(function(){
            make();
        });
    });

})(window);
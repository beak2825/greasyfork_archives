// ==UserScript==
// @id             ajax_pixiv_bookmark
// @name           AJAX Pixiv Bookmark
// @version        3.0.4
// @description  Modified from https://github.com/killtw/AJAX-Pixiv-Bookmark 可自动从 http://www.pixiv.net/bookmark_tag_all.php 获取可用的标签。
// @namespace      pikashi
// @author         pks
// @description    Using AJAX to add a bookmark in Pixiv
// @match          http://www.pixiv.net/member_illust.php?*
// @match          https://www.pixiv.net/member_illust.php?*
// @match          http://www.pixiv.net/setting_user.php
// @match          https://www.pixiv.net/setting_user.php
// @icon         https://www.pixiv.net/favicon.ico
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/29069/AJAX%20Pixiv%20Bookmark.user.js
// @updateURL https://update.greasyfork.org/scripts/29069/AJAX%20Pixiv%20Bookmark.meta.js
// ==/UserScript==

var init = function () {
    var settings;

    settings = {
        default_tag: localStorage.default_tag
    };
    $('table tbody:eq(1)').append('\
<tr><th>預設標籤</th><td>\
<p>當沒有符合的標籤時將使用代入預設標籤，空白即不代入預設標籤</p>\
<p><input type="text" name="default_tag" onkeyup="localStorage.setItem(\'default_tag\', this.value)" value="' + settings.default_tag + '"></p>\
</td></tr>');
};

var main = function() {
    console.log('pixiv ajax bookmark setup');
    var editURL = $('a.qtQbBkD').prop('href');
    if (!$('a._2zvNuR6').length) {
        $('a.qtQbBkD').prop('href','javascript:;').click(function(e) {
        var illust_id, illust_tags, input_tag, tt, my_tags;

        e.preventDefault();
        e.stopPropagation();
        illust_tags = [];
        input_tag = [];
        my_tags = [];
        illust_id = document.URL.match(/\d+/)[0];
        tt = globalInitData.token||pixiv.context.token||$('input[name="tt"]').val();
        $.ajax({
            url: 'https://www.pixiv.net/bookmark_tag_all.php',
            type: 'GET',
            dataType: 'html',
            beforeSend: function() {
                var tag, _i, _len, _ref;

                if (document.URL.match('manga')) {
                    $.ajax({
                        url: "https://www.pixiv.net/member_illust.php?mode=medium&illust_id=" + illust_id,
                        type: 'GET',
                        dataType: 'html',
                        async: false,
                        success: function(data) {
                            var tag, _i, _len, _ref;

                            _ref = $(data).find('footer ul._18Ri3hp a');
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                tag = _ref[_i];
                                illust_tags.push(tag.text);
                            }
                            return tt = globalInitData.token||pixiv.context.token||$(data).find('input[name="tt"]')[0].value;
                        }
                    });
                } else {
                    _ref = $('footer ul._18Ri3hp a');
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        tag = _ref[_i];
                        illust_tags.push(tag.text);
                    }
                }
            },
            success: function(data) {
                var tag, _i, _len, _ref;

                $(data).find('a.tag-name').text(function(index,text){
                    my_tags.push(text);
                });
                _ref = $(data).find('a.tag-name');
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    tag = _ref[_i];
                    if (illust_tags.indexOf(tag.text) !== -1) {
                        input_tag.push(tag.text);
                    }
                }
                if (input_tag.length === 0) {
                    input_tag.push(settings.default_tag);
                }
            },
            complete: function() {
                $.ajax({
                    url: 'bookmark_add.php',
                    data: {
                        mode: 'add',
                        tt: tt,
                        id: illust_id,
                        tag: input_tag.join(' '),
                        type: 'illust',
                        form_sid: '',
                        restrict: '0'
                    },
                    dataType: 'html',
                    type: 'POST',
                    success: function() {
                        $('a.qtQbBkD').fadeOut('fast').addClass('_2zvNuR6').fadeIn('fast').off('click').prop('href',editURL);
                    }
                });
            }
        });
    });
    }
    console.log('pixiv ajax bookmark setup ended');
};

$(window).load(function(){
    console.log("document fully loaded and parsed");
    init();
    main();
});



// ==UserScript==
// @name         jandan comment refresh
// @namespace    mtdwss@gmail.com
// @version      0.2.3
// @description  1、添加评论页内刷新按钮；2、显示图片原始大小。
// @author       mtdwss@gmail.com
// @match        http*://jandan.net/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/38385/jandan%20comment%20refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/38385/jandan%20comment%20refresh.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top != window.self) return;

    if (window.location.href.match(/^http(s?)\:\/\/jandan\.net\/20\S+\.html/g)) {
        var wc = wilsonScore();
        var cl = $('ol.commentlist>li');
        cl.sort(function ($1, $2) {
            $1 = $($1);
            $2 = $($2);
            var nag1, nag2, pos1, pos2;
            var score1, score2;
            if ($1.attr('score')) {
                score1 = $1.attr('score');
            } else {
                nag1 = $1.find('.tucao-unlike-container').children('span').eq(0).text().trim();
                pos1 = $1.find('.tucao-like-container').children('span').eq(0).text().trim();
                score1 = wc(pos1, nag1);
                if (isNaN(score1)) score1 = 0;
                $1.attr('score', score1);
                console.log(nag1, pos1, score1);
            }

            if ($2.attr('score')) {
                score2 = $2.attr('score');
            } else {
                nag2 = $2.find('.tucao-unlike-container').children('span').eq(0).text();
                pos2 = $2.find('.tucao-like-container').children('span').eq(0).text();
                score2 = wc(pos2, nag2);
                if (isNaN(score2)) score2 = 0;
                $2.attr('score', score2);
                console.log(nag2, pos2, score2);
            }
            if (score1 > score2) return -1;

            if (score1 == score2) return 0;
            return 1;
        });
        $('.hot-list').after('<div id="hot-comment"><span style="font-size:16px;color:red;">热门评论</span><ol></ol></div>')
        for (var i = 0; i < 10; i++) {
            if (cl.eq(i)) {
                var node = $(cl.eq(i)).clone();
                node.find('small,.comment-report,.tucao-btn,.righttext').remove().empty();
                $('#hot-comment>ol').append(node);
            }
        }
    } else {
        //执行刷新操作
        document.refreshComment = function (node) {
            node = node.parent().parent('div');
            var c = node.attr('id').split('-')[2];
            node.children('.tucao-hot, .tucao-list, .jandan-tucao-more, .jandan-tucao-close, .tucao-form, #tucao-gg').remove().empty();
            var a = $('<div class="tucao-tmp">数据加载中....biubiubiu....</div>');
            node.append(a);
            $.ajax({
                url: "/tucao/" + c,
                method: "GET",
                data: {
                    _: (new Date()).valueOf()
                },
                dataType: "json",
                success: function (f) {
                    node.children('.tucao-tmp').remove().empty();
                    if (f.code != 0) {
                        alert(f.msg);
                        return;
                    }
                    if (f.hot_tucao.length) {
                        tucao_show_hot(node, f.hot_tucao);
                    }
                    tucao_show_list(node, f.tucao);
                    if (f.has_next_page) {
                        tucao_show_more_btn(node, c);
                    }
                    tucao_show_close_btn(node, c);
                    tucao_show_form(node, c);
                },
                error: function (e) {
                    a.html("hmm....something wrong...");
                }
            });
        };

        //添加刷新按钮
        $(document).bind('DOMNodeInserted', function (e) {
            var element = e.target;
            element = $(element);
            if (element.hasClass('tucao-form')) {
                var node = element.parent('div');
                if (node.find('.tucao-refresh').length) return;
                node.prepend('<div class="tucao-refresh" style="text-align: right;"><span style="cursor: pointer;" onclick="refreshComment($(this))">刷新</span></div>');
            }
        });

        //添加原图大小
        $('.view_img_link').each(function (idx, val) {
            var view_img_link = $(this).attr('href');
            var _this = $(this);
            GM_xmlhttpRequest({
                method: "HEAD",
                url: 'https:' + view_img_link,
                onload: function (response) {
                    var headers = {};
                    var headarray = response.responseHeaders.split('\n');
                    for (var i in headarray) {
                        var d = headarray[i].split(':');
                        var k = d[0],
                            v = d[1] === undefined ? undefined : d[1].trim();
                        headers[k] = v;
                    }

                    var imgSize = headers['Content-Length'.toLowerCase()];
                    imgSize = bytesToSize(imgSize);
                    var vim_node = $("<a href='javascript:;' style='font-weight:700;font-size:12px;'> (" + imgSize + ")</a>");
                    var img_elem = _this.next('br').next('img');
                    var mask_elem = img_elem.next('.gif-mask');
                    if (mask_elem.size() > 0) {
                        mask_elem = mask_elem.eq(0);
                        vim_node.attr('mask', true);
                    }
                    vim_node.click(function () {
                        if (vim_node.attr('mask') === 'true') {
                            mask_elem.click();
                            vim_node.attr('mask', false);
                        } else {
                            img_elem.click();
                        }
                    })
                    vim_node.insertAfter(_this);
                    _this.prop('title', '原图大小：' + imgSize);
                }
            });
        });
    }


    //byte -> KB,MB,GB
    function bytesToSize(bytes) {
        if (bytes < 1024) return bytes + " Bytes";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(3) + " KB";
        else if (bytes < 1073741824) return (bytes / 1048576).toFixed(3) + " MB";
        else return (bytes / 1073741824).toFixed(3) + " GB";
    }

    function wilsonScore(z) {
        if (z == null) {
            // z represents the statistical confidence
            // z = 1.0 => ~69%, 1.96 => ~95% (default)
            z = 1.96;
        }

        return function (ups, downs) {
            var n = ups + downs;
            if (n === 0) {
                return 0;
            }

            var p = ups / n,
                sqrtexpr = (p * (1 - p) + z * z / (4 * n)) / n;
            return (p + z * z / (2 * n) - z * Math.sqrt(sqrtexpr)) / (1 + z * z / n);
        };
    };
})();
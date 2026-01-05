// ==UserScript==
// @name        BYRBT Info Clone
// @author      Deparsoul
// @description 一键克隆已有种子的信息
// @namespace   https://greasyfork.org/users/726
// @include     http*://bt.byr.cn*/torrents.php*
// @include     http*://bt.byr.cn*/upload.php?type=*
// @include     http*://bt.byr.cn*/details.php*
// @icon        http://bt.byr.cn/favicon.ico
// @grant       none
// @version     20181004
// @downloadURL https://update.greasyfork.org/scripts/10876/BYRBT%20Info%20Clone.user.js
// @updateURL https://update.greasyfork.org/scripts/10876/BYRBT%20Info%20Clone.meta.js
// ==/UserScript==

var script_version = '';
if (GM_info && GM_info.script) {
    script_version = GM_info.script.version || script_version;
}

(function ($) {

// 在种子页面显示相关信息
if ($('#kdescr').length) {
    // 显示克隆来源、脚本版本等信息
    var meta = $('#kdescr .byrbt_info_clone:last');
    if (meta.length) {
        $('#kdescr').closest('tr').after('<tr><td></td><td class="byrbt_info_clone_meta"></td></tr>');
        var meta_td = $('.byrbt_info_clone_meta');
        var meta_clone = (meta.data('clone') || '').toString().replace(/\D/g, '');
        var meta_version = (meta.data('version') || '').toString().replace(/[^\dA-Za-z-. ]/g, '');
        if (meta_clone)
            meta_td.append('种子信息克隆自 <a target="_blank" href="details.php?id=' + meta_clone + '&hit=1">Torrent ' + meta_clone + '</a> ');
        meta_td.append('<div style="float:right">Powered by BYRBT Info Clone ' + meta_version + '</div>');
    }
    // 显示动漫信息卡片
    if ($('#type').text().trim() == '动漫' && $('#sec_type').text().trim() == '动画') {
        var title = $('#share').text().trim();
        var match = title.match(/\[.*?\]\[.*?\]\[(.*?)\]\[(.*?)\]/);
        var titles = [];
        if (match[1])
            titles = titles.concat(match[1].split(/\s*\/\s*/));
        if (match[2])
            titles.push(match[2]);
        if (!titles.length)
            return;
        match = title.match(/\[(\d{4})\.(\d+)\]/);
        var date;
        if (match) {
            date = new Date([match[1], match[2], '1'].join('-'));
            date = date.getTime() / 1000;
        }
        if (!date)
            return;
        var query = titles.map(function (title) {
            return 'titles[]=' + encodeURIComponent(title);
        });
        query.push('date=' + date);
        var url = 'https://anydb.depar.cc/anime/card?_cf_cache=1#fade&hover&' + query.join('&');
        console.log(url);
        var iframe = $('<iframe scrolling="no" style="border:none;width:400px;height:200px;overflow:hidden;position:absolute;right:0;"></iframe>');
        iframe.attr('src', url);
        $('#kdescr').css('position', 'relative').prepend(iframe);
    }
    return;
}

// 为种子列表添加克隆按钮
if ($('table.torrents').length) {
    $('table.torrents td.colhead:eq(0)').after('<td class="colhead"></td>');
    $('table.torrents>tbody>tr').each(function () {
        var tr = $(this);
        if (tr.find('table.torrentname').length) {
            var cat = tr.find('a[href^="?cat="]').attr('href').match(/cat=(\d+)/)[1];
            var id = tr.find('table.torrentname td:nth-child(1) a').attr('href').match(/id=(\d+)/)[1];
            tr.find('td:eq(0)').after('<td class="rowfollow"><a title="点击克隆种子信息" target="_blank" href="upload.php?type=' + cat + '#clone_' + id + '"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGHSURBVDhPfVHNTsJAEN538QVIfAyfgHLQUNQDD6EShCKevRhRiyYmejLRA0qhpQJiRBLjG+hJEyP+HBnn2+5qG1a/5Mu3MzszO/0q8tWD1+XKPuUqLrNuoEu4R50wAZfA1z8EUKdakrCdaMCtEDRk3jFHijiDQI7rVEsStuPKAgx4ZD0ZjuiZ9bTbpRfWBzVgkT9FtSShN9Cvo6E6lyarciiZ3jyijFOnhbJLtskXu7QnB5wFIb2zeoMBZbgR+FD8VDT6Ypd2ZdBoXtJFy6N+v0dWMcrFfdFEjDyA7YW9XpNBs+lJ7YUdsgo1mvBZ+3I8uqcnpYh/B7AvekDgtykMfLrpX1F6bUfm8Bqo/whU5wC5wVI58iAOa3VbKnx5Yz3vXdNYKWLkAfgn8hvuGEOwCZhjT+YL0QbwpeF51O6ECUUegH/4kynmbJzZmC8TNsPzWgnVfuFBrp9G3JfA9ylgb36ImPPAnwNMvpiAOtWShL2y1da+ZIvTRB738E+1TGGGmfDFTJH6Bk9fZApqlbl/AAAAAElFTkSuQmCC"></a></td>');
        }
    });
    return;
}

// 在表单中添加一行，用于本脚本和用户交互
$('#compose>table tr:eq(1)').after('<tr><td class="rowhead nowrap">种子信息克隆</td><td style="text-align:left"><input type="text" class="clone_skip" style="text-align:start;width:140px;" id="clone_from"><input type="button" style="width:60px;" id="clone_btn" value="克隆">&nbsp;&nbsp;&nbsp;&nbsp;<span id="clone_info">要克隆的种子编号或者链接</span></td></tr>');

// 需要单独填写或者不需要填写的input
$('input[name=small_descr]').addClass('clone_skip');
$('input[name=url]').addClass('clone_skip');
$('input[name=dburl]').addClass('clone_skip');

// 通过分析种子，获取待发布文件名，并根据文件名自动填写表单中的某些字段
var filename;
function get_match(str, reg, group) {
    group = group || 1;
    var match = str.match(reg);
    if (match && match[group])
        return match[group];
    else
        return '';
}
function build_regexp(template, array) {
    return new RegExp(template.replace('ARRAY', array.join('|')), 'i');
}
$('#compose>table tr:eq(3)').after('<tr id="clone_auto"><td class="rowhead nowrap">自动填写</td><td style="text-align:left" id="clone_auto_fields"></td></tr>');
$('body').append('<style>' +
    '.clone_auto_field {cursor:pointer;border:1px solid #999999;display:inline-block;margin:0 5px 0 0;padding:2px 5px;}' +
    '.clone_auto_field_name {color:gray;}' +
    '.clone_auto_field_new .clone_auto_field_val {font-weight:bold;color:red;}' +
    '</style>');
function analyse_filename() {
    $('#clone_auto').hide();
    if (!filename) return;
    var type = $('input[name=type]').val();
    var fields = {};
    if (type == 404) {
        fields = {
            subteam:        get_match(filename, /^\[([^\]]+)\]\[([^\]]+)\]/, 1),
            comic_ename:    get_match(filename, /^\[([^\]]+)\]\[([^\]]+)\]/, 2).replace(/_/g, ' '),
            comic_episode:  get_match(filename, /\[(\d+)\]/),
            comic_quality:  get_match(filename, build_regexp('\\[(ARRAY)\\]', comic_quality_array)).toLowerCase(),
            comic_filetype: get_match(filename, build_regexp('\\.(ARRAY)$', comic_filetype_array)).toUpperCase(),
        };
    }
    if (type == 401) {
        fields = {
            tv_ename:       filename,
            tv_season:      get_match(filename, /\.([S\dE\-]+)\./),
            tv_filetype:    get_match(filename, build_regexp('\\.(ARRAY)$', tv_filetype_array)).toUpperCase(),
        };
        if (fields.tv_filetype)
            fields.tv_ename = filename.replace(new RegExp('\\.' + fields.tv_filetype + '$', 'i'), '');
    }
    if (type == 408) {
        fields = {
            ename0day:      filename,
        };
    }
    $('#clone_auto_fields').html('');
    for (var key in fields) {
        var val = fields[key];
        var input = $('[name=' + key + ']');
        if (!val || !input.length)
            continue;
        var name = input.closest('tr').find('td:eq(0)').text();
        var span = $('<span class="clone_auto_field"><span class="clone_auto_field_name">' + name + '</span>：<span class="clone_auto_field_val">' + val + '</span></span>');
        span.data('key', key);
        span.data('val', val);
        if (input.val() != val)
            span.addClass('clone_auto_field_new');
        $('#clone_auto_fields').append(span);
    }
    if (type == 404) {
        var link = $('<a rel="noopener noreferrer">动漫板块推荐尝试全新的 BYRBT Bangumi Info 脚本，对于多数新番可以全自动生成包括简介在内的大部分信息</a>');
        if ($('#bangumi_info_row').length)
            link.attr('href', '#bangumi_info_row').click(function () { $('#bangumi_info_process').click(); });
        else
            link.attr('href', 'https://greasyfork.org/zh-CN/scripts/39367-byrbt-bangumi-info').attr('target', '_blank');
        $('#clone_auto_fields').append('<br>').append(link);
    }
    $('#clone_auto_fields').append('<br>从种子文件中分析出以上字段，请点击想要填写的字段，<span class="clone_auto_field_new"><span class="clone_auto_field_val">高亮</span></span>表示与下方目前填写的内容不同，该功能目前处于测试阶段，适配了动漫、剧集、电影板块，欢迎反馈');
    if ($('.clone_auto_field').length)
        $('#clone_auto').show();
}
analyse_filename();
$('#clone_auto_fields').on('click', '.clone_auto_field', function () {
    var span = $(this);
    var input = $('[name=' + span.data('key') + ']');
    input.val(span.data('val'));
    analyse_filename();
});
if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('torrent').addEventListener('change', function (e) {
        filename = '';
        var f = e.target.files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var torrent = e.target.result;
                var match = torrent.match(/4:name(\d+):(.*)/);
                if (match)
                    filename = match[2].substring(0, match[1]);
                analyse_filename();
            };
            r.readAsText(f);
        }
    });
}

// 点击克隆按钮
$('#clone_btn').click(function () {
    // 获取要克隆的种子编号
    var from = $('#clone_from').val().trim();
    var info = $('#clone_info');
    var match = from.match(/id=(\d+)/);
    if (match) {
        from = match[1];
    }
    if (/^\d+$/.test(from)) {
        // 如果输入了有效的编号，开始读取对应的种子页面
        info.text('正在读取');
        $.get('details.php?id=' + from + '&hit=1&ModPagespeed=off', function (resp) {
            info.text('正在分析');
            var title = resp.match(/<title[^>]*>[\s\S]*<\/title>/gi)[0];
            var body = resp.match(/<body[^>]*>[\s\S]*<\/body>/gi)[0];
            var page = $(body); // 构造 jQuery 对象
            var match = title.match(/种子详情 &quot;(.*)&quot; - Powered/);
            if (!match) {
                info.text('失败，可能由于种子不存在或者网络问题');
                return;
            }

            // 利用种子标题中的信息填写表单
            title = $('<textarea />').html(title).text(); // 处理HTML entity
            // 将标题中的字段拆开
            var fields = title.match(/\[[^\]]*\]/g);
            for (var i = 0; i < fields.length; ++i) {
                fields[i] = fields[i].replace(/^\[|\]$/g, '');
            }
            var next = 0;
            var check_array = true; // 是否需要检查字段取值
            var input_count = $('#compose :text:not(.clone_skip)').length;
            if (input_count == fields.length - 1) {
                fields.shift(); // 处理二级标题带来的多余字段
            }
            if (input_count == fields.length) {
                // 如果标题中的字段数和需要填写的字段数一致，则不进行字段取值检查
                check_array = false;
            }
            $('#compose :text').each(function () {
                if (next >= fields.length)
                    return;
                var nextValue = fields[next];
                var input = $(this);

                // 判断是否可以填入
                var fill = true;
                if (input.hasClass('clone_skip'))
                    fill = false;
                if (check_array && input.attr('onfocus')) {
                    match = input.attr('onfocus').match(/showselect\("([^"]+)"\)/);
                    if (match) {
                        var arr = eval(match[1] + '_array');
                        if (arr) {
                            if (arr.indexOf(nextValue) < 0) {
                                fill = false;
                            }
                        }
                    }
                }
                if (fill) {
                    input.val(nextValue);
                    ++next;
                }
            });

            // 填写二级类型
            $('select[name=second_type] option:contains(' + page.find('#sec_type').text() + ')').attr('selected', 'selected');

            // 填写副标题
            $('input[name=small_descr]').val(page.find('#subtitle li').text());

            // 填写IMDb链接
            if (page.find('.imdbRatingPlugin').length)
                $('input[name=url]').val('http://www.imdb.com/title/' + page.find('.imdbRatingPlugin').data('title') + '/');

            // 填写豆瓣链接
            $('input[name=dburl]').val(page.find('.rowhead:contains("豆瓣信息")').next().find('a[href*="://movie.douban.com/subject/"]').text());

            // 填写bgm.tv链接
            $('input[name=bgmtv_url]').val(
                page.find('.rowhead:contains("BGMTV信息")').next().find('a[href*="://bgm.tv/subject/"]').text() ||
                page.find('.byrbt_bangumi_info_reference_bgm').text()
            );

            // 填写描述
            var descr = page.find('#kdescr');
            // 还原图片链接
            descr.find('img').each(function () {
                var img = $(this);
                img.removeAttr('onload');
                img.removeAttr('pagespeed_url_hash');
                img.removeAttr('data-pagespeed-url-hash');
                var src = img.attr('src');
                src = src.replace(/images\/(\d+x\d+x|x)(.*)\.pagespeed\.ic.*/g, "images/$2");
                img.attr('src', src);
            });
            // 移除无需复制的元素
            descr.find('.byrbt_info_clone_ignore').remove();
            descr.find('.autoseed').remove();
            // 添加元信息
            descr.find('.byrbt_info_clone').remove();
            descr.append('<div class="byrbt_info_clone" data-clone="' + from + '" data-version="' + script_version + '" style="display:none">Powered by BYRBT Info Clone</div>');
            CKEDITOR.instances.descr.setData(descr.html());

            // 默认勾选匿名
            $('input[name=uplver]').prop('checked', true);

            info.text('克隆完成');

            analyse_filename();
        });
    } else {
        alert('请输入有效的种子编号或者链接');
    }
    return false;
});

CKEDITOR.on('instanceReady', function (evt) {
    // 检查hash中是否指定了需要克隆的种子
    var match = location.href.match(/#clone_(\d+)/);
    if (match) {
        history.pushState("", document.title, window.location.pathname + window.location.search); // 清空hash
        $('#clone_from').val(match[1]);
        $('#clone_btn').click();
    }
});

})(jQuery);

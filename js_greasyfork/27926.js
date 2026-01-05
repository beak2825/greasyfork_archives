// ==UserScript==
// @id              TumblrUrlGet
// @name            TumblrUrlGet
// @version         1.4.0
// @namespace       Malygose
// @author          Malygose
// @description     分析Tumblr视频下载地址，同时转换为国内可直接下载的URL
// @include         *://www.tumblr.com/*
// @run-at          document-end
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require         http://cdn.bootcss.com/lodash.js/4.17.4/lodash.min.js
// @require         http://cdn.bootcss.com/async/2.1.5/async.min.js
// @connect         www.clipconverter.cc
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/27926/TumblrUrlGet.user.js
// @updateURL https://update.greasyfork.org/scripts/27926/TumblrUrlGet.meta.js
// ==/UserScript==

var conf = {
    classPrefix: 'by-hand',
    baseUrl: 'http://www.clipconverter.cc',
    mediaInfoUrl: '/check.php',
    convertProgressUrl: '/download/{slug}/0/?ajax'
};

$(function() {
    var container = $('<div>').addClass(conf.classPrefix).css({
        fontFamily: 'Microsoft YaHei',
        fontSize: '12px',
        lineHeight: '20px',
        minWidth: '220px',
        opacity: '0.9',
        position: 'absolute',
        right: '10px',
        top: '12px',
        zIndex: 10000
    });

    var confirmButton = $('<button>').addClass(conf.classPrefix + '-confirm').css({
        backgroundColor: '#7EC0EE',
        borderRadius: '0 3px 3px 0',
        display: 'inline-block',
        float: 'right',
        minWidth: '44px',
        opacity: '0.9',
        padding: '5px 10px',
        cursor: 'pointer'
    }).text('转换');
    $(document).on('mouseover', 'button.' + conf.classPrefix + '-confirm', function() {
        $(this).css('opacity', '1');
    });
    $(document).on('mouseout', 'button.' + conf.classPrefix + '-confirm', function() {
        $(this).css('opacity', '0.9');
    });
    $(document).on('click', 'button.' + conf.classPrefix + '-confirm', function() {
        var thiz = $(this);
        thiz.attr('disabled', 'disabled').css('cursor', 'not-allowed').data('url', thiz.next().text()).text('...');
        thiz.siblings(conf.classPrefix + '-result-container').remove();
        getVideoList(thiz.next().text(), function(err, result) {
            thiz.parent().append(renderResultContainer(result, thiz));
        });
    });
    confirmButton.appendTo(container);

    var urlContain = $('<div>').addClass('url-contain').css({
        backgroundColor: '#FFF',
        borderRadius: '3px 0 0 3px',
        color: '#F00',
        display: 'inline-block',
        float: 'right',
        padding: '5px 10px',
        userSelect: 'text'
    }).text('没有找到下载地址');
    urlContain.appendTo(container);

    container.append($('<div>').css('clear', 'both'));

    $(document).on('mouseover', 'div[data-crt-video]', function() {
        var backup = container.clone();
        var gaps = $(this).attr('poster').split('_');
        var url = 'https://vt.tumblr.com/tumblr_{slug}.mp4';
        if (gaps.length === 3) {
            backup.find('.url-contain').text(url.replace('{slug}', gaps[1]));
            if (!$(this).find(':first-child').hasClass(conf.classPrefix)) $(this).prepend(backup);
        }
    });
});

function getVideoList(url, next) { // 获取当前链接的资源列表
    GM_xmlhttpRequest({
        method: 'POST',
        url: conf.baseUrl + conf.mediaInfoUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: 'mediaurl=' + url,
        onload: function (response){
            var result = JSON.parse(response.responseText.replace(/<iframe[\s\S]*<\/iframe>/, ''));
            next(null, result);
        }
    });
}

function convertMedia(data, next) { // 转换视频
    GM_xmlhttpRequest({
        method: 'POST',
        url: conf.baseUrl + conf.mediaInfoUrl,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: _.map(data, function(v, k) { return k + '=' + v; }).join('&'),
        onload: function (response){
            next(null, JSON.parse(response.responseText));
        }
    });
}

function getFinishedUrl(data, next) {
    var url = '';
    
    if (!data.hash) return next(null, url);
    async.whilst(function() {
        return url === '';
    }, function(next) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: conf.baseUrl + conf.convertProgressUrl.replace('{slug}', data.hash),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (response){
                var dom = $(response.responseText);
                if (dom.find('div.row-right strong').length && dom.find('div.row-right strong').eq(2).text() !== '0 Byte') {
                    url = dom.find('#downloadbutton').attr('href');
                }
                setTimeout(next, 1000);
            }
        });
    }, function(err) {
        next(err, url);
    });
}

function renderResultContainer(result, handler) { // 渲染结果
    var container = $('<div>').addClass(conf.classPrefix + '-result-container').css({
        backgroundColor: '#FFF',
        borderRadius: '3px',
        color: '#666',
        marginTop: '5px',
        opacity: '0.9',
        padding: '5px 10px',
        textAlign: 'center'
    });

    var tips = $('<a>').attr({
        href: result.redirect ? (conf.baseUrl + result.redirect) : '#',
        target: '_blank'
    }).text('转换次数达到上限，点击此处进行验证');

    var clone = container.clone();

    if (result.redirect) {
        clone.append(tips.clone());
        handler.removeAttr('disabled').css('cursor', 'pointer').text('转换');
    } else if (result.error) clone.text('该视频无法转换');
    else {
        if (!result.url.length) return clone.text('该视频暂无片源');

        var convertType = $('<div>').css({
            borderBottom: '1px solid #DDD',
            marginBottom: '5px',
            paddingBottom: '5px',
            textAlign: 'left'
        }).text('转换格式：');
        ['MP4', '3GP', 'AVI', 'MOV', 'MKV'].forEach(function(type) {
            var span = $('<span>').css('margin', '0 5px');
            $('<input>').attr({
                name: result.hash,
                type: 'radio',
                value: type
            }).css('margin-right', '3px').appendTo(span);
            span.append(type);
            span.appendTo(convertType);
        });
        convertType.find('input[type="radio"]').first().attr('checked', 'checked');
        clone.append(convertType);

        $('<div>').css({
            float: 'left',
            textAlign: 'left'
        }).text('转换大小：').appendTo(clone);

        var convertSize = $('<div>').css({
            float: 'left',
            textAlign: 'left'
        });
        result.url.forEach(function(u) {
            var item = $('<p>');
            var span = $('<span>').css('margin', '0 5px');
            var radio = $('<input>').attr({
                name: result.filename,
                type: 'radio',
                value: u.url + '|' + u.size
            }).css('margin-right', '3px');
            if (u.checked) radio.attr('checked', 'checked');
            span.append(radio);
            span.append($('<span>').html(u.text));
            span.find('strong').css('font-weight', 'bold');
            item.append(span);
            convertSize.append(item);
        });
        clone.append(convertSize);

        clone.append($('<div>').css('clear', 'both'));

        var convertButton = $('<button>').addClass(conf.classPrefix + '-convert-' + result.hash).css({
            backgroundColor: '#7EC0EE',
            borderRadius: '3px',
            color: '#FFF',
            cursor: 'pointer',
            display: 'inline-block',
            float: 'none',
            marginTop: '5px',
            minWidth: '44px',
            opacity: '0.9',
            padding: '5px 10px',
            width: '72px'
        }).text('转换');
        $(document).on('mouseover', 'button.' + conf.classPrefix + '-convert-' + result.hash, function() {
            $(this).css('opacity', '1');
        });
        $(document).on('mouseout', 'button.' + conf.classPrefix + '-convert-' + result.hash, function() {
            $(this).css('opacity', '0.9');
        });
        $(document).on('click', 'button.' + conf.classPrefix + '-convert-' + result.hash, function() {
            var thiz = $(this);
            thiz.attr('disabled', 'disabled').css('cursor', 'not-allowed').text('...');

            async.waterfall([function(next) {
                convertMedia({
                    mediaurl: handler.data('url'),
                    url: $('input[type="radio"][name="' + result.filename + '"]:checked').val(),
                    filename: result.filename,
                    filetype: $('input[type="radio"][name="' + result.hash + '"]:checked').val(),
                    format: $('input[type="radio"][name="' + result.hash + '"]:checked').val(),
                    'id3-title': result.filename,
                    auto: 1,
                    'org-filename': result.filename,
                    pattern: result.filename,
                    server: result.server,
                    service: result.service,
                    verify: result.verify
                }, next);
            }, getFinishedUrl, function(url, next) {
                if (!url) thiz.replaceWith($('<p>').css('margin', '5px 0 0').text('转换失败，请根据上方链接地址手动转换。'));
                else thiz.replaceWith(tips.clone().attr('href', url).css({
                    display: 'inline-block',
                    margin: '5px 0 0'
                }).text('右键复制此链接地址即可分享'));
                next();
            }]);
        });
        clone.append(convertButton);
    }

    return clone;
}
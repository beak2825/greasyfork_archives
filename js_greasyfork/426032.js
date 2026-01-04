// ==UserScript==
// @name           随手记
// @description    账号汇总{{date}}
// @author         018(lyb018@gmail.com)
// @contributor    Rhilip
// @connect        *
// @grant          GM_xmlhttpRequest
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_notification
// @grant          GM_info
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @match          https://www.sui.com/account/account.do
// @match          https://www.sui.com/tally/new.do
// @match          https://www.sui.com/report.shtml?r=daily
// @match          https://www.sui.com/report.shtml?r=trend
// @match          https://www.sui.com/report.shtml?r=cash
// @match          https://www.sui.com/report.shtml?r=project
// @match          https://www.sui.com/report.shtml?r=store
// @match          https://www.sui.com/report.shtml?r=compare
// @match          https://www.sui.com/report/member.jhtml
// @version        0.4.0
// @icon           https://res.sui.com/favicon.ico
// @run-at         document-end
// @namespace      http://018.ai
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/426032/%E9%9A%8F%E6%89%8B%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/426032/%E9%9A%8F%E6%89%8B%E8%AE%B0.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        $('#mainContent').css('margin', '-371px auto 0px 60px')
        $('.footer').hide()
        refresh();
    })

    function refresh() {
        if (window.location.href === 'https://www.sui.com/report.shtml?r=daily') {
            handleReport(document, 'daily')
        } else if (window.location.href === 'https://www.sui.com/report.shtml?r=trend') {
            handleReport(document, 'trend')
        } else if (window.location.href === 'https://www.sui.com/report.shtml?r=cash') {
            handleReport(document, 'cash')
        } else if (window.location.href === 'https://www.sui.com/report.shtml?r=project') {
            handleReport(document, 'project')
        } else if (window.location.href === 'https://www.sui.com/report.shtml?r=store') {
            handleReport(document, 'store')
        } else if (window.location.href === 'https://www.sui.com/report.shtml?r=compare') {
            handleReport(document, 'compare')
        } else if (window.location.href === 'https://www.sui.com/report/member.jhtml') {
            handleReport(document, 'member')
        } else if (window.location.href === 'https://www.sui.com/account/account.do') {
            handle(document)
        } else {
            $('#bg1-c').html('<dir style="padding: 30px 0 0 1090px;">...</div>')
            loadDoc('https://www.sui.com/account/account.do', {}, function(doc, responseDetail, meta) {
                handle(doc)
            })
        }
    }

    function handleReport(doc, r) {
        var day = new Date()
        var year = day.getYear() + 1900
        var month = new Date().getMonth() + 1
        var preMonthDate = new Date()
        preMonthDate.setDate(0)
        var preYear = preMonthDate.getYear() + 1900
        var preMonth = preMonthDate.getMonth() + 1
        var preDay = preMonthDate.getDate()
        var html
        switch (r) {
            case 'daily':
            case 'store':
            case 'cash':
            case 'project':
                html = '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (year - 3) + '.01.01\');$(\'#fb-enddate\').val(\'' + (year - 3) + '.12.31\');tFilter.ctrl.time.set();">大前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (year - 2) + '.01.01\');$(\'#fb-enddate\').val(\'' + (year - 2) + '.12.31\');tFilter.ctrl.time.set();">前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (year - 1) + '.01.01\');$(\'#fb-enddate\').val(\'' + (year - 1) + '.12.31\');tFilter.ctrl.time.set();">去年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (year) + '.01.01\');$(\'#fb-enddate\').val(\'' + (year) + '.12.31\');tFilter.ctrl.time.set();">今年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (preYear) + '.' + (preMonth) + '.01\');$(\'#fb-enddate\').val(\'' + (preYear) + '.' + (preMonth) + '.' + preDay + '\');tFilter.ctrl.time.set();">上个月</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#fb-begindate\').val(\'' + (year) + '.' + month + '.01\');$(\'#fb-enddate\').val(\'' + (year) + '.' + month + '.31\');tFilter.ctrl.time.set();">这个月</div>'
                break;
            case 'trend':
            case 'compare':
                html = '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 3) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 3) + '.12.31\');changeDate();">大前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 2) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 2) + '.12.31\');changeDate();">前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 1) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 1) + '.12.31\');changeDate();">去年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year) + '.01.01\');$(\'#val-date-end\').val(\'' + (year) + '.12.31\');changeDate();">今年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (preYear) + '.' + (preMonth) + '.01\');$(\'#val-date-end\').val(\'' + (preYear) + '.' + (preMonth) + '.' + preDay + '\');changeDate();">上个月</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year) + '.' + month + '.01\');$(\'#val-date-end\').val(\'' + (year) + '.' + month + '.31\');changeDate();">这个月</div>'
                break;
            case 'member':
                html = '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 3) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 3) + '.12.31\');setReportTime();">大前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 2) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 2) + '.12.31\');setReportTime();">前年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year - 1) + '.01.01\');$(\'#val-date-end\').val(\'' + (year - 1) + '.12.31\');setReportTime();">去年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year) + '.01.01\');$(\'#val-date-end\').val(\'' + (year) + '.12.31\');setReportTime();">今年</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (preYear) + '.' + (preMonth) + '.01\');$(\'#val-date-end\').val(\'' + (preYear) + '.' + (preMonth) + '.' + preDay + '\');setReportTime();">上个月</div>'
                html += '<div style="margin: 5px 0;" class="fb-btn btn-gray fb-submit btn active" onclick="$(\'#val-date-begin\').val(\'' + (year) + '.' + month + '.01\');$(\'#val-date-end\').val(\'' + (year) + '.' + month + '.31\');setReportTime();">这个月</div>'
                break;
        }
        $('#bg1-c').html('<dir style="padding: 30px 0 0 1090px; display: flex; flex-direction: column;">' + html + '</div>')
    }

    function handle(doc) {
        var html = '<table id="summary-info-extra" style="line-height: 1.2;padding: 10px;background: #f8f8fa;border: 1px solid rgba(255,255,255,0.68);box-shadow: 0 6px 12px 0 rgb(7 13 28 / 4%);border-radius: 0 4px 4px 4px;">'
        var first
        $(doc).find('.summary-info .l-data li').each(function() {
            var name = $(this).find('.lt-money-name').text()
            var money = $(this).find('.lt-money-num').text()
            var cls = $(this).find('.lt-money-num').attr('class').match(/font-color-.*/g)
            html += '<tr style="font-size: 14px;"><td>' + name + '</td><td class="' + cls + '" style="font-weight: bold;">' + money + '</td></tr>'
        });
        html += '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>'

        $(doc).find('#l-list .l-list-in a').each(function() {
            var id = $(this).attr('id').replace('ll-', '')
            var details = $(doc).find('#r-list .j-acc-' + id + '.j-acc-show')
            if (details.length > 0) {
                var name = $(this).find('.ll-name').text()
                var money = $(this).find('.ll-money').text()
                var cls = $(this).find('.ll-money').attr('class').match(/font-color-.*/g)
                html += '<tr style="font-weight: bold; font-size: 14px;"><td style="width: 120px;">' + name + '</td><td class="' + cls + '" style="font-weight: bold;">' + money + '</td></tr>'

                details.each(function() {
                    var name = $(this).find('.acc-name').text()
                    var money = $(this).find('.child-r1 .child-r1-money').text().replaceAll(',', '')
                    var black = $(this).find('.black').text().replaceAll(',', '')
                    html += '<tr style="font-size: 12px;"><td class="td-acc-name" title = "' + name + '">　' + name + '</td><td><span style="font-weight: bold;">' + money + '</span>' + (black ? ' (可用额度：' + black + ')' : '') + '</td></tr>'
                });
            }
        });

        html += '</tr></table>'
        $('#bg1-c').html('<dir style="padding: 30px 0 0 1090px;">' + html + '<button id="btn-refresh" style="margin-top: 10px;">刷新</button></div>')

        $('#btn-refresh').click(function(){
            if (window.location.href === 'https://www.sui.com/account/account.do') {
                location.reload()
            } else {
                refresh()
            }
        })

        $('#summary-info-extra').on('click', '.td-acc-name', function(e) {
            var title = $(this).prop('title')
            document.getElementById('tb-outAccount-1_text').value = title
            document.getElementById('tb-outAccount-1').value = $('#ul_tb-outAccount-1').find('[title="' + title + '"]').attr('id').replace('tb-outAccount-1_v_', '')

            document.getElementById('tb-inAccount-5_text').value = title
            document.getElementById('ul_tb-inAccount-5').value = $('#ul_tb-outAccount-1').find('[title="' + title + '"]').attr('id').replace('tb-inAccount-5_v_', '')
        })
    }

    // 判断，空返回空字符串
    function opt(val) {
        if (!val) return '';

        if (val instanceof Array) {
            if (val.length > 0) {
                return val[0];
            }
        } else {
            return val;
        }
    }

    // 对使用GM_xmlhttpRequest返回的html文本进行处理并返回DOM树
    function page_parser(responseText) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
        responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    // 加载网页
    function loadDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText)
                    callback(doc, responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // get请求
    function doGet (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: {'Zotero-Allowed-Request': true},
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }

    // post请求
    function doPost (url, headers, data, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: data,
            headers: headers,
            onload: function(responseDetail){
                if (responseDetail.status === 200) {
                    callback(JSON.parse(responseDetail.responseText), responseDetail, meta)
                } else if (fail){
                    fail(responseDetail, meta);
                }
            },
            onerror: function(err) {
                if (fail) {
                    fail(err, meta);
                }
            }
        })
    }
})()
// ==UserScript==
// @name                Enhanced Ziroom
// @name:en             Enhanced Ziroom
// @namespace           https://github.com/catscarlet/enhanced_ziroom
// @description         这个插件可以在列表页就显示房源的一些额外状态，比如是否可租，是否可月租。
// @description:en      This is a userscript for www.ziroom.com
// @version             0.2.0
// @author              catscarlet
// @license             Apache License 2.0
// @match               *://*.ziroom.com/z/nl/*.html*
// @require             https://code.jquery.com/jquery-latest.js
// @compatible          chrome  支持
// @run-at              document-end
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/36468/Enhanced%20Ziroom.user.js
// @updateURL https://update.greasyfork.org/scripts/36468/Enhanced%20Ziroom.meta.js
// ==/UserScript==

window.jQueryLatest = $.noConflict(true);

(function() {
    'use strict';
    var $ = window.jQueryLatest;

    $(function() {
        console.log('enhanced_ziroom loaded');
        getHouseList();
    });

    function getHouseList() {
        var houselist = $('#houseList li');
        houselist.each(function(index) {
            var priceDetail = $(this).find('.priceDetail');
            var detailUrl = priceDetail.find('.more').find('a').attr('href');
            var detailId = url2id(detailUrl);
            if (detailId) {
                priceDetail.append('<strong id=' + detailId + '>检测中...</strong>');
                setTimeout(function() {
                    getDetail(detailUrl, detailId);
                }, 500);
            }
        });
    };

    function getDetail(detailUrl, detailId) {
        $.ajax({
            type: 'GET',
            url: detailUrl,
            dataType: 'html',
            async: true,
            success: function(msg, textStatus, jqXHR) {
                checkDetail(msg, detailId);
            },
            error: function(msg) {
                console.log(msg);
            },
        });
    }

    function checkDetail(msg, detailId) {
        var regexp_status_avaliable = new RegExp(/\<a[^\/a].*class=\"btn view\".*\>(.*)\<\/a>/);
        var regexp_status_unavaliable = new RegExp(/\s\<a[^\/a].*class=\"btn view viewGray\".*\>(.*)\<\/a>/);
        var regexp_name = new RegExp(/\<div.*class=\"room_name\".*\>(.|\n)*\<h2\>((.|\n)*)\<\/h2\>/g);
        var regexp_monthly = new RegExp(/<ul class=\"detail_room\">(?:.|[\n])*?<span class=\"icons\">月<\/span>(?:.|[\n])*?<\/ul>/g);

        var name = domtext2text(msg.match(regexp_name)[0]);
        var status;
        var status_value = false;
        var status_avaliable = msg.match(regexp_status_avaliable);
        var status_unavaliable = msg.match(regexp_status_unavaliable);
        var monthly_avaliable = msg.match(regexp_monthly);

        var extra_data = {
            monthly_avaliable: false,
        };

        if (status_avaliable) {
            status = domtext2text(status_avaliable[0]);
            status_value = true;
        } else {
            status = domtext2text(status_unavaliable[0]);
            status_value = false;
        }

        if (monthly_avaliable) {
            extra_data.monthly_avaliable = true;
        }

        drawList(status_value, status, detailId, extra_data);
    }

    function drawList(status_value, status, detailId, extra_data) {
        var css;
        var thedom = $('#' + detailId);
        if (status_value) {
            thedom.text(status);
            //thedom.parent().parent().css('background-color', 'lightgreen');
        } else {
            thedom.text(status);
            thedom.parent().parent().css('background-color', 'grey');
        }

        if (extra_data.monthly_avaliable) {
            let monthly_style = 'width: 20px; height: 20px; background: #ffa000; border-radius: 5px; color: #fff; text-align: center; line-height: 20px; font-size: 14px; display: inline-block; margin-left: 10px;';
            let monthly_str = '<span style="' + monthly_style + '">月</span>';
            thedom.append(monthly_str);
        }
    }

    function domtext2text(domtext) {
        var rst;
        rst = $.trim($.text($.parseHTML(domtext)));

        return rst;
    }

    function url2id(url) {
        var regexp_url2id = new RegExp(/\/(\d+)\.html/);
        var rst = url.match(regexp_url2id);
        if (rst) {
            return rst[1];
        }

        return false;
    }
})();
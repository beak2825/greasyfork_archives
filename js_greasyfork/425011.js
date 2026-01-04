// ==UserScript==
// @history      v1.4 skywoodlin@2021.08.11 进入网页后自动高亮free的种子
//               v1.5 skywoodlin@2021.08.11 支持LemonHD高亮free
// @namespace    https://greasyfork.org/zh-CN/users/167084-lin-skywood
// @name         @@PT-site-helper@modify by skywoodlin
// @name:zh      @@PT-site-helper@skywoodlin修改版
// @description  PT-site-helper PT 助手，高亮 Free 帖子，skywoodlin修改版
// @author       skywoodlin
// @contributor  skywoodlin
// @version      1.6
// @license      LGPLv3
// @match        *://hdhome.org/torrents*
// @match        https://*.m-team.cc/*
// @match        https://*.m-team.io/*
// @match        https://*.pttime.org/*
// @match        *://*.beitai.pt/torrents.php*
// @match        *://pter.club/*
// @match        https://ourbits.club/*
// @match        https://nanyangpt.com/*
// @match        *://pt.btschool.club/*
// @match        *://leaguehd.com/*
// @match        *://pterclub.com/torrents.php*
// @match        https://pt.gztown.net/torrents.php*
// @match        https://www.nicept.net/torrents.php*
// @match        https://www.pthome.net/torrents.php*
// @match        http://www.hdscg.cc/torrents.php*
// @match        https://www.hdarea.co/torrents.php*
// @match        https://et8.org/torrents.php*
// @match        https://lemonhd.org/torrents_new.php*
// @match        https://lemonhd.org/torrents.php*
// @match        https://totheglory.im/browse.php*
// @match        https://ptsbao.club/torrents.php*
// @match        https://www.haidan.video/torrents.php*
// @match        https://www.pttime.org/torrents.php*
// @match        https://pt.soulvoice.club/torrents.php*
// @match        https://www.hddolby.com/torrents.php*
// @match        https://www.1468.top/torrents.php*
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @require      https://greasyfork.org/scripts/373955-secretlyrequest/code/secretlyRequest.js?version=642317
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425011/%40%40PT-site-helper%40modify%20by%20skywoodlin.user.js
// @updateURL https://update.greasyfork.org/scripts/425011/%40%40PT-site-helper%40modify%20by%20skywoodlin.meta.js
// ==/UserScript==
$.noConflict();
(function ($) {
    'use strict';

    // Your code here...
    var url = window.location.origin;
    var fullurl = window.location.href;

    if (!(url.indexOf("ptsbao.club") > -1)) {
        $('body, table, .torrents td').css({
            "background-color": "#efefef",
            "color": "#000"
        });
        $('table a').css('color', 'blue');
        var allFitStyle = `<style>
                .ddiframeshim { height:0!important; }
                .torrents>tbody>tr:hover td { background: #ddd !important; }
                </style>`;
        $('head').append(allFitStyle);
    }

    if (window.location.href.includes('m-team.cc/details')) {
        $('head').append(`<style>
        .mainouter img {width: auto !important; height: auto !important;}
      </style>`);
    }

    setTimeout(function () {
        var $qiandao1 = $('#nav_block a.faqlink');
        var $qiandao2 = $('#outer a[href="index.php?action=addbonus"]');
        var $qiandao3 = $('#sign_in a');
        if ($qiandao1.length) {
            window.H.secretlyRequest($qiandao1.attr('href')).then((err) => {
                if (!err) $qiandao1.remove();
            });
        }
        if ($qiandao2.length) {
            window.H.secretlyRequest($qiandao2.attr('href')).then((err) => {
                if (!err) $qiandao1.remove();
            });
        }
        if ($qiandao3.length) {
            $qiandao3.click();
        }
    }, 2000);

    /*added by skywoodlin 2021.08.11, 进入网页后自动显示free种子*/
    setTimeout(function () {
        let $freeBtn = $('#fn1');
        if($freeBtn.length > 0) {
            $freeBtn.click();
        }
    }, 500);


    function insertButton(btnName) {
        var btn = `<button id="fn1"
        style="position: fixed; left: 10px; top: 10px; z-index: 9999; background: #fff; border: 1px solid #aaa; padding: 4px 10px;"
        >${btnName}</button>`;

        $('body').append(btn);
        $('#fn1').on('click', function () {
            start();
        });
    }

    /**
     * 添加style属性字符串到dom的jquery对象的style属性上
     */
    function addStyleStrToEle($ele, newStyleStr) {
        let newAttr = newStyleStr;
        let oriAttr = $ele.attr('style');
        if (oriAttr) {
            newAttr = oriAttr + ";" + newAttr;
        }
        $ele.attr('style', newAttr);
    }

    function start() {
        var $free = null;
        var $free2 = null;
        var $free4 = null;
        var $free6 = null;
//        var background = 'background: rgb(255, 222, 144, 1) !important';
        var background = 'background: #b481bb !important';
        if (url.indexOf('totheglory.im') > -1) {
            $free = $('img[alt="free"]');
        } else if (url.indexOf('lemonhd.org') > -1) {
            $free = $('div:contains(\'免费剩余\')');
        } else if (url.indexOf('pttime.org') > -1) {
            $free = $('font.promotion.free');
            let $fontColor = $('b.promotion.free');
            let fontColor = 'color: blue !important'
            $.each($fontColor, (index, item) => {
                let $item = $(item);
                addStyleStrToEle($item, fontColor)
                // let newAttr = fontColor;
                // let oriAttr = $item.attr('style');
                // if(oriAttr) {
                //     newAttr = oriAttr + ";" + newAttr;
                // }
                // $item.attr('style', newAttr);
            });
        } else if (url.indexOf('.m-team') > -1) {
            setTimeout(function() {
                // 选择页面上所有包含文本“Free”的元素
                let elements = $(":contains('Free')");

                // 筛选出确切匹配“Free”文本内容的元素
                let exactMatchElements = elements.filter(function() {
                    return $(this).text().trim() === "Free";
                });

                // 对筛选出来的元素进行操作，这里是打印出它们的标签名
                exactMatchElements.each(function() {
                    addStyleStrToEle($(this).parent().parent(),background);
                });
            },5000);
        } else {
            $free = $('.pro_free');
            $free2 = $('.pro_free2up');
            $free4 = $('.pro_free4up');
            $free6 = $('.pro_free6up');
        }
        if ($free !== null) {
            $.each($free, (index, item) => {
                if (fullurl.indexOf('pter') > -1) {
                    addStyleStrToEle($(item).parent().parent(), background);
                    // $(item).parent().parent().attr('style', background);
                } else {
                    addStyleStrToEle($(item).parent(), background);
                    // $(item).parent().attr('style', background);
                }
            });
        }
        if ($free2 !== null) {
            $.each($free2, (index, item) => {
                addStyleStrToEle($(item).parent(), background);
                // $(item).parent().attr('style', background);
            });
        }
        if ($free4 !== null) {
            $.each($free4, (index, item) => {
                addStyleStrToEle($(item).parent(), background);
                // $(item).parent().attr('style', background);
            });
        }
        if ($free6 !== null) {
            $.each($free6, (index, item) => {
                addStyleStrToEle($(item).parent(), background);
                // $(item).parent().attr('style', background);
            });
        }
    }

    insertButton('高亮Free');

    if (url.indexOf('gztown.net') > -1) {
        var style = `<style>
        img { display:none; }
        body,table { background-color: #fff !important; }
        .sticky_normal { background: #fff !important; }
        </style>`;
        $('head').append(style);
    }

    // show https ipv4 link
    if (fullurl.indexOf('.m-team.cc/details.php') > -1) {
        var $link = $("a:contains('[IPv4+https]')");
        var ahref = $link.attr('href');
        var urlTxt = url + ahref;
        var $td = $link.parent().parent();
        $td.prepend([
            '<input id="downloadurl" value="' + urlTxt + '" style="width:700px">',
            '<span id="downloadurlinfo" style="color: #f60;"></span>',
            '<br><br>'
        ].join(''));
        $('body').on('click', '#downloadurl', function () {
            document.querySelector('#downloadurl').select();
            $('#downloadurlinfo').html('');
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                $('#downloadurlinfo').html('复制成功');
            }
        })
    }
    // shot
    if (fullurl.indexOf('.m-team.cc/torrents.php') > -1 || fullurl.indexOf('.m-team.cc/adult.php') > -1 || fullurl.indexOf('.m-team.cc/movie.php') > -1) {
        var insertSelector = function () {
            var sl = `<span style="position: fixed; left: 10px; top: 40px; z-index: 9999; background: #fff; border: 1px solid #aaa; padding: 4px 10px;"><select class="thumb-sl">
                <option value ="1">原始缩略图</option>
                <option value ="2">中号缩略图</option>
                <option value ="3">大号缩略图</option>
            </select></span>`
            $('body').append(sl);
        };
        var setSize = function (size) {
            var _s = size || '1';
            var heights = {
                '1': '43px',
                '2': '120px',
                '3': '280px'
            };
            $('td.torrentimg img').css({
                maxWidth: _s == 1 ? '75px' : 'none',
                height: heights[_s],
            });
        };
        var lis = function () {
            var $sl = $('.thumb-sl');
            $sl.on('change', function () {
                console.log(this.value);
                setSize(this.value);
            });
        };
        insertSelector();
        lis();
    }

    if (fullurl.indexOf('ourbits.club/details.php') > -1) {
        var $link = $("a:contains('[下载地址]')");
        var ahref = $link.attr('href');
        var urlTxt = window.location.origin + ahref;
        var $td = $link.parent();
        $td.prepend([
            '<input id="downloadurl" value="' + urlTxt + '" style="width:700px">',
            '<span id="downloadurlinfo" style="color: #f60;"></span>',
            '<br><br>'
        ].join(''));
        $('body').on('click', '#downloadurl', function () {
            document.querySelector('#downloadurl').select();
            $('#downloadurlinfo').html('');
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                $('#downloadurlinfo').html('复制成功');
            }
        })
    }

    if (fullurl.indexOf('hdhome.org/details.php') > -1) {
        var $link = $("a:contains('请右键复制链接')");
        var ahref = $link.attr('href');
        var urlTxt = ahref;
        var $td = $link.parent();
        $td.prepend([
            '<input id="downloadurl" value="' + urlTxt + '" style="width:700px">',
            '<span id="downloadurlinfo" style="color: #f60;"></span>',
            '<br><br>'
        ].join(''));
        $('body').on('click', '#downloadurl', function () {
            document.querySelector('#downloadurl').select();
            $('#downloadurlinfo').html('');
            if (document.execCommand('copy')) {
                document.execCommand('copy');
                $('#downloadurlinfo').html('复制成功');
            }
        })
    }
})(jQuery);

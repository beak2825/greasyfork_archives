// ==UserScript==
// @name         美女图聚合展示by SeLang zz
// @namespace    http://cmsv1.findmd5.com/
// @version      2.14
// @description  目标是聚合网页美女图片，省去翻页烦恼。有需要聚合的网址请反馈。 QQ群号：455809302,点击链接加入群【油猴脚本私人定制】：https://jq.qq.com/?_wv=1027&k=45p9bea
// @author       selang
// @include       /https?\:\/\/www\.lesmao\.cc/
// @include       /https?\:\/\/www\.umei\.cc/
// @include       /https?\:\/\/www\.meitulu\.com/
// @include       /https?\:\/\/www\.17786\.com/
// @include       /https?\:\/\/www\.nvshens\.com/
// @include       /https?\:\/\/m\.nvshens\.com/
// @include       /https?\:\/\/www\.youtube\.com/
// @include       /https?\:\/\/www\.24meinv\.me/
// @include       /https?\:\/\/www\.aitaotu\.com/
// @include       /https?\:\/\/www\.mzitu\.com/
// @include       /https?\:\/\/www\.beautylegmm\.com/
// @include       /https?\:\/\/www\.rosiyy\.com/
// @include       /https?\:\/\/www\.meinv58\.com/
// @require       https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.3/FileSaver.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dom-to-image/2.5.2/dom-to-image.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/dexie/1.5.1/dexie.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/webtorrent/0.98.19/webtorrent.min.js
// @connect      *
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_saveTab
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/39180/%E7%BE%8E%E5%A5%B3%E5%9B%BE%E8%81%9A%E5%90%88%E5%B1%95%E7%A4%BAby%20SeLang%20zz.user.js
// @updateURL https://update.greasyfork.org/scripts/39180/%E7%BE%8E%E5%A5%B3%E5%9B%BE%E8%81%9A%E5%90%88%E5%B1%95%E7%A4%BAby%20SeLang%20zz.meta.js
// ==/UserScript==

var blobCache = {};
var blobUrlCache = {};

var Alpha_Script = {
    obtainHtml: function (options) {
        options = options || {};
        if (!options.url || !options.method) {
            throw new Error("参数不合法");
        }
        GM_xmlhttpRequest(options);
    },
    parseHeaders: function (headStr) {
        var o = {};
        var myregexp = /^([^:]+):(.*)$/img;
        var match = /^([^:]+):(.*)$/img.exec(headStr);
        while (match != null) {
            o[match[1].trim()] = match[2].trim();
            match = myregexp.exec(headStr);
        }
        return o;
    },
    //获取参数
    getParam: function (dest, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = dest.match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    },
    isArray: function (value) {
        return Object.prototype.toString.apply(value) === '[object Array]';
    }
};

(function () {
    'use strict';

    priorityLog('看到这里，你肯定是个老司机了。欢迎老司机进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy。');
    priorityLog('已实现：蕾丝猫(http://www.lesmao.cc)，优美(http://www.umei.cc)，美图录(http://www.meitulu.com)，美女86(http://www.17786.com)，宅男女神(http://www.nvshens.com)，24美女图片(http://www.24meinv.me)，爱套图(http://www.aitaotu.com)，妹子图(http://www.mzitu.com)');
    priorityLog('Beautyleg腿模写真(http://www.beautylegmm.com)，美女58(http://www.meinv58.com)');
    priorityLog('未实现：');

    var currentPageUrl = window.location.href;
    var currentHostname = window.location.hostname;
    var currentPathname = window.location.pathname;
    var currentProtocol = window.location.protocol;
    hotkeys();
    var pagesCommonObj = function () {
        return {
            'meet': function (options) {
                options = options || {};
                options.domain = options.domain || '';
                options.success = options.success || function () {

                };
                options.fail = options.fail || function () {

                };
                var matchDomain = false;
                log(options.domain);
                if (Alpha_Script.isArray(options.domain)) {
                    for (var i = 0; i < options.domain.length; i++) {
                        if (options.domain[i] === currentHostname) {
                            matchDomain = true;
                            break;
                        }
                    }
                } else {
                    matchDomain = options.domain === currentHostname || options.domain === '';
                }
                log('matchDomain:' + matchDomain);
                if (matchDomain) {
                    options.success();
                } else {
                    options.fail();
                }
                return this;
            }
        };
    };
    var commonObj = pagesCommonObj();
    commonObj.meet(
        {
            domain: 'www.lesmao.cc',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 30,
            success: function () {
                var match = currentPathname.match(/^\/(thread-\d+-)(\d+)(-\d+\.html)$/im);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var suffixUrl = match[3];
                    var limitPageStr = $('#thread-page > div > div > label > span').text();
                    var limitPageMatch = limitPageStr.match(/(\d+)/i);
                    if (limitPageMatch != null) {
                        this.limitPage = parseInt(limitPageMatch[1]);
                    }
                    currentWindowImpl(this.startUrl + partPreUrl, 1, this.limitPage, suffixUrl, currentHostname);
                } else {
                    // Match attempt failed
                    var dest = window.location.search.substr(1);
                    var mod = Alpha_Script.getParam(dest, 'mod');
                    if ('viewthread' === mod) {
                        var tid = Alpha_Script.getParam(dest, 'tid');
                        var partPreUrl = '/forum.php?mod=viewthread&tid=' + tid + '&page=';
                        var suffixUrl = '';
                        var limitPageStr = $('#page > div > label > span').text();
                        var limitPageMatch = limitPageStr.match(/(\d+)/i);
                        if (limitPageMatch != null) {
                            this.limitPage = parseInt(limitPageMatch[1]);
                        }
                        currentWindowImpl(this.startUrl + partPreUrl, 1, this.limitPage, suffixUrl, currentHostname);
                    }
                }
            }
        });
    commonObj.meet(
        {
            domain: 'www.umei.cc',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 0,
            success: function () {
                var match = currentPathname.match(/^\/(\w+\/\w+(?:\/\w+)?\/)(\d+)(?:_\d+)?\.htm$/im);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var pageId = match[2];
                    var suffixUrl = '.htm';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('.NewPages li a').html();
                    log(pageStr);
                    var pageTotalRegexp = /共(\d+)页/m;
                    var pageTotalMatch = pageTotalRegexp.exec(pageStr);
                    if (pageTotalMatch != null) {
                        this.limitPage = pageTotalMatch[1];
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 1, this.limitPage, suffixUrl, currentHostname);
                    }
                }
            }
        });
    commonObj.meet(
        {
            domain: '',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 0,
            success: function () {

            }
        });

    commonObj.meet(
        {
            domain: 'www.meitulu.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 0,
            success: function () {
                var match = currentPathname.match(/^\/(item\/)(\d+)(?:_\d+)?\.html$/im);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var pageId = match[2];
                    var suffixUrl = '.html';
                    var pageStr = $('a.a1:last').prev().html();
                    log(pageStr);
                    this.limitPage = parseInt(pageStr);
                    currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 1, this.limitPage, suffixUrl, currentHostname);
                }
            }
        });
    commonObj.meet(
        {
            domain: 'www.17786.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            success: function () {
                var match = currentPathname.match(/^\/(\d+)(?:_\d+)?\.html$/im); //http://www.17786.com/7745_1.html
                if (match != null) {
                    var partPreUrl = '';
                    var pageId = match[1];
                    var suffixUrl = '.html';
                    var pageStr = $('h2').html();
                    var limitPage = 0;
                    var pageStrRegexp = /\(\d+\/(\d+)\)/im;
                    var match = pageStrRegexp.exec(pageStr);
                    if (match != null) {
                        limitPage = parseInt(match[1]);
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 1, limitPage, suffixUrl, currentHostname);
                    }
                } else {
                    var match = currentPathname.match(/^\/((?:\w+\/)+)(\d+)(?:_\d+)?\.html$/im);//http://www.17786.com/beautiful/feizhuliutupian/44569.html
                    if (match != null) {
                        var partPreUrl = match[1];
                        var pageId = match[2];
                        var suffixUrl = '.html';
                        var pageStr = $('h2').html();
                        log(pageStr);
                        var limitPage = 40;
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 1, limitPage, suffixUrl, currentHostname);
                    }
                }
            }
        });
    commonObj.meet(
        {
            domain: ['www.nvshens.com', 'm.nvshens.com'],
            startUrl: currentProtocol + '//' + currentHostname + '/',
            success: function () {
                var match = currentPathname.match(/^\/(g\/\d+)\/?(?:\d+\.html)?$/im);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var pageId = '/';
                    var suffixUrl = '.html';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('div#dinfo span[style="color: #DB0909"]').html();
                    if (!pageStr) {
                        pageStr = $('div#ddinfo span[style="color: #DB0909"]').html();
                    }
                    var pageNumMatch = pageStr.match(/(\d+)张照片/im);
                    if (pageNumMatch != null) {
                        pageStr = pageNumMatch[1];
                    }
                    var limitPage = parseInt(pageStr);
                    var number = limitPage % 5;
                    limitPage = Math.floor(limitPage / 5);
                    if (number > 0) {
                        limitPage = limitPage + 1;
                    }
                    log(limitPage);
                    currentWindowImpl(this.startUrl + partPreUrl + pageId, 1, limitPage, suffixUrl, currentHostname);
                }
            }
        });

    commonObj.meet(
        {
            domain: 'www.24meinv.me',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 0,
            removeAd: function () {
                var id = setInterval(function () {
                    $('#hgg2').remove();
                    $('#j__s').remove();
                    $('#__jx_div').remove();
                    $('iframe').remove();
                    $('body > div.foot > div > div:nth-child(13)').remove();
                }, 100);
            },
            success: function () {
                this.removeAd();
                var match = currentPathname.match(/^\/(\w+\/\w+?)(?:_\d+)?\.html$/im);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var pageId = '';
                    var suffixUrl = '.html';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('div.page.ps > a:last-child').attr('href');
                    if (pageStr) {
                        var myregexp = /^\/(\w+\/\w+?)(?:_(\d+))?\.html$/im;
                        var match = myregexp.exec(pageStr);
                        if (match == null) {
                            match = myregexp.exec(currentPathname);
                        }
                        if (match != null) {
                            this.limitPage = parseInt(match[2]);
                            this.limitPage++;//首页从0开始
                            currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 0, this.limitPage, suffixUrl, currentHostname);
                        } else {

                        }
                    } else {

                    }
                }
            }
        });

    commonObj.meet(
        {
            domain: 'www.aitaotu.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 1,
            removeAd: function () {
                var id = setInterval(function () {
                    $('#lgVshow').remove();
                    $('div.gg1002').remove();
                }, 100);
            },
            success: function () {
                this.removeAd();
                var match = currentPathname.match(/\/(.+?\/)(\d+)(?:_\d+)?\.html/m);
                if (match !== null) {
                    var partPreUrl = match[1];
                    var pageId = match[2];
                    var suffixUrl = '.html';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('div.photo > div.pages > ul > li:last-child > a').attr('href');
                    log('pageStr:' + pageStr);
                    if (pageStr) {
                        var myregexp = /\/\w+\/(\d+)(?:_(\d+))?\.html/m;
                        var match = myregexp.exec(pageStr);
                        if (match != null) {
                            this.limitPage = parseInt(match[2]);
                            log('limitPage:' + this.limitPage);
                            currentWindowImpl(this.startUrl + partPreUrl + pageId + '_', 1, this.limitPage, suffixUrl, currentHostname);
                        } else {

                        }
                    } else {

                    }
                }
            }
        });

    commonObj.meet(
        {
            domain: 'www.mzitu.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 1,
            success: function () {
                var match = currentPathname.match(/\/(\d+)(?:\/\d+)?/m);
                if (match !== null) {
                    var partPreUrl = '';
                    var pageId = match[1];
                    var suffixUrl = '';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('div.pagenavi >a').last().prev().find('span').text().trim();
                    log('pageStr:' + pageStr);
                    if (pageStr) {
                        this.limitPage = parseInt(pageStr);
                        log('limitPage:' + this.limitPage);
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '/', 1, this.limitPage, suffixUrl, currentHostname);
                    } else {

                    }
                }
            }
        });

    commonObj.meet(
        {
            domain: 'www.beautylegmm.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 1,
            success: function () {
                var match = currentPathname.match(/^\/(\w+\/beautyleg-\d+\.html)/im);
                if (match !== null) {
                    var partPreUrl = '';
                    var pageId = match[1];
                    var suffixUrl = '';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('#contents_post > div.post > div > a:not(.next)').last().text().trim();
                    log('pageStr:' + pageStr);
                    if (pageStr) {
                        this.limitPage = parseInt(pageStr);
                        log('limitPage:' + this.limitPage);
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '?page=', 1, this.limitPage, suffixUrl, currentHostname);
                    } else {

                    }
                }
            }
        });

    commonObj.meet(
        {
            domain: 'www.meinv58.com',
            startUrl: currentProtocol + '//' + currentHostname + '/',
            limitPage: 1,
            success: function () {
                var match = currentPathname.match(/^\/(\w+\/\d+)/im);
                if (match !== null) {
                    var partPreUrl = '';
                    var pageId = match[1];
                    var suffixUrl = '';
                    log(this.startUrl + partPreUrl + pageId + suffixUrl);
                    var pageStr = $('div.link_pages > a:last-child').last().prev().text().trim();
                    log('pageStr:' + pageStr);
                    if (pageStr) {
                        this.limitPage = parseInt(pageStr);
                        log('limitPage:' + this.limitPage);
                        currentWindowImpl(this.startUrl + partPreUrl + pageId + '/', 1, this.limitPage, suffixUrl, currentHostname);
                    } else {

                    }
                }
            }
        });

    if ('www.youtube.com' === currentHostname) {
        var vId = "";
        var id = setInterval(function () {
            $('#player-unavailable').not('.hid').addClass('hid');
            var curVId = Alpha_Script.getParam(dest, 'v');
            if (curVId != null && vId != curVId) {
                log('切换VID');
                vId = curVId;
                var sid = setInterval(function () {
                    var swichVIdState = switchVId(vId);
                    if (swichVIdState) {
                        clearInterval(sid);
                    }
                }, 100);
            }
        }, 100);
    }
})();

function switchVId(vId) {
    $('#player-unavailable').not('.hid').addClass('hid');
    var text = $('#unavailable-message').text();
    if (text && text.indexOf('内容警告') != -1) {
        log('内容警告::');
        $('#player-api').removeClass('off-screen-target').html('<iframe src="https://www.youtube.com/embed/' +
        vId +
            '" width="100%" height="100%" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>');
        return true;
    }
    return false;
}

//热键
function hotkeys() {
    GM_registerMenuCommand("图片打包下载", packageAndDownload, "d");
    $(document).keydown(function (e) {
        if (e.ctrlKey && e.shiftKey) {
            if (e.which == 76) {//L
                log("触发快捷键");
            }
        }
    });
}

function packageAndDownload() {
    var zip = new JSZip();
    var imgList = $('img[label="sl"]');
    var length = imgList.length;
    $.each(imgList, function (index, value) {
        zip.file("readme.txt", "感谢使用selang提供的插件。欢迎进群：455809302交流。一起玩。\r\n如果不是老司机，只要有创意也欢迎加入。点击链接加入群【油猴脚本私人级别定制】：https://jq.qq.com/?_wv=1027&k=460soLy\n");
        var img = zip.folder("images");
        var imgSrc = $(value).attr('src');
        {
            if (blobCache[imgSrc]) {
                img.file(index + ".jpg", blobCache[imgSrc], {base64: false});
                length--;
            } else {
                if (!imgSrc.startsWith('blob:')) {
                    Alpha_Script.obtainHtml({
                        url: imgSrc,
                        method: 'GET',
                        headers: {
                            "Accept": "application/*",
                            "Referer":window.location.origin
                        },
                        responseType: 'blob',
                        onload: function (response) {
                            var responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
                            var contentType = responseHeaders['Content-Type'];
                            if (!contentType) {
                                contentType = "image/png";
                            }
                            var blob = new Blob([response.response], {type: contentType});
                            blobCache[imgSrc] = blob;
                            img.file(index + ".jpg", blobCache[imgSrc], {base64: false});
                            length--;
                        }
                    });
                } else {
                    img.file(index + ".jpg", blobCache[blobUrlCache[imgSrc]], {base64: false});
                    length--;
                }
            }
        }
    });
    var id = setInterval(function () {
        if (length == 0) {
            clearInterval(id);
            zip.generateAsync({type: "blob"})
                .then(function (content) {
                    saveAs(content, "PackageSL.zip");
                });
        }
    }, 100);
}

function currentWindowImpl(preUrl, startIndex, limitPage, subfixUrl, currentHostname) {
    injectAggregationRef(currentHostname);
    switchAggregationBtn(preUrl, startIndex, limitPage, subfixUrl, currentHostname);
    dependenceJQuery(window, bindBtn(function (e) {
        switchAggregationBtn(preUrl, startIndex, limitPage, subfixUrl, currentHostname);
    }));
}

//按钮切换
function switchAggregationBtn(preUrl, startIndex, limitPage, suffixUrl, currentHostname) {
    if ($('#injectaggregatBtn').val() === '聚合显示') {
        $('#injectaggregatBtn').val('聚合隐藏');
        collectPics(startIndex, preUrl, limitPage, suffixUrl, currentHostname);
        $('#c_container').show();

        var hideObj = {
            'www.lesmao.cc': function () {
                $('#thread-pic').hide();
                $('#thread-page').hide();
            },
            'www.umei.cc': function () {
                $('.ImageBody').hide();
            },
            'www.meitulu.com': function () {
                $('div.content').hide();
                $('body > center').hide();
            },
            'www.17786.com': function () {
                $('div.img_box').hide();
                $('div.wt-pagelist').hide();
                $('div#picBody').hide();
                $('.articleV2Page').hide();
            },
            'www.nvshens.com': function () {
                $('div.ck-box-unit').hide();
                $('div.photos').hide();
                $('div#imgwrap').hide();
            },
            'm.nvshens.com': function () {
                return this['www.nvshens.com'];
            },
            'www.24meinv.me': function () {
                $('div.gtps.fl').hide();
            },
            'www.aitaotu.com': function () {
                $('div.big-pic').hide();
                $('div.pages').hide();
            },
            'www.mzitu.com': function () {
                $('div.main-image').hide();
                $('div.pagenavi').hide();
            },
            'www.beautylegmm.com': function () {
                $('div.post').hide();
                $('div.archives_page_bar').hide();
            },
            'www.meinv58.com': function () {
                $('div.main-body').hide();
                $('div.link_pages').hide();
            }
        };
        hideObj[currentHostname]();
    } else {
        $('#injectaggregatBtn').val('聚合显示');
        $('#c_container').hide();

        var showObj = {
            'www.lesmao.cc': function () {
                $('#thread-pic').show();
                $('#thread-page').show();
            },
            'www.umei.cc': function () {
                $('.ImageBody').show();
            },
            'www.meitulu.com': function () {
                $('div.content').show();
                $('body > center').show();
            },
            'www.17786.com': function () {
                $('div.img_box').show();
                $('div.wt-pagelist').show();

                $('div#picBody').show();
                $('.articleV2Page').show();
            },
            'www.nvshens.com': function () {
                $('div.ck-box-unit').show();
                $('div.photos').show();
                $('div#imgwrap').show();
            },
            'm.nvshens.com': function () {
                return this['www.nvshens.com'];
            },
            'www.24meinv.me': function () {
                $('div.gtps.fl').show();
            },
            'www.aitaotu.com': function () {
                $('div.big-pic').show();
                $('div.pages').show();
            },
            'www.mzitu.com': function () {
                $('div.main-image').show();
                $('div.pagenavi').show();
            },
            'www.beautylegmm.com': function () {
                $('div.post').show();
                $('div.archives_page_bar').show();
            },
            'www.meinv58.com': function () {
                $('div.main-body').show();
                $('div.link_pages').show();
            }
        };
        showObj[currentHostname]();
    }
}

//日志
function log(c) {
    if (false) {
        console.log(c);
    }
}

function err(c) {
    if (false) {
        console.error(c);
    }
}

function priorityLog(c) {
    console.log(c);
}

//注入JS：jquery
function injectJs(e) {
    if (e.jQuery) {
        log('jquery available');
    } else {
        var ele = e.document.createElement('script');
        ele.src = "https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js";
        e.document.body.appendChild(ele);
        var id = e.setInterval(function () {
            if (e.jQuery) {
                e.clearInterval(id);
            }
        }, 100);
    }
}

//等待JQuery加载完毕
function dependenceJQuery(e, callback) {
    var id = e.setInterval(function () {
        if (e.jQuery) {
            e.clearInterval(id);
            callback;
        }
    }, 100);
}

//收集图片，回调
function collectPics(startIndex, preUrl, limitPage, suffixUrl, currentHostname) {
    var id = setInterval(function () {
        if ($) {
            clearInterval(id);
            var breakPageLoop = false;
            log('limitPage::' + limitPage);
            for (var i = startIndex; i <= limitPage; i++) {
                //创建div去装各自
                $('#c_container').append('<div id="c_' + i + '"></div>');
                if (!breakPageLoop) {
                    var lock = true;
                    log(preUrl + i + suffixUrl);
                    Alpha_Script.obtainHtml({
                        url: preUrl + i + suffixUrl,
                        headers: Alpha_Script.parseHeaders("Accept:image/webp,image/*,*/*;q=0.8\n" +
                            "Accept-Encoding:gzip, deflate, sdch\n" +
                            "Accept-Language:zh-CN,zh;q=0.8\n" +
                            "Referer:" + window.location.href + "\n" +
                            "User-Agent:Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36"
                        ),
                        method: 'GET',
                        onload: function () {
                            var _i = i;
                            var parseObj = {
                                'www.lesmao.cc': function (doc) {
                                    return $(doc).find('ul > li > img');
                                },
                                'www.umei.cc': function (doc) {
                                    {//移除图片附属广告
                                        $('div div div.ad-widget-imageplus-sticker').parent().parent().remove();
                                    }
                                    return $(doc).find('.ImageBody p img');
                                },
                                'www.meitulu.com': function (doc) {
                                    {//http://www.meitulu.com广告遮挡层
                                        $("a[id^='__tg_ciw_a__']").remove();
                                        $("a[id^='__qdd_ciw_a__']").remove();
                                        $('iframe').remove();//移除广告等无必要元素
                                    }
                                    return $(doc).find('div.content > center  > img');
                                },
                                'www.17786.com': function (doc) {
                                    var imgObj = $(doc).find('img.IMG_show');
                                    if (imgObj.length == 0) {
                                        imgObj = $(doc).find('a#RightUrl img');
                                    }
                                    return imgObj;
                                },
                                'www.nvshens.com': function (doc) {
                                    return $(doc).find('ul#hgallery img');
                                },
                                'm.nvshens.com': function (doc) {
                                    return $(doc).find('div#imgwrap img');
                                },
                                'www.24meinv.me': function (doc) {
                                    var imgObj = $(doc).find('div.gtps.fl img');
                                    $(imgObj).each(function (index) {
                                        // log(index + ": " + $(this).prop('outerHTML'));
                                        var imgSrc = $(this).attr('src').replace(/http:\/\/\w+\.diercun\.com(.*?\/)m([\w.]+)/img, "http://img.diercun.com$1$2");
                                        $(this).attr('src', imgSrc);
                                    });
                                    return imgObj;
                                },
                                '': function (doc) {

                                    return;
                                },
                                'www.aitaotu.com': function (doc) {
                                    return $(doc).find('#big-pic > p > a  > img');
                                },
                                'www.mzitu.com': function (doc) {
                                    return $(doc).find('div.main-image > p > a > img');
                                },
                                'www.beautylegmm.com': function (doc) {
                                    return $(doc).find('#contents_post > div.post > a  > img');
                                },
                                'www.meinv58.com': function (doc) {
                                    return $(doc).find('div.main-body p img');
                                },
                            };
                            return function (response) {
                                var html = response.responseText;
                                // log(html);
                                var parser = new DOMParser();
                                var doc = parser.parseFromString(html, "text/html");
                                // log(preUrl + _i + suffixUrl);
                                var imgObj;

                                imgObj = parseObj[currentHostname](doc);

                                var imgContainerCssSelector = '#c_' + _i;
                                log(imgContainerCssSelector);
                                var status = query($(imgContainerCssSelector), $(imgObj));
                                if ('end page' === status) {
                                    breakPageLoop = true;
                                }
                                lock = false;
                            };
                        }()
                    });
                } else {
                    break;
                }
            }
        }
    }, 100);
}

//查询图片
function query(objContainer, jqObj) {
    jqObj.each(function (index) {
        // log(index + ": " + $(this).prop('outerHTML'));
        var imgSrc = $(this).attr('src');
        if (imgSrc.endsWith('/k/1178/')) {
            return 'end page';
        } else {
            $(this)[0].style = "width: 100%;height: 100%";
            $(this).attr('label', 'sl');
            objContainer.append('<div>' + $(this).prop('outerHTML') + '</div>');
        }
    });
}

function injectAggregationRef(currentHostname) {
    var injectComponent =
        '<input id="captureBtn" type="button" value="截图并下载"/>' +
        '<span>&nbsp;&nbsp;</span>' +
        '<input id="packageBtn" type="button" value="打包下载聚合图片"/>' +
        '<span>&nbsp;&nbsp;</span>' +
        '<input id="injectaggregatBtn" type="button" value="聚合显示"/>';
    var injectAggregateObj = {
        'www.lesmao.cc': function () {
            $('.thread-tr').after(injectComponent);
            $('#vt').append(injectComponent);
        },
        'www.umei.cc': function () {
            if ($('.hr10')) {//http://www.umei.cc/weimeitupian/oumeitupian/20043_2.htm
                $($('.hr10')[0]).after(injectComponent);
                $('iframe').remove();//移除广告等无必要元素
            }
        },
        'www.meitulu.com': function () {
            if ($('div.bk3')) {
                $('div.bk3').after(injectComponent);
                {//http://www.meitulu.com广告遮挡层
                    $("a[id^='__tg_ciw_a__']").remove();
                    $("a[id^='__qdd_ciw_a__']").remove();
                    $('iframe').remove();//移除广告等无必要元素
                }
            }
        },
        'www.17786.com': function () {
            $('div.tsmaincont-desc').after(injectComponent);
            $('div.articleV2Desc').after(injectComponent);
        },
        'www.nvshens.com': function () {
            $('div[id^=mms]').remove();//移除广告等无必要元素
            $('div#dinfo').after(injectComponent);
        },
        'm.nvshens.com': function () {
            $('div#ddinfo').after(injectComponent);
            $('div#ms1').next().remove();
        },
        'www.24meinv.me': function () {
            $('div.hd1').after(injectComponent);
            $('#hgg1').remove();
        },
        'www.aitaotu.com': function () {
            $('div.tsmaincont-desc').after(injectComponent);
        },
        'www.mzitu.com': function () {
            $('div.main-meta').after(injectComponent);
        },
        'www.beautylegmm.com': function () {
            $('iframe').remove();//移除广告等无必要元素
            setInterval(function () {
                $('iframe').remove();//移除广告等无必要元素
            },1000);
            $('div.post_title').after(injectComponent);
        },
        'www.meinv58.com': function () {
            $('iframe').remove();//移除广告等无必要元素
            setInterval(function () {
                $('iframe').remove();//移除广告等无必要元素
            },1000);
            $(' div.main-header > div').after(injectComponent);
        }
    };
    injectAggregateObj[currentHostname]();
    $('#injectaggregatBtn').after('<div id="c_container"></div>');
}


function bindBtn(callback) {
    $('#injectaggregatBtn').bind('click', callback);
    $('#captureBtn').bind('click', function (e) {
        var imgList = $('img[label="sl"]');
        var length = imgList.length;
        $.each(imgList, function (index, value) {
            var imgSrc = $(value).attr('src');
            {
                if (blobCache[imgSrc]) {
                    length--;
                } else {
                    if (!imgSrc.startsWith('blob:')) {
                        Alpha_Script.obtainHtml({
                            url: imgSrc,
                            method: 'GET',
                            headers: {
                                "Accept": "application/*"
                            },
                            responseType: 'blob',
                            onload: function (response) {
                                var responseHeaders = Alpha_Script.parseHeaders(response.responseHeaders);
                                var contentType = responseHeaders['Content-Type'];
                                if (!contentType) {
                                    contentType = "image/png";
                                }
                                var blob = new Blob([response.response], {type: contentType});
                                blobCache[imgSrc] = blob;
                                length--;
                            }
                        });
                    }
                }
            }
        });
        var id = setInterval(function () {
            if (length == 0) {
                clearInterval(id);
                var length2 = imgList.length;
                $.each(imgList, function (index, value) {
                    var imgSrc = $(value).attr('src');
                    {
                        if (!imgSrc.startsWith('blob:')) {
                            if (blobCache[imgSrc]) {
                                var objectURL = URL.createObjectURL(blobCache[imgSrc]);
                                blobUrlCache[objectURL] = imgSrc;
                                $(value).attr('src', objectURL);
                                length2--;
                            }
                        } else {
                            length2--;
                        }
                    }
                });
                var id2 = setInterval(function () {
                    if (length2 == 0) {
                        clearInterval(id2);
                        domtoimage.toBlob($('#c_container').get(0))
                            .then(function (blob) {
                                saveAs(blob, "captureSL.png");
                            })
                            .catch(function (error) {
                                err('截图太大不能保存!');
                            });
                    }
                }, 100);

            }
        }, 100);
    });
    $('#packageBtn').bind('click', function (e) {
        packageAndDownload();
    });
}
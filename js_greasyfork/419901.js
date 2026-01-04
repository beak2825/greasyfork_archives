// ==UserScript==
// @name           知了
// @description    通过国家哲学社会科学文献中心下载
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
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require        https://greasyfork.org/scripts/368137-encodeToGb2312/code/encodeToGb2312.js?version=601683
// @include        https://kns.cnki.net/kns8/defaultresult/index*
// @include        https://kns.cnki.net/kcms/detail/detail.aspx*
// @version        0.3.3
// @icon           https://kns.cnki.net/favicon.ico
// @run-at         document-end
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/419901/%E7%9F%A5%E4%BA%86.user.js
// @updateURL https://update.greasyfork.org/scripts/419901/%E7%9F%A5%E4%BA%86.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

// 不属于豆瓣的页面
if (!/kns.cnki.net/.test(location.host)) {
    return
}

;(function () {
    'use strict';

    $(document).ready(function () {
        if (location.href.includes('https://kns.cnki.net/kcms/detail/detail.aspx')) {
            detail();
        } else if (location.href.includes('https://kns.cnki.net/kns8/defaultresult/index')) {
            defaultresult();
        }
    })

    function detail() {
        var name = $('div.main div.container div.brief h1').text();
        var cbw_name = $('.top-tip a:nth-child(1)').text();
        var authors = [];
        $('#authorpart a').each(function(){
            authors.push($(this).text().replace(/\d+|,/g, ''));
        });
        if (name && name.length > 0) {
            ncpssd(name, authors, cbw_name, function(meta, searchurl, readurl, pdfurl) {
                var operate = $('.operate-btn');
                if (operate) {
                    operate.append('<li class="btn-ncpssd"><a style="background-color: #d92129;" target="_blank" id="ncpssdSearch" name="ncpssdSearch" href="' + searchurl + '">搜索...</a></li>');
                    if (readurl) {
                        operate.append('<li class="btn-ncpssd"><a style="background-color: #d92129;" target="_blank" id="ncpssdRead" name="ncpssdRead" pdfurl="' + pdfurl + '" href="' + readurl + '">阅读全文</a></li>');
                    } else {
                        operate.append('<li class="btn-ncpssd"><a title="没找到资源" style="background-color: #aca6a6;" target="_blank" id="ncpssdRead" name="ncpssdRead" onclick="return false" href="javascript:void(0)">阅读全文</a></li>');
                    }
                    /*if (pdfurl) {
                        operate.append('<li class="btn-ncpssd"><a title="如果点击无法正常下载，请尝试右键「新标签打开」，或者「链接保存为」。" style="background-color: #d92129;" target="_blank" id="ncpssdDown" name="ncpssdDown" href="' + pdfurl + '&type=1">PDF下载</a></li>');
                    } else {
                        operate.append('<li class="btn-ncpssd"><a title="没找到资源" style="background-color: #aca6a6;" target="_blank" id="ncpssdDown" name="ncpssdDown" onclick="return false" href="javascript:void(0)">PDF下载</a></li>');
                    }*/
                }
            });
        }
    }

    function defaultresult() {
        var interval = setInterval(function() {
            if ($('.done').length > 0) return;

            $('.result-table-list').addClass('done');
            var tr = $('#gridTable table tbody tr');
            if (tr.length > 0) {
                if ($('.th-ncpssd').length === 0) {
                    $('.result-table-list>thead>tr').append('<th class="th-ncpssd" style="width: 70px;">知了</th>');
                }
                tr.each(function(){
                    let name = $(this).find('.name a').text().replace(/ |\n/g, '');
                    let authors = $(this).find('.author').text().replace(/\d+/g, '').replace(' ', '').split(';');
                    let cbw_name = $(this).find('.source').text().replace(/ |\n/g, '');
                    let cbItem = $(this).find('input.cbItem').val().replace(/!/g, '');
                    let cls = 'ncpssd-' + cbItem;
                    $(this).append('<td class="' + cls + '">...</td>');
                    ncpssd(name, authors, cbw_name, function(meta, searchurl, readurl, pdfurl) {
                        var td = $('.' + meta.item);
                        td.html('<a title="Ncpssd搜索" href="' + searchurl + '" target="_blank" style="color: #d92129; padding: 0 2pt 0 0;">搜索</a>');
                        if (readurl) {
                            td.append('<a title="阅读全文" href="' + readurl + '" pdfurl="' + pdfurl + '" target="_blank" style="color: #d92129; padding: 0 2pt 0 0;">阅读</a>');
                        } else {
                            td.append('<span style="color: #9da1a4; padding: 0 2pt 0 0;">阅读</span>');
                        }
                        /*if (pdfurl) {
                            td.append('<a title="PDF下载：如果点击无法正常下载，请尝试右键「新标签打开」，或者「链接保存为」。" href="' + pdfurl + '" target="_blank" style="color: #d92129; padding: 0 2pt 0 0;">下载</a>');
                        } else {
                            td.append('<span style="color: #9da1a4; padding: 0 2pt 0 0;">下载</span>');
                        }*/
                    }, {item: cls});
                });
            }
        }, 200);
    }

    function ncpssd(title, authors, cbw_name, callback, meta) {
        var search = "(IKTE=\"" + title + "\" OR IKST=\"" + title + "\" OR IKET=\"" + title + "\" OR IKSE=\"" + title + "\")";
        var searchname = "题名/关键词=\"" + title + "\"";
        search = $.base64.encode(search, 'utf8');
        searchname = $.base64.encode(searchname, 'utf8');
        var searchurl = 'http://www.ncpssd.org/Literature/articlelist.aspx?search=' + search + '&searchname=' + searchname + '&nav=0';

        var search0 = "(IKTE=\"" + title + "\" OR IKET=\"" + title + "\")";
        var searchname0 = "题名=\"" + title + "\"";
        search0 = $.base64.encode(search0, 'utf8');
        searchname0 = $.base64.encode(searchname0, 'utf8');
        var url = 'http://www.nssd.cn/articles/articlesearch.aspx?invokemethod=search&q=' + encodeURIComponent($.base64.encode(JSON.stringify({ search: title, sType: 1 }), 'utf-8'));

        loadDoc(url, Object.assign(meta || {}, {authors: authors, searchurl: searchurl}), function(doc, responseDetail, meta) {
            var dl = $(doc).find('.full_list > dl');
            var dt = dl.find('dt');
            var found = false;
            if (dt.length > 0) {
                for(var a of dl.find('.writer a')) {
                    if ((meta.authors.length > 0 && meta.authors.indexOf($(a).text()) > -1)) {
                        // get!
                        var dd = dl.find('dd:last-child')
                        var id = dd.attr('id');
                        callback(meta, meta.searchurl, 'http://www.ncpssd.org/Literature/readurl.aspx?id=' + id + '&type=1', 'http://www.nssd.cn/articles/article_down.aspx?id=' + id + '&type=1');
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    callback(meta, meta.searchurl);
                }
            } else {
                callback(meta, meta.searchurl);
            }
        }, function(err, meta) {
            callback(meta, meta.searchurl);
        });
    }

    function nssd(title, authors, cbw_name, callback, meta) {
        var search1 = { search: title, sType: 1 };
        var search0 = "(IKTE=\"" + title + "\" OR IKET=\"" + title + "\")";
        var searchname = "题名=\"" + title + "\"";
        var search = $.base64.encode(search0, 'utf8');
        searchname = $.base64.encode(searchname, 'utf8');

        var searchurl = 'http://www.nssd.cn/articles/articlesearch.aspx?invokemethod=search&q=' + encodeURIComponent($.base64.encode(JSON.stringify(search1), 'utf-8'));
        loadDoc(searchurl, Object.assign(meta || {}, {authors: authors, searchurl: searchurl}), function(doc, responseDetail, meta) {
            var dl = $(doc).find('.full_list > dl');
            var dt = dl.find('dt');
            var found = false;
            if (dt.length > 0) {
                for(var a of dl.find('.writer a')) {
                    if ((meta.authors.length > 0 && meta.authors.indexOf($(a).text()) > -1)) {
                        // get!
                        var original = dt.find('.original a');
                        var read = dt.find('.read a');
                        callback(meta, meta.searchurl, 'http://www.nssd.cn' + read.attr('href'), 'http://www.nssd.cn' + original.attr('href'));
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    callback(meta, meta.searchurl);
                }
            } else {
                callback(meta, meta.searchurl);
            }
        }, function(err, meta) {
            callback(meta, meta.searchurl);
        });
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



/*!
 * jquery.base64.js 0.1 - https://github.com/yckart/jquery.base64.js
 * Makes Base64 en & -decoding simpler as it is.
 *
 * Based upon: https://gist.github.com/Yaffle/1284012
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/10
 **/
;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },

        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function(c) { // (note parentheses for precence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function(c) { // (note parentheses for precence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));
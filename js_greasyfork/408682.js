// ==UserScript==
// @name           豆瓣京东当当中图法分类
// @description    如果存在中图分类，则会在信息栏中多显示如“中图分类: 中图分类: G442 (G 文化、 科学、 教育、 体育 ▸ G4 教育 ▸ G44 教育心理学 ▸ G442 学习心理学)；学科分类: 880 教育学 | 880 教育学 | 88027 教育心理学”，方便对图书进行分类。
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
// @include        https://book.douban.com/*
// @include        https://item.jd.com/*
// @include        http://product.dangdang.com/*
// @version        0.7.2
// @icon           https://img3.doubanio.com/favicon.ico
// @run-at         document-end
// @license        MIT
// @namespace      http://018.ai
// @downloadURL https://update.greasyfork.org/scripts/408682/%E8%B1%86%E7%93%A3%E4%BA%AC%E4%B8%9C%E5%BD%93%E5%BD%93%E4%B8%AD%E5%9B%BE%E6%B3%95%E5%88%86%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/408682/%E8%B1%86%E7%93%A3%E4%BA%AC%E4%B8%9C%E5%BD%93%E5%BD%93%E4%B8%AD%E5%9B%BE%E6%B3%95%E5%88%86%E7%B1%BB.meta.js
// ==/UserScript==

// This Userscirpt can't run under Greasemonkey 4.x platform
if (typeof GM_xmlhttpRequest === 'undefined') {
    alert('不支持Greasemonkey 4.x，请换用暴力猴或Tampermonkey')
    return
}

const IsCourse = 'clc_setting_IsCourse';
const Subject = 'clc_setting_Subject';
const MoreVersion = 'clc_setting_MoreVersion';
const IsticKeys = 'clc_setting_IsticKeys';

;(function () {
    'use strict';

    $(document).ready(function () {
        if (/douban.com/.test(location.host)) {
            handleDouban()
        } else if (/jd.com/.test(location.host)) {
            handleJd()
        } else if (/dangdang.com/.test(location.host)) {
            handleDangdang()
        }
    })

    function handleDangdang() {
        // 分类
        var isbn;
        var lis = document.querySelectorAll('#detail_describe > ul li');
        if (lis) {
            for (var li of lis) {
                if (li) {
                    var section = li.innerText;
                    let index = section.indexOf('：');
                    if (index <= -1) continue;

                    let key = section.substr(0, index).trim();
                    let value = section.substr(index + 1).trim();
                    switch (key) {
                        case "国际标准书号ISBN":
                            isbn = value;
                            break;
                    }
                }
            }
        }

        if( isbn ) {
            // superlib 搜索
            requestSuperlib(isbn, function(clc) {
                let $clc = $('.clcText');
                if($clc.length > 0) {
                    $clc.after('; <a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                               + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '">(...)</span>');
                } else {
                    $('.pinglun').after('<div id="p-clc" style="margin: 0; color: #666;"><span>中图分类:</span> <span id="clc" style="display: none;">' + clc + '</span><a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                                      + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '" class="clcText">(...)</span></div>');
                }
                requestClc(clc, clc, function(subject) {
                    appendsubjectDangdang(subject);
                });
            }, function(as) {
                let $clc = $('.as');
                if($clc.length > 0) {
                    $clc.after(as);
                } else {
                    $('.pinglun').after('<div id="p-try" style="color: #666;"><span>试读:</span> <span class="as">' + as + '</span></div>');
                }
            }, function(status, statusText) {
                $('.pinglun').after('<span style="margin: 10px 0; color: #666;">中图分类:</span> <span style="color:#989B9B">' + statusText + '</span>');
            }, function(status, statusText) {
                $('.pinglun').after('<div id="p-try" style="color: #666;"><span>试读:</span> <span style="color:#989B9B" class="as">' + statusText + '</span></div>');
            });
        }
    }

    function handleJd() {
        // 分类
        var infos = $('.p-parameter-list').text();
        infos = infos.replace(/^[\xA0\s]+/gm, '')
            .replace(/[\xA0\s]+$/gm, '')
            .replace(/\n+/g, '\n')
            .replace(/:\n+/g, ': ')
            .replace(/]\n/g, ']')
            .replace(/】\n/g, '】')
            .replace(/\n\/\n/g, '/');
        var isbn, author;
        for (var section of Object.values(infos.split('\n'))) {
            if (!section || section.trim().length <= 0) continue;

            let index = section.indexOf('：');
            if (index <= -1) continue;

            let key = section.substr(0, index).trim();
            let value = section.substr(index + 1).trim();
            switch (key) {
                    // book
                case "作者":
                    author = value;
                    break;
                case "ISBN":
                    isbn = value;
                    break;
                default:
                    break;
            }
        }

        if( isbn ) {
            // superlib 搜索
            requestSuperlib(isbn, function(clc) {
                let $clc = $('.clcText');
                if($clc.length > 0) {
                    $clc.after('; <a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                               + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '">(...)</span>');
                } else {
                    $('#p-author').after('<div id="p-clc" style="margin: 10px 0; color: #666;"><span>中图分类:</span> <span id="clc" style="display: none;">' + clc + '</span><a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                                      + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '" class="clcText">(...)</span></div>');
                }
                requestClc(clc, clc, function(subject) {
                    appendsubjectJD(subject);
                });
            }, function(as) {
                let $clc = $('.as');
                if($clc.length > 0) {
                    $clc.after(as);
                } else {
                    $('#p-author').after('<div id="p-try" style="margin: 10px 0; color: #666;"><span>试读:</span> <span class="as">' + as + '</span></div>');
                }
            }, function(status, statusText) {
                $('#p-author').after('<span style="margin: 10px 0; color: #666;">中图分类:</span> <span style="color:#989B9B">' + statusText + '</span><br/>');
            }, function(status, statusText) {
                $('#p-author').after('<div id="p-try" style="margin: 10px 0; color: #666;"><span>试读:</span> <span style="color:#989B9B" class="as">' + statusText + '</span></div>');
            });
        }
    }

    function handleDouban() {
        // 初始化
        var isSubject = localStorage.getItem(Subject);
        if (!isSubject || isSubject.length === 0) {
            localStorage.setItem(Subject, 1);
        }
        var isCourse = localStorage.getItem(IsCourse);
        if (!isCourse || isCourse.length === 0) {
            localStorage.setItem(IsCourse, 1);
        }
        var moreVersion = localStorage.getItem(MoreVersion);
        if (!moreVersion || moreVersion.length === 0) {
            localStorage.setItem(MoreVersion, 1);
        }
        var isticKeys = localStorage.getItem(IsticKeys);
        if (!isticKeys || isticKeys.length === 0) {
            localStorage.setItem(IsticKeys, 1);
        }

        //  设置
        $('.top-nav-info').append('<a href="javascript:;" id="clc_setting_btn">中图法分类设置</a>');
        $('#clc_setting_btn').click(function(){
            if ($('#clc_setting').length > 0) {
                return;
            }

            $('#wrapper > *').hide();
            var $clc_setting = $('<div id="clc_setting">\
<h1>\
<span>豆瓣中图法分类</span>\
</h1>\
<div>\
<table>\
<tbody>\
<tr>\
<td><input type="checkbox" checked lable="中图分类" disabled><span>中图分类</span></td>\
</tr>\
<tr>\
<td><input type="checkbox" ' + (localStorage.getItem(IsCourse) === '1' ? 'checked' : '') + ' lable="是否教程" data-config="' + IsCourse + '"><span>是否教程</span></td>\
</tr>\
<tr>\
<td><input type="checkbox" ' + (localStorage.getItem(Subject) === '1' ? 'checked' : '') + ' lable="学科分类参考" data-config="' + Subject + '"><span>学科分类参考</span></td>\
</tr>\
<tr>\
<td><input type="checkbox" ' + (localStorage.getItem(MoreVersion) === '1' ? 'checked' : '') + ' lable="更多版本" data-config="' + MoreVersion + '"><span>更多版本</span></td>\
</tr>\
<tr>\
<td><input type="checkbox" ' + (localStorage.getItem(IsticKeys) === '1' ? 'checked' : '') + ' lable="关键字" data-config="' + IsticKeys + '"><span>关键字</span></td>\
</tr>\
</tbody>\
</table>\
</div>\
<br>\
<h2>设置完成后刷新即可。</h2>\
</div>');
            $clc_setting.on('click', 'input', function() {
                localStorage.setItem($(this).data('config'), $(this).prop('checked') ? 1 : 0);
            });
            $('#wrapper').append($clc_setting);
        });

        // 分类
        var infos = $('#info').text();
        infos = infos.replace(/^[\xA0\s]+/gm, '')
            .replace(/[\xA0\s]+$/gm, '')
            .replace(/\n+/g, '\n')
            .replace(/:\n+/g, ': ')
            .replace(/]\n/g, ']')
            .replace(/】\n/g, '】')
            .replace(/\n\/\n/g, '/');
        var title = $('#wrapper h1').eq(0).text().replace(/\n| /g, '');
        var isbn, author, series, subtitle;
        for (var section of Object.values(infos.split('\n'))) {
            if (!section || section.trim().length <= 0) continue;

            let index = section.indexOf(':');
            if (index <= -1) continue;

            let key = section.substr(0, index).trim();
            let value = section.substr(index + 1).trim();
            switch (key) {
                    // book
                case "作者":
                    author = value;
                    break;
                case "ISBN":
                    isbn = value;
                    break;
                case "丛书":
                    series = value;
                    break;
                case "副标题":
                    subtitle = value;
                    break;
                default:
                    break;
            }
        }

        if( isbn && title ) {
            // superlib 搜索
            requestSuperlib(isbn, function(clc) {
                let $clc = $('.clcText');
                if($clc.length > 0) {
                    $clc.after('; <a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                               + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '">(...)</span>');
                } else {
                    $('#info').append('<span class="pl">中图分类:</span> <span id="clc" style="display: none;">' + clc + '</span><a id="clc_' + clc.replace('.', '') + '" target="_blank" href="http://uread.today/clc?c=' + clc + '">'
                                      + clc + '</a> <span id="clcText_' + clc.replace('.', '') + '" class="clcText">(...)</span><br>');
                }
                requestClc(clc, clc, function(subject) {
                    if (localStorage.getItem(Subject) == '1') {
                        appendsubject(subject);
                    }
                });
            }, function(as) {
                let $clc = $('.as');
                if($clc.length > 0) {
                    $clc.after(as);
                } else {
                    $('#info').append('<div id="p-try" style="color: #666;"><span>试读:</span> <span class="as">' + as + '</span></div>');
                }
            }, function(status, statusText) {
                $('#info').append('<span class="pl">中图分类:</span> <span style="color:#989B9B">' + statusText + '</span><br/>');
            }, function(status, statusText) {
                $('#info').append('<div id="p-try" style="color: #666;"><span>试读:</span> <span style="color:#989B9B" class="as">' + statusText + '</span></div>');
            });
        }

        if (localStorage.getItem(MoreVersion) == '1') {
            if( author && title ) {
                moreversion(title, author);
            }
        }

        var abstract;
        var h2s = $('div.related_info h2');
        for (var i = 0; i < h2s.length; i++) {
            let h2 = h2s[i];
            let span = h2.querySelector('span');
            if(span && span.textContent === '内容简介') {
                var intro = h2.nextElementSibling.querySelector('.all div.intro');
                if(!intro) {
                    intro = h2.nextElementSibling.querySelector('div.intro');
                }
                if(intro) {
                    abstract = intro.textContent;
                }
                break;
            }
        }

        if (localStorage.getItem(IsCourse) == '1') {
            var istextbook = false;
            var tip = '';
            let _istextbook = false
            if (subtitle) {
                _istextbook = subtitle.includes('教科书') || subtitle.includes('教材') || subtitle.includes('课程') || subtitle.includes('课本')
                istextbook |= _istextbook
            }
            tip += (tip.length > 0 ? '\t' : '') + (_istextbook ? '● 副标题' : '○ 副标题')

            if (series) {
                _istextbook = series.includes('教科书') || series.includes('教材') || series.includes('课程') || series.includes('课本')
                istextbook |= _istextbook
            }
            tip += (tip.length > 0 ? '\t' : '') + (_istextbook ? '● 丛书' : '○ 丛书')

            if (abstract) {
                _istextbook = abstract.includes('教科书') || abstract.includes('教材') || abstract.includes('课程') || abstract.includes('课本')
                istextbook |= _istextbook
            }
            tip += (tip.length > 0 ? '\t' : '') + (_istextbook ? '● 内容简介' : '○ 内容简介')

            // 标签
            _istextbook = false
            for(let tag of $('div#db-tags-section div.indent a.tag')) {
                let text = tag.textContent;
                if (text.includes('教科书') || text.includes('教材') || text.includes('课程') || text.includes('课本')) {
                    _istextbook = true;
                    istextbook |= _istextbook;
                    break;
                }
            }
            tip += (tip.length > 0 ? '\t' : '') + (_istextbook ? '● 标签' : '○ 标签')

            // 短评
            _istextbook = false
            for(let span of $('#comment-list-wrapper .comment-item .comment .comment-content .short')) {
                let text = span.textContent;
                if (text.includes('教科书') || text.includes('教材') || text.includes('课程') || text.includes('课本')) {
                    _istextbook = true;
                    istextbook |= _istextbook;
                    break;
                }
            }
            tip += (tip.length > 0 ? '\t' : '') + (_istextbook ? '● 短评' : '○ 短评')

            if (istextbook) {
                $('#mainpic').append('<div class="indent"><span class="tag" title="' + tip + '">教材</span></div>');
            }
        }

        if (localStorage.getItem(IsticKeys) == '1') {
            // 目录
            let id = getIDFromURL(location.href);
            let dir = $('#dir_' + id + '_full').text();
            if (dir) {
                dir = dir.replace(/(([\xA0\s]*)\n([\xA0\s]*))+/g, '').replace('· · · · · ·     (收起)', '');
            }

            let content = abstract + dir;
            if (content.length > 0) {
                requestIstic(content);
            }
        }
    }

    function requestIstic(abstract) {
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Connection": "keep-alive",
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4229.0 Safari/537.36",
            "Origin": "https://ct.istic.ac.cn",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Referer": "https://ct.istic.ac.cn/site/term/participle",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            "Cookie": "name=value"
        }
        doPost('https://ct.istic.ac.cn/site/term/ceshihjson', headers, 'id=lyb018' + new Date().getTime() + '&inputText=' + encodeURIComponent(abstract), {}, function(json, responseDetail, meta) {
            if (json && json.t1 && json.t1.length > 0) {
                // 最多取五个
                let keys = [];
                json.t1.sort(function (a, b) {
                    return b.frequency - a.frequency;
                });
                for (let i = 0; i < json.t1.length; i++ ) {
                    let work = json.t1[i].word.trim();
                    if(work.length == 0 || ['第', '部分', '章', '●', 'Chapter', '-', '#', '附录'].includes(work)) continue;

                    keys.push('<span style="color:#EB9108">' + json.t1[i].word + '(' + json.t1[i].frequency + ')' + '</span>');

                    replaceKey(json.t1[i].word);

                    if (keys.length >= 5) break;
                }

                $('div.indent div.intro').eq(0).after('<p class="IsticKeys">关键字: ' + keys.join('<span style="color:#989B9B"> | </span>'));
                $('div.indent span.all div.intro').eq(0).after('<p class="IsticKeys">关键字: ' + keys.join('<span style="color:#989B9B"> | </span>'));
            }
        }, function(err, meta) {
        });
    }

    function replaceKey(work) {
        for (let e of $('div.indent div.intro p')) {
            if (!e.querySelector('a')) {
                $(e).html($(e).html().replace(eval('/' + work + '/g'), '<span style="color:#EB9108">' + work + '</span>'));
            }
        }
    }

    // 请求图书馆联盟
    function requestSuperlib(isbn, callback, tryread, error, tryreaderror) {
        loadDoc('http://book.ucdrs.superlib.net/search?Field=all&channel=search&sw=' + isbn, {isbn: isbn}, function(doc, responseDetail, meta) {
            let found = false;
            let searchinfo = doc.querySelector('#searchinfo');
            if (!searchinfo) {
                error(-2, '请登陆 <a href="http://www.ucdrs.superlib.net/login/login.action" target="_blank">全图图书馆参考咨询联盟</a> 后刷新。');
                return;
            }
            let books = doc.querySelectorAll('.book1');
            if (books.length <= 0) {
                error(-1, '<a href="http://book.ucdrs.superlib.net/search?Field=all&channel=search&sw=' + isbn + '&edtype=&ecode=utf-8" target="_blank">全图图书馆参考咨询联盟</a> 没有该书籍');
                return;
            }

            for (let book of books) {
                if (found) break;

                let a = book.querySelector('.book1 td>table a.px14');//
                if (a) {
                    // superlib 单本书籍查看
                    let url = a.href.replace(location.host, 'book.ucdrs.superlib.net').replace('https', 'http');
                    loadSrcDoc(url, {isbn: meta.isbn, url: url}, function(doc1, responseDetail1, meta1) {
                        found = $(".clcText").length > 0;
                        if (!found) {
                            let tubox = doc1.querySelector('.tubox dl').textContent;
                            let isbn1 = opt(/【ISBN号】.*\n/.exec(tubox)).replace(/【ISBN号】|-|\n/g, '');
                            if (eqisbn(meta1.isbn, isbn1)) {
                                let clcsText = opt(opt(/【中图法分类号】.*\n/.exec(tubox)).match(/[a-zA-Z0-9\.;]+/));
                                if (!clcsText) {
                                    error(-1, '该书在 <a href="' + meta1.url + '" target="_blank">全图图书馆参考咨询联盟</a> 没有中图分类号');
                                } else {
                                    let clcs = clcsText.split(';');
                                    if (clcs) {
                                        for(let i = 0; i < clcs.length; i++) {
                                            let clc = clcs[i];
                                            callback(clc);
                                        }
                                    }
                                }
                            }
                        }

                        // 试读
                        var element = Object.values(doc1.scripts).find(element => element.textContent.includes('send_requestajax'))
                        if (element) {
                            var pattern = /".*?"/
                            if (pattern.test(element.textContent)) {
                                var url = pattern.exec(element.textContent)[0].replaceAll('"', '');

                                doText ('http://book.ucdrs.superlib.net/' + url, {}, function (responseText, responseDetail, meta) {
                                    var htmlText = unescape(responseText.trim());
                                    var html = (new DOMParser()).parseFromString(htmlText, 'text/html');
                                    var as = '';
                                    var href
                                    for(var a of html.querySelectorAll('.link a')) {
                                        if (as.length > 0) {
                                            as += '<span> | </span>'
                                        }
                                        if (a.textContent === '图书馆文献传递') {
                                            as += '<a href="http://book.ucdrs.superlib.net' + a.href.replace('javascript:subtoRefer(true,', '').replace('\'', '').replace(')', '') + '" target="_blank">' + a.textContent + '</a>'
                                        } else {
                                            href = a.href.replace(location.origin, 'http://book.ucdrs.superlib.net');
                                            as += '<a href="' + href + '" target="_blank">' + a.textContent + '</a>'
                                        }
                                    }

                                    if (!href) {
                                        tryreaderror(-1, '查无此信息')
                                    } else {
                                        loadDoc(href, {}, function(doc, responseDetail, meta) {
                                            let $assistUrl = $(doc.querySelector('#downpdf [name=assistUrl]'));
                                            let assistUrl = $assistUrl.attr('value');
                                            let $cntUrl = $(doc.querySelector('#downpdf [name=cntUrl]'));
                                            let cntUrl = $cntUrl.attr('value');

                                            as += '<span> | </span><a id="assistUrl" target="_blank" href="' + assistUrl + '" title="版权页、前言页、目录页。">下载辅助页</a>';
                                            if (cntUrl) {
                                                as += '<span> | </span><a id="cntUrl" target="_blank" href="' + cntUrl + '">下载正文试读</a>';
                                            }
                                            tryread(as);
                                        }, function (err, meta) {
                                            tryreaderror(err.status, err.statusText);
                                        });
                                    }
                                }, function (err, meta) {
                                    error(err.status, err.statusText);
                                })
                            }
                        }
                    }, function(err, meta) {
                        error(err.status, err.statusText);
                    });
                }
            }
        }, function(err, meta) {
            error(err.status, err.statusText);
        });
    }

    function trimAuthors(author) {
        let authors = author.split(/[(|（|）|)|\/|\.|．|·|•|\s]/g);
        var trimAs = [];
        for (let a of authors) {
            let trima = a.trim().replace('主编', '');
            if (trima.length <= 1) continue;

            if (trimAs.indexOf(trima) < 0) {
                trimAs.push(trima);
            }
        }
        return trimAs;
    }

    function moreversion(title, author) {
        var trimTitle = title.replace(/[\(|（].*[\)|）]/g, '');
        doGet('https://book.douban.com/j/subject_suggest?q=' + trimTitle, {isbn: trimTitle}, function(arr, responseDetail, meta) {
            if (arr.length <= 0) {
                $('#info').append('<span class="pl">更多版本:</span> <span style="color:#989B9B">查无此信息</span><br>');
                return;
            }

            $('#info').append('<span class="pl">更多版本:</span> ');
            var trimAs = trimAuthors(author);
            var html = '';
            for (let item of arr) {
                if (item.type !== 'b' || item.url === location.href) continue;

                let trim_author_name = trimAuthors(item.author_name);
                if ($(trimAs).filter(trim_author_name).length > 0) {
                    $('#info').append('<a target="_blank" href="' + item.url + '"><img style="width: 16px;height: 16px;" src="' + item.pic + '" />' + item.title + '(' + item.year + ', <span id="item__' + item.id + '">...</span>)' + '</a><span style="color:#989B9B"> | </span>');
                }

                loadDoc(item.url, {id: item.id}, function(_doc, responseDetail, meta) {
                    let rating = _doc.querySelector('strong[property*="v:average"]');
                    let ratingContent;
                    if (rating && (ratingContent = rating.textContent.trim()).length >= 1) {
                        var ratingPeople = _doc.querySelector('div.rating_sum a.rating_people span[property="v:votes"]').textContent;
                        if (!ratingPeople || ratingPeople.toString().trim().length <= 0) {
                            ratingPeople = 0;
                        }
                        $('#item__' + meta.id).html(ratingContent + "/" + ratingPeople);
                    } else {
                        $('#item__' + meta.id).html("0/0");
                    }
                }, function(err, meta) {
                    $('#item__' + meta.id).html("-/-");
                });
            }
            $('#info').append('<a target="_blank" href="https://search.douban.com/book/subject_search?search_text=' + trimTitle + '&cat=1001">详情</a><br>');
        }, function(err, meta) {
            $('#info').append('<span class="pl">更多版本:</span> <a target="_blank" href="https://search.douban.com/book/subject_search?search_text=' + trimTitle + '&cat=1001">详情...</a><br>');
        });
    }

    // 请求istic，获取分类名称，备用，暂不启用。
    function requestClc(srcclc, clc, subject) {
        doGet('http://api.uread.today/master/anon/ch_lib_cls/info?code=' + clc, {srcclc: srcclc, clc: clc}, function(json, responseDetail, meta) {
            if (json.resultcode == 40000 && meta.clc.length > 0) {
                if (meta.clc.includes('.')) {
                    requestClc(meta.srcclc, meta.clc.replace(/\.\d*$/, ''), subject);
                } else {
                    requestClc(meta.srcclc, meta.clc.replace(/\d$/, ''), subject);
                }
                return;
            }

            let clcs = [];
            clcs.push(...json.data.clc.parents.map((e) => '<a target="_blank" href="http://uread.today/clc?c=' + e.clc + '">' + e.clc + '</a>' + ' ' + hanldeClcText(e.name)));
            clcs.push('<a target="_blank" href="http://uread.today/clc?c=' + json.data.clc.clc + '">' + json.data.clc.clc + '</a>' + ' ' + hanldeClcText(json.data.clc.name))
            htmlclc(meta.srcclc, clcs);

            subject(json.data.subject)
        }, function(err, meta) {
            requestClcA(meta.srcclc, meta.clc);
        });
    }

    // 请求istic，获取分类名称，备用，暂不启用。
    function requestClcA(srcclc, clc) {
        doPost('https://ct.istic.ac.cn/site/clc/getByClassName?t=' + new Date().getTime(),
               { "Content-Type": "application/x-www-form-urlencoded" }, 'classname=' + clc, {srcclc: srcclc, clc: clc}, function(json, responseDetail, meta) {
            if (json.length == 0 && meta.clc.length > 0) {
                if (meta.clc.includes('.')) {
                    requestClcA(meta.clc.replace(/\.\d*$/, ''));
                } else {
                    requestClcA(meta.clc.replace(/\d$/, ''));
                }
                return;
            }

            let clcs = [];
            let jsonMap = {};
            let pid;

            let level;
            for (let i = 0; i < json.length; i ++) {
                if (clcs.length == 0 && json[i].classNum.split('/').includes(clc)) {
                    clcs.push(json[i].classNum + ' ' + hanldeClcText(json[i].className));

                    pid = json[i].pid;
                    level = json[i].level;
                } else if( json[i].level < level) {
                    jsonMap[json[i].id + ''] = json[i];
                }
            }

            clcText(clc, pid, jsonMap, clcs);

            htmlclc(meta.srcclc, clcs);
        }, function(err, meta) {
            requestClcB(meta.clc);
        });
    }

    //  处理clc文字
    function clcText(clc, pid, jsonMap, rets) {
        if (!jsonMap || !rets) return;

        if( jsonMap[pid] ) {
            rets.unshift('<a target="_blank" href="http://uread.today/clc?c=' + jsonMap[pid].classNum + '">' + jsonMap[pid].classNum + '</a> ' + hanldeClcText(jsonMap[pid].className));

            if (jsonMap[pid].level <= 2) return;

            clcText(clc, jsonMap[pid].pid, jsonMap, rets);
        }
    }

    function htmlclc(srcclc, rets) {
        let clcText = $('#clcText_' + srcclc.replace('.', ''));
        if (rets.length > 0) {
            if (clcText.text() == '(...)' ) {
                clcText.html('(' + rets.join('<span style="color:#989B9B"> ▸ </span>') + ')');
            }
        } else {
            if (clcText.text() == '(...)' ) {
                clcText.html('<span style="color:#989B9B">(查无此信息)</span>');
            }
        }
    }

    function hanldeClcText(txt) {
        var splits = txt.split(/、|（|）|\(|\)/);
        var retss = [];
        for (var s of splits) {
            if (s.length == 0) continue;

            retss.push(' <a target="_blank" href="http://uread.today/clc-subject?t=content&q=' + s + '">' + s + '</a>');

            /*if (localStorage.getItem(Subject) == '1') {
                requestxhma(s);
            }*/
        }
        return retss.join('、');
    }

    // 请求clcindex，获取分类名称
    function requestClcB(clc) {
        var url = 'https://www.clcindex.com/category/' + clc;
        loadDoc(url, {clc: clc, url: url}, function(doc, responseDetail, meta) {
            let clcs = [];
            for (let li of doc.querySelectorAll('.breadcrumb li.active')) {
                if (!li) continue;

                var txtContent = li.textContent.trim();
                var clcCode;
                var index = txtContent.indexOf(' ');
                if (index > 0) {
                    clcCode = txtContent.substr(0, index);
                    txtContent = txtContent.substr(index + 1);
                }

                clcs.push('<a target="_blank" href="http://uread.today/clc?c=' + clcCode + '">' + clcCode + '</a> ' + hanldeClcText(txtContent));
            }

            $('#clc_' + meta.clc).attr('href', meta.url);
            htmlclc(meta.clc, clcs);
        }, function(err, meta) {
            if (err.status == 404) {
                if (meta.clc.includes('.')) {
                    requestClcB(meta.clc, meta.clc.replace(/\.\d*$/, ''));
                } else {
                    requestClcB(meta.clc, meta.clc.replace(/\d$/, ''));
                }
                return;
            }

            let clcText = $('#clcText');
            if (clcText.text() == '(...)' ) {
                clcText.html('<span style="color:#989B9B">(无法获取)</span>');
            }
        });

    }

    // 请求xhma，获取学科
    function requestxhma(s) {
        var url = 'http://xkfl.xhma.com/search?w=' + s;
        loadDoc(url, {}, function(doc, responseDetail, meta) {
            let spans = doc.querySelectorAll('.data li:not(.t) span');//code
            if (spans.length == 1) {
                let name = spans[0].nextElementSibling.textContent.trim();
                if (name.includes(s)) {
                    let code = spans[0].textContent.trim();
                    appendsubject(' <a target="_blank" href="http://uread.today/subject?c=' + code.replace(/\./g, '') + '">' + code + ' ' + name + '</a>');
                }
            } else if (spans.length > 1) {
                for (let span of spans) {
                    if (!span) continue;

                    let name = span.nextElementSibling.textContent.trim();
                    if (name != s && (name != s + '学')) continue;

                    let code = span.textContent.trim();

                    appendsubject('<a target="_blank" href="http://uread.today/subject?c=' + code.replace(/\./g, '') + '">' + code + ' ' + name + '</a>');
                }
            }
        }, function(err, meta) {
        });
    }

    function appendsubject(subject) {
        let clcText = $('#subjectText');
        let subjectText = ''
        for(let subj of subject.parents) {
            subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subj.code + '">' + subj.code + ' ' + subj.name + '</a><span style="color:#989B9B"> ▸ </span>'
        }
        subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subject.code + '">' + subject.code + ' ' + subject.name + '</a>'
        if (clcText.length == 0) {
            $('#info').append('<span class="pl">学科分类:</span><span id="subject" style="display: none;">' + subject.code + '</span><span id="subjectText"><span>' + subjectText + '</span></span>');
        } else {
            clcText.append('<span style="color:#989B9B"> | </span><span>' + subjectText + '</span>');
        }
    }

    function appendsubjectJD(subject) {
        let clcText = $('#subjectText');
        let subjectText = ''
        for(let subj of subject.parents) {
            subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subj.code + '">' + subj.code + ' ' + subj.name + '</a><span style="color:#989B9B"> ▸ </span>'
        }
        subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subject.code + '">' + subject.code + ' ' + subject.name + '</a>'
        if (clcText.length == 0) {
            $('#p-clc').after('<div style="margin: 5px 0; color: #666;"><span class="pl">学科分类:</span><span id="subject" style="display: none;">' + subject.code + '</span><span id="subjectText"><span>' + subjectText + '</span></span></div>');
        } else {
            clcText.append('<span style="color:#989B9B"> | </span><span>' + subjectText + '</span>');
        }
    }

    function appendsubjectDangdang(subject) {
        let clcText = $('#subjectText');
        let subjectText = ''
        for(let subj of subject.parents) {
            subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subj.code + '">' + subj.code + ' ' + subj.name + '</a><span style="color:#989B9B"> ▸ </span>'
        }
        subjectText += ' <a target="_blank" href="http://uread.today/subject?c=' + subject.code + '">' + subject.code + ' ' + subject.name + '</a>'
        if (clcText.length == 0) {
            $('#p-clc').after('<div style="margin: 0; color: #666;"><span class="pl">学科分类:</span><span id="subject" style="display: none;">' + subject.code + '</span><span id="subjectText"><span>' + subjectText + '</span></span></div>');
        } else {
            clcText.append('<span style="color:#989B9B"> | </span><span>' + subjectText + '</span>');
        }
    }

    // 判断两个ISBN是否相等，如：9787100005586与7100005582，具体阅读：http://www.banquanye.com/article/id-812
    function eqisbn(val1, val2) {
        if (!val1 || (val1.length != 13 && val1.length != 10) || !val2 || (val2.length != 13 && val2.length != 10)) return false;

        let no1 = getISBNNo(val1);
        let no2 = getISBNNo(val2);
        return no1 == no2;
    }

    // 获取ID
    function getIDFromURL(url) {
        if (!url) return '';

        var id = url.match(/subject\/.*\//g);
        if (!id) return '';

        return id[0].replace(/subject|\//g, '');
    }

    // 获取ISBN的No，去掉前三位的978以及最后一位验证码
    function getISBNNo(val) {
        if (!val || (val.length != 13 && val.length != 10)) return;

        if (val.length == 13) {
            return val.substr(3, 9);
        } else if (val.length == 10) {
            return val.substr(0, 9);
        }
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
    function page_parser(responseText, src) {
        // 替换一些信息防止图片和页面脚本的加载，同时可能加快页面解析速度
        if (!src) {
            responseText = responseText.replace(/s+src=/ig, ' data-src='); // 图片，部分外源脚本
            responseText = responseText.replace(/<script[^>]*?>[\S\s]*?<\/script>/ig, ''); //页面脚本
        }
        return (new DOMParser()).parseFromString(responseText, 'text/html');
    }

    // 加载网页
    function loadDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText, false)
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

    // 加载网页
    function loadSrcDoc (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    let doc = page_parser(responseDetail.responseText, true)
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
    function doText (url, meta, callback, fail) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (responseDetail) {
                if (responseDetail.status === 200) {
                    callback(responseDetail.responseText, responseDetail, meta)
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

// 测试URL：
// https://book.douban.com/subject/26431646/
// https://book.douban.com/subject/26298597/
// https://book.douban.com/subject/5402711/
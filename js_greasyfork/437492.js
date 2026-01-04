// ==UserScript==
// @name         🔥🔥🔥全国图书联盟读秀豆瓣京东图书获取🔥🔥🔥
// @namespace    https://hz.cn2down.com
// @version      0.2.2
// @description  可以直接显示图书的isbn号，支持读秀、超星、龙岩、全国图书参考联盟，豆瓣，京东，功能还在开发中，敬请期待！！苍鸟资源互助联盟（https://hz.cn2down.com）
// @author       zenghp2015
// @match        *://book.ucdrs.superlib.net/views/specific/*
// @match        *://book.ucdrs.superlib.net/search*
// @match        *://book.douban.com/subject/*
// @match        *://read.douban.com/category/*
// @match        *://item.jd.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437492/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E8%AF%BB%E7%A7%80%E8%B1%86%E7%93%A3%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6%E8%8E%B7%E5%8F%96%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/437492/%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5%E5%85%A8%E5%9B%BD%E5%9B%BE%E4%B9%A6%E8%81%94%E7%9B%9F%E8%AF%BB%E7%A7%80%E8%B1%86%E7%93%A3%E4%BA%AC%E4%B8%9C%E5%9B%BE%E4%B9%A6%E8%8E%B7%E5%8F%96%F0%9F%94%A5%F0%9F%94%A5%F0%9F%94%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let website = '';
    const isbnReg = /\s*【?ISBN号?】?[:|：]?\s*([0-9\-]+)\s*/;

    // 按钮模板
    const copyTpl = ({title = '', isbn = '', ssid = '', doubanid = '', jdid = '', bookid = '', puzzle = false}) => {
        let str = title;
        if(isbn && ssid) {
            str += `_${isbn}_${ssid}`
        } else if(!isbn && ssid){
            str += `__${ssid}`
        } else if(isbn && !ssid){
            str += `_${isbn}`
        }

        let downBtn = `<button type="button" class="download" style="padding:0 3px; color:blue;" data-doubanid="${doubanid}" data-jdid="${jdid}" data-ssid="${ssid}" data-isbn="${isbn}" data-title="${title}">图书互助</button>`
        let copyBtn = `<button type="button" class="copy" style="padding:0 3px" data-text="${str}">一键复制</button>`
        let titleBtn = `<button type="button" class="copy_title" style="padding:0 3px" data-text="${title}">标题</button>`
        let ssidBtn = `<button type="button" class="copy_ssid" style="padding:0 3px" data-text="${ssid}">读秀id</button>`
        let isbnBtn = `<button type="button" class="copy_isbn" style="padding:0 3px" data-text="${isbn}">ISBN号</button>`
        let jdBtn = `<button type="button" class="copy_doubanid" style="padding:0 3px" data-text="${jdid}">京东id</button>`
        let doubanidBtn = `<button type="button" class="copy_doubanid" data-text="${doubanid}">豆瓣id</button>`
        let puzzleBtn = `<button type="button" class="copy_puzzle" data-title="${title}">疑难查询</button>`

        return `<div class="cn2down" style="margin-top:10px; font-size:14px;display: inline-block;">
                    ${puzzle ? puzzleBtn : ''}
                    ${bookid && downBtn}
                    ${str && copyBtn}
                    ${title && titleBtn}
                    ${ssid && ssidBtn}
                    ${isbn && isbnBtn}
                    ${doubanid && doubanidBtn}
                    ${jdid && jdBtn}
                    <span class="copy_status" style="color:red;display:none;"></span>
                </div>`
    }

    // 复制
    const copyText = text => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        } else {
            let textarea = document.createElement('textarea');
            document.body.appendChild(textarea);
            textarea.style.position = 'absolute';
            textarea.style.clip = 'rect(0 0 0 0)';
            textarea.value = text;
            textarea.select();
            document.execCommand('copy', true);
            textarea.remove();
        }
    }

    const request = (data) => {
        const bookInfo = '';
        return new Promise((resolve, reject) => {
            const query = objToUrl(data);
            $.ajax({
                url: `${bookInfo}?${query}`,
                dataType: 'json',
                timeout: 3000,
                success: (response) => {
                    const {errno, errmsg, data} = response;
                    if(errno !== 0) {
                        reject(errmsg);
                    } else {
                        resolve(data)
                    }
                }
            })
        })

    }

    const objToUrl = obj => {
        const query = Object.keys(obj).map(key => {
            return key + '=' +obj[key];
        })
        return query.join('&');
    }

    // 全国图书联盟
    const ucdrs = () => {
        if (location.href.includes("/views/specific/")) {
            // copy 逻辑
            let text = decodeURIComponent($("script:contains(send_requestajax)").text())
            let title = text.match(/sname=(.*?)&/) || '';
            let ssid = text.match(/ssn=(\d{3,})/) || '';
            let isbn = text.match(isbnReg) || '';
            title = title && title[1].replace(/[\+]+?/g, ' ');
            ssid = ssid && ssid[1];
            isbn = isbn ? isbn[1].replace(/-/g, '') : '';

            if (ssid) {
                $('.tutilte').append(copyTpl({title, ssid, isbn}));
            } else {
                $('.tutilte').append(copyTpl({title, isbn}));
            }
        } else if(location.href.includes("/search")){
            // 搜索页
            const txtsearch = $('.txtsearch').val();
            let isbn = '';
            if(txtsearch.length === 13 && /[978|979]+?\d{10}/.test(txtsearch)) {
                isbn = $.trim(txtsearch)
            }

            $('td[id="b_img"]').each((i, el) => {
                const lastNode = $(el).parent("tr").find('td:last');
                const title = $(el).parent("tr").find('input[name*="title"]').val().replace(/<[^>]*>/ig, '');
                const ssid = $(el).parent("tr").find('input[name*="ssid"]').val();
                if (ssid) {
                    $(lastNode).append(copyTpl({title, ssid, isbn}));
                } else {
                    $(lastNode).append(copyTpl({title, isbn}));
                }
            });
        }
    }

    // 豆瓣
    const douban = () => {
        if (location.href.includes("/subject")) {
            const title = $.trim($('h1 span').text()) || ''
            let isbn = ($('.subject #info').text()).match(isbnReg) || ''
            let doubanid = location.href.match(/\/(\d+?)\//) || ''
            doubanid = doubanid && doubanid[1]
            isbn = isbn && isbn[1]
            $('.subjectwrap').prepend(copyTpl({title, isbn, doubanid}))
        }
    }

    // 京东
    const jd = () => {
        let jdid = location.href.match(/\/(\d+?)\.html/) || ''
        const title = $.trim($('.sku-name').text());
        let isbn = ($('.p-parameter-list').text()).match(isbnReg) || ''
        isbn = isbn && $.trim(isbn[1])
        jdid = jdid && $.trim(jdid[1])
        $('.product-intro .itemInfo-wrap').prepend(copyTpl({title, isbn, jdid}))
    }

    const getSite = () => {
        const host = location.host
        if(host === 'book.ucdrs.superlib.net') return 'ucdrs'
        if(host === 'book.douban.com') return 'douban'
        if(host === 'item.jd.com') return 'jd'
        if(host === 'read.douban.com') return 'read-douban'
        return false;
    }

    function run() {
        // GM_addStyle(GM_getResourceText ("customCSS"));
        $(document).on('click', '.cn2down .copy, .cn2down .copy_title, .cn2down .copy_ssid, .cn2down .copy_isbn, .cn2down .copy_doubanid', function(event){
            event.preventDefault();
            const text = $(this).data('text');
            const message = text ? '（复制成功）' : '（暂无信息）'
            copyText(text)
            $(this).siblings('.copy_status').text(message).show().delay(1000).hide(0);
        })

        // 图书互助
        $(document).on('click', '.cn2down .download', function() {
            const ssid = $(this).data('ssid');
            const doubanid = $(this).data('doubanid');
            const jdid = $(this).data('jdid');
            const isbn = $(this).data('isbn');
            const title = $(this).data('title')

            let query = {};
            switch(getSite()) {
                case 'ucdrs':
                    query = {type:'ssid', query: title}
                    break;
                case 'douban':
                    query = {type:'doubanid', query: title}
                    break;
                default:
                    alert('暂支持全国图书联盟、豆瓣')
                    return false;
            }

            // const url = "https://hz.cn2down.com/search?" + objToUrl(query);
            // window.open(url, "_blank")
        })

        // 疑难查询
        $(document).on('click', '.cn2down .copy_puzzle', function(){
            const title = $(this).data('title')
            const url = "https://hz.cn2down.com/search?type=name&query=" + title;
            window.open(url, "_blank")
        })

        const type = getSite();
        if(type === 'jd') jd()
        if(type === 'douban') douban()
        if(type === 'ucdrs') ucdrs()
    }
    run();
})();
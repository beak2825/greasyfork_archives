// ==UserScript==
// @name         字幕组/人人影视 下载资源链接 ZIMUZU.TV/RRYS.TV DIRECT DOWNLOAD LINK
// @namespace    https://greasyfork.org/zh-CN/scripts/34778
// @version      0.8.1
// @description  Bring download link back on resource detail page, plz login before go to download page.
// @author       Al Cheung
// @match        http*://www.zimuzu.tv/resource/*
// @match        http*://www.zimuzu.io/resource/*
// @match        http*://www.zmz2019.com/resource/*
// @match        http*://www.rrys2019.com/resource/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34778/%E5%AD%97%E5%B9%95%E7%BB%84%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%20%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%20ZIMUZUTVRRYSTV%20DIRECT%20DOWNLOAD%20LINK.user.js
// @updateURL https://update.greasyfork.org/scripts/34778/%E5%AD%97%E5%B9%95%E7%BB%84%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%20%E4%B8%8B%E8%BD%BD%E8%B5%84%E6%BA%90%E9%93%BE%E6%8E%A5%20ZIMUZUTVRRYSTV%20DIRECT%20DOWNLOAD%20LINK.meta.js
// ==/UserScript==

(function () {
    const { $ } = window;
    const resId = +(window.location.href.match(/resource\/\d+/)[0].split('/').pop());
    const download = `<a
        id="res-download-link"
        class="__before-scroll"
        href="//${location.host}/resource/list/${resId}">
        下载资源
        </a>`;

    const styleTag = `<style>
        #res-download-link {
        text-align: center;
        font-size: 16px;
        font-weight: 700;
        font-family: -webkit-body;
        color: #fff;
        line-height: 2em;
        z-index: 99;
        background: #155b88;
        }

        .__before-scroll {
        position: absolute;
        border-radius: 0.5em;
        width: 5em;
        height: 2em;
        top: 10px;
        right: 20px;
        }
        .__after-scroll {
        position: fixed;
        border-radius: unset;
        writing-mode: vertical-rl;
        height: 5em;
        width: 2em;
        //right: 0;
        top: calc(50% - 20px);
        transition: top 0.2s linear;
        }
        .__my-link {
        color: #37a;
        }
        .__douban-link {
        color: #072;
        }
        .__end {
        text-align: end;
        }
        </style>`;

    $(styleTag).appendTo('head');
    const baseBar = $('.res-view-top')[0];

    function handleStyle(_baseBar) {
        const offsetTop = _baseBar.getBoundingClientRect().top;
        if (offsetTop <= 0) {
            $('.resource-tit').css('position', 'static');
            const left = baseBar.offsetLeft + baseBar.offsetWidth;
            $("#res-download-link").removeClass('__before-scroll').addClass('__after-scroll').css('left', `calc(${left}px + 3px)`);
        } else {
            $('.resource-tit').css('position', 'relative');
            $("#res-download-link").removeClass('__after-scroll').addClass('__before-scroll').css('left', 'unset');
        }
    }

    // init
    handleStyle(baseBar);

    $('.resource-tit').css({
        'position': 'relative',
    });
    $('.resource-tit').append(download);

    $(download).addClass('__before-scroll');

    $(window).scroll(function () {
        handleStyle(baseBar);
    });

    const resNameNode = $('.fl-info > ul > li:nth-child(1) > strong');
    const resName = (resNameNode && resNameNode.text() || '').trim();
    //console.log('name', resName);
    const doubanQ = `https://api.douban.com/v2/movie/search?q=${resName}&start=0&count=5`;
    $.ajax({
        url: doubanQ,
        type: "GET",
        dataType: "jsonp",
        success: function (data) {
            //console.log(data);
            const { subjects, title } = data;
            if (!subjects.length) return;

            const lis = subjects.map((item) => {
                return `<li><a class="__my-link" href="${item.alt}">${item.title} (${item.year})</a></li>`;
            });
            const searchLink = `https://movie.douban.com/subject_search?search_text=${resName}`;
            const list = `<div class="__my-block"><h2 class="__douban-link">豆瓣${title}: </h2><ul class="__douban-search-result">${lis.join('')}<li class="__end"><a class="__my-link" href="${searchLink}">更多...</a></li></ul></div>`;
            $('.fr.view-right').append(list);
        }
    });
})();
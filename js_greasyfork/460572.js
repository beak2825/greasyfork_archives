// ==UserScript==
// @name         jav视频预览
// @description  在网页嵌入一个预览视频页面,因某些视频源厂商限制了日本IP访问，所以某些视频需要日本IP才能观看
// @namespace    http://tampermonkey.net/
// @version      3.0
// @author       You
// @include      /^https?:\/\/(?:[A-Za-z0-9]+\.)*(?:javbus|busjav|busfan|fanbus|buscdn|cdnbus|dmmsee|seedmm|busdmm|dmmbus|javsee|seejav){1}/
// @match        https://www.javbus.com/*
// @match        https://*/thread-*
// @match        https://*/forum.php?mod=viewthread&tid=*
// @exclude      https://www.javbus.red/
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFElEQVQ4ja2TMU4CQRSGvzfuKkQ2bqORRpKNV6CjIaGgovQK1LRs7R24AoECbrAHWE7glhQkJO4SEgt1GQsCBhmG1fjKee//8v/zZiSGJ+AZeOR3lQChxPDyB/EeIjFo28SuKSf6jk0sjoPXaHDh+6yjiDzLjmaUDaDKZe77fR4GAy5rNaNVK2DnQlwXEXOIs4Bz9f8AU85TG4CfW1AKv93mul7ndTjkfT4HETSgN5sCAK256XS47XZRlQrrKOIqCMjTlDxNjU7UoV6TTSZ8Lpfc9XoEoxFutUo6HvOxWBgdHL1EcRy8ZhOv1UKVSrzNZmTTKflqVQwA2wOBbX6trZeo2P6qQ+p3JqsYSBQQmiAFKgHCL3I+UIXeDJynAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/460572/jav%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460572/jav%E8%A7%86%E9%A2%91%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var host = 'https://javspyl.eu.org/'
    //98堂
    if (document.title.indexOf('高清中文字幕') != -1) {
        if (document.querySelector("#switchwidth").innerHTML == '切换到宽版') {
            widthauto(this);
        }
        let id = document.title.split(' ')[0];
        if (escape(id).indexOf("%u3010") > 0) {
            id = document.title.split('【')[0];
        }
        if (!/[^a-zA-Z0-9-_]/.test(id)) {
            document.querySelector("#postlist > table:nth-child(1) > tbody > tr > td.plc.ptm.pbn.vwthd > span ").innerHTML = '<br><iframe src = ' + host + id.replace('-4K', "") + ' style="width:1140px;height:642px;border:none;" allowfullscreen></iframe>'
        }
    }
    //javbus
    if (document.querySelector("body > nav > div > div.navbar-header.mh50 > a > img.hidden-xs")) {
        GM_addStyle(`
        #waterfall > div > a > div.photo-frame{
            position: relative;
            cursor: default;
        }
        #yulan{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAYhJREFUaEPt2cErRFEUBvDv+0MsbP0H8s+xpCxoUmShlCyUslA2ShksbJSyUBJKKQtlY6GnU+eUZMwdc++776t561fv+8158+695xDiF8XzYwKoXcGhFWiaZgbABoA5AH0APZK7tYPH81MAZwBmfwTeAbBE8qo2JAXQDAj5bgiHfNSCjAOIzJcAFknu1UDkAETuba/GdZuQnADL/eavlVXksw1IbkBkvvBq7JdGlAJE7i2H3JSClAZY7ldH2Bcr+9UGIELbImhrx0FORZuAyL3pkNsckBoAy/3iiOVxEbUAkfvEIYf/hdQGRO51h9yNCukKwHI/+5ZkZRRElwCR+9ircZQC6SIgcq95RR7+gnQZYLkfvRq9QYiuAyL3PMmF3xAqgCeSU8qAe5LTygDZV0j6Tyz7GZVdyKS3ErKbOdnttPSBRvZIKXuol26ryDa2ZFuL0s1d2fa67IBDZsR06hPK7wciqSGfjVlt9bRJ5TmAVakxa0pzqeY9Q7sSNcOlPHsCSPmVSt7zBVQT8DFIGYGwAAAAAElFTkSuQmCC') no-repeat center;
            display: none;
            cursor: pointer;
            background-color: #323232b3;
        }
        #javspyl_iframe{
            position: fixed;
            width: 100%;
            height: 100%;
            background-color: #000000ab;
            top: 0;
            z-index: 900;
            display: none;
        }
        #javspyl_iframe iframe{
            width: 70%;
            height: 80%;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
            border:none;
            box-shadow: 0px 0px 7px 13px rgb(0 0 0 / 47%);
        }
        `);
        let fpb = () => {
            document.querySelector("#navbar > ul:nth-child(2)").innerHTML = document.querySelector("#navbar > ul:nth-child(2)").innerHTML + '<li class="hidden-sm"><a href=' + host + ' target="_blank"><font style="vertical-align: inherit;">防屏蔽地址</font></a></li>'
        }
        let id = window.location.href.split('/').pop()
        let hreflength = window.location.href.split('/').length

        let play = (date) => {
            $('#javspyl_iframe').fadeIn(200)
            $('#javspyl_iframe iframe').attr('src', date)
        }
        let out = () => {
            $('#javspyl_iframe iframe').attr('src', 'about:blank')
            $('#javspyl_iframe').fadeOut(200)
        }

        if (hreflength === 4 && id && id != 'uncensored' && id != 'en' && id != 'ko' && id != 'ja') {
            fpb()
            $('.screencap').append('<div id="yulan" style="display: block;background-color: #0000008c;width: 50px;height: 50px;"></div>');
            $('body').append('<div id="javspyl_iframe"><iframe allowfullscreen></iframe></div>');

            $("#yulan").click((e) => {
                play(host + id)
            });
            $("#javspyl_iframe").click((e) => {
                out()
            });
        } else {
            fpb()
            $('.photo-frame').append('<div class="Out" id="yulan"></div>');
            $('body').append('<div id="javspyl_iframe"><iframe allowfullscreen></iframe></div>');
            $('#waterfall > div > a > div.photo-frame').mouseenter((e) => {
                e.currentTarget.lastElementChild.className = 'in'
                $('.in').fadeIn(200)
            })
            $('#waterfall > div > a > div.photo-frame').mouseleave((e) => {
                e.currentTarget.lastElementChild.className = 'Out'
                $('.Out').fadeOut(200)
            })
            $(".Out").click((e) => {
                e.preventDefault();
                id = e.currentTarget.parentElement.parentElement.href.split('/').pop()
                play(host + id)
            });
            $("#javspyl_iframe").click((e) => {
                out()
            });
        }
    }
})();
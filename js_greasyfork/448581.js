
// ==UserScript==
// @name         Vdownload
// @name:zh-CN   下载器(个人使用)
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  音视频下载器
// @author       浣熊
// @match        *://*/*
// @exclude      *://*.runoob.com/*
// @exclude      *://mail.qq.com/*
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       document-start
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.2.2/jquery.min.js
// @license      https://github.com/1024Vip/Vdownload/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/448581/Vdownload.user.js
// @updateURL https://update.greasyfork.org/scripts/448581/Vdownload.meta.js
// ==/UserScript==

(function () {
    window.autoDownload = 0;
    window.isComplete = 0;
    window.audio = [];
    window.video = [];
    window.downloadAll = 0;
    window.quickPlay = 1.0;
    var isDelTabPage = 0; //1关闭；
    var downloadName = document.title;
    var isVideo = 0;//1存在视频
    var loadTrue = false;
    function Insertstyle(css, ref) {
        var insertAt, head, style;
        void 0 === ref && (ref = {}), insertAt = ref.insertAt, css && "undefined" != typeof document && (head = document.head || document.getElementsByTagName("head")[0],
                                                                                                         (style = document.createElement("style")).type = "text/css", "top" === insertAt && head.firstChild ? head.insertBefore(style, head.firstChild) : head.appendChild(style),
                                                                                                         style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css)));
    }
    function XF() {
        let parentID = 'VdownLoad-nav';
        //鼠标移动
        var scrollMove = function () {
            window.onscroll = window.onload = function () {
                var scrollsidebar = document.getElementById(parentID);
                var scrolltop = document.body.scrollTop || document.documentElement.scrollTop;
                startMove(
                    parseInt(
                        (document.documentElement.clientHeight -
                         scrollsidebar.offsetHeight) / 2 + scrolltop
                    )
                );
            };
        };
        //获取元素
        var dv = document.getElementById(parentID);
        var x = 0;
        var y = 0;
        var l = 0;
        var t = 0;
        var isDown = false;
        //鼠标按下事件
        dv.onmousedown = function (e) {
            //获取x坐标和y坐标
            x = e.clientX;
            y = e.clientY;

            //获取左部和顶部的偏移量
            l = dv.offsetLeft;
            t = dv.offsetTop;
            //开关打开
            isDown = true;
            //设置样式
            dv.style.cursor = 'move';
        }
        //鼠标移动
        dv.onmousemove = function (e) {
            if (isDown == false) {
                return;
            }
            //获取x和y
            var nx = e.clientX;
            var ny = e.clientY;
            //计算移动后的左偏移量和顶部的偏移量
            var nl = nx - (x - l);
            var nt = ny - (y - t);

            dv.style.left = nl + 'px';
            dv.style.top = nt + 'px';
        }
        //鼠标抬起事件
        dv.onmouseup = function () {
            //开关关闭
            isDown = false;
            dv.style.cursor = 'default';
        }
    };
    const SetplaybackRate = (e) => {
        var pageX = e.pageX,
            pageY = e.pageY;
        let ID = 'div_play';
        if ($('#' + ID).length > 0) {
            $('#' + ID).remove();
        }
        let SD = 1;
        if (document.querySelector('video') !== null)
            SD = document.querySelector('video').playbackRate;
        $('body').prepend(`
            <div id="${ID}" class="div_play" style="display:none">
                <input type="number" min="0" max="16" value="${SD}" id="numPlay">
                <input type="button" value="取消" onclick="$('#${ID}').fadeOut(()=>$(this).parent().remove())">
                <input type="button" value="确定" id="playSDSure"">
            </div>
        `)
        $(document).on('click', '#playSDSure', () => { playSDSure('numPlay') })
        // onclick="playSDSure('numPlay')
        let py = document.getElementById(ID);
        $(py).fadeIn();
        py.style.left = pageX + 'px';
        py.style.top = pageY + 'px';
    }
    const playSDSure = (id) => {
        let val = parseFloat($('#' + id).val());
        val = val === 0 ? 1 : val;
        if (document.querySelector('video') !== null)
            document.querySelector('video').playbackRate = val;
        console.log(val);
        $('#' + id).parent().fadeOut(() => { $(this).remove() });
    }
    const Vdown = (isDel) => {
        isDelTabPage = isDel;
        window.autoDownload = 1;
    }

    const XFrun = () => {
        var css_asd1 = `
        .div_play {
            background-color: #98cad9;
            opacity: .8;
            padding: 10px;
            border-radius: 10px;
            position: fixed;
            z-index: 999999;
        }
        html .hxaside-nav {
            -ms-text-size-adjust: 100%;
            -webkit-text-size-adjust: 100%;
            -webkit-font-smoothing: antialiased;
            font-size: 62.5%
        }

        body .hxaside-nav {
            font-family: "Helvetica Neue", Helvetica, "Microsoft YaHei", Arial, sans-serif;
            margin: 0;
            font-size: 1.6rem;
            color: #4e546b
        }

        .hxaside-nav {
            position: fixed;
            bottom: 0;
            left: -47px;
            width: 260px;
            height: 260px;
            -webkit-filter: url(#goo);
            filter: url(#goo);
            -ms-user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            user-select: none;
            opacity: .75;
            z-index: 999998
        }

        .hxaside-nav.no-filter {
            -webkit-filter: none;
            filter: none
        }

        .hxaside-nav .hxaside-menu {
            position: absolute;
            width: 70px;
            height: 70px;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            background: #65c5da;
            left: -95px;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            text-align: center;
            line-height: 70px;
            color: #fff;
            font-size: 20px;
            z-index: 1;
            cursor: move
        }

        .hxaside-nav .hxmenu-item {
            position: absolute;
            width: 60px;
            height: 60px;
            background-color: #e6b451;
            left: -95px;
            top: 0;
            right: 0;
            bottom: 0;
            margin: auto;
            line-height: 60px;
            text-align: center;
            -webkit-border-radius: 50%;
            border-radius: 50%;
            text-decoration: none;
            color: #fff;
            -webkit-transition: background .5s, -webkit-transform .6s;
            transition: background .5s, -webkit-transform .6s;
            -moz-transition: transform .6s, background .5s, -moz-transform .6s;
            transition: transform .6s, background .5s;
            transition: transform .6s, background .5s, -webkit-transform .6s, -moz-transform .6s;
            font-size: 14px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box
        }

        .hxaside-nav .hxmenu-item:hover {
            background: #a9c734
        }

        .hxaside-nav .hxmenu-line {
            line-height: 20px;
            padding-top: 10px
        }

        .hxaside-nav:hover {
            opacity: 1
        }

        .hxaside-nav:hover .hxaside-menu {
            -webkit-animation: jello 1s;
            -moz-animation: jello 1s;
            animation: jello 1s
        }

        .hxaside-nav:hover .hxmenu-first {
            -webkit-transform: translate3d(0, -135%, 0);
            -moz-transform: translate3d(0, -135%, 0);
            transform: translate3d(0, -135%, 0)
        }

        .hxaside-nav:hover .hxmenu-second {
            -webkit-transform: translate3d(120%, -70%, 0);
            -moz-transform: translate3d(120%, -70%, 0);
            transform: translate3d(120%, -70%, 0)
        }

        .hxaside-nav:hover .hxmenu-third {
            -webkit-transform: translate3d(120%, 70%, 0);
            -moz-transform: translate3d(120%, 70%, 0);
            transform: translate3d(120%, 70%, 0)
        }

        .hxaside-nav:hover .hxmenu-fourth {
            -webkit-transform: translate3d(0, 135%, 0);
            -moz-transform: translate3d(0, 135%, 0);
            transform: translate3d(0, 135%, 0)
        }

        @-webkit-keyframes jello {

            from,
            11.1%,
            to {
                -webkit-transform: none;
                transform: none
            }

            22.2% {
                -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);
                transform: skewX(-12.5deg) skewY(-12.5deg)
            }

            33.3% {
                -webkit-transform: skewX(6.25deg) skewY(6.25deg);
                transform: skewX(6.25deg) skewY(6.25deg)
            }

            44.4% {
                -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);
                transform: skewX(-3.125deg) skewY(-3.125deg)
            }

            55.5% {
                -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);
                transform: skewX(1.5625deg) skewY(1.5625deg)
            }

            66.6% {
                -webkit-transform: skewX(-.78125deg) skewY(-.78125deg);
                transform: skewX(-.78125deg) skewY(-.78125deg)
            }

            77.7% {
                -webkit-transform: skewX(0.390625deg) skewY(0.390625deg);
                transform: skewX(0.390625deg) skewY(0.390625deg)
            }

            88.8% {
                -webkit-transform: skewX(-.1953125deg) skewY(-.1953125deg);
                transform: skewX(-.1953125deg) skewY(-.1953125deg)
            }
        }

        @-moz-keyframes jello {

            from,
            11.1%,
            to {
                -moz-transform: none;
                transform: none
            }

            22.2% {
                -moz-transform: skewX(-12.5deg) skewY(-12.5deg);
                transform: skewX(-12.5deg) skewY(-12.5deg)
            }

            33.3% {
                -moz-transform: skewX(6.25deg) skewY(6.25deg);
                transform: skewX(6.25deg) skewY(6.25deg)
            }

            44.4% {
                -moz-transform: skewX(-3.125deg) skewY(-3.125deg);
                transform: skewX(-3.125deg) skewY(-3.125deg)
            }

            55.5% {
                -moz-transform: skewX(1.5625deg) skewY(1.5625deg);
                transform: skewX(1.5625deg) skewY(1.5625deg)
            }

            66.6% {
                -moz-transform: skewX(-.78125deg) skewY(-.78125deg);
                transform: skewX(-.78125deg) skewY(-.78125deg)
            }

            77.7% {
                -moz-transform: skewX(0.390625deg) skewY(0.390625deg);
                transform: skewX(0.390625deg) skewY(0.390625deg)
            }

            88.8% {
                -moz-transform: skewX(-.1953125deg) skewY(-.1953125deg);
                transform: skewX(-.1953125deg) skewY(-.1953125deg)
            }
        }

        @keyframes jello {

            from,
            11.1%,
            to {
                -webkit-transform: none;
                -moz-transform: none;
                transform: none
            }

            22.2% {
                -webkit-transform: skewX(-12.5deg) skewY(-12.5deg);
                -moz-transform: skewX(-12.5deg) skewY(-12.5deg);
                transform: skewX(-12.5deg) skewY(-12.5deg)
            }

            33.3% {
                -webkit-transform: skewX(6.25deg) skewY(6.25deg);
                -moz-transform: skewX(6.25deg) skewY(6.25deg);
                transform: skewX(6.25deg) skewY(6.25deg)
            }

            44.4% {
                -webkit-transform: skewX(-3.125deg) skewY(-3.125deg);
                -moz-transform: skewX(-3.125deg) skewY(-3.125deg);
                transform: skewX(-3.125deg) skewY(-3.125deg)
            }

            55.5% {
                -webkit-transform: skewX(1.5625deg) skewY(1.5625deg);
                -moz-transform: skewX(1.5625deg) skewY(1.5625deg);
                transform: skewX(1.5625deg) skewY(1.5625deg)
            }

            66.6% {
                -webkit-transform: skewX(-.78125deg) skewY(-.78125deg);
                -moz-transform: skewX(-.78125deg) skewY(-.78125deg);
                transform: skewX(-.78125deg) skewY(-.78125deg)
            }

            77.7% {
                -webkit-transform: skewX(0.390625deg) skewY(0.390625deg);
                -moz-transform: skewX(0.390625deg) skewY(0.390625deg);
                transform: skewX(0.390625deg) skewY(0.390625deg)
            }

            88.8% {
                -webkit-transform: skewX(-.1953125deg) skewY(-.1953125deg);
                -moz-transform: skewX(-.1953125deg) skewY(-.1953125deg);
                transform: skewX(-.1953125deg) skewY(-.1953125deg)
            }
        }

        .animated {
            -webkit-animation-duration: 1s;
            -moz-animation-duration: 1s;
            animation-duration: 1s;
            -webkit-animation-fill-mode: both;
            -moz-animation-fill-mode: both;
            animation-fill-mode: both
        }

        @-webkit-keyframes divhxUp {

            from,
            60%,
            75%,
            90%,
            to {
                -webkit-animation-timing-function: cubic-bezier(0.215, .61, .355, 1);
                animation-timing-function: cubic-bezier(0.215, .61, .355, 1)
            }

            from {
                opacity: 0;
                -webkit-transform: translate3d(0, 800px, 0);
                transform: translate3d(0, 800px, 0)
            }

            60% {
                opacity: 1;
                -webkit-transform: translate3d(0, -20px, 0);
                transform: translate3d(0, -20px, 0)
            }

            75% {
                -webkit-transform: translate3d(0, 10px, 0);
                transform: translate3d(0, 10px, 0)
            }

            90% {
                -webkit-transform: translate3d(0, -10px, 0);
                transform: translate3d(0, -10px, 0)
            }

            to {
                -webkit-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0)
            }
        }

        @-moz-keyframes divhxUp {

            from,
            60%,
            75%,
            90%,
            to {
                -moz-animation-timing-function: cubic-bezier(0.215, .61, .355, 1);
                animation-timing-function: cubic-bezier(0.215, .61, .355, 1)
            }

            from {
                opacity: 0;
                -moz-transform: translate3d(0, 800px, 0);
                transform: translate3d(0, 800px, 0)
            }

            60% {
                opacity: 1;
                -moz-transform: translate3d(0, -20px, 0);
                transform: translate3d(0, -20px, 0)
            }

            75% {
                -moz-transform: translate3d(0, 10px, 0);
                transform: translate3d(0, 10px, 0)
            }

            90% {
                -moz-transform: translate3d(0, -5px, 0);
                transform: translate3d(0, -5px, 0)
            }

            to {
                -moz-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0)
            }
        }

        @keyframes divhxUp {

            from,
            60%,
            75%,
            90%,
            to {
                -webkit-animation-timing-function: cubic-bezier(0.215, .61, .355, 1);
                -moz-animation-timing-function: cubic-bezier(0.215, .61, .355, 1);
                animation-timing-function: cubic-bezier(0.215, .61, .355, 1)
            }

            from {
                opacity: 0;
                -webkit-transform: translate3d(0, 800px, 0);
                -moz-transform: translate3d(0, 800px, 0);
                transform: translate3d(0, 800px, 0)
            }

            60% {
                opacity: 1;
                -webkit-transform: translate3d(0, -20px, 0);
                -moz-transform: translate3d(0, -20px, 0);
                transform: translate3d(0, -20px, 0)
            }

            75% {
                -webkit-transform: translate3d(0, 10px, 0);
                -moz-transform: translate3d(0, 10px, 0);
                transform: translate3d(0, 10px, 0)
            }

            90% {
                -webkit-transform: translate3d(0, -5px, 0);
                -moz-transform: translate3d(0, -5px, 0);
                transform: translate3d(0, -5px, 0)
            }

            to {
                -webkit-transform: translate3d(0, 0, 0);
                -moz-transform: translate3d(0, 0, 0);
                transform: translate3d(0, 0, 0)
            }
        }

        .divhxUp {
            -webkit-animation-name: divhxUp;
            -moz-animation-name: divhxUp;
            animation-name: divhxUp;
            -webkit-animation-delay: 1s;
            -moz-animation-delay: 1s;
            animation-delay: 1s
        }
        .MsgQB{
            position: fixed;
            border-radius: 10px;
            padding:10px;
            opacity:.8;
            left:-1px;
            bottom: 80%;
            // animation:pf 5s;
            z-index: 999999;
        }
        @keyframes pf{
            0%   {bottom:0;}
            10%  {bottom:80%;}
            80%  {bottom:80%;opacity: .8;}
            88%  {opacity: .5;}
            100%  {opacity: 0;bottom:100%;}
        }
        @keyframes pfhide{
            0%   {}
            20%  {opacity: .8;}
            40%  {opacity: .6;}
            60%  {opacity: .4;}
            80%  {opacity: .2;}
            100%  {opacity: 0;bottom:100%;}
        }`;
            Insertstyle(css_asd1);
            if (loadTrue) {
                return;
            }
            if (isVideo !== 1)
                return;
            Msg('开始缓存啦');
            if (location.href.indexOf('51moot') > 0) {
                window.onblur = null;
                downloadName = $('.vedio-play-nav ul li').last().get(0).innerText
                //document.querySelector('video').playbackRate = 16.0;
            }
            $('body').prepend(`
            <div class="hxaside-nav divhxUp animated no-filter" id="VdownLoad-nav">
                <label for="" class="hxaside-menu" title="按住拖动">Videos</label>
                <a href="javascript:void(0)" title="本次关闭" id="XFclose"
                    class="hxmenu-item hxmenu-line hxmenu-first">本次<br>关闭</a>
                <a href="javascript:void(0)" id="vdown0" title="缓存进度条完成时，自动下载视频"
                    class="hxmenu-item hxmenu-line hxmenu-second">下载<br>视频</a>
                <a href="javascript:void(0)" id="vdown1" title="缓存进度条完成时，自动下载视频,并自动关闭当前页"
                    class="hxmenu-item hxmenu-line hxmenu-third">下载后<br>关闭</a>
                <a href="javascript:void(0)" title="设置播放速度" id="SetplaybackRate"
                    class="hxmenu-item hxmenu-line hxmenu-fourth">设置<br>速度</a>
            </div>
            `)
            $(document).on('click', '#XFclose', () => { let $nav = $('#VdownLoad-nav'); $nav.fadeOut(() => { loadTrue = false; $nav.remove() }) })
            $(document).on('click', '#SetplaybackRate', () => { SetplaybackRate(event) })
            $(document).on('click', '#vdown0', () => { Vdown(0) })
            $(document).on('click', '#vdown1', () => { Vdown(1) })
            XF();
        }

        XFrun();
    //----------------------------分割线----------------------------------------------



    const _endOfStream = window.MediaSource.prototype.endOfStream
    window.MediaSource.prototype.endOfStream = function () {
        window.isComplete = 1;
        return _endOfStream.apply(this, arguments)
    }
    window.MediaSource.prototype.endOfStream.toString = function () {
        //  console.log('endOfStream hook is detecting!');
        return _endOfStream.toString();
    }

    const _addSourceBuffer = window.MediaSource.prototype.addSourceBuffer
    window.MediaSource.prototype.addSourceBuffer = function (mime) {
        // console.log("MediaSource.addSourceBuffer ", mime)
        if (mime.toString().indexOf('audio') !== -1) {
            window.audio = [];
            //    console.log('audio array cleared.');
        } else if (mime.toString().indexOf('video') !== -1) {
            window.video = [];
            //    console.log('video array cleared.');
        }
        let sourceBuffer = _addSourceBuffer.call(this, mime)
        const _append = sourceBuffer.appendBuffer
        sourceBuffer.appendBuffer = function (buffer) {
            //    console.log(mime, buffer);
            if (mime.toString().indexOf('audio') !== -1) {
                window.audio.push(buffer);
            } else if (mime.toString().indexOf('video') !== -1) {
                window.video.push(buffer)
            }
            _append.call(this, buffer)
        }

        sourceBuffer.appendBuffer.toString = function () {
            //    console.log('appendSourceBuffer hook is detecting!');
            return _append.toString();
        }
        isVideo = 1;
        downloadName = document.title;
        XFrun();
        loadTrue = true;
        return sourceBuffer
    }

    window.MediaSource.prototype.addSourceBuffer.toString = function () {
        // console.log('addSourceBuffer hook is detecting!');
        return _addSourceBuffer.toString();
    }

    function download() {
        if (location.href.indexOf('51moot') > 0) {
            downloadName = $('.vedio-play-nav ul li').last().get(0).innerText
        }
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(new Blob(window.audio));
        a.download = 'audio_' + downloadName + '.mp4';
        a.click();
        a.href = window.URL.createObjectURL(new Blob(window.video));
        a.download = 'video_' + downloadName + '.mp4';
        a.click();
        Msg(downloadName+'  ,下载成功啦');
        setTimeout(()=>{Msg(downloadName+'  ,下载成功啦')},1000)
        window.downloadAll = 0;
        window.isComplete = 0;
        window.autoDownload = 0;
        if (isDelTabPage === 1) {
            closePage();
        }
    }
    function closePage() {
        if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
            window.location.href = "about:blank";
            window.close();
        } else {
            window.opener = null;
            window.open("", "_self");
            window.close();
        }
    }
    // setInterval(() => {
    //     if (window.downloadAll === 1) {
    //         download();
    //     }
    // }, 2000);

    let autoDownInterval = setInterval(() => {
        if (window.isComplete === 1 && window.autoDownload === 1) {
            download();
        }
    }, 2000);

    (function (that) {
        let removeSandboxInterval = setInterval(() => {
            if (that.document.querySelectorAll('iframe')[0] !== undefined) {
                that.document.querySelectorAll('iframe').forEach((v, i, a) => {
                    let ifr = v;
                    ifr.removeAttribute('sandbox');
                    const parentElem = that.document.querySelectorAll('iframe')[i].parentElement;
                    a[i].remove();
                    parentElem.appendChild(ifr);
                });
                clearInterval(removeSandboxInterval);
            }
        }, 1000);
    })(window);
    })();

    const ColorReverse = (OldColorValue) => {
            OldColorValue = "0x" + OldColorValue.replace(/#/g, "");
            var str = "000000" + (0xFFFFFF - OldColorValue).toString(16);
            return '#' + str.substring(str.length - 6, str.length);
        }
        const guid = () => {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        const Msg = (msgtxt) => {
            let id = guid();
            var vbo = "80%";
            $('.MsgQB').each((i, e) => {
                let bo = $(e).css("bottom").replace('px', '');
                bo = parseInt(bo) - 50;
                vbo = bo.toString() + 'px';
            })
            $('body').append('<div id="' + id + '" class="MsgQB" style="display:none;bottom:' + vbo + '">' + msgtxt + '  ヾ(•ω•`)o</div>');
            let randomColor = Math.floor(Math.random() * 16777215).toString(16);
            let $el = $('#'+id);
            $el.fadeIn().animate({"left":"10px"});
            $el.css('background', ColorReverse(randomColor)).css('color', ColorReverse(ColorReverse(randomColor))).css('box-shadow',' 0 0 5px 2px '+ColorReverse(ColorReverse(randomColor)));
            $el.get(0).addEventListener('animationend', () => {
                $el.remove();
            })
            setTimeout(() => { $el.css('animation', 'pfhide 1s') }, 4.5 * 1000)
            $el.get(0).addEventListener('animationstart', () => {
                $('.MsgQB').each((i, e) => {
                    let bo = $(e).css("bottom").replace('px', '');
                    bo = parseInt(bo) + 50;
                    $(e).animate({ "bottom": bo.toString() + 'px' })
                })
            })
        }
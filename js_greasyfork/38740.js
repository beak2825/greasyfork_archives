// ==UserScript==
// @name         yimuhe
// @namespace    https://greasyfork.org/zh-CN/scripts/38740-yimuhe
// @version      2.14.20
// @description  此程序不再维护,请使用tianteng替换https://greasyfork.org/zh-CN/scripts/498956-tianteng
//               1.去除javlibrary详情页面中下载url的重定向;高亮yimuhe的下载链接,去除名称中的链接,方便复制;添加 在javbus中查询 链接;添加磁力链
//               2.破坏torrentkitty的脚本变量引用. 原先l8l1X变量是引用window,然后给加定时器,不停地添加页面的mousedown事件,导致鼠标点击任何地方都会跳转到广告页面
//               3.给141jav每个车牌号后面加上复制按钮;添加 在JavLib中查询 链接
//               4.给javdb每个车牌号后面添加 在JavLib中查询 链接, 所有链接都添加可下载条件
//               5.javbus详情页面加上的车牌号后面添加 在JavLib中查询; 删除磁力链中的onclick事件.
//               6.去掉get.datapps.org网页点击链接后弹出广告窗口
//               7.去掉https://www.77file.com 的弹出广告
//               8.给skrbt网站添加 粘贴并搜索 按钮; 删除搜索结果页中的第一条广告;搜索结果页添加 复制磁链 和 点击磁链 按钮 
// @author       xmlspy

// @require      https://registry.npmmirror.com/jquery/3.7.1/files/dist/jquery.min.js#sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=

// @include      http*://www.hm1.lol/*

// @include      http://*.javlib.com/*
// @include      http*://*.y78k.com/*

// @include      http*:/*.torrentkitty.*/*

// @include      http*://*.141jav.com/*

// @include      http*://javdb003.com/*
// @include      http*://javdb004.com/*

// @include      http*://*.seejav.men/*
// @include      http*://*.javbus.com/*
// @include      http*://*.busfan.shop/*

// @include      http*://get.datapps.org/*
// @include      http*://www.77file.com/down/*

// @include     http*://skrbtqx.top/*

// @run-at       document-end

// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addValueChangeListener
// @grant        GM_cookie.list
// @grant        GM_cookie.set
// @grant        GM.xmlhttpRequest

// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/38740/yimuhe.user.js
// @updateURL https://update.greasyfork.org/scripts/38740/yimuhe.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.info('========= yimuhe ');

    // var jq = $.noConflict();
    let wnacgDomain = 'www.hm1.lol';
    let wnacgRegx = 'hm1\.lol';

    var javLibDomain = "y78k";
    var javLibUrl = "https://www." + javLibDomain + ".com";
    let javLibRegx = "(" + javLibDomain + "|javlib|javlibrary)";

    let javdbDomain = "javdb003";
    let javdbUrl = "https://" + javdbDomain + ".com";

    let jav141Domain = "141jav";

    let javbusDomain = "busfan";
    const javabusUrl = "https://www." + javbusDomain + ".shop";

    const datappsDomain = "datapps";
    //const datappsUrl="https://get.datapps.org";

    const file77Domain = "77file";

    const skrbtDomain = "skrbtqx";
    const skrbtHost = skrbtDomain + '.top';
    const skrbtUrl = "https://" + skrbtHost;


    class FakeCookie extends Map {
        constructor(fullCookieString) {
            super();
            this.fullCookieString = fullCookieString;
        }

        get fullCookieString() {
            let result = '';
            this.forEach((value, key, self) => {
                result = result.concat(key).concat('=').concat(value).concat(';');
            });
            return result === '' ? result : result.substring(0, result.length - 1);
        }
        set fullCookieString(str) {
            if (str) {
                let items = str.split(';');

                items.map((element, index) => element.trim())
                    .filter((element, index, self) => self.indexOf(element) === index)//去重
                    .forEach(element => {
                        const pair = element.split('=');
                        this.set(pair[0], pair[1]);
                    });
            }
        }

        /**
         * 把newCookie合并到当前实例中.如果newCookie中的key与当前的实例重复,这使用newCookie中的覆盖.
         * @param {String|FakeCookie} newCookie 要合并的新cookie,类型为String或者FakeCookie. 
         *  如果类型为String,表示包含全部cookie内容的字符串;
         */
        merge(newCookie) {
            if (!newCookie) {
                return;
            }

            let newFakeCookie;
            if ((typeof newCookie) === 'string') {
                newFakeCookie = new FakeCookie(newCookie);
            } else if (newCookie instanceof FakeCookie) {
                newFakeCookie = newCookie;
            } else {
                throw new TypeError('Invalid type.');
            }
            newFakeCookie.forEach((value, key, self) => this.set(key, value));
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// 紳士漫畫永久域名: wnacg.com紳士漫畫永久地址發佈頁: wnacg.date
    /////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * 图片按宽高比例进行自动缩放
     * @param ImgObj
     *     缩放图片源对象
     * @param maxWidth
     *     允许缩放的最大宽度
     * @param maxHeight
     *     允许缩放的最大高度
     * @usage 
     *     调用：<img src="图片" onload="javascript:DrawImage(this,300,200)">
     */
    function DrawImage(ImgObj, maxWidth, maxHeight){
        var image = new Image();
        //原图片原始地址（用于获取原图片的真实宽高，当<img>标签指定了宽、高时不受影响）
        image.src = ImgObj.src;
        // 用于设定图片的宽度和高度
        var tempWidth;
        var tempHeight;
        
        if(image.width > 0 && image.height > 0){
            //原图片宽高比例 大于 指定的宽高比例，这就说明了原图片的宽度必然 > 高度
            if (image.width/image.height >= maxWidth/maxHeight) {
                if (image.width > maxWidth) {
                    tempWidth = maxWidth;
                    // 按原图片的比例进行缩放
                    tempHeight = (image.height * maxWidth) / image.width;
                } else {
                    // 按原图片的大小进行缩放
                    tempWidth = image.width;
                    tempHeight = image.height;
                }
            } else {// 原图片的高度必然 > 宽度
                if (image.height > maxHeight) {  
                    tempHeight = maxHeight;
                    // 按原图片的比例进行缩放
                    tempWidth = (image.width * maxHeight) / image.height;      
                } else {
                    // 按原图片的大小进行缩放
                    tempWidth = image.width;
                    tempHeight = image.height;
                }
            }
            // 设置页面图片的宽和高
            ImgObj.height = tempHeight;
            ImgObj.width = tempWidth;
            // 提示图片的原来大小
            ImgObj.alt = image.width + "×" + image.height;
        }
    }
    execute(wnacgRegx, (location) => {
        console.info('=======================================' + location);
        if (location.href.includes('photos-slide-aid')) {
            const nodeToObserve = document.querySelector('#img_list');
            $(nodeToObserve).css({
                'width': '100%',
                'display': 'flex',
                'flex-wrap': 'wrap',
                'justify-content': 'flex-start',
                'overflow-x':'hidden'
            });
            const imgWidth=document.documentElement.clientWidth/2-10;
            const imgHeight=document.documentElement.clientHeight-50;
            const observer = new MutationObserver((mutations, observer) => {
                // mutations.forEach((mutation) => {
                //     if (mutation.type === 'childList') {
                //         mutation.addedNodes.forEach((addedNode) => {
                //             addedNode.querySelector('img').width='49%'
                //         });
                //     };
                //     // $('#img_list>div>img').attr({ width: '49%' });
                // });
                // $('#img_list>div>img').attr({ width: '49%' });
                $('#img_list>div').css({
                    'flex': '1',
                    'background-color': '#cacaca',
                    'margin': '0 5px 5px 0',
                    'width': 'calc((100% - 10px) / 2)',
                    'min-width': 'calc((100% - 10px) / 2)',
                    'max-width': 'calc((100% - 10px) / 2)',
                });
                $('#img_list>div>img').on('load',(e)=>{
                    DrawImage(e.target,imgWidth,imgHeight);
                });
                // $('#img_list>div>img').attr({width:'100%'});
                // $('#img_list>div>img').attr({width:'auto',height:imgHeight+'px'});
                // $('#img_list>div>img').attr({width:'auto',height:imgHeight+'px','max-height':imgHeight+'px','max-width':imgWidth+'px'});
            });
            observer.observe(nodeToObserve, {
                childList: true,
                attributes: false,
                //attributeFilter: false,
                attributeOldValue: false,
                characterData: false,
                characterDataOldValue: false,
                subtree: false
            });
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// javlibrary
    /////////////////////////////////////////////////////////////////////////////////////////////

    // javlibrary, 所有页面
    execute(javLibRegx, function (location) {
        console.info("====yimuhe====去除javlibrary [xxx所发表的文章] 页面中下载url的重定向;高亮yimuhe的下载链接");
        // 删除广告
        $('.socialmedia,#bottombanner13,#topbanner11,#sidebanner11,#leftmenu > div > ul:nth-child(2) > li:nth-child(2)').remove();

        // 调节UI
        $('#content').css('padding-top', '15px');
        $('#toplogo').css('height', '60px');

        // 添加 打开skrbt 连接
        $('.advsearch').append(`&nbsp;&nbsp;<a href="${skrbtUrl}" target="_blank">打开skrbt</a>`);
        // 添加 粘贴并搜索 按钮
        const styleMap = {};
        $('#idsearchbutton')[0].computedStyleMap().forEach((value, key) => {
            styleMap[key] = value;
        });
        const $pasteAndSearchButton = $(`<input type="button" value="粘贴并搜索" id="pasteAndSearch"></input>`);
        $pasteAndSearchButton.css(styleMap);
        $pasteAndSearchButton.click(() => {
            navigator.clipboard.readText().then((clipText) => {
                if (clipText != null && $.trim(clipText) != '') {
                    $('#idsearchbox').val(clipText);
                    $('#idsearchbutton').click();
                }
            });
        });
        $('#idsearchbutton').parent().append($pasteAndSearchButton);

        $.each($("a[href^='redirect.php?url']"), function (index, a) {
            //var origin = location.origin;
            //a.href = decodeURIComponent(a.href.replace(origin+"/cn/redirect.php?url=",""));

            var url = getQueryVariable(a, 'url');
            a.href = decodeURIComponent(url);
            if (!a.href.startsWith('https')) {
                a.href = a.href.replace("http", "https");
            }
            a.text = a.text + "    " + a.href + "      ";
            if (a.href.includes("yimuhe")) {
                $(a).parentsUntil("tr").closest('.t').css('background-color', '#6B6C83');
                a.style = 'font-size:40px;';
            } else {
                a.style = 'font-size:20px;';
            }
        });
    });

    // javlibrary, 详情 页面
    execute(javLibRegx + ".*\?v=.*", function (location) {
        console.info("====yimuhe====javlibrary详情页面中添加 在javbus中查询 链接;添加磁力链");

        // 显示搜索结果
        // 重新获取车牌号,直接使用变量会串号
        setTimeout(getSearchResultFromSkrbt, 0,
            document.querySelector("#video_id > table > tbody > tr > td.text").innerText,
            (result) => {
                console.log('error');
                console.log(result);
                // if (result.result === 0) { // 成功
                if (!result.html) {
                    result.html = "<p style='color:red'>获取磁链信息出现错误,请刷新页面!</p>"
                }
                const iframeString = `
                <iframe id="magnet_iframe" 
                    scrolling=“no"
                    framebordering='0'
                    width="100%" 
                    style="border:none;"
                   >
                </iframe>`;

                const htmlContent = `
                <!DOCTYPE html>
                <html lang="zh-CN">

                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1">

                    <link href="https://lf3-cdn-tos.bytecdntp.com/cdn/twitter-bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
                    <!--[if lt IE 9]> <script src="https://lf3-cdn-tos.bytecdntp.com/cdn/html5shiv/3.7.3/html5shiv.min.js"></script> <script src="https://lf3-cdn-tos.bytecdntp.com/cdn/respond.js/1.4.2/respond.min.js"></script><![endif]-->
                    <link rel="stylesheet" href="//b5.us.yaacdn.com/css/skrbt/style3.min.css">
                    <link rel="stylesheet" href="https://lf3-cdn-tos.bytecdntp.com/cdn/font-awesome/4.7.0/css/font-awesome.min.css">
                </head>

                <body style="margin-bottom:1px">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-6">
                                ${result.html}
                            </div>
                            <div id="right-panel" class="col-md-4 col-lg-3"></div>
                            <div class="col-md-1 col-lg-2"></div>
                        </div>
                    </div>
                </body>

                </html>`;

                const $iframe = $(iframeString);
                $iframe.attr('srcdoc', htmlContent);

                if ($('.previewthumbs:eq(0)').length > 0) {
                    $('.previewthumbs:eq(0)').after($iframe);
                } else {
                    $('#video_favorite_edit:eq(0)').after($iframe);
                }
                $iframe.before('<hr class="grey"></hr>');

                document.querySelector("#magnet_iframe").addEventListener('load', (e) => {
                    const iframeDoc = e.target.contentDocument;
                    const iframeWin = e.target.contentWindow;
                    const $container = $(iframeDoc.querySelector('.col-md-6'));
                    let buttonsHtml = '<span class="rrmiv"><button class="btn btn-danger copy" type="button">复制磁链</button></span>';
                    buttonsHtml += '<span class="rrmiv"><button class="btn btn-danger click" type="button">点击磁链</button></span>';
                    addButtonsForSkrbt(buttonsHtml, $container, el => {
                        const classValue = $(el).attr('class');
                        if (classValue.includes("copy")) {
                            return 'copy';
                        }
                        if (classValue.includes("click")) {
                            return 'click';
                        }
                        return 'other';
                    });
                    // onload="this.height=this.contentWindow.document.documentElement.scrollHeight"

                    e.target.height = e.target.contentWindow.document.documentElement.scrollHeight + 5;
                    // console.log($container);
                });

                const ifr = document.querySelector("#magnet_iframe");
                setInterval(() => ifr.height = ifr.contentWindow.document.documentElement.scrollHeight, 500);
            }
        );

        // 添加 复制车牌 按钮
        let chePai = document.querySelector("#video_id > table > tbody > tr > td.text").innerText;
        let toAppendElement = document.querySelector("#video_id > table > tbody > tr > td.text");
        appendCopyButton(chePai, toAppendElement);

        // 添加 javbus中查询 链接
        let trTag = document.querySelector("#video_id > table > tbody > tr");
        let javdbQueryId = "javdbQueryId";
        trTag.innerHTML = [trTag.innerHTML, '<td><a id="', javdbQueryId, '"href="', javabusUrl,
            '/', chePai, '">javbus中查询</a></td>'].join('');

        // 添加 打开SkrBt 链接
        $(trTag).append(['<td><a target="_blank" ', 'href="', skrbtUrl, '/search?keyword=',
            chePai, '">打开SkrBT</a></td>'].join(''));

        // 删除名称中的链接,否则很容易误点,又不容易复制文字
        const videoTitleNode = document.querySelector("#video_title > h3 > a");
        if (videoTitleNode) {
            const videoTitle = videoTitleNode.getInnerHTML();
            videoTitleNode.parentNode.innerText = videoTitle;
        }
        // #topbanner11,

    });

    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// skrbt
    /////////////////////////////////////////////////////////////////////////////////////////////
    let fakeCookie = new FakeCookie();

    function getSkrbtRequestHeaders(otherHeaderObj) {
        return $.extend({
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "max-age=0",
            "Sec-Ch-Ua": '"Chromium";v="119", "Not?A_Brand";v="24"',
            "Sec-Ch-Ua-Mobile": "?0",
            "Sec-Ch-Ua-Platform": "Windows",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.6045.160 Safari/537.36"
        }, otherHeaderObj);
    }

    function removeAdSkrbt($container) {
        $container.remove('.label.label-primary');
        $container.find('a.rrt.common-link[href^="http"]').parent().parent().remove();
    }

    function getSearchResultFromSkrbt(chepai, callback) {
        const searchUrl = `${skrbtUrl}/search?keyword=${chepai}`;

        function getResponseHeader(response, name) {
            if (response && response.responseHeaders && name) {
                // Convert the header string into an array
                // of individual headers
                var arr = response.responseHeaders.trim().split(/[\r\n]+/);

                // Create a map of header names to values
                var headerMap = {};
                arr.forEach(function (line) {
                    var parts = line.split(': ');
                    var header = parts.shift();
                    var value = parts.join(': ');
                    headerMap[header] = value;
                });

                return headerMap[name];
            }
            return null;
        }

        function onResponseHeaderRecieved(response) {
            if (response.readyState === response.HEADERS_RECEIVED) {
                console.log(response.responseHeaders);
                const setCookie = getResponseHeader(response, 'Set-Cookie');
                fakeCookie.merge(setCookie);
            }
        }

        const timeoutIds = [];
        function clearTimeouts() {
            timeoutIds.forEach(timeoutId => clearTimeout(timeoutId));
        }

        function successHandler(response, callback) {
            clearTimeouts();

            const $container = $(response.responseText).find('.col-md-6:eq(2)');
            removeAdSkrbt($container);

            const data = $.map($container.find('.list-unstyled'), item => {
                const title = $(item).find('a.rrt.common-link').text();
                const detailHref = $(item).find('a.rrt.common-link').attr('href');
                const fileSize = $(item).find('li.rrmi > span:nth-child(2)').text();
                const fileCount = $(item).find('li.rrmi > span:nth-child(3)').text();
                const timeIncluded = $(item).find('li.rrmi > span:nth-child(4)').text();
                return {
                    title: title,
                    detailHref: detailHref, //明细页面地址
                    fileSize: fileSize, // 文件总大小
                    fileCount: fileCount, // 文件总数
                    timeIncluded: timeIncluded // 收入时间
                };
            });

            // 删除无用的布局
            $container.find('p:eq(0)').remove();
            $container.find('nav').remove();

            callback({
                result: 0,
                data: data,
                html: $container.html()
            });
        }

        // 1
        GM_xmlhttpRequest({
            method: "get",
            headers: getSkrbtRequestHeaders({
                "Referer": skrbtUrl
            }),
            url: searchUrl,
            onerror: function (e) {
                console.log(e);
            },
            onload: function (response) {
                console.log(response);
                if (response.finalUrl.includes('/search?')) {
                    console.log('-----------OK');
                    successHandler(response, callback);
                } else if (response.finalUrl.includes("/challenge")) {
                    // 当前地址:
                    // https://skrbtqx.top/recaptcha/v4/challenge?url=https://skrbtqx.top&s=1
                    waitRecaptcha();

                } else {
                    console.log('错误');
                    clearTimeouts();
                    //TODO: 错误处理
                    callback({ result: 1, message: '' });
                }
            },
            onreadystatechange: onResponseHeaderRecieved
        });// end GM_xmlhttpRequest

        // 等待安全验证
        function waitRecaptcha() {
            var remain = 10;
            var startTime = new Date().getTime();

            timeoutIds.unshift(setTimeout(timeoutHandler, 1000));
            timeoutIds.unshift(setTimeout(doChallange, 1000));

            function timeoutHandler() {
                console.log('timeoutHandler');
                remain = remain - 1;
                console.log(`remain: ${remain}`);
                if (remain > 0) {
                    timeoutIds.unshift(setTimeout(timeoutHandler, 1000));
                } else {
                    doSubmit(randomString(100))
                }
            }

            function doChallange() {
                console.log('doChallange');
                var aywcUid = genOrGetAywcUid();
                var genApi = skrbtUrl + "/anti/recaptcha/v4/gen?aywcUid=" + aywcUid + "&_=" + new Date().getTime();
                GM_xmlhttpRequest({
                    method: "get",
                    responseType: GM_xmlhttpRequest.RESPONSE_TYPE_JSON,
                    headers: getSkrbtRequestHeaders({
                        "Referer": `${skrbtUrl}/recaptcha/v4/challenge?url=${skrbtUrl}&s=1`
                    }),
                    url: genApi,
                    onerror: function (e) {
                        console.log(new Date() + ": " + e);
                        timeoutIds.unshift(setTimeout(doChallange, 1000));
                        console.log(e);
                    },
                    onload: function (response) {
                        const genResult = response.response;
                        if (genResult.errno == 0) {
                            doSubmit(genResult.token);
                        } else {
                            timeoutIds.unshift(setTimeout(doChallange, 1000));
                        }
                    },
                    onreadystatechange: onResponseHeaderRecieved
                });// end GM_xmlhttpRequest
            }

            function doSubmit(token) {
                console.log('doSubmit');
                var costtime = new Date().getTime() - startTime;
                GM_xmlhttpRequest({
                    method: "get",
                    headers: getSkrbtRequestHeaders({
                        "Referer": `${skrbtUrl}/recaptcha/v4/challenge?url=${skrbtUrl}&s=1`
                    }),
                    url: `${skrbtUrl}/anti/recaptcha/v4/verify?token=${token}&aywcUid=${genOrGetAywcUid()}&costtime=${costtime}`,
                    onerror: function (e) {
                        console.log(e);
                        clearTimeouts();
                        callback({ result: 2, message: '' });
                    },
                    onload: function (response) {
                        console.log('-----doSubmit OK');
                        console.log(response);
                        if (response.finalUrl.includes('search?')) {
                            successHandler(response, callback);
                        } else {
                            console.log('错误');
                            clearTimeouts();
                            // 返回错误
                            callback({ result: 3, message: '' });
                        }
                    },
                    onreadystatechange: onResponseHeaderRecieved
                });// end GM_xmlhttpRequest
            }

            function genOrGetAywcUid() {
                const rootDomain = parseRootDomain();
                const unifyidKey = "aywcUid";
                // var aywcUid = $.cookie(unifyidKey);
                let aywcUid = fakeCookie.get(unifyidKey);
                if (isEmpty(aywcUid)) {
                    aywcUid = randomString(10) + "_" + formatDate("yyyyMMddhhmmss", new Date());
                    fakeCookie.set(unifyidKey, aywcUid);
                    // $.cookie(unifyidKey, aywcUid, {
                    //     domain: rootDomain,
                    //     path: "/",
                    //     expires: 3650
                    // })
                }
                return aywcUid
            }

            function isEmpty(x) {
                if (x == null || x == undefined || x == "") {
                    return true
                } else {
                    return false
                }
            }

            function randomString(len, charSet) {
                charSet = charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var randomString = "";
                for (var i = 0; i < len; i++) {
                    var randomPoz = Math.floor(Math.random() * charSet.length);
                    randomString += charSet.substring(randomPoz, randomPoz + 1)
                }
                return randomString
            }

            function formatDate(fmt, date) {
                var o = {
                    "M+": date.getMonth() + 1,
                    "d+": date.getDate(),
                    "h+": date.getHours(),
                    "m+": date.getMinutes(),
                    "s+": date.getSeconds(),
                    "q+": Math.floor((date.getMonth() + 3) / 3),
                    "S": date.getMilliseconds()
                };
                if (/(y+)/.test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
                }
                for (var k in o) {
                    if (new RegExp("(" + k + ")").test(fmt)) {
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
                    }
                }
                return fmt
            }

            function parseRootDomain() {
                return skrbtHost;
                // var rootDomain = skrbtHost;
                // tokens = rootDomain.split(".");
                // if (tokens.length != 1) {
                //     rootDomain = tokens[tokens.length - 2] + "." + tokens[tokens.length - 1]
                // }
                // return rootDomain
            };
        }
    }; // end getSearchResultFromSkrbt

    function 
    addButtonsForSkrbt(buttonsHtml, delegateElement, buttonTypeCallback) {
        delegateElement.find('a.rrt.common-link').after(buttonsHtml);

        delegateElement.click((event) => {
            const buttonType = buttonTypeCallback(event.target);
            if ('copy' !== buttonType && 'click' !== buttonType) {
                return;
            }
            let liNode = $(event.target).parent().parent();

            const exeButtonClick = () => {
                if ('copy' === buttonType) {
                    navigator.clipboard.writeText(liNode.find('.magnet').attr('href'));
                } else {
                    // liNode.find('.magnet').trigger('click'); //不好使
                    liNode.find('.magnet')[0].click();
                }
            };

            if (liNode.find('.magnet').length != 0) { // 磁链已经添加过
                exeButtonClick();
                return;
            }
            let detailUrl = liNode.find('a.rrt.common-link').attr('href');
            detailUrl = `${skrbtUrl}${detailUrl}`;

            //请求获取磁链
            GM_xmlhttpRequest({
                method: "get",
                headers: getSkrbtRequestHeaders({ "Referer": `${skrbtUrl}/search` }),
                url: detailUrl,
                onerror: function (e) {
                    //失败后在页面提示
                    liNode.append('<span id="errorTip">获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.</span>');
                    console.log(e);
                },
                onload: function (response) {
                    liNode.find('#errorTip').remove();
                    //成功后在页面添加磁链
                    const magnet = $(response.responseText).find('#magnet').attr('href');
                    console.log(response);
                    if (magnet) {
                        const aHtml = '<a class="magnet" href="' + magnet + '">' + magnet + '</a>';
                        liNode.append(aHtml);
                        exeButtonClick();
                    } else {
                        liNode.append('<span id="errorTip">获取磁链失败,等会儿再试一试! 若仍然有问题请刷新网页.</span>');
                    }
                }
            });// end GM_xmlhttpRequest
        });
    }

    // skrbt
    execute(skrbtDomain, (location) => {
        // 给所有页面添加 粘贴并搜索 按钮
        const html = `
        <span>&nbsp;</span>
        <span class="input-group-btn">
            <button class="btn btn-danger search-btn paste-search" type="button">
                <span class="glyphicon glyphicon-search"> 粘贴并搜索</span>
            </button> 
        </span>`;
        $('.input-group-btn').last().after(html);
        const submitButton = $('button[type="submit"]').first();
        const searchInput = $('input[name="keyword"]').first();
        $('button.paste-search').first().click(() => {
            let clipPromise = navigator.clipboard.readText();
            clipPromise.then((clipText) => {
                if (clipText != null && $.trim(clipText) != '') {
                    searchInput.val(clipText);
                    submitButton.click();
                }
            });
        });

        //搜索结果列表页面,每条结果添加 复制磁链 和 点击磁链 按钮
        if (location.href.includes("search")) {
            const $container = $('.col-md-6:eq(2)');
            removeAdSkrbt($container);

            let buttonsHtml = '<span class="rrmiv"><button class="btn btn-danger copy" type="button">复制磁链</button></span>';
            buttonsHtml += '<span class="rrmiv"><button class="btn btn-danger click" type="button">点击磁链</button></span>'
            addButtonsForSkrbt(buttonsHtml, $('.col-md-6:eq(2)'), el => {
                const classValue = $(el).attr('class');
                if (classValue && classValue.includes("copy")) {
                    return 'copy';
                }
                if (classValue && classValue.includes("click")) {
                    return 'click';
                }
                return 'other';
            });

            // 自动分页插件兼容
            const nodeToObserve = document.querySelectorAll('.col-md-6')[2];
            const observer = new MutationObserver((mutationRecords, observer) => {
                $('a.rrt.common-link').each((index, element) => {
                    if ($(element).parent().find('.btn.btn-danger.copy').length === 0) {
                        $(element).after(buttonsHtml);
                    }
                });
                //删除广告
                removeAdSkrbt($('.col-md-6:eq(2)'));
            });
            observer.observe(nodeToObserve, {
                childList: true,
                attributes: false,
                //attributeFilter: false,
                attributeOldValue: false,
                characterData: false,
                characterDataOldValue: false,
                subtree: false
            });
        }
    });

    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// javbus
    /////////////////////////////////////////////////////////////////////////////////////////////

    //javbus
    execute(javbusDomain, (location) => {
        console.info("5.给javbus每个车牌号后面加上复制按钮;添加 在JavLib中查询 链接; 删除磁力链中的onclick事件.");

        //remove ads
        $('div.ad-box').remove();

        // 调整样式
        $('.nav>li>a').attr('style', 'padding-left:8px;padding-right:8px;');

        //添加skrbt链接
        $('.nav-title.nav-inactive:last,ul.nav.navbar-nav:first')
            .append(`
                <li class="hidden-md hidden-sm">
                    <a href="${skrbtUrl}" target="_blank">打开skrbt</a>
                </li>
            `);

        // 添加 粘贴并搜索 按钮
        const $pasteAndSearchButton = $(`<button class="btn btn-default" type="submit" id="pasteAndSearch">粘贴并搜索</button>`);
        const $searchButton = $('button[type="submit"]:first');
        $pasteAndSearchButton.click(() => {
            navigator.clipboard.readText().then((value) => {
                $('#search-input:first').val(value);
                $searchButton.click();
            });
        });
        $searchButton.after($pasteAndSearchButton);
        // $('.input-group-btn:first').append($pasteAndSearchButton);

        let chePaiNode = document.querySelector("body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(1) > span:nth-child(2)");
        if (chePaiNode) { // 明细页面
            // remove ads
            $('h4:has(span#urad2),div.row:has(script[src*="jads"])').remove();
            // // 添加skrbt链接
            // $('ul.nav.navbar-nav:first')
            //     .append(`
            //         <li class="hidden-sm">
            //             <a href="${skrbtUrl}" target="_blank">**打开 skrbt**</a>
            //         </li>
            //     `);

            const chePai = chePaiNode.innerText.trim();
            const toAppendElement = document.querySelector("body > div.container > div.row.movie > div.col-md-3.info > p:nth-child(1)");

            appendCopyButton(chePai, toAppendElement);
            appendHrefJavLib(chePai, toAppendElement);

            // 删除磁力链中的onclick事件
            // var nodeToObserve = document.querySelector("#magnet-table");
            // const observer = new MutationObserver((mutations, observer) => {
            //     $('#magnet-table td').removeAttr('onclick');
            // });
            // observer.observe(nodeToObserve, {
            //     childList: true,
            //     attributes: false,
            //     //attributeFilter: false,
            //     attributeOldValue: false,
            //     characterData: false,
            //     characterDataOldValue: false,
            //     subtree: true
            // });
            setInterval(() => $('#magnet-table td').removeAttr('onclick'), 1000);
        } else if (location.href.includes('forum')) { //论坛页面
            // remove ads 
            $('div.bcpic2,div.banner728,div.frame.move-span.cl.frame-1:last').remove();
        }
    });

    execute(jav141Domain, function (location) {
        console.info("3.给141jav每个车牌号后面加上复制按钮;添加 在JavLib中查询 链接.");
        document.querySelectorAll('h5.title.is-4.is-spaced > a').forEach(function (element, index) {
            var chePai = element.innerText.trim();

            appendCopyButton(chePai, element.parentElement);
            appendHrefJavLib(chePai, element.parentElement);

            let markAsOwnerButton = document.createElement('button');
            markAsOwnerButton.dataset.type = 2;
            markAsOwnerButton.dataset.chePai = chePai;
            markAsOwnerButton.appendChild(document.createTextNode('设置为已拥有（javlib）'));
            element.parentElement.appendChild(markAsOwnerButton);
            markAsOwnerButton.onclick = function (event) {
                //debugger;
                GM_xmlhttpRequest({
                    method: "GET",
                    //responseType: "json",
                    url: javLibUrl + "/cn/vl_searchbyid.php?keyword=" + event.target.dataset.chePai,
                    onerror: function (e) {
                        console.log(e);
                    },
                    onload: function (response) {
                        if (response.status != 200) {
                            console.log("失败。。。")
                            return;
                        }

                        let finalUrl = response.finalUrl;
                        if (finalUrl.includes('vl_searchbyid.php')) {
                            console.log("有多个结果或者没有结果")
                            //有多个结果或者没有结果

                        } else {
                            // 明细页面
                            let patternAjaxid = /^var[ ]\$ajaxid.*;/m;
                            let result = patternAjaxid.exec(response.responseText);
                            let ajaxid = result[0].split('"')[1];
                            let data = "type=" + event.target.dataset.type + "&targetid=" + ajaxid;
                            //debugger;

                            GM_xmlhttpRequest({
                                method: "POST",
                                responseType: "json",
                                headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
                                url: javLibUrl + "/ajax/ajax_cv_favoriteadd.php",
                                data: data,
                                onerror: function (e) {
                                    console.log(e);
                                },
                                onload: function (response) {
                                    if (response.status != 200) {
                                        return;
                                    }
                                    let responseJson = JSON.parse(response.responseText);
                                    if (responseJson.ERROR != 1) {
                                        // 失败
                                        console.log("失败。" + response.responseText);
                                    }
                                }
                            });// end GM_xmlhttpRequest
                        }// end else
                    } // end onload
                });// end GM_xmlhttpRequest
            };
        });
    });

    execute(javdbDomain, function (location) {
        console.info("4.给javdb添加 在JavLib中查询 链接.");
        document.querySelectorAll("a.button.is-white.copy-to-clipboard").forEach(function (element, index) {
            var chePai = element.getAttribute('data-clipboard-text');
            appendHrefJavLib(chePai, element.parentElement);
        });

        console.info("javdb 每个查询链接都添加 可下载 条件");
        //document.querySelectorAll('div.tabs.is-boxed a').forEach(function(element,index){
        document.querySelectorAll('a').forEach(function (element, index) {
            console.info(index + element);
            let href = element.href;
            if (href.includes("video_codes")
                || href.includes("directors")
                || href.includes("makers")
                || href.includes("series")
                || href.includes("publishers")
                || href.includes("search")) {
                //element.href = href+"?f=download";
                element.href = appendUrlParam(href, "f=download")
            } else if (href.includes("actors")) {
                //element.href = href+"?t=d";
                element.href = appendUrlParam(href, "t=d")
            } else if (href.includes("tags")) {
                element.href = appendUrlParam(href, "c10=1")
            }
        });

        document.querySelectorAll("div.tabs.is-boxed a").forEach((element, index) => {
            let href = element.href;
            element.href = href.replace('&f=download', '');
        });
    });



    execute(datappsDomain, function (location) {
        console.info("6.去掉get.datapps.org网页点击链接后弹出广告窗口.");
        document.querySelectorAll('a[onclick="setpos();"]').forEach((element, index) => {
            element.removeAttribute("onclick");
        });
    });

    execute(file77Domain, function (location) {
        console.info("7.去掉77file网页点击链接后弹出广告窗口.");
        document.querySelectorAll('input[value="验证下载"]').forEach((element, index) => {
            element.setAttribute("onclick", "check_code();");
        });
    });



    execute("torrentkitty", (location) => {
        console.info("2.破坏torrentkitty的脚本变量引用. 原先l8l1X变量是引用window,然后给加定时器,不停地添加页面的mousedown事件,导致鼠标点击任何地方都会跳转到广告页面.");
        window.l8l1X = 1;
    });




    //////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////// 公共方法
    /////////////////////////////////////////////////////////////////////////////////////////////
    function execute(regExpString, callback) {
        var href = window.location.href;
        var pattern = new RegExp(regExpString);
        if (pattern.test(href)) {
            callback(window.location);
        } else {
            console.info("输入的参数 %s 与 %s 不匹配", regExpString, href);
        }
    }
    function appendHrefJavLib(chePai, toAppendElement) {
        var openHref = document.createElement('a');
        openHref.href = javLibUrl + "/cn/vl_searchbyid.php?keyword=" + chePai;
        openHref.target = "_blank";
        openHref.innerText = "JavLib中查询";
        toAppendElement.appendChild(openHref);
    }
    function appendCopyButton(chePai, toAppendElement) {
        var copyButton = document.createElement('button');
        copyButton.innerHTML = "复 制";
        copyButton.setAttribute('id', 'copyButton');
        toAppendElement.appendChild(copyButton);
        document.addEventListener('click', (e) => {
            if (e.srcElement.getAttribute('id') === 'copyButton') {
                //console.log(e);
                copyToClipboard(chePai);
            }

        });
        //copyButton.onclick=function(){
        //    copyToClipboard(chePai);
        //};
    }

    function getQueryVariable(anchor, variable) {
        var query = anchor.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return false;
    }
    function appendUrlParam(url, param) {
        if (url.includes("?")) {
            return url + "&" + param;
        }
        return url + "?" + param;
    }


    function copyToClipboard(text) {
        try {
            navigator.clipboard.writeText(text).then(() => {
                console.log('复制成功')
            });
        } catch {
            var textArea = document.createElement("textarea");
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.width = '2em';
            textArea.style.height = '2em';
            textArea.style.padding = '0';
            textArea.style.border = 'none';
            textArea.style.outline = 'none';
            textArea.style.boxShadow = 'none';
            textArea.style.background = 'transparent';
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();

            try {
                var successful = document.execCommand('copy');
                var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板';
                //alert(msg);
            } catch (err) {
                alert('该浏览器不支持点击复制到剪贴板');
            }

            document.body.removeChild(textArea);
        }
    }
})();
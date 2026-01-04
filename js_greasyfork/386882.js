// ==UserScript==
// @name            i-mo.oc爱摸客ADown
// @namespace       https://www.cnblogs.com/Chary/
// @version         2019.06.25
// @description     add download button on i-mo-oc Html Header to download videos
// @author          CharyGao
// @match           https://www.imooc.com/learn/*
// @grant           unsafeWindow
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// @grant           GM_openInTab
// @grant           GM_setClipboard
// @grant           GM_registerMenuCommand
// @grant           GM_addStyle
// @grant           GM_download
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/386882/i-mooc%E7%88%B1%E6%91%B8%E5%AE%A2ADown.user.js
// @updateURL https://update.greasyfork.org/scripts/386882/i-mooc%E7%88%B1%E6%91%B8%E5%AE%A2ADown.meta.js
// ==/UserScript==
// noinspection JSUnresolvedFunction: GM_getValue supplied by TamperMonkey
//<editor-fold desc="Style">
// noinspection JSUnresolvedFunction：
GM_addStyle( `
        button.ADownElementTagClass:hover {
            color: green;
        }
        .ADownElementTagClass {
            position: absolute;
            float: right;
            right: 90px;
            border: 2px dashed gray;
            height: 46px;
            border-radius: 10px;
            color: #93999f;
            font-size: 12px;
            background: transparent;
            top: 1px;
            width: 50px;
        }
       .dropdown {
            z-index: 999998;
            position: relative;
            display: inline-block;
            /*line-height: 20px;*/
            margin: 13px 0px 5px 0px;
            float: right;
            /*font-weight: bold;*/
        }
        .dropdown-content {
            margin-left: -16px;
            display: none;
            position: absolute;
            background-color: black;
            min-width: 60px;
            text-align: center;
            padding: 8px;
            border: red 1px dashed;
        }
        .dropdown:hover .dropdown-content {
            display: block;
        }
        .show{display: block;}
        .hide{display: none;}
` );
//</editor-fold>
(function () {
    'use strict';//启用严格模式
    //<editor-fold desc="0.Fields">
    let windowsNameForbidReg = /[\\/?？*"“”'‘’<>{}\[\]【】：:、^$!~`|]/g;
    let logCount = 0;
    let videoQuality = 1;//hq_mq_lq:3/2/1:高/中/低-清晰度
    let course = {};
    let isSingleDown = true;
    let downTipDiv = null;
    let downLoadFileDirFullPath = "D:\\HKPath\\HK\\HkDownloads";//file:///F:/@Installed/HkTools/M3U81.4.2/k0.m3u8
    function myLog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log( "#" + logCount++ + "ADown:", param1, param2 );
    }

    //</editor-fold>

    //<editor-fold desc="1.Enter">
    setTimeout( function () {
        try {
            if (!isLoginAndAddText()) return; //0.登录检测,严格按照顺序执行！
            getCourseInfo(); //1.获取课程信息
            loadSetting(); //2.加载个人设置
            addDownloadAssistant(); //3.添加下载助手按钮
            addDownloadButton(); //4.添加单个下载按钮
            myLog( "ADown加载完成~" );
        } catch (e) {
            myLog( 'err:', e );
        }
    }, 2000 ); //页面加载完成后延时2秒执行

    function addDownloadButton() {//4.添加下载按钮
        let aHrefsList = document.getElementsByClassName( "J-media-item" );
        if (aHrefsList === undefined || aHrefsList.length < 1) throw `addDownloadButton Err! aHrefsList${aHrefsList}`;
        //Array.prototype.forEach.call() or [].forEach.call(els, function (el) {...});
        [].forEach.call( aHrefsList, aHref => {
                let aNewDownButtonNode = document.createElement( "button" );
                aNewDownButtonNode.className = "ADownElementTagClass";
                aNewDownButtonNode.innerText = "学习";
                aNewDownButtonNode.addEventListener( "click", event => {
                    isSingleDown = true;
                    loadSetting();
                    let chapterName = aHref.parentElement.parentElement.parentElement.getElementsByTagName( "h3" )[0]
                        .innerText.trim();
                    let videoDirtyName = aHref.innerText.trim().replace( /\(\d+:\d+\)$/g, "" ).trim();
                    //videoItemATag.innerText.trim().replace( /\(\d+:\d+\)$/g, "" );
                    let thisVideo = {
                        videoNameId: videoDirtyName,
                        videoUrl: window.location.origin + aHref.getAttribute( "href" ),
                        ChapterName: chapterName,
                        CourseName: course.CourseName,
                    };
                    let video = thisVideo;
                    let isFind = false;
                    for (let i = 0; i < course.chapters.length; i++) {
                        for (let j = 0; j < course.chapters[i].videos.length; j++) {
                            let thatVideo = course.chapters[i].videos[j];
                            if (thatVideo.videoUrl === thisVideo.videoUrl
                                && thatVideo.videoNameId === thisVideo.videoNameId) {
                                video = thatVideo;
                                // myLog( "find that video!", thatVideo );
                                isFind = true;
                                break;
                            }
                        }
                        if (isFind) break;
                    }
                    // var obj=arr.find(function (obj) { return obj.id === 2})
                    if (!isFind) video.VideoIndex = 0;//未找到，不显示编号

                    let m3u8FileNameForLog = `${chapterName}_${video.videoNameId}`.replace( /\s+/g, "" );
                    myLog( `选择的课为【${m3u8FileNameForLog}】:`, video );

                    downloadVideo( m3u8FileNameForLog, video );
                    event.stopPropagation();
                } );
                aHref.parentNode.appendChild( aNewDownButtonNode );
            }
        );
    }

    function addDownloadAssistant() {//3.添加下载助手按钮
        let downTipNode = document.getElementById( "downTip" );
        let downTipBatchDown = document.getElementById( "downTipBatchDown" );
        let downTipSettings = document.getElementById( "downTipSettings" );
        showTextArea();//组装file文本
        elementHide( "ImoocADownTextDiv" );
        downTipNode.addEventListener( "click", () => {
            toggleElementHideShow( "ImoocADownTextDiv" );
        } );

        downTipBatchDown.addEventListener( "click", () => {
            isSingleDown = false;
            batchDownload();
        } );
        downTipSettings.addEventListener( "click", () => {
            showSetting();
        } );
    }

    function loadSetting() {/*2.加载个人设置*/
        // noinspection JSUnresolvedFunction : GM_getValue supplied by TamperMonkey
        videoQuality = Number( GM_getValue( "video_quality", 2 ) );
        // noinspection JSUnresolvedFunction
        downLoadFileDirFullPath = GM_getValue( "down_load_file_dir_full_path", "D:\\HKPath\\HK\\HkDownloads" );

    }

    function getCourseInfo() {//1.获取课程信息
        course = {
            courseUrl: window.location.href,
            CourseName: document.querySelector( '#main > div.course-infos > div.w > div.hd > h2' )
                .innerText.replace( windowsNameForbidReg, "" ).trim(),
            chapters: [],
            VideoTotalCount: 0,
            ChapterTotalCount: 0,
        };
        let chaptersList = document.querySelectorAll( '#main > div.course-info-main > div.content-wrap >' +
            ' div.content > div.course-chapters > div' ) || [];
        chaptersList.forEach( function (chapterItem) {
            let thisChapterName = chapterItem.getElementsByTagName( 'h3' )[0].innerText.trim();//chapterH3Tags
            let chapter = {
                CourseName: course.CourseName,
                ChapterName: thisChapterName,
                videos: [],
                ThisChapterVideoCount: 0,
            };
            let videosList = chapterItem.querySelectorAll( 'ul.video li' ) || [];
            videosList.forEach( function (videoItem) {
                let videoItemATag = videoItem.querySelector( 'a.J-media-item' );
                let videoDirtyName = videoItemATag.innerText.trim().replace( /\(\d+:\d+\)$/g, "" );
                let video = {
                    videoNameId: videoDirtyName.replace( windowsNameForbidReg, "" ).trim(),
                    videoUrl: window.location.origin + videoItemATag.getAttribute( "href" ),
                    ChapterName: chapter.ChapterName,
                    CourseName: course.CourseName,
                };
                chapter.ThisChapterVideoCount++;
                course.VideoTotalCount++;
                video.VideoIndex = course.VideoTotalCount.valueOf();
                chapter.videos.push( video );
            } );
            course.ChapterTotalCount++;
            course.chapters.push( chapter );
        } );
        myLog( "window.ADownGotCourse:", course );
        window.ADownGotCourse = course;
    }

    function isLoginAndAddText() {//0.登录检测
        let navNod = document.getElementById( 'nav' );
        if (navNod == null) throw "isLoginAndAddText loginAreaNode err!->妈的又改版了!";
        let htmlLiElement = document.createElement( "div" );
        htmlLiElement.className = "dropdown";
        htmlLiElement.innerHTML = '<a id="downTip">ADown↓</a>' +
            '<div class="dropdown-content">' +
            '<p style="color: green; margin: 2px;" id="downTipBatchDown">批量下载</p>' +
            '<p style="color: green; margin: 2px;" id="downTipSettings">设置</p>' +
            '</div>';
        navNod.appendChild( htmlLiElement );
        downTipDiv = document.getElementById( 'downTip' );
        if (downTipDiv == null) throw "isLoginAndAddText err!->妈的 downTipDiv 不见了！";
        // noinspection JSUnresolvedVariable : isLogin supplied by outside!
        if (!isLogin) {
            myLog( "need to login!" );
            downTipDiv.innerText = 'Login↓';
            downTipDiv.addEventListener( "click", function () {
                let clickEvent = document.createEvent( 'MouseEvents' );
                clickEvent.initEvent( 'click', true, true );
                document.getElementById( 'js-signin-btn' ).dispatchEvent( clickEvent );
            } );
            return false;
        }
        return true;
    }

    //</editor-fold>

    //<editor-fold desc="2.批量下载">
    function batchDownload() {
        // noinspection JSUnresolvedFunction
        GM_setClipboard( course.CourseName );//设置课程名称到剪贴板
        course.chapters.forEach( function (chapter) {
            chapter.videos.forEach( function (video) {
                let m3u8FileNameForLog = `${chapter.ChapterName}_${video.videoNameId}`.replace( /\s+/g, "" );
                downloadVideo( m3u8FileNameForLog, video );
                // noinspection StatementWithEmptyBodyJS
                //for(let t = Date.now();Date.now() - t <= 800;);//阻塞式，sleep(5000); //当前方法暂停5秒
                //return new Promise( (resolve) => setTimeout( resolve, 800 ) );//休息一下再开始，非阻塞，不可用！
            } );
        } );
    }

    function downloadVideo(m3u8FileNameForLog, video) {//Step1/4获取html内容
        fetch( video.videoUrl, {
            credentials: "include",//For CORS requests
            method: "GET",
        } ).then( response => {
            if (response.ok) {
                // myLog( `${m3u8FileNameForLog}|downloadVideo ok!${response}`, response.url );
                return response.text();
            }
            throw  response;
        } )
            .catch( error => {
                throw `${m3u8FileNameForLog}downloadVideo error!${error.url}${error}`;
            } ).then( bodyHtml => {//body
            let matchedPageInfo = bodyHtml.match( /var pageInfo = { mid : (\d+) };/ )[1];// var pageInfo = { mid : 19490 };
            let matchedOpConfigMongoId = bodyHtml.match( /OP_CONFIG.mongo_id="(\w+)";/ )[1];// OP_CONFIG.mongo_id="5ce28b95e420e56b038b456a";
            let matchedVideoTitle = bodyHtml.match( /var videoTitle = "(.*?)";/ )[1];// var videoTitle = "1-1 课程介绍及学习前须知";
            // let matchedVideoId = body.match( /var video_id= (\d+);/ )[1];// var video_id= 18727;
            // let matchedCourseId = body.match( /var course_id = (\d+);/ )[1];// var course_id = 1130;
            // let matchedChapterId = body.match( /var chapter_id = (\d+);/ )[1];// var chapter_id = 5495;
            // let matchedIsPreview = body.match( /var ispreview ='(\d+)';/ )[1];// var ispreview ='0';
            // let matchedOpConfigPage = body.match( /OP_CONFIG.page="([\w.]+)";/ )[1];// OP_CONFIG.page="video2.4";
            // myLog( `${m3u8FileNameForLog} matchedPageInfo`, matchedPageInfo );
            // myLog( `${m3u8FileNameForLog} matchedOpConfigMongoId`, matchedOpConfigMongoId );
            // myLog( `${m3u8FileNameForLog} matchedVideoId`, matchedVideoId );
            // myLog( `${m3u8FileNameForLog} matchedCourseId`, matchedCourseId );
            // myLog( `${m3u8FileNameForLog} matchedChapterId`, matchedChapterId );
            // myLog( `${m3u8FileNameForLog} matchedIsPreview`, matchedIsPreview );
            // myLog( `${m3u8FileNameForLog} matchedVideoTitle`, matchedVideoTitle );
            // myLog( `${m3u8FileNameForLog} matchedOpConfigPage`, matchedOpConfigPage );
            video.Title = matchedVideoTitle.trim();
            getM3u8DownloadUrls( matchedPageInfo, matchedOpConfigMongoId, m3u8FileNameForLog, video );
        } );
    }

    function getM3u8DownloadUrls(pageInfo, opConfigMongoId, m3u8FileNameForLog, video) {//step2/4获取三个M3u8下载地址
        fetch( `https://www.imooc.com/course/playlist/${pageInfo}?t=m3u8&_id=${opConfigMongoId}&cdn=aliyun1`,
            //https://www.imooc.com/course/playlist/19490?t=m3u8&_id=5ce28b95e420e56b038b456a&cdn=aliyun1
            {
                credentials: "include",//For CORS requests
                method: "GET",
            } ).then( response => {
            if (response.ok) {
                // myLog( `${m3u8FileNameForLog}|getM3u8DownloadUrls ok!`, response.url );
                return response.json();
            }
            throw  response;
        } ).catch(
            error => {
                throw `${m3u8FileNameForLog}|getM3u8DownloadUrls error!${error}`;
            } ).then( m3u8UrlsCipherJson => {
            if (!m3u8UrlsCipherJson.data || !m3u8UrlsCipherJson.data.info) throw `return empty!${JSON.stringify( m3u8UrlsCipherJson )}`;

            let decryptUrlsString = decryptDefault( m3u8UrlsCipherJson.data.info );
            // myLog( `${m3u8FileNameForLog}|返回的下载地址decryptUrlsString：`, decryptUrlsString );
            let regExp = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
            regExp.lastIndex = 0;
            video.m3u8Urls = [];
            while (true) {
                let groupVideos = regExp.exec( decryptUrlsString );
                if (groupVideos == null) break;
                // myLog( groupVideos );
                video.m3u8Urls.push( {
                    M3u8Index: groupVideos[1],
                    Url: groupVideos[2],
                } );
            }
            // myLog( `${m3u8FileNameForLog}|m3u8地址1：`, JSON.stringify( video.m3u8Urls ) );
            video.m3u8Urls = jsonSort( video.m3u8Urls, "M3u8Index", false );//确保3/2/1:高/中/低videoQuality = 2;//hq_mq_lq:3/2/1:高/中/低-清晰度
            // myLog( `${m3u8FileNameForLog}|m3u8地址2：`, JSON.stringify( video.m3u8Urls ) );
            let selectedQualityM3u8DownloadUrl = video.m3u8Urls[videoQuality - 1].Url;
            // myLog( `${m3u8FileNameForLog}|3/2/1:高/中/低videoQuality=${videoQuality}：`, selectedQualityM3u8DownloadUrl );
            getM3u8Contents( selectedQualityM3u8DownloadUrl, m3u8FileNameForLog, video );
        } );
    }

    function getM3u8Contents(m3u8FileUrl, m3u8FileNameForLog, video) {//step3/4getOneKindLevelM3u8ContentAndKeyUrl//获取m3u8内容
        fetch( m3u8FileUrl, {
            credentials: "include",//For CORS requests
            method: "GET",
        } ).then( response => {
            if (response.ok) {
                // myLog( `${m3u8FileNameForLog}|getM3u8Contents ok!`, response.url );
                return response.json();
            }
            throw  response;
        } ).catch(
            error => {
                throw `${m3u8FileNameForLog}getM3u8Contents error!${error}`;
            } ).then( m3u8ContentCipherJson => {
                if (!m3u8ContentCipherJson.data || !m3u8ContentCipherJson.data.info) throw `return empty!${JSON.stringify( m3u8ContentCipherJson )}`;

                let decryptContentString = decryptDefault( m3u8ContentCipherJson.data.info );
                let regExp = /#EXT-X-KEY:METHOD=AES-128,URI="(.*?)"/g;
                //regExp.lastIndex = 0;
                video.m3u8KeyUrl = regExp.exec( decryptContentString )[1];//"";
                // while (true) {
                //     let m3u8KeyUrl = regExp.exec( decryptContentString );
                //     if (m3u8KeyUrl == null) {
                //         break;
                //     }
                //     myLog( m3u8KeyUrl );
                //     video.m3u8KeyUrl = m3u8KeyUrl[1];
                // }

                // myLog( `${m3u8FileNameForLog}|m3u8内容：\n`, decryptContentString );
                // myLog( `${m3u8FileNameForLog}|m3u8keyUrl：\n`, video.m3u8KeyUrl );
                regExp.lastIndex = 0;//先置零，方便后一步骤调用
                getM3u8Key( decryptContentString, regExp, m3u8FileNameForLog, video )
            }
        );
    }

    function getM3u8Key(decodeContent, keyMatchRegExp, m3u8FileNameForLog, video) {//step4/4getM3u8Key//获取密钥
        fetch( video.m3u8KeyUrl, {
            credentials: "include",//For CORS requests
            method: "GET",
        } ).then( response => {
            if (response.ok) {
                // myLog( `${m3u8FileNameForLog}|getM3u8Key ok!`, response.url );
                return response.json();
            }
            throw  response;
        } ).catch(
            error => {
                throw `${m3u8FileNameForLog}getM3u8Key error!${error}`;
            } ).then( m3u8KeyCipherJson => {
            if (!m3u8KeyCipherJson.data || !m3u8KeyCipherJson.data.info) throw `return empty!${JSON.stringify( m3u8KeyCipherJson )}`;
            // myLog( `${m3u8FileNameForLog}|m3u8key返回的加密内容：\n`, m3u8KeyCipherJson );
            let decryptKeyString = decryptDefault( m3u8KeyCipherJson.data.info );
            // myLog( `${m3u8FileNameForLog}|m3u8key内容：\n`, decryptKeyString );
            video.base64KeyString = base64Encode( decryptKeyString );
            let finalDecodeContent = decodeContent.replace( keyMatchRegExp, `#EXT-X-KEY:METHOD=AES-128,URI="base64:${video.base64KeyString}"` );
            // myLog( `${m3u8FileNameForLog}\n`, finalDecodeContent );
            let downLoadM3u8FileName = `${video.VideoIndex}${video.CourseName}-${video.ChapterName}-${video.Title}`
                .replace( windowsNameForbidReg, "" ).replace( /\s+/g, "" ).trim();
            switch (videoQuality) {//确保3/2/1:高/中/低videoQuality = 2;//hq_mq_lq:3/2/1:高/中/低-清晰度
                case  3:
                    downLoadM3u8FileName += ".hq.m3u8";
                    break;
                case  2:
                    downLoadM3u8FileName += ".mq.m3u8";
                    break;
                case  1:
                    downLoadM3u8FileName += ".lq.m3u8";
                    break;
            }
            if (isSingleDown) {//== null
                // myLog( downLoadM3u8FileName, "正在下载！" );
                sendDownloadTextToM3u8( downLoadM3u8FileName );
                exportRaw( downLoadM3u8FileName, finalDecodeContent );
            } else {//批量下载
                myLog( downLoadM3u8FileName, "批量下载->正在下载！" );
                video.DownLoadM3u8FileName = downLoadM3u8FileName;
                video.FinalDecodeContent = finalDecodeContent;
                callM3u8ContentToFileServices( m3u8FileNameForLog, video );
            }
        } );
    }

    //</editor-fold>

    //<editor-fold desc="3.加解密">
    //<editor-fold desc="密盘">
    const functionsMap = {
        k: function o(source, password) {
            let newSource = "", sSize = source.length, pSize = password.length;
            if ("object" == typeof source) source.forEach( currentChar => newSource += String.fromCharCode( currentChar ) );
            source = newSource || source;//拼接字符串

            const result = new Uint8Array( sSize );
            // document.write( `k source:${source}<br />` );
            for (let i = 0; i < sSize; i++) result[i] = source[i].toString().charCodeAt( 0 );

            for (let i = 0; i < sSize; i++) {//短路运算
                //&& 表达式中有条件为false的表达式，返回第一个条件为false的表达式的值。没有则返回最后一个表达式的值。[找false]
                //|| 表达式中有条件为true的表达式，返回第一个条件为true的表达式的值。没有则返回最后一个表达式的值。[找true]
                /*                if (0 !== (mod5 = result[i] % 5) && 1 !== mod5 && i + mod5 < result.length &&
                                  (
                                      tempChar = result[i + 1],
                                          index2 = i + 2,
                                          result[i + 1] = result[i + mod5],
                                          result[mod5 + i] = tempChar,
                                      (i = i + mod5 + 1) - 2 > index2
                                  )
                              )
                                  for (; index2 < i - 2; index2++) result[index2] = result[index2] ^ password.charCodeAt( index2 % password.length );*/
                let mod5 = result[i] % 5;//余数0-4；
                if (mod5 > 1 && i + mod5 < result.length) {
                    let afterNext = i + 2;

                    //<editor-fold desc="交换[i + 1]与[mod5 + i]">
                    let tmp = result[i + 1];
                    result[i + 1] = result[i + mod5];//移序
                    result[mod5 + i] = tmp;
                    //</editor-fold>

                    i = i + mod5 + 1;
                    while (afterNext < i - 2) {
                        result[afterNext] = result[afterNext] ^ password.charCodeAt( afterNext % pSize );

                        afterNext++;
                    }
                }
            }
            for (let i = 0; i < sSize; i++) result[i] = result[i] ^ password.charCodeAt( i % pSize );
            return result;
        },
        q: function r(source, password) {
            let newSource = "", sSize = source.length, pSize = password.length;
            if ("object" == typeof source) source.forEach( currentChar => newSource += String.fromCharCode( currentChar ) );
            source = newSource || source;//拼接字符串

            let result = new Uint8Array( sSize );
            // document.write( `q source:${source}<br />` );
            for (let i = 0; i < sSize; i++) result[i] = source[i].toString().charCodeAt( 0 ) ^ password.charCodeAt( i % pSize );

            return result;
        },
        h: function n(source) {

            let newSource = "", sSize = source.length;
            if ("object" == typeof source) source.forEach( currentChar => newSource += String.fromCharCode( currentChar ) );

            source = newSource || source;
            const result = new Uint8Array( sSize );
            //document.write( `h：sourceString:${source}<br />` );
            for (let i = 0; i < sSize; i++) result[i] = source[i].toString().charCodeAt( 0 );

            for (let i = 0; i < sSize; i++) {//result.length=sSize
                let mod3 = result[i] % 3;
                if (0 !== mod3 && i + mod3 < sSize) {//result.length
                    //<editor-fold desc="交换[i + 1]与[i + mod3]">
                    let tmp = result[i + 1];
                    result[i + 1] = result[i + mod3];
                    result[i + mod3] = tmp;
                    //</editor-fold>
                    i = i + mod3 + 1;
                }
            }
            return result;
        },
        m: function i(source) {
            let newSource = "", sSize = source.length;
            if ("object" == typeof source) source.forEach( currentChar => newSource += String.fromCharCode( currentChar ) );

            source = newSource || source;
            const mResult = new Uint8Array( sSize );
            // document.write( `m：sourceString:${source}<br />` );
            for (let i = 0; i < sSize; i++) mResult[i] = source[i].toString().charCodeAt( 0 );

            let rSize = 0;
            for (let i = 0; i < sSize; i++) {//mResult.length = sSize
                mResult[i] % 2 && i++;//间隔1个取
                rSize++;
            }
            const result = new Uint8Array( rSize );
            for (let i = 0, j = 0; i < sSize; i++) result[j++] = mResult[i] % 2 ? mResult[i++] : mResult[i];
            return result;
        },

    };

    //</editor-fold>
    function decryptDefault(data, isReturnArray) {

        //<editor-fold desc="0.属性定义">
        const aResultObj = {data: {info: data}};
        let lastDataCopy = data, used4cArray = lastDataCopy.substring( lastDataCopy.length - 4 ).split( "" );//截取后4位
        // document.write( `---------org[${lastDataCopy.length}]:${lastDataCopy}<br />` );
        //</editor-fold>

        //<editor-fold desc="1.获取第一次keyChar">
        used4cArray.forEach( (currentItem, index, theArray) => theArray[index] = currentItem.toString().charCodeAt( 0 ) % 4 );//指定位置上字符的 Unicode 编码,余4;
        used4cArray.reverse();//反转,第一次取位
        // document.write( `反转:${used4cArray}<br />` );
        //</editor-fold>

        //<editor-fold desc="2.获取加密key轮盘">
        aResultObj.data.encrypt_table = [];//加密key轮盘
        used4cArray.forEach( function (keyChar) {//选定位置的字符作为密钥，并从原字符中移除（剔除4个字符）
            aResultObj.data.encrypt_table.push( lastDataCopy.substring( keyChar + 1, keyChar + 2 ) );
            lastDataCopy = lastDataCopy.substring( 0, keyChar + 1 ) + lastDataCopy.substring( keyChar + 2 );
        } );
        // document.write( `encryptTable:${aResultObj.data.encrypt_table}<br />` );
        // document.write( `EncryptTable[${lastDataCopy.length}]:${lastDataCopy}<br />` );
        //</editor-fold>

        //<editor-fold desc="3.根据加密轮盘获得解密的key矩阵">
        aResultObj.data.key_table = [];
        aResultObj.data.encrypt_table.forEach( function (curEncryptKeyChar) {
            //for(var c in a.data.encrypt_table)
            if ("q" !== curEncryptKeyChar && "k" !== curEncryptKeyChar) return;//4个字符中，不是q，k，跳过。
            // ("q" != a.data.encrypt_table[c] && "k" != a.data.encrypt_table[c]) ||
            // (a.data.key_table.push( l.substring( l.length - 12 ) ), l = l.substring( 0, l.length - 12 ));//短路运算
            aResultObj.data.key_table.push( lastDataCopy.substring( lastDataCopy.length - 12 ) );
            lastDataCopy = lastDataCopy.substring( 0, lastDataCopy.length - 12 );//有N个q，k，原串减少N*12个字符；
        } );
        aResultObj.data.key_table.reverse();//反转,第二次取位
        // document.write( `keyTable:${aResultObj.data.key_table}<br />` );
        // document.write( `----KeyTable[${lastDataCopy.length}]:${lastDataCopy}<br />` );
        //</editor-fold>

        //<editor-fold desc="4.4种解密算法">
        aResultObj.data.info = (source => {
            const tableFetch = [
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59,
                60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42,
                43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
            ];
            let isEndCharFromFetch, reEndCharFromFetch, nextChar, increaseChar, order, sourceLength = source.length,
                securityCode = "";
            for (order = 0; order < sourceLength;) {//分4端；

                do {
                    isEndCharFromFetch = tableFetch[255 & source.charCodeAt( order++ )]
                } while (order < sourceLength && -1 === isEndCharFromFetch);
                if (-1 === isEndCharFromFetch) break; //碰到暗装，跳出！

                do {
                    reEndCharFromFetch = tableFetch[255 & source.charCodeAt( order++ )];
                } while (order < sourceLength && -1 === reEndCharFromFetch);
                if (-1 === reEndCharFromFetch) break;//碰到暗装，跳出！

                securityCode += String.fromCharCode( isEndCharFromFetch << 2 | (48 & reEndCharFromFetch) >> 4 );

                do {
                    if (61 === (nextChar = 255 & source.charCodeAt( order++ ))) return securityCode;
                    nextChar = tableFetch[nextChar];
                } while (order < sourceLength && -1 === nextChar);
                if (-1 === nextChar) break;//碰到暗装，跳出！

                securityCode += String.fromCharCode( (15 & reEndCharFromFetch) << 4 | (60 & nextChar) >> 2 );

                do {
                    if (61 === (increaseChar = 255 & source.charCodeAt( order++ ))) return securityCode;
                    increaseChar = tableFetch[increaseChar];
                } while (order < sourceLength && -1 === increaseChar);
                if (-1 === increaseChar) break;

                securityCode += String.fromCharCode( (3 & nextChar) << 6 | increaseChar );
            }
            return securityCode
        })( lastDataCopy );
        //CryptoJS.enc.Utf8.stringify( CryptoJS.enc.Base64.parse( dataCopy ) );
        //根据加密轮盘找到对饮解密算法：至少四种算法，其中一种是Base64；
        //</editor-fold>

        //<editor-fold desc="5.拼接，返回结果">
        aResultObj.data.encrypt_table.forEach( functionChar => {
            if ("q" === functionChar || "k" === functionChar) {//对应不同的加密算法
                const password = aResultObj.data.key_table.pop();
                // document.write( `password:${password}<br />` );//解密 拼接 不懂解密后的字符串
                aResultObj.data.info = functionsMap[functionChar]( aResultObj.data.info, password );
            } else {
                aResultObj.data.info = functionsMap[functionChar]( aResultObj.data.info );
            }
        } );
        // document.write( `DataInfo:${aResultObj.data.info}<br />` );

        if (isReturnArray) return aResultObj.data.info;

        let gotUtf8CharString = "";
        aResultObj.data.info.forEach( char => gotUtf8CharString += String.fromCharCode( char ) );
        return gotUtf8CharString;
        //</editor-fold>
    }

    function base64Encode(str) {
        const base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        let out = "", i = 0, len = str.length;
        let c1, c2, c3;

        while (i < len) {
            c1 = str.charCodeAt( i++ ) & 0xff;
            if (i === len) {
                out += base64EncodeChars.charAt( c1 >> 2 );
                out += base64EncodeChars.charAt( (c1 & 0x3) << 4 );
                out += "==";
                break;
            }
            c2 = str.charCodeAt( i++ );
            if (i === len) {
                out += base64EncodeChars.charAt( c1 >> 2 );
                out += base64EncodeChars.charAt( ((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4) );
                out += base64EncodeChars.charAt( (c2 & 0xF) << 2 );
                out += "=";
                break;
            }
            c3 = str.charCodeAt( i++ );
            out += base64EncodeChars.charAt( c1 >> 2 );
            out += base64EncodeChars.charAt( ((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4) );
            out += base64EncodeChars.charAt( ((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6) );
            out += base64EncodeChars.charAt( c3 & 0x3F );
        }
        return out;
    }

    //</editor-fold>

    //<editor-fold desc="4.UtilitiesFunction">
    function callM3u8ContentToFileServices(m3u8FileNameForLog, video) {
        fetch( "http://127.0.0.1:3000/saveM3u8Files", {
            //credentials: "include",//For CORS requests//跨域请求。
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",//Content-Type: application/json
            },
            body: JSON.stringify( video ),
        } ).then( response => {
            if (response.ok) {
                // myLog( `${m3u8FileNameForLog}|callM3u8ContentToFileServices ok!${response}`, response.url );
                return response.text();
            }
            throw  response;
        } ).catch( error => {
            throw `${m3u8FileNameForLog}callM3u8ContentToFileServices error!${error}`;
        } ).then( bodyHtml => {//body
            document.getElementById( "ImoocADownTextArea" ).append( bodyHtml.toString() );//生成合集下载文件txt
            addDownAHrefNode( video.FinalDecodeContent, video.DownLoadM3u8FileName );
        } );
    }

    //将下载链接发送到 M3u8 下载
    function sendDownloadTextToM3u8(m3u8FileName) {//"D:\HKPath\HK\HkDownloads\k0.m3u8";
        // let downLoadFileDirFullPath = "D:\\HKPath\\HK\\HkDownloads";//file:///F:/@Installed/HkTools/M3U81.4.2/k0.m3u8
        let fileFullPath = downLoadFileDirFullPath.replace( /\\/g, "/" ).replace( /\/$/g, "" ).trim();
        fileFullPath += `/${m3u8FileName}`;//file:///D:/HKPath/HK/HkDesktop/1.html
        document.getElementById( "ImoocADownTextArea" ).append( `${m3u8FileName.replace( /\.m3u8$/ig, "" )},file:///${fileFullPath}\n` );
    }

    function addDownAHrefNode(text, fileName) {
        let anchor = document.createElement( "a" );
        let data = new Blob( [text], {type: "text/plain;charset=UTF-8"} );
        anchor.href = window.URL.createObjectURL( data );
        anchor.download = fileName;
        anchor.innerText = fileName;
        let olNode = document.getElementById( "ADownLinksNode" );
        let liNode = document.createElement( "li" );
        liNode.append( anchor );
        olNode.append( liNode );
        //GM_openInTab( anchor.href, "setParent" );
        // saveTextAsFile( text, fileName, () => {
        //         myLog( fileName, "下载成功！" );
        //     },
        //     () => {
        //         myLog( fileName, "下载失败！" );
        //     } );
        anchor.addEventListener( "click", ev => myLog( fileName + "|下载-被点击！", JSON.stringify( ev ) ) );
        //anchor.click();
        return anchor;
    }

    function exportRaw(fileName, text) {//调用 单一文件 下载
        let anchor = addDownAHrefNode( text, fileName );

        let mouseClickEvent = document.createEvent( 'MouseEvents' );
        mouseClickEvent.initEvent( 'click', true, false );
        anchor.dispatchEvent( mouseClickEvent );

        let mouseMoveEv = document.createEvent( 'MouseEvents' );
        mouseMoveEv.initEvent( 'mousemove', true, false );
        anchor.dispatchEvent( mouseMoveEv );

        // let mouserInitClickEv = document.createEvent('MouseEvents');
        // mouserInitClickEv.initMouseEvent('click', true, true, window,
        //     1, 12, 345, 7, 220,
        //     false, false, true, false, 0, null);
        // anchor.dispatchEvent(mouserInitClickEv);


        // GM_download( {
        //     url: anchor.href,
        //     name: fileName,//'非IDM下载请自己改后缀名.zip并添加后缀名至TM的白名单中！',//
        //     saveAs: false,//boolean value, show a saveAs dialog
        //     onerror: e => console.log( JSON.stringify( e ) ),
        //     onprogress: e => console.log( JSON.stringify( e ) ),
        //     onload: function (e) {
        //         console.log( JSON.stringify( e ) );
        //         window.URL.revokeObjectURL( downloadUrl );
        //     },
        //     // ontimeout: e => console.log( JSON.stringify( e ) ),
        // } );
        //myLog( fileName, "正在下载！" );
        // if (course.VideoTotalCount === olNode.childElementCount) {
        //     let liNodes = olNode.getElementsByTagName( "li" );
        //     [].forEach.call(liNodes,aliNode=>{
        //         aliNode.getElementsByTagName("a")[0].click();
        //
        //     });
        //     myLog(  "正在下载All！" );
        // }
    }

    /*
         * @description    根据某个字段实现对json数组的排序
         * @param   array  要排序的json数组对象
         * @param   field  排序字段（此参数必须为字符串）
         * @param   reverse 是否倒序（默认为false）
         * @return  array  返回排序后的json数组
        */
    function jsonSort(array, field, reverse) {
        //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
        if (array.length < 2 || !field || typeof array[0] !== "object") return array;
        //数字类型排序
        if (typeof array[0][field] === "number") {
            array.sort( function (x, y) {
                return x[field] - y[field]
            } );
        }
        //字符串类型排序
        if (typeof array[0][field] === "string") {
            array.sort( function (x, y) {
                return x[field].localeCompare( y[field] )
            } );
        }
        //倒序
        if (reverse) {
            array.reverse();
        }
        return array;
    }

    function showTextArea() {
        if (document.querySelector( '#ImoocADownTextDiv' ) == null) {
            let container = document.createElement( "div" );
            container.id = "ImoocADownTextDiv";
            container.style = "width: 100%; position: fixed; z-index: 999998; top: 40%; height: 60%; bottom: 0px; " +
                "background: black; color: red;overflow: auto;font-family: Consolas,Monaco,monospace;";
            container.innerHTML = '<textarea id="ImoocADownTextArea" readonly="readonly" ' +
                'style="white-space: pre;width: 50%;position: absolute;top: 0;left: 0; height: 98%; background: black; ' +
                'color: lawngreen;resize: none; border: 1px solid red;overflow: auto;">' +
                '</textarea><div style="white-space: nowrap;width: 43%;position: absolute;top: 0;left: 52%; margin: 2px; height: 98%; ' +
                'background: black; color: lawngreen;resize: none; border: 1px solid green;overflow: scroll;">' +
                '<ol id="ADownLinksNode"></ol></div>';
            document.body.appendChild( container );
        } else {
            elementShow( 'ImoocADownTextDiv' );
        }
    }

    function showSetting() {//打开设置
        if (document.getElementById( "ADownSettings" ) != null) {
            loadSetting();
            setSelectCheckedOptionsValue( 'videoQualityId', videoQuality, true ); //设置清晰度 显示值
            document.getElementById( "ADownSavePath" ).value = downLoadFileDirFullPath;
            elementShow( "ADownSettings" );
        } else {
            let container = document.createElement( "div" );
            container.id = "ADownSettings";
            container.style = "position: fixed; z-index: 999999; top: 20px; right: 450px; width: 190px; height: auto; background: black; padding: 10px; color: white; font-size: 14px; border: 1px solid red;";
            container.innerHTML =
                '<div style="line-height:22px;"><h3 style="text-align: center;font-weight: bolder;">下载设置</h3>' +
                '<div>文件保存位置: <input type="text" id="ADownSavePath" value="' + downLoadFileDirFullPath + '" style="width:100%" /></div>' +
                '<div>清晰度:' +
                '<select id="videoQualityId">' +
                '<option value="1" ' + (videoQuality === 1 ? 'selected' : '') + '>1.普清</option>' +
                '<option value="2" ' + (videoQuality === 2 ? 'selected' : '') + '>2.高清</option>' +
                '<option value="3" ' + (videoQuality === 3 ? 'selected' : '') + '>3.超清</option>' +
                '</select></div>' +
                '<div style="margin-top:5px;float: right;">' +
                '<span><input type="button" value="取消" id="SettingsCancelButton"> | ' +
                '<input type="button" value="保存" id="SettingsSaveButton"></span>' +
                '</div>' +
                '</div>';
            document.body.appendChild( container );
        }
        document.getElementById( "SettingsSaveButton" ).addEventListener( "click", function () {
            let videoQualityNode = document.getElementById( 'videoQualityId' );
            let videoQualityNodeSelectedIndex = videoQualityNode.selectedIndex; // 选中索引
            let videoQualityNodeValue = videoQualityNode.options[videoQualityNodeSelectedIndex].value; // 选中值
            let aDownSavePathValue = document.getElementById( "ADownSavePath" ).value;
            saveSetting( videoQualityNodeValue, aDownSavePathValue );//$('input[name="save_path"]').val()
            elementHide( "ADownSettings" );
        } );
        document.getElementById( "SettingsCancelButton" ).addEventListener( "click", function () {
            elementHide( "ADownSettings" );
        } );
    }

    function saveSetting(thisVideoQuality, thisDownLoadFileDirFullPath) {
        // noinspection JSUnresolvedFunction : GM_getValue supplied by TamperMonkey
        GM_setValue( "video_quality", parseInt( thisVideoQuality ) );
        // noinspection JSUnresolvedFunction
        GM_setValue( "down_load_file_dir_full_path", thisDownLoadFileDirFullPath );
        videoQuality = Number( thisVideoQuality );
        downLoadFileDirFullPath = thisDownLoadFileDirFullPath;
    }

    /**
     * 设置select控件选中
     * @param selectId select的id值
     * @param checkValue 选中option的值
     * @param isSetTrue
     */
    function setSelectCheckedOptionsValue(selectId, checkValue, isSetTrue) {
        let select = document.getElementById( selectId );

        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === checkValue) {
                select.options[i].selected = isSetTrue;
                break;
            }
        }
    }

    function toggleElementHideShow(elementId) {
        let element = document.getElementById( elementId );
        if (element == null) {
            alert( "toggleElementHideShow：妈的，" + elementId + " 没找到！" );
        }
        let show = element.classList.contains( 'show' );
        if (show) {
            element.classList.remove( 'show' );
            element.classList.add( 'hide' );
        } else {
            element.classList.remove( 'hide' );
            element.classList.add( 'show' );
        }
    }

    function elementHide(elementId) {
        let element = document.getElementById( elementId );
        if (element == null) {
            alert( "toggleElementHideShow：妈的，" + elementId + " 没找到！" );
        }
        element.classList.remove( 'show' );
        element.classList.add( 'hide' );
    }

    function elementShow(elementId) {
        let element = document.getElementById( elementId );
        if (element == null) {
            alert( "toggleElementHideShow：妈的，" + elementId + " 没找到！" );
        }
        element.classList.remove( 'hide' );
        element.classList.add( 'show' );

    }

    //</editor-fold>
})();

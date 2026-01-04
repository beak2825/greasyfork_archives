// ==UserScript==
// @name         AcFun - 视频m3u8链接下载
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  可以下载AC视频稿件、免费番剧、用户视频稿件和视频合辑的视频m3u8链接
// @author       dareomaewa
// @match        https://www.acfun.cn/v/0.0
// @match        https://www.acfun.cn/bangumi/0.0
// @match        https://www.acfun.cn/v/0.0/
// @match        https://www.acfun.cn/bangumi/0.0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acfun.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541916/AcFun%20-%20%E8%A7%86%E9%A2%91m3u8%E9%93%BE%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/541916/AcFun%20-%20%E8%A7%86%E9%A2%91m3u8%E9%93%BE%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function waitElement(selector, times, interval, flag=true){
    var _times = times || -1,
        _interval = interval || 1,
        _selector = selector,
        _iIntervalID,
        _flag = flag;
    return new Promise(function(resolve, reject){
        _iIntervalID = setInterval(function() {
            if(!_times) {
                clearInterval(_iIntervalID);
                reject();
            }
            _times <= 0 || _times--;
            var _self = $(_selector);
            if( (_flag && _self.length) || (!_flag && !_self.length) ) {
                clearInterval(_iIntervalID);
                resolve(_iIntervalID);
            }
        }, _interval);
    });
}

function addChild(fatherNode, childNode, innerHtmlStr, type) {
    childNode.innerHTML = innerHtmlStr;
    if (type) {
        fatherNode.appendChild(childNode);
    }else {
        fatherNode.appendChild(childNode.childNodes[0]);
    }
}

function addChildDiv(fatherNode, innerHtmlStr) {
    addChild(fatherNode, document.createElement("div"), innerHtmlStr);
}

function replaceText(selector, newText) {
    waitElement(selector).then(function() {document.querySelector(selector).innerText = newText;});
}

function replaceTip(color, newText) {
    const selector = '#tips';
    waitElement(selector).then(function() {
        replaceText(selector, newText);
        if(color) {
            const styleColor = document.querySelector(selector).style;
            styleColor.color = color;
        }
    });
}

function awk(text, startStr, endStr) {
    const lines = text.split(/\r?\n/);
    let startIndex = -1;
    let endIndex = -1;

    // 查找起始行
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(startStr)) {
            startIndex = i;
            break;
        }
    }

    // 如果找到起始行，查找结束行
    if (startIndex !== -1) {
        for (let i = startIndex; i < lines.length; i++) {
            if (lines[i].includes(endStr)) {
                endIndex = i;
                break;
            }
        }
    }

    // 返回结果
    if (startIndex === -1) {
        return ""; // 未找到起始行
    } else if (endIndex === -1) {
        return lines.slice(startIndex).join("\n"); // 未找到结束行，返回起始行到最后
    } else {
        return lines.slice(startIndex, endIndex + 1).join("\n");
    }
}

window.onload = function() {
    console.log('window.onload');

    let downloadText = '';
    let fileName = '';
    let isPnum = false;
    let isBangumiNum = false;
    let isDownlodOne = false;

    function GM_fetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: resolve,
                onerror: reject
            });
        });
    }

    function appendDownloadText(text, title) {
        downloadText += (text + '\n');
        if(!fileName) {
            fileName = title;
        }
    }

    function clearDownloadText() {
        downloadText = '';
        fileName = '';
    }

    function appendM3u8Url(htmlText, infoName, pTitle) {
        const pageInfoText = awk(htmlText, 'window.pageInfo', '};');
        if(!pageInfoText) {
            throw new Error('找不到页面，请检查并重试');
        }

        console.log('count');

        const pageInfoStr = pageInfoText.replace(`window.pageInfo = window.${infoName} = `,'').replace('};', '}');
        const pageInfo = JSON.parse(pageInfoStr);
        if(!pageInfo.currentVideoInfo) {
            throw new Error('找不到资源，请检查并重试');
        }
        const ksPlayJsonStr = pageInfo.currentVideoInfo.ksPlayJson;
        const ksPlayJson = JSON.parse(ksPlayJsonStr);
        const video = ksPlayJson.adaptationSet[0].representation[0];
        const videoName = `${pageInfo.showTitle ? pageInfo.showTitle : pageInfo.title}${pTitle && !pageInfo.showTitle ? (' - ' + pTitle) : ''}${pageInfo.user ? '【' + pageInfo.user.name + '】' : ''}`;
        const videoInfo = `${videoName}【${video.qualityLabel}】,${video.url}`;

        appendDownloadText(videoInfo, isDownlodOne ? `【${pageInfo.bangumiTitle ? '番剧' : '视频'}】${videoName}` : `${pageInfo.bangumiTitle ? `【番剧】${pageInfo.bangumiTitle}` : `【视频】${pageInfo.title}`}${pageInfo.user ? '【' + pageInfo.user.name + '】' : ''}`);
    }

    async function getM3u8(url, infoName, pTitle) {
        const response = await GM_fetch(url);
        if (response.status !== 200) {
            throw new Error('找不到资源，请检查并重试');
        }
        const htmlText = response.responseText;
        appendM3u8Url(htmlText, infoName, pTitle);
    }

    async function getP(url, infoName, getDocText) {
        const response = await GM_fetch(url);
        if (response.status !== 200) {
            throw new Error('找不到资源，请检查并重试');
        }

        const responseText = response.responseText;
        const docText = getDocText(responseText);

        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const multipleP = doc.querySelectorAll('.single-p');
        multipleP.forEach(function(p) {
            console.log(p.getAttribute('data-href'));
        });

        if((isDownlodOne && isBangumiNum) || multipleP.length === 0) {
            appendM3u8Url(responseText, infoName);
        }
        else if(isDownlodOne && isPnum) {
            let p;
            for (var j = 0; j < multipleP.length; j++) {
                const currp = multipleP[j];
                const purl = currp.getAttribute('data-href');
                if(url === purl) {
                    p = currp;
                    break;
                }
            }
            const purl = p.getAttribute('data-href');
            const pTitle = p.getAttribute('title');
            await getM3u8(purl, infoName, pTitle);
        }
        else {
            if(isDownlodOne && !isPnum && !isBangumiNum) {
                const p = multipleP[0];
                const purl = p.getAttribute('data-href');
                const pTitle = p.getAttribute('title');
                await getM3u8(purl, infoName, pTitle);
            }
            else {
                for (var i = 0; i < multipleP.length; i++) {
                    const p = multipleP[i];
                    const purl = p.getAttribute('data-href');
                    const pTitle = p.getAttribute('title');
                    await getM3u8(purl, infoName, pTitle);
                }
            }
        }
    }

    async function downloadM3u8Text() {
        console.log(downloadText);
        const gmdownload = GM_download({
            url: "data:text/plain," + encodeURIComponent(downloadText),
            name: `${fileName}-${new Date().getTime()}.txt`,
            saveAs: true
        });
        console.log('startclear gmdownload');
        setTimeout(() => {gmdownload.abort();console.log('endclear gmdownload');}, 10000);
    }

    async function getVideo(acNo) {
        await getP(`/v/${acNo}`, 'videoInfo', function(responseText) {
            return responseText;
        });

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getBangumiItem(aaNo) {
        const timestamp = new Date().getTime();
        await getP(`/bangumi/${aaNo}?pagelets=pagelet_partlist&reqID=0&ajaxpipe=1&t=${timestamp}`, 'bangumiData', function(responseText) {
            const response = JSON.parse(responseText.replace('/*<!-- fetch-stream -->*/', ''));
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.html, 'text/html');
            const overParts = doc.querySelectorAll('ul');
            if(overParts.length === 0) {
                throw new Error('找不到此番剧号');
            }
            return response.html;
        });
    }

    async function getBangumi(aaNo) {
        const response = await GM_fetch(`/bangumi/${aaNo}`);
        if (response.status !== 200) {
            throw new Error('找不到此番剧号');
        }

        const responseText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        const multipleItem = doc.querySelectorAll('.bangumi-item');
        console.log(multipleItem);

        if(multipleItem.length === 0) {
            await getBangumiItem(aaNo);
        }
        else {
            for (var i = 0; i < multipleItem.length; i++) {
                const item = multipleItem[i];
                const dataId = item.getAttribute('data-id');
                await getBangumiItem('aa' + dataId);
            }
        }

        await downloadM3u8Text();

        clearDownloadText();
    }

    async function downloadBtn(promiseFunction) {
        await promiseFunction.then(function() {
            replaceTip('darkgreen', '已完成！');
        }).catch(function(err) {
            console.log(err)
            replaceTip('red', err.message);
        }).finally(() => {
            const acaabutton = document.getElementById('acaaDownloadBtn');
            acaabutton.disabled = false;
            const uidaabutton = document.getElementById('uidaaDownloadBtn');
            uidaabutton.disabled = false;
            clearDownloadText();
        });
    }

    async function getVideoPromise(acNo) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getVideo(acNo));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getBangumiPromise(aaNo) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getBangumi(aaNo));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getOneBangumi(aaNo) {
        await getP(`/bangumi/${aaNo}`, 'bangumiData', function(responseText) {
            return responseText;
        });

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getOneBangumiPromise(aaNo) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getOneBangumi(aaNo));
           } catch (error) {
               reject(error);
           }
        });
    }

    window.downloadLink = async function downloadLink() {
        var acaaNumEle = document.getElementById('acaaNum');
        const number = acaaNumEle.value.replace(/\s/g, '');
        console.log(number);
        isPnum = number.includes('_');
        console.log(`isPnumisPnum: ${isPnum}`);
        isDownlodOne = document.getElementById('downOne').checked;
        console.log(`isDownlodOne: ${isDownlodOne}`);

        replaceTip('black', '请勿离开页面，正在处理中.....');

        const acaabutton = document.getElementById('acaaDownloadBtn');
        acaabutton.disabled = true;
        const uidaabutton = document.getElementById('uidaaDownloadBtn');
        uidaabutton.disabled = true;

        if(number.startsWith("ac")){
            isBangumiNum = false;
            await downloadBtn(getVideoPromise(number));
        }
        else if(number.startsWith("aa")){
            isBangumiNum = true;
            if(isDownlodOne) {
                await downloadBtn(getOneBangumiPromise(number));
            }
            else {
                await downloadBtn(getBangumiPromise(number));
            }
        }
        else {
            console.log('Invalid number');
            replaceTip('red', '无效AC号或番剧号');
            acaabutton.disabled = false;
            uidaabutton.disabled = false;
            clearDownloadText();
        }
    }

    async function getUidPageInfoVideo(uid, page, pageSize) {
        isDownlodOne = false;

        const timestamp = new Date().getTime();
        const response = await GM_fetch(`/u/${uid}?quickViewId=ac-space-video-list&reqID=0&ajaxpipe=1&type=video&order=newest&page=${page}&pageSize=${pageSize}&t=${timestamp}`);
        if (response.status !== 200) {
            throw new Error('找不到资源，请检查并重试');
        }

        const responseText = response.responseText;
        const res = JSON.parse(responseText.replace('/*<!-- fetch-stream -->*/', ''));
        const parser = new DOMParser();
        const doc = parser.parseFromString(res.html, 'text/html');
        const videos = doc.querySelectorAll('a.ac-space-video');
        if(videos.length === 0) {
            throw new Error('没有用户稿件');
        }

        for (var j = 0; j < videos.length; j++) {
            const video = videos[j];
            const wbinfo = JSON.parse(video.dataset.wbinfo);
            await getP(`/v/ac${wbinfo.mediaId}`, 'videoInfo', function(responseText) {
                return responseText;
            });
        }
    }

    async function getUidVideo(uid) {
        const response = await GM_fetch(`/u/${uid}`);
        if (response.status !== 200) {
            throw new Error('找不到用户，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const spanname = doc.querySelector('span.name .text-overflow');
        const unmae = spanname.innerHTML;

        const videoCountNode = doc.querySelector('.tags li.active span');
        const videoCount = videoCountNode.innerHTML;

        fileName = `【用户】${unmae}的全部稿件(共${videoCount})`;

        if(videoCount === 0) {
            throw new Error('没有用户稿件');
        }

        let forCount;
        if(videoCount <= 20) {
            forCount = 1;
        }
        else {
            if(videoCount % 20 === 0) {
                forCount = videoCount / 20;
            }
            else {
                forCount = Math.floor(videoCount / 20) + 1;
            }
        }

        console.log('videoPageCount: ' + forCount);
        for (var i = 1; i <= forCount; i++) {
            console.log('videoPage: ' + i);
            await getUidPageInfoVideo(uid, i, 20);
        }

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getUidUpdateVideo(uid, updateNum) {
        const response = await GM_fetch(`/u/${uid}`);
        if (response.status !== 200) {
            throw new Error('找不到用户，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const spanname = doc.querySelector('span.name .text-overflow');
        const unmae = spanname.innerHTML;

        fileName = `【用户】${unmae}的更新稿件(共${updateNum})`;
        if(updateNum > 100) {
            throw new Error('更新数量不能超过100');
        }

        await getUidPageInfoVideo(uid, 1, updateNum);

        await downloadM3u8Text();

        clearDownloadText();
    }

    async function getUidPageVideo(uid, page) {
        const response = await GM_fetch(`/u/${uid}`);
        if (response.status !== 200) {
            throw new Error('找不到用户，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const spanname = doc.querySelector('span.name .text-overflow');
        const unmae = spanname.innerHTML;

        fileName = `【用户】${unmae}的第${page}页稿件`;

        await getUidPageInfoVideo(uid, page, 20);

        await downloadM3u8Text();

        clearDownloadText();
    }

    async function getFilterUidPageVideo(filteredFeed) {
        isDownlodOne = false;

        for (var j = 0; j < filteredFeed.length; j++) {
            const feedItem = filteredFeed[j];
            const videoList = feedItem.videoList;
            for (var i = 0; i < videoList.length; i++) {
                console.log('count');

                const videoItem = videoList[i];
                const response = await GM_fetch(`https://api-ipv6.app.acfun.cn/rest/app/play/playInfo/m3u8V2?videoId=${videoItem.id}&resourceId=${feedItem.dougaId}&resourceType=2&mkey=mkey&product=ACFUN_APP&appMode=0`);
                if (response.status !== 200) {
                    throw new Error('找不到资源，请检查并重试');
                }

                const responseText = response.responseText;
                const res = JSON.parse(responseText);
                const playInfo = res.playInfo;
                if(!playInfo) {
                    throw new Error('找不到资源，请检查并重试');
                }
                const videoName = `${feedItem.title}${videoItem.title ? (' - ' + videoItem.title) : ''}${feedItem.user ? '【' + feedItem.user.name + '】' : ''}`;
                let videoInfo;
                if(playInfo.isKsManifest) {
                    const ksPlayJsonStr = playInfo.ksPlayJson;
                    const ksPlayJson = JSON.parse(ksPlayJsonStr);
                    const video = ksPlayJson.adaptationSet[0].representation[0];
                    videoInfo = `${videoName}【${video.qualityLabel}】,${video.url.includes('://tx') ? video.backupUrl : video.url}`;
                }
                else {
                    const video = playInfo.streams[0];
                    videoInfo = `${videoName}【${video.qualityLabel}】,${video.playUrls[0].includes('://tx') ? video.playUrls[1] : video.playUrls[0]}`;
                }

                appendDownloadText(videoInfo, '')
            }
        }
    }

    async function getFilterUidVideo(uid) {
        const response = await GM_fetch(`https://api-ipv6.app.acfun.cn/rest/app/user/resource/query?count=1&authorId=${uid}&resourceType=2&sortType=3&status=1&pcursor=0&product=ACFUN_APP&sys_version=10&app_version=6.77.0.1306&sys_name=android&appMode=0`);
        if (response.status !== 200) {
            throw new Error('找不到资源，请检查并重试');
        }

        const responseText = response.responseText;
        const res = JSON.parse(responseText);
        const videos = res.feed;
        console.log(videos);
        if(videos.length === 0) {
            throw new Error('没有用户稿件');
        }

        const videoCount = res.totalNum;

        if(videoCount === 0) {
            throw new Error('没有用户稿件');
        }

        let forCount;
        if(videoCount <= 20) {
            forCount = 1;
        }
        else {
            if(videoCount % 20 === 0) {
                forCount = videoCount / 20;
            }
            else {
                forCount = Math.floor(videoCount / 20) + 1;
            }
        }

        console.log('videoPageCount: ' + forCount);

        const parentChannel = document.getElementById('parentChannel');
        const parentChannelId = parentChannel.value;
        var parentChannelIndex = parentChannel.selectedIndex;
        var parentChannelText = parentChannel.options[parentChannelIndex].text;

        const channel = document.getElementById(`channel_${parentChannelId}`);
        const channelId = channel.value;
        var channelIndex = channel.selectedIndex;
        var channeText = channel.options[channelIndex].text;

        const filteredFeed = [];
        const channelData = {
            parentId: parseInt(parentChannelId),
            parentName: parentChannelText,
            id: parseInt(channelId),
            name: channeText
        }
        for (var i = 0; i < forCount; i++) {
            console.log('videoPage: ' + i);

            const response = await GM_fetch(`https://api-ipv6.app.acfun.cn/rest/app/user/resource/query?count=${20}&authorId=${uid}&resourceType=2&sortType=3&status=1&pcursor=${i}&product=ACFUN_APP&appMode=0`);
            if (response.status !== 200) {
                throw new Error('找不到资源，请检查并重试');
            }

            const responseText = response.responseText;
            const res = JSON.parse(responseText);
            const feed = res.feed;
            if(feed.length === 0) {
                throw new Error('没有用户稿件');
            }
            feed.forEach(function(feedItem) {
                if(channelData.id) {
                    if(feedItem.channel.id === channelData.id) {
                        filteredFeed.push(feedItem);
                    }
                }
                else if(channelData.parentId) {
                    if(feedItem.channel.parentId === channelData.parentId) {
                        filteredFeed.push(feedItem);
                    }
                }
                else {
                    filteredFeed.push(feedItem);
                }
            });
        }

        if(filteredFeed.length === 0) {
            throw new Error('没有相关稿件');
        }

        let channelName = '全部';
        if(channelData.id){
            channelName = `【${channelData.name}】分区`;
        }
        else if(channelData.parentId){
            channelName = `【${channelData.parentName}】分区`;
        }

        const unmae = filteredFeed[0].user.name;
        fileName = `【用户】${unmae}的${channelName}稿件(共${filteredFeed.length})`;

        await getFilterUidPageVideo(filteredFeed);

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getAlbumPageInfoVideo(arubamuId, page, pageSize) {
        const arubamuResponse = await GM_fetch(`/rest/pc-direct/arubamu/content/list?page=${page}&size=${pageSize}&arubamuId=${arubamuId}`);
        if (arubamuResponse.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const arubamuRes = JSON.parse(arubamuResponse.responseText);
        const videos = arubamuRes.contents;
        if (videos.length === 0) {
            throw new Error('找不到合辑，请检查并重试');
        }
        if(arubamuRes.totalSize === 0) {
            throw new Error('没有合辑稿件');
        }

        for (var j = 0; j <videos.length; j++) {
            const video = videos[j];
            await getP(`/v/ac${video.resourceId}`, 'videoInfo', function(responseText) {
                return responseText;
            });
        }
    }

    async function getAlbumVideo(aaNo) {
        const response = await GM_fetch(`/a/${aaNo}`);
        if (response.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const h1album = doc.querySelector('h1.album-title');
        if (!h1album) {
            throw new Error('找不到合辑，请检查并重试');
        }
        const albumTitle = h1album.innerHTML;

        const arubamuId = aaNo.slice(2, aaNo.length);
        console.log(arubamuId);
        const restresponse = await GM_fetch(`/rest/pc-direct/arubamu/content/list?page=1&size=1&arubamuId=${arubamuId}`);
        if (restresponse.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const res = JSON.parse(restresponse.responseText);
        if (res.contents.length === 0) {
            throw new Error('找不到合辑，请检查并重试');
        }
        if (res.contents[0].resourceTypeValue !== 2) {
            throw new Error('只支持视频合辑');
        }

        const totalSize = res.totalSize;

        fileName = `【合辑】${albumTitle}的全部稿件(共${totalSize})`;

        if(totalSize === 0) {
            throw new Error('没有合辑稿件');
        }

        let forCount;
        if(totalSize <= 30) {
            forCount = 1;
        }
        else {
            if(totalSize % 30 === 0) {
                forCount = totalSize / 30;
            }
            else {
                forCount = Math.floor(totalSize / 30) + 1;
            }
        }

        console.log('arubamuPageCount: ' + forCount);
        for (var i = 1; i <= forCount; i++) {
            console.log('arubamuPage: ' + i);
            await getAlbumPageInfoVideo(arubamuId, i, 30);
        }

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getAlbumUpdateVideo(aaNo, updateNum) {
        const response = await GM_fetch(`/a/${aaNo}`);
        if (response.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const h1album = doc.querySelector('h1.album-title');
        if (!h1album) {
            throw new Error('找不到合辑，请检查并重试');
        }
        const albumTitle = h1album.innerHTML;

        const arubamuId = aaNo.slice(2, aaNo.length);
        console.log(arubamuId);
        const restresponse = await GM_fetch(`/rest/pc-direct/arubamu/content/list?page=1&size=1&arubamuId=${arubamuId}`);
        if (restresponse.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const res = JSON.parse(restresponse.responseText);
        if (res.contents.length === 0) {
            throw new Error('找不到合辑，请检查并重试');
        }
        if (res.contents[0].resourceTypeValue !== 2) {
            throw new Error('只支持视频合辑');
        }

        const totalSize = res.totalSize;

        fileName = `【合辑】${albumTitle}的更新稿件(共${updateNum})`;
        if(updateNum > 100) {
            throw new Error('更新数量不能超过100');
        }

        await getAlbumPageInfoVideo(arubamuId, 1, updateNum);

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getAlbumPageVideo(aaNo, page) {
        const response = await GM_fetch(`/a/${aaNo}`);
        if (response.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const docText = response.responseText;
        const parser = new DOMParser();
        const doc = parser.parseFromString(docText, 'text/html');

        const h1album = doc.querySelector('h1.album-title');
        if (!h1album) {
            throw new Error('找不到合辑，请检查并重试');
        }
        const albumTitle = h1album.innerHTML;

        const arubamuId = aaNo.slice(2, aaNo.length);
        console.log(arubamuId);
        const restresponse = await GM_fetch(`/rest/pc-direct/arubamu/content/list?page=1&size=1&arubamuId=${arubamuId}`);
        if (restresponse.status !== 200) {
            throw new Error('找不到合辑，请检查并重试');
        }

        const res = JSON.parse(restresponse.responseText);
        if (res.contents.length === 0) {
            throw new Error('找不到合辑，请检查并重试');
        }
        if (res.contents[0].resourceTypeValue !== 2) {
            throw new Error('只支持视频合辑');
        }

        const totalSize = res.totalSize;

        fileName = `【合辑】${albumTitle}的第${page}页稿件`;

        await getAlbumPageInfoVideo(arubamuId, page, 30);

        await downloadM3u8Text();

        clearDownloadText();

    }

    async function getUidVideoPromise(uid) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getUidVideo(uid));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getFilterUidVideoPromise(uid) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getFilterUidVideo(uid));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getUidUpdateVideoPromise(uid, updateNum) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getUidUpdateVideo(uid, updateNum));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getUidPageVideoPromise(uid, page) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getUidPageVideo(uid, page));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getAlbumVideoPromise(aaNo) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getAlbumVideo(aaNo));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getAlbumUpdateVideoPromise(aaNo, updateNum) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getAlbumUpdateVideo(aaNo, updateNum));
           } catch (error) {
               reject(error);
           }
        });
    }

    async function getAlbumPageVideoPromise(aaNo, page) {
       return new Promise((resolve, reject) => {
           try {
               resolve(getAlbumPageVideo(aaNo, page));
           } catch (error) {
               reject(error);
           }
        });
    }

    window.downloadUidArubamuLink = async function downloadUidArubamuLink() {
        var uidaaNum = document.getElementById('uidaaNum');
        const number = uidaaNum.value.replace(/\s/g, '');
        console.log(number);
        if (number.length === 0) {
            replaceTip('red', '无效UID或合辑号');
            return;
        }
        var uidaaUpdateNum = document.getElementById('uidaaUpdateNum');
        const updateNum = uidaaUpdateNum.value.replace(/\s/g, '');
        console.log(updateNum);
        if (!(/^\d+$/.test(updateNum))) {
            replaceTip('red', '更新数量：请输入整数');
            return;
        }
        const updateNumInt = parseInt(updateNum);

        var uidaaListPage = document.getElementById('uidaaListPage');
        const pageNum = uidaaListPage.value.replace(/\s/g, '');
        console.log(pageNum);
        if (!(/^\d+$/.test(pageNum))) {
            replaceTip('red', '稿件页次：请输入整数');
            return;
        }
        const pageNumInt = parseInt(pageNum);

        replaceTip('black', '请勿离开页面，正在处理中.....');

        const acaabutton = document.getElementById('acaaDownloadBtn');
        acaabutton.disabled = true;
        const uidaabutton = document.getElementById('uidaaDownloadBtn');
        uidaabutton.disabled = true;

        if(number.startsWith("aa")){
            if(updateNumInt) {
                await downloadBtn(getAlbumUpdateVideoPromise(number, updateNumInt));
            }
            else if(pageNumInt) {
                await downloadBtn(getAlbumPageVideoPromise(number, pageNumInt));
            }
            else {
                await downloadBtn(getAlbumVideoPromise(number));
            }
        }
        else {
            if(updateNumInt) {
                await downloadBtn(getUidUpdateVideoPromise(number, updateNumInt));
            }
            else if(pageNumInt) {
                await downloadBtn(getUidPageVideoPromise(number, pageNumInt));
            }
            else {
                const parentChannel = document.getElementById('parentChannel');
                const parentChannelId = parseInt(parentChannel.value);
                const channel = document.getElementById(`channel_${parentChannelId}`);
                const channelId = parseInt(channel.value);

                if(parentChannelId || channelId) {
                    await downloadBtn(getFilterUidVideoPromise(number));
                }
                else {
                    await downloadBtn(getUidVideoPromise(number));
                }
            }
        }
    }
}

replaceText('title', 'm3u8链接下载');

waitElement('.errimg').then(function() {
    const errimg =document.querySelector('.errimg');
    errimg.remove();
});

waitElement('.err-box').then(function() {
    const reasonNode =document.querySelector('.reason');
    reasonNode.remove();
    const errBoxNode =document.querySelector('.err-box');
    addChildDiv(errBoxNode,
                        `<div class="reason fl">
                        <h3>m3u8链接下载</h3>
                        <div class="tabs">
                        <div class="tab-links">
                            <a href="#tab1" class="active">视频&番剧</a>
                            <a href="#tab2">用户&合辑</a>
                            <a href="#tab3">免责声明</a>
                        </div>
                        <div class="tab-content">
                            <div id="tab1" class="tab active">
                        <span style="font-size: medium;padding-bottom: 1px;border-bottom: 2px solid #26B963;" id="acaaDesc"><a javascript:void(0);>使用说明</a></span>
                        <div style="padding-top: 10px">
                        <label>下载单个</label><input type="radio" id="downOne" name="downType" value="downOne">
                        <label>下载全部</label><input type="radio" id="downAll" name="downType" value="downAll" checked>
                        </div>
                        <p class="p2">请输入AC号或番剧号：</p>
                        <div>
                        <input type="text" name="acaaNumber" placeholder="ac123或aa456" id="acaaNum" style="margin-right: 5px;"><button id="acaaDownloadBtn">下载链接文件</button>
                        </div>
                        <div>
                        </div>
                        <div id="acaaDescDiv" style="
                            display: none;
                            position: fixed;
                            top: 45%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            padding: 20px;
                            border: 1px solid black;">
                            <div>
                                <span style="padding: 10px 0 5px 0;font-size: 15px;">
                                    <a href="https://github.com/nilaoda/N_m3u8DL-CLI/releases" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具地址</a>
                                </span>
                            </div>
                            <div>
                                <span style="padding: 10px 0 5px 0;font-size: 15px;">
                                    <a href="https://nilaoda.github.io/N_m3u8DL-CLI/SimpleGUI" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具使用说明</a>
                                </span>
                            </div>
                            <br/>
                            <p>下载的m3u8链接会失效，请尽快使用。失效后可以重新下载新的m3u8链接</p>
                            <br/>
                            <p>【下载全部】</p>
                            <p>视频举例：</p>
                            <p>ac号：ac1234567；p1：ac1234567_1；p2：ac1234567_2</p>
                            <p>以上3个号码填入其中一个都会下载全部分P的视频信息</p>
                            <p>番剧举例：</p>
                            <p>A番第1季番剧号：aa1234567；第1话：ac1234567_XXX_01；第2话：ac1234567_XXX_02</p>
                            <p>A番第2季番剧号：aa4567123；第1话：ac4567123_XXX_01；第2话：ac4567123_XXX_02</p>
                            <p>以上6个号码填入其中一个都会下载A番剧全部两季的视频信息</p>
                            <br/>
                            <p>【下载单个】</p>
                            <p>视频举例：</p>
                            <p>填入ac号：ac1234567，下载p1的视频信息</p>
                            <p>填入ac号：ac1234567_1，下载p1的视频信息</p>
                            <p>填入ac号：ac1234567_2，下载p2的视频信息</p>
                            <p>番剧举例：</p>
                            <p>填入番剧号：aa1234567，如果有登录并且之前观看到第2话，则下载第2话的视频信息；如果之前并未观看，则下载第1话的视频信息</p>
                            <p>填入番剧号：aa1234567，如果没有登录，则下载第1话的视频信息</p>
                            <p>填入番剧号第1话：ac1234567_XXX_01，则下载第1话的视频信息</p>
                            <p>填入番剧号第2话：ac4567123_XXX_02，则下载第2话的视频信息</p>
                        </div>
                        </div>
                        <div id="tab2" class="tab">
                        <span style="font-size: medium;padding-bottom: 1px;border-bottom: 2px solid #26B963;" id="uidaaDesc"><a javascript:void(0);>使用说明</a></span>
                        <div style="padding-top: 10px">
                        <span class="p2">更新稿件的数量：</span>
                        <input type="number"  name="uidaaUpdateNumer" step="1" min="0" max="100" id="uidaaUpdateNum" style="margin-right: 5px;text-align: right;" value="0">
                        </div>
                        <div style="padding-top: 10px">
                        <span class="p2">稿件列表的页次：</span>
                        <input type="number"  name="uidaaListPage" step="1" min="0" max="999" id="uidaaListPage" style="margin-right: 5px;text-align: right;" value="0">
                        </div>
                        <div style="padding-top: 10px">
                        <span class="p2">用户稿件分区：</span>
                        <select name="parentChannel" id="parentChannel">
                            <option value="0">请选择</option>
                            <option value="1">动画</option>
                            <option value="58">音乐</option>
                            <option value="123">舞蹈·偶像</option>
                            <option value="59">游戏</option>
                            <option value="60">娱乐</option>
                            <option value="201">生活</option>
                            <option value="70">科技</option>
                            <option value="68">影视</option>
                            <option value="69">体育</option>
                            <option value="125">鱼塘</option>
                        </select>
                        </div>
                        <div style="padding-top: 10px">
                        <span class="p2">用户稿件子分区：</span>
                        <select name="channel_0" id="channel_0">
                            <option value="0">请选择</option>
                        </select>
                        <select name="channel_1" id="channel_1" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="190">短片·手书·配音</option>
                            <option value="99">特摄</option>
                            <option value="133">COSPLAY·声优</option>
                            <option value="159">动画资讯</option>
                            <option value="207">虚拟偶像</option>
                            <option value="108">MMD·3D</option>
                            <option value="107">MAD·AMV</option>
                            <option value="106">动画综合</option>
                            <option value="212">番剧二创</option>
                        </select>
                        <select name="channel_58" id="channel_58" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="215">治愈系</option>
                            <option value="103">Vocaloid</option>
                            <option value="136">原创·翻唱</option>
                            <option value="137">演奏·乐器</option>
                            <option value="139">综合音乐</option>
                            <option value="185">音乐选集·电台</option>
                        </select>
                        <select name="channel_123" id="channel_123" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="218">颜值</option>
                            <option value="129">偶像</option>
                            <option value="134">宅舞</option>
                            <option value="135">综合舞蹈</option>
                            <option value="208">中国舞</option>
                        </select>
                        <select name="channel_59" id="channel_59" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="214">王者荣耀</option>
                            <option value="216">和平精英</option>
                            <option value="85">英雄联盟</option>
                            <option value="210">我的世界</option>
                            <option value="187">手机游戏</option>
                            <option value="217">第五人格</option>
                            <option value="145">电子竞技</option>
                            <option value="186">网络游戏</option>
                            <option value="84">主机单机</option>
                            <option value="165">桌游卡牌</option>
                        </select>
                        <select name="channel_60" id="channel_60" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="87">鬼畜</option>
                            <option value="188">明星</option>
                            <option value="206">搞笑</option>
                        </select>
                        <select name="channel_201" id="channel_201" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="86>"生活日常</option>
                            <option value="88>"萌宠</option>
                            <option value="89>"美食</option>
                            <option value="204>"旅行</option>
                            <option value="205>"美妆·造型</option>
                            <option value="127>"手工·绘画</option>
                        </select>
                        <select name="channel_70" id="channel_70" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="209">手办模玩</option>
                            <option value="90">科技制造</option>
                            <option value="91">数码家电</option>
                            <option value="122">汽车</option>
                            <option value="149">广告</option>
                            <option value="151">演讲·公开课</option>
                            <option value="189">人文科普</option>
                        </select>
                        <select name="channel_68" id="channel_68" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="219">影视混剪</option>
                            <option value="192">预告·花絮</option>
                            <option value="193">电影杂谈</option>
                            <option value="194">追剧社</option>
                            <option value="195">综艺Show</option>
                            <option value="196">纪录片·短片</option>
                        </select>
                        <select name="channel_69" id="channel_69" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="93">极限·竞速</option>
                            <option value="94">足球</option>
                            <option value="95">篮球</option>
                            <option value="152">综合体育</option>
                            <option value="153">搏击·健身</option>
                        </select>
                        <select name="channel_125" id="channel_125" style="display: none;">
                            <option value="0">请选择</option>
                            <option value="132">新鲜事</option>
                            <option value="131">历史</option>
                            <option value="92">国防军事</option>
                            <option value="183">普法安全</option>
                        </select>
                        </div>
                        <p class="p2">请输入UID或合辑号：</p>
                        <div>
                        <input type="text" name="uidaaNumber" placeholder="1234或aa789" id="uidaaNum" style="margin-right: 5px;"><button id="uidaaDownloadBtn">下载链接文件</button>
                        </div>
                        <div>
                        </div>
                        <div id="uidaaDescDiv" style="
                            display: none;
                            position: fixed;
                            top: 45%;
                            left: 50%;
                            transform: translate(-50%, -50%);
                            background-color: white;
                            padding: 20px;
                            border: 1px solid black;">
                            <div>
                                <span style="padding: 10px 0 5px 0;font-size: 15px;">
                                    <a href="https://github.com/nilaoda/N_m3u8DL-CLI/releases" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具地址</a>
                                </span>
                            </div>
                            <div>
                                <span style="padding: 10px 0 5px 0;font-size: 15px;">
                                    <a href="https://nilaoda.github.io/N_m3u8DL-CLI/SimpleGUI" target="_blank"><span style="color: rgb(38, 185, 99);">【N_m3u8DL-CLI】</span>视频下载工具使用说明</a>
                                </span>
                            </div>
                            <br/>
                            <p>下载的m3u8链接会失效，请尽快使用。失效后可以重新下载新的m3u8链接</p>
                            <br/>
                            <p>3个条件之间互不关联。优先级：【更新视频的数量】 > 【稿件列表的页次】 > 【用户稿件(子)分区】</p>
                            <br/>
                            <p>【更新视频的数量】</p>
                            <p>更新视频的数量最大不能超过100</p>
                            <p>举例：</p>
                            <p>如果更新视频的数量为0，则下载用户或合辑全部稿件的视频信息</p>
                            <p>如果更新视频的数量为2，则下载用户或合辑前2个稿件的视频信息</p>
                            <p>如果更新视频的数量为5，则下载用户或合辑前5个稿件的视频信息</p>
                            <br/>
                            <p>【稿件列表的页次】</p>
                            <p>下载用户或合辑稿件列表中的某一页</p>
                            <p>举例：</p>
                            <p>如果稿件列表的页次为0，则下载用户或合辑全部稿件的视频信息</p>
                            <p>如果稿件列表的页次为2，则下载用户或合辑稿件列表中第2页的全部稿件的视频信息</p>
                            <p>如果稿件列表的页次为5，则下载用户或合辑稿件列表中第5页的全部稿件的视频信息</p>
                            <br/>
                            <p>【用户稿件(子)分区】</p>
                            <p style="color: red;">此过滤条件需要在油猴弹出的提示页面中点击允许外部链接，否则无法使用</p>
                            <p style="color: red;">外部链接域名为：api-ipv6.app.acfun.cn，请认真对照清楚再允许</p>
                            <p style="color: red;">如果在提示页面上点错或者超时未允许，可以备份此脚本再删除，然后重新安装，后续提示页面会重新弹出</p>
                            <p style="color: red;">下载用户稿件所属分区的稿件，只对用户有效，合辑不生效</p>
                            <p>举例：</p>
                            <p>如果不选择(子)分区，则下载用户全部稿件的视频信息</p>
                            <p>如果只选择【动画】分区，则下载用户【动画】分区的全部稿件的视频信息</p>
                            <p>如果选择【动画综合】子分区，则下载用户【动画综合】子分区的全部稿件的视频信息</p>
                        </div>
                        </div>
                        <div id="tab3" class="tab">
                            <p>本脚本不提供下载视频功能，只是解析下载m3u8地址。</p>
                            <p>后续使用m3u8地址下载的视频版权归视频所有者所有，除非视频所有者同意，否则下载的视频仅限作离线播放用途。</p>
                            <p>任何未经授权的剪辑和再发布等行为均为侵犯版权的行为，请尊重创作者的劳动成果。</p>
                            <p>本脚本作者对下载者本人因使用此脚本下载m3u8地址，后续使用m3u8地址下载视频后剪辑、再发布等任何侵权行而产生的法律纠纷概不负责。</p>
                        </div>
                        </div>
                        </div>
                        <p class="p2" id="tips"></p>
                        <style>
                        .tabs .tab-links a {
                            padding: 10px;
                            text-decoration: none;
                            color: #000;
                            background: #eee;
                            border: 1px solid #ddd;
                            display: inline-block;
                        }

                        .tabs .tab-links a.active {
                            background: #fff;
                            border-bottom: none;
                        }

                        .tabs .tab-content .tab {
                            display: none;
                            padding: 10px;
                            border: 1px solid #ddd;
                        }

                        .tabs .tab-content .tab.active {
                            display: block;
                        }
                        </style>
                        </div>`
               );

});

waitElement('#acaaDownloadBtn').then(function() {
    const btn = document.getElementById('acaaDownloadBtn');
    btn.addEventListener('click', () => {
        window.downloadLink();
    });
});

waitElement('#uidaaDownloadBtn').then(function() {
    const btn = document.getElementById('uidaaDownloadBtn');
    btn.addEventListener('click', () => {
        window.downloadUidArubamuLink();
    });
});

waitElement('#acaaDesc').then(function() {
    const div = document.getElementById('acaaDesc');
    div.addEventListener('click', () => {
        const div2 = document.getElementById('acaaDescDiv');
        if(div2.style.display === 'block') {
            div2.style.display = 'none';
        }
        else {
            div2.style.display = 'block';
        }
    });
});

waitElement('#acaaDesc').then(function() {
    document.addEventListener('click', function(event) {
        var isClickInside = document.getElementById('acaaDescDiv').contains(event.target) || document.getElementById('acaaDesc').contains(event.target);
        if (!isClickInside) {
            const div2 = document.getElementById('acaaDescDiv');
            div2.style.display = 'none';
        }
    });
});

waitElement('#uidaaDesc').then(function() {
    const div = document.getElementById('uidaaDesc');
    div.addEventListener('click', () => {
        const div2 = document.getElementById('uidaaDescDiv');
        if(div2.style.display === 'block') {
            div2.style.display = 'none';
        }
        else {
            div2.style.display = 'block';
        }
    });
});

waitElement('#uidaaDesc').then(function() {
    document.addEventListener('click', function(event) {
        var isClickInside = document.getElementById('uidaaDescDiv').contains(event.target) || document.getElementById('uidaaDesc').contains(event.target);
        if (!isClickInside) {
            const div2 = document.getElementById('uidaaDescDiv');
            div2.style.display = 'none';
        }
    });
});


waitElement('.tab-links').then(function() {
    var tabs = document.querySelectorAll('.tab-links a');
    var contentDivs = document.querySelectorAll('.tab-content .tab');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            tabs.forEach(function(t) { t.classList.remove('active'); });
            contentDivs.forEach(function(c) { c.classList.remove('active'); });
            this.classList.add('active');
            target.classList.add('active');
        });
    });
});


waitElement('#parentChannel').then(function() {
    let selectElement = document.getElementById('parentChannel');
    let previousValue = selectElement.value;

    selectElement.addEventListener('change', function() {
        let currentValue = this.value;

        let preChildSelectElement = document.getElementById(`channel_${previousValue}`);
        preChildSelectElement.style.display = 'none';
        let currChildSelectElement = document.getElementById(`channel_${currentValue}`);
        currChildSelectElement.style.display = '';

        previousValue = currentValue;
    });
});
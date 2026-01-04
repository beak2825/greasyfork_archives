// ==UserScript==
// @name         图书馆预览
// @version      0.1
// @description  图书馆快速预览，一点即看，快上车！
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @match        http://www.javlibrary.com/*
// @grant        none
// @namespace https://greasyfork.org/users/194747
// @downloadURL https://update.greasyfork.org/scripts/398385/%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/398385/%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

var prefixUrl={
    'AP': 'https://cc3001.dmm.co.jp/litevideo/freepv/n/n_1/n_1428识别码/n_1428识别码_dmb_w.mp4',
    'ABP': 'https://cc3001.dmm.co.jp/litevideo/freepv/1/118/118识别码/118识别码_dmb_w.mp4',
    'REBD': 'https://cc3001.dmm.co.jp/litevideo/freepv/n/n_1/n_1412识别码/n_1412识别码_dmb_w.mp4',
    'STARS': 'http://cc3001.dmm.co.jp/litevideo/freepv/1/1st/1识别码/1识别码_mhb_w.mp4',
    'GVG': 'http://www.gloryquest.tv/sample_movie/识别码.mp4',
    'NITR':'https://awscc3001.r18.com/litevideo/freepv/4/49n/49识别码/49识别码_dmb_w.mp4',
};

(function() {
    'use strict';

    var shibiema=$("#video_id .text").text()
    if (shibiema == undefined) {
        return
    }
    var prefix=shibiema.split("-")[0]
    var code=shibiema.split("-")[1]
    var video=""
    if (prefix=='GVG') {
        video=prefix+"-"+code
    } else if (prefix=='AP'||prefix=='ABP'||prefix=='REBD'||prefix=='STARS'||prefix=='NITR') {
        video=prefix.toLowerCase()+code
    } else {
        video=prefix.toLowerCase()+fix(code,5)
    }
    var url=prefixUrl[prefix]
    if (url == undefined) {
        //http://awspv3001.r18.com
        url=`https://cc3001.dmm.co.jp/litevideo/freepv/${prefix.substr(0,1).toLowerCase()}/${prefix.substr(0,3).toLowerCase()}/识别码/识别码_dmb_w.mp4`
    }
    url=url.replace(/识别码/g, video)
    $("#video_id .text").append(' <a id=preview href="#" target="_blank">预览</a> <a id=preview2 href="#" target="_blank">预览2</a> <a id=torrent href="#" target="_blank">种子</a> ')
    $("#video_id #preview").attr('href', url)
    $("#video_id #preview2").attr('href', `https://www.r18.com/common/search/searchword=${shibiema}/`)
    $("#video_id #torrent").attr('href', `https://bthaha.date/search/${shibiema}/`)
})();

function fix(num, length) {
  return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
}
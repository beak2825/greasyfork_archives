// ==UserScript==
// @name        Twitter/X(网页版)视频/原始图片/gif一键下载.[limbopro]
// @name:ja     Twitter/X (Web 版) のビデオ/写真/GIF をワンクリックでダウンロード。[limbopro]
// @name:zh-cn  Twitter/X(网页版)视频/原始图片/gif一键下载.[limbopro]
// @name:zh-tw  Twitter/X(網頁版)影片/原始圖片/gif一鍵下載.[limbopro]
// @name:en     Twitter/X(web version)videos/4kPhotos/gif download.[limbopro]
// @name:ko     Twitter/X(웹버전) 동영상/사진/gif 원클릭 다운로드.[limbopro]
// @name:ru     Twitter/X (веб-версия) — загрузка видео/изображений/гифок в один клик.[limbopro]
// @namespace    https://limbopro.com/
// @version      0.1.5.11
// @description Twitter/X(网页版)视频/图片/gif一键下载.[limbopro] / 一键下载推文4k/原始图片并按用户名进行保存
// @description:zh-cn  Twitter/X(网页版)视频/图片/gif一键下载.[limbopro] / 一键下载推文4k/原始图片并按用户名进行保存/将推文内容生成图片
// @description:ja Twitter/X (Web 版) のビデオ/写真/GIF をワンクリックでダウンロード。[limbopro] / ワンクリックでツイート画像をダウンロードし、ユーザー名で保存します/ツイートの内容から画像を生成する
// @description:zh-tw Twitter/X(網頁版)影片/圖片/gif一鍵下載.[limbopro] / 一鍵下載推文4k/原始圖片並按使用者名稱儲存/將推文內容產生圖片
// @description:en Twitter/X(web version)videos/4kPhotos/gif download.[limbopro] / Download tweet original images(4k) with one click and save by username/Generate images from tweet content
// @description:ru Twitter/X (веб-версия) — загрузка видео/изображений/гифок в один клик.[limbopro] / Загрузите изображения твитов одним щелчком мыши и сохраните их по имени пользователя./Генерация изображений из содержимого твита
// @description:ko Twitter/X(웹버전) 동영상/사진/gif 원클릭 다운로드.[limbopro] / 한 번의 클릭으로 트윗 이미지를 다운로드하고 사용자 이름으로 저장/트윗 콘텐츠에서 이미지 생성
// @author       limbopro
// @license MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://twittervideodownloader.com/*
// @match        https://twittervid.com/*
// @match        https://tweeload.com/*
// @match        https://twittervideomp4.com/zh-tw/*
// @match        https://twittervideomp4.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @orginalURL   https://limbopro.com/Adguard/twdl.user.js
//// @required      https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478651/TwitterX%28%E7%BD%91%E9%A1%B5%E7%89%88%29%E8%A7%86%E9%A2%91%E5%8E%9F%E5%A7%8B%E5%9B%BE%E7%89%87gif%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%5Blimbopro%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/478651/TwitterX%28%E7%BD%91%E9%A1%B5%E7%89%88%29%E8%A7%86%E9%A2%91%E5%8E%9F%E5%A7%8B%E5%9B%BE%E7%89%87gif%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%5Blimbopro%5D.meta.js
// ==/UserScript==

/*
@ author: limbopro
@ website: http://limbopro.com/
@ Gmail: service.limbopro.com@gmail.com
@ Github: https://github.com/limbopro
@ X: https://x.com/limboprossr
*/


// 引入全局 CSS
var twdlcss_pc = ".twdlimgs {cursor:pointer;} #custom-alert p {color:black;font-size:inherit;} .twdlContainerDown > a {padding:4px 0px 4px 0px} .twdlContainerDown {display:grid;gap:1px;} .twdlhidden { cursor:pointer; background: #adb5bd;/*#6c757d;*/} .twdlhidden:hover {cursor:pointer; background-color: #6c757d;/*#adb5bd;*/ transition: 0.7s;}  .twdlshare { background: #8a63d2; /*background: #6f42c1;*/}  .twdlshare:hover {background:rgb(105, 42, 223);/*#8a63d2;*/transition: 0.7s;} div.contentBox,ins.adsbygoogle[data-ad-slot],ins.adsbygoogle[data-ad-client] {display:none !important;}, span[id^=\"ezoic-pub-ad-placeholder-\"], .ez-sidebar-wall, span[data-ez-ph-id], .ez-sidebar-wall-ad,.ez-sidebar-wall {display:none !important} .download_pics:hover { font-weight:bolder; background:rgb(0, 21, 255); /*background-color: #339dff;*/ transition: 0.7s;} .atx {display:none;} .houseab {position:absolute;top:5%;} .house { background-color:inherit; gap:1px;opacity:0.5;font-size:xx-small;z-index:114154 !important; max-width:235px; display:flex; flex-direction:row; flex-wrap:wrap; margin-top:5px;} .help{top:80px !important;/*background:teal;*/} .house:hover {opacity:1;font-size:xx-small;z-index:114154 !important; max-width:235px; display:flex; flex-direction:row; flex-wrap:wrap; margin-top:5px;} .help{background: #6c757d; top:80px !important;/*background:teal;*/} .twdl { border:0px; text-align:center; width:75px; align-content: center; z-index:114154 !important; line-height:normal; /*font-size:xx-small;*/ font-size:inherit; text-decoration:none; position:sticky; top:5px; /*text-transform:uppercase;*/ padding:4px 8px; color:white; z-index:114154;} .twittervideodownloader {background:#28a745;} .twittervideodownloader:hover {background-color: #5dd17a; transition: 0.7s;} .twittervid {background:linear-gradient(to bottom, #66BB6A 0%, #43A047 100%); box-shadow:inset 0 2px 2px #388E3C;} .twee {background: #28a745;} .twee:hover { background-color: #5dd17a; /* 更亮的颜色 */ transition: 0.7s;} .download_pics {font-weight:bolder; background-color: #339dff; /*background: #007bff;*/} .greasyfork {cursor:help; right:295px;background:linear-gradient(rgb(62 53 53) 0%, rgb(31 29 29) 100%);box-shadow:rgb(0 0 0) 0px 2px 2px inset;}"
var twdlcss_mobile = ".twdlimgs {cursor:pointer;} #custom-alert p {color:black;font-size:inherit;} .twdlContainerDown > a {padding:4px 0px 4px 0px} .twdlContainerDown {display:grid;gap:1px;} .twdlhidden {cursor:pointer; background: #adb5bd;/*#6c757d;*/} .twdlhidden:hover {cursor:pointer; background-color: #6c757d;/*#adb5bd;*/ transition: 0.7s;}  .twdlshare {background: #8a63d2; /*background: #6f42c1;*/} .twdlshare:hover {background: rgb(105, 42, 223); /*#8a63d2;*/transition: 0.7s;}  div.contentBox,ins.adsbygoogle[data-ad-slot],ins.adsbygoogle[data-ad-client] {display:none !important;}, span[id^=\"ezoic-pub-ad-placeholder-\"], .ez-sidebar-wall, span[data-ez-ph-id], .ez-sidebar-wall-ad,.ez-sidebar-wall {display:none !important} .download_pics:hover {font-weight:bolder; background:rgb(0, 21, 255); /*background-color: #339dff;*/ transition: 0.7s;} .atx {display:none;} .house { background-color:inherit; gap:1px;opacity:0.5;font-size:xx-small;z-index:114154 !important; max-width:235px; display:flex; flex-direction:row; flex-wrap:wrap; margin-top:5px;} .house:hover {opacity:1;font-size:xx-small;z-index:114154 !important; max-width:235px; display:flex; flex-direction:row; flex-wrap:wrap; margin-top:5px;} .help{background: #6c757d; top:80px !important;/*background:teal;*/} .help{ background: #6c757d; top:80px !important;/*background: teal;*/} .twdl { border:0px; text-align:center; width:75px; align-content: center; z-index:114154 !important; line-height:normal; /*font-size:xx-small;*/ font-size:inherit; text-decoration:none; position:sticky; top:5px; /*text-transform:uppercase;*/ padding:6px 12px; color:white; z-index:114154;} .twittervideodownloader {background:#28a745;} .twittervideodownloader:hover {background-color: #5dd17a; transition: 0.7s;} .twittervid {background:linear-gradient(to bottom, #66BB6A 0%, #43A047 100%); box-shadow:inset 0 2px 2px #388E3C;} .twee {background: #28a745;} .twee:hover { background-color: #5dd17a; /* 更亮的颜色 */ transition: 0.7s;} .download_pics {font-weight:bolder; background-color: #339dff; /*background: #007bff;*/} .greasyfork {cursor:help; right:295px;background:linear-gradient(rgb(62 53 53) 0%, rgb(31 29 29) 100%);box-shadow:rgb(0 0 0) 0px 2px 2px inset;}"
var newstyle = document.createElement('style')
newstyle.id = 'twdlcss'


if (window.navigator.userAgent.toLowerCase().indexOf('mobile') !== -1) {
    newstyle.innerHTML = twdlcss_mobile
} else {
    newstyle.innerHTML = twdlcss_pc
}

document.querySelector('head').parentNode.insertBefore(newstyle, document.querySelector('head')) // 载入

var twURL_regex = new RegExp(/^https:\/\/x\.com\/.*?\/status\/\d{10,100}$/gi) // 正则匹配对的 Tweet url
function twdl_div(article, downloaderURL, className, textContent) { // article = article[i]
    let a = document.createElement('a')
    article.querySelectorAll('a').forEach((x) => { // 获取 twitter url
        if (x.href.match(twURL_regex)) {
            //// console.log(x.href);
            a.href = downloaderURL + "#" + x.href;
            //// console.log(a.href)
        }
    })

    a.className = className;
    a.target = '_blank';
    a.zIndex = '114154';
    a.textContent = textContent;
    return a;
}

var twdl_Kurl = '';
var twURL_regex = new RegExp(/\b^https:\/\/x\.com\/.*?\/status\/\d{10,100}\b/gi) // 正则匹配对的 Tweet url

function twdl_url(article) {

    article.querySelectorAll('a').forEach((x) => { // 获取 twitter url
        var length = x.href.length
        if (x.href.replace(twURL_regex, '').length < length) {
            twdl_Kurl = x.href.match(twURL_regex)[0]
        }
    })
    return twdl_Kurl;
}

// twdl_url(document.querySelectorAll('[data-testid="cellInnerDiv"]')[0])

function iftwnopics_innerText() {
    var language = document.querySelector('html').lang; // en/ja/zh/ru/zh-Hant
    var textContent = '';
    switch (language) { //
        case 'zh':
            textContent = "该推文内容不存在图片!";
            return textContent;
            break;
        case 'zh-Hant':
            textContent = "該推文內容不存在圖片!";
            return textContent;
            break;
        /*
    case 'ja':
        textContent = "このツイートには画像がありません！";
        return textContent;
        break;
        */
        case 'en':
            textContent = "There is no image in this tweet!";
            return textContent;
            break;
        /*
    case 'ru':
        textContent = "В этом твите нет изображения!";
        return textContent;
        break;
        */
        default:
            textContent = "There is no image in this tweet!";
            return textContent;
            break;
    }
}


function downloader_innerText(x) { // [LOADER]/[VID]
    // 判断当前网页语言
    var language = document.querySelector('html').lang; // en/ja/zh/ru/zh-Hant
    var textContent = '';

    switch (language) { //
        case 'zh':
            textContent = "⏬ 视频等" + x;
            return textContent;
            break;
        case 'zh-Hant':
            textContent = "⏬ 影片等" + x;
            return textContent;
            break;

        case 'en':
            textContent = "⏬ Vid etc." + x;
            return textContent;
            break;

        default:
            textContent = "⏬ Vid etc." + x;
            return textContent;
            break;
    }

}


function dlpics_shareTweetAsImg() { // [LOADER]/[VID]
    // 判断当前网页语言
    var language = document.querySelector('html').lang; // en/ja/zh/ru/zh-Hant
    var textContent = '';
    switch (language) { //
        case 'zh':
            textContent = "✍️ 推文生成图片 🎨";
            // textContent = "🎨 以图片形式分享推文内容";
            return textContent;
            break;
        case 'zh-Hant':
            textContent = "✍️ 推文生成图片 🎨";
            // textContent = "🎨 以圖片形式分享推文內容";
            return textContent;
            break;
        /*
    case 'ja':
        textContent = "写真をダウンロードする";
        return textContent;
        break;
        */
        case 'en':
            textContent = '✍️ Tweet to Image 🎨';
            return textContent;
            break;
        /*
    case 'ru':
        textContent = "Скачать картинки";
        return textContent;
        break;
        */
        default:
            textContent = '✍️ Tweet to Image 🎨';
            return textContent;
            break;
    }
}


function dlpics_innerText() { // [LOADER]/[VID]
    // 判断当前网页语言
    var language = document.querySelector('html').lang; // en/ja/zh/ru/zh-Hant
    var textContent = '';
    switch (language) { //
        case 'zh':
            textContent = "⏬ 仅图片";
            return textContent;
            break;
        case 'zh-Hant':
            textContent = "⏬ 僅圖片";
            return textContent;
            break;
        /*
    case 'ja':
        textContent = "写真をダウンロードする";
        return textContent;
        break;
        */
        case 'en':
            textContent = '⏬ Photo.';
            return textContent;
            break;
        /*
    case 'ru':
        textContent = "Скачать картинки";
        return textContent;
        break;
        */
        default:
            textContent = '⏬ Photo.';
            return textContent;
            break;
    }
}


function promp_innerText() { // [LOADER]/[VID]
    // 判断当前网页语言
    var language = document.querySelector('html').lang; // en/ja/zh/ru/zh-Hant
    var textContent = '';
    switch (language) { //
        case 'zh':
            textContent = "手机端用户：当浏览器提示保存/下载图片时，请尽可能快的点击确认按钮!（在本次会话中，本信息只会出现两次，累计会出现五次，以便你可以很好的了解如何操作下载图片）";
            return textContent;
            break;
        case 'zh-Hant':
            textContent = "手機端用戶：當瀏覽器提示儲存/下載圖片時，請盡可能快的點擊確認按鈕!（在本次會話中，本資訊只會出現兩次，累計會出現五次，以便你可以很好的了解如何操作下載圖片）";
            return textContent;
            break;
        case 'en':
            textContent = 'Mobile users: When the browser prompts you to save/download the image, please click the confirmation button as quickly as possible! (In this session, this message will only appear twice, and it will appear five times in total, so that you can Learn how to download images)';
            return textContent;
            break;
        default:
            textContent = 'Mobile users: When the browser prompts you to save/download the image, please click the confirmation button as quickly as possible! (In this session, this message will only appear twice, and it will appear five times in total, so that you can Learn how to download images)';
            return textContent;
            break;
    }
}

if (localStorage.getItem('clickcount') == '' || localStorage.getItem('clickcount') == null) {
    var twdl_clickCount = 0;
    console.log("twdl_clickCount 设置 为 " + '0')
} else {
    var twdl_clickCount = localStorage.getItem('clickcount');
    console.log("twdl_clickCount 设置 为 " + localStorage.getItem('clickcount'))
}


function showCustomAlert(message) {
    // 检查是否已经存在悬浮窗，避免重复创建
    if (document.getElementById('custom-alert')) return;

    // 创建悬浮窗容器
    const alertBox = document.createElement('div');
    alertBox.id = 'custom-alert';
    alertBox.style.position = 'fixed';
    alertBox.style.top = '50%';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translate(-50%, -50%)';
    alertBox.style.backgroundColor = '#fff';
    alertBox.style.padding = '20px';
    alertBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    alertBox.style.zIndex = '1000';
    alertBox.style.textAlign = 'center';

    // 添加提示信息
    const messageText = document.createElement('p');
    messageText.textContent = message;
    alertBox.appendChild(messageText);

    // 添加确认按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '确认';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#007BFF';
    closeButton.style.color = '#fff';
    closeButton.style.borderRadius = '4px';
    closeButton.style.cursor = 'pointer';

    closeButton.onclick = () => {
        document.body.removeChild(alertBox);
    };

    alertBox.appendChild(closeButton);

    // 将悬浮窗添加到页面
    document.body.appendChild(alertBox);
}

function dlpicsfromURL(imgsrcURL, userName, article, nickName) {

    console.log(nickName + ' ' + userName + ' ' + imgsrcURL)

    if (imgsrcURL.length == 0) {
        //// alert(iftwnopics_innerText())
        showCustomAlert(iftwnopics_innerText());
    } else {
        if (navigator.userAgent.toString().toLowerCase().search(/android|iphone|mobile/) !== -1) {
            sessionStorage.setItem('clickcount', twdl_clickCount += 1) // 点击下载图片按钮次数统计
            localStorage.setItem('clickcount', twdl_clickCount) // 点击下载图片按钮次数统计
            if (sessionStorage.getItem('clickcount') < 3 && localStorage.getItem('clickcount') < 5) { // 如果已经提示了两次则之后不会在在本次session提示
                //// alert(promp_innerText())
                showCustomAlert(promp_innerText());
            }
        }

        // Part of the code is modified from CodeingShare
        // https://ww4k.com/CodeingShare/donwload_image_difference_domain.html
        // 解决跨域 Canvas 污染问题

        var timeloop = 0;

        console.log(imgsrcURL.length + ' length')

        imgsrcURL.forEach((x) => {
            console.log("imgsrcURL" + x)
        })

        //imgsrcURL.forEach((x, index) => {

        for (var i = 0; i < imgsrcURL.length; i++) {

            console.log("i=" + i + ' atx')

            if (navigator.userAgent.toString().toLowerCase().search(/android|iphone|mobile/) !== -1) { //  如果当前浏览器代理为手机代理
                timeloop = 1
                console.log('userAgent: Mobile')
            } else if (navigator.userAgent.toString().toLowerCase().search(/chrome/) !== -1) {
                timeloop = 0
                console.log('userAgent: Not Mobile but chrome')
            } else {
                timeloop = 1
                console.log('userAgent: Not Mobile but Safari')
            }

            function timeDelay(i) {

                function dlTime(pic) {
                    var img = new Image() // 设置延时

                    try {
                        img.src = document.querySelector("[src='" + imgsrcURL[pic] + "']").src
                    } catch (error) {

                    }

                    var dltime = (Math.ceil(img.width * img.height / 1048576) * 1000)

                    if (dltime == 1000) {
                        dltime = 2500
                    } else {
                        dltime = (dltime * 0.25 + 2000)
                    }

                    if (img.complete) {
                        console.log('图片大小已计算；图片已销毁🏅')
                        img = null;
                    }

                    console.log('dltime:' + dltime + 'ms')
                    return dltime
                }

                if (i == 0) {
                    console.log(0 + "ms")
                    return 0;
                } else if (i == 1) {
                    console.log(dlTime(i - 1) + 'ms' + '后开始下载第' + (i + 1) + "张图片")
                    return dlTime(i - 1)
                } else if (i == 2) {
                    console.log((dlTime(i - 1) + dlTime(i - 2)) + 'ms' + '后开始下载第' + (i + 1) + "张")
                    return (dlTime(i - 1) + dlTime(i - 2))
                } else {
                    console.log((dlTime(i - 1) + dlTime(i - 2) + dlTime(i - 3)) + 'ms' + '后开始下载第' + (i + 1) + "张")
                    return (dlTime(i - 1) + dlTime(i - 2) + dlTime(i - 3))
                }

            }

            (function (index) {
                setTimeout(() => {
                    var image = new Image()
                    image.setAttribute("crossOrigin", "anonymous");
                    image.src = imgsrcURL[index];
                    image.onload = function () {
                        var canvas = document.createElement("canvas");
                        canvas.id = 'twdl'
                        canvas.width = image.width;
                        canvas.height = image.height;
                        var context = canvas.getContext("2d");
                        context.drawImage(image, 0, 0, image.width, image.height);
                        var url = canvas.toDataURL("image/jpeg", 1.0);
                        var a = document.createElement("a");
                        a.download = nickName + "-" + formatTimetoNumber() || userName + "-" + formatTimetoNumber() || "photo" + "-" + formatTimetoNumber();
                        a.href = url;
                        // a.textContent = userName + ' '
                        // article.querySelector('div.house').appendChild(a)

                        var event = new MouseEvent("click");
                        event.initEvent('click', true, true);
                        a.dispatchEvent(event);
                        // 清除整个Canvas
                        context.clearRect(0, 0, image.width, image.height);
                        canvas.remove()
                        canvas = null;
                        context = null;

                        if (image.complete) {
                            console.log('图片已下载；图片已销毁🏅')
                            image = null;
                        }

                    }
                }, timeDelay(i) * timeloop)
            })(i)
        }

        // })

    }
}


function formatTimetoNumber() {
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const currentPureNumber =
        now.getFullYear().toString() +
        pad(now.getMonth() + 1) +
        pad(now.getDate()) +
        pad(now.getHours()) +
        pad(now.getMinutes()) +
        pad(now.getSeconds());
    console.log(currentPureNumber);
    return currentPureNumber;
}


function get_imgsURL(article, userName) {
    var url = [];
    var large_regex = new RegExp(/name=.*/ig)

    article.querySelectorAll('a[class=' + userName + ']').forEach((x) => {
        url.push((x.toString().replace(large_regex, 'name=4096x4096'))) // 默认下载最大化图片
    })

    url.forEach((x) => {
        console.log('get_imgsURL ->' + x)
    })
    return url;
}

var regex_name = new RegExp(/\/status\/\d{10,100}.*/gi) // 正则匹配对的 Tweet url
var twURL_regex = new RegExp(/\b^https:\/\/x\.com\/.*?\/status\/\d{10,100}\b/gi) // 正则匹配对的 Tweet url

function userName(article, nickName) {
    var fileName = ''; // 获取推文用户名
    if (nickName !== 'nickName') {

        article.querySelectorAll('a').forEach((x) => { // 获取 twitter url
            if (x.href.match(twURL_regex)) {
                fileName = x.href.replaceAll('https://x.com/', '').replaceAll(regex_name, '')
            }
        })
    } else {
        if (article.querySelectorAll('a')[1].textContent !== '') {
            fileName = article.querySelectorAll('a')[1].textContent.replaceAll('.', '')
        } else {
            fileName = article.querySelectorAll('a')[2].textContent.replaceAll('.', '')
        }
        console.log('fileName: ' + fileName)
    }

    return fileName;
}

// userName(document.querySelectorAll('[data-testid="cellInnerDiv"]')[0],'nickName')

async function twdl() {
    if (document.querySelectorAll('[data-testid="cellInnerDiv"]')) {
        var large_regex = new RegExp(/name=.*/ig)
        var article = document.querySelectorAll('[data-testid="cellInnerDiv"]')
        for (let i = 0; i < article.length; i++) { // twittervid

            if (article[i].querySelector('.house') == null && (article[i].querySelector('[data-testid="videoPlayer"]') || article[i].querySelectorAll('[dir=auto][lang]')[0] || article[i].querySelectorAll("img[src*='name=']").length >= 1)) { // 如果 article[i] 不包含 .house ，但 article[i] 包含图片或视频，那么创建 .house


                var house = document.createElement('div')
                house.className = 'house'

                // var vid = twdl_div(article[i], 'https://twittervid.com/', 'twdl twittervid', downloader_innerText('[VID]'))
                var loader_ = twdl_div(article[i], 'https://twittervideodownloader.com/', 'twdl download_pics', downloader_innerText(''))
                var twee = twdl_div(article[i], 'https://tweeload.com/', 'twdl download_pics', downloader_innerText(''))
                var twittervideomp = twdl_div(article[i], 'https://twittervideomp4.com/', 'twdl download_pics', downloader_innerText(''))
                var help = twdl_div(article[i], 'https://greasyfork.org/zh-CN/scripts/478651-twitter-%E7%BD%91%E9%A1%B5%E7%89%88%E5%A4%9A%E8%A7%86%E9%A2%91-gif%E4%B8%8B%E8%BD%BD-limbopro', 'twdl twdlhidden', '❓ Need Help?')



                // 分享推文截图按钮 以图片形式分享推文
                var tw2Canvas2Share = document.createElement('button')
                tw2Canvas2Share.className = 'twdl twdlshare'
                tw2Canvas2Share.innerText = dlpics_shareTweetAsImg()

                tw2Canvas2Share.onclick = function () {

                    var fcNumber = '';
                    var timeRight = '';
                    if (article[i].querySelector('time').textContent.search(/2025/) !== -1) {
                        timeRight = article[i].querySelector('time').textContent
                    } else {
                        timeRight = article[i].querySelector('time').getAttribute('datetime')
                    }

                    // 替换推文内容中的Emoji为文本
                    function twEmojiToText(article) {
                        console.log('twEmojiToTexting')
                        console.log(article)

                        if (article !== '') {
                            var twparentElement = article.querySelectorAll('[dir="auto"][lang]')[0].childNodes
                            twparentElement.forEach((node) => {
                                console.log(node.nodeName);
                                if (node.nodeName === "IMG") {
                                    // 创建一个文本节点，值为 alt 的内容
                                    const textNode = document.createTextNode(node.alt);
                                    node.parentNode.insertBefore(textNode, node);
                                    // 删除原有的图片节点
                                    node.parentNode.removeChild(node);
                                }
                            });
                        }

                    }


                    try { twEmojiToText(article[i]) } catch (e) {
                        console.log('没有找到推文文本内容')
                    }


                    var twContent_ori = getTweetContent(article[i], 'content') // 获取推文内容

                    function getTweetContent(article, x) { // 获取推文内容及引用
                        //xx twEmojiToText(article) // 替换推文内容中的Emoji为文本
                        var tweetContent = '';
                        var tweetContentlength = article.querySelectorAll('[dir="auto"][lang]').length
                        try {

                            if (x == 'reply') {
                                if (tweetContentlength == 3) {
                                    tweetContent = article.querySelectorAll('[dir="auto"][lang]')[2].textContent + "\n\n";
                                } else if (tweetContentlength == 2 && article.querySelector('[aria-expanded="true"]') == null) { // 判断是否有翻译按钮 存在翻译
                                    tweetContent = article.querySelectorAll('[dir="auto"][lang]')[1].textContent + "\n\n";
                                } else {
                                    console.log('没有找到推文文本内容')
                                }
                            }

                            if (x == 'content') {
                                if (tweetContentlength == 3) {
                                    for (var i = 0; i < 2; i++) {
                                        tweetContent += article.querySelectorAll('[dir="auto"][lang]')[i].textContent + "\n\n";
                                    }
                                } else if (tweetContentlength == 2 && article.querySelector('[aria-expanded="true"]') == null) {
                                    tweetContent = article.querySelectorAll('[dir="auto"][lang]')[0].textContent + "\n\n";
                                } else {

                                    for (var i = 0; i < tweetContentlength; i++) {
                                        tweetContent += article.querySelectorAll('[dir="auto"][lang]')[i].textContent + "\n\n";
                                    }

                                    if (tweetContent.length == 0) {
                                        tweetContent += '发现一条推文，\n分享给你！'
                                        console.log('没有找到推文文本内容')
                                    }

                                }
                            }

                            console.log('tweetContent: ' + tweetContent)

                        } catch (e) {
                            console.log('没有找到推文文本内容')
                            tweetContent = '发现一条推文，\n分享给你！'
                        }

                        return tweetContent;

                    }

                    var twContent_reply = '' // 获取推文内容

                    // twContent_reply
                    if (document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]').length == 1) {
                        console.log('推文存在转发评论')

                        var masterline = document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]')[0] ? document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]')[0] : '';
                        var xp_ori = document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]')[0].querySelectorAll('[data-testid="cellInnerDiv"]')[0] ? masterline.querySelectorAll('[data-testid="cellInnerDiv"]')[0] : ''; // 获取推文内容
                        var xp_reply = document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]')[0].querySelectorAll('[data-testid="cellInnerDiv"]')[1] ? masterline.querySelectorAll('[data-testid="cellInnerDiv"]')[1] : '';
                        var xp_replybyreply = document.querySelectorAll("main[role='main']")[0].querySelectorAll('[data-testid="primaryColumn"]')[0].querySelectorAll('[data-testid="cellInnerDiv"]')[2] ? masterline.querySelectorAll('[data-testid="cellInnerDiv"]')[2] : ''; // 获取推文内容


                        [xp_ori, xp_reply, xp_replybyreply].forEach((x, index, array) => {
                            if (x !== '') {
                                console.log(`xp_ 索引: ${index}`);
                                console.log('xp_' + masterline.querySelectorAll('[dir="auto"][lang]').length + ' 个回复↩️')
                            } else {
                                console.log(`xp_ 索引: ${index}`);
                                console.log('xp_ ' + masterline.querySelectorAll('[dir="auto"][lang]').length + ' 个回复↩️')
                            }
                        })

                        console.log('xp_window.location.href:' + window.location.href)

                        if (regex_name.test(window.location.href) && article[i] !== xp_ori && (twdl_url(xp_ori) == window.location.href || twdl_url(xp_replybyreply) == window.location.href || twdl_url(xp_reply) == window.location.href)) { // 判断是否存在转发评论

                            var test = ''

                            if (twdl_url(xp_ori) == window.location.href) {
                                test = xp_ori
                                console.log('xp_ori: ' + twdl_url(xp_ori))
                            } else if (twdl_url(xp_reply) == window.location.href) {
                                test = xp_ori
                                console.log('xp_reply: ' + twdl_url(xp_reply))
                            } else if (twdl_url(xp_replybyreply) == window.location.href) {
                                test = xp_ori
                                console.log('xp_replybyreply: ' + twdl_url(xp_replybyreply))
                            } else {
                                console.log('无法匹配!')
                            }

                            twContent_reply = "✍️ Reply Quote from " + userName(xp_ori, 'nickName') + "@" + userName(xp_ori) + ":\n" + getTweetContent(test, 'content')// 获取推文内容

                        } else {
                            twContent_reply = '';
                        }
                    }

                    function getQuote(article, x) {
                        // twEmojiToText(article) // 替换推文内容中的Emoji为文本
                        var getQuote = ''
                        if (x == 'reply') { // reply
                            getQuote = article.querySelectorAll('[dir="auto"][lang]')[0].parentElement.parentElement.textContent
                            //// getQuote = "@" + userName(article) + " " + userName(article, 'nickName') + ": " + article.querySelectorAll('[dir="auto"][lang]')[0].parentElement.parentElement.textContent
                            console.log('getQuote: ' + getQuote)
                        } else { // retweet
                            if (article.querySelectorAll('[dir="auto"][lang]').length == 2) {
                                console.log(article.querySelectorAll('[dir="auto"][lang]').length + ' length')
                                if (article.querySelector('[aria-expanded="true"]') !== null) { // 存在翻译
                                    if (article.querySelectorAll('[dir="auto"][lang]')[1]) {
                                    }
                                } else { // 存在回复

                                    try {

                                        if (article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('[dir="ltr"][aria-hidden="true"]').textContent == ' · ') { } else {
                                            article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('[dir="ltr"][aria-hidden="true"]').textContent = " · "
                                            article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('time').textContent = " " + article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('time').textContent + " · "
                                            article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('span[dir="ltr"]').textContent = " · " + article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('span[dir="ltr"]').textContent + " · " // 修改引用回复内容 + ·
                                        }
                                    } catch (e) {
                                        console.log('没有发现 . ')
                                    }
                                    getQuote = article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.textContent // effect
                                    console.log('getQuote: ' + getQuote)
                                }
                            } else if (article.querySelectorAll('[dir="auto"][lang]').length == 3) { // 存在翻译 回复
                                try { // span[dir="ltr"]
                                    if (article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('[dir="ltr"][aria-hidden="true"]').textContent == ' · ') { } else {
                                        article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('[dir="ltr"][aria-hidden="true"]').textContent = " · "
                                        article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('time').textContent = " " + article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('time').textContent + " · "
                                        article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('span[dir="ltr"]').textContent = " · " + article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('span[dir="ltr"]').textContent + " · " // 修改引用回复内容 + ·
                                    }
                                } catch (e) {
                                    console.log('没有发现 . ')
                                }

                                getQuote = article.querySelectorAll('[dir="auto"][lang]')[2].parentElement.parentElement.textContent // efect

                                try {
                                    console.log(article.querySelectorAll('[dir="auto"][lang]')[1].parentElement.parentElement.querySelector('time').textContent)
                                } catch (e) {
                                    console.log('没有发现时间')
                                }
                                console.log('getQuote: ' + getQuote)
                            } else {
                                console.log(article.querySelectorAll('[dir="auto"][lang]').length + ' length')
                            }
                            console.log('twContent_retweetComments: ' + getQuote)
                        }
                        return getQuote
                    }

                    if (fcNumber == '1') {
                        alert('没有找到推文文本内容!')
                    } else {

                        var twContent_ori = getTweetContent(article[i], 'content') // 获取推文内容
                        var twContent_retweetComments = getQuote(article[i]);
                        var twlikesCount = article[i].querySelector('div[aria-label][role="group"]').getAttribute('aria-label');
                        var twvideosCount = article[i].querySelectorAll('[data-testid="videoPlayer"]').length;
                        var twimgsCount = article[i].querySelectorAll("img[src*='name=']").length;
                        var twUrl = twdl_url(article[i])
                        var dlNmae = userName(article[i])
                        var twTime = timeRight;
                        var twUsername = userName(article[i], 'nickName') + "@" + userName(article[i]);

                        tw2Canvas_fc(twContent_ori, twUsername, twTime, dlNmae, twUrl, twimgsCount, twvideosCount, twlikesCount, twContent_retweetComments, twContent_reply)
                        console.log('以图片形式分享推文文本内容')
                    }

                }


                // 隐藏所有按钮
                var hiddenDiv = document.createElement('button')
                hiddenDiv.className = 'twdl twdlhidden'
                hiddenDiv.innerText = '隐藏'
                hiddenDiv.onclick = function () {
                    article[i].querySelector('.house').style.display = 'none'
                    // alert('已隐藏')
                }

                var imgsdownloader = document.createElement('a')
                imgsdownloader.className = 'twdl download_pics twdlimgs'
                imgsdownloader.innerText = dlpics_innerText()

                article[i].querySelectorAll("img[src*='name=']").forEach((x) => {
                    var a = document.createElement('a')
                    a.href = x.src
                    a.className = "twdl_" + userName(article[i])
                    house.appendChild(a)
                    console.log("图片地址: " + a.href)
                })


                // 创建按钮容器
                var twdlContainerDown = document.createElement('div')
                twdlContainerDown.className = 'twdlContainerDown'

                var twdlContainerHelp = twdlContainerDown.cloneNode(true)

                var arrayContainer = [imgsdownloader, twee, twittervideomp] // 下载器集中一处
                arrayContainer.forEach((x) => {
                    twdlContainerDown.appendChild(x)
                })

                var arrayContainerClone = [help, hiddenDiv]
                arrayContainerClone.forEach((x) => {
                    twdlContainerHelp.appendChild(x)
                })

                var array = [twdlContainerDown, tw2Canvas2Share, twdlContainerHelp]

                array.forEach((x) => {
                    house.appendChild(x)
                })


                if (article[i].querySelectorAll("div.css-175oi2r.r-12kyg2d")[0] && article[i].querySelector('[data-testid="videoPlayer"]') && article[i].querySelectorAll('[dir=auto][lang]')[0] == undefined) { // 推文存在文字图片且有视频的情况下
                    //article[i].querySelectorAll("div.css-175oi2r.r-12kyg2d")[0].appendChild(house);
                    article[i].querySelector('[data-testid="videoPlayer"]').parentElement.parentElement.appendChild(house);
                    ////article[i].querySelectorAll('[dir=auto][lang]')[0].parentElement.appendChild(house);
                    console.log('//x 推文存在文字图片且有视频的情况下')

                } else if (article[i].querySelectorAll('[dir=auto][lang]')[0] && article[i].querySelector('[data-testid="videoPlayer"]')) {  // 推文存在文字且有视频的情况下
                    article[i].querySelectorAll('[dir=auto][lang]')[0].parentElement.appendChild(house);
                    console.log('//x 推文存在文字且有视频的情况下')

                } else if (article[i].querySelector('[data-testid="videoPlayer"]')) { // 推文没有文字图片仅有视频的情况下
                    article[i].querySelector("[data-testid='videoComponent']").appendChild(house);
                    console.log('//x 推文没有文字图片仅有视频的情况下')

                } else if (article[i].querySelectorAll('[dir=auto][lang]')[0] && article[i].querySelectorAll("img[src*='name=']").length >= 1) { // 有图片也有文字的情况下
                    article[i].querySelectorAll('[dir=auto][lang]')[0].parentElement.appendChild(house);
                    article[i].querySelectorAll("img[src*='name=']").forEach((x) => {
                        x.src = x.src.replace(large_regex, 'name=4096x4096')
                        console.log('4096x4096')
                    })

                } else if (article[i].querySelectorAll("img[src*='name=']").length >= 1 && article[i].querySelectorAll("img")[1] !== null) { // 仅只有图片的情况下
                    // article[i].querySelectorAll("img[src*='name=']")[0].parentNode.appendChild(house);
                    house.classList.add('houseab');
                    article[i].querySelectorAll("div[aria-labelledby]")[0].parentNode.insertBefore(house, article[i].querySelectorAll("div[aria-labelledby]")[0].nextElementSibling)

                    article[i].querySelectorAll("img[src*='name=']").forEach((x) => {
                        x.src = x.src.replace(large_regex, 'name=4096x4096')
                        console.log('//x name=4096x4096')
                    })
                    console.log('//x 只有图片的情况下')
                } else {
                    article[i].querySelectorAll('[dir=auto][lang]')[0].parentElement.append(house);
                    // document.querySelectorAll('[data-testid="cellInnerDiv"]')[0].querySelectorAll('[dir=auto][lang]')[0].parentElement.append(house);
                    console.log('//x [dir=auto][lang]') // 2333

                }

                // } catch (error) { }

                imgsdownloader.addEventListener('click', () => {
                    dlpicsfromURL(get_imgsURL(article[i], "twdl_" + userName(article[i])), userName(article[i]), '', userName(article[i], 'nickName'))
                })


            } else {
                console.log(userName(article[i]) + " " + twdl_url(article[i]) + " 啥也没有...")
            }

        }

    }
}

window.addEventListener('load', function () {
    console.log('页面加载成功🏅...')
    twdl()
});

window.onpopstate = function (event) {
    twdl()
    console.log("URL has changed!");
}

setInterval(() => {
    var scrollY = window.pageYOffset;
    setTimeout(() => {
        if (scrollY !== window.pageYOffset) {
            twdl()
            console.log('滚动条动了...')
        } else {
            console.log('滚动条未动...')
        }
    }, 2500)
}, 1500)


function inDownloaderPage() { // 获取当前网页 url -> 给 input 赋值 -> 点击下载按钮
    // 当前网页是下载器页面时，获取当前网页 url -> 给 input 赋值 -> 点击下载按钮

    if (window.location.href.match(/(twittervid\.com)/gi)) { // vid
        if (document.querySelector('#tweetUrl') !== null && document.querySelector('#loadVideos') !== null) {
            document.querySelector('#tweetUrl').value = window.location.href.replace('https://twittervid.com/#', '')
            if (document.querySelector('#tweetUrl').value == 'https://twittervid.com/') {
            } else if (document.querySelector('#tweetUrl').value.match(twURL_regex)) {
                document.querySelector('#loadVideos').click()
            }
        }
    }

    if (window.location.href.match(/(twittervideodownloader\.com)/gi)) { // loader 获取url 并点击下载按钮
        if (document.querySelector('#tweetURL') !== null && document.querySelector('#submitBtn') !== null) {
            document.querySelector('#tweetURL').value = window.location.href.replace('https://twittervideodownloader.com/#', '')
            if (document.querySelector('#tweetURL').value == 'https://twittervideodownloader.com/') {
            } else if (document.querySelector('#tweetUrl').value.match(twURL_regex)) {
                document.querySelector('#submitBtn').click()
            }
        }
    }

    if (window.location.href.match(/(tweeload\.com)/gi)) { // twee 获取url 并点击下载按钮

        setTimeout(() => {

            // 立即执行的函数，避免污染全局作用域
            (function () {
                // 获取当前 URL 中 # 后面的部分
                const urlHash = window.location.hash;

                // 检查 hash 是否存在并且看起来像一个推文/X的链接
                // 我们检查它是否包含 /status/ 来判断
                if (urlHash && urlHash.includes('/status/')) {

                    // 使用正则表达式来提取纯数字的状态ID
                    // 这样做比分割字符串更可靠，可以处理像 /analytics 这样的尾部
                    const match = urlHash.match(/\/status\/(\d+)/);

                    // 检查是否成功匹配到了 ID
                    if (match && match[1]) {
                        const statusId = match[1];

                        // 构建新的目标 URL
                        const newUrl = `https://tweeload.com/i/status/${statusId}`;

                        // 执行重定向
                        window.location.href = newUrl;
                    }
                }
            })();

        }, 1000)
    }

    if (window.location.href.match(/(twittervideomp4\.com)/gi)) { // twittervideomp4 获取url 并点击下载按钮
        setTimeout(() => {
            if (document.querySelector('#txt-url') !== null && document.querySelector('button#btn-submit') !== null) {
                document.querySelector('#txt-url').value = window.location.href.replace('https://twittervideomp4.com/#', '')
                if (document.querySelector('#txt-url').value == 'https://twittervideomp4.com/') {
                } else if (document.querySelector('#txt-url').value.match(twURL_regex)) {
                    document.querySelector('button#btn-submit').click()
                }
            }
        }, 1000)
    }

}

if (window.location.href.match(/(twittervid\.com|twittervideodownloader|tweeload|twittervideomp4)/gi) !== null) {
    inDownloaderPage()
}


// 23333
// 分享推文截图按钮
// 以图片形式分享推文文本内容

function tw2Canvas_fc(twContent_ori, twUsername, twTime, dlNmae, twUrl, twimgsCount, twvideosCount, twlikesCount, twContent_retweetComments, twContent_reply) {
    console.log("Message//" + twContent_ori, twUsername, twTime, dlNmae, twUrl, twContent_reply);

    // 等待 qrcode 库加载完成

    function insertEveryOther(arr, value) {
        for (let i = 1; i <= arr.length; i += 2) {
            arr.splice(i, 0, value);
        }
        return arr;
    }

    function splitArrayFields(arr, delimiter) {
        return arr.map(item => {
            // 如果字段是字符串并且包含分隔符，则分拆为子数组
            if (typeof item === 'string' && item.includes(delimiter)) {
                return item.split(delimiter);
            }
            // 如果字段不是字符串或不包含分隔符，直接返回原值
            return item;
        });
    }

    function recursiveFlatten(arr) {
        return arr.reduce((acc, item) => {
            if (Array.isArray(item)) {
                return acc.concat(recursiveFlatten(item)); // 递归展开
            }
            return acc.concat(item);
        }, []);
    }


    const valueToInsert = ' ';
    const delimiter = '\n'; // 使用\n分隔字段

    try { var tempArr_ori = twContent_ori.split('\n\n') } catch (e) {
        console.log('wtf:没有找到推文文本内容')
        // var tempArr_ori = ['发现一条推文，\n分享给你！']
    }

    var resultArray_ori = insertEveryOther(tempArr_ori, valueToInsert);
    resultArray_ori = splitArrayFields(resultArray_ori, delimiter);
    const twContent_ori_segments = recursiveFlatten(resultArray_ori);

    console.log("twContent_ori:", twContent_ori);
    console.log("resultArray_ori:", resultArray_ori);
    console.log("twContent_ori_segments:", twContent_ori_segments);

    // 创建画布元素
    var canvas = document.createElement("canvas");
    canvas.id = "tweetCanvas";
    canvas.style.zIndex = "-9999";
    canvas.style.position = "absolute";
    const context = canvas.getContext("2d");

    // 设置画布宽度和默认配置
    // canvas.width = 720 * 1.8;
    canvas.width = 1170;
    var paddingbottom = 125 * 1.3;

    if (typeof QRCode !== 'undefined') {
        paddingbottom = 150 * 2.4;
    }

    const padding = { left: 32 * 1.8, right: 32 * 1.8, top: 125 * 1.8, bottom: paddingbottom }; // 上下左右内边距
    const lineSpacing = 7; // 行高设置为 12px 7


    if (twimgsCount >= 1) {
    } else {
        twimgsCount = 0;
    }

    if (twvideosCount >= 1) {
    } else {
        twvideosCount = 0;
    }

    var twContent_retweetComments_true = ''
    if (twContent_retweetComments == '') {
    } else {
        twContent_retweetComments_true = '✍️ Retweet Quote from "' + twContent_retweetComments + '"'
    }

    var twContent_reply_true = ''
    if (twContent_reply == '') {
        twContent_reply_true = []
    } else {

        try { var tempArr_reply = twContent_reply.split('\n\n') } catch (e) {
        }

        var resultArray_reply = insertEveryOther(tempArr_reply, valueToInsert);
        resultArray_reply = splitArrayFields(resultArray_reply, delimiter);
        const twContent_reply_segments = recursiveFlatten(resultArray_reply);
        twContent_reply_true = twContent_reply_segments;
        console.log("twContent_reply:", twContent_reply);
        // twContent_reply_true = 'reply Quote✍️ "' + twContent_reply + '"'
    }

    // 文本内容及其样式
    const texts = [ // 内容
        ...twContent_ori_segments.map(segment => ({ content: segment, fontSize: 40 * 1.8 })), // 将拆分的段落加入 texts
        { content: twContent_retweetComments_true, fontSize: 22 * 1.8 },
        ...twContent_reply_true.map(segment => ({ content: segment, fontSize: 22 * 1.8 })), // 将拆分的段落加入 texts
        { content: "————————————————", fontSize: 15 * 1.8 },
        { content: "图片 " + twimgsCount + " 张、 " + "视频 " + twvideosCount + " 个; ", fontSize: 15 * 1.8 },
        { content: twlikesCount + ";", fontSize: 15 * 1.8 },
        { content: " ", fontSize: 15 * 1.8 },
        { content: twUsername, fontSize: 25 * 1.8 },
        { content: twUrl, fontSize: 15 * 1.8 },
        { content: twTime, fontSize: 15 * 1.8 },
    ];

    // 计算每段文本的行数及总高度
    function calculateTextHeight() {
        let totalHeight = padding.top + padding.bottom;
        texts.forEach((text, index) => {
            const lines = wrapText(context, text.content, canvas.width - padding.left - padding.right, text.fontSize);
            totalHeight += lines.length * (text.fontSize + lineSpacing) + (index > 0 ? lineSpacing : 0);
        });
        return totalHeight;
    }

    // 自动换行
    // 自动换行
    function wrapText(ctx, text, maxWidth, fontSize) {
        ctx.font = `${fontSize}px Arial`;
        const enter = /\n/g;
        const whitespace = /\s+/g;

        // 将文本按空格和换行符分割
        const words = text.split(/(\s+|[\u4e00-\u9fa5])/).filter(Boolean); // 支持中英文分割
        const lines = [];
        let currentLine = "";

        // 正则匹配中文标点符号
        const chinesePunctuation = /[，。、；：？！‘’“”（）《》【】]/;

        words.forEach((word) => {
            // 如果单词太长，强制截断
            while (ctx.measureText(word).width > maxWidth) {
                const cutoffIndex = Math.floor(maxWidth / ctx.measureText(word[0]).width);
                const part = word.slice(0, cutoffIndex);
                lines.push(currentLine + part);
                word = word.slice(cutoffIndex);
                currentLine = "";
            }

            const testLine = currentLine + word;
            const testWidth = ctx.measureText(testLine).width;

            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        });

        if (currentLine) lines.push(currentLine.trim());

        // 确保标点符号不会出现在行首
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            if (chinesePunctuation.test(line[0])) {
                const punctuation = line[0];
                lines[i - 1] += punctuation;
                lines[i] = line.slice(1).trim();
            }
        }

        return lines;
    }

    // 设置画布高度
    canvas.height = calculateTextHeight();

    // 绘制红蓝渐变背景
    const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "blue");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制文本
    let currentY = padding.top;
    texts.forEach((text, index) => {
        const lines = wrapText(context, text.content, canvas.width - padding.left - padding.right, text.fontSize);
        // context.font = `${text.fontSize}px Arial`;
        context.fillStyle = "white";

        lines.forEach((line) => {
            const textWidth = context.measureText(line).width;
            // const x = (canvas.width - textWidth) / 2; // 居中
            const x = padding.left; // 左对齐 居左
            context.fillText(line, x, currentY);
            currentY += text.fontSize + lineSpacing;
        });

        currentY += lineSpacing;
    });



    // 下载按钮事件
    /*
    const link = document.createElement("a");
    link.download = dlNmae;
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
    */


    // 在 tw2Canvas_fc 函数末尾添加以下代码，用于生成二维码并绘制到画布上
    function drawQRCode(url, canvas, context, currentY) {

        // 检查 qrcode 库是否已加载
        typeof QRCode === 'undefined' && console.error('QRCode is not defined. Please ensure the qrcode library is loaded.');

        if (typeof QRCode === 'undefined') {
            console.error('QRCode library is not loaded.');
            return;
        } else {
            console.log('QRCode library is loaded.');
            // 创建二维码画布

            const qrCanvas = document.createElement("canvas");
            const qrSize = 200; // 二维码大小
            qrCanvas.width = qrSize;
            qrCanvas.height = qrSize;

            // 使用 qrcode 库生成二维码
            QRCode.toCanvas(qrCanvas, url, { width: qrSize, margin: 1 }, (error) => {
                if (error) {
                    console.error("生成二维码失败:", error);
                    return;
                }

                // 将二维码绘制到主画布上
                const qrX = (canvas.width - qrSize) / 2; // 居中
                context.drawImage(qrCanvas, qrX, currentY);

                // 在二维码下方添加两行小字
                const textFontSize = 14; // 小字字体大小
                context.font = `${textFontSize}px Arial`;
                context.fillStyle = "white";
                const text1 = "保存至相册->长按二维码识别";
                const text2 = "跳转查看";

                // 计算文本位置
                const textY1 = currentY + qrSize + 20; // 第一行文字的 Y 坐标
                const textY2 = textY1 + textFontSize + 5; // 第二行文字的 Y 坐标
                const textX1 = (canvas.width - context.measureText(text1).width) / 2; // 居中
                const textX2 = (canvas.width - context.measureText(text2).width) / 2; // 居中

                // 绘制文字
                context.fillText(text1, textX1, textY1);
                context.fillText(text2, textX2, textY2);
            });

        }
    }

    // 调用 drawQRCode 函数，将二维码和文字绘制到画布最下方
    try {
        drawQRCode(twUrl, canvas, context, currentY);
    } catch (e) {
        console.log('没有找到二维码');
    }

    // 将画布内容转换为图片
    const imageData = canvas.toDataURL("image/jpeg", 1.0)

    // 修改后的悬浮层代码
    const overlay = document.createElement("div");
    overlay.id = "imageOverlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9999";
    overlay.style.pointerEvents = "auto"; // 确保悬浮层可以响应鼠标事件

    // 添加点击事件，点击空白处关闭悬浮层
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    if (isMobile()) {
        console.log("当前浏览器为手机端");
    } else {
        console.log("当前浏览器为PC端");
        overlay.onclick = (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        };
    }

    // 创建图片元素
    const img = document.createElement("img");
    img.src = imageData;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.borderRadius = "10px";

    // 创建关闭按钮
    const closeButton = document.createElement("button");
    closeButton.innerText = "关闭";
    closeButton.style.position = "absolute";
    closeButton.style.top = "20px";
    closeButton.style.right = "20px"; // 调整位置，避免与下载按钮重叠
    closeButton.style.padding = "10px 20px";
    closeButton.style.fontSize = "16px";
    closeButton.style.color = "white";
    closeButton.style.backgroundColor = "red";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.cursor = "pointer";

    // 关闭按钮点击事件
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    // 创建下载按钮
    const downloadButton = document.createElement("button");
    downloadButton.innerText = "下载";
    downloadButton.style.position = "absolute";
    downloadButton.style.top = "20px";
    downloadButton.style.right = "100px";
    downloadButton.style.padding = "10px 20px";
    downloadButton.style.fontSize = "16px";
    downloadButton.style.color = "white";
    downloadButton.style.backgroundColor = "green";
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.cursor = "pointer";

    // 下载按钮点击事件
    downloadButton.onclick = () => {
        const link = document.createElement("a");
        link.download = twUsername; // 设置下载文件名
        link.href = imageData; // 使用生成的图片数据
        link.click();
    };

    // 将按钮按顺序添加到悬浮层
    overlay.appendChild(downloadButton); // 下载按钮
    overlay.appendChild(closeButton); // 关闭按钮

    // 将图片添加到悬浮层
    overlay.appendChild(img);

    // 将悬浮层添加到页面
    document.body.appendChild(overlay);

}
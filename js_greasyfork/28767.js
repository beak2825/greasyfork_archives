// ==UserScript==
// @name        yoedge-horizontal-screen
// @namespace   https://github.com/Lockvictor
// @author      Lockvictor
// @description 实现灰机汉化组漫画网站（yoedge.com）的横屏阅读模式
// @homepage    https://github.com/Lockvictor/yoedge-horizontal-screen
// @match       http://*.yoedge.com/smp-app/*
// @version     2.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28767/yoedge-horizontal-screen.user.js
// @updateURL https://update.greasyfork.org/scripts/28767/yoedge-horizontal-screen.meta.js
// ==/UserScript==

//漫画宽高比
var MANGA_ASPECT_RATIO = 1.5;

//默认屏幕占比
var DEFAULT_SCALE_RATIO = 0.6;
//最大占比，漫画与屏幕等宽
var MAX_SCALE_RATIO = 1;
//最小占比，漫画与屏幕等高，即原来的竖屏模式
var MIN_SCALE_RATIO = window.screen.height / MANGA_ASPECT_RATIO / window.screen.width;
//屏幕占比缩放步长
var SCALE_STEP = 0.05;

//j和k快捷键滚动屏幕的比例
var SCROLLBY_RATIO = 0.2;

//漫画当前屏幕占比
var gMangaAreaRatio = DEFAULT_SCALE_RATIO;

(function () {
    'use strict';

    document.body.innerHTML = '';
    document.addEventListener('contextmenu', function (event) {
        event.preventDefault();
    });

    //获取本话的配置信息，主要包括页数和图片的url
    var configString = get("smp_cfg.json");
    loadAllPage(JSON.parse(configString));
})();

function get(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);

    return xmlHttp.responseText;
}

function loadAllPage(config) {
    //获取图片url和序号
    var orderList = config.pages.order;
    var imageUrlList = config.pages.page;

    //创建漫画原图的img元素
    for (var i = 0; i < orderList.length; i++) {
        var order = orderList[i];
        var img = document.createElement('img');
        img.id = 'img' + order;
        img.style.display = 'none';
        img.src = imageUrlList[order];
        document.body.appendChild(img);
    }

    var imgElementList = document.getElementsByTagName('img');

    //图片传输需要时间，直接获取会出错，采用分次加载，每次加载5张图
    var loadStartIndex = 0;
    var loadEndIndex = 0;
    var LOAD_STEP = 5;
    var INDEX_LIMIT = imgElementList.length;
    // console.log(`INDEX_LIMIT: ${INDEX_LIMIT}`);
    var imgSizeCheckFlag = setInterval(function () {
        loadEndIndex = ((loadStartIndex + LOAD_STEP) > INDEX_LIMIT) ? INDEX_LIMIT : (loadStartIndex + LOAD_STEP);
        if (isImageOk(imgElementList, loadStartIndex, loadEndIndex)) {
            //用canvas绘制原图，实现反色块的处理
            drawImageByCanvas(orderList, imageUrlList, loadStartIndex, loadEndIndex);
            loadStartIndex = loadEndIndex;
        }

        if (loadStartIndex === INDEX_LIMIT) {
            clearInterval(imgSizeCheckFlag);
            for (var i = 0; i < orderList.length; i++) {
                var img = document.getElementById('img' + orderList[i]);
                document.body.removeChild(img);
            }
            imgElementList = null;
            addNextEpisodeButton();
        }
        // console.log('loadStartIndex: ' + loadStartIndex);
    }, 2000);

    // 自定义缩放、滚动等快捷键
    customizeShortcut();
}

function isImageOk(imgElementList, startIndex, endIndex) {
    var isLoaded = true;
    for (var i = startIndex; i < endIndex; i++) {
        var img = imgElementList[i];
        if (!img.complete || img.naturalWidth === 0) {
            isLoaded = false;
            break;
        }
    }
    return isLoaded;
}

function drawImageByCanvas(orderList, imageUrlList, startIndex, endIndex) {
    for (var i = startIndex; i < endIndex; i++) {
        var order = orderList[i];

        var img = document.getElementById('img' + order);
        var width = img.naturalWidth;
        var height = img.naturalHeight;
        // console.log(img);
        // console.log(`order: ${order}, width: ${width}, height: ${height}`);

        var mgcanv = document.createElement('canvas');
        mgcanv.id = 'canvas' + order;
        mgcanv.width = width;
        mgcanv.height = height;
        mgcanv.style.display = 'block';
        mgcanv.style.margin = '0 auto';
        mgcanv.style.width = numberToPercentage(gMangaAreaRatio);
        // console.log(mgcanv);

        var context = mgcanv.getContext('2d');
        context.drawImage(img, 0, 0);
        //前5张图没有反色块
        if (i > 4) {
            cleanClutter(imageUrlList[order], context, width, height);
        }
        document.body.appendChild(mgcanv);
        // console.log(mgcanv);
    }
}

function cleanClutter(imageUrl, context, width, height) {
    if (imageUrl && window.clutter && imageUrl.indexOf("pages") != -1 && width > 200 && height > 300 && (
        (imageUrl.indexOf('.png') != -1 && window.clutter == '1') ||
        (imageUrl.indexOf('.png') != -1 && window.clutter == '2' && smp.controller.type == '0' && imageUrl.match(/\/0{0,3}[1aA]\.png$/) !== null) ||
        (imageUrl.indexOf('.png') != -1 && window.clutter == '2' && smp.controller.type == '1' && imageUrl.match(/\/0?00[012345]\.png$/) === null) ||
        (imageUrl.indexOf('.jpg') != -1 && window.clutter == '2' && smp.controller.type == '1' && imageUrl.match(/\/0?00[012345]\.jpg$/) === null))) {
        var imageData = context.getImageData(0, 0, width, height);
        var data = imageData.data;

        var j1 = 0, j2 = 0;
        var r = width * 4, r1 = r * 110, r2 = r;
        var y1 = Math.floor(height >> 1) & 0xFFFFFFE;
        if (window.clutter == '2' && imageUrl.indexOf('.png') !== -1) {
            y1 = 100;
        }
        var x1 = Math.floor(width / 3);
        var x2 = x1 << 1;
        var y2 = y1 + 20;
        if (height > 550) {
            y2 = y1 + 60;
        }

        if (window.clutter == '2') {
            var lastOf = imageUrl.lastIndexOf('/');
            var fileName = decodeURI(imageUrl.substring(lastOf));
            if (fileName.indexOf("3") != -1) {
                y1 -= 8;
                y2 -= 11;
            } else if (fileName.indexOf("4") != -1) {
                y1 -= 6;
                y2 -= 13;
            } else if (fileName.indexOf("5") != -1) {
                y2 -= 14;
            } else if (fileName.indexOf("7") != -1) {
                y1 -= 2;
                y2 -= 3;
            } else if (fileName.indexOf("9") != -1) {
                y2 -= 13;
            } else if (fileName.indexOf("01") != -1) {
                y2 -= 11;
            } else if (fileName.indexOf("02") != -1) {
                y1 -= 12;
                y2 -= 17;
            }
            if (fileName.indexOf("4") != -1) {
                x1 -= 7;
                x2 -= 19;
            } else if (fileName.indexOf("5") != -1) {
                x1 -= 15;
                x2 -= 13;
            } else if (fileName.indexOf("6") != -1) {
                x1 -= 31;
                x2 = x1 + 76;
            } else if (fileName.indexOf("7") != -1) {
                x1 += 21;
            } else if (fileName.indexOf("8") != -1) {
                x2 -= 13;
            } else if (fileName.indexOf("01") != -1) {
                x2 = x1 + 99;
            } else if (fileName.indexOf("02") != -1) {
                x1 -= 13;
                x2 = x1 + 97;
            } else if (fileName.indexOf("03") != -1) {
                x2 = x1 + 91;
            }
        }
        var is = y1 * r + x1 * 4, i = 0;

        if (window.clutter == '2') {
            for (j1 = y1; j1 < y2; j1 += 1) {
                i = is;
                for (j2 = x1; j2 < x2; j2++) {
                    data[i + 2] = data[i + 2] ^ 0xFF;
                    data[i + 1] = data[i + 1] ^ 0xFF;
                    data[i] = data[i] ^ 0xFF;
                    i += 4;
                }
                x2--;
                is += r2;
            }
        } else {
            for (j1 = y1; j1 < y2; j1 += 1) {
                i = is;
                for (j2 = x1; j2 < x2; j2++) {
                    if (data[i + 3 - r1] !== 0) {
                        data[i + 2] = data[i + 2] ^ data[i + 2 - r1];
                        data[i + 1] = data[i + 1] ^ data[i + 1 - r1];
                        data[i] = data[i] ^ data[i - r1];
                    }
                    i += 4;
                }
                is += r2;
            }
        }

        context.putImageData(imageData, 0, 0);
    }
}

function addNextEpisodeButton() {
    var style = document.createElement('style');
    style.innerHTML = "#next-episode { display: block;  margin: 0 auto;  height: 70px;  background: rgba(211, 211, 211, 0.3) url('res/common/pre.png') no-repeat 50% 14px;}";
    style.innerHTML += "#next-episode:hover { background-color: rgba(211, 211, 211, 0.5); }";
    document.head.appendChild(style);

    var nextEpisodeButton = document.createElement('div');
    nextEpisodeButton.id = 'next-episode';
    nextEpisodeButton.style.width = numberToPercentage(gMangaAreaRatio);
    nextEpisodeButton.addEventListener('click', function (event) {
        smp.toolbar.nextApp();
    });
    document.body.appendChild(nextEpisodeButton);
}

function customizeShortcut() {
    // 漫画缩放、滚动、翻页
    // 缩放和滚动都可以持续响应，注册到keydown
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case '=':
                scale(SCALE_STEP);
                break;
            case '-':
                scale(-SCALE_STEP);
                break;
            case '0':
                gMangaAreaRatio = DEFAULT_SCALE_RATIO;
                scale(0);
                break;
            case 'j':
                smoothyScrollBy(0, screen.width * gMangaAreaRatio * MANGA_ASPECT_RATIO * SCROLLBY_RATIO);
                break;
            case 'k':
                smoothyScrollBy(0, -screen.width * gMangaAreaRatio * MANGA_ASPECT_RATIO * SCROLLBY_RATIO);
                break;
            case 'h':
                smoothyScrollTo(0, 0);
                break;
            case 'l':
                smoothyScrollTo(0, document.body.scrollHeight);
                break;
            default:
                break;
        }
    });

    // 跳转下一话是单次响应，注册到keyup
    document.addEventListener('keyup', function (event) {
        switch (event.key) {
            case 'n':
                smp.toolbar.nextApp();
                break;
            default:
                break;
        }
    });
}

function scale(increment) {
    var expectedScaleRatio = gMangaAreaRatio + increment;
    if (increment > 0) {
        gMangaAreaRatio = (expectedScaleRatio >= MAX_SCALE_RATIO) ? MAX_SCALE_RATIO : expectedScaleRatio;
    } else if (increment < 0) {
        gMangaAreaRatio = (expectedScaleRatio <= MIN_SCALE_RATIO) ? MIN_SCALE_RATIO : expectedScaleRatio;
    }

    var newWidth = numberToPercentage(gMangaAreaRatio);
    canvasList = document.getElementsByTagName('canvas');
    for (var i = 0; i < canvasList.length; i++) {
        canvasList[i].style.width = newWidth;
    }

    document.getElementById('next-episode').style.width = newWidth;
}


//=====================基础功能相关函数=====================
function smoothyScrollBy(offsetX, offsetY) {
    try {
        window.scrollBy({ top: offsetY, left: offsetX, behavior: 'smooth' });
    } catch (error) {
        window.scrollBy(offsetX, offsetY);
    }
}

function smoothyScrollTo(x, y) {
    try {
        window.scrollTo({ top: y, left: x, behavior: 'smooth' });
    } catch (error) {
        window.scrollTo(x, y);
    }
}

function numberToPercentage(value) {
    return Math.floor(100 * value) + '%';
}
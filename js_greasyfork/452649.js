// ==UserScript==

// @name:zh-CN  超链接预览器
// @name:zh-TW  超鏈接預覽器
// @name:ko     超鏈接預覽器
// @name:ja     超鏈接預覽器
// @name        linkPreviewer

// @namespace   leizingyiu.net

// @author      leizingyiu
// @version     2022.10.09

// @include     http*://*.one-tab.com/page/*
// @include     /http.*:\/\/\d*\.\d*\.\d*\.\d*:*\d*.*/
// @include     file://*
// @grant       none

// @description:zh-CN 在页面右侧预览超链接内容。直接点击链接，将在页面右侧打开链接内容；按 shift 点击链接，将在本页跳转到链接内容；按 ctrl 或 cmd 点击链接，将在新标签页打开链接内容；同时按 shift 和 ctrl 或 shift 加 cmd 点击右侧预览页面内部的链接，将在本页面跳转到点击链接的内容。请自行添加白名单。

// @description:zh-TW 在頁面右側預覽超鏈接內容。直接點擊鏈接，將在頁面右側打開鏈接內容；按 shift 點擊鏈接，將在本頁跳轉到鏈接內容；按 ctrl 或 cmd 點擊鏈接，將在新標籤頁打開鏈接內容；同時按 shift 和 ctrl 或 shift 加 cmd 點擊右側預覽頁面內部的鏈接，將在本頁面跳轉到點擊鏈接的內容。請自行添加白名單。

// @description: Preview the hyperlink content on the right side of the page. Clicking the link directly will open the link content on the right side of the page; pressing shift to click the link will jump to the link content on this page; pressing ctrl or cmd to click the link will open the link content in a new tab; pressing shift and ctrl or Shift + cmd Click the link inside the preview page on the right, and it will jump to the content of the clicked link on this page. 

// @description:ja  ページの右側でハイパーリンクのコンテンツをプレビューします。 リンクを直接クリックすると、ページの右側にリンク コンテンツが開きます。Shift キーを押してリンクをクリックすると、このページのリンク コンテンツにジャンプします。Ctrl または cmd を押してリンクをクリックすると、リンク コンテンツが新しいタブで開きます。 ; Shift + ctrl または Shift + cmd を押す 右側のプレビュー ページ内のリンクをクリックすると、このページのクリックしたリンクのコンテンツにジャンプします。 ホワイトリストは自分で追加してください。

// @description:ko  페이지 오른쪽에서 하이퍼링크 내용을 미리 봅니다. 링크를 직접 클릭하면 페이지 오른쪽에 링크 내용이 열리고, Shift 키를 눌러 링크를 클릭하면 이 페이지의 링크 내용으로 이동합니다. ctrl 또는 cmd를 눌러 링크를 클릭하면 새 탭에서 링크 내용이 열립니다. ; Shift + ctrl 또는 Shift + cmd 누르기 오른쪽 미리보기 페이지 내부의 링크를 클릭하면 해당 페이지에서 클릭한 링크의 내용으로 이동합니다. 화이트리스트를 직접 추가하세요.

// @license     GNU AGPLv3

// @description 在页面右侧预览超链接内容。直接点击链接，将在页面右侧打开链接内容；按 shift 点击链接，将在本页跳转到链接内容；按 ctrl 或 cmd 点击链接，将在新标签页打开链接内容；同时按 shift 和 ctrl 或 shift 加 cmd 点击右侧预览页面内部的链接，将在本页面跳转到点击链接的内容。请自行添加白名单。
// @downloadURL https://update.greasyfork.org/scripts/452649/linkPreviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/452649/linkPreviewer.meta.js
// ==/UserScript==


const pageWName = '页面宽度',
    frameWName = '窗口宽度',
    widthSettings = {
        'one-tab.com': {
            '页面宽度': 1440,
            '窗口宽度': '64%'
        }
    },
    contentSpecifyWidth = {
        'zcool.com.cn': 1440
    };
let pageW = 1440,
    frameW = 480;

const iframeId = 'yiu_linkPreview_iframe',
    iframeClass = 'yiu_linkPreview',
    bodyClass = 'yiu_previewPage',
    aClass = 'yiu_previewing',
    searchName = 'yiu_link_previewer';

let scaleK = frameW / pageW;

Object.keys(widthSettings).filter(u => window.location.host.includes(u)).map(u => {
    let w = window.innerWidth;
    let pW = widthSettings[u][pageWName],
        fW = widthSettings[u][frameWName];
    console.log(w, pW, fW);
    const widthNumFn = (n, w) => typeof n == 'string' && n.includes('%') ?
        Number(n.replace(/%/g, '')) / 100 * w :
        (isFinite(Number(n)) ? Number(n) : NaN);
    pW = widthNumFn(pW, w), fW = widthNumFn(fW, w);
    pageW = pW, frameW = fW;
    console.log(w, pW, fW);
    scaleK = fW / pW;
});

bodyCapture = false;
aCapture = true;

let iframe = document.createElement('iframe');
iframe.id = iframeId;
iframe.classList.add(iframeClass);
document.body.appendChild(iframe);


let style = document.createElement('style');
style.innerHTML = `
    iframe#${iframeId}{
      width:${pageW}px; height:${100 / scaleK}vh;
      position:fixed; top:0; right:-100vw;
      transform:scale(0,${scaleK});
      transform-origin:right top;
      pointer-events: none;
      opacity:0;
      background: #fffa;
    }

    body.${bodyClass}{
      padding-right:${pageW * scaleK}px;
    }

    body.${bodyClass} iframe#${iframeId}.${iframeClass}{
      transform:scale(${scaleK})!important;
      right:0!important;
      pointer-events:auto;
      opacity:1;
    }

    a.${aClass}{
    background: var(--bgc);
    color: #fff;
    }
    a{transition:background 0.5s ease;}
    body{transition:padding 0.5s ease;}
    iframe{transition:transform 0.5s ease , right 0.5s ease,  opacity 0.3s ease;}
`;
document.body.appendChild(style);

function iframeFitContentWidth() {
    Object.keys(contentSpecifyWidth).filter(u => iframe.src.includes(u)).map(u => {
        let tempPW = contentSpecifyWidth[u],
            tempScaleK = frameW / tempPW;

        iframe.style.cssText =
            ` width:${tempPW}px; height:${100 / tempScaleK}vh;
                        transform:scale(${tempScaleK})!important;`;
        document.body.style.paddingRight = tempPW * tempScaleK + 'px';
    });
}

function cleanSpecifyStyle() {
    if(iframe.style.cssText){
        iframe.style.cssText = '';
    }
    if(document.body.style.paddingRight){
        document.body.style.paddingRight = 'unset';
    }
}
function bodyClickFn() {
    console.trace('bodyClick');

    document.body.classList.remove(bodyClass);
    [...document.querySelectorAll(`.${aClass}`)].map(_a => {
        _a.classList.remove(aClass);
    });
    cleanSpecifyStyle();
}

[...document.querySelectorAll('a')].filter(a => !a.href.match(/^javascript/)).map(a => {
    a.style.setProperty('--bgc', `hsl(${360 * Math.random()}deg ${70 + 20 * Math.random()}% 50%)`);
    a.removeAttribute('target');
    a.setAttribute('data-link', a.href);
    a.setAttribute('href', 'javascript:void 0;');
    let origFn = a.onclick;
    a.addEventListener('click', function (ev) {

        const openBoo = ev.ctrlKey || ev.metaKey,
            jumpBoo = ev.shiftKey;

        if (openBoo == false && jumpBoo == false) {

            console.log(a.getAttribute('class'), a.classList.contains(aClass));
            if (!a.classList.contains(aClass)) {

                setTimeout(function () {
                    a.classList.add(aClass);
                    iframe.src = a.getAttribute('data-link');

                    cleanSpecifyStyle()
                    iframeFitContentWidth();


                    document.body.classList.add(bodyClass);

                    var url = new URL(window.location),
                        search = new URLSearchParams(url.search);
                    search.set(searchName, JSON.stringify(a.getAttribute('data-link')));
                    url.search = search.toString();
                    window.history.pushState(null, null, url.href);

                }, 200);
            }

            document.body.classList.remove(bodyClass);
            [...document.querySelectorAll(`.${aClass}`)].map(_a => {
                _a.classList.remove(aClass);
            });
            iframe.src = null;

            return false;

        } else {
            if (origFn) {
                origFn();
            }

            if (a.getAttribute('data-link')) {
                if (openBoo == true && jumpBoo == true) {
                    top.location.href = a.getAttribute('data-link');
                } else if (openBoo == true) {
                    window.open(a.getAttribute('data-link'), '_blank');
                } else {
                    window.location.href = a.getAttribute('data-link');
                }
            }

        }
    }, aCapture);

    a.onmouseenter = function () {
        // console.log(a,'in');
        document.body.removeEventListener('click', bodyClickFn);
    }

    a.onmouseleave = function () {
        // console.log(a,'out');
        document.body.addEventListener('click', bodyClickFn, bodyCapture);
    }
}, false);

document.body.addEventListener('click', bodyClickFn, bodyCapture);

window.addEventListener('load', function () {
    setTimeout(
        function () {
            let url = new URL(window.location),
                search = new URLSearchParams(url.search);
            let frameSrc = search.get(searchName);
            if (frameSrc) {
                let srcUrl = new URL(decodeURIComponent(JSON.parse(frameSrc)));
                iframe.src = srcUrl.href;
                cleanSpecifyStyle();
                iframeFitContentWidth()
                document.body.classList.add(bodyClass);
            };
        }, 100
    )
});
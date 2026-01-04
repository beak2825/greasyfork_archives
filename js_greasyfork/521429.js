// ==UserScript==
// @name         South Plus Image Preview
// @namespace    http://tampermonkey.net/
// @version      0.1.7
// @description  预览帖子图片
// @author       lyscop
// @match        https://bbs.imoutolove.me/read.php*
// @match        *://*.blue-plus.net/thread.php?*
// @match        *://*.summer-plus.net/thread.php?*
// @match        *://*.spring-plus.net/thread.php?*
// @match        *://*.soul-plus.net/thread.php?*
// @match        *://*.south-plus.net/thread.php?*
// @match        *://*.north-plus.net/thread.php?*
// @match        *://*.snow-plus.net/thread.php?*
// @match        *://*.level-plus.net/thread.php?*
// @match        *://*.www.level-plus.net/thread.php?*
// @match        *://*.white-plus.net/thread.php?*
// @match        *://*.south-plus.org/thread.php?*
// @match        *://*.east-plus.net/thread.php?*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521429/South%20Plus%20Image%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/521429/South%20Plus%20Image%20Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a preview div element
    const previewDiv = document.createElement('div');
    previewDiv.style.position = 'fixed';
    previewDiv.style.display = 'none';
    previewDiv.style.zIndex = '9999';
    previewDiv.style.border = '1px solid black';
    previewDiv.style.backgroundColor = 'white';
    document.body.appendChild(previewDiv);

    // Function to show the preview
    const showPreview = (imgUrl, x, y) => {
        const img = new Image();
        img.onload = () => {
            previewDiv.innerHTML = '';
            previewDiv.appendChild(img);
            previewDiv.style.left = `${x + 10}px`;
            if(y > window.innerHeight/2) {
                // previewDiv.style.bottom = `${y + 10}px`;
                previewDiv.style.top = `${y - window.innerHeight/2}px`;
            } else {
                previewDiv.style.top = `${y + 10}px`;
            }
            previewDiv.style.display = 'block';

            const maxWidth = window.innerWidth * 0.5;
            const maxHeight = window.innerHeight * 0.5;

            // if (img.width > maxWidth) {
            //     img.style.width = `${maxWidth}px`;
            // }
            if (img.height > window.innerHeight - y) {
               img.style.height = `${maxHeight}px`;
             }
        };
        img.src = imgUrl;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
    };

    // Function to hide the preview
    const hidePreview = () => {
        previewDiv.style.display = 'none';
    };


    function addPreviewListeners(imageIcons) {
        imageIcons.forEach(icon => {
            icon.addEventListener('mouseover', (event) => {
                showclipboard('开始查找');
                var postUrl = icon.parentNode.children[0].children[0].href;
                GM_xmlhttpRequest({
                    method: "GET",
                    url: postUrl,
                    onload: function(response) {
                        const html = response.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const imageElements = doc.querySelectorAll('.tpc_content img')[0];
                        const imageSrcs = imageElements.src;
                        // const imageSrcs = Array.from(imageElements).map(img => img.src);

                        if (imageSrcs.length > 0 && imageSrcs.indexOf('attachment') > -1) {
                            showPreview(imageSrcs, event.clientX, event.clientY);
                        } else {
                            showclipboard('未找到', 0);
                        }
                    }
                });
            });

            icon.addEventListener('mouseout', () => {
                hidePreview();
            });
        });
    }

    //Mouse Scroll
    document.addEventListener('scroll', function(e){
        hidePreview();
    });

    // Initial setup
    const imageIcons = document.querySelectorAll('img[src="images/colorImagination/file/img.gif"]');
    addPreviewListeners(imageIcons);

     // Observe changes to the DOM for dynamic content loading
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const newImageIcons = node.querySelectorAll('img[src="images/colorImagination/file/img.gif"]');
                        addPreviewListeners(newImageIcons);
                    }
                });
            }
        });
    });

    // Start observing
    observer.observe(document.body, { childList: true, subtree: true });

    var wrapEle = document.createElement('div');
    wrapEle.id = "wrap";
    wrapEle.setAttribute('style', '' +
                         'position:fixed;' +
                         'right:0px;' +
                         'top:0px;' +
                         'width:300px;' +//最大宽度
                         //'padding:40px;' +
                         'background-color:rgba(255,255,255,0)!important;' +
                         'z-index:2147483647!important;' +//显示最顶层
                         '');

    //document.body.appendChild(wrapEle);//元素加入body
    document.documentElement.appendChild(wrapEle);//元素加入body
    
        function showclipboard(text, c, d) {
        const wrapDiv = document.getElementById("wrap");
        var div = document.createElement('div');
        if(c == 0) {
            div.setAttribute('style', '' +
                             'display:none!important;' +//去掉直接显示
                             'left:0px;' +
                             'top:0px;' +
                             'margin-left:auto;' +//table块靠右显示
                             //'position:absolute!important;' +
                             'font-size:13px!important;' +
                             'overflow:auto!important;' +
                             'background-color:rgba(255,99,71,0.5)!important;' +//蓝
                             'font-family:sans-serif,Arial!important;' +
                             'font-weight:normal!important;' +
                             'font-color:rgba(255,255,255,1)!important;' +
                             'text-align:left!important;' +//左对齐
                             'color:#fff!important;' +//字体颜色白
                             //'padding:0.5em 1em!important;' +
                             'border-radius:3px!important;' +
                             //'border:1px solid #ccc!important;' +
                             'border: 1px solid rgb(10 10 10 / 10%) !important;'+
                             //'max-width:350px!important;' +
                             'max-height:1216px!important;' +
                             'z-index:2147483647!important;' +
                             '');
        } else if(c == 1) {
            div.setAttribute('style', '' +
                             'display:none!important;' +//去掉直接显示
                             'left:0px;' +
                             'top:0px;' +
                             'margin-left:auto;' +//table块靠右显示
                             //'position:absolute!important;' +
                             'font-size:13px!important;' +
                             'overflow:auto!important;' +
                             'background-color:rgba(8,46,84,0.6)!important;' +//红
                             'font-family:sans-serif,Arial!important;' +
                             'font-weight:normal!important;' +
                             'text-align:left!important;' +//左对齐
                             'color:#fff!important;' +
                             'padding:0.5em 1em!important;' +
                             'border-radius:3px!important;' +
                             //'border:1px solid #ccc!important;' +
                             'border: 1px solid rgb(10 10 10 / 10%) !important;'+
                             //'max-width:350px!important;' +
                             'max-height:1216px!important;' +
                             'z-index:2147483647!important;' +
                             '');
        } else {
            div.setAttribute('style', '' +
                             'display:none!important;' +//去掉直接显示
                             'left:0px;' +
                             'top:0px;' +
                             'margin-left:auto;' +//table块靠右显示
                             //'position:absolute!important;' +
                             'font-size:13px!important;' +
                             'overflow:auto!important;' +
                             'background-color:rgba(255,255,255,0.7)!important;' +//灰
                             'font-family:sans-serif,Arial!important;' +
                             'font-weight:normal!important;' +
                             'text-align:left!important;' +//左对齐
                             'color:#000!important;' +
                             //'padding:0.5em 1em!important;' +
                             'border-radius:3px!important;' +
                             //'border:1px solid #ccc!important;' +
                             'border: 1px solid rgb(10 10 10 / 10%) !important;'+
                             //'max-width:350px!important;' +
                             'max-height:1216px!important;' +
                             'z-index:2147483647!important;' +
                             '');
        }

        div.onclick = function(){
            if(d) {
                GM_openInTab(d, {
                    active: false
                });
                return false;
            }
        }

        div.innerHTML = text;
        div.style.display = 'table';// 换行显示结果
        div.style.cursor = "pointer";
        setTimeout(() => {
            //fadeIn(div);
        }, 1800)
        let fc = wrapDiv.firstElementChild
        if (fc) {
            wrapDiv.insertBefore(div,fc)
        } else {
            wrapDiv.appendChild(div);
        }
        setTimeout(() => {
            fadeOut(div);
            //div.parentNode.removeChild(div);
        },15000)

        //鼠标滚动
        document.addEventListener('scroll', function(e){
            fadeOut(div);

        });

    }

    function fadeOut(el){
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    }

    //渐入

    function fadeIn(el, display){
        el.style.opacity = 0;
        el.style.display = "block";

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }

    GM_addStyle(".tr3.t_one a:visited {color: #aaa;}");

})();
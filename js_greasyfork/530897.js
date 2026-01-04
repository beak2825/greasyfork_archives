// ==UserScript==
// @name         FutabaX
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自動更新、引用元に引用アンカー追加、マウスオーバーで画像拡大表示などお役立ち機能を追加するスクリプト
// @author       としあき
// @match        *://*.2chan.net/*
// @match        https://www.2chan.net/index2.html
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      2chan.net
// @connect      futakuro.com
// @connect      futabaforest.net
// @connect      ftbucket.info
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/530897/FutabaX.user.js
// @updateURL https://update.greasyfork.org/scripts/530897/FutabaX.meta.js
// ==/UserScript==

(function() {
    'use strict';

        GM_addStyle(`
        td.rtd {
            white-space: normal !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            text-align: left !important;
        }
        a[data-quote-post] {
            display: inline-block !important;
            white-space: nowrap;
            margin: 2px 5px 2px 0 !important;
        }
    `);

    let resolvedThreadCache = {};

    if (window.top === window.self && document.getElementsByTagName("frameset").length > 0) {
        window.location.replace("https://www.2chan.net/index2.html");
    }

    if (window.location.href.indexOf("index2.html") !== -1) {
        function modifyFrontPageLinks() {
            document.querySelectorAll('a[href="https://dec.2chan.net/dec/futaba.htm"]').forEach(a => {
                a.textContent = "二次元裏dec";
            });
            document.querySelectorAll('a[href="https://jun.2chan.net/jun/futaba.htm"]').forEach(a => {
                a.textContent = "二次元裏jun";
            });
            document.querySelectorAll('a[href="https://may.2chan.net/b/futaba.htm"]').forEach(a => {
                a.textContent = "二次元裏may";
            });

            const mayLink = document.querySelector('a[href="https://may.2chan.net/b/futaba.htm"]');
            if (mayLink) {
                mayLink.insertAdjacentHTML("afterend",
                    '<br><a href="https://img.2chan.net/b/futaba.htm">二次元裏img</a><br>' +
                    '<a href="https://cgi.2chan.net/b/futaba.htm">二次元裏cgi</a><br>' +
                    '<a href="https://dat.2chan.net/b/futaba.htm">二次元裏dat</a>'
                );
            }

            document.querySelectorAll('a[href="https://may.2chan.net/b/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
            document.querySelectorAll('a[href="https://img.2chan.net/b/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
            document.querySelectorAll('a[href="https://dec.2chan.net/84/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
            document.querySelectorAll('a[href="https://dec.2chan.net/60/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
            document.querySelectorAll('a[href="https://dec.2chan.net/55/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
            document.querySelectorAll('a[href="https://dec.2chan.net/73/futaba.htm"]').forEach(a => {
                a.insertAdjacentHTML("afterend", '<span style="color:red;font-size:80%">人気</span>');
            });
        }
        modifyFrontPageLinks();
    }

    const originalFavicon = "https://2chan.net/favicon.ico";
    const thresholdFaviconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAfdJREFUOE9VU1tuE0EQrCYSHAHtjpcbxJYT4QsAAhtfAfgg/Od1C4Jk/hBxfnwFZAfkPUGQgpScINrMOGcwynbSj7UTyVrvztR0dVfVUF3XTASA5UeQd2YGZA3NH4Ft13CKNwwx1yu8bDQgOy4V5Kit2xn70icxSM4LyBYfsMi7EpKwWCsCa1qTTy0g/MyYDfuIi4Q8z/D61Rs82z1cccmMcn45+opyXiIlweUYTP+ARIPZ8B1aoQCeAPGqUpbwIqDzY+zMhOX3I5TzOZgJRRF0vaqiFGA+2dpEluV6sBWCzlstKhRZgc2fx/g/+oayLBFaQce6rqLKk2ICmYTAbPAW6SYhPM/BG1boOka8/3WK8XYHve2XqBYRdAvElBBaGQbT31KgZlVY5QKmwz5SjG4nodfr4e/ZmTJyzQghoD87NV9U/7p2uUXpBz6DsRwdYTKZ4OOHT3i6dwDiRyaqxTqCOaSTWEpkw7s66bbx+fwCRJYDDY87KuXUBTXJkyeSKECtY4y7Hez8u/B0mp1GZSSaRGFdRWldXpHjrTa+nF9qaATXxH7VrLqg4zch9ynAOO62bf79Qy1mGEujRVmmdRE0rk2DTqMrrpDdC78POq4EWEZYt+BX0udUWawrbf/RLXDbpYDkoPG0kdiY16bYNXRfPDVa/h50B6WqJRL7N7kGAAAAAElFTkSuQmCC";
    const newReplyFaviconBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAABJQTFRF////R7RHLZoti/iLY9Bj/wAAERW9LQAAAFFJREFUeJxjZIACRiwMIca3DMz8/xgZnc/qHzB8rMvIxG984b2g416g1H+Dg/Yiu4GKhQQUHhivBuliVrgbCmYwKDzAxWDSuwAVQbILLhK6GgDWTBmEbxfYVgAAAABJRU5ErkJggg==";
    let thresholdMode = false;

    const extraStyle = document.createElement("style");
    extraStyle.innerHTML = `
        .highlighted {
            background-color: #EDD0BD !important;
            transition: background-color 2s ease-out;
        }
        .quote-preview {
            background-color: #F0E0D6;
            padding: 8px;
            border: 1px solid #F0E0D6;
            max-width: 90vw;
            overflow: auto;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }
        #replyContainer {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #fff;
            border: 1px solid #ccc;
            padding: 5px;
            z-index: 15000;
            box-shadow: 2px 2px 10px rgba(0,0,0,0.5);
        }
        #replyDragHandle {
            background: #ccc;
            padding: 4px;
            cursor: move;
            font-size: 0.9em;
            text-align: center;
            user-select: none;
        }
    `;
    document.head.appendChild(extraStyle);

    function highlightPost(post) {
        post.classList.add("highlighted");
        setTimeout(() => {
            post.classList.remove("highlighted");
        }, 2000);
    }

    let currentQuotePreview = null;
    function handleQuoteLinkMouseEnter(e) {
        const link = this;
        const quoteNum = link.dataset.quotePost;
        const target = document.getElementById("post-" + quoteNum);
        if (!target) return;
        currentQuotePreview = target.cloneNode(true);
        currentQuotePreview.classList.add("quote-preview");
        currentQuotePreview.style.position = "fixed";
        currentQuotePreview.style.zIndex = "20000";
        currentQuotePreview.style.left = (e.clientX + 10) + "px";
        currentQuotePreview.style.top = (e.clientY - 10) + "px";
        document.body.appendChild(currentQuotePreview);
    }
    function handleQuoteLinkMouseMove(e) {
        if (currentQuotePreview) {
            currentQuotePreview.style.left = (e.clientX + 10) + "px";
            currentQuotePreview.style.top = (e.clientY - 10) + "px";
        }
    }
    function handleQuoteLinkMouseLeave(e) {
        if (currentQuotePreview) {
            currentQuotePreview.remove();
            currentQuotePreview = null;
        }
    }

function removeUnwantedElements(root = document) {
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/sphead.htm"], iframe[src^="https://dec.2chan.net/bin/spfoot_a.htm"]').forEach(iframe => {
        if (iframe.parentElement) { iframe.parentElement.remove(); }
    });
    root.querySelectorAll('div').forEach(div => {
        if (div.innerHTML.includes("ヘッダ広告ここから")) { div.remove(); }
    });
    root.querySelectorAll('.tue2').forEach(el => el.remove());
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/overlay.htm"]').forEach(iframe => {
        if (iframe.parentElement) {
            let parent = iframe.parentElement;
            parent.remove();
            let prev = parent.previousElementSibling;
            if (prev && prev.tagName === 'DIV' && prev.getAttribute('style') && prev.getAttribute('style').includes('height:68px')) {
                prev.remove();
            }
        }
    });
    root.querySelectorAll('style').forEach(styleEl => {
        if (styleEl.innerHTML.includes('.footfix')) { styleEl.remove(); }
    });
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/foot2_a.htm"]').forEach(iframe => {
        if (iframe.parentElement) { iframe.parentElement.remove(); }
    });
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/hsi1.htm"], iframe[src^="https://dec.2chan.net/bin/foot4_ab.htm"]').forEach(iframe => {
        if (iframe.parentElement) { iframe.parentElement.remove(); }
    });
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/hsif.htm"]').forEach(iframe => {
        if (iframe.parentElement) { iframe.parentElement.remove(); }
    });
    root.querySelectorAll('iframe[src^="/bin/catp.htm"]').forEach(iframe => {
        let container = iframe.closest('div[style*="width:610px"]');
        if (container) { container.remove(); }
        else if (iframe.parentElement) { iframe.parentElement.remove(); }
    });
    root.querySelectorAll('.footfix').forEach(el => el.remove());
    ["imobile_adspotdiv1", "imobile_adspotdiv2"].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.display = "none"; }
    });
    root.querySelectorAll('div[class^="adWrapper"]').forEach(el => el.remove());
    root.querySelectorAll('#rightadc').forEach(el => el.remove());
    root.querySelectorAll('div#rightadfloat').forEach(el => el.remove());
    root.querySelectorAll('div.heaven-728-90.ninja-slider.mode-b.dark').forEach(el => el.remove());
    root.querySelectorAll('iframe[src^="https://dec.2chan.net/bin/foot1_n.htm"]').forEach(iframe => {
        if (iframe.parentElement) { iframe.parentElement.remove(); }
    });

    root.querySelectorAll('div[id*="ad" i]').forEach(el => el.remove());

    root.querySelectorAll('div[style*="width:680px"][style*="margin: 0 auto"]').forEach(el => el.remove());
}



    function cleanseJumpLinks(root = document) {
        const jumpLinks = root.querySelectorAll('a[href^="/bin/jump.php?"]');
        jumpLinks.forEach(link => {
            let href = link.getAttribute('href');
            let cleaned = href.replace(/^\/bin\/jump\.php\?/, '');
            link.setAttribute('href', cleaned);
        });
    }

function isSrcLink(anchor) {
    return /\.(png|jpe?g|gif|mp4|webm)$/i.test(anchor.href);
}

function addDownloadButtons(root = document) {
    const allAnchors = Array.from(
        root.querySelectorAll('a[href*="/src/"], a[href*="fu"]')
    ).filter(isSrcLink);

    const filenameAnchors = allAnchors.filter(anchor => !anchor.querySelector('img'));

    filenameAnchors.forEach(anchor => {
        if (anchor.nextElementSibling && anchor.nextElementSibling.classList?.contains('download-btn')) {
            return;
        }

        const downloadLink = document.createElement('a');
        downloadLink.href = anchor.href;
        downloadLink.download = '';
        downloadLink.className = 'download-btn';
        downloadLink.style.display = 'inline';
        downloadLink.style.verticalAlign = 'middle';
        downloadLink.style.marginLeft = '5px';

        if (/\.(mp4|webm)$/i.test(downloadLink.href)) {
            downloadLink.addEventListener('click', function(e) {
                e.preventDefault();
                fetch(downloadLink.href)
                    .then(resp => resp.blob())
                    .then(blob => {
                        const blobUrl = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = blobUrl;
                        a.download = downloadLink.href.split('/').pop();
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        window.URL.revokeObjectURL(blobUrl);
                    })
                    .catch(err => console.error("Download failed", err));
            });
        }
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("xmlns", svgNS);
        svg.setAttribute("viewBox", "0 0 512 512");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.style.width = "1em";
        svg.style.height = "1em";
        svg.style.verticalAlign = "middle";
        svg.style.fill = "currentColor";

        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", "M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z");
        svg.appendChild(path);
        downloadLink.appendChild(svg);

        anchor.insertAdjacentElement('afterend', downloadLink);

    });
}
    function processPost(td) {
        const bq = td.querySelector("blockquote");
        if (!bq) return;

        const originalHTML = bq.innerHTML;
        const lines = originalHTML.split(/<br\s*\/?>/i);

        const imageFiles = new Set();
        const videoFiles = new Set();

        lines.forEach(line => {
            const div = document.createElement("div");
            div.innerHTML = line;
            const text = div.textContent.trim();

            if (text.startsWith(">") || text.startsWith("&gt;")) return;

            const matches = text.match(/\b(fu?\d+\.\w+)\b/gi);
            if (!matches) return;

            matches.forEach(fullname => {
                const ext = (fullname.split(".").pop() || "").toLowerCase();
                if (ext === "mp4" || ext === "webm") {
                    videoFiles.add(fullname);
                } else {
                    imageFiles.add(fullname);
                }
            });
        });

        if (imageFiles.size > 0) {
            td.querySelectorAll("a[href*='/up/src/'], a[href*='/up2/src/']").forEach(a => {
                if (!bq.contains(a)) {
                    a.remove();
                }
            });

            const container = document.createElement("div");
            container.style.margin = "0";
            container.style.padding = "0";
            container.style.display = "block";

            Array.from(imageFiles).forEach((filename, index, arr) => {
                const baseUrl = filename.toLowerCase().startsWith("fu")
                    ? "https://dec.2chan.net/up2/src/"
                    : "https://dec.2chan.net/up/src/";
                const imageUrl = baseUrl + filename;

                const thumbLink = document.createElement("a");
                thumbLink.href = imageUrl;
                thumbLink.target = "_blank";

                const img = document.createElement("img");
                img.src = imageUrl;
                img.setAttribute("border", "0");
                img.setAttribute("align", "left");
                img.setAttribute("hspace", "20");
                img.setAttribute("alt", "外部画像");
                img.setAttribute("loading", "lazy");
                img.style.maxWidth = "200px";
                img.style.maxHeight = "200px";

                thumbLink.appendChild(img);
                container.appendChild(thumbLink);
                if (index < arr.length - 1) {
                    container.appendChild(document.createElement("br"));
                }
            });

            td.insertBefore(container, bq);
            bq.style.marginLeft = "241px";
        }

        let replacedHTML = originalHTML;

        replacedHTML = replacedHTML.replace(
            /\b(fu?\d+\.(mp4|webm))\b/gi,
            (match, filename) => {
                const baseUrl = filename.toLowerCase().startsWith("fu")
                    ? "https://dec.2chan.net/up2/src/"
                    : "https://dec.2chan.net/up/src/";
                const videoUrl = baseUrl + filename;

                return `<a href="${videoUrl}" target="_blank">${filename}</a>` +
                       ` <span class="embed-video-link" data-url="${videoUrl}" style="cursor:pointer;">(動画)</span>`;
            }
        );

        replacedHTML = replacedHTML.replace(
            /\b(fu?\d+\.(?!mp4|webm)\w+)\b/gi,
            (match, filename) => {
                const baseUrl = filename.toLowerCase().startsWith("fu")
                    ? "https://dec.2chan.net/up2/src/"
                    : "https://dec.2chan.net/up/src/";
                const imageUrl = baseUrl + filename;
                return `<a href="${imageUrl}" target="_blank">${filename}</a>`;
            }
        );

        bq.innerHTML = replacedHTML;

        bq.querySelectorAll(".embed-video-link").forEach(el => {
            el.addEventListener("click", function() {
                if (this.nextSibling && this.nextSibling.className === "video-iframe-wrap") {
                    this.nextSibling.remove();
                    return;
                }

                const iframeWrap = document.createElement("div");
                iframeWrap.className = "video-iframe-wrap";
                iframeWrap.style.position = "relative";
                iframeWrap.style.marginTop = "5px";

                const closeBtn = document.createElement("div");
                closeBtn.textContent = "✖";
                closeBtn.style.position = "absolute";
                closeBtn.style.top = "3px";
                closeBtn.style.right = "5px";
                closeBtn.style.cursor = "pointer";
                closeBtn.style.backgroundColor = "rgba(0,0,0,0.6)";
                closeBtn.style.color = "#fff";
                closeBtn.style.padding = "2px 6px";
                closeBtn.style.borderRadius = "3px";
                closeBtn.style.zIndex = "10";
                closeBtn.onclick = () => iframeWrap.remove();

                const iframe = document.createElement("iframe");
                iframe.src = this.dataset.url;
                iframe.style.width = "400px";
                iframe.style.height = "300px";
                iframe.style.border = "1px solid #ccc";
                iframe.style.borderRadius = "3px";

                iframeWrap.appendChild(closeBtn);
                iframeWrap.appendChild(iframe);
                this.parentNode.insertBefore(iframeWrap, this.nextSibling);
            });
        });
    }

    function updateFileSizes(root = document) {
        const elements = root.querySelectorAll('.thre, .rtd');
        elements.forEach(el => {
            el.innerHTML = el.innerHTML.replace(/(-\()(\d+)\s*B\)/g, (match, prefix, num) => {
                let kb = (parseInt(num, 10) / 1024).toFixed(1);
                return prefix + kb + " KB)";
            });
        });
    }

function attachFullSizeHover(root = document) {
    const allAnchors = Array.from(root.querySelectorAll('a[href*="/src/"], a[href*="2chan.net/up2/src/"]')).filter(anchor => {
        return /\.(jpg|jpeg|png|gif)$/i.test(anchor.href);
    });

    const thumbnails = allAnchors
        .filter(anchor => anchor.querySelector('img'))
        .map(anchor => anchor.querySelector('img'));

    thumbnails.forEach(img => {
        if (img.dataset.fullsizeHoverAttached) return;
        img.addEventListener('mouseenter', e => { showFullSizePreview(e.currentTarget); });
        img.addEventListener('mouseleave', e => { hideFullSizePreview(); });
        img.dataset.fullsizeHoverAttached = "true";
    });
}
    function showFullSizePreview(img) {
        hideFullSizePreview();
        const fullSrc = img.parentElement.href;
        const preview = document.createElement('img');
        preview.id = 'fullsize-preview';
        preview.src = fullSrc;
        preview.style.position = 'fixed';
        preview.style.top = '50%';
        preview.style.left = '50%';
        preview.style.transform = 'translate(-50%, -50%)';
        preview.style.maxWidth = '90vw';
        preview.style.maxHeight = '90vh';
        preview.style.zIndex = '2147483647';
        preview.style.border = '1px solid #ccc';
        preview.style.pointerEvents = 'none';
        document.body.appendChild(preview);
    }
    function hideFullSizePreview() {
        const preview = document.getElementById('fullsize-preview');
        if (preview) preview.remove();
    }

    function autoReloadThread() {
        if (document.title.includes("404 File Not Found")) return;
        const reloadAnchor = document.querySelector('#contres a');
        if (reloadAnchor) {
            const onClickAttr = reloadAnchor.getAttribute('onClick');
            const match = onClickAttr && onClickAttr.match(/scrlf\((\d+)\)/);
            if (match) {
                const threadId = match[1];
                if (typeof unsafeWindow.scrlf === 'function') {
                    unsafeWindow.scrlf(threadId);
                }
            }
        }
    }
    setInterval(autoReloadThread, 5000);

    function changeFavicon(newIconData) {
        let link = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = newIconData;
    }

    function changeFaviconIfCondition() {
        if (thresholdMode) return;
        const maxresElement = document.querySelector('span.maxres');
        const contdispElement = document.querySelector('#contdisp');
        if ((maxresElement && maxresElement.textContent.includes("上限1000レスに達しました")) ||
            (contdispElement && contdispElement.textContent.includes("スレッドがありません"))) {
            changeFavicon(thresholdFaviconBase64);
            thresholdMode = true;
        }
    }
    setInterval(changeFaviconIfCondition, 1000);

    function checkSodCondition() {
        if (document.title.includes("404 File Not Found")) return;
        const sodElements = document.querySelectorAll('.sod');
        sodElements.forEach(el => {
            if (el.textContent.trim() === "そうだねx0" && !el.dataset.sodAlerted) {
                alert("お使いのipアドレスからそうだねできません");
                el.dataset.sodAlerted = "true";
            }
        });
    }
    setInterval(checkSodCondition, 1000);

    function addQuoteLinks() {
        if (document.title.includes("404 File Not Found")) return;
        const allPosts = Array.from(document.querySelectorAll('.thre, .rtd'))
                            .filter(post => post.querySelector('span.cno'));
        let postDict = {};
        allPosts.forEach(post => {
            const cnoEl = post.querySelector('span.cno');
            if (cnoEl) {
                const num = cnoEl.textContent.trim().replace(/^No\./, '');
                if (!post.id) { post.id = "post-" + num; }
                post.dataset.postNumber = num;
                const isOP = !post.closest('table') && post.textContent.includes('画像ファイル名');
                if (isOP) {
                    post.dataset.isOP = "true";
                }
                postDict[num] = post;
            }
        });
        const replyPosts = allPosts.filter(post => post.closest("table") !== null);
        let quotes = [];
        replyPosts.forEach(post => {
            const quotePostNum = post.dataset.postNumber;
            const fonts = Array.from(post.querySelectorAll('blockquote font[color="#789922"]'));
            fonts.forEach(font => {
                let text = font.textContent.trim();
                text = text.replace(/^>+/, '').replace(/^(&gt;)+/, '').trim();
                if (text.indexOf('\n') !== -1) {
                    text = text.split('\n')[0].trim();
                }
                if (!text) return;
                let type = "text";
                let value = text;
                const numMatch = text.match(/^(?:No\.?\s*)?(\d{8,})$/);
                if (numMatch) {
                    type = "number";
                    value = numMatch[1];
                } else if (text.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm)$/i)) {
                    type = "filename";
                    value = text;
                }
                quotes.push({ quotePostNum, type, value, sourcePost: post });
            });
        });
        quotes.sort((a, b) => parseInt(a.quotePostNum) - parseInt(b.quotePostNum));
        allPosts.forEach(originalPost => {
            const origPostNum = originalPost.dataset.postNumber;
            const isOP = originalPost.dataset.isOP === "true";
            let lines = [];
            let anchors = [];
            let originalFilename = '';
            if (isOP) {
                const filenameAnchor = originalPost.querySelector('a[href*="/src/"]');
                if (filenameAnchor) {
                    originalFilename = filenameAnchor.textContent.trim();
                }
                const block = originalPost.querySelector('blockquote');
                if (block) {
                    lines = block.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                }
            } else {
                const block = originalPost.querySelector('blockquote');
                if (block) {
                    lines = block.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                } else {
                    lines = originalPost.innerText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                }
                anchors = Array.from(originalPost.querySelectorAll('a[href*="/src/"]'));
            }
            let insertAfterElement;
            if (isOP) {
                insertAfterElement = originalPost.querySelector('.cntd');
            } else {
                insertAfterElement = originalPost.querySelector('.sod');
            }
            if (!insertAfterElement) return;
            for (let i = quotes.length - 1; i >= 0; i--) {
                let quote = quotes[i];
                if (quote.sourcePost.id === originalPost.id) continue;
                let matchFound = false;
                if (quote.type === "number") {
                    matchFound = (origPostNum === quote.value);
                } else if (quote.type === "filename") {
                    if (isOP) {
                        matchFound = (originalFilename === quote.value);
                    } else {
                        matchFound = anchors.some(a =>
                            a.getAttribute('href').includes(quote.value) ||
                            a.textContent.trim() === quote.value
                        );
                    }
                } else {
                    matchFound = lines.includes(quote.value);
                }
                if (matchFound) {
                    if (!originalPost.querySelector(`a[data-quote-post="${quote.quotePostNum}"]`)) {
                        const link = document.createElement('a');
                        link.href = "javascript:void(0);";
                        link.textContent = ">>" + quote.quotePostNum;
                        link.style.marginLeft = "5px";
                        link.dataset.quotePost = quote.quotePostNum;
                        link.addEventListener('click', () => {
                            const target = document.getElementById("post-" + quote.quotePostNum);
                            if (target) {
                                target.scrollIntoView({ behavior: "smooth" });
                                highlightPost(target);
                            }
                        });
                        link.addEventListener('mouseenter', handleQuoteLinkMouseEnter);
                        link.addEventListener('mousemove', handleQuoteLinkMouseMove);
                        link.addEventListener('mouseleave', handleQuoteLinkMouseLeave);
                        insertAfterElement.parentNode.insertBefore(link, insertAfterElement.nextSibling);
                    }
                }
            }
        });
    }
    setInterval(addQuoteLinks, 1000);


    function insertQuoteBreaks() {
        var posts = document.querySelectorAll('td.rtd');
        posts.forEach(function(post) {
            var quotes = post.querySelectorAll('a[data-quote-post]');
            quotes.forEach(function(quote, index) {
                if ((index + 1) % 10 === 0) {
                    if (!quote.nextSibling || quote.nextSibling.nodeName !== 'BR') {
                        quote.insertAdjacentHTML('afterend', '<br>');
                    }
                }
            });
        });
    }

    function makeDraggable(element, handle) {
        handle = handle || element;
        handle.style.cursor = "move";
        let offsetX, offsetY;
        handle.addEventListener("mousedown", function(e) {
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            document.addEventListener("mousemove", moveHandler);
            document.addEventListener("mouseup", upHandler);
        });
        function moveHandler(e) {
            element.style.left = (e.clientX - offsetX) + "px";
            element.style.top = (e.clientY - offsetY) + "px";
            element.style.bottom = "auto";
            element.style.right = "auto";
        }
        function upHandler(e) {
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
        }
    }
    function setupReplyForm() {
        const replyForm = document.getElementById("fm");
        if (replyForm) {
            const reszbElements = replyForm.querySelectorAll("span#reszb");
            reszbElements.forEach(el => el.remove());
            const ftb2 = replyForm.querySelector("table.ftb2");
            if (ftb2) {
                ftb2.parentNode.removeChild(ftb2);
                const hrElement = document.querySelector("hr");
                if (hrElement) {
                    hrElement.insertAdjacentElement("afterend", ftb2);
                } else {
                    document.body.insertBefore(ftb2, document.body.firstChild);
                }
            }
            const container = document.createElement("div");
            container.id = "replyContainer";
            container.style.position = "fixed";
            container.style.bottom = "20px";
            container.style.right = "20px";
            container.style.background = "#fff";
            container.style.border = "1px solid #ccc";
            container.style.padding = "5px";
            container.style.zIndex = "15000";
            container.style.boxShadow = "2px 2px 10px rgba(0,0,0,0.5)";
            const handle = document.createElement("div");
            handle.id = "replyDragHandle";
            handle.textContent = "返信フォーム（ドラッグで移動）";
            handle.style.background = "#ccc";
            handle.style.padding = "4px";
            handle.style.cursor = "move";
            handle.style.fontSize = "0.9em";
            handle.style.textAlign = "center";
            handle.style.userSelect = "none";
            container.appendChild(handle);
            container.appendChild(replyForm);
            document.body.appendChild(container);
            makeDraggable(container, handle);
        }
    }
    if (window.location.href.indexOf("/res/") !== -1) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", setupReplyForm);
        } else {
            setupReplyForm();
        }
    }

    function addArchiveLinksTo404() {
        if (!document.title.includes("404 File Not Found")) return;
        let h1s = document.querySelectorAll("h1");
        let targetH1 = null;
        h1s.forEach(h => {
            if (h.textContent.includes("掲示板に戻る")) { targetH1 = h; }
        });
        if (!targetH1) return;
        let hr = targetH1.nextElementSibling;
        while (hr && hr.tagName !== "HR") {
            hr = hr.nextElementSibling;
        }
        if (!hr) return;
        let archiveHeader = document.createElement("h1");
        archiveHeader.textContent = "過去ログを取得";
        hr.insertAdjacentElement("afterend", archiveHeader);
        let linkContainer = document.createElement("div");
        linkContainer.style.marginTop = "10px";
        let path = window.location.pathname;
        let regex = /\/([^\/]+)\/res\/(\d+)\.htm/i;
        let match = path.match(regex);
        if (!match) return;
        let board = match[1];
        let threadId = match[2];
        let host = window.location.host;
        let links = [];
        if (host.includes("may.2chan.net") && board === "b") {
            links.push({ text: "futakuro", url: `https://kako.futakuro.com/futa/may_b/${threadId}/` });
            links.push({ text: "ftbucket (may1)", url: `https://may1.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm` });
            links.push({ text: "ftbucket (may2)", url: `https://may2.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm` });
            links.push({ text: "ftbucket (may3)", url: `https://may3.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm` });
            links.push({ text: "futabaforest", url: `https://futabaforest.net/b/res/${threadId}.htm` });
        } else if (host.includes("img.2chan.net") && board === "b") {
            links.push({ text: "ftbucket (c3)", url: `https://c3.ftbucket.info/img/cont/img.2chan.net_b_res_${threadId}/index.htm` });
            links.push({ text: "futakuro", url: `https://kako.futakuro.com/futa/img_b/${threadId}/` });
        } else if (host.includes("jun.2chan.net") && board === "jun") {
            links.push({ text: "ftbucket (c3)", url: `https://c3.ftbucket.info/jun/cont/jun.2chan.net_jun_res_${threadId}/index.htm` });
        } else if (host.includes("dec.2chan.net") && board === "55") {
            links.push({ text: "ftbucket (c3)", url: `https://c3.ftbucket.info/dec55/cont/dec.2chan.net_55_res_${threadId}/index.htm` });
        } else if (host.includes("dec.2chan.net") && board === "60") {
            links.push({ text: "ftbucket (c3)", url: `https://c3.ftbucket.info/dec60/cont/dec.2chan.net_60_res_${threadId}/index.htm` });
        } else {
            links.push({ text: "ftbucket (c3)", url: `https://c3.ftbucket.info/other/cont/${host}_${board}_res_${threadId}/index.htm` });
        }
        links.forEach(linkInfo => {
            let a = document.createElement("a");
            a.href = linkInfo.url;
            a.textContent = linkInfo.text;
            a.style.marginRight = "10px";
            a.target = "_blank";
            linkContainer.appendChild(a);
        });
        archiveHeader.insertAdjacentElement("afterend", linkContainer);
    }
    addArchiveLinksTo404();

    const originalTitle = document.title;
    let maxSeenIndex = -1;
    let prevUnread = 0;
    let initialUnread = 0;
    let initialUnreadSet = false;
    let wasZeroOnBlur = false;
    function isInViewport(el) {
        const rect = el.getBoundingClientRect();
        return rect.bottom > 0 && rect.top < window.innerHeight;
    }
    function updateUnreadCountNew() {
        if (window.location.href.indexOf("/res/") === -1) return;
        if (document.title.includes("404 File Not Found")) {
            changeFavicon(thresholdFaviconBase64);
            return;
        }
        const contdispElement = document.querySelector('#contdisp');
        if (contdispElement && contdispElement.textContent.includes("スレッドがありません")) {
            document.title = `【落ち】 ${originalTitle}`;
            return;
        }
        const replies = Array.from(document.querySelectorAll(".thre, .rtd"))
            .filter(post => post.closest("table") !== null);
        const totalReplies = replies.length;
        let visibleIndex = -1;
        for (let i = 0; i < replies.length; i++) {
            if (isInViewport(replies[i])) {
                visibleIndex = i;
            }
        }
        if (document.hasFocus()) {
            if (visibleIndex > maxSeenIndex) {
                maxSeenIndex = visibleIndex;
            }
            if (!initialUnreadSet) {
                initialUnread = totalReplies - (maxSeenIndex + 1);
                initialUnreadSet = true;
            }
        } else {
            if (!initialUnreadSet) {
                maxSeenIndex = totalReplies - 1;
                initialUnread = 0;
                initialUnreadSet = true;
            }
        }
        const unread = totalReplies - (maxSeenIndex + 1);
        document.title = `(${unread}) ${originalTitle}`;
        if (!thresholdMode && !document.hasFocus() && wasZeroOnBlur && prevUnread === 0 && unread > 0) {
            changeFavicon(newReplyFaviconBase64);
        }
        if (document.hasFocus() && unread === 0 && !thresholdMode) {
            changeFavicon(originalFavicon);
        }
        prevUnread = unread;
    }
    window.addEventListener("scroll", updateUnreadCountNew);
    setInterval(updateUnreadCountNew, 1000);
    window.addEventListener("blur", () => {
        if (prevUnread === 0) { wasZeroOnBlur = true; }
    });
    window.addEventListener("focus", () => {
        wasZeroOnBlur = false;
        if (prevUnread === 0 && !thresholdMode) { changeFavicon(originalFavicon); }
    });

function addYouTubeEmbeds(root = document) {
    const ytRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([\w-]{11})/;
    const processedLinks = new Set();

    function createFloatingWindow(videoId) {
        const floatDiv = document.createElement('div');
        floatDiv.style.cssText = `
            position: fixed;
            width: 480px;
            height: 270px;
            z-index: 9999;
            background: white;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            overflow: hidden;
            cursor: move;
        `;

        const handle = document.createElement('div');
        handle.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 20px;
            background: #eee0d7;
            cursor: move;
            user-select: none;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            padding: 2px 6px;
            background: #781208;
            color: white;
            border: none;
            cursor: pointer;
            z-index: 10000;
        `;
        closeButton.addEventListener('click', () => floatDiv.remove());

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: calc(100% - 20px);
            border: none;
            margin-top: 20px;
        `;
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&wmode=opaque`;
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');

        handle.appendChild(closeButton);
        floatDiv.appendChild(handle);
        floatDiv.appendChild(iframe);

        const leftHandle = document.createElement('div');
        leftHandle.style.cssText = `
            position: absolute;
            top: 20px;
            left: 0;
            width: 8px;
            height: calc(100% - 20px);
            cursor: ew-resize;
            z-index: 10001;
        `;
        const rightHandle = document.createElement('div');
        rightHandle.style.cssText = `
            position: absolute;
            top: 20px;
            right: 0;
            width: 8px;
            height: calc(100% - 20px);
            cursor: ew-resize;
            z-index: 10001;
        `;

        const bottomHandle = document.createElement('div');
        bottomHandle.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 8px;
            width: 100%;
            cursor: ns-resize;
            z-index: 10001;
        `;

        floatDiv.appendChild(leftHandle);
        floatDiv.appendChild(rightHandle);
        floatDiv.appendChild(bottomHandle);
        document.body.appendChild(floatDiv);

        const startX = (window.innerWidth - 480) / 2;
        const startY = (window.innerHeight - 270) / 2;
        floatDiv.style.left = `${startX}px`;
        floatDiv.style.top = `${startY}px`;

        let isDragging = false;
        let startXPos = 0;
        let startYPos = 0;
        let initialMouseX = 0;
        let initialMouseY = 0;

        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            isDragging = true;
            initialMouseX = e.clientX;
            initialMouseY = e.clientY;
            startXPos = floatDiv.offsetLeft;
            startYPos = floatDiv.offsetTop;
            floatDiv.style.cursor = 'grabbing';
        }

        function drag(e) {
            if (isDragging) {
                const deltaX = e.clientX - initialMouseX;
                const deltaY = e.clientY - initialMouseY;
                floatDiv.style.left = `${startXPos + deltaX}px`;
                floatDiv.style.top = `${startYPos + deltaY}px`;
            }
        }

        function stopDrag() {
            isDragging = false;
            floatDiv.style.cursor = 'move';
        }

        leftHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let startX = e.clientX;
            let startLeft = floatDiv.offsetLeft;
            let startWidth = floatDiv.offsetWidth;
            function doResize(ev) {
                let deltaX = ev.clientX - startX;
                let newWidth = startWidth - deltaX;
                let newLeft = startLeft + deltaX;
                if(newWidth < 200) {
                    newWidth = 200;
                    newLeft = startLeft + (startWidth - 200);
                }
                floatDiv.style.width = newWidth + 'px';
                floatDiv.style.left = newLeft + 'px';
            }
            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            }
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        });

        rightHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let startX = e.clientX;
            let startWidth = floatDiv.offsetWidth;
            function doResize(ev) {
                let deltaX = ev.clientX - startX;
                let newWidth = startWidth + deltaX;
                if(newWidth < 200) {
                    newWidth = 200;
                }
                floatDiv.style.width = newWidth + 'px';
            }
            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            }
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        });

        bottomHandle.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let startY = e.clientY;
            let startHeight = floatDiv.offsetHeight;
            function doResize(ev) {
                let deltaY = ev.clientY - startY;
                let newHeight = startHeight + deltaY;
                if(newHeight < 150) {
                    newHeight = 150;
                }
                floatDiv.style.height = newHeight + 'px';
            }
            function stopResize() {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            }
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        });
    }

    function processLink(link) {
        if (processedLinks.has(link)) return;
        const match = link.href.match(ytRegex);
        if (!match) return;
        const videoId = match[1];
        const containerId = `yt-${videoId}-${Date.now()}`;

        const toggle = document.createElement('a');
        toggle.href = "javascript:void(0);";
        toggle.textContent = "(埋め込み)";
        toggle.style.marginLeft = "5px";

        const floatButton = document.createElement('a');
        floatButton.href = "javascript:void(0);";
        floatButton.textContent = "(フロート表示)";
        floatButton.style.marginLeft = "5px";

        const container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = `
            margin: 10px 0;
            position: relative;
            width: 100%;
            max-width: 640px;
            display: none;
        `;

        const iframe = document.createElement('iframe');
        iframe.style.cssText = `
            width: 100%;
            height: 360px;
            border: none;
            border-radius: 4px;
        `;
        iframe.src = `https://www.youtube.com/embed/${videoId}?rel=0&wmode=opaque`;
        iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');

        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
            iframe.src = iframe.src;
        });

        floatButton.addEventListener('click', (e) => {
            e.preventDefault();
            createFloatingWindow(videoId);
        });

        container.appendChild(iframe);
        link.parentNode.insertBefore(toggle, link.nextSibling);
        link.parentNode.insertBefore(floatButton, toggle.nextSibling);
        link.parentNode.insertBefore(container, floatButton.nextSibling);
        processedLinks.add(link);
    }

    root.querySelectorAll('a[href*="youtube"], a[href*="youtu.be"]').forEach(processLink);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    node.querySelectorAll('a[href*="youtube"], a[href*="youtu.be"]').forEach(processLink);
                }
            });
        });
    });
    observer.observe(root, { childList: true, subtree: true });
}



function resolveOtherThreadLinks(root = document) {
    if (window.location.href.indexOf("/res/") === -1) return;

    const candidateLinks = root.querySelectorAll('a[href$=".htm"]');
    candidateLinks.forEach(link => {
        if (link.closest('#contres')) return;
        let url = link.href.replace(/^http:\/\//, "https://");
        link.href = url;
        if (link.dataset.resolvedThread) return;
        let hostname;
        try {
            hostname = new URL(url).hostname;
        } catch (e) {
            return;
        }
        if (!hostname.endsWith(".2chan.net") || !url.includes("/res/")) return;

        const idMatch = url.match(/\/res\/(\d+)\.htm$/);
        if (!idMatch) return;
        const threadId = idMatch[1];

        if (resolvedThreadCache[url]) {
            const cache = resolvedThreadCache[url];
            if (cache.type === 'original') {
                link.textContent = `>>${threadId} 「${cache.title}」 (別スレ)`;
            } else if (cache.type === 'archive') {
                link.href = cache.archiveUrl;
                link.textContent = `>>${threadId} 「${cache.title}」 (過去ログ)`;
            } else {
                link.textContent = `>>${threadId} (別スレ) (過去ログが見つかりません)`;
            }
            link.dataset.resolvedThread = "true";
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: url + (url.includes('?') ? '&' : '?') + '_=' + Date.now(),
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const titleEl = doc.querySelector("title");
                let title = titleEl ? titleEl.textContent.trim() : "タイトル取得失敗";
                if (response.status === 200 && !title.includes("404 File Not Found")) {
                    resolvedThreadCache[url] = { type: 'original', title: title };
                    updateLink(link, threadId, title, url, 'original');
                } else {
                    const archiveUrls = generateArchiveUrls(new URL(url).hostname, new URL(url).pathname.split('/')[1], threadId);
                    checkArchiveUrls(archiveUrls, 0, function(archiveUrl, archiveTitle) {
                        if (archiveUrl) {
                            resolvedThreadCache[url] = { type: 'archive', title: archiveTitle, archiveUrl: archiveUrl };
                            updateLink(link, threadId, archiveTitle, archiveUrl, 'archive');
                        } else {
                            resolvedThreadCache[url] = { type: 'not_found' };
                            updateLink(link, threadId, null, url, 'not_found');
                        }
                    });
                }
            },
            onerror: function() {
                resolvedThreadCache[url] = { type: 'not_found' };
                updateLink(link, threadId, null, url, 'not_found');
            }
        });
    });
}


        function generateArchiveUrls(host, board, threadId) {
            if (host.includes("may.2chan.net") && board === "b") {
                return [
                    `https://may1.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm`,
                    `https://may2.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm`,
                    `https://may3.ftbucket.info/may/cont/may.2chan.net_b_res_${threadId}/index.htm`,
                    `https://kako.futakuro.com/futa/may_b/${threadId}/`,
                    `https://futabaforest.net/b/res/${threadId}.htm`
                ];
            }
            if (host.includes("img.2chan.net") && board === "b") {
                return [
                    `https://c3.ftbucket.info/img/cont/img.2chan.net_b_res_${threadId}/index.htm`,
                    `https://kako.futakuro.com/futa/img_b/${threadId}/`
                ];
            }
            if (host.includes("jun.2chan.net") && board === "jun") {
                return [
                    `https://c3.ftbucket.info/jun/cont/jun.2chan.net_jun_res_${threadId}/index.htm`
                ];
            }
            if (host.includes("dec.2chan.net")) {
                return [
                    `https://c3.ftbucket.info/other/cont/${host.replace(/\./g, '_')}_${board}_res_${threadId}/index.htm`
                ];
            }
            return [];
        }

        function checkArchiveUrls(urls, index, callback) {
            if (index >= urls.length) return callback(null, null);

            let options = {
                method: "HEAD",
                url: urls[index],
                onload: function(res) {
                    if (res.status >= 200 && res.status < 400) {
                        if (urls[index].includes("ftbucket.info")) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: urls[index],
                                responseType: "arraybuffer",
                                onload: function(getRes) {
                                    let decoder = new TextDecoder("shift_jis");
                                    let text = decoder.decode(getRes.response);
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(text, "text/html");
                                    const titleEl = doc.querySelector("title");
                                    let title = titleEl ? titleEl.textContent.trim() : "";
                                    if (!title || title === "タイトル不明") {
                                        checkArchiveUrls(urls, index + 1, callback);
                                    } else {
                                        callback(urls[index], title);
                                    }
                                },
                                onerror: function() {
                                    checkArchiveUrls(urls, index + 1, callback);
                                }
                            });
                        }
                        else if (urls[index].includes("futakuro.com")) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: urls[index],
                                onload: function(getRes) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(getRes.responseText, "text/html");
                                    const titleEl = doc.querySelector("title");
                                    let title = titleEl ? titleEl.textContent.trim() : "";
                                    if (!title || title === "タイトル不明") {
                                        checkArchiveUrls(urls, index + 1, callback);
                                    } else {
                                        callback(urls[index], title);
                                    }
                                },
                                onerror: function() {
                                    checkArchiveUrls(urls, index + 1, callback);
                                }
                            });
                        }
                        else if (urls[index].includes("futabaforest.net")) {
                            options.timeout = 10000;
                            options.ontimeout = function() {
                                checkArchiveUrls(urls, index + 1, callback);
                            };
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: urls[index],
                                responseType: "text",
                                onload: function(getRes) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(getRes.responseText, "text/html");
                                    const titleEl = doc.querySelector("title");
                                    let title = titleEl ? titleEl.textContent.trim() : "";
                                    if (!title || title === "タイトル不明") {
                                        checkArchiveUrls(urls, index + 1, callback);
                                    } else {
                                        callback(urls[index], title);
                                    }
                                },
                                onerror: function() {
                                    checkArchiveUrls(urls, index + 1, callback);
                                }
                            });
                        }
                        else {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: urls[index],
                                onload: function(getRes) {
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(getRes.responseText, "text/html");
                                    const titleEl = doc.querySelector("title");
                                    let title = titleEl ? titleEl.textContent.trim() : "";
                                    if (!title || title === "タイトル不明") {
                                        checkArchiveUrls(urls, index + 1, callback);
                                    } else {
                                        callback(urls[index], title);
                                    }
                                },
                                onerror: function() {
                                    checkArchiveUrls(urls, index + 1, callback);
                                }
                            });
                        }
                    } else {
                        checkArchiveUrls(urls, index + 1, callback);
                    }
                },
                onerror: function() {
                    checkArchiveUrls(urls, index + 1, callback);
                }
            };
            GM_xmlhttpRequest(options);
        }

        function updateLink(link, threadId, title, newUrl, type) {
            if (type === 'original') {
                link.textContent = `>>${threadId} 「${title}」 (別スレ)`;
            } else if (type === 'archive') {
                link.href = newUrl;
                link.textContent = `>>${threadId} 「${title}」 (過去ログ)`;
            } else {
                link.textContent = `>>${threadId} (別スレ) (過去ログが見つかりません)`;
            }
            link.dataset.resolvedThread = "true";
        }


    function processNodes(root = document) {
        removeUnwantedElements(root);
        addDownloadButtons(root);
        updateFileSizes(root);
        attachFullSizeHover();
        changeFaviconIfCondition();
        addYouTubeEmbeds(root);
        cleanseJumpLinks(root);
        insertQuoteBreaks(root);
        root.querySelectorAll("td.rtd").forEach(processPost);
        if (window.location.href.indexOf("/res/") !== -1) {
            resolveOtherThreadLinks(root);
        }
    }
    processNodes();
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { processNodes(node); }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(autoReloadThread, 5000);
    setInterval(checkSodCondition, 1000);

    if (window.location.href.indexOf("/res/") !== -1) {
        const scrollKey = "2chan_lastScroll_" + window.location.pathname;
        window.addEventListener("load", () => {
            const lastScroll = localStorage.getItem(scrollKey);
            if (lastScroll) { window.scrollTo(0, parseInt(lastScroll, 10)); }
        });
        window.addEventListener("scroll", () => {
            localStorage.setItem(scrollKey, window.pageYOffset);
        });
    }

    if (window.location.hostname === "www.2chan.net" && window.location.pathname === "/index2.html") {
        const boardMapping = {
            "img_b": "二次元裏img",
            "dec_dec": "二次元裏dec",
            "jun_jun": "二次元裏jun",
            "may_b": "二次元裏may",
            "dat_b": "二次元裏dat",
            "dec_58": "転載不可",
            "dec_59": "転載可",
            "dec_img2": "二次元表",
            "may_id": "二次元ID",
            "dat_43": "二次元業界",
            "dat_20": "甘味",
            "dat_21": "ラーメン",
            "dat_23": "スピグラ",
            "dat_l": "壁紙二",
            "may_25": "麻雀",
            "may_26": "うま",
            "may_27": "ねこ",
            "zip_12": "サッカー",
            "zip_14": "自作絵裏",
            "zip_5": "えろげ",
            "zip_1": "野球",
            "zip_11": "自作絵",
            "zip_2": "ろぼ",
            "dec_63": "映画",
            "zip_3": "自作PC",
            "zip_32": "女装",
            "zip_15": "ばら",
            "zip_7": "ゆり",
            "zip_8": "やおい",
            "dec_65": "刀剣乱舞",
            "dec_64": "占い",
            "dec_66": "ファッション",
            "dec_67": "旅行",
            "dec_68": "子育て",
            "may_webm": "webm",
            "dec_71": "そうだね",
            "zip_p": "お絵かき",
            "nov_q": "落書き",
            "zip_z": "しょくぶつ",
            "dat_d": "どうぶつ",
            "dat_e": "のりもの",
            "dat_j": "二輪",
            "nov_37": "自転車",
            "dat_45": "カメラ",
            "dat_48": "家電",
            "dat_r": "鉄道",
            "dat_t": "料理",
            "dat_44": "おもちゃ",
            "dat_v": "模型",
            "nov_y": "模型裏",
            "jun_47": "模型裏裏",
            "dat_w": "虫",
            "dat_49": "アクア",
            "dec_62": "アウトドア",
            "dec_73": "VTuber",
            "dec_84": "ホロライブ",
            "dec_81": "合成音声",
            "dat_x": "3DCG",
            "dec_85": "人工知能",
            "nov_35": "政治",
            "nov_36": "経済",
            "dec_79": "宗教",
            "dat_38": "尹錫悦",
            "dec_80": "岸田文雄",
            "dec_50": "三次実況",
            "cgi_f": "軍",
            "may_39": "軍裏",
            "dec_74": "FGO",
            "dec_75": "アイマス",
            "dec_86": "ZOIDS",
            "dec_78": "ウメハラ総合",
            "jun_31": "ゲーム",
            "nov_28": "ネトゲ",
            "dec_56": "ソシャゲ",
            "dec_60": "艦これ",
            "dec_82": "任天堂",
            "dec_69": "モアイ",
            "dec_61": "ソニー",
            "dat_10": "ネットキャラ",
            "nov_34": "なりきり",
            "cgi_g": "特撮",
            "cgi_i": "flash",
            "may_40": "東方",
            "dec_55": "東方裏",
            "cgi_k": "壁紙",
            "cgi_m": "数学",
            "zip_6": "ニュース表",
            "dec_76": "昭和",
            "dec_77": "平成",
            "dec_53": "発電",
            "dec_52": "自然災害",
            "dec_83": "コロナ",
            "img_9": "雑談",
            "dec_70": "新板提案",
            "cgi_o": "二次元グロ",
            "jun_51": "二次元グロ裏",
            "cgi_u": "落書き裏",
            "jun_oe": "お絵sql",
            "jun_72": "お絵sqlip",
            "www_hinan": "ふたば避難所",
            "jun_junbi": "準備"
        };

        const RSS_URL = 'https://futapo.futakuro.com/ranking/index.rdf';
        function fetchRSS() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: RSS_URL,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        const items = xmlDoc.getElementsByTagName('item');
                        let threads = [];
                        for (let i = 0; i < Math.min(9, items.length); i++) {
                            const item = items[i];
                            const titleRaw = item.getElementsByTagName('title')[0].textContent;
                            const title = titleRaw.replace(/^\d+位[:：]?/, '').trim();

                            let link = item.getElementsByTagName('link')[0].textContent;
                            if(link.indexOf('//') === 0){
                                link = 'https:' + link;
                            }

                            let match = link.match(/https?:\/\/([^\.]+)\.2chan\.net\/([^\/]+)\/res\//);
                            let subdomain = '', identifier = '', boardName = 'unknown';
                            if(match) {
                                subdomain = match[1];
                                identifier = match[2];
                                let boardKey = subdomain + "_" + identifier;
                                if(boardMapping[boardKey]){
                                    boardName = boardMapping[boardKey];
                                } else {
                                    boardName = identifier;
                                }
                            }

                            const descCDATA = item.getElementsByTagName('description')[0].textContent;
                            let imgSrc = '';
                            const imgMatch = descCDATA.match(/<img\s+src=["']([^"']+)["']/);
                            if (imgMatch) {
                                imgSrc = imgMatch[1];
                            }
                            threads.push({ subdomain, identifier, boardName, imgSrc, title, link });
                        }
                        insertGrid(threads);
                    }
                }
            });
        }

        function insertGrid(threads) {
            const gridTable = document.createElement('table');
            gridTable.style.margin = '20px auto';
            gridTable.style.borderCollapse = 'collapse';
            gridTable.style.fontFamily = 'sans-serif';
            gridTable.style.fontSize = '10px';
            gridTable.style.width = '70%';
            gridTable.style.maxWidth = '800px';
            gridTable.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
            gridTable.style.border = '1px solid #000000';
            gridTable.style.tableLayout = 'fixed';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            const headerCell = document.createElement('th');
            headerCell.colSpan = 3;
            headerCell.textContent = '勢い上昇中のスレ';
            headerCell.style.fontSize = '14px';
            headerCell.style.fontWeight = 'bold';
            headerCell.style.color = '#fff';
            headerCell.style.backgroundColor = '#781225';
            headerCell.style.padding = '2px 5px';
            headerCell.style.textAlign = 'center';
            headerRow.appendChild(headerCell);
            thead.appendChild(headerRow);
            gridTable.appendChild(thead);

            const tbody = document.createElement('tbody');
            for (let row = 0; row < 3; row++) {
                const tr = document.createElement('tr');
                for (let col = 0; col < 3; col++) {
                    const td = document.createElement('td');
                    td.style.border = '1px solid #000000';
                    td.style.padding = '4px';
                    td.style.textAlign = 'center';
                    td.style.verticalAlign = 'top';
                    td.style.width = '33%';
                    td.style.boxSizing = 'border-box';
                    td.style.height = '200px';
                    td.style.overflow = 'hidden';

                    const index = row * 3 + col;
                    if (threads[index]) {
                        const { subdomain, identifier, boardName, imgSrc, title, link } = threads[index];

                        const boardLink = document.createElement('a');
                        boardLink.href = 'https://' + subdomain + '.2chan.net/' + identifier + '/';
                        boardLink.target = '_blank';
                        boardLink.textContent = boardName;
                        boardLink.style.fontSize = '14px';
                        boardLink.style.fontWeight = 'bold';
                        boardLink.style.marginBottom = '2px';
                        boardLink.style.display = 'block';
                        td.appendChild(boardLink);

                        const anchor = document.createElement('a');
                        anchor.href = link;
                        anchor.target = '_blank';
                        anchor.style.textDecoration = 'none';
                        anchor.style.color = 'inherit';

                        if (imgSrc) {
                            const imgElem = document.createElement('img');
                            imgElem.src = imgSrc;
                            imgElem.style.maxWidth = '90%';
                            imgElem.style.maxHeight = '100px';
                            imgElem.style.height = 'auto';
                            imgElem.style.marginBottom = '2px';
                            anchor.appendChild(imgElem);
                        }
                        const titleElem = document.createElement('div');
                        titleElem.textContent = title;
                        titleElem.style.marginTop = '2px';
                        titleElem.style.fontSize = '16px';
                        anchor.appendChild(titleElem);

                        td.appendChild(anchor);
                    }
                    tr.appendChild(td);
                }
                tbody.appendChild(tr);
            }
            gridTable.appendChild(tbody);

            const existingTables = document.getElementsByTagName('table');
            if (existingTables.length > 0) {
                const targetTable = existingTables[0];
                const spacer = document.createElement('div');
                spacer.style.height = '20px';
                targetTable.parentNode.insertBefore(spacer, targetTable.nextSibling);
                targetTable.parentNode.insertBefore(gridTable, spacer.nextSibling);
            }
        }

        window.addEventListener('load', fetchRSS, false);
    }


    GM_addStyle(`
        .lds-ring,
        .lds-ring div {
            box-sizing: border-box;
        }
        .lds-ring {
            display: inline-block;
            position: relative;
            width: 14px;
            height: 14px;
        }
        .lds-ring div {
            box-sizing: border-box;
            display: block;
            position: absolute;
            width: 15px;
            height: 15px;
            border: 2px solid currentColor;
            border-radius: 50%;
            animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
            border-color: currentColor transparent transparent transparent;
        }
        .lds-ring div:nth-child(1) {
            animation-delay: -0.45s;
        }
        .lds-ring div:nth-child(2) {
            animation-delay: -0.3s;
        }
        .lds-ring div:nth-child(3) {
            animation-delay: -0.15s;
        }
        @keyframes lds-ring {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);


    if (!window.location.href.includes('futaba.php?mode=cat')) return;

    if (window.location.href.includes('mode=catset')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const sortParam = urlParams.get('sort');

    let existingThreads = new Set();
    let fetchedThreads = [];
    let board = '';
    let subdomain = '';
    let useCatVersion = false;

    const catalogTable = document.querySelector('#cattable tbody');
    if (!catalogTable) return;

    function recordExistingThreads() {
        catalogTable.querySelectorAll('td').forEach(td => {
            const link = td.querySelector('a[href*="res/"]');
            if (link) {
                existingThreads.add(link.getAttribute('href'));
            }
        });
    }
    recordExistingThreads();

    let maxColumns = 1;
    const firstRow = catalogTable.querySelector('tr');
    if (firstRow) {
        maxColumns = firstRow.children.length;
    }

    const firstImg = catalogTable.querySelector('td img');
    if (firstImg && firstImg.src.includes('/cat/')) {
        useCatVersion = true;
    }

    const preExistingSmall = catalogTable.querySelector('td small');
    const includeTitle = !!(preExistingSmall && preExistingSmall.textContent.trim().length > 0);
    let maxTitleLength = 100;
    if (preExistingSmall) {
        maxTitleLength = preExistingSmall.textContent.trim().length;
    }

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = '絞り込み....';
    searchBox.style.margin = '5px';
    searchBox.style.padding = '3px';
    searchBox.style.fontSize = '90%';
    const targetLink = document.querySelector('a[href*="futaba.php?mode=cat"][href*="sort=9"][href*="guid=on"]');
    if (targetLink) {
        targetLink.parentNode.insertBefore(searchBox, targetLink.nextSibling);
    } else {
        document.body.insertBefore(searchBox, document.body.firstChild);
    }
    searchBox.addEventListener('input', () => {
        const query = searchBox.value.trim().toLowerCase();
        const tds = catalogTable.querySelectorAll('td');
        tds.forEach(td => {
            if (query === '') {
                td.style.display = '';
            } else {
                const small = td.querySelector('small');
                const text = small ? small.textContent.toLowerCase() : '';
                const href = td.querySelector('a') ? td.querySelector('a').getAttribute('href').toLowerCase() : '';
                td.style.display = (text.includes(query) || href.includes(query)) ? '' : 'none';
            }
        });
    });

    const loadingDialog = document.createElement('div');
    loadingDialog.style.position = 'fixed';
    loadingDialog.style.top = '46px';
    loadingDialog.style.right = '20px';
    loadingDialog.style.background = 'rgba(0,0,0,0.7)';
    loadingDialog.style.color = '#fff';
    loadingDialog.style.padding = '10px 15px';
    loadingDialog.style.borderRadius = '5px';
    loadingDialog.style.zIndex = '9999';
    loadingDialog.style.fontSize = '14px';
    loadingDialog.style.display = 'flex';
    loadingDialog.style.alignItems = 'center';

    loadingDialog.innerHTML = `
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
        <span id="loadingText" style="margin-left: 10px;">カタログを取得しています...</span>
    `;
    document.body.appendChild(loadingDialog);

    (function extractBoard() {
        const parts = window.location.hostname.split('.');
        subdomain = parts[0];
        const pathParts = window.location.pathname.split('/');
        board = pathParts[1];
    })();

    function isInsideExcludedElement(el) {
        let p = el.parentElement;
        while (p) {
            if (['table', 'tr', 'td'].includes(p.tagName.toLowerCase())) return true;
            p = p.parentElement;
        }
        return false;
    }

    function createNewRow() {
        const tr = document.createElement('tr');
        catalogTable.appendChild(tr);
        return tr;
    }
    let currentRow = catalogTable.lastElementChild || createNewRow();

    function addThreadToDOM(thread) {
        if (existingThreads.has(thread.href)) return;
        existingThreads.add(thread.href);
        let titleHtml = "";
        if (includeTitle && typeof thread.title === 'string' && thread.title.trim().length > 0) {
            let t = thread.title.trim();
            if (t.length > maxTitleLength) {
                t = t.substring(0, maxTitleLength) + '...';
            }
            titleHtml = `<br><small>${t}</small>`;
        }
        const td = document.createElement('td');
        td.innerHTML = `
            <a href="${thread.href}" target="_blank">
                <img src="${thread.imgSrc}" border="0" width="${thread.width}" height="${thread.height}" alt="" loading="lazy">
            </a>
            ${titleHtml}
            <br><font size="2">${thread.replyCount}</font><div class="pdmc" data-no="${thread.id}"></div>
        `;
        if (currentRow.children.length >= maxColumns) {
            currentRow = createNewRow();
        }
        currentRow.appendChild(td);
    }

    function addThreadToCatalog(thread) {
        if (existingThreads.has(thread.href)) return;
        if (sortParam && !['6','7','8','9'].includes(sortParam)) {
            fetchedThreads.push(thread);
            return;
        }
        addThreadToDOM(thread);
    }
    function finalizeSortedThreads() {
        if (!sortParam || ['6','7','8','9'].includes(sortParam)) return;
        if (sortParam === '1') {
            fetchedThreads.sort((a, b) => new Date(b.date) - new Date(a.date));
            fetchedThreads.reverse();
        } else if (sortParam === '2') {
            fetchedThreads.sort((a, b) => new Date(a.date) - new Date(b.date));
            fetchedThreads.reverse();
        } else if (sortParam === '3') {
            fetchedThreads.sort((a, b) => b.replyCount - a.replyCount);
        } else if (sortParam === '4') {
            fetchedThreads.sort((a, b) => a.replyCount - b.replyCount);
        }
        fetchedThreads.forEach(thread => addThreadToDOM(thread));
    }

    function gmFetch(url, attempts = 0) {
        const maxAttempts = 10;
        return new Promise(resolve => {
            function attempt() {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: resp => resolve(resp),
                    onerror: err => {
                        if (attempts < maxAttempts) {
                            attempts++;
                            console.warn(`Error fetching ${url}, attempt ${attempts}`, err);
                            attempt();
                        } else {
                            console.error(`Max attempts reached for ${url}. Returning empty`);
                            resolve({ status: 408, responseText: "" });
                        }
                    }
                });
            }
            attempt();
        });
    }

    function fetchThreadPromise(threadURL, relativeHref) {
        return new Promise(resolve => {
            gmFetch(threadURL).then(response => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const threadIDMatch = relativeHref.match(/res\/(\d+)\.htm/);
                const threadID = threadIDMatch ? threadIDMatch[1] : "";

                let imgElement = null;
                const imgs = doc.querySelectorAll("img");
                imgs.forEach(img => {
                    if (!img.getAttribute("src").includes(`/${board}/thumb/`)) return;
                    if (isInsideExcludedElement(img)) return;
                    if (!imgElement) imgElement = img;
                });
                if (!imgElement) {
                    resolve();
                    return;
                }
                const thumbSrc = imgElement.getAttribute("src");
                const catSrc = thumbSrc.replace(`/${board}/thumb/`, `/${board}/cat/`);
                const thumbWidth = imgElement.getAttribute("width") || "50";
                const thumbHeight = imgElement.getAttribute("height") || "50";
                const finalSrc = useCatVersion ? catSrc : thumbSrc;

                function processThread(finalW, finalH) {
                    let blockquotes = doc.querySelectorAll("blockquote");
                    let threadText = "";
                    for (const bq of blockquotes) {
                        if (isInsideExcludedElement(bq)) continue;
                        threadText = bq.textContent.trim();
                        if (threadText) break;
                    }

                    let dateSpans = doc.querySelectorAll("span.cnw");
                    let threadDate = "";
                    for (const sp of dateSpans) {
                        if (isInsideExcludedElement(sp)) continue;
                        threadDate = sp.textContent.trim();
                        if (threadDate) break;
                    }

                    let replyCount = doc.querySelectorAll("table").length;
                    let title = threadText.split("\n")[0] || "";

                    const threadInfo = {
                        href: threadURL,
                        id: threadID,
                        imgSrc: finalSrc,
                        width: finalW,
                        height: finalH,
                        title: title,
                        date: threadDate,
                        replyCount: replyCount
                    };
                    addThreadToCatalog(threadInfo);
                    resolve();
                }

                if (useCatVersion) {
                    let timedOut = false;
                    const tId = setTimeout(() => {
                        timedOut = true;
                        console.warn(`Image load timeout for ${catSrc}, fallback size`);
                        processThread(50, 50);
                    }, 500);
                    let tempImg = new Image();
                    tempImg.onload = () => {
                        if (!timedOut) {
                            clearTimeout(tId);
                            processThread(tempImg.naturalWidth, tempImg.naturalHeight);
                        }
                    };
                    tempImg.onerror = () => {
                        if (!timedOut) {
                            clearTimeout(tId);
                            processThread(50, 50);
                        }
                    };
                    tempImg.src = catSrc;
                } else {
                    processThread(thumbWidth, thumbHeight);
                }
            }).catch(() => { resolve(); });
        });
    }

    function fetchIndexPagePromise(pageUrl) {
        console.log("Fetching index page:", pageUrl);
        return new Promise(resolve => {
            gmFetch(pageUrl).then(response => {
                if (response.status === 404 || response.responseText.includes("404 File Not Found")) {
                    console.log(`Index page ${pageUrl} not found, skipping.`);
                    resolve();
                    return;
                }
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                let threadPromises = [];
                const links = doc.querySelectorAll("a.hsbn");
                links.forEach(link => {
                    const relHref = link.getAttribute("href");
                    console.log("Found thread URL:", relHref, "on page:", pageUrl);
                    const threadURL = `${window.location.protocol}//${subdomain}.2chan.net/${board}/` + relHref;
                    if (!existingThreads.has(relHref)) {
                        existingThreads.add(relHref);
                        threadPromises.push(fetchThreadPromise(threadURL, relHref));
                    }
                });
                Promise.all(threadPromises).then(resolve).catch(resolve);
            }).catch(resolve);
        });
    }

    const baseURL = `${window.location.protocol}//${subdomain}.2chan.net/${board}/`;
    const indexPages = [];
    indexPages.push(baseURL + "futaba.htm");
    for (let i = 1; i <= 20; i++) {
        indexPages.push(baseURL + i + ".htm");
    }

    if (['6','7','8','9'].includes(sortParam)) {
        loadingDialog.style.display = "none";

        setTimeout(() => {
            loadingDialog.style.display = "none";
        }, 1500);
        return;
    }

    const indexPromises = indexPages.map(url => fetchIndexPagePromise(url));

    Promise.all(indexPromises).then(() => {
        if (sortParam) {
            finalizeSortedThreads();
        }
        loadingDialog.innerHTML = `
          <div style="font-size: 14px; margin-right: 6px;">✅</div>
          <div id="loadingText" style="color: #fff; font-weight: bold;">カタログを取得しました！</div>
        `;
        loadingDialog.style.background = "green";
        loadingDialog.style.opacity = "1";
        setTimeout(() => {
            loadingDialog.style.display = "none";
        }, 1500);
    });
})();

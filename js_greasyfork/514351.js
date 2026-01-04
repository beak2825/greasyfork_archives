// ==UserScript==
// @name        哔哩哔哩国际版(B-Global)字幕下载
// @namespace   https://github.com/AreCie
// @version     1.2
// @description 下载bilibili国际版字幕；注意：切勿频繁请求，可能会造成风控！
// @license     AGPL-3.0-or-later
// @homepage    https://github.com/AreCie/B-Global-SubtitleDown
// @supportURL  https://github.com/AreCie/B-Global-SubtitleDown/issues
// @author      AreCie
// @match       https://www.bilibili.tv/*play/*
// @icon        https://p.bstarstatic.com/fe-static/deps/bilibili_tv.ico?v=1
// @require     https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/514351/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BD%E9%99%85%E7%89%88%28B-Global%29%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/514351/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%9B%BD%E9%99%85%E7%89%88%28B-Global%29%E5%AD%97%E5%B9%95%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(() => {
    'use strict';

    function applyStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    const buttonStyles = {
        padding: '0 8px',
        height: '32px',
        backgroundColor: '#4C93FF',
        color: 'white',
        fontSize: 'inherit',
        fontWeight: '700',
        border: 'none',
        borderRadius: '5px',
        marginLeft: '10px',
        cursor: 'pointer'
    };

    const getSubBtn = document.createElement('button');
    getSubBtn.id = 'getSubBtn';
    getSubBtn.innerText = '获取字幕';
    applyStyles(getSubBtn, buttonStyles);

    const getAllSubBtn = document.createElement('button');
    getAllSubBtn.id = 'getAllSubBtn';
    getAllSubBtn.innerText = '获取全部字幕';
    applyStyles(getAllSubBtn, buttonStyles);

    const popupContainer = document.createElement("div");
    applyStyles(popupContainer, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "50px 10px 20px 10px",
        backgroundColor: "#ffffff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        width: "380px",
        zIndex: "9999",
        cursor: "move"
    });

    const popupChildContainer = document.createElement("div");
    applyStyles(popupChildContainer, {
        maxHeight: "50vh",
        overflowY: "auto"
    });

    let isDragging = false;
    let offsetX, offsetY;

    popupContainer.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - popupContainer.getBoundingClientRect().left;
        offsetY = e.clientY - popupContainer.getBoundingClientRect().top;
        popupContainer.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", e => {
        if (isDragging) {
            popupContainer.style.left = `${e.clientX - offsetX}px`;
            popupContainer.style.top = `${e.clientY - offsetY}px`;
            popupContainer.style.transform = "none";
        }
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        popupContainer.style.cursor = "move";
    });

    const closeButton = document.createElement("div");
    applyStyles(closeButton, {
        position: "absolute",
        top: "8px",
        right: "8px",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        backgroundColor: "#ff5e5e",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff"
    });
    closeButton.textContent = "×";
    closeButton.onclick = () => document.body.removeChild(popupContainer);

    function insertButton() {
        const appendBaseBtn = document.querySelector('.interactive__btn.interactive__fav');
        if (appendBaseBtn && !document.querySelector("#getSubBtn")) {
            appendBaseBtn.insertAdjacentElement('afterend', getAllSubBtn);
            appendBaseBtn.insertAdjacentElement('afterend', getSubBtn);
        }
    }

    insertButton();

    const observer = new MutationObserver(insertButton);
    observer.observe(document.body, { childList: true, subtree: true });

    // 将 JSON 字幕转换为 SRT 格式
    function convertJsonToSrt(jsonContent) {
        // 将秒转换为 SRT 时间格式 (hh:mm:ss,ms)
        function secondsToSrtTime(seconds) {
            const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
            const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
            const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
            const millis = Math.round((seconds % 1) * 1000).toString().padStart(3, '0');
            return `${hours}:${minutes}:${secs},${millis}`;
        }

        const subtitles = jsonContent.body;
        let srtContent = "";

        subtitles.forEach((subtitle, index) => {
            const startTime = secondsToSrtTime(subtitle.from);
            const endTime = secondsToSrtTime(subtitle.to);
            srtContent += `${index + 1}\n`; // 编号
            srtContent += `${startTime} --> ${endTime}\n`; // 时间
            srtContent += `${subtitle.content}\n\n`; // 内容和换行
        });

        return srtContent.trim(); // 去掉末尾的多余换行
    }

    function processSrtFile(blob, filename) {
        const reader = new FileReader();
        reader.onload = function () {
            try {
                const jsonContent = JSON.parse(reader.result);
                const srtContent = convertJsonToSrt(jsonContent);
                const srtBlob = new Blob([srtContent], { type: 'text/plain' });
                triggerDownload(srtBlob, filename);
            } catch (error) {
                console.error('解析或转换失败:', error);
            }
        };
        reader.readAsText(blob);
    }

    function triggerDownload(blob, filename) {
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
    }

    function downloadFile(url, filename) {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                if (filename.toLowerCase().endsWith('.srt')) {
                    processSrtFile(blob, filename);
                } else {
                    triggerDownload(blob, filename);
                }
            })
            .catch(error => console.error('下载失败:', error));
    }

    const langDict = {
        'zh-Hans': '简体中文',
        'id': '印尼语',
        'th': '泰语',
        'en': '英语',
        'vi': '越南语'
    };

    function addSubItem(subs) {
        const urlWithoutParams = window.location.origin + window.location.pathname;
        const match = urlWithoutParams.match(/\/play\/(\d+)/);
        let anime_id = match ? match[1] : null;

        popupContainer.innerHTML = "";
        popupChildContainer.innerHTML = "";
        popupContainer.appendChild(closeButton);

        let downs = [];

        subs.data.forEach(item => {
            if (subs.type === 1) {
                const itemDiv = document.createElement("div");
                applyStyles(itemDiv, {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "5px 10px"
                });

                itemDiv.className = "sub-item";
                itemDiv.innerHTML = '';

                // const checkElem = document.createElement('input');
                // checkElem.type = "checkbox"
                // itemDiv.appendChild(checkElem);
                const langSpan = document.createElement('span');
                langSpan.style.width = '120px';
                langSpan.textContent = item.lang;
                itemDiv.appendChild(langSpan);

                if (item.srt) {
                    const srtButton = document.createElement('button');
                    srtButton.textContent = '下载SRT';
                    srtButton.style.backgroundColor = '#4CAF50';
                    srtButton.style.marginLeft = 'auto';
                    srtButton.style.color = 'white';
                    srtButton.style.padding = '5px 10px';
                    srtButton.style.cursor = 'pointer';
                    srtButton.style.borderRadius = '4px';
                    srtButton.onclick = () => downloadFile(item.srt, `${item.lang}.srt`);
                    itemDiv.appendChild(srtButton);
                }

                if (item.ass) {
                    const assButton = document.createElement('button');
                    assButton.textContent = '下载ASS';
                    assButton.style.backgroundColor = '#4C93FF';
                    assButton.style.marginLeft = '10px';
                    assButton.style.color = 'white';
                    assButton.style.padding = '5px 10px';
                    assButton.style.cursor = 'pointer';
                    assButton.style.borderRadius = '4px';
                    assButton.onclick = () => downloadFile(item.ass, `${item.lang}.ass`);
                    itemDiv.appendChild(assButton);
                }

                popupChildContainer.appendChild(itemDiv);
            } else {
                const epDiv = document.createElement("div");
                epDiv.style.border = "1px solid #ccc";
                epDiv.style.borderRadius = "4px";
                epDiv.style.width = "100%";
                epDiv.style.margin = "10px 0";
                epDiv.style.padding = "5px";

                const epSpan = document.createElement("span");
                epSpan.textContent = item.title;
                epDiv.appendChild(epSpan);

                item.ep_subs.forEach(s => {
                    const itemDiv = document.createElement("div");
                    applyStyles(itemDiv, {
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "5px 0"
                    });
                    itemDiv.className = "sub-item";

                    const langSpan = document.createElement('span');
                    langSpan.style.width = '120px';
                    langSpan.textContent = s.lang;
                    itemDiv.appendChild(langSpan);

                    if (s.srt) {
                        downs.push({
                            title: `${item.title}_${s.lang}.srt`,
                            url: s.srt
                        });

                        const srtButton = document.createElement('button');
                        srtButton.textContent = '下载SRT';
                        srtButton.style.backgroundColor = '#4CAF50';
                        srtButton.style.marginLeft = 'auto';
                        srtButton.style.color = 'white';
                        srtButton.style.padding = '5px 10px';
                        srtButton.style.cursor = 'pointer';
                        srtButton.style.borderRadius = '4px';
                        srtButton.onclick = () => downloadFile(s.srt, `${item.title}_${s.lang}.srt`);
                        itemDiv.appendChild(srtButton);
                    }

                    if (s.ass) {
                        downs.push({
                            title: `${item.title}_${s.lang}.ass`,
                            url: s.ass
                        });

                        const assButton = document.createElement('button');
                        assButton.textContent = '下载ASS';
                        assButton.style.backgroundColor = '#4C93FF';
                        assButton.style.marginLeft = '10px';
                        assButton.style.color = 'white';
                        assButton.style.padding = '5px 10px';
                        assButton.style.cursor = 'pointer';
                        assButton.style.borderRadius = '4px';
                        assButton.onclick = () => downloadFile(s.ass, `${item.title}_${s.lang}.ass`);
                        itemDiv.appendChild(assButton);
                    }

                    epDiv.appendChild(itemDiv);
                });
                popupChildContainer.appendChild(epDiv);
            }
        });

        if (subs.type === 2) {
            const batchDownBtn = document.createElement("button");
            batchDownBtn.textContent = "下载全部";

            Object.assign(batchDownBtn.style, {
                position: "absolute",
                top: "8px",
                left: "8px",
                width: "130px",
                height: "30px",
                borderRadius: "4px",
                background: "#4C93FF",
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
            });

            batchDownBtn.onclick = async () => {
                batchDownBtn.textContent = "请稍等...";
                const zip = new JSZip();

                const filePromises = downs.map(d =>
                    fetch(d.url)
                        .then(response => response.blob())
                        .then(blob => {
                            if (d.title.toLowerCase().endsWith('.srt')) {
                                const reader = new FileReader();
                                reader.onload = function () {
                                    try {
                                        const jsonContent = JSON.parse(reader.result);
                                        const srtContent = convertJsonToSrt(jsonContent);
                                        const srtBlob = new Blob([srtContent], { type: 'text/plain' });
                                        zip.file(d.title, srtBlob);
                                    } catch (error) {
                                        console.error('解析或转换失败:', error);
                                    }
                                };
                                reader.readAsText(blob);
                            } else {
                                zip.file(d.title, blob);
                            }
                        })
                );

                await Promise.all(filePromises);

                // 生成 ZIP 文件并下载
                zip.generateAsync({ type: "blob" }).then(content => {
                    const downloadUrl = URL.createObjectURL(content);
                    const a = document.createElement('a');
                    a.href = downloadUrl;
                    a.download = `${anime_id}_subs.zip`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(downloadUrl);
                }).then(() => batchDownBtn.textContent = "下载全部");
            };


            popupContainer.appendChild(batchDownBtn);
        }


        popupContainer.appendChild(popupChildContainer);
        document.body.appendChild(popupContainer);
    }

    getSubBtn.addEventListener('click', () => {
        const urlWithoutParams = window.location.origin + window.location.pathname;
        const match = urlWithoutParams.match(/\/play\/\d+\/(\d+)/);
        let ep_id = match ? match[1] : null;

        if (!ep_id) {
            const firspEp = document.querySelector('.ep-list').firstElementChild;
            ep_id = firspEp.getAttribute('href').match(/\/play\/\d+\/(\d+)/)[1];
        }
        getSubBtn.innerText = "请稍等...";
        fetch(`https://api.bilibili.tv/intl/gateway/web/v2/subtitle?s_locale=en_US&platform=web&episode_id=${ep_id}`)
            .then(resp => resp.json())
            .then(data => {
                const subs = {
                    type: 1, data: data.data.video_subtitle.map(subtitle => ({
                        lang: langDict[subtitle.lang_key] ? langDict[subtitle.lang_key] : subtitle.lang,
                        srt: subtitle.srt ? subtitle.srt.url : null,
                        ass: subtitle.ass ? subtitle.ass.url : null
                    }))
                };
                addSubItem(subs);
                getSubBtn.innerText = "获取字幕";
            });
    });

    getAllSubBtn.addEventListener('click', () => {
        getAllSubBtn.innerText = "请稍等...";
        const epListDiv = document.querySelector('.ep-list');
        const links = epListDiv.querySelectorAll('a[href]');
        const subs = { type: 2, data: [] };

        Promise.all([...links].map(link => {
            const hrefMatch = link.getAttribute('href').match(/\/play\/\d+\/(\d+)/);
            if (hrefMatch) {
                const episodeId = hrefMatch[1];
                return fetch(`https://api.bilibili.tv/intl/gateway/web/v2/subtitle?s_locale=en_US&platform=web&episode_id=${episodeId}`)
                    .then(resp => resp.json())
                    .then(data => {
                        subs.data.push({
                            title: link.innerText,
                            ep_subs: data.data.video_subtitle.map(subtitle => ({
                                lang: langDict[subtitle.lang_key] ? langDict[subtitle.lang_key] : subtitle.lang,
                                srt: subtitle.srt ? subtitle.srt.url : null,
                                ass: subtitle.ass ? subtitle.ass.url : null
                            }))
                        });
                    });
            }
        })).then(() => {
            subs.data.sort((a, b) => {
                const aNum = a.title.match(/^E(\d+)$/)?.[1];
                const bNum = b.title.match(/^E(\d+)$/)?.[1];

                return aNum && bNum
                    ? aNum - bNum
                    : aNum
                        ? -1
                        : bNum
                            ? 1
                            : a.title.localeCompare(b.title);
            });

            addSubItem(subs);
            getAllSubBtn.innerText = "获取全部字幕";
        });
    });
})();

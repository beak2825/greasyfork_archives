// ==UserScript==
// @name         NomenDownloader
// @version      0.1.5
// @description  Nomen Downloader
// @author       Nomen
// @match        https://*.taobao.com/*
// @match        https://*.tmall.com/*
// @match        https://*.1688.com/*
// @match        https://*.deepl.com/*
// @match        https://*.aliexpress.us/*
// @match        https://*.xiaohongshu.com/*
// @icon         https://raw.githubusercontent.com/helloyork/lib/main/Nomen.png
// @require      https://cdn.jsdelivr.net/npm/lil-gui@0.18
// @require      https://cdn.jsdelivr.net/npm/jszip@3.8.0/dist/jszip.min.js
// @license      MIT
// @namespace Nomen
// @downloadURL https://update.greasyfork.org/scripts/468098/NomenDownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/468098/NomenDownloader.meta.js
// ==/UserScript==

(async function () {
    "use strict";
    console.log('Nomen Downloader is running');
    const gui = new lil.GUI({ title: `Nomen Downloader [${(new URL(location.href)).host}]` });
    gui.domElement.style.top = "unset";
    gui.domElement.style.bottom = "0";
    gui.domElement.style["z-index"] = 100001000;
    const zip = new JSZip();

    function getRandomString(length = 24) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('')
    }

    const lib = {
        "detail.1688.com/offer/": {
            name: "阿里巴巴",
            exec: () => {
                let result = [];
                document.querySelectorAll('.detail-gallery-img').forEach(v => {
                    result.push({ name: `${getRandomString()}.${v.src.split('.')[v.src.split('.').length - 1]}`, url: v.src })
                });
                return result;
            }
        },
        "detail.tmall.com": {
            name: "天猫",
            exec: () => {
                let result = [];
                document.querySelectorAll('img[src*=".alicdn.com/imgextra"].PicGallery--thumbnailPic--1spSzep').forEach(v => {
                    result.push({ name: `${getRandomString()}.${v.src.split('.')[v.src.split('.').length - 1]}`, url: v["src"].split('_110x10000').join('_1200x1200') })
                })
                return result;
            }
        },
        "item.taobao.com": {
            name: "淘宝",
            exec: () => {
                let result = [];
                document.querySelectorAll('img[data-src*=".alicdn.com/imgextra"]').forEach(v => {
                    result.push({ name: `${getRandomString()}.${v.src.split('.')[v.src.split('.').length - 1]}`, url: v["src"].split('_50x50').join('_1200x1200') })
                })
                return result;
            }
        },
        "www.xiaohongshu.com": {
            name: "小红书",
            exec: () => {
                let result = [];
                document.querySelectorAll('.swiper-slide.zoom-in.swiper-slide-active.swiper-slide-duplicate-next.swiper-slide-duplicate-prev').forEach(v => {
                    function extractBetweenStrings(strA, strB, sourceStr) {
                        const regex = new RegExp(`${strA.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(.*?)${strB.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`);
                        const match = sourceStr.match(regex);
                        if (match && match[1]) return match[1].trim();
                        return '';
                    }
                    let urle = extractBetweenStrings('url("', '")', v.style["background-image"]);
                    if (!urle.length) return;
                    result.push({ name: `${getRandomString()}.jpeg`, url: urle })
                })
                return result;
            }
        },
        "none": {
            name: "No tools available",
        }
    };
    let tar = "none";
    Object.keys(lib).forEach(v => { if (window.location.href.includes(v)) tar = v });
    var cfg = {
        search: searchImage,
        downloadAll: downloadAll
    }
    const folder = gui.addFolder('Image Downloader: ' + lib[tar].name);
    let search = folder.add(cfg, 'search');
    let target = [];
    let rF = null;
    let rFOpen = false;
    function searchImage() {
        if (rFOpen) return;
        search.name('searching...');
        search.disable(true);
        if (lib[tar] && lib[tar].exec) {
            target = lib[tar].exec();
            search.name(`done result:${target.length}`);
            let resFolder = gui.addFolder('Image Result' + target.length);
            target.forEach(v => resFolder.add({ [v.url]: () => { download(v.url) } }, v.url));
            resFolder.close();
            rF = folder.add(cfg, 'downloadAll');
            rFOpen = true;
        }
        else {
            search.name(`No tools available`);
        }
        search.disable(false);
    }

    const videoLib = {
        "www.aliexpress.us": {
            name: "aliexpress",
            exec: () => {
                return document.querySelector('.video-wrap').firstChild.src;
            }
        },
        "detail.tmall.com": {
            name: "天猫",
            exec: () => { return document.querySelectorAll('.lib-video')[1].src }
        },
        "item.taobao.com": {
            name: "淘宝",
            exec: () => { return document.querySelectorAll('.lib-video')[1].childNodes[0].src }
        },
        "www.xiaohongshu.com": {
            name: "小红书",
            exec: () => { return document.querySelectorAll('video')[0].src }
        },
        'none': {
            name: "No tools available"
        }
    }
    let videoTar = Object.keys(videoLib).filter(v => location.href.includes(v))[0];
    if (!videoTar) videoTar = 'none;'
    const videoFolder = gui.addFolder('Video Downloader: ' + videoLib[videoTar].name);
    var vd = {
        "Download Video": vsd,
    }
    let videoDownload = videoFolder.add(vd, 'Download Video');
    function vsd() {
        if (videoLib[videoTar].exec && typeof videoLib[videoTar].exec() == "string") {
            download(videoLib[videoTar].exec(), getRandomString());
            videoDownload.name('done');
        } else {
            videoDownload.name('No tools available')
        }
    }

    function downloadAll() {
        dl(target, rF);
    }
    function download(src, name = '') {
        if (typeof src == "string") {
            fetch(src)
                .then(response => response.blob())
                .then(blob => { const a = document.createElement('a'); a.href = window.URL.createObjectURL(blob); a.download = name + src.split('.')[src.split('.').length - 1]; document.body.appendChild(a); a.click(); a.remove(); })
        }
        else { return false };
    };
    function dl(images, rF) {
        let rk = 1;
        Promise.all(
            images.map((image, i) => {
                return fetch(image.url).then(response => response.blob())
                    .then(blob => {
                        zip.file(image.name, blob);
                        rF.name(`(${rk++}/${images.length})${image.url}`)
                    })
            })
        )
            .then(() => {
                return zip.generateAsync({ type: "blob" });
            })
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = "images.zip";
                link.click();
                URL.revokeObjectURL(link.href);
            })
            .catch(error => {
                alert("图片打包下载失败:", error);
            });
    }
})();





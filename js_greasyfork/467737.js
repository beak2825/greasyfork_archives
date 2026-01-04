// ==UserScript==
// @name         视频转图去重
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  内部脚本
// @author       sam
// @match        *://*.douyin.com/*
// @match      *://*.douyin.com/*
// @match      *://douyin.com
// @match      *://douyin.com/*
// @match        https://www.douyin.com/search/
// @match      https://www.douyin.com/*
// @match      https://douyin.com/*
// @match      http://www.douyin.com/*
// @match      http://douyin.com/*
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_info
// @connect      *
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467737/%E8%A7%86%E9%A2%91%E8%BD%AC%E5%9B%BE%E5%8E%BB%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467737/%E8%A7%86%E9%A2%91%E8%BD%AC%E5%9B%BE%E5%8E%BB%E9%87%8D.meta.js
// ==/UserScript==

(function () {
    let panel;

    let tooglePanel = () => (panel.style.display = panel.style.display === "none" ? "block" : "none");

    let init = () => {
        let jszip = document.createElement("script");
        jszip.src = "https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js";
        document.head.appendChild(jszip);

        function createDom(dom, attr = {}) {
            let __dom__ = document.createElement(dom);
            if (attr.style) {
                Object.assign(__dom__.style, attr.style);
            }

            if (attr.parent) {
                attr.parent.appendChild(__dom__);
            }

            if (attr.content) {
                __dom__.innerText = attr.content;
            }

            return __dom__;
        }

        panel = createDom("div", {
            style: {
                position: "fixed",
                left: 0,
                bottom: 0,
                right: 0,
                height: "200px",
                "background-color": "#fff",
                "border-top": "1px solid #ccc",
                padding: "10px",
                "box-sizing": "border-box",
                zIndex: 999,
                display: "none",
            },
            parent: document.body,
        });

        createDom("div", { parent: panel, content: "输入视频地址，输入图片相似度去重，0.7 表示相似度大于 70% 的图片会被去重" });
        createDom("div", { parent: panel, content: "然后点击开始按钮，播放视频，播放过程中会自动缓存图片。" });
        createDom("div", { parent: panel, content: "点击下载图片按钮，会下载去重后的图片。", style: { "margin-bottom": "20px" } });

        let imgPanel = createDom("div", {
            parent: panel,
            style: {
                position: "absolute",
                bottom: 0,
                right: 0,
                height: "200px",
                width: "350px",
                "border-left": "1px solid #ccc",
                display: "flex",
                "justify-content": "center",
                "align-items": "center",
            },
        });

        createDom("div", {
            parent: imgPanel,
            content: "X",
            style: {
                position: "absolute",
                top: "10px",
                left: "-20px",
                cursor: "pointer",
                "user-select": "none",
            },
        }).onclick = tooglePanel;

        let spanStyle = { "text-align": "center", height: "100%", "line-height": "200px", width: "75px", cursor: "pointer", "user-select": "none" };

        let leftBtn = createDom("div", { parent: imgPanel, content: "上一张", style: spanStyle });
        let imgDom = createDom("img", { parent: imgPanel, style: { width: "200px" } });
        let rightBtn = createDom("div", { parent: imgPanel, content: "下一张", style: spanStyle });
        let imgIndex = createDom("div", {
            parent: imgPanel,
            content: "",
            style: {
                position: "absolute",
                top: "5px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "red",
            },
        });

        let currentIndex = null;

        let changeImage = function (index) {
            currentIndex = index;
            imgDom.src = imageArray[currentIndex] ? imageArray[currentIndex].data : "";
            imgIndex.innerText = imageArray[currentIndex] ? currentIndex + 1 : "";
        };

        leftBtn.onclick = function () {
            if (currentIndex === null) {
                if (imageArray.length) {
                    changeImage(0);
                }
                return;
            }

            if (currentIndex <= 0) {
                return;
            }

            changeImage(currentIndex - 1);
        };

        rightBtn.onclick = function () {
            if (currentIndex === null) {
                if (imageArray.length) {
                    changeImage(0);
                }
                return;
            }

            if (currentIndex >= currentIndex.length - 1) {
                return;
            }

            changeImage(currentIndex + 1);
        };

        createDom("span", { parent: panel, content: "重复率：" });
        let thresholdInput = createDom("input", { parent: panel });
        thresholdInput.value = 0.8;

        let canvas = document.createElement("canvas");
        let context = canvas.getContext("2d");
        let previousHash = null;
        let imageArray = [];

        let playTime = 0;

        let status = false;
        let optBtn = createDom("button", { parent: panel, content: "开始", style: { "margin-left": "10px" } });
        let downloadBtn = createDom("button", { parent: panel, content: "打包下载图片", style: { "margin-left": "10px" } });

        downloadBtn.onclick = downloadImages;

        let downLabel = createDom("label", { parent: panel, content: "完成后自动下载", style: { "margin-left": "10px" } });
        let checkbox = createDom("input", { parent: downLabel });
        checkbox.type = "checkbox";
        checkbox.checked = true;

        // 当前缓存图片数量：
        let imageCount = createDom("span", { parent: createDom("div", { parent: panel, content: "当前缓存图片数量：" }), content: "0" });

        let video;
        optBtn.onclick = function () {
            optBtn.innerText = status ? "开始" : "停止";
            status = !status;

            let __video__ = document.querySelector("video");

            if (__video__ !== video) {
                video = __video__;

                __video__.addEventListener("timeupdate", () => {
                    if (!__video__) {
                        return;
                    }

                    if (playTime > __video__.currentTime) {
                        __video__.pause();
                        optBtn.innerText = status ? "开始" : "停止";
                        status = !status;

                        if (checkbox.checked && !downloadBtn.disabled) {
                            downloadImages();
                        }
                        return;
                    }

                    playTime = __video__.currentTime;

                    processFrames();
                });
            }

            canvas.width = __video__.videoWidth;
            canvas.height = __video__.videoHeight;

            if (status) {
                // 开始
                currentIndex = null;
                imgDom.src = "";
                imgIndex.innerText = "";
                previousHash = null;
                imageArray = [];
                imageCount.innerText = "0";
                __video__.currentTime = 0;
                playTime = 0;
                __video__.play();
            } else {
                __video__.pause();
            }
        };

        function processFrames() {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            var currentHash = calculateAverageHash(imageData);

            if (previousHash !== null) {
                var similarity = compareHashes(previousHash, currentHash);
                if (similarity < Number(thresholdInput.value)) {
                    var imageUrl = canvas.toDataURL();
                    var imageName = "image-" + String(imageArray.length + 1).padStart(3, 0) + ".png";
                    imageArray.push({ name: imageName, data: imageUrl, time: video.currentTime });
                    imageCount.innerText = imageArray.length;
                    console.log("保存图像: " + imageName, video.currentTime);
                }
            } else {
                var imageUrl2 = canvas.toDataURL();
                var imageName2 = "image-" + String(imageArray.length + 1).padStart(3, 0) + ".png";
                imageArray.push({ name: imageName2, data: imageUrl2, time: video.currentTime });
                imageCount.innerText = imageArray.length;
                console.log("保存图像: " + imageName2, video.currentTime);
            }

            previousHash = currentHash;
        }

        function calculateAverageHash(imageData) {
            var grayscaleData = convertToGrayscale(imageData);
            var averageValue = calculateAverage(grayscaleData);
            var hash = generateHash(grayscaleData, averageValue);
            return hash;
        }

        function convertToGrayscale(imageData) {
            var grayscaleData = [];

            for (var i = 0; i < imageData.data.length; i += 4) {
                var r = imageData.data[i];
                var g = imageData.data[i + 1];
                var b = imageData.data[i + 2];
                var grayscale = Math.round(0.2989 * r + 0.587 * g + 0.114 * b);
                grayscaleData.push(grayscale);
            }

            return grayscaleData;
        }

        function calculateAverage(data) {
            var sum = data.reduce(function (acc, value) {
                return acc + value;
            }, 0);
            return Math.round(sum / data.length);
        }

        function generateHash(data, averageValue) {
            var hash = "";

            for (var i = 0; i < data.length; i++) {
                if (data[i] >= averageValue) {
                    hash += "1";
                } else {
                    hash += "0";
                }
            }

            return hash;
        }

        function compareHashes(hash1, hash2) {
            var difference = 0;

            for (var i = 0; i < hash1.length; i++) {
                if (hash1[i] !== hash2[i]) {
                    difference++;
                }
            }

            var similarity = (hash1.length - difference) / hash1.length;
            return similarity;
        }

        function downloadImages() {
            downloadBtn.innerText = "打包中...";
            downloadBtn.disabled = true;

            var zip = new JSZip();
            imageArray.forEach(function (image) {
                var imageData = image.data.split(",")[1]; // 移除 data:image/png;base64, 部分
                zip.file(image.name, imageData, { base64: true });
            });

            let timeText = imageArray.map((item) => `${item.name}\t${item.time}`).join("\n");

            zip.file("时间表.txt", timeText);

            zip.generateAsync({ type: "blob" }).then(function (content) {
                downloadBtn.innerText = "打包下载图片";
                downloadBtn.disabled = false;

                var url = URL.createObjectURL(content);
                var link = document.createElement("a");
                link.href = url;
                link.download = "images.zip";
                link.click();
                URL.revokeObjectURL(url);
            });
        }
    };

    let createBtn = () => {
        let div = document.createElement("div");
        div.style.width = "60%";
        div.style.height = "40px";
        div.style.marginTop = "10px";
        div.style.backgroundImage =
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAqVJREFUaEPtmT1rFUEUhp+DlY2NVoJgo4gKEm20UkHs1EZTRIQUQcTOSsvYWPgDDBYiiBBQQUkEsVJBbbSw0BQiau8PsHxlYG7cbGZ2Z/bOknthp9ydPed95pz5OLPGlDebcv0MAKEISroPXK29u21mi6Uj3ksEJCkk1MyK+ytu0AkfADLybIhAZBIPcyA1i4YUmqoUknQJuAt8AO6Y2VoJAEkXgVvAT2AxZje4t6Tmmhf/pNL/GzAbcpazD0g6BzwHtnnbUbudAQLiR7aCzlIBJJ0FXgDba+KSIZImsaSvwKFItDY5SwGQdBJYAXZE7C6b2VxbhqQCPAYuNxjbANEGIOk4sArsarCZdPhLBTgIuPyPRcHpWIdoApA0A7wEdjeIf2pms22j794nAfgDWjKEhwn5P+zF7y0hPgvAQxwAniVEIhap78D+UuKzATzEHuBVC0RK9Ot9ktOm+mFyClU/krQTeFcQopP4ThEYgUhya/enAhCdxY8FUAFp2iPaUmks8UUA/LzoAjG2+GIAHSCKiC8KkAFRTPwmgBL3OZK+AEciyZ8lXtJDYL5i6w9wr3q/tGEZbTvDtM3IysT+CJyo9c8Vfwp4E/D51sxOj573AuDTyR0AzwB/3ZHZzG6kDoD/fmsBcsSG+koaANYHpo87zbYIFY0AsM/MfrQ5Lfle0jVgqcgkBpKqo8IArtx0BX+95a9C3oJbRdxq8ruk0LotSa5wcr4WIn4aAX4BTdVSn9pTba+a2fnYPvAIuJJqaYv6LZnZ9RiA+y3kfg9Ncpszs+UggN8BPwPHJpTgppm5q83/S3xkF3wNuFuzSWorZnahLihaE0tyfxSP+mg03eH0CenumlzZ+t7MHoQcdSrq+1Sca3sAyB2x0v2HCJQe0Vx7Ux+Bf62bO0D1hp22AAAAAElFTkSuQmCC")';
        div.style.backgroundSize = "contain";
        div.style.backgroundRepeat = "no-repeat";
        div.id = "adamaliba";
        let doms = document.getElementsByClassName("immersive-player-switch-on-hide-interaction-area");

        div.onclick = tooglePanel;

        Array.from(doms).forEach((dom) => {
            if (dom && dom.lastChild && dom.lastChild.id != "adamaliba") {
                dom.appendChild(div);
            }
        });
    };

    let handle = setInterval(() => {
        if (document.getElementsByClassName("immersive-player-switch-on-hide-interaction-area").length) {
            init();
            createBtn();
            clearInterval(handle);
        }
    }, 200);
})();

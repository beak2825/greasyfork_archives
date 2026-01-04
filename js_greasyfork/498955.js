// ==UserScript==
// @name           以图搜图增强版
// @name:en        Enhanced Reverse Image Search
// @namespace      https://github.com/belingud/GM.search-by-image
// @version        1.1.1
// @description    以图搜图增强版，可以使用本地文件、粘贴链接、点击网页图片方式来搜图。支持谷歌Lens、TinEye、Yandex、Bing、搜狗、百度、trace、SauceNAO、IQDB、3DIQDB、ascii2d搜索引擎。
// @description:en Enhanced Reverse image search. You can search images using local files, pasting links, and clicking web images. Supports Google Lens, TinEye, Yandex, Bing, Sogou, Baidu, trace, SauceNAO, IQDB, 3DIQDB, ascii2d search engines.
// @icon           https://raw.githubusercontent.com/belingud/GM.UserScript/refs/heads/master/artwork/icon.png
// @author         belingud
// @license        BSD 3-Clause License
// @match          *://*/*
// @grant          GM_openInTab
// @grant          GM_registerMenuCommand
// @grant          GM_xmlhttpRequest
// @connect        tmpfiles.org
// @downloadURL https://update.greasyfork.org/scripts/498955/%E4%BB%A5%E5%9B%BE%E6%90%9C%E5%9B%BE%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/498955/%E4%BB%A5%E5%9B%BE%E6%90%9C%E5%9B%BE%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Define current language
    const currentLanguage = navigator.language.includes("zh") ? "zh" : "en";

    // Define translations
    const translations = {
        en: {
            selectImageSource: "Select Image Source:",
            selectSearchEngine: "Select Search Engine:",
            selectFile: "Select File",
            pasteURL: "Paste URL",
            clickImage: "Click Image",
            googleLens: "Google Lens",
            tinEye: "TinEye",
            yandex: "Yandex",
            "Lenso.ai": "Lenso.ai",
            bing: "Bing",
            sogou: "Sogou",
            baidu: "Baidu",
            trace: "trace",
            sauceNAO: "SauceNAO",
            IQDB: "IQDB",
            "3DIQDB": "3DIQDB",
            ascii2d: "ascii2d",
            close: "Close",
            loading: "Uploading...",
            pasteURLPrompt: "Paste image URL:",
            urlPasted: "URL pasted. Now choose a search engine.",
            clickAnyImage: "Click on any image on the page.",
            imageSelected: "Image selected. Now choose a search engine.",
            selectImageFirst: "Please select an image source first.",
            pleaseSelectFile: "Please select a file before clicking a search engine.",
            uploadError: "Upload failed, please try again or check your network.",
            dragHint: "Click and drag to move",
        },
        zh: {
            selectImageSource: "选择图片来源：",
            selectSearchEngine: "选择搜索引擎：",
            selectFile: "选择文件",
            pasteURL: "粘贴链接",
            clickImage: "点击图片",
            googleLens: "Google Lens",
            tinEye: "TinEye",
            yandex: "Yandex",
            "Lenso.ai": "Lenso.ai",
            bing: "必应",
            sogou: "搜狗",
            baidu: "百度",
            trace: "trace",
            sauceNAO: "SauceNAO",
            IQDB: "IQDB",
            "3DIQDB": "3DIQDB",
            ascii2d: "ascii2d",
            close: "关闭",
            loading: "图片上传中...",
            pasteURLPrompt: "粘贴图片链接：",
            urlPasted: "链接已粘贴。现在选择一个搜索引擎。",
            clickAnyImage: "点击页面上的任何图片。",
            imageSelected: "图片已选择。现在选择一个搜索引擎。",
            selectImageFirst: "请先选择图片来源。",
            pleaseSelectFile: "请先选择文件，然后再点击搜索引擎。",
            uploadError: "上传失败，请重试或检查网络。",
            dragHint: "点击空白处拖动",
        },
    };

    // Helper function for translations
    function lang(key) {
        return translations[currentLanguage][key];
    }

    let imageSrc = ""; // Image source URL
    let selectedEngine = ""; // Selected search engine
    let imgType = ""; // Image type
    let file = ""; // File object

    const searchUrl = {
        "Google Lens": `https://lens.google.com/uploadbyurl?url=\${url}`,
        TinEye: `https://www.tineye.com/search/?url=\${url}`,
        Yandex: `https://yandex.com/images/search?url=\${url}&rpt=imageview`,
        "Lenso.ai": `https://lenso.ai/en/search-by-url?url=\${url}`,
        Bing: `https://www.bing.com/images/search?q=imgurl:\${url}&view=detailv2&iss=sbi`,
        Sogou: `https://pic.sogou.com/ris?query=https%3A%2F%2Fimg03.sogoucdn.com%2Fv2%2Fthumb%2Fretype_exclude_gif%2Fext%2Fauto%3Fappid%3D122%26url%3D\${url}&flag=1&drag=0`,
        Baidu: `https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image=\${url}`,
        Trace: `https://trace.moe/?url=\${url}`,
        SauceNAO: `https://saucenao.com/search.php?db=999&url=\${url}`,
        IQDB: `https://iqdb.org/?url=\${url}`,
        "3DIQDB": `https://3d.iqdb.org/?url=\${url}`,
        ascii2d: `https://ascii2d.net/search/url/\${url}`,
    };

    const searchEngines = [
        {
            text: lang("googleLens"),
            handler: async () => {
                selectedEngine = "Google Lens";
                await searchImage();
            },
        },
        {
            text: lang("tinEye"),
            handler: async () => {
                selectedEngine = "TinEye";
                await searchImage();
            },
        },
        {
            text: lang("yandex"),
            handler: async () => {
                selectedEngine = "Yandex";
                await searchImage();
            },
        },
        {
            text: lang("Lenso.ai"),
            handler: async () => {
                selectedEngine = "Lenso.ai";
                await searchImage();
            }
        },
        {
            text: lang("bing"),
            handler: async () => {
                selectedEngine = "Bing";
                await searchImage();
            },
        },
        // Sogou Image Search requires uploading to the Sogou server, otherwise it cannot search for images.
        // {
        //     text: lang("sogou"),
        //     handler: async () => {
        //         selectedEngine = "Sogou";
        //         await searchImage();
        //     },
        // },
        // Baidu Image Search is in a session, not sure how it works.
        // {
        //     text: lang("baidu"),
        //     handler: async () => {
        //         selectedEngine = "Baidu";
        //         await searchImage();
        //     },
        // },
        {
            text: lang("trace"),
            handler: async () => {
                selectedEngine = "Trace";
                await searchImage();
            },
        },
        {
            text: lang("sauceNAO"),
            handler: async () => {
                selectedEngine = "SauceNAO";
                await searchImage();
            },
        },
        {
            text: lang("IQDB"),
            handler: async () => {
                selectedEngine = "IQDB";
                await searchImage();
            },
        },
        {
            text: lang("3DIQDB"),
            handler: async () => {
                selectedEngine = "3DIQDB";
                await searchImage();
            },
        },
        {
            text: lang("ascii2d"),
            handler: async () => {
                selectedEngine = "ascii2d";
                await searchImage();
            },
        },
    ];

    const imageSources = [
        { text: lang("selectFile"), handler: selectFile, id: "select-file" },
        { text: lang("pasteURL"), handler: pasteURL, id: "paste-url" },
        { text: lang("clickImage"), handler: clickImage, id: "click-image" },
    ];

    // Register the main command in the Tampermonkey menu
    GM_registerMenuCommand("Reverse Image Search", openMenu);

    // Function to create and open the menu
    function openMenu() {
        // Remove any existing menu
        const existingMenu = document.getElementById("reverse-image-search-menu");
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement("div");
        menu.id = "reverse-image-search-menu";
        menu.style.position = "fixed";
        menu.style.top = "10px";
        menu.style.right = "10px";
        menu.style.backgroundColor = "#fff";
        menu.style.border = "1px solid #ccc";
        menu.style.zIndex = "9999";
        menu.style.padding = "10px";
        menu.style.maxWidth = "200px";
        // font color black
        menu.style.color = "black";
        document.body.appendChild(menu);

        // Make the menu draggable
        makeDraggable(menu);

        // Image source options
        const sourceTitle = document.createElement("div");
        sourceTitle.textContent = lang("selectImageSource");
        sourceTitle.style.marginBottom = "10px";
        sourceTitle.style.fontWeight = "bold";
        menu.appendChild(sourceTitle);

        imageSources.forEach((source) => {
            const sourceOption = document.createElement("div");
            sourceOption.textContent = source.text;
            sourceOption.id = source.id;
            sourceOption.style.cursor = "pointer";
            sourceOption.style.padding = "5px";
            sourceOption.style.textAlign = "center";
            sourceOption.style.border = "1px solid #ddd";
            sourceOption.style.marginBottom = "5px";
            sourceOption.addEventListener("click", source.handler);
            menu.appendChild(sourceOption);
        });

        // Search engine buttons
        const engineTitle = document.createElement("div");
        engineTitle.textContent = lang("selectSearchEngine");
        engineTitle.style.marginBottom = "10px";
        engineTitle.style.fontWeight = "bold";
        menu.appendChild(engineTitle);

        searchEngines.forEach((engine) => {
            const engineOption = document.createElement("div");
            engineOption.textContent = engine.text;
            engineOption.style.cursor = "pointer";
            engineOption.style.padding = "5px";
            engineOption.style.textAlign = "center";
            engineOption.style.border = "1px solid #ddd";
            engineOption.style.marginBottom = "5px";
            engineOption.addEventListener("click", async () => {
                if (imgType === "file" && file) {
                    showLoading(menu); // Show loading animation
                }
                await engine.handler();
            });
            menu.appendChild(engineOption);
        });

        // Add drag hint
        const dragHint = document.createElement("div");
        dragHint.textContent = lang("dragHint");
        dragHint.style.fontStyle = "italic";
        dragHint.style.fontSize = "10px";
        dragHint.style.marginTop = "10px";
        menu.appendChild(dragHint);

        const closeButton = document.createElement("button");
        closeButton.textContent = lang("close");
        closeButton.style.marginTop = "10px";
        closeButton.style.padding = "5px";
        closeButton.style.width = "100%";
        closeButton.addEventListener("click", () => {
            menu.remove();
        });
        menu.appendChild(closeButton);

        // Add spinner animation keyframes
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
        document.head.appendChild(style);
    }

    // Handle select file
    function selectFile() {
        imgType = "file";
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", (event) => {
            file = event.target.files[0];
            markSelected("select-file");
        });
        input.click();
    }

    // Handle paste URL
    function pasteURL() {
        imgType = "url";
        const url = prompt(lang("pasteURLPrompt"));
        if (url) {
            imageSrc = url;
            markSelected("paste-url");
        }
    }

    // Handle click image
    function clickImage() {
        imgType = "page";
        document.body.addEventListener("click", function handleClick(event) {
            if (event.target.tagName === "IMG") {
                imageSrc = event.target.src;
                document.body.removeEventListener("click", handleClick);
                markSelected("click-image");
                event.preventDefault(); // Prevent default link behavior
            }
        });
    }

    // Perform image search
    async function searchImage() {
        if (!file && imgType === "file") {
            showToast(lang("pleaseSelectFile"), "error");
            return;
        }
        if (imgType === "file") {
            imageSrc = await getTmpImgLink(file);
            hideLoading(); // Hide loading animation after getting the link
        }
        if (!imageSrc) {
            return;
        }
        let tmp;
        if (selectedEngine !== "ascii2d") {
            tmp = encodeURIComponent(imageSrc);
        } else {
            tmp = imageSrc;
        }
        let target = searchUrl[selectedEngine].replace("${url}", tmp);
        GM_openInTab(target, { active: true, insert: true, setParent: true });
    }

    async function uploadToTmpFiles(file) {
        const formData = new FormData();
        formData.append("file", file);
        const response = new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://tmpfiles.org/api/v1/upload",
                data: formData,
                headers: {
                    "X-Client": "tampermonkey-enhanced-reverse-image-search",
                },
                onload: function (response) {
                    if (response.status !== 200) {
                        reject(response.responseText);
                        // {"status":"success","data":{"url":"https://tmpfiles.org/19972538/winter_bg.jpg"}}
                    }
                    const resp = JSON.parse(response.responseText);
                    console.log("upload response: ", resp);
                    let url = resp.data.url;
                    if (url.startsWith("http://tmpfiles.org") || url.startsWith("https://tmpfiles.org")) {
                        url = url.replace(/^https?:\/\/tmpfiles\.org/, "https://tmpfiles.org/dl");
                    }
                    resolve(url);
                },
                onerror: function (response) {
                    reject(response);
                },
            });
        });
        return await response;
    }

    /**
     * 使用临时网盘来将文件转为链接搜图
     * @param {*} file
     */
    async function getTmpImgLink(file) {
        try {
            return await uploadToTmpFiles(file);
        } catch (error) {
            console.log("[reverse image search] upload error: ", error);
            showToast(lang("uploadError"), "error");
        }
    }

    /**
     * Mark the selected image source with a green checkmark.
     * @param {string} id - The id of the selected image source.
     */
    let selectedSourceId = null; // Store the ID of the currently selected source

    function markSelected(id) {
        if (selectedSourceId) {
            // Reset the previously selected element
            const prevElement = document.getElementById(selectedSourceId);
            if (prevElement) {
                prevElement.style.fontWeight = "normal";
                prevElement.style.color = "black";
                prevElement.textContent = prevElement.textContent.replace(/^✔ /, "");
            }
        }

        // Mark the newly selected element
        const element = document.getElementById(id);
        if (element) {
            element.style.fontWeight = "bold";
            element.style.color = "green";
            element.textContent = `✔ ${element.textContent}`;
        }

        selectedSourceId = id; // Update the selected source ID
    }

    /**
     * Show loading animation
     * @param {HTMLElement} menu - The menu element
     */
    function showLoading(menu) {
        const loadingDiv = document.createElement("div");
        loadingDiv.id = "loading-animation";
        loadingDiv.style.position = "absolute";
        loadingDiv.style.top = "0";
        loadingDiv.style.left = "0";
        loadingDiv.style.width = "100%";
        loadingDiv.style.height = "100%";
        loadingDiv.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        loadingDiv.style.display = "flex";
        loadingDiv.style.justifyContent = "center";
        loadingDiv.style.alignItems = "center";
        loadingDiv.style.zIndex = "1000";

        const spinner = document.createElement("div");
        spinner.style.border = "4px solid #f3f3f3";
        spinner.style.borderRadius = "50%";
        spinner.style.borderTop = "4px solid #3498db";
        spinner.style.width = "30px";
        spinner.style.height = "30px";
        spinner.style.animation = "spin 2s linear infinite";
        loadingDiv.appendChild(spinner);

        menu.appendChild(loadingDiv);
    }

    /**
     * Hide loading animation
     */
    function hideLoading() {
        const loadingDiv = document.getElementById("loading-animation");
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    function showToast(message, type) {
        const toast = document.createElement("div");
        toast.textContent = message;
        toast.style.position = "fixed";
        toast.style.bottom = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.backgroundColor = type === "success" ? "#4caf50" : "#f44336";
        toast.style.color = "#fff";
        toast.style.padding = "10px 20px";
        toast.style.borderRadius = "5px";
        toast.style.zIndex = "10000";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    function makeDraggable(element) {
        let pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            element.style.top = element.offsetTop - pos2 + "px";
            element.style.left = element.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
})();

// ==UserScript==
// @name               CnBlog_AUp博图通路
// @namespace          https://www.cnblogs.com/chary
// @version            0.0.1
// @description        博客图
// @author             CharyGao
// @match              https://i.cnblogs.com/posts/edit*
// @require            https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant              unsafeWindow
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @grant              GM_openInTab
// @grant              GM_setClipboard
// @grant              GM_registerMenuCommand
// @grant              GM_addStyle
// @grant              GM_download
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/403188/CnBlog_AUp%E5%8D%9A%E5%9B%BE%E9%80%9A%E8%B7%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/403188/CnBlog_AUp%E5%8D%9A%E5%9B%BE%E9%80%9A%E8%B7%AF.meta.js
// ==/UserScript==
//</editor-fold>

//<editor-fold desc="Style">


// noinspection JSUnresolvedFunction
GM_addStyle(
// language=CSS
    `/*noinspection CssUnusedSymbol*/
        div#showTips {
            top: 20px;
            left: 20px;
            position: absolute;
            padding: 3px 5px;
            background: powderblue;
            transition: opacity 800ms ease;
            opacity: 0;
            font-size: 12px;
            margin: 0 auto;
            text-align: center;
            width: 350px;
            height: auto;
            color: darkblue;
        }
    `);
//</editor-fold>

(function () {
    //<editor-fold desc="0.Fields">

    let logCount = 0;
    let totalImgCount = 0;
    let downImgCount = 0;
    let updateImgCount = 0;

    let innerOldHTML = "";
    //</editor-fold>

    //<editor-fold desc="1.入口">
    setTimeout(function () {
        try {
            setUi();
        } catch (e) {
            myLog('err:', e);
        }
    }, 5000); //页面加载完成后延时2秒执行
    //</editor-fold>

    //<editor-fold desc="2.设置UI">
    function setUi() {

        let rootHeaderNode = document.getElementById('Editor_Edit_EditorBody_toolbargroup');
        if (rootHeaderNode == null) throw "aUp err!->妈的又改版了!";

        let htmlSpanElement = document.createElement("span");
        htmlSpanElement.id = "uploadOutPic";
        htmlSpanElement.innerText = "点击同步外部图片";

        rootHeaderNode.appendChild(htmlSpanElement);

        htmlSpanElement.addEventListener("click", () => {
            synchronizeImage();
        })
    }

    //</editor-fold>


    //<editor-fold desc="3.同步过程">
    function synchronizeImage() {
        let editorBody = document.getElementById("Editor_Edit_EditorBody_ifr");
        innerOldHTML = editorBody.contentDocument.body.innerHTML;
        let bodyImages = editorBody.contentDocument.body.querySelectorAll("img");
        totalImgCount = bodyImages.length;
        myLog(`totalImgCount:${totalImgCount}`);

        bodyImages.forEach(img => {
            processOneImage(img);
        })
        showTips(`正在同步！请稍等，totalImgCount:${totalImgCount}`, 300, 1);
    }

    //</editor-fold>


    //<editor-fold desc="4.处理一张图片">
    function processOneImage(img) {
        let imgHref = img.src;
        if (imgHref.indexOf('cnblogs.com') > 0) {
            myLog(`[skip] ${imgHref}`);
        } else {
            myLog(`[handle] ${imgHref}`);
            if (imgHref.startsWith("http")) {
                downloadImage(imgHref);
            } else {
                myLog(`${imgHref},if (imgHref.startsWith("http")) == false`);
            }
        }
    }

    //</editor-fold>


    //<editor-fold desc="5.下载图片">
    function downloadImage(imgHref) {
        // noinspection JSUnresolvedFunction,JSUnusedGlobalSymbols
        GM_xmlhttpRequest({
                method: "GET",
                headers: {
                    "Content-Type": "image/png",
                    "User-Agent": "Mozilla/5.0 AppleWebKit/537.36 Chrome/81.0.4044.138 Safari/537.36",
                },
                url: imgHref,
                cookie: document.cookie,
                responseType: "blob",
                timeout: 5000,//5s
                onload: (imageDataBody) => {

                    downImgCount++;
                    let tempo = `downImgCount/totalImgCount=${downImgCount}/${totalImgCount}`;

                    // noinspection JSUnresolvedVariable
                    let headerJson = keyValuePairStringToLowercaseKeyJson(imageDataBody.responseHeaders);
                    let imageType = "image/png";
                    if (headerJson !== undefined && "content-type" in headerJson) {
                        imageType = headerJson["content-type"];
                    }
                    myLog(imageDataBody.response);

                    let bodyFormData = new FormData();

                    bodyFormData.append("imageFile",
                        new Blob([imageDataBody.response], {
                                filename: "image.png",
                                type: imageType,//"image/png",//
                            }
                        )
                    );
                    bodyFormData.set("host", "www.cnblogs.com");
                    bodyFormData.set("uploadType", "Paste");
                    uploadImage(imgHref, bodyFormData);
                    myLog(`${imgHref},${tempo}`);
                },
                onerror: (imageGetError) => {
                    myLog(`${imgHref},imageGetError:${imageGetError}`);
                },
                ontimeout: (exception) => {
                    myLog(`${imgHref},ontimeout exception:${exception}`);
                }
            }
        )
    }

    //</editor-fold>


    //<editor-fold desc="6.上传图片">
    function uploadImage(imgHref, bodyFormData) {
        axios({
            method: "POST",
            url: "https://upload.cnblogs.com/imageuploader/CorsUpload",
            data: bodyFormData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
        }).then(response => {
            if (response.status === 200) {
                if (response.data.success) {
                    return ReplaceEditor(imgHref, response.data.message);
                }
            }
            myLog(`uploadImage response:${response}`);

        }).catch(error => {
            myLog(`uploadImage error:${error}`);
        })
    }

    //</editor-fold>

    //<editor-fold desc="7.替换url">
    function ReplaceEditor(oldUrl, newUrl) {
        myLog("oldUrl:" + oldUrl);
        myLog("newUrl:" + newUrl);

        innerOldHTML = innerOldHTML.replace(new RegExp(escapeRegExp(oldUrl), 'g'), newUrl);
        updateImgCount++;
        if (updateImgCount >= downImgCount) {
            let tempo =
                `updateImgCount/downImgCount/totalImgCount = ${updateImgCount}/${downImgCount}/${totalImgCount}`;
            myLog(`newBody:${innerOldHTML}`)

            // noinspection JSJQueryEfficiency
            let editorHTML = $("#Editor_Edit_EditorBody_ifr").contents().find("body").html();
            if (null != editorHTML) {
                $("#Editor_Edit_EditorBody_ifr").contents().find("body").html(innerOldHTML);
            }

            // document.getElementById("Editor_Edit_EditorBody_ifr").contentDocument.body.innerHTML = innerOldHTML;
            document.querySelector("iframe#Editor_Edit_EditorBody_ifr").contentWindow.document.body.innerHTML =
                innerOldHTML;

            document.querySelector("#Editor_Edit_EditorBody_ifr").contentDocument.body.innerHTML
                = innerOldHTML;

            document.getElementById("Editor_Edit_EditorBody_ifr").contentDocument.body.innerHTML
                = innerOldHTML;

            if (navigator.clipboard) {
                navigator.clipboard.writeText(innerOldHTML);
            } else {
                const eventCopyer = event => {
                    event.preventDefault();
                    event.clipboardData.setData("text/plain", innerOldHTML);
                }
                document.addEventListener("copy", eventCopyer);
                document.execCommand("copy");
                document.removeEventListener("copy", eventCopyer);
            }

            // window.parent.tinyMCE.get('Editor_Edit_EditorBody').onLoad.dispatch();


            //document.querySelector("iframe#Editor_Edit_EditorBody_ifr").contentWindow.document.body.innerHTML =
            // `<div id="lg" class="s-p-top"><img id="s_lg_img" class="s_lg_img_gold_show"
            // src="https://www.baidu.com/img/bd_logo1.png" alt="" width="270" height="129"
            // usemap="#mp" data-mce-src="https://www.baidu.com/img/bd_logo1.png">159654456789</div>`

            showTips(`同步完成，单击重新同步，如同步失败请保存再编辑和同步。${tempo}`, 300, 2);
        }
        return true;
    }

    //</editor-fold>


    //<editor-fold desc="9.辅助">
    function myLog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log(`#${logCount++}AUp:`, param1, param2);
    }

    function showTips(content, height, time_s) {
        let windowWidth = window.innerWidth;
        // noinspection JSUnusedLocalSymbols
        let windowHeight = window.innerHeight;
        let htmlDivElement = document.createElement("div");
        htmlDivElement.id = "showTips";
        htmlDivElement.innerText = content;
        htmlDivElement.style.top = height + "px";
        htmlDivElement.style.left = height + (windowWidth / 2) - 350 / 2 + "px";
        document.body.appendChild(htmlDivElement);
        htmlDivElement.style.opacity = "0";
        htmlDivElement.style.opacity = "1";
        setTimeout(() => {
            htmlDivElement.style.opacity = "0";
        }, (time_s * 1000));
    }

    String.prototype.trimChars = function (c) {
        let re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        return this.replace(re, "");
    }

    function keyValuePairStringToLowercaseKeyJson(responseHeaders) {
        let commaAdded = responseHeaders.replace(/(?:\r\n|\r|\n)/g, ',').trim().replace(/,+$/g, '');
        let items = commaAdded.split(',');
        let jsonString = items.map(item => {
            return item.replace(/([^:]+)(:)(.+$)/, (match, p1, p2, p3) => {
                return `"${p1.trim().toLowerCase()}": "${p3.trim().trimChars('"')}"`;
            })
        }).join(', ');
        try {
            return JSON.parse(`{${jsonString}}`);
        } catch (err) {
            myLog(`keyValuePairStringToJson err:${err}`);
        }
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    //</editor-fold>


})();

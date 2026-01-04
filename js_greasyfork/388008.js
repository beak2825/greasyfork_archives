// ==UserScript==
// @name               黑姆雷啊ADown
// @name:en            XmLyADownloader
// @namespace          https://www.cnblogs.com/chary
// @version            0.0.1
// @description        手撕MD5
// @description:zh-cn  黑姆雷啊ADown
// @description:en     XmLyADownloader with md5 encryption
// @author             CharyGao
// @match              https://www.ximalaya.com/*/*/
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
// @downloadURL https://update.greasyfork.org/scripts/388008/%E9%BB%91%E5%A7%86%E9%9B%B7%E5%95%8AADown.user.js
// @updateURL https://update.greasyfork.org/scripts/388008/%E9%BB%91%E5%A7%86%E9%9B%B7%E5%95%8AADown.meta.js
// ==/UserScript==
//</editor-fold>

//<editor-fold desc="Style">
// noinspection JSUnresolvedFunction：
GM_addStyle(`
        button.ADownElementTagClass:hover {
            color: green;
        }
        .ADownElementTagClass {
            position: absolute;
            float: right;
            right: 90px;
            border: 2px dashed gray;
            height: 46px;
            border-radius: 10px;
            color: #93999f;
            font-size: 12px;
            background: transparent;
            top: 1px;
            width: 50px;
        }
       .dropdown {
            z-index: 999998;
            position: relative;
            display: inline-block;
            right: 300px;
            margin: 13px 0px 5px 0px;
            float: right;
            top: 10px;
            width: 100px;
        }
        .dropdown-content {
            display: none;
            position: absolute;
            background-color: black;
            min-width: 60px;
            text-align: center;
            padding: 8px;
            border: red 1px dashed;
        }
        .dropdown:hover .dropdown-content {
            display: block;
        }
        .show{display: block;}
        .hide{display: none;}
`);
//</editor-fold>

(function () {
    //<editor-fold desc="0.Fields">
    'use strict';
    let logCount = 0;
    let hasOpenAriaC2Tab = false;
    let winErrCharReg = /[\\/?？*"“”'‘’<>{}\[\]【】：:、^$!~`|\s]*/g;
    let aria2Url = "http://127.0.0.1:6800/jsonrpc"; //Aria2 地址
    let albumDownloadUrl = "https://www.ximalaya.com/revision/play/album"; //专辑下载Api地址
    let maxPageSize = 30;//api接口最大页大小
    let sort = 0;//0:正序；1：逆序；
    let downTipDiv = null;//下载标记ADown
    let saveDirPath = "output";

    let albumADownInfo = {
        albumId: "", albumTitle: "", trackItems: [], trackTotalCount: 0
    };
    //</editor-fold>

    //<editor-fold desc="1.入口">
    setTimeout(function () {
        try {
            setGlobalParameterInfo();//2.获取全局参数
            fetchAlbumsToDownInfo(albumDownloadUrl, albumADownInfo.albumId, 1, sort, maxPageSize);//3.获取全部音频下载地址
            myLog("黑姆雷啊ADown下载助手加载完成~", albumADownInfo);
        } catch (e) {
            myLog('err:', e);
        }
    }, 2000); //页面加载完成后延时2秒执行
    //</editor-fold>

    //<editor-fold desc="2.获取全局参数">
    function setGlobalParameterInfo() {
        // noinspection JSUnresolvedVariable
        //let serverClock = unsafeWindow.XM_SERVER_CLOCK;
        // noinspection JSUnresolvedVariable
        albumADownInfo.albumId = unsafeWindow.__INITIAL_STATE__.AlbumDetailPage.albumInfo.albumId;
        // noinspection JSUnresolvedVariable
        albumADownInfo.albumTitle = unsafeWindow.__INITIAL_STATE__.AlbumDetailPage.albumInfo.mainInfo.albumTitle;
        // noinspection JSUnresolvedVariable
        albumADownInfo.trackTotalCount = Number(unsafeWindow.__INITIAL_STATE__.AlbumDetailTrackList.tracksInfo.trackTotalCount);
        /*let totalPageNum = parseInt((albumADownInfo.trackTotalCount / maxPageSize).toString()) + 1;
        for (let i = 1; i <= totalPageNum; i++) {
            fetchAlbumsToDownInfo(albumDownloadUrl, albumADownInfo.albumId, i, 0, maxPageSize, cookies);
        }*/
    }

    //</editor-fold>

    //<editor-fold desc="3.获取全部音频下载地址">
    function fetchAlbumsToDownInfo(httpsUrl, albumId, startPageNum, sort, maxPageSize) {
        fetch(`${httpsUrl}?albumId=${albumId}&pageNum=${startPageNum}&sort=${sort}&pageSize=${maxPageSize}`, {
            //credentials: "include",//For CORS requests//跨域请求。
            //mode: "cors",
            method: "GET",
            cache: "no-cache",
            headers: {
                //Host: "www.ximalaya.com",
                //Connection: "keep-alive",
                //DNT: 1,
                //Referer: "https://www.ximalaya.com/youshengshu/17848834/",
                Pragma: "no-cache",
                Cookie: document.cookie,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
                "xm-sign": getXmSign(),
                "Cache-Control": "no-cache",
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",//Content-Type: application/json
                //"Accept-Encoding": "gzip, deflate, br",
                //"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
            },
        }).then(response => {
            if (response.ok) {
                // myLog(`fetchAlbumsToDownInfo ok!${response}`, response.url);
                return response.json();
            }
            throw  response;
        }).catch(error => {
            throw `fetchAlbum error!${error}`;
        }).then(jsonBody => {//body
            // myLog(jsonBody);
            // noinspection JSUnresolvedVariable
            albumADownInfo.trackItems.push.apply(albumADownInfo.trackItems, jsonBody.data.tracksAudioPlay);
            //items.push.apply(items,temp1)
            // noinspection JSUnresolvedVariable
            if (jsonBody.data.hasMore === true) {
                // noinspection JSUnresolvedVariable
                let nextPageNum = 1 + jsonBody.data.pageNum;
                fetchAlbumsToDownInfo(httpsUrl, albumId, nextPageNum, sort, maxPageSize);
            } else {
                loadSetting(); //4.加载个人设置
                addDownloadAssistant(); //5.添加下载助手按钮
                albumADownInfo.trackItems.forEach(trackItem => addDownAHrefNode(trackItem));
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="4.加载个人设置">
    function loadSetting() {
        // noinspection JSUnresolvedFunction
        saveDirPath = GM_getValue("saveDirPath", "output");
        // noinspection JSUnresolvedFunction
        sort = GM_getValue("sort", 0);//0:正序；1：逆序；
    }

    //</editor-fold>

    //<editor-fold desc="5.添加下载助手按钮">
    function addDownloadAssistant() {

        let rootHeaderNode = document.getElementById('root');
        if (rootHeaderNode == null) throw "aDownAddText err!->妈的又改版了!";
        let htmlLiElement = document.createElement("div");
        htmlLiElement.className = "dropdown";
        htmlLiElement.innerHTML = '<a id="downTip" style="color: red;">ADown↓</a>' +
            '<div class="dropdown-content">' +
            '<p style="color: green; margin: 2px;" id="downTipBatchDown">批量下载</p>' +
            '<p style="color: green; margin: 2px;" id="downTipSettings">设置</p>' +
            '</div>';
        rootHeaderNode.prepend(htmlLiElement);
        downTipDiv = document.getElementById('downTip');
        if (downTipDiv == null) throw "isLoginAndAddText err!->妈的 downTipDiv 不见了！";

        let downTipNode = document.getElementById("downTip");
        let downTipBatchDown = document.getElementById("downTipBatchDown");
        let downTipSettings = document.getElementById("downTipSettings");

        showTextArea();//组装 下载 文本
        elementHide("XmlyADownTextDiv");

        downTipNode.addEventListener("click", () => {
            toggleElementHideShow("XmlyADownTextDiv");
        });
        downTipBatchDown.addEventListener("click", () => {
            batchDownload();
        });
        downTipSettings.addEventListener("click", () => {
            showSetting();
        });
    }

    //</editor-fold>

    //<editor-fold desc="6.底部列表">
    function showTextArea() {
        if (document.querySelector('#XmlyADownTextDiv') == null) {
            let container = document.createElement("div");
            container.id = "XmlyADownTextDiv";
            container.style = "width: 100%; position: fixed; z-index: 999998; top: 40%; height: 60%; bottom: 0px; " +
                "background: black; color: red;overflow: auto;font-family: Consolas,Monaco,monospace;";
            container.innerHTML = '<div style="white-space: nowrap;width: 93%;position: absolute;top: 0;left: 0; margin: 2px; height: 98%; ' +
                'background: black; color: lawngreen;resize: none; border: 1px solid green;overflow: scroll;">' +
                '<ol id="ADownLinksNode"></ol></div>';
            document.body.appendChild(container);
        } else {
            elementShow('XmlyADownTextDiv');
        }
    }

    //</editor-fold>

    //<editor-fold desc="7.辅助">

    function addDownAHrefNode(trackItem) {
        let anchor = document.createElement("a");
        // noinspection JSUnresolvedVariable
        anchor.text = `${trackItem.index}_${trackItem.trackName}`;

        let olNode = document.getElementById("ADownLinksNode");
        let liNode = document.createElement("li");
        liNode.append(anchor);
        olNode.append(liNode);

        anchor.addEventListener("click", ev => {
            downTrackItem(trackItem);
        });

        return anchor;
    }


    function myLog(param1, param2) {
        param1 = param1 ? param1 : "";
        param2 = param2 ? param2 : "";
        console.log(`#${logCount++}ADown:`, param1, param2);
    }

    function showSetting() {//打开设置
        if (document.getElementById("ADownSettings") != null) {
            loadSetting();
            setSelectCheckedOptionsValue('sortNodeValueId', sort, true); //设置清晰度 显示值
            document.getElementById("ADownSavePath").value = saveDirPath;
            elementShow("ADownSettings");
        } else {
            let container = document.createElement("div");
            container.id = "ADownSettings";
            container.style = "position: fixed; z-index: 999999; top: 50px; right: 300px; width: 130px; height: auto; " +
                "background: black; padding: 10px; color: white; font-size: 14px; border: 1px solid red;";
            container.innerHTML =
                '<div style="line-height:22px;"><h3 style="text-align: center;font-weight: bolder;">下载设置</h3>' +
                '<div>文件保存位置: <input type="text" id="ADownSavePath" value="' + saveDirPath + '" style="width:100%" /></div>' +
                '<div>下载顺序:' +
                '<select id="sortNodeValueId">' +
                '<option value="0" ' + (sort === 0 ? 'selected' : '') + '>0.正序</option>' +
                '<option value="1" ' + (sort === 1 ? 'selected' : '') + '>1.逆序</option>' +
                '</select></div>' +
                '<div style="margin-top:5px;float: right;">' +
                '<span><input type="button" value="取消" id="SettingsCancelButton"> | ' +
                '<input type="button" value="保存" id="SettingsSaveButton"></span>' +
                '</div>' +
                '</div>';
            document.body.appendChild(container);
        }
        document.getElementById("SettingsSaveButton").addEventListener("click", function () {
            let sortValueNode = document.getElementById('sortNodeValueId');
            let sortValueNodeSelectedIndex = sortValueNode.selectedIndex; // 选中索引
            let sortValueNodeValue = sortValueNode.options[sortValueNodeSelectedIndex].value; // 选中值
            let aDownSavePathValue = document.getElementById("ADownSavePath").value;
            saveSetting(sortValueNodeValue, aDownSavePathValue);//$('input[name="save_path"]').val()
            elementHide("ADownSettings");
        });
        document.getElementById("SettingsCancelButton").addEventListener("click", function () {
            elementHide("ADownSettings");
        });
    }

    function saveSetting(thisSort, thisSaveDirPath) {
        // noinspection JSUnresolvedFunction : GM_getValue supplied by TamperMonkey
        GM_setValue("sort", parseInt(thisSort));//0:正序；1：逆序；
        // noinspection JSUnresolvedFunction
        GM_setValue("saveDirPath", thisSaveDirPath);
    }

    /**
     * 设置select控件选中
     * @param selectId select的id值
     * @param checkValue 选中option的值
     * @param isSetTrue
     */
    function setSelectCheckedOptionsValue(selectId, checkValue, isSetTrue) {
        let select = document.getElementById(selectId);

        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === checkValue) {
                select.options[i].selected = isSetTrue;
                break;
            }
        }
    }

    function elementHide(elementId) {
        let element = document.getElementById(elementId);
        if (element == null) {
            alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
        }
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function elementShow(elementId) {
        let element = document.getElementById(elementId);
        if (element == null) {
            alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
        }
        element.classList.remove('hide');
        element.classList.add('show');

    }

    function downTrackItem(trackItem) {
// noinspection JSUnresolvedVariable
        let fileName = `${trackItem.index}_${trackItem.trackName}.m4a`.replace(winErrCharReg, "");
        let saveAlbumPath = `${albumADownInfo.albumTitle}`.replace(winErrCharReg, "");
        let savePath = `${saveDirPath}/${saveAlbumPath}`;
        sendDownloadTaskToAria2(trackItem.src, fileName, savePath);
    }

    function batchDownload() {
        // noinspection JSUnresolvedFunction
        GM_setClipboard(albumADownInfo.albumTitle);//设置专辑名称到剪贴板
        albumADownInfo.trackItems.forEach(trackItem => downTrackItem(trackItem));
    }

    function toggleElementHideShow(elementId) {
        let element = document.getElementById(elementId);
        if (element == null) {
            alert("toggleElementHideShow：妈的，" + elementId + " 没找到！");
        }
        let show = element.classList.contains('show');
        if (show) {
            element.classList.remove('show');
            element.classList.add('hide');
        } else {
            element.classList.remove('hide');
            element.classList.add('show');
        }
    }

    // 将下载链接发送到 Aria2 下载
    function sendDownloadTaskToAria2(downloadUrl, fileName, savePath) {
        let jsonRpc = {
            id: '',
            jsonrpc: '2.0',
            method: 'aria2.addUri',
            params: [
                [downloadUrl],
                {
                    dir: savePath,
                    out: fileName
                }
            ]
        };
        // noinspection JSUnresolvedFunction
        GM_xmlhttpRequest({
            url: aria2Url,
            method: 'POST',
            data: JSON.stringify(jsonRpc),
            onerror: function (response) {
                myLog(response);
            },
            onload: function (response) {
                myLog(response);
                if (!hasOpenAriaC2Tab) {
                    // noinspection JSUnresolvedFunction
                    GM_openInTab('http://aria2c.com/', {active: true});
                    hasOpenAriaC2Tab = true;
                }
            }
        });
    }

    //</editor-fold>

    //<editor-fold desc="8签名解码,协同通讯拨号器,加密算法(网页js版) ">
    function translate(exportsFunction, element) {
        exportsFunction(element = {exports: {}}, element.exports);
        return element.exports;
    }

    let nativeFunctions = translate(function (orgString) {
        let aAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            functionList = {
                rotl: (keyWords, position) => keyWords << position | keyWords >>> 32 - position,
                rotr: (keyWords, position) => keyWords << 32 - position | keyWords >>> position,
                endian: keyWordsNum => {
                    if (keyWordsNum.constructor === Number)
                        return 16711935 & functionList.rotl(keyWordsNum, 8) | 4278255360 & functionList.rotl(keyWordsNum, 24);
                    for (let index = 0; index < keyWordsNum.length; index++)
                        keyWordsNum[index] = functionList.endian(keyWordsNum[index]);
                    return keyWordsNum;
                },
                randomBytes: wordsLength => {
                    let bytesArray;
                    for (bytesArray = []; 0 < wordsLength; wordsLength--)
                        bytesArray.push(Math.floor(256 * Math.random()));
                    return bytesArray;
                },
                bytesToWords: bytesArray => {
                    let resultWords = [], index = 0, reindex = 0;
                    for (; index < bytesArray.length; index++, reindex += 8)
                        resultWords[reindex >>> 5] |= bytesArray[index] << 24 - reindex % 32;
                    return resultWords;
                },
                wordsToBytes: words => {
                    let resultBytes = [], positionIndex = 0;
                    for (; positionIndex < 32 * words.length; positionIndex += 8)
                        resultBytes.push(words[positionIndex >>> 5] >>> 24 - positionIndex % 32 & 255);
                    return resultBytes;
                },
                bytesToHex: bytes => {
                    let resultHex = [], positionIndex = 0;
                    for (; positionIndex < bytes.length; positionIndex++) {
                        resultHex.push((bytes[positionIndex] >>> 4).toString(16));
                        resultHex.push((15 & bytes[positionIndex]).toString(16));
                    }
                    return resultHex.join("");
                },
                hexToBytes: hexArray => {
                    let resultBytes = [], positionIndex = 0;
                    for (; positionIndex < hexArray.length; positionIndex += 2)
                        resultBytes.push(parseInt(hexArray.substr(positionIndex, 2), 16));
                    return resultBytes;
                },
                bytesToBase64: bytesArray => {
                    let base64Array = [];
                    for (let positionIndex = 0; positionIndex < bytesArray.length; positionIndex += 3) {
                        let o = bytesArray[positionIndex] << 16 | bytesArray[positionIndex + 1] << 8 | bytesArray[positionIndex + 2];
                        for (let index = 0; index < 4; index++) {
                            8 * positionIndex + 6 * index <= 8 * bytesArray.length ?
                                base64Array.push(aAlphabet.charAt(o >>> 6 * (3 - index) & 63))
                                : base64Array.push("=");
                        }
                    }
                    return base64Array.join("");
                },
                base64ToBytes: base64String => {
                    base64String = base64String.replace(/[^A-Z0-9+\/]/gi, "");
                    let resultBytes = [], index = 0, nextLoopIndex = 0;
                    for (; index < base64String.length; nextLoopIndex = ++index % 4) {
                        0 !== nextLoopIndex &&
                        resultBytes.push(
                            (aAlphabet.indexOf(base64String.charAt(index - 1)) & Math.pow(2, -2 * nextLoopIndex + 8) - 1)
                            << 2 * nextLoopIndex
                            |
                            aAlphabet.indexOf(base64String.charAt(index)) >>> 6 - 2 * nextLoopIndex
                        );
                    }
                    return resultBytes;
                }
            };
        orgString.exports = functionList;
    });
    let decoder = {
        utf8: {
            stringToBytes: string => decoder.bin.stringToBytes(unescape(encodeURIComponent(string))),
            bytesToString: bytes => decodeURIComponent(escape(decoder.bin.bytesToString(bytes)))
        },
        bin: {
            stringToBytes: string => {
                let resultBytes = [];
                for (let index = 0; index < string.length; index++) { // noinspection JSUnresolvedFunction
                    resultBytes.push(255 & string.charCodeAt(index));
                }
                return resultBytes;
            },
            bytesToString: bytes => {
                let resultStringChar = [];
                for (let index = 0; index < bytes.length; index++)
                    resultStringChar.push(String.fromCharCode(bytes[index]));
                return resultStringChar.join("");
            }
        }
    };
    let bufferTest = type => !!type.constructor && "function" == typeof type.constructor.isBuffer && type.constructor.isBuffer(type);
    // noinspection JSUnresolvedVariable
    let judgeType = type => null != type &&
        (bufferTest(type) ||
            (t => "function" == typeof t.readFloatLE && "function" == typeof t.slice && bufferTest(t.slice(0, 0)))(type)
            || !!type._isBuffer
        );

    let getVerifyCode = translate(function (subString) {

        let md5 = function (fullStr, mainKey) {
            fullStr.constructor === String ? fullStr = mainKey && "binary" === mainKey.encoding
                ? decoder.bin.stringToBytes(fullStr) : decoder.utf8.stringToBytes(fullStr) :
                judgeType(fullStr) ? fullStr = Array.prototype.slice.call(fullStr, 0) :
                    Array.isArray(fullStr) || (fullStr = fullStr.toString());

            let fullWords = nativeFunctions.bytesToWords(fullStr), full8Length = 8 * fullStr.length;
            let d1 = 1732584193, d2 = -271733879, d3 = -1732584194, d4 = 271733878;
            for (let index = 0; index < fullWords.length; index++) {
                fullWords[index] = 16711935 & (fullWords[index] << 8 | fullWords[index] >>> 24)
                    | 4278255360 & (fullWords[index] << 24 | fullWords[index] >>> 8);
            }

            fullWords[full8Length >>> 5] |= 128 << full8Length % 32;
            fullWords[14 + (64 + full8Length >>> 9 << 4)] = full8Length;


            let A = md5.A, B = md5.B, C = md5.C, D = md5.D;
            for (let i = 0; i < fullWords.length; i += 16) {
                let dd1 = d1, dd2 = d2, dd3 = d3, dd4 = d4;

                //<editor-fold desc="A轮">
                d1 = A(d1, d2, d3, d4, fullWords[i], 7, -680876936);
                d4 = A(d4, d1, d2, d3, fullWords[i + 1], 12, -389564586);
                d3 = A(d3, d4, d1, d2, fullWords[i + 2], 17, 606105819);
                d2 = A(d2, d3, d4, d1, fullWords[i + 3], 22, -1044525330);

                d1 = A(d1, d2, d3, d4, fullWords[i + 4], 7, -176418897);
                d4 = A(d4, d1, d2, d3, fullWords[i + 5], 12, 1200080426);
                d3 = A(d3, d4, d1, d2, fullWords[i + 6], 17, -1473231341);
                d2 = A(d2, d3, d4, d1, fullWords[i + 7], 22, -45705983);

                d1 = A(d1, d2, d3, d4, fullWords[i + 8], 7, 1770035416);
                d4 = A(d4, d1, d2, d3, fullWords[i + 9], 12, -1958414417);
                d3 = A(d3, d4, d1, d2, fullWords[i + 10], 17, -42063);
                d2 = A(d2, d3, d4, d1, fullWords[i + 11], 22, -1990404162);

                d1 = A(d1, d2, d3, d4, fullWords[i + 12], 7, 1804603682);
                d4 = A(d4, d1, d2, d3, fullWords[i + 13], 12, -40341101);
                d3 = A(d3, d4, d1, d2, fullWords[i + 14], 17, -1502002290);
                d2 = A(d2, d3, d4, d1, fullWords[i + 15], 22, 1236535329);
                //</editor-fold>

                //<editor-fold desc="B轮">
                d1 = B(d1, d2, d3, d4, fullWords[i + 1], 5, -165796510);
                d4 = B(d4, d1, d2, d3, fullWords[i + 6], 9, -1069501632);
                d3 = B(d3, d4, d1, d2, fullWords[i + 11], 14, 643717713);
                d2 = B(d2, d3, d4, d1, fullWords[i], 20, -373897302);

                d1 = B(d1, d2, d3, d4, fullWords[i + 5], 5, -701558691);
                d4 = B(d4, d1, d2, d3, fullWords[i + 10], 9, 38016083);
                d3 = B(d3, d4, d1, d2, fullWords[i + 15], 14, -660478335);
                d2 = B(d2, d3, d4, d1, fullWords[i + 4], 20, -405537848);

                d1 = B(d1, d2, d3, d4, fullWords[i + 9], 5, 568446438);
                d4 = B(d4, d1, d2, d3, fullWords[i + 14], 9, -1019803690);
                d3 = B(d3, d4, d1, d2, fullWords[i + 3], 14, -187363961);
                d2 = B(d2, d3, d4, d1, fullWords[i + 8], 20, 1163531501);

                d1 = B(d1, d2, d3, d4, fullWords[i + 13], 5, -1444681467);
                d4 = B(d4, d1, d2, d3, fullWords[i + 2], 9, -51403784);
                d3 = B(d3, d4, d1, d2, fullWords[i + 7], 14, 1735328473);
                d2 = B(d2, d3, d4, d1, fullWords[i + 12], 20, -1926607734);
                //</editor-fold>

                //<editor-fold desc="C轮">
                d1 = C(d1, d2, d3, d4, fullWords[i + 5], 4, -378558);
                d4 = C(d4, d1, d2, d3, fullWords[i + 8], 11, -2022574463);
                d3 = C(d3, d4, d1, d2, fullWords[i + 11], 16, 1839030562);
                d2 = C(d2, d3, d4, d1, fullWords[i + 14], 23, -35309556);

                d1 = C(d1, d2, d3, d4, fullWords[i + 1], 4, -1530992060);
                d4 = C(d4, d1, d2, d3, fullWords[i + 4], 11, 1272893353);
                d3 = C(d3, d4, d1, d2, fullWords[i + 7], 16, -155497632);
                d2 = C(d2, d3, d4, d1, fullWords[i + 10], 23, -1094730640);

                d1 = C(d1, d2, d3, d4, fullWords[i + 13], 4, 681279174);
                d4 = C(d4, d1, d2, d3, fullWords[i], 11, -358537222);
                d3 = C(d3, d4, d1, d2, fullWords[i + 3], 16, -722521979);
                d2 = C(d2, d3, d4, d1, fullWords[i + 6], 23, 76029189);

                d1 = C(d1, d2, d3, d4, fullWords[i + 9], 4, -640364487);
                d4 = C(d4, d1, d2, d3, fullWords[i + 12], 11, -421815835);
                d3 = C(d3, d4, d1, d2, fullWords[i + 15], 16, 530742520);
                d2 = C(d2, d3, d4, d1, fullWords[i + 2], 23, -995338651);
                //</editor-fold>

                //<editor-fold desc="D轮">
                d1 = D(d1, d2, d3, d4, fullWords[i], 6, -198630844);
                d4 = D(d4, d1, d2, d3, fullWords[i + 7], 10, 1126891415);
                d3 = D(d3, d4, d1, d2, fullWords[i + 14], 15, -1416354905);
                d2 = D(d2, d3, d4, d1, fullWords[i + 5], 21, -57434055);

                d1 = D(d1, d2, d3, d4, fullWords[i + 12], 6, 1700485571);
                d4 = D(d4, d1, d2, d3, fullWords[i + 3], 10, -1894986606);
                d3 = D(d3, d4, d1, d2, fullWords[i + 10], 15, -1051523);
                d2 = D(d2, d3, d4, d1, fullWords[i + 1], 21, -2054922799);

                d1 = D(d1, d2, d3, d4, fullWords[i + 8], 6, 1873313359);
                d4 = D(d4, d1, d2, d3, fullWords[i + 15], 10, -30611744);
                d3 = D(d3, d4, d1, d2, fullWords[i + 6], 15, -1560198380);
                d2 = D(d2, d3, d4, d1, fullWords[i + 13], 21, 1309151649);

                d1 = D(d1, d2, d3, d4, fullWords[i + 4], 6, -145523070);
                d4 = D(d4, d1, d2, d3, fullWords[i + 11], 10, -1120210379);
                d3 = D(d3, d4, d1, d2, fullWords[i + 2], 15, 718787259);
                d2 = D(d2, d3, d4, d1, fullWords[i + 9], 21, -343485551);
                //</editor-fold>

                d1 = d1 + dd1 >>> 0;
                d2 = d2 + dd2 >>> 0;
                d3 = d3 + dd3 >>> 0;
                d4 = d4 + dd4 >>> 0;
            }
            return nativeFunctions.endian([d1, d2, d3, d4])
        };

        //四轮循环运算：循环的次数是分组的个数（N+1）
        md5.A = (start, param1, position, param2, order, index, end) => {
            let lastWords = start + (param1 & position | ~param1 & param2) + (order >>> 0) + end;
            return (lastWords << index | lastWords >>> 32 - index) + param1;
        };
        md5.B = (start, param1, param2, position, order, index, end) => {
            let lastWords = start + (param1 & position | param2 & ~position) + (order >>> 0) + end;
            return (lastWords << index | lastWords >>> 32 - index) + param1;
        };
        md5.C = (start, param1, position, param2, order, index, end) => {
            let lastWords = start + (param1 ^ position ^ param2) + (order >>> 0) + end;
            return (lastWords << index | lastWords >>> 32 - index) + param1;
        };
        md5.D = (start, param1, nextPosition, param2, order, index, end) => {
            let lastWords = start + (nextPosition ^ (param1 | ~param2)) + (order >>> 0) + end;
            return (lastWords << index | lastWords >>> 32 - index) + param1;
        };

        md5._blocksize = 16;
        md5._digestsize = 16;
        subString.exports = function (fullString, mainKey) {
            if (null == fullString)
                throw new Error("Illegal argument " + fullString);
            let bytes = nativeFunctions.wordsToBytes(md5(fullString, mainKey));
            // noinspection JSUnresolvedVariable
            return mainKey &&
            mainKey.asBytes ?
                bytes : mainKey &&
                mainKey.asString ?
                    decoder.bin.bytesToString(bytes) :
                    nativeFunctions.bytesToHex(bytes)
        }
    });

    let getRandomNumber = seed => ~~(Math.random() * seed);//随机数

    function getXmSign() {
        //"43639784fcd7d38e6e5934830eda07b9(25)1564291975184(70)1564292009912"
        // noinspection JSUnresolvedVariable
        let currentTimeNum = "undefined" == typeof unsafeWindow ? Date.now() : unsafeWindow.XM_SERVER_CLOCK || 0; //1564291975184;//
        let dateNow = Date.now();//1564292009912;//
        let orgString = `{ximalaya-${currentTimeNum}}(${getRandomNumber(100)})${currentTimeNum}(${getRandomNumber(100)})${dateNow}`;
        //let orgString = `{ximalaya-${currentTimeNum}}(25)${currentTimeNum}(70)${dateNow}`;
        return orgString.replace(
            /{([\w-]+)}/, (allMatchedString, subMatchedString) => getVerifyCode(subMatchedString)
        );
    }

    // document.write(getXmSign() + '</br>');
    // document.write("43639784fcd7d38e6e5934830eda07b9(25)1564291975184(70)1564292009912");
    // document.write('</br> pass? :' + (getXmSign() === "43639784fcd7d38e6e5934830eda07b9(25)1564291975184(70)1564292009912") + '</br>');

//</editor-fold>

})();

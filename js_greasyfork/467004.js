// ==UserScript==
// @name         S1蒜楼回复提取
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  S1蒜楼回复提取，无权限模式下通过查找ID回帖来汇总
// @author       You
// @match        https://bbs.saraba1st.com/2b/thread-2096465-*
// @icon         https://bbs.saraba1st.com/favicon.ico
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.9.1/jszip.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467004/S1%E8%92%9C%E6%A5%BC%E5%9B%9E%E5%A4%8D%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467004/S1%E8%92%9C%E6%A5%BC%E5%9B%9E%E5%A4%8D%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...

    // 蒜楼ID及标题关键词
    const threadID = '2096465', threadTitle = "Lycoris Recoil";

    // 蒜楼名单
    //#重症病人
    const arrHeavy = [
        ["leitingkai", "168991"],
        ["IWS2000", "500054"],
        ["wafdleo", "559558"],
        ["osore", "184969"],
        ["灼眼的夏娜酱", "502729"],
        ["JY要塞", "502728"],
        ["Franc", "523148"],
        ["Tease", "564955"],
        ["sad6504", "461399"],
        ["帝下室の年糕", "551700"],
        ["Alicest", "541383"],
        ["HANDAIYV", "558777"],
        ["1646_kb_cy", "559242"],
        ["llconforever", "462822"],
        ["aquakane", "559787"],
        ["Wondering", "551129"],
        ["枞枞那年", "558762"],
        ["梅斯之围", "534116"],
        ["坐看风起云涌", "512949"],
        ["黑白金兽", "563526"],
        ["半年", "240849"],
        ["taybmq", "525802"],
        ["gzhao01", "525802"],
        ["Delicatus545", "532561"],
        ["ly225", "562230"],
        ["Urystal", "529864"],
        ["higuchiguchi", "562093"],
        ["Saber琪", "558358"],
        ["GGnob", "524233"],
        ["ardito", "247155"],
        ["yaneis", "559774"],
        ["zing223", "531692"],
        ["格陵兰de深井冰", "513119"],
        ["脚底心，洗则白", "522166"]
    ];

    //#轻症病人
    const arrNormal = [
        ["haohaoh4", "544460"],
        ["无名氏00", "560912"],
        ["米奥莉奈", "558374"],
        ["阿棍风吟", "406959"],
        ["伊地知星歌", "562533"],
        ["衔鲑鱼的熊", "558328"],
        ["赫尔墨斯的权杖", "489825"],
        ["卑微鲀", "559014"],
        ["西萃Simoeko", "561198"],
        ["haoshion", "521154"],
        ["毫无疑问是个dd", "563075"],
        ["yznmd", "561568"],
        ["Артём", "553476"],
        ["zpy393", "255766"],
        ["7sevenseven", "522305"],
        ["意义不明用户名", "541374"],
        ["eito", "532757"],
        ["堆雪若叶", "454538"],
        ["布伦史塔德", "560576"]

    ];

    //创建名单、回复数组及相关参数
    const folder = 'Tampermonkey';
    const postList = [["用户ID", "用户名", "回复时间", "回复内容", "回复ID", "回复楼层"]];
    const heavyIDarr = "heavyIDarr", normalIDarr = "normalIDarr", postListarr = "postListarr", CPUName = "CPUName";
    let idArrayHeavy = GM_getValue(heavyIDarr, arrHeavy), idArrayNormal = GM_getValue(normalIDarr, arrNormal), postArray = GM_getValue(postListarr, postList);
    //let CPU = GM_getValue(CPUName, '');
    let postUserID, postName, postTime, postText, replyID, replyNum;
    const limit = GM_getValue('limit', false), jgyEnable = GM_getValue('jgyEnable', false);
    let dateLimit, pageLimit, enablejianguoyun, jianguoyun;
    !limit ? (dateLimit = prompt("请输入获取历史回复的最早截止时间，早于该时间的回复将不会获取，格式为“20XX-XX-XX”"), pageLimit = prompt("请输入获取历史回复的最大页数，超过该页数的回复将不会获取"), GM_setValue('limit', true))
        : (dateLimit = GM_getValue('dateLimit', '2023-05-23'), pageLimit = GM_getValue('pageLimit', 5))

    /**
     * 坚果云API类
     */
    class webdav {
        constructor(Account, Password) {
            this.Account = Account
            this.Password = Password
            this.key = btoa(this.Account + ':' + this.Password)
            this.header = {
                Authorization: `Basic ${this.key}`,
            }
        }
        NewFolder(FolderName) {
            let url = `https://dav.jianguoyun.com/dav/${FolderName}/`
            let type = "MKCOL" // 新建
            return new Promise(
                (complete, error) => {
                    GM_xmlhttpRequest({
                        method: type,
                        timeout: 3000,
                        headers: this.header,
                        url: url,
                        onload: complete,
                        onerror: error,
                        ontimeout: error
                    })
                }
            )
        }
        UploadFiles(FolderName, FileName, FileData, DataType) {
            let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
            let type = "PUT" // 上传
            let headerNew = this.header;
            return new Promise(
                (complete, error) => {
                    GM_xmlhttpRequest({
                        method: type,
                        timeout: 3000,
                        data: FileData,
                        headers: headerNew,
                        url: url,
                        dataType: DataType,
                        onload: complete,
                        onerror: error,
                        ontimeout: error
                    })
                }
            )
        }
        DownloadFile(FolderName, FileName, responseType) {
            let url = `https://dav.jianguoyun.com/dav/${FolderName}/${FileName}`
            let type = "GET" // 下载
            return new Promise(
                (complete, error) => {
                    GM_xmlhttpRequest({
                        method: type,
                        timeout: 3000,
                        headers: this.header,
                        url: url,
                        responseType: responseType,
                        onload: complete,
                        onerror: error,
                        ontimeout: error
                    })
                }
            )
        }
        RenameFile(oldFolderName, newFolderName, oldFileName, newFilename) {
            let oldurl = `https://dav.jianguoyun.com/dav/${oldFolderName}/${oldFileName}`
            let newurl = `https://dav.jianguoyun.com/dav/${newFolderName}/${newFilename}`
            let type = "MOVE" // 移动、重命名
            return new Promise(
                (complete, error) => {
                    GM_xmlhttpRequest({
                        method: type,
                        timeout: 3000,
                        headers: this.header,
                        url: oldurl,
                        Depth: 0,
                        Destination: newurl,
                        onload: complete,
                        onerror: error,
                        ontimeout: error
                    })
                }
            )
        }
        GetAllFile(path, depth) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "PROPFIND",
                    url: "https://dav.jianguoyun.com/dav/" + path,
                    headers: {
                        "Authorization": `Basic ${this.key}`,
                        "Depth": depth
                    },
                    onload: function (response) {
                        if (response.status == 207) {
                            let parser = new DOMParser();
                            let xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                            let responses = xmlDoc.getElementsByTagNameNS("DAV:", "response");
                            let urls = [];
                            for (let i = 0; i < responses.length; i++) {
                                let href = responses[i].getElementsByTagNameNS("DAV:", "href")[0].textContent;
                                let propstat = responses[i].getElementsByTagNameNS("DAV:", "propstat")[0];
                                let status = propstat.getElementsByTagNameNS("DAV:", "status")[0].textContent;
                                if (status.includes("200 OK")) {

                                    let resourcetype = propstat.getElementsByTagNameNS("DAV:", "resourcetype")[0];
                                    if (resourcetype.getElementsByTagNameNS("DAV:", "collection").length > 0) {
                                        href += "/";
                                    }
                                    let fileName = propstat.getElementsByTagNameNS("DAV:", "displayname")[0].textContent;
                                    let fileTime = propstat.getElementsByTagNameNS("DAV:", "getlastmodified")[0].textContent;
                                    let fileSize = propstat.getElementsByTagNameNS("DAV:", "getcontentlength")[0].textContent;
                                    urls.push({ 'href': href, 'Name': fileName, 'Time': fileTime, 'Size': fileSize });
                                }
                            }
                            resolve(urls);
                        }
                        else {
                            console.error(response);
                            reject(new Error("The request failed with status code " + response.status));
                        }
                    }
                });
            });
        }
        ExistsFile(path) {
            return new Promise((resolve, reject) => {
                //console.log(this);
                GM_xmlhttpRequest({
                    method: "HEAD",
                    url: "https://dav.jianguoyun.com/dav/" + path,
                    headers: this.header,
                    onload: function (response) {
                        let status = response.status;
                        // 如果状态码是200，表示文件夹存在
                        if (status == 200) {
                            resolve(true)
                        }
                        // 如果状态码是404，表示文件夹不存在
                        else if (status == 404) {
                            resolve(false)
                        } else if (status == 403) {
                            resolve(false)
                            reject("权限不足,拒绝访问")
                        }
                        else {
                            reject("The status code is " + status + " and the status text is " + response.statusText)
                        }
                    }
                });
            }
            )
        }
        DeleteFile(path) {
            return new Promise((resolve, reject) => {
                console.log(this);
                GM_xmlhttpRequest({
                    method: "DELETE",
                    url: "https://dav.jianguoyun.com/dav/" + path,
                    headers: this.header,
                    onload: function (response) {
                        let status = response.status;
                        // 如果状态码是204，表示文件(夹)已删除
                        if (status == 204) {
                            resolve(true)
                        }
                        // 如果状态码是404，表示文件(夹)不存在
                        else if (status == 404) {
                            resolve(false)
                        } else if (status == 403) {
                            resolve(false)
                            reject("权限不足,拒绝访问")
                        }
                        else {
                            reject("The status code is " + status + " and the status text is " + response.statusText)
                        }
                    }
                });
            })
        }
    }
    //坚果云初始化
    async function jgyInit() {
        if (enablejianguoyun && !accountName && !accountPassword) {
            accountName = prompt("请输入坚果云账号："); accountPassword = prompt("请输入坚果云webDAV应用密码");
            GM_setValue(jgyAccount, accountName); GM_setValue(jgyPassword, accountPassword);

        }
        jianguoyun = new webdav(accountName, accountPassword);
        if (enablejianguoyun) {
            let existTampermonky = await checkExistentFile('');
            existTampermonky ? console.log('已存在Tampermonkey目录，无需创建') : (jianguoyun.NewFolder(folder));
        }
    }
    //坚果云账户信息及是否开启
    if (jgyEnable) enablejianguoyun = true
    else { enablejianguoyun = confirm("是否开启坚果云同步？"); GM_setValue('jgyEnable', enablejianguoyun) }
    const jgyAccount = 'jgyAccount', jgyPassword = 'jgyPassword';
    let accountName = GM_getValue('jgyAccount', null), accountPassword = GM_getValue('jgyPassword', null);
    jgyInit();

    /**
     * fetch获取HTML封装
     * @param {string} Url 
     * @return DOMParser生成的DOMElement
     */
    async function getHTML(Url) {
        let get = await fetch(Url);
        let res = await get.text();
        return (new DOMParser()).parseFromString(res, 'text/html');
    }
    //指定div用于载入获取的html
    let ct = document.getElementById("ct")

    /**
     * 根据userName获取ID
     * @param {string} userName 
     * @returns 
     */
    async function getUserID(userName) {
        let userSpace = await getHTML('https://bbs.saraba1st.com/2b/space-username-' + userName + '.html');
        ct.innerHTML = userSpace.getElementById("uhd").outerHTML;
        let userUrl = ct.querySelector(".h a.xg1").textContent;
        let userID = userUrl.slice(userUrl.indexOf("?") + 1);
        //console.log(userID);
        return userID;
    }
    /**
     * 添加用户ID
     * @param {string} ID 
     * @param {int} length 
     */
    function addUserID(ID, length) {
        //console.log(ID, length);
        let inArrayHeavy = idArrayHeavy.some(arr => arr[0] == postName);
        let inArrayNormal = idArrayNormal.some(arr => arr[0] == postName);
        let outarr = !inArrayHeavy && !inArrayNormal;
        if (outarr && length >= 8) {
            idArrayHeavy.push([postName, postUserID]);
            GM_setValue(heavyIDarr, idArrayHeavy);
            console.log("添加重症病人: " + postName);
        } else if (length < 8) {
            idArrayNormal.push([postName, postUserID]);
            GM_setValue(normalIDarr, idArrayNormal);
            console.log("添加轻症病人: " + postName);
        }
        if (!inArrayHeavy && inArrayNormal && length >= 8) {
            idArrayHeavy.push([postName, postUserID]);
            idArrayNormal.splice(idArrayNormal.indexOf(ID), 1);
            GM_setValue(heavyIDarr, idArrayHeavy);
            GM_setValue(normalIDarr, idArrayNormal);
            console.log("轻症转重症: " + postName);
        }
        if (inArrayHeavy && !inArrayNormal && length < 4) {
            idArrayNormal.push([postName, postUserID]);
            idArrayHeavy.splice(idArrayHeavy.indexOf(ID), 1);
            GM_setValue(heavyIDarr, idArrayHeavy);
            GM_setValue(normalIDarr, idArrayNormal);
            console.log("重症转轻症: " + postName);
        }
    }
    /**
     * 确定蒜楼回复数量并返回回复数组
     * @param {Element} tbody 
     * @returns 
     */
    function getTargetReplys(tbody) {
        let threads = tbody.children;
        //querySelectorAll(".bw0_all");
        let threadmum = threads.length;
        let Lycoris, i, j;
        let LycorisReplys = [];
        for (i = 0, j = 0; i < threadmum; i++) {
            let bw0 = threads[i].querySelector("th a");
            if (bw0 != null && bw0.textContent.includes(threadTitle)) {
                Lycoris = threads[i]; j = i;
                replyNum = Lycoris.querySelector(".num a").textContent;
            };
            let postDOM = threads[i].querySelector("td.xg1 a");
            //console.log(i, j, k, postDOM);
            if (j > 0 && i > j) {
                if (postDOM != null) LycorisReplys.push(postDOM);
                if (postDOM == null) break;
            }
        };
        return LycorisReplys;
    }
    /**
     * 
     * @param {string} userID 
     * @param {int} page 
     * @returns 回复页面元素
     */
    async function getReplyHtml(userID, page) {
        if (typeof userID != 'string') userID = "";
        let postListUrl = 'https://bbs.saraba1st.com/2b/home.php?mod=space&do=thread&type=reply&from=space&uid=' + userID + '&page=' + page;
        let homeSpace = await getHTML(postListUrl);
        let html = homeSpace.getElementById("delform");
        if (html) {
            ct.innerHTML = html.outerHTML;
            const result = ct.querySelector("#delform > table > tbody");
            return result
        } else return null
    }
    /**
     * 根据userID获取最新一条回复
     * @param {string} userName 用户名
     */
    async function getLatestReply(userName) {
        let postIDarr = idArrayHeavy.concat(idArrayNormal).filter(arr => arr[0] == userName);
        let isIdExist = postIDarr.length != 0;
        postUserID = isIdExist ? postIDarr[0][1] : await getUserID(postName);
        //console.log("是否添加ID：", !isIdExist);
        let tbody = await getReplyHtml(postUserID, 1);
        let replys = getTargetReplys(tbody);
        //console.log(replys);
        let post = replys[0];
        if (!isIdExist) addUserID(postUserID, replys.length);
        postText = post.textContent;
        let postUrl = post.href;
        replyID = postUrl.slice(postUrl.indexOf("pid=") + 4);
        let replyIDinArray = postArray.some(arr => arr[4] == replyID);
        if (!replyIDinArray) {
            postArray.push([postUserID, postName, postTime, postText, replyID, replyNum]);
            console.log(`添加回复，#${replyNum}楼：${postName}，发表于：${postTime}\n${postText}`);
        }
        GM_setValue(postListarr, postArray);
        //if(tbody.children.length > 8) //arr1.push([postName,postID])
    }
    /**
     * 获取指定回复的发表时间
     * @param {string} ID 回复ID
     * @returns 20XX-XX-XX XX:XX
     */
    async function getPostTime(_replyID) {
        let url = 'https://bbs.saraba1st.com/2b/forum.php?mod=redirect&goto=findpost&pid=';
        //console.log(_replyID)
        let id = parseInt(_replyID); let result;
        let ids = [id - 1, id + 1, id - 2, id + 2, id - 3, id + 3, id - 4, id + 4, id - 5, id + 5, id - 6, id + 6, id - 7, id + 7, id - 8, id + 8];
        if (typeof (id) != 'number') console.log("ID不是数字格式")
        else {
            for await (let _ID of ids) {
                let html = await getHTML(url + _ID);
                let _reply = html.getElementById("authorposton" + _ID);
                await sleep(Math.random() * 100 + 500)
                if (_reply) { result = _reply.textContent.replace('发表于 ', ''); return result }
                else console.log(_replyID, _ID, "无权限", url + _ID)
            }
        }
    }
    /**
     * 获取指定用户历史发言
     * @param {string} userName 用户名
     * @param {string} userID 用户ID
     * @param {int} pageStart 开始页
     * @param {int} pageFinish 结束页
     */
    async function getUserReplyHistory(userName, userID, pageStart, pageFinish) {
        let stop = false;
        for (let i = pageStart; i <= pageFinish; i++) {
            console.log(`开始获取${userName},${userID}第${i}页回复`);
            let tbody = await getReplyHtml(userID, i);
            if (tbody == null) { console.log(`${userName},${userID}已被禁言，无权限查看回复`); break }
            let replys = getTargetReplys(tbody);
            for await (let post of replys) {
                let _postText = post.textContent, postUrl = post.href;
                let _replyID = postUrl.slice(postUrl.indexOf("pid=") + 4);
                let replyIDinArray = postArray.some(arr => arr[4] == _replyID);
                if (!replyIDinArray) {
                    let _postTime = await getPostTime(_replyID);
                    //console.log(_replyID, _postTime);
                    if (_postTime) {
                        if (new Date(_postTime) < new Date(dateLimit)) { console.log(`回复早于${dateLimit}，停止继续添加`); break }
                        postArray.push([userID, userName, _postTime, _postText, _replyID]);
                        console.log(`添加回复：${userName}，发表于：${_postTime}\n${_postText}`);
                    } else { stop = true; break }
                }
            }
            if (stop) break;
            await sleep(Math.random() * 500 + 500)
        }
        return stop
    }
    /*获取当前最新回复内容及时间*/
    async function getReplyUser(second) {
        let forum = await getHTML('https://bbs.saraba1st.com/2b/forum-6-1.html');
        ct.innerHTML = "<form><table>" + forum.getElementById("normalthread_" + threadID).outerHTML + "</table></form>";
        let by = document.getElementById("normalthread_" + threadID).lastElementChild.lastElementChild;
        postName = by.firstElementChild.textContent;
        postTime = by.lastElementChild.textContent;
        getLatestReply(postName);
        //console.log("自动获取最新回复中......", new Date().toLocaleString(), "间隔：" + second);
    }
    /**
     * 根据数组类型和时间生成文件名
     * @param {string} dataType 数组类型：回复、病人ID
     * @returns 文件名
     */
    function getFileName(dataType) {
        let PCName = ''//getPCName();
        //console.log(PCName);
        //let date = new Date();
        //let time = date.toLocaleString();
        //let timestr = time.replaceAll(':', '-').replaceAll('/', '-').replace(' ', 'T');
        let fileName = `S1${dataType}_${PCName}.txt`;
        return fileName
    }
    /**
     * 将文件压缩成zip
     * @param {string} name 压缩包内文件名 
     * @param {*} data 压缩包内文件流 
     * @returns 压缩包文件流
     */
    async function compressFileData(name, data) {
        let zip = new JSZip();
        zip.file(name, data);
        //console.log(zip, zip.support);
        let zipData = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: {
                level: 9
            }
        });
        return zipData
    }
    /**
     * 解压zip获取文件
     * @param {string} name 压缩包内文件名 
     * @param {*} data 压缩包文件流 
     * @returns 压缩包内文件流
     */
    async function decompressFileData(name, data) {
        let zip = new JSZip();
        let fileData = await zip.loadAsync(data);
        //console.log(name,fileData);
        let fileStr = await fileData.file(name).async('string');
        return fileStr
    }
    function getFileAttribute(fileName) {
        let type = fileName.match(/S1([a-zA-Z]+)_/) ? fileName.match(/S1([a-zA-Z]+)_/)[1] : '';
        let PCName = fileName.match(/_([\w-]+)\./) ? fileName.match(/_([\w-]+)\./)[1] : '';
        //let time = new Date(fileName.replace(/\w+_([-\d]+)T(\d+)-(\d+)-(\d+)\.txt/,'$1 $2:$3:$4'));
        //console.log(fileName, type, PCName);
        return { type, PCName }
    }
    //回复数组排序算法
    function sortReplys(a, b) {
        if (a[4] != b[4]) return a[4] - b[4]
        else return ((a[5] == undefined) - (b[5] == undefined)) || (a[5] - b[5])
    }
    /**
     * 回复数组合并去重
     * @param {array} arrA 数组A
     * @param {array} arrB 数组B
     * @returns 合并后的数组
     */
    function distinctReplys(arrA, arrB) {
        let arrAB = arrB ? arrA.concat(arrB) : arrA;
        let res = {};
        let ab = arrAB.sort(sortReplys);
        for (let i of ab) res[i] = i;
        let result = Object.values(res);
        console.log(`成功同步回复数据，云端${arrA.length}条，本地${arrB.length}条，合并后${result.length}条，去重${arrAB.length - result.length}条，新增${result.length - arrA.length}`);
        return result.sort(sortReplys)
    }
    /**
     * ID数组合并去重
     * @param {array} arrA 数组A
     * @param {array} arrB 数组B
     * @param {string} type 病人类型
     * @returns 合并后的数组
     */
    function distinctIDs(arrA, arrB, type) {
        //console.log(type);
        let typeStr = type == 'heavyIDarr' ? '重症病人' : '轻症病人';
        let arrAB = arrB ? arrA.concat(arrB) : arrA;
        let res = {};
        for (let i of arrAB) res[i] = i;
        let result = Object.values(res);
        console.log(`成功同步${typeStr}ID数据，云端${arrA.length}条，本地${arrB.length}条，合并后${result.length}条，去重${arrAB.length - result.length}条，新增${result.length - arrA.length}`);
        return result
    }
    /**
     * 获取目录下所有文件信息
     * @param {string} path 目录路径
     * @returns 所有文件信息的对象集合
     */
    async function getExistentFiles(path) {
        let remoteFiles = await jianguoyun.GetAllFile(path, 1);
        let remoteFilesAttr = [];
        remoteFiles.forEach(file => {
            if (file.Name.slice(0, 2) == "S1") {
                let fileType = getFileAttribute(file.Name).type, pcName = getFileAttribute(file.Name).PCName;
                remoteFilesAttr.push({ 'Name': file.Name, 'Type': fileType, 'PCName': pcName, 'Time': file.Time, 'Size': file.Size })
            }
        })
        //console.log(remoteFilesAttr);
        return remoteFilesAttr
    }
    /**
     * 根据文件名判断是否存在该文件
     * @param {string} fileName 文件名
     * @returns boolean
     */
    async function checkExistentFile(fileName) {
        let oldFileExisted = await jianguoyun.ExistsFile(`${folder}/${fileName}`);
        return oldFileExisted
    }
    /**
     * 上传最新数据
     * @param {string} zipName 文件名.zip
     * @param {array} uploadArray 上传数据数组
     */
    async function uploadLatestFile(zipName, uploadArray) {
        let fileName = zipName.replace('zip', 'txt');
        let fileData = JSON.stringify(uploadArray);
        let zipData = await compressFileData(fileName, fileData)
        //console.log(zipData);
        if (zipData) {
            //console.info('压缩比率:', Math.round(zipData.size * 100 / JSON.stringify(postArray).length) / 100)
            console.log('开始上传数据：' + zipName);
            let upload = await jianguoyun.UploadFiles(folder, zipName, zipData, 'application/zip');
            //let upload = await jianguoyun.GetAllFile('Tampermonkey',0)
            //console.log(upload.readyState, upload);
            upload.status == 201 ? console.log('已上传最新数据') : (upload.status == 204 ? console.log('已覆盖更新数据') : console.log(upload.statusText));
        }
    }
    /**
     * 比对本地和云端指定数据并更新
     * @param {string} zipName 文件名.zip
     * @param {string} arrType 数据类型(回复|病人ID)
     * @param {[]} localArray 本地数据数组
     */
    async function syncSameArray(zipName, arrType, localArray) {
        let fileName = zipName.replace('zip', 'txt');
        let response = await jianguoyun.DownloadFile(folder, zipName, "blob");
        let oldFileData = await decompressFileData(fileName, await response.response);
        let oldArray = JSON.parse(oldFileData);
        let newArray = arrType == postListarr ? distinctReplys(oldArray, localArray) : distinctIDs(oldArray, localArray, arrType);
        JSON.stringify(newArray) == JSON.stringify(oldArray) ? console.log(zipName + '云端已是最新数据，本次无需更新') : uploadLatestFile(zipName, newArray);
        //console.log(arrType, GM_getValue(arrType), newArray, localArray);
        GM_setValue(arrType, newArray);
        setDownloadButton(arrType, newArray);
    }
    /**
     * 给数据添加下载功能并弹出提示
     * @param {string} _arrType 
     * @param {[]} _localArray 
     */
    function setDownloadButton(_arrType, _localArray) {
        if (_arrType == postListarr) {
            let down = document.getElementById("um").querySelector('div.avt a');
            down.download = `S1${_arrType == postListarr ? 'reply' : 'ID'}.csv`;
            down.href = arrayToCsv(_localArray);
        }
    }
    /**
     * 同步最新回复数据
     */
    async function syncReplys() {
        let fileName = getFileName("reply");
        let zipName = fileName.replace('txt', 'zip');
        if (!enablejianguoyun) setDownloadButton(postListarr, postArray)
        else {
            let oldFileExisted = await checkExistentFile(zipName);
            !oldFileExisted ? uploadLatestFile(zipName, postArray) : syncSameArray(zipName, postListarr, postArray)
        }
    }
    async function syncIDs(idType) {
        let idArray = idType == 'heavy' ? idArrayHeavy : idArrayNormal;
        let idArrayGMValue = idType == 'heavy' ? heavyIDarr : normalIDarr;
        //console.log(idType,idArrayGMValue);
        let fileName = getFileName(idType + "ID");
        let zipName = fileName.replace('txt', 'zip');
        if (!enablejianguoyun) setDownloadButton(idArrayGMValue, postArray)
        else {
            let oldFileExisted = await checkExistentFile(zipName);
            !oldFileExisted ? uploadLatestFile(zipName, idArray) : syncSameArray(zipName, idArrayGMValue, idArray)
        }
    }
    //导出为csv
    function arrayToCsv(rows) {
        let csvContent = "\ufeff";
        for (let rowArray of rows) csvContent += "\"" + rowArray.join("\",\"") + "\"\r\n";
        let blob = new Blob([csvContent]);
        return URL.createObjectURL(blob);
    }

    async function getReplyHistory(idArray, idType) {
        let stop = false;
        console.log(`开始获取${idType}回复`);
        for await (let arr of idArray) {
            let Interval = 1000;
            let name = arr[0], id = arr[1];
            stop = await getUserReplyHistory(name, id, 1, pageLimit);
            if (stop) break
            else { GM_setValue(postListarr, postArray); await sleep(Interval) }
        }
        if (stop) console.log('出现错误，停止运行');
        else syncReplys();
    }
    function alertDownloadMessage() {
        alert("请点击头像下载回复数据")
    }
    /**
     * 自动运行相关
     */
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    //默认自动运行“获取当前最新回复内容及时间”
    (function ontimeout() {
        let Interval = Math.random() * 20000 + 20000;
        getReplyUser(Math.round(Interval / 1000));
        setTimeout(ontimeout, Interval);
    })();
    //每隔1h上传一次回复数组
    /**/

    setTimeout(alertDownloadMessage, 8 * 1000,);
    setTimeout(syncReplys, 2 * 1000);
    setTimeout(getReplyHistory, 60 * 1000, idArrayHeavy, '重症病人');
    setTimeout(getReplyHistory, 10 * 1000, idArrayNormal, '轻症病人');
    setTimeout(syncIDs, 4 * 1000, 'heavy');
    setTimeout(syncIDs, 6 * 1000, 'normal');
    setInterval(syncReplys, 3600 * 1000);
    setInterval(syncIDs('heavy'), 4 * 3600 * 1000);
    setInterval(syncIDs('normal'), 8 * 3600 * 1000);

    /*测试代码
      */

})();
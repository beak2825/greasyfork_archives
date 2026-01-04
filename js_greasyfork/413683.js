// ==UserScript==
// @name         Fanbox Image Downloader
// @namespace    TypeNANA
// @version      0.5
// @description  Add download button to Fanbox image, and click to download the original image named by format.
// @author       HY
// @match        *.fanbox.cc/*
// @include      *.fanbox.cc/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/413683/Fanbox%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/413683/Fanbox%20Image%20Downloader.meta.js
// ==/UserScript==

(function () {
    /** Edit defaultFileName to change the file name format
     *
     *  <%Userid>  Fanbox user ID.        eg: shiratamaco
     *  <%Postid>  Fanbox post ID.        eg: 1459770
     *  <%Time>    Current timestamp.     eg: 1550557810891
     *  <%PicName> Original pic name.     eg: 6tpWcFZjqFmc1faOs4TraugL
     *  <%PicNo>   Ordinal number of pic. eg: 0
     *
     *  default: "fanbox <%Userid> <%Postid>_p<%PicNo>"
     *    result: "fanbox shiratamaco 1459770_p0.jpg"
     *
     *  example1: "<%Userid> <%Postid> <%PicName>”
     *    result: "shiratamaco 1459770 6tpWcFZjqFmc1faOs4TraugL.jpg"
     *
     *  example2: "<%Postid>_p<%PicNo>”
     *    result: "1459770_p0.jpg"
     */
    let defaultFileName = "fanbox <%Userid> <%Postid>_p<%PicNo>";

    function download(url, name) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            binary: true,
            responseType: "blob",
            onload: function (response) {
                downloadFile(name, response.response)
            },
            onerror: function (e) {
                console.log("failed. cause:", e)
            },
        });
    }

    function downloadFile(fileName, blob) {
        //通过a标签的download属性来下载指定文件名的文件
        let anchor = getDlBtn();
        let src = URL.createObjectURL(blob);
        anchor.download = fileName;
        anchor.href = src;
        anchor.click();
    }

    function getDlBtn() {
        if (document.getElementsByClassName("img-link").length == 0) {
            let btnDownloadImg = document.createElement('A');
            btnDownloadImg.className = 'img-link';
            document.getElementById("root").appendChild(btnDownloadImg);
        }
        return document.getElementsByClassName("img-link")[0];
    }

    function setBtn(v, index) {
        if (v == null || v.length == 0) return;
        let target = v[0];
        if (target == null) return;
        if (target.parentElement.getElementsByClassName("dl_btn_div").length > 0) return;
        if (target.getElementsByTagName("img").length <= 0 && target.getElementsByTagName("img")[0].src == null) return;

        let pageUrl = document.location.href.split("?")[0];
        let picUrl = target.href;

        let dlbtn = document.createElement('DIV');
        target.parentElement.appendChild(dlbtn);
        dlbtn.outerHTML = '<div class="dl_btn_div" style="cursor: pointer;display: table;font-size: 15px;color: white;position: absolute;right: 5px;bottom: 5px;background: #0000007f;height: 30px;width: 30px;border-radius: 15px;text-align: center;"><svg class="icon" style="width: 15px;height: 15px;vertical-align: top;display: inline-block;margin-top: 7px;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3658"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z" p-id="3659"></path></svg></div>';
        dlbtn = target.parentElement.getElementsByClassName("dl_btn_div")[0]

        //获取文件名
        // https://downloads.fanbox.cc/images/post/1459770/6tpWcFZjqFmc1faOs4TraugL.png
        let nameArr = picUrl.split("/");
        let picName = nameArr[nameArr.length - 1];
        let dl_picname = picName.split(".")[0];
        let dl_time = new Date().getTime();

        //获取图片编号
        // https://www.fanbox.cc/@shiratamaco/posts/1459770
        let dl_userid;
        if(pageUrl.includes("@")){
             dl_userid = pageUrl.split("@")[1].split("/")[0];
        }else{
             dl_userid = pageUrl.split("://")[1].split(".")[0];
        }
        let dl_tid = pageUrl.split("/")[pageUrl.split("/").length - 1];
        let dl_picno = index;
        //替换内容，拼接文件名
        let dl_filename = defaultFileName
            .replace("<%Userid>", dl_userid)
            .replace("<%Postid>", dl_tid)
            .replace("<%Time>", dl_time)
            .replace("<%PicName>", dl_picname)
            .replace("<%PicNo>", dl_picno);
        //获取拓展名，推特只存在.jpg和.png格式的图片，故偷个懒不做正则判断
        let dl_ext = picUrl.split(".")[picUrl.split(".").length - 1];

        dlbtn.addEventListener('touchstart', function (e) {
            dlbtn.onclick = function (e) {
                return false;
            }
            return false;
        });
        dlbtn.addEventListener('mousedown', function (e) {
            dlbtn.onclick = function (e) {
                return false;
            }
            return false;
        });
        dlbtn.addEventListener('click', function (e) {
            //调用下载方法
            cancelBubble(e);
            download(picUrl, dl_filename + "." + dl_ext);
            return false;
        });

        return false;
    }

    function findFirstA(node) {
        var tmp = node;
        for (var i = 0; i < 20; i++) {
            tmp = tmp.parentElement
            if (tmp == null) return null;
            if (tmp.nodeName == "a" || tmp.nodeName == "A") {
                return tmp
            }
        }
    }
    function findFirstLi(node) {
        var tmp = node;
        for (var i = 0; i < 20; i++) {
            tmp = tmp.parentElement
            if (tmp == null) return null;
            if (tmp.nodeName == "li" || tmp.nodeName == "LI") {
                return tmp
            }
        }
    }
    function cancelBubble(e) {
        var evt = e ? e : window.event;
        if (evt.stopPropagation) {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }

    function waitForKeyElements(
        selectorTxt,
        actionFunction,
        bWaitOnce
    ) {
        var targetNodes, btargetsFound;

        targetNodes = $(selectorTxt);

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function (i, v) {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    var cancelFound = actionFunction(jThis, i);
                    if (cancelFound) {
                        btargetsFound = false;
                    } else {
                        jThis.data('alreadyFound', true);
                    }
                }
            });
        } else {
            btargetsFound = false;
        }

        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey]
        } else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce
                    );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }

    waitForKeyElements('article a[href^="https://downloads.fanbox.cc/images/post"]', setBtn);
})();
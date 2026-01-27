// ==UserScript==
// @name         TwitterImg Downloader
// @namespace    TypeNANA
// @version      0.18
// @description  Add download button to Twitter image, and click to download the original image named by format.
// @author       HY
// @include      *://twitter.com/*
// @include      *://*.twitter.com/*
// @include      *://x.com/*
// @include      *://*.x.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/377958/TwitterImg%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/377958/TwitterImg%20Downloader.meta.js
// ==/UserScript==

(function () {
    /** Edit defaultFileName to change the file name format
     *
     *  <%Userid>  Twitter user ID.        eg: shiratamacaron
     *  <%Tid>     Tweet ID.              eg: 1095705491429158912
     *  <%Time>    Current timestamp.     eg: 1550557810891
     *  <%PicName> Original pic name.     eg: DzS6RkJUUAA_0LX
     *  <%PicNo>   Ordinal number of pic. eg: 0
     *
     *  default: "<%Userid> <%Tid>_p<%PicNo>"
     *    result: "shiratamacaron 1095705491429158912_p0.jpg"
     *
     *  example1: "<%Userid> <%Tid> <%PicName>”
     *    result: "shiratamacaron 1095705491429158912 DzS6RkJUUAA_0LX.jpg"
     *
     *  example2: "<%Tid>_p<%PicNo>”
     *    result: "1095705491429158912_p0.jpg"
     */
    let defaultFileName = "<%Userid> <%Tid>_p<%PicNo>";


    /** Edit following value to change download shortcut key in gallery mode
     *  KeyCode value can be found at https://keycode.info/
     *
     *  default: shift + s (s->83)
     */
    let shortCut_Shift = true; //true - Yes , false - No
    let shortCut_Ctrl = false;
    let shortCut_Alt = false;
    let shortCut_KeyCode = 83 //KeyCode value

    function download(url, name, view) {
        //通过fetch获取blob
        fetch(url).then(response => {
            if (response.status == 200)
                return response.blob();
            throw new Error(`status: ${response.status}.`)
        }).then(blob => {
            downloadFile(name, blob, view)
        }).catch(error => {
            console.log("failed. cause:", error)
        })
    }

    function downloadFile(fileName, blob, view) {
        //通过a标签的download属性来下载指定文件名的文件
        let anchor = view;
        let src = URL.createObjectURL(blob);
        anchor.download = fileName;
        anchor.href = src;
        view.click();
    }

    const addDownloadButton = function (v) {
        newVer(v);
        return false;
    }

    const setEditMargin = function (v) {
        let classList = v[0].parentElement.parentElement.classList;
        let vClass = "." + classList[0] + " ." + classList[classList.length-1];
        let vCss = vClass + " { margin-right: 35px !important; }";

        const style = document.createElement('style');
        style.textContent = vCss;
        document.head.appendChild(style);
        return false;
    }

    function addDlBtn(){
        let btnDownloadImg;
        if(document.getElementsByClassName("img-link").length==0){
            btnDownloadImg = document.createElement('A');
            btnDownloadImg.className = 'img-link';
            document.getElementById("react-root").appendChild(btnDownloadImg);
        }else{
            btnDownloadImg = document.getElementsByClassName("img-link")[0];
        }
        return btnDownloadImg;
    }

    function newVer(v) {
        if (v == null || v.length == 0) return;
        let target = v[0];
        if (target == null || target.src == null) return;
        if (target.alt == null || target.alt == "") return;
        if (target.parentElement.getAttribute("aria-label") == null || target.parentElement.getAttribute("aria-label") == "") return;
        let dlbtn = document.createElement('DIV');
        target.parentElement.parentElement.appendChild(dlbtn);
        dlbtn.outerHTML = '<div class="dl_btn_div" style="cursor: pointer;z-index: 999;display: table;font-size: 15px;color: white;position: absolute;right: 12px;bottom: 12px;backdrop-filter: blur(4px); background-color: rgba(15, 20, 25, 0.75);height: 32px;width: 32px;border-radius: 16px;text-align: center;"><svg class="icon" style="width: 16px;height: 16px;vertical-align: top;display: inline-block;margin-top: 8px;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3658"><path d="M925.248 356.928l-258.176-258.176a64 64 0 0 0-45.248-18.752H144a64 64 0 0 0-64 64v736a64 64 0 0 0 64 64h736a64 64 0 0 0 64-64V402.176a64 64 0 0 0-18.752-45.248zM288 144h192V256H288V144z m448 736H288V736h448v144z m144 0H800V704a32 32 0 0 0-32-32H256a32 32 0 0 0-32 32v176H144v-736H224V288a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V144h77.824l258.176 258.176V880z" p-id="3659"></path></svg></div>';
        dlbtn = target.parentElement.parentElement.getElementsByClassName("dl_btn_div")[0];

        let btnDownloadImg = addDlBtn();
        let urlregex = /https\:\/\/(twitter|x).com\//;

        if (!document.location.href.includes("photo")) {
            //信息流模式

            let firstA = findFirstA(target);
            //获取文件名
            // https://pbs.twimg.com/media/D_mR-WEUYAAZJVH?format=jpg&amp;name=360x360
            let fooName = target.src.split("?")[0];
            let barName = fooName.split("/");
            let dl_picname = barName[barName.length - 1];
            let dl_time = new Date().getTime();

            //获取图片编号
            // ameto_y/status/1151067160078274561/photo/1
            let array = firstA.href.replace(urlregex, "").split("/");
            let dl_userid = array[0];
            let dl_tid = array[2];
            let dl_picno = array[4];
            //替换内容，拼接文件名
            let dl_filename = defaultFileName
            .replace("<%Userid>", dl_userid)
            .replace("<%Tid>", dl_tid)
            .replace("<%Time>", dl_time)
            .replace("<%PicName>", dl_picname)
            .replace("<%PicNo>", dl_picno - 1);
            //获取拓展名，推特只存在.jpg和.png格式的图片，故偷个懒不做正则判断
            let dl_ext = "jpg";
            if (target.src.includes("format=png")) {
                dl_ext = "png";
            }
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
                download("https://pbs.twimg.com/media/" + dl_picname + "?format=" + dl_ext + "&name=orig", dl_filename + "." + dl_ext, btnDownloadImg);
                return false;
            });
        } else {
            //大图画廊模式

            //获取文件名
            // https://pbs.twimg.com/media/D_mR-WEUYAAZJVH?format=jpg&amp;name=360x360
            let fooName = target.src.split("?")[0];
            let barName = fooName.split("/");
            let dl_picname = barName[barName.length - 1];

            //获取拓展名，推特只存在.jpg和.png格式的图片，故偷个懒不做正则判断
            let dl_ext = "jpg";
            if (target.src.includes("format=png")) {
                dl_ext = "png";
            }
            dlbtn.addEventListener('click', function (e) {
                //调用下载方法
                cancelBubble(e);

                //获取图片编号
                // ameto_y/status/1151067160078274561/photo/1
                let array = document.location.href.replace(urlregex, "").split("/");
                let dl_userid = array[0];
                let dl_tid = array[2];
                let dl_picno = array[4];
                let dl_time = new Date().getTime();
                let dl_filename = defaultFileName
                .replace("<%Userid>", dl_userid)
                .replace("<%Tid>", dl_tid)
                .replace("<%Time>", dl_time)
                .replace("<%PicName>", dl_picname)
                .replace("<%PicNo>", dl_picno - 1);
                download("https://pbs.twimg.com/media/" + dl_picname + "?format=" + dl_ext + "&name=orig", dl_filename + "." + dl_ext, btnDownloadImg);
                return false;
            });
        }
    }

    //画廊模式下的快捷键功能
    function onShortCut() {
        let locationArr = document.location.href.split("/");
        let targetArr = $('ul[role="list"]');

        let imgNo = null;
        let imgArr = null;
        let target = null;
        //判断是否找到了画廊的ul标签
        if (targetArr.length == 0 ) {
            //如果找不到ul标签，并且不是画廊模式（那么网址内没有“photo”）， 则不进行进一步的处理
            if(locationArr.length < 2 || locationArr[locationArr.length - 2] != "photo") return;
            //否则进行搜索单张图画廊的情况
            var arr = $('img[src^="https://pbs.twimg.com/media/');
            for(var i=0;i< arr.length;i++){
                var imgUrl = arr[i].src.split("?")[i]
                //判断是否是推特附带的图片img，并且判断是不是信息流的图片（信息流图片的所有母层中必定带有一个a标签）
                if(arr[i].parentElement.firstElementChild!="" && arr[i].parentElement.firstElementChild.style.backgroundImage.includes(imgUrl) && findFirstA(arr[i])==null){
                    //单图模式的赋值
                    let imgNo = 0;
                    target = arr[i];
                    break;
                }
            }
            //如果找不到任何目标，则不进行进一步的处理
            if(target == null) return;
        } else {
            //多图模式的赋值
            imgNo = locationArr[locationArr.length - 1] - 1;
            imgArr = targetArr[0].getElementsByTagName("img");
            target = imgArr[imgNo];
        }

        //获取文件名
        // https://pbs.twimg.com/media/D_mR-WEUYAAZJVH?format=jpg&amp;name=360x360
        let fooName = target.src.split("?")[0];
        let barName = fooName.split("/");
        let dl_picname = barName[barName.length - 1];

        //获取拓展名，推特只存在.jpg和.png格式的图片，故偷个懒不做正则判断
        let dl_ext = "jpg";
        if (target.src.includes("format=png")) {
            dl_ext = "png";
        }
        //获取图片编号
        // ameto_y/status/1151067160078274561/photo/1
        let urlregex = /https\:\/\/(twitter|x).com\//;
        let array = document.location.href.replace(urlregex, "").split("/");
        let dl_userid = array[0];
        let dl_tid = array[2];
        let dl_picno = array[4];
        let dl_time = new Date().getTime();
        let dl_filename = defaultFileName
        .replace("<%Userid>", dl_userid)
        .replace("<%Tid>", dl_tid)
        .replace("<%Time>", dl_time)
        .replace("<%PicName>", dl_picname)
        .replace("<%PicNo>", dl_picno - 1);

        let btnDownloadImg = addDlBtn();
        download("https://pbs.twimg.com/media/" + dl_picname + "?format=" + dl_ext + "&name=orig", dl_filename + "." + dl_ext, btnDownloadImg);
    }


    waitForKeyElements(
        'img[src^="https://pbs.twimg.com/media/"]',
        addDownloadButton
    );
    waitForKeyElements(
        'a[href^="https://grok.com/imagine?parent_x_post_id=',
        setEditMargin,
        true
    );

    $(document).keyup(function (e) {
        let shiftFlag = true
        let ctrlFlag = true
        let altFlag = true
        if (shortCut_Shift) {
            shiftFlag = e.shiftKey
        }
        if (shortCut_Ctrl) {
            ctrlFlag = e.ctrlKey
        }
        if (shortCut_Alt) {
            altFlag = e.altKey
        }
        if (e.keyCode == shortCut_KeyCode && shiftFlag && ctrlFlag && altFlag) {
            onShortCut()
        }
    })

    function waitForKeyElements(
    selectorTxt,
     actionFunction,
     bWaitOnce,
     iframeSelector
    ) {
        var targetNodes, btargetsFound;

        if (typeof iframeSelector == "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents().find(selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data('alreadyFound') || false;

                if (!alreadyFound) {
                    var cancelFound = actionFunction(jThis);
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
                                       bWaitOnce,
                                       iframeSelector
                                      );
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
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
})();
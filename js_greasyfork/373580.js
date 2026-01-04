// ==UserScript==
// @name       CUBE 修改标签
// @namespace    https://olereo.com
// @version      0.7
// @description  cb change tag
// @author     OLEREO!
// @match      https://global-oss.bigo.tv/cube
// @match      https://global-oss-jf2jja.bigo.tv/cube
// @match      https://manage-oss.bigo.tv/cube/cube-game-change-tag/index
// @downloadURL https://update.greasyfork.org/scripts/373580/CUBE%20%E4%BF%AE%E6%94%B9%E6%A0%87%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/373580/CUBE%20%E4%BF%AE%E6%94%B9%E6%A0%87%E7%AD%BE.meta.js
// ==/UserScript==

let myVersion = GM_info.script.version;
let DEBUG = myVersion === "DEBUG";

let href = document.location.href;

if ((href.search("https://global-oss.bigo.tv/cube") !== -1) ||href.search("https://global-oss-jf2jja.bigo.tv/cube") !== -1) {
    document.body.innerHTML = "";
    document.title = "CUBE 修改标签_" + myVersion;
    const btSetUIDtoChangeTag = document.createElement("input");
    btSetUIDtoChangeTag.setAttribute("type", "button");
    btSetUIDtoChangeTag.setAttribute("value", "传送UID到TAG");

    const btToTop = document.createElement("input");
    btToTop.setAttribute("type", "button");
    btToTop.setAttribute("value", "返回到上面");

    const iFrame_FIRST = document.createElement('iframe');
    let iFrame_Tag = document.createElement('iframe');


    //region FIRST
    let divRenYuan_FIRST = document.createElement("div");
    divRenYuan_FIRST.style.height = "1000px";
    divRenYuan_FIRST.style.backgroundColor = "#F9F9F9";
    document.body.appendChild(divRenYuan_FIRST);

    if(href === "https://global-oss-jf2jja.bigo.tv/cube")
        iFrame_FIRST.src = "https://global-oss-jf2jja.bigo.tv/bigoAudit/live-first/index";
    else
        iFrame_FIRST.src = "https://global-oss.bigo.tv/bigoAudit/live-first/index";

    iFrame_FIRST.style.width = "100%";
    iFrame_FIRST.style.height = "100%";
    divRenYuan_FIRST.appendChild(iFrame_FIRST);

    iFrame_FIRST.onload = function () {
        let breadcrumbs = iFrame_FIRST.contentWindow.document.getElementById("breadcrumbs");
        breadcrumbs.appendChild(btSetUIDtoChangeTag);
        btSetUIDtoChangeTag.onclick = function () {
            if (iFrame_Tag.contentWindow) {
                iFrame_Tag.contentWindow.pushUID(btSetUIDtoChangeTag.getAttribute("value"));
            }
        };

        uidLastTime = document.createElement("b");
        uidLastTime.innerHTML = "上次修改时间";
        uidLastTime.fontSize = "40px";
        breadcrumbs.appendChild(uidLastTime);


      function  keyDownEvent (event){
            if(event.keyCode === 113 || event.keyCode === 81){
                if (iFrame_Tag.contentWindow) {
                    iFrame_Tag.contentWindow.pushUID(btSetUIDtoChangeTag.getAttribute("value"));
                }
            }
        }

        let lastUID = null;
        iFrame_FIRST.contentWindow.onkeydown = keyDownEvent;
        iFrame_FIRST.contentWindow.setInterval(function () {
            let df_Document;
            let detail_iFrame = iFrame_FIRST.contentWindow.document.getElementsByClassName("pic-div record-div choose-record");
            if (detail_iFrame.length === 1) {
                detail_iFrame = detail_iFrame[0];
            } else if (detail_iFrame.length === 2) {
                detail_iFrame = detail_iFrame[1];
            }

            let frames = iFrame_FIRST.contentWindow.frames;
            for (let i = 0; i < frames.length; i++) {
                let inxx = frames[i].name.search(detail_iFrame.id);
                if (inxx !== -1) {
                    df_Document = frames[i].document;
                    frames[i].onkeydown = keyDownEvent;
                }
            }


            if (df_Document) {
                let userInfo = df_Document.getElementsByClassName("info-p2-1");
                for (let i = 0; i < userInfo.length; i++) {
                    let str = userInfo[i].innerText;
                    if (str.startsWith("UID:")) {
                        let uid = str.replace("UID:", "").trim();
                        if(uid !== lastUID) {
                            lastUID = uid;
                            btSetUIDtoChangeTag.setAttribute("value", lastUID);
                            uidLastTime.innerHTML = (iFrame_Tag.contentWindow.getUIDLastTime(lastUID));
                        }
                    }
                }
            }
        }, 200);
    };
    //endregion


    //region Tag
    let divRenYuan_Right = document.createElement("div");
    divRenYuan_Right.style.backgroundColor = "#F9F9F9";
    divRenYuan_Right.style.height = "1200px";
    document.body.appendChild(divRenYuan_Right);

    iFrame_Tag.src = "https://manage-oss.bigo.tv/cube/cube-game-change-tag/index";
    iFrame_Tag.style.width = "100%";
    iFrame_Tag.style.height = "100%";
    divRenYuan_Right.appendChild(iFrame_Tag);
    iFrame_Tag.onload = function () {
        let breadcrumbs = iFrame_Tag.contentWindow.document.getElementById("breadcrumbs");
        breadcrumbs.appendChild(btToTop);
        btToTop.onclick = function () {
            scrollToTop();
        };

        iFrame_Tag.contentWindow.returnResult = function () {
            uidLastTime.innerHTML = "该UID为 Video 标签";
        };

        iFrame_Tag.contentWindow.scrollToTopW = function () {
            if(DEBUG)  console.log("scrollToTopW");
            scrollToTop();
        };

        iFrame_Tag.contentWindow.scrollToEnd = function () {
            let h = $(document).height() - $(window).height() - 500;
            $(document).scrollTop(h);
        }
    };

    function scrollToTop() {
        if(DEBUG)  console.log("scrollToTop");
        $(document).scrollTop(0);
    }

    //endregion
}


else if (href.search("https://manage-oss.bigo.tv/cube/cube-game-change-tag/index") !== -1) {
    let wContent = document.getElementsByClassName("content-wrapper")[0];//
    let wSearch_button = document.getElementById("search-button");

    let wTag = document.getElementById("game");//
    let wSure = document.getElementById("sure");//

    let wUID = document.getElementsByClassName("form-control")[5];
    let lastUID = "";

    let RowsUIDInfo = {
        uid: "",
        tag: ""
    };

    let wBreadcrumb = document.getElementById("breadcrumbs");
    if (DEBUG) {
        let bt = document.createElement("input");
        bt.setAttribute("type", "button");
        bt.setAttribute("value", "TEST");
        bt.onclick = function () {
            pushUID("102080019");
        };
        wBreadcrumb.appendChild(bt);
    }


    pushUID = function (uid) {
        wUID.value = uid;
        wSearch_button.click();
    };


    setInterval(function () {
        if (RowsUIDInfo.uid !== wUID.value && wUID.value !== "") {
            let wUserInfoTable = document.getElementsByClassName("table table-bordered table-hover table-striped")[1];
            let rows = wUserInfoTable.rows;
            if (rows.length > 1) {
                let rowUID = rows[1].cells[0].innerText;
                if (rowUID === wUID.value) {
                    RowsUIDInfo.uid = wUID.value;
                    RowsUIDInfo.tag = rows[1].cells[4].innerText;
                    hUidLastHandleTime.innerHTML = getUIDLastTime(RowsUIDInfo.uid);
                    if (RowsUIDInfo.tag !== "Video") {
                        console.log(RowsUIDInfo.tag);
                        rows[1].cells[8].getElementsByClassName("btn btn-primary")[0].click();
                        setTimeout(function () {
                            let modal_content = document.getElementsByClassName("modal-content");
                            let modal_footer = modal_content[1].getElementsByClassName("modal-footer")[0];
                            let footer_button = modal_footer.getElementsByClassName("btn btn-primary")[0];
                            footer_button.addEventListener("click", addHang);
                            scrollToEnd();
                        }, 100);
                    } else {
                        returnResult();
                    }

                }
            }
        }
    }, 300);


//region 距离最后处理的时间
    let hUidLastHandleTime = document.createElement("h1");
    hUidLastHandleTime.fontSize = "20px";
    wContent.appendChild(hUidLastHandleTime);
//endregion

//region TEST

//endregion

//region 导出 EXCEL
    let ad = document.createElement("a");
    wContent.appendChild(ad);
    let btDownloadExcel = document.createElement("input");
    btDownloadExcel.setAttribute("type", "button");
    btDownloadExcel.setAttribute("value", "导出 EXCEL");
    btDownloadExcel.onclick = function () {
        let html = "<html><head><meta charset='utf-8' /></head><body>" + tbRecordUID.outerHTML + "</body></html>";
        let blob = new Blob([html], {type: "application/vnd.ms-excel"});
        let a = document.getElementsByTagName("a")[0];
        a.href = URL.createObjectURL(blob);
        a.download = "CUBE修改标签UID " + getNowTime() + ".xls";
        a.click();
    };
    wContent.appendChild(btDownloadExcel);
//endregion

//region 清除记录
    let btClearTable = document.createElement("input");
    btClearTable.setAttribute("type", "button");
    btClearTable.setAttribute("value", "清除记录");
    btClearTable.onclick = function () {
        tbRecordUID.innerHTML = "";
        localStorage.clear();
    };
    wContent.appendChild(btClearTable);
//endregion

//region tbRecordUID
    const iDiv = document.createElement('div');
    iDiv.style.height = "500px";
    iDiv.style.width = "480px";
    iDiv.style.overflowY = "scroll";
    wContent.appendChild(iDiv);

    let tbRecordUID = document.createElement("table");
    iDiv.appendChild(tbRecordUID);

    let initRecordUIDTable = function () {
        let loc = localStorage.getItem("tbRecordUID");
        if (loc) {
            tbRecordUID.innerHTML = loc;
        }
    };
    initRecordUIDTable();

//endregion

    function addHang() {
        if(DEBUG) console.log("addHang");
        let uid = wUID.value;
        localStorage.setItem(wUID.value, (new Date()).getTime());
        hUidLastHandleTime.innerHTML = "0";

        let h = document.createElement("tr");
        h.style.border = "1px solid #000";

        let td_Time = document.createElement("td");
        td_Time.innerHTML = getNowTime();
        td_Time.style.border = "1px solid #000";
        h.appendChild(td_Time);

        let td_UID = document.createElement("td");
        td_UID.innerHTML = uid;
        td_UID.style.border = "1px solid #000";
        h.appendChild(td_UID);


        let td_TAG = document.createElement("td");
        td_TAG.innerHTML = RowsUIDInfo.tag;
        td_TAG.style.border = "1px solid #000";
        h.appendChild(td_TAG);
        tbRecordUID.insertBefore(h, tbRecordUID.firstChild);

        localStorage.setItem("tbRecordUID", tbRecordUID.innerHTML);

        scrollToTopW();
    }

    let getNowTime = function () {
        let time = new Date();
        return time.getFullYear() + "-"
            + (time.getMonth() + 1)
            + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    };

    getUIDLastTime = function (uid) {
        let sUID = localStorage.getItem(uid);
        if (sUID) {
            let time = new Date();
            let def = time - parseInt(sUID);
            let min = Math.floor((Math.floor((def / 1000))) / 60);
            console.log(min);
            return min;
        }
        return 0;
    };
}

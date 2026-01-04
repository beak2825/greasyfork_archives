// ==UserScript==
// @name         星火助手
// @namespace    http://www.linkman.info/
// @version      0.1
// @description  try to take over the world!
// @author       Linkman
// @match        https://op.xhwx100.com/new-sale/student-manage/station*
// @match        https://op.xhwx100.com/new-sale/unregistered-student-detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419830/%E6%98%9F%E7%81%AB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/419830/%E6%98%9F%E7%81%AB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    setTimeout(mainFunction, 2000);
    
})();

function mainFunction() {
    let operationBar = document.querySelector(".new-sale-overview-header_search");
    let timeInputDiv = document.createElement("div");
    timeInputDiv.setAttribute("class", "el-input el-input--prefix");
    timeInputDiv.setAttribute("style", "width:220px");
    let timeInput = document.createElement("input");
    timeInput.id = "timeInput";
    timeInput.setAttribute("class", "el-input__inner");
    timeInput.setAttribute("placeholder", "输入间隔时间，默认3秒");
    timeInputDiv.append(timeInput);
    operationBar.append(timeInputDiv);

    let operationBtn = document.createElement("button");
    operationBtn.setAttribute("class", "el-button el-button--primary");
    operationBtn.innerHTML = "获取信息";
    operationBtn.onclick = function (){
        init();
        let time = document.querySelector("#timeInput").value;
        let timeout = time !== "" && time !== null && !isNaN(time) ? time * 1000 : 3000;
        let pageRows = document.querySelectorAll(".el-table__row");
        //setTimeout(function(){getAllInformation(pageRows, 0, timeout)}, timeout);

    };
    operationBar.append(operationBtn);

    let copyBtn = document.createElement("button");
    copyBtn.setAttribute("class", "el-button el-button--primary");
    copyBtn.innerHTML = "复制内容";
    copyBtn.onclick = function (){
        document.addEventListener('copy', handler); // 增加copy监听
        document.execCommand('copy'); // 执行copy命令触发监听
        document.removeEventListener('copy', handler); // 移除copy监听，不产生影响

        alert('当前页数据已复制，请到EXCEL粘贴');
    };
    operationBar.append(copyBtn);

}

function handler(event) {
    let tableBody = document.querySelector(".el-table__body");
    event.clipboardData.setData('text/plain', tableBody.outerHTML);
    event.preventDefault();
}

function init() {
    let css = document.createElement("style");
    css.innerHTML = (".el-table__body, .el-table__footer, .el-table__header {table-layout: auto} .el-table td, .el-table th {width: 180px}");
    document.body.appendChild(css);
    let tableHead = document.querySelector(".has-gutter");
    if(tableHead.firstElementChild.children.length < 11) {
        let th = document.querySelector(".has-gutter").firstElementChild;
        let fatherPhoneColumn = document.createElement("th");
        fatherPhoneColumn.id = "fatherPhoneColumn";
        fatherPhoneColumn.setAttribute("class", "el-table_1_column_8 is-leaf");
        fatherPhoneColumn.innerHTML = "<div class='cell'>父亲电话</div>";
        let matherPhoneColumn = document.createElement("th");
        matherPhoneColumn.setAttribute("class", "el-table_1_column_8 is-leaf");
        matherPhoneColumn.innerHTML = "<div class='cell'>母亲电话</div>";
        th.children[6].after(fatherPhoneColumn);
        th.children[7].after(matherPhoneColumn);
    }

    let pageRows = document.querySelectorAll(".el-table__row");
    console.log(pageRows.length);
    for(let i = 0; i < pageRows.length; i++){
        if (pageRows[i].children.length < 11) {
            let fatherPhoneTD = document.createElement("td");
            fatherPhoneTD.setAttribute("class", "el-table_1_column_6");
            fatherPhoneTD.innerHTML = "<div class='cell'>****</div>";
            let matherPhoneTD = document.createElement("td");
            matherPhoneTD.setAttribute("class", "el-table_1_column_6");
            matherPhoneTD.innerHTML = "<div class='cell'>****</div>";
            pageRows[i].children[6].after(fatherPhoneTD);
            pageRows[i].children[7].after(matherPhoneTD);
           }
    }
}

function getAllInformation(pageRows, index, timeout) {

    let detailLink = pageRows[index].querySelector(".hover-underline").getAttribute("href");
    let currentId = detailLink.substring(detailLink.lastIndexOf("/") + 1, detailLink.length);
    console.log(currentId);
    let href = "https://op.xhwx100.com/gorilla/api/v2.0/unregister/student/phone?student_id=" + currentId;
    let referer = detailLink +"/info";
    let token = localStorage.getItem("token");
    let auth = "gorilla " + token;
    GM_xmlhttpRequest({ //获取列表
        method : "GET",
        headers: {"Accept": "application/json, text/plain, */*",
                  "Authorization": auth,
                  "Referer": referer},
        url : href,
        onload : function (response) {
            console.log(response.responseText);
            let responseJSON = jQuery.parseJSON(response.responseText);
            pageRows[index].children[6].innerHTML = "<div class='cell'>" + responseJSON.account_phone + "</div>";
            pageRows[index].children[7].innerHTML = "<div class='cell'>" + responseJSON.base_father_phone + "</div>";
            pageRows[index].children[8].innerHTML = "<div class='cell'>" + responseJSON.base_mother_phone + "</div>"

            index++;
            //匿名函数封装解决setTimeout传递参数问题
            if(index < pageRows.length) {
                setTimeout(function(){getAllInformation(pageRows, index, timeout);}, timeout);
            }

        }
    });
}


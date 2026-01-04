// ==UserScript==
// @name         OPA - Auto Fill Form
// @version      1.0.3
// @description  One button to auto fill a form.
// @author       Hayao-Gai
// @namespace	 https://github.com/HayaoGai
// @icon         https://i.imgur.com/7JuZ6WA.png
// @match        https://www.o-pa.com.tw/OPACOM/*/work.aspx
// @match        https://www.o-pa.com.tw/OPACOM/*/Work.aspx
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/382387/OPA%20-%20Auto%20Fill%20Form.user.js
// @updateURL https://update.greasyfork.org/scripts/382387/OPA%20-%20Auto%20Fill%20Form.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const svgRemove = `<svg width="20" height="20" viewBox="0 0 128 128"><g transform="translate(0,128) scale(0.1,-0.1)" fill="#f44336"><path d="M555 1270 c-140 -19 -252 -76 -361 -185 -66 -65 -89 -96 -122 -165 -51 -108 -66 -172 -65 -285 2 -254 143 -470 376 -575 86 -38 158 -53 257 -53 292 0 541 191 616 474 22 84 22 234 0 318 -46 174 -177 333 -336 409 -124 58 -243 79 -365 62z m-17 -392 l102 -103 102 103 102 103 69 -69 69 -69 -103 -102 -103 -103 102 -101 103 -101 -69 -68 -68 -69 -102 103 -102 103 -102 -103 -102 -103 -68 68 -68 68 102 103 103 103 -103 101 -103 102 68 68 c37 37 68 68 69 68 0 0 47 -46 102 -102z"/></g></svg>`;

    let status, showCMNon, showCMHave, showModule, showComid, showEduLocal, showAlert;

    window.addEventListener("load", init);

    function init() {
        css();
        getPreset();
        addSwitch();
        addTips();
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML =
            `.preset {
                position: relative;
                top: 8px;
                margin-left: 20px;
                width: 64px;
                font-size: 15px;
                padding: 8.5px 13.5px;
                background-image: url(https://i.imgur.com/bQ8lZz3.jpg);
                cursor: pointer;
                color: white;
            }
            .remove {
                position: absolute;
                z-Index: 1;
                width: 20px;
                height: 20px;
                margin-top: -15px;
                cursor: pointer;
            }
            .hide {
                display: none;
            }
            .prevent {
                position: fixed;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                z-index: 1;
            }
            .new {
                position: absolute;
                margin-top: 5px;
                margin-left: 11px;
                font-size: 15px;
                padding: 8.5px 13.5px;
                background-image: url(https://i.imgur.com/bQ8lZz3.jpg);
                cursor: pointer;
                color: white;
            }
            .input {
                position: absolute;
                height: 28px;
                margin-top: 5px;
                margin-left: 115px;
                font-size: 15px;
                padding-left: 5px;
            }`;
        document.head.appendChild(style);
    }

    function getPreset() {
        for (let i = 0; i < 100; i++) {
            const value = GM_getValue(`cbDeptID${i}`);
            if (!value || value === "undefined") {
                setPreset(i);
                addPreset(i);
                i = 100; //break
            }
        }
    }

    function setPreset(amount) {
        // 網頁外框
        const parent = document.querySelector("#divContent");
        if (!parent) {
            console.log("Error: #divContent cannot be found.");
            return;
        }
        // 今日工作記事
        const today = document.querySelector("#divWorkToday");
        if (!today) {
            console.log("Error: #divWorkToday cannot be found.");
            return;
        }
        // 前 br
        parent.insertBefore(document.createElement("br"), today);
        // 父物件
        const div = document.createElement("div");
        parent.insertBefore(div, today);
        // 按鈕
        for (let i = 0; i < amount; i++) onePreset(div, GM_getValue(`name${i}`), i, amount);
        // 後 br
        parent.insertBefore(document.createElement("br"), today);
    }

    function onePreset(div, name, index, amount) {
        // 預設按鈕
        const preset = document.createElement("span");
        preset.classList.add("preset");
        preset.innerHTML = name;
        preset.addEventListener("click", () => autoFill(index));
        div.appendChild(preset);
        // 移除按鈕
        const remove = document.createElement("img");
        remove.src = "https://i.imgur.com/ogjmVWL.png";
        remove.classList.add("remove", "hide");
        remove.addEventListener("click", () => delPreset(index, amount));
        preset.appendChild(remove);
    }

    function autoFill(index) {
        // 防止重複點按
        preventPanel();
        // 表單 1: 所屬部門
        const list1 = document.querySelector("#ContentPlaceHolder1_cbDeptID");
        list1.value = GM_getValue(`cbDeptID${index}`);
        changeDeptID3(list1.value);
        // 表單 2: 專案類別
        const list2 = document.querySelector("#ContentPlaceHolder1_cbPKID");
        list2.value = GM_getValue(`cbPKID${index}`);
        changePKID3(list2.value);
        // 表單 3: 專案名稱
        const list3 = document.querySelector("#ContentPlaceHolder1_cbPID");
        list3.value = GM_getValue(`cbPID${index}`);
        changePID3(list3.value);
        // 表單 4: Module名稱
        const list4 = document.querySelector("#ContentPlaceHolder1_cbModuleName");
        list4.value = GM_getValue(`cbModuleName${index}`);
        changeModule(list4.value);
        // 表單 5: 製作時程
        document.querySelector("#ContentPlaceHolder1_cbClassName").value = GM_getValue(`cbClassName${index}`);
        // 表單 6: 工時
        document.querySelector("#ContentPlaceHolder1_tbHours").value = "8";
        // 表單 7: 工作內容
        document.querySelector("#ContentPlaceHolder1_tbContent").value = "專案建置";
        saveForm();
        location.reload();
    }

    function delPreset(index, amount) {
        // 防止重複點按
        preventPanel();
        // 移除 preset
        GM_deleteValue(`name${index}`);
        GM_deleteValue(`cbDeptID${index}`);
        GM_deleteValue(`cbPKID${index}`);
        GM_deleteValue(`cbPID${index}`);
        GM_deleteValue(`cbModuleName${index}`);
        for (let i = index + 1; i <= amount; i++) {
            GM_setValue(`name${i - 1}`, GM_getValue(`name${i}`));
            GM_setValue(`cbDeptID${i - 1}`, GM_getValue(`cbDeptID${i}`));
            GM_setValue(`cbPKID${i - 1}`, GM_getValue(`cbPKID${i}`));
            GM_setValue(`cbPID${i - 1}`, GM_getValue(`cbPID${i}`));
            GM_setValue(`cbModuleName${i}`, GM_getValue(`cbModuleName${i}`));
            if (i === amount) {
                GM_deleteValue(`name${i}`);
                GM_deleteValue(`cbDeptID${i}`);
                GM_deleteValue(`cbPKID${i}`);
                GM_deleteValue(`cbPID${i}`);
                GM_deleteValue(`cbModuleName${i}`);
            }
        }
        // 網頁重新整理
        location.reload();
    }

    function preventPanel() {
        const prevent = document.createElement("div");
        prevent.classList.add("prevent");
        document.body.appendChild(prevent);
    }

    function addSwitch() {
        // create
        const outside = document.querySelector("#btnAddWork").parentElement;
        const middle = document.createElement("a");
        middle.style.marginRight = "15px";
        const inside = document.createElement("img");
        inside.src = "https://i.imgur.com/BQzTrYh.png";
        inside.style.cursor = "pointer";
        // append
        middle.appendChild(inside);
        outside.appendChild(middle);
        // listener
        inside.addEventListener("click", () => {
            document.querySelectorAll(".remove").forEach(remove => {
                if (remove.classList.contains("hide")) remove.classList.remove("hide");
                else remove.classList.add("hide");
            });
        });
    }

    function addTips() {
        [...document.querySelectorAll("th")].forEach(th => {
            if (th.innerText === "所屬部門") th.style.color = "rgb(175, 0, 0)";
            if (th.innerText === "專案類別") th.style.color = "rgb(175, 0, 0)";
            if (th.innerText === "專案名稱") th.style.color = "rgb(175, 0, 0)";
            if (th.innerText === "Module名稱") th.style.color = "rgb(175, 0, 0)";
            if (th.innerText === "製作時程") th.style.color = "rgb(175, 0, 0)";
        });
    }

    function addPreset(amount) {
        // 輸入框
        const input = document.createElement("input");
        input.classList.add("input");
        input.type = "text";
        input.placeholder = "-請填寫 Preset 名稱-";
        document.querySelector("#divAddWorkControl").appendChild(input);
        // 按鈕
        const button = document.createElement("span");
        button.classList.add("new");
        button.addEventListener("click", () => recordPreset(amount, input.value));
        document.querySelector("#divAddWorkControl").appendChild(button);
    }

    function recordPreset(amount, name) {
        // 所屬部門
        const cbDeptID = document.querySelector("#ContentPlaceHolder1_cbDeptID").value;
        // 專案類別
        const cbPKID = document.querySelector("#ContentPlaceHolder1_cbPKID").value;
        // 專案名稱
        const cbPID = document.querySelector("#ContentPlaceHolder1_cbPID").value;
        // Module 名稱
        const cbModuleName = document.querySelector("#ContentPlaceHolder1_cbModuleName").value;
        // 製作時程
        const cbClassName = document.querySelector("#ContentPlaceHolder1_cbClassName").value;
        // 確認是否填寫完整
        if (!cbPKID || !cbPID || !cbModuleName || !cbClassName) {
            alert("\n請確認表單是否填寫完整");
            return;
        }
        // 防止重複點按
        preventPanel();
        // 記錄資料至本機
        GM_setValue(`name${amount}`, name);
        GM_setValue(`cbDeptID${amount}`, cbDeptID);
        GM_setValue(`cbPKID${amount}`, cbPKID);
        GM_setValue(`cbPID${amount}`, cbPID);
        GM_setValue(`cbModuleName${amount}`, cbModuleName);
        GM_setValue(`cbClassName${amount}`, cbClassName);
        // 重新整理頁面
        location.reload();
    }



    // 所屬部門
    function changeDeptID3(value) {
//         const cbPKID = document.querySelector("select[id*='cbPKID']").value = "";
//         const cbPID = document.querySelector("select[id*='cbPID']").remove();//專案名稱
//         //document.querySelector("input[id='tbPIDKey']").value = "";
//         const cbModuleName = document.querySelector("select[id*='cbModuleName']").remove();//Module名稱
//         // 請選擇專案
//         const project = document.createElement("option");
//         project.value = "";
//         project.innerText = "-請選擇專案-";
//         cbPID.appendChild(project);
//         // 請選擇Module名稱
//         const module = document.createElement("option");
//         module.value = "";
//         module.innerText = "-請選擇Module名稱-";
//         cbModuleName.appendChild(module);
//         // 工作時數
//         document.querySelector("#fontWorkTime").style.display = "none";
//         // status
//         status = (value === "PD_End" || value === "NP_End" || value === "RD_End") ? 0 : 1;
//         reLoadPage23(status);

        $("select[id*='cbPKID']").val("");
        status = (value === "PD_End" || value === "NP_End" || value === "RD_End") ? 0 : 1;
        $("select[id*='cbPID']").empty();//專案名稱
        $("input[id='tbPIDKey']").val("");
        $("select[id*='cbModuleName']").empty();//Module名稱
        $("select[id*='cbPID']").append("<option value=''>-請選擇專案-</option>");
        $("select[id*='cbModuleName']").append("<option value=''>-請選擇Module名稱-</option>");
        $("#fontWorkTime").css("display", "none");
        reLoadPage23(status);
    }

    // 專案類別
    function changePKID3(value) {
        $("select[id*='cbPID']").empty();//專案名稱
        $("input[id='tbPIDKey']").val("");
        $("#fontWorkTime").css("display", "none");
        $("select[id*='cbModuleName']").empty();//Module名稱
        $("select[id*='cbPID']").append("<option value=''>-請選擇專案-</option>");
        $("select[id*='cbModuleName']").append("<option value=''>-請選擇Module名稱-</option>");
        if (value === "PD_Run" || value === "PD_End" || value === "NP_Run" || value === "NP_End" || value === "PR" || value === "SP" || value === "RD_Run" || value === "RD_End" || value === "PU" || value === "MA_Run" || value === "MA_End") {
            let SPKID;
            if (value === "PD_Run" || value === "PD_End") {
                SPKID = "PD";
            }
            else if (value === "NP_Run" || value === "NP_End") {
                SPKID = "NP";
            }
            else if (value === "RD_Run" || value === "RD_End") {
                SPKID = "RD";
            }
            else if (value === "MA_Run" || value === "MA_End") {
                SPKID = "MA";
            }
            else {
                SPKID = value;
            }
            LoadPID13(SPKID, status, $("select[id*='cbDeptID']").val());
        }
        else {
            LoadPID23($("input[id*='hfJobKind']").val(), value, "", status, $("select[id*='cbDeptID']").val());
        }
        // status
        status = (value === "PD_End" || value === "NP_End" || value === "RD_End" || value === "MA_End" || value === "MA_End") ? 0 : 1;
        reLoadPage23(status);
    }

    // 專案名稱
    function changePID3(value) {
        if ($("select[id*='cbPKID']").val() == "PD_Run" || $("select[id*='cbPKID']").val() == "PD_End" || $("select[id*='cbPKID']").val() == "NP_Run" || $("select[id*='cbPKID']").val() == "NP_End" || $("select[id*='cbPKID']").val() == "PR" || $("select[id*='cbPKID']").val() == "SP" || $("select[id*='cbPKID']").val() == "RD_Run" || $("select[id*='cbPKID']").val() == "RD_End" || $("select[id*='cbPKID']").val() == "PU" || $("select[id*='cbPKID']").val() == "MA_Run" || $("select[id*='cbPKID']").val() == "MA_End") {
            $("select[id*='cbModuleName']").empty();//Module名稱
            $("select[id*='cbModuleName']").append("<option value=''>-請選擇Module名稱-</option>");
            $("select[id*='cbModuleName']").append("<option value='0'>[不需選擇Module]</option>");
            LoadModule3($("select[id*='cbPID']").val());
        }
        else {
            $("select[id*='cbModuleName']").empty();//Module名稱
            $("select[id*='cbModuleName']").append("<option value=''>-請選擇Module名稱-</option>");
        }

        if ($("select[id*='Out']").val() != "Out" && $("select[id*='OutK']").val() != "OutK") {
            $("#trCMNon").css("display", "none");
            showCMNon = false;
            $("#trCMHave").css("display", "none");
            showCMHave = false;
        }

        if (value === "GM0007" || value === "GM0008" || value === "GM0009" || value === "GM0010" || value === "GM0011" || value === "GM0012" || value === "GM0013") {
            if (($("input[id*='hfHumID']").val() === "000182" || $("input[id*='hfHumID']").val() === "000321" || $("input[id*='hfHumID']").val() === "000371") && value === "GM0012") {
                $("#fontWorkTime").css("display", "none");
            }
            else if ($("input[id*='hfHumID']").val() === "000371" && value === "GM0007") {
                $("#fontWorkTime").css("display", "none");
            }
            else if ($("input[id*='hfHumID']").val() === "000274") {
                $("#fontWorkTime").css("display", "none");
            }
            else {
                $("#fontWorkTime").removeAttr("style");
            }
        }
        else {
            $("#fontWorkTime").css("display", "none");
        }
    }

    // Module名稱
    function changeModule(value) {
        if ($("select[id*='Out']").val() !== "Out" && $("select[id*='OutK']").val() !== "OutK") {
            if (value === "0") {
                $("#trCMNon").removeAttr("style");
                showCMNon = true;
                $("#trCMHave").css("display", "none");
                showCMHave = false;
            }
            else {
                $("#trCMNon").css("display", "none");
                $("#trCMHave").removeAttr("style");
                showCMNon = false;
                showCMHave = true;
            }
        }
    }

    function LoadPID13(strSPKID, strStatus, strDeptID) {
        $.ajax({
            type: 'post',
            url: "../NameWebService.asmx/QuaryPID1",
            data: "{'SPKID':'" + strSPKID + "','Status':'" + strStatus + "','DeptID':'" + strDeptID + "','KeyID':'" + $("input[id*='tbPIDKey']").val() + "'}",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (msg) {
                var res;
                if (msg.hasOwnProperty("d")) {
                    res = msg.d;
                }
                else {
                    res = msg;
                }
                var obj = $.parseJSON(msg.d);
                if (obj != null) {
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].Comid != "0") {
                            if (obj[i].B_Name == null) {
                                $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "：" + obj[i].Name + "</option>");
                            }
                            else {
                                $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "： [" + obj[i].B_Name + "]" + obj[i].Name + "</option>");
                            }
                        }
                        else {
                            $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "：" + obj[i].Name + "</option>");
                        }
                    }
                }
            },
            error: function () { console.log("載入專案名稱時發生錯誤，請聯絡管理人員"); }
        })
    }

    function LoadPID23(JobKind, PKID, strSPKID, strStatus, strDeptID) {
        $.ajax({
            type: 'post',
            url: "../NameWebService.asmx/QuaryPID2",
            data: "{'JobKind':'" + JobKind + "','PKID':'" + PKID + "','SPKID':'" + strSPKID + "','Status':'" + strStatus + "','DeptID':'" + strDeptID + "','KeyID':'" + $("input[id*='tbPIDKey']").val() + "'}",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (msg) {
                var res;
                if (msg.hasOwnProperty("d")) {
                    res = msg.d;
                }
                else {
                    res = msg;
                }
                var obj = $.parseJSON(msg.d);

                if (obj != null) {
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i].Comid != "0") {
                            if (obj[i].B_Name == null) {
                                $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "： " + obj[i].Name + "</option>");
                            }
                            else {
                                $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "： [" + obj[i].B_Name + "]" + obj[i].Name + "</option>");
                            }
                        }
                        else {
                            $("select[id*='cbPID']").append("<option value='" + obj[i].PID + "'>" + obj[i].PID + "：" + obj[i].Name + "</option>");
                        }
                    }
                }
            },
            error: function () { console.log("載入專案名稱時發生錯誤，請聯絡管理人員1"); }
        })
    }

    function LoadModule3(PID) {
        $.ajax({
            type: 'post',
            url: "../NameWebService.asmx/QuaryModule",
            data: "{'PID':'" + PID + "'}",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (msg) {
                var res;
                if (msg.hasOwnProperty("d")) {
                    res = msg.d;
                }
                else {
                    res = msg;
                }
                var obj = $.parseJSON(msg.d);

                if (obj != null) {
                    for (var i = 0; i < obj.length; i++) {
                        $("select[id*='cbModuleName']").append("<option value='" + obj[i].ModuleID + "'>" + obj[i].ModuleID + "：" + obj[i].ModuleName + "</option>");
                    }
                }
            },
            error: function () { console.log("載入Module名稱時發生錯誤，請聯絡管理人員"); }
        })
    }

    function rePostion3() {
        var w = $(document).width();;
        var h = $(window).height();
        var top = (h - $('#divAddWork').height()) / 2;
        $('#divAddWork').css({ 'display': 'block', 'top': top.toString() + 'px' });
    }

    function reLoadPage23(status) {
        $("#trModule").css("display", "none");
        $("#trCMNon").css("display", "none");
        $("#trCMHave").css("display", "none");
        $("#trComid").css("display", "none");
        $("#trEduLocal").css("display", "none");
        showModule = false;
        showCMNon = false;
        showCMHave = false;
        showComid = false;
        showEduLocal = false;
        if ($("select[id*='cbPKID']").val() == "PD_Run" || $("select[id*='cbPKID']").val() == "PD_End" || $("select[id*='cbPKID']").val() == "NP_Run" || $("select[id*='cbPKID']").val() == "NP_End" || $("select[id*='cbPKID']").val() == "PR" || $("select[id*='cbPKID']").val() == "SP" || $("select[id*='cbPKID']").val() == "RD_Run" || $("select[id*='cbPKID']").val() == "RD_End" || $("select[id*='cbPKID']").val() == "PU" || $("select[id*='cbPKID']").val() == "MA_Run" || $("select[id*='cbPKID']").val() == "MA_End") {
            //Module名稱
            $("#trModule").removeAttr("style");
            showModule = true;
            if ($("select[id*='Out']").val() == "Out" || $("select[id*='OutK']").val() == "OutK") {
                $("#trCMHave").removeAttr("style");
                $("#trCMNon").css("display", "none");
                showCMHave = true;
                showCMNon = false;
                $("select[id*='cbClassNameNon']").empty();
                $("#trCMHave select[id*='cbClassName']").empty();
                $("#trCMHave select[id*='cbClassName']").append("<option value='9'>專案行政事項</option>");
            }
            else {
                showCMHave = false;
                $("select[id*='cbClassNameNon']").empty();
                $("#trCMHave select[id*='cbClassName']").empty();
                $("#trCMHave select[id*='cbClassName']").append("<option value='3'>大綱</option>");
                $("#trCMHave select[id*='cbClassName']").append("<option value='4'>UI</option>");
                $("#trCMHave select[id*='cbClassName']").append("<option value='5'>Pilot</option>");
                $("#trCMHave select[id*='cbClassName']").append("<option value='6'>定稿</option>");
                $("#trCMHave select[id*='cbClassName']").append("<option value='7'>成品</option>");
                if (status == "0") {
                    $("select[id*='cbClassNameNon']").append("<option value='10'>結案後保固</option>");
                }
                else {
                    $("select[id*='cbClassNameNon']").append("<option value='1'>簽約前企畫/合約</option>");
                    $("select[id*='cbClassNameNon']").append("<option value='2'>簽約前DEMO</option>");
                    $("select[id*='cbClassNameNon']").append("<option value='9'>專案行政事項</option>");
                }
            }
        }
        else if ($("select[id*='cbPKID']").val() == "MK") {
            $("#trComid").removeAttr("style");
            showComid = true;
        }
        else if ($("select[id*='cbPKID']").val() == "ED_Out") {
            $("#trEduLocal").removeAttr("style");
            showEduLocal = true;
        }
        rePostion3();
    }

    function saveForm() {
        let EduLocal = showEduLocal ? $("select[id*='cbEduLocal']").val() : "0";
        let ModuleName = showModule ? $("select[id*='cbModuleName']").val() : "0";
        let ClassName = showCMHave ? $("#trCMHave select[id*='cbClassName']").val() : "0";
        $.ajax({
            type: 'post',
            url: "../NameWebService.asmx/insertWork",
            data: "{'Humid':'" + $("input[id*='hfHumID']").val() + "','MagCheck':'" + $("input[id*='hfMagCheck']").val() + "','DeptID':'" + $("select[id*='cbDeptID']").val() + "','PKID':'" + $("select[id*='cbPKID']").val() + "','Status':'" + status + "','OutSel':'" + $("select[id*='cbOutOutK']").val() + "','PID':'" + $("select[id*='cbPID']").val() + "','ModuleID':'" + ModuleName + "','ClassName':'" + ClassName + "','ClassNameNon':'" + $("select[id*='cbClassNameNon']").val() + "','EduLocal':'" + EduLocal + "','Comid':'" + $("select[id*='cbComid']").val() + "','Wdate':'" + $("select[id*='cbDate']").val() + "','WHours':'" + $("input[id*='tbHours']").val() + "','content':'" + $("textarea[id*='tbContent']").val() + "','OverTimeH':'" + $("select[id*='cbOverTimeH']").val() + "'}",
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: function (msg) {}
        })
    }

})();

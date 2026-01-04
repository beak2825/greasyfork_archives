// ==UserScript==
// @name         dazd_extend
// @namespace    https://yc.dazd.cn/
// @version      2024-9-30-6
// @description  can use for dazd
// @author       dall
// @match        https://*.dazd.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510753/dazd_extend.user.js
// @updateURL https://update.greasyfork.org/scripts/510753/dazd_extend.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setTimeout(init, 1000);
    let use_account;
    let pre_url;
    let data = {
        "total": 3,
        "current": 1,
        "size": 10,
        "sizes": [10, 20, 30, 40, 50, 100, 200, 500],
        "isDesc": true,
        "subSpecialtyIds": null,
        "materialPartIds": null,
        "originalPathologyNumber": null,
        "realname": null,
        "submitDate": null,
        "startSubmitDate": null,
        "endSubmitDate": null,
        "submitFirstDate": null,
        "startSubmitFirstDate": null,
        "endSubmitFirstDate": null,
        "embranchmentId": "",
        "consultationNumber": null,
        "medicalRecordType": 3,
        "checkHospital": null,
        "status": null,
        "expertId": null,
        "diagnoseResult": null,
        "sliceQuality": null,
        "appointmentNumber": null,
        "clinician": null,
        "appointmentTime": null,
        "appointmentStatus": null,
        "startAppointmentTime": null,
        "endAppointmentTime": null,
        "reportStatus": null,
        "appraiseStatus": null,
        "combineStatus": 3
    };

    function init() {
        setInterval(function () {
            use_account = JSON.parse(window.localStorage.account)
            data.embranchmentId = use_account.embranchmentIds[0];
            if (document.URL === pre_url) return;
            if (document.URL.includes("/proposer/case/intraoperative-frozen/appointment/add")) {
                yuyue();
            } else if (document.URL.includes("/proposer/case/intraoperative-frozen/case/add")) {
                new_info();
            }
            pre_url = document.URL;
        }, 1000);


    }

    function yuyue() {
        let parent_tags = document.getElementsByClassName("ml-32px flex items-center");
        if (parent_tags.length < 1) return;
        let parent_tag = parent_tags[0];
        let yuyue_no_tags = parent_tag.getElementsByClassName('n-input__input-el');
        if (yuyue_no_tags.length < 1) return;
        let yuyue_no_tag = yuyue_no_tags[0];


        function last_yuyue_no() {
            let url = "https://yc.dazd.cn/consultation/appointment/appointmentList";
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, false);
            xhr.setRequestHeader("authorization", use_account.token);
            xhr.setRequestHeader("content-type", "application/json");
            data.combineStatus = 1;
            xhr.send(JSON.stringify(data));
            let resp = JSON.parse(xhr.responseText);
            let nos = [];
            for (let i = 0; i < resp.data.records.length; i++) {
                nos.push(resp.data.records[i].appointmentNumber);
            }
            xhr.open("POST", url, false);
            xhr.setRequestHeader("authorization", use_account.token);
            xhr.setRequestHeader("content-type", "application/json");
            data.combineStatus = 2;
            xhr.send(JSON.stringify(data));
            let resp1 = JSON.parse(xhr.responseText);
            for (let i = 0; i < resp1.data.records.length; i++) {
                nos.push(resp1.data.records[i].appointmentNumber);
            }
            let date = new Date();
            let cu_no = `${date.getMonth() + 1}.${date.getDate()}-`;
            console.log(nos);
            for (let i = 1; i < 1000; i++) {
                let cun = cu_no + String(i);
                if (!nos.includes(cun)) return cun;
            }
        }

        yuyue_no_tag.value = last_yuyue_no();
        //触发input事件
        const inputEvent = new Event('input', {bubbles: true});
        yuyue_no_tag.dispatchEvent(inputEvent);

        // 或者触发change事件
        const changeEvent = new Event('change', {bubbles: true});
        yuyue_no_tag.dispatchEvent(changeEvent);
        pre_url = document.URL;
    }


    function new_info() {
        let bili_no_tags = document.getElementsByClassName("<md:ml-15px <md:mt-10px");
        if (bili_no_tags.length < 1) return;
        let bili_no_tag = bili_no_tags[0];
        let input_tags = bili_no_tag.getElementsByClassName('n-input__input-el');
        if (input_tags.length < 1) return;
        let input_tag = input_tags[0];


        function get_last_phy_no() {
            let url = "https://yc.dazd.cn/consultation/medicalRecord/caseList";
            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, false);
            xhr.setRequestHeader("authorization", use_account.token);
            xhr.setRequestHeader("content-type", "application/json");
            data.combineStatus = 1;
            xhr.send(JSON.stringify(data));
            let phy_nums = [];
            for (let i = 0; i < JSON.parse(xhr.responseText).data.records.length; i++) {
                let phy = JSON.parse(xhr.responseText).data.records[i].originalPathologyNumber;
                if (!phy.includes("BYBD")) continue;
                let phy_int = parseInt(phy.replace("BYBD", ""));
                phy_nums.push(phy_int);
            }
            xhr.open("POST", url, false);
            xhr.setRequestHeader("authorization", use_account.token);
            xhr.setRequestHeader("content-type", "application/json");
            data.combineStatus = 2;
            xhr.send(JSON.stringify(data));
            // console.log(JSON.parse(xhr.responseText));
            for (let i = 0; i < JSON.parse(xhr.responseText).data.records.length; i++) {
                let phy = JSON.parse(xhr.responseText).data.records[i].originalPathologyNumber;
                if (!phy.includes("BYBD")) continue;
                let phy_int = parseInt(phy.replace("BYBD", ""));
                phy_nums.push(phy_int);
            }
            xhr.open("POST", url, false);
            xhr.setRequestHeader("authorization", use_account.token);
            xhr.setRequestHeader("content-type", "application/json");
            data.combineStatus = 3;
            xhr.send(JSON.stringify(data));
            console.log(JSON.parse(xhr.responseText));
            for (let i = 0; i < JSON.parse(xhr.responseText).data.records.length; i++) {
                let phy = JSON.parse(xhr.responseText).data.records[i].originalPathologyNumber;
                if (!phy.includes("BYBD")) continue;
                let phy_int = parseInt(phy.replace("BYBD", ""));
                phy_nums.push(phy_int);
            }
            phy_nums.sort();
            console.log(phy_nums);
            return "BYBD" + String(phy_nums[0]);
        }

        let last_phy_no = get_last_phy_no();

        if (input_tag.value === "") {
            input_tag.value = "BYBD" + String(parseInt(last_phy_no.replace("BYBD", "")) + 1);
        }
        //触发input事件
        var inputEvent = new Event('input', {bubbles: true});
        input_tag.dispatchEvent(inputEvent);

        // 或者触发change事件
        var changeEvent = new Event('change', {bubbles: true});
        input_tag.dispatchEvent(changeEvent);

        let last_no_tagt = document.createElement("span");
        last_no_tagt.innerText = "上一个的病理号是：";
        // last_no_tagt.style.setProperty("color", "red");
        last_no_tagt.style.setProperty("font-size", "18px");
        last_no_tagt.style.setProperty("margin-left", "10px");
        bili_no_tag.append(last_no_tagt);

        let last_no_tag = document.createElement("span");
        last_no_tag.innerText = last_phy_no;
        last_no_tag.style.setProperty("color", "red");
        last_no_tag.style.setProperty("font-size", "18px");
        last_no_tag.style.setProperty("margin-left", "10px");
        bili_no_tag.append(last_no_tag);
        setInterval(function () {
            let text_areas_tags = document.getElementsByClassName('n-form-item n-form-item--medium-size n-form-item--top-labelled');
            for (let i = 0; i < text_areas_tags.length; i++) {
                let label_tags = text_areas_tags[i].getElementsByTagName('label');
                if (label_tags.length < 1) continue;
                let label_tag = label_tags[0];
                let label_names = label_tag.getElementsByTagName('span');
                let label_name;
                if (label_names.length >= 2) {
                    label_name = label_names[1]
                } else {
                    label_name = label_names[0]
                }
                if (label_name === null || label_name === undefined) continue;
                if (label_name.innerText === "大体描述") {
                    let ii_tags = text_areas_tags[i].getElementsByClassName('n-input__textarea-el');
                    if (ii_tags.length < 1) continue;
                    let ii_tag = ii_tags[0];
                    console.log(ii_tag.value, label_name.innerText);
                }
                if (label_name.innerText === "离体时间") {
                    let ii_tags = text_areas_tags[i].getElementsByClassName('n-input__input-el');
                    if (ii_tags.length < 1) continue;
                    let ii_tag = ii_tags[0];
                    console.log(ii_tag.value, label_name.innerText);
                }
                if (label_name.innerText === "送检医师") {
                    let ii_tags = text_areas_tags[i].getElementsByClassName('n-input__input-el');
                    if (ii_tags.length < 1) continue;
                    let ii_tag = ii_tags[0];
                    ii_tag.addEventListener("focusin", function () {
                        console.log("in");
                    });
                    ii_tag.addEventListener("focusout", function () {
                        console.log("out");
                    });
                }
            }
        }, 1000);


        pre_url = document.URL;
    }

    // Your code here...
})();
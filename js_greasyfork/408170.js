// ==UserScript==
// @name         Text quality inspection assistant
// @namespace    Text_quality_inspection_assistant
// @homepageURL  https://greasyfork.org/scripts/408170-text-quality-inspection-assistant
// @version      0.2
// @include      https://global-oss*/front_end/*
// @description  Text_quality_inspection_assistant
// @author       zhousanfu
// @copyright    2020-2021 https://sanford.xlog.app
// @downloadURL https://update.greasyfork.org/scripts/408170/Text%20quality%20inspection%20assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/408170/Text%20quality%20inspection%20assistant.meta.js
// ==/UserScript==


window.onload = function(){

    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    function createbutton(){
        var recording2 = "<br><button type='button' id='all_operating' style='background-color:#0C0;border-color: #0C0; margin-left:20px;' class='ant-btn ant-btn-primary'>No violation ALL</button>";
        var buttonRecording2 = document.createElement('div');
        buttonRecording2.innerHTML = recording2;
        buttonRecording2.className = 'right';
        //var form = document.querySelector("#breadcrumbs");
        var form2 = document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.tags-audit-search-wrapper.tags-pic-search.ant-card.ant-card-bordered.ant-card-wider-padding.ant-card-padding-transition > div")
        form2.appendChild(buttonRecording2);
        var re = document.querySelector("#all_operating");
        re.addEventListener("click",function(){
            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > div > input").value == ""){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > div > input").click();
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span")){
                    document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > ul > li:nth-child(1) > div > span").click();
                }
            });

            sleep(500).then(() => {
                document.querySelector("#app > div.layout.ant-layout > div.ant-layout.ant-layout-has-sider > div.ant-layout > div.ant-layout-content > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(1)").click();
            });

        },true);
    }

    var t1 = window.setTimeout(createbutton,800)
}
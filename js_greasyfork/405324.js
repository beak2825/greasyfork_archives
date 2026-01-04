// ==UserScript==
// @name         文字质检小帮手
// @namespace    文字质检小帮手
// @homepageURL  https://greasyfork.org/zh-CN/scripts/402468-文字质检小帮手
// @version      1.0.1
// @include      https://global-oss.zmqdez.com/front_end/*
// @description  文字质检
// @author       周三甫
// @copyright    2020-2021 zhousanfu@hellofun.cn
// @downloadURL https://update.greasyfork.org/scripts/405324/%E6%96%87%E5%AD%97%E8%B4%A8%E6%A3%80%E5%B0%8F%E5%B8%AE%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405324/%E6%96%87%E5%AD%97%E8%B4%A8%E6%A3%80%E5%B0%8F%E5%B8%AE%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    function createbutton(){
        var recording2 = "<br><button type='button' id='all_operating' style='background-color:#0C0;border-color: #0C0; margin-left:20px;' class='ant-btn ant-btn-primary'>一键忽略</button>";
        var buttonRecording2 = document.createElement('div');
        buttonRecording2.innerHTML = recording2;
        buttonRecording2.className = 'right';
        //var form = document.querySelector("#breadcrumbs");
        var form2 = document.querySelector("#app > section > section > section > main > div > div.tags-audit-search-wrapper.tags-pic-search.ant-card.ant-card-bordered");
        form2.appendChild(buttonRecording2);
        var re = document.querySelector("#all_operating");
        re.addEventListener("click",function(){
            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(1) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });



            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(2) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(4) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(5) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(6) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(7) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(8) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(9) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > div > input").click()
                }
            });

            sleep(500).then(() => {
                if(document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > div > input")){
                    document.querySelector("#app > section > section > section > main > div > div.record-table > div > div > div > div > div > div > div > table > tbody > tr:nth-child(10) > td:nth-child(7) > div > ul > li:nth-child(1) > div").click()
                }
            });




            sleep(500).then(() => {
                document.querySelector("#app > section > section > section > main > div > div.record-batch > button").click()
            });


            sleep(2000).then(() => {
                document.querySelector("body > div:nth-child(8) > div > div.ant-modal-wrap > div > div.ant-modal-content > div > div > div.ant-modal-confirm-btns > button.ant-btn.ant-btn-primary").click()
            });
        },true);
    };


    window.onload = function(){
        var t1 = window.setTimeout(createbutton,800)
        document.onkeydown = function(event){
            var e = event||window.e;
            var keyCode = e.keyCode || e.which;
            if(keyCode == 65){
                document.querySelector("#all_operating").click();
            }
        }
    };
})();


// ==UserScript==
// @name         Vehs Results Exporter
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Collects search results from Baidu and exports as Excel
// @author       Your Name
// @match        https://*.122.gov.cn/views/memfyy/vehinfo.html?index=7
// @match        https://*.122.gov.cn/views/memrent/vehlist.html
// @grant        GM_addStyle
// @require      https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/505849/Vehs%20Results%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/505849/Vehs%20Results%20Exporter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const KEY = "asdji^!~jiaiosnd";
    let COOKIE_KEY = "CLICKDAY";
    let DOMAIN = "https://gd.122.gov.cn";
    let API_VEHS = "/user/m/userinfo/vehs";
    let hpzlArr = ["02", "52"];
    let retryTimes = 5;
    let startIndex = 1;
    let endIndex = 9999;
    const API_VEHS_MEMRENT = "/user/m/rentveh/vehlist";
    const API_GETCERT = "/m/electronicCertificate/getCert?lx=1&xh=";
    const API_SURIQUERY = "/user/m/uservio/suriquery";
    const API_SURIQUERY_DETAIL = "/user/m/tsc/vio/querySurvielDetail";

    async function postDataToAPI(apiUrl, formData) {
        for (let i = 0; i < retryTimes; i++) {
            try {
                await randomSleep(10000, 20000);
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData, // 直接使用 FormData 作为请求体
                    credentials: 'include' // 设置 credentials 为 'include' 以携带 cookie
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const responseData = await response.json();
                if (responseData.code != 200) {
                    throw new Error(`HTTP error! Status: ${responseData}`);
                }
                return responseData;
            } catch (error) {
                if (i >= retryTimes) {
                    await randomSleep(10000, 30000);
                    alert("网络请求异常，请稍后再重试！")
                    return null;
                }
            }
        }
    }

    async function getDataFromAPI(apiUrl) {
        for (let i = 0; i < retryTimes; i++) {
            try {
                await randomSleep(10000, 20000);
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    credentials: 'include' // 设置 credentials 为 'include' 以携带 cookie
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                return data;
            } catch (error) {
                if (i >= retryTimes) {
                    await randomSleep(10000, 30000);
                    alert("网络请求异常，请稍后再重试！")
                    return null;
                }
            }
        }
    }

    // console.log(encryptData("记分值"))

    // 加密函数
    function encryptData(data) {
        const secretKey = CryptoJS.enc.Utf8.parse(KEY); // 密钥
        const encrypted = CryptoJS.AES.encrypt(data, secretKey, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        }).toString();
        return encrypted;
    }

    function createVehsFormData(page, hpzl) {
        const formData = new FormData();
        formData.append('page', page);
        formData.append('size', '10');
		formData.append('hpzl', hpzl);
		formData.append('hphm', '');
		formData.append('status', 'null');
        return formData;
    }

    // URL编码
    function encodeUrl(str) {
        return encodeURIComponent(str);
    }

    function createBreakFormData(hphm, page, hpzl) {
        const formData = new FormData();
        formData.append('startDate', formatDateSelf(subtractMonths(new Date(), 12), "yyyyMMdd"));
        formData.append('endDate', formatDateSelf(new Date(), "yyyyMMdd"));
        formData.append('hpzl', hpzl);
		formData.append('hphm', hphm);
		formData.append('page', page);
        formData.append('type', '0');
        return formData;
    }

    function createBreakDetailFormData(hphm, hpzl, xh, cjjg) {
        const formData = new FormData();
        formData.append('hpzl', hpzl);
		formData.append('hphm', hphm);
		formData.append('xh', xh);
        formData.append('cjjg', cjjg);
        return formData;
    }





    function displayButton() {
        COOKIE_KEY = $(".user-center").parent().text();
        const $dataElement = $("#listPart");
        var clickDay = getCookie(encodeUrl(COOKIE_KEY));
        if($dataElement && clickDay && clickDay == formatDate(new Date())){
            $dataElement.prepend('<div class="mem-block"><form class="form-inline">起始页：<input type="text" style="width: 38px;" value="1" id="startIndex" placeholder="请输入起始页" class="input-medium"> 截止页：<input type="text" id="endIndex"  style="width: 38px;margin-right: 10px;" value="9999" placeholder="请输入截止页" class="input-medium"><button class="btn btn-warn" style="background-color: #FF5722;"><i class="icon-download"></i> 今日分析次数已用完</button></form></div>');
        }else if ($dataElement) {
            $dataElement.prepend('<div class="mem-block"><form class="form-inline">起始页：<input type="text" style="width: 38px;" value="1" id="startIndex" placeholder="请输入起始页" class="input-medium"> 截止页：<input type="text" id="endIndex"  style="width: 38px;margin-right: 10px;" value="9999" placeholder="请输入截止页" class="input-medium"><button class="btn btn-danger" style="background-color: #FF5722;" id="downVehicle" ><i class="icon-download"></i> 分析机动车状态</button></form></div>');
        } else {
            console.error('No element with id "data-display" found.');
        }

        let area = $("#district-name").text();
        if(area == '北京' || area == '北京市' ){
            DOMAIN = "https://bj.122.gov.cn";
        } else if(area == '浙江省'){
            DOMAIN = "https://zj.122.gov.cn";
        }else if(area == '广东省'){
            DOMAIN = "https://gd.122.gov.cn";
        }else if(area == '天津'  || area == '天津市' ){
            DOMAIN = "https://tj.122.gov.cn";
        }else if(area == '河北省'){
            DOMAIN = "https://he.122.gov.cn";
        }else if(area == '山西省'){
            DOMAIN = "https://sx.122.gov.cn";
        }else if(area == '内蒙古省'){
            DOMAIN = "https://nm.122.gov.cn";
        }else if(area == '辽宁省'){
            DOMAIN = "https://ln.122.gov.cn";
        }else if(area == '吉林省'){
            DOMAIN = "https://jl.122.gov.cn";
        }else if(area == '黑龙江省'){
            DOMAIN = "https://hl.122.gov.cn";
        }else if(area == '上海'  || area == '上海市' ){
            DOMAIN = "https://sh.122.gov.cn";
        }else if(area == '江苏省'){
            DOMAIN = "https://js.122.gov.cn";
        }else if(area == '安徽省'){
            DOMAIN = "https://ah.122.gov.cn";
        }else if(area == '福建省'){
            DOMAIN = "https://fj.122.gov.cn";
        }else if(area == '江西省'){
            DOMAIN = "https://jx.122.gov.cn";
        }else if(area == '山东省'){
            DOMAIN = "https://sd.122.gov.cn";
        }else if(area == '河南省'){
            DOMAIN = "https://ha.122.gov.cn";
        }else if(area == '湖北省'){
            DOMAIN = "https://hb.122.gov.cn";
        }else if(area == '湖南省'){
            DOMAIN = "https://hn.122.gov.cn";
        }else if(area == '广西壮族自治区' || area == '广西省'){
            DOMAIN = "https://gx.122.gov.cn";
        }else if(area == '海南省'){
            DOMAIN = "https://hi.122.gov.cn";
        }else if(area == '重庆' || area == '重庆市'){
            DOMAIN = "https://cq.122.gov.cn";
        }else if(area == '四川省'){
            DOMAIN = "https://sc.122.gov.cn";
        }else if(area == '贵州省'){
            DOMAIN = "https://gz.122.gov.cn";
        }else if(area == '云南省'){
            DOMAIN = "https://yn.122.gov.cn";
        }else if(area == '西藏省'){
            DOMAIN = "https://xz.122.gov.cn";
        }else if(area == '陕西省'){
            DOMAIN = "https://sn.122.gov.cn";
        }else if(area == '甘肃省'){
            DOMAIN = "https://gs.122.gov.cn";
        }else if(area == '青海省'){
            DOMAIN = "https://qh.122.gov.cn";
        }else if(area == '宁夏省'){
            DOMAIN = "https://nx.122.gov.cn";
        }else if(area == '新疆省'){
            DOMAIN = "https://xj.122.gov.cn";
        }
    }

    function displayButtonOnRental() {
        const $dataElement = $("#exportveh");
        if($dataElement && $dataElement.length>0){
            API_VEHS = DOMAIN+"/user/m/rentveh/vehlist";
            hpzlArr = ["02"];
        }
        var clickDay = getCookie(COOKIE_KEY);
        if($dataElement && clickDay && clickDay == formatDate(new Date())){
            $dataElement.after('<div id="downDiv" style="padding-bottom: 0px;padding-right: 20px;" class="pull-right"><a class="btn btn-success pull-right c3" style="background-image: linear-gradient(to bottom,gray,gray);border: 1px solid gray;background-color: gray;" href="javascript:;"> <i class="icon-download"></i>今日分析次数已用完</a></div>');
        }else if ($dataElement) {
            $dataElement.after('<div id="downDiv" style="padding-bottom: 0px;padding-right: 20px;" class="pull-right"><a class="btn btn-success pull-right c3" style="background-image: linear-gradient(to bottom,#FF5722,#FF5722);border: 1px solid #FF5722;background-color: #FF5722;" id="downVehicle" href="javascript:;"> <i class="icon-download"></i>分析机动车状态</a></div>');
        } else {
            console.error('No element with id "data-display" found.');
        }
    }

    function downVehicle(){
        $("#downVehicle").click(function(){
            startIndex = $("#startIndex").val();
            endIndex = $("#endIndex").val();
            let $this = $(this);
            $this.prop('disabled', true);
            $this.text("数据分析中,请稍后......")
            spiderVehs().then(data =>{
                $("#downDiv").replaceWith('<div id="downDiv" style="padding-bottom: 0px;padding-right: 20px;" class="pull-right"><a class="btn btn-success pull-right c3" style="background-image: linear-gradient(to bottom,gray,gray);border: 1px solid gray;background-color: gray;" href="javascript:;"> <i class="icon-download"></i>今日分析次数已用完</a></div>')
            }).catch(error =>{
                $this.prop('disabled', false);
                $this.attr("style", 'background-image: linear-gradient(to bottom,#FF5722,#FF5722);border: 1px solid #FF5722;background-color: #FF5722;')
                $this.html("<i class=\"icon-download\"></i>分析机动车状态")
            });
        })
    }

    /**
     * 休眠函数，防止执行过快
     * @param ms
     * @returns {Promise<unknown>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function randomSleep(min, max) {
        return new Promise((resolve) => {
            var randomTime = Math.floor(Math.random() * (max - min + 1)) + min;
            setTimeout(resolve, randomTime);
        });
    }

    function formatDateSelf(date, format) {
        const pad = (num, size) => num.toString().padStart(size, '0');
        const day = pad(date.getDate(), 2);
        const month = pad(date.getMonth() + 1, 2); // 月份从0开始，所以加1
        const year = date.getFullYear();
        const hours = pad(date.getHours(), 2);
        const minutes = pad(date.getMinutes(), 2);
        const seconds = pad(date.getSeconds(), 2);

        // 构建日期字符串
        return format
            .replace('yyyy', year)
            .replace('MM', month)
            .replace('dd', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    function subtractMonths(date, months) {
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - months);
        return newDate;
    }
    
    function createExcelFile(data1, data2) {
        const ws1 = XLSX.utils.json_to_sheet(data1);
        const ws2 = XLSX.utils.json_to_sheet(data2);
        ws1['!cols'] = [
            { wch: 30 }, // 第一列宽度为20个字符宽度
            { wch: 30 },
            { wch: 30 },
            { wch: 50 }
        ];

        ws2['!cols'] = [
            { wch: 20 }, // 第一列宽度为20个字符宽度
            { wch: 20 },
            { wch: 40 },
            { wch: 65 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 20 },
            { wch: 50 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'vehs');
        XLSX.utils.book_append_sheet(wb, ws2, 'break');
        // XLSX.utils.book_append_sheet(wb, ws2, '机动车违章信息');

        XLSX.writeFile(wb, formatDate(new Date())+'机动车状态信息.xlsx');
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以加1
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function setCookie(name, value, days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = encodeUrl(name) + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    /**
     * 获取机动车列表信息
     */
    async function spiderVehs(){
        const sheet1Data = [];
        const sheet2Data = [];
        for (let i = 0; i < hpzlArr.length; i++) {
            let hpzl = hpzlArr[i];
            let vehsPage = startIndex;
            let totalPages = 1;
            while (true){
                const data = await postDataToAPI(DOMAIN+API_VEHS, createVehsFormData(vehsPage, hpzl));
                if (!data || data.code != 200) {
                    throw new Error(`HTTP error! Status: ${data}`);
                }

                if (data) {
                    let result = data.data.content;
                    totalPages = data.data.totalPages;
                    if (result.length == 0 || vehsPage > endIndex) {
                        break;
                    }
                    $("#downVehicle").html('<i class=\"icon-download\"></i>分析第'+vehsPage+'页总共'+totalPages+'页');
                    for (let index = 0; index < result.length; index++) {
                        var vehsElement = result[index];
                        let breakPage = 1;
                        while (true){
                            let breakData = await postDataToAPI(DOMAIN+API_SURIQUERY, createBreakFormData(vehsElement.hphm, breakPage, vehsElement.hpzl))
                            if (!breakData.data || !breakData.data.content || breakData.data.content.length == 0) {
                                break;
                            }
                            let breakResult = breakData.data.content;
                            for (let index = 0; index < breakResult.length; index++) {
                                var breakResultElement = breakResult[index];
                                // 需要查询详细信息获取扣分值
                                // console.log("----request detail----"+vehsElement.hphm +"-"+ vehsElement.hpzl +"-"+ breakResultElement.xh +"-"+ breakResultElement.cjjg)
                                let breakDataDetail = await postDataToAPI(DOMAIN+API_SURIQUERY_DETAIL, createBreakDetailFormData(vehsElement.hphm, vehsElement.hpzl, breakResultElement.xh, breakResultElement.cjjg))
                                // console.log(breakDataDetail)
                                if (breakDataDetail.data) {
                                    breakResultElement.wfjfs = breakDataDetail.data.wfjfs
                                }
                                sheet2Data.push(breakResultElement);
                            }

                            // await randomSleep(10000, 15000);
                            if(breakData.data.totalPages == breakPage){
                                break;
                            }
                            breakPage++;
                        }
                        sheet1Data.push(vehsElement);
                    }
                } else {
                    break;
                }

                if (totalPages == vehsPage){
                    break;
                }
                vehsPage++;
                // await randomSleep(5000, 10000);
            }
        }

        let data1 = [];
        for (let index = 0; index < sheet1Data.length; index++) {
            const element = sheet1Data[index];
            data1.push({"RXbv5Dz0l2dVNxWchTQfUQ==": encryptData(element.hphm), "qVOojSv50bNZOeBHecVtPg==": encryptData(element.hpzl), "xvHm4pbKAO0GpLLWj8/BxQ==": encryptData(element.zt), "1WLdT09J2/ASx+/SH3ftatPQhDEy41/jPTfuZ6QEaI0=":encryptData(element.yxqz)});
        }

        let data2 = [];
        for (let index = 0; index < sheet2Data.length; index++) {
            const element = sheet2Data[index];
            // 交款状态 0未交款  1已交款 9无需交款
            // let jkbjStr = element.jkbj == "0"?"未交款":(element.jkbj == "1"?"已交款":(element.jkbj == "9"?"无需交款":""));
            // let clbjStr = element.clbj == "0"?"未处理":(element.clbj == "1"?"已处理":"");
            data2.push({"RXbv5Dz0l2dVNxWchTQfUQ==": encryptData(element.hphm), "b95apzt5yO+e5EsCTN2dQg==": encryptData(element.wfsj), "+Wa6gljDcjYiL8jLVOCmMQ==": encryptData(element.wfdz), "VRcOnwqy1xBOHegTLlgJRQ==": encryptData(element.wfms), "gff3Rolt3CTyCvJbrgydww==": encryptData(element.clbj), "7cZx8saTA2HhVc2UmmVkTQ==": encryptData(element.clsj), "93mJjnE/5UbBOMTFTMG5rI4KyaFGro8kRjpPrqMvNbM=": encryptData(element.fkje), "VnOyKxyKGkVTntKGLcAnwg==":encryptData(element.wfjfs), "toi8XW6fS5GGd6bmwSfr5g==": encryptData(element.jkbj)});
        }

        if(data1.length > 0){
            createExcelFile(data1, data2);
            alert("分析完成，请在浏览器下载列表中查看xls文件！")
            window.location.reload();
            // setCookie(COOKIE_KEY, formatDate(new Date()), 1);
        }
    }

    displayButton();
    displayButtonOnRental();
    downVehicle();
})();
// ==UserScript==
// @name         富阳区家和睦邻平台自动填充脚本测试
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  自动填充脚本测试，高度个性化，请勿直接下载使用!
// @author       zyb
// @match        https://jhml.fuyang.gov.cn/web/grid-preview-detail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fuyang.gov.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466702/%E5%AF%8C%E9%98%B3%E5%8C%BA%E5%AE%B6%E5%92%8C%E7%9D%A6%E9%82%BB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/466702/%E5%AF%8C%E9%98%B3%E5%8C%BA%E5%AE%B6%E5%92%8C%E7%9D%A6%E9%82%BB%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    let search = location.search;

    if (!search) {
        alert("未取到关键数据")
        return;
    }

    createFormPage();

    function getBasicData() {
        let search = location.search;

        if (!search) {
            alert("未取到关键数据")
            return;
        }

        let obj = stringToObject(search.slice(1));

        // 获取部分校验id
        // let formUuid = obj.formUuid;
        // let groupUuid = obj.groupUuid;
        // let jhtiEmixUuid = obj.jhtiEmixUuid;
        // let jhtiRoom = obj.jhtiRoom;
        // let jhtiRoomUuid = obj.jhtiRoomUuid;
        // let modelUuid = obj.modelUuid;
        // let type = obj.type;

        let userOrg = JSON.parse(localStorage.getItem('userOrg'));
        let creatorDetpUuid = userOrg[0].uuid;

        return { ...obj, creatorDetpUuid }
    }

    // 发送ajax数据
    function ajaxFuc(data) {
        return new Promise(function (resolve, reject) {
            // 发送数据
            const xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
            const url = "https://jhml.fuyang.gov.cn/jhml/risen/core/flex/modapp/saveAppModel.do"; // 要访问的URL地址

            xhr.open("POST", url); // 定义请求方法和URL
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded'); // 设置请求头

            // 处理请求响应
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log(xhr.responseText); // 响应内容将会被打印到控制台
                        resolve();
                    }else{
                        reject();
                    }
                }
            }

            // 发送POST请求
            xhr.send(data); // 动态添加请求数据
        })
    }

    // 切割字符串转为对象
    function stringToObject(str) {
        const obj = {};
        const items = str.split('&');
        for (let i = 0; i < items.length; i++) {
            const [key, value] = items[i].split('=');
            obj[key] = value;
        }
        return obj;
    }

    // 创建自定义表单
    function createFormPage(param) {
        const cssStr = `
            #form_custom {
                height:800px;
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                position: absolute;
                right: 0;
                top: 165px;
                overflow: auto;
                display: none;
            }

            #form_custom form {
                width: 400px;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }

            #form_custom label {
                display: block;
                font-weight: bold;
                margin-bottom: 5px;
            }

            #form_custom input[type="text"],
            #form_custom textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            #form_custom_btn,
            #form_custom input[type="button"] {
                background-color: #4caf50;
                color: #fff;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            #form_custom_btn:hover,
            #form_custom input[type="button"]:hover {
                background-color: #45a049;
            }

            #form_custom textarea {
                resize: vertical;
            }

            #form_custom_btn {
                position: absolute;
                right: 0;
                top: 165px;
            }
        `;
        const template = `
            <div id="form_custom">
                <form>
                    <div>
                        <label for="town">乡镇：</label>
                        <input type="text" id="town" name="town" placeholder="默认：灵桥镇">
                    </div>
                    <div>
                        <label for="village">村社：</label>
                        <input type="text" id="village" name="village" placeholder="默认：王家宕村">
                    </div>
                    <div>
                        <label for="company">企业名称：</label>
                        <input type="text" id="company" name="company" placeholder="默认：灵桥安置小区A区块">
                    </div>
                    <div>
                        <label for="address">房屋详细地址：</label>
                        <input type="text" id="address" name="address" placeholder="默认：富阳区灵桥镇老王线中交一公局">
                    </div>
                    <div>
                        <label for="employer">工作单位：</label>
                        <input type="text" id="employer" name="employer" placeholder="默认：中交一局">
                    </div>
                    <div>
                        <label for="employer_address">工作单位地址：</label>
                        <input type="text" id="employer_address" name="employer_address" placeholder="默认：浙江省/杭州市/富阳区/灵桥镇/王家宕村">
                    </div>
                    <div>
                        <label for="province_code">省份编码：</label>
                        <input type="text" id="province_code" name="province_code" placeholder="默认：330000">
                    </div>
                    <div>
                        <label for="emergency_contact">紧急联系人手机号：</label>
                        <input type="text" id="emergency_contact" name="emergency_contact" placeholder="默认：15700027808">
                    </div>
                    <div>
                        <label for="worker_data">工人数据：</label>
                        <textarea id="worker_data" name="worker_data" rows="4" placeholder="默认格式：{数据},{数据}"></textarea>
                    </div>
                    <div>
                        <input id="submitBtn" type="button" value="提交">
                    </div>
                </form>
            </div>
        `

        // 创建一个div元素
        const divElement = document.createElement('div');
        // 创建一个style元素
        const styleElement = document.createElement('style');
        // 创建一个button元素
        const ButtonElement = document.createElement("button");
        ButtonElement.setAttribute("id", "form_custom_btn")

        let isShow = false;

        // 将代码插入到div元素中
        divElement.innerHTML = template;
        // 将css插入到style元素中
        //styleElement.innerHTML = cssStr;
        styleElement.appendChild(document.createTextNode(cssStr))
        // 设置按钮文本为“批量处理”
        ButtonElement.innerHTML = `批量处理`;

        // 将div元素插入到body标签中
        document.body.appendChild(divElement);
        // 将style元素插入到head标签中
        document.head.appendChild(styleElement);
        // 将button元素插入到body标签中
        document.body.appendChild(ButtonElement);
        // 点击按钮展示表单页面
        ButtonElement.onclick = function (e) {


            if (!isShow) {
                document.getElementById("form_custom").style.display = "block";
                isShow = true;
            } else {
                document.getElementById("form_custom").style.display = "none";
                isShow = false;
            }

        }

        document.getElementById('submitBtn').onclick = function (e) {
            // e.defaultPrevented();
            let formDom = document.querySelectorAll('#form_custom form')[0];
            let data = new FormData(formDom);

            let worker_data = data.getAll('worker_data')[0];
            // 去除首尾空格
            worker_data = worker_data.trim();
            // 如果尾部有逗号，删除
            if (worker_data[worker_data.length - 1] === ',') {
                worker_data = worker_data.slice(0, worker_data.length - 1);
            }
            // 如果首尾没有[],添加[]，组成数组
            if (!(worker_data[0] === '[' && worker_data[worker_data.length - 1] === ']')) {
                worker_data = '[' + worker_data + ']';
            }

            sendWorkerDataFuc({
                towName: data.getAll('town')[0],
                villageName: data.getAll('village')[0],
                enterpriseName: data.getAll('company')[0],
                detailAddress: data.getAll('address')[0],
                jhtiWorkDept: data.getAll('employer')[0],
                jhtiWorkAddress: data.getAll('employer_address')[0],
                gzSheng: data.getAll('province_code')[0],
                contactAq: data.getAll('emergency_contact')[0],
                workerDataArr: JSON.parse(worker_data || []),
            });
        }

    }

    // 处理员工数据
    function sendWorkerDataFuc(form_custom_data) {

        // 获取部分校验id
        let { formUuid, groupUuid, jhtiEmixUuid, jhtiRoom, jhtiRoomUuid, modelUuid, type, creatorDetpUuid } = getBasicData();
        let { towName, villageName, enterpriseName, detailAddress, jhtiWorkDept, jhtiWorkAddress, gzSheng, contactAq, workerDataArr } = form_custom_data;
        let ajaxFucArr = [];

        // 遍历数组
        workerDataArr.forEach(function (item) {
            let str = '';
            let obj = {
                towName: towName || "灵桥镇",
                jhtiRoom: jhtiRoom,
                villageName: villageName || "王家宕村",
                jhtiEmixUuid: jhtiEmixUuid,
                enterpriseName: enterpriseName || "灵桥安置小区A区块",
                detailAddress: detailAddress || "富阳区灵桥镇老王线中交一公局",
                jhtiTenantName: item["姓名"],
                jhtiTenantCardNo: item["身份证"],
                jhtiTenantMobile: item["联系方式"],
                jhtiNational: "汉族",
                jhtiPolitical: "群众",
                jhtiEdulevel: item["文化程度"],
                jhtiTenantAddress: item["户籍地址（至少具体到省市）"],
                jhtiWorkDept: jhtiWorkDept || "中交一局",
                jhtiIsHaveWork: "1",
                jhtiVehicle: "",
                jhtiWorkAddress: jhtiWorkAddress || "浙江省/杭州市/富阳区/灵桥镇/王家宕村",
                gzSheng: gzSheng || "330000",
                gzShi: "杭州市",
                gzQu: "富阳区",
                gzXian: "灵桥镇",
                gzChun: "王家宕村",
                jhtiCheckInTime: `${item["入住时间"]} 00:00:00`,
                jhtiDueTime: `${item["到期日期"]} 00:00:00`,
                jhtiSpecialWork: "建筑工地人员",
                jhtiTenantType: "合租",
                jhtiTenantRelationship: "同事",
                jhtiTenantHouseholder: "2",
                jhtiEmergencyContact: contactAq || "15700027808",
                contactAq: contactAq || "15700027808",
                jhtiCurrentHousingType: "常住",
                jhtiRoomUuid: jhtiRoomUuid,
                jhtiRangePlacesResidence: "",
                jhtiOtherResidenceAddress: "",
                zzSheng: "",
                zzShi: "",
                zzQu: "",
                zzXian: "",
                zzChun: "",
                jhtiRoomAq: jhtiRoomUuid,
                jhtiCheckInStatus: "1",
                jhtiIsAgreement: "1",
                jhtiIsVerify: "1",
                "strMap[jhtiText]": "",
                uploadFile_1648712142399: "",
                uploadFileUuids: "",
                uuid: "",
                modelUuid: modelUuid,
                formUuid: formUuid,
                creatorDetpUuid: creatorDetpUuid,
                creatorDetpName: "企业",
                usageScenarios: "pc",
                groupUuid: groupUuid,
            };

            // 拼接参数
            Object.keys(obj).forEach(function (key) {
                str = str + `${key}=${obj[key]}&`
            })

            // 调用接口发送数据
            ajaxFucArr.push(ajaxFuc(str));
        })

        Promise.all(ajaxFucArr).then(function () {
            alert("新增数据成功！")
        })
    }


})();
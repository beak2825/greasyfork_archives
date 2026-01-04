// ==UserScript==
// @name         cpcapi
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      10
// @description  此脚本为简化她的工作流程而设计。
// @author       Zemelee
// @match        https://cpcapi.cbg.cn/newEraPlatform/#/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524088/cpcapi.user.js
// @updateURL https://update.greasyfork.org/scripts/524088/cpcapi.meta.js
// ==/UserScript==


/*
# 专有许可证

版权所有 (C) [2025] Zemelee

本软件受专有许可证保护。未经许可，任何人不得：
- 修改本软件的任何部分。
- 复制、分发或传播本软件。
- 将本软件用于商业用途。

本软件仅供个人查看和学习使用，严禁任何未经授权的行为。

联系信息：
zhengmi0925@gmail.com
*/
(async function () {
    'use strict';
    let mode = localStorage.getItem("mode");
    if (mode == null || mode == void 0) {
        mode = "新增活动模式"; // 默认新增活动模式
    }
    let header = document.querySelector("#app > section > section > header > div.currentBox")
    let modeSelect = document.createElement("select")
    modeSelect.style.marginLeft = "10px"
    let options = [
        { text: "新增活动模式", value: "新增活动模式" },
        { text: "录入人员模式", value: "录入人员模式" },
        { text: "审核模式", value: "审核模式" },
        { text: "补录模式", value: "补录模式" },
        { text: "审核补录", value: "审核补录" },
        { text: "定向录入", value: "定向录入" },
    ];
    options.forEach(function (option) {
        let optionElement = document.createElement("option");
        optionElement.textContent = option.text;
        optionElement.value = option.value;
        if (mode === option.value) { //默认 新增活动模式
            optionElement.selected = true;
        }
        modeSelect.appendChild(optionElement);
    });
    modeSelect.addEventListener('change', function () {
        let selectedMode = modeSelect.value;
        localStorage.setItem("mode", selectedMode);
        setTimeout(location.reload(), 1000)
    });
    header.appendChild(modeSelect)


    console.log("mode1:", mode)
    console.log("mode2:", location.href.includes("volunteerActivityUserList"))
    //新增活动模式
    if (mode == "新增活动模式" && window.location.href.includes("volunteerActivityList")) {
        const styles = {
            newDiv: {
                // border: "1px solid red",
                width: "47%",
                height: "auto",
                padding: "0 10px",
                margin: "10px",
                backgroundColor: "white"
            },
            input: {
                width: "300px"
            },
            dateSelect: { //日期选择
                width: "150px",
                margin: "10px"
            },
            serviceSelect: { //服务方向选择
                width: "100px"
            },
            submitButton: {
                className: "btn searchBtn",
                background: "#18b4a3",
                border: "0px",
                color: "#fff",
                cursor: "pointer",
                width: ".4583rem",
                height: ".1667rem",
                marginLeft: "15px"
            }
        };
        function createStyledElement(tagName, styles) {
            const element = document.createElement(tagName);
            Object.assign(element.style, styles); // 将 styles 对象中的属性和值复制到 element.style 对象
            return element;
        }
        const ActivityForm = document.querySelector("#app > section > section > main > div > div.navSelect");
        const newDiv = createStyledElement("div", styles.newDiv);
        // 创建表单元素
        const form = document.createElement("form");
        // 活动名称输入框
        const activityTitleInput = createStyledElement("input", styles.input);
        activityTitleInput.type = "text";
        activityTitleInput.value = "建工村社区开展";
        activityTitleInput.className = "el-input__inner"
        activityTitleInput.name = "activityTitle";
        activityTitleInput.placeholder = "活动名称";
        form.appendChild(activityTitleInput);
        // 活动时间选择器
        let now = new Date();
        const activityStartTimeSelect = createStyledElement("select", styles.dateSelect);
        activityStartTimeSelect.className = "el-input__inner"
        activityStartTimeSelect.name = "activityStartTime";
        activityStartTimeSelect.placeholder = "活动开始时间";
        // 生成当前日期及其前30天的10:00和14:00选项
        for (let i = 0; i <= 30; i++) {
            const date = new Date(now);
            date.setDate(now.getDate() - i);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            const option1 = document.createElement("option");
            option1.value = `${dateStr} 10:00`;
            option1.textContent = `${dateStr} 10:00`;
            const option2 = document.createElement("option");
            option2.value = `${dateStr} 14:00`;
            option2.textContent = `${dateStr} 14:00`;
            activityStartTimeSelect.appendChild(option1);
            activityStartTimeSelect.appendChild(option2);
        }
        form.appendChild(activityStartTimeSelect);
        // 服务方向
        const activities = [
            { value: '0689501c809041dbb937771e90140f48', textContent: '理论宣讲' },
            { value: '1747b3642cea45caa28ef38da41e70de', textContent: '理论宣传' },
            { value: '9da78dfafb934cdeab788e5f83b6da43', textContent: '乡村振兴' },
            { value: '8c0bcd11a9c54ac88c714d4d417b5beb', textContent: '亲子互动' },
            { value: '7bd3b95bdcd24f34aaacb7e556a37c7b', textContent: '劳动实践' },
            { value: '4a233184bb8949329d2eac3a8c62aad5', textContent: '红色研学' },
            { value: '0cbf4b4397154c6ab34d400739d49437', textContent: '理论学习' },
            { value: 'jiaoyupeixun', textContent: '教育培训' },
            { value: 'huodongceihua', textContent: '活动策划' },
            { value: 'wenhuayishu', textContent: '文化艺术' },
            { value: 'shengtaihuanbao', textContent: '生态环保' },
            { value: 'shequfuwu', textContent: '社区服务' }
        ];
        const serviceContentSelect = createStyledElement("select", styles.serviceSelect);
        serviceContentSelect.className = "el-input__inner"
        serviceContentSelect.name = "serviceContent";
        activities.forEach(activity => {
            const option = document.createElement("option");
            option.value = activity.value;
            option.textContent = activity.textContent;
            serviceContentSelect.appendChild(option);
        });
        form.appendChild(serviceContentSelect);
        // 提交按钮
        const submitButton = createStyledElement("button", styles.submitButton);
        submitButton.type = "submit";
        submitButton.textContent = "提交";
        form.appendChild(submitButton);
        newDiv.appendChild(form);
        ActivityForm.appendChild(newDiv);

        // 监听表单提交事件
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (activityTitleInput.value.length <= 7) {
                showMessage("活动名称太短啦~")
                return
            }
            let activityStartTime = activityStartTimeSelect.value;//2024-06-16 10:00
            let activityEndTime = formatTime(activityStartTime, 0, 1);
            const formData = {
                activityTitle: activityTitleInput.value,
                recruitStartTime: getRecruitTime(activityStartTime, 1),
                recruitEndTime: getRecruitTime(activityStartTime, 0),
                activityStartTime: activityStartTime,
                activityEndTime: activityEndTime,
                serviceContent: serviceContentSelect.value,
            };
            // 合并 formData 到 ReqBody
            const ReqBody = {
                ...formData,
                "activityProfile": formData.activityTitle,
                "contactPhone": "65126464",
                "publishOrganization": "c108032b4bf5467a86b7b1ac3ce2ff21",
                "requireUserCount": "40",
                "activityIntegral": "5",
                "activityRequire": "",
                "activityGuarantee": "",
                "activityPicture": "",
                "publishOrganizationType": 20,
                "activityAddress": "重庆市沙坪坝区重庆大学(B区)",
                "joinDistance": 5000,
                "mapCoordinate": "106.468165,29.573403",
                "serviceType": "",
                "status": 10
            };


            // 发送 fetch 请求
            fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivity/add?_t=1719644928", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "usertoken": localStorage.getItem("TOKEN"),
                },
                body: JSON.stringify(ReqBody),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.msg == "成功") {
                        showMessage("提交成功")
                        activityTitleInput.value = ""
                    } else {
                        showMessage("提交失败")
                    }
                })
                .catch(error => {
                    showMessage("提交失败")
                });
        });

    }
    //录入人员模式
    if (mode == "录入人员模式" && window.location.href.includes("volunteerActivityList")) {
        const activitiesContainer = document.createElement("div");
        activitiesContainer.style.margin = "5px";
        activitiesContainer.style.fontSize = "20px";
        activitiesContainer.style.overflowY = "auto";
        activitiesContainer.style.maxHeight = "150px";
        // 请求志愿者未满的活动，并生成多选列表
        let allActivities = await getActivities();  //包含title、code
        allActivities.forEach(activity => {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `activity_${activity.id}`;
            checkbox.value = activity.activityCode;
            // checkbox.setAttribute('registUserCount', activity.registUserCount);
            // checkbox.setAttribute('requireUserCount', activity.requireUserCount);
            const label = document.createElement('label');
            label.textContent = activity.activityTitle;
            activitiesContainer.appendChild(checkbox);
            activitiesContainer.appendChild(label);
            activitiesContainer.appendChild(document.createElement('br')); // 换行
        });
        // 提交按钮/提示按钮
        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.style.height = ".1067rem"
        submitButton.style.background = "#18b4a3"
        submitButton.style.border = "0px"
        submitButton.style.color = "#fff"
        submitButton.style.marginLeft = "15px";
        if (allActivities.length > 0) {
            submitButton.style.width = ".4083rem"
            submitButton.style.cursor = "pointer"
            submitButton.textContent = "提交";
            let allVoluntees = await getAllVoluntees(); //请求所有志愿者信息
            submitButton.addEventListener('click', async () => {
                const selectedItems = [];
                // 收集选中的活动代码
                allActivities.forEach(activity => {
                    const checkbox = document.getElementById(`activity_${activity.id}`);
                    if (checkbox.checked) {
                        selectedItems.push({ "code": activity.activityCode, "need": activity.requireUserCount - activity.registUserCount });
                    }
                });
                selectedItems.forEach(selectedItem => {
                    addVoluntees(selectedItem.code, r40tees(allVoluntees, selectedItem.need)) //每个活动的需要不同的40志愿者
                })
            });
        } else {
            submitButton.style.width = ".6083rem"
            submitButton.textContent = "暂无活动可补录";
        }
        activitiesContainer.appendChild(submitButton)
        const footer = document.querySelector("#app > section > section > main > div > div.pageList")
        footer.style.height = "200px"
        footer.appendChild(activitiesContainer)
    }


    if (mode == "审核模式" && window.location.href.includes("volunteerActivityUserList")) {

        let navBar = document.querySelector(".volunteerList>.navBar")
        let allSelect = document.querySelector("table>thead>tr>th>div>label")
        let batchPass = document.querySelector(".volunteerList>.navBar>div>div:nth-child(1)")
        let batchRefuse = document.querySelector(".volunteerList>.navBar>div>div:nth-child(2)")
        // let confirmBtn = document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary")
        let startDiv = document.createElement("button")
        startDiv.className = "itemBtn icon"
        startDiv.style.height = ".3067rem"
        startDiv.style.background = "#18b4a3"
        startDiv.style.color = "#fff"
        startDiv.textContent = "开始审核"
        startDiv.addEventListener("click", function () {
            setTimeout(async () => {
                for (let i = 0; i < 120; i++) {
                    try {
                        await allSelect.click();
                        await new Promise(resolve => setTimeout(resolve, 600));
                        await batchPass.click();
                        // await batchRefuse.click();
                        await new Promise(resolve => setTimeout(resolve, 600));
                        let allButtons = document.querySelectorAll('button');
                        let confirmBtn = Array.from(allButtons).find(btn => btn.textContent.trim() === '确定');
                        confirmBtn.click();
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    } catch (err) {
                        console.error(`第 ${i + 1} 次审核成员时出错:`, err);

                    }
                }
            }, 100)
        })
        navBar.appendChild(startDiv)

    }
    if (mode == "补录模式" && window.location.href.includes("volunteerActivityList")) {
        let supplementalBtn = document.createElement("button")
        supplementalBtn.textContent = "一键补录"
        supplementalBtn.type = "submit"
        supplementalBtn.classList.add("item", "btn")
        // 将样式属性应用到按钮上
        supplementalBtn.style.background = "#18b4a3";
        supplementalBtn.style.border = "0px";
        supplementalBtn.style.color = "#fff";
        supplementalBtn.style.cursor = "pointer";
        supplementalBtn.style.width = ".4583rem";
        supplementalBtn.style.height = ".1667rem";
        supplementalBtn.style.marginLeft = "15px";

        supplementalBtn.addEventListener("click", function () {
            lastStep()
        })
        document.querySelector("#app>section>section>main>div>div.navSelect").appendChild(supplementalBtn)
    }

    if (mode == "审核补录" && window.location.href.includes("activityPunchTheClock")) {
        let navBar = document.querySelector("div.navBar >div.itemList")
        let allSelect = document.querySelector(".volunteerForm table>thead>tr>th>div>label");
        let batchPass = document.querySelector("div.itemList>div:nth-child(2)");
        let startDiv = document.createElement("button")

        startDiv.className = "itemBtn icon"
        let styleText = `
            font-weight: 400;
            text-align: left;
            font-size: 12px;
            font-family: Avenir, Helvetica, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            -webkit-box-orient: horizontal;
            -webkit-box-direction: normal;
            flex-direction: row;
            height: 0.2083rem;
            width: 0.5208rem;
            display: flex;
            -webkit-box-align: center;
            align-items: center;
            -webkit-box-pack: center;
            justify-content: center;
            color: rgb(255, 255, 255);
            background-color: rgb(24, 180, 163);
            margin-left: 10px;
            `;
        startDiv.style.cssText = styleText;


        startDiv.textContent = "开始审核"
        startDiv.addEventListener("click", function () {
            setTimeout(async () => {
                for (let i = 0; i < 120; i++) {
                    try {
                        await allSelect.click();
                        await new Promise(resolve => setTimeout(resolve, 600));
                        await batchPass.click();
                        // await batchRefuse.click();
                        await new Promise(resolve => setTimeout(resolve, 600));
                        let allButtons = document.querySelectorAll('button');
                        let confirmBtn = Array.from(allButtons).find(btn => btn.textContent.trim() === '确定');
                        confirmBtn.click();
                        await new Promise(resolve => setTimeout(resolve, 2500));
                    } catch (err) {
                        console.error(`第 ${i + 1} 次审核成员时出错:`, err);
                    }
                }
            }, 100)
        })
        navBar.appendChild(startDiv)

    }

    if (mode === "定向补录") {
        // 创建控制面板
        createControlPanel();

        function createControlPanel() {
            // 主容器
            const panel = document.createElement('div');
            panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 350px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            padding: 15px;
            font-family: Arial, sans-serif;
        `;

            // 标题
            const title = document.createElement('h3');
            title.textContent = '志愿者批量添加工具';
            title.style.cssText = 'margin-top: 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;';
            panel.appendChild(title);

            // 姓名输入区域
            const namesLabel = document.createElement('label');
            namesLabel.textContent = '志愿者姓名列表（每行一个）';
            namesLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
            panel.appendChild(namesLabel);

            const namesTextarea = document.createElement('textarea');
            namesTextarea.id = 'volunteerNames';
            namesTextarea.style.cssText = 'width: 100%; height: 120px; margin-bottom: 15px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;';
            panel.appendChild(namesTextarea);

            // 活动代码输入
            const activityLabel = document.createElement('label');
            activityLabel.textContent = '活动代码';
            activityLabel.style.cssText = 'display: block; margin-bottom: 5px; font-weight: bold;';
            panel.appendChild(activityLabel);

            const activityInput = document.createElement('input');
            activityInput.id = 'activityCode';
            activityInput.type = 'text';
            activityInput.style.cssText = 'width: 100%; margin-bottom: 15px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;';
            panel.appendChild(activityInput);

            // 状态显示区域
            const statusDiv = document.createElement('div');
            statusDiv.id = 'statusDisplay';
            statusDiv.style.cssText = 'margin: 10px 0; min-height: 30px; color: #666;';
            panel.appendChild(statusDiv);

            // 按钮区域
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = 'display: flex; gap: 10px;';

            const startButton = document.createElement('button');
            startButton.textContent = '开始处理';
            startButton.style.cssText = 'flex: 1; padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;';
            startButton.addEventListener('click', processVolunteers);
            buttonContainer.appendChild(startButton);

            const closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.cssText = 'flex: 0 0 60px; padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;';
            closeButton.addEventListener('click', () => panel.remove());
            buttonContainer.appendChild(closeButton);

            panel.appendChild(buttonContainer);

            // 添加到页面
            document.body.appendChild(panel);
        }

        async function processVolunteers() {
            const namesText = document.getElementById('volunteerNames').value.trim();
            const activityCode = document.getElementById('activityCode').value.trim();
            const statusDisplay = document.getElementById('statusDisplay');

            // 验证输入
            if (!namesText) {
                showMessage('请输入志愿者姓名列表');
                return;
            }

            if (!activityCode) {
                showMessage('请输入活动代码');
                return;
            }

            const namesToSearch = namesText.split('\n').map(name => name.trim()).filter(name => name);

            if (namesToSearch.length === 0) {
                showMessage('没有有效的志愿者姓名');
                return;
            }

            // 更新状态
            statusDisplay.innerHTML = `准备处理 <strong>${namesToSearch.length}</strong> 名志愿者...`;

            // 固定参数
            const areaCode = "49bc0e0716b54a60b693e790b56c472b";
            const captchaToken = "";
            const userToken = "";

            // 基础URL
            const baseUrl = "https://cpcapi.cbg.cn/manageapi";

            // 生成时间戳参数
            function getTimestampParam() {
                return `_t=${Math.floor(Date.now() / 1000)}`;
            }

            // 搜索志愿者
            async function searchVolunteer(name) {
                updateStatus(`正在搜索: ${name}`);

                const url = `${baseUrl}/volunteerUser/all?${getTimestampParam()}&name=${encodeURIComponent(name)}&status=20&areaCode=${areaCode}`;

                try {
                    const response = await fetch(url, {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                            "cache-control": "no-cache",
                            "captchatoken": captchaToken,
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Linux\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "usertoken": userToken
                        },
                        referrer: "https://cpcapi.cbg.cn/newEraPlatform/",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: null,
                        method: "GET",
                        mode: "cors",
                        credentials: "omit"
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.code === 1000 && data.data && data.data.length > 0) {
                        return data.data[0];
                    }

                    showMessage(`未找到名为 ${name} 的志愿者`);
                    return null;
                } catch (error) {
                    console.error(`搜索志愿者 ${name} 时出错:`, error);
                    showMessage(`搜索志愿者 ${name} 时出错: ${error.message}`);
                    return null;
                }
            }

            // 批量添加志愿者到活动
            async function batchAddVolunteers(volunteerCodes) {
                updateStatus(`准备添加 ${volunteerCodes.length} 名志愿者到活动`);

                const url = `${baseUrl}/volunteerActivityUser/batchAdd?${getTimestampParam()}`;

                try {
                    const response = await fetch(url, {
                        headers: {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                            "cache-control": "no-cache",
                            "captchatoken": captchaToken,
                            "content-type": "application/json",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Microsoft Edge\";v=\"138\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Linux\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin",
                            "usertoken": userToken
                        },
                        referrer: "https://cpcapi.cbg.cn/newEraPlatform/",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        body: JSON.stringify({
                            "activityCode": activityCode,
                            "volunteerUsers": volunteerCodes
                        }),
                        method: "POST",
                        mode: "cors",
                        credentials: "omit"
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    if (data.code === 1000) {
                        showMessage(`成功添加 ${volunteerCodes.length} 名志愿者到活动`);
                        return data;
                    } else {
                        showMessage(`添加志愿者失败: ${data.msg}`);
                        return null;
                    }
                } catch (error) {
                    console.error("批量添加志愿者时出错:", error);
                    showMessage(`批量添加志愿者时出错: ${error.message}`);
                    return null;
                }
            }

            function updateStatus(message) {
                statusDisplay.innerHTML += `<div>${message}</div>`;
                // 滚动到底部
                statusDisplay.scrollTop = statusDisplay.scrollHeight;
            }

            // 主处理逻辑
            const validVolunteers = [];

            // 逐个搜索志愿者
            for (const name of namesToSearch) {
                const volunteer = await searchVolunteer(name);
                if (volunteer) {
                    updateStatus(`找到志愿者: ${volunteer.name}, 志愿者编号: ${volunteer.volunteerCode}`);
                    validVolunteers.push(volunteer);
                }
            }

            if (validVolunteers.length > 0) {
                // 提取志愿者编号
                const volunteerCodes = validVolunteers.map(v => v.volunteerCode);

                // 批量添加到活动
                await batchAddVolunteers(volunteerCodes);
            } else {
                showMessage("没有找到任何有效的志愿者");
            }
        }

    }

    function waitSeconds(sec = 3) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, sec * 1000);
        });
    }

    // 请求某一活动需要补录的人员信息
    async function getSupplemental(actvtCode) {
        const volunteerCodeParams = {
            _t: Date.now().toString().substring(0, 10),
            activityCode: actvtCode,
            status: 20
        }
        const urlParams = new URLSearchParams(volunteerCodeParams).toString()
        const response = await fetch(`https://cpcapi.cbg.cn/manageapi/volunteerActivityUser/all?${urlParams}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        let volunteers;
        if (res.code === 1000) {
            volunteers = res.data.map(item => item.volunteerUser)
        } else {
            showMessage("获取志愿者信息失败!")
        }
        return volunteers
    }

    // 请求活动时间信息
    // 返回活动的招募、开始的开始结束时间和活动id
    async function getActivityInfo(actvtCode) {
        const p = {
            _t: Date.now().toString().substring(0, 10),
            activityCode: actvtCode,
            activityStatus: 50,
        }
        let urlp = new URLSearchParams(p).toString()
        const response = await fetch(`https://cpcapi.cbg.cn/manageapi/volunteerActivity/all?${urlp}`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.code == 1000) {
            return {
                recruitStartTime: res.data[0].recruitStartTime,
                recruitEndTime: res.data[0].recruitEndTime,
                activityStartTime: res.data[0].activityStartTime,
                activityEndTime: res.data[0].activityEndTime,
                activityCode: res.data[0].activityCode
            };
        } else {
            showMessage("请求活动信息失败")
            console.log("请求活动信息失败:", res)
        }
    }
    // 发送补录请求
    async function postSupplemental(actvtCode) {
        // 包含活动时间信息
        let actvtInfo = await getActivityInfo(actvtCode)
        await waitSeconds(3)
        // 包含这个活动的录入志愿者列表
        let vluntrInfo = await getSupplemental(actvtCode)
        const pa = {
            "activityCode": actvtCode,
            "areaCode": "24e61de1dd254f6f821a0cc2217caa4a",
            "integral": 10,
            "joinActivityTime": actvtInfo.recruitStartTime,
            "punchStartTime": actvtInfo.activityStartTime,
            "punchEndTime": actvtInfo.activityEndTime,
            "punchTimeLength": 7200,
            "volunteerUserCode": vluntrInfo
        }
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivitySup/add?_t=1737863006", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6,zh-TW;q=0.5",
                "cache-control": "no-cache",
                "content-type": "application/json",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\", \"Microsoft Edge\";v=\"132\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(pa),
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.code == 1000) {
            showMessage("补录成功")
        } else {
            showMessage("补录失败")
            console.log("补录失败", res)
        }
    }

    // 最后一步！批量补录某些活动的志愿者时长
    // async function lastStep() {
    //     // 已经录入完成的活动
    //     // enter=1：获取已经录入完成的活动
    //     let activities = await getActivities(1, 1, 5)
    //     try {
    //         let results = await Promise.all(activities.map(item => postSupplemental(item.activityCode)));
    //         console.log('所有补录请求结束', results);
    //     } catch (error) {
    //         console.error('补录请求过程中发生错误', error);
    //     }
    // }
    // 最后一步！批量补录某些活动的志愿者时长
    async function lastStep() {
        const totalActivities = 30; // 总共需要处理的活动数量
        const pageSize = 5; // 每页大小
        const totalPages = Math.ceil(totalActivities / pageSize); // 计算总页数
        for (let page = 1; page <= totalPages; page++) {
            try {
                let activities = await getActivities(1, page, pageSize);
                if (activities.length === 0) {
                    showMessage(`第 ${page} 页没有更多活动，提前结束`);
                    break;
                }
                let results = await Promise.all(activities.map(item => postSupplemental(item.activityCode)));
                showMessage(`第 ${page} 页补录请求结束`);
                console.log(results)
            } catch (error) {
                showMessage(`第 ${page} 页补录请求过程中发生错误`);
            }
            await waitSeconds(4)
        }
    }



    //请求活动信息：获取录入人员未满的活动code
    async function getActivities(enter = 0, pn = 1, ps = 30) {
        // enter=0：获取已经未录入完成的活动
        // enter=1：获取已经录入完成的活动，用于补录
        // pn，pageNumber，第几页；ps：pageSize，每页大小
        const response = await fetch(`https://cpcapi.cbg.cn/manageapi/volunteerActivity/list?_t=1719818494&pageNumber=${pn}&pageSize=${ps}&status=20`, {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("获取活动信息失败");
            return;
        }
        let allRes = res.data.result;
        if (enter) {
            // 获取已经录入完成的活动，用于补录
            allRes = allRes.filter(item => item.registUserCount == item.requireUserCount);
        } else {
            //默认支线
            allRes = allRes.filter(item => item.registUserCount < item.requireUserCount || !item.registUserCount);
        }
        return allRes;
    }
    //请求志愿者信息
    async function getAllVoluntees() {
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerTeamUser/list?_t=1719816537&pageNumber=1&pageSize=9999&teamCode=3dabbfb2abc54138bcc3ecc72ba70a02&status=20&areaCode=49bc0e0716b54a60b693e790b56c472b", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("获取志愿者信息失败")
            return
        }
        return res.data.result
    }
    function r40tees(allVoluntees, need = 40) {
        let randomIndices = new Set();
        while (randomIndices.size < need) {
            let randomIndex = Math.floor(Math.random() * allVoluntees.length);
            randomIndices.add(randomIndex);
        }
        let rIndices = Array.from(randomIndices)
        let volunteerUsers = rIndices.map(index => allVoluntees[index].volunteerUser);  //随机40个志愿者id
        return volunteerUsers;
    }
    //补录志愿者信息
    async function addVoluntees(activityCode, volunteerUsers) {
        let reqBody = {
            "activityCode": activityCode,
            "volunteerUsers": volunteerUsers
        }
        const response = await fetch("https://cpcapi.cbg.cn/manageapi/volunteerActivityUser/batchAdd?_t=1719816951", {
            "headers": {
                "accept": "application/json, text/plain, */*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "usertoken": localStorage.getItem("TOKEN")
            },
            "referrer": "https://cpcapi.cbg.cn/newEraPlatform/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": JSON.stringify(reqBody),
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const res = await response.json();
        if (res.msg != "成功") {
            showMessage("志愿者补录失败")
            return
        }
        showMessage("志愿者补录成功")
    }
    function formatTime(AST, day = 0, hour = 0) {
        AST = new Date(AST);
        let resTime;
        if (day) {
            // 增加1天
            let nextDate = new Date(AST.getTime());
            nextDate.setDate(AST.getDate() + 1);
            resTime = `${nextDate.getFullYear()}-${pad(nextDate.getMonth() + 1)}-${pad(nextDate.getDate())} ${pad(AST.getHours())}:${pad(AST.getMinutes())}`;
        } else if (hour) {
            // 增加2小时
            let nextHour = new Date(AST.getTime());
            nextHour.setHours(AST.getHours() + 2);
            resTime = `${nextHour.getFullYear()}-${pad(nextHour.getMonth() + 1)}-${pad(nextHour.getDate())} ${pad(nextHour.getHours())}:${pad(AST.getMinutes())}`;
        } else {
            // 没有增加
            resTime = `${AST.getFullYear()}-${pad(AST.getMonth() + 1)}-${pad(AST.getDate())} ${pad(AST.getHours())}:${pad(AST.getMinutes())}`;
        }
        return resTime;
    }
    function getRecruitTime(AST, start = 0) {
        AST = new Date(AST);
        let resTime = new Date(AST.getTime());
        if (resTime.getHours() == 10) { //上午
            resTime.setHours(9)
        } else { //下午
            resTime.setHours(12)
        }
        if (start) {
            resTime.setDate(resTime.getDate() - 1);//前一天开始招募
        }
        return formatTime(resTime); //招募结束日期即活动日期
    }
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }
    let messageBox = null;
    function showMessage(text) {
        if (messageBox) {
            document.body.removeChild(messageBox);
        }
        messageBox = document.createElement('div');
        messageBox.textContent = text;
        messageBox.style.cssText = `
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 9999;
    `;
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
            messageBox = null; // 释放引用，准备下一次使用
        }, 4000); // 4 seconds
    }
})();

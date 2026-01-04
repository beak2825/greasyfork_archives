// ==UserScript==
// @name         省地质灾害监测功能
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  广东、广西、云南、江西、陕西平台批量添加预警联系人/下载监测点列表/推送预警信息机器人
// @license      End-User License Agreement
// @author       Lp
// @match        http://210.76.77.42:8015/*
// @match        http://gxdzhjxx.dnr.gxzf.gov.cn/*
// @match        http://218.65.206.87:8088/*
// @match        http://222.221.241.110:8115/*
// @match        http://115.236.184.59:1011/*
// @match        http://171.34.52.5:10025/*
// @match        http://124.22.1.13:8115/*
// @match        http://218.87.28.205:10025/*
// @icon         data:image/jpeg;base64,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
// @require      https://registry.npmmirror.com/jquery/3.7.0/files/dist/jquery.min.js
// @require      https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/492891/%E7%9C%81%E5%9C%B0%E8%B4%A8%E7%81%BE%E5%AE%B3%E7%9B%91%E6%B5%8B%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/492891/%E7%9C%81%E5%9C%B0%E8%B4%A8%E7%81%BE%E5%AE%B3%E7%9B%91%E6%B5%8B%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

$(async function () {
    const host = location.host

    // 判断当前网址，选择接口
    const urlList = {
        '210.76.77.42:8015': {'api': '210.76.77.42:8088', 'platform': '广东省地灾', 'index': 44},
        'gxdzhjxx.dnr.gxzf.gov.cn': {'api': '218.65.206.87:8088', 'platform': '广西壮族自治区地灾', 'index': 45},
        '222.221.241.110:8115': {'api': '222.221.241.110:18088', 'platform': '云南省地灾', 'index': 53},
        '171.34.52.5:10025' : {'api': '171.34.52.5:10026', 'platform': '江西省地灾', 'index': 36},
        '218.87.28.205:10025' : {'api': '218.87.28.205:10026', 'platform': '陕西省地灾', 'index': 61},
    }

    const apiData = urlList[host]
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': localStorage.getItem('oriToken') !== null ? localStorage.getItem('oriToken') : null
    }

    let dataSize = {
        task: 0,
        personnel: '',
        processed: 0,
        inAll: 0
    }

    let userType = ''
    let sendMsgTimerInterval


    let toast = Swal.mixin({
        allowOutsideClick: false,
        confirmButtonText: '确认',
        didOpen: () => {
            Swal.hideLoading()
        }
    });

    const message = {
        success: async (text) => {
            await sleep(1000)
            toast.fire({title: text, icon: 'success'})
        },
        error: async (text) => {
            await sleep(1000)
            toast.fire({title: text, icon: 'error'})
        },
        warning: async (text) => {
            await sleep(1000)
            toast.fire({title: text, icon: 'warning'})
        },
        info: async (text) => {
            await sleep(1000)
            toast.fire({title: text, icon: 'info'})
        },
        question: async (text) => {
            await sleep(1000)
            toast.fire({title: text, icon: 'question'})
        }
    }


    function addDiv() {
        let div = document.createElement('div')
        div.id = 'self_build_button_group';
        div.style.zIndex = '2';
        div.style.position = 'fixed';
        div.style.bottom = 0;
        div.style.left = 0;
        document.body.appendChild(div);
    }


    /**
     * 添加按钮
     */
    function addButton(id, innerText, event) {
        let button = document.createElement('button');
        button.id = id;
        button.innerText = innerText;
        button.style.marginRight = '10px'
        button.style.marginBottom = '0'
        button.addEventListener("click", event);
        document.getElementById('self_build_button_group').appendChild(button);
    }

    /**
     * 添加预警人员弹出框
     * @returns {Promise<void>}
     */
    async function addEarlyWarningPersonnelSwal() {
        let failureData = []
        let dataSize = {
            task: 0,
            personnel: '',
            processed: 0,
            inAll: 0
        }

        async function addEarlyWarningPersonnel(monitorPointCode, linkmanList) {
            for (const linkman of linkmanList) {
                const name = linkman.name
                const phone = linkman.phone
                const isExist = await isWhetherPersonnelExist(name, phone);
                // 如果临时人员列表不存在，则添加进临时人员列表
                if (!isExist) {
                    const saveWarningTemporaryReceiverResult = await request.saveWarningTemporaryReceiver(name, userType, phone)
                    if (!saveWarningTemporaryReceiverResult.r) {
                        failureData.push({
                            'monitorPointCode': monitorPointCode,
                            'name': name,
                            'msg': saveWarningTemporaryReceiverResult.msg
                        })
                        continue
                    }
                }
                for (const yjlevel of ['蓝色', '黄色', '橙色', '红色']) {
                    dataSize.personnel = name + ' ' + yjlevel
                    const result = await request.saveMonitorPointReciever(monitorPointCode, name, phone, userType, yjlevel)
                    if (!result.r) {
                        failureData.push({
                            'monitorPointCode': monitorPointCode,
                            'name': name,
                            'phone': phone,
                            'userType': userType,
                            'level': yjlevel,
                            'msg': result.msg
                        })
                    }
                }
            }
        }

        async function parseAddEarlyWarningPersonnelInputValue(inputValue) {
            const monitorStringList = inputValue.split('\n')
            dataSize.inAll = monitorStringList.length
            for (let monitorString of monitorStringList) {
                const monitor = monitorString.split('\t')
                const monitorPointCode = monitor.shift().trim()
                dataSize.task = monitorPointCode
                if (monitor.length % 2 === 1) {
                    failureData.push({
                        'monitorPointCode': monitorPointCode,
                        'msg': '格式错误,请检查格式'
                    })
                    continue
                }
                let linkmanList = []
                for (let i = 0; i < monitor.length; i += 2) {
                    if (monitor[i] === '' || monitor[i + 1] === '') continue
                    const name = monitor[i]
                    const phone = monitor[i + 1]
                    linkmanList.push({
                        'name': name,
                        'phone': phone
                    })
                }
                const monitorPointPageListResult = await request.getMonitorPointPageList(monitorPointCode, 1, 1)
                if (!monitorPointPageListResult.r) {
                    message.error(monitorPointPageListResult.msg)
                }
                if (monitorPointPageListResult.data.length !== 1) {
                    failureData.push({
                        'monitorPointCode': monitorPointCode,
                        'msg': '未找到监测点'
                    })
                    continue
                }
                // 去重
                linkmanList = linkmanList.map(item => {
                    return JSON.stringify(item)
                })
                linkmanList = Array.from(new Set(linkmanList))
                linkmanList = linkmanList.map(item => {
                    return JSON.parse(item)
                })
                await addEarlyWarningPersonnel(monitorPointCode, linkmanList)
                dataSize.processed += 1
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("添加监测人员未全部成功，请在控制台中查看错误信息")
            } else {
                return message.success("添加监测人员全部成功")
            }
        }

        await Swal.fire({
            title: "批量添加监控人员",
            input: "textarea",
            inputPlaceholder: "国家编号\t姓名\t手机号\t姓名\t手机号",
            html: "<div><label>人员类别：</label><select class='swal2-select' id='user_type_select' name='source'><option value='' selected>请选择人员类别</option><option value='运维人员'>运维人员</option><option value='其他人员'>其他人员</option><option value='群测群防员'>群测群防员</option><option value='管理人员'>管理人员</option><option value='专业人员'>专业人员</option></select></div>",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.hideLoading()
            },
            preConfirm: (inputValue) => {
                userType = document.getElementById("user_type_select").value
                if (userType === '') {
                    Swal.showValidationMessage(`请选择人员类别`);
                    return
                }
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`);
                    return
                }
                let timerInterval;
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>当前人员：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b1 = Swal.getPopup().querySelectorAll("b")[0];
                        const b2 = Swal.getPopup().querySelectorAll("b")[1];
                        const b3 = Swal.getPopup().querySelectorAll("b")[2];
                        const b4 = Swal.getPopup().querySelectorAll("b")[3];
                        b1.textContent = ''
                        b2.textContent = ''
                        b3.textContent = 0
                        b4.textContent = 0
                        timerInterval = setInterval(() => {
                            b1.textContent = dataSize.task;
                            b2.textContent = dataSize.personnel;
                            b3.textContent = dataSize.processed;
                            b4.textContent = dataSize.inAll
                        }, 500);
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval);
                    }
                })
                parseAddEarlyWarningPersonnelInputValue(inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        });
    }

    /**
     * 下载监测点弹出框
     */
    async function downloadMonitoringPointSwal() {
        let stopDownloading = false;

        async function getMonitorPointList() {
            const pageSize = 100
            const getMonitorPointPageResult = await request.getMonitorPointPages(pageSize)
            if (!getMonitorPointPageResult.r) {
                message.error(getMonitorPointPageResult.msg)
            }
            dataSize.inAll = getMonitorPointPageResult.data
            const pages = parseInt(getMonitorPointPageResult.data / pageSize) + 1
            const data = []
            const head = ['省监测编码', '监测点名称', '国家编码', '危害名称', '位置', '监测类型']
            for (let page = 1; page <= pages; page++) {
                if (stopDownloading) {
                    return
                }
                const monitorPointPageListResult = await request.getMonitorPointPageList('', page, pageSize);
                if (!monitorPointPageListResult.r) {
                    message.error(monitorPointPageListResult.msg)
                }
                for (let monitorPointPage of monitorPointPageListResult.data) {
                    let monitorPoint = []
                    monitorPoint = [monitorPointPage['PROVINCEMONITORCODE'], monitorPointPage['MonitorPointName'], monitorPointPage['MONITORPOINTCODE'], monitorPointPage['HazardName'], monitorPointPage['Location'], monitorPointPage['MonitorType']]
                    data.push(monitorPoint)
                }
                dataSize.processed += monitorPointPageListResult.data.length
            }
            data.unshift(head)
            download(data)
        }

        let timerInterval;
        Swal.fire({
            title: "正在下载监测点列表，请稍候",
            allowOutsideClick: false,
            html: "已下载 <b></b> / <b></b>",
            didOpen: () => {
                Swal.showLoading()
                const b1 = Swal.getPopup().querySelectorAll("b")[0];
                const b2 = Swal.getPopup().querySelectorAll("b")[1];
                b1.textContent = 0
                b2.textContent = 0
                timerInterval = setInterval(() => {
                    b1.textContent = dataSize.processed;
                    b2.textContent = dataSize.inAll
                }, 500);
            },

            didDestroy: () => {
                stopDownloading = true
                clearInterval(timerInterval);
            },
            showCancelButton: true,
            cancelButtonText: "取消"
        });
        await getMonitorPointList()
    }

    /**
     * 预警配置
     */
    function earlyWarningPushConfiguration() {
        const inputValue = localStorage.getItem('earlyWarningSwitch') !== null ? localStorage.getItem('earlyWarningSwitch') : 'true'
        Swal.fire({
            title: "预警推送配置",
            input: "radio",
            inputOptions: {'true': '开启', 'false': '关闭'},
            inputValue,
            html:
                '<div>推送周期：<select id="pushNotificationPeriod" name="pushNotificationPeriod">' +
                '    <option id="pushNotificationPeriod2" value="2">2</option>' +
                '    <option id="pushNotificationPeriod5" value="5">5</option>' +
                '    <option id="pushNotificationPeriod10" value="10">10</option>' +
                '    <option id="pushNotificationPeriod15" value="15">15</option>' +
                '</select> 分钟</div>' +
                '<br>' +
                '<div id="levelForm">预警等级：' +
                '<label><input type="checkbox" id="level1" name="level" value="1" disabled>红色</label>' +
                '<label><input type="checkbox" id="level2" name="level" value="2">橙色</label>' +
                '<label><input type="checkbox" id="level3" name="level" value="3">黄色</label>' +
                '<label><input type="checkbox" id="level4" name="level" value="4">蓝色</label>' +
                '</div>',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.hideLoading()
                const checkLevelList = localStorage.getItem('checkLevelList') !== null ? localStorage.getItem('checkLevelList').split(',') : ['1']
                const pushNotificationPeriod = localStorage.getItem('pushNotificationPeriod') !== null ? localStorage.getItem('pushNotificationPeriod') : '2'
                document.getElementById('pushNotificationPeriod' + pushNotificationPeriod).selected = true
                if (checkLevelList[0] === '') {
                    return
                }
                checkLevelList.forEach(checkLevel => {
                    document.getElementById('level' + checkLevel).checked = true
                })
            },
            preConfirm: (inputValue) => {
                const checkLevelList = []
                document.querySelectorAll('input[type="checkbox"][name="level"]:checked').forEach(checkbox => {
                    checkLevelList.push(checkbox.value)
                })
                const pushNotificationPeriodElement = document.getElementById('pushNotificationPeriod')
                const pushNotificationPeriod = pushNotificationPeriodElement.options[pushNotificationPeriodElement.selectedIndex].value
                localStorage.setItem('earlyWarningSwitch', inputValue)
                localStorage.setItem('checkLevelList', checkLevelList)
                localStorage.setItem('pushNotificationPeriod', pushNotificationPeriod)
                clearInterval(sendMsgTimerInterval)
                sendMsg()
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        });
    }

    /**
     * 修改设备传感器埋深弹出框
     * @returns {Promise<void>}
     */
    async function changeTheSensorBuriedDepthSwal() {
        let failureData = []
        let dataSize = {
            task: '',
            sensor: '',
            processed: 0,
            inAll: 0
        }

        async function changeTheSensorBuriedDepth(sn, keyValue, sensorId, sensor) {
            const saveSensorDataResult = await request.saveSensorData(keyValue, sensor);
            if (!saveSensorDataResult.r) {
                failureData.push({
                    'sn': sn,
                    'sensorId': sensorId,
                    'msg': saveSensorDataResult.msg
                })
            }
        }

        async function parseChangeTheSensorBuriedDepthInputValue(inputValue) {
            const snStrList = inputValue.split('\n')
            dataSize.inAll = snStrList.length
            for (let sn of snStrList) {
                dataSize.task = sn
                const getListByRtuResult = await request.getListByRtu(sn);
                if (!getListByRtuResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getListByRtuResult.msg
                    })
                    continue
                }
                if (getListByRtuResult.data.length !== 1) {
                    failureData.push({
                        'sn': sn,
                        'msg': '未找到该设备'
                    })
                    continue
                }
                const guid = getListByRtuResult[0].guid
                const sensorListResult = await request.getSensorList(guid);
                if (!sensorListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': sensorListResult.msg
                    })
                    continue
                }
                for (const sensor of sensorListResult.data) {
                    const sensorId = sensor.cgbh;
                    dataSize.sensor = sensorId
                    sensor.holedepth = Number(sensorId.split('_')[2]) * 10
                    const keyValue = sensor.devicecode
                    await changeTheSensorBuriedDepth(sn, keyValue, sensorId, sensor)
                }
                dataSize.processed += 1
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("修改设备传感器埋深未全部成功，请在控制台中查看错误信息")
            } else {
                return message.success("修改设备传感器埋深全部成功")
            }
        }

        await Swal.fire({
            title: "批量修改设备传感器埋深",
            input: "textarea",
            inputPlaceholder: "SN号",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.hideLoading()
            },
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`);
                    return
                }
                let timerInterval;
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>传感器：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b1 = Swal.getPopup().querySelectorAll("b")[0];
                        const b2 = Swal.getPopup().querySelectorAll("b")[1];
                        const b3 = Swal.getPopup().querySelectorAll("b")[2];
                        const b4 = Swal.getPopup().querySelectorAll("b")[3];
                        b1.textContent = ''
                        b2.textContent = ''
                        b3.textContent = 0
                        b4.textContent = 0
                        timerInterval = setInterval(() => {
                            b1.textContent = dataSize.task;
                            b2.textContent = dataSize.sensor;
                            b3.textContent = dataSize.processed;
                            b4.textContent = dataSize.inAll
                        }, 500);
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval);
                    }
                })
                parseChangeTheSensorBuriedDepthInputValue(inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
        });
    }

    /**
     * 发送消息
     */
    async function sendMsg() {
        const earlyWarningSwitch = localStorage.getItem('earlyWarningSwitch') !== null ? localStorage.getItem('earlyWarningSwitch') : 'true'
        const checkLevelList = localStorage.getItem('checkLevelList') !== null ? localStorage.getItem('checkLevelList') : '1'
        const pushNotificationPeriod = localStorage.getItem('pushNotificationPeriod') !== null ? Number(localStorage.getItem('pushNotificationPeriod')) : 2
        if (earlyWarningSwitch === 'false' || checkLevelList === '') {
            console.log('关闭预警')
            clearInterval(sendMsgTimerInterval)
            return
        }
        await send()

        async function send() {
            const sentMsgList = localStorage.getItem('sentMsgList') !== null ? localStorage.getItem('sentMsgList').split(',') : []
            const getMonitorWaringResultForManagementResult = await request.getMonitorWaringResultForManagement(checkLevelList, '', '', '');
            if (!getMonitorWaringResultForManagementResult.r) {
                console.log(getMonitorWaringResultForManagementResult.msg)
                return
            }
            getMonitorWaringResultForManagementResult.data.reverse()

            for (const monitorWaringResultForManagement of getMonitorWaringResultForManagementResult.data) {
                const warnId = monitorWaringResultForManagement.WarnId
                if (sentMsgList.includes(warnId)) {
                    continue
                }
                const deviceByMonitorResultListResult = await request.getDeviceByMonitorResult(warnId)
                if (!deviceByMonitorResultListResult.r) {
                    console.log(deviceByMonitorResultListResult.msg)
                    return
                }
                let sn = ''
                for (const deviceByMonitorResult of deviceByMonitorResultListResult.data) {
                    sn = deviceByMonitorResult.SN
                }
                let levelMap = {
                    '1': '红色',
                    '2': '橙色',
                    '3': '黄色',
                    '4': '蓝色',
                }
                const level = levelMap[monitorWaringResultForManagement.LevelId]
                const monitorPointName = monitorWaringResultForManagement.MonitorPointName
                const monitorPointCode = monitorWaringResultForManagement.MonitorPointCode
                const location = monitorWaringResultForManagement.Location
                const modelName = monitorWaringResultForManagement.ModelName
                const warningDescription = monitorWaringResultForManagement.WarningDescription

                const msg =
                    "监测平台：" + apiData.platform + "\n" +
                    "预警等级：" + level + "\n" +
                    "监测点名称：" + monitorPointName + "（<font color='info'>" + monitorPointCode + "</font>）\n" +
                    "地点：" + location + "\n" +
                    "预警设备：" + modelName + "（<font color='warning'>" + sn + "</font>）\n" +
                    "预警信息：" + warningDescription + "\n" +
                    "推送时间：" + formatDate(new Date(), 'yyyy-MM-dd HH:mm:ss')

                const sendMarkdownMessageResult = await request.sendMarkdownMessage(msg)
                if (sendMarkdownMessageResult.r === true) {
                    sentMsgList.push(warnId)
                } else {
                    console.log(sendMarkdownMessageResult.msg)
                }
            }
            localStorage.setItem('sentMsgList', sentMsgList)
        }

        sendMsgTimerInterval = setInterval(async () => {
            await send()
        }, pushNotificationPeriod * 60000)
    }

    /**
     * 检查人员是否存在
     * @param name
     * @param phone
     * @returns {Promise<*>}
     */
    async function isWhetherPersonnelExist(name, phone) {
        const warningTemporaryReceiverListResult = await request.getWarningTemporaryReceiver(name);
        if (!warningTemporaryReceiverListResult.r) {
            message.error(warningTemporaryReceiverListResult.msg)
        }
        if (warningTemporaryReceiverListResult.data.length === 0) {
            return false
        }
        for (const warningTemporaryReceiver of warningTemporaryReceiverListResult.data) {
            if (warningTemporaryReceiver.PHONE === phone) {
                return true
            }
        }
        return false
    }


    /**
     * 下载文件
     * @param data
     */
    function download(data) {
        try {
            // 将数据转换为工作表
            const ws = XLSX.utils.aoa_to_sheet(data);
            // 创建工作簿并添加工作表
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
            // 生成二进制字符串
            const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

            // 创建一个Blob对象，并使用它构造一个URL
            function s2ab(s) {
                const buf = new ArrayBuffer(s.length);
                const view = new Uint8Array(buf);
                for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                return buf;
            }

            // 创建下载链接
            const blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
            const url = URL.createObjectURL(blob);
            // 创建一个a标签，模拟点击进行下载
            const a = document.createElement('a');
            a.href = url
            a.download = `${apiData.platform}监测点列表${formatDate(new Date(), 'yyyyMMddHHmmss')}.xlsx`;
            a.click();
            // 清除URL对象
            URL.revokeObjectURL(url);
            message.success("监测点列表下载成功")
        } catch (e) {
            message.error("监测点列表下载失败")
        }
        dataSize = {
            processed: 0,
            inAll: 0
        }
    }

    /**
     * 格式化日期
     * @param time
     * @param fmt
     * @returns {string}
     */
    function formatDate(time, fmt = 'yyyy-MM-dd') {
        const date = new Date(time);
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds(), //毫秒
        };
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')', 'i').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
            }
        }
        return fmt;
    }

    /**
     * 休眠时间
     * @param ms
     * @returns {Promise<unknown>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const request = {
        getMonitorPointPages: (pageSize) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {"PageIndex": 1, "PageSize": pageSize}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/GetMonitorPointPageList",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata.total
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getMonitorPointPageList: (keyWords, pageIndex, pageSize) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {"keyWords": keyWords, "PageIndex": pageIndex, "PageSize": pageSize}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/GetMonitorPointPageList",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata.rows
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getWarningTemporaryReceiver: (name) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const params = {"NAME": name, "USERTYPE": ''}
            const data = {"page": 1, "rows": 10}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/GetWarningTemporaryReceiver?queryJson=" + JSON.stringify(params),
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata.rows
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        saveWarningTemporaryReceiver: (name, usertype, phone) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {"NAME": name, "USERTYPE": usertype, "PHONE": phone}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/SaveWarningTemporaryReceiver?keyValue=",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        saveMonitorPointReciever: (monitorPointCode, reciever, phone, usertype, yjlevel) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {
                "MONITORPOINTCODE": monitorPointCode,
                "RECIEVER": reciever,
                "ORGANIZE": null,
                "PHONE": phone,
                "TYPE": usertype,
                "YJLEVEL": yjlevel
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/SaveMonitorPointReciever",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getMonitorWaringResultForManagement: (warningLevel, status, startTime, endTime) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {
                PageIndex: 1,
                PageSize: 1000,
                WarningLevel: warningLevel !== '' ? warningLevel : '1',
                Status: status !== '' ? status : '0,1',
                StartTime: startTime !== '' ? startTime : formatDate(new Date(), 'yyyy-MM-dd HH:00:00'),
                EndTime: endTime !== '' ? endTime : formatDate(new Date(), 'yyyy-MM-dd 23:59:59')
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_Warning/GetMonitorWaringResultForManagement",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata.rows
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getDeviceByMonitorResult: (resultId) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + apiData.api + "/api/V3.0/Management_MonitorPoint/GetDeviceByMonitorResult?resultId=" + resultId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        sendMarkdownMessage: (msg) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            let data = {"msgtype": "markdown", "markdown": {"content": msg}}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=" + assets.bot.key,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    dataType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.errcode === 0) {
                            result.r = true
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getListByRtu: (sn) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            const data = {
                "PageIndex": 1,
                "PageSize": 15,
                "sidx": "STATUS",
                "sord": "desc",
                "DeviceCode": "",
                "DeviceName": "",
                "AreaCode": "",
                "Status": "",
                "DeviceType": "",
                "MANUFACTURER": "",
                "MonitorPointName": "",
                "ISRALATION": "是",
                "ISHX": "0",
                "IsMonitor": "",
                "SN": sn,
                "ISSINGLE": "",
                "LabelId": ""
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_Device/GetListByRtu",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata.rows
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getRtuInfo: (rtuGuid) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + apiData.api + "/api/V3.0/Management_Device/GetRtuInfo?rtuGuid=" + rtuGuid,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.Success === 1) {
                            result.r = true
                            result.data = response.resultdata
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        getSensorList: (rtuGuid) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + apiData.api + "/api/V3.0/Management_Device/GetSensorList?rtuGuid=" + rtuGuid,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                            result.data = response.resultdata
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        saveSensorData: (keyValue, data) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + apiData.api + "/api/V3.0/Management_Device/SaveSensorData?keyValue=" + keyValue,
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        const response = res.response;
                        if (response.resultcode === 1) {
                            result.r = true
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        outLogin: () => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://" + apiData.api + "/api/SSOAuth/OutLogin/",
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        console.log(response)
                        if (response.Success === true) {
                            result.r = true
                            result.data = null
                        } else {
                            result.msg = response.Error.Message
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        base64: (url) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                const img = new Image()
                //如果图片设置需要跨域
                img.setAttribute("crossOrigin", "anonymous")
                img.src = url
                img.onload = () => {
                    let canvas = document.createElement('canvas')
                    canvas.width = img.width;
                    canvas.height = img.height
                    let ctx = canvas.getContext('2d')
                    //图片绘制到canvas
                    ctx.drawImage(img, 0, 0, img.width, img.height)
                    result.r = true
                    result.data = canvas.toDataURL()
                    resolve(result)
                }
                img.onerror = (e) => {
                    result.msg = e
                    resolve(result)
                }
            })
        },
        getAccessToken: () => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=' + assets.ocr.AK + '&client_secret=' + assets.ocr.SK,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.access_token !== undefined) {
                            result.r = true
                            result.data = response.access_token
                        } else {
                            result.msg = response.msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = error
                        resolve(result)
                    }
                })
            })
        },
        ocrAccurateBasic: (accessToken, imageBase64) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            let data = new URLSearchParams()
            data.append('image', imageBase64)
            data.append('detect_direction', 'false')
            data.append('paragraph', 'false')
            data.append('probability', 'false')
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + accessToken,
                    headers: headers,
                    data: data,
                    responseType: 'JSON',
                    onload: function (res) {
                        const response = res.response;
                        if (response.words_result_num === 1) {
                            result.r = true
                            result.data = response.words_result[0].words
                        } else {
                            result.msg = response.error_msg
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
        checkLogin: (verifyCode) => {
            const result = {
                r: false,
                msg: '',
                data: null
            }
            let data = new URLSearchParams()
            data.append('username', 'huace')
            data.append('password', 'iYSs6uk053z9DwYnGYxfHMk5F45TqsmTP8tXw5mwQ5rZEt8j2xw6ZM3FR6YBvu+A')
            data.append('verifycode', verifyCode)
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://" + location.host + "/Login/CheckLogin",
                    responseType: 'json',
                    data: data,
                    headers: headers,
                    onload: function (res) {
                        const response = res.response
                        console.log(res)
                        if (response.code === 200) {
                            result.r = true
                            result.data = response.data.split(',')[0]
                        } else {
                            result.msg = response.info
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = '请求错误-->' + error
                        resolve(result)
                    }
                })
            })
        },
    }


    const loginPages = ['/Login/Index', '/login']
    if (loginPages.includes(location.pathname)) {
        return
        // const getAccessTokenResult = await request.getAccessToken();
        // if (!getAccessTokenResult.r) {
        //     console.log(getAccessTokenResult.msg)
        // }
        // const getVerifyCodeDataUrlResult = await request.base64("http://" + location.host + '/Login/VerifyCode?time=' + (new Date()).valueOf())
        // if (!getVerifyCodeDataUrlResult.r) {
        //     console.log(getVerifyCodeDataUrlResult.msg)
        // }
        // const ocrAccurateBasicResult = await request.ocrAccurateBasic(getAccessTokenResult.data, getVerifyCodeDataUrlResult.data)
        // if (!ocrAccurateBasicResult.r) {
        //     console.log(ocrAccurateBasicResult.msg);
        // }
        // const checkLoginResult = await request.checkLogin(ocrAccurateBasicResult.data);
        // if (!checkLoginResult.r) {
        //     console.log(checkLoginResult.msg);
        // }
        // await sleep(5000)
        // location.reload()
    } else {
        addDiv()
        addButton('modifyAContact', '修改联系人', addEarlyWarningPersonnelSwal)
        addButton('downloadMonitoringPoint', '下载监测点', downloadMonitoringPointSwal)
        addButton('earlyWarningPushConfiguration', '预警推送配置', earlyWarningPushConfiguration)
        addButton('changeTheSensorBuriedDepth', '修改设备传感器埋深', changeTheSensorBuriedDepthSwal)
        await sendMsg()

        // setInterval(async () => {
        //     await request.outLogin()
        //     location.reload()
        // }, 12*60*60*1000)
    }
})
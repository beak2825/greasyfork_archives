// ==UserScript==
// @name         华测导航物联网平台整合插件
// @namespace    http://iot-monitor.huacenav.com
// @version      1.4.3
// @description  华测导航物联网平台整合插件，批量添加监测点、修改设备名称、下发指令、配置解算等
// @license      End-User License Agreement
// @author       Lp
// @match        http://iot-monitor.huacenav.com/*
// @match        http://www.iot-monitor.cn/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAiCAYAAAD23jEpAAAE0ElEQVRYhb2ZS2xVVRSGP/qyRsHy0gg6cWrCjAJFHZFaIZo4MMZgRB34REEEtaStsRBQrMWLiA8SY3wM1IFRo5Q+jBpjHKtoAJOqA50IGKq2QUrNIv9pbo9rncdt4p80t2evvfZZ/957PfY+c1r6TjILPAw8BTQD7+j5dIHh5gH7gFuBCeBJPdeEulkQ6AYqQItIbBCRhTl6C9Vvg/RMv6Lx/lcSNvu9TnsH8BawKNBbJHmHI+vVuKVRC4kdQE+G3Ax8G5ifap+vdo9Agh6NXwplSFjfXUBXgb7twLvAAj0v0HN7Ad0uvaewbWVI2Ax1lui/RjPfpt81JXQ7y6xIURK7ge2BzKLKPcC4I7OtMxxsoXHpRVFpu96bi4YCffYA2wLZy5KdkVEHFXGqcaGjNyEC5uRN+rvP6fcEUA88lmVgfXP745HMVulZYGsgf0l54R89fwP8BKzLmZwx4F5tMcMkcBhYDCx3+q8G5mpFp8qQqBeBRwNDDgAPAudS7d+KiG2fxkDXHPeVVJuN8zFwaUCkTURGPCIRiT5gS2DEPq1ABFuRUeCGgIit8KdakTQOKRSvcGSrgIuBwSIkngceCQysaHXSK5DGd8CPwFrt92pcJSMHgxJlCLgEWBkQMZID1Y11qf9fADZlENiqPVwElhfuAv52+q6W/HJHNqn3VIJ3bJKd07Yn/zRKsDFQ7Ac2A2cLEkjwHnAn8Jcjs1l9H1jiyM7qff3BuBtl7/ntatvJlnuvHNVDX0aEugxYr6W3Lfab0+d74Kic/YKU7ArgOkWePxzdQflBmyNbrkpg2Ej0ZkShp4EoBtsMvib/WavQehw45vT9QWTWOUSWAsvkC56zDyn3XOPIWm0h7Dwx7iSohEBWmXF92sFkxO3Ah4HOjUpw8xxZh/JFhN1KfmlMZJUdbmLJgcXyN2Ssh4+AO4IZz0NoT12G83Sqmoxgie0zR2bh8U3gpkDvA63Wr1VtAxovwq6MXdFvPvGlHKTV6XAtcJH2ZRo2m1/I6ZamZM3a/8fkD2mYo3+uxGik9gRBAdVukV++aIVicsZOItQDEdsM51+iUOlNwp/A3Qq1teC5jMrhgILKmcQnrAp9CNgfKGwRSa+ws21xM/C1I7Pw+DpwS0kCDXpfRGC/7DW7Z5QdU1W1i5fyVyqqeNXkmCKL9bkyJWtUCLYy5EgBAvXKTZsDeUVZe9oGr3YakHOuCoi0BKHwtNqXqT6qRpOIjKquijBHKxCVPnu9ui6qYoe1FTwiK3Rr8YkjG1M57Z2lm1TZ/iKH9pBsEw/9OhwVLsWnRGRuQKRVxg6mKtr1iibprJygUVFrNBVSG1QLRaVPv06QbvWcdbKbKlC7LFb4nVTsP6j+WWjQivysFbEVqmRExqR2C5NdkTP2Nhnpsb1fEeKIHM47T4877fb8qn6v1jgenglKjRkocxeblTUjDOjqpTvn0sxD1g3LDJS5d+oqeoUijMhHvtLvSEkCRS7pzqMMiXOamZ0F+g4pwSXLfFLPXvmSxk69J+8IPI1a7mK7c27nLBjcBpxKtZ9S+38O+lXYUcvteK234j36ppDGYW2dE4HeCcm9ZGnjZV1Uh5jN9wk7EVppYMdKu9Gzc4R9NPk9R8/k1s/6m57p2zjep4J8AP8C4VsZMiRLIs8AAAAASUVORK5CYII=
// @require      https://registry.npmmirror.com/jquery/3.7.0/files/dist/jquery.min.js
// @require      https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.all.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494649/%E5%8D%8E%E6%B5%8B%E5%AF%BC%E8%88%AA%E7%89%A9%E8%81%94%E7%BD%91%E5%B9%B3%E5%8F%B0%E6%95%B4%E5%90%88%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/494649/%E5%8D%8E%E6%B5%8B%E5%AF%BC%E8%88%AA%E7%89%A9%E8%81%94%E7%BD%91%E5%B9%B3%E5%8F%B0%E6%95%B4%E5%90%88%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

$(function () {

    // 提示
    if (localStorage.getItem("confirmationBox") !== 'true') {
        Swal.fire({
            title: "内部使用，切勿外传！",
            color: "#d30c0c",
            allowOutsideClick: false,
            confirmButtonText: '确认',
            preConfirm: () => {
                localStorage.setItem("confirmationBox", 'true')
            }
        })
    }

    // 请求头
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json;charset=UTF-8',
        'access_token': sessionStorage.getItem('IOT_JWT_TOKEN'),
    }

    // 任务状态提示框模板
    let toast = Swal.mixin({
        allowOutsideClick: false,
        confirmButtonText: '确认',
        didOpen: () => {
            Swal.hideLoading()
        }
    })

    // 任务状态类型
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

    /**
     * 添加监测点弹出框
     * @returns {Promise<void>}
     */
    async function addMonitoringPointsInBatchesSwal() {
        let failureData = []
        let dataSize = {
            task: "",
            processed: 0,
            inAll: 0
        }

        async function addMonitoringPointsInBatches(monitorPointName, data) {
            const addProjectResult = await request.addProject(data)
            if (!addProjectResult.r) {
                failureData.push({
                    'monitorPointName': monitorPointName,
                    'msg': addProjectResult.msg
                })
            }
        }

        async function parseAddMonitoringPointsInBatchesInputValue(inputValue) {
            // 设备SN号
            const monitorPointList = inputValue.split('\n')
            dataSize.inAll = monitorPointList.length
            for (const monitorPoint of monitorPointList) {
                const parseMonitorPoint = monitorPoint.split('\t')
                if (parseMonitorPoint.length !== 7) {
                    failureData.push({'source': monitorPoint, 'msg': '格式错误'})
                    dataSize.processed++
                    continue
                }
                const monitorPointName = parseMonitorPoint[0]
                dataSize.task = monitorPointName
                const data = {
                    "name": monitorPointName,
                    "code": parseMonitorPoint[1],
                    "longitude": parseMonitorPoint[2],
                    "latitude": parseMonitorPoint[3],
                    "province": parseMonitorPoint[4],
                    "city": parseMonitorPoint[5],
                    "county": parseMonitorPoint[6]
                }
                await addMonitoringPointsInBatches(monitorPointName, data)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '批量添加监测点失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("批量添加监测点未全部成功，请在excel中查看原因")
            } else {
                return message.success("批量添加监测点成功")
            }
        }

        await Swal.fire({
            title: "批量添加监测点",
            input: "textarea",
            inputPlaceholder: "监测点名称\t编码\t经度\t维度\t省\t市\t区县",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入监测点信息`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseAddMonitoringPointsInBatchesInputValue(inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 设备绑定监测点弹出框
     * @returns {Promise<void>}
     */
    async function batchBindDeviceSwal() {
        let failureData = []
        let dataSize = {
            task: "",
            processed: 0,
            inAll: 0
        }

        async function batchBindDevice(addOrRemove, monitorPointName, devices) {
            const getProjectIdResult = await request.getProjectId(monitorPointName)
            if (!getProjectIdResult.r) {
                failureData.push({'monitorPointName': monitorPointName, 'msg': getProjectIdResult.msg})
                return
            }
            const projectInfo = getProjectIdResult.data[0]
            const projectId = projectInfo.id
            let updateProjectDeviceResult
            if (addOrRemove === 'add') {
                updateProjectDeviceResult = await request.updateProjectDevice(projectId, devices, [])
            } else if (addOrRemove === 'remove') {
                updateProjectDeviceResult = await request.updateProjectDevice(projectId, [], devices)
            }
            if (!updateProjectDeviceResult.r) {
                failureData.push({
                    'monitorPointName': monitorPointName,
                    'msg': updateProjectDeviceResult.msg
                })
            }
        }

        async function parseBatchBindDeviceSwalInputValue(addOrRemove, inputValue) {
            // 设备SN号
            const monitorPointList = inputValue.split('\n')
            dataSize.inAll = monitorPointList.length
            for (const monitorPoint of monitorPointList) {
                const parseMonitorPoint = monitorPoint.split('\t')
                if (parseMonitorPoint.length !== 2) {
                    failureData.push({'source': monitorPoint, 'msg': '格式错误'})
                    dataSize.processed++
                    continue
                }
                const monitorPointName = parseMonitorPoint[0]
                dataSize.task = monitorPointName
                let sns = parseMonitorPoint[1].split(',')
                // 过滤掉为空值的数据
                sns = sns.filter(e => e !== '')
                const getDeviceInfoListResult = await request.getDeviceInfoList(sns)
                if (!getDeviceInfoListResult.r) {
                    failureData.push({'monitorPointName': monitorPointName, 'msg': getDeviceInfoListResult.msg})
                    dataSize.processed++
                    continue
                }
                const deviceIds = []
                const deviceSns = []
                for (const deviceInfo of getDeviceInfoListResult.data) {
                    deviceSns.push(deviceInfo.sn)
                    deviceIds.push(deviceInfo.deviceId)
                }
                if (getDeviceInfoListResult.data.length !== sns.length) {
                    for (const sn of sns) {
                        if (!deviceSns.includes(sn)) {
                            failureData.push({'monitorPointName': monitorPointName, sn: sn, 'msg': '未找到该设备'})
                        }
                    }
                }
                await batchBindDevice(addOrRemove, monitorPointName, deviceIds)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '批量绑定设备失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("批量绑定设备未全部成功，请在excel中查看原因")
            } else {
                return message.success("批量绑定设备成功")
            }
        }

        await Swal.fire({
            title: "批量绑定设备",
            input: "textarea",
            inputPlaceholder: "监测点名称\tSN号,SN号...",
            html: '<div>操作类型： ' +
                '<label style="margin-right: 20px"><input type="radio" id="addDevice" name="addOrRemove" value="add">添加</label> ' +
                '<label><input type="radio" id="removeDevice" name="addOrRemove" value="remove">删除</label> ' +
                '</div>',
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                let addOrRemove
                const addOrRemoveElements = document.getElementsByName('addOrRemove')
                for (let addOrRemoveElement of addOrRemoveElements) {
                    if (addOrRemoveElement.checked) {
                        addOrRemove = addOrRemoveElement.value
                    }
                }
                if (addOrRemove === undefined) {
                    Swal.showValidationMessage(`请选择操作类型`)
                    return
                }
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseBatchBindDeviceSwalInputValue(addOrRemove, inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }


    /**
     * 修改设备名称弹出框
     * @returns {Promise<void>}
     */
    async function editDeviceNameSwal() {
        let failureData = []
        let dataSize = {
            task: "",
            processed: 0,
            inAll: 0
        }

        async function editDeviceName(deviceInfo, monitorTopologyList) {
            const updateDeviceInfoResult = await request.updateDeviceInfo(deviceInfo, monitorTopologyList)
            if (!updateDeviceInfoResult.r) {
                failureData.push({
                    'sn': deviceInfo.sn,
                    'msg': updateDeviceInfoResult.msg
                })
            }
        }

        async function parseEditDeviceNameInputValue(inputValue) {
            // 设备SN号
            let deviceList = inputValue.split('\n')
            deviceList = deviceList.filter(e => e !== '\t')
            dataSize.inAll = deviceList.length
            for (const device of deviceList) {
                const parseDevice = device.split('\t')
                if (parseDevice.length % 2 !== 0 || parseDevice[0] === '' || parseDevice[1] === '') {
                    failureData.push({'source': device, 'msg': '格式错误'})
                    dataSize.processed++
                    continue
                }
                const deviceSn = parseDevice[1]
                const deviceName = parseDevice[0]
                dataSize.task = deviceSn + " " + deviceName
                // 获取设备信息
                const getDeviceInfoListResult = await request.getDeviceInfoList([deviceSn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': deviceSn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                const deviceInfo = getDeviceInfoListResult.data[0]
                deviceInfo.name = deviceName
                deviceInfo.isNetDevice = 'noDevice'
                // 获取监测类型
                const getMonitorTopologyListResult = await request.getMonitorTopologyList(deviceInfo.deviceId)
                if (!getMonitorTopologyListResult.r) {
                    failureData.push({'sn': deviceSn, 'msg': getMonitorTopologyListResult.msg})
                    dataSize.processed++
                    continue
                }
                await editDeviceName(deviceInfo, getMonitorTopologyListResult.data)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '批量修改设备名称失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("批量修改设备名称未全部成功，请在excel中查看原因")
            } else {
                return message.success("批量修改设备名称成功")
            }
        }

        await Swal.fire({
            title: "批量修改设备名称",
            input: "textarea",
            inputPlaceholder: "格式为'设备名称\tSN号'，设备名称与SN号之间为制表符\n修改多个设备名称以换行符分隔",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入SN号`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseEditDeviceNameInputValue(inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 下发MEMS阈值指令弹出框
     * @returns {Promise<void>}
     */
    async function sendMEMSThresholdValueCommandSwal() {
        let failureData = []
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function sendMEMSThresholdValueCommand(deviceInfoList) {
            for (const device of deviceInfoList) {
                const deviceId = device.shift()
                const sn = device.shift()
                dataSize.task = sn
                for (let i = 0; i < device.length; i += 2) {
                    const type = device[i]
                    const value = device[i + 1]
                    const commandArgs = [
                        {
                            "id": "type",
                            "value": type
                        },
                        {
                            "id": "threshold",
                            "value": value
                        }
                    ]
                    const sendDeviceCommandResult1 = await request.sendDeviceCommand(147, [deviceId], commandArgs)
                    if (!sendDeviceCommandResult1.r) {
                        failureData.push({
                            'sn': sn,
                            'args': commandArgs,
                            'msg': sendDeviceCommandResult1.msg
                        })
                    }
                    await sleep(1000)
                }
                const commandArgs2 = [{"id": "type", "value": "js"}]
                const sendDeviceCommandResult2 = await request.sendDeviceCommand(148, [deviceId], commandArgs2)
                if (!sendDeviceCommandResult2.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs2,
                        'msg': sendDeviceCommandResult1.msg
                    })
                }
                await sleep(500)
                const commandArgs3 = [{"id": "type", "value": "jd"}]
                const sendDeviceCommandResult3 = await request.sendDeviceCommand(148, [deviceId], commandArgs3)
                if (!sendDeviceCommandResult3.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs3,
                        'msg': sendDeviceCommandResult1.msg
                    })
                }
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("批量下发MEMS设备命令未全部成功，请在控制台中查看下发失败的设备")
            } else {
                return message.success("批量下发MEMS设备命令成功，请一分钟后再下载下发结果")
            }
        }

        async function parseThresholdValueCommandInputValue(inputValue) {
            let deviceInfoList = []
            const deviceList = inputValue.split('\n')
            dataSize.inAll = deviceList.length
            for (const device of deviceList) {
                const parseDevice = device.split('\t')
                const sn = parseDevice[0]
                if (parseDevice.length % 2 === 0) {
                    failureData.push({
                        'sn': sn,
                        'msg': '格式错误,请检查格式'
                    })
                    dataSize.processed++
                    continue
                }
                const getDeviceInfoListResult = await request.getDeviceInfoList([parseDevice[0]])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                parseDevice.unshift(getDeviceInfoListResult.data[0].deviceId)
                deviceInfoList.push(parseDevice)
            }
            await sendMEMSThresholdValueCommand(deviceInfoList)
        }

        async function QueryDeliveryResults(data) {
            for (let datum of data) {
                const sn = datum.sn
                dataSize.task = sn
                const getDeviceCommandHistoryListResult = await request.getDeviceCommandHistoryList(datum.deviceId)
                if (!getDeviceCommandHistoryListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceCommandHistoryListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                for (let deviceCommandHistoryListElement of getDeviceCommandHistoryListResult.data) {
                    if (datum.jsValue !== '' && datum.jdValue !== '') {
                        break
                    }
                    if (deviceCommandHistoryListElement.commandId === 148) {
                        const commandContent = deviceCommandHistoryListElement.commandContent
                        const responseContent = deviceCommandHistoryListElement.responseContent
                        const type = commandContent.match(/type=(.*?)&/)[1]
                        if (deviceCommandHistoryListElement.responseStatus === 2) {
                            const responseValue = responseContent.match(/threshold=(.*?)&/)
                            if (responseValue !== null) {
                                const value = responseValue[1]
                                if (type === 'js') {
                                    datum.jsResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jsValue = value
                                } else if (type === 'jd') {
                                    datum.jdResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jdValue = value
                                }
                            }
                        }
                    }
                }
                dataSize.processed++
            }
            const head = {
                'sn': 'sn',
                'deviceId': '设备ID',
                'productName': '产品名称',
                'jsResponseTime': '加速度响应时间',
                'jsValue': '加速度阀值',
                'jdResponseTime': '倾角响应时间',
                'jdValue': '倾角阀值',
            }
            const json2ExcelResult = json2Excel(data, head, 'MEMS主机下发指令结果' + formatDate(new Date(), 'yyyyMMddhhmmss'))
            if (json2ExcelResult && failureData.length === 0) {
                await message.success('MEMS主机下发指令结果下载成功')
            } else if (json2ExcelResult || failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("MEMS主机下发指令结果未全部成功，请在excel中查看原因")
            } else {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果下载失败' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("下载失败，请在excel中查看原因")
            }
        }

        async function parseQueryDeliveryResultsInputValue(inputValue) {
            const parseSN = inputValue.split('\n')
            dataSize.inAll = parseSN.length
            const data = []
            for (const sn of parseSN) {
                const getDeviceInfoListResult = await request.getDeviceInfoList([sn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                const dataMap = {
                    'sn': sn,
                    'deviceId': getDeviceInfoListResult.data[0].deviceId,
                    'productName': getDeviceInfoListResult.data[0].productName,
                    'jsResponseTime': '',
                    'jsValue': '',
                    'jdResponseTime': '',
                    'jdValue': '',
                }
                data.push(dataMap)
            }
            await QueryDeliveryResults(data)
        }

        await Swal.fire({
            title: "MEMS主机下发设置阀值指令",
            input: "textarea",
            inputPlaceholder: "SN号\tjs\t阀值\tjd\t阀值",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseThresholdValueCommandInputValue(inputValue)
            },
            preDeny: () => {
                Swal.fire({
                    title: "MEMS主机查询下发阀值结果",
                    input: "textarea",
                    inputPlaceholder: "请输入SN号",
                    allowOutsideClick: false,
                    preConfirm: (inputValue) => {
                        if (inputValue === '') {
                            Swal.showValidationMessage(`请输入SN号`)
                            return
                        }
                        let timerInterval
                        Swal.fire({
                            title: "正在查询下发指令结果",
                            allowOutsideClick: false,
                            html: "当前任务：<b></b><br>已查询：<b></b> / <b></b>",
                            didOpen: () => {
                                Swal.showLoading()
                                const b0 = Swal.getPopup().querySelectorAll("b")[0]
                                const b1 = Swal.getPopup().querySelectorAll("b")[1]
                                const b2 = Swal.getPopup().querySelectorAll("b")[2]
                                timerInterval = setInterval(() => {
                                    b0.textContent = dataSize.task
                                    b1.textContent = dataSize.processed
                                    b2.textContent = dataSize.inAll
                                }, 100)
                            },
                            didDestroy: () => {
                                clearInterval(timerInterval)
                                dataSize = {
                                    task: 0,
                                    processed: 0,
                                    inAll: 0
                                }
                            }
                        })
                        parseQueryDeliveryResultsInputValue(inputValue)
                    },
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
            },
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            denyButtonText: '查询结果'
        })
    }

    /**
     * 下发Ntrip指令弹出框
     * @returns {Promise<void>}
     */
    async function sendNtripCommandsInBatches() {
        let failureData = []
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function sendNtripThresholdValueCommand(deviceInfoList) {
            for (const device of deviceInfoList) {
                const deviceId = device.shift()
                const sn = device.shift()
                dataSize.task = sn
                const ip = device[0]
                const port = device[1]
                const name = device[2]
                const passwd = device[3]
                const mnt = device[4]
                const commandArgs = [
                    {
                        "id": "ip",
                        "value": ip
                    },
                    {
                        "id": "port",
                        "value": port
                    },
                    {
                        "id": "name",
                        "value": name
                    },
                    {
                        "id": "passwd",
                        "value": passwd
                    },
                    {
                        "id": "mnt",
                        "value": mnt
                    }
                ]
                const sendDeviceCommandResult1 = await request.sendDeviceCommand(367, [deviceId], commandArgs)
                if (!sendDeviceCommandResult1.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs,
                        'msg': sendDeviceCommandResult1.msg
                    })
                }
                await sleep(500)
                const commandArgs2 = []
                const sendDeviceCommandResult2 = await request.sendDeviceCommand(369, [deviceId], commandArgs2)
                if (!sendDeviceCommandResult2.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs2,
                        'msg': sendDeviceCommandResult2.msg
                    })
                }
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("批量下发Ntrip命令未全部成功，请在控制台中查看下发失败的设备")
            } else {
                return message.success("批量下发Ntrip命令成功，请一分钟后再下载下发结果")
            }
        }

        async function parseThresholdValueCommandInputValue(inputValue) {
            let deviceInfoList = []
            let deviceList = inputValue.split('\n')
            dataSize.inAll = deviceList.length
            for (const device of deviceList) {
                let parseDevice = device.split('\t')
                parseDevice = parseDevice.filter(e => e !== '')
                const sn = parseDevice[0]
                if (parseDevice.length !== 6) {
                    failureData.push({
                        'sn': sn,
                        'msg': '格式错误,请检查格式'
                    })
                    dataSize.processed++
                    continue
                }
                const getDeviceInfoListResult = await request.getDeviceInfoList([parseDevice[0]])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                parseDevice.unshift(getDeviceInfoListResult.data[0].deviceId)
                deviceInfoList.push(parseDevice)
            }
            await sendNtripThresholdValueCommand(deviceInfoList)
        }

        async function QueryDeliveryResults(data) {
            for (let datum of data) {
                const sn = datum.sn
                dataSize.task = sn
                const getDeviceCommandHistoryListResult = await request.getDeviceCommandHistoryList(datum.deviceId)
                if (!getDeviceCommandHistoryListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceCommandHistoryListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                for (let deviceCommandHistoryListElement of getDeviceCommandHistoryListResult.data) {
                    if (datum.jsValue !== '' && datum.jdValue !== '') {
                        break
                    }
                    if (deviceCommandHistoryListElement.commandId === 148) {
                        const commandContent = deviceCommandHistoryListElement.commandContent
                        const responseContent = deviceCommandHistoryListElement.responseContent
                        const type = commandContent.match(/type=(.*?)&/)[1]
                        if (deviceCommandHistoryListElement.responseStatus === 2) {
                            const responseValue = responseContent.match(/threshold=(.*?)&/)
                            if (responseValue !== null) {
                                const value = responseValue[1]
                                if (type === 'js') {
                                    datum.jsResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jsValue = value
                                } else if (type === 'jd') {
                                    datum.jdResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jdValue = value
                                }
                            }
                        }
                    }
                }
                dataSize.processed++
            }
            const head = {
                'sn': 'sn',
                'deviceId': '设备ID',
                'productName': '产品名称',
                'jsResponseTime': '加速度响应时间',
                'jsValue': '加速度阀值',
                'jdResponseTime': '倾角响应时间',
                'jdValue': '倾角阀值',
            }
            const json2ExcelResult = json2Excel(data, head, 'MEMS主机下发指令结果' + formatDate(new Date(), 'yyyyMMddhhmmss'))
            if (json2ExcelResult && failureData.length === 0) {
                await message.success('MEMS主机下发指令结果下载成功')
            } else if (json2ExcelResult || failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("MEMS主机下发指令结果未全部成功，请在excel中查看原因")
            } else {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果下载失败' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("下载失败，请在excel中查看原因")
            }
        }

        async function parseQueryDeliveryResultsInputValue(inputValue) {
            const parseSN = inputValue.split('\n')
            dataSize.inAll = parseSN.length
            const data = []
            for (const sn of parseSN) {
                const getDeviceInfoListResult = await request.getDeviceInfoList([sn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                const dataMap = {
                    'sn': sn,
                    'deviceId': getDeviceInfoListResult.data[0].deviceId,
                    'productName': getDeviceInfoListResult.data[0].productName,
                    'jsResponseTime': '',
                    'jsValue': '',
                    'jdResponseTime': '',
                    'jdValue': '',
                }
                data.push(dataMap)
            }
            await QueryDeliveryResults(data)
        }

        await Swal.fire({
            title: "批量下发设置Nrtip指令",
            input: "textarea",
            inputPlaceholder: "SN号\tip\tport\tname\tpasswd\tmnt",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseThresholdValueCommandInputValue(inputValue)
            },
            preDeny: () => {
                Swal.fire({
                    title: "MEMS主机查询下发阀值结果",
                    input: "textarea",
                    inputPlaceholder: "请输入SN号",
                    allowOutsideClick: false,
                    preConfirm: (inputValue) => {
                        if (inputValue === '') {
                            Swal.showValidationMessage(`请输入SN号`)
                            return
                        }
                        let timerInterval
                        Swal.fire({
                            title: "正在查询下发指令结果",
                            allowOutsideClick: false,
                            html: "当前任务：<b></b><br>已查询：<b></b> / <b></b>",
                            didOpen: () => {
                                Swal.showLoading()
                                const b0 = Swal.getPopup().querySelectorAll("b")[0]
                                const b1 = Swal.getPopup().querySelectorAll("b")[1]
                                const b2 = Swal.getPopup().querySelectorAll("b")[2]
                                timerInterval = setInterval(() => {
                                    b0.textContent = dataSize.task
                                    b1.textContent = dataSize.processed
                                    b2.textContent = dataSize.inAll
                                }, 100)
                            },
                            didDestroy: () => {
                                clearInterval(timerInterval)
                                dataSize = {
                                    task: 0,
                                    processed: 0,
                                    inAll: 0
                                }
                            }
                        })
                        parseQueryDeliveryResultsInputValue(inputValue)
                    },
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
            },
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            denyButtonText: '查询结果'
        })
    }

    /**
     * 下发TCP连接指令弹出框
     * @returns {Promise<void>}
     */
    async function sendTcpCommandsInBatches() {
        let failureData = []
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function sendTcpThresholdValueCommand(deviceInfoList) {
            for (const device of deviceInfoList) {
                const deviceId = device.shift()
                const sn = device.shift()
                dataSize.task = sn
                const ip = device[0]
                const port = device[1]
                const commandArgs = [
                    {
                        "id": "ip",
                        "value": ip
                    },
                    {
                        "id": "port",
                        "value": port
                    }
                ]
                const sendDeviceCommandResult1 = await request.sendDeviceCommand(141, [deviceId], commandArgs)
                if (!sendDeviceCommandResult1.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs,
                        'msg': sendDeviceCommandResult1.msg
                    })
                }
                await sleep(1000)
                const commandArgs2 = [
                    {
                        "id": "port",
                        "value": "tcp"
                    }
                ]
                const sendDeviceCommandResult2 = await request.sendDeviceCommand(143, [deviceId], commandArgs2)
                if (!sendDeviceCommandResult2.r) {
                    failureData.push({
                        'sn': sn,
                        'args': commandArgs2,
                        'msg': sendDeviceCommandResult2.msg
                    })
                }
                // await sleep(500)
                // const commandArgs3 = []
                // const sendDeviceCommandResult3 = await request.sendDeviceCommand(142, [deviceId], commandArgs3)
                // if (!sendDeviceCommandResult3.r) {
                //     failureData.push({
                //         'sn': sn,
                //         'args': commandArgs2,
                //         'msg': sendDeviceCommandResult3.msg
                //     })
                // }
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("批量下发Tcp命令未全部成功，请在控制台中查看下发失败的设备")
            } else {
                return message.success("批量下发Tcp命令成功，请一分钟后再下载下发结果")
            }
        }

        async function parseThresholdValueCommandInputValue(inputValue) {
            let deviceInfoList = []
            let deviceList = inputValue.split('\n')
            dataSize.inAll = deviceList.length
            for (const device of deviceList) {
                let parseDevice = device.split('\t')
                parseDevice = parseDevice.filter(e => e !== '')
                const sn = parseDevice[0]
                if (parseDevice.length !== 3) {
                    failureData.push({
                        'sn': sn,
                        'msg': '格式错误,请检查格式'
                    })
                    dataSize.processed++
                    continue
                }
                const getDeviceInfoListResult = await request.getDeviceInfoList([sn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                parseDevice.unshift(getDeviceInfoListResult.data[0].deviceId)
                deviceInfoList.push(parseDevice)
            }
            await sendTcpThresholdValueCommand(deviceInfoList)
        }

        async function QueryDeliveryResults(data) {
            for (let datum of data) {
                const sn = datum.sn
                dataSize.task = sn
                const getDeviceCommandHistoryListResult = await request.getDeviceCommandHistoryList(datum.deviceId)
                if (!getDeviceCommandHistoryListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceCommandHistoryListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                for (let deviceCommandHistoryListElement of getDeviceCommandHistoryListResult.data) {
                    if (datum.jsValue !== '' && datum.jdValue !== '') {
                        break
                    }
                    if (deviceCommandHistoryListElement.commandId === 148) {
                        const commandContent = deviceCommandHistoryListElement.commandContent
                        const responseContent = deviceCommandHistoryListElement.responseContent
                        const type = commandContent.match(/type=(.*?)&/)[1]
                        if (deviceCommandHistoryListElement.responseStatus === 2) {
                            const responseValue = responseContent.match(/threshold=(.*?)&/)
                            if (responseValue !== null) {
                                const value = responseValue[1]
                                if (type === 'js') {
                                    datum.jsResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jsValue = value
                                } else if (type === 'jd') {
                                    datum.jdResponseTime = deviceCommandHistoryListElement.responseTime
                                    datum.jdValue = value
                                }
                            }
                        }
                    }
                }
                dataSize.processed++
            }
            const head = {
                'sn': 'sn',
                'deviceId': '设备ID',
                'productName': '产品名称',
                'jsResponseTime': '加速度响应时间',
                'jsValue': '加速度阀值',
                'jdResponseTime': '倾角响应时间',
                'jdValue': '倾角阀值',
            }
            const json2ExcelResult = json2Excel(data, head, 'MEMS主机下发指令结果' + formatDate(new Date(), 'yyyyMMddhhmmss'))
            if (json2ExcelResult && failureData.length === 0) {
                await message.success('MEMS主机下发指令结果下载成功')
            } else if (json2ExcelResult || failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("MEMS主机下发指令结果未全部成功，请在excel中查看原因")
            } else {
                console.log(failureData)
                json2Excel(failureData, {}, 'MEMS主机下发指令结果下载失败' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("下载失败，请在excel中查看原因")
            }
        }

        async function parseQueryDeliveryResultsInputValue(inputValue) {
            const parseSN = inputValue.split('\n')
            dataSize.inAll = parseSN.length
            const data = []
            for (const sn of parseSN) {
                const getDeviceInfoListResult = await request.getDeviceInfoList([sn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                const dataMap = {
                    'sn': sn,
                    'deviceId': getDeviceInfoListResult.data[0].deviceId,
                    'productName': getDeviceInfoListResult.data[0].productName,
                    'jsResponseTime': '',
                    'jsValue': '',
                    'jdResponseTime': '',
                    'jdValue': '',
                }
                data.push(dataMap)
            }
            await QueryDeliveryResults(data)
        }

        await Swal.fire({
            title: "批量下发设置Tcp指令",
            input: "textarea",
            inputPlaceholder: "SN号\tip\tport",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入数据`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseThresholdValueCommandInputValue(inputValue)
            },
            preDeny: () => {
                Swal.fire({
                    title: "MEMS主机查询下发阀值结果",
                    input: "textarea",
                    inputPlaceholder: "请输入SN号",
                    allowOutsideClick: false,
                    preConfirm: (inputValue) => {
                        if (inputValue === '') {
                            Swal.showValidationMessage(`请输入SN号`)
                            return
                        }
                        let timerInterval
                        Swal.fire({
                            title: "正在查询下发指令结果",
                            allowOutsideClick: false,
                            html: "当前任务：<b></b><br>已查询：<b></b> / <b></b>",
                            didOpen: () => {
                                Swal.showLoading()
                                const b0 = Swal.getPopup().querySelectorAll("b")[0]
                                const b1 = Swal.getPopup().querySelectorAll("b")[1]
                                const b2 = Swal.getPopup().querySelectorAll("b")[2]
                                timerInterval = setInterval(() => {
                                    b0.textContent = dataSize.task
                                    b1.textContent = dataSize.processed
                                    b2.textContent = dataSize.inAll
                                }, 100)
                            },
                            didDestroy: () => {
                                clearInterval(timerInterval)
                                dataSize = {
                                    task: 0,
                                    processed: 0,
                                    inAll: 0
                                }
                            }
                        })
                        parseQueryDeliveryResultsInputValue(inputValue)
                    },
                    showCancelButton: true,
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                })
            },
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            denyButtonText: '查询结果'
        })
    }

    /**
     * 配置基站弹出框
     * @returns {Promise<void>}
     */
    async function configurationBaseStationSwal() {
        let failureData = []
        const getServerNodeListResult = await request.getServerNodeList()
        if (!getServerNodeListResult.r) {
            return message.error(getServerNodeListResult.msg)
        }
        let baseStationMap = getServerNodeListResult.data
        let map = new Map(Object.entries(baseStationMap))

        // 对Map的键进行排序
        let sortedEntries = [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
        // 根据排序后的键和值重新构建一个新的Map
        baseStationMap = new Map(sortedEntries)
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function configurationBaseStation(serverNodeId, deviceInfo) {
            console.log(serverNodeId, deviceInfo.deviceId)
            // 配置基站
            const addBaseStationResult = await request.addBaseStation(serverNodeId, deviceInfo.deviceId)
            if (!addBaseStationResult.r) {
                failureData.push({
                    'sn': deviceInfo.sn,
                    'msg': addBaseStationResult.msg
                })
            }
        }

        async function parseConfigurationBaseStationInputValue(serverNodeId, inputValue) {
            let baseStationSNList = inputValue.split('\n')
            baseStationSNList = baseStationSNList.filter(e => e !== '')
            dataSize.inAll = baseStationSNList.length
            for (let baseStationSN of baseStationSNList) {
                const sn = baseStationSN
                dataSize.task = sn
                const getDeviceInfoListResult = await request.getDeviceInfoList([baseStationSN])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': sn,
                        'msg': getDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                await configurationBaseStation(serverNodeId, getDeviceInfoListResult.data[0])
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '配置基站失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("配置基站未全部成功，请在excel中查看原因")
            } else {
                return message.success("配置基站成功")
            }
        }

        await Swal.fire({
            title: "配置基站",
            input: "select",
            inputOptions: baseStationMap,
            inputPlaceholder: "请选择服务节点",
            html: `<textarea id="base-station-textarea" class="swal2-input" style="margin-bottom: 0" placeholder="请输入基站SN号，多个SN号以换行符分隔"></textarea>`,
            allowOutsideClick: false,
            preConfirm: (serverNodeId) => {
                const inputValue = document.getElementById("base-station-textarea").value
                if (serverNodeId === '') {
                    Swal.showValidationMessage(`请选择服务节点`)
                    return
                } else if (inputValue === '') {
                    Swal.showValidationMessage(`请输入基站`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    allowOutsideClick: false,
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    didOpen: async () => {
                        Swal.showLoading()
                        const b0 = await Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = await Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = await Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseConfigurationBaseStationInputValue(serverNodeId, inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 绑定基站弹出框
     * @returns {Promise<void>}
     */
    async function boundBaseStationSwal() {
        let failureData = []
        const getBaseStationListResult = await request.getBaseStationList()
        if (!getBaseStationListResult.r) {
            return message.error(getBaseStationListResult.msg)
        }
        let baseStationMap = getBaseStationListResult.data
        let map = new Map(Object.entries(baseStationMap))
        // 对Map的键进行排序
        let sortedEntries = [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
        // 根据排序后的键和值重新构建一个新的Map
        baseStationMap = new Map(sortedEntries)
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function boundBaseStation(baseStationId, baseStationServerNodeId, surveyStationInfo) {
            // 绑定基站
            const bindBaseStationResult = await request.bindBaseStation(baseStationId, baseStationServerNodeId, surveyStationInfo.deviceId)
            if (!bindBaseStationResult.r) {
                failureData.push({
                    'sn': surveyStationInfo.sn,
                    'msg': bindBaseStationResult.msg
                })
            }
        }

        async function parseBoundBaseStationInputValue(baseStationSN, baseStationId, inputValue) {
            // 测站SN号
            let surveyStationSNList = inputValue.split('\n')
            surveyStationSNList = surveyStationSNList.filter(e => e !== '')
            dataSize.inAll = surveyStationSNList.length
            const getBaseStationDeviceInfoListResult = await request.getDeviceInfoList([baseStationSN])
            if (!getBaseStationDeviceInfoListResult.r) {
                return message.error(getBaseStationDeviceInfoListResult.msg)
            }
            // 开启基站解算
            const activeOrStopResolvingResult = await request.activeOrStopResolving(1, getBaseStationDeviceInfoListResult.data[0].deviceId)
            if (!activeOrStopResolvingResult.r) {
                return message.error(activeOrStopResolvingResult.msg)
            }
            // 基站服务器节点
            const getBaseStationServerNodeInfoResult = await request.getBaseStationServerNodeInfo(baseStationId)
            if (!getBaseStationServerNodeInfoResult.r) {
                return message.error(activeOrStopResolvingResult.msg)
            }
            const baseStationServerNodeId = getBaseStationServerNodeInfoResult.data.id
            for (const surveyStationSN of surveyStationSNList) {
                dataSize.task = surveyStationSN
                const getSurveyStationDeviceInfoListResult = await request.getDeviceInfoList([surveyStationSN])
                if (!getSurveyStationDeviceInfoListResult.r) {
                    failureData.push({
                        'sn': surveyStationSN,
                        'msg': getSurveyStationDeviceInfoListResult.msg
                    })
                    dataSize.processed++
                    continue
                }
                await boundBaseStation(baseStationId, baseStationServerNodeId, getSurveyStationDeviceInfoListResult.data[0])
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '绑定基站失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("绑定基站未全部成功，请在excel中查看原因")
            } else {
                return message.success("绑定基站成功")
            }
        }

        await Swal.fire({
            title: "绑定基站",
            input: "select",
            inputOptions: baseStationMap,
            inputPlaceholder: "请选择基站",
            html: `<textarea id="swal-textarea" class="swal2-input" style="margin-bottom: 0" placeholder="请输入SN号，多个SN号以换行符分隔"></textarea>`,
            allowOutsideClick: false,
            preConfirm: (baseStationId) => {
                const inputValue = document.getElementById("swal-textarea").value
                if (baseStationId === '') {
                    Swal.showValidationMessage(`请选择基站`)
                    return
                }
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入测站`)
                    return
                }
                const baseStationSN = baseStationMap.get(baseStationId).match(/\((\S*)\)/)[1]
                let timerInterval
                Swal.fire({
                    title: '正在绑定，请稍候!',
                    allowOutsideClick: false,
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    didOpen: async () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseBoundBaseStationInputValue(baseStationSN, baseStationId, inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 初始化基站弹出框
     * @returns {Promise<void>}
     */
    async function initializeStationSwal() {
        let failureData = []
        let unit = ''
        let source = ''
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function initializeStation(deviceSn, XYH, deviceId) {
            // 获取测站配置信息
            const getSurveyStationConfigInfoResult = await request.getSurveyStationConfigInfo(deviceId)
            if (!getSurveyStationConfigInfoResult.r) {
                failureData.push({'sn': deviceSn, 'msg': getSurveyStationConfigInfoResult.msg})
                return
            }
            const surveyStationConfigInfo = getSurveyStationConfigInfoResult.data
            // 判断是否有初始值
            if (surveyStationConfigInfo.initX !== 0 && surveyStationConfigInfo.initY !== 0 && surveyStationConfigInfo.initH !== 0) {
                failureData.push({'sn': deviceSn, 'msg': "测站已配置初始化"})
                return
            }
            // 获取初始值
            const getRefreshCoordinateResult = await request.getRefreshCoordinate(deviceId)
            if (!getRefreshCoordinateResult.r) {
                failureData.push({'sn': deviceSn, 'msg': getRefreshCoordinateResult.msg})
                return
            }
            const refreshCoordinate = getRefreshCoordinateResult.data
            // 转换值
            let conversionValue = 1000
            if (unit === 'mm') {
                conversionValue = 1000
            } else if (unit === 'm') {
                conversionValue = 1
            }
            // 最新XYH数据
            const surveyStationXYH = XYH
            const X = surveyStationXYH[0]
            const Y = surveyStationXYH[1]
            const H = surveyStationXYH[2]
            surveyStationConfigInfo.isbase = 0
            surveyStationConfigInfo.deviceId = deviceId
            surveyStationConfigInfo.initX = parseFloat((refreshCoordinate.initX - (X / conversionValue)).toFixed(4))
            surveyStationConfigInfo.initY = parseFloat((refreshCoordinate.initY - (Y / conversionValue)).toFixed(4))
            if (source === 'MAS3') {
                surveyStationConfigInfo.initH = parseFloat((refreshCoordinate.initH + (H / conversionValue)).toFixed(4))
            } else if (source === 'SIM') {
                surveyStationConfigInfo.initH = parseFloat((refreshCoordinate.initH - (H / conversionValue)).toFixed(4))
            }
            const updateCoordinateResult = await request.updateCoordinate(surveyStationConfigInfo)
            if (!updateCoordinateResult.r) {
                failureData.push({'sn': deviceSn, 'msg': updateCoordinateResult.msg})
            }
        }

        async function parseInitializeStationInputValue(surveyStation) {
            let surveyStationsList = surveyStation.split('\n')
            surveyStationsList = surveyStationsList.filter(e => e !== '')

            dataSize.inAll = surveyStationsList.length
            for (const surveyStationXYHStr of surveyStationsList) {
                const surveyStationXYH = surveyStationXYHStr.split('\t')
                if (surveyStationXYH.length !== 4) {
                    failureData.push({'source': surveyStationXYHStr, 'msg': '格式错误请检查后提交'})
                    dataSize.processed++
                    continue
                }
                const deviceSn = surveyStationXYH.shift()
                dataSize.task = deviceSn
                const XYH = surveyStationXYH
                const getDeviceInfoListResult = await request.getDeviceInfoList([deviceSn])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({'sn': deviceSn, 'msg': getDeviceInfoListResult.msg})
                    dataSize.processed++
                    continue
                }
                await initializeStation(deviceSn, XYH, getDeviceInfoListResult[0].pop().deviceId)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '初始化测站失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("初始化测站未全部成功，请在excel中查看原因")
            } else {
                return message.success("初始化测站成功")
            }
        }

        await Swal.fire({
            title: "配置测站",
            input: "textarea",
            inputPlaceholder: "格式为'SN号\tX\tY\tH'，多个SN号以换行符分隔",
            html: "<div><label>数据来源：</label><select class='swal2-select' id='source_select' name='source'><option value='' selected>请选择数据来源</option><option value='MAS3'>MAS3</option><option value='SIM'>SIM</option></select></div>" +
                "<div><label>数据单位：</label><select class='swal2-select' id='unit_select' name='unit'><option value='' selected>请选择数据单位</option><option value='mm'>毫米</option><option value='m'>米</option></select></div>",
            allowOutsideClick: false,
            preConfirm: (inputValue) => {
                source = document.getElementById("source_select").value
                unit = document.getElementById("unit_select").value
                if (source === '') {
                    Swal.showValidationMessage(`请选择数据来源`)
                    return
                }
                if (unit === '') {
                    Swal.showValidationMessage(`请选择数据单位`)
                    return
                }
                if (inputValue === '') {
                    Swal.showValidationMessage(`请输入测站`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    allowOutsideClick: false,
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    didOpen: async () => {
                        Swal.showLoading()
                        const b0 = Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseInitializeStationInputValue(inputValue)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 删除基站解算弹出框
     * @returns {Promise<void>}
     */
    async function deleteBaseStationSolutionSwal() {
        let failureData = []
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function deleteBaseStationSolution(deviceSn, deviceId) {
            // 先停止解算，再删除站点；先删除站点，最后删除基站
            // 停止解算
            const activeOrStopResolvingResult = await request.activeOrStopResolving(0, deviceId)
            if (!activeOrStopResolvingResult.r) {
                failureData.push({'sn': deviceSn, 'msg': activeOrStopResolvingResult.msg})
                return
            }
            // 删除站点
            const deleteStationResult = await request.deleteStation(deviceId)
            if (!deleteStationResult.r) {
                failureData.push({'sn': deviceSn, 'msg': deleteStationResult.msg})
            }
        }

        async function parseDeleteBaseStationSolutionInputValue(baseNodeStr) {
            const getGNSSInfoListResult = await request.getGNSSInfoList([baseNodeStr])
            if (!getGNSSInfoListResult.r) {
                return message.error(getGNSSInfoListResult.msg)
            }
            dataSize.inAll = getGNSSInfoListResult.data.length
            if (getGNSSInfoListResult.data.length > 0 && getGNSSInfoListResult.data[0].isBaseStation !== 1) {
                return message.error(baseNodeStr + "不是基站，请重新输入基站")
            }
            getGNSSInfoListResult.data.reverse()
            for (let stationInfo of getGNSSInfoListResult.data) {
                const deviceSn = stationInfo.sn
                const deviceId = stationInfo.deviceId
                dataSize.task = deviceSn
                await deleteBaseStationSolution(deviceSn, deviceId)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '删除基站解算失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("删除基站解算未全部成功，请在excel中查看原因")
            } else {
                return message.success("删除基站解算成功")
            }
        }

        await Swal.fire({
            title: "删除基站解算",
            input: "text",
            inputPlaceholder: "基站SN号",
            allowOutsideClick: false,
            preConfirm: (baseNodeStr) => {
                if (baseNodeStr === '') {
                    Swal.showValidationMessage(`请输入基站SN号`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    allowOutsideClick: false,
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    didOpen: async () => {
                        Swal.showLoading()
                        const b0 = await Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = await Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = await Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseDeleteBaseStationSolutionInputValue(baseNodeStr)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }

    /**
     * 删除测站解算弹出框
     * @returns {Promise<void>}
     */
    async function deleteSurveyStationSolutionSwal() {
        let failureData = []
        let dataSize = {
            task: 0,
            processed: 0,
            inAll: 0
        }

        async function deleteSurveyStationSolution(deviceSn, deviceId) {
            // 先停止解算，再删除站点；先删除站点，最后删除基站
            // 停止解算
            const activeOrStopResolvingResult = await request.activeOrStopResolving(0, deviceId)
            if (!activeOrStopResolvingResult.r) {
                failureData.push({'sn': deviceSn, 'msg': activeOrStopResolvingResult.msg})
                return
            }
            // 删除站点
            const deleteStationResult = await request.deleteStation(deviceId)
            if (!deleteStationResult.r) {
                failureData.push({'sn': deviceSn, 'msg': deleteStationResult.msg})
            }
        }


        async function parseDeleteSurveyStationSolutionInputValue(surveyStationStr) {
            const surveyStationList = surveyStationStr.split('\n')
            dataSize.inAll = surveyStationList.length
            for (let surveyStation of surveyStationList) {
                dataSize.task = surveyStation
                const getDeviceInfoListResult = await request.getDeviceInfoList([surveyStation])
                if (!getDeviceInfoListResult.r) {
                    failureData.push({'sn': surveyStation, 'msg': getDeviceInfoListResult.msg})
                    dataSize.processed++
                    continue
                }
                const deviceInfo = getDeviceInfoListResult.data[0]
                const deviceSn = deviceInfo.sn
                const deviceId = deviceInfo.deviceId
                await deleteSurveyStationSolution(deviceSn, deviceId)
                dataSize.processed++
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                json2Excel(failureData, {}, '删除测站解算失败信息' + formatDate(new Date(), 'yyyyMMddhhmmss'))
                return message.error("删除测站解算未全部成功，请在excel中查看原因")
            } else {
                return message.success("删除测站解算成功")
            }
        }

        await Swal.fire({
            title: "删除测站解算",
            input: "textarea",
            inputPlaceholder: "测站SN号\n测站SN号",
            allowOutsideClick: false,
            preConfirm: (surveyStationStr) => {
                if (surveyStationStr === '') {
                    Swal.showValidationMessage(`请输入测站SN号`)
                    return
                }
                let timerInterval
                Swal.fire({
                    title: '正在处理数据，请稍候!',
                    allowOutsideClick: false,
                    html: "当前任务：<b></b><br>已处理：<b></b> / <b></b>",
                    didOpen: async () => {
                        Swal.showLoading()
                        const b0 = await Swal.getPopup().querySelectorAll("b")[0]
                        const b1 = await Swal.getPopup().querySelectorAll("b")[1]
                        const b2 = await Swal.getPopup().querySelectorAll("b")[2]
                        timerInterval = setInterval(() => {
                            b0.textContent = dataSize.task
                            b1.textContent = dataSize.processed
                            b2.textContent = dataSize.inAll
                        }, 100)
                    },
                    didDestroy: () => {
                        clearInterval(timerInterval)
                    }
                })
                parseDeleteSurveyStationSolutionInputValue(surveyStationStr)
            },
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText: "取消"
        })
    }


    /**
     * 添加按钮
     */
    function addButton(id, innerText, event) {
        const toolBar = document.querySelector(".tableTool___1Z3Xm div")
        const button = document.createElement("button")
        button.setAttribute("id", id)
        button.setAttribute("class", "ant-btn ant-btn-ghost")
        button.setAttribute("style", "margin-left: 10px; margin-bottom: 5px")
        button.innerText = innerText
        button.addEventListener("click", event)
        toolBar == null ? void 0 : toolBar.appendChild(button)
    }

    /**
     * 休眠时间
     * @param ms
     * @returns {Promise<unknown>}
     */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    /**
     * 单个sheet下载
     * @param {object[]} json json
     * @param {object} head excel表头名称
     * @param {string} fileName 文件名称
     * @param {object} wbConfig 扩展
     * @param {object} woptsConfig 扩展
     */
    function json2Excel(json, head = {}, fileName = '错误信息' + formatDate(new Date(), 'yyyyMMddhhmmss'), wbConfig = {}, woptsConfig = {}) {
        let wopts = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        }
        let workBook = {
            SheetNames: ['Sheet1'],
            Sheets: {},
            Props: {}
        }
        const skipHeader = Object.keys(head).length !== 0
        if (skipHeader) {
            json = [head, ...json]
        }
        workBook.Sheets['Sheet1'] = XLSX.utils.json_to_sheet(json, {'skipHeader': skipHeader}) // skipHeader 忽略原来的表头

        return saveAs(new Blob([changeData(XLSX.write({...workBook, ...wbConfig}, {...wopts, ...woptsConfig}))], {type: 'application/octet-stream'}), fileName)
    }

    /**
     * 多个sheet下载
     * @param {object} data
     * @param data.Sheet1.head {}
     * @param data.Sheet1.data []
     * @param {string} fileName 文件名称
     * data格式
     * {
     'sheet1':{
     head:{name:'名字',age:'年龄'},
     json:[{name:'sd',age:1999}]
     },
     'sheet2':{
     head:{name:'名字',age:'年龄'},
     json:[{name:'z',age:195}]
     },
     }
     */

    function json2ExcelMultiSheet(data, fileName) {
        let wopts = {
            bookType: 'xlsx',
            bookSST: false,
            type: 'binary'
        }
        let workBook = {
            SheetNames: [],
            Sheets: {},
            Props: {}
        }
        let keys = Object.keys(data)
        keys.forEach(key => {
            const head = data[key].head
            const skipHeader = Object.keys(head).length !== 0
            let json = data[key].json
            if (skipHeader) {
                json = [head, ...json]
            }
            workBook.SheetNames.push(key)
            workBook.Sheets[key] = XLSX.utils.json_to_sheet(json, {skipHeader: skipHeader}) // skipHeader 忽略原来的表头
        })
        saveAs(new Blob([changeData(XLSX.write(workBook, wopts))], {type: 'application/octet-stream'}), fileName)
    }

    /**
     * 将数据处理成需要输出的格式
     *
     * @param s
     * @returns {any[]|ArrayBuffer}
     */
    function changeData(s) {
        // 如果存在ArrayBuffer对象(es6) 最好采用该对象
        if (typeof ArrayBuffer !== 'undefined') {

            //1、创建一个字节长度为s.length的内存区域
            let buf = new ArrayBuffer(s.length)

            //2、创建一个指向buf的Unit8视图，开始于字节0，直到缓冲区的末尾
            let view = new Uint8Array(buf)

            //3、返回指定位置的字符的Unicode编码
            for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
            return buf

        } else {
            let buf = new Array(s.length)
            for (let i = 0; i !== s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF
            return buf
        }
    }

    /**
     * 下载excel
     * @param obj
     * @param fileName
     */
    function saveAs(obj, fileName) {//当然可以自定义简单的下载文件实现方式
        try {
            let tmp = document.createElement("a")
            tmp.download = fileName + '.xlsx' || "失败数据.xlsx"
            tmp.href = URL.createObjectURL(obj) //绑定a标签
            tmp.click() //模拟点击实现下载

            setTimeout(function () { //延时释放
                URL.revokeObjectURL(obj) //用URL.revokeObjectURL()来释放这个object URL
            }, 100)
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * 格式化时间
     * @param time
     * @param fmt
     * @returns {string}
     */
    function formatDate(time, fmt = 'yyyy-MM-dd hh:mm:ss') {
        const date = new Date(time)
        const o = {
            'M+': date.getMonth() + 1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds(),
            'q+': Math.floor((date.getMonth() + 3) / 3),
            S: date.getMilliseconds(), //毫秒
        }
        if (/(y+)/i.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
        }
        for (const k in o) {
            if (new RegExp('(' + k + ')', 'i').test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
            }
        }
        return fmt
    }

    const request = {
        getSupplierInfo: () => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/user/info/mine",
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data.user
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getDeviceInfoList: deviceSNList => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {"limit": 1000, "offset": 0, "search": {"snList": deviceSNList}}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/info/list",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            if (res.response.data.list.length === 0) {
                                result.msg = '未找到该设备'
                            } else {
                                result.r = true
                                result.data = res.response.data.list
                            }
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getMonitorTopologyList: (deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/info/list/monitors/topology?deviceId=" + deviceId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data.monitorInfo
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        updateDeviceInfo: (deviceInfo, monitorTopologyList) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                childUpdateRequest: [],
                device: deviceInfo,
                isNetDevice: 'noDevice',
                monitorRequests: monitorTopologyList,
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "PUT",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/info/update",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        sendDeviceCommand: (command, deviceList, commandArgs) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                "commandId": command,
                "deviceIds": deviceList,
                "commandArgs": commandArgs
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "PUT",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/command/send",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getDeviceCommandHistoryList: (deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {"limit": 10, "offset": 0, "search": {"deviceId": deviceId}}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/command/history/list",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data.list
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getBaseStationList: () => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            let baseStationList = {}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/listBase",
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            for (const baseStation of res.response.data) {
                                baseStationList[baseStation.stationId] = baseStation.stationName
                            }
                            result.r = true
                            result.data = baseStationList
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getBaseStationServerNodeInfo: (baseStationId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/serverNode/baseStation/" + baseStationId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getGNSSInfoList: (baseStationSN) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {"limit": 1000, "offset": 0, "search": {"snList": baseStationSN}}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/gnss/list",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            if (res.response.data.list.length === 0) {
                                result.msg = '未找到GNSS设备'
                            } else {
                                result.r = true
                                result.data = res.response.data.list
                            }
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        bindBaseStation: (baseStationId, baseStationServerNodeID, deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                "isBase": 0,
                "baseId": baseStationId,
                "serverId": baseStationServerNodeID,
                "dataType": "RTCM3",
                "connectType": "MQTT",
                "initX": 0,
                "initY": 0,
                "initH": 0,
                "deviceId": deviceId
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/add",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        activeOrStopResolving: (active, deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/active?active=" + active + "&deviceId=" + deviceId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getSurveyStationConfigInfo: (deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/getInfo/" + deviceId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getRefreshCoordinate: (deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/refreshCoordinate/" + deviceId,
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                            result.data = res.response.data
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        updateCoordinate: (surveyStationConfigInfo) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/edit",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(surveyStationConfigInfo),
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getServerNodeList: () => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            let serverNodeList = {}
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/serverNode/list/all/name",
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            for (const serverNode of res.response.data) {
                                serverNodeList[serverNode.id] = serverNode.name
                            }
                            result.r = true
                            result.data = serverNodeList
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        addBaseStation: (serverNodeId, deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                "isBase": 1,
                "isCors": 0,
                "serverId": serverNodeId,
                "dataType": "RTCM3",
                "connectType": "MQTT",
                "deviceId": deviceId
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/add",
                    headers: headers,
                    responseType: 'JSON',
                    data: JSON.stringify(data),
                    onload: function (res) {
                        console.log(res.response)
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        deleteStation: (deviceId) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/station/delete?deviceId=" + deviceId,
                    method: "POST",
                    headers: headers,
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        addProject: (data) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    url: "http://iot-monitor.huacenav.com/chcnavThings/iot/device/project/add",
                    method: "POST",
                    headers: headers,
                    data: JSON.stringify(data),
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        updateProjectDevice: (projectId, addIds, removeIds) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                "addIds": addIds,
                "projectId": projectId,
                "removeIds": removeIds
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    url: 'http://iot-monitor.huacenav.com/chcnavThings/iot/device/project/update/device',
                    method: "POST",
                    headers: headers,
                    data: JSON.stringify(data),
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            result.r = true
                        } else {
                            result.msg = res.response.msg || res.response.message
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
        getProjectId: (name) => {
            let result = {
                r: false,
                data: null,
                msg: null
            }
            const data = {
                "limit": 20,
                "offset": 0,
                "search": {
                    "name": name
                }
            }
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    url: 'http://iot-monitor.huacenav.com/chcnavThings/iot/device/project/list',
                    method: "POST",
                    headers: headers,
                    data: JSON.stringify(data),
                    responseType: 'JSON',
                    onload: function (res) {
                        if (res.response.code === 200) {
                            if (res.response.data.list.length === 0) {
                                result.msg = '未找到监测点'
                            } else if (res.response.data.list.length !== 1) {
                                result.msg = '找到多个监测点'
                            } else {
                                result.r = true
                                result.data = res.response.data.list
                            }
                        } else {
                            result.msg = res.response.msg || res.response.message
                        }
                        resolve(result)
                    },
                    onerror: function (error) {
                        result.msg = error
                        resolve(result)
                    }
                })
            })
        }
    }

    if (location.pathname !== "/login") {
        createToolFunction()
    }

    /**
     * 创建工具菜单
     */
    function createToolFunction() {

        let navbarDiv = null // 用于存储动态创建的菜单
        let tools = null
        let select = false

        createTools()

        function createTools() {
            // 创建一个div元素
            tools = document.createElement('div')
            tools.id = 'tools'
            tools.textContent = '工具'
            // 设置样式
            setToolStyles(tools)
            // 将元素添加到body中
            document.body.appendChild(tools)

            let active = false
            let currentX
            let currentY
            let initialX
            let initialY
            let xOffset = 0
            let yOffset = 0

            tools.addEventListener('mouseenter', () => {
                tools.style.left = '0'
                tools.style.backgroundColor = 'rgb(133,133,133)'
                showMenu()
            }, false)

            tools.addEventListener('mouseleave', () => {
                if (select) {
                    tools.style.left = '-25px'
                    tools.style.backgroundColor = 'rgb(133,133,133,0.5)'
                    hideMenu()
                }
            }, false)

            tools.addEventListener('mousedown', (e) => {
                hideMenu()
                if (e.target === tools) {
                    active = true
                    currentX = e.clientX - xOffset
                    currentY = e.clientY - yOffset
                    // 获取或设置初始位置（如果尚未设置）
                    initialX = tools.offsetLeft || 0
                    initialY = tools.offsetTop || 0
                    e.preventDefault() // 阻止默认行为
                }
            }, false)

            document.addEventListener('mousemove', (e) => {
                if (active) {
                    select = true
                    e.preventDefault()

                    // 计算新的位置
                    let x = e.clientX - currentX
                    let y = e.clientY - currentY

                    // 限制移动范围（可选）
                    x = Math.max(0, Math.min(window.innerWidth - tools.offsetWidth, x + initialX))
                    y = Math.max((window.innerHeight + 50) / 2, Math.min(window.innerHeight - tools.offsetHeight - 1, y + initialY))

                    // 更新悬浮框的位置
                    // tools.style.left = `${x}px`
                    tools.style.top = `${y}px`
                    localStorage.setItem('toolStyleTop', String(y))
                }
            }, false)

            document.addEventListener('mouseup', () => {
                select = true
                initialX = tools.offsetLeft
                initialY = tools.offsetTop
                active = false
            }, false)

            // 设置工具样式
            function setToolStyles(tools) {
                tools.style.left = '-25px'
                tools.style.top = localStorage.getItem('toolStyleTop') !== null ? localStorage.getItem('toolStyleTop') + 'px' : (window.innerHeight - 300) + 'px'
                tools.style.position = 'absolute'
                tools.style.width = '50px'
                tools.style.height = '50px'
                tools.style.backgroundColor = 'rgba(133,133,133,0.49)'
                tools.style.color = 'white'
                tools.style.textAlign = 'center'
                tools.style.lineHeight = '50px'
                tools.style.cursor = 'move'
                tools.style.borderRadius = '50%'
                tools.style.userSelect = 'none' // 防止文本被选中
            }
        }

        function createMenu() {
            const toolMenus = [
                {
                    "name": "监测点管理",
                    "swal": () => {
                    },
                    'child': [
                        {
                            "name": "批量添加监测点",
                            "swal": addMonitoringPointsInBatchesSwal,
                        },
                        {
                            "name": "批量绑定设备",
                            "swal": batchBindDeviceSwal,
                        }
                    ]
                },
                {
                    "name": "设备管理",
                    "swal": () => {
                    },
                    'child': [
                        {
                            "name": "批量修改设备名称",
                            "swal": editDeviceNameSwal,
                        },
                        {
                            "name": "批量下发MEMS阈值指令",
                            "swal": sendMEMSThresholdValueCommandSwal,
                        },
                        {
                            "name": "批量下发Ntrip指令",
                            "swal": sendNtripCommandsInBatches,
                        },
                        {
                            "name": "批量下发Tcp指令",
                            "swal": sendTcpCommandsInBatches,
                        }
                    ]
                }
                // },
                // {
                //     "name": "解算配置",
                //     "swal": () => {
                //     },
                //     'child': [
                //         {
                //             "name": "批量配置基站",
                //             "swal": configurationBaseStationSwal
                //         },
                //         {
                //             "name": "批量绑定基站",
                //             "swal": boundBaseStationSwal
                //         },
                //         {
                //             "name": "批量初始化测站",
                //             "swal": initializeStationSwal
                //         },
                //         {
                //             "name": "批量删除基站解算",
                //             "swal": deleteBaseStationSolutionSwal
                //         },
                //         {
                //             "name": "批量删除测站解算",
                //             "swal": deleteSurveyStationSolutionSwal
                //         },
                //     ]
                // }
            ]

            // 创建style元素并添加基本CSS样式
            function createStyle() {
                const style = document.createElement('style');
                document.head.appendChild(style);
                style.sheet.insertRule('ul#navbar { list-style-type: none; padding: 0; background-color: #333333; width: 100%; }', 0);
                style.sheet.insertRule('ul#navbar li { position: relative; }', 1);
                style.sheet.insertRule('ul#navbar li a { color: white; text-decoration: none; padding: 10px; display: block; }', 2);
                style.sheet.insertRule('ul#navbar ul.dropdown-content { display: none; position: absolute; top: 0; left: 100%; background-color: #f9f9f9; min-width: 140px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); }', 3);
                style.sheet.insertRule('ul#navbar li:hover > ul.dropdown-content { display: block; padding: 0; list-style-type: none; }', 4);
                style.sheet.insertRule('ul#navbar li:hover > ul > li{ background-color: #6E6E6E; }', 5);
                style.sheet.insertRule('ul#navbar li:hover > a { background-color: #1A1A1A; }', 6);
            }

            // 创建导航栏容器
            function createNavbar() {
                // 创建导航栏容器
                navbarDiv = document.createElement('div')
                navbarDiv.style.position = 'absolute'
                navbarDiv.style.display = 'none'
                navbarDiv.style.float = 'left'
                const navbar = document.createElement('ul');
                navbarDiv.appendChild(navbar)
                navbar.id = 'navbar';
                navbarDiv.addEventListener('mouseleave', () => {
                    tools.style.left = '-25px'
                    tools.style.backgroundColor = 'rgb(133,133,133,0.5)'
                    hideMenu()
                }, false)
                navbarDiv.addEventListener('mouseenter', () => {
                    select = true
                }, false)
                return navbar;
            }

            // 辅助函数：创建菜单项
            function createMenuItem(name, swalFunc, children) {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = name;
                a.href = '#';
                a.onclick = function (event) {
                    event.preventDefault();
                    if (typeof swalFunc === 'function') {
                        swalFunc(); // 调用对应的swal函数
                    }
                };
                li.appendChild(a);

                if (children && children.length > 0) {
                    const dropdown = document.createElement('ul');
                    dropdown.className = 'dropdown-content';
                    dropdown.style.display = 'none'; // 初始时不显示子菜单
                    children.forEach(child => {
                        const subItem = createMenuItem(child.name, child.swal, child.child);
                        dropdown.appendChild(subItem);
                    });
                    li.appendChild(dropdown);
                    // 为父菜单项添加鼠标悬停事件以显示子菜单
                    li.addEventListener('mouseenter', function () {
                        this.children[1].style.display = 'block';
                    });
                    li.addEventListener('mouseleave', function () {
                        this.children[1].style.display = 'none';
                    });
                }

                return li;
            }

            // 将菜单数据转换为DOM元素
            function createMenuDOM(menus) {
                const navbar = createNavbar();
                menus.forEach(menu => {
                    const menuItem = createMenuItem(menu.name, menu.swal, menu.child);
                    navbar.appendChild(menuItem);
                });
                document.body.appendChild(navbarDiv);
            }

            // 初始化
            createStyle();
            createMenuDOM(toolMenus);
        }

        // 显示菜单
        function showMenu() {
            if (!navbarDiv) createMenu() // 如果菜单还未创建，则先创建
            navbarDiv.style.display = 'flex'
            updateMenuPosition() // 更新菜单位置
        }

        // 隐藏菜单
        function hideMenu() {
            navbarDiv.style.display = 'none'
            select = false
        }

        // 更新菜单位置
        function updateMenuPosition() {
            const menuRect = navbarDiv.getBoundingClientRect()
            const toolsRect = tools.getBoundingClientRect()
            navbarDiv.style.left = `${toolsRect.right + 10}px` // 悬浮框右侧
            navbarDiv.style.bottom = `${window.innerHeight - toolsRect.bottom - (menuRect.height - toolsRect.width) / 2}px` // 悬浮框顶部（或根据需要调整）
        }
    }
})
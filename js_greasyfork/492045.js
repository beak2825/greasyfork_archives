// ==UserScript==
// @name         CPS3.0 位移监测服务系统批量停止RTK
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  批量停止RTK
// @license      End-User License Agreement
// @author       Lp
// @match        http://119.3.58.127:8085/engine/rtk*
// @icon         data:image/png;base64,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
// @require      https://registry.npmmirror.com/jquery/3.7.0/files/dist/jquery.min.js
// @require      https://registry.npmmirror.com/sweetalert2/10.16.6/files/dist/sweetalert2.all.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/492045/CPS30%20%E4%BD%8D%E7%A7%BB%E7%9B%91%E6%B5%8B%E6%9C%8D%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%89%B9%E9%87%8F%E5%81%9C%E6%AD%A2RTK.user.js
// @updateURL https://update.greasyfork.org/scripts/492045/CPS30%20%E4%BD%8D%E7%A7%BB%E7%9B%91%E6%B5%8B%E6%9C%8D%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%89%B9%E9%87%8F%E5%81%9C%E6%AD%A2RTK.meta.js
// ==/UserScript==

(function () {
    'use strict';

    $(function () {
        const cps = JSON.parse(sessionStorage.getItem('CPS_TOKEN'))

        const headers = {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json;charset=UTF-8',
            Authorization: `${cps.tokenHead} ${cps.token}`,
        }

        let dataSize = {
            processed: 0,
            inAll: 0
        }

        let toast = Swal.mixin({
            allowOutsideClick: false,
            confirmButtonText: '确认',
            didOpen: () => {
                Swal.hideLoading()
            }
        });

        const message = {
            success: (text) => {
                toast.fire({title: text, icon: 'success'});
            },
            error: (text) => {
                toast.fire({title: text, icon: 'error'});
            },
            warning: (text) => {
                toast.fire({title: text, icon: 'warning'});
            },
            info: (text) => {
                toast.fire({title: text, icon: 'info'});
            },
            question: (text) => {
                toast.fire({title: text, icon: 'question'});
            }
        };

        addButton()

        /**
         * 添加按钮
         */
        function addButton() {
            const div = document.createElement("div");
            div.setAttribute("id", "updateDiv");
            div.setAttribute("class", "ant-space-item");
            const toolBar = document.querySelector(".ant-space");
            toolBar == null ? void 0 : toolBar.appendChild(div);
            const btn = document.createElement("button");
            btn.setAttribute("id", "updateName");
            btn.setAttribute("class", "ant-btn ant-btn-default");
            btn.setAttribute("type", "button")
            btn.innerText = "批量停止RTK";
            btn.addEventListener("click", deviceInput);
            const toolBar2 = document.querySelector("#updateDiv");
            toolBar2 == null ? void 0 : toolBar2.appendChild(btn);
        }

        /**
         * SN输入框
         */
        async function deviceInput() {
            await Swal.fire({
                title: "批量停止RTK",
                input: "textarea",
                inputPlaceholder: "格式为'SN号'，修改多个设备名称以换行符分隔",
                allowOutsideClick: false,
                preConfirm: (inputValue) => {
                    if (inputValue === '') {
                        Swal.showValidationMessage(`请输入数据`);
                        return
                    }
                    let timerInterval;
                    Swal.fire({
                        title: '正在处理数据，请稍候!',
                        html: "已处理 <b></b> / <b></b>",
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading()
                            const b1 = Swal.getPopup().querySelectorAll("b")[0];
                            const b2 = Swal.getPopup().querySelectorAll("b")[1];
                            b1.textContent = 0;
                            b2.textContent = 0
                            timerInterval = setInterval(() => {
                                b1.textContent = dataSize.processed;
                                b2.textContent = dataSize.inAll
                            }, 500);
                        },
                        didDestroy: () => {
                            clearInterval(timerInterval);
                        }
                    })
                    parseDeviceStr(inputValue)
                },
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            });
        }

        /**
         * 解析
         */
        async function parseDeviceStr(deviceStr) {
            // 基站
            const baseStationList = deviceStr.split('\n')
            const baseStationParseList = []
            const notFound = []
            for (const baseStation of baseStationList) {
                const baseStationInfo = await request.search(baseStation)
                if (baseStationInfo.length !== 0) {
                    baseStationParseList.push({
                        'sn': baseStation,
                        'id': baseStationInfo[0].id
                    })
                }else{
                    notFound.push({sn: parseInt(baseStation), msg: '未找到基站'})
                }
            }
            dataSize.inAll = baseStationParseList.length
            await stopRTK(baseStationParseList,notFound)
        }

        /**
         * 停止RTK
         * @param baseStationParseList
         * @returns {Promise<void>}
         */
        async function stopRTK(baseStationParseList,notFound) {
            const failureData = notFound
            for (const baseStation of baseStationParseList) {
                const result = await request.stop([baseStation.id])
                if (!result.r) {
                    failureData.push({sn: parseInt(baseStation.sn), msg: result.msg})
                }
            }
            dataSize = {
                processed: 0,
                inAll: 0
            }
            if (failureData.length !== 0) {
                console.log(failureData)
                return message.error("批量停止RTK未全部成功，请在控制台中查看修改失败的设备")
            } else {
                return message.success("批量停止RTK成功")
            }
        }


        const request = {
            search: (baseStation) => {
                const data = {"pageNum": 1, "pageSize": 20, "search": {"baseStation": baseStation}}
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://119.3.58.127:8085/api/engine/rtk/search",
                        headers: headers,
                        responseType: 'JSON',
                        data: JSON.stringify(data),
                        onload: function (res) {
                            if (res.response.code === 200) {
                                const baseStationInfo = res.response.data.records
                                resolve(baseStationInfo)
                            } else {
                                return message.error(res.response.msg)
                            }
                        },
                        onerror: function (error) {
                            return message.error("请求错误")
                        }
                    })
                })
            },
            stop: (baseStationIdList) => {
                let result = {
                    r: true,
                    msg: ''
                }
                const data = baseStationIdList
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://119.3.58.127:8085/api/engine/rtk/stop",
                        headers: headers,
                        responseType: 'JSON',
                        data: JSON.stringify(data),
                        onload: function (res) {
                            dataSize.processed += 1
                            if (res.response.code === 200) {
                                result.r = true
                                result.msg = '成功'
                            } else {
                                result.r = false
                                result.msg = res.response.msg
                            }
                            resolve(result)
                        },
                        onerror: function (err) {
                            result.r = false
                            result.msg = err
                            resolve(result)
                        }
                    })
                })
            },
            start: (baseStationIdList) => {
                let result = {
                    r: true,
                    msg: ''
                }
                const data = baseStationIdList
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "http://119.3.58.127:8085/api/engine/rtk/start",
                        headers: headers,
                        responseType: 'JSON',
                        data: JSON.stringify(data),
                        onload: function (res) {
                            dataSize.processed += 1
                            if (res.response.code === 200) {
                                result.r = true
                                result.msg = '成功'
                            } else {
                                result.r = false
                                result.msg = res.response.msg
                            }
                            resolve(result)
                        },
                        onerror: function (err) {
                            result.r = false
                            result.msg = err
                            resolve(result)
                        }
                    })
                })
            }
        }
    })
})();
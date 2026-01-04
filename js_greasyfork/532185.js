// ==UserScript==
// @name         四川创联专技平台，Edu.Chinahrt
// @namespace    http://tampermonkey.net/zzzzzzys_Edu.Chinahrt
// @version      1.0.0
// @copyright    zzzzzzys.All Rights Reserved.
// @description   四川创联专技平台，可秒刷视频。中国人事人才网，通用适配edu.chinahrt
// @author       zzzzzzys
// @match        https://videoadmin.chinahrt.com/videoPlay/playEncrypt*
// @match        https://edu.chinahrt.com/*/play_video/*
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @require      https://scriptcat.org/lib/637/1.4.4/ajaxHooker.js#sha256=Z7PdIQgpK714/oDPnY2r8pcK60MLuSZYewpVtBFEJAc=
// @connect      videoadmin.chinahrt.com
// @connect      fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @connect      mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-start
// @license      
// @downloadURL https://update.greasyfork.org/scripts/532185/%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94%E4%B8%93%E6%8A%80%E5%B9%B3%E5%8F%B0%EF%BC%8CEduChinahrt.user.js
// @updateURL https://update.greasyfork.org/scripts/532185/%E5%9B%9B%E5%B7%9D%E5%88%9B%E8%81%94%E4%B8%93%E6%8A%80%E5%B9%B3%E5%8F%B0%EF%BC%8CEduChinahrt.meta.js
// ==/UserScript==
// @match        https://edu.chinahrt.com/
class Runner {
    constructor() {
        this.runner = null
        // this.init()
        this.initAjaxHooker()
        this.initBeaconHooker()
        this.run()
        this.init()
    }

    initAjaxHooker() {
        // ajaxHooker.filter([
        //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
        //     {url: "/videoPlay/takeRecordByToken"},
        // ]);
        ajaxHooker.hook(request => {
            if (request.url.includes('/videoPlay/takeRecordByToken')) {
                console.log("请求捕获：", request);
                request.response = res => {
                    console.log(res);

                    // res.responseText += 'test';
                };
            } else if (request.url.includes('videoPlay/playEncrypt')) {
                request.response = res => {
                    console.log("播放页：", res);
                    // res.responseText += 'test';
                };
            }
        });
        console.log("hooker:", ajaxHooker)
    }

    initBeaconHooker() {
        const origSendBeacon = unsafeWindow.navigator.sendBeacon;
        unsafeWindow.navigator.sendBeacon = function (url, data) {
            if (url.includes('/videoPlay/takeRecordByToken')) {
                try {
                    const payload = JSON.parse(data);
                    console.log('捕获到 Beacon 请求:', payload);
                    window.token=payload.token
                    // window.capturedToken = payload.token;
                    // window.lastBeaconData = payload;

                    // const newData = JSON.stringify({...payload, time: 999});
                    // return origSendBeacon.call(this, url, newData);
                } catch (e) {
                    console.error('Beacon 数据解析失败:', e);
                }
            }

            return origSendBeacon.apply(this, arguments);
        };
    }

    init() {
        unsafeWindow.addEventListener('message', (event) => {
            // if (event.origin !== 'https://videoadmin.chinahrt.com') return;
            if (event.data?.type === 'GET_LOCALSTORAGE') {
                const bindInfo = localStorage.getItem('SESSIONTOKEN-151')
                console.log("send msg:",bindInfo)
                event.source.postMessage(
                    {
                        type: 'LOCALSTORAGE_DATA',
                        value: bindInfo
                    },
                    event.origin // 指定目标域为 iframe 的源
                );
            }
        });
        console.log("跨域通道已开启...")
    }

    run() {
        unsafeWindow.onload = () => {
            const url = location.href;
            if (url.includes("v_courseDetails")) {
                this.runner = new Index("channel-hrt")
                // this.runner.run()
            } else if (url.includes("videoadmin")) {
                this.runner = new Course("channel-hrt")
            } else if (url.includes("play_video")) {
                this.init()
            }
        }
    }
}

class Index {
    constructor(channel = "channel-my") {
        this.panel = new AuthWindow({
            VIPBtnText: "高级功能-极速秒刷"
        })
        this.channel = new BroadcastChannel(channel)
        this.VIP = false
        this.running = false
        this.init()
    }

    init() {
        this.panel.setOnVerifyCallback(async (data) => {
            this.url = await Utils.validateCode(data)
            if (this.url) {
                this.panel.setTip(Utils.vipText)
                this.VIP = true
                return true
            }
        })

        this.panel.setOnBegin(() => {
            if (!this.running) {
                this.running = true
                console.log("运行时：", this.VIP)
                this.run().then(r => {
                    this.running = false
                })
            }
        })
        this.panel.setOnVIP(async () => {
            // if (!this.url) {
            //     await this.panel.handleVerify()
            // }
            await this.runVIP()
        })
        this.loadVIPStatus()
        try {
            Swal.fire({
                title: "提示",
                text: "全自动挂机，请手动点击开始！",
                icon: 'info',
                timer: 0,
                confirmButtonText: '确定',
                willClose: () => {
                    if (!this.VIP) {
                        Swal.fire({
                            title: "当前是基础版",
                            text: '课程只会自动连播！升级高级版，能秒刷课程！',
                            icon: 'info',
                            timer: 5000,
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        })
                    }
                }
            });
        } catch (e) {
            console.error(e)
            // this.panel.startAutomation()
        }
    }

    loadVIPStatus() {
        if (Utils.loadStatus()) {
            this.panel.setTip(Utils.vipText)
            this.VIP = true
        } else {
            this.panel.setTip(Utils.baseText)
            this.VIP = false
        }
        console.log("VIP:", this.VIP)
    }

    async runVIP() {
        try {
            if (!this.VIP) {
                Utils.showLinkSwal()
                console.log("需要授权码！")
                return
            }
            Swal.fire({
                title: "请在课程播放页面使用！",
                text: `请在课程播放页面使用！`,
                icon: 'info',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
            })
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: "高级功能执行失败！",
                text: "若一直失败，请联系进行售后处理！",
                icon: 'error',
                confirmButtonText: '确定',
                allowOutsideClick: false,
                willClose: () => {
                    console.log(' 用户确认错误，脚本已停止');
                }
            });
        }
    }

    async run() {
        try {
            const onlyTime = true
            const catalogSelecter = '.course-h li'
            const btn = '.button'
            const catalogList = await Utils.getStudyNode(catalogSelecter, 'nodeList')
            for (let j = 0; j < catalogList.length; j++) {
                console.log(catalogList[j].querySelector('.text').innerText)
                const status = this.checkStatus(catalogList[j])
                if (status) {
                    console.log("完成，跳过！")
                    continue;
                }
                catalogList[j].querySelector(btn).click()
                const val = await this.waitForFinsh();
                if (val !== 0) {
                    throw Error("错误的监听信息，请关闭其他插件")
                }
                if (!this.VIP && j > 2) {
                    break
                }
            }
            if (!this.VIP) {
                Swal.fire({
                    title: "未开启高级功能",
                    text: '自动连播课程，需要开启高级功能',
                    icon: 'error',
                    confirmButtonColor: "#FF4DAFFF",
                    confirmButtonText: "确定",
                })

            }

            this.finish()
        } catch (e) {
            console.error(e)
            Swal.fire({
                title: "失败",
                text: e + '',
                icon: 'error',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
            })
        }

    }

    finish() {
        if (Swal) {
            Swal.fire({
                title: "刷课成功！",
                text: `学习时间已达到最大值`,
                icon: 'success',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
            }).then((result) => {
                if (result.isConfirmed) {
                    // 尝试关闭当前页面
                    try {
                        // window.close(); // 关闭当前页面
                    } catch (error) {
                        console.error("无法直接关闭页面：", error);
                        // 如果无法直接关闭页面，提示用户手动关闭
                        Swal.fire({
                            title: "无法自动关闭页面",
                            text: "请手动关闭此页面。",
                            icon: 'warning',
                            confirmButtonColor: "#FF4DAFFF",
                            confirmButtonText: "确定",
                        });
                    }
                }
            });
        }
    }

    checkStatus(dom) {
        return false
        const isFinish = dom.querySelector('.button').innerText
        return isFinish.includes('已学完')
    }

    async waitForFinsh() {
        return new Promise(async (resolve) => {
            const task = setInterval(() => {
                console.log("等待当前任务完成！")
            }, 5000)
            this.channel.onmessage = (event) => {
                clearInterval(task)
                resolve(event.data === 'finish' ? 0 : 1);
            };

        });
    }
}

class Course {
    constructor(channel = "channel-my") {
        this.panel = new AuthWindow({
            VIPBtnText: "高级功能-极速刷课"
        })
        this.channel = channel
        this.VIP = false
        this.running = false
        this.init()
        this.initCross()
        this.initGetLocal()
    }

    init() {
        this.panel.setOnVerifyCallback(async (data) => {
            this.url = await Utils.validateCode(data)
            if (this.url) {
                this.panel.setTip(Utils.vipText)
                this.VIP = true
                return true
            }
        })

        this.panel.setOnBegin(() => {
            if (!this.running) {
                this.running = true
                console.log("运行时：", this.VIP)
                this.run().then(r => {
                    this.running = false
                })
            }
        })
        this.panel.setOnVIP(async () => {
            if (!this.url) {
                await this.panel.handleVerify()
            }
            await this.runVIP()
        })
        this.loadVIPStatus()
        try {
            // Swal.fire({
            //     title: "提示",
            //     text: "脚本3s后自动开始",
            //     icon: 'info',
            //     timer: 3000,
            //     confirmButtonText: '确定',
            //     willClose: () => {
            //         this.panel.startAutomation()
            //     }
            // });
        } catch (e) {
            console.error(e)
            // this.panel.startAutomation()
        }
    }

    initGetLocal() {
        unsafeWindow.addEventListener('message', (event) => {
            // if (event.origin !== 'https://gp.chinahrt.com') return;
            if (event.data?.type === 'LOCALSTORAGE_DATA') {
                console.log('Received:', event.data.value);
                window.bindInfo = event.data.value
            }
        });
        unsafeWindow.parent.postMessage(
            {
                type: 'GET_LOCALSTORAGE',
                key: 'bindInfo'
            },
            'https://edu.chinahrt.com'
        );
    }

    initCross() {
        try {
            const iframeWindow = unsafeWindow

            // 重写Function构造函数
            // const originalFunction = iframeWindow.Function.prototype.constructor;
            // iframeWindow.Function.prototype.constructor = function (...args) {
            //     if (args.length > 0 && typeof args[0] === 'string' && args[0].includes('debugger')) {
            //         console.log("111")
            //         return function () {
            //         }; // 替换包含debugger的代码为空函数
            //     }
            //     return originalFunction.apply(this, args);
            // };
            // 覆盖check函数
            const oldConstructor = Function.prototype.constructor;
            Function.prototype.constructor = function (...args) {
                if (args[0] === 'debugger') {
                    // 直接返回空函数阻止debugger执行
                    return function () {
                    };
                }
                return oldConstructor.apply(this, args);
            };
            iframeWindow.check = function () {
            };

            console.log('反调试绕过成功！');
            // Swal.fire({
            //     title: "反调试绕过成功！",
            //     text: iframeWindow.check.toString(),
            //     icon: 'success',
            //     confirmButtonColor: "#FF4DAFFF",
            //     confirmButtonText: "关闭"
            // }).then(() => {
            //
            // });
        } catch (err) {
            console.error('绕过失败：', err);
        }
    }

    loadVIPStatus() {
        if (Utils.loadStatus()) {
            this.panel.setTip(Utils.vipText)
            this.VIP = true
        } else {
            this.panel.setTip(Utils.baseText)
            this.VIP = false
        }
        console.log("VIP:", this.VIP)
    }

    async runVIP() {
        try {
            if (!this.VIP) {
                Utils.showLinkSwal()
                console.log("需要授权码！")
                return
            }
            if (window.VIPRunning) {
                Swal.fire({
                    title: "课程正在刷取中，请等待！",
                    text: "等待或刷新页面重试！",
                    icon: 'info',
                    confirmButtonText: '确定',
                    willClose: () => {
                    }
                });
                return
            }
            const confirmResult = await Swal.fire({
                title: "提示",
                html: `<div style="text-align:left">
                    <b>注意事项：</b>
                    <li>有概率触发反作弊机制导致失败：</li>
                    <li>多次刷取时，视频最后几分钟可能导致刷取失败！此时，需要休息一段时间，再次刷取！</li>
                    <li>若不休息片刻，会导致后续视频只能播放前30秒，继续播放可能需要刷新页面恢复</li>
                    <li></li>
                    <li>单次仅刷取10分钟</li>
                    <li>每次刷完后，不论成功失败，请刷新页面</li>
                   </div>`,
                icon: 'warning',
                showCancelButton: true,
                cancelButtonText: '取消',
                confirmButtonText: '继续',
                allowOutsideClick: false,
                focusCancel: true,
                customClass: {
                    popup: 'risk-warning-popup',
                    htmlContainer: 'text-left'
                }
            });

            if (!confirmResult.isConfirmed) {
                return;
            }
            Swal.fire({
                title: "已开始刷课，请等待提示刷课完成！",
                text: "每1s，刷取30s，请耐心等待！",
                icon: 'success',
                confirmButtonText: '确定',
                willClose: () => {
                }
            });
            let jsCode = GM_getValue(Utils.jsFlag)
            if (!jsCode) {
                jsCode = await Utils.getJsCode(this.url)
            }
            eval(jsCode)
            const token=window.token
            if(!token){
                Swal.fire({
                    title: "错误！",
                    text: "请先最小化一下浏览器，以使脚本捕获token值！然后再使用高级功能！",
                    icon: 'error',
                    confirmButtonText: '确定',
                    timer: 0,
                    willClose: () => {
                        window.VIPRunning=false
                    }
                });
                return
            }
            await window.VIP(window.token)
            Swal.fire({
                title: "已成功！",
                text: "已刷完当前课程学时！请手动刷新查看结果！",
                icon: 'success',
                confirmButtonText: '确定',
                willClose: () => {
                    window.VIPRunning=false
                }
            });
            setTimeout(() => {
                // location.reload()
            }, 5000)
        } catch (error) {
            console.error(error)
            Swal.fire({
                title: "高级功能执行失败！",
                text: "若一直失败，请联系进行售后处理！",
                icon: 'error',
                confirmButtonText: '确定',
                allowOutsideClick: false,
                willClose: () => {
                    window.VIPRunning=false
                }
            });
        }finally {
            // window.VIPRunning=false
        }
    }

    async run() {
        try {
            const video = await Utils.getStudyNode('video', "node")
            video.muted = true
            video.volume = 0
            await video.play()
            await this.waitForVideoEnd(video)
            this.finish()
        } catch (e) {
            console.error(e)
            Swal.fire({
                title: "失败",
                text: e + '',
                icon: 'error',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
            })
        }

    }

    sendMsg(msg) {
        // 创建 BroadcastChannel
        const channel = new BroadcastChannel(this.channel);
        channel.postMessage(msg);
    }

    finish() {
        if (Swal) {
            // this.sendMsg('finish')
            Swal.fire({
                title: "学习完成！",
                text: `学习完成，自动进行下一个！`,
                icon: 'success',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 10000,
                willClose: () => {

                }
            })
            setTimeout(() => {
                window.close()
            }, 10000)
        }
    }

    async waitForVideoEnd(video) {
        return new Promise(resolve => {
            const checkInterval = setInterval(async () => {
                try {
                    if (video && video.paused) {
                        console.log("视频暂停了，重新开始播放...");
                        await video.play();
                    }
                    /*if (!video.src) {
                        console.error("视频源未设置，即将重新加载");
                        setTimeout(() => {
                            location.reload()
                        }, 5000)
                    }*/

                } catch (e) {
                    console.error("checkInterval error:", e);
                    clearInterval(checkInterval);
                    setTimeout(() => {
                        location.reload()
                    }, 2000);
                }
            }, 3000);
            video.addEventListener('ended', () => {
                clearInterval(checkInterval);
                resolve()

            }, {once: true}); // 监听视频结束事件
        });
    }

    checkStatus(dom) {
        const string = dom.querySelector('.four').innerText
        return string === "100%"
    }
}

class Utils {
    constructor() {
    }

    static flag = 'eduhrt_VIP'
    static jsFlag = 'eduhrt_JsCode'
    static vipText = '高级功能已启用！'
    static baseText = '您正在使用基础版本，功能可能存在限制'

    static loadStatus() {
        try {
            let VIP = GM_getValue(this.flag)
            return !!VIP
        } catch (e) {
            console.error(e)
        }
        return false
    }

    static async validateCode(data) {
        try {
            let info = this.decodeJWT(window.bindInfo)
            if (!info) {
                throw new Error("无效的账号信息！")
            }
            data.bindInfo = info.mobile+"_"+info.userName
            data.website = "67c2ebd4e0ec19c842ab2443"
            console.log(data)
            // return
            const res = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    'url': "https://fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com/validCodeFuncCas?" + new URLSearchParams(data),
                    method: 'GET',
                    onload: function (res) {
                        if (res.status === 200) {
                            const result = JSON.parse(res.response)
                            console.log(result)
                            resolve(result)
                        }
                        reject('请求失败：' + res.response)
                    },
                    onerror: function (err) {
                        console.error(err)
                        reject('请求错误！' + err.toString())
                    }
                })
            })
            if (res.code !== 200) {
                GM_deleteValue(Utils.flag)
                throw new Error('验证失败：' + res.data)
            }
            Swal.fire({
                title: "高级功能已启用！",
                text: "校验成功！",
                icon: 'success',
                confirmButtonText: '确定',
            });
            GM_setValue(Utils.flag, true)
            return res.data
        } catch (e) {
            console.error(e)
            Swal.fire({
                title: "验证失败！",
                text: e.toString(),
                icon: 'error',
                confirmButtonText: '确定',
            });
        }
    }

    static async getJsCode(url) {
        try {
            let code = GM_getValue(Utils.jsFlag)
            // console.log(code)
            if (!code) {
                const jsUrl = url
                //获取js文件，然后在这里执行，然后获得结果
                const jsCode = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        'url': jsUrl,
                        method: 'GET',
                        onload: function (res) {
                            console.log(res)
                            if (res.status === 200) {
                                const result = (res.responseText)
                                // console.log(result)
                                resolve(result)
                            } else {
                                reject('服务器拒绝：' + res.response)
                            }
                        },
                        onerror: function (err) {
                            console.error(err)
                            reject('请求错误！' + err.toString())
                        }
                    })
                })
                code = jsCode
                    .replace(/\\/g, '\\\\')
                    .replace(/'/g, '\'')
                    .replace(/"/g, '\"')
                GM_setValue(Utils.jsFlag, code)
            }
            return code
        } catch (error) {
            console.error('远程加载失败:', error);
            throw new Error("远程加载失败")
        }
    }

    static showLinkSwal() {
        const link = [
            "https://68n.cn/IJ8QB",
            "https://68n.cn/RM9ob",
        ]
        Swal.fire({
            title: '<i class="fas fa-crown swal-vip-icon"></i> 高级功能解锁',
            html: `
        <div class="vip-alert-content">
            <div class="alert-header">
                <h3>需要验证授权码才能使用</h3>
                <p class="version-tag">高级版</p>
            </div>
            
            <div class="requirements-box">
                <div class="requirement-item">
                    <span class="number-badge">1</span>
                    <p>需有效授权码激活高级功能模块</p>
                </div>
                <div class="requirement-item">
                    <span class="number-badge">2</span>
                    <p>当前账户权限：<span class="status-tag free-status">基础版</span></p>
                </div>
            </div>
 
            <div class="action-guide">
                <p>获取授权码步骤：</p>
                <ol class="step-list">
                    <li>点击前往以下链接，获取授权码</li>
                    <li><a href=${link[0]} class="pricing-link" target="_blank" ">获取授权码链接1</a></li>
                    <li><a href=${link[1]} class="pricing-link" target="_blank"">获取授权码链接2</a></li>
                </ol>
            </div>
        </div>
    `,
            icon: 'info',
            confirmButtonText: '前往激活',
            showCloseButton: true,
            timer: 30000,
            customClass: {
                popup: 'vip-alert-popup',
                confirmButton: 'vip-confirm-btn'
            },
            willClose: () => {
                // window.open(link[1])
            }
        });
    }

    static async getStudyNode(selector, type = 'node', timeout = 10000) {
        return new Promise((resolve, reject) => {
            if (!['node', 'nodeList'].includes(type)) {
                console.error('Invalid type parameter. Expected "node" or "nodeList"');
                reject('Invalid type parameter. Expected "node" or "nodeList"');
            }
            const cleanup = (timeoutId, intervalId) => {
                clearTimeout(timeoutId);
                clearInterval(intervalId);
            };
            const handleSuccess = (result, timeoutId, intervalId) => {
                console.log(`${selector} ready!`);
                cleanup(timeoutId, intervalId);
                resolve(result);
            };
            const handleFailure = (timeoutId, intervalId) => {
                cleanup(timeoutId, intervalId);
                resolve(null);
            };
            const checkNode = () => {
                try {
                    let nodes;
                    if (type === 'node') {
                        nodes = document.querySelector(selector);
                        return nodes?.readyState >= 3 ? nodes : null;
                    }
                    nodes = document.querySelectorAll(selector);
                    return nodes.length > 0 ? nodes : null;
                } catch (error) {
                    console.error('节点检查错误:', error);
                    reject('节点检查错误:', error)
                }
            };
            const intervalId = setInterval(() => {
                const result = checkNode();
                if (result) {
                    handleSuccess(result, timeoutId, intervalId);
                } else {
                    console.log(`等待节点: ${selector}...`);
                }
            }, 1000);
            const timeoutId = setTimeout(() => {
                console.error(`节点获取超时: ${selector}`);
                handleFailure(timeoutId, intervalId);
            }, timeout);
        });
    }
    static decodeJWT(token){
        const parts = token.split('.');
        // 第二部分是载荷（Payload）
        const payload = parts[1];
        // Base64Url 解码
        const decoded = atob(payload.replace(/-/g, '+').replace(/\_/g, '/'));
        // 转换为 JSON 对象
        return JSON.parse(decoded);
    }

}

class AuthWindow {
    constructor({VIPBtnText = "高级功能，极速刷课", VIPInfo = "您正在使用基础版本，功能可能存在限制"}) {
        this.storageKey = 'AuthData';
        this.injectGlobalStyles();
        this.initDOM();
        this.loadPersistedData();
        this.show();
        this.setVIPBtnText(VIPBtnText);
        this.setTip(VIPInfo)
        // this.startAutomation()
    }

    injectGlobalStyles() {
        GM_addStyle(`
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 9999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
        GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
    }

    initDOM() {
        this.container = document.createElement('div');
        this.container.className = 'auth-window';

        // 标题区域
        const title = document.createElement('h3');
        title.className = 'auth-title';
        title.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 7v5l3 3"/>
        </svg>
        <span>脚本控制台<span class="auth-version">v${GM_info.script.version}</span></span>
    `;

        // 提示信息
        const tip = document.createElement('p');
        tip.className = 'auth-tip';
        tip.textContent = '您正在使用基础版本，功能可能存在限制';
        this.tip = tip
        // 输入框组
        // this.phoneInput = this.createInput(' 手机/QQ号', 'text', '#phone');
        this.authInput = this.createInput(' 授权密钥', 'password', '#auth');

        // 授权链接
        const link = [
            "https://68n.cn/IJ8QB",
            "https://68n.cn/RM9ob",
        ]
        const authLink1 = this.createLink('authLink1', link[0], '获取授权链接1');
        const authLink2 = this.createLink('authLink2', link[1], '获取授权链接2');


        // 验证按钮
        this.verifyBtn = document.createElement('button');
        this.verifyBtn.className = 'auth-button';
        this.verifyBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        验证授权码 
    `;
        this.verifyBtn.onclick = () => this.handleVerify();

        // 启动控制面板
        this.controlPanel = document.createElement('div');
        this.controlPanel.className = 'control-panel';
        this.controlPanel.style.cssText = `
        margin-top: 20px;
        border-top: 1px solid #eee;
        padding-top: 16px;
    `;
        this.vipBtn = document.createElement('button');
        this.vipBtn.className = 'vip-btn glow-effect';
        this.vipBtn.innerHTML = `
            <span class="glow-container"></span>
            <svg class="crown-icon" viewBox="0 0 24 24">
                <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z"/>
            </svg>
            <span class="vip-text">高级功能-全自动挂机</span>
        `;
        this.vipBtn.addEventListener('click', () => {
            this.handleVIPClick()
        })
        // 计时器
        this.timerDisplay = document.createElement('div');
        this.timerDisplay.className = 'timer';
        this.timerDisplay.textContent = '运行时间: 00:00:00';
        this.timerDisplay.style.cssText = `
        color: #2ecc71;
        font-size: 13px;
        margin-bottom: 12px;
    `;

        // 开始按钮
        this.startBtn = document.createElement('button');
        this.startBtn.className = 'auth-button';
        this.startBtn.style.backgroundColor = '#2ecc71';
        this.startBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
        开始运行-自动化挂机
    `;
        this.startBtn.onclick = () => this.startAutomation();

        // 错误提示
        this.errorBox = document.createElement('div');
        this.errorBox.className = 'error-message';


        // 组装结构
        this.controlPanel.append(
            this.vipBtn,
            // this.timerDisplay,
            // this.startBtn
        );

        this.container.append(
            title,
            tip,
            // this.phoneInput.container,
            this.authInput.container,
            authLink1,
            authLink2,
            this.verifyBtn,
            this.controlPanel,
            this.errorBox
        );

        document.body.appendChild(this.container);
        this.initControlBtn()
    }

    initControlBtn() {
        // 创建控制按钮
        this.toggleBtn = document.createElement('button');
        this.toggleBtn.className = 'window-toggle';
        this.toggleBtn.innerHTML = `
        <svg class="toggle-icon" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span class="toggle-text">展开面板</span>
    `;
        this.toggleBtn.style.cssText = `
        position: fixed;
        right: 30px;
        bottom: 30px;
        padding: 12px 20px;
        background: #fff;
        border: none;
        border-radius: 30px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        z-index: 9999999;
    `;

        // 添加交互效果
        this.toggleBtn.addEventListener('mouseenter', () => {
            this.toggleBtn.style.transform = 'translateY(-2px)';
            this.toggleBtn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        });

        this.toggleBtn.addEventListener('mouseleave', () => {
            this.toggleBtn.style.transform = 'none';
            this.toggleBtn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
        });

        // 点击事件处理
        this.toggleBtn.onclick = () => {
            const isVisible = this.container.style.display !== 'none';
            this.container.style.display = isVisible ? 'none' : 'block';

            // 更新按钮状态
            this.toggleBtn.querySelector('.toggle-icon').style.transform =
                isVisible ? 'rotate(180deg)' : 'none';
            this.toggleBtn.querySelector('.toggle-text').textContent =
                isVisible ? '展开面板' : '收起面板';

            // 添加动画效果
            if (!isVisible) {
                this.container.animate([
                    {opacity: 0, transform: 'translateY(20px)'},
                    {opacity: 1, transform: 'none'}
                ], {duration: 300, easing: 'ease-out'});
            }
        };

        document.body.appendChild(this.toggleBtn);
    }

    startAutomation(callback) {
        if (!this.isRunning) {
            this.startTime = Date.now();
            this.isRunning = true;
            this.startBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M6 12h12"/>
            </svg>
            运行中...
        `;
            this.startBtn.style.backgroundColor = '#e67e22';
            this.startBtn.disabled = true;

            // 启动计时器
            this.timer = setInterval(() => {
                const elapsed = Date.now() - this.startTime;
                const hours = Math.floor(elapsed / 3600000);
                const minutes = Math.floor((elapsed % 3600000) / 60000);
                const seconds = Math.floor((elapsed % 60000) / 1000);
                this.timerDisplay.textContent =
                    `运行时间: ${hours.toString().padStart(2, '0')}:` +
                    `${minutes.toString().padStart(2, '0')}:` +
                    `${seconds.toString().padStart(2, '0')}`;
            }, 1000);

            // 触发自动化任务
            if (typeof callback === 'function') {
                callback()
            }
            if (this.begin && typeof this.begin === 'function') {
                this.begin()
            }
        }
    }

    createInput(labelText, type, id) {
        const container = document.createElement('div');
        container.className = 'input-group';

        const label = document.createElement('label');
        label.className = 'input-label';
        label.textContent = labelText;
        label.htmlFor = id;

        const input = document.createElement('input');
        input.className = 'input-field';
        input.type = type;
        input.id = id;
        input.maxLength = 16
        container.appendChild(label);
        container.appendChild(input);
        return {container, input};
    }

    createLink(id, link, name) {
        const authLink = document.createElement('a');
        authLink.id = id;
        authLink.className = 'auth-link';
        authLink.href = link;
        authLink.target = '_blank';
        authLink.textContent = name;
        authLink.style.cssText = `
        display: block; margin: 12px 0; color: #3498db; text-decoration: none; font-size: 13px; transition: opacity 0.2s; `;
        authLink.addEventListener('mouseenter', () => {
            authLink.style.opacity = '0.8';
            authLink.style.textDecoration = 'underline';
        });
        authLink.addEventListener('mouseleave', () => {
            authLink.style.opacity = '1';
            authLink.style.textDecoration = 'none';
        });
        return authLink
    }

    show() {
        setTimeout(() => {
            this.container.classList.add('visible');
        }, 100);
    }

    showError(message) {
        this.errorBox.textContent = message;
        this.errorBox.style.display = 'block';
        setTimeout(() => {
            this.errorBox.style.display = 'none';
        }, 5000);
    }

    async handleVerify() {
        const data = {
            // phone: this.phoneInput.input.value,
            key: this.authInput.input.value
        };
        console.log(data);
        if (!data.key || !(/^[A-Z0-9]{16}$/).test(data.key)) {
            Swal.fire({
                title: "授权码不正确，应为16位",
                text: "请正确输入！",
                icon: 'info',
                confirmButtonText: '确定',
            });
            return
        }
        // 触发验证回调
        if (this.onVerify) {
            if (await this.onVerify(data)) {
                GM_setValue(this.storageKey, JSON.stringify(data))
            } else {

            }
        }
    }

    handleVIPClick() {
        if (this.vipCallback) {
            this.vipCallback()
        } else {
            Swal.fire({
                title: "提示",
                text: "请在视频播放页面使用！",
                icon: 'info',
                confirmButtonText: '确定',
                willClose: () => {
                    console.log(' 用户确认错误，脚本已停止');
                }
            });
        }
    }

    loadPersistedData() {
        let saved = GM_getValue(this.storageKey);
        if (saved) {
            saved = JSON.parse(saved)
            // this.phoneInput.input.value = saved.phone || '';
            this.authInput.input.value = saved.key || '';
        }
    }


    hide() {
        this.container.style.display = 'none';
    }

    // get phone() {
    //     return this.phoneInput.input.value;
    // }

    // set phone(value) {
    //     this.phoneInput.input.value = value;
    // }

    get key() {
        return this.authInput.input.value;
    }

    set key(value) {
        // this.authInput.input.value = value;
    }

    setTip(text) {
        this.tip.innerText = text
    }

    // 验证回调函数
    setOnVerifyCallback(callback) {
        this.onVerify = callback;
    }

    setOnBegin(callback) {
        this.begin = callback;
    }

    setOnVIP(callback) {
        this.vipCallback = callback;
    }

    setVIPBtnText(text) {
        this.vipBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20 12l-8 8-4-4m0 0l4-4m-4 4L4 12l4-4"/>
        </svg>
        ${text} 
    `;
    }
}

const sleep = function (time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

new Runner()

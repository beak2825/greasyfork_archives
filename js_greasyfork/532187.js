// ==UserScript==
// @name         凉山专业技术人员继续教育
// @namespace    http://tampermonkey.net/zzzzzzys_凉山专技
// @version      1.0.0
// @copyright    zzzzzzys.All Rights Reserved.
// @description  凉山专技，可极速秒刷单个视频。视频自动静音播放，防暂停！
// @author       zzzzzzys
// @match        https://lsjjpx.com/home/User/study/*
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @require      https://scriptcat.org/lib/637/1.4.4/ajaxHooker.js#sha256=Z7PdIQgpK714/oDPnY2r8pcK60MLuSZYewpVtBFEJAc=
// @connect      fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @connect      mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_log
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532187/%E5%87%89%E5%B1%B1%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/532187/%E5%87%89%E5%B1%B1%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
class Runner {
    constructor() {
        this.runner = null
        this.initAjaxHooker()
        this.waitForDOMLoaded()
    }

    initAjaxHooker() {
        // ajaxHooker.filter([
        //     // {type: 'xhr', url: 'www.example.com', method: 'GET', async: true},
        //     {url: "https://gw.dtdjzx.gov.cn/gwapi/us/api/study/progress2"},
        //     {url: "https://dywlxy.dtdjzx.gov.cn/gwapi/dywlxynet/api/user/configure"},
        // ]);
        ajaxHooker.hook(request => {
            console.log("捕获：", request.url)
            if (request.url.includes('User/study/course_id/')) {

                request.response = res => {
                    const json = res.responseText
                    console.log("course_id html：");
                    console.log(res.responseText);
                    window.Html = json
                    // res.responseText += 'test';
                };
            }
        });
        console.log("hooker:", ajaxHooker)
    }

    waitForDOMLoaded() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.run());
        } else {
            // DOM已经就绪，直接执行
            this.run();
        }
    }

    run() {
        const url = location.href;
        if (url.includes("User/study")) {
            this.runner = new Course("channel-lsjjpx")
            // this.runner.run()
        } else if (url.includes("exam/exam")) {
            // this.runner = new Exam("channel-lsjjpx")
        }
    }
}


class Course {
    constructor(channel = "channel-my") {

        this.panel = new AuthWindow({
            VIPBtnText: "高级功能-极速刷课"
        })

        this.channel = new BroadcastChannel(channel)
        this.VIP = false
        this.running = false

        this.init()

    }

    init() {
        const url = location.href
        if (url.includes("courseDetails")) {
            Swal.fire({
                title: "提示",
                text: "请在视频播放页，使用脚本和激活功能！",
                icon: 'info',
                timer: 0,
                confirmButtonText: '确定',
                timerProgressBar: true,
                willClose: () => {
                    // this.panel.startAutomation()
                }
            });
            return
        }
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

            Swal.fire({
                title: "提示",
                text: "脚本即将开始！并自动通过滑块验证！",
                icon: 'info',
                timer: 3000,
                confirmButtonText: '确定',
                timerProgressBar: true,
                willClose: () => {
                    this.panel.startAutomation()
                }
            });
        } catch (e) {
            console.error(e)
            this.panel.startAutomation()
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
                console.log("VIP Running");
                Swal.fire({
                    title: "课程已在刷取中，请等待或刷新重试...",
                    text: "注意，请在视频播放时刷取！否则可能不生效！",
                    icon: 'info',
                    confirmButtonText: '确定',
                    willClose: () => {
                    }
                });
                return
            }
            Swal.fire({
                title: "课程已在刷取中，请等待提示刷课完成...",
                text: "极速刷取中，请耐心等待！",
                icon: 'info',
                confirmButtonText: '确定',
                willClose: () => {
                }
            });
            // let jsCode = GM_getValue(Utils.js_Flag)
            // if (!jsCode) {
            //     jsCode = await Utils.getJsCode(this.url)
            // }
            // eval(jsCode)

            // await window.VIP()
            unsafeWindow.alert=function () {
                console.log("拦截alert")
            }
            let res = await fetch(location.href, {
                "headers": {
                    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
                    "sec-ch-ua": "Chromium;v=134, Not:A-Brand;v=24, Microsoft Edge;v=134",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "Windows",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "upgrade-insecure-requests": "1"
                },
                "referrer": "https://lsjjpx.com/home/User/study/course_id/2502/id/2506.html",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });
            let match
            if (res.ok) {
                res = await res.text()
                const functionRegex = /function reckon_by_time\([^)]*\)\s*{([\s\S]*?)}/;
                match = res.match(functionRegex);
                if (!match) {
                    GM_log("未找到 reckon_by_time 函数");
                    return;
                }
            }
            console.log(match)
            // 提取 AJAX 配置
            // const ajaxRegex = /\$\.ajax\(\s*{([\s\S]*?)}\s*\)/;
            const ajaxRegex = match;
            // const ajaxMatch = match[0].match(ajaxRegex);
            // if (!ajaxMatch) {
            //     GM_log("未找到 AJAX 配置");
            //     return;
            // }
            // 提取关键参数
            const urlMatch = ajaxRegex[0].match(/url:\s*"([^"]+)"/);
            const dataMatch = ajaxRegex[0].match(/data:\s*{([\s\S]*?)}/);
            const ajaxUrl = urlMatch ? urlMatch[1] : null;
            let ajaxData = dataMatch ? dataMatch[1] : null;
            ajaxData = ajaxData.split(',')
                .map(pair => pair.trim())
                .filter(Boolean)
                .reduce((obj, pair) => {
                    // 2. 解析键值
                    const [rawKey, rawValue] = pair.split(':').map(s => s.trim());
                    const key = rawKey.replace(/["']/g, '');

                    // 3. 排除动态参数
                    const excludeKeys = ['type', 'duration', 'currentTime'];
                    if (!excludeKeys.includes(key)) {
                        // 4. 智能值处理
                        obj[key] = rawValue.replace(/["']/g, '')
                            .replace(/parseInt\((.*?)\)/, '$1'); // 移除 parseInt 包装
                    }
                    return obj;
                }, {});
            console.log("解析结果", ajaxUrl, ajaxData)
            ajaxData.currentTime = parseInt(unsafeWindow.video.duration);
            ajaxData.duration = parseInt(unsafeWindow.video.duration);
            ajaxData.type = 2;
            let resData = await $.ajax({
                url: "/home/User/reckon_by_time.html",
                data: {
                    course_id: ajaxData.course_id,
                    user_id: ajaxData.user_id,
                    currentTime: 60,
                    duration: ajaxData.duration,
                    type: 1,
                    study_code: ajaxData.study_code,
                    list_id: ajaxData.list_id,
                },
                type: "post",
            });
            console.log(resData)
            if (!resData.code || resData.code !== 1) {
                throw Error('初始化请求失败：' + resData.toString())
            }
            await sleep(1000)
            resData = await $.ajax({
                url: "/home/User/reckon_by_time.html",
                data: {
                    course_id: ajaxData.course_id,
                    user_id: ajaxData.user_id,
                    currentTime: ajaxData.currentTime,
                    duration: ajaxData.duration,
                    type: 2,
                    study_code: ajaxData.study_code,
                    list_id: ajaxData.list_id,
                },
                type: "post",
            });
            console.log(resData)
            if (!resData.code || resData.code !== 1) {
                throw Error('请求失败：' + resData.toString())
            }

            Swal.fire({
                title: "刷课完成！请刷新页面！",
                text: "请刷新页面！",
                icon: 'success',
                confirmButtonText: '确定',
                allowOutsideClick: false,
                timerProgressBar: true,
                willClose: () => {
                    window.VIPRunning = false
                }
            });

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

            // const video = await this.getStudyNode('video');
            // video.volume = 0
            // video.muted = true
            // await this.waitForVideoEnd(video)
            // this.finish()
        } catch (e) {
            console.error(e)
            Swal.fire({
                title: "失败！",
                text: `视频基础播放失败！`,
                icon: 'error',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 5000,
                timerProgressBar: true,
                willClose: () => {
                    // window.close()
                }
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
            this.sendMsg('finish')
            Swal.fire({
                title: "学习完成！",
                text: `学习完成，若出现保存失败情况，多等会儿查看结果即可！`,
                icon: 'success',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 5000,
                willClose: () => {
                    // window.close()
                }
            })
        }
    }

    async waitForVideoEnd(video) {
        return new Promise(resolve => {
            const checkInterval = setInterval(async () => {
                try {
                    video.volume = 0
                    video.muted = true
                    if (video && video.paused) {
                        console.log("视频暂停了，重新开始播放...");
                        video.volume = 0
                        video.muted = true
                        await video.play();
                    }
                    if (!video.src) {
                        console.error("视频源未设置，即将重新加载");
                        setTimeout(() => {
                            location.reload()
                        }, 5000)
                    }

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

    getStudyNode(selector, type = 'node', dom, timeout = 10000) {
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
                        nodes = dom ? dom.querySelector(selector) : document.querySelector(selector);
                        return nodes
                    }
                    nodes = dom ? dom.querySelectorAll(selector) : document.querySelectorAll(selector);
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

    checkOpenStatus(dom) {
        try {
            const style = dom.querySelector('svg').getAttribute('style')
            return !!style.includes('transform: rotate(180deg)');
        } catch (e) {
            return false
        }

    }

    /**
     *
     * @param dom
     * @returns {number} 0 视频 |1 文档|2 材料
     */
    checkType(dom) {
        if (dom.querySelector('.font-syllabus-online-video')) {
            // 视频
            return 0
        } else if (dom.querySelector('.font-syllabus-page')) {
            // 文档页面
            return 1
        } else if (dom.querySelector('.font-syllabus-material')) {
            // 材料
            return 2
        }
    }
}

class Utils {
    constructor() {
    }

    static flag = 'lsjjpx_VIP'
    static js_Flag = 'lsjjpx_jsCode'
    static vipText = '高级功能已启用！(凉山专继)'
    static baseText = '您正在使用基础版本，功能可能存在限制'

    static loadStatus() {
        try {
            let VIP = GM_getValue(Utils.flag)
            return !!VIP
        } catch (e) {
            console.error(e)
        }
        return false
    }

    static async validateCode(data) {
        try {
            console.log(data);
            let info = document.cookie.split('user_id=')[1].split(';')[0]
            if (!info) {
                throw new Error("无效的账号信息！")
            }
            data.bindInfo = "UserId_" + info
            data.website = "67e210061c90b6fafe11ba78"
            console.log(data);
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
                GM_deleteValue(Utils.js_Flag)
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
            let code = GM_getValue(Utils.js_Flag)
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
                GM_setValue(Utils.js_Flag, code)
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

    static getStudyNode(selector, type = 'node', timeout = 10000) {
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
                        return nodes
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

    static parseChineseTime(timeStr, options = {}) {
        // 正则匹配提取时、分、秒数值
        const pattern = /(?:(\d+)小时)?(?:(\d+)分)?(?:(\d+)秒)?/;
        const matches = timeStr.match(pattern) || [];

        const hours = parseInt(matches[1] || 0, 10);
        const minutes = parseInt(matches[2] || 0, 10);
        const seconds = parseInt(matches[3] || 0, 10);

        const totalSeconds = hours * 3600 + minutes * 60 + seconds;

        return options.returnObject
            ? {hours, minutes, seconds}
            : totalSeconds;
    }
}

class AuthWindow {
    constructor({VIPBtnText = "高级功能，极速刷课", VIPInfo = "您正在使用基础版本，功能可能存在限制",}) {
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
            this.timerDisplay,
            this.startBtn
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

// ==UserScript==
// @name         湖南人社-长沙理工大学，课程助手,自动化挂机播放或秒过
// @namespace    http://tampermonkey.net/zzzzzzys_湖南人社-长沙理工大学
// @version      1.0.8
// @copyright    zzzzzzys.All Rights Reserved.
// @description  湖南人社-长沙理工大学,可自动化挂机播放，验证码自动填写，也可直接秒过单个视频，注意，因平台增加监管服务，秒刷可能导致无法打印证书,合理使用秒过功能，可正常打印！需要更多功能请联系增加！
// @author       zzzzzzys
// @match        https://jxjy.csust.edu.cn/*
// @match        https://zyjx.csust.edu.cn/*
// @match        https://cslgsyplugservice.ylxue.net/learning/play*
// @match        https://cslgsyplugservice.ylxue.net/dialog/confirm*
// @require      https://fastly.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js
// @resource     https://cdn.staticfile.org/limonte-sweetalert2/11.7.1/sweetalert2.min.css
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @require      https://scriptcat.org/lib/637/1.4.5/ajaxHooker.js#sha256=EGhGTDeet8zLCPnx8+72H15QYRfpTX4MbhyJ4lJZmyg=
// @connect      fc-mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.next.bspapp.com
// @connect      mp-8ba0e2a3-d9c9-45a0-a902-d3bde09f5afd.cdn.bspapp.com
// @connect      learn.ylxue.net
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_addStyle
// @run-at       document-start
// @license
// @downloadURL https://update.greasyfork.org/scripts/532919/%E6%B9%96%E5%8D%97%E4%BA%BA%E7%A4%BE-%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%8C%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B%2C%E8%87%AA%E5%8A%A8%E5%8C%96%E6%8C%82%E6%9C%BA%E6%92%AD%E6%94%BE%E6%88%96%E7%A7%92%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/532919/%E6%B9%96%E5%8D%97%E4%BA%BA%E7%A4%BE-%E9%95%BF%E6%B2%99%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%EF%BC%8C%E8%AF%BE%E7%A8%8B%E5%8A%A9%E6%89%8B%2C%E8%87%AA%E5%8A%A8%E5%8C%96%E6%8C%82%E6%9C%BA%E6%92%AD%E6%94%BE%E6%88%96%E7%A7%92%E8%BF%87.meta.js
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
            if (request.url.includes('Course/GetCourseClassVideo')) {
                request.response = res => {
                    const json = JSON.parse(res.responseText)?.Data
                    console.log("GetCourseClassVideo：");
                    window.CourseInfo = json
                    console.log(window.CourseInfo);
                    // res.responseText += 'test';
                };
            } else if (request.url.includes('client/learnRecords/end')) {
                // window.start=JSON.parse(request.data)
                // console.log("start data:",window.start)
                // window.start.accumulativeTime=60
                // const data=window.start
                // const md5Data=CryptoJS.MD5(data.clientCode+data.userId+data.coursewareCode+data.catalogId+data.accumulativeTime+"14daab0a-4aff-4f6e-b303-c85f09c39f42"+data.md5Timestamp).toString()
                // console.log("md5:",md5Data)
                // window.start.md5=md5Data
                // request.data=JSON.stringify(window.start)
                // request.response = res => {
                //     const json = JSON.parse(res.responseText)
                //     console.log("study/history：");
                //     console.log(json);
                //     window.studyHistory = json
                //     // res.responseText += 'test';
                // };
            } else if (request.url.includes('learning/learnVerify/checkCode')) {
                request.abort = true
                request.response = res => {
                    res.responseText = '{"code":0,"msg":null,"data":{"data":"请勿频繁请求","status":9999}}'
                }
            } else if (request.url.includes('learning/learnVerify')) {
                request.abort = true
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
        console.log(url)
        if (url.includes("studyCenter/play")) {

            this.runner = new Course("channel-csust")
            // this.runner = new Course("channel-csust")
            // this.runner.run()
        } else if (url.includes("learning/play")) {
            this.runner = new Index("channel-csust")
        }else if(url.includes("dialog/confirm")){
            this.runner=new Confirm()
        }
    }
}

function func(t, n) {
    const c = p();
    return f = function (n, W) {
        let o = c[n -= 334];
        if (void 0 === f.BHDSFk) {
            var e = function (t) {
                let n = ""
                    , c = ""
                    , W = n + e;
                for (let o, e, r = 0, i = 0; e = t.charAt(i++); ~e && (o = r % 4 ? 64 * o + e : e,
                r++ % 4) ? n += W.charCodeAt(i + 10) - 10 != 0 ? String.fromCharCode(255 & o >> (-2 * r & 6)) : r : 0)
                    e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(e);
                for (let o = 0, e = n.length; o < e; o++)
                    c += "%" + ("00" + n.charCodeAt(o).toString(16)).slice(-2);
                return decodeURIComponent(c)
            };
            const n = function (t, n) {
                let c, W, o = [], r = 0, i = "";
                for (t = e(t),
                         W = 0; W < 256; W++)
                    o[W] = W;
                for (W = 0; W < 256; W++)
                    r = (r + o[W] + n.charCodeAt(W % n.length)) % 256,
                        c = o[W],
                        o[W] = o[r],
                        o[r] = c;
                W = 0,
                    r = 0;
                for (let e = 0; e < t.length; e++)
                    W = (W + 1) % 256,
                        r = (r + o[W]) % 256,
                        c = o[W],
                        o[W] = o[r],
                        o[r] = c,
                        i += String.fromCharCode(t.charCodeAt(e) ^ o[(o[W] + o[r]) % 256]);
                return i
            };
            f.LbyLwh = n,
                t = arguments,
                f.BHDSFk = !0
        }
        const r = n + c[0]
            , i = t[r];
        if (i)
            o = i;
        else {
            if (void 0 === f.cIzUij) {
                const t = function (t) {
                    this.DwCCZH = t,
                        this.hAAntG = [1, 0, 0],
                        this.vLePJH = function () {
                            return "newState"
                        }
                        ,
                        this.Ccleay = "\\w+ *\\(\\) *{\\w+ *",
                        this.qyJVgA = "['|\"].+['|\"];? *}"
                };
                t.prototype.dHTHgO = function () {
                    const t = new RegExp(this.Ccleay + this.qyJVgA).test(this.vLePJH.toString()) ? --this.hAAntG[1] : --this.hAAntG[0];
                    return this.vQEcYt(t)
                }
                    ,
                    t.prototype.vQEcYt = function (t) {
                        return Boolean(~t) ? this.DKilKU(this.DwCCZH) : t
                    }
                    ,
                    t.prototype.DKilKU = function (t) {
                        for (let n = 0, c = this.hAAntG.length; n < c; n++)
                            this.hAAntG.push(Math.round(Math.random())),
                                c = this.hAAntG.length;
                        return t(this.hAAntG[0])
                    }
                    ,
                    new t(f).dHTHgO(),
                    f.cIzUij = !0
            }
            o = f.LbyLwh(o, W),
                t[r] = o
        }
        return o
    }
        ,
        f(t, n)
}
class Confirm{
    constructor() {
        this.init()
        console.log("confirm init!")
    }
    init(){
        setInterval(()=>{
            const footer=document.querySelector('footer')
            if(footer){
                const btn_list=footer.querySelectorAll('.dialog-btn')
                for(let i=0;i<btn_list.length;i++){
                    const text=btn_list[i].innerText
                    if(text==="确定"){
                        btn_list[i].click()
                        console.log("播放下一个视频！")
                        location.reload()
                        break
                    }
                }
            }
        },5000)
    }
}
class Index {
    constructor(channel = "channel-my") {
        this.flag = "hnsydwpxFlag"
        this.init()
        this.index=0
    }

    encrypt(data, payload) {
        const enc = (t, n) => {
            const
                o = Object.keys(t)['filter']((t => ['uid', 'cid', 'classId', 'tid', 'lasttime', 'isfirst', 'createTime']['includes'](t)))['sort']()['map']((n => "" + n + t[n]))['join']("")
                , e = n ? "[" + n + "]" + o + "[" + n + "]" : o;
            return CryptoJS['MD5'](e)['toString']()
        }
        return enc(data, payload)
    }

    getSign(e) {
        var a
        const t = Object.keys(e).filter((e => ["uid", "cid", "classId", "tid", "lasttime", "isfirst", "createTime"].includes(e))).sort().map((t => `${t}${e[t]}`)).join("")
            , r = "`!@#$%^&*()_+";
        return a = `[${r}]${t}[${r}]`,
            CryptoJS['MD5'](a).toString();
    }

    cryptoJsDecrypt = (algorithmType, ciphertextBase64, key, iv) => {

        // 解析密钥和IV（如果未提供IV则复用密钥）
        const utf8Key = CryptoJS.enc.Utf8.parse(key);
        const utf8Iv = CryptoJS.enc.Utf8.parse(iv || key);

        // 选择加密算法
        const algorithm = algorithmType.toLowerCase() === 'aes'
            ? CryptoJS.AES
            : CryptoJS.DES;

        // 执行解密
        try {
            const decrypted = algorithm.decrypt(
                {ciphertext: CryptoJS.enc.Base64.parse(ciphertextBase64)}, // 解析Base64密文
                utf8Key, // 密钥
                { // 配置项
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7,
                    iv: utf8Iv
                }
            );
            return decrypted.toString(CryptoJS.enc.Utf8); // 返回UTF8明文
        } catch (error) {
            console.error('Decryption failed:', error);
            return null; // 可自定义错误处理
        }
    };

    getCurrentIndex() {
        const items = document.querySelectorAll('.list .item');

        const activeIndex = Array.from(items).findIndex(item =>
            item.classList.contains('active')
        );
        return activeIndex
    }

    getToken(userId, customerNo = "cslgsy123") {
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                method: "POST",
                url: "https://learn.ylxue.net/api/ClassesLearningRecord/GetEncryptToken",
                headers: {
                    "accept": "application/json, text/plain, */*",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "cache-control": "no-cache",
                    "Referer": "https://cslgsyplugservice.ylxue.net/",
                    "origin":"https://cslgsyplugservice.ylxue.net",
                    "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36 Edg/136.0.0.0",
                    "sec-ch-ua": '"Chromium";v="136", "Microsoft Edge";v="136", "Not.A/Brand";v="99"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site"
                },
                data: JSON.stringify({
                    customerNo: customerNo,
                    platformId: 1,
                    userId: userId
                }),
                responseType: "json",
                onload: function (response) {
                    if (response.status >= 200 && response.status < 300) {
                        console.log('✅ 获取token成功', response.response);
                        resolve(response.response)
                    } else {
                        console.error('❌ 服务器错误', response.status, response.response);
                    }
                    resolve()
                },
                onerror: function (error) {
                    console.error('🔥 网络请求失败', error);
                },
                ontimeout: function () {
                    console.error('⏰ 请求超时');
                }
            });
        })
    }

    init() {
        this.loadVIPStatus()
        unsafeWindow.addEventListener('message', async (event) => {
            const command = event.data;
            const data = command.data;
            console.log("recived:", command)
            if (command.action === 'setCurrentTime') {
                const updateVideo = async (postData) => {
                    return new Promise(resolve => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: "https://learn.ylxue.net/api/ClassesLearningRecord/SaveLearningRecordByToken",
                            headers: {
                                "accept": "application/json, text/plain, */*",
                                "content-type": "application/json",
                                "pragma": "no-cache",
                                "cache-control": "no-cache",
                                "Referer": "https://cslgsyplugservice.ylxue.net/",
                            },
                            data: JSON.stringify(postData),
                            responseType: "json",
                            onload: function (response) {
                                if (response.status >= 200 && response.status < 300) {
                                    console.log('✅ 提交成功', response.response);
                                    // 在此处添加成功处理逻辑
                                } else {
                                    console.error('❌ 服务器错误', response.status, response.response);
                                }
                                resolve()
                            },
                            onerror: function (error) {
                                console.error('🔥 网络请求失败', error);
                            },
                            ontimeout: function () {
                                console.error('⏰ 请求超时');
                            }
                        });
                    })
                }
                const urlData = new URLSearchParams(location.search);
                const cid = parseInt(urlData.get('cid'))
                const tid = parseInt(urlData.get('tid'))
                // const localData=JSON.parse(localStorage.getItem('global'))
                const uid = data.uid
                const token = data.token
                console.log("begin", window.CourseInfo)
                if (window.CourseInfo) {
                    let index = 0
                    for (let course of window.CourseInfo) {
                        const curIndex = this.getCurrentIndex()
                        if (curIndex !== index) {
                            index++
                            continue
                        }
                        index++
                        const duration = course.i_timelength
                        const step = 100
                        // let current=parseInt(course.i_lasttime /1000) || 0
                        let current = 0
                        let shutdown=false
                        while (current < duration && !shutdown) {
                            current += step
                            let isfirst = 0
                            if (current >= duration) {
                                current = duration - 2 - 60
                                isfirst = 1
                                shutdown=true
                            }
                            console.log(current)
                            const data = {
                                cid: cid,
                                tid: tid,
                                uid: uid,
                                isfirst: isfirst,
                                createTime: parseInt(new Date().getTime() / 1000),
                                classId: course.i_id,
                                lasttime: current * 1000,
                            }
                            // data.sign = this.encrypt(data, "`!@#$%^&*()_+")
                            data.sign = this.getSign(data)
                            // data.token = token
                            const token = (await this.getToken(uid)).Data
                            console.log("get token:", token)
                            if (!token){
                                return
                            }
                            data.token = this.cryptoJsDecrypt("aes", token, "5897456120000000", "6589784430000000")
                            data.clrId = course.i_clrId
                            data.platformId = 1

                            console.log("data:", data)
                            await updateVideo(data)
                            await sleep(1000)
                            // break
                        }
                        // break
                    }
                    Swal.fire({
                        title: "已成功！",
                        text: "刷课已成功！请刷新页面！！",
                        icon: 'success',
                        confirmButtonText: '确定',
                        willClose: () => {
                        }
                    });
                }
            }
            else if(command.action === "study"){
                await this.run()
            }
        });
    }


    async loadVIPStatus() {
        this.url = await this.panel.handleVerify()
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
                title: "高级功能已启用！",
                text: "高级功能已启用，刷新页面重新开始脚本！",
                icon: 'success',
                confirmButtonText: '确定',
                willClose: () => {
                }
            });

        } catch
            (error) {
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
            const item_selector=".class-list .list .item"
            const item_list=await this.getStudyNode(item_selector,"nodeList",)
            for (let item of item_list) {
                const className=item.className
                const name=item.querySelector('.className').innerText
                console.log("课程：",name)
                if(className.includes("finished")){
                    console.log("已完成，跳过！")
                    continue
                }

                const video=await this.getStudyNode('video',"node")
                await this.waitForVideoEnd(video)
                // await sleep(1000)
                if(!this.VIP){
                    break
                }
                location.reload()
                this.index++
                // if(!this.VIP&&this.index>2){
                //     break
                // }
                // item.click()
            }
            this.finish()
        } catch (e) {
            console.error(e)
            Swal.fire({
                title: "失败！",
                text: `失败！` + e.toString(),
                icon: 'error',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 0,
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
        if (!this.VIP) {
            Swal.fire({
                title: "请升级高级版！",
                text: `脚本已停止！基础版只能连播几个视频！`,
                icon: 'info',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 0,
                willClose: () => {
                    // window.close()
                }
            })
            return
        }
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
    async waitForVideoEnd(video,dom) {

        return new Promise(resolve => {
            const checkInterval = setInterval(async () => {
                try {
                    const vid=document.querySelector('video')
                    if(!vid){
                        clearInterval(checkInterval)
                        resolve()
                    }
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

                    try {
                        const dialog=document.querySelector('div.el-overlay-dialog[aria-label="防挂机答题验证"]')
                        if(dialog){
                            const qns_text=dialog.querySelector('strong').innerText
                            const result=calculateSafe(qns_text)
                            const button_list=dialog.querySelectorAll('button')
                            let checked=false
                            for(let i=0;i<button_list.length;i++){
                                const inner_text=button_list[i].innerText
                                if(inner_text === result){
                                    console.log("计算结果匹配：",result)
                                    button_list.click()
                                    checked=true
                                    break
                                }
                            }
                            if(!checked){
                                location.reload()
                            }

                        }
                    }catch (e) {}
                    try{
                        const dialog=document.querySelector('div.el-dialog[aria-label="温馨提示"]')
                        if(dialog) {
                            dialog.querySelector('button').click()
                        }
                    }catch (e) {}

                } catch (e) {
                    console.error("checkInterval error:", e);
                    clearInterval(checkInterval);
                    setTimeout(() => {
                        // location.reload()
                    }, 2000);
                }
            }, 5000);
            video.addEventListener('ended', () => {
                clearInterval(checkInterval);
                resolve()

            }, {once: true}); // 监听视频结束事件
        });
    }

    checkFinish(dom) {
        return dom.querySelector('.el-progress__text').innerText.includes('100')
    }

}

class Course {
    constructor(channel = "channel-my") {

        this.panel = new AuthWindow({
            VIPBtnText: "高级功能-极速秒刷当前视频！"
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
            if (!this.url) {
                await this.panel.handleVerify()
            }
            await this.runVIP()
        })
        this.check_start()
        this.loadVIPStatus()
        try {

            Swal.fire({
                title: "提示",
                text: "此平台可课程内全自动播放视频，也可秒刷视频，注意：秒刷视频可能导致无法打印证书，请合理使用！",
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

    check_start(){
        function calculateSafe(expr) {
            // 使用正则匹配分解表达式：数字和运算符
            const tokens = expr.match(/(?:\d+(?:\.\d+)?)|[+\-*/]/g) || [];

            // 简单验证
            if (tokens.length < 3 || tokens.length % 2 !== 1) {
                throw new Error('无效的表达式: ' + expr);
            }

            // 先处理乘法和除法
            for (let i = 1; i < tokens.length; i += 2) {
                if (tokens[i] === '*' || tokens[i] === '/') {
                    const left = parseFloat(tokens[i - 1]);
                    const right = parseFloat(tokens[i + 1]);
                    let result;

                    if (tokens[i] === '*') result = left * right;
                    if (tokens[i] === '/') result = left / right;

                    tokens.splice(i - 1, 3, result.toString());
                    i -= 2; // 调整索引
                }
            }

            // 再处理加法和减法
            let total = parseFloat(tokens[0]);
            for (let i = 1; i < tokens.length; i += 2) {
                const operator = tokens[i];
                const num = parseFloat(tokens[i + 1]);

                if (operator === '+') total += num;
                if (operator === '-') total -= num;
            }

            return total;
        }
        setInterval(()=>{
            try {
                const dialog=document.querySelector('div.el-overlay-dialog[aria-label="防挂机答题验证"]')
                if(dialog){
                    const qns_text=dialog.querySelector('strong').innerText
                    const result=calculateSafe(qns_text).toString()
                    console.log("计算结果：",result)
                    const button_list=dialog.querySelectorAll('button')
                    let checked=false
                    for(let i=0;i<button_list.length;i++){
                        const inner_text=button_list[i].innerText
                        if(inner_text === result){
                            console.log("计算结果匹配：",result)
                            button_list[i].click()
                            checked=true
                            break
                        }
                    }
                    if(!checked){
                        console.warn("未找到计算答案")
                        // location.reload()
                    }

                }
            }catch (e) {}
            try{
                const dialog=document.querySelector('div.el-dialog[aria-label="温馨提示"]')
                if(dialog) {
                    dialog.querySelector('button').click()
                }
            }catch (e) {}
        },5000)
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
        console.log("send message")
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
            const confirmResult = await Swal.fire({
                title: "提示",
                html: `<div style="text-align:left">
                    <b>谨慎使用：</b>
                    <li>秒刷可能导致无法打印证书！</li>
                    <li>请合理使用！</li>
                    <li>建议使用自动化挂机播放！</li>
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
                title: "课程刷取中，请等待...",
                text: "刷课成功后，当前视频约剩下2秒左右！注意刷新页面多试！",
                icon: 'info',
                confirmButtonText: '确定',
                willClose: () => {
                }
            });
            window.VIPRunning = true

            const iframe = document.getElementById('learningPlay');
            if (!iframe) return;
            let localData = JSON.parse(localStorage.getItem('global'))
            if (!localData) {
                localData = JSON.parse(localStorage.getItem('global-sy'))
            }
            const uid = localData.uid
            const token = localData.token

            function sendCommandToIframe(command) {
                iframe.contentWindow.postMessage(command, 'https://cslgsyplugservice.ylxue.net');
            }

            console.log("send message")
            setTimeout(() => {
                sendCommandToIframe({
                    action: 'setCurrentTime',
                    data: {
                        uid, token
                    }
                });
            });

        } catch
            (error) {
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
        } finally {
            window.VIPRunning = false
        }
    }

    async run() {

        try {
            const iframe = document.getElementById('learningPlay');
            iframe.contentWindow.postMessage({
                action: 'study',
                data: {}
            }, 'https://cslgsyplugservice.ylxue.net');
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
        // const channel = new BroadcastChannel(this.channel);
        // channel.postMessage(msg);
        if (unsafeWindow.opener && !unsafeWindow.opener.closed) {
            unsafeWindow.opener.postMessage(msg, 'https://zjpx.csu.edu.cn');
        }
    }

    finish() {
        // if (!this.VIP) {
        //     Swal.fire({
        //         title: "请升级高级版！",
        //         text: `脚本已停止！基础版只能连播几个视频！`,
        //         icon: 'info',
        //         confirmButtonColor: "#FF4DAFFF",
        //         confirmButtonText: "确定",
        //         timer: 0,
        //         willClose: () => {
        //             // window.close()
        //         }
        //     })
        //     return
        // }
        this.sendMsg('finish')
        if (Swal) {
            this.sendMsg('finish')
            Swal.fire({
                title: "学习完成！",
                text: `学习完成，5s后页面自动关闭！`,
                icon: 'success',
                confirmButtonColor: "#FF4DAFFF",
                confirmButtonText: "确定",
                timer: 5000,
                willClose: () => {
                    history.back()
                    setTimeout(() => {
                        location.reload()
                    }, 1000)
                }
            })
        }
    }

    async waitForVideoEnd(video, dom) {
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
                    if (dom && this.checkFinish(dom)) {
                        console.log("检测到学完，准备进行下一项！")
                        clearInterval(checkInterval);
                        resolve()
                    }
                    try {
                        const breath = document.querySelector('.el-overlay-message-box .el-button')
                        if (breath) {
                            breath.click()
                        }
                    } catch (e) {

                    }
                    try {
                        //document.querySelector('.dialog-footer').querySelector('button').click()
                        const verify = document.querySelector('.dialog-footer')
                        if (verify) {
                            setTimeout(() => {
                                location.reload()
                            }, 1000)
                        }
                    } catch (e) {

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

    checkFinish(dom) {
        return dom.querySelector('.progress').innerText.includes('100')
    }
}

class Utils {
    constructor() {
    }

    static flag = 'csust_VIP'
    static js_Flag = 'csust_jsCode'
    static vipText = '高级功能已启用！(长沙理工大学)'
    static baseText = '您正在使用基础版本，功能可能存在限制'
    static vipSign = 'csust_vipSign'

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
            const tokenKey = 'global-sy'
            let value = localStorage.getItem(tokenKey);
            value = JSON.parse(value)

            value = value['token']
            value = Utils.decodeJWT(value)
            // console.log(value)
            if (!value || !value.payload.data) {
                throw Error("无效的账号信息！")
            }
            data.bindInfo = value.payload.data.UserId + "_" + value.payload.data.CustomerNo
            data.website = "67f9c5b32eea65fc6c9db7aa"
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

    static decodeJWT(token) {
        try {
            const [headerB64, payloadB64] = token.split('.');
            const decodeBase64Url = (str) => {
                return atob(str.replace(/-/g, '+').replace(/_/g, '/').padEnd(str.length + (4 - str.length % 4) % 4, '='));
            };
            const header = JSON.parse(decodeBase64Url(headerB64));
            const payload = JSON.parse(
                decodeURIComponent(
                    decodeBase64Url(payloadB64)
                        .split('')
                        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                        .join('')
                )
            );
            return {header, payload};
        } catch (error) {
            console.error('解码失败:', error);
            return null;
        }
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
            .auth-window { position: fixed; bottom: 10px; right: 10px; z-index: 999999999999; background: white; padding: 24px; border-radius: 12px; box-shadow: 0 6px 30px rgba(0,0,0,0.15); border: 1px solid #e4e7ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; min-width: 320px; transform: translateY(20px); opacity: 0; transition: all 0.3s ease; } .auth-window.visible  { transform: translateY(0); opacity: 1; } .auth-title { margin: 0 0 16px; font-size: 20px; color: #2c3e50; font-weight: 600; display: flex; align-items: center; gap: 8px; } .auth-version { font-size: 12px; color: #95a5a6; font-weight: normal; } .auth-tip { margin: 0 0 20px; color: #ffbb00; font-size: 14px; font-weight: weight; line-height: 1.5; } .input-group { margin-bottom: 18px; } .input-label { display: block; margin-bottom: 6px; color: #34495e; font-size: 14px; font-weight: 500; } .input-field { width: 80%; padding: 10px 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; transition: border-color 0.2s; } .input-field:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 3px rgba(52,152,219,0.1); } .auth-button { width: 100%; padding: 12px; background: #3498db; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; } .auth-button:hover { background: #2980b9; transform: translateY(-1px); } .auth-button:active { transform: translateY(0); } .error-message { color: #e74c3c; font-size: 13px; margin-top: 8px; padding: 8px; background: #fdeded; border-radius: 6px; display: none; animation: shake 0.4s; } @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } } .control-panel { opacity: 1; transform: translateY(10px); transition: all 0.3s ease; } .control-panel.visible  { opacity: 1; transform: translateY(0); } .auth-button[disabled] { background: #bdc3c7 !important; cursor: not-allowed; } .auth-window { position: fixed; right: 30px; bottom: 80px; transition: transform 0.3s ease; } .window-toggle:hover .toggle-icon { animation: bounce 0.6s; } .toggle-icon { width: 20px; height: 20px; transition: transform 0.3s ease; } @keyframes bounce { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(4px); } } /* VIP 按钮特效 */ .vip-btn { width: 100%; position: relative; padding: 12px 24px; border: none; border-radius: 8px; background: linear-gradient(135deg, #ffd700 0%, #ffd900 30%, #ffae00 70%, #ff8c00 100%); color: #2c1a00; font-weight: 600; font-family: 'Segoe UI', sans-serif; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; box-shadow: 0 4px 15px rgba(255, 174, 0, 0.3); } /* 辉光动画效果 */ .glow-effect::after { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); opacity: 0; transition: opacity 0.3s; } /* 悬停交互 */ .vip-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 174, 0, 0.5); } .vip-btn:hover::after { opacity: 1; } /* 点击反馈 */ .vip-btn:active { transform: translateY(1px); box-shadow: 0 2px 8px rgba(255, 174, 0, 0.3); } /* 皇冠图标动画 */ .crown-icon { width: 20px; height: 20px; margin-right: 8px; vertical-align: middle; transition: transform 0.3s; } .vip-btn:hover .crown-icon { transform: rotate(10deg) scale(1.1); } /* 文字渐变特效 */ .vip-text { background: linear-gradient(45deg, #2c1a00, #5a3a00); -webkit-background-clip: text; background-clip: text; color: transparent; display: inline-block; } * 弹窗容器 */ .vip-alert-popup { border: 2px solid #ffd700; border-radius: 12px; background: linear-gradient(145deg, #1a1a1a, #2d2d2d); } /* 标题区域 */ .alert-header { border-bottom: 1px solid #404040; padding-bottom: 12px; margin-bottom: 15px; } .swal-vip-icon { color: #ffd700; font-size: 2.2em; margin-right: 8px; } /* 需求列表 */ .requirements-box { background: rgba(255,215,0,0.1); border-radius: 8px; padding: 15px; margin: 15px 0; } .requirement-item { display: flex; align-items: center; margin: 10px 0; } .number-badge { background: #ffd700; color: #000; width: 24px; height: 24px; border-radius: 50%; text-align: center; margin-right: 12px; font-weight: bold; } /* 状态标签 */ .status-tag { padding: 4px 8px; border-radius: 4px; font-size: 0.9em; } .free-status { background: #ff4444; color: white; } /* 操作引导 */ .action-guide { background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; } .step-list li { margin: 8px 0; padding-left: 8px; } .pricing-link { color: #00ff9d !important; text-decoration: underline dotted; transition: all 0.3s; } .pricing-link:hover { color: #00cc7a !important; text-decoration: underline; } /* 确认按钮 */ .vip-confirm-btn { background: linear-gradient(135deg, #ffd700 0%, #ff9900 100%) !important; border: none !important; font-weight: bold !important; transition: transform 0.2s !important; } .vip-confirm-btn:hover { transform: scale(1.05); }
        `)
        GM_addStyle(` div.swal2-container { all: initial !important; /* 重置所有继承样式 */ position: fixed !important; z-index: 999999 !important; inset: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; background: rgba(0,0,0,0.4) !important; } .swal2-popup { all: initial !important; max-width: 600px !important; width: 90vw !important; min-width: 300px !important; position: relative !important; box-sizing: border-box !important; padding: 20px !important; background: white !important; border-radius: 8px !important; font-family: Arial !important; animation: none !important; } @keyframes swal2-show { 0% { transform: scale(0.9); opacity: 0 } 100% { transform: scale(1); opacity: 1 } } `);
        GM_addStyle(` /* 实验功能容器 */ .beta-container { margin: 18px 0; border-radius: 10px; background: linear-gradient(145deg, #2d2d2d, #1a1a1a); border: 1px solid rgba(255, 215, 0, 0.2); box-shadow: 0 4px 20px rgba(0,0,0,0.2); } .beta-card { padding: 16px; } /* 标题区域 */ .beta-header { display: flex; align-items: center; gap: 12px; margin-bottom: 18px; } .beta-icon { width: 28px; height: 28px; fill: #ffd700; filter: drop-shadow(0 0 4px rgba(255,215,0,0.3)); } .beta-title { margin: 0; color: #ffd700; font-size: 16px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.2); } /* 开关组件 */ .beta-toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; padding: 10px; border-radius: 8px; transition: background 0.3s; } .beta-toggle:hover { background: rgba(255,215,0,0.05); } .beta-checkbox { display: none; } /* 自定义轨道 */ .beta-track { position: relative; width: 50px; height: 28px; border-radius: 14px; background: rgba(255,215,0,0.1); border: 1px solid rgba(255,215,0,0.3); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); } /* 滑块 */ .beta-thumb { position: absolute; left: 2px; top: 2px; width: 24px; height: 24px; background: linear-gradient(145deg, #ffd700, #ffae00); border-radius: 50%; transform: translateX(0); transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 2px 4px rgba(0,0,0,0.2); } /* 选中状态 */ .beta-checkbox:checked + .beta-track { background: rgba(255,215,0,0.2); border-color: #ffd700; } .beta-checkbox:checked + .beta-track .beta-thumb { transform: translateX(22px); } /* 光效 */ .beta-sparkles { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 10%, transparent 60%); opacity: 0; transition: opacity 0.3s; } .beta-checkbox:checked + .beta-track .beta-sparkles { opacity: 0.3; } /* 文字样式 */ .beta-label { color: #fff; font-size: 14px; font-weight: 500; letter-spacing: 0.5px; background: linear-gradient(90deg, #ffd700, #ffae00); -webkit-background-clip: text; background-clip: text; color: transparent; } .beta-tip { margin: 12px 0 0; color: rgba(255,215,0,0.6); font-size: 12px; line-height: 1.4; padding-left: 8px; border-left: 3px solid rgba(255,215,0,0.3); } /* 新增进度条样式 */ .progress-overlay { position: fixed; bottom: 0; left: 30%; transform: translate(0 -50%); background: rgba(0,0,0,0.8); padding: 24px; border-radius: 12px; color: white; z-index: 9999999999; display: none; min-width: 300px; height:100px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); backdrop-filter: blur(8px); } .progress-header { margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; } .progress-title { margin: 0; font-size: 16px; color: #fff; } .progress-bar { display:block; width: 100%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; } .progress-fill { height: 100%; background: linear-gradient(90deg, #00ff88, #00ccff); transition: width 0.3s ease; } .progress-info { margin-top: 15px; text-align: center;        /* 整体内容水平居中 */ gap: 20px;                 /* 添加元素间距 */ font-size: 12px; color: rgba(255,255,255,0.8); }`);

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

        this.vipGroup = document.createElement('div');
        this.vipGroup.className = 'beta-container';
        this.vipGroup.innerHTML = `
    <div class="beta-card">
        <div class="beta-header">
            <svg class="beta-icon" viewBox="0 0 24 24">
                <path d="M16 3l1.5 3h3l-2 2 1 3-3-1-2 2v-3l-2-2-2 2v3l-2-2-3 1 1-3-2-2h3L8 3h2l1 2 1-2h4zM8 13h8v6H8v-6z"/>
            </svg>
            <h3 class="beta-title">高级功能选用</h3>
        </div>
        <label class="beta-toggle">
            <input type="checkbox" id="beta-speed" class="beta-checkbox">
            <div class="beta-track">
                <div class="beta-thumb">
                    <span class="beta-sparkles"></span>
                </div>
            </div>
            <span class="beta-label">秒过模式</span>
        </label>
        <p class="beta-tip">* 开启后，请刷新页面。每个视频大约播放三分钟后秒过！</p>
    </div>
`;
        this.betaCheckbox = this.vipGroup.querySelector('#beta-speed');
        this.betaCheckbox.checked = GM_getValue(Utils.vipSign, false);
        this.betaCheckbox.onchange = (e) => {
            GM_setValue(Utils.vipSign, e.target.checked);
        };

        // 组装结构
        this.controlPanel.append(
            this.vipBtn,
            // this.vipGroup,
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
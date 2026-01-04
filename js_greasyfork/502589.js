// ==UserScript==
// @name         JK Steam
// @namespace    http://tampermonkey.net/
// @version      1.3.2-beta-0
// @description  这个世界上又双叒叕多了一个盗版Steam（喜）
// @author       Debug618, Snoozing_QwQ
// @match        http://*.noip.ac.cn/*
// @match        http://101.37.71.201/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.noip.ac.cn
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/502589/JK%20Steam.user.js
// @updateURL https://update.greasyfork.org/scripts/502589/JK%20Steam.meta.js
// ==/UserScript==

/*
（目前不保证能够成功检测到更新，请手动前往下载地址检查是否有新版本）

更新日志:（将以下内容复制到 Markdown 编辑器会有更好的阅读体验）
## 1.3.1-beta-3
- 更新了正确的下载与更新地址

## 1.3.1-beta-4
- 重构了部分代码
- 修复了 bug “除排行榜页面外的等级标签未修改”
- 在“家”页面增加了插件下载源地址

## 1.3.1-beta-5
- 修复了 bug “竞赛排行榜页面玩家成绩表格被错误拉伸”

## 1.3.1-beta-6
- 增加了 noip.ac.cn 的 ip4 地址匹配
- 可以从控制台输出当前最新插件版本，预计于下个正式新功能版本 (1.3.2) 加入自动更新检测，但要求服务器处于开启状态

## 1.3.1-beta-7
- 增加了设置功能
- 增加了鼠标按下时的炫酷粒子特效（可选）
- 修改了部分代码逻辑
- 在个人主页增加了 tag 显示

## 1.3.2-beta-0
- 增加了自动更新提示功能
- 增加了一些设置选项
- 修改了一些代码逻辑
- 将 rk 排名的 tag 位置更改到等级 tag 后而非用户链接内
*/

var HINF = 1073741823; 
var COLOR = {"red": "#ed1c24", "orange": "#ff7f27"}; 

var ooos_for_stoooj = "oooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo"; 
//stooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooj（喜

// 一言
var yiyan = [
    "!\`st${ooos_for_stoooj.substr(0,Math.floor(Math.random()*210)+40)}j - Snoozing_QwQ\`",//!开头的表示不定
    '<a href="/user/2">沃尔玛购物袋</a>：我最喜欢<a href="/user/2">南通</a>了',
    '有 bug 记得反馈给<a href="/user/32">我</a>或 <a href="/user/43">Debug618</a> 哦 - Snoozing_QwQ',
    "AC？不可能！\n我不信梦熊的评测机卡不掉你！",
    "梦熊？哈？可以次掉吗？",
    `被你发现了/kk 快打<a href="/contest">电竞</a>去`,
    `众所周知，<a href="//www.luogu.com.cn/user/10703">小粉兔</a>的眼睛是红色的，所以是杀手兔`,
    `<a href="//www.bilibili.com/video/BV1GJ411x7h7/">点我次掉一言</a>`,
    "Snq*b - qizhiyu（费用 0 RMB）",
    "w*有南通 - qizhiyu（费用 0 RMB）",
    `<a href="/wiki/help">noip新用户避读</a>`,
    "想不想看 Snq 照片（此处为 Snq 加：以后粉福可能会有） - qizhiyu（费用0RMB）",
    "€€￡断开了连接，因为你没有给€€￡打钱 - Debug618",
    `<a href="//www.luogu.com.cn/user/558147">给 Debug618 引流</a></br><a href="//space.bilibili.com/1795213216">Debug618 的 B 站</a>`,
    "东郭凉，冻果梁，董郭亮，懂过量，动裹粮，洞粿糧。挏锅俩，咚聒良。懂过两，冬过良。</br></br>翻译：东边的镇子非常寒冷，把（放在野外的）果子粮食冻坏了，有一个叫董郭亮的人，知道很多（贮存食物的）知识，于是动手（用土）裹住粮食，（挖开的洞）充满了粮食。（来年取出并）摇动（有粮食的）两个锅，发出的声响很大。（如果你）懂得的有一些，冬天会更好过的。\n————zth",
    "注意背后！小心精卫！",
    "某同学：“时光如白驹过隙！”老师：“下课。” - Debug618",
    "众所周知，(1e5)^2=1e7，所以 O(n^2) 在 MX 能过 1e5 的数据。 - Debug618",
    `众所周知，在梦熊可以跑过 1e12 的数据，所以当 n = 1e6，O(n^2) 在 MX 能过 1s 的数据。
根据摩根定律，每 18 月CPU性能 *= 2，所以每15年左右MX的性能就会 × 1024
也就是说，梦熊的构思栈评测是领先于其它评测机的 - Snoozing_QwQ`,
    "“善哉，然也！”",
    "“善哉，然也。一鼻屎，一手指，在教室。人不堪其恶心，然也不改其乐。善哉，然也！”",
    "“闪栽，染液。一彼时，以守志，栽礁石。入步砍其鹅心，染液部该起热。闪栽，染液！”",
    '广告位招租, 可投稿给 <a href="/user/32">Snoozing_QwQ</a>',
]; 
var tag_users = [
    { uid: 32, text: "贡献者", hover: "JK Steam 贡献者", color: "red" }, 
    { uid: 43, text: "作者", hover: "JK Steam 作者", color: "red" },
    { uid: 86, text: "贡献者", hover: "JK Steam 文案贡献者", color: "red" },
    { uid: 781, text: "贡献者", hover: "JK Steam 源码贡献者", color: "orange" }
]; 
const defaultConfig = { // 默认配置
    enableAutoUpdateCheck: true, 
    enableMouseAnimation: true, 
    mouseAnimationTextInit: [0, -20], // px
    mouseAnimationTextMove: [0, -160], // px
    mouseAnimationTextTime: 3000, // ms
    mouseAnimationTextZIndex: 499, 
}; 

var version = GM_info.script.version; 
var site_dark_scheme; 

// 碎觉
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time)); 
}

// 延迟更新
function updateSite (func) {
    if (document.readyState == "loading") document.addEventListener("DOMContentLoaded", func); 
    else func(); 
}

// 变量获取
function initVars () {
    site_dark_scheme = document.getElementsByTagName("html")[0].className.search('theme--light') == -1; 
}

// 获取配置
function getConfig () {
    return { ...defaultConfig, ...GM_getValue('scriptConfig') }; 
}

// 保存配置
function saveConfig (newConfig) {
    GM_setValue('scriptConfig', newConfig); 
}

// 获取标签节点
function getTagNode (tag) {
    let tagnode = document.createElement('a'); 
    tagnode.className = 'user-profile-badge v-center'; 
    tagnode.style = `background-color: ${COLOR[tag.color]}; color: #ffffff; `; 
    tagnode.setAttribute('data-tooltip', tag.hover); 
    tagnode.href = `/user/${tag.uid}`
    tagnode.innerHTML = tag.text; 
    return tagnode; 
}

// 配置按钮触发
function buttonConfigEvent () {
    let config = getConfig(), config_div = document.createElement("div"); 
    config_div.className = "jksteam-background"; 
    config_div.style.cssText = `position: fixed; top: 20px; right: 20px; padding: 15px; z-index: ${HINF}; box-shadow: 20px 20px 20px rgba(0,0,0,0.1); border-radius: 20px; width: 618px`; 
    config_div.innerHTML = `
        <h3 style="margin-top: 0; margin-bottom: 10px; ">JK Steam 配置</h3>
        <br>
        <input type="checkbox" id="enableAutoUpdateCheck" ${config.enableAutoUpdateCheck ? "checked" : ""}> 自动检测更新
        <br><br>
        <input type="checkbox" id="enableMouseAnimation" ${config.enableMouseAnimation ? "checked" : ""}> 按下鼠标触发炫酷粒子特效（由 <a href="/user/781">willAK</a> 提供）
        <br><br>
        &emsp;&emsp;炫酷特效文字效果时长&emsp;<input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextTime" placeholder="${defaultConfig.mouseAnimationTextTime}" value="${config.mouseAnimationTextTime}"> ms
        <br>
        &emsp;&emsp;炫酷特效文字初始偏移位置&emsp;x <input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextInitX" placeholder="${defaultConfig.mouseAnimationTextInit[0]}" value="${config.mouseAnimationTextInit[0]}">&emsp;y <input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextInitY" placeholder="${defaultConfig.mouseAnimationTextInit[1]}" value="${config.mouseAnimationTextInit[1]}">
        <br>
        &emsp;&emsp;炫酷特效文字效果移动位置&emsp;x <input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextMoveX" placeholder="${defaultConfig.mouseAnimationTextMove[0]}" value="${config.mouseAnimationTextMove[0]}">&emsp;y <input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextMoveY" placeholder="${defaultConfig.mouseAnimationTextMove[1]}" value="${config.mouseAnimationTextMove[1]}">
        <br>
        &emsp;&emsp;炫酷特效文字层级&emsp;<input type="number" class="jksteam-input jksteam-input-number" id="mouseAnimationTextZIndex" placeholder="${defaultConfig.mouseAnimationTextZIndex}" value="${config.mouseAnimationTextZIndex}">
        <br><br>
        <button class="jksteam-button" id="saveConfig">保存</button>
        <button class="jksteam-button" id="closeConfig">关闭</button>
        <button class="jksteam-button" id="setDefaultConfig" style="float: right; ">重置为默认</button>
    `; 
    document.body.appendChild(config_div); 
    config_div.querySelector("#saveConfig").addEventListener("click", () => {
        const newConfig = {
            enableAutoUpdateCheck: document.getElementById("enableAutoUpdateCheck").checked, 
            enableMouseAnimation: document.getElementById("enableMouseAnimation").checked, 
            mouseAnimationTextInit: [Number(document.getElementById("mouseAnimationTextInitX").value), Number(document.getElementById("mouseAnimationTextInitY").value)], 
            mouseAnimationTextMove: [Number(document.getElementById("mouseAnimationTextMoveX").value), Number(document.getElementById("mouseAnimationTextMoveY").value)], 
            mouseAnimationTextTime: Number(document.getElementById("mouseAnimationTextTime").value), 
            mouseAnimationTextZIndex: Number(document.getElementById("mouseAnimationTextZIndex").value), 
        }; 
        saveConfig(newConfig); 
        alert("配置已保存。请手动刷新页面以应用新的配置。"); 
    }); 
    config_div.querySelector("#closeConfig").addEventListener("click", () => {
        config_div.remove(); 
    }); 
    config_div.querySelector("#setDefaultConfig").addEventListener("click", () => {
        saveConfig(defaultConfig); 
        alert("配置已重置。请手动刷新页面以应用新的配置。"); 
    }); 
}

// 向网页中添加配置按钮
function addConfigButton () {
    let button = document.createElement("button"); 
    button.textContent = "JKSteam 设置"; 
    button.style.cssText = `position: fixed; bottom: 20px; right: 80px; z-index: ${HINF};`; 
    button.className = "jksteam-button"; 
    button.addEventListener("click", buttonConfigEvent); 
    document.body.appendChild(button); 
}

// 执行显示配置功能
function runShowConfig () {
    addConfigButton(); 
    let config = getConfig(); 
    if (config.enableMouseAnimation) {
        // 以下代码由 uid 781 提供
        class Circle {
            constructor ({ origin, speed, color, angle, context }) {
                this.origin = origin; 
                this.position = { ...this.origin }; 
                this.color = color; 
                this.speed = speed; 
                this.angle = angle; 
                this.context = context; 
                this.renderCount = 0; 
            }

            draw () {
                this.context.fillStyle = this.color; 
                this.context.beginPath(); 
                this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2); 
                this.context.fill(); 
            }

            move () {
                this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x; 
                this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3); 
                this.renderCount++; 
            }
        }

        class Boom {
            constructor ({ origin, context, circleCount = 10, area }) {
                this.origin = origin; 
                this.context = context; 
                this.circleCount = circleCount; 
                this.area = area; 
                this.stop = false; 
                this.circles = []; 
            }

            randomArray (range) {
                const length = range.length; 
                const randomIndex = Math.floor(length * Math.random()); 
                return range[randomIndex]; 
            }

            randomColor () {
                const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']; 
                return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range); 
            }

            randomRange (start, end) {
                return (end - start) * Math.random() + start; 
            }

            init () {
                for (let i = 0; i < this.circleCount; i++) {
                    const circle = new Circle({
                        context: this.context,
                        origin: this.origin,
                        color: this.randomColor(),
                        angle: this.randomRange(Math.PI - 1, Math.PI + 1),
                        speed: this.randomRange(1, 6)
                    }); 
                    this.circles.push(circle); 
                }
            }

            move () {
                this.circles.forEach((circle, index) => {
                    if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
                        return this.circles.splice(index, 1); 
                    }
                    circle.move(); 
                }); 
                if (this.circles.length == 0) {
                    this.stop = true; 
                }
            }

            draw () {
                this.circles.forEach(circle => circle.draw()); 
            }
        }

        class CursorSpecialEffects {
            constructor () {
                this.computerCanvas = document.createElement('canvas'); 
                this.renderCanvas = document.createElement('canvas'); 

                this.computerContext = this.computerCanvas.getContext('2d'); 
                this.renderContext = this.renderCanvas.getContext('2d'); 

                this.globalWidth = window.innerWidth; 
                this.globalHeight = window.innerHeight; 

                this.booms = []; 
                this.running = false; 
            }

            handleMouseDown (e) {
                const boom = new Boom({
                    origin: { x: e.clientX, y: e.clientY },
                    context: this.computerContext,
                    area: {
                        width: this.globalWidth,
                        height: this.globalHeight
                    }
                }); 
                boom.init(); 
                this.booms.push(boom); 
                this.running || this.run(); 
            }

            handlePageHide () {
                this.booms = []; 
                this.running = false; 
            }

            init () {
                const style = this.renderCanvas.style; 
                style.position = 'fixed'; 
                style.top = style.left = 0; 
                style.zIndex = `${HINF}`; 
                style.pointerEvents = 'none'; 

                style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth; 
                style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight; 

                document.body.append(this.renderCanvas); 

                window.addEventListener('mousedown', this.handleMouseDown.bind(this)); 
                window.addEventListener('pagehide', this.handlePageHide.bind(this)); 
            }

            run() {
                this.running = true; 
                if (this.booms.length == 0) {
                    return this.running = false; 
                }

                requestAnimationFrame(this.run.bind(this)); 

                this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight); 
                this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight); 

                this.booms.forEach((boom, index) => {
                    if (boom.stop) {
                        return this.booms.splice(index, 1); 
                    }
                    boom.move(); 
                    boom.draw(); 
                })
                this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight); 
            }
        }

        const cursorSpecialEffects = new CursorSpecialEffects(); 
        cursorSpecialEffects.init(); 

        let text_idx = 0; 
        let texts = ["I AK IOI", "orz", "sto", "AK", "AC", "CE", "PC", "WA", "RE", "TLE", "MLE", "OLE", "UKE"]; 
        document.addEventListener('mousedown', function (event) {
            let node = document.createElement('span'); 
            text_idx = (text_idx + 1) % texts.length; 
            let x = event.pageX, y = event.pageY; 
            node.textContent = texts[text_idx]; 
            node.style.cssText = `
                z-index: ${config.mouseAnimationTextZIndex}; 
                top: ${y + config.mouseAnimationTextInit[1]}px; 
                left: ${x + config.mouseAnimationTextInit[0]}px; 
                position: absolute; 
                font-weight: bold; 
                color: rgb(${~~(255 * Math.random())}, ${~~(255 * Math.random())}, ${~~(255 * Math.random())}); 
            `; 
            document.body.appendChild(node); 
            let animation = node.animate(
                [
                    { transform: "translate(0, 0)", opacity: 1 }, 
                    { transform: `translate(${config.mouseAnimationTextMove[0]}px, ${config.mouseAnimationTextMove[1]}px)`, opacity: 0 }
                ], { duration: config.mouseAnimationTextTime, easing: 'ease-out' }
            ); 
            console.log(config.mouseAnimationTextTime); 
            animation.onfinish = function () {
                node.remove(); 
            }; 
        }); 
    }
}

// 增加样式
function addStyle () {
    let styleNode = document.createElement("style"); 
    styleNode.innerHTML = `
    .jksteam-background {
        background-color: ${site_dark_scheme ? "#444" : "#eee"}; 
    }
    
    .jksteam-button {
        background-color: ${site_dark_scheme ? "#4f4f4f" : "#cfcfcf"}; 
        padding: 8px; 
        border-radius: 8px; 
        transition: background-color 0.5s; 
    }
    
    .jksteam-button:hover {
        background-color: ${site_dark_scheme ? "#5e5e5e" : "#a1a1a1"}; 
    }
    
    .jksteam-input {
        border-radius: 8px; 
        border-width: 1px; 
        border-style: outset inset inset outset; 
        border-color: ${site_dark_scheme ? "#777" : "#767676"}; 
        background-color: ${site_dark_scheme ? "#333" : "#fff"} !important; 
        padding: 0 6px 2px; 
    }
    
    .jksteam-input-number {
        width: 80px; 
    }
    
    .jksteam-link {
        color: ${site_dark_scheme ? '#1fccee' : '#11aadd'} !important; 
        transition: color 0.5s; 
    }
    
    .jksteam-link:hover {
        color: ${site_dark_scheme ? '#44eecc' : '#227799'} !important; 
        text-decoration-line: none; 
    }
    `; 
    document.head.appendChild(styleNode); 
}

// 加一言
function updateYiyan () {
    let yiyan_content = yiyan[Math.floor(Math.random() * yiyan.length)]; 
    if (yiyan_content[0] == '!') yiyan_content = eval(yiyan_content.substring(1)); 
    yiyan_content = "<p>" + yiyan_content + "</p>"; 
    let yiyan_node = document.getElementsByName("hitokoto")[0]; 
    yiyan_node.innerHTML = yiyan_content; 
    yiyan_node.removeAttribute("name"); 
}

// 用户页面 加 tag
function addTagInUserSite () {
    for (let i = 0; i < tag_users.length; i++) {
        if (tag_users[i].regexp.test(document.URL)) {
            document.getElementsByClassName("profile-header__main")[0].children[0].appendChild(getTagNode(tag_users[i])); 
        }
    }
}

function showLog (str) {
    let lognode = document.createElement('div'); 
    lognode.style.cssText = `position: fixed; top: 20px; left: 20px; padding: 15px; z-index: ${HINF}; box-shadow: -20px 20px 20px rgba(0, 0, 0, 0.1); border-radius: 8px; width: 512px`; 
    lognode.className = 'jksteam-background'; 
    lognode.innerHTML = str; 
    let closenode = document.createElement('button'); 
    closenode.className = 'jksteam-button'; 
    closenode.textContent = '关闭'; 
    closenode.id = 'closeJKSteamLog'; 
    lognode.appendChild(closenode); 
    document.body.appendChild(lognode); 
    lognode.querySelector('#closeJKSteamLog').addEventListener('click', () => {
        lognode.remove(); 
    }); 
    return lognode; 
}

function autoUpdateCheck () {
    console.log(`version: ${version}`); 
    console.log("Getting last version..."); 
    
    let planIP = "183.136.204.15", planPort = "60708", downloadUrl = "http://183.136.204.15:55618/plugin/JKSteam.user.js"; 
    let socket = new WebSocket("ws://" + planIP + ":" + planPort); 
    
    socket.onopen = (event) => {
        socket.send("/get plugin version JKSteam"); 
    }; 
    
    socket.onmessage = (event) => {
        let command = event.data; 
        console.log(`Received: ${command}`); 
        if (command[0] == "/") {
            let server_ver = command.substring(6); 
            if (command.substring(1, 6) == "send ") {
                console.log(`Last version: ${server_ver}`); 
                if (server_ver != version) {
                    let lognode = showLog(`检测到插件的服务器版本与当前版本不一致。是否更新？<br><br>当前版本：${version}，服务器版本：${server_ver}<br><br><a class="jksteam-link" href="${downloadUrl}">点我更新</a><br><br>`); 
                }
            }
        }
    }; 
    
    socket.onerror = () => {
        console.error("Link error!"); 
    }; 
    
    window.onbeforeunload = () => {
        socket.close(); 
    }; 
}

(async function () {
    
    initVars(); 
    
    addStyle(); 
    
    if (getConfig().enableAutoUpdateCheck) {
        autoUpdateCheck(); 
    }
    
    let url = location.href; 
    let mode = null; 
    
    const matches = {
        "^http://*": "defalt",
        "^http://*.noip.ac.cn/": "index",
        "^http://*.noip.ac.cn": "index",
        "^http://*.noip.ac.cn/p/*": "problem",
        "^http://*.noip.ac.cn/p/*tid=*": "problem",
        "^http://*.noip.ac.cn/p": "problems",
        "^http://*.noip.ac.cn/p?page=*": "problems",
        "^http://*.noip.ac.cn/p?q=*&page=*": "problems",
        "^http://*.noip.ac.cn/p?q=*": "problems",
        "^http://*.noip.ac.cn/ranking*": "rank",
        "^http://*.noip.ac.cn/record*": "record",
        "^http://(www\.)?noip\.ac\.cn/record\?uidOrName=[1-9]*": "record",
        "^http://(www\.)?noip\.ac\.cn/record/[0-9]*": "record_",
        "^http://*.noip.ac.cn/homework*": "homework",
        "^http://*.noip.ac.cn/discuss*": "discuss",
        "^http://*.noip.ac.cn/contest*": "contests",
        "^http://*.noip.ac.cn/contest/*": "contest",
        "^http://*.noip.ac.cn/user/*": "user",
        "^http://noip.ac.cn/wiki/help": "help",
        "^http://*.noip.ac.cn/training/*": "training",
    }; 
    for (let e of Object.keys(matches)) {
        if (new RegExp(e).test(url)) mode = matches[e]; 
    }
    runShowConfig(); 
    let a = document.getElementsByClassName('nav__item'); 
    for (let i = 0; i < a.length; i++) {
        if (~a[i].innerHTML.search('首页')) a[i].innerHTML = '家'; 
        else if (~a[i].innerHTML.search('题库')) a[i].innerHTML = '库'; 
        else if (~a[i].innerHTML.search('训练')) a[i].innerHTML = '练习'; 
        else if (~a[i].innerHTML.search('比赛')) a[i].innerHTML = '电竞'; 
        else if (~a[i].innerHTML.search('作业')) a[i].innerHTML = '任务'; 
        else if (~a[i].innerHTML.search('讨论')) a[i].innerHTML = '论坛'; 
        else if (~a[i].innerHTML.search('评测记录')) a[i].innerHTML = '游玩记录'; 
        else if (~a[i].innerHTML.search('排名')) a[i].innerHTML = '排行榜'; 
    }
    a = document.getElementsByClassName('section__title'); 
    for (let i = 0; i < a.length; i++) {
        if (~a[i].innerHTML.search('首页')) a[i].innerHTML = '家'; 
        else if (~a[i].innerHTML.search('题库')) a[i].innerHTML = '库'; 
        else if (~a[i].innerHTML.search('训练')) a[i].innerHTML = '练习'; 
        else if (a[i].innerHTML == '比赛') a[i].innerHTML = '电竞'; 
        else if (~a[i].innerHTML.search('作业')) a[i].innerHTML = '任务'; 
        else if (~a[i].innerHTML.search('讨论')) a[i].innerHTML = '论坛'; 
        else if (~a[i].innerHTML.search('评测记录')) a[i].innerHTML = '游玩记录'; 
        else if (~a[i].innerHTML.search('排名')) a[i].innerHTML = '排行榜'; 
    }
    let navlistitem = document.getElementsByClassName('nav__list-item'); 
    navlistitem[0].innerHTML = `<a href="https://store.steampowered.com"><img src="https://store.cdn.queniuqe.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44"></a>`
    let typoa = document.getElementsByClassName("typo-a"), sectiontitle = document.getElementsByClassName("section__title"); 
    let div = document.getElementsByClassName("section__body typo richmedia"); 
    if (mode == "index") {
        console.log("index"); 
        div[0].innerHTML = `
            <h2 style="color: orange;">请不定时前往 <a href="http://110.42.59.59:55618/plugin/JKSteam.user.js">这里</a> 或 <a href="https://update.greasyfork.org/scripts/502589/JK%20Steam.user.js"></a> 检查是否有新版本的 JK Steam。</h2>
            <h1>
                <font color="red">
                    永久置顶一言
                </font>
                </br>
                </br>
                <font color="cyan">
                    沃尔玛购物袋：我最喜欢南通了
                </font>
            </h1>
            <h1>
                JK <img src="https://store.cdn.queniuqe.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44">
                好闪，拜谢 JK
                <img src="https://store.cdn.queniuqe.com/public/shared/images/header/logo_steam.svg?t=962016" width="176" height="44">
            </h1>
            <h2 id="%E8%AF%B7%E5%90%8C%E5%AD%A6%E4%BB%AC%E6%8A%84%E9%A2%98%E8%A7%A3-%EF%BC%8C%E6%AD%A4%E7%A7%8D%E8%A1%8C%E4%B8%BA%E8%A2%AB%E5%8F%91%E7%8E%B0%E5%90%8E%E4%BC%9A%E8%AD%A6%E5%91%8A%EF%BC%9B" tabindex="-1">
                请同学们
                <span style='color: red; font-size: 123%; '>要</span>
                抄题解，此种行为被发现后会被给予
                <span style='color: purple; font-size: 200%; '><b>超级管理员</b></span>
                奖励。
            </h2>
            <h2 id="%E8%AF%B7%E5%90%8C%E5%AD%A6%E4%BB%AC%E5%B0%8A%E9%87%8D%EF%BC%8C%E5%9C%A8%E6%AF%94%E8%B5%9B%E6%9C%9F%E9%97%B4%E5%B0%86%E4%BB%A3%E7%A0%81%E5%88%86%E4%BA%AB%E7%BB%99%E5%85%B6%E4%BB%96%E4%BA%BA%E3%80%82" tabindex="-1">请同学们尊重<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML">
                            <semantics>
                                <mrow>
                                    <mstyle mathcolor="red">
                                        <mtext>抄袭</mtext>
                                    </mstyle>
                                </mrow>
                                <annotation encoding="application/x-tex">\\color{red}{抄袭}</annotation>
                            </semantics>
                        </math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6833em;"></span><span class="mord" style="color:red;"><span class="mord cjk_fallback" style="color:red;">抄袭</span></span></span></span></span>，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML">
                            <semantics>
                                <mrow>
                                    <mstyle mathcolor="red">
                                        <mtext>要</mtext>
                                    </mstyle>
                                </mrow>
                                <annotation encoding="application/x-tex">\\color{red}{要}</annotation>
                            </semantics>
                        </math>
                    </span>
                    <span class="katex-html" aria-hidden="true">
                        <span class="base">
                            <span class="strut" style="height:0.6833em;">
                            </span>
                            <span class="mord" style="color:red;">
                                <span class="mord cjk_fallback" style="color:red;">
                                    要
                                </span>
                            </span>
                        </span>
                    </span>
                </span>
                在比赛期间将代码分享给其他人。
            </h2>
            <hr>
            <p style='font-size: 288%'>大 逝 寄</p>
            <span>公元2024年12月22日16时前后，JK Steam所有用户因</span>
            <span style='font-size: 114%'><b>抄题解次数过多</b></span>
            <span>而被给予了</span>
            <span style='color: purple; font-size: 250%'><b>超级管理员</b></span>
            <span>奖励。</span>
            <br>
            <p>公元2024年12月23日下午，XL6B的某位同学一不小心将 (10^4)^2 算成了 10^6。</p>
            <h2>
                MC专区
            </h2>
            <p>
            <a href="https://ltcat.lanzoui.com/b0aj6gsid">
                下载启动器1点击这里（验证码PCL2）
            </a>
            <a href="https://hmcl.huangyuhui.net/">
                下载启动器2点击这里
            </a>
            <h2>
                杂到不能再杂的东西
            </h2>
            <a href="http://noip.ac.cn/file/2/0A%E6%B2%B9%E7%8C%B4%E6%8F%92%E4%BB%B6.zip">tampermonkey</a></p>
            <p style="text-align: center; ">警告：别往下翻！</p>
            <p style="text-align: center; ">警告：别往下翻！！</p>
            <p style="text-align: center; ">警告：别往下翻！！！</p>
            <p style="text-align: center; ">警告：别往下翻！！！！</p>
            <p style="text-align: center; ">警告：别往下翻！！！！！</p>
            <p style="padding-bottom: 114px; color: yellow; text-align: center; ">警告：别往下翻！！！！！！</p>
            <p style="padding-bottom: 288px; color: orange; text-align: center; ">警告：别往下翻！！！！！！！！！！！！</p>
            <p style="padding-bottom: 514px; color: red; text-align: center; ">警告：别往下翻！！！！！！！！！！！！！！！！！！！！</p>
            <small>啊哦？沃尔玛购物袋呢？</small>
        `; 
        sectiontitle[6].innerHTML = '最新练习赛'; 
        sectiontitle[9].innerHTML = 'Steam'; 
        updateYiyan(); 
    }
    if (mode == "discuss") {
        try {
            sectiontitle[3].innerHTML = 'Steam'; 
        } catch (err) {}
    }
    if (mode == "discuss" || mode == "index") {
        console.log(mode); 
        try {
            typoa[2].innerHTML = 'Steam上的网页游戏'; 
            typoa[2].href = 'https://store.steampowered.com'; 
            typoa[6].innerHTML = '技巧'; 
            typoa[6].href = 'https://www.bilibili.com/video/BV1GJ411x7h7/?spm_id_from=333.337.search-card.all.click'; 
            typoa[7].innerHTML = '游戏讨论专区'
            typoa[7].href = 'https://store.steampowered.com/?l=schinese&area=forums%22'; 
            typoa[8].innerHTML = '快速上分'
            typoa[8].href = 'https://hypixel.net'; 
        } catch (err) {}
    }
    if (mode == "rank") {
        document.getElementsByClassName("col--user")[0].style.width = document.getElementsByClassName("col--user")[2].style.width = '330px'; 
        document.getElementsByClassName("col--rp")[1].innerHTML = '积分'; 
        document.getElementsByClassName("col--detail rp-problem")[1].innerHTML = '练习'; 
        document.getElementsByClassName("col--ac")[1].innerHTML = '胜利'; 
    }
    if (mode == "user") {
        addTagInUserSite(); 
    }
    let ranking = document.getElementsByClassName("user-profile-badge v-center"); 
    let name_ = ["死灰", "原木", "圆石", "铜块", "红石", "铁块", "金块", "钻石", "黑曜石", "合金块", "基岩"]; 
    for (let i = 0; i < ranking.length; i++) {
        if (ranking[i].innerHTML[0] == "L") {
            let level = ranking[i].innerHTML[3] - "0"; 
            if (ranking[i].innerHTML.length > 4) level = 10; 
            ranking[i].innerHTML = name_[level]; 
        }
    }
    try {
        document.getElementsByClassName(`user-profile-badge v-center badge--su`)[1].innerHTML = `沃尔玛购物袋`; 
        document.getElementsByClassName(`user-profile-badge v-center badge--su`)[1].dataset.tooltip = `沃尔玛购物袋`; 
    } catch (err) {}
    let names = document.getElementsByClassName("user-profile-name"); 
    // 改 tag
    for (let i = 0; i < names.length; i++) {
        for (let j = 0; j < tag_users.length; j++) {
            if (new RegExp(`/${tag_users[j].uid}$`).test(names[i].href)) {
                names[i].parentElement.appendChild(getTagNode(tag_users[j])); 
            }
        }
    }
    try {
        let accepted = document.getElementsByClassName("record-status--text pass"); 
        let progress = document.getElementsByClassName("record-status--text progress"); 
        let fail = document.getElementsByClassName("record-status--text fail"); 
        let lang = document.getElementsByClassName("col--lang"); 
        document.getElementsByClassName("col--problem")[1].innerHTML = '练习赛名称'; 
        document.getElementsByClassName("col--submit-by")[1].innerHTML = '游玩者'; 
        document.getElementsByClassName("col--lang")[1].innerHTML = '服务端版本'; 
        document.getElementsByClassName("col--time")[1].innerHTML = '游玩时长'; 
        document.getElementsByClassName("col--memory")[1].innerHTML = '占用内存'; 
        document.getElementsByClassName("col--submit-at")[1].innerHTML = '游玩时间'; 
        while (1) {
            for (let i = 0; i < accepted.length; i++) accepted[i].innerHTML = '\n            <span style="color: #25ad40">冠军！！！</span>\n\n    '; 
            for (let i = 0; i < progress.length; i++) {
                if (progress[i].innerHTML.search("Fetched") != -1) progress[i].innerHTML = "\n连接到服务器"; 
                if (progress[i].innerHTML.search("Waiting") != -1) progress[i].innerHTML = "\n匹配中"; 
                if (progress[i].innerHTML.search("Compiling") != -1) progress[i].innerHTML = "\n等待开始"; 
                if (progress[i].innerHTML.search("Running") != -1) progress[i].innerHTML = "\n进行中"; 
            }
            for (let i = 0; i < fail.length; i++) {
                if (fail[i].innerHTML.search("Wrong Answer") != -1) fail[i].innerHTML = "\n失败，评分：" + fail[i].innerHTML.substr(0, fail[i].innerHTML.search("Wrong Answer")); 
                if (fail[i].innerHTML.search("Compile Error") != -1) fail[i].innerHTML = "\n文件缺失"; 
                if (fail[i].innerHTML.search("Time Exceeded") != -1) fail[i].innerHTML = "\n连接超时"; 
                if (fail[i].innerHTML.search("System Error") != -1) fail[i].innerHTML = "\n连接错误"; 
                if (fail[i].innerHTML.search("Runtime Error") != -1) fail[i].innerHTML = "\n文件错误"; 
            }
            for (let i = 3; i < lang.length; i++) {
                if (lang[i].innerHTML.search("C+") != -1) lang[i].innerHTML = lang[i].innerHTML.slice(0, lang[i].innerHTML.search("C+")) + "Steam" + lang[i].innerHTML.slice(lang[i].innerHTML.search("C+") + 3, lang[i].innerHTML.length); 
            }
            await sleep(50); 
        }
    } catch (err) {}
}) (); 

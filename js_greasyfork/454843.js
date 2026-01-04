// ==UserScript==
// @name         定制测试小工具
// @namespace    kujiale.com
// @version      1.1.8
// @description  辅助定制业务测试的插件
// @author       hudi
// @icon         data:image/png;base64,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
// @match        *://beta.kujiale.com/*
// @match        *://yun-beta.kujiale.com/*
// @match        *://beta.kujiale.cn/*
// @match        *://yun-beta.kujiale.cn/*
// @match        *://sit.kujiale.com/*
// @match        *://stable.kujiale.com/*
// @match        *://yun.kujiale.com/*
// @match        *://www.kujiale.com/*
// @match        *://*.feat.qunhequnhe.com/*
// @match        *://localhost:7000/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @grant        GM_setClipboard
// @run-at       document-end
// @connect      qunhequnhe.com
// @require      https://greasyfork.org/scripts/449512-xtiper/code/Xtiper.js?version=1081249
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/454843/%E5%AE%9A%E5%88%B6%E6%B5%8B%E8%AF%95%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/454843/%E5%AE%9A%E5%88%B6%E6%B5%8B%E8%AF%95%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 定义一些常量
const globalVars = {
    urlWithMars: "/pub/tool/custom/audit-workbench",
}

// ------------------------------------------------api 接口函数
// get请求
const getApi = (url) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "get", url,
            onload: (res) => {
                GM_log(JSON.parse(res.responseText))
                resolve(JSON.parse(res.responseText))
            },
            onerror: (err) => {
                GM_log("接口请求失败：" + err)
                reject(null)
            }
        })
    })
}

// post请求
const postApi = (url, param) => {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "post",
            url: url,
            data: param,
            headers: { "Content-Type": "application/json; charset=utf-8" },
            onload: (res) => {
                GM_log(JSON.parse(res.responseText))
                resolve(JSON.parse(res.responseText))
            },
            onerror: (err) => {
                GM_log("接口请求失败：" + err)
                reject(null)
            }
        })
    })
}
const API = {
    /**
     * 通过邮箱查询账号信息,基于kuta接口
     * @param {String} email 邮箱
     * @param {String} accountType 账号类型
     * @param {"dev"|"prod"} env 环境。dev or prod
     * @return {Object}
     */
    getUserInfoByEmail: async (email, accountType = 1, env = "dev") => {
        const urlInfo = {
            dev: `https://kuta-ui-dev.qunhequnhe.com/kuta/api/tool/execute?toolId=239&email=${email}&accountType=${accountType}`,
            prod: `https://kuta-ui-prod.qunhequnhe.com/kuta/api/tool/execute?toolId=73&email=${email}&accountType=${accountType}`
        }
        const res = await getApi(urlInfo[env])
        return res ? res.d.data.d : null
    },
    /**
     * 通过邮箱查询账号信息,基于kuta接口
     * @param {String} userid 邮箱
     * @param {"dev"|"prod"} env 环境。dev or prod
     * @return {Object}
     */
    getEmailByUserId: async (userid, env = "prod") => {
        const url = `https://kuta-ui-prod.qunhequnhe.com/kuta/api/tool/execute?toolId=291&userIdList=${userid}&env=${env}&dataArrayPath=$.d.data.dataArray`
        const res = await getApi(url)
        return res ? res.d.data.dataArray : null
    },
    /**
     * obs转换接口
     * @param {String} str 需要转换的字符串
     */
    obsCrypt: async (str) => {
        const res = await getApi(`http://decoplatform-ui-prodtest.k8s-qunhe.qunhequnhe.com/api/crypt/obs?id=${str}`)
        return res ? res.msg : null
    },
    /**
     * 接口获取定制debug命令
     * @return {Promise<{debugKey:String, debugValue:String}>}
     */
    getDebugCommand: async () => {
        const res = await getApi("https://kuta-ui-prod.qunhequnhe.com/kuta/api/tool/execute?toolId=311")
        return res ? res.d.data : null
    },
    /**
     * 同步到方案库
     * @param {Object} 方案信息
     * @return {Object}
     */
    postDesignInfo: async (design) => {
        const res = await postApi("http://diylab-service-prod.k8s-xiasha.qunhequnhe.com/api/design/add", design)
        return res ? res.data : null
    }
}

// -------------------------------------------------公共函数
/**
 * 获取当前方案类型
 * designType: 0 1 2 分别代表设计方案、审核方案、生产方案
 * @returns {{ designType: 0|1|2|null, designVersion: "bim"|"yundesign"|null, isInMars: Boolean }}
 */
const getDesignInfo = () => {
    // designType: 0-设计方案，1-审核方案，2-生产方案, null-非方案环境
    // designVersion: bim | yundesign | null
    let designInfo = { designType: null, designVersion: null, isInMars: false }
    // 解析url
    const url = new URL(unsafeWindow.location.href);
    const searchParams = new URLSearchParams(url.search)
    if (searchParams.get("designtype") && searchParams.get("obsorderdesignid")) {
        // 审核 或 生产方案
        designInfo.designType = Number(searchParams.get("designtype"))
        designInfo.isInMars = url.pathname.indexOf(globalVars.urlWithMars) > -1 ? true : false

        // TODO：mars环境暂时无法判断，designVersion为null
        if (url.pathname.indexOf("/tool/h5/bim") > -1) {
            designInfo.designVersion = "bim"
        }
        if (url.pathname.indexOf("/tool/h5/diy") > -1) {
            designInfo.designVersion = "yundesign"
        }
    } else if (searchParams.get("designid") && url.pathname.indexOf("/cloud/tool/h5") > -1) {
        // 设计方案
        designInfo.designType = 0
        designInfo.designVersion = url.pathname.indexOf("/tool/h5/bim") > -1 ? "bim" : "yundesign"
    }
    return designInfo;
}

/**
 * 获取当前酷家乐主站环境。
 * @return {"sit"|"beta"|"prod"|"dev"|null}
 */
const getKujialeEnv = () => {
    const hostname = unsafeWindow.location.hostname
    const patterns = [
        { pattern: "localhost", env: "dev" },
        { pattern: "qunhequnhe.com", env: "dev" },
        { pattern: "sit.kujiale.com", env: "sit" },
        { pattern: "stable.kujiale.com", env: "sit" },
        { pattern: "beta.kujiale", env: "beta" },
        { pattern: "yun-beta.kujiale", env: "beta" },
        { pattern: "yun.kujiale.com", env: "prod" },
        { pattern: "www.kujiale.com", env: "prod" },
    ]
    for (let p of patterns) {
        if (hostname.includes(p.pattern)) { return p.env }
    }
    return null
}

/**
 * 打开一个新的tab页
 * @param {String} url 需要打开的url
 */
const openNewTab = (url) => {
    let link = url.trim().startsWith("http") ? url : `${unsafeWindow.location.protocol}//${unsafeWindow.location.host}${url}`
    GM_openInTab(link, { active: true })
}

/** 展示弹窗。利用三方库Xtiper实现。
 * 参考：https://ovsexia.github.io/xtiper/
 * @param {String} title 弹窗标题
 * @param {String} content 弹窗内容
 * @param {Object} options xtip.win 方法的配置参数
 */
const showPopView = (title, content, options = {}) => {
    xtip.win({
        type: 'alert',
        tip: content,
        title,
        icon: 'success',
        width: '400px',
        shade: true,
        ...options
    });
}

/**
 * 获取一些初始化的数据，用于判断是否挂载菜单
 */
const getEnvs = () => {
    const kujialeEnv = getKujialeEnv()
    const designInfo = getDesignInfo()
    return {
        designInfo: getDesignInfo(),
        isDev: kujialeEnv !== "prod" && kujialeEnv !== "beta",
        isProd: kujialeEnv === "prod",
        isHttps: unsafeWindow.location.protocol === 'https:',
        isInDesign: designInfo.designType !== null,
        isInMars: designInfo.isInMars,
    }
}

// -------------------------------------------------------事件函数：即每个工具的能力
/**
 * 事件函数：获取定制插件资源信息
 */
const $getCustomKafPluginVersion = () => {
    const scYundesign = document.querySelector("script[pn='kujiale-tool-yundesign-custom-kaf-plugin']");
    const scBim = document.querySelector("script[pn='kujiale-bim-tool-page-micro-custom-kaf-plugin']");
    const packages = unsafeWindow.pubCmnPackages
    const secondPackages = {
        "custom-model": packages["@qunhe/custom-model"]?.version,
        "custom-model-core": packages["@qunhe/custom-model-core"]?.version,
        "custom-appkit": packages["@qunhe/custom-appkit"]?.version,
    }
    GM_log(packages)
    if (!scYundesign && !scBim) {
        alert("获取插件信息失败")
    } else {
        const sc = scYundesign ? scYundesign : scBim
        const ps = sc.getAttribute("ps");
        const pv = sc.getAttribute("pv");
        const res = `
        custom-kaf 版本：${pv}<br>
        custom-kaf 资源：${ps}<br><br>
        custom-appkit：${secondPackages["custom-appkit"]}<br>
        custom-model：${secondPackages["custom-model"]}<br>
        custom-model-core：${secondPackages["custom-model-core"]}`
        showPopView("插件版本", res)
    }
}

/**
 * 事件函数：审核方案中切换URL到mars环境
 */
const $changeAuditDesignUrl = () => {
    const designInfo = getDesignInfo()
    let pathname;
    if (designInfo.designType !== 0) {
        pathname = designInfo.isInMars ? "/tool/h5/diy" : globalVars.urlWithMars;
    } else {
        alert("非定制审核方案，无需切换");
        return
    }
    let newPath = pathname + location.search;
    location.assign(newPath);
}

/**
 * 事件函数：跳转到查hunterid页面。会通过剪切板获取hunterid自动填充
 */
const $gotoHunter = () => {
    const url = `https://tetris.qunhequnhe.com/d/1024`
    if (!navigator.clipboard) {
        // http协议不支持访问剪切板，直接跳转
        GM_openInTab(url, { active: true })
        return
    }
    // https协议访问剪切板，自动带上hunterid
    navigator.clipboard.readText().then(content => {
        // 根据长度判断是否为hunterid
        if (content.trim().length === 32) {
            GM_openInTab(`${url}?c.tid=${content}&header=3&t.interval=off`, { active: true })
        } else {
            GM_openInTab(url, { active: true })
        }
    }).catch(reason => {
        if (confirm("提示：允许访问剪切板，可以自动粘贴 hunterid")) {
            GM_openInTab(url, { active: true })
        }
    })
}

/**
 * 事件函数：获取当前登录账号信息、方案信息
 */
const $getUserInfo = async () => {
    try {
        const obsUserId = unsafeWindow.g_flashCfg?.appConfig?.userConfig?.userId
        const obsRootAccountId = unsafeWindow.__TOOL_CONFIG__ && unsafeWindow.__TOOL_CONFIG__.obsRootAccountId
        const userId = await API.obsCrypt(obsUserId)
        const rootAccountId = await API.obsCrypt(obsRootAccountId)
        const designId = unsafeWindow.g_designId
        const levelId = unsafeWindow.g_levelId
        const planId = unsafeWindow.g_planId
        GM_log("当前用户&方案信息：", { obsUserId, userId, obsRootAccountId, rootAccountId, designInfo: { designId, planId, levelId } })
        alert("输出成功，请在控制台查看")
    } catch (e) {
        alert("获取用户信息异常")
    }
}

/**
* 事件函数：同步到方案库
*/
const $postDesignInfo = async () => {
    if (confirm("确定同步当前方案到 方案库?")) {
        try {
            const designId = unsafeWindow.g_designId
            let env = getKujialeEnv()
            if (env == "dev") {
                env = "sit"
            }
            if (env == "prod") {
                env = "beta"
            }
            const design = new Object()
            design.designId = designId
            design.name = "小工具同步"
            design.gettype = 2
            design.source = "外部接入"
            design.env = env
            GM_log("同步方案信息：", design)
            const result = await API.postDesignInfo(JSON.stringify(design))
            alert(JSON.stringify(result.content))
        } catch (e) {
            GM_log("同步方案失败：", e.message)
            alert("同步方案失败")
        }
    }
}
/**
 * 事件函数：内网伪登录
 */
const $loginByUserId = async () => {
    const url = location.origin + "/uic/trust/login?userId="
    const useridOrEmail = prompt("请输入需要伪登录的 邮箱或userid", "");
    if (!useridOrEmail) { return }
    let userid = useridOrEmail
    if (useridOrEmail.includes("@")) {
        const res = await API.getUserInfoByEmail(useridOrEmail)
        userid = res.userId ? String(res.userId) : null
    }
    if (userid && userid.length > 1 && !isNaN(Number(userid, 10))) {
        GM_openInTab(url + userid, { active: true })
    } else {
        alert("userid 或 邮箱不正确")
    }
}

/**
 * 事件函数：定制调试工具开启、关闭
 * @param {Boolean} status 期望开启 or 关闭
 */
const $switchCustomDebugTool = async (status = true) => {
    const { debugKey, debugValue } = await API.getDebugCommand()
    const value = unsafeWindow.localStorage.getItem(debugKey)
    if (status && value !== debugValue) {
        unsafeWindow.localStorage.setItem(debugKey, debugValue);
    } else if (!status && value) {
        unsafeWindow.localStorage.removeItem(debugKey)
    }
    if (confirm("设置成功，是否刷新页面生效？")) {
        unsafeWindow.location.reload()
    }
}

/**
 * 事件函数：获取已选择模型信息，并跳转商品详情页
 */
const $gotoBrandGoodDetail = async () => {
    GM_setClipboard("[]")
    document.body.dispatchEvent(new KeyboardEvent('keydown', { keyCode: 48 }));
    try {
        const content = await navigator.clipboard.readText()
        const info = JSON.parse(content)
        let currentAccountId = unsafeWindow.__TOOL_CONFIG__ && unsafeWindow.__TOOL_CONFIG__.obsRootAccountId
        currentAccountId = await API.obsCrypt(currentAccountId)
        if (info.length > 0 && info[0].brandGoodId) {
            if (info[0].accountId + "" === currentAccountId + "") {
                const obsBgId = await API.obsCrypt(info[0].brandGoodId)
                openNewTab(`/pub/saas/workbench/brandgoods/detail?obsbrandgoodsid=${obsBgId}`)
            } else {
                alert("非当前企业模型！")
            }
        } else {
            alert("获取模型商品信息失败！请确认在定制环境，并已选中定制模型。(非实例组合)")
        }
    } catch (e) {
        console.log(e)
        alert("请允许访问剪切板")
    }
}

/**
 * 事件函数：obs转换工具
 */
const $getObsData = async () => {
    let st = prompt("输入需要转换的内容", "");
    if (!st) { return }
    st = st.trim()
    const result = await API.obsCrypt(st)
    if (result) {
        GM_setClipboard(result)
        showPopView('OBS转换', `转换前：${st}<br>转换后：${result} (已复制)`)
    } else {
        showPopView('OBS转换', `obs 转换失败`, { icon: 'e' })
    }
}

/**
 * 事件函数：邮箱查userid、rootaccountid
 * @param {1|0} accountType 账号类型。1为商家，0为个人
 * @param {"dev"|"prod"} env 查询的环境
 */
const $getAccountInfoByEmail = async (accountType = 1, env = "dev") => {
    let mail = prompt("输入邮箱", "");
    if (!mail || !mail.includes("@")) {
        alert("输入不合法")
        return
    }
    const res = await API.getUserInfoByEmail(mail.trim(), accountType, env)
    let content
    if (!res) {
        content = "查询失败！"
    } else {
        const { userId, email, businessAccount: { rootAccountId } } = res
        content = `email：${email}<br>userId：${userId}<br>rootAccountId：${rootAccountId}`
    }
    showPopView(`邮箱查询账号-${env === "dev" ? "内网" : "外网"}`, content)
}

/**
 * 事件函数：userid 查邮箱
 * @param {"dev"|"prod"} env 查询的环境
 */
const $getEmailsByUserid = async (env = "dev") => {
    let id = prompt("输入userid", "");
    if (!id) {
        return
    }
    const res = await API.getEmailByUserId(id.trim(), env)
    let content = ""
    if (!res || !(res instanceof Array) || res.length == 0) {
        content = "查询失败！"
    } else {
        res.forEach(r => content += `email：${r.Email}<br>userId：${r.userid}<br>`)
    }
    showPopView(`userid 查邮箱-${env === "dev" ? "内网" : "外网"}`, content)
}

// ----------------------------------------------------UI挂载函数
/** 挂载主入口 */
const addContainerDiv = () => {
    const styles = [
        `.custom-test-tool {
            position: fixed;
            top: 0;
            right: 200px;
            z-index: 1000;
            width: 180px;
            display: flex;
            flex-direction: row;
        }`,
        //拖拽区域
        `.custom-test-tool-drag {
            width: 15px;
            height: 23px;
            cursor: move;
            background-color:#0f5e78;
        }`,
        ` .custom-test-tool-nav ul {
            margin: 0;
            padding: 0;
            height: 23px;
            list-style: none;
            display: flex;
            flex-direction: row;
        }`,
        /* 一级菜单条目 */
        `  .custom-test-tool-nav>ul>li {
            background-color: #00809d;
            float: left;
            height: 23px;
            width: 55px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1);
            opacity: 95%;
        }`,
        /* 一级菜单文本 */
        `   .custom-test-tool-nav>ul>li>a {
            display: block;
            text-align: center;
            line-height: 23px;
            color: #f9f9f9;
            text-decoration: none;
            font-size: 10px;
            transform: scale(1);
        }`,
        /* 二三级菜单条目 */
        `  .custom-test-tool-nav>ul>li>ul li {
            background-color: #f9f9f9;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
            float: left;
            height: 23px;
            min-width: 120px;
        }`,
        /* 二三级菜单文本 */
        `  .custom-test-tool-nav>ul>li>ul>li a {
            display: block;
            text-align: left;
            line-height: 23px;
            text-decoration: none;
            margin-left: 15px;
            font-size: 10px;
            color: #464547;
        }`,
        /*将二三级菜单隐藏*/
        `.custom-test-tool-nav>ul>li ul {
            display: none;
            background-color: #f9f9f9;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        }`,
        /*hover一级菜单，显示二级菜单*/
        ` .custom-test-tool-nav ul li:hover>ul {
            display: block;
        }`,
        /*hover二级菜单，显示三级菜单*/
        `  .custom-test-tool-nav ul li ul li:hover ul {
            display: block;
            margin-left: 120px;
            margin-top: -23px;
        }`,
        `.custom-test-tool-nav>ul>li>ul>li a:hover {
            color: #2585a6;
        }`
    ]
    // 创建工具入口
    const containerDiv = document.createElement("div");
    containerDiv.className = "custom-test-tool"
    containerDiv.innerHTML = `
        <div class="custom-test-tool-drag"></div>
        <div class='custom-test-tool-nav'>
            <ul>
                <li id="custom-test-tool-button">
                    <a href="#">🚀小工具</a>
                </li>
                <li id="custom-test-links-button">
                    <a href="#">📌主站</a>
                </li>
                <li id="custom-test-links-button2">
                    <a href="#">🔗链接</a>
                </li>
            </ul>
        </div>
    `
    // 应用样式
    styles.forEach(
        style => GM_addStyle(style)
    );
    // 将工具入口挂载到目标页面
    document.body.appendChild(containerDiv);
    // 设置可拖拽
    const dragButton = document.querySelector(".custom-test-tool-drag")
    dragButton.onmousedown = function (ev) {
        const event = unsafeWindow.event || ev;
        // 获取屏幕中可视化的宽高的坐标
        const dx = event.clientX - containerDiv.offsetLeft;
        const dy = event.clientY - containerDiv.offsetTop;
        //实时改变目标元素div的位置
        document.onmousemove = function (ev) {
            const event = unsafeWindow.event || ev;
            const maxMoveW = document.body.offsetWidth - dragButton.offsetWidth; // 最大可拖拽水平距离
            const maxmoveH = document.body.offsetHeight - dragButton.offsetHeight; // 最大可拖拽垂直距离
            let currentX = event.clientX - dx;
            let currentY = event.clientY - dy;
            if (currentX > maxMoveW) { currentX = maxMoveW }
            if (currentX < 0) { currentX = 0 }
            if (currentY > maxmoveH) { currentY = maxmoveH }
            if (currentY < 0) { currentY = 0 }
            containerDiv.style.left = currentX + 'px';
            containerDiv.style.top = currentY + 'px';
        }
    }
    //抬起停止拖动
    dragButton.onmouseup = function () {
        document.onmousemove = null;
    }
}

/**
 * 挂载子菜单，并绑定事件。可挂载二级、三级菜单。
 * @param {object} options 挂载的菜单信息。name-菜单名称，id-菜单的id，event-监听的事件，listenter-事件响应，fatherId-需要挂载在哪个节点下，showMenu-显示的条件
 */
const addSubMenu = (options) => {
    const { name, id, event, listener, fatherId, showMenu } = options
    if (!showMenu) { return }
    // 创建节点
    const li = document.createElement("li")
    li.setAttribute("id", id)
    li.innerHTML = `<a href="#" >${name}</a>`
    if (event) {
        li.addEventListener(event, listener)
    }
    //找到目标节点的ur元素
    const fatherElement = document.querySelector(`#${fatherId}`)
    const childNodes = fatherElement.getElementsByTagName("UL")
    const ul = childNodes.length > 0 ? childNodes[0] : null
    if (ul) {
        ul.appendChild(li)
    } else {
        const newul = document.createElement("ul")
        newul.appendChild(li)
        fatherElement.appendChild(newul)
    }
}

/**
 * 挂载链接菜单
 * @param {object[]} links 需要挂载的链接信息。
 * @param {string} fatherId 表示需要在哪个节点下挂载。
 */
const addLinks = (links, fatherId) => {
    links.forEach(item => {
        const listener = () => { openNewTab(item.url) }
        // 支持传入链接，也支持完整的tools入参格式
        const menu = item.listener ? item : { name: item.name, id: item.id, event: "click", listener, fatherId: item.fatherId ? item.fatherId : fatherId, showMenu: true }
        addSubMenu(menu)
    })
}

// -----------------------------------------------------常量，定义默认的工具、链接
/**小工具 */
const getDefaultToolsList = () => {
    const { designInfo, isDev, isProd, isHttps, isInDesign, isInMars } = getEnvs()
    return [
        { name: "obs 转换", id: "obs", event: "click", listener: $getObsData, fatherId: "custom-test-tool-button", showMenu: true },

        // 三级菜单：账号数据查询
        { name: "> 数据查询", id: "apitool", event: null, listener: null, fatherId: "custom-test-tool-button", showMenu: true },
        { name: "(内网)邮箱查账号", id: "email2useriddev", event: "click", listener: () => { $getAccountInfoByEmail(1, "dev") }, fatherId: "apitool", showMenu: true },
        { name: "(内网)userid查邮箱", id: "userid2emaildev", event: "click", listener: () => { $getEmailsByUserid("dev") }, fatherId: "apitool", showMenu: true },
        { name: "(外网)邮箱查账号", id: "email2useridprod", event: "click", listener: () => { $getAccountInfoByEmail(1, "prod") }, fatherId: "apitool", showMenu: true },
        // 中频工具
        { name: "查看定制版本", id: "getVersion", event: "click", listener: $getCustomKafPluginVersion, fatherId: "custom-test-tool-button", showMenu: isInDesign && !isInMars },
        { name: "跳转模型详情", id: "gotoBrandGoodDetail", event: "click", listener: $gotoBrandGoodDetail, fatherId: "custom-test-tool-button", showMenu: isHttps && isInDesign && !isProd && !isInMars },
        { name: "内网伪登录", id: "loginBuApi", event: "click", listener: $loginByUserId, fatherId: "custom-test-tool-button", showMenu: isDev },
        // 三级菜单：定制debug工具开关。
        { name: "> 定制Debug工具", id: "customdebug", event: null, listener: null, fatherId: "custom-test-tool-button", showMenu: isInDesign && !isInMars },
        { name: "开启", id: "opencustomdebug", event: "click", listener: () => { $switchCustomDebugTool(true) }, fatherId: "customdebug", showMenu: isInDesign && !isInMars },
        { name: "关闭", id: "closecustomdebug", event: "click", listener: () => { $switchCustomDebugTool(false) }, fatherId: "customdebug", showMenu: isInDesign && !isInMars },
        // 三级菜单：pybell插件开关
        { name: "> pyBell 插件", id: "hadesInjection", event: null, listener: null, fatherId: "custom-test-tool-button", showMenu: isInDesign && !isInMars && !isProd },
        { name: "开启", id: "openInjection", event: "click", listener: () => { unsafeWindow.pyBellInjection.startTool() }, fatherId: "hadesInjection", showMenu: isInDesign && !isInMars && !isProd },
        { name: "关闭", id: "closeInjection", event: "click", listener: () => { unsafeWindow.pyBellInjection.stopTool() }, fatherId: "hadesInjection", showMenu: isInDesign && !isInMars && !isProd },

        // 三级菜单：低频工具
        { name: "> 其它工具", id: "otherTools", event: null, listener: null, fatherId: "custom-test-tool-button", showMenu: isInDesign },
        { name: "Mars 环境切换", id: "gotoMars", event: "click", listener: $changeAuditDesignUrl, fatherId: "otherTools", showMenu: designInfo.designType === 1 || designInfo.designType === 2 },
        { name: "同步到方案库", id: "syncDesign", event: "click", listener: $postDesignInfo, fatherId: "otherTools", showMenu: isInDesign },
        {
            name: "⛔请升级油猴脚本", id: "update", event: "click", listener: () => {
                if (confirm("当前油猴插件为旧版本，不再维护。请升级到新版本, 功能更丰富")) {
                    openNewTab("https://cf.qunhequnhe.com/pages/viewpage.action?pageId=80494666505#id-%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC%E9%85%B7%E5%AE%B6%E4%B9%90%E5%B7%A5%E5%85%B7%E6%B5%8B%E8%AF%95%E6%8F%92%E4%BB%B6-4.1%E5%AE%89%E8%A3%85")
                }
            }, fatherId: "custom-test-tool-button", showMenu: true
        }
    ]
}

/**主站路径 */
const getDefaultKujialeLinks = () => {
    return [
        { name: "方案列表", id: "designPage", url: "/pub/saas/workbench/design/all" },
        { name: "定制高级设置", id: "customAdvanceSetting", url: "/pub/saas/workbench/brandgoods/customized/advanced-config?toolType=wardrobe" },
        { name: "设置中心", id: "SettingCenter", url: "/pub/saas/workbench/setting/yundesigntool-advanced?app_id=3FO4K4VYBAIK&advanced=true" },
        { name: "版本设置页", id: "intraenv", url: "/pub/__fe/page/intraenv" }
    ]
}

/**链接 */
const getDefaultCustomLinks = () => {
    return [
        { name: "解密工具", id: "changchuan", url: "http://qhview.k8s-new.qunhequnhe.com/" },
        { name: "pub 部署(custom)", id: "pub-custom-kaf", url: "https://pub.qunhequnhe.com/app#/fc_3785/config" },
        { name: "pub 分桶(custom)", id: "pub-abtest-custom", url: "https://pub.qunhequnhe.com/newbucket#/bn_115" },
        { name: "kuta 收藏页", id: "kuta", url: "https://kuta-ui-prod.qunhequnhe.com/#/kuta/product/favorite" },
        { name: "快速查 hunter", id: "gotoHunter", event: "click", listener: $gotoHunter, fatherId: "custom-test-links-button2", showMenu: true },
        { name: "调试台", id: "colorful", url: "https://colorful-dev.qunhequnhe.com/debug#/debug/ap" },
        { name: "方案库", id: "coolLibrary", url: "https://cool-library.qunhequnhe.com/design/designs" },
        // 三级菜单
        { name: "> 定制平台", id: "links-custom", event: null, listener: null, fatherId: "custom-test-links-button2", showMenu: true },
        { name: "Customized-kms", id: "c-kms", url: "http://customized-kms-alpha.qunhequnhe.com/", fatherId: "links-custom" },
        { name: "CustomPlatform", id: "c-testplantform", url: "https://customplatform-ui-dev.qunhequnhe.com/", fatherId: "links-custom" },
    ]
}

// ----------------------------------------------------挂载工具
const main = () => {

    // 挂载的工具菜单
    const toolsMenus = [
        ...getDefaultToolsList()
    ]

    // 主站菜单链接。id唯一即可。如果要增加链接，按如下格式增加即可（支持绝对路径、相对路径）。
    const kjlLinks = [
        ...getDefaultKujialeLinks(),
        // { name: "订单后台", id: "auditOrder", url: "/pub/saas/workbench/cms-order/audit-orders" }
    ]

    // 自定义菜单链接。id唯一即可。如果要增加链接，按如下格式增加即可。
    const customLinks = [
        ...getDefaultCustomLinks(),
        { name: "关于", id: "aboutDoc", url: "https://cf.qunhequnhe.com/pages/viewpage.action?pageId=80494666505" }
    ]

    // 挂载菜单--工具
    toolsMenus.forEach(menu => addSubMenu(menu))
    // 挂载菜单--主站链接。
    addLinks(kjlLinks, "custom-test-links-button")
    // 挂载菜单--自定义链接。
    addLinks(customLinks, "custom-test-links-button2")
}

(function () {
    'use strict';
    addContainerDiv() // 挂载入口
    main() // 挂载菜单
})();
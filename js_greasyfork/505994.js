// ==UserScript==
// @name         Theresmore 助手
// @namespace    http://tampermonkey.net/
// @version      20240907
// @license MIT
// @description  Theresmore 助手, 包含 加速, 自动升级建筑, 一键研究, 一键施法, 批量探索, 一键攻击 等功能
// @author       liooil
// @match        https://www.theresmoregame.com/play/
// @match        https://theresmoregame.g8hh.com/
// @match        https://theresmoregame.g8hh.com.cn/
// @icon         https://www.theresmoregame.com/play/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/505994/Theresmore%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/505994/Theresmore%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const customSpeed = 60; //自定义倍速，可自行修改，默认10倍速，修改后刷新游戏生效（不可动态修改 否则会出错）
const 军队加速 = true;
const 进攻失败不损失部队 = true;
const 一键祈祷 = true;
const 将军数量跟随建筑数量 = true;
const 扫描间隔 = 1000 * 2;

performance.realNow = performance.now;
performance.now = () => {
    return performance.realNow() * customSpeed
}
/** 建筑自动升级采用白名单 */
let updateStore = getUpdateStore();
let oldList = [];
/** 研究/人口手动升级采用黑名单 */
let blackList = getBlackList();
let 自动升级建筑 = true;
let 自动升级所有标签页面 = false;
let 自动结盟 = false;
let 咒语已全部激活 = false;
let 搜索次数 = 0;

function getUpdateStore() {
    const value = localStorage.getItem("updateStore");
    if (value) {
        return new Set(JSON.parse(value));
    }
    return new Set([
        "钢铁厂",
        "秘密会议",
        "宗教部",
        "修道院",
        "有人值守仓库",
        "大型库房",
        "远古保险库",
        "储物间",
        "圣谷",
        "炼金实验室",
        "建筑工区域",
        "亡者兽群",
        "巨型工作区",
        "锯木厂",
        "铸造厂",
        "天文台",
        "大学",
        "登攀者世界图书馆",
        "智慧大厅",
        "学校",
        "诸神的机器",
        "马厩",
        "难民区组件",
        "证券交易所组件",
        "钢铁宫殿组件",
        "联盟大使馆",
        "内政部",
        "粮仓",
        "伐木工营地",
        "好运之森",
        "魔法环",
        "战争部",
        "魔法塔",
        "献祭圣坛",
        "神之荣耀",
        "寺庙",
        "物质转化器",
        "工匠作坊",
        "市场",
        "卡纳瓦贸易站",
        "农场",
        "住宅区",
        "法力深井组件",
        "市政厅",
        "宅邸",
        "矿井",
        "工匠公会",
        "木匠工坊",
        "采石场",
        "石匠坊",
        "封地",
        "食品杂货店",
        "钠红石精炼厂",
        "金库",
        "城墙组件",
        "工业厂房",
        "光之城组件",
        "海湾区组件",
        "银行",
        "信用社",
        "研究工厂",
        "壁垒组件",
        "磐石巨墙组件",
        "大型仓库",
        "钠红石仓库",
        "存储设施",
        "精神花园",
        "伊甸园",
        "普通房屋",
        "军官训练场",
        "攻城机器厂",
        "雷区",
        "军事学院",
        "钠红石气球",
        "弩炮",
        "新兵训练中心",
        "兵营",
        "炮兵靶场",
        "守望者前哨",
        "超级大炮组件",
        "钠红石护盾",
        "亡者大厅",
        "撒尔喀特帝国 ",
        "鳞岩部落 ",
        "恩索诸众 ",
        "岛屿前哨",
        "定居点大厅",
        "棚屋",
        "建筑工联合体",
        "工匠联合体",
        "朝觐者营地",
        "炼金联合体",
        "旧神教堂",
        "发展部",
        "火车站",
        "物流中心",
        "法力提取器",
        "大型棚屋",
        "战壕",
        "工厂",
        "自动化联合体组件",
        "精灵营地",
        "书籍",
        "灵魂",
        "法力反应堆",
        "应许之地组件",
        "英雄事迹大厅组件",
        "税收检查站",
        "精灵村庄",
        "法力之塔组件",
        "丰饶之谷",
        "栅栏组件",
        "市中心组件",
        "超大集市组件",
        "大教堂组件",
        "自由思想家学院组件",
        "繁荣之泉",
        "精炼厂",
        "码头",
        "海关",
        "庄园",
        "美德雕像组件",
        "佣兵前哨",
        "凯旋门组件",
        "法力场",
        "魔法工坊",
        "魔法马厩",
        "门之解密"
    ]);
}
function saveUpdateStore(updateStore) {
    localStorage.setItem("updateStore", JSON.stringify([...updateStore]));
}
function getBlackList() {
    const value = localStorage.getItem("blackList");
    if (value) {
        return new Set(JSON.parse(value));
    }
    return new Set();
}
function saveBlackList(list) {
    localStorage.setItem("blackList", JSON.stringify([...list]));
}

let timer = setInterval(() => { //setInterval摆烂
    if (document.querySelector("#main-tabs")) {
        clearInterval(timer)
        const MainStore = Object.values(document.querySelector("#main-tabs"))[1].children._owner.stateNode.props.MainStore
        window.MainStore = MainStore//暴露存储变量
        console.log(MainStore);
        customFunction(MainStore)
    }
}, 100)

const handlers = [];

setInterval(() => {
    const tabListNode = document
        .querySelector('#main-tabs')
        .querySelector(`div[role=tablist]`);
    for (let page = 0; page < tabListNode.childNodes.length; page++) {
        const tabNode = tabListNode.childNodes[page];
        const handler = handlers[page];
        if (tabNode && tabNode.getAttribute('aria-selected') === 'true') {
            const id = tabNode.getAttribute('aria-controls')
            const containerNode = document.getElementById(id)
            handler?.(tabNode, containerNode);
        }
    }

    // 保存
    registerSave();

    // 将军/指挥官数量跟随军事学院数量
    const commnder = MainStore.ArmyStore.visibleArmy.find((e) => e.id === "commander");
    const general = MainStore.ArmyStore.visibleArmy.find((e) => e.id === "general");
    const military_academy = MainStore.run.buildings.find((v) => v.id === "military_academy");
    if (commnder && general && military_academy) {
        general.cap = military_academy.value;
        commnder.cap = military_academy.value;
    }
    // 战略家数量跟随魔法塔数量
    const strategist = MainStore.ArmyStore.visibleArmy.find((e) => e.id === "strategist");
    const magical_tower = MainStore.run.buildings.find((v) => v.id === "magical_tower");
    if (strategist && magical_tower) {
        strategist.cap = magical_tower.value;
    }
    // 法力堡垒数量跟随魔法工坊

}, 扫描间隔);


// 建筑
handlers[0] = async (tabNode, containerNode) => {
    if (containerNode.firstChild.id !== "auto-upgrade") {
        const btn = document.createElement('button');
        btn.id = "auto-upgrade";
        btn.classList.add("btn", "w-full", "mb-2");
        btn.textContent = "A";
        if (自动升级建筑) {
            btn.classList.add("btn-green");
        } else {
            btn.classList.add("btn-gray");
        }
        btn.onclick = () => {
            自动升级建筑 = !自动升级建筑;
            if (自动升级建筑) {
                btn.classList.remove("btn-gray");
                btn.classList.add("btn-green");
            } else {
                btn.classList.remove("btn-green");
                btn.classList.add("btn-gray");
            }
        }
        containerNode.prepend(btn);
    }
    const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
    if (subTabNodes) {
        if (subTabNodes.lastChild.textContent !== "A") {
            const btn = document.createElement('button');
            btn.classList.add("btn", "mb-2");
            btn.id = "auto-upgrade-all";
            btn.textContent = "A";
            if (自动升级所有标签页面) {
                btn.classList.add("btn-green");
            } else {
                btn.classList.add("btn-gray");
            }
            btn.onclick = () => {
                自动升级所有标签页面 = !自动升级所有标签页面;
                if (自动升级所有标签页面) {
                    btn.classList.remove("btn-gray");
                    btn.classList.add("btn-green");
                } else {
                    btn.classList.remove("btn-green");
                    btn.classList.add("btn-gray");
                }
            }
            subTabNodes.appendChild(btn);
        }
    }

    const list = containerNode.querySelectorAll(`button.btn`)
    let newList = [];
    for (const node of list) {
        if (node.id === "auto-upgrade" || node.id === "auto-upgrade-all") continue;
        const name = node.firstChild.textContent;
        newList.push(node);
        if (!oldList.includes(node)) {
            const button = document.createElement('button');
            button.classList.add("absolute", "-bottom-0", "right-0", "inline-block", "py-px", "px-2", "rounded-full", "font-bold", "text-xs");
            button.textContent = "A";
            if (updateStore.has(name)) {
                button.classList.add("text-green-600");
            } else {
                button.classList.add("text-gray-600");
            }
            button.onclick = (ev) => {
                ev.stopPropagation();
                if (updateStore.has(name)) {
                    updateStore.delete(name);
                    button.classList.remove("text-green-600");
                    button.classList.add("text-gray-600");
                } else {
                    updateStore.add(name);
                    button.classList.remove("text-gray-600");
                    button.classList.add("text-green-600");
                }
                saveUpdateStore(updateStore);
            }
            node.appendChild(button);
        }
    }
    oldList = newList;

    if (自动升级建筑) {
        if (自动升级所有标签页面) {
            let currentSubTab = subTabNodes.querySelector(`button[aria-selected=true]`) // 当前选中的子tab页
            for (let i = 0; i < subTabNodes.childElementCount; ++i) {
                const subTabNode = subTabNodes.childNodes[i];
                if (subTabNode === currentSubTab || subTabNode.id === "auto-upgrade-all") continue;
                subTabNode.click();
                await sleep(100);
                for (const node of containerNode.querySelectorAll(`button.btn`)) {
                    if (node.id === "auto-upgrade" || node.id === "auto-upgrade-all") continue;
                    const name = node.firstChild.textContent;
                    if (updateStore.has(name) && !node.classList.value.includes('btn-off')) {
                        node.click();
                    }
                }
            }
            currentSubTab.click();
            await sleep(100);
        }
        for (const node of containerNode.querySelectorAll(`button.btn`)) {
            if (node.id === "auto-upgrade" || node.id === "auto-upgrade-all") continue;
            const name = node.firstChild.textContent;
            if (updateStore.has(name) && !node.classList.value.includes('btn-off')) {
                node.click();
            }
        }
    }
};

// 研究
handlers[1] = (tabNode, containerNode) => {
    const id = "research-all";

    const list = containerNode.querySelectorAll(`button.btn`)
    for (const node of list) {
        if (node.id === id) continue;
        const name = node.firstChild.textContent;
        if (!node.querySelector("button.btn")) {
            const button = document.createElement('button');
            button.classList.add("-bottom-0", "right-0", "inline-block", "py-px", "px-2", "rounded-full", "font-bold", "text-xs");
            button.textContent = "A";
            if (blackList.has(name)) {
                button.classList.add("text-gray-600");
            } else {
                button.classList.add("text-green-600");
            }
            button.onclick = (ev) => {
                ev.stopPropagation();
                if (blackList.has(name)) {
                    blackList.delete(name);
                    button.classList.remove("text-gray-600");
                    button.classList.add("text-green-600");
                } else {
                    blackList.add(name);
                    button.classList.remove("text-green-600");
                    button.classList.add("text-gray-600");
                }
                saveBlackList(blackList);
            }
            node.appendChild(button);
        }
    }

    if (containerNode.firstChild.textContent === "ALL") return;
    const btn = document.createElement('button');
    btn.id = id;
    btn.classList.add("btn", "btn-green", "w-full", "mb-2");
    btn.textContent = "ALL";
    btn.onclick = () => {
        for (const node of containerNode.querySelectorAll(`button.btn`)) {
            if (node.id === id) continue;
            const name = node.firstChild.textContent;
            if (blackList.has(name)) continue;
            if (!node.classList.value.includes('btn-off')) {
                node.click();
            }
        }
    }
    containerNode.prepend(btn);
};

// 人口
handlers[2] = (tabNode, containerNode) => {
    if (containerNode.firstChild.id !== "auto-employ") {
        const btn = document.createElement('button');
        btn.id = "auto-employ";
        btn.classList.add("btn", "btn-green", "w-full", "mb-2");
        btn.textContent = "ALL";
        btn.onclick = () => {
            for (const jobTitle of containerNode.querySelectorAll(`h5`)) {
                const job = jobTitle.textContent;
                if (!blackList.has(job)) {
                    jobTitle.parentNode.parentNode.querySelector(`button.btn.btn-green.shadow-none`)?.click();
                }
            }
        }
        containerNode.prepend(btn);
    }
    for (const jobTitle of containerNode.querySelectorAll(`h5`)) {
        const job = jobTitle.textContent;
        let btn;
        if (jobTitle.parentNode.firstChild.tagName === "BUTTON") {
            btn = jobTitle.parentNode.firstChild;
        } else {
            btn = document.createElement('button');
            btn.textContent = "A";
            if (blackList.has(job)) {
                btn.classList.add("text-gray-600");
            } else {
                btn.classList.add("text-green-600");
            }
            btn.onclick = () => {
                if (blackList.has(job)) {
                    blackList.delete(job);
                    btn.classList.remove("text-gray-600");
                    btn.classList.add("text-green-600");
                } else {
                    blackList.add(job);
                    btn.classList.remove("text-green-600");
                    btn.classList.add("text-gray-600");
                }
            }
            jobTitle.parentNode.prepend(btn);
        }
    }
}

// 魔法
handlers[3] = (tabNode, containerNode) => {
    const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
    const currentSubTab = subTabNodes.querySelector(`button[aria-selected=true]`) // 当前选中的子tab页
    if (currentSubTab.textContent.includes("咒语")) {
        咒语已全部激活 = [...containerNode.querySelectorAll(`button.btn`)].every(node => node.id === "auto-pray" || node.textContent === "取消咒语");
        if (containerNode.firstChild.id === "auto-pray") {
            containerNode.firstChild.remove();
        }
        const btn = document.createElement('button');
        btn.id = "auto-pray";
        btn.classList.add("btn", "btn-green", "w-full", "mb-2");
        btn.textContent = 咒语已全部激活 ? "全部取消" : "全部释放";
        btn.onclick = () => {
            const list = containerNode.querySelectorAll(`button.btn`)
            for (const node of list) {
                if (node.id === "auto-pray" || node.classList.value.includes('btn-off')) continue;
                if (!咒语已全部激活 && node.textContent === "取消咒语") continue;
                node.click()
            }
            咒语已全部激活 = !咒语已全部激活;
            btn.textContent = 咒语已全部激活 ? "全部取消" : "全部释放";
        }
        containerNode.prepend(btn);
    } else if (currentSubTab.textContent.includes("祈祷")) {
        if (containerNode.firstChild.id === "auto-pray") {
            containerNode.firstChild.remove();
        }
        if (containerNode.querySelector(`button.btn`)) {
            const btn = document.createElement('button');
            btn.id = "auto-pray";
            btn.classList.add("btn", "btn-green", "w-full", "mb-2");
            btn.textContent = "全部祈祷";
            btn.onclick = () => {
                const list = containerNode.querySelectorAll(`button.btn`)
                for (const node of list) {
                    if (node.id === "auto-pray" || node.classList.value.includes('btn-off')) continue;
                    node.click()
                }
            }
            containerNode.prepend(btn);
        }
    }
}

// 军队
handlers[4] = async (tabNode, containerNode) => {
    const subTabNodes = containerNode.querySelector(`div[role=tablist]`)
    const currentSubTab = subTabNodes.querySelector(`button[aria-selected=true]`) // 当前选中的子tab页
    if (currentSubTab.firstChild.textContent === "探索") {
        const exploreBtn = containerNode.querySelector(`button.btn.btn-blue`);
        if (exploreBtn) {
            if (exploreBtn.lastChild.id !== "auto-explore") {
                const btn = document.createElement('button');
                btn.id = "auto-explore";
                btn.textContent = "X10";
                btn.classList.add("absolute", "-bottom-0", "right-0", "inline-block", "py-px", "px-2", "rounded-full", "font-bold", "text-xs");
                btn.onclick = (ev) => {
                    ev.stopPropagation();
                    搜索次数 += 10;
                }
                exploreBtn.appendChild(btn);
            }
            if (搜索次数 > 0) {
                exploreBtn.click();
                搜索次数--;
            }
        }
    } else if (currentSubTab.firstChild.textContent === "攻击") {
        const chooseBtn = containerNode.querySelector(`button.btn.btn-dark`);
        if (chooseBtn && chooseBtn.firstChild.textContent !== "没有敌人可供攻击") {
            if (chooseBtn.lastChild.id !== "auto-attack") {
                const btn = document.createElement('button');
                btn.id = "auto-attack";
                btn.textContent = "ALL";
                btn.classList.add("absolute", "-bottom-0", "right-0", "inline-block", "py-px", "px-2", "rounded-full", "font-bold", "text-xs");
                btn.onclick = async (ev) => {
                    ev.stopPropagation();
                    chooseBtn.click();
                    await sleep(100);
                    const dialogNode = document.querySelector("#headlessui-portal-root");
                    const enemies = [];
                    let firstEnemy;
                    for (const node of dialogNode.querySelectorAll(`h5`)) {
                        const enemy = node.textContent;
                        if (!firstEnemy) {
                            firstEnemy = node;
                        } else {
                            enemies.push(enemy);
                        }
                    }
                    if (firstEnemy) {
                        firstEnemy.click();
                        await sleep(100);
                        const attackBtn = containerNode.querySelector(`button.btn.btn-red`);
                        attackBtn.click();
                        await sleep(2000);
                    } else {
                        dialogNode.querySelector('.sr-only').parentNode.click();
                        await sleep(100);
                    }
                    await sleep(100);
                    for (const enemy of enemies) {
                        await attack(containerNode, enemy);
                        await sleep(2000);
                    }
                }
                chooseBtn.appendChild(btn);
            }

            if (MainStore.ArmyStore._fight("oracle")) {
                chooseBtn.classList.remove("dark:border-red-700");
                chooseBtn.classList.add("dark:border-green-700");
            } else {
                chooseBtn.classList.remove("dark:border-green-700");
                chooseBtn.classList.add("dark:border-red-700");
            }
        }
    }
}

async function attack(containerNode, name) {
    const chooseBtn = containerNode.querySelector(`button.btn.btn-dark`);
    chooseBtn.click();
    await sleep(100);
    const dialogNode = document.querySelector("#headlessui-portal-root");
    for (const node of dialogNode.querySelectorAll(`h5`)) {
        if (node.textContent === name) {
            node.click();
            break;
        }
    }
    await sleep(100);
    const attackBtn = containerNode.querySelector(`button.btn.btn-red`);
    attackBtn.click();
}

// 外交
handlers[5] = (tabNode, containerNode) => {
    if (containerNode.firstChild.id !== "auto-improve") {
        const btn = document.createElement('button');
        btn.id = "auto-improve";
        btn.classList.add("btn", "w-full", "mb-2");
        btn.textContent = "A";
        if (自动结盟) {
            btn.classList.add("btn-green");
        } else {
            btn.classList.add("btn-gray");
        }
        btn.onclick = () => {
            自动结盟 = !自动结盟;
            if (自动结盟) {
                btn.classList.remove("btn-gray");
                btn.classList.add("btn-green");
            } else {
                btn.classList.remove("btn-green");
                btn.classList.add("btn-gray");
            }
        }
        containerNode.prepend(btn);
    }

    const list = containerNode.querySelectorAll(`button.btn`)
    if (自动结盟) {
        for (const node of list) {
            if (node.id === "auto-improve") continue;
            if (node.classList.value.includes('btn-off')) continue;
            if (node.textContent.includes("派出代表团") || node.textContent.includes("改善关系") || node.textContent.includes("联盟")) {
                node.click()
            }
        }
    }
}

// 保存
function registerSave() {
    const dialogNode = document.querySelector("#headlessui-portal-root");
    if (dialogNode?.querySelector('h3')?.textContent !== "设置") return;
    if (dialogNode.querySelector(`#save_url`)) return;
    const importBtn = dialogNode.querySelector(`button.btn.btn-green`);
    if (!importBtn) return;
    const urlIpt = document.createElement("input");
    urlIpt.id = "save_url";
    urlIpt.type = "url";
    importBtn.parentNode.appendChild(urlIpt);
    const uploadBtn = document.createElement("button");
    uploadBtn.onclick = async () => {
        const saveString = MainStore.SettingsStore._getSaveString();
        await fetch(urlIpt.value, { method: "PUT", body: saveString });
    }
    importBtn.parentNode.appendChild(uploadBtn);
    const downloadBtn = document.createElement("button");
    downloadBtn.onclick = async () => {
        const res = await fetch(urlIpt.value);
        const saveString = await res.text();
        MainStore.SettingsStore.loadFromText(saveString);
    }
    importBtn.parentNode.appendChild(downloadBtn);
}

function customFunction(MainStore) { //额外功能
    if (军队加速) {
        MainStore.ArmyStore.waitTime /= customSpeed
    }
    if (进攻失败不损失部队) {
        MainStore.ArmyStore.realDestroyArmy = MainStore.ArmyStore.destroyArmy
        MainStore.ArmyStore.destroyArmy = function (...args) {
            if (!(args[2] == 'army' && args[3] != !0)) {
                return this.realDestroyArmy(...args)
            }
        }
    }
}

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

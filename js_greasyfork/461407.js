// ==UserScript==
// @name         Jenkins
// @namespace    http://tampermonkey.net/
// @version      20240311.2
// @description  Jenkins 日常操作 Docker-building 参数自动装填
// @author       Selier
// @match        http://192.168.1.45:8080/*
// @match        http://192.168.1.45:8080/*job/Docker-building/build*
// @match        http://192.168.1.45:8080/*job/*-docker-*/build*
// @icon         https://www.jenkins.io/images/logos/jenkins/Jenkins-stop-the-war.svg

// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_registerMenuCommand
// @license       GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/461407/Jenkins.user.js
// @updateURL https://update.greasyfork.org/scripts/461407/Jenkins.meta.js
// ==/UserScript==
const dev_env = 'dev';
const test_env = 'test';
const pre_env = 'pre';
const prod_env = 'prod';

// 默认环境
let default_env = test_env;
// 设置默认项目
let index = 0;
// 分支前缀
let branch_prefix = "";
// 是否允许手动输入
let is_input = false;

// 获取到默认环境
const gmGetValue = GM_getValue("default_env");
if (gmGetValue) {
    console.log("获取到默认环境: " + gmGetValue)
    default_env = gmGetValue
}

const product_list = [
    "springx-",
    "toc-manager-",
    "springx-",
    "lmb-massage-",
    "tduck-platform-",
    "toc-lite-"
]

const git_name_list = [
    "lemobar-toc",
    "lemobar-toc-admin",
    "wx-api",
    "lemobar-tuina-toc",
    "tduck-pro-platform",
    "lemobar-lite"
]

// 获取到默认项目
const gmGetName = GM_getValue("default_name");
if (gmGetName) {
    console.log("获取到默认项目: " + git_name_list[gmGetName])
    index = gmGetName
}


const project_name_list = {
    0: [
        "lemobar-toc-main",
        "lemobar-business",
        "lemobar-orders",
        "lemobar-tag",
        "lemobar-market",
        "lemobar-mq-rabbit",
        "lemobar-xxljob",
        "lemobar-xxljob-admin",
        "lemobar-gateway",
        "lemobar-swagger",
        "lemobar-admin"
    ],
    1: [
        "lemobar-admin"
    ],
    2: [
        "wx-api"
    ],
    3: [
        "lemobar-tuina-main",
        "lemobar-tuina-gateway"
    ],
    4: [
        "tduck-api"
    ],
    5: [
        "lemobar-lite"
    ]
}
const branch_url_list = [
    "gitlab@192.168.1.40:lemobar/lemobar-toc.git",
    "gitlab@192.168.1.40:lemobar/lemobar-toc-admin.git",
    "gitlab@192.168.1.40:ToC/wechat/wx-api.git",
    "gitlab@192.168.1.40:lemobar-tuina/lemobar-tuina-toc.git",
    "gitlab@192.168.1.40:tduck/tduck-pro-platform.git",
    "gitlab@192.168.1.40:lemobar/lemobar-lite.git"
]

let product_prefix = product_list[index];
let product = '';
let gitName = git_name_list[index];
let projectName = project_name_list[index][0];
let branchUrl = branch_url_list[index];
let version = '';
let env = '';
let workDir = '';


const productSelector = "#main-panel > form > table > tbody:nth-child(1) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
const gitNameSelector = "#main-panel > form > table > tbody:nth-child(2) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
const projectNameSelector = "#main-panel > form > table > tbody:nth-child(3) > tr:nth-child(1) > td.setting-main > div > textarea";
const branchUrlSelector = "#main-panel > form > table > tbody:nth-child(4) > tr:nth-child(1) > td.setting-main > div > textarea";
const versionSelector = "#main-panel > form > table > tbody:nth-child(3) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
const dockerVersionSelector = "#main-panel > form > table > tbody:nth-child(5) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
const envSelector = "#main-panel > form > table > tbody:nth-child(7) > tr:nth-child(1) > td.setting-main > div > select";
const envInputSelector = "#main-panel > form > table > tbody:nth-child(6) > tr:nth-child(1) > td.setting-main > div > input.setting-input";
const workDirSelector = "#main-panel > form > table > tbody:nth-child(8) > tr:nth-child(1) > td.setting-main > div > input.setting-input";

(function () {
    let cur = window.location.href;
    if (cur.indexOf("Docker-building") > -1) {
        initMenu();
        initGitName();
        initProjectName();
        initColor();
        changeEnv(default_env);

        const envEle = document.querySelector(envSelector);
        // 添加监听事件
        envEle.addEventListener("change", changeEnv);
    } else if (cur.indexOf("-docker-") > -1) {
        let project = "";
        const regex = /\/job\/([^\/]*)/;
        const match = cur.match(regex);
        if (match && match.length > 1) {
            project = match[1].toLowerCase()
            console.log("匹配到项目:" + project);
        } else {
            console.log("未匹配到字符串:" + cur);
        }
        const strings = project.split("-docker-");
        // for (let projectNameListKey in project_name_list) {
        //   const list = project_name_list[projectNameListKey]
        //   debugger
        //   for (let project_name in list) {
        //     if (list[project_name] === strings[1]) {
        //       product_prefix = product_list[projectNameListKey]
        //       break;
        //     }
        //   }
        // }

        // document.querySelector(productSelector).value = product_prefix + strings[0];
        document.querySelector(versionSelector).value = branch_prefix + strings[0];
    } else {
        // initUrl();

    }

})();

async function initUrl() {
    // 获取所有带有 class 为 "model-link" 的元素
    const elements = document.querySelectorAll(".model-link");

// 迭代所有匹配的元素，并将其 href 属性更改为 "aaa"
    elements.forEach((el) => {
        el.setAttribute("href", el.getAttribute("href") + "/build?delay=0sec");
    });
    console.log("初始化链接完成", elements.length)
}

function changeEnv(obj) {
    // 获取 select 元素当前选项的值
    var envEle = document.querySelector(envSelector).value;
    if (obj === 'prod') {
        obj = 'live'
    }

    if (obj !== undefined && typeof obj === "string" && obj !== '') {
        document.querySelector(envSelector).value = obj;
        envEle = obj;
    }
    // 输出选项内容
    console.log(`当前选项内容是：${envEle}`)
    if (envEle === 'live') {
        envEle = prod_env;
    }
    eval("product = product_prefix + envEle")
    eval("version = branch_prefix + envEle")
    eval("env = branch_prefix + envEle")

    document.querySelector(productSelector).value = product;
    document.querySelector(gitNameSelector).value = gitName;
    // document.querySelector("#main-panel > form > table > tbody:nth-child(3) > tr:nth-child(1) > td.setting-main > div > textarea").value = projectName;
    document.querySelector(branchUrlSelector).value = branchUrl;
    document.querySelector(dockerVersionSelector).value = version;
    document.querySelector(envInputSelector).value = env;
}

function initGitName() {
    // 获取 textarea 元素
    const gitNameEle = document.querySelector(gitNameSelector);
    // 创建 select 元素
    const gitNameSelect = createGitNameElement();
    // 将 select 元素添加到 textarea 父元素中
    gitNameEle.parentNode.insertBefore(gitNameSelect, gitNameEle.gitNameSelect);
    // 隐藏原本的 textarea 元素
    gitNameEle.style.width = '34%'
    is_input ? true : gitNameEle.style.display = "none";
    gitNameEle.value = git_name_list[index]
    // 添加监听事件，当 select 元素的选项改变时，修改 textarea 内容
    gitNameSelect.addEventListener("change", function () {
        gitNameEle.value = gitNameSelect.value;
        changeGitName(gitNameEle.value);
    });
    changeGitName(gitNameEle.value)
}

function changeGitName(name) {
    for (let i = 0; i < git_name_list.length; i++) {
        if (git_name_list[i] === name) {
            index = i;
            workDir = ''
            if (index === 0 || index === 3) {
                workDir = 'lemobar-module'
            }
            break;
        }
    }

    gitName = name
    branchUrl = branch_url_list[index]
    product_prefix = product_list[index]
    projectName = project_name_list[index][0]
    const gitNameEle = document.querySelector(gitNameSelector);
    gitNameEle.value = gitName
    gitNameEle.parentNode.querySelector("select").value = gitName
    document.querySelector(productSelector).value = product_prefix + GM_getValue("default_env")
    document.querySelector(branchUrlSelector).value = branchUrl
    document.querySelector(workDirSelector).value = workDir
    initProjectName();

}

function initProjectName() {
    // 获取 textarea 元素
    const projectNameEle = document.querySelector(projectNameSelector);
    // 创建选项元素
    const projectNameSelect = createProjectNameElement(projectNameEle);
    // 将 select 元素添加到 textarea 父元素中
    // 获取要删除的 select 元素节点
    const selectNode = projectNameEle.parentNode.querySelector('select');
    // 如果找到了 select 元素节点，则将其从父节点中删除
    if (selectNode) {
        projectNameEle.parentNode.removeChild(selectNode);
    }
    projectNameEle.parentNode.insertBefore(projectNameSelect, projectNameEle);
    // 隐藏原本的 textarea 元素
    is_input ? true : projectNameEle.style.display = "none";
    projectNameEle.style.width = '34%'
    projectNameEle.value = projectName
    projectName = project_name_list[index][0]

    // 添加监听事件，当 select 元素的选项改变时，修改 textarea 内容
    projectNameSelect.addEventListener("change", function () {
        const workDirEle = document.querySelector(workDirSelector);
        const gitNameEle = document.querySelector(gitNameSelector);
        if (gitNameEle.value === git_name_list[0] || gitNameEle.value === git_name_list[3]) {
            if (projectNameSelect.value === 'lemobar-xxljob' || projectNameSelect.value === 'lemobar-xxljob-admin' || projectNameSelect.value === 'lemobar-gateway' || projectNameSelect.value === 'lemobar-tuina-gateway') {
                workDir = '';
            } else if (projectNameSelect.value === 'lemobar-mq-rabbit') {
                workDir = 'lemobar-plugin';
            } else if (projectNameSelect.value === 'lemobar-swagger' || projectNameSelect.value === 'lemobar-admin') {
                workDir = 'lemobar-ops';
            } else {
                workDir = 'lemobar-module';
            }
        } else if (gitNameEle.value === git_name_list[1]) {
            workDir = ''
        } else {
            workDir = ''
        }
        workDirEle.value = workDir;
        projectNameEle.value = projectNameSelect.value;

    });
}

function createGitNameElement() {
    const selectElement = document.createElement("select");
    for (let git_name of git_name_list) {
        const ele = document.createElement("option");
        ele.text = git_name;
        selectElement.add(ele);
    }
    selectElement.style.height = '34px'
    return selectElement;
}

function createProjectNameElement() {
    // 创建 select 元素
    const projectNameSelect = document.createElement("select");

    for (let project_name of project_name_list[index]) {
        const ele = document.createElement("option");
        ele.text = project_name;
        projectNameSelect.add(ele);
    }
    projectNameSelect.style.height = '34px'
    return projectNameSelect;
}

function initColor() {
    let gitName = document.querySelector("#main-panel > form > table > tbody:nth-child(2) > tr:nth-child(1) > td.setting-name");
    fillColor(gitName)
    // 获取指定元素
    let projectName = document.querySelector("#main-panel > form > table > tbody:nth-child(3) > tr:nth-child(1) > td.setting-name");
    fillColor(projectName);
    let env = document.querySelector("#main-panel > form > table > tbody:nth-child(7) > tr:nth-child(1) > td.setting-name");
    fillColor(env);
}

function fillColor(ele) {
    // 修改 CSS 样式
    ele.style.fontWeight = "bold";
    ele.style.color = "red";
    ele.style.backgroundColor = "yellow";
}

function initMenu() {
    setEnvMenu(test_env)
    setEnvMenu(pre_env)
    setEnvMenu(prod_env)

    for (let i = 0; i < git_name_list.length; i++) {
        setGitNameMenu(i, git_name_list[i])
    }
}

function setEnvMenu(env) {
    GM_registerMenuCommand("设置默认环境:" + env, function () {
        GM_setValue("default_env", env)
        changeEnv(env)
    })
}

function setGitNameMenu(i, n) {
    // debugger
    GM_registerMenuCommand("设置默认项目:" + n, function () {
        GM_setValue("default_name", i)
        changeGitName(n)
    })
}

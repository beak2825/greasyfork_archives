// ==UserScript==
// @name         MyNextPlus
// @namespace    http://zhaoxuyang.com/
// @version      0.4
// @description  收钱吧 Next 平台操作增强插件
// @author       SeayonZ
// @match        http*://next-vpn.wosai-inc.com/*
// @icon         https://next-vpn.wosai-inc.com/favicon.png
// @grant        GM_log
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.3/jquery.min.js
// @run-at document-end
// @license      Apache License
// @downloadURL https://update.greasyfork.org/scripts/461209/MyNextPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/461209/MyNextPlus.meta.js
// ==/UserScript==

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements(
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes = $(selectorTxt);
    else
        targetNodes = $(iframeSelector).contents()
            .find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
        btargetsFound = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each(function () {
            var jThis = $(this);
            var alreadyFound = jThis.data('alreadyFound') || false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound = actionFunction(jThis);
                if (cancelFound)
                    btargetsFound = false;
                else
                    jThis.data('alreadyFound', true);
            }
        });
    } else {
        btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval(timeControl);
        delete controlObj [controlKey]
    } else {
        //--- Set a timer, if needed.
        if (!timeControl) {
            timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt,
                        actionFunction,
                        bWaitOnce,
                        iframeSelector
                    );
                },
                150
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj = controlObj;
}

const stageMap = new Map();
stageMap.set("开发", "development");
stageMap.set("测试", "testing");
stageMap.set("预上线", "staging");
stageMap.set("生产", "production");
let ORIGINAL = "https://next-vpn.wosai-inc.com";
// 当前阶段信息
let currentPhaseInfo = {}
// 当前所在项目信息
let currentProjectInfo = {}
// 当前部署的服务 map,以服务名称为 key
const deploymentMap = new Map();

const colorRed = '#ff4d4f'
const colorGreen = '#52c41a'
const colorBlue = '#1890ff'

function getXEnvFlag(str) {
    const regex = /(release|feature)-(smart)-(\d+)/g;
    const matches = regex.exec(str);
    if (matches) {
        const [, type, group, id] = matches;
        let s = `${type}/${group.toUpperCase()}-${id}`;
        console.log("选择到的特性" + s)
        return s;
    }
    return null;
}

/**
 * 从
 * release/storeGroup
 * release/storeupdate
 * revert-8ec8c79d
 * 3.21.0
 * 3.20.0
 * 3.19.0
 * 这些分支中提取出来 符合 tag 标准 x.y.z 的
 */

function getTagFlag(str) {
    const regex = /(\d+\.\d+\.\d+)/g;
    const matches = regex.exec(str);
    if (matches) {
        const [, type] = matches;
        let s = `${type}`;
        console.log("选择到的tag" + s)
        return s;
    }
    return null;
}

const globalMessage = `<div class="ant-notification ant-notification-topRight" style="right: 0px; top: 24px; bottom: auto;"><span>
        <div
            class="ant-notification-notice ant-notification-notice-closable ant-notification-fade-leave">
            <div class="ant-notification-notice-content">
                <div class="ant-notification-notice-with-icon"><i aria-label="icon: check-circle-o"
                        class="anticon anticon-check-circle-o ant-notification-notice-icon ant-notification-notice-icon-success"><svg
                            viewBox="64 64 896 896" focusable="false" class="" data-icon="check-circle" width="1em"
                            height="1em" fill="currentColor" aria-hidden="true">
                            <path
                                d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z">
                            </path>
                            <path
                                d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z">
                            </path>
                        </svg></i>
                    <div class="ant-notification-notice-message">success</div>
                    <div class="ant-notification-notice-description">升级成功！</div>
                    <div class="ant-list ant-list-sm">
                    <ul class="ant-list-items">
                        <li class="ant-list-item tag"></li>
                        <li class="ant-list-item created"></li>
                    </ul>
                    </div>
                </div>
            </div><a tabindex="0" class="ant-notification-notice-close"><span class="ant-notification-close-x"><i
                        aria-label="icon: close" class="anticon anticon-close ant-notification-close-icon"><svg
                            viewBox="64 64 896 896" focusable="false" class="" data-icon="close" width="1em"
                            height="1em" fill="currentColor" aria-hidden="true">
                            <path
                                d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z">
                            </path>
                        </svg></i></span></a>
        </div>
    </span></div>`


const clickBtnHtml = `
<span class="ant-badge css-dev-only-do-not-override-ph9edi">
        <span class="one-click-deployment one-click-deployment-key" style="cursor: pointer;">
            <svg t="1679123870696" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6099" width="30" height="24"><path d="M0 0h1024v1024H0z" fill="currentColor" opacity=".01" p-id="6100"></path><path d="M506.1632 109.226667c-10.3424 8.362667-26.180267 21.128533-73.3184 64.955733C375.808 227.157333 341.333333 301.602133 341.333333 381.952v281.3952c0 34.9184 15.837867 71.338667 35.6352 103.5264 9.454933 15.36 27.170133 39.697067 44.714667 62.2592 8.669867 11.127467 17.032533 21.504 23.893333 29.696a384.477867 384.477867 0 0 0 11.8784 13.380267l0.955734 0.955733 0.341333 0.341333c8.3968 7.509333 14.711467 11.298133 19.114667 12.970667V785.066667a34.133333 34.133333 0 1 1 68.266666 0v101.341866c4.369067-1.6384 10.6496-5.4272 19.2512-13.073066l1.160534-1.160534 2.935466-3.140266c2.389333-2.628267 5.3248-6.0416 8.738134-10.1376 6.826667-8.192 15.086933-18.5344 23.722666-29.696a1011.029333 1011.029333 0 0 0 45.397334-62.907734c20.138667-31.3344 35.328-67.7888 35.328-102.980266V381.952c0-80.2816-34.7136-154.760533-91.5456-207.7696-46.933333-43.793067-62.737067-56.490667-73.147734-64.853333L512 104.516267l-5.8368 4.778666z m104.584533 815.138133c-13.585067 12.049067-36.078933 29.3888-64.6144 31.232V955.733333a34.133333 34.133333 0 1 1-68.266666 0v-0.170666c-28.535467-1.809067-51.0976-19.080533-64.7168-31.300267-9.4208-8.430933-28.16-31.163733-45.329067-53.248-17.3056-22.2208-36.283733-48.0256-47.9232-66.628267l-147.2512 33.723734A85.333333 85.333333 0 0 1 68.266667 754.926933V631.466667a221.866667 221.866667 0 0 1 204.8-221.218134v-28.330666c0-100.215467 43.1104-192.477867 113.322666-257.706667 49.5616-46.114133 68.096-61.064533 77.892267-68.949333 2.7648-2.218667 4.846933-3.8912 6.690133-5.5296 23.6544-20.821333 58.368-20.821333 82.056534 0 1.809067 1.604267 3.857067 3.242667 6.587733 5.461333 9.8304 7.850667 28.5696 22.869333 78.062933 69.051733C707.584 189.44 750.933333 281.668267 750.933333 381.917867v28.330666a221.866667 221.866667 0 0 1 204.8 221.218134v123.460266a85.333333 85.333333 0 0 1-104.379733 83.182934l-147.285333-33.757867c-11.810133 18.261333-30.72 44.066133-48.128 66.594133-8.977067 11.605333-17.749333 22.664533-25.326934 31.709867-6.9632 8.328533-14.336 16.759467-19.8656 21.7088zM750.933333 478.8224v184.490667c0 27.579733-5.973333 54.0672-14.984533 78.336l130.628267 29.934933a17.066667 17.066667 0 0 0 20.8896-16.657067V631.466667a153.6 153.6 0 0 0-136.533334-152.6784zM288.3584 741.512533C279.313067 717.482667 273.066667 690.9952 273.066667 663.3472v-184.490667A153.6 153.6 0 0 0 136.533333 631.466667v123.460266a17.066667 17.066667 0 0 0 20.8896 16.657067l130.935467-30.037333zM273.066667 853.333333a34.133333 34.133333 0 0 1 34.133333 34.133334v68.266666a34.133333 34.133333 0 1 1-68.266667 0v-68.266666a34.133333 34.133333 0 0 1 34.133334-34.133334z m477.866666 0a34.133333 34.133333 0 0 1 34.133334 34.133334v68.266666a34.133333 34.133333 0 1 1-68.266667 0v-68.266666a34.133333 34.133333 0 0 1 34.133333-34.133334z m-273.066666-477.866666a34.133333 34.133333 0 1 1 68.266666 0 34.133333 34.133333 0 0 1-68.266666 0z m34.133333-102.4a102.4 102.4 0 1 0 0 204.8 102.4 102.4 0 0 0 0-204.8z" fill="currentColor" p-id="6101"></path></svg>升级最新
            </span>
        <sup data-show="true" class="ant-scroll-number ant-badge-count ant-badge-count-sm ant-badge-multiple-words version-difference"
            title="new" style="margin-top: -4px; right: 0px; background: rgb(244,244,244);">...</sup>
    </span>
<div class="ant-divider ant-divider-vertical one-click-deployment" role="separator"></div>`;
const style = document.createElement('style');
style.innerHTML = `
  .one-click-deployment:hover {
    color: #1a90ff;
  }
  
  .one-click-deployment svg {
    vertical-align: -5px;
  }
  
  .css-dev-only-do-not-override-ph9edi .ant-badge-count{
    height:16px;
    line-height:18px;
  }
  .css-dev-only-do-not-override-ph9edi .ant-badge-multiple-words{
     padding:0 6px;
  }
  .version-difference{
    display: none;  
  }
`;
document.head.appendChild(style);


// set globalMessage invisible
const globalMessageElement = $(globalMessage);
// add close to .ant-notification-notice-close
globalMessageElement.find('.ant-notification-notice-close').click(function () {
    globalMessageElement.css('display', 'none');
})
globalMessageElement.css('display', 'none');
$('body').append(globalMessageElement);
// show global message visible and with message
function showGlobalMessage(message,tag,created) {
    globalMessageElement.find('div.ant-notification-notice-description').text(message);
    globalMessageElement.find('.ant-list-sm li.tag').text("镜像："+tag);
    globalMessageElement.find('.ant-list-sm li.created').text("创建时间："+created);

    globalMessageElement.css('display', 'block');
    setTimeout(() => {
        globalMessageElement.css('display', 'none');
    }, 3000);
}
/**
 * 查找指定条件的分支
 *
 * @param {boolean} flag - 一个布尔值，表示查找规则
 * @param {string} branchQuery - 当 flag 为 false 时，要查找的分支名称
 * @param {object} data - 包含分支数据的对象
 * @return {string} 返回符合条件的分支，如果没有找到则返回 undefined
 */
function findBranch(data, branchQuery, flag) {
    if (!flag) {
        let maxVersion = data.find((item) => item === branchQuery) || null;
        return {maxVersion, branchVersionDifference: 0};
    } else {
        // 使用正则表达式匹配 x.y.z 版本号
        const versionRegex = /^(\d+)\.(\d+)\.(\d+)$/;

        // 获取所有符合 x.y.z 版本号规则的项
        const validVersions = data.filter((item) => versionRegex.test(item));

        // 对有效版本进行排序
        validVersions.sort((a, b) => {
            const [majorA, minorA, patchA] = a.match(versionRegex).slice(1).map(Number);
            const [majorB, minorB, patchB] = b.match(versionRegex).slice(1).map(Number);

            if (majorA !== majorB) return majorB - majorA;
            if (minorA !== minorB) return minorB - minorA;
            return patchB - patchA;
        });

        // 获取最大版本号
        const maxVersion = validVersions[0];

        // 获取 bracnQueryflag 的版本
        const branchQueryVersion = branchQuery.match(versionRegex);

        if (branchQueryVersion) {
            const [majorA, minorA, patchA] = branchQueryVersion.slice(1).map(Number);
            let branchVersionDifference = 0;

            for (const version of validVersions) {
                const [majorB, minorB, patchB] = version.match(versionRegex).slice(1).map(Number);

                if (majorA > majorB || (majorA === majorB && minorA > minorB) || (majorA === majorB && minorA === minorB && patchA >= patchB)) {
                    break;
                }
                branchVersionDifference++;
            }

            return {maxVersion, branchVersionDifference};
        } else {
            return {maxVersion, branchVersionDifference: null};
        }
    }
}


/**
 * 给页面添加按钮
 */
function addMyButton() {
    $(".ant-list-item:contains('编辑')").each(async function () {
        console.debug("添加按钮")
        $(this).find("div.ant-list-item-extra a:first").before(clickBtnHtml);
        let sup = $(this).find("sup.version-difference");
        let imageDesc = $(this).find(".ant-list-item-meta-description>span").contents().filter(function () {
            return this.nodeType === 3;
        }).text();
        if (!imageDesc) {
            return;
        }
        let imageDescSplit = imageDesc.split("/");
        if (imageDescSplit.length < 3) {
            return;
        }
        let split = imageDescSplit[2].split(":");
        let currentApplicationName = split[0];
        let currentImageTag = split[1].trim();
        let isTagStage = false; // tag 阶段不是 feature 或者 release 阶段
        let runStatusButton = $(this).find("a:contains('运行状态')")[0];
        let currentBranchQueryFlag = getXEnvFlag(imageDesc)
        if (currentBranchQueryFlag === undefined || currentBranchQueryFlag === null) {
            currentBranchQueryFlag = getTagFlag(imageDesc);
            isTagStage = true
        }
        console.debug("当前项目部署信息")
        let currentDeployment = deploymentMap.get(currentApplicationName);
        console.debug(currentDeployment)

        // 获取最新的镜像的函数
        async function fetchNewestImage(sup,currentImageTag,isTagStage,branchQueryFlag) {
            console.debug("fetchNewestImage() 获取最新的镜像")
            return new Promise(async (resolve, reject) => {
                $.ajax({
                    url: ORIGINAL + "/api/v2/git/branches/" + currentApplicationName,
                    type: "GET",
                    success: function (data) {
                        console.debug("查询分支列表成功")
                        console.debug(data)
                        if (data && data.code === 200) {
                            let versionDifference = 0;
                            let {maxVersion, branchVersionDifference} = findBranch(data.data, branchQueryFlag, isTagStage)
                            if (isTagStage) {
                                if (branchVersionDifference !== null && branchVersionDifference >= 0) {
                                    console.debug("当前是:" + branchQueryFlag + "，最新的tag是" + maxVersion + "，分支差距是" + branchVersionDifference)
                                    versionDifference = branchVersionDifference;
                                }
                            }
                            $.ajax({
                                url: "https://next-vpn.wosai-inc.com/api/v2/docker/tag/" + currentApplicationName + "?ref=" + maxVersion + "&phase=" + currentPhaseInfo.name,
                                type: "GET",
                                success: function (data) {
                                    console.debug("查询分支下镜像列表成功")
                                    console.debug(data)
                                    if (data && data.code === 200 && data.data && data.data.length > 0) {
                                        let newestImage = data.data[0];
                                        if (!isTagStage) {
                                            let currentImageIndex = data.data.findIndex(image => image.tag === currentImageTag);
                                            if (currentImageIndex !== -1) {
                                                versionDifference = currentImageIndex;
                                                console.debug("当前镜像是：" + currentImageTag + "，最新镜像是：" + newestImage.tag + "，镜像差距是：" + versionDifference);
                                            } else {
                                                console.debug("未在列表中找到当前镜像：" + currentImageTag);
                                            }
                                        }
                                        console.debug("查询到的最新镜像", JSON.stringify(newestImage))
                                        resolve({newestImage,versionDifference})
                                        if (versionDifference === 0) {
                                            sup.text("最新");
                                            sup.css('background', colorGreen)
                                        }
                                        if (versionDifference > 0) {
                                            sup.text("-" + versionDifference);
                                            sup.css('background', colorRed)
                                        }
                                        sup.css('display', 'inline-block')
                                    }
                                }
                            });

                        }
                    }
                })
            })
        }

        // 获取一次最新的镜像
        await fetchNewestImage(sup,currentImageTag,isTagStage,currentBranchQueryFlag);



        // 给当前对象添加 click 事件处理器
        $(this).find(".one-click-deployment-key").on("click", async function () {
            console.log("开始一键升级")
            let {newestImage,versionDifference} = await fetchNewestImage(sup,currentImageTag,isTagStage,currentBranchQueryFlag);
            console.debug("要升级的镜像", JSON.stringify(newestImage))
            $.ajax({
                url: ORIGINAL + "/api/v2/deployment/" + currentDeployment.cluster + "/" + currentDeployment.namespace + "/" + currentDeployment.application_name + "/" + currentDeployment.env_flag + "/deployment",
                type: "PUT",
                contentType: "application/json;charset=UTF-8",
                accept: "application/json",
                data: JSON.stringify({
                    "deployment_id": currentDeployment.id,
                    "image": newestImage,
                    "jira_issue": currentProjectInfo.jira_issue,
                    "phase": currentPhaseInfo.name,
                    "plane_cluster_name": currentDeployment.cluster,
                    "appName": currentDeployment.application_name,
                    "planeFlag": currentDeployment.env_flag
                }),
                success: function (data) {
                    console.debug("升级成功", JSON.stringify(data))
                    if (data && data.code === 200) {
                        console.debug("升级成功")
                        showGlobalMessage("升级成功",newestImage.tag,newestImage.created)
                        let bracnQueryflag = getXEnvFlag(newestImage.tag)
                        let isTagStage = false
                        if (bracnQueryflag === undefined || bracnQueryflag === null) {
                            bracnQueryflag = getTagFlag(newestImage.tag);
                            isTagStage = true
                        }
                        fetchNewestImage(sup,newestImage.tag,isTagStage,bracnQueryflag);
                        runStatusButton.click();
                    } else {
                        console.error("升级失败")
                        console.error(data)
                    }
                }
            })
        });
    });
}


let selectorTxtStage = "div.ant-card-hoverable:contains('开发'),div.ant-card-hoverable:contains('测试'),div.ant-card-hoverable:contains('预上线')";
waitForKeyElements(selectorTxtStage, () => {
    console.debug("检测到了'开发阶段卡片'页面出现")
    $(selectorTxtStage).each(function () {
        $(this).click(() => {
            deploymentMap.clear();
            currentPhaseInfo = {}
            currentProjectInfo = {}

            // 获得当前点击的卡片的阶段的文本
            let currentPhaseText = $(this).find("div.ant-card-head-title").text();
            let currentPhaseKey = stageMap.get(currentPhaseText);
            console.debug("当前阶段key：" + currentPhaseKey)
            // 获得当前页面的 url
            const url = new URL(window.location.href);
            // 获得 url 的 完整基本路径
            ORIGINAL = url.origin;
            console.debug(ORIGINAL)

            // 项目信息查询链接
            const PROJECT_QUERY_URL = ORIGINAL + "/api/v2/project/" + url.searchParams.get("id")
            $.ajax({
                url: PROJECT_QUERY_URL,
                type: "GET",
                success: function (data) {
                    console.debug("查询项目信息成功")
                    console.debug(data)
                    if (data && data.code === 200) {
                        currentProjectInfo = data.data
                        for (let i = 0; i < data.data.phases.length; i++) {
                            let phase = data.data.phases[i]
                            if (phase && phase.name === currentPhaseKey) {
                                currentPhaseInfo = phase
                                break
                            }
                        }
                        if (currentPhaseInfo && currentPhaseInfo.env_flag) {
                            const DEPLOYMENT_QUERY_URL = ORIGINAL + "/api/v2/deployments"
                            $.ajax({
                                url: DEPLOYMENT_QUERY_URL,
                                type: "GET",
                                data: {
                                    "app_name": "",
                                    "project": url.searchParams.get("id"),
                                    "phase": currentPhaseKey,
                                    "team_keyword": "",
                                    "env_flag": currentPhaseInfo.env_flag,
                                    "cluster": currentPhaseInfo.cluster,
                                    "page": 1,
                                    "page_size": 1000
                                },
                                success: function (data) {
                                    console.debug("查询部署信息成功")
                                    console.debug(data)
                                    if (data && data.code === 200 && data.data && data.data.records) {
                                        for (let i = 0; i < data.data.records.length; i++) {
                                            let deployment = data.data.records[i]
                                            if (deployment && deployment.application_name) {
                                                deploymentMap.set(deployment.application_name, deployment)
                                            }
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            })

            waitForKeyElements(".ant-list-item:contains('编辑'):eq(0)", addMyButton, true);
        })
    })
}, false);

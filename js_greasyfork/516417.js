// ==UserScript==
// @name         gemini_tasks_page
// @namespace    http://tampermonkey.net/
// @license      cillin
// @version      0.1
// @description  try to take over the world!
// @author       cillinzhang
// @match        https://yard.woa.com/account_quota_list*
// @icon         https://www.google.com/s2/favicons?domain=oa.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/516417/gemini_tasks_page.user.js
// @updateURL https://update.greasyfork.org/scripts/516417/gemini_tasks_page.meta.js
// ==/UserScript==

// ------------- 常量定义 -------------
const API_URLS = {
    LIST_ACCOUNT_RUNNING_TASKS: "https://wxdc.woa.com/api/dispatch/weflow/job/runtime/list_account_running_tasks/",
    GET_TASK_PODS_INFO: "https://wxdc.woa.com/api/dispatch/weflow/operation/task/get_task_pods_info/",
    GET_USER_OFFLINE_PROJECT_TOKEN: "https://wxdc.woa.com/api/dispatch/base/project/get_user_offline_project_token/",
    LIST_SUANLI_CLUSTER_RUNNING_TASKS: "https://wxdc.woa.com/api/dispatch/weflow/job/runtime/list_suanli_cluster_running_tasks/"
};

// ------------- 页面结构 -------------
function ImportCss() {
    document.body.innerHTML = ''; // 清空页面原有内容
    const style = `<style>
        /* 基础字体 */
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #333; font-size: 14px; background-color: #f4f7f6; padding: 5px; }

        /* 统计行样式优化 */
        .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px; break-inside: avoid; font-size: 16px; border-radius: 8px; margin-bottom: 2px; transition: all 0.2s; border-left: 4px solid transparent; background-color: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
        .stat-row:nth-child(odd) { background-color: #fff; }
        .stat-row:nth-child(even) { background-color: #f8f9fa; }
        .stat-user { flex: 1; font-weight: 600; color: #2c3e50; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 8px; }
        .stat-info { white-space: nowrap; color: #e65100; font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace; font-size: 14px; font-weight: bold; background: rgba(230, 81, 0, 0.1); padding: 1px 4px; border-radius: 4px; }
        .stat-header { font-weight: 700; color: #fff; border-bottom: none; margin-bottom: 4px; padding: 4px 8px; font-size: 14px; background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%); border-radius: 8px; position: sticky; top: 0; z-index: 10; column-span: all; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

        /* 隐藏滚动条但允许滚动 */
        ::-webkit-scrollbar { width: 0px; background: transparent; }
    </style>`;
    $(document.head).append(style);

    // 统计 - H20南京
    const floatBodyH20Nj = '<div id="textarea_biz2_h20" style="width: 100%; box-sizing: border-box; border-radius: 8px; margin-bottom: 10px;"></div>';

    // 统计 - H20惠州
    const floatBodyH20Hz = '<div id="textarea_biz3_h20" style="width: 100%; box-sizing: border-box; border-radius: 8px; margin-bottom: 10px;"></div>';

    $(document.body).append(floatBodyH20Nj);
    $(document.body).append(floatBodyH20Hz);
}

// ------------------ 全局缓存 ------------------
const usedRequestCache = {};
const hostIpRequestCache = {};      // 新增：本次刷新是否已请求过 HostIP
const projectTokenRequestCache = {}; // 新增：本次刷新是否已请求过 Token

const ipUrlMap = {};
const taskRuntimeIdMap = {};
const projectIdMap = {};
const hostIpCache = {};          // {appName: {ip, typePod}}
const projectTokenCache = {};    // {projectId: token}

// ----------- Promise封装 GM_xmlhttpRequest -----------
function GMRequest(opt) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: opt.method || "GET",
            url: opt.url,
            headers: opt.headers || {},
            data: opt.data || undefined,
            onload: function (res) {
                if (res.status === 200) {
                    try {
                        resolve(JSON.parse(res.responseText));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(res);
                }
            },
            onerror: function (err) {
                reject(err);
            }
        });
    });
}

// ---------------- 批量请求 account_running_tasks -----------------
function batchFetchAccountRunningTasks(jobAccount, createByList) {
    const reqs = [];
    createByList.forEach(used => {
        const cacheKey = jobAccount + "_" + used;
        if (!usedRequestCache[cacheKey]) {
            usedRequestCache[cacheKey] = true;
            reqs.push(
                GMRequest({
                    method: "POST",
                    url: API_URLS.LIST_ACCOUNT_RUNNING_TASKS,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ account: jobAccount, submitted_by: used })
                })
            );
        }
    });
    if (reqs.length === 0) return Promise.resolve();
    return Promise.all(reqs).then(results => {
        results.forEach(rObj => {
            if (rObj.data && Array.isArray(rObj.data)) {
                rObj.data.forEach(item => {
                    const appName = item.run_config.app_name;
                    if (appName) {
                        const tid = item.task_instance_id;
                        const jid = item.job_instance_id;
                        const nid = item.node_id;
                        const projectId = item.project_id;
                        if (tid && jid && nid)
                            ipUrlMap[appName] = `https://gemini.woa.com/#/dispatch/resource_usage/pod?job_instance_id=${jid}&job_type=offline&node_id=${nid}&task_ins_id=${tid}`;
                        if (tid) taskRuntimeIdMap[appName] = tid;
                        if (projectId) projectIdMap[appName] = projectId;
                    }
                });
            }
        });
    });
}

// ---------------- 批量请求 host_ip -----------------
function batchFetchHostIp(appNames) {
    const reqs = [];
    appNames.forEach(appName => {
        // 只要本次没请求过，且有 runtime_id，就请求（无论 hostIpCache 是否有值）
        if (!hostIpRequestCache[appName] && taskRuntimeIdMap[appName]) {
            hostIpRequestCache[appName] = true;
            reqs.push(
                GMRequest({
                    method: "POST",
                    url: API_URLS.GET_TASK_PODS_INFO,
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({
                        job_type: "offline",
                        task_runtime_id: taskRuntimeIdMap[appName]
                    })
                }).then(obj => {
                    let ip = "";
                    let typePod = "unknown";
                    if (obj.data && Array.isArray(obj.data.pods) && obj.data.pods.length > 0) {
                        const launcherPod = obj.data.pods.find(pod => pod.name && pod.name.endsWith('launcher'));
                        const pytorchPod = obj.data.pods.find(pod => pod.name && pod.name.endsWith('master-0'));
                        if (launcherPod && launcherPod.host_ip) {
                            ip = launcherPod.host_ip;
                            typePod = "launcher";
                        } else if (pytorchPod && pytorchPod.host_ip) {
                            ip = pytorchPod.host_ip;
                            typePod = "pytorch";
                        } else {
                            ip = obj.data.pods[0].host_ip || "";
                            typePod = "unknown";
                        }
                    }
                    hostIpCache[appName] = { ip, typePod };
                })
            );
        }
    });
    if (reqs.length === 0) return Promise.resolve();
    return Promise.all(reqs);
}

// ---------------- 批量请求 project_token -----------------
function batchFetchProjectToken(appNames) {
    // 用project_id做缓存，避免重复请求
    const projectIds = [];
    appNames.forEach(appName => {
        const projectId = projectIdMap[appName];
        if (projectId && !projectTokenRequestCache[projectId]) {
            projectTokenRequestCache[projectId] = true;
            projectIds.push(projectId);
        }
    });
    if (projectIds.length === 0) return Promise.resolve();
    const reqs = projectIds.map(projectId =>
        GMRequest({
            method: "GET",
            url: `${API_URLS.GET_USER_OFFLINE_PROJECT_TOKEN}?project_id=${projectId}`
        }).then(res => {
            const token = res && res.data && res.data.project_token ? res.data.project_token : '';
            projectTokenCache[projectId] = token;
        })
    );
    return Promise.all(reqs);
}

// ----------- 主要逻辑：优化后的 updateJobs -----------
function updateJobs(accountName, cardType, summaryTextareaId, detailDivId, clusterName, summaryTitle) {
    GMRequest({
        method: "GET",
        url: `${API_URLS.LIST_SUANLI_CLUSTER_RUNNING_TASKS}?account=${accountName}&cluster=${clusterName}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" }
    }).then(response => {
        if (!(response.data && response.data.account_quota_info && response.data.account_quota_info[accountName])) return;

        const tasks = response.data.account_quota_info[accountName].tasks;
        const quotaInfo = response.data.account_quota_info[accountName].quota_info;
        const usedAndQuota = `(${quotaInfo.used}/${quotaInfo.request})剩${quotaInfo.request - quotaInfo.used}`;

        // 统计
        const userStat = {};
        const appStat = {};
        const createByList = [];
        tasks.forEach(item => {
            if (!userStat[item.create_by]) userStat[item.create_by] = { count: 0, gpu: 0 };
            userStat[item.create_by].count++;
            userStat[item.create_by].gpu += item.gpu_req;
            appStat[item.app_name] = {
                create_by: item.create_by,
                gpu_req: item.gpu_req,
                task_name: item.task_name,
                state: item.state,
                url: item.url,
                host_ip: hostIpCache[item.app_name] || "",
            };
            createByList.push(item.create_by);
        });

        // 优先展示统计
        const userSummaryHtml = Object.entries(userStat)
            .sort((a, b) => b[1].gpu - a[1].gpu || a[0].localeCompare(b[0]))
            .map(([user, stat]) => {
                return `<div class="stat-row">
                    <span class="stat-user" title="${user}">${user}</span>
                    <span class="stat-info">${stat.count}个任务 / ${stat.gpu}卡</span>
                </div>`;
            })
            .join('');

        const summaryEl = document.getElementById(summaryTextareaId);
        let headerContent = `使用${quotaInfo.used}卡${cardType}${usedAndQuota}`;
        if (summaryTitle) {
            const cleanTitle = summaryTitle.replace(/[\(（][^\)）]*[\)）]/g, '');
            headerContent = `${headerContent}——${cleanTitle}`;
        }
        const summaryHeader = `<div class="stat-header">${headerContent}</div>`;
        summaryEl.innerHTML = summaryHeader + userSummaryHtml;
        // 渲染详情
        function renderDetails(appStat, detailDivId) {
            const container = document.getElementById(detailDivId);
            if (!container) return;

            let detailHtml = `
                <div class="detail-row detail-header">
                    <div class="detail-col col-idx">序号</div>
                    <div class="detail-col col-user">用户</div>
                    <div class="detail-col col-gpu">卡数</div>
                    <div class="detail-col col-task">任务名</div>
                    <div class="detail-col col-state">状态</div>
                    <div class="detail-col col-ip">Host IP</div>
                    <div class="detail-col col-cmd">登录命令行</div>
                    <div class="detail-col col-remark">备注</div>
                </div>
            `;

            let idx = 0;
            Object.entries(appStat)
                .sort((a, b) => a[1].create_by.localeCompare(b[1].create_by) || (a[1].url || '').localeCompare(b[1].url || ''))
                .forEach(([appName, stat]) => {
                    const taskNameLink = stat.url ? `<a href="${stat.url}" target="_blank" class="detail-link" title="${stat.task_name}">${stat.task_name}</a>` : `<span title="${stat.task_name}">${stat.task_name}</span>`;
                    const stateLink = ipUrlMap[appName] ? `<a href="${ipUrlMap[appName]}" target="_blank" class="detail-link">${stat.state}</a>` : stat.state;

                    // host_ip
                    const ipInfo = hostIpCache[appName] || {};
                    const ipText = ipInfo.ip || '-';
                    const ipHtml = ipInfo.ip
                        ? `<span class="copy-btn" onclick="navigator.clipboard.writeText('${ipInfo.ip}');this.style.color='red';setTimeout(()=>this.style.color='',600);" title="点击复制">${ipText}</span>`
                        : ipText;

                    // 登录命令行
                    const projectId = projectIdMap[appName];
                    const projectToken = projectTokenCache[projectId] || "";
                    let loginCommandText = "";
                    let loginCommand = "";
                    if (appName.startsWith("mpi-")) {
                        loginCommandText = appName + "-launcher";
                        loginCommand = `./gemini-go mpi-launcher@${appName}-launcher ${projectToken}`;
                    } else if (appName.startsWith("pytorch-")) {
                        loginCommandText = appName + "-master-0";
                        loginCommand = `./gemini-go pytorch@${appName}-master-0 ${projectToken}`;
                    } else {
                        loginCommandText = appName;
                        loginCommand = "";
                    }

                    const cmdHtml = (projectToken && loginCommand)
                        ? `<span class="copy-btn" onclick="navigator.clipboard.writeText('${loginCommand}');this.style.color='red';setTimeout(()=>this.style.color='',600);" title="点击复制">${loginCommandText}</span>`
                        : loginCommandText;

                    // 备注
                    const remarkKey = "gemini_remark_" + appName;
                    const remarkVal = localStorage.getItem(remarkKey) || "";
                    const remarkHtml = `<input type="text" id="remark_${appName}" value="${remarkVal.replace(/"/g, '&quot;')}" class="remark-input" />`;

                    detailHtml += `
                        <div class="detail-row">
                            <div class="detail-col col-idx">${idx}</div>
                            <div class="detail-col col-user" title="${stat.create_by}">${stat.create_by}</div>
                            <div class="detail-col col-gpu">${stat.gpu_req}</div>
                            <div class="detail-col col-task">${taskNameLink}</div>
                            <div class="detail-col col-state">${stateLink}</div>
                            <div class="detail-col col-ip">${ipHtml}</div>
                            <div class="detail-col col-cmd" title="${loginCommandText}">${cmdHtml}</div>
                            <div class="detail-col col-remark">${remarkHtml}</div>
                        </div>
                    `;
                    idx++;
                });

            let finalHtml = `<div class="detail-table">${detailHtml}</div>`;
            if (summaryTitle) {
                finalHtml = `<h4 class="section-title">${summaryTitle}</h4>` + finalHtml;
            }
            
            // 只有当内容变化时才更新 DOM
            if (container.innerHTML !== finalHtml) {
                container.innerHTML = finalHtml;

                // 统一绑定 input 事件，实时保存
                setTimeout(() => {
                    Object.keys(appStat).forEach(appName => {
                        const input = document.getElementById('remark_' + appName);
                        if (input) {
                            input.value = localStorage.getItem("gemini_remark_" + appName) || "";
                            input.addEventListener('input', function() {
                                localStorage.setItem("gemini_remark_" + appName, this.value);
                            });
                        }
                    });
                }, 100);
            }
        }
        // 批量补全 ip_url_map/runtime_id
        batchFetchAccountRunningTasks(accountName, [...new Set(createByList)]).then(() => {
            // 再次渲染
            renderDetails(appStat, detailDivId);

            batchFetchProjectToken(Object.keys(appStat)).then(() => {
                // 优先渲染 project_token
                renderDetails(appStat, detailDivId);

                // host_ip 补全后再渲染
                batchFetchHostIp(Object.keys(appStat)).then(() => {
                    renderDetails(appStat, detailDivId);
                });
            });
        });
    }).catch(e => {
        console.log(e);
    });
}

// ------------------- 总调度 -------------------
function update() {
    // 每次更新前只清空“请求状态缓存”，保留“数据缓存”以便在请求期间显示旧值
    [usedRequestCache, hostIpRequestCache, projectTokenRequestCache].forEach(obj => {
        for (const key in obj) delete obj[key];
    });

    updateJobs("voice-biz-h800_test_2", "h20", "textarea_biz2_h20", "div_biz2_detail_h20", "gpu-nj-10", "南京H20（voice-biz-2）");
    updateJobs("voice-biz-h800-3", "h20", "textarea_biz3_h20", "div_biz3_detail_h20", "gpu-hz-1", "惠州H20（voice-biz-3）");
}

// -------------------- 初始化 --------------------
ImportCss();
update();

// 电子钟更新
let firstZeroSkipped = false;
function updateClock() {
    const now = new Date();
    const s = String(now.getSeconds()).padStart(2, '0');

    if (s === '00') {
        if (!firstZeroSkipped) {
            firstZeroSkipped = true;
            return;
        }
        update();
    }
}
updateClock();
setInterval(updateClock, 1000);

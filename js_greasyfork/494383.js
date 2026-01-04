// ==UserScript==
// @name         ChatGPT请求计数器
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  记录ChatGPT各个模型的调用情况
// @author       muzi
// @icon         https://chat.openai.com/favicon.ico
// @match        https://chat.openai.com/
// @match        https://chat.openai.com/?model=*
// @match        https://chat.openai.com/c/*
// @match        https://chat.openai.com/g/*
// @match        https://chat.openai.com/gpts/*
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/?model=*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/gpts
// @match        https://chatgpt.com/gpts/*
// @match        https://chatgpt.com/share/*
// @match        https://chatgpt.com/share/*/continue
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494383/ChatGPT%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/494383/ChatGPT%E8%AF%B7%E6%B1%82%E8%AE%A1%E6%95%B0%E5%99%A8.meta.js
// ==/UserScript==

/*
1. 监听 fetch 函数调用
当 request_url=https://chat.openai.com/backend-api/conversation && request_method=POST 时，解析 post body 并记录其中的 model 字段

a. 从 localStorage 中读取 model_request_mapping，如果没有则创建一个空的 model_mapping
b. 写入数据 key 为 model，value 为每次调用的时间戳列表，存储到 localStorage 中

2. 记录模型调用次数
- 当天所有模型调用次数
- 当天 GPT-4 调用次数
- 剩余 GPT-4 调用次数（比如每3小时50条）

3. 支持导出数据
- 以 json 格式导出 model_request_mapping 数据

4. 支持自定义配置
a. 缓存时间，超过缓存时间的数据自动清理，避免 localStorage 过大

5. 支持记录模型生成的 token 数量
*/

/*
2024-04-16 ChangeLog
增加对 auto 模式的统计
*/

(function () {
    "use strict";

    const LIMIT_HOURS = 3; // 自定义配置：缓存时间
    const GPT4_LIMIT = 40; // 自定义配置：GPT-4 调用限制
    const panelHTML = `<div id="chatgpt-counter-panel"class="flex flex-col gap-1 border-t border-black/20 pt-2 empty:hidden gizmo:border-t-0 gizmo:border-token-border-light dark:border-white/20"><div class="flex w-full items-center"><div class="grow"><div class="group relative"data-headlessui-state=""><button class="flex w-full max-w-[100%] items-center gap-2 rounded-lg p-2 text-sm hover:bg-token-sidebar-surface-secondary group-ui-open:bg-token-sidebar-surface-secondary"id="chatgpt-counter-panel-export"type="button"aria-haspopup="true"aria-expanded="false"data-headlessui-state=""><div class="flex-shrink-0"><div class="flex items-center justify-center rounded gizmo:overflow-hidden"><div class="relative flex"><svg width="24"height="24"viewBox="0 0 41 41"fill="none"xmlns="http://www.w3.org/2000/svg"class="h-2/3 w-2/3"role="img"><text x="-9999"y="-9999">ChatGPT</text><path d="M37.5324 16.8707C37.9808 15.5241 38.1363 14.0974 37.9886 12.6859C37.8409 11.2744 37.3934 9.91076 36.676 8.68622C35.6126 6.83404 33.9882 5.3676 32.0373 4.4985C30.0864 3.62941 27.9098 3.40259 25.8215 3.85078C24.8796 2.7893 23.7219 1.94125 22.4257 1.36341C21.1295 0.785575 19.7249 0.491269 18.3058 0.500197C16.1708 0.495044 14.0893 1.16803 12.3614 2.42214C10.6335 3.67624 9.34853 5.44666 8.6917 7.47815C7.30085 7.76286 5.98686 8.3414 4.8377 9.17505C3.68854 10.0087 2.73073 11.0782 2.02839 12.312C0.956464 14.1591 0.498905 16.2988 0.721698 18.4228C0.944492 20.5467 1.83612 22.5449 3.268 24.1293C2.81966 25.4759 2.66413 26.9026 2.81182 28.3141C2.95951 29.7256 3.40701 31.0892 4.12437 32.3138C5.18791 34.1659 6.8123 35.6322 8.76321 36.5013C10.7141 37.3704 12.8907 37.5973 14.9789 37.1492C15.9208 38.2107 17.0786 39.0587 18.3747 39.6366C19.6709 40.2144 21.0755 40.5087 22.4946 40.4998C24.6307 40.5054 26.7133 39.8321 28.4418 38.5772C30.1704 37.3223 31.4556 35.5506 32.1119 33.5179C33.5027 33.2332 34.8167 32.6547 35.9659 31.821C37.115 30.9874 38.0728 29.9178 38.7752 28.684C39.8458 26.8371 40.3023 24.6979 40.0789 22.5748C39.8556 20.4517 38.9639 18.4544 37.5324 16.8707ZM22.4978 37.8849C20.7443 37.8874 19.0459 37.2733 17.6994 36.1501C17.7601 36.117 17.8666 36.0586 17.936 36.0161L25.9004 31.4156C26.1003 31.3019 26.2663 31.137 26.3813 30.9378C26.4964 30.7386 26.5563 30.5124 26.5549 30.2825V19.0542L29.9213 20.998C29.9389 21.0068 29.9541 21.0198 29.9656 21.0359C29.977 21.052 29.9842 21.0707 29.9867 21.0902V30.3889C29.9842 32.375 29.1946 34.2791 27.7909 35.6841C26.3872 37.0892 24.4838 37.8806 22.4978 37.8849ZM6.39227 31.0064C5.51397 29.4888 5.19742 27.7107 5.49804 25.9832C5.55718 26.0187 5.66048 26.0818 5.73461 26.1244L13.699 30.7248C13.8975 30.8408 14.1233 30.902 14.3532 30.902C14.583 30.902 14.8088 30.8408 15.0073 30.7248L24.731 25.1103V28.9979C24.7321 29.0177 24.7283 29.0376 24.7199 29.0556C24.7115 29.0736 24.6988 29.0893 24.6829 29.1012L16.6317 33.7497C14.9096 34.7416 12.8643 35.0097 10.9447 34.4954C9.02506 33.9811 7.38785 32.7263 6.39227 31.0064ZM4.29707 13.6194C5.17156 12.0998 6.55279 10.9364 8.19885 10.3327C8.19885 10.4013 8.19491 10.5228 8.19491 10.6071V19.808C8.19351 20.0378 8.25334 20.2638 8.36823 20.4629C8.48312 20.6619 8.64893 20.8267 8.84863 20.9404L18.5723 26.5542L15.206 28.4979C15.1894 28.5089 15.1703 28.5155 15.1505 28.5173C15.1307 28.5191 15.1107 28.516 15.0924 28.5082L7.04046 23.8557C5.32135 22.8601 4.06716 21.2235 3.55289 19.3046C3.03862 17.3858 3.30624 15.3413 4.29707 13.6194ZM31.955 20.0556L22.2312 14.4411L25.5976 12.4981C25.6142 12.4872 25.6333 12.4805 25.6531 12.4787C25.6729 12.4769 25.6928 12.4801 25.7111 12.4879L33.7631 17.1364C34.9967 17.849 36.0017 18.8982 36.6606 20.1613C37.3194 21.4244 37.6047 22.849 37.4832 24.2684C37.3617 25.6878 36.8382 27.0432 35.9743 28.1759C35.1103 29.3086 33.9415 30.1717 32.6047 30.6641C32.6047 30.5947 32.6047 30.4733 32.6047 30.3889V21.188C32.6066 20.9586 32.5474 20.7328 32.4332 20.5338C32.319 20.3348 32.154 20.1698 31.955 20.0556ZM35.3055 15.0128C35.2464 14.9765 35.1431 14.9142 35.069 14.8717L27.1045 10.2712C26.906 10.1554 26.6803 10.0943 26.4504 10.0943C26.2206 10.0943 25.9948 10.1554 25.7963 10.2712L16.0726 15.8858V11.9982C16.0715 11.9783 16.0753 11.9585 16.0837 11.9405C16.0921 11.9225 16.1048 11.9068 16.1207 11.8949L24.1719 7.25025C25.4053 6.53903 26.8158 6.19376 28.2383 6.25482C29.6608 6.31589 31.0364 6.78077 32.2044 7.59508C33.3723 8.40939 34.2842 9.53945 34.8334 10.8531C35.3826 12.1667 35.5464 13.6095 35.3055 15.0128ZM14.2424 21.9419L10.8752 19.9981C10.8576 19.9893 10.8423 19.9763 10.8309 19.9602C10.8195 19.9441 10.8122 19.9254 10.8098 19.9058V10.6071C10.8107 9.18295 11.2173 7.78848 11.9819 6.58696C12.7466 5.38544 13.8377 4.42659 15.1275 3.82264C16.4173 3.21869 17.8524 2.99464 19.2649 3.1767C20.6775 3.35876 22.0089 3.93941 23.1034 4.85067C23.0427 4.88379 22.937 4.94215 22.8668 4.98473L14.9024 9.58517C14.7025 9.69878 14.5366 9.86356 14.4215 10.0626C14.3065 10.2616 14.2466 10.4877 14.2479 10.7175L14.2424 21.9419ZM16.071 17.9991L20.4018 15.4978L24.7325 17.9975V22.9985L20.4018 25.4983L16.071 22.9985V17.9991Z"fill="currentColor"></path></svg></div></div></div><div class="relative grow -space-y-px overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 gizmo:-top-px dark:text-white"><div class="font-semibold"id="total">0</div></div><div class="flex-shrink-0"><div class="flex items-center justify-center rounded gizmo:overflow-hidden"><div class="relative flex"><svg xmlns="http://www.w3.org/2000/svg"width="24"height="24"fill="none"viewBox="0 0 24 24"class="icon-md shrink-0"><path fill="currentColor"fill-rule="evenodd"d="M12 7.42a22 22 0 0 0-2.453 2.127A22 22 0 0 0 7.42 12a22 22 0 0 0 2.127 2.453c.807.808 1.636 1.52 2.453 2.128a22 22 0 0 0 2.453-2.128A22 22 0 0 0 16.58 12a22 22 0 0 0-2.127-2.453A22 22 0 0 0 12 7.42m1.751-1.154a25 25 0 0 1 2.104 1.88 25 25 0 0 1 1.88 2.103c.316-.55.576-1.085.779-1.59.35-.878.507-1.625.503-2.206-.003-.574-.16-.913-.358-1.111-.199-.199-.537-.356-1.112-.36-.58-.003-1.328.153-2.205.504-.506.203-1.04.464-1.59.78Zm3.983 7.485a25 25 0 0 1-1.88 2.104 25 25 0 0 1-2.103 1.88 13 13 0 0 0 1.59.779c.878.35 1.625.507 2.206.503.574-.003.913-.16 1.111-.358.199-.199.356-.538.36-1.112.003-.58-.154-1.328-.504-2.205a13 13 0 0 0-.78-1.59ZM12 18.99c.89.57 1.768 1.03 2.605 1.364 1.026.41 2.036.652 2.955.646.925-.006 1.828-.267 2.5-.94.673-.672.934-1.575.94-2.5.006-.919-.236-1.929-.646-2.954A15.7 15.7 0 0 0 18.99 12a15.6 15.6 0 0 0 1.364-2.606c.41-1.025.652-2.035.646-2.954-.006-.925-.267-1.828-.94-2.5-.672-.673-1.575-.934-2.5-.94-.919-.006-1.929.235-2.954.646-.838.335-1.716.795-2.606 1.364a15.7 15.7 0 0 0-2.606-1.364C8.37 3.236 7.36 2.994 6.44 3c-.925.006-1.828.267-2.5.94-.673.672-.934 1.575-.94 2.5-.006.919.235 1.929.646 2.955A15.7 15.7 0 0 0 5.01 12c-.57.89-1.03 1.768-1.364 2.605-.41 1.026-.652 2.036-.646 2.955.006.925.267 1.828.94 2.5.672.673 1.575.934 2.5.94.92.006 1.93-.235 2.955-.646A15.7 15.7 0 0 0 12 18.99m-1.751-1.255a25 25 0 0 1-2.104-1.88 25 25 0 0 1-1.88-2.104c-.315.55-.576 1.085-.779 1.59-.35.878-.507 1.625-.503 2.206.003.574.16.913.359 1.111.198.199.537.356 1.111.36.58.003 1.328-.153 2.205-.504.506-.203 1.04-.463 1.59-.78Zm-3.983-7.486a25 25 0 0 1 1.88-2.104 25 25 0 0 1 2.103-1.88 13 13 0 0 0-1.59-.779c-.878-.35-1.625-.507-2.206-.503-.574.003-.913.16-1.111.359-.199.198-.356.537-.36 1.111-.003.58.153 1.328.504 2.205.203.506.464 1.04.78 1.59Z"clip-rule="evenodd"></path></svg></div></div></div><div class="relative grow -space-y-px overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 gizmo:-top-px dark:text-white"><div class="font-semibold"id="dynamic">0</div></div><div class="flex-shrink-0"><div class="flex items-center justify-center rounded gizmo:overflow-hidden"><div class="relative flex"><svg xmlns="http://www.w3.org/2000/svg"width="24"height="24"fill="none"viewBox="0 0 24 24"class="icon-md shrink-0"><path fill="currentColor"d="M15.11 14.285a.41.41 0 0 1 .78 0c.51 2.865.96 3.315 3.825 3.826.38.12.38.658 0 .778-2.865.511-3.315.961-3.826 3.826a.408.408 0 0 1-.778 0c-.511-2.865-.961-3.315-3.826-3.826a.408.408 0 0 1 0-.778c2.865-.511 3.315-.961 3.826-3.826Zm2.457-12.968a.454.454 0 0 1 .866 0C19 4.5 19.5 5 22.683 5.567a.454.454 0 0 1 0 .866C19.5 7 19 7.5 18.433 10.683a.454.454 0 0 1-.866 0C17 7.5 16.5 7 13.317 6.433a.454.454 0 0 1 0-.866C16.5 5 17 4.5 17.567 1.317"></path><path fill="currentColor"fill-rule="evenodd"d="M7.001 4a1 1 0 0 1 .993.887c.192 1.7.701 2.877 1.476 3.665.768.783 1.913 1.3 3.618 1.452a1 1 0 0 1-.002 1.992c-1.675.145-2.849.662-3.638 1.452-.79.79-1.307 1.963-1.452 3.638a1 1 0 0 1-1.992.003c-.152-1.706-.67-2.851-1.452-3.62-.788-.774-1.965-1.283-3.665-1.475a1 1 0 0 1-.002-1.987c1.73-.2 2.878-.709 3.646-1.476.767-.768 1.276-1.916 1.476-3.646A1 1 0 0 1 7 4Zm-2.472 6.998a6.1 6.1 0 0 1 2.468 2.412 6.2 6.2 0 0 1 1.037-1.376 6.2 6.2 0 0 1 1.376-1.036 6.1 6.1 0 0 1-2.412-2.469 6.2 6.2 0 0 1-1.053 1.416 6.2 6.2 0 0 1-1.416 1.053"clip-rule="evenodd"></path></svg></div></div></div><div class="relative grow -space-y-px overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 gizmo:-top-px dark:text-white"><div class="font-semibold"id="gpt-4">0</div></div><div class="flex-shrink-0"><div class="flex items-center justify-center rounded gizmo:overflow-hidden"><div class="relative flex"><svg t="1713238627801"class="icon"viewBox="0 0 1024 1024"version="1.1"xmlns="http://www.w3.org/2000/svg"p-id="7155"width="24"height="24"><path d="M639.0272 514.7648c-0.1536 23.1424-0.5632 36.864-1.024 66.048a122.88 122.88 0 0 0-69.376 110.6432 122.88 122.88 0 0 0 234.5984 51.3024c0.512-1.024 41.8816 0 65.4336-0.3072a183.3984 183.3984 0 0 1-53.6064 85.8112 184.32 184.32 0 1 1-175.9744-313.5488z m-412.16 148.736a33.7408 33.7408 0 0 1 19.0976 43.6736 18.3296 18.3296 0 0 0-1.4848 6.8608c0 30.7712 83.7632 75.4688 214.8352 85.504 9.0624 0.7168 41.728 7.168 39.3216 37.632-2.3552 30.5152-34.9184 30.2592-44.3904 29.5424-145.664-11.1104-277.0944-63.0784-277.0944-152.6784 0-10.5472 2.048-21.1456 6.0416-31.3856a33.6896 33.6896 0 0 1 43.6736-19.1488z m464.64-156.3648a184.32 184.32 0 0 1 184.32 184.32v30.4128l-30.4128 0.3072c-14.0288 0.1536-31.1296 0.256-51.3024 0.256l-133.2224-0.4096-0.256-111.4624 0.4608-103.424z m-464.64-45.7216a33.7408 33.7408 0 0 1 19.0976 43.6736 18.3296 18.3296 0 0 0-1.4848 6.8608c0 28.1088 69.8368 67.7888 181.76 82.1248 13.0048 1.6896 31.488 7.8848 31.488 36.0448 0 28.16-21.4528 33.0752-37.12 31.1808C288.9216 645.12 177.152 594.5344 177.152 511.9488c0-10.5472 2.048-21.1456 6.0416-31.4368a33.6896 33.6896 0 0 1 43.6736-19.0976z m495.2064 111.0528l0.0512 88.4224 88.3712 0.0512-0.512-2.1504a123.136 123.136 0 0 0-85.8112-85.8112l-2.0992-0.512zM177.152 308.6848c0-203.4176 673.6384-203.4176 673.6384 0 0 101.7344-169.472 154.9312-336.7936 154.9312-167.424 0-336.896-53.248-336.896-154.9312z m336.8448-87.552c-161.9968 0-269.4656 52.6848-269.4656 87.552 0 34.816 107.52 87.552 269.4656 87.552s269.4656-52.736 269.4656-87.552c0-34.8672-107.52-87.552-269.4656-87.552z"fill="currentColor"p-id="7156"></path></svg></div></div></div><div class="relative grow -space-y-px overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 gizmo:-top-px dark:text-white"><div class="font-semibold"id="remain">0</div></div></button></div></div></div><div class="border-b border-white/20"></div></div>`;
    var originalFetch = window.fetch;
    console.info("ChatGPTRequestCounter loaded");
    window.fetch = function (url, options) {
        // 重构：将条件逻辑提取到单独的函数中
        processRequest(url, options);

        // 调用原始的fetch函数
        return originalFetch.apply(this, arguments);
    };

    function processRequest(url, options) {
        if (
            url.includes("/backend-api/conversation") &&
            options &&
            options.method === "POST"
        ) {
            logRequest(options);
        } else if (
            url.includes("discovery.json") ||
            url.includes("gizmos/g-") ||
            url.includes("_next/data") ||
            url.includes("backend-api/conversation")
        ) {
            safeUpdateCount();
        } else if (
            url.endsWith("lat/r") &&
            options &&
            options.method === "POST"
        ) {
            logTokenNum(options);
        }
    }
    function logRequest(options) {
        processData(options, "model_request_mapping");
    }

    function logTokenNum(options) {
        processData(options, "tokenStatistics", (data) => ({
            time: Date.now(),
            response_tokens: data.count_tokens,
        }));
    }

    function processData(
        options,
        storageKey,
        dataMappingFn = (data) => Date.now()
    ) {
        try {
            const requestData = JSON.parse(options.body);
            if (requestData.model) {
                let storageData = JSON.parse(
                    localStorage.getItem(storageKey) || "{}"
                );
                if (!storageData[requestData.model]) {
                    storageData[requestData.model] = [];
                }
                storageData[requestData.model].push(dataMappingFn(requestData));
                localStorage.setItem(storageKey, JSON.stringify(storageData));
                safeUpdateCount();
            }
        } catch (err) {
            console.error("Error processing request:", err);
        }
    }

    function safeUpdateCount() {
        try {
            updateCount();
        } catch (err) {
            console.error("Error logging ChatGPT request:", err);
        }
    }

    function logDailyTokenCount() {
        const today = new Date().toDateString(); // 获取当天日期字符串
        let tokenStatistics = JSON.parse(
            localStorage.getItem("tokenStatistics") || "{}"
        );
        let dailyTokenCount = {};

        for (let model in tokenStatistics) {
            dailyTokenCount[model] = tokenStatistics[model]
                .filter(
                    (entry) => new Date(entry.time).toDateString() === today
                ) // 筛选当天的数据
                .reduce((total, entry) => total + entry.response_tokens, 0); // 累加token数量
        }

        return dailyTokenCount;
    }

    function countRequests() {
        let gpt4_recent = 0;
        let gpt4_today = 0;
        let all_models_today = 0;
        let dynamic_today = 0;
        let dynamic_recent = 0;

        const cutoffTime = Date.now() - LIMIT_HOURS * 60 * 60 * 1000;
        const todayCutOffTime = new Date().setHours(0, 0, 0, 0);

        const originalMapping = JSON.parse(
            localStorage.getItem("model_request_mapping") || "{}"
        );
        const model_request_mapping = JSON.parse(
            JSON.stringify(originalMapping)
        ); // deep copy

        for (let model in model_request_mapping) {
            const todayRequests = model_request_mapping[model].filter(
                (timestamp) => timestamp > todayCutOffTime
            );
            all_models_today += todayRequests.length;

            if (model.startsWith("gpt-4")) {
                gpt4_today += todayRequests.length;

                const recentRequests = todayRequests.filter(
                    (timestamp) => timestamp > cutoffTime
                );
                gpt4_recent += recentRequests.length;
            }

            // 新增处理 auto 开头的模型
            if (model.startsWith("auto")) {
                dynamic_today += todayRequests.length;

                const recentRequests = todayRequests.filter(
                    (timestamp) => timestamp > cutoffTime
                );
                dynamic_recent += recentRequests.length;
            }
        }

        return {
            all_models_today,
            gpt4_today,
            gpt4_recent,
            dynamic_today, // 新增
            dynamic_recent, // 新增
        };
    }

    // 插入展示面板
    function insertPanel(panelHTML, exportData) {
        // 避免重复插入
        if (document.querySelector("#chatgpt-counter-panel")) {
            console.log("Panel already inserted.");
            return;
        }

        // 目标选择器
        const targetSelector =
            ".flex.flex-col.pt-2.empty\\:hidden.dark\\:border-white\\/20";
        console.log("Looking for profileDiv at:", targetSelector);

        // 使用 MutationObserver 观察 DOM 变化
        const observer = new MutationObserver((mutations, obs) => {
            const profileDiv = document.querySelector(targetSelector);

            if (profileDiv) {
                // 避免重复插入
                if (document.querySelector("#chatgpt-counter-panel")) {
                    console.log("Panel already inserted.");
                    obs.disconnect(); // 停止观察
                    return;
                }

                // 插入面板的 HTML
                console.log("Inserting panel at:", targetSelector);
                profileDiv.insertAdjacentHTML("afterbegin", panelHTML);

                // 添加导出按钮的事件监听器
                const exportButton = document.getElementById(
                    "chatgpt-counter-panel-export"
                );
                if (exportButton) {
                    exportButton.removeEventListener("click", exportData);
                    exportButton.addEventListener("click", exportData);
                }

                // 停止观察
                obs.disconnect();

                // 延迟更新计数，确保面板已插入
                setTimeout(updateCount, 500);
            } else {
                console.warn(
                    "Target profileDiv not found. Waiting for further mutations..."
                );
            }
        });

        // 观察整个文档的子节点变化
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
    }

    // 更新展示面板数值
    function updateCount() {
        const counts = countRequests();
        const all_models_today = counts.all_models_today;
        const gpt4_today = counts.gpt4_today;
        const dynamic_today = counts.dynamic_today;
        const remaining =
            GPT4_LIMIT - counts.gpt4_recent - counts.dynamic_recent;

        // 如果面板不存在，插入面板
        insertPanel(panelHTML, exportData);

        // 安全地更新元素的文本内容
        const updateTextContent = (id, text) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = text;
            } else {
                console.error(`Element with ID '${id}' not found. waiting...`);
            }
        };

        updateTextContent("total", all_models_today);
        updateTextContent("gpt-4", gpt4_today);
        updateTextContent("dynamic", dynamic_today);
        updateTextContent("remain", remaining);
    }
    // 创建导出功能
    function exportData() {
        // 获取当天的Token计数
        const dailyTokenCount = logDailyTokenCount();
        const tokenCountMessage =
            "今日模型输出统计:\n" + JSON.stringify(dailyTokenCount, null, 2);

        // 询问用户是否下载请求记录，同时展示Token计数
        const userConfirmed = confirm(
            tokenCountMessage + "\n\n是否下载请求记录？"
        );
        if (userConfirmed) {
            // 用户选择“确定”，触发下载
            const dataStr =
                "data:text/json;charset=utf-8," +
                encodeURIComponent(
                    localStorage.getItem("model_request_mapping")
                );
            const downloadAnchorNode = document.createElement("a");
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute(
                "download",
                "model_request_mapping.json"
            );
            document.body.appendChild(downloadAnchorNode);
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        }
    }
    // every 5 minutes update count
    setInterval(() => {
        updateCount();
    }, 5 * 60 * 1000);
    updateCount();
})();

// ==UserScript==
// @name         Swagger UI 文档辅助
// @namespace    amao.cool
// @version      1.0.1
// @description  给 Swagger UI 接口文档增加了一些功能，详见 https://github.com/amaoaaaaa/swagger-ui-enhancer/blob/master/README.md
// @author       阿茂一米六
// @license MIT
// @match        *://*/*swagger-ui.html*
// @icon         https://static1.smartbear.co/swagger/media/assets/swagger_fav.png
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/deep-diff/1.0.2/deep-diff.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524595/Swagger%20UI%20%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/524595/Swagger%20UI%20%E6%96%87%E6%A1%A3%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // 使用增强的功能
    useBaseUrlEnhancer();
    useApiDocsHistory();
    useCopyRequestEnhancer();
    useTypeParseEnhancer();
    /**
     * 使用可编辑的 BaseUrl
     */
    function useBaseUrlEnhancer() {
        // 保存原始的 fetch 方法
        const originalFetch = window.fetch;
        const localKey = "new-baseurl_" + encodeURIComponent(location.pathname);
        const localNewBaseurl = localStorage.getItem(localKey);
        const baseurlInput = document.createElement("input");
        const $baseurlInput = $(baseurlInput);
        baseurlInput.placeholder = "修改 Base URL";
        $baseurlInput.css({
            "border-radius": "5px",
            margin: "10px 0 5px 0",
            outline: "none",
            border: "2px solid #39f",
            "font-size": "14px",
            padding: "6px 10px",
            color: "#39f",
            width: "400px",
            "font-weight": "bold",
            "font-family": "pingfang sc",
        });
        if (localNewBaseurl) {
            baseurlInput.value = localNewBaseurl;
        }
        baseurlInput.addEventListener("change", function () {
            localStorage.setItem(localKey, this.value);
        });
        let configBaseUrl = "防止初始化时被 includes() 匹配到";
        // 获取原本的 baseurl
        const timer = setInterval(() => {
            const _configBaseUrl = $(".swagger-ui .info .base-url")
                .text()
                .replace("[ Base URL: ", "")
                .replace(" ]", "");
            if (!_configBaseUrl)
                return;
            clearInterval(timer);
            setTimeout(() => {
                $(".swagger-ui .info .base-url").after($baseurlInput, "<br>");
                configBaseUrl = _configBaseUrl;
            }, 1000);
        }, 100);
        // 定义新的 fetch 方法
        window.fetch = async function (...args) {
            let [resource, config] = args;
            if (resource.includes(configBaseUrl)) {
                const searchValue = resource.slice(0, resource.indexOf(configBaseUrl) + configBaseUrl.length);
                resource = resource.replace(searchValue, baseurlInput.value);
            }
            return await originalFetch(resource, config);
        };
    }
    /**
     * 使用接口文档历史版本记录
     */
    function useApiDocsHistory() {
        // 保存原始的 fetch 方法
        const originalFetch = window.fetch;
        // 定义新的 fetch 方法
        window.fetch = async function (...args) {
            return await originalFetch(...args).then(async (rep) => {
                const res = (await rep.clone().json());
                // 判断是请求接口文档详细数据的接口
                if (res.swagger && res["x-openapi"]) {
                    const apiDocsRes = res;
                    const apiDocsHistoryData = getApiDocsHistoryData();
                    const apiDocsPrevVersion = apiDocsHistoryData.at(-1)?.apiDocs;
                    console.log("apiDocsRes", apiDocsRes);
                    // 打印更新记录
                    apiDocsHistoryData.forEach((historyItem, index) => {
                        const prev = apiDocsHistoryData[index - 1]?.apiDocs;
                        if (!prev)
                            return;
                        const diff = diffApiDocs(prev, historyItem.apiDocs);
                        if (diff) {
                            console.log(`%c --------- 文档更新 ${historyItem.diffTime} ---------`, "color: #39f; font-size: 16px; font-weight: bold");
                            diff.forEach((diffItem) => {
                                const type = {
                                    N: {
                                        name: "新增",
                                        color: "#27ae60",
                                    },
                                    D: {
                                        name: "删除",
                                        color: "#ef4444",
                                    },
                                    E: {
                                        name: "修改",
                                        color: "#ff8000",
                                    },
                                    A: {
                                        name: "数组更新",
                                        color: "#3399ff",
                                    },
                                }[diffItem.kind];
                                const api = diffItem.path?.[1];
                                const module = (diffItem.kind === "D" ? prev : historyItem.apiDocs)
                                    .paths[api];
                                const req = module?.get || module?.post;
                                const moduleName = req?.tags[0];
                                const apiName = req?.summary;
                                const p = moduleName && apiName
                                    ? `${moduleName}：${apiName}`
                                    : "Models：";
                                console.log(`%c【${type.name}】`, `color: ${type.color}`, p, api);
                                if (diffItem.kind === "E") {
                                    console.log("修改前", diffItem.lhs);
                                    console.log("修改后", diffItem.rhs);
                                }
                                console.log("-------------------------");
                            });
                            console.log("");
                        }
                    });
                    const diff = diffApiDocs(apiDocsPrevVersion, apiDocsRes);
                    if (diff) {
                        alert("接口文档有更新，请查看控制台");
                    }
                    // 如果没有上一个版本的数据，或者比上一个版本新，则保存当前版本的数据
                    if (!apiDocsPrevVersion || diff) {
                        saveApiDocsData(apiDocsRes);
                    }
                }
                return rep;
            });
        };
        function diffApiDocs(apiDocsPrevVersion, apiDocsRes) {
            const diff = DeepDiff(apiDocsPrevVersion, apiDocsRes);
            return diff;
        }
        /**
         * 获取接口文档历史数据
         * @returns
         */
        function getApiDocsHistoryData() {
            try {
                const dataStr = localStorage.getItem("api_docs_history_data");
                return dataStr ? JSON.parse(dataStr) : [];
            }
            catch (error) {
                localStorage.removeItem("api_docs_history_data");
                return [];
            }
        }
        /**
         * 保存当前文档数据
         * @param apiDocsRes
         */
        function saveApiDocsData(apiDocsRes) {
            // 取出本地数据
            const apiDocsHistoryData = getApiDocsHistoryData();
            // 达到最大存储数量时，删除最早的一条
            if (apiDocsHistoryData.length >= 10) {
                apiDocsHistoryData.shift();
            }
            // 添加新数据
            apiDocsHistoryData.push({
                apiDocs: apiDocsRes,
                diffTime: new Date().toLocaleString(),
            });
            // 保存数据
            try {
                localStorage.setItem("api_docs_history_data", JSON.stringify(apiDocsHistoryData));
            }
            catch (error) {
                alert("保存接口文档历史数据失败，请检查浏览器是否阻止了本地存储");
            }
        }
    }
    /**
     * 使用一键复制请求
     */
    function useCopyRequestEnhancer() {
        const style = document.createElement("style");
        style.innerText = `
            .opblock .opblock-summary{
                border-radius: 5px;
            }
    
            .opblock.is-open .opblock-summary{
                border-radius: 5px 5px 0 0;
            }
        `;
        document.head.appendChild(style);
        // 遍历解析
        setInterval(parseHandler, 1000);
        /**
         * 处理解析
         */
        function parseHandler() {
            // 遍历所有的类型定义
            document.querySelectorAll("div.opblock").forEach((el) => {
                // 接口简介
                const apiSummary = el.querySelector(".opblock-summary");
                // 处理过了，跳过
                if (!apiSummary || apiSummary.querySelector(".clipboard-btn"))
                    return;
                // 处理复制的内容
                const url = el
                    .querySelector(".opblock-summary-path")
                    .textContent.replace(/[\u200B-\u200D\uFEFF]/g, "");
                const fnName = "api" + capitalizeFirstLetter(url.split("/").pop());
                const fnRemarkWrap = el.querySelector(".opblock-summary-description");
                const fnRemark = fnRemarkWrap.childNodes[0].textContent;
                const method = el.querySelector(".opblock-summary-method").textContent;
                const clipboardText = `
/**
 * ${fnRemark}
 */
export function ${fnName}() {
    return httpRequest<unknown>({
        method: '${method}',
        url: '${url}',
    });
}
`;
                // 创建复制按钮
                const clipboardBtn = createClipboardBtn("复制请求", clipboardText, "#ff8000");
                // 按钮位置
                clipboardBtn.style.marginLeft = "16px";
                // 添加按钮
                const btnWrap = apiSummary.querySelector(".opblock-summary-description");
                btnWrap.style.display = "flex";
                btnWrap.style.alignItems = "center";
                btnWrap.appendChild(clipboardBtn);
                // 接口简介的吸顶效果
                apiSummary.style.position = "sticky";
                apiSummary.style.zIndex = "10";
                apiSummary.style.top = "0";
                const bgColorMap = {
                    get: "#ebf3fb",
                    post: "#e8f6f0",
                };
                apiSummary.style.backgroundColor = bgColorMap[method.toLowerCase()] || "#fff";
            });
        }
    }
    /**
     * 使用一键复制接口 TypeScript 类型
     */
    function useTypeParseEnhancer() {
        // 遍历解析
        setInterval(parseTypeScriptHandler, 1000);
        /**
         * 处理解析
         */
        function parseTypeScriptHandler() {
            // 解析接口参数类型
            parseApiParametersType();
            // 解析模型定义
            parseModelsDefined();
        }
        /**
         * 解析接口参数类型
         */
        function parseApiParametersType() {
            // 遍历所有的接口参数
            document.querySelectorAll(".parameters-container").forEach((el) => {
                const $el = $(el);
                const apiWrap = $el.parents(".opblock");
                const btnWrap = el.previousElementSibling?.querySelector(".opblock-title");
                // 处理过了，跳过
                if (!btnWrap || btnWrap.querySelector(".clipboard-btn"))
                    return;
                // 获取参数表格
                const table = el.querySelector("table.parameters");
                if (!table)
                    return;
                // 处理复制的内容
                const url = apiWrap
                    .find(".opblock-summary-path")
                    .text()
                    .replace(/[\u200B-\u200D\uFEFF]/g, "");
                const typeName = capitalizeFirstLetter(url.split("/").pop()) + "Params";
                const apiDescription = apiWrap[0].querySelector(".opblock-summary-description")
                    .childNodes[0].textContent;
                const typeRemark = apiDescription ? apiDescription + "参数" : typeName;
                const clipboardText = `
/**
 * ${typeRemark}
 */
type ${typeName} = {${parseApiParametersTypeProp(table)}
};`;
                // 创建复制按钮
                const clipboardBtn = createClipboardBtn("复制参数类型", clipboardText);
                // 按钮位置
                clipboardBtn.style.marginLeft = "16px";
                // 添加按钮
                btnWrap.style.display = "flex";
                btnWrap.style.alignItems = "center";
                btnWrap.appendChild(clipboardBtn);
            });
        }
        /**
         * 解析接口参数类型的属性
         * @param {HTMLTableElement} tableEl 表格元素
         */
        function parseApiParametersTypeProp(tableEl) {
            let str = "";
            tableEl.querySelectorAll("tbody tr").forEach((tr) => {
                /**
                 * 属性名
                 */
                const propName = tr
                    .querySelector(".parameter__name")
                    .textContent.replace(" *", "");
                /**
                 * 可选的属性
                 */
                const isOptional = !Array.from(tr.querySelector(".parameter__name").classList).includes("required");
                /**
                 * 属性类型
                 */
                const propType = parserPropTypeText(tr.querySelector(".parameter__type").textContent);
                /**
                 * 属性注释
                 */
                const propRemark = tr.querySelector(".parameters-col_description .markdown")?.textContent ||
                    propName;
                const br = `
                    `;
                str += `${str === "" ? "" : br}                
    /**
     * ${propRemark.trim()}
     */
    ${propName}${isOptional ? "?" : ""}: ${propType};`;
            });
            // console.log(str);
            return str;
        }
        /**
         * 解析模型定义
         */
        function parseModelsDefined() {
            // 遍历所有的类型定义
            document.querySelectorAll("span.model").forEach((span) => {
                // 处理过了，跳过
                if (span.querySelector(".clipboard-btn"))
                    return;
                // 获取类型属性表格，没有展开的时候表格没渲染
                const table = span.querySelector("table.model");
                if (!table)
                    return;
                // 处理复制的内容
                const typeName = span.querySelector(".model-title__text").textContent;
                const typeRemark = table
                    .querySelector("tr:not(.false)")
                    ?.querySelector(".markdown")
                    ?.textContent?.trim() || typeName;
                const clipboardText = `
/**
 * ${typeRemark}
 */
type ${typeName} = {${parseModelProp(table)}
};`;
                // 创建复制按钮
                const clipboardBtn = createClipboardBtn("复制类型", clipboardText);
                // 按钮位置
                clipboardBtn.style.position = "absolute";
                clipboardBtn.style.top = "-20px";
                clipboardBtn.style.left = "100%";
                clipboardBtn.style.marginLeft = "16px";
                // 添加按钮
                // const tableWrap = span.querySelector(".inner-object");
                const tableWrap = table;
                tableWrap.style.position = "relative";
                tableWrap.appendChild(clipboardBtn);
            });
        }
        /**
         * 解析类型的属性
         * @param {HTMLTableElement} tableEl 表格元素
         */
        function parseModelProp(tableEl) {
            let str = "";
            tableEl.querySelectorAll("tr.false").forEach((tr) => {
                const tds = tr.querySelectorAll("td");
                /**
                 * 属性名
                 */
                const propName = tds[0].textContent.replace("*", "");
                /**
                 * 可选的属性
                 */
                // const isOptional = tds[0].textContent.at(-1) === "*" ? "" : "?";
                const isOptional = false;
                /**
                 * 属性类型
                 */
                const propType = parserPropTypeText(tds[1].querySelector(".prop-type")?.textContent);
                /**
                 * 属性注释
                 */
                const propRemark = tds[1].querySelector(".markdown")?.textContent || propName;
                const br = `
                    `;
                str += `${str === "" ? "" : br}                
    /**
     * ${propRemark.trim()}
     */
    ${propName}${isOptional ? "?" : ""}: ${propType};`;
            });
            // console.log(str);
            return str;
        }
        /**
         * 处理类型转换
         */
        function parserPropTypeText(propTypeText) {
            const typeMap = {
                string: "string",
                number: "number",
                integer: "number",
                "integer($int32)": "number",
                boolean: "boolean",
            };
            return propTypeText ? typeMap[propTypeText] : "unknown";
        }
    }
    /**
     * 创建复制按钮
     * @param btnText 按钮文字
     * @param clipboardText 复制内容
     * @param [backgroundColor] 按钮背景颜色，默认："#39f"
     * @returns 按钮dom对象
     */
    function createClipboardBtn(btnText, clipboardText, backgroundColor = "#39f") {
        // 创建复制按钮
        const clipboardBtn = document.createElement("button");
        // 按钮样式
        clipboardBtn.style.backgroundColor = backgroundColor;
        clipboardBtn.style.color = "#fff";
        clipboardBtn.style.fontSize = "12px";
        clipboardBtn.style.padding = "0 9px";
        clipboardBtn.style.borderRadius = "4px";
        clipboardBtn.style.border = "0";
        clipboardBtn.style.whiteSpace = "nowrap";
        clipboardBtn.style.transition = "all 0.15s";
        clipboardBtn.style.height = "26px";
        // 处理按钮属性
        const btnId = "clipboard-btn_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
        clipboardBtn.innerText = btnText;
        clipboardBtn.id = btnId;
        clipboardBtn.classList.add("clipboard-btn");
        // clipboardBtn.setAttribute("data-clipboard-text", clipboardText);
        // 鼠标按下效果
        clipboardBtn.onmousedown = function () {
            clipboardBtn.style.transform = "scale(0.95)";
        };
        clipboardBtn.onmouseup = function () {
            clipboardBtn.style.transform = "scale(1)";
        };
        // 点击复制
        clipboardBtn.addEventListener("click", async (event) => {
            // 取消冒泡
            event.stopPropagation();
            try {
                await navigator.clipboard.writeText(clipboardText);
            }
            catch (err) {
                alert("复制失败");
            }
        });
        return clipboardBtn;
    }
    /**
     * 字符串首字母大写
     */
    function capitalizeFirstLetter([first, ...rest]) {
        return first?.toUpperCase() + rest.join("");
    }
})();

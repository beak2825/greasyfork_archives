// ==UserScript==
// @name         Debank Pools AdapterId
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  提供快捷的Debank池子分类
// @author       cuukenn
// @match        https://debank.com/protocols/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @charset		 UTF-8
// @license      MIT License
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/476487/Debank%20Pools%20AdapterId.user.js
// @updateURL https://update.greasyfork.org/scripts/476487/Debank%20Pools%20AdapterId.meta.js
// ==/UserScript==
const debankAdapterExtension = (function () {
    const util = (function () {
        function findTargetElement(targetContainer) {
            const body = window.document;
            let tabContainer;
            let tryTime = 0;
            const maxTryTime = 120;
            let startTimestamp;
            return new Promise((resolve, reject) => {
                function tryFindElement(timestamp) {
                    if (!startTimestamp) {
                        startTimestamp = timestamp;
                    }
                    const elapsedTime = timestamp - startTimestamp;

                    if (elapsedTime >= 500) {
                        GM_log(
                            "查找元素：" +
                                targetContainer +
                                "，第" +
                                tryTime +
                                "次"
                        );
                        tabContainer = body.querySelector(targetContainer);
                        if (tabContainer) {
                            resolve(tabContainer);
                        } else if (++tryTime === maxTryTime) {
                            reject();
                        } else {
                            startTimestamp = timestamp;
                        }
                    }
                    if (!tabContainer && tryTime < maxTryTime) {
                        requestAnimationFrame(tryFindElement);
                    }
                }

                requestAnimationFrame(tryFindElement);
            });
        }

        function syncRequest(option) {
            return new Promise((resolve, reject) => {
                option.onload = (res) => {
                    resolve(res);
                };
                option.onerror = (err) => {
                    reject(err);
                };
                GM_xmlhttpRequest(option);
            });
        }

        return {
            req: (option) => syncRequest(option),
            findTargetEle: (targetEle) => findTargetElement(targetEle),
        };
    })();
    const dataUtil = (function () {
        const fetchData = (finalPools, id, start, limit, key) => {
            return fetch(
                `https://api.debank.com/protocol/pools?start=${start}&limit=${limit}&id=${id}&name=`,
                {
                    headers: {
                        accept: "*/*",
                        "accept-language": "zh-CN,zh;q=0.9",
                    },
                    referrer: "https://debank.com/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: null,
                    method: "GET",
                    mode: "cors",
                    credentials: "omit",
                }
            )
                .then((res) => res.json())
                .then((res) => res.data.pools)
                .then((data) => {
                    let newSize = 0;
                    for (let item of data) {
                        const typeName = item["name"];
                        let typeMap = finalPools.get(typeName);
                        if (typeMap == null) {
                            typeMap = new Map();
                            finalPools.set(typeName, typeMap);
                        }
                        const adapterId = item["adapter_id"];
                        let adapterSet = typeMap.get(adapterId);
                        if (adapterSet == null) {
                            adapterSet = new Set();
                            typeMap.set(adapterId, adapterSet);
                        }
                        adapterSet.add(item[key]);
                        newSize++;
                    }
                    return new Promise((resolve) =>
                        resolve({
                            finalPools,
                            id,
                            limit,
                            key,
                            start: start + newSize,
                            hasNext: newSize > 0,
                        })
                    );
                });
        };
        const fetchAllData = (id, limit, key, dealTask) => {
            const sleep = (task, time) => {
                return new Promise((resolve) =>
                    setTimeout(() => resolve(task), time)
                );
            };
            const sleepTask = (param) => {
                sleep(
                    fetchData(
                        param.finalPools,
                        param.id,
                        param.start,
                        param.limit,
                        param.key
                    ),
                    500 + Math.random() * 500
                ).then((res) => {
                    if (res.hasNext) {
                        return new Promise((resolve) =>
                            resolve(sleepTask(res))
                        );
                    } else {
                        dealTask(res.finalPools);
                    }
                });
            };
            return sleepTask({
                finalPools: new Map(),
                id,
                start: 0,
                limit,
                key,
            });
        };
        const transform = (data) => {
            const transformed = [];
            let id = 1;
            data.forEach((subData, type) => {
                const child = [];
                subData.forEach((v, adapterId) => {
                    const subChild = [];
                    for (let item of v) {
                        subChild.push({
                            id: id++,
                            city: item,
                            child: [],
                        });
                    }
                    child.push({
                        id: id++,
                        city: adapterId,
                        child: subChild,
                    });
                });
                transformed.push({
                    id: id++,
                    city: type,
                    child,
                });
            });
            return transformed;
        };
        return {
            fetchAllData,
            transform,
        };
    })();
    const domUtil = (function () {
        const init = (container, config) => {
            $(container).append(createContainer());
            $("#expand").on("click", function (e) {
                $("#tree").toggle("nomal", function () {
                    $(e.target).html() == "+ 展开"
                        ? $(e.target).html("- 收缩")
                        : $(e.target).html("+ 展开");
                });
            });
            $("#loadData").on("click", function (e) {
                if (config.transformedPools.length == 0) {
                    $("#loadData").html("加载中...");
                    $("#loadData").attr("disabled", true);
                    dataUtil.fetchAllData(
                        config.protocol,
                        config.limit,
                        "id",
                        (res) => {
                            return new Promise((resolve) => {
                                resolve(res);
                            })
                                .then((data) => {
                                    config.pools = res;
                                    config.transformedPools =
                                        dataUtil.transform(config.pools);
                                    loadTree(config.transformedPools);
                                })
                                .finally(() => {
                                    $("#loadData").html("加载数据");
                                    $("#loadData").removeAttr("disabled");
                                });
                        }
                    );
                } else {
                    loadTree(config.transformedPools);
                }
            });
        };
        const loadTree = (data) => {
            $("#tree").html(createDataContainer(data));

            $("#tree").on("click", function (e) {
                var targetNode = $(e.target);
                var nodeName = targetNode.get(0).tagName.toLowerCase();
                if (nodeName == "div") {
                    if ($(e.target).children("span").html() == " + ") {
                        $(e.target).children("span").html(" - ");
                    } else {
                        $(e.target).children("span").html(" + ");
                    }
                    // 移除其他选中样式
                    if ($(".active").length > 0)
                        $(".active").toggleClass("active");
                    targetNode.toggleClass("active");
                    $(e.target).parent().children("ul").toggle();
                    onclickTreeItem($(e.target).data("id"));
                }
            });
        };
        const createContainer = () => {
            return `
       <div id="adapterId-extension">
       <div>
        <button id="expand">- 收缩</button>
        <button id="loadData">加载数据</button>
        </div>
        <div id="tree" class="tree"></div>
       </div>
      `;
        };
        const createDataContainer = (data, num = 0) => {
            const createTree = (data, num = 0) => {
                var content = "<ul>";
                data.forEach((item, index) => {
                    content +=
                        '<li><div class="ul-item" style=" padding-left:' +
                        25 * num +
                        'px" data-id="' +
                        (item.child.length > 0 ? null : item.id) +
                        ' "><span ' +
                        (item.child.length > 0 ? "" : 'class="none"') +
                        "> + </span>" +
                        item.city +
                        "</div>";
                    if (item.child.length > 0)
                        content += createTree(item.child, num + 1);
                    content += "</li>";
                });
                content += "</ul>";
                return content;
            };
            return createTree(data, num);
        };
        return {
            init,
            loadTree,
        };
    })();
    class BaseConsumer {
        #_domUtil;
        #_config;
        constructor(protocol, limit) {
            this.#_domUtil = domUtil;
            this.#_config = {
                protocol,
                limit,
                pools: [],
                transformedPools: [],
            };

            this.parse = () => {
                util.findTargetEle("body").then((container) =>
                    this.generateElement(container)
                );
            };
        }
        generateElement(container) {
            GM_addStyle(`
            #tree {
                width: fit-content;
                height: 80%;
                background-color: white;
                border-radius: 3%;
                border: 1px solid black;
              }
              #tree ul {
                margin: 0;
                padding: 0;
              }
              .tree ul li {
                list-style-type: none;
              }
              .tree a {
                cursor: pointer;
              }
              .tree span {
                cursor: pointer;
              }
              .none {
                display: none;
              }
              .active {
                background-color: #ccc;
              }
              .ul-item {
                cursor: pointer;
              }
              .ul-item:hover {
                background-color: #ccc;
              }
              #adapterId-extension {
                width: fit-content;
                position: fixed;
                top: 30%;
                left: 1%;
                z-index: 1000;
              }
              #adapterId-extension > div {
                display: inline-block;
              }
              #adapterId-extension > div:nth-child(2) {
                overflow-y: scroll;
                max-height: 40vh;
              }
              #expand,
              #loadData {
                cursor: pointer;
                margin-bottom: 10px;
                display: block;
              }
            `);
            this.#_domUtil.init(container, this.#_config);
            this.#_domUtil.loadTree([]);
        }
    }
    class DefaultConsumer extends BaseConsumer {
        constructor(protocol, limit) {
            super(protocol, limit);
        }
    }
    return {
        injectEnhance: () => {
            const url = window.location.href,
                prefix = "https://debank.com/protocols/";
            if (url.startsWith(prefix)) {
                const protocol = url.replace(prefix, "").split("/")[0];
                GM_log(`mached protocolId: ${protocol}`);
                new DefaultConsumer(protocol, 20).parse();
            } else {
                GM_log("no protocolId founded");
            }
        },
    };
})();

(function () {
    debankAdapterExtension.injectEnhance();
})();

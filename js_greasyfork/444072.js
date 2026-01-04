// ==UserScript==
// @name         HPX Flutter Trigger
// @namespace    https://mtflutter.sankuai.com
// @version      1.5
// @description  给 HPX 增加一个 Flutter 版本号变更入口
// @author       iyeatse@gmail.com
// @match        https://hpx.sankuai.com/*
// @match        http://hpx.sankuai.com/*
// @require      https://unpkg.com/xhook@latest/dist/xhook.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=flutter.dev
// @grant        none
// @run-at       document-start
// @license      Commercial
// @downloadURL https://update.greasyfork.org/scripts/444072/HPX%20Flutter%20Trigger.user.js
// @updateURL https://update.greasyfork.org/scripts/444072/HPX%20Flutter%20Trigger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    xhook.after(function (request, response) {
        if (!document.URL.match(/\/\d+\/build-task\/\d+/)) {
            return;
        }
        if (request.url.match(/api\/buildType\/detail/)) {
            const resp = JSON.parse(response.text)
            if (resp.status == 1) {
                for (const buildTypeParam of resp.data.buildType.buildTypeParams) {
                    const { buildParams } = buildTypeParam
                    if (buildParams.some(({ paramKey }) => paramKey == 'mtflutterIntegrationList')) {
                        continue
                    }
                    for (let i = 0; i < buildParams.length; i++) {
                        if (buildParams[i].paramKey === 'integrationList') {
                            const { elementRules } = buildParams[i]
                            const newParam = {
                                paramKey: "mtflutterIntegrationList",
                                paramName: "Flutter 模块变更列表",
                                paramValue: [],
                                paramDesc: "填写Flutter模块名，比如iOS填waimai_e_flutter，Android填com.sankuai.wme:waimai_e_flutter",
                                valueDesc: "Flutter 模块变更列表",
                                couldEdit: true,
                                require: false,
                                elementRules,
                            }
                            buildParams.splice(i + 1, 0, newParam)
                            break
                        }
                    }
                }
                response.text = JSON.stringify(resp)
            }
        }
    });
})();
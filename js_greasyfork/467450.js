// ==UserScript==
// @name         releaseFetch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  拉取ops信息更新紧急发布清单
// @author       You
// @match        https://ops.qima-inc.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qima-inc.com
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467450/releaseFetch.user.js
// @updateURL https://update.greasyfork.org/scripts/467450/releaseFetch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function craeteFetchBtn() {
        const btn = document.createElement('button');
        btn.innerHTML = '更新飞书表格';
        btn.style.position = 'fixed';
        btn.style.top = '100px';
        btn.style.right = '100px';
        btn.style.width = '100px';
        btn.style.height = '50px';
        document.body.appendChild(btn);

        btn.addEventListener('click', updateFeishuTable);
    }

    function getReleaseList() {
        return window.axios({
            url: "https://edp.prod.qima-inc.com/api/feishu/proxy",
            method: "POST",
            data: {
                url: "https://open.feishu.cn/open-apis/bitable/v1/apps/bascnknGxmJVICu8Z5EhNOSi6Kh/tables/tblj28Xyr6ZDuOfM/records",
                data: {
                    view_id: "vewgnQBLN5",
                    page_size: 20
                },
                method: "GET"
            },
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }

    function batchUpdateReleaseData(data) {
        return window.axios({
            url: "https://edp.prod.qima-inc.com/api/feishu/proxy",
            method: "POST",
            data: {
                url: "https://open.feishu.cn/open-apis/bitable/v1/apps/bascnknGxmJVICu8Z5EhNOSi6Kh/tables/tblj28Xyr6ZDuOfM/records/batch_update",
                data: {
                    records: data
                },
                method: "POST"
            },
            withCredentials: true
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }


    function getAppReleaseInOps(appName, version) {
        return window.axios({
            url: `https://ops.qima-inc.com/api/v1.0/ops/united_deploy/application/deploy_tickets?page=1&pageSize=10&onlySuccess=false&app_name=${appName}&standard_env=prod&namespace=prod&bu_id=1&without_cronhpa=true&commit=${version}`,
            method: "GET"
        }).then(res => {
            if(res.status === 200) {
                if(res.data.code === 0) {
                    return res.data.data
                }
            }
        })
    }

    function updateFeishuTable() {
        getReleaseList().then(res => {
            const releaseList = res.items.filter(item => !item.fields.紧急发布原因);
            const needQueryData = releaseList.map(item => [item.fields.版本, item.fields.应用]);

            Promise.all(needQueryData.map(data => getAppReleaseInOps(data[1], data[0]))).then(resArr => {
                const data = resArr.map(item => {
                    const result = {};
                    const releaseInfo = item.value[0];
                    const { demands, reason } = releaseInfo;
                    if (demands && demands.length > 0) {
                        if (demands[0].demand_link.includes('jira')) {
                            result.紧急发布原因 = '线上问题修复';
                            result.具体原因 = demands[0].demand_link;
                        } else if (demands[0].demand_link.includes('xiaolv')) {
                            result.紧急发布原因 = '业务需求发布';
                            result.具体原因 = demands[0].demand_link;
                        }
                    } else if (reason) {
                        if (reason.includes('修复')) {
                            result.紧急发布原因 = '线上问题修复';
                            result.具体原因 = reason;
                        }
                    } else {
                        result.紧急发布原因 = '其他';
                    }
                    return result;
                })
                const updateData = releaseList.map((item, index) => {
                    item.fields = data[index]
                    return item;
                });

                batchUpdateReleaseData(updateData).then(res => console.log(res))
            })
        })
    }



    craeteFetchBtn();
})();
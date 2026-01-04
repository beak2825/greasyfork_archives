// ==UserScript==
// @name         performance grant privilege
// @namespace    http://tampermonkey.net/
// @version      0.0.3-beta
// @description  绩效系统查看全部人员
// @author       junliang.li
// @match        http://rt-pms.idc1.fn/*
// @run-at       document-start
// @grant        unsafeWindow
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/498318/performance%20grant%20privilege.user.js
// @updateURL https://update.greasyfork.org/scripts/498318/performance%20grant%20privilege.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //参考https://zhuanlan.zhihu.com/p/557532887
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            if (url === "http://performance-api.idc1.fn/rest/departmentUser/getRoleIdInfo") {
                const responseClone = response.clone();
                // let res = await responseClone.json();
                let obj = {
                    body: {
                        developNum: 2,
                        list: [
                            {deptId: 505, roleId: "1",},
                            {deptId: 505, roleId: "2",},
                            {deptId: 505, roleId: "3",},
                            {deptId: 505, roleId: "4",},
                            {deptId: 506, roleId: "1",},
                            {deptId: 506, roleId: "2",},
                            {deptId: 506, roleId: "3",},
                            {deptId: 506, roleId: "4",},
                            {deptId: 507, roleId: "1",},
                            {deptId: 507, roleId: "2",},
                            {deptId: 507, roleId: "3",},
                            {deptId: 507, roleId: "4",},
                            {deptId: 508, roleId: "1",},
                            {deptId: 508, roleId: "2",},
                            {deptId: 508, roleId: "3",},
                            {deptId: 508, roleId: "4",},
                            {deptId: 509, roleId: "1",},
                            {deptId: 509, roleId: "2",},
                            {deptId: 509, roleId: "3",},
                            {deptId: 509, roleId: "4",},
                        ],
                        opmNum: 0,
                        testNum: 2,
                    }, msg: "处理成功", rsCode: "00000000",
                };
                const responseNew = new Response(JSON.stringify(obj), response);
                return responseNew;
            } else if (url === "http://performance-api.idc1.fn/rest/users/getUserinfoByEmpId") {
                const responseClone = response.clone();
                let res = await responseClone.json();
                res.body.levelList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
                res.body.manageDeptIds = ["505", "506", "507", "508", "509"];
                res.body.showScoreLeader = true;
                res.body.showTrain = true;
                const responseNew = new Response(JSON.stringify(res), response);
                return responseNew;
            } else {
                return response;
            }
        });
    };
})();

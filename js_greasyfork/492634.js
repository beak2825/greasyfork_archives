// ==UserScript==
// @name         容器云跳转
// @version      0.1.1
// @description  ZCloud
// @match        *://*.ztecloud.zte.com.cn/*
// @match        *://zcloud.zte.com.cn/*
// @match        *://msp.zte.com.cn/*
// @match        *://mspuat.zte.com.cn/*
// @namespace https://greasyfork.org/users/1288794
// @downloadURL https://update.greasyfork.org/scripts/492634/%E5%AE%B9%E5%99%A8%E4%BA%91%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/492634/%E5%AE%B9%E5%99%A8%E4%BA%91%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tenantId = "100000459651";
    const services = [
        "zte-paas-lcap-demoapi",
        "zte-paas-lcap-promcapi",
        "zte-paas-lcap-promgrapi",
        "zte-paas-lcap-demobff",
        "zte-paas-lcap-promgrbff",
        "zte-paas-lcap-promcbff"
    ];

    const MSP_UAT_HOST = "mspuat.zte.com.cn";
    const MSP_PROD_HOST = "msp.zte.com.cn"

    let mspHost;

    function main () {
        switch (location.host) {
            case "msp.zte.com.cn":
            case "mspuat.zte.com.cn":
                mspHost = location.host;
                loadServiceList();
                break;
            case "zcloud.zte.com.cn":
                mspHost = "msp.zte.com.cn";
                break;
            case "uat.ztecloud.zte.com.cn":
                mspHost = "mspuat.zte.com.cn";
                break;
        }

        var t = null;
        t = setInterval(() => {
            var project = document.querySelector(`li.ptl-tenant-tecs-list-item[tenantid='${tenantId}']`);
            if (project) {
                project.click();
                clearInterval(t);

                loadServiceList();
            }
        }, 500);
    }

    function loadServiceList() {
        const empNo = getCookie("ZTEDPGSSOUser")
        const authVal = getCookie("ZTEDPGSSOCookie")
        addExtensionBtns(services.map(s => {
            return {
                text: s,
                onclick: () => {
                    let ret = send("POST", `https://${mspHost}/zte-paas-msp-esmconsolebff/zte-paas-msp-service/services/`, {
                            "X-Lang-Id": "zh_CN",
                            "X-Emp-No": empNo,
                            "X-Auth-Value": authVal,
                            "X-Project-Id": tenantId,
                            "x-msp-region": "cn-shenzhen"
                        }, {
                            "bo": {
                                "projectId": tenantId,
                                "appId":"",
                                "appInstId":"",
                                "serviceName":s,
                                "status":"",
                                "serviceType":"",
                                "healthyStatus":"",
                                "isAllServIns":true,
                                "envInstId":"",
                                "page":1,"rows":11
                            },
                            "page":1,
                            "rows":1
                    });

                    let svcId = ret.bo[0].id;
                    location = `https://${mspHost}/zte-paas-msp-esmportal/#/svc/newInserviceDetails?svcCode=${s}&isSub=1&svcId=${svcId}`;
                }
            };
        }));
    }

    function getCookie(key) {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        let result = "";
        cookies.forEach(cookie => {
            const [name, value] = cookie.trim().split('=')
            if (name.includes(key)) {
                result = value;
            }
        })
        return result;
    }

    function send(method, path, headers, body) {
        var resp;

        var req = new XMLHttpRequest();
        req.open(method, path, false);

        if (headers) {
            for (var k in headers) {
                req.setRequestHeader(k, headers[k]);
            }
        }
        if (body) {
            req.setRequestHeader("content-type", "application/json");
        }
        req.onreadystatechange = () => {
            if (req.status == 200) {
                try {
                    resp = req.responseText
                        ? JSON.parse(req.responseText)
                        : null;
                } catch {
                    resp = req.responseText;
                }
            }
        };

        body
            ? req.send(JSON.stringify(body))
            : req.send();
        return resp;
    };

    function addExtensionBtns(btns, targetDocu) {
        if (!targetDocu) {
            targetDocu = document;
        }

        if (targetDocu.querySelector("#xPanel")) return;

        var panel = targetDocu.createElement("div");
        panel.id = "xPanel";
        panel.style.position = "fixed";
        panel.style.top = "0";
        panel.style.left = "800px";
        panel.style.zIndex = "99999";
        targetDocu.body.appendChild(panel);

        if (btns.length == 1) {
            var btn = targetDocu.createElement("button");
            btn.style.borderWidth = "1px";
            btn.style.borderColor = "black";
            btn.style.borderStyle = "solid";
            btn.innerText = btns[0].text;
            btn.onclick = btns[0].onclick;
            panel.appendChild(btn);
            return;
        }

        var select = targetDocu.createElement("select");
        select.style.width = "100px";
        select.style.height = "18px";

        select.onchange = function () {
            try {
                for (var i = 0; i < btns.length; ++i) {
                    if (btns[i].text == select.value) {
                        console.info("i=" + i + ", text=" + btns[i].text);
                        btns[i].onclick();
                        break;
                    }
                }
            } finally {
                select.selectedIndex = 0;
            }
        };

        var inner = '<option />';
        for (var i = 0; i < btns.length; ++i) {
            inner += "<option value='" + btns[i].text + "'>" + btns[i].text + "</option>";
        }
        select.innerHTML = inner;

        panel.appendChild(select);
    }

    main();
})();

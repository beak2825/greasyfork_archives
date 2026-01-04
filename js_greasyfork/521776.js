// ==UserScript==
// @name         预定单统计
// @version      20241225.2154
// @description  销售订单_新鲜奶根据同步类型统计单据比例
// @author       qhq
// @match        http://172.16.1.104:8080/dist/*
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @icon        data:image/x-icon;base64,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/////////////+Lj+f+cl+z//////+fn+v9kWOH////////////4+f3/OSfY/y4W1v8tFtaKLhbW/y4W1v9GNtv/ioLo/9vb+P//////al7i/y4W1v8uFtb/LhbW/7278v/+/v7/m5Ts/4qC6P9iVOD/LhbW/zIh1//8/P7/+/v+/+rt+//3+P3//////2Nc4f/v7/z/7/H8/zgo2P+EfOf/3d74//z9/v9FM9r/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/hn7n//////+XkOv/LhbW/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/Z1/j/OirY/7a28f//////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v9bTt///v7+/8TC8/8uFtb/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/zom2P/29/3/6+z7/zId1/8uFtb/LhbW/7278v/+/v7/Szfb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n/+vr+/73A8/+7vvL/6+37//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v8uFtb/LhbW/9jZ9//+/v7/TDzc/y4W1v8uFtb/vbvy//7+/v9LN9v/LhbW/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f///////////////////////P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/y4W1v8uFtb/r6vv//////92bOT/LhbW/y4W1v+9u/L//v7+/0s32/8uFtb/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5//f4/f+Zmuv/l5br/+Di+f/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v9vZeP/4N75/+De+f/w8Pz//////+7t+//g3vn/4N75//X1/f/+/v7/5eP6/+De+f+Tier/LhbW/zIh1//8/P7/+fn9/+De+f/09Pz//////1JF3f/j4/n/7/H8/zIe1/8uFtb/wcHz//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/5iQ6////////////////////////////////////////////////////////////6Wb7f8uFtb/MiHX//z8/v//////////////////////UkXd/+Pj+f/v8fz/Mh7X/y4W1v/BwfP//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/Py7Z/3hu5f95b+X/eW/l/3lv5f+vrfD//////6+t8P95b+X/eW/l/3lv5f95b+X/WEne/y4W1v8yIdf//Pz+/+Xk+v95b+X/zs71//////9SRd3/4+P5//n6/v+ytfD/sLPw/+jq+v/8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/0g22/9aSt//RjTb/4J65///////gnrn/0Y02/9aSt//SDbb/y4W1v8uFtb/LhbW/zIh1//8/P7/1tT3/y4W1v+xr/D//////1JF3f/j4/n///////////////////////z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/y4W1v83JNj/6er7//z9/v/a2/j/g33n//////+Dfef/2dv4//z9/v/p6/v/NyPY/y4W1v8uFtb/MiHX//z8/v/W1Pf/LhbW/7Gv8P//////UkXd/+Pj+f/4+f3/o6Xt/6Gh7f/k5vr//P3+/0Y02/8uFtb/LRbWii4W1v8uFtb/LhbW/3ty5f/+/v7//P3+/8jJ9P+Ce+f//////4J85//HyPT//P3+//7+/v97cuX/LhbW/y4W1v8yIdf//Pz+/9bU9/8uFtb/sa/w//////9SRd3/4+P5/+/x/P8yHtf/LhbW/8HB8//8/f7/RjTb/y4W1v8tFtaKLhbW/y4W1v8uF9b/0ND2//////9+dub/Mx3X/4J65///////gnrn/zMd1/9+dub//////9DQ9v8uFtb/LhbW/zIh1//8/P7/1tT3/4R/5//s7vv//////1JF3f/j4/n/7/H8/zYm2P9CN9r/yMr0//z9/v9GNNv/LhbW/y0W1oouFtb/LhbW/1ZI3v/9/f7/5+j6/zUg1/8uFtb/gnrn//////+Ceuf/LhbW/zQg1//n6Pr//f3+/1ZI3v8uFtb/MiHX//z8/v/W1Pf/wr7z///////+/v7/Szzc/+Pj+f/v8fz/oqHt//j5/f/9/f7//P3+/0Uz2v8uFtb/LRbWii4W1v8uFtb/VUve/4OA5/9jWuH/LhbW/y4W1v+Ceuf//////4J65/8uFtb/LhbW/2Na4f+DgOf/VUve/y4W1v8wG9b/gn/n/3Nt5P9VR97/g4Dn/3dx5f8vGNb/4+P5/+/x/P+mpe7////////////r7fv/NCDX/y4W1v8tFtaKLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/zcm2P9EO9v/NybY/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v9BNtr/Qjna/zMg1/9EO9v/RDvb/zor2P8uFtb/LhbW/y4W1YguFtbcLhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbWZi4W1l4tFtb4LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1v8uFtb/LhbW/y4W1tAuFtYO//x////AA//+AAD/+AAAP/AAAA/gAAAHwAAAA4AAAAEAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYAAAAE=
// @grant     unsafeWindow
// @run-at    document-start
// @namespace https://greasyfork.org/users/9065
// @downloadURL https://update.greasyfork.org/scripts/521776/%E9%A2%84%E5%AE%9A%E5%8D%95%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/521776/%E9%A2%84%E5%AE%9A%E5%8D%95%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function executeScript() {
        if (!window.location.hash.includes('/1250/operate')) {
            return;
        }

        function addXMLRequestCallback(callback) {
            var oldSend, i;
            if (XMLHttpRequest.callbacks) {
                XMLHttpRequest.callbacks.push(callback);
            } else {
                XMLHttpRequest.callbacks = [callback];
                oldSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function () {
                    for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                        XMLHttpRequest.callbacks[i](this);
                    }
                    oldSend.apply(this, arguments);
                };
            }
        }

        // Add callback to handle the specific request
        addXMLRequestCallback(function (xhr) {
            xhr.addEventListener("load", function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    if (xhr.responseURL.includes('danju/getliebiaodata') && window.location.hash.includes('/1250/operate')) {
                        const data = JSON.parse(xhr.responseText);
                        if (data.code === "1" && data.liebiao && data.liebiao.length > 0) {
                            const tongbuzhuangtaiCounts = {};
                            const totalCount = data.liebiao.length;
                            data.liebiao.forEach(item => {
                                const status = item.tongbuzhuangtai;
                                if (!tongbuzhuangtaiCounts[status]) {
                                    tongbuzhuangtaiCounts[status] = {
                                        count: 0,
                                        details: new Set() // Use a Set to ensure uniqueness
                                    };
                                }
                                tongbuzhuangtaiCounts[status].count++;
                                tongbuzhuangtaiCounts[status].details.add(`${item.lsjiancheng} - ${item.lsyewuyuan}`);
                            });

                            let overlayHtml = '<div id="overlayContent" style="background: white; padding: 20px; border-radius: 5px; max-width: 80%; min-width: 500px; max-height: 80%; overflow-y: auto; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); z-index: 9999;">';
                            overlayHtml += '<button id="closeOverlay" style="position: absolute; top: 10px; right: 10px; font-size: 16px; padding: 5px 10px; background-color: #f44336; color: white; border: none; cursor: pointer;">关闭</button>';
                            overlayHtml += '<table border="1" cellpadding="5" cellspacing="0" style="width: 100%; border-collapse: collapse; margin-top: 20px;">';
                            overlayHtml += '<thead><tr><th>同步状态</th><th>单据数</th><th>比例</th><th>详细信息</th></tr></thead>';
                            overlayHtml += '<tbody>';

                            for (const status in tongbuzhuangtaiCounts) {
                                const count = tongbuzhuangtaiCounts[status].count;
                                const proportion = ((count / totalCount) * 100).toFixed(2);
                                let detailsHtml = '';
                                let uniqueDetails = Array.from(tongbuzhuangtaiCounts[status].details);
                                uniqueDetails.forEach(detail => {
                                    const [lsjiancheng, lsyewuyuan] = detail.split(" - ");
                                    detailsHtml += `<tr><td colspan="2">${lsjiancheng}</td><td colspan="2">${lsyewuyuan}</td></tr>`;
                                });

                                overlayHtml += `<tr><td>${status}</td><td>${count}</td><td>${proportion}%</td><td><table border="1" style="width: 100%;"><tbody>${detailsHtml}</tbody></table></td></tr>`;
                            }

                            overlayHtml += '</tbody></table></div>';

                            $('body').append(overlayHtml);

                            // Use event delegation to ensure proper binding
                            $('body').on('click', '#closeOverlay', function () {
                                $('#overlayContent').remove();
                            });
                        }
                    }
                }
            });
        });
    }

    // Listen for hash changes
    window.onhashchange = executeScript;

})();

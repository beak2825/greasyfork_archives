// ==UserScript==
// @name         scnu教务系统优化
// @namespace    https://jkey104.gitee.io/
// @version      2.2
// @description  华南师范大学新教务系统优化
// @author       Jkey
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=*
// @match        https://jwxt.scnu.edu.cn/cjcx*
// @match        https://jwxt.scnu.edu.cn/cdjy*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/429102/scnu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/429102/scnu%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const skipWaiting = function(clickFun) {
        $("#badge_text").remove();
        const btn = $("#btn_yd");
        btn.removeAttr("disabled");
        btn.addClass("btn-primary");
        btn.click(clickFun);
    }

    var localAddress = location.href;

    // 登录界面跳过5秒
    if (localAddress.indexOf("initMenu") > -1) {
        if (document.getElementById('btn_yd')) {
            skipWaiting(() => {
                window.location.href = _path + '/xtgl/login_loginIndex.html';
            });
        }
    }

    // 预约教室页面跳过5秒等待
    else if (localAddress.indexOf("cdjy") > -1 && document.getElementById('btn_yd')) {
        skipWaiting(() => {
            let gnmkdmKey = $('input#gnmkdmKey').val();
            //全局文档添加参数
            $(document).data("offDetails", "1");
            //加载功能主页：且添加不再进入提示信息页面的标记字段
            onClickMenu.call(this, '/cdjy/cdjy_cxCdjyIndex.html?doType=details', gnmkdmKey, { "offDetails": "1" });
        });
    }

    // 成绩查询界面加入自动计算绩点
    else if (localAddress.indexOf("cjcx") > -1) {
        // 添加绩点span
        var newTextNode = document.createElement("span");
        newTextNode.innerText = "平均绩点：加载中";
        newTextNode.id = "avgGPA";
        $("#yhgnPage").append(newTextNode);

        // 监听函数
        const observeChange = function() {
            let observer = new MutationObserver(function () {
                // console.log("发生了改变");
                if (document.getElementById("load_tabGrid").style.display === "none") {
                    setGPA();
                    observer.disconnect();
                }
            });
            observer.observe(document.getElementById("load_tabGrid"), { attributes: true, attributeFilter: ['style'] });
        }

        // 首次进入
        observeChange();
        // 监听查询按钮
        document.getElementById("search_go").onclick = function () {
            // console.log("点击");
            newTextNode.innerText = '平均绩点：加载中';
            observeChange();
        }
    }

    function setGPA() {
        var page = Number(document.getElementById('sp_1_pager').innerText);
        if (page <= 0) {
            $("span#avgGPA").text('平均绩点：暂无成绩');
            return;
        } else if (page === 1) {
            var sumCredit = 0, GPA = 0;
            var credits_grades = $("td[aria-describedby='tabGrid_xfjd']");
            var credits = $("td[aria-describedby='tabGrid_xf']");
            for (let i = 0; i < credits.length; i++) {
                sumCredit += Number(credits[i].innerText);
                GPA += Number(credits_grades[i].innerText);
            }
            GPA /= sumCredit;
            $("span#avgGPA").text('平均绩点：' + GPA.toFixed(2));
            return;
        }
        var gnmkdm = $('input#gnmkdmKey').val();
        var user = $('input#sessionUserKey').val();
        var nd = Date.now();
        var xqm = document.getElementById("xqm");
        var xqm_val = xqm[xqm.selectedIndex].value;
        var xnm = document.getElementById("xnm");
        var xnm_val = xnm[xnm.selectedIndex].value;
        // 发送请求
        fetch('https://jwxt.scnu.edu.cn' + ($("#jsxx").val() == "xs"?'/cjcx/cjcx_cxXsgrcj.html':'/cjcx/cjcx_cxDgXscj.html') + '?doType=query&gnmkdm=' + gnmkdm + '&su=' + user, {
            "headers": {
                "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            "body": "xnm=" + xnm_val + "&xqm=" + xqm_val + "&_search=false&nd=" + nd + "&queryModel.showCount=100&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc",
            "method": "POST"
        }).then(response => response.json()).then(data => {
            let sumCredit = 0, GPA = 0;
            // console.log(data)
            for (let item of data.items) {
                sumCredit += Number(item.xf);
                GPA += Number(item.xfjd);
            }
            GPA /= sumCredit;
            $("span#avgGPA").text('平均绩点：' + GPA.toFixed(2));
        });
    }
})();
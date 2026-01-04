// ==UserScript==
// @name         SCNU教务系统绩点计算
// @namespace    http://tampermonkey.net/
// @version      3.5.0
// @description  支持功能：跳过5s等待并自动确认，计算小数点后三位绩点、百分制成绩和学分，始终保持所有课程展示在同一页，新增快捷查分入口，选择学年学期自动更新数据，无需点击查询
// @author       Ruofan Liao & Jkey & Dandelion
// @github       https://github.com/LLLLLrf/GPA-Calculate/tree/main
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html
// @match        https://jwxt.scnu.edu.cn/xtgl/index_initMenu.html?jsdm=*
// @match        https://jwxt.scnu.edu.cn/cjcx*
// @match        https://jwxt.scnu.edu.cn/cdjy*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GPL
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/484926/SCNU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/484926/SCNU%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.meta.js
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
    // if (localAddress.indexOf("initMenu") > -1 && document.getElementByClassName('navbar-nav')){
    if (document.getElementsByClassName('navbar-nav')){
        var searchButton = document.createElement("span");
        // 设置成绩查询按钮样式
        searchButton.style.backgroundColor="#ffb300ff";
        searchButton.style.padding='14px';
        searchButton.style.color='white';
        searchButton.style.fontWeight='bold';
        searchButton.style.borderRadius='6px';
        searchButton.style.cursor='pointer';

        searchButton.onclick = function() {
            clickMenu('N305005', '/cjcx/cjcx_cxDgXscj.html', '学生成绩查询', 'null');
            return false;
        };
        searchButton.innerText=" 成绩查询 ";

        $(".navbar-nav:eq(2)").append(searchButton);
    }

    // 登录界面跳过5秒
    if (localAddress.indexOf("initMenu") > -1 && document.getElementById('btn_yd')) {
        if (document.getElementById('btn_yd')) {
            skipWaiting(() => {
                window.location.href = _path + '/xtgl/login_loginIndex.html';
            });
            document.getElementById('btn_yd').click();
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
        var newTextNode2 = document.createElement("span");
        newTextNode.innerText = "平均绩点：加载中";
        newTextNode.id = "avgGPA";
        newTextNode2.innerText="总学分：加载中";
        newTextNode2.id="sumCredit";
        newTextNode2.style.marginLeft='10px';
        $("#yhgnPage").append(newTextNode);
        $("#yhgnPage").append(newTextNode2);
        // 添加百分制成绩显示
        var newTextNode3 = document.createElement("span");
        newTextNode3.innerText = "百分制成绩：加载中";
        newTextNode3.id = "avgScore";
        newTextNode3.style.marginLeft = '10px';
        $("#yhgnPage").append(newTextNode3);
        // 设置每页最多显示1000条并触发刷新
        var pgs = $('.ui-pg-selbox');
        if (pgs.length) {
            pgs.val('1000').trigger('change');
        }
        // 监听加载状态，当从加载中切换为加载完成时触发计算
        const observeChange = function() {
            const loadDiv = document.getElementById("load_tabGrid");
            if (!loadDiv) return;
            let prev = loadDiv.style.display;
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'style') {
                        const curr = loadDiv.style.display;
                        if (prev === 'block' && curr === 'none') {
                            setGPA();
                        }
                        prev = curr;
                    }
                });
            });
            observer.observe(loadDiv, { attributes: true, attributeFilter: ['style'] });
        }

        // 首次进入
        observeChange();

        document.getElementById("search_go").onclick = function () {
            // 点击查询时，显示加载中状态
            newTextNode.innerText = '平均绩点：加载中';
            newTextNode2.innerText = '总学分：加载中';
            newTextNode3.innerText = '百分制成绩：加载中';
            observeChange();
        }

        $("#xnm").on("change", function () {
            document.getElementById("search_go").click();
        });
        $("#xqm").on("change", function () {
            document.getElementById("search_go").click();
        });
    }

    function setGPA() {
        var page = Number(document.getElementById('sp_1_pager').innerText);

        if (page <= 0) {
            $("span#avgGPA").text('平均绩点：暂无成绩');
            $("span#sumCredit").text('总学分：暂无');
            $("span#avgScore").text('百分制成绩：暂无');
            return;
        } else if (page === 1) {
            var sumCredit = 0, GPA = 0;
            // 加权成绩总和
            var weightedScoreSum = 0;
            var credits_grades = $("td[aria-describedby='tabGrid_xfjd']");
            var credits = $("td[aria-describedby='tabGrid_xf']");
            var courseList=new Array();
            var cj = $("td[aria-describedby='tabGrid_cj']");
            var course=$("td[aria-describedby='tabGrid_kcmc']");
            for (let i = 0; i < credits.length; i++) {
                if (Number(credits[i].innerText)!==0.00 && Number(credits_grades[i].innerText)!==0.00){
                    if(cj[i].innerText=="缓考"||cj[i].innerText=="通过"||cj[i].innerText=="免修"){
                        continue;
                    }else{
                        sumCredit += Number(credits[i].innerText);
                        GPA += Number(credits_grades[i].innerText);
                        courseList[i] = course[i].innerText;
                        // 按学分加权成绩
                        var scoreText = cj[i].innerText.trim();
                        if (/^\d+(\.\d+)?$/.test(scoreText)) {
                            var score = parseFloat(scoreText);
                            weightedScoreSum += score * Number(credits[i].innerText);
                        }
                    }
                }
            }
            GPA /= sumCredit;
            // 加权百分制成绩
            var avgScore = sumCredit > 0 ? weightedScoreSum / sumCredit : 0;
            $("span#avgGPA").text('平均绩点：' + GPA.toFixed(3));
            $("span#sumCredit").text('总学分：' + sumCredit.toFixed(2));
            $("span#avgScore").text('百分制成绩：' + avgScore.toFixed(2));
            return;
        }
        var gnmkdm = $('input#gnmkdmKey').val();
        var user = $('input#sessionUserKey').val();
        var nd = Date.now();
        var xqm = document.getElementById("xqm");
        var xqm_val = xqm[xqm.selectedIndex].value;
        var xnm = document.getElementById("xnm");
        var xnm_val = xnm[xnm.selectedIndex].value;
        // 发送请求并获取所有数据，计算绩点和总学分
        fetch('https://jwxt.scnu.edu.cn' + ($("#jsxx").val() === "xs" ? '/cjcx/cjcx_cxXsgrcj.html' : '/cjcx/cjcx_cxDgXscj.html') + '?doType=query&gnmkdm=' + gnmkdm + '&su=' + user, {
            headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: 'xnm=' + xnm_val + '&xqm=' + xqm_val + '&_search=false&nd=' + nd + '&queryModel.showCount=1000&queryModel.currentPage=1&queryModel.sortName=&queryModel.sortOrder=asc',
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            var sumCredit = 0, totalGPA = 0;
            var sumScore = 0, countScore = 0;
            if (data && data.rows) {
                data.rows.forEach(function(row) {
                    var xf = parseFloat(row.xf);
                    var xfjd = parseFloat(row.xfjd);
                    var cj = row.cj;
                    if (!isNaN(xf) && xf > 0 && !isNaN(xfjd) && xfjd > 0) {
                        if (cj === '缓考' || cj === '通过' || cj === '免修') return;
                        sumCredit += xf;
                        totalGPA += xfjd;
                        // 累计成绩 
                        var scoreText = String(row.cj).trim();
                        if (/^\d+(\.\d+)?$/.test(scoreText)) {
                            var score = parseFloat(scoreText);
                            sumScore += score;
                            countScore++;
                        }
                    }
                });
            }
            var avg = sumCredit > 0 ? totalGPA / sumCredit : 0;
            var avgScore = countScore > 0 ? sumScore / countScore : 0;
            $("span#avgGPA").text('平均绩点：' + avg.toFixed(3));
            $("span#sumCredit").text('总学分：' + sumCredit.toFixed(2));
            $("span#avgScore").text('百分制成绩：' + avgScore.toFixed(2));
        });
    }
})();

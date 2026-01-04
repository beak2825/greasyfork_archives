// ==UserScript==
// @name         小猿集装箱1.0.0
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  一揽子计划
// @author       Lu
// @match        https://xyzb.yuanfudao.com/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @license       MIT License
// @downloadURL https://update.greasyfork.org/scripts/471438/%E5%B0%8F%E7%8C%BF%E9%9B%86%E8%A3%85%E7%AE%B1100.user.js
// @updateURL https://update.greasyfork.org/scripts/471438/%E5%B0%8F%E7%8C%BF%E9%9B%86%E8%A3%85%E7%AE%B1100.meta.js
// ==/UserScript==

(function () {
    'use strict';
    $(document).ready(function () {
        let pageMoney = 0
        let pagePassing = 0
        let wipList = [];
        let mySalaryWay = 0;

        let Interval = setInterval(function () {
            // 任务广场
            // if (window.location.href.indexOf("task/main") != -1 && $('#MyOperationArea').length <= 0) {
                // $(".without-nav-page").append(`
                // <div id="MyOperationArea">
                //     <div class="AreaItem">  </div>
                // </div>
                // `)
                // $(".AreaItem").click(()=>{

                // })
                // $("#MyOperationArea").css({
                //     "position":"absolute",
                //     "left":"1%",
                //     "color":"#24acf2"
                // })
            // }
            // 标注界面
            if (window.location.href.indexOf("copy-task-detail?") != -1) {
                $(".edui-body-container").css({ "height": "100%", "min-height": "180px" })
                if (document.getElementsByClassName("about-container")[0]) {
                    document.getElementsByClassName("about-container")[0].style.display = 'none'
                }
            }
            // 答案页面
            if (window.location.href.indexOf("copy-task-detail-result") != -1) {
                if (document.getElementsByClassName("result")[0]) {
                    document.getElementsByClassName("result")[0].style.display = 'none'
                }
                if (document.getElementsByClassName("about-container")[0]) {
                    document.getElementsByClassName("about-container")[0].style.display = 'none'
                }
                if (document.getElementsByClassName("container")[0]) {
                    document.getElementsByClassName("container")[0].style.height = '100vh'
                }
            }
            // 任务进度
            if (window.location.href.indexOf("task_schedule") != -1) {
                // 进行中
                if ($(".ant-tabs-nav .ant-tabs-tab:eq(0)").hasClass("ant-tabs-tab-active") == true) {
                    if ($(".ant-tabs-content .ant-tabs-tabpane:eq(0) .ant-table-thead:eq(1) .ant-table-row-cell-break-word:eq(0) .ant-table-column-title").text() == "操作") {
                        $(".ant-tabs-content .ant-tabs-tabpane:eq(0) .ant-table-thead:eq(1) .ant-table-row-cell-break-word:eq(0) .ant-table-column-title").replaceWith('<span class="ant-table-column-title" id="look-quality" style="cursor: pointer;color: #24acf2;font-weight:bold">→→查看质量←←</span>')
                        $('#look-quality').click(function () {
                            lookQuality()
                        })
                    }
                }
                // 审核中
                if ($(".ant-tabs-nav .ant-tabs-tab:eq(1)").hasClass("ant-tabs-tab-active") == true && $(".markSalary").length <= 0) {
                    $.ajax({
                        url:"https://xyzb.yuanfudao.com/orion-bee-task/api/packages/auditing?page=0&pageSize=100",
                        type:'get',
                        dataType:'JSON',
                        contentType:'application/json',
                        xhrFields:{
                            withCredentials:true
                        },
                        success:function(data){
                            let auditingList = JSON.parse(JSON.stringify(data)).result.list;
                            for (let i = 0; i < $(".ant-tabs-tabpane:eq(1) .ant-table-scroll .ant-table-body .ant-table-tbody .ant-table-row").length; i++) {
                                let bagId = $(".ant-tabs-tabpane:eq(1) .ant-table-scroll .ant-table-body .ant-table-tbody .ant-table-row:eq("+i+") .ant-table-row-cell-break-word:eq(0)").text()
                                auditingList.forEach(ele => {
                                    if(ele.id == bagId){
                                        $(".ant-tabs-tabpane:eq(1) .ant-table-scroll .ant-table-body .ant-table-tbody .ant-table-row:eq("+i+") .ant-table-row-cell-break-word:eq(0) .type").append("<span class='markSalary' style='color:#24acf2'> 已结算"+ ele.realisticSalary + "元</span>")
                                    }
                                });
                            }
                        }
                    })
                }
                // 已结束
                if ($(".ant-tabs-nav .ant-tabs-tab:eq(2)").hasClass("ant-tabs-tab-active") == true) {
                    let main = $(".ant-tabs-tabpane:eq(2) .ant-table-scroll .ant-table-body .ant-table-tbody").children();
                    let num = 0;
                    let strip = main.length;
                    let passingRate = 0;
                    for (let i = 0; i < main.length; i++) {
                        num += (+main[i].children[7].textContent.slice(3).trim())

                        if (main[i].children[6].textContent.slice(0, -1).trim() == "") {
                            strip -= 1
                        } else if (main[i].children[6].textContent.slice(0, -1).trim() == 100 && main[i].children[7].textContent.slice(0, -1).trim() == "¥ 0.0") {
                            strip -= 1
                        } else {
                            passingRate += (+main[i].children[6].textContent.slice(0, -1).trim())
                        }
                    };

                    if (pageMoney != num.toFixed(2)) {
                        pageMoney = num.toFixed(2)
                        $(".ant-tabs-content .ant-tabs-tabpane:eq(2) .ant-table-thead:eq(0) .ant-table-row-cell-break-word:eq(7) .ant-table-column-title").replaceWith('<span class="ant-table-column-title" style="color:#24acf2">本页薪资：' + pageMoney + '元</span>')
                    }
                    let nowPassing = 0
                    if (strip != 0) {
                        nowPassing = (passingRate / strip).toFixed(2)
                    }
                    if (pagePassing != nowPassing) {
                        pagePassing = nowPassing
                        $(".ant-tabs-content .ant-tabs-tabpane:eq(2) .ant-table-thead:eq(0) .ant-table-row-cell-break-word:eq(6) .ant-table-column-title").replaceWith('<span class="ant-table-column-title" style="color:#24acf2">本页通过率：' + pagePassing + '%</span>')
                    }
                }
            }
            // 我的收入
            if(window.location.href.indexOf("income") != -1 && window.location.href.indexOf("income?") == -1 && $('#MyIncome').length <= 0){
                let thisMonth = (+$(".statistic-number:eq(1)").text())
                if(mySalaryWay == 1 && thisMonth){
                    if(thisMonth <= 800){
                        $(".statistic-item:eq(1)").append(`
                        <div id="MyIncome">
                            <div>税后：${(thisMonth).toFixed(2)}</div>
                            <div>快抓紧做哇，这点钱哪够呀</div>
                        </div>`)
                    }else if(thisMonth > 800 && thisMonth <= 4000){
                        $(".statistic-item:eq(1)").append(`
                        <div id="MyIncome">
                            <div>税后：${((thisMonth*0.8) + 160).toFixed(2)}</div>
                            <div>这点钱也还行，继续加油吧</div>
                        </div>`)
                    }else if(thisMonth > 4000){
                        $(".statistic-item:eq(1)").append(`
                        <div id="MyIncome">
                            <div>税后：${(thisMonth*0.84).toFixed(2)}</div>
                            <div>卧槽？这月做不少哇，厉害</div>
                        </div>`)
                    }
                }else if(mySalaryWay == 2 && thisMonth){
                    $(".statistic-item:eq(1)").append(`
                    <div id="MyIncome">
                        <div>扣掉手续费后：${(+thisMonth*0.93).toFixed(2) || 0}</div>
                        <div>摆烂~摆烂~摆烂~摆烂~摆烂</div>
                    </div>`)    
                }
                $('#MyIncome').css({"position":"absolute","left":"45%","color":"#24acf2"})
            }
        }, 500)

        function lookQuality() {
            $.ajax({
                url: 'https://xyzb.yuanfudao.com/orion-bee-task/api/packages/wip?page=0&pageSize=100',
                type: 'get',
                dataType: 'JSON',
                contentType: "application/json",
                xhrFields: {
                    withCredentials: true
                },
                success: function (data) {
                    let Data = JSON.parse(JSON.stringify(data));
                    if (Data.code == "200") {
                        wipList = Data.result.list;
                        let num = window.prompt("检测到您有 " + wipList.length + " 个包，请输入您要看第几个包的数据！(ps:仅填写数字)");
                        if (num > 0 && num <= wipList.length) {
                            let pageAllId = [];
                            wipList[num - 1].tasks.forEach(ele => {
                                pageAllId.push(ele.sourceId);
                            });
                            pageAllId.forEach(ele => {
                                $.ajax({
                                    url: 'https://xyzb.yuanfudao.com/leo-cms-transcribe/api/crowdsource/' + ele,
                                    type: 'get',
                                    dataType: 'JSON',
                                    contentType: "application/json",
                                    xhrFields: {
                                        withCredentials: true
                                    },
                                    success: function (data) {
                                        window.open(JSON.parse(JSON.stringify(data)).result.materialInfo.imageUrl);
                                    },
                                });
                            });
                        } else {
                            console.log(num);
                            window.alert("你咋填的？重新来！！");
                        };
                    };
                }
            });
        }

        (function mySalaryWayFun() {
            $.ajax({
                url:"https://xyzb.yuanfudao.com/orion-bee-user/api/users/query/salaryProvideWay",
                type:'get',
                dataType:'JSON',
                contentType:'application/json',
                xhrFields:{
                    withCredentials:true
                },
                success:function(data){
                    mySalaryWay = JSON.parse(JSON.stringify(data)).result;
                }
            })
        }())

    })
    // Your code here...
})();


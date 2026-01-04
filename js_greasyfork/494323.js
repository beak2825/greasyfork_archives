// ==UserScript==
// @name         平安立信导出数据
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  导出
// @author       Bor1s
// @match        http://dtp.pplxamc.com.cn/yxdtp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pplxamc.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494323/%E5%B9%B3%E5%AE%89%E7%AB%8B%E4%BF%A1%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/494323/%E5%B9%B3%E5%AE%89%E7%AB%8B%E4%BF%A1%E5%AF%BC%E5%87%BA%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);

var yxdDtp = document.cookie.split('; ').find(row => row.startsWith('yxd-dtp='))?.split('=')[1];
var listinfo = '';
var arr = [];
var total = '';
setTimeout(function () {
    console.log('页面加载完成，油猴开始加载...')
    var targetElement = document.querySelector("#app > div > div.main-container > ul > div.right-menu");
    if (targetElement) {
        const buttonHTML = '<span id="exportEXCEL" style="margin-right:10px;position: relative;top: -15px;"><i class="el-icon-download"></i></span>';
        targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
        const button = document.querySelector("#exportEXCEL");
        button.addEventListener("click", function () {
            document.querySelector("#exportEXCEL").innerHTML = `<i class="el-icon-loading"></i>`;
            fetchData();
        });
    }
},5000);


function fetchData() {
    // 获取列表key信息
    fetch("http://dtp.pplxamc.com.cn/web/outward/getOnlineFileList?pageNo=1&pageSize=10", {
        method: "POST",
        headers: {
            "content-type": "application/json;charset=UTF-8",
            "yxd-dtp": yxdDtp
        },
        body: JSON.stringify({
            companyCodeList: [],
            fileName: "",
            businessDataTypeValues: [],
            uploadDateStart: "",
            uploadDateEnd: "",
            pageNo: 1,
            pageSize: 10
        }),
        credentials: "include"
    })
        .then(response => {
        return response.json();
    })
        .then(data => {
        //console.log(data.body.res[0]);
        listinfo = data.body.res[0];

        // 获取详细信息
        return fetch("http://dtp.pplxamc.com.cn/web/outward/getOnlineFilePreview?pageNo=1&pageSize=10", {
            method: "POST",
            headers: {
                "content-type": "application/json;charset=UTF-8",
                "yxd-dtp": yxdDtp
            },
            body: JSON.stringify({
                fileKey: listinfo.fileKey,
                idKey: listinfo.idKey,
                businessDataTypeValue: "1",
                pageNo: 1,
                pageSize: 10,
                customerName: "",
                idNo: "",
                area: "",
                assetCode: ""
            }),
            credentials: "include"
        });
    })
        .then(response => {
        return response.json();
    })
        .then(data => {
        total = data.body.total;

        // 定义每批次的大小
        var batchSize = 500;
        // 计算需要多少批次
        var batchCount = Math.ceil(total / batchSize);
        // 生成批次数组
        var batches = Array.from({ length: batchCount }, (_, index) => index + 1);

        // 逐批发送请求
        return batches.reduce((previousPromise, batchNumber) => {
            return previousPromise.then(results => {
                return fetch("http://dtp.pplxamc.com.cn/web/outward/getOnlineFilePreview?pageNo=" + batchNumber + "&pageSize=" + batchSize, {
                    method: "POST",
                    headers: {
                        "content-type": "application/json;charset=UTF-8",
                        "yxd-dtp": yxdDtp
                    },
                    body: JSON.stringify({
                        fileKey: listinfo.fileKey,
                        idKey: listinfo.idKey,
                        businessDataTypeValue: "1",
                        pageNo: batchNumber,
                        pageSize: batchSize,
                        customerName: "",
                        idNo: "",
                        area: "",
                        assetCode: ""
                    }),
                    credentials: "include"
                })
                    .then(response => response.json())
                    .then(data => {
                    results.push(data.body.res.tdata);
                    return results;
                });
            });
        }, Promise.resolve([]));
    })
        .then(allResults => {
        // 将所有批次的结果合并到arr中
        arr = allResults.flat();
        //console.log(arr); // 输出arr数组
        exportExcel();
    })
        .catch(error => {
        console.error(error);
    });
}


function exportExcel() {
    const customHeader = ["委外公司编码", "客户名称", "身份证号码", "本人手机号", "债权管理号", "最新债权委托金额", "户籍地址", "尚欠本金", "性别", "贷款日期", "逾期服务费", "逾期利息", "违约金", "案件包编号"];
    const formattedData = arr.map(item => {
        const data = {
            "委外公司编码": item.companyCode || '',
            "客户名称": item.customerName || '',
            "身份证号码": item.idNo || '',
            "本人手机号": item.mobile || '',
            "债权管理号": item.bondCode || '',
            "最新债权委托金额": item.lastLoanMoney || '',
            "户籍地址": item.permanentAddress || '',
            "尚欠本金": item.lastArrearsCorpus || '',
            "性别": item.gender || '',
            "贷款日期": item.loanDate || '',
            // "逾期滞纳金": item.overdueLateFee || '',
            // "逾期管理费": item.leftChargeFee || '',
            "逾期服务费": item.leftCstFeeMth || '',
            "逾期利息": item.overdueInterestAmt || '',
            "违约金": item.penalSum || '',
            // "手续费": item.serviceFee || '',
            // "复利": item.compoundInterest || '',
            "案件包编号": item.assetCode || '',
            // "案件地区": item.caseArea || ''
        };
        return data;
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: customHeader });
    worksheet['!cols'] = [
        { wch: 16 },//委外公司编码
        { wch: 10 },//客户名称
        { wch: 18 },//身份证
        { wch: 12 },//本人手机号
        { wch: 10 },//债权管理号
        { wch: 10 },//最新债权委托金额
        { wch: 20 },//户籍地址
        { wch: 10 },//尚欠本金
        { wch: 5 },//性别
        { wch: 10 },//贷款日期
        { wch: 10 },//逾期服务费
        { wch: 10 },//逾期利息
        { wch: 10 },//违约金
        { wch: 20 },//案件包编号
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_平安立信-导出数据.xlsx`);
    document.querySelector("#exportEXCEL").innerHTML = `<i class="el-icon-download"></i>`;
}

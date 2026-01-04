// ==UserScript==
// @name         信鸽管理系统
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  信鸽系统导出信息
// @license      MIT
// @author       Bor1s
// @match        https://os.xingeguanli.com/*
// @icon         https://os.xingeguanli.com/static/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489000/%E4%BF%A1%E9%B8%BD%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/489000/%E4%BF%A1%E9%B8%BD%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==





/*                            _ooOoo_
 *                           o8888888o
 *                           88" . "88
 *                           (| -_- |)
 *                            O\ = /O
 *                        ____/`---'\____
 *                      .   ' \\| |// `.
 *                       / \\||| : |||// \
 *                     / _||||| -:- |||||- \
 *                       | | \\\ - /// | |
 *                     | \_| ''\---/'' | |
 *                      \ .-\__ `-` ___/-. /
 *                   ___`. .' /--.--\ `. . __
 *                ."" '< `.___\_<|>_/___.' >'"".
 *               | | : `- \`.;`\ _ /`;.`/ - ` : | |
 *                 \ \ `-. \_ __\ /__ _/ .-` / /
 *         ======`-.____`-.___\_____/___.-`____.-'======
 *                            `=---='
 *
 *         .............................................
 *                  佛祖镇楼                  Bor1s
 *          佛曰:
 *                  写字楼里写字间，写字间里程序员；
 *                  程序人员写程序，又拿程序换酒钱。
 *                  酒醒只在网上坐，酒醉还来网下眠；
 *                  酒醉酒醒日复日，网上网下年复年。
 *                  但愿老死电脑间，不愿鞠躬老板前；
 *                  奔驰宝马贵者趣，公交自行程序员。
 *                  别人笑我忒疯癫，我笑自己命太贱；
 *                  不见满街漂亮妹，哪个归得程序员？
 */








//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);


var arr = [];
var count;
var token = localStorage.getItem('token').replace(/"/g, '');
window.onload = function(){
    console.log('页面加载完成，油猴开始加载...')
    var targetElement =document.querySelector("#app > section > div.fxn-body > header > div.fxn-header-left");
    if (targetElement) {
        const buttonHTML = '<span class="top__span none" style="margin-left:480px;font-size:18px" id="exportEXCEL"><i class="el-icon-download"></span>';
        targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
        const button = document.querySelector("#exportEXCEL");
        button.addEventListener("click", function() {
            fetchData(1);
            console.log("开始执行~")
        });
        button.oncontextmenu = function(e){
            return false
        }
    }
}
//主要
function fetchData(page) {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading">`;
    fetch("https://server.xingeguanli.com/osapi/Cases/caseInfo?perPage=1&case_status=0&list_type=2&type=0&page=" + page, {
        "method": "GET",
        "headers": {
            "content-type": "application/json;charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            "token": token
        }
    })
        .then(response => response.json())
        .then(data => {
        if (data.code == 1 && data.msg == "SUCCESS") {
            arr = arr.concat(data.data.data);
        }
        if (page < data.data.pages) {
            fetchData(page + 1);
        } else {
            //console.log(arr);
            fetchContacts().then(exportXlsx);
        }
    });
}
//三方
function fetchContacts() {
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-success" style="color:'green'">`;
    const promises = arr.map(item => {
        const url = "https://server.xingeguanli.com/osapi/Overdue/contacts?is_page=0&case_id=" + item.id;
        return fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
                "token": token
            }
        })
            .then(response => response.json())
            .then(data => {
            for (let i = 0; i < Math.min(data.data.length, 5); i++) {
                const contact = data.data[i];
                item[`name${i + 1}`] = contact.contacts_name;
                item[`phone${i + 1}`] = contact.contacts_phone;
                item[`relation${i + 1}`] = contact.relation;
            }
        })
            .catch(error => {
            console.error("发生错误：", error);
        });
    });
    return Promise.all(promises);
}

function exportXlsx(){
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const customHeader = ["姓名", "身份证", "年龄","性别","户籍地址","开户行","银行卡号","家庭地址","居住地址","单位名称","合同编号","贷款金额","逾期天数","贷款期数","已还期数","委托金额","指导金额","剩余本金","实际到账金额","应还金额","剩余应还","借款日期","联系人1","关系1","电话号码1","联系人2","关系2","电话号码2","联系人3","关系3","电话号码3","联系人4","关系4","电话号码4","联系人5","关系5","电话号码5"];
    const formattedData = arr.map(item => ({
        "姓名": item.case_name,
        "身份证": item.case_idcard,
        "年龄": item.age,
        "性别": item.sex,
        "户籍地址": item.huji_address,
        "开户行": item.bank_name,
        "银行卡号": item.bank_card,
        "家庭地址": item.home_address,
        "居住地址": item.address,
        "单位名称": item.company_name,
        "合同编号": item.contract,
        "贷款金额": item.loan_money,
        "逾期天数": item.overdue_days,
        "贷款期数": item.periods,
        "已还期数": item.per_had,
        "委托金额": item.new_entrust_monry,
        "指导金额": item.amount_payable,
        "剩余本金": item.last_capital,
        "实际到账金额": item.loan_had,
        "应还金额": item.entrust_money,
        "剩余应还": item.surplus_amount_payable,
        "借款日期": item.other_info.放款日期,
        "联系人1": item.name1,
        "关系1": item.relation1,
        "电话号码1": item.phone1,
        "联系人2": item.name2,
        "关系2": item.relation2,
        "电话号码2": item.phone2,
        "联系人3": item.name3,
        "关系3": item.relation3,
        "电话号码3": item.phone3,
        "联系人4": item.name4,
        "关系4": item.relation4,
        "电话号码4": item.phone4,
        "联系人5": item.name5,
        "关系5": item.relation5,
        "电话号码5": item.phone5,
    }));
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: customHeader });
    worksheet['!cols'] = [
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
    XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_信鸽-导出数据.xlsx`);
    document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-success">`;
    setTimeout(function(){
        document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-download">`;
    },5000)
}





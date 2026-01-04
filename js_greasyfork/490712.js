// ==UserScript==
// @name         恒昌业务管理系统
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  恒昌业务管理系统导出信息
// @author       Bor1s
// @match        https://lion.credithc.com/index
// @icon         https://lion.credithc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490712/%E6%81%92%E6%98%8C%E4%B8%9A%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/490712/%E6%81%92%E6%98%8C%E4%B8%9A%E5%8A%A1%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==

//导入xlsx.min.js
let script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.src = "https://cdn.bootcdn.net/ajax/libs/xlsx/0.18.5/xlsx.mini.min.js";
document.documentElement.appendChild(script);
//加载动画
const customCSS = `
        .loading {
            animation: rotate 3s linear infinite;
        }
        @keyframes rotate {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    `;
const style = document.createElement('style');
style.type = 'text/css';
style.textContent = customCSS;
document.head.appendChild(style);


// 定义获取数据的函数
const fetchData = async () => {
    let allContractNumbers = [];

    const fetchDataPage = async (pageNo, totalPage) => {
        try {
            const response = await fetch(`https://lion.credithc.com/casemain/queryMyCaseListByPageNew?pageNo=${pageNo}&pageSize=50`, {//控制每页数量
                method: "GET"
            });
            const data = await response.json();
            const contractList = data.data.list.map(item => item.contractNo);
            allContractNumbers = allContractNumbers.concat(contractList);

            if (pageNo < totalPage) {//控制数量 获取全部 数字改totalPage
                await fetchDataPage(pageNo + 1, totalPage);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        }
    };

    try {
        const response = await fetch("https://lion.credithc.com/casemain/queryMyCaseListByPageNew?pageNo=1&pageSize=50", {//控制每页数量
            method: "GET"
        });
        const data = await response.json();
        const totalPage = data.data.totalPage;

        await fetchDataPage(1, totalPage);

        return allContractNumbers;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
};

// 获取详细信息
const fetchDetailInfo = async (contractNumbers) => {
    const allDetails = [];

    try {
        for (const contractNo of contractNumbers) {
            let attempt = 0;
            let success = false;
            let detailInfo = null;

            while (!success && attempt < 10) { // 尝试十次
                try {
                    const response = await fetch(`https://lion.credithc.com/casemain/basicinfo?param={'contractNo':'${contractNo}'} `, {
                        method: "GET"
                    });

                    const data = await response.json();
                    detailInfo = data.data.entity;
                    success = true; // 请求成功
                } catch (error) {
                    //console.error('Fetch error:', error);
                }

                attempt++;
            }

            if (success) {
                const customerId = detailInfo.customerId;
                const idcard = detailInfo.customerIdMask;
                const detailWithIdCard = {
                    ...detailInfo,
                    idcard: idcard
                };

                // 获取地址信息
                try {
                    const eagleResponse = await fetch("https://lion.credithc.com/eagle/getEagleInfo", {
                        method: "POST",
                        headers: {
                            "accept": "*/*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                            "x-requested-with": "XMLHttpRequest",
                            "cookie": "shiro.sesssion=acee9bad-0a8e-438a-8f0e-a6d3aff30d7b; XSRF-TOKEN=6a9fbeaf-412e-4dab-b92c-ac9b65f11bba; cc=145e570c-a30f-40b9-9211-3726ba714405",
                            "Referer": "https://lion.credithc.com/front/project/html/col/eagle/main.jsp?contractNo=GD1544030306031460&sourceChannels=1&applyId=15061544030306003&eagleMark=0&fromOccupy=1&customerName=%E8%B5%B5%E6%99%93%E5%B3%B0&remoteFaceReview=%E4%B8%8D%E6%98%AF%E8%BF%9C%E7%A8%8B",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        },
                        body: `param=${encodeURIComponent(JSON.stringify({ "contractNo": contractNo }))}`
                    });

                    const eagleData = await eagleResponse.json();

                    // 合并数组
                    detailWithIdCard.eagleInfo = eagleData;
                } catch (error) {
                    console.error('Fetch error in eagle/getEagleInfo:', error);
                }

                // 获取关联地址信息
                try {
                    const contactAddrResponse = await fetch(`https://lion.credithc.com/contactaddr/page?parameter=%7B%22contractNo%22%3A%22${contractNo}%22%7D&pageNo=1&pageSize=10`, {
                        method: "GET",
                        headers: {
                            "accept": "*/*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "x-requested-with": "XMLHttpRequest",
                            "cookie": "shiro.sesssion=acee9bad-0a8e-438a-8f0e-a6d3aff30d7b; cc=145e570c-a30f-40b9-9211-3726ba714405; XSRF-TOKEN=cbe4fbaa-03e0-4106-9c02-015cfb02628f",
                            "Referer": "https://lion.credithc.com/front/project/html/col/CaseDetail/main.jsp?contractNo=GD1544030306031460&sourceChannels=1&occupy=1&fromOcaList=1",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        }
                    });

                    const contactAddrData = await contactAddrResponse.json();

                    // 合并数组
                    detailWithIdCard.contactAddrInfo = contactAddrData;
                } catch (error) {
                    console.error('Fetch error in contactaddr/page:', error);
                }

                // 获取关联人信息
                try {
                    const contactTelResponse = await fetch(`https://lion.credithc.com/contacttel/page?parameter=%7B%22sort%22%3A%22%22%2C%22contractNo%22%3A%22${contractNo}%22%7D&type=1&pageNo=1&pageSize=30`, {
                        method: "GET",
                        headers: {
                            "accept": "*/*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "x-requested-with": "XMLHttpRequest",
                            "cookie": "shiro.sesssion=acee9bad-0a8e-438a-8f0e-a6d3aff30d7b; cc=145e570c-a30f-40b9-9211-3726ba714405; XSRF-TOKEN=77063682-601e-4320-8ee2-af451b00a78b",
                            "Referer": "https://lion.credithc.com/front/project/html/col/CaseDetail/main.jsp?contractNo=GD1544030306031460&sourceChannels=1&occupy=1&fromOcaList=1",
                            "Referrer-Policy": "strict-origin-when-cross-origin"
                        }
                    });

                    const contactTelData = await contactTelResponse.json();

                    // 合并数组
                    detailWithIdCard.contactTelInfo = contactTelData;
                } catch (error) {
                    console.error('Fetch error in contacttel/page:', error);
                }

                // 将完整的信息写到数组中
                allDetails.push(detailWithIdCard);
            } else {
                console.error(`Failed to fetch detail info for contractNo: ${contractNo}`);
            }
        }
    } catch (error) {
        console.error('Error in fetchDetailInfo:', error);
    }

    return allDetails;
};


//导出excel
const exportXlsx = async (detailInfo) => {
    //console.log(detailInfo)
    //document.querySelector("#exportEXCEL").innerHTML=`<i class="el-icon-loading"></i>导出中...`;
    const customHeader = ["合同编号", "客户姓名", "本人手机号", "来源渠道", "逾期期数", "证件号", "账龄", "分案账龄", "合同金额", "逾期总额", "逾期费用", "逾期天数", "产品类型", "实际逾期期数", "划扣银行", "划扣卡号", "逾期本金", "总待还本金", "逾期利息","总待还金额", "总待还利息", "违约金", "实际放款时间", "实际放款金额", "历史还款总额", "单位名称", "单位电话", "单位地址", "家庭地址", "户籍地址", "其他地址信息", "关联人信息"];
    const formattedData = detailInfo.map(item => {
        // 获取其他地址信息列表
        const otherAddresses = (item.contactAddrInfo && item.contactAddrInfo.data.list) || [];

        // 初始化其他地址信息字符串
        let otherAddressString = "";

        // 如果存在其他地址信息，则拼接
        if (otherAddresses && otherAddresses.length > 0) {
            otherAddressString = otherAddresses.map(addressItem => {
                const sourceStr = addressItem.sourceStr ? addressItem.sourceStr : "";
                const addrTypeStr = addressItem.addrTypeStr ? addressItem.addrTypeStr : "";
                const relationsStr = addressItem.relationsStr ? addressItem.relationsStr : "";
                const name = addressItem.name ? addressItem.name : "";
                const addr = addressItem.addr ? addressItem.addr : "";
                return `${sourceStr}+${addrTypeStr}+${relationsStr}+${name}+${addr}`;
            }).join("/");
        }
        const otherTel = (item.contactTelInfo && item.contactTelInfo.data.list) || [];
        //初始化其他电话信息字符串
        let otherTelString = "";
        // 如果存在其他电话信息，则拼接
        if (otherTel && otherTel.length > 0) {
            otherTelString = otherTel.map(telItem => {
                //sourceStr+telTypeStr+relationsStr+name+tel+effectiveStr+phoneStatusStr+phoneLocation
                const sourceStr = telItem.sourceStr ? telItem.sourceStr : "";
                const telTypeStr = telItem.telTypeStr ? telItem.telTypeStr : "";
                const relationsStr = telItem.relationsStr ? telItem.relationsStr : "";
                const name = telItem.name ? telItem.name : "";
                const tel = telItem.tel ? telItem.tel : "";
                const effectiveStr = telItem.effectiveStr ? telItem.effectiveStr : "";
                const phoneStatusStr = telItem.phoneStatusStr ? telItem.phoneStatusStr : "";
                const phoneLocation = telItem.phoneLocation ? telItem.phoneLocation : "";
                return `${sourceStr}+${telTypeStr}+${relationsStr}+${name}+${tel}+${effectiveStr}+${phoneStatusStr}+${phoneLocation}`;
            }).join("/");
        }

        // 构建最终数据对象
        return {
            "合同编号": item.contractNo || "",
            "客户姓名": item.customerName || "",
            "本人手机号": item.telMark || "",
            "来源渠道": item.sourceChannels || "",
            "逾期期数": item.cd || "",
            "证件号": item.idcard || "",
            "账龄": item.bucket || "",
            "分案账龄": item.strategyBucket || "",
            "合同金额": item.contractAmount || "",
            "逾期总额": item.oTotalAmount || "",
            "逾期费用": item.oFee || "",
            "逾期天数": item.dpd || "",
            "产品类型": item.product || "",
            "实际逾期期数": item.cdR || "",
            "划扣银行": item.deductBank || "",
            "划扣卡号": item.deductCardnum || "",
            "逾期本金": item.oPrincipal || "",
            "总待还本金": item.balancePrincipal || "",
            "逾期利息": item.oInterest || "",
            "总待还金额": item.balanceFee || "",
            "总待还利息": item.balanceInterest || "",
            "违约金": item.oForfeit || "",
            "实际放款时间": item.loanDate || "",
            "实际放款金额": item.loanAmount || "",
            "历史还款总额": item.historyPayAmount || "",
            "单位名称": (item.eagleInfo && item.eagleInfo.data && item.eagleInfo.data.entity && item.eagleInfo.data.entity.unitName) || "",
            "单位电话": (item.eagleInfo && item.eagleInfo.data && item.eagleInfo.data.entity && item.eagleInfo.data.entity.unitTele) || "",
            "单位地址": (item.eagleInfo && item.eagleInfo.data && item.eagleInfo.data.entity && item.eagleInfo.data.entity.unitAddress) || "",
            "家庭地址": (item.eagleInfo && item.eagleInfo.data && item.eagleInfo.data.entity && item.eagleInfo.data.entity.homeAddress) || "",
            "户籍地址": (item.eagleInfo && item.eagleInfo.data && item.eagleInfo.data.entity && item.eagleInfo.data.entity.accountAddress) || "",
            "其他地址信息": otherAddressString || "",
            "关联人信息": otherTelString || ""
        };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(formattedData, { header: customHeader });
    worksheet['!cols'] = [
        { wch: 20 },
        { wch: 10 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 20 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 10 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, "导出结果");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    XLSX.writeFile(workbook, `${currentYear}年${currentMonth}月${currentDay}日_恒昌-导出数据.xlsx`);
    document.querySelector("#dhstatus").classList.remove('fa-spinner', 'loading');
    document.querySelector("#dhstatus").classList.add('fa-check-square');
    setTimeout(function () {
        document.querySelector("#dhstatus").classList.remove('fa-check-square');
        document.querySelector("#dhstatus").classList.add('fa-bolt');
    }, 5000)
}




window.onload = async function () {
    console.log('页面加载完成，油猴开始加载...')
    var targetElement = document.querySelector("#index-content > div.topbar");
    if (targetElement) {
        const buttonHTML = '<span class="name" id="exportEXCEL"><i class="fa fa-bolt" id="dhstatus"></i></span>';
        targetElement.insertAdjacentHTML('afterbegin', buttonHTML);
        const button = document.querySelector("#exportEXCEL");
        const status = document.querySelector("#dhstatus");
        button.addEventListener("click", async function () {
            status.classList.remove('fa-bolt');
            status.classList.add('fa-spinner', 'loading');
            const contractNumbers = await fetchData();
            //console.log(contractNumbers); // 合同号数组

            const detailInfo = await fetchDetailInfo(contractNumbers);
            //console.log(detailInfo); //所有详细信息的数组
            await exportXlsx(detailInfo);
        });
        button.oncontextmenu = function (e) {
            return false
        }
        button.onmouseup = function (e) {
            if (e.button == 2) {
                console.log("右键单击")
            }
        }
    }
}


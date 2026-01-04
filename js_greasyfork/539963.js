// ==UserScript==
// @name         亿量催收平台
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  获取数据--定制版
// @author       Bor1s
// @match        http://www.e-liang.net/pages/oms-company/index.html
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/539963/%E4%BA%BF%E9%87%8F%E5%82%AC%E6%94%B6%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/539963/%E4%BA%BF%E9%87%8F%E5%82%AC%E6%94%B6%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.textContent = '案件数据导出';
    mainButton.style.position = 'fixed';
    mainButton.style.bottom = '20px';
    mainButton.style.right = '20px';
    mainButton.style.zIndex = '9999';
    mainButton.style.padding = '10px 20px';
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.style.color = 'white';
    mainButton.style.border = 'none';
    mainButton.style.borderRadius = '5px';
    mainButton.style.cursor = 'pointer';
    document.body.appendChild(mainButton);

    // 创建弹出框
    const popup = document.createElement('div');
    popup.style.display = 'none';
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.width = '600px';
    popup.style.maxHeight = '80vh';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '5px';
    popup.style.padding = '20px';
    popup.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';
    popup.style.zIndex = '10000';
    popup.style.overflow = 'auto';
    document.body.appendChild(popup);

    // 创建弹出框标题
    const popupTitle = document.createElement('h2');
    popupTitle.textContent = '案件数据获取与导出';
    popupTitle.style.marginTop = '0';
    popup.appendChild(popupTitle);

    // 创建userToken输入框
    const userTokenInput = document.createElement('input');
    userTokenInput.type = 'text';
    userTokenInput.placeholder = '请输入userToken';
    userTokenInput.style.width = '100%';
    userTokenInput.style.padding = '10px';
    userTokenInput.style.marginBottom = '10px';
    popup.appendChild(userTokenInput);

    // 创建按钮容器
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.marginBottom = '20px';
    popup.appendChild(buttonContainer);

    // 创建开始按钮
    const startButton = document.createElement('button');
    startButton.textContent = '开始';
    startButton.style.padding = '10px 20px';
    startButton.style.backgroundColor = '#4CAF50';
    startButton.style.color = 'white';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '5px';
    startButton.style.cursor = 'pointer';
    buttonContainer.appendChild(startButton);

    // 创建导出按钮
    const exportButton = document.createElement('button');
    exportButton.textContent = '导出';
    exportButton.style.padding = '10px 20px';
    exportButton.style.backgroundColor = '#2196F3';
    exportButton.style.color = 'white';
    exportButton.style.border = 'none';
    exportButton.style.borderRadius = '5px';
    exportButton.style.cursor = 'pointer';
    exportButton.disabled = true;
    buttonContainer.appendChild(exportButton);

    // 创建进度条
    const progressContainer = document.createElement('div');
    progressContainer.style.width = '100%';
    progressContainer.style.height = '20px';
    progressContainer.style.backgroundColor = '#f1f1f1';
    progressContainer.style.borderRadius = '10px';
    progressContainer.style.marginBottom = '20px';
    popup.appendChild(progressContainer);

    const progressBar = document.createElement('div');
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = '#4CAF50';
    progressBar.style.borderRadius = '10px';
    progressBar.style.transition = 'width 0.3s';
    progressContainer.appendChild(progressBar);

    // 创建数据列表
    const dataList = document.createElement('div');
    dataList.style.width = '100%';
    dataList.style.maxHeight = '300px';
    dataList.style.overflow = 'auto';
    dataList.style.border = '1px solid #ddd';
    dataList.style.borderRadius = '5px';
    dataList.style.padding = '10px';
    popup.appendChild(dataList);

    // 存储获取的数据
    let caseData = [];

    // 主按钮点击事件
    mainButton.addEventListener('click', function() {
        popup.style.display = 'block';
    });

    // 开始按钮点击事件
    startButton.addEventListener('click', function() {
        const userToken = userTokenInput.value;
        if (!userToken) {
            alert('请输入有效的userToken');
            return;
        }
        startButton.disabled = true;
        startButton.textContent = '获取中...';
        dataList.innerHTML = '<p>正在获取数据...</p>';
        caseData = [];
        getCaseIds(userToken);
    });

    // 导出按钮点击事件
    exportButton.addEventListener('click', function() {
        exportToExcel();
    });

    // 获取所有caseId
    function getCaseIds(userToken) {
        const url = 'http://www.e-liang.net/eliang-oms-company/companySolrCase/v1/queryCasePageForCompany.do?userToken=' + userToken;

        const requestData = {
            "pageDTO": {
                "pageSize": 50,
                "pageNo": 1
            },
            "entityDTO": {
                "query": "*:* AND collectorId:46b3e035-6bd0-11ee-a960-00163e061dff AND caseStatus:1 AND customCode:JLSRASSET00000 AND cashedStatus:(0 OR 1)",
                "departId": "cad4063c-91ed-11eb-9b09-00163e061dff"
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const totalPages = data.data.pageDTO.pageCount;
                    const totalCount = data.data.pageDTO.totalCount;
                    const records = data.data.records;

                    // 存储第一页的caseId
                    const caseIds = records.map(record => record.id);

                    // 获取第一页的详细信息
                    getCaseDetails(caseIds, 1, totalPages, totalCount, userToken);

                    // 如果有更多页，继续获取
                    if (totalPages > 1) {
                        for (let pageNo = 2; pageNo <= totalPages; pageNo++) {
                            getCaseIdsByPage(pageNo, totalPages, totalCount, userToken);
                        }
                    }
                } else {
                    dataList.innerHTML = '<p style="color:red;">获取caseId失败: ' + response.status + '</p>';
                    startButton.disabled = false;
                    startButton.textContent = '开始';
                }
            },
            onerror: function(error) {
                dataList.innerHTML = '<p style="color:red;">获取caseId出错: ' + error + '</p>';
                startButton.disabled = false;
                startButton.textContent = '开始';
            }
        });
    }

    // 分页获取caseId
    function getCaseIdsByPage(pageNo, totalPages, totalCount, userToken) {
        const url = 'http://www.e-liang.net/eliang-oms-company/companySolrCase/v1/queryCasePageForCompany.do?userToken=' + userToken;

        const requestData = {
            "pageDTO": {
                "pageSize": 50,
                "pageNo": pageNo
            },
            "entityDTO": {
                "query": "*:* AND collectorId:46b3e035-6bd0-11ee-a960-00163e061dff AND caseStatus:1 AND customCode:JLSRASSET00000 AND cashedStatus:(0 OR 1)",
                "departId": "cad4063c-91ed-11eb-9b09-00163e061dff"
            }
        };

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: JSON.stringify(requestData),
            onload: function(response) {
                if (response.status === 200) {
                    const data = JSON.parse(response.responseText);
                    const records = data.data.records;
                    const caseIds = records.map(record => record.id);
                    getCaseDetails(caseIds, pageNo, totalPages, totalCount, userToken);
                }
            }
        });
    }

    // 获取案件详细信息
    function getCaseDetails(caseIds, currentPage, totalPages, totalCount, userToken) {
        let completedCount = 0;
        const totalCases = caseIds.length;

        caseIds.forEach((caseId, index) => {
            const requestData = {
                "id": caseId
            };

            // 获取案件基本信息
            const basicInfoUrl = 'http://www.e-liang.net/eliang-oms-company/case/v1/getOriginalCaseDetail.do?userToken=' + userToken;
            GM_xmlhttpRequest({
                method: 'POST',
                url: basicInfoUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: JSON.stringify(requestData),
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        const caseDetail = {
                            fullName: data.data.date[0].fullName,
                            homeAddress: data.data.date[0].homeAddress,
                            identifyNo: data.data.date[0].identifyNo,
                            mobile: data.data.date[0].mobile,
                            email: data.data.date[0].email,
                            cardNo: data.data.date[0].cardNo,
                            companyName: data.data.date[0].companyName,
                            creditAmt: data.data.date[0].creditAmt,
                            remarks: [
                                data.data.date[0].remarks[0]? data.data.date[0].remarks[0].remark : '',
                                data.data.date[0].remarks[1]? data.data.date[0].remarks[1].remark : '',
                                data.data.date[0].remarks[2]? data.data.date[0].remarks[2].remark : '',
                                data.data.date[0].remarks[3]? data.data.date[0].remarks[3].remark : '',
                                data.data.date[0].remarks[4]? data.data.date[0].remarks[4].remark : '',
                                data.data.date[0].remarks[5]? data.data.date[0].remarks[5].remark : ''
                            ]
                        };

                        // 获取联系人信息
                        const contactUrl = 'http://www.e-liang.net/eliang-oms-company/companyContactorPhoneInfo/v1/queryContactorPhoneInfoPage.do?userToken=' + userToken;
                        const contactRequestData = {
                            "pageDTO": {
                                "pageSize": 100,
                                "pageNo": 1
                            },
                            "orderDTOs": [],
                            "entityDTO": {
                                "caseId": caseId
                            }
                        };
                        GM_xmlhttpRequest({
                            method: 'POST',
                            url: contactUrl,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json'
                            },
                            data: JSON.stringify(contactRequestData),
                            onload: function(contactResponse) {
                                if (contactResponse.status === 200) {
                                    const contactData = JSON.parse(contactResponse.responseText);
                                    const contacts = contactData.data.records.map(record => {
                                        const contactName = record.contactorName || '';
                                        const phoneNo = record.phoneNo || '';
                                        const relationType = record.relationType || '';
                                        const phoneLocation = record.phoneLocation || '';
                                        const companyName = record.companyName || '';
                                        return `${contactName},${phoneNo},${relationType},${phoneLocation},${companyName}`;
                                    }).join(';');
                                    caseDetail.contacts = contacts;
                                }
                                caseData.push(caseDetail);

                                // 更新进度
                                completedCount++;
                                const progress = Math.round(((currentPage - 1) * 50 + completedCount) / totalCount * 100);
                                progressBar.style.width = progress + '%';

                                // 更新数据列表
                                updateDataList(caseDetail, (currentPage - 1) * 50 + completedCount, totalCount);

                                // 如果所有数据获取完成，启用导出按钮
                                if (progress === 100) {
                                    startButton.disabled = false;
                                    startButton.textContent = '完成';
                                    exportButton.disabled = false;
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    // 更新数据列表
    function updateDataList(caseDetail, currentCount, totalCount) {
        const item = document.createElement('div');
        item.style.marginBottom = '10px';
        item.style.padding = '10px';
        item.style.backgroundColor = '#f9f9f9';
        item.style.borderRadius = '5px';

        const fullName = document.createElement('div');
        fullName.style.fontWeight = 'bold';
        fullName.textContent = '姓名: ' + caseDetail.fullName;
        item.appendChild(fullName);

        const homeAddress = document.createElement('div');
        homeAddress.textContent = '家庭地址: ' + caseDetail.homeAddress;
        item.appendChild(homeAddress);

        const identifyNo = document.createElement('div');
        identifyNo.textContent = '证件号: ' + caseDetail.identifyNo;
        item.appendChild(identifyNo);

        const mobile = document.createElement('div');
        mobile.textContent = '本人手机: ' + caseDetail.mobile;
        item.appendChild(mobile);

        const email = document.createElement('div');
        email.textContent = '电邮: ' + caseDetail.email;
        item.appendChild(email);

        const cardNo = document.createElement('div');
        cardNo.textContent = '卡号: ' + caseDetail.cardNo;
        item.appendChild(cardNo);

        const companyName = document.createElement('div');
        companyName.textContent = '卡人单位: ' + caseDetail.companyName;
        item.appendChild(companyName);

        const creditAmt = document.createElement('div');
        creditAmt.textContent = '信用额度: ' + caseDetail.creditAmt;
        item.appendChild(creditAmt);

        const contacts = document.createElement('div');
        contacts.textContent = '三方联系人: ' + caseDetail.contacts;
        item.appendChild(contacts);

        const remarks = document.createElement('div');
        remarks.textContent = '备注: ' + caseDetail.remarks.join('; ');
        item.appendChild(remarks);

        const progressText = document.createElement('div');
        progressText.style.marginTop = '5px';
        progressText.style.fontSize = '0.8em';
        progressText.style.color = '#666';
        progressText.textContent = `进度: ${currentCount}/${totalCount}`;
        item.appendChild(progressText);

        dataList.appendChild(item);
    }

    // 导出为Excel
    function exportToExcel() {
    if (caseData.length === 0) {
        alert('没有数据可导出');
        return;
    }

    try {
        // 准备工作表数据
        const wsData = [
            ['姓名','证件号', '本人手机', '电邮', '卡号', '信用额度', '三方联系人', '备注1', '备注2', '备注3']
        ];

        // 填充数据
        caseData.forEach(caseDetail => {
            wsData.push([
                caseDetail.fullName,
                //caseDetail.homeAddress,
                caseDetail.identifyNo,
                caseDetail.mobile,
                caseDetail.email,
                caseDetail.cardNo,
                //caseDetail.companyName,
                caseDetail.creditAmt,
                caseDetail.contacts,
                caseDetail.remarks[0],
                caseDetail.remarks[1],
                caseDetail.remarks[2],
                // caseDetail.remarks[3],
                // caseDetail.remarks[4],
                // caseDetail.remarks[5]
            ]);
        });

        // 创建工作表
        const ws = XLSX.utils.aoa_to_sheet(wsData);

        // 创建工作簿
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '案件数据');

        // 生成Excel文件
        const wbout = XLSX.write(wb, {
            bookType: 'xlsx',
            type: 'array',
            bookSST: true  // 提高大文件性能
        });

        // 创建文件名
        const now = new Date();
        const fileName = `案件数据_${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.xlsx`;

        // 两种下载方式都提供，优先使用GM_download
        try {
            // 方法1: 使用GM_download
            GM_download({
                data: wbout,
                name: fileName,
                saveAs: true,
                onload: function() {
                    dataList.innerHTML += '<p style="color:green;">数据导出成功</p>';
                },
                onerror: function(error) {
                    // 如果GM_download失败，尝试原生方法
                    downloadWithNativeMethod(wbout, fileName);
                }
            });
        } catch (e) {
            // 如果GM_download不可用，使用原生方法
            downloadWithNativeMethod(wbout, fileName);
        }

    } catch (error) {
        console.error('导出失败:', error);
        dataList.innerHTML += `<p style="color:red;">导出失败: ${error.message || error}</p>`;
    }
}

// 原生下载方法
function downloadWithNativeMethod(data, fileName) {
    try {
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();

        // 清理资源
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            dataList.innerHTML += '<p style="color:green;">数据导出成功</p>';
        }, 100);
    } catch (error) {
        dataList.innerHTML += `<p style="color:red;">原生导出方法失败: ${error.message || error}</p>`;
    }
}

})();
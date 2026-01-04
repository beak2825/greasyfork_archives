// ==UserScript==
// @name         私人云码图片批量替换
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  私人云码通过按钮进行图片批量替换
// @author       hzk
// @match        *://yun-ma.tmall.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tmall.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538337/%E7%A7%81%E4%BA%BA%E4%BA%91%E7%A0%81%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/538337/%E7%A7%81%E4%BA%BA%E4%BA%91%E7%A0%81%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

// 参数开始
let uploading = false;
// 用户基本参数
const userInfo = {
    accountType: 'pptg',
    bizType: 'brandAuctionPromotion',
    brandMainId: null,
    mainId: null,
};

let finishCampaignId = [];
let notInCampaignId = [];
let finishAdGroupId = [];
let notInAdGroupId = [];
let notInAdSlotStyleId = [];

const adSlotStyleIdToSize = {
    '1': '640_960',
    '2': '720_1280',
    '3': '1280_720',
    '11': '480_320',
    '12': '480_320',
    '13': '640_320',
    '14': '640_320',
    '15': '1280_720',
    '16': '1280_720',
    '17': '480_320',
    '41': '720_1280',
    '46': '1080_2160',
    '62': '1080_1920',
    '63': '640_360',
    '76': '300_300',
    '114': '1080_1920',
    '125': '1920_1080',
    '155': '1920_1080',
    '172': '720_1280',
    '182': '640_960',
    '184': '1280_720',
    '201': '720_1280',
    '232': '1280_720',
    '234': '1080_1920',
}

const filePath = 'https://salger-batch-fodder.oss-cn-hangzhou.aliyuncs.com'

// 参数结束

// 自定义方法开始
// 插入批量更新图片按钮
function appendUpdateImgBtn() {
    const cell = document.querySelectorAll('.page-container div.m-b-18.clearfix')[0];
    console.log(cell);
    if (!cell) {
        setTimeout(() => {
            appendUpdateImgBtn();
        }, 1000);
        return;
    }

    const campaignIdInput = document.createElement('input');
    campaignIdInput.id = 'campaignIdInput';
    campaignIdInput.placeholder = '请输入投放计划ID';
    campaignIdInput.style = 'border: 1px solid;height: 32px;margin-right: 5px;';
    // 插入到 DOM 中（追加到某个元素内）
    cell.appendChild(campaignIdInput);

    const adGroupIdInput = document.createElement('input');
    adGroupIdInput.id = 'adGroupIdInput';
    adGroupIdInput.placeholder = '请输入投放单元ID';
    adGroupIdInput.style = 'border: 1px solid;height: 32px;margin-right: 5px;';
    // 插入到 DOM 中（追加到某个元素内）
    cell.appendChild(adGroupIdInput);

    const filePathSupInput = document.createElement('input');
    filePathSupInput.id = 'filePathSupInput';
    filePathSupInput.placeholder = '请输入图片补充地址';
    filePathSupInput.style = 'border: 1px solid;height: 32px;margin-right: 5px;';
    // filePathSupInput.value = '/upload-test/new';
    // 插入到 DOM 中（追加到某个元素内）
    cell.appendChild(filePathSupInput);

    const newButton = document.createElement('button');
    // 设置 button 属性和内容
    newButton.textContent = '批量更新图片';
    newButton.id = 'updateImgButton';
    newButton.className = 'next-btn next-medium next-btn-primary creat-plan-pt-button';

    // 添加点击事件
    newButton.addEventListener('click', async function () {
        if (uploading) {
            alert('所有图片更新中请勿点击！');
            return;
        }
        const runMessage = document.getElementById('runMessage');
        runMessage.innerHTML = '';
        finishCampaignId = [];
        notInCampaignId = [];
        notInAdSlotStyleId = [];
        const campaignIdInput = document.getElementById('campaignIdInput').value;
        const adGroupIdInput = document.getElementById('adGroupIdInput').value;
        if (campaignIdInput && adGroupIdInput) {
            alert('请勿同时输入投放计划ID和单元ID');
            return;
        } else if (!campaignIdInput && !adGroupIdInput) {
            alert('请输入投放计划ID或单元ID');
            return;
        }
        const campaignIdInputList = campaignIdInput.split(',').filter(item => !!item);
        const adGroupIdInputList = adGroupIdInput.split(',').filter(item => !!item);
        const filePathSupInput = document.getElementById('filePathSupInput').value;
        if (!filePathSupInput) {
            alert('请输入图片补充地址');
            return;
        }
        uploading = true;

        userInfo.brandMainId = getBrandMainId();

        if (campaignIdInputList.length) {
            const campaignData = await getCampaignList();

            const campaignIdList = campaignData.list.map(item => item.campaignId);
            for (let campaignId of campaignIdInputList) {
                if (campaignIdList.includes(Number(campaignId))) {
                    const data = await getAdGroupList(campaignId);
                    // const data = await getAdGroupList(null);

                    for (let item of data.list) {
                        await sleep(1000);
                        const creativeListData = await getCreativeList(item.adGroupId);
                        for (let i = 0; i < creativeListData.list.length; i++) {
                            updateRunMessage(i, creativeListData.list.length);
                            const creative = creativeListData.list[i];
                            await updateImg(creative, campaignId);
                        }
                    }
                    finishCampaignId.push(campaignId);
                } else {
                    notInCampaignId.push(campaignId);
                }
            }
        }
        if (adGroupIdInputList.length) {
            for (let adGroupId of adGroupIdInputList) {
                await sleep(1000);
                const creativeListData = await getCreativeList(adGroupId);
                if (creativeListData.list.length) {
                    for (let i = 0; i < creativeListData.list.length; i++) {
                        updateRunMessage(i, creativeListData.list.length);
                        const creative = creativeListData.list[i];
                        await updateImg(creative, adGroupId);
                    }
                    finishAdGroupId.push(adGroupId);
                } else {
                    notInAdGroupId.push(adGroupId);
                }
            }
        }
        let alertMessage = '';
        if (campaignIdInputList.length) {
            if (finishCampaignId.length) {
                alertMessage += finishCampaignId.length + '条计划更新图片成功！(' + finishCampaignId.join(',') + ')\n';
            }
            if (notInCampaignId.length) {
                alertMessage += notInCampaignId.length + '条计划未找到！(' + notInCampaignId.join(',') + ')\n';
            }
        }
        if (adGroupIdInputList.length) {
            if (finishAdGroupId.length) {
                alertMessage += finishAdGroupId.length + '条单元更新图片成功！(' + finishAdGroupId.join(',') + ')\n';
            }
            if (notInAdGroupId.length) {
                alertMessage += notInAdGroupId.length + '条单元未找到！(' + notInAdGroupId.join(',') + ')\n';
            }
        }
        const uniqueArr = Array.from(new Set(notInAdSlotStyleId));
        if (uniqueArr.length) {
            alertMessage += uniqueArr.length + '条模板id不存在！(' + uniqueArr.join(',') + ')\n';
        }
        alert(alertMessage);
        uploading = false;
    });

    // 插入到 DOM 中（追加到某个元素内）
    cell.appendChild(newButton);


    const runMessageDiv = document.createElement('div');
    runMessageDiv.id = 'runMessage';
    runMessageDiv.style.width = '100%';
    cell.appendChild(runMessageDiv);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 更新代码运行中消息
function updateRunMessage(i, length) {
    const runMessage = document.getElementById('runMessage');
    runMessage.textContent = '正在更新第' + (i + 1) + '个广告创意，共' + length + '个';
}

// 更新图片
async function updateImg(creative, filePathId) {

    if (!creative) {
        console.info('广告创意为空！');
        return;
    }

    // 当审核状态为审核通过的时候才暂停
    if (creative.status === 0) {
        // 暂停广告
        await sleep(1000);
        await creativeStop(creative.creativeId);
    }


    // 只有存在图片才替换
    if (!adSlotStyleIdToSize[creative.chainValueVO.creativeTemplate.adSlotStyleId]) {
        notInAdSlotStyleId.push(creative.chainValueVO.creativeTemplate.adSlotStyleId);
        console.info('创意模版ID对应图片不存在！');
        return;
    }


    const filePathSupInput = document.getElementById('filePathSupInput').value;
    const fileUrl = filePath + filePathSupInput + filePathId + '/' + adSlotStyleIdToSize[creative.chainValueVO.creativeTemplate.adSlotStyleId] + '.jpg'

    const elementList = creative.chainValueVO.elementList;
    const changeImgElementList = elementList.filter(item => item.type === 'IMG' && item.secondType === 'CONVENTION_IMG');
    if (!changeImgElementList.length) {
        return;
    }

    for (const changeImgElement of changeImgElementList) {
        changeImgElement.fileUrl = fileUrl;
    }

    const updateVO = {
        accountType: userInfo.accountType,
        brandMainId: userInfo.brandMainId,
        mainId: userInfo.mainId,
        adGroupId: creative.adGroupId,
        list: [{
            type: creative.type,
            adGroupId: creative.adGroupId,
            bizType: creative.bizType,
            creativeId: creative.creativeId,
            creativeName: creative.creativeName,
            priority: creative.priority,
            chainValueVO: {
                urlType: creative.chainValueVO.urlType,
                targetUrl: creative.chainValueVO.targetUrl,
                attributionType: creative.chainValueVO.attributionType,
                attributionGoodsContent: creative.chainValueVO.attributionGoodsContent,
                attributionSimilarGoodsContent: creative.chainValueVO.attributionSimilarGoodsContent,
                exposureMonitoringLink: creative.chainValueVO.exposureMonitoringLink,
                clickMonitoringLink: creative.chainValueVO.clickMonitoringLink,
                throughUrl: creative.chainValueVO.throughUrl,
                wxAppId: creative.chainValueVO.wxAppId,
                wxUrlPath: creative.chainValueVO.wxUrlPath,
                elementList,
                creativeTemplate: {
                    adSlotStyleId: creative.chainValueVO.creativeTemplate.adSlotStyleId,
                    adSlotStyleName: creative.chainValueVO.creativeTemplate.adSlotStyleName,
                    type: creative.chainValueVO.creativeTemplate.type,
                    adSlotTypes: creative.chainValueVO.creativeTemplate.adSlotTypes,
                }
            }
        }]
    }

    // 更新广告
    await sleep(1000);
    await creativeUpdate(updateVO);


    // 只审核更换图片前状态为审核通过的广告创意
    if (creative.status === 0) {
        // 审核广告
        await sleep(1000);
        await creativePublishForAudit(creative.creativeId);
    }
}

// 判断页面是否加赞完成
function checkPageLoading() {
    return new Promise((resolve) => {
        const dom = document.getElementsByClassName("page-title")
        if (dom.length > 0) {
            resolve();
        } else {
            setTimeout(() => {
                checkPageLoading().then(() => {
                    resolve();
                });
            }, 1000)
        }
    })
}

// 根据cookieName获取cookieValue
function getCookieByName(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }
}

// 获取当前页面账户ID
function getBrandMainId() {
    const spans = document.querySelectorAll('.brand-account-info span.left-align-money');
    for (let span of spans) {
        if (span.innerText.trim() === '账户ID') {
            return span.parentNode.children[1].innerText.trim();
        }
    }
}

// post接口
function postFunc(url, data) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.response).data);
            }
        }

        xhr.open('post', url);
        xhr.setRequestHeader('ccsrf', getCookieByName('ccsrf'));
        xhr.setRequestHeader('accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(data))
    })
}

// post接口
function getFunc(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if(xhr.readyState === 4 && xhr.status === 200) {
                resolve(JSON.parse(xhr.response).data);
            }
        }

        xhr.open('get', url);
        xhr.setRequestHeader('ccsrf', getCookieByName('ccsrf'));
        xhr.setRequestHeader('accept', 'application/json, text/plain, */*');
        xhr.setRequestHeader('content-type', 'application/json;charset=UTF-8');
        xhr.send();
    })
}
// 自定义方法结束

// 接口开始
function getCampaignList() {
    return postFunc('https://yun-ma.tmall.com/v3/campaign/getListByPage', {...userInfo, pageIndex: 1, pageSize: 1000});
}
function getBaseInfo() {
    return postFunc('https://yun-ma.tmall.com/mc/mainpart/v1/getBaseInfo', {});
}

function getAdGroupList(campaignId) {
    return postFunc('https://yun-ma.tmall.com/v3/adGroup/getListByPage', {...userInfo, campaignId, pageIndex: 1, pageSize: 1000});
}

function getCreativeList(adGroupId) {
    return postFunc('https://yun-ma.tmall.com/v3/creative/getListByPage', {...userInfo, adGroupId, type: 'mobi', pageIndex: 1, pageSize: 1000});
}

function creativeStop(creativeId) {
    return postFunc('https://yun-ma.tmall.com/v3/creative/stop', {...userInfo, creativeId, type: 'mobi'})
}

function creativePublishForAudit(creativeId) {
    return postFunc('https://yun-ma.tmall.com/v3/creative/publishForAudit', {...userInfo, creativeId, type: 'mobi'})
}

function creativeUpdate(vo) {
    return postFunc('https://yun-ma.tmall.com/v3/creative/update', vo);
}
// 接口结束

(function() {
    'use strict';
    // Your code here...
    getBaseInfo().then(data => {
        userInfo.mainId = data.mainId;
        console.log(userInfo);
    });


    checkPageLoading().then(() => {
        appendUpdateImgBtn();
    });

})();

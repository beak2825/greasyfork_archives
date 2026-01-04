// ==UserScript==
// @name         Boss直聘脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  tool for boss zhipin
// @author       You
// @match        https://www.zhipin.com/chat/im*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408801/Boss%E7%9B%B4%E8%81%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/408801/Boss%E7%9B%B4%E8%81%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const JOB_WRAPPER = "ZP_INFO_FRAME";
    const REPLY_WRAPPER = "ZP_REPLY_FRAME";

    // NORMAL 正常
    // MIN 收起

    const STATUS = {
        NORMAL: 1,
        MIN: 0
    };

    let curStatus = STATUS.NORMAL;

    const oneKeySend = false;

    const REQ_METHOD = {
        GET: 0,
        POST: 1
    }

    const transferUrl = (baseUrl, data) => {
        let queryStr = '?';
        const keys = Object.keys(data);
        keys.forEach((item, index) => {
            queryStr += `${item}=${data[item] ? data[item].toString() : ''}&&`
            if (index !== keys.length - 1) {
                queryStr += '&&'
            }
        })
        return baseUrl + queryStr;
    }
    const request = req => {
        if (req.method === REQ_METHOD.GET) {
            return fetch(transferUrl(req.url, req.data)).then(res => res.json())
        } else {
            return fetch(req.url, {
                method: REQ_METHOD.POST,
                body: req.data
            }).then(res => res.json());
        }
    }

    const oneKeyReply = [
        `请问您是21届应届生吗`,
        `我们本次招聘活动就是面向21年毕业的应届生的秋招内推活动哦~`,
        `不好意思，我们本次招聘只针对21届应届生~您可以尝试一下我们的社招~[呲牙]`,
        `没关系的，我们有更多的岗位需要优秀的人才，您可以去我们的校招内推官网上看看有没有合适您的岗位，期待您的到来~`,
        `请问您有意向参加网易的内推活动吗，有笔试的免筛选，直接进入笔试环节；没有笔试的简历优先筛选。越早网申，有机会越早收获Offer~`,
        `嗯嗯，抓紧时间投递简历就能早点通过简历审核，直达面试~`,
        `希望早日与您成为同事`,
        `好的，祝您工作顺利`,
        `好的，感谢您对网易的关注，预祝您顺利通过[呲牙]~`,
        `好的，您可以通过我们的内推链接参加我们的内推活动，有笔试的免筛选，直接进入笔试环节；没有笔试的简历优先筛选。`,
        `以下是我们的内推信息
        内推链接：https://game.campus.163.com/m/home?st=ZDdjYWQ0YTUtMzRiNC00Y2I4LWI2MmUtNTdkOGI2Yzk3Mjhj
        专属内推码：eE1mdd
        可以转发给其他同学，也可更改意向岗位。

        面向人群：
        国内毕业时间：2020年9月-2021年8月
        海外毕业时间：2020年1月-2021年7月（部分岗位仅面向2020年10月-2021年7月毕业生）
        内推截止至8月31日24:00
        第一批笔试为8月中上旬，部分岗位招满不再开放。
        后续可以联系我查看简历进度

        注：如果没有从我的链接投递，而是自己去官网投递的话。我不是内推人，无法查阅进度。无法免简历筛选。`,
        `好的，您可以在官网查看您的投递进度，感谢您对网易的关注，预祝您顺利通过~`
    ]


    const zpAPI = {
        getJobList: {
            url: "https://www.zhipin.com/wapi/zpboss/h5/job/joblist/data.json",
            method: REQ_METHOD.GET,
            data: {
                type: 0,
                status: 0,
                searchStr: '',
                page: 1,
                _: Date.now(),
            }
        },
        getJobInfo: {
            url: "https://www.zhipin.com/wapi/zpboss/h5/job/edit",
            method: REQ_METHOD.GET,
            data: {
                encJobId: null,
                _: Date.now(),
            }
        }
    }
    const parseDom = arg => {
        let objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes[0];
    };


    const neteaseAPI = {
        getJobDetail: {
            url: "https://game.campus.163.com/api/recruitment/campus/position/positionDetail/"
        },
        getJobList: {
            url: "https://game.campus.163.com/api/recruitment/campus/position/positions",
            method: REQ_METHOD.GET,
            data: {
                positionName: "",
                positionTypeIdList: [],
                workplaceIdSet: 373,
                pageNum: 1,
                projectId: 1
            },
            fn: (data) => {
                let tempStr = '';
                data.positionTypeIdList.forEach((item, index) => {
                    tempStr += `positionTypeIdList=${item}`;
                    if (index !== data.length) {
                        tempStr += "&&"
                    }
                })
                data.positionTypeIdList = tempStr;
            }
        }
    }

    const updateUI = () => {
        const jobWrapper = document.getElementById(JOB_WRAPPER);
        const replyWrapper = document.getElementById(REPLY_WRAPPER);
        jobWrapper.innerHTML = '';
        replyWrapper.innerHTML = '';
        const { getJobInfo } = zpAPI;
        const createJobListItem = (args, index) => {
            const itemHTML = `<div class="job-item">
                <div class="job-name">${args.jobName}</div>
                <div class="job-description"></div>
            </div>`;
            const dom = parseDom(itemHTML);
            dom.init = false;
            dom.getElementsByClassName('job-name')[0].onclick = (e) => {
                if (dom.init) {
                    const curDisplay = dom.getElementsByClassName('job-description')[0].style.display;
                    if (!curDisplay || curDisplay !== 'none') {
                        dom.getElementsByClassName('job-description')[0].style.display = 'none';
                    } else {
                        dom.getElementsByClassName('job-description')[0].style.display = 'block';
                    }
                };
                const tempData = Object.assign({}, getJobInfo.data, {
                    encJobId: zpJobList[index].encryptJobId,
                    _: Date.now()
                });
                request({
                    ...getJobInfo,
                    data: tempData
                }).then(res => {
                    dom.getElementsByClassName('job-description')[0].innerHTML = res.zpData.job.postDescription;
                    dom.init = true;
                })
                e.stopPropagation();
            }
            return dom;
        }

        const createOneKeyReplyItem = (args, index) => {
            const itemHTML = `<div class="reply-item">
            ${args}
            </div>`;
            const dom = parseDom(itemHTML);

            dom.onclick = () => {
                const chatInput = document.getElementsByClassName('chat-message')[0];
                const sendBtn = document.getElementsByClassName('btn btn-send')[0];
                if (chatInput) {
                    chatInput.innerText = args;
                }
                if (sendBtn) {
                    sendBtn.classList.remove('btn-disabled');
                    sendBtn.click();
                }
            }
            return dom;
        }

        const jobListWrapper = document.createElement('div');
        jobListWrapper.className = 'job-list';
        zpJobList.forEach((item, index) => {
            jobListWrapper.appendChild(createJobListItem({
                jobName: item.jobName
            }, index));
        })

        const commonReplyWrapper = document.createElement('div');
        commonReplyWrapper.className = 'job-common-reply';

        oneKeyReply.forEach((item, index) => {
            commonReplyWrapper.appendChild(createOneKeyReplyItem(item, index));
        })

        const oneKeyToContact = () => {
            const recommendFrame = document.getElementsByName('syncFrame')[0];
            if (!recommendFrame) return;
            const recommendList = recommendFrame.contentDocument.getElementsByTagName('html')[0];

            const scrollListener = () => {
                const curHeight = recommendList.scrollHeight;
                recommendList.scrollTo(0, recommendList.scrollHeight);
                setTimeout(() => {
                    if (curHeight !== recommendList.scrollHeight) {
                        scrollListener();
                    } else {
                        const list = Array.from(recommendList.getElementsByClassName('geek-info-card'));
                        list.forEach((item, index) => {
                            const years = item.querySelector('.info-labels > span:nth-child(4)').innerText;
                            const btn = item.querySelector('.sider-op > div > span > button');
                            if (years === '21年应届生' && btn.innerText === '打招呼') {
                                btn.click()
                            }
                        })
                    }
                }, 2000);
            }
            scrollListener();
        }

        const createActionArea = () => {
            const itemHTML = `<div class="more-action">
            </div>`;
            return parseDom(itemHTML);
        }

        const contactBtn = document.createElement('button');
        contactBtn.innerText = "打招呼";
        contactBtn.id = 'btn-contact';
        contactBtn.onclick = oneKeyToContact;


        //生成操作区域
        const actionDOM = createActionArea();

        jobWrapper.appendChild(jobListWrapper);

        //添加操作区域
        replyWrapper.appendChild(actionDOM);
        //添加自动回复
        replyWrapper.appendChild(commonReplyWrapper);


        //操作区域添加按钮
        actionDOM.appendChild(contactBtn);
    }

    const initUI = () => {
        // 创建样式表
        const style = document.createElement('style');
        style.innerHTML = `#${JOB_WRAPPER}{position:relative;left:0;top:0;width:100%;z-index:999;background-color:rgba(255,255,255,0.7);display:flex;max-height:20vh;overflow-y:auto;}
                .job-list{margin:0 auto;width:80%;height:100%;overflow-y:auto;box-sizing:border-box;border:1px solid black;}
                .job-item{display:flex;max-height:10vh;box-sizing:border-box;border-bottom:1px solid black;}.job-name{height:auto;width:10vw;cursor:pointer;box-sizing:border-box;border-right:1px solid black;}
                .job-description{flex:1;max-height:10vh;flex-wrap:no-wrap;overflow-y:auto;}
                .min-status{width:auto !important;}
                #btn-contact{height:30px;line-height:30px;box-sizing:border-box;}

                #${REPLY_WRAPPER}{position:fixed;right:0vw;bottom:10vh;width:25vh;height:50vh;z-index:999;box-sizing:border-box;border:1px solid black;
                display:flex;flex-direction:column;background-color:rgba(255,255,255,0.7);}
                .more-action{width:100px;height:5vh;position:absolute;top:0;left:50%;transform:translate(-50%,-100%);}
                .job-common-reply{width:100%;display:flex;flex-direction:column;flex:1;overflow-y:auto}
                .more-action{width:100%;margin-bottom:20px;display:flex;justify-content:center;}
                .reply-item{padding:2px 0;cursor:pointer;width:100%;word-break:break-all;box-sizing:border-box;border-bottom:1px solid black;}.reply-item:hover{color:red;}
                `
        document.body.appendChild(style);

        // 创建职位信息容器
        const jobWrapper = document.createElement('div');
        jobWrapper.id = JOB_WRAPPER;

        // 创建快速回复容器
        const replyWrapper = document.createElement('div');
        replyWrapper.id = REPLY_WRAPPER;

        document.getElementsByClassName('sec-operate')[0].appendChild(jobWrapper);
        document.body.appendChild(replyWrapper);
    }

    let zpJobList = [];

    const initZp = () => {
        initUI();
        const { getJobList } = zpAPI;
        request(getJobList).then(res => {
            zpJobList = res.zpData.data;
            updateUI();
        })
    }

    window.addEventListener('load', initZp);
})();
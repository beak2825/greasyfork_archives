// ==UserScript==
// @name         人才库插件
// @namespace    http://andodo.net/
// @version      0.2
// @description  获取boss上的约面人员基础信息和简历。
// @author       You
// @match        https://www.zhipin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://unpkg.com/qiniu-js@3.4.2/dist/qiniu.min.js
// @downloadURL https://update.greasyfork.org/scripts/504193/%E4%BA%BA%E6%89%8D%E5%BA%93%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504193/%E4%BA%BA%E6%89%8D%E5%BA%93%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

const sessionStorage = JSON.parse(window.sessionStorage.getItem('rencaiku'));
let truthName = '';
const upParams = [];
let num = 0;
let interviewParams = [];
let friendList = [];
let token = '';
const queueMaxLength = 10;
const queue = [];
let pdfNum = 0;
let baseUrl = 'https://api.andodo.net'

// 获取当前年月
function getYearMonth() {
    const date = new Date();
    let year = date.getFullYear();
    const month = date.getMonth() + 1;
    let fullMonth = month < 10 ? `0${month}` : month;
    if (month === 12) {
        year += 1;
        fullMonth = '01';
    }
    return `${year}${fullMonth}`;
}

function randomStr(len) {
    len = len || 32;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const maxPos = chars.length;
    let result = '';
    for (let i = 0; i < len; i += 1) {
        result += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return result;
}

// 上传七牛
function uploadQiniu(item, encryptUid, uid) {
    let typeStr = ''
    let key = `administration/human-resource/${encryptUid}_${Date.now()}_${randomStr(16)}.${num}`
    if (item.type.indexOf('pdf') !== -1) {
        typeStr = item.type.substring(12)
    } else if (item.type.indexOf('jpeg') !== -1) {
        typeStr = item.type.substring(6)
    } else if (item.type.indexOf('html') !== -1) {
        typeStr = item.type.substring(5)
    }

    const observable = qiniu.upload(item, key, token);
    observable.subscribe({
        next() { },
        error(err) {
            alert(err);
        },
        complete(res) {
            pdfNum += 1;
            upParams.forEach((i) => {
                if (i.uid === uid) {
                    i.resume_assets = res.path;
                }
            });
            if (pdfNum === friendList.length) {
                const XHR = new XMLHttpRequest();
                XHR.open('post', `${baseUrl}/index.php/crawl/rencaiku/save_rencai`);
                XHR.setRequestHeader('Content-Type', 'application/json');
                const sendData = {
                    list: upParams,
                };
                const jsonData = JSON.stringify(sendData);
                XHR.addEventListener('readystatechange', function () {
                    if (this.readyState === 4) {
                        if (this.status !== 200) {
                            alert(`上传简历失败，请联系技术人员查看问题并解决。`);
                        } else if (sessionStorage) {
                            window.sessionStorage.setItem('rencaiku', JSON.stringify(sessionStorage.push(...upParams)));
                        } else {
                            window.sessionStorage.setItem('rencaiku', JSON.stringify(upParams));
                        }
                    }
                });
                XHR.send(jsonData);
            }
        },
    });
}

// 判断是否上传
function judgementIsUpload(boss_uid, account_name, response, encryptUid) {
    const XHR = new XMLHttpRequest()
    XHR.open('get', `${baseUrl}/crawl/rencaiku/is_upload_resume?boss_uid=${boss_uid}&account_name=${account_name}`)
    XHR.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            if (this.status === 200) {
                if (JSON.parse(this.responseText).data) {
                    uploadQiniu(response, encryptUid, boss_uid);
                } else {
                    upParams = upParams.filter(item => item.uid !== boss_uid)
                }
            } else {
                alert('判断简历是否上传失败')
            }
        }
    })

    XHR.send()
}

// 获取PDF文件
function getPdf(encryptUid, uid) {
    const download = function (str) {
        const XHR = new XMLHttpRequest();
        XHR.open('get', `https://www.zhipin.com/wflow/zpgeek/download/preview4boss/${str}`);
        XHR.responseType = 'blob';

        XHR.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (this.status !== 200) {
                    alert(`${uid}获取简历失败，请联系技术人员查看问题并解决。`);
                }
                queue.splice(0, 1);
                judgementIsUpload(uid, truthName, this.response, encryptUid)
            }
        });
        XHR.send();
    };
    if (queue.length <= queueMaxLength) {
        queue.push(true);
        download(encryptUid);
    } else {
        const timer = setInterval(function () {
            if (queue.length <= queueMaxLength) {
                queue.push(true);
                download(encryptUid);
                clearInterval(timer);
            }
        }, 300);
    }
}

async function getToken() {
    return fetch(`${baseUrl}/index.php/crawl/rencaiku/token`, {
        method: 'get',
        headers: {
            'Content-Type': 'json',
        },
    }).then((res) => {
        return res.json();
    });
}

// 获取encryptUid
async function getEncryptUid() {
    const resultToken = await getToken();
    token = resultToken.data;
    const uids = upParams.map((item) => item.uid);
    const XHR = new XMLHttpRequest();
    XHR.open('post', 'https://www.zhipin.com/wapi/zprelation/friend/getBossFriendListV2.json');
    const formData = new FormData();
    formData.append('friendIds', uids.join(','));
    formData.append('dzFriendIds', '');
    XHR.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            friendList = JSON.parse(this.responseText).zpData.friendList;
            friendList.forEach((item) => {
                getPdf(item.encryptUid, item.uid);
            });
        }
    });
    XHR.send(formData);
    // 获取token
}

function getInterviewInfo(uid, geekSource, securityId, obj) {
    const XHR = new XMLHttpRequest();
    XHR.open('get', `https://www.zhipin.com/wapi/zpjob/chat/geek/info?uid=${uid}&geekSource=${geekSource}&securityId=${securityId}`);
    XHR.addEventListener('load', function () {
        num += 1;
        const response = JSON.parse(this.responseText).zpData.data;
        upParams.push({ age: response ? response.ageDesc.substring(0, response.ageDesc.length) : '', life: response ? response.year : '', speciality: response ? (response.major ? response.major : '') : '', last_word: response ? (response.lastCompany ? response.lastCompany : '') : '', education: response ? (response.edu ? response.edu : '') : '', ...obj });
        if (interviewParams.length === num) {
            getEncryptUid();
        }
    });
    XHR.send();
}

// 约面信息
function sendInterview(data) {
    if (data.zpData.interviewList) {
        data.zpData.interviewList.forEach((item) => {
            item.interviewList.forEach((k) => {
                interviewParams.push(k);
            });
        });
    }
    if (sessionStorage && interviewParams.length > 0) {
        interviewParams = interviewParams.filter((k) => !sessionStorage.some((v) => k.geekId === v.uid));
    }

    interviewParams.forEach((item) => {
        const obj = {
            uid: item.geekId || 0,
            name: item.affiliation.interviewerName || '',
            mobile: item.affiliation.phone || '',
            interview_positions: item.affiliation.jobName || '',
            account_name: truthName || '',
            is_arrived: item.status === 8 || item.status === 13 ? '是' : '否',
            no_arrived_remark: item.cancelReason || '',
            interview_at: item.appointmentTime || 0,
            is_pass_interview: item.havenResult === 1 ? 1 : 0,
            gender: item.affiliation.interviewerGender === 1 ? '男' : '女',
            interviewerAvatar: item.affiliation.interviewerAvatar,
            salary: item.affiliation.salary,
            resume_assets: '',
        };
        getInterviewInfo(item.geekId, item.geekSource, item.securityId, obj);
    });
}

// 获取约面列表
function getInterview() {
    window.addEventListener('load', function () {
        const XHR = new XMLHttpRequest();
        XHR.open('get', `https://www.zhipin.com/wapi/zpinterview/boss/interview/calendar?month=${getYearMonth()}`);
        XHR.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                sendInterview(JSON.parse(this.responseText));
            }
        });
        XHR.send();
    });
}

function getNextInterview() {
    window.addEventListener('load', function () {
        const XHR = new XMLHttpRequest();
        XHR.open('get', `https://www.zhipin.com/wapi/zpinterview/boss/interview/calendar?month=${parseInt(getYearMonth(), 10) + 1}`);
        XHR.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                sendInterview(JSON.parse(this.responseText));
            }
        });
        XHR.send();
    });
}

// 请求约面接口

function getInfo() {
    const XHR = new XMLHttpRequest();
    XHR.open('get', `https://www.zhipin.com/wapi/zpboss/h5/user/info`);
    XHR.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            truthName = JSON.parse(this.responseText).zpData.baseInfo.name;
            getInterview();
            getNextInterview();
        }
    });
    XHR.send();
}


function getInterviewUid(uids) {
    const parentElement = document.getElementsByClassName('base-info-single-container')
    const nextElement = document.getElementsByClassName('base-info-single-main')
    const ele = document.getElementsByClassName('add-interview')
    if (ele.length > 0) {
        parentElement[0].removeChild(ele[0])
    }
    const XHR = new XMLHttpRequest();
    XHR.open('post', `${baseUrl}/index.php/crawl/rencaiku/valid_interview`);
    XHR.addEventListener('readystatechange', function () {
        if (this.readyState === 4) {
            nextElement[0].style.paddingTop = '0px'
            const element = document.createElement('div')
            element.classList.add('add-interview')
            element.style.padding = '10px 20px'
            element.style.color = 'white'
            element.style.backgroundColor = JSON.parse(this.responseText).data.length > 0 ? '#00a6a7' : 'orangered'
            element.style.fontSize = '18px'
            element.innerHTML = JSON.parse(this.responseText).data.length > 0 ? '已面试' : '未面试'
            parentElement[0].insertBefore(element, nextElement[0])
        }
    });
    XHR.setRequestHeader("Content-type", "application/json");
    XHR.send(JSON.stringify({ boss_uids: uids }));
}

function getElement() {
    for (const item of document.getElementsByClassName('geek-item')) {
        item.onclick = function () {
            let uid = item.getAttribute('data-id')
            getInterviewUid([uid.substring(0, uid.length - 2)])
        }
    }
    for (const i of document.getElementsByClassName('is-top')) {
        i.onclick = function () {
            let uid = i.getAttribute('data-id')
            getInterviewUid([uid.substring(0, uid.length - 2)])
        }
    }
}

(function () {
    getInfo();
    window.onload = function () {
        if (window.location.href === 'https://www.zhipin.com/web/chat/index') {
            // if (document.getElementsByClassName('geek-item-wrap').length === 0) {
            //     alert('确认该页面的聊天列表是否存在，若存在，则该页面已更新，请查看原本的元素是否存在。')
            // }
            document.getElementsByClassName('user-container')[0].childNodes[0].onscroll = function () {
                getElement()
            }
            getElement()

        }

    }
})();
// ==UserScript==
// @name         GBPX
// @namespace    cosil_gbpx.gd.gov.cn
// @version      0.2
// @description  GDGBPX
// @author       Cosil.C
// @match        http*://gbpx.gd.gov.cn/gdceportal/study/studyCenter.aspx*
// @icon         https://gbpx.gd.gov.cn/gdceportal/favicon.ico
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/517430/GBPX.user.js
// @updateURL https://update.greasyfork.org/scripts/517430/GBPX.meta.js
// ==/UserScript==

console.log('loaded')

if (unsafeWindow.location.pathname == '/gdceportal/Study/StudyCenter.aspx') {
    //监测iframe加载
    new Promise((resolve, reject) => {
        let retry = 10;
        let dataMainLoadingWatcher = setInterval(() => {
            console.log('等待#dataMainIframe加载', retry);
            let targetEle = document.querySelector('#secondIframe')?.contentDocument.querySelector('#thirdIframe')?.contentDocument.querySelector('#dataMainIframe')?.contentDocument.querySelector('a.courseware-list-reed');
            if (targetEle) {
                clearInterval(dataMainLoadingWatcher);
                console.log(`#dataMainIframe加载成功`);
                resolve(targetEle);
                return;
            } else if (--retry < 0) {
                reject();
                return;
            }
        }, 1000)
    }).then(targetEle => {
        handleLearningCourse(targetEle);
    }).catch(err => {
        console.log(err);
        unsafeWindow.location.reload();
    })
}

/**
 * 课程学习的handle函数
 * @param {domNode} targetEle 需要学习课程的"继续/开始学习"按钮dom节点 
 */
async function handleLearningCourse(targetEle) {
    //初始化学习配置
    let code = /(?<=t=)[^&"]+/.exec(targetEle.href)[0],
        courseLabel = /(?<=courseLabel=)[^&"]+/.exec(targetEle.href)[0],
        courseId = /(?<=courseId=)[^&"]+/.exec(targetEle.href)[0],
        progress = parseInt(/[0-9\.]+/.exec(targetEle.getAttribute('title'))[0]);//不用parseFloat是为了懒得写去尾法
    let headStr = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'token': localStorage.getItem("token"),
        };
    let api = {
            remotePc: 'https://appd.shawcoder.xyz/',
            verifyModule: {
                access_token: function (requestData, async = true) {
                    headStr.referer = targetEle.href;
                    return requestFunction({ 'url': api.remotePc + 'auth/auth/access_token', 'type': 'post', 'data': requestData, 'async': async, headers: headStr})
                }
            },
            //课程播放接口
            courseModule: {
                createRes: function (requestData, async = true) {
                    headStr.referer = api.remotePc + '/gdcecw/play_pc/playmp4_pc.html';
                    return requestFunction({ 'url': api.remotePc + 'resplay/resCoursse/createRes', 'type': 'post', 'data': requestData, 'async': async, headers: headStr})
                },
                heartbeat: function (requestData, async = true) {
                    headStr.referer = api.remotePc + '/gdcecw/play_pc/playmp4_pc.html';
                    return requestFunction({ 'url': api.remotePc + 'resplay/resCoursse/heartbeat', 'type': 'post', 'data': requestData, 'async': async, headers: headStr})
                },
                finished: function (requestData, async = true) {
                    headStr.referer = api.remotePc + '/gdcecw/play_pc/playmp4_pc.html';
                    return requestFunction({ 'url': api.remotePc + 'resplay/resCoursse/finished', 'type': 'post', 'data': requestData, 'async': async, headers: headStr})
                },
            }
        }

    //校验token(无token或code变更)
    if (!headStr.token || localStorage.getItem("code") != code || headStr.token == 'null' || headStr.token == 'undefined') {
        let ts = String(new Date().getTime()).substring(0, 10),
            signature = sha1(code + ts + "gbpx@2020");
        await api.verifyModule.access_token({ "code": code, "ts": ts, "signature": signature }, false).then(res => {
            if (res.response.status == 200) {
                headStr.token = res.response.data;
                console.log('获取token成功', headStr.token)
                localStorage.setItem("signature", signature);
                localStorage.setItem("code", code);
                localStorage.setItem("token", headStr.token);
                // unsafeWindow.location.reload();
            } else {
                if(confirm('学习配置失效，需要重新登陆，点击"确定"将清除缓存并退出登录')){
                    localStorage.clear();
                    unsafeWindow.logOut();            
                }
                throw res.response.msg;
            }
        })
    } else {
        console.log('加载token成功', headStr.token)
    }

    //拉取课程信息
    api.courseModule.createRes({ "labelId": courseLabel, "courseId": courseId }).then(async res => {
        if (res.response.status == 200) {
            let courseInfo = res.response,
                intervalSec = 60,//心跳间隔
                secNeed = secLeft = Math.ceil(courseInfo.data.course.courseDuration * (100 - progress) / 100);//进一法
            //上次未结束计时先结束一次
            if ('exit' != localStorage.getItem('lastBeatType')) {
                console.log(`上一次学习未结束计时 lastBeatType:${localStorage.getItem('lastBeatType')}`)
                await api.courseModule.heartbeat({
                    "labelId": courseLabel,
                    "courseId": courseId,
                    "callbackId": null,
                    "event": 'exit',
                    "scoData": JSON.stringify({
                        "cmi.core.lesson_location": courseInfo.data.sco["cmi.core.lesson_location"],
                        'cmi.core.session_time': parseHHmmssFromSec(courseInfo.data.course.courseDuration)
                    })
                }, false).then(() => { location.reload() })
            }
            //初始beat
            await api.courseModule.heartbeat({
                "labelId": courseLabel,
                "courseId": courseId,
                "callbackId": null,
                "event": 'beat',
                "scoData": JSON.stringify({
                    "cmi.core.lesson_location": courseInfo.data.sco["cmi.core.lesson_location"],
                    'cmi.core.session_time': '00:00:00'
                })
            }, false).then(() => {
                console.log('初始beat成功',
                    `courseId${courseId}`,
                    `名称:${courseInfo.data.course.courseName}`,
                    `进度${progress}`,
                    `总时间${parseHHmmssFromSec(courseInfo.data.course.courseDuration)}`,
                    `需要时间${parseHHmmssFromSec(secNeed)}`,
                );
            });
            targetEle.parentElement.parentElement.style.backgroundColor = 'yellow';
            let learningInterval = setInterval(() => {
                secLeft--;
                targetEle.innerText = `${parseHHmmssFromSec(secLeft)}`;
                let secCount = secNeed - secLeft;
                if (secLeft <= 0) {
                    clearInterval(learningInterval);
                    api.courseModule.heartbeat({
                        "labelId": courseLabel,
                        "courseId": courseId,
                        "callbackId": null,
                        "event": 'exit',
                        "scoData": JSON.stringify({
                            "cmi.core.lesson_location": courseInfo.data.sco["cmi.core.lesson_location"],
                            'cmi.core.session_time': parseHHmmssFromSec(secCount)
                        })
                    }).then(() => {
                        console.log('结束beat',
                            `courseId${courseId}`,
                            `名称:${courseInfo.data.course.courseName}`,
                            `已经学习时间${parseHHmmssFromSec(secCount)}`);
                        location.reload();
                    });
                } else if ((secNeed - secLeft) % intervalSec == 0) {
                    //学习beat
                    api.courseModule.heartbeat({
                        "labelId": courseLabel,
                        "courseId": courseId,
                        "callbackId": null,
                        "event": 'beat',
                        "scoData": JSON.stringify({
                            "cmi.core.lesson_location": courseInfo.data.sco["cmi.core.lesson_location"],
                            'cmi.core.session_time': parseHHmmssFromSec(secCount)
                        })
                    }).then(() => {
                        console.log('学习beat',
                            `courseId${courseId}`,
                            `名称:${courseInfo.data.course.courseName}`,
                            `进度${progress}`,
                            `总时间${parseHHmmssFromSec(courseInfo.data.course.courseDuration)}`,
                            `需要时间${parseHHmmssFromSec(secNeed)}`,
                            `已经学习时间${parseHHmmssFromSec(secCount)}`,
                            `剩余时间${parseHHmmssFromSec(secLeft)}`
                        )
                    })
                }
            }, 1000);
        } else {
            throw res.response.msg;
        }
    })
}

/**
 * @desc GM_xmlhttpRequest的promise封装
 * @param {object} request 
 * @returns {promise} promise对象
 */
async function requestFunction(request) {
    let promise = new Promise((reslove, reject) => {
        GM_xmlhttpRequest({
            url: request.url,
            method: request.type,
            headers: request.headers,
            responseType: "json",
            // processData: processData,
            data: Object.keys(request.data).map(key => encodeURIComponent(key) + "=" + encodeURIComponent(request.data[key])).join('&'),
            onload: res => {
                if (request?.data?.event) {
                    localStorage.setItem('lastBeatType', request.data.event);
                }
                if (res.response.status != 401) {
                    reslove(res);
                }
            },
            onerror: err => {
                if (typeof reject === "function") {
                    reject(err)
                } else {
                    throw err;
                }
            }
        })
    })
    return request.async ? promise : (await promise);
}

/**
 * @return 秒转为HH:mm:ss
 * @param {integer} sec 秒
 */
function parseHHmmssFromSec(sec) {
    let s = parseInt(sec % 60),
        m = (sec - s) % 3600 / 60,
        h = (sec - m * 60 - s) / 3600;
    return `${`${h}`.padStart(2, 0)}:${`${m}`.padStart(2, 0)}:${`${s}`.padStart(2, 0)}`;
}
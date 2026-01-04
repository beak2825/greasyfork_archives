// ==UserScript==
// @name         青书学堂视频挂机
// @namespace    https://github.com/lanomw
// @version      1.2.3
// @description  青书学堂视频自动静音播放，解放双手。支持自动播放视频、作业答案自动填入
// @author       lanomw
// @match        *://*.qingshuxuetang.com/*
// @icon         https://degree.qingshuxuetang.com/resources/default/images/favicon.ico
// @require      https://unpkg.com/pxmu@1.1.0/dist/web/pxmu.min.js
// @require      https://lib.baomitu.com/lodash.js/latest/lodash.min.js
// @run-at       document-body
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445642/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/445642/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%A7%86%E9%A2%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict'

    // 考试页面解除复制
    if (location.href.indexOf('ExamPaper') !== -1) {
        $('*').unbind('copy')
        return
    }

    // 做作业
    if (location.href.indexOf('ExercisePaper') !== -1) {
        listenSource([
            {
                fn: () => $('.question-detail-options .question-detail-option').length,
                callback: autoFillAnswer
            },
        ]);
        return
    }

    // 看网课
    if (location.href.indexOf('CourseShow') !== -1) {
        listenSource([
            {
                fn: () => _.has(window, 'CoursewarePlayer.videoPlayer.player'),
                callback: autoPlayVideo
            },
            {
                fn: () => _.has(window, 'CoursewareNodesManager'),
                callback: proxyRenderMenu
            }
        ]);
    }
})();

// url参数转换为对象
function UrlSearch() {
    const search = location.search.replace('?', '')
    const params = {}
    const arr = search.split('&')
    arr.forEach(item => {
        const pArr = item.split('=')
        params[pArr[0]] = pArr[1]
    })

    return params
}

/**
 * 监听资源是否执行完成
 * @param listen - 资源监听
 * [{
 *     fn: 返回值为真时，执行callback并移除任务
 *     callback: 回调
 * }]
 */
function listenSource(listen = []) {

    function setup() {
        listen.forEach((item, index) => {
            const {fn, callback} = item;

            if (fn()) {
                callback();
                listen.splice(index, 1);
            }
        })

        if (listen.length) {
            requestAnimationFrame(setup);
        }
    }

    if (listen.length) {
        requestAnimationFrame(setup);
    }
}

window.Manager = {
    search: UrlSearch(), // url参数
    menus: [], // 菜单渲染节点
}

// tree 菜单抹平为一级菜单。用于执行课程切换的数据在叶子节点，其余为无用的导航菜单
function buildMenus(nodes) {
    const menus = [];

    function recursiveNodes(nodes) {
        nodes.forEach(function (node) {
            if (node.nodes) {
                recursiveNodes(node.nodes)
            } else {
                menus.push(node)
            }
        })
    }

    recursiveNodes(nodes)

    return menus
}

// 自动播放视频
function autoPlayVideo() {
    // 静音、倍速
    CoursewarePlayer.videoPlayer.player.muted(true)
    CoursewarePlayer.videoPlayer.player.playbackRate(2)
    CoursewarePlayer.videoPlayer.player.currentTime(0)

    // 自动播放视频、播放结束跳转下一课程
    CoursewarePlayer.addListener('ended', function () {
        const nextNodeId = getNextLesson()

        if (nextNodeId) {
            CoursewareNodesManager.onMenuClick(nextNodeId)
        } else {
            pxmu.diaglog({
                congif: {
                    btncount: true,
                },
                content: {
                    text: '本课程已播放完成，请手动检查成绩',
                }
            }).then(function (res) {
                pxmu.closediaglog();
            });
        }
    })

    // 播放视频
    CoursewarePlayer.play()
}

// 菜单渲染拦截
function proxyRenderMenu() {
    const _renderMenu = CoursewareNodesManager.renderMenu

    CoursewareNodesManager.renderMenu = function (menuContainerId, coursewareNodes, onMenuClick) {
        _renderMenu(menuContainerId, coursewareNodes, onMenuClick)

        Manager.menus = buildMenus(coursewareNodes)

    }
}

// 解析 url nodeId，从菜单获取下一课程的 nodeId
function getNextLesson() {
    const menus = Manager.menus

    for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === Manager.search.nodeId) {
            return (menus[i + 1] || {}).id
        }
    }
}

// 答案自动填入
function autoFillAnswer() {
    var urlSearch = UrlSearch()

    fetch(`https://degree.qingshuxuetang.com/xnsy/Student/DetailData?_t=${new Date().getMilliseconds()}&quizId=${urlSearch.quizId}`, {
        method: 'GET', headers: {
            Host: 'degree.qingshuxuetang.com',
            Cookie: Object.entries(Cookies.get()).map(([key, value]) => `${key}=${value}`).join('; '),
            Referer: `https://degree.qingshuxuetang.com/xnsy/Student/ExercisePaper?courseId=${urlSearch.courseId}&quizId=${urlSearch.quizId}&teachPlanId=${urlSearch.teachPlanId}&periodId=${urlSearch.periodId}`,
            'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': 'macOS',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }).then(res => res.json()).then(res => {
        var questions = res.data.paperDetail.questions

        Object.values(questions).forEach(item => {
            // 处理单选/多选 答案填入
            for (let i = 0; i < item.solution.length; i++) {
                $(`#${item.questionId}_${item.solution.charAt(i)}`).click()
            }
        })

        pxmu.success({
            msg: '答案已自动填入', bg: '#4CC443',
        })
    }).catch(err => {
        pxmu.fail({
            msg: '答案已填入失败。请手动填入答案', bg: 'red',
        })

        setTimeout(() => {
            // 异常则直接打开答案查看页面。窗口可能会被浏览器拦截。需要允许
            window.open(location.href.replace('ExercisePaper', 'ViewQuiz'), '_blank')
        }, 1500)

        console.error(err)
    });
}

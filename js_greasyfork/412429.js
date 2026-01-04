// ==UserScript==
// @name        学堂云答题助手
// @namespace   Violentmonkey Scripts
// @match       scut.yuketang.cn/pro/lms/*
// @version     0.7
// @author      cat1007
// @grant       GM_xmlhttpRequest
// @require     https://apps.bdimg.com/libs/jquery/2.1.1/jquery.min.js
// @require     https://unpkg.com/axios/dist/axios.min.js
// @description 学堂云4.0答案查询
// @downloadURL https://update.greasyfork.org/scripts/412429/%E5%AD%A6%E5%A0%82%E4%BA%91%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/412429/%E5%AD%A6%E5%A0%82%E4%BA%91%E7%AD%94%E9%A2%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var url
var paraList
var sign
var classroomId
var id

var probs = []
var ans = []
var lid

function showPlane() {
    var area = $('<div id="area" style="position: fixed;right: 20px;top: 70px;width: 300px;background-color: #ffffff; padding: 10px;box-shadow: 0 1px 4px rgba(0,0,0,.1);border-radius: 4px;z-index: 100;"><button id="launch" style="padding: 10px 20px;background: #5096f5;font-size: 14px;color: #fff;border-radius: 4px;margin-right: 10px;display: block;">答题界面点击拉取答案</button><button id="speed" style="padding: 10px 20px;background: #5096f5;font-size: 14px;color: #fff;border-radius: 4px;margin-top: 10px;display: block;">速度加快速度加快<br\>(看完后刷新一下同步进度)</button><div id="plane"></div></div>')
    $("body").append(area)
    $("#launch").on("click", get)
    $("#speed").on("click", speedUp)
}

function launch(ans) {
    var ul = $('<ul id="ansList"></ul>')
    for (let i = 0; i < ans.length; i++) {
        let str = "题目"+ ans[i].index + "： "
        for (let k = 0;k<ans[i].ansContent.length;k++) {
            str = str + ' ' + ans[i].ansContent[k]
        }

        let li = $('<li style="padding: 10px 20px;font-size: 14px;"></li>').text(str)
        ul.append(li)
    }
    $("#plane").append(ul)
    $("#launch").text("切换章节后重新选择")
}

function get() {
    url = window.location.href
    paraList = url.split("/")


    sign = paraList[5]
    classroomId = paraList[6]
    id = paraList[8]

    $("#ansList").remove("#ansList")
    $("#launch").text("loading")

    // 获取叶节点练习id
    const idApi = "https://scut.yuketang.cn/mooc-api/v1/lms/learn/leaf_info/" + classroomId + "/" + id + "/?sign=" + sign + "&term=latest&uv_id=2627"

    var headers = {
        'university-id': '2627',
        'x-csrftoken': 'G9oqKcclwAg8eNrKzdv12EL0PNrufEXE',
        'xtbz': 'cloud'
    }

    axios.get(
        idApi,
        { headers: headers }
    ).then(function (response) {
        // 获取叶节点成功
        lid = response.data.data.content_info.leaf_type_id
        console.log(lid);

        // 拉取练习列表
        const excApi = "https://scut.yuketang.cn/mooc-api/v1/lms/exercise/get_exercise_list/" + lid + "/?term=latest&uv_id=2627"
        axios.get(
            excApi,
            { headers: headers }
        ).then(function (response) {
            // 获取题目信息
            probs = response.data.data.problems
            ans = Array()
            console.log(probs)
            for (let i = 0; i < probs.length; i++) {
                ans.push({
                    index: probs[i].index,
                    ansContent: probs[i].user.answer
                })
            }
            launch(ans)
        })
    })
}

showPlane()

// 倍速播放功能
var playRate = 10
var video = null

function speedUp() {
    console.log("speed up")

    video = $(".xt_video_player")[0]
    setInterval(function () {
        video.playbackRate = playRate
    }, 100)
}
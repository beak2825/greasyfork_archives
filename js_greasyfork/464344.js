// ==UserScript==
// @name         优学院作业互评显示评分人名字
// @namespace    https://greasyfork.org/zh-CN/users/953334
// @version      0.0.3
// @description  让我看看是谁给我的作业打了100分？
// @author       ZM25XC itsdapi
// @match        https://homework.ulearning.cn/
// @icon         https://www.ulearning.cn/ulearning/favicon.ico
// @run-at       document-start
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464344/%E4%BC%98%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E4%BA%92%E8%AF%84%E6%98%BE%E7%A4%BA%E8%AF%84%E5%88%86%E4%BA%BA%E5%90%8D%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/464344/%E4%BC%98%E5%AD%A6%E9%99%A2%E4%BD%9C%E4%B8%9A%E4%BA%92%E8%AF%84%E6%98%BE%E7%A4%BA%E8%AF%84%E5%88%86%E4%BA%BA%E5%90%8D%E5%AD%97.meta.js
// ==/UserScript==

(function () {
    'use strict';
    main()


    async function main() {
        try {
            const params = getParams()
            const homeworkData = await getHomeworkDetail(params.homeworkid, params.studentid, params.classid, params.token)
            const peerHomeworkData = await getPeerHomeworkDetail(params.homeworkid, params.studentid, params.token)
            const getHomeworkData = await buildInfoList(params.homeworkid,params.classid, homeworkData, params.token)
            const getPeerHomeworkData = await buildInfoList(params.homeworkid,params.classid, peerHomeworkData, params.token)
            await showHomework(getHomeworkData)
            await showPeerHomework(getPeerHomeworkData)
        } catch (error) {
            console.log(error)
        }

    }


    function getParams() {
        const url = window.unsafeWindow.location.href
        const match1 = /stuDetail/gm
        const target = url.substring(match1.exec(url).index + match1.toString().length - 3)
        const studentid = target.split('/')[0]
        const homeworkid = target.split('/')[1].split('?')[0]
        const match2 = /ocId/gm
        const classid = url.substring(match2.exec(url).index + match2.toString().length - 3)
        const cookies = document.cookie
        const token = /token.*?(;|$)/gm.exec(cookies)[0].substring(6).slice(0, -1)
        return {
            studentid,
            homeworkid,
            classid,
            token
        }
    }


    //获取评价同学userID
    async function getHomeworkDetail(homeworkid, studentid, classid, token) {
        const url = `https://homeworkapi.ulearning.cn/stuHomework/homeworkDetail/${homeworkid}/${studentid}/${classid}`
        const result = await send(url, token)
        return result.result.peerReviewHomeworkList
    }

    //获取评价任务同学userID
    async function getPeerHomeworkDetail(homeworkid, studentid, token) {
        const url = `https://homeworkapi.ulearning.cn/stuHomework/peerReviewHomeworkDatil/${homeworkid}/${studentid}`
        const result = await send(url, token)
        return result.result
    }

    //获取评价同学姓名
    async function getInfo(homeworkid,classid, user_id, token) {
        let url = `https://homeworkapi.ulearning.cn/homework/historyStudentHomework/${user_id}/${user_id}/${homeworkid}`
        const result = await send(url, token)
        url=`https://courseapi.ulearning.cn/classes?ocId=${classid}&pn=1&ps=9999&userId=${user_id}&keyword=&lang=zh`
        const info=await send(url,token)
        if (info.list.length){
            result.result.user["className"]=info.list[0].className
        }else {
            result.result.user["className"]=null;
        }
        return result.result.user
    }

    async function buildInfoList(homeworkid,classid, data, token) {
        let result_list = []
        for (let i = 0; i < data.length; i++) {
            let result = await getInfo(homeworkid,classid, data[i].userID, token)
            result_list.push(result)
        }
        return result_list

    }

    async function showHomework(info) {
        await waitLoad()
        let peerHomeworkItemEle = document.querySelectorAll('.peermain')
        if (peerHomeworkItemEle.length !== 0) {
            for (let [index, scoreWrapper] of peerHomeworkItemEle.entries()) {
                scoreWrapper.insertAdjacentHTML('afterend', `<div>评价人：${info[index].name}  学号：${info[index].studentid} 班级：${info[index].className}</div>`)
            }
        } else {
            let myHomeworkEle = document.querySelectorAll('.stuworkdetails-zone')
            for (let _info of info) {
                myHomeworkEle[0].insertAdjacentHTML('afterend', `<div>等待评价：${(_info.name)}  学号：${_info.studentid} 班级：${_info.className}</div>`)
            }

        }
    }

    async function showPeerHomework(info) {
        await waitLoad()
        let peerHomeworkEle = document.querySelectorAll('.peer_host')
        for (let [index, scoreWrapper] of peerHomeworkEle.entries()) {
            scoreWrapper.insertAdjacentHTML('afterend', `<div>待评价人员：${info[index].name} 学号：${info[index].studentid} 班级：${info[index].className}</div>`)
        }
    }

    function waitLoad() {
        return new Promise((res) => {
            for (let index = 0; index < 10; index++) {
                setTimeout(() => {
                    if (document.getElementById('app') !== null) {
                        res()
                    }
                }, 500);
            }
        })
    }

    function send(url, token) {
        const xhr = new XMLHttpRequest()
        return new Promise((res, rej) => {
            xhr.open('GET', url, true)
            xhr.setRequestHeader("AUTHORIZATION", token)
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const status = xhr.status;
                    if (status === 0 || (status >= 200 && status < 400)) {
                        res(JSON.parse(xhr.responseText))
                    } else {
                        rej(xhr.responseText)
                    }
                }
            };
            xhr.send()
        })
    }
})();
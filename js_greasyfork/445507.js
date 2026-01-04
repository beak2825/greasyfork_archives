// ==UserScript==
// @name         太翼自动播放Plus
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  通过调用接口模拟学习过程
// @author       Driss_Angel
// @match        https://*.coolcollege.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445507/%E5%A4%AA%E7%BF%BC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BEPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/445507/%E5%A4%AA%E7%BF%BC%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BEPlus.meta.js
// ==/UserScript==

let doclist = []
let param = {}

const start = () =>{
    parseHref()
    parseStorage()
    fetchList()
}

const parseHref = () => {
    const index = window.location.href.indexOf('#')
    const url = new URL(''.concat('https://pro.coolcollege.cn', window.location.href.substr(index+1)))
    param.studyId = url.searchParams.get('id')
    if(!param.studyId){
        return
    }
    param.studyType = url.searchParams.get('fromPage')
    if(!param.studyType){
        param.studyType = 'courseProject'
    }
}

const parseStorage = () => {
    param.uid = localStorage.getItem('uid')
    param.enterpriseId = localStorage.getItem('enterpriseId')
    param.token = localStorage.getItem('token')
}

const fetchList = () => {
    fetch(getUrl('list'), {
        method: 'get',
        headers: {
            'x-access-token': param.token
        }
    }).then((response) => response.json())
        .then((json) => {
        if(json.stages == null){
            return
        }
        for(var i = 0; i < json.stages.length; i++) {
            for(var j = 0; j < json.stages[i].resources.length; j++){
                var resource = json.stages[i].resources[j]
                doclist.push(resource)
            }
        }
        autoPlay()
    })
}

const getUrl = (urlType) => {
    if(urlType == 'records'){
        return ''.concat('https://grcoolapi.coolcollege.cn', '/knowledge-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/study_records/save')
    }
    if(param.studyType == 'myObligatoryTask' || param.studyType == 'myElectiveTask' || param.studyType == 'myTestTask'){
        if(urlType == 'list'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/training-manage-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/study_projects/').concat(param.studyId, '/query_fast')
        }
        if(urlType == 'progress'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/training-manage-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/studies/').concat(param.studyId, '/courses/').concat(param.courseId, '/resources/').concat(param.courseId, '/save_progress')
        }
    }
    if(param.studyType == 'enterprise'){
        if(urlType == 'list'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/knowledge-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/courses/').concat(param.courseId, '/query_fast')
        }
        if(urlType == 'progress'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/knowledge-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/courses/').concat(param.courseId, '/resources/').concat(param.courseId, '/save_progress')
        }
    }
    if(param.studyType == 'courseProject'){
        if(urlType == 'list'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/training-manage-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/study_projects/').concat(param.studyId, '/query_fast')
        }
        if(urlType == 'progress'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/training-manage-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/study_projects/').concat(param.studyId, '/courses/').concat(param.courseId, '/resources/').concat(param.courseId, '/save_progress')
        }
    }
    if(param.studyType == 'platform' || param.studyType == 'purchased'){
        if(urlType == 'list'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/knowledge-api/v2/').concat(param.enterpriseId, '/users/').concat(param.uid, '/courses/').concat(param.courseId, '/query_fast')
        }
        if(urlType == 'progress'){
            return ''.concat('https://grcoolapi.coolcollege.cn', '/platform-api/v2/courses/').concat(param.courseId, '/resources/').concat(param.courseId, '/save_progress')
        }
    }
}

const sleep = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout))
}

async function autoPlay() {
    for(var i=0; i< doclist.length; i++){
        if(doclist[i].studyProgress < 100){
            doPlay(doclist[i])
            var leftTime = parseInt(doclist[i].duration) - parseInt(doclist[i].recent_start)
            await sleep(leftTime * 100)
        }
    }
}

async function doPlay(e) {
    var recentStart = parseInt(e.recent_start)
    var time = Date.parse(new Date)
    const duration = parseInt(e.duration)
    param.courseId = e.course_id
    for(recentStart; recentStart <= duration + 20; recentStart = recentStart+20) {
        var complete = (recentStart >= duration)

        await sleep(1000)

        fetch(getUrl('progress') , {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': param.token
            },
            body: JSON.stringify({
                'progress': complete ? 100 : parseInt(recentStart*100 / duration) ,
                'recent_start': recentStart ,
                'tempTime': time,
                'access_token': param.token
            })
        })

        await sleep(1000)

        fetch(getUrl('records'), {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': param.token
            },
            body: JSON.stringify({
                'action_type': 'study',
                'plan_id': param.studyId,
                'course_id':  param.courseId,
                'resource_id':  param.courseId,
                'plan_type': 'project',
                'access_token':param.token
            })
        })

        time = time + 20000
    }
    alert(e.resource_name + '已完成!')
}

start()

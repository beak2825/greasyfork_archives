// ==UserScript==
// @name         若离智慧校园
// @namespace    若离智慧校园，解决宜宾学院智慧校园的题目，能够自动获取宜宾学院的智慧校园的作业的答案，前提是你做了一遍后可以看到自己做过的答案
// @version      1.3
// @description  若离智慧校园，解决宜宾学院智慧校园的题目，能够自动获取宜宾学院的智慧校园的作业的答案，能够跳过秒看教学视频
// @author       若离QQ：2909998156
// @match        https://mooc.yibinu.edu.cn/*
// @icon         https://q1.qlogo.cn/g?b=qq&nk=2909998156&s=100
// @resource cs1 https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.css
// @resource cs2 https://pan.ruoli.cc/s/8b0cc4
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/vue/2.6.14/vue.min.js
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/ant-design-vue/1.7.8/antd.min.js
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/426615/%E8%8B%A5%E7%A6%BB%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/426615/%E8%8B%A5%E7%A6%BB%E6%99%BA%E6%85%A7%E6%A0%A1%E5%9B%AD.meta.js
// ==/UserScript==

// 脚本初始化
var setting = {'logs':['初始化脚本完成,若离QQ：2909998156','当前脚本版本：V1.3'],'datas': []};

// 日志
function log(logText){
    setting.logs.unshift(logText);
    if(Math.random() > 0.92){
        setting.logs.unshift('请勿用于非法用途哦！！');
    }
}


// 从后台获取答案
function getAnswer(url, data){
    log('获取答案中');
    let id = url.match(/\/examSubmit\/(\d+)\/getExamPaper/)[1]
    GM_xmlhttpRequest({
        method: "post",
        url: url,
        data: data,
        dataType: 'json',
        headers: {
            'Origin': location.origin,
            'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Referer': `https://mooc.yibinu.edu.cn/examTest/stuExamList/{id}.mooc`
        },
        onload: function(res){
            console.log('res',res)
            if(res .status == 200){
                let obj = $.parseJSON(res.responseText).paper.paperStruct;
                log("获取答案完成，正在格式化答案！");
                setTimeout(formatAnswer, 2000, obj);
            }else{

            }
        }
    });
}
//格式化答案
function formatAnswer(str){
    str.forEach((listItem,index) => {
        //遍历出问题
        var question = listItem.quiz.quizContent;
        //如果存在选项，那么必定是单选或者多选，先将选项便利出来
        var options = []; //定义选项的数组
        var answer = []; //定义答案的数组
        if(listItem.quiz.quizOptionses.length != 0){
            //console.log(listItem);
            //将遍历出来的选项添加到选项数组
            listItem.quiz.quizOptionses.forEach((optionItem, index) =>{
                options[optionItem.optionId] = String.fromCharCode(65+index) + "：" +optionItem.optionContent;
            })
            //将遍历出来的答案添加到答案数组
            listItem.quiz.quizResponses.forEach(answerItem =>{
                answer.push(options[answerItem.optionId]);
            })
        }else{//不存在选项，也就是填空题
            listItem.quiz.quizResponses.forEach(answerItem =>{
                answer.push(answerItem.responseContent);
            })
        }
        setting.datas.push({'id':index + 1 ,'question':question, 'answer': answer});
    })
    log('若您觉得本脚不错，记得赞助哦');
    log('官方交流群：183937365欢迎大家加入！');
    log('格式化完成');
    log('请切换到功能页面查看答案哦')
}
//初始化界面
function initView(){
    var $div =$('<div class="rlBox" :style="{opacity: isShow}">' +
		'	<a-card title="宜宾学院智慧校园助手" style="width: 100%;height: 100%;">' +
		'		<a style="opacity: 1 !important;" slot="extra" href="#">' +
		'			<a-button @click="toClose()" size="small" ghost :type="buttonColor" shape="circle" :icon="buttonIcon" />' +
		'		</a>' +
		'		<a-tabs default-active-key="1" @change="callback">' +
		'			<a-tab-pane key="1" tab="日志">' +
		'				<div class="rl-panel log">' +
		'					<p v-for="item in logs" class="log_content">' +
		'						{{item}}' +
		'					</p>' +
		'				</div>' +
		'			</a-tab-pane>' +
		'			<a-tab-pane key="2" tab="功能">' +
		'				<div class="rl-panel">' +
		'					<div class="opr">' +
		'						<a-button-group>' +
		'							<a-button size="small" type="danger" @click="passVideo()">秒过视频</a-button>' +
        '                           <a-button size="small" type="dashed" @click="exportExcel()">导出excel</a-button>' +
		'							<a href ="https://pay.ruoli.cc/" target="_blank"><a-button size="small" type="primary">赞助脚本</a-button></a>' +
		'							<a href ="https://jq.qq.com/?_wv=1027&k=OPpSeMCZ" target="_blank"><a-button size="small" >加入群聊</a-button></a>' +
		'						</a-button-group>' +
		'					</div>' +
		'					<a-table id="rlTable"' +
		'					:scroll="{y: 275}" :pagination="false" bordered size="small" :columns="columns" :data-source="answerList">' +
		'					</a-table>' +
		'				</div>' +
		'			</a-tab-pane>' +
		'		</a-tabs>' +
		'	</a-card>' +
		'</div>');
    $("body").append($div);
    GM_addStyle(GM_getResourceText("cs1"));
    GM_addStyle(GM_getResourceText("cs2"));
    var vue = new Vue({
			el: '.rlBox',
			data:{
				logs: setting.logs,
				close: false,
                key: '1',
				columns:[
                    {
                        title: '序号',
                        dataIndex: 'id',
                        key: 'id',
                        width: '40px'
                    },
                    {
                        title: '题目',
                        dataIndex: 'question',
                        key: 'question',
                        ellipsis: true
                    },
                    {
                        title: '答案',
                        dataIndex: 'answer',
                        key: 'answer',
                    },
                ],
                answerList:setting.datas,

			},
        	computed:{
					isShow(){
						return this.close? 0.1: 1.0;
					},
					buttonIcon(){
						return this.close? 'check': 'close';
					},
					buttonColor(){
						return this.close? 'primary': 'danger';
					}
				},
				methods: {
					callback(key) {
						this.key = key;
					},
					toClose(){
						this.close = !this.close;
					},
                    passVideo(){
                        let video = document.getElementsByTagName("video");
                        if(video.length == 0){
                            log("您当前页面不存在视频，请先打开学习视频页面");
                        }else{
                            document.getElementsByTagName("video")[0].currentTime=document.getElementsByTagName("video")[0].duration;
                            log("视频已秒刷完成！");
                        }
                    },
                    exportExcel(){
                        // 获取table
                        let table = document.querySelectorAll("#rlTable table")
                        let html =  '<html><head><meta charset="UTF-8"></head><body>'
                        table.forEach(item => {
                            html += item.outerHTML
                        })
                        html+= '</body></html>'
                        //base64 URL形式文件下载
                        let oa = document.createElement('a');
                        oa.href = 'data:application/vnd.ms-excel;base64,'+window.btoa(unescape(encodeURIComponent(html)));
                        oa.download = '题库.xls';//通过A标签 设置文件名
                        oa.click();
                    }
				}

		});
}





// 初始化获取答案，延迟5秒防止流程崩溃
function initGetAnswer(settings){
    var url = location.origin + settings.url;
    var data = settings.data.replace(/(testPaperId=).*?(&)/,'$1' + '1250' + '$2');
    console.log("=====")
    console.log(url,'url')
    console.log(data)
    getAnswer(url,data);
}




// 脚本入口
initView();
//监听跳过视频按钮
$('#rl_passVideo').click(function(){passVideo();});
//监听url访问，当访问了加载题目的url时，将获取答案
$(document).ready(function(){
    $(document).ajaxComplete(function (evt, request, settings) {
        if(settings.url.search('getExamPaper') != -1){
            setting.logs.unshift("您已打开作业界面，5秒后将为您获取答案")
            setTimeout(initGetAnswer,5000, settings);
        }
    });
})

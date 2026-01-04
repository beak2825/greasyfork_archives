// ==UserScript==
// @name         法宣答题
// @namespace    http://fstask.com/
// @version      0.1
// @description  法宣学习
// @author       alfa
// @match        http://www.faxuanyun.com/sps/exercises/t/exercies_3_t.html?*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/430595/%E6%B3%95%E5%AE%A3%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/430595/%E6%B3%95%E5%AE%A3%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

var study_css = ".egg_study_btn{outline:0;border:0;position:fixed;top:25%;right:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);
var answer = [];
var times = 0;
var totalTimes = 0;
$(document).ready(function(){

                //创建"开始学习"按钮
                createStartButton();
})

function createStartButton(){
    let base = document.createElement("div");
    var baseInfo="";

    let body = document.getElementsByTagName("body")[0];

    let startButton = document.createElement("button");
    startButton.setAttribute("id","startButton");
    startButton.innerText = "开始学习";
    startButton.className = "egg_study_btn egg_menu";
    //添加事件监听
    try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click",start,false);
    }catch(e){
        try{// IE8.0及其以下版本
            startButton.attachEvent('onclick',start);
        }catch(e){// 早期浏览器
            console.log("不学习何以强国error: 开始学习按钮绑定事件失败")
        }
    }
    //插入节点
    body.append(startButton)
}
async function start(){
      console.debug('开始');
    let paperId = $('#hid').attr('value')

    let seriesId = await getCookie(`ex_range_${paperId}`)
    let answerUrl = `http://www.faxuanyun.com/ess/service/getpaper?paperId=${paperId}&series=${seriesId}_answer`
    fetch(answerUrl, {
        "headers": {
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "upgrade-insecure-requests": "1"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "no-cors",
        "credentials": "include"
    }).then(res => res.text()).then(async body => {

                if (!body) {
                        console.log('响应结果异常！')
                        return;
                }
        let answerString = body.split("\n")[2];
        answer = JSON.parse(answerString);
        totalTimes = answer.length;
       await Next();
    });
}
async function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}

async function Next(){
var questionId = answer[times]['questionId']
    console.log("questionId", questionId)
    // $(`[id$=_${questionId}]`).click();
    $(`li[value=${questionId}]`).children('a').get(0).click()
    setTimeout(
        function () {
            var strAns = answer[times]['answerNo'];
            var arrA = strAns.split('');
            for (var a of arrA) {
                if(a == 1){
                    a = 'A'
                }
                if(a == 0){
                    a = 'B'
                }
                $('input[value=' + a + ']').click()
            }
            times += 1;
            if (times < totalTimes) {
                Next();
            }
            else {
                console.debug('完成');
            }
        }, 1000); //等待1000毫秒, 如果网速不好适当增加这里的值;
}
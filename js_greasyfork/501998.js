// ==UserScript==
// @name        全自动刷课|国家中小学智慧教育平台|
// @namespace   Violentmonkey Scripts
// @match       https://basic.smartedu.cn/*
// @grant       none
// @version     07.28
// @author      New World
// @description 2024/7/26 22:03:40
// @license     HAHA
// @downloadURL https://update.greasyfork.org/scripts/501998/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/501998/%E5%85%A8%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C.meta.js
// ==/UserScript==
function openNewWindow(url) {
	window.open(url, "_blank");
}
//日志函数
function addTextToLogBox(TextLog) {

    // 获取目标 <div> 元素
    var targetDiv = document.getElementById('logBox'); // 替换为你的目标 <div> 元素的 ID
    targetDiv.appendChild(document.createElement('br'));
    // 创建文本节点
    var textNode = document.createTextNode(TextLog);
    // 添加文本节点到目标 <div> 元素
    targetDiv.appendChild(textNode);
    targetDiv.scrollTop = targetDiv.scrollHeight;

}

//创建日志框
function createLogBox() {
    var logBox = document.createElement('div');
    logBox.id = 'logBox';
    logBox.style.position = 'fixed';
    logBox.style.bottom = '0';
    logBox.style.left = '0';
    logBox.style.width = '600px';
    logBox.style.height = '300px';
    logBox.style.backgroundColor = 'white'; // 更改背景颜色为白色
    logBox.style.color = 'black'; // 更改文本颜色为黑色
    logBox.style.overflow = 'auto';
    logBox.style.padding = '10px';
    logBox.style.fontFamily = 'Arial, sans-serif';
    logBox.style.whiteSpace = 'pre-wrap';
    document.body.appendChild(logBox);
    logBox.style.zIndex = '9999'; // 设置一个高的 z-index 值


}
openNewWindow
createLogBox()
addTextToLogBox("测试...")
addTextToLogBox("成功.")
addTextToLogBox("脚本已开始执行...")
addTextToLogBox("请点击“2024年暑假教师研修”！")
addTextToLogBox("请不要退出课程页面.")
addTextToLogBox("程序自动执行，")
addTextToLogBox("请勿手动操作！")
addTextToLogBox("程序会自动切换课程，并在达标时跳转至查看进度页面.")
addTextToLogBox("如果程序反复加载同一个课程超过30秒，请手动调整至下一个视频！")
addTextToLogBox("作者邮箱：hhx20110112@163.com")
addTextToLogBox("由Tiger---整理 修改 优化")

  //秒刷（第1次）
function skip() {
    let video = document.getElementsByTagName('video')
	video[0].play();
	video[0].pause();
    video[0].currentTime = video[0].duration
	video[0].play();
}



//秒刷（第2次）（确保刷完）
(function() {
    'use strict';
  let hre1 = location.href
if (hre1.includes("https://basic.smartedu.cn/teacherTraining/courseDetail")){
    setInterval(()=>{ var v=document.querySelector("video").dispatchEvent(new Event("ended"))}, 400);
    setInterval(skip,100)
    setInterval(()=>{ var v=document.querySelector("video");if(v){v.muted=true;v.playbackRate=2; v.play();v.currentTime = v.duration;}}, 400);
}
})();

//暑假研修页面依次打开八个学习网页
  var a = 'https://basic.smartedu.cn/training/2024sqpx'
  var b = 'https://basic.smartedu.cn/training/5d7cf98c-3a42-4b13-8e5f-56f40ce08b1d'
  var kc1='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98'
  var kc2='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98'
  var kc3='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98'
  var kc4='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=0d125425-968d-426c-85d6-67bb74e26ce3'
  var kc5='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=58f15ad5-a977-4c6e-8c1e-25d8aa690e28'
  var kc6='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98'
  var kc7='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=7815d28d-eeca-42f8-84e8-8f080b92c902&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=712a198f-98fa-45ad-bc03-5d3ac25bc50f'
  var kc8='https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=00351a51-7cc3-4450-b3d4-e911172c8932'

let hre2 = location.href
    setInterval(()=>{
if (hre2.includes(a)){window.location.replace(kc1);}
if (hre2.includes(kc1)){
  if(document.getElementsByClassName("resource-item")[7].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc2);}
	}
if (hre2.includes(kc2)){
  if(document.getElementsByClassName("resource-item")[1].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc3);}
	}
if (hre2.includes(kc3)){
  if(document.getElementsByClassName("resource-item")[4].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc4);}
	}
if (hre2.includes(kc4)){
  if(document.getElementsByClassName("resource-item")[1].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc5);}
	}
if (hre2.includes(kc5)){
  if(document.getElementsByClassName("resource-item")[2].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc6);}
	}
if (hre2.includes(kc6)){
  if(document.getElementsByClassName("resource-item")[1].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc7);}
	}
if (hre2.includes(kc7)){
  if(document.getElementsByClassName("resource-item")[1].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(kc8);}
	}
if (hre2.includes(kc8)){
  if(document.getElementsByClassName("resource-item")[3].getElementsByTagName("i")[0].getAttribute("title") == '已学完')
    {window.location.replace(b);}
	}

}, 900);
//切换课程
let hre3 = location.href
//if (hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98')||hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98')||hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=58f15ad5-a977-4c6e-8c1e-25d8aa690e28')){
//setInterval(()=>{ var v=document.querySelector("video");if(v){v.muted=true;v.playbackRate=1.2; v.play();v.currentTime = v.duration;}}, 500);

    setInterval(()=>{
       // 弹窗处理
      var knowButton = document.querySelector('.fish-modal-confirm-btns .fish-btn-primary');
        if (knowButton) {
            knowButton.click();
        }

        var icon = null;
        function find_icon() {
            // 进行中
            icon = document.getElementsByClassName("iconfont icon_processing_fill")[0];
            // 未开始
            if (!icon) {
                icon = document.getElementsByClassName("iconfont icon_checkbox_linear")[0];
            }
        }
        // 查找默认列表
        find_icon();
        // 展开其他列表
        if (!icon) {
            let headers = document.getElementsByClassName("fish-collapse-header");
            for (let i = 0; i < headers.length; i++) {
                let header = headers[i];
                header.click();
                find_icon();
                if (icon) {
                    break;
                }
            }
        }
        // 有没学完的
        if (icon) {
            icon.click();
        }
      }, 1800);
//}

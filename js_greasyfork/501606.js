// ==UserScript==
// @name        版本1--2024年暑假教师研修|国家中小学智慧教育平台|秒刷+切课【作者微信：lly6655】
// @namespace   Violentmonkey Scripts
// @match       https://basic.smartedu.cn/*
// @grant       none
// @version     2.5
// @author      -
// @description 2024/7/26 11:03:40
// @license     咀嚼
// @downloadURL https://update.greasyfork.org/scripts/501606/%E7%89%88%E6%9C%AC1--2024%E5%B9%B4%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E7%A7%92%E5%88%B7%2B%E5%88%87%E8%AF%BE%E3%80%90%E4%BD%9C%E8%80%85%E5%BE%AE%E4%BF%A1%EF%BC%9Ally6655%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/501606/%E7%89%88%E6%9C%AC1--2024%E5%B9%B4%E6%9A%91%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E7%A7%92%E5%88%B7%2B%E5%88%87%E8%AF%BE%E3%80%90%E4%BD%9C%E8%80%85%E5%BE%AE%E4%BF%A1%EF%BC%9Ally6655%E3%80%91.meta.js
// ==/UserScript==




//秒刷
(function() {
    'use strict';
  let hre1 = location.href
if (hre1.includes("https://basic.smartedu.cn/teacherTraining/courseDetail")){
    setInterval(()=>{ var v=document.querySelector("video").dispatchEvent(new Event("ended"))}, 500);

    setInterval(()=>{ var v=document.querySelector("video");if(v){v.muted=true;v.playbackRate=1; v.play();v.currentTime = v.duration;}}, 500);
}
})();

//暑假研修页面打开八个学习网页
function openNewWindow(url, windowName) {
  window.open(url, windowName);
}
let hre2 = location.href
if (hre2.includes("https://basic.smartedu.cn/training/2024sqpx")){
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=0d125425-968d-426c-85d6-67bb74e26ce3', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=58f15ad5-a977-4c6e-8c1e-25d8aa690e28', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=7815d28d-eeca-42f8-84e8-8f080b92c902&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=712a198f-98fa-45ad-bc03-5d3ac25bc50f', '_blank');
  openNewWindow('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=00351a51-7cc3-4450-b3d4-e911172c8932', '_blank');

}
//切换课程
let hre3 = location.href
if (hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98')||hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98')||hre3.includes('https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&resourceId=58f15ad5-a977-4c6e-8c1e-25d8aa690e28')){
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
      }, 2000);
}
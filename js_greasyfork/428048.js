// ==UserScript==
// @name        广东普法考试自动完成继续教育视频章节学习
// @namespace   www.31ho.com
// @match       http://xfks-study.gdsf.gov.cn/study/course/*
// @grant       none
// @version     1.1
// @author      keke31h
// @description 自动完成文本阅读，视频观看
// @downloadURL https://update.greasyfork.org/scripts/428048/%E5%B9%BF%E4%B8%9C%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/428048/%E5%B9%BF%E4%B8%9C%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E8%A7%86%E9%A2%91%E7%AB%A0%E8%8A%82%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==


function sleep(timeOutMs) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeOutMs);
    });
}

(async function(){

 if(window.location.pathname.search('chapter') >0){
   let index =window.location.pathname.lastIndexOf('/') ;
   if(index > 0){
       let chapter =  window.location.pathname.substring(index+1);
       if(!isNaN(parseInt(chapter))){
      await sleep(10*1000);
      jQuery.post('/study/learn/' + chapter);
    }
  }
 }else{
  
  let courses = document.querySelectorAll('a[href*=course]');
  
  if(courses){
    courses = Array.from(courses);
    
    for(let i = 0 ; i < courses.length -1; ++i){
      let course = courses[i];
      course.target ='new-page';
      course.click();
      
      await sleep(1000 * 15);
      
      
    }
  }
  }
  
})();
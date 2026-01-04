// ==UserScript==
// @name         广东省国家工作人员学法考试系统刷课xfks-study
// @namespace    https://greasyfork.org/
// @version      1.03
// @description  广东省国家工作人员学法考试系统刷课
// @author       Cosil.C
// @match        http*://xfks-study.gdsf.gov.cn/study/*
// @icon         http://xfks-study.gdsf.gov.cn/study/static/images/favicon.ico?v2019031285
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/443978/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E5%88%B7%E8%AF%BExfks-study.user.js
// @updateURL https://update.greasyfork.org/scripts/443978/%E5%B9%BF%E4%B8%9C%E7%9C%81%E5%9B%BD%E5%AE%B6%E5%B7%A5%E4%BD%9C%E4%BA%BA%E5%91%98%E5%AD%A6%E6%B3%95%E8%80%83%E8%AF%95%E7%B3%BB%E7%BB%9F%E5%88%B7%E8%AF%BExfks-study.meta.js
// ==/UserScript==

let pathname = window.location.pathname;

//首页
if (pathname.includes('index')) {
  //进入专题
  let nextCourseBtn = document.querySelector('.film_focus_imgs_wrap li .card.current div a.btn');
  if(nextCourseBtn){
    nextCourseBtn.click();
  }
} else if (pathname.includes('chapter')) {
  //文章页
  setInterval(() => {
    if (document.querySelector('.chapter-score').classList.contains('chapter-score-suc')) {
      let nextChapterBtn = document.querySelector('.next_chapter');
      //跳转下一篇文章
      if (nextChapterBtn) {
        console.log('准备跳转下一篇');
        nextChapterBtn.click();
      } else {
        //跳回目录
        console.log('准备返回目录');
        let navBackBtn = document.querySelector('.container.title.nav button');
        if(navBackBtn){
          navBackBtn.click();
        }
      }
    } else {
      submitLearn();
    }
  }, 1000);
} else if (pathname.includes('course')) {
  //专题页
  let targets = [].slice.call(document.querySelectorAll('.chapter li')).filter(v =>
    //判断文章是否未读
    v.querySelector('.sub_title')?.innerText.trim() === "" && v.querySelector('.title a')?.href
  )
  if (targets.length == 0) {
    console.log('该专题学习完毕，准备返回首页')
    window.location.pathname = 'study/index'
  } else {
    //进入文章
    console.log('准备进入文章' + targets[0].querySelector('.title a').innerText)
    targets[0].querySelector('.title a').click()
  }
}
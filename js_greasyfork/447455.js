// ==UserScript==
// @name         HS-广东学法刷课xfks-study-间隔1分钟以上
// @namespace    https://greasyfork.org/
// @version      1.0311
// @description  广东省国家工作人员学法考试系统刷课
// @author       Cosil.C
// @match        http*://xfks-study.gdsf.gov.cn/study/*
// @icon         http://xfks-study.gdsf.gov.cn/study/static/images/favicon.ico?v2019031285
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447455/HS-%E5%B9%BF%E4%B8%9C%E5%AD%A6%E6%B3%95%E5%88%B7%E8%AF%BExfks-study-%E9%97%B4%E9%9A%941%E5%88%86%E9%92%9F%E4%BB%A5%E4%B8%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/447455/HS-%E5%B9%BF%E4%B8%9C%E5%AD%A6%E6%B3%95%E5%88%B7%E8%AF%BExfks-study-%E9%97%B4%E9%9A%941%E5%88%86%E9%92%9F%E4%BB%A5%E4%B8%8A.meta.js
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
  

var speed = 62; // 学习页面停留时间 单位秒
 
function sleep(timeOutMs) {
	return new Promise((resolve) => {
		setTimeout(resolve, timeOutMs);
	});
}


    //看文章或者视频
    let time = parseInt(Math.random()*(90-75+1)+75,10) ;//70-90秒后关闭页面，暂时这样理解。
    let firstTime = time - 4;
    let secendTime = 20;
    let scrollLength = document.body.scrollHeight/2;
    var readingInterval = setInterval(function(){
        time--;
        $("#studyTip").text(time + " 秒后关闭页面");
        if(time <= firstTime){
            try{
                $("html,body").animate({scrollTop:394},1000);
            }catch(e){
                window.scrollTo(0,394);
            }
            firstTime = -1;
        }
        if(time <= secendTime){
            try{
                $("html,body").animate({scrollTop:scrollLength/3},1000);
            }catch(e){
                window.scrollTo(0,scrollLength/3);
            }
            secendTime = -1;
        }
    },1000);

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
  }, 63668);


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


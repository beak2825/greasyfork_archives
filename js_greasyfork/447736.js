// ==UserScript==
// @name            tbStudyAutoplay
// @description     太保学习专题页面自动连播
// @author          梧桐树
// @namespace       http://tampermonkey.net/
// @include         https://university.cpic.com.cn*
// @run-at          document-start
// @version         0.0.3
// @license         MIT
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/447736/tbStudyAutoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/447736/tbStudyAutoplay.meta.js
// ==/UserScript==
//document.evaluate('//div[text()="开始学习"][1]', document).iterateNext().click();
//刷新当前页面  location.reload();
//有可能是文档  https://university.cpic.com.cn/?expires_in=3600&state=/study/subject/index&lang=cn/#/study/course/detail/10&5f7762c8-61bc-40fb-8ad7-7deb46ca389b/6/1
//有可能有多个课程   CAF   https://university.cpic.com.cn/#/study/subject/detail/25228ee9-30ed-43b0-b77e-c667b947eaf5
//保险科技专题 https://university.cpic.com.cn/#/study/subject/detail/2967d127-a50f-4f85-99cf-161ec3d918a4
// 图文、文档 可能还需要一些处理  https://university.cpic.com.cn/?expires_in=3600&state=/study/subject/detail/2967d127-a50f-4f85-99cf-161ec3d918a4&lang=cn/#/study/subject/detail/13ca544a-2c37-4559-8b57-ac498263f7bc
let flag = null; //页面类型
var timer = null //详情页定时刷新
var timer1 = null //专题页定时
var timer2 = null //详情页多个课程整体查询定时
  // 注入的样式，连播按钮的样式
let injectStyle = `
   .myinject{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #fec04e;
    border-color: #fec04e;
    position: fixed;
    bottom: 20px;
    left: 10px;
    opacity: .8;
    color: brown;
    line-height: 50px;
    vertical-align: middle;
    text-align: center;
    cursor: pointer;
  }
  .myinject:hover{
    opacity: 1;
    color: #fff;
  }`


function subjectStudy(){
if(flag == 'subject') {
    var startFlag = GM_getValue("startFlag"); //专题页启动连播标志位
    (function() {
    //连播按钮
    let body = document.querySelector('body')
    let injectDiv = document.createElement('div')
    injectDiv.classList.add('myinject')
    if(startFlag){
    clickStartStudy()
    timer1 = setInterval(startStudy,10000); //定时刷新
    injectDiv.innerHTML = `连播中`
    injectDiv.onclick = function (e) {
        injectDiv.innerHTML = `启动连播`
        GM_setValue("startFlag", false);
        clearInterval(timer1);
    }}else{
        clearInterval(timer1);
        injectDiv.innerHTML = `启动连播`
    injectDiv.onclick = function (e) {
        injectDiv.innerHTML = `连播中`
        GM_setValue("startFlag", true);
        clickStartStudy()
        timer1 = setInterval(startStudy,10000);
    }}
  GM_addStyle(injectStyle)
  body.appendChild(injectDiv)
  GM_log('已设置启动按钮样式')
}());
}
else if (flag == 'course'){
    GM_setValue("closeFlag", false); //详情页关闭标志位
    startFlag = GM_getValue("startFlag"); //专题页启动连播标志位
    if(startFlag){
       var n = null //获取本页课程数量
       setTimeout(function(){
       n=document.querySelectorAll('dl').length; //判断详情页有单个还是多个视频

       if (n==1){
        GM_log('只有一个课程，播放完就关闭该页面')
        timer = setInterval(queryProgress,5000); //定时刷新
        //queryProgress()
       }
    else{
        GM_log('有'+n+'个课程，全部播放完再关闭页面')
        courseMultiple(n)

        }
       },4000) //需要等待详情页加载完毕才能获取到课程数
}}
else if(flag == 'errors') {
        window.close()
    }
else{
    GM_log('当前在其他太保学习页面，需要切换到专题列表页面才展示连播按钮')
}
}

function courseMultiple(n){
        var toStudy = findToStudy(n)
        timer2 = setInterval(function(){
            toStudy = findToStudy(n)
            if(toStudy){
            GM_log('正在学习第'+toStudy+'节课程...')
            queryProgressSingle(toStudy);
            }
            else{//如果没有待学习的，则认为该页面都学习完毕
            clearInterval(timer2);
            GM_setValue("closeFlag", true);
            window.close()}

        },5000); //定时读取待学习的课程
}

function findToStudy(n){
    for (let i=0;i<n;i++){
        var dlList=document.querySelectorAll('dl')
        var toStudy =null
        var course_ele = document.evaluate('//span[text()="开始学习" or text()="继续学习"or text()="学习中"][1]/../../../..', document).iterateNext()
        if(course_ele == dlList[i]){
            toStudy = i+1
            break
        }
    }
    return toStudy
}
//返回xpath总个数
function get_xpath_num(xpath_str){
    var result = document.evaluate(xpath_str, document, null, XPathResult.ANY_TYPE, null); //'//span[text()="课程"]/../../..//div[@class="img-bg"]'
    var nodes = result.iterateNext(); //枚举第一个元素
    let list = []
    while (nodes){
        // 对 nodes 执行操作;
        nodes=result.iterateNext(); //枚举下一个元素
        list.push(nodes)
    }
    return list.length
}

//返回xpath的list
function get_xpath_list(xpath_str){
    var result = document.evaluate(xpath_str, document, null, XPathResult.ANY_TYPE, null); //'//span[text()="课程"]/../../..//div[@class="img-bg"]'
    var nodes = result.iterateNext(); //枚举第一个元素
    let list = []
    while (nodes){
        // 对 nodes 执行操作;
        nodes=result.iterateNext(); //枚举下一个元素
        list.push(nodes)
    }
    return list
}

function findToStudySpecial(){
    var all_list =get_xpath_list('//span[text()="课程"]/../../..//div[@class="img-bg"]')
    var done_list =get_xpath_list('//span[text()="课程"]/../../..//div[@class="img-required" and text()="已完成"]/..//div[@class="img-bg"]')
    console.log(all_list)
    return all_list.find(function(element) {
      return !(done_list.some(i=>i==element))
});

}

function clickStartStudy(){
    setTimeout(function(){
    var start_ele = document.evaluate('//div[text()="开始学习" or text()="继续学习"][1]', document).iterateNext()
    var done_ele = document.evaluate('//div[text()="重新学习"][1]', document).iterateNext()
    var special_ele = document.evaluate('//span[text()="课程"]/../../..//div[@class="img-bg"]', document).iterateNext()
   // console.log(start_ele)
    if(start_ele) {
        start_ele.click();
        GM_setValue("closeFlag", false);
    }else if(done_ele){
        alert("已完成课程学习！");
        GM_setValue("closeFlag", false);
        GM_setValue("startFlag", false);
        let injectDiv = document.evaluate('//div[@class="myinject"]', document).iterateNext()
        injectDiv.innerHTML = `启动连播`
    }else if (special_ele){//https://university.cpic.com.cn/#/study/subject/detail/7e0532fd-d7a7-4a24-932b-8d1ee95f5c09
   // var all_num = get_xpath_num('//span[text()="课程"]/../../..//div[@class="img-bg"]')
   // var done_num = get_xpath_num('//span[text()="课程"]/../../..//div[@class="img-required" and text()="已完成"]/..//div[@class="img-bg"]')
   // if(done_num < all_num){ //只适合连续播放的场景，如果跳过播放，则会陷入死循环
    //    var study_ele = '(//span[text()="课程"]/../../..//div[@class="img-bg"])['+ (done_num +1)+']'
        //console.log(study_ele)
    //    document.evaluate(study_ele, document).iterateNext().click()
   // }
        var study_ele = findToStudySpecial()
        study_ele.click()
    }
        else{
        alert("网络不通or此页面没有待学习的课程！");
    }
},7000)
}

function startStudy(){
    GM_log('连播中，定时获取详情页播放完毕状态')
    var closeFlag = GM_getValue("closeFlag");
    GM_log(closeFlag)
    if(closeFlag){
        location.reload();
        clickStartStudy();
}}

function queryProgress(){
    if(location.href.includes("study/errors")) {
        clearInterval(timer);
        window.close()
    }
    var done_ele = document.evaluate('//div[@class="item pointer"]/span[last()]', document).iterateNext().textContent
    var type_ele = document.evaluate('//div[@class="item sub-text focus"][last()]', document).iterateNext().textContent

    if(type_ele == "视频"){
        var playStatus = document.evaluate('//div[@class="vjs-control-bar"]/button/span', document).iterateNext().textContent
        if(playStatus == '播放'){
            var video = document.getElementsByTagName("video")[0]
            video.muted = true
            video.play()
            //setTimeout(function(){
            //console.log('当前暂停，即将点击播放按钮')
            //document.evaluate('//div[@class="vjs-control-bar"]/button/span', document).iterateNext().click();},1500)
    }
    }else if(type_ele == "音频"){
        var playStatus1 = document.evaluate('//div[@class="vjs-control-bar"]/button/span', document).iterateNext().textContent
        if(playStatus1 == '播放'){
          var audio = document.getElementById("D316player_html5_api")
            console.log(111,audio);
            audio.muted = true;
            audio.autoplay= true;
            audio.play()
            //document.getElementsByClassName('vjs-big-play-button')[0].click()
           // setTimeout(()=>
         
            //},1000);

    }
    }
    if(done_ele == '重新学习') {
        GM_log('已完成100%')
        clearInterval(timer);
        window.close()
        GM_setValue("closeFlag", true);
    } else if((type_ele == "文档")||(type_ele == "图文") || (type_ele == "URL") || (type_ele == "电子书")) {
        GM_log('电子书／URL／图文／文档：打开后1秒就认为完成学习') //TODO电子书／URL／图文／文档：打开后1秒
        setTimeout(function(){},3000)
        }
    else{
       GM_log('继续等待……');
    }
  }
//多个课程时，播放完一个，不关闭页面
function queryProgressSingle(i){
    var toStudyCourse = document.evaluate('(//dl)['+ i +']', document).iterateNext()
    if(toStudyCourse.classList.value.indexOf('focus') == -1){
        toStudyCourse.click()
        //GM_log('已点击该视频');
    }else{
        //GM_log('当前视频已选中');
    }
    var type_ele = null
    setTimeout(function(){
    type_ele = document.evaluate('(//div[@class="item sub-text focus"][last()])['+ i +']', document).iterateNext().textContent
    if(type_ele == "视频"){
        var playStatus = document.evaluate('//div[@class="vjs-control-bar"]/button/span', document).iterateNext().textContent
        if(playStatus == '播放'){
            var video = document.getElementsByTagName("video")[0]
            video.muted = true
            video.play()
        }}
                },2000)   
}

function wordHandle(){
    var sumPage = document.evaluate('//div[@class="pull-right"]//label', document).iterateNext().textContent
    var currentPage = document.evaluate('//div[@class="pull-right"]//input', document).iterateNext().value
    while (sumPage != currentPage)
{ //每隔1秒点击一次下一页，直到页数为总页数
    setTimeout(function(){
    document.evaluate('//div[@class="pull-right"]/div[@title="下一页"]', document).iterateNext().click()},1000)
    currentPage = document.evaluate('//div[@class="pull-right"]//input', document).iterateNext().value
}

}



/**
 * 初始化
 */
function init() {
    // 判断是列表页还是详情页
    if(location.href.includes("#/study/subject/detail")) {
        flag = "subject";
    } else if(location.href.includes("#/study/course/detail/")) {
        flag = "course";

    } else if(location.href.includes("study/errors")) {
        flag = "errors";
    }
    else{
        flag = "other";
    }
    subjectStudy();
}

// // 初始化DOMContentLoaded监听（html文档完全被加载和解析事件）
document.addEventListener("DOMContentLoaded", init);
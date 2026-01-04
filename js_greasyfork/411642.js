// ==UserScript==
// @name         东华网络教育刷课专用
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  try to take over the world!
// @author       zhangyanhua
// @match        *://*.donghuacj.ct-edu.com.cn/*
// @grant        none
// @require   https://cdn.bootcdn.net/ajax/libs/jquery/2.2.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411642/%E4%B8%9C%E5%8D%8E%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/411642/%E4%B8%9C%E5%8D%8E%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2%E5%88%B7%E8%AF%BE%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==


const isObject = x => {
  return typeof x === 'object' && x !== null
}
var href = location.href
var btn=document.getElementsByClassName("layui-layer-btn0")
var flag1 = 0
   function doClick() {
            document.getElementsByClassName("layui-layer-btn0")[0].click()
        }
        setInterval(() => {
            if (btn.length > 0) {
                doClick()
                if($('.left_content').text(). indexOf('英语')!==-1){
                                  setTimeout(function(){
                       $('.course_chapter_list .active').next().children(".section_title").click()

                           },500)
                }

            }
             var pop = document.getElementsByClassName("popup_do_question")
            //增加禁音播放
            var vidio = document.getElementsByTagName('video')
            if(vidio.length>0){vidio[0].volume = 0}
            
            //这个是增加倍速的但是目前不支持playbackRate
            var erroePop=document.getElementsByClassName("popup_do_error")
            var succPop=document.getElementsByClassName("popup_show")
         if (pop.length > 0||erroePop.length>0||succPop.length>0) {
             var check = document.getElementsByClassName('checkbox-inline')
             var btnText = $('.popup_operate .whaty-button').html()
             if (btnText == '提交') {
                 check[0].click()
                 console.log('提交了111')
                 flag1++
                 $('.popup_operate .whaty-button').click()
             } else if (btnText == '重做') {
                 console.log('重做===',flag1)
                 $('.popup_operate .whaty-button').click()
                 check[flag1].click()
                 flag1++
                 $('.popup_operate .whaty-button').click()

             } else {
                 //回答正确等于继续的时候
                 console.log('提交正确')
                 $('.course_chapter_list .active').next().children(".section_title").click()  //回答正确点击侧边直接换专治英语花里胡哨
                 //$('.popup_operate .whaty-button').click()
             flag1=0
             }

    }
            console.log('脚本在执行了')
        }, 10000)

// ==UserScript==
// @name        天翼云考试 测试(简)
// @namespace   Violentmonkey Scripts
// // @match       *://*/*
// @match       *://edu.ctyun.cn/exam/*
// @match       *://ctexam.mylearning.cn/pscexam/student/enterExam/*
// @grant       none
// @version     1.0
// @author      zsa
// @description 2023/9/13 20:20:01
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/clipboard.js/2.0.11/clipboard.min.js
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480004/%E5%A4%A9%E7%BF%BC%E4%BA%91%E8%80%83%E8%AF%95%20%E6%B5%8B%E8%AF%95%28%E7%AE%80%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480004/%E5%A4%A9%E7%BF%BC%E4%BA%91%E8%80%83%E8%AF%95%20%E6%B5%8B%E8%AF%95%28%E7%AE%80%29.meta.js
// ==/UserScript==


var $ =  unsafeWindow.jQuery || window.jQuery;
var Clipboard = window.ClipboardJS;


function copyTopics(){
  var sti2 = setInterval(()=>{

    if($('.panel-footer').length > 0) {
      clearInterval(sti2);

      try{
        let str = $.map($('div.js-testpaper-question-block').map((i,e)=>{
                    let str = $(e).find('.testpaper-question-seq').text().replaceAll('\n','').replaceAll('\t','').trim() + '.';
                    str += $(e).find('.js-testpaper-question-stem').text().replaceAll('\n','').replaceAll('\t','').trim() + '\n';
                    str += $.map(($(e).find('.testpaper-question-choice-item').length>0?$(e).find('.testpaper-question-choice-item'):$(e).find('.js-testpaper-question-label .radio-inline')).map((i1,e1)=>$(e1).text().trim()),e1=>e1).join('\n')+ '\n';
                    return str;
                  }),e=>e).join('\n');
        $('.panel-footer').append('<button id="_copyTopics" class="btn btn-primary" data-clipboard-text="'+str+'">复制</button>');
        var clipboard = new Clipboard("#_copyTopics");
        clipboard.on("success", function (e) {
          $("#_copyTopics").html("成功");
          setTimeout(function () { return $("#_copyTopics").html('复制'); }, 1000);
        })
        clipboard.on("error", function (e) {
          $("#_copyTopics").html("失败");
        })
        console.log('可以复制题目')
      }catch(err) {
        console.log('解析题目失败',err)
        return;
      }
    }
  }, 100);
}

(function () {

  // 进行页面判断 判断是在外面页面还是考试页面
  unsafeWindow.onblur = null;
  Object.defineProperty(unsafeWindow, 'onblur', {
    set: function(v) {
      console.log('onblur',v)
    }
  });

  Object.defineProperty(unsafeWindow, 'onfocus', {
    set: function(v) {
      console.log('onfocus',v)
    }
  });

  console.log('运行切屏')

  copyTopics();
})();
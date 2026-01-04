// ==UserScript==
// @name         stopwatch
// @namespace    ycycorona
// @version      0.1.3
// @description  1.get current answer 2.push notification when stop
// @author       ycy
// @match   *://sdwh.zyk.yxlearning.com/learning/index*
// @match   *://sdwh.gxk.yxlearning.com/learning/index*
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/qs/6.9.4/qs.min.js
// @run-at  document-start
// @grant   GM_addStyle
// @grant   GM_notification
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/413850/stopwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/413850/stopwatch.meta.js
// ==/UserScript==

(function() {
  'use strict';

var choices = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
]

$(function() {
  var $btn = $('<button type="button" id="ycy-answer-btn">当前答案</button>').css(
    {
      "position": "fixed",
      "top": "0",
      "right": "10px",
      "z-index": "99999"
    }
  )
  var $answerPop = $('<div id="ycy-answer-pop"></div>').css(
    {"position": "fixed",
    "top": "50px",
    "right": "10px",
    'width': '400px',
    'height': '600px',
    'over-flow': 'auto',
    "z-index": "99999",
    "background": "beige"
  });
  $answerPop.hide()
  $('html').append($answerPop)
  $('html').append($btn)
  $btn.click(function(e) {
    $answerPop.slideToggle()
  });
  // var opt_1 = $('#defaultBtn span.sum')
  // var opt_2 = $('div.learnhour.left')
  // console.log(opt_1, opt_2);
  // if (opt_1.length!==0) {
  //   opt_1.append($btn)
  // } else if (opt_2.length!==0) {
  //   opt_2.append($btn)
  // }
})

function timeFormat(rawTime) {
  var timeArray = String(rawTime).split(':')
  var timeSec = timeArray[timeArray.length-1]
  return '' + Math.floor(timeSec/60) + ':' + (timeSec - (Math.floor(timeSec/60)*60))
}

function rowFactory(item, index) {
  var $parentDom = $('<div></div>')
  var $ques = $('<div></div>')
  var $answer = $('<div></div>')
  var $time = $('<div></div>')
  $time.html(timeFormat(item.showTime) + '/' + timeFormat(item.wrongTime))
  $time.css({
    'font-size': '10px'
  })

  $ques.css('font-weight', '700')
  $ques.html((index+1) + '.' + item.question)


  JSON.parse(item.choices).forEach((citem, cindex) => {
    var cRow = $('<div>'+ choices[cindex] + '.' + citem.answer  +'</div>')

    if(citem.right_answer===1) {
      cRow.css('color', 'red')
    }
    $answer.append(cRow)
  })
  return $parentDom.append($ques).append($time).append($answer)
}

function StopWatch() {
      this.timerFlag = 0
      this.timerTImes = 0 // 倒计时触发前经历了多少个循环
      this.timerActivated = false // 是否已经在倒计时
      this.generateCheck = function(url) {
          if(url!=='/train/cms/my-video/cv.gson') {return}
          if (this.timerFlag!==0) {
              clearTimeout(this.timerFlag)
          }
          console.log('倒计时开始')
          this.timerTImes ++
          this.timerFlag = setTimeout(this.onTimerEnd.bind(this), 30000)
      }
      // 获取当前的答案
      this.getCurrentAnswer = function(url, reqBody) {
        if(url !== '/train/cms/my-video/sv.gson') { return }
        //if(! url.match(/v.polyv.net\/uc\/exam\/get/)) { return }
        var watchInfo = JSON.parse(Qs.parse(reqBody).watchInfo)
        console.log('getCurrentAnswer', watchInfo)
        GM_xmlhttpRequest({
          method: 'GET',
          url: `http://v.polyv.net/uc/exam/get?vid=${watchInfo.vid}`,
          onload: res => {
            var text = res.responseText;
            var json = JSON.parse(text);
            console.log(json);
            $('#ycy-answer-pop').empty()
            json.forEach((item, index) => {
              $('#ycy-answer-pop').append(rowFactory(item, index))
            })
          }
      });
      }

      this.onTimerEnd = function() {
          this.timerTImes = 0
          this.sendAlarm()
      }
      this.sendNotifitation = function(msg) {
          var notificationDetails = {
              text: msg,
              title: '学习暂停了',
              timeout: 30000,
              onclick: function() { window.focus(); },
          };
          GM_notification(notificationDetails);
      }
      this.sendAlarm = function() {
          var postData={
              text: `[${document.querySelector('.titlesname').innerText}][${document.querySelector('.pv-time-current').innerText}]/[${document.querySelector('.pv-time-duration').innerText}]`,
              desp: ''
          }
          // 创建XMLHttpRequest对象
          var xhr = new XMLHttpRequest()
          var urlEncodedData = "";
          var urlEncodedDataPairs = [];
          var name;

          // 将数据对象转换为URL编码的键/值对数组。
          for(name in postData) {
              urlEncodedDataPairs.push(encodeURIComponent(name) + '=' + encodeURIComponent(postData[name]));
          }

          // 将配对合并为单个字符串，并将所有%编码的空格替换为
          // “+”字符；匹配浏览器表单提交的行为。
          urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');
          this.sendNotifitation(postData.text)
          // 创建一个 get 请求，true 采用异步
          GM_xmlhttpRequest({
            method: 'POST',
            //请输入自己的url
            url: `https://sc.ftqq.com/123455.send`,
            data: urlEncodedData,
            headers:  {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: res => {
              console.log(res.responseText)
            },
            onerror : function(err){
              console.log('error')
              console.log(err)
          }
        });

          // xhr.open('POST', 'https://javtest.cyberspideryy.workers.dev/', true)
          // xhr.onreadystatechange = function () {
          //     if (xhr.readyState === 4) {
          //         if (xhr.status === 200) {
          //             console.log(xhr.responseText)
          //         }
          //     }
          // }
          // xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
          // //发送请求

          // xhr.send(urlEncodedData) //发送格式为json字符串
      }
  }
  var stopWatch = new StopWatch()
  window._stopWatch = stopWatch;
  console.log(stopWatch);
  /**
  * 修改XMLHttpRequest发送方法
  */
  var signature = '_ycycorona_grace_';
  (function(open) {
      XMLHttpRequest.prototype.open = function() {
          stopWatch.generateCheck(arguments[1])
          // 记录下来url
          this[signature+'reqUrl'] = arguments[1]
          open.apply(this, arguments);
      };
  })(XMLHttpRequest.prototype.open);

  (function(send) {
      XMLHttpRequest.prototype.send = function() {
          stopWatch.getCurrentAnswer(this[signature+'reqUrl'], arguments[0])
          send.apply(this, arguments);
      };
  })(XMLHttpRequest.prototype.send);

// 测试
  // var a=new XMLHttpRequest();
  // var url='/train/cms/my-video/sv.gson';
  // // a.addEventListener('readystatechange',function(e){
  // //     console.log(e);
  // // });
  // // //console.log(XMLHttpRequest.XMLHttpRequestEventTarget);
  // // a.onreadystatechange=function()
  // // {
  // //     //console.log('abc');
  // // };
  // a.open('POST',url);
  // a.send('myClassId=a7727ae0-54ae-4234-a673-799c7edd2a53&myClassCourseId=3b8f3a0b-2cee-42db-b873-9bf9c3026dcd&myClassCourseVideoId=e13dccf1-0dda-4fc7-bb99-bf6885cd6a22&watchInfo=%7B%22vid%22%3A%22a18dce4e4354b3e50da4b2448d610987_a%22%2C%22pid%22%3A%221603087064279X1056258%22%2C%22playduration%22%3A0%2C%22timestamp%22%3A1603087069859%2C%22sign%22%3A%223b6d071aae83b52cac5b191638b8a61848f355f5%22%7D');

  //var b=new XMLHttpRequest();
})();
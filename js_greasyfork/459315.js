// ==UserScript==
// @name        信趣邦助手自动八倍静音播放 - hxdi.cn
// @namespace   Violentmonkey Scripts
// @match       https://study.cp.hxdi.cn/StudyNow.aspx
// @grant       unsafeWindow
// @grant       GM_log
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       GM_addStyle
// @version     1.4.14
// @author      -
// @description 2023/1/31 09:22:30
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459315/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%85%AB%E5%80%8D%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%20-%20hxdicn.user.js
// @updateURL https://update.greasyfork.org/scripts/459315/%E4%BF%A1%E8%B6%A3%E9%82%A6%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E5%85%AB%E5%80%8D%E9%9D%99%E9%9F%B3%E6%92%AD%E6%94%BE%20-%20hxdicn.meta.js
// ==/UserScript==

addEventListener("load",function(){
  console.log('信趣邦助手启动')
  $('.textLayer')
  var videoslist = []
  $('.lg').each(function(index,element){
    videoslist.push(element)
  })
  var clickOne = -1
  var lastOne = false
  for(i=0;i<videoslist.length;i++){
    //console.log(videoslist[i].getElementsByClassName('red').length)
    if(videoslist[i].getElementsByClassName('red').length>0&&(i<videoslist.length-1)){
      console.log('需要选第',i+1,'号')
      clickOne = i+1
      if(videoslist[i].getElementsByClassName('time')[0].textContent.replace(/\n/g,'').length<300){
        console.log('该课程是文本内容')
        var ttt = 15
        var t7 = unsafeWindow.setInterval(function() {
          console.log(ttt)
          ttt--
        },1000)
        var t8 = unsafeWindow.setTimeout(function() {
          videoslist[clickOne].getElementsByTagName('a')[0].click()
        },15000)
      }
    }
    if(videoslist[i].getElementsByClassName('red').length>0&&(i===videoslist.length-1)){
      console.log('最后一个')
      lastOne = true
      if(videoslist[i].getElementsByClassName('time')[0].textContent.replace(/\n/g,'').length<300){
        console.log('该课程是文本内容')
        var ttt = 15
        var t7 = unsafeWindow.setInterval(function() {
          console.log(ttt)
          ttt--
        },1000)
        var t8 = unsafeWindow.setTimeout(function() {
          alert('本章节播放完毕')
          window.location.close()
        },15000)
      }
    }
  }
  console.log('移除原有播放器监听')
  unsafeWindow.player.removeListener('time', timeHandler); //监听播放时间
  unsafeWindow.player.removeListener('paused', pausedHandler);//监听是否暂停了 用于计算时间
  unsafeWindow.player.removeListener('ended', endedHandler);//监听是否播放结束
  unsafeWindow.player.removeListener('seekTime', seekTimeHandler)
  console.log('新增定时检测器，5s检测是否继续播放或者出现卡顿以及末尾停止')
  unsafeWindow.loadtest = 0
  unsafeWindow.lastTime = 0
  unsafeWindow.lag = 0
  timercheck = setInterval(function () {
    if(unsafeWindow.lastTime === unsafeWindow.player.time){
      if(unsafeWindow.lag === 5){
        console.log('播放卡了，尝试重启')
        unsafeWindow.lag = 0
        location.reload()
      }
      unsafeWindow.lag++
    }
    if($('div[class^="playch"]')[0].style.display==='block' && (unsafeWindow.player.time<unsafeWindow.Duration-1)){
      console.log('播放暂停了，尝试重启')
      $('div[class^="playch"]')[0].click()
    }
    if($('div[class^="loading"]')[0].style.display==='block'){
      if(loadtest===5){
        console.log('卡了很久了，刷新')
        loadtest = 0
        location.reload()
      }
      loadtest++
      }
    lastTime = unsafeWindow.player.time
    }, 5000); //设置定时器
  unsafeWindow.timeHandler = function(time){
    // console.log('修改版timeHandler')
    var t = parseInt(time);//当前播放时间
    if ($.inArray(t, unsafeWindow.playTimes) < 0) {
        unsafeWindow.playTimes.push(t);//如果数组中不存在当前播放时间则添加
        // console.log(playTimes);
        if (unsafeWindow.playTimes.length > 1) {
            var arr = [];
            var ST = 0;
            var ET = 0;
            unsafeWindow.playTimes.forEach((elem, index) => {
                // console.log(elem, index);
                if (index == 0) {
                    ST = elem;
                    ET = elem;
                } else {
                    if (elem == ET + 1) {
                        ET = ET + 1;
                    } else {
                        arr.push({ ST: ST, ET: ET });
                        ST = elem;
                        ET = elem;
                    }
                }
                if (index == unsafeWindow.playTimes.length - 1) {
                    arr.push({ ST: ST, ET: ET });
                }
            });
            unsafeWindow.progressbarSet(arr, 1);
            // console.log(arr);
        }
     }
  }

  unsafeWindow.endedHandler = function(){
    unsafeWindow.setStudyTime(unsafeWindow.time);
    unsafeWindow.time = 0;
    if(lastOne){
      alert('本章节播放完毕')
      var t1 = window.setTimeout(function() {
        window.close()
      },10000)
    }else{
      console.log('播放结束，等待2s跳下一集')
      var t2 = window.setTimeout(function() {
        videoslist[clickOne].getElementsByTagName('a')[0].click()
      },2000)
    }
  }

  console.log('尝试添加新监听')
  unsafeWindow.player.addListener('time', timeHandler); //监听播放时间
  unsafeWindow.player.addListener('paused', pausedHandler);//监听是否暂停了 用于计算时间
  unsafeWindow.player.addListener('ended', endedHandler);//监听是否播放结束
  unsafeWindow.player.addListener('seekTime', seekTimeHandler);
  // unsafeWindow.loadHandler = function() {
  //   console.log('修改版播放器')
  //   unsafeWindow.player.addListener('time', timeHandler); //监听播放时间
  //   u// nsafeWindow.player.addListener('paused', pausedHandler);//监听是否暂停了 用于计算时间
  //   unsafeWindow.player.addListener('ended', endedHandler);//监听是否播放结束
  //   unsafeWindow.player.addListener('seekTime', seekTimeHandler);
  // }
  console.log('安装新播放器监听')
  // unsafeWindow.UserLogo = '综合院吴彦祖'
  // var videoObject = {
  //           container: '.video',//“#”代表容器的ID，“.”或“”代表容器的class
  //           variable: 'player',//该属性必需设置，值等于下面的new chplayer()的对象
  //           autoplay: true,
  //           html5m3u8: true,
  //           flashplayer: false,
  //           config: '',
  //           loaded: 'loadHandler',
  //           promptSpot: promptSpot, //节点
  //           video: FileLink, //视频地址
  //           seek: LastStudyTime,
  //           logo: UserLogo,
  //       }

  // unsafeWindow.player = new ckplayer(videoObject)

  unsafeWindow.player.videoMute()
  var t2 = window.setTimeout(function() {
    // unsafeWindow.player.playOrPause()
    console.log('0.5秒钟之后入侵操作')
    console.log('视频静音')
    unsafeWindow.player.videoMute()
    djs = 0
    console.log('更改倍速表')
    unsafeWindow.player.playbackRateArr=[[0.5,'0.5倍'],[1,'1倍'],[2,'2倍'],[4,'4倍'],[6,'6倍'],[8,'8倍'],[10,'10倍']]
    console.log('更改8倍速')
    unsafeWindow.player.changePlaybackRate(5)
  },500)
  let backup = unsafeWindow.goTime
  unsafeWindow.goTime = function() {
    // console.log('修改过的goTime')
    timer = setInterval(function () {
      time++;
      if (time == 10) {
        //console.log('上报数据')
        setStudyTime(time);
        time = 0;
      }
      if (ty == '2' && note_wz.length > 0) {
          var t = player.time;
          $(note_wz).each(function () {
              if (t >= parseInt(this)) {
                  $('.sm a').removeClass('red');
                  $('[data-wz=' + this + ']').addClass('red');
                  return false;
              }
          });
       }
    }, 100); //设置定时器
  }
  let save = unsafeWindow.setStudyTime
  unsafeWindow.setStudyTime = function(time) {
    // console.log('修改版setStudyTime')
    var LastDuration = 0;//最后学习进度
    if (player != null) {
        if (ty == '2') {
            LastDuration = player.time;
        } else if (ty == '3') {
            LastDuration = player.currentTime;
        }
    }
    if(unsafeWindow.playTimes.length>1){
      console.log('上传数组检查')
      var testplayTimes = unsafeWindow.playTimes.concat([])
      for(i=0;i<(unsafeWindow.playTimes.length-1);i++){
        if((testplayTimes[i+1]-testplayTimes[i]>1)&&(testplayTimes[i+1]-testplayTimes[i]<10)){
          // console.log('有漏点：'+testplayTimes[i]+','+testplayTimes[i+1]+',需要补'+(testplayTimes[i+1]-testplayTimes[i]-1)+'位')
          // console.log('尝试补')
          for(j=0; j<(testplayTimes[i+1]-testplayTimes[i]-1); j++){
             testplayTimes.push(testplayTimes[i]+j+1)
          }
        }
      }
    }
    var rep = GM_getValue('repre')
    if(rep != undefined&&rep.msg.length<1){

      if(rep.data.length>1){
        // console.log('有空点')
        for(i=0;i<Math.min(6,rep.data.length-1);i++){
          // console.log('有空点：',rep.data[i].ET,rep.data[i+1].ST,'需要补:',rep.data[i+1].ST-rep.data[i].ET-1,'位')
          for(j=0;j<rep.data[i+1].ST-rep.data[i].ET-1;j++){
            // console.log('测试真的补一段空点：',rep.data[i].ET+j+1)
            testplayTimes.push(rep.data[i].ET+j+1)
          }
        }
      }
      if(rep.data[0].ET >= unsafeWindow.Duration&&unsafeWindow.player.time>unsafeWindow.Duration/5){
        console.log('之前记录情况',rep,'返回的最后点',rep.data[0].ET,'长度',unsafeWindow.Duration)
        console.log('可能登记完毕！')
        if(lastOne){
          alert('本章节播放完毕')
          var t1 = window.setTimeout(function() {
            window.close()
          },10000)
        }else{
          console.log('播放结束，等待2s跳下一集')
          var t2 = window.setTimeout(function() {
            videoslist[clickOne].getElementsByTagName('a')[0].click()
          },2000)
        }
      }
    }
    let test1 = []
    let test2 = []
    testplayTimes = testplayTimes.sort((a,b)=>{return a-b})
    if(testplayTimes.length > 20){
      console.log('上传列表过长，需要拆分')
      test1 = testplayTimes.slice(0,20)
      test2 = testplayTimes.slice(20,)
      console.log('上传的test1',test1)
      var PlayTimes = test1.join(',');
            //console.log(playTimes);
      playTimes = [];
      testplayTimes = [];
      $.ajax({
          url: "/WebAPI/StudyTimeRecord",
          data: { KCID: kcid, ZJID: zjid, StudyTime: time, LastDuration: LastDuration, PlayTimes: PlayTimes },
          type: 'post',
          dataType: "json",
          success: function (re) {
              // console.log(re);
              GM_setValue('repre',re)
              if (re.code == 0) {
                progressbarSet(re.data);
              }else{
                console.log('msg:',re.msg)
              }
          },
          error: function () {
                    //layer.msg("网络发生错误");
          }
      });
      if(test2.length>30){
        console.log('爆仓了 刷新')
        unsafeWindow.location.reload()
      }
      timer3 = unsafeWindow.setTimeout(function() {
        console.log('上传的test2',test2)
        var PlayTimes = test2.join(',');
            //console.log(playTimes);
        playTimes = [];
        testplayTimes = [];
        $.ajax({
            url: "/WebAPI/StudyTimeRecord",
            data: { KCID: kcid, ZJID: zjid, StudyTime: time, LastDuration: LastDuration, PlayTimes: PlayTimes },
            type: 'post',
            dataType: "json",
            success: function (re) {
                console.log(re);
                if (re.code == 0) {
                  progressbarSet(re.data);
                  GM_setValue('repre',re)
                }else{
                console.log('msg:',re.msg)
              }
            },
            error: function () {
                    //layer.msg("网络发生错误");
            }
        });
      },200)
    }else{
      console.log('上传的testplayTimes',testplayTimes)
      var PlayTimes = testplayTimes.join(',');
            //console.log(playTimes);
      playTimes = [];
      testplayTimes = [];
      $.ajax({
          url: "/WebAPI/StudyTimeRecord",
          data: { KCID: kcid, ZJID: zjid, StudyTime: time, LastDuration: LastDuration, PlayTimes: PlayTimes },
          type: 'post',
          dataType: "json",
          success: function (re) {
              console.log(re);
              if (re.code == 0) {
                progressbarSet(re.data);
                GM_setValue('repre',re)
              }else{
                console.log('msg:',re.msg)
              }
          },
          error: function () {
                    //layer.msg("网络发生错误");
          }
      });
    }

  }
  //
//   let save = unsafeWindow.setStudyTime
//   unsafeWindow.setStudyTime = function(time) {
//     // console.log('修改版本setStudyTime')
//     loadtest = 0
//     var LastDuration = 0;//最后学习进度
//     if (unsafeWindow.player != null) {
//         if (ty == '2') {
//             LastDuration = unsafeWindow.player.time;
//         } else if (ty == '3') {
//             LastDuration = unsafeWindow.player.currentTime;
//         }
//     }
//     if(unsafeWindow.playTimes.length>1){
//       // console.log('上传数组检查')
//       var testplayTimes = unsafeWindow.playTimes.concat([])
//       for(i=0;i<(unsafeWindow.playTimes.length-1);i++){
//         if((testplayTimes[i+1]-testplayTimes[i]>1)&&(testplayTimes[i+1]-testplayTimes[i]<10)){
//           //console.log('有漏点：'+testplayTimes[i]+','+testplayTimes[i+1]+',需要补'+(testplayTimes[i+1]-testplayTimes[i]-1)+'位')
//           // console.log('尝试补')
//           for(j=0; j<(testplayTimes[i+1]-testplayTimes[i]-1); j++){
//              testplayTimes.push(testplayTimes[i]+j+1)
//           }
//         }
//       }
//       var rep = GM_getValue('repre')
//           if(rep != undefined){
//             console.log('之前记录情况',rep)
//             if(rep.data.length>1){
//               for(i=0;i<Math.min(3,rep.data.length-1);i++){
//                 console.log('有空点：',rep.data[i].ET,rep.data[i+1].ST,'需要补:',rep.data[i+1].ST-rep.data[i].ET-1,'位')
//                 for(j=0;j<rep.data[i+1].ST-rep.data[i].ET-1;j++){
//                   console.log('测试真的补一段空点：',rep.data[i].ET+j+1)
//                   testplayTimes.push(rep.data[i].ET+j+1)
//                 }
//               }
//             }
//           }
//       testplayTimes = testplayTimes.sort((a,b)=>{return a-b})
//       //console.log('整理后',testplayTimes)
//     }
//     GM_setValue("recode",LastDuration);
//     // var PlayTimes = unsafeWindow.playTimes.join(',');
//     var PlayTimes = testplayTimes.join(',');
//     // console.log('上传的播放记录'+PlayTimes);
//     unsafeWindow.playTimes = [];
//     $.ajax({
//         url: "/WebAPI/StudyTimeRecord",
//         data: { KCID: unsafeWindow.kcid, ZJID: unsafeWindow.zjid, StudyTime: time, LastDuration: LastDuration, PlayTimes: PlayTimes },
//         type: 'post',
//         dataType: "json",
//         success: function (re) {
//             GM_setValue('repre',re)
//             //console.log('登记成功')
//             // console.log('现在登记情况',re);
//             if (re.code == 0) {
//                 progressbarSet(re.data);
//             }

//         },
//         error: function () {
//                 //layer.msg("网络发生错误");
//         }
//     });
//   }


  // var time = unsafeWindow.setInterval(function() {
  //   console.log('数组内容检测：'+unsafeWindow.playTimes)
  //   },5000)
  // var t1 = window.setTimeout(function() {
  //   unsafeWindow.player.changeVolume(0)
  //   console.log('1秒钟之后执行了静音')
  // },1000)
  // var t2 = window.setTimeout(function() {
  //   // unsafeWindow.player.playOrPause()
  //   console.log('1秒钟之后更改倍速')
  //   unsafeWindow.player.changePlaybackRate(6)
  // },1000)
})

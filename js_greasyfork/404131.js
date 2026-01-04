// ==UserScript==
// @name        尚硅谷自动播放(1-3)
// @namespace   gulixueyuan.com
// @match       http://www.gulixueyuan.com/course/*/tasks
// @grant       SGG_addStyle
// @version     1.1
// @author      Mr.Wang
// @description 尚硅谷自动连续播放视频，加载完所有课程后点击开始即可自动依次播放所有课程，需要配合其他两个脚本完成视频播放完自动播放下一个
// @require     http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/404131/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%281-3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/404131/%E5%B0%9A%E7%A1%85%E8%B0%B7%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%281-3%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $(function () {
      var win = null;
      var url = 'http://www.gulixueyuan.com/course/$taskId/task/$ID/activity_show';
      
      var getMinutes = function(start,now){
        var secs;
        if(!now){
          secs = Math.floor(start / 1000);
        }else{
          secs = Math.floor((now-start) / 1000);
        }

        var min = Math.floor(secs / 60);
        var hour = 0;
        if(min>=60){
          hour = Math.floor(min/60);
          min = min % 60;
        }
        
        min = min < 10 ? '0' + min : min;
        
        hour = hour < 10 ? '0' + hour : hour;

        var sec = secs % 60;
        sec = sec < 10 ? '0' + sec : sec;

        var str = hour + ':' + min + ':' + sec;
        return str;
      }

      var createPop = function(){
        var html = '<button id="showBtn" style="display:none;width:75px;position:absolute;top:6px;right:21px;color:#000;z-index:99999">显&nbsp;&nbsp;&nbsp;&nbsp;示</button>\
                    <div id="content" style="color:#000;width:600px;height:820px;position:fixed;top:0;right:0;border: 1px solid #919191;padding: 20px;background: #fff;z-index:99998">\
                      <div id="btnDiv" style="margin:-15px 0 15px 0;">\
                          <button id="loadBtn" style="width:75px;display:none;">加载全部</button>\
                          <button disabled id="startBtn" style="width:75px;">开&nbsp;&nbsp;&nbsp;&nbsp;始</button>\
                          <button id="restartBtn" style="width:75px;display:none;">重新开始</button>\
                          <button disabled id="getTask" style="width:75px;">获&nbsp;&nbsp;&nbsp;&nbsp;取</button>\
                          <button disabled id="showTask" style="width:75px;">查&nbsp;&nbsp;&nbsp;&nbsp;看</button>\
                          <button disabled id="nextBtn" style="width:75px;margin-right: 20px;" onclick="nextPlay()">下一个</button>\
                          调试：<input type="checkbox" style="vertical-align: middle;margin-top: -1px;" id="debugModal" />\
                          <button id="collapseBtn" style="width:75px;float: right;">折&nbsp;&nbsp;&nbsp;&nbsp;叠</button>\
                      </div>\
                      <div style="height:40px;">\
                        <div style="float:left;">\
                          <b>课程ID：</b>\
                          <input type="text" id="taskId" style="padding-left: 5px;width:150px;margin-left: 30px;" readOnly value="370"/>\
                        </div>\
                        <div style="margin-left:56px;float:left;">\
                          <b>起始课程ID：</b>&nbsp;&nbsp;&nbsp;\
                          <input type="text" id="startId" style="padding-left: 5px;width:130px;margin-left:6px;" value="13384"/>\
                        </div>\
                        <div style="clear:both;"></div>\
                      </div>\
                      <div style="height:40px;">\
                        <div style="float:left;">\
                          <b>播放时间：</b>\
                          <input type="text" id="recMax" style="padding-left: 5px;width:150px;margin-left: 17px;" value="1440"/>&nbsp;&nbsp;分钟\
                        </div>\
                        <div style="height:40px;margin-left:20px;float:left;">\
                          <b>播放间隔：</b>\
                          <input type="text" id="delay" style="padding-left: 5px;width:130px;margin-left: 33px;" value="5"/>&nbsp;&nbsp;秒\
                        </div>\
                        <div style="clear:both;"></div>\
                      </div>\
                      <div style="height:40px;">\
                        <div>\
                          <b>排除课时ID：</b>\
                          <input type="text" id="excludeIds" style="padding-left: 5px;width:445px;" value="13709"/>\
                        </div>\
                      </div>\
                      <div style="padding: 0 0 10px 0;">日志信息：<a id="clearLog" style="color: blue;float: right;" href="javascript:void(0)">清&nbsp;&nbsp;除</a></div>\
                      <textarea id="log" readonly style="color:#919191;height:600px;border: 1px dashed #919191;padding: 10px;font-size:12px;overflow: auto;line-height: 18px;width:100%;outline:none;"></textarea>\
                    <div>';
        $('body').append(html);
        $('#showBtn').click(function(){
          $('#showBtn').hide();
          $('#content').show();
        });
        $('#collapseBtn').click(function(){
          $('#content').hide();
          $('#showBtn').show();
        });
        $('#getTask').click(function(){
          getTasks();
        });
        $('#showTask').click(function(){
          if(!window.unsafeWindow.getTaskFlag){
            log('请先点击“获取”按钮获取任务');
            return;
          }
          showTasks();
        });
        $('#startBtn').click(function(){
          console.clear();
          $('#log').val(null);
          startPlay();
          $('#startBtn').hide();
          $('#restartBtn').show();
        });
        $('#restartBtn').click(function(){
          console.clear();
          $('#log').val(null);
          startPlay();
        });
        $('#loadBtn').click(function(){
          loadTasks();
        });
        $('#clearLog').click(function(){
          console.clear();
          $('#log').val(null);
        });
        
        var url = window.location.href;
        var taskId = url.substring(url.indexOf('/course')+8,url.indexOf('/tasks'));
        $('#taskId').val(taskId);
      }
      var log = function(msg,inline){
        if(inline){
          $('#log').val($('#log').val() + msg);
        }else{
          console.log(msg);
          $('#log').val($('#log').val() + msg +'\r\n');
        }
        $('#log').animate({scrollTop:$('#log').prop("scrollHeight")}, 0);
      }
      var loadTasks = function(){
        var loadMsg = '正在加载所有课程，请稍等';
          log(loadMsg,true);
          var ii = setInterval(function(){
            $(window).scrollTop(999999);
            log('.',true);
          },300);
          setTimeout(function(){
            log('\r\n已加载完成所有课程......')
            clearInterval(ii);
            $(window).scrollTop(-999999);
            getTasks();
            showTasks();
            $('#btnDiv button').removeAttr('disabled');
          },6000);
      }
      var getTasks = function(){
        window.unsafeWindow.getTaskFlag = true;
        window.unsafeWindow.totalMillSecs = 0;
        window.unsafeWindow.arr = [];
        var taskId = $('#taskId').val();
        var startId = $('#startId').val();
        var excludeIds = $('#excludeIds').val();
        excludeIds = excludeIds ? excludeIds.split(',') : [];
        
        $('ul.task-list li.task-item a.title').each(function(){
          var title = $(this).text().replace('免费','').trim();
          var href,id;
          if(title.indexOf('课时')>-1){
            if($(this).attr('href') == '#modal'){
              href = $(this).attr('data-url');//无权限
              id = href.substring(href.indexOf('task/')+5,href.indexOf('/preview'));//无权限
            }else{
              href = $(this).attr('href');
              id = href.substring(href.indexOf('task/')+5,href.indexOf('/show'));
            }
            
            if(id>=startId){
              for(var j=0;j<excludeIds.length;j++){
                if(excludeIds[j] == id){
                  return true;
                }
              }
              var open_url = url.replace('$taskId',taskId).replace('$ID',id);
              var length = $(this).next().children('tmp').html().trim();
              var min = length.substring(0,length.indexOf(':')).trim();
              var sec = length.substring(length.indexOf(':')+1).trim();
              var secs = parseInt(min)*60+parseInt(sec);
              window.unsafeWindow.totalMillSecs += secs * 1000;
              window.unsafeWindow.arr.push({
                length: length,
                title : title,
                url : open_url,
                min : min,
                sec : sec,
                secs : secs
              });
            }
          }
        });
        log('获取任务完成......');
      };
      var showTasks = function(){
        for(var i=0;i<window.unsafeWindow.arr.length;i++){
            log(window.unsafeWindow.arr[i].title + '，时长：' + window.unsafeWindow.arr[i].length);
          }
          log('本次获取到的课时共计'+window.unsafeWindow.arr.length+'课，总时长：' + getMinutes(window.unsafeWindow.totalMillSecs));
      }
      var startPlay = function(){
        getTasks();
        window.unsafeWindow.i = 0;
        window.unsafeWindow.startMillSecs = new Date().getTime();
        nextPlay();
      };

      window.unsafeWindow.nextPlay = function(){
        var delay = $('#delay').val();
        delay = delay ? delay * 1000 : 5000;
        var maxTime = $('#recMax').val();
        maxTime = maxTime ? maxTime * 1 : 1200;
        
        if(!window.unsafeWindow.startMillSecs){
          log('请先点击“开始按钮”开始任务');
          return;
        }
        if(win) win.close();
        if(window.unsafeWindow.i==arr.length){
          log('本次播放已完成');
          return;
        }
        var playedMinute = Math.ceil((new Date().getTime() - window.unsafeWindow.startMillSecs) / 1000 / 60);
        var recMinute = Math.ceil((new Date().getTime() + window.unsafeWindow.arr[window.unsafeWindow.i].secs * 1000 + delay - window.unsafeWindow.startMillSecs) / 1000 / 60);
        if(recMinute > maxTime){
          log('本次已连续播放' + playedMinute + '分钟，下节课程时长为：'+window.unsafeWindow.arr[window.unsafeWindow.i].length+'，将超过最大播放时长，本次播放结束');
          return;
        }
        log('【准备播放】' + window.unsafeWindow.arr[window.unsafeWindow.i].title + '，时长：' + window.unsafeWindow.arr[window.unsafeWindow.i].length + '，开始时间：' + getMinutes(window.unsafeWindow.startMillSecs,new Date().getTime()+delay+8000));
        setTimeout(function(){
          if($('ul.task-list li.task-item a.title').eq(0).attr('href')!='#modal'){
            if(!$('#debugModal')[0].checked){
              win = window.open(window.unsafeWindow.arr[window.unsafeWindow.i].url);
            }else{
              log('调试状态，暂不打开视频播放窗口......');
            }
          }else{
            log('尚无权限播放，暂不打开视频播放窗口......');
          }
          
          window.unsafeWindow.i++;
        },delay)
      }

      createPop();
      $('#loadBtn').click();
  });
})();
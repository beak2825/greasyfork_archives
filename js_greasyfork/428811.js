// ==UserScript==
// @name         Course Learning Auto Finish
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Course Learning Auto Finish!
// @author       Carl
// @match        *://*.ouchn.cn/*
// @grant        GM_log
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/428811/Course%20Learning%20Auto%20Finish.user.js
// @updateURL https://update.greasyfork.org/scripts/428811/Course%20Learning%20Auto%20Finish.meta.js
// ==/UserScript==



(function() {
    'use strict';

       // Your code here...
    var cur_page_url = location.href;
  

    var tip_html = "<div id='some-tip' style='z-index:9999;position: fixed;background: red;color: white;font-size: 50px;top: 0;display:none;'>正在自动学习中，请勿关闭此页面</div>";
    var ctrl_html = '<div style="z-index: 9999;position: absolute;top: 100px;background: black;color: red;font-size: 37px;">' +
        '<p id="oper-tip">点击下方按钮，开始自动学习，请勿关闭自动开启的页面</p>' +
        '<button id="btn-start" type="button" style="' +
        'margin: 30px 140px;' +
        'cursor: pointer;' +
        '" >开始自动学习</button>' +
        '<br>总课程数：<span id="total-task"></span>' +

        '<br>' +
        '当前学习任务完成情况：<span id="progress"></span>' +
        '</div>';

    var audio = document.createElement('audio');
    audio.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/202003/12681.mp3';
    audio.loop = "loop";

     var home_page = "https://menhu.pt.ouchn.cn";
     window.start = false;
    //处理home获取所有的课程链接
    //alert(cur_page_url + " " + home_page + " " + cur_page_url.indexOf(home_page));
    if (cur_page_url.indexOf(home_page) >= 0){
     $("body").append(ctrl_html);
     GM_setValue('learnSummray', null);
     $('#btn-start').click(function () {
        var learnSummray = GM_getValue('learnSummray');
        if(learnSummray && learnSummray.length > 0) {
            window.start = true;
            $('#btn-start').hide();
            populateStudySummary(learnSummray);
            window.open(learnSummray[0].courseURL);
        } else {
             $('#progress').append('<div> 无需要自动学习的课程 </div>');
        }
     });

     window.addEventListener('message', (msg) => {
         var learnSummray =  JSON.parse(msg.data);
         populateStudySummary(learnSummray);


     })

     var tryMax = 20;
     var tryCount = 0;
     var timer1 = setInterval(function(){
         if(tryCount == tryMax) {
             window.clearInterval(timer1);
             return;
         } else {
             console.info(tryCount + " " + $(".course_XSKBXX"));
             if($(".course_XSKBXX").length > 0) {
                  $(".course_XSKBXX").each(function (index, elem){
                      var courseURL = $(elem).find('a').attr("href");
                      var courseName = $(elem).find('p:eq(1)').html();
                      var courseId = getCourse(courseURL);
                      addCourseSummray(courseId, courseURL, courseName);
                  })
                 var learnSummray = GM_getValue('learnSummray');
                 console.info(learnSummray);
                 if (learnSummray.length > 0){
                     $('#total-task').html("" + learnSummray.length);
                     populateStudySummary(learnSummray);
                 }
                 window.clearInterval(timer1);
                 return;
             }
         }
         tryCount++;
     },500);
    }

    var course_page = 'http://lms.ouchn.cn/course';
    var learnSummray = null;
    if(cur_page_url.indexOf(course_page) >= 0){
        $("body").append(tip_html);
        $("#some-tip").show();
        learnSummray = GM_getValue('learnSummray')
        var pushMsgTimmer = window.setInterval(function () {
            for(var i = 0; i< learnSummray.length; i++) {
                var courseId = learnSummray[i].courseId;
                getActivites(courseId, function (courseId, activities) {
                    var courseSummary = getCourseSummary(learnSummray, courseId);
                    if(!courseSummary.autoActivities) {
                        courseSummary.autoActivities = {};
                        for(var i = 0; i < activities.length; i++) {
                            if(activities[i].type === 'page' || activities[i].type ===  'online_video' || activities[i].type === 'web_link' || activities[i].type === 'material') {
                                courseSummary.autoActivities[activities[i].id] = false;
                            }
                        }
                    }
                    getCompletedCourse(courseId, activities);
                });
            }
        }, 15000);
/*
        window.setTimeout(function () {
           for(var i = 0; i< learnSummray.length; i++) {
            var courseId = learnSummray[i].courseId;
            getActivites(courseId, function (courseId, activities) {
                for(var i = 0; i < activities.length; i++) {
                    if(activities[i].type === 'page' || activities[i].type === 'web_link' || activities[i].type === 'material') {
                        autoCompleteCourse(courseId, activities[i].id);
                    } else if( activities[i].type ===  'online_video') {
                        var duration =  activities[i].uploads[0] ? parseInt(activities[i].uploads[0].videos[0].duration) : null;
                        autoCompleteCourse(courseId, activities[i].id, duration);
                    }
                }
            });
         }
        }, 3000);
 */

    }

    function getActivityById(id, activities) {
        var activity = null;
        for(var i = 0; i < activities.length; i++) {
            if(activities[i].id == id) {
                activity = activities[i];
                break;
            }
        }
        return activity;
    }

    function populateStudySummary(learnSummray) {
        if(!learnSummray) return;
         console.info(learnSummray)
         $('#progress').html('');
         for(var i = 0; i < learnSummray.length; i++) {
             var totalAutoLearn = learnSummray[i].autoActivities ? Object.keys(learnSummray[i].autoActivities).length: 0;
             var completedAutoLearn = 0;
             if(learnSummray[i].autoActivities) {
                 for(var key in learnSummray[i].autoActivities) {
                     if(learnSummray[i].autoActivities[key] == true) {
                         completedAutoLearn++;
                     }
                 }
             }
             $('#progress').append('<div>'+ learnSummray[i].courseName + '  自动学习:' + completedAutoLearn + '/'+ totalAutoLearn + '</div>');
         }

        var allCompleted = checkAllCourseAutoLearnCompleted(learnSummray);
        if(allCompleted == true) {
            $('#progress').append('<div> 自动学习已完成，请切换账号！ </div>');
            $('#btn-start').show();
            audio.play();
        } else if(window.start === true){
            $('#progress').append('<div> 自动学习中...... </div>');
        }
    }

    function getCourse(mainCourseURL) {
        var regex = /http:\/\/lms.ouchn.cn:80\/course\/([\d]+)\/content/;
        var group = mainCourseURL.match(regex);
        return group[1];
    }

    function getActivites(courseId, callback) {
        var url = 'http://lms.ouchn.cn/api/courses/'+ courseId +'/activities?no_cache=' + new Date().getTime()
        $.get(url, function(data){
            console.info(data);
            if(data.activities) {
                callback(courseId, data.activities)
            }
        });
    }

    function autoCompleteCourse(courseId, moduleId, duration) {
        var url = 'http://lms.ouchn.cn/api/course/activities-read/' + moduleId;
        if(duration) {
            $.ajax({
                type:'POST',
                url:url,
                contentType:'application/json;charset=UTF-8', // JSON，Request Payload
                data: JSON.stringify({start: 0, end: duration}),
                success:function(data){

                }
            })
        } else {
            $.post(url, function(data) {

            });
        }
    }

    function getCompletedCourse(courseId, activities) {
        var url = 'http://lms.ouchn.cn/api/course/'+courseId+'/activity-reads-for-user?no_cache=' + new Date().getTime()
        $.ajax({
            type: 'GET',
            url: url,
            async:false,
            dataType: 'json',
            success: function(data){
                var courseSummaryIndex = getCourseSummaryIndex(learnSummray, courseId)
                var courseSummary = getCourseSummary(learnSummray, courseId);
                var completedCourses = data.activity_reads;
                for(var courseModuleId in courseSummary.autoActivities) {
                    var isCompleted = isCompletedCourseModule(courseModuleId, completedCourses);
                    courseSummary.autoActivities[courseModuleId] = isCompleted;
                    if(!isCompleted) {
                        var activity = getActivityById(courseModuleId, activities);
                         if(activity.type === 'page' || activity.type === 'web_link' || activity.type === 'material') {
                             autoCompleteCourse(courseId, activity.id);
                         } else if( activity.type ===  'online_video') {
                             var duration =  activity.uploads[0] ? parseInt(activity.uploads[0].videos[0].duration) : null;
                             autoCompleteCourse(courseId, activity.id, duration);
                         }
                    }
                }
                learnSummray[courseSummaryIndex] = courseSummary;
                window.opener.postMessage(JSON.stringify(learnSummray), "*")
                var allCompleted = checkAllCourseAutoLearnCompleted(learnSummray);
                if(allCompleted) {
                    window.close();
                }
            }
        });
    }

   function checkAllCourseAutoLearnCompleted(learnSummray) {
       var allCompleted = true;
       for(var i = 0; i < learnSummray.length; i++) {
           var totalAutoLearn = learnSummray[i].autoActivities ? Object.keys(learnSummray[i].autoActivities).length: 0;
           var completedAutoLearn = 0;
           if(learnSummray[i].autoActivities) {
               for(var key in learnSummray[i].autoActivities) {
                   if(learnSummray[i].autoActivities[key] == true) {
                       completedAutoLearn++;
                   }
               }
           }
           if(totalAutoLearn == 0 || completedAutoLearn == 0 || totalAutoLearn != completedAutoLearn) {
               allCompleted = false;
           }
       }
       return allCompleted;
   }


    function isCompletedCourseModule(courseModuleId, completedCourses) {
        var result = false;
        for(var i = 0; i < completedCourses.length; i++) {
            if(completedCourses[i].activity_id == courseModuleId && completedCourses[i].completeness == 'full') {
                result = true;
                break;
            }
        }
        return result;
    }

    function addCourseSummray(courseId, consumerURL, courseName) {
        var learnSummray = GM_getValue('learnSummray');
        if(!learnSummray) {
            learnSummray = new Array();
        }
        var courseSummary = getCourseSummary(learnSummray, courseId);
        if(courseSummary == null) {
            courseSummary = {'courseId': courseId, 'courseURL': consumerURL, 'courseName': courseName}
            learnSummray.push(courseSummary)
        }
        GM_setValue('learnSummray', learnSummray);
    }

    function getCourseSummary(learnSummray, courseId) {
        if(!learnSummray) {
            learnSummray = GM_getValue('learnSummray');
        }
        if(!learnSummray) return null;
        var currentCourse = null;
        for(var i = 0; i < learnSummray.length; i++) {
            if(learnSummray[i].courseId == courseId) {
                currentCourse = learnSummray[i];
                break;
            }
        }
        return currentCourse;
    }

    function getCourseSummaryIndex(learnSummray, courseId) {
        if(!learnSummray) return null;
        var currentIndex = null;
        for(var i = 0; i < learnSummray.length; i++) {
            if(learnSummray[i].courseId == courseId) {
                currentIndex = i;
                break;
            }
        }
        return currentIndex;
    }





})();
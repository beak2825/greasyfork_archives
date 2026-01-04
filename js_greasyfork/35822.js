// ==UserScript==
// @name gdst-study
// @description javascripts for auto study
// @match			http://online.enetedu.com/gdst/SchoolCourse/Process*
// @include			http://online.enetedu.com/gdst/SchoolCourse/Process*
// @match			http://online.enetedu.com/gdst/Activities/NetworkVoting*
// @include			http://online.enetedu.com/gdst/Activities/NetworkVoting*
// @run-at      document-start
// @version 1.0
// @namespace gdst
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35822/gdst-study.user.js
// @updateURL https://update.greasyfork.org/scripts/35822/gdst-study.meta.js
// ==/UserScript==
// *** put your code inside letsJQuery: ***
function getValueByName(str, d1, d2, name) {
  var arr = str ? str.split(d1)  : [
  ];
  for (var i = arr.length - 1; i >= 0; i--) {
    arr2 = arr[i].split(d2);
    if (arr2.shift() == name) {
      return arr2.join();
    }
  }
  return '';
}
function sleep(sleepDuration) {
  var now = new Date().getTime();
  while (new Date().getTime() < now + sleepDuration) { /* do nothing */
  }
}
function readCookie(name) {
  return getValueByName(document.cookie, ';', '=', name);
};
function emptyFunction() {
};
if (window.location.href.indexOf('/gdst/SchoolCourse/Process?course_id=') >= 0) {
  var learn = readCookie(' enet_studentCourseWareLearn0');
  var stu_id = getValueByName(learn, '&', ',', 'student_id');
  var cour_id = getValueByName(learn, '&', ',', 'course_id');
  setTimeout(function () {
    var list = $('a.video_number');
    if (list.length > 0) {
      var timestamp = parseInt(new Date().getTime());
      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i].parentNode.style['background-color'] != 'rgb(112, 240, 106)') {
          var v_id = getValueByName(list[i]['href'], '&', '=', 'courseware_id');
          if (v_id == '') continue;
          var url = '/gdst/VideoPlay/StudyRecode?is_elective=&end=100000&start=100000';
          url = url + '&student_id=' + stu_id;
          url = url + '&course_id=' + cour_id;
          url = url + '&courseware_id=' + v_id;
          url = url + '&timestamp=' + timestamp;
          $.get(url);
          timestamp = timestamp + parseInt(Math.random() * 5000);         
        }
      }
    } else {
      setTimeout(arguments.callee, 300);
    }
  }, 500);
}
if (window.location.href.indexOf('/gdst/Activities/NetworkVoting') >= 0) {

  function doVote(id, t_id) { 
    //alert("doVote:"+id + t_id);
    $.get('/gdst/Activities/NetworkVotingDetail?id=' + id, function (result) {
      var reg = /id=\"voteid\"\s+value=\"(\d+)\"/gi;
      var res = reg.exec(result);
      if (res == null || res.length < 2) return;
      var v_id = res[1];
      var url = '/gdst/Activities/SubmitZAN?&t=' + Math.random();
      var paras = {
        'zantype': Math.random() > 0.5 ? 1 : 0,
        'id': id,
        'voteid': v_id
      };
      $.post(url, paras);
      //alert(list[i].innerHTML);
      $('#' + t_id)[0].innerHTML = '[已投票!]' + $('#' + t_id)[0].innerHTML;
    });
  };
  
  setTimeout(function () {
    var list = $('a.searchtopic');
    if (list.length > 0) {
      for (var i = list.length - 1; i >= 0; i--) {
        var id = getValueByName(list[i]['href'], '?', '=', 'id');
        if (id == '') continue;
        list[i].id = 'doVoteid_' + parseInt(Math.random() * 1000000);
        //alert('doVote(' + id + ',' + list[i].id + ');');
        //setTimeout('doVote(' + id + ',' + list[i].id + ');', 50);
        doVote(id, list[i].id);
        // break;
      }
    } else {
      setTimeout(arguments.callee, 300);
    }
  }, 500);
}

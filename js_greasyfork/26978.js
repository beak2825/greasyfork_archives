// ==UserScript==
// @name         Acfun_plus_min
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  为acfun提供便捷举报和推送列表下拉功能
// @author       星雨漂流
// @match        http://www.acfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26978/Acfun_plus_min.user.js
// @updateURL https://update.greasyfork.org/scripts/26978/Acfun_plus_min.meta.js
// ==/UserScript==

//举报模块函数
var run = function() {
    var str = '<div class=\'jubk\'><select class=\'xrze\'><option value=\'1\'>色情</option><option value=\'2\'>血腥</option><option value=\'3\'>暴力</option>';
    str += '<option value=\'4\'>猎奇</option><option value=\'5\'>政治</option>';
    str += '<option value=\'6\'>辱骂</option><option selected=\'selected\' value=\'7\'>广告</option><option value=\'8\'>挖坟</option><option value=\'9\'>其他</option></select>';
    str += '<button class=\'jubk_this\' onclick=\'tip_off(this)\'>提交</button></div>';
    str += '<div class=\'jubk_su\'>举报成功</div><div class=\'jubk_fa\'>举报失败</div>';
    $('.item-comment').append(str);
    $('.xrze').css({
        'width': '60px',
        'min-width': '60px',
        'border-radius': '5px'
    });
    $('.jubk').css({
        'position': 'absolute',
        'right': 0,
        'bottom': '25px',
        'opacity': 0.1
    });
    $('.jubk_su').css({
        'position': 'absolute',
        'background-color': '#3a9bd9',
        'right': 0,
        'bottom': '55px',
        'color': '#fff',
        'padding': '2px',
        'display': 'none'
    });
    $('.jubk_fa').css({
        'position': 'absolute',
        'background-color': '#ff3a35',
        'right': 0,
        'bottom': '55px',
        'color': '#fff',
        'padding': '2px',
        'display': 'none'
    });
    $('.jubk').hover(function() {
        $(this).css('opacity', 1);
    });
    $('.jubk').mouseleave(function() {
        $(this).css('opacity', 0.1);
    });
};

// 返回纯数字
var getNum = function(text) {
    var value = text.replace(/[^0-9]/gi, '');
    return value;
};
//获取举报评论的相关信息
var getPreData = function(element) {
    var me = element,
        d = [];
    d[0] = $(me).parent().parent().find('.name').html();
    d[1] = location.href;
    d[2] = 2;
    d[3] = $(me).parent().find('.xrze').val();
    d[4] = $(me).parent().parent().find('.index-comment').html();
    d[5] = $.parseSafe($(me).parent().parent().find('.content-comment').html());
    d[6] = getNum($(me).parent().parent().attr('id'));
    return d;
};
//返回验证码

window.tip_off = function(element){
    $("#captcha img").attr("src", '/captcha.svl?d=' + new Date().getTime());
    var me = element,
        preData = [];
    preData = getPreData(element);
    $("#captcha").fadeIn();
    $("#captchaText").val("").focus();
    $("#captchaText").keyup(function(){
        var captcha = $("#captchaText").val();
        if(captcha.length == 4) {
            $("#captcha").hide();
            $.post('/report.aspx', {
                defendantUsername: preData[0],
                url: preData[1],
                type: preData[2],
                crime: preData[3],
                description: preData[4] + '楼,评论内容违规。',
                proof: preData[5],
                captcha: captcha,
                objectId: preData[6]
            }).done(function(t) {
                //return t.success ? console.log("success") : console.log("fail")
                if(t.success) {
                    //$(data).parent().parent().find('.jubk_su').fadeIn();
                    $("#jubao_success").fadeIn();
                    setTimeout(function() {
                        $("#jubao_success").fadeOut();
                    }, 3000);
                } else {
                    //$(data).parent().parent().find('.jubk_fa').fadeIn();
                    $("#jubao_failed").fadeIn();
                    setTimeout(function() {
                        $("#jubao_failed").fadeOut();
                    }, 3000);
                }
            });
           $("#captchaText").unbind("keyup");
        }

    });


};

//推送列表函数
window.getlist = function (page) {
  $.get('/member/publishContent.aspx?isGroup=0&groupId=-1&pageSize=10', {
    'pageNo': page
  }, function (data) {
    $.each(data.contents, function (index, value) {
      var str = '<div class=\'box\'><div class=\'left\'>';
      str += '<div class=\'head\'><img src=' + value.titleImg + ' />';
      str += '</div></div>';
      str += '<div class=\'right\'><div class=\'pushTitle\'><a target="_blank" href=\'http://www.acfun.tv' + value.url + '\'>';
      str += value.title + '</a></div></div><div class="username"><a target="_blank" href="http://www.acfun.tv/u/' + value.userId + '.aspx#area=post-history">by&nbsp' + value.username + '</a></div></div>';
      $('#pushList').append(str);
      $('.box').css({
        'width': '100%',
        'clear': 'both',
        'margin-top': '20px',
        'height': '60px',
        'position': 'relative',
      });
      $('.box>.left').css({
        'width': '30%',
        'text-align': 'center',
        'float': 'left',
        'vertical-align': 'middle'
      });
      $('.box>.left>.head').css('width', '80%');
      $('.box>.left>.head>img').css('width', '100%');
      $('.box>.right').css({
        'float': 'left',
        'width': '70%',
        'text-align': 'left'
      });
      $('.box>.right>.pushTitle>a').css({
        'line-height': '15px',
        'font-size': '12px'
      });
      $('.box>.right>.pushTitle').css({
        'line-height': '15px',
        'font-size': '12px'
      });
      $('#pushList .username').css({
        'width': '98%',
        'padding-right': '2%',
        'text-align': 'right',
        'color': '#ddd',
        'font-size': '10px',
        'clear': 'both',
        'position': 'absolute',
        'bottom': '0',
      });
      $('#pushList .username>a').css({
        'color': '#b5b5b5',
        'font-size': '12px'
      });
    });
  });
};
$(document).ready(function(){
    
    $('#win-info-guide>.mainer>.b').after('<div id=\'pushList\'></div>');
  $('#win-info-guide').css({
    'width': '300px'
  });
  $(".guide-item-con").append('<div id=\'pushList\'></div>').css("width", "300px");
  $(".guide-item-con .more").appendTo($(".guide-item").eq(0).find(".guide-item-con"));
    $(".guide-item-con .more").eq(0).hide();
  var arr = [];
  getlist(1);
  $('#pushList').css({
    'height': '350px',
    'overflow-y': 'auto',
   
    'border-radius': '2px'
  });
   $(".guide-item-con #pushList").css({"width":"97%", "margin-left":"3%"});
   $("#win-info-guide #pushList").css({"padding-left":"8px", "width":"100%", 'box-shadow': '0px 0px 3px #555 inset'});
  $('#win-info-guide').hover(function () {
    $('#pushList').scrollTop(0);
  });
  var page = 2;
  $('#pushList').scroll(function () {
    var pushH = $('#pushList').height();
    var pushB = document.getElementById('pushList').scrollHeight - pushH;
    var scroll = $(this).scrollTop();
    if (scroll == pushB) {
      getlist(page);
      page++;
    }
  });
});
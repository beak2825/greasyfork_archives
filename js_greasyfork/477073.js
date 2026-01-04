// ==UserScript==
// @name  Ticket snatching
// @namespace    nono
// @version      3.0
// @description  tickets
// @author       K
// @match        https://shop.48.cn/tickets/item/*
// @icon         https://www.google.com/s2/favicons?domain=48.cn
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.8.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477073/Ticket%20snatching.user.js
// @updateURL https://update.greasyfork.org/scripts/477073/Ticket%20snatching.meta.js
// ==/UserScript==



$(window).load(function(){
  var loading = false;
  var loadingObj;
  var serviceTime;
  var timeCompensate = 0;
  var beginTime = new Date(new Date().toLocaleDateString()+" 20:00:00.000").getTime();

  function countDown() {
    clearInterval(timer);
    var sys_second = 600;
    var minute_elem = $('.colockbox').find('.minute');
    var second_elem = $('.colockbox').find('.second');
    var timer = setInterval(function() {
      if (sys_second > 1) {
        sys_second -= 1;
        var minute = Math.floor((sys_second / 60) % 60);
        var second = Math.floor(sys_second % 60);
        $(minute_elem).text(minute < 10 ? "0" + minute : minute); //计算分钟
        $(second_elem).text(second < 10 ? "0" + second : second); //计算秒杀
      } else {
        layer.closeAll();
        clearInterval(timer);
      }
    },
    1000);
  }

  var delay = 200;

  function loop(id) {
    layer.msg('提交中.....');
    setTimeout(function() {
        console.log("有loop")
      tickets(id);
    }, delay);
  }

  function tickets(id) {
    var _url = "/TOrder/tickCheck";
    var _id = $("#tickets_id").val();
    var _seattype = $("#seat_type").val();

    $.ajax({
      url: _url,
      type: 'GET',
      dataType: 'json',
      data: {
        id: _id,
        seattype:_seattype,
        r: Math.random()
      },
      success(result) {
        console.log("有去到ticketid")
        if (result.HasError) {
          $('.title_g1').html(result.Message);
          layer.closeAll();
          layer.msg("操作失败",
            {
              type: 1,
              skin: '', //样式类名
              closeBtn: 0, //不显示关闭按钮
              shift: 2,
              shade: [0.8, "#000000"],
              content: $('#info5'),
              time: 0
          });
          loop(id);
        } else {
          switch (result.ErrorCode) {
            case"wait":
              setTimeout(function() {
                tickets(id)
              }, 3000);
              break;
            case"fail":
              //失败操作
              $('.title_g1').html(result.Message);
              layer.closeAll();
              layer.msg("抢票失败",
                {
                  type: 1,
                  skin: '',
                  closeBtn: 0,
                  shift: 2,
                  shade: [0.8, "#000000"],
                  content: $('#info5'),
                  time: 10000
                });
                break;
            case"success":
              layer.close(loadingObj);
              layer.alert('抢票成功', {
                skin: 'layui-layer-molv',
                closeBtn: 0,
                content: '即将跳转订单页面...',
                time: 2000
              }, function() {
                window.location.href = result.ReturnObject;
              })
              break;
          }
        }
      },
      error() {
        layer.closeAll();
        layer.msg("您排队失败，请刷新重试aa");
      }
    })
  }

  // 购票
  function buy() {
    console.log("buy()");
    var _url = "/TOrder/ticket_Add";
   //购票数量
    var _num = $.trim($("#num").val());;
      //座位：v座2，普座3，站票4
    var _seattype = $("#seat_type").val();
      //票务号码
    var _id = $("#tickets_id").val();
    //brandid 1是上海，2是北京，3是广州
      var _brand_id = "1"
      //ticketstype 1是未开售，2是开售
    var _ticketstype ="2";
    var _choose_times_end = $("#choose_times_end").length == 0 ? -1 : parseInt($("#choose_times_end").val());
    if (_seattype == "" || _seattype == "0") {
      console.error("请选择座位类别");
      layer.msg("请选择座位类别");
      return;
    }
    if (_num == "") {
      console.error("请输入数量");
      layer.msg("请输入数量");
      return;
    }

    if (_choose_times_end == 0) {
      console.error("请选择“参与抽选”");
      return;
    }
    $.ajax({
      url: _url,
      type: "post",
      dataType: "json",
      data: {
        ticketsid: _id,
        num: _num,
        seattype: _seattype,
        brand_id: _brand_id,
       choose_times_end: _choose_times_end,
       ticketstype: _ticketstype,
        r: Math.random(),

      },
      success: function(result) {
        // layer.close(loadingObj);
        if (result.HasError) {
            //失败操作
            layer.msg(result.Message, {
              icon: 2,
              time: 2000
             }, function () {
              if (result.ErrorCode == "161004") {
                window.location.href = "/TOrder/Index";
              }
            });
            console.error("提交失败啦~")
        } else {
            if (result.ReturnObject != "choose_tickets") {
              //成功操作
              if (result.Message == "success") {
                layer.close(loadingObj);
                layer.alert('抢票成功', {
                  skin: 'layui-layer-molv',
                  closeBtn: 0,
                  content: '即将跳转订单页面...',
                  time: 2000
                }, function() {
                  window.location.href = result.ReturnObject;
                })
              } else {
                //countDown();
                loop(_id);
                  console.log("countdownla")
              }
            } else {
              layer.msg("提交成功，等待管理员抽选");
            }
        }
      },
      error: function(e) {
        layer.close(loadingObj);
        console.error("您排队失败，请刷新重试,错误代码:162001");
        layer.msg("您排队失败，请刷新重试");
      }
    });
  }
  function init() {
      getServiceTime();
      var currTime = new Date().getTime();
      timeCompensate = currTime - serviceTime ;
      console.log(currTime ,serviceTime ,timeCompensate);
      var timer = setInterval(() => {
          currTime = new Date().getTime();
          console.log(beginTime-currTime-timeCompensate);
          if ((beginTime-currTime-timeCompensate) <= 0) {
              clearInterval(timer);
              buy();
          }
      }, 10);
  }
    //获取系统时间
    function getServiceTime(){
	  $.ajax({
			async: false,
			url: "/pai/GetTime?" + new Date().getTime(),
			success: function(data) {
                serviceTime = data.split("(")[1].split(")")[0];
			}
	   });
    }
  // 插入开始抢票按钮
  function insertDom() {
    layer.alert('请登录账号，且选好票种后再点击开始抢票', {
       skin: 'layui-layer-molv',
       closeBtn: 0
    });
    var txtList = $(".i_sel");
    var parent = txtList[txtList.length - 1];
    var btn = $("<div style='background-color:#f17fb0;color:#fff;display:inline-block;padding:10px 25px;margin-top:15px;cursor:pointer'>开始抢票</div>");
    btn.on('click', function() {
      if (loading) return;
      loading = true;
      loadingObj = layer.load(2, {
          shade: [0.5, 'gray'],
          content: '抢票中...'
      });
      init();
    });
    $(parent).append(btn);
  }
  insertDom();
});
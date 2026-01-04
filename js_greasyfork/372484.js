// ==UserScript==
// @name         Cutemon机器人
// @namespace    Cutemon
// @version      3.66
// @description  暗中做个机器人岂不美哉_(¦3」∠)_
// @author       Cutemon
// @include      /https?:\/\/live\.bilibili\.com\/h5\/\d+\/ad\??.*/
// @require      https://static.hdslb.com/live-static/libs/jquery/jquery-1.11.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372484/Cutemon%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/372484/Cutemon%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
  var html = `<!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title></title>
        <link rel="stylesheet" href="https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.css">
        <link rel="stylesheet" href="https://s1.hdslb.com/bfs/static/blive/blfe-live-room/static/css/2.ee9e4634828b7352b7e3.vip.css">
        <style type="text/css">
            .color {
                display: inline-block;
                vertical-align: middle;
                cursor: pointer;
                box-sizing: border-box-box;
                border: 1px solid #d0d7dd;
                border-radius: 50%;
                width: 20px;
                height: 20px;
            }

            .level-0 {
                border-color: #000;
            }

            .level-0 .label{
                background-color: #000;
            }

            .level-0 .level {
                color: #000;
            }

            .guard-icon {
                width: 18px;
                height: 18px;
                background-size: cover;
            }

            .guard-level-1{
                background-image: url('//s1.hdslb.com/bfs/static/blive/blfe-live-room/static/img/icon.guard-thumb-01.e630a67.png');
            }

            .guard-level-2 {
                background-image: url(data:image/png;base64,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)
            }

            .guard-level-3 {
                background-image: url(data:image/png;base64,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);
            }
    
            #danmu_send {
                width: 500px;
            }

            .container {
                margin: 20px 0 0 20px;
            }
    
            .container div {
                margin-bottom: 10px;
            }

            .chat-history-panel .chat-history-list .chat-item.danmaku-item .admin-icon, .chat-history-panel .chat-history-list .chat-item.danmaku-item .anchor-icon, .chat-history-panel .chat-history-list .chat-item.danmaku-item .fans-medal-item-ctnr, .chat-history-panel .chat-history-list .chat-item.danmaku-item .guard-icon, .chat-history-panel .chat-history-list .chat-item.danmaku-item .title-label, .chat-history-panel .chat-history-list .chat-item.danmaku-item .user-level-icon {
                margin-right: 5px;
            }

            .dp-i-block {
                display: inline-block;
            }
            
            .v-middle {
                vertical-align: middle;
            }
            .p-relative {
                position: relative;
            }

            .u-name {
                line-height: 20px;
            }

            .admin-icon {
                background-color: #ffa340;
                margin-right: 3px;
                height: 14px;
                padding: 0 6px;
                border: 1px solid #ea9336;
                border-radius: 2px;
                line-height: 16px;
                font-size: 12px;
                color: #fff;
            }

            .admin-icon:before {
                content: "房管";
            }

            .jq-toast-wrap {
                width: 320px;
            }

            .jq-toast-wrap.top-right {
                top: 20px;
                right: 20px;
            }

            .jq-toast-single{
                width: initial;
            }

            .jq-toast-single button{
                position: relative;
                cursor: pointer;
                background-color: #444;
                color: #fff;
                font-size: 12px;
                padding: 2px 5px;
                border: 1px solid #fff;
            }

            // .jq-toast-single .danmuContent{
            //     width: 75%;
            // }

            // .jq-toast-single div button:nth-of-type(1){
            //     right: 40px;
            //     top: 35px;
            // }

            // .jq-toast-single div button:nth-of-type(2){
            //     right: 2px;
            //     top: 35px;
            // }

            .jq-toast-heading {
                font-weight: normal;
            }
        </style>
        <script src="https://greasyfork.org/scripts/42467-biwebsock/code/biWebSock.js?version=644237"></script>
    </head>
    
    <body>
        <div class="container">
            <div>
                <h1>接入秘密指挥中心</h1>
                指挥中心代号：<input type="number" placeholder="请输入指挥中心代号" id="roomID" value="">
                <button id="connect">接入并启动</button>
                <button id="danmaku_only_connect">仅接入弹幕</button>
                <button id="disconnect">断开</button>
                <button id="goToRoom">前往指挥中心</button>
                <button id="guard" style="display: none;">开船</button><br /><br />
                弹幕颜色：
                <span class="color white" color="16777215" style="background-color: rgb(255, 255, 255);"></span>
                <span class="color red" color="16738408" style="background-color: rgb(255, 104, 104);"></span>
                <span class="color blue" color="6737151" style="background-color: rgb(102, 204, 255);"></span>
                <span class="color purple" color="14893055" style="background-color: rgb(227, 63, 255);"></span>
                <span class="color cyan" color="65532" style="background-color: rgb(0, 255, 252);"></span>
                <span class="color green" color="8322816" style="background-color: rgb(126, 266, 0);"></span>
                <span class="color yellow" color="16772431" style="background-color: rgb(255, 237, 79);"></span>
                <span class="color orange" color="16750592" style="background-color: rgb(255, 152, 0);"></span>
                <span class="color pink" color="16741274" style="background-color: rgb(255, 115, 154);"></span>
            </div>
            <div>
                <span id="setColor" style="color: #EB3941;">默认弹幕颜色为 <span class="color" style="background-color: rgb(255, 255, 255);"></span></span><br />
            </div>
            <div>
                弹幕发送：<input type="text" id="danmu_send" placeholder="这是弹幕发射池……" maxlength="30" />
            </div>
            <div>
                <h1>定时轰炸系统</h1>
                轰炸间隔：<input style="width: 50px;" type="number" id="intervalTime" value="200"> 秒 <span id="setTime" style="color: #EB3941; margin-left: 10px;">默认轰炸间隔为200秒</span><br /><br />
                <button id="start">轰炸开启</button>
                <button id="clear">任务终止</button>
                <span id="switch"></span><br /><br />
                投放内容：<input id="danmu_ad" style="width: 500px; margin-bottom: 5px;" type="text" value="" placeholder="请输入投放内容，最多30个字符"
                    maxlength="30" />
                <br />
                <button id="danmu_add">新增</button><br />
            </div>
            <div id="danmu_arr">
    
            </div>
            <div id="log" style="position: absolute; left: 45%; top: 0; margin: 0;">
    
            </div>
    
            <div>
                <h1>智能精确打击</h1>
                打击目标：<input id="keyword" style="width: 200px; margin-bottom: 5px;" type="text" value="" maxlength="20" /><br />
                智能打击内容：<input id="reply" style="width: 500px; margin-bottom: 5px;" type="text" value="" maxlength="30" /><br />
                <button id="autoreply_add">新增</button><br />
            </div>
            <div id="autoreply_arr">
    
            </div>
        </div>
    </body>
    
    </html>`;

  $('body').html(html);

  // 获取用户cookie
  function get_cookie(Name) {
    var search = Name + '='; //查询检索的值
    var returnvalue = ''; //返回值
    if (document.cookie.length > 0) {
      var sd = document.cookie.indexOf(search);
      if (sd != -1) {
        sd += search.length;
        var end = document.cookie.indexOf(';', sd);
        if (end == -1) end = document.cookie.length;
        //unescape() 函数可对通过 escape() 编码的字符串进行解码。
        returnvalue = unescape(document.cookie.substring(sd, end));
      }
    }
    return returnvalue;
  }
  let token = get_cookie('bili_jct');
  $.ajaxSetup({
    crossDomain: true,
    xhrFields: {
      withCredentials: true
    },
    data: {
      csrf: token,
      csrf_token: token
    }
  });
  var CONFIG = {};
  var reconnect = '';
  var canReconnect = 1;
  var thanksForFollow;
  var intervalTime = 200;
  var color = 16777215;
  var danmu = [];
  var danmu_serial = 0;
  var keyword_reply = [];
  var keyword_ban = [];
  var gift_recorder;
  var roomId = window.location.pathname.slice(
    4,
    window.location.pathname.length - 3
  );
  var roomLongId;
  var ruid;
  var uname;
  var myUid;
  var medalName;
  var replyText = '';
  var replyFailed = '';
  var replyCD;

  function myMedal(re, allow, callback) {
    // $.ajax({
    //   type: "get",
    //   url: "//api.live.bilibili.com/i/ajaxGetMyMedalList",
    //   xhrFields: {
    //     withCredentials: true
    //   },
    //   success: function(response) {
    //     //				console.log(response.data[0]);
    //     for (let i = 0; i < response.data.length; i++) {
    //       if (uid == response.data[i].target_id) {
    //         let medalId = response.data[i].medal_id;
    //         console.log(medalId);
    //         $.ajax({
    //           type: "get",
    //           url: "//api.live.bilibili.com/i/ajaxWearFansMedal",
    //           xhrFields: {
    //             withCredentials: true
    //           },
    //           data: {
    //             medal_id: medalId
    //           },
    //           success: function(response) {
    //             console.log("勋章自动切换成功");
    if (re) {
      // console.log(re);
      // if (re == "clock") {
      //     clock();
      // } else {
      reply(re, allow, callback);
      // }
    }
    //								replyText = '_(:з」∠)_什么勋章？你看错了吧';
    //								reply();
    //           }
    //         });
    //       }
    //     }
    //   }
    // });
  }

  var cool = 0;
  var banCooldown = 0;
  var guardNum = 1;
  var guardList;
  var doJoin;
  var doCheck;

  function guardApi() {
    $.ajax({
      type: 'get',
      url:
        'https://dmagent.chinanorth.cloudapp.chinacloudapi.cn:23333/Governors',
      async: false,
      xhrFields: {
        withCredentials: false
      },
      data: null,
      success: function(response) {
        if (response.code === 0) {
          let guardArr = [];
          for (let i = 0; i < response.data.length; i++) {
            if (
              !localStorage.lastGuard ||
              response.data[i].GuardId > localStorage.lastGuard
            ) {
              let guardObj = {};
              guardObj.roomLongId = response.data[i].OriginRoomId;
              guardObj.guardId = response.data[i].GuardId;
              guardArr.push(guardObj);
            }
          }
          if (guardArr.length > 0) {
            console.log('房间总数：' + guardArr.length);
            $.toast({
              text: '房间总数：' + guardArr.length,
              icon: 'info',
              hideAfter: false,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
            let guard_num = 0;
            clearInterval(doJoin);
            doJoin = setInterval(function() {
              if (guard_num >= guardArr.length - 1) {
                localStorage.lastGuard = guardArr[guard_num].guardId;
                $.toast({
                  text: '领取完毕！最新领取：' + localStorage.lastGuard,
                  icon: 'info',
                  hideAfter: false,
                  stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                  position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                  textAlign: 'left', // Text alignment i.e. left, right or center
                  loader: false // Whether to show loader or not. True by default
                });
                console.log('最新领取：' + localStorage.lastGuard);
                clearInterval(doJoin);
                doJoin = null;
                return;
              }
              $.ajax({
                type: 'post',
                url: '//api.live.bilibili.com/lottery/v2/Lottery/join',
                async: false,
                xhrFields: {
                  withCredentials: true
                },
                data: {
                  roomid: guardArr[guard_num].roomLongId,
                  id: guardArr[guard_num].guardId,
                  type: 'guard'
                },
                success: function(response) {
                  if (response.code == 0) {
                    $.toast({
                      heading: '第' + [guard_num + 1] + '个', // Optional heading to be shown on the toast
                      text: response.data.message,
                      icon: 'success',
                      hideAfter: false,
                      stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                      position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                      textAlign: 'left', // Text alignment i.e. left, right or center
                      loader: false // Whether to show loader or not. True by default
                    });
                    console.log(response.data.message);
                  } else {
                    $.toast({
                      heading: '第' + [guard_num + 1] + '个', // Optional heading to be shown on the toast
                      text: response.msg,
                      icon: 'info',
                      hideAfter: false,
                      stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                      position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                      textAlign: 'left', // Text alignment i.e. left, right or center
                      loader: false // Whether to show loader or not. True by default
                    });
                    console.log(response.msg);
                  }
                  guard_num++;
                }
              });
            }, 2000);
          } else {
            console.log('暂时没有需要领取的房间');
            $.toast({
              text: '暂时没有需要领取亲密度的房间',
              icon: 'info',
              hideAfter: false,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
            clearInterval(doJoin);
            return;
          }
        }
      }
    });
  }

  function checkGuard() {
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/AppRoom/index',
      async: false,
      data: {
        platform: 'android',
        room_id: 164725
      },
      success: function(response) {
        if (response.data) {
          //						console.log(response.data.meta.description);
          var get_guard = response.data.meta.description.split('目前有效的');
          let timeNow = Date.parse(new Date()) / 1000;
          if (localStorage.getItem('zongdu_time') > timeNow) {
            get_guard[1] = '';
          } else {
            localStorage.setItem('zongdu_time', timeNow + 14400);
          }
          if (localStorage.getItem('tidu_time') > timeNow) {
            get_guard[2] = '';
          } else {
            localStorage.setItem('tidu_time', timeNow + 3600);
          }
          if (localStorage.getItem('jianzhang_time') > timeNow) {
            get_guard[3] = '';
          } else {
            localStorage.setItem('jianzhang_time', timeNow + 1200);
          }
          var guard_type = get_guard[1] + get_guard[2] + get_guard[3];
          guardList = guard_type.split('com/');
          // console.log(guardList[1].split("的")[0])
          if (guardList.length > 1) {
            console.log(guard_type);
            console.log('房间总数：' + guardList.length);
            $.toast({
              text: '房间总数：' + guardList.length,
              icon: 'info',
              hideAfter: false,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
            clearInterval(doJoin);
            doJoin = setInterval(function() {
              joinGuard(guardList);
            }, 2000);
          } else {
            console.log('暂时没有需要领取的房间');
            $.toast({
              text: '暂时没有需要领取亲密度的房间',
              icon: 'info',
              hideAfter: false,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
            clearInterval(doJoin);
            return;
          }
        }
      }
    });
  }

  function joinGuard(guardList) {
    let guardRoom = guardList[guardNum].split('"')[0];
    let guardId;
    // console.log(guardRoom, guardId);
    if (guardRoom.length < 5) {
      $.ajax({
        type: 'get',
        url: '//api.live.bilibili.com/room/v1/Room/room_init',
        xhrFields: {
          withCredentials: true
        },
        async: false,
        data: {
          id: guardRoom
        },
        success: function(response) {
          if (!response.data) {
            response = JSON.parse(response);
          }
          guardRoom = response.data.room_id;
        }
      });
    }
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/lottery/v1/Lottery/check_guard',
      async: false,
      xhrFields: {
        withCredentials: true
      },
      data: {
        roomid: guardRoom
      },
      success: function(response) {
        console.log(guardNum);
        if (response.data.length > 0) {
          for (let i = 0; i < response.data.length; i++) {
            guardId = response.data[i].id;
            $.ajax({
              type: 'post',
              url: '//api.live.bilibili.com/lottery/v2/Lottery/join',
              async: false,
              xhrFields: {
                withCredentials: true
              },
              data: {
                roomid: guardRoom,
                id: guardId,
                type: 'guard'
              },
              success: function(response) {
                if (response.code == 0) {
                  $.toast({
                    heading: '第' + guardNum + '个', // Optional heading to be shown on the toast
                    text: response.data.message,
                    icon: 'success',
                    hideAfter: false,
                    stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left', // Text alignment i.e. left, right or center
                    loader: false // Whether to show loader or not. True by default
                  });
                  console.log(response.data.message);
                } else {
                  $.toast({
                    heading: '第' + guardNum + '个', // Optional heading to be shown on the toast
                    text: response.msg,
                    icon: 'info',
                    hideAfter: false,
                    stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left', // Text alignment i.e. left, right or center
                    loader: false // Whether to show loader or not. True by default
                  });
                  console.log(response.msg);
                }
                if (guardNum == guardList.length - 1) {
                  localStorage.lastGuard = guardId;
                  $.toast({
                    text: '领取完毕！最新领取：' + localStorage.lastGuard,
                    icon: 'info',
                    hideAfter: false,
                    stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
                    position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
                    textAlign: 'left', // Text alignment i.e. left, right or center
                    loader: false // Whether to show loader or not. True by default
                  });
                  console.log('最新领取：' + localStorage.lastGuard);
                }
              }
            });
            // }
          }
        } else {
          $.toast({
            heading: '第' + guardNum + '个', // Optional heading to be shown on the toast
            text: guardRoom + '已领取或超过有效期',
            icon: 'info',
            hideAfter: 1500,
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
          console.log('已领取或超过有效期');
        }
        guardNum++;
        if (guardNum >= guardList.length) {
          clearInterval(doJoin);
          guardNum = 1;
        }
      }
    });
  }

  // 连接弹幕服务器并启用功能
  $('#connect').bind('click', function() {
    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {
        csrf_token: token
      }
    });
    if (canReconnect == 1) {
      canReconnect = 0;
      setTimeout(function() {
        canReconnect = 1;
      }, 30e3);
    } else {
      return;
    }
    $('#disconnect').click();
    $.fn.autoHeightTextareaDefaults = {
      rows: 0,
      minRows: 0,
      maxRows: null,
      HIDDEN_STYLE: `
          height:0 !important;
          visibility:hidden !important;
          overflow:hidden !important;
          position:absolute !important;
          z-index:-1000 !important;
          top:0 !important;
          right:0 !important;
      `,
      CONTEXT_STYLE: [
        'letter-spacing',
        'line-height',
        'padding-top',
        'padding-bottom',
        'font-family',
        'font-weight',
        'font-size',
        'text-rendering',
        'text-transform',
        'width',
        'text-indent',
        'padding-left',
        'padding-right',
        'border-width',
        'box-sizing'
      ],
      calculateNodeStyling: function(targetElement) {
        var _this = this;
        // 获取设置在当前textarea上的css属性
        var style = window.getComputedStyle(targetElement);
        var boxSizing = style.getPropertyValue('box-sizing');
        var paddingSize =
          parseFloat(style.getPropertyValue('padding-bottom')) +
          parseFloat(style.getPropertyValue('padding-top'));
        var borderSize =
          parseFloat(style.getPropertyValue('border-bottom-width')) +
          parseFloat(style.getPropertyValue('border-top-width'));
        var contextStyle = _this.CONTEXT_STYLE
          .map(function(value) {
            return value + ':' + style.getPropertyValue(value);
          })
          .join(';');

        return { contextStyle, paddingSize, borderSize, boxSizing };
      },
      mainAlgorithm: function(hiddenTextarea, textareaElement) {
        var _this = this;
        /**
           * 主要的算法依据
           * @param {string} textareaElement : textarea的DOM对象
           */
        var {
          paddingSize,
          borderSize,
          boxSizing,
          contextStyle
        } = _this.calculateNodeStyling(textareaElement);

        // 将获取到得当前得textarea的css属性作用于隐藏的textarea
        hiddenTextarea.setAttribute('style', _this.HIDDEN_STYLE + contextStyle);
        // 将当前的textarea的value设置到隐藏的textarea上面
        hiddenTextarea.value =
          textareaElement.value || textareaElement.placeholder || '';

        // 获取隐藏的textarea的height
        var height = hiddenTextarea.scrollHeight;
        if (boxSizing === 'border-box') {
          height = height + borderSize;
        } else if (boxSizing === 'content-box') {
          height = height - paddingSize;
        }
        hiddenTextarea.value = '';
        var singleRowHeight = hiddenTextarea.scrollHeight - paddingSize;

        // 如果设置有最小行数和最大行数时的判断条件，如果没有设置则取rows为最小行数
        var minRows;
        var dataRows = $(textareaElement).attr('rows');
        var dataMinRows = $(textareaElement).attr('data-min-rows');
        if (dataRows > 0 && dataMinRows > 0) {
          minRows = Math.max(dataRows, dataMinRows);
        } else if (dataRows > 0) {
          minRows = dataRows;
        } else if (dataMinRows > 0) {
          minRows = dataMinRows;
        } else {
          minRows = 1;
        }
        var maxRows = $(textareaElement).attr('data-max-rows')
          ? $(textareaElement).attr('data-max-rows')
          : null;

        if (_this.rows && _this.minRows) {
          minRows = Math.max(_this.rows, _this.minRows, minRows);
        } else if (_this.rows) {
          minRows = Math.max(_this.rows, minRows);
        } else if (_this.minRows) {
          minRows = Math.max(_this.minRows, minRows);
        }

        if (_this.maxRows && maxRows !== null) {
          maxRows = Math.min(_this.maxRows, maxRows);
        } else if (_this.maxRows) {
          maxRows = _this.maxRows;
        }

        if (minRows !== null) {
          var minHeight = singleRowHeight * minRows;
          if (boxSizing === 'border-box') {
            minHeight = minHeight + paddingSize + borderSize;
          }
          height = Math.max(minHeight, height);
        }
        if (maxRows !== null) {
          var maxHeight = singleRowHeight * maxRows;
          if (boxSizing === 'border-box') {
            maxHeight = maxHeight + paddingSize + borderSize;
          }
          height = Math.min(maxHeight, height);
        }
        // 将得到的height的高度设置到当前的textarea上面
        $(textareaElement).css('height', height + 'px');
      }
    };

    $.fn.autoHeightTextarea = function(options) {
      options = $.extend({}, $.fn.autoHeightTextareaDefaults, options);

      this.each(function(index, textareaElement) {
        var hiddenTextarea;
        // 进入页面的初始化操作
        if (!hiddenTextarea) {
          hiddenTextarea = document.createElement('textarea');
          document.body.appendChild(hiddenTextarea);
        }
        options.mainAlgorithm(hiddenTextarea, textareaElement);
        hiddenTextarea.parentNode &&
          hiddenTextarea.parentNode.removeChild(hiddenTextarea);
        hiddenTextarea = null;

        $(textareaElement)
          .on('focus', function() {
            if (!hiddenTextarea) {
              hiddenTextarea = document.createElement('textarea');
              document.body.appendChild(hiddenTextarea);
              hiddenTextarea.setAttribute('style', options.HIDDEN_STYLE);
            }
          })
          .on('input', function() {
            options.mainAlgorithm(hiddenTextarea, textareaElement);
          })
          .on('blur', function() {
            // 删除掉无用的隐藏的textarea
            hiddenTextarea.parentNode &&
              hiddenTextarea.parentNode.removeChild(hiddenTextarea);
            hiddenTextarea = null;
          });
      });
      return this;
    };
    $.toast({
      text: '蛋疼toast加载完毕', // Text that is to be shown in the toast
      icon: 'success', // Type of toast icon
      showHideTransition: 'fade', // fade, slide or plain
      allowToastClose: true, // Boolean value true or false
      hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
      stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
      position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
      textAlign: 'left', // Text alignment i.e. left, right or center
      loader: false // Whether to show loader or not. True by default
    });
    latestFollow = '';
    roomId = $('#roomID').val() || 631;
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/User/getUserInfo',
      xhrFields: {
        withCredentials: true
      },
      success: function(response) {
        myUid = response.data.uid;
      }
    });
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/AppRoom/index',
      async: false,
      data: {
        platform: 'android',
        room_id: roomId
      },
      success: function(response) {
        if (response.data.status == 'LIVE' && roomId != 164725) {
          CONFIG = {
            live_status: 1,
            gift: 1,
            follow: 1,
            ad: 1,
            reply: 1,
            ban: 1
          };
        }
        if (roomId == 8324350) {
          CONFIG.follow = 0;
        }
        roomLongId = response.data.room_id;
        ruid = response.data.mid;
        uname = response.data.uname;
        console.log(ruid, roomLongId);
        keyword_reply =
          JSON.parse(
            localStorage.getItem('auto_keyword_reply_' + roomLongId)
          ) || [];
        keyword_ban =
          JSON.parse(localStorage.getItem('ban_keyword_' + roomLongId)) || [];
        // console.log(keyword_ban);
        danmu =
          JSON.parse(localStorage.getItem('auto_ad_danmu_' + roomLongId)) || [];
        gift_recorder =
          JSON.parse(localStorage.getItem('gift_' + roomLongId)) || {};
        getDanmu();
        getReply();
        readGuardList();
        let doReconnect = function() {
          if (biWebSock.room == null) {
            latestFollow = '';
            setTimeout(function() {
              biWebSock.start(roomLongId).then(autoReply);
            }, 1e3);
          }
          return doReconnect;
        };
        reconnect = setInterval(doReconnect(), 30e3);
        if (roomId == 3) {
          checkGuard();
          doCheck = setInterval(checkGuard, 4e5);
        }
        if (
          roomId != 164725 &&
          roomId != 22557 &&
          roomId != 3 &&
          roomId != 8324350
        ) {
          thanksForFollow = setInterval(fanList, 10e3);
        }
      }
    });
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/rankdb/v1/RoomRank/webMedalRank',
      xhrFields: {
        withCredentials: true
      },
      data: {
        roomid: roomLongId,
        ruid: ruid
      },
      success: function(response) {
        if (response.data.list.length > 0) {
          medalName = response.data.list[0].medal_name;
          console.log(medalName);
          $.toast({
            text: '本房间勋章：' + medalName, // Text that is to be shown in the toast
            icon: 'success', // Type of toast icon
            showHideTransition: 'fade', // fade, slide or plain
            allowToastClose: true, // Boolean value true or false
            hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
        }
      }
    });
    let waitTime = new Date().setHours(24, 0, 0, 0) - new Date() + 10000;
    setTimeout(getFollowNum, waitTime);
  });

  // 只连接弹幕服务器
  $('#danmaku_only_connect').bind('click', function() {
    $.ajaxSetup({
      crossDomain: true,
      xhrFields: {
        withCredentials: true
      },
      data: {
        csrf_token: token
      }
    });
    if (canReconnect == 1) {
      canReconnect = 0;
      setTimeout(function() {
        canReconnect = 1;
      }, 30e3);
    } else {
      return;
    }
    $('#disconnect').click();
    $.toast({
      text: '蛋疼toast加载完毕', // Optional heading to be shown on the toast
      icon: 'success',
      showHideTransition: 'fade', // fade, slide or plain
      allowToastClose: true, // Boolean value true or false
      hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
      stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
      position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
      textAlign: 'left', // Text alignment i.e. left, right or center
      loader: false // Whether to show loader or not. True by default
    });
    roomId = $('#roomID').val() || 631;
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/AppRoom/index',
      async: false,
      data: {
        platform: 'android',
        room_id: roomId
      },
      success: function(response) {
        roomLongId = response.data.room_id;
        ruid = response.data.mid;
        console.log(ruid, roomLongId);
        let doReconnect = function() {
          if (biWebSock.room == null) {
            setTimeout(function() {
              biWebSock.start(roomLongId).then(danmakuOnly);
            }, 1e3);
          }
          return doReconnect;
        };
        reconnect = setInterval(doReconnect(), 30e3);
        if (roomId == 3) {
          checkGuard();
          doCheck = setInterval(checkGuard, 4e5);
        }
      }
    });
  });

  // 断开连接
  $('#disconnect').bind('click', function() {
    biWebSock.disconnect();
    clearInterval(reconnect);
    clearInterval(thanksForFollow);
    clearInterval(doCheck);
    clearInterval(doJoin);
    clearInterval(cool);
  });

  // 开船
  $('#guard').bind('click', function() {
    guardApi();
    doCheck = setInterval(guardApi, 6e5);
  });

  // 读取船员
  var guardListArr = [];

  function readGuardList() {
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/guard/topList',
      data: {
        page_size: 99999,
        roomid: roomLongId,
        ruid: ruid
      },
      success: function(response) {
        if (response.code === 0) {
          let top3 = response.data.top3;
          let list = response.data.list;
          for (let i = 0; i < top3.length; i++) {
            guardListArr.push(top3[i].uid);
          }
          for (let i = 0; i < list.length; i++) {
            guardListArr.push(list[i].uid);
          }
          if (response.data.info.num == guardListArr.length) {
            $.toast({
              text: '本房间舰长数：' + guardListArr.length, // Text that is to be shown in the toast
              icon: 'success', // Type of toast icon
              showHideTransition: 'fade', // fade, slide or plain
              allowToastClose: true, // Boolean value true or false
              hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
          }
        }
      }
    });
  }

  // 感谢关注
  var latestFollow;
  var latestFollowName;
  var followRepeat = {};

  function fanList() {
    if (!CONFIG.follow) {
      return;
    }
    $.ajax({
      type: 'get',
      url: '//api.bilibili.com/x/relation/followers',
      data: {
        vmid: ruid
      },
      success: function(response) {
        if (latestFollow >= response.data.list[0].mtime) {
          // console.log("没有新的关注");
          return;
        } else {
          if (latestFollow && latestFollow < response.data.list[0].mtime) {
            let newFan = response.data.list[0];
            let newFanName = response.data.list[0].uname;
            if (followRepeat[newFanName] == 1) {
              replyText = newFanName + '由于重复关注被警告了';
              followRepeat[newFanName]++;
            } else if (followRepeat[newFanName] == 2) {
              replyText = newFanName + '由于重复关注了2次被严重警告了';
              followRepeat[newFanName]++;
            } else if (followRepeat[newFanName] == 3) {
              followRepeat[newFanName]++;
              latestFollow = response.data.list[0].mtime;
              latestFollowName = response.data.list[0].uname;
              doBan(newFan);
              return;
            } else if (followRepeat[newFanName] > 3) {
              latestFollow = response.data.list[0].mtime;
              latestFollowName = response.data.list[0].uname;
              console.log('重复关注过多，不搭理这个人');
              return;
            } else {
              for (let i = 0; i < response.data.list.length; i++) {
                if (latestFollow < response.data.list[i].mtime) {
                  if (!followRepeat[response.data.list[i].uname]) {
                    followRepeat[response.data.list[i].uname] = 1;
                  }
                  if (i > 0 && i < 2) {
                    newFanName += '，' + response.data.list[i].uname;
                  }
                  replyText = '感谢' + newFanName + '的关注~';
                } else {
                  if (i >= 3) {
                    replyText =
                      '感谢 ' +
                      response.data.list[0].uname +
                      ' 等' +
                      i +
                      '个小伙伴的关注~';
                  }
                  break;
                }
              }
            }
            latestFollow = response.data.list[0].mtime;
            latestFollowName = response.data.list[0].uname;
            reply(replyText);
            // console.log(timestampToTime(latestFollow), latestFollowName);
          } else {
            latestFollow = response.data.list[0].mtime;
            latestFollowName = response.data.list[0].uname;
          }
          console.log(timestampToTime(latestFollow), latestFollowName);
        }
      }
    });
  }

  // 私信功能
  function sendMsg(receiver, msgContent) {
    $.ajax({
      type: 'post',
      url: 'https://api.vc.bilibili.com/web_im/v1/web_im/send_msg',
      data: {
        msg: {
          sender_uid: myUid,
          receiver_id: receiver,
          receiver_type: 1,
          msg_type: 1,
          content: msgContent
        }
      },
      success: function(response) {
        console.log(response);
        if (response.code === 0) {
          replyText = '私信已发送，请注意查收~';
        } else {
          replyText = '私信失败：' + response.msg;
        }
        reply(replyText, 1);
      }
    });
  }

  // 记录每日0点粉丝数
  function getFollowNum(callback) {
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/AppRoom/index',
      async: false,
      data: {
        platform: 'android',
        room_id: roomLongId
      },
      success: function(response) {
        if (response.data) {
          let foNum = response.data.attention;
          let now = new Date().getTime();
          localStorage.setItem('follower_' + roomLongId, foNum);
          localStorage.setItem('follower_ts_' + roomLongId, now);
          callback(foNum);
        }
      }
    });
  }

  // 获取循环广告内容
  function getDanmu() {
    $('#danmu_arr').empty();
    for (var i = 0; i < danmu.length; i++) {
      $('#danmu_arr').append(
        [i + 1] +
          '、<input style="width: 500px; margin-bottom: 5px;" type="text" index="' +
          [i] +
          '" value="' +
          danmu[i] +
          '" maxlength="30"/> <button class="danmudel" index="' +
          [i] +
          '">删除</button><br />'
      );
    }
    $('.danmudel').click(delDanmu);
    $('#danmu_arr input').blur(function() {
      console.log($(this).attr('value'), $(this).attr('index'), $(this).val());
      let index = $(this).attr('index');
      let val = $(this).val();
      danmu[index] = val;
      localStorage.setItem(
        'auto_ad_danmu_' + roomLongId,
        JSON.stringify(danmu)
      );
    });
  }

  // 添加循环广告内容
  function addDanmu() {
    if (!roomLongId) {
      alert('未连接直播间');
      return false;
    }
    if ($('#danmu_ad').val()) {
      danmu[danmu.length] = $('#danmu_ad').val();
      //		console.log(danmu[danmu.length-1]);
      localStorage.setItem(
        'auto_ad_danmu_' + roomLongId,
        JSON.stringify(danmu)
      );
      getDanmu();
      $('#danmu_ad').val('');
    } else {
      alert('广告内容不能为空！');
    }
  }

  // 删除循环广告
  function delDanmu() {
    let index = $(this).attr('index');
    console.log(index);
    danmu.splice(index, 1);
    localStorage.setItem('auto_ad_danmu_' + roomLongId, JSON.stringify(danmu));
    getDanmu();
  }

  // 弹幕回复
  var replyLast;
  var repeatTimes = 0;
  var waiting = 0;

  function reply(msg, allowRepeat = 0, success, failed) {
    let waitingCD;
    if (msg == replyLast) {
      waitingCD = 5;
      repeatTimes++;
    } else if (msg == 'clock') {
      console.log('广告位置：' + danmu_serial);
      msg = danmu[danmu_serial];
      repeatTimes = 0;
      waitingCD = 1;
    } else {
      repeatTimes = 0;
      waitingCD = 1;
    }
    waiting += waitingCD;
    if (repeatTimes >= 4 || (msg == replyLast && allowRepeat == 0)) {
      console.log('回复被拦截了');
      waiting = 0;
      return;
    }
    if (repeatTimes >= 3) {
      // console.log(replyText);
      msg == '疑似遭遇刷屏打击，中断回复1分钟';
    }
    replyLast = msg;
    let timestamp = new Date().getTime();
    setTimeout(doSend, 1000 * waiting);
    console.log(waiting + '秒后发送：' + msg);
    // 定义弹幕发送
    function doSend() {
      $.ajax({
        type: 'POST',
        url: '//live.bilibili.com/msg/send',
        async: false,
        data: {
          // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
          color: color,
          fontsize: 25,
          mode: 1,
          msg: msg,
          rnd: timestamp,
          roomid: roomLongId
        },
        success: function(response) {
          if (!response.msg) {
            console.log(msg + '——发送成功');
            if (success) {
              success(response);
            }
          } else {
            console.log(msg + '——' + response.msg);
            if (failed) {
              failed(response);
            }
          }
        },
        error: function() {
          console.log(msg + '网络出现问题，发送失败');
        },
        complete: function(response) {
          setTimeout(function() {
            waiting -= waitingCD;
            // console.log(waiting);
            if (!waiting) {
              replyLast = '';
            }
          }, waitingCD * 1e3);
        }
      });
    }
  }

  // 获取关键词自动回复内容
  function getReply() {
    $('#autoreply_arr').empty();
    let getItem = JSON.parse(
      localStorage.getItem('auto_keyword_reply_' + roomLongId)
    );
    try {
      for (let i = 0; i < getItem.length; i++) {
        if (typeof getItem[i].reply == 'string') {
          getItem[i].reply = getItem[i].reply.split('1qaz2wsx');
        }
      }
      localStorage.setItem(
        'auto_keyword_reply_' + roomLongId,
        JSON.stringify(getItem)
      );
    } catch (e) {}
    if (getItem) {
      for (let i = 0; i < getItem.length; i++) {
        let reply = '';
        for (let j = 0; j < getItem[i].reply.length; j++) {
          reply += getItem[i].reply[j];
          if (j != getItem[i].reply.length - 1) {
            reply += '\n';
          }
        }
        $('#autoreply_arr').append(`
            <div>
              <div style="display: inline-block;">
              ${[i + 1]}、关键词：
              <input disabled style="display: inline-block; width: 200px; color: rgb(255, 104, 104); margin-bottom: 5px;"
               type="text" index="${[i]}" value="${getItem[i]
          .keyword}" maxlength="20"/>
              </div>
              <div style="display: inline-block;">
                自动回复：
                <textarea disabled style="resize: none; vertical-align: middle; width: 500px; color: rgb(255, 104, 104); margin-bottom: 5px;"
                index="${[i]}">${reply}</textarea>
                <button class="replydel" index="${[i]}">删除</button>
              </div>
            </div>
        `);
      }
      $('textarea').autoHeightTextarea();
      $('.replydel').click(delReply);
    }
  }

  // 添加自动回复
  function addReply(re) {
    if (!roomLongId) {
      alert('未连接直播间');
      return false;
    }
    let getItem = JSON.parse(
      localStorage.getItem('auto_keyword_reply_' + roomLongId)
    );
    let repeat = 0;
    if ($('#keyword').val() && $('#reply').val()) {
      if (getItem) {
        for (let i = 0; i < getItem.length; i++) {
          if (getItem[i].keyword == $('#keyword').val()) {
            getItem[i].reply.push($('#reply').val());
            repeat = 1;
            break;
          }
        }

        $('#autoreply_arr').empty();
        if (repeat != 0) {
          replyText = '【' + $('#keyword').val() + '】更新成功';
        } else {
          let obj = {};
          obj.keyword = $('#keyword').val();
          obj.reply = [];
          obj.reply.push($('#reply').val());
          getItem[getItem.length] = obj;
          replyText = '【' + $('#keyword').val() + '】设置成功';
        }
        if (re != 0) {
          reply(replyText);
        }
        localStorage.setItem(
          'auto_keyword_reply_' + roomLongId,
          JSON.stringify(getItem)
        );
        getReply();
        $('#keyword').val('');
        $('#reply').val('');
      }
    } else {
      if (re != 0) {
        replyText = '关键词和自动回复不能为空！';
        reply(replyText);
      } else {
        alert('关键词和自动回复不能为空！');
      }
    }
  }

  // 删除自动回复
  function delReply() {
    let index = $(this).attr('index');
    console.log(index);
    keyword_reply.splice(index, 1);
    localStorage.setItem(
      'auto_keyword_reply_' + roomLongId,
      JSON.stringify(keyword_reply)
    );
    getReply();
  }

  // 弹幕控制删除自动回复
  function delReplyByDanmu(res) {
    let getItem = JSON.parse(
      localStorage.getItem('auto_keyword_reply_' + roomLongId)
    );
    if (getItem) {
      let keyword = res.text.split(' ')[1];
      replyText = '【' + keyword + '】未找到';
      for (let i = 0; i < keyword_reply.length; i++) {
        if (getItem[i].keyword == keyword) {
          replyText = '【' + keyword + '】删除成功';
          keyword_reply.splice(i, 1);
          localStorage.setItem(
            'auto_keyword_reply_' + roomLongId,
            JSON.stringify(keyword_reply)
          );
          getReply();
          return false;
        }
      }
    }
  }

  // 增加封禁敏感词
  function addBan(res) {
    if (!roomLongId) {
      alert('未连接直播间');
      return false;
    }
    if (res.text.split(' ')[1]) {
      let getItem = JSON.parse(
        localStorage.getItem('ban_keyword_' + roomLongId)
      );
      //			if(getItem){
      for (let i = 0; i < keyword_ban.length; i++) {
        if (getItem[i] == res.text.split(' ')[1]) {
          replyText = '【' + res.text.split(' ')[1] + '】已存在，不可以重复添加';
          $.toast({
            heading: '添加失败',
            text: '错误原因：不可以添加重复的关键词！',
            hideAfter: 1500,
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            icon: 'error',
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
          return false;
        }
      }
      //				let keyword = res.text.split(" ")[1];
      //				keyword_ban[keyword_ban.length] = keyword;
      //				localStorage.setItem("ban_keyword_" + roomLongId, JSON.stringify(keyword_ban));
      //				replyText = '【' + res.text.split(" ")[1] + '】设置成功';
      //				return;
      //			} else {
      let keyword = res.text.split(' ')[1];
      keyword_ban[keyword_ban.length] = keyword;
      localStorage.setItem(
        'ban_keyword_' + roomLongId,
        JSON.stringify(keyword_ban)
      );
      replyText = '【' + res.text.split(' ')[1] + '】设置成功';
      return;
      //			}
    }
  }

  // 获取封禁敏感词（todo
  function getBan() {
    let getItem = JSON.parse(localStorage.getItem('ban_keyword_' + roomLongId));
  }

  // 删除封禁敏感词（todo
  function delBan() {}

  // 弹幕控制删除封禁敏感词
  function delBanByDanmu(res) {
    let getItem = JSON.parse(localStorage.getItem('ban_keyword_' + roomLongId));
    if (getItem) {
      let keyword = res.text.split(' ')[1];
      replyText = '【' + keyword + '】未找到';
      for (let i = 0; i < keyword_ban.length; i++) {
        if (getItem[i] == keyword) {
          replyText = '【' + keyword + '】删除成功';
          keyword_ban.splice(i, 1);
          localStorage.setItem(
            'ban_keyword_' + roomLongId,
            JSON.stringify(keyword_ban)
          );
          break;
        }
      }
      reply(replyText);
    }
  }

  // 执行自动封禁
  function doBan(res) {
    $.ajax({
      type: 'post',
      url: '//api.live.bilibili.com/liveact/room_block_user',
      data: {
        roomid: roomLongId,
        type: 1,
        content: res.uid || res.mid,
        hour: 720
      },
      success: function(response) {
        if (response.code == 0) {
          console.log('禁言成功');
          if ((res.mid && res.uname) || !banCooldown) {
            replyText =
              (res.name || res.uname) + '[' + response.data.id + '] 触发了封禁规则';
          } else if (banCooldown == 1) {
            banCooldown = 2;
            replyText = '检测到封禁规则被多次触发，关闭封禁提示';
          } else if (banCooldown == 2) {
            console.log('广告封禁模式启动中，回避本次回复');
            return;
          } else {
            console.log('出现了意外的情况');
            return;
          }
        } else {
          replyText = 'Error: ' + response.msg;
          // console.log("操作失败");
        }
        reply(replyText);
      }
    });
  }

  // 执行用户的制裁操作
  function doBanOthers(res, h = 720) {
    let badGuy;
    if (h != parseInt(h)) {
      h = 720;
    }
    try {
      if (
        res.text.split(' ')[1] == '我自己' ||
        res.text.split(' ')[1] == '我' ||
        res.text.split(' ')[1] == '193351' ||
        res.text.split(' ')[1].indexOf('萌萌兽') != -1
      ) {
        badGuy = res.uid;
      } else {
        badGuy = res.text.split(' ')[1];
      }
    } catch (e) {
      badGuy = res;
    }
    // console.log(token);
    $.ajax({
      type: 'post',
      url: '//api.live.bilibili.com/liveact/room_block_user',
      async: false,
      data: {
        roomid: roomLongId,
        type: 1,
        content: badGuy,
        hour: h
      },
      success: function(response) {
        if (res == parseInt(res)) {
          return;
        }
        if (response.code == 0) {
          console.log('禁言成功');
          replyText = response.data.uname + ' 被制裁' + h + '小时 ';
          try {
            if (
              res.text.split(' ')[1] == '193351' ||
              res.text.split(' ')[1].indexOf('萌萌兽') != -1
            ) {
              replyText = '萌萌兽发动了秘技·反弹，' + response.data.uname + '被制裁了';
            }
          } catch (e) {}
        } else {
          replyText = 'Error: ' + response.msg;
          // console.log("操作失败");
        }
        reply(replyText);
      }
    });
  }

  // 查询小黑屋
  function getBlackList(res, pagenum = 1) {
    let match = 0;
    $.ajax({
      type: 'get',
      url: '//api.live.bilibili.com/liveact/ajaxGetBlockList',
      data: {
        roomid: roomLongId,
        page: pagenum
      },
      success: function(response) {
        if (response.code == 0) {
          let blackMember = res.text.split(' ')[1];
          if (response.data.length > 0) {
            for (let i = 0; i < response.data.length; i++) {
              if (
                blackMember == response.data[i].uname ||
                blackMember == response.data[i].uid
              ) {
                match = 1;
                cancelBan(response.data[i].id);
                return;
              }
            }
            if (match != 1) {
              if (pagenum < 5 && response.data.length == 10) {
                getBlackList(res, pagenum++);
                return;
              } else {
                replyText = '用户未找到，越狱失败|･ω･｀)';
              }
            }
          }
        } else {
          replyText = 'Error: ' + response.msg;
          // console.log("操作失败");
        }
        reply(replyText);
      }
    });
  }

  // 用户解禁
  function cancelBan(id) {
    $.ajax({
      type: 'post',
      // (旧)url: '//api.live.bilibili.com/live_user/v1/RoomSilent/del',
      // data: {
      //   uid: uid,
      //   id: id
      // },
      url:
        '//api.live.bilibili.com/banned_service/v1/Silent/del_room_block_user',
      data: {
        id: id,
        roomid: roomLongId
      },
      success: function(response) {
        if (response.code == 0) {
          console.log('解禁成功');
          replyText = '帮助该用户越狱成功|･ω･｀)';
        } else {
          replyText = 'Error: ' + response.msg;
          // console.log("操作失败");
        }
        reply(replyText);
      }
    });
  }

  function roll(res) {
    let roll_range = 100;
    if (res.text.split(' ')[1]) {
      if (res.text.split(' ')[1].length > 6) {
        replyText = '对不起，你太长了，roll点失败';
      } else if (parseInt(res.text.split(' ')[1]) == res.text.split(' ')[1]) {
        roll_range = parseInt(res.text.split(' ')[1]);
        let roll_num = Math.floor(Math.random() * roll_range + 1);
        replyText = res.name + ' roll出了' + roll_num + '点';
      }
    } else {
      let roll_num = Math.floor(Math.random() * roll_range + 1);
      replyText = res.name + ' roll出了' + roll_num + '点';
    }
    replyFailed = res.name + ' roll点失败，请重试';
    reply(replyText, 1, null, function() {
      reply(replyFailed);
    });
  }

  // 只连接弹幕服务器
  function danmakuOnly(res) {
    if (res.cmd === 'SPECIAL_GIFT') {
      var doCatch;
      if (res.storm && res.storm_action == 'start') {
        doCatch = new catchStorm();
        doCatch.check(res.roomid, res.storm_id);
      } else if (res.storm && res.storm_action == 'end') {
        doCatch.destroy();
        doCatch = null;
      }
    } else if (res.cmd === 'DANMU_MSG') {
      let guard = '',
        admin = '',
        medal = '',
        user_level = `<div class="user-level-icon lv-${res.user_level} dp-i-block p-relative v-middle">
                        UL ${res.user_level}
                    </div>`,
        user_name = `<span class="v-middle level-${res.medal_level == 0
          ? 'none'
          : res.medal_level}" title="${res.uid}">
                        <span class="level u-name">
                        ${res.name}
                        </span>
                    </span>`;

      if (res.guard) {
        guard = `<i class="guard-icon dp-i-block v-middle bg-center bg-no-repeat guard-level-${res.guard}"></i>`;
      }
      if (res.admin) {
        admin = `<div class="admin-icon dp-i-block p-relative v-middle" title="这是位大人物 (=・ω・=)"></div>`;
      }
      if (res.medal_level > 0) {
        medal = `<div class="v-middle fans-medal-item level-${res.medal_level ||
          0}">
                        <span class="label">
                            ${res.medal_name}
                        </span>
                        <span class="level">
                            ${res.medal_level}
                        </span>
                    </div>`;
      }
      let ts = new Date().getTime();
      let danmuSender = `<div class="v-middle">
                    ${guard}
                    ${admin}
                    ${medal}
                    ${user_level}
                    ${user_name}
                </div>`,
        danmuContent = `<div class="danmuContent">
                    <span style="color: #${res.color.toString(
                      16
                    )}">${res.text}</span>
                    <button id="repeat${ts}">复读</button>
                    <button id="ban${ts}">封禁</button>
                </div>`;
      $.toast({
        text: danmuContent, // Text that is to be shown in the toast
        heading: danmuSender, // Optional heading to be shown on the toast
        hideAfter: false, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
        textAlign: 'left', // Text alignment i.e. left, right or center
        loader: false, // Whether to show loader or not. True by default
        afterShown: function() {
          $('#repeat' + ts).click(function() {
            reply(res.text);
          });
          $('#ban' + ts).click(function() {
            doBanOthers(res.uid);
          });
        } // will be triggered after the toat has been shown
      });
    }
  }

  // 神秘测试功能
  function catchStorm() {
    this.timer = null;
    this.roomid = null;
    this.stormid = null;
  }

  catchStorm.prototype = {
    check: function(roomid, stormid) {
      var self = this;
      self.roomid = roomid;
      self.stormid = stormid;
      self.timer = setInterval(self.join, 100);
      let clearTime = 20;
      setTimeout(function() {
        console.log('房间' + roomid + ' 一无所获_(:з」∠)_');
        self.destroy();
      }, clearTime * 1e3);
    },
    join: function() {
      var self = this;
      $.ajax({
        type: 'get',
        url: '//api.live.bilibili.com/lottery/v1/Storm/join',
        datatype: 'json',
        data: {
          id: self.stormid,
          color: 8322816,
          roomid: self.roomid
        },
        success: response => {
          try {
            response = JSON.parse(response);
          } catch (e) {}
          if (response.code === 0) {
            console.log('房间' + self.roomid + ' 抢到了！牛逼！_(:з」∠)_');
            self.destroy();
          }
          console.log(response);
        }
      });
    },
    destroy: function() {
      clearInterval(this.timer);
      this.roomid = null;
      this.stormid = null;
    }
  };

  // 连接弹幕服务器并执行的各项功能
  var combo_member = {};
  var arr_location = [];
  var ban_location;
  var block_ignore;
  var lastHitText;
  var repeat_user_level = 20;
  var repeat_user_medal = 5;
  var repeat_whitelist = [];
  var repeat_blacklist = [];
  var coin_type = 'gold';

  function autoReply(res) {
    //		console.log(res.cmd);
    // if (roomId == 164725) {
    //     if (res.cmd === "DANMU_MSG") {
    //         if (
    //             res.text.indexOf("→舰") != -1 ||
    //             res.text.indexOf("→提") != -1 ||
    //             res.text.indexOf("→总") != -1
    //         ) {
    //             let guardId;
    //             let guardRoom = res.text.split(" ")[1].split("→")[0];
    //             if (guardRoom.length < 5) {
    //                 $.ajax({
    //                     type: "get",
    //                     async: false,
    //                     url: "//api.live.bilibili.com/room/v1/Room/room_init",
    //                     data: {
    //                         id: guardRoom,
    //                     },
    //                     success: function (response) {
    //                         if (!response.data) {
    //                             response = JSON.parse(response);
    //                         }
    //                         guardRoom = response.data.room_id;
    //                     },
    //                 });
    //             }
    //             $.ajax({
    //                 type: "get",
    //                 url: "//api.live.bilibili.com/lottery/v1/Lottery/check_guard",
    //                 async: false,
    //                 xhrFields: {
    //                     withCredentials: true,
    //                 },
    //                 data: {
    //                     roomid: guardRoom,
    //                 },
    //                 success: function (response) {
    //                     if (response.data.length > 0) {
    //                         for (let i = 0; i < response.data.length; i++) {
    //                             guardId = response.data[i].id;
    //                             console.log(guardRoom, guardId);
    //                             $.ajax({
    //                                 type: "post",
    //                                 url: "//api.live.bilibili.com/lottery/v2/Lottery/join",
    //                                 async: false,
    //                                 xhrFields: {
    //                                     withCredentials: true,
    //                                 },
    //                                 data: {
    //                                     roomid: guardRoom,
    //                                     id: guardId,
    //                                     type: "guard",
    //                                 },
    //                                 success: function (response) {
    //                                     if (response.code == 0) {
    //                                         console.log(
    //                                             response.data.message
    //                                         );
    //                                     } else {
    //                                         console.log(response.msg);
    //                                     }
    //                                 },
    //                             });
    //                             // }
    //                         }
    //                     } else {
    //                         console.log("已领取或超过有效期");
    //                     }
    //                 },
    //             });
    //             // return;
    //         }
    //     }
    //     // return;
    // } else {
    if (res.cmd === 'SPECIAL_GIFT') {
      try {
        if (res.storm_action == 'start') {
          CONFIG.ban = 0;
          CONFIG.reply = 0;
          setTimeout(function() {
            CONFIG.ban = 1;
            CONFIG.reply = 1;
          }, 20e3);
        } else if (res.storm_action == 'end') {
          CONFIG.ban = 1;
        }
      } catch (e) {
        console.log('然而这并不是storm！');
      }
    } else if (res.cmd === 'GUARD_BUY') {
      // if (!CONFIG.gift) {
      //     return;
      // }
      if (roomId != 164725 && roomId != 3) {
        if (guardListArr.indexOf(res.uid) != -1) {
          replyText = '为老船员 ' + res.username + ' 的续船献上礼炮！';
          reply(replyText);
        } else {
          guardListArr.push(res.uid);
          replyText = '为新' + res.gift_name + ' ' + res.username + ' 的诞生献上礼炮！';
          reply(replyText);
          let msgContent;
          // if (roomId == 631) {
          //   msgContent =
          //     '{"content":"[' +
          //     timestampToTime(new Date() / 1000) +
          //     '] 欢迎来到631海豹大舰队！舰长群：134474668（可加稻叽解锁好友位哟\\n若已加入请无视~"}';
          // } else
          if (roomId == 189) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 感谢大佬登上狐妖的小船船！舰长群：568744231，欢迎来玩♡\\n若已加入请无视~"}';
          } else if (roomId == 223) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 感谢大佬登上可可的小船船！舰长群：88479489，欢迎加入♡\\n若已加入请无视~"}';
          } else if (roomId == 64566) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 跪谢老板٩(๑^o^๑)۶对猫猫的船票支持，解锁欢乐的舰长群（823316645）快来一起玩耍吧٩(๑^o^๑)۶\\n若已加入请无视~"}';
          } else {
            return;
          }
          setTimeout(function() {
            sendMsg(res.uid, msgContent);
          }, 1e3);
        }
        return;
      }
    } else if (res.cmd === 'SEND_GIFT' && roomId != 164725 && roomId != 3) {
      if (coin_type && res.coin_type != coin_type) {
        return;
      }
      // try {
      // console.log(gift_recorder);
      if (gift_recorder[getDate()]) {
        // console.log("oldgift");
      } else {
        gift_recorder[getDate()] = {};
        // console.log("newgift");
      }
      giftRecorder();
      // } catch {
      //     let dateObj = {};
      //     dateObj[getDate()] = {};
      //     localStorage.setItem("gift_" + roomLongId, JSON.stringify(dateObj));
      // }
      function giftRecorder() {
        if (!gift_recorder[getDate()][res.uname]) {
          gift_recorder[getDate()][res.uname] = {};
        }
        let gift_recorder_member = gift_recorder[getDate()][res.uname];
        if (!gift_recorder_member[res.giftName]) {
          gift_recorder_member[res.giftName] = res.num;
        } else {
          gift_recorder_member[res.giftName] += res.num;
        }
        localStorage.setItem(
          'gift_' + roomLongId,
          JSON.stringify(gift_recorder)
        );
      }
      if (!CONFIG.gift) {
        return;
      }

      function thanks() {
        let combo_cooldown = setInterval(function() {
          if (combo_member[res.uname][res.giftName].time > 0) {
            combo_member[res.uname][res.giftName].time--;
            console.log(combo_member[res.uname][res.giftName].time);
          } else if (combo_member[res.uname][res.giftName].time <= 0) {
            replyText =
              '感谢 ' +
              res.uname +
              ' 送出的' +
              res.giftName +
              ' x ' +
              combo_member[res.uname][res.giftName].giftNum;
            reply(replyText, 1);
            clearInterval(combo_cooldown);
            combo_member[res.uname][res.giftName].giftNum = 0;
          }
        }, 1e3);
      }
      // console.log(combo_member);
      if (!combo_member[res.uname]) {
        // 送礼用户未记录
        // console.log("新送礼用户");
        combo_member[res.uname] = {};
        combo_member[res.uname][res.giftName] = {};
        combo_member[res.uname][res.giftName].time = 6;
        combo_member[res.uname][res.giftName].giftNum = res.num;
        thanks();
      } else {
        // 送礼用户已存在
        if (combo_member[res.uname].hasOwnProperty(res.giftName)) {
          // 同类礼物已存在
          if (combo_member[res.uname][res.giftName].giftNum == 0) {
            combo_member[res.uname][res.giftName].time = 6;
            combo_member[res.uname][res.giftName].giftNum += res.num;
            thanks();
          } else {
            combo_member[res.uname][res.giftName].time = 6;
            combo_member[res.uname][res.giftName].giftNum += res.num;
          }
          // console.log(
          //     "同类数量：" +
          //         combo_member[res.uname].giftNum
          // );
        } else {
          // 送出不同类礼物
          combo_member[res.uname][res.giftName] = {};
          combo_member[res.uname][res.giftName].time = 6;
          combo_member[res.uname][res.giftName].giftNum = res.num;
          thanks();
        }
      }
      return;
    } else if (
      res.cmd === 'LIVE' &&
      typeof res.roomid == 'number' &&
      roomId != 164725 &&
      roomId != 3
    ) {
      CONFIG = {
        live_status: 1,
        gift: 1,
        follow: 1,
        ad: 1,
        reply: 1,
        ban: 1
      };
      // if(typeof res.roomid == "number"){
      switch (res.roomid) {
        case 41682:
          replyText = '咕咕咕！那个鸽子她lei了！记得多喝水呀！';
          break;
        case 70270:
          replyText = '检测到一只小公举开启了直播，趁没人一把抱走~';
          break;
        case 24589:
          replyText = '检测到个破可可开启了直播，并发送了一张开播我也不看.jpg~';
          break;
        case 1353641:
          replyText = '检测到滚滚小朋友开启了直播，抱走就对了~';
          break;
        case 64566:
          replyText = '检测到一只帅气的猫幼开启了直播，黑听模式启动~';
          break;
        case 8324350:
          replyText = '滴，暗中观察的萌萌兽侦测到了开播信号，有人比我快吗？';
          CONFIG.follow = 0;
          break;
        default:
          replyText = '滴，暗中观察的萌萌兽侦测到了开播信号，有人比我快吗？';
          break;
      }
      reply(replyText);
      if (window.Notification && Notification.permission !== 'denied') {
        Notification.requestPermission(function(status) {
          var notification = new Notification('真香警告', {
            body:
              timestampToTime(new Date().getTime() / 1000) +
              ' ' +
              uname +
              '啵啵啵了哦！要不要来看看？'
          });
          notification.onclick = function() {
            window.open('https://live.bilibili.com/' + roomId);
          };
        });
      }
      $('#connect').click();
      // }

      return;
    } else if (res.cmd === 'PREPARING') {
      if (roomId != 164725 && roomId != 3) {
        CONFIG = {};
        replyText = '检测到本次直播关闭~进入休眠模式，哦呀思咪~';
        reply(replyText);
      }
      $('#connect').click();
      return;
    } else if (res.cmd === 'ROOM_BLOCK_MSG') {
      var couple_arr = [
        {
          memberA: '133502',
          memberB: '1738519'
        }
      ];
      let block_couple;
      for (let i = 0; i < couple_arr.length; i++) {
        if (
          block_ignore == couple_arr[i].memberA ||
          block_ignore == couple_arr[i].memberB
        ) {
          block_ignore = '';
          console.log('cp已被封禁');
          return;
        }
        if (res.block_uid == couple_arr[i].memberA) {
          block_couple = couple_arr[i].memberB;
        } else if (res.block_uid == couple_arr[i].memberB) {
          block_couple = couple_arr[i].memberA;
        }
        // console.log(res.block_uid, couple_arr[i].memberA, couple_arr[i].memberB);
        if (block_couple) {
          console.log('couple: ' + block_couple);
          block_ignore = block_couple;

          $.ajax({
            type: 'post',
            url: '//api.live.bilibili.com/liveact/room_block_user',
            data: {
              roomid: roomLongId,
              type: 1,
              content: block_couple,
              hour: 720
            },
            success: function(response) {
              if (response.code == 0) {
                console.log('禁言成功');
                replyText = '封禁用户存在CP，同步封禁CP用户-w-';
              } else {
                replyText = 'Error: ' + response.msg;
                block_ignore = '';
                // console.log("cp已被封禁");
              }
              reply(replyText, 1);
            }
          });
          break;
        }
      }
    } else if (res.cmd === 'DANMU_MSG') {
      let guard = '',
        admin = '',
        medal = '',
        user_level = `<div class="user-level-icon lv-${res.user_level} dp-i-block p-relative v-middle">
                        UL ${res.user_level}
                    </div>`,
        user_name = `<span class="v-middle level-${res.medal_level == 0
          ? 'none'
          : res.medal_level}" title="${res.uid}">
                        <span class="level u-name">
                        ${res.name}
                        </span>
                    </span>`;

      if (res.guard) {
        guard = `<i class="guard-icon dp-i-block v-middle bg-center bg-no-repeat guard-level-${res.guard}"></i>`;
      }
      if (res.admin) {
        admin = `<div class="admin-icon dp-i-block p-relative v-middle" title="这是位大人物 (=・ω・=)"></div>`;
      }
      if (res.medal_level > 0) {
        // console.log(res.medal_level);
        medal = `<div class="v-middle fans-medal-item level-${res.medal_level ||
          0}">
                        <span class="label">
                            ${res.medal_name}
                        </span>
                        <span class="level">
                            ${res.medal_level}
                        </span>
                    </div>`;
      }
      let ts = new Date().getTime();
      let danmuSender = `<div class="v-middle">
                    ${guard}
                    ${admin}
                    ${medal}
                    ${user_level}
                    ${user_name}
                </div>`,
        danmuContent = `<div class="danmuContent">
                    <span style="color: #${res.color.toString(
                      16
                    )}">${res.text}</span>
                    <button id="repeat${ts}">复读</button>
                    <button id="ban${ts}">封禁</button>
                </div>`;
      $.toast({
        text: danmuContent, // Text that is to be shown in the toast
        heading: danmuSender, // Optional heading to be shown on the toast
        hideAfter: false, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
        position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
        textAlign: 'left', // Text alignment i.e. left, right or center
        loader: false, // Whether to show loader or not. True by default
        afterShown: function() {
          $('#repeat' + ts).click(function() {
            reply(res.text);
          });
          $('#ban' + ts).click(function() {
            doBanOthers(res.uid);
          });
        } // will be triggered after the toat has been shown
      });
      let blacklist = localStorage.getItem('blacklist') || [];
      if (blacklist.length !== 0 && blacklist.indexOf(res.uid) != -1) {
        // replyText = '你已经被拉黑了，懒得搭理你_(:з」∠)_';
        // reply(replyText, 1);
        return;
      }
      if (res.text.split(' ')[0] == '#启用') {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          if (res.text.split(' ')[1] == '感谢礼物') {
            CONFIG.gift = 1;
            coin_type = 'gold';
            replyText = '感谢礼物 已启用';
            if (res.text.split(' ')[2] == 'all') {
              coin_type = null;
              replyText = '感谢所有礼物 已启用';
            }
          } else if (res.text.split(' ')[1] == '感谢关注') {
            CONFIG.follow = 1;
            replyText = '感谢关注 已启用';
          } else if (res.text.split(' ')[1] == '广告') {
            CONFIG.ad = 1;
            replyText = '广告 已启用';
          } else if (res.text.split(' ')[1] == '回复') {
            CONFIG.reply = 1;
            replyText = '回复 已启用';
          } else if (res.text.split(' ')[1] == '封禁') {
            CONFIG.ban = 1;
            replyText = '封禁 已启用';
          } else if (res.text.split(' ')[1] == '复读机') {
            CONFIG.repeat = 1;
            replyText = '复读机 已启用';
          } else if (res.text.split(' ')[1] == '全员复读') {
            CONFIG.repeat = 2;
            replyText = '全员复读 已启用';
          } else {
            replyText = '指令未能识别';
            console.log('指令未能识别');
          }
        } else {
          replyText = '指令未授权，懒得搭理你';
        }

        reply(replyText, 1);
        return;
      } else if (res.text.split(' ')[0] == '#禁用') {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          if (res.text.split(' ')[1] == '感谢礼物') {
            CONFIG.gift = 0;
            replyText = '感谢礼物 已禁用';
          } else if (res.text.split(' ')[1] == '感谢关注') {
            CONFIG.follow = 0;
            replyText = '感谢关注 已禁用';
          } else if (res.text.split(' ')[1] == '广告') {
            CONFIG.ad = 0;
            replyText = '广告 已禁用';
          } else if (res.text.split(' ')[1] == '回复') {
            CONFIG.reply = 0;
            replyText = '回复 已禁用';
          } else if (res.text.split(' ')[1] == '封禁') {
            CONFIG.ban = 0;
            replyText = '封禁 已禁用';
          } else if (res.text.split(' ')[1] == '复读机') {
            CONFIG.repeat = 0;
            replyText = '复读机 已禁用';
          } else if (res.text.split(' ')[1] == '全员复读') {
            CONFIG.repeat = 0;
            replyText = '全员复读 已禁用';
          } else {
            replyText = '指令未能识别';
            console.log('指令未能识别');
          }
        } else {
          replyText = '指令未授权，懒得搭理你';
        }

        reply(replyText, 1);
        return;
      }

      if (res.text == '#全部启用') {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          CONFIG = {
            gift: 1,
            follow: 1,
            ad: 1,
            reply: 1,
            ban: 1
          };
          replyText = '好的，我活了，又要开始工作了呢( ˘•ω•˘ )';
        } else {
          replyText = '被窝好暖和，就算你叫我也不想起来_(:з」∠)_';
        }
        reply(replyText, 1);
        return;
      }

      if (res.text == '#全部禁用' || res.text == '#关机') {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          CONFIG = {};
          replyText = '啊我死了，下个ID见_(:з」∠)_';
        } else {
          replyText = '想关掉我？没这么简单_(:з」∠)_';
        }
        reply(replyText, 1);
        return;
      }

      if (res.text.split(' ')[0] == '#重启') {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          if (res.text.split(' ')[1] == 'full') {
            $('#connect').click();
            replyText = 'FullPower模式重启中|･ω･｀)';
          } else if (res.text.split(' ')[1] == 'danmakuOnly') {
            $('#danmaku_only_connect').click();
            replyText = 'DanmakuOnly模式重启中|･ω･｀)';
          } else {
            replyText = '你要重启个什么鬼哦，不太懂呢|･ω･｀)';
          }
        } else {
          replyText = '要重启我？你想得美_(:з」∠)_';
        }
        reply(replyText, 1);
        return;
      }

      if (
        res.text.split(' ')[0] == '#拉黑' &&
        (res.uid == 193351 || res.uid == 64131034)
      ) {
        $.ajax({
          type: 'post',
          url: '//space.bilibili.com/ajax/member/GetInfo',
          data: {
            mid: res.text.split(' ')[1]
          },
          success: function(response) {
            if (blacklist.indexOf(res.text.split(' ')[1]) != -1) {
              replyText = response.data.name + ' 已经存在于黑名单中了|･ω･｀)';
              reply(replyText, 1);
            } else {
              blacklist.push(res.text.split(' ')[1]);
              localStorage.setItem('blacklist', blacklist);
              replyText = response.data.name + ' 已被拉黑|･ω･｀)';
              reply(replyText, 1);
            }
          }
        });
        return;
      }

      if (
        ((res.text.indexOf('萌萌兽') != -1 &&
          (res.text.indexOf('在吗') != -1 ||
            res.text.indexOf('呢') != -1 ||
            res.text.indexOf('召唤') != -1)) ||
          (res.text.indexOf('房管') != -1 &&
            (res.text.indexOf('在吗') != -1 ||
              res.text.indexOf('呢') != -1 ||
              res.text.indexOf('召唤') != -1 ||
              res.text.indexOf('干活') != -1))) &&
        res.uid != 64131034 &&
        res.uid != 193351 &&
        (res.medal_name == medalName ||
          res.user_level >= 20 ||
          res.guard != 0 ||
          res.admin == 1)
      ) {
        replyText = '召唤中……请等待响应( ˘•ω•˘ )';
        reply(replyText);
        if (window.Notification && Notification.permission !== 'denied') {
          Notification.requestPermission(function(status) {
            let isClick;
            var notification = new Notification('受到召唤', {
              body:
                timestampToTime(new Date().getTime() / 1000) +
                ' ' +
                uname +
                '的直播间发起了一个召唤'
            });
            notification.onclick = function() {
              isClick = 1;
              replyText = res.name + '以为萌萌兽不在？太天真了！';
              reply(replyText);
              // window.open(
              //     "https://live.bilibili.com/" + roomId
              // );
            };
            setTimeout(function() {
              if (!isClick) {
                replyText = '好的吧，萌萌兽真的不在，你召唤也没用';
                reply(replyText);
              }
            }, 8e3);
          });
        }
        return;
      }

      if (res.text.indexOf('萌萌兽') != -1 && res.text.indexOf('勋章') != -1) {
        // 切换勋章
        replyText = '_(:з」∠)_勋章是什么？人家不知道呀';
        reply(replyText);
        return;
      }

      if (res.text.indexOf('#指令查询') === 0) {
        if (res.guard != 0 || res.admin == 1 || res.medal_name == medalName) {
          let msgContent = `{"content":"[ ${timestampToTime(
            new Date() / 1000
          )} ]\\n
                                【下面所有标点都是英文的，注意空格，括号内是说明不是指令】\\n
                                叫管理过来：召唤萌萌兽\\n
                                弹幕换色：#变红|#变蓝|#变黄|#变绿\\n
                                roll点测欧气：#roll\\n
                                查涨粉：#查询粉丝数\\n
                                自动回复：#萌回 关键词&自动回复内容\\n
                                删除自动回复：#删回 关键词\\n
                                禁言用户：#制裁 uid或昵称\\n
                                解禁用户：#越狱 uid或昵称\\n
                                【下面大概是房管功能】\\n
                                添加自动禁言敏感词：#ban 关键词\\n
                                删除自动禁言敏感词：#删禁 关键词\\n
                                启用功能：#启用 感谢礼物|感谢关注|回复|广告|封禁|复读机|全员复读 （一次只能选一次）\\n
                                禁用功能：#禁用 同上\\n
                                开关除复读以外所有功能：#全部启用|#全部禁用"}`;
          sendMsg(res.uid, msgContent);
        } else {
          replyText = '萌萌兽眉头一皱，发现事情并不简单，你没有权限查询！';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.split(' ')[0] == '#复读' && res.text.length > 3) {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          if (res.text.indexOf('等级') != -1 || res.text.indexOf('勋章') != -1) {
            CONFIG.repeat = 1;
            for (let i = 0; i < res.text.split(' ').length; i++) {
              if (res.text.split(' ')[i].indexOf('等级') != -1) {
                if (
                  res.text.split(' ')[i].split('等级')[1] >= 1 &&
                  res.text.split(' ')[i].split('等级')[1] <= 60
                ) {
                  repeat_user_level = res.text.split(' ')[i].split('等级')[1];
                }
              } else if (res.text.split(' ')[i].indexOf('勋章') != -1) {
                if (
                  res.text.split(' ')[i].split('勋章')[1] >= 1 &&
                  res.text.split(' ')[i].split('勋章')[1] <= 20
                ) {
                  repeat_user_medal = res.text.split(' ')[i].split('勋章')[1];
                }
              }
            }
            replyText =
              '复读等级' +
              repeat_user_level +
              ' 勋章' +
              repeat_user_medal +
              ' 已启用|･ω･｀)';
            reply(replyText, 1);
          } else if (res.text.split(' ')[1].indexOf('关闭') != -1) {
            CONFIG.repeat = 0;
            replyText = '复读已关闭|･ω･｀)';
            reply(replyText, 1);
          }
          if (parseInt(res.text.split(' ')[1]) == res.text.split(' ')[1]) {
            $.ajax({
              type: 'post',
              url: '//space.bilibili.com/ajax/member/GetInfo',
              data: {
                mid: res.text.split(' ')[1]
              },
              success: function(response) {
                if (
                  repeat_whitelist.indexOf(parseInt(res.text.split(' ')[1])) !=
                  -1
                ) {
                  replyText = response.data.name + ' 已经存在于复读白名单中|･ω･｀)';
                  reply(replyText, 1);
                } else {
                  repeat_whitelist.push(parseInt(res.text.split(' ')[1]));
                  replyText = response.data.name + ' 现已加入复读白名单|･ω･｀)';
                  reply(replyText, 1);
                }
              }
            });
            if (
              repeat_blacklist.indexOf(parseInt(res.text.split(' ')[1])) != -1
            ) {
              repeat_blacklist.splice(
                repeat_blacklist.indexOf(parseInt(res.text.split(' ')[1])),
                1
              );
            }
          }
        } else {
          replyText = '指令未授权，懒得搭理你';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#复读我') === 0) {
        if (repeat_whitelist.indexOf(res.uid) != -1) {
          replyText = res.name + ' 已经存在于复读白名单中|･ω･｀)';
          reply(replyText, 1);
        } else {
          repeat_whitelist.push(res.uid);
          replyText = res.name + ' 现已加入复读白名单|･ω･｀)';
          reply(replyText, 1);
        }
        if (repeat_blacklist.indexOf(res.uid) != -1) {
          repeat_blacklist.splice(repeat_blacklist.indexOf(res.uid), 1);
        }
        return;
      }

      if (res.text.indexOf('#不复读我') === 0 || res.text.indexOf('#别复读我') === 0) {
        if (repeat_whitelist.indexOf(res.uid) != -1) {
          repeat_whitelist.splice(repeat_whitelist.indexOf(res.uid), 1);
        }
        if (repeat_blacklist.indexOf(res.uid) != -1) {
          replyText = res.name + ' 已经存在于复读黑名单中|･ω･｀)';
          reply(replyText, 1);
        } else {
          repeat_blacklist.push(res.uid);
          replyText = res.name + ' 现已加入复读黑名单|･ω･｀)';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#不复读') === 0 || res.text.indexOf('#别复读') === 0) {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          if (parseInt(res.text.split(' ')[1]) == res.text.split(' ')[1]) {
            $.ajax({
              type: 'post',
              url: '//space.bilibili.com/ajax/member/GetInfo',
              data: {
                mid: res.text.split(' ')[1]
              },
              success: function(response) {
                if (
                  repeat_blacklist.indexOf(parseInt(res.text.split(' ')[1])) !=
                  -1
                ) {
                  replyText = response.data.name + ' 已经存在于复读黑名单中|･ω･｀)';
                  reply(replyText, 1);
                } else {
                  repeat_blacklist.push(parseInt(res.text.split(' ')[1]));
                  replyText = response.data.name + ' 现已加入复读黑名单|･ω･｀)';
                  reply(replyText, 1);
                }
              }
            });
            if (repeat_whitelist.indexOf(res.uid) != -1) {
              repeat_whitelist.splice(
                repeat_whitelist.indexOf(parseInt(res.text.split(' ')[1])),
                1
              );
            }
          }
        } else {
          replyText = '指令未授权，懒得搭理你';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#roll') === 0) {
        if (
          res.guard != 0 ||
          res.admin == 1 ||
          res.uid == 193351 ||
          res.uid == 64131034 ||
          res.medal_level >= 5 ||
          res.user_level >= 20
        ) {
          roll(res);
        }
        return;
      }

      if (res.text.indexOf('#高阶魔法') === 0) {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          let minute = 3,
            type = 'level',
            level = 1;
          for (let i = 0; i < res.text.split(' ').length; i++) {
            if (res.text.split(' ')[i].indexOf('分') != -1) {
              if (res.text.split(' ')[i].split('分')[0] == 0) {
                minute = 0;
              } else if (res.text.split(' ')[i].split('分')[0] <= 3) {
                minute = 3;
              } else if (res.text.split(' ')[i].split('分')[0] <= 10) {
                minute = 10;
              } else if (res.text.split(' ')[i].split('分')[0] <= 30) {
                minute = 30;
              } else {
                minute = 0;
              }
            }
            if (res.text.split(' ')[i].indexOf('等级') != -1) {
              type = 'level';
              if (
                res.text.split(' ')[i].split('等级')[1] >= 1 &&
                res.text.split(' ')[i].split('等级')[1] <= 60
              ) {
                level = res.text.split(' ')[i].split('等级')[1];
              } else {
                level = 1;
              }
            } else if (res.text.split(' ')[i].indexOf('勋章') != -1) {
              type = 'medal';
              if (
                res.text.split(' ')[i].split('勋章')[1] >= 1 &&
                res.text.split(' ')[i].split('勋章')[1] <= 20
              ) {
                level = res.text.split(' ')[i].split('勋章')[1];
              } else {
                level = 1;
              }
            } else if (res.text.split(' ')[i].indexOf('全员') != -1) {
              type = 'member';
              level = 1;
            }
          }
          if (res.text.indexOf('解除') != -1) {
            minute = 3;
            type = 'off';
            level = 1;
          }
          // 启动范围魔法
          $.ajax({
            type: 'post',
            url: '//api.live.bilibili.com/liveact/room_silent',
            data: {
              minute: minute,
              room_id: roomLongId,
              type: type,
              level: level
            },
            success: function(response) {
              if (response.msg) {
                replyText = '高阶魔法启动失败，' + response.msg;
              } else {
                if (type == 'off') {
                  replyText = '高阶魔法已解除(=・ω・=)';
                } else {
                  replyText = '成功启动高阶范围魔法打击！' + minute + '分钟后解除';
                }
              }
              reply(replyText);
            }
          });
        } else {
          replyText = '指令未授权，懒得搭理你';
          reply(replyText, 1);
        }
        return;
      }

      if (
        res.text.indexOf('#记录粉丝数') === 0 &&
        (res.uid == 193351 || res.uid == 64131034)
      ) {
        let callback = function(followers) {
          replyText = '当前粉丝数为' + followers + '，已记录';
          reply(replyText);
        };
        getFollowNum(callback);
      }

      if (res.text.indexOf('#查询粉丝数') === 0) {
        if (
          roomId != 8324350 &&
          (res.uid == 193351 || res.uid == 64131034 || res.admin == 1)
        ) {
          $.ajax({
            type: 'get',
            url: '//api.live.bilibili.com/AppRoom/index',
            async: false,
            data: {
              platform: 'android',
              room_id: roomLongId
            },
            success: function(response) {
              if (response.data) {
                let foNum = response.data.attention;
                let foIncrease = '';
                let onlineNum = '，实时人气' + response.data.online;
                let today = new Date().setHours(0, 0, 0, 0);
                let recordTime = localStorage.getItem(
                  'follower_ts_' + roomLongId
                );

                if (recordTime >= today) {
                  // 记录时间是今天
                  let foToday = localStorage.getItem('follower_' + roomLongId);
                  if (foNum >= foToday) {
                    foIncrease = '(' + (foNum - foToday) + '↑)';
                  } else {
                    foIncrease = '(' + (foToday - foNum) + '↓)';
                  }
                } else {
                  foIncrease = '，今日粉丝数据未记录';
                }
                if (response.data.status != 'LIVE') {
                  onlineNum = '，未开播';
                }
                replyText = '当前粉丝数' + foNum + foIncrease + onlineNum;
                reply(replyText, 1);
              }
            }
          });
        } else {
          replyText = '指令未授权，懒得搭理你';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#舰长群') === 0) {
        if (res.guard != 0 || res.admin == 1) {
          let msgContent;
          if (roomId == 631) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 欢迎来到631海豹大舰队！舰长群：134474668（可加稻叽解锁好友位哟"}';
          } else if (roomId == 189) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 感谢大佬登上狐妖的小船船！舰长群：568744231，欢迎来玩♡"}';
          } else if (roomId == 223) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 感谢大佬登上可可的小船船！舰长群：88479489，欢迎加入♡"}';
          } else if (roomId == 64566) {
            msgContent =
              '{"content":"[' +
              timestampToTime(new Date() / 1000) +
              '] 跪谢老板٩(๑^o^๑)۶对猫猫的船票支持，解锁欢乐的舰长群（823316645）快来一起玩耍吧٩(๑^o^๑)۶"}';
          } else {
            return;
          }
          sendMsg(res.uid, msgContent);
        } else {
          replyText = '萌萌兽眉头一皱，发现事情并不简单，你根本没有上船！';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#真爱群') === 0) {
        let msgContent;
        if (roomId == 189 && res.medal_name == '狐宝' && res.medal_level >= 13) {
          msgContent =
            '{"content":"[' +
            timestampToTime(new Date() / 1000) +
            '] 感谢大佬一直以来对狐妖的支持！狐妖的真爱宝宝633202159，欢迎加入♡"}';
        } else if (
          roomId == 223 &&
          res.medal_name == '可可味' &&
          res.medal_level >= 5
        ) {
          msgContent =
            '{"content":"[' +
            timestampToTime(new Date() / 1000) +
            '] 感谢大佬一直以来对可可的支持！可可的真爱群727774262，验证请填写：萌萌兽机器人，欢迎加入♡"}';
        } else {
          replyText = '萌萌兽眉头一皱，发现事情并不简单，你根本不是真爱！';
          reply(replyText, 1);
          return;
        }
        sendMsg(res.uid, msgContent);
        return;
      }

      if (res.text.indexOf('#萌回') === 0 && res.text.indexOf('&') != -1) {
        // 添加
        if (
          (roomId == 631 &&
            res.medal_name == '稻叽' &&
            (res.medal_level >= 10 || res.guard != 0)) ||
          (roomId == 189 &&
            res.medal_name == '狐宝' &&
            (res.medal_level >= 10 || res.guard != 0)) ||
          res.admin == 1 ||
          res.uid == 193351 ||
          res.uid == 64131034
        ) {
          let keyword = res.text.slice(4, res.text.indexOf('&'));
          let replyContent = res.text.slice(res.text.indexOf('&') + 1);
          $('#keyword').val(keyword);
          $('#reply').val(replyContent);
          setTimeout(function() {
            addReply(1);
          }, 100);
        } else {
          replyText = '_(:з」∠)_权限不足，设置失败';
          reply(replyText, 1);
        }
        return;
      }
      if (res.text.indexOf('#删回') === 0 && res.text.length > 4) {
        // 删除自动回复
        if (
          (roomId == 631 &&
            res.medal_name == '稻叽' &&
            (res.medal_level >= 10 || res.guard != 0)) ||
          (roomId == 189 &&
            res.medal_name == '狐宝' &&
            (res.medal_level >= 10 || res.guard != 0)) ||
          res.admin == 1 ||
          res.uid == 193351 ||
          res.uid == 64131034
        ) {
          delReplyByDanmu(res);
        } else {
          replyText = '_(:з」∠)_权限不足，删除失败';
        }
        reply(replyText, 1);
        return;
      }

      if (res.text.indexOf('#ban') === 0 && res.text.length > 5) {
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          addBan(res);
        } else {
          replyText = '_(:з」∠)_权限不足，设置失败';
        }
        reply(replyText, 1);
        return;
      }

      if (res.text.indexOf('#删禁') === 0 && res.text.length > 4) {
        // 删除自动回复
        if (res.admin == 1 || res.uid == 193351 || res.uid == 64131034) {
          delBanByDanmu(res);
        } else {
          replyText = '_(:з」∠)_权限不足，删除失败';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#制裁') === 0 && res.text.length > 4) {
        if (
          res.text.split(' ')[1] == '193351' ||
          res.text.split(' ')[1].indexOf('萌萌兽') != -1
        ) {
          if (res.admin == 1) {
            replyText = '你居然想制裁萌萌兽？不跟你玩了，哼(๑•́ ₃ •̀๑)';
            reply(replyText);
          } else {
            let hour = res.text.split(' ')[2] || 1;
            doBanOthers(res, hour);
          }
        } else if (
          (roomId == 631 && res.medal_name == '稻叽' && res.medal_level >= 17) ||
          (roomId == 189 && res.medal_name == '狐宝' && res.medal_level >= 17) ||
          res.admin == 1 ||
          res.guard != 0 ||
          res.uid == 193351 ||
          res.uid == 64131034 ||
          res.text.split(' ')[1] == '我自己' ||
          res.text.split(' ')[1] == '我'
        ) {
          let hour = res.text.split(' ')[2] || 720;
          doBanOthers(res, hour);
        } else {
          replyText = '_(:з」∠)_权限不足，制裁失败';
          reply(replyText, 1);
        }
        return;
      }

      if (res.text.indexOf('#越狱') === 0 && res.text.length > 4) {
        if (
          ((roomId == 631 || roomId == 189) &&
            res.medal_name == medalName &&
            (res.medal_level >= 17 || res.guard != 0)) ||
          res.admin == 1 ||
          res.uid == 193351 ||
          res.uid == 64131034
        ) {
          getBlackList(res);
        } else {
          replyText = '_(:з」∠)_权限不足，越狱失败';
          reply(replyText, 1);
        }
        return;
      }

      //		console.log(res.text, keyword_reply[0].keyword);
      if (
        res.text.indexOf('点歌') != -1 &&
        (roomId == 631 || roomId == 64566) &&
        res.uid != 64131034
      ) {
        if (res.medal_name == medalName) {
          if (
            res.text.split(' ')[0] == '点歌' ||
            res.text.split(' ')[0] == '#点歌'
          ) {
            replyText = '滴~点歌格式正确！上车成功~';
          } else {
            replyText = '你刚刚好像说了点歌？但是姿势好像不太对呢，要不再试试？';
          }
          reply(replyText, 1);
        } else {
          replyText = '你是不是想点歌？只有戴上主播勋章才能点歌成功哟~';
          reply(replyText);
        }
        return;
      }

      if (res.text.indexOf('#变') === 0) {
        let colorhex;
        switch (res.text) {
          case '#变红':
            colorhex = '0xff6868';
            break;
          case '#变蓝':
            colorhex = '0x66ccff';
            break;
          case '#变黄':
            colorhex = '0xffed4f';
            break;
          case '#变绿':
            colorhex = '0x7eff00';
            break;
          case '#变橙':
            colorhex = '0xff9800';
            break;
          case '#变紫':
            colorhex = '0xe33fff';
            break;
          case '#变白':
            colorhex = '0xffffff';
            break;
          default:
            return;
        }
        $.ajax({
          type: 'POST',
          url: '//api.live.bilibili.com/api/ajaxSetConfig',
          data: {
            // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
            csrf: token,
            room_id: roomLongId,
            color: colorhex
          },
          success: function(response) {
            if (response.code === 0) {
              replyText = `啊！我${res.text.charAt(2)}了( ˘•ω•˘ )`;
            } else {
              replyText = `啊！我没${res.text.charAt(2)}(๑•́ ₃ •̀๑)`;
            }
            reply(replyText);
          }
        });
      }

      for (let i = 0; i < keyword_ban.length; i++) {
        if (!CONFIG.ban) {
          break;
        }
        if (res.text.indexOf(keyword_ban[i]) != -1 && res.uid != 64131034) {
          if (res.user_level == 0 && res.medal_level == 0) {
            if (res.text == lastHitText) {
              // 启动范围魔法
              $.ajax({
                type: 'post',
                url: '//api.live.bilibili.com/liveact/room_silent',
                data: {
                  minute: 3,
                  room_id: roomLongId,
                  type: 'level',
                  level: 1
                },
                success: function(response) {
                  if (response.msg) {
                    console.log('魔法启动失败，' + response.msg);
                  } else {
                    replyText = '检测到疑似不良信息，启动高阶范围魔法打击！3分钟后解除';
                    reply(replyText);
                  }
                }
              });
            } else {
              lastHitText = res.text;
              console.log('命中了封禁敏感词，若再次触发则开启高阶魔法！');
            }

            // if (ban_location == i) {
            //     if (banCooldown == 0) {
            //         banCooldown = 1;
            //         console.log(
            //             "检测到封禁规则被多次触发，关闭封禁提示"
            //         );
            //     }
            //     doBan(res);
            // } else {
            //     banCooldown = 0;
            //     ban_location = i;
            //     console.log("自动封禁位置：" + ban_location);
            //     doBan(res);
            // }
          } else {
            console.log('命中了封禁敏感词，但用户等级不为0，等待人工处理');
          }
          return;
        }
      }

      // console.log(
      //     CONFIG.repeat,
      //     res.medal_name,
      //     medalName,
      //     res.uid,
      //     myUid
      // );
      // console.log(res.uid, myUid);
      // console.log(repeat_blacklist.indexOf(res.uid));
      // console.log(repeat_whitelist.indexOf(res.uid));
      // console.log(CONFIG.repeat);
      // 复读机
      if (res.uid != myUid && repeat_blacklist.indexOf(res.uid) == -1) {
        if (repeat_whitelist.indexOf(res.uid) != -1 || CONFIG.repeat == 2) {
          let repeatText = res.text;
          reply(repeatText);
          return;
        } else if (
          CONFIG.repeat == 1 &&
          (res.medal_level >= repeat_user_medal ||
            res.user_level >= repeat_user_level)
        ) {
          let repeatText = res.text;
          reply(repeatText);
          return;
        }
      }

      for (let i = 0; i < keyword_reply.length; i++) {
        if (!CONFIG.reply) {
          break;
        }
        if (
          res.text.indexOf(keyword_reply[i].keyword) != -1 &&
          res.uid != 64131034
        ) {
          let r = Math.floor(Math.random() * keyword_reply[i].reply.length);
          if (arr_location.toString() === [i, r].toString()) {
            console.log('自动回复内容相同，回避本次回复');
            return;
          }
          arr_location = [i, r];
          replyText = keyword_reply[i].reply[r];
          reply(replyText);
          clearTimeout(replyCD);
          replyCD = setTimeout(function() {
            arr_location = [];
          }, 5e3);
          console.log('自动回复位置：' + arr_location);
          return;
        }
      }
    }
    // }
  }

  // function clock() {
  //     // 获取时间戳
  //     var now = new Date(),
  //         timestamp = now.getTime();
  //     // 定义弹幕发送
  //     $.ajax({
  //         type: "POST",
  //         url: "//live.bilibili.com/msg/send",
  //         data: {
  //             // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
  //             color: color,
  //             fontsize: 25,
  //             mode: 1,
  //             msg: danmu[danmu_serial],
  //             rnd: timestamp,
  //             roomid: roomLongId,
  //         },
  //         success: function (response) {
  //             if (!response.msg) {
  //                 console.log(danmu[danmu_serial] + "——发送成功");
  //             } else {
  //                 console.log(danmu[danmu_serial] + "——" + response.msg);
  //             }
  //             // if (danmu_serial === 0) {
  //             //     $("p").remove();
  //             // }
  //             // var danmuok = $("<p></p>").html(
  //             //     '<span style="color: #00BE00; margin-left: 10px;">【发送成功】</span>' +
  //             //     danmu[danmu_serial]
  //             // ); // 以 jQuery 创建新元素
  //             // $("#log").append(danmuok); // 追加新元素
  //             danmu_serial == danmu.length - 1 ?
  //                 (danmu_serial = 0) :
  //                 danmu_serial++;
  //         },
  //         error: function () {
  //             console.log("网络出现问题，发送失败");
  //             // if (danmu_serial === 0) {
  //             //     $("p").remove();
  //             // }
  //             // var danmufail = $("<p></p>").html(
  //             //     '<span style="color: #EB3941; margin-left: 10px;">【发送失败】</span>' +
  //             //     danmu[danmu_serial]
  //             // ); // 以 jQuery 创建新元素
  //             // $("#log").append(danmufail); // 追加新元素
  //             danmu_serial == danmu.length - 1 ?
  //                 (danmu_serial = 0) :
  //                 danmu_serial++;
  //         },
  //     });
  // }

  // 获取日期
  function getDate() {
    var date = new Date(); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '';
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '';
    return Y + M + D;
  }

  // 转换时间戳
  function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var s =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }

  // 定义定时器以及开关函数
  var send;

  // 循环广告开关
  function start() {
    clearInterval(send); // 消除定时器的叠加
    console.log('发送间隔：' + intervalTime);
    // 循环广告
    let adSend = function() {
      if (CONFIG.live_status && CONFIG.ad) {
        $('#switch').html(
          '<span style="color: #00BE00; margin-left: 10px;">定时轰炸系统已启用，指挥中心工作中_(¦3」∠)_</span>'
        );
        myMedal('clock', 0, function() {
          danmu_serial == danmu.length - 1
            ? (danmu_serial = 0)
            : danmu_serial++;
        });
      } else {
        $('#switch').html(
          '<span style="color: #FF9800; margin-left: 10px;">定时轰炸系统被拦截，或指挥中心正在休眠_(¦3」∠)_</span>'
        );
      }
      return adSend;
    };
    send = setInterval(adSend(), intervalTime * 1e3); // 自动发送间隔，1秒=1000
  }

  // 关闭循环广告
  function clear() {
    clearInterval(send);
    danmu_serial = 0;
    $('#switch').html(
      '<span style="color: #EB3941; margin-left: 10px;">弹幕发射已关闭_(¦3」∠)_</span>'
    );
  }

  // 设定发送间隔和弹幕颜色
  function set_time() {
    intervalTime = document.getElementById('intervalTime').value;
    $('#setTime').html(
      '<span style="color: #00BE00;">发射间隔已设置为' + intervalTime + '秒</span>'
    );
    if (send) {
      start();
    }
  }

  // 设置弹幕颜色
  function set_color(e) {
    var _this = $(this);
    color = $(this).attr('color');
    let colorhex = '0x' + Number(color).toString(16);
    //			console.log($(this)[0].outerHTML);
    $.ajax({
      type: 'POST',
      url: '//api.live.bilibili.com/api/ajaxSetConfig',
      data: {
        // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
        csrf: token,
        room_id: roomLongId,
        color: colorhex
      },
      success: function(response) {
        if (response.code === 0) {
          $('#setColor').html(
            '<span style="color: #00BE00;">弹幕颜色已设置为 ' +
              _this[0].outerHTML +
              '</span>'
          );
          $.toast({
            heading: '弹幕颜色设置成功',
            icon: 'success',
            hideAfter: 1500,
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
        } else {
          $.toast({
            heading: '弹幕颜色设置失败',
            text: '原因：' + response.msg,
            hideAfter: 1500,
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            icon: 'error',
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
        }
      },
      error: function() {
        $.toast({
          heading: '设置失败',
          text: '网络错误',
          hideAfter: 1500,
          stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
          icon: 'error',
          position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
          textAlign: 'left', // Text alignment i.e. left, right or center
          loader: false // Whether to show loader or not. True by default
        });
      }
    });
  }

  // 弹幕发送功能
  function danmuSend(e) {
    let keyCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
    if (keyCode == 13) {
      // alert("响应键盘的enter事件");
      // 获取时间戳
      let now = new Date(),
        timestamp = now.getTime(),
        msg;
      if ($('#danmu_send').val().trim()) {
        msg = $('#danmu_send').val().trim();
      } else {
        $.toast({
          heading: '发送内容不能为空',
          icon: 'error',
          hideAfter: 1500,
          stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
          position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
          textAlign: 'left', // Text alignment i.e. left, right or center
          loader: false // Whether to show loader or not. True by default
        });
        return;
      }
      // 定义弹幕发送
      $.ajax({
        type: 'POST',
        url: '//live.bilibili.com/msg/send',
        data: {
          // 字体颜色：默认白色：16777215 | 姥爷红：16738408 | 姥爷蓝：6737151 | 青色：65532 | 绿色：8322816 | 黄色：16772431 | 橙色：16750592
          csrf: token,
          color: color,
          fontsize: 25,
          mode: 1,
          msg: msg,
          rnd: timestamp,
          roomid: roomLongId
        },
        success: function(response) {
          if (!response.msg) {
            $.toast({
              heading: '发送成功',
              icon: 'success',
              hideAfter: 1500,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
            $('#danmu_send').val('');
          } else {
            $.toast({
              heading: '发送失败',
              text: '错误原因：' + response.msg,
              hideAfter: 1500,
              stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
              icon: 'error',
              position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
              textAlign: 'left', // Text alignment i.e. left, right or center
              loader: false // Whether to show loader or not. True by default
            });
          }
        },
        error: function() {
          $.toast({
            heading: '发送失败',
            text: '网络错误',
            hideAfter: 1500,
            stack: 10, // false if there should be only one toast at a time or a number representing the maximum number of toasts to be shown at a time
            icon: 'error',
            position: 'top-right', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
            textAlign: 'left', // Text alignment i.e. left, right or center
            loader: false // Whether to show loader or not. True by default
          });
        }
      });
    }
  }

  window.onload = function() {
    setTimeout(function() {
      $('body').append(
        `<script src="https://cdn.bootcss.com/jquery-toast-plugin/1.3.2/jquery.toast.min.js"></script>`
      );
    }, 5e2);
    $('#start').click(function() {
      set_time();
      start();
    });
    $('#clear').click(clear);
    $('#roomID').val(roomId);
    if (roomId == 22557) {
      $('#guard').show();
    }
    $('#goToRoom').click(function() {
      window.open('https://live.bilibili.com/' + roomId);
    });
    $('#intervalTime').blur(set_time);
    $('.color').click(set_color);
    $('#danmu_send').keypress(danmuSend);
    $('#danmu_add').click(addDanmu);
    $('#autoreply_add').click(function() {
      addReply(0);
    });
  };
})();
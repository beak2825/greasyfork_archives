// ==UserScript==
// @name         点点开黑助手
// @namespace    ddkhzs
// @version      1.1.4
// @description  点点开黑助手，爱神秘宝自动查找，定时发送消息，触发发送消息，关闭置顶横幅,屏蔽礼物特效
// @author       云樊
// @match        *://y.tuwan.com/chatroom*
// @match        *://y.tuwan.com/activity*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=y.tuwan.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492426/%E7%82%B9%E7%82%B9%E5%BC%80%E9%BB%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/492426/%E7%82%B9%E7%82%B9%E5%BC%80%E9%BB%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
;(function () {
    ;("use strict")
    // Your code here...

    //大厅消息发送函数
    var oldSendMessage = ""
    var sendMessage = function (msg) {
      oldSendMessage = $(".chat-input-chat-textarea textarea").val()
      $(".chat-input-chat-textarea textarea").val(msg)
      $(".inline-flex.flexvcenter.flexhcenter.chat-input-btn-send")[2].click()
      $(".chat-input-chat-textarea textarea").val(oldSendMessage)[0].focus()
    }
    $.cookie.json = true
    //判断为大厅界面
    if (window.location.href.indexOf("y.tuwan.com/chatroom") > 0) {
      //大厅HTML界面
      //setTimeout(() => {
      $("body").append(
        `<style>
                  #dingshixiaoxi,
                  #inchatonline,
                  #closebanner,
                  #inchatwelcome,
                  #closeanimation {
                    display: none;
                  }
                  .ddkhzs-main:hover #dingshixiaoxi {
                    display: block;
                  }
                  .ddkhzs-main:hover #inchatwelcome {
                    display: block;
                  }
                  .ddkhzs-menu-button:hover #inchatonline {
                    display: block;
                    position: absolute;
                    top: 0px;
                    left: 100%;
                  }
                  .ddkhzs-menu-button:hover #closebanner {
                    display: block;
                    position: absolute;
                    top: 35px;
                    left: 100%;
                  }
                  .ddkhzs-menu-button:hover #closeanimation {
                    display: block;
                    position: absolute;
                    top: 70px;
                    left: 100%;
                  }
                  #dingshixiaoxi:hover,
                  #inchatwelcome:hover,
                  #inchatonline:hover,
                  #closebanner:hover,
                  .ddkhzs-menu-buttons:hover,
                  #closeanimation:hover {
                    background-color: white;
                  }
                  .ddkhzs-main {
                    position: fixed;
                    left: 20%;
                    top: 10px;
                    z-index: 2;
                  }
                  .ddkhzs-menu-buttons {
                    background-color: rgb(255, 125, 0);
                    padding: 9px;
                    width: 120px;
                    border: none;
                  }
                  #dingshixiaoxi,
                  #inchatwelcome,
                  #inchatonline,
                  #closebanner,
                  #closeanimation {
                    width: 120px;
                    height: 35px;
                    background-color: rgb(255, 125, 0);
                    border: none;
                  }
                  #ddkhzs-inchatwelcome-main {
                    display: none;
                    background-color: white;
                  }
                  .inchatwelcomes:hover #ddkhzs-inchatwelcome-main {
                    position: absolute;
                    top: 0px;
                    left: 100%;
                    display: block;
                  }
                  #ddkhzs-dingshixiaoxi-main {
                    display: none;
                    background-color: white;
                  }
                  .dingshixiaoxis:hover #ddkhzs-dingshixiaoxi-main {
                    position: absolute;
                    top: 0px;
                    left: 100%;
                    display: block;
                  }
                  .ddkhzs-main button {
                    font-size: 12px;
                    border-radius: 0px;
                  }
                </style>
                <div class="ddkhzs-main">
                  <div class="ddkhzs-menu-button">
                    <button class="ddkhzs-menu-buttons">点点开黑助手</button>
                    <button id="inchatonline">在线时长(关闭)</button>
                    <button id="closebanner">关闭横幅(关闭)</button>
                    <button id="closeanimation">礼物屏蔽(关闭)</button>
                  </div>
                  <div class="inchatwelcomes">
                    <button id="inchatwelcome">进厅欢迎</button>
                    <div id="ddkhzs-inchatwelcome-main">
                      <textarea
                        rows="4"
                        cols="40"
                        id="ddkhzs-inchatwelcome-input"
                        placeholder="欢迎$$$进厅(可以自行定义欢迎词，其中$$$会被自动替换为进厅用户名)"
                      ></textarea>
                      <button
                        id="ddkhzs-inchatwelcome-send"
                        style="width: 80px; height: 50px; margin-left: 30%"
                      >
                        开启
                      </button>
                    </div>
                  </div>
                  <div class="dingshixiaoxis">
                    <button id="dingshixiaoxi">定时消息</button>
                    <div
                      id="ddkhzs-dingshixiaoxi-main"
                      style="position: absolute; background-color: white"
                    >
                      <textarea
                        rows="2"
                        cols="40"
                        id="ddkhzs-dingshixiaoxi-input"
                        placeholder="请输入要定时发送的信息"
                      ></textarea>
                      <br />
                      定时时间(毫秒):<input
                        type="text"
                        id="ddkhzs-dingshixiaoxi-time-input"
                        value="3000"
                      />(1000毫秒=1秒) <br />
                      <button id="ddkhzs-dingshixiaoxi-send">发送</button>
                    </div>
                  </div>
                </div>`
      )
  
      //大厅JavaScript代码
      //cookies
      var ddkhzs = $.cookie("ddkhzs")
      if (ddkhzs == undefined) {
        $.cookie(
          "ddkhzs",
          {
            dingshixiaoxi: { massage: "", millisecond: 3000, send: false },
            inchatwelcome: { massage: "", send: false },
            inchatonline: false,
            closebanner: false,
          },
          { expires: 365, path: "/" }
        )
        ddkhzs = $.cookie("ddkhzs")
      }
      //定时消息模块
      var timer = null
      $("#ddkhzs-dingshixiaoxi-send").click(function () {
        if (timer != null) {
          //有定时器
          clearInterval(timer)
          timer = null
          $("#ddkhzs-dingshixiaoxi-send").text("发送")
          //取消cookies
          ddkhzs.dingshixiaoxi.send = false
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        } else {
          //无定时器
          $("#ddkhzs-dingshixiaoxi-send").text("取消定时发送")
          timer = setInterval(function () {
            //保存消息到cookies
            ddkhzs.dingshixiaoxi.massage = $("#ddkhzs-dingshixiaoxi-input").val()
            ddkhzs.dingshixiaoxi.millisecond = $(
              "#ddkhzs-dingshixiaoxi-time-input"
            ).val()
            ddkhzs.dingshixiaoxi.send = true
            $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
            //消息频率低于4000毫秒会加随机字符串 然后发送
            if ($("#ddkhzs-dingshixiaoxi-time-input").val() < 4000) {
              var str = ""
              for (let i = 0; i < 2; i++) {
                str += Math.floor(Math.random() * 9) + ""
              }
              sendMessage($("#ddkhzs-dingshixiaoxi-input").val() + str)
            } else {
              sendMessage($("#ddkhzs-dingshixiaoxi-input").val())
            }
          }, $("#ddkhzs-dingshixiaoxi-time-input").val())
        }
      })
      //进厅欢迎模块
      var timerwelcome = null
      var massage = $(
        $(".flex.getredbag-message")[$(".flex.getredbag-message").length - 1]
      )
        .find("span")
        .text()
      $("#ddkhzs-inchatwelcome-send").click(function () {
        if (timerwelcome != null) {
          //有定时器
          clearInterval(timerwelcome)
          timerwelcome = null
          $("#ddkhzs-inchatwelcome-send").text("开启")
          //取消cookies
          ddkhzs.inchatwelcome.send = false
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        } else {
          //无定时器
          $("#ddkhzs-inchatwelcome-send").text("取消")
          //保存消息到cookies
          ddkhzs.inchatwelcome.massage = $("#ddkhzs-inchatwelcome-input").val()
          ddkhzs.inchatwelcome.send = true
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
          timerwelcome = setInterval(function () {
            if (
              $(
                $(".flex.getredbag-message")[
                  $(".flex.getredbag-message").length - 1
                ]
              )
                .find("span")
                .text() == massage
            ) {
              //消息相同不处理
            } else {
              //处理为旧消息
              massage = $(
                $(".flex.getredbag-message")[
                  $(".flex.getredbag-message").length - 1
                ]
              )
                .find("span")
                .text()
              //发送消息
              sendMessage(
                $("#ddkhzs-inchatwelcome-input").val().replace("$$$", massage)
              )
            }
          }, 2000)
        }
      })
      //在线时长模块
      var oldonlineID = ""
      var timeronline = null
      $("#inchatonline").click(function () {
        if (timeronline) {
          //开启中就关闭
          clearInterval(timeronline)
          timeronline = null
          $("#inchatonline").text("在线时长(关闭)")
          //取消cookies
          ddkhzs.inchatonline = false
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        } else {
          //关闭中就开启
          $("#inchatonline").text("在线时长(开启)")
          //保存cookies
          ddkhzs.inchatonline = true
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
          timeronline = setInterval(function () {
            var user = $(
              ".flex.chat-center-message .chat-text-content div:last-child"
            ).last()
            if (
              user.text().indexOf("查询我的在线时长") != -1 &&
              user.attr("data-uid") != oldonlineID
            ) {
              oldonlineID = user.attr("data-uid")
              var url = window.location.href.substring(29)
              var ifurl = window.location.href.substring(29).indexOf("?")
              if (ifurl !== -1) {
                let beforeQuestionMark = url.substring(0, ifurl)
                url = beforeQuestionMark
              }
              fetch("https://ddkh.yunfanwanglo.com:8088/Today?TID=" + url)
                .then((response) => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok")
                  }
                  return response.json()
                })
                .then((data) => {
                  if (data.error == 0) {
                    for (let i = 0; i < data.message.length; i++) {
                      if (data.message[i].id == user.attr("data-uid")) {
                        sendMessage(
                          user.attr("data-nickname") +
                            ",您的今日在线时长为:" +
                            Math.floor((data.message[i].num * 5) / 60) +
                            "小时" +
                            ((data.message[i].num * 5) % 60) +
                            "分钟!"
                        )
                        break
                      }
                      if (i == data.message.length - 1) {
                        sendMessage("查询不到你的数据，请在厅里待五分钟再来哦")
                      }
                    }
                  } else {
                    sendMessage("系统错误，请稍后再试！")
                  }
                })
            }
          }, 2000)
        }
      })
      //关闭横幅模块
      $("#closebanner").click(function () {
        if (ddkhzs.closebanner == false) {
          $("#closebanner").text("关闭横幅(开启)")
          setTimeout(function () {
            $("#baoboxmessagefly").remove()
          }, 3000)
          ddkhzs.closebanner = true
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        } else {
          $("#closebanner").text("关闭横幅(关闭)")
          ddkhzs.closebanner = false
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        }
      })
      //礼物屏蔽模块
      var observer
      $("#closeanimation").click(function () {
        if (ddkhzs.closeanimation == false) {
          $("#closeanimation").text("关闭礼物(开启)")
          ddkhzs.closeanimation = true
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
          var observerarticle = document.getElementsByTagName("body")[0]
          var options = {
            childList: true,
          }
          observer = new MutationObserver(function (mutations, observer) {
            mutations.forEach(function (mutation) {
              if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(function (node) {
                  //判断如果ID包含svga则删除
                  if (
                    $(node).attr("id") != undefined &&
                    $(node).attr("id").indexOf("svga") !== -1
                  ) {
                    console.info(node, 1)
                    $(node).remove()
                  }

                  if ($(".video_canvas").length > 0) {
                    console.info(node, 2)
                    $(".video_canvas").remove()
                  }
                })
              }
            })
          })
          observer.observe(observerarticle, options)
        } else {
          $("#closeanimation").text("关闭礼物(关闭)")
          if (observer != undefined) {
            observer.disconnect()
          }
          ddkhzs.closeanimation = false
          $.cookie("ddkhzs", ddkhzs, { expires: 365, path: "/" })
        }
      })
  
      //从cookies中恢复状态
      //礼物屏蔽模块是否开启
      if (ddkhzs.closeanimation == true) {
        ddkhzs.closeanimation = false
        $("#closeanimation").click()
      }
      //关闭横幅模块是否开启
      if (ddkhzs.closebanner == true) {
        ddkhzs.closebanner = false
        $("#closebanner").click()
      }
      //获取在线模块是否开启
      if (ddkhzs.inchatonline == true) {
        $("#inchatonline").click()
      }
      //获取进厅模块是否开启
      if (ddkhzs.inchatwelcome.massage != "") {
        $("#ddkhzs-inchatwelcome-input").val(ddkhzs.inchatwelcome.massage)
      }
      if (ddkhzs.inchatwelcome.send == true) {
        $("#ddkhzs-inchatwelcome-send").click()
      }
      //获取定时发送模块是否开启
      if (ddkhzs.dingshixiaoxi.massage != "") {
        $("#ddkhzs-dingshixiaoxi-input").val(ddkhzs.dingshixiaoxi.massage)
      }
      if (ddkhzs.dingshixiaoxi.millisecond != 3000) {
        $("#ddkhzs-dingshixiaoxi-time-input").val(
          ddkhzs.dingshixiaoxi.millisecond
        )
      }
      if (ddkhzs.dingshixiaoxi.send == true) {
        $("#ddkhzs-dingshixiaoxi-send").click()
      }
      //}, 5000)
  
      //结束大厅界面
    }
    // 判断爱神秘宝界面
    setTimeout(function () {
      if (
        window.location.href.indexOf("y.tuwan.com/activity") > 0 &&
        $(".hot_item").length == 3
      ) {
        $("body").append(`<button
              class="ddkhzs"
              style="
                height: 50px;
                width: 100px;
                position: fixed;
                top: 400px;
                right: 0px;
                border-radius: 10%;
                background-color: pink;
              "
            >
              点我自动查找
            </button>`)
  
        $(".ddkhzs").click(function () {
          setTimeout(function () {
            $(".hot_item")[0].click()
          }, 100)
          setTimeout(function () {
            $(".hot_item")[1].click()
          }, 1100)
          setTimeout(function () {
            $(".hot_item")[2].click()
            alert("自动查找完成")
          }, 3100)
        })
      }
    }, 5000)
  })()
  
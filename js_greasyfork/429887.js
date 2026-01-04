// ==UserScript==
// @name         b站多p视频时长统计，倍速播放
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  视频总时长分集时长统计（多p），倍速播放
// @author       Jackpapapapa
// @match        *://www.bilibili.com/video/*
// @license      MIT
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429887/b%E7%AB%99%E5%A4%9Ap%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1%EF%BC%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/429887/b%E7%AB%99%E5%A4%9Ap%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1%EF%BC%8C%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict"
  //总集数时间
  $("body").append(
    '<div id="episode-index" style="width:17rem; font-size: 12px; padding: 6px; background-color: rgb(0, 161, 214); color: black; display: block; position: fixed; top:0; right: 0px; z-index: 2147483657;"><label for="start">开始集数:</label><input type="number" id="start" value="0"><br/><label for="end">结束集数:</label><input type="number" id="end" value="0"><div> <button>总时间</button><button id="confirm">确定</button></div><div id="time"></div></div>'
  )
  $("#episode-index>div>button:nth-child(1)").click(function () {
    if ($("#episode-index").children().is("#totaltime") === true) return
    let $duration = $("#multi_page > div.cur-list > ul > li> a > div").find(
      ".duration"
    )
    let len = $duration.length
    let tmin = 0,
      thour = 0,
      tsec = 0
    for (let i = 0; i <= len - 1; i++) {
      //   console.log($duration[i].innerText.split(":"))
      let duration_t = $duration[i].innerText.split(":")
      if (duration_t.length == 2) {
        tmin += parseInt(duration_t[0])
        tsec += parseInt(duration_t[1])
      } else if (duration_t.length == 3) {
        thour += parseInt(duration_t[0])
        tmin += parseInt(duration_t[1])
        tsec += parseInt(duration_t[2])
      }
    }
    tmin += parseInt(tsec / 60)
    tsec = tsec % 60
    thour += parseInt(tmin / 60)
    tmin = tmin % 60
    let ttime = thour + ":" + tmin + ":" + tsec
    let ht = '<div id="totaltime">剧集总时长为：' + ttime + "</div>"
    $("#episode-index").append(ht)
  })
  //所选集数时间
  function select(start, end) {
    $("#episode-index>input#start").val(start)
    $("#episode-index>input#end").val(end)
    let hour = 0,
      minute = 0,
      second = 0
    let duration_s = $("#multi_page > div.cur-list > ul > li> a > div").find(
      ".duration"
    )
    for (let pre = start - 1; pre <= end - 1; pre++) {
      let duration_pre = duration_s[pre].innerText.split(":")

      if (duration_pre.length == 2) {
        minute += parseInt(duration_pre[0])
        second += parseInt(duration_pre[1])
      } else if (duration_pre.length == 3) {
        hour += parseInt(duration_pre[0])
        minute += parseInt(duration_pre[1])
        second += parseInt(duration_pre[2])
        }
        console.log(minute);
    }
    minute += parseInt(second / 60)
    second = second % 60
    hour += parseInt(minute / 60)
    minute = minute % 60
    let time = hour + ":" + minute + ":" + second
    $("#episode-index>#time").text("选择时长：" + time)
  }

  $("#episode-index>div>button:nth-child(2)").on("click", function () {
    let start =
      parseInt($("#episode-index>input#start").val()) <= 0
        ? 1
        : parseInt($("#episode-index>input#start").val())
    let end =
      parseInt($("#episode-index>input#end").val()) >
      $("#multi_page > div.cur-list > ul > li> a > div").find(".duration")
        .length
        ? $("#multi_page > div.cur-list > ul > li> a > div").find(".duration")
            .length
        : parseInt($("#episode-index>input#end").val())
    end = end < 0 ? 1 : end
    select(start, end)
  })
  $("#episode-index>input#end").keydown(function (e) {
    if (e.keyCode === 13) {
      let start =
        parseInt($("#episode-index>input#start").val()) <= 0
          ? 1
          : parseInt($("#episode-index>input#start").val())
      let end =
        parseInt($("#episode-index>input#end").val()) >
        $("#multi_page > div.cur-list > ul > li> a > div").find(".duration")
          .length
          ? $("#multi_page > div.cur-list > ul > li> a > div").find(".duration")
              .length
          : parseInt($("#episode-index>input#end").val())
      end = end < 0 ? 1 : end
      select(start, end)
    }
  })

  //倍速播放
  function setRate(rate) {
    $("video")[0].playbackRate = rate
  }
  $("#episode-index").append(
    '<div id="playbackrate"><label for="rate">倍速<input type="number" id="rate"></label><button>确定</button></div>'
  )
  $("#episode-index>#playbackrate button").on("click", function () {
    let rate = parseInt($("#episode-index>#playbackrate #rate").val())
    setRate(rate)
    console.log("click")
  })
  $("#episode-index>#playbackrate input").on("keydown", function (e) {
    if (e.keyCode === 13) {
      let rate = parseInt($("#episode-index>#playbackrate #rate").val())
      setRate(rate)
    }
  })
})()

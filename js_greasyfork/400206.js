
// ==UserScript==
// @name             HiNativeTool
// @name:en          HiNativeTool
// @namespace        http://tampermonkey.net/
// @version          1.3.1
// @description      Handy Hinative tool!!
// @description:en   Handy Hinative tool!!
// @author           Collen Zhou
// @match            *://hinative.com/*
// @grant            unsafeWindow
// @grant            GM_getValue
// @grant            GM_setValue
// @grant            GM_listValues
// @grant            GM_xmlhttpRequest
// @grant            unsafeWindow
// @require          http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/400206/HiNativeTool.user.js
// @updateURL https://update.greasyfork.org/scripts/400206/HiNativeTool.meta.js
// ==/UserScript==
//The file is auto created with script, changes might get lost!
(function() {
    'use strict';/*this is generated code don't edit*/
    console.log("Hinative tool is running!")
    window. gm_get = GM_getValue
    window. gm_set = GM_setValue
    function toggle_setting(){
            let visible=$('#popup').is(':visible')
            var pop_up=$(window.popuphtml)
            if(visible)
            pop_up.hide()
            else{
            pop_up.show()
            }
            $('#popup').replaceWith(pop_up)
            setup_popup()

    }

    let s=$("<li></li>")
    let ts=$("<span id='setting' title='sript settings' style='font-size: 22px;cursor: pointer;'  >⚙️</span>")
    ts.click(toggle_setting)
    s.append(ts)
    $(".nav_activity").after(s)

window. TMStorage = function () {
}
//添加TM支持
TMStorage.prototype = {
  get: function (keys, callback) {
    let count = 0;/*this is generated code don't edit*/
    let sum = keys.length
    let obj = {}

    for (let key of keys) {
      let key1 = key
      window. result = gm_get(key1)

      if (result == "undefined")
      {

        continue
      }

      else
      {

        obj[key1] = gm_get(key1)
      }

    }

    callback(obj)
  },
  set: function (obj1, callback) {
    let count = 0;/*this is generated code don't edit*/
    let sum = Object.keys(obj1).length
    let obj = obj1
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];/*this is generated code don't edit*/
        gm_set(key, value)
      }
    }
    if (typeof callback === "undefined")
      return
    else {
      callback(obj)
    }
  }
}
TMStorage.prototype.constructor = TMStorage

window. Mode = function () {
}

Mode.prototype = {
  Mode: null,
  Storage: null,
  OnInstalled: function (callback) { },
  OnPageUpdate: function (callback) { },
  ExecuteScript: function (script, callback) { },
  unsafeWindow:window
}
Mode.prototype.constructor = Mode

//添加TM支持
window. TMMode = function () {
  Mode.call(this)
  this.Mode = "TM"
  this.Storage = new TMStorage()
  this.unsafeWindow=unsafeWindow
  this.OnPageUpdated = function (callback) {
    callback.call(this)
  }
  this.ExecuteScript = function (obj, callback) {

    eval(obj.code)


    callback.call(this)
  }

}
TMMode.prototype = new Mode()
TMMode.prototype.constructor = new TMMode()

window. ExtensionMode = function () {
  Mode.call(this)
  this.Mode = "extension"
  this.Storage = chrome.storage.local
  this.OnPageUpdated = function (callback) {
    chrome.tabs.onUpdated.addListener(callback)
  }
  this.OnInstalled = function (callback) {
    chrome.runtime.onInstalled.addListener(callback)
  }
  this.ExecuteScript = function (script, callback) {
    chrome.tabs.executeScript(script, callback)
  }
}
ExtensionMode.prototype = new Mode()
ExtensionMode.prototype.constructor = ExtensionMode

window. mode = new TMMode()
window. storage = mode.Storage

function log(obj) {
  if (show_log)
      console.log(obj)
}


//执行一个字典里所有的脚本，并在所有脚本都执行完后调用resolve
function preload(dict) {
  let len = Object.keys(dict).length
  let count = 0;/*this is generated code don't edit*/
  return new Promise(resolve=>{
    for (let key in dict) {
      if (dict.hasOwnProperty(key)) {
        let val = dict[key];/*this is generated code don't edit*/
        let key1 = key
         add_script_value(key1, val).then(function () {
          if (++count == len) {
            resolve()
          }
        })
      }
    }
  })
}

//添加一个页面变量值，如果不存在则创建并设置默认值
function add_script_value(key1, dflt1) {
  let key = key1
  let dflt = dflt1
  return new Promise(resolve => {
    storage.get([key], function (result) {

      if (typeof result[key] === "undefined") {
        let obj = {}
        obj[key] = dflt
        result[key] = dflt
        log("undefined key:"+key)
        storage.set(obj)
      }

      set_variable(key,result[key]).then(function () {
        resolve()
      });/*this is generated code don't edit*/

    });/*this is generated code don't edit*/
  })
}

function set_variable(key,value)
{
  let code = "window."+key + ' = ' +JSON.stringify(value)
  return execute_script(code);/*this is generated code don't edit*/
}



//执行一个脚本返回resolve
function execute_script(script) {
  let script1=script
  return new Promise(resolve=>{
    mode.ExecuteScript({
      code: script1
    },()=>{
      let e=chrome.runtime.lastError
      resolve()
    })
  })
}

function parse_to_querystring(obj){
  //转换成query url
  var esc = encodeURIComponent;/*this is generated code don't edit*/

  var qry = Object.keys(obj)
    .map((k) => esc(k.toString().replace(/\/\d+$/,"")) + "=" + esc(obj[k]))
    .join("&");/*this is generated code don't edit*/
  return qry
}


function add_loading(ele){
  let loading = null;/*this is generated code don't edit*/
  //添加loading图片
  if ($(ele).find(".script_loading").length == 0) {
    loading = String.raw`<div class="script_loading" style="width: 16px;height: 16px;display: inline-block;background: url(//cdn.hinative.com/packs/media/loadings/default-091d6e81.gif) no-repeat;background-size: 16px 16px;"> </div>`;/*this is generated code don't edit*/
    loading = $(loading);/*this is generated code don't edit*/
    ele.append(loading);/*this is generated code don't edit*/
  }
  function ok() {
    loading.remove();/*this is generated code don't edit*/
  }
  return ok;/*this is generated code don't edit*/
}


// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';/*this is generated code don't edit*/
mode.OnInstalled(function () {
  //添加popup
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { hostEquals: 'hinative.com' },
      })
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
})
// execute_script("window.need_featured_answer=true")

mode.OnPageUpdated(function (tabId, changeInfo, tab) {
  execute_script("window.data_loaded=false")
  //在这里初始化变量
  let obj={
    "show_log": false,
    "extension_enabled": true,
    "auto_block": false,
    "need_featured_answer": true,
    "cache_new_users": false,
    "block_rate_below": 0.3,
    "validity_duration": 7,
    "blocked_users": [],
    "result_buffer": {},
    "white_list": [],
    "self_name":(()=>{})(),
    "self_url":(()=>{})(),
    "questions_info":{},
    "request_interval":200,
    "fap_count":2,
    "old_question_age":7,
    "rearrange":true,
    "questions_info":{},
    "languages":{},
    "selected_languages":[],
  }
  //数据加载完后添加全局变量data_loaded
  preload(obj).then(function(){
    // alert("preloaded")
    execute_script("window.data_loaded=true")
  })

  $.ajaxSetup({
    crossDomain: true,
    xhrFields: {
        withCredentials: true
    }
});/*this is generated code don't edit*/
})

$(document).ready(function () {
  // https://hinative.com/en-US 只监听qeustions路径
  if (!window.location.pathname.match(/^\/[^\/]*$/)) return;/*this is generated code don't edit*/
  //缓存的结果，减少xhr次数
  // result_buffer
  //数据是否加载完
  // data_loaded = false
  //用来填充的个数
  //被屏蔽的用户列表
  // blocked_users = []

  //现在是否正在blocking过程中
  window.blocking = false;/*this is generated code don't edit*/
  //新用户最大提问数
  window.new_user_qustion_count = 3;/*this is generated code don't edit*/
  //自动屏蔽的用户数组
  window.auto_blocked_users = [];/*this is generated code don't edit*/
  //已经被屏蔽的问题块
  window.blocked_blocks = new Set();/*this is generated code don't edit*/
  //已经用于填充的问题块数
  window.filling_blocks_count = 0;/*this is generated code don't edit*/
  //存放请求的队列
  window.request_queue = [];/*this is generated code don't edit*/
  //页面是否正在添加新的提问
  window.appending = false;/*this is generated code don't edit*/
  //是不是第一次加载完blocks
  window.first_loaded = true;/*this is generated code don't edit*/
  //是否只查看已回答的问题
  window.only_answered = jq_must_find(
    document.body,
    "input[data-questions-not-answered-only]"
  ).is(":checked");/*this is generated code don't edit*/
  //请求最小间隔，以免给hinative服务器造成负担
  // request_interval

  //开启请求循环
  start_request_interval();/*this is generated code don't edit*/
  //获取用户信息和语言信息
  get_info();/*this is generated code don't edit*/
  //监听blocks变化
  setInterval(() => {
    if (
      !(typeof data_loaded === "undefined") &&
      data_loaded &&
      extension_enabled
    ) {
      process_multilanguage();/*this is generated code don't edit*/
      process_blocking();/*this is generated code don't edit*/
      process_scroll();/*this is generated code don't edit*/
      process_order();/*this is generated code don't edit*/
    }
  }, 200);/*this is generated code don't edit*/
  re_arrange();/*this is generated code don't edit*/
  //每三分钟不活动刷新一次
  // var timeout;/*this is generated code don't edit*/
  // document.onmousemove = function () {
  //   clearTimeout(timeout);/*this is generated code don't edit*/
  //   timeout = setTimeout(function () {
  //     location.reload();/*this is generated code don't edit*/
  //   }, 60 * 1000 * 3);/*this is generated code don't edit*/
  // };/*this is generated code don't edit*/
});/*this is generated code don't edit*/
//自动排序问题
function process_order() {
  let dqf = $(".body[data-questions-feed]");/*this is generated code don't edit*/
  var sorted = dqf.find(".d_block").sort(function (a, b) {
    return (
      new Date($(b).find(".timeago").attr("title")).getTime() -
      new Date($(a).find(".timeago").attr("title")).getTime()
    );/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  var arr = dqf.find(".d_block").toArray();/*this is generated code don't edit*/
  var equal = true;/*this is generated code don't edit*/
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i];/*this is generated code don't edit*/
    const b = arr[i];/*this is generated code don't edit*/
    if (a !== b) {
      equal = false;/*this is generated code don't edit*/
      break;/*this is generated code don't edit*/
    }
  }
  if (!equal) {
    sorted.prependTo(dqf);/*this is generated code don't edit*/
    $("#time_line").remove();/*this is generated code don't edit*/
    for (const ele of sorted) {
      //七天前的消息线
      if (
        $("#time_line").length == 0 &&
        $(".body[data-questions-feed]").has(ele) &&
        new Date().getTime() -
          new Date(jq_must_find(ele, ".timeago").get(0).title).getTime() >
          86400 * 1000 * validity_duration
      ) {
        window.time_line = $(
          "<div id='time_line'><div style='height:1px;background-color:black'></div><div style='text-align:center'>接下来是" +
            validity_duration +
            "天前的消息</div></div>"
        );/*this is generated code don't edit*/
        $(ele).before(time_line);/*this is generated code don't edit*/
      }
    }
  }
}
//重新安排页面,去除广告,添加快捷入口,显示未回答问题等
function re_arrange() {
  if (rearrange) {
    $("main").append(
      "<div style='text-align:center'>如果需要新的提问,请下滑刷新~~ <br/>scroll down to refresh</div>"
    );/*this is generated code don't edit*/
    //添加提问和回答快速入口
    let q = $(
      "<li><a  title='my questions' href='" +
        window.self_url +
        "/questions' style='font-size: 22px;cursor: pointer;'  >❔</a></li>"
    );/*this is generated code don't edit*/
    let a = $(
      "<li><a  title='my answers' href='" +
        window.self_url +
        "/answers' style='font-size: 22px;cursor: pointer;'  >💡</a></li>"
    );/*this is generated code don't edit*/
    $(".nav_activity").after(q);/*this is generated code don't edit*/
    $(".nav_activity").after(a);/*this is generated code don't edit*/
    //等待直到所有数据加载完成
    while (!data_loaded) {}
    get_unanswered_questions();/*this is generated code don't edit*/
  }
}

function get_unanswered_questions() {
  if (typeof self_url !== "undefined") {
    let ctr = $(".l_sidebar_container");/*this is generated code don't edit*/
    let old = ctr.contents();/*this is generated code don't edit*/
    ctr.append("<div class='feedback_modal'>我未被回答的问题</div>");/*this is generated code don't edit*/
    traverse_user_questions(self_url, 0, ":has(.has_no_answer)", function (
      txt,
      block
    ) {
      let page = to_jq(txt);/*this is generated code don't edit*/
      //如果没有回答 也没有人选择回答,就继续
      if (page.find("div[data-answer-id]").length > 0) {
        if ($(page.find(".count")).length != 0) {
          let has_no_answer = true;/*this is generated code don't edit*/
          $(page.find(".count")).each(function () {
            if ($(this).find("p").find("span").text().trim() != "0")
              has_no_answer = false;/*this is generated code don't edit*/
          });/*this is generated code don't edit*/
          if (!has_no_answer) {
            return;/*this is generated code don't edit*/
          }
        } else {
          return;/*this is generated code don't edit*/
        }
      }

      console.log("find!");/*this is generated code don't edit*/
      let ele = $(block).clone();/*this is generated code don't edit*/
      let href = $(block).attr("href");/*this is generated code don't edit*/
      let wrapper = $(
        "<div class='wrapper wrapper_fukidashi' style='border: solid;border-width: 1px;margin-bottom: 20px;border-radius: 10px;'></div>"
      );/*this is generated code don't edit*/
      let ques = jq_must_find(ele, ".mod_question_content_decorated");/*this is generated code don't edit*/
      let word = jq_must_find(ques, ".keyword");/*this is generated code don't edit*/
      let timeago = jq_must_find(ele, ".timeago");/*this is generated code don't edit*/
      ques.append(timeago);/*this is generated code don't edit*/
      word.css("cursor", "pointer");/*this is generated code don't edit*/
      word.click(function () {
        location.href = href;/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
      wrapper.css("borderColor", "#2c2d30");/*this is generated code don't edit*/
      let re_ask = $("<span style='cursor: pointer;margin-left:2px'>重新提问</span>");/*this is generated code don't edit*/
      // 请求格式如下
      // let deletepage.find(".new_question").get(0).serialize()
      // delete
      // https://hinative.com/zh-CN/questions/16072745?_method: deleteauthenticity_token: 2LYt
      // new question
      // authenticity_token: Kls2QleQBbWLxPk2yRSYfHVSFocO+JJs1wAejR4714ACx4IHRSK8ttI3ocqhd0anZMIfj5ZhrWyiSHCbVBVaOg==
      // source:
      // type: WhatsayQuestion
      // question[language_id]: 22
      // question[question_keywords_attributes][0][name]: 手机欠费了
      // photo:
      // image[id]:
      // audio[id]:
      // question[supplement]: thank you
      // question[prior]: 0
      //获得提问类型
      let query = new FormData();/*this is generated code don't edit*/
      query.append("source", "");/*this is generated code don't edit*/
      let type = txt.match(/(?<=question_type:\s*')\w+(?=')/);/*this is generated code don't edit*/
      if (type == "ChoiceQuestion") {
        query.append(
          "question[content]",
          jq_must_find(page, ".keyword").text()
        );/*this is generated code don't edit*/
      } else if (type == "DifferenceQuestion") {
        let i = 0;/*this is generated code don't edit*/
        jq_must_find(page, ".keyword").each(function () {
          query.append(
            "question[question_keywords_attributes][][name]",
            $(this).text()
          );/*this is generated code don't edit*/
          query.append(
            "question[question_keywords_attributes][][id]",
            ""
          );/*this is generated code don't edit*/
          query.append(
            "question[question_keywords_attributes][][_destroy]",false
           ) ;/*this is generated code don't edit*/
          i++;/*this is generated code don't edit*/
        });/*this is generated code don't edit*/
      } else {
        query.append(
          "question[question_keywords_attributes][0][name]",
          jq_must_find(page, ".keyword").text()
        );/*this is generated code don't edit*/
      }

      query.append("photo", "");/*this is generated code don't edit*/
      query.append("image[id]", "");/*this is generated code don't edit*/
      query.append("audio[id]", "");/*this is generated code don't edit*/
      query.append("question[supplement]", page.find(".desc_box").text().trim());/*this is generated code don't edit*/
      query.append("question[prior]", 0);/*this is generated code don't edit*/
      let lang_id = -1;/*this is generated code don't edit*/
      let lang_text = jq_must_find(page, ".tag b").text();/*this is generated code don't edit*/
      log("lang_text:" + lang_text);/*this is generated code don't edit*/
      for (const val in languages) {
        if (languages.hasOwnProperty(val)) {
          const text = languages[val];/*this is generated code don't edit*/
          if (text.trim() == lang_text) {
            lang_id = val;/*this is generated code don't edit*/
            break;/*this is generated code don't edit*/
          }
        }
      }
      if (lang_id == -1) {
        log("未能找到对应语言,请刷新个人信息重试!");/*this is generated code don't edit*/
      }
      query.append("question[language_id]", lang_id);/*this is generated code don't edit*/
      re_ask.click(function () {
        let req = request_get(
          "https://hinative.com/zh-CN/questions/new?type=" + type,
          function () {},
          false,
          true
        );/*this is generated code don't edit*/
        let ap = to_jq(req.responseText);/*this is generated code don't edit*/
        query.append(
          "authenticity_token",
          jq_must_find(ap, "input[name='authenticity_token']").val()
        );/*this is generated code don't edit*/
        // let qry=parse_to_querystring(query)
        let ok = add_loading(re_ask);/*this is generated code don't edit*/
        mode.unsafeWindow.$.post({
          url: "https://hinative.com/zh-CN/questions?type=" + type,
          data: query,
          processData: false,
          contentType: false,
          success: (_) => {
            ok();/*this is generated code don't edit*/
            delete_question();/*this is generated code don't edit*/
          },
        });/*this is generated code don't edit*/
        timeago.attr("title", new Date().toTimeString());/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
      let dlt = $("<span style='cursor: pointer;margin-left:2px' >删除问题</span>");/*this is generated code don't edit*/
      let del_data = {
        _method: "delete",
        authenticity_token: jq_must_find(page, "meta[name='csrf-token']").attr(
          "content"
        ),
      };/*this is generated code don't edit*/
      dlt.click(function () {
        delete_question();/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
      function delete_question() {
        let ok = add_loading(dlt);/*this is generated code don't edit*/
        mode.unsafeWindow.$.post({
          url: href,
          data: del_data,
          success: () => {
            ok();/*this is generated code don't edit*/
            get_unanswered_questions();/*this is generated code don't edit*/
          },
        });/*this is generated code don't edit*/
        wrapper.hide();/*this is generated code don't edit*/
      }

      wrapper.append(ques);/*this is generated code don't edit*/
      wrapper.append(re_ask);/*this is generated code don't edit*/
      wrapper.append(dlt);/*this is generated code don't edit*/
      $(".l_sidebar_container").append(wrapper);/*this is generated code don't edit*/
    }).then(function () {
      old.remove();/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  }
}

function process_multilanguage() {
  if (first_loaded && $("li[data-next-page]>a").length > 0) {
    intercept();/*this is generated code don't edit*/
    get_questions().remove();/*this is generated code don't edit*/
    $("li[data-next-page]>a").attr(
      "href",
      $("li[data-next-page]>a")
        .get(0)
        .href.replace(/page=\d+/g, "page=1")
    );/*this is generated code don't edit*/
    first_loaded = false;/*this is generated code don't edit*/
  }
}
//拦截请求,并添加请求
function intercept() {
  let origin = XMLHttpRequest.prototype.open;/*this is generated code don't edit*/
  XMLHttpRequest.prototype.open = function (...args) {
    let url = args[1];/*this is generated code don't edit*/
    this.__url = url;/*this is generated code don't edit*/
    return origin.apply(this, args);/*this is generated code don't edit*/
  };/*this is generated code don't edit*/
  var accessor = Object.getOwnPropertyDescriptor(
    XMLHttpRequest.prototype,
    "response"
  );/*this is generated code don't edit*/
  Object.defineProperty(XMLHttpRequest.prototype, "response", {
    get: function () {
      let response = accessor.get.call(this);/*this is generated code don't edit*/
      if (
        typeof this.__auto === "undefined" &&
        this.__url.indexOf("questions?") > 0
      ) {
        window.appending = true;/*this is generated code don't edit*/
        let url = this.__url.split("?")[0];/*this is generated code don't edit*/
        let params = this.__url.split("?")[1];/*this is generated code don't edit*/
        let page = params.match(/(?<=page=)\d+/)[0];/*this is generated code don't edit*/
        let lang_id = params.match(/(?<=language_id=)\d+/)[0];/*this is generated code don't edit*/
        let append = "";/*this is generated code don't edit*/
        for (const lang of selected_languages) {
          if (lang == lang_id) continue;/*this is generated code don't edit*/
          let url1 = url + "?language_id=" + lang + "&page=" + page;/*this is generated code don't edit*/
          console.log("appended request:" + url1);/*this is generated code don't edit*/
          let req = request_get(url1, null, false, true);/*this is generated code don't edit*/
          append = append + req.responseText;/*this is generated code don't edit*/
        }
        let apd = to_jq(append);/*this is generated code don't edit*/
        apd.find(".hide").remove();/*this is generated code don't edit*/
        $(response.body).append(apd);/*this is generated code don't edit*/
        apd = $(response.body);/*this is generated code don't edit*/
        //把已经回答的问题去掉
        if (only_answered) {
          jq_must_find(apd, ".d_block").each(function () {
            let no_anser = $(this).find(".has_no_answer");/*this is generated code don't edit*/
            if (no_anser.length == 0) {
              $(this).remove();/*this is generated code don't edit*/
            }
          });/*this is generated code don't edit*/
        }
        window.appending = false;/*this is generated code don't edit*/
      }

      return response;/*this is generated code don't edit*/
    },
    set: function (str) {
      return accessor.set.call(this, str);/*this is generated code don't edit*/
    },
    configurable: true,
  });/*this is generated code don't edit*/
}
//自动下拉以刷新提问
function process_scroll() {
  if (window.appending == true) return;/*this is generated code don't edit*/
  if (typeof scroll_bar === "undefined") {
    window.scroll_bar = $(
      "<div class='scroll_bar' style='display:block;height:" +
        0 +
        "px;width:20px'>❀</div>"
    );/*this is generated code don't edit*/
    $("body").append(scroll_bar);/*this is generated code don't edit*/
  }
  let bh = scroll_bar.css("height").replace("px", "");/*this is generated code don't edit*/
  var remain =
    window.innerHeight - ($("html").get(0).getClientRects()[0].height - bh);/*this is generated code don't edit*/
  if (remain > 0) {
    let tmp = $("html").get(0).scrollTop;/*this is generated code don't edit*/
    console.log("scroll");/*this is generated code don't edit*/
    $("html").get(0).scrollTop = 0;/*this is generated code don't edit*/
    $("html").get(0).scrollTop = $("html").get(0).scrollHeight;/*this is generated code don't edit*/
    $("html").get(0).scrollTop = tmp;/*this is generated code don't edit*/
  }

  scroll_bar.css("height", new Number(remain) + 100);/*this is generated code don't edit*/
}

//获得所有问题块
function get_questions() {
  return $(".l_main_container .d_block");/*this is generated code don't edit*/
}

function get_info() {
  //得到自身信息
  (function get_self_username() {
    if (typeof self_name === "undefined") {
      let p_url = $(".spec_nav_profile>a").get(0).href;/*this is generated code don't edit*/
      let req = request_get(p_url, null, false);/*this is generated code don't edit*/
      let name = to_jq(req.responseText).find(".owner_name>span").text().trim();/*this is generated code don't edit*/
      storage.set({
        self_name: name,
      });/*this is generated code don't edit*/
      storage.set({
        self_url: p_url,
      });/*this is generated code don't edit*/
      log("get self name:" + name + " self url:" + p_url);/*this is generated code don't edit*/
      // get_user_info(p_url, name)
    }
  })();/*this is generated code don't edit*/
  if (typeof languages === "undefined" || languages.length == 0) {
    let req = request_get(self_url + "/edit", null, false);/*this is generated code don't edit*/
    // console.log(req.responseText)
    let options = to_jq(req.responseText).find(
      ".native_language_select>option"
    );/*this is generated code don't edit*/
    let langs = {};/*this is generated code don't edit*/
    options.each(function () {
      langs[$(this).val()] = $(this).text();/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
    storage.set({
      languages: langs,
    });/*this is generated code don't edit*/
    log("get languages:");/*this is generated code don't edit*/
    log(langs);/*this is generated code don't edit*/
  }
}

//主要的执行过程
function process_blocking() {
  if (blocking) {
    log("blokcing");/*this is generated code don't edit*/
    return;/*this is generated code don't edit*/
  }
  //阻塞标示，以免两个interval同时运行，造成多次paint
  blocking = true;/*this is generated code don't edit*/
  try {
    //遍历每个回答
    get_questions().each(function () {
      if (this.processed != true) process(this);/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  } finally {
    blocking = false;/*this is generated code don't edit*/
  }
}

function process(ele) {
  let b_block = $(ele).get(0);/*this is generated code don't edit*/
  //用 div替换a
  if (b_block.outerHTML.startsWith("<a")) {
    let newDiv = $(
      b_block.outerHTML.replace(/^<a/, "<div").replace("/a>$/", "/div>")
    );/*this is generated code don't edit*/
    $(b_block).replaceWith(newDiv);/*this is generated code don't edit*/
    b_block = newDiv.get(0);/*this is generated code don't edit*/
    ele = b_block;/*this is generated code don't edit*/
  }
  let href = get_href(ele);/*this is generated code don't edit*/
  let usr = jq_must_find(ele, ".username").text();/*this is generated code don't edit*/
  let wrapper = jq_must_find(ele, ".username_wrapper");/*this is generated code don't edit*/
  ele.processed = true;/*this is generated code don't edit*/
  //更新问题信息到本地
  let q_info = questions_info[href];/*this is generated code don't edit*/
  if (typeof q_info === "undefined") {
    q_info = {
      url: href,
      blocked: false,
      select_urls: [],
    };/*this is generated code don't edit*/
    questions_info[href] = q_info;/*this is generated code don't edit*/
    storage.set({
      questions_info: questions_info,
    });/*this is generated code don't edit*/
  }

  //如果是屏蔽用户则不用画
  if (!check_block(b_block)) {
    //log("return:" + usr)
    return;/*this is generated code don't edit*/
  }

  //如果已经画过了也不用画
  if (b_block.painted == true) {
    return;/*this is generated code don't edit*/
  }

  let block = b_block;/*this is generated code don't edit*/
  //判断是不是选择型问题
  if (
    $(block).find("*:contains('does this sound natural')").length > 0 ||
    $(block).find("*:contains('听起来自然吗？')").length > 0
  ) {
    let c_url = href + "/choice_result";/*this is generated code don't edit*/
    let c_req = request_get(c_url, null, false);/*this is generated code don't edit*/
    //如果已经投过票了,则跳过这个问题
    if (c_req.responseText.indexOf(self_name) > -1) {
      log("usr:" + usr + " skip quesion because I have selected");/*this is generated code don't edit*/
      add_block(block);/*this is generated code don't edit*/
      return;/*this is generated code don't edit*/
    }
  }

  //如果该用户没加载过,或者用户数据过期了就继续加载数据，否则重画
  if (typeof result_buffer[usr] === "undefined") {
    //没有加载过就继续
    log("usr not in buffer:" + usr);/*this is generated code don't edit*/
  } else if (!(typeof validity_duration === "undefined")) {
    let duration =
      (new Date().getTime() - result_buffer[usr].time) / (86400 * 1000);/*this is generated code don't edit*/
    //判断数据是否过期,单位为天
    if (duration >= validity_duration) {
      log("validity_duration:" + validity_duration + "duration:" + duration);/*this is generated code don't edit*/
      log(usr + " data expired!");/*this is generated code don't edit*/
    } else {
      //已经加载过了
      //如果是新的方块则重新画一遍
      do_painting(b_block, result_buffer[usr].txt);/*this is generated code don't edit*/
      return;/*this is generated code don't edit*/
    }
  }
  let loading_ok = add_loading(wrapper);/*this is generated code don't edit*/
  // let loading = null;/*this is generated code don't edit*/
  // //添加loading图片
  // if ($(b_block).find(".script_loading").length == 0) {
  //   loading = String.raw`<div class="script_loading" style="width: 16px;height: 16px;display: inline-block;background: url(//cdn.hinative.com/packs/media/loadings/default-091d6e81.gif) no-repeat;background-size: 16px 16px;"> </div>`;/*this is generated code don't edit*/
  //   loading = $(loading);/*this is generated code don't edit*/
  //   wrapper.append(loading);/*this is generated code don't edit*/
  // }

  function success() {
    //更新数据到本地
    update_result_buffer();/*this is generated code don't edit*/
    loading_ok();/*this is generated code don't edit*/
  }

  //发送请求
  request_get(href, function (evt) {
    let q_url = href;/*this is generated code don't edit*/
    //得到用户页面
    let txt = evt.srcElement.response;/*this is generated code don't edit*/
    let page = to_jq(txt);/*this is generated code don't edit*/
    let vote = page.find("#js-choice_vote");/*this is generated code don't edit*/
    let select_urls = [];/*this is generated code don't edit*/
    //保存选择项
    if (vote.length > 0) {
      let div = $("<div>");/*this is generated code don't edit*/
      //获得投票选项
      vote.find(".list-group-item").each(function () {
        // let clone = $(this).clone()
        // clone.css("display", "inline-block")
        // div.append(clone)
        let link = jq_must_find(this, "a");/*this is generated code don't edit*/
        let url = link.attr("href");/*this is generated code don't edit*/
        if (url == "") {
          //设置keyword
          jq_must_find(page, "#question_keyword_id").val(
            link.attr("data-url").match(/\d+$/)
          );/*this is generated code don't edit*/
          let form = jq_must_find(page, "form[data-text-correction-form]");/*this is generated code don't edit*/
          url =
            q_url +
            "/content_corrections?" +
            form.serialize() +
            "&commit=Submit%20correction";/*this is generated code don't edit*/
          log("href:" + href);/*this is generated code don't edit*/
        }
        select_urls.push(url);/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
    }

    let wrp = $(page.find(".chat_content_wrapper").get(0));/*this is generated code don't edit*/
    //https://hinative.com/en-US/questions/15939889/choice_result

    q_info.select_urls = select_urls;/*this is generated code don't edit*/
    storage.set({
      questions_info: questions_info,
    });/*this is generated code don't edit*/
    //获得用户profileurl,如果没有则不继续了
    if (wrp.find(".username").length == 0) return;/*this is generated code don't edit*/
    let p_url = wrp.find("a").get(0).href;/*this is generated code don't edit*/
    let usr1 = usr;/*this is generated code don't edit*/
    get_user_info(p_url, usr1).then(function (buffer) {
      let b_block1 = b_block;/*this is generated code don't edit*/
      let buffer1 = buffer;/*this is generated code don't edit*/
      if (b_block1.painted == true) {
        return;/*this is generated code don't edit*/
      }

      //保存了基本信息和用户地址
      result_buffer[buffer.usr] = buffer1;/*this is generated code don't edit*/
      do_painting(b_block1);/*this is generated code don't edit*/
      if (!need_featured_answer) {
        success();/*this is generated code don't edit*/
      } else {
        get_user_featured_answer(p_url, buffer1).then(function (buffer) {
          success();/*this is generated code don't edit*/
          log("featrued loaded:" + buffer.usr);/*this is generated code don't edit*/
          result_buffer[buffer.usr] = buffer;/*this is generated code don't edit*/
          //将所有同名的block都加上rate
          get_questions().each(function () {
            if (this.featrued_painted != true) {
              let a_usr = jq_must_find(this, ".username");/*this is generated code don't edit*/
              if (a_usr.text() == buffer.usr) {
                do_featrued_painting(this);/*this is generated code don't edit*/
              }
            }
          });/*this is generated code don't edit*/
        });/*this is generated code don't edit*/
      }
    });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
}

function create_question_info(url) {
  return {
    url: url,
    blocked: false,
  };/*this is generated code don't edit*/
}

//更新缓存到本地
function update_result_buffer() {
  let clone = result_buffer;/*this is generated code don't edit*/
  //如果选择不缓冲新人，则不将新人数据上传
  if (!cache_new_users) {
    clone = Object.assign({}, result_buffer);/*this is generated code don't edit*/
    let not_recording = [];/*this is generated code don't edit*/
    for (const usr in clone) {
      if (
        result_buffer[usr].info.q_n.replace("K", "000").replace(".", "") <=
        new_user_qustion_count
      ) {
        //如果是新人则不缓存数据
        not_recording.push(usr);/*this is generated code don't edit*/
      }
    }
    for (const usr of not_recording) {
      delete clone[usr];/*this is generated code don't edit*/
    }
  }

  storage.set({
    result_buffer: clone,
  });/*this is generated code don't edit*/
}

function block_user(user_name, auto_blocked = true) {
  if (auto_blocked) auto_blocked_users.push(user_name);/*this is generated code don't edit*/
  blocked_users.push(user_name);/*this is generated code don't edit*/
  blocked_users = Array.from(new Set(blocked_users));/*this is generated code don't edit*/
  let clone = Array.from(blocked_users);/*this is generated code don't edit*/
  //自动生成的block将不被储存到本地
  for (const usr of auto_blocked_users) {
    if (clone.indexOf(usr) > -1) clone.splice(clone.indexOf(usr), 1);/*this is generated code don't edit*/
  }

  storage.set({
    blocked_users: clone,
  });/*this is generated code don't edit*/
}

//将block屏蔽掉
//update代表是否更新本次操作到本地
function add_block(ele, update = true, is_auto = true) {
  let usr = jq_must_find(ele, ".username");/*this is generated code don't edit*/
  //如果用户被屏蔽，则隐藏这个提问
  blocked_blocks.add(ele);/*this is generated code don't edit*/
  if (update) {
    let href = get_href(ele);/*this is generated code don't edit*/
    questions_info[href].blocked = true;/*this is generated code don't edit*/
    questions_info[href].is_auto = is_auto;/*this is generated code don't edit*/
    storage.set({
      questions_info: questions_info,
    });/*this is generated code don't edit*/
  }

  if ($("#blocked_blocks").length == 0)
    $(".country_selector").append(
      "<span style='cursor: pointer;' > blocked questions count:<b id='blocked_blocks'>" +
        blocked_blocks.length +
        "</b></span>"
    );/*this is generated code don't edit*/
  else {
    $("#blocked_blocks").text(blocked_blocks.size);/*this is generated code don't edit*/
  }

  log("已隐藏用户问题:" + usr.text());/*this is generated code don't edit*/
  ele.style.display = "none";/*this is generated code don't edit*/
}

//添加用户到白名单
function add_white_list(user_name) {
  white_list.push(user_name);/*this is generated code don't edit*/
  storage.set({
    white_list: Array.from(new Set(white_list)),
  });/*this is generated code don't edit*/
}
//获得绘制基本信息
function get_paint_info(usr_page) {
  //获得反应率以及其他信息
  let matches = usr_page.match(/level_\d/);/*this is generated code don't edit*/
  let info = {};/*this is generated code don't edit*/
  let color = "white";/*this is generated code don't edit*/
  if (matches != null) {
    //获得用户profile rate
    info.rate = matches[0];/*this is generated code don't edit*/
  }

  //获得questions number
  let numbers = usr_page.match(/(?<=font_numbers_large['"]>)[^<]+/g);/*this is generated code don't edit*/
  // log(txt)

  if (numbers == null) {
    info.q_n = 0;/*this is generated code don't edit*/
    info.a_n = 0;/*this is generated code don't edit*/
  } else {
    info.q_n = numbers[0];/*this is generated code don't edit*/
    info.a_n = numbers[1];/*this is generated code don't edit*/
  }

  return info;/*this is generated code don't edit*/
}
//对需要框框上色
function do_painting(ele) {
  //设置一个painted属性
  ele.painted = true;/*this is generated code don't edit*/
  let usr = jq_must_find(ele, ".username");/*this is generated code don't edit*/
  let wrp = jq_must_find(ele, ".username_wrapper");/*this is generated code don't edit*/
  let url = get_href(ele);/*this is generated code don't edit*/
  let q_info = questions_info[url];/*this is generated code don't edit*/
  let buffer = result_buffer[usr.text()];/*this is generated code don't edit*/
  let info = buffer.info;/*this is generated code don't edit*/
  let div = $("<div>");/*this is generated code don't edit*/
  let header = $(ele).find(".img_box_question_answer");/*this is generated code don't edit*/
  let fuki = jq_must_find(ele, ".wrapper_fukidashi");/*this is generated code don't edit*/
  fuki.append(div);/*this is generated code don't edit*/
  //设置q_block才是问题入口
  let q_block = jq_must_find(ele, ".q_block");/*this is generated code don't edit*/
  q_block.css("cursor", "pointer");/*this is generated code don't edit*/
  q_block.click(function () {
    location.href = url;/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //添加用户页面入口
  usr.css("cursor", "pointer");/*this is generated code don't edit*/
  usr.click((_) => {
    location.href = buffer.profile_url;/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  header.css("cursor", "pointer");/*this is generated code don't edit*/
  header.click((_) => {
    location.href = buffer.profile_url;/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  if (q_info.select_urls.length > 0) {
    //画上是否自然选择项
    add_item(0, "Natural");/*this is generated code don't edit*/
    add_item(1, "A little unnatural");/*this is generated code don't edit*/
    add_item(2, "Unnatural");/*this is generated code don't edit*/
    add_item(3, "Don't konw");/*this is generated code don't edit*/
    function add_item(index, title) {
      let url = q_info.select_urls[index];/*this is generated code don't edit*/
      let s = $(
        "<span style='border-style: solid;border-width: 1px;margin: 2px;padding: 2px;cursor: pointer;' title='" +
          title +
          "'>" +
          title +
          "</span>"
      );/*this is generated code don't edit*/
      s.click(function () {
        var b = ele;/*this is generated code don't edit*/
        $(b).hide();/*this is generated code don't edit*/
        mode.unsafeWindow.$.post({
          url: url,
          dataType: "script",
          complete: function (xhr) {
            if (xhr.status == "302" || xhr.status == "200") process(b);/*this is generated code don't edit*/
          },
        });/*this is generated code don't edit*/
        console.log('$.post("' + url + '")');/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
      div.append(s);/*this is generated code don't edit*/
    }
  }

  //确认是否需要自动隐藏
  let is_auto_blocked = false;/*this is generated code don't edit*/
  let color = "white";/*this is generated code don't edit*/
  //获得用户profile rate
  let rate = info.rate;/*this is generated code don't edit*/
  switch (rate) {
    case "level_1":
      color = "red";/*this is generated code don't edit*/
      is_auto_blocked = true;/*this is generated code don't edit*/
      break;/*this is generated code don't edit*/
    case "level_2":
      color = "orange";/*this is generated code don't edit*/
      is_auto_blocked = true;/*this is generated code don't edit*/
      break;/*this is generated code don't edit*/
    case "level_3":
      color = "#ffff80";/*this is generated code don't edit*/
      break;/*this is generated code don't edit*/
    case "level_4":
      color = "green";/*this is generated code don't edit*/
      break;/*this is generated code don't edit*/
  }

  let cwrp = jq_must_find(ele, ".chat_content_wrapper");/*this is generated code don't edit*/
  let cls = $(
    "<span style='display: inline-block;float: right; cursor: pointer;' title='close this question'>✕</span>"
  );/*this is generated code don't edit*/
  cls.click(function (e) {
    e.preventDefault();/*this is generated code don't edit*/
    add_block(ele, true, false);/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  cwrp.prepend(cls);/*this is generated code don't edit*/
  //添加色彩显示
  wrp.append(
    "<span class='rate_badge' style=\"display:inline-block;width:16px;height:16px;border: darkblue;border-style: dotted;border-width: 1px;border-radius:8px;background-color:" +
      color +
      '"></span>'
  );/*this is generated code don't edit*/
  let q_n = info.q_n;/*this is generated code don't edit*/
  let a_n = info.a_n;/*this is generated code don't edit*/
  usr.get(0).style.fontWeight = "bold";/*this is generated code don't edit*/
  usr.get(0).style.color = "black";/*this is generated code don't edit*/
  usr.get(0).style.fontSize = "25";/*this is generated code don't edit*/
  wrp.append(
    $("<span style='cursor: pointer;'>" + " Q:" + q_n + " A:" + a_n + "</span>")
  );/*this is generated code don't edit*/
  //如果没有划过feture answer则画一次
  if (
    ele.featrued_painted != true &&
    typeof result_buffer[usr.text()].featured_answers != "undefined"
  ) {
    do_featrued_painting(ele);/*this is generated code don't edit*/
  }

  //自动屏蔽
  if (is_auto_blocked && auto_block) block_user(usr.text());/*this is generated code don't edit*/
  let in_white_list = white_list.indexOf(usr.text()) != -1;/*this is generated code don't edit*/
  //添加屏蔽选项
  let a = null;/*this is generated code don't edit*/
  //如果不存在于白名单则添加屏蔽选项
  if (!in_white_list) {
    a = $(
      "<span class='block' style='cursor:pointer' title='block this user'>❌</span>"
    );/*this is generated code don't edit*/
    a.before("&nbsp;");/*this is generated code don't edit*/
    a.click(function (e) {
      e.preventDefault();/*this is generated code don't edit*/
      block_user(usr.text(), false);/*this is generated code don't edit*/
      each_user_blocks(usr.text(), function () {
        do_painting(this);/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
    wrp.append(a);/*this is generated code don't edit*/
  }

  //添加白名单选项
  a = $(
    "<span class='white'  style='cursor:pointer' title='add this user to white list'>" +
      (in_white_list ? "💗" : "💚") +
      "</span>"
  );/*this is generated code don't edit*/
  a.before("&nbsp;");/*this is generated code don't edit*/
  a.click(function (e) {
    e.preventDefault();/*this is generated code don't edit*/
    add_white_list(usr.text());/*this is generated code don't edit*/
    //将用户的问题去除白名单和黑名单选项
    each_user_blocks(usr.text(), function () {
      $(this).find(".block").remove();/*this is generated code don't edit*/
      $(this).find(".white").text("💗");/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  wrp.append(a);/*this is generated code don't edit*/
  check_block(ele);/*this is generated code don't edit*/
}

//添加采纳率
function do_featrued_painting(ele) {
  ele.featrued_painted = true;/*this is generated code don't edit*/
  let usr = jq_must_find(ele, ".username");/*this is generated code don't edit*/
  let wrp = jq_must_find(ele, ".username_wrapper");/*this is generated code don't edit*/
  // log("result_buffer[" + usr.text() + "]:")
  // log(result_buffer[usr.text()])
  let a = result_buffer[usr.text()].answers;/*this is generated code don't edit*/
  let f = result_buffer[usr.text()].featured_answers;/*this is generated code don't edit*/
  let rate = (f / a).toFixed(2);/*this is generated code don't edit*/
  wrp.append(
    "<span  style='cursor: pointer;' class='rate_badage'> rate:" +
      (a != 0 ? rate : "No data!") +
      "</span>"
  );/*this is generated code don't edit*/
  if (rate <= block_rate_below) {
    //如果采纳率为0，则标红
    jq_must_find(ele, ".rate_badge", false).css("background-color", "red");/*this is generated code don't edit*/
    if (auto_block) {
      block_user(usr.text());/*this is generated code don't edit*/
      check_block(ele);/*this is generated code don't edit*/
    }
    return false;/*this is generated code don't edit*/
  }

  //采纳率大于0.6则标绿
  if (rate > 0.6) {
    jq_must_find(ele, ".rate_badge", false).css("background-color", "green");/*this is generated code don't edit*/
  }

  return true;/*this is generated code don't edit*/
}
//判断是否块块是否可画
function check_block(ele, why) {
  //如果已经屏蔽，则不用画了
  if (blocked_blocks.has(ele)) return false;/*this is generated code don't edit*/
  let usr = jq_must_find(ele, ".username");/*this is generated code don't edit*/
  //如果在白名单里则不必屏蔽
  if (white_list.indexOf(usr.text()) >= 0) {
    return true;/*this is generated code don't edit*/
  }
  //如果是黑名单用户则直接屏蔽
  if (blocked_users.indexOf(usr.text()) > -1) {
    add_block(ele, false, false);/*this is generated code don't edit*/
    return false;/*this is generated code don't edit*/
  }

  let q_info = questions_info[get_href(ele)];/*this is generated code don't edit*/
  if (typeof q_info === "undefined") {
  } else {
    var blockable = null;/*this is generated code don't edit*/
    //如果开启自动屏蔽了
    if (auto_block) {
      blockable = q_info.blocked;/*this is generated code don't edit*/
    } else if (q_info.blocked) {
      if (q_info.is_auto) blockable = false;/*this is generated code don't edit*/
      else {
        blockable = true;/*this is generated code don't edit*/
      }
    }
    if (blockable) {
      add_block(ele, false, true);/*this is generated code don't edit*/
      return false;/*this is generated code don't edit*/
    }
  }

  return true;/*this is generated code don't edit*/
}
//便遍历某个username的所有blocks
function each_user_blocks(username, handler) {
  get_questions().each(function () {
    if (jq_must_find(this, ".username").text() == username) {
      handler.call(this);/*this is generated code don't edit*/
    }
  });/*this is generated code don't edit*/
}

function get_href(ele) {
  let href = $(ele).attr("href");/*this is generated code don't edit*/
  return get_href_without_params(href);/*this is generated code don't edit*/
}
function get_href_without_params(href) {
  return href ? href.split("?")[0].trim() : {}[0];/*this is generated code don't edit*/
}
//获得用户提问，回应率，回答数
function get_user_info(p_url, usr) {
  let p_url1 = p_url;/*this is generated code don't edit*/
  let usr1 = usr;/*this is generated code don't edit*/
  // let qi=q_info
  return new Promise((resolve) => {
    request_get(p_url, function (evt1) {
      let txt = evt1.srcElement.response;/*this is generated code don't edit*/
      let buffer = {
        info: get_paint_info(txt),
        profile_url: p_url1,
        usr: usr1,
        time: new Date().getTime(),
      };/*this is generated code don't edit*/
      resolve(buffer);/*this is generated code don't edit*/
      return;/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
}

//判断两个链接id是否相等
function link_equal(link1, link2) {
  return (
    get_tail_number(get_href_without_params(link1)) ==
    get_tail_number(get_href_without_params(link2))
  );/*this is generated code don't edit*/
}
//获得字符串尾数字
function get_tail_number(str) {
  let match = str.match(/\d+$/);/*this is generated code don't edit*/
  if (match) {
    return match[0];/*this is generated code don't edit*/
  }
  return null;/*this is generated code don't edit*/
}
//遍历一个用户的问题
function traverse_user_questions(
  p_url,
  count,
  block_selector = "",
  page_loaded
) {
  log("get user_questions:" + p_url);/*this is generated code don't edit*/
  let p_url1 = p_url;/*this is generated code don't edit*/
  let page_count = count;/*this is generated code don't edit*/
  //如果设置为0则代表遍历所有问题
  if (page_count == 0) {
    let req = request_get(p_url, function () {}, false, true);/*this is generated code don't edit*/
    let info = get_paint_info(req.responseText);/*this is generated code don't edit*/
    page_count = Math.ceil(info.q_n / 10);/*this is generated code don't edit*/
  }

  return new Promise((resolve) => {
    //第一回答页面
    //在这里获得采纳的回答数
    let q_url = p_url1 + "/questions";/*this is generated code don't edit*/
    let blocks_count = 0;/*this is generated code don't edit*/
    let resolved = 0;/*this is generated code don't edit*/
    let answers = 0;/*this is generated code don't edit*/
    for (let current_page = 0; current_page < page_count; current_page++) {
      request_page(current_page);/*this is generated code don't edit*/
    }

    function request_page(index) {
      let q_url1 = q_url;/*this is generated code don't edit*/
      if (index > 0) {
        q_url1 = q_url + "?page=" + (index + 1);/*this is generated code don't edit*/
      }
      log("page:" + q_url1);/*this is generated code don't edit*/
      request_get(q_url1, function (evt) {
        let qtxt = evt.srcElement.response;/*this is generated code don't edit*/
        let page = to_jq(qtxt);/*this is generated code don't edit*/
        //获得第一页回答的问题
        let blocks = page.find(".d_block" + block_selector);/*this is generated code don't edit*/
        function check_out() {
          if (resolved == page_count && blocks_count == answers) {
            resolve();/*this is generated code don't edit*/
            return true;/*this is generated code don't edit*/
          } else {
            return false;/*this is generated code don't edit*/
          }
        }
        get_user_info();/*this is generated code don't edit*/
        //最后一页了,则取消继续查询
        if (page.find(".d_block").length == 0 || blocks.length == 0) {
          resolved++;/*this is generated code don't edit*/
          if (check_out()) {
            return;/*this is generated code don't edit*/
          }
        }

        let resolved_blocks = 0;/*this is generated code don't edit*/
        //初始化总的有回复的提问数
        blocks.each(function () {
          let badge = $(jq_must_find(this, ".badge_item").get(0)).text().trim();/*this is generated code don't edit*/
          log("badge:" + badge);/*this is generated code don't edit*/
          blocks_count++;/*this is generated code don't edit*/
          let fq_url = get_href(this);/*this is generated code don't edit*/
          let block = this;/*this is generated code don't edit*/
          //请求某一个问题的页面
          request_get(fq_url, function (evt) {
            let qtxt1 = evt.srcElement.response;/*this is generated code don't edit*/
            //最后一页
            if (qtxt1.indexOf('class="next"') < 0) page_loaded(qtxt1, block);/*this is generated code don't edit*/
            resolved_blocks++;/*this is generated code don't edit*/
            answers++;/*this is generated code don't edit*/
            if (blocks.length == resolved_blocks) {
              resolved++;/*this is generated code don't edit*/
            }
            if (check_out()) {
              return;/*this is generated code don't edit*/
            }
          });/*this is generated code don't edit*/
        });/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
    }
  });/*this is generated code don't edit*/
}

// 获得用户采纳情况信息
function get_user_featured_answer(p_url, buffer) {
  log("getting user_featured_answer:" + p_url);/*this is generated code don't edit*/
  let buffer1 = buffer;/*this is generated code don't edit*/
  if (typeof buffer.featured_answers === "undefined") {
    buffer.featured_answers = 0;/*this is generated code don't edit*/
  }
  if (typeof buffer.answers === "undefined") {
    buffer.answers = 0;/*this is generated code don't edit*/
  }
  return new Promise((resolve) => {
    traverse_user_questions(
      p_url,
      fap_count,
      ":not(:has(.has_no_answer))",
      function (res) {
        //该问题已被采纳
        if (res.indexOf("featured_answer_label") > -1) {
          buffer1.featured_answers++;/*this is generated code don't edit*/
        } else {
          //未被采纳
        }
        buffer1.answers++;/*this is generated code don't edit*/
      }
    ).then(function () {
      buffer.time = new Date().getTime();/*this is generated code don't edit*/
      resolve(buffer);/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
}
// 将文本转化为jqnodes
function to_jq(html_text) {
  let qtxt = html_text;/*this is generated code don't edit*/
  let html = $.parseHTML(qtxt);/*this is generated code don't edit*/
  let page = $("<div>").append(html);/*this is generated code don't edit*/
  return page;/*this is generated code don't edit*/
}

//在一个元素中查找关键selector,如果不存在则报错
function jq_must_find(ele, selector, force = true) {
  let find = $(ele).find(selector);/*this is generated code don't edit*/
  if (force && find.length == 0) {
    if (extension_enabled) {
      alert(
        "未能找到关键样式:" + selector + " 请联系作者解决!,程序将被暂停运行~~"
      );/*this is generated code don't edit*/
    }
    extension_enabled = false;/*this is generated code don't edit*/
  }
  return find;/*this is generated code don't edit*/
}
function request(method, url, callback, async = true, auto = true) {
  let req = new XMLHttpRequest();/*this is generated code don't edit*/
  req.__auto = auto;/*this is generated code don't edit*/
  if (callback) req.addEventListener("load", callback);/*this is generated code don't edit*/
  req.open(method, url, async);/*this is generated code don't edit*/
  // req.setRequestHeader('User-Agent','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36')

  if (async) request_queue.push(req);/*this is generated code don't edit*/
  else {
    req.send();/*this is generated code don't edit*/
  }
  return req;/*this is generated code don't edit*/
}

//发送一次get请求
function request_get(url, callback, async = true, auto = true) {
  return request("GET", url, callback, async, auto);/*this is generated code don't edit*/
}

function start_request_interval() {
  //每秒一次请求
  setInterval(function () {
    if (request_queue.length > 0) {
      var req = request_queue.shift();/*this is generated code don't edit*/
      req.send();/*this is generated code don't edit*/
    }
  }, request_interval);/*this is generated code don't edit*/
}

//更新缓存的数据
function update_cache() {
  log("current result_buffer:");/*this is generated code don't edit*/
  log(result_buffer);/*this is generated code don't edit*/
  new Promise((resolve) => {
    storage.get(["result_buffer"], function (rslt) {
      const result_buffer =
        typeof rslt.result_buffer === "undefined" ? {} : rslt.result_buffer;/*this is generated code don't edit*/
      let resolved = 0;/*this is generated code don't edit*/
      const count = Object.keys(result_buffer).length;/*this is generated code don't edit*/
      log("count:" + count);/*this is generated code don't edit*/
      log("result_buffer:");/*this is generated code don't edit*/
      log(result_buffer);/*this is generated code don't edit*/
      for (const usr in result_buffer) {
        let p_url = result_buffer[usr].profile_url;/*this is generated code don't edit*/
        let usr1 = usr;/*this is generated code don't edit*/
        get_user_info(p_url, usr1).then(function (buffer1) {
          let buffer2 = buffer1;/*this is generated code don't edit*/
          //保存了基本信息和用户地址
          result_buffer[buffer2.usr] = buffer2;/*this is generated code don't edit*/
          if (need_featured_answer == true) {
            get_user_featured_answer(p_url, buffer2).then(function (buffer3) {
              result_buffer[buffer3.usr] = buffer3;/*this is generated code don't edit*/
              if (++resolved == count) resolve(result_buffer);/*this is generated code don't edit*/
              log(
                buffer3.usr +
                  "data updated:" +
                  resolved +
                  " left:" +
                  (count - resolved)
              );/*this is generated code don't edit*/
            });/*this is generated code don't edit*/
          } else {
            result_buffer[buffer1.usr] = buffer1;/*this is generated code don't edit*/
            if (++resolved == count) resolve(result_buffer);/*this is generated code don't edit*/
            log("resolved:" + resolved + " left:" + (count - resolved));/*this is generated code don't edit*/
          }
        });/*this is generated code don't edit*/
      }
    });/*this is generated code don't edit*/
  }).then((rb) => {
    log("resovled buffer:");/*this is generated code don't edit*/
    log(rb);/*this is generated code don't edit*/
    update_result_buffer();/*this is generated code don't edit*/
    alert("用户信息更新完成！");/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
}

window.popuphtml=String.raw`<div id='popup' style='padding:10px;display: inline-block;position: absolute;z-index: 100;background: white;transform: translate(0, 100%);border-style: double;bottom: 0;left: 0;'><!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <style>
    .popup {
      width: 400px;/*this is generated code don't edit*/
      height: 500px;/*this is generated code don't edit*/
    }

    .popup,td {
      position: relative;/*this is generated code don't edit*/
    }
    .option_table a {
      display: inline-block;/*this is generated code don't edit*/
      color:darkcyan;/*this is generated code don't edit*/
    }

    .option_table {
      text-align: right;/*this is generated code don't edit*/
    }

    .range {
      width: 120px;/*this is generated code don't edit*/
      margin: auto;/*this is generated code don't edit*/
      display: block;/*this is generated code don't edit*/
      top: 50%;/*this is generated code don't edit*/
      position: absolute;/*this is generated code don't edit*/
      transform: translate(0, -50%);/*this is generated code don't edit*/
    }

    .numer_input {
      text-align: right;/*this is generated code don't edit*/

      width: 120px;/*this is generated code don't edit*/
    }

    .button {
      border-style: outset;/*this is generated code don't edit*/
      padding: 0%;/*this is generated code don't edit*/
    }

    .list_table_container {
      text-align: left;/*this is generated code don't edit*/
      border-style: double;/*this is generated code don't edit*/
    }

    .list_table {
      display: inline-block;/*this is generated code don't edit*/
      height: 150px;/*this is generated code don't edit*/
      overflow: scroll;/*this is generated code don't edit*/
    }

  </style>
</head>

<body class="popup">
  <table class="option_table">
    <thead>
      <tr>Info</tr>
    </thead>
    <tbody>
      <tr>
        <td>username:</td>
        <td><input id="username" type="text" title="user name" disabled />
          <input id="refresh_profile" type="button" value="🔄"
          title="Refresh profile information!" class='button'></input>
        </td>
      </tr>
    </tbody>
  </table>
  <table class="option_table">
    <thead>
      <tr>Options</tr>
    </thead>
    <tbody>
      <tr>
        <td>Turn on:</td>
        <td><input id="switch" type="checkbox" title="Check to allow this extension to function" /><br /></td>
      </tr>
      <tr>
        <td>Auto-block:</td>
        <td><input id="auto" type="checkbox" title="Allow this script to block users automatically" /><br /></td>
      </tr>
      <tr>
        <td>Featured answers:</td>
        <td><input id="featured" type="checkbox" title="Check to buffer and show user answer-featuring rate" /><br />
        </td>
      </tr>
      <tr>
        <td>Qustions page count:</td>
        <td><input id="fap_count"  type="number" class="numer_input" min="1" step="1" max="10" pattern="\d*"
          title="set question pages count the script need to search, might cause low performance if set too high"
          /><br /></td>
      </tr>
      <tr>
        <td>Cache new users:</td>
        <td><input id="cache_new_users" type="checkbox"
            title="Check to cache new user's data,this option can be reverted." /><br /></td>
      </tr>
      <tr>
        <td>Show log:</td>
        <td><input id="show_log" type="checkbox" title="Show developer log" /><br /></td>
      </tr>
      <tr>
        <td>Re-arrange user interface:</td>
        <td><input id="rearrange" type="checkbox" title="Check to allow rearrange user interface" /><br /></td>
      </tr>
      <tr>
        <td>Block rate below:</td>
        <td><input id="block_rate_below" type="range" class="range" title="Block rate below" min="0" max="1"
            step="0.1" /><br /></td>
      </tr>
      <tr>
        <td>Data validity duration(d):</td>
        <td><input id="validity_duration" type="number" class="numer_input" min="0" step="1" pattern="\d*"
            title="interval of auto updateing data which has expired:" /><br /></td>
      </tr>
      <tr>
        <td>Request interval(ms):</td>
        <td><input id="request_interval" type="number" class="numer_input" min="0" step="100" pattern="\d*"
            title="min allowed interval of sending xhr requests:<br/> you might get banned if the value is set too low" /><br />
        </td>
      </tr>
      <tr>
        <td>Add language:</td>
        <td>
          <input id="add_language" type="button" value="➕"
          title="Add language so that you can view them at the same time!" class='button'></input>

          <select id="languages"></select>
        </td>
      </tr>
      <tr>
        <td> Clear cached data:</td>
        <td><input id="cached" type="button" value="🚮"
            title="Clear buffered responses,you might need to re-reqeust those data!" class='button'></input><br /></td>
      </tr>
      <tr>
        <td> Update chached data:</td>
        <td><input id="update" type="button" value="🆕" title="Update Cached Data,might take some time."
            class='button'></input><br /></td>
      </tr>

      <tr>
        <td class="list_table_container">
          <table>
            <thead>
              <tr>Blocked Users</tr>
            </thead>
            <tbody id="blocked_users" class="list_table">
            </tbody>
          </table>
        </td>
        <td class="list_table_container">
          <table>
            <thead>
              <tr>White List</tr>
            </thead>
            <tbody id="white_list" class="list_table">
            </tbody>
          </table>
        </td>
      </tr>
      <tr>
        <td class="list_table_container">
          <table>
            <thead>
              <tr>Selected Languages</tr>
            </thead>
            <tbody id="selected_languages" class="list_table">
            </tbody>
          </table>
        </td>
        <td>
        </td>
      </tr>
    </tbody>
    <tr><td>好用，想给作者点个赞→</td><td>
      <a href="https://www.zhihu.com/question/28931964/answer/1140052315">知乎</a>
      <a href="https://github.com/2482103133/HiNative-Chrome-Extension">Github</a>
  </td></tr>
  </table>

  <script src="/js/jquery-3.4.1.min.js"></script>
  <script src="/js/common.js"></script>
  <script src="/js/popup.js"></script>
</body>

</html></div>`
s.append(window.popuphtml)
function setup_popup() {
  //清空缓存的用户数据
  $("#cached").click(function () {
    clear_cache();/*this is generated code don't edit*/
    mode.ExecuteScript({ code: "location.reload()" });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //更新缓存的用户数据
  $("#update").click(function () {
    popup_update_cache();/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //更新用户信息
  $("#refresh_profile").click(function () {
    storage.set(
      {
        self_url: {}[0],
        self_name: {}[0],
      },
      (_) => {
        mode.ExecuteScript({ code: "get_info()" },_=>{});/*this is generated code don't edit*/
        $("#username").get(0).refresh()
      }
    );/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //点击添加新语言
  $("#add_language").click(function () {
    let origin = storage.get(["selected_languages"], function (res) {
      let val = $("#languages").val();/*this is generated code don't edit*/
      let option = $("#languages>option[value=" + $("#languages").val() + "]");/*this is generated code don't edit*/
      res.selected_languages.push(val);/*this is generated code don't edit*/
      log("add language:" + val);/*this is generated code don't edit*/
      storage.set(
        {
          selected_languages: Array.from(new Set(res.selected_languages)),
        },
        function () {
          binding_selected_languages();/*this is generated code don't edit*/
          //刷新列表
          //   $("#selected_languages").get(0).show_list();/*this is generated code don't edit*/
        }
      );/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //设置title为value
  $("#block_rate_below").change(function () {
    this.title = $(this).val();/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  //修改featured提示
  $("#featured").click(function (e) {
    if ($(this).is(":checked")) {
      if (confirm("Warning:Cache will be cleared,continue?")) {
        clear_cache();/*this is generated code don't edit*/
      } else {
        e.preventDefault();/*this is generated code don't edit*/
      }
    }
  });/*this is generated code don't edit*/
  storage.get(["languages"], function (res) {
    // console.log(res.languages);/*this is generated code don't edit*/
    for (const val in res.languages) {
      let text = res.languages[val];/*this is generated code don't edit*/
      let op = $("<option>");/*this is generated code don't edit*/
      op.val(val);/*this is generated code don't edit*/
      op.text(text);/*this is generated code don't edit*/
      $("#languages").append(op);/*this is generated code don't edit*/
    }
  });/*this is generated code don't edit*/
  set_binding("extension_enabled", $("#switch").get(0));/*this is generated code don't edit*/
  set_binding("auto_block", $("#auto").get(0));/*this is generated code don't edit*/
  set_binding("need_featured_answer", $("#featured").get(0));/*this is generated code don't edit*/
  set_binding("cache_new_users", $("#cache_new_users").get(0));/*this is generated code don't edit*/
  set_binding("block_rate_below", $("#block_rate_below").get(0));/*this is generated code don't edit*/
  set_binding("show_log", $("#show_log").get(0));/*this is generated code don't edit*/
  set_binding("rearrange", $("#rearrange").get(0));/*this is generated code don't edit*/
  set_binding("validity_duration", $("#validity_duration").get(0));/*this is generated code don't edit*/
  set_binding("self_name", $("#username").get(0));/*this is generated code don't edit*/
  set_binding("request_interval", $("#request_interval").get(0));/*this is generated code don't edit*/
  set_binding("fap_count", $("#fap_count").get(0));/*this is generated code don't edit*/
  binding_list("blocked_users", $("#blocked_users").get(0));/*this is generated code don't edit*/
  binding_list("white_list", $("#white_list").get(0));/*this is generated code don't edit*/
  binding_selected_languages();/*this is generated code don't edit*/
}
function binding_selected_languages() {
  binding_list(
    "selected_languages",
    $("#selected_languages").get(0),
    (list) => {
      // var that = this;/*this is generated code don't edit*/
      //转化列表显示
      storage.get(["languages"], function (res) {
        list.each(function () {
          $(this).text(res.languages[$(this).text()]);/*this is generated code don't edit*/
        });/*this is generated code don't edit*/
      });/*this is generated code don't edit*/
    }
  );/*this is generated code don't edit*/
}

function binding_list(key, tbody, onbind = () => {}) {
  ((key, tbody) => {
    let list = [];/*this is generated code don't edit*/
    let bind = onbind;/*this is generated code don't edit*/
    let body = $(tbody);/*this is generated code don't edit*/
    let k = key;/*this is generated code don't edit*/
    storage.get([k], function (rslt) {
      list = typeof rslt[k] === "undefined" ? [] : rslt[k];/*this is generated code don't edit*/
      show_list();/*this is generated code don't edit*/
      function remove_block(username) {
        while (list.indexOf(username) > -1) {
          list.splice(list.indexOf(username), 1);/*this is generated code don't edit*/
        }
        window.obj = {};/*this is generated code don't edit*/
        obj[k] = list;/*this is generated code don't edit*/
        storage.set(obj);/*this is generated code don't edit*/
      }
      function show_list() {
        body.empty();/*this is generated code don't edit*/
        for (const u of list) {
          let tr = $("<tr>");/*this is generated code don't edit*/
          tr.append($("<td value='" + u + "'>" + u + "</td>"));/*this is generated code don't edit*/
          let a = $(
            "<a href='#'' style='text-decoration: none' title='Remove this user from the list'>❌</a>"
          );/*this is generated code don't edit*/
          a.click(function () {
            $(this).closest("tr").hide();/*this is generated code don't edit*/
            remove_block(u);/*this is generated code don't edit*/
          });/*this is generated code don't edit*/
          let db = $("<td></td>");/*this is generated code don't edit*/
          db.append(a);/*this is generated code don't edit*/
          tr.append(db);/*this is generated code don't edit*/
          body.append(tr);/*this is generated code don't edit*/
        }
        if (typeof bind !== "undefined") bind(body.find("td[value]"));/*this is generated code don't edit*/
      }
      body.get(0).show_list = show_list;/*this is generated code don't edit*/
    });/*this is generated code don't edit*/
  })(key, tbody);/*this is generated code don't edit*/
}

function set_binding(key1, check1) {
  let key = key1;/*this is generated code don't edit*/
  let check = check1;/*this is generated code don't edit*/
  refresh()
  $(check).change(function () {
    set_status();/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
  function refresh(){
    storage.get([key], function (result) {
      switch (check.type) {
        case "checkbox":
          $(check).attr("checked", result[key]);/*this is generated code don't edit*/
          break;/*this is generated code don't edit*/
        default:
          $(check).val(result[key]);/*this is generated code don't edit*/
      }

    });/*this is generated code don't edit*/
  }
  check.refresh=refresh

  function set_status() {
    let value = (function () {
      switch (check.type) {
        case "checkbox":
          return $(check).is(":checked");/*this is generated code don't edit*/
        default:
          return $(check).val();/*this is generated code don't edit*/
      }
    })();/*this is generated code don't edit*/
    set_variable(key, value);/*this is generated code don't edit*/
    let obj = {};/*this is generated code don't edit*/
    obj[key] = value;/*this is generated code don't edit*/
    storage.set(obj);/*this is generated code don't edit*/
  }
}

function clear_cache() {
  storage.set({ result_buffer: {}, questions_info: {} }, function () {
    log("cache cleared!");/*this is generated code don't edit*/
  });/*this is generated code don't edit*/
}

function popup_update_cache() {
  mode.ExecuteScript(
    {
      code: "update_cache()",
    },
    () => chrome.runtime.lastError
  );/*this is generated code don't edit*/
}


    $('#popup').hide();/*this is generated code don't edit*/
    })();/*this is generated code don't edit*/

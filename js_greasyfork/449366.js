// ==UserScript==
// @name         喵哉B站数据分析助手
// @namespace    http://tampermonkey.net/
// @version      1.18
// @description  显示当前B站视频的详细数据，用作简单的数据对比和分析。
// @author       喵哉小茶馆
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @icon         data:image/png;base64,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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449366/%E5%96%B5%E5%93%89B%E7%AB%99%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/449366/%E5%96%B5%E5%93%89B%E7%AB%99%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 信息面板对象
  var InfoBoard = (function () {
    function remove() {
      document.querySelectorAll(".mz_videoInfo").forEach((e) => e.remove());
    }
    function create() {
      var t = document.createElement("div");
      t.className = "mz_videoInfo";
      t.style.color = "#A0A4AA";
      t.style.whiteSpace = "nowrap";
      document.querySelector(".left-container").insertBefore(t, document.querySelector("#v_desc"));
      return t;
    }
    function addTxt(txt) {
      var t = document.createElement("span");
      t.appendChild(document.createTextNode(txt));
      t.style.width = "140px";
      t.style.display = "inline-block";
      document.querySelector(".mz_videoInfo").appendChild(t);
      return t;
    }
    function nextRow() {
      var t = document.createElement("br");
      document.querySelector(".mz_videoInfo").appendChild(t);
      return t;
    }
    function addButton(name, fn) {
      var o = document.createElement("input");
      o.style.margin = "2px";
      o.style.padding = "1px";
      o.type = "button";
      o.value = name;
      o.addEventListener("click", fn);
      document.querySelector(".mz_videoInfo").appendChild(o);
      return o;
    }

    return {
      remove: remove,
      create: create,
      nextRow: nextRow,
      addTxt: addTxt,
      addButton: addButton,
    };
  })();

  // 求百分比
  function percent(a, b) {
    return Number((a / b) * 100).toFixed(2);
  }

  // 求多少万
  function w(num, wStr = "w") {
    if (num > 10000) {
      let result = num / 10000;
      result = Math.floor(result * 100) / 100;
      var s_x = result.toString(); //将数字转换为字符串
      var pos_decimal = s_x.indexOf("."); //小数点的索引值
      // 当整数时，pos_decimal=-1 自动补0
      if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += ".";
      }
      // 当数字的长度< 小数点索引+2时，补0
      while (s_x.length <= pos_decimal + 2) {
        s_x += "0";
      }
      s_x += wStr;
    } else {
      s_x = num;
    }
    return s_x;
  }

  // 等待特定元素，然后执行callback
  function waitFor(selector, callback, maxAttempts = 100, interval = 100) {
    let attempts = 0;
    const intervalId = setInterval(() => {
      if (document.querySelector(selector)) {
        console.log(`${selector}已出现。`);
        callback();
        clearInterval(intervalId);
      } else {
        attempts += 1;
        console.log(`第${attempts}次尝试寻找${selector}失败。`);
        if (attempts >= maxAttempts) {
          clearInterval(intervalId);
          console.log(`尝试次数超过${maxAttempts}次，停止尝试。`);
        }
      }
    }, interval);
  }

  // 打开脚本主页
  function updateScript() {
    window.open("https://greasyfork.org/zh-CN/scripts/449366-%E5%96%B5%E5%93%89b%E7%AB%99%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B", "_blank");
  }

  // 设置：B站刷新时执行fn
  function setAutoRefresh(fn) {
    function waitForVue(callBack) {
      var taskId = setInterval(check, 500, callBack);
      var tryTime = 0;
      function check() {
        if (typeof document.querySelector("#app").__vue__ != "undefined") {
          clearInterval(taskId);
          callBack();
        } else {
          tryTime += 1;
          if (tryTime >= 20) throw "尝试20次(10s)后扔未找到vue, 程序退出。";
          console.log("没有找到vue, 等待500ms后重试。");
        }
      }
    }
    function setAfterHooks() {
      document.querySelector("#app").__vue__.$router.afterHooks.push(() => fn());
    }
    waitForVue(setAfterHooks);
  }

  // 按钮功能 检查更新
  function buttonFn_checkUpdate() {
    InfoBoard.nextRow();
    InfoBoard.addTxt("正在检查更新...");
    InfoBoard.nextRow();

    // 发送请求
    var updateRequest = new XMLHttpRequest();
    var url = "https://greasyfork.org/zh-CN/scripts/449366-%E5%96%B5%E5%93%89b%E7%AB%99%E6%95%B0%E6%8D%AE%E5%88%86%E6%9E%90%E5%8A%A9%E6%89%8B";
    updateRequest.open("GET", url, true);
    updateRequest.send();
    updateRequest.onreadystatechange = onreadystatechange;

    function onreadystatechange() {
      if (updateRequest.readyState != 4 || updateRequest.status != 200) return;

      // 将网页保存到body
      if (!document.querySelector(".mz_checkUpdate")) {
        var div = document.createElement("div");
        div.className = "mz_checkUpdate";
        div.style.display = "none";
        div.innerHTML = updateRequest.responseText;
        document.querySelector("body").appendChild(div);
      }

      var v = document.querySelector(".mz_checkUpdate").querySelector(".install-link").getAttribute("data-script-version");
      if (v != version) {
        InfoBoard.addButton("从" + version + "更新至" + v, updateScript);
        InfoBoard.addTxt("更新后请刷新此页面。");
      } else {
        InfoBoard.addTxt("当前版本号: " + version + ", 是最新版本。");
      }
    }
  }

  // 按钮功能 打开主页私信反馈
  function buttonFn_advice() {
    window.open("https://space.bilibili.com/157272038", "_blank");
  }

  // 初始化
  function initialize_video_page() {
    document.querySelector(".video-toolbar-left").addEventListener("mouseover", set_sanlian_percent);
    // 修改互动按钮宽度
    document.querySelectorAll(".video-toolbar-left-item").forEach((e) => {
      e.style.width = "auto";
    });
  }

  // 设置三连按钮
  function set_sanlian_percent() {
    var stat = window.__INITIAL_STATE__.videoData.stat;
    var e1 = document.querySelector(".video-like").lastElementChild;
    var e2 = document.querySelector(".video-coin").lastElementChild;
    var e3 = document.querySelector(".video-fav").lastElementChild;
    var e4 = document.querySelector(".video-share-info").lastElementChild;
    if (e1.textContent.indexOf("(") == -1) e1.textContent += "\xa0" + "(" + percent(stat.like, stat.view) + "%)";
    if (e2.textContent.indexOf("(") == -1) e2.textContent += "\xa0" + "(" + percent(stat.coin, stat.view) + "%)";
    if (e3.textContent.indexOf("(") == -1) e3.textContent += "\xa0" + "(" + percent(stat.favorite, stat.view) + "%)";
    if (e4.textContent.indexOf("(") == -1 && e4.textContent.indexOf("点击") == -1) e4.textContent += "\xa0" + "(" + percent(stat.share, stat.view) + "%)";
  }

  // 设置tag (已废弃，很遗憾，阿B已不再提供tag相关数据)
  function set_tags() {
    var s_tags = window.__INITIAL_STATE__.tags;
    var tags = document.querySelectorAll(".tag-link");
    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];
      var tagTxt = tag.textContent.replace(/\s/g, "");
      // 排除部分标签
      if (tag.parentElement.className.indexOf("firstchannel") != -1) continue;
      if (tag.parentElement.className.indexOf("secondchannel") != -1) continue;
      // 搜索tag的对应的特征值
      var msgs = [];
      for (var j = 0; j < s_tags.length; j++) {
        var e = s_tags[j];
        if (e.tag_name != tagTxt) continue;
        if (e.count && e.count.atten) msgs.push(`关注: ${w(e.count.atten)}`); // 目前失效，阿B给他隐藏起来了
        if (e.count && e.count.use) msgs.push(`使用: ${w(e.count.use)}`); // 目前失效，阿B给他隐藏起来了
        if (e.archive_count && e.archive_count != "" && e.archive_count != "-") msgs.push(`使用: ${e.archive_count}`); // 目前失效，阿B给他隐藏起来了
        if (e.featured_count) msgs.push(`推荐: ${w(e.featured_count)}`);
        if (msgs.length) tag.textContent += ` (${msgs.join(" ")})`;
        break;
      }
    }

    // 展开tag标签
    var t = document.querySelector(".show-more-btn");
    if (t.className.indexOf("unfold") == -1) t.click();
    // t.style.display = "none";
  }

  // 视频页面处理
  function update_video_page() {
    InfoBoard.remove();
    InfoBoard.create();
    InfoBoard.addButton("检查更新", buttonFn_checkUpdate);
    InfoBoard.addButton("私信反馈", buttonFn_advice);
    InfoBoard.nextRow();
    InfoBoard.addTxt("[喵哉B站数据分析助手]正在获取数据...");
    InfoBoard.addTxt("没有反应可以刷新试试...也可能是出bug了...请私信反馈...");

    var video_data = window.__INITIAL_STATE__.videoData;
    var stat = video_data.stat;
    stat.age = ((new Date().getTime() - new Date(video_data.pubdate * 1000).getTime()) / (1000 * 3600 * 24)).toFixed(2);
    set_sanlian_percent();
    // set_tags(); 已废弃

    InfoBoard.remove();
    InfoBoard.create();
    InfoBoard.addButton("检查更新", buttonFn_checkUpdate);
    InfoBoard.addButton("私信反馈", buttonFn_advice);
    InfoBoard.nextRow();
    InfoBoard.addTxt("标题: " + video_data.title);
    InfoBoard.nextRow();

    if (video_data.honor_reply.honor) {
      video_data.honor_reply.honor.forEach((e) => InfoBoard.addTxt(e.desc));
      InfoBoard.nextRow();
    }

    InfoBoard.addTxt("播放: " + w(stat.view));
    InfoBoard.addTxt("年龄: " + stat.age + "天");
    InfoBoard.addTxt("弹幕: " + w(stat.danmaku) + " (" + percent(stat.danmaku, stat.view) + "%)");
    InfoBoard.addTxt("评论: " + w(stat.reply) + " (" + percent(stat.reply, stat.view) + "%)");
    InfoBoard.nextRow();

    InfoBoard.addTxt("点赞: " + w(stat.like) + " (" + percent(stat.like, stat.view) + "%)");
    InfoBoard.addTxt("投币: " + w(stat.coin) + " (" + percent(stat.coin, stat.view) + "%)");
    InfoBoard.addTxt("收藏: " + w(stat.favorite) + " (" + percent(stat.favorite, stat.view) + "%)");
    InfoBoard.addTxt("分享: " + w(stat.share) + " (" + percent(stat.share, stat.view) + "%)");
    InfoBoard.nextRow();
  }

  // 主函数
  function mian() {
    initialize_video_page(); //第一次初始化
    setAutoRefresh(update_video_page); //设置好自动刷新
    update_video_page();
  }

  var version = "1.18"; //当前版本号
  waitFor(".video-share-info-text", mian);
})();

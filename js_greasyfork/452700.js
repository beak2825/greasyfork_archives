// ==UserScript==
// @name         下载 pilatesanytime 的字幕 (下载 .srt 文件)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  下载 https://www.pilatesanytime.com/ 的字幕。
// @author       chengzheng.apply@gmail.com
// @match        https://www.pilatesanytime.com/class-view/*
// @match        https://www.pilatesanytime.com/workshop-view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pilatesanytime.com
// @require      https://cdn.jsdelivr.net/npm/vue@2.7.10/dist/vue.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/452700/%E4%B8%8B%E8%BD%BD%20pilatesanytime%20%E7%9A%84%E5%AD%97%E5%B9%95%20%28%E4%B8%8B%E8%BD%BD%20srt%20%E6%96%87%E4%BB%B6%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452700/%E4%B8%8B%E8%BD%BD%20pilatesanytime%20%E7%9A%84%E5%AD%97%E5%B9%95%20%28%E4%B8%8B%E8%BD%BD%20srt%20%E6%96%87%E4%BB%B6%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  // 时间: 写于2022年10月。
  // 介绍: 用途是下载 pilatesanytime.com 视频的字幕，下载为 SRT 格式。
  // 作者: guokrfans@gmail.com
  // 备注1: 这里用了 Vue.js。因为纯原生方法写 UI 太麻烦了。
  // 备注2: 这个脚本的正确运行取决于页面的元素和一些变量，如果官方改了页面，那么这个脚本可能会失效。
  // 备注3：原理是获取 jwplayer().getConfig().captionsTrack; 里面的字幕数据。都是 VTTCue，转成 SRT 然后下载即可。

  // 用于开发
  // @require      file:///Users/zheng-cheng/Downloads/PilatesAnytime字幕下载/index.user.js

  // 基于这个元素，去插入我们自己的 HTML Tag。
  var anchor = document.querySelector(
    "div.tm-background-stripe-light.tm-video-player-stripe"
  );

  // 新建 div
  const newDiv = document.createElement("div");
  const element_id = "download_subtitle_div_root";
  newDiv.setAttribute("id", element_id);
  newDiv.innerHTML = `
    <div class='container' style='margin-bottom: 16px;'>
      <div class='row' style='padding-left: 15px;'>
        <subtitle-root/>
      </div>
    </div>
  `;

  // 插入 div
  anchor.prepend(newDiv);

  // 注册 Vue 组件.
  Vue.component("subtitle-root", {
    data: function () {
      return {
        captionsList: null, // 字幕列表
        loading: true, // 初始化中.
        subtitle_exists: null, // 字幕是否存在 true | false
        // <select>
        selected: "",
        // <option>
        options: [
          // { text: "English", value: "English" },
        ],
      };
    },
    template: `
      <div v-if='loading'>
        正在加载...
      </div>
      <div v-else>
        <select v-model="selected" @change="onChange($event)">
        <option disabled value="">请选择下载字幕的语言</option>
          <option v-for="option in options" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    `,
    mounted() {
      // 获取语言列表。
      const captionsList = jwplayer().getConfig().captionsList;

      // 如果没有字幕。直接退出。
      if (
        captionsList == undefined ||
        captionsList == null ||
        captionsList.length == 0
      ) {
        this.subtitle_exists = false;
        return;
      }

      // 保存到 data。
      this.captionsList = captionsList;

      // 删掉字幕列表里不要的东西（Off）
      const filtedList = captionsList.filter(function (e) {
        return e.label != "Off";
      });

      // 加载中 = false
      this.loading = false;

      var that = this;

      if (filtedList.length == 0) {
        console.log("无字幕");
        return;
      }

      // 让 <select> 里面有 <option>
      filtedList.forEach((element) => {
        that.options.push({ text: element.label, value: element.label });
      });
    },
    methods: {
      // <select> 的选择变化时触发。
      onChange(e) {
        const lang = e.target.value; // 用户选择的字幕语言.

        // 获取字幕并下载。
        const captionsTrack = jwplayer().getConfig().captionsTrack;
        if (captionsTrack != undefined && lang == captionsTrack.label) {
          let srt_string = VTTCueArray_To_SRT(captionsTrack.data);
          let filename = `${document.title}.srt`;
          downloadString(srt_string, "text/plain", filename);
        }

        // 重置选项。
        e.target.value = "";
      },
    },
  });

  // 处理时间. 比如 start="671.33"  start="37.64"  start="12" start="23.029"
  // 处理成 srt 时间, 比如 00:00:00,090    00:00:08,460    00:10:29,350
  function process_time(s) {
    s = s.toFixed(3);
    // 超棒的函数, 不论是整数还是小数都给弄成3位小数形式
    // 举个柚子:
    // 671.33 -> 671.330
    // 671 -> 671.000
    // 注意函数会四舍五入. 具体读文档

    var array = s.split(".");
    // 把开始时间根据句号分割
    // 671.330 会分割成数组: [671, 330]

    var Hour = 0;
    var Minute = 0;
    var Second = array[0]; // 671
    var MilliSecond = array[1]; // 330
    // 先声明下变量, 待会把这几个拼好就行了

    // 我们来处理秒数.  把"分钟"和"小时"除出来
    if (Second >= 60) {
      Minute = Math.floor(Second / 60);
      Second = Second - Minute * 60;
      // 把 秒 拆成 分钟和秒, 比如121秒, 拆成2分钟1秒

      Hour = Math.floor(Minute / 60);
      Minute = Minute - Hour * 60;
      // 把 分钟 拆成 小时和分钟, 比如700分钟, 拆成11小时40分钟
    }
    // 分钟，如果位数不够两位就变成两位，下面两个if语句的作用也是一样。
    if (Minute < 10) {
      Minute = "0" + Minute;
    }
    // 小时
    if (Hour < 10) {
      Hour = "0" + Hour;
    }
    // 秒
    if (Second < 10) {
      Second = "0" + Second;
    }
    return Hour + ":" + Minute + ":" + Second + "," + MilliSecond;
  }

  // 把 VTTCue 数组。
  // 转成 SRT 字符串。
  function VTTCueArray_To_SRT(VTTCueArray) {
    var result = "";
    // var BOM = "\uFEFF";
    // result = BOM + result; // store final SRT result
    var len = VTTCueArray.length;
    for (var i = 0; i < len; i++) {
      var line = VTTCueArray[i];

      // 获取需要的属性
      let text = line.text;
      let endTime = line.endTime;
      let startTime = line.startTime;

      // 换行符号
      const new_line = "\n";

      // 添加行号
      var index = i + 1;
      result = result + index + new_line;

      // 添加时间
      var start_time = process_time(startTime);
      var end_time = process_time(endTime);
      result = result + start_time;
      result = result + " --> ";
      result = result + end_time + new_line;
      // 00:00:01,939 --> 00:00:04,350

      // 添加文字
      result = result + text + new_line + new_line;
    }
    return result;
  }

  function downloadString(text, fileType, fileName) {
    var blob = new Blob([text], {
      type: fileType,
    });
    var a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(":");
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () {
      URL.revokeObjectURL(a.href);
    }, 1500);
  }

  // 主入口.
  setTimeout(() => {
    
    // 挂载 Vue.js
    var app = new Vue({
      el: `#${element_id}`,
      data: {
        message: "Hello Vue!",
      },
    });

  }, 1500);
})();

// ==UserScript==
// @name         起点听书/www.qidian.com
// @namespace    yoursatan
// @version      0.4
// @description  阅读界面右侧功能栏增加“听书”按钮、“语音”按钮。点击“听书”开始朗读：Esc-结束朗读；空格-暂定/继续；后台静默复制文章内容到剪贴板。点击“语音”按钮，打开设置页，可以调整语速。
// @author       yorusatan
// @include      https://www.qidian.com/chapter*
// @include      https://read.qidian.com/chapter*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @license      MIT License
// @require https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @downloadURL https://update.greasyfork.org/scripts/397837/%E8%B5%B7%E7%82%B9%E5%90%AC%E4%B9%A6wwwqidiancom.user.js
// @updateURL https://update.greasyfork.org/scripts/397837/%E8%B5%B7%E7%82%B9%E5%90%AC%E4%B9%A6wwwqidiancom.meta.js
// ==/UserScript==
// v0.4 增加“语音（设置）”按钮，可调整语速。
// v0.3.1 小调整。
// v0.3 修复功能，优化代码。
// v0.2 修复一些使用中发现的bug。
// v0.1 在阅读界面右侧功能栏添加“听书”按钮，点击“听书”开始朗读：Esc-结束朗读；空格-暂定/继续；后台静默复制文章内容到剪贴板。
(async function () {
  "use strict";
  // 获取文章内容
  const str = await elmGetter.get("main");
  const storyContent = $(str).children("p");
  const storyTextArr = Array.from(storyContent).map((el) => el.textContent);
  const newStoryArr = [];

  window.speechSynthesis.getVoices();

  // 侧边栏添加 听书 按钮
  const rMenu = await elmGetter.get("#r-menu");
  const btnRead = `<div data-v-6cdbc58a data-v-47ffe1e class="tooltip-wrapper relative flex" style="margin-bottom:10px">
    <a id ="btnRead" data-v-47ffe1ec target="#" href="javascript">
    <button data-v-47ffe1ec class="w-64px h-64px flex flex-col items-center justify-center rounded-8px bg-sheet-b-gray-50 text-s-gray-900 noise-bg group hover:bg-sheet-b-bw-white hover:text-primary-red-500 hover:bg-none">
    <span class="icon-audio text-24px"></span>
    <span  class="text-bo4 text-s-gray-500 mt-2px group-hover:text-primary-red-500" style="font-weight:600;">听书</span>
    </button></a><!----></div>`;
  const btnReadSet = `<div data-v-6cdbc58a data-v-47ffe1e class="tooltip-wrapper relative flex" style="margin-bottom:10px">
    <a id ="btnReadSet" data-v-47ffe1ec target="#" href="javascript">
    <button data-v-47ffe1ec class="w-64px h-64px flex flex-col items-center justify-center rounded-8px bg-sheet-b-gray-50 text-s-gray-900 noise-bg group hover:bg-sheet-b-bw-white hover:text-primary-red-500 hover:bg-none">
    <span class="icon-setting-bold text-24px"></span>
    <span  class="text-bo4 text-s-gray-500 mt-2px group-hover:text-primary-red-500" style="font-weight:600;">语音</span>
    </button></a><!----></div>`;
  const readSetPage = `
    <section id="readSetPage" class="bg-sheet-b-bw-white shadow-sd16 w-480px pl-32px pt-42px pb-44px absolute right-full top-64px" hidden>
    <button class="bg-s-gray-100 w-28px h-28px rounded-1 flex items-center justify-center hover-24 active-10 p-0 absolute right-10px top-10px">
    <span class="icon-close text-20px text-s-gray-400"></span>
    </button>
  <div class="text-rh4 font-medium text-s-gray-900">设置</div>
  <div class="w-359px">
    <div class="flex items-center mt-32px"><span class="text-s4 font-medium text-s-gray-500 sm:pr-12px mr-16px flex-shrink-0">语速调整</span>
      <div class="flex flex-grow">
      <span class="text-s4 font-medium text-s-gray-500 ">0.8 </span>
      <input id="slider" type="range" value="1.25" min="0.8" max="2" step="0.1" style="width:270px;margin:0 5px">
      <span class="text-s4 font-medium text-s-gray-500 "> 2.0</span>
      </div>
    </div>
    <div hidden>
    <div class="flex items-center mt-20px"><span class="text-s4 font-medium text-s-gray-500 sm:pr-12px mr-16px flex-shrink-0" >选择语音</span>
      <div class="flex flex-grow" >
        <select aria-label="选择语音" class="text-s4 w-320px" id="voiceList" >
        </select>
      </div>
    </div>
    </div>
</div>
</section>
`;

  $(rMenu).prepend($(readSetPage)).prepend($(btnReadSet)).prepend($(btnRead));

  setTimeout(() => {
    const voicesArr = window.speechSynthesis.getVoices();
    const voices = voicesArr.filter((item) => item.lang.includes("zh-"));
    let options = ``;
    for (i = 0; i < voices.length; i++) {
      options += `<option value="${voices[i].voiceURI}">${voices[i].name
        .replace("Microsoft ", "")
        .replace(" Chinese ", "")}</option>`;
    }
    $("#voiceList").append(options);
    $("#voiceList option:first").prop("selected", true);
  }, 100);
  let voice = "";
  $("#voiceList").change(function () {
    voice = $("#voiceList option:selected").prop("value");
  });

  $("#btnReadSet").click(function () {
    event.preventDefault();
    $("#readSetPage").toggle();
  });

  $(".icon-close").click(() => {
    $("#readSetPage").toggle();
  });
  $("#r-menu")
    .children()
    .first()
    .click(function () {
      event.preventDefault();
    });
  // 移除数组空项（文本空行）
  const countPara = storyTextArr.length;
  for (var i = 0; i < countPara; i++) {
    storyTextArr[i] = storyTextArr[i].replace(/\s+/g, " ").trim();
    if (storyTextArr[i] != "") {
      newStoryArr.push(storyTextArr[i]);
    }
  }
  const newCountPara = newStoryArr.length;

  // 用于逐段朗读
  var flag = 0;

  // 朗读

  $("#btnRead").click(function () {
    event.preventDefault();
    // 朗读文字数组
    var storyAllRead = newStoryArr;

    // 用于文字选中效果
    var range = document.createRange();
    var selection = window.getSelection();

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    // 朗读

    var readStory = function () {
      var speaker = new window.SpeechSynthesisUtterance();

      speaker.rate = $("#slider").val();
      $("#slider").on("input", function () {
        speaker.rate = $(this).val();
      });
      speaker.lang = "zh-CN";
      speaker.pitch = 1.24;
      speaker.voiceURI =
        voice === "" ? "Microsoft Huihui - Chinese (Simplified, PRC)" : voice;

      var reading = setInterval(function () {
        if (!window.speechSynthesis.speaking && flag <= newCountPara) {
          speaker.text = storyAllRead[flag];
          window.speechSynthesis.speak(speaker);
          flag += 1;

          // 朗读段落文字选中效果
          var referenceNode = document
            .getElementsByTagName("main p")
            .item(flag - 1);
          // 起点网朗读效果，当前朗读段落文字变红
          $("main p")
            .eq(flag - 1)
            .css("color", "red");
          $("html,body").animate(
            {
              scrollTop:
                $("main p")
                  .eq(flag - 1)
                  .offset().top -
                document.documentElement.clientHeight * 0.382
            },
            300 /*scroll实现定位滚动*/
          ); //代码参考，感谢：https://blog.csdn.net/qq_30109365/article/details/86592336
          if (flag - 1) {
            $("main p")
              .eq(flag - 2)
              .css("color", "black");
          }
        } else if (flag > newCountPara) {
          // 朗读结束

          window.speechSynthesis.cancel();
          clearInterval(reading);

          selection.removeAllRanges();
          flag = 0;

          $("main p")
            .eq(flag - 1)
            .css("color", "black");
          $("main p").eq(flag).css("color", "black");
          alert("本章已读完。");
        }
      }, 300);

      // 后台复制文章内容到剪贴板
      var copyStory = document.createElement("textarea"); //创建textarea对象
      copyStory.id = "copyArea";
      $("main").prepend(copyStory); //添加元素

      var storyTitle = $(".title")
        .contents()
        .filter(function () {
          return this.nodeType === 3; // 过滤掉非文本节点
        })
        .text();

      copyStory.value = storyTitle + "\n" + newStoryArr.join("\n"); // 组合文章标题
      copyStory.focus();
      if (copyStory.setSelectionRange) {
        copyStory.setSelectionRange(0, copyStory.value.length); //获取光标起始位置到结束位置
      } else {
        copyStory.select();
      }
      document.execCommand("Copy", "false", null); //执行复制
      if (document.execCommand("Copy", "false", null)) {
        console.log(
          "已复制文章到剪贴板！Success,The story  has been copied to clipboard！--yoursatan"
        );
      }
      $("#copyArea").remove(); //删除元素

      // 监听键盘：Esc/F5
      $(document).keyup(function (event) {
        if (event.keyCode == 27 || event.keyCode == 116) {
          window.speechSynthesis.cancel();
          clearInterval(reading);
          selection.removeAllRanges();
          if (
            // https://read.qidian.com/chapter/ 网站支持
            window.location.href.indexOf("https://read.qidian.com/chapter/") >
              -1 ||
            window.location.href.indexOf("https://www.qidian.com/chapter/") > -1
          ) {
            $("main p")
              .eq(flag - 1)
              .css("color", "black");
          }
          flag = 0;
        }
      });

      // 监听键盘：空格键
      $(document).keypress(function (event) {
        event.preventDefault();
        if (event.keyCode == 32) {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
          }
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }
      });

      // 监听标签关闭事件
      window.onbeforeunload = function (e) {
        clearInterval(reading);
        window.speechSynthesis.cancel();
      };
    };
    readStory();
  });
})();

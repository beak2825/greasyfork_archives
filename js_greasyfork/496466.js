// ==UserScript==
// @name         uniapp插件无广告下载导入(Dclound插件下载)
// @namespace    https://dreamlove.top
// @license MIT
// @version      1.0
// @description  旨在帮助用户在无法看广告的情况下跳过广告直接下载
// @author       QiuYe
// @match        https://ext.dcloud.net.cn/plugin?*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACGUlEQVQ4jX2TXYgPYRTGfzu7KN8T0bJ7haYUtcooIqFeM9m40EZqXG1t2im1Co1Lbyjc/CW1d1OyF1z4aN6dkjYbaaREbbZ8tlplafN1gVidnNW/Je/NTO85z/Oe8zznNDDlhHESAp3ARuCHRhuBQaC3KvKqHvGHIIyTucAFoAU4BdysivyrxmYA24DDwGugqyryjxLz6sD9wIOqyDf5aXDPT4N2iRlnF/tpsMtPg9sSkxzJVcxvAn35SlXkZ4yze4BnwGmNLQT6gBHj7F7JAS4rBk97blGw9H0RmAfMUYIv+pW7c8bZ1qrIzwJLwzhZ56lgJ42z04A7QLu2M6bA98BT4DiwrIyyEb0XnTobwjgZAtr8NNiv4O4yyl4ZZ0X5ReJEGWVvVY/ZCrw2XhseAB5KBROq9mpgBzBknN0JrABeAs+Ns83G2bXAY+AAsFUxP5uEYEqv8tooMAuYDjTp/xKtSM5M/U54KqT4fAs4D6wqo+x+GWVi13pxGXhRRtlVYCVwA3gUxomQe6JBr1rYr33OB3oAsXNNGWWfjLNPhASoqcCN47XhLcBuqUAIjii4VWfgGLAcWFA3C9uB68CGMsq+A0cF6+lsj4ZxclAt6gY+KFB6l/NZ7/aVUTYouYIR7OQkdgEdSnIJkEqkhXcaP6Qz0KfgDsX8c5magRPAQFXk3zQmgm3Wst/UL9P/1lkcmLRY8u7+tc7AL5BhyngPO/ubAAAAAElFTkSuQmCC
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @resource     jQueryUICSS https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @downloadURL https://update.greasyfork.org/scripts/496466/uniapp%E6%8F%92%E4%BB%B6%E6%97%A0%E5%B9%BF%E5%91%8A%E4%B8%8B%E8%BD%BD%E5%AF%BC%E5%85%A5%28Dclound%E6%8F%92%E4%BB%B6%E4%B8%8B%E8%BD%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496466/uniapp%E6%8F%92%E4%BB%B6%E6%97%A0%E5%B9%BF%E5%91%8A%E4%B8%8B%E8%BD%BD%E5%AF%BC%E5%85%A5%28Dclound%E6%8F%92%E4%BB%B6%E4%B8%8B%E8%BD%BD%29.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const $ = jQuery.noConflict(true);
  // 添加jQuery UI的CSS样式
  var link = document.createElement("link");
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
  document.getElementsByTagName("head")[0].appendChild(link);

  // 创建导入按钮
  function createInputButton() {
    // 创建按钮元素
    var $newButton = $(
      '<button id="import-button-qiuye"><span class="icon">📥</span>(免广告)导入插件</button>'
    );

    // 设置按钮的样式
    $newButton.css({
      width: "240px",
      "background-color": "#28a745", // 绿色背景
      color: "white", // 白色文字
      padding: "10px 20px", // 内边距
      border: "none", // 无边框
      "border-radius": "20px", // 圆角
      "font-size": "16px", // 字体大小
      cursor: "pointer", // 鼠标悬停时显示为指针
      display: "flex", // 使用flex布局
      "align-items": "center", // 垂直居中对齐
      "justify-content": "center", // 水平居中对齐
      margin: "10px", // 添加一些外边距
    });

    // 设置图标的样式
    $newButton.find(".icon").css({
      "margin-right": "10px", // 图标与文字之间的间距
      "font-size": "18px", // 图标字体大小
    });

    // 添加按钮悬停和点击时的样式
    $newButton.hover(
      function () {
        $(this).css("background-color", "#218838"); // 更深的绿色
      },
      function () {
        $(this).css("background-color", "#28a745"); // 恢复原始绿色
      }
    );

    $newButton.mousedown(function () {
      $(this).css("background-color", "#1e7e34"); // 更深的绿色
    });

    $newButton.mouseup(function () {
      $(this).css("background-color", "#218838"); // 恢复悬停绿色
    });

    return $newButton;
  }

  // 创建下载按钮
  function createDownloadButton() {
    // 创建按钮元素
    var $button = $(
      '<button id="download-button-qiuye"><span class="icon">⬇️</span>(免广告)下载插件ZIP</button>'
    );

    // 设置按钮的样式
    $button.css({
      width: "240px",
      "background-color": "#007bff", // 蓝色背景
      color: "white", // 白色文字
      padding: "10px 20px", // 内边距
      border: "none", // 无边框
      "border-radius": "20px", // 圆角
      "font-size": "16px", // 字体大小
      cursor: "pointer", // 鼠标悬停时显示为指针
      display: "flex", // 使用flex布局
      "align-items": "center", // 垂直居中对齐
      "justify-content": "center", // 水平居中对齐
      margin: "10px", // 添加一些外边距
    });

    // 设置图标的样式
    $button.find(".icon").css({
      "margin-right": "10px", // 图标与文字之间的间距
      "font-size": "18px", // 图标字体大小
    });

    // 添加按钮悬停和点击时的样式
    $button.hover(
      function () {
        $(this).css("background-color", "#0069d9"); // 更深的蓝色
      },
      function () {
        $(this).css("background-color", "#007bff"); // 恢复原始蓝色
      }
    );

    $button.mousedown(function () {
      $(this).css("background-color", "#0056b3"); // 更深的蓝色
    });

    $button.mouseup(function () {
      $(this).css("background-color", "#0069d9"); // 恢复悬停蓝色
    });

    return $button;
  }

  // 从 plugin-id 元素的 span 标签中提取插件ID
  function getPluginId() {
    var pluginIdText = $(".plugin-id span").text();
    var match = pluginIdText.match(/插件ID：(.+)/);
    return match ? match[1] : null;
  }

  // 从类名为 "plugin-name" 下的 h3 标签获取文本内容
  function getTextFromPluginName() {
    // 选择类名为 "plugin-name" 下的 h3 标签，并获取其文本内容
    var text = $(".plugin-name h3")
      .text()
      .replace(/[\n\s]/g, ""); // 获取文本并去除首尾空格和换行符
    return text; // 返回提取到的文本内容
  }

  // 选择类名为 "plugin-more-info" 的最后一个 div 元素，并获取其文本内容
  function getVersionFromPluginMoreInfo() {
    var text = $(".plugin-more-info div:last-of-type").text(); // 获取文本并去除首尾空格和换行符
    // 使用正则表达式匹配 "版本：" 后面的内容
    var match = text.match(/版本：(.+)/);
    // 如果匹配成功，则返回匹配到的版本号，否则返回空字符串
    return match ? match[1] : "";
  }

  function getSizeFromPluginSize() {
    // 选择类名为 "plugin-size" 的 span 元素，并获取其文本内容
    var text = $(".plugin-size span").text().trim(); // 获取文本并去除首尾空格和换行符
    // 使用正则表达式匹配体积大小
    var match = text.match(/插件包体积：(.+)/);
    // 如果匹配成功，则返回匹配到的体积大小，否则返回空字符串
    return match ? match[1] : "";
  }
  function getImageSrcWithRegex(regex = /\w+-\w+-\w+-\w+-\w+/) {
    var matchingPart = null; // 初始化一个变量来保存匹配到的部分内容

    $("img").each(function () {
      var src = $(this).attr("src");
      var match = src.match(regex);
      if (match) {
        // 匹配到特定格式的内容
        matchingPart = match[0]; // 将匹配到的部分内容保存到matchingPart变量中
        return false; // 中断循环
      }
    });

    // 返回匹配到的部分内容
    if (matchingPart !== null) {
      // 如果匹配到了内容，去除末尾的 "_0"
      matchingPart = matchingPart.slice(0, -2);
    }
    return matchingPart;
  }

  // 导入函数
  function executeImportFunction() {
    var baseURL = "hbuilderx://requestExtension/uni_modules?plugin";
    var uidPlug = getImageSrcWithRegex();
    var pluginId = getPluginId();
    var namePlug = getTextFromPluginName();
    var versionPlug = getVersionFromPluginMoreInfo();
    var sizePlug = getSizeFromPluginSize();
    console.log(
      "222222222222222",
      uidPlug,
      pluginId,
      namePlug,
      versionPlug,
      sizePlug
    );
    if (!pluginId) {
      alert("无法获取插件ID");
      return;
    }
    if (!namePlug) {
      alert("无法获取插件名称");
      return;
    }
    if (!versionPlug) {
      alert("无法获取插件版本");
      return;
    }
    if (!sizePlug) {
      alert("无法获取插件包体积");
      return;
    }
    if (!uidPlug) {
      alert("无法获取插件UID,插件可能是免费的");
      return;
    }
    var params = {
      id: pluginId,
      name: namePlug,
      version: versionPlug,
      download_url: `https://ext-resource-t.dcloud.net.cn/marketplace/${uidPlug}/${versionPlug}/plugin.zip`,
      size: sizePlug,
      category_id: 21,
      description: "",
      platforms: [],
      is_uniModules: 1,
      extends: false,
      type: "source",
      is_free: 1,
      is_uniappx: 0,
      only_uniappx: 0,
    };
    var url = baseURL + "=" + encodeURIComponent(JSON.stringify(params));
    console.log("创建的url", url);
    var $a = $("<a>", {
      href: url, // 确保 URL 是完整的
      target: "_blank", // 在新标签页中打开
    });

    // 将 <a> 标签添加到 body 中
    $a.appendTo("body");

    // 使用原生的 JavaScript click 方法触发点击事件
    $a[0].click();

    // 移除 <a> 标签
    $a.remove();
  }

  // 下载函数
  function executeDownloadFunction() {
    var uidPlug = getImageSrcWithRegex();
    var versionPlug = getVersionFromPluginMoreInfo();
    if (!uidPlug) {
      alert("无法获取插件UID,插件可能是免费的");
      return;
    }
    if (!versionPlug) {
      alert("无法获取插件版本");
      return;
    }
    var url = `https://ext-resource-t.dcloud.net.cn/marketplace/${uidPlug}/${versionPlug}/plugin.zip`;
    var $a = $("<a>", {
      href: url, // 确保 URL 是完整的
      target: "_blank", // 在新标签页中打开
    });

    // 将 <a> 标签添加到 body 中
    $a.appendTo("body");

    // 使用原生的 JavaScript click 方法触发点击事件
    $a[0].click();

    // 移除 <a> 标签
    $a.remove();
  }
  // 等待页面加载完成
  $(document).ready(function () {
    var $newButton = createInputButton(); // 创建导入按钮
    var $downloadButton = createDownloadButton(); // 创建下载按钮

    $newButton.prependTo(".banner .download");
    $downloadButton.prependTo(".banner .download");
    // 创建对话框的div元素
    var $dialog = $("<div>", {
      id: "confirmDialog",
      title: "是否继续操作",
      text: "本插件目的是为了避免广告看不到导致无法下载插件的问题,如果有空,请尽量看广告支持作者!(确认后插件只显示一次)",
    })
      .appendTo("body")
      .dialog({
        autoOpen: false,
        modal: true,
        buttons: {
          确认: function () {
            $(this).dialog("close");
            localStorage.setItem("dcloud__confirm__read", "true");
            executeImportFunction();
          },
          取消: function () {
            $(this).dialog("close");
          },
        },
      });

    // 导入按钮点击事件
    $("#import-button-qiuye").click(function () {
      if (localStorage.getItem("dcloud__confirm__read") === "true") {
        // 如果localStorage中已经存储了确认信息，直接执行函数
        executeImportFunction();
      } else {
        // 否则显示确认对话框
        $("#confirmDialog").dialog("open");
      }
    });

    // 下载按钮点击事件
    $("#download-button-qiuye").click(function () {
      if (localStorage.getItem("dcloud__confirm__read") === "true") {
        // 如果localStorage中已经存储了确认信息，直接执行函数
        executeDownloadFunction();
      } else {
        // 否则显示确认对话框
        $("#confirmDialog").dialog("open");
      }
    });
  });
})();

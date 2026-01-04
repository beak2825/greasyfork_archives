// ==UserScript==
// @name         保国逛色花
// @namespace    https://www.sehuatang.net
// @version      100.8
// @description  最好用的98堂(原色花堂)脚本 高级搜索 自动签到 快速复制 快速评分 划词搜索 图片预览 快速收藏
// @author       性感风骚马保国
// @match        *://*.sehuatang.net/*
// @match        *://*.sehuatang.org/*
// @match        *://*.sehuatang.*/*
// @match        *://*.jq2t4.com/*
// @match        *://*.0krgb.com/*
// @match        *://*.xxjsnc.co/*
// @match        *://*.o4vag.com/*
// @match        *://*.weterytrtrr.*/*
// @match        *://*.qweqwtret.*/*
// @match        *://*.retreytryuyt.*/*
// @match        *://*.qwerwrrt.*/*
// @match        *://*.ds5hk.app/*
// @match        *://*.30fjp.com/*
// @match        *://*.18stm.cn/*
// @match        *://*.xo6c5.com/*
// @match        *://*.mzjvl.com/*
// @match        *://*.9xr2.app/*
// @match        *://*.kzs1w.com/*
// @match        *://*.nwurc.com/*
// @match        *://*.zbkz6.app/*
// @match        *://*.ql75t.cn/*
// @match        *://*.0uzb0.app/*
// @match        *://*.d2wpb.com/*
// @match        *://*.5aylp.com/*
// @match        *://*.8otvk.app/*
// @match        *://*.05kx.cc/*
// @match        *://*.1yxg2.com/*
// @match        *://*.6r5gy.co/*
// @match        *://*.mmpbg.co/*
// @match        *://*.kofqo.com/*
// @match        *://*.kofqo.net/*
// @match        *://*.5rmt2.net/*
// @match        *://*.n8cv.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/494839/%E4%BF%9D%E5%9B%BD%E9%80%9B%E8%89%B2%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/494839/%E4%BF%9D%E5%9B%BD%E9%80%9B%E8%89%B2%E8%8A%B1.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  /* global showWindow */
  /* global stopRandomSelection */
  /* global setanswer */

  // #region 全局变量

  /**
   * activeTooltips: 用于记录当前页面中活动的工具提示数量。这可以用于管理和控制页面上显示的提示。
   */
  let activeTooltips = 0;

  /**
   * DEFAULT_TID_OPTIONS: 存储默认的板块列表。
   * 每个板块都有一个唯一的value和一个对应的label。
   * 这个常量可以被用于下拉列表、搜索过滤等。
   */
  const DEFAULT_TID_OPTIONS = [
    { value: 95, label: "综合区" },
    { value: 166, label: "AI区" },
    { value: 141, label: "原创区" },
    { value: 142, label: "转帖区" },
    { value: 96, label: "投诉区" },
    { value: 97, label: "出售区" },
    { value: 143, label: "悬赏区" },
    { value: 2, label: "国产原创" },
    { value: 36, label: "亚洲无码" },
    { value: 37, label: "亚洲有码" },
    { value: 103, label: "中文字幕" },
    { value: 107, label: "三级写真" },
    { value: 160, label: "VR视频区" },
    { value: 104, label: "素人有码" },
    { value: 38, label: "欧美无码" },
    { value: 151, label: "4K原版" },
    { value: 152, label: "韩国主播" },
    { value: 39, label: "动漫原创" },
    { value: 154, label: "文学区原创人生" },
    { value: 135, label: "文学区乱伦人妻" },
    { value: 137, label: "文学区青春校园" },
    { value: 138, label: "文学区武侠玄幻" },
    { value: 136, label: "文学区激情都市" },
    { value: 139, label: "文学区TXT下载" },
    { value: 145, label: "原档自提字幕区" },
    { value: 146, label: "原档自译字幕区" },
    { value: 121, label: "原档字幕分享区" },
    { value: 159, label: "原档新作区" },
    { value: 41, label: "在线国产自拍" },
    { value: 109, label: "在线中文字幕" },
    { value: 42, label: "在线日韩无码" },
    { value: 43, label: "在线日韩有码" },
    { value: 44, label: "在线欧美风情" },
    { value: 45, label: "在线卡通动漫" },
    { value: 46, label: "在线剧情三级" },
    { value: 155, label: "图区原创自拍" },
    { value: 125, label: "图区转帖自拍" },
    { value: 50, label: "图区华人街拍" },
    { value: 48, label: "图区亚洲性爱" },
    { value: 49, label: "图区欧美性爱" },
    { value: 117, label: "图区卡通动漫" },
    { value: 165, label: "图区套图下载" },
  ];

  /**
   * baseURL: 获取当前页面的主机URL，用于构建其他URL。
   */
  const baseURL = `https://${window.location.host}`;

  // #endregion

  // #region 获取用户设置

  /**
   * 获取用户设置。
   * 从用户脚本的存储中检索各种设置，并为每个设置返回其值或默认值。
   * 这些设置可以用于改变脚本的行为、外观和功能。
   *
   * @returns {Object} 返回一个对象，该对象包含了所有的用户设置。
   */
  function getSettings() {
    /**
     * 从脚本存储中获取JSON值。
     * 如果检索到的值不是有效的JSON，则返回默认值。
     *
     * @param {string} key - 存储的键名。
     * @param {string} defaultValue - 如果无法检索到或解析值，则返回的默认JSON值。
     * @returns {any} 返回解析的JSON值或默认值。
     */
    const getJSONValue = (key, defaultValue) => {
      const value = GM_getValue(key, defaultValue);
      try {
        return JSON.parse(value);
      } catch {
        return JSON.parse(defaultValue);
      }
    };

    return {
      logoText: GM_getValue("logoText", "保国爱你"), // 评分文字和特效文字
      tipsText: GM_getValue("tipsText", "马保国友情提示"), // 评分文字和特效文字
      imageSize: GM_getValue("imageSize", "50px"), // 图片的大小
      imageUrl: GM_getValue(
        "imageUrl",
        "/uc_server/data/avatar/000/46/26/94_avatar_big.jpg"
      ), // 图片的URL
      blockMedals: GM_getValue("blockMedals", 0), // 是否阻止显示勋章
      resizeMedals: GM_getValue("resizeMedals", 0), // 是否调整勋章的大小
      replaceMedals: GM_getValue("replaceMedals", 0), // 是否替换勋章
      excludeGroup: getJSONValue("excludeGroup", "[]"), // 要排除的组
      TIDGroup: getJSONValue("TIDGroup", "[]"), // TID分组
      displayBlockedTips: GM_getValue("displayBlockedTips", true), // 是否显示消息
      autoPagination: GM_getValue("autoPagination", true), // 是否开启自动分页
      showImageButton: GM_getValue("showImageButton", "hide"), // 是否显示图片按钮
      lastCheckedUpdate: GM_getValue("lastCheckedUpdate", 0), // 最后一次检查更新的时间
      enableTitleStyle: GM_getValue("enableTitleStyle", true), // 是否启用标题样式
      titleStyleSize: GM_getValue("titleStyleSize", 20), // 标题字体大小
      titleStyleWeight: GM_getValue("titleStyleWeight", 700), // 标题字体粗细

      excludeOptions: GM_getValue("excludeOptions", [
        "度盘",
        "夸克",
        "内容隐藏",
        "搬运",
        "SHA1",
      ]), // 要排除的选项
      excludePostOptions: GM_getValue("excludePostOptions", ["度盘", "夸克"]), // 要排除的选项
      blockedUsers: GM_getValue("blockedUsers", [
        "老灯法师",
        "树根520",
        "豪大大鸡排",
        "林哲",
        "aa142150",
        "如果有重来",
        "Lcc123456cc",
      ]), // 被屏蔽的用户
      orderFids: getJSONValue("orderFids", "[]"), // FID的顺序
      showAvatar: GM_getValue("showAvatar", true), // 是否显示用户头像
      maxGradeThread: GM_getValue("maxGradeThread", 10),
      defaultSwipeToSearch: GM_getValue("defaultSwipeToSearch", true), // 是否开启划词搜索
      displayThreadImages: GM_getValue("displayThreadImages", false),
      displayThreadBuyInfo: GM_getValue("displayThreadBuyInfo", true), ///帖子是否显示购买次数
      isShowWatermarkMessage: GM_getValue("isShowWatermarkMessage", true),
      showDown: GM_getValue("showDown", true), // 是否显示下载附件
      showCopyCode: GM_getValue("showCopyCode", true), // 是否显示复制代码
      showFastPost: GM_getValue("showFastPost", true), // 是否显示快速发帖
      showFastReply: GM_getValue("showFastReply", true), // 是否显示快速回复
      showQuickGrade: GM_getValue("showQuickGrade", true), // 是否显示快速评分
      showQuickStar: GM_getValue("showQuickStar", true), // 是否显示快速收藏
      showClickDouble: GM_getValue("showClickDouble", true), // 是否显示一键二连
      showViewRatings: GM_getValue("showViewRatings", true), // 是否显示查看评分
      showPayLog: GM_getValue("showPayLog", true), // 是否显示购买记录
      showFastCopy: GM_getValue("showFastCopy", true), // 是否显示复制帖子
      blockingResolved: GM_getValue("blockingResolved", true), // 是否显示屏蔽解决
      isOnlyShowMoney: GM_getValue("isOnlyShowMoney", false), // 是否只显示现金帖
      blockingIndex: GM_getValue("blockingIndex", false), // 是否屏蔽首页热门
      qiandaoTip: GM_getValue("qiandaoTip", true), // 是否显示签到提示
      menuButtonIsVisible: GM_getValue("menuButtonIsVisible", true), // 是否显示按钮容器
    };
  }

  // #endregion

  // #region 样式

  /**
   * 添加自定义样式到页面中。
   * 此函数会创建一个<style>元素，并定义了一些自定义的CSS样式，然后将其添加到文档的头部。
   */

  function addStyles() {
    // 创建一个新的<style>元素
    const style = document.createElement("style");

    // 定义我们需要的自定义样式
    style.innerHTML = `

            /* --- 通用自定义按钮的样式 --- */
            .bgsh-customBtn, .bgsh-searchBtn, .bgsh-quickTopicadminToPostBtn, .bgsh-quickReplyToPostBtn,.bgsh-QuickMiscReportBtn,.bgsh-quickReportadToPostBtn,.bgsh-quickGradeToPostBtn ,.bgsh-openAllUrlBtn,.bgsh-fastPMButtonBtn,.bgsh-quickReplyEditToPostBtn,.bgsh-setAnswerToPostBtn {
              padding: 8px 15px;

              margin-bottom: 8px;
              margin-right: 8px;
              width: 100%;
              border: none;
              outline: none;
              white-space: pre-line; /* 保留换行符，但仍然合并连续的空白 */
              border-radius: 8px;
              font-size: 13px;
              font-weight: 500;
              color: #ffffff;
              cursor: pointer;
              box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #BC78EC;
              transition: 0.8s;
            }

            /* quickTopicadminToPostBtn按钮的设置 */
            .bgsh-quickTopicadminToPostBtn ,.bgsh-quickReplyToPostBtn,.bgsh-quickReplyEditToPostBtn,.bgsh-setAnswerToPostBtn{
              width: auto;
              float: right;
              box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #C346C2;
            }

            /* quickGradeToPostBtn按钮的设置 */
            .bgsh-quickGradeToPostBtn,.bgsh-QuickMiscReportBtn,.bgsh-quickReportadToPostBtn {
              width: auto;
              float: left;
              box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #EA5455;

            }
            /* quickGradeToPostBtn按钮的设置 */
            .bgsh-fastPMButtonBtn {
              width: auto;
              float: left;
              box-shadow: -5px -5px 8px #F6CEEC, 5px 5px 8px #EA5455;

            }
            /* openAllUrlBtn按钮的设置 */
            .bgsh-openAllUrlBtn {
              width: 100px;
              font-size: 16px;
              padding: 0;
              box-shadow: 0 0px 0px #ccc;
            }

            /* 按钮的最大宽度设置 */
            .bgsh-searchBtn {
              max-width: 400px;
              background-color: #0D25B9;
            }

            /* 按钮的悬停效果 */
            .bgsh-customBtn:hover {
              transform: scale(1.05);
              background-color: #ABDCFF;
              box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC;
            }

            /* 按钮的悬停效果 */
            .bgsh-searchBtn:hover {
              transform: scale(1.05);
              background-color: #5961F9;
              box-shadow: inset 5px 5px 10px #7367F0, inset -5px -5px 10px #CE9FFC;
            }

            /* 按钮的悬停效果 */
            .bgsh-quickTopicadminToPostBtn:hover ,.bgsh-quickReplyToPostBtn:hover ,.bgsh-QuickMiscReportBtn:hover,.bgsh-quickReportadToPostBtn:hover,.bgsh-fastPMButtonBtn:hover,.bgsh-quickReplyEditToPostBtn:hover,.bgsh-setAnswerToPostBtn:hover{
              transform: scale(1.05);
              background-color: #32CCBC;
              box-shadow: inset 5px 5px 10px #1D6FA3, inset -5px -5px 10px #65FDF0;
            }

            /* 按钮的悬停效果 */
            .bgsh-quickGradeToPostBtn:hover {
              transform: scale(1.05);
              background-color: #FDD819;
              box-shadow: inset 5px 5px 10px #E96D71, inset -5px -5px 10px #FAD7A1;
            }

            /* --- 自定义的搜索框样式 --- */
            .advanced-search {
              position: fixed;
              right: calc(150px + 1vh);
              top: 100px;
              z-index: 1000;
              background: #fff;
              border: 1px solid #ddd;
              padding: 10px;
              display: grid; /* 使用网格布局 */
              grid-template-columns: auto auto; /* 两列的宽度根据内容自适应 */
              column-gap: 20px; /* 列之间的间隙 */
            }

            /* 添加间距 */
            .advanced-search .bgsh-forget {
              max-height: 580px; /* 设置最大高度限制 */
              overflow: visible; /* 确保超出部分内容可见 */
              display: flex;
              flex-wrap: wrap;
              flex-direction: column;

            }

            /* --- 复选框样式 --- */
            .bgsh-forget .bgsh-checkbox-label {
              display: block;
              position: relative;
              cursor: pointer;
              font-size: 22px;
              line-height: 22px;
              margin-right: 10px;
            }
            .bgsh-label-text {
              display: inline-block;
              font-weight: 500;
              left: 12%;
              font-size: 13px;
            }
            .bgsh-forget .bgsh-checkbox-label input {
              opacity: 0;
              cursor: pointer;
            }

            /* 复选框的自定义样式 */
            .bgsh-checkbox-label .bgsh-checkbox-custom {
              position: absolute;
              top: 0;
              left: 0;
              height: 20px;
              width: 20px;
              background-color: #ecf0f3;
              border-radius: 5px;
              border: none;
              box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #fff;
            }

            /* 复选框选中状态样式 */
            .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom {
              box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f;
            }

            /* 复选框标志样式 */
            .bgsh-checkbox-label .bgsh-checkbox-custom::after {
              position: absolute;
              content: "";
              left: 10px;
              top: 10px;
              height: 0;
              width: 0;
              border-radius: 5px;
              border: solid #635f5f;
              border-width: 0 3px 3px 0;
              transform: rotate(0deg) scale(0);
              opacity: 1;
              transition: all 0.3s ease-out;
            }

            /* 复选框选中状态下的标志样式 */
            .bgsh-checkbox-label input:checked ~ .bgsh-checkbox-custom::after {
              transform: rotate(45deg) scale(1);
              left: 7px;
              top: 3px;
              width: 4px;
              height: 8px;
            }

            /* 自定义复选框的indeterminate标志样式 */
            .bgsh-checkbox-label .bgsh-checkbox-custom::before {
              position: absolute;
              content: "";
              left: 5px;
              top: 9px;
              width: 10px;
              height: 2px;
              background-color: #635f5f;
              opacity: 0;
              transition: opacity 0.3s ease-out;
            }

            /* 当复选框处于indeterminate状态时的样式 */
            .bgsh-checkbox-label input:indeterminate ~ .bgsh-checkbox-custom::before {
              opacity: 1;
            }

            .bgsh-dateInput {
              border: 1px solid #d4d4d4;        /* 边框 */
              border-radius: 5px;               /* 圆角 */
              background-color: #fff;           /* 背景颜色 */
              transition: border 0.3s;          /* 过渡效果 */
              margin: 0 5px;                    /* 左右边距 */
              width: 150px;                     /* 设定宽度 */
          }

          /* 聚焦时的样式 */
          .bgsh-dateInput:focus {
              border-color: #007BFF;            /* 聚焦时的边框颜色 */
              outline: none;                    /* 去除默认的轮廓 */
              box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* 聚焦时的阴影效果 */
          }

          /* 鼠标悬浮时的样式 */
          .bgsh-dateInput:hover {
              border-color: #b3b3b3;            /* 鼠标悬浮时的边框颜色 */
          }

          .bgsh-watermark-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none; /* 确保水印不会阻止按钮点击等交互 */
        }

        .bgsh-watermark-text {
            position: absolute;
            text-align: center;
            font-size: 30px;
            color: red;
            font-weight: bold;
            overflow: hidden;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row; /* 改为行方向 */
        }

        .bgsh-watermark-text .icon {
            width: 30px;
            height: 30px;
            fill: red;
            margin: 0 5px; /* 修改图标的间距 */
        }


          `;

    // 将<style>元素添加到文档的头部
    document.head.appendChild(style);
  }

  // #endregion

  // #region 消息提示

  /**
   * 在页面中显示一个淡出的提示消息。
   * 使用该函数可以在页面中临时显示一个提示消息，该消息在一段时间后会自动淡出并消失。
   *
   * @param {string} message - 需要显示的提示消息内容。
   */
  function showTooltip(message) {
    const tooltip = document.createElement("span");

    // 设定提示消息的初始样式
    const tooltipStyles = {
      position: "fixed",
      top: `calc(33.33% + ${activeTooltips * 80}px)`,
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#333",
      color: "#fff",
      padding: "20px 40px",
      borderRadius: "10px",
      zIndex: "1000",
      transition: "opacity 0.5s",
      fontSize: "24px",
      opacity: "1", // 默认透明度为1
    };
    var settings = getSettings();
    Object.assign(tooltip.style, tooltipStyles); // 使用Object.assign将样式批量应用到元素上
    tooltip.innerText = `${settings.tipsText}:` + message;
    document.body.appendChild(tooltip);

    activeTooltips++;

    // 淡出效果函数
    const fadeOut = (element, duration = 500) => {
      let opacity = 1;
      const timer = setInterval(function () {
        opacity -= 50 / duration;
        if (opacity <= 0) {
          clearInterval(timer);
          element.style.display = "none"; // or "hidden", depending on the desired final state
        } else {
          element.style.opacity = opacity;
        }
      }, 50);
    };

    setTimeout(() => {
      fadeOut(tooltip);
      setTimeout(() => {
        document.body.removeChild(tooltip);
        activeTooltips--;
      }, 500);
    }, 2000);
  }
  // #endregion

  // #region Tampermonkey 菜单命令注册
  /**
   * 注册一个命令到Tampermonkey的上下文菜单，允许用户访问“保国逛色花”的设置界面。
   */
  GM_registerMenuCommand("保国逛色花设置", () => {
    createSettingsUI(getSettings());
  });
  // #endregion

  // #region 设置界面HTML构造

  /**
   * 生成“保国逛色花”设置界面的HTML内容
   * @param {Object} settings - 当前的设置数据
   * @returns {string} - 设置界面的HTML字符串
   */
  function generateSettingsHTML(settings) {
    return `
            <div class='bgsh-setting-box'>
                <div class='bgsh-setting-box-container '>
                    <div class="bgsh-setting-first">

                        <label for="tipsText">提示文字</label>
                        <input type="text" id="tipsTextInput" value="${
                          settings.tipsText
                        }">
                        <br>
                        <label for="logoText">评分/特效文字</label>
                        <input type="text" id="logoTextInput" value="${
                          settings.logoText
                        }">
                        <br>
                        <label for="imageSize">勋章尺寸：</label>
                        <input type="text" id="imageSizeInput" value="${
                          settings.imageSize
                        }">
                        <br>
                        <label for="imageUrl">替换勋章图片链接：</label>
                        <input type="text" id="imageUrlInput" value="${
                          settings.imageUrl
                        }">
                        <br>
                        <label for="maxGradeThread">主贴评分最大值:</label>
                        <input type="number" id="maxGradeThread" value="${
                          settings.maxGradeThread
                        }">
                        <br>
                        <!--勋章隐藏设置-->
                        <fieldset>
                            <label>隐藏勋章</label>
                            <br>
                            <label>
                                <input type="radio" name="blockMedals" value="0" ${
                                  settings.blockMedals === 0 ? "checked" : ""
                                }>
                                不隐藏
                            </label>
                            <label>
                                <input type="radio" name="blockMedals" value="1" ${
                                  settings.blockMedals === 1 ? "checked" : ""
                                }>
                                隐藏所有
                            </label>
                            <label>
                                <input type="radio" name="blockMedals" value="2" ${
                                  settings.blockMedals === 2 ? "checked" : ""
                                }>
                                隐藏女优勋章
                            </label>
                        </fieldset>
                        <!--勋章尺寸修改设置-->
                        <fieldset>
                            <label>修改勋章尺寸</label>
                            <br>
                            <label>
                                <input type="radio" name="resizeMedals" value="0" ${
                                  settings.resizeMedals === 0 ? "checked" : ""
                                }>
                                不修改
                            </label>
                            <label>
                                <input type="radio" name="resizeMedals" value="1" ${
                                  settings.resizeMedals === 1 ? "checked" : ""
                                }>
                                修改所有
                            </label>
                            <label>
                                <input type="radio" name="resizeMedals" value="2" ${
                                  settings.resizeMedals === 2 ? "checked" : ""
                                }>
                                修改女优勋章
                            </label>
                        </fieldset>
                        <!--勋章替换设置-->
                        <fieldset>
                            <label>替换勋章</label>
                            <br>
                            <label>
                                <input type="radio" name="replaceMedals" value="0" ${
                                  settings.replaceMedals === 0 ? "checked" : ""
                                }>
                                不替换
                            </label>
                            <label>
                                <input type="radio" name="replaceMedals" value="1" ${
                                  settings.replaceMedals === 1 ? "checked" : ""
                                }>
                                替换所有
                            </label>
                            <label>
                                <input type="radio" name="replaceMedals" value="2" ${
                                  settings.replaceMedals === 2 ? "checked" : ""
                                }>
                                替换女优勋章
                            </label>
                        </fieldset>
                        <label class='bgsh-setting-checkbox-label' for="displayBlockedTipsCheckbox">
                            <input type='checkbox' id="displayBlockedTipsCheckbox" ${
                              settings.displayBlockedTips ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>显示黑名单屏蔽提示（每行一个）</span>
                            <br>
                            <span>提示:含黑名单用户和黑名单关键字</span>
                            <br>
                        </label>
                        <label class='bgsh-setting-checkbox-label' for="enableTitleStyleCheckbox">
                            <input type='checkbox' id="enableTitleStyleCheckbox" ${
                              settings.enableTitleStyle ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用帖子标题样式</span>
                        </label>
                        <br>

                        <label for="titleStyleSize">字体大小</label>
                        <input type="text" id="titleStyleSizeInput" value="${
                          settings.titleStyleSize
                        }">
                        <br>

                        <label for="titleStyleWeight">字体粗细</label>
                        <input type="text" id="titleStyleWeightInput" value="${
                          settings.titleStyleWeight
                        }">



                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showAvatarCheckbox">
                            <input type='checkbox' id="showAvatarCheckbox" ${
                              settings.showAvatar ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>显示用户头像</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="autoPaginationCheckbox">
                            <input type='checkbox' id="autoPaginationCheckbox" ${
                              settings.autoPagination ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用自动翻页</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="defaultSwipeToSearchCheckbox">
                            <input type='checkbox' id="defaultSwipeToSearchCheckbox" ${
                              settings.defaultSwipeToSearch ? "checked" : ""
                            }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用划词搜索</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="displayThreadImagesCheckbox" >
                        <input type='checkbox' id="displayThreadImagesCheckbox" ${
                          settings.displayThreadImages ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用图片预览</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="displayThreadBuyInfoCheckbox" >
                        <input type='checkbox' id="displayThreadBuyInfoCheckbox" ${
                          settings.displayThreadBuyInfo ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>显示购买次数</span>
                        </label>
                        <br>



                        <label class='bgsh-setting-checkbox-label' for="isShowWatermarkMessageCheckbox">
                        <input type='checkbox' id="isShowWatermarkMessageCheckbox" ${
                          settings.isShowWatermarkMessage ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用点击特效</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showDownCheckbox">
                        <input type='checkbox' id="showDownCheckbox" ${
                          settings.showDown ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用下载附件</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showCopyCodeCheckbox">
                        <input type='checkbox' id="showCopyCodeCheckbox" ${
                          settings.showCopyCode ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用复制代码</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showFastPostCheckbox">
                        <input type='checkbox' id="showFastPostCheckbox" ${
                          settings.showFastPost ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用快速发帖</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showFastReplyCheckbox">
                        <input type='checkbox' id="showFastReplyCheckbox" ${
                          settings.showFastReply ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用快速回复</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showQuickGradeCheckbox">
                        <input type='checkbox' id="showQuickGradeCheckbox" ${
                          settings.showQuickGrade ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用快速评分</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showQuickStarCheckbox">
                        <input type='checkbox' id="showQuickStarCheckbox" ${
                          settings.showQuickStar ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用快速收藏</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showClickDoubleCheckbox">
                        <input type='checkbox' id="showClickDoubleCheckbox" ${
                          settings.showClickDouble ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用一键二连</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showViewRatingsCheckbox">
                        <input type='checkbox' id="showViewRatingsCheckbox" ${
                          settings.showViewRatings ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用查看评分</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showPayLogCheckbox">
                        <input type='checkbox' id="showPayLogCheckbox" ${
                          settings.showPayLog ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用购买记录</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="showFastCopyCheckbox">
                        <input type='checkbox' id="showFastCopyCheckbox" ${
                          settings.showFastCopy ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>启用复制帖子</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="blockingIndexCheckbox">
                        <input type='checkbox' id="blockingIndexCheckbox" ${
                          settings.blockingIndex ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>屏蔽首页热门</span>
                        </label>
                        <br>
                        <label class='bgsh-setting-checkbox-label' for="qiandaoTipCheckbox">
                        <input type='checkbox' id="qiandaoTipCheckbox" ${
                          settings.qiandaoTip ? "checked" : ""
                        }>
                            <span class='bgsh-setting-checkbox-custom'></span>
                            <span>签到提示</span>
                        </label>
                        <br>


                    </div>
                    <div class="bgsh-setting-second">
                        <!--高级搜索排除关键字设置-->
                        <label for="excludeOptionsTextarea">高级搜索排除关键字（每行一个）:</label>
                        <br>
                        <textarea id="excludeOptionsTextarea">${settings.excludeOptions.join(
                          "\n"
                        )}</textarea>
                        <br>
                        <!--黑名单用户名设置-->
                        <label for="blockedUsersList">黑名单屏蔽的用户名（每行一个）：</label>
                        <br>
                        <textarea id="blockedUsersList">${settings.blockedUsers.join(
                          "\n"
                        )}</textarea>
                        <br>
                        <!--帖子列表页黑名单关键字设置-->
                        <label for="excludePostOptionsTextarea">帖子列表页黑名单关键字（每行一个）:</label>
                        <br>
                        <textarea id="excludePostOptionsTextarea">${settings.excludePostOptions.join(
                          "\n"
                        )}</textarea>
                        <br>

                    </div>
                </div>

                <!--保存和关闭按钮-->
                <div class="bgsh-setting-button">
                    <button id="saveButton">保存</button>
                    <button id="closeButton">关闭</button>

                </div>
            </div>



        `;
  }

  // #endregion

  // #region 设置界面生成与事件绑定

  /**
   * 创建并显示设置界面
   * @param {Object} settings - 当前的设置数据
   */
  function createSettingsUI(settings) {
    // 若之前的设置界面存在，先进行移除
    const existingContainer = document.getElementById("settingsUIContainer");
    if (existingContainer) {
      existingContainer.remove();
    }

    // 添加设置界面的样式
    generateSettingsStyles();

    // 根据当前设置生成界面内容
    const containerHTML = generateSettingsHTML(settings);

    // 创建界面容器，并添加到页面
    const container = document.createElement("div");
    container.id = "settingsUIContainer";
    container.innerHTML = containerHTML;
    document.body.appendChild(container);

    // 为“保存”和“关闭”按钮绑定事件
    const saveButton = document.getElementById("saveButton");
    const closeButton = document.getElementById("closeButton");

    // 保存按钮点击后，保存设置并隐藏界面
    saveButton.addEventListener("click", function () {
      saveSettings(settings);
      container.style.display = "none";
    });

    // 关闭按钮点击后，直接隐藏界面
    closeButton.addEventListener(
      "click",
      () => (container.style.display = "none")
    );
  }

  // #endregion

  // #region 设置界面样式

  /**
   * 生成并应用设置界面的样式
   */
  function generateSettingsStyles() {
    const style = `
            /* 通用样式，应用于所有元素 */
            #settingsUIContainer * {
              /* 设置默认字体 */
              box-sizing: border-box;
              /* 使用边框盒模型 */
              margin: 0px;
              /* 外边距设置为0 */
              padding: 0px;
              /* 内边距设置为0 */
              font-family: "Inter", Arial, Helvetica, sans-serif;
            }

            #settingsUIContainer {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 666px;
              z-index: 9999;
            }

            /* 文本选择时的背景色 */
            #settingsUIContainer *::selection {
              background-color: #c7c9ca;
              /* 文本选择时的背景色 */
            }

            /* 盒子 */
            #settingsUIContainer .bgsh-setting-box {
              margin: auto;
              /* 水平居中对齐 */
              box-sizing: border-box;
              padding: 20px 20px;
              /* 圆角 */
              background-color: #ecf0f3;
              box-shadow: -8px -8px 8px #feffff, 8px 8px 8px #161b1d2f;
              /* 阴影 */
              overflow-y: auto; /* 当内容超出容器高度时，自动添加垂直滚动条 */
              height: 92vh; /* 设置高度为视口的 92% */
              max-height: 888px; /* 设置最大高度*/
              display: flex; /* 设置为flex容器 */
              flex-direction: column; /* 子元素在垂直方向上排列 */
            }

            /* 标签样式 */
            #settingsUIContainer label {
              font-size: 13px;
              font-weight: 500;
              color: #858686;
              /* 字体颜色 */
            }

            /* 复选框标签样式 */
            #settingsUIContainer .bgsh-setting-checkbox-label {
              display: block;
              /* 块级元素 */
              position: relative;
              /* 相对定位 */
              cursor: pointer;
              /* 鼠标指针样式为手型 */
              font-size: 13px;
              /* 字体大小 */
              line-height: 22px;
              /* 行高 */
            }

            /* 复选框标签中的文本样式 */
            #settingsUIContainer span {
              color: #8f8c8c;
              /* 字体颜色 */
              display: inline-block;
              /* 内联块级元素 */
              position: absolute;
              /* 绝对定位 */
              /* width: 100%; */
              /* 宽度100%（此行已注释掉） */
              font-weight: 500;
              /* 字体粗细 */
              left: 12%;
              /* 左边距设置为12% */
              font-size: 13px;
              /* 字体大小 */
            }

            /* 输入框样式 */
            #settingsUIContainer input[type="text"],
            #settingsUIContainer input[type="number"] {
              width: 100%;
              height: 35px;
              padding-left: 20px;
              border: none;
              color: #858686;
              /* 字体颜色 */
              margin-top: 10px;
              background-color: #ecf0f3;
              outline: none;
              border-radius: 5px;
              /* 圆角 */
              box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff;
              /* 内阴影 */
            }
            #settingsUIContainer textarea {
              width: 100%;
              height: 150px;
              padding-left: 20px;
              padding-top: 10px;
              border: none;
              color: #858686;
              /* 字体颜色 */
              margin-top: 10px;
              background-color: #ecf0f3;
              outline: none;
              border-radius: 5px;
              /* 圆角 */
              box-shadow: inset 5px 5px 5px #cbced1, inset -5px -5px 5px #ffffff;
              /* 内阴影 */
            }
            /* 复选框输入框样式 */
            #settingsUIContainer input[type="checkbox"] {
              position: absolute;
              /* 绝对定位 */
              opacity: 0;
              /* 不可见 */
              cursor: pointer;
              /* 鼠标指针样式为手型 */
            }

            /* 自定义复选框样式 */
            #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom {
              position: absolute;
              /* 绝对定位 */
              top: 0;
              /* 顶部位置为0 */
              left: 0px;
              /* 左边位置为0像素 */
              height: 20px;
              /* 高度为20像素 */
              width: 20px;
              /* 宽度为20像素 */
              background-color: #ecf0f3;
              /* 背景颜色 */
              border-radius: 5px;
              /* 圆角 */
              border: none;
              /* 无边框 */
              box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #ffff;
              /* 内阴影效果 */
            }

            /* 复选框选中状态样式 */
            #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom {
              background-color: #ecf0f3;
              /* 背景颜色 */
              border-radius: 5px;
              /* 圆角 */
              -webkit-transform: rotate(0deg) scale(1);
              /* 旋转和缩放 */
              -ms-transform: rotate(0deg) scale(1);
              /* 旋转和缩放 */
              transform: rotate(0deg) scale(1);
              /* 旋转和缩放 */
              opacity: 1;
              /* 不透明 */
              border: none;
              /* 无边框 */
              box-shadow: -4px -4px 4px #feffff, 4px 4px 4px #161b1d2f;
              /* 阴影效果 */
            }

            /* 自定义复选框的标志样式 */
            #settingsUIContainer .bgsh-setting-checkbox-label .bgsh-setting-checkbox-custom::after {
              position: absolute;
              /* 绝对定位 */
              content: "";
              /* 内容为空，用于伪元素 */
              left: 10px;
              /* 左侧位置为10像素 */
              top: 10px;
              /* 顶部位置为10像素 */
              height: 0px;
              /* 高度为0像素 */
              width: 0px;
              /* 宽度为0像素 */
              border-radius: 5px;
              /* 圆角 */
              border: solid #635f5f;
              /* 边框样式和颜色 */
              border-width: 0 3px 3px 0;
              /* 边框宽度设置 */
              -webkit-transform: rotate(0deg) scale(0);
              /* 旋转和缩放 */
              -ms-transform: rotate(0deg) scale(0);
              /* 旋转和缩放 */
              transform: rotate(0deg) scale(0);
              /* 旋转和缩放 */
              opacity: 1;
              /* 不透明 */
              transition: all 0.3s ease-out;
              /* 过渡效果设置 */
            }

            /* 复选框选中状态下的标志样式 */
            #settingsUIContainer .bgsh-setting-checkbox-label input:checked ~ .bgsh-setting-checkbox-custom::after {
              -webkit-transform: rotate(45deg) scale(1);
              /* 旋转和缩放 */
              -ms-transform: rotate(45deg) scale(1);
              /* 旋转和缩放 */
              transform: rotate(45deg) scale(1);
              /* 旋转和缩放 */
              opacity: 1;
              /* 不透明 */
              left: 7px;
              /* 左侧位置为7像素 */
              top: 3px;
              /* 顶部位置为3像素 */
              width: 4px;
              /* 宽度为4像素 */
              height: 8px;
              /* 高度为8像素 */
              border: solid #635f5f;
              /* 边框样式和颜色 */
              border-width: 0 2px 2px 0;
              /* 边框宽度设置 */
              background-color: transparent;
              /* 背景颜色透明 */
              border-radius: 0;
              /* 圆角设置为0 */
            }

            /* 按钮样式 */
            #settingsUIContainer button {
              width: 50px;
              /* 宽度 */
              margin-top: 20px;
              /* 顶部外边距设置为20像素 */
              height: 38px;
              /* 高度为38像素 */
              border: none;
              /* 无边框 */
              outline: none;
              /* 移除焦点边框 */
              border-radius: 20px;
              /* 圆角设置为20像素 */
              background-color: #727171;
              /* 背景颜色 */
              font-size: 13px;
              /* 字体大小 */
              font-weight: 500;
              /* 字体粗细 */
              color: #ffffff;
              /* 字体颜色 */
              cursor: pointer;
              /* 鼠标指针样式为手型 */
              box-shadow: -5px -5px 8px #d8e2e6, 5px 5px 10px #2c313378;
              /* 阴影效果 */
              transition: 0.8s;
              /* 过渡效果设置 */
            }

            /* 按钮悬停状态样式 */
            #settingsUIContainer button:hover {
              background-color: #535658;
              /* 背景颜色 */
              box-shadow: inset 5px 5px 10px #05050578, inset -5px -5px 10px #9e9c9c;
              /* 内阴影效果 */
            }

            /* 隐藏 <fieldset> 的边框 */
            #settingsUIContainer fieldset {
              border: none;
              /* 移除边框 */
            }

            /* 自定义单选框样式 */
            #settingsUIContainer input[type="radio"] {
              background-color: #ecf0f3;
              /* 背景颜色 */
              border-radius: 5px;
              /* 圆角 */
              border: none;
              /* 无边框 */
              box-shadow: inset 3px 3px 3px #cbced1, inset -3px -3px 3px #ffff;
              /* 内阴影效果 */
            }
            .bgsh-setting-first,
            .bgsh-setting-second {
              width: 50%; /* 设定为50%宽度 */
            }

            /* 为了让 .bgsh-setting-first 和 .bgsh-setting-second 水平排列，我们需要一个外层的容器 */
            .bgsh-setting-box-container {
              display: flex; /* 设置为flex容器，使其子元素水平排列 */
              gap: 20px; /* 设置子元素之间的间隔，你可以根据需要调整 */
            }

            .bgsh-setting-button {
              width: 100%; /* 占据100%的宽度 */
              text-align: center; /* 按钮居中显示 */
              gap: 20px; /* 设置子元素之间的间隔，你可以根据需要调整 */

            }

            `;

    const styleElement = document.createElement("style");
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  }

  // #endregion

  // #region 剪贴板操作

  /**
   * 将指定文本复制到剪贴板。
   * @param {string} text - 需要复制的文本。
   * @param {function} onSuccess - 复制成功时的回调函数。
   * @param {function} onError - 复制失败时的回调函数。
   */
  async function copyToClipboard(text, onSuccess, onError) {
    try {
      await navigator.clipboard.writeText(text);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      if (onError) {
        onError(err);
      }
      console.error("无法将文本复制到剪贴板", err);
    }
  }

  // #endregion

  // #region URL处理

  /**
   * 从给定的URL中解析查询参数。
   * @param {string} url - 需要解析的URL。
   * @returns {object} 返回一个包含查询参数的对象。
   */
  function getQueryParams(url) {
    const queryParams = {};

    // 检查 URL 是否包含传统的查询字符串
    if (url.includes("?")) {
      // 处理标准查询字符串
      const queryPattern = /[?&]([^=&]+)=([^&]*)/g;
      let match;
      while ((match = queryPattern.exec(url)) !== null) {
        queryParams[match[1]] = decodeURIComponent(match[2]);
      }
    } else {
      // 处理特殊的 URL 路径模式，如 forum-154-1.html
      const pathPattern = /forum-(\d+)-(\d+)\.html$/;
      const pathMatch = pathPattern.exec(url);
      if (pathMatch && pathMatch.length === 3) {
        // 假设第一个数字是 fid，第二个数字是 page
        queryParams.fid = pathMatch[1];
        queryParams.page = pathMatch[2];
      }
    }

    return queryParams;
  }

  /**
   * 从给定的URL中解析tid。
   * @param {string} url - 需要解析的URL。
   * @returns {object} 返回一个包含查询参数的对象。
   */
  function extractTid(url) {
    let tid = null;

    // 检查是否是类似 /thread-XXXX-1-1.html 的格式
    const threadMatch = url.match(/thread-(\d+)-\d+-\d+\.html/);
    if (threadMatch && threadMatch.length > 1) {
      tid = threadMatch[1];
    } else {
      // 检查是否是类似 /forum.php?mod=viewthread&tid=XXXX&extra=... 的格式
      const queryMatch = url.match(/tid=(\d+)/);
      if (queryMatch && queryMatch.length > 1) {
        tid = queryMatch[1];
      }
    }

    return tid;
  }

  // #endregion

  // #region DOM操作

  /**
   * 获取指定名称的单选按钮的选中值。
   * @param {string} name - 单选按钮的名称。
   * @returns {number|null} 返回选中单选按钮的值，如果没有选中，则返回null。
   */
  function getCheckedRadioValue(name) {
    const radios = document.getElementsByName(name);
    for (let i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        return parseInt(radios[i].value);
      }
    }
    return null;
  }

  /**
   * 解析给定内容为DOM。
   *
   * @param {string} content - 要解析的内容。
   * @param {string} type - 解析内容的类型，默认为"text/html"。
   * @returns {Document} - 返回解析后的文档。
   */
  function parseContent(content, type = "text/html") {
    return new DOMParser().parseFromString(content, type);
  }

  /**
   * 从给定的DOM文档中提取值。
   *
   * @param {Document} doc - 要从中提取值的DOM文档。
   * @param {string} selector - 用于定位元素的CSS选择器。
   * @param {string} attr - 要提取的属性，默认为"value"。
   * @returns {string|null} - 返回提取的值或null。
   */
  function extractValueFromDOM(doc, selector, attr = "value") {
    const elem = doc.querySelector(selector);
    if (!elem) return null;
    return elem.getAttribute(attr);
  }

  /**
   * 显示随机分布的水印文本"保国爱你"在全屏上。
   * 水印将在2秒后自动消失。
   */
  function showWatermarkMessage() {
    var settings = getSettings();
    if (!settings.isShowWatermarkMessage) return;
    const watermarkWrapper = document.createElement("div");
    watermarkWrapper.className = "bgsh-watermark-wrapper";

    const positions = [];
    const maxAttempts = 10; // 增加到20次尝试

    for (let i = 0; i < 20; i++) {
      const watermarkText = document.createElement("div");
      watermarkText.className = "bgsh-watermark-text";

      // 吻的SVG
      const kissIcon = `
                    <svg class="icon" viewBox="0 0 1489 1024" xmlns="http://www.w3.org/2000/svg">
                            <path
                            d="M1445.997803 542.822364c-28.845516 31.637018-113.986313 125.61757-171.677346 201.918612-70.252789 93.050052-107.007559 171.677345-165.163841 215.41087A249.374138 249.374138 0 0 1 935.153019 1023.891131a303.343168 303.343168 0 0 1-160.976589-46.525025 139.575077 139.575077 0 0 0-46.525026-6.513504 121.430317 121.430317 0 0 0-46.525026 5.117753 298.690666 298.690666 0 0 1-160.511339 46.525026 253.096141 253.096141 0 0 1-174.003597-63.274035C291.246662 915.022571 254.491891 837.791028 186.100103 744.740976 126.54807 667.044183 40.942023 573.063631 12.096507 541.426614c-6.048253-6.513504-12.096507-7.909254-12.096507-13.027008s12.096507-13.027007 12.096507-13.027007a487.11702 487.11702 0 0 0 85.606047-6.513503c21.401512-6.513504 211.688868-133.992074 211.688868-133.992075l150.741083-119.104066a143.76233 143.76233 0 0 1 68.391788-15.818509c41.872523 0 200.522861 100.028806 200.522862 100.028806S887.697493 241.340197 930.500517 241.340197a147.949582 147.949582 0 0 1 68.857038 15.353259l149.810583 119.569316s189.822105 127.013321 211.688868 133.992074a482.464518 482.464518 0 0 0 85.140797 6.513504s12.561757 7.909254 12.561757 13.027007-6.048253 6.513504-12.561757 13.027007zM1483.217823 136.658889a110.264311 110.264311 0 0 1-9.305005 21.401512 121.895568 121.895568 0 0 1-11.166006 15.818509L1315.72773 326.015744l-147.484331-150.741084a100.494056 100.494056 0 0 1-12.561757-17.67951 96.772054 96.772054 0 0 1-8.839755-17.679509 157.254587 157.254587 0 0 1-6.048254-41.872524 93.050052 93.050052 0 0 1 100.959306-93.050051 110.264311 110.264311 0 0 1 73.044291 46.525026A110.264311 110.264311 0 0 1 1387.84152 0.340563 93.050052 93.050052 0 0 1 1488.800827 95.716866a154.928336 154.928336 0 0 1-5.583004 40.942023z"
                            fill="#FD140B" p-id="15006"></path>
                        <path
                            d="M729.047155 553.52312a739.28266 739.28266 0 0 0-87.001799 0 1777.255987 1777.255987 0 0 0-226.576875 58.621533c0 7.444004 13.492257 17.67951 113.055812 26.984515a1599.530388 1599.530388 0 0 0 200.522862 4.187252 1460.885811 1460.885811 0 0 0 201.453362-2.791501c99.563555-9.770255 113.521063-19.540511 113.521063-26.984515a1759.576477 1759.576477 0 0 0-227.042126-59.086783c-26.054014-2.791502-87.932299-0.930501-87.932299-0.930501z"
                            fill="#F2C330" p-id="15007"></path>
                        </svg>`;
      watermarkText.innerHTML = `${kissIcon}${settings.logoText}${kissIcon}`;

      let attempts = 0;
      let overlap = false;

      do {
        overlap = false;

        const x = Math.random() * window.innerWidth * 0.8;
        const y = Math.random() * window.innerHeight * 0.8;

        // 检查新位置是否与现有位置重叠
        for (let pos of positions) {
          const dx = x - pos.x;
          const dy = y - pos.y;

          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 400) {
            // 减少到100px
            overlap = true;
            break;
          }
        }

        if (!overlap) {
          watermarkText.style.left = `${x}px`;
          watermarkText.style.top = `${y}px`;
          positions.push({ x, y });
        }

        attempts++;
      } while (overlap && attempts < maxAttempts);

      if (attempts < maxAttempts) {
        watermarkWrapper.appendChild(watermarkText);
      }
    }

    document.body.appendChild(watermarkWrapper);
    setTimeout(() => {
      watermarkWrapper.remove();
    }, 500);
  }

  // #endregion

  // #region 用户信息获取

  /**
   * 从页面中获取当前登录用户的 userid。
   * @returns {string|null} 返回用户ID，如果未找到则返回null。
   */
  function getUserId() {
    const userLink = document.querySelector(".vwmy a");
    if (userLink) {
      const match = userLink.href.match(/uid=(\d+)/);
      if (match) {
        return match[1];
      }
    }
    return null;
  }

  // #endregion

  // #region 帖子信息获取

  /**
   * 从给定的元素中获取其父级table的帖子楼层Pid。
   * @param {HTMLElement} element - 要查询的HTML元素。
   * @returns {string|null} 返回楼层的Pid，如果未找到则返回null。
   */
  function getTableIdFromElement(element) {
    if (element) {
      let parentTable = element.closest("table");
      if (parentTable && parentTable.id.startsWith("pid")) {
        return parentTable.id.replace("pid", "");
      }
    }
    return null;
  }

  // #endregion

  // #region 会话验证

  /**
   * 从页面中获取formhash值。
   * @returns {string|null} 返回formhash值，如果未找到则返回null。
   */
  function getFormHash() {
    const element = document.querySelector('input[name="formhash"]');
    if (element) {
      return element.value;
    } else {
      return null;
    }
  }

  // #endregion

  // #region 帖子列表样式设置

  /**
   * 设置帖子标题的样式。
   *
   * 使用自定义字体、加粗和字体大小为标题增加高亮。
   */
  function stylePosts(settings) {
    const style = document.createElement("style");
    style.id = "customTitleStyle"; // 为样式元素添加ID，方便后续操作
    style.textContent = `
              .s.xst {
                font-size: ${settings.titleStyleSize}px;
                font-weight: ${settings.titleStyleWeight};
                font-family: 'PingFang SC', 'Helvetica Neue', 'Microsoft YaHei New', 'STHeiti Light', sans-serif;
              }
            `;
    document.head.appendChild(style);

    // 获取页面上所有alt="heatlevel"的<img>元素
    var images = document.querySelectorAll('img[alt="heatlevel"]');
    images.forEach((image) => {
      // 寻找同级的符合条件的<a>标签
      var parent = image.parentNode;
      var link = parent.querySelector("a.s.xst");
      var uniqueId = "baoguoheatleveldisplay"; // 设置一个唯一的ID

      if (link) {
        // 在 link 的父元素中查找 id 为 "baoguobuyinfouniqueSpanId" 的元素
        const existingSpan = link.parentNode.querySelector("#" + uniqueId);

        // 如果不存在这样的 span 元素，则创建并插入一个新的
        if (!existingSpan) {
          var span = document.createElement("span");
          span.textContent = ` [${image.getAttribute("title")}]`; // 使用图片的title属性值
          // 设置样式
          span.style.color = "red";
          span.style.fontWeight = "bold";
          span.style.fontSize = `${settings.titleStyleSize}px`;
          span.id = uniqueId;

          // 将<span>元素插入到<a>标签后面
          link.parentNode.insertBefore(span, link.nextSibling);
        }
      }
    });
  }

  /**
   * 移除先前设置的帖子标题样式。
   */
  function undoStylePosts() {
    const styleElement = document.getElementById("customTitleStyle");
    if (styleElement) {
      styleElement.remove();
    }
  }

  // #endregion

  // #region 页码操作

  /**
   * 从页面的一个位置复制页码到另一个位置。
   */
  function addPageNumbers() {
    const sourceElement = document.querySelector(".pgs.cl.mbm");
    const targetElement = document.querySelector(".slst.mtw");

    if (!sourceElement) {
      console.error("源元素（使用选择器 '.pgs.cl.mbm'）未找到！");
      return;
    }

    if (!targetElement) {
      console.error("目标元素（使用选择器 '.slst.mtw'）未找到！");
      return;
    }

    const parentElement = targetElement.parentElement;

    if (!parentElement) {
      console.error("目标元素的父元素不可用！");
      return;
    }

    const clonedElement = sourceElement.cloneNode(true);
    parentElement.insertBefore(clonedElement, targetElement);
  }

  // #endregion

  // #region UI组件创建

  /**
   * 创建一个汇率显示窗口。
   */
  function createFloatingWindow() {
    if (document.getElementById("currencyConverter")) {
      return;
    }
    const floatingDiv = document.createElement("div");
    floatingDiv.style.position = "fixed";
    floatingDiv.style.top = "50%";
    floatingDiv.style.left = "50%";
    floatingDiv.style.transform = "translate(-50%, -50%)";
    floatingDiv.style.backgroundColor = "#f9f9f9";
    floatingDiv.style.border = "1px solid #ddd";
    floatingDiv.style.boxShadow = "0 4px 8px rgba(0,0,0,0.05)";
    floatingDiv.style.padding = "20px";
    floatingDiv.style.borderRadius = "8px";
    floatingDiv.style.zIndex = "1000";
    floatingDiv.setAttribute("id", "currencyConverter");
    floatingDiv.setAttribute("draggable", "true");
    floatingDiv.innerHTML = `<div style="font-family: Arial, sans-serif; color: #333; text-align: center; margin-bottom: 15px; font-size: 18px; font-weight: bold;">保国带你逛算汇率</div><div><label>金钱:</label><input type="number"id="moneyInput"value="280"style="margin-bottom: 10px; border: 1px solid #ccc; padding: 2px;"/><br/><label>人民币:</label><input type="number"id="rmbInput"value="100"style="margin-bottom: 10px; border: 1px solid #ccc; padding: 2px;"/><br/><button id="convertButton"style="margin-right: 5px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">计算汇率</button><button id="closeButton"style="background-color: #f44336; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">关闭</button><div id="conversionResult"style="margin-top: 10px;"></div></div>`;
    document.body.appendChild(floatingDiv);
    enableDrag(floatingDiv);
    document
      .getElementById("convertButton")
      .addEventListener("click", convertCurrency);
    document.getElementById("closeButton").addEventListener("click", () => {
      document.getElementById("currencyConverter").remove();
    });
  }

  /**
   * 启用拖动
   * @param {string} elmnt - 组件。
   */
  function enableDrag(elmnt) {
    var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
      document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
      elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
      e = e || window.event;
      if (e.target.tagName.toUpperCase() === "INPUT") {
        return;
      }
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }
    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  /**
   * 计算汇率
   */
  function convertCurrency() {
    const moneyInput = document.getElementById("moneyInput").value;
    const rmbInput = document.getElementById("rmbInput").value;
    if (!moneyInput || !rmbInput || moneyInput <= 0 || rmbInput <= 0) {
      document.getElementById("conversionResult").innerHTML =
        "请输入有效的金钱和人民币值";
      return;
    }

    const baseRate = rmbInput / (moneyInput * 1.2);
    const normalUserCost = ((200 * rmbInput) / (moneyInput * 1.2)).toFixed(4);
    const eliteUserCost = ((180 * rmbInput) / (moneyInput * 1.2)).toFixed(4);
    document.getElementById("conversionResult").innerHTML = `1金钱=${(
      1 * baseRate
    ).toFixed(4)}元<br/>1元=${(1 / baseRate).toFixed(
      4
    )}金钱<br/>普通用户兑换邀请码需要:${normalUserCost}元<br/>精英用户兑换邀请码需要:${eliteUserCost}元`;
  }

  /**
   * 创建一个多选框组。
   * @param {string} id - 组件的ID。
   * @param {string} title - 多选框组的标题。
   * @param {Array} options - 多选框选项数组，每个选项包含"value"和"label"属性。
   * @returns {HTMLElement} 返回多选框组的HTML元素。
   */
  function createCheckboxGroup(id, title, options) {
    const groupDiv = document.createElement("div");
    groupDiv.className = "bgsh-forget";
    groupDiv.id = id;

    let innerHTML = `<strong>${title}</strong><br>`;

    // 添加一个'全选'复选框
    const selectAllId = `bgsh-${id}-select-all`;
    innerHTML += `
              <label class="bgsh-checkbox-label">
                  <input type="checkbox" id="${selectAllId}" class="select-all">
                  <span class="bgsh-checkbox-custom"></span>
                  <span class="bgsh-label-text">全选</span>
              </label>
          `;

    options.forEach((option) => {
      const checkboxId = `bgsh-${id}-${option.value}`;
      innerHTML += `
                  <label class="bgsh-checkbox-label">
                      <input type="checkbox" id="${checkboxId}" value="${option.value}">
                      <span class="bgsh-checkbox-custom"></span>
                      <span class="bgsh-label-text">${option.label}</span>
                  </label>
          `;
    });

    groupDiv.innerHTML = innerHTML;

    // 添加事件监听
    const selectAllCheckbox = groupDiv.querySelector(".select-all");
    const otherCheckboxes = Array.from(
      groupDiv.querySelectorAll('input[type="checkbox"]')
    ).filter((cb) => cb !== selectAllCheckbox);

    function checkIndeterminateStatus() {
      const checkedCheckboxes = otherCheckboxes.filter(
        (cb) => cb.checked
      ).length;

      selectAllCheckbox.checked = checkedCheckboxes === otherCheckboxes.length;
      selectAllCheckbox.indeterminate =
        checkedCheckboxes > 0 && checkedCheckboxes < otherCheckboxes.length;
    }

    // 初始化全选框状态
    setTimeout(() => {
      checkIndeterminateStatus();
    }, 500);
    // 为 '全选' 复选框添加事件监听器
    selectAllCheckbox.addEventListener("change", () => {
      otherCheckboxes.forEach((checkbox) => {
        checkbox.checked = selectAllCheckbox.checked;
      });

      // 在全选/取消全选后更新状态
      checkIndeterminateStatus();
    });

    // 为其他复选框添加事件监听器
    otherCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", checkIndeterminateStatus);
    });

    return groupDiv;
  }

  /**
   * 创建一个按钮。
   * @param {string} id - 按钮的ID。
   * @param {string} text - 按钮上的文本。
   * @param {function} clickFunction - 按钮点击时的回调函数。
   * @returns {HTMLElement} 返回创建的按钮元素。
   */
  const createButton = (
    id,
    text,
    clickFunction,
    className = "bgsh-customBtn",
    bgColor = "#0396FF"
  ) => {
    const button = document.createElement("button");
    button.id = id;
    button.innerText = text;
    button.className = className;
    button.style.backgroundColor = bgColor; // 设置背景颜色
    button.addEventListener("click", clickFunction);
    return button;
  };

  /**
   * 创建一个固定位置的按钮容器。
   * @returns {HTMLElement} 返回创建的按钮容器元素。
   */
  function createButtonContainer() {
    const container = document.createElement("div");
    Object.assign(container.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "fixed",
      top: "50%",
      right: "1vh",
      zIndex: "1000",
      transform: "translateY(-50%)",
    });

    return container;
  }

  function createMenuButton(settings) {
    const menuButton = document.createElement("button");
    // 根据容器的可见性设置按钮的文本
    menuButton.textContent = settings.menuButtonIsVisible ? "隐藏" : "显示";
    // 根据容器的可见性设置按钮的背景色
    const buttonColor = settings.menuButtonIsVisible ? "#4682B4" : "#FF6347";

    Object.assign(menuButton.style, {
      position: "fixed",
      top: "calc(50% - 60px)", // 将按钮放在容器上方
      right: "1vh",
      zIndex: "1001", // 确保按钮在容器之上
      cursor: "pointer",
      fontSize: "15px",
      padding: "15px 15px",
      borderRadius: "50%", // 圆形按钮
      backgroundColor: buttonColor, // 根据状态设置背景色
      color: "white",
      border: "none",
    });

    return menuButton;
  }
  function toggleContainer(menuButton, container) {
    const settings = getSettings();
    let isVisible = settings.menuButtonIsVisible; // 初始状态设置为可见
    menuButton.addEventListener("click", () => {
      if (isVisible) {
        container.style.display = "none"; // 隐藏容器
        menuButton.textContent = "显示"; // 菜单按钮图标
        menuButton.style.backgroundColor = "#FF6347"; // 设置背景色为红色

        isVisible = false;
      } else {
        container.style.display = "flex"; // 显示容器
        menuButton.textContent = "隐藏"; // 菜单按钮图标
        menuButton.style.backgroundColor = "#4682B4"; // 设置背景色为蓝色

        isVisible = true;
      }
      // 更新和存储新的可见性状态
      GM_setValue("menuButtonIsVisible", isVisible);
      const newsettings = getSettings();
      setMenuButtonPosition(menuButton, container, newsettings);
    });
  }

  /**
   * 创建一个日期选择框并返回
   * @param {string} id - 输入元素的ID
   * @param {string} defaultValue - 默认日期值
   * @returns {HTMLElement} 日期选择框
   */
  function createDateInput(
    id,
    defaultValue = new Date().toISOString().split("T")[0],
    className = "bgsh-dateInput"
  ) {
    const input = document.createElement("input");
    input.type = "date";
    input.id = id;
    input.value = defaultValue;
    input.className = className;

    return input;
  }
  // #endregion

  // #region 更新操作

  /**
   * 检查脚本是否有新版本可用。
   * 从提供的URL中获取最新版本号，并与当前版本进行比较。
   * 如果发现新版本，则显示更新对话框。
   */
  async function checkForUpdates() {
    // 获取当前脚本版本
    const currentVersion = GM.info.script.version;
    const updateURL =
      "https://sleazyfork.org/zh-CN/scripts/494839-保国逛色花/code";

    try {
      // 请求最新版本的脚本内容
      let response = await fetch(updateURL);
      let data = await response.text();

      // 从脚本内容中匹配版本号
      const matchVersion = data.match(/@version\s+([\d.]+)/);

      // 如果匹配到新版本号且新版本号大于当前版本号，显示更新对话框
      if (
        matchVersion &&
        matchVersion[1] &&
        parseFloat(matchVersion[1]) > parseFloat(currentVersion)
      ) {
        showUpdateDialog();
      }

      // 记录最后一次检查更新的时间
      GM_setValue("lastCheckedUpdate", Date.now());
    } catch (error) {
      console.error("检查更新时出错:", error);
    }
  }

  /**
   * 显示脚本新版本的更新对话框。
   * 提供一个链接供用户点击以更新脚本。
   */
  function showUpdateDialog() {
    // 更新对话框的HTML内容
    const dialogHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.7); z-index: 9999; display: flex; justify-content: center; align-items: center;">
                <div style="background: #fff; padding: 20px; border-radius: 5px;">
                    <p>有新版本的保国逛色花脚本可用！</p>
                    <a href="https://sleazyfork.org/zh-CN/scripts/494839-保国逛色花" target="_blank">点击这里更新</a>
                    <button style="margin-top: 10px;" onclick="this.closest('.updateDialog').remove();">关闭</button>
                </div>
            </div>`;

    // 插入到页面中
    const tempDiv = document.createElement("div");
    tempDiv.className = "updateDialog";
    tempDiv.innerHTML = dialogHTML;
    document.body.appendChild(tempDiv);
  }

  // #endregion

  // #region 用户签到功能

  /**
   * 为给定的用户执行签到操作。
   *
   * @param {string} userid 用户ID
   * @returns {boolean} 签到成功返回 true，否则返回 false
   */
  async function sign(userid) {
    const signURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&infloat=yes&handlekey=pc_click_ddsign&inajax=1&ajaxtarget=fwin_content_pc_click_ddsign`;
    const params = await getSignParameters(signURL);

    if (!params || !params.formhash || !params.signhash) {
      console.error("Failed to retrieve sign parameters.");
      return false;
    }

    const { formhash, signtoken, signhash } = params;
    const secanswer = await getValidationResult();

    let responseText = await postSignData({
      baseURL,
      formhash,
      signtoken,
      secanswer,
      signhash,
    });
    return updateSignButton(responseText, userid);
  }

  /**
   * 从指定的 URL 获取签到所需的参数。
   *
   * @param {string} url 目标URL
   * @returns {Object|null} 包含签到参数的对象或null
   */
  async function getSignParameters(url) {
    const { responseText, contentType } = await fetchWithContentType(url);
    return handleResponseContent(responseText, contentType);
  }

  async function getValidationResult() {
    const secqaaURL = `/misc.php?mod=secqaa&action=update&idhash=qSAxcb0`;
    const { responseText, contentType } = await fetchWithContentType(secqaaURL);
    return extractValidationText(responseText, contentType);
  }

  async function postSignData({
    baseURL,
    formhash,
    signtoken,
    secanswer,
    signhash,
  }) {
    const postURL = `${baseURL}/plugin.php?id=dd_sign&ac=sign&signsubmit=yes&handlekey=pc_click_ddsign&signhash=${signhash}&inajax=1`;
    const data = new URLSearchParams({
      formhash,
      signtoken,
      secanswer,
      secqaahash: "qSAxcb0",
    });
    const response = await fetch(postURL, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });
    return response.text();
  }

  async function fetchWithContentType(url) {
    const response = await fetch(url);
    const contentType = response.headers.get("Content-Type");
    const responseText = await response.text();
    return { responseText, contentType };
  }

  function handleResponseContent(responseText, contentType) {
    if (contentType.includes("text/xml")) {
      return handleXMLContent(responseText);
    } else if (contentType.includes("text/html")) {
      return extractSignParametersFromHTML(responseText);
    } else {
      throw new Error("Unsupported content type");
    }
  }

  /**
   * 处理XML内容并提取所需的签到参数。
   *
   * @param {string} responseText - 从请求中返回的XML内容。
   * @returns {object|null} - 返回提取的签到参数或null。
   */
  function handleXMLContent(responseText) {
    const settings = getSettings();
    let xml = parseContent(responseText, "text/xml");
    let content = xml.getElementsByTagName("root")[0].textContent;
    let doc = parseContent(content);
    const alertErrorElement = doc.querySelector(".alert_error");
    if (alertErrorElement) {
      let scripts = alertErrorElement.querySelectorAll("script");
      scripts.forEach((script) => {
        script.remove();
      });
      if (settings.qiandaoTip) {
        showTooltip(alertErrorElement.textContent.trim());
      }
      return;
    } else {
      return extractSignParametersFromHTML(content);
    }
  }

  /**
   * 从HTML内容中提取签到参数。
   *
   * @param {string} responseText - 从请求中返回的HTML内容。
   * @returns {object} - 返回提取的签到参数。
   */
  function extractSignParametersFromHTML(responseText) {
    const doc = parseContent(responseText);
    const formhash = extractValueFromDOM(doc, 'input[name="formhash"]');
    const signtoken = extractValueFromDOM(doc, 'input[name="signtoken"]');
    const signhash = extractValueFromDOM(
      doc,
      'form[name="login"]',
      "id"
    ).replace("signform_", "");
    return { formhash, signtoken, signhash };
  }

  /**
   * 从验证结果文本中提取计算表达式并计算结果。
   *
   * @param {string} resultText 验证结果文本
   * @param {string} contentType 内容类型
   * @returns {number} 计算的结果
   */
  function extractValidationText(resultText, contentType) {
    const text = resultText
      .replace("sectplcode[2] + '", "前")
      .replace("' + sectplcode[3]", "后");
    const matchedText = text.match(/前([\w\W]+)后/)[1];
    return computeExpression(matchedText.replace("= ?", ""));
  }

  /**
   * 计算给定的数学表达式。
   *
   * @param {string} expr 数学表达式
   * @returns {number} 计算的结果
   */
  const computeExpression = (expr) => {
    const [left, operator, right] = expr.split(/([+\-*/])/);
    const a = parseFloat(left.trim());
    const b = parseFloat(right.trim());
    switch (operator) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return a / b;
      default:
        throw new Error("Unsupported operator");
    }
  };

  /**
   * 根据签到响应内容更新签到按钮的状态，并设置最后签到日期。
   *
   * @param {string} responseText 签到响应内容
   * @param {string} userid 用户ID
   * @returns {boolean} 签到成功返回 true，否则返回 false
   */
  function updateSignButton(responseText, userid) {
    const settings = getSettings();
    const today = new Date().toLocaleDateString();
    if (
      responseText.includes("已经签到过") ||
      responseText.includes("重复签到")
    ) {
      if (settings.qiandaoTip) {
        showTooltip("已经签到过啦，请明天再来！");
      }
      GM_setValue(`lastSignDate_${userid}`, today);
      return true;
    } else if (responseText.includes("签到成功")) {
      if (settings.qiandaoTip) {
        showTooltip("签到成功，金钱+2，明天记得来哦。");
      }
      GM_setValue(`lastSignDate_${userid}`, today);
      return true;
    } else if (responseText.includes("请至少发表或回复一个帖子后再来签到")) {
      if (settings.qiandaoTip) {
        if (settings.qiandaoTip) {
          showTooltip("请至少发表或回复一个帖子后再来签到!");
        }
      }
      return false;
    } else {
      if (settings.qiandaoTip) {
        showTooltip("抱歉，签到出现了未知错误！");
      }
      return false;
    }
  }

  // #endregion

  // #region 收藏帖子操作

  /**
   * 收藏当前查看的帖子。
   * 通过构造特定URL实现收藏功能，同时给用户提供收藏成功或失败的提示。
   * @async
   * @function
   */
  async function star() {
    showWatermarkMessage();
    // 从当前页面URL中获取帖子的tid
    const tid = extractTid(window.location.href);
    // 获取formhash，用于验证请求
    const formHash = document.querySelector('input[name="formhash"]').value;

    // 构造收藏URL
    const starUrl = `/home.php?mod=spacecp&ac=favorite&type=thread&id=${tid}&formhash=${formHash}&infloat=yes&handlekey=k_favorite&inajax=1&ajaxtarget=fwin_content_k_favorite`;

    // 发送收藏请求
    const text = await fetch(starUrl).then((r) => r.text());

    // 根据响应内容提供相应的提示
    if (text.includes("抱歉，您已收藏，请勿重复收藏")) {
      return showTooltip("抱歉，您已收藏，请勿重复收藏");
    }

    if (text.includes("信息收藏成功")) {
      return showTooltip("信息收藏成功");
    }

    // 如果既没有成功消息也没有重复收藏消息，视为出错并在控制台记录
    showTooltip("信息收藏出现问题！！！");
    console.error(text);
  }

  // #endregion

  // #region 帖子评分

  /**
   * 获取指定帖子的评分信息。
   * @param {number} pid - 帖子ID。
   * @param {number} tid - 主题ID。
   * @param {number} timestamp - 当前时间戳。
   * @returns {Object} 评分信息。
   * @async
   */
  async function getRateInfo(pid, tid, timestamp) {
    const infoDefaults = {
      state: false,
      max: 0,
      left: 0,
      formHash: "",
      referer: "",
      handleKey: "",
      error: "",
    };

    try {
      // 构建评分信息请求的URL
      const url = `/forum.php?mod=misc&action=rate&tid=${tid}&pid=${pid}&infloat=yes&handlekey=rate&t=${timestamp}&inajax=1&ajaxtarget=fwin_content_rate`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch rate info");

      // 解析服务器返回的XML数据
      const text = await response.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const htmlContent = xml.querySelector("root").textContent;
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");

      // 检查是否存在错误
      if (htmlContent.includes("alert_error")) {
        const alertErrorElement = doc.querySelector(".alert_error");
        const scriptElements = alertErrorElement.querySelectorAll("script");
        scriptElements.forEach((script) => script.remove());

        const errorMessage = alertErrorElement.textContent.trim();
        return { ...infoDefaults, error: errorMessage };
      }

      // 提取评分信息
      const maxElement = doc.querySelector("#scoreoption8 li");
      if (!maxElement) {
        return { ...infoDefaults, error: "评分不足啦!" };
      }

      const max = parseInt(maxElement.textContent.replace("+", ""), 10);
      const left = parseInt(
        doc.querySelector(".dt.mbm td:last-child").textContent,
        10
      );
      const formHash = doc.querySelector('input[name="formhash"]').value;
      const referer = doc.querySelector('input[name="referer"]').value;
      const handleKey = doc.querySelector('input[name="handlekey"]').value;

      return {
        state: true,
        max: Math.min(max, left),
        left,
        formHash,
        referer,
        handleKey,
        error: "",
      };
    } catch (error) {
      showTooltip(error);
      return infoDefaults;
    }
  }

  /**
   * 对指定的帖子进行评分。
   * @param {number} pid - 帖子ID。
   * @async
   */
  async function grade(pid) {
    showWatermarkMessage();
    const tid = extractTid(window.location.href);
    const timestamp = new Date().getTime();
    const rateInfo = await getRateInfo(pid, tid, timestamp);
    if (!rateInfo.state) {
      showTooltip(rateInfo.error);
      return;
    }
    var settings = getSettings();
    var maxGradeThread = settings.maxGradeThread;
    rateInfo.max =
      parseInt(rateInfo.max) < parseInt(maxGradeThread)
        ? rateInfo.max
        : maxGradeThread;
    // 构建评分请求的URL和数据
    const rateUrl =
      "/forum.php?mod=misc&action=rate&ratesubmit=yes&infloat=yes&inajax=1";
    const data = new URLSearchParams();
    data.append("formhash", rateInfo.formHash);
    data.append("tid", tid);
    data.append("pid", pid);
    data.append("referer", rateInfo.referer);
    data.append("handlekey", rateInfo.handleKey);
    data.append("score8", `+${rateInfo.max}`);
    data.append("reason", settings.logoText);
    data.append("sendreasonpm", "on");

    // 发送评分请求
    const request = new Request(rateUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    try {
      const responseText = await fetch(request).then((r) => r.text());

      // 根据响应内容提供评分成功或失败的提示
      if (responseText.includes("感谢您的参与，现在将转入评分前页面")) {
        showTooltip(`+${rateInfo.max} 评分成功，并通知了楼主!`);
      } else {
        showTooltip("抱歉，评分失败！");
        console.error(responseText);
      }
    } catch (error) {
      showTooltip("评分请求失败！");
      console.error(error);
    }
  }

  // #endregion

  // #region 获取购买记录

  /**
   * 获取指定帖子的购买记录。
   * @param {number} tid - 主题ID。
   * @returns {Object} 购买记录
   * @async
   */
  async function getViewpayments(tid) {
    const infoDefaults = {
      state: false,
      dataRowCount: 0,
      error: "",
    };

    try {
      // 构建评分信息请求的URL
      const url = `/forum.php?mod=misc&action=viewpayments&tid=${tid}&infloat=yes&handlekey=pay&inajax=1&ajaxtarget=fwin_content_pay`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch Viewpayments info");
      // 解析服务器返回的XML数据
      const text = await response.text();
      const xml = new DOMParser().parseFromString(text, "text/xml");
      const htmlContent = xml.querySelector("root").textContent;
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");

      // 检查是否存在错误
      if (htmlContent.includes("alert_error")) {
        const alertErrorElement = doc.querySelector(".alert_error");
        const scriptElements = alertErrorElement.querySelectorAll("script");
        scriptElements.forEach((script) => script.remove());

        const errorMessage = alertErrorElement.textContent.trim();
        return { ...infoDefaults, error: errorMessage };
      }
      if (htmlContent.includes("目前没有用户购买此主题")) {
        return {
          state: true,
          dataRowCount: 0,
          error: "",
        };
      }

      // 提取购买信息
      var table = doc.querySelector("table.list"); // 选择class为list的table

      if (!table) {
        return {
          state: true,
          dataRowCount: 0,
          error: "",
        };
      }
      var rows = table.querySelectorAll("tr"); // 选中所有的行<tr>
      var dataRowCount = rows.length - 1; // 减去表头的一行
      return {
        state: true,
        dataRowCount: dataRowCount,
        error: "",
      };
    } catch (error) {
      showTooltip(error);
      return infoDefaults;
    }
  }

  // #endregion

  // #region 帖子置顶

  /**
   * 获取指定帖子的置顶信息。
   * @param {number} fid - 板块ID。
   * @param {number} tid - 主题ID。
   * @param {number} pid - 楼层ID。
   * @returns {Object} 置顶信息。
   * @async
   */
  async function getTopicadmin(fid, tid, pid) {
    const infoDefaults = {
      state: false,
      action: "",
      formhash: "",
      page: "",
      handlekey: "",
      error: "",
    };
    try {
      const formhash = getFormHash();

      // 构建评分信息请求的URL
      const url = `/forum.php?mod=topicadmin&action=stickreply&fid=${fid}&tid=${tid}&handlekey=mods&infloat=yes&nopost=yes&inajax=1`;
      const data = new URLSearchParams();
      data.append("formhash", formhash);
      data.append("optgroup", "");
      data.append("operation", "");
      data.append("listextra", "");
      data.append("page", 1);
      data.append("topiclist[]", pid);

      const request = new Request(url, {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: data,
      });

      const text = await fetch(request).then((r) => r.text());

      const xml = new DOMParser().parseFromString(text, "text/xml");
      const htmlContent = xml.querySelector("root").textContent;
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");

      // 检查是否存在错误
      if (htmlContent.includes("alert_error")) {
        const alertErrorElement = doc.querySelector(".alert_error");
        const scriptElements = alertErrorElement.querySelectorAll("script");
        scriptElements.forEach((script) => script.remove());

        const errorMessage = alertErrorElement.textContent.trim();
        return { ...infoDefaults, error: errorMessage };
      }

      // 提取评分信息
      const element = doc.querySelector("#topicadminform");
      if (!element) {
        return { ...infoDefaults, error: "提取置顶信息失败拉!" };
      }
      // 获取元素的action属性值
      const action =
        element.getAttribute("action").replace(/amp;/g, "") + "&inajax=1";
      const newformhash = element.querySelector('input[name="formhash"]').value;
      const page = element.querySelector('input[name="page"]').value;
      const handlekey = element.querySelector('input[name="handlekey"]').value;

      return {
        state: true,
        action,
        formhash: newformhash,
        page,
        handlekey,
        error: "",
      };
    } catch (error) {
      showTooltip(error);
      return infoDefaults;
    }
  }

  /**
   * 对指定的帖子进行置顶。
   * @param {number} pid - 帖子ID。
   * @async
   */
  async function topicadmin(pid, stickreply) {
    showWatermarkMessage();
    const tid = extractTid(window.location.href);
    let fid = getFidFromElement();

    if (!fid) {
      showTooltip("获取板块ID失败！");
      return;
    }
    const topicadminInfo = await getTopicadmin(fid, tid, pid);
    if (!topicadminInfo.state) {
      showTooltip(topicadminInfo.error);
      return;
    }
    const settings = getSettings();
    // 构建置顶请求的URL和数据
    const topicadminUrl = `/${topicadminInfo.action}`;
    const data = new URLSearchParams();
    data.append("formhash", topicadminInfo.formhash);
    data.append("fid", fid);
    data.append("tid", tid);
    data.append("topiclist[]", pid);
    data.append("page", topicadminInfo.page);
    data.append("handlekey", topicadminInfo.handlekey);
    data.append("stickreply", stickreply);
    data.append("reason", settings.logoText);
    data.append("sendreasonpm", "on");

    // 发送置顶请求
    const request = new Request(topicadminUrl, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data,
    });

    try {
      const responseText = await fetch(request).then((r) => r.text());

      // 根据响应内容提供置顶成功或失败的提示
      if (responseText.includes("操作成功 ")) {
        showTooltip(
          stickreply == "1"
            ? ` 置顶成功，并通知了楼主!`
            : ` 取消置顶成功，并通知了楼主!`
        );
      } else {
        showTooltip("抱歉，置顶失败！");
        console.error(responseText);
      }
    } catch (error) {
      showTooltip("置顶请求失败！");
      console.error(error);
    }
  }

  /**
   * 从指定的元素中提取fid值
   *
   * @param {string} elementId - 要查找的元素的ID。
   * @returns {string|null} 返回fid值，如果找不到则返回null。
   */
  function getFidFromElement() {
    // 通过ID查找页面上的元素
    let element = document.querySelector("#newspecial");
    // 如果元素不存在，返回null
    if (!element) return null;

    // 获取元素的onclick属性值
    let hrefValue = element.getAttribute("onclick");

    // 如果onclick属性不存在，返回null
    if (!hrefValue) return null;

    // 使用正则表达式匹配fid的值
    let match = /fid=(\d+)/.exec(hrefValue);

    // 如果匹配成功，返回fid的值，否则返回null
    return match ? match[1] : null;
  }

  // #endregion

  // #region 一键评分与收藏

  /**
   * 对首帖进行评分并收藏该帖子。
   * 1. 从页面中选择首帖元素。
   * 2. 从该元素获取帖子ID。
   * 3. 对帖子进行评分。
   * 4. 收藏该帖子。
   */
  function gradeAndStar() {
    // 获取首帖元素
    let firstPobClElement = document.querySelector(".po.hin");
    // 从首帖元素中提取帖子ID
    let pid = getTableIdFromElement(firstPobClElement);

    // 对首帖进行评分
    grade(pid);
    // 收藏首帖
    star();
  }

  // #endregion

  // #region 勋章操作

  /**
   * 判断是否应用设置
   * @param {number} setting - 设置值
   * @param {boolean} targetMatch - 目标匹配标志
   * @return {boolean} - 是否应用设置
   */
  function shouldApplySetting(setting, targetMatch) {
    return setting === 1 || (setting === 2 && targetMatch);
  }

  /**
   * 隐藏勋章
   * @param {HTMLImageElement} img - 勋章图片
   * @param {boolean} targetMatch - 目标匹配标志
   * @param {number} setting - 设置值
   */
  function hideMedal(img, targetMatch, setting) {
    if (shouldApplySetting(setting, targetMatch)) {
      img.style.display = "none";
    } else {
      img.style.display = "";
    }
  }

  /**
   * 调整勋章大小
   * @param {HTMLImageElement} img - 勋章图片
   * @param {boolean} targetMatch - 目标匹配标志
   * @param {number} setting - 设置值
   * @param {string} size - 新的图片大小
   */
  function resizeMedal(img, targetMatch, setting, size) {
    if (shouldApplySetting(setting, targetMatch)) {
      img.style.width = size;
    } else {
      img.style.width = "auto";
    }
  }

  /**
   * 替换勋章
   * @param {HTMLImageElement} img - 勋章图片
   * @param {boolean} targetMatch - 目标匹配标志
   * @param {number} setting - 设置值
   * @param {string} newUrl - 新的图片URL
   */
  function replaceMedal(img, targetMatch, setting, newUrl) {
    if (shouldApplySetting(setting, targetMatch)) {
      img.src = newUrl;
      img.style.width = "50px";
    }
  }

  /**
   * 主要的勋章操作函数
   * @param {object} settings - 设置对象
   */
  function manipulateMedals(settings) {
    const excludeNumbers = [
      17, 29, 31, 32, 33, 34, 35, 36, 37, 38, 110, 111, 112, 113, 114, 116, 117,
    ];
    const targetMedalNumbers = Array.from({ length: 122 }, (_, i) => i + 14)
      .filter((num) => !excludeNumbers.includes(num))
      .map((num) => `medal${num}`);

    document.querySelectorAll(".md_ctrl img").forEach((img) => {
      const imgSrc = img.src;
      const targetMatch = targetMedalNumbers.some((target) =>
        imgSrc.includes(target)
      );

      hideMedal(img, targetMatch, settings.blockMedals);
      resizeMedal(img, targetMatch, settings.resizeMedals, settings.imageSize);
      replaceMedal(img, targetMatch, settings.replaceMedals, settings.imageUrl);
    });
  }

  // #endregion

  // #region 用户内容屏蔽

  /**
   * 根据设置屏蔽指定用户的内容
   * @param {object} settings - 设置对象，包含被屏蔽的用户列表和显示消息选项
   */
  function blockContentByUsers(settings) {
    const { blockedUsers, displayBlockedTips } = settings;
    blockedUsers.forEach((userID) => {
      const actions = [
        //屏蔽帖子列表页
        createBlockAction(
          `//table//tr[1]/td[2]//cite/a[text()="${userID}"]/ancestor::tbody[1]`,
          `<tr>
                  <td class='icn'>
                    <img src='static/image/common/folder_common.gif' />
                  </td>
                  <th class='common'>
                    <b>已屏蔽主题 <font color=grey></th>
                  <td class='by'>
                    <cite><font color=grey>${userID}</font></cite>
                  </td>
                  <td class='num'></td>
                  <td class='by'></td>
                </tr>`
        ),
        //屏蔽搜索列表页

        createBlockAction(
          `//ul/li[p[3]/span[2]/a[text()='${userID}']]`,
          `
                  <li class="pbw" >
                  <p>
                  <span>
                  已屏蔽"${userID}"
                  </span>
                  </p>
                  </li>
                  `
        ),
        // createBlockAction('//table/tbody[tr[1]/td[1]//a[text()="' + userID + '"]]', "<p><center>已屏蔽 <font color=grey>" + userID + "</font></center></p>"),
        // createBlockAction('//blockquote[font/a/font[contains(text(),"' + userID + '")]]', "<p>已屏蔽引用 <font color=grey>" + userID + "</font>的言论</p>"),
        // createBlockAction('//table/tbody[tr[1]/th[1]//a[contains(text(),"' + userID + '")]]', ""),
      ];

      actions.forEach(applyBlockAction(displayBlockedTips));
    });
  }

  /**
   * 根据设置的关键词屏蔽帖子标题
   * @param {object} settings - 设置对象，包含被屏蔽的用户列表和显示消息选项
   */
  function blockContentByTitle(settings) {
    const { excludePostOptions, displayBlockedTips } = settings;
    excludePostOptions.forEach((keyword) => {
      const actions = [
        //屏蔽帖子列表页
        // /table/tbody[12]/tr/th/a[2]
        createBlockAction(
          `//table/tbody/tr/th/a[2][contains(text(),'${keyword}')]/ancestor::tbody[1]`,
          `<tr>
                    <td class='icn'>
                      <img src='static/image/common/folder_common.gif' />
                    </td>
                    <th class='common'>
                      <b>已屏蔽主题关键词:${keyword} <font color=grey></th>
                    <td class='by'>
                      <cite><font color=grey></font></cite>
                    </td>
                    <td class='num'></td>
                    <td class='by'></td>
                  </tr>`
        ),
      ];

      actions.forEach(applyBlockAction(displayBlockedTips));
    });
  }

  /**
   * 创建一个屏蔽动作
   * @param {string} xpath - XPath查询字符串，用于查找要屏蔽的元素
   * @param {string} message - 要显示的消息，当内容被屏蔽时
   * @return {object} - 包含XPath查询和消息的对象
   */
  function createBlockAction(xpath, message) {
    return { xpath, message };
  }

  /**
   * 应用屏蔽动作
   * @param {boolean} displayBlockedTips - 是否显示屏蔽消息
   * @return {function} - 一个函数，该函数接受一个屏蔽动作并应用它
   */
  function applyBlockAction(displayBlockedTips) {
    return function (action) {
      const elements = document.evaluate(
        action.xpath,
        document,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      for (let i = 0; i < elements.snapshotLength; i++) {
        if (displayBlockedTips) {
          elements.snapshotItem(i).innerHTML = action.message;
        } else {
          elements.snapshotItem(i).style.display = "none";
        }
      }
    };
  }

  // #endregion

  // #region 划词搜索功能

  /**
   * 响应用户的文本选择，用于显示搜索选项。
   * @param {Event} e - 事件对象
   */
  function selectSearch(e) {
    const LEFT_MOUSE_BUTTON = 0;
    const MIN_TEXT_LENGTH = 2;
    const forbiddenTags = ["INPUT", "TEXTAREA"];

    // 确保是左键点击
    if (e.button !== LEFT_MOUSE_BUTTON) return;

    // 如果活动元素是输入框或文本区域，则不处理
    const activeElementTag = document.activeElement.tagName.toUpperCase();
    if (forbiddenTags.includes(activeElementTag)) return;

    const selectedText = window.getSelection().toString().trim();

    // 移除已存在的搜索菜单，如果选中的文本过短
    if (selectedText.length < MIN_TEXT_LENGTH) {
      removeSearchMenu();
      return;
    }

    // 如果没有现有的搜索菜单，创建并显示一个
    if (!document.querySelector(".bgsh-sav-menu")) {
      const searchPopup = createSearchPopup(selectedText);
      displaySearchPopup(e.pageX, e.pageY, searchPopup);
    }
  }

  /**
   * 移除已存在的搜索菜单
   */
  function removeSearchMenu() {
    const searchMenu = document.querySelector(".bgsh-sav-menu");
    if (searchMenu) searchMenu.remove();
  }

  /**
   * 在页面上的指定位置显示搜索菜单
   * @param {number} x - 菜单的x坐标
   * @param {number} y - 菜单的y坐标
   * @param {Element} element - 要显示的元素
   */
  function displaySearchPopup(x, y, element) {
    const rect = element.getBoundingClientRect();
    Object.assign(element.style, {
      left: `${x - rect.width / 2}px`,
      top: `${y}px`,
      position: "absolute",
    });
    document.body.appendChild(element);
  }

  /**
   * 根据所选文本创建搜索菜单元素
   * @param {string} selectedText - 所选的文本内容
   * @return {Element} - 创建的按钮元素
   */
  function createSearchPopup(selectedText) {
    const button = document.createElement("button");
    button.classList.add("bgsh-sav-menu", "bgsh-searchBtn");
    button.setAttribute("type", "button");

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("savlink", "savsehuatang");
    innerDiv.setAttribute("data-avid", selectedText);
    innerDiv.textContent = `搜索: ${selectedText}`;
    button.appendChild(innerDiv);

    button.addEventListener("click", handleSearchPopupClick);
    return button;
  }

  /**
   * 处理搜索弹窗点击事件
   * @param {Event} e - 事件对象
   */
  function handleSearchPopupClick(e) {
    const target = e.target;
    if (target.classList.contains("savsehuatang")) {
      target.classList.remove("savsehuatang");
      searchSehuatang(target.dataset.avid);
    }
    removeSearchMenu();
  }

  /**
   * 在Sehuatang中执行搜索
   * @param {string} query - 搜索查询词
   */
  function searchSehuatang(query) {
    const formhash = getFormHash();
    const openSearch = () => window.open(`${baseURL}/search.php`, "_blank");

    if (!formhash) {
      copyToClipboard(query).then(openSearch);
      return;
    }

    const formDataString = `formhash=${encodeURIComponent(
      formhash
    )}&srchtxt=${encodeURIComponent(query)}&searchsubmit=yes`;

    GM_xmlhttpRequest({
      method: "POST",
      url: `${baseURL}/search.php?mod=forum`,
      data: formDataString, // 转换为字符串形式发送
      redirect: "manual",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Origin: baseURL,
        Referer: baseURL,
      },
      onload: function (response) {
        console.log(response);
        if (response.status === 301 || response.status === 302) {
          var headers = response.responseHeaders.split("\n");
          var locationHeader = headers.find((header) =>
            header.toLowerCase().startsWith("location:")
          );
          if (locationHeader) {
            var location = locationHeader.split(":")[1].trim();
            window.open(`${baseURL}/${location}`, "_blank");
          }
        } else {
          if (response.finalUrl.includes("searchmd5")) {
            showTooltip(
              "目前因论坛限制划词搜索只支持Tampermonkey BETA,请下载BETA版并移除本版本后再进行使用本功能"
            );
            return;
          }
          var htmlString = response.responseText;
          // 将 HTML 字符串解析为一个 DOM 节点
          var parser = new DOMParser();
          var doc = parser.parseFromString(htmlString, "text/html");

          // 获取 id="messagetext"
          var messagetextElement = doc.getElementById("messagetext");
          if (messagetextElement) {
            var firstPElement = messagetextElement.querySelector("p"); // 使用 querySelector 来获取第一个 <p> 标签
            if (firstPElement) {
              showTooltip(firstPElement.textContent);
              return;
            }
          }
        }
      },
      onerror: function (error) {
        console.error("GM_xmlhttpRequest error:", error);
      },
    });
  }

  // #endregion

  // #region 无缝翻页

  /**
   * 初始化无限滚动功能
   * 根据用户的滚动行为来加载下一页的内容。
   *
   * @param {string} pageName 页面名称，用于确定要加载哪种内容
   */
  function initInfiniteScroll(pageName) {
    let isLoading = false;
    let noMoreData = false;
    const settings = getSettings();

    // 根据传入的页面名称决定内容选择器
    let contentSelector;
    switch (pageName) {
      case "isSearchPage":
      case "isForumDisplayPage":
        contentSelector = "#threadlist";
        break;
      case "isPostPage":
        contentSelector = "#postlist";
        break;
      case "isSpacePage":
        contentSelector = "#delform";
        break;
      case "isMySpacePage":
        contentSelector = "#threadlist";
        break;
      case "isShowdarkroomPage":
        contentSelector = "#darkroomtable";
        break;
      case "isMyfavoritePage":
        contentSelector = "#favorite_ul";
        break;
      default:
        contentSelector = "#threadlist"; // 默认选择器
    }

    if (!settings.autoPagination) {
      return;
    }

    /**
     * 加载下一个页面的内容。
     * 获取当前页面中的“下一页”链接，然后抓取该链接的内容，
     * 并将新内容添加到当前页面。
     */
    async function loadNextPage() {
      const nextPageLink = document.querySelector(".nxt");
      if (!nextPageLink || noMoreData) {
        if (!noMoreData) {
          showTooltip("已经是全部数据了");
          noMoreData = true;
        }
        return;
      }

      isLoading = true;
      const url = nextPageLink.getAttribute("href");

      const response = await fetch(url);
      const text = await response.text();

      const div = document.createElement("div");
      div.innerHTML = text;

      const newNextPageLink = div.querySelector(".nxt");
      newNextPageLink
        ? nextPageLink.setAttribute(
            "href",
            newNextPageLink.getAttribute("href")
          )
        : (noMoreData = true);

      appendNewContent(div.querySelector(contentSelector));

      updatePagination(div.querySelector(".pg"));

      const newSettings = getSettings();
      await processPageContentBasedOnSettings(pageName, newSettings);
      blockContentByUsers(settings);
      isLoading = false;
      checkAndLoadIfContentNotEnough();
    }

    /**
     * 将新页面中的内容添加到当前页面。
     * @param {Element} newContent 新的内容元素
     */
    function appendNewContent(newContent) {
      const currentContent = document.querySelector(contentSelector);
      newContent.childNodes.forEach((child) =>
        currentContent.appendChild(child.cloneNode(true))
      );
    }

    /**
     * 更新页面上的分页元素（页码）为新页面中的分页元素。
     * @param {Element} newPgElement 新的分页元素
     */
    function updatePagination(newPgElement) {
      const currentPageElements = document.querySelectorAll(".pg");
      currentPageElements.forEach(
        (pg) => (pg.innerHTML = newPgElement.innerHTML)
      );
    }

    /**
     * 根据页面名称和设置处理页面内容。
     * @param {string} pageName 页面名称
     * @param {Object} settings 用户设置
     */
    async function processPageContentBasedOnSettings(pageName, settings) {
      if (pageName == "isSearchPage") {
        filterElementsBasedOnSettings(settings);
        displayAdvanThreadImages(settings);
      } else if (pageName == "isForumDisplayPage") {
        if (settings.enableTitleStyle) {
          stylePosts(settings);
        }
        removeAD2();
        const currentURL = window.location.href;
        const queryParams = getQueryParams(currentURL);
        const fid = queryParams.fid;
        if (fid == 143 || fid == "143") {
          blockingResolvedAction(settings);
          isOnlyShowMoneyAction(settings);
        }
        if (fid == 166 || fid == "166" || fid == 97 || fid == "97") {
          await displayThreadBuyInfo(settings);
        }
        blockContentByTitle(settings);
        displayThreadImages(settings);
      } else if (pageName == "isPostPage") {
        replacePMonPost();
        appendTitleFromHotImage();
        appendBuyNumber();
        showAvatarEvent();
        const userid = getUserId();
        if (userid) {
          // addQuickGradeToPostButton();//已失效和谐
          addQuickActionToPostButton();
        }
        removeAD3();
        manipulateMedals(settings); // 修改用户勋章显示
      } else if (pageName == "isMySpacePage" || pageName == "isSpacePage") {
        displayThreadBuyInfoOther(settings);
      }
    }

    /**
     * 检查页面内容是否已经填满视窗，如果没有，则加载下一页内容。
     */
    function checkAndLoadIfContentNotEnough() {
      if (document.body.offsetHeight <= window.innerHeight && !isLoading) {
        loadNextPage();
      }
    }

    window.addEventListener("scroll", () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        !isLoading
      ) {
        loadNextPage();
      }
    });

    checkAndLoadIfContentNotEnough();
  }

  /**
   * 根据提供的设置过滤页面上的元素
   * @param {Object} settings 用户设置
   */
  function filterElementsBasedOnSettings(settings) {
    const pbwElements = document.querySelectorAll(".pbw");

    pbwElements.forEach((pbw) => {
      let shouldDisplay = shouldElementBeDisplayed(pbw, settings);
      pbw.style.display = shouldDisplay ? "block" : "none";
    });
  }

  /**
   * 确定给定的元素是否应该根据提供的设置显示在页面上
   * @param {Element} element 待检查的元素
   * @param {Object} settings 用户设置
   * @returns {boolean} 根据设置是否应显示元素
   */
  function shouldElementBeDisplayed(element, settings) {
    if (settings.TIDGroup && settings.TIDGroup.length) {
      const aElement = element.querySelector(".xi1");
      if (!aElement || !doesTIDGroupMatch(aElement, settings.TIDGroup)) {
        return false;
      }
    }

    if (settings.excludeGroup && settings.excludeGroup.length) {
      const pElement = element.querySelector("p:nth-of-type(2)");
      const xs3Element = element.querySelector(".xs3");

      if (
        isExcludedByKeyword(pElement, settings.excludeGroup) ||
        isExcludedByKeyword(xs3Element, settings.excludeGroup)
      ) {
        return false;
      }
    }

    return true;
  }

  /**
   * 检查给定的元素链接是否与提供的TIDGroup中的任何ID匹配
   * @param {Element} aElement 待检查的链接元素
   * @param {Array} TIDGroup TID组
   * @returns {boolean} 是否与TID组匹配
   */
  function doesTIDGroupMatch(aElement, TIDGroup) {
    const href = aElement.getAttribute("href");

    // 判断是否匹配 fid=${tid} 或 forum=${tid} 的格式
    return TIDGroup.some(
      (tid) => href.includes(`fid=${tid}`) || href.includes(`forum-${tid}`)
    );
  }

  /**
   * 检查给定的元素内容是否包含提供的排除关键字列表中的任何关键字
   * @param {Element} element 待检查的元素
   * @param {Array} excludeGroup 排除关键字组
   * @returns {boolean} 是否包含关键字
   */
  function isExcludedByKeyword(element, excludeGroup) {
    if (!element) return false;
    const text = element.textContent.toLowerCase();
    return excludeGroup.some((keyword) => text.includes(keyword.toLowerCase()));
  }

  // #endregion

  // #region 帖子列表页执行的方法

  /**
   * 创建“快速发帖”按钮，用于快速本板块发帖
   * @return {HTMLElement} 按钮元素
   */
  function createFastPostButton() {
    return createButton("fastPostButton", "快速发帖", function () {
      let fid = getFidFromElement();
      showWindow("newthread", `forum.php?mod=post&action=newthread&fid=${fid}`);
    });
  }

  /**
   * 添加日期范围选择器和“打开”按钮到页面
   * @param {HTMLElement|string} targetElementOrId - 参考元素或其ID (将在此元素之后插入日期选择器和按钮)
   */
  function addDateRangeSelectorAndButton(targetElementOrId) {
    const refElement =
      typeof targetElementOrId === "string"
        ? document.getElementById(targetElementOrId)
        : targetElementOrId;

    if (!refElement) return;

    // 创建日期选择框
    const startDateInput = createDateInput("startDateSelector");
    const endDateInput = createDateInput("endDateSelector");

    // 创建并绑定点击事件到“打开”按钮
    const openButton = createButton(
      "openAllUrlButton",
      "批量打开帖子",
      () => filterAndOpenThreadsByDate(),
      "bgsh-openAllUrlBtn",
      "#f6211c"
    );

    // 插入元素到页面中
    refElement.after(openButton);
    refElement.after(endDateInput);
    refElement.after(document.createTextNode("到"));
    refElement.after(startDateInput);
  }

  /**
   * 过滤并在新窗口中打开选定日期范围内的帖子链接。
   */
  function filterAndOpenThreadsByDate() {
    // 获取用户指定的开始和结束日期
    const startDateValue = document.getElementById("startDateSelector").value;
    const endDateValue = document.getElementById("endDateSelector").value;

    // 转换日期字符串为 Date 对象
    const startDate = new Date(startDateValue);
    const endDate = new Date(endDateValue);

    // 选择页面上的所有帖子
    const posts = document.querySelectorAll("#threadlisttableid tbody tr");

    posts.forEach((post) => {
      const spanSpanElement = post.querySelector("td.by em span span");
      const spanElement = post.querySelector("td.by em span");

      let postDateStr = "";
      if (spanSpanElement) {
        // 如果存在td.by em span span，则获取其title属性作为日期字符串
        postDateStr = spanSpanElement.getAttribute("title");
      } else if (spanElement) {
        // 否则，如果存在td.by em span，则获取其文本内容作为日期字符串
        postDateStr = spanElement.textContent;
      }

      if (postDateStr) {
        const postDate = new Date(postDateStr);

        // 检查帖子的日期是否在用户指定的日期范围内
        if (postDate >= startDate && postDate <= endDate) {
          // 尝试从帖子中获取链接元素
          const linkElement = post.querySelector(".s.xst");
          if (linkElement) {
            // 在新窗口中打开帖子链接
            window.open(linkElement.href, "_blank");
          }
        }
      } else {
        console.warn("未找到日期信息");
      }
    });
  }

  /**
   * 创建时间排序按钮
   * @param {Object} settings - 用户的设置
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createTimeSortButton(settings, buttonContainer) {
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    const hasOrderBy = queryParams.orderby === "dateline";
    const isFidInOrder = settings.orderFids.includes(fid);

    const setText = (isOrder) => {
      return isOrder ? "当前列表\n时间排序" : "当前列表\n默认排序";
    };

    const initialButtonText = setText(isFidInOrder);

    const timeSortButton = createButton(
      "timeSortButton",
      initialButtonText,
      function () {
        if (isFidInOrder) {
          timeSortButton.innerText = setText(false);
          if (hasOrderBy) {
            const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
            window.location.href = newURL;
          }
          settings.orderFids = settings.orderFids.filter(
            (existingFid) => existingFid !== fid
          );
        } else {
          timeSortButton.innerText = setText(true);
          if (!hasOrderBy) {
            const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
            window.location.href = newURL;
          }
          settings.orderFids.push(fid);
        }
        GM_setValue("orderFids", JSON.stringify(settings.orderFids));
      }
    );

    buttonContainer.appendChild(timeSortButton);
  }

  /**
   * 处理帖子列表页面的初始状态，可能会重定向
   * @param {Object} settings - 用户的设置
   */
  function handleInitialPageState(settings) {
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    const hasOrderBy = queryParams.orderby === "dateline";

    // 检查当前fid是否存在于orderFids中
    const isFidInOrder = settings.orderFids.includes(fid);

    if (isFidInOrder && !hasOrderBy) {
      // 如果上次是时间排序，但现在URL没有orderby=dateline，则需要重定向
      const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}&filter=author&orderby=dateline`;
      window.location.href = newURL;
    } else if (!isFidInOrder && hasOrderBy) {
      // 如果上次是默认排序，但现在URL有orderby=dateline，则需要重定向
      const newURL = `${baseURL}/forum.php?mod=forumdisplay&fid=${fid}`;
      window.location.href = newURL;
    }
  }

  /**
   * 插入帖子内的前三张图片到帖子标题下方
   */

  async function displayThreadImages(settings) {
    if (!settings.displayThreadImages) {
      return;
    }
    const postLinks = document.querySelectorAll(".s.xst");

    for (let link of postLinks) {
      let threadURL = link.href;

      try {
        let response = await fetch(threadURL);
        let pageContent = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(pageContent, "text/html");
        let imgElements = doc.querySelectorAll("img.zoom");

        // 过滤图片
        imgElements = Array.from(imgElements)
          .filter((img) => {
            let fileValue = img.getAttribute("file");
            return (
              fileValue &&
              !fileValue.includes("static") &&
              !fileValue.includes("hrline")
            );
          })
          .slice(0, 3);

        if (!imgElements.length) continue;
        const tbodyRef = link.closest("tbody");
        // Check if the tbody with the specific ID already exists. If it does, we skip this iteration.
        if (
          tbodyRef.nextElementSibling &&
          tbodyRef.nextElementSibling.id === "imagePreviewTbody"
        ) {
          continue;
        }

        // 创建新的图片容器
        const newTbody = document.createElement("tbody");
        newTbody.id = "imagePreviewTbody"; // Assigning the unique ID to the tbody
        const newTr = document.createElement("tr");
        const newTd = document.createElement("td");
        const imgContainer = document.createElement("div");
        imgContainer.style.display = "flex";

        imgElements.forEach((imgEl) => {
          let img = document.createElement("img");
          img.src = imgEl.getAttribute("file");
          img.style.width = "300px";
          img.style.height = "auto";
          img.style.maxWidth = "300px";
          img.style.maxHeight = "300px";
          img.style.marginRight = "10px";
          imgContainer.appendChild(img);
        });

        newTd.appendChild(imgContainer);
        newTr.appendChild(newTd);
        newTbody.appendChild(newTr);

        link.closest("tbody").after(newTbody);
      } catch (e) {
        console.error("Error fetching or processing:", e);
      }
    }
  }

  /**
   * 插入购买记录到帖子标题下方
   */

  async function displayThreadBuyInfo(settings) {
    if (!settings.displayThreadBuyInfo) {
      return;
    }
    var links = document.querySelectorAll("a.s.xst"); // 选择所有class为"s xst"的<a>元素
    links.forEach(async function (link) {
      var href = link.href;
      var tid = extractTid(href); // 从URL中获取tid参数

      if (tid) {
        var buyInfo = await getViewpayments(tid); // 用于获取购买信息
        if (buyInfo.state) {
          var dataRowCount = buyInfo.dataRowCount;
          if (link) {
            // 在 link 的父元素中查找 id 为 "baoguobuyinfouniqueSpanId" 的元素
            const existingSpan = link.parentNode.querySelector(
              "#baoguobuyinfouniqueSpanId"
            );

            // 如果不存在这样的 span 元素，则创建并插入一个新的
            if (!existingSpan) {
              const span = document.createElement("span");
              span.id = "baoguobuyinfouniqueSpanId"; // 设置 span 的 ID
              span.style.cssText =
                "font-size: larger; font-weight: bold; color: red;"; // 设置样式
              span.textContent = ` [购买${dataRowCount}次]`;
              if (settings.enableTitleStyle) {
                span.style.fontSize = `${settings.titleStyleSize}px`;
              }

              // 将 <span> 插入到 <a> 后面
              link.parentNode.insertBefore(span, link.nextSibling);
            }
          }
        }
      }
    });
  }
  /**
   * 其他页面插入购买记录到帖子标题下方
   */

  async function displayThreadBuyInfoOther(settings) {
    if (!settings.displayThreadBuyInfo) {
      return;
    }

    // 获取所有<th>标签
    var thElements = document.querySelectorAll("th");

    thElements.forEach(async (th) => {
      // 在当前<th>标签中查找第一个<a>元素
      var aElement = th.querySelector("a");

      // 如果存在<a>元素
      if (aElement) {
        // 获取当前<th>标签的下一个兄弟元素，应为<td>
        var nextTd = th.nextElementSibling;

        // 确保这个兄弟元素是<td>并且包含<a>元素
        if (nextTd && nextTd.tagName === "TD") {
          var tdLink = nextTd.querySelector("a");

          // 如果<td>中有<a>元素
          if (tdLink) {
            // 检查这个<a>的href属性是否包含特定的fid
            if (/fid=166|fid=97|forum-166|forum-97/.test(tdLink.href)) {
              // 执行特定操作，比如打印信息
              var href = aElement.href;
              var tid = extractTid(href); // 从URL中获取tid参数

              if (tid) {
                var buyInfo = await getViewpayments(tid); // 用于获取购买信息
                if (buyInfo.state) {
                  var dataRowCount = buyInfo.dataRowCount;

                  // 在 link 的父元素中查找 id 为 "baoguobuyinfouniqueSpanId" 的元素
                  const existingSpan = aElement.parentNode.querySelector(
                    "#baoguobuyinfouniqueSpanId"
                  );

                  // 如果不存在这样的 span 元素，则创建并插入一个新的
                  if (!existingSpan) {
                    const span = document.createElement("span");
                    span.id = "baoguobuyinfouniqueSpanId"; // 设置 span 的 ID
                    span.style.cssText =
                      "font-size: larger; font-weight: bold; color: red;"; // 设置样式
                    span.textContent = ` [购买${dataRowCount}次]`;

                    // 将 <span> 插入到 <a> 后面
                    aElement.parentNode.insertBefore(
                      span,
                      aElement.nextSibling
                    );
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  /**
   * 插入帖子内的前三张图片到帖子标题下方
   */

  async function displayAdvanThreadImages(settings) {
    if (!settings.displayThreadImages) {
      return;
    }
    const h3Elements = document.querySelectorAll("h3.xs3");

    for (let h3Element of h3Elements) {
      const aElement = h3Element.querySelector("a");
      if (aElement) {
        let url = aElement.href;
        try {
          let response = await fetch(url);
          let pageContent = await response.text();
          let parser = new DOMParser();
          let doc = parser.parseFromString(pageContent, "text/html");
          let imgElements = doc.querySelectorAll("img.zoom");

          // 过滤图片
          imgElements = Array.from(imgElements)
            .filter((img) => {
              let fileValue = img.getAttribute("file");
              return (
                fileValue &&
                !fileValue.includes("static") &&
                !fileValue.includes("hrline")
              );
            })
            .slice(0, 3);

          if (!imgElements.length) continue;
          const closestLi = h3Element.closest("li");
          if (closestLi.querySelector("tbody, #imagePreviewTbody")) {
            continue;
          }

          // 创建新的图片容器
          const newTbody = document.createElement("tbody");
          newTbody.id = "imagePreviewTbody"; // Assigning the unique ID to the tbody
          const newTr = document.createElement("tr");
          const newTd = document.createElement("td");
          const imgContainer = document.createElement("div");
          imgContainer.style.display = "flex";

          imgElements.forEach((imgEl) => {
            let img = document.createElement("img");
            img.src = imgEl.getAttribute("file");
            img.style.width = "300px";
            img.style.height = "auto";
            img.style.maxWidth = "300px";
            img.style.maxHeight = "300px";
            img.style.marginRight = "10px";
            imgContainer.appendChild(img);
          });

          newTd.appendChild(imgContainer);
          newTr.appendChild(newTd);
          newTbody.appendChild(newTr);

          // h3Element.closest("li").after(newTbody);
          if (closestLi) {
            closestLi.appendChild(newTbody);
          }
        } catch (e) {
          console.error("Error fetching or processing:", e);
        }
      }
    }
  }

  /**
   * 处理帖子列表页面，设置页面状态、样式、内容屏蔽、时间排序和无限滚动
   * @param {Object} settings - 用户的设置
   * @param {Element} buttonContainer - 按钮容器元素
   */
  async function handleForumDisplayPage(settings, buttonContainer) {
    handleInitialPageState(settings);
    if (settings.enableTitleStyle) {
      stylePosts(settings);
    }
    removeAD2();

    removeFastPost();
    createTimeSortButton(settings, buttonContainer);
    blockContentByTitle(settings);
    displayThreadImages(settings);
    const currentURL = window.location.href;
    const queryParams = getQueryParams(currentURL);
    const fid = queryParams.fid;
    if (fid == 143 || fid == "143") {
      blockingResolvedAction(settings);
      isOnlyShowMoneyAction(settings);
      const blockingResolvedText =
        settings.blockingResolved == true ? "显示解决" : "屏蔽解决";
      const blockingResolvedButton = createButton(
        "blockingResolvedBtn",
        blockingResolvedText,
        function () {
          if (blockingResolvedButton.innerText === "显示解决") {
            blockingResolvedButton.innerText = "屏蔽解决";
            GM_setValue("blockingResolved", false);
            location.reload();
          } else {
            blockingResolvedButton.innerText = "显示解决";
            GM_setValue("blockingResolved", true);
            location.reload();
          }
        }
      );
      buttonContainer.appendChild(blockingResolvedButton);

      const isOnlyShowMoneyText =
        settings.isOnlyShowMoney == true ? "显示全部" : "只看现金";
      const isOnlyShowMoneyButton = createButton(
        "isOnlyShowMoneyBtn",
        isOnlyShowMoneyText,
        function () {
          if (isOnlyShowMoneyButton.innerText === "显示全部") {
            isOnlyShowMoneyButton.innerText = "只看现金";
            GM_setValue("isOnlyShowMoney", false);
            location.reload();
          } else {
            isOnlyShowMoneyButton.innerText = "显示全部";
            GM_setValue("isOnlyShowMoney", true);
            location.reload();
          }
        }
      );
      buttonContainer.appendChild(isOnlyShowMoneyButton);
    }
    if (fid == 166 || fid == "166" || fid == 97 || fid == "97") {
      await displayThreadBuyInfo(settings);
    }

    const userid = getUserId();
    if (userid && settings.showFastPost) {
      buttonContainer.appendChild(createFastPostButton());
    }
    const targetElement = document.querySelector(".xs1.xw0.i");
    addDateRangeSelectorAndButton(targetElement);
    initInfiniteScroll("isForumDisplayPage");
  }

  /**
   * 移除帖子列表页广告
   */
  async function removeAD2() {
    document.querySelectorAll(".show-text2").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除列表底部的快速发帖
   */
  function removeFastPost() {
    document.querySelectorAll("#f_pst").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除帖子列表页已解决的帖子
   */
  async function blockingResolvedAction(settings) {
    if (settings.blockingResolved) {
      const currentURL = window.location.href;
      const queryParams = getQueryParams(currentURL);
      const fid = queryParams.fid;

      // 获取页面上所有的 tbody 元素
      const tbodies = document.querySelectorAll("tbody");

      // 遍历每个 tbody 元素
      tbodies.forEach((tbody) => {
        // 检查 tbody 的文本内容是否包含指定的字符串
        if (tbody.textContent.includes("[已解决]")) {
          // 如果包含，移除这个 tbody 元素
          tbody.remove();
        }
      });
    }
  }

  /**
   * 帖子列表页只显示E卡
   */
  async function isOnlyShowMoneyAction(settings) {
    if (!settings.isOnlyShowMoney) {
      return; // 如果设置不启用，直接返回
    }

    const tbodies = document.querySelectorAll("tbody");
    const keywords = ["E卡", "e卡", "话费"]; // 关键词列表
    const excludedSelectors = ["#scbar_txt", "#scbar_btn", "#scbar_type"]; // 不应被移除的元素的选择器

    tbodies.forEach((tbody) => {
      // 检查tbody是否包含排除的选择器中的任何一个元素
      const isExcluded = excludedSelectors.some((selector) =>
        tbody.querySelector(selector)
      );
      if (isExcluded) {
        return; // 如果包含排除元素，则不移除此tbody
      }

      // 检查是否包含任何关键词
      const containsKeyword = keywords.some((keyword) =>
        tbody.textContent.includes(keyword)
      );
      if (!containsKeyword) {
        tbody.remove(); // 如果不包含关键词且没有排除标识，则移除
      }
    });
  }

  // #endregion

  // #region 搜索页执行的方法

  /**
   * 处理搜索页面，包括增加高级搜索、添加页码、基于设置过滤元素和初始化无限滚动
   * @param {Object} settings - 用户的设置
   */
  function handleSearchPage(settings) {
    replaceImageSrc();
    addAdvancedSearch(settings);
    addPageNumbers();
    filterElementsBasedOnSettings(settings);
    initInfiniteScroll("isSearchPage");
    displayAdvanThreadImages(settings);
  }

  // #endregion

  // #region 帖子内容页执行方法

  /**
   * 创建“复制内容”按钮，用于快速复制本帖内容
   * @return {HTMLElement} 按钮元素
   */
  function createFastCopyButton() {
    return createButton("fastCopyButton", "复制帖子", function () {
      var content = document.querySelector(".t_f");
      var secondContent = document.querySelectorAll(".t_f")[1];
      var resultHtml = "";
      if (content) {
        resultHtml += processContent(content);
      }
      if (secondContent && secondContent.querySelectorAll("img").length > 3) {
        resultHtml += processContent(secondContent);
      }
      if (resultHtml !== "") {
        copyToClipboard(resultHtml);
        copyToClipboard(
          resultHtml,
          () => showTooltip("内容已复制!"),
          (err) => showTooltip("复制失败: ", err)
        );
      } else {
        showTooltip("复制失败: 没有找到相应内容");
      }
    });
  }

  /**
   * 处理指定的内容
   * @param {string} content html文本
   * @return {cleanedHtml} 处理好的内容
   */

  function processContent(content) {
    var html = content.innerHTML;
    var cleanedHtml = removeElementsByClass(
      html,
      ["pstatus", "tip_4"],
      [
        "font",
        "div",
        "ignore_js_op",
        "br",
        "ol",
        "li",
        "strong",
        "a",
        "i",
        "table",
        "tbody",
        "tr",
        "td",
        "blockquote",
      ],
      ["em"]
    );
    cleanedHtml = removeNbspAndNewlines(cleanedHtml);
    cleanedHtml = removeElementsByIdPrefix(cleanedHtml, "attach_");

    return cleanedHtml;
  }

  /**
   * 移除不需要的内容
   * @param {string} htmlString html文本
   * @return {stringWithoutNbsp} 链接
   */

  function removeNbspAndNewlines(htmlString) {
    var stringWithoutNbsp = htmlString.replace(/&nbsp;/g, "");
    stringWithoutNbsp = stringWithoutNbsp.replace(/&amp;/g, "");
    stringWithoutNbsp = stringWithoutNbsp.replace(/\n+/g, "\n");
    stringWithoutNbsp = stringWithoutNbsp.replace(/\\baoguo/g, "\n");
    return stringWithoutNbsp;
  }

  /**
   * 处理指定的内容
   * @param {string} htmlString html文本
   * @param {string} classList class列表
   * @param {string} tagsToRemove tags
   * @param {string} tagsToAllRemove tags
   * @return {doc.body.innerHTML} 处理好的内容
   */

  function removeElementsByClass(
    htmlString,
    classList,
    tagsToRemove,
    tagsToAllRemove
  ) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    classList.forEach(function (className) {
      var elements = doc.querySelectorAll("." + className);
      elements.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    });
    tagsToRemove.forEach(function (tagName) {
      var elements = doc.querySelectorAll(tagName);
      elements.forEach(function (element) {
        while (element.firstChild) {
          element.parentNode.insertBefore(element.firstChild, element);
        }
        element.parentNode.removeChild(element);
      });
    });
    tagsToAllRemove.forEach(function (tagName) {
      var elements = doc.querySelectorAll(tagName);

      elements.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    });
    var imgElements = doc.querySelectorAll("img");
    imgElements.forEach(function (img) {
      var fileAttr = img.getAttribute("file");
      if (fileAttr) {
        var fileText =
          (fileAttr.includes("static/image") ? "" : fileAttr) + "\\baoguo";
        var textNode = document.createTextNode(fileText);
        img.parentNode.replaceChild(textNode, img);
      } else {
        var srcAttr = img.getAttribute("src");
        if (srcAttr) {
          var srcText =
            (srcAttr.includes("static/image") ? "" : srcAttr) + "\\baoguo";
          var textNode1 = document.createTextNode(srcText);
          img.parentNode.replaceChild(textNode1, img);
        }
      }
    });
    return doc.body.innerHTML;
  }

  /**
   * 移除包含指定的内容的元素
   * @param {string} htmlString html文本
   * @param {string} idPrefix 指定内容
   * @return {doc.body.innerHTML} 处理好的内容
   */
  function removeElementsByIdPrefix(html, idPrefix) {
    // 使用 DOMParser 解析 HTML 字符串
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // 选择所有 id 属性包含特定前缀的元素
    const elements = doc.querySelectorAll(`[id^="${idPrefix}"]`);

    // 移除这些元素
    elements.forEach((element) => {
      element.remove();
    });

    // 将处理后的 DOM 转回为 HTML 字符串
    return doc.body.innerHTML;
  }

  /**
   * 创建“快速回复”按钮，用于快速回复本帖内容
   * @return {HTMLElement} 按钮元素
   */
  function createFastReplyButton() {
    return createButton("fastReplyButton", "快速回复", function () {
      let fid = getFidFromElement();
      const tid = extractTid(window.location.href);
      showWindow(
        "reply",
        `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}`
      );
    });
  }

  /**
   * 创建“快速私信”按钮，用于快速私信
   * @return {HTMLElement} 按钮元素
   */
  function createFastPMButton(pid, touid) {
    return createButton(
      "fastPMButton",
      "快速私信",
      function () {
        let fid = getFidFromElement();
        const tid = extractTid(window.location.href);
        showWindow(
          "sendpm",
          `home.php?mod=spacecp&ac=pm&op=showmsg&handlekey=showmsg_${touid}&touid=${touid}&pmid=0&daterange=2&pid=${pid}&tid=${tid}`
        );
      },
      "bgsh-fastPMButtonBtn",
      "#7f8c8d"
    );
  }

  /**
   * 创建“查看评分”按钮，用于快速查看本帖评分
   * @return {HTMLElement} 按钮元素
   */
  function createViewRatingsButton(pid) {
    return createButton("viewRatingsButton", "查看评分", function () {
      let fid = getFidFromElement();
      const tid = extractTid(window.location.href);
      showWindow(
        "viewratings",
        `forum.php?mod=misc&action=viewratings&tid=${tid}&pid=${pid}`
      );
    });
  }

  /**
   * 创建“购买记录”按钮，用于快速查看本帖购买记录
   * @return {HTMLElement} 按钮元素
   */
  function createPayLogButton(pid) {
    return createButton("payLogButton", "购买记录", function () {
      let fid = getFidFromElement();
      const tid = extractTid(window.location.href);
      showWindow(
        "pay",
        `forum.php?mod=misc&action=viewpayments&tid=${tid}&pid=${pid}`
      );
    });
  }

  /**
   * 创建“下载附件”按钮，用于快速下载附件
   * @return {HTMLElement} 按钮元素
   */
  function createDownButton() {
    return createButton("downButton", "下载附件", function () {
      // 检查是否已存在模态框
      if (document.getElementById("customModal")) {
        return;
      }

      const spans = document.querySelectorAll('span[id*="attach_"]');
      const lockedDivs = Array.from(
        document.querySelectorAll("div.locked")
      ).filter((div) => div.textContent.includes("购买"));
      const dls = Array.from(document.querySelectorAll("dl.tattl")).filter(
        (dl) => dl.querySelector("p.attnm")
      );

      const elements = [...spans, ...dls, ...lockedDivs];

      if (elements.length === 0) {
        showTooltip("没有找到任何附件。");
        return;
      }

      const result = elements.map((el) => el.outerHTML).join("<br>");

      // 创建模态框
      const modal = document.createElement("div");
      modal.id = "customModal";
      modal.style.position = "fixed";
      modal.style.left = "50%";
      modal.style.top = "50%";
      modal.style.transform = "translate(-50%, -50%)";
      modal.style.backgroundColor = "#FFF";
      modal.style.padding = "20px";
      modal.style.border = "1px solid #DDD";
      modal.style.boxShadow = "0px 0px 10px rgba(0,0,0,0.5)";
      modal.style.borderRadius = "8px";
      modal.style.width = "80%";
      modal.style.maxWidth = "600px";
      modal.style.height = "auto";
      modal.style.maxHeight = "80vh";
      modal.style.overflowY = "auto";
      modal.style.zIndex = "100";

      // 添加内容和关闭按钮
      modal.innerHTML = `<div style="margin-bottom: 20px;">${result}</div><button id="closeModal" style="padding: 5px 10px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer;">关闭</button>`;

      document.body.appendChild(modal);

      // 关闭按钮事件
      document.getElementById("closeModal").addEventListener("click", () => {
        modal.remove();
      });
    });
  }

  /**
   * 创建“复制代码”按钮，用于复制页面内所有代码块的内容
   * @return {HTMLElement} 按钮元素
   */
  function createCopyCodeButton() {
    return createButton("copyCodeButton", "复制代码", function () {
      let allBlockCodes = document.querySelectorAll(".blockcode");
      let allTexts = [];
      allBlockCodes.forEach((blockCode) => {
        let liElements = blockCode.querySelectorAll("li");
        liElements.forEach((li) => {
          allTexts.push(li.textContent);
        });
      });
      let combinedText = allTexts.join("\n");
      copyToClipboard(
        combinedText,
        () => showTooltip("代码已复制!"),
        (err) => showTooltip("复制失败: ", err)
      );
    });
  }

  /**
   * 创建“快速评分”按钮，用于页面内对主帖的内容快速评分
   * @return {HTMLElement} 按钮元素
   */
  function createQuickGradeButton(pid) {
    return createButton("quickGradeButton", "快速评分", () => grade(pid));
  }

  /**
   * 创建“快速收藏”按钮，用于页面内对回复的内容快速收藏
   * @return {HTMLElement} 按钮元素
   */
  function createQuickStarButton() {
    return createButton("quickStarButton", "快速收藏", star);
  }

  /**
   * 创建“一键二连”按钮，用于页面内对回复的内容快速评分和收藏
   * @return {HTMLElement} 按钮元素
   */
  function createOneClickDoubleButton() {
    return createButton("oneClickDoubleButton", "一键二连", gradeAndStar);
  }

  /**
   * 创建“快速置顶”按钮，用于页面内对回复的内容快速置顶
   * @return {HTMLElement} 按钮元素
   */
  function createQuickTopicadminToPostButton(post, stickreply) {
    var text = stickreply === "1" ? "快速置顶" : "取消置顶";
    return createButton(
      "quickTopicadminToPost",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          topicadmin(pid, stickreply);
        } else {
          showTooltip("未找到置顶元素");
        }
      },
      "bgsh-quickTopicadminToPostBtn",
      "#002661"
    );
  }
  /**
   * 创建“快速编辑回复”按钮，用于页面内对回复的内容快速编辑
   * @return {HTMLElement} 按钮元素
   */
  function createQuickReplyEditToPostButton(post) {
    var text = "编辑回复";
    return createButton(
      "quickReplyEditToPost",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          let fid = getFidFromElement();
          const tid = extractTid(window.location.href);
          window.location.href = `forum.php?mod=post&action=edit&fid=${fid}&tid=${tid}&pid=${pid}`;
        } else {
          showTooltip("未找到回复元素");
        }
      },
      "bgsh-quickReplyEditToPostBtn",
      "#c42626"
    );
  }

  /**
   * 创建“快速回复”按钮，用于页面内对回复的内容快速置顶
   * @return {HTMLElement} 按钮元素
   */
  function createQuickReplyToPostButton(post) {
    var text = "快速回复";
    return createButton(
      "quickReplyToPost",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          let fid = getFidFromElement();
          const tid = extractTid(window.location.href);
          showWindow(
            "reply",
            `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}&repquote=${pid}`
          );
        } else {
          showTooltip("未找到回复元素");
        }
      },
      "bgsh-quickReplyToPostBtn",
      "#c42626"
    );
  }
  /**
   * 创建“最佳答案”按钮，用于页面内对回复的内容最佳
   * @return {HTMLElement} 按钮元素
   */
  function createSetAnswerToPostButton(post) {
    var text = "最佳答案";
    return createButton(
      "setAnswerToPost",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          // let fid = getFidFromElement();
          // const tid = extractTid(window.location.href);
          // showWindow("reply", `forum.php?mod=post&action=reply&fid=${fid}&tid=${tid}&repquote=${pid}`);
          setanswer(pid, "");
        } else {
          showTooltip("未找到最佳答案");
        }
      },
      "bgsh-setAnswerToPostBtn",
      "#4c9ae1"
    );
  }

  /**
   * 创建“广告举报”按钮，用于页面内对回复的内容广告举报
   * @return {HTMLElement} 按钮元素
   */
  function createQuickReportadToPostButton(post) {
    var text = "广告举报";
    return createButton(
      "quickReportadToPost",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          const tid = extractTid(window.location.href);
          showWindow(
            "reportad",
            `plugin.php?id=pc_reportad&tid=${tid}&pid=${pid}`
          );
        } else {
          showTooltip("未找到举报元素");
        }
      },
      "bgsh-quickReportadToPostBtn",
      "#333333"
    );
  }

  /**
   * 创建“快速举报”按钮，用于页面内对回复的内容快速举报
   * @return {HTMLElement} 按钮元素
   */
  function createQuickMiscReportToPostButton(post) {
    var text = "快速举报";
    return createButton(
      "quickMiscReport",
      text,
      () => {
        let pid = getTableIdFromElement(post);
        if (pid) {
          let fid = getFidFromElement();
          const tid = extractTid(window.location.href);
          showWindow(
            `miscreport${pid}`,
            `misc.php?mod=report&rtype=post&rid=${pid}&tid=${tid}&fid=${fid}`
          );
        } else {
          showTooltip("未找到回复元素");
        }
      },
      "bgsh-QuickMiscReportBtn",
      "#333333"
    );
  }

  /**
   * 添加对回复进行操作的按钮，用于页面内对回复的内容快速置顶/回复等等
   * @return {HTMLElement} 按钮元素
   */
  function addQuickActionToPostButton() {
    const postContainers = document.querySelectorAll(".po.hin");

    postContainers.forEach((postContainer) => {
      // 检查该元素之后是否已经有一个quickTopicadminToPost
      const existingButton = postContainer.parentNode.querySelector(
        "#quickTopicadminToPost"
      );
      if (existingButton) {
        // 如果已存在按钮，则直接返回
        return;
      }

      // 寻找 element 的父级 tbody
      let parentTbody = postContainer.closest("tbody");
      var stickreply =
        parentTbody &&
        parentTbody.querySelector('img[src="static/image/common/settop.png"]')
          ? "0"
          : "1";
      const quickTopicadminToPostButton = createQuickTopicadminToPostButton(
        postContainer,
        stickreply
      );
      const replyToPostButton = createQuickReplyToPostButton(postContainer);
      const quickMiscReportToPostButton =
        createQuickMiscReportToPostButton(postContainer);
      const quickReportadToPostButton =
        createQuickReportadToPostButton(postContainer);
      const setAnswerToPostButton = createSetAnswerToPostButton(postContainer);

      postContainer.appendChild(replyToPostButton);
      postContainer.appendChild(quickTopicadminToPostButton);
      postContainer.appendChild(quickMiscReportToPostButton);
      postContainer.appendChild(quickReportadToPostButton);
      const found = postContainer.querySelector(`.editp`);
      // 如果找到了具有指定类的元素，弹出窗口
      if (found) {
        const quickReplyEditToPostButton =
          createQuickReplyEditToPostButton(postContainer);
        postContainer.appendChild(quickReplyEditToPostButton);
      }
      if (postContainer && postContainer.innerHTML.includes("setanswer(")) {
        postContainer.appendChild(setAnswerToPostButton);
      }
    });
  }

  /**
   * 用于页面内对头像的屏蔽与显示
   * @return {HTMLElement} 按钮元素
   */
  function showAvatarEvent() {
    const avatars = document.querySelectorAll(".avatar");
    const isPostPage = () =>
      /forum\.php\?mod=viewthread|\/thread-\d+-\d+-\d+\.html/.test(
        window.location.href
      );
    if (!isPostPage()) {
      return;
    }
    var settings = getSettings();
    // 遍历所有头像元素
    avatars.forEach((avatar) => {
      // 如果复选框被选中，显示头像；否则，隐藏头像
      if (settings.showAvatar) {
        avatar.style.display = "block";
      } else {
        avatar.style.display = "none";
      }
    });
  }

  /**
   * 在帖子内容页中添加和执行各种功能
   * @param {Object} settings - 用户的设置
   * @param {HTMLElement} buttonContainer - 按钮容器
   */
  function handlePostPage(settings, buttonContainer) {
    const toggleImages = (action) => {
      const images = document.querySelectorAll("img.zoom");
      images.forEach(
        (img) => (img.style.display = action === "hide" ? "none" : "")
      );
    };

    toggleImages(settings.showImageButton);

    const initialButtonText =
      settings.showImageButton === "show" ? "隐藏图片" : "显示图片";

    const toggleButton = createButton(
      "toggleImageDisplay",
      initialButtonText,
      function () {
        if (toggleButton.innerText === "显示图片") {
          toggleImages("show");
          toggleButton.innerText = "隐藏图片";
          GM_setValue("showImageButton", "show");
        } else {
          toggleImages("hide");
          toggleButton.innerText = "显示图片";
          GM_setValue("showImageButton", "hide");
        }
      }
    );
    buttonContainer.appendChild(toggleButton);
    if (settings.showDown) {
      buttonContainer.appendChild(createDownButton());
    }

    let codeBlocks = document.querySelectorAll(".blockcode");
    if (codeBlocks.length > 0 && settings.showCopyCode) {
      buttonContainer.appendChild(createCopyCodeButton());
    }
    let firstPobClElement = document.querySelector(".po.hin");
    let pid = getTableIdFromElement(firstPobClElement);

    const userid = getUserId();
    if (userid) {
      if (settings.showFastPost) {
        buttonContainer.appendChild(createFastPostButton());
      }
      if (settings.showFastReply) {
        buttonContainer.appendChild(createFastReplyButton());
      }
      if (settings.showQuickGrade) {
        buttonContainer.appendChild(createQuickGradeButton(pid));
      }
      if (settings.showQuickStar) {
        buttonContainer.appendChild(createQuickStarButton());
      }
      if (settings.showClickDouble) {
        buttonContainer.appendChild(createOneClickDoubleButton());
      }

      // addQuickGradeToPostButton();//已失效和谐
      addQuickActionToPostButton();
    }
    if (settings.showViewRatings) {
      buttonContainer.appendChild(createViewRatingsButton(pid));
    }
    if (settings.showPayLog) {
      buttonContainer.appendChild(createPayLogButton(pid));
    }
    if (settings.showFastCopy) {
      buttonContainer.appendChild(createFastCopyButton());
    }

    if (settings.defaultSwipeToSearch) {
      document.addEventListener("mouseup", selectSearch);
    }
    initInfiniteScroll("isPostPage");
    showAvatarEvent();
    removeAD3();
    replacePMonPost();
    removeFastReply();
    appendTitleFromHotImage();
    appendBuyNumber();
  }

  /**
   * 移除帖子内容页广告
   */
  async function removeAD3() {
    document.querySelectorAll('[class*="show-text"]').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll('[id*="mgc_post"]').forEach((element) => {
      element.remove();
    });
    document.querySelectorAll("#p_btn").forEach((element) => {
      element.remove();
    });
    document.querySelectorAll(".pob.cl").forEach((element) => {
      element.remove();
    });
  }

  /**
   * 移除帖子底部的快速回帖
   */
  function removeFastReply() {
    document.querySelectorAll("#f_pst").forEach((element) => {
      element.remove();
    });
  }
  /**
   * 替换帖子内容页私信
   */
  async function replacePMonPost() {
    let firstPobClElement = document.querySelector(".po.hin");
    let pid = getTableIdFromElement(firstPobClElement);
    document.querySelectorAll('[class*="pm2"]').forEach((element) => {
      // 获取element内部的<a>标签
      const anchor = element.querySelector("a");
      if (anchor) {
        // 解析<a>标签的href属性以获取touid
        const href = anchor.getAttribute("href");
        const urlParams = new URLSearchParams(href);
        const touid = urlParams.get("touid");

        // 确保touid存在
        if (touid) {
          // 创建新的按钮，假设createFastPMButton接受touid作为参数
          const newButton = createFastPMButton(pid, touid);

          // 插入按钮
          if (element.nextSibling) {
            element.parentNode.insertBefore(newButton, element.nextSibling);
          } else {
            element.parentNode.appendChild(newButton);
          }
        }
      }

      // 移除原始元素
      element.remove();
    });
  }
  /**
   * 帖子内容页显示热度
   */
  function appendTitleFromHotImage() {
    const regex = /static\/image\/common\/hot_\d+\.gif/;
    const images = Array.from(document.querySelectorAll("img")).filter((img) =>
      regex.test(img.src)
    );

    // 如果有多张图片，遍历所有符合条件的图片
    images.forEach((image) => {
      const titleContent = image.title; // 提取图片的title内容

      // 获取页面上所有'id="thread_subject"'的元素
      const threadSubjectSpans = document.querySelectorAll("#thread_subject");
      // 遍历所有找到的span元素
      threadSubjectSpans.forEach((threadSubjectSpan) => {
        const uniqueId = `hotTitle-appendTitleFromHotImage`; // 生成基于图片中数字的唯一ID

        if (!threadSubjectSpan.parentNode.querySelector(`#${uniqueId}`)) {
          const newSpan = document.createElement("span"); // 创建新的span元素
          newSpan.id = uniqueId; // 设置新span的ID
          newSpan.textContent = ` [${titleContent}]`; // 设置新span的内容
          newSpan.style.color = `red`;
          threadSubjectSpan.parentNode.insertBefore(
            newSpan,
            threadSubjectSpan.nextSibling
          ); // 在每个'thread_subject'后面插入新的span
        }
      });
    });
  }

  /**
   * 帖子内容页显示购买数量
   */
  async function appendBuyNumber() {
    const divPt = document.getElementById("pt"); // 获取id为'pt'的div
    if (!divPt) {
      return; // 如果没有找到这个div，直接返回
    }

    // 定义需要查找的forum ID
    const forumTexts = ["fid=166", "fid=97", "forum-166", "forum-97"];
    let found = false; // 用于标记是否找到匹配的文本

    // 检查div的文本内容中是否包含任一指定的forum ID
    const textContent = divPt.innerHTML; // 获取div的全部文本内容
    forumTexts.forEach((text) => {
      if (textContent.includes(text)) {
        found = true;
      }
    });

    // 根据结果执行操作
    if (found) {
      var href = window.location.href; // 获取当前页面的URL
      var tid = extractTid(href); // 从URL中获取tid参数
      console.log("当前页面的tid:", tid);
      if (tid) {
        var buyInfo = await getViewpayments(tid); // 用于获取购买信息
        if (buyInfo.state) {
          var dataRowCount = buyInfo.dataRowCount;

          // 获取页面上所有'id="thread_subject"'的元素
          const threadSubjectSpans =
            document.querySelectorAll("#thread_subject");
          // 遍历所有找到的span元素
          threadSubjectSpans.forEach((threadSubjectSpan) => {
            const uniqueId = `buynum-appendBuyNumber`; // 生成基于图片中数字的唯一ID

            if (!threadSubjectSpan.parentNode.querySelector(`#${uniqueId}`)) {
              const newSpan = document.createElement("span"); // 创建新的span元素
              newSpan.id = uniqueId; // 设置新span的ID
              newSpan.textContent = `  [购买${dataRowCount}次]`; // 设置新span的内容
              newSpan.style.color = `red`;
              threadSubjectSpan.parentNode.insertBefore(
                newSpan,
                threadSubjectSpan.nextSibling
              ); // 在每个'thread_subject'后面插入新的span
            }
          });
        }
      }
    }
  }

  // #endregion

  // #region 网站全局功能

  /**
   * 综合区快速发帖
   */
  function PostContent() {
    if (!window.location.href.includes("forum.php?mod=post&action=newthread")) {
      return;
    }
    const link = document.createElement("a");
    link.href =
      "/forum.php?mod=redirect&goto=findpost&ptid=1708826&pid=16039784";
    link.textContent = "发帖须知";
    link.target = "_blank";
    const organizeButton = document.createElement("li");
    organizeButton.className = "a";
    organizeButton.innerHTML =
      '<button id="organizeBtn" type="button">整理</button>';

    const shareButton = document.createElement("li");
    shareButton.className = "a";
    shareButton.innerHTML = '<button id="shareBtn" type="button">自转</button>';
    const ulElement = document.querySelector(".tb.cl.mbw");
    if (ulElement) {
      ulElement.appendChild(link);
      ulElement.appendChild(organizeButton);
      ulElement.appendChild(shareButton);
    } else {
      console.warn("未找到指定的ul元素");
      return;
    }
    var ttttype = "";
    const modalContent = `<div id="organizeModal"style="display:none; position:fixed; z-index:1000; left:50%; top:50%; transform:translate(-50%, -50%); background-color:white; padding:20px; border-radius:10px;"><div><strong>【资源名称】：</strong><input type="text"id="resourceName"/></div><div><strong>【资源类型】：</strong><label><input type="radio"name="resourceType"value="影片"/>影片</label><label><input type="radio"name="resourceType"value="视频"checked/>视频</label><label><input type="radio"name="resourceType"value="动漫"/>动漫</label><label><input type="radio"name="resourceType"value="套图"/>套图</label><label><input type="radio"name="resourceType"value="游戏"/>游戏</label></div><div><strong>【是否有码】：</strong><label><input type="radio"name="censorship"value="有码"/>有码</label><label><input type="radio"name="censorship"value="无码"checked/>无码</label></div><div><strong>【是否水印】：</strong><label><input type="radio"name="watermark"value="有水印"/>有水印</label><label><input type="radio"name="watermark"value="无水印"checked/>无水印</label></div><div><strong>【字幕】：</strong><label><input type="radio"name="subtitle"value="中文字幕"/>中文字幕</label><label><input type="radio"name="subtitle"value="日文字幕"/>日文字幕</label><label><input type="radio"name="subtitle"value="英文字幕"/>英文字幕</label><label><input type="radio"name="subtitle"value="无字幕"checked/>无字幕</label></div><div><strong>【资源大小】：</strong><input type="text"id="resourceSize"placeholder="大小"/><label><input type="radio"name="sizeUnit"value="M"checked/>M</label><label><input type="radio"name="sizeUnit"value="G"/>G</label><label><input type="radio"name="sizeUnit"value="T"/>T</label><br><div><strong>【下载类型】：</strong><label><input type="radio"name="downType"value="115ED2K"checked/>115ED2K</label><label><input type="radio"name="downType"value="BT/磁链"/>BT/磁链</label><label><input type="radio"name="downType"value="ED2K"/>ED2K</label><label><input type="radio"name="downType"value="夸克网盘"/>夸克网盘</label><label><input type="radio"name="downType"value="百度网盘"/>百度网盘</label><label><input type="radio"name="downType"value="PikPak网盘"/>PikPak网盘</label><label><input type="radio"name="downType"value="其它网盘"/>其它网盘</label></div>视频数量:<input type="text"id="videoCount"placeholder="视频数量"/><br>图片数量:<input type="text"id="imageCount"placeholder="图片数量"/><br>配额数量:<input type="text"id="quota"placeholder="配额数量"/></div><div><strong>【资源预览】：</strong></div><div><strong>【资源链接】：</strong><input type="text"id="resourceLink"/></div><button id="insetBtn"type="button">插入</button></div>`;
    document.body.insertAdjacentHTML("beforeend", modalContent);
    document
      .getElementById("organizeBtn")
      .addEventListener("click", function () {
        showModal("整理");
      });
    document.getElementById("shareBtn").addEventListener("click", function () {
      showModal("自转");
    });
    function showModal(param) {
      console.log(param);
      ttttype = param;
      document.getElementById("organizeModal").style.display = "block";
    }
    document.getElementById("insetBtn").addEventListener("click", function () {
      const resourceName = document.getElementById("resourceName").value;
      const resourceType = document.querySelector(
        'input[name="resourceType"]:checked'
      )?.value;
      const censorship = document.querySelector(
        'input[name="censorship"]:checked'
      )?.value;
      const watermark = document.querySelector(
        'input[name="watermark"]:checked'
      )?.value;
      const subtitle = document.querySelector(
        'input[name="subtitle"]:checked'
      )?.value;
      const resourceLink = document.getElementById("resourceLink").value;
      const downType = document.querySelector(
        'input[name="downType"]:checked'
      )?.value;
      const resourceSize = document.getElementById("resourceSize").value;
      const sizeUnit = document.querySelector(
        'input[name="sizeUnit"]:checked'
      ).value;
      const videoCount = document.getElementById("videoCount").value;
      const imageCount = document.getElementById("imageCount").value;
      const quota = document.getElementById("quota").value;
      let resourceSizeStr = resourceSize ? `${resourceSize}${sizeUnit}` : "";
      let videoCountStr = videoCount ? `${videoCount}V` : "";
      let imageCountStr = imageCount ? `${imageCount}P` : "";
      let quotaStr = quota ? `${quota}配额` : "";
      const content = `
                      【资源名称】：${resourceName}<br>
                      【资源类型】：${resourceType}<br>
                      【是否有码】：${censorship} @ ${watermark} @ ${subtitle}<br>
                      【资源大小】：${resourceSizeStr}/${videoCountStr}/${imageCountStr}/${quotaStr}<br>
                      【资源预览】：<br>
                      【资源链接】：<div class="blockcode"><blockquote>${resourceLink}</blockquote></div><br>
                  `;
      const iframe = document.querySelector(".area iframe");
      if (iframe && iframe.contentDocument) {
        const body = iframe.contentDocument.body;
        if (body && body.isContentEditable) {
          body.innerHTML = content;
        } else {
          console.warn("在iframe中未找到可编辑的body元素");
        }
      } else {
        console.warn("未找到class为area的div中的iframe");
      }
      const title = `【${ttttype}】【${downType}】${resourceName}【${resourceSizeStr}/${videoCountStr}/${imageCountStr}/${quotaStr}】
                  `;
      const subjectInput = document.getElementById("subject");
      if (subjectInput) {
        subjectInput.value = title;
      } else {
        console.warn("未找到ID为'subject'的input元素");
      }
      var selectElement = document.getElementById("typeid");
      if (selectElement) {
        selectElement.setAttribute("selecti", "8");
      } else {
        console.warn("未找到ID为'typeid'的select元素");
      }
      var aElement = document.querySelector(".ftid a#typeid_ctrl");
      if (aElement) {
        aElement.textContent = "情色分享";
        aElement.setAttribute("initialized", "true");
      } else {
        console.warn("未找到对应的a元素");
      }
      document.getElementById("organizeModal").style.display = "none";
    });
  }

  /**
   * 创建挑选女友的按钮
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createGirlFriendButton(buttonContainer) {
    var girlFriendButton = createButton("girlFriendButton", "挑选女友", () =>
      createPopup()
    );
    buttonContainer.appendChild(girlFriendButton);
  }

  /**
   * 创建广告的按钮
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createADButton(buttonContainer) {
    var ADButton = createButton("ADButton", "购买邀请码", () =>
      togglePopup("https://ad1.caomeistore.com/")
    );
    buttonContainer.appendChild(ADButton);
  }
  /**
   * 创建广告2的按钮
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createAD2Button(buttonContainer) {
    var AD2Button = createButton("AD2Button", "机场推荐", () =>
      togglePopup("https://sbairport.com")
    );
    buttonContainer.appendChild(AD2Button);
  }

  /**
   * 挑选女友的style。
   */

  function addGirlFriendStyles() {
    var style = document.createElement("style");
    style.id = "popupStyle_baoguo";
    style.innerHTML = `
            .app_baoguo{width:500px;height:500px;overflow:hidden;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:#fff8f8;border:1px solid #000;box-shadow:0 4px 8px rgba(0,0,0,0.1);z-index:10000}.word-content_baoguo,.cloudword_baoguo,.title_baoguo,.btn-content_baoguo{position:relative;max-width:100%;max-height:100%;overflow:hidden}.word-content_baoguo{position:absolute;left:50%;top:50%;width:100%;z-index:2;transform:translate(-50%,-50%)}.title_baoguo{display:flex;justify-content:center;font-size:40px;font-weight:bold;color:red}.cloudword_baoguo{position:absolute;width:100%;height:100%;z-index:1}.btn-content_baoguo{margin:50px 0;display:flex;justify-content:center}.btn_baoguo{width:140px;height:50px;font-size:16px;background-color:#007BFF;color:white;border:none;border-radius:5px;box-shadow:0 2px 4px rgba(0,0,0,0.2);cursor:pointer;transition:background-color 0.3s,box-shadow 0.3s}@keyframes complexMoveFade_baoguo{0%{opacity:0;transform:scale(0.5) translate(0,0);font-weight:normal}25%{opacity:0.5;transform:scale(0.8) translate(-10px,10px)}50%{opacity:1;transform:scale(1.1) translate(10px,-10px);font-weight:bold}75%{opacity:0.5;transform:scale(0.8) translate(-10px,10px)}100%{opacity:0;transform:scale(0.5) translate(0,0);font-weight:normal}}.text-popup_baoguo{animation:complexMoveFade_baoguo 1s forwards}.text-popup_baoguo{font-size:30px} @media (max-width:600px){.app_baoguo{width:300px;height:500px}}`;
    document.head.appendChild(style);
  }

  /**
   * 挑选女友的script。
   */
  function addGirlFriendScript() {
    var script = document.createElement("script");
    script.id = "popupScript_baoguo";
    script.textContent = `var displayTextElement=document.getElementById("displayText_baoguo");var toggleButton_baoguo=document.getElementById("toggleButton_baoguo");var cloudwordElement=document.getElementById("cloudword_baoguo");var options=["大泽惠","美咲沙耶","石川铃华","早见琉璃","羽田未来","小泉梨菜","二宫沙树","星野明","椎名由奈","青木玲","星艾莉丝","鮎川奈绪","秋川露依","内山遥","香澄果穗","麻田有希","友崎玲","春菜花","神咲诗织","姬咲莉莉亚","AYA","佐藤美沙","天海翼","西田美沙","心有花","相户爱","平井绫","速水百花","小峰由衣","管野静香","香山圣","叶月奈穗","川嶋夏树","长泽筑实","樱井梨花","伊藤青叶","伊东遥","杏树纱奈","七咲枫花","爱川香织","黑泽英里奈","星野飞鸟","原明奈","辻沙耶香","原田明绘","北川绘美","小林爱弓","大泽美加","吉冈美奈","铃木里美","北条麻妃","神谷姬","神河美音","筱惠美","大浦安娜","三浦亚沙妃","ASUKA","泽木树里","周防雪子","波多野结衣","冬月枫","大冢咲","天宫真奈美","原千寻","叶志穗","濑奈凉","相泽唯衣","广濑由奈","小坂惠","翼裕香","叶山润子","绫濑美音","朝日奈明","青空小夏","麻仓忧","木村那美","村上里沙","田中亚弥","泷泽萝拉","花鸟丽","小向美奈子","天衣美津","JULIA","早坂瞳","樱井莉亚","横山美雪","相田纱耶香","青山雪菜","大岛理子","松本麻里奈","纱仓真菜","渡濑晶","若菜光","日向真昼","平泽里菜子","绫波优","小峰日向","羽田爱","水城奈绪","红音萤","新村爱","伊泽千夏","加护范子","长泽梓","乙音奈奈","白咲舞","希美真由","黑木麻衣","爱音真寻","松野由井","和叶美玲","麻美由真","日野雫","爱泽莲","早川濑里奈","铃木茶织","阿立未来","筱原凉","雨宫琴音","初美理音","一条爱美","青木莉子","高原智美","朝河兰","桃子美优","坂田美影","樱心美","范田纱纱","中岛京子","种村美咲","草莓牛奶","天海丽","相崎琴音","神谷美雪","高树圣良","北岛玲","原小雪","朝比奈琉依","水元优奈","松生彩","小日向优","若宫莉那","上原瑞穗","若林树里","爱川美里菜","芹泽直美","唯川纯","黑川绮罗","大桥未久","星崎杏里","幸田李梨","星乃星爱","藤本莉娜","姬野爱","铃香音色","@YOU","青木琳","糸矢芽衣","若叶久留美","妃乃光","新垣圣那","北原多香子","遥惠美","栗林里莉","古都光","水菜丽","岬里沙","爱原翼","加藤莉娜","吉泽明步","濑名步","岛田阳子","夏目奈奈","堀口奈津美","折笠弥生","翔田千里","木下柚花","春咲和津实","卯月麻衣","希志爱野","弘前亮子","松下怜","早乙女露依","赤西凉","桐生樱","晶爱丽","舞咲美娜","北原夏美","明日花绮罗","茉莉花","小林初花","辰巳唯","安西琉菜","月野姬","藤原瞳","叶山丽子","恋小夜","安达有里","橘日向","紫彩乃","星崎未来","麻生岬","滨崎里绪","佐藤江梨花","村上丽奈","蓝山南","青山由衣","木内美保","水朝美树","藤泽美羽","高濑七海","樱田樱","香坂百合","大槻响","大泽佳那","麻川丽","樱木凛","堀咲莉亚","樱朱音","绘色千佳","音羽奏","成濑心美","长谷川理穗","安倍夏树","飞鸟伊央","真白希实","立花美凉","叶不二子","宫川怜","泷泽优奈","立花里子","浅田琪琪","早乙女优","森美咲","原更纱","爱内梨花","野宫凛子","西野翔","爱海一夏","朝香凉","小泉彩","山口玲子","爱田由","明佐奈","爱原理彩","小泉优香","及川奈央","福山沙耶香","前嶋美步","竹内爱","真田春香","美知广子","橘未稀","藤井雪莉","田畑百子","吉崎直绪","爱叶渚","直嶋爱","菅野亚梨沙","秋元美由","莲井志帆","铃木杏里","妃悠爱","小樱沙树","桐岛葵","美优千奈","并木优","藤井彩","南沙也香","前田香织","藤崎里绪","观月雏乃","青山沙希","浅乃晴美","仁科沙也加","石原莉奈","杉浦美由","小森美树","长谷川美红","前田优希","原纱央莉","羽月希","濑户由衣","朝田芭娜娜","石黑京香","麻生希"];var timer=null;var btnText="点击我";toggleButton_baoguo.addEventListener("click",function(){if(btnText==="点击我"||btnText==="再来一次"){startRandomSelection()}else{stopRandomSelection()}});function startRandomSelection(){if(timer)return;timer=setInterval(updateRandomOption,50);btnText="选择";toggleButton_baoguo.textContent=btnText}function stopRandomSelection(){clearInterval(timer);timer=null;btnText="再来一次";toggleButton_baoguo.textContent=btnText;displayTextElement.textContent="今天冲"+displayTextElement.textContent;var floatingTexts=cloudwordElement.querySelectorAll(".text-popup_baoguo");floatingTexts.forEach(function(textElement){textElement.remove()})}function updateRandomOption(){var randomIndex=getRandomNumber(0,options.length-1);displayTextElement.textContent=options[randomIndex]+"!";createFloatingText()}function getRandomNumber(min,max){return Math.floor(Math.random()*(max-min+1))+min}function createFloatingText(){var textElement=document.createElement("span");textElement.className="text-popup_baoguo";textElement.textContent=options[getRandomNumber(0,options.length-1)];var maxWidth=cloudwordElement.clientWidth;var maxHeight=cloudwordElement.clientHeight;textElement.style.left=getRandomNumber(0,maxWidth-20)+"px";textElement.style.top=getRandomNumber(0,maxHeight-20)+"px";textElement.style.position="absolute";textElement.addEventListener("animationend",function(){textElement.remove()});cloudwordElement.appendChild(textElement)}`;
    document.body.appendChild(script);
  }

  /**
   * 挑选女友的弹出窗体。
   */
  function createPopup() {
    var popup = document.createElement("div");
    popup.className = "app_baoguo";
    popup.innerHTML = `<div class="word-content_baoguo"><div class="title_baoguo"><span id="displayText_baoguo">今天冲哪个?</span></div><div class="btn-content_baoguo"><button class="btn_baoguo"id="toggleButton_baoguo">点击我</button></div></div><div class="cloudword_baoguo"id="cloudword_baoguo"></div>`;
    var closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "5px";
    closeButton.style.right = "5px";
    closeButton.style.zIndex = "100001";
    closeButton.style.padding = "5px 10px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "50%";
    closeButton.style.backgroundColor = "#ff4545";
    closeButton.style.color = "white";
    closeButton.style.fontSize = "16px";
    closeButton.style.cursor = "pointer";
    closeButton.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
    closeButton.style.transition = "background-color 0.2s, box-shadow 0.2s";
    closeButton.addEventListener("click", function () {
      stopRandomSelection();
      var popup = document.querySelector(".app_baoguo");
      if (popup) {
        popup.remove();
      }
      var styleElement = document.getElementById("popupStyle_baoguo");
      var scriptElement = document.getElementById("popupScript_baoguo");
      if (styleElement) {
        styleElement.remove();
      }
      if (scriptElement) {
        scriptElement.remove();
      }
    });
    popup.appendChild(closeButton);
    document.body.appendChild(popup);
    addGirlFriendStyles();
    addGirlFriendScript();
  }
  /**
   * 广告的弹出窗体。
   */

  function togglePopup(url) {
    let popup = document.getElementById("myPopupIframe");
    let iframe;

    // 检查弹出窗口是否已存在
    if (!popup) {
      // 创建弹出窗口容器
      popup = document.createElement("div");
      popup.id = "myPopupIframe";
      Object.assign(popup.style, {
        position: "fixed",
        width: "80%",
        height: "80%",
        left: "10%",
        top: "10%",
        zIndex: "10000",
        backgroundColor: "white",
        border: "3px solid black",
        borderRadius: "10px",
        padding: "10px",
        boxSizing: "border-box",
        display: "none",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      });

      // 创建关闭按钮
      const closeButton = document.createElement("div");
      closeButton.textContent = "关闭";
      Object.assign(closeButton.style, {
        position: "absolute",
        top: "5px",
        right: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
      });

      closeButton.onclick = function () {
        popup.style.display = "none";
      };

      // 创建 iframe
      iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "100%",
        height: "calc(100% - 20px)",
        border: "none",
        borderRadius: "8px",
      });
      iframe.id = "popupIframe"; // 给 iframe 设置一个 ID，方便之后访问

      popup.appendChild(closeButton);
      popup.appendChild(iframe);
      document.body.appendChild(popup);
    } else {
      // 如果弹窗已经存在，直接获取 iframe
      iframe = document.getElementById("popupIframe");
    }

    // 设置 iframe 的新 URL 并显示弹窗
    iframe.src = url;
    popup.style.display = "block"; // 显示弹出窗口
  }

  function setMenuButtonPosition(menuButton, container, settings) {
    // 添加按钮到页面以获取其高度
    document.body.appendChild(menuButton);

    const containerRect = settings.menuButtonIsVisible
      ? container.getBoundingClientRect()
      : 100;

    // 设置按钮的顶部位置为容器的顶部位置减去按钮的高度再减去一些间隔
    menuButton.style.top = `${
      containerRect.top - menuButton.offsetHeight - 50
    }px`;
  }

  /**
   * 全站通用的入口方法。为整个站点执行基本操作和应用用户设置。
   *
   * 1. 修改用户勋章显示
   * 2. 添加自定义样式
   * 3. 根据当前页面的URL，选择并执行相应的页面处理逻辑
   * 4. 如果用户登录，尝试执行自动签到操作
   * 5. 将按钮容器附加到页面主体
   *
   * @param {Object} settings - 用户的设置
   */
  async function baseFunction(settings) {
    removeAD();
    if (settings.blockingIndex) {
      removeIndex();
    }
    manipulateMedals(settings); // 修改用户勋章显示
    addStyles(); // 添加自定义样式
    const buttonContainer = createButtonContainer();
    buttonContainer.style.display = settings.menuButtonIsVisible
      ? "flex"
      : "none";

    await delegatePageHandlers(settings, buttonContainer); // 根据URL选择页面处理逻辑

    handleUserSign(buttonContainer); // 执行用户签到逻辑
    blockContentByUsers(settings); //屏蔽用户

    createExchangeRateButton(buttonContainer);
    createGirlFriendButton(buttonContainer);
    createADButton(buttonContainer);
    createAD2Button(buttonContainer);
    document.body.appendChild(buttonContainer); // 将按钮容器附加到页面主体
    PostContent();
    createBaoguoButton(buttonContainer);
    const menuButton = createMenuButton(settings);
    setMenuButtonPosition(menuButton, buttonContainer, settings); // 计算并设置按钮位置
    // 切换容器显示/隐藏
    toggleContainer(menuButton, buttonContainer);
  }

  /**
   * 检查当前页面的URL是否匹配SpacePage的模式。
   * @returns {boolean} 如果匹配则返回true，否则返回false。
   */
  async function delegatePageHandlers(settings, buttonContainer) {
    const isPostPage = () =>
      /forum\.php\?mod=viewthread|\/thread-\d+-\d+-\d+\.html/.test(
        window.location.href
      );
    const isSearchPage = () =>
      /search\.php\?mod=forum/.test(window.location.href);
    const isForumDisplayPage = () =>
      /forum\.php\?mod=forumdisplay|\/forum-\d+-\d+\.html/.test(
        window.location.href
      );
    const isSpacePage = () =>
      /home\.php\?mod=space(.*&&uid=\d+)?.*&do=thread&view=me(.*&from=space)?.*&(type=(reply|thread))?/.test(
        window.location.href
      );
    const isMySpacePage = () =>
      /(forum|home)\.php\?mod=(guide|space|misc)&(view=(hot|digest|new|newthread|sofa|my)|action=showdarkroom|do=favorite)(&type=(thread|reply|postcomment))?/.test(
        window.location.href
      );
    const isMyfavoritePage = () =>
      /home\.php\?mod=space&do=favorite&view=me/.test(window.location.href);
    const isShowdarkroomPage = () =>
      /forum\.php\?mod=misc&action=showdarkroom/.test(window.location.href);

    if (isPostPage()) {
      handlePostPage(settings, buttonContainer);
    } else if (isSearchPage()) {
      handleSearchPage(settings);
    } else if (isForumDisplayPage()) {
      await handleForumDisplayPage(settings, buttonContainer);
    } else if (isSpacePage()) {
      console.log("isSpacePage");
      displayThreadBuyInfoOther(settings);
      initInfiniteScroll("isSpacePage");
    } else if (isMySpacePage()) {
      console.log("isMySpacePage");
      displayThreadBuyInfoOther(settings);
      initInfiniteScroll("isMySpacePage");
    } else if (isMyfavoritePage()) {
      initInfiniteScroll("isMyfavoritePage");
    }
  }

  /**
   * 创建汇率计算按钮
   * @param {Object} settings - 用户的设置
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createExchangeRateButton(buttonContainer) {
    var exchangeRateButton = createButton(
      "exchangeRateButton",
      "金钱汇率",
      () => createFloatingWindow()
    );
    buttonContainer.appendChild(exchangeRateButton);
  }

  /**
   * 创建保国设置按钮
   * @param {Object} settings - 用户的设置
   * @param {Element} buttonContainer - 按钮容器元素
   */
  function createBaoguoButton(buttonContainer) {
    var baoguoButton = createButton("baoguoButton", "功能设置", () =>
      createSettingsUI(getSettings())
    );
    buttonContainer.appendChild(baoguoButton);
  }

  /**
   * 用户签到处理逻辑。检查用户是否已签到并执行相应操作。
   *
   * 1. 获取用户ID。如果用户未登录，则不执行任何操作。
   * 2. 检查用户今天是否已签到。
   * 3. 根据签到状态，更新签到按钮的文本。
   * 4. 如果用户今天还未签到，尝试自动签到。
   * 5. 将签到按钮添加到指定的按钮容器。
   *
   * @param {HTMLElement} buttonContainer - 存放按钮的容器元素
   */
  async function handleUserSign(buttonContainer) {
    const userid = getUserId(); // 获取用户ID
    if (!userid) return; // 如果用户未登录，结束函数

    // 检查今天是否已经签到
    const lastSignDate = GM_getValue(`lastSignDate_${userid}`, null);
    const today = new Date().toLocaleDateString();
    const hasSignedToday = lastSignDate === today;

    // 更新签到按钮文本
    const signButtonText = hasSignedToday ? "已经签到" : "快去签到";
    const signButton = createButton(
      "signButton",
      signButtonText,
      () => (window.location.href = `${baseURL}/plugin.php?id=dd_sign:index`)
    );

    // 尝试自动签到
    if (!hasSignedToday) {
      const signed = await sign(userid);
      signButton.innerText = signed ? "已经签到" : "快去签到";
    }

    // 添加签到按钮到容器
    buttonContainer.appendChild(signButton);
  }

  /**
   * 移除广告
   */
  async function removeAD() {
    document.querySelectorAll(".show-text.cl").forEach((element) => {
      element.remove();
    });
    const mn_portalelement = document.querySelector("#mn_portal");
    if (mn_portalelement) {
      mn_portalelement.remove();
    }
    const mn_Na5acelement = document.querySelector("#mn_Na5ac");
    if (mn_Na5acelement) {
      mn_Na5acelement.remove();
    }
    const mn_Neaf3element = document.querySelector("#mn_Neaf3");
    if (mn_Neaf3element) {
      mn_Neaf3element.remove();
    }
    const mn_Ne7b9element = document.querySelector("#mn_Ne7b9");
    if (mn_Ne7b9element) {
      mn_Ne7b9element.remove();
    }
    const qmenuelement = document.querySelector("#qmenu");
    if (qmenuelement) {
      qmenuelement.remove();
    }
  }

  /**
   * 移除首页热门
   */
  async function removeIndex() {
    window.addEventListener("load", function () {
      const diyChart = document.querySelector("#diy_chart");
      if (diyChart) {
        diyChart.remove();
      }
    });
  }

  // #endregion

  // #region 持久性设置

  /**
   * 保存用户的设置并执行相应的操作。
   *
   * 1. 获取当前保存的设置。
   * 2. 从页面的UI元素中读取新的设置值。
   * 3. 对某些设置值进行额外处理。
   * 4. 创建一个需要保存的设置对象。
   * 5. 使用GM_setValue存储设置。
   * 6. 根据新的设置值应用更改。
   * 7. 如果某些核心设置已更改，重新加载页面。
   *
   * @param {Object} settings - 用户的设置对象
   */
  function saveSettings(settings) {
    // 获取当前的设置
    const oldSettings = getSettings();

    // 从页面的UI元素中读取设置值
    settings.imageSize = document.getElementById("imageSizeInput").value;
    settings.logoText = document.getElementById("logoTextInput").value;
    settings.titleStyleSize = document.getElementById(
      "titleStyleSizeInput"
    ).value;
    settings.titleStyleWeight = document.getElementById(
      "titleStyleWeightInput"
    ).value;
    settings.tipsText = document.getElementById("tipsTextInput").value;
    settings.showDown = document.getElementById("showDownCheckbox").checked;
    settings.showCopyCode = document.getElementById(
      "showCopyCodeCheckbox"
    ).checked;
    settings.showFastPost = document.getElementById(
      "showFastPostCheckbox"
    ).checked;
    settings.showFastReply = document.getElementById(
      "showFastReplyCheckbox"
    ).checked;
    settings.showQuickGrade = document.getElementById(
      "showQuickGradeCheckbox"
    ).checked;
    settings.showQuickStar = document.getElementById(
      "showQuickStarCheckbox"
    ).checked;
    settings.showClickDouble = document.getElementById(
      "showClickDoubleCheckbox"
    ).checked;
    settings.showViewRatings = document.getElementById(
      "showViewRatingsCheckbox"
    ).checked;
    settings.showPayLog = document.getElementById("showPayLogCheckbox").checked;
    settings.showFastCopy = document.getElementById(
      "showFastCopyCheckbox"
    ).checked;
    settings.blockingIndex = document.getElementById(
      "blockingIndexCheckbox"
    ).checked;
    settings.qiandaoTip = document.getElementById("qiandaoTipCheckbox").checked;

    settings.imageUrl = document.getElementById("imageUrlInput").value;
    settings.displayBlockedTips = document.getElementById(
      "displayBlockedTipsCheckbox"
    ).checked;
    settings.blockedUsers = document
      .getElementById("blockedUsersList")
      .value.split("\n")
      .map((name) => name.trim())
      .filter((user) => user.trim() !== "");
    settings.enableTitleStyle = document.getElementById(
      "enableTitleStyleCheckbox"
    ).checked;
    settings.autoPagination = document.getElementById(
      "autoPaginationCheckbox"
    ).checked;
    settings.blockMedals = getCheckedRadioValue("blockMedals");
    settings.resizeMedals = getCheckedRadioValue("resizeMedals");
    settings.replaceMedals = getCheckedRadioValue("replaceMedals");
    settings.showAvatar = document.getElementById("showAvatarCheckbox").checked;
    settings.displayThreadImages = document.getElementById(
      "displayThreadImagesCheckbox"
    ).checked;
    settings.displayThreadBuyInfo = document.getElementById(
      "displayThreadBuyInfoCheckbox"
    ).checked;

    settings.isShowWatermarkMessage = document.getElementById(
      "isShowWatermarkMessageCheckbox"
    ).checked;
    settings.maxGradeThread = document.getElementById("maxGradeThread").value;
    settings.defaultSwipeToSearch = document.getElementById(
      "defaultSwipeToSearchCheckbox"
    ).checked;
    settings.excludeOptions = [
      ...new Set(
        document
          .getElementById("excludeOptionsTextarea")
          .value.split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      ),
    ];
    settings.excludePostOptions = [
      ...new Set(
        document
          .getElementById("excludePostOptionsTextarea")
          .value.split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
      ),
    ];
    // 对excludeGroup进行过滤
    settings.excludeGroup = settings.excludeGroup.filter((group) =>
      settings.excludeOptions.includes(group)
    );

    // 创建要保存的设置对象
    const settingsToSave = {
      imageSize: settings.imageSize,
      logoText: settings.logoText,
      tipsText: settings.tipsText,
      imageUrl: settings.imageUrl,
      blockMedals: settings.blockMedals,
      resizeMedals: settings.resizeMedals,
      replaceMedals: settings.replaceMedals,
      displayBlockedTips: settings.displayBlockedTips,
      blockedUsers: settings.blockedUsers,
      enableTitleStyle: settings.enableTitleStyle,
      titleStyleSize: settings.titleStyleSize,
      titleStyleWeight: settings.titleStyleWeight,
      excludeOptions: settings.excludeOptions,
      excludeGroup: settings.excludeGroup,
      autoPagination: settings.autoPagination,
      showAvatar: settings.showAvatar,
      excludePostOptions: settings.excludePostOptions,
      maxGradeThread: settings.maxGradeThread,
      defaultSwipeToSearch: settings.defaultSwipeToSearch,
      displayThreadImages: settings.displayThreadImages,
      displayThreadBuyInfo: settings.displayThreadBuyInfo,
      isShowWatermarkMessage: settings.isShowWatermarkMessage,
      showDown: settings.showDown,
      showCopyCode: settings.showCopyCode,
      showFastPost: settings.showFastPost,
      showFastReply: settings.showFastReply,
      showQuickGrade: settings.showQuickGrade,
      showQuickStar: settings.showQuickStar,
      showClickDouble: settings.showClickDouble,
      showViewRatings: settings.showViewRatings,
      showPayLog: settings.showPayLog,
      showFastCopy: settings.showFastCopy,
      blockingIndex: settings.blockingIndex,
      qiandaoTip: settings.qiandaoTip,
    };

    // 存储设置
    for (let key in settingsToSave) {
      GM_setValue(key, settingsToSave[key]);
    }

    // 根据新的设置值应用更改
    manipulateMedals(settings);
    if (settings.enableTitleStyle) {
      stylePosts(settings);
    } else {
      undoStylePosts();
    }
    showAvatarEvent();
    // 如果核心设置已更改，重新加载页面

    if (
      oldSettings.blockingIndex !== settings.blockingIndex ||
      oldSettings.showFastCopy !== settings.showFastCopy ||
      oldSettings.showViewRatings !== settings.showViewRatings ||
      oldSettings.showPayLog !== settings.showPayLog ||
      oldSettings.showClickDouble !== settings.showClickDouble ||
      oldSettings.showQuickStar !== settings.showQuickStar ||
      oldSettings.showQuickGrade !== settings.showQuickGrade ||
      oldSettings.showFastReply !== settings.showFastReply ||
      oldSettings.showFastPost !== settings.showFastPost ||
      oldSettings.showCopyCode !== settings.showCopyCode ||
      oldSettings.showDown !== settings.showDown ||
      oldSettings.displayBlockedTips !== settings.displayBlockedTips ||
      oldSettings.displayThreadImages !== settings.displayThreadImages ||
      oldSettings.displayThreadBuyInfo !== settings.displayThreadBuyInfo ||
      oldSettings.autoPagination !== settings.autoPagination ||
      oldSettings.blockedUsers.toString() !==
        settings.blockedUsers.toString() ||
      oldSettings.excludeOptions.toString() !==
        settings.excludeOptions.toString() ||
      oldSettings.excludePostOptions.toString() !==
        settings.excludePostOptions.toString() ||
      oldSettings.defaultSwipeToSearch !== settings.defaultSwipeToSearch ||
      settings.replaceMedals === 0 ||
      settings.replaceMedals === 2
    ) {
      location.reload();
    }
  }
  // #endregion

  // #region 高级搜索

  /**
   * 在页面上添加高级搜索功能。
   *
   * 1. 检查页面中是否存在目标元素。
   * 2. 创建一个高级搜索区域并将其附加到页面。
   * 3. 根据传入的设置初始化复选框的状态。
   * 4. 为高级搜索区域的复选框组添加事件监听器。
   *
   * @param {Object} settings - 用户的设置对象
   */
  function addAdvancedSearch(settings) {
    const tlElement = document.querySelector(".tl");
    if (!tlElement) {
      console.error("The .tl element not found!");
      return;
    }

    const advancedSearchDiv = createAdvancedSearchDiv(settings);
    document.body.appendChild(advancedSearchDiv);

    initCheckboxGroupWithSettings(advancedSearchDiv, settings);
    addEventListenerForAdvancedSearch(advancedSearchDiv);
  }

  /**
   * 创建一个高级搜索区域（div）。
   * 区域中包含复选框组，允许用户选择不同的搜索选项。
   *
   * @param {Object} settings - 用户的设置对象
   * @param {Array} TIDOptions - 板块选项，默认值为DEFAULT_TID_OPTIONS
   * @returns {HTMLElement} - 创建的div元素
   */
  function createAdvancedSearchDiv(settings, TIDOptions = DEFAULT_TID_OPTIONS) {
    const advancedSearchDiv = document.createElement("div");
    const excludeOptions = settings.excludeOptions || [];
    const excludeOptionsFormatted = excludeOptions.map((option) => ({
      label: option,
      value: option,
    }));

    advancedSearchDiv.appendChild(
      createCheckboxGroup("excludeGroup", "排除关键字", excludeOptionsFormatted)
    );
    advancedSearchDiv.appendChild(
      createCheckboxGroup("TIDGroup", "只看板块", TIDOptions)
    );

    // 添加样式类
    advancedSearchDiv.classList.add("advanced-search");

    return advancedSearchDiv;
  }

  /**
   * 根据传入的设置初始化复选框的状态。
   *
   * @param {HTMLElement} div - 包含复选框组的div元素
   * @param {Object} settings - 用户的设置对象
   */
  function initCheckboxGroupWithSettings(div, settings) {
    const setCheckboxes = (group, values) => {
      values.forEach((value) => {
        const checkbox = div.querySelector(`#${group} input[value="${value}"]`);
        if (checkbox) checkbox.checked = true;
      });
    };

    setCheckboxes("excludeGroup", settings.excludeGroup);
    setCheckboxes("TIDGroup", settings.TIDGroup);
  }

  /**
   * 为高级搜索区域的复选框组添加事件监听器。
   * 当用户更改复选框的状态时，会更新和保存设置。
   *
   * @param {HTMLElement} div - 包含复选框组的div元素
   */
  function addEventListenerForAdvancedSearch(div) {
    div.addEventListener("change", function (e) {
      const handleCheckboxChange = (group) => {
        if (e.target.closest(`#${group}`)) {
          const selectedValues = [
            ...document.querySelectorAll(`#${group} input:checked`),
          ].map((input) => input.value);
          GM_setValue(group, JSON.stringify(selectedValues));
        }
      };

      handleCheckboxChange("excludeGroup");
      handleCheckboxChange("TIDGroup");
      filterElementsBasedOnSettings(getSettings());
    });
  }

  /**
   * 替换搜索页面的logo。
   */
  function replaceImageSrc() {
    // 等待页面完全加载
    window.addEventListener("load", function () {
      // 查找所有包含旧图片路径的img元素
      document
        .querySelectorAll('img[src="static/image/common/logo_sc_s.png"]')
        .forEach(function (img) {
          // 替换为新的图片路径
          img.src = "static/image/common/logo.png";
        });
    });

    // document.querySelectorAll('img[src="static/image/common/logo_sc_s.png"]').forEach(function (img) {
    //         // 替换为新的图片路径
    //         img.src = "static/image/common/logo.png";
    //       });
  }

  // #endregion

  /**
   * 主程序执行函数。
   *
   * 1. 获取用户的设置。
   * 2. 检查是否需要进行更新。
   * 3. 执行基础功能函数。
   */
  async function main() {
    const settings = getSettings();

    // 如果距离上次检查更新已经超过24小时，则检查更新
    const lastCheckedUpdate = settings.lastCheckedUpdate;
    const oneDayInMillis = 24 * 60 * 60 * 1000;
    if (Date.now() - lastCheckedUpdate > oneDayInMillis) {
      checkForUpdates();
    }

    await baseFunction(settings);
  }

  // 启动主程序
  await main();
})();

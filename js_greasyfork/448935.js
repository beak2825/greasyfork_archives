// ==UserScript==
// @name         GitLab 的 Merge Request 页面解析 TAPD 需求 id 并生成可跳转链接
// @namespace    hl_qiu163@163.com
// @version      0.1.9
// @description  GitLab 的 Merge Request 页面解析 TAPD 需求 id 并生成可跳转链接，用于快速修改发布计划
// @author       qiuhongliang
// @icon         https://gitlab.com/assets/favicon-72a2cad5025aa931d6ea56c3201d1f18e68a8cd39788c7c80d5b2b82aa5143ef.png
// @match        https://gitlab.wangdian.cn/wms/*/merge_requests/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/448935/GitLab%20%E7%9A%84%20Merge%20Request%20%E9%A1%B5%E9%9D%A2%E8%A7%A3%E6%9E%90%20TAPD%20%E9%9C%80%E6%B1%82%20id%20%E5%B9%B6%E7%94%9F%E6%88%90%E5%8F%AF%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/448935/GitLab%20%E7%9A%84%20Merge%20Request%20%E9%A1%B5%E9%9D%A2%E8%A7%A3%E6%9E%90%20TAPD%20%E9%9C%80%E6%B1%82%20id%20%E5%B9%B6%E7%94%9F%E6%88%90%E5%8F%AF%E8%B7%B3%E8%BD%AC%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

// ！！！！！！！！！！！！这个脚本涉及到研发名字、公司 Git 域名，不能公开发布！！！！！！！！！！！！
(function () {
  "use strict";

  class TapdClient {
    /**
     * @var string[] 研发名字、也是分支名字的开头
     */
    userList = ["qiuhongliang", "shanlingyu", "guoshijie",];

    /**
     * @var string[] 提交日志前缀
     */
    commitMsgPrefixKeywordList = [
      "【bug】",
      "【需求】",
      "【优化】",
      "【错误操作】",
      "【自测修复】",
      "【自测优化】",
    ];

    /**
     * WMS 的 TAPD 项目的需求响应页面，需要拼接 id 才能访问
     */
    static baseUrl =
      "https://www.tapd.cn/59986469/prong/stories/view/115998646900";

    /**
     *
     * @param {string} msg
     * @returns
     */
    getId(msg) {
      msg = msg.toLowerCase(); // 转成小写，便于匹配关键字
      msg = msg.trim();

      if (msg == "") {
        return 0;
      }
      // 从分支中解析 id
      let id = 0;

      // 判断是不是来自分支的信息
      let isBranch = this.msgIsFromBranchName(msg);
      if (isBranch) {
        // 从分支中解析 id
        id = this.getIdFromBranchName(msg);
      } else {
        // 从提交记录中解析 id
        id = this.getIdFromCommitMsg(msg);
      }

      id -= 0;
      return id;
    }

    /**
     * 判断是不是分支名字
     * @param {string} msg
     * @returns
     */
    msgIsFromBranchName(msg) {
      // 获取到的用户名字不为空，则认为是分支
      let userName = this.getUserNameFromBranch(msg);
      return userName != "";
    }

    /**
     * 从分支名字中提取名字
     *
     * @return string
     */
    getUserNameFromBranch(msg) {
      msg = this.whiteSpaceReplace(msg);
      for (let userName of this.userList) {
        if (this.stringExists(msg, userName)) {
          return userName;
        }
      }

      return "";
    }

    /**
     * 获取提交日志的关键字
     * @param {string} msg
     * @returns
     */
    getCommitMsgKeyword(msg) {
      msg = this.whiteSpaceReplace(msg);
      for (let commitKeyword of this.commitMsgPrefixKeywordList) {
        if (msg.startsWith(commitKeyword)) {
          return commitKeyword;
        }
      }

      return "";
    }

    /**
     * 从分支名字里解析 id
     * @param {string} msg 分支名字
     * @returns int 需求id
     */
    getIdFromBranchName(msg) {
      msg = this.whiteSpaceReplace(msg);

      // 分支名字规则以“名字/”开头
      let userName = this.getUserNameFromBranch(msg);
      userName = userName + "/";

      if (msg.startsWith("origin/")) {
        msg = this.strCutEnd(msg, "origin/");
      }

      // msg 格式：qiuhongliang/【ID1026306】-【chali】取消的装箱单置空物流单号
      msg = this.strCutEnd(msg, userName);

      // msg 格式：【ID1026306】-【chali】取消的装箱单置空物流单号
      let id = this.pickIdFromMsgWithoutKeyword(msg);
      return id;
    }

    /**
     * 从提交消息内解析 id
     * @param {string} msg 格式：【需求】 1037602 百世汇通的单号订阅轨迹时由百世汇通订阅切换至极兔速递订阅
     * @returns
     */
    getIdFromCommitMsg(msg) {
      msg = this.whiteSpaceReplace(msg);
      let keyword = this.getCommitMsgKeyword(msg);

      // msg 格式：【需求】【ID1026306】-【chali】取消的装箱单置空物流单号
      msg = this.strCutEnd(msg, keyword);

      // msg 格式：【ID1026306】-【chali】取消的装箱单置空物流单号
      let id = this.pickIdFromMsgWithoutKeyword(msg);
      return id;
    }

    /**
     * 从去除关键字（分支名字、提交日志前缀）后的字符串中提取 id
     * @param {string} msg
     * @returns
     */
    pickIdFromMsgWithoutKeyword(msg) {
      msg = this.whiteSpaceReplace(msg);

      // msg 格式：【ID1026306】-【chali】取消的装箱单置空物流单号
      if (msg.startsWith("【")) {
        msg = this.strCutBetween(msg, "【", "】");
      }

      // msg 格式：ID1026306-【chali】取消的装箱单置空物流单号
      if (msg.startsWith("id")) {
        msg = this.strCutEnd(msg, "id");
      }

      // msg 格式：1026306-【chali】取消的装箱单置空物流单号
      let id = msg.substring(0, 7);
      return id;
    }

    /**
     * 删除空白字符
     * @param {string} str
     */
    whiteSpaceReplace(str) {
      return str.replace(/\s*/g, "");
    }

    /**
     *
     * 判断字符串是否存在
     * @param {string} srcString 源字符串
     * @param {string} findString 要查找的字符串
     * @returns true|false
     */
    stringExists(srcString, findString) {
      return srcString.indexOf(findString) != -1;
    }

    /**
     * 从源字符串中截取子字符串后的所有字符
     * @param {string} srcStr 源字符串
     * @param {string} subStr 查找的目标字符串
     * @returns 截取后的字符串
     */
    strCutEnd(srcStr, subStr) {
      if (srcStr == undefined || subStr == undefined) {
        return "";
      }

      var startPos = srcStr.indexOf(subStr);
      if (startPos == -1) {
        return "";
      }
      return srcStr.slice(startPos + subStr.length);
    }

    /**
     * 截取字符串
     * @param {string} srcStr 源字符串
     * @param {string} left
     * @param {string} right
     * @returns 截取后的字符串
     */
    strCutBetween(srcStr, left = "", right = "") {
      if (srcStr == undefined || left == undefined || right == undefined) {
        return "";
      }

      var startPos = srcStr.indexOf(left);
      var endPos = srcStr.indexOf(right, startPos + left.length);
      if (endPos == -1 && right != null) {
        return "";
      } else if (endPos == -1 && right == null) {
        return srcStr.substring(startPos + left.length);
      } else {
        return srcStr.slice(startPos + left.length, endPos);
      }
    }
  }

  /**
   * 获取 MR 名字，获取失败则返回空字符串
   */
  function getMergeRequestTitleName() {
    let mergeRequestTitleDom = null;
    if (window.location.href.indexOf("/merge_requests/new?") > 0) {
      // 如果是新建 MR，则 url 为 https://gitlab.wangdian.cn/wms/wms_server/-/merge_requests/new
      mergeRequestTitleDom = document.querySelector("#new_merge_request > div.form-group.row.d-flex.gl-px-5.branch-selector > div > span > code");
    } else {
      mergeRequestTitleDom = document.querySelector("#content-body > div.merge-request > div.detail-page-header.border-bottom-0.gl-display-block.gl-pt-5.gl-md-display-flex\\! > div.detail-page-header-body > div.issuable-meta.gl-display-flex > h1")
    }

    if (mergeRequestTitleDom == null) { 
      return "";
    }
    return mergeRequestTitleDom.textContent.toString();
  }

  /**
   * 添加跳转 TAPD 链接的提示语句
   */
  function addTapdLinkTip() {
    // 获取分支名字（MR 名字）
    let mergeRequestTitle = getMergeRequestTitleName();
  
    if (mergeRequestTitle == null || mergeRequestTitle == "") {
      // 对于新建 MR，也可以从 url 中解析
      console.log("包含分支名字元素为空，无法处理");
      return;
    }

    // 从分支名字解析 tapd 的需求 id
    let tapdClient = new TapdClient();
    let tapdId = tapdClient.getId(mergeRequestTitle);
    let url = TapdClient.baseUrl + tapdId;

    // 组装 html 标签，用于超链接跳转
    let aTag = document.createElement("a");
    aTag.href = url;
    aTag.target = "_blank"; // 新页面跳转
    aTag.style.color = "red";
    aTag.textContent = "点击前往 TAPD 修改发布计划及状态，需求 ID=" + tapdId;

    // 设置 div 及其颜色等数据
    let div = document.createElement("div");
    div.style.fontSize = "2.5em";
    div.style.color = "red";
    // 设置边框属性，尽量和 GitLab 页面统一
    div.style.border = "solid";
    div.style.borderColor = "#e5e5e5";
    div.style.borderWidth = "thin";
    div.style.borderRadius = "5px";
    div.style.marginTop = "18px";
    div.style.paddingLeft = "0.5em";
    div.style.paddingTop = "0.3em";
    div.style.paddingBottom = "0.3em";
    div.appendChild(aTag);

    // 页面上追加新元素
    let parentNode = document.querySelector("#notes > div > section > div > div.emoji-block.emoji-list-container.js-noteable-awards")
    if (parentNode == null) { 
      console.log("附属元素为空，无法追加新元素");
      return;
    }
    parentNode.appendChild(div);
  }

  /**
   * 突出显示“Delete source branch”
   */
  function highlightDeleteTip() {
    let removeSourceBranchInput = document.querySelector("#remove-source-branch-input");
    if (removeSourceBranchInput == null) {
      return;
    }

    // 先初始化元素状态
    onRemoveSourceBranchInputChange();
    // 绑定事件
    removeSourceBranchInput.onclick = onRemoveSourceBranchInputChange;
  }

  /**
   * 控件“Delete source branch”勾选框的响应函数
   * @returns
   */
  function onRemoveSourceBranchInputChange() {
    let removeSourceBranchInput = document.querySelector(
      "#remove-source-branch-input"
    );
    // 含有“Delete source branch”提示语的控件
    let tipLabel = document.querySelector(
      "#content-body > div > div.merge-request-details.issuable-details > div.mr-state-widget.prepend-top-default > div.mr-section-container.mr-widget-workflow > div.mr-widget-section > div > div.mr-widget-body.media > div.media-body > div > div > label"
    );
    if (removeSourceBranchInput == null || tipLabel == null) {
      console.log("highlightDeleteTip:无法处理事件响应，存在空元素");
      return;
    }

    tipLabel.style.fontSize = "1.5em";
    if (removeSourceBranchInput.checked) {
      // 已勾选
      tipLabel.style.color = "green";
    } else {
      // 未勾选
      tipLabel.style.color = "red";
    }
  }

  // 添加跳转 TAPD 链接的提示语句
  addTapdLinkTip();

  // 突出显示“Delete source branch”
  highlightDeleteTip();
})();

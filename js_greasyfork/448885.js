// ==UserScript==
// @name         TAPD 修改“基本信息”显示
// @namespace    hl_qiu163@163.com
// @version      0.2.0
// @description  用于在 TAPD 需求详情页面高亮关键字、重排字段展示顺序，便于快速定位自己关心的字段
// @author       qiuhongliang
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @match        https://www.tapd.cn/*/prong/stories/view/*
// @match        https://www.tapd.cn/tapd_fe/*/story/detail/*
// @grant        none
// @license      GPL
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/448885/TAPD%20%E4%BF%AE%E6%94%B9%E2%80%9C%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%E2%80%9D%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/448885/TAPD%20%E4%BF%AE%E6%94%B9%E2%80%9C%E5%9F%BA%E6%9C%AC%E4%BF%A1%E6%81%AF%E2%80%9D%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  async function sleep(msSecond) {
    return new Promise((resolve) => setTimeout(resolve, msSecond));
  }

  let tryCount = 0;
  while (tryCount++ < 30) {
    // 判断页面是否加载
    console.log("继续尝试判断页面是否加载完毕");
    if (getBaseInformationDiv(false)) {
      await sleep(500);
      break;
    }
    await sleep(500);
  }

  highlightKeyWord();
  changeFieldOrder();

  /**
   * 获取右侧“基础信息”模块
   * @returns {Element}
   */
  function getBaseInformationDiv(throwException = true) {
    let baseInfo = document.querySelector("#root > div.app-wrap > div.app > div.app__content div.detail-container-wrapper.entity-detail-layout div.detail-container-right > div.entity-detail-right");
    if (baseInfo) {
      return baseInfo;
    }

    if (throwException) {
      throw new Error("未找到需求详情页面数据");
    } else {
      console.error("未找到需求详情页面数据");
    }
  }

  /**
   * 高亮关键字
   */
  function highlightKeyWord() {
    let baseInfo = getBaseInformationDiv();

    let elementList = [
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="owner"]'])), // 处理人
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="developer"]'])), // 开发人员
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="release_id"]'])), // 发布计划
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="due"]'])), // 预计结束
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_24"]'])), // 预计完成时间（WMS接口用）
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_14"]'])), // 接口线上测试
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_23"]'])), // 是否需要灰测（WMS接口用）
    ];

    let targetColor = "red";
    for (const element of elementList) {
      if (element && element.firstElementChild) {
        element.firstElementChild.style.color = targetColor;
      }
    }
  }

  /**
   * 修改字段展示顺序，关心的字段靠前面排
   */
  function changeFieldOrder() {
    let baseInfo = getBaseInformationDiv();

    // 将处理人作为基点元素，对关心的元素进行重排
    let needAddElementList = [
      // 开发阶段关注内容 ----------------------------------------------------------------------------------------------
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="developer"]'])), // 开发人员
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="iteration_id"]'])), // 迭代
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_one"]'])), // 卖家账号
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="priority"]'])), // 优先级
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="due"]'])), // 预计结束
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_24"]'])), // 预计完成时间（WMS接口用）

      // 线上测试阶段关注内容 ------------------------------------------------------------------------------------------
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_four"]'])), // 产品经理
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_six"]'])), // 评审人
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_23"]'])), // 是否需要灰测（WMS接口用）
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_25"]'])), // 线上跟进情况（WMS接口用）
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_14"]'])), // 接口线上测试

      // 接口上线关注内容 ----------------------------------------------------------------------------------------------
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="release_id"]'])), // 发布计划

      // 代码审核阶段——接口还未启用该流程，故往后放
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_seven"]'])), // 代码核查人员
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_eight"]'])), // 代码核查状态

      // 目前接口不关注，但是挺重要的字段 ------------------------------------------------------------------------------
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="begin"]'])), // 预计开始
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="progress"]'])), // 进度
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="effort"]'])), // 预估工时
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="effort_completed"]'])), // 完成工时
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="remain"]'])), // 剩余工时
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="exceed"]'])), // 超出工时

      // 其他不重要内容 ------------------------------------------------------------------------------------------------
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="module"]'])), // 模块
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_11"]'])), // 加急处理
    ];

    let statusOwner = getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="owner"]'])); // 处理人
    sortNodeList(statusOwner, needAddElementList);

    // 不关心的元素移动到最底部-----------------------------------------------------------------------------------------
    let endNodeList = [
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="category_id"]'])), //  分类
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_five"]'])), //  需求反馈人
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_12"]'])), //  区域
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_13"]'])), //  类目
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="templated_id"]'])), //  创建模板
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_30"]'])), //  BUG关联需求
      getParentElement(getOneNotEmptyNode(baseInfo, ['[field-name="custom_field_31"]'])), //  上线仨月内出现且稳定复现
    ];
    let baseInfoLastChild = baseInfo.lastChild;
    sortNodeList(baseInfoLastChild, endNodeList);
  }

  /**
   * 获取元素的父元素
   * @param {Element} element
   */
  function getParentElement(element) {
    if (!element) {
      return null;
    }
    return element.parentNode;
  }

  /**
   * 获取第一个不能为空的元素
   *
   * @param {Element} baseNode 基点元素，在这个元素里搜索 selectorNameList 里第一个不为空的元素
   * @param {String[]} selectorNameList
   * @returns
   */
  function getOneNotEmptyNode(baseNode, selectorNameList) {
    if (!selectorNameList) {
      throw "getOneNotEmptyNode: 节点名字列表不能为空";
    }

    for (const nodeName of selectorNameList) {
      if (!nodeName) {
        continue;
      }
      let element = baseNode.querySelector(nodeName);
      if (element) {
        // 找到第一个不为空的则返回
        return element;
      }
    }

    return null;
  }

  /**
   * 按照 needAddElementList 传入顺序向基点元素后增加元素
   *
   * @param {Element} baseNode 基点元素， 将 needAddElementList 放到这个节点后
   * @param {Element[]} needAddElementList
   * @returns
   */
  function sortNodeList(baseNode, needAddElementList) {
    if (baseNode == null || baseNode == undefined) {
      console.log("排序失败，基点元素为空");
      return;
    }
    if (needAddElementList == null || needAddElementList == undefined) {
      console.log("排序失败，目标元素为空");
      return;
    }

    // 先倒序，再增加
    let newNeedAddElementList = needAddElementList.reverse();
    for (const node of newNeedAddElementList) {
      if (!node) {
        continue;
      }
      baseNode.after(node);
    }
  }
})();

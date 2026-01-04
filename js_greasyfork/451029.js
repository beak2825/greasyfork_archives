// ==UserScript==
// @name         TAPD 调整需求详情页面字段宽度、自动收起过滤条件、以及其他功能，具体看事件： addEventListener
// @namespace    hl_qiu163@163.com
// @version      0.1.7
// @description  用于在 TAPD 需求列表（查询过滤）页面，调整展示的字段宽度，默认的 ID 等字段列太宽。适应字段宽度，提高屏幕利用率
// @author       qiuhongliang
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @match        https://www.tapd.cn/tapd_fe/worktable/search*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/451029/TAPD%20%E8%B0%83%E6%95%B4%E9%9C%80%E6%B1%82%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E5%AD%97%E6%AE%B5%E5%AE%BD%E5%BA%A6%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E8%BF%87%E6%BB%A4%E6%9D%A1%E4%BB%B6%E3%80%81%E4%BB%A5%E5%8F%8A%E5%85%B6%E4%BB%96%E5%8A%9F%E8%83%BD%EF%BC%8C%E5%85%B7%E4%BD%93%E7%9C%8B%E4%BA%8B%E4%BB%B6%EF%BC%9A%20addEventListener.user.js
// @updateURL https://update.greasyfork.org/scripts/451029/TAPD%20%E8%B0%83%E6%95%B4%E9%9C%80%E6%B1%82%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9D%A2%E5%AD%97%E6%AE%B5%E5%AE%BD%E5%BA%A6%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E8%B5%B7%E8%BF%87%E6%BB%A4%E6%9D%A1%E4%BB%B6%E3%80%81%E4%BB%A5%E5%8F%8A%E5%85%B6%E4%BB%96%E5%8A%9F%E8%83%BD%EF%BC%8C%E5%85%B7%E4%BD%93%E7%9C%8B%E4%BA%8B%E4%BB%B6%EF%BC%9A%20addEventListener.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  let tryCount = 0;
  while (tryCount++ < 5) {
    console.log(`尝试修改标题，执行第${tryCount}次`, new Date().toLocaleString());
    // 用修改标题来判断页面是否加载差不多了
    if (changeTitle()) {
      break;
    }
    await sleep(500);
  }

  document.body.addEventListener("click", doTask);

  // 左侧筛选框加载完毕后，等待右侧表格数据展示完毕
  await sleep(1500);
  console.log(`尝试自动执行一次所有任务`, new Date().toLocaleString());
  doTask();

  async function sleep(msSecond) {
    return new Promise((resolve) => setTimeout(resolve, msSecond));
  }

  function doTask() {
    //   let randInt = Math.floor(Math.random() * 100); // 返回 0 至 99 之间的数
    //   if (randInt > 50) {
    //     return;
    // }

    console.log("【TAPD 调整需求详情页面字段宽度、自动收起过滤条件】进入监听事件并执行任务");

    // 修改页面的标题，使得标题栏展示过滤条件的名称
    changeTitle();

    // 收起过滤条件
    foldFilterConditionArrowTop();

    // 表格信息加载比较慢，增加适当的延迟
    sleep(1000);
    changeTableInfo();
  }

  /**
   * 修改表格信息
   */
  function changeTableInfo() {
    // 删除 story 标签
    removeStoryTag();

    // 调整宽度
    adjustElementWidth();
  }

  /**
   * 删除 story 标签
   */
  function removeStoryTag() {
    let story_icon_list = document.getElementsByClassName("workitem-icon");
    let size = story_icon_list.length;
    for (let i = size - 1; i >= 0; i--) {
      story_icon_list[i].remove();
    }
  }

  /**
   * 修改页面的标题，使得标题栏展示过滤条件的名称
   * @return 是否成功修改
   */
  function changeTitle() {
    // 当前的查询条件列表
    let view_list_ul = document.getElementsByClassName("view-list-ul")[0];
    if (!view_list_ul) {
      return false;
    }

    // 当前的查询条件
    let current_view = view_list_ul.getElementsByClassName("current-view")[0];
    if (!current_view) {
      return false;
    }

    // 覆写标题
    let queryName = current_view.textContent.trim();
    if (!queryName) {
      return false;
    }

    document.title = queryName;
    return true;
  }

  /**
   * 收起过滤条件
   */
  function foldFilterConditionArrowTop() {
    // 点击【收起过滤条件】按钮
    let btn = document.getElementsByClassName("filter-slide__itemicon tapd-icon-d-arrow-top")[0];
    if (btn) {
      btn.click();
    }
  }

  /**
   * 调整需求列表表格的部分字段宽度，提高使用率
   */
  function adjustElementWidth() {
    // 不要判断元素是否存在，当判断的时候，页面会展示未修改的间距，然后等几秒后再突变
    // let table = document.querySelector("#root > div > div.app > div > div > div.worktable-detail > div > div.search-detail-wrap > div.search-result.webkit-scrollbar.search-result-advance.overflow-table");
    // if (!table) {
    //   return
    // }

    // 字段名字:像素大小
    let list = {
      "col-field--id": "70px", // ID
      "col-field--name": "400px", // 标题
      "col-field--priority": "60px", // 优先级
      "col-field--iteration_id": "125px", // 迭代
      "col-field--status": "120px", // 状态
      "col-field--developer": "70px", // 开发人员
      "col-field--owner": "70px", // 处理人
      "col-field--release_id": "115px", // 发布计划
      "col-field--custom_field_卖家账号": "80px", // 卖家账号
      "col-field--custom_field_对客户的影响": "30px", // 对客户的影响
      "col-field--parent_id": "50px", // 父需求
      "col-field--custom_field_产品经理": "70px", // 父需求
    };

    for (let key in list) {
      Array.from(document.getElementsByClassName(key)).forEach(function (v, i) {
        v.style.width = list[key];
      });
    }
  }
})();

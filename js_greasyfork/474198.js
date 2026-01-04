// ==UserScript==
// @name         Jira Timeline工作量统计
// @namespace    JiraTimelineWorkload
// @author       周志杰
// @version      V1.9.2
// @description  统计Jira上Timeline模块的工作量，显示每个人的Story points累加结果。注意需要计算的工时必须展示在页面上，否则无法读取并计算未展示部分。jira官方面板经常变化，我会尽量第一时间适配，需要及时更新。
// @match        https://tripflt.atlassian.net/*
// @grant GM_notification
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/474198/Jira%20Timeline%E5%B7%A5%E4%BD%9C%E9%87%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/474198/Jira%20Timeline%E5%B7%A5%E4%BD%9C%E9%87%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

// 需检查脚本更新，从greasyfork获取最新版本号，如果有更新则提示用户。更新地址：https://greasyfork.org/zh-CN/scripts/474198-jira-timeline%E5%B7%A5%E4%BD%9C%E9%87%8F%E7%BB%9F%E8%AE%A1

// tableID会有变动，需要根据实际情况修改
const tableID = 'portfolio-3-portfolio.app-simple-plans.main.tabs.roadmap.table'

function checkUpdate() {
    const scriptId = "474198";
    const scriptVersion = GM_info.script.version;
    const url = `https://greasyfork.org/zh-CN/scripts/${scriptId}.js`;
    fetch(url)
      .then((response) => response.text())
      .then((text) => {
        const match = text.match(/@version\s+(\S+)/);
        console.log("greasyfork版本", match[1]);
        if (match) {
          const version = match[1];
          if (version !== scriptVersion) {
            const message = `Jira Timeline工作量统计有新版本${version}，当前版本${scriptVersion}，请及时更新。`;
            console.log(message);
            window.setTimeout(() => {
              window.location.href = url;
            }, 1000);
          }
        }
      });
  }

  const getStoryPointFromRow = (row) => {
    const cell = Array.from(row.cells).find((item) => {
      return item.getAttribute("data-attribute") === "estimate";
    });
    if (cell) {
      const childElements = cell.querySelectorAll("*");
      if (childElements.length > 0) {
        const lastChild = childElements[childElements.length - 1];
        const value = parseFloat(lastChild.value) || 0;
        return value;
      }
    }
    return 0;
  };

  function updateStoryPointLabel(row, storyPointSum) {
    const storyPointLabel = row.querySelectorAll("td")[1];
    const total = storyPointSum.toFixed(1);
    if (total === 0) return;

    const labelElement = document.createElement("span");
    labelElement.classList.add("groupRow");
    labelElement.textContent = total;
    labelElement.style.display = "inline-block";
    labelElement.style.padding = "2px 6px";
    labelElement.style.borderRadius = "4px";
    labelElement.style.textAlign = "center";

    if (total < 8) {
      labelElement.style.backgroundColor = "#FFF9C4";
      labelElement.style.color = "#F57F17";
    } else if (total >= 8 && total <= 12) {
      labelElement.style.backgroundColor = "#E3FCEF";
      labelElement.style.color = "#016644";
    } else {
      labelElement.style.backgroundColor = "#FADBD8";
      labelElement.style.color = "red";
    }

    storyPointLabel.style.display = "flex";
    storyPointLabel.style.alignItems = "center";
    storyPointLabel.style.justifyContent = "center";
    storyPointLabel.appendChild(labelElement);
  }

  // 计算工时
  function countWork() {
    const containerElement = document.querySelector(
        `[data-testid="${tableID}"]`
    );
    if (!containerElement) {
      console.error("找不到目标容器元素");
    }
    const tableElement = containerElement.querySelector("table");
    if (!tableElement) {
      console.error("找不到目标表格元素");
    }

    const rows = tableElement.querySelectorAll("tbody tr");
    let groupHeadRow = null;
    let storyPointSum = 0;
    // console.log('当前页面Dom总行数', rows.length)
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      const isEmptyRow = Array.from(cells).every(
        (cell) => cell.textContent.trim() === ""
      );
      const storyPoint = getStoryPointFromRow(row);
      //   console.log('当前row的storyPoint为', storyPoint, `当前row为第${index}行，${isEmptyRow ? '是空行' : ''}`)
      // 判断当前行是否是每组rows的头行
      if (
        !isEmptyRow &&
        cells.length > 0 &&
        cells[0].textContent.trim() !== "" &&
        cells[0].querySelector(
          '[data-testid="portfolio-3-portfolio.app-simple-plans.main.tabs.roadmap.scope.issues.group.group-header"]'
        )
      ) {
        // console.log('小组头行,当前计算工时组的同学名为', cells[0].textContent.trim())
        // 如果是头行，且当前组不为空，则将当前组的总工时显示在当前组的头行上第二个cell中
        if (groupHeadRow) updateStoryPointLabel(groupHeadRow, storyPointSum);
        // 标记当前行为小组头行，并重置当前组和总工时
        groupHeadRow = row;
        storyPointSum = 0;
      } else if (cells.length > 0 && storyPoint !== 0) {
        storyPointSum += storyPoint;
      }
    });
    // 最后一组
    if (groupHeadRow) updateStoryPointLabel(groupHeadRow, storyPointSum);
  }

  // 清空工时
  function cleanWork(callback) {
    const containerElement = document.querySelector(
        `[data-testid="${tableID}"]`
    );
    const tableElement = containerElement.querySelector("table");
    if (!tableElement) return;
    // 选取所有包含groupRow的元素，也就是小组头元素，清除其内容
    tableElement
      .querySelectorAll(".groupRow")
      .forEach((groupRow) => groupRow.remove());
    if (callback) callback();
  }

  function initialize() {
    console.log("Jira Timeline工作量统计");
    checkUpdate();

    const intervalId = setInterval(() => {
      const containerElement = document.querySelector(
        // '[data-testid="portfolio-3-portfolio.app-simple-plans.main.tabs.roadmap.table"]'
        `[data-testid="${tableID}"]`
      );

      if (containerElement) {
        clearInterval(intervalId);
        countWork();

        const tableElement = containerElement.querySelector("table");
        const tableBody = tableElement.querySelector("tbody");
        const observer = new MutationObserver((mutationsList, observer) => {
          cleanWork(countWork);
        });
        const observerOptions = {
          childList: true, // 观察目标子节点的变化，是否有添加或者删除
          attributes: false, // 观察属性变动
          subtree: false, // 观察后代节点，默认为 false
        };
        observer.observe(tableBody, observerOptions);
      }
    }, 300);
  }

  initialize();

// ==UserScript==
// @name         魔数大仓专属talos1.0插件
// @namespace    Violentmonkey Scripts
// @version      1.1.7
// @description  一起快乐发布吧！！！
// @author       MYH
// @match        https://talos.sankuai.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485643/%E9%AD%94%E6%95%B0%E5%A4%A7%E4%BB%93%E4%B8%93%E5%B1%9Etalos10%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/485643/%E9%AD%94%E6%95%B0%E5%A4%A7%E4%BB%93%E4%B8%93%E5%B1%9Etalos10%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
(function () {
  // 展示发布应用信息等
  const showApp = () => {
    document.querySelector(".data-list .logs")?.childNodes?.forEach((child) => {
      const cardEl = child?.childNodes[0].childNodes[1];
      const cradFlowId = cardEl
        ?.getElementsByTagName("a")[0]
        ["href"].split("/")
        .pop();
      let idTag = cardEl.getElementsByClassName("custom-flowid");
      if (idTag.length === 0) {
        idTag = document.createElement("span");
        idTag.className = "custom-flowid";
        idTag.style.position = "absolute";
        idTag.style.right = 0;
        idTag.style.bottom = 0;
        cardEl.appendChild(idTag);
      }
      window
        .fetch(`//talos-api.sankuai.com/sub_app/751/publish/${cradFlowId}`, {
          credentials: "include",
        })
        .then((res) => res.json())
        .then((res) => {
          const { data } = res;
          const appValue =
            data.flow?.publishConfig?.envs?.find(
              (item) => item.key === "MULTI_SUBAPP_LIST"
            )?.value || "";
          if (!appValue) return;
          const swimlane =
            data.flow?.target === "newtest"
              ? data.flow?.publishConfig?.envs?.find(
                  (item) => item.key === "SWIMLANE"
                )?.value || ""
              : "";
          const isGraypublish =
            data.flow?.publishConfig.hasOwnProperty("canaryType"); // 存在此字段则为灰度发布
          let showText = `${appValue}`;
          if (swimlane) {
            showText = `${cradFlowId} -- (泳道：${swimlane}) -- ${showText}`;
          } else if (isGraypublish) {
            const grayCell =
              data.flow?.publishConfig.canaryConfig.canaryOnline.split(
                "cell="
              )[1];
            showText = `${cradFlowId} --(灰度cell：${grayCell}) -- ${showText}`;
          } else {
            showText = `${cradFlowId} -- ${showText}`;
          }
          (idTag[0] || idTag).textContent = showText;
        });
    });
  };
  const getButton = () => {
    const appRecords = document.querySelector(".sub-app-records");
    if (!appRecords.getElementsByClassName("show-app-button")?.length) {
      appRecords.style.position = "relative";
      const showAppButton = document.createElement("button");
      showAppButton.className = "show-app-button";
      showAppButton.innerText = "展示所选app";
      showAppButton.style.position = "absolute";
      showAppButton.style.right = 0;
      showAppButton.style.top = 0;
      showAppButton.addEventListener("click", () => {
        showApp();
      });
      appRecords.appendChild(showAppButton);
    }
  };

  // 灰度发布，重置流量比例
  const getPublishType = () => {
    if (!document.querySelector('input[value="canaryPublish"]')?.checked)
      return "";
    const grayConfigCheckedList = document.querySelectorAll(
      ".canary-config-checkbox .el-checkbox.is-checked"
    );
    // 线上配置不展示时, 说明不是灰度热更新
    // !!document.querySelector('.canary-config-onlineCanary').style?.cssText?.includes("display: none")
    const isGrayHotPublishEl = Array.from(grayConfigCheckedList).find(
      (node) => {
        return node.innerText.includes("灰度热更新");
      }
    );
    if (isGrayHotPublishEl) return "grayRefresh";
    return "gray";
  };
  const resetCanaryRangeLimit = () => {
    const canaryLimitEl = document.querySelector(
      ".canary-config-range-limit input"
    );
    if (!canaryLimitEl) return;
    canaryLimitEl.value = 1;
    canaryLimitEl.dispatchEvent(new Event("change"));
  };

  // 灰度热更新
  const desc = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  const getApplistEl = () => {
    // 获取属性为for="pluginsConfig"的label元素
    const label = document.querySelector('label[for="pluginsConfig"]');
    // 判断其名称是否为“插件配置”
    if (label && label.textContent.trim() === "插件配置") {
      // 获取它的兄弟元素
      const sibling = label.nextElementSibling;
      // 从表单中查找
      const formItemNodeList =
        sibling.querySelectorAll(".env-row.el-row") || [];
      const nodeListArray = Array.from(formItemNodeList);
      const appSelecItemNode = nodeListArray.find((element) => {
        return element.innerText.includes("魔数批量发布应用选择器");
      });
      // 再次判断是不是应用配置，若是，取下拉元素
      const input = appSelecItemNode.querySelector("input");
      if (input.value === "MULTI_SUBAPP_LIST") {
        return appSelecItemNode.querySelector(".env-row.el-row .el-select");
      }
    }
    return null;
  };
  const getAppListValue = (envs) => {
    try {
      const applistValue = envs.find(
        (env) => env.key === "MULTI_SUBAPP_LIST"
      ).value;
      return JSON.parse(applistValue);
    } catch (error) {
      return null;
    }
  };
  const handleReplace = async (flowId) => {
    const res = await window
      .fetch(`//talos-api.sankuai.com/sub_app/751/publish/${flowId}`, {
        credentials: "include",
      })
      .then((res) => res.json());
    const { data } = res;
    const { flow } = data;
    const { publishConfig } = flow;
    const { branch, canaryConfig, envs } = publishConfig;
    const { canaryOnline, canaryUpdate, canaryOffline } = canaryConfig;
    const openConfEl = document.querySelector(
      ".deploy-panel .canary-config .canary-config-item"
    ).parentElement;
    if (!Array.from(openConfEl.classList).includes("is-active")) {
      await openConfEl.click();
    }
    const branchEl = document.querySelector(
      ".deploy-branch input[role=textbox]"
    );
    branchEl.value = branch;
    branchEl.dispatchEvent(new Event("input"));
    //const canaryLimitEl = document.querySelector('.canary-config-range-limit input')
    //canaryLimitEl.value = 1
    //canaryLimitEl.dispatchEvent(new Event('change'))
    resetCanaryRangeLimit();
    const confNodes = Array.from(
      document.querySelector(
        ".deploy-panel .canary-config [role=tabpanel] .el-collapse-item__content"
      ).childNodes
    );
    const canaryOnlineEl = confNodes
      .find((item) => item.innerHTML.includes("Canary Online"))
      .querySelector("input");
    const canaryUpdateEl = confNodes
      .find((item) => item.innerHTML.includes("Canary Update"))
      .querySelector("input");
    const canaryOfflineEl = confNodes
      .find((item) => item.innerHTML.includes("Canary Offline"))
      .querySelector("input");
    const applistEl = getApplistEl();
    const appListValue = getAppListValue(envs);
    if (appListValue && applistEl) {
      applistEl.__vue__.$emit("input", appListValue);
    }
    canaryOnlineEl.value = canaryOnline;
    canaryOnlineEl.dispatchEvent(new Event("input"));
    canaryUpdateEl.value = canaryUpdate;
    canaryUpdateEl.dispatchEvent(new Event("input"));
    canaryOfflineEl.value = canaryOnline;
    canaryOfflineEl.dispatchEvent(new Event("input"));
  };

  // 插入灰度cookie 复制按钮
  let isGrayButtonCreated = false;
  const createdGrayButton = () => {
    if (isGrayButtonCreated) return;
    const element = document.querySelector(".el-dialog .canary-whitelist-item");
    const talosVersion =
      document.querySelectorAll(".op-info-tag.el-tag--success")[1]?.outerText ||
      "";
    if (!element || !talosVersion) {
      return;
    }
    // 创建一个新的div元素
    const div = document.createElement("div");
    // 创建一个按钮
    const generateButton = document.createElement("button");
    generateButton.textContent = "获取talosHash";
    generateButton.addEventListener("click", () => {
      navigator.clipboard.writeText(talosVersion);
    });
    const addBtn = document.getElementsByClassName(
      "el-button btn-add-whitelist"
    )?.[0];

    const list = [
      { label: "分析板", value: "analysis_talos_version" },
      { label: "分析板分享", value: "analysis-display_talos_version" },
      { label: "dashboard", value: "dashboard_talos_version" },
      { label: "仪表板分享", value: "dashboard-display_talos_version" },
      { label: "仪表板2.0图表编辑页", value:"dashboard-chart-edit_talos_version"},
      { label: "ai", value: "ai_talos_version" },
      { label: "SQL-V2", value: "sqlv2_talos_version" },
      { label: "数据集-V2", value: "datasetv2_talos_version" },
      { label: "SQL", value: "sql_talos_version" },
      { label: "Portal", value: "portal_talos_version" },
      { label: "工作空间", value: "space_talos_version" },
      { label: "监控预警", value: "monitor_talos_version" },
      { label: "数据集", value: "dataset_talos_version" },
      { label: "取数工具", value: "wormhole_talos_version" },
      { label: "首页", value: "home_talos_version" },
      { label: "资源管理", value: "source-manager_talos_version" },
    ];

    div.appendChild(generateButton);
    // 创建其他按钮并添加到div中
    list.forEach((item) => {
      const button = document.createElement("button");
      button.textContent = item.label;
      button.style.marginLeft = "10px";
      button.style.background = "#fff";
      button.style.cursor = "pointer";
      button.addEventListener("click", () => {
        // navigator.clipboard.writeText(item.value)
        if (addBtn) {
          addBtn.click();
          setTimeout(() => {
            const canaryItemList = document.querySelectorAll(
              ".canary-whitelist-item"
            );
            const canaryItem = canaryItemList[canaryItemList.length - 1];
            const keyInputEl = canaryItem.querySelector(
              '.canary-config-whitelistKey.el-input input[placeholder="key"]'
            );
            if (keyInputEl) {
              keyInputEl.value = item.value;
              keyInputEl.dispatchEvent(new Event("input"));
            }
            const valueInputEl = canaryItem.querySelector(
              ".canary-config-whitelistVal input"
            );
            if (valueInputEl) {
              valueInputEl.value = talosVersion;
              valueInputEl.dispatchEvent(new Event("input"));
            }
          }, 100);
        }
      });
      div.appendChild(button);
    });
    element.insertAdjacentElement("beforebegin", div);
    isGrayButtonCreated = true;
  };

  // 检查当前线上是否已有该灰度cell
  const grayCellClassName = "gray-cell-check-button";
  const checkGray = () => {
    const env = document
      .querySelector('div[class="publish"]')
      ?.querySelector('div[class="el-tabs__item is-left is-active"]')
      ?.innerText?.replace(/(.*)\((.*)\)/, "$2")
      ?.trim();
    const cellDoms = document.querySelectorAll(
      'div[class="el-collapse-item__content"]'
    );
    let currentCell = "";
    Array.from(cellDoms).forEach((dom) => {
      currentCell = dom
        .querySelector("input")
        ?.value?.replace(/.*cell=(.*)/, "$1")
        ?.trim();
    });
    if (!currentCell) {
      return;
    }

    const btn = document.getElementsByClassName(grayCellClassName)?.[0];
    if (btn) {
      btn.innerText = "检测中...";
    }

    window
      .fetch(
        `https://talos-api.sankuai.com/sub_app/751/publish?id=10329&target=${env}&page_num=1&page_size=20&type=canary&status=pending`,
        {
          credentials: "include",
        }
      )
      .then((res) => res.json())
      .then((res) => {
        if (btn) {
          btn.innerText = "检测灰度cell（最近20条）";
        }
        const { data } = res || {};
        const { list } = data || {};
        for (let i = 0; i < list.length; i++) {
          const { publish_config, id, op } = list[i] || {};
          const { canaryType, canaryConfig } = publish_config || {};
          const { canaryOnline } = canaryConfig || {};
          if (canaryType && typeof canaryOnline === "string") {
            // 灰度发布 & 正在进行中灰度
            const cell = canaryOnline.replace(/.*cell=(.*)/, "$1")?.trim();
            if (cell === currentCell) {
              navigator.clipboard.writeText(
                `https://talos.sankuai.com/#/project/10329/sub-app/751/log/${id}`
              );
              window.alert(
                `已存在相同cell: ${cell} \n发布人：${op}\n冲突版本的发布日志链接已复制到剪切板, 可新开一页粘贴查看`
              );
              return;
            }
          }
        }
        window.confirm(
          `${env}环境不存在相同cell: ${currentCell}，可放心灰度～`
        );
      });
  };
  const insertGrayCheckBtn = () => {
    Array.from(document.getElementsByTagName("button")).forEach((btn) => {
      if (btn.innerText === "发布") {
        if (document.getElementsByClassName(grayCellClassName).length > 0) {
          return;
        }
        const checkGrayBtn = document.createElement("button");
        checkGrayBtn.className = grayCellClassName;
        checkGrayBtn.innerText = "检测灰度cell（最近20条）";
        checkGrayBtn.style.position = "absolute";
        checkGrayBtn.style.left = "-200px";
        checkGrayBtn.style.top = 0;
        checkGrayBtn.addEventListener("click", (e) => {
          checkGray();
          e.preventDefault();
        });
        btn.parentElement.appendChild(checkGrayBtn);
      }
    });
  };
  const checkGrayCellExist = () => {
    if (document.querySelector('input[value="canaryPublish"]')?.checked) {
      insertGrayCheckBtn();
    }
  };

  const removeGrayCheckBtn = () => {
    document.getElementsByClassName(grayCellClassName)?.[0]?.remove();
  };

  const observeTab = () => {
    let activeTab = null;
    let grayEl = null;
    const observer = new MutationObserver(() => {
      if (
        window.location.hash.includes("#/project/10329/sub-app/751/records")
      ) {
        activeTab = document.querySelector(".el-menu-item.is-active");
        activeTab?.childNodes[1].innerText === "发布记录" && getButton();
      }
      // 灰度发布
      if (
        window.location.hash.includes("#/project/10329/sub-app/751/publish")
      ) {
        const publishType = getPublishType();
        // 灰度热更新
        if (publishType === "grayRefresh") {
          removeGrayCheckBtn();
          grayEl = document.querySelector(".canary-config-onlineCanary input");
          if (grayEl) {
            Object.defineProperty(grayEl, "value", {
              ...desc,
              set(v) {
                handleReplace(v.replace(/\D+/, ""));
                desc.set.call(this, v);
              },
            });
          }
        }
        // 灰度发布
        else if (publishType === "gray") {
          // 重置默认流量比例, 延迟触发，确保元素能获取到
          checkGrayCellExist();
          setTimeout(() => {
            resetCanaryRangeLimit();
          }, 300);
        } else {
          removeGrayCheckBtn();
        }
      }

      if (window.location.hash.includes("#/project/10329/sub-app/751/log/")) {
        createdGrayButton();
      } else {
        // 重置按钮添加标识
        isGrayButtonCreated = false;
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  };
  observeTab();
})();
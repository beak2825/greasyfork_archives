// ==UserScript==
// @name         AUTO-ONPROVER 
// @namespace    https://chat.openai.com/
// @version      1.6
// @description  自动点击 Prover 按钮，10 分钟卡死刷新页面，刷新后恢复运行
// @match        https://onprover.orochi.network/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537003/AUTO-ONPROVER.user.js
// @updateURL https://update.greasyfork.org/scripts/537003/AUTO-ONPROVER.meta.js
// ==/UserScript==

// ==UserScript==
// @name         ONPROVER 自动点击与防卡壳脚本（增强版）
// @namespace    https://chat.openai.com/
// @version      1.3 // 版本号更新，以表示功能增强
// @description  自动点击 Prover/Prove 按钮，智能监测页面卡顿并刷新，解决数据获取与按钮识别问题
// @match        https://onprover.orochi.network/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  console.log("[脚本启动] ONPROVER 自动点击脚本加载中...");

  // 定义 TARGET_LABELS，确保 getStats 可以访问到，并提高可读性
  const TARGET_LABELS = {
    ON_EARNED: '$ON EARNED',
    VERIFIED_PROOFS: 'VERIFIED PROOFS',
    NEW_PROOFS: 'NEW PROOFS'
  };

  let lastStats = { earned: null, proofs: null, new: null };
  let stuckCounter = 0;

  /**
   * 改进的 getStats 函数，根据实际 HTML 结构查找数据。
   * 查找包含描述文本的 <p> 标签，并获取其前一个兄弟元素（包含数值）。
   */
  function getStats() {
    // 查找所有可能的标签元素，这里我们寻找包含 "uppercase" 类的 <p> 标签，它们是数值的描述。
    const labelPTags = document.querySelectorAll('p.text-12.font-semibold.text-white\\/50.uppercase');

    /**
     * 查找并返回给定标签对应的数值文本。
     * @param {string} label - 要查找的标签文本（例如 "$ON EARNED"）。
     * @returns {string|null} 找到的数值文本，如果未找到则返回 null。
     */
    const getNumber = (label) => {
      for (let labelP of labelPTags) {
        // 检查当前 <p> 标签的文本内容是否包含目标标签
        if (labelP.textContent.trim().toUpperCase().includes(label.toUpperCase())) {
          // 找到对应的 <p> 标签后，其前一个兄弟元素就是包含数值的 <p> 标签
          const valueP = labelP.previousElementSibling;

          if (valueP && valueP.classList.contains('text-24')) { // 再次确认这是数值 P 标签
            // 特殊处理 $ON EARNED，因为它可能包含多个 span 且有显示/隐藏
            if (label.toUpperCase().includes(TARGET_LABELS.ON_EARNED.toUpperCase())) {
              let visibleValue = '';
              const spansInValueP = valueP.querySelectorAll('span');
              if (spansInValueP.length > 0) {
                for (const span of spansInValueP) {
                  // 检查元素的计算样式，看它是否是可见的（即不是 display: none）
                  if (window.getComputedStyle(span).display !== 'none') {
                    visibleValue = span.textContent.trim();
                    break; // 找到可见的就停止
                  }
                }
              } else {
                // 如果没有 span，直接用 p 的文本
                visibleValue = valueP.textContent.trim();
              }
              return visibleValue;
            } else {
              // 对于其他标签，直接返回其数值 <p> 标签的文本内容
              return valueP.textContent.trim();
            }
          }
        }
      }
      return null; // 未找到对应的标签或数值元素
    };

    // 调用 getNumber 来获取各个数值的原始文本
    const earnedText = getNumber(TARGET_LABELS.ON_EARNED);
    const proofsText = getNumber(TARGET_LABELS.VERIFIED_PROOFS);
    const newProofsText = getNumber(TARGET_LABELS.NEW_PROOFS);

    // 返回一个对象，将文本转换为数值类型，如果为 null 则保留 null
    return {
      earned: earnedText !== null ? parseFloat(earnedText) || 0 : null,
      proofs: proofsText !== null ? parseInt(proofsText, 10) || 0 : null,
      new: newProofsText !== null ? parseInt(newProofsText, 10) || 0 : null,
    };
  }

  /**
   * 改进的 autoClickProver 函数，更健壮地查找并点击 "Prover" 或 "PROVE" 按钮。
   * 增加了调试日志。
   */
  function autoClickProver(retry = 20) {
    let attempts = 0;
    const interval = setInterval(() => {
      const buttons = document.querySelectorAll("button");
      if (buttons.length === 0) {
        console.log("[自动点击] 尚未找到任何按钮。"); // 调试信息
      }

      let buttonFound = false; // 标记是否找到并点击了按钮

      for (let btn of buttons) {
        const fullButtonText = btn.textContent.trim(); // 获取原始完整文本，去除首尾空格
        const lowerCaseText = fullButtonText.toLowerCase(); // 转换为小写进行匹配

        // 详细调试输出，以便你了解脚本正在检查哪些按钮
        console.log(`[自动点击] 正在检查按钮文本: "${fullButtonText}" (小写: "${lowerCaseText}")`);

        // 检查按钮文本是否包含 "prover" 或 "prove"（例如 "Start Prover" 或 "PROVE"），
        // 并且不包含 "stop"（避免点击 "Stop Prover"）
        if ((lowerCaseText.includes("prover") || lowerCaseText.includes("prove")) && !lowerCaseText.includes("stop")) {
          console.log(`[自动点击] 找到目标按钮并尝试点击: "${fullButtonText}"`);
          btn.click();
          buttonFound = true; // 设置标记
          clearInterval(interval); // 找到并点击后，清除定时器
          return; // 退出函数
        }
      }

      if (!buttonFound) { // 如果本次循环没有找到按钮
          attempts++;
          if (attempts >= retry) {
            console.warn(`[自动点击] 达到最大尝试次数 (${retry} 次)，未找到目标按钮。`);
            clearInterval(interval); // 达到最大尝试次数，停止定时器
          } else {
            console.log(`[自动点击] 未找到目标按钮，继续尝试 (第 ${attempts} 次/${retry} 次)...`);
          }
      }
    }, 1000);
  }

  // Cloudflare 验证提醒
  setTimeout(() => {
    if (document.body.innerText.includes("确认您是真人")) {
      alert("⚠️ 请手动勾选 Cloudflare 验证 ✅，验证完成后自动继续！");
    } else {
      console.log("[检查] 未检测到验证码，尝试启动 Prover");
      autoClickProver();
    }
  }, 4000);

  // 每分钟检测状态变化
  setInterval(() => {
    const current = getStats(); // 调用改进后的 getStats
    console.log("[状态监控]", current);

    // 检查是否所有值都为 null，这可能意味着数据尚未加载或查找失败
    const allNull = current.earned === null && current.proofs === null && current.new === null;

    // 只有当数据不全为 null，并且数据与上次完全一致时，才增加 stuckCounter
    if (!allNull &&
        current.earned === lastStats.earned &&
        current.proofs === lastStats.proofs &&
        current.new === lastStats.new
    ) {
      stuckCounter++;
      console.warn(`[警告] 第 ${stuckCounter} 分钟无变化`);
    } else {
      stuckCounter = 0; // 有变化或数据未完全加载，重置计数器
      lastStats = current; // 更新最后状态
    }

    if (stuckCounter >= 5) {
      console.log("[重启] 检测到卡住，刷新页面！");
      location.reload();
    }
  }, 60 * 1000);
})();

// ==UserScript==
// @name         Douyin Tools - Quick Profile & Smart Block
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Q keyboard opens author profile + Auto block author and close page (with auto_block parameter)|Q键盘打开当前推荐视频作者主页 + 支持自动拉黑作者并关闭页面（带auto_block参数）|关键词:抖音拉黑，推荐页面一键拉黑
// @author       Bela Proinsias
// @match        *://www.douyin.com/*
// @icon         https://www.douyin.com/favicon.ico
// @grant        GM_openInTab
// @grant        GM_notification
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/537297/Douyin%20Tools%20-%20Quick%20Profile%20%20Smart%20Block.user.js
// @updateURL https://update.greasyfork.org/scripts/537297/Douyin%20Tools%20-%20Quick%20Profile%20%20Smart%20Block.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ---------- Task queue management ----------
  let g_task_queue = [];
  let g_is_processing = false;
  let g_status_element = null;
  let g_temp_message_element = null;
  let g_message_timer = null;

  (function injectStyles() {
    if (document.getElementById("block-task-style")) return;
    const style = document.createElement("style");
    style.id = "block-task-style";
    style.textContent = `
    .block-task-status, .block-task-message {
      position: fixed;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 12px;
      z-index: 10000;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      white-space: nowrap;
      display: none;
      transition: opacity 0.3s ease;
      opacity: 0;
    }
    .block-task-status {
      top: 10px;
      right: 10px;
    }
    .block-task-message {
      top: 10px;
      left: 10px;
      max-width: 80vw;
      overflow: hidden;
      text-overflow: ellipsis;
      z-index: 10001;
    }
    .block-task-show {
      display: block !important;
      opacity: 1 !important;
    }
  `;
    document.head.appendChild(style);
  })();

  function create_status_element() {
    if (g_status_element) return;
    g_status_element = document.createElement("div");
    g_status_element.className = "block-task-status";
    document.body.appendChild(g_status_element);
  }

  function create_temp_message_element() {
    if (g_temp_message_element) return;
    g_temp_message_element = document.createElement("div");
    g_temp_message_element.className = "block-task-message";
    document.body.appendChild(g_temp_message_element);
  }

  function update_status_display() {
    if (!g_status_element) create_status_element();
    if (g_task_queue.length === 0) {
      g_status_element.classList.remove("block-task-show");
    } else {
      const current_task = g_task_queue[0];
      const queue_info =
        g_task_queue.length > 1 ? ` (+${g_task_queue.length - 1} waiting)` : "";
      g_status_element.textContent = `${current_task.user_id}${queue_info}`;
      g_status_element.classList.add("block-task-show");
    }
  }

  function show_temp_message(message, duration = 2000) {
    if (!g_temp_message_element) create_temp_message_element();

    g_temp_message_element.textContent = message;
    g_temp_message_element.classList.add("block-task-show");

    if (g_message_timer) clearTimeout(g_message_timer);
    g_message_timer = setTimeout(() => {
      g_temp_message_element.classList.remove("block-task-show");
    }, duration);
  }

  // Add task to queue
  function add_to_queue(user_id) {
    // Check if task for this user already exists
    const existing_task = g_task_queue.find((task) => task.user_id === user_id);
    if (existing_task) {
      show_temp_message(`User ${user_id} already in queue`);
      return false;
    }

    g_task_queue.push({
      user_id: user_id,
      timestamp: Date.now(),
    });

    update_status_display();
    show_temp_message(
      `Added block task: ${user_id}, ${g_task_queue.length} tasks in queue`
    );

    // Start processing if not already running
    if (!g_is_processing) process_queue();

    return true;
  }

  // Process tasks in queue
  async function process_queue() {
    if (g_is_processing || g_task_queue.length === 0) return;

    g_is_processing = true;

    while (g_task_queue.length > 0) {
      const task = g_task_queue[0];
      update_status_display();

      try {
        await execute_block_task(task);
      } catch (error) {
        console.error("Block task failed:", error);
        show_temp_message(`Task failed: ${task.user_id}`, 3000);
      }

      // Remove completed task
      g_task_queue.shift();
      update_status_display();

      // Dynamic delay: The longer the queue, the shorter the interval, but it should not be less than 200ms
      if (g_task_queue.length > 0) {
        const delay = Math.max(200, 1000 - g_task_queue.length * 100);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    g_is_processing = false;
    show_temp_message("All block tasks completed");
  }

  // Execute single block task
  function execute_block_task(task) {
    return new Promise((resolve, reject) => {
      const new_tab = GM_openInTab(
        `https://www.douyin.com/user/${task.user_id}?auto_block=true`,
        {
          active: false,
          insert: true,
          setParent: true,
        }
      );

      let timeout_id = null;
      let check_interval = null;
      let is_resolved = false;

      function cleanup() {
        if (timeout_id) clearTimeout(timeout_id);
        if (check_interval) clearTimeout(check_interval);
        is_resolved = true;
      }

      function check_close() {
        if (is_resolved) return;

        if (new_tab.closed) {
          cleanup();
          resolve();
          return;
        }

        check_interval = setTimeout(check_close, 300);
      }

      check_interval = setTimeout(check_close, 300);

      // Timeout protection
      timeout_id = setTimeout(() => {
        if (!is_resolved && !new_tab.closed) {
          cleanup();
          new_tab.close();
          reject(new Error("Task timeout"));
        }
      }, 15000);

      try {
        if (new_tab.contentWindow) {
          new_tab.contentWindow.addEventListener("beforeunload", () => {
            if (!is_resolved) {
              cleanup();
              resolve();
            }
          });
        }
      } catch (e) {}
    });
  }

  // ---------- Handle Q key press to open author profile ----------
  let current_video = null;
  const intersection_observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) current_video = entry.target;
      });
    },
    {
      threshold: 0.5,
    }
  );

  new MutationObserver((mutations) => {
    mutations.forEach((m) =>
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.matches('[data-e2e*="feed"]'))
          intersection_observer.observe(node);
      })
    );
  }).observe(document.body, {
    childList: true,
    subtree: true,
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key.toLowerCase() === "q" &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      const profile_link = current_video
        ?.querySelector('a[href*="/user/"]')
        ?.href.match(/user\/([\w-]+)/)?.[1];
      if (profile_link) add_to_queue(profile_link);
    }
  });

  // ---------- Auto-block functionality based on URL's auto_block parameter ----------
  if (
    location.href.includes("/user/") &&
    new URLSearchParams(location.search).get("auto_block")
  )
    window.addEventListener("load", () => setTimeout(run_auto_block, 1200));

  // Simulate mouse click with hover sequence
  async function click_element(element, delay = 200) {
    const { left, top, width, height } = element.getBoundingClientRect();
    const create_event = (type) =>
      new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        clientX: left + width / 2,
        clientY: top + height / 2,
      });
    ["mouseover", "mousedown", "click", "mouseup"].forEach((type) =>
      element.dispatchEvent(create_event(type))
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  // Main auto-block sequence
  async function run_auto_block() {
    try {
      const menu_button = document.querySelector("#tooltip button");
      if (!menu_button) return finish_and_close();

      await click_element(menu_button);
      await new Promise((resolve) => setTimeout(resolve, 800));

      const block_button = [
        ...document.querySelectorAll(".semi-dropdown-item"),
      ].find((element) => element.textContent.includes("拉黑"));
      if (!block_button) return finish_and_close();

      await click_element(block_button);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const confirm_button = [
        ...document.querySelectorAll("button.semi-button-primary"),
      ].find((element) => element.textContent.includes("确认拉黑"));
      if (confirm_button) await click_element(confirm_button, 300);
      if (confirm_button) await click_element(confirm_button, 300);

      finish_and_close();
    } catch (error) {
      finish_and_close();
    }
  }

  // Close current tab after completion
  function finish_and_close() {
    window.open("about:blank", "_self");
    window.close();
  }

  // Initialize status display elements
  create_status_element();
  create_temp_message_element();
})();

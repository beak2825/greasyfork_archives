// ==UserScript==
// @name         Fab Helper
// @name:zh-CN   Fab Helper
// @name:en      Fab Helper
// @namespace    https://www.fab.com/
// @version      3.5.1-20260106032624
// @description  Fab Helper 优化版 - 减少API请求，提高性能，增强稳定性，修复限速刷新
// @description:zh-CN  Fab Helper 优化版 - 减少API请求，提高性能，增强稳定性，修复限速刷新
// @description:en  Fab Helper Optimized - Reduced API requests, improved performance, enhanced stability, fixed rate limit refresh
// @author       RunKing
// @match        https://www.fab.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fab.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @connect      fab.com
// @connect      www.fab.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541307/Fab%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/541307/Fab%20Helper.meta.js
// ==/UserScript==

(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/i18n/en.js
  var en = {
    // 基础UI
    hide: "Hide Done",
    show: "Show Done",
    sync: "Sync State",
    execute: "Start Tasks",
    executing: "Executing...",
    stopExecute: "Stop",
    added: "Done",
    failed: "Failed",
    todo: "To-Do",
    hidden: "Hidden",
    visible: "Visible",
    clearLog: "Clear Log",
    copyLog: "Copy Log",
    copied: "Copied!",
    tab_dashboard: "Dashboard",
    tab_settings: "Settings",
    tab_debug: "Debug",
    // 应用标题和标签
    app_title: "Fab Helper",
    free_label: "Free",
    operation_log: "\u{1F4DD} Operation Log",
    position_indicator: "\u{1F4CD} ",
    // 按钮文本
    clear_all_data: "\u{1F5D1}\uFE0F Clear All Data",
    debug_mode: "Debug Mode",
    page_diagnosis: "Page Diagnosis",
    copy_btn: "Copy",
    clear_btn: "Clear",
    copied_success: "Copied!",
    // 状态文本
    status_history: "Status Cycle History",
    script_startup: "Script Startup",
    normal_period: "Normal Operation",
    rate_limited_period: "Rate Limited",
    current_normal: "Current: Normal",
    current_rate_limited: "Current: Rate Limited",
    no_history: "No history records to display.",
    no_saved_position: "No saved position",
    // 状态历史详细信息
    time_label: "Time",
    info_label: "Info",
    ended_at: "Ended at",
    duration_label: "Duration",
    requests_label: "Requests",
    requests_unit: "times",
    unknown_duration: "Unknown",
    // 日志消息
    log_init: "Assistant is online!",
    log_db_loaded: "Reading archive...",
    log_exec_no_tasks: "To-Do list is empty.",
    log_verify_success: "Verified and added to library!",
    log_verify_fail: "Couldn't add. Will retry later.",
    log_429_error: "Request limit hit! Taking a 15s break...",
    log_no_failed_tasks: "No failed tasks to retry.",
    log_requeuing_tasks: "Re-queuing {0} failed tasks...",
    log_detail_page: "This is a detail or worker page. Halting main script execution.",
    log_copy_failed: "Failed to copy log:",
    log_auto_add_enabled: '"Auto add" is enabled. Will process all tasks in the current "To-Do" queue.',
    log_auto_add_toggle: "Infinite scroll auto add tasks {0}.",
    log_remember_pos_toggle: "Remember waterfall browsing position {0}.",
    log_auto_resume_toggle: "429 auto resume function {0}.",
    log_auto_resume_start: "\u{1F504} 429 auto resume activated! Will refresh page in {0} seconds to attempt recovery...",
    log_auto_resume_detect: "\u{1F504} Detected 429 error, will auto refresh page in {0} seconds to attempt recovery...",
    // 调试日志消息
    debug_save_cursor: "Saving new recovery point: {0}",
    debug_prepare_hide: "Preparing to hide {0} cards, will use longer delay...",
    debug_unprocessed_cards: "Detected {0} unprocessed or inconsistent cards, re-executing hide logic",
    debug_new_content_loading: "Detected new content loading, waiting for API requests to complete...",
    debug_process_new_content: "Starting to process newly loaded content...",
    debug_unprocessed_cards_simple: "Detected unprocessed cards, re-executing hide logic",
    debug_hide_completed: "Completed hiding all {0} cards",
    debug_visible_after_hide: "\u{1F441}\uFE0F Actual visible items after hiding: {0}, hidden items: {1}",
    debug_filter_owned: "Filtered out {0} owned items and {1} items already in todo list.",
    debug_api_wait_complete: "API wait completed, starting to process {0} cards...",
    debug_api_stopped: "API activity stopped for {0}ms, continuing to process cards.",
    debug_wait_api_response: "Starting to wait for API response, will process {0} cards after API activity stops...",
    debug_api_wait_in_progress: "API wait process already in progress, adding current {0} cards to wait queue.",
    debug_cached_items: "Cached {0} item data",
    debug_no_cards_to_check: "No cards need to be checked",
    // Fab DOM Refresh 相关
    fab_dom_api_complete: "API query completed, confirmed {0} owned items.",
    fab_dom_checking_status: "Checking status of {0} items...",
    fab_dom_add_to_waitlist: "Added {0} item IDs to wait list, current wait list size: {0}",
    fab_dom_unknown_status: "{0} items have unknown status, waiting for native web requests to update",
    // 状态监控
    status_monitor_all_hidden: "Detected all items hidden in normal state ({0} items)",
    // 空搜索结果
    empty_search_initial: "Page just loaded, might be initial request, not triggering rate limit",
    // 游标相关
    cursor_patched_url: "Patched URL",
    cursor_injecting: "Injecting cursor. Original",
    page_patcher_match: "-> \u2705 MATCH! URL will be patched",
    // 自动刷新相关
    auto_refresh_countdown: "\u23F1\uFE0F Auto refresh countdown: {0} seconds...",
    rate_limit_success_request: "Successful request during rate limit +1, current consecutive: {0}/{1}, source: {2}",
    rate_limit_no_visible_continue: "\u{1F504} No visible items on page and in rate limit state, will continue auto refresh.",
    rate_limit_no_visible_suggest: "\u{1F504} In rate limit state with no visible items, suggest refreshing page",
    status_check_summary: "\u{1F4CA} Status check - Actually visible: {0}, Total cards: {1}, Hidden items: {2}",
    refresh_plan_exists: "Refresh plan already in progress, not scheduling new refresh (429 auto recovery)",
    page_content_rate_limit_detected: "[Page Content Detection] Detected page showing rate limit error message!",
    last_moment_check_cancelled: "\u26A0\uFE0F Last moment check: refresh conditions not met, auto refresh cancelled.",
    refresh_cancelled_visible_items: "\u23F9\uFE0F Detected {0} visible items on page before refresh, auto refresh cancelled.",
    // 限速检测来源
    rate_limit_source_page_content: "Page Content Detection",
    rate_limit_source_global_call: "Global Call",
    // 日志标签
    log_tag_auto_add: "Auto Add",
    // 自动添加相关消息
    auto_add_api_timeout: "API wait timeout, waited {0}ms, will continue processing cards.",
    auto_add_api_error: "Error while waiting for API: {0}",
    auto_add_new_tasks: "Added {0} new tasks to queue.",
    // HTTP状态检测
    http_status_check_performance_api: "Using Performance API check, no longer sending HEAD requests",
    // 页面状态检测
    page_status_hidden_no_visible: "\u{1F441}\uFE0F Detected {0} hidden items on page, but no visible items",
    page_status_suggest_refresh: "\u{1F504} Detected {0} hidden items on page, but no visible items, suggest refreshing page",
    // 限速状态相关
    rate_limit_already_active: "Already in rate limit state, source: {0}, ignoring new rate limit trigger: {1}",
    xhr_detected_429: "[XHR] Detected 429 status code: {0}",
    // 状态历史消息
    history_cleared_new_session: "History cleared, new session started",
    status_history_cleared: "Status history cleared.",
    duplicate_normal_status_detected: "Detected duplicate normal status record, source: {0}",
    execution_status_changed: "Detected execution status change: {0}",
    status_executing: "Executing",
    status_stopped: "Stopped",
    // 状态历史UI文本
    status_duration_label: "Duration: ",
    status_requests_label: "Requests: ",
    status_ended_at_label: "Ended at: ",
    status_started_at_label: "Started at: ",
    status_ongoing_label: "Ongoing: ",
    status_unknown_time: "Unknown time",
    status_unknown_duration: "Unknown",
    // 启动时状态检测
    startup_rate_limited: "Script started in rate limited state. Rate limit has lasted at least {0}s, source: {1}",
    status_unknown_source: "Unknown",
    // 请求成功来源
    request_source_search_response: "Search Response Success",
    request_source_xhr_search: "XHR Search Success",
    request_source_xhr_item: "XHR Item Request",
    consecutive_success_exit: "Consecutive {0} successful requests ({1})",
    search_response_parse_failed: "Search response parsing failed: {0}",
    // 缓存清理和Fab DOM相关
    cache_cleanup_complete: "[Cache] Cleanup complete, current cache size: items={0}, owned status={1}, prices={2}",
    fab_dom_no_new_owned: "[Fab DOM Refresh] API query completed, no new owned items found.",
    // 状态报告UI标签
    status_time_label: "Time",
    status_info_label: "Info",
    // 隐性限速检测和API监控
    implicit_rate_limit_detection: "[Implicit Rate Limit Detection]",
    scroll_api_monitoring: "[Scroll API Monitoring]",
    task_execution_time: "Task execution time: {0} seconds",
    detected_rate_limit_error: "Detected rate limit error info: {0}",
    detected_possible_rate_limit_empty: "Detected possible rate limit situation (empty result): {0}",
    detected_possible_rate_limit_scroll: "Detected possible rate limit situation: no card count increase after {0} consecutive scrolls.",
    detected_api_429_status: "Detected API request status code 429: {0}",
    detected_api_rate_limit_content: "Detected API response content contains rate limit info: {0}",
    // 限速来源标识
    source_implicit_rate_limit: "Implicit Rate Limit Detection",
    source_scroll_api_monitoring: "Scroll API Monitoring",
    // 设置项
    setting_auto_refresh: "Auto refresh when no items visible",
    setting_auto_add_scroll: "Auto add tasks on infinite scroll",
    setting_remember_position: "Remember waterfall browsing position",
    setting_auto_resume_429: "Auto resume after 429 errors",
    setting_debug_tooltip: "Enable detailed logging for troubleshooting",
    // 状态文本
    status_enabled: "enabled",
    status_disabled: "disabled",
    // 确认对话框
    confirm_clear_data: "Are you sure you want to clear all locally stored script data (completed, failed, to-do lists)? This action cannot be undone!",
    confirm_open_failed: "Are you sure you want to open {0} failed items in new tabs?",
    confirm_clear_history: "Are you sure you want to clear all status history records?",
    // 错误提示
    error_api_refresh: "API refresh failed. Please check console for error details and confirm you are logged in.",
    // 工具提示
    tooltip_open_failed: "Click to open all failed items",
    tooltip_executing_progress: "Executing: {0}/{1} ({2}%)",
    tooltip_executing: "Executing",
    tooltip_start_tasks: "Click to start executing tasks",
    // 其他
    goto_page_label: "Page:",
    goto_page_btn: "Go",
    page_reset: "Page: 1",
    untitled: "Untitled",
    cursor_mode: "Cursor Mode",
    using_native_requests: "Using native web requests, waiting: {0}",
    worker_closed: "Worker tab closed before completion",
    // 脚本启动和初始化
    log_script_starting: "Script starting...",
    log_network_filter_deprecated: "NetworkFilter module deprecated, functionality handled by PagePatcher.",
    // 限速状态检查
    log_rate_limit_check_active: "Rate limit check already in progress, skipping",
    log_rate_limit_check_start: "Starting rate limit status check...",
    log_page_content_rate_limit: "Page content contains rate limit info, confirming still rate limited",
    log_use_performance_api: "Using Performance API to check recent requests, no longer sending active requests",
    log_detected_429_in_10s: "Detected 429 status in recent 10s, judging as rate limited",
    log_detected_success_in_10s: "Detected successful request in recent 10s, judging as normal",
    log_insufficient_info_status: "Insufficient info to judge rate limit status, maintaining current state",
    log_rate_limit_check_failed: "Rate limit status check failed: {0}",
    // 游标和位置
    log_cursor_initialized_with: "[Cursor] Initialized. Loaded saved cursor: {0}...",
    log_cursor_initialized_empty: "[Cursor] Initialized. No saved cursor found.",
    log_cursor_restore_failed: "[Cursor] Failed to restore cursor state:",
    log_cursor_interceptors_applied: "[Cursor] Network interceptors applied.",
    log_cursor_skip_known_position: "[Cursor] Skipping known position save: {0}",
    log_cursor_skip_backtrack: "[Cursor] Skipping backtrack position: {0} (current: {1}), sort: {2}",
    log_cursor_save_error: "[Cursor] Error saving cursor:",
    log_url_sort_changed: 'Detected URL sort parameter change from "{0}" to "{1}"',
    log_sort_changed_position_cleared: "Cleared saved position due to sort method change",
    log_sort_check_error: "Error checking URL sort parameter: {0}",
    log_position_cleared: "Cleared saved browsing position.",
    log_sort_ascending: "Ascending",
    log_sort_descending: "Descending",
    // XHR/Fetch 限速检测
    log_xhr_rate_limit_detect: "[XHR Rate Limit] Detected rate limit, response: {0}",
    log_list_end_normal: "[List End] Reached end of list, normal situation: {0}...",
    log_empty_search_with_filters: "[Empty Search] Empty result but has filters, may be normal: {0}...",
    log_empty_search_already_limited: "[Empty Search] Already rate limited, not triggering again: {0}...",
    log_empty_search_page_loading: "[Empty Search] Page still loading, may be initial request: {0}...",
    log_debounce_intercept: "[Debounce] \u{1F6A6} Intercepted scroll request. Applying {0}ms delay...",
    log_debounce_discard: "[Debounce] \u{1F5D1}\uFE0F Discarded previous pending request.",
    log_debounce_sending: "[Debounce] \u25B6\uFE0F Sending latest scroll request: {0}",
    log_fetch_detected_429: "[Fetch] Detected 429 status code: {0}",
    log_fetch_rate_limit_detect: "[Fetch Rate Limit] Detected rate limit, response: {0}...",
    log_fetch_list_end: "[Fetch List End] Reached end, normal: {0}...",
    log_fetch_empty_with_filters: "[Fetch Empty] Empty with filters, may be normal: {0}...",
    log_fetch_empty_already_limited: "[Fetch Empty] Already limited, not triggering: {0}...",
    log_fetch_empty_page_loading: "[Fetch Empty] Page loading, may be initial: {0}...",
    log_fetch_implicit_rate_limit: "[Fetch Implicit] Possible rate limit (empty): {0}...",
    log_json_parse_error: "JSON parse error: {0}",
    log_response_length: "Response length: {0}, first 100 chars: {1}",
    log_handling_rate_limit_error: "Error handling rate limit: {0}",
    // 执行控制
    log_execution_stopped_manually: "Execution manually stopped by user.",
    log_todo_cleared_scan: "To-do list cleared. Will scan and add only visible items.",
    log_scanning_loaded_items: "Scanning loaded items...",
    log_executor_running_queued: "Executor running, new tasks queued for processing.",
    log_todo_empty_scanning: "To-do list empty, scanning current page...",
    log_request_no_results_not_counted: "Request successful but no valid results, not counting. Source: {0}",
    log_not_rate_limited_ignore_exit: "Not rate limited, ignoring exit request: {0}",
    log_found_todo_auto_resume: "Found {0} to-do tasks, auto-resuming execution...",
    log_dispatching_wait: "Dispatching tasks, please wait...",
    log_rate_limited_continue_todo: "In rate limited state, but will continue executing to-do tasks...",
    log_detected_todo_no_workers: "Detected to-do tasks but no active workers, attempting retry...",
    // 数据库和同步
    log_db_sync_cleared_failed: "[Fab DB Sync] Cleared {0} manually completed items from failed list.",
    log_no_unowned_in_batch: "No unowned items found in this batch.",
    log_no_truly_free_after_verify: "Found unowned items, but none truly free after price verification.",
    log_429_scan_paused: "Detected 429 error, requesting too frequently. Will pause scanning.",
    // 工作线程
    log_worker_tabs_cleared: "Cleared all worker tab states.",
    log_worker_task_cleared_closing: "Task data cleared, worker tab will close.",
    log_worker_instance_cooperate: "Detected active instance [{0}], worker tab will cooperate.",
    log_other_instance_report_ignore: "Received report from other instance [{0}], current [{1}] will ignore.",
    // 失败和重试
    log_failed_list_empty: "Failed list empty, no action needed.",
    // 调试模式
    log_debug_mode_toggled: "Debug mode {0}. {1}",
    log_debug_mode_detail_info: "Will display detailed log information",
    log_no_history_to_copy: "No history to copy.",
    // 启动和恢复
    log_execution_state_inconsistent: "Execution state inconsistent, restoring from storage: {0}",
    log_invalid_worker_report: "Received invalid worker report. Missing workerId or task.",
    log_all_tasks_completed: "All tasks completed.",
    log_all_tasks_completed_rate_limited: "All tasks completed and rate limited, will refresh to recover...",
    log_recovery_probe_failed: "Recovery probe failed. Still rate limited, will continue refresh...",
    // 实例管理
    log_not_active_instance: "Current instance not active, not executing tasks.",
    log_no_active_instance_activating: "No active instance detected, instance [{0}] activated.",
    log_inactive_instance_taking_over: "Previous instance [{0}] inactive, taking over.",
    log_is_search_page_activated: "This is search page, instance [{0}] activated.",
    // 可见性和刷新
    log_no_visible_items_todo_workers: "Rate limited with {0} to-do and {1} workers, not auto-refreshing.",
    log_visible_items_detected_skipping: "\u23F9\uFE0F Detected {0} visible items, not refreshing to avoid interruption.",
    log_please_complete_tasks_first: "Please complete or cancel these tasks before refreshing.",
    log_display_mode_switched: "\u{1F441}\uFE0F Display mode switched, current page has {0} visible items",
    position_label: "Location",
    log_entering_rate_limit_from: "\u{1F6A8} Entering RATE LIMIT state from [{0}]! Normal period lasted {1}s with {2} requests.",
    log_entering_rate_limit_from_v2: "\u{1F6A8} RATE LIMIT DETECTED from [{0}]! Normal operation lasted {1}s with {2} successful search requests.",
    rate_limit_recovery_success: "\u2705 Rate limit appears to be lifted from [{0}]. The 429 period lasted {1}s.",
    fab_dom_refresh_complete: "[Fab DOM Refresh] Complete. Updated {0} visible card states.",
    auto_refresh_disabled_rate_limit: "\u26A0\uFE0F In rate limit state, auto refresh is disabled. Please manually refresh the page if needed.",
    // 页面诊断
    log_diagnosis_complete: "Page diagnosis complete, check console output",
    log_diagnosis_failed: "Page diagnosis failed: {0}",
    // Auto resume
    log_auto_resume_page_loading: "[Auto-Resume] Page loaded in rate limited state. Running recovery probe...",
    log_recovery_probe_success: "\u2705 Recovery probe succeeded! Rate limit lifted, continuing normal operations.",
    log_tasks_still_running: "Still have {0} tasks running, waiting for them to finish before refresh...",
    log_todo_tasks_waiting: "{0} to-do tasks waiting to execute, will try to continue execution...",
    countdown_refresh_source: "Recovery probe failed",
    failed_list_empty: "Failed list is empty, no action needed.",
    opening_failed_items: "Opening {0} failed items...",
    // 账号验证
    auth_error: "Session expired: CSRF token not found, please log in again",
    auth_error_alert: "Session expired: Please log in again before using the script"
  };

  // src/i18n/zh.js
  var zh = {
    // 基础UI
    hide: "\u9690\u85CF\u5DF2\u5F97",
    show: "\u663E\u793A\u5DF2\u5F97",
    sync: "\u540C\u6B65\u72B6\u6001",
    execute: "\u4E00\u952E\u5F00\u5237",
    executing: "\u6267\u884C\u4E2D...",
    stopExecute: "\u505C\u6B62",
    added: "\u5DF2\u5165\u5E93",
    failed: "\u5931\u8D25",
    todo: "\u5F85\u529E",
    hidden: "\u5DF2\u9690\u85CF",
    visible: "\u53EF\u89C1",
    clearLog: "\u6E05\u7A7A\u65E5\u5FD7",
    copyLog: "\u590D\u5236\u65E5\u5FD7",
    copied: "\u5DF2\u590D\u5236!",
    tab_dashboard: "\u4EEA\u8868\u76D8",
    tab_settings: "\u8BBE\u5B9A",
    tab_debug: "\u8C03\u8BD5",
    // 应用标题和标签
    app_title: "Fab Helper",
    free_label: "\u514D\u8D39",
    operation_log: "\u{1F4DD} \u64CD\u4F5C\u65E5\u5FD7",
    position_indicator: "\u{1F4CD} ",
    // 按钮文本
    clear_all_data: "\u{1F5D1}\uFE0F \u6E05\u7A7A\u6240\u6709\u5B58\u6863",
    debug_mode: "\u8C03\u8BD5\u6A21\u5F0F",
    page_diagnosis: "\u9875\u9762\u8BCA\u65AD",
    copy_btn: "\u590D\u5236",
    clear_btn: "\u6E05\u7A7A",
    copied_success: "\u5DF2\u590D\u5236!",
    // 状态文本
    status_history: "\u72B6\u6001\u5468\u671F\u5386\u53F2\u8BB0\u5F55",
    script_startup: "\u811A\u672C\u542F\u52A8",
    normal_period: "\u6B63\u5E38\u8FD0\u884C\u671F",
    rate_limited_period: "\u9650\u901F\u671F",
    current_normal: "\u5F53\u524D: \u6B63\u5E38\u8FD0\u884C",
    current_rate_limited: "\u5F53\u524D: \u9650\u901F\u4E2D",
    no_history: "\u6CA1\u6709\u53EF\u663E\u793A\u7684\u5386\u53F2\u8BB0\u5F55\u3002",
    no_saved_position: "\u65E0\u4FDD\u5B58\u4F4D\u7F6E",
    // 状态历史详细信息
    time_label: "\u65F6\u95F4",
    info_label: "\u4FE1\u606F",
    ended_at: "\u7ED3\u675F\u4E8E",
    duration_label: "\u6301\u7EED",
    requests_label: "\u8BF7\u6C42",
    requests_unit: "\u6B21",
    unknown_duration: "\u672A\u77E5",
    // 日志消息
    log_init: "\u52A9\u624B\u5DF2\u4E0A\u7EBF\uFF01",
    log_db_loaded: "\u6B63\u5728\u8BFB\u53D6\u5B58\u6863...",
    log_exec_no_tasks: '"\u5F85\u529E"\u6E05\u5355\u662F\u7A7A\u7684\u3002',
    log_verify_success: "\u641E\u5B9A\uFF01\u5DF2\u6210\u529F\u5165\u5E93\u3002",
    log_verify_fail: "\u54CE\u5440\uFF0C\u8FD9\u4E2A\u6CA1\u52A0\u4E0A\u3002\u7A0D\u540E\u4F1A\u81EA\u52A8\u91CD\u8BD5\uFF01",
    log_429_error: "\u8BF7\u6C42\u592A\u5FEB\u88AB\u670D\u52A1\u5668\u9650\u901F\u4E86\uFF01\u4F11\u606F15\u79D2\u540E\u81EA\u52A8\u91CD\u8BD5...",
    log_no_failed_tasks: "\u6CA1\u6709\u5931\u8D25\u7684\u4EFB\u52A1\u9700\u8981\u91CD\u8BD5\u3002",
    log_requeuing_tasks: "\u6B63\u5728\u91CD\u65B0\u6392\u961F {0} \u4E2A\u5931\u8D25\u4EFB\u52A1...",
    log_detail_page: "\u8FD9\u662F\u8BE6\u60C5\u9875\u6216\u5DE5\u4F5C\u6807\u7B7E\u9875\u3002\u505C\u6B62\u4E3B\u811A\u672C\u6267\u884C\u3002",
    log_copy_failed: "\u590D\u5236\u65E5\u5FD7\u5931\u8D25:",
    log_auto_add_enabled: '"\u81EA\u52A8\u6DFB\u52A0"\u5DF2\u5F00\u542F\u3002\u5C06\u76F4\u63A5\u5904\u7406\u5F53\u524D"\u5F85\u529E"\u961F\u5217\u4E2D\u7684\u6240\u6709\u4EFB\u52A1\u3002',
    log_auto_add_toggle: "\u65E0\u9650\u6EDA\u52A8\u81EA\u52A8\u6DFB\u52A0\u4EFB\u52A1\u5DF2{0}\u3002",
    log_remember_pos_toggle: "\u8BB0\u4F4F\u7011\u5E03\u6D41\u6D4F\u89C8\u4F4D\u7F6E\u529F\u80FD\u5DF2{0}\u3002",
    log_auto_resume_toggle: "429\u540E\u81EA\u52A8\u6062\u590D\u529F\u80FD\u5DF2{0}\u3002",
    log_auto_resume_start: "\u{1F504} 429\u81EA\u52A8\u6062\u590D\u542F\u52A8\uFF01\u5C06\u5728{0}\u79D2\u540E\u5237\u65B0\u9875\u9762\u5C1D\u8BD5\u6062\u590D...",
    log_auto_resume_detect: "\u{1F504} \u68C0\u6D4B\u5230429\u9519\u8BEF\uFF0C\u5C06\u5728{0}\u79D2\u540E\u81EA\u52A8\u5237\u65B0\u9875\u9762\u5C1D\u8BD5\u6062\u590D...",
    // 调试日志消息
    debug_save_cursor: "\u4FDD\u5B58\u65B0\u7684\u6062\u590D\u70B9: {0}",
    debug_prepare_hide: "\u51C6\u5907\u9690\u85CF {0} \u5F20\u5361\u7247\uFF0C\u5C06\u4F7F\u7528\u66F4\u957F\u7684\u5EF6\u8FDF...",
    debug_unprocessed_cards: "\u68C0\u6D4B\u5230 {0} \u4E2A\u672A\u5904\u7406\u6216\u72B6\u6001\u4E0D\u4E00\u81F4\u7684\u5361\u7247\uFF0C\u91CD\u65B0\u6267\u884C\u9690\u85CF\u903B\u8F91",
    debug_new_content_loading: "\u68C0\u6D4B\u5230\u65B0\u5185\u5BB9\u52A0\u8F7D\uFF0C\u7B49\u5F85API\u8BF7\u6C42\u5B8C\u6210...",
    debug_process_new_content: "\u5F00\u59CB\u5904\u7406\u65B0\u52A0\u8F7D\u7684\u5185\u5BB9...",
    debug_unprocessed_cards_simple: "\u68C0\u6D4B\u5230\u672A\u5904\u7406\u7684\u5361\u7247\uFF0C\u91CD\u65B0\u6267\u884C\u9690\u85CF\u903B\u8F91",
    debug_hide_completed: "\u5DF2\u5B8C\u6210\u6240\u6709 {0} \u5F20\u5361\u7247\u7684\u9690\u85CF",
    debug_visible_after_hide: "\u{1F441}\uFE0F \u9690\u85CF\u540E\u5B9E\u9645\u53EF\u89C1\u5546\u54C1\u6570: {0}\uFF0C\u9690\u85CF\u5546\u54C1\u6570: {1}",
    debug_filter_owned: "\u8FC7\u6EE4\u6389 {0} \u4E2A\u5DF2\u5165\u5E93\u5546\u54C1\u548C {1} \u4E2A\u5DF2\u5728\u5F85\u529E\u5217\u8868\u4E2D\u7684\u5546\u54C1\u3002",
    debug_api_wait_complete: "API\u7B49\u5F85\u5B8C\u6210\uFF0C\u5F00\u59CB\u5904\u7406 {0} \u5F20\u5361\u7247...",
    debug_api_stopped: "API\u6D3B\u52A8\u5DF2\u505C\u6B62 {0}ms\uFF0C\u7EE7\u7EED\u5904\u7406\u5361\u7247\u3002",
    debug_wait_api_response: "\u5F00\u59CB\u7B49\u5F85API\u54CD\u5E94\uFF0C\u5C06\u5728API\u6D3B\u52A8\u505C\u6B62\u540E\u5904\u7406 {0} \u5F20\u5361\u7247...",
    debug_api_wait_in_progress: "\u5DF2\u6709API\u7B49\u5F85\u8FC7\u7A0B\u5728\u8FDB\u884C\uFF0C\u5C06\u5F53\u524D {0} \u5F20\u5361\u7247\u52A0\u5165\u7B49\u5F85\u961F\u5217\u3002",
    debug_cached_items: "\u5DF2\u7F13\u5B58 {0} \u4E2A\u5546\u54C1\u6570\u636E",
    debug_no_cards_to_check: "\u6CA1\u6709\u9700\u8981\u68C0\u67E5\u7684\u5361\u7247",
    // Fab DOM Refresh 相关
    fab_dom_api_complete: "API\u67E5\u8BE2\u5B8C\u6210\uFF0C\u5171\u786E\u8BA4 {0} \u4E2A\u5DF2\u62E5\u6709\u7684\u9879\u76EE\u3002",
    fab_dom_checking_status: "\u6B63\u5728\u68C0\u67E5 {0} \u4E2A\u9879\u76EE\u7684\u72B6\u6001...",
    fab_dom_add_to_waitlist: "\u6DFB\u52A0 {0} \u4E2A\u5546\u54C1ID\u5230\u7B49\u5F85\u5217\u8868\uFF0C\u5F53\u524D\u7B49\u5F85\u5217\u8868\u5927\u5C0F: {0}",
    fab_dom_unknown_status: "\u6709 {0} \u4E2A\u5546\u54C1\u72B6\u6001\u672A\u77E5\uFF0C\u7B49\u5F85\u7F51\u9875\u539F\u751F\u8BF7\u6C42\u66F4\u65B0",
    // 状态监控
    status_monitor_all_hidden: "\u68C0\u6D4B\u5230\u6B63\u5E38\u72B6\u6001\u4E0B\u6240\u6709\u5546\u54C1\u90FD\u88AB\u9690\u85CF ({0}\u4E2A)",
    // 空搜索结果
    empty_search_initial: "\u9875\u9762\u521A\u521A\u52A0\u8F7D\uFF0C\u53EF\u80FD\u662F\u521D\u59CB\u8BF7\u6C42\uFF0C\u4E0D\u89E6\u53D1\u9650\u901F",
    // 游标相关
    cursor_patched_url: "Patched URL",
    cursor_injecting: "Injecting cursor. Original",
    page_patcher_match: "-> \u2705 MATCH! URL will be patched",
    // 自动刷新相关
    auto_refresh_countdown: "\u23F1\uFE0F \u81EA\u52A8\u5237\u65B0\u5012\u8BA1\u65F6: {0} \u79D2...",
    rate_limit_success_request: "\u9650\u901F\u72B6\u6001\u4E0B\u6210\u529F\u8BF7\u6C42 +1\uFF0C\u5F53\u524D\u8FDE\u7EED\u6210\u529F: {0}/{1}\uFF0C\u6765\u6E90: {2}",
    rate_limit_no_visible_continue: "\u{1F504} \u9875\u9762\u4E0A\u6CA1\u6709\u53EF\u89C1\u5546\u54C1\u4E14\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u5C06\u7EE7\u7EED\u81EA\u52A8\u5237\u65B0\u3002",
    rate_limit_no_visible_suggest: "\u{1F504} \u5904\u4E8E\u9650\u901F\u72B6\u6001\u4E14\u6CA1\u6709\u53EF\u89C1\u5546\u54C1\uFF0C\u5EFA\u8BAE\u5237\u65B0\u9875\u9762",
    status_check_summary: "\u{1F4CA} \u72B6\u6001\u68C0\u67E5 - \u5B9E\u9645\u53EF\u89C1: {0}, \u603B\u5361\u7247: {1}, \u9690\u85CF\u5546\u54C1\u6570: {2}",
    refresh_plan_exists: "\u5DF2\u6709\u5237\u65B0\u8BA1\u5212\u6B63\u5728\u8FDB\u884C\u4E2D\uFF0C\u4E0D\u518D\u5B89\u6392\u65B0\u7684\u5237\u65B0 (429\u81EA\u52A8\u6062\u590D)",
    page_content_rate_limit_detected: "[\u9875\u9762\u5185\u5BB9\u68C0\u6D4B] \u68C0\u6D4B\u5230\u9875\u9762\u663E\u793A\u9650\u901F\u9519\u8BEF\u4FE1\u606F\uFF01",
    last_moment_check_cancelled: "\u26A0\uFE0F \u6700\u540E\u4E00\u523B\u68C0\u67E5\uFF1A\u5237\u65B0\u6761\u4EF6\u4E0D\u6EE1\u8DB3\uFF0C\u81EA\u52A8\u5237\u65B0\u5DF2\u53D6\u6D88\u3002",
    refresh_cancelled_visible_items: "\u23F9\uFE0F \u5237\u65B0\u524D\u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u6709 {0} \u4E2A\u53EF\u89C1\u5546\u54C1\uFF0C\u5DF2\u53D6\u6D88\u81EA\u52A8\u5237\u65B0\u3002",
    // 限速检测来源
    rate_limit_source_page_content: "\u9875\u9762\u5185\u5BB9\u68C0\u6D4B",
    rate_limit_source_global_call: "\u5168\u5C40\u8C03\u7528",
    // 日志标签
    log_tag_auto_add: "\u81EA\u52A8\u6DFB\u52A0",
    // 自动添加相关消息
    auto_add_api_timeout: "API\u7B49\u5F85\u8D85\u65F6\uFF0C\u5DF2\u7B49\u5F85 {0}ms\uFF0C\u5C06\u7EE7\u7EED\u5904\u7406\u5361\u7247\u3002",
    auto_add_api_error: "\u7B49\u5F85API\u65F6\u51FA\u9519: {0}",
    auto_add_new_tasks: "\u65B0\u589E {0} \u4E2A\u4EFB\u52A1\u5230\u961F\u5217\u3002",
    // HTTP状态检测
    http_status_check_performance_api: "\u4F7F\u7528Performance API\u68C0\u67E5\uFF0C\u4E0D\u518D\u53D1\u9001HEAD\u8BF7\u6C42",
    // 页面状态检测
    page_status_hidden_no_visible: "\u{1F441}\uFE0F \u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u6709 {0} \u4E2A\u9690\u85CF\u5546\u54C1\uFF0C\u4F46\u6CA1\u6709\u53EF\u89C1\u5546\u54C1",
    page_status_suggest_refresh: "\u{1F504} \u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u6709 {0} \u4E2A\u9690\u85CF\u5546\u54C1\uFF0C\u4F46\u6CA1\u6709\u53EF\u89C1\u5546\u54C1\uFF0C\u5EFA\u8BAE\u5237\u65B0\u9875\u9762",
    // 限速状态相关
    rate_limit_already_active: "\u5DF2\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u6765\u6E90: {0}\uFF0C\u5FFD\u7565\u65B0\u7684\u9650\u901F\u89E6\u53D1: {1}",
    xhr_detected_429: "[XHR] \u68C0\u6D4B\u5230429\u72B6\u6001\u7801: {0}",
    // 状态历史消息
    history_cleared_new_session: "\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u7A7A\uFF0C\u65B0\u4F1A\u8BDD\u5F00\u59CB",
    status_history_cleared: "\u72B6\u6001\u5386\u53F2\u8BB0\u5F55\u5DF2\u6E05\u7A7A\u3002",
    duplicate_normal_status_detected: "\u68C0\u6D4B\u5230\u91CD\u590D\u7684\u6B63\u5E38\u72B6\u6001\u8BB0\u5F55\uFF0C\u6765\u6E90: {0}",
    execution_status_changed: "\u68C0\u6D4B\u5230\u6267\u884C\u72B6\u6001\u53D8\u5316\uFF1A{0}",
    status_executing: "\u6267\u884C\u4E2D",
    status_stopped: "\u5DF2\u505C\u6B62",
    // 状态历史UI文本
    status_duration_label: "\u6301\u7EED\u65F6\u95F4: ",
    status_requests_label: "\u671F\u95F4\u8BF7\u6C42\u6570: ",
    status_ended_at_label: "\u7ED3\u675F\u4E8E: ",
    status_started_at_label: "\u5F00\u59CB\u4E8E: ",
    status_ongoing_label: "\u5DF2\u6301\u7EED: ",
    status_unknown_time: "\u672A\u77E5\u65F6\u95F4",
    status_unknown_duration: "\u672A\u77E5",
    // 启动时状态检测
    startup_rate_limited: "\u811A\u672C\u542F\u52A8\u65F6\u5904\u4E8E\u9650\u901F\u72B6\u6001\u3002\u9650\u901F\u5DF2\u6301\u7EED\u81F3\u5C11 {0}s\uFF0C\u6765\u6E90: {1}",
    status_unknown_source: "\u672A\u77E5",
    // 请求成功来源
    request_source_search_response: "\u641C\u7D22\u54CD\u5E94\u6210\u529F",
    request_source_xhr_search: "XHR\u641C\u7D22\u6210\u529F",
    request_source_xhr_item: "XHR\u5546\u54C1\u8BF7\u6C42",
    consecutive_success_exit: "\u8FDE\u7EED{0}\u6B21\u6210\u529F\u8BF7\u6C42 ({1})",
    search_response_parse_failed: "\u641C\u7D22\u54CD\u5E94\u89E3\u6790\u5931\u8D25: {0}",
    // 缓存清理和Fab DOM相关
    cache_cleanup_complete: "[Cache] \u6E05\u7406\u5B8C\u6210\uFF0C\u5F53\u524D\u7F13\u5B58\u5927\u5C0F: \u5546\u54C1={0}, \u62E5\u6709\u72B6\u6001={1}, \u4EF7\u683C={2}",
    fab_dom_no_new_owned: "[Fab DOM Refresh] API\u67E5\u8BE2\u5B8C\u6210\uFF0C\u6CA1\u6709\u53D1\u73B0\u65B0\u7684\u5DF2\u62E5\u6709\u9879\u76EE\u3002",
    // 状态报告UI标签
    status_time_label: "\u65F6\u95F4",
    status_info_label: "\u4FE1\u606F",
    // 隐性限速检测和API监控
    implicit_rate_limit_detection: "[\u9690\u6027\u9650\u901F\u68C0\u6D4B]",
    scroll_api_monitoring: "[\u6EDA\u52A8API\u76D1\u63A7]",
    task_execution_time: "\u4EFB\u52A1\u6267\u884C\u65F6\u95F4: {0}\u79D2",
    detected_rate_limit_error: "\u68C0\u6D4B\u5230\u9650\u901F\u9519\u8BEF\u4FE1\u606F: {0}",
    detected_possible_rate_limit_empty: "\u68C0\u6D4B\u5230\u53EF\u80FD\u7684\u9650\u901F\u60C5\u51B5(\u7A7A\u7ED3\u679C): {0}",
    detected_possible_rate_limit_scroll: "\u68C0\u6D4B\u5230\u53EF\u80FD\u7684\u9650\u901F\u60C5\u51B5\uFF1A\u8FDE\u7EED{0}\u6B21\u6EDA\u52A8\u540E\u5361\u7247\u6570\u91CF\u672A\u589E\u52A0\u3002",
    detected_api_429_status: "\u68C0\u6D4B\u5230API\u8BF7\u6C42\u72B6\u6001\u7801\u4E3A429: {0}",
    detected_api_rate_limit_content: "\u68C0\u6D4B\u5230API\u54CD\u5E94\u5185\u5BB9\u5305\u542B\u9650\u901F\u4FE1\u606F: {0}",
    // 限速来源标识
    source_implicit_rate_limit: "\u9690\u6027\u9650\u901F\u68C0\u6D4B",
    source_scroll_api_monitoring: "\u6EDA\u52A8API\u76D1\u63A7",
    // 设置项
    setting_auto_refresh: "\u65E0\u5546\u54C1\u53EF\u89C1\u65F6\u81EA\u52A8\u5237\u65B0",
    setting_auto_add_scroll: "\u65E0\u9650\u6EDA\u52A8\u65F6\u81EA\u52A8\u6DFB\u52A0\u4EFB\u52A1",
    setting_remember_position: "\u8BB0\u4F4F\u7011\u5E03\u6D41\u6D4F\u89C8\u4F4D\u7F6E",
    setting_auto_resume_429: "429\u540E\u81EA\u52A8\u6062\u590D\u5E76\u7EE7\u7EED",
    setting_debug_tooltip: "\u542F\u7528\u8BE6\u7EC6\u65E5\u5FD7\u8BB0\u5F55\uFF0C\u7528\u4E8E\u6392\u67E5\u95EE\u9898",
    // 状态文本
    status_enabled: "\u5F00\u542F",
    status_disabled: "\u5173\u95ED",
    // 确认对话框
    confirm_clear_data: "\u60A8\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u672C\u5730\u5B58\u50A8\u7684\u811A\u672C\u6570\u636E\uFF08\u5DF2\u5B8C\u6210\u3001\u5931\u8D25\u3001\u5F85\u529E\u5217\u8868\uFF09\u5417\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u9006\uFF01",
    confirm_open_failed: "\u60A8\u786E\u5B9A\u8981\u5728\u65B0\u6807\u7B7E\u9875\u4E2D\u6253\u5F00 {0} \u4E2A\u5931\u8D25\u7684\u9879\u76EE\u5417\uFF1F",
    confirm_clear_history: "\u60A8\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u72B6\u6001\u5386\u53F2\u8BB0\u5F55\u5417\uFF1F",
    // 错误提示
    error_api_refresh: "API \u5237\u65B0\u5931\u8D25\u3002\u8BF7\u68C0\u67E5\u63A7\u5236\u53F0\u4E2D\u7684\u9519\u8BEF\u4FE1\u606F\uFF0C\u5E76\u786E\u8BA4\u60A8\u5DF2\u767B\u5F55\u3002",
    // 工具提示
    tooltip_open_failed: "\u70B9\u51FB\u6253\u5F00\u6240\u6709\u5931\u8D25\u7684\u9879\u76EE",
    tooltip_executing_progress: "\u6267\u884C\u4E2D: {0}/{1} ({2}%)",
    tooltip_executing: "\u6267\u884C\u4E2D",
    tooltip_start_tasks: "\u70B9\u51FB\u5F00\u59CB\u6267\u884C\u4EFB\u52A1",
    // 其他
    goto_page_label: "\u9875\u7801:",
    goto_page_btn: "\u8DF3\u8F6C",
    page_reset: "Page: 1",
    untitled: "Untitled",
    cursor_mode: "Cursor Mode",
    using_native_requests: "\u4F7F\u7528\u7F51\u9875\u539F\u751F\u8BF7\u6C42\uFF0C\u7B49\u5F85\u4E2D: {0}",
    worker_closed: "\u5DE5\u4F5C\u6807\u7B7E\u9875\u5728\u5B8C\u6210\u524D\u5173\u95ED",
    // 脚本启动和初始化
    log_script_starting: "\u811A\u672C\u5F00\u59CB\u8FD0\u884C...",
    log_network_filter_deprecated: "\u7F51\u7EDC\u8FC7\u6EE4\u5668(NetworkFilter)\u6A21\u5757\u5DF2\u5F03\u7528\uFF0C\u529F\u80FD\u7531\u8865\u4E01\u7A0B\u5E8F(PagePatcher)\u5904\u7406\u3002",
    // 限速状态检查
    log_rate_limit_check_active: "\u5DF2\u6709\u9650\u901F\u72B6\u6001\u68C0\u67E5\u6B63\u5728\u8FDB\u884C\uFF0C\u8DF3\u8FC7\u672C\u6B21\u68C0\u67E5",
    log_rate_limit_check_start: "\u5F00\u59CB\u68C0\u67E5\u9650\u901F\u72B6\u6001...",
    log_page_content_rate_limit: "\u9875\u9762\u5185\u5BB9\u5305\u542B\u9650\u901F\u4FE1\u606F\uFF0C\u786E\u8BA4\u4ECD\u5904\u4E8E\u9650\u901F\u72B6\u6001",
    log_use_performance_api: "\u4F7F\u7528Performance API\u68C0\u67E5\u6700\u8FD1\u7684\u7F51\u7EDC\u8BF7\u6C42\uFF0C\u4E0D\u518D\u4E3B\u52A8\u53D1\u9001API\u8BF7\u6C42",
    log_detected_429_in_10s: "\u68C0\u6D4B\u5230\u6700\u8FD110\u79D2\u5185\u6709429\u72B6\u6001\u7801\u7684\u8BF7\u6C42\uFF0C\u5224\u65AD\u4E3A\u9650\u901F\u72B6\u6001",
    log_detected_success_in_10s: "\u68C0\u6D4B\u5230\u6700\u8FD110\u79D2\u5185\u6709\u6210\u529F\u7684API\u8BF7\u6C42\uFF0C\u5224\u65AD\u4E3A\u6B63\u5E38\u72B6\u6001",
    log_insufficient_info_status: "\u6CA1\u6709\u8DB3\u591F\u7684\u4FE1\u606F\u5224\u65AD\u9650\u901F\u72B6\u6001\uFF0C\u4FDD\u6301\u5F53\u524D\u72B6\u6001",
    log_rate_limit_check_failed: "\u9650\u901F\u72B6\u6001\u68C0\u67E5\u5931\u8D25: {0}",
    // 游标和位置
    log_cursor_initialized_with: "[Cursor] \u521D\u59CB\u5316\u5B8C\u6210\u3002\u52A0\u8F7D\u5DF2\u4FDD\u5B58\u7684cursor: {0}...",
    log_cursor_initialized_empty: "[Cursor] \u521D\u59CB\u5316\u5B8C\u6210\u3002\u672A\u627E\u5230\u5DF2\u4FDD\u5B58\u7684cursor\u3002",
    log_cursor_restore_failed: "[Cursor] \u6062\u590Dcursor\u72B6\u6001\u5931\u8D25:",
    log_cursor_interceptors_applied: "[Cursor] \u7F51\u7EDC\u62E6\u622A\u5668\u5DF2\u5E94\u7528\u3002",
    log_cursor_skip_known_position: "[Cursor] \u8DF3\u8FC7\u5DF2\u77E5\u4F4D\u7F6E\u7684\u4FDD\u5B58: {0}",
    log_cursor_skip_backtrack: "[Cursor] \u8DF3\u8FC7\u56DE\u9000\u4F4D\u7F6E: {0} (\u5F53\u524D\u4F4D\u7F6E: {1}), \u6392\u5E8F: {2}",
    log_cursor_save_error: "[Cursor] \u4FDD\u5B58cursor\u65F6\u51FA\u9519:",
    log_url_sort_changed: '\u68C0\u6D4B\u5230URL\u6392\u5E8F\u53C2\u6570\u53D8\u66F4\uFF0C\u6392\u5E8F\u65B9\u5F0F\u5DF2\u4ECE"{0}"\u66F4\u6539\u4E3A"{1}"',
    log_sort_changed_position_cleared: "\u7531\u4E8E\u6392\u5E8F\u65B9\u5F0F\u53D8\u66F4\uFF0C\u5DF2\u6E05\u9664\u4FDD\u5B58\u7684\u6D4F\u89C8\u4F4D\u7F6E",
    log_sort_check_error: "\u68C0\u67E5URL\u6392\u5E8F\u53C2\u6570\u65F6\u51FA\u9519: {0}",
    log_position_cleared: "\u5DF2\u6E05\u9664\u5DF2\u4FDD\u5B58\u7684\u6D4F\u89C8\u4F4D\u7F6E\u3002",
    log_sort_ascending: "\u5347\u5E8F",
    log_sort_descending: "\u964D\u5E8F",
    // XHR/Fetch 限速检测
    log_xhr_rate_limit_detect: "[XHR\u9650\u901F\u68C0\u6D4B] \u68C0\u6D4B\u5230\u9650\u901F\u60C5\u51B5\uFF0C\u539F\u59CB\u54CD\u5E94: {0}",
    log_list_end_normal: "[\u5217\u8868\u672B\u5C3E] \u68C0\u6D4B\u5230\u5DF2\u5230\u8FBE\u5217\u8868\u672B\u5C3E\uFF0C\u8FD9\u662F\u6B63\u5E38\u60C5\u51B5\uFF0C\u4E0D\u89E6\u53D1\u9650\u901F: {0}...",
    log_empty_search_with_filters: "[\u7A7A\u641C\u7D22\u7ED3\u679C] \u68C0\u6D4B\u5230\u641C\u7D22\u7ED3\u679C\u4E3A\u7A7A\uFF0C\u4F46\u5305\u542B\u7279\u6B8A\u8FC7\u6EE4\u6761\u4EF6\uFF0C\u8FD9\u53EF\u80FD\u662F\u6B63\u5E38\u60C5\u51B5: {0}...",
    log_empty_search_already_limited: "[\u7A7A\u641C\u7D22\u7ED3\u679C] \u5DF2\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u4E0D\u91CD\u590D\u89E6\u53D1: {0}...",
    log_empty_search_page_loading: "[\u7A7A\u641C\u7D22\u7ED3\u679C] \u9875\u9762\u5C1A\u672A\u5B8C\u5168\u52A0\u8F7D\uFF0C\u53EF\u80FD\u662F\u521D\u59CB\u8BF7\u6C42\uFF0C\u4E0D\u89E6\u53D1\u9650\u901F: {0}...",
    log_debounce_intercept: "[Debounce] \u{1F6A6} \u62E6\u622A\u6EDA\u52A8\u8BF7\u6C42\u3002\u5E94\u7528{0}ms\u5EF6\u8FDF...",
    log_debounce_discard: "[Debounce] \u{1F5D1}\uFE0F \u4E22\u5F03\u4E4B\u524D\u7684\u6302\u8D77\u8BF7\u6C42\u3002",
    log_debounce_sending: "[Debounce] \u25B6\uFE0F \u53D1\u9001\u6700\u65B0\u6EDA\u52A8\u8BF7\u6C42: {0}",
    log_fetch_detected_429: "[Fetch] \u68C0\u6D4B\u5230429\u72B6\u6001\u7801: {0}",
    log_fetch_rate_limit_detect: "[Fetch\u9650\u901F\u68C0\u6D4B] \u68C0\u6D4B\u5230\u9650\u901F\u60C5\u51B5\uFF0C\u539F\u59CB\u54CD\u5E94: {0}...",
    log_fetch_list_end: "[Fetch\u5217\u8868\u672B\u5C3E] \u68C0\u6D4B\u5230\u5DF2\u5230\u8FBE\u5217\u8868\u672B\u5C3E\uFF0C\u8FD9\u662F\u6B63\u5E38\u60C5\u51B5\uFF0C\u4E0D\u89E6\u53D1\u9650\u901F: {0}...",
    log_fetch_empty_with_filters: "[Fetch\u7A7A\u641C\u7D22\u7ED3\u679C] \u68C0\u6D4B\u5230\u641C\u7D22\u7ED3\u679C\u4E3A\u7A7A\uFF0C\u4F46\u5305\u542B\u7279\u6B8A\u8FC7\u6EE4\u6761\u4EF6\uFF0C\u8FD9\u53EF\u80FD\u662F\u6B63\u5E38\u60C5\u51B5: {0}...",
    log_fetch_empty_already_limited: "[Fetch\u7A7A\u641C\u7D22\u7ED3\u679C] \u5DF2\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u4E0D\u91CD\u590D\u89E6\u53D1: {0}...",
    log_fetch_empty_page_loading: "[Fetch\u7A7A\u641C\u7D22\u7ED3\u679C] \u9875\u9762\u5C1A\u672A\u5B8C\u5168\u52A0\u8F7D\uFF0C\u53EF\u80FD\u662F\u521D\u59CB\u8BF7\u6C42\uFF0C\u4E0D\u89E6\u53D1\u9650\u901F: {0}...",
    log_fetch_implicit_rate_limit: "[Fetch\u9690\u6027\u9650\u901F] \u68C0\u6D4B\u5230\u53EF\u80FD\u7684\u9650\u901F\u60C5\u51B5(\u7A7A\u7ED3\u679C): {0}...",
    log_json_parse_error: "JSON\u89E3\u6790\u9519\u8BEF: {0}",
    log_response_length: "\u54CD\u5E94\u957F\u5EA6: {0}, \u524D100\u4E2A\u5B57\u7B26: {1}",
    log_handling_rate_limit_error: "\u5904\u7406\u9650\u901F\u65F6\u51FA\u9519: {0}",
    // 执行控制
    log_execution_stopped_manually: "\u6267\u884C\u5DF2\u7531\u7528\u6237\u624B\u52A8\u505C\u6B62\u3002",
    log_todo_cleared_scan: "\u5F85\u529E\u5217\u8868\u5DF2\u6E05\u7A7A\u3002\u73B0\u5728\u5C06\u626B\u63CF\u5E76\u4EC5\u6DFB\u52A0\u5F53\u524D\u53EF\u89C1\u7684\u9879\u76EE\u3002",
    log_scanning_loaded_items: "\u6B63\u5728\u626B\u63CF\u5DF2\u52A0\u8F7D\u5B8C\u6210\u7684\u5546\u54C1...",
    log_executor_running_queued: "\u6267\u884C\u5668\u5DF2\u5728\u8FD0\u884C\u4E2D\uFF0C\u65B0\u4EFB\u52A1\u5DF2\u52A0\u5165\u961F\u5217\u7B49\u5F85\u5904\u7406\u3002",
    log_todo_empty_scanning: "\u5F85\u529E\u6E05\u5355\u4E3A\u7A7A\uFF0C\u6B63\u5728\u626B\u63CF\u5F53\u524D\u9875\u9762...",
    log_request_no_results_not_counted: "\u8BF7\u6C42\u6210\u529F\u4F46\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7ED3\u679C\uFF0C\u4E0D\u8BA1\u5165\u8FDE\u7EED\u6210\u529F\u8BA1\u6570\u3002\u6765\u6E90: {0}",
    log_not_rate_limited_ignore_exit: "\u5F53\u524D\u4E0D\u662F\u9650\u901F\u72B6\u6001\uFF0C\u5FFD\u7565\u9000\u51FA\u9650\u901F\u8BF7\u6C42: {0}",
    log_found_todo_auto_resume: "\u53D1\u73B0 {0} \u4E2A\u5F85\u529E\u4EFB\u52A1\uFF0C\u81EA\u52A8\u6062\u590D\u6267\u884C...",
    log_dispatching_wait: "\u6B63\u5728\u6D3E\u53D1\u4EFB\u52A1\u4E2D\uFF0C\u8BF7\u7A0D\u5019...",
    log_rate_limited_continue_todo: "\u5F53\u524D\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u4F46\u4ECD\u5C06\u7EE7\u7EED\u6267\u884C\u5F85\u529E\u4EFB\u52A1...",
    log_detected_todo_no_workers: "\u68C0\u6D4B\u5230\u6709\u5F85\u529E\u4EFB\u52A1\u4F46\u6CA1\u6709\u6D3B\u52A8\u5DE5\u4F5C\u7EBF\u7A0B\uFF0C\u5C1D\u8BD5\u91CD\u65B0\u6267\u884C...",
    // 数据库和同步
    log_db_sync_cleared_failed: '[Fab DB Sync] \u4ECE"\u5931\u8D25"\u5217\u8868\u4E2D\u6E05\u9664\u4E86 {0} \u4E2A\u5DF2\u624B\u52A8\u5B8C\u6210\u7684\u5546\u54C1\u3002',
    log_no_unowned_in_batch: "\u672C\u6279\u6B21\u4E2D\u6CA1\u6709\u53D1\u73B0\u672A\u62E5\u6709\u7684\u5546\u54C1\u3002",
    log_no_truly_free_after_verify: "\u627E\u5230\u672A\u62E5\u6709\u7684\u5546\u54C1\uFF0C\u4F46\u4EF7\u683C\u9A8C\u8BC1\u540E\u6CA1\u6709\u771F\u6B63\u514D\u8D39\u7684\u5546\u54C1\u3002",
    log_429_scan_paused: "\u68C0\u6D4B\u5230429\u9519\u8BEF\uFF0C\u53EF\u80FD\u662F\u8BF7\u6C42\u8FC7\u4E8E\u9891\u7E41\u3002\u5C06\u6682\u505C\u626B\u63CF\u3002",
    // 工作线程
    log_worker_tabs_cleared: "\u5DF2\u6E05\u7406\u6240\u6709\u5DE5\u4F5C\u6807\u7B7E\u9875\u7684\u72B6\u6001\u3002",
    log_worker_task_cleared_closing: "\u4EFB\u52A1\u6570\u636E\u5DF2\u88AB\u6E05\u7406\uFF0C\u5DE5\u4F5C\u6807\u7B7E\u9875\u5C06\u5173\u95ED\u3002",
    log_worker_instance_cooperate: "\u68C0\u6D4B\u5230\u6D3B\u8DC3\u7684\u811A\u672C\u5B9E\u4F8B [{0}]\uFF0C\u5F53\u524D\u5DE5\u4F5C\u6807\u7B7E\u9875\u5C06\u4E0E\u4E4B\u534F\u4F5C\u3002",
    log_other_instance_report_ignore: "\u6536\u5230\u6765\u81EA\u5176\u4ED6\u5B9E\u4F8B [{0}] \u7684\u5DE5\u4F5C\u62A5\u544A\uFF0C\u5F53\u524D\u5B9E\u4F8B [{1}] \u5C06\u5FFD\u7565\u3002",
    // 失败和重试
    log_failed_list_empty: "\u5931\u8D25\u5217\u8868\u4E3A\u7A7A\uFF0C\u65E0\u9700\u64CD\u4F5C\u3002",
    // 调试模式
    log_debug_mode_toggled: "\u8C03\u8BD5\u6A21\u5F0F\u5DF2{0}\u3002{1}",
    log_debug_mode_detail_info: "\u5C06\u663E\u793A\u8BE6\u7EC6\u65E5\u5FD7\u4FE1\u606F",
    log_no_history_to_copy: "\u6CA1\u6709\u5386\u53F2\u8BB0\u5F55\u53EF\u4F9B\u590D\u5236\u3002",
    // 启动和恢复
    log_execution_state_inconsistent: "\u6267\u884C\u72B6\u6001\u4E0D\u4E00\u81F4\uFF0C\u4ECE\u5B58\u50A8\u4E2D\u6062\u590D\uFF1A{0}",
    log_invalid_worker_report: "\u6536\u5230\u65E0\u6548\u7684\u5DE5\u4F5C\u62A5\u544A\u3002\u7F3A\u5C11workerId\u6216task\u3002",
    log_all_tasks_completed: "\u6240\u6709\u4EFB\u52A1\u5DF2\u5B8C\u6210\u3002",
    log_all_tasks_completed_rate_limited: "\u6240\u6709\u4EFB\u52A1\u5DF2\u5B8C\u6210\uFF0C\u4E14\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u5C06\u5237\u65B0\u9875\u9762\u5C1D\u8BD5\u6062\u590D...",
    log_recovery_probe_failed: "\u6062\u590D\u63A2\u6D4B\u5931\u8D25\u3002\u4ECD\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u5C06\u7EE7\u7EED\u968F\u673A\u5237\u65B0...",
    // 实例管理
    log_not_active_instance: "\u5F53\u524D\u5B9E\u4F8B\u4E0D\u662F\u6D3B\u8DC3\u5B9E\u4F8B\uFF0C\u4E0D\u6267\u884C\u4EFB\u52A1\u3002",
    log_no_active_instance_activating: "\u6CA1\u6709\u68C0\u6D4B\u5230\u6D3B\u8DC3\u5B9E\u4F8B\uFF0C\u5F53\u524D\u5B9E\u4F8B [{0}] \u5DF2\u6FC0\u6D3B\u3002",
    log_inactive_instance_taking_over: "\u524D\u4E00\u4E2A\u5B9E\u4F8B [{0}] \u4E0D\u6D3B\u8DC3\uFF0C\u5F53\u524D\u5B9E\u4F8B\u63A5\u7BA1\u3002",
    log_is_search_page_activated: "\u5F53\u524D\u662F\u641C\u7D22\u9875\u9762\uFF0C\u5B9E\u4F8B [{0}] \u5DF2\u6FC0\u6D3B\u3002",
    // 可见性和刷新
    log_no_visible_items_todo_workers: "\u867D\u7136\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u4F46\u68C0\u6D4B\u5230\u6709 {0} \u4E2A\u5F85\u529E\u4EFB\u52A1\u548C {1} \u4E2A\u6D3B\u52A8\u5DE5\u4F5C\u7EBF\u7A0B\uFF0C\u6682\u4E0D\u81EA\u52A8\u5237\u65B0\u9875\u9762\u3002",
    log_visible_items_detected_skipping: "\u23F9\uFE0F \u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u6709 {0} \u4E2A\u53EF\u89C1\u5546\u54C1\uFF0C\u4E0D\u89E6\u53D1\u81EA\u52A8\u5237\u65B0\u4EE5\u907F\u514D\u4E2D\u65AD\u6D4F\u89C8\u3002",
    log_please_complete_tasks_first: "\u8BF7\u624B\u52A8\u5B8C\u6210\u6216\u53D6\u6D88\u8FD9\u4E9B\u4EFB\u52A1\u540E\u518D\u5237\u65B0\u9875\u9762\u3002",
    log_display_mode_switched: "\u{1F441}\uFE0F \u663E\u793A\u6A21\u5F0F\u5DF2\u5207\u6362\uFF0C\u5F53\u524D\u9875\u9762\u6709 {0} \u4E2A\u53EF\u89C1\u5546\u54C1",
    position_label: "\u4F4D\u7F6E",
    log_entering_rate_limit_from: "\u{1F6A8} \u6765\u81EA [{0}] \u7684\u9650\u901F\u89E6\u53D1\uFF01\u6B63\u5E38\u8FD0\u884C\u671F\u6301\u7EED\u4E86 {1} \u79D2\uFF0C\u671F\u95F4\u6709 {2} \u6B21\u6210\u529F\u7684\u641C\u7D22\u8BF7\u6C42\u3002",
    log_entering_rate_limit_from_v2: "\u{1F6A8} \u4ECE [{0}] \u68C0\u6D4B\u5230\u9650\u901F\uFF01\u6B63\u5E38\u8FD0\u884C\u6301\u7EED\u4E86 {1} \u79D2\uFF0C\u5305\u542B {2} \u6B21\u6210\u529F\u641C\u7D22\u8BF7\u6C42\u3002",
    rate_limit_recovery_success: "\u2705 \u9650\u901F\u4F3C\u4E4E\u5DF2\u4ECE [{0}] \u89E3\u9664\u3002429 \u72B6\u6001\u6301\u7EED\u4E86 {1} \u79D2\u3002",
    fab_dom_refresh_complete: "[Fab DOM Refresh] \u5B8C\u6210\u3002\u66F4\u65B0\u4E86 {0} \u4E2A\u53EF\u89C1\u5361\u7247\u7684\u72B6\u6001\u3002",
    auto_refresh_disabled_rate_limit: "\u26A0\uFE0F \u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u81EA\u52A8\u5237\u65B0\u529F\u80FD\u5DF2\u5173\u95ED\uFF0C\u8BF7\u5728\u9700\u8981\u65F6\u624B\u52A8\u5237\u65B0\u9875\u9762\u3002",
    // 页面诊断
    log_diagnosis_complete: "\u9875\u9762\u8BCA\u65AD\u5B8C\u6210\uFF0C\u8BF7\u67E5\u770B\u63A7\u5236\u53F0\u8F93\u51FA",
    log_diagnosis_failed: "\u9875\u9762\u8BCA\u65AD\u5931\u8D25: {0}",
    // Auto resume
    log_auto_resume_page_loading: "[Auto-Resume] \u9875\u9762\u5728\u9650\u901F\u72B6\u6001\u4E0B\u52A0\u8F7D\u3002\u6B63\u5728\u8FDB\u884C\u6062\u590D\u63A2\u6D4B...",
    log_recovery_probe_success: "\u2705 \u6062\u590D\u63A2\u6D4B\u6210\u529F\uFF01\u9650\u901F\u5DF2\u89E3\u9664\uFF0C\u7EE7\u7EED\u6B63\u5E38\u64CD\u4F5C\u3002",
    log_tasks_still_running: "\u4ECD\u6709 {0} \u4E2A\u4EFB\u52A1\u5728\u6267\u884C\u4E2D\uFF0C\u7B49\u5F85\u5B83\u4EEC\u5B8C\u6210\u540E\u518D\u5237\u65B0...",
    log_todo_tasks_waiting: "\u6709 {0} \u4E2A\u5F85\u529E\u4EFB\u52A1\u7B49\u5F85\u6267\u884C\uFF0C\u5C06\u5C1D\u8BD5\u7EE7\u7EED\u6267\u884C...",
    countdown_refresh_source: "\u6062\u590D\u63A2\u6D4B\u5931\u8D25",
    failed_list_empty: "\u5931\u8D25\u5217\u8868\u4E3A\u7A7A\uFF0C\u65E0\u9700\u64CD\u4F5C\u3002",
    opening_failed_items: "\u6B63\u5728\u6253\u5F00 {0} \u4E2A\u5931\u8D25\u9879\u76EE...",
    // 账号验证
    auth_error: "\u8D26\u53F7\u5931\u6548\uFF1A\u672A\u627E\u5230 CSRF token\uFF0C\u8BF7\u91CD\u65B0\u767B\u5F55",
    auth_error_alert: "\u8D26\u53F7\u5931\u6548\uFF1A\u8BF7\u91CD\u65B0\u767B\u5F55\u540E\u518D\u4F7F\u7528\u811A\u672C"
  };

  // src/config.js
  var Config = {
    SCRIPT_NAME: "Fab Helper (\u4F18\u5316\u7248)",
    DB_VERSION: 3,
    DB_NAME: "fab_helper_db",
    MAX_CONCURRENT_WORKERS: 7,
    // 最大并发工作标签页数量
    WORKER_TIMEOUT: 3e4,
    // 工作标签页超时时间
    UI_CONTAINER_ID: "fab-helper-container",
    UI_LOG_ID: "fab-helper-log",
    DB_KEYS: {
      DONE: "fab_done_v8",
      FAILED: "fab_failed_v8",
      TODO: "fab_todo_v1",
      // 用于永久存储待办列表
      HIDE: "fab_hide_v8",
      AUTO_ADD: "fab_autoAdd_v8",
      // 自动添加设置键
      REMEMBER_POS: "fab_rememberPos_v8",
      LAST_CURSOR: "fab_lastCursor_v8",
      // Store only the cursor string
      WORKER_DONE: "fab_worker_done_v8",
      // This is the ONLY key workers use to report back.
      APP_STATUS: "fab_app_status_v1",
      // For tracking 429 rate limiting
      STATUS_HISTORY: "fab_status_history_v1",
      // 状态历史记录持久化
      AUTO_RESUME: "fab_auto_resume_v1",
      // 自动恢复功能设置
      IS_EXECUTING: "fab_is_executing_v1",
      // 执行状态保存
      AUTO_REFRESH_EMPTY: "fab_auto_refresh_empty_v1"
      // 无商品可见时自动刷新
      // 其他键值用于会话或主标签页持久化
    },
    SELECTORS: {
      card: "div.fabkit-Stack-root.nTa5u2sc, div.AssetCard-root",
      cardLink: 'a[href*="/listings/"]',
      addButton: 'button[aria-label*="Add to"], button[aria-label*="\u6DFB\u52A0\u81F3"], button[aria-label*="cart"]',
      rootElement: "#root",
      successBanner: 'div[class*="Toast-root"]',
      freeStatus: ".csZFzinF",
      ownedStatus: ".cUUvxo_s"
    },
    TEXTS: {
      en,
      zh
    },
    // Centralized keyword sets, based STRICTLY on the rules in FAB_HELPER_RULES.md
    OWNED_SUCCESS_CRITERIA: {
      // Check for an H2 tag with the specific success text.
      h2Text: ["\u5DF2\u4FDD\u5B58\u5728\u6211\u7684\u5E93\u4E2D", "Saved in My Library"],
      // Check for buttons/links with these texts.
      buttonTexts: ["\u5728\u6211\u7684\u5E93\u4E2D\u67E5\u770B", "View in My Library"],
      // Check for the temporary success popup (snackbar).
      snackbarText: ["\u4EA7\u54C1\u5DF2\u6DFB\u52A0\u81F3\u60A8\u7684\u5E93\u4E2D", "Product added to your library"]
    },
    ACQUISITION_TEXT_SET: /* @__PURE__ */ new Set(["\u6DFB\u52A0\u5230\u6211\u7684\u5E93", "Add to my library"]),
    // Kept for backward compatibility with recon logic.
    SAVED_TEXT_SET: /* @__PURE__ */ new Set(["\u5DF2\u4FDD\u5B58\u5728\u6211\u7684\u5E93\u4E2D", "Saved in My Library", "\u5728\u6211\u7684\u5E93\u4E2D", "In My Library"]),
    FREE_TEXT_SET: /* @__PURE__ */ new Set(["\u514D\u8D39", "Free", "\u8D77\u59CB\u4EF7\u683C \u514D\u8D39"]),
    // 添加一个实例ID，用于防止多实例运行
    INSTANCE_ID: "fab_instance_id_" + Math.random().toString(36).substring(2, 15)
  };

  // src/state.js
  var State = {
    db: {
      todo: [],
      // 待办任务列表
      done: [],
      // 已完成任务列表
      failed: []
      // 失败任务列表
    },
    hideSaved: false,
    // 是否隐藏已保存项目
    autoAddOnScroll: false,
    // 是否在滚动时自动添加任务
    rememberScrollPosition: false,
    // 是否记住滚动位置
    autoResumeAfter429: false,
    // 是否在429后自动恢复
    autoRefreshEmptyPage: true,
    // 新增：无商品可见时自动刷新（默认开启）
    debugMode: false,
    // 是否启用调试模式
    lang: "zh",
    // 当前语言，默认中文，会在detectLanguage中更新
    isExecuting: false,
    // 是否正在执行任务
    isRefreshScheduled: false,
    // 新增：标记是否已经安排了页面刷新
    isWorkerTab: false,
    // 是否是工作标签页
    totalTasks: 0,
    // API扫描的总任务数
    completedTasks: 0,
    // API扫描的已完成任务数
    isDispatchingTasks: false,
    // 新增：标记是否正在派发任务
    isScanningTasks: false,
    // 新增：标记是否正在扫描任务，防止重复扫描
    processedCardUids: /* @__PURE__ */ new Set(),
    // 新增：已处理过的卡片UID，防止重复添加
    savedCursor: null,
    // Holds the loaded cursor for hijacking
    // --- NEW: State for 429 monitoring ---
    appStatus: "NORMAL",
    // 'NORMAL' or 'RATE_LIMITED'
    rateLimitStartTime: null,
    normalStartTime: Date.now(),
    successfulSearchCount: 0,
    statusHistory: [],
    // Holds the history of NORMAL/RATE_LIMITED periods
    // --- 限速恢复相关状态 ---
    consecutiveSuccessCount: 0,
    // 连续成功请求计数
    requiredSuccessCount: 3,
    // 退出限速需要的连续成功请求数
    lastLimitSource: "",
    // 最后一次限速的来源
    isCheckingRateLimit: false,
    // 是否正在检查限速状态
    // --- End New State ---
    showAdvanced: false,
    activeWorkers: 0,
    runningWorkers: {},
    // NEW: To track active workers for the watchdog { workerId: { task, startTime } }
    lastKnownHref: null,
    // To detect SPA navigation
    hiddenThisPageCount: 0,
    executionTotalTasks: 0,
    // For execution progress
    executionCompletedTasks: 0,
    // For execution progress
    executionFailedTasks: 0,
    // For execution progress
    watchdogTimer: null,
    // UI-related state
    uiExpanded: true,
    logs: [],
    valueChangeListeners: [],
    // For remembering scroll position
    knownCursors: /* @__PURE__ */ new Set(),
    lastSortMethod: null,
    // Session-level tracking (not persisted)
    sessionCompleted: /* @__PURE__ */ new Set(),
    sessionFailed: /* @__PURE__ */ new Set(),
    // 工作线程标签页任务ID
    workerTaskId: null,
    // 是否显示状态历史表格
    showStatusHistory: false,
    // Launcher flag
    hasRunDomPart: false,
    // Observer debounce timer
    observerDebounceTimer: null,
    // UI element references - populated by UI.create()
    UI: {
      container: null,
      tabs: {},
      tabContents: {},
      statusVisible: null,
      statusTodo: null,
      statusDone: null,
      statusFailed: null,
      statusHidden: null,
      execBtn: null,
      syncBtn: null,
      hideBtn: null,
      logPanel: null,
      savedPositionDisplay: null,
      debugContent: null,
      historyContainer: null
    }
  };

  // src/modules/utils.js
  var UI = null;
  var setUIReference = /* @__PURE__ */ __name((uiModule) => {
    UI = uiModule;
  }, "setUIReference");
  var Utils = {
    logger: /* @__PURE__ */ __name((type, ...args) => {
      if (type === "debug") {
        if (!State.debugMode) {
          return;
        }
        console.log(`${Config.SCRIPT_NAME} [DEBUG]`, ...args);
        if (State.UI && State.UI.logPanel) {
          const logEntry = document.createElement("div");
          logEntry.style.cssText = "padding: 2px 4px; border-bottom: 1px solid #444; font-size: 11px; color: #888;";
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="color: #8a8;">[DEBUG]</span> ${args.join(" ")}`;
          State.UI.logPanel.prepend(logEntry);
          while (State.UI.logPanel.children.length > 100) {
            State.UI.logPanel.removeChild(State.UI.logPanel.lastChild);
          }
        }
        return;
      }
      if (State.isWorkerTab) {
        if (type === "error" || args.some((arg) => typeof arg === "string" && arg.includes("Worker"))) {
          console[type](`${Config.SCRIPT_NAME} [Worker]`, ...args);
        }
        return;
      }
      console[type](`${Config.SCRIPT_NAME}`, ...args);
      if (State.UI && State.UI.logPanel) {
        const logEntry = document.createElement("div");
        logEntry.style.cssText = "padding: 2px 4px; border-bottom: 1px solid #444; font-size: 11px;";
        const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
        logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> ${args.join(" ")}`;
        State.UI.logPanel.prepend(logEntry);
        while (State.UI.logPanel.children.length > 100) {
          State.UI.logPanel.removeChild(State.UI.logPanel.lastChild);
        }
      }
    }, "logger"),
    getText: /* @__PURE__ */ __name((key, ...args) => {
      let text = Config.TEXTS[State.lang]?.[key] || Config.TEXTS["en"]?.[key] || key;
      if (args.length > 0) {
        if (typeof args[0] === "object" && args[0] !== null) {
          const replacements = args[0];
          for (const placeholder in replacements) {
            text = text.replace(`%${placeholder}%`, replacements[placeholder]);
          }
        } else {
          args.forEach((arg, index) => {
            text = text.replace(new RegExp(`\\{${index}\\}`, "g"), arg);
          });
        }
      }
      return text;
    }, "getText"),
    detectLanguage: /* @__PURE__ */ __name(() => {
      const oldLang = State.lang;
      State.lang = window.location.href.includes("/zh-cn/") ? "zh" : navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
      Utils.logger("debug", `\u8BED\u8A00\u68C0\u6D4B: \u5730\u5740=${window.location.href}, \u68C0\u6D4B\u5230\u8BED\u8A00=${State.lang}${oldLang !== State.lang ? ` (\u4ECE${oldLang}\u5207\u6362)` : ""}`);
      if (oldLang !== State.lang && State.UI && State.UI.container && UI) {
        Utils.logger("info", `\u8BED\u8A00\u5DF2\u5207\u6362\u5230${State.lang}\uFF0C\u6B63\u5728\u66F4\u65B0\u754C\u9762...`);
        UI.update();
      }
    }, "detectLanguage"),
    waitForElement: /* @__PURE__ */ __name((selector, timeout = 5e3) => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          const element = document.querySelector(selector);
          if (element) {
            clearInterval(interval);
            resolve(element);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error(`Timeout waiting for selector: ${selector}`));
        }, timeout);
      });
    }, "waitForElement"),
    waitForButtonEnabled: /* @__PURE__ */ __name((button, timeout = 5e3) => {
      return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (button && !button.disabled) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(interval);
          reject(new Error("Timeout waiting for button to be enabled."));
        }, timeout);
      });
    }, "waitForButtonEnabled"),
    // This function is now for UI display purposes only.
    getDisplayPageFromUrl: /* @__PURE__ */ __name((url) => {
      if (!url) return "1";
      try {
        const urlParams = new URLSearchParams(new URL(url).search);
        const cursor = urlParams.get("cursor");
        if (!cursor) return "1";
        if (cursor.startsWith("bz")) {
          const decoded = atob(cursor);
          const offsetMatch = decoded.match(/o=(\d+)/);
          if (offsetMatch && offsetMatch[1]) {
            const offset = parseInt(offsetMatch[1], 10);
            const pageSize = 24;
            const pageNum = Math.round(offset / pageSize + 1);
            return pageNum.toString();
          }
        }
        return "Cursor Mode";
      } catch (e) {
        return "...";
      }
    }, "getDisplayPageFromUrl"),
    getCookie: /* @__PURE__ */ __name((name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    }, "getCookie"),
    // Simulates a more forceful click by dispatching mouse events, which can succeed
    // where a simple .click() is ignored by a framework's event handling.
    deepClick: /* @__PURE__ */ __name((element) => {
      if (!element) return;
      setTimeout(() => {
        const pageWindow = typeof unsafeWindow !== "undefined" ? unsafeWindow : window;
        Utils.logger("info", `Performing deep click on element: <${element.tagName.toLowerCase()} class="${element.className}">`);
        const pointerDownEvent = new PointerEvent("pointerdown", { view: pageWindow, bubbles: true, cancelable: true });
        const mouseDownEvent = new MouseEvent("mousedown", { view: pageWindow, bubbles: true, cancelable: true });
        const mouseUpEvent = new MouseEvent("mouseup", { view: pageWindow, bubbles: true, cancelable: true });
        element.dispatchEvent(pointerDownEvent);
        element.dispatchEvent(mouseDownEvent);
        element.dispatchEvent(mouseUpEvent);
        element.click();
      }, 50);
    }, "deepClick"),
    cleanup: /* @__PURE__ */ __name(() => {
      if (State.watchdogTimer) {
        clearInterval(State.watchdogTimer);
        State.watchdogTimer = null;
      }
      State.valueChangeListeners.forEach((id) => {
        try {
          GM_removeValueChangeListener(id);
        } catch (e) {
        }
      });
      State.valueChangeListeners = [];
    }, "cleanup"),
    // 添加游标解码函数
    decodeCursor: /* @__PURE__ */ __name((cursor) => {
      if (!cursor) return Utils.getText("no_saved_position");
      try {
        const decoded = atob(cursor);
        let match;
        if (decoded.includes("&p=")) {
          match = decoded.match(/&p=([^&]+)/);
        } else if (decoded.startsWith("p=")) {
          match = decoded.match(/p=([^&]+)/);
        }
        if (match && match[1]) {
          const itemName = decodeURIComponent(match[1].replace(/\+/g, " "));
          return `${Utils.getText("position_label")}: "${itemName}"`;
        }
        return `${Utils.getText("position_label")}: (Unknown)`;
      } catch (e) {
        Utils.logger("error", `Cursor decode failed: ${e.message}`);
        return `${Utils.getText("position_label")}: (Invalid)`;
      }
    }, "decodeCursor"),
    // Helper to extract just the item name from cursor
    getCursorItemName: /* @__PURE__ */ __name((cursor) => {
      if (!cursor) return null;
      try {
        const decoded = atob(cursor);
        let match;
        if (decoded.includes("&p=")) {
          match = decoded.match(/&p=([^&]+)/);
        } else if (decoded.startsWith("p=")) {
          match = decoded.match(/p=([^&]+)/);
        }
        if (match && match[1]) {
          return decodeURIComponent(match[1].replace(/\+/g, " "));
        }
      } catch (e) {
      }
      return null;
    }, "getCursorItemName"),
    // 账号验证函数 - silent模式用于初始化时的检查，不弹出警告
    checkAuthentication: /* @__PURE__ */ __name((silent = false) => {
      const csrfToken = Utils.getCookie("fab_csrftoken");
      if (!csrfToken) {
        if (!silent) {
          Utils.logger("error", Utils.getText("auth_error"));
          if (State.isExecuting) {
            State.isExecuting = false;
            GM_setValue(Config.DB_KEYS.IS_EXECUTING, false);
          }
          if (State.UI && State.UI.execBtn) {
            State.UI.execBtn.textContent = Utils.getText("execute");
            State.UI.execBtn.disabled = true;
          }
          alert(Utils.getText("auth_error_alert"));
        }
        return false;
      }
      return true;
    }, "checkAuthentication")
  };

  // src/modules/page-diagnostics.js
  var PageDiagnostics = {
    // 诊断商品详情页面状态
    diagnoseDetailPage: /* @__PURE__ */ __name(() => {
      const report = {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        url: window.location.href,
        pageTitle: document.title,
        buttons: [],
        licenseOptions: [],
        priceInfo: {},
        ownedStatus: {},
        dynamicContent: {}
      };
      const buttons = document.querySelectorAll("button");
      buttons.forEach((btn, index) => {
        const text = btn.textContent?.trim();
        const isVisible = btn.offsetParent !== null;
        const isDisabled = btn.disabled;
        const classes = btn.className;
        if (text) {
          report.buttons.push({
            index,
            text,
            isVisible,
            isDisabled,
            classes,
            hasClickHandler: btn.onclick !== null
          });
        }
      });
      const licenseElements = document.querySelectorAll('[class*="license"], [class*="License"], [role="option"]');
      licenseElements.forEach((elem, index) => {
        const text = elem.textContent?.trim();
        const isVisible = elem.offsetParent !== null;
        if (text) {
          report.licenseOptions.push({
            index,
            text,
            isVisible,
            tagName: elem.tagName,
            classes: elem.className,
            role: elem.getAttribute("role")
          });
        }
      });
      const priceElements = document.querySelectorAll('[class*="price"], [class*="Price"]');
      priceElements.forEach((elem, index) => {
        const text = elem.textContent?.trim();
        if (text) {
          report.priceInfo[`price_${index}`] = {
            text,
            isVisible: elem.offsetParent !== null,
            classes: elem.className
          };
        }
      });
      const ownedElements = document.querySelectorAll('h2, [class*="owned"], [class*="library"]');
      ownedElements.forEach((elem, index) => {
        const text = elem.textContent?.trim();
        if (text && (text.includes("\u5E93") || text.includes("Library") || text.includes("\u62E5\u6709") || text.includes("Owned"))) {
          report.ownedStatus[`owned_${index}`] = {
            text,
            isVisible: elem.offsetParent !== null,
            tagName: elem.tagName,
            classes: elem.className
          };
        }
      });
      return report;
    }, "diagnoseDetailPage"),
    // 输出诊断报告到日志
    logDiagnosticReport: /* @__PURE__ */ __name((report) => {
      console.log("=== \u9875\u9762\u72B6\u6001\u8BCA\u65AD\u62A5\u544A ===");
      console.log(`\u9875\u9762: ${report.url}`);
      console.log(`\u6807\u9898: ${report.pageTitle}`);
      console.log(`--- \u6309\u94AE\u4FE1\u606F (${report.buttons.length}\u4E2A) ---`);
      report.buttons.forEach((btn) => {
        if (btn.isVisible) {
          console.log(`\u6309\u94AE: "${btn.text}" (\u53EF\u89C1: ${btn.isVisible}, \u7981\u7528: ${btn.isDisabled})`);
        }
      });
      console.log(`--- \u8BB8\u53EF\u9009\u9879 (${report.licenseOptions.length}\u4E2A) ---`);
      report.licenseOptions.forEach((opt) => {
        if (opt.isVisible) {
          console.log(`\u8BB8\u53EF: "${opt.text}" (\u53EF\u89C1: ${opt.isVisible}, \u89D2\u8272: ${opt.role})`);
        }
      });
      console.log(`--- \u4EF7\u683C\u4FE1\u606F ---`);
      Object.entries(report.priceInfo).forEach(([, price]) => {
        if (price.isVisible) {
          console.log(`\u4EF7\u683C: "${price.text}"`);
        }
      });
      console.log(`--- \u62E5\u6709\u72B6\u6001 ---`);
      Object.entries(report.ownedStatus).forEach(([, status]) => {
        if (status.isVisible) {
          console.log(`\u72B6\u6001: "${status.text}"`);
        }
      });
      console.log("=== \u8BCA\u65AD\u62A5\u544A\u7ED3\u675F ===");
    }, "logDiagnosticReport")
  };

  // src/modules/data-cache.js
  var DataCache = {
    // 商品数据缓存 - 键为商品ID，值为商品数据
    listings: /* @__PURE__ */ new Map(),
    // 拥有状态缓存 - 键为商品ID，值为拥有状态对象
    ownedStatus: /* @__PURE__ */ new Map(),
    // 价格缓存 - 键为报价ID，值为价格信息对象
    prices: /* @__PURE__ */ new Map(),
    // 等待网页原生请求更新的UID列表
    waitingList: /* @__PURE__ */ new Set(),
    // 缓存时间戳 - 用于判断缓存是否过期
    timestamps: {
      listings: /* @__PURE__ */ new Map(),
      ownedStatus: /* @__PURE__ */ new Map(),
      prices: /* @__PURE__ */ new Map()
    },
    // 缓存有效期（毫秒）
    TTL: 5 * 60 * 1e3,
    // 5分钟
    // 检查缓存是否有效
    isValid: /* @__PURE__ */ __name(function(type, key) {
      const timestamp = this.timestamps[type].get(key);
      return timestamp && Date.now() - timestamp < this.TTL;
    }, "isValid"),
    // 保存商品数据到缓存
    saveListings: /* @__PURE__ */ __name(function(items) {
      if (!Array.isArray(items)) return;
      const now = Date.now();
      items.forEach((item) => {
        if (item && item.uid) {
          this.listings.set(item.uid, item);
          this.timestamps.listings.set(item.uid, now);
        }
      });
    }, "saveListings"),
    // 添加到等待列表
    addToWaitingList: /* @__PURE__ */ __name(function(uids) {
      if (!uids || !Array.isArray(uids)) return;
      uids.forEach((uid) => this.waitingList.add(uid));
      Utils.logger("debug", `[Cache] ${Utils.getText("fab_dom_add_to_waitlist", uids.length, this.waitingList.size)}`);
    }, "addToWaitingList"),
    // 检查并从等待列表中移除
    checkWaitingList: /* @__PURE__ */ __name(function() {
      if (this.waitingList.size === 0) return;
      let removedCount = 0;
      for (const uid of this.waitingList) {
        if (this.ownedStatus.has(uid)) {
          this.waitingList.delete(uid);
          removedCount++;
        }
      }
      if (removedCount > 0) {
        Utils.logger("info", `[Cache] \u4ECE\u7B49\u5F85\u5217\u8868\u4E2D\u79FB\u9664\u4E86 ${removedCount} \u4E2A\u5DF2\u66F4\u65B0\u7684\u5546\u54C1ID\uFF0C\u5269\u4F59: ${this.waitingList.size}`);
      }
    }, "checkWaitingList"),
    // 保存拥有状态到缓存
    saveOwnedStatus: /* @__PURE__ */ __name(function(states) {
      if (!Array.isArray(states)) return;
      const now = Date.now();
      states.forEach((state) => {
        if (state && state.uid) {
          this.ownedStatus.set(state.uid, {
            acquired: !!state.acquired,
            lastUpdatedAt: state.lastUpdatedAt || (/* @__PURE__ */ new Date()).toISOString(),
            uid: state.uid
          });
          this.timestamps.ownedStatus.set(state.uid, now);
          if (this.waitingList.has(state.uid)) {
            this.waitingList.delete(state.uid);
          }
        }
      });
      if (states.length > 0) {
        this.checkWaitingList();
      }
    }, "saveOwnedStatus"),
    // 保存价格信息到缓存
    savePrices: /* @__PURE__ */ __name(function(offers) {
      if (!Array.isArray(offers)) return;
      const now = Date.now();
      offers.forEach((offer) => {
        if (offer && offer.offerId) {
          this.prices.set(offer.offerId, {
            offerId: offer.offerId,
            price: offer.price || 0,
            currencyCode: offer.currencyCode || "USD"
          });
          this.timestamps.prices.set(offer.offerId, now);
        }
      });
    }, "savePrices"),
    // 获取商品数据，如果缓存有效则使用缓存
    getListings: /* @__PURE__ */ __name(function(uids) {
      const result = [];
      const missing = [];
      uids.forEach((uid) => {
        if (this.isValid("listings", uid)) {
          result.push(this.listings.get(uid));
        } else {
          missing.push(uid);
        }
      });
      return { result, missing };
    }, "getListings"),
    // 获取拥有状态，如果缓存有效则使用缓存
    getOwnedStatus: /* @__PURE__ */ __name(function(uids) {
      const result = [];
      const missing = [];
      uids.forEach((uid) => {
        if (this.isValid("ownedStatus", uid)) {
          result.push(this.ownedStatus.get(uid));
        } else {
          missing.push(uid);
        }
      });
      return { result, missing };
    }, "getOwnedStatus"),
    // 获取价格信息，如果缓存有效则使用缓存
    getPrices: /* @__PURE__ */ __name(function(offerIds) {
      const result = [];
      const missing = [];
      offerIds.forEach((offerId) => {
        if (this.isValid("prices", offerId)) {
          result.push(this.prices.get(offerId));
        } else {
          missing.push(offerId);
        }
      });
      return { result, missing };
    }, "getPrices"),
    // 清理过期缓存
    cleanupExpired: /* @__PURE__ */ __name(function() {
      try {
        const now = Date.now();
        const cacheTypes = ["listings", "ownedStatus", "prices"];
        for (const type of cacheTypes) {
          for (const [key, timestamp] of this.timestamps[type].entries()) {
            if (now - timestamp > this.TTL) {
              this[type].delete(key);
              this.timestamps[type].delete(key);
            }
          }
        }
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("cache_cleanup_complete", this.listings.size, this.ownedStatus.size, this.prices.size));
        }
      } catch (e) {
        Utils.logger("error", `\u7F13\u5B58\u6E05\u7406\u5931\u8D25: ${e.message}`);
      }
    }, "cleanupExpired")
  };

  // src/modules/api.js
  var API = {
    gmFetch: /* @__PURE__ */ __name((options) => {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          anonymous: false,
          // Default to false to ensure cookies are sent
          ...options,
          onload: /* @__PURE__ */ __name((response) => resolve(response), "onload"),
          onerror: /* @__PURE__ */ __name((error) => reject(new Error(`GM_xmlhttpRequest error: ${error.statusText || "Unknown Error"}`)), "onerror"),
          ontimeout: /* @__PURE__ */ __name(() => reject(new Error("Request timed out.")), "ontimeout"),
          onabort: /* @__PURE__ */ __name(() => reject(new Error("Request aborted.")), "onabort")
        });
      });
    }, "gmFetch"),
    // 接口响应数据提取函数
    extractStateData: /* @__PURE__ */ __name((rawData, source = "") => {
      const dataType = Array.isArray(rawData) ? "Array" : typeof rawData;
      if (State.debugMode) {
        Utils.logger("debug", `[${source}] \u63A5\u53E3\u8FD4\u56DE\u6570\u636E\u7C7B\u578B: ${dataType}`);
      }
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && typeof rawData === "object") {
        const keys = Object.keys(rawData);
        if (State.debugMode) {
          Utils.logger("debug", `[${source}] \u63A5\u53E3\u8FD4\u56DE\u5BF9\u8C61\u952E: ${keys.join(", ")}`);
        }
        const possibleArrayFields = ["data", "results", "items", "listings", "states"];
        for (const field of possibleArrayFields) {
          if (rawData[field] && Array.isArray(rawData[field])) {
            Utils.logger("info", `[${source}] \u5728\u5B57\u6BB5 "${field}" \u4E2D\u627E\u5230\u6570\u7EC4\u6570\u636E`);
            return rawData[field];
          }
        }
        for (const key of keys) {
          if (Array.isArray(rawData[key])) {
            Utils.logger("info", `[${source}] \u5728\u5B57\u6BB5 "${key}" \u4E2D\u627E\u5230\u6570\u7EC4\u6570\u636E`);
            return rawData[key];
          }
        }
        if (rawData.uid && "acquired" in rawData) {
          Utils.logger("info", `[${source}] \u8FD4\u56DE\u7684\u662F\u5355\u4E2A\u9879\u76EE\u6570\u636E\uFF0C\u8F6C\u6362\u4E3A\u6570\u7EC4`);
          return [rawData];
        }
      }
      Utils.logger("warn", `[${source}] \u65E0\u6CD5\u4ECEAPI\u54CD\u5E94\u4E2D\u63D0\u53D6\u6570\u7EC4\u6570\u636E`);
      if (State.debugMode) {
        try {
          const preview = JSON.stringify(rawData).substring(0, 200);
          Utils.logger("debug", `[${source}] API\u54CD\u5E94\u9884\u89C8: ${preview}...`);
        } catch (e) {
          Utils.logger("debug", `[${source}] \u65E0\u6CD5\u5E8F\u5217\u5316API\u54CD\u5E94: ${e.message}`);
        }
      }
      return [];
    }, "extractStateData"),
    // 优化后的商品拥有状态检查函数 - 只使用缓存和网页原生请求的数据
    checkItemsOwnership: /* @__PURE__ */ __name(async function(uids) {
      if (!uids || uids.length === 0) return [];
      try {
        const { result: cachedResults, missing: missingUids } = DataCache.getOwnedStatus(uids);
        if (missingUids.length > 0) {
          Utils.logger("debug", Utils.getText("fab_dom_unknown_status", missingUids.length));
          DataCache.addToWaitingList(missingUids);
        }
        return cachedResults;
      } catch (e) {
        Utils.logger("error", `\u68C0\u67E5\u62E5\u6709\u72B6\u6001\u5931\u8D25: ${e.message}`);
        return [];
      }
    }, "checkItemsOwnership"),
    // 优化后的价格验证函数
    checkItemsPrices: /* @__PURE__ */ __name(async function(offerIds) {
      if (!offerIds || offerIds.length === 0) return [];
      try {
        const { result: cachedResults, missing: missingOfferIds } = DataCache.getPrices(offerIds);
        if (missingOfferIds.length === 0) {
          if (State.debugMode) {
            Utils.logger("info", `\u4F7F\u7528\u7F13\u5B58\u7684\u4EF7\u683C\u6570\u636E\uFF0C\u907F\u514DAPI\u8BF7\u6C42`);
          }
          return cachedResults;
        }
        if (State.debugMode) {
          Utils.logger("info", `\u5BF9 ${missingOfferIds.length} \u4E2A\u7F3A\u5931\u7684\u62A5\u4EF7ID\u53D1\u9001API\u8BF7\u6C42`);
        }
        const csrfToken = Utils.getCookie("fab_csrftoken");
        if (!csrfToken) {
          Utils.checkAuthentication();
          throw new Error("CSRF token not found");
        }
        const pricesUrl = new URL("https://www.fab.com/i/listings/prices-infos");
        missingOfferIds.forEach((offerId) => pricesUrl.searchParams.append("offer_ids", offerId));
        const response = await this.gmFetch({
          method: "GET",
          url: pricesUrl.href,
          headers: { "x-csrftoken": csrfToken, "x-requested-with": "XMLHttpRequest" }
        });
        try {
          const pricesData = JSON.parse(response.responseText);
          if (pricesData.offers && Array.isArray(pricesData.offers)) {
            DataCache.savePrices(pricesData.offers);
            return [...cachedResults, ...pricesData.offers];
          }
        } catch (e) {
          Utils.logger("error", `[\u4F18\u5316] \u89E3\u6790\u4EF7\u683CAPI\u54CD\u5E94\u5931\u8D25: ${e.message}`);
        }
        return cachedResults;
      } catch (e) {
        Utils.logger("error", `[\u4F18\u5316] \u83B7\u53D6\u4EF7\u683C\u4FE1\u606F\u5931\u8D25: ${e.message}`);
        return [];
      }
    }, "checkItemsPrices")
  };

  // src/modules/database.js
  var UI2 = null;
  var setUIReference2 = /* @__PURE__ */ __name((uiModule) => {
    UI2 = uiModule;
  }, "setUIReference");
  var Database = {
    load: /* @__PURE__ */ __name(async () => {
      State.db.todo = await GM_getValue(Config.DB_KEYS.TODO, []);
      State.db.done = await GM_getValue(Config.DB_KEYS.DONE, []);
      State.db.failed = await GM_getValue(Config.DB_KEYS.FAILED, []);
      State.hideSaved = await GM_getValue(Config.DB_KEYS.HIDE, false);
      State.autoAddOnScroll = await GM_getValue(Config.DB_KEYS.AUTO_ADD, false);
      State.rememberScrollPosition = await GM_getValue(Config.DB_KEYS.REMEMBER_POS, false);
      State.autoResumeAfter429 = await GM_getValue(Config.DB_KEYS.AUTO_RESUME, false);
      State.autoRefreshEmptyPage = await GM_getValue(Config.DB_KEYS.AUTO_REFRESH_EMPTY, true);
      State.debugMode = await GM_getValue("fab_helper_debug_mode", false);
      State.currentSortOption = await GM_getValue("fab_helper_sort_option", "title_desc");
      State.isExecuting = await GM_getValue(Config.DB_KEYS.IS_EXECUTING, false);
      const persistedStatus = await GM_getValue(Config.DB_KEYS.APP_STATUS);
      if (persistedStatus && persistedStatus.status === "RATE_LIMITED") {
        State.appStatus = "RATE_LIMITED";
        State.rateLimitStartTime = persistedStatus.startTime;
        const previousDuration = persistedStatus && persistedStatus.startTime ? ((Date.now() - persistedStatus.startTime) / 1e3).toFixed(2) : "0.00";
        Utils.logger("warn", `Script starting in RATE_LIMITED state. 429 period has lasted at least ${previousDuration}s.`);
      }
      State.statusHistory = await GM_getValue(Config.DB_KEYS.STATUS_HISTORY, []);
      Utils.logger("info", Utils.getText("log_db_loaded"), `(Session) To-Do: ${State.db.todo.length}, Done: ${State.db.done.length}, Failed: ${State.db.failed.length}`);
    }, "load"),
    // 添加保存待办列表的方法
    saveTodo: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.TODO, State.db.todo), "saveTodo"),
    saveDone: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.DONE, State.db.done), "saveDone"),
    saveFailed: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.FAILED, State.db.failed), "saveFailed"),
    saveHidePref: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.HIDE, State.hideSaved), "saveHidePref"),
    saveAutoAddPref: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.AUTO_ADD, State.autoAddOnScroll), "saveAutoAddPref"),
    // Save the setting
    saveRememberPosPref: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.REMEMBER_POS, State.rememberScrollPosition), "saveRememberPosPref"),
    saveAutoResumePref: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.AUTO_RESUME, State.autoResumeAfter429), "saveAutoResumePref"),
    saveAutoRefreshEmptyPref: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.AUTO_REFRESH_EMPTY, State.autoRefreshEmptyPage), "saveAutoRefreshEmptyPref"),
    // 保存无商品自动刷新设置
    saveExecutingState: /* @__PURE__ */ __name(() => GM_setValue(Config.DB_KEYS.IS_EXECUTING, State.isExecuting), "saveExecutingState"),
    // Save the execution state
    resetAllData: /* @__PURE__ */ __name(async () => {
      if (window.confirm(Utils.getText("confirm_clear_data"))) {
        await GM_deleteValue(Config.DB_KEYS.TODO);
        await GM_deleteValue(Config.DB_KEYS.DONE);
        await GM_deleteValue(Config.DB_KEYS.FAILED);
        await GM_deleteValue(Config.DB_KEYS.LAST_CURSOR);
        State.db.todo = [];
        State.db.done = [];
        State.db.failed = [];
        State.savedCursor = null;
        Utils.logger("info", "\u6240\u6709\u811A\u672C\u6570\u636E\uFF08\u5305\u62EC\u6EDA\u52A8\u8BB0\u5FC6\uFF09\u5DF2\u91CD\u7F6E\u3002");
        if (UI2) {
          UI2.removeAllOverlays();
          UI2.update();
        }
      }
    }, "resetAllData"),
    isDone: /* @__PURE__ */ __name((url) => {
      if (!url) return false;
      return State.db.done.includes(url.split("?")[0]);
    }, "isDone"),
    isFailed: /* @__PURE__ */ __name((url) => {
      if (!url) return false;
      const cleanUrl = url.split("?")[0];
      return State.db.failed.some((task) => task.url === cleanUrl);
    }, "isFailed"),
    isTodo: /* @__PURE__ */ __name((url) => {
      if (!url) return false;
      const cleanUrl = url.split("?")[0];
      return State.db.todo.some((task) => task.url === cleanUrl);
    }, "isTodo"),
    markAsDone: /* @__PURE__ */ __name(async (task) => {
      if (!task || !task.uid) {
        Utils.logger("error", "\u6807\u8BB0\u4EFB\u52A1\u5B8C\u6210\u5931\u8D25\uFF0C\u6536\u5230\u65E0\u6548\u4EFB\u52A1:", JSON.stringify(task));
        return;
      }
      const initialTodoCount = State.db.todo.length;
      State.db.todo = State.db.todo.filter((t) => t.uid !== task.uid);
      if (State.db.todo.length !== initialTodoCount) {
        Database.saveTodo();
      }
      if (State.db.todo.length === initialTodoCount && initialTodoCount > 0) {
        Utils.logger("warn", "\u4EFB\u52A1\u672A\u80FD\u4ECE\u5F85\u529E\u5217\u8868\u4E2D\u79FB\u9664\uFF0C\u53EF\u80FD\u5DF2\u88AB\u5176\u4ED6\u64CD\u4F5C\u5904\u7406");
      }
      let changed = false;
      const cleanUrl = task.url.split("?")[0];
      if (!Database.isDone(cleanUrl)) {
        State.db.done.push(cleanUrl);
        changed = true;
      }
      if (changed) {
        await Database.saveDone();
      }
    }, "markAsDone"),
    markAsFailed: /* @__PURE__ */ __name(async (task, failureInfo = {}) => {
      if (!task || !task.uid) {
        Utils.logger("error", "\u6807\u8BB0\u4EFB\u52A1\u5931\u8D25\uFF0C\u6536\u5230\u65E0\u6548\u4EFB\u52A1:", JSON.stringify(task));
        return;
      }
      const initialTodoCount = State.db.todo.length;
      State.db.todo = State.db.todo.filter((t) => t.uid !== task.uid);
      let changed = State.db.todo.length < initialTodoCount;
      const failedTask = {
        ...task,
        failedAt: (/* @__PURE__ */ new Date()).toISOString(),
        failureReason: failureInfo.reason || "\u672A\u77E5\u539F\u56E0",
        errorDetails: failureInfo.details || null,
        workerLogs: failureInfo.logs || [],
        retryCount: (task.retryCount || 0) + 1
      };
      Utils.logger("warn", `\u{1F4CB} \u4EFB\u52A1\u5931\u8D25\u8BE6\u60C5:`);
      Utils.logger("warn", `   - \u4EFB\u52A1\u540D\u79F0: ${task.name}`);
      Utils.logger("warn", `   - \u4EFB\u52A1UID: ${task.uid}`);
      Utils.logger("warn", `   - \u5931\u8D25\u539F\u56E0: ${failedTask.failureReason}`);
      Utils.logger("warn", `   - \u91CD\u8BD5\u6B21\u6570: ${failedTask.retryCount}`);
      if (failedTask.errorDetails) {
        Utils.logger("warn", `   - \u9519\u8BEF\u8BE6\u60C5: ${JSON.stringify(failedTask.errorDetails)}`);
      }
      if (failedTask.workerLogs && failedTask.workerLogs.length > 0) {
        Utils.logger("warn", `   - \u5DE5\u4F5C\u7EBF\u7A0B\u65E5\u5FD7 (${failedTask.workerLogs.length} \u6761):`);
        failedTask.workerLogs.slice(-5).forEach((log, i) => {
          Utils.logger("warn", `     ${i + 1}. ${log}`);
        });
      }
      const existingIndex = State.db.failed.findIndex((f) => f.uid === task.uid);
      if (existingIndex >= 0) {
        State.db.failed[existingIndex] = failedTask;
        Utils.logger("debug", `\u66F4\u65B0\u4E86\u5DF2\u5B58\u5728\u7684\u5931\u8D25\u8BB0\u5F55: ${task.name}`);
      } else {
        State.db.failed.push(failedTask);
      }
      changed = true;
      if (changed) {
        await Database.saveTodo();
        await Database.saveFailed();
      }
    }, "markAsFailed")
  };

  // src/modules/rate-limit-manager.js
  var UI3 = null;
  var TaskRunner = null;
  var countdownRefresh = null;
  var setDependencies = /* @__PURE__ */ __name((deps) => {
    UI3 = deps.UI;
    TaskRunner = deps.TaskRunner;
    countdownRefresh = deps.countdownRefresh;
  }, "setDependencies");
  var RateLimitManager = {
    // 添加防止重复日志的变量
    _lastLogTime: 0,
    _lastLogType: null,
    _duplicateLogCount: 0,
    // 检查是否与最后一条记录重复
    isDuplicateRecord: /* @__PURE__ */ __name(function(newEntry) {
      if (State.statusHistory.length === 0) return false;
      const lastEntry = State.statusHistory[State.statusHistory.length - 1];
      if (lastEntry.type !== newEntry.type) return false;
      const lastTime = new Date(lastEntry.endTime).getTime();
      const newTime = new Date(newEntry.endTime).getTime();
      const timeDiff = Math.abs(newTime - lastTime);
      if (timeDiff < 1e4) {
        const durationDiff = Math.abs((lastEntry.duration || 0) - (newEntry.duration || 0));
        if (durationDiff < 5) {
          return true;
        }
      }
      return false;
    }, "isDuplicateRecord"),
    // 添加记录到历史，带去重检查
    addToHistory: /* @__PURE__ */ __name(async function(entry) {
      if (this.isDuplicateRecord(entry)) {
        Utils.logger("debug", `\u68C0\u6D4B\u5230\u91CD\u590D\u7684\u72B6\u6001\u8BB0\u5F55\uFF0C\u8DF3\u8FC7: ${entry.type} - ${entry.endTime}`);
        return false;
      }
      State.statusHistory.push(entry);
      if (State.statusHistory.length > 50) {
        State.statusHistory = State.statusHistory.slice(-50);
      }
      await GM_setValue(Config.DB_KEYS.STATUS_HISTORY, State.statusHistory);
      return true;
    }, "addToHistory"),
    // 进入限速状态
    enterRateLimitedState: /* @__PURE__ */ __name(async function(source = "\u672A\u77E5\u6765\u6E90") {
      if (State.appStatus === "RATE_LIMITED") {
        Utils.logger("info", Utils.getText("rate_limit_already_active", State.lastLimitSource, source));
        return false;
      }
      State.consecutiveSuccessCount = 0;
      State.lastLimitSource = source;
      const normalDuration = State.normalStartTime ? ((Date.now() - State.normalStartTime) / 1e3).toFixed(2) : "0.00";
      const logEntry = {
        type: "NORMAL",
        duration: parseFloat(normalDuration),
        requests: State.successfulSearchCount,
        endTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      const wasAdded = await this.addToHistory(logEntry);
      if (wasAdded) {
        Utils.logger("error", Utils.getText("log_entering_rate_limit_from_v2", source, normalDuration, State.successfulSearchCount));
      } else {
        Utils.logger("debug", Utils.getText("duplicate_normal_status_detected", source));
      }
      State.appStatus = "RATE_LIMITED";
      State.rateLimitStartTime = Date.now();
      await GM_setValue(Config.DB_KEYS.APP_STATUS, {
        status: "RATE_LIMITED",
        startTime: State.rateLimitStartTime,
        source
      });
      if (UI3) {
        UI3.updateDebugTab();
        UI3.update();
      }
      const totalCards = document.querySelectorAll(Config.SELECTORS.card).length;
      const hiddenCards = document.querySelectorAll(`${Config.SELECTORS.card}[style*="display: none"]`).length;
      const actualVisibleCards = totalCards - hiddenCards;
      const visibleCountElement = document.getElementById("fab-status-visible");
      if (visibleCountElement) {
        visibleCountElement.textContent = actualVisibleCards.toString();
      }
      State.hiddenThisPageCount = hiddenCards;
      if (State.db.todo.length > 0 || State.activeWorkers > 0 || actualVisibleCards > 0) {
        if (actualVisibleCards > 0) {
          Utils.logger("info", `\u68C0\u6D4B\u5230\u9875\u9762\u4E0A\u6709 ${actualVisibleCards} \u4E2A\u53EF\u89C1\u5546\u54C1\uFF0C\u6682\u4E0D\u81EA\u52A8\u5237\u65B0\u9875\u9762\u3002`);
          Utils.logger("info", "\u5F53\u4ECD\u6709\u53EF\u89C1\u5546\u54C1\u65F6\u4E0D\u89E6\u53D1\u81EA\u52A8\u5237\u65B0\uFF0C\u4EE5\u907F\u514D\u4E2D\u65AD\u6D4F\u89C8\u3002");
        } else {
          Utils.logger("info", `\u68C0\u6D4B\u5230\u6709 ${State.db.todo.length} \u4E2A\u5F85\u529E\u4EFB\u52A1\u548C ${State.activeWorkers} \u4E2A\u6D3B\u52A8\u5DE5\u4F5C\u7EBF\u7A0B\uFF0C\u6682\u4E0D\u81EA\u52A8\u5237\u65B0\u9875\u9762\u3002`);
          Utils.logger("info", "\u8BF7\u624B\u52A8\u5B8C\u6210\u6216\u53D6\u6D88\u8FD9\u4E9B\u4EFB\u52A1\u540E\u518D\u5237\u65B0\u9875\u9762\u3002");
        }
        Utils.logger("warn", "\u26A0\uFE0F \u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u4F46\u4E0D\u6EE1\u8DB3\u81EA\u52A8\u5237\u65B0\u6761\u4EF6\uFF0C\u8BF7\u5728\u9700\u8981\u65F6\u624B\u52A8\u5237\u65B0\u9875\u9762\u3002");
      } else if (State.autoRefreshEmptyPage) {
        const randomDelay = 5e3 + Math.random() * 2e3;
        if (State.autoResumeAfter429) {
          Utils.logger("info", Utils.getText("log_auto_resume_start", randomDelay ? (randomDelay / 1e3).toFixed(1) : "\u672A\u77E5"));
        } else {
          Utils.logger("info", Utils.getText("log_auto_resume_detect", randomDelay ? (randomDelay / 1e3).toFixed(1) : "\u672A\u77E5"));
        }
        if (countdownRefresh) {
          countdownRefresh(randomDelay, "429\u81EA\u52A8\u6062\u590D");
        }
      } else {
        Utils.logger("info", Utils.getText("auto_refresh_disabled_rate_limit"));
      }
      return true;
    }, "enterRateLimitedState"),
    // 记录成功请求
    recordSuccessfulRequest: /* @__PURE__ */ __name(async function(source = "\u672A\u77E5\u6765\u6E90", hasResults = true) {
      if (hasResults) {
        State.successfulSearchCount++;
        if (UI3) UI3.updateDebugTab();
      }
      if (State.appStatus !== "RATE_LIMITED") {
        return;
      }
      if (!hasResults) {
        Utils.logger("info", `\u8BF7\u6C42\u6210\u529F\u4F46\u6CA1\u6709\u8FD4\u56DE\u6709\u6548\u7ED3\u679C\uFF0C\u4E0D\u8BA1\u5165\u8FDE\u7EED\u6210\u529F\u8BA1\u6570\u3002\u6765\u6E90: ${source}`);
        State.consecutiveSuccessCount = 0;
        return;
      }
      State.consecutiveSuccessCount++;
      Utils.logger("info", Utils.getText("rate_limit_success_request", State.consecutiveSuccessCount, State.requiredSuccessCount, source));
      if (State.consecutiveSuccessCount >= State.requiredSuccessCount) {
        await this.exitRateLimitedState(Utils.getText("consecutive_success_exit", State.consecutiveSuccessCount, source));
      }
    }, "recordSuccessfulRequest"),
    // 退出限速状态
    exitRateLimitedState: /* @__PURE__ */ __name(async function(source = "\u672A\u77E5\u6765\u6E90") {
      if (State.appStatus !== "RATE_LIMITED") {
        Utils.logger("info", `\u5F53\u524D\u4E0D\u662F\u9650\u901F\u72B6\u6001\uFF0C\u5FFD\u7565\u9000\u51FA\u9650\u901F\u8BF7\u6C42: ${source}`);
        return false;
      }
      const rateLimitDuration = State.rateLimitStartTime ? ((Date.now() - State.rateLimitStartTime) / 1e3).toFixed(2) : "0.00";
      const logEntry = {
        type: "RATE_LIMITED",
        duration: parseFloat(rateLimitDuration),
        endTime: (/* @__PURE__ */ new Date()).toISOString(),
        source
      };
      const wasAdded = await this.addToHistory(logEntry);
      if (wasAdded) {
        Utils.logger("info", Utils.getText("rate_limit_recovery_success", source, rateLimitDuration));
      } else {
        Utils.logger("debug", `\u68C0\u6D4B\u5230\u91CD\u590D\u7684\u9650\u901F\u72B6\u6001\u8BB0\u5F55\uFF0C\u6765\u6E90: ${source}`);
      }
      State.appStatus = "NORMAL";
      State.rateLimitStartTime = null;
      State.normalStartTime = Date.now();
      State.consecutiveSuccessCount = 0;
      await GM_deleteValue(Config.DB_KEYS.APP_STATUS);
      if (UI3) {
        UI3.updateDebugTab();
        UI3.update();
      }
      if (State.db.todo.length > 0 && !State.isExecuting && TaskRunner) {
        Utils.logger("info", `\u53D1\u73B0 ${State.db.todo.length} \u4E2A\u5F85\u529E\u4EFB\u52A1\uFF0C\u81EA\u52A8\u6062\u590D\u6267\u884C...`);
        State.isExecuting = true;
        Database.saveExecutingState();
        TaskRunner.executeBatch();
      }
      return true;
    }, "exitRateLimitedState"),
    // 检查限速状态
    checkRateLimitStatus: /* @__PURE__ */ __name(async function() {
      if (State.isCheckingRateLimit) {
        Utils.logger("info", "\u5DF2\u6709\u9650\u901F\u72B6\u6001\u68C0\u67E5\u6B63\u5728\u8FDB\u884C\uFF0C\u8DF3\u8FC7\u672C\u6B21\u68C0\u67E5");
        return false;
      }
      State.isCheckingRateLimit = true;
      try {
        Utils.logger("debug", Utils.getText("log_rate_limit_check_start"));
        const pageText = document.body.innerText || "";
        if (pageText.includes("Too many requests") || pageText.includes("rate limit") || pageText.match(/\{\s*"detail"\s*:\s*"Too many requests"\s*\}/i)) {
          Utils.logger("warn", "\u9875\u9762\u5185\u5BB9\u5305\u542B\u9650\u901F\u4FE1\u606F\uFF0C\u786E\u8BA4\u4ECD\u5904\u4E8E\u9650\u901F\u72B6\u6001");
          await this.enterRateLimitedState("\u9875\u9762\u5185\u5BB9\u68C0\u6D4B");
          return false;
        }
        Utils.logger("debug", "\u4F7F\u7528Performance API\u68C0\u67E5\u6700\u8FD1\u7684\u7F51\u7EDC\u8BF7\u6C42\uFF0C\u4E0D\u518D\u4E3B\u52A8\u53D1\u9001API\u8BF7\u6C42");
        if (window.performance && window.performance.getEntriesByType) {
          const recentRequests = window.performance.getEntriesByType("resource").filter((r) => r.name.includes("/i/listings/search") || r.name.includes("/i/users/me/listings-states")).filter((r) => Date.now() - r.startTime < 1e4);
          if (recentRequests.length > 0) {
            const has429 = recentRequests.some((r) => r.responseStatus === 429);
            if (has429) {
              Utils.logger("info", `\u68C0\u6D4B\u5230\u6700\u8FD110\u79D2\u5185\u6709429\u72B6\u6001\u7801\u7684\u8BF7\u6C42\uFF0C\u5224\u65AD\u4E3A\u9650\u901F\u72B6\u6001`);
              await this.enterRateLimitedState("Performance API\u68C0\u6D4B429");
              return false;
            }
            const hasSuccess = recentRequests.some((r) => r.responseStatus >= 200 && r.responseStatus < 300);
            if (hasSuccess) {
              Utils.logger("info", `\u68C0\u6D4B\u5230\u6700\u8FD110\u79D2\u5185\u6709\u6210\u529F\u7684API\u8BF7\u6C42\uFF0C\u5224\u65AD\u4E3A\u6B63\u5E38\u72B6\u6001`);
              await this.recordSuccessfulRequest("Performance API\u68C0\u6D4B\u6210\u529F", true);
              return true;
            }
          }
        }
        Utils.logger("debug", Utils.getText("log_insufficient_info_status"));
        return State.appStatus === "NORMAL";
      } catch (e) {
        Utils.logger("error", `\u9650\u901F\u72B6\u6001\u68C0\u67E5\u5931\u8D25: ${e.message}`);
        return false;
      } finally {
        State.isCheckingRateLimit = false;
      }
    }, "checkRateLimitStatus")
  };

  // src/modules/page-patcher.js
  var PagePatcher = {
    _patchHasBeenApplied: false,
    _lastSeenCursor: null,
    _lastCheckedUrl: null,
    _bodyObserver: null,
    // State for request debouncing
    _debounceXhrTimer: null,
    _pendingXhr: null,
    async init() {
      try {
        const savedCursor = await GM_getValue(Config.DB_KEYS.LAST_CURSOR);
        if (savedCursor) {
          State.savedCursor = savedCursor;
          this._lastSeenCursor = savedCursor;
          Utils.logger("debug", `[Cursor] Initialized. Loaded saved cursor: ${savedCursor.substring(0, 30)}...`);
        } else {
          Utils.logger("debug", `[Cursor] Initialized. No saved cursor found.`);
        }
      } catch (e) {
        Utils.logger("warn", "[Cursor] Failed to restore cursor state:", e);
      }
      this.applyPatches();
      Utils.logger("debug", "[Cursor] Network interceptors applied.");
      this.setupSortMonitor();
    },
    // 添加监听URL变化的方法，检测排序方式变更
    setupSortMonitor() {
      this.checkCurrentSortFromUrl();
      if (typeof MutationObserver !== "undefined") {
        const bodyObserver = new MutationObserver(() => {
          if (window.location.href !== this._lastCheckedUrl) {
            this._lastCheckedUrl = window.location.href;
            this.checkCurrentSortFromUrl();
            Utils.detectLanguage();
          }
        });
        bodyObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
        this._bodyObserver = bodyObserver;
      }
      window.addEventListener("popstate", () => {
        this.checkCurrentSortFromUrl();
        Utils.detectLanguage();
      });
      window.addEventListener("hashchange", () => {
        this.checkCurrentSortFromUrl();
        Utils.detectLanguage();
      });
      this._lastCheckedUrl = window.location.href;
    },
    // 从URL中检查当前排序方式并更新设置
    checkCurrentSortFromUrl() {
      try {
        const url = new URL(window.location.href);
        const sortParam = url.searchParams.get("sort_by");
        if (!sortParam) return;
        let matchedOption = null;
        if (State.sortOptions) {
          for (const [key, option] of Object.entries(State.sortOptions)) {
            if (option.value === sortParam) {
              matchedOption = key;
              break;
            }
          }
        }
        if (matchedOption && matchedOption !== State.currentSortOption) {
          const previousSort = State.currentSortOption;
          State.currentSortOption = matchedOption;
          GM_setValue("fab_helper_sort_option", State.currentSortOption);
          Utils.logger("debug", Utils.getText(
            "log_url_sort_changed",
            State.sortOptions?.[previousSort]?.name || previousSort,
            State.sortOptions?.[State.currentSortOption]?.name || State.currentSortOption
          ));
          State.savedCursor = null;
          GM_deleteValue(Config.DB_KEYS.LAST_CURSOR);
          if (State.UI && State.UI.savedPositionDisplay) {
            State.UI.savedPositionDisplay.textContent = Utils.getText("no_saved_position");
          }
          Utils.logger("info", Utils.getText("log_sort_changed_position_cleared"));
        }
      } catch (e) {
        Utils.logger("warn", Utils.getText("log_sort_check_error", e.message));
      }
    },
    async handleSearchResponse(request) {
      if (request.status === 429) {
        await RateLimitManager.enterRateLimitedState("\u641C\u7D22\u54CD\u5E94429");
      } else if (request.status >= 200 && request.status < 300) {
        try {
          const responseText = request.responseText;
          if (responseText) {
            const data = JSON.parse(responseText);
            const hasResults = data && data.results && data.results.length > 0;
            await RateLimitManager.recordSuccessfulRequest(Utils.getText("request_source_search_response"), hasResults);
          }
        } catch (e) {
          Utils.logger("warn", Utils.getText("search_response_parse_failed", e.message));
        }
      }
    },
    isDebounceableSearch(url) {
      return typeof url === "string" && url.includes("/i/listings/search") && !url.includes("aggregate_on=") && !url.includes("count=0");
    },
    shouldPatchUrl(url) {
      if (typeof url !== "string") return false;
      if (this._patchHasBeenApplied) return false;
      if (!State.rememberScrollPosition || !State.savedCursor) return false;
      if (!url.includes("/i/listings/search")) return false;
      if (url.includes("aggregate_on=") || url.includes("count=0") || url.includes("in=wishlist")) return false;
      Utils.logger("debug", Utils.getText("page_patcher_match") + ` URL: ${url}`);
      return true;
    },
    getPatchedUrl(originalUrl) {
      if (State.savedCursor) {
        const urlObj = new URL(originalUrl, window.location.origin);
        urlObj.searchParams.set("cursor", State.savedCursor);
        const modifiedUrl = urlObj.pathname + urlObj.search;
        Utils.logger("debug", `[Cursor] ${Utils.getText("cursor_injecting")}: ${originalUrl}`);
        Utils.logger("debug", `[Cursor] ${Utils.getText("cursor_patched_url")}: ${modifiedUrl}`);
        this._patchHasBeenApplied = true;
        return modifiedUrl;
      }
      return originalUrl;
    },
    saveLatestCursorFromUrl(url) {
      try {
        if (typeof url !== "string" || !url.includes("/i/listings/search") || !url.includes("cursor=")) return;
        const urlObj = new URL(url, window.location.origin);
        const newCursor = urlObj.searchParams.get("cursor");
        if (newCursor && newCursor !== this._lastSeenCursor) {
          let isValidPosition = true;
          let decodedCursor = "";
          try {
            decodedCursor = atob(newCursor);
            const filterKeywords = [
              "Nude+Tennis+Racket",
              "Nordic+Beach+Boulder",
              "Nordic+Beach+Rock"
            ];
            if (filterKeywords.some((keyword) => decodedCursor.includes(keyword))) {
              Utils.logger("info", Utils.getText("log_cursor_skip_known_position", decodedCursor));
              isValidPosition = false;
            }
            if (isValidPosition && this._lastSeenCursor) {
              try {
                let newItemName = "";
                let lastItemName = "";
                if (decodedCursor.includes("p=")) {
                  const match = decodedCursor.match(/p=([^&]+)/);
                  if (match && match[1]) {
                    newItemName = decodeURIComponent(match[1].replace(/\+/g, " "));
                  }
                }
                const lastDecoded = atob(this._lastSeenCursor);
                if (lastDecoded.includes("p=")) {
                  const match = lastDecoded.match(/p=([^&]+)/);
                  if (match && match[1]) {
                    lastItemName = decodeURIComponent(match[1].replace(/\+/g, " "));
                  }
                }
                if (newItemName && lastItemName) {
                  const getFirstWord = /* @__PURE__ */ __name((text) => text.trim().substring(0, 3), "getFirstWord");
                  const newFirstWord = getFirstWord(newItemName);
                  const lastFirstWord = getFirstWord(lastItemName);
                  const sortParam = urlObj.searchParams.get("sort_by") || "";
                  const isReverseSort = sortParam.startsWith("-");
                  if (isReverseSort && sortParam.includes("title") && newFirstWord > lastFirstWord || !isReverseSort && sortParam.includes("title") && newFirstWord < lastFirstWord) {
                    Utils.logger("info", Utils.getText(
                      "log_cursor_skip_backtrack",
                      newItemName,
                      lastItemName,
                      isReverseSort ? Utils.getText("log_sort_descending") : Utils.getText("log_sort_ascending")
                    ));
                    isValidPosition = false;
                  }
                }
              } catch (compareError) {
              }
            }
          } catch (decodeError) {
          }
          if (isValidPosition) {
            this._lastSeenCursor = newCursor;
            State.savedCursor = newCursor;
            GM_setValue(Config.DB_KEYS.LAST_CURSOR, newCursor);
            if (State.debugMode) {
              Utils.logger("debug", Utils.getText("debug_save_cursor", newCursor.substring(0, 30) + "..."));
            }
            if (State.UI && State.UI.savedPositionDisplay) {
              State.UI.savedPositionDisplay.textContent = Utils.decodeCursor(newCursor);
            }
          }
        }
      } catch (e) {
        Utils.logger("warn", Utils.getText("log_cursor_save_error"), e);
      }
    },
    applyPatches() {
      const self = this;
      const originalXhrOpen = XMLHttpRequest.prototype.open;
      const originalXhrSend = XMLHttpRequest.prototype.send;
      const DEBOUNCE_DELAY_MS = 350;
      const listenerAwareSend = /* @__PURE__ */ __name(function(...args) {
        const request = this;
        const onLoad = /* @__PURE__ */ __name(() => {
          request.removeEventListener("load", onLoad);
          if (typeof window.recordNetworkActivity === "function") {
            window.recordNetworkActivity();
          }
          if (request.status >= 200 && request.status < 300 && request._url && self.isDebounceableSearch(request._url)) {
            if (typeof window.recordNetworkRequest === "function") {
              window.recordNetworkRequest(Utils.getText("request_source_xhr_item"), true);
            }
          }
          if (request.status === 429 || request.status === "429" || request.status.toString() === "429") {
            Utils.logger("warn", Utils.getText("xhr_detected_429", request.responseURL || request._url));
            RateLimitManager.enterRateLimitedState(request.responseURL || request._url || "XHR\u54CD\u5E94429");
            return;
          }
          if (request.status >= 200 && request.status < 300) {
            try {
              const responseText = request.responseText;
              if (responseText) {
                if (responseText.includes("Too many requests") || responseText.includes("rate limit") || responseText.match(/\{\s*"detail"\s*:\s*"Too many requests"\s*\}/i)) {
                  Utils.logger("warn", Utils.getText("log_xhr_rate_limit_detect", responseText));
                  RateLimitManager.enterRateLimitedState("XHR\u54CD\u5E94\u5185\u5BB9\u9650\u901F");
                  return;
                }
                try {
                  const data = JSON.parse(responseText);
                  if (data.detail && (data.detail.includes("Too many requests") || data.detail.includes("rate limit"))) {
                    Utils.logger("warn", Utils.getText("detected_rate_limit_error", JSON.stringify(data)));
                    RateLimitManager.enterRateLimitedState("XHR\u54CD\u5E94\u9650\u901F\u9519\u8BEF");
                    return;
                  }
                  if (data.results && data.results.length === 0 && self.isDebounceableSearch(request._url)) {
                    const isEndOfList = data.next === null && data.previous !== null && data.cursors && data.cursors.next === null && data.cursors.previous !== null;
                    const isEmptySearch = data.next === null && data.previous === null && data.cursors && data.cursors.next === null && data.cursors.previous === null;
                    const urlObj = new URL(request._url, window.location.origin);
                    const params = urlObj.searchParams;
                    const hasSpecialFilters = params.has("query") || params.has("category") || params.has("subcategory") || params.has("tag");
                    if (isEndOfList) {
                      Utils.logger("info", Utils.getText("log_list_end_normal", JSON.stringify(data).substring(0, 200)));
                      RateLimitManager.recordSuccessfulRequest("XHR\u5217\u8868\u672B\u5C3E", true);
                      return;
                    } else if (isEmptySearch && hasSpecialFilters) {
                      Utils.logger("info", Utils.getText("log_empty_search_with_filters", JSON.stringify(data).substring(0, 200)));
                      RateLimitManager.recordSuccessfulRequest("XHR\u7A7A\u641C\u7D22\u7ED3\u679C", true);
                      return;
                    } else if (isEmptySearch && State.appStatus === "RATE_LIMITED") {
                      Utils.logger("info", Utils.getText("log_empty_search_already_limited", JSON.stringify(data).substring(0, 200)));
                      return;
                    } else if (isEmptySearch && document.readyState !== "complete") {
                      Utils.logger("info", Utils.getText("log_empty_search_page_loading", JSON.stringify(data).substring(0, 200)));
                      return;
                    } else if (isEmptySearch && Date.now() - (window.pageLoadTime || 0) < 5e3) {
                      Utils.logger("info", Utils.getText("empty_search_initial"));
                      return;
                    } else {
                      Utils.logger("warn", Utils.getText("detected_possible_rate_limit_empty", JSON.stringify(data).substring(0, 200)));
                      RateLimitManager.enterRateLimitedState("XHR\u54CD\u5E94\u7A7A\u7ED3\u679C");
                      return;
                    }
                  }
                  if (self.isDebounceableSearch(request._url) && data.results && data.results.length > 0) {
                    RateLimitManager.recordSuccessfulRequest(Utils.getText("request_source_xhr_search"), true);
                  }
                } catch (jsonError) {
                }
              }
            } catch (e) {
            }
          }
          if (self.isDebounceableSearch(request._url)) {
            self.handleSearchResponse(request);
          }
        }, "onLoad");
        request.addEventListener("load", onLoad);
        return originalXhrSend.apply(request, args);
      }, "listenerAwareSend");
      XMLHttpRequest.prototype.open = function(method, url, ...args) {
        let modifiedUrl = url;
        if (self.shouldPatchUrl(url)) {
          modifiedUrl = self.getPatchedUrl(url);
          this._isDebouncedSearch = false;
        } else if (self.isDebounceableSearch(url)) {
          self.saveLatestCursorFromUrl(url);
          this._isDebouncedSearch = true;
        } else {
          self.saveLatestCursorFromUrl(url);
        }
        this._url = modifiedUrl;
        return originalXhrOpen.apply(this, [method, modifiedUrl, ...args]);
      };
      XMLHttpRequest.prototype.send = function(...args) {
        if (!this._isDebouncedSearch) {
          return listenerAwareSend.apply(this, args);
        }
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("log_debounce_intercept", DEBOUNCE_DELAY_MS));
        }
        if (self._pendingXhr) {
          self._pendingXhr.abort();
          Utils.logger("info", Utils.getText("log_debounce_discard"));
        }
        clearTimeout(self._debounceXhrTimer);
        self._pendingXhr = this;
        self._debounceXhrTimer = setTimeout(() => {
          if (State.debugMode) {
            Utils.logger("debug", Utils.getText("log_debounce_sending", this._url));
          }
          listenerAwareSend.apply(self._pendingXhr, args);
          self._pendingXhr = null;
        }, DEBOUNCE_DELAY_MS);
      };
      const originalFetch = window.fetch;
      window.fetch = function(input, init) {
        let url = typeof input === "string" ? input : input.url;
        let modifiedInput = input;
        if (self.shouldPatchUrl(url)) {
          const modifiedUrl = self.getPatchedUrl(url);
          if (typeof input === "string") {
            modifiedInput = modifiedUrl;
          } else {
            modifiedInput = new Request(modifiedUrl, input);
          }
        } else {
          self.saveLatestCursorFromUrl(url);
        }
        return originalFetch.apply(this, [modifiedInput, init]).then(async (response) => {
          if (typeof window.recordNetworkActivity === "function") {
            window.recordNetworkActivity();
          }
          if (response.status >= 200 && response.status < 300 && typeof url === "string" && self.isDebounceableSearch(url)) {
            if (typeof window.recordNetworkRequest === "function") {
              window.recordNetworkRequest("Fetch\u5546\u54C1\u8BF7\u6C42", true);
            }
          }
          if (response.status === 429 || response.status === "429" || response.status.toString() === "429") {
            response.clone();
            Utils.logger("warn", Utils.getText("log_fetch_detected_429", response.url));
            RateLimitManager.enterRateLimitedState("Fetch\u54CD\u5E94429").catch(
              (e) => Utils.logger("error", Utils.getText("log_handling_rate_limit_error", e.message))
            );
          }
          if (response.status >= 200 && response.status < 300) {
            try {
              const clonedResponse = response.clone();
              const text = await clonedResponse.text();
              if (text.includes("Too many requests") || text.includes("rate limit") || text.match(/\{\s*"detail"\s*:\s*"Too many requests"\s*\}/i)) {
                Utils.logger("warn", Utils.getText("log_fetch_rate_limit_detect", text.substring(0, 100)));
                RateLimitManager.enterRateLimitedState("Fetch\u54CD\u5E94\u5185\u5BB9\u9650\u901F").catch(
                  (e) => Utils.logger("error", Utils.getText("log_handling_rate_limit_error", e.message))
                );
                return response;
              }
              try {
                const data = JSON.parse(text);
                if (data.detail && (data.detail.includes("Too many requests") || data.detail.includes("rate limit"))) {
                  Utils.logger("warn", Utils.getText("detected_rate_limit_error", "API\u9650\u901F\u54CD\u5E94"));
                  RateLimitManager.enterRateLimitedState("API\u9650\u901F\u54CD\u5E94").catch(
                    (e) => Utils.logger("error", Utils.getText("log_handling_rate_limit_error", e.message))
                  );
                  return response;
                }
                const responseUrl = response.url || "";
                if (data.results && data.results.length === 0 && responseUrl.includes("/i/listings/search")) {
                  const isEndOfList = data.next === null && data.previous !== null && data.cursors && data.cursors.next === null && data.cursors.previous !== null;
                  const isEmptySearch = data.next === null && data.previous === null && data.cursors && data.cursors.next === null && data.cursors.previous === null;
                  const urlObj = new URL(responseUrl, window.location.origin);
                  const params = urlObj.searchParams;
                  const hasSpecialFilters = params.has("query") || params.has("category") || params.has("subcategory") || params.has("tag");
                  if (isEndOfList) {
                    Utils.logger("info", Utils.getText("log_fetch_list_end", JSON.stringify(data).substring(0, 200)));
                    RateLimitManager.recordSuccessfulRequest("Fetch\u5217\u8868\u672B\u5C3E", true);
                  } else if (isEmptySearch && hasSpecialFilters) {
                    Utils.logger("info", Utils.getText("log_fetch_empty_with_filters", JSON.stringify(data).substring(0, 200)));
                    RateLimitManager.recordSuccessfulRequest("Fetch\u7A7A\u641C\u7D22\u7ED3\u679C", true);
                  } else if (isEmptySearch && State.appStatus === "RATE_LIMITED") {
                    Utils.logger("info", Utils.getText("log_fetch_empty_already_limited", JSON.stringify(data).substring(0, 200)));
                  } else if (isEmptySearch && document.readyState !== "complete") {
                    Utils.logger("info", Utils.getText("log_fetch_empty_page_loading", JSON.stringify(data).substring(0, 200)));
                  } else if (isEmptySearch && Date.now() - (window.pageLoadTime || 0) < 5e3) {
                    Utils.logger("info", Utils.getText("empty_search_initial"));
                  } else {
                    Utils.logger("warn", Utils.getText("log_fetch_implicit_rate_limit", JSON.stringify(data).substring(0, 200)));
                    RateLimitManager.enterRateLimitedState("Fetch\u54CD\u5E94\u7A7A\u7ED3\u679C").catch(
                      (e) => Utils.logger("error", Utils.getText("log_handling_rate_limit_error", e.message))
                    );
                  }
                }
              } catch (jsonError) {
                Utils.logger("debug", Utils.getText("log_json_parse_error", jsonError.message));
              }
            } catch (e) {
            }
          }
          return response;
        });
      };
    }
  };

  // src/modules/instance-manager.js
  var InstanceManager = {
    isActive: false,
    lastPingTime: 0,
    pingInterval: null,
    // 初始化实例管理
    init: /* @__PURE__ */ __name(async function() {
      try {
        const isSearchPage = window.location.href.includes("/search") || window.location.pathname === "/" || window.location.pathname === "/zh-cn/" || window.location.pathname === "/en/";
        if (isSearchPage) {
          this.isActive = true;
          await this.registerAsActive();
          Utils.logger("info", Utils.getText("log_instance_activated", Config.INSTANCE_ID));
          this.pingInterval = setInterval(() => this.ping(), 3e3);
          return true;
        }
        const activeInstance = await GM_getValue("fab_active_instance", null);
        const currentTime = Date.now();
        if (activeInstance && currentTime - activeInstance.lastPing < 1e4) {
          Utils.logger("info", Utils.getText("log_instance_collaborating", activeInstance.id));
          this.isActive = false;
          return true;
        } else {
          this.isActive = true;
          await this.registerAsActive();
          Utils.logger("info", Utils.getText("log_instance_no_active", Config.INSTANCE_ID));
          this.pingInterval = setInterval(() => this.ping(), 3e3);
          return true;
        }
      } catch (error) {
        Utils.logger("error", Utils.getText("log_instance_init_failed", error.message));
        this.isActive = true;
        return true;
      }
    }, "init"),
    // 注册为活跃实例
    registerAsActive: /* @__PURE__ */ __name(async function() {
      await GM_setValue("fab_active_instance", {
        id: Config.INSTANCE_ID,
        lastPing: Date.now()
      });
    }, "registerAsActive"),
    // 定期更新活跃状态
    ping: /* @__PURE__ */ __name(async function() {
      if (!this.isActive) return;
      this.lastPingTime = Date.now();
      await this.registerAsActive();
    }, "ping"),
    // 检查是否可以接管
    checkTakeover: /* @__PURE__ */ __name(async function() {
      if (this.isActive) return;
      try {
        const activeInstance = await GM_getValue("fab_active_instance", null);
        const currentTime = Date.now();
        if (!activeInstance || currentTime - activeInstance.lastPing > 1e4) {
          this.isActive = true;
          await this.registerAsActive();
          Utils.logger("info", Utils.getText("log_instance_takeover", Config.INSTANCE_ID));
          this.pingInterval = setInterval(() => this.ping(), 3e3);
          location.reload();
        } else {
          setTimeout(() => this.checkTakeover(), 5e3);
        }
      } catch (error) {
        Utils.logger("error", Utils.getText("log_instance_takeover_failed", error.message));
        setTimeout(() => this.checkTakeover(), 5e3);
      }
    }, "checkTakeover"),
    // 清理实例
    cleanup: /* @__PURE__ */ __name(function() {
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }
    }, "cleanup")
  };

  // src/modules/task-runner.js
  var UI4 = null;
  function setUIReference3(uiModule) {
    UI4 = uiModule;
  }
  __name(setUIReference3, "setUIReference");
  var TaskRunner2 = {
    // Check if a card is finished (owned, done, or failed)
    isCardFinished: /* @__PURE__ */ __name((card) => {
      const link = card.querySelector(Config.SELECTORS.cardLink);
      const url = link ? link.href.split("?")[0] : null;
      if (!link) {
        const icons = card.querySelectorAll("i.fabkit-Icon--intent-success, i.edsicon-check-circle-filled");
        if (icons.length > 0) return true;
        const text = card.textContent || "";
        return text.includes("\u5DF2\u4FDD\u5B58\u5728\u6211\u7684\u5E93\u4E2D") || text.includes("\u5DF2\u4FDD\u5B58") || text.includes("Saved to My Library") || text.includes("In your library");
      }
      const uidMatch = link.href.match(/listings\/([a-f0-9-]+)/);
      if (!uidMatch || !uidMatch[1]) return false;
      const uid = uidMatch[1];
      if (DataCache.ownedStatus.has(uid)) {
        const status = DataCache.ownedStatus.get(uid);
        if (status && status.acquired) return true;
      }
      if (card.querySelector(Config.SELECTORS.ownedStatus) !== null) {
        if (uid) {
          DataCache.saveOwnedStatus([{
            uid,
            acquired: true,
            lastUpdatedAt: (/* @__PURE__ */ new Date()).toISOString()
          }]);
        }
        return true;
      }
      if (url) {
        if (Database.isDone(url)) return true;
        if (Database.isFailed(url)) return true;
        if (State.sessionCompleted.has(url)) return true;
      }
      return false;
    }, "isCardFinished"),
    // Check if a card represents a free item
    isFreeCard: /* @__PURE__ */ __name((card) => {
      const cardText = card.textContent || "";
      const hasFreeKeyword = [...Config.FREE_TEXT_SET].some((freeWord) => cardText.includes(freeWord));
      const has100PercentDiscount = cardText.includes("-100%");
      const priceMatch = cardText.match(/\$(\d+(?:\.\d{2})?)/g);
      if (priceMatch) {
        const hasNonZeroPrice = priceMatch.some((price) => {
          const numValue = parseFloat(price.replace("$", ""));
          return numValue > 0;
        });
        if (hasNonZeroPrice && !hasFreeKeyword) return false;
        if (hasNonZeroPrice && hasFreeKeyword) {
          if (cardText.includes("\u8D77\u59CB\u4EF7\u683C \u514D\u8D39") || cardText.includes("Starting at Free")) return true;
          if (cardText.match(/起始价格\s*\$[1-9]/) || cardText.match(/Starting at\s*\$[1-9]/i)) return false;
        }
      }
      return hasFreeKeyword || has100PercentDiscount;
    }, "isFreeCard"),
    // Toggle execution state
    toggleExecution: /* @__PURE__ */ __name(() => {
      if (!Utils.checkAuthentication()) return;
      if (State.isExecuting) {
        State.isExecuting = false;
        Database.saveExecutingState();
        State.runningWorkers = {};
        State.activeWorkers = 0;
        State.executionTotalTasks = 0;
        State.executionCompletedTasks = 0;
        State.executionFailedTasks = 0;
        Utils.logger("info", Utils.getText("log_execution_stopped"));
        if (UI4) UI4.update();
        return;
      }
      if (State.autoAddOnScroll) {
        Utils.logger("info", Utils.getText("log_auto_add_enabled"));
        TaskRunner2.checkVisibleCardsStatus().then(() => {
          TaskRunner2.startExecution();
        });
        return;
      }
      State.db.todo = [];
      Utils.logger("info", Utils.getText("log_todo_cleared"));
      Utils.logger("debug", Utils.getText("log_scanning_items"));
      const cards = document.querySelectorAll(Config.SELECTORS.card);
      const newlyAddedList = [];
      let alreadyInQueueCount = 0;
      let ownedCount = 0;
      let skippedCount = 0;
      const isCardSettled = /* @__PURE__ */ __name((card) => {
        return card.querySelector(`${Config.SELECTORS.freeStatus}, ${Config.SELECTORS.ownedStatus}`) !== null;
      }, "isCardSettled");
      cards.forEach((card) => {
        if (card.style.display === "none") return;
        if (!isCardSettled(card)) {
          skippedCount++;
          return;
        }
        if (TaskRunner2.isCardFinished(card)) {
          ownedCount++;
          return;
        }
        const link = card.querySelector(Config.SELECTORS.cardLink);
        const url = link ? link.href.split("?")[0] : null;
        if (!url) return;
        if (Database.isTodo(url)) {
          alreadyInQueueCount++;
          return;
        }
        if (!TaskRunner2.isFreeCard(card)) return;
        const name = card.querySelector('a[aria-label*="\u521B\u4F5C\u7684"]')?.textContent.trim() || card.querySelector('a[href*="/listings/"]')?.textContent.trim() || Utils.getText("untitled");
        newlyAddedList.push({ name, url, type: "detail", uid: url.split("/").pop() });
      });
      if (skippedCount > 0) {
        Utils.logger("debug", Utils.getText("log_skipped_unsettled", skippedCount));
      }
      if (newlyAddedList.length > 0) {
        State.db.todo.push(...newlyAddedList);
        Utils.logger("info", Utils.getText("log_added_to_queue", newlyAddedList.length));
      }
      const actionableCount = State.db.todo.length;
      if (actionableCount > 0) {
        if (newlyAddedList.length === 0 && alreadyInQueueCount > 0) {
          Utils.logger("info", Utils.getText("log_all_in_queue", alreadyInQueueCount));
        }
        TaskRunner2.checkVisibleCardsStatus().then(() => {
          TaskRunner2.startExecution();
        });
      } else {
        Utils.logger("info", Utils.getText("log_no_new_items", ownedCount, skippedCount));
        if (UI4) UI4.update();
      }
    }, "toggleExecution"),
    // Start execution without scanning
    startExecution: /* @__PURE__ */ __name(() => {
      if (State.isExecuting) {
        const newTotal = State.db.todo.length;
        if (newTotal > State.executionTotalTasks) {
          Utils.logger("info", Utils.getText("log_new_tasks_added", newTotal));
          State.executionTotalTasks = newTotal;
          if (UI4) UI4.update();
        } else {
          Utils.logger("info", Utils.getText("log_executor_running"));
        }
        return;
      }
      if (State.db.todo.length === 0) {
        Utils.logger("debug", Utils.getText("log_exec_no_tasks"));
        return;
      }
      Utils.logger("info", Utils.getText("log_starting_execution", State.db.todo.length));
      State.isExecuting = true;
      Database.saveExecutingState();
      State.executionTotalTasks = State.db.todo.length;
      State.executionCompletedTasks = 0;
      State.executionFailedTasks = 0;
      if (UI4) UI4.update();
      TaskRunner2.executeBatch();
    }, "startExecution"),
    // Toggle hide saved items
    toggleHideSaved: /* @__PURE__ */ __name(async () => {
      State.hideSaved = !State.hideSaved;
      await Database.saveHidePref();
      TaskRunner2.runHideOrShow();
      if (!State.hideSaved) {
        const actualVisibleCount = document.querySelectorAll(`${Config.SELECTORS.card}:not([style*="display: none"])`).length;
        Utils.logger("info", Utils.getText("log_display_mode_switched", actualVisibleCount));
      }
      if (UI4) UI4.update();
    }, "toggleHideSaved"),
    toggleAutoAdd: /* @__PURE__ */ __name(async () => {
      if (State.isTogglingSetting) return;
      State.isTogglingSetting = true;
      State.autoAddOnScroll = !State.autoAddOnScroll;
      await Database.saveAutoAddPref();
      Utils.logger("info", Utils.getText("log_auto_add_toggle", State.autoAddOnScroll ? Utils.getText("status_enabled") : Utils.getText("status_disabled")));
      setTimeout(() => {
        State.isTogglingSetting = false;
      }, 200);
    }, "toggleAutoAdd"),
    toggleAutoResume: /* @__PURE__ */ __name(async () => {
      if (State.isTogglingSetting) return;
      State.isTogglingSetting = true;
      State.autoResumeAfter429 = !State.autoResumeAfter429;
      await Database.saveAutoResumePref();
      Utils.logger("info", Utils.getText("log_auto_resume_toggle", State.autoResumeAfter429 ? Utils.getText("status_enabled") : Utils.getText("status_disabled")));
      setTimeout(() => {
        State.isTogglingSetting = false;
      }, 200);
    }, "toggleAutoResume"),
    toggleRememberPosition: /* @__PURE__ */ __name(async () => {
      if (State.isTogglingSetting) return;
      State.isTogglingSetting = true;
      State.rememberScrollPosition = !State.rememberScrollPosition;
      await Database.saveRememberPosPref();
      Utils.logger("info", Utils.getText("log_remember_pos_toggle", State.rememberScrollPosition ? Utils.getText("status_enabled") : Utils.getText("status_disabled")));
      if (!State.rememberScrollPosition) {
        await GM_deleteValue(Config.DB_KEYS.LAST_CURSOR);
        PagePatcher._patchHasBeenApplied = false;
        PagePatcher._lastSeenCursor = null;
        State.savedCursor = null;
        Utils.logger("info", Utils.getText("log_position_cleared"));
        if (State.UI && State.UI.savedPositionDisplay) {
          State.UI.savedPositionDisplay.textContent = Utils.decodeCursor(null);
        }
      } else if (State.UI && State.UI.savedPositionDisplay) {
        State.UI.savedPositionDisplay.textContent = Utils.decodeCursor(State.savedCursor);
      }
      setTimeout(() => {
        State.isTogglingSetting = false;
      }, 200);
    }, "toggleRememberPosition"),
    toggleAutoRefreshEmpty: /* @__PURE__ */ __name(async () => {
      if (State.isTogglingSetting) return;
      State.isTogglingSetting = true;
      State.autoRefreshEmptyPage = !State.autoRefreshEmptyPage;
      await Database.saveAutoRefreshEmptyPref();
      Utils.logger("info", Utils.getText("log_auto_refresh_toggle", State.autoRefreshEmptyPage ? Utils.getText("status_enabled") : Utils.getText("status_disabled")));
      setTimeout(() => {
        State.isTogglingSetting = false;
      }, 200);
    }, "toggleAutoRefreshEmpty"),
    stop: /* @__PURE__ */ __name(() => {
      if (!State.isExecuting) return;
      State.isExecuting = false;
      Database.saveExecutingState();
      Database.saveTodo();
      GM_deleteValue(Config.DB_KEYS.TASK);
      State.runningWorkers = {};
      State.activeWorkers = 0;
      State.executionTotalTasks = 0;
      State.executionCompletedTasks = 0;
      State.executionFailedTasks = 0;
      Utils.logger("info", Utils.getText("log_execution_stopped"));
      if (UI4) UI4.update();
    }, "stop"),
    runRecoveryProbe: /* @__PURE__ */ __name(async () => {
      const randomDelay = Math.floor(Math.random() * (3e4 - 15e3 + 1) + 15e3);
      Utils.logger("info", Utils.getText("log_recovery_probe", (randomDelay / 1e3).toFixed(1)));
      setTimeout(async () => {
        Utils.logger("info", Utils.getText("log_probing_connection"));
        try {
          const csrfToken = Utils.getCookie("fab_csrftoken");
          if (!csrfToken) {
            Utils.checkAuthentication();
            throw new Error("CSRF token not found for probe.");
          }
          const probeResponse = await API.gmFetch({
            method: "GET",
            url: "https://www.fab.com/i/users/context",
            headers: { "x-csrftoken": csrfToken, "x-requested-with": "XMLHttpRequest" }
          });
          if (probeResponse.status === 429) {
            throw new Error("Probe failed with 429. Still rate-limited.");
          } else if (probeResponse.status >= 200 && probeResponse.status < 300) {
            await PagePatcher.handleSearchResponse({ status: 200 });
            Utils.logger("info", Utils.getText("log_connection_restored"));
            TaskRunner2.toggleExecution();
          } else {
            throw new Error(`Probe failed with unexpected status: ${probeResponse.status}`);
          }
        } catch (e) {
          Utils.logger("error", Utils.getText("log_recovery_failed", e.message));
          setTimeout(() => location.reload(), 2e3);
        }
      }, randomDelay);
    }, "runRecoveryProbe"),
    refreshVisibleStates: /* @__PURE__ */ __name(async () => {
      const API_ENDPOINT = "https://www.fab.com/i/users/me/listings-states";
      const API_CHUNK_SIZE = 24;
      const isElementInViewport = /* @__PURE__ */ __name((el) => {
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
      }, "isElementInViewport");
      try {
        const csrfToken = Utils.getCookie("fab_csrftoken");
        if (!csrfToken) {
          Utils.checkAuthentication();
          throw new Error("CSRF token not found. Are you logged in?");
        }
        const uidsFromVisibleCards = new Set([...document.querySelectorAll(Config.SELECTORS.card)].filter(isElementInViewport).filter((card) => {
          const link = card.querySelector(Config.SELECTORS.cardLink);
          if (!link) return false;
          const url = link.href.split("?")[0];
          return !Database.isDone(url);
        }).map((card) => card.querySelector(Config.SELECTORS.cardLink)?.href.match(/listings\/([a-f0-9-]+)/)?.[1]).filter(Boolean));
        const uidsFromFailedList = new Set(State.db.failed.map((task) => task.uid));
        const allUidsToCheck = Array.from(/* @__PURE__ */ new Set([...uidsFromVisibleCards, ...uidsFromFailedList]));
        if (allUidsToCheck.length === 0) {
          Utils.logger("info", Utils.getText("log_no_items_to_check"));
          return;
        }
        Utils.logger("debug", Utils.getText("log_checking_items", uidsFromVisibleCards.size, uidsFromFailedList.size));
        const ownedUids = /* @__PURE__ */ new Set();
        for (let i = 0; i < allUidsToCheck.length; i += API_CHUNK_SIZE) {
          const chunk = allUidsToCheck.slice(i, i + API_CHUNK_SIZE);
          const apiUrl = new URL(API_ENDPOINT);
          chunk.forEach((uid) => apiUrl.searchParams.append("listing_ids", uid));
          Utils.logger("debug", Utils.getText("log_processing_batch", Math.floor(i / API_CHUNK_SIZE) + 1, chunk.length));
          const response = await fetch(apiUrl.href, {
            headers: { "accept": "application/json, text/plain, */*", "x-csrftoken": csrfToken, "x-requested-with": "XMLHttpRequest" }
          });
          if (!response.ok) {
            Utils.logger("warn", Utils.getText("log_batch_failed", response.status));
            continue;
          }
          const rawData = await response.json();
          const data = API.extractStateData(rawData, "RefreshStates");
          if (!data || !Array.isArray(data)) {
            Utils.logger("warn", Utils.getText("log_unexpected_data_format"));
            continue;
          }
          data.filter((item) => item.acquired).forEach((item) => ownedUids.add(item.uid));
          if (allUidsToCheck.length > i + API_CHUNK_SIZE) {
            await new Promise((r) => setTimeout(r, 250));
          }
        }
        Utils.logger("info", Utils.getText("fab_dom_api_complete", ownedUids.size));
        let dbUpdated = false;
        const langPath = State.lang === "zh" ? "/zh-cn" : "";
        if (ownedUids.size > 0) {
          const initialFailedCount = State.db.failed.length;
          State.db.failed = State.db.failed.filter((failedTask) => !ownedUids.has(failedTask.uid));
          if (State.db.failed.length < initialFailedCount) {
            dbUpdated = true;
            ownedUids.forEach((uid) => {
              const url = `${window.location.origin}${langPath}/listings/${uid}`;
              if (!Database.isDone(url)) {
                State.db.done.push(url);
              }
            });
            Utils.logger("info", Utils.getText("log_cleared_from_failed", initialFailedCount - State.db.failed.length));
          }
        }
        if (dbUpdated) {
          await Database.saveFailed();
          await Database.saveDone();
        }
        TaskRunner2.runHideOrShow();
      } catch (e) {
        Utils.logger("error", Utils.getText("log_refresh_error"), e);
      }
    }, "refreshVisibleStates"),
    retryFailedTasks: /* @__PURE__ */ __name(async () => {
      if (State.db.failed.length === 0) {
        Utils.logger("info", Utils.getText("log_no_failed_tasks"));
        return;
      }
      const count = State.db.failed.length;
      Utils.logger("info", Utils.getText("log_requeuing_tasks", count));
      State.db.todo.push(...State.db.failed);
      State.db.failed = [];
      await Database.saveFailed();
      Utils.logger("info", Utils.getText("log_tasks_moved", count));
      if (UI4) UI4.update();
    }, "retryFailedTasks"),
    runWatchdog: /* @__PURE__ */ __name(() => {
      if (State.watchdogTimer) clearInterval(State.watchdogTimer);
      State.watchdogTimer = setInterval(async () => {
        if (!InstanceManager.isActive) return;
        if (!State.isExecuting || Object.keys(State.runningWorkers).length === 0) {
          clearInterval(State.watchdogTimer);
          State.watchdogTimer = null;
          return;
        }
        const now = Date.now();
        const STALL_TIMEOUT = Config.WORKER_TIMEOUT;
        const stalledWorkers = [];
        for (const workerId in State.runningWorkers) {
          const workerInfo = State.runningWorkers[workerId];
          if (workerInfo.instanceId !== Config.INSTANCE_ID) continue;
          if (now - workerInfo.startTime > STALL_TIMEOUT) {
            stalledWorkers.push({ workerId, task: workerInfo.task });
          }
        }
        if (stalledWorkers.length > 0) {
          Utils.logger("warn", Utils.getText("log_stalled_workers", stalledWorkers.length));
          for (const stalledWorker of stalledWorkers) {
            const { workerId, task } = stalledWorker;
            const workerInfo = State.runningWorkers[workerId];
            const stallDuration = workerInfo ? ((Date.now() - workerInfo.startTime) / 1e3).toFixed(2) : "\u672A\u77E5";
            Utils.logger("error", Utils.getText("log_watchdog_stalled", workerId.substring(0, 12)));
            await Database.markAsFailed(task, {
              reason: "\u5DE5\u4F5C\u7EBF\u7A0B\u8D85\u65F6 (Watchdog)",
              logs: [`Worker ${workerId.substring(0, 12)} \u8D85\u65F6`, `\u8D85\u65F6\u65F6\u957F: ${stallDuration}s`],
              details: {
                workerId,
                stallDuration: `${stallDuration}s`,
                timeout: `${Config.WORKER_TIMEOUT / 1e3}s`
              }
            });
            State.executionFailedTasks++;
            delete State.runningWorkers[workerId];
            State.activeWorkers--;
            await GM_deleteValue(workerId);
          }
          Utils.logger("info", Utils.getText("log_cleaned_workers", stalledWorkers.length, State.activeWorkers));
          if (UI4) UI4.update();
          setTimeout(() => {
            if (State.isExecuting && State.activeWorkers < Config.MAX_CONCURRENT_WORKERS && State.db.todo.length > 0) {
              TaskRunner2.executeBatch();
            }
          }, 2e3);
        }
      }, 5e3);
    }, "runWatchdog"),
    executeBatch: /* @__PURE__ */ __name(async () => {
      if (!Utils.checkAuthentication()) return;
      if (!State.isWorkerTab && !InstanceManager.isActive) {
        Utils.logger("warn", Utils.getText("log_not_active_instance"));
        return;
      }
      if (!State.isExecuting) return;
      if (State.isDispatchingTasks) {
        Utils.logger("info", Utils.getText("log_dispatching_in_progress"));
        return;
      }
      State.isDispatchingTasks = true;
      try {
        if (State.db.todo.length === 0 && State.activeWorkers === 0) {
          Utils.logger("info", Utils.getText("log_all_tasks_completed"));
          State.isExecuting = false;
          Database.saveExecutingState();
          Database.saveTodo();
          if (State.watchdogTimer) {
            clearInterval(State.watchdogTimer);
            State.watchdogTimer = null;
          }
          TaskRunner2.closeAllWorkerTabs();
          if (UI4) UI4.update();
          State.isDispatchingTasks = false;
          return;
        }
        if (State.appStatus === "RATE_LIMITED") {
          Utils.logger("info", Utils.getText("log_rate_limited_continue"));
        }
        if (State.activeWorkers >= Config.MAX_CONCURRENT_WORKERS) {
          Utils.logger("info", Utils.getText("log_max_workers_reached", Config.MAX_CONCURRENT_WORKERS));
          State.isDispatchingTasks = false;
          return;
        }
        const inFlightUIDs = new Set(Object.values(State.runningWorkers).map((w) => w.task.uid));
        const todoList = [...State.db.todo];
        let dispatchedCount = 0;
        const dispatchedUIDs = /* @__PURE__ */ new Set();
        for (const task of todoList) {
          if (State.activeWorkers >= Config.MAX_CONCURRENT_WORKERS) break;
          if (inFlightUIDs.has(task.uid) || dispatchedUIDs.has(task.uid)) {
            Utils.logger("debug", Utils.getText("log_task_already_running", task.name));
            continue;
          }
          if (Database.isDone(task.url)) {
            Utils.logger("debug", Utils.getText("log_task_already_done", task.name));
            State.db.todo = State.db.todo.filter((t) => t.uid !== task.uid);
            Database.saveTodo();
            continue;
          }
          dispatchedUIDs.add(task.uid);
          State.activeWorkers++;
          dispatchedCount++;
          const workerId = `worker_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
          State.runningWorkers[workerId] = {
            task,
            startTime: Date.now(),
            instanceId: Config.INSTANCE_ID
          };
          Utils.logger("debug", Utils.getText("log_dispatching_worker", workerId.substring(0, 12), task.name));
          await GM_setValue(workerId, {
            task,
            instanceId: Config.INSTANCE_ID
          });
          const workerUrl = new URL(task.url);
          workerUrl.searchParams.set("workerId", workerId);
          GM_openInTab(workerUrl.href, { active: false, insert: true });
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
        if (dispatchedCount > 0) {
          Utils.logger("debug", Utils.getText("log_batch_dispatched", dispatchedCount));
        }
        if (!State.watchdogTimer && State.activeWorkers > 0) {
          TaskRunner2.runWatchdog();
        }
        if (UI4) UI4.update();
      } finally {
        State.isDispatchingTasks = false;
      }
    }, "executeBatch"),
    closeAllWorkerTabs: /* @__PURE__ */ __name(() => {
      const workerIds = Object.keys(State.runningWorkers);
      if (workerIds.length > 0) {
        Utils.logger("debug", Utils.getText("log_cleaning_workers_state", workerIds.length));
        for (const workerId of workerIds) {
          GM_deleteValue(workerId);
        }
        State.runningWorkers = {};
        State.activeWorkers = 0;
        Utils.logger("info", Utils.getText("log_workers_cleaned"));
      }
    }, "closeAllWorkerTabs"),
    processDetailPage: /* @__PURE__ */ __name(async () => {
      if (!Utils.checkAuthentication()) return;
      const urlParams = new URLSearchParams(window.location.search);
      const workerId = urlParams.get("workerId");
      if (!workerId) return;
      State.isWorkerTab = true;
      State.workerTaskId = workerId;
      const startTime = Date.now();
      let hasReported = false;
      let closeAttempted = false;
      let payload = null;
      const forceCloseTimer = setTimeout(() => {
        if (!closeAttempted) {
          console.log("\u5F3A\u5236\u5173\u95ED\u5DE5\u4F5C\u6807\u7B7E\u9875");
          try {
            window.close();
          } catch (e) {
            console.error("\u5173\u95ED\u5DE5\u4F5C\u6807\u7B7E\u9875\u5931\u8D25:", e);
          }
        }
      }, 6e4);
      function closeWorkerTab() {
        closeAttempted = true;
        clearTimeout(forceCloseTimer);
        if (!hasReported && workerId) {
          try {
            GM_setValue(Config.DB_KEYS.WORKER_DONE, {
              workerId,
              success: false,
              logs: [Utils.getText("worker_closed")],
              task: payload?.task,
              instanceId: payload?.instanceId,
              executionTime: Date.now() - startTime
            });
          } catch (e) {
          }
        }
        try {
          window.close();
        } catch (error) {
          Utils.logger("error", Utils.getText("log_close_worker_failed", error.message));
          try {
            window.location.href = "about:blank";
          } catch (e) {
          }
        }
      }
      __name(closeWorkerTab, "closeWorkerTab");
      try {
        payload = await GM_getValue(workerId);
        if (!payload || !payload.task) {
          Utils.logger("info", Utils.getText("log_task_data_cleaned"));
          closeWorkerTab();
          return;
        }
        const activeInstance = await GM_getValue("fab_active_instance", null);
        if (activeInstance && activeInstance.id !== payload.instanceId) {
          Utils.logger("warn", Utils.getText("log_instance_mismatch", payload.instanceId, activeInstance.id));
          await GM_deleteValue(workerId);
          closeWorkerTab();
          return;
        }
        const currentTask = payload.task;
        const logBuffer = [`[${workerId.substring(0, 12)}] Started: ${currentTask.name}`];
        let success = false;
        try {
          const waitForPageReady = /* @__PURE__ */ __name(async () => {
            const maxWait = 15e3;
            const startTime2 = Date.now();
            let lastState = "";
            while (Date.now() - startTime2 < maxWait) {
              const currentState = document.readyState;
              const hasMainContent = document.querySelector('main, .product-detail, [class*="listing"], [class*="detail"]');
              const hasButtons = document.querySelectorAll("button").length > 0;
              const hasTitle = document.querySelector("h1, .fabkit-Heading--xl");
              if (currentState !== lastState) {
                logBuffer.push(`\u9875\u9762\u72B6\u6001: ${currentState}`);
                lastState = currentState;
              }
              if (currentState === "complete" && hasMainContent && (hasButtons || hasTitle)) {
                logBuffer.push(`\u9875\u9762\u5C31\u7EEA\u68C0\u6D4B\u901A\u8FC7: readyState=${currentState}, hasContent=true`);
                return true;
              }
              await new Promise((r) => setTimeout(r, 500));
            }
            logBuffer.push(`\u9875\u9762\u5C31\u7EEA\u68C0\u6D4B\u8D85\u65F6 (${maxWait}ms)\uFF0C\u7EE7\u7EED\u5C1D\u8BD5\u64CD\u4F5C`);
            return false;
          }, "waitForPageReady");
          const pageReady = await waitForPageReady();
          if (!pageReady) {
            logBuffer.push(`\u26A0\uFE0F \u8B66\u544A: \u9875\u9762\u53EF\u80FD\u672A\u5B8C\u5168\u52A0\u8F7D\uFF0C\u8FD9\u53EF\u80FD\u5BFC\u81F4\u64CD\u4F5C\u5931\u8D25`);
          }
          await new Promise((resolve) => setTimeout(resolve, 2e3));
          const adultContentWarning = document.querySelector(".fabkit-Heading--xl");
          if (adultContentWarning && (adultContentWarning.textContent.includes("\u6210\u4EBA\u5185\u5BB9") || adultContentWarning.textContent.includes("Adult Content") || adultContentWarning.textContent.includes("Mature Content"))) {
            logBuffer.push(`\u68C0\u6D4B\u5230\u6210\u4EBA\u5185\u5BB9\u8B66\u544A\u5BF9\u8BDD\u6846\uFF0C\u81EA\u52A8\u70B9\u51FB"\u7EE7\u7EED"\u6309\u94AE...`);
            const continueButton = [...document.querySelectorAll("button.fabkit-Button--primary")].find(
              (btn) => btn.textContent.includes("\u7EE7\u7EED") || btn.textContent.includes("Continue")
            );
            if (continueButton) {
              Utils.deepClick(continueButton);
              logBuffer.push(`\u5DF2\u70B9\u51FB"\u7EE7\u7EED"\u6309\u94AE\uFF0C\u7B49\u5F85\u9875\u9762\u52A0\u8F7D...`);
              await new Promise((resolve) => setTimeout(resolve, 2e3));
            }
          }
          logBuffer.push(`=== \u9875\u9762\u72B6\u6001\u8BCA\u65AD\u5F00\u59CB ===`);
          const diagnosticReport = PageDiagnostics.diagnoseDetailPage();
          logBuffer.push(`\u9875\u9762\u6807\u9898: ${diagnosticReport.pageTitle}`);
          logBuffer.push(`\u53EF\u89C1\u6309\u94AE\u6570\u91CF: ${diagnosticReport.buttons.filter((btn) => btn.isVisible).length}`);
          logBuffer.push(`=== \u9875\u9762\u72B6\u6001\u8BCA\u65AD\u7ED3\u675F ===`);
          try {
            const csrfToken = Utils.getCookie("fab_csrftoken");
            if (!csrfToken) throw new Error("CSRF token not found for API check.");
            const statesUrl = new URL("https://www.fab.com/i/users/me/listings-states");
            statesUrl.searchParams.append("listing_ids", currentTask.uid);
            const response = await API.gmFetch({
              method: "GET",
              url: statesUrl.href,
              headers: { "x-csrftoken": csrfToken, "x-requested-with": "XMLHttpRequest" }
            });
            let statesData;
            try {
              statesData = JSON.parse(response.responseText);
              if (!Array.isArray(statesData)) {
                statesData = API.extractStateData(statesData, "SingleItemCheck");
              }
            } catch (e) {
              logBuffer.push(`\u89E3\u6790API\u54CD\u5E94\u5931\u8D25: ${e.message}`);
              statesData = [];
            }
            const isOwned = Array.isArray(statesData) && statesData.some((s) => s && s.uid === currentTask.uid && s.acquired);
            if (isOwned) {
              logBuffer.push(`API check confirms item is already owned.`);
              success = true;
            } else {
              logBuffer.push(`API check confirms item is not owned. Proceeding to UI interaction.`);
            }
          } catch (apiError) {
            logBuffer.push(`API ownership check failed: ${apiError.message}. Falling back to UI-based check.`);
          }
          if (!success) {
            const isItemOwned = /* @__PURE__ */ __name(() => {
              const criteria = Config.OWNED_SUCCESS_CRITERIA;
              const snackbar = document.querySelector('.fabkit-Snackbar-root, div[class*="Toast-root"]');
              if (snackbar && criteria.snackbarText.some((text) => snackbar.textContent.includes(text))) {
                return { owned: true, reason: `Snackbar text "${snackbar.textContent}"` };
              }
              const successHeader = document.querySelector("h2");
              if (successHeader && criteria.h2Text.some((text) => successHeader.textContent.includes(text))) {
                return { owned: true, reason: `H2 text "${successHeader.textContent}"` };
              }
              const allButtons = [...document.querySelectorAll("button, a.fabkit-Button-root")];
              const ownedButton = allButtons.find((btn) => criteria.buttonTexts.some((keyword) => btn.textContent.includes(keyword)));
              if (ownedButton) return { owned: true, reason: `Button text "${ownedButton.textContent}"` };
              return { owned: false };
            }, "isItemOwned");
            const initialState = isItemOwned();
            if (initialState.owned) {
              logBuffer.push(`Item already owned on page load (UI Fallback PASS: ${initialState.reason}).`);
              success = true;
            } else {
              const allVisibleButtons = [...document.querySelectorAll("button")].filter((btn) => {
                const rect = btn.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
              });
              logBuffer.push(`=== \u6309\u94AE\u68C0\u6D4B\u5F00\u59CB (\u5171 ${allVisibleButtons.length} \u4E2A\u53EF\u89C1\u6309\u94AE) ===`);
              allVisibleButtons.slice(0, 15).forEach((btn, i) => {
                const text = btn.textContent.trim().substring(0, 60);
                logBuffer.push(`  \u6309\u94AE${i + 1}: "${text}"`);
              });
              const licenseButton = allVisibleButtons.find(
                (btn) => btn.textContent.includes("\u9009\u62E9\u8BB8\u53EF") || btn.textContent.includes("Select license")
              );
              if (licenseButton) {
                logBuffer.push(`Multi-license item detected. Setting up observer for dropdown.`);
                try {
                  await new Promise((resolve, reject) => {
                    const observer = new MutationObserver((mutationsList) => {
                      for (const mutation of mutationsList) {
                        if (mutation.addedNodes.length > 0) {
                          for (const node of mutation.addedNodes) {
                            if (node.nodeType !== 1) continue;
                            const freeTextElement = Array.from(node.querySelectorAll("span, div")).find(
                              (el) => Array.from(el.childNodes).some((cn) => {
                                if (cn.nodeType !== 3) return false;
                                const text = cn.textContent.trim();
                                return [...Config.FREE_TEXT_SET].some((freeWord) => text === freeWord) || text === "\u4E2A\u4EBA" || text === "Personal";
                              })
                            );
                            if (freeTextElement) {
                              const clickableParent = freeTextElement.closest('[role="option"], button, label, input[type="radio"]');
                              if (clickableParent) {
                                logBuffer.push(`Found free/personal license option, clicking it.`);
                                Utils.deepClick(clickableParent);
                                observer.disconnect();
                                resolve();
                                return;
                              }
                            }
                          }
                        }
                      }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                    logBuffer.push(`Clicking license button to open dropdown.`);
                    Utils.deepClick(licenseButton);
                    setTimeout(() => {
                      logBuffer.push(`Second attempt to click license button.`);
                      Utils.deepClick(licenseButton);
                    }, 1500);
                    setTimeout(() => {
                      observer.disconnect();
                      reject(new Error("Timeout (5s): The free/personal option did not appear."));
                    }, 5e3);
                  });
                  logBuffer.push(`License selected, waiting for UI update.`);
                  await new Promise((r) => setTimeout(r, 2e3));
                  if (isItemOwned().owned) {
                    logBuffer.push(`Item became owned after license selection.`);
                    success = true;
                  }
                } catch (licenseError) {
                  logBuffer.push(`License selection failed: ${licenseError.message}`);
                }
              }
              if (!success) {
                const freshButtons = [...document.querySelectorAll("button")].filter((btn) => {
                  const rect = btn.getBoundingClientRect();
                  return rect.width > 0 && rect.height > 0;
                });
                logBuffer.push(`=== \u91CD\u65B0\u68C0\u6D4B\u6309\u94AE (\u5171 ${freshButtons.length} \u4E2A\u53EF\u89C1\u6309\u94AE) ===`);
                freshButtons.slice(0, 10).forEach((btn, i) => {
                  const text = btn.textContent.trim().substring(0, 60);
                  logBuffer.push(`  \u6309\u94AE${i + 1}: "${text}"`);
                });
                let actionButton = freshButtons.find((btn) => {
                  const text = btn.textContent.toLowerCase();
                  return [...Config.ACQUISITION_TEXT_SET].some(
                    (keyword) => text.includes(keyword.toLowerCase())
                  );
                });
                if (!actionButton) {
                  actionButton = freshButtons.find((btn) => {
                    const text = btn.textContent;
                    const hasFreeText = [...Config.FREE_TEXT_SET].some((freeWord) => text.includes(freeWord));
                    const hasDiscount = text.includes("-100%");
                    const hasPersonal = text.includes("\u4E2A\u4EBA") || text.includes("Personal");
                    return hasFreeText && hasDiscount && hasPersonal;
                  });
                  if (actionButton) {
                    logBuffer.push(`Found limited-time free license button: "${actionButton.textContent.trim().substring(0, 50)}"`);
                  }
                }
                if (!actionButton) {
                  actionButton = freshButtons.find((btn) => {
                    const text = btn.textContent.toLowerCase();
                    return text.includes("add") && text.includes("library") || text.includes("\u6DFB\u52A0") && text.includes("\u5E93");
                  });
                  if (actionButton) {
                    logBuffer.push(`\u901A\u8FC7\u5907\u7528\u65B9\u6848\u627E\u5230\u6309\u94AE: "${actionButton.textContent.trim().substring(0, 50)}"`);
                  }
                }
                if (actionButton) {
                  logBuffer.push(`Found add button, clicking it.`);
                  Utils.deepClick(actionButton);
                  try {
                    await new Promise((resolve, reject) => {
                      const timeout = 25e3;
                      const interval = setInterval(() => {
                        const currentState = isItemOwned();
                        if (currentState.owned) {
                          logBuffer.push(`Item became owned after clicking add button: ${currentState.reason}`);
                          success = true;
                          clearInterval(interval);
                          resolve();
                        }
                      }, 500);
                      setTimeout(() => {
                        clearInterval(interval);
                        reject(new Error(`Timeout waiting for page to enter an 'owned' state.`));
                      }, timeout);
                    });
                  } catch (timeoutError) {
                    logBuffer.push(`Timeout waiting for ownership: ${timeoutError.message}`);
                  }
                } else {
                  logBuffer.push(`Could not find an add button.`);
                }
              }
            }
          }
        } catch (error) {
          logBuffer.push(`A critical error occurred: ${error.message}`);
          success = false;
        } finally {
          try {
            hasReported = true;
            await GM_setValue(Config.DB_KEYS.WORKER_DONE, {
              workerId,
              success,
              logs: logBuffer,
              task: currentTask,
              instanceId: payload.instanceId,
              executionTime: Date.now() - startTime
            });
          } catch (error) {
            console.error("Error setting worker done value:", error);
          }
          try {
            await GM_deleteValue(workerId);
          } catch (error) {
            console.error("Error deleting worker value:", error);
          }
          closeWorkerTab();
        }
      } catch (error) {
        Utils.logger("error", `Worker tab error: ${error.message}`);
        closeWorkerTab();
      }
    }, "processDetailPage"),
    runHideOrShow: /* @__PURE__ */ __name(() => {
      State.hiddenThisPageCount = 0;
      const cards = document.querySelectorAll(Config.SELECTORS.card);
      let actuallyHidden = 0;
      let hasUnsettledCards = false;
      const unsettledCards = [];
      const isCardSettled = /* @__PURE__ */ __name((card) => {
        return card.querySelector(`${Config.SELECTORS.freeStatus}, ${Config.SELECTORS.ownedStatus}`) !== null;
      }, "isCardSettled");
      cards.forEach((card) => {
        if (!isCardSettled(card)) {
          hasUnsettledCards = true;
          unsettledCards.push(card);
        }
      });
      if (hasUnsettledCards && unsettledCards.length > 0) {
        Utils.logger("info", Utils.getText("log_unsettled_cards", unsettledCards.length));
        setTimeout(() => TaskRunner2.runHideOrShow(), 2e3);
        return;
      }
      const cardsToHide = [];
      cards.forEach((card) => {
        const isProcessed = card.getAttribute("data-fab-processed") === "true";
        if (isProcessed && card.style.display === "none") {
          State.hiddenThisPageCount++;
          return;
        }
        const isFinished = TaskRunner2.isCardFinished(card);
        if (State.hideSaved && isFinished) {
          cardsToHide.push(card);
          State.hiddenThisPageCount++;
          card.setAttribute("data-fab-processed", "true");
        } else {
          card.setAttribute("data-fab-processed", "true");
        }
      });
      if (cardsToHide.length > 0) {
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("debug_prepare_hide", cardsToHide.length));
        }
        cardsToHide.sort(() => Math.random() - 0.5);
        const batchSize = 10;
        const batches = Math.ceil(cardsToHide.length / batchSize);
        const initialDelay = 1e3;
        for (let i = 0; i < batches; i++) {
          const start = i * batchSize;
          const end = Math.min(start + batchSize, cardsToHide.length);
          const currentBatch = cardsToHide.slice(start, end);
          const batchDelay = initialDelay + i * 300 + Math.random() * 300;
          setTimeout(() => {
            currentBatch.forEach((card, index) => {
              const cardDelay = index * 50 + Math.random() * 100;
              setTimeout(() => {
                card.style.display = "none";
                actuallyHidden++;
                if (actuallyHidden === cardsToHide.length) {
                  if (State.debugMode) {
                    Utils.logger("debug", Utils.getText("debug_hide_completed", actuallyHidden));
                  }
                  setTimeout(() => {
                    if (UI4) UI4.update();
                    TaskRunner2.checkVisibilityAndRefresh();
                  }, 300);
                }
              }, cardDelay);
            });
          }, batchDelay);
        }
      }
      if (State.hideSaved) {
        const visibleCards = Array.from(cards).filter((card) => !TaskRunner2.isCardFinished(card));
        visibleCards.forEach((card) => {
          card.style.display = "";
        });
        if (cardsToHide.length === 0) {
          if (UI4) UI4.update();
          TaskRunner2.checkVisibilityAndRefresh();
        }
      } else {
        cards.forEach((card) => {
          card.style.display = "";
        });
        if (UI4) UI4.update();
      }
    }, "runHideOrShow"),
    checkVisibilityAndRefresh: /* @__PURE__ */ __name(() => {
      const cards = document.querySelectorAll(Config.SELECTORS.card);
      let needsReprocessing = false;
      cards.forEach((card) => {
        const isProcessed = card.getAttribute("data-fab-processed") === "true";
        if (!isProcessed) needsReprocessing = true;
      });
      if (needsReprocessing) {
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("debug_unprocessed_cards_simple"));
        }
        setTimeout(() => TaskRunner2.runHideOrShow(), 100);
        return;
      }
      const visibleCards = Array.from(cards).filter((card) => {
        if (card.style.display === "none") return false;
        const computedStyle = window.getComputedStyle(card);
        return computedStyle.display !== "none" && computedStyle.visibility !== "hidden";
      }).length;
      if (State.debugMode) {
        Utils.logger("debug", Utils.getText("debug_visible_after_hide", visibleCards, State.hiddenThisPageCount));
      }
      const visibleCountElement = document.getElementById("fab-status-visible");
      if (visibleCountElement) {
        visibleCountElement.textContent = visibleCards.toString();
      }
      if (visibleCards === 0) {
        if (State.appStatus === "RATE_LIMITED" && State.autoRefreshEmptyPage) {
          if (State.isRefreshScheduled) {
            Utils.logger("info", Utils.getText("refresh_plan_exists"));
            return;
          }
          Utils.logger("info", Utils.getText("log_all_hidden_rate_limited"));
          State.isRefreshScheduled = true;
          setTimeout(() => {
            const currentVisibleCards = Array.from(document.querySelectorAll(Config.SELECTORS.card)).filter((card) => card.style.display !== "none").length;
            if (State.db.todo.length > 0 || State.activeWorkers > 0) {
              Utils.logger("info", Utils.getText("log_refresh_cancelled_tasks", State.db.todo.length, State.activeWorkers));
              State.isRefreshScheduled = false;
              return;
            }
            if (currentVisibleCards === 0 && State.appStatus === "RATE_LIMITED" && State.autoRefreshEmptyPage) {
              Utils.logger("info", Utils.getText("log_refreshing"));
              window.location.href = window.location.href;
            } else {
              Utils.logger("info", Utils.getText("log_refresh_cancelled_visible", currentVisibleCards));
              State.isRefreshScheduled = false;
            }
          }, 2e3);
        } else if (State.appStatus === "NORMAL" && State.hiddenThisPageCount > 0) {
          Utils.logger("debug", Utils.getText("page_status_hidden_no_visible", State.hiddenThisPageCount));
        }
      }
    }, "checkVisibilityAndRefresh"),
    ensureTasksAreExecuted: /* @__PURE__ */ __name(() => {
      if (State.db.todo.length === 0) return;
      if (State.isExecuting) {
        if (State.activeWorkers === 0) {
          Utils.logger("info", Utils.getText("log_ensure_tasks"));
          TaskRunner2.executeBatch();
        }
        return;
      }
      Utils.logger("info", Utils.getText("log_auto_start_execution", State.db.todo.length));
      TaskRunner2.startExecution();
    }, "ensureTasksAreExecuted"),
    checkVisibleCardsStatus: /* @__PURE__ */ __name(async () => {
      try {
        const visibleCards = [...document.querySelectorAll(Config.SELECTORS.card)];
        if (visibleCards.length === 0) {
          Utils.logger("info", Utils.getText("log_no_visible_cards"));
          return;
        }
        let hasUnsettledCards = false;
        const unsettledCards = [];
        const isCardSettled = /* @__PURE__ */ __name((card) => {
          return card.querySelector(`${Config.SELECTORS.freeStatus}, ${Config.SELECTORS.ownedStatus}`) !== null;
        }, "isCardSettled");
        visibleCards.forEach((card) => {
          if (!isCardSettled(card)) {
            hasUnsettledCards = true;
            unsettledCards.push(card);
          }
        });
        if (hasUnsettledCards && unsettledCards.length > 0) {
          Utils.logger("info", Utils.getText("log_waiting_for_cards", unsettledCards.length));
          await new Promise((resolve) => setTimeout(resolve, 3e3));
          return TaskRunner2.checkVisibleCardsStatus();
        }
        const allItems = [];
        let confirmedOwned = 0;
        visibleCards.forEach((card) => {
          const link = card.querySelector(Config.SELECTORS.cardLink);
          const uidMatch = link?.href.match(/listings\/([a-f0-9-]+)/);
          if (uidMatch && uidMatch[1]) {
            const uid = uidMatch[1];
            const url = link.href.split("?")[0];
            if (State.db.done.includes(url)) return;
            allItems.push({ uid, url, element: card });
          }
        });
        if (allItems.length === 0) {
          Utils.logger("debug", Utils.getText("debug_no_cards_to_check"));
          return;
        }
        Utils.logger("info", Utils.getText("fab_dom_checking_status", allItems.length));
        const uids = allItems.map((item) => item.uid);
        const statesData = await API.checkItemsOwnership(uids);
        const ownedUids = new Set(
          statesData.filter((state) => state && state.acquired).map((state) => state.uid)
        );
        for (const item of allItems) {
          if (ownedUids.has(item.uid)) {
            if (!State.db.done.includes(item.url)) {
              State.db.done.push(item.url);
              confirmedOwned++;
            }
            State.db.failed = State.db.failed.filter((f) => f.uid !== item.uid);
            State.db.todo = State.db.todo.filter((t) => t.uid !== item.uid);
          }
        }
        if (confirmedOwned > 0) {
          await Database.saveDone();
          await Database.saveFailed();
          Utils.logger("info", Utils.getText("fab_dom_api_complete", confirmedOwned));
          Utils.logger("info", Utils.getText("fab_dom_refresh_complete", confirmedOwned));
        } else {
          Utils.logger("debug", Utils.getText("fab_dom_no_new_owned"));
        }
      } catch (error) {
        Utils.logger("error", Utils.getText("log_check_status_error", error.message));
        if (error.message && error.message.includes("429")) {
          RateLimitManager.enterRateLimitedState("[Fab DOM Refresh] 429\u9519\u8BEF");
        }
      }
    }, "checkVisibleCardsStatus"),
    scanAndAddTasks: /* @__PURE__ */ __name(async (cards) => {
      if (!State.autoAddOnScroll) return;
      if (State.isScanningTasks) {
        Utils.logger("debug", `\u5DF2\u6709\u626B\u63CF\u4EFB\u52A1\u8FDB\u884C\u4E2D\uFF0C\u8DF3\u8FC7\u672C\u6B21\u8C03\u7528 (${cards.length} \u5F20\u5361\u7247)`);
        return;
      }
      State.isScanningTasks = true;
      try {
        if (!window._apiWaitStatus) {
          window._apiWaitStatus = {
            isWaiting: false,
            pendingCards: [],
            lastApiActivity: 0,
            apiCheckInterval: null
          };
        }
        if (window._apiWaitStatus.isWaiting) {
          window._apiWaitStatus.pendingCards = [...window._apiWaitStatus.pendingCards, ...cards];
          Utils.logger("info", Utils.getText("debug_api_wait_in_progress", cards.length));
          return;
        }
        window._apiWaitStatus.isWaiting = true;
        window._apiWaitStatus.pendingCards = [...cards];
        window._apiWaitStatus.lastApiActivity = Date.now();
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("debug_wait_api_response", cards.length));
        }
        const waitForApiCompletion = /* @__PURE__ */ __name(() => {
          return new Promise((resolve) => {
            if (window._apiWaitStatus.apiCheckInterval) {
              clearInterval(window._apiWaitStatus.apiCheckInterval);
            }
            const maxWaitTime = 1e4;
            const startTime = Date.now();
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
              const url = args[0]?.toString() || "";
              if (url.includes("/listings-states") || url.includes("/listings/search")) {
                window._apiWaitStatus.lastApiActivity = Date.now();
              }
              return originalFetch.apply(this, args);
            };
            window._apiWaitStatus.apiCheckInterval = setInterval(() => {
              const now = Date.now();
              const timeSinceLastActivity = now - window._apiWaitStatus.lastApiActivity;
              const totalWaitTime = now - startTime;
              if (totalWaitTime > maxWaitTime || timeSinceLastActivity > 2e3) {
                clearInterval(window._apiWaitStatus.apiCheckInterval);
                window.fetch = originalFetch;
                resolve();
              }
            }, 200);
          });
        }, "waitForApiCompletion");
        try {
          await waitForApiCompletion();
        } catch (error) {
          Utils.logger("error", Utils.getText("auto_add_api_error", error.message));
        }
        const cardsToProcess = [...window._apiWaitStatus.pendingCards];
        window._apiWaitStatus.pendingCards = [];
        window._apiWaitStatus.isWaiting = false;
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("debug_api_wait_complete", cardsToProcess.length));
        }
        const newlyAddedList = [];
        let skippedAlreadyOwned = 0;
        let skippedInTodo = 0;
        cardsToProcess.forEach((card) => {
          const link = card.querySelector(Config.SELECTORS.cardLink);
          const url = link ? link.href.split("?")[0] : null;
          if (!url) return;
          if (Database.isDone(url)) {
            skippedAlreadyOwned++;
            return;
          }
          if (Database.isTodo(url)) {
            skippedInTodo++;
            return;
          }
          const text = card.textContent || "";
          if (text.includes("\u5DF2\u4FDD\u5B58\u5728\u6211\u7684\u5E93\u4E2D") || text.includes("\u5DF2\u4FDD\u5B58") || text.includes("Saved to My Library") || text.includes("In your library")) {
            skippedAlreadyOwned++;
            return;
          }
          const icons = card.querySelectorAll("i.fabkit-Icon--intent-success, i.edsicon-check-circle-filled");
          if (icons.length > 0) {
            skippedAlreadyOwned++;
            return;
          }
          const uidMatch = url.match(/listings\/([a-f0-9-]+)/);
          if (uidMatch && uidMatch[1]) {
            const uid = uidMatch[1];
            if (DataCache.ownedStatus.has(uid)) {
              const status = DataCache.ownedStatus.get(uid);
              if (status && status.acquired) {
                skippedAlreadyOwned++;
                return;
              }
            }
          }
          if (!TaskRunner2.isFreeCard(card)) return;
          const name = card.querySelector('a[aria-label*="\u521B\u4F5C\u7684"], a[aria-label*="by "]')?.textContent.trim() || card.querySelector('a[href*="/listings/"]')?.textContent.trim() || Utils.getText("untitled");
          newlyAddedList.push({ name, url, type: "detail", uid: url.split("/").pop() });
        });
        if (newlyAddedList.length > 0 || skippedAlreadyOwned > 0 || skippedInTodo > 0) {
          if (newlyAddedList.length > 0) {
            const existingUids = new Set(State.db.todo.map((t) => t.uid));
            const existingUrls = new Set(State.db.todo.map((t) => t.url.split("?")[0]));
            const uniqueNewTasks = newlyAddedList.filter((task) => {
              const cleanUrl = task.url.split("?")[0];
              const isDuplicate = existingUids.has(task.uid) || existingUrls.has(cleanUrl);
              if (isDuplicate) {
                Utils.logger("debug", `\u8DF3\u8FC7\u91CD\u590D\u4EFB\u52A1: ${task.name} (uid: ${task.uid})`);
              }
              return !isDuplicate;
            });
            if (uniqueNewTasks.length > 0) {
              State.db.todo.push(...uniqueNewTasks);
              Utils.logger("info", Utils.getText("auto_add_new_tasks", uniqueNewTasks.length));
              if (uniqueNewTasks.length < newlyAddedList.length) {
                Utils.logger("debug", `\u8FC7\u6EE4\u4E86 ${newlyAddedList.length - uniqueNewTasks.length} \u4E2A\u91CD\u590D\u4EFB\u52A1`);
              }
              Database.saveTodo();
            } else {
              Utils.logger("debug", `\u6240\u6709 ${newlyAddedList.length} \u4E2A\u4EFB\u52A1\u90FD\u662F\u91CD\u590D\u7684\uFF0C\u5DF2\u8DF3\u8FC7`);
            }
          }
          if (skippedAlreadyOwned > 0 || skippedInTodo > 0) {
            Utils.logger("debug", Utils.getText("debug_filter_owned", skippedAlreadyOwned, skippedInTodo));
          }
          if (State.isExecuting) {
            State.executionTotalTasks = State.db.todo.length;
            TaskRunner2.executeBatch();
          } else if (State.autoAddOnScroll) {
            TaskRunner2.startExecution();
          }
          if (UI4) UI4.update();
        }
      } finally {
        State.isScanningTasks = false;
      }
    }, "scanAndAddTasks"),
    handleRateLimit: /* @__PURE__ */ __name(async (url) => {
      await RateLimitManager.enterRateLimitedState(url || "\u7F51\u7EDC\u8BF7\u6C42");
    }, "handleRateLimit"),
    reportTaskDone: /* @__PURE__ */ __name(async (task, success) => {
      try {
        await GM_setValue(Config.DB_KEYS.WORKER_DONE, {
          workerId: `worker_task_${task.uid}`,
          success,
          logs: [Utils.getText("task_report", success ? Utils.getText("task_success") : Utils.getText("task_failed"), task.name || task.uid)],
          task,
          instanceId: Config.INSTANCE_ID,
          executionTime: 0
        });
        Utils.logger("info", Utils.getText("task_report", success ? Utils.getText("task_success") : Utils.getText("task_failed"), task.name || task.uid));
      } catch (error) {
        Utils.logger("error", Utils.getText("log_report_error", error.message));
      }
    }, "reportTaskDone")
  };

  // src/modules/ui.js
  var TaskRunner3 = null;
  function setTaskRunnerReference(taskRunnerModule) {
    TaskRunner3 = taskRunnerModule;
  }
  __name(setTaskRunnerReference, "setTaskRunnerReference");
  var UI5 = {
    init: /* @__PURE__ */ __name(() => {
      return UI5.create();
    }, "init"),
    create: /* @__PURE__ */ __name(() => {
      const acquisitionButton = [...document.querySelectorAll("button")].find(
        (btn) => [...Config.ACQUISITION_TEXT_SET].some((keyword) => btn.textContent.includes(keyword))
      );
      const downloadTexts = ["\u4E0B\u8F7D", "Download"];
      const downloadButton = [...document.querySelectorAll('a[href*="/download/"], button')].find(
        (btn) => downloadTexts.some((text) => btn.textContent.includes(text))
      );
      if (acquisitionButton || downloadButton) {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has("workerId")) return false;
        Utils.logger("info", "On a detail page (detected by action buttons), skipping UI creation.");
        return false;
      }
      if (document.getElementById(Config.UI_CONTAINER_ID)) return true;
      const styles = `
            :root {
                --bg-color: rgba(28, 28, 30, 0.9);
                --border-color: rgba(255, 255, 255, 0.15);
                --text-color-primary: #f5f5f7;
                --text-color-secondary: #a0a0a5;
                --radius-l: 12px;
                --radius-m: 8px;
                --radius-s: 6px;
                --blue: #007aff; --pink: #ff2d55; --green: #34c759;
                --orange: #ff9500; --gray: #8e8e93; --dark-gray: #3a3a3c;
                --blue-bg: rgba(0, 122, 255, 0.2);
            }
            #${Config.UI_CONTAINER_ID} {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
                background: var(--bg-color);
                backdrop-filter: blur(15px) saturate(1.8);
                -webkit-backdrop-filter: blur(15px) saturate(1.8);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-l);
                color: var(--text-color-primary);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                width: 300px;
                font-size: 14px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            }
            #${Config.UI_CONTAINER_ID} *, #${Config.UI_CONTAINER_ID} *::before, #${Config.UI_CONTAINER_ID} *::after {
                box-sizing: border-box;
            }
            .fab-helper-tabs {
                display: flex;
                border-bottom: 1px solid var(--border-color);
            }
            .fab-helper-tabs button {
                flex: 1;
                padding: 10px 0;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                background: transparent;
                border: none;
                color: var(--text-color-secondary);
                transition: color 0.2s, border-bottom 0.2s;
                border-bottom: 2px solid transparent;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .fab-helper-tabs button.active {
                color: var(--text-color-primary);
                border-bottom: 2px solid var(--blue);
            }
            .fab-helper-tab-content {
                padding: 12px;
            }
            .fab-helper-status-bar {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
            }
            .fab-helper-status-item {
                background: var(--dark-gray);
                padding: 8px 6px;
                border-radius: var(--radius-m);
                font-size: 12px;
                color: var(--text-color-secondary);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 2px;
                min-width: 0;
                flex-grow: 1;
                flex-basis: calc((100% - 12px) / 3);
            }
            .fab-helper-status-label {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
                white-space: nowrap;
            }
            .fab-helper-status-item span {
                display: block;
                font-size: 18px;
                font-weight: 600;
                color: #fff;
                margin-top: 0;
            }
            .fab-helper-execute-btn {
                width: 100%;
                border: none;
                border-radius: var(--radius-m);
                padding: 12px 14px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                color: #fff;
                background: var(--blue);
                margin-bottom: 12px;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }
            .fab-helper-execute-btn.executing {
                background: var(--pink);
            }
            .fab-helper-actions {
                display: flex;
                gap: 8px;
            }
            .fab-helper-actions button {
                flex: 1;
                min-width: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 5px;
                background: var(--dark-gray);
                border: none;
                border-radius: var(--radius-m);
                color: var(--text-color-primary);
                padding: 8px 6px;
                cursor: pointer;
                transition: background-color 0.2s;
                white-space: nowrap;
                font-size: 13.5px;
                font-weight: normal;
            }
            .fab-helper-actions button:hover {
                background: #4a4a4c;
            }
            .fab-log-container {
                padding: 0 12px 12px 12px;
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 12px;
            }
            .fab-log-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
                margin-top: 8px;
            }
            .fab-log-header span {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-color-secondary);
            }
            .fab-log-controls button {
                background: transparent;
                border: none;
                color: var(--text-color-secondary);
                cursor: pointer;
                padding: 4px;
                font-size: 18px;
                line-height: 1;
            }
            #${Config.UI_LOG_ID} {
                background: rgba(10,10,10,0.85);
                color: #ddd;
                font-size: 11px;
                line-height: 1.4;
                padding: 8px;
                border-radius: var(--radius-m);
                max-height: 150px;
                overflow-y: auto;
                min-height: 50px;
                display: flex;
                flex-direction: column-reverse;
                box-shadow: inset 0 1px 4px rgba(0,0,0,0.2);
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.3) rgba(0,0,0,0.2);
            }
            #${Config.UI_LOG_ID}::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            #${Config.UI_LOG_ID}::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 4px;
            }
            #${Config.UI_LOG_ID}::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 4px;
            }
            .fab-setting-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0;
                border-bottom: 1px solid var(--border-color);
            }
            .fab-setting-row:last-child {
                border-bottom: none;
            }
            .fab-setting-label {
                font-size: 14px;
            }
            .fab-toggle-switch {
                position: relative;
                display: inline-block;
                width: 44px;
                height: 24px;
            }
            .fab-toggle-switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .fab-toggle-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: var(--dark-gray);
                transition: .4s;
                border-radius: 24px;
            }
            .fab-toggle-slider:before {
                position: absolute;
                content: "";
                height: 20px;
                width: 20px;
                left: 2px;
                bottom: 2px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }
            input:checked + .fab-toggle-slider {
                background-color: var(--blue);
            }
            input:checked + .fab-toggle-slider:before {
                transform: translateX(20px);
            }
            .fab-debug-history-container {
                scrollbar-width: thin;
                scrollbar-color: rgba(255,255,255,0.3) rgba(0,0,0,0.2);
            }
            .fab-debug-history-container::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            .fab-debug-history-container::-webkit-scrollbar-track {
                background: rgba(0,0,0,0.2);
                border-radius: 4px;
            }
            .fab-debug-history-container::-webkit-scrollbar-thumb {
                background: rgba(255,255,255,0.3);
                border-radius: 4px;
            }
        `;
      const styleSheet = document.createElement("style");
      styleSheet.innerText = styles;
      document.head.appendChild(styleSheet);
      const container = document.createElement("div");
      container.id = Config.UI_CONTAINER_ID;
      State.UI.container = container;
      const header = document.createElement("div");
      header.style.cssText = "padding: 8px 12px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;";
      const title = document.createElement("span");
      title.textContent = Utils.getText("app_title");
      title.style.fontWeight = "600";
      const version = document.createElement("span");
      version.textContent = `v${GM_info.script.version}`;
      version.style.cssText = "font-size: 12px; color: var(--text-color-secondary); background: var(--dark-gray); padding: 2px 5px; border-radius: var(--radius-s);";
      header.append(title, version);
      container.appendChild(header);
      const tabContainer = document.createElement("div");
      tabContainer.className = "fab-helper-tabs";
      const tabs = ["dashboard", "settings", "debug"];
      tabs.forEach((tabName) => {
        const btn = document.createElement("button");
        btn.textContent = Utils.getText(`tab_${tabName}`);
        btn.onclick = () => UI5.switchTab(tabName);
        if (tabName === "dashboard") btn.classList.add("active");
        tabContainer.appendChild(btn);
        State.UI.tabs[tabName] = btn;
      });
      container.appendChild(tabContainer);
      const dashboardContent = document.createElement("div");
      dashboardContent.className = "fab-helper-tab-content";
      dashboardContent.style.display = "block";
      State.UI.tabContents.dashboard = dashboardContent;
      const statusBar = document.createElement("div");
      statusBar.className = "fab-helper-status-bar";
      const createStatusItem = /* @__PURE__ */ __name((id, label, icon) => {
        const item = document.createElement("div");
        item.className = "fab-helper-status-item";
        item.innerHTML = `<div class="fab-helper-status-label">${icon} ${label}</div><span id="${id}">0</span>`;
        return item;
      }, "createStatusItem");
      State.UI.statusVisible = createStatusItem("fab-status-visible", Utils.getText("visible"), "\u{1F441}\uFE0F");
      State.UI.statusTodo = createStatusItem("fab-status-todo", Utils.getText("todo"), "\u{1F4E5}");
      State.UI.statusDone = createStatusItem("fab-status-done", Utils.getText("added"), "\u2705");
      State.UI.statusFailed = createStatusItem("fab-status-failed", Utils.getText("failed"), "\u274C");
      State.UI.statusFailed.style.cursor = "pointer";
      State.UI.statusFailed.title = Utils.getText("tooltip_open_failed");
      State.UI.statusFailed.onclick = () => {
        if (State.db.failed.length === 0) {
          Utils.logger("info", Utils.getText("failed_list_empty"));
          return;
        }
        if (window.confirm(Utils.getText("confirm_open_failed", State.db.failed.length))) {
          Utils.logger("info", Utils.getText("opening_failed_items", State.db.failed.length));
          State.db.failed.forEach((task) => {
            GM_openInTab(task.url, { active: false });
          });
        }
      };
      State.UI.statusHidden = createStatusItem("fab-status-hidden", Utils.getText("hidden"), "\u{1F648}");
      statusBar.append(State.UI.statusTodo, State.UI.statusDone, State.UI.statusFailed, State.UI.statusVisible, State.UI.statusHidden);
      State.UI.execBtn = document.createElement("button");
      State.UI.execBtn.className = "fab-helper-execute-btn";
      State.UI.execBtn.onclick = () => TaskRunner3 && TaskRunner3.toggleExecution();
      if (State.isExecuting) {
        State.UI.execBtn.innerHTML = `<span>${Utils.getText("executing")}</span>`;
        State.UI.execBtn.classList.add("executing");
      } else {
        State.UI.execBtn.textContent = Utils.getText("execute");
        State.UI.execBtn.classList.remove("executing");
      }
      const actionButtons = document.createElement("div");
      actionButtons.className = "fab-helper-actions";
      State.UI.syncBtn = document.createElement("button");
      State.UI.syncBtn.textContent = "\u{1F504} " + Utils.getText("sync");
      State.UI.syncBtn.onclick = () => TaskRunner3 && TaskRunner3.refreshVisibleStates();
      State.UI.hideBtn = document.createElement("button");
      State.UI.hideBtn.onclick = () => TaskRunner3 && TaskRunner3.toggleHideSaved();
      actionButtons.append(State.UI.syncBtn, State.UI.hideBtn);
      const logContainer = document.createElement("div");
      logContainer.className = "fab-log-container";
      const logHeader = document.createElement("div");
      logHeader.className = "fab-log-header";
      const logTitle = document.createElement("span");
      logTitle.textContent = Utils.getText("operation_log");
      const logControls = document.createElement("div");
      logControls.className = "fab-log-controls";
      const copyLogBtn = document.createElement("button");
      copyLogBtn.innerHTML = "\u{1F4C4}";
      copyLogBtn.title = Utils.getText("copyLog");
      copyLogBtn.onclick = () => {
        navigator.clipboard.writeText(State.UI.logPanel.innerText).then(() => {
          const originalText = copyLogBtn.textContent;
          copyLogBtn.textContent = "\u2705";
          setTimeout(() => {
            copyLogBtn.textContent = originalText;
          }, 1500);
        }).catch((err) => Utils.logger("error", "Failed to copy log:", err));
      };
      const clearLogBtn = document.createElement("button");
      clearLogBtn.innerHTML = "\u{1F5D1}\uFE0F";
      clearLogBtn.title = Utils.getText("clearLog");
      clearLogBtn.onclick = () => {
        State.UI.logPanel.innerHTML = "";
      };
      logControls.append(copyLogBtn, clearLogBtn);
      logHeader.append(logTitle, logControls);
      State.UI.logPanel = document.createElement("div");
      State.UI.logPanel.id = Config.UI_LOG_ID;
      logContainer.append(logHeader, State.UI.logPanel);
      const positionContainer = document.createElement("div");
      positionContainer.className = "fab-helper-position-container";
      positionContainer.style.cssText = "margin: 8px 0; padding: 6px 8px; background-color: rgba(0,0,0,0.05); border-radius: 4px; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;";
      const positionIcon = document.createElement("span");
      positionIcon.textContent = Utils.getText("position_indicator");
      positionIcon.style.marginRight = "4px";
      const positionInfo = document.createElement("span");
      positionInfo.textContent = Utils.decodeCursor(State.savedCursor);
      State.UI.savedPositionDisplay = positionInfo;
      positionContainer.appendChild(positionIcon);
      positionContainer.appendChild(positionInfo);
      dashboardContent.append(logContainer, positionContainer, statusBar, State.UI.execBtn, actionButtons);
      container.appendChild(dashboardContent);
      const settingsContent = document.createElement("div");
      settingsContent.className = "fab-helper-tab-content";
      settingsContent.style.display = "none";
      const createSettingRow = /* @__PURE__ */ __name((labelText, stateKey) => {
        const row = document.createElement("div");
        row.className = "fab-setting-row";
        const label = document.createElement("span");
        label.className = "fab-setting-label";
        label.textContent = labelText;
        const switchContainer = document.createElement("label");
        switchContainer.className = "fab-toggle-switch";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = State[stateKey];
        input.onchange = (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (!TaskRunner3) return;
          if (stateKey === "autoAddOnScroll") {
            TaskRunner3.toggleAutoAdd();
          } else if (stateKey === "rememberScrollPosition") {
            TaskRunner3.toggleRememberPosition();
          } else if (stateKey === "autoResumeAfter429") {
            TaskRunner3.toggleAutoResume();
          } else if (stateKey === "autoRefreshEmptyPage") {
            TaskRunner3.toggleAutoRefreshEmpty();
          }
          e.target.checked = State[stateKey];
        };
        const slider = document.createElement("span");
        slider.className = "fab-toggle-slider";
        switchContainer.append(input, slider);
        row.append(label, switchContainer);
        return row;
      }, "createSettingRow");
      const autoAddSetting = createSettingRow(Utils.getText("setting_auto_add_scroll"), "autoAddOnScroll");
      settingsContent.appendChild(autoAddSetting);
      const rememberPosSetting = createSettingRow(Utils.getText("setting_remember_position"), "rememberScrollPosition");
      settingsContent.appendChild(rememberPosSetting);
      const autoResumeSetting = createSettingRow(Utils.getText("setting_auto_resume_429"), "autoResumeAfter429");
      settingsContent.appendChild(autoResumeSetting);
      const autoRefreshEmptySetting = createSettingRow(Utils.getText("setting_auto_refresh"), "autoRefreshEmptyPage");
      settingsContent.appendChild(autoRefreshEmptySetting);
      const resetButton = document.createElement("button");
      resetButton.textContent = Utils.getText("clear_all_data");
      resetButton.style.cssText = "width: 100%; margin-top: 15px; background-color: var(--pink); color: white; padding: 10px; border-radius: var(--radius-m); border: none; cursor: pointer;";
      resetButton.onclick = Database.resetAllData;
      settingsContent.appendChild(resetButton);
      const debugModeRow = document.createElement("div");
      debugModeRow.className = "fab-setting-row";
      debugModeRow.title = Utils.getText("setting_debug_tooltip");
      const debugLabel = document.createElement("span");
      debugLabel.className = "fab-setting-label";
      debugLabel.textContent = Utils.getText("debug_mode");
      debugLabel.style.color = "#ff9800";
      const debugSwitchContainer = document.createElement("label");
      debugSwitchContainer.className = "fab-toggle-switch";
      const debugInput = document.createElement("input");
      debugInput.type = "checkbox";
      debugInput.checked = State.debugMode;
      debugInput.onchange = (e) => {
        State.debugMode = e.target.checked;
        debugModeRow.classList.toggle("active", State.debugMode);
        Utils.logger("info", Utils.getText("log_debug_mode_toggle", State.debugMode ? Utils.getText("status_enabled") : Utils.getText("status_disabled")));
        GM_setValue("fab_helper_debug_mode", State.debugMode);
      };
      const debugSlider = document.createElement("span");
      debugSlider.className = "fab-toggle-slider";
      debugSwitchContainer.append(debugInput, debugSlider);
      debugModeRow.append(debugLabel, debugSwitchContainer);
      debugModeRow.classList.toggle("active", State.debugMode);
      settingsContent.appendChild(debugModeRow);
      State.UI.tabContents.settings = settingsContent;
      container.appendChild(settingsContent);
      const debugContent = document.createElement("div");
      debugContent.className = "fab-helper-tab-content";
      debugContent.style.display = "none";
      State.UI.debugContent = debugContent;
      const debugHeader = document.createElement("div");
      debugHeader.style.cssText = "display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px;";
      const debugTitle = document.createElement("h4");
      debugTitle.textContent = Utils.getText("status_history");
      debugTitle.style.cssText = "margin: 0; font-size: 14px; white-space: nowrap;";
      const debugControls = document.createElement("div");
      debugControls.style.cssText = "display: flex; gap: 6px; flex-wrap: wrap;";
      const copyHistoryBtn = document.createElement("button");
      copyHistoryBtn.textContent = Utils.getText("copy_btn");
      copyHistoryBtn.title = "\u590D\u5236\u8BE6\u7EC6\u5386\u53F2\u8BB0\u5F55";
      copyHistoryBtn.style.cssText = "background: var(--dark-gray); border: 1px solid var(--border-color); color: var(--text-color-secondary); padding: 4px 8px; border-radius: var(--radius-m); cursor: pointer;";
      copyHistoryBtn.onclick = () => {
        if (State.statusHistory.length === 0) {
          Utils.logger("info", Utils.getText("no_history_to_copy"));
          return;
        }
        const formatEntry = /* @__PURE__ */ __name((entry) => {
          const date = new Date(entry.endTime).toLocaleString();
          if (entry.type === "STARTUP") {
            return `\u{1F680} ${Utils.getText("script_startup")}
  - ${Utils.getText("time_label")}: ${date}
  - ${Utils.getText("info_label")}: ${entry.message || ""}`;
          } else {
            const type = entry.type === "NORMAL" ? `\u2705 ${Utils.getText("normal_period")}` : `\u{1F6A8} ${Utils.getText("rate_limited_period")}`;
            let details = `${Utils.getText("duration_label")}: ${entry.duration !== void 0 && entry.duration !== null ? entry.duration.toFixed(2) : Utils.getText("unknown_duration")}s`;
            if (entry.requests !== void 0) {
              details += `, ${Utils.getText("requests_label")}: ${entry.requests}${Utils.getText("requests_unit")}`;
            }
            return `${type}
  - ${Utils.getText("ended_at")}: ${date}
  - ${details}`;
          }
        }, "formatEntry");
        const fullLog = State.statusHistory.map(formatEntry).join("\n\n");
        navigator.clipboard.writeText(fullLog).then(() => {
          const originalText = copyHistoryBtn.textContent;
          copyHistoryBtn.textContent = Utils.getText("copied_success");
          setTimeout(() => {
            copyHistoryBtn.textContent = originalText;
          }, 2e3);
        }).catch((err) => Utils.logger("error", Utils.getText("log_copy_failed"), err));
      };
      const clearHistoryBtn = document.createElement("button");
      clearHistoryBtn.textContent = Utils.getText("clear_btn");
      clearHistoryBtn.title = "\u6E05\u7A7A\u5386\u53F2\u8BB0\u5F55";
      clearHistoryBtn.style.cssText = "background: var(--dark-gray); border: 1px solid var(--border-color); color: var(--text-color-secondary); padding: 4px 8px; border-radius: var(--radius-m); cursor: pointer;";
      clearHistoryBtn.onclick = async () => {
        if (window.confirm(Utils.getText("confirm_clear_history"))) {
          State.statusHistory = [];
          await GM_deleteValue(Config.DB_KEYS.STATUS_HISTORY);
          const currentSessionEntry = {
            type: "STARTUP",
            duration: 0,
            endTime: (/* @__PURE__ */ new Date()).toISOString(),
            message: Utils.getText("history_cleared_new_session")
          };
          await RateLimitManager.addToHistory(currentSessionEntry);
          UI5.updateDebugTab();
          Utils.logger("info", Utils.getText("status_history_cleared"));
        }
      };
      const diagnosisBtn = document.createElement("button");
      diagnosisBtn.textContent = Utils.getText("page_diagnosis");
      diagnosisBtn.style.cssText = "background: #2196F3; border: 1px solid #1976D2; color: white; padding: 4px 8px; border-radius: var(--radius-m); cursor: pointer; white-space: nowrap;";
      diagnosisBtn.onclick = () => {
        try {
          const report = PageDiagnostics.diagnoseDetailPage();
          PageDiagnostics.logDiagnosticReport(report);
          Utils.logger("info", Utils.getText("page_diagnosis_complete"));
        } catch (error) {
          Utils.logger("error", Utils.getText("page_diagnosis_failed", error.message));
        }
      };
      debugControls.append(copyHistoryBtn, clearHistoryBtn, diagnosisBtn);
      debugHeader.append(debugTitle, debugControls);
      const historyListContainer = document.createElement("div");
      historyListContainer.style.cssText = "max-height: 250px; overflow-y: auto; background: rgba(10,10,10,0.85); color: #ddd; padding: 8px; border-radius: var(--radius-m);";
      historyListContainer.className = "fab-debug-history-container";
      State.UI.historyContainer = historyListContainer;
      debugContent.append(debugHeader, historyListContainer);
      State.UI.tabContents.debug = debugContent;
      container.appendChild(debugContent);
      document.body.appendChild(container);
      return true;
    }, "create"),
    update: /* @__PURE__ */ __name(() => {
      if (!State.UI.container) return;
      const titleElement = State.UI.container.querySelector('span[style*="font-weight: 600"]');
      if (titleElement) {
        titleElement.textContent = Utils.getText("app_title");
      }
      const tabs = ["dashboard", "settings", "debug"];
      tabs.forEach((tabName) => {
        const tabButton = State.UI.tabs[tabName];
        if (tabButton) {
          tabButton.textContent = Utils.getText(`tab_${tabName}`);
        }
      });
      if (State.UI.syncBtn) {
        State.UI.syncBtn.textContent = "\u{1F504} " + Utils.getText("sync");
      }
      const todoCount = State.db.todo.length;
      const doneCount = State.db.done.length;
      const failedCount = State.db.failed.length;
      const visibleCount = document.querySelectorAll(Config.SELECTORS.card).length - State.hiddenThisPageCount;
      if (State.UI.statusTodo) State.UI.statusTodo.querySelector("span").textContent = todoCount;
      if (State.UI.statusDone) State.UI.statusDone.querySelector("span").textContent = doneCount;
      if (State.UI.statusFailed) State.UI.statusFailed.querySelector("span").textContent = failedCount;
      if (State.UI.statusHidden) State.UI.statusHidden.querySelector("span").textContent = State.hiddenThisPageCount;
      if (State.UI.statusVisible) State.UI.statusVisible.querySelector("span").textContent = visibleCount;
      const statusLabelUpdates = [
        { element: State.UI.statusVisible, icon: "\u{1F441}\uFE0F", key: "visible" },
        { element: State.UI.statusTodo, icon: "\u{1F4E5}", key: "todo" },
        { element: State.UI.statusDone, icon: "\u2705", key: "added" },
        { element: State.UI.statusFailed, icon: "\u274C", key: "failed" },
        { element: State.UI.statusHidden, icon: "\u{1F648}", key: "hidden" }
      ];
      statusLabelUpdates.forEach(({ element, icon, key }) => {
        const labelDiv = element?.querySelector(".fab-helper-status-label");
        if (labelDiv) {
          labelDiv.textContent = `${icon} ${Utils.getText(key)}`;
        }
      });
      if (State.UI.execBtn) {
        if (State.isExecuting) {
          State.UI.execBtn.innerHTML = `<span>${Utils.getText("executing")}</span>`;
          State.UI.execBtn.classList.add("executing");
          if (State.executionTotalTasks > 0) {
            const progress = State.executionCompletedTasks + State.executionFailedTasks;
            const percentage = Math.round(progress / State.executionTotalTasks * 100);
            State.UI.execBtn.title = Utils.getText("tooltip_executing_progress", progress, State.executionTotalTasks, percentage);
          } else {
            State.UI.execBtn.title = Utils.getText("tooltip_executing");
          }
        } else {
          State.UI.execBtn.textContent = Utils.getText("execute");
          State.UI.execBtn.classList.remove("executing");
          State.UI.execBtn.title = Utils.getText("tooltip_start_tasks");
        }
      }
      if (State.UI.hideBtn) {
        State.UI.hideBtn.textContent = (State.hideSaved ? "\u{1F648} " : "\u{1F441}\uFE0F ") + (State.hideSaved ? Utils.getText("show") : Utils.getText("hide"));
      }
    }, "update"),
    removeAllOverlays: /* @__PURE__ */ __name(() => {
      document.querySelectorAll(Config.SELECTORS.card).forEach((card) => {
        const overlay = card.querySelector(".fab-helper-overlay");
        if (overlay) overlay.remove();
        card.style.opacity = "1";
      });
    }, "removeAllOverlays"),
    switchTab: /* @__PURE__ */ __name((tabName) => {
      for (const name in State.UI.tabs) {
        State.UI.tabs[name].classList.toggle("active", name === tabName);
        State.UI.tabContents[name].style.display = name === tabName ? "block" : "none";
      }
      if (tabName === "debug") {
        UI5.updateDebugTab();
      }
    }, "switchTab"),
    updateDebugTab: /* @__PURE__ */ __name(() => {
      if (!State.UI.historyContainer) return;
      State.UI.historyContainer.innerHTML = "";
      const createHistoryItem = /* @__PURE__ */ __name((entry) => {
        const item = document.createElement("div");
        item.style.cssText = "padding: 8px; margin-bottom: 8px; background: rgba(50,50,55,0.5); border-radius: 6px; border-left: 3px solid;";
        if (entry.type === "STARTUP") {
          item.style.borderLeftColor = "#2196F3";
          item.innerHTML = `
                    <div style="font-weight: 500; color: #fff;">\u{1F680} ${Utils.getText("script_startup")}</div>
                    <div style="font-size: 12px; color: var(--text-color-secondary); padding-left: 22px;">
                        <div>${Utils.getText("time_label")}: ${new Date(entry.endTime).toLocaleString()}</div>
                        ${entry.message ? `<div>${Utils.getText("info_label")}: ${entry.message}</div>` : ""}
                    </div>
                `;
        } else {
          const isNormal = entry.type === "NORMAL";
          item.style.borderLeftColor = isNormal ? "var(--green)" : "var(--orange)";
          const icon = isNormal ? "\u2705" : "\u{1F6A8}";
          const title = isNormal ? Utils.getText("normal_period") : Utils.getText("rate_limited_period");
          const durationText = entry.duration !== void 0 && entry.duration !== null ? entry.duration.toFixed(2) : Utils.getText("unknown_duration");
          let detailsHtml = `<div>${Utils.getText("duration_label")}: <strong>${durationText}s</strong></div>`;
          if (entry.requests !== void 0) {
            detailsHtml += `<div>${Utils.getText("requests_label")}: <strong>${entry.requests}</strong>${Utils.getText("requests_unit")}</div>`;
          }
          detailsHtml += `<div>${Utils.getText("ended_at")}: ${new Date(entry.endTime).toLocaleString()}</div>`;
          item.innerHTML = `
                    <div style="font-weight: 500; color: #fff;"><span style="font-size: 18px;">${icon}</span> ${title}</div>
                    <div style="font-size: 12px; color: var(--text-color-secondary); padding-left: 26px;">${detailsHtml}</div>
                `;
        }
        return item;
      }, "createHistoryItem");
      const createCurrentStatusItem = /* @__PURE__ */ __name(() => {
        const item = document.createElement("div");
        item.style.cssText = "padding: 12px; margin-bottom: 10px; background: rgba(0,122,255,0.15); border-radius: 8px; border: 1px solid rgba(0,122,255,0.3);";
        const header = document.createElement("div");
        header.style.cssText = "display: flex; align-items: center; gap: 8px;";
        const icon = State.appStatus === "NORMAL" ? "\u2705" : "\u{1F6A8}";
        const color = State.appStatus === "NORMAL" ? "var(--green)" : "var(--orange)";
        const titleText = State.appStatus === "NORMAL" ? Utils.getText("current_normal") : Utils.getText("current_rate_limited");
        header.innerHTML = `<span style="font-size: 18px;">${icon}</span> <strong style="color: ${color};">${titleText}</strong>`;
        const details = document.createElement("div");
        details.style.cssText = "font-size: 12px; color: var(--text-color-secondary); padding-left: 26px;";
        const startTime = State.appStatus === "NORMAL" ? State.normalStartTime : State.rateLimitStartTime;
        const duration = startTime ? ((Date.now() - startTime) / 1e3).toFixed(2) : Utils.getText("status_unknown_duration");
        let detailsHtml = `<div>${Utils.getText("status_ongoing_label")}<strong>${duration}s</strong></div>`;
        if (State.appStatus === "NORMAL") {
          detailsHtml += `<div>${Utils.getText("status_requests_label")}<strong>${State.successfulSearchCount}</strong></div>`;
        }
        const startTimeDisplay = startTime ? new Date(startTime).toLocaleString() : Utils.getText("status_unknown_time");
        detailsHtml += `<div>${Utils.getText("status_started_at_label")}${startTimeDisplay}</div>`;
        details.innerHTML = detailsHtml;
        item.append(header, details);
        State.UI.historyContainer.appendChild(item);
      }, "createCurrentStatusItem");
      createCurrentStatusItem();
      if (State.statusHistory.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.style.cssText = "color: #888; text-align: center; padding: 20px;";
        emptyMessage.textContent = Utils.getText("no_history");
        State.UI.historyContainer.appendChild(emptyMessage);
        return;
      }
      const reversedHistory = [...State.statusHistory].reverse();
      reversedHistory.forEach((entry) => State.UI.historyContainer.appendChild(createHistoryItem(entry)));
    }, "updateDebugTab")
  };

  // src/index.js
  var currentCountdownInterval = null;
  var currentRefreshTimeout = null;
  function countdownRefresh2(delay, reason = "\u5907\u9009\u65B9\u6848") {
    if (State.isRefreshScheduled) {
      Utils.logger("info", Utils.getText("refresh_plan_exists").replace("(429\u81EA\u52A8\u6062\u590D)", `(${reason})`));
      return;
    }
    State.isRefreshScheduled = true;
    if (currentCountdownInterval) {
      clearInterval(currentCountdownInterval);
      currentCountdownInterval = null;
    }
    if (currentRefreshTimeout) {
      clearTimeout(currentRefreshTimeout);
      currentRefreshTimeout = null;
    }
    const seconds = delay ? (delay / 1e3).toFixed(1) : "\u672A\u77E5";
    Utils.logger("debug", `\u{1F504} ${reason}\u542F\u52A8\uFF01\u5C06\u5728 ${seconds} \u79D2\u540E\u5237\u65B0\u9875\u9762\u5C1D\u8BD5\u6062\u590D...`);
    let remainingSeconds = Math.ceil(delay / 1e3);
    currentCountdownInterval = setInterval(() => {
      remainingSeconds--;
      if (remainingSeconds <= 0) {
        clearInterval(currentCountdownInterval);
        currentCountdownInterval = null;
        Utils.logger("debug", `\u23F1\uFE0F \u5012\u8BA1\u65F6\u7ED3\u675F\uFF0C\u6B63\u5728\u5237\u65B0\u9875\u9762...`);
      } else {
        Utils.logger("debug", Utils.getText("auto_refresh_countdown", remainingSeconds));
        if (!State.isRefreshScheduled) {
          Utils.logger("debug", `\u23F9\uFE0F \u68C0\u6D4B\u5230\u5237\u65B0\u5DF2\u88AB\u53D6\u6D88\uFF0C\u505C\u6B62\u5012\u8BA1\u65F6`);
          clearInterval(currentCountdownInterval);
          currentCountdownInterval = null;
          if (currentRefreshTimeout) {
            clearTimeout(currentRefreshTimeout);
            currentRefreshTimeout = null;
          }
          return;
        }
        if (remainingSeconds % 3 === 0) {
          checkRateLimitStatus().then((isNotLimited) => {
            if (isNotLimited) {
              Utils.logger("debug", `\u23F1\uFE0F \u68C0\u6D4B\u5230API\u9650\u901F\u5DF2\u89E3\u9664\uFF0C\u53D6\u6D88\u5237\u65B0...`);
              clearInterval(currentCountdownInterval);
              currentCountdownInterval = null;
              if (currentRefreshTimeout) {
                clearTimeout(currentRefreshTimeout);
                currentRefreshTimeout = null;
              }
              State.isRefreshScheduled = false;
              if (State.appStatus === "RATE_LIMITED") {
                RateLimitManager.exitRateLimitedState();
              }
              return;
            }
            if (State.appStatus === "RATE_LIMITED") {
              const actualVisibleCount = parseInt(document.getElementById("fab-status-visible")?.textContent || "0");
              if (State.db.todo.length > 0 || State.activeWorkers > 0) {
                clearInterval(currentCountdownInterval);
                clearTimeout(currentRefreshTimeout);
                currentCountdownInterval = null;
                currentRefreshTimeout = null;
                State.isRefreshScheduled = false;
                Utils.logger("info", `\u23F9\uFE0F \u68C0\u6D4B\u5230\u6709 ${State.db.todo.length} \u4E2A\u5F85\u529E\u4EFB\u52A1\u548C ${State.activeWorkers} \u4E2A\u6D3B\u52A8\u5DE5\u4F5C\u7EBF\u7A0B\uFF0C\u5DF2\u53D6\u6D88\u81EA\u52A8\u5237\u65B0\u3002`);
                return;
              }
            } else {
              const visibleCount = parseInt(document.getElementById("fab-status-visible")?.textContent || "0");
              if (State.db.todo.length > 0 || State.activeWorkers > 0 || visibleCount > 0) {
                clearInterval(currentCountdownInterval);
                clearTimeout(currentRefreshTimeout);
                currentCountdownInterval = null;
                currentRefreshTimeout = null;
                State.isRefreshScheduled = false;
                Utils.logger("warn", "\u26A0\uFE0F \u5237\u65B0\u6761\u4EF6\u5DF2\u53D8\u5316\uFF0C\u81EA\u52A8\u5237\u65B0\u5DF2\u53D6\u6D88\u3002");
                return;
              }
            }
          }).catch(() => {
          });
        }
      }
    }, 1e3);
    currentRefreshTimeout = setTimeout(() => {
      const visibleCount = parseInt(document.getElementById("fab-status-visible")?.textContent || "0");
      if (State.appStatus === "RATE_LIMITED") {
        if (State.db.todo.length > 0 || State.activeWorkers > 0) {
          Utils.logger("warn", "\u26A0\uFE0F \u6700\u540E\u4E00\u523B\u68C0\u67E5\uFF1A\u5237\u65B0\u6761\u4EF6\u4E0D\u6EE1\u8DB3\uFF0C\u81EA\u52A8\u5237\u65B0\u5DF2\u53D6\u6D88\u3002");
          State.isRefreshScheduled = false;
          return;
        }
        if (visibleCount === 0) {
          Utils.logger("info", `\u{1F504} \u9875\u9762\u4E0A\u6CA1\u6709\u53EF\u89C1\u5546\u54C1\u4E14\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u5C06\u6267\u884C\u81EA\u52A8\u5237\u65B0\u3002`);
          window.location.href = window.location.href;
        } else {
          State.isRefreshScheduled = false;
          return;
        }
      } else {
        if (State.db.todo.length > 0 || State.activeWorkers > 0 || visibleCount > 0) {
          Utils.logger("warn", "\u26A0\uFE0F \u6700\u540E\u4E00\u523B\u68C0\u67E5\uFF1A\u5237\u65B0\u6761\u4EF6\u4E0D\u6EE1\u8DB3\uFF0C\u81EA\u52A8\u5237\u65B0\u5DF2\u53D6\u6D88\u3002");
          State.isRefreshScheduled = false;
        } else {
          window.location.href = window.location.href;
        }
      }
    }, delay);
  }
  __name(countdownRefresh2, "countdownRefresh");
  async function checkRateLimitStatus() {
    try {
      const totalCards = document.querySelectorAll(Config.SELECTORS.card).length;
      const hiddenCards = document.querySelectorAll(`${Config.SELECTORS.card}[style*="display: none"]`).length;
      const actualVisibleCards = totalCards - hiddenCards;
      const visibleCountElement = document.getElementById("fab-status-visible");
      if (visibleCountElement) {
        visibleCountElement.textContent = actualVisibleCards.toString();
      }
      State.hiddenThisPageCount = hiddenCards;
      if (State.appStatus === "RATE_LIMITED" && actualVisibleCards === 0) {
        return false;
      }
      if (actualVisibleCards === 0 && hiddenCards > 25) {
        return false;
      }
      if (window.performance && window.performance.getEntriesByType) {
        const recentRequests = window.performance.getEntriesByType("resource").filter((r) => r.name.includes("/i/listings/search") || r.name.includes("/i/users/me/listings-states")).filter((r) => Date.now() - r.startTime < 1e4);
        if (recentRequests.length > 0) {
          const has429 = recentRequests.some((r) => r.responseStatus === 429);
          if (has429) return false;
          const hasSuccess = recentRequests.some((r) => r.responseStatus >= 200 && r.responseStatus < 300);
          if (hasSuccess) return true;
        }
        return State.appStatus === "NORMAL";
      }
      return State.appStatus === "NORMAL";
    } catch (error) {
      Utils.logger("error", `\u68C0\u67E5\u9650\u901F\u72B6\u6001\u51FA\u9519: ${error.message}`);
      return false;
    }
  }
  __name(checkRateLimitStatus, "checkRateLimitStatus");
  setUIReference(UI5);
  setUIReference2(UI5);
  setUIReference3(UI5);
  setTaskRunnerReference(TaskRunner2);
  setDependencies({
    UI: UI5,
    TaskRunner: TaskRunner2,
    countdownRefresh: countdownRefresh2
  });
  function setupXHRInterceptor() {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(...args) {
      this._url = args[1];
      return originalOpen.apply(this, args);
    };
    XMLHttpRequest.prototype.send = function(...args) {
      const xhr = this;
      if (xhr._url && typeof xhr._url === "string") {
        xhr.addEventListener("load", function() {
          if (xhr.readyState === 4 && xhr.status === 200) {
            try {
              const responseData = JSON.parse(xhr.responseText);
              if (xhr._url.includes("/i/listings/search") && responseData.results && Array.isArray(responseData.results)) {
                DataCache.saveListings(responseData.results);
              } else if (xhr._url.includes("/i/users/me/listings-states")) {
                if (Array.isArray(responseData)) {
                  DataCache.saveOwnedStatus(responseData);
                } else {
                  const extractedData = API.extractStateData(responseData, "XHRInterceptor");
                  if (Array.isArray(extractedData) && extractedData.length > 0) {
                    DataCache.saveOwnedStatus(extractedData);
                  }
                }
              } else if (xhr._url.includes("/i/listings/prices-infos") && responseData.offers && Array.isArray(responseData.offers)) {
                DataCache.savePrices(responseData.offers);
              }
            } catch (e) {
            }
          }
          if (xhr._url && xhr._url.includes("/i/listings/search")) {
            if (xhr.status === 429) {
              Utils.logger("warn", Utils.getText("detected_api_429_status", xhr._url));
              if (typeof window.enterRateLimitedState === "function") {
                window.enterRateLimitedState();
              }
            }
          }
        });
      }
      return originalSend.apply(this, args);
    };
  }
  __name(setupXHRInterceptor, "setupXHRInterceptor");
  function setupFetchInterceptor() {
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const url = args[0]?.toString() || "";
      if (url.includes("/i/listings/search") || url.includes("/i/users/me/listings-states") || url.includes("/i/listings/prices-infos")) {
        try {
          const response = await originalFetch.apply(this, args);
          if (response.ok) {
            const clonedResponse = response.clone();
            clonedResponse.json().then((data) => {
              if (url.includes("/i/listings/search") && data.results && Array.isArray(data.results)) {
                DataCache.saveListings(data.results);
              } else if (url.includes("/i/users/me/listings-states")) {
                if (Array.isArray(data)) {
                  DataCache.saveOwnedStatus(data);
                } else {
                  const extractedData = API.extractStateData(data, "FetchInterceptor");
                  if (Array.isArray(extractedData) && extractedData.length > 0) {
                    DataCache.saveOwnedStatus(extractedData);
                  }
                }
              } else if (url.includes("/i/listings/prices-infos") && data.offers && Array.isArray(data.offers)) {
                DataCache.savePrices(data.offers);
              }
            }).catch(() => {
            });
          }
          return response;
        } catch (e) {
          return originalFetch.apply(this, args);
        }
      }
      return originalFetch.apply(this, args);
    };
  }
  __name(setupFetchInterceptor, "setupFetchInterceptor");
  function setupRequestInterceptors() {
    try {
      setupXHRInterceptor();
      setupFetchInterceptor();
      setInterval(() => DataCache.cleanupExpired(), 6e4);
      Utils.logger("debug", "\u8BF7\u6C42\u62E6\u622A\u548C\u7F13\u5B58\u7CFB\u7EDF\u5DF2\u521D\u59CB\u5316");
    } catch (e) {
      Utils.logger("error", `\u521D\u59CB\u5316\u8BF7\u6C42\u62E6\u622A\u5668\u5931\u8D25: ${e.message}`);
    }
  }
  __name(setupRequestInterceptors, "setupRequestInterceptors");
  async function runDomDependentPart() {
    if (State.hasRunDomPart) return;
    if (State.isWorkerTab) {
      State.hasRunDomPart = true;
      return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("workerId")) {
      Utils.logger("debug", `\u5DE5\u4F5C\u6807\u7B7E\u9875DOM\u90E8\u5206\u521D\u59CB\u5316\uFF0C\u8DF3\u8FC7UI\u521B\u5EFA`);
      State.hasRunDomPart = true;
      return;
    }
    const uiCreated = UI5.create();
    if (!uiCreated) {
      Utils.logger("info", Utils.getText("log_detail_page"));
      State.hasRunDomPart = true;
      return;
    }
    UI5.update();
    UI5.updateDebugTab();
    UI5.switchTab("dashboard");
    State.hasRunDomPart = true;
    window.enterRateLimitedState = function(source = Utils.getText("rate_limit_source_global_call")) {
      RateLimitManager.enterRateLimitedState(source);
    };
    window.recordNetworkRequest = function(source = "\u7F51\u7EDC\u8BF7\u6C42", hasResults = true) {
      if (hasResults) {
        RateLimitManager.recordSuccessfulRequest(source, hasResults);
      }
    };
    setInterval(() => {
      if (State.appStatus === "NORMAL") {
        const pageText = document.body.innerText || "";
        if (pageText.includes("Too many requests") || pageText.includes("rate limit") || pageText.match(/\{\s*"detail"\s*:\s*"Too many requests"\s*\}/i)) {
          Utils.logger("warn", Utils.getText("page_content_rate_limit_detected"));
          RateLimitManager.enterRateLimitedState(Utils.getText("rate_limit_source_page_content"));
        }
      }
    }, 5e3);
    const checkIsErrorPage = /* @__PURE__ */ __name((title, text) => {
      const isCloudflareTitle = title.includes("Cloudflare") || title.includes("Attention Required");
      const is429Text = text.includes("429") || text.includes("Too Many Requests") || text.includes("Too many requests");
      if (isCloudflareTitle || is429Text) {
        Utils.logger("warn", `[\u9875\u9762\u52A0\u8F7D] \u68C0\u6D4B\u5230429\u9519\u8BEF\u9875\u9762`);
        window.enterRateLimitedState("\u9875\u9762\u5185\u5BB9429\u68C0\u6D4B");
        return true;
      }
      return false;
    }, "checkIsErrorPage");
    checkIsErrorPage(document.title, document.body.innerText || "");
    if (State.appStatus === "RATE_LIMITED") {
      Utils.logger("debug", Utils.getText("log_auto_resume_page_loading"));
      const isRecovered = await RateLimitManager.checkRateLimitStatus();
      if (isRecovered) {
        Utils.logger("info", Utils.getText("log_recovery_probe_success"));
        if (State.db.todo.length > 0 && !State.isExecuting) {
          Utils.logger("info", Utils.getText("log_found_todo_auto_resume", State.db.todo.length));
          State.isExecuting = true;
          Database.saveExecutingState();
          TaskRunner2.executeBatch();
        }
      } else {
        Utils.logger("warn", Utils.getText("log_recovery_probe_failed"));
        if (State.activeWorkers === 0 && State.db.todo.length === 0) {
          const randomDelay = 5e3 + Math.random() * 1e4;
          countdownRefresh2(randomDelay, Utils.getText("countdown_refresh_source"));
        }
      }
    }
    const containerSelectors = ["main", "#main", ".AssetGrid-root", ".fabkit-responsive-grid-container"];
    let targetNode = null;
    for (const selector of containerSelectors) {
      targetNode = document.querySelector(selector);
      if (targetNode) break;
    }
    if (!targetNode) targetNode = document.body;
    const observer = new MutationObserver((mutationsList) => {
      const hasNewContent = mutationsList.some(
        (mutation) => [...mutation.addedNodes].some(
          (node) => node.nodeType === 1 && (node.matches(Config.SELECTORS.card) || node.querySelector(Config.SELECTORS.card))
        )
      );
      if (hasNewContent) {
        clearTimeout(State.observerDebounceTimer);
        State.observerDebounceTimer = setTimeout(() => {
          if (State.debugMode) {
            Utils.logger("debug", `[Observer] ${Utils.getText("debug_new_content_loading")}`);
          }
          setTimeout(() => {
            TaskRunner2.checkVisibleCardsStatus().then(() => {
              setTimeout(() => {
                if (State.hideSaved) {
                  TaskRunner2.runHideOrShow();
                }
              }, 1e3);
              if (State.appStatus === "NORMAL" || State.autoAddOnScroll) {
                setTimeout(() => {
                  TaskRunner2.scanAndAddTasks(document.querySelectorAll(Config.SELECTORS.card)).catch((error) => Utils.logger("error", `\u81EA\u52A8\u6DFB\u52A0\u4EFB\u52A1\u5931\u8D25: ${error.message}`));
                }, 500);
              }
            }).catch(() => {
              setTimeout(() => {
                if (State.hideSaved) {
                  TaskRunner2.runHideOrShow();
                }
              }, 1500);
            });
          }, 2e3);
        }, 500);
      }
    });
    observer.observe(targetNode, { childList: true, subtree: true });
    Utils.logger("debug", `\u2705 Core DOM observer is now active on <${targetNode.tagName.toLowerCase()}>.`);
    TaskRunner2.runHideOrShow();
    setInterval(() => {
      if (!State.hideSaved) return;
      const cards = document.querySelectorAll(Config.SELECTORS.card);
      let unprocessedCount = 0;
      cards.forEach((card) => {
        const isProcessed = card.getAttribute("data-fab-processed") === "true";
        if (!isProcessed) {
          unprocessedCount++;
        } else {
          const isFinished = TaskRunner2.isCardFinished(card);
          const shouldBeHidden = isFinished && State.hideSaved;
          const isHidden = card.style.display === "none";
          if (shouldBeHidden !== isHidden) {
            card.removeAttribute("data-fab-processed");
            unprocessedCount++;
          }
        }
      });
      if (unprocessedCount > 0) {
        if (State.debugMode) {
          Utils.logger("debug", Utils.getText("debug_unprocessed_cards", unprocessedCount));
        }
        TaskRunner2.runHideOrShow();
      }
    }, 3e3);
    setInterval(() => {
      if (State.db.todo.length === 0) return;
      const initialTodoCount = State.db.todo.length;
      State.db.todo = State.db.todo.filter((task) => {
        const url = task.url.split("?")[0];
        return !State.db.done.includes(url);
      });
      if (State.db.todo.length < initialTodoCount) {
        Utils.logger("info", `[\u81EA\u52A8\u6E05\u7406] \u4ECE\u5F85\u529E\u5217\u8868\u4E2D\u79FB\u9664\u4E86 ${initialTodoCount - State.db.todo.length} \u4E2A\u5DF2\u5B8C\u6210\u7684\u4EFB\u52A1\u3002`);
        UI5.update();
      }
    }, 1e4);
    let lastCardCount = document.querySelectorAll(Config.SELECTORS.card).length;
    let noNewCardsCounter = 0;
    let lastScrollY = window.scrollY;
    setInterval(() => {
      if (State.appStatus !== "NORMAL") return;
      const currentCardCount = document.querySelectorAll(Config.SELECTORS.card).length;
      if (window.scrollY > lastScrollY + 100 && currentCardCount === lastCardCount) {
        noNewCardsCounter++;
        if (noNewCardsCounter >= 3) {
          Utils.logger("warn", `${Utils.getText("implicit_rate_limit_detection")}`);
          RateLimitManager.enterRateLimitedState(Utils.getText("source_implicit_rate_limit"));
          noNewCardsCounter = 0;
        }
      } else if (currentCardCount > lastCardCount) {
        noNewCardsCounter = 0;
      }
      lastCardCount = currentCardCount;
      lastScrollY = window.scrollY;
    }, 5e3);
    setInterval(async () => {
      try {
        const totalCards = document.querySelectorAll(Config.SELECTORS.card).length;
        const visibleCards = Array.from(document.querySelectorAll(Config.SELECTORS.card)).filter((card) => {
          if (card.style.display === "none") return false;
          const computedStyle = window.getComputedStyle(card);
          return computedStyle.display !== "none" && computedStyle.visibility !== "hidden";
        });
        const actualVisibleCards = visibleCards.length;
        const hiddenCards = totalCards - actualVisibleCards;
        const visibleCountElement = document.getElementById("fab-status-visible");
        if (visibleCountElement) {
          visibleCountElement.textContent = actualVisibleCards.toString();
        }
        State.hiddenThisPageCount = hiddenCards;
        if (State.appStatus === "RATE_LIMITED" && actualVisibleCards === 0 && State.autoRefreshEmptyPage) {
          if (!window._pendingZeroVisibleRefresh && !currentCountdownInterval && !currentRefreshTimeout) {
            Utils.logger("info", `[\u72B6\u6001\u76D1\u63A7] \u68C0\u6D4B\u5230\u9650\u901F\u72B6\u6001\u4E0B\u6CA1\u6709\u53EF\u89C1\u5546\u54C1\u4E14\u81EA\u52A8\u5237\u65B0\u5DF2\u5F00\u542F\uFF0C\u51C6\u5907\u5237\u65B0\u9875\u9762`);
            const randomDelay = 3e3 + Math.random() * 2e3;
            countdownRefresh2(randomDelay, "\u9650\u901F\u72B6\u6001\u65E0\u53EF\u89C1\u5546\u54C1");
          }
        }
      } catch (error) {
        Utils.logger("error", `\u9875\u9762\u72B6\u6001\u68C0\u67E5\u51FA\u9519: ${error.message}`);
      }
    }, 1e4);
    setInterval(() => {
      if (State.db.todo.length === 0) return;
      TaskRunner2.ensureTasksAreExecuted();
    }, 5e3);
    setInterval(async () => {
      try {
        if (State.appStatus !== "NORMAL") return;
        if (window.performance && window.performance.getEntriesByType) {
          const navigationEntries = window.performance.getEntriesByType("navigation");
          if (navigationEntries && navigationEntries.length > 0) {
            const lastNavigation = navigationEntries[0];
            if (lastNavigation.responseStatus === 429) {
              Utils.logger("warn", `[HTTP\u72B6\u6001\u68C0\u6D4B] \u68C0\u6D4B\u5230\u5BFC\u822A\u8BF7\u6C42\u72B6\u6001\u7801\u4E3A429\uFF01`);
              if (typeof window.enterRateLimitedState === "function") {
                window.enterRateLimitedState();
              }
            }
          }
        }
      } catch (error) {
      }
    }, 1e4);
  }
  __name(runDomDependentPart, "runDomDependentPart");
  function ensureUILoaded() {
    if (!document.getElementById(Config.UI_CONTAINER_ID)) {
      Utils.logger("warn", "\u68C0\u6D4B\u5230UI\u672A\u52A0\u8F7D\uFF0C\u5C1D\u8BD5\u91CD\u65B0\u521D\u59CB\u5316...");
      setTimeout(() => {
        try {
          runDomDependentPart();
        } catch (error) {
          Utils.logger("error", `UI\u91CD\u65B0\u521D\u59CB\u5316\u5931\u8D25: ${error.message}`);
        }
      }, 1e3);
    }
  }
  __name(ensureUILoaded, "ensureUILoaded");
  async function main() {
    window.pageLoadTime = Date.now();
    Utils.logger("info", Utils.getText("log_script_starting"));
    Utils.detectLanguage();
    const isLoggedIn = Utils.checkAuthentication(true);
    if (!isLoggedIn) {
      Utils.logger("warn", "\u8D26\u53F7\u672A\u767B\u5F55\uFF0C\u90E8\u5206\u529F\u80FD\u53EF\u80FD\u53D7\u9650");
    }
    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get("workerId");
    if (workerId) {
      State.isWorkerTab = true;
      State.workerTaskId = workerId;
      await InstanceManager.init();
      Utils.logger("info", `\u5DE5\u4F5C\u6807\u7B7E\u9875\u521D\u59CB\u5316\u5B8C\u6210\uFF0C\u5F00\u59CB\u5904\u7406\u4EFB\u52A1...`);
      await TaskRunner2.processDetailPage();
      return;
    }
    await InstanceManager.init();
    await Database.load();
    const storedExecutingState = await GM_getValue(Config.DB_KEYS.IS_EXECUTING, false);
    if (State.isExecuting !== storedExecutingState) {
      Utils.logger("info", Utils.getText("log_execution_state_inconsistent", storedExecutingState ? "\u6267\u884C\u4E2D" : "\u5DF2\u505C\u6B62"));
      State.isExecuting = storedExecutingState;
    }
    const persistedStatus = await GM_getValue(Config.DB_KEYS.APP_STATUS);
    if (persistedStatus && persistedStatus.status === "RATE_LIMITED") {
      State.appStatus = "RATE_LIMITED";
      State.rateLimitStartTime = persistedStatus.startTime;
      const previousDuration = persistedStatus && persistedStatus.startTime ? ((Date.now() - persistedStatus.startTime) / 1e3).toFixed(2) : "0.00";
      Utils.logger("warn", Utils.getText("startup_rate_limited", previousDuration, persistedStatus.source || Utils.getText("status_unknown_source")));
    }
    setupRequestInterceptors();
    await PagePatcher.init();
    const tempTasks = await GM_getValue("temp_todo_tasks", null);
    if (tempTasks && tempTasks.length > 0) {
      Utils.logger("info", `\u4ECE429\u6062\u590D\uFF1A\u627E\u5230 ${tempTasks.length} \u4E2A\u4E34\u65F6\u4FDD\u5B58\u7684\u5F85\u529E\u4EFB\u52A1\uFF0C\u6B63\u5728\u6062\u590D...`);
      State.db.todo = tempTasks;
      await GM_deleteValue("temp_todo_tasks");
    }
    State.valueChangeListeners.push(GM_addValueChangeListener(Config.DB_KEYS.WORKER_DONE, async (key, oldValue, newValue) => {
      if (!newValue) return;
      try {
        await GM_deleteValue(Config.DB_KEYS.WORKER_DONE);
        const { workerId: workerId2, success, task, logs, instanceId, executionTime } = newValue;
        if (instanceId !== Config.INSTANCE_ID) {
          Utils.logger("info", `\u6536\u5230\u6765\u81EA\u5176\u4ED6\u5B9E\u4F8B [${instanceId}] \u7684\u5DE5\u4F5C\u62A5\u544A\uFF0C\u5F53\u524D\u5B9E\u4F8B [${Config.INSTANCE_ID}] \u5C06\u5FFD\u7565\u3002`);
          return;
        }
        if (!workerId2 || !task) {
          Utils.logger("error", "\u6536\u5230\u65E0\u6548\u7684\u5DE5\u4F5C\u62A5\u544A\u3002\u7F3A\u5C11workerId\u6216task\u3002");
          return;
        }
        if (executionTime) {
          Utils.logger("info", Utils.getText("task_execution_time", executionTime ? (executionTime / 1e3).toFixed(2) : Utils.getText("status_unknown_duration")));
        }
        if (State.runningWorkers[workerId2]) {
          delete State.runningWorkers[workerId2];
          State.activeWorkers--;
        }
        if (logs && logs.length) {
          logs.forEach((log) => Utils.logger("info", log));
        }
        if (success) {
          Utils.logger("info", `\u2705 \u4EFB\u52A1\u5B8C\u6210: ${task.name}`);
          await Database.markAsDone(task);
          State.sessionCompleted.add(task.url);
          State.executionCompletedTasks++;
        } else {
          Utils.logger("warn", `\u274C \u4EFB\u52A1\u5931\u8D25: ${task.name}`);
          await Database.markAsFailed(task, {
            reason: "\u5DE5\u4F5C\u6807\u7B7E\u9875\u62A5\u544A\u5931\u8D25",
            logs: logs || [],
            details: {
              executionTime: executionTime ? `${(executionTime / 1e3).toFixed(2)}s` : "\u672A\u77E5",
              workerId: workerId2,
              instanceId
            }
          });
          State.executionFailedTasks++;
        }
        UI5.update();
        if (State.isExecuting && State.activeWorkers < Config.MAX_CONCURRENT_WORKERS && State.db.todo.length > 0) {
          setTimeout(() => TaskRunner2.executeBatch(), 1e3);
        }
        if (State.isExecuting && State.db.todo.length === 0 && State.activeWorkers === 0) {
          Utils.logger("info", "\u6240\u6709\u4EFB\u52A1\u5DF2\u5B8C\u6210\u3002");
          State.isExecuting = false;
          Database.saveExecutingState();
          await Database.saveTodo();
          if (State.appStatus === "RATE_LIMITED") {
            Utils.logger("info", "\u6240\u6709\u4EFB\u52A1\u5DF2\u5B8C\u6210\uFF0C\u4E14\u5904\u4E8E\u9650\u901F\u72B6\u6001\uFF0C\u5C06\u5237\u65B0\u9875\u9762\u5C1D\u8BD5\u6062\u590D...");
            const randomDelay = 3e3 + Math.random() * 5e3;
            countdownRefresh2(randomDelay, "\u4EFB\u52A1\u5B8C\u6210\u540E\u9650\u901F\u6062\u590D");
          }
          UI5.update();
        }
        TaskRunner2.runHideOrShow();
      } catch (error) {
        Utils.logger("error", `\u5904\u7406\u5DE5\u4F5C\u62A5\u544A\u65F6\u51FA\u9519: ${error.message}`);
      }
    }));
    State.valueChangeListeners.push(GM_addValueChangeListener(Config.DB_KEYS.IS_EXECUTING, (key, oldValue, newValue) => {
      if (!State.isWorkerTab && State.isExecuting !== newValue) {
        Utils.logger("info", Utils.getText("execution_status_changed", newValue ? Utils.getText("status_executing") : Utils.getText("status_stopped")));
        State.isExecuting = newValue;
        UI5.update();
      }
    }));
    window._fabHelperLauncherActive = window._fabHelperLauncherActive || false;
    if (!window._fabHelperLauncherActive) {
      window._fabHelperLauncherActive = true;
      const launcherInterval = setInterval(() => {
        if (document.readyState === "interactive" || document.readyState === "complete") {
          if (!State.hasRunDomPart) {
            Utils.logger("info", "[Launcher] DOM is ready. Running main script logic...");
            (async () => {
              try {
                await runDomDependentPart();
              } catch (e) {
                Utils.logger("error", `[Launcher] Error in runDomDependentPart: ${e.message}`);
                console.error("[Fab Helper] runDomDependentPart error:", e);
                State.hasRunDomPart = true;
              }
            })();
          }
          if (State.hasRunDomPart) {
            clearInterval(launcherInterval);
            window._fabHelperLauncherActive = false;
            Utils.logger("debug", "[Launcher] Main logic has been launched or skipped. Launcher is now idle.");
          }
        }
      }, 500);
    }
    let lastNetworkActivityTime = Date.now();
    window.recordNetworkActivity = function() {
      lastNetworkActivityTime = Date.now();
    };
    setInterval(() => {
      if (State.appStatus === "RATE_LIMITED") {
        const inactiveTime = Date.now() - lastNetworkActivityTime;
        if (inactiveTime > 3e4) {
          Utils.logger("warn", `\u26A0\uFE0F \u68C0\u6D4B\u5230\u5728\u9650\u901F\u72B6\u6001\u4E0B ${Math.floor(inactiveTime / 1e3)} \u79D2\u65E0\u7F51\u7EDC\u6D3B\u52A8\uFF0C\u5373\u5C06\u5F3A\u5236\u5237\u65B0\u9875\u9762...`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    }, 5e3);
    Utils.logger("info", Utils.getText("log_init"));
  }
  __name(main, "main");
  window.addEventListener("beforeunload", () => {
    InstanceManager.cleanup();
    Utils.cleanup();
  });
  window.addEventListener("load", () => {
    setTimeout(ensureUILoaded, 2e3);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      setTimeout(ensureUILoaded, 500);
    }
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", main);
  } else {
    main();
  }
})();

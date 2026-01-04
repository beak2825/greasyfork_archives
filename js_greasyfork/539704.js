// ==UserScript==
// @name         页面元素拖拽器
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  允许拖拽页面中的任意元素到新位置，支持实时距离显示、尺寸调整、磁性对齐和兄弟元素距离测量。修复了元素位置重置为0的问题，兄弟元素距离线在检测范围内始终可见。
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539704/%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E6%8B%96%E6%8B%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/539704/%E9%A1%B5%E9%9D%A2%E5%85%83%E7%B4%A0%E6%8B%96%E6%8B%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let isDragMode = false;
  let draggedElement = null;
  let startX = 0;
  let startY = 0;
  let startLeft = 0;
  let startTop = 0;
  let controlPanel = null;
  let showDistance = true;
  let enableResize = true;
  let enableMagneticAlign = true;
  let resizeMode = null; // 'move', 'resize-e', 'resize-s', 'resize-se', etc.
  let startWidth = 0;
  let startHeight = 0;
  let originalWidthUnit = "px";
  let originalHeightUnit = "px";
  let originalWidthValue = 0;
  let originalHeightValue = 0;
  let isHorizontalCentered = false;
  let isVerticalCentered = false;
  let centerTolerance = 15; // 触发居中的距离阈值（增强到15px）
  let lockTolerance = 5; // 锁定状态下的容差范围（增强到5px）
  let previewTolerance = 25; // 预览辅助线的距离阈值

  // 兄弟元素对齐相关变量
  let siblingAlignTolerance = 15; // 兄弟元素对齐触发阈值（10-15px）
  let siblingLockTolerance = 5; // 兄弟元素对齐锁定容差（3-5px）
  let siblingDetectionRange = 200; // 兄弟元素检测范围（200px）
  let siblingDistanceDisplayLimit = 200; // 兄弟元素距离线显示限制（与检测范围一致）
  let maxSiblingDistanceLines = 8; // 同时显示的兄弟距离线最大数量（防止视觉混乱）
  let alignedSiblings = []; // 当前对齐的兄弟元素

  // 左边缘对齐增强变量
  let leftEdgeAlignTolerance = 15; // 左边缘对齐触发阈值（10-15px）
  let leftEdgeLockTolerance = 5; // 左边缘对齐锁定容差（3-5px）
  let isLeftEdgeAligned = false; // 当前是否处于左边缘对齐状态
  let leftEdgeAlignmentTargets = []; // 左边缘对齐目标列表

  // 边缘到边缘对齐变量（水平）
  let edgeToEdgeAlignTolerance = 15; // 边缘到边缘对齐触发阈值（10-15px）
  let edgeToEdgeLockTolerance = 5; // 边缘到边缘对齐锁定容差（3-5px）
  let isEdgeToEdgeAligned = false; // 当前是否处于边缘到边缘对齐状态
  let edgeToEdgeAlignmentTargets = []; // 边缘到边缘对齐目标列表
  let edgeToEdgeAlignmentType = null; // 对齐类型：'right-to-left' 或 'left-to-right'

  // 垂直边缘到边缘对齐变量
  let verticalEdgeToEdgeAlignTolerance = 15; // 垂直边缘到边缘对齐触发阈值（10-15px）
  let verticalEdgeToEdgeLockTolerance = 5; // 垂直边缘到边缘对齐锁定容差（3-5px）
  let isVerticalEdgeToEdgeAligned = false; // 当前是否处于垂直边缘到边缘对齐状态
  let verticalEdgeToEdgeAlignmentTargets = []; // 垂直边缘到边缘对齐目标列表
  let verticalEdgeToEdgeAlignmentType = null; // 对齐类型：'bottom-to-top' 或 'top-to-bottom'

  // 同边缘对齐变量
  let sameEdgeAlignTolerance = 15; // 同边缘对齐触发阈值（10-15px）
  let sameEdgeLockTolerance = 5; // 同边缘对齐锁定容差（3-5px）
  let isSameEdgeAligned = false; // 当前是否处于同边缘对齐状态
  let sameEdgeAlignmentTargets = []; // 同边缘对齐目标列表
  let sameEdgeAlignmentType = null; // 对齐类型：'top-to-top' 或 'bottom-to-bottom'

  // 父元素边界对齐变量
  let parentBoundaryAlignTolerance = 15; // 父边界对齐触发阈值（10-15px）
  let parentBoundaryLockTolerance = 5; // 父边界对齐锁定容差（3-5px）
  let isParentBoundaryAligned = false; // 当前是否处于父边界对齐状态
  let parentBoundaryAlignmentType = null; // 对齐类型：'left', 'top', 'right', 'bottom'
  let parentBoundaryTarget = null; // 父边界对齐目标信息

  // 元素定位上下文变量
  let elementPositioningContext = null; // 当前拖拽元素的定位上下文信息

  // 双击激活相关变量
  let activeElement = null; // 当前激活的元素
  let lastClickTime = 0; // 上次点击时间
  let lastClickTarget = null; // 上次点击的目标
  let doubleClickDelay = 300; // 双击检测延迟（毫秒）

  // 层级检查器面板变量
  let inspectorPanel = null; // 检查器面板元素
  let isInspectorVisible = false; // 检查器面板是否可见
  let isInspectorMinimized = false; // 检查器面板是否最小化
  let lastInspectedElement = null; // 最后检查的元素（用于记忆）

  // 复制功能变量
  let copyFormat = "css"; // 复制格式：'css', 'json', 'values'
  let copyButton = null; // 复制按钮元素
  let formatSelector = null; // 格式选择器元素

  // 创建控制面板
  function createControlPanel() {
    const panel = document.createElement("div");
    panel.id = "drag-control-panel";
    panel.style.cssText =
      "background: #333; color: white; padding: 10px; border-radius: 5px; position: fixed; top: 20px; left: calc(100vw - 320px); z-index: 10000; font-family: Arial, sans-serif; box-shadow: 0 2px 10px rgba(0,0,0,0.3);";
    panel.innerHTML = `
                <div id="panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; cursor: move; user-select: none;">
                    <h4 style="margin: 0; font-size: 14px; pointer-events: none;">元素拖拽器</h4>
                    <button id="minimize-panel" style="background: #607D8B; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; font-weight: bold;" title="最小化面板">−</button>
                </div>

                <!-- 可隐藏的按钮容器 -->
                <div id="panel-buttons" style="transition: all 0.3s ease-in-out;">
                    <div style="margin-bottom: 10px;">
                        <button id="toggle-drag-mode" style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">开启拖拽</button>
                        <button id="reset-positions" style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;">重置位置</button>
                        <button id="copy-styles" style="background: #9c27b0; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;" disabled title="复制当前激活元素的样式">📋 复制样式</button>
                        <button id="toggle-inspector" style="background: #3498db; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-right: 5px;" disabled title="显示/隐藏层级检查器">🔍 检查器</button>
                        <select id="copy-format" style="background: #555; color: white; border: 1px solid #777; padding: 3px 5px; border-radius: 3px; font-size: 11px;">
                            <option value="css">CSS格式</option>
                            <option value="json">JSON格式</option>
                            <option value="values">数值格式</option>
                        </select>
                    </div>

                    <!-- 功能选项 -->
                    <div style="margin-top: 10px;">
                        <label style="font-size: 12px; display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="toggle-distance" checked style="margin-right: 5px;">
                            显示距离
                        </label>
                        <label style="font-size: 12px; display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="toggle-resize" checked style="margin-right: 5px;">
                            调整尺寸
                        </label>
                        <label style="font-size: 12px; display: flex; align-items: center; margin-bottom: 5px;">
                            <input type="checkbox" id="toggle-magnetic" checked style="margin-right: 5px;">
                            磁性对齐
                        </label>
                    </div>

                    <!-- 状态显示 -->
                    <div style="margin-top: 5px; font-size: 12px; opacity: 0.8;">
                        状态: <span id="drag-status">关闭</span>
                    </div>

                    <!-- 实时信息显示面板 -->
                    <div id="real-time-info" style="margin-top: 10px; padding: 8px; background: rgba(255,255,255,0.1); border-radius: 4px; border-top: 1px solid rgba(255,255,255,0.2); display: none;">
                        <div style="font-size: 11px; font-weight: bold; margin-bottom: 6px; color: #ffd700;">📊 实时信息</div>

                        <!-- 元素信息 -->
                        <div id="element-info" style="margin-bottom: 6px;">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">元素:</div>
                            <div id="element-details" style="font-size: 10px; font-family: monospace; color: #fff;"></div>
                        </div>

                        <!-- 位置信息 -->
                        <div id="position-info" style="margin-bottom: 6px;">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">位置:</div>
                            <div id="position-inputs" style="display: flex; gap: 8px; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <label id="position-label-1" style="font-size: 9px; color: #ccc; min-width: 20px;">X:</label>
                                    <input id="position-input-1" type="text" style="width: 45px; height: 16px; font-size: 9px; font-family: monospace; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 2px; color: #fff; padding: 1px 3px;" placeholder="0px">
                                </div>
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <label id="position-label-2" style="font-size: 9px; color: #ccc; min-width: 20px;">Y:</label>
                                    <input id="position-input-2" type="text" style="width: 45px; height: 16px; font-size: 9px; font-family: monospace; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 2px; color: #fff; padding: 1px 3px;" placeholder="0px">
                                </div>
                            </div>
                        </div>

                        <!-- 尺寸信息 -->
                        <div id="size-info" style="margin-bottom: 6px;">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">尺寸:</div>
                            <div id="size-inputs" style="display: flex; gap: 8px; align-items: center;">
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <label id="size-label-1" style="font-size: 9px; color: #ccc; min-width: 20px;">w:</label>
                                    <input id="size-input-1" type="text" style="width: 45px; height: 16px; font-size: 9px; font-family: monospace; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 2px; color: #fff; padding: 1px 3px;" placeholder="auto">
                                </div>
                                <div style="display: flex; align-items: center; gap: 2px;">
                                    <label id="size-label-2" style="font-size: 9px; color: #ccc; min-width: 20px;">h:</label>
                                    <input id="size-input-2" type="text" style="width: 45px; height: 16px; font-size: 9px; font-family: monospace; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.3); border-radius: 2px; color: #fff; padding: 1px 3px;" placeholder="auto">
                                </div>
                            </div>
                        </div>

                        <!-- 操作模式 -->
                        <div id="mode-info" style="margin-bottom: 6px;">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">模式:</div>
                            <div id="mode-details" style="font-size: 10px; font-family: monospace; color: #fff;"></div>
                        </div>

                        <!-- 定位上下文 -->
                        <div id="context-info" style="margin-bottom: 6px;">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">定位:</div>
                            <div id="context-details" style="font-size: 10px; font-family: monospace; color: #fff;"></div>
                        </div>

                        <!-- 磁性对齐状态 -->
                        <div id="alignment-info">
                            <div style="font-size: 10px; color: #ccc; margin-bottom: 2px;">对齐:</div>
                            <div id="alignment-details" style="font-size: 10px; font-family: monospace; color: #fff;"></div>
                        </div>
                    </div>
                </div> <!-- 结束可隐藏的按钮容器 -->
        `;
    document.body.appendChild(panel);
    return panel;
  }

  // 添加样式
  function addStyles() {
    const style = document.createElement("style");
    style.textContent = `
            .drag-highlight {
                outline: 2px dashed #4CAF50 !important;
                outline-offset: 2px !important;
                cursor: move !important;
            }

            /* 激活元素的拖拽高亮样式 */
            .element-active.drag-highlight {
                outline: 3px solid #4CAF50 !important;
                outline-offset: 2px !important;
                cursor: move !important;
            }

            /* 未激活元素的高亮样式 */
            .drag-highlight:not(.element-active) {
                outline: 2px dashed #9e9e9e !important;
                outline-offset: 2px !important;
                cursor: pointer !important;
                opacity: 0.8;
                position: relative;
            }

            .drag-highlight:not(.element-active)::after {
                content: "💡 双击激活";
                position: absolute;
                top: -25px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 11px;
                font-weight: bold;
                white-space: nowrap;
                z-index: 1000;
                pointer-events: none;
            }
            .resize-highlight {
                outline: 2px dashed #2196F3 !important;
                outline-offset: 2px !important;
            }
            .resize-highlight-corner {
                outline: 2px dashed #FF9800 !important;
                outline-offset: 2px !important;
            }
            .drag-active {
                opacity: 0.8 !important;
                z-index: 9999 !important;
            }
            .drag-mode-active * {
                cursor: move !important;
            }
            .distance-indicator {
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
                z-index: 10001;
                pointer-events: none;
                white-space: nowrap;
            }
            .distance-line {
                position: fixed;
                background: #ff6b6b;
                z-index: 9998;
                pointer-events: none;
            }
            .distance-line.horizontal {
                height: 1px;
            }
            .distance-line.vertical {
                width: 1px;
            }
            .nearby-element-highlight {
                outline: 1px solid #ff6b6b !important;
                outline-offset: 1px !important;
            }
            .resize-handle {
                position: absolute;
                background: rgba(74, 144, 226, 0.3);
                border: 1px solid #4a90e2;
                z-index: 10000;
                pointer-events: none;
            }
            .resize-handle.active {
                background: rgba(74, 144, 226, 0.6);
            }
            .size-indicator {
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-family: monospace;
                z-index: 10002;
                pointer-events: none;
                white-space: nowrap;
            }
            .center-guide-line {
                position: fixed;
                background: #00ff00;
                z-index: 9999;
                pointer-events: none;
                opacity: 1;
                animation: centerLinePulse 1s ease-in-out infinite alternate;
            }
            .center-guide-line.horizontal {
                height: 2px;
                box-shadow: 0 0 8px #00ff00, 0 0 16px #00ff00;
            }
            .center-guide-line.vertical {
                width: 2px;
                box-shadow: 0 0 8px #00ff00, 0 0 16px #00ff00;
            }
            .center-guide-line.preview {
                opacity: 0.6;
                background: #88ff88;
                animation: none;
            }
            .center-guide-line.preview.horizontal {
                height: 1px;
                box-shadow: 0 0 4px #88ff88;
            }
            .center-guide-line.preview.vertical {
                width: 1px;
                box-shadow: 0 0 4px #88ff88;
            }
            @keyframes centerLinePulse {
                0% { opacity: 0.8; transform: scale(1); }
                100% { opacity: 1; transform: scale(1.02); }
            }
            .distance-indicator.centered {
                background: rgba(0, 255, 0, 0.9) !important;
                color: white !important;
                font-weight: bold !important;
            }

            /* 兄弟元素距离线样式 */
            .sibling-distance-line {
                position: fixed;
                z-index: 9997;
                pointer-events: none;
            }
            .sibling-distance-line.horizontal {
                height: 2px;
                background: linear-gradient(90deg, #9c27b0, #00bcd4);
            }
            .sibling-distance-line.vertical {
                width: 2px;
                background: linear-gradient(180deg, #9c27b0, #00bcd4);
            }

            /* 兄弟元素距离标签样式 */
            .sibling-distance-indicator {
                position: fixed;
                background: rgba(156, 39, 176, 0.9);
                color: white;
                padding: 3px 6px;
                border-radius: 3px;
                font-size: 11px;
                font-family: monospace;
                z-index: 10001;
                pointer-events: none;
                white-space: nowrap;
                border: 1px solid #00bcd4;
            }

            /* 兄弟元素高亮样式 */
            .sibling-element-highlight {
                outline: 2px solid #9c27b0 !important;
                outline-offset: 1px !important;
                box-shadow: 0 0 8px rgba(156, 39, 176, 0.5) !important;
            }

            /* 兄弟元素对齐辅助线样式 */
            .sibling-alignment-guide {
                position: fixed;
                background: #2196f3;
                z-index: 9996;
                pointer-events: none;
                opacity: 0.8;
                border: 1px dashed #1976d2;
            }
            .sibling-alignment-guide.horizontal {
                height: 2px;
                box-shadow: 0 0 4px #2196f3;
            }
            .sibling-alignment-guide.vertical {
                width: 2px;
                box-shadow: 0 0 4px #2196f3;
            }

            /* 左边缘对齐增强样式 */
            .left-edge-alignment-guide {
                position: fixed;
                background: linear-gradient(180deg, #9c27b0, #00bcd4);
                z-index: 9995;
                pointer-events: none;
                opacity: 1;
                width: 3px;
                box-shadow: 0 0 8px rgba(156, 39, 176, 0.8), 0 0 16px rgba(0, 188, 212, 0.6);
                animation: leftEdgePulse 1.5s ease-in-out infinite alternate;
            }

            .left-edge-alignment-guide.active {
                background: linear-gradient(180deg, #e91e63, #00e5ff);
                box-shadow: 0 0 12px rgba(233, 30, 99, 1), 0 0 24px rgba(0, 229, 255, 0.8);
                animation: leftEdgeActivePulse 1s ease-in-out infinite alternate;
            }

            @keyframes leftEdgePulse {
                0% { opacity: 0.7; transform: scaleX(1); }
                100% { opacity: 1; transform: scaleX(1.2); }
            }

            @keyframes leftEdgeActivePulse {
                0% { opacity: 0.9; transform: scaleX(1.2); }
                100% { opacity: 1; transform: scaleX(1.5); }
            }

            /* 左边缘对齐目标高亮 */
            .left-edge-target-highlight {
                outline: 3px solid #9c27b0 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 12px rgba(156, 39, 176, 0.8), inset 0 0 8px rgba(0, 188, 212, 0.3) !important;
                animation: leftEdgeTargetPulse 2s ease-in-out infinite alternate;
            }

            @keyframes leftEdgeTargetPulse {
                0% { box-shadow: 0 0 12px rgba(156, 39, 176, 0.8), inset 0 0 8px rgba(0, 188, 212, 0.3); }
                100% { box-shadow: 0 0 20px rgba(156, 39, 176, 1), inset 0 0 12px rgba(0, 188, 212, 0.5); }
            }

            /* 边缘到边缘对齐样式 */
            .edge-to-edge-alignment-guide {
                position: fixed;
                background: linear-gradient(90deg, #ff6b35, #f7931e);
                z-index: 9994;
                pointer-events: none;
                opacity: 1;
                height: 3px;
                box-shadow: 0 0 8px rgba(255, 107, 53, 0.8), 0 0 16px rgba(247, 147, 30, 0.6);
                animation: edgeToEdgePulse 1.5s ease-in-out infinite alternate;
            }

            .edge-to-edge-alignment-guide.active {
                background: linear-gradient(90deg, #ff4757, #ffa502);
                box-shadow: 0 0 12px rgba(255, 71, 87, 1), 0 0 24px rgba(255, 165, 2, 0.8);
                animation: edgeToEdgeActivePulse 1s ease-in-out infinite alternate;
            }

            @keyframes edgeToEdgePulse {
                0% { opacity: 0.7; transform: scaleY(1); }
                100% { opacity: 1; transform: scaleY(1.2); }
            }

            @keyframes edgeToEdgeActivePulse {
                0% { opacity: 0.9; transform: scaleY(1.2); }
                100% { opacity: 1; transform: scaleY(1.5); }
            }

            /* 边缘到边缘对齐目标高亮 */
            .edge-to-edge-target-highlight {
                outline: 3px solid #ff6b35 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 12px rgba(255, 107, 53, 0.8), inset 0 0 8px rgba(247, 147, 30, 0.3) !important;
                animation: edgeToEdgeTargetPulse 2s ease-in-out infinite alternate;
            }

            @keyframes edgeToEdgeTargetPulse {
                0% { box-shadow: 0 0 12px rgba(255, 107, 53, 0.8), inset 0 0 8px rgba(247, 147, 30, 0.3); }
                100% { box-shadow: 0 0 20px rgba(255, 107, 53, 1), inset 0 0 12px rgba(247, 147, 30, 0.5); }
            }

            /* 边缘指示器样式 */
            .edge-indicator {
                position: fixed;
                background: rgba(255, 107, 53, 0.9);
                border: 2px solid #f7931e;
                z-index: 9993;
                pointer-events: none;
                width: 4px;
                opacity: 1;
                animation: edgeIndicatorPulse 1s ease-in-out infinite alternate;
            }

            @keyframes edgeIndicatorPulse {
                0% { opacity: 0.8; transform: scaleX(1); }
                100% { opacity: 1; transform: scaleX(1.3); }
            }

            /* 垂直边缘到边缘对齐样式 */
            .vertical-edge-to-edge-alignment-guide {
                position: fixed;
                background: linear-gradient(180deg, #6c5ce7, #a29bfe);
                z-index: 9993;
                pointer-events: none;
                opacity: 1;
                width: 3px;
                box-shadow: 0 0 8px rgba(108, 92, 231, 0.8), 0 0 16px rgba(162, 155, 254, 0.6);
                animation: verticalEdgeToEdgePulse 1.5s ease-in-out infinite alternate;
            }

            .vertical-edge-to-edge-alignment-guide.active {
                background: linear-gradient(180deg, #5f3dc4, #7c3aed);
                box-shadow: 0 0 12px rgba(95, 61, 196, 1), 0 0 24px rgba(124, 58, 237, 0.8);
                animation: verticalEdgeToEdgeActivePulse 1s ease-in-out infinite alternate;
            }

            @keyframes verticalEdgeToEdgePulse {
                0% { opacity: 0.7; transform: scaleX(1); }
                100% { opacity: 1; transform: scaleX(1.2); }
            }

            @keyframes verticalEdgeToEdgeActivePulse {
                0% { opacity: 0.9; transform: scaleX(1.2); }
                100% { opacity: 1; transform: scaleX(1.5); }
            }

            /* 垂直边缘到边缘对齐目标高亮 */
            .vertical-edge-to-edge-target-highlight {
                outline: 3px solid #6c5ce7 !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 12px rgba(108, 92, 231, 0.8), inset 0 0 8px rgba(162, 155, 254, 0.3) !important;
                animation: verticalEdgeToEdgeTargetPulse 2s ease-in-out infinite alternate;
            }

            @keyframes verticalEdgeToEdgeTargetPulse {
                0% { box-shadow: 0 0 12px rgba(108, 92, 231, 0.8), inset 0 0 8px rgba(162, 155, 254, 0.3); }
                100% { box-shadow: 0 0 20px rgba(108, 92, 231, 1), inset 0 0 12px rgba(162, 155, 254, 0.5); }
            }

            /* 垂直边缘指示器样式 */
            .vertical-edge-indicator {
                position: fixed;
                background: rgba(108, 92, 231, 0.9);
                border: 2px solid #a29bfe;
                z-index: 9992;
                pointer-events: none;
                height: 4px;
                opacity: 1;
                animation: verticalEdgeIndicatorPulse 1s ease-in-out infinite alternate;
            }

            @keyframes verticalEdgeIndicatorPulse {
                0% { opacity: 0.8; transform: scaleY(1); }
                100% { opacity: 1; transform: scaleY(1.3); }
            }

            /* 同边缘对齐样式 */
            .same-edge-alignment-guide {
                position: fixed;
                background: linear-gradient(90deg, #00c9ff, #92fe9d);
                z-index: 9991;
                pointer-events: none;
                opacity: 1;
                height: 3px;
                box-shadow: 0 0 8px rgba(0, 201, 255, 0.8), 0 0 16px rgba(146, 254, 157, 0.6);
                animation: sameEdgePulse 1.5s ease-in-out infinite alternate;
            }

            .same-edge-alignment-guide.active {
                background: linear-gradient(90deg, #0099cc, #66ff99);
                box-shadow: 0 0 12px rgba(0, 153, 204, 1), 0 0 24px rgba(102, 255, 153, 0.8);
                animation: sameEdgeActivePulse 1s ease-in-out infinite alternate;
            }

            @keyframes sameEdgePulse {
                0% { opacity: 0.7; transform: scaleY(1); }
                100% { opacity: 1; transform: scaleY(1.2); }
            }

            @keyframes sameEdgeActivePulse {
                0% { opacity: 0.9; transform: scaleY(1.2); }
                100% { opacity: 1; transform: scaleY(1.5); }
            }

            /* 同边缘对齐目标高亮 */
            .same-edge-target-highlight {
                outline: 3px solid #00c9ff !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 12px rgba(0, 201, 255, 0.8), inset 0 0 8px rgba(146, 254, 157, 0.3) !important;
                animation: sameEdgeTargetPulse 2s ease-in-out infinite alternate;
            }

            @keyframes sameEdgeTargetPulse {
                0% { box-shadow: 0 0 12px rgba(0, 201, 255, 0.8), inset 0 0 8px rgba(146, 254, 157, 0.3); }
                100% { box-shadow: 0 0 20px rgba(0, 201, 255, 1), inset 0 0 12px rgba(146, 254, 157, 0.5); }
            }

            /* 同边缘指示器样式 */
            .same-edge-indicator {
                position: fixed;
                background: rgba(0, 201, 255, 0.9);
                border: 2px solid #92fe9d;
                z-index: 9990;
                pointer-events: none;
                height: 4px;
                opacity: 1;
                animation: sameEdgeIndicatorPulse 1s ease-in-out infinite alternate;
            }

            @keyframes sameEdgeIndicatorPulse {
                0% { opacity: 0.8; transform: scaleY(1); }
                100% { opacity: 1; transform: scaleY(1.3); }
            }

            /* 父边界对齐辅助线样式 */
            .parent-boundary-guide-line {
                position: fixed;
                background: linear-gradient(90deg, #ffd700, #ffb347);
                z-index: 9998;
                pointer-events: none;
                box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                animation: parentBoundaryGuidePulse 1.5s ease-in-out infinite alternate;
            }

            .parent-boundary-guide-line.horizontal {
                height: 2px;
                border-radius: 1px;
            }

            .parent-boundary-guide-line.vertical {
                width: 2px;
                border-radius: 1px;
            }

            @keyframes parentBoundaryGuidePulse {
                0% {
                    background: linear-gradient(90deg, #ffd700, #ffb347);
                    box-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
                }
                100% {
                    background: linear-gradient(90deg, #ffb347, #ffa500);
                    box-shadow: 0 0 12px rgba(255, 165, 0, 0.8);
                }
            }

            /* 父边界对齐指示器样式 */
            .parent-boundary-indicator {
                position: fixed;
                width: 8px;
                height: 8px;
                background: linear-gradient(45deg, #ffd700, #ffa500);
                border: 2px solid #fff;
                border-radius: 50%;
                z-index: 9999;
                pointer-events: none;
                box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
                animation: parentBoundaryIndicatorPulse 1.2s ease-in-out infinite alternate;
            }

            @keyframes parentBoundaryIndicatorPulse {
                0% {
                    transform: scale(1);
                    background: linear-gradient(45deg, #ffd700, #ffa500);
                }
                100% {
                    transform: scale(1.3);
                    background: linear-gradient(45deg, #ffa500, #ff8c00);
                }
            }

            /* 激活元素样式 */
            .element-active {
                outline: 3px solid #ff4081 !important;
                outline-offset: 3px !important;
                box-shadow: 0 0 20px rgba(255, 64, 129, 0.6), inset 0 0 10px rgba(255, 64, 129, 0.2) !important;
                animation: activeElementPulse 2s ease-in-out infinite alternate;
                position: relative;
                z-index: 1000;
            }

            .element-active::before {
                content: "🎯 已激活";
                position: absolute;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(45deg, #ff4081, #ff6ec7);
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 12px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 2px 8px rgba(255, 64, 129, 0.4);
                animation: activeElementLabelPulse 2s ease-in-out infinite alternate;
                z-index: 1001;
            }

            @keyframes activeElementPulse {
                0% {
                    outline-color: #ff4081;
                    box-shadow: 0 0 20px rgba(255, 64, 129, 0.6), inset 0 0 10px rgba(255, 64, 129, 0.2);
                }
                100% {
                    outline-color: #ff6ec7;
                    box-shadow: 0 0 30px rgba(255, 110, 199, 0.8), inset 0 0 15px rgba(255, 110, 199, 0.3);
                }
            }

            @keyframes activeElementLabelPulse {
                0% {
                    background: linear-gradient(45deg, #ff4081, #ff6ec7);
                    transform: translateX(-50%) scale(1);
                }
                100% {
                    background: linear-gradient(45deg, #ff6ec7, #ff4081);
                    transform: translateX(-50%) scale(1.05);
                }
            }

            /* 双击提示样式 */
            .double-click-hint {
                position: fixed;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                z-index: 10000;
                pointer-events: none;
                animation: doubleClickHintFade 2s ease-out forwards;
            }

            @keyframes doubleClickHintFade {
                0% { opacity: 1; transform: translateY(0); }
                70% { opacity: 1; transform: translateY(-10px); }
                100% { opacity: 0; transform: translateY(-20px); }
            }

            /* 层级检查器面板样式 */
            .hierarchy-inspector {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 350px;
                max-height: 80vh;
                background: linear-gradient(135deg, #2c3e50, #34495e);
                border: 2px solid #3498db;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 9999;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 12px;
                color: #ecf0f1;
                overflow: hidden;
                animation: inspectorSlideInLeft 0.3s ease-out;
            }

            @keyframes inspectorSlideInLeft {
                0% { transform: translateX(-100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }

            .inspector-header {
                background: linear-gradient(90deg, #3498db, #2980b9);
                padding: 12px 15px;
                border-bottom: 1px solid #34495e;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
            }

            .inspector-header:hover {
                background: linear-gradient(90deg, #2980b9, #3498db);
            }

            .inspector-title {
                font-weight: bold;
                font-size: 14px;
                color: white;
            }

            .inspector-controls {
                display: flex;
                gap: 5px;
            }

            .inspector-btn {
                border: none;
                color: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .inspector-minimize {
                background: #f39c12;
            }

            .inspector-minimize:hover {
                background: #e67e22;
            }

            .inspector-close {
                background: #e74c3c;
            }

            .inspector-close:hover {
                background: #c0392b;
            }

            .hierarchy-inspector {
                transition: all 0.3s ease;
            }

            .hierarchy-inspector.minimized {
                height: auto;
                min-height: auto;
            }

            .hierarchy-inspector.minimized .inspector-content {
                display: none;
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .hierarchy-inspector:not(.minimized) .inspector-content {
                display: block;
                opacity: 1;
                transition: opacity 0.3s ease 0.1s;
            }

            .hierarchy-inspector.minimized .inspector-title {
                font-size: 13px;
                transition: font-size 0.2s ease;
            }

            .hierarchy-inspector:not(.minimized) .inspector-title {
                font-size: 14px;
                transition: font-size 0.2s ease;
            }

            /* 最小化状态的特殊样式 */
            .hierarchy-inspector.minimized {
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            }

            .hierarchy-inspector.minimized .inspector-header {
                border-bottom: none;
                border-radius: 10px;
            }

            /* 最小化按钮状态指示 */
            .inspector-minimize.minimized {
                background: #27ae60;
                transform: rotate(0deg);
                transition: all 0.2s ease;
            }

            .inspector-minimize:not(.minimized) {
                background: #f39c12;
                transform: rotate(0deg);
                transition: all 0.2s ease;
            }

            /* 底部位置样式 */
            .hierarchy-inspector.bottom-position {
                top: auto;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                width: 400px;
                max-height: 40vh;
                animation: inspectorSlideInBottom 0.3s ease-out;
            }

            @keyframes inspectorSlideInBottom {
                0% { transform: translateX(-50%) translateY(100%); opacity: 0; }
                100% { transform: translateX(-50%) translateY(0); opacity: 1; }
            }

            .inspector-position {
                background: #27ae60;
            }

            .inspector-position:hover {
                background: #229954;
            }

            .inspector-content {
                padding: 15px;
                max-height: calc(80vh - 60px);
                overflow-y: auto;
            }

            .hierarchy-tree {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .hierarchy-item {
                margin: 3px 0;
                padding: 6px 8px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
                border-left: 3px solid transparent;
            }

            .hierarchy-item:hover {
                background: rgba(52, 152, 219, 0.2);
                border-left-color: #3498db;
            }

            .hierarchy-item.current {
                background: linear-gradient(90deg, rgba(231, 76, 60, 0.3), rgba(192, 57, 43, 0.3));
                border-left-color: #e74c3c;
                font-weight: bold;
            }

            .hierarchy-item.parent {
                border-left-color: #f39c12;
            }

            .hierarchy-item.child {
                border-left-color: #27ae60;
            }

            .hierarchy-item.sibling {
                border-left-color: #9b59b6;
            }

            .element-tag {
                color: #e67e22;
                font-weight: bold;
            }

            .element-class {
                color: #3498db;
                margin-left: 5px;
            }

            .element-id {
                color: #e74c3c;
                margin-left: 5px;
            }

            .element-info {
                color: #95a5a6;
                font-size: 10px;
                margin-top: 2px;
                display: block;
            }

            .hierarchy-level-0 { padding-left: 8px; }
            .hierarchy-level-1 { padding-left: 20px; }
            .hierarchy-level-2 { padding-left: 32px; }
            .hierarchy-level-3 { padding-left: 44px; }
            .hierarchy-level-4 { padding-left: 56px; }
            .hierarchy-level-5 { padding-left: 68px; }

            .hierarchy-item::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                width: 3px;
                height: 3px;
                background: currentColor;
                border-radius: 50%;
                transform: translateY(-50%);
            }

            .section-header {
                color: #bdc3c7;
                font-size: 11px;
                font-weight: bold;
                margin: 15px 0 8px 0;
                padding-bottom: 3px;
                border-bottom: 1px solid #34495e;
                text-transform: uppercase;
                letter-spacing: 1px;
            }

            .section-header:first-child {
                margin-top: 0;
            }

            /* 复制功能样式 */
            .copy-notification {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #4caf50, #45a049);
                color: white;
                padding: 20px 30px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                font-family: Arial, sans-serif;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                animation: copyNotificationShow 0.3s ease-out;
                max-width: 400px;
                word-wrap: break-word;
            }

            @keyframes copyNotificationShow {
                0% {
                    opacity: 0;
                    transform: translate(-50%, -50%) scale(0.8);
                }
                100% {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }

            .copy-notification.success {
                background: linear-gradient(135deg, #4caf50, #45a049);
            }

            .copy-notification.error {
                background: linear-gradient(135deg, #f44336, #d32f2f);
            }

            .copy-notification.warning {
                background: linear-gradient(135deg, #ff9800, #f57c00);
            }

            .copy-content {
                background: rgba(255, 255, 255, 0.2);
                padding: 10px;
                border-radius: 6px;
                margin-top: 10px;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 12px;
                font-weight: normal;
                word-break: break-all;
            }

            .copy-format-label {
                font-size: 11px;
                opacity: 0.8;
                margin-bottom: 5px;
            }

            #copy-styles:disabled {
                background: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.6;
            }

            #toggle-inspector:disabled {
                background: #666 !important;
                cursor: not-allowed !important;
                opacity: 0.6;
            }

            #copy-format {
                margin-left: 5px;
            }

            /* 面板最小化样式 */
            .panel-minimized #panel-buttons {
                max-height: 0 !important;
                opacity: 0 !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
                overflow: hidden !important;
            }

            .panel-minimized {
                min-height: auto !important;
            }

            #panel-buttons {
                max-height: 1000px;
                opacity: 1;
                transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out, margin 0.3s ease-in-out, padding 0.3s ease-in-out;
                overflow: hidden;
            }

            #minimize-panel:hover {
                background: #546E7A !important;
                transform: scale(1.05);
            }

            #minimize-panel {
                transition: all 0.2s ease-in-out;
            }

            /* 面板拖拽样式 */
            #panel-header {
                transition: background-color 0.2s ease-in-out;
            }

            #panel-header:hover {
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }

            #drag-control-panel.dragging {
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
                transform: scale(1.02);
                transition: none;
            }

            #panel-header:active {
                background-color: rgba(255, 255, 255, 0.15);
            }
        `;
    document.head.appendChild(style);
  }

  // 解析CSS尺寸值，返回数值和单位
  function parseCSSSize(value) {
    if (!value || value === "auto") return { value: 0, unit: "px" };

    const match = value.toString().match(/^([\d.]+)(.*)$/);
    if (match) {
      return {
        value: parseFloat(match[1]),
        unit: match[2] || "px",
      };
    }
    return { value: 0, unit: "px" };
  }

  // 检测鼠标在元素的哪个调整区域
  function getResizeMode(element, clientX, clientY) {
    if (!enableResize) return "move";

    const rect = element.getBoundingClientRect();
    const threshold = 8; // 边缘检测阈值

    const isNearRight = clientX >= rect.right - threshold && clientX <= rect.right + threshold;
    const isNearBottom = clientY >= rect.bottom - threshold && clientY <= rect.bottom + threshold;
    const isNearLeft = clientX >= rect.left - threshold && clientX <= rect.left + threshold;
    const isNearTop = clientY >= rect.top - threshold && clientY <= rect.top + threshold;

    // 角落优先级更高
    if (isNearRight && isNearBottom) return "resize-se";
    if (isNearLeft && isNearTop) return "resize-nw";
    if (isNearRight && isNearTop) return "resize-ne";
    if (isNearLeft && isNearBottom) return "resize-sw";

    // 边缘
    if (isNearRight) return "resize-e";
    if (isNearBottom) return "resize-s";
    if (isNearLeft) return "resize-w";
    if (isNearTop) return "resize-n";

    return "move";
  }

  // 设置光标样式
  function setCursor(mode) {
    const cursors = {
      move: "move",
      "resize-e": "e-resize",
      "resize-w": "w-resize",
      "resize-s": "s-resize",
      "resize-n": "n-resize",
      "resize-se": "se-resize",
      "resize-sw": "sw-resize",
      "resize-ne": "ne-resize",
      "resize-nw": "nw-resize",
    };
    document.body.style.cursor = cursors[mode] || "default";
  }

  // 计算居中位置
  function calculateCenterPosition(draggedElement, parentElement) {
    const draggedRect = draggedElement.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    const centerX = (parentRect.width - draggedRect.width) / 2;
    const centerY = (parentRect.height - draggedRect.height) / 2;

    return { centerX, centerY };
  }

  // 检测是否接近居中位置
  function checkCenterAlignment(draggedElement, parentElement, currentLeft, currentTop) {
    if (!enableMagneticAlign)
      return {
        shouldCenterX: false,
        shouldCenterY: false,
        shouldPreviewX: false,
        shouldPreviewY: false,
      };

    const draggedRect = draggedElement.getBoundingClientRect();
    const parentRect = parentElement.getBoundingClientRect();

    // 计算当前距离左右边缘的距离
    const leftDistance = currentLeft;
    const rightDistance = parentRect.width - draggedRect.width - currentLeft;
    const topDistance = currentTop;
    const bottomDistance = parentRect.height - draggedRect.height - currentTop;

    // 检查是否接近水平居中
    const horizontalDiff = Math.abs(leftDistance - rightDistance);
    const shouldCenterX = horizontalDiff <= centerTolerance;
    const shouldPreviewX = horizontalDiff <= previewTolerance && !shouldCenterX;

    // 检查是否接近垂直居中
    const verticalDiff = Math.abs(topDistance - bottomDistance);
    const shouldCenterY = verticalDiff <= centerTolerance;
    const shouldPreviewY = verticalDiff <= previewTolerance && !shouldCenterY;

    return { shouldCenterX, shouldCenterY, shouldPreviewX, shouldPreviewY };
  }

  // 应用兄弟元素对齐吸附（增强左边缘对齐）
  function applySiblingSnapping(draggedElement, targetLeft, targetTop) {
    if (!enableMagneticAlign) {
      return { finalLeft: targetLeft, finalTop: targetTop, leftEdgeSnapped: false };
    }

    // 创建临时的拖拽元素矩形来计算对齐
    const currentRect = draggedElement.getBoundingClientRect();
    const tempRect = {
      left: currentRect.left + (targetLeft - (parseInt(draggedElement.style.left) || 0)),
      top: currentRect.top + (targetTop - (parseInt(draggedElement.style.top) || 0)),
      right: currentRect.right + (targetLeft - (parseInt(draggedElement.style.left) || 0)),
      bottom: currentRect.bottom + (targetTop - (parseInt(draggedElement.style.top) || 0)),
      width: currentRect.width,
      height: currentRect.height,
    };

    const siblings = getSiblingElements(draggedElement);
    if (siblings.length === 0) {
      return { finalLeft: targetLeft, finalTop: targetTop, leftEdgeSnapped: false };
    }

    let finalLeft = targetLeft;
    let finalTop = targetTop;
    let snapped = false;
    let leftEdgeSnapped = false;
    let edgeToEdgeSnapped = false;
    let verticalEdgeToEdgeSnapped = false;
    let sameEdgeSnapped = false;

    // 检查是否应该保持现有的边缘到边缘对齐锁定
    if (isEdgeToEdgeAligned && edgeToEdgeAlignmentTargets.length > 0) {
      const currentTarget = edgeToEdgeAlignmentTargets[0];
      let lockDiff = 0;

      if (currentTarget.type === "right-to-left") {
        lockDiff = Math.abs(tempRect.right - currentTarget.targetPosition);
      } else if (currentTarget.type === "left-to-right") {
        lockDiff = Math.abs(tempRect.left - currentTarget.targetPosition);
      }

      if (lockDiff <= edgeToEdgeLockTolerance) {
        // 保持锁定状态
        let adjustment = 0;
        if (currentTarget.type === "right-to-left") {
          adjustment = currentTarget.targetPosition - tempRect.right;
        } else if (currentTarget.type === "left-to-right") {
          adjustment = currentTarget.targetPosition - tempRect.left;
        }
        finalLeft = targetLeft + adjustment;
        edgeToEdgeSnapped = true;
        snapped = true;
      } else {
        // 超出锁定容差，解除锁定
        isEdgeToEdgeAligned = false;
        edgeToEdgeAlignmentTargets = [];
        edgeToEdgeAlignmentType = null;
      }
    } else {
      // 清除之前的边缘到边缘对齐目标
      edgeToEdgeAlignmentTargets = [];
    }

    // 检查是否应该保持现有的垂直边缘到边缘对齐锁定
    if (isVerticalEdgeToEdgeAligned && verticalEdgeToEdgeAlignmentTargets.length > 0) {
      const currentTarget = verticalEdgeToEdgeAlignmentTargets[0];
      let lockDiff = 0;

      if (currentTarget.type === "bottom-to-top") {
        lockDiff = Math.abs(tempRect.bottom - currentTarget.targetPosition);
      } else if (currentTarget.type === "top-to-bottom") {
        lockDiff = Math.abs(tempRect.top - currentTarget.targetPosition);
      }

      if (lockDiff <= verticalEdgeToEdgeLockTolerance) {
        // 保持锁定状态
        let adjustment = 0;
        if (currentTarget.type === "bottom-to-top") {
          adjustment = currentTarget.targetPosition - tempRect.bottom;
        } else if (currentTarget.type === "top-to-bottom") {
          adjustment = currentTarget.targetPosition - tempRect.top;
        }
        finalTop = targetTop + adjustment;
        verticalEdgeToEdgeSnapped = true;
        snapped = true;
      } else {
        // 超出锁定容差，解除锁定
        isVerticalEdgeToEdgeAligned = false;
        verticalEdgeToEdgeAlignmentTargets = [];
        verticalEdgeToEdgeAlignmentType = null;
      }
    } else {
      // 清除之前的垂直边缘到边缘对齐目标
      verticalEdgeToEdgeAlignmentTargets = [];
    }

    // 检查是否应该保持现有的同边缘对齐锁定
    if (isSameEdgeAligned && sameEdgeAlignmentTargets.length > 0) {
      const currentTarget = sameEdgeAlignmentTargets[0];
      let lockDiff = 0;

      if (currentTarget.type === "top-to-top") {
        lockDiff = Math.abs(tempRect.top - currentTarget.targetPosition);
      } else if (currentTarget.type === "bottom-to-bottom") {
        lockDiff = Math.abs(tempRect.bottom - currentTarget.targetPosition);
      }

      if (lockDiff <= sameEdgeLockTolerance) {
        // 保持锁定状态
        let adjustment = 0;
        if (currentTarget.type === "top-to-top") {
          adjustment = currentTarget.targetPosition - tempRect.top;
        } else if (currentTarget.type === "bottom-to-bottom") {
          adjustment = currentTarget.targetPosition - tempRect.bottom;
        }
        finalTop = targetTop + adjustment;
        sameEdgeSnapped = true;
        snapped = true;
      } else {
        // 超出锁定容差，解除锁定
        isSameEdgeAligned = false;
        sameEdgeAlignmentTargets = [];
        sameEdgeAlignmentType = null;
      }
    } else {
      // 清除之前的同边缘对齐目标
      sameEdgeAlignmentTargets = [];
    }

    // 检查是否应该保持现有的左边缘对齐锁定
    if (isLeftEdgeAligned && leftEdgeAlignmentTargets.length > 0) {
      const currentTarget = leftEdgeAlignmentTargets[0];
      const lockDiff = Math.abs(tempRect.left - currentTarget.naturalLeft);

      if (lockDiff <= leftEdgeLockTolerance) {
        // 保持锁定状态
        const adjustment = currentTarget.naturalLeft - tempRect.left;
        finalLeft = targetLeft + adjustment;
        leftEdgeSnapped = true;
        snapped = true;
      } else {
        // 超出锁定容差，解除锁定
        isLeftEdgeAligned = false;
        leftEdgeAlignmentTargets = [];
      }
    } else {
      // 清除之前的左边缘对齐目标
      leftEdgeAlignmentTargets = [];
    }

    // 如果没有锁定，检查新的左边缘对齐（使用增强的阈值）
    if (!leftEdgeSnapped) {
      siblings.forEach((sibling) => {
        const siblingRect = sibling.rect;
        const naturalLeft = sibling.naturalLeftPosition;

        // 计算拖拽元素左边缘与兄弟元素自然左边缘的距离
        const leftEdgeDiff = Math.abs(tempRect.left - naturalLeft);

        // 如果在左边缘对齐阈值内，优先进行左边缘对齐
        if (leftEdgeDiff <= leftEdgeAlignTolerance && !leftEdgeSnapped) {
          const adjustment = naturalLeft - tempRect.left;
          finalLeft = targetLeft + adjustment;
          leftEdgeSnapped = true;
          isLeftEdgeAligned = true;

          // 记录对齐目标
          leftEdgeAlignmentTargets.push({
            element: sibling.element,
            naturalLeft: naturalLeft,
            diff: leftEdgeDiff,
          });

          // 触发吸附反馈
          if (!snapped) {
            triggerSnapFeedback(draggedElement);
          }
          snapped = true;
          return; // 优先左边缘对齐，找到后立即返回
        }
      });
    }

    // 如果没有左边缘对齐且没有边缘到边缘对齐，检查新的水平边缘到边缘对齐
    if (!leftEdgeSnapped && !edgeToEdgeSnapped && !verticalEdgeToEdgeSnapped) {
      const edgeAlignments = detectEdgeToEdgeAlignment(tempRect, siblings);

      if (edgeAlignments.length > 0) {
        const bestAlignment = edgeAlignments[0];
        let adjustment = 0;

        if (bestAlignment.type === "right-to-left") {
          adjustment = bestAlignment.targetPosition - tempRect.right;
        } else if (bestAlignment.type === "left-to-right") {
          adjustment = bestAlignment.targetPosition - tempRect.left;
        }

        finalLeft = targetLeft + adjustment;
        edgeToEdgeSnapped = true;
        isEdgeToEdgeAligned = true;
        edgeToEdgeAlignmentType = bestAlignment.type;

        // 记录对齐目标
        edgeToEdgeAlignmentTargets.push({
          type: bestAlignment.type,
          sibling: bestAlignment.sibling,
          targetPosition: bestAlignment.targetPosition,
          diff: bestAlignment.diff,
          draggedEdge: bestAlignment.draggedEdge,
          siblingEdge: bestAlignment.siblingEdge,
        });

        // 触发吸附反馈
        if (!snapped) {
          triggerSnapFeedback(draggedElement);
        }
        snapped = true;
      }
    }

    // 如果没有其他对齐，检查新的垂直边缘到边缘对齐
    if (!leftEdgeSnapped && !edgeToEdgeSnapped && !verticalEdgeToEdgeSnapped) {
      const verticalEdgeAlignments = detectVerticalEdgeToEdgeAlignment(tempRect, siblings);

      if (verticalEdgeAlignments.length > 0) {
        const bestAlignment = verticalEdgeAlignments[0];
        let adjustment = 0;

        if (bestAlignment.type === "bottom-to-top") {
          adjustment = bestAlignment.targetPosition - tempRect.bottom;
        } else if (bestAlignment.type === "top-to-bottom") {
          adjustment = bestAlignment.targetPosition - tempRect.top;
        }

        finalTop = targetTop + adjustment;
        verticalEdgeToEdgeSnapped = true;
        isVerticalEdgeToEdgeAligned = true;
        verticalEdgeToEdgeAlignmentType = bestAlignment.type;

        // 记录对齐目标
        verticalEdgeToEdgeAlignmentTargets.push({
          type: bestAlignment.type,
          sibling: bestAlignment.sibling,
          targetPosition: bestAlignment.targetPosition,
          diff: bestAlignment.diff,
          draggedEdge: bestAlignment.draggedEdge,
          siblingEdge: bestAlignment.siblingEdge,
        });

        // 触发吸附反馈
        if (!snapped) {
          triggerSnapFeedback(draggedElement);
        }
        snapped = true;
      }
    }

    // 如果没有其他对齐，检查新的同边缘对齐
    if (!leftEdgeSnapped && !edgeToEdgeSnapped && !verticalEdgeToEdgeSnapped && !sameEdgeSnapped) {
      const sameEdgeAlignments = detectSameEdgeAlignment(tempRect, siblings);

      if (sameEdgeAlignments.length > 0) {
        const bestAlignment = sameEdgeAlignments[0];
        let adjustment = 0;

        if (bestAlignment.type === "top-to-top") {
          adjustment = bestAlignment.targetPosition - tempRect.top;
        } else if (bestAlignment.type === "bottom-to-bottom") {
          adjustment = bestAlignment.targetPosition - tempRect.bottom;
        }

        finalTop = targetTop + adjustment;
        sameEdgeSnapped = true;
        isSameEdgeAligned = true;
        sameEdgeAlignmentType = bestAlignment.type;

        // 记录对齐目标
        sameEdgeAlignmentTargets.push({
          type: bestAlignment.type,
          sibling: bestAlignment.sibling,
          targetPosition: bestAlignment.targetPosition,
          diff: bestAlignment.diff,
          draggedEdge: bestAlignment.draggedEdge,
          siblingEdge: bestAlignment.siblingEdge,
        });

        // 触发吸附反馈
        if (!snapped) {
          triggerSnapFeedback(draggedElement);
        }
        snapped = true;
      }
    }

    // 如果没有左边缘对齐，检查其他对齐方式
    if (!leftEdgeSnapped && !edgeToEdgeSnapped && !verticalEdgeToEdgeSnapped && !sameEdgeSnapped) {
      isLeftEdgeAligned = false;

      siblings.forEach((sibling) => {
        const siblingRect = sibling.rect;

        // 检查水平对齐（上边缘、下边缘、中心线）
        const topDiff = Math.abs(tempRect.top - siblingRect.top);
        const bottomDiff = Math.abs(tempRect.bottom - siblingRect.bottom);
        const centerYDiff = Math.abs((tempRect.top + tempRect.bottom) / 2 - (siblingRect.top + siblingRect.bottom) / 2);

        // 检查垂直对齐（左边缘、右边缘、中心线）
        const leftDiff = Math.abs(tempRect.left - siblingRect.left);
        const rightDiff = Math.abs(tempRect.right - siblingRect.right);
        const centerXDiff = Math.abs((tempRect.left + tempRect.right) / 2 - (siblingRect.left + siblingRect.right) / 2);

        // 应用吸附（使用更严格的锁定容差）
        if (topDiff <= siblingLockTolerance && !snapped) {
          const adjustment = siblingRect.top - tempRect.top;
          finalTop = targetTop + adjustment;
          snapped = true;
        } else if (bottomDiff <= siblingLockTolerance && !snapped) {
          const adjustment = siblingRect.bottom - tempRect.bottom;
          finalTop = targetTop + adjustment;
          snapped = true;
        } else if (centerYDiff <= siblingLockTolerance && !snapped) {
          const siblingCenterY = (siblingRect.top + siblingRect.bottom) / 2;
          const tempCenterY = (tempRect.top + tempRect.bottom) / 2;
          const adjustment = siblingCenterY - tempCenterY;
          finalTop = targetTop + adjustment;
          snapped = true;
        }

        if (leftDiff <= siblingLockTolerance && !snapped) {
          const adjustment = siblingRect.left - tempRect.left;
          finalLeft = targetLeft + adjustment;
          snapped = true;
        } else if (rightDiff <= siblingLockTolerance && !snapped) {
          const adjustment = siblingRect.right - tempRect.right;
          finalLeft = targetLeft + adjustment;
          snapped = true;
        } else if (centerXDiff <= siblingLockTolerance && !snapped) {
          const siblingCenterX = (siblingRect.left + siblingRect.right) / 2;
          const tempCenterX = (tempRect.left + tempRect.right) / 2;
          const adjustment = siblingCenterX - tempCenterX;
          finalLeft = targetLeft + adjustment;
          snapped = true;
        }
      });
    }

    return { finalLeft, finalTop, leftEdgeSnapped, edgeToEdgeSnapped, verticalEdgeToEdgeSnapped, sameEdgeSnapped };
  }

  // 应用磁性对齐
  function applyMagneticAlignment(draggedElement, parentElement, targetLeft, targetTop) {
    const { centerX, centerY } = calculateCenterPosition(draggedElement, parentElement);
    const { shouldCenterX, shouldCenterY, shouldPreviewX, shouldPreviewY } = checkCenterAlignment(draggedElement, parentElement, targetLeft, targetTop);

    let finalLeft = targetLeft;
    let finalTop = targetTop;
    let snapTriggered = false;

    // 水平居中吸附
    if (shouldCenterX) {
      finalLeft = centerX;
      if (!isHorizontalCentered) {
        snapTriggered = true; // 首次吸附
        triggerSnapFeedback(draggedElement);
      }
      isHorizontalCentered = true;
    } else if (isHorizontalCentered) {
      // 检查是否超出容差范围
      const centerDiff = Math.abs(targetLeft - centerX);
      if (centerDiff <= lockTolerance) {
        finalLeft = centerX; // 保持居中锁定
      } else {
        isHorizontalCentered = false; // 解除锁定
      }
    }

    // 垂直居中吸附
    if (shouldCenterY) {
      finalTop = centerY;
      if (!isVerticalCentered) {
        snapTriggered = true; // 首次吸附
        triggerSnapFeedback(draggedElement);
      }
      isVerticalCentered = true;
    } else if (isVerticalCentered) {
      // 检查是否超出容差范围
      const centerDiff = Math.abs(targetTop - centerY);
      if (centerDiff <= lockTolerance) {
        finalTop = centerY; // 保持居中锁定
      } else {
        isVerticalCentered = false; // 解除锁定
      }
    }

    return {
      finalLeft,
      finalTop,
      isHorizontalCentered,
      isVerticalCentered,
      shouldPreviewX,
      shouldPreviewY,
    };
  }

  // 触发吸附反馈效果
  function triggerSnapFeedback(element) {
    // 添加震动效果
    element.style.transition = "transform 0.1s ease-out";
    element.style.transform = "scale(1.02)";

    setTimeout(() => {
      element.style.transform = "scale(1)";
      setTimeout(() => {
        element.style.transition = "";
      }, 100);
    }, 100);
  }

  // 显示居中辅助线
  function showCenterGuideLines(draggedElement, parentElement, showHorizontal, showVertical, previewX = false, previewY = false) {
    // 清除之前的辅助线
    document.querySelectorAll(".center-guide-line").forEach((el) => el.remove());

    const parentRect = parentElement.getBoundingClientRect();

    // 显示预览辅助线
    if (previewX) {
      const line = document.createElement("div");
      line.className = "center-guide-line vertical preview";
      line.style.left = parentRect.left + parentRect.width / 2 + "px";
      line.style.top = parentRect.top + "px";
      line.style.height = parentRect.height + "px";
      document.body.appendChild(line);
    }

    if (previewY) {
      const line = document.createElement("div");
      line.className = "center-guide-line horizontal preview";
      line.style.left = parentRect.left + "px";
      line.style.top = parentRect.top + parentRect.height / 2 + "px";
      line.style.width = parentRect.width + "px";
      document.body.appendChild(line);
    }

    // 显示激活的居中线（覆盖预览线）
    if (showHorizontal) {
      // 显示垂直居中线
      const line = document.createElement("div");
      line.className = "center-guide-line vertical";
      line.style.left = parentRect.left + parentRect.width / 2 + "px";
      line.style.top = parentRect.top + "px";
      line.style.height = parentRect.height + "px";
      document.body.appendChild(line);
    }

    if (showVertical) {
      // 显示水平居中线
      const line = document.createElement("div");
      line.className = "center-guide-line horizontal";
      line.style.left = parentRect.left + "px";
      line.style.top = parentRect.top + parentRect.height / 2 + "px";
      line.style.width = parentRect.width + "px";
      document.body.appendChild(line);
    }
  }
  localStorage.setItem("isDragMode", isDragMode);

  // 使元素可拖拽
  function makeElementDraggable(element) {
    if (!element || element === document.body || element === document.documentElement) {
      return;
    }

    // 保存原始样式（只在第一次拖拽时保存）
    if (!element.dataset.originalPosition) {
      const computedStyle = window.getComputedStyle(element);

      // 保存原始的样式值
      element.dataset.originalLeft = element.style.left || "";
      element.dataset.originalTop = element.style.top || "";
      element.dataset.originalPosition = element.style.position || "";
      element.dataset.originalWidth = element.style.width || "";
      element.dataset.originalHeight = element.style.height || "";

      // 如果元素是 static 定位，需要设置为 relative 才能使用 left/top
      if (computedStyle.position === "static") {
        element.style.position = "relative";
      }
    }
  }

  // 开始拖拽
  function startDrag(e) {
    if (!isDragMode) return;

    const target = e.target;

    // 跳过控制面板
    if (target.closest("#drag-control-panel")) {
      return;
    }

    // 检查元素是否已激活
    if (target !== activeElement) {
      // 元素未激活，显示双击提示
      showDoubleClickHint(target, e.clientX, e.clientY);
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    draggedElement = target;

    makeElementDraggable(draggedElement);

    // 检测元素定位上下文
    elementPositioningContext = detectElementPositioningContext(draggedElement);
    console.log("StartDrag - Positioning Context:", elementPositioningContext);

    // 检测拖拽模式
    resizeMode = getResizeMode(draggedElement, e.clientX, e.clientY);

    startX = e.clientX;
    startY = e.clientY;

    if (resizeMode === "move") {
      // 位置拖拽模式
      let currentLeft, currentTop;

      if (elementPositioningContext && elementPositioningContext.positioningType === "absolute") {
        // 绝对定位元素：使用left/top属性
        if (draggedElement.style.left && draggedElement.style.left !== "") {
          // 如果元素已有明确的left值，使用它
          currentLeft = parseInt(draggedElement.style.left) || 0;
        } else {
          // 如果没有明确的left值，计算相对于父元素的位置
          const rect = draggedElement.getBoundingClientRect();
          const parentElement = draggedElement.parentElement;
          const parentRect = parentElement ? parentElement.getBoundingClientRect() : { left: 0 };
          currentLeft = rect.left - parentRect.left;
          // 设置初始CSS值以便后续拖拽
          draggedElement.style.left = currentLeft + "px";
        }

        if (draggedElement.style.top && draggedElement.style.top !== "") {
          // 如果元素已有明确的top值，使用它
          currentTop = parseInt(draggedElement.style.top) || 0;
        } else {
          // 如果没有明确的top值，计算相对于父元素的位置
          const rect = draggedElement.getBoundingClientRect();
          const parentElement = draggedElement.parentElement;
          const parentRect = parentElement ? parentElement.getBoundingClientRect() : { top: 0 };
          currentTop = rect.top - parentRect.top;
          // 设置初始CSS值以便后续拖拽
          draggedElement.style.top = currentTop + "px";
        }
      } else {
        // 正常文档流元素：使用margin-left/margin-top属性
        currentLeft = elementPositioningContext ? elementPositioningContext.currentMarginLeft : 0;
        currentTop = elementPositioningContext ? elementPositioningContext.currentMarginTop : 0;
      }

      startLeft = currentLeft;
      startTop = currentTop;
    } else {
      // 尺寸调整模式
      const computedStyle = window.getComputedStyle(draggedElement);
      const rect = draggedElement.getBoundingClientRect();

      startWidth = rect.width;
      startHeight = rect.height;

      // 解析当前的width和height值及单位
      const widthInfo = parseCSSSize(draggedElement.style.width || computedStyle.width);
      const heightInfo = parseCSSSize(draggedElement.style.height || computedStyle.height);

      originalWidthUnit = widthInfo.unit;
      originalHeightUnit = heightInfo.unit;
      originalWidthValue = widthInfo.value;
      originalHeightValue = heightInfo.value;

      // 如果原始值为0或auto，使用当前计算值
      if (originalWidthValue === 0) {
        originalWidthValue = startWidth;
        originalWidthUnit = "px";
      }
      if (originalHeightValue === 0) {
        originalHeightValue = startHeight;
        originalHeightUnit = "px";
      }
    }

    draggedElement.classList.add("drag-active");

    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
  }

  // 拖拽过程
  function drag(e) {
    if (!draggedElement) return;

    e.preventDefault();

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (resizeMode === "move") {
      // 位置拖拽
      let newLeft = startLeft + deltaX;
      let newTop = startTop + deltaY;

      // 应用磁性对齐
      if (enableMagneticAlign) {
        const parentElement = getParentElement(draggedElement);
        if (parentElement) {
          const alignment = applyMagneticAlignment(draggedElement, parentElement, newLeft, newTop);
          newLeft = alignment.finalLeft;
          newTop = alignment.finalTop;

          // 显示居中辅助线（包括预览）
          showCenterGuideLines(draggedElement, parentElement, alignment.isHorizontalCentered, alignment.isVerticalCentered, alignment.shouldPreviewX, alignment.shouldPreviewY);
        }

        // 应用兄弟元素对齐吸附（增强左边缘对齐和边缘到边缘对齐）
        const siblingSnap = applySiblingSnapping(draggedElement, newLeft, newTop);
        newLeft = siblingSnap.finalLeft;
        newTop = siblingSnap.finalTop;

        // 显示左边缘对齐辅助线
        if (siblingSnap.leftEdgeSnapped) {
          showLeftEdgeAlignmentGuides();
        }

        // 显示水平边缘到边缘对齐辅助线
        if (siblingSnap.edgeToEdgeSnapped) {
          showEdgeToEdgeAlignmentGuides();
        }

        // 显示垂直边缘到边缘对齐辅助线
        if (siblingSnap.verticalEdgeToEdgeSnapped) {
          showVerticalEdgeToEdgeAlignmentGuides();
        }

        // 显示同边缘对齐辅助线
        if (siblingSnap.sameEdgeSnapped) {
          showSameEdgeAlignmentGuides();
        }

        // 应用父边界对齐
        const parentBoundaryAlignment = checkParentBoundaryAlignment(draggedElement, newLeft, newTop);
        if (parentBoundaryAlignment.aligned) {
          newLeft = parentBoundaryAlignment.left;
          newTop = parentBoundaryAlignment.top;

          // 更新父边界对齐状态
          isParentBoundaryAligned = true;
          parentBoundaryAlignmentType = parentBoundaryAlignment.type;
          parentBoundaryTarget = parentBoundaryAlignment.target;

          // 显示父边界对齐辅助线
          showParentBoundaryGuides(parentBoundaryAlignment);
        } else {
          // 清除父边界对齐状态
          isParentBoundaryAligned = false;
          parentBoundaryAlignmentType = null;
          parentBoundaryTarget = null;
          clearParentBoundaryGuides();
        }
      }

      // 根据定位上下文应用适当的CSS属性
      if (elementPositioningContext && elementPositioningContext.positioningType === "absolute") {
        // 绝对定位元素：修改left/top属性
        console.log("Applying ABSOLUTE positioning - setting left/top:", newLeft, newTop);
        draggedElement.style.left = newLeft + "px";
        draggedElement.style.top = newTop + "px";
      } else {
        // 正常文档流元素：修改margin-left/margin-top属性
        console.log("Applying NORMAL positioning - setting margin-left/margin-top:", newLeft, newTop);
        draggedElement.style.marginLeft = newLeft + "px";
        draggedElement.style.marginTop = newTop + "px";
      }

      // 显示距离信息
      if (showDistance) {
        updateDistanceIndicator();
      }
    } else {
      // 尺寸调整
      let newWidth = startWidth;
      let newHeight = startHeight;

      // 根据调整模式计算新尺寸
      switch (resizeMode) {
        case "resize-e":
          newWidth = Math.max(10, startWidth + deltaX);
          break;
        case "resize-w":
          newWidth = Math.max(10, startWidth - deltaX);
          if (newWidth !== startWidth - deltaX) {
            // 调整位置以保持右边缘不动
            const currentLeft = parseInt(draggedElement.style.left) || 0;
            draggedElement.style.left = currentLeft + (startWidth - newWidth) + "px";
          }
          break;
        case "resize-s":
          newHeight = Math.max(10, startHeight + deltaY);
          break;
        case "resize-n":
          newHeight = Math.max(10, startHeight - deltaY);
          if (newHeight !== startHeight - deltaY) {
            // 调整位置以保持下边缘不动
            const currentTop = parseInt(draggedElement.style.top) || 0;
            draggedElement.style.top = currentTop + (startHeight - newHeight) + "px";
          }
          break;
        case "resize-se":
          newWidth = Math.max(10, startWidth + deltaX);
          newHeight = Math.max(10, startHeight + deltaY);
          break;
        case "resize-sw":
          newWidth = Math.max(10, startWidth - deltaX);
          newHeight = Math.max(10, startHeight + deltaY);
          if (newWidth !== startWidth - deltaX) {
            const currentLeft = parseInt(draggedElement.style.left) || 0;
            draggedElement.style.left = currentLeft + (startWidth - newWidth) + "px";
          }
          break;
        case "resize-ne":
          newWidth = Math.max(10, startWidth + deltaX);
          newHeight = Math.max(10, startHeight - deltaY);
          if (newHeight !== startHeight - deltaY) {
            const currentTop = parseInt(draggedElement.style.top) || 0;
            draggedElement.style.top = currentTop + (startHeight - newHeight) + "px";
          }
          break;
        case "resize-nw":
          newWidth = Math.max(10, startWidth - deltaX);
          newHeight = Math.max(10, startHeight - deltaY);
          if (newWidth !== startWidth - deltaX) {
            const currentLeft = parseInt(draggedElement.style.left) || 0;
            draggedElement.style.left = currentLeft + (startWidth - newWidth) + "px";
          }
          if (newHeight !== startHeight - deltaY) {
            const currentTop = parseInt(draggedElement.style.top) || 0;
            draggedElement.style.top = currentTop + (startHeight - newHeight) + "px";
          }
          break;
      }

      // 应用磁性对齐到调整大小
      const resizeAlignment = checkResizeBoundaryAlignment(draggedElement, newWidth, newHeight);
      if (resizeAlignment.aligned) {
        newWidth = resizeAlignment.width;
        newHeight = resizeAlignment.height;

        // 显示对齐指示线
        showResizeAlignmentGuides(resizeAlignment.targets);
      } else {
        // 清除对齐指示线
        clearResizeAlignmentGuides();
      }

      // 应用新尺寸
      applySize(draggedElement, newWidth, newHeight);

      // 显示尺寸信息
      showSizeIndicator(newWidth, newHeight);
    }

    // 更新实时信息显示
    updateRealTimeInfo(draggedElement);
  }

  // 应用尺寸（保持原始单位）
  function applySize(element, width, height) {
    if (
      resizeMode.includes("e") ||
      resizeMode.includes("w") ||
      resizeMode === "resize-se" ||
      resizeMode === "resize-sw" ||
      resizeMode === "resize-ne" ||
      resizeMode === "resize-nw"
    ) {
      // 需要调整宽度
      if (originalWidthUnit === "%") {
        const parentWidth = element.parentElement.getBoundingClientRect().width;
        const percentage = (width / parentWidth) * 100;
        element.style.width = Math.max(5, percentage).toFixed(2) + "%";
      } else {
        element.style.width = Math.max(10, width) + originalWidthUnit;
      }
    }

    if (
      resizeMode.includes("s") ||
      resizeMode.includes("n") ||
      resizeMode === "resize-se" ||
      resizeMode === "resize-sw" ||
      resizeMode === "resize-ne" ||
      resizeMode === "resize-nw"
    ) {
      // 需要调整高度
      if (originalHeightUnit === "%") {
        const parentHeight = element.parentElement.getBoundingClientRect().height;
        const percentage = (height / parentHeight) * 100;
        element.style.height = Math.max(5, percentage).toFixed(2) + "%";
      } else {
        element.style.height = Math.max(10, height) + originalHeightUnit;
      }
    }
  }

  // 显示尺寸指示器
  function showSizeIndicator(width, height) {
    // 清除之前的指示器
    document.querySelectorAll(".size-indicator").forEach((el) => el.remove());

    const indicator = document.createElement("div");
    indicator.className = "size-indicator";

    let text = "";
    if (
      resizeMode.includes("e") ||
      resizeMode.includes("w") ||
      resizeMode === "resize-se" ||
      resizeMode === "resize-sw" ||
      resizeMode === "resize-ne" ||
      resizeMode === "resize-nw"
    ) {
      if (originalWidthUnit === "%") {
        const parentWidth = draggedElement.parentElement.getBoundingClientRect().width;
        const percentage = (width / parentWidth) * 100;
        text += `W: ${percentage.toFixed(1)}%`;
      } else {
        text += `W: ${Math.round(width)}${originalWidthUnit}`;
      }
    }

    if (
      resizeMode.includes("s") ||
      resizeMode.includes("n") ||
      resizeMode === "resize-se" ||
      resizeMode === "resize-sw" ||
      resizeMode === "resize-ne" ||
      resizeMode === "resize-nw"
    ) {
      if (text) text += " ";
      if (originalHeightUnit === "%") {
        const parentHeight = draggedElement.parentElement.getBoundingClientRect().height;
        const percentage = (height / parentHeight) * 100;
        text += `H: ${percentage.toFixed(1)}%`;
      } else {
        text += `H: ${Math.round(height)}${originalHeightUnit}`;
      }
    }

    indicator.textContent = text;

    // 定位到鼠标附近
    indicator.style.left = startX + 20 + "px";
    indicator.style.top = startY - 30 + "px";

    document.body.appendChild(indicator);
  }

  // 停止拖拽
  function stopDrag(e) {
    if (!draggedElement) return;

    draggedElement.classList.remove("drag-active");
    document.body.style.cursor = "default";

    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", stopDrag);

    // 清除指示器
    clearDistanceIndicators();
    document.querySelectorAll(".size-indicator").forEach((el) => el.remove());
    document.querySelectorAll(".center-guide-line").forEach((el) => el.remove());

    // 重置居中状态
    isHorizontalCentered = false;
    isVerticalCentered = false;

    // 重置左边缘对齐状态
    isLeftEdgeAligned = false;
    leftEdgeAlignmentTargets = [];

    // 重置边缘到边缘对齐状态
    isEdgeToEdgeAligned = false;
    edgeToEdgeAlignmentTargets = [];
    edgeToEdgeAlignmentType = null;

    // 重置垂直边缘到边缘对齐状态
    isVerticalEdgeToEdgeAligned = false;
    verticalEdgeToEdgeAlignmentTargets = [];
    verticalEdgeToEdgeAlignmentType = null;

    // 重置同边缘对齐状态
    isSameEdgeAligned = false;
    sameEdgeAlignmentTargets = [];
    sameEdgeAlignmentType = null;

    // 重置父边界对齐状态
    isParentBoundaryAligned = false;
    parentBoundaryAlignmentType = null;
    parentBoundaryTarget = null;

    draggedElement = null;
    resizeMode = null;
  }

  // 获取父级元素
  function getParentElement(draggedElement) {
    const parent = draggedElement.parentElement;

    // 跳过控制面板和一些特殊元素
    if (!parent || parent === document.body || parent === document.documentElement || parent.closest("#drag-control-panel")) {
      return null;
    }

    return parent;
  }

  // 创建层级检查器面板
  function createInspectorPanel() {
    if (inspectorPanel) {
      return inspectorPanel;
    }

    inspectorPanel = document.createElement("div");
    inspectorPanel.className = "hierarchy-inspector";
    inspectorPanel.innerHTML = `
      <div class="inspector-header">
        <span class="inspector-title">🔍 元素层级检查器</span>
        <div class="inspector-controls">
          <button class="inspector-btn inspector-position" id="inspector-position-btn" title="切换位置">📍</button>
          <button class="inspector-btn inspector-minimize" id="inspector-minimize-btn" title="最小化/展开">−</button>
          <button class="inspector-btn inspector-close" id="inspector-close-btn" title="关闭">×</button>
        </div>
      </div>
      <div class="inspector-content">
        <div id="hierarchy-tree-container"></div>
      </div>
    `;

    // 添加按钮事件
    const closeBtn = inspectorPanel.querySelector("#inspector-close-btn");
    const minimizeBtn = inspectorPanel.querySelector("#inspector-minimize-btn");
    const positionBtn = inspectorPanel.querySelector("#inspector-position-btn");

    closeBtn.addEventListener("click", hideInspectorPanel);
    minimizeBtn.addEventListener("click", toggleInspectorMinimize);
    positionBtn.addEventListener("click", toggleInspectorPosition);

    document.body.appendChild(inspectorPanel);
    return inspectorPanel;
  }

  // 显示检查器面板
  function showInspectorPanel(element) {
    if (!element) return;

    createInspectorPanel();
    updateInspectorContent(element);
    isInspectorVisible = true;
    inspectorPanel.style.display = "block";

    // 恢复最小化状态
    if (isInspectorMinimized) {
      inspectorPanel.classList.add("minimized");
      const minimizeBtn = inspectorPanel.querySelector("#inspector-minimize-btn");
      if (minimizeBtn) {
        minimizeBtn.classList.add("minimized");
        minimizeBtn.textContent = "+";
        minimizeBtn.title = "展开面板";
      }
      const content = inspectorPanel.querySelector(".inspector-content");
      if (content) {
        content.style.display = "none";
        content.style.opacity = "0";
      }
    } else {
      inspectorPanel.classList.remove("minimized");
      const minimizeBtn = inspectorPanel.querySelector("#inspector-minimize-btn");
      if (minimizeBtn) {
        minimizeBtn.classList.remove("minimized");
        minimizeBtn.textContent = "−";
        minimizeBtn.title = "最小化面板";
      }
      const content = inspectorPanel.querySelector(".inspector-content");
      if (content) {
        content.style.display = "block";
        content.style.opacity = "1";
      }
    }

    // 更新按钮状态
    updateInspectorButtonState();
  }

  // 隐藏检查器面板
  function hideInspectorPanel() {
    if (inspectorPanel) {
      inspectorPanel.style.display = "none";
      isInspectorVisible = false;
      // 注意：不重置最小化状态，保持用户的偏好设置
      // 更新按钮状态
      updateInspectorButtonState();
    }
  }

  // 切换检查器面板最小化状态
  function toggleInspectorMinimize() {
    if (!inspectorPanel) return;

    const minimizeBtn = inspectorPanel.querySelector("#inspector-minimize-btn");

    if (isInspectorMinimized) {
      // 展开面板
      inspectorPanel.classList.remove("minimized");
      minimizeBtn.classList.remove("minimized");
      minimizeBtn.textContent = "−";
      minimizeBtn.title = "最小化面板";
      isInspectorMinimized = false;

      // 添加展开动画效果
      const content = inspectorPanel.querySelector(".inspector-content");
      if (content) {
        content.style.display = "block";
        // 延迟显示内容以配合动画
        setTimeout(() => {
          content.style.opacity = "1";
        }, 50);
      }
    } else {
      // 最小化面板
      const content = inspectorPanel.querySelector(".inspector-content");
      if (content) {
        content.style.opacity = "0";
        // 延迟隐藏内容以配合动画
        setTimeout(() => {
          content.style.display = "none";
        }, 200);
      }

      inspectorPanel.classList.add("minimized");
      minimizeBtn.classList.add("minimized");
      minimizeBtn.textContent = "+";
      minimizeBtn.title = "展开面板";
      isInspectorMinimized = true;
    }
  }

  // 切换检查器面板位置
  function toggleInspectorPosition() {
    if (!inspectorPanel) return;

    const isBottomPosition = inspectorPanel.classList.contains("bottom-position");
    const positionBtn = inspectorPanel.querySelector("#inspector-position-btn");

    // 添加位置切换动画
    inspectorPanel.style.transition = "all 0.3s ease";

    if (isBottomPosition) {
      // 切换到左侧位置
      inspectorPanel.classList.remove("bottom-position");
      positionBtn.title = "移动到底部";
    } else {
      // 切换到底部位置
      inspectorPanel.classList.add("bottom-position");
      positionBtn.title = "移动到左侧";
    }

    // 保持最小化状态不变
    // 最小化状态由 isInspectorMinimized 变量控制，不受位置切换影响
  }

  // 更新检查器内容
  function updateInspectorContent(element) {
    if (!inspectorPanel || !element) return;

    const container = inspectorPanel.querySelector("#hierarchy-tree-container");
    container.innerHTML = "";

    // 获取层级结构
    const hierarchy = buildElementHierarchy(element);

    // 渲染层级树
    renderHierarchyTree(container, hierarchy, element);
  }

  // 构建元素层级结构
  function buildElementHierarchy(element) {
    const hierarchy = {
      ancestors: [],
      current: element,
      siblings: [],
      children: [],
    };

    // 获取祖先元素（向上3层）
    let parent = element.parentElement;
    let level = 0;
    while (parent && level < 3 && parent !== document.body) {
      hierarchy.ancestors.unshift({ element: parent, level: level });
      parent = parent.parentElement;
      level++;
    }

    // 获取兄弟元素
    if (element.parentElement) {
      Array.from(element.parentElement.children).forEach((child) => {
        if (child !== element && !child.closest("#drag-control-panel") && !child.classList.contains("hierarchy-inspector")) {
          hierarchy.siblings.push(child);
        }
      });
    }

    // 获取子元素（只显示直接子元素）
    Array.from(element.children).forEach((child) => {
      if (!child.closest("#drag-control-panel") && !child.classList.contains("hierarchy-inspector")) {
        hierarchy.children.push(child);
      }
    });

    return hierarchy;
  }

  // 渲染层级树
  function renderHierarchyTree(container, hierarchy, currentElement) {
    // 渲染祖先元素
    if (hierarchy.ancestors.length > 0) {
      const ancestorsSection = document.createElement("div");
      ancestorsSection.innerHTML = '<div class="section-header">📁 父级元素</div>';

      hierarchy.ancestors.forEach((ancestor) => {
        const item = createHierarchyItem(ancestor.element, "parent", ancestor.level);
        ancestorsSection.appendChild(item);
      });

      container.appendChild(ancestorsSection);
    }

    // 渲染当前元素
    const currentSection = document.createElement("div");
    currentSection.innerHTML = '<div class="section-header">🎯 当前元素</div>';
    const currentItem = createHierarchyItem(currentElement, "current", 0);
    currentSection.appendChild(currentItem);
    container.appendChild(currentSection);

    // 渲染兄弟元素
    if (hierarchy.siblings.length > 0) {
      const siblingsSection = document.createElement("div");
      siblingsSection.innerHTML = '<div class="section-header">👥 兄弟元素</div>';

      hierarchy.siblings.forEach((sibling) => {
        const item = createHierarchyItem(sibling, "sibling", 0);
        siblingsSection.appendChild(item);
      });

      container.appendChild(siblingsSection);
    }

    // 渲染子元素
    if (hierarchy.children.length > 0) {
      const childrenSection = document.createElement("div");
      childrenSection.innerHTML = '<div class="section-header">📦 子元素</div>';

      hierarchy.children.forEach((child) => {
        const item = createHierarchyItem(child, "child", 1);
        childrenSection.appendChild(item);
      });

      container.appendChild(childrenSection);
    }
  }

  // 创建层级项目
  function createHierarchyItem(element, type, level) {
    const item = document.createElement("div");
    item.className = `hierarchy-item ${type} hierarchy-level-${level}`;

    const tagName = element.tagName.toLowerCase();
    const className = element.className
      ? `.${element.className
          .split(" ")
          .filter((c) => c && !c.startsWith("drag-") && !c.startsWith("element-"))
          .join(".")}`
      : "";
    const id = element.id ? `#${element.id}` : "";

    const rect = element.getBoundingClientRect();
    const info = `${Math.round(rect.width)}×${Math.round(rect.height)} @ (${Math.round(rect.left)}, ${Math.round(rect.top)})`;

    item.innerHTML = `
      <span class="element-tag">${tagName}</span>
      <span class="element-class">${className}</span>
      <span class="element-id">${id}</span>
      <span class="element-info">${info}</span>
    `;

    // 添加点击事件
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      activateElementFromInspector(element);
    });

    // 添加悬停效果
    item.addEventListener("mouseenter", () => {
      element.style.outline = "2px solid #3498db";
      element.style.outlineOffset = "2px";
    });

    item.addEventListener("mouseleave", () => {
      element.style.outline = "";
      element.style.outlineOffset = "";
    });

    return item;
  }

  // 从检查器激活元素
  function activateElementFromInspector(element) {
    activateElement(element);
    updateInspectorContent(element);
  }

  // 提取元素样式属性
  function extractElementStyles(element) {
    if (!element) return null;

    const computedStyle = window.getComputedStyle(element);
    const inlineStyle = element.style;

    // 检测元素的定位上下文
    const positioningContext = detectElementPositioningContext(element);

    let styles = {};

    if (positioningContext && positioningContext.positioningType === "absolute") {
      // 绝对定位元素：只复制position/left/top/width/height属性
      styles = {
        position: computedStyle.position,
        left: inlineStyle.left || computedStyle.left || "auto",
        top: inlineStyle.top || computedStyle.top || "auto",
        width: inlineStyle.width || computedStyle.width || "auto",
        height: inlineStyle.height || computedStyle.height || "auto",
      };

      // 处理auto值，尝试获取实际计算值
      if (styles.left === "auto") {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement ? element.parentElement.getBoundingClientRect() : { left: 0 };
        styles.left = Math.round(rect.left - parentRect.left) + "px";
      }

      if (styles.top === "auto") {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement ? element.parentElement.getBoundingClientRect() : { top: 0 };
        styles.top = Math.round(rect.top - parentRect.top) + "px";
      }
    } else {
      // 正常文档流元素：复制margin属性
      styles = {
        position: computedStyle.position,
        marginLeft: inlineStyle.marginLeft || computedStyle.marginLeft || "0px",
        marginTop: inlineStyle.marginTop || computedStyle.marginTop || "0px",
        marginRight: inlineStyle.marginRight || computedStyle.marginRight || "0px",
        marginBottom: inlineStyle.marginBottom || computedStyle.marginBottom || "0px",
        width: inlineStyle.width || computedStyle.width || "auto",
        height: inlineStyle.height || computedStyle.height || "auto",
      };
    }

    // 处理尺寸属性
    if (styles.width === "auto") {
      styles.width = Math.round(element.getBoundingClientRect().width) + "px";
    }

    if (styles.height === "auto") {
      styles.height = Math.round(element.getBoundingClientRect().height) + "px";
    }

    // 添加定位类型信息
    styles.positioningType = positioningContext ? positioningContext.positioningType : "normal";

    return styles;
  }

  // 格式化样式为不同格式
  function formatStyles(styles, format) {
    if (!styles) return "";

    let cssString = "";
    let valuesString = "";

    if (styles.positioningType === "absolute") {
      // 绝对定位元素格式（只包含position, left, top, width, height）
      cssString = `position: ${styles.position}; left: ${styles.left}; top: ${styles.top}; width: ${styles.width}; height: ${styles.height};`;
      valuesString = `${styles.left}, ${styles.top}, ${styles.width}, ${styles.height}`;
    } else {
      // 正常文档流元素格式
      cssString = `position: ${styles.position}; margin-left: ${styles.marginLeft}; margin-top: ${styles.marginTop}; width: ${styles.width}; height: ${styles.height};`;
      if (styles.marginRight !== "0px") cssString += ` margin-right: ${styles.marginRight};`;
      if (styles.marginBottom !== "0px") cssString += ` margin-bottom: ${styles.marginBottom};`;
      valuesString = `${styles.marginLeft}, ${styles.marginTop}, ${styles.width}, ${styles.height}`;
    }

    switch (format) {
      case "css":
        return cssString;

      case "json":
        // 创建一个不包含positioningType的副本用于JSON输出
        const jsonStyles = { ...styles };
        delete jsonStyles.positioningType;
        return JSON.stringify(jsonStyles, null, 2);

      case "values":
        return valuesString;

      default:
        return cssString;
    }
  }

  // 复制样式到剪贴板
  async function copyStylesToClipboard() {
    if (!activeElement) {
      showCopyNotification("warning", "⚠️ 没有激活的元素", "请先双击激活一个元素");
      return;
    }

    try {
      const styles = extractElementStyles(activeElement);
      const format = document.getElementById("copy-format").value;
      const formattedStyles = formatStyles(styles, format);

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(formattedStyles);
        showCopyNotification("success", "✅ 复制成功！", formattedStyles, format);
      } else {
        // 降级方案：显示模态框供手动复制
        showCopyFallback(formattedStyles, format);
      }
    } catch (error) {
      console.error("复制失败:", error);
      showCopyNotification("error", "❌ 复制失败", "剪贴板访问被拒绝或不可用");
    }
  }

  // 显示复制通知
  function showCopyNotification(type, title, content, format = "") {
    // 移除现有通知
    const existingNotification = document.querySelector(".copy-notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `copy-notification ${type}`;

    let formatLabel = "";
    if (format) {
      switch (format) {
        case "css":
          formatLabel = "CSS 格式";
          break;
        case "json":
          formatLabel = "JSON 格式";
          break;
        case "values":
          formatLabel = "数值格式";
          break;
      }
    }

    notification.innerHTML = `
      <div>${title}</div>
      ${formatLabel ? `<div class="copy-format-label">${formatLabel}</div>` : ""}
      ${content ? `<div class="copy-content">${content}</div>` : ""}
    `;

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
      if (notification.parentNode) {
        notification.style.animation = "copyNotificationShow 0.3s ease-out reverse";
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    }, 3000);
  }

  // 降级方案：显示复制内容供手动复制
  function showCopyFallback(content, format) {
    let formatLabel = "";
    switch (format) {
      case "css":
        formatLabel = "CSS 格式";
        break;
      case "json":
        formatLabel = "JSON 格式";
        break;
      case "values":
        formatLabel = "数值格式";
        break;
    }

    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10003;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    modal.innerHTML = `
      <div style="background: white; padding: 30px; border-radius: 12px; max-width: 500px; width: 90%;">
        <h3 style="margin-top: 0; color: #333;">📋 手动复制样式</h3>
        <p style="color: #666; margin-bottom: 15px;">剪贴板API不可用，请手动复制以下内容：</p>
        <div style="background: #f5f5f5; padding: 10px; border-radius: 6px; margin-bottom: 15px;">
          <div style="font-size: 12px; color: #888; margin-bottom: 5px;">${formatLabel}</div>
          <textarea readonly style="width: 100%; height: 100px; border: 1px solid #ddd; border-radius: 4px; padding: 8px; font-family: monospace; font-size: 12px; resize: vertical;">${content}</textarea>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="background: #4CAF50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
      </div>
    `;

    document.body.appendChild(modal);

    // 自动选中文本
    const textarea = modal.querySelector("textarea");
    textarea.focus();
    textarea.select();
  }

  // 更新复制按钮状态
  function updateCopyButtonState() {
    const copyBtn = document.getElementById("copy-styles");
    if (copyBtn) {
      copyBtn.disabled = !activeElement;
      copyBtn.title = activeElement ? `复制当前激活元素的样式 (${activeElement.tagName.toLowerCase()})` : "请先双击激活一个元素";
    }
  }

  // 更新检查器按钮状态
  function updateInspectorButtonState() {
    const inspectorBtn = document.getElementById("toggle-inspector");
    if (inspectorBtn) {
      inspectorBtn.disabled = !activeElement;

      if (!activeElement) {
        inspectorBtn.textContent = "🔍 检查器";
        inspectorBtn.title = "请先双击激活一个元素";
      } else {
        if (isInspectorVisible) {
          inspectorBtn.textContent = "🔍 隐藏检查器";
          inspectorBtn.title = `隐藏层级检查器 (${activeElement.tagName.toLowerCase()})`;
        } else {
          inspectorBtn.textContent = "🔍 显示检查器";
          inspectorBtn.title = `显示层级检查器 (${activeElement.tagName.toLowerCase()})`;
        }
      }
    }
  }

  // 切换检查器面板显示/隐藏
  function toggleInspectorPanel() {
    if (!activeElement) {
      return; // 没有激活元素时不执行
    }

    if (isInspectorVisible) {
      // 隐藏检查器
      hideInspectorPanel();
    } else {
      // 显示检查器，使用当前激活的元素
      showInspectorPanel(activeElement);
    }

    // 更新最后检查的元素
    lastInspectedElement = activeElement;

    // 更新按钮状态
    updateInspectorButtonState();
  }

  // 激活元素
  function activateElement(element) {
    // 先取消之前激活的元素
    deactivateAllElements();

    // 激活新元素
    activeElement = element;
    element.classList.add("element-active");

    // 显示激活提示
    showActivationFeedback(element);

    // 如果检查器面板当前可见，更新其内容
    if (isInspectorVisible && inspectorPanel) {
      updateInspectorContent(element);
    }

    // 记录最后检查的元素
    lastInspectedElement = element;

    // 更新按钮状态
    updateCopyButtonState();
    updateInspectorButtonState();

    // 更新实时信息显示
    updateRealTimeInfo(element);
  }

  // 取消所有元素的激活状态
  function deactivateAllElements() {
    if (activeElement) {
      activeElement.classList.remove("element-active");
      activeElement = null;
    }

    // 清除所有可能的激活状态
    document.querySelectorAll(".element-active").forEach((el) => {
      el.classList.remove("element-active");
    });

    // 隐藏检查器面板
    hideInspectorPanel();

    // 更新按钮状态
    updateCopyButtonState();
    updateInspectorButtonState();

    // 更新实时信息显示（隐藏）
    updateRealTimeInfo(null);
  }

  // 显示激活反馈
  function showActivationFeedback(element) {
    const rect = element.getBoundingClientRect();
    const feedback = document.createElement("div");
    feedback.className = "double-click-hint";
    feedback.textContent = "✨ 元素已激活，可以拖拽了！";
    feedback.style.left = rect.left + rect.width / 2 - 80 + "px";
    feedback.style.top = rect.top - 40 + "px";

    document.body.appendChild(feedback);

    // 2秒后自动移除
    setTimeout(() => {
      if (feedback.parentNode) {
        feedback.parentNode.removeChild(feedback);
      }
    }, 2000);
  }

  // 显示双击提示
  function showDoubleClickHint(element, x, y) {
    const hint = document.createElement("div");
    hint.className = "double-click-hint";
    hint.textContent = "💡 双击激活元素后可拖拽";
    hint.style.left = x - 80 + "px";
    hint.style.top = y - 40 + "px";

    document.body.appendChild(hint);

    // 2秒后自动移除
    setTimeout(() => {
      if (hint.parentNode) {
        hint.parentNode.removeChild(hint);
      }
    }, 2000);
  }

  // 检测双击
  function handleElementClick(e) {
    if (!isDragMode) return;

    const currentTime = Date.now();
    const target = e.target;

    // 跳过控制面板
    if (target.closest("#drag-control-panel")) {
      return;
    }

    // 检查是否为双击
    if (lastClickTarget === target && currentTime - lastClickTime < doubleClickDelay) {
      // 双击 - 激活元素
      e.preventDefault();
      e.stopPropagation();
      activateElement(target);
    } else {
      // 单击 - 显示提示或取消激活
      if (target === activeElement) {
        // 点击已激活的元素，保持激活状态
        return;
      } else if (activeElement && !target.closest("#drag-control-panel")) {
        // 点击其他地方，显示双击提示
        showDoubleClickHint(target, e.clientX, e.clientY);
      }
    }

    lastClickTime = currentTime;
    lastClickTarget = target;
  }

  // 检测元素的定位上下文
  function detectElementPositioningContext(element) {
    if (!element) return null;

    const computedStyle = window.getComputedStyle(element);
    const inlineStyle = element.style;

    // 检查CSS position属性
    const position = computedStyle.position;

    // 检查是否有明确的left/top值设置（只检查内联样式，不检查计算样式）
    const hasExplicitLeft = inlineStyle.left !== "" && inlineStyle.left !== "auto";
    const hasExplicitTop = inlineStyle.top !== "" && inlineStyle.top !== "auto";

    // 判断定位类型
    let positioningType = "normal"; // 默认为正常文档流

    if (position === "absolute" || position === "fixed") {
      positioningType = "absolute";
    } else if (position === "relative" && (hasExplicitLeft || hasExplicitTop)) {
      positioningType = "absolute";
    } else if (position === "static" || position === "relative") {
      positioningType = "normal";
    }

    // 调试信息
    console.log("Position Detection Debug:", {
      element: element.tagName + (element.className ? "." + element.className : ""),
      position: position,
      computedLeft: computedStyle.left,
      computedTop: computedStyle.top,
      inlineLeft: inlineStyle.left,
      inlineTop: inlineStyle.top,
      hasExplicitLeft: hasExplicitLeft,
      hasExplicitTop: hasExplicitTop,
      positioningType: positioningType,
    });

    return {
      position: position,
      positioningType: positioningType,
      hasExplicitLeft: hasExplicitLeft,
      hasExplicitTop: hasExplicitTop,
      currentLeft: parseFloat(computedStyle.left) || 0,
      currentTop: parseFloat(computedStyle.top) || 0,
      currentMarginLeft: parseFloat(computedStyle.marginLeft) || 0,
      currentMarginTop: parseFloat(computedStyle.marginTop) || 0,
    };
  }

  // 获取父元素边界信息
  function getParentBoundaries(element) {
    if (!element || !element.parentElement) {
      return null;
    }

    const parent = element.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const parentStyle = window.getComputedStyle(parent);

    // 获取父元素的内边距
    const paddingLeft = parseFloat(parentStyle.paddingLeft) || 0;
    const paddingTop = parseFloat(parentStyle.paddingTop) || 0;
    const paddingRight = parseFloat(parentStyle.paddingRight) || 0;
    const paddingBottom = parseFloat(parentStyle.paddingBottom) || 0;

    // 计算父元素的内容区域边界（排除内边距）
    return {
      left: parentRect.left + paddingLeft,
      top: parentRect.top + paddingTop,
      right: parentRect.right - paddingRight,
      bottom: parentRect.bottom - paddingBottom,
      width: parentRect.width - paddingLeft - paddingRight,
      height: parentRect.height - paddingTop - paddingBottom,
      element: parent,
    };
  }

  // 检查调整大小时的父边界对齐
  function checkResizeBoundaryAlignment(draggedElement, newWidth, newHeight) {
    if (!enableMagneticAlign || !draggedElement) {
      return { width: newWidth, height: newHeight, aligned: false };
    }

    const parentBoundaries = getParentBoundaries(draggedElement);
    if (!parentBoundaries) {
      return { width: newWidth, height: newHeight, aligned: false };
    }

    const draggedRect = draggedElement.getBoundingClientRect();
    let finalWidth = newWidth;
    let finalHeight = newHeight;
    let alignmentDetected = false;
    let alignmentTargets = [];

    // 计算元素当前位置
    const elementLeft = draggedRect.left;
    const elementTop = draggedRect.top;

    // 检查右边界对齐（仅在调整宽度时）
    if (resizeMode.includes("e")) {
      const futureRight = elementLeft + newWidth;
      const rightDistance = Math.abs(futureRight - parentBoundaries.right);

      if (rightDistance <= parentBoundaryAlignTolerance) {
        finalWidth = parentBoundaries.right - elementLeft;
        alignmentDetected = true;
        alignmentTargets.push({
          type: "right",
          x: parentBoundaries.right,
          y: parentBoundaries.top,
          width: 2,
          height: parentBoundaries.height,
        });
      }
    }

    // 检查底边界对齐（仅在调整高度时）
    if (resizeMode.includes("s")) {
      const futureBottom = elementTop + newHeight;
      const bottomDistance = Math.abs(futureBottom - parentBoundaries.bottom);

      if (bottomDistance <= parentBoundaryAlignTolerance) {
        finalHeight = parentBoundaries.bottom - elementTop;
        alignmentDetected = true;
        alignmentTargets.push({
          type: "bottom",
          x: parentBoundaries.left,
          y: parentBoundaries.bottom,
          width: parentBoundaries.width,
          height: 2,
        });
      }
    }

    return {
      width: finalWidth,
      height: finalHeight,
      aligned: alignmentDetected,
      targets: alignmentTargets,
      parentBoundaries: parentBoundaries,
    };
  }

  // 检查父边界对齐
  function checkParentBoundaryAlignment(draggedElement, targetLeft, targetTop) {
    if (!enableMagneticAlign || !draggedElement) {
      return { left: targetLeft, top: targetTop, aligned: false };
    }

    const parentBoundaries = getParentBoundaries(draggedElement);
    if (!parentBoundaries) {
      return { left: targetLeft, top: targetTop, aligned: false };
    }

    const draggedRect = draggedElement.getBoundingClientRect();
    const draggedWidth = draggedRect.width;
    const draggedHeight = draggedRect.height;

    let finalLeft = targetLeft;
    let finalTop = targetTop;
    let alignmentDetected = false;
    let alignmentType = null;
    let alignmentTarget = null;

    // 计算拖拽元素在目标位置的边界
    const futureLeft = parentBoundaries.left + targetLeft;
    const futureTop = parentBoundaries.top + targetTop;
    const futureRight = futureLeft + draggedWidth;
    const futureBottom = futureTop + draggedHeight;

    // 检查左边界对齐
    const leftDistance = Math.abs(futureLeft - parentBoundaries.left);
    if (leftDistance <= parentBoundaryAlignTolerance) {
      finalLeft = 0; // 相对于父元素的left: 0
      alignmentDetected = true;
      alignmentType = "left";
      alignmentTarget = {
        x: parentBoundaries.left,
        y: parentBoundaries.top,
        width: 2,
        height: parentBoundaries.height,
      };
    }

    // 检查右边界对齐
    const rightDistance = Math.abs(futureRight - parentBoundaries.right);
    if (rightDistance <= parentBoundaryAlignTolerance) {
      finalLeft = parentBoundaries.width - draggedWidth;
      alignmentDetected = true;
      alignmentType = "right";
      alignmentTarget = {
        x: parentBoundaries.right,
        y: parentBoundaries.top,
        width: 2,
        height: parentBoundaries.height,
      };
    }

    // 检查上边界对齐
    const topDistance = Math.abs(futureTop - parentBoundaries.top);
    if (topDistance <= parentBoundaryAlignTolerance) {
      finalTop = 0; // 相对于父元素的top: 0
      alignmentDetected = true;
      alignmentType = "top";
      alignmentTarget = {
        x: parentBoundaries.left,
        y: parentBoundaries.top,
        width: parentBoundaries.width,
        height: 2,
      };
    }

    // 检查下边界对齐
    const bottomDistance = Math.abs(futureBottom - parentBoundaries.bottom);
    if (bottomDistance <= parentBoundaryAlignTolerance) {
      finalTop = parentBoundaries.height - draggedHeight;
      alignmentDetected = true;
      alignmentType = "bottom";
      alignmentTarget = {
        x: parentBoundaries.left,
        y: parentBoundaries.bottom,
        width: parentBoundaries.width,
        height: 2,
      };
    }

    return {
      left: finalLeft,
      top: finalTop,
      aligned: alignmentDetected,
      type: alignmentType,
      target: alignmentTarget,
      parentBoundaries: parentBoundaries,
    };
  }

  // 获取元素的自然左边缘位置（left: 0 或计算位置）
  function getNaturalLeftPosition(element) {
    // 优先使用CSS left值（如果设置为0或明确值）
    const cssLeft = element.style.left;
    if (cssLeft && cssLeft !== "") {
      const leftValue = parseInt(cssLeft);
      if (leftValue === 0) {
        // 如果CSS left明确设置为0，使用父元素左边缘作为参考
        const parentRect = element.parentElement ? element.parentElement.getBoundingClientRect() : { left: 0 };
        return parentRect.left;
      }
    }

    // 否则使用元素当前的左边缘位置
    return element.getBoundingClientRect().left;
  }

  // 检测边缘到边缘对齐机会（水平）
  function detectEdgeToEdgeAlignment(draggedRect, siblings) {
    const alignmentOpportunities = [];

    siblings.forEach((sibling) => {
      const siblingRect = sibling.rect;

      // 检查拖拽元素右边缘到兄弟元素左边缘的距离
      const rightToLeftDiff = Math.abs(draggedRect.right - siblingRect.left);
      if (rightToLeftDiff <= edgeToEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "right-to-left",
          sibling: sibling,
          targetPosition: siblingRect.left,
          diff: rightToLeftDiff,
          draggedEdge: "right",
          siblingEdge: "left",
        });
      }

      // 检查拖拽元素左边缘到兄弟元素右边缘的距离
      const leftToRightDiff = Math.abs(draggedRect.left - siblingRect.right);
      if (leftToRightDiff <= edgeToEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "left-to-right",
          sibling: sibling,
          targetPosition: siblingRect.right,
          diff: leftToRightDiff,
          draggedEdge: "left",
          siblingEdge: "right",
        });
      }
    });

    // 按距离排序，最近的在前
    return alignmentOpportunities.sort((a, b) => a.diff - b.diff);
  }

  // 检测垂直边缘到边缘对齐机会
  function detectVerticalEdgeToEdgeAlignment(draggedRect, siblings) {
    const alignmentOpportunities = [];

    siblings.forEach((sibling) => {
      const siblingRect = sibling.rect;

      // 检查拖拽元素下边缘到兄弟元素上边缘的距离
      const bottomToTopDiff = Math.abs(draggedRect.bottom - siblingRect.top);
      if (bottomToTopDiff <= verticalEdgeToEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "bottom-to-top",
          sibling: sibling,
          targetPosition: siblingRect.top,
          diff: bottomToTopDiff,
          draggedEdge: "bottom",
          siblingEdge: "top",
        });
      }

      // 检查拖拽元素上边缘到兄弟元素下边缘的距离
      const topToBottomDiff = Math.abs(draggedRect.top - siblingRect.bottom);
      if (topToBottomDiff <= verticalEdgeToEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "top-to-bottom",
          sibling: sibling,
          targetPosition: siblingRect.bottom,
          diff: topToBottomDiff,
          draggedEdge: "top",
          siblingEdge: "bottom",
        });
      }
    });

    // 按距离排序，最近的在前
    return alignmentOpportunities.sort((a, b) => a.diff - b.diff);
  }

  // 检测同边缘对齐机会
  function detectSameEdgeAlignment(draggedRect, siblings) {
    const alignmentOpportunities = [];

    siblings.forEach((sibling) => {
      const siblingRect = sibling.rect;

      // 检查拖拽元素上边缘到兄弟元素上边缘的距离
      const topToTopDiff = Math.abs(draggedRect.top - siblingRect.top);
      if (topToTopDiff <= sameEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "top-to-top",
          sibling: sibling,
          targetPosition: siblingRect.top,
          diff: topToTopDiff,
          draggedEdge: "top",
          siblingEdge: "top",
        });
      }

      // 检查拖拽元素下边缘到兄弟元素下边缘的距离
      const bottomToBottomDiff = Math.abs(draggedRect.bottom - siblingRect.bottom);
      if (bottomToBottomDiff <= sameEdgeAlignTolerance) {
        alignmentOpportunities.push({
          type: "bottom-to-bottom",
          sibling: sibling,
          targetPosition: siblingRect.bottom,
          diff: bottomToBottomDiff,
          draggedEdge: "bottom",
          siblingEdge: "bottom",
        });
      }
    });

    // 按距离排序，最近的在前
    return alignmentOpportunities.sort((a, b) => a.diff - b.diff);
  }

  // 获取兄弟元素（在检测范围内）
  function getSiblingElements(draggedElement) {
    const parent = draggedElement.parentElement;
    if (!parent) return [];

    const draggedRect = draggedElement.getBoundingClientRect();
    const siblings = [];

    // 获取所有兄弟元素
    Array.from(parent.children).forEach((child) => {
      if (child === draggedElement || child.closest("#drag-control-panel")) {
        return; // 跳过自己和控制面板
      }

      const childRect = child.getBoundingClientRect();

      // 计算距离（使用元素中心点）
      const draggedCenterX = draggedRect.left + draggedRect.width / 2;
      const draggedCenterY = draggedRect.top + draggedRect.height / 2;
      const childCenterX = childRect.left + childRect.width / 2;
      const childCenterY = childRect.top + childRect.height / 2;

      const distance = Math.sqrt(Math.pow(draggedCenterX - childCenterX, 2) + Math.pow(draggedCenterY - childCenterY, 2));

      // 只包含在检测范围内的兄弟元素
      if (distance <= siblingDetectionRange) {
        siblings.push({
          element: child,
          rect: childRect,
          distance: distance,
          naturalLeftPosition: getNaturalLeftPosition(child), // 添加自然左边缘位置
        });
      }
    });

    // 按距离排序，最近的在前
    return siblings.sort((a, b) => a.distance - b.distance);
  }

  // 计算兄弟元素距离
  function calculateSiblingDistances(draggedRect, siblingRect) {
    const distances = {};

    // 计算各个方向的距离
    // 左边距离：兄弟元素右边缘到拖拽元素左边缘
    if (siblingRect.right <= draggedRect.left) {
      distances.left = draggedRect.left - siblingRect.right;
    }

    // 右边距离：拖拽元素右边缘到兄弟元素左边缘
    if (draggedRect.right <= siblingRect.left) {
      distances.right = siblingRect.left - draggedRect.right;
    }

    // 上边距离：兄弟元素下边缘到拖拽元素上边缘
    if (siblingRect.bottom <= draggedRect.top) {
      distances.top = draggedRect.top - siblingRect.bottom;
    }

    // 下边距离：拖拽元素下边缘到兄弟元素上边缘
    if (draggedRect.bottom <= siblingRect.top) {
      distances.bottom = siblingRect.top - draggedRect.bottom;
    }

    return distances;
  }

  // 创建兄弟元素距离线和标签
  function createSiblingDistanceLine(draggedRect, siblingRect, direction, distance) {
    const line = document.createElement("div");
    const label = document.createElement("div");

    line.className = "sibling-distance-line";
    label.className = "sibling-distance-indicator";
    label.textContent = Math.round(distance) + "px";

    let lineLeft, lineTop, lineWidth, lineHeight;
    let labelLeft, labelTop;

    switch (direction) {
      case "left":
        // 从兄弟元素右边缘到拖拽元素左边缘的水平线
        lineLeft = siblingRect.right;
        lineTop = Math.max(Math.max(draggedRect.top, siblingRect.top), Math.min(draggedRect.bottom, siblingRect.bottom) - 1);
        // 如果元素没有垂直重叠，使用中心线
        if (draggedRect.bottom <= siblingRect.top || draggedRect.top >= siblingRect.bottom) {
          lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        }
        lineWidth = Math.abs(draggedRect.left - siblingRect.right);
        lineHeight = 2;
        line.classList.add("horizontal");

        labelLeft = lineLeft + lineWidth / 2;
        labelTop = lineTop - 20;
        break;

      case "right":
        // 从拖拽元素右边缘到兄弟元素左边缘的水平线
        lineLeft = draggedRect.right;
        lineTop = Math.max(Math.max(draggedRect.top, siblingRect.top), Math.min(draggedRect.bottom, siblingRect.bottom) - 1);
        // 如果元素没有垂直重叠，使用中心线
        if (draggedRect.bottom <= siblingRect.top || draggedRect.top >= siblingRect.bottom) {
          lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        }
        lineWidth = Math.abs(siblingRect.left - draggedRect.right);
        lineHeight = 2;
        line.classList.add("horizontal");

        labelLeft = lineLeft + lineWidth / 2;
        labelTop = lineTop - 20;
        break;

      case "top":
        // 从兄弟元素下边缘到拖拽元素上边缘的垂直线
        lineLeft = Math.max(Math.max(draggedRect.left, siblingRect.left), Math.min(draggedRect.right, siblingRect.right) - 1);
        // 如果元素没有水平重叠，使用中心线
        if (draggedRect.right <= siblingRect.left || draggedRect.left >= siblingRect.right) {
          lineLeft = (draggedRect.left + draggedRect.right) / 2;
        }
        lineTop = siblingRect.bottom;
        lineWidth = 2;
        lineHeight = Math.abs(draggedRect.top - siblingRect.bottom);
        line.classList.add("vertical");

        labelLeft = lineLeft + 5;
        labelTop = lineTop + lineHeight / 2;
        break;

      case "bottom":
        // 从拖拽元素下边缘到兄弟元素上边缘的垂直线
        lineLeft = Math.max(Math.max(draggedRect.left, siblingRect.left), Math.min(draggedRect.right, siblingRect.right) - 1);
        // 如果元素没有水平重叠，使用中心线
        if (draggedRect.right <= siblingRect.left || draggedRect.left >= siblingRect.right) {
          lineLeft = (draggedRect.left + draggedRect.right) / 2;
        }
        lineTop = draggedRect.bottom;
        lineWidth = 2;
        lineHeight = Math.abs(siblingRect.top - draggedRect.bottom);
        line.classList.add("vertical");

        labelLeft = lineLeft + 5;
        labelTop = lineTop + lineHeight / 2;
        break;
    }

    // 设置线条样式
    line.style.left = lineLeft + "px";
    line.style.top = lineTop + "px";
    line.style.width = Math.abs(lineWidth) + "px";
    line.style.height = Math.abs(lineHeight) + "px";

    // 设置标签样式
    label.style.left = labelLeft + "px";
    label.style.top = labelTop + "px";

    document.body.appendChild(line);
    document.body.appendChild(label);
  }

  // 检查兄弟元素对齐
  function checkSiblingAlignment(draggedRect, siblings) {
    const alignments = [];

    siblings.forEach((sibling) => {
      const siblingRect = sibling.rect;

      // 检查水平对齐（上边缘、下边缘、中心线）
      const topDiff = Math.abs(draggedRect.top - siblingRect.top);
      const bottomDiff = Math.abs(draggedRect.bottom - siblingRect.bottom);
      const centerYDiff = Math.abs((draggedRect.top + draggedRect.bottom) / 2 - (siblingRect.top + siblingRect.bottom) / 2);

      // 检查垂直对齐（左边缘、右边缘、中心线）
      const leftDiff = Math.abs(draggedRect.left - siblingRect.left);
      const rightDiff = Math.abs(draggedRect.right - siblingRect.right);
      const centerXDiff = Math.abs((draggedRect.left + draggedRect.right) / 2 - (siblingRect.left + siblingRect.right) / 2);

      // 检查是否在对齐阈值内
      if (topDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "horizontal",
          subtype: "top",
          element: sibling.element,
          rect: siblingRect,
          position: siblingRect.top,
          diff: topDiff,
        });
      }

      if (bottomDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "horizontal",
          subtype: "bottom",
          element: sibling.element,
          rect: siblingRect,
          position: siblingRect.bottom,
          diff: bottomDiff,
        });
      }

      if (centerYDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "horizontal",
          subtype: "center",
          element: sibling.element,
          rect: siblingRect,
          position: (siblingRect.top + siblingRect.bottom) / 2,
          diff: centerYDiff,
        });
      }

      if (leftDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "vertical",
          subtype: "left",
          element: sibling.element,
          rect: siblingRect,
          position: siblingRect.left,
          diff: leftDiff,
        });
      }

      if (rightDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "vertical",
          subtype: "right",
          element: sibling.element,
          rect: siblingRect,
          position: siblingRect.right,
          diff: rightDiff,
        });
      }

      if (centerXDiff <= siblingAlignTolerance) {
        alignments.push({
          type: "vertical",
          subtype: "center",
          element: sibling.element,
          rect: siblingRect,
          position: (siblingRect.left + siblingRect.right) / 2,
          diff: centerXDiff,
        });
      }
    });

    // 按差值排序，最接近的在前
    return alignments.sort((a, b) => a.diff - b.diff);
  }

  // 显示同边缘对齐辅助线
  function showSameEdgeAlignmentGuides() {
    // 清除之前的同边缘对齐辅助线
    document.querySelectorAll(".same-edge-alignment-guide, .same-edge-indicator").forEach((el) => el.remove());

    if (sameEdgeAlignmentTargets.length === 0) return;

    const draggedRect = draggedElement.getBoundingClientRect();

    sameEdgeAlignmentTargets.forEach((target) => {
      const siblingRect = target.sibling.rect;

      // 创建水平对齐线
      const guide = document.createElement("div");
      guide.className = "same-edge-alignment-guide";

      if (isSameEdgeAligned) {
        guide.classList.add("active");
      }

      // 计算对齐线的位置 - 使用更精确的计算
      let lineTop, lineLeft, lineWidth;

      if (target.type === "top-to-top") {
        // 拖拽元素上边缘到兄弟元素上边缘
        lineTop = target.targetPosition;
        lineLeft = Math.min(draggedRect.left, siblingRect.left);
        lineWidth = Math.max(draggedRect.right, siblingRect.right) - lineLeft;
      } else if (target.type === "bottom-to-bottom") {
        // 拖拽元素下边缘到兄弟元素下边缘
        lineTop = target.targetPosition - 1; // 稍微向上偏移以避免与元素边缘重叠
        lineLeft = Math.min(draggedRect.left, siblingRect.left);
        lineWidth = Math.max(draggedRect.right, siblingRect.right) - lineLeft;
      }

      guide.style.left = lineLeft + "px";
      guide.style.top = lineTop + "px";
      guide.style.width = lineWidth + "px";

      document.body.appendChild(guide);

      // 创建同边缘指示器 - 使用更精确的定位
      const draggedEdgeIndicator = document.createElement("div");
      draggedEdgeIndicator.className = "same-edge-indicator";

      const siblingEdgeIndicator = document.createElement("div");
      siblingEdgeIndicator.className = "same-edge-indicator";

      if (target.type === "top-to-top") {
        // 拖拽元素上边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.left + "px";
        draggedEdgeIndicator.style.top = draggedRect.top + "px";
        draggedEdgeIndicator.style.width = draggedRect.width + "px";

        // 兄弟元素上边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.left + "px";
        siblingEdgeIndicator.style.top = siblingRect.top + "px";
        siblingEdgeIndicator.style.width = siblingRect.width + "px";
      } else if (target.type === "bottom-to-bottom") {
        // 拖拽元素下边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.left + "px";
        draggedEdgeIndicator.style.top = draggedRect.bottom - 1 + "px";
        draggedEdgeIndicator.style.width = draggedRect.width + "px";

        // 兄弟元素下边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.left + "px";
        siblingEdgeIndicator.style.top = siblingRect.bottom - 1 + "px";
        siblingEdgeIndicator.style.width = siblingRect.width + "px";
      }

      document.body.appendChild(draggedEdgeIndicator);
      document.body.appendChild(siblingEdgeIndicator);

      // 高亮对齐目标元素
      target.sibling.element.classList.add("same-edge-target-highlight");
    });
  }

  // 显示垂直边缘到边缘对齐辅助线
  function showVerticalEdgeToEdgeAlignmentGuides() {
    // 清除之前的垂直边缘到边缘对齐辅助线
    document.querySelectorAll(".vertical-edge-to-edge-alignment-guide, .vertical-edge-indicator").forEach((el) => el.remove());

    if (verticalEdgeToEdgeAlignmentTargets.length === 0) return;

    const draggedRect = draggedElement.getBoundingClientRect();

    verticalEdgeToEdgeAlignmentTargets.forEach((target) => {
      const siblingRect = target.sibling.rect;

      // 创建垂直对齐线
      const guide = document.createElement("div");
      guide.className = "vertical-edge-to-edge-alignment-guide";

      if (isVerticalEdgeToEdgeAligned) {
        guide.classList.add("active");
      }

      // 计算对齐线的位置 - 使用更精确的计算
      let lineLeft, lineTop, lineHeight;

      if (target.type === "bottom-to-top") {
        // 拖拽元素下边缘到兄弟元素上边缘
        // 计算重叠区域的中心线，如果没有重叠则使用拖拽元素的中心
        const overlapLeft = Math.max(draggedRect.left, siblingRect.left);
        const overlapRight = Math.min(draggedRect.right, siblingRect.right);

        if (overlapLeft < overlapRight) {
          // 有水平重叠，使用重叠区域的中心
          lineLeft = (overlapLeft + overlapRight) / 2;
        } else {
          // 没有水平重叠，使用拖拽元素的中心
          lineLeft = (draggedRect.left + draggedRect.right) / 2;
        }

        lineTop = Math.min(draggedRect.bottom, siblingRect.top);
        lineHeight = Math.abs(draggedRect.bottom - siblingRect.top);
      } else if (target.type === "top-to-bottom") {
        // 拖拽元素上边缘到兄弟元素下边缘
        const overlapLeft = Math.max(draggedRect.left, siblingRect.left);
        const overlapRight = Math.min(draggedRect.right, siblingRect.right);

        if (overlapLeft < overlapRight) {
          // 有水平重叠，使用重叠区域的中心
          lineLeft = (overlapLeft + overlapRight) / 2;
        } else {
          // 没有水平重叠，使用拖拽元素的中心
          lineLeft = (draggedRect.left + draggedRect.right) / 2;
        }

        lineTop = Math.min(draggedRect.top, siblingRect.bottom);
        lineHeight = Math.abs(draggedRect.top - siblingRect.bottom);
      }

      guide.style.left = lineLeft + "px";
      guide.style.top = lineTop + "px";
      guide.style.height = lineHeight + "px";

      document.body.appendChild(guide);

      // 创建垂直边缘指示器 - 使用更精确的定位
      const draggedEdgeIndicator = document.createElement("div");
      draggedEdgeIndicator.className = "vertical-edge-indicator";

      const siblingEdgeIndicator = document.createElement("div");
      siblingEdgeIndicator.className = "vertical-edge-indicator";

      if (target.type === "bottom-to-top") {
        // 拖拽元素下边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.left + "px";
        draggedEdgeIndicator.style.top = draggedRect.bottom - 1 + "px";
        draggedEdgeIndicator.style.width = draggedRect.width + "px";

        // 兄弟元素上边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.left + "px";
        siblingEdgeIndicator.style.top = siblingRect.top + "px";
        siblingEdgeIndicator.style.width = siblingRect.width + "px";
      } else if (target.type === "top-to-bottom") {
        // 拖拽元素上边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.left + "px";
        draggedEdgeIndicator.style.top = draggedRect.top + "px";
        draggedEdgeIndicator.style.width = draggedRect.width + "px";

        // 兄弟元素下边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.left + "px";
        siblingEdgeIndicator.style.top = siblingRect.bottom - 1 + "px";
        siblingEdgeIndicator.style.width = siblingRect.width + "px";
      }

      document.body.appendChild(draggedEdgeIndicator);
      document.body.appendChild(siblingEdgeIndicator);

      // 高亮对齐目标元素
      target.sibling.element.classList.add("vertical-edge-to-edge-target-highlight");
    });
  }

  // 显示边缘到边缘对齐辅助线
  function showEdgeToEdgeAlignmentGuides() {
    // 清除之前的边缘到边缘对齐辅助线
    document.querySelectorAll(".edge-to-edge-alignment-guide, .edge-indicator").forEach((el) => el.remove());

    if (edgeToEdgeAlignmentTargets.length === 0) return;

    const draggedRect = draggedElement.getBoundingClientRect();

    edgeToEdgeAlignmentTargets.forEach((target) => {
      const siblingRect = target.sibling.rect;

      // 创建水平对齐线
      const guide = document.createElement("div");
      guide.className = "edge-to-edge-alignment-guide";

      if (isEdgeToEdgeAligned) {
        guide.classList.add("active");
      }

      // 计算对齐线的位置 - 使用更精确的计算
      let lineTop, lineLeft, lineWidth;

      if (target.type === "right-to-left") {
        // 拖拽元素右边缘到兄弟元素左边缘
        // 计算重叠区域的中心线，如果没有重叠则使用拖拽元素的中心
        const overlapTop = Math.max(draggedRect.top, siblingRect.top);
        const overlapBottom = Math.min(draggedRect.bottom, siblingRect.bottom);

        if (overlapTop < overlapBottom) {
          // 有垂直重叠，使用重叠区域的中心
          lineTop = (overlapTop + overlapBottom) / 2;
        } else {
          // 没有垂直重叠，使用拖拽元素的中心
          lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        }

        lineLeft = Math.min(draggedRect.right, siblingRect.left);
        lineWidth = Math.abs(draggedRect.right - siblingRect.left);
      } else if (target.type === "left-to-right") {
        // 拖拽元素左边缘到兄弟元素右边缘
        const overlapTop = Math.max(draggedRect.top, siblingRect.top);
        const overlapBottom = Math.min(draggedRect.bottom, siblingRect.bottom);

        if (overlapTop < overlapBottom) {
          // 有垂直重叠，使用重叠区域的中心
          lineTop = (overlapTop + overlapBottom) / 2;
        } else {
          // 没有垂直重叠，使用拖拽元素的中心
          lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        }

        lineLeft = Math.min(draggedRect.left, siblingRect.right);
        lineWidth = Math.abs(draggedRect.left - siblingRect.right);
      }

      guide.style.left = lineLeft + "px";
      guide.style.top = lineTop + "px";
      guide.style.width = lineWidth + "px";

      document.body.appendChild(guide);

      // 创建边缘指示器 - 使用更精确的定位
      const draggedEdgeIndicator = document.createElement("div");
      draggedEdgeIndicator.className = "edge-indicator";

      const siblingEdgeIndicator = document.createElement("div");
      siblingEdgeIndicator.className = "edge-indicator";

      if (target.type === "right-to-left") {
        // 拖拽元素右边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.right - 1 + "px";
        draggedEdgeIndicator.style.top = draggedRect.top + "px";
        draggedEdgeIndicator.style.height = draggedRect.height + "px";

        // 兄弟元素左边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.left + "px";
        siblingEdgeIndicator.style.top = siblingRect.top + "px";
        siblingEdgeIndicator.style.height = siblingRect.height + "px";
      } else if (target.type === "left-to-right") {
        // 拖拽元素左边缘指示器
        draggedEdgeIndicator.style.left = draggedRect.left + "px";
        draggedEdgeIndicator.style.top = draggedRect.top + "px";
        draggedEdgeIndicator.style.height = draggedRect.height + "px";

        // 兄弟元素右边缘指示器
        siblingEdgeIndicator.style.left = siblingRect.right - 1 + "px";
        siblingEdgeIndicator.style.top = siblingRect.top + "px";
        siblingEdgeIndicator.style.height = siblingRect.height + "px";
      }

      document.body.appendChild(draggedEdgeIndicator);
      document.body.appendChild(siblingEdgeIndicator);

      // 高亮对齐目标元素
      target.sibling.element.classList.add("edge-to-edge-target-highlight");
    });
  }

  // 显示左边缘对齐辅助线
  function showLeftEdgeAlignmentGuides() {
    // 清除之前的左边缘对齐辅助线
    document.querySelectorAll(".left-edge-alignment-guide").forEach((el) => el.remove());

    if (leftEdgeAlignmentTargets.length === 0) return;

    const draggedRect = draggedElement.getBoundingClientRect();
    const parentElement = draggedElement.parentElement;
    if (!parentElement) return;

    const parentRect = parentElement.getBoundingClientRect();

    leftEdgeAlignmentTargets.forEach((target) => {
      const guide = document.createElement("div");
      guide.className = "left-edge-alignment-guide";

      if (isLeftEdgeAligned) {
        guide.classList.add("active");
      }

      // 创建垂直对齐线 - 使用更精确的计算
      // 确保使用正确的自然左边缘位置
      const alignmentX = target.naturalLeft;

      guide.style.left = alignmentX + "px";
      guide.style.top = parentRect.top + "px";
      guide.style.height = parentRect.height + "px";

      document.body.appendChild(guide);

      // 创建左边缘指示器
      const draggedEdgeIndicator = document.createElement("div");
      draggedEdgeIndicator.className = "left-edge-indicator";
      draggedEdgeIndicator.style.left = draggedRect.left + "px";
      draggedEdgeIndicator.style.top = draggedRect.top + "px";
      draggedEdgeIndicator.style.height = draggedRect.height + "px";

      const targetEdgeIndicator = document.createElement("div");
      targetEdgeIndicator.className = "left-edge-indicator";
      const targetRect = target.element.getBoundingClientRect();
      targetEdgeIndicator.style.left = targetRect.left + "px";
      targetEdgeIndicator.style.top = targetRect.top + "px";
      targetEdgeIndicator.style.height = targetRect.height + "px";

      document.body.appendChild(draggedEdgeIndicator);
      document.body.appendChild(targetEdgeIndicator);

      // 高亮对齐目标元素
      target.element.classList.add("left-edge-target-highlight");
    });
  }

  // 显示兄弟元素对齐辅助线
  function showSiblingAlignmentGuides(alignments) {
    // 清除之前的兄弟对齐辅助线
    document.querySelectorAll(".sibling-alignment-guide").forEach((el) => el.remove());

    // 只显示最接近的几个对齐线，避免过于混乱
    const maxGuides = 3;
    const draggedRect = draggedElement.getBoundingClientRect();

    alignments.slice(0, maxGuides).forEach((alignment) => {
      const guide = document.createElement("div");
      guide.className = "sibling-alignment-guide";

      if (alignment.type === "horizontal") {
        guide.classList.add("horizontal");
        // 水平对齐线：跨越两个元素的完整宽度
        const leftMost = Math.min(alignment.rect.left, draggedRect.left);
        const rightMost = Math.max(alignment.rect.right, draggedRect.right);

        guide.style.left = leftMost + "px";
        guide.style.top = alignment.position + "px";
        guide.style.width = rightMost - leftMost + "px";
      } else {
        guide.classList.add("vertical");
        // 垂直对齐线：跨越两个元素的完整高度
        const topMost = Math.min(alignment.rect.top, draggedRect.top);
        const bottomMost = Math.max(alignment.rect.bottom, draggedRect.bottom);

        guide.style.left = alignment.position + "px";
        guide.style.top = topMost + "px";
        guide.style.height = bottomMost - topMost + "px";
      }

      document.body.appendChild(guide);
    });
  }

  // 更新距离指示器
  function updateDistanceIndicator() {
    if (!draggedElement) return;

    // 清除之前的指示器
    clearDistanceIndicators();

    const draggedRect = draggedElement.getBoundingClientRect();

    // 处理父级元素距离
    const parentElement = getParentElement(draggedElement);
    if (parentElement) {
      const parentRect = parentElement.getBoundingClientRect();

      // 高亮父级元素
      parentElement.classList.add("nearby-element-highlight");

      // 计算四个方向的距离
      const distances = {
        left: draggedRect.left - parentRect.left, // 拖拽元素左边缘到父级左边缘
        right: parentRect.right - draggedRect.right, // 拖拽元素右边缘到父级右边缘
        top: draggedRect.top - parentRect.top, // 拖拽元素上边缘到父级上边缘
        bottom: parentRect.bottom - draggedRect.bottom, // 拖拽元素下边缘到父级下边缘
      };

      // 为每个方向创建距离线（只显示正值距离）
      Object.keys(distances).forEach((direction) => {
        const distance = distances[direction];
        if (distance > 0) {
          // 只显示正值距离
          createParentDistanceLine(draggedRect, parentRect, direction, distance);
        }
      });
    }

    // 处理兄弟元素距离和对齐
    const siblings = getSiblingElements(draggedElement);
    if (siblings.length > 0) {
      // 高亮兄弟元素
      siblings.forEach((sibling) => {
        sibling.element.classList.add("sibling-element-highlight");
      });

      // 计算并显示兄弟元素距离线
      let allDistanceLines = []; // 收集所有可能的距离线信息

      // 收集所有兄弟元素的距离线信息
      siblings.forEach((sibling) => {
        const siblingDistances = calculateSiblingDistances(draggedRect, sibling.rect);

        // 为每个方向收集距离线信息
        Object.keys(siblingDistances).forEach((direction) => {
          const distance = siblingDistances[direction];
          // 在检测范围内收集所有距离线信息（不再限制100px，确保远距离元素也能显示距离线）
          if (distance > 0 && distance <= siblingDistanceDisplayLimit) {
            allDistanceLines.push({
              draggedRect,
              siblingRect: sibling.rect,
              direction,
              distance,
              siblingDistance: sibling.distance, // 兄弟元素到拖拽元素的中心距离
            });
          }
        });
      });

      // 按距离排序，优先显示较近的距离线
      allDistanceLines.sort((a, b) => a.distance - b.distance);

      // 创建距离线，但限制总数量防止视觉混乱
      allDistanceLines.slice(0, maxSiblingDistanceLines).forEach((lineInfo) => {
        createSiblingDistanceLine(lineInfo.draggedRect, lineInfo.siblingRect, lineInfo.direction, lineInfo.distance);
      });

      // 检查兄弟元素对齐并显示辅助线
      const alignments = checkSiblingAlignment(draggedRect, siblings);
      if (alignments.length > 0) {
        showSiblingAlignmentGuides(alignments);
      }
    }
  }

  // 创建父级元素距离线和标签
  function createParentDistanceLine(draggedRect, parentRect, direction, distance) {
    const line = document.createElement("div");
    const label = document.createElement("div");

    line.className = "distance-line";
    label.className = "distance-indicator";

    // 检查是否为居中状态
    const isCentered =
      (direction === "left" && isHorizontalCentered) ||
      (direction === "right" && isHorizontalCentered) ||
      (direction === "top" && isVerticalCentered) ||
      (direction === "bottom" && isVerticalCentered);

    if (isCentered) {
      label.classList.add("centered");
      label.textContent = "CENTER";
    } else {
      label.textContent = Math.round(distance) + "px";
    }

    let lineLeft, lineTop, lineWidth, lineHeight;
    let labelLeft, labelTop;

    switch (direction) {
      case "left":
        // 从父级左边缘到拖拽元素左边缘的水平线
        lineLeft = parentRect.left;
        lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        lineWidth = distance;
        lineHeight = 1;
        line.classList.add("horizontal");

        labelLeft = lineLeft + lineWidth / 2;
        labelTop = lineTop - 20;
        break;

      case "right":
        // 从拖拽元素右边缘到父级右边缘的水平线
        lineLeft = draggedRect.right;
        lineTop = (draggedRect.top + draggedRect.bottom) / 2;
        lineWidth = distance;
        lineHeight = 1;
        line.classList.add("horizontal");

        labelLeft = lineLeft + lineWidth / 2;
        labelTop = lineTop - 20;
        break;

      case "top":
        // 从父级上边缘到拖拽元素上边缘的垂直线
        lineLeft = (draggedRect.left + draggedRect.right) / 2;
        lineTop = parentRect.top;
        lineWidth = 1;
        lineHeight = distance;
        line.classList.add("vertical");

        labelLeft = lineLeft + 5;
        labelTop = lineTop + lineHeight / 2;
        break;

      case "bottom":
        // 从拖拽元素下边缘到父级下边缘的垂直线
        lineLeft = (draggedRect.left + draggedRect.right) / 2;
        lineTop = draggedRect.bottom;
        lineWidth = 1;
        lineHeight = distance;
        line.classList.add("vertical");

        labelLeft = lineLeft + 5;
        labelTop = lineTop + lineHeight / 2;
        break;
    }

    // 设置线条样式
    line.style.left = lineLeft + "px";
    line.style.top = lineTop + "px";
    line.style.width = Math.abs(lineWidth) + "px";
    line.style.height = Math.abs(lineHeight) + "px";

    // 设置标签样式
    label.style.left = labelLeft + "px";
    label.style.top = labelTop + "px";

    document.body.appendChild(line);
    document.body.appendChild(label);
  }

  // 显示父边界对齐辅助线
  function showParentBoundaryGuides(alignmentResult) {
    // 清除之前的父边界辅助线
    clearParentBoundaryGuides();

    if (!alignmentResult.aligned || !alignmentResult.target) {
      return;
    }

    const target = alignmentResult.target;
    const type = alignmentResult.type;

    // 创建辅助线
    const guideLine = document.createElement("div");
    guideLine.className = `parent-boundary-guide-line ${type === "left" || type === "right" ? "vertical" : "horizontal"}`;

    guideLine.style.left = target.x + "px";
    guideLine.style.top = target.y + "px";
    guideLine.style.width = target.width + "px";
    guideLine.style.height = target.height + "px";

    document.body.appendChild(guideLine);

    // 创建边界指示器
    const indicator = document.createElement("div");
    indicator.className = "parent-boundary-indicator";

    let indicatorX, indicatorY;

    switch (type) {
      case "left":
        indicatorX = target.x - 4;
        indicatorY = target.y + target.height / 2 - 4;
        break;
      case "right":
        indicatorX = target.x - 4;
        indicatorY = target.y + target.height / 2 - 4;
        break;
      case "top":
        indicatorX = target.x + target.width / 2 - 4;
        indicatorY = target.y - 4;
        break;
      case "bottom":
        indicatorX = target.x + target.width / 2 - 4;
        indicatorY = target.y - 4;
        break;
    }

    indicator.style.left = indicatorX + "px";
    indicator.style.top = indicatorY + "px";

    document.body.appendChild(indicator);
  }

  // 清除父边界对齐辅助线
  function clearParentBoundaryGuides() {
    document.querySelectorAll(".parent-boundary-guide-line, .parent-boundary-indicator").forEach((el) => el.remove());
  }

  // 显示调整大小时的对齐指示线
  function showResizeAlignmentGuides(targets) {
    // 清除现有的调整大小对齐指示线
    clearResizeAlignmentGuides();

    targets.forEach((target, index) => {
      const guide = document.createElement("div");
      guide.className = `resize-alignment-guide resize-alignment-guide-${index}`;
      guide.style.cssText = `
        position: fixed;
        background: #FFD700;
        z-index: 10001;
        pointer-events: none;
        box-shadow: 0 0 4px rgba(255, 215, 0, 0.6);
        left: ${target.x}px;
        top: ${target.y}px;
        width: ${target.width}px;
        height: ${target.height}px;
      `;
      document.body.appendChild(guide);
    });
  }

  // 清除调整大小对齐指示线
  function clearResizeAlignmentGuides() {
    document.querySelectorAll(".resize-alignment-guide").forEach((guide) => {
      guide.remove();
    });
  }

  // 更新实时信息显示
  function updateRealTimeInfo(element = null) {
    const infoPanel = document.getElementById("real-time-info");
    if (!infoPanel) return;

    if (!element || !isDragMode) {
      // 隐藏信息面板
      infoPanel.style.display = "none";
      return;
    }

    // 显示信息面板
    infoPanel.style.display = "block";

    // 更新元素信息
    updateElementInfo(element);

    // 更新位置信息
    updatePositionInfo(element);

    // 更新尺寸信息
    updateSizeInfo(element);

    // 更新操作模式
    updateModeInfo();

    // 更新定位上下文
    updateContextInfo(element);

    // 更新磁性对齐状态
    updateAlignmentInfo();
  }

  // 更新元素信息
  function updateElementInfo(element) {
    const elementDetails = document.getElementById("element-details");
    if (!elementDetails) return;

    const tagName = element.tagName.toLowerCase();
    const className = element.className ? `.${element.className.split(" ").join(".")}` : "";
    const id = element.id ? `#${element.id}` : "";

    elementDetails.textContent = `${tagName}${id}${className}`;
  }

  // 更新位置信息
  function updatePositionInfo(element) {
    const input1 = document.getElementById("position-input-1");
    const input2 = document.getElementById("position-input-2");
    const label1 = document.getElementById("position-label-1");
    const label2 = document.getElementById("position-label-2");

    if (!input1 || !input2 || !label1 || !label2) return;

    const computedStyle = window.getComputedStyle(element);
    const positioningContext = detectElementPositioningContext(element);

    // 暂时移除事件监听器以避免循环更新
    input1.removeEventListener("input", handlePositionInput1);
    input2.removeEventListener("input", handlePositionInput2);
    input1.removeEventListener("blur", handlePositionBlur1);
    input2.removeEventListener("blur", handlePositionBlur2);

    if (positioningContext && positioningContext.positioningType === "absolute") {
      const left = element.style.left || computedStyle.left || "auto";
      const top = element.style.top || computedStyle.top || "auto";

      label1.textContent = "left:";
      label2.textContent = "top:";
      input1.value = left;
      input2.value = top;
    } else {
      const marginLeft = element.style.marginLeft || computedStyle.marginLeft || "0px";
      const marginTop = element.style.marginTop || computedStyle.marginTop || "0px";

      label1.textContent = "ml:";
      label2.textContent = "mt:";
      input1.value = marginLeft;
      input2.value = marginTop;
    }

    // 重新添加事件监听器
    input1.addEventListener("input", handlePositionInput1);
    input2.addEventListener("input", handlePositionInput2);
    input1.addEventListener("blur", handlePositionBlur1);
    input2.addEventListener("blur", handlePositionBlur2);
    input1.addEventListener("keydown", handlePositionKeydown);
    input2.addEventListener("keydown", handlePositionKeydown);
  }

  // 更新尺寸信息
  function updateSizeInfo(element) {
    const input1 = document.getElementById("size-input-1");
    const input2 = document.getElementById("size-input-2");

    if (!input1 || !input2) return;

    const computedStyle = window.getComputedStyle(element);
    const width = element.style.width || computedStyle.width || "auto";
    const height = element.style.height || computedStyle.height || "auto";

    // 暂时移除事件监听器以避免循环更新
    input1.removeEventListener("input", handleSizeInput1);
    input2.removeEventListener("input", handleSizeInput2);
    input1.removeEventListener("blur", handleSizeBlur1);
    input2.removeEventListener("blur", handleSizeBlur2);
    input1.removeEventListener("keydown", handleSizeKeydown);
    input2.removeEventListener("keydown", handleSizeKeydown);

    // 更新输入框值
    input1.value = width;
    input2.value = height;

    // 重新添加事件监听器
    input1.addEventListener("input", handleSizeInput1);
    input2.addEventListener("input", handleSizeInput2);
    input1.addEventListener("blur", handleSizeBlur1);
    input2.addEventListener("blur", handleSizeBlur2);
    input1.addEventListener("keydown", handleSizeKeydown);
    input2.addEventListener("keydown", handleSizeKeydown);
  }

  // 更新操作模式
  function updateModeInfo() {
    const modeDetails = document.getElementById("mode-details");
    if (!modeDetails) return;

    let modeText = "无操作";
    if (draggedElement) {
      if (resizeMode === "move") {
        modeText = "移动";
      } else if (resizeMode && resizeMode.startsWith("resize-")) {
        const modeMap = {
          "resize-e": "调整宽度 (右边缘)",
          "resize-w": "调整宽度 (左边缘)",
          "resize-s": "调整高度 (底边缘)",
          "resize-n": "调整高度 (顶边缘)",
          "resize-se": "调整尺寸 (右下角)",
          "resize-sw": "调整尺寸 (左下角)",
          "resize-ne": "调整尺寸 (右上角)",
          "resize-nw": "调整尺寸 (左上角)",
        };
        modeText = modeMap[resizeMode] || resizeMode;
      }
    }

    modeDetails.textContent = modeText;
  }

  // 更新定位上下文
  function updateContextInfo(element) {
    const contextDetails = document.getElementById("context-details");
    if (!contextDetails) return;

    const positioningContext = detectElementPositioningContext(element);
    let contextText = "未知";

    if (positioningContext) {
      const positionType = positioningContext.position;
      const contextType = positioningContext.positioningType;
      contextText = `${positionType} (${contextType === "absolute" ? "绝对定位" : "正常文档流"})`;
    }

    contextDetails.textContent = contextText;
  }

  // 更新磁性对齐状态
  function updateAlignmentInfo() {
    const alignmentDetails = document.getElementById("alignment-details");
    if (!alignmentDetails) return;

    const alignments = [];

    // 检查各种对齐状态
    if (isLeftEdgeAligned) alignments.push("左边缘");
    if (isEdgeToEdgeAligned) alignments.push("边缘到边缘");
    if (isVerticalEdgeToEdgeAligned) alignments.push("垂直边缘");
    if (isSameEdgeAligned) alignments.push("同边缘");
    if (isParentBoundaryAligned) alignments.push(`父边界(${parentBoundaryAlignmentType})`);
    if (isCenteredX || isCenteredY) {
      const centerTypes = [];
      if (isCenteredX) centerTypes.push("水平居中");
      if (isCenteredY) centerTypes.push("垂直居中");
      alignments.push(centerTypes.join("+"));
    }

    alignmentDetails.textContent = alignments.length > 0 ? alignments.join(", ") : "无对齐";
  }

  // 位置输入框事件处理函数
  function handlePositionInput1() {
    if (!activeElement) return;
    applyPositionFromInput(activeElement, 1, this.value);
  }

  function handlePositionInput2() {
    if (!activeElement) return;
    applyPositionFromInput(activeElement, 2, this.value);
  }

  function handlePositionBlur1() {
    if (!activeElement) return;
    validateAndApplyPosition(activeElement, 1, this.value);
  }

  function handlePositionBlur2() {
    if (!activeElement) return;
    validateAndApplyPosition(activeElement, 2, this.value);
  }

  // 键盘事件处理（支持上下箭头键微调）
  function handlePositionKeydown(e) {
    if (!activeElement) return;

    const input = e.target;
    const inputNumber = input.id === "position-input-1" ? 1 : 2;

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      const currentValue = input.value;
      const increment = e.shiftKey ? 10 : 1; // Shift键增加步长
      const direction = e.key === "ArrowUp" ? 1 : -1;

      // 解析当前值
      const match = currentValue.match(/^(-?\d+(?:\.\d+)?)(.*)?$/);
      if (match) {
        const numericValue = parseFloat(match[1]);
        const unit = match[2] || "px";
        const newValue = numericValue + increment * direction;
        const newValueString = newValue + unit;

        input.value = newValueString;
        applyPositionFromInput(activeElement, inputNumber, newValueString);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      validateAndApplyPosition(activeElement, inputNumber, input.value);
      input.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      updatePositionInfo(activeElement); // 恢复原值
      input.blur();
    }
  }

  // 应用位置输入值到元素
  function applyPositionFromInput(element, inputNumber, value) {
    if (!element || !value) return;

    const positioningContext = detectElementPositioningContext(element);

    try {
      if (positioningContext && positioningContext.positioningType === "absolute") {
        if (inputNumber === 1) {
          // left 属性
          element.style.left = value;
        } else {
          // top 属性
          element.style.top = value;
        }
      } else {
        if (inputNumber === 1) {
          // margin-left 属性
          element.style.marginLeft = value;
        } else {
          // margin-top 属性
          element.style.marginTop = value;
        }
      }
    } catch (e) {
      console.warn("Invalid position value:", value);
    }
  }

  // 验证并应用位置值
  function validateAndApplyPosition(element, inputNumber, value) {
    if (!element) return;

    const input = document.getElementById(`position-input-${inputNumber}`);
    if (!input) return;

    // 验证CSS值格式
    if (!isValidCSSValue(value)) {
      // 显示错误状态
      input.style.borderColor = "#f44336";
      input.style.backgroundColor = "rgba(244, 67, 54, 0.1)";

      // 1秒后恢复到当前元素的实际值
      setTimeout(() => {
        input.style.borderColor = "rgba(255,255,255,0.3)";
        input.style.backgroundColor = "rgba(255,255,255,0.1)";
        updatePositionInfo(element);
      }, 1000);
      return;
    }

    // 显示成功状态
    input.style.borderColor = "#4CAF50";
    input.style.backgroundColor = "rgba(76, 175, 80, 0.1)";

    // 应用值
    applyPositionFromInput(element, inputNumber, value);

    // 500ms后恢复正常状态
    setTimeout(() => {
      input.style.borderColor = "rgba(255,255,255,0.3)";
      input.style.backgroundColor = "rgba(255,255,255,0.1)";
    }, 500);
  }

  // 验证CSS值是否有效
  function isValidCSSValue(value) {
    if (!value || value.trim() === "") return false;

    // 允许的CSS值格式
    const validPatterns = [
      /^-?\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch)$/i, // 数值+单位
      /^-?\d+(\.\d+)?$/, // 纯数值（会被当作px）
      /^(auto|inherit|initial|unset)$/i, // CSS关键字
      /^calc\(.+\)$/i, // calc函数
    ];

    return validPatterns.some((pattern) => pattern.test(value.trim()));
  }

  // 尺寸输入框事件处理函数
  function handleSizeInput1() {
    if (!activeElement) return;
    applySizeFromInput(activeElement, 1, this.value);
  }

  function handleSizeInput2() {
    if (!activeElement) return;
    applySizeFromInput(activeElement, 2, this.value);
  }

  function handleSizeBlur1() {
    if (!activeElement) return;
    validateAndApplySize(activeElement, 1, this.value);
  }

  function handleSizeBlur2() {
    if (!activeElement) return;
    validateAndApplySize(activeElement, 2, this.value);
  }

  // 尺寸键盘事件处理（支持上下箭头键微调）
  function handleSizeKeydown(e) {
    if (!activeElement) return;

    const input = e.target;
    const inputNumber = input.id === "size-input-1" ? 1 : 2;

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();

      const currentValue = input.value;
      const increment = e.shiftKey ? 10 : 1; // Shift键增加步长
      const direction = e.key === "ArrowUp" ? 1 : -1;

      // 解析当前值
      const match = currentValue.match(/^(-?\d+(?:\.\d+)?)(.*)?$/);
      if (match) {
        const numericValue = parseFloat(match[1]);
        const unit = match[2] || "px";
        const newValue = Math.max(0, numericValue + increment * direction); // 尺寸不能为负
        const newValueString = newValue + unit;

        input.value = newValueString;
        applySizeFromInput(activeElement, inputNumber, newValueString);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      validateAndApplySize(activeElement, inputNumber, input.value);
      input.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      updateSizeInfo(activeElement); // 恢复原值
      input.blur();
    }
  }

  // 应用尺寸输入值到元素
  function applySizeFromInput(element, inputNumber, value) {
    if (!element || !value) return;

    try {
      if (inputNumber === 1) {
        // width 属性
        element.style.width = value;
      } else {
        // height 属性
        element.style.height = value;
      }
    } catch (e) {
      console.warn("Invalid size value:", value);
    }
  }

  // 验证并应用尺寸值
  function validateAndApplySize(element, inputNumber, value) {
    if (!element) return;

    const input = document.getElementById(`size-input-${inputNumber}`);
    if (!input) return;

    // 验证CSS值格式
    if (!isValidCSSSizeValue(value)) {
      // 显示错误状态
      input.style.borderColor = "#f44336";
      input.style.backgroundColor = "rgba(244, 67, 54, 0.1)";

      // 1秒后恢复到当前元素的实际值
      setTimeout(() => {
        input.style.borderColor = "rgba(255,255,255,0.3)";
        input.style.backgroundColor = "rgba(255,255,255,0.1)";
        updateSizeInfo(element);
      }, 1000);
      return;
    }

    // 显示成功状态
    input.style.borderColor = "#4CAF50";
    input.style.backgroundColor = "rgba(76, 175, 80, 0.1)";

    // 应用值
    applySizeFromInput(element, inputNumber, value);

    // 500ms后恢复正常状态
    setTimeout(() => {
      input.style.borderColor = "rgba(255,255,255,0.3)";
      input.style.backgroundColor = "rgba(255,255,255,0.1)";
    }, 500);
  }

  // 验证CSS尺寸值是否有效
  function isValidCSSSizeValue(value) {
    if (!value || value.trim() === "") return false;

    // 允许的CSS尺寸值格式
    const validPatterns = [
      /^\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm|ex|ch)$/i, // 正数值+单位
      /^\d+(\.\d+)?$/, // 纯正数值（会被当作px）
      /^(auto|inherit|initial|unset|max-content|min-content|fit-content)$/i, // CSS关键字
      /^calc\(.+\)$/i, // calc函数
    ];

    return validPatterns.some((pattern) => pattern.test(value.trim()));
  }

  // 清除距离指示器
  function clearDistanceIndicators() {
    // 清除距离线和标签（包括兄弟元素的）
    document.querySelectorAll(".distance-line, .distance-indicator, .sibling-distance-line, .sibling-distance-indicator").forEach((el) => {
      el.remove();
    });

    // 清除对齐辅助线（包括左边缘对齐、边缘到边缘对齐、垂直边缘到边缘对齐和同边缘对齐辅助线）
    document
      .querySelectorAll(
        ".sibling-alignment-guide, .left-edge-alignment-guide, .edge-to-edge-alignment-guide, .edge-indicator, .vertical-edge-to-edge-alignment-guide, .vertical-edge-indicator, .same-edge-alignment-guide, .same-edge-indicator"
      )
      .forEach((el) => {
        el.remove();
      });

    // 清除附近元素的高亮（包括兄弟元素、左边缘对齐目标、边缘到边缘对齐目标、垂直边缘到边缘对齐目标和同边缘对齐目标的）
    document
      .querySelectorAll(
        ".nearby-element-highlight, .sibling-element-highlight, .left-edge-target-highlight, .edge-to-edge-target-highlight, .vertical-edge-to-edge-target-highlight, .same-edge-target-highlight"
      )
      .forEach((el) => {
        el.classList.remove(
          "nearby-element-highlight",
          "sibling-element-highlight",
          "left-edge-target-highlight",
          "edge-to-edge-target-highlight",
          "vertical-edge-to-edge-target-highlight",
          "same-edge-target-highlight"
        );
      });

    // 重置左边缘对齐状态
    isLeftEdgeAligned = false;
    leftEdgeAlignmentTargets = [];

    // 重置边缘到边缘对齐状态
    isEdgeToEdgeAligned = false;
    edgeToEdgeAlignmentTargets = [];
    edgeToEdgeAlignmentType = null;

    // 重置垂直边缘到边缘对齐状态
    isVerticalEdgeToEdgeAligned = false;
    verticalEdgeToEdgeAlignmentTargets = [];
    verticalEdgeToEdgeAlignmentType = null;

    // 重置同边缘对齐状态
    isSameEdgeAligned = false;
    sameEdgeAlignmentTargets = [];
    sameEdgeAlignmentType = null;

    // 清除父边界对齐辅助线
    clearParentBoundaryGuides();

    // 清除调整大小对齐辅助线
    clearResizeAlignmentGuides();

    // 重置父边界对齐状态
    isParentBoundaryAligned = false;
    parentBoundaryAlignmentType = null;
    parentBoundaryTarget = null;
  }

  // 处理空白区域点击（取消激活）
  function handleEmptyAreaClick(e) {
    if (!isDragMode) return;

    // 如果点击的是检查器面板，不处理
    if (e.target.closest(".hierarchy-inspector")) {
      return;
    }

    // 如果点击的是空白区域（body或html），取消所有激活
    if (e.target === document.body || e.target === document.documentElement) {
      deactivateAllElements();
    }
  }

  // 处理键盘事件（ESC取消激活）
  function handleKeyDown(e) {
    if (!isDragMode) return;

    if (e.key === "Escape") {
      deactivateAllElements();
      e.preventDefault();
    }
  }

  // 切换拖拽模式
  function toggleDragMode() {
    isDragMode = !isDragMode;
    const toggleBtn = document.getElementById("toggle-drag-mode");
    const statusSpan = document.getElementById("drag-status");

    if (isDragMode) {
      document.body.classList.add("drag-mode-active");
      toggleBtn.textContent = "关闭拖拽";
      toggleBtn.style.background = "#f44336";
      statusSpan.textContent = "开启 (双击激活)";
      statusSpan.style.color = "#4CAF50";

      // 添加双击激活系统的事件监听器
      document.addEventListener("click", handleElementClick);
      document.addEventListener("click", handleEmptyAreaClick);
      document.addEventListener("keydown", handleKeyDown);

      // 添加鼠标悬停效果
      document.addEventListener("mouseover", highlightElement);
      document.addEventListener("mouseout", removeHighlight);
      document.addEventListener("mousemove", updateHighlightOnMove);

      // 如果有激活的元素，显示实时信息
      if (activeElement) {
        updateRealTimeInfo(activeElement);
      }
    } else {
      document.body.classList.remove("drag-mode-active");
      toggleBtn.textContent = "开启拖拽";
      toggleBtn.style.background = "#4CAF50";
      statusSpan.textContent = "关闭";
      statusSpan.style.color = "#f44336";

      // 移除双击激活系统的事件监听器
      document.removeEventListener("click", handleElementClick);
      document.removeEventListener("click", handleEmptyAreaClick);
      document.removeEventListener("keydown", handleKeyDown);

      // 移除鼠标悬停效果
      document.removeEventListener("mouseover", highlightElement);
      document.removeEventListener("mouseout", removeHighlight);
      document.removeEventListener("mousemove", updateHighlightOnMove);

      // 清除所有高亮和激活状态
      document.querySelectorAll(".drag-highlight, .resize-highlight, .resize-highlight-corner").forEach((el) => {
        el.classList.remove("drag-highlight", "resize-highlight", "resize-highlight-corner");
      });

      // 取消所有元素的激活状态
      deactivateAllElements();

      // 清除距离指示器
      clearDistanceIndicators();

      // 隐藏实时信息面板
      updateRealTimeInfo(null);
    }
  }

  // 面板最小化状态
  let isPanelMinimized = false;

  // 面板拖拽状态
  let isPanelDragging = false;
  let panelDragOffset = { x: 0, y: 0 };

  // localStorage 键名
  const PANEL_MINIMIZED_KEY = "elementDraggerPanelMinimized";
  const PANEL_POSITION_KEY = "elementDraggerPanelPosition";
  const CHECKBOX_STATES_KEY = "elementDraggerCheckboxStates";

  // 检查面板显示条件 - 现在总是显示面板
  function shouldShowPanel() {
    // 移除所有条件限制，面板在所有页面上都可见
    return true;
  }

  // 从 localStorage 加载面板状态
  function loadPanelState() {
    try {
      const saved = localStorage.getItem(PANEL_MINIMIZED_KEY);
      if (saved !== null) {
        isPanelMinimized = JSON.parse(saved);
      }
    } catch (e) {
      console.warn("Failed to load panel state from localStorage:", e);
      isPanelMinimized = false;
    }
  }

  // 保存面板状态到 localStorage
  function savePanelState() {
    try {
      localStorage.setItem(PANEL_MINIMIZED_KEY, JSON.stringify(isPanelMinimized));
    } catch (e) {
      console.warn("Failed to save panel state to localStorage:", e);
    }
  }

  // 从 localStorage 加载面板位置
  function loadPanelPosition() {
    try {
      const saved = localStorage.getItem(PANEL_POSITION_KEY);
      if (saved !== null) {
        const position = JSON.parse(saved);
        if (position && typeof position.x === "number" && typeof position.y === "number") {
          return position;
        }
      }
    } catch (e) {
      console.warn("Failed to load panel position from localStorage:", e);
    }
    // 默认位置：右上角，留出足够空间
    const defaultX = Math.max(20, window.innerWidth - 320);
    return { x: defaultX, y: 20 };
  }

  // 保存面板位置到 localStorage
  function savePanelPosition(x, y) {
    try {
      localStorage.setItem(PANEL_POSITION_KEY, JSON.stringify({ x, y }));
    } catch (e) {
      console.warn("Failed to save panel position to localStorage:", e);
    }
  }

  // 从 localStorage 加载复选框状态
  function loadCheckboxStates() {
    try {
      const saved = localStorage.getItem(CHECKBOX_STATES_KEY);
      if (saved !== null) {
        const states = JSON.parse(saved);
        if (states && typeof states === "object") {
          // 应用保存的状态到变量
          if (typeof states.showDistance === "boolean") {
            showDistance = states.showDistance;
          }
          if (typeof states.enableResize === "boolean") {
            enableResize = states.enableResize;
          }
          if (typeof states.enableMagneticAlign === "boolean") {
            enableMagneticAlign = states.enableMagneticAlign;
          }
        }
      }
    } catch (e) {
      console.warn("Failed to load checkbox states from localStorage:", e);
    }
  }

  // 保存复选框状态到 localStorage
  function saveCheckboxStates() {
    try {
      const states = {
        showDistance: showDistance,
        enableResize: enableResize,
        enableMagneticAlign: enableMagneticAlign,
      };
      localStorage.setItem(CHECKBOX_STATES_KEY, JSON.stringify(states));
    } catch (e) {
      console.warn("Failed to save checkbox states to localStorage:", e);
    }
  }

  // 应用复选框状态到UI
  function applyCheckboxStates() {
    const distanceCheckbox = document.getElementById("toggle-distance");
    const resizeCheckbox = document.getElementById("toggle-resize");
    const magneticCheckbox = document.getElementById("toggle-magnetic");

    if (distanceCheckbox) {
      distanceCheckbox.checked = showDistance;
    }
    if (resizeCheckbox) {
      resizeCheckbox.checked = enableResize;
    }
    if (magneticCheckbox) {
      magneticCheckbox.checked = enableMagneticAlign;
    }
  }

  // 应用面板最小化状态
  function applyPanelState() {
    const panel = controlPanel;
    const minimizeBtn = document.getElementById("minimize-panel");

    if (!panel || !minimizeBtn) return;

    if (isPanelMinimized) {
      panel.classList.add("panel-minimized");
      minimizeBtn.textContent = "+";
      minimizeBtn.title = "展开面板";
    } else {
      panel.classList.remove("panel-minimized");
      minimizeBtn.textContent = "−";
      minimizeBtn.title = "最小化面板";
    }
  }

  // 切换面板最小化状态
  function togglePanelMinimize() {
    isPanelMinimized = !isPanelMinimized;
    applyPanelState();
    savePanelState();
  }

  // 应用面板位置
  function applyPanelPosition(x, y) {
    const panel = controlPanel;
    if (!panel) return { x: 20, y: 20 };

    // 首先清除可能冲突的CSS属性并确保面板可见
    panel.style.right = "";
    panel.style.bottom = "";
    panel.style.position = "fixed";
    panel.style.visibility = "visible";
    panel.style.display = "block";

    // 获取面板尺寸（使用实际尺寸或估算值）
    let panelWidth = panel.offsetWidth;
    let panelHeight = panel.offsetHeight;

    // 如果面板还没有渲染完成，使用估算值
    if (panelWidth === 0 || panelHeight === 0) {
      panelWidth = 300; // 估算宽度
      panelHeight = 200; // 估算高度
    }

    // 确保面板不会超出视口边界
    const maxX = Math.max(0, window.innerWidth - panelWidth);
    const maxY = Math.max(0, window.innerHeight - panelHeight);

    x = Math.max(0, Math.min(x, maxX));
    y = Math.max(0, Math.min(y, maxY));

    // 应用新位置
    panel.style.left = x + "px";
    panel.style.top = y + "px";

    return { x, y };
  }

  // 开始拖拽面板
  function startPanelDrag(e) {
    // 检查是否点击在可拖拽区域
    const target = e.target;
    if (target.tagName === "BUTTON" || target.tagName === "INPUT" || target.tagName === "SELECT") {
      return; // 不在按钮、输入框或下拉框上开始拖拽
    }

    // 检查是否点击在面板头部
    const panelHeader = target.closest("#panel-header");
    if (!panelHeader) return;

    e.preventDefault();
    isPanelDragging = true;

    const panel = controlPanel;
    const rect = panel.getBoundingClientRect();

    panelDragOffset.x = e.clientX - rect.left;
    panelDragOffset.y = e.clientY - rect.top;

    // 添加拖拽样式
    panel.classList.add("dragging");
    panel.style.opacity = "0.9";
    panel.style.cursor = "move";
    document.body.style.cursor = "move";

    // 添加全局事件监听器
    document.addEventListener("mousemove", handlePanelDrag);
    document.addEventListener("mouseup", stopPanelDrag);
  }

  // 处理面板拖拽
  function handlePanelDrag(e) {
    if (!isPanelDragging) return;

    e.preventDefault();

    const x = e.clientX - panelDragOffset.x;
    const y = e.clientY - panelDragOffset.y;

    applyPanelPosition(x, y);
  }

  // 停止面板拖拽
  function stopPanelDrag(e) {
    if (!isPanelDragging) return;

    isPanelDragging = false;

    const panel = controlPanel;

    // 移除拖拽样式
    panel.classList.remove("dragging");
    panel.style.opacity = "";
    panel.style.cursor = "";
    document.body.style.cursor = "";

    // 保存最终位置
    const rect = panel.getBoundingClientRect();
    savePanelPosition(rect.left, rect.top);

    // 移除全局事件监听器
    document.removeEventListener("mousemove", handlePanelDrag);
    document.removeEventListener("mouseup", stopPanelDrag);
  }

  // 高亮元素
  function highlightElement(e) {
    if (!isDragMode) return;

    const element = e.target;
    if (!element.closest("#drag-control-panel") && !element.closest(".hierarchy-inspector")) {
      // 清除之前的高亮样式
      element.classList.remove("drag-highlight", "resize-highlight", "resize-highlight-corner");

      // 检查元素是否已激活
      if (element === activeElement) {
        // 激活的元素：正常显示拖拽/调整大小的高亮
        if (enableResize) {
          const mode = getResizeMode(element, e.clientX, e.clientY);
          setCursor(mode);

          if (mode === "move") {
            // 移动模式：绿色边框
            element.classList.add("drag-highlight");
          } else if (mode.includes("se") || mode.includes("sw") || mode.includes("ne") || mode.includes("nw")) {
            // 角落调整模式：橙色边框
            element.classList.add("resize-highlight-corner");
          } else {
            // 边缘调整模式：蓝色边框
            element.classList.add("resize-highlight");
          }
        } else {
          // 只有移动模式
          element.classList.add("drag-highlight");
          setCursor("move");
        }
      } else {
        // 未激活的元素：显示较淡的高亮，提示需要双击激活
        element.classList.add("drag-highlight");
        setCursor("pointer");
      }
    }
  }

  // 移除高亮
  function removeHighlight(e) {
    if (!isDragMode) return;

    const element = e.target;
    // 清除所有高亮样式
    element.classList.remove("drag-highlight", "resize-highlight", "resize-highlight-corner");

    // 重置光标
    document.body.style.cursor = "default";
  }

  // 鼠标移动时更新高亮效果
  function updateHighlightOnMove(e) {
    if (!isDragMode || !enableResize) return;

    const element = e.target;
    if (
      !element.closest("#drag-control-panel") &&
      (element.classList.contains("drag-highlight") || element.classList.contains("resize-highlight") || element.classList.contains("resize-highlight-corner"))
    ) {
      // 清除当前高亮样式
      element.classList.remove("drag-highlight", "resize-highlight", "resize-highlight-corner");

      // 重新检测模式并设置高亮
      const mode = getResizeMode(element, e.clientX, e.clientY);
      setCursor(mode);

      if (mode === "move") {
        element.classList.add("drag-highlight");
      } else if (mode.includes("se") || mode.includes("sw") || mode.includes("ne") || mode.includes("nw")) {
        element.classList.add("resize-highlight-corner");
      } else {
        element.classList.add("resize-highlight");
      }
    }
  }

  // 重置所有位置和尺寸
  function resetAllPositions() {
    document.querySelectorAll("[data-original-position]").forEach((element) => {
      // 恢复原始样式
      if (element.dataset.originalPosition) {
        element.style.position = element.dataset.originalPosition;
      } else {
        element.style.position = "";
      }

      if (element.dataset.originalLeft) {
        element.style.left = element.dataset.originalLeft;
      } else {
        element.style.left = "";
      }

      if (element.dataset.originalTop) {
        element.style.top = element.dataset.originalTop;
      } else {
        element.style.top = "";
      }

      if (element.dataset.originalWidth) {
        element.style.width = element.dataset.originalWidth;
      } else {
        element.style.width = "";
      }

      if (element.dataset.originalHeight) {
        element.style.height = element.dataset.originalHeight;
      } else {
        element.style.height = "";
      }

      // 清除数据属性
      delete element.dataset.originalPosition;
      delete element.dataset.originalLeft;
      delete element.dataset.originalTop;
      delete element.dataset.originalWidth;
      delete element.dataset.originalHeight;
    });

    alert("所有元素位置和尺寸已重置！");
  }

  // 切换距离显示
  function toggleDistanceDisplay() {
    showDistance = document.getElementById("toggle-distance").checked;
    if (!showDistance) {
      clearDistanceIndicators();
    }
    // 保存状态到 localStorage
    saveCheckboxStates();
  }

  // 切换尺寸调整功能
  function toggleResizeFunction() {
    enableResize = document.getElementById("toggle-resize").checked;
    // 保存状态到 localStorage
    saveCheckboxStates();
  }

  // 切换磁性对齐功能
  function toggleMagneticAlign() {
    enableMagneticAlign = document.getElementById("toggle-magnetic").checked;
    if (!enableMagneticAlign) {
      // 清除居中辅助线
      document.querySelectorAll(".center-guide-line").forEach((el) => el.remove());
      // 重置居中状态
      isHorizontalCentered = false;
      isVerticalCentered = false;
    }
    // 保存状态到 localStorage
    saveCheckboxStates();
  }

  // 初始化
  function init() {
    // 检查是否应该显示面板
    if (!shouldShowPanel()) {
      // 条件不满足，不创建面板，静默退出
      return;
    }

    addStyles();
    controlPanel = createControlPanel();

    // 等待面板渲染完成后再应用位置
    setTimeout(() => {
      // 加载并应用面板状态
      loadPanelState();
      applyPanelState();

      // 加载并应用面板位置
      const savedPosition = loadPanelPosition();
      applyPanelPosition(savedPosition.x, savedPosition.y);

      // 加载并应用复选框状态
      loadCheckboxStates();
      applyCheckboxStates();
    }, 10);

    // 绑定事件
    document.getElementById("toggle-drag-mode").addEventListener("click", toggleDragMode);
    document.getElementById("reset-positions").addEventListener("click", resetAllPositions);
    document.getElementById("copy-styles").addEventListener("click", copyStylesToClipboard);
    document.getElementById("toggle-inspector").addEventListener("click", toggleInspectorPanel);
    document.getElementById("minimize-panel").addEventListener("click", togglePanelMinimize);
    document.getElementById("copy-format").addEventListener("change", (e) => {
      copyFormat = e.target.value;
    });
    document.getElementById("toggle-distance").addEventListener("change", toggleDistanceDisplay);
    document.getElementById("toggle-resize").addEventListener("change", toggleResizeFunction);
    document.getElementById("toggle-magnetic").addEventListener("change", toggleMagneticAlign);

    // 面板拖拽事件
    document.getElementById("panel-header").addEventListener("mousedown", startPanelDrag);

    // 元素拖拽事件
    document.addEventListener("mousedown", startDrag);

    // 初始化按钮状态
    updateCopyButtonState();
    updateInspectorButtonState();

    console.log("页面元素拖拽器已加载！");
  }

  // 等待页面加载完成
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

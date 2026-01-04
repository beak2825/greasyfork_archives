// ==UserScript==
// @name         亚马逊音乐音质查询
// @namespace    https://music.amazon.co.jp/
// @version      1.9
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAACXBIWXMAAAsTAAALEwEAmpwYAAAM42lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcFRQZz0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3QvcGcvIiB4bWxuczpzdERpbT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL0RpbWVuc2lvbnMjIiB4bWxuczp4bXBHPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvZy8iIHhtbG5zOmlsbHVzdHJhdG9yPSJodHRwOi8vbnMuYWRvYmUuY29tL2lsbHVzdHJhdG9yLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpwZGY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGRmLzEuMy8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBJbGx1c3RyYXRvciAyNi4zIChNYWNpbnRvc2gpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wMlQxMTo0OToxMi0wNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMTEtMTdUMTU6MDU6MDYtMDg6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMTEtMTdUMTU6MDU6MDYtMDg6MDAiIHhtcFRQZzpOUGFnZXM9IjEiIHhtcFRQZzpIYXNWaXNpYmxlVHJhbnNwYXJlbmN5PSJGYWxzZSIgeG1wVFBnOkhhc1Zpc2libGVPdmVycHJpbnQ9IkZhbHNlIiBpbGx1c3RyYXRvcjpUeXBlPSJEb2N1bWVudCIgaWxsdXN0cmF0b3I6Q3JlYXRvclN1YlRvb2w9IkFJUm9iaW4iIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiB4bXBNTTpSZW5kaXRpb25DbGFzcz0icHJvb2Y6cGRmIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2Q2OWIwYjMtODliYi05MDRiLWEwYmQtMDZiNDI3ZmEwZjNkIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjhhNGRmNjc5LTM0ZjMtNDk5MC1iOTlhLTEzOGFlOGVkYWIxZSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOmYxY2NlN2UyLTljMWItOTk0Zi1iYjIzLTA0MTQxMDNkZDZjZCIgcGRmOlByb2R1Y2VyPSJBZG9iZSBQREYgbGlicmFyeSAxNi4wNyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyI+IDx4bXBUUGc6TWF4UGFnZVNpemUgc3REaW06dz0iMjU2LjAwMDAwMCIgc3REaW06aD0iMjU2LjAwMDAwMCIgc3REaW06dW5pdD0iUG9pbnRzIi8+IDx4bXBUUGc6UGxhdGVOYW1lcz4gPHJkZjpTZXE+IDxyZGY6bGk+Q3lhbjwvcmRmOmxpPiA8cmRmOmxpPk1hZ2VudGE8L3JkZjpsaT4gPHJkZjpsaT5ZZWxsb3c8L3JkZjpsaT4gPHJkZjpsaT5CbGFjazwvcmRmOmxpPiA8L3JkZjpTZXE+IDwveG1wVFBnOlBsYXRlTmFtZXM+IDx4bXBUUGc6U3dhdGNoR3JvdXBzPiA8cmRmOlNlcT4gPHJkZjpsaSB4bXBHOmdyb3VwTmFtZT0iRGVmYXVsdCBTd2F0Y2ggR3JvdXAiIHhtcEc6Z3JvdXBUeXBlPSIwIi8+IDwvcmRmOlNlcT4gPC94bXBUUGc6U3dhdGNoR3JvdXBzPiA8ZGM6dGl0bGU+IDxyZGY6QWx0PiA8cmRmOmxpIHhtbDpsYW5nPSJ4LWRlZmF1bHQiPkFNX1dlYnBsYXllcl9mYXZlaWNvbl8yNTZ4MjU2PC9yZGY6bGk+IDwvcmRmOkFsdD4gPC9kYzp0aXRsZT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjU2NjI4YTktNjI0Yy00MzU4LWEyN2UtM2U4YjUzNWU4ZmVkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOmI1NjYyOGE5LTYyNGMtNDM1OC1hMjdlLTNlOGI1MzVlOGZlZCIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSJ1dWlkOmYxY2NlN2UyLTljMWItOTk0Zi1iYjIzLTA0MTQxMDNkZDZjZCIgc3RSZWY6cmVuZGl0aW9uQ2xhc3M9InByb29mOnBkZiIvPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplMWE5NzA2Yi1hY2E5LTQwODAtYjJjMi04Zjg1YmRiYWEzYTYiIHN0RXZ0OndoZW49IjIwMjItMDgtMDJUMTE6NDg6NTEtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIElsbHVzdHJhdG9yIDI2LjMgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBhcHBsaWNhdGlvbi9wZGYgdG8gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNl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
// @description  查询并显示曲目音质信息
// @match        https://music.amazon.co.jp/*
// @match        https://music.amazon.com/*
// @match        https://music.amazon.com.au/*
// @match        https://music.amazon.*/*
// @match        https://music.amazon.*/*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      MIT
// @connect      tz26884jf542.yicp.fun
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547104/%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%9F%B3%E4%B9%90%E9%9F%B3%E8%B4%A8%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/547104/%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%9F%B3%E4%B9%90%E9%9F%B3%E8%B4%A8%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

/* eslint-env greasemonkey */
/* jshint esversion: 8 */

(() => {
  'use strict';

  // 正则表达式匹配专辑链接格式
  const REG_ALBUM = /^https:\/\/music\.amazon\.(?:com(?:\.[a-z]{2,3})?|co\.[a-z]{2}|[a-z]{2,3})\/albums\/B0[A-Z0-9]{8}$/;

  // 正则表达式匹配专辑页面路径（用于检测当前是否在专辑页面）
  const REG_ALBUM_PAGE = /^https:\/\/music\.amazon\.(?:com(?:\.[a-z]{2,3})?|co\.[a-z]{2}|[a-z]{2,3})(?:\/[a-z]{2})?\/albums\//;

  // 检查当前页面是否是专辑页面
  function isAlbumPage() {
    return REG_ALBUM_PAGE.test(location.href);
  }

  // API基础URL
  const API_BASE_URL = 'https://tz26884jf542.yicp.fun/api/album/quality';

  // 发送API请求获取音质信息（性能优化版本）
  async function getAlbumQuality(albumUrl) {
    const apiUrl = `${API_BASE_URL}?album_url=${encodeURIComponent(albumUrl)}&format=json`;

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        responseType: 'json',  // 让浏览器直接解析 JSON，避免手动 JSON.parse
        timeout: 120000,  // 120秒超时（服务器处理可能需要时间）
        headers: {
          'Accept': 'application/json'
        },
        onload: function(response) {
          // 直接使用已解析的 JSON 数据
          let data = response.response;

          // 如果 responseType: 'json' 失败，尝试手动解析
          if (!data && response.responseText) {
            try {
              data = JSON.parse(response.responseText);
            } catch (e) {
              // 检查特定错误
              if (response.responseText.includes('No input file specified')) {
                reject(new Error('服务器配置错误'));
                return;
              }
              reject(new Error('解析API响应失败'));
              return;
            }
          }

          // 快速验证数据格式
          if (data && data.album_info && data.tracks) {
            resolve(data);
          } else if (response.status === 200 && data) {
            resolve(data);
          } else {
            reject(new Error('API响应数据格式不正确'));
          }
        },
        onerror: function() {
          reject(new Error('网络请求失败'));
        },
        ontimeout: function() {
          reject(new Error('请求超时（120秒）'));
        }
      });
    });
  }

  // 处理音质数据，提取最高音质和特殊音质
  function processTrackQualities(track) {
    const qualities = track.qualities || [];

    // 按quality_ranking排序，数字越小质量越高
    qualities.sort((a, b) => parseInt(a.quality_ranking) - parseInt(b.quality_ranking));

    // 分别获取不同类型的最高音质
    const hdQualities = qualities.filter(q => q.track_type === 'HD');
    const threeDQualities = qualities.filter(q => q.track_type === '3D');
    const sdQualities = qualities.filter(q => q.track_type === 'SD');
    const ldQualities = qualities.filter(q => q.track_type === 'LD');

    const highestHD = hdQualities.length > 0 ? hdQualities[0] : null;
    const highest3D = threeDQualities.length > 0 ? threeDQualities[0] : null;
    const highestSD = sdQualities.length > 0 ? sdQualities[0] : null;
    const highestLD = ldQualities.length > 0 ? ldQualities[0] : null;

    // 构建显示列表
    const displayQualities = [];

    // 如果有HD音质，显示最高HD音质
    if (highestHD) {
      displayQualities.push(highestHD);
    }

    // 如果有3D音质且与HD音质不同，则添加最高3D音质
    if (highest3D && (!highestHD || highestHD.id !== highest3D.id)) {
      displayQualities.push(highest3D);
    }

    // 如果没有HD和3D音质，但有SD音质，显示最高SD音质
    if (!highestHD && !highest3D && highestSD) {
      displayQualities.push(highestSD);
    }

    // 如果只有LD音质，显示最高LD音质
    if (!highestHD && !highest3D && !highestSD && highestLD) {
      displayQualities.push(highestLD);
    }

    return displayQualities;
  }

  // 格式化音质信息显示
  function formatQualityInfo(quality) {
    let displayText = '';

    if (quality.codec === 'FLAC') {
      // FLAC格式：音质: FLAC 96kHz/24bit | 带宽: 3.4Mbps
      displayText = `音质: ${quality.codec} ${quality.sample_rate_display}/${quality.bit_depth_display} | 带宽: ${quality.bandwidth_display}`;
    } else if (quality.track_type === '3D') {
      // 3D音质格式：空间音频: MPEG-H Audio (Sony 360RA) 48kHz | 带宽: 1.6Mbps
      displayText = `空间音频: ${quality.codec_display} | 带宽: ${quality.bandwidth_display}`;
    } else {
      // 其他格式：音质: OPUS 48kHz | 带宽: 323kbps
      displayText = `音质: ${quality.codec_display} | 带宽: ${quality.bandwidth_display}`;
    }

    return displayText;
  }

  // 显示音质信息对话框
  function showQualityDialog(albumData, duration) {
    const albumInfo = albumData.album_info;
    const tracks = albumData.tracks;

    let message = `专辑名称: ${albumInfo.name}\n`;
    message += `艺术家: ${albumInfo.artist}\n`;
    message += `曲目数量: ${albumInfo.track_count}\n`;
    if (duration) {
      message += `查询耗时: ${duration} 秒\n`;
    }
    message += `\n`;

    tracks.forEach((track, index) => {
      const trackNumber = String(index + 1).padStart(2, '0');
      message += `第 ${trackNumber} 首: ${track.title}\n`;

      const displayQualities = processTrackQualities(track);
      displayQualities.forEach(quality => {
        message += `${formatQualityInfo(quality)}\n`;
      });

      message += '\n';
    });

    // 创建自定义模态对话框
    createCustomDialog(message, albumInfo.name);

    // 同时显示通知
    GM_notification({
      title: 'Amazon Music 音质查询',
      text: `专辑 "${albumInfo.name}" 音质查询完成${duration ? `，耗时 ${duration} 秒` : ''}`,
      timeout: 5000
    });
  }

  // 创建自定义模态对话框
  function createCustomDialog(content, title) {
    // 移除已存在的对话框
    const existingDialog = document.getElementById('quality-dialog');
    if (existingDialog) {
      existingDialog.remove();
    }

    // 创建对话框容器
    const dialog = document.createElement('div');
    dialog.id = 'quality-dialog';
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    // 创建对话框内容
    const dialogContent = document.createElement('div');
    dialogContent.style.cssText = `
      background-color: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 90%;
      max-height: 90%;
      min-width: 600px;
      min-height: 400px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    `;

    // 创建标题栏
    const titleBar = document.createElement('div');
    titleBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e0e0e0;
    `;

    const titleText = document.createElement('h3');
    titleText.textContent = `Amazon Music 音质查询 - ${title}`;
    titleText.style.cssText = `
      margin: 0;
      color: #333;
      font-size: 18px;
      font-weight: 600;
    `;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.cssText = `
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #666;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    `;

    closeButton.onmouseover = () => {
      closeButton.style.backgroundColor = '#f0f0f0';
    };

    closeButton.onmouseout = () => {
      closeButton.style.backgroundColor = 'transparent';
    };

    closeButton.onclick = () => {
      dialog.remove();
    };

    titleBar.appendChild(titleText);
    titleBar.appendChild(closeButton);

         // 创建内容区域
     const contentArea = document.createElement('div');
     contentArea.style.cssText = `
       flex: 1;
       overflow-y: auto;
       padding: 10px;
       background-color: #f9f9f9;
       border-radius: 4px;
       font-family: 'Courier New', monospace;
       font-size: 14px;
       line-height: 1.6;
       white-space: pre-wrap;
       word-wrap: break-word;
       color: #333;
     `;
     contentArea.textContent = content;

    // 创建底部按钮区域
    const buttonArea = document.createElement('div');
    buttonArea.style.cssText = `
      display: flex;
      justify-content: flex-end;
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #e0e0e0;
    `;

    const okButton = document.createElement('button');
    okButton.textContent = '确定';
    okButton.style.cssText = `
      background-color: #007bff;
      color: white;
      border: none;
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.2s;
    `;

    okButton.onmouseover = () => {
      okButton.style.backgroundColor = '#0056b3';
    };

    okButton.onmouseout = () => {
      okButton.style.backgroundColor = '#007bff';
    };

    okButton.onclick = () => {
      dialog.remove();
    };

    buttonArea.appendChild(okButton);

    // 组装对话框
    dialogContent.appendChild(titleBar);
    dialogContent.appendChild(contentArea);
    dialogContent.appendChild(buttonArea);
    dialog.appendChild(dialogContent);

    // 添加到页面
    document.body.appendChild(dialog);

    // 点击背景关闭对话框
    dialog.onclick = (e) => {
      if (e.target === dialog) {
        dialog.remove();
      }
    };

    // ESC键关闭对话框
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        dialog.remove();
        document.removeEventListener('keydown', handleEsc);
      }
    };
    document.addEventListener('keydown', handleEsc);
  }

  // 显示耗时提示框
  function showTimingNotification(trackCount, duration) {
    // 创建耗时提示框
    const timingDisplay = document.createElement('div');
    timingDisplay.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #007AFF;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    timingDisplay.innerHTML = `
      音质查询完成<br>
      共 ${trackCount} 首歌曲，耗时 ${duration} 秒
    `;

    document.body.appendChild(timingDisplay);

    // 3秒后自动移除提示
    setTimeout(() => {
      if (timingDisplay.parentNode) {
        timingDisplay.remove();
      }
    }, 3000);
  }

  // 处理播放按钮点击事件（性能优化版本）
  async function handlePlayButtonClick(albumUrl) {
    // 记录开始时间
    const startTime = performance.now();

    // 异步显示加载提示（不阻塞主流程）
    setTimeout(() => {
      GM_notification({
        title: 'Amazon Music 音质查询',
        text: '正在查询音质信息，请稍等...',
        timeout: 5000
      });
    }, 0);

    try {
      // 获取音质数据
      const albumData = await getAlbumQuality(albumUrl);

      // 记录结束时间并计算耗时
      const endTime = performance.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // 显示结果
      showQualityDialog(albumData, duration);

      // 显示耗时提示框
      showTimingNotification(albumData.tracks.length, duration);

    } catch (error) {
      // 显示错误通知
      GM_notification({
        title: 'Amazon Music 音质查询',
        text: `查询失败: ${error.message}`,
        timeout: 5000
      });

      // 显示错误对话框
      alert(`音质查询失败:\n${error.message}\n\n请检查网络连接或稍后重试。`);
    }
  }

  // 为播放按钮添加点击事件监听
  function attachPlayButtonListener(btn) {
    if (!btn || btn.hasAttribute('data-quality-checker')) return;

    btn.setAttribute('data-quality-checker', '1');
    btn.addEventListener('click', function(event) {
      // 阻止事件冒泡，避免触发原始播放功能
      event.stopPropagation();
      event.preventDefault();

      const pureUrl = location.origin + location.pathname.replace(/\/$/, '');

      if (REG_ALBUM.test(pureUrl)) {
        handlePlayButtonClick(pureUrl);
      } else {
        alert('不是合法的专辑链接：' + pureUrl);
      }
    }, true);
  }

  // 扫描页面中的播放按钮
  function scanPlayButtons() {
    // 只在专辑页面执行扫描
    if (!isAlbumPage()) {
      return;
    }

    // 查找主要的播放按钮
    const mainPlayButton = document.getElementById('detailHeaderButton1');
    if (mainPlayButton) {
      attachPlayButtonListener(mainPlayButton);
    }

    // 查找所有播放按钮
    const playButtons = document.querySelectorAll('music-button[data-test-id="playButton"]');
    playButtons.forEach(attachPlayButtonListener);

    // 查找其他可能的播放按钮选择器
    const alternativeButtons = document.querySelectorAll('[data-test-id*="play"], [class*="play"], button[aria-label*="播放"], button[aria-label*="Play"]');
    alternativeButtons.forEach(attachPlayButtonListener);
  }

  // 等待 document.body 就绪
  function onBodyReady(callback) {
    if (document.body) {
      callback();
      return;
    }
    const bodyObserver = new MutationObserver(() => {
      if (document.body) {
        bodyObserver.disconnect();
        callback();
      }
    });
    bodyObserver.observe(document.documentElement, { childList: true });
    // 兜底：DOMContentLoaded 后再尝试
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body) {
          bodyObserver.disconnect();
          callback();
        }
      }, { once: true });
    }
  }

  // 等待关键元素出现（首次进入时页面为 SPA，元素可能延迟渲染）
  function waitForKeyElements(selectors, timeoutMs = 10000) {
    return new Promise(resolve => {
      const start = Date.now();
      const hasAny = () => selectors.some(sel => document.querySelector(sel));
      if (hasAny()) {
        resolve(true);
        return;
      }
      const obs = new MutationObserver(() => {
        if (hasAny()) {
          obs.disconnect();
          resolve(true);
        } else if (Date.now() - start > timeoutMs) {
          obs.disconnect();
          resolve(false);
        }
      });
      obs.observe(document, { childList: true, subtree: true });
      // 超时兜底
      setTimeout(() => {
        if (Date.now() - start > timeoutMs) {
          obs.disconnect();
          resolve(false);
        }
      }, timeoutMs + 50);
    });
  }

  // 简单防抖
  function debounce(fn, wait) {
    let t;
    return function(...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  // 监听 SPA 路由变更（pushState/replaceState/popstate）
  function setupSpaRouteListener() {
    const dispatch = () => window.dispatchEvent(new Event('amz-route-change'));
    const rawPush = history.pushState;
    const rawReplace = history.replaceState;
    history.pushState = function(...args) { const r = rawPush.apply(this, args); dispatch(); return r; };
    history.replaceState = function(...args) { const r = rawReplace.apply(this, args); dispatch(); return r; };
    window.addEventListener('popstate', dispatch);
  }

  // 初始化脚本
  function init() {
    onBodyReady(async () => {
      setupSpaRouteListener();

      // 首次进入：等待关键元素出现后再扫描，提升成功率
      await waitForKeyElements([
        '#detailHeaderButton1',
        'music-button[data-test-id="playButton"]',
        '[data-test-id*="play"], [class*="play"], button[aria-label*="播放"], button[aria-label*="Play"]'
      ], 10000);

      scanPlayButtons();

      // 监听DOM变化，动态添加播放按钮监听
      const observer = new MutationObserver(debounce(() => {
        scanPlayButtons();
      }, 200));

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // 监听路由变化，延迟扫描，确保页面渲染完成
      const onRouteChanged = debounce(() => {
        // 等待一小段时间再扫描，适配异步渲染
        setTimeout(() => scanPlayButtons(), 100);
        setTimeout(() => scanPlayButtons(), 1000);
      }, 50);
      window.addEventListener('amz-route-change', onRouteChanged);
    });
  }

  // 启动脚本
  init();
})();
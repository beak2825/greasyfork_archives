// ==UserScript==
// @name         ctrl+单击图片自动下载超级增强版
// @namespace    https://www.uiwow.com/
// @version      1.1
// @description  在图片对象上面：特别优化了Chrome浏览器下的点击拦截,不会点击后图片放大。1、按ctrl单击图片自动下载(默认转换为JPG格式)；2、按alt 单击图片会弹窗选择命名方式（无需刷新网页即可生效），文件名可以根据当前日期时间time、网页域名domain、网页标题title，或用户自定义进行命名。
// @author       Techwb.cn
// @match        *://*/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542588/ctrl%2B%E5%8D%95%E5%87%BB%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%B6%85%E7%BA%A7%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542588/ctrl%2B%E5%8D%95%E5%87%BB%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E8%B6%85%E7%BA%A7%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var clickedImage = null;
  var nameOption = GM_getValue('nameOption', 'time'); //默认命名方式time
  var customName = GM_getValue('customName', '');
  var isDownloading = false;
  
  // 检测Chrome浏览器
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  // 关键改进：使用多个事件阶段和类型进行拦截
  document.addEventListener('mousedown', handleMouseDown, true);
  document.addEventListener('click', handleClick, true);
  document.addEventListener('mouseup', handleMouseUp, true);
  
  // 拦截右键菜单，防止图片被打开
  if (isChrome) {
    document.addEventListener('contextmenu', function(e) {
      if (isDownloading && e.target.tagName === 'IMG') {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }, true);
  }

  function handleMouseDown(event) {
    var target = event.target;
    
    if (isImageElement(target) && event.button === 0) {
      clickedImage = target;
      
      if (event.ctrlKey) {
        // 标记正在下载
        isDownloading = true;
        
        // 彻底阻止事件传播
        event.stopImmediatePropagation();
        event.preventDefault();
        
        // 特殊处理Chrome浏览器
        if (isChrome) {
          // 临时修改图片属性，防止浏览器打开
          var originalSrc = clickedImage.src;
          clickedImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
          
          // 延迟执行下载，确保属性修改生效
          setTimeout(function() {
            handleDownload(originalSrc);
            
            // 恢复图片源（可选）
            setTimeout(function() {
              clickedImage.src = originalSrc;
              isDownloading = false;
            }, 100);
          }, 0);
        } else {
          handleDownload();
        }
      } else if (event.altKey) {
        event.preventDefault();
        handleNaming();
      }
    }
  }

  function handleClick(event) {
    // 确保Ctrl+点击事件不会触发其他点击处理
    if (isDownloading && event.button === 0) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  function handleMouseUp(event) {
    // 重置下载状态
    if (isDownloading && event.button === 0) {
      setTimeout(function() {
        isDownloading = false;
      }, 500);
    }
  }

  // 增强版：判断元素是否是图片或图片容器
  function isImageElement(element) {
    if (element.tagName === 'IMG') return true;
    
    // 检查是否是常见的图片查看器容器
    if (element.classList.contains('fancybox-image') || 
        element.classList.contains('magnifier-image') || 
        element.classList.contains('zoom-img') ||
        element.classList.contains('photo-gallery-image')) {
      return true;
    }
    
    // 检查内部是否包含图片
    var img = element.querySelector('img');
    if (img && element.getBoundingClientRect().width === img.getBoundingClientRect().width) {
      return true;
    }
    
    return false;
  }

  function handleDownload(forcedSrc) {
    if (!clickedImage) return;
    
    // 使用强制提供的src（如果有）
    var imgSrc = forcedSrc || getRealImageUrl(clickedImage);
    if (!imgSrc) {
      console.log('无法获取图片URL');
      return;
    }
    
    // 尝试使用GM_download，失败则回退到原生方法
    try {
      // 先获取原始文件名
      var fileName = getFileName(imgSrc);
      
      // 如果是GIF，进一步检查是否为动画
      if (fileName.toLowerCase().endsWith('.gif')) {
        checkIfAnimatedGif(imgSrc).then(isAnimated => {
          // 如果不是动画且用户偏好其他格式，可以考虑转换
          // 这里保持原有行为，只确保正确的扩展名
          downloadWithName(imgSrc, fileName);
        }).catch(err => {
          console.log('GIF动画检测失败，使用默认文件名:', err);
          downloadWithName(imgSrc, fileName);
        });
      } else {
        // 非GIF图片直接下载
        downloadWithName(imgSrc, fileName);
      }
    } catch (e) {
      console.log('下载出错，回退到原生方法:', e);
      fallbackDownload(imgSrc, getFileName(imgSrc));
    }
  }

  function downloadWithName(imgSrc, fileName) {
    if (typeof GM_download !== 'undefined') {
      GM_download({
        url: imgSrc,
        name: fileName,
        onerror: function(err) {
          console.log('GM_download失败，回退到原生方法:', err);
          fallbackDownload(imgSrc, fileName);
        }
      });
    } else {
      fallbackDownload(imgSrc, fileName);
    }
  }

  // 原生下载方法，增强了对不同URL类型的处理
  function fallbackDownload(imgSrc, fileName) {
    // 处理dataURL
    if (imgSrc.startsWith('data:')) {
      var a = document.createElement('a');
      a.href = imgSrc;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }
    
    // 处理普通URL
    fetch(imgSrc, { mode: 'cors' })
      .then(function(response) {
        if (!response.ok) throw new Error('网络响应错误: ' + response.status);
        return response.blob();
      })
      .then(function(blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(function(error) {
        console.log('下载失败:', error);
        alert('下载失败: ' + error.message);
      });
  }

  // 增强版：获取真实图片URL，处理各种情况
  function getRealImageUrl(imgElement) {
    // 优先使用data-src等可能的真实图片源
    var imgSrc = imgElement.dataset.src || 
                 imgElement.dataset.original || 
                 imgElement.dataset.lazySrc || 
                 imgElement.dataset.image || 
                 imgElement.src;
    
    // 处理图片代理URL
    if (imgSrc.includes('proxy?url=')) {
      imgSrc = decodeURIComponent(imgSrc.split('proxy?url=')[1]);
    }
    
    // 确保URL有效
    if (!imgSrc || imgSrc.startsWith('data:')) {
      return imgSrc;
    }
    
    // 添加协议头（如果缺失）
    if (imgSrc.startsWith('//')) {
      imgSrc = window.location.protocol + imgSrc;
    }
    
    return imgSrc;
  }

  // 关键改进：智能识别图片格式，保持GIF不变
  function getFileName(imgUrl) {
    var fileName = '';
    if (nameOption === 'time') {
      fileName = '图片_' + getDate();
    } else if (nameOption === 'domain') {
      fileName = getDomain();
    } else if (nameOption === 'title') {
      fileName = getTitle();
    } else {
      fileName = customName;
    }
    
    // 从URL中提取文件扩展名
    var ext = getFileExtension(imgUrl);
    
    // 过滤非法文件名字符
    fileName = fileName.replace(/[\\/:*?"<>|]/g, '_');
    
    // 添加扩展名（如果有）
    return ext ? fileName + '.' + ext : fileName + '.jpg';
  }

  // 关键改进：获取并保留原始图片格式
  function getFileExtension(url) {
    if (!url) return '';
    
    // 尝试从URL中提取扩展名
    var ext = url.split('?')[0].split('.').pop().toLowerCase();
    
    // 检查是否是有效的图片扩展名
    var validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
    
    if (validExtensions.includes(ext)) {
      return ext;
    }
    
    // 如果无法确定，尝试从Content-Type判断（针对dataURL）
    if (url.startsWith('data:')) {
      var matches = url.match(/data:image\/([^;]+);/);
      if (matches && matches[1]) {
        return matches[1].toLowerCase();
      }
    }
    
    // 默认返回jpg（保持原有行为）
    return '';
  }

  // 新增：检测GIF是否为动画
  function checkIfAnimatedGif(url) {
    return new Promise((resolve, reject) => {
      // 对于dataURL直接处理
      if (url.startsWith('data:')) {
        checkGifData(url).then(resolve).catch(reject);
        return;
      }
      
      // 对于普通URL，先获取二进制数据
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          checkGifBuffer(buffer).then(resolve).catch(reject);
        })
        .catch(reject);
    });
  }

  // 检测GIF数据是否包含多个帧
  function checkGifBuffer(buffer) {
    return new Promise((resolve, reject) => {
      try {
        // 检查GIF签名 (GIF87a 或 GIF89a)
        const signature = new TextDecoder().decode(buffer.slice(0, 6));
        if (signature !== 'GIF87a' && signature !== 'GIF89a') {
          resolve(false);
          return;
        }
        
        // 查找动画帧标记 (0x2C)
        const view = new DataView(buffer);
        let offset = 13; // 跳过头部
        
        // 查找图像分隔符 (0x2C)
        let frameCount = 0;
        while (offset < view.byteLength) {
          const code = view.getUint8(offset);
          
          if (code === 0x2C) { // 图像分隔符
            frameCount++;
            if (frameCount > 1) {
              resolve(true); // 发现多个帧，是动画
              return;
            }
            // 跳过图像数据
            offset += 9; // 跳到图像宽度字段
            offset += 2; // 跳过宽度
            offset += 2; // 跳过高度
            offset += 1; // 跳过标志位
            
            // 跳过局部颜色表
            const flags = view.getUint8(offset - 1);
            if (flags & 0x80) { // 有局部颜色表
              const colorTableSize = (flags & 0x07) + 1;
              offset += 3 * Math.pow(2, colorTableSize);
            }
            
            // 跳过图像数据
            while (offset < view.byteLength) {
              const blockSize = view.getUint8(offset);
              if (blockSize === 0) break;
              offset += blockSize + 1;
            }
            offset++; // 跳过块终止符
          } else if (code === 0x21) { // 扩展块
            offset += 1; // 跳过扩展标签
            // 跳过扩展块
            while (offset < view.byteLength) {
              const blockSize = view.getUint8(offset);
              if (blockSize === 0) break;
              offset += blockSize + 1;
            }
            offset++; // 跳过块终止符
          } else {
            break; // 不是有效的GIF格式
          }
        }
        
        resolve(frameCount > 1); // 如果只有一帧，不是动画
      } catch (error) {
        console.error('GIF解析错误:', error);
        resolve(false); // 解析失败，保守地认为不是动画
      }
    });
  }

  // 处理dataURL格式的GIF
  function checkGifData(dataUrl) {
    return new Promise((resolve, reject) => {
      try {
        // 提取base64部分
        const base64 = dataUrl.split(',')[1];
        if (!base64) {
          resolve(false);
          return;
        }
        
        // 转换为ArrayBuffer
        const binary = atob(base64);
        const buffer = new ArrayBuffer(binary.length);
        const view = new Uint8Array(buffer);
        
        for (let i = 0; i < binary.length; i++) {
          view[i] = binary.charCodeAt(i);
        }
        
        // 检查GIF数据
        checkGifBuffer(buffer).then(resolve).catch(reject);
      } catch (error) {
        console.error('GIF dataURL解析错误:', error);
        resolve(false);
      }
    });
  }

  // 以下是原脚本的其他功能，保持不变...
  function handleNaming() {
    var dateTime = getDate();
    var domainName = getDomain();
    var titleName = getTitle();
    var defaultName = dateTime + '' + titleName + '' + domainName + '.jpg';

    var optionsHtml = '<option value="time" ' + (nameOption === 'time' ? 'selected' : '') + '>时间命名方式</option>' +
                      '<option value="domain" ' + (nameOption === 'domain' ? 'selected' : '') + '>域名命名方式</option>' +
                      '<option value="title" ' + (nameOption === 'title' ? 'selected' : '') + '>标题命名方式</option>' +
                      '<option value="custom" ' + (nameOption === 'custom' ? 'selected' : '') + '>自定义命名方式</option>';

    var html = '<div><label for="nameOption">命名方式：</label><select id="nameOption">' + optionsHtml + '</select></div>';
    var customNameHtml = '<div style="display:none;">' + // 初始隐藏
               '<label for="customName">请输入文件名：</label>' +
               '<input type="text" id="customName" value="' + customName + '">' +
               '</div>';
    var fileNameHtml = '<div><label for="fileName">文件名：</label><input type="text" id="fileName" value="' + defaultName + '" readonly></div>';

    var dialog = document.createElement('div');
    dialog.innerHTML = html + customNameHtml + fileNameHtml;
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
    dialog.style.zIndex = '9999';
    document.body.appendChild(dialog);

    var select = dialog.querySelector('#nameOption');
    var customNameInput = dialog.querySelector('#customName');
    var fileNameInput = dialog.querySelector('#fileName');
    var closeButton = document.createElement('button');
    closeButton.innerText = '关闭';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '2px';
    closeButton.style.right = '2px';
    closeButton.style.padding = '3px 5px';
    closeButton.style.backgroundColor = '#e74c3c';
    closeButton.style.border = 'none';
    closeButton.style.color = '#fff';
    closeButton.style.borderRadius = '3px';
    closeButton.style.cursor = 'pointer';
    closeButton.addEventListener('click', function() {
      document.body.removeChild(dialog);
    });
    dialog.appendChild(closeButton);

    select.addEventListener('change', function() {
      nameOption = select.value;
      updateFileName();
      GM_setValue('nameOption', nameOption);
      if (nameOption === 'custom') {
        customNameInput.parentNode.style.display = 'block'; // 显示
      } else {
        customNameInput.parentNode.style.display = 'none'; // 隐藏
        GM_setValue('customName', '');
      }
    });

    customNameInput.addEventListener('input', function() {
      customName = customNameInput.value;
      updateFileName();
      GM_setValue('customName', customName);
    });

    function updateFileName() {
      var fileName = '';
      if (nameOption === 'time') {
        fileName = '图片_' + getDate();
      } else if (nameOption === 'domain') {
        fileName = getDomain();
      } else if (nameOption === 'title') {
        fileName = getTitle();
      } else {
        fileName = customName;
      }
      
      // 这里默认显示为jpg，实际下载时会根据图片类型自动调整
      fileNameInput.value = fileName + '.jpg';
    }

    updateFileName();
  }

  function getDate() {
    var now = new Date();
    return now.getFullYear() + '-' + (now.getMonth() + 1).toString().padStart(2, '0') + '-' + now.getDate().toString().padStart(2, '0') + '_' + now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0') + now.getSeconds().toString().padStart(2, '0');
  }

  function getDomain() {
    var url = window.location.href;
    var domain = url.split('/')[2];
    domain = domain.replace(/www\./, '');
    return domain;
  }

  function getTitle() {
    var title = document.title;
    return title.substring(0, 10).replace(/[\\/:*?"<>|]/g, '_');
  }
})();
// ==UserScript==
// @name         ctrl+单击图片自动下载
// @namespace    https://www.techwb.cn/
// @version      1.4
// @description  在图片对象上面：1、按ctrl单击图片自动下载(默认转换为JPG格式)；2、按alt 单击图片会弹窗选择命名方式（无需刷新网页即可生效），文件名可以根据当前日期时间time、网页域名domain、网页标题title，或用户自定义进行命名。
// @author       Techwb.cn
// @match        *://*/*
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461554/ctrl%2B%E5%8D%95%E5%87%BB%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461554/ctrl%2B%E5%8D%95%E5%87%BB%E5%9B%BE%E7%89%87%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var clickedImage = null;
  var nameOption = GM_getValue('nameOption', 'time'); //默认命名方式time
  var customName = GM_getValue('customName', '');

  document.addEventListener('mousedown', function(event) {
    var target = event.target;
    if (target.tagName === 'IMG' && event.button === 0) {
      clickedImage = target;
      if (event.ctrlKey) {
        handleDownload();
      } else if (event.altKey) {
        handleNaming();
      }
    }
  });

  function handleDownload() {
    if (!clickedImage) return;
    var imgSrc = clickedImage.src;
    fetch(imgSrc, { mode: 'cors' })
      .then(function(response) {
        return response.blob();
      })
      .then(function(blob) {
        var reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          var base64data = reader.result;
          var fileName = getFileName();
          downloadImage(base64data, fileName);
        };
      });
  }

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
        fileName = '图片_' + getDate() + '.jpg';
      } else if (nameOption === 'domain') {
        fileName = getDomain() + '.jpg';
      } else if (nameOption === 'title') {
        fileName = getTitle() + '.jpg';
      } else {
        fileName = customName + '.jpg';
      }
      fileNameInput.value = fileName;
    }

    updateFileName();
  }

  function getFileName() {
    var fileName = '';
    if (nameOption === 'time') {
      fileName = '图片_' + getDate() + '.jpg';
    } else if (nameOption === 'domain') {
      fileName = getDomain() + '.jpg';
    } else if (nameOption === 'title') {
      fileName = getTitle() + '.jpg';
    } else {
      fileName = customName + '.jpg';
    }
    return fileName;
  }

  function downloadImage(base64data, fileName) {
    var a = document.createElement('a');
    a.href = base64data;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
    return title.substring(0, 10);
  }
})();
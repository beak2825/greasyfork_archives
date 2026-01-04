// ==UserScript==
// @name         云听下载高音质版本
// @version      2.4
// @description  云听点播节目批量下载，实时显示下载进度，高低音质切换，文件名自动重命名，复制链接到剪贴板功能
// @author       darkduck9
// @match        https://www.radio.cn/*
// @grant        none
// @V2.4         修复:1.无法下载当日低音质音频,2.切换音质后“全选”复选框不选中。‘复制所有’调整为‘复制所选’
// @license      MIT
// @namespace http://example.com
// @downloadURL https://update.greasyfork.org/scripts/470185/%E4%BA%91%E5%90%AC%E4%B8%8B%E8%BD%BD%E9%AB%98%E9%9F%B3%E8%B4%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/470185/%E4%BA%91%E5%90%AC%E4%B8%8B%E8%BD%BD%E9%AB%98%E9%9F%B3%E8%B4%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
 let submenuContainer;
    let isHighQuality = false;
  if (/channelname=\d+|name=\d+/.test(window.location.href)) {
        createSubmenu(); 

         function createSubmenu() {
             if (submenuContainer) {
                 document.body.removeChild(submenuContainer);
            }

            submenuContainer = document.createElement('div');
            submenuContainer.style.position = 'fixed';
            submenuContainer.style.top = '50%';
            submenuContainer.style.right = '1rem';
            submenuContainer.style.transform = 'translateY(-50%)';
            submenuContainer.style.backgroundColor = '#00000080';
            submenuContainer.style.padding = '10px';
            submenuContainer.style.zIndex = '9999';
            submenuContainer.style.borderRadius = '10px';

             const submitButton = document.createElement('button');
            submitButton.textContent = 'Submit';

            const refreshButton = document.createElement('button');
            refreshButton.textContent = '刷新';
            refreshButton.style.color = 'white';
            refreshButton.style.fontWeight = 'bold';
            refreshButton.style.marginRight = '5px';
            refreshButton.style.cursor = 'pointer';
            refreshButton.style.backgroundColor = '#00000080';refreshButton.style.border= 'none';
             const downloadButtonsContainer = document.createElement('div');
            downloadButtonsContainer.style.height = '60vh';
            downloadButtonsContainer.style.overflow = 'auto';
            downloadButtonsContainer.style.marginTop = '10px';

            const qualityToggleButton = document.createElement('button');
            setQualityButtonText(); // Set initial button text
             const copyLinksButton = document.createElement('button');
            copyLinksButton.textContent = '复制所选链接';
            copyLinksButton.style.color = 'white';
            copyLinksButton.style.fontWeight = 'bold';
            copyLinksButton.style.marginRight = '5px';
            copyLinksButton.style.cursor = 'pointer';
            copyLinksButton.style.backgroundColor = '#00000080';copyLinksButton.style.border= 'none';
             qualityToggleButton.addEventListener('click', function() {
                isHighQuality = !isHighQuality; 
                setQualityButtonText();
                const downloadUrls = getDownloadUrls();
                displayDownloadButtons(downloadUrls);
                 const selectAllCheckbox = document.querySelector('#select-all-checkbox');
    if (selectAllCheckbox && !selectAllCheckbox.checked) {
        selectAllCheckbox.checked = true;
        const event = new Event('change');
        selectAllCheckbox.dispatchEvent(event);
    }
            });

 function setQualityButtonText() {
  qualityToggleButton.textContent = isHighQuality ? '当前低音质' : '当前高音质';
            qualityToggleButton.style.color = 'white';
            qualityToggleButton.style.fontWeight = 'bold';
            qualityToggleButton.style.marginRight = '5px';
            qualityToggleButton.style.cursor = 'pointer';
            qualityToggleButton.style.backgroundColor = '#00000080';qualityToggleButton.style.border= 'none';
  if (isHighQuality) {
    qualityToggleButton.textContent = '当前低音质';
  } else {
    qualityToggleButton.textContent = '当前高音质';
  }
}
             submitButton.addEventListener('click', function() {
                const downloadUrls = getDownloadUrls();
                displayDownloadButtons(downloadUrls);
            });

             refreshButton.addEventListener('click', function() {
                const currentQuality = isHighQuality;
createSubmenu();
submitButton.click(); 
isHighQuality = currentQuality; 
setQualityButtonText(); 
            });

             copyLinksButton.addEventListener('click', function() {
    const checkboxes = downloadButtonsContainer.querySelectorAll('input[type="checkbox"]');
    const selectedUrls = [];
    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            selectedUrls.push(checkbox.value);
        }
    });
    const links = selectedUrls.join('\n');
    copyToClipboard(links);
});
   // Create the progress bar
      const progressBar = document.createElement('div');
      progressBar.style.width = '0%';
      progressBar.style.height = '10px';
      progressBar.style.backgroundColor = '#E9E9E9';
      progressBar.style.marginTop = '5px';
      progressBar.className = 'progress-bar'; // Add a class name for easy selection

       const fileCountIndicator = document.createElement('div');
      fileCountIndicator.style.marginTop = '5px';
      fileCountIndicator.style.fontWeight = 'bold';
      fileCountIndicator.className = 'file-count-indicator'; // Add a class name for easy selection

       submenuContainer.appendChild(progressBar);
      submenuContainer.appendChild(fileCountIndicator);
const fileSizeIndicator = document.createElement('div');
fileSizeIndicator.style.marginTop = '5px';
fileSizeIndicator.style.fontWeight = 'bold';
fileSizeIndicator.className = 'file-size-indicator'; // Add a class name for easy selection

const indicatorsContainer = document.createElement('div');
indicatorsContainer.style.display = 'flex';
indicatorsContainer.style.alignItems = 'center';
indicatorsContainer.style.marginTop = '5px';
indicatorsContainer.appendChild(fileCountIndicator);
indicatorsContainer.appendChild(fileSizeIndicator);

 submenuContainer.appendChild(indicatorsContainer);

 function cleanURL(url) {
    try {
        const parsedUrl = new URL(url);
         parsedUrl.searchParams.delete('e');
        parsedUrl.searchParams.delete('ps');
        parsedUrl.searchParams.delete('r');
        return parsedUrl.toString();
    } catch (error) {
        console.error("URL无效:", error);
        return url; 
    }
}           // Function to get download URLs
           function getDownloadUrls() {
    const downloadUrls = [];
    const trElements = document.querySelectorAll('tr');
    trElements.forEach(tr => {
        const dateTd = tr.querySelector('td:first-child');
        const linkTd = tr.querySelector('td:nth-child(2)');
        const downloadLink = tr.querySelector('td:nth-child(3) a');
        const fileNameLink = linkTd ? linkTd.querySelector('a') : null;

        if (dateTd && downloadLink && fileNameLink) {
            const onclickValue = downloadLink.getAttribute('onclick');
            if (onclickValue) {
                const date = dateTd.textContent.trim();
                const url = isHighQuality ? cleanURL(getDownloadUrlFromDownLiveRecord(onclickValue)) : cleanURL(fileNameLink.getAttribute('data-url'));
                const fileName = getFileName(date, fileNameLink.textContent.trim());
                const downloadUrl = {
                    url: url,
                    fileName: fileName
                };
                downloadUrls.push(downloadUrl);
            }
        }
    });
    return downloadUrls;
}

            // Function to get the file name
            function getFileName(date, text) {
                const httpDateMatches = text.match(/\/(\d{8})\//);
                if (httpDateMatches && httpDateMatches.length > 1) {
                    const httpDate = httpDateMatches[1];
                    const formattedDate = formatDate(httpDate);
                    return formattedDate + '_' + text;
                }
                return date + '_' + text;
            }

            // Function to format HTTP date to 'YYYY/MM/DD' format
            function formatDate(httpDate) {
                const year = httpDate.substring(0, 4);
                const month = httpDate.substring(4, 6);
                const day = httpDate.substring(6, 8);
                return year + '/' + month + '/' + day;
            }

             function getDownloadUrlFromDownLiveRecord(onclickValue) {
    if (!onclickValue) return '';
    const matches = onclickValue.match(/downLiveRecord\('([^']+)'/);
    if (matches && matches.length > 1) {
        return matches[1];
    }
    return '';
}

            // Function to display download buttons
            function displayDownloadButtons(downloadUrls) {
                 downloadButtonsContainer.innerHTML = '';

                downloadUrls.forEach(downloadUrl => {
                if (!downloadUrl.url) {
               return;
              }
                     const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.value = downloadUrl.url;
                    checkbox.checked = true; 
                     const buttonElement = document.createElement('button');
                    buttonElement.textContent = downloadUrl.fileName;
                    buttonElement.style.backgroundColor = '#00000080';
                    buttonElement.style.color = 'white';buttonElement.style.border= 'none';
                    buttonElement.style.borderBottom = '2px solid #fff';
                    buttonElement.style.cursor = 'pointer';
                    buttonElement.addEventListener('click', function() {
                        downloadFile(downloadUrl.url, downloadUrl.fileName);
                    });

                    const container = document.createElement('div');
                    container.appendChild(checkbox);
                    container.appendChild(buttonElement);
                    container.style.borderRadius = '5px';
                    container.style.marginBottom = '5px';
                    downloadButtonsContainer.appendChild(container);
                });

                if (!submenuContainer.querySelector('#select-all-checkbox')) {
                     const selectAllCheckbox = document.createElement('input');
                    selectAllCheckbox.type = 'checkbox';
                    selectAllCheckbox.id = 'select-all-checkbox';
                    selectAllCheckbox.checked = true;
                     const selectAllLabel = document.createElement('label');
                    selectAllLabel.textContent = '全选';
                    selectAllLabel.style.color = 'white';
                    selectAllLabel.htmlFor = 'select-all-checkbox';
                    selectAllCheckbox.addEventListener('change', function() {
                        const checkboxes = downloadButtonsContainer.querySelectorAll('input[type="checkbox"]');
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = selectAllCheckbox.checked;
                        });
                    });
                    submenuContainer.appendChild(selectAllCheckbox);
                    submenuContainer.appendChild(selectAllLabel);
                }

                 if (!submenuContainer.querySelector('#download-selected-button')) {
                    // Create the download selected button
                    const downloadSelectedButton = document.createElement('button');
                    downloadSelectedButton.textContent = '下载所选';
                    downloadSelectedButton.style.color = 'white';
            downloadSelectedButton.style.fontWeight = 'bold';
            downloadSelectedButton.style.marginRight = '5px';
            downloadSelectedButton.style.cursor = 'pointer';
            downloadSelectedButton.style.backgroundColor = '#00000080';
            downloadSelectedButton.style.border= 'none';
                    downloadSelectedButton.id = 'download-selected-button';
                    downloadSelectedButton.addEventListener('click', function() {
                       const checkboxes = downloadButtonsContainer.querySelectorAll('input[type="checkbox"]');
                        const selectedUrls = [];
                        checkboxes.forEach(checkbox => {
                            if (checkbox.checked) {
                                selectedUrls.push(checkbox.value);
                            }
                        });
                        downloadSelectedUrls(selectedUrls);
                    });
                    submenuContainer.appendChild(downloadButtonsContainer);
                    submenuContainer.appendChild(downloadSelectedButton);
                }
                submenuContainer.appendChild(copyLinksButton);
                submenuContainer.appendChild(qualityToggleButton);
            }
function updateProgress(percentComplete, currentFileSize, downloadSpeed) {
  const progressBar = submenuContainer.querySelector('.progress-bar');
  progressBar.style.width = percentComplete + '%';
 
 const fileSizeIndicator = submenuContainer.querySelector('.file-size-indicator');
fileSizeIndicator.textContent = `已下载: ${formatFileSize(event.loaded)} / 共: ${currentFileSize}`;
fileSizeIndicator.style.color = 'white';
}

  function updateFileCount(currentFile, totalFiles) {
    const fileCountIndicator = submenuContainer.querySelector('.file-count-indicator');
    fileCountIndicator.textContent = `${currentFile}/${totalFiles}`;
    fileCountIndicator.style.color = 'white';
  }

function downloadFile(url, fileName) {
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;

  const fileExtension = getFileExtension(url);
  // Modify the file name with the obtained file extension
  const fullFileName = fileName + '.' + fileExtension;
  a.setAttribute('download', fullFileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

 // Function to extract the file extension from the URL
function getFileExtension(url) {
  return url.split('.').pop();
}

function downloadSelectedUrls(urls) {
  const divs = document.getElementsByTagName('div');
  const totalFiles = urls.length;

  function getButtonInnerText(div) {
    const button = div.querySelector('button');
    if (button) {
      return button.textContent.trim();
    }
    return '';
  }

  function getCheckboxValue(div) {
    const checkbox = div.querySelector('input[type="checkbox"]');
    if (checkbox) {
      return checkbox.value;
    }
    return '';
  }

  function getDivContainingUrl(url) {
    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];
      const checkbox = div.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.value === url) {
        return div;
      }
    }
    return null;
  }

  let index = 0;

  function downloadNext() {
    if (index < totalFiles) {
      const url = urls[index];
      const fileName = getFileNameFromUrl(url);
      const fileExtension = getFileExtension(url);
      const div = getDivContainingUrl(url);

      if (div) {
        const buttonText = getButtonInnerText(div);
        const checkboxValue = getCheckboxValue(div);
        const fullFileName = buttonText + '.' + fileExtension;

        if (checkboxValue === url) {
          const xhr = new XMLHttpRequest();
         const secureUrl = url.replace('http://', 'https://');
          xhr.open('GET', secureUrl);

          xhr.responseType = 'blob';

          // Add progress event listener
          xhr.addEventListener('progress', function(event) {
            if (event.lengthComputable) {
              const percentComplete = (event.loaded / event.total) * 100;
              const currentFileSize = formatFileSize(event.total);
              updateProgress(percentComplete,currentFileSize);
            }
          });

          xhr.onload = function() {
            if (xhr.status === 200) {
              const blob = new Blob([xhr.response]);
              const fileUrl = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = fileUrl;
              a.setAttribute('download', fullFileName);

              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(fileUrl);
              index++;

              updateFileCount(index, totalFiles);

              setTimeout(downloadNext, 1000); // Delay between downloads (1 second)
            }
          };

          xhr.send();
        } else {
          console.log('Checkbox value does not match URL:', url);
          index++;
          downloadNext();
        }
      } else {
        console.log('Div not found for URL:', url);
        index++;
        downloadNext();
      }
    }
  }

  downloadNext();
}
function formatFileSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 Bytes';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
}

            function getFileNameFromUrl(url) {
                const matches = url.match(/\/([^/]+)$/);
                if (matches && matches.length > 1) {
                    return matches[1];
                }
                return '';
            }

            // Function to copy text to clipboard
            function copyToClipboard(text) {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }

            document.body.appendChild(submenuContainer);
            submenuContainer.appendChild(refreshButton);
        }

        submitButton.click();
       }
})();
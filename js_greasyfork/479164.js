// ==UserScript==
// @name            Geoguessrtips
// @namespace       https://www.leonbrandt.com
// @version         3.1
// @description     A specific map is required to prompt. Press 1 to prompt for knowledge in plonkit, such as: plonkit novice guide, etc., or a question bank with tips keywords can be used.
// @author          Leon Brandt
// @homepage        https://www.leonbrandt.com
// @match           https://www.geoguessr.com/*
// @grant           GM_xmlhttpRequest
// @run-at          document-idle
// @connect         nominatim.openstreetmap.org
// @connect         knowledgetips.fun
// @connect      cdn.nlark.com
// @downloadURL https://update.greasyfork.org/scripts/479164/Geoguessrtips.user.js
// @updateURL https://update.greasyfork.org/scripts/479164/Geoguessrtips.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let isMatch = true;
const modalHTML = `
    <div id="customModal" style="
        cursor: move; /* 设置鼠标为可移动状态 */
        display: none; /* 初始设置为不显示，更改为block显示模态窗口 */
        position: fixed; /* 固定位置 */
        z-index: 1000; /* 设置堆叠顺序 */
        top: 10vh; /* 距离顶部10%的视口高度 */
        left: 10vw; /* 距离左侧10%的视口宽度 */
        background-color: #eee; /* 背景颜色 */
        padding: 5px; /* 内边距 */
        border-radius: 10px; /* 边框圆角 */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 盒子阴影 */
        width: 80vw; /* 宽度（这里可能是个错误，180vw可能过大） */
        max-width: 350px; /* 最大宽度 */
        transform: translate(0, 0); /* 移动转换（之前的负值已移除） */
        text-align: left; /* 文本对齐方式 */
        opacity: 0; /* 初始设置为透明，更改为1显示 */
        visibility: hidden; /* 初始设置为隐藏，更改为visible显示 */
    ">
    <div id="customModalHeader" style="cursor: move; padding: 10px; background-color: #eee;">
        <h2 style="cursor: move; user-select: none; margin-top: 0; margin-bottom: 20px; font-size: 1.5em; color: #333;">小技巧</h2>
    <!-- 图片模态窗口 -->
<div id="imageModal" style="display:none;">
    <button id="toggleButton">地图打开/关闭</button>
</div>
        <button id="pinModal" style="position: absolute; top: 3px; right: 30px; cursor: pointer;">📌</button>
        <div id="modalContent" style="user-select: text;">无提示</div>
        <!-- 新增文本输入框 -->
    <!-- 使用 textarea 替换原有的 input -->
    <textarea id="customInputBox" placeholder="在此输入内容..." style="
        width: 90%; /* 输入框宽度 */
        padding: 5px; /* 内边距 */
        margin: 10px 5%; /* 外边距，水平居中 */
        border: 1px solid #ccc; /* 边框 */
        border-radius: 5px; /* 边框圆角 */
        overflow-y: hidden; /* 隐藏垂直滚动条 */
        resize: none; /* 禁止用户手动调整大小 */
    "></textarea>
        <!-- 设置按钮 -->
          <div id="settingsPanel" style="display: none; padding: 10px; background-color: #f9f9f9; border-bottom: 1px solid #ccc;">
          <label for="countdownTime">设置倒计时（秒）:</label>
          <input type="number" id="countdownTime" value="15" min="1" style="margin-right: 10px;">
          <button id="saveSettings">保存设置</button>
    </div>
        <!-- 新增按钮 -->
        <div style="text-align: center; margin-top: 10px;">
            <button id="addButton" style="padding: 5px 15px; border: none; border-radius: 5px; cursor: pointer;">新增</button>
        </div>
        <span id="modalClose" style="
            position: absolute;
            top: -4px;
            right: 8px;
            cursor: pointer;
            font-size: 1.5em;
            color: #333;
        ">&times;</span>
    </div>
`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
function updateModalPosition(x, y) {
    const modal = document.getElementById('customModal');
    modal.style.left = `${x}px`;
    modal.style.top = `${y}px`;
    localStorage.setItem('modalPosition', JSON.stringify({ x, y }));
}
function restoreModalPosition() {
    const modal = document.getElementById('customModal');
    const position = JSON.parse(localStorage.getItem('modalPosition'));
    if (position) {
        modal.style.left = `${position.x}px`;
        modal.style.top = `${position.y}px`;
    }
}
function createTagElement(text, index) {
    const tagContainer = document.createElement('div');
    tagContainer.classList.add('tag-container');
    const label = document.createElement('span');
    label.textContent = index !== undefined ? `${index + 1}. ` : '';
    label.classList.add('tag-label');
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    paragraph.contentEditable = "true"; 
    paragraph.id = index !== undefined ? `tag-${index}` : undefined;
    const placeholder = document.createElement('div');
    placeholder.style.display = 'none'; 
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.classList.add('save-button');
    saveButton.onclick = index !== undefined ? () => saveTag(paragraph, index) : () => saveTag(paragraph);
    saveButton.style.display = 'none'; 
    applyButtonStyles(saveButton);
let isEditable = false; 
paragraph.ondblclick = function() {
    if (isEditable) {
        makeEditable(paragraph, saveButton, placeholder);
    }
};
    tagContainer.appendChild(label);
    tagContainer.appendChild(paragraph);
    tagContainer.appendChild(placeholder); 
    tagContainer.appendChild(saveButton);
    return tagContainer;
}
function makeEditable(paragraph, saveButton, placeholder) {
    paragraph.contentEditable = "true";
    paragraph.focus(); 
    saveButton.style.display = 'inline-block'; 
    placeholder.style.display = 'block'; 
}
function applyButtonStyles(button) {
        
    button.style.minWidth = '50px';
    button.style.minHeight = '25px';
    button.style.overflow = 'hidden'; 
    button.style.backgroundColor = '#4CAF50'; 
    button.style.color = 'white'; 
    button.style.border = 'none'; 
    button.style.borderRadius = '5px'; 
    button.style.padding = '5px 5px'; 
    button.style.cursor = 'text'; 
    button.onmouseover = function() {
        button.style.backgroundColor = '#45a049'; 
    };
    button.onmouseout = function() {
        button.style.backgroundColor = '#4CAF50'; 
    };
}
    function addCustomStyles() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
        .tag-container {
            display: flex;
            align-items: flex-start;
            margin-bottom: 10px;
        }
        .tag-label {
            margin-right: 8px;
            font-weight: bold;
        }
        .tag-container p {
            margin: 0;
            flex-grow: 1;
            margin-right: 8px;
        }
        .save-button {
            display: none;
            align-self: center;
            flex-shrink: 0;
        }
        @media (max-width: 600px) {
            .save-button {
                min-width: 40px;
                min-height: 20px;
            }
        }
    `;
        document.head.appendChild(style);
    }
    const customInputBox = document.getElementById('customInputBox');
    customInputBox.addEventListener('keyup', function(event) {
        
        if (event.key === 'f') {
            event.stopPropagation();
        }
    });
    customInputBox.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    customInputBox.addEventListener('input', function() {
        adjustTextareaHeight(this);
    });
    function adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto'; 
        textarea.style.height = textarea.scrollHeight + 'px'; 
    }
function preventKeyPropagation() {
    const modal = document.getElementById('customModal');
    modal.addEventListener('keydown', function(event) {
        event.stopPropagation(); 
        
        
    });
}
        
window.addEventListener('load', function() {
        addCustomStyles(); 
        preventKeyPropagation(); 
        
        const savedPosition = localStorage.getItem('modalPosition');
        if (savedPosition) {
        const { x, y } = JSON.parse(savedPosition);
        const modal = document.getElementById('customModal');
        if (modal) {
            modal.style.left = x + 'px';
            modal.style.top = y + 'px';
        }
    }
 /* const storedTagsText = localStorage.getItem('tagsText');
    const storedImageUrls = JSON.parse(localStorage.getItem('imageUrls') || '[]');
    if (storedTagsText) {
        let modalContent = storedTagsText;
        
        if (!isModalContentSame(modalContent)) {
            showModal(modalContent);  
        } else {
        }
    } else {
        
    }
*/
   document.getElementById('addButton').style.display = 'none';
   document.getElementById('customInputBox').style.display = 'none';
    });
let countdownInterval; 
let shouldDisplayServerText = true;  
function showModal(serverText) {
    const modal = document.getElementById('customModal');
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = '倒计时: 15秒';
const storedAddress = localStorage.getItem('address')
                      || localStorage.getItem('state')
                      || localStorage.getItem('city')
                      || localStorage.getItem('region')
                      || '地址信息未找到';
const storedModalPosition = JSON.parse(localStorage.getItem('modalPosition'));
if (storedModalPosition) {
    modal.style.left = storedModalPosition.x + 'px';
    modal.style.top = storedModalPosition.y + 'px';
}
modalContent.innerHTML = `<p>倒计时: 15秒</p><p>地址信息: ${storedAddress}</p>`;
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    let countdown = 15;
    countdownInterval = setInterval(function() {
        countdown--;
        modalContent.innerHTML = `<p>倒计时: ${countdown}秒</p>`;
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            modalContent.innerHTML = `<p>省份：${storedAddress}</p>`;
            const tags = serverText.split('; ');
            tags.forEach((tag, index) => {
                const tagElement = createTagElement(tag, index);
                modalContent.appendChild(tagElement);
            });
        }
    }, 1000);
    modalContent.innerHTML = '倒计时: 15秒';
    if (modal.style.display !== 'none') {
        modal.style.display = 'block';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }
}
    function closeModal() {
        const modal = document.getElementById('customModal');
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => modal.style.display = 'none', 100); 
    }
let isSaveTagActive = false; 
function saveTag(paragraph, index) {
 if (!isSaveTagActive) {
        return; 
    }
const editedText = paragraph.textContent.trim();
paragraph.contentEditable = "false"; 
let tags = [];
tags = localStorage.getItem('tagsText') ? localStorage.getItem('tagsText').split('; ') : [];
    if (index !== undefined) {
        if (editedText === '') {
            tags.splice(index, 1);
            const tagContainer = paragraph.parentElement;
            if (tagContainer) {
                tagContainer.remove();
            }
        } else {
            tags[index] = editedText;
        }
    } else {
        
        if (editedText !== '') {
            tags.push(editedText);
        }
    }
tags = tags.filter(tag => tag && tag.trim());
const updatedTagsText = tags.join('; ');
localStorage.setItem('tagsText', updatedTagsText);
const storedCoordinates = JSON.parse(localStorage.getItem('coordinates'));
const dataToSend = {
    mapsId: localStorage.getItem('mapsId'),
    coordinates: storedCoordinates,
    tagsText: updatedTagsText
};
const saveButton = paragraph.parentElement.querySelector('.save-button');
if (saveButton) {
    saveButton.style.display = 'none';
}
    GM_xmlhttpRequest({
        method: "POST",
        url: 'http://knowledgetips.fun:3000/save-data',
        data: JSON.stringify(dataToSend),
        headers: {
            "Content-Type": "application/json"
        },
        onload: function(response) {
        }
    });
}
isSaveTagActive = false; 
isSaveTagActive = true;  
    //更新标签
function updateTagNumbers() {
    const tags = document.querySelectorAll('.tag-container');
    tags.forEach((tag, index) => {
        const label = tag.querySelector('.tag-label');
        if (label) {
            label.textContent = `${index + 1}. `;
        }
    });
}
function addNewTag() {
    const inputBox = document.getElementById('customInputBox');
    const newText = inputBox.value.trim();
    if (newText) {
        const newTagElement = createTagElement(newText);
        const modalContent = document.getElementById('modalContent');
        modalContent.appendChild(newTagElement);
        
        saveTag(newTagElement.querySelector('p'));
        inputBox.value = '';
        updateTagNumbers();
    }
    const customInputBox = document.getElementById('customInputBox');
    customInputBox.style.height = '30px'; 
}
const addButton = document.getElementById('addButton');
    if (addButton) {
} else {
}
addButton.addEventListener('click', addNewTag);
let isPinned = false;
function loadPinState() {
    const savedState = localStorage.getItem('isPinned');
    if (savedState !== null) {
        
        isPinned = savedState === 'true';
    }
    updatePinButton();
}
function updatePinButton() {
    const pinButton = document.getElementById('pinModal');
    pinButton.textContent = isPinned ? '📍' : '📌'; 
}
function togglePin() {
    isPinned = !isPinned;
    localStorage.setItem('isPinned', isPinned);
    updatePinButton();
}
document.getElementById('pinModal').addEventListener('click', function(event) {
    togglePin();
    event.stopPropagation(); 
});
window.addEventListener('load', loadPinState);
//以上是置顶函数变量
let isDragging = false;
let dragStartX, dragStartY;
let originalX, originalY;
document.getElementById('customModalHeader').addEventListener('mousedown', function(e) {
    if (e.target !== this && e.target !== document.querySelector('#customModalHeader h2')) {
        return;
    }
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    const modal = document.getElementById('customModal');
    originalX = parseInt(window.getComputedStyle(modal).left, 10);
    originalY = parseInt(window.getComputedStyle(modal).top, 10);
    e.preventDefault();
});
document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    let newX = originalX + e.clientX - dragStartX;
    let newY = originalY + e.clientY - dragStartY;
    updateModalPosition(newX, newY);
});
document.addEventListener('mouseup', function(e) {
    if (isDragging) {
        isDragging = false;
        let newX = originalX + e.clientX - dragStartX;
        let newY = originalY + e.clientY - dragStartY;
        updateModalPosition(newX, newY);
        localStorage.setItem('modalPosition', JSON.stringify({ x: newX, y: newY }));
    }
});
document.addEventListener('click', function(event) {
    const modal = document.getElementById('customModal');
    if (!isPinned && !modal.contains(event.target)) {
        closeModal();
    }
});
    document.getElementById('modalClose').addEventListener('click', closeModal);
    function toggleModal() {
        const modal = document.getElementById('customModal');
        if (modal.style.opacity === '1' || modal.style.visibility === 'visible') {
            modal.style.opacity = '0';
            modal.style.visibility = 'hidden';
            modal.style.display = 'none';
        } else {
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.display = 'block';
        }
    }
    document.addEventListener("keyup", function(evt) {
        const targetTagName = (evt.target || evt.srcElement).tagName;
        
        if (evt.key === '1' && targetTagName !== 'INPUT' && targetTagName !== 'TEXTAREA') {
            toggleModal();
        }
    });
    const mapsIdMatch = window.location.href.match(/maps-start\?mapsId=(\d+)/);
    const mapsId = mapsIdMatch ? mapsIdMatch[1] : localStorage.getItem('mapsId') || '未找到ID';
    if (mapsIdMatch) {
        localStorage.setItem('mapsId', mapsId);
    }
const mapsIdPattern = /maps\/([a-zA-Z0-9]+|famous-places)/;
const addressPattern = /\[\["(.*?)","zh"\]\]|\[\[.*?,\["(.*?)","zh"\]\]\]/;
const coordinatePattern = /\[\[null,null,(-?\d+\.\d+),(-?\d+\.\d+)\],\[\d+\.\d+\],\[\d+\.\d+,\d+\.\d+,\d+\.\d+\]\]|\[\s*null,\s*null,\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\s*\]/;
var realSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function(value) {
        
    let currentUrl = this._url;
    this.addEventListener("loadstart", function() {
        currentUrl = this._url; 
    });
this.addEventListener("load", function() {
    let previousMapsId = localStorage.getItem('previousMapsId');
    let currentMapsId = localStorage.getItem('mapsId');
const currentUrlMapsIdMatch = mapsIdPattern.exec(window.location.href);
if (currentUrlMapsIdMatch) {
    const newMapsId = currentUrlMapsIdMatch[1];
    if (newMapsId !== currentMapsId) {
        
        localStorage.setItem('previousMapsId', currentMapsId);
        localStorage.setItem('mapsId', newMapsId);
    }
}
    currentMapsId = localStorage.getItem('mapsId');
    previousMapsId = localStorage.getItem('previousMapsId');
    if (currentMapsId !== previousMapsId) {
    } else {
    }
if (currentUrl.includes('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch') ||
    currentUrl.includes('https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata')) {
/*
https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetadata
https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/SingleImageSearch
*/
        
const responseText = this.responseText;
let addressMatches;
let isAddressFound = false; 
let loopCount = 0; 
while ((addressMatches = addressPattern.exec(responseText)) !== null && loopCount < 3) {
    loopCount++; 
    isAddressFound = true; 
    const address = addressMatches[1] || addressMatches[2];
    const storedAddress = localStorage.getItem('address');
    if (address !== storedAddress) {
        
        localStorage.setItem('address', address);
    } else {
    }
    break; 
}
if (!isAddressFound) {
    localStorage.removeItem('address');
}
if (coordinatePattern.test(responseText)) {
            //
let latitude, longitude;
const matches = coordinatePattern.exec(responseText);
if (matches) {
 //
  function confuse() {
    var seed = Math.random();
    return seed.toString(36).substring(2, 15);
  }
  var unused = confuse(); 
  var coordinateData = {lat: undefined, lon: undefined};
    if (matches[1] !== undefined && matches[2] !== undefined) {
        latitude = matches[1];
        longitude = matches[2];
    }
    else if (matches[3] !== undefined && matches[4] !== undefined) {
        latitude = matches[3];
        longitude = matches[4];
    }
    (function(){
        var fakeLat = Math.random() * 100;
        var fakeLon = Math.random() * 100;
        //
    })();
    if (latitude !== undefined && longitude !== undefined) {
                const storedCoordinatesString = localStorage.getItem('coordinates');
                let storedCoordinates = null;
                if (storedCoordinatesString) {
                    storedCoordinates = JSON.parse(storedCoordinatesString);
                }else {
}
function removeAllMyImages() {
    let existingImages = document.querySelectorAll('#myImage');
    existingImages.forEach(function(img) {
        img.parentNode.removeChild(img);
    });
}
const tolerance = 0.005;
if (!storedCoordinates || !isCoordinateCloseEnough(storedCoordinates, latitude, longitude, tolerance)) {
    localStorage.removeItem('tagsText');
    localStorage.removeItem('address');
    localStorage.removeItem('state');
    removeAllMyImages();
    const coordinates = { latitude, longitude };
    localStorage.setItem('coordinates', JSON.stringify(coordinates));
function getAddress(lat, lon) {
    // console.log(`Fetching address for coordinates: Latitude = ${lat}, Longitude = ${lon}`);
    return new Promise((resolve) => { // 移除 reject 参数
        try {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
                onload: function(response) {
                    // console.log("Received response from OpenStreetMap API", response);
                    if (response.status === 200) {
                        // console.log("Successfully fetched address:", response.responseText);
                        resolve(JSON.parse(response.responseText));
                    } else {
                        console.error(`无法获取地址。状态码: ${response.status}`);
                        resolve({ error: `无法获取地址。状态码: ${response.status}`, lat, lon }); // 使用 resolve 代替 reject
                    }
                },
                onerror: function(error) {
                    console.error("在获取地址时发生错误:", error);
                    resolve({ error: "在获取地址时发生错误", lat, lon }); // 使用 resolve 代替 reject
                }
            });
        } catch (error) {
            console.error("在获取地址时发生异常:", error);
            resolve({ error: "在获取地址时发生异常", lat, lon }); // 使用 resolve 代替 reject
        }
    });
}
getAddress(latitude, longitude)
    .then(addressData => {
function processAddressData(data, key) {
    if (data && data.address && data.address[key]) {
        const fullString = data.address[key];
        const value = fullString.split('/')[0].trim();
        
        const storedValue = localStorage.getItem(key);
        if (storedValue !== null) {
          
            if (storedValue !== value) {
                localStorage.setItem(key, value);
            } else {
                localStorage.setItem(key, value);
            }
        } else {
            localStorage.setItem(key, value);
        }
    } else {
        
    }
}
if (addressData) {
    processAddressData(addressData, 'country');
    processAddressData(addressData, 'state');
    processAddressData(addressData, 'region');
    processAddressData(addressData, 'city'); 
}
                    const country = localStorage.getItem('country');
                    const dataToSend = JSON.stringify({ mapsId, coordinates: `${latitude},${longitude}`,country });
function checkAndSendRequest() {
    if (isMatch) {
        sendRequest();
    } else {
    }
}
let retryCount = 0;
    function sendRequest() {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: 'http://knowledgetips.fun:3000/receive-data',
                        data: JSON.stringify({ mapsId, coordinates: `${latitude},${longitude}`,country }),
                        headers: {
                            "Content-Type": "application/json"
                        },
                        
                       onload: function(response) {
                            
                          
                           const jsonResponse = JSON.parse(response.responseText);
                           
        
        if (jsonResponse.hasOwnProperty('mymapsid')) {
            isMatch = jsonResponse.mymapsid;
        }
                            if (jsonResponse.match && jsonResponse.tags) {
                                
                                
                                const tagsText = jsonResponse.tags.join('; ');
                              
let imgTag = document.getElementById('uniqueImageId');
if (!imgTag) {
    imgTag = document.createElement('img');
    imgTag.id = 'uniqueImageId';
    imgTag.style.height = "80vh"; 
    imgTag.style.width = 'auto' ;
    imgTag.style.position = 'absolute';  
    imgTag.style.left = '30%';  
    imgTag.style.top = '46%';  
    imgTag.style.transform = 'translate(-50%, -50%)';  
    imgTag.style.zIndex = 1200; 
    imgTag.style.display = 'none';  
    document.body.appendChild(imgTag);
}
if (!window.hasAddedKeyListener) {
    document.addEventListener('keyup', function(event) {
        if (event.key === '2') {
            if (imgTag.style.display === 'none') {
                let lastImageUrl = localStorage.getItem('lastImageUrl');
                if (lastImageUrl) {
                    imgTag.src = lastImageUrl;  
                }
                imgTag.style.display = 'block';
            } else {
                imgTag.style.display = 'none';
            }
        }
    });
    window.hasAddedKeyListener = true; 
}
let lastImageUrl = localStorage.getItem('lastImageUrl');
if (jsonResponse.images && jsonResponse.images.length > 0) {
    const imageUrl = jsonResponse.images[0];
    imgTag.src = imageUrl;
    localStorage.setItem('lastImageUrl', imageUrl);
} else {
}
                                localStorage.setItem('tagsText', tagsText);
                                 //
                                localStorage.setItem('coordinates', JSON.stringify(coordinates));
                                
                                const modal = document.getElementById('customModal');
                                if (modal.style.display !== 'none') {
                                    const modalContent = document.getElementById('modalContent');
                                 
                                        modalContent.textContent = tagsText; 
                                }
                                
                              
                                showModal(tagsText);
                            } else {
                modalContent.innerHTML = '无提示';
            }
                           //
                        },
            onerror: function() {
            if (retryCount < 3) {
                retryCount++;
                setTimeout(SendRequest, 3000); 
            } else {
            }
        },
    ontimeout: function() {
        
        
    }
                    });
}
checkAndSendRequest();
window.checkAndSendRequest = checkAndSendRequest;
    })
    .catch(errorData => {
        
        
    });
                } else {
}
function isCoordinateCloseEnough(storedCoordinates, latitude, longitude, tolerance) {
    const latDifference = Math.abs(storedCoordinates.latitude - latitude);
    const lonDifference = Math.abs(storedCoordinates.longitude - longitude);
    return latDifference <= tolerance && lonDifference <= tolerance;
}
            }else {
}
                    } else {
        
    }
if (latitude !== undefined && longitude !== undefined) {
}
        }else {
    modalContent.innerHTML = '';
//
    }
            }
    }, false);
    realSend.call(this, value);
};
XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
    this._url = url; 
    this.realOpen(method, url, async, user, pass);
};
    if (XMLHttpRequest.prototype.send === XMLHttpRequest.prototype.realSend) {
    } else {
    }
})();
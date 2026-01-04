// ==UserScript==
// @name        [루시퍼홍] 아실 시세지도 그리기
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     1.11
// @description 2024. 7. 17. 오후 1:50:03
// @downloadURL https://update.greasyfork.org/scripts/500905/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/500905/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11088710';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  // 한국 시간을 가져오는 함수
  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
    const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
    return koreanTime;
  }

  // 날짜를 24시간 형식으로 포맷하는 함수
  function formatDateTo24Hour(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 최신 버전을 가져오기 위해 메타 파일을 가져옴
  fetch(`${updateUrl}?_=${Date.now()}`)
    .then(response => response.text())
    .then(meta => {
      const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

      if (latestVersionMatch) {
        const latestVersion = latestVersionMatch[1];
        console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

        if (currentVersion !== latestVersion) {
          if (!shouldDismissPopup()) {
            showUpdatePopup(latestVersion);
          }
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch the latest version information:', error);
    });

  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;

    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }

  function dismissPopup() {
    const koreanTime = getKoreanTime();
    const formattedTime = formatDateTo24Hour(koreanTime);
    localStorage.setItem(popupDismissKey, formattedTime);
  }

  function showUpdatePopup(latestVersion) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '10000';

    const message = document.createElement('p');
    message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
    popup.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = () => {
      window.open(cafeUrl, '_blank');
      document.body.removeChild(popup);
    };
    popup.appendChild(confirmButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.onclick = () => {
      dismissPopup();
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }
})();


(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    console.log("currentVersion: " + currentVersion);
    const updateUrl = 'https://update.greasyfork.org/scripts/500905/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.meta.js';
    const downloadUrl = 'https://update.greasyfork.org/scripts/500905/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%8B%9C%EC%84%B8%EC%A7%80%EB%8F%84%20%EA%B7%B8%EB%A6%AC%EA%B8%B0.user.js';
    const cafeUrl = 'https://cafe.naver.com/wecando7/11088710';
    const popupDismissKey = 'scriptUpdatePopupDismissed';
    const dismissDuration = 24 * 60 * 60 * 1000; // 24시간
    let toggleStatus = '시세1'; // 초기값 시세1

    // 버튼 추가 코드
    let siSeMapBtn = `<div class="filter_item" id="siSeMap"><a href="#" class="filter_btn" id="siSeMapBtn"><i></i>시세1</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(siSeMapBtn);
    let siSeMapClearBtn = `<div class="filter_item" id="siSeMapClear"><a href="#" class="filter_btn" id="siSeMapClearBtn"><i></i>시세초기화</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(siSeMapClearBtn);
    let siSeMapCopyBtn = `<div class="filter_item" id="siSeMapCopy"><a href="#" class="filter_btn" id="siSeMapCopyBtn"><i></i>시세1->2복제</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(siSeMapCopyBtn);
    let imsyBtn = `<div class="filter_item" id="imsyBtn"><a href="#" class="filter_btn" id="imsyBtn"><i></i>시세 없는 단지 숨기기</a></div>`;
    jQuery('#filter > div.filter_scroll > div').append(imsyBtn);

    // 버튼 클릭 시 토글 동작 처리
    jQuery('#siSeMapBtn').on('click', function() {
        toggleStatus = (toggleStatus === '시세1') ? '시세2' : '시세1';
        console.log('현재 토글 상태:', toggleStatus);
        // 버튼 텍스트 업데이트
        jQuery(this).text(toggleStatus);
    });

    // 시세초기화 버튼 클릭 시 동작 처리
    jQuery('#siSeMapClearBtn').on('click', function() {
        const confirmation = confirm(`정말로 ${toggleStatus} 데이터를 초기화하시겠습니까?\n\n초기화 하시기 전에 파일 내보내기로 백업을 권장드립니다.`);
        if (confirmation) {
            clearData(toggleStatus);
        }
    });

    jQuery('#imsyBtn').on('click', function() {
/*
      document.querySelectorAll('.t3').forEach(function(element) {
            element.style.height = '20px';
           let firstLine = element.innerHTML.split('<br>')[0];

            // 첫 번째 줄만 남기고 나머지를 제거합니다.
            element.innerHTML = firstLine;
            });
*/
         document.querySelectorAll('div[id^="apt"]').forEach(function(div) {
            if (!div.querySelector('.t3')) {
                div.style.display = 'none';
            }
        });


    });


    // 시세1 데이터를 시세2로 복제하는 함수
function copySiSe1ToSiSe2() {
    initIndexedDB().then(db => {
        const transaction = db.transaction(['apartments'], 'readwrite');
        const store = transaction.objectStore('apartments');
        const index = store.index('type');
        const range = IDBKeyRange.only('시세1');
        const getAllRequest = index.openCursor(range);

        getAllRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const record = cursor.value;
                // Replace only '시세1' with '시세2' in the 'type' field
                const newIdType = `${record.id.replace('시세1', '시세2')}`;

                // 복제할 데이터의 새로운 속성
                const newRecord = {
                    idType: newIdType,
                    id: record.id.replace('시세1', '시세2'),
                    name: record.name,
                    text: record.text,
                    color: record.color,
                    textColor: record.textColor,
                    fontSize: record.fontSize,
                    type: '시세2'
                };

                // 기존 시세2 데이터를 업데이트 또는 새로 추가
                store.put(newRecord);

                cursor.continue();
            }
        };

        transaction.oncomplete = function() {
            alert('시세1 데이터를 시세2로 성공적으로 복제하였습니다.');
        };

        transaction.onerror = function(event) {
            console.error('Transaction error during copy: ', event.target.errorCode);
        };
    }).catch(error => {
        console.error('Error initializing IndexedDB:', error);
    });
}


    // 시세 복제 버튼 클릭 시 동작 처리
    jQuery('#siSeMapCopyBtn').on('click', function() {
        const confirmation = confirm('정말로 시세1 데이터를 시세2로 복제하시겠습니까?\n\n복제 과정에서 시세2의 기존 데이터가 업데이트될 수 있습니다.');
        if (confirmation) {
            copySiSe1ToSiSe2();
        }
    });

    // 시세 구분이 없는 데이터를 시세1로 복제하고 원본 삭제하는 함수
    function migrateOldDataToSiSe1() {
    initIndexedDB().then(db => {
        const transaction = db.transaction(['apartments'], 'readwrite');
        const store = transaction.objectStore('apartments');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = function(event) {
            const allRecords = event.target.result;

            allRecords.forEach(record => {
                if (!record.id.includes('-시세')) {
                    // id에 시세 구분이 없는 경우 시세1으로 복제
                    const newId = `${record.id}-시세1`;
                    const newIdType = `${newId}`;

                    const newRecord = {
                        idType: newIdType,
                        id: newId,
                        name: record.name,
                        text: record.text,
                        color: record.color,
                        textColor: record.textColor,
                        fontSize: record.fontSize,
                        type: '시세1'
                    };

                    // 새로운 시세1 레코드 저장
                    store.put(newRecord);

                    // 원본 데이터 삭제
                    store.delete(record.id);
                }
            });

            transaction.oncomplete = function() {
                console.log('시세 구분 없는 데이터를 시세1로 마이그레이션 완료.');
            };
        };

        transaction.onerror = function(event) {
            console.error('Transaction error during migration: ', event.target.errorCode);
        };
    }).catch(error => {
        console.error('Error initializing IndexedDB for migration: ', error);
    });
}


    // 데이터베이스에서 특정 시세 데이터를 삭제하는 함수
    function clearData(type) {
    initIndexedDB().then(db => {
        const transaction = db.transaction(['apartments'], 'readwrite');
        const store = transaction.objectStore('apartments');

        const getAllRequest = store.openCursor();  // Open a cursor to iterate through all records

        getAllRequest.onsuccess = function(event) {
            const cursor = event.target.result;
            if (cursor) {
                const record = cursor.value;
                // Check if the idType matches the specified type
                if (record.type === type) {
                    store.delete(cursor.primaryKey);  // Delete the record if it matches
                }
                cursor.continue();  // Move to the next record
            }
        };

        transaction.oncomplete = function() {
            alert(`${type} 데이터가 성공적으로 초기화되었습니다.`);
        };

        transaction.onerror = function(event) {
            console.error('Transaction error: ', event.target.errorCode);
        };
    }).catch(error => {
        console.error('Error initializing IndexedDB:', error);
    });
}


//  width: 76px;
    // Add CSS to make t2 and t3 elements dynamically adjust height
    const style = document.createElement('style');
    style.innerHTML = `
       .t3 {
        display: block;
        width: 76px;
        line-height: 17px !important;
        font-weight : bold;
        padding: 0px 0px 0px 0px;
        font-size: 13px;
        color: #fff;
        letter-spacing: 0;
        box-sizing: border-box;
        text-align: center;
        white-space: normal;
        word-break: break-word;
        overflow-wrap: break-word;
        height: auto;
        background-color: #1C32F7;
        border : 1px #1C32F7 solid;
        transition: height 0.2s, background-color 0.2s, color 0.2s, font-size 0.2s;
    }

        .color-input, .color-div, .font-size-input {
            margin-top: 10px;
        }
        .small-square {
            width: 30px;
            height: 30px;
            cursor: pointer;
            display: inline-block;
        }
        .color-div {
            display: flex;
            flex-wrap: wrap;
            width: 220px;
        }
        .draggable {
            cursor: move;
        }
        .color-picker-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .color-picker-wrapper input[type="color"] {
            padding: 0;
            margin: 0;
        }
        .custom-modal-siseMap textarea::selection {
            background: #b3d4fc;
            color: #000000;
        }
        .custom-modal-siseMap textarea {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            padding: 5px;
            resize: none;
            border: 1px solid #ccc;
            outline: none;
            font-size: 14px;
            line-height: 1.5;
        }
        .export-button, .import-button {
            margin: 10px;
            padding: 10px 20px;
            background-color: #1C32F7;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 14px;
        }
        .export-button:hover, .import-button:hover {
            background-color: #1427b0;
        }
        .pink-background {
            background-color: pink;
        }

    `;
    document.head.appendChild(style);

    // Initialize IndexedDB and preserve existing data while applying new schema
    function initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('AptDB', 3); // 버전 3으로 업데이트

            request.onupgradeneeded = function(event) {
                const db = event.target.result;

                if (!db.objectStoreNames.contains('apartments')) {
                    const store = db.createObjectStore('apartments', { keyPath: 'idType' });
                    store.createIndex('color', 'color', { unique: false });
                    store.createIndex('textColor', 'textColor', { unique: false });
                    store.createIndex('fontSize', 'fontSize', { unique: false });
                    store.createIndex('type', 'type', { unique: false });
                }
            };

            request.onsuccess = function(event) {
                const db = event.target.result;
                resolve(db);
            };

            request.onerror = function(event) {
                console.error('IndexedDB error: ' + event.target.errorCode);
                reject('IndexedDB error: ' + event.target.errorCode);
            };
        });
    }

    // Get data from IndexedDB
    function getFromIndexedDB(id, type) {
        const idType = `${id}-${type}`;
        //console.log(`Fetching data with idType: ${idType}`);

        return new Promise((resolve, reject) => {
            initIndexedDB().then(db => {
                const transaction = db.transaction(['apartments'], 'readonly');
                const store = transaction.objectStore('apartments');
                const request = store.get(idType);

                request.onsuccess = function(event) {
                    //console.log(`Data fetched successfully: ${JSON.stringify(event.target.result)}`);
                    resolve(event.target.result || {}); // Resolve with an empty object if no data found
                };

                request.onerror = function(event) {
                   // console.error('Transaction error: ' + event.target.errorCode);
                    reject('Transaction error: ' + event.target.errorCode);
                };
            }).catch(error => {
                //console.error('Error initializing IndexedDB: ' + error);
                reject('Error initializing IndexedDB: ' + error);
            });
        });
    }

    // Delete data from IndexedDB
    // Delete data from IndexedDB
function deleteFromIndexedDB(id, type) {
    const idType = `${id}-${type}`; // id에 시세 구분을 포함

    initIndexedDB().then(db => {
        const transaction = db.transaction(['apartments'], 'readwrite');
        const store = transaction.objectStore('apartments');
        store.delete(idType);

        transaction.oncomplete = function() {
            console.log(`Data deleted successfully for idType: ${idType}`);
        };

        transaction.onerror = function(event) {
            console.error('Transaction error: ', event.target.errorCode);
        };
    }).catch(error => {
        console.error('Error initializing IndexedDB:', error);
    });
}


    // Update the t2 element from IndexedDB
    function updateT2FromIndexedDB(id) {
        getFromIndexedDB(id, toggleStatus).then(data => {
            const element = document.getElementById(id);
            if (element) {
                const t2Element = element.querySelector('.t2');
                if (data && data.text !== undefined) {
                    t2Element.innerHTML = (data.text || '').replace(/\n/g, '<br>'); // Update t2's value with the database value
                    t2Element.style.backgroundColor = data.color || '#1C32F7';
                    t2Element.style.color = data.textColor || '#FFFFFF';
                    t2Element.style.fontSize = data.fontSize || '11px';
                    autoResize(t2Element);
                    t2Element.classList.remove('t2');
                    t2Element.classList.add('t3');
                    //console.log(`Element updated successfully: ${id}`);
                } else {
                    //console.log(`No data found for id: ${id} with type: ${toggleStatus}`);
                }
            }
        }).catch(error => {
            console.error('Error getting data from IndexedDB: ' + error);
        });
    }

    // Save data to IndexedDB
    // Save data to IndexedDB
function saveToIndexedDB(id, t1, t2, color, textColor, fontSize, type) {
    const idType = `${id}-${type}`; // id에 시세 구분을 포함
    //console.log(`Saving data with idType: ${idType}`);

    if (t2.trim() === '') {
        deleteFromIndexedDB(id, type); // 시세 구분을 포함한 id로 삭제
    } else {
        initIndexedDB().then(db => {
            const transaction = db.transaction(['apartments'], 'readwrite');
            const store = transaction.objectStore('apartments');
            store.put({ idType: idType, id: idType, name: t1, text: t2, color: color, textColor: textColor, fontSize: fontSize, type: type });

            transaction.oncomplete = function() {
                console.log(`Text saved to IndexedDB successfully with idType: ${idType}`);
            };

            transaction.onerror = function(event) {
                console.error('Transaction error: ', event.target.errorCode);
            };
        }).catch(error => {
            console.error('Error initializing IndexedDB:', error);
        });
    }
}


    // Make the modal draggable
    function makeModalDraggable(modal) {
        let isDragging = false;
        let offsetX, offsetY;

        const header = document.createElement('div');
        header.className = 'draggable';
        header.style.padding = '10px';
        header.style.cursor = 'move';
        header.style.backgroundColor = '#f1f1f1';
        header.style.borderBottom = '1px solid #ccc';
        header.textContent = 'Drag me';

        modal.insertBefore(header, modal.firstChild);

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - modal.offsetLeft;
            offsetY = e.clientY - modal.offsetTop;
            document.addEventListener('mousemove', moveModal);
            document.addEventListener('mouseup', stopDragging);
        });

        function moveModal(e) {
            if (isDragging) {
                modal.style.left = `${e.clientX - offsetX}px`;
                modal.style.top = `${e.clientY - offsetY}px`;
            }
        }

        function stopDragging() {
            isDragging = false;
            document.removeEventListener('mousemove', moveModal);
            document.removeEventListener('mouseup', stopDragging);
        }
    }

    // Create and show a modal with textarea and color picker for input
    function showTextareaModal(defaultText, defaultColor, defaultTextColor, defaultFontSize, callback) {
        // Close existing modal if present
        const existingModal = document.querySelector('.custom-modal-siseMap');
        if (existingModal) {
          console.log(existingModal)
          document.body.removeChild(existingModal);

        }


        // Initialize the textarea with an empty value
        const textWithNewlines = defaultText || '';

        // Create modal elements
        const modal = document.createElement('div');
        modal.className = 'custom-modal-siseMap';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.border = '1px solid #ccc';
        modal.style.padding = '20px';
        modal.style.zIndex = '10000';
        modal.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        modal.style.width = '300px';

        makeModalDraggable(modal);

        const textarea = document.createElement('textarea');
        textarea.rows = 10;
        textarea.cols = 50;
        textarea.value = textWithNewlines;
        textarea.style.width = '100%';

        modal.appendChild(textarea);

        const colorDiv = document.createElement('div');
        colorDiv.className = 'color-div';

        const colors = ['#000000', '#454648', '#474C4F', '#FF0000', '#FF6600', '#FFFF00', '#92D050', '#00B050', '#00B0F0', '#0070C0', '#000099', '#7030A0', '#CC3399', '#FF66CC'];

        colors.forEach(color => {
            const smallSquare = document.createElement('div');
            smallSquare.className = 'small-square';
            smallSquare.style.backgroundColor = color;
            smallSquare.onclick = () => {
                colorInput.value = color;
                colorPicker.value = color;
            };
            colorDiv.appendChild(smallSquare);
        });

        modal.appendChild(colorDiv);

        const colorPickerWrapper = document.createElement('div');
        colorPickerWrapper.className = 'color-picker-wrapper';

        const colorPickerLabel = document.createElement('label');
        colorPickerLabel.textContent = '배경색 : ';
        const colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = defaultColor || '#1C32F7';

        const colorInput = document.createElement('input');
        colorInput.type = 'text';
        colorInput.className = 'color-input';
        colorInput.placeholder = '색상값 입력 #000000';
        colorInput.value = defaultColor || '#1C32F7';
        colorInput.style.width = '80px';
        colorInput.style.marginTop = '0px';

        colorPicker.oninput = () => {
            colorInput.value = colorPicker.value;
        };

        colorPickerWrapper.appendChild(colorPickerLabel);
        colorPickerWrapper.appendChild(colorPicker);
        colorPickerWrapper.appendChild(colorInput);

        modal.appendChild(colorPickerWrapper);

        colorInput.addEventListener('input', () => {
            if (/^#[0-9A-F]{6}$/i.test(colorInput.value)) {
                colorPicker.value = colorInput.value;
            }
        });

        const textColorPickerWrapper = document.createElement('div');
        textColorPickerWrapper.className = 'color-picker-wrapper';

        const textColorPickerLabel = document.createElement('label');
        textColorPickerLabel.textContent = '글자색 : ';
        const textColorPicker = document.createElement('input');
        textColorPicker.type = 'color';
        textColorPicker.value = defaultTextColor || '#FFFFFF';

        const textColorInput = document.createElement('input');
        textColorInput.type = 'text';
        textColorInput.className = 'color-input';
        textColorInput.placeholder = '색상값 입력 #FFFFFF';
        textColorInput.value = defaultTextColor || '#FFFFFF';
        textColorInput.style.width = '80px';
        textColorInput.style.marginTop = '0px';

        textColorPicker.oninput = () => {
            textColorInput.value = textColorPicker.value;
        };

        textColorInput.addEventListener('input', () => {
            if (/^#[0-9A-F]{6}$/i.test(textColorInput.value)) {
                textColorPicker.value = textColorInput.value;
            }
        });

        textColorPickerWrapper.appendChild(textColorPickerLabel);
        textColorPickerWrapper.appendChild(textColorPicker);
        textColorPickerWrapper.appendChild(textColorInput);

        modal.appendChild(textColorPickerWrapper);

        const fontSizeWrapper = document.createElement('div');
        fontSizeWrapper.className = 'font-size-wrapper';

        const fontSizeLabel = document.createElement('label');
        fontSizeLabel.textContent = '글자 크기 : ';
        const fontSizeInput = document.createElement('input');
        fontSizeInput.type = 'number';
        fontSizeInput.className = 'font-size-input';
        fontSizeInput.value = defaultFontSize.replace("px","") || '13';
        fontSizeInput.style.width = '80px';

        fontSizeWrapper.appendChild(fontSizeLabel);
        fontSizeWrapper.appendChild(fontSizeInput);

        modal.appendChild(fontSizeWrapper);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '10px';
        buttonContainer.style.textAlign = 'right';

        const saveButton = document.createElement('button');
        saveButton.textContent = ' 확인 ';
        saveButton.style.marginRight = '10px';
        saveButton.onclick = () => {
            callback(textarea.value, colorInput.value, textColorInput.value, fontSizeInput.value + 'px');
            closePopup();
            document.body.removeChild(modal);
        };
        buttonContainer.appendChild(saveButton);

        const cancelButton = document.createElement('button');
        cancelButton.textContent = ' 닫기 ';
        cancelButton.onclick = () => {
            document.body.removeChild(modal);
            closePopup();
        };
        buttonContainer.appendChild(cancelButton);

        modal.appendChild(buttonContainer);

        // Append modal to body
        document.body.appendChild(modal);
    }

    // Get the computed color of an element
    function getComputedColor(element) {
        return window.getComputedStyle(element).color;
    }

    // Enable editing on right-click
    function enableEditing(id) {
        const editableDiv = document.getElementById(id);
        if (editableDiv) {
            editableDiv.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                const t2Element = editableDiv.querySelector('.t3') || editableDiv.querySelector('.t2');
                const t1Content = editableDiv.querySelector('.t1') ? editableDiv.querySelector('.t1').innerText : '';
                const t2Color = rgbToHex(t2Element.style.backgroundColor) || '#1C32F7';
                const t2TextColor = rgbToHex(t2Element.style.color || getComputedColor(t2Element)) || '#FFFFFF';
                const t2FontSize = t2Element.style.fontSize || '11px';
                getFromIndexedDB(editableDiv.id, toggleStatus).then(data => {
                    const t2Content = data.text || '';
                    showTextareaModal(t2Content, t2Color, t2TextColor, t2FontSize, (newText, newColor, newTextColor, newFontSize) => {
                        t2Element.innerHTML = newText.replace(/\n/g, '<br>');
                        t2Element.style.backgroundColor = newColor;
                        t2Element.style.color = newTextColor;
                        t2Element.style.fontSize = newFontSize;
                        saveToIndexedDB(editableDiv.id, t1Content, newText, newColor, newTextColor, newFontSize, toggleStatus);
                        autoResize(t2Element);
                    });
                }).catch(error => {
                    console.error('Error getting data from IndexedDB: ' + error);
                    showTextareaModal('', t2Color, t2TextColor, t2FontSize, (newText, newColor, newTextColor, newFontSize) => {
                        t2Element.innerHTML = newText.replace(/\n/g, '<br>');
                        t2Element.style.backgroundColor = newColor;
                        t2Element.style.color = newTextColor;
                        t2Element.style.fontSize = newFontSize;
                        saveToIndexedDB(editableDiv.id, t1Content, newText, newColor, newTextColor, newFontSize, toggleStatus);
                        autoResize(t2Element);
                    });
                });
            });
        }
    }

    // Convert RGB to HEX
    function rgbToHex(rgb) {
        if (!rgb) return '#1C32F7'; // Default color
        const result = rgb.match(/\d+/g).map((num) => {
            const hex = parseInt(num).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        });
        return `#${result.join('')}`;
    }

    // Dynamically resize t2 element based on content
    function autoResize(element) {
        element.style.height = 'auto'; // Reset the height to auto
        element.style.height = element.scrollHeight + 'px'; // Set the height to the scrollHeight
    }

    // Initialize MutationObserver
    function initMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) { // If child nodes are added
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // If it's an element node
                            // Directly added nodes with ID starting with 'apt'
                            if (node.id && node.id.startsWith('apt')) {
                                const nodeId = node.id.trim().replace(/[\r\n]/g, '');

                                //const yearBtnCheck = document.getElementById('yearBtn');
                                //const yearSelectCheck = yearBtn.classList.contains('pink-background')
                                //if(yearSelectCheck){
                                //  updateBackgroundImage();
                                //}else{
                                  enableEditing(nodeId);
                                  updateT2FromIndexedDB(nodeId);
                                //}
                            } else {
                                // Child nodes with ID starting with 'apt'
                                node.querySelectorAll('[id^="apt"]').forEach(childNode => {
                                    const childNodeId = childNode.id.trim().replace(/[\r\n]/g, '');
                                  //updateBackgroundImage();
                                  enableEditing(childNodeId);
                                    updateT2FromIndexedDB(childNodeId);
                                });
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true }); // Observe the body and its subtree
    }

    // Initialize existing nodes on DOM load
    function initializeExistingNodes() {
        document.querySelectorAll('[id^="apt"]').forEach(node => {
            const nodeId = node.id.trim().replace(/[\r\n]/g, '');
            enableEditing(nodeId);
            updateT2FromIndexedDB(nodeId);
        });
    }

    // Export IndexedDB data to JSON file
    function exportToJSON() {
        initIndexedDB().then(db => {
            const transaction = db.transaction(['apartments'], 'readonly');
            const store = transaction.objectStore('apartments');
            const request = store.getAll();

            request.onsuccess = function(event) {
                const data = event.target.result;
                const jsonData = JSON.stringify(data, null, 2);
                const blob = new Blob([jsonData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);

                const now = new Date();
                const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
                const formattedTime = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
                const filename = `아실_시세지도_내보내기_${formattedDate}_${formattedTime}.json`;

                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };

            request.onerror = function(event) {
                console.error('Transaction error: ', event.target.errorCode);
            };
        }).catch(error => {
            console.error('Error initializing IndexedDB:', error);
        });
    }

    // Import JSON file data into IndexedDB
    function importFromJSON(file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            initIndexedDB().then(db => {
                const transaction = db.transaction(['apartments'], 'readwrite');
                const store = transaction.objectStore('apartments');

                data.forEach(item => {
                    // Check if type exists, if not create it as '시세1'
                    if (!item.type) {
                        item.type = '시세1';
                    }

                    // Check if idType exists, if not create it
                    if (!item.idType) {
                        item.idType = `${item.id}-${item.type}`;
                    }
                    store.put(item);
                });

                transaction.oncomplete = function() {
                    alert('Data imported successfully.');
                    initializeExistingNodes();
                };

                transaction.onerror = function(event) {
                    console.error('Transaction error: ', event.target.errorCode);
                };
            }).catch(error => {
                console.error('Error initializing IndexedDB:', error);
            });
        };
        reader.readAsText(file);
    }

    // Check the current frame's URL
    if (!window.location.href.includes('https://asil.kr/asil/sub/') && !window.location.href.includes('https://asil.kr/app/price_detail') && !window.location.href.includes('https://asil.kr/asil/apt_price')) {
        // Check if the export button already exists
        if (!document.querySelector('.export-button')) {
            const exportButton = document.createElement('button');
            exportButton.textContent = '파일 내보내기';
            exportButton.className = 'export-button';
            exportButton.onclick = exportToJSON;
            document.body.appendChild(exportButton);
        }

        // Check if the import button already exists
        if (!document.querySelector('.import-button')) {
            const importButton = document.createElement('button');
            importButton.textContent = '파일 가져오기';
            importButton.className = 'import-button';
            importButton.onclick = () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'application/json';
                input.onchange = event => {
                    const file = event.target.files[0];
                    if (file) {
                        importFromJSON(file);
                    }
                };
                input.click();
            };
            document.body.appendChild(importButton);
        }
    }

/////////////////////////////////////////////////////////////////////////////////
// ✅ 현재 선택된 마커 세트 (`t1`, `t2`, `t3`가 포함된 컨테이너)
var activeMarkerSet = null;
var isPopupOpen = false; // 팝업 열림 여부
var markerPosition = { x: 0, y: 0 }; // 마커 위치 저장

// ✅ 선택된 마커 세트 스타일 강조 (빨간색 테두리 추가)


// ✅ 마우스 우클릭하면 해당 마커 세트(`t1`, `t2`, `t3`) 선택
document.body.addEventListener("contextmenu", function(event) {
    let clickedElement = event.target.closest(".t3, .t2, .t1");
    if (!clickedElement) return;

    event.preventDefault(); // 우클릭 기본 메뉴 방지

    let markerSet = clickedElement.closest("div[id^='apt']"); // 마커 컨테이너
    if (!markerSet) return;


    activeMarkerSet = markerSet;


    // ✅ 현재 요소의 위치 저장 (transform 기준)
    let computedStyle = window.getComputedStyle(activeMarkerSet);
    let matrix = new WebKitCSSMatrix(computedStyle.transform);
    markerPosition.x = matrix.m41; // X 좌표
    markerPosition.y = matrix.m42; // Y 좌표

    isPopupOpen = true; // 팝업 열린 상태로 설정
    //console.log("✅ 선택된 마커 세트:", activeMarkerSet, "현재 위치:", markerPosition);
});

// ✅ `custom-modal-sisemap` 닫기 버튼을 기존 생성하는 부분에 추가
function closePopup() {
  //console.log("호출")
    isPopupOpen = false;
    if (activeMarkerSet) {

        activeMarkerSet = null;
    }
    //console.log("❌ 이동 모드 종료");
}



// ✅ WASD 입력으로 마커 세트 이동 (팝업이 열려 있는 동안)
function handleMarkerKeyDown(event) {
    if (!activeMarkerSet || !isPopupOpen) return;

    // 🔴 현재 입력 필드가 textarea이면 이동 방지
    if (event.target.tagName === "TEXTAREA") return;

    let step = 5; // 이동 거리 (픽셀 단위)

    switch (event.key) {
        case "w": case "ㅈ":
            markerPosition.y -= step;
            break;
        case "s": case "ㄴ":
            markerPosition.y += step;
            break;
        case "a": case "ㅁ":
            markerPosition.x -= step;
            break;
        case "d": case "ㅇ":
            markerPosition.x += step;
            break;
        default:
            return; // WASD 이외의 키는 무시
    }

    // ✅ transform을 사용하여 전체 마커 세트 이동 적용
    activeMarkerSet.style.transform = `translate(${markerPosition.x}px, ${markerPosition.y}px)`;

    event.preventDefault(); // 🔴 WASD 키 입력에 대해서만 기본 동작 방지
}


// ✅ 키보드 이벤트 중복 방지
document.removeEventListener("keydown", handleMarkerKeyDown);
document.addEventListener("keydown", handleMarkerKeyDown);


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    // 초기화 및 데이터 마이그레이션 호출
    migrateOldDataToSiSe1();

    // Initialize MutationObserver to monitor DOM changes
    initMutationObserver();

    // Initialize existing nodes on page load
    initializeExistingNodes();


})();

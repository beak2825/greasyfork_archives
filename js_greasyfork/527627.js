// ==UserScript==
// @name         DC Clipboard Test
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  클립보드 테스트
// @author       Arisaka Mashiro
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527627/DC%20Clipboard%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/527627/DC%20Clipboard%20Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 모달 생성
    function createModal() {
        let modal = document.createElement('div');
        modal.id = 'clipboardModal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '1px solid #ccc';
        modal.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.2)';
        modal.style.zIndex = '9999';
        modal.style.display = 'none';

        let modalContent = document.createElement('div');
        modalContent.id = 'modalContent';
        modalContent.style.marginBottom = '20px';
        
        let editableDiv = document.createElement('div');
            editableDiv.id = 'editableDiv';
            editableDiv.contentEditable = 'true';
            editableDiv.textContent = '여기에 붙여넣으세요.';
            editableDiv.style.border = '1px solid #ccc';
            editableDiv.style.padding = '10px';
            editableDiv.style.marginTop = '20px';
            document.body.appendChild(editableDiv);
        
            // 붙여넣기 이벤트 핸들러
            function handlePaste(e) {
                e.stopPropagation();
                e.preventDefault();
        
                let clipboardData = e.clipboardData;
                let pastedData = clipboardData.getData('Text');
                console.log(`[Clipboard Paste Detected]: ${pastedData}`);
        
                let items = e.clipboardData.items;
                for (let item of items) {
                    console.log('item', item);
                    if (item.kind === 'string') {
                        item.getAsString((str) => {
                            console.log('str', str);
                        });
                    }
                }
            }
        
            document.getElementById('editableDiv').addEventListener('paste', handlePaste);
    
        let closeButton = document.createElement('button');
        closeButton.textContent = '닫기';
        closeButton.style.display = 'block';
        closeButton.style.margin = '0 auto';
        closeButton.onclick = function() {
            modal.style.display = 'none';
        };

        modal.appendChild(modalContent);
        modal.appendChild(closeButton);
        document.body.appendChild(modal);
    }

    // 모달에 복사된 텍스트 표시 및 띄우기
    function showModal() {
        let modal = document.getElementById('clipboardModal');
        let modalContent = document.getElementById('modalContent');
        modal.style.display = 'block';
    }

    // 클립보드 복사 이벤트 감지
    document.addEventListener('contextmenu', function(event) {
        if (event.target.tagName === 'IMG') {
            console.log(`[Context Menu] 이미지에서 우클릭 감지됨.`);
            
            // 2초 후 클립보드 확인 (사용자가 복사했을 가능성이 높음)
            setTimeout(() => {
                showModal();
            }, 2000);
        }
    });

    // 모달 초기 생성
    createModal();

})();

// ==UserScript==
// @name         巴哈姆特勇者福利社-跳過廣告&兌換流程自動化
// @namespace    ani20168
// @version      2.3.1
// @description  在勇者福利社參加抽抽樂時，可以直接免費兌換抽獎卷而不用看廣告!
// @author       ani20168
// @homepage     https://home.gamer.com.tw/profile/index.php?&owner=a20280210
// @match        https://fuli.gamer.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        GM_xmlhttpRequest
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/482635/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%87%E8%80%85%E7%A6%8F%E5%88%A9%E7%A4%BE-%E8%B7%B3%E9%81%8E%E5%BB%A3%E5%91%8A%E5%85%8C%E6%8F%9B%E6%B5%81%E7%A8%8B%E8%87%AA%E5%8B%95%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/482635/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8B%87%E8%80%85%E7%A6%8F%E5%88%A9%E7%A4%BE-%E8%B7%B3%E9%81%8E%E5%BB%A3%E5%91%8A%E5%85%8C%E6%8F%9B%E6%B5%81%E7%A8%8B%E8%87%AA%E5%8B%95%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var observer;
    var enableAutoProcessOnBuyDPage = false;
    var enableAutoSkip = false;

    // GM_config選單
    var GM_configStruct = {
        'id': 'UserScriptConfig',
        'title': '抽抽樂腳本設定',
        'fields':
        {
            'enableAutoProcessOnBuyDPage':
            {
                'label': '自動送出收件資料',
                'type': 'checkbox',
                'default': false,
                'title': '啟用後，在填寫收件人頁面會自動送出收件資料，開啟這項功能前請先確保收件人資訊完整，而且頁面上的"請幫我記住收件人資料"的確認框為打勾的狀態。'
            },
            'enableAutoSkip':
            {
                'label': '自動跳過廣告',
                'type': 'checkbox',
                'default': false,
                'title': '啟用後，只要頁面是在抽抽樂的商品頁面，而且此商品目前可以透過看廣告的方式兌換抽獎機會，則會自動執行廣告跳過流程。'
            }
        },
        'css':
        `
        #UserScriptConfig {
            font-family: 'Arial', sans-serif;
            background-color: #fff;
            color: #333;
            width: 300px;
            padding: 15px;
            margin: 0 auto;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        #UserScriptConfig .config_var {
            margin-bottom: 10px;
        }

        #UserScriptConfig .field_label {
            margin-bottom: 5px;
            display: block;
            font-weight: bold;
        }

        #UserScriptConfig input[type='checkbox'] {
            margin-right: 10px;
            transform: scale(1.2);
        }

        #UserScriptConfig .section_header_holder {
            margin-bottom: 15px;
        }

        #UserScriptConfig .config_header {
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }

        #UserScriptConfig .saveclose_buttons {
            text-align: center;
            padding: 8px 16px;
            margin:20px 40px 5px;
            border: 2px solid transparent;
            border-radius: 10px;
            transition: border-color 0.15s ease-in-out;
        }



        #UserScriptConfig .saveclose_buttons:hover {
            border-color: #90ee90;
        }

        #UserScriptConfig .reset, #UserScriptConfig .reset a {
            color: #999;
            text-decoration: none;
            padding: 8px 16px;
            display: block;
            margin: 10px auto 0;
            font-size: 12px;
            text-align: center;
        }

        #UserScriptConfig .reset:hover, #UserScriptConfig .reset a:hover {
            color: #666;
        }

        #UserScriptConfig .config_var {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        `,
       'frameStyle':
       `
         bottom: auto; border: 2px solid #6F6F6F; display: none; height: 290px;
         left: 50%; margin: 0; max-height: 100%; max-width: 100%; opacity: 0;
         overflow: auto; padding: 0; position: fixed; right: auto; top: 50%;
         width: 330px; z-index: 9999;
         border-radius: 8px;
         box-shadow: 10px 10px 20px rgba(0,0,0,0.4);
       `
       ,
        'events':
        {
            'open': function() {
                console.log("配置界面已開啟");
            },
            'save': function() {
                console.log("設定已保存");
                enableAutoProcessOnBuyDPage = GM_config.get('enableAutoProcessOnBuyDPage');
                enableAutoSkip = GM_config.get('enableAutoSkip');
                alert("保存完成!");
            },
            'close': function() {
                console.log("配置界面已關閉");
            },
            'init': () => {
                console.log("UI初始化");
                //獲取使用者設定
                enableAutoProcessOnBuyDPage = GM_config.get('enableAutoProcessOnBuyDPage');
                enableAutoSkip = GM_config.get('enableAutoSkip');
            }
        }
    };

    // 初始化GM_config
    GM_config.init(GM_configStruct);

    //處理驗證流程
    function handleCaptchaVerification() {
        var captchaFound = false; // 用於標記是否找到驗證器

        // 嘗試執行Google reCAPTCHA
        var googleRecaptcha = document.getElementById('recaptcha');
        if (googleRecaptcha && typeof grecaptcha !== 'undefined' && grecaptcha.execute) {
            grecaptcha.execute();
            captchaFound = true; // 標記找到Google reCAPTCHA
        }

        // 嘗試執行Cloudflare Turnstile
        if (typeof turnstile !== 'undefined' && document.querySelector('.cf-turnstile')) {
            turnstile.render('.cf-turnstile');
            captchaFound = true; // 標記找到Cloudflare Turnstile
        }

        // 如果沒有找到任何驗證器，則提交表單
        if (!captchaFound) {
            jQuery('#buyD').submit();
        }
    }

    // 檢查目前頁面是否為 message_done 頁面
    if (window.location.href.includes('https://fuli.gamer.com.tw/message_done.php')) {
        // 在 message_done 頁面上執行的操作
        var button = document.querySelector('button');
        if (button) {
            button.click();
        }
    }

    // 等待頁面加載完畢
    window.addEventListener('load', function() {
        // 找到TOP-my元素
        var guiTopMyElement = document.querySelector('.TOP-my ul');

        // 創建GUI按鈕的列表項
        var guiButtonLi = document.createElement('li');
        guiButtonLi.className = 'mobilehide';

        // 創建GUI按鈕的連結元素
        var guiButtonLink = document.createElement('a');
        guiButtonLink.href = 'javascript:void(0)';
        guiButtonLink.onclick = function() {
            GM_config.open();
        };

        // 為GUI按鈕添加圖標
        var guiButtonIcon = document.createElement('img');
        guiButtonIcon.src = 'https://i.imgur.com/uj2yF4e.png';
        guiButtonLink.appendChild(guiButtonIcon);

        // 將連結元素加入到列表項中，然後將列表項加入到TOP-my區塊
        guiButtonLi.appendChild(guiButtonLink);
        guiTopMyElement.insertBefore(guiButtonLi, guiTopMyElement.firstChild); // 將GUI按鈕添加到最左側

        // 檢查目前頁面是否為 buyD 頁面
        if (enableAutoProcessOnBuyDPage && window.location.href.includes('https://fuli.gamer.com.tw/buyD.php')) {
            document.getElementById('agree-confirm').checked = true;
            handleCaptchaVerification();
            return;
        }

        //如果沒有兌換欄位
        var btnList = document.getElementById('buyBtnContent');
        if (!btnList) return;
        //看一下需不需要先回答問題，如果需要，回答問題並重整
        var questionButton = btnList.querySelector('a[onclick^="showQuestion(1);"]');
        if (questionButton) {
            getCsrfToken().then(token => {
                sendAnswerQuestionRequest(token);
                setTimeout(function() {
                    location.reload();
                }, 2000);
            }).catch(error => {
                console.error('獲取 CSRF token 時發生錯誤:', error);
            });
            return;
        }
        //如果沒有看廣告兌換按鈕就return
        var adButton = btnList.querySelector('a[onclick^="window.FuliAd.checkAd"]');
        if (!adButton) return;

        var newButton = document.createElement('a');
        newButton.className = 'btn-base c-accent-o';
        newButton.textContent = '跳過廣告';
        newButton.href = '#';
        newButton.style.marginLeft = '10px';

        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            executeAdSkippingProcess();
        });

        btnList.appendChild(newButton);

        // 如果啟用自動跳過廣告，則自動點擊新按鈕
        if (enableAutoSkip) {
            newButton.click();
        }
    });



    function executeAdSkippingProcess() {
        watchAdCheck();
        getCsrfToken().then(token => {
            setTimeout(function() {
                sendPostRequest(token);
            }, 2000);
        }).catch(error => {
            console.error('獲取 CSRF token 時發生錯誤:', error);
        });
    }

    // 獲取CSRF token
    function getCsrfToken() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://fuli.gamer.com.tw/ajax/getCSRFToken.php?_=1702883537159",
                onload: function(response) {
                    var token = response.responseText.trim();
                    if (token) {
                        resolve(token);
                    } else {
                        reject('Token not found in response');
                    }
                },
                onerror: function(error) {
                    reject('Error during request: ' + error.message);
                }
            });
        });
    }

    function sendAnswerQuestionRequest(csrfToken) {
        // 獲取網頁中的問題和答案
        let templateContent = document.getElementById('question-popup').innerHTML;
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = templateContent;

        let questions = tempDiv.querySelectorAll('.fuli-option[data-question]');
        let questionNumbers = new Set();
        questions.forEach(question => {
            questionNumbers.add(question.getAttribute('data-question'));
        });

        let answers = [];
        questionNumbers.forEach(questionNumber => {
            let firstOption = tempDiv.querySelector(`.fuli-option[data-question="${questionNumber}"]`);
            answers.push(firstOption.getAttribute('data-answer'));
        });


        // 獲取sn
        var urlParams = new URLSearchParams(window.location.search);
        var snValue = urlParams.get('sn');

        // 準備payload
        var formData = new FormData();
        formData.append('sn', snValue);
        formData.append('token', csrfToken);
        answers.forEach(answer => formData.append('answer[]', answer));

        // 這一段只是在看payload而已...
        var object = {};
        formData.forEach((value, key) => {
            if(!Reflect.has(object, key)){
                object[key] = value;
                return;
            }
            if(!Array.isArray(object[key])){
                object[key] = [object[key]];
            }
            object[key].push(value);
        });
        var payloadData = JSON.stringify(object);

        // 發送post
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://fuli.gamer.com.tw/ajax/answer_question.php",
            data: formData,
            onload: function(response) {
                console.log('Payload sent:', payloadData);
                console.log('回答問題post的回應:', response.responseText);
            }
        });
    }




    // 發送已看完廣告的post請求
    function sendPostRequest(csrfToken) {
        var urlParams = new URLSearchParams(window.location.search);
        var snValue = urlParams.get('sn');
        var adButton = document.querySelector('a[onclick^="window.FuliAd.checkAd"]');
        console.log('sn:',encodeURIComponent(snValue))

        if (!snValue) {
            console.log('無法獲取sn參數');
            return;
        }

        GM_xmlhttpRequest({
            method: "POST",
            url: "https://fuli.gamer.com.tw/ajax/finish_ad.php",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: "token=" + encodeURIComponent(csrfToken) + "&area=item&sn=" + encodeURIComponent(snValue),
            onload: function(response) {
                console.log('post回應:', response.responseText);
                adButton.click();
            }
        });
    }

    // 發送get檢查是否已經看過廣告
    function watchAdCheck() {
        var urlParams = new URLSearchParams(window.location.search);
        var snValue = urlParams.get('sn');
        var adButton = document.querySelector('a[onclick^="window.FuliAd.checkAd"]');

        if (!snValue) {
            console.log('無法獲取sn參數');
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: "https://fuli.gamer.com.tw/ajax/check_ad.php?area=item&sn=" + encodeURIComponent(snValue),
            onload: function(response) {
                try {
                    var responseData = JSON.parse(response.responseText);
                    if (responseData.data && responseData.data.finished === 1) {
                        alert('你已經看過/跳過廣告了!');
                        adButton.click();
                        return;
                    }else{
                        clickAdButton();
                    }
                } catch (e) {
                    console.error('解析回應時發生錯誤:', e);
                }
            }
        });
    }

    // 自動點擊"看廣告免費兌換"按鈕
    function clickAdButton() {
        var adButton = document.querySelector('a[onclick^="window.FuliAd.checkAd"]');
        if (adButton) {
            adButton.click();
            startObservingDialog();
        }
    }

    // 監視對話框
    function startObservingDialog() {
        var observerOptions = {
            childList: true,
            subtree: true
        };

        observer = new MutationObserver(function(mutations, obs) {
            var dialog = document.querySelector('.dialogify__content');
            if (dialog) {
                var confirmButton = dialog.querySelector('.btn-box .btn-insert.btn-primary');
                if (confirmButton) {
                    confirmButton.disabled = true;
                    confirmButton.style.backgroundColor = '#e5e5e5';
                }

                setTimeout(function() {
                    handleDialogButtons(dialog);
                    obs.disconnect();
                }, 500);
            }
        });

        observer.observe(document.body, observerOptions);
    }

    // 處理確認窗口的按鈕
    function handleDialogButtons(dialog) {
        var cancelButton = dialog.querySelector('.btn-box .btn-insert:not(.btn-primary)');
        var confirmButton = dialog.querySelector('.btn-box .btn-insert.btn-primary');

        if (cancelButton) {
            setTimeout(function() {
                cancelButton.click();
                if (confirmButton) {
                    confirmButton.disabled = false;
                    confirmButton.style.backgroundColor = '';
                }
            }, 1000);
        }
    }
})();
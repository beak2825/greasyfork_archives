// ==UserScript==
// @name         Tiny Web Assistant
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Extract Page content and send to ChatGPT for decomposition
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/464637/Tiny%20Web%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/464637/Tiny%20Web%20Assistant.meta.js
// ==/UserScript==

GM_addStyle(`
.twa-panel-container {
  position: fixed;
  top: 15px;
  left: 61.8%;
  z-index: 9999;
  background-color: #222;
  border: 1px solid #555;
  border-radius: 5px;
  padding: 10px;
  min-width: 120px;
  width: 250px;
  max-width: 1000px;
  font-family: sans-serif;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.5);
  user-select: none;
  cursor: move;
}

.twa-panel-title {
  font-weight: bold;
  margin-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #eee;
}

.twa-panel-content {
  white-space: pre-wrap;
  color: #ccc;
  display: none;
}

  .twa-suggestion {
    cursor: pointer;
    background-color: #555;
    padding: 2px 5px;
    margin-right: 5px;
    border-radius: 3px;
    color: #eee;
    font-size: 0.9em;
  }

  .twa-suggestion:hover {
    background-color: #888;
  }

  .twa-input-wrapper {
    display: flex;
    justify-content: space-between;
    margin: 10px 0 10px 0;
  }

  .twa-panel-container input[type="text"] {
    background-color: #555;
    color: #eee;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 0.9em;
    flex-grow: 1;
    box-sizing: border-box;
    margin-right: 5px;
  }

  .twa-panel-container input[type="text"]:focus {
    outline: none;
    box-shadow: 0 0 3px #888;
  }

  .twa-panel-container button.twa-submit-btn {
    cursor: pointer;
    background-color: #555;
    color: #eee;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 0.9em;
  }

  .twa-panel-container button.twa-submit-btn:hover {
    background-color: #888;
  }

    .twa-display-board {
    background-color: #333;
    border-radius: 3px;
    padding: 10px;
    color: #eee;
    font-size: 0.9em;
    white-space: pre-wrap;
    margin-bottom: 5px;
    min-height: 100px;
  }

  .twa-log-board {
    background-color: #444;
    border-radius: 3px;
    padding: 10px;
    color: #eee;
    font-size: 0.9em;
    white-space: pre-wrap;
    margin-bottom: 5px;
    min-height: 50px;
    display: None;
  }
  
  .twa-response-display {
    background-color: #333;
    border-radius: 3px;
    padding: 10px;
    color: #eee;
    font-size: 0.9em;
    white-space: pre-wrap;
    margin-bottom: 5px;
    min-height: 50px;
  }
  
  .twa-copy-btn {
    cursor: pointer;
    background-color: #555;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 0.9em;
    margin-top: 5px;
  }
  
  .twa-copy-btn:hover {
    background-color: #888;
  }
  

  .twa-fold-btn {
    cursor: pointer;
    background-color: #555;
    color: #eee;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 0.9em;
  }

  .twa-fold-btn:hover {
    background-color: #888;
  }

  .twa-settings-btn, .twa-close-btn, .twa-menu-btn {
    cursor: pointer;
    background-color: #555;
    color: #eee;
    border: none;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 0.9em;
    margin-left: 5px;
  }

  .twa-close-btn:hover, .twa-menu-btn:hover {
    background-color: #888;
  }

  .twa-button-container {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
`);



(function () {
  'use strict';

  let isRequestInProgress = false;

  function splitTextIntoChunks(text, maxTokenLength) {
    const tokenPattern = /\p{L}+|\p{N}+|[^\p{L}\p{N}\s]+/gu;
    const tokens = [...text.matchAll(tokenPattern)];

    const chunks = [];
    let currentChunk = '';
    let currentTokenCount = 0;

    for (const tokenMatch of tokens) {
      const token = tokenMatch[0];

      if (currentTokenCount + token.length > maxTokenLength) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
        currentTokenCount = 0;
      }

      currentChunk += token;
      currentTokenCount += token.length;
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }



  // Get Page content from the webpage.
  function getPageContent() {
    // Customize this function to find the actual Page content on your target website.
    let tmpSelector = localStorage.getItem('pageSelector') || 'body';
    var targets = document.querySelectorAll(tmpSelector);
    let combinedText = "";

    targets.forEach((displayBoard) => {
      combinedText += displayBoard.innerText;
    });
    console.log(`combined text: ${combinedText}`);
    return combinedText;
  }

  //by user
  function urlSetting() {
    const apiURL = prompt('Please Input The URL of openai API：', GM_getValue('apiURL') || 'https://api.openai.com');
    if (apiURL !== null) {
      GM_setValue('apiURL', apiURL);
      alert('Settings saved');
    }
  }

  //by user
  function keySettingCheck(always=true) {
    let tmpValue = GM_getValue('openaiKey');
    if (!always && typeof(tmpValue) !== "undefined" && tmpValue !== null && tmpValue.startsWith('sk-')) {
      console.log(tmpValue);
      console.log("you have the key!!!");
      return 0;
    }
    const openaiKey = prompt('Please Input The Key of openai API：', tmpValue || '');
    if (openaiKey !== null) {
      GM_setValue('openaiKey', openaiKey);
      alert('Settings saved');
    }
  }

  //by domain
  function selectorSetting() {
    const pageSelector = prompt('Please Input The Selector of Target Part On The Page', localStorage.getItem('pageSelector') || '');
  if (pageSelector !== null) {
    localStorage.setItem('pageSelector', pageSelector);
    alert('Settings saved');
  }
  }



  function createPanel(title, content) {
    const panelContainer = document.createElement('div');
    panelContainer.className = 'twa-panel-container';

    const panelTitle = document.createElement('div');
    panelTitle.className = 'twa-panel-title';
    panelTitle.innerText = title;

    const panelContent = document.createElement('div');
    panelContent.className = 'twa-panel-content';
    panelContent.innerText = content;

    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'twa-input-wrapper';

    const foldBtn = document.createElement('button');
    foldBtn.className = 'twa-fold-btn twa-settings-btn';
    foldBtn.innerText = '+';
    foldBtn.addEventListener('click', function () {
      if (panelContent.style.display === 'block') {
        
        panelContent.style.display = 'none';
        panelContainer.style.width = "250px";
        foldBtn.innerText = '+';
      } else {
        panelContent.style.display = 'block';
        panelContainer.style.width = "600px";
        foldBtn.innerText = '-';
      }
    });

    const urlBtn = document.createElement('button');
    urlBtn.className = 'twa-settings-btn';
    urlBtn.innerText = '🔗';
    urlBtn.addEventListener('click', urlSetting);    

    const keyBtn = document.createElement('button');
    keyBtn.className = 'twa-settings-btn';
    keyBtn.innerText = '🔑';
    keyBtn.addEventListener('click', keySettingCheck);  

    const selectorBtn = document.createElement('button');
    selectorBtn.className = 'twa-settings-btn';
    selectorBtn.innerText ='🎯';
    selectorBtn.addEventListener('click', selectorSetting);  
        
    const closeBtn = document.createElement('button');
    closeBtn.className = 'twa-close-btn twa-settings-btn';
    closeBtn.innerText = 'x';
    closeBtn.addEventListener('click', function () {
      panelContainer.style.display = 'none';
    });

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'twa-button-container';

    buttonContainer.appendChild(closeBtn);
    buttonContainer.appendChild(foldBtn);
    buttonContainer.appendChild(keyBtn);
    buttonContainer.appendChild(urlBtn);
    buttonContainer.appendChild(selectorBtn);
    panelTitle.appendChild(buttonContainer);
    

    const inputField = document.createElement('input');
    inputField.type = 'text';

    const suggestions = ['简要总结一下重点', '批评一下这个材料', '赞扬一下这个材料'];
    const suggestionContainer = document.createElement('div');
    suggestions.forEach((suggestion) => {
      const suggestionElement = document.createElement('span');
      suggestionElement.className = 'twa-suggestion';
      suggestionElement.innerText = suggestion;
      suggestionElement.addEventListener('click', () => {
        inputField.value = suggestion;
      });
      suggestionContainer.appendChild(suggestionElement);
    });

    const submitBtn = document.createElement('button');
    submitBtn.className = 'twa-submit-btn';
    submitBtn.innerText = '🚀';
    submitBtn.addEventListener('click', async () => {
      if (isRequestInProgress) {
        alert('请等待当前请求完成。');
        return;
      }
      if (keySettingCheck(false) == 0) {
        const inputText = inputField.value;
        await decomposePageToTechModules(inputText);
      }
    });
    inputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        submitBtn.click();
      }
    });
    

    panelContainer.appendChild(panelTitle);
    panelContainer.appendChild(panelContent);
    panelContent.appendChild(suggestionContainer);
    inputWrapper.appendChild(inputField);
    inputWrapper.appendChild(submitBtn);
    panelContent.appendChild(inputWrapper);


    const logBoard = document.createElement('div');
    logBoard.className = 'twa-log-board';
    panelContent.appendChild(logBoard);

    const displayBoard = document.createElement('div');
    displayBoard.className = 'twa-display-board';
    panelContent.appendChild(displayBoard);

    const copyBtn = document.createElement('button');
    copyBtn.className = 'twa-copy-btn';
    copyBtn.innerText = '📋';
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(displayBoard.innerText).then(() => {
        alert('copied');
      }, (err) => {
        alert('failed: ' + err);
      });
    });
    panelContent.appendChild(copyBtn);



    document.body.appendChild(panelContainer);

    let isDragging = false;
    let startX, startY, initialX, initialY;

    panelContainer.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = panelContainer.offsetLeft;
      initialY = panelContainer.offsetTop;
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panelContainer.style.left = initialX + dx + 'px';
        panelContainer.style.top = initialY + dy + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }

  createPanel('Assistant', 'Enjoy!');
  const dpBoard = document.getElementsByClassName("twa-display-board")[0];
  const logBoard = document.getElementsByClassName("twa-log-board")[0];

  async function fetchGPTResponse(PageContent, userPrompt) {
    const apiEndpoint = new URL('/v1/chat/completions', GM_getValue('apiURL') || 'https://api.openai.com').href;
    console.log(`api endpoint: ${apiEndpoint}`);
    const apiKey = GM_getValue('openaiKey');

    return new Promise((resolve, reject) => {
      return GM_xmlhttpRequest({
        method: 'POST',
        url: apiEndpoint,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        data: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: `${PageContent}\n---\n上面是材料内容，现在你是一个非常出色的文档阅读专家，请你：${userPrompt}`
          }],
          max_tokens: 1000,
          n: 1,
          stop: null,
          temperature: 0.5,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true,
        }),
        onloadstart: (stream) => {
          let result = "";
          const reader = stream.response.getReader();
          let charsReceived = 0;
          reader.read().then(function processText({ done, value }) {
            if (done) {
              dpBoard.innerText += "\n---\n";
              isRequestInProgress = false;
              console.log(`done: ${isRequestInProgress}`);
              resolve();
              return;
            }

            charsReceived += value.length;
            const chunk = value;
            result += chunk;
            try {
              let byteArray = new Uint8Array(chunk);
              let decoder = new TextDecoder('utf-8');
              let tmpText = decoder.decode(byteArray);

              //console.log(tmpText);
              tmpText.split("data:").forEach((it, idx) => {
                if (it.length > 0 && it.trim() != '[DONE]') {
                  let parsed = JSON.parse(it);
                  dpBoard.innerText += `${parsed.choices[0].delta?.content || ''}`;
                }

              });


            } catch (e) {
              console.log(e);
            }

            return reader.read().then(processText);
          });
        },
        responseType: "stream",
        onload: function (response) {
          if (response.status === 200) {
            console.log(200);
          } else {
            reject(response);
          }
        },
        onerror: function (error) {
          reject(error);
        },
      });
    });
  }

  async function addTextToDisplayBoard(text, targetDisplay=logBoard, interval = 10) {
    logBoard.style.display = "block";
    return new Promise(async (resolve) => {
      for (const char of text) {
        targetDisplay.innerText += char;
        await new Promise((r) => setTimeout(r, interval));
      }
      resolve();
    });
  }

  async function decomposePageToTechModules(userPrompt) {
    const PageContent = getPageContent();
    const chunks = splitTextIntoChunks(PageContent, 3000);
    isRequestInProgress = true;

    await addTextToDisplayBoard(`prompt: ${userPrompt} || 开始分析网页...\n`);

    if (chunks.length > 1) {
          await addTextToDisplayBoard(`😓材料长度超出gpt承载能力啦...会被切分成${chunks.length}份来分析\n---\n`)
    }

    let idx = 0;

    for (let i=0; i<chunks.length; i++) {
      console.log(i);
      const res = await fetchGPTResponse(chunks[i], userPrompt);
      console.log(res);
    }
  
    isRequestInProgress = false;
  }

})();


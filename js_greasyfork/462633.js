// ==UserScript==
// @namespace         英文翻译
// @version      1.2
// @description  选中英文文字，点击浮标，调用 openAI 的 text-davinci-003 将其翻译为中文，需输入自己的 APIkey
// @match        *://*/*
// @license MIT
// @name 英文翻译 - 调用 openAI 接口
// @downloadURL https://update.greasyfork.org/scripts/462633/%E8%8B%B1%E6%96%87%E7%BF%BB%E8%AF%91%20-%20%E8%B0%83%E7%94%A8%20openAI%20%E6%8E%A5%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/462633/%E8%8B%B1%E6%96%87%E7%BF%BB%E8%AF%91%20-%20%E8%B0%83%E7%94%A8%20openAI%20%E6%8E%A5%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
  // 监听鼠标选中事件
  document.addEventListener("mouseup", function(event) {

    const selectedText = window.getSelection().toString();
const audio = new Audio(`https://tsn.baidu.com/text2audio?tex=${selectedText}&lan=zh&cuid=abcdefg1234567&ctp=1&per=5003&tok=你自己的 tok`);
    if (selectedText && event.target.innerText !== '👻') {
        //生成一个浮标
        const ghost = document.createElement('button');
        ghost.innerText = '👻';
        ghost.style.position = 'absolute';
        ghost.style.top = event.pageY + 'px';
        ghost.style.left = event.pageX + 'px';
        ghost.style.fontSize = '2rem';
        ghost.style.backgroundColor = 'transparent';
        ghost.style.border = 'none';
        //ghost.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.5)';
        document.body.appendChild(ghost);
        setTimeout(() => {
            ghost.remove();
        }, 1500);

      ghost.addEventListener('click', function(){
        // 调用 OpenAI GPT 模型进行翻译
        const apiKey = "你自己的 api";
        const url = "https://api.openai.com/v1/engines/text-davinci-003/completions";

        const headers = {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        };
        const data = {
          "prompt": `Translate the following English text into Chinese:\n\n${selectedText}`,
          "temperature": 0.7,
          "max_tokens": 1000,
          "top_p": 1,
          "frequency_penalty": 0,
          "presence_penalty": 0
        };
        fetch(url, {
          method: "POST",
          headers: headers,
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
      // 创建翻译结果和原文的 DOM 元素
      const translationElement = document.createElement("span");
      translationElement.style.backgroundColor = "#ffff00";
      translationElement.style.color = "#000000";
      translationElement.style.fontWeight = "bold";
      translationElement.style.borderRadius = "3px";
      translationElement.style.padding = "2px";
      translationElement.style.marginLeft = "2px";
      translationElement.appendChild(document.createTextNode(result.choices[0].text));
      const originalElement = document.createElement("span");
      originalElement.style.backgroundColor = "#ffffff";
      originalElement.style.color = "#000000";
      originalElement.style.borderRadius = "3px";
      originalElement.style.padding = "2px";
      originalElement.appendChild(document.createTextNode(selectedText));
      // 替换选中的文字为翻译结果和原文
      const range = window.getSelection().getRangeAt(0);
      range.deleteContents();
      range.insertNode(translationElement);
      range.insertNode(originalElement);
audio.play();
    })
    .catch(error => {
      console.error(error);
    });
      })

}

  });
})();


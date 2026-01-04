// ==UserScript==
// @name        MarkJi批量制卡自动生成语音
// @namespace   Violentmonkey Scripts
// @match       https://www.markji.com/deck/editor/*
// @grant       GM_addStyle
// @version     1.0
// @author      枯木 ku-m.cn
// @description 2024/1/15 12:10:09
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484888/MarkJi%E6%89%B9%E9%87%8F%E5%88%B6%E5%8D%A1%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E8%AF%AD%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/484888/MarkJi%E6%89%B9%E9%87%8F%E5%88%B6%E5%8D%A1%E8%87%AA%E5%8A%A8%E7%94%9F%E6%88%90%E8%AF%AD%E9%9F%B3.meta.js
// ==/UserScript==

const token = localStorage.getItem("token");
const answerLine = '-'

// 创建要添加的元素
var newElement = document.createElement("div");
newElement.style.position = "fixed";
newElement.style.bottom = "0";
newElement.style.right = "0";
newElement.style.width = "200px";
newElement.style.height = "300px";
newElement.style.textAlign = "center";
// newElement.style.background = "black";
newElement.style.color = "white";
newElement.style.margin = "0px 5px";
newElement.style.zIndex = 9999999999;
newElement.className = "toollll icon-help ng-tns-c135-44";
newElement.innerHTML = '<button id ="generateVoice" style="height=20px;wight=100px" class="ng-tns-c135-44 markji-btn markji-btn-button btn-normal">一键生成语音</button>';


// 将新元素添加到body中
document.body.appendChild(newElement);




// 获取 generateVoice 元素
var generateVoiceElement = document.getElementById("generateVoice");

// 添加点击事件处理程序
generateVoiceElement.addEventListener("click", async function () {
  // 执行 doGenerateVoice 方法
  var importMainElement = document.querySelector('.import-main');
  if (importMainElement) {
    await doGenerateVoice();
  } else {
    alert("进入批量制卡页面再使用")
  }

});

// doGenerateVoice 方法
async function doGenerateVoice() {

  const cards = document.getElementsByClassName("ql-editor")[0].innerHTML.split("<br>")
  if (cards.length == 0) {
    return
  }

  let newHtml = ""
  for (let i = 0; i < cards.length; i++) {
    let voiceText = cards[i];
    if (voiceText.indexOf('[') != -1 && voiceText.indexOf(']') != -1) {
      // 根据 "[" 和 "]" 进行框定要朗读的内容
      voiceText = voiceText.substring(voiceText.indexOf('[') + 1, voiceText.indexOf(']'))
    } else {
      // 朗读答案线以下的所有文字
      voiceText = voiceText.substring(voiceText.indexOf(answerLine) + 1)
      voiceText = voiceText.replaceAll("<p>", "").replaceAll("</p>", "")
      voiceText = voiceText.replaceAll("_", ".");
    }
    console.log("voiceText", voiceText);

    // [Audio#ID/wFNC#]
    var voiceId = await getVoiceId(voiceText);
    // console.log(i+1,"voiceId",voiceId);
    let newCard = cards[i] + `[Audio#ID/${voiceId}#]</p>`;

    newHtml += (newCard);


  }

  document.getElementsByClassName("ql-editor")[0].innerHTML = newHtml

  return





}

// getVoiceId 方法
async function getVoiceId(voicetext) {
  try {
    // 向 "https://www.markji.com/api/v1/files/tts" 发送 POST 请求
    const ttsResponse = await fetch("https://www.markji.com/api/v1/files/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token, // 添加 token 到请求头
      },
      body: JSON.stringify({
        content_slices: [{ text: voicetext, locale: "en-US" }],
      }),
    });

    const ttsData = await ttsResponse.json();
    // 提取响应内容中的 URL
    var voiceUrl = ttsData.data.url;

    // 向 "https://www.markji.com/api/v1/files/url" 发送 POST 请求
    const urlResponse = await fetch("https://www.markji.com/api/v1/files/url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": token, // 添加 token 到请求头
      },
      body: JSON.stringify({
        url: voiceUrl,
      }),
    });

    const urlData = await urlResponse.json();
    // 取出 data.file.id
    var fileId = urlData.data.file.id;
    // 打印或使用 fileId，根据需要进行后续处理
    console.log("File ID:", fileId);

    return fileId;
  } catch (error) {
    console.error("Error:", error);
    throw error; // 重新抛出错误以便调用者处理
  }
}

// ==UserScript==
// @name         问小白自动登录
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.0
// @description  wenxiaobai auto Login
// @include      https://*.wenxiaobai.com/*
// @include      https://wenxiaobai.com/*
// @author       wujixian
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527346/%E9%97%AE%E5%B0%8F%E7%99%BD%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/527346/%E9%97%AE%E5%B0%8F%E7%99%BD%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
  //获取当前所有cookie
  window.localStorage.clear();
  var strCookies = document.cookie;
  if (strCookies.indexOf("login")==-1) {
    document.cookie="visitorId=8fb164b6881b959b0f0e925750085657_1739883607313_931546;domain=www.wenxiaobai.com;path=/;";
    document.cookie="login=%7B%22token%22%3A%22eyJ6aXAiOiJHWklQIiwiYWxnIjoiSFM1MTIifQ.H4sIAAAAAAAA_x2MXQ7CIBCE77LPkPDXBTyHF2AtpjWRklKMjfHuLr7NN5NvPvA4VrgAOmvvhCgjEUrnKcmQJitvGGeipAJRBgFrOuCivY0hWFQooHViu53tyM-xt8Z49lTasjKnPjOnWjnndx2u1zaqMNy6bCXzrKPx6Lw2FscFG1oZFaMzkwBKpWSulIDe8n49a_5DLi9W677N8P0BS5zxK8UAAAA.lljt_ansWqaINim1ocrCTEOwYokGKqYOav_evK_M0naFwfN8lAAqM_Eu5P2q4_tu_nQQk3Mv1aJfqaT1-hAotg%22%2C%22user%22%3A%7B%22id%22%3A102099425%2C%22username%22%3A%22192****1236%22%2C%22state%22%3A1%2C%22banned%22%3A0%2C%22nickname%22%3A%22cTLySOUnzHg%22%2C%22avatar%22%3A%22https%3A%2F%2Fplatform-dev-1319140468.cos.ap-nanjing.myqcloud.com%2Fheader%2Fdefault%2FdefaultHeader.jpeg%22%2C%22deviceId%22%3Anull%2C%22sex%22%3A0%2C%22birthDay%22%3Anull%2C%22city%22%3Anull%2C%22dislikedCards%22%3Anull%2C%22preferredTopics%22%3Anull%2C%22wechatName%22%3A%22%22%2C%22bindApple%22%3Afalse%2C%22bindGoogle%22%3Anull%2C%22googleAccount%22%3Anull%2C%22bindUentrance%22%3Anull%2C%22uentrancePid%22%3Anull%2C%22isTourist%22%3Afalse%7D%7D;domain=www.wenxiaobai.com;path=/;";
    location.reload();
  }
}) ();

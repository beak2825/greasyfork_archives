// ==UserScript==
// @name           Trysail Gacha Script
// @name:ja        Trysail Gacha Script
// @description    Fast Gacha process
// @description:ja Fast Gacha process
// @match          http://trysail.jp/*
// @match          https://trysail.jp/*
// @grant        GM_xmlhttpRequest
// @version 0.0.1.20240929050639
// @namespace https://greasyfork.org/users/3920
// @downloadURL https://update.greasyfork.org/scripts/435771/Trysail%20Gacha%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/435771/Trysail%20Gacha%20Script.meta.js
// ==/UserScript==

(function() {

function TrysailGacha() {
  let meta = document.head.getElementsByTagName("meta");
  let token = meta["csrf-token"]["content"];
  let formData = "_method=put&authenticity_token=" + encodeURIComponent(token);
  let url = "";
  let form = document.getElementById('lottery-form');
  if (form !== null) {
    let path = form.getAttribute('action');
    if (path !== null) {
      url = document.location.origin + path;
    }
  }

  if (url === "") {
    url = document.URL;
  }

  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
      if (xmlhttp.status == 200) {
        window.location.href = xmlhttp.responseURL;
      } else if (xmlhttp.status == 400) {
        console.log('There was an error 400');
      } else {
        console.log('something else other than 200 was returned');
      }
    }
  };
 
  xmlhttp.open("POST", url, true);
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send(formData);
}

let Get = function (url, options = {}) {
  return fetch(url, options)
  .then((response) => {
    return response.text();
  });
}

function SaveName(title) {
  return title.replace(/\//g, "／").replace(/!/g, "！").replace(/\?/g, "？").replace(/&/g, "＆").replace(/\^/g, "＾").replace(/:/g, "：").replace(/"/g, "＂").replace(/%/g, "％").replace(/\</g, "〈").replace(/\>/g, "〉");
}

window.copyToClipboard = function(val) {
  let t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = val;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
};

let AddDom = function() {
  let dom = document.getElementById('result');
  if (null === dom) {
    dom = document.createElement('div');
    dom.style.cssText = [
      'background:rgba(0, 0, 0, 0.5);',
      'padding:10px;',
      'position:absolute;',
      'z-index:1001;',
      'width:100%;',
      'height:100%;',
      'overflow-y:auto;',
      'top:0px;',
      'left:0px;',
    ].join(' ');
    dom.setAttribute('id', 'result')
    document.body.appendChild(dom);
  }
  dom.innerHTML = '';
  return dom;
};

let SetResult = function (dom, lists) {
  for (let item of lists) {
    let title = SaveName(item.name);
    let masterLink = `${item.hls}\n${title}\n`;
    let poster = `${item.poster.replace(/\/\d+x\d+\//, '/9999x9999/')}?title=${title}.jpg`;
    let newitem = `<div style="display: inline-grid; justify-items: center; color: white;">`;
    newitem += `<div onclick="copyToClipboard(this.getAttribute('value'));" value="${masterLink}");">master link</div>`;
    newitem += `<a download="${title}" href="${poster}">poster</a>`;
    newitem += `<img src="${item.poster}" style="height:300px; padding:10px;">`;
    newitem += '</div>';
    dom.innerHTML += newitem;
  }
};

async function Milking() {
  // 플레이어 검색
  let mocho = document.getElementById('ulizaplayer-iframe');
  let mochopai = await Get(mocho.src);
  if (mochopai.match(/params\s*=\s*({.+});/)) {
    let pai = JSON.parse(RegExp.$1);
    return [{name: pai.src.settings.title.textJa, poster: pai.src.poster, hls: pai.src.video},];
  }
  return [];
}

async function Start() {
  if (/lotteries\/\d+\/result/.test(document.location.pathname)) {
    window.location.href = document.location.href.replace(/\/result/, "");
  }
  else if (/(?:lotteries\/\d+|lotteries\/latest\/)/.test(document.location.pathname)) {
    TrysailGacha();
  } else {
    let milk = await Milking();
    if (0 < milk.length) {
      SetResult(AddDom(), milk);
    }
  }
}

Start();
})();
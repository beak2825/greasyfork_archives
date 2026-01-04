// ==UserScript==
// @name           Extract Greeting Video
// @description    Extract Greeting Video by Hinatazaka46
// @match http://*/*
// @match https://*/*
// @namespace https://greasyfork.org/users/3920
// @version 0.0.1.20240228135327
// @downloadURL https://update.greasyfork.org/scripts/488539/Extract%20Greeting%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/488539/Extract%20Greeting%20Video.meta.js
// ==/UserScript==


(() => {
window.copyToClipboard = function(val) {
  let t = document.createElement("textarea");
  document.body.appendChild(t);
  t.value = val;
  t.select();
  document.execCommand('copy');
  document.body.removeChild(t);
};

let GetJson = function (url, options = {}) {
  return fetch(url, options)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    return data;
  });
};

let GetVideoInfo = async function(aid, vid) {
  let headers = {
    "Accept": "application/json;pk=BCpkADawqM0Fs9UkaTmCr7HkZ6ZiBKsiH6o9LumPwPktD1Ek2hX07e4sekrU-cJI1Xit2Iguh0tJhafMgbqQ7gWg4p41zeIJTXqzBrQ6tjd52cxNXbX8Zqo7K3_a8BkSzZTJqf9c44oOj_Bw",
  };
  let api = `https://edge.api.brightcove.com/playback/v1/accounts/${aid}/videos/${vid}`;
  let info = await GetJson(api, {headers:headers});

  let name = info.name;
  let poster = info.poster;
  let hls = '';
  for (let i of info.sources) {
    if (i.type == "application/vnd.apple.mpegurl" || i.type == "application/x-mpegURL") {
      if (/^https/g.test(i.src)) {
        hls = i.src;
      }
    }
  }

  //console.log(`name: ${name}\nposter: ${poster}\nhls: ${hls}`);
  return {name: name, poster: poster, hls: hls};
}

let Extract = async function () {
  let lists = [];
  let api = 'https://www.hinatazaka46.com/s/official/api/list/greeting_fc?ima=0000';
  let info = await GetJson(api);
  for (let i of info.greeting) {
    let video = await GetVideoInfo(4504957038001, i.greetnig_movie_id);
    lists.push(video);
  }

  return (lists);
}

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
  //dom.innerHTML = `<div onclick="this.parentElement.innerHTML='';" width="100%">X</div>`;
  dom.innerHTML = '';
  return dom;
};

let SetResult = function (dom, lists) {
  let today = new Date();
  let mm = today.getMonth()+1; //January is 0!
  let yyyy = today.getFullYear();
  if (mm < 10) mm = '0' + mm;
  today = `${yyyy}${mm}`;

  for (let item of lists) {
    let title = `${today} ${item.name}`;
    let masterLink = `${item.hls}\n${title}\n`;
    let poster = `${item.poster.replace(/\/\d+x\d+\//, '/9999x9999/')}?title=${title}.jpg`;
    let newitem = `<div style="display: inline-grid; justify-items: center; color: white;">`;
    newitem += `<div onclick="copyToClipboard(this.getAttribute('value'));" value="${masterLink}");">master link</div>`;
    newitem += `<a download="${today}${title}" href="${poster}">poster</a>`;
    newitem += `<img src="${item.poster}" style="height:300px; padding:10px;">`;
    newitem += '</div>';
    dom.innerHTML += newitem;
  }
};

let Start = async function () {
  SetResult(AddDom(), await Extract());
}

Start();
})();
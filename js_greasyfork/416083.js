// ==UserScript==
// @name        长毛象抽奖脚本
// @namespace   https://blog.bgme.me
// @match       https://bgme.me/*
// @match       https://bgme.bid/*
// @match       https://c.bgme.bid/*
// @grant       none
// @run-at      document-end
// @version     1.0.0
// @author      bgme
// @description 点击“开始抽奖”后，随机抽出五名中奖候选者。
// @supportURL  https://github.com/yingziwu/Greasemonkey/issues
// @license     AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/416083/%E9%95%BF%E6%AF%9B%E8%B1%A1%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/416083/%E9%95%BF%E6%AF%9B%E8%B1%A1%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
  activateMastodonLottery();
}, false)

function chromeClickChecker(event) {
  return (
    event.target.tagName.toLowerCase() === 'i' &&
    event.target.classList.contains('fa-ellipsis-h') &&
    document.querySelector('div.dropdown-menu') === null
  );
}

function firefoxClickChecker(event) {
  return (
    event.target.tagName.toLowerCase() === 'button' &&
    event.target.classList.contains('icon-button') &&
    document.querySelector('div.dropdown-menu') === null
  );
}

function activateMastodonLottery() {
  document.querySelector('body').addEventListener('click', function (event) {
    if (chromeClickChecker(event) || firefoxClickChecker(event)) {
      // Get the status for this event
      let status = event.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      if (status.className.match('detailed-status__wrapper')) {
        addLotteryLink(status);
      }
    };
  }, false);
}

function addLotteryLink(status) {
  setTimeout(function () {
    const lotteryStatusUrl = status.querySelector('.detailed-status__datetime').getAttribute('href');
    const dropdown = document.querySelector('div.dropdown-menu ul');
    const separator = dropdown.querySelector('li.dropdown-menu__separator');

    const listItem = document.createElement('li');
    listItem.classList.add('dropdown-menu__item');
    listItem.classList.add('mastodon__lottery');

    const link = document.createElement('a');
    link.setAttribute('href', '#');
    link.setAttribute('target', '_blank');
    link.textContent = '开始抽奖';

    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (!window.lotteryRunning) {
        window.lotteryRunning = true;
        link.textContent = '抽奖中，请等待……';
        run(lotteryStatusUrl).then(() => { window.lotteryRunning = false }).catch(() => { window.lotteryRunning = false });
      }
    }, false);

    listItem.appendChild(link);
    dropdown.insertBefore(listItem, separator);
  }, 100);
}

async function run(lotteryStatusUrl, lotteryType = 'reblog', candidateNumber = 5) {
  // lotteryStatusUrl 抽奖嘟文URL
  // lotteryType 抽奖类型：转发（reblog），收藏（favourite）
  // candidateNumber 候选中奖者人数

  const domain = document.location.hostname;
  const token = JSON.parse(document.querySelector('#initial-state').text).meta.access_token;
  const API = {
    'verify': `https://${domain}/api/v1/accounts/verify_credentials`,
    'notifications': `https://${domain}/api/v1/notifications`,
    'status': `https://${domain}/api/v1/statuses/`,
  };
  const searchParamMap = new Map([
    ['reblog', 'exclude_types[]=follow&exclude_types[]=follow_request&exclude_types[]=favourite&exclude_types[]=mention&exclude_types[]=poll'],
    ['favourite', 'exclude_types[]=follow&exclude_types[]=follow_request&exclude_types[]=reblog&exclude_types[]=mention&exclude_types[]=poll'],
  ]);
  const searchParam = new URLSearchParams(searchParamMap.get(lotteryType));

  const statusID = lotteryStatusUrl.match(/(\d+)$/)[0];
  let statusTNumber;
  let lotterLog;


  logout(`开始抽奖……\n当前浏览器：${navigator.userAgent}\n开始时间：${(new Date()).toISOString()}`);
  logout(`抽奖嘟文：${lotteryStatusUrl}，抽奖类型：${lotteryType}，候选中奖者人数：${candidateNumber}\n\n`);
  let verify;
  [verify, statusTNumber] = await doVerify(API, lotteryStatusUrl, statusID, lotteryType, statusTNumber);
  if (!verify) {
    throw Error('抽奖嘟文非本人发送');
  }
  const matchAccouts = await getmatchAccouts(API, statusID, statusTNumber, searchParam);
  randomTest(matchAccouts);
  const luckGuys = getLuckGuy(matchAccouts);
  const cadidatesText = getCandidate(luckGuys, candidateNumber);
  const notificationText = `嘿！感谢各位参与本次小抽奖活动。\n${cadidatesText}\n\n希望这条艾特您的信息没有造成骚扰，如您对奖品感兴趣请和我私信联系吧？`;
  await postStatus(notificationText, statusID, 'public');
  logout(`抽奖结束！\n结束时间：${(new Date()).toISOString()}`);
  saveFile(lotterLog, `lotterLog-${Date.now()}.log`, 'text/plain; charset=utf-8');


  async function doVerify(API, lotteryStatusUrl, statusID, lotteryType, statusTNumber) {
    const v = await request(API.verify);
    const s = await request(`${API.status}${statusID}`);
    logout(`抽奖嘟文URL：${lotteryStatusUrl}\n回复数：${s.replies_count}，转发数：${s.reblogs_count}，收藏数：${s.favourites_count}`);

    const numbers = new Map([['reblog', s.reblogs_count], ['favourite', s.favourites_count]]);
    if (numbers.has(lotteryType)) {
      statusTNumber = numbers.get(lotteryType);
    } else {
      throw Error('抽奖类型设置不正确');
    }

    if (v.acct === s.account.acct && (new URL(s.account.url)).hostname === (new URL(lotteryStatusUrl)).hostname) {
      return [true, statusTNumber];
    } else {
      return [false, statusTNumber];
    }
  }

  async function getmatchAccouts(API, statusID, statusTNumber, searchParam) {
    const matchAccouts = [];

    while (matchAccouts.length !== statusTNumber) {
      const nlist = await request(`${API.notifications}?${searchParam.toString()}`);
      searchParam.set('max_id', nlist.slice(-1)[0].id);

      nlist.forEach((obj) => {
        if (obj.status.id === statusID) {
          matchAccouts.push(obj.account.acct);
        }
      });
    }

    matchAccouts.sort();
    logout(`共有${matchAccouts.length}名符合条件的抽奖参与者\n她们是：`);
    matchAccouts.forEach(logout);

    return matchAccouts;
  }

  function randomTest(matchAccouts) {
    logout('随机函数测试：');
    const testResults = [];
    const n = 20;
    for (let i = 0; i < (n * 20); i++) {
      testResults.push(getRandomIndex(matchAccouts));
    }
    for (let i = 0; i < n; i++) {
      logout(testResults.slice((i * 20), ((i + 1) * 20)).join(', '));
    }
  }

  function getLuckGuy(matchAccouts) {
    const luckGuys = [];
    const n = matchAccouts.length;
    const luckGuysMap = new Map();
    for (let i = 0; i < (n * 100); i++) {
      const luckGuy = matchAccouts[getRandomIndex(matchAccouts)];
      if (luckGuysMap.get(luckGuy)) {
        luckGuysMap.set(luckGuy, luckGuysMap.get(luckGuy) + 1);
      } else {
        luckGuysMap.set(luckGuy, 1);
      }
    }

    luckGuysMap.forEach((v, k, map) => {
      luckGuys.push([k, v]);
    });
    luckGuys.sort((a, b) => (b[1] - a[1]));
    return luckGuys;
  }

  function getCandidate(luckGuys, candidateNumber) {
    if (candidateNumber > luckGuys.length) {
      throw Error('抽奖参与者太少！')
    }

    let output = '本次抽奖备选中奖者：';
    for (let i = 0; i < candidateNumber; i++) {
      output = `${output}\nNo.${i + 1}：@${luckGuys[i][0]}  （幸运指数：${luckGuys[i][1]}）`;
    }
    logout(output);
    return output;
  }

  function getRandomIndex(arr) {
    return Math.floor(arr.length * Math.random());
  }

  async function request(url) {
    logout(`正在请求：${url}`);
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });
    const date = new Date(resp.headers.get('date'));
    const request_id = resp.headers.get('x-request-id');
    const runtime = resp.headers.get('x-runtime');
    const ratelimit_remaining = resp.headers.get('x-ratelimit-remaining');
    logout(`请求 ${url} 完成\n请求时间：${date.toISOString()}，API剩余限额：${ratelimit_remaining}，x-runtime：${runtime}，x-request-id：${request_id}`);
    return await resp.json();
  }

  function logout(text) {
    console.log(text);
    if (lotterLog) {
      lotterLog = lotterLog + '\n' + text;
    } else {
      lotterLog = text;
    }
  }

  function saveFile(data, filename, type) {
    const file = new Blob([data], { type: type });
    const a = document.createElement('a');
    const url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  async function postStatus(text, in_reply_to_id, visibility = 'public') {
    const postDate = {
      'in_reply_to_id': in_reply_to_id,
      'media_ids': [],
      'poll': null,
      'sensitive': false,
      'spoiler_text': '',
      'status': text,
      'visibility': visibility,
    };

    logout(`发送嘟文中……\n嘟文内容：\n${text}\n回复嘟文ID：${in_reply_to_id}\n可见范围：${visibility}`);
    const resp = await fetch(API.status, {
      'headers': {
        'Content-Type': 'application/json;charset=utf-8',
        'Authorization': `Bearer ${token}`,
      },
      'body': JSON.stringify(postDate),
      'method': 'POST',
      'mode': 'cors',
    });
    const date = new Date(resp.headers.get('date'));
    const request_id = resp.headers.get('x-request-id');
    const runtime = resp.headers.get('x-runtime');
    const ratelimit_remaining = resp.headers.get('x-ratelimit-remaining');
    logout(`嘟文发送完成，完成请求时间：${date.toISOString()}，API剩余限额：${ratelimit_remaining}，x-runtime：${runtime}，x-request-id：${request_id}`);
    return await resp.json();
  }
}

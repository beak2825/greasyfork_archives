// ==UserScript==
// @name         咪咕奥运小助手——实时比赛数据立刻了解
// @version      0.0.0025_a
// @namespace    https://greasyfork.org/users/58790
// @description  添加实时热门赛事比分等详细信息；切换标签时静音上一个标签，方便多赛事切换观看；屏蔽聊天室默认热词和报比分的弱智。
// @author       mission522
// @license      MIT
// @match        https://www.miguvideo.com/mgs/website/prd/sportLive.html?mgdbId=*
// @icon         https://www.google.com/s2/favicons?domain=miguvideo.com
// @require      https://cdn.bootcss.com/qs/6.7.0/qs.min.js
// @connect      app.sports.qq.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/430046/%E5%92%AA%E5%92%95%E5%A5%A5%E8%BF%90%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E5%AE%9E%E6%97%B6%E6%AF%94%E8%B5%9B%E6%95%B0%E6%8D%AE%E7%AB%8B%E5%88%BB%E4%BA%86%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/430046/%E5%92%AA%E5%92%95%E5%A5%A5%E8%BF%90%E5%B0%8F%E5%8A%A9%E6%89%8B%E2%80%94%E2%80%94%E5%AE%9E%E6%97%B6%E6%AF%94%E8%B5%9B%E6%95%B0%E6%8D%AE%E7%AB%8B%E5%88%BB%E4%BA%86%E8%A7%A3.meta.js
// ==/UserScript==

// 静音
function vedioMute() {
  document.addEventListener('visibilitychange', function () {
    //浏览器切换事件
    const mVedioPlayer = document.querySelector('#m-player');
    if (document.visibilityState == 'hidden') {
      console.log('离开当前tab标签');
      mVedioPlayer.muted = true; // 使音频静音
    } else {
      console.log('回到当前tab标签');
      mVedioPlayer.muted = false; // 取消音频静音
    }
  });
}

//聊天室过滤,去多余信息（vip,app等）
function chatRoomFilter() {
  //去多余
  // console.log('here');
  GM_addStyle('.user-guide-app , .list_box>.name{display:none!important}');

  let filterList = [
    '(\\d){1,2}(-|比|:|：|/|s)(\\d){1,2}',
    'slay东京',
    '这才是真正的高手',
    '奔跑自由是方向',
    '期待破纪录',
    '运动永无止境',
    // 'watch out',
    '见证奥林匹克精神!',
    '这水花绝了',
    '队？这就叫',
    '这就是压水花天',
    '军团，全力',
    '奋力一搏',
    // '不留遗憾',
    '就是要拼',
    '运健儿取得',
    '决战奥运，',
    '马,卫冕东京',
    '战斗从未停止，2020奥运会',
    '预祝举办成功！',
    '携手破浪，冲',
    '憾，年轻就',
  ];
  let filterReg = new RegExp(`(${filterList.join('|')})`);

  document.querySelector('.__view>ul>div.list_item').addEventListener(
    //插入事件。'DOMSubtreeModified',
    'DOMNodeInserted',
    (e) => {
      // console.log('ec:', e.target.textContent, ';;;');
      if (filterReg.test(e.target.textContent)) {
        // e.target.style.display = 'none';
        e.target.remove();
        console.log('ec_block:', e.target.textContent);
      }
    },
    false
  );
}

//获取今天日期
function getNowFormatDate() {
  var date = new Date();
  var seperator1 = '-';
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = '0' + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  return currentdate;
}

// 添加赛程元素
function creatScheduleElement(resultObject) {
  const tabColumn = document.querySelector('.tabColumn');
  const vedioTitle = tabColumn.children[1];
  if (vedioTitle != undefined) {
    vedioTitle.style.display = 'none';
  }

  let chatRoom = document.querySelector('#chat');
  if (chatRoom === null) {
    //chatRoom不在，选live-review
    chatRoom = document.querySelector('.live-review');
  }

  let scheduleTitle = GM_addElement(tabColumn, 'li', { 'data-v-66839cfa': '', title: '点击立即刷新数据' });
  scheduleTitle.innerHTML = '热门赛程';
  scheduleTitle.addEventListener('click', (e) => {
    chatRoom.style.display = 'none';
    scheduleList.style.display = 'block';
    scheduleTitle.style.color = '#007AFF';
    chatTitle.style.color = '#999';
  });

  let chatTitle = tabColumn.children[0];
  if (chatTitle === null || (chatTitle.innerHTML !== '聊天室' && chatTitle.innerHTML !== '精彩回顾')) {
    chatTitle = GM_addElement(tabColumn, 'li', { 'data-v-66839cfa': '' });
    chatTitle.innerHTML = '聊天室';
    GM_addStyle('.vipInfo{  display:none;}');
  }
  chatTitle && chatTitle.addEventListener('click', switchToChatroom);
  function switchToChatroom() {
    chatRoom.style.display = 'block';
    scheduleList.style.display = 'none';
    chatTitle.style.color = '#007AFF';
    scheduleTitle.style.color = '#999';
  }

  let rightBox = document.querySelector('.right-box');
  let scheduleList = GM_addElement(rightBox, 'ul', { class: 'scheduleList', style: 'display: none;' });

  //样式
  GM_addStyle(
    '::-webkit-scrollbar {  width: 6px}::-webkit-scrollbar-thumb {  border-radius: 10px;  background: #555555;}.right-box {  background-color: #333;}.scheduleList {   padding: 0 1rem;  height: 382px;  overflow-y: scroll;  color: white;}.scheduleItem {  min-height: 5rem;  color: #fcf7f7;  font-size: 12px;  padding: .3rem .1rem;  border-bottom: .5px solid #969ba3 ;}.scheduleItemGroup{  display: flex;  flex-direction: row;  align-items: center;  text-align:left;}.scheduleItemMatch {  padding: .5em 0;  color:#969ba3 ; box-sizing:border-box;height:30px;}.scheduleItemTeams {  overflow: hidden;  font-size:1.2em;  flex: 8; cursor: pointer;}.scheduleitemScores {  flex: 1;  font-size:1.2em;  }'
  );
  //去vip条，加回高度
  GM_addStyle(
    '@media screen and (max-width: 1680px) {  .vipInfo {    display: none;  }    .scheduleList,  .live-review .review .review-content {    height: 440px!important;  }  .chat .room-content[data-v-9945c5b2] {    height: 380px!important;  }}'
  );

  function add_schedule(obj) {
    // console.log('add_schedule');
    obj.forEach((element) => {
      let matchInfo = element.matchInfo;

      function add_scheduleItem() {
        let scheduleItem = GM_addElement(scheduleList, 'li', { class: 'scheduleItem' });

        //match
        let scheduleItemMatch = GM_addElement(scheduleItem, 'div', { class: 'scheduleItemMatch' });
        // scheduleItemMatch.innerHTML = matchInfo.cnSportName + matchInfo.cnGenderName + matchInfo.cnEventName + matchInfo.cnPhaseName;
        scheduleItemMatch.innerHTML = matchInfo.matchDesc;

        // 添加图标
        let icon = {
          isChina:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABNVBMVEVHcEzhKBLgKRLeKhLfKBLgJxLgKBLeKBLhJxLhJxHeKRLgJxHdLhPgPBXhLhPdURffRRXeLRHgfR3fKRHcNxbhYh7eQRfeMA7hKxPjdB7bMRHhJxDhKRHgLQ3gRBjZLxLfPBXeMhPbOxbgMRThLBPcVxjfaB3fNBPeKBHdLBLaSBneORTdKRHfKg/dKw3dLhLgKQ3dQxTgKA/cLRLfKgzdKBLcSRffWhbhKQzeLQ/ePxPdLhHbMxPeLRLbRRLbKhLeWRTcMxLdLRLdKhLqnA7cPRDdKxLbNxX0xw372QbeUxbcThXgVBHdXRPsqhP3zgrmfhXfOBLrlxbeSxHnhxPeMxLeKRDytw3wrxHhMRLdMBLnlBfiTRPtog/dKRPdThfcKhLaMxTcKRLdYhvdSBbgbxnaMxPoqwMqAAAAAXRSTlMAQObYZgAAALRJREFUGNNjYEAH7HCQkAQiIQJuzuxcickpcVAB5iivUBautNR4a00WkIBtoE9QTCRzmJONlhITCwO7vXd0uH9EgDsbh7aaqqw0A7upo6+HZ2ywJQeHirqiDCdQi7Gdn0uIlREHh7KcmAQHUEDfzMHV3JCVlU1BUpQPJKCjZ2JhoMvOLi8lLsgIEmDX4AQCJhEhfmE2DrAAOwsHBwcjjwAvNwdUgB3I4GDl5ORAEYACTAF0AACPpxf6y2UvAwAAAABJRU5ErkJggg==',
          isGold:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAACZ1BMVEVHcEzubUjuxojsYUP0b07rYkHrbEfzfFDwcUvzfU/78szPn2Dfr3Dnv3D925nvv4D232fw0HHvzpv135PjuXr15aHvz4/y3qXfr3D33Y/u16Drw4Dty3DpUjzwyZHPl1jspGT14arkvmv65JjPnlvZrmTDi0j44Xb65aDFikrDiUjEi0n5s2X8wW7qWD7x2Jjx1pfpVz3/2p/o0JLixYXmv3Dryof21pvivnjnyobw2n3lym/tZUT04KLdvmbcvGzxdkzva0fwcEn14oLt1nn034H46cHoz4Ls03fyd0314YLt1Xn864rv26Tq0HXs1JLq0nb66Yjo0oTkxnHmynDy3p3rWz/qWj/ywYvmzYbuakb35ITrX0HpVDzz4an76Lbvy4/wjVX35YXy3X7257nmzH3jx23gwm32333iwnjdvHrqXT/tzITtZkXp0IXpy4Tq0pn76r7fwWjs1IT78Lfy3X/44LLp0I7bu2Tjxmz977vTtUf12Kvto2Djwn757bTv2Xvp0HTwcUrev2bz2E3py5Tlyonx2Z3z5KjoyX7647Przn3hv3fs0Ij04JbwqGPqWD7y1Jzev2v347HYunHznmfsYELy3aDoVzzpzI3q0XXr1ZP1453657bp0pzev2f33lru0J/dvXXiyobgv3XpWj7467HoznPu253lyXjtt3rVt0725azkyG7u1pPZt2DtY0Pz1Zns2Zr23pj65n7y4qX44prr0Zfo05Lua0fqWj72ypTt1ZLrXUDo0IPueEzrXkHtbkfrunzsZEPhw2rn0I3q0JPw2pnr04jbwWXixX3nz4XexW22FZx5AAAAOnRSTlMA9NihF3Xaw0SX9xAQgI8Q/dDe4aPxEOBAysZA4CLAIMr0v/CrsEDz/jCAcKuVtv79iWDUulDOqaHfyEwpxgAAAQVJREFUGNNj4PRs2mlzQI+BwXDvhignB3YGFsbcabsO79fRPbh0QoyNIwcDA2tY9tTdh/QNVvUnxoYzMwABW0Th5D371k2PT6idIQsSYHKLzLOd02cbVz1TAcTn5fJ1D01OirYqnr3a2BQoIJUS5O/h6hNYOmvl0ZMWQAHx9tRgPytnr4blR06dMWFgkBbt7Uy3DnDxblxrZ3/akoFBTLg7s6AoLcS6cv76YyfMgFokM/Kz2iY121XYz1tz3BwowCeQ0zpl0ZKeuvKSuYpGQAF+wZaJCxfvWNFRX1UmB3IHg4TMgo3bN21d1lUjxAMWYJBXUt+yeZuGsgg3AwyoaamqaGuCmQAaOFMafK95jQAAAABJRU5ErkJggg==',
        };
        GM_addStyle('.scheduleItemIcon{display: inline; padding-left:3px; width:12px; vertical-align:middle;}');
        if (matchInfo.isChina == 1) {
          // console.log(`${matchInfo.matchDesc}:${matchInfo.isChina}`);
          GM_addElement(scheduleItemMatch, 'img', { class: 'scheduleItemIcon', src: icon.isChina });
        }
        if (matchInfo.isGold == 1) {
          // console.log(`${matchInfo.matchDesc}:${matchInfo.isGold}`);
          GM_addElement(scheduleItemMatch, 'img', { class: 'scheduleItemIcon', src: icon.isGold });
        }

        let scheduleItemGroup = GM_addElement(scheduleItem, 'div', { class: 'scheduleItemGroup', title: '点击立即刷新数据' });

        //time
        let scheduleItemTime = GM_addElement(scheduleItemGroup, 'div', { class: 'scheduleItemTime' });
        // scheduleItemTime.innerHTML = matchInfo.startTime;

        //Teams
        let scheduleItemTeams = GM_addElement(scheduleItemGroup, 'div', { class: 'scheduleItemTeams' });

        let scheduleItemTeam1 = GM_addElement(scheduleItemTeams, 'div', { class: 'scheduleItemTeam' });
        scheduleItemTeam1.innerHTML = matchInfo.leftName;

        let scheduleItemTeam2 = GM_addElement(scheduleItemTeams, 'div', { class: 'scheduleItemTeam' });
        scheduleItemTeam2.innerHTML = matchInfo.rightName;

        //Score
        let scheduleItemScores = GM_addElement(scheduleItemGroup, 'div', { class: 'scheduleitemScores' });

        let scheduleItemScore1 = GM_addElement(scheduleItemScores, 'div', { class: 'scheduleitemScore' });
        scheduleItemScore1.innerHTML = matchInfo.leftGoal;

        let scheduleItemScore2 = GM_addElement(scheduleItemScores, 'div', { class: 'scheduleitemScore' });
        scheduleItemScore2.innerHTML = matchInfo.rightGoal;

        //详细数据获取按钮
        // console.dir(scheduleItemTeams);
        scheduleItemTeams.addEventListener('click', () => {
          detailUrl = `https://app.sports.qq.com/TokyoOly/statDetail?mid=${matchInfo.mid}`;
          getStatsDetail(detailUrl, scheduleItem);
        });
      }

      if (element.liveId === '' && element.matchInfo.quarter !== '') {
        // if (element.liveId === '') {
        add_scheduleItem();
      }
    });
  }

  function update_schedule() {
    let newResultObject = {};

    scheduleList.innerHTML = null;

    getSchedule(getXhrUrl(), (responseText) => {
      let today = getNowFormatDate();
      newResultObject = JSON.parse(responseText).data.matches[`${today}`].list;
      add_schedule(newResultObject);
    });
  }

  //第一次获取数据
  add_schedule(resultObject);

  // 每3分钟更新数据
  setInterval(() => {
    update_schedule();
  }, 1000 * 60 * 3);

  scheduleTitle.addEventListener('click', update_schedule);
}

function getXhrUrl() {
  let urlData = {
    // 130003热门
    columnId: 130003,
    dateNum: 1,
    flag: 2,
    // sportID:null,
    // venueID:null,
    // nocID:null,
    // parentChildType:1,
    date: getNowFormatDate(),
  };
  return 'https://app.sports.qq.com/match/list?' + Qs.stringify(urlData);
}

//xhr获取赛程信息
function getSchedule(url, success, fail) {
  // 执行xhr
  GM_xmlhttpRequest({
    method: 'GET',
    url: url,
    onload: (result) => {
      if (result.readyState === 4 && result.status === 200) {
        success && success(result.responseText);
      } else {
        fail && fail(new Error('接口请求失败'));
      }
    },
  });
}

function getStatsDetail(url, parentElement) {
  function addDetailElement(responseText) {
    let response = JSON.parse(responseText);
    let stats = '';

    //删掉原来的
    if (parentElement.lastChild.classList[0] === 'statsTable') {
      parentElement.lastChild.remove();
    }
    let statsTable = GM_addElement(parentElement, 'table', { class: 'statsTable' });

    if (response.code === 4) {
      return (statsTable.innerHTML = '暂无数据');
    } else {
      stats = response.data.stats['0'];
      // console.dir(stats);
    }
    // statsTable.innerHTML = stats['0'];

    let statsTbody = GM_addElement(statsTable, 'tbody', { class: 'statsTbody' });

    for (let i = 0; i < stats.rowCount; i++) {
      let statsTr = GM_addElement(statsTable, 'tr', { class: 'statsTr' });

      for (let j = 0; j < stats.rows[i].length; j++) {
        let statsTd = GM_addElement(statsTr, 'td', { class: 'statsTd' });
        // console.log(`i:${i},j:${j}`);
        statsTd.innerHTML = stats.rows[i][j].html;
      }
    }

    GM_addStyle(
      '.statsTable {  text-align: left;  margin: 2px 0;  min-width: 3.75rem;  border-collapse: separate;  font-size: 12px;}.scheduleItemGroup {  padding-bottom: 10px;}.statsTr {  border-bottom: 1px solid #f5f5f5;}.statsTd {  min-width: 5em;  white-space: normal;  text-align: left;  padding-right: .5em;  padding-bottom:.5em;  overflow: hidden;}'
    );
  }
  getSchedule(url, addDetailElement);
}

window.onload = function myPromise() {
  new Promise((resolve, reject) => {
    vedioMute();
    setTimeout(() => {
      chatRoomFilter();
    }, 300);
    resolve();
  })
    .then((res) => {
      getSchedule(getXhrUrl(), (responseText) => {
        let today = getNowFormatDate();
        let responseDataList = JSON.parse(responseText).data.matches[`${today}`].list;
        creatScheduleElement(responseDataList);
      });
      return new Promise((resolve, reject) => {
        resolve('end');
      });
    })
    .then((res) => {
      // console.log(res);
    });
};

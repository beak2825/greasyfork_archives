// ==UserScript==
// @namespace    https://tampermonkey.myso.kr/
// @name         네이버 페이 포인트 짠테크 도우미
// @description  네이버 페이의 포인트 혜택 클릭보상 이벤트를 전부 확인하고, 공유 할 수 있도록 리스트를 복사합니다.
// @copyright    2021, myso (https://tampermonkey.myso.kr)
// @license      Apache-2.0
// @version      1.0.5
// @author       Won Choi
// @connect      naver.com
// @match        *://www.naver.com/
// @match        *://pay.naver.com/*
// @match        *://*.pay.naver.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-app.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-style.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-add-script.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/vendor/gm-xmlhttp-request-async.js
// @require      https://cdn.jsdelivr.net/npm/kr.myso.tampermonkey@1.0.25/assets/donation.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/uuid/8.3.2/uuidv4.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/bluebird/3.7.2/bluebird.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/428683/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8E%98%EC%9D%B4%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EC%A7%A0%ED%85%8C%ED%81%AC%20%EB%8F%84%EC%9A%B0%EB%AF%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/428683/%EB%84%A4%EC%9D%B4%EB%B2%84%20%ED%8E%98%EC%9D%B4%20%ED%8F%AC%EC%9D%B8%ED%8A%B8%20%EC%A7%A0%ED%85%8C%ED%81%AC%20%EB%8F%84%EC%9A%B0%EB%AF%B8.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author myso
// ==/OpenUserJS==
GM_App(async function main() {
  GM_donation('#content', 0);
  GM_addStyle(`
  .event_list_sticky { position: fixed; z-index:1000; margin: auto; left: 0; top: auto; bottom: 0; right: auto; overflow-y: auto; max-width: 480px; max-width: 100%; max-height: 30%; }
  .event_list_sticky .event_area { display: none; vertical-align: top; box-sizing: border-box; margin-top: 10px; padding: 0 5px; width: 100%; height: 110px; }
  .event_list_sticky .item { position: relative; display: block; border-radius: 9px; border: solid 1px #ebebeb; }
  .event_list_sticky .item.type_system { display: table; width: 100%; height: 100%; box-sizing: border-box; padding: 0 19px 0 1px; line-height: 20px; letter-spacing: -0.5px; text-decoration: none; }
  .event_list_sticky .item.type_image { text-align: center; }
  .event_list_sticky .item .cell { display: table-cell; vertical-align: middle; }
  .event_list_sticky .item .cell.banner_icon { width: 76px; text-align: center; }
  .event_list_sticky .item .banner { vertical-align: top; }
  .event_list_sticky .item .area_text { display: table; width: 100%; white-space: nowrap; }
  .event_list_sticky .area_advertise { position: relative; display: table; table-layout: fixed; width: 100%; padding-top: 3px; overflow: hidden; }
  .event_list_sticky .item .title { display: block; margin-bottom: 3px; font-size: 17px; color: #1e1e23; text-overflow: ellipsis; overflow: hidden; }
  .event_list_sticky .item .subtitle { font-size: 13px; color: #424242; line-height: 16px; text-overflow: ellipsis; overflow: hidden; }
  .event_list_sticky .item .cell.type_reward { vertical-align: middle; padding: 5px 0 5px 19px; font-size: 14px; color: #fff; text-align: center; }
  .event_list_sticky .item .reward { position: relative; display: block; width: 76px; border-radius: 16px; background-color: #09b65a; line-height: 32px; }
  .event_list_sticky .item .notice { display: -webkit-box; max-height: 26px; margin-top: 7px; font-size: 10px; line-height: 13px; color: #a2a2a2; opacity: 0.7; text-overflow: ellipsis; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .event_list_sticky::after,
  .event_list_sticky .event_head { display: block; padding: 10px 14px; margin: 15px; border: solid 1px #f1f3f7; border-radius: 20px; text-align: center; font-size: 18px; line-height: 24px; color: #fff; font-weight: bold; background-color: #32435e;  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 7%); cursor: pointer; content: '오늘혜택'; cursor: pointer; }
  .event_list_sticky .event_head { display: none; }
  .event_list_sticky:hover { left: 0; top: auto; bottom: 0; right: auto; overflow-y: auto; width: auto; height: auto; background: #fff; }
  .event_list_sticky:hover::after { display: none; }
  .event_list_sticky:hover .event_area { display: block; }
  .event_list_sticky:hover .event_head { display: block; }
  `);
  async function NP_rewards(category = 'all', page = 1, pageSize = 20, result = []) {
      const resp = await GM_xmlhttpRequestAsync(`https://new-m.pay.naver.com/api/adreward/list?pageSize=${pageSize}&page=${page}&category=${category}&deviceType=pc&from=ad_list&collectionId=benefit`);
      const json = await Promise.resolve(resp.response).then(JSON.parse).catch(e=>null);
      if(!json || json.result.pageable.totalPages <= page) return result;
      result.push(...json.result.ads);
      return NP_rewards(category, page + 1, pageSize, result);
  }
  const rewards = await NP_rewards().catch(e=>[]), rewards_click = rewards.filter(o=>o.viewUrl.includes('click-point'));
  const listview = document.querySelector('.event_list_sticky') || document.createElement('ul'); listview.classList.add('event_list_sticky'); document.body.append(listview); listview.innerHTML = '';
  const listhead = document.createElement('li'); listhead.classList.add('event_head'); listview.append(listhead); listhead.innerHTML = '공유하기';
  listhead.dataset.clipboardText = rewards_click.map((o,i)=>`${i+1}. ${o.title}\n${o.viewUrl}`).join('\n');
  const copyhead = new ClipboardJS(listhead);
  copyhead.on('success', (e)=>alert('주소 복사가 완료되었습니다.'));
  copyhead.on('error', (e)=>prmopt('아래 주소를 복사하여 공유합니다', listhead.dataset.clipboardText));
  rewards_click.map((item) => {
      const listitem = document.createElement('li'); listitem.classList.add('event_area'); listview.append(listitem);
      if(item.listItemType == 'basic') {
          listitem.innerHTML = `
          <a href="${encodeURI(item.viewUrl)}" class="item type_system" target="_blank">
            <div class="cell banner_icon"><img src="${item.thumbImage}" alt="" width="54" height="54" class="banner"></div>
            <div class="cell banner_text">
              <div class="area_text">
                <div class="cell"><div class="area_advertise"><strong class="title">${item.title}</strong><div class="subtitle">${item.subtitle}</div></div></div>
                <div class="cell type_reward"><strong class="reward"><span class="blind">보상금액</span>${item.rewardText}</strong></div>
              </div>
              <p class="notice">${item.detailText || ''}</p>
            </div>
          </a>`;
      }
      if(item.listItemType == 'custom') {
          listitem.innerHTML = `
          <li class="event_area">
            <a href="${encodeURI(item.viewUrl)}" class="item type_image" target="_blank">
              <img src="${item.thumbImage}" alt="" class="banner" width="280" height="108">
            </a>
          </li>`;
      }
  });
});
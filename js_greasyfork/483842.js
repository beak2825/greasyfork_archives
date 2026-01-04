// ==UserScript==
// @name         番组计划月度统计
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  个人主页时光机下面增加一个月度统计的小功能
// @author       You
// @match        https://bangumi.tv/user/*
// @match        https://bgm.tv/user/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bangumi.tv
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483842/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E6%9C%88%E5%BA%A6%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/483842/%E7%95%AA%E7%BB%84%E8%AE%A1%E5%88%92%E6%9C%88%E5%BA%A6%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const COLLECTION_TYPE = {
    1: "想看",
    2: "看过",
    3: "在看",
    4: "搁置",
    5: "抛弃",
  };
  const SUBJECT_TYPE = {
      1: 'N',
      2: 'A',
      3: 'M',
      4: 'G',
      6: '三'
  }

  const reg = /\/user\/[^/]*$/;
  if (!reg.test(location.pathname)) return;

  const sourceElement = document.querySelector("#columnA");
  if (!sourceElement) {
    return;
  }
  const tempDiv = document.createElement("div");
  tempDiv.setAttribute('class', 'my-month-data');
  sourceElement.appendChild(tempDiv);

  const buttonDiv = document.createElement("div");
  sourceElement.appendChild(buttonDiv);
  buttonDiv.innerHTML = `<div class="request-more-data"><div class='need-scroll-to-top'></div><div class='request-more-data-button' id='request-more-data-button'>加载中...</div><div id='need-scroll-to-top'>🔝</div></div>`;
  const requestButton = document.querySelector("#request-more-data-button");
  const toTopButton = document.querySelector("#need-scroll-to-top");

  toTopButton.addEventListener('click', () => {
      window.scrollTo({
          left: 0,
          top: 0,
          behavior: 'smooth'
      })
  })

  let totalDataArray = [];
  const limit = 100;
  let offset = 0;
  const hasAllMap = {};
  let hasFinish = false;
  let hasClick = false;

  const d = location.pathname.split("/");
  const requestUrl = `https://api.bgm.tv/v0/users/${
    d[d.length - 1]
  }/collections`;

  requestButton.addEventListener("click", () => {
    if (hasClick || hasFinish) {
      return;
    }
    requestData();
  });
  tempDiv.addEventListener('click', (e) => {
    const subjectId = e.target.dataset.subjectId
    if (subjectId) {
      window.location.href = `${location.origin}/subject/${subjectId}`
    }
  })

  requestData();

  function requestData() {
    requestButton.innerHTML = "加载中...";
    hasClick = true;
    const oldhasAllMap = JSON.stringify(hasAllMap);
    fetch(`${requestUrl}?limit=${limit}&offset=${offset}`, {
      mode: "cors",
    }).then((res) => {
      res.json().then((jes) => {
        totalDataArray.push(...jes.data);
        hasFinish = totalDataArray.length === jes.total;
        init(totalDataArray);
        if (hasFinish) {
            requestButton.innerHTML = "无更多数据";
        } else {
            requestButton.innerHTML = "加载更多";
        }
        offset = totalDataArray.length;
        hasClick = false;
        if ((oldhasAllMap === JSON.stringify(hasAllMap) || Object.values(hasAllMap).every(k => JSON.stringify(k) === '{}')) && !hasFinish) {
          requestData();
        }
      });
    });
  }

  function getMonthItemRender(monthDataMap, year) {
    let strListRenderStr = "";
    for (let monthKey in monthDataMap) {
      const tempObj = {};
      monthDataMap[monthKey].forEach((dateData) => {
        if (!tempObj[dateData.type]) {
          tempObj[dateData.type] = [];
        }
        tempObj[dateData.type].push(dateData);
      });
      let tempRenderStr = "";
      const customKeySort = [2,5,1,3,4].filter(ct => tempObj.hasOwnProperty(ct))
      for (let tempObjKey of customKeySort) {
        tempRenderStr += `
            <div class='my-total-month-connect my-total-timeline'>${(() => {
              let subjectRenderStr = `<div class='my-total-month-type my-total-month-type${tempObjKey}'>${COLLECTION_TYPE[tempObjKey]} <span class='my-total-month-type-number'>${tempObj[tempObjKey].length}</span></div>`;
              tempObj[tempObjKey].forEach((collection) => {
                collection.subject.name_cn = collection?.subject.name_cn.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                collection.subject.name = collection?.subject.name.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                collection.comment = collection.comment?.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
                subjectRenderStr += `
                    <span class='my-total-month-list-item-span'>
                    <img class='my-total-month-list-item-img' data-subject-id='${collection.subject.id}' title="《${collection.subject.name_cn || collection.subject.name}》${collection.comment ? `\n&quot;${collection.comment}&quot;` : ''}" src=${
                      collection.subject.images.small || '/img/no_img.gif'
                    }></img>
                    <span class='my-total-month-list-item-date'>${`${
                      new Date(collection.updated_at).getMonth() + 1
                    }.${new Date(collection.updated_at).getDate()}`}</span>
                    <span class='my-total-month-list-item-subject-type'>${SUBJECT_TYPE[collection.subject.type]}</span>
                    </span>
                    `;
              });
              return subjectRenderStr;
            })()}</div>
            `;
      }

      const monthRenderStr = `
            <div class='my-total-month'>
              <div class='my-total-month-title my-total-timeline'>${monthKey}月</div>
              ${tempRenderStr}
            </div>`;
      if (hasAllMap[year][monthKey]) {
        strListRenderStr = monthRenderStr + strListRenderStr;
      }
    }
    return strListRenderStr;
  }

  function init(data) {
    const collectionsData = {};
    let lastCollectionsData = {};
    data.forEach((item, index) => {
      const keyYear = new Date(item.updated_at).getFullYear();
      const keyMonth = new Date(item.updated_at).getMonth() + 1;
      if (!collectionsData[keyYear]) {
        collectionsData[keyYear] = {};
        hasAllMap[keyYear] = {};
      }
      if (!collectionsData[keyYear][keyMonth]) {
        collectionsData[keyYear][keyMonth] = [];
      }
      collectionsData[keyYear][keyMonth].push(item);

      if (
        index > 0 &&
        new Date(item.updated_at).getMonth() !== new Date(lastCollectionsData.data.updated_at).getMonth()
      ) {
        hasAllMap[lastCollectionsData.keyYear][lastCollectionsData.keyMonth] = true;
      }
      if (index > 0 && new Date(item.updated_at).getFullYear() !== new Date(lastCollectionsData.data.updated_at).getFullYear()) {
          hasAllMap[lastCollectionsData.keyYear].all = true;
      }
      if (hasFinish) {
        hasAllMap[keyYear][keyMonth] = true;
        hasAllMap[keyYear].all = true;
      }
      lastCollectionsData.data = item;
      lastCollectionsData.keyYear = keyYear;
      lastCollectionsData.keyMonth = keyMonth;
    });

    let connectStr = "";

    for (let yearKey in collectionsData) {
        const tmpObjYear = {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
        }
        for (let monthKey in collectionsData[yearKey]) {
            collectionsData[yearKey][monthKey].forEach(k => {
            tmpObjYear[k.type] = tmpObjYear[k.type] + 1
            })

        }
        const customKeySort = [2,5,1,3,4].filter(ct => tmpObjYear.hasOwnProperty(ct))

      let itemStr = `
            <div class='my-total-item'>
              <div class='my-total-item-year-title my-total-timeline'>
              ${yearKey}
              ${hasAllMap[yearKey].all ? `<div class='my-total-item-year-count'>${customKeySort.map(type => {
              return `<div class='my-total-month-type-yaer-item my-total-month-type${type}'>${COLLECTION_TYPE[type]} <span class='my-total-month-type-number'>${tmpObjYear[type]}</span></div>`
              }).join('')}</div>` : ''}
              </div>
              <div class='my-total-item-year-connect-list'>${getMonthItemRender(
                collectionsData[yearKey],
                yearKey
              )}</div>
              <div></div>
            </div>
            `;
      connectStr = itemStr + connectStr;
    }
    const htmlStr = `
        <div class='my-month-data-title'>月度统计</div>
        ${connectStr}
        `;
    tempDiv.innerHTML = htmlStr;
  }

  const style = `
    .my-month-data {
    margin-top: 40px;
    }
    .my-month-data-title {
    padding-left: 5px;
    margin-bottom: 10px;
    font-size: 14px;
    border-bottom: 1px solid #CCC;
    color: #09C;
    }

    .my-total-item-year-title {
    font-weight: 600;
    position: relative;
    font-size: 24px;
    padding-bottom: 15px;
    display: flex;
    align-items: stretch;
    }
    .my-total-item-year-title::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: -3.4px;
    top: calc(50% - 7.5px);
    transform: translateY(-50%) rotate(45deg);
    width: 6px;
    height: 6px;
    background-color: #000;
    }


    .my-total-month-title {
    font-weight: 500;
    position: relative;
    font-size: 18px;
    padding-bottom: 10px;
    }
    .my-total-month-title::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: -6.5px;
    top: calc(50% - 5px);
    transform: translateY(-50%);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid #ccc;
    background-color: #fff;
    }

    .my-total-month-type {
    position: relative;
    font-size: 14px;
    padding-bottom: 5px;
    color: #888;
    }
    .my-total-month-type::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: -24.5px;
    top: calc(50% - 2.5px);
    transform: translateY(-50%);
    width: 6px;
    height: 6px;
    border-radius: 50%;
    border: 1px solid #F09199;
    background-color: #F09199;
    }
    .my-total-month-type2::before {
    border: 1px solid #91B876;
    background-color: #91B876;
    }
    .my-total-month-type3::before {
    border: 1px solid #6BAAE8;
    background-color: #6BAAE8;
    }
    .my-total-month-type4::before {
    border: 1px solid #E68E46;
    background-color: #E68E46;
    }
    .my-total-month-type5::before {
    border: 1px solid #9065ED;
    background-color: #9065ED;
    }

    .my-total-month-type-number {
    color: #369CF8;
    }


    .my-total-month-list-item-span {
    overflow: hidden;
    display: inline-block;
    margin-right: 4px;
    border-radius: 4px;
    width: 60px;
    height: 85px;
    position: relative;
    transition: all 0.2s ease-out;
    }
    .my-total-month-list-item-span:hover {
    box-shadow:0px 0px 10px #666;
    transform: scale(1.2);
    z-index: 2;
    }

    .my-total-month-list-item-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    }
    .my-total-month-list-item-date {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 10px;
    color: #fff;
    line-height: 10px;
    background-color: #F09199;
    border-radius: 4px;
    padding: 2px;
    }
    .my-total-month-list-item-subject-type {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 10px;
    color: #F09199;
    line-height: 10px;
    background-color: rgb(255,255,255,0.85);
    border-radius: 4px;
    padding: 2px;
    }

    .my-total-month-connect {
    padding-bottom: 25px;
    }

    .request-more-data {
    display: flex;
    align-item: center;
    justify-content: center;
    }
    .request-more-data-button {
    cursor: pointer;
    }

    .my-total-timeline {
    border-left: 1px solid #ccc;
    padding-left: 20px;
    }


    .my-total-item-year-count {
    margin-left: 20px;
    display: flex;
    font-size: 14px;
    align-items: flex-end;
    line-height: 14px;
    font-weight: 400;
    color: #888;
    opacity: 0;
    transition: all 0.2s ease-out;
    cursor: default;
    }
    .my-total-item-year-count:hover {
    opacity: 1;
    }
    .my-total-month-type-yaer-item {
    margin-right: 15px;
    }
    .need-scroll-to-top {
    width: 50px;
    margin: 0 10px;
    opacity: 0;
    }
    #need-scroll-to-top {
    cursor: pointer;
    width: 50px;
    margin: 0 10px;
    opacity: 0;
    }
    #need-scroll-to-top:hover {
    opacity: 1;
    }

    `;

  GM_addStyle(style);
})();
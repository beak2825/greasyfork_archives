// ==UserScript==
// @name         DMHY新番資源索引 自動更新版
// @namespace    https://greasyfork.org/zh-CN/users/1495988-galacticroute
// @version      4.0
// @description  修改[DMHY、動漫花園、动漫花园]新番資源索引，修正為目前播映中新番索引
// @author       GalacticRoute
// @match        https://www.dmhy.org/*
// @match        https://share.dmhy.org/*
// @match        https://dmhy.b168.net/*
// @match        https://dmhy.org/*
// @match        https://dmhy.anoneko.com/*
// @match        https://dmhy.gate.flag.moe/*
// @grant        none
// @run-at       document-idle
// @icon         https://share.dmhy.org/favicon.ico
// @icon64       https://share.dmhy.org/favicon.ico
// @license      No Redistribution
// @downloadURL https://update.greasyfork.org/scripts/542892/DMHY%E6%96%B0%E7%95%AA%E8%B3%87%E6%BA%90%E7%B4%A2%E5%BC%95%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/542892/DMHY%E6%96%B0%E7%95%AA%E8%B3%87%E6%BA%90%E7%B4%A2%E5%BC%95%20%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E7%89%88.meta.js
// ==/UserScript==


(function () {

  'use strict';


  // 找到新番索引的表格
  const table = document.querySelector('table.jmd');
  if (!table) {
    console.error('未找到新番索引表格');
    return;
  }

  // 找到目前日期
  const today = new Date();
  const todayDay = today.getDay();

  // 刪除原本的 <tbody> 標籤
  const tbody = table.querySelector('tbody');
  if (tbody) {
    tbody.remove();
  }

  // 調整 daysOfWeek 陣列順序
  const daysOfWeek = ['週日（日）', '週一（月）', '週二（火）', '週三（水）', '週四（木）', '週五（金）', '週六（土）', '其他'];

  //原網站的ico連結
  const ico_Netflix = 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2023.ico';
  const ico_Disney = 'https://static-assets.bamgrid.com/product/disneyplus/favicons/favicon-aurora.9c40657cf520f9cfcf49dbb4f316aa7c.ico';
  const ico_bilibili = 'https://www.bilibili.com/favicon.ico';
  const ico_ABEMA = 'https://abema.tv/favicon.ico';
  const ico_YouTube = 'https://www.youtube.com/s/desktop/aef0ced3/img/favicon_32x32.png';
  const ico_AnimeFesta = 'https://animefesta-assets.cdnext.stream.ne.jp/assets/favicon.ico';
  const ico_Ultra = '';

  // Base64 圖片數據
  const base64img_Netflix = 'UklGRroBAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSI0AAAABcFtr25p8JV5byQ5uAzgzZAhYwtnAy7QcKh0gE6TC3R3i4T1MEBETQERk7QmCsMsQheaCIPRtpGnrC4LwqRhAAudE3WMooQ27OVBCFjaKTkFTZgy6syvQ9/gCqf/N6/AFrdgbaMxMQNPoEDQP5lAh+w1FbVj8jnJxkEWEDNXvLz2+W8+7iTzVWocfqAAAVlA4IAYBAACQBgCdASoYABgAAMASJbACxHyXiX8VeFiMAupv8B+Ku9i5yBvAH8A6wD9gAZc9AOch1y7B2+cIMhf5+oGAAP7/K3yZHb5g/0+4a0l7r672MXherCcffQWwioJS8hgBOVg71L4s3I+bs6JAbn/nt5crvP8jzceTsDOu67uTnsK8Od0//fT1yrd/4b773j0jBylwhM09e5Ft/oP/BQOm/bhIZRlC+V9/hErD2uNV9fxcDUiEklGgnvuRexhavtlKpG/ftTbZj/tqbUBXESVUHiwL0k3ur5SEv3YdpQ4I9YxpV3DWN7MopyhMc9O3Wt2oLhxavVoUJ+1TzKDikCDIZU2Wq8ytwAAA';
  const base64img_Disney = 'UklGRhgDAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSFQBAAABkCvbtmlb49q2bdu2Ed3ohrZt247syHq2Gdm2vc+85g9ExATg4KtGdR2/cGoizY5/F3Z3njy49/jVp1/0fSZEkWcHKdNm8lJqtiHR7Zd+/7/d7sG9jagSJ7bkkbNufM960y+71U7ZAJ3xt8xrD+5dyLuzA+weo7/epfLvLHJFEgCEq+lb686KX6lvArK+UCzHTnr+6W/Fm/zlpTvbNlwm52mkMS9cEgDvKGtZchOfSfUDhohFRL/GjAG537/MAfDn3r001vyCeioHzr1lPVIGZikfgGKpgZwQ12VyYheQ0e5mLIFWGgYglakC4Ap5AJCdmeUB2wmqAsDuO+zOiYvkB4Bbgx9s4d9+eAEAp9VSi+xZCsGW7AFPmEGhTYBo76uvFK8oI6+s4b/4799ZFWzLH/GMPtw+e/Xe2//M3QoN7HSUpmZOXrx1ocFHmQs7dppVw6EGVlA4IJ4BAADQCQCdASoYABgAAMASJbACdMzRCx9Q7c5IHUl9QG2A/TP1AfqB+pPvwegDeAN5G/ciuAcpP+Ai/fiy/Ef8LqGf6wHaK1pi3KaNfoy+nfMM4SHvqN2sEwAA/v6j9Xlwer97rJ+L4b0+UoyjS37yU2q3iH+I3ZPb8X1X0IxX7Ki8nD5akq+e1FHJnAUzX314bb8MeUqkk9jF50ekawHn+pU+kj9R61cFwHIUJamlWXW+XMMf/u9fqsf9USLRVxMEi0iQrfhHFFyXf/i9HlZbe/6myjrMbb34JTxUEmGUYQJP+T3vjGIx9mqqLRzckmZqo/CXpbrPpQuTt+ugf+X2Dkyu3fMLP3cxUwaxquJokzNyQCI46TfwYo2EvPWuU8XD6biUS7HXIwSWfyCLj9XBnye8fudH6jvOXtXQhb9MRP5hAv+jRl//Chkfd1OtOfTAvBEDjUIluFNIbgGa3RQ/4z1dG4dzvE7Mo7p1zH9asz06h6TprtHz8Ds9Wb2lwReM7fYEkuWeGZp2idIlLvkaIkXbVOx6a9K9/syv9iVwAAA=';
  const base64img_bilibili = 'UklGRjQCAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSM4AAAABgBvZttvmUeYj+0gNKwKakIsJtsSQDZAdvJF3PXA+ZEKv6Mh9h5HyiJgAGefO4mFpw+zycbETsgeoDbEK7IUcAqj1WQU4CjEKoOVvVgHUhIhVAC1/WAXQUrymP34i6dNxb0Rkek3G66mYa7LeFDMyz46BdS1J6zVw/AHUkrgG3gEkOd5xtM61vta5Ns6B8zlwcQA+gPE5GHwOhrhu2HS+bth0cWn/hw+gTlUBT8fAqkozXQHHPZn74ibPbSHT6xw3UxEx8/PnNM/ncyN/IFZQOCBAAQAA0AoAnQEqIAAgAD4tEoZCoaEN/qoADAFiWwAnTKEcDeAfhf+OXQB6fdq8kD5Avp/3Abwp/Vf4BvAP0g/t3t/9IB/lf8z6lf9V9gD0API3/Zb4Ev2X/bD2Wf/oCXVeJQAA/uX6P/oWmlSOGvksoousVEcUdFouLi5hXYsovwfVQpx//vS/SX/Yo2H1WiQEb9vRTyBAr2A/5e+JFtJNcQ6hNSEN87Aji+H8fn1MZg2H45c9bcr54uawhk7WkaBWFzgZyV9nPtP43d4SO2/f6/1DqKFPE2mhNOVEqxpxvbj8ycppu6T//qvvX4qNUNswGQ0ao6Y2Ayz/72I//8vVTU9cx0+6ieVrjor7yqxtvwBeR//MdQD9YyaTBzP2wnLpiqsBVpUslUPQhpb2uqh28jMxLnnNwAbdLbTFsb9O76QYAAA=';
  const base64img_ABEMA = 'UklGRpwBAABXRUJQVlA4IJABAABwCQCdASoYABgAAMASJaQATgD6QOnjPcfsmYrxwH960XL8Tde9/VfSUzbfKv+69wL+Jfy7+3flF+//K1/rcdznIkz7RRUx41gx6nWrL45smCO52AAA/v/+Tl744//DxlxbFwKsC+M2gw+i91P4cmECnH5hd+s/+nP4KqHO/9eo17R1bl/4397RP458opX/iq5BU2GWb1J6VkzcOl2g9pjilMv/v/fo2P4gZ/9DFtsURrLb3f0rN1PLsryND5tqemOHNLs1DX2fgSlI8z3//f/1MOmD2kU/X7Gx/J6cNy8xBXUSv/ZPMJ//WzRtSwLzk9jg8ShLIa3XY1ULH9vJNQLWjzH/94Gu0YiP5C+TVfElI2aqJt0bKbC++0sxCpU6Uimy1kfZ8Sfwcj7xeAf/1qp94H5bRyuVG73HBXh0hfeLbD47Gyj+cFkxIcg9MfdUpTUeFDfuey1MJ5qm+F8P8kwFQZByNoIGpcvI33LIPAXS2Tiy/mBe1RBidFPrVpmD/00+M9EMWqslV8zt08reAgAA';
  const base64img_YouTube = 'UklGRkwCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSKcAAAABgFzb1jHpK9u2XTWzlUaNGwl0Ej21zQTsmW3bto3XCCAiJgD9oySuRKHW6IzvDVqNSi7hkRHC2DIb+6aXN3b23+9trS1O9jVleXCi1odnwMdBdfLxGTY99xm4vAWqZwRqehFqfQlqdxlqbxFqaxxqvgOqtwiqIQUqQ9H3CPE0Y8Z6SwaW904urm8/vLo42VsZrk7gEaJL1QaHyx/+0Od0GNRSJgb9nwBWUDggfgEAANAIAJ0BKhgAGAAAwBIlsAJ0zNDmfjX4c8OEYR1wP6rtjv6zb1Vd0fsefrdXRqyBmGHOIZ48yYzKSOGnLar9CPUMYqkALFCaHHQPkX49ZQAA/u+kNP8o87+pv+W2z1pCzYzXqR3+pO9Zqxpv6N2n8BO+o7/lxv69++/Uf5cnjf/3qcADqofr8dH3St1UJdqov1RZ3yP8q8f7vQnYp+P4K4O0e/DTlimd//kFf6NJUTfN2bQj+6O3X+//ywxI//nML/9N6fdHnmMKnUyHTn1geVD6vGUD+7JGe2H/4Nf8JjnzhT+b3LtJ/sZW9mr5Qt9qu0TxYXs731FgY1ZYKcwjGYU3u60Yel4umPdIVgEXEq6/ZAO/zXjrwT/my/d2idBpQN0vLpST6YyRsT+/QFqRNwIJbTA7yzf6kor+VYDvp1TmF/+lEOJr4w9z+rdulh/lDnFQuueKPhnIYDiGxd/2fJDb9N307IJ7oTsvz5S9+Srj0UhsgOS0L5Mdc/wAAAA=';
  const base64img_BL = 'UklGRkQDAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSAsBAAABkKtt2yFJNbZtO/RERmYrMw6grkmNeDode2adbWQdgm39/1+u//uiqroaRxAREyD4fNHk5ORkZ0WYXeXkRLTdK2olf2/Vhwv+Da8pvZ1gw0zTNA1dk7+LYbHnsmnQZTu0B/Vrc8I9BTl1OUmSrAGCdO0WeXH7g4qofnFvO/lE4qC8d+/xAVEBpCO3ZFnWgCuvG90ADgDIZfIi1w1Ezjkg6vQqzR3GGFMBNTrlDrkxvvpLR05vubUWmPlAQWAP3bq/tPPdQE7PbR6Joij2WQihOqBOFm2I9TNDR1N6mnpPQUfGwMoNlb2sSrijgCMjzEop2S33D5z9zhx/DbmsG6MlgiAIAXMuxw7B5wEAVlA4IBICAABwCwCdASoYABgAAMASJbACdMyXkCmAuwGhAdQB6AHlfexp+2X6Z+0zSgnquO5/e4sA4w/+8akn/Vekp/AeXf5b/z/uD/yL+m/4fgQP2AO6HZJcx3XLyoCFHl8SD3aFZ7NZvNjwAPzCk/+klZX+eM+aDU7DqCOf9JhNNXXklTW2YyTy5x9E+OWlgEw/t6x6SIwYeuH3Rcm4nhgoj+jzmboJ13X5wlNhFxpD9RVGm582Oa12/AHAPbLlr8hxzc6f6VBr9P6WFb5aXRfyx9H5bU3SrcuBd54O2dPxelEh/ofq/FofkapbPoJ7NzvK1Cbh1X/aGKY0GZ5b7P80pTB+7DZZ+Ej/d61zfebV/4pY9x+X8BJfznYnLg3/6gl/aP/OXoR4cp5lvZziQ2z/9xD/h0f3PP9XsYYB0iLz/0TP5udU/ZgcUTfG+f7TYTbC8fmPeoqiGk39gtUZZGpLrIuHLPl5JFCrOctPfMlIOKiL8/t58u1Yc2/40bXmzjyZ0TUcPO61b+/+Ul7I56d9Gkm/JdQQnBFw/vX+8a7fEw2IOuG9tbSktoURG9Rv8JhNIC7yGZ/5+9v+10hznTQWaTnp/J3+jyGJn/apj5vN+TsLy2sBahz1MLwmsn7a3HKtzMqxN0xdKBQQFcyDv7X/wxZ/8HaBA/jN079hgVbggSjbX/OipR41Ut3YaKrXy6u1PN6QEAAAAA==';
  const base64img_AnimeFesta = 'UklGRnQBAABXRUJQVlA4IGgBAABQBwCdASoYABgAAMASJZQAdpf5KtHQxzf6bLM2o06h7/M+hpnreW/YD/i/9E/1P9UMwfpazZZfBJ7UPvSMUBixk9cAAP7//iba+Tv8ED/kaI94YO2iq9cNz9/92e/km/HeeP6dorzXBWuk0fmDWDdh5T//ZCI9uRZMQXCejOxPMxXgsuAfeahYRd/Xv1K/3X+aKbDS6iyT1mjR/8dGsVjQN8gMhT3PllxTf1PppO/n+LG4ofWDECgaHv90FnJbr/G2klWNv3iisPCyRbaiyPBbQWqvpwMhKAXt6uX/RQgUXg/vuCJG7goSJhaf7ADv7//IMQipf/A+phxjO6NMFbm9FIi4nhHzgDHVKQbpBKljf7wfmMaLlRClC7nB+nQN0+WXFM+RIb74MvB165tWLntEL/Ex/iWP1c/nj0L7gezj4157h0QnWC53qIFJ/uogudJ//loo1jYNQx1/jjCy4qMI9E+6k/rAAAA=';
  const base64img_Ultra = 'iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAApklEQVR4AWKw4+VlJAaf0tXlBrRbBxoAg0AAhp9mYHTvGRDA3mUAAiC9RQ/RutyYcdXsRBx+sLlPONVqdM4wGAFsKTGdwZhNDMQTRABXykw+AOwKKvgGj1XB/lL/BsmoIA2zNNAx4TffABP9Y0uOC60bzDN6gknB5cE8G/QDpc5a+F4VxGXEyxMXt9XI4vfmfL/xGVD8xifQKaig6BNDFJRfi4lP/QuedM2wmSzR4QAAAABJRU5ErkJggg==';

  // 用於生成圖片元素的函數
  function generateImageElement(base64img, altText) {
    return `<img src="data:image/webp;base64,${base64img}" alt="[${altText}]" style="width:12px; height:12px;vertical-align: text-top;">`;
  }

  // 用於嘗試從URL加載圖片，如果失敗則使用Base64圖片
  function fetchImage(icoUrl, base64img, altText) {
    const img = new Image();
    img.src = icoUrl;
    img.alt = `[${altText}]`;
    img.style = 'width:12px; height:12px;vertical-align: text-top;';
    img.onerror = function () {
      img.src = `data:image/webp;base64,${base64img}`;
    };
    return img.outerHTML;
  }

  // 用於替換 圖片元素的HTML 字符串
  const imageElement_Netflix = fetchImage(ico_Netflix, base64img_Netflix, "Netflix");
  const imageElement_Disney = fetchImage(ico_Disney, base64img_Disney, "Disney+");
  const imageElement_bilibili = fetchImage(ico_bilibili, base64img_bilibili, "bilibili");
  const imageElement_ABEMA = fetchImage(ico_ABEMA, base64img_ABEMA, "ABEMA");
  const imageElement_YouTube = fetchImage(ico_YouTube, base64img_YouTube, "YouTube");
  const imageElement_AnimeFesta = fetchImage(ico_AnimeFesta, base64img_AnimeFesta, "AnimeFesta");
  const imageElement_BL = generateImageElement(base64img_BL, "BL");
  const imageElement_Ultra = generateImageElement(base64img_Ultra, "+Ultra");

  // 定義替換函數，將文字替換為圖片
  function replaceTextWithImage(text) {
    return text
      .replace(/\[Netflix\]/g, imageElement_Netflix)
      .replace(/\[Disney\+\]/g, imageElement_Disney)
      .replace(/\[bilibili\]/g, imageElement_bilibili)
      .replace(/\[ABEMA\]/g, imageElement_ABEMA)
      .replace(/\[YouTube\]/g, imageElement_YouTube)
      .replace(/\[BL\]/g, imageElement_BL)
      .replace(/\[AnimeFesta\]/g, imageElement_AnimeFesta)
      .replace(/\[\+Ultra\]/g, imageElement_Ultra);
  }

  //適配不同的鏡像站
  const hostname = window.location.hostname;

  // 获取 dmhyEntries
  async function getDmhyEntries() {
    try {
      const response = await fetch('https://api.bgm.tv/calendar');
      const calendarData = await response.json();

      const entries = [];
      calendarData.forEach(dayGroup => {
        const dayId = typeof dayGroup.weekday?.id === 'number' ? dayGroup.weekday.id : 8;

        dayGroup.items.forEach(item => {
          entries.push({
            day: dayId,
            nameJP: item.name,
            nameTW: item.name_cn || item.name,
            nameCN: item.name_cn || item.name,
            keyword: item.name_cn || item.name,
            link: `https://${window.location.hostname}/topics/list?keyword=${encodeURIComponent(item.name_cn || item.name)}`
          });
        });
      });

      localStorage.setItem('dmhyEntries', JSON.stringify(entries));
      localStorage.setItem('LocalKuru', kuru);
      dmhyEntries = entries;

      drawAnimeTable(); // ✅ 渲染页面
    } catch (error) {
      console.error('Error fetching API:', error);

      drawAnimeTable(); // ✅ 即使失败也继续使用本地缓存或 fallback
    }
  }


  getDmhyEntries();



  //クール季度，用於公告欄使用  冬01-03 春04-06 夏7-10 秋10-12 
  function getSeason() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    let seasonLabel = '';
    if (month >= 1 && month <= 3) seasonLabel = '冬季';
    else if (month >= 4 && month <= 6) seasonLabel = '春季';
    else if (month >= 7 && month <= 9) seasonLabel = '夏季';
    else if (month >= 10 && month <= 12) seasonLabel = '秋季';
    else seasonLabel = '未知季度';

    return `${year}年${seasonLabel}动画索引`;
  }

  const kuru = getSeason();

  // 從 localStorage 中讀取已存儲的 dmhyEntries 和 kuru
  let storedKuru = localStorage.getItem('LocalKuru');
  let dmhyEntries = JSON.parse(localStorage.getItem('dmhyEntries'));

  // 如果 storedKuru 和 kuru 不匹配，或沒有存儲的 dmhyEntries，則重新生成
  if (storedKuru !== kuru || !dmhyEntries) {

    // 定義要插入的多個連結的數組
    // dmhyEntries = [
    //   { day: 1, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 2, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 3, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 4, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 5, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 6, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 7, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    //   { day: 8, nameJP: '测试JP', nameTW: '测试TW', nameCN: '测试CN', keyword: '测试关键字' },
    // ];

    // 生成連結
    dmhyEntries.forEach(entry => {
      entry.link = `https://${hostname}/topics/list?keyword=${encodeURIComponent(entry.keyword)}`;
    });

    // 將新的 dmhyEntries 和 kuru 存儲到 localStorage
    localStorage.setItem('dmhyEntries', JSON.stringify(dmhyEntries));
    localStorage.setItem('LocalKuru', kuru);
  }

  // 测试用输出代码
  // console.log(dmhyEntries);
  // console.log(kuru);



  // 绘制表格
  function drawAnimeTable() {
    const newRows = daysOfWeek.map((day, index) => {
      const newRow = document.createElement('tr');
      const newDay = document.createElement('th');
      newDay.innerText = `${day}`;
      const newAnimeList = document.createElement('td');

      if (day === daysOfWeek[todayDay]) {
        newRow.classList.add('today');
      } else if (day === daysOfWeek[(todayDay + 1) % 7] || day === daysOfWeek[(todayDay + 6) % 7]) {
        newRow.classList.add('odd');
      } else {
        newRow.classList.add('even');
      }

      dmhyEntries.forEach(entry => {
        const matchDay = (index === 7 ? 8 : (index === 0 ? 7 : index));

        if (entry.day === matchDay) {
          const newAnimeLink = document.createElement('a');

          newAnimeLink.href = entry.link;
          newAnimeLink.title = entry.nameJP;
          if (navigator.language.toLowerCase() === 'zh-cn') {
            newAnimeLink.innerHTML = replaceTextWithImage(entry.nameCN);
          }
          else {
            newAnimeLink.innerHTML = replaceTextWithImage(entry.nameTW);
          }
          newAnimeList.appendChild(newAnimeLink);
        }
      });

      newRow.appendChild(newDay);
      newRow.appendChild(newAnimeList);

      return newRow;
    });

    newRows.forEach(newRow => table.appendChild(newRow));

    const marquee = document.getElementById('announce_marquee');

    if (marquee) {
      const customText = '▶️常態放送  [Netflix]Netflix  [Disney+]Disney+  [ABEMA]ABEMA  [+Ultra]+Ultra  [bilibili]B8station日配版｜*有索引≠有資源';
      const replacedText = replaceTextWithImage(customText);
      const newDiv = document.createElement('div');
      newDiv.innerHTML = `${kuru} ${replacedText}`;
      marquee.parentNode.replaceChild(newDiv, marquee);
    }
  }


  //-----------------------------------------------------------
  //更改底下的滾動通知
  // 獲取 <marquee> 元素
  const marquee = document.getElementById('announce_marquee');

  // 確認 <marquee> 元素存在
  if (marquee) {
    // 替换 <marquee> 元素的内容
    const customText = '▶️常態放送  [Netflix]Netflix  [Disney+]Disney+  [ABEMA]ABEMA  [+Ultra]+Ultra  [bilibili]B8station日配版｜*有索引≠有資源';
    const replacedText = replaceTextWithImage(customText);

    // 将 <marquee> 元素替换 <div> 元素，同時串接兩個字串
    const newDiv = document.createElement('div');
    newDiv.innerHTML = `${kuru} ${replacedText}`;

    // 将新 <div> 元素替换舊的 <marquee> 元素
    marquee.parentNode.replaceChild(newDiv, marquee);
  } else {
    console.log('未找到 id=announce_marquee 的 <marquee> 元素');
  }
  //-----------------------------------------------------------
})();
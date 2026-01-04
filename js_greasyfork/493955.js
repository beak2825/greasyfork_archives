// ==UserScript==
// @name         DMHY新番資源索引 修正(GreasyFork版)
// @namespace    https://github.com/rinsaika/dmhy-
// @version      3.202410v1.1
// @description  修改[DMHY、動漫花園、动漫花园]新番資源索引，修正為目前播映中新番索引
// @author       Saika
// @match        https://www.dmhy.org/*
// @match        https://share.dmhy.org/*
// @match        https://dmhy.b168.net/*
// @match        https://dmhy.org/*
// @match        https://dmhy.anoneko.com/*
// @match        https://dmhy.gate.flag.moe/*
// @grant        none
// @icon         https://share.dmhy.org/favicon.ico
// @icon64       https://share.dmhy.org/favicon.ico
// @license      No Redistribution
// @downloadURL https://update.greasyfork.org/scripts/493955/DMHY%E6%96%B0%E7%95%AA%E8%B3%87%E6%BA%90%E7%B4%A2%E5%BC%95%20%E4%BF%AE%E6%AD%A3%28GreasyFork%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493955/DMHY%E6%96%B0%E7%95%AA%E8%B3%87%E6%BA%90%E7%B4%A2%E5%BC%95%20%E4%BF%AE%E6%AD%A3%28GreasyFork%E7%89%88%29.meta.js
// ==/UserScript==


(function() {
    
  'use strict';
  
    // @name:zh-CN

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
 const ico_AnimeFesta='https://animefesta-assets.cdnext.stream.ne.jp/assets/favicon.ico';
 const ico_Ultra='';

  // Base64 圖片數據
  const base64img_Netflix = 'UklGRroBAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSI0AAAABcFtr25p8JV5byQ5uAzgzZAhYwtnAy7QcKh0gE6TC3R3i4T1MEBETQERk7QmCsMsQheaCIPRtpGnrC4LwqRhAAudE3WMooQ27OVBCFjaKTkFTZgy6syvQ9/gCqf/N6/AFrdgbaMxMQNPoEDQP5lAh+w1FbVj8jnJxkEWEDNXvLz2+W8+7iTzVWocfqAAAVlA4IAYBAACQBgCdASoYABgAAMASJbACxHyXiX8VeFiMAupv8B+Ku9i5yBvAH8A6wD9gAZc9AOch1y7B2+cIMhf5+oGAAP7/K3yZHb5g/0+4a0l7r672MXherCcffQWwioJS8hgBOVg71L4s3I+bs6JAbn/nt5crvP8jzceTsDOu67uTnsK8Od0//fT1yrd/4b773j0jBylwhM09e5Ft/oP/BQOm/bhIZRlC+V9/hErD2uNV9fxcDUiEklGgnvuRexhavtlKpG/ftTbZj/tqbUBXESVUHiwL0k3ur5SEv3YdpQ4I9YxpV3DWN7MopyhMc9O3Wt2oLhxavVoUJ+1TzKDikCDIZU2Wq8ytwAAA';
  const base64img_Disney = 'UklGRhgDAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSFQBAAABkCvbtmlb49q2bdu2Ed3ohrZt247syHq2Gdm2vc+85g9ExATg4KtGdR2/cGoizY5/F3Z3njy49/jVp1/0fSZEkWcHKdNm8lJqtiHR7Zd+/7/d7sG9jagSJ7bkkbNufM960y+71U7ZAJ3xt8xrD+5dyLuzA+weo7/epfLvLHJFEgCEq+lb686KX6lvArK+UCzHTnr+6W/Fm/zlpTvbNlwm52mkMS9cEgDvKGtZchOfSfUDhohFRL/GjAG537/MAfDn3r001vyCeioHzr1lPVIGZikfgGKpgZwQ12VyYheQ0e5mLIFWGgYglakC4Ap5AJCdmeUB2wmqAsDuO+zOiYvkB4Bbgx9s4d9+eAEAp9VSi+xZCsGW7AFPmEGhTYBo76uvFK8oI6+s4b/4799ZFWzLH/GMPtw+e/Xe2//M3QoN7HSUpmZOXrx1ocFHmQs7dppVw6EGVlA4IJ4BAADQCQCdASoYABgAAMASJbACdMzRCx9Q7c5IHUl9QG2A/TP1AfqB+pPvwegDeAN5G/ciuAcpP+Ai/fiy/Ef8LqGf6wHaK1pi3KaNfoy+nfMM4SHvqN2sEwAA/v6j9Xlwer97rJ+L4b0+UoyjS37yU2q3iH+I3ZPb8X1X0IxX7Ki8nD5akq+e1FHJnAUzX314bb8MeUqkk9jF50ekawHn+pU+kj9R61cFwHIUJamlWXW+XMMf/u9fqsf9USLRVxMEi0iQrfhHFFyXf/i9HlZbe/6myjrMbb34JTxUEmGUYQJP+T3vjGIx9mqqLRzckmZqo/CXpbrPpQuTt+ugf+X2Dkyu3fMLP3cxUwaxquJokzNyQCI46TfwYo2EvPWuU8XD6biUS7HXIwSWfyCLj9XBnye8fudH6jvOXtXQhb9MRP5hAv+jRl//Chkfd1OtOfTAvBEDjUIluFNIbgGa3RQ/4z1dG4dzvE7Mo7p1zH9asz06h6TprtHz8Ds9Wb2lwReM7fYEkuWeGZp2idIlLvkaIkXbVOx6a9K9/syv9iVwAAA=';
  const base64img_bilibili = 'UklGRjQCAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSM4AAAABgBvZttvmUeYj+0gNKwKakIsJtsSQDZAdvJF3PXA+ZEKv6Mh9h5HyiJgAGefO4mFpw+zycbETsgeoDbEK7IUcAqj1WQU4CjEKoOVvVgHUhIhVAC1/WAXQUrymP34i6dNxb0Rkek3G66mYa7LeFDMyz46BdS1J6zVw/AHUkrgG3gEkOd5xtM61vta5Ns6B8zlwcQA+gPE5GHwOhrhu2HS+bth0cWn/hw+gTlUBT8fAqkozXQHHPZn74ibPbSHT6xw3UxEx8/PnNM/ncyN/IFZQOCBAAQAA0AoAnQEqIAAgAD4tEoZCoaEN/qoADAFiWwAnTKEcDeAfhf+OXQB6fdq8kD5Avp/3Abwp/Vf4BvAP0g/t3t/9IB/lf8z6lf9V9gD0API3/Zb4Ev2X/bD2Wf/oCXVeJQAA/uX6P/oWmlSOGvksoousVEcUdFouLi5hXYsovwfVQpx//vS/SX/Yo2H1WiQEb9vRTyBAr2A/5e+JFtJNcQ6hNSEN87Aji+H8fn1MZg2H45c9bcr54uawhk7WkaBWFzgZyV9nPtP43d4SO2/f6/1DqKFPE2mhNOVEqxpxvbj8ycppu6T//qvvX4qNUNswGQ0ao6Y2Ayz/72I//8vVTU9cx0+6ieVrjor7yqxtvwBeR//MdQD9YyaTBzP2wnLpiqsBVpUslUPQhpb2uqh28jMxLnnNwAbdLbTFsb9O76QYAAA=';
  const base64img_ABEMA = 'UklGRpwBAABXRUJQVlA4IJABAABwCQCdASoYABgAAMASJaQATgD6QOnjPcfsmYrxwH960XL8Tde9/VfSUzbfKv+69wL+Jfy7+3flF+//K1/rcdznIkz7RRUx41gx6nWrL45smCO52AAA/v/+Tl744//DxlxbFwKsC+M2gw+i91P4cmECnH5hd+s/+nP4KqHO/9eo17R1bl/4397RP458opX/iq5BU2GWb1J6VkzcOl2g9pjilMv/v/fo2P4gZ/9DFtsURrLb3f0rN1PLsryND5tqemOHNLs1DX2fgSlI8z3//f/1MOmD2kU/X7Gx/J6cNy8xBXUSv/ZPMJ//WzRtSwLzk9jg8ShLIa3XY1ULH9vJNQLWjzH/94Gu0YiP5C+TVfElI2aqJt0bKbC++0sxCpU6Uimy1kfZ8Sfwcj7xeAf/1qp94H5bRyuVG73HBXh0hfeLbD47Gyj+cFkxIcg9MfdUpTUeFDfuey1MJ5qm+F8P8kwFQZByNoIGpcvI33LIPAXS2Tiy/mBe1RBidFPrVpmD/00+M9EMWqslV8zt08reAgAA';
  const base64img_YouTube = 'UklGRkwCAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSKcAAAABgFzb1jHpK9u2XTWzlUaNGwl0Ej21zQTsmW3bto3XCCAiJgD9oySuRKHW6IzvDVqNSi7hkRHC2DIb+6aXN3b23+9trS1O9jVleXCi1odnwMdBdfLxGTY99xm4vAWqZwRqehFqfQlqdxlqbxFqaxxqvgOqtwiqIQUqQ9H3CPE0Y8Z6SwaW904urm8/vLo42VsZrk7gEaJL1QaHyx/+0Od0GNRSJgb9nwBWUDggfgEAANAIAJ0BKhgAGAAAwBIlsAJ0zNDmfjX4c8OEYR1wP6rtjv6zb1Vd0fsefrdXRqyBmGHOIZ48yYzKSOGnLar9CPUMYqkALFCaHHQPkX49ZQAA/u+kNP8o87+pv+W2z1pCzYzXqR3+pO9Zqxpv6N2n8BO+o7/lxv69++/Uf5cnjf/3qcADqofr8dH3St1UJdqov1RZ3yP8q8f7vQnYp+P4K4O0e/DTlimd//kFf6NJUTfN2bQj+6O3X+//ywxI//nML/9N6fdHnmMKnUyHTn1geVD6vGUD+7JGe2H/4Nf8JjnzhT+b3LtJ/sZW9mr5Qt9qu0TxYXs731FgY1ZYKcwjGYU3u60Yel4umPdIVgEXEq6/ZAO/zXjrwT/my/d2idBpQN0vLpST6YyRsT+/QFqRNwIJbTA7yzf6kor+VYDvp1TmF/+lEOJr4w9z+rdulh/lDnFQuueKPhnIYDiGxd/2fJDb9N307IJ7oTsvz5S9+Srj0UhsgOS0L5Mdc/wAAAA=';
  const base64img_BL='UklGRkQDAABXRUJQVlA4WAoAAAAQAAAAFwAAFwAAQUxQSAsBAAABkKtt2yFJNbZtO/RERmYrMw6grkmNeDode2adbWQdgm39/1+u//uiqroaRxAREyD4fNHk5ORkZ0WYXeXkRLTdK2olf2/Vhwv+Da8pvZ1gw0zTNA1dk7+LYbHnsmnQZTu0B/Vrc8I9BTl1OUmSrAGCdO0WeXH7g4qofnFvO/lE4qC8d+/xAVEBpCO3ZFnWgCuvG90ADgDIZfIi1w1Ezjkg6vQqzR3GGFMBNTrlDrkxvvpLR05vubUWmPlAQWAP3bq/tPPdQE7PbR6Joij2WQihOqBOFm2I9TNDR1N6mnpPQUfGwMoNlb2sSrijgCMjzEop2S33D5z9zhx/DbmsG6MlgiAIAXMuxw7B5wEAVlA4IBICAABwCwCdASoYABgAAMASJbACdMyXkCmAuwGhAdQB6AHlfexp+2X6Z+0zSgnquO5/e4sA4w/+8akn/Vekp/AeXf5b/z/uD/yL+m/4fgQP2AO6HZJcx3XLyoCFHl8SD3aFZ7NZvNjwAPzCk/+klZX+eM+aDU7DqCOf9JhNNXXklTW2YyTy5x9E+OWlgEw/t6x6SIwYeuH3Rcm4nhgoj+jzmboJ13X5wlNhFxpD9RVGm582Oa12/AHAPbLlr8hxzc6f6VBr9P6WFb5aXRfyx9H5bU3SrcuBd54O2dPxelEh/ofq/FofkapbPoJ7NzvK1Cbh1X/aGKY0GZ5b7P80pTB+7DZZ+Ej/d61zfebV/4pY9x+X8BJfznYnLg3/6gl/aP/OXoR4cp5lvZziQ2z/9xD/h0f3PP9XsYYB0iLz/0TP5udU/ZgcUTfG+f7TYTbC8fmPeoqiGk39gtUZZGpLrIuHLPl5JFCrOctPfMlIOKiL8/t58u1Yc2/40bXmzjyZ0TUcPO61b+/+Ul7I56d9Gkm/JdQQnBFw/vX+8a7fEw2IOuG9tbSktoURG9Rv8JhNIC7yGZ/5+9v+10hznTQWaTnp/J3+jyGJn/apj5vN+TsLy2sBahz1MLwmsn7a3HKtzMqxN0xdKBQQFcyDv7X/wxZ/8HaBA/jN079hgVbggSjbX/OipR41Ut3YaKrXy6u1PN6QEAAAAA==';
  const base64img_AnimeFesta='UklGRnQBAABXRUJQVlA4IGgBAABQBwCdASoYABgAAMASJZQAdpf5KtHQxzf6bLM2o06h7/M+hpnreW/YD/i/9E/1P9UMwfpazZZfBJ7UPvSMUBixk9cAAP7//iba+Tv8ED/kaI94YO2iq9cNz9/92e/km/HeeP6dorzXBWuk0fmDWDdh5T//ZCI9uRZMQXCejOxPMxXgsuAfeahYRd/Xv1K/3X+aKbDS6iyT1mjR/8dGsVjQN8gMhT3PllxTf1PppO/n+LG4ofWDECgaHv90FnJbr/G2klWNv3iisPCyRbaiyPBbQWqvpwMhKAXt6uX/RQgUXg/vuCJG7goSJhaf7ADv7//IMQipf/A+phxjO6NMFbm9FIi4nhHzgDHVKQbpBKljf7wfmMaLlRClC7nB+nQN0+WXFM+RIb74MvB165tWLntEL/Ex/iWP1c/nj0L7gezj4157h0QnWC53qIFJ/uogudJ//loo1jYNQx1/jjCy4qMI9E+6k/rAAAA=';
  const base64img_Ultra='iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAApklEQVR4AWKw4+VlJAaf0tXlBrRbBxoAg0AAhp9mYHTvGRDA3mUAAiC9RQ/RutyYcdXsRBx+sLlPONVqdM4wGAFsKTGdwZhNDMQTRABXykw+AOwKKvgGj1XB/lL/BsmoIA2zNNAx4TffABP9Y0uOC60bzDN6gknB5cE8G/QDpc5a+F4VxGXEyxMXt9XI4vfmfL/xGVD8xifQKaig6BNDFJRfi4lP/QuedM2wmSzR4QAAAABJRU5ErkJggg==';

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
  return text.replace(/\[Netflix\]/g, imageElement_Netflix)
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

  //クール季度，用於公告欄使用  冬01-03 春04-06 夏7-10 秋10-12 
  const kuru = '目前為2024秋季(10-12月)索引v1.1';

  // 從 localStorage 中讀取已存儲的 dmhyEntries 和 kuru
  let storedKuru = localStorage.getItem('LocalKuru');
  let dmhyEntries = JSON.parse(localStorage.getItem('dmhyEntries'));

  // 如果 storedKuru 和 kuru 不匹配，或沒有存儲的 dmhyEntries，則重新生成
  if (storedKuru !== kuru || !dmhyEntries) {

  // 定義要插入的多個連結的數組
  const dmhyEntries = [
{day:0, nameJP: '転生貴族、鑑定スキルで成り上がる 第2期', nameTW: '轉生貴族憑鑑定技能扭轉人生 第二季', nameCN:'转生贵族凭鑑定技能扭转人生 第二季', keyword: '轉生貴族憑鑑定技能扭轉人生' },
{day:0, nameJP: 'ぷにるんず ぷに２', nameTW: 'Punirunes 第二季', nameCN:'Punirunes 第二季', keyword: 'Punirunes' },
{day:0, nameJP: '七つの大罪 黙示録の四騎士 第2期', nameTW: '七大罪 啟示錄四騎士 第二季', nameCN:'七大罪 默示录的四骑士 第二季', keyword: '七大罪' },
{day:0, nameJP: 'ラブライブ！スーパースター!! 第3期', nameTW: 'LoveLive! SuperStar!! 第三季', nameCN:'LoveLive! SuperStar!! 第三季', keyword: 'LoveLive' },
{day:0, nameJP: '妻、小学生になる。', nameTW: '妻子變成小學生', nameCN:'妻子变成小学生', keyword: '妻子變成小學生' },
{day:0, nameJP: '村井の恋', nameTW: '村井之戀', nameCN:'村井之恋', keyword: '村井之戀' },
{day:0, nameJP: 'ぷにるはかわいいスライム', nameTW: '噗妮露是可愛史萊姆', nameCN:'噗妮露是可爱史莱姆', keyword: '可愛史萊姆' },
{day:0, nameJP: 'MFゴースト 2nd Season', nameTW: '燃油車鬥魂 第二季', nameCN:'极速车魂 第二季', keyword: '燃油車鬥魂|极速车魂|MF Ghost' },
{day:0, nameJP: '大正偽りブラヰダル～身代わり花嫁と軍服の猛愛', nameTW: '[AnimeFesta]大正虛假新娘- 替身新娘與軍人的猛烈熱愛', nameCN:'[AnimeFesta]大正虚假新娘- 替身新娘与军人的猛烈热爱', keyword: '大正 軍' },
{day:0, nameJP: 'サザエさん', nameTW: '▶️海螺小姐', nameCN:'▶️海螺小姐', keyword: '海螺小姐' },
{day:0, nameJP: 'ちびまる子ちゃん', nameTW: '▶️櫻桃小丸子', nameCN:'▶️樱桃小丸子', keyword: '樱桃小丸子' },
{day:0, nameJP: 'ワンピース ONE PIECE', nameTW: '▶️航海王', nameCN:'▶️海贼王', keyword: 'ONE PIECE' },
{day:0, nameJP: 'パズドラ', nameTW: '▶️龍族拼圖', nameCN:'▶️智龙迷城', keyword: '智龙迷城' },
{day:0, nameJP: '遊☆戯☆王ゴーラッシュ!!', nameTW: '▶️遊戲王GO RUSH!!', nameCN:'▶️游戏王GO RUSH!!', keyword: '遊戲王' },
{day:0, nameJP: 'キャプテン翼シーズン２ ジュニアユース編', nameTW: '隊長小翼 Season2 青少年篇', nameCN:'队长小翼 世少篇', keyword: '隊長小翼' },
{day:0, nameJP: 'わんだふるぷりきゅあ！', nameTW: '美妙寵物 光之美少女', nameCN:'美妙宠物 光之美少女', keyword: '美妙寵物 ' },
{day:0, nameJP: 'シンカリオン チェンジ ザ ワールド', nameTW: '新幹線變形機器人 Change the World', nameCN:'新干线变形机器人 改变世界', keyword: '新干线变形机器人' },
{day:0, nameJP: '神之塔 -Tower of God- 工房戦 (第2期)', nameTW: '神之塔 -Tower of God- 第二季(工房戦)', nameCN:'神之塔 第2期', keyword: 'Tower of God' },
{day:0, nameJP: 'シャングリラ・フロンティア 2nd season', nameTW: '香格里拉・開拓異境～糞作獵手挑戰神作～ 第二季', nameCN:'香格里拉・开拓异境～粪作猎手挑战神作～ 第二季', keyword: '香格里拉' },
{day:1, nameJP: 'ねこに転生したおじさん', nameTW: '轉生貓咪的大叔', nameCN:'转生猫咪的大叔', keyword: '轉生貓咪的大叔' },
{day:1, nameJP: 'ハイガクラ', nameTW: '尋神的旅途', nameCN:'寻神的旅途', keyword: '尋神的旅途' },
{day:1, nameJP: '鴨乃橋ロンの禁断推理 2nd Season', nameTW: '鴨乃橋論的禁忌推理 第二季', nameCN:'鸭乃桥论的禁忌推理', keyword: '鴨乃橋論的禁忌推理' },
{day:1, nameJP: '来世は他人がいい', nameTW: '唯願來世不相識', nameCN:'唯愿来世不相识', keyword: '来世' },
{day:1, nameJP: '最凶の支援職【話術士】である俺は世界最強クランを従える', nameTW: '最狂輔助職業【話術士】世界最強戰團聽我號令', nameCN:'最狂辅助职业【话术士】世界最强战团听我号令', keyword: '世界最強戰團聽我號令' },
{day:1, nameJP: '夏目友人帳 漆', nameTW: '夏目友人帳 第七季', nameCN:'夏目友人帐 第七季', keyword: '夏目友人帳' },
{day:1, nameJP: '精霊幻想記2', nameTW: '精靈幻想記 第二季', nameCN:'精灵幻想记 第二季', keyword: '精靈幻想記' },
{day:1, nameJP: '放課後少年花子くん（続編）', nameTW: '放學後少年花子君 續篇', nameCN:'放学后少年花子君 续篇', keyword: '放学后少年花子君' },
{day:1, nameJP: 'ありふれた職業で世界最強 season 3', nameTW: '平凡職業造就世界最強 第三季', nameCN:'平凡职业造就世界最强 第三季', keyword: '平凡職業造就世界最強 ' },
{day:1, nameJP: '忍たま乱太郎(第32期)', nameTW: '▶️忍者亂太郎', nameCN:'▶️忍者乱太郎', keyword: '忍者乱太郎' },
{day:1, nameJP: 'ひみつのアイプリ', nameTW: '秘密的偶像公主', nameCN:'秘密的偶像公主', keyword: '秘密的偶像公主' },
{day:2, nameJP: '嘆きの亡霊は引退したい', nameTW: '嘆氣的亡靈想隱退', nameCN:'叹气的亡灵想隐退', keyword: '嘆氣的亡靈想隱退' },
{day:2, nameJP: '甘神さんちの縁結び', nameTW: '結緣甘神神社', nameCN:'结缘甘神神社', keyword: '结缘甘神神社' },
{day:2, nameJP: '歴史に残る悪女になるぞ', nameTW: '成為名留歷史的壞女人吧 愈是想成為反派千金，王子的溺愛愈是熱烈！', nameCN:'成为名留历史的坏女人吧 愈是想成为反派千金，王子的溺爱愈是热烈！', keyword: '成為名留歷史的壞女人' },
{day:2, nameJP: '多数欠', nameTW: '多數欠', nameCN:'多数欠', keyword: '多数欠' },
{day:2, nameJP: '妖怪学校の先生はじめました！', nameTW: '妖怪學校的菜鳥老師！', nameCN:'妖怪学校的菜鸟老师！', keyword: '妖怪学校' },
{day:3, nameJP: 'アクロトリップ', nameTW: 'Acro Trip', nameCN:'Acro Trip', keyword: 'Acro Trip|アクロトリップ' },
{day:3, nameJP: 'Re:ゼロから始める異世界生活 3rd season 襲撃編(全8話) (反撃編於2025.02.05放送)', nameTW: '[ABEMA]Re：從零開始的異世界生活 第三季 (襲撃編)', nameCN:'[ABEMA]Re：从零开始的异世界生活 第三季 (袭撃编)', keyword: '從零開始的異世界生活' },
{day:3, nameJP: '新テニスの王子様 U-17 WORLD CUP SEMIFINAL', nameTW: '新網球王子 U-17 世界盃 SEMIFINAL', nameCN:'新网球王子 U-17 世界盃 SEMIFINAL', keyword: '网球王子' },
{day:3, nameJP: '[+Ultra]カミエラビ シーズン2完結編', nameTW: '[+Ultra]神選 第二季', nameCN:'[+Ultra]神选 第二季', keyword: '神选' },
{day:3, nameJP: '齢5000年の草食ドラゴン、いわれなき邪竜認定 season2', nameTW: '莫名成為邪龍的五千歲草食龍 第二季', nameCN:'莫名成为邪龙的五千岁草食龙 第二季', keyword: '邪龙' },
{day:3, nameJP: '百妖譜 第2期', nameTW: '[bilibili]百妖譜 第2期', nameCN:'[bilibili]百妖譜 第2期', keyword: '百妖譜' },
{day:3, nameJP: 'やり直し令嬢は竜帝陛下を攻略中', nameTW: '重啟人生的千金小姐正在攻略龍帝陛下', nameCN:'重启人生的千金小姐正在攻略龙帝陛下', keyword: '重启人生' },
{day:3, nameJP: 'Re:ゼロから始める異世界生活 3rd season 反撃編(全8話)', nameTW: '', nameCN:'', keyword: '' },
{day:3, nameJP: '戦国妖狐 千魔混沌編', nameTW: '戰國妖狐 千魔混沌編', nameCN:'战国妖狐 千魔混沌編', keyword: '戰國妖狐' },
{day:4, nameJP: 'ダンダダン', nameTW: '膽大黨', nameCN:'胆大党', keyword: '膽大黨' },
{day:4, nameJP: 'きのこいぬ', nameTW: '菇狗', nameCN:'菇狗', keyword: '菇狗' },
{day:4, nameJP: 'ネガポジアングラー', nameTW: 'Negative Positive Angler', nameCN:'Negative Positive Angler', keyword: 'Negative Positive Angler' },
{day:4, nameJP: '結婚するって、本当ですか', nameTW: '聽說你們要結婚！？', nameCN:'听说你们要结婚！？', keyword: '听说你们要结婚' },
{day:4, nameJP: 'アオのハコ', nameTW: '青春之箱', nameCN:'青春之箱', keyword: '青春之箱' },
{day:4, nameJP: 'ひとりぼっちの異世界攻略', nameTW: '孤單一人的異世界攻略', nameCN:'孤单一人的异世界攻略', keyword: '孤單一人的異世界攻略' },
{day:4, nameJP: 'メカウデ', nameTW: '機械手臂', nameCN:'机械手臂', keyword: '机械手臂' },
{day:4, nameJP: 'ハミダシクリエイティブ', nameTW: '常軌脫離Creative', nameCN:'常轨脱离Creative', keyword: '常轨脱离' },
{day:4, nameJP: 'トリリオンゲーム', nameTW: '一兆＄遊戲', nameCN:'一兆＄游戏', keyword: '一兆 游戏' },
{day:4, nameJP: '殿と犬', nameTW: '殿下與狗', nameCN:'殿下与狗', keyword: '殿下与狗' },
{day:4, nameJP: '星降る王国のニナ', nameTW: '星辰墜落之國的妮娜', nameCN:'星辰坠落之国的妮娜', keyword: '星辰坠落之国的妮娜' },
{day:4, nameJP: 'さようなら竜生、こんにちは人生', nameTW: '再見龍生，你好人生', nameCN:'再见龙生，你好人生', keyword: '再见龙生 你好人生' },
{day:4, nameJP: 'るろうに剣心 －明治剣客浪漫譚－ 京都動乱', nameTW: '神劍闖江湖 ―明治劍客浪漫譚― 京都動亂', nameCN:'神剑闯江湖 ―明治剑客浪漫谭― 京都动乱', keyword: '神剑闯江湖' },
{day:5, nameJP: '監禁区域レベルX', nameTW: '監禁區域 Level X', nameCN:'监禁区域 Level X', keyword: '监禁区域' },
{day:5, nameJP: '魔法使いになれなかった女の子の話', nameTW: '當不成魔法師的女孩', nameCN:'当不成魔法师的女孩', keyword: '当不成魔法师的女孩' },
{day:5, nameJP: 'Duel Masters LOST ～追憶の水晶～', nameTW: '[YouTube]Duel Masters LOST ～追憶的水晶～', nameCN:'[YouTube]Duel Masters LOST ～追忆的水晶～', keyword: 'Duel Masters LOST' },
{day:5, nameJP: '百姓貴族 2nd Season', nameTW: '百姓貴族 第二季', nameCN:'百姓贵族 第二季', keyword: '百姓贵族 ' },
{day:5, nameJP: '株式会社マジルミエ', nameTW: '魔法光源股份有限公司', nameCN:'魔法光源股份有限公司', keyword: '魔法光源股份有限公司' },
{day:5, nameJP: 'ソードアート・オンライン オルタナティブ ガンゲイル・オンラインⅡ', nameTW: '刀劍神域外傳 Gun Gale Online 第二季', nameCN:'刀剑神域外传 Gun Gale Online 第二季', keyword: '刀剑神域外传' },
{day:5, nameJP: 'ダンジョンに出会いを求めるのは間違っているだろうかⅤ 豊穣の女神篇', nameTW: '在地下城尋求邂逅是否搞錯了什麼 第五季 (豐饒的女神篇)', nameCN:'在地下城寻求邂逅是否搞错了什麽 第五季 (丰饶的女神篇)', keyword: '在地下城尋求邂逅是否搞錯了什麼' },
{day:5, nameJP: 'アイドルマスター シャイニーカラーズ 2nd season', nameTW: '偶像大師 閃耀色彩 第二季', nameCN:'偶像大师 闪耀色彩 第二季', keyword: '偶像大师 ' },
{day:5, nameJP: '合コンに行ったら女がいなかった話', nameTW: '[BL]去參加聯誼，卻發現完全沒有女生在場', nameCN:'[BL]去参加联谊，却发现完全没有女生在场', keyword: '参加联谊' },
{day:5, nameJP: '凍牌～裏レート麻雀闘牌録～', nameTW: '凍牌', nameCN:'冻牌', keyword: '冻牌' },
{day:5, nameJP: 'ドラゴンボールDAIMA', nameTW: '七龍珠：DAIMA', nameCN:'七龙珠：DAIMA', keyword: '七龙珠' },
{day:5, nameJP: 'ポケットモンスター', nameTW: '▶️寶可夢 地平線', nameCN:'▶️宝可梦 地平线', keyword: '寶可夢' },
{day:5, nameJP: '2.5次元の誘惑（リリサ） ', nameTW: '2.5 次元的誘惑', nameCN:'2.5次元的诱惑', keyword: '次元的誘惑' },
{day:6, nameJP: 'クマーバ シーズン2', nameTW: 'Kumarba 第二季', nameCN:'Kumarba 第二季', keyword: 'Kumarba' },
{day:6, nameJP: 'SHIBUYA♡HACHI 第2クール', nameTW: 'SHIBUYA♡HACHI 後半', nameCN:'SHIBUYA♡HACHI 后半', keyword: 'SHIBUYA HACHI' },
{day:6, nameJP: 'オーイ！とんぼ 第2期', nameTW: '蜻蛉高球 第二季', nameCN:'蜻蛉高球 第二季', keyword: '蜻蛉高球' },
{day:6, nameJP: '科学×冒険サバイバル！', nameTW: '科學×冒險生存！', nameCN:'科学×冒险生存！', keyword: '科学 冒险生存' },
{day:6, nameJP: 'Thunderbolt Fantasy 東離劍遊紀4', nameTW: 'Thunderbolt Fantasy 東離劍遊紀 4', nameCN:'Thunderbolt Fantasy 东离剑游纪 4', keyword: 'Thunderbolt Fantasy|东离剑游纪' },
{day:6, nameJP: '魔王様、リトライ！R', nameTW: '[ABEMA]魔王大人、RETRY！R', nameCN:'[ABEMA]魔王大人、RETRY！R', keyword: '魔王大人 RETRY R' },
{day:6, nameJP: 'BLEACH 千年血戦篇-相剋譚-', nameTW: 'BLEACH 死神 千年血戰篇-相剋譚-', nameCN:'BLEACH 死神 千年血战篇-相剋谭-', keyword: 'BLEACH 死神' },
{day:6, nameJP: 'ブルーロック VS. U-20 JAPAN \n(全14話)', nameTW: '藍色監獄 第二季', nameCN:'蓝色监狱 第二季', keyword: '蓝色监狱' },
{day:6, nameJP: 'チ。―地球の運動について―', nameTW: '地。-關於地球的運動-', nameCN:'地。-关于地球的运动-', keyword: '地 关于地球的运动' },
{day:6, nameJP: '青の祓魔師 雪ノ果篇', nameTW: '青之驅魔師 雪之盡頭篇', nameCN:'青之驱魔师 雪之尽头篇', keyword: '青之驱魔师' },
{day:6, nameJP: 'らんま1/2 \n(TV放送完畢，由Netflix獨佔配信)', nameTW: '[Netflix]亂馬 1/2 新作動畫', nameCN:'[Netflix]乱马 1/2 新作动画', keyword: '乱马 1/2' },
{day:6, nameJP: '君は冥土様。', nameTW: '你是女僕大人。', nameCN:'你是女僕大人。', keyword: '你是女僕大人' },
{day:6, nameJP: 'パーティーから追放されたその治癒師、実は最強につき', nameTW: '被逐出隊伍的治癒師，其實是最強的', nameCN:'被逐出队伍的治癒师，其实是最强的', keyword: '被逐出队伍的治癒师' },
{day:6, nameJP: '魔王2099', nameTW: '魔王 2099', nameCN:'魔王 2099', keyword: '魔王 2099' },
{day:6, nameJP: '青のミブロ', nameTW: '青之壬生浪', nameCN:'青之壬生浪', keyword: '青之壬生浪' },
{day:6, nameJP: 'クレヨンしんちゃん', nameTW: '▶️蠟筆小新', nameCN:'▶️蜡笔小新', keyword: '蠟筆小新' },
{day:6, nameJP: '名探偵コナン', nameTW: '▶️名偵探柯南', nameCN:'▶️名侦探柯南', keyword: '名偵探柯南' },
{day:6, nameJP: 'ドラえもん', nameTW: '▶️哆啦A夢', nameCN:'▶️哆啦A梦', keyword: '哆啦A夢' },
{day:6, nameJP: 'ぼのぼの', nameTW: '▶️海獺波樂(暖暖日記)', nameCN:'▶️暖暖日记', keyword: '暖暖日記' },
{day:6, nameJP: '僕のヒーローアカデミア 第7期', nameTW: '我的英雄學院 第七季', nameCN:'我的英雄学院 第七季', keyword: '我的英雄學院' },
{day:6, nameJP: 'ニンジャラ', nameTW: '▶️泡泡糖忍戰', nameCN:'▶️泡泡糖忍战', keyword: '泡泡糖忍戰' },
{day:7, nameJP: '機動戦士ガンダム 復讐のレクイエム', nameTW: '[Netflix]機動戰士鋼彈：復仇的鎮魂曲', nameCN:'[Netflix]机动战士高达：復仇的鎮魂曲', keyword: '鋼彈|高达' },
{day:7, nameJP: 'ちびゴジラの逆襲 続編\n(一年放送)', nameTW: '[YouTube]小小哥吉拉的逆襲 續篇', nameCN:'[YouTube]小哥斯拉的逆袭 续篇', keyword: '小哥斯拉的逆袭' },
{day:7, nameJP: '魔法少女リリカルなのは The MOVIE (TV編集版)', nameTW: '魔法少女奈葉 Lyrical Selection (TV剪輯版)', nameCN:'魔法少女奈叶 Lyrical Selection (TV剪辑版)', keyword: '魔法少女奈叶 Lyrical Selection' },
{day:7, nameJP: 'ばなにゃ あらうんど ざ わーるど', nameTW: 'ばなにゃ あらうんど ざ わーるど', nameCN:'ばなにゃ あらうんど ざ わーるど', keyword: 'ばなにゃ あらうんど ざ わーるど' },
{day:7, nameJP: '夜は猫といっしょ 第3期 \n(2024/12放送)', nameTW: '今晚有貓伴身邊 第三季', nameCN:'今晚有猫伴身边 第三季', keyword: '今晚有猫伴身边' },
{day:7, nameJP: 'ケンガンアシュラ Season2 Part.1 \n(2023/09/21Netflix放送。2024/10 TV放送)', nameTW: '拳願阿修羅拳願阿修羅 第2季Part1', nameCN:'拳愿阿修罗拳愿阿修罗 第2季Part1', keyword: '拳愿阿修罗拳愿阿修罗 第2季Part1' },

  ];

    // 生成連結
    dmhyEntries.forEach(entry => {
        entry.link = `https://${hostname}/topics/list?keyword=${encodeURIComponent(entry.keyword)}`;
    });

    // 將新的 dmhyEntries 和 kuru 存儲到 localStorage
    localStorage.setItem('dmhyEntries', JSON.stringify(dmhyEntries));
    localStorage.setItem('LocalKuru',kuru);
}

console.log(dmhyEntries);
console.log(kuru);

  //畫表格
  const newRows = daysOfWeek.map((day, index) => {
    const newRow = document.createElement('tr');
    const newDay = document.createElement('th');
    newDay.innerText = `${day}`;
    const newAnimeList = document.createElement('td');

    // 判斷今天星期，並插入class內容 (*動漫花園提供的樣式)
    if (day === daysOfWeek[todayDay]) {
      newRow.classList.add('today');
    } else if (day === daysOfWeek[(todayDay + 1) % 7] || day === daysOfWeek[(todayDay + 6) % 7]) {
      newRow.classList.add('odd');
    } else {
      newRow.classList.add('even');
    }
    // 根據瀏覽器設定，顯示對應的翻譯(簡中，繁中)
    dmhyEntries.forEach(entry => {
      if (entry.day === index) {
        const newAnimeLink = document.createElement('a');
        newAnimeLink.href = entry.link;
        newAnimeLink.title = entry.nameJP;
        if (navigator.language.toLowerCase() === 'zh-cn') {
          newAnimeLink.innerHTML = replaceTextWithImage(entry.nameCN);
        } else {
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
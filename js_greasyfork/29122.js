// ==UserScript==
// @name                5sing审核助手
// @version             0.0.6
// @author              林威臻
// @license             GPL-3.0
// @grant               none
// @description         审核用的
// @include             http://manage.5sing.kugou.net/*
// @run-at              document-end
// @namespace           undefined
// @downloadURL https://update.greasyfork.org/scripts/29122/5sing%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/29122/5sing%E5%AE%A1%E6%A0%B8%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const JFInterestedKeywords = [
  /我们不是情侣/,
  /mc/gi,
  /M c 小爽/gi,
  /M c/gi,
  /空拍/,
  /灵魂摆渡人/gi,
  /呐喊/gi,
  /楚汉英雄篇/gi,
  /三世七字/gi,
  /恋瑞/gi,
  /歌者/gi,
  /三生三世/gi,
  /一百七十二笔/gi,
  /断情笔/gi,
  /战歌/gi,
  /气势/gi,
  /dj/gi,
  /喊遍整个东三省/gi,
  /另类/gi,
  /红颜墓/gi,
  /战神/gi,
  /阳光不燥/gi,
  /饮酒醉/gi,
  /刀山火海/gi,
  /社会/gi,
  /赤子轩逸/gi,
  /战/gi,
  /浪子/gi,
  /傻逼/gi,
  /耿耿星河/gi,
  /孤独烈酒/gi,
  /余罪/gi,
  /怂了/gi,
  /小闯你的好伙伴/gi,
  /惊雷/gi,
  /偷情/gi,
  /婊子/gi,
  /玄武盾/gi,
  /网红/gi,
  /异地恋/gi,
  /第一人/gi,
  /嘶吼/gi,
  /喊/gi,
  /连麦/gi,
  /气质/gi,
  /我曾十步杀一人/gi,
  /怒/gi,
  /让我做你的眼睛.*/gi,
  /爱到最后都是恩情/gi,
  /滚/gi,
  /何必执着一张脸/gi,
  /妲己/gi,
  /收起锋芒/gi,
  /言汐哇/gi,
  /别笑了/gi,
  /隐姓埋名刀剑封/gi,
  /半包烟/gi,
  /命/gi,
  /眼泪你别问/gi,
  /轮回篇/gi,
  /精彩/gi,
  /刀斩逆徒/gi,
  /颜王/gi,
  /我对自己开了一枪/gi,
  /挑音/gi,
  /胸是软绵绵的/gi,
  /别做我的英雄/gi,
  /你别连笑都那么勉强/gi,
  /菠萝咒/gi,
  /傻艾伦/gi,
  /病/gi,
  /深情总是被辜负/gi,
  /十年戎马/gi,
  /你说别再笑了/gi,
  /痞子/gi,
  /大话西游/gi,
  /炫赫门/gi,
  /久梵丶/gi,
  /压声/gi,
  /极限/gi,
  /阳光不噪/gi,
  /我想做你的新郎/gi,
  /踏马出征展风采/gi,
  /阎王词超/gi,
  /隐姓埋名/gi,
  /蜗居/gi,
  /两袖清风/gi,
  /我想做你的新娘/gi,
  /花千骨/gi,
  /爱情是一场梦/gi,
  /梦回大唐/gi,
  /孟婆/gi,
  /王者/gi,
  /煊赫门/gi,
  /花开一度终会败/gi,
  /煊赫门/gi,
  /麦手/gi,
  /阳光正好/gi,
  /老九门/gi,
  /让我作你的眼睛/gi,
  /千秋月国色天香/gi,
  /一世为王/gi,
  /浪词/gi,
  /and/gi,
  /这首歌我送给你/gi

];

let alreadyLoadedTimes = 0;

function getElements() {
  const targetTagNames = ['td'];
  return targetTagNames.reduce((res, tagName) => {
    const tags = document.getElementsByTagName(tagName);
    if (tags && tags.length) {
      res.push(...tags);
    }
    return res;
  }, []);
}

function matchKeywordsInElements() {
  const elements = getElements();
  elements.forEach((element) => {
    JFInterestedKeywords.forEach((keyword) => {
      const isMatched = keyword.test(element.innerText);
      if (isMatched) {
        element.style.backgroundColor = '#FFDA5E';
        element.style.color = 'black';
      }
    });
  });
  alreadyLoadedTimes += 1;
}
const autoMatchInterval = setInterval(() => {
  if (alreadyLoadedTimes < 100) {
    matchKeywordsInElements();
  } else {
    clearInterval(autoMatchInterval);
  }
}, 1000);
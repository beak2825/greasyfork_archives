// ==UserScript==
// @name         월광사 추가 번역 part1
// @namespace
// @description
// @version      5.2.1
// @homepage
// @homepageURL
// @author
// @match        http://3rdguide.com/web/teamnew/index
// @match        http://www.3rdguide.com/web/teamnew/index
// @match        https://3rdguide.com/web/teamnew/index
// @match        https://www.3rdguide.com/web/teamnew/index
// @grant        none
// @namespace https://github.com/zklm/userscripts(원본)
// @description 이거만 받으면 세부페이지 안보이니까
// @downloadURL https://update.greasyfork.org/scripts/447325/%EC%9B%94%EA%B4%91%EC%82%AC%20%EC%B6%94%EA%B0%80%20%EB%B2%88%EC%97%AD%20part1.user.js
// @updateURL https://update.greasyfork.org/scripts/447325/%EC%9B%94%EA%B4%91%EC%82%AC%20%EC%B6%94%EA%B0%80%20%EB%B2%88%EC%97%AD%20part1.meta.js
// ==/UserScript==

(function () {
  "use strict";
  /* globals $ */

  // Allow new tab opening of team links
  // https://honkai-guide.web.app/calc/calc.html#/
  // Doesn't allow middle click on FF, mouseup to get around isn't possible because of popup detection,
  // alternative is to just replace div->a in each td but that messes up layout on 2nd col. Meh.
  $("#ct_det tbody")
    .off()
    .on("click", "tr", function () {
      const urlstr = $(this).find(".tgcol0").data("url");
      if (urlstr != undefined) window.open(urlstr, "_blank");
    });

  // Translations
  const tls = {
    // Misc
    记忆战场: "기억전장",
    超弦空间: "초끈공간",
    段位: "계급",
    天气: "날씨",
    区域: "지역",
    边缘区: "한계구역",
    机械: "기계",
    生物: "생물",
    边缘区: "변경구역",
    边缘区: "밀집구역",
    高危区: "위험구역",
    特异区: "특이지역",

    "机械:": "기계",

    红莲: "홍련",
    苦痛: "고통",
    寂灭: "적멸",
    原罪: "원죄",
    禁忌: "금기",

    "战区:": "등급",
    终极战区: "종급전장",
    高级战区: "고급전장",
    SSS难度: "SSS난이도",
    "强敌:": "강적",
    "女武神:": "발키리",
    深渊终极区: "종급심연",

    阵容: "라인업",
    得分: "점수",
    造价: "비용",
    操作难度: "난이도",
    好评数: "좋아요",
    创建时间: "작성일",
    队长: "리더",
    队员1: "파티원1",
    队员2: "파티원2",

    // 보스
    祸斗: "화두",
    "托纳提乌·噬日之影": "타나티우",
    吼姆王: "호무킹",
    // '卡莲': '카렌', // (use valkyrie TL)
    绯狱丸: "비옥환",
    海姆达尔: "헤임달",
    湮灭沉灵: "침령",
    // '苍骑士·月魂': '창기사·월혼', // (use valkyrie TL)
    教父军团: "골드런",
    特里波卡: "틀니포카",
    贝纳勒斯: "베나레스",
    "姬麟·黑": "흑헌원",
    // '空之律者': '율등어', // (use valkyrie TL)
    "MHT-3和平使者": "탱크",
    "MHT-3 和平使者": "탱크",
    阿湿波: "아슈빈",
    地藏御魂: "지장어혼",
    赫菲斯托斯: "헤파이스토스",
    // '影骑士·月轮': '월륜', // (use valkyrie TL)
    帕凡提: "파르바티",
    深渊终极区: "종급심연",
    被诅咒的英魂: "영령",
    陨冰之律者: "짭안나",
    "RPC-6626": "비행기",
    八重霞: "카스미",
    "科亚特尔-复生之影": "코아틀",
    "MHT-3B 天堂使者": "탱크",
    奔狼的领主: "댕댕이",
    "支配之律者-乌合之众": "지배의 율자",
    高危区: "시계맨",
    "虚树神骸-虚无主义": "시계맨",
    "辉骑士·月魄": "월백",
    "托纳提乌-噬日之影": "타나티우",
    "虚树神骸-虚无主义II": "시계맨2",
    奔狼的领主: "댕댕이",
    高危区: "시계맨",
    伪神·奥托: "오토",

    // 캐릭터 = 발키리
    符华: "후카",
    云墨丹心: "선인",
    雾都迅羽: "해청(증폭)",
    白夜执事: "집사",
    炽翎: "치령",
    "影骑士·月轮": "월륜",
    "女武神·迅羽": "해청",
    识之律者: "흑카",

    八重樱: "사쿠라",
    夜隐重霞: "카스미",
    真炎幸魂: "염쿠라",
    逆神巫女: "생쿠라",
    "御神装·勿忘": "기쿠라",

    "希儿·芙乐艾": "제레",
    彼岸双生: "쩨레",
    幻海梦蝶: "꿈나비",
    魇夜星渊: "흑제레",

    幽兰黛尔: "듀란달",
    "女武神·荣光": "영광",
    "辉骑士·月魄": "월백",
    不灭星锚: "노란달",
    天元骑英: "천원",

    德丽莎: "테레사",
    "暮光骑士·月煌": "기레사(증폭)",
    月下初拥: "초옹이",
    神恩颂歌: "생레사",
    "处刑装·紫苑": "기레사",
    樱火轮舞: "앵레사",
    "女武神·誓约": "이레사",
    朔夜观星: "테갈",

    琪亚娜: "키아나",
    天穹游侠: "참키",
    空之律者: "율등어",
    圣女祈祷: "성녀",
    "女武神·游侠": "총키",
    "白骑士·月光": "월광",
    "领域装·白练": "삐아나",
    薪炎之律者: "신염",

    布洛妮娅: "브로냐",
    理之律者: "부릉냐",
    彗星驱动: "줘팸(증폭)",
    异度黑核侵蚀: "쿠로냐",
    银狼的黎明: "은랑",
    次元边界突破: "스로냐",
    "女武神·战车": "삐로냐",
    "驱动装·山吹": "줘팸",
    雪地狙击: "빙로냐",
    迷城骇兔: "브라우니",
    次生银翼: "미시브",

    阿琳姐妹: "아린 자매",
    樱桃炸弹: "우쟝",
    蓝莓特攻: "좌쟝",
    狂热蓝调Δ: "델타",

    芽衣: "메이",
    雷之律者: "율메이",
    破晓强袭: "검메(증폭)",
    雷电女王的鬼铠: "귀메",
    "脉冲装·绯红": "삐메",
    "女武神·强袭": "검메",
    影舞冲击: "그메",
    断罪影舞: "그메(증폭)",

    丽塔: "리타",
    失落迷迭: "로즈마리",
    "苍骑士·月魂": "월혼",
    "猎袭装·影铁": "영철",
    黯蔷薇: "검은 장미",
    缭乱星棘: "성극",

    姬子: "히메코",
    "真红骑士·月蚀": "월식",
    极地战刃: "빙메코",
    "融核装·深红": "기메코",
    战场疾风: "삐메코",
    "女武神·凯旋": "개선",
    血色玫瑰: "스메코",

    卡莲: "카렌",
    原罪猎人: "빵렌",
    第六夜想曲: "괴도",
    "圣仪装·今样": "금양",

    明日香: "아스카",

    菲谢尔: "피슬",
    "断罪皇女！！": "피슬",

    "娜塔莎·希奥拉": "레이븐",
    午夜苦艾: "레이븐",

    梅比乌斯: "뫼비",
    "无限·噬界之蛇": "뫼비",

    爱莉希雅: "엘리",
    "粉色妖精小姐♪": "엘리",

    卡萝尔·佩珀: "캐롤",
    甜辣女孩: "캐롤",

    格蕾修: "그리세오",
    繁星·绘世之卷: "그리세오",

    伊甸: "에덴",
    黄金·璀耀之歌: "에덴",

    阿波尼亚: "아포니아",
    戒律·深罪之槛: "아포니아",

    帕朵菲莉丝: "필리스",
    空梦·掠集之兽: "필리스",
  };

  const tl_el = function (tls, el) {
    if (el && tls[el.innerText]) {
      el.innerHTML = el.innerHTML.replace(el.innerText, tls[el.innerText]);
    }
  };

  const translate = function () {
    $(".table-search span, .table-search .label").each(function () {
      tl_el(tls, this);
    });
  };

  $("#_js_table_s_c_1").on("click", "li", translate);

  translate();
})();

// ==UserScript==
// @name         월광사 키갤 번역 by Agilent
// @namespace    https://github.com/zklm/userscripts(원본)
// @description  월광사(3rdguide) 발키리 및 강적 번역
// @version      1.5.1
// @homepage     
// @homepageURL  
// @author       zklm, Agilent(KorTL)
// @match        http://3rdguide.com/web/teamnew/index
// @match        http://www.3rdguide.com/web/teamnew/index
// @match        https://3rdguide.com/web/teamnew/index
// @match        https://www.3rdguide.com/web/teamnew/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411793/%EC%9B%94%EA%B4%91%EC%82%AC%20%ED%82%A4%EA%B0%A4%20%EB%B2%88%EC%97%AD%20by%20Agilent.user.js
// @updateURL https://update.greasyfork.org/scripts/411793/%EC%9B%94%EA%B4%91%EC%82%AC%20%ED%82%A4%EA%B0%A4%20%EB%B2%88%EC%97%AD%20by%20Agilent.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals $ */

    // Allow new tab opening of team links
    // https://honkai-guide.web.app/calc/calc.html#/
    // Doesn't allow middle click on FF, mouseup to get around isn't possible because of popup detection,
    // alternative is to just replace div->a in each td but that messes up layout on 2nd col. Meh.
    $('#ct_det tbody').off().on('click', 'tr', function() {
        const urlstr = $(this).find('.tgcol0').data('url');
        if (urlstr != undefined) window.open(urlstr, '_blank');
    })

    // Translations
    const tls = {
        // Misc
        '战区:': '등급',
        '终极战区': '종급전장',
        '高级战区': '고급전장',
        '强敌:': '보스',
        '女武神:': '발키리',

        // Bosses
        '祸斗': '화두',
        '托纳提乌·噬日之影': '타나티우',
        '吼姆王': '호무킹',
        // '卡莲': '카렌', // (use valkyrie TL)
        '绯狱丸': '비옥환',
        '海姆达尔': '헤임달',
        '湮灭沉灵': '침령',
        // '苍骑士·月魂': '창기사·월혼', // (use valkyrie TL)
        '教父军团': '골드런',
        '特里波卡': '틀니포카',
        '贝纳勒斯': '베나쟝',
        '姬麟·黑': '흑헌원',
        // '空之律者': '공간의 율자', // (use valkyrie TL)
        'MHT-3和平使者': '탱크',
        'MHT-3 和平使者': '탱크',
        '阿湿波': '아슈빈',
        '地藏御魂': '지장어혼',
        '赫菲斯托斯': '헤파이스토1스',
        // '影骑士·月轮': '영기사·월륜', // (use valkyrie TL)
        '帕凡提': '파르바티',
        '深渊终极区': '종급심연',
        '被诅咒的英魂': '영령',
        '陨冰之律者':'안나',
        'RPC-6626':'비행기',
      
        // Valkyries
        '符华': '후카',
        '云墨丹心': '선인',
        '雾都迅羽': '증폭해청',
        '白夜执事': '집사',
        '炽翎': '치령',
        '影骑士·月轮': '월륜',
        '女武神·迅羽': '해청',

        '八重樱': '사쿠라',
        '夜隐重霞': '카스미',
        '真炎幸魂': '염쿠라',
        '逆神巫女': '생쿠라',
        '御神装·勿忘': '기쿠라',

        '希儿·芙乐艾': '제레',
        '彼岸双生': '제레즈',
        '幻海梦蝶': '꿈나비',

        '幽兰黛尔': '듀란달',
        '女武神·荣光': '영광',
        '辉骑士·月魄': '월백',
        '不灭星锚' : '노란달',

        '德丽莎': '테레사',
        '暮光骑士·月煌': '증폭기레사',
        '月下初拥': '초옹이',
        '神恩颂歌': '생레사',
        '处刑装·紫苑': '기레사',
        '樱火轮舞': '앵레사',
        '女武神·誓约': '이레사',
        '朔夜观星': '테갈공명',

        '琪亚娜': '키아나',
        '天穹游侠': '참키',
        '空之律者': '율등어',
        '圣女祈祷': '성녀',
        '女武神·游侠': '총키',
        '白骑士·月光': '월광',
        '领域装·白练': '삐아나',

        '布洛妮娅': '브로냐',
        '理之律者': '부릉냐',
        '彗星驱动': '증폭황매화',
        '异度黑核侵蚀': '쿠로냐',
        '银狼的黎明': '은랑',
        '次元边界突破': '스로냐',
        '女武神·战车': '삐로냐',
        '驱动装·山吹': '황매화',
        '雪地狙击': '빙로냐',

        '阿琳姐妹': '아린 자매',
        '樱桃炸弹': '우쟝',
        '蓝莓特攻': '좌쟝',
        '狂热蓝调Δ' : '델타쟝',

        '芽衣': '메이',
        '雷之律者': '율메이',
        '破晓强袭': '증폭 검메이',
        '雷电女王的鬼铠': '귀메이',
        '脉冲装·绯红': '삐메이',
        '女武神·强袭': '검메이',
        '影舞冲击': '그메이',
        '断罪影舞': '증폭 그메이',

        '丽塔': '리타',
        '失落迷迭': '로즈마리',
        '苍骑士·月魂': '월혼',
        '猎袭装·影铁': '영철이',
        '黯蔷薇': '검은 장미',

        '姬子': '히메코',
        '真红骑士·月蚀': '월식',
        '极地战刃': '빙메코',
        '融核装·深红': '기메코',
        '战场疾风': '삐메코',
        '女武神·凯旋': '개선',
        '血色玫瑰': '스메코',

        '卡莲': '카렌',
        '原罪猎人': '빵렌',
        '第六夜想曲': '괴도',
        '圣仪装·今样': '금양',
        
        '明日香': '아스카'
      
    }

    const tl_el = function(tls, el) {
        if (el && tls[el.innerText]) {
            el.innerHTML = el.innerHTML.replace(el.innerText, tls[el.innerText])
        }
    }

    const translate = function() {
        $('.table-search span, .table-search .label').each(function() {
            tl_el(tls, this)
        })
    }

    $('#_js_table_s_c_1').on('click', 'li', translate)

    translate()
})();
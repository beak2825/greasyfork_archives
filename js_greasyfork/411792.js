// ==UserScript==
// @name         월광사 간단 번역 by Agilent
// @namespace    https://github.com/zklm/userscripts(원본)
// @description  월광사(3rdguide) 발키리 및 강적 번역
// @version      1.5.0
// @homepage     
// @homepageURL  
// @author       zklm, Agilent(KorTL)
// @match        http://3rdguide.com/web/teamnew/index
// @match        http://www.3rdguide.com/web/teamnew/index
// @match        https://3rdguide.com/web/teamnew/index
// @match        https://www.3rdguide.com/web/teamnew/index
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411792/%EC%9B%94%EA%B4%91%EC%82%AC%20%EA%B0%84%EB%8B%A8%20%EB%B2%88%EC%97%AD%20by%20Agilent.user.js
// @updateURL https://update.greasyfork.org/scripts/411792/%EC%9B%94%EA%B4%91%EC%82%AC%20%EA%B0%84%EB%8B%A8%20%EB%B2%88%EC%97%AD%20by%20Agilent.meta.js
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
        '强敌:': '강적',
        '女武神:': '발키리',
        '深渊终极区': '종급심연',

        // Bosses
        '祸斗': '지양 괴수-화두',
        '托纳提乌·噬日之影': '타나티우·태양을 삼키는 그림자',
        '吼姆王': '호무킹',
        // '卡莲': '카렌', // (use valkyrie TL)
        '绯狱丸': '비옥환',
        '海姆达尔': '신기 헤임달',
        '湮灭沉灵': '인멸침령',
        // '苍骑士·月魂': '창기사·월혼', // (use valkyrie TL)
        '教父军团': '갓파더 군단',
        '特里波卡': '테스카틀리포카·혼돈의 그림자',
        '贝纳勒斯': '베나레스',
        '姬麟·黑': '희헌원·흑',
        // '空之律者': '공간의 율자', // (use valkyrie TL)
        'MHT-3和平使者': 'MHT-3 파시피스타',
        'MHT-3 和平使者': 'MHT-3 파시피스타',
        '阿湿波': '아슈빈',
        '地藏御魂': '지장어혼',
        '赫菲斯托斯': '헤파이스토스',
        // '影骑士·月轮': '영기사·월륜', // (use valkyrie TL)
        '帕凡提': '파르바티',
        '被诅咒的英魂': '저주받은 영령',
        '陨冰之律者':'얼음유성의 율자',

        // Valkyries
        '符华': '후카',
        '云墨丹心': '단심의 먹구름',
        '雾都迅羽': '안개성의 해청',
        '白夜执事': '백야집사',
        '炽翎': '치령',
        '影骑士·月轮': '영기사·월륜',
        '女武神·迅羽': '발키리·해청',

        '八重樱': '야에 사쿠라',
        '夜隐重霞': '밤 그림자 카스미',
        '真炎幸魂': '진염행혼',
        '逆神巫女': '역신무녀',
        '御神装·勿忘': '현신화·물망초',

        '希儿·芙乐艾': '제레',
        '彼岸双生': '피안쌍생',
        '幻海梦蝶': '환해의 꿈나비',

        '幽兰黛尔': '듀란달',
        '女武神·荣光': '발키리·영광',
        '辉骑士·月魄': '성휘의 기사·월백',
        '不灭星锚' : '데아 앵커',

        '德丽莎': '테레사',
        '暮光骑士·月煌': '황혼기사·월황',
        '月下初拥': '월하초옹',
        '神恩颂歌': '신은송가',
        '处刑装·紫苑': '처형복·반혼초',
        '樱火轮舞': '앵화윤무',
        '女武神·誓约': '발키리·서약',
        '朔夜观星': '삭야관성',

        '琪亚娜': '키아나',
        '天穹游侠': '증폭:천궁의 레인저',
        '空之律者': '공간의 율자',
        '圣女祈祷': '성녀의 기도',
        '女武神·游侠': '발키리·레인저',
        '白骑士·月光': '백기사·월광',
        '领域装·白练': '투예복·백련',

        '布洛妮娅': '브로냐',
        '理之律者': '이치의 율자',
        '彗星驱动': '증폭:혜성구동',
        '异度黑核侵蚀': '이도 흑핵 침식',
        '银狼的黎明': '은랑의 여명',
        '次元边界突破': '차원 경계 돌파',
        '女武神·战车': '발키리·채리엇',
        '驱动装·山吹': '기동장갑·황매화',
        '雪地狙击': '설원 저격수',

        '阿琳姐妹': '아린 자매',
        '樱桃炸弹': '체리 폭탄',
        '蓝莓特攻': '블루베리 특공',
        '狂热蓝调Δ' : '열광 템포Δ',

        '芽衣': '메이',
        '雷之律者': '번개의 율자',
        '破晓强袭': '증폭:새벽의 스트라이커',
        '雷电女王的鬼铠': '뇌전 여왕의 귀신갑주',
        '脉冲装·绯红': '펄스 슈트·비홍',
        '女武神·强袭': '발키리·스트라이크',
        '影舞冲击': '그림자의 춤',
        '断罪影舞': '증폭:단죄의 그림자',

        '丽塔': '리타',
        '失落迷迭': '로스트 로즈마리',
        '苍骑士·月魂': '창기사·월혼',
        '猎袭装·影铁': '헌트슈트·팬텀 아이언',
        '黯蔷薇': '검은 장미',

        '姬子': '히메코',
        '真红骑士·月蚀': '진홍의 기사·월식',
        '极地战刃': '극지전인',
        '融核装·深红': '퓨전아머·스칼렛',
        '战场疾风': '전장의 질풍',
        '女武神·凯旋': '발키리·개선',
        '血色玫瑰': '핏빛 장미',

        '卡莲': '카렌',
        '原罪猎人': '원죄 사냥꾼',
        '第六夜想曲': '제6 야상곡',
        '圣仪装·今样': '성결 예장·금양',
        
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
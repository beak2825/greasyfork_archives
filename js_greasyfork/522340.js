// ==UserScript==
// @name         Bangumi 话题浏览历史记录
// @version      2.5
// @description  null
// @author       Sedoruee
// @match        https://bgm.tv/*
// @match        https://bangumi.tv/*
// @match        http://bgm.tv/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/1383632
// @downloadURL https://update.greasyfork.org/scripts/522340/Bangumi%20%E8%AF%9D%E9%A2%98%E6%B5%8F%E8%A7%88%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/522340/Bangumi%20%E8%AF%9D%E9%A2%98%E6%B5%8F%E8%A7%88%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(()=>{
    'use strict';
    const P=7,D='sedoruee_app_history_dock',M='sedoruee_app_history_dock_menu',W='sedoruee_app_history_main_window',C='sedoruee_app_history_center',T='sedoruee_app_history_tabs',N='sedoruee_app_history_content',A='sedoruee_app_history_tab',S='sedoruee_app_history_tab_selected',B='sedoruee_app_history_dock_menu_tab',L='sedoruee_app_history_list',I='sedoruee_app_history_item',G='sedoruee_app_history_loading',V='sedoruee_app_history_type_select',E='sedoruee_app_history_theme_select';
const K = {
    '人民粉': {
        name: 'People\'s Pink',
        description: '温柔的粉色主题，代表着人民的温暖和幸福。',
        bor: '#f09199',
        tabBg: '#ffb2c1',
        tabS: '#f09199',
        hovBg: '#f8d7e1',
        load: '#f09199',
        bg: ['linear-gradient(45deg, #ffb2c1 0%, #ffffff 70%)', 'linear-gradient(-45deg, #ffe0e6 0%, #ffffff 50%)']
    },
    '中华金': {
        name: 'China Gold',
        description: '辉煌的金色主题，象征着中华民族的繁荣昌盛。',
        bor: '#FFD700',
        tabBg: '#FFFACD',
        tabS: '#FFD700',
        hovBg: '#FFF8DC',
        load: '#FFD700',
        bg: ['linear-gradient(to right, #FFFACD, #fff8dc 50%, #ffffff 90%)', 'linear-gradient(to left, #fff8dc , #fffffa 50%)']
    },
    '共产红': {
        name: 'Communist Red',
        description: '鲜艳的红色主题，代表着共产主义的革命精神。',
        bor: '#FF0000',
        tabBg: '#FF4D4D',
        tabS: '#FF0000',
        hovBg: '#FF8080',
        load: '#FF0000',
         bg: ['linear-gradient(to bottom, #FF4D4D 0%, #ffffff 50%)', 'linear-gradient(to top, #FF8080 0%, #fff0f0 60%)']
    },
    '神州紫': {
        name: 'Divine Purple',
        description: '神秘的紫色主题，象征着神州的庄严和神圣。',
        bor: '#9400D3',
        tabBg: '#BA55D3',
        tabS: '#9400D3',
        hovBg: '#E6A3ED',
        load: '#9400D3',
         bg: ['linear-gradient(135deg, #BA55D3 0%, #ffffff 60%)', 'linear-gradient(-135deg, #E6A3ED 0%, #f0f0f8 60%)']
    },
    '华夏黄': {
        name: 'Huaxia Yellow',
        description: '明亮的黄色主题，象征着华夏文明的辉煌和灿烂。',
        bor: '#FFFF00',
        tabBg: '#FFFACD',
        tabS: '#FFFF00',
        hovBg: '#FFFFE0',
        load: '#FFFF00',
        bg: ['linear-gradient(to bottom right, #FFFACD 0%, #FFFFE0 50%, #ffffff 80%)', 'linear-gradient(to top left, #FFFFE0 0%, #fffffa 60%)']
    },
    '盛世青': {
         name: 'Prosperous Green',
         description: '清新的青色主题，象征着盛世的活力和希望。',
        bor: '#008080',
        tabBg: '#20B2AA',
        tabS: '#008080',
        hovBg: '#7FFFD4',
        load: '#008080',
        bg: ['linear-gradient(to right, #20B2AA 0%, #7FFFD4 40%, #ffffff 80%)', 'linear-gradient(to left, #7FFFD4 0%, #e0ffff 70%)']
    },
    '龙魂墨': {
        name: 'Dragon Ink',
        description: '沉稳的黑色主题，象征着龙的威严和力量。',
        bor: '#000000',
        tabBg: '#404040',
        tabS: '#000000',
        hovBg: '#808080',
        load: '#000000',
        bg: ['linear-gradient(to bottom, #404040 0%, #808080 40%,#ffffff 80%)', 'linear-gradient(to top, #808080 0%, #f0f0f0 60%)']
    },
    '强国碧': {
         name: 'Powerful Green',
         description: '稳重的绿色主题，象征着强国的崛起和发展。',
        bor: '#008000',
        tabBg: '#90EE90',
        tabS: '#008000',
        hovBg: '#C1FFC1',
        load: '#008000',
       bg: ['linear-gradient(to right, #90EE90 0%, #C1FFC1 50%, #ffffff 90%)', 'linear-gradient(to left, #C1FFC1 0%, #f0fff0 50%)']
    },
    '复兴紫': {
         name: 'Rejuvenation Purple',
         description: '高贵的紫色主题，象征着民族复兴的伟大目标。',
        bor: '#800080',
        tabBg: '#DA70D6',
        tabS: '#800080',
        hovBg: '#EE82EE',
        load: '#800080',
        bg: ['linear-gradient(to bottom right, #DA70D6 0%, #EE82EE 50%, #ffffff 70%)', 'linear-gradient(to top left, #EE82EE 0%, #f0f0ff 60%)']
    },
    '富强蓝': {
        name: 'Prosperity Blue',
        description: '深邃的蓝色主题，象征着国家的富强和繁荣。',
        bor: '#0000FF',
        tabBg: '#87CEFA',
        tabS: '#0000FF',
        hovBg: '#ADD8E6',
        load: '#0000FF',
        bg: ['linear-gradient(to right, #87CEFA 0%,#ADD8E6 40%,#ffffff 90%)', 'linear-gradient(to left, #ADD8E6 0%,#e0f0ff 70%)']
    },
    '核酸白': {
        name: 'Nucleic Acid White',
        description: '纯洁的白色主题，代表着抗击疫情的决心和力量。',
         bor: '#F0F8FF',
         tabBg: '#E0F7FF',
         tabS: '#F0F8FF',
         hovBg: '#F8F8FF',
         load: '#F0F8FF',
       bg: ['linear-gradient(135deg, #E0F7FF 0%, #ffffff 80%)', 'linear-gradient(-135deg, #F0F8FF 0%, #ffffff 70%)']
    },
    '中国航天银': {
         name: 'China Aerospace Silver',
         description: '科技感十足的银色主题，象征着中国航天事业的辉煌成就。',
        bor: '#C0C0C0',
        tabBg: '#D3D3D3',
        tabS: '#C0C0C0',
        hovBg: '#E0E0E0',
        load: '#C0C0C0',
        bg: ['linear-gradient(to bottom, #D3D3D3 0%,#E0E0E0 50%, #ffffff 90%)', 'linear-gradient(to top, #E0E0E0 0%, #f8f8f8 70%)']
    },
   '丝绸之路骆驼棕': {
         name: 'Silk Road Camel Brown',
        description: '古朴的棕色主题，象征着丝绸之路的辉煌历史和文化。',
        bor: '#A0522D',
        tabBg: '#D2B48C',
        tabS: '#A0522D',
        hovBg: '#E6D0B4',
        load: '#A0522D',
      bg: ['linear-gradient(to right, #D2B48C 0%, #E6D0B4 40%,#ffffff 90%)', 'linear-gradient(to left, #E6D0B4 0%,#f0e0d0 70%)']
    },
    '长城灰': {
         name: 'Great Wall Grey',
         description: '坚实的灰色主题，象征着万里长城的雄伟和坚韧。',
        bor: '#696969',
        tabBg: '#A9A9A9',
        tabS: '#696969',
        hovBg: '#D3D3D3',
        load: '#696969',
         bg: ['linear-gradient(to right bottom, #A9A9A9 0%, #D3D3D3 50%,#ffffff 80%)', 'linear-gradient(to left top, #D3D3D3 0%,#e0e0e0 60%)']
    },
    '熊猫黑': {
         name: 'Panda Black',
         description: '可爱的黑色主题，象征着国宝熊猫的憨态可掬。',
        bor: '#000000',
        tabBg: '#2F4F4F',
        tabS: '#000000',
        hovBg: '#696969',
        load: '#000000',
        bg: ['linear-gradient(to bottom, #2F4F4F 0%, #696969 50%,#ffffff 80%)', 'linear-gradient(to top, #696969 0%, #f0f0f0 60%)']
    },
   '青花瓷蓝': {
         name: 'Porcelain Blue',
          description: '典雅的蓝色主题，象征着青花瓷的古典韵味和文化传承。',
        bor: '#1E90FF',
        tabBg: '#ADD8E6',
        tabS: '#1E90FF',
        hovBg: '#B0E0E6',
        load: '#1E90FF',
        bg: ['linear-gradient(to right, #ADD8E6 0%, #B0E0E6 40%, #ffffff 90%)', 'linear-gradient(to left, #B0E0E6 0%, #f0f8ff 70%)']
    },
    '中国茉莉白': {
         name: 'Jasmine White',
         description: '清新的白色主题，象征着茉莉花的纯洁和美好。',
         bor: '#F0F8FF',
        tabBg: '#FAF0E6',
        tabS: '#F0F8FF',
        hovBg: '#FFF5EE',
        load: '#F0F8FF',
       bg: ['linear-gradient(to bottom right, #FAF0E6 0%, #FFF5EE 50%, #ffffff 90%)', 'linear-gradient(to top left, #FFF5EE 0%, #f8f0ff 70%)']
    },
    '中华希望橙': {
         name: 'Hope Orange',
         description: '温暖的橙色主题，象征着中华民族的希望和未来。',
        bor: '#FFA500',
        tabBg: '#FFDAB9',
        tabS: '#FFA500',
        hovBg: '#FFE4C4',
        load: '#FFA500',
         bg: ['linear-gradient(to right, #FFDAB9 0%,#FFE4C4 40%, #ffffff 90%)', 'linear-gradient(to left, #FFE4C4 0%, #fff0e0 70%)']
    },
   '华为MateXT红': {
         name: 'Huawei Mate Red',
        description: '科技感十足的红色主题，象征着华为 Mate 系列的创新精神。',
         bor: '#E53935',
        tabBg: '#FFCDD2',
        tabS: '#E53935',
       hovBg: '#FFEBEE',
        load: '#E53935',
       bg: ['linear-gradient(to bottom, #FFCDD2 0%, #FFEBEE 50%, #ffffff 90%)', 'linear-gradient(to top, #FFEBEE 0%, #fff0f0 70%)']
    },
   '华为Pura陶瓷棕': {
         name: 'Huawei Pura Brown',
         description: '简约的陶瓷棕主题，象征着华为 Pura 系列的精湛工艺。',
         bor: '#8D6E63',
         tabBg: '#D7CCC8',
         tabS: '#8D6E63',
        hovBg: '#EFEBE9',
        load: '#8D6E63',
       bg: ['linear-gradient(to right, #D7CCC8 0%, #EFEBE9 40%, #ffffff 90%)', 'linear-gradient(to left, #EFEBE9 0%, #f8f0f0 70%)']
    },
   '中国航天蓝': {
         name: 'China Aerospace Blue',
        description: '深邃的蓝色主题，象征着中国航天事业的广阔和深远。',
        bor: '#0D47A1',
        tabBg: '#90CAF9',
        tabS: '#0D47A1',
        hovBg: '#E3F2FD',
        load: '#0D47A1',
      bg: ['linear-gradient(to bottom, #90CAF9 0%, #E3F2FD 50%,#ffffff 90%)', 'linear-gradient(to top, #E3F2FD 0%, #e0f8ff 70%)']
    },
    '北斗航天金': {
         name: 'Beidou Gold',
        description: '璀璨的金色主题，象征着北斗导航系统的精准和卓越。',
         bor: '#FFD700',
         tabBg: '#FFF8DC',
        tabS: '#FFD700',
       hovBg: '#FFFACD',
        load: '#FFD700',
       bg: ['linear-gradient(to right, #FFF8DC 0%, #FFFACD 40%,#ffffff 90%)', 'linear-gradient(to left, #FFFACD 0%,#fffaf0 70%)']
    },
    '复兴号蓝': {
         name: 'Fuxing Hao Blue',
         description: '现代的蓝色主题，象征着复兴号高铁的速度和创新。',
         bor: '#0052CC',
         tabBg: '#BBDEFB',
        tabS: '#0052CC',
         hovBg: '#E3F2FD',
        load: '#0052CC',
       bg: ['linear-gradient(to right bottom, #BBDEFB 0%,#E3F2FD 40%, #ffffff 90%)', 'linear-gradient(to left top, #E3F2FD 0%,#f0f8ff 70%)']
    },
    '機巧夢幻': {  // 蒸汽朋克风格，齿轮与幻想
        name: 'Steampunk Dream', //英文名更简洁
        description: '蒸汽朋克风格，以浅灰蓝为主色调，通过渐变背景和机械齿轮元素，营造复古工业氛围。',
        bor: '#546E7A', // 深灰蓝
        tabBg: '#90A4AE', // 浅灰蓝，主色调
        tabS: '#37474F', // 深灰，更沉稳
        hovBg: '#B0BEC5', // 悬停背景浅灰
        load: '#546E7A', // 加载条深灰蓝
        bg: [
            'linear-gradient(45deg, #90A4AE 0%, #E0E0E0 70%)', // 浅灰渐变，主色调
            'linear-gradient(-45deg, #B0BEC5 0%, #F5F5F5 50%)'  // 更浅灰渐变
        ]
    },
    '霊魂廻路': {  // 赛博庭院，灵魂与电子回路
        name: 'Cyber Soul Circuit', //英文名更贴切
        description: '赛博朋克风格，以洋红为主色调，通过霓虹渐变和电子回路图案，展现未来科技感。',
        bor: '#4A148C', // 深紫
        tabBg: '#9C27B0', // 洋红，主色调
        tabS: '#311B92', // 深紫，更沉稳
        hovBg: '#BA68C8', // 悬停背景亮紫
         load: '#4A148C', // 加载条深紫
        bg: [
            'linear-gradient(to bottom, #9C27B0 0%, #E1BEE7 50%)', // 紫红渐变，主色调
             'linear-gradient(to top, #BA68C8 0%, #F3E5F5 60%)'  // 浅紫渐变
        ]
    },
    '幽玄侘寂': {  // 日式侘寂风，古朴与宁静之美
        name: 'Wabi-Sabi Serenity', //英文名更传神
        description: '日式侘寂风格，以棕色为主色调，通过泥土色渐变和粗糙纹理，营造古朴宁静氛围。',
        bor: '#4E342E',   // 深棕
        tabBg: '#8D6E63', // 棕色，主色调
        tabS: '#3E2723', // 深棕，更沉稳
        hovBg: '#A1887F', // 悬停背景浅棕
         load: '#4E342E', // 加载条深棕
        bg: [
             'linear-gradient(to right, #8D6E63 0%, #BCAAA4 40%, #F5F5F5 80%)', // 棕色渐变，主色调
            'linear-gradient(to left, #A1887F 0%, #F0F0F0 70%)'  // 浅棕渐变
        ]
    },
    '月影流転': {  // 水墨风，月影流转，禅意
        name: 'Moonlit Ink Flow',  //英文名更具诗意
        description: '水墨风格，以灰蓝色为主色调，通过水墨晕染和宣纸纹理，展现月影流转的禅意。',
        bor: '#263238',   // 深灰
        tabBg: '#607D8B', // 灰蓝，主色调
        tabS: '#1A237E', // 深灰，更沉稳
        hovBg: '#90A4AE', // 悬停背景浅灰蓝
        load: '#263238', // 加载条深灰
        bg: [
            'linear-gradient(to bottom, #607D8B 0%, #CFD8DC 50%,#FAFAFA 80%)', // 灰蓝渐变，主色调
             'linear-gradient(to top, #90A4AE 0%, #F5F5F5 60%)' // 浅灰蓝渐变
        ]
    },
    '桜花飛沫': { // 和风浪漫，樱花飞舞，少女心
        name: 'Sakura Blossom Flutter', //英文名更浪漫
        description: '和风浪漫风格，以浅粉红为主色调，通过樱花花瓣渐变和柔和的线条，展现唯美柔情。',
        bor: '#E91E63', // 粉红
        tabBg: '#F8BBD0', // 浅粉红，主色调
         tabS: '#C2185B', // 深粉，更沉稳
        hovBg: '#FCE4EC',// 悬停背景更浅粉
         load: '#E91E63', // 加载条粉红
        bg: [
            'linear-gradient(to right, #F8BBD0 0%,#FCE4EC 50%,#FFFFFF 90%)', // 粉红渐变，主色调
             'linear-gradient(to left, #FCE4EC 0%,#F5F5F5 70%)'  // 浅粉渐变
        ]
    },
    '星河曼陀羅':{  // 星河，曼陀罗，神秘宇宙
        name: 'Cosmic Mandala', //英文名更神秘
        description: '宇宙星河风格，以紫色为主色调，通过星空渐变和曼陀罗图案，展现宇宙的神秘力量。',
        bor: '#311B92', // 深蓝紫
        tabBg: '#673AB7', // 紫色，主色调
        tabS: '#1A237E',// 深蓝紫，更沉稳
         hovBg: '#9575CD', // 悬停背景浅紫
        load: '#311B92', // 加载条深蓝紫
        bg: [
            'linear-gradient(to bottom, #673AB7 0%, #D1C4E9 50%,#FFFFFF 90%)', // 紫渐变，主色调
            'linear-gradient(to top, #9575CD 0%, #F0F0F8 60%)' // 浅紫渐变
        ]
    },
     '風鈴残響':{ //  风铃，残响，清凉夏日
        name: 'Wind Chime Echo',  //英文名更清新
         description: '风铃主题，以浅绿为主色调，通过清凉渐变和风铃图案，展现夏日的宁静与美好。',
        bor: '#00695C', // 深绿
         tabBg: '#4DB6AC', // 浅绿，主色调
         tabS: '#004D40', // 深绿，更沉稳
        hovBg: '#80CBC4', // 悬停背景浅绿
        load: '#00695C', // 加载条深绿
        bg: [
            'linear-gradient(to right, #4DB6AC 0%, #80CBC4 50%,#FFFFFF 90%)', // 浅绿渐变，主色调
            'linear-gradient(to left, #80CBC4 0%, #E0F7FA 70%)' // 更浅绿渐变
        ]
    },
    '古刹夕照':{  // 古刹，夕阳，宁静致远
         name: 'Temple Twilight',  //英文名更禅意
         description: '古刹主题，以浅棕色为主色调，通过夕阳渐变和古建筑图案，展现宁静致远的禅意。',
         bor: '#A1887F',   // 棕色
        tabBg: '#BCAAA4', // 浅棕，主色调
        tabS: '#795548', // 深棕，更沉稳
         hovBg: '#D7CCC8', // 悬停背景浅棕
        load: '#A1887F',  // 加载条棕色
        bg: [
           'linear-gradient(to bottom right, #BCAAA4 0%, #D7CCC8 50%,#FFFFFF 80%)', // 浅棕渐变，主色调
             'linear-gradient(to top left, #D7CCC8 0%,#F5F5F5 60%)' // 更浅棕渐变
        ]
    },
    '竹林清音':{  // 竹林，清音，宁静自然
        name: 'Bamboo Grove Serenade',  //英文名更清新
         description: '竹林主题，以绿色为主色调，通过竹叶渐变和柔和的光影，展现清幽宁静的自然风光。',
        bor: '#2E7D32', // 深绿
         tabBg: '#66BB6A',  // 绿色，主色调
        tabS: '#1B5E20', // 深绿，更沉稳
        hovBg: '#A5D6A7', // 悬停背景浅绿
        load: '#2E7D32', // 加载条深绿
        bg: [
           'linear-gradient(to right, #66BB6A 0%, #A5D6A7 40%,#FFFFFF 90%)',  // 绿渐变，主色调
            'linear-gradient(to left, #A5D6A7 0%,#E8F5E9 70%)' // 浅绿渐变
        ]
    },
'星条旗帜': {
        name: 'Stars and Stripes',
        description: '美国国旗主题，以浅蓝色和红色为主色调，通过红白蓝渐变和星条旗元素，展现自由精神。',
        bor: '#B22234',
        tabBg: '#000080',
        tabS: '#808080',
        hovBg: '#F0F8FF',
        load: '#B22234',
        bg: [
            'linear-gradient(to right, #B22234 55%, #FFFFFF 95%,#000080 35%), linear-gradient(to bottom, rgba(230, 230, 250, 0.2) 0%, rgba(240, 248, 255, 0.2) 50%)'
        ]
    },
    '枫叶之舞': {
        name: 'Maple Leaf Dance',
        description: '加拿大国旗主题，以白色和红色为主色调，通过红白渐变和枫叶图案，展现热情活力。',
        bor: '#FF0000',
        tabBg: '#FF0000',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#FF0000',
        bg: [
            'linear-gradient(to right, #FF0000 15%, #FFFFFF 55%, #FF0000 85%), linear-gradient(to top, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '日出之樱': {
        name: 'Rising Sun Sakura',
        description: '日本国旗主题，以白色和红色为主色调，通过红白渐变和日出图案，展现希望和美好。',
        bor: '#BC002D',
        tabBg: '#BC002D',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#BC002D',
        bg: [
            'radial-gradient(circle at center, #BC002D 30%, #FFFFFF 30%), linear-gradient(to left, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 70%)'
        ]
    },
     '三色鸢尾': {
        name: 'Tricolor Iris',
        description: '法国国旗主题，以白色、蓝色和红色为主色调，通过蓝白红渐变和鸢尾花图案，展现浪漫和优雅。',
        bor: '#00008B',
        tabBg: '#00008B',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#00008B',
         bg: [
            'linear-gradient(to right, #00008B 15%, #FFFFFF 40%, #FF4500 70%,#FFFFFF 95%), linear-gradient(to bottom, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '狮心金盾': {
        name: 'Lionheart Shield',
        description: '英国国旗主题，以白色、蓝色和红色为主色调，通过蓝白红渐变和狮子盾牌图案，展现权威和力量。',
        bor: '#000080',
        tabBg: '#000080',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#000080',
        bg: [
            'linear-gradient(to right, #000080 15%, #FFFFFF 40%, #C00000 70%,#FFFFFF 95%), linear-gradient(to top, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '热情桑巴': {
        name: 'Samba Fever',
        description: '巴西国旗主题，以绿色、黄色和蓝色为主色调，通过鲜艳渐变和桑巴元素，展现热情和活力。',
        bor: '#008000',
        tabBg: '#008000',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#008000',
         bg: [
            'linear-gradient(to right, #008000 15%, #FFFF00 40%, #0000FF 70%, #FFFFFF 95%), linear-gradient(to bottom left, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '猎豹之跃': {
        name: 'Leopard Leap',
        description: '南非国旗主题，以黑色、黄色和蓝色为主色调，通过大胆渐变和猎豹元素，展现野性和力量。',
        bor: '#000000',
        tabBg: '#000000',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#000000',
        bg: [
            'linear-gradient(to bottom right, #000000 15%, #FFFF00 35%,#0000FF 65% ,#FFFFFF 95%), linear-gradient(to top right, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '北欧极光': {
        name: 'Nordic Aurora',
        description: '北欧国旗主题，以白色、蓝色和红色为主色调，通过冷色渐变和极光图案，展现神秘和迷幻。',
        bor: '#00008B',
        tabBg: '#00008B',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#00008B',
         bg: [
            'linear-gradient(to bottom, #00008B 15%,#FFFFFF 40%,#C00000 70%, #FFFFFF 95%), linear-gradient(to left, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '赤道烈阳': {
        name: 'Equatorial Sun',
        description: '赤道国家国旗主题，以黄色、红色和黑色为主色调，通过暖色渐变和太阳图案，展现热情和活力。',
        bor: '#FFFF00',
        tabBg: '#FF0000',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#FFFF00',
        bg: [
            'linear-gradient(to right, #FFFF00 15%,#FF0000 55%,#000000 95%), linear-gradient(to top, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    },
    '神圣新月': {
        name: 'Sacred Crescent',
        description: '伊斯兰国家国旗主题，以绿色和白色为主色调，通过绿白渐变和新月图案，展现虔诚和信仰。',
        bor: '#008000',
        tabBg: '#008000',
        tabS: '#808080',
        hovBg: '#F0F0F0',
        load: '#008000',
         bg: [
            'linear-gradient(to right, #008000 15%, #FFFFFF 85%), linear-gradient(to bottom, rgba(240, 240, 240, 0.2) 0%, rgba(248, 248, 248, 0.2) 50%)'
        ]
    }
};
    const F=d=>{const y=d.getFullYear(),m=(d.getMonth()+1).toString().padStart(2,'0'),dd=d.getDate().toString().padStart(2,'0');return `${y}-${m}-${dd}`};
    const Gt=()=>{let m=GM_getValue('deduplicationMode','deduplicate'),f=GM_getValue('distinguishFloorMode','notDistinguish'),t=GM_getValue('historyType','all'),e=GM_getValue('theme','人民粉');return{m,f,t,e}};
    const Hg=u=>{if(u.includes("group/topic"))return'topic';if(u.includes("subject/")&&!u.includes("subject/topic/"))return'subject';if(u.includes("subject/topic/"))return'topic';if(u.includes("blog/"))return'blog';return null};
    const Sh=()=>{
        const t=document.title.replace(/ - Bangumi 番组计划$/,"").trim(),u=window.location.href,h=Hg(u);
        if(!h)return;
        let H=GM_getValue('bangumiHistory',[]),d=F(new Date),i={title:t,url:u,lastVisited:Date.now(),type:h},e=H.findIndex(i=>i.url===u&&F(new Date(i.lastVisited))===d);
        if(e!==-1){H[e].lastVisited=Date.now();H.unshift(H.splice(e,1)[0])}else{H.unshift(i)};
        if(H.length>100){H=H.slice(0,100)};
        GM_setValue('bangumiHistory',H)
    };
    const Dh=(p=1)=>{
        const{m,f,t,e}=Gt(),h=GM_getValue('bangumiHistory',[]);
        let H=Fl(h,t);
        H=Fs(H,m,f);
        const s=(p-1)*P,ee=s+P,c=H.slice(s,ee),$N=$(`#${N}`);
        $N.empty().append(`<div class="${G}"></div>`);
        setTimeout(()=>{
            let i=`<ul class="${L}">`;
            if(c.length===0){i+=`<li class="${I}">暂无浏览历史</li>`}else{
                c.forEach((it,idx)=>{
                    const v=new Date(it.lastVisited).toLocaleString(),u=f==='distinguish'?it.url:Gz(it.url,it.type),o=s+idx,og=Og(it.url,H,m,f);
                    i+=`<li class="${I}"><a href="${u}" style="word-break: break-word;" class="history-link" data-url="${u}">${it.title}</a>
                    <span style="font-size: smaller; color: grey;">(${v})</span>
                    <span class="delete-record" data-index="${o}" data-original-index="${og}" style="cursor: pointer; color: red;">×</span></li>`
                });
            }
            i+='</ul>';
            const tp=Math.ceil(H.length/P);
            if(tp>1){
                i+='<div style="margin-top: 10px;">';
                for(let j=1;j<=tp;j++){
                   if(j===p){i+=`<span>${j}</span> `}else{i+=`<a href="#" class="page-link" data-page="${j}">${j}</a> `};
               }
               i+='</div>'
           }
            i=Cs()+i;
            i+=Cm();
            i+=Ct();
            const oh=document.getElementById('bangumiHistory');
            if(oh){oh.remove()};
           $N.empty().append(i);
           const hl=document.querySelectorAll('.history-link');
           hl.forEach(l=>{l.addEventListener('click',e=>{e.preventDefault();window.open(e.target.dataset.url,'_blank')})});
           const pl=document.querySelectorAll('.page-link');
           pl.forEach(l=>{l.addEventListener('click',e=>{e.preventDefault();Dh(parseInt(e.target.dataset.page))})});
           const dl=document.querySelectorAll('.delete-record');
           dl.forEach(l=>{l.addEventListener('click',e=>{const oi=parseInt(e.target.dataset.originalIndex);let h=GM_getValue('bangumiHistory',[]);h.splice(oi,1);GM_setValue('bangumiHistory',h);Dh(p)})});
            Ad();
            Ab();
            At();
            Ap(e)
        },200);
    };
    const Og=(u,fh,m,f)=>{let oh=GM_getValue('bangumiHistory',[]);return oh.findIndex(i=>i.url===u)};
    const Cs=()=>{const {t}=Gt();return `<div style="margin-bottom: 10px;">显示类型：<select id="${V}"><option value="all" ${t==='all'?'selected':''}>全部</option><option value="topic" ${t==='topic'?'selected':''}>帖子</option><option value="subject" ${t==='subject'?'selected':''}>条目</option></select></div>`};
    const Ad=()=>{
        const ts=document.getElementById(V);
        ts.addEventListener('change',e=>{GM_setValue('historyType',e.target.value);Dh(1)})
    };
    const Cm=()=>{
        const{m,f}=Gt();
        return`<div style="margin-top: 10px;">去重模式：<select id="deduplicationModeSelect"><option value="notDeduplicate" ${m==='notDeduplicate'?'selected':''}>不去重</option><option value="deduplicate" ${m==='deduplicate'?'selected':''}>去重</option><option value="deduplicateToday" ${m==='deduplicateToday'?'selected':''}>去重(仅当天)</option></select>区分楼层：<select id="distinguishFloorModeSelect"><option value="notDistinguish" ${f==='notDistinguish'?'selected':''}>不区分</option><option value="distinguish" ${f==='distinguish'?'selected':''}>区分</option></select></div>`
    };
    const Ab=()=>{
        const ms=document.getElementById('deduplicationModeSelect'),fs=document.getElementById('distinguishFloorModeSelect');
        ms.addEventListener('change',e=>{GM_setValue('deduplicationMode',e.target.value);Dh(1)});
        fs.addEventListener('change',e=>{GM_setValue('distinguishFloorMode',e.target.value);Dh(1)});
    };
     const Ct=()=>{
         const{e}=Gt();
         let o='';
         for(const n in K){o+=`<option value="${n}" ${e===n?'selected':''}>${n}</option>`}
        return`<div style="margin-top: 10px;">主题：<select id="${E}">${o}</select></div>`
     };
    const At=()=>{
        const ts=document.getElementById(E);
        ts.addEventListener('change',e=>{GM_setValue('theme',e.target.value);Dh(1)})
    };
    const Ap=e=>{
         const t=K[e]||K['人民粉'];
         const setBackground = (element, bg) => {
             if (Array.isArray(bg)) {
                 element.css('background', bg[0]);
             } else if(typeof bg === 'string' && bg.startsWith('url(')){
                element.css('background-image', bg);
             } else{
                element.css('background',bg)
             }
         };

        GM_addStyle(`
            #${W} {
                 border: 1px solid ${t.bor};
                 ${Array.isArray(t.bg)?`background: ${t.bg[0]}`:`background-image: ${t.bg}`};
             }
              #${T} {
                 border-bottom: 1px solid ${t.bor};
                 background-color: ${t.tabBg};
            }
            #${N} {
               ${Array.isArray(t.bg)?`background: ${t.bg[1]}`:`background-image: ${t.bg}`};
            }
            .${A} {
                border-right: 1px solid ${t.bor};
                background-color: #fff;
            }
            .${A}:hover {
                 background-color: #f4f4f4;
             }
             .${A}.${S} {
                background-color: ${t.tabS};
                color: #fff;
            }
            .${I}:hover {
                background-color: ${t.hovBg};
            }
              .${G} {
                  border-top-color: ${t.load};
             }
        `);
    };
     const Gz=(u,t)=>{if(t==='topic'){const i=u.match(/\/(\d+)/)[1];return`https://bgm.tv/group/topic/${i}`}return u};
    const Fl=(h,t)=>{
        if(t==='all')return h;
        if(t==='topic')return h.filter(i=> /group\/topic\/\d+|subject\/topic\/\d+/.test(i.url));
        if(t==='subject')return h.filter(i=> /subject\/\d+$/.test(i.url));
        return h
    };
    const Fs=(h,m,f)=>{
         if(m==='notDeduplicate')return h;
        let r=[],d=F(new Date);
        h.forEach(i=>{
            const u=i.url,tp=i.type==='topic';
            let ti;
             if(tp){ti=u.match(/\/(\d+)/)[1]};
            const id=F(new Date(i.lastVisited));
             let isd=false;
            if(m==='deduplicate'){
               isd=r.some(fi=>{let fti;
                    if(fi.type==='topic'){fti=fi.url.match(/\/(\d+)/)[1]};
                   return(tp&&fti===ti)||fi.url===u})
            }else if(m==='deduplicateToday'){
                isd=r.some(fi=>{let fti;
                   if(fi.type==='topic'){fti=fi.url.match(/\/(\d+)/)[1]};
                   const fid=F(new Date(fi.lastVisited));
                   return((tp&&fti===ti)||fi.url===u)&&fid===d})
             }
             if(!isd){r.push(i)}
        });
         return r;
    };
    const Iu=()=>{
         const tabs={
            history:{
                name:"历史记录",
               func:Dh,
               params:{listClass:L,itemClass:I}
           }
       };
         Im(W,C,T,N);
        Id(D,M);
        It(tabs,M,T,N,A,B,S);
    };
    const Im=(W,C,T,N)=>{
        let m=$(`<div id="${W}"><div id="${C}"><ul id="${T}"></ul><div id="${N}"></div><button id="sedoruee_app_history_close_button" style="position: absolute; top: 5px; right: 5px;">关闭</button></div></div>`);
         $('body').append(m);
        m.hide();
        $(m).find(`#${C}`).click(()=>{return false});
        $(`#sedoruee_app_history_close_button`).click(()=>{ $(`#${W}`).hide()})
    };
    const Id=(D,M)=>{
    let d=$(`<li id="${D}"><a href="#">历史记录</a></li>`);
    d.find('a').click(e=>{e.preventDefault();$(`#${W}`).toggle();$($(`#${T} > li`)[0]).click()});
    d.insertAfter('#dock ul>li.first')
    };
     const Ot=(idx,S,T)=>{$(`.${S}`).removeClass(S);$($(`#${T} > li`)[idx]).addClass(S)};
    const It=(tabs,M,T,N,A,B,S)=>{
        let idx=0;
        for(const tab in tabs){
            let dm=$(`#${M}`),mt=$(`#${T}`),dt=$(`<li class="${B}">${tabs[tab].name}</li>`),wt=$(`<li class="${A}">${tabs[tab].name}</li>`);
            dm.append(dt);mt.append(wt);
            wt.click(()=>{Ot(idx,S,T);tabs[tab].func()});idx++
        }
    };
     const As=()=>{GM_addStyle(`
            #${W} {
                position: fixed;
               top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                 background-color: #fff;
                z-index: 10000;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                animation: fadeIn 0.3s ease;
               border-radius: 8px;
                overflow: hidden;
            }
             #${C} {
                width: 600px;
                 max-height: 400px;
                 overflow-y: auto;
             }
             #${T} {
                 list-style: none;
                 padding: 0;
                 margin: 0;
                overflow: hidden;
               border-radius: 8px 8px 0 0;
            }
             #${N} {
                border-radius: 0 0 8px 8px;
             }
             .${A} {
               float: left;
                 padding: 10px;
                 cursor: pointer;
                transition: background-color 0.3s ease;
                 background-color: #fff;
             }
           .${A}:hover {
             }
              .${A}.${S} {
                  color: #fff;
             }
           #${N} {
               padding: 10px;
           }
             .${L} {
                 list-style: none;
               padding: 0;
                 margin: 0;
             }
            .${I} {
                margin-bottom: 5px;
                 padding: 5px;
                 border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s ease;
            }
             .${I}:hover {
            }
             #${V} {
                margin-left: 5px;
                margin-right: 5px;
            }
              .${G} {
                 display: inline-block;
                 border: 3px solid rgba(184, 184, 184, 0.3);
               border-radius: 50%;
                width: 30px;
                 height: 30px;
               animation: spin 1s linear infinite;
                margin: 20px auto;
             }
            @keyframes spin {
                to { transform: rotate(360deg); }
             }
            @keyframes fadeIn {
                 from { opacity: 0; }
                to { opacity: 1; }
           }
       `)}
     As();
     Iu();
    let c=0,p=setInterval(()=>{const f=document.querySelector('.content .first');if(f){clearInterval(p);const d=document.getElementById(D);if(d)return;
        Sh()}},1000);
    setTimeout(()=>clearInterval(p),5000);

})();
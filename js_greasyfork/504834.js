// ==UserScript==
// @name         AO3 自用
// @author       urovom@游快厨
// @namespace    https://archiveofourown.org/works/58390339
// @version      0.6.1
// @description  自用
// @match        https://archiveofourown.org/*
// @icon         https://vi.ag925.top/download/ao3_content_filter_64x.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504834/AO3%20%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/504834/AO3%20%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// ===============【规则】===============

    const filterRules = [
        { type:'author', keywords:['haitun','RheaLightning','luna2410','Essenae','Sefira_Magician','tinfies','0bviousLeigh','seventhstar','Piglin_agro','Penguins_With_Hats','ida_jpeg','raheliopolis','link6yansky','gooseberry9811','LunariaElongata'], replace:'已屏蔽作者', color:'#CC0000', caseCheck:'true' },
        { type:'author', keywords:['banche','Yuin'], replace:'不看原作就写同人的', color:'#808080', caseCheck:'true' },
        { type:'character', keywords:['Tenjou Kaito (Yu-Gi-Oh! ARC-V)'], replace:'带姓氏的ARC-V快斗写法', color:'#6666BB', caseCheck:'false' },
        { type: 'relationship', keywords: ['/Tsukumo Yuuma/','ight/Tsukumo Y','ight/Yuma T','ight/Yuuma T','Alit/Tsukumo Y','Alit/Yuuma','Alit/Yuma','Yuusaku/Tsukumo Y','ga/Tsukumo Y','Kotori/Tsukumo Y','Kotori/Yuma','Kotori/Yuuma','uma/Mizuki','a Tsukumo/Kotori','Fuuya/Tsukumo Y','Yuya/Tsukumo Y','Astral/Tsukumo Y','Ryou/Tsukumo Y','Cathy/Tsukumo Y','Nasch/Tsukumo Y','Durbe/Tsukumo Y','Rah/Tsukumo Y','Eliphas/Tsukumo Y','Gauche/Tsukumo Y','Gilag/Tsukumo Y','uma/Vector','Vector/Tsukumo Y','Rio/Tsukumo Y','Kamishiro/Tsukumo Y','Kamishiro Ryouga/Tsukumo Yuuma','Kastle/Yuma','Daisuke/Tsukumo Y','Anna/Tsukumo Y','Kakeru/Tsukumo Y','Yuuma/Manjo','Mizael/Tsukumo Y','Nasch/Tsukumo Y','Dragon/Tsukumo Y','Mist/Tsukumo Y','(Undertale)/Tsukumo Y','Rei/Tsukumo Y','遊馬/真月','shingetsu/yuuma','Tetsuo/Tsukumo Y','Takashi/Tsukumo Y','Akari/Tsukumo Y','Haru/Tsukumo Y','Yuuma/Everyone','Yuuma/Original Character(s)','Yuuma/Others','Yuuma/Reader','uma/Vector','uma/Shingetsu','贝库塔/九十九游马','九十九遊馬／ベクター','九十九游马/贝库塔','游贝库','贝库游','Yuuma x Vector','Vector/Yuuma',' x Yuuma','Foilshipping','Positiveshipping','vector/yuuma','Yuuma/Yami Yuugi','Yuuma/Yamikawa','Yuuma/Yuatsu','Yuuma/Yuri'], replace: '九十九游马相关拆', color: '#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Homura Takeru/Tenjou Kaito','Kaiba Seto/Tenjou Kaito','Fudou Yuusei/Tenjou Kaito','Ryouken/Tenjou Kaito'], replace:'天城快斗 弱智Crossover CP', color:'#BB6666', caseCheck:'false' },
        { type:'tag', keywords:['Mackfield/Tenjou K','Phoenix/Tenjou K','Ruri/Tenjou K','Shun/Tenjou K',' Kaito/Yuri',' Kaito/Zarc',' Kaito/Tenjouin A'], replace:'A5 CP用ZEXAL天城快斗的名', color:'#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Droite/Tenjou K','Rio/Tenjou K',' Kaito/Kamishiro Rio','Kotori/Tenjou K',' Kaito/Tsukumo A'], replace:'天城快斗 ZEXAL内BG', color:'#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Tenjou Kaito/Original','Tenjo Kaito/Original'], replace:'天城快斗/原创角色', color:'#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Tenjou Kaito/Other','Tenjo Kaito/Other'], replace:'天城快斗/Others', color:'#BB6666', caseCheck:'false' },
        { type:'tag', keywords:['/Tenjo Kaito/','/Tenjou Kaito/'], replace:'天城快斗多人关系', color:'#BB6666', caseCheck:'false' },
        { type:'tag', keywords:['Tenjou Kaito/Reader','Tenjou Kaito/You'], replace:'天城快斗梦向', color:'#BB6666', caseCheck:'false' },
        { type: 'relationship', keywords: ['Astral/Tenjou K','ga/Tenjou K','ga/Tenjo K','ga Kamishiro/Kaito T','Mizael/Tenjou K','ight/Tenjou K','ight/Tenjo K','ight/Kaito','ight/Kite','Heartland/Tenjou K','Haruto/Tenjou K',' Kaito/Tenjou H','Haruto/Tenjo K',' Kaito/Tenjo H','Hart Tenjo/Kite','Tenjo/H','Haruto Tenjou/Kaito T','Tenjou/H','Haruto Tenjo/Kaito T','Nasch/Tenjou K','Kaninja/Tenjou K','Shark Drake/Tenjou K',' Kaito/Todoroki',' Kaito/Tron',' Kaito/Vector','V/Tenjou K','V/Tenjo K','V/Kite T','V/Kaito T','Kaito/V','Kaito Tenjo/V','Kaito Tenjou/V','Kite Tenjo/V','V快'], replace: '天城快斗相关拆', color: '#BB6666', caseCheck:'false' },
        { type:'title', keywords:['遊アス','ゆまアス','游阿斯','游凌','遊凌','ゆまシャ','游贝库','遊ベク','ゆまベク','游Ⅲ','游III','遊Ⅲ','遊III','ゆまⅢ','ゆまIII','遊ハル','ゆまハル','凌游','凌遊','シャゆま','贝库游','ベク遊','ベクゆま','アス遊','アスゆま','Ⅲ游','III游','Ⅲ遊','III遊','ハル遊','ハルゆま','阿斯游','All游','ゆま右','右ゆま','ゆま受','游马右','遊馬右','游马受','遊馬受'], replace:'九十九游马相关拆', color:'#BB6666', caseCheck:'false' },
        { type:'summary', keywords:['遊アス','ゆまアス','游阿斯','游凌','遊凌','ゆまシャ','游贝库','遊ベク','ゆまベク','游Ⅲ','游III','遊Ⅲ','遊III','ゆまⅢ','ゆまIII','遊ハル','ゆまハル','凌游','凌遊','シャゆま','贝库游','ベク遊','ベクゆま','アス遊','アスゆま','Ⅲ游','III游','Ⅲ遊','III遊','ハル遊','ハルゆま','阿斯游','All游','ゆま右','右ゆま','ゆま受','游马右','遊馬右','游马受','遊馬受'], replace:'九十九游马相关拆', color:'#BB6666', caseCheck:'false' },
        { type:'title', keywords:['游A','游阳','A游','阳游'], replace:'易引发误解的游马CP关键词', color:'#BB6666', caseCheck:'false' },
        { type:'summary', keywords:['游A','游a','游阳','A游','阳游'], replace:'易引发误解的游马CP关键词', color:'#BB6666', caseCheck:'false' },
        { type:'title', keywords:['快凌','カイ凌','快Ｖ','カイＶ','カイクリ','快麦','快米','カイミザ','快Ⅳ','快IV','快ＩＶ','カイⅣ','カイIV','カイＩＶ','カイハル','快V','カイV','快阳'], replace:'天城快斗左相关', color:'#BB6666', caseCheck:'false' },
        { type:'summary', keywords:['快凌','カイ凌','快Ｖ','カイＶ','カイクリ','カイブイ','快麦','快米','カイミザ','快Ⅳ','快IV','快ＩＶ','カイⅣ','カイIV','カイＩＶ','カイハル','快V','カイV','快阳'], replace:'天城快斗左相关', color:'#BB6666', caseCheck:'false' },
        { type:'title', keywords:['凌カイ','凌快','Ｖ快','Ｖカイ','クリカイ','ブイカイ','麦快','米快','ミザカイ','Ⅳ快','IV快','Ⅳカイ','IVカイ','贝库快','ベクカイ','ハルカイ','隼快','隼カイ','カイト右','カイ受','カイト受'], replace:'天城快斗右警告', color:'#CC0000', caseCheck:'false' },
        { type:'summary', keywords:['凌カイ','凌快','Ｖ快','Ｖカイ','クリカイ','ブイカイ','麦快','米快','ミザカイ','Ⅳ快','IV快','Ⅳカイ','IVカイ','贝库快','ベクカイ','ハルカイ','隼快','隼カイ','カイト右','カイ受','カイト受'], replace:'天城快斗右警告', color:'#CC0000', caseCheck:'false' },
        { type:'title', keywords:['V快','Vカイ','阳快','天城兄弟','斗右','斗受','All快'], replace:'易引发误解的天城快斗右关键词', color:'#CC0000', caseCheck:'false' },
        { type:'summary', keywords:['V快','Vカイ','阳快','天城兄弟','斗右','斗受','All快'], replace:'易引发误解的天城快斗右关键词', color:'#CC0000', caseCheck:'false' },
        { type:'title', keywords:['快游','カイ遊', '快遊','カイゆま'], replace:'逆CP', color:'#BB6666', caseCheck:'false' },
        { type:'tag', keywords:['快游','カイ遊','カイゆま'], replace:'逆CP', color:'#BB6666', caseCheck:'false' },
        { type:'summary', keywords:['快游','カイ遊','カイゆま'], replace:'逆CP', color:'#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Tenjou Kaito/Tsukumo Yuuma', 'K\\w+Tenjo/Yuma Tsukumo', 'Yuma Tsukumo/Kaito Tenjo'], replace:'Yuma/Kaito 其他tag拼写', color:'#6666BB', caseCheck:'false' },
        { type:'title', keywords:['亮艾','亮爱德','十艾','十爱德'], replace:'热门小艾右', color:'#BB6666', caseCheck:'false' },
        { type:'tag', keywords:['亮艾','亮爱德','十艾','十爱德'], replace:'热门小艾右', color:'#BB6666', caseCheck:'false' },
        { type:'summary', keywords:['亮艾','亮爱德','十艾','十爱德'], replace:'热门小艾右', color:'#BB6666', caseCheck:'false' },
        { type:'relationship', keywords:['Edo Phoenix/Marufuji Ryou','Ryo/Edo','Ryou/Edo','Truesdale/Edo','Proshipping','Ryou/Phoenix','RyouEdo','Victoryshipping','Truesdale/Aster'], replace:'艾亮艾', color:'6666BB', caseCheck:'false'}
    ];

    // ==========================================

	// =============【用户名白名单】=============
	// 默认跳过检测
    const excludeAuthors = ['urovom'];
    // ==========================================

    function filterContent() {
        const works = document.querySelectorAll('.blurb');

        works.forEach(work => {

			//检查用户名是否在白名单中
			const authorLink = work.querySelector('a[rel="author"]');
			const authorHref = authorLink ? authorLink.getAttribute('href') : '';
			if (excludeAuthors.some(author => authorHref.includes(`/${author}/`))) {
				return;
			}

            let replaceTexts = [];
            let found = new Set();
            const originalContent = {
                header: work.querySelector('.header.module')?.outerHTML || '',
                tags: work.querySelector('.tags.commas')?.outerHTML || '',
                summary: work.querySelector('.userstuff.summary')?.outerHTML || '',
                stats: work.querySelector('.stats')?.outerHTML || '',
            };

            // 读取语言信息
            const languageElement = work.querySelector('.stats .language + dd.language');
            const languageText = languageElement ? languageElement.innerText : '';
            const languageDisplay = createLanguageInfo('Language: ', languageText, '#AAAAAA');

        filterRules.forEach(rule => {

            let keywords = rule.keywords;
            if (rule.type !== 'author') {
                rule.keywords = rule.keywords.map(keyword => {
                    if (rule.caseCheck === 'false') {
                        keyword = new RegExp(keyword, 'i');
                    } else {
                        keyword = new RegExp(keyword);
                    }
                    return keyword;
                });
            }

            if (found.has(rule.replace)) return;

            switch (rule.type) {
                case 'author': {
                    if (authorHref && rule.keywords.some(keyword => authorHref.includes(`/${keyword}/`))) {
                        replaceTexts.push(createReplaceText('Author: ', rule.replace, rule.color));
						found.add(rule.replace);
                    }
                    break;
                }
                case 'title': {
                    const titleText = work.querySelector('h4.heading a');
                    if (titleText && rule.keywords.some(keyword => keyword.test(titleText.innerText))) {
                        replaceTexts.push(createReplaceText('Title: ', rule.replace, rule.color));
                        found.add(rule.replace);
                        return;
                    }
                    break;
                }
                case 'tag': {
                    const tagsAll = work.querySelectorAll('.tags .tag');
                    for (const tag of tagsAll) {
                        if (rule.keywords.some(keyword => keyword.test(tag.innerText))) {
                            replaceTexts.push(createReplaceText('Tags: ', rule.replace, rule.color));
                            found.add(rule.replace);
                            return;
                        }
                    }
                    break;
                }
                case 'character': {
                    const tagsChara = work.querySelectorAll('.tags .characters .tag');
                    for (const tag of tagsChara) {
                        if (rule.keywords.some(keyword => keyword.test(tag.innerText))) {
                            replaceTexts.push(createReplaceText('Characters: ', rule.replace, rule.color));
                            found.add(rule.replace);
                            return;
                        }
                    }
                    break;
                }
                case 'relationship': {
                    const tagsRelation = work.querySelectorAll('.tags .relationships .tag');
                    for (const tag of tagsRelation) {
                        if (rule.keywords.some(keyword => keyword.test(tag.innerText))) {
                            replaceTexts.push(createReplaceText('Relationships: ', rule.replace, rule.color));
                            found.add(rule.replace);
                            return;
                        }
                    }
                    break;
                }
                case 'summary': {
                    const summaryText = work.querySelector('.userstuff.summary')?.innerText;
                    if (summaryText && rule.keywords.some(keyword => keyword.test(summaryText))) {
                        replaceTexts.push(createReplaceText('Summary: ', rule.replace, rule.color));
                        found.add(rule.replace);
                        return;
                    }
                    break;
                }
            }
        });

            if (replaceTexts.length > 0) {
                work.innerHTML = '';
                replaceTexts.forEach(text => {
                    work.appendChild(text);
                });

                // 添加语言信息
                if (languageText) {
                    work.appendChild(languageDisplay);
                }

                // 添加按钮
                const buttonContainer = document.createElement('div');
                buttonContainer.style.margin = '1em 0.5em 0.5em';

                const moreButton = document.createElement('span');
                moreButton.innerText = 'more';
                moreButton.style.color = '#CCCCCC';
                moreButton.style.fontWeight = 'bold';
                moreButton.style.cursor = 'pointer';
                moreButton.style.display = 'block';
                buttonContainer.appendChild(moreButton);

                const buttonGroup = document.createElement('div');
                buttonGroup.style.display = 'none';
                buttonGroup.style.marginTop = '0.5em';

                const buttons = [
                    { text: 'Header', content: originalContent.header },
                    { text: 'Tags', content: originalContent.tags },
                    { text: 'Summary', content: originalContent.summary },
                    { text: 'Stats', content: originalContent.stats },
                    { text: 'Show All', content: originalContent.header + originalContent.tags + originalContent.summary + originalContent.stats },
                ];

                buttons.forEach(buttonInfo => {
                    const button = document.createElement('button');
                    button.innerText = buttonInfo.text;
                    button.style.width = '5em';
                    button.style.margin = '0.2em';
                    button.style.border = '1px solid #808080';
                    button.style.padding = '2px';
                    button.style.cursor = 'pointer';
                    button.style.borderRadius = '0';
                    button.style.background = '#F6F6FF';

                    button.addEventListener('click', () => {
                        const existingContent = work.querySelector('.original-content');

                        if (existingContent && existingContent.innerHTML === buttonInfo.content) {
                            existingContent.remove();
                        } else {
                            if (existingContent) {
                                existingContent.remove();
                            }
                            if (buttonInfo.content) {
                                const contentDiv = document.createElement('div');
                                contentDiv.className = 'original-content';
                                contentDiv.innerHTML = buttonInfo.content;
                                work.appendChild(contentDiv);
                            }
                        }
                    });

                    buttonGroup.appendChild(button);
                });

                moreButton.addEventListener('click', () => {
                    if (buttonGroup.style.display === 'none') {
                        buttonGroup.style.display = 'block';
                    } else {
                        buttonGroup.style.display = 'none';
                        const existingContents = work.querySelectorAll('.original-content');
                        existingContents.forEach(content => content.remove());
                    }
                });

                buttonContainer.appendChild(buttonGroup);
                work.appendChild(buttonContainer);
            }
        });
    }

	// 生成提示句
    function createReplaceText(prefix, replace, color) {
        const p = document.createElement('p');
        p.style.margin = '1em 0 0.5em';
        p.style.fontWeight = 'bold';

        const prefixSpan = document.createElement('span');
        prefixSpan.style.color = color;
        prefixSpan.innerText = prefix;

        const replaceSpan = document.createElement('span');
        replaceSpan.style.color = color;
        replaceSpan.innerText = replace;

        p.appendChild(prefixSpan);
        p.appendChild(replaceSpan);

        return p;
    }

	// 显示语言
    function createLanguageInfo(prefix, content, color) {
        const p = document.createElement('p');
        p.style.margin = '1em 0 0.5em';
        p.style.fontWeight = 'bold';
        p.style.color = color;
        p.innerText = prefix + content;
        return p;
    }

    // 当页面加载时执行过滤函数
    window.addEventListener('load', filterContent);
})();
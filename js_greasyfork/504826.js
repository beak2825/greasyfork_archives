// ==UserScript==
// @name         AO3 关键词检测&折叠 | AO3 Keyword Detection & Collapse
// @author       ghostupload
// @namespace    urovom@游快贴贴
// @version      0.6
// @description  在指定位置检测关键词，折叠对应内容，并显示相应代替语句。v0.6支持开关大小写匹配、支持关键词正则表达式。
// @match        https://archiveofourown.org/*
// @icon         https://vi.ag925.top/download/ao3_content_filter_64x.ico
// @license      MIT
// @grant        none
// @AO3publish   https://archiveofourown.org/chapters/148721791
// @downloadURL https://update.greasyfork.org/scripts/504826/AO3%20%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%B5%8B%E6%8A%98%E5%8F%A0%20%7C%20AO3%20Keyword%20Detection%20%20Collapse.user.js
// @updateURL https://update.greasyfork.org/scripts/504826/AO3%20%E5%85%B3%E9%94%AE%E8%AF%8D%E6%A3%80%E6%B5%8B%E6%8A%98%E5%8F%A0%20%7C%20AO3%20Keyword%20Detection%20%20Collapse.meta.js
// ==/UserScript==

(function() {
    'use strict';

	// ！！！请自定义修改此处折叠规则！！！
	// 自定义：检测位置(type)、关键词(keywords)、提示词(replace)、提示词颜色(color)、大小写检测(caseCheck)。

	// 检测位置：
	// 用户名(author)、作品标题(title)、所有标签(tag)、角色标签(character)、关系标签(relationship)、作品摘要(summary)。
	// 其中用户名为精准匹配，可设置白名单

	// 关键词：
	// 支持部分正则表达式，如'Original \\w+ Character' 将匹配任何 'Original ... Character'

	// 大小写检测：
	// caseCheck设置为true则匹配大小写，设置为false则无视大小写进行匹配。

	// ===============【规则】===============

    const filterRules = [
        { type:'author', keywords:['用户名A','用户名B'], replace:'已屏蔽用户', color:'#FF0000', caseCheck:'true' },
        { type:'title', keywords:['甲乙','乙甲'], replace:'甲乙甲', color:'#AA3333', caseCheck:'true' },
        { type:'tag', keywords:['Everyone loves'], replace:'无视大小写的万人迷tag！', color:'#AA00AA', caseCheck:'false' },
        { type:'character', keywords:['Original Character','Original \\w+ Character'], replace:'任何原创角色', color:'#3333AA', caseCheck:'false' },
        { type:'relationship', keywords:['Original Character','Original \\w+ Character'], replace:'任何原创角色参与CP', color:'#AA3333', caseCheck:'false' },
        { type:'summary', keywords:['甲乙','乙甲'], replace:'甲乙甲', color:'#AA3333', caseCheck:'true' },
        { type:'author', keywords:['ghostupload'], replace:'一只野生的插件作者', color:'#238080', caseCheck:'true' },
    ];

    // ==========================================

	// =============【用户名白名单】=============
	// 默认跳过检测
    const excludeAuthors = ['ghostupload', 'ghostuploader'];
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
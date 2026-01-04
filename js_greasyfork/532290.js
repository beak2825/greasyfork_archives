// ==UserScript==
// @name          学习助手
// @namespace     https://zac.social/
// @version       0.4.0
// @description   学习通测试成绩查看，批改网解除复制粘贴限制及作文提示生成。
// @author        zac517
// @match         *://*/*
// @icon          https://one.hfut.edu.cn/favicon.ico
// @run-at        document-start
// @grant         unsafeWindow
// @grant         GM_setClipboard
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @require       https://update.greasyfork.org/scripts/537952/1599500/%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%E6%A0%B8%E5%BF%83%E7%BB%84%E4%BB%B6.js
// @resource      CORE_CSS https://raw.githubusercontent.com/zac517/studyTool/refs/heads/main/core.css
// @downloadURL https://update.greasyfork.org/scripts/532290/%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532290/%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const window = unsafeWindow;
    const css = GM_getResourceText('CORE_CSS');
    GM_addStyle(css);
    

    const siteConfigs = {
        'mooc1.chaoxing.com': {
            site: {
                onPageLoaded: function() {
                    const requiredParams = ['courseid', 'clazzid', 'cpi'];
                    function generateNewUrl() {
                        const urlParams = new URLSearchParams(window.location.search);
                        const params = requiredParams.reduce((acc, param) => {
                            const value = urlParams.get(param);
                            if (value) acc[param] = value;
                            return acc;
                        }, {});
                        if (requiredParams.every(param => params[param])) {
                            const newParams = new URLSearchParams();
                            for (const key in params) {
                                if (params.hasOwnProperty(key)) newParams.append(key, params[key]);
                            }
                            newParams.append('ut', 's');
                            return `https://stat2-ans.chaoxing.com/exam-stastics/index?${newParams.toString()}`;
                        }
                        return null;
                    }
                    function createJumpButton() {
                        const newUrl = generateNewUrl();
                        if (!newUrl) return;
                        const button = document.createElement('a');
                        button.href = '#'; button.target = '_blank';
                        button.className = 'jb_btn jb_btn_104 createTopic fl fs14 marginRight30 ';
                        button.style.cssText = `z-index: 999; width: 104px; height: 36px; background: url(https://groupweb.chaoxing.com/res/course/images/discuss/jb_btn_104.png) no-repeat 0 0; position: relative; top: -29px; float: right;`;
                        button.textContent = '查看成绩';
                        button.addEventListener('click', (e) => {
                            e.preventDefault();
                            window.open(newUrl, '_blank');
                        });
                        const topBackElement = document.querySelector('.top-back');
                        if (topBackElement) topBackElement.appendChild(button);
                    }
                    createJumpButton();
                }
            }
        },
        'www.pigai.org': {
            'c=v2&a=write': {
                site: {
                    onScriptLoaded: {
                        'script[src*="/res/javascript/spss.js"]': {
                            callback: (node, site) => { 
                                window.init_no_paste = () => false; 
                            },
                            times: 1,
                        }
                    },
                    onPageLoaded: function() {
                        const node = document.querySelector('#request_y');
                        if (node) {
                            node.unselectable = 'off';
                            node.onselectstart = null;
                        }
                        const childNode = document.querySelector('.no_paste > div');
                        if (childNode) childNode.style.cssText = '';
                    }
                }
            },
            'c=v2&a=view': {
                site: {
                    values: {
                        score: 0,
                    },
                    config: {
                        '分数': { type: 'switch', value: true },
                        '评语': { type: 'switch', value: true },
                        '按句点评': { type: 'switch', value: true },
                        '复制提示词': {
                            type: 'button',
                            callback: function(site) { 
                                const finalString = site.genPromptFromPage();
                                GM_setClipboard(finalString, 'text');
                            }
                        },
                    },
                    genPromptFromPage: function() {
                        let result = [];
                        const cfg = this.config;

                        if (cfg['分数'].value) {
                            result.push(`当前作文分数为 ${this.values.score}。`);
                        }
                        if (cfg['评语'].value) {
                            const commentElement = document.getElementById('allpingyu_txt');
                            const articleComment = commentElement ? commentElement.textContent.trim() : '';
                            if (articleComment) result.push(`作文评语为：${articleComment}。`);
                        }
                        if (cfg['按句点评'].value) {
                            const elements = document.querySelectorAll('.view3Item:not(.view3duan)');
                            let totalString = '';
                            elements.forEach(element => {
                                const sentenceNumber = element.querySelector('.view3xh')?.textContent.trim() || '';
                                const sentenceContent = element.querySelector('.view3Sent .sentTxt')?.textContent.trim() || '';
                                const errorItems = Array.from(element.querySelectorAll('.view3Error li.error, .view3Error li.warn'));
                                let relevantComments = [];
                                errorItems.forEach(item => {
                                    let commentText = Array.from(item.childNodes).filter(node => node.nodeType === Node.TEXT_NODE || (node.nodeType === Node.ELEMENT_NODE && !node.matches('.stips, .snt_info'))).map(n => n.textContent).join('');
                                    relevantComments.push(commentText.trim().replace(/[\t\n]/g, ''));
                                });
                                if (relevantComments.length > 0) {
                                    totalString += `${sentenceNumber} ${sentenceContent}\n 点评：\n${relevantComments.join('\n')}\n\n`;
                                }
                            });
                            if (totalString) result.push(`可改进的句子如下：\n${totalString.trim()}`);
                        }
                        const finalPrompt = result.join('\n')
                            + `\n\n注意：\n1. 网站给出的点评虽然说是让你检查，但实际上你不修改他就会一直扣分，所以无论你觉得对不对，一定要想办法修改。\n2. 点评中，所有提到存在拼写有误的地方，如果点评中给出了具体的修改方案就按给出的方案改，没有就自己改。\n3. 作文的评分系统是通过识别每个词实现的，所以被他指出有问题的词，就算你觉得没问题，为了得到更高的分也必须修改，否则会一直被指出。\n4. 如果你觉得难以改正，就尝试换成其他意思相近的表达（不能还含有原被指出的拼写）。\n5. 作文中应只使用英文，绝对不能出现中文，即使是在引用中文词语或俗语。\n6. 回答时，英语作文使用英语回答，要给出修改后的完整文章，不省略不修改的部分。\n7. 回答时，提供的其他信息（比如向我解释修改了哪些内容）必须使用中文给出。\n请跟据以上相关信息和要求进行修改，提高作文的分数。`;
                        return finalPrompt;
                    },
                    onScriptLoaded: {
                        'script[src*="/res/javascript/view.js"]': {
                            callback: (node, site) => { 
                                window.init_no_paste_by_snt = () => false; 
                            },
                            times: 1,
                        },
                    },
                    onElementAdded: {
                        'b#rescoreTxt': {
                            callback: (node, site) => { 
                                site.values.score = node.innerText; 
                            },
                            times: 1,
                        },
                    },
                }
            }
        }
    };

    core(siteConfigs);
})();

// ==UserScript==
// @name         Bangumi-AddRelatedPerson-On-EditDetailPage
// @name:zh-CN  班固米编辑页同步关联
// @author       BlingBling
// @namespace    https://bgm.tv/user/chiefmagician
// @version      0.1.0
// @description  在编辑条目页面和新增条目页面也能同步进行关联行为
// @match        *://bgm.tv/*
// @match        *://chii.in/*
// @match        *://bangumi.tv/*
// @exclude     /(person|character)\/(\d+|new)(\/.*)?/
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/521935/Bangumi-AddRelatedPerson-On-EditDetailPage.user.js
// @updateURL https://update.greasyfork.org/scripts/521935/Bangumi-AddRelatedPerson-On-EditDetailPage.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', async () => {
        const pendingRelationData = localStorage.getItem('pendingRelationData');
        if (!pendingRelationData) return;
        let existingInfoArr = await getExistingInfoArr();
        let existingInfos = existingInfoArr.map(item => `${item.prsnPos}-${item.prsn_id}`);
        let pendingParams = new URLSearchParams(pendingRelationData);
        let pendingInfoArr = [];
        pendingParams.forEach((value, key) => {
            const match = key.match(/infoArr\[(\S+)\]\[(prsnPos|prsn_id)\]/);
            if (match) {
                const index = match[1];
                const field = match[2];
                if (!pendingInfoArr[index]) pendingInfoArr[index] = {};
                pendingInfoArr[index][field] = value;
            }
        });
        let pendingInfos = Object.values(pendingInfoArr).map(item => `${item.prsnPos}-${item.prsn_id}`);
        let newPending = pendingInfos.some(info => !existingInfos.includes(info)) || existingInfos.some(info => !pendingInfos.includes(info));
        const currentUrl = window.location.href;
        const match = currentUrl.match(/\/subject\/(\d+)/);
        if (match && newPending) {
            const userConfirmed = confirm('咪咕…数据被吃掉了，要重新关联当前条目吗？');
            if (!userConfirmed) {
                localStorage.removeItem('pendingRelationData');
                return;
            }
            const subjectId = match[1];
            const relatedUrl = `/subject/${subjectId}/add_related/person`;
            await submitRelationData(relatedUrl, pendingRelationData);
            location.reload();
        } else if (match && !newPending) {
            localStorage.removeItem('pendingRelationData');
            document.getElementById("robot_speech").innerHTML = "咪~已经紧紧地将一切关联住啦～";
            document.getElementById("robot").style.cssText = "transition: opacity 5.5s; opacity: 1;";
        }
    });

    async function submitRelationData(url, relationData) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: relationData,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            if (!response.ok) {
                return false;
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    async function getExistingInfoArr() {
        try {
            const response = await fetch(window.location.pathname.replace(/\/subject\/(\d+)(\/.*)?/, '/subject/$1/add_related/person'));
            if (response.ok) {
                const text = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, 'text/html');
                const form = doc.querySelector('form[name="add_related"]');
                let infoArr = [];
                if (form) {
                    const infoArrInputs = form.querySelectorAll('[name^="infoArr"]');
                    infoArrInputs.forEach(input => {
                        const match = input.name.match(/^infoArr\[(\d+)\]\[(\w+)\]$/);
                        if (match) {
                            const index = match[1];
                            const key = match[2];
                            const value = input.value;
                            if (!infoArr[index]) {
                                infoArr[index] = {};
                            }
                            infoArr[index][key] = value;
                        }
                    });
                }
                return infoArr;
            }
            return [];
        } catch (error) {
            alert('咪咕…数据获取出错啦', error);
            return [];
        }
    }

    const SPLIT_RULE = /[()\[\]{}（）<>《》「」『』【】+×·→/／、,，;；:：&＆\\\/]/;
    const FILTER_WORDS = [/^CV$/i, /^feat$/i, /^\*$/i, /^网漫$/i, /^实体书$/i, /^制作$/i];

    const originalMenuInner = document.querySelector('.menu_inner');
    if (originalMenuInner) {
        const newMenuInner = document.createElement('div');
        newMenuInner.className = 'menu_inner';
        newMenuInner.setAttribute('align', 'left');
        const syncContainer = document.createElement('div');
        syncContainer.style.paddingTop = '5px';
        const syncTitle = document.createElement('div');
        syncTitle.textContent = '同步关联以下人物？';
        syncTitle.style.fontWeight = 'bold';
        syncContainer.appendChild(syncTitle);
        const syncContent = document.createElement('div');
        syncContent.style.marginTop = '5px';
        syncContainer.appendChild(syncContent);
        newMenuInner.appendChild(syncContainer);
        if (/\/(edit_detail|new_subject)/.test(window.location.href)) {
            originalMenuInner.parentNode.appendChild(newMenuInner);
        }
        newMenuInner.style.display = 'none';

        document.addEventListener('click', async function(event) {
            const target = event.target;
            if (target.matches('.inputBtn[name="submit"]')) {
                const submitSuccess = await SaveRelationData();
                const originalOnClick = target.onclick;
                if (originalOnClick) {
                    originalOnClick.call(this, event);
                }
            }
        });

        const targetContainer = document.querySelector('table.settings small');
        if (targetContainer) {
            const link = document.createElement('a');
            link.href = "javascript:void(0)";
            link.className = 'l';
            link.textContent = '[关联查找]';
            link.onclick = () => {
                link.style.pointerEvents = 'none';
                link.style.color = 'gray';
                link.textContent = '[呀！冷却中...]';
                if (nowmode === 'normal') {
                    NormaltoWCODE();
                    window.editandrelateEntry();
                    WCODEtoNormal();
                } else if (nowmode === 'wcode') {
                    window.editandrelateEntry();
                    WCODEtoNormal();
                }
                setTimeout(() => {
                    link.style.pointerEvents = 'auto';
                    link.style.color = '';
                    link.textContent = '[关联查找]';
                }, 5000);
            };
            targetContainer.appendChild(link);
        }

        async function parsePrsnStaffList() {
            try {
                const typeMapping = {
                    book: [1, '书籍'],
                    music: [3, '音乐'],
                    game: [4, '游戏'],
                    anime: [2, '动画'],
                    real: [6, '三次元'],
                };
                const focusText = document.querySelector('a.focus.chl')?.textContent || '';
                const sjtype = Object.entries(typeMapping).find(([type, [id, text]]) =>
                    window.location.pathname.includes(`/new_subject/${id}`) || focusText.includes(text)
                )?.[0] || '';
                const url = `/person/5866/add_related/${sjtype}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const prsnStaffList = await response.text();
                const regex = /<option value="(\d+)">([^<]*)<\/option>/g;
                let personInfoList = [];
                let match;
                while ((match = regex.exec(prsnStaffList)) !== null) {
                    let label = match[2].trim();
                    if (label.includes('/')) {
                        label = (label.split('/')[0] || '').trim() || (label.split('/')[1] || '').trim();
                    }
                    personInfoList.push({
                        id: match[1],
                        label
                    });
                }
                personInfoList = personInfoList.filter(item => !(item.id === '23' && item.label === '助理制片人'));
                return personInfoList;
            } catch (error) {
                throw new Error('Error:', error);
            }
        }

        const showStatusMessage = (msg) => {
            let statusMessage = document.querySelector('#statusMessage') || (() => {
                const el = document.createElement('div');
                el.id = 'statusMessage';
                Object.assign(el.style, {
                    color: '#155724',
                    backgroundColor: '#d4edda',
                    marginTop: '10px',
                    fontWeight: 'bold',
                    padding: '10px',
                    border: '1px solid #c3e6cb',
                    borderRadius: '5px'
                });
                newMenuInner.style.display = 'block';
                syncContent.insertBefore(el, syncContent.firstChild);
                return el;
            })();
            statusMessage.textContent = msg;
        };

        window.editandrelateEntry = async function() {
            let existingIds = (await getExistingInfoArr()).map(item => `${item.prsnPos}-${item.prsn_id}`);
            const infoboxTextarea = document.querySelector('#infobox_wcode textarea[name="subject_infobox"]');
            if (infoboxTextarea) {
                let infoboxContent = infoboxTextarea.value;
                let [totalMatches, processedMatches] = [0, 0];
                const updateProgress = () => {
                    showStatusMessage(`查询中：${processedMatches}/${totalMatches}`);
                };
                const processPersonInfo = async (key, labelSuffix, datasetType) => {
                    try {
                        const personMatches = infoboxContent.match(new RegExp(`([|\\[]${key}[=|]([^\\n\\]]+))`, 'g'));
                        if (personMatches) {
                            for (const personMatch of personMatches) {
                                const value = personMatch.replace(new RegExp(`([|\\[]${key}[=|]([^\\n\\]]+))`), '$2').trim();
                                if (!value) continue;
                                const values = value.split(SPLIT_RULE).filter(val => val && !FILTER_WORDS.some(regex => regex.test(val)));
                                totalMatches += values.length;
                                updateProgress();
                                const fetchPersonInfo = async (value) => {
                                    const maxRetries = 3;
                                    let attempts = 0;
                                    while (attempts < maxRetries) {
                                        try {
                                            const localPrsnMap = JSON.parse(localStorage.getItem('localPrsnMap') || '{}');
                                            let data = {};
                                            if (localPrsnMap[value]) {
                                                const PersonID = localPrsnMap[value];
                                                data = {
                                                    [PersonID]: {
                                                        id: PersonID,
                                                        name: value,
                                                        img: `/pic/crt/s/29/6f/12929_crt_LX36c.jpg`,
                                                    }
                                                };
                                            } else {
                                                const response = await fetch(`/json/search-person/${encodeURIComponent(value)}`);
                                                if (!response.ok) throw new Error(`Failed to fetch data for: ${value}`);
                                                data = await response.json();
                                            }
                                            if (![...syncContent.children].some(child => child.textContent === `${value}⇔${key}`)) {
                                                const searchidx = document.createElement('div');
                                                searchidx.id = `searchidx-${value}-${key}`;
                                                searchidx.textContent = `${value}⇔${key}`;
                                                searchidx.style.cssText = `
                                                font-weight: bold;
                                                font-size: 1.3em;
                                                margin: ${data && Object.keys(data).length > 0 ? '15px 0' : '10px 0'};
                                                text-decoration: ${!data || Object.keys(data).length === 0 ? 'line-through' : ''};
                                                `;
                                                syncContent.appendChild(searchidx);
                                            }
                                            if (data && Object.keys(data).length > 0) {
                                                for (const personKey in data) {
                                                    if (data.hasOwnProperty(personKey)) {
                                                        const {
                                                            id: PersonID,
                                                            name: PersonName,
                                                            img: PersonImg,
                                                        } = data[personKey];
                                                        const matchingNamesCount = Object.values(data).filter(person => person.name === value).length;
                                                        if (PersonID && !syncContent.querySelector(`#sync-${datasetType}-${PersonID}`) && !existingIds.includes(`${datasetType}-${PersonID}`)) {
                                                            const checkbox = document.createElement('input');
                                                            Object.assign(checkbox, {
                                                                type: 'checkbox',
                                                                id: `sync-${datasetType}-${PersonID}`,
                                                                value: PersonID,
                                                                checked: PersonName === value && matchingNamesCount === 1
                                                            });
                                                            checkbox.style.cssText = 'transform: scale(1.5); margin: 7px;';
                                                            checkbox.dataset.type = datasetType;
                                                            const label = document.createElement('label');
                                                            label.textContent = PersonName;
                                                            label.style.cssText = `
                                                              color: ${PersonName === value
                                                            ? (matchingNamesCount > 1 ? 'red' : 'green')
                                                            : (PersonName.replace(/\s+/g, '').toLowerCase().includes(value.replace(/\s+/g, '').toLowerCase()) || value.replace(/\s+/g, '').toLowerCase().includes(PersonName.replace(/\s+/g, '').toLowerCase())) ? 'orange' : 'gray'};
                                                              font-size: 1.3em;
                                                              position: relative;
                                                            `;
                                                            label.addEventListener('click', () => {
                                                                window.open(`/person/${PersonID}`, '_blank');
                                                            });
                                                            const img = document.createElement('img');
                                                            img.src = `${PersonImg}`;
                                                            img.style.cssText = `
                                                              display: none;
                                                              position: absolute;
                                                              top: 100%;
                                                              left: 0;
                                                              z-index: 1000;
                                                              border: 1px solid #ccc;
                                                            `;
                                                            label.addEventListener('mouseover', () => (img.style.display = 'block'));
                                                            label.addEventListener('mouseout', () => (img.style.display = 'none'));
                                                            label.appendChild(img);
                                                            syncContent.appendChild(checkbox);
                                                            syncContent.appendChild(label);
                                                            syncContent.appendChild(document.createElement('br'));
                                                        }
                                                    }
                                                }
                                            }
                                            return;
                                        } catch (error) {
                                            attempts++;
                                            console.error(`Attempt ${attempts} failed for: ${value}`, error);
                                            if (attempts === maxRetries) {
                                                throw new Error(`Failed to process ${value} after ${maxRetries} attempts.`);
                                            } else {
                                                await new Promise(resolve => setTimeout(resolve, 1000));
                                            }
                                        }
                                    }
                                };
                                const batchSize = 5;
                                for (let i = 0; i < values.length; i += batchSize) {
                                    const batch = values.slice(i, i + batchSize);
                                    await Promise.all(batch.map(value => fetchPersonInfo(value.trim())));
                                    processedMatches += batch.length;
                                    updateProgress();
                                }
                            }
                        }
                    } catch (error) {
                        throw error;
                    }
                };
                const processAllPersonInfo = async () => {
                    try {
                        const personInfoList = await parsePrsnStaffList();
                        await Promise.all(
                            personInfoList
                            .filter(({
                                label
                            }) => label.trim() !== '')
                            .map(({
                                label,
                                id
                            }) => processPersonInfo(label, label, id))
                        );
                        showStatusMessage("咪～已经把所有人物都找过一遍啦～🎉");
                    } catch (error) {
                        showStatusMessage("咪咕…查找人物时出现了一点小问题，请稍后再试！");
                    }
                };
                processAllPersonInfo();
            }
        }

        async function SaveRelationData() {
            const form = document.querySelector('form[name="add_related"]');
            const formhash = document.querySelector('input[name="formhash"]')?.value || '';
            const checkboxes = syncContent.querySelectorAll('input[type="checkbox"]:checked');
            if (checkboxes.length === 0) return;
            const relationData = new URLSearchParams({
                'formhash': formhash,
                'submit': '保存关联数据',
                'editSummary': ''
            });
            let existingInfoArr = await getExistingInfoArr();
            existingInfoArr.forEach((info, index) => {
                Object.entries(info).forEach(([key, value]) => {
                    relationData.append(`infoArr[${index}][${key}]`, value);
                });
            });
            checkboxes.forEach((checkbox, index) => {
                const data = {
                    prsnPos: checkbox.dataset.type,
                    appear_eps: '',
                    prsn_id: checkbox.value
                };
                Object.entries(data).forEach(([key, value]) => {
                    relationData.append(`infoArr[n${index}][${key}]`, value);
                });
            });
            localStorage.setItem('pendingRelationData', relationData);
            console.log('关联数据已保存');
            const targetUrl = window.location.pathname.includes('/edit_detail') ?
                window.location.pathname.replace('/edit_detail', '/add_related/person') :
                null;
            if (targetUrl) submitRelationData(targetUrl, relationData.toString());
            return true;
        }
    }
})();
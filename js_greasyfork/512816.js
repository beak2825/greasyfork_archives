// ==UserScript==
// @name         browndust2.com news viewer (Vue 3 + Tailwind CSS)
// @namespace    http://tampermonkey.net/
// @version      1.4.0
// @description  Custom news viewer for browndust2.com using Vue 3 and Tailwind CSS
// @author       SouSeiHaku
// @match        https://www.browndust2.com/robots.txt
// @grant        none
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/512816/browndust2com%20news%20viewer%20%28Vue%203%20%2B%20Tailwind%20CSS%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512816/browndust2com%20news%20viewer%20%28Vue%203%20%2B%20Tailwind%20CSS%29.meta.js
// ==/UserScript==

/*
 * This script is based on the original work by Rplus:
 * @name browndust2.com news viewer
 * @namespace Violentmonkey Scripts
 * @version 1.2.0
 * @author Rplus
 * @description custom news viewer for sucking browndust2.com
 * @license WTFPL
 *
 * Modified and extended by SouSeiHaku
 */

(function () {
    'use strict';

    function addScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function addGlobalStyle() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                color:#52525b;
            }

            .content-box * {
                font-size: 1rem !important;
            }

            .content-box [style*="font-size"] {
                font-size: 1rem !important;
            }

            .content-box span[style*="font-size"],
            .content-box p[style*="font-size"],
            .content-box div[style*="font-size"] {
                font-size: 1rem !important;
                color: #52525b;
            }

            .content-box strong {
                color: black;
                font-weight: bold;
                font-size: 20px !important;
            }

            .content-box p {
                margin-bottom:16px;
            }

            details[open] > summary {
                color: black;
            }

        `;
        document.head.appendChild(style);
    }

    Promise.all([
        addScript('https://unpkg.com/vue@3/dist/vue.global.js'),
        addScript('https://cdn.tailwindcss.com')
    ]).then(() => {
        addGlobalStyle();
        initializeApp();
    }).catch(error => {
        console.error('Error loading scripts:', error);
    });

    function initializeApp() {
        if (!window.Vue) return;

        const { createApp, ref, computed, onMounted } = Vue;

        const app = createApp({
            setup() {
                const data = ref([]);
                const newsMap = ref(new Map());
                const searchInput = ref('');
                const showAll = ref(false);
                const language = ref('tw')
                const readNews = ref(new Set());

                const updateReadNews = (id) => {
                    if (readNews.value.has(id)) return;
                    readNews.value.add(id);
                    localStorage.setItem('readNews', JSON.stringify(Array.from(readNews.value)));
                };

                const isNewsRead = computed(() => (id) => readNews.value.has(id));

                const filteredData = computed(() => {
                    const keyword = searchInput.value.trim().toLowerCase();
                    if (!keyword) return data.value;
                    return data.value.filter(item => {
                        const { lowercaseFields } = item;
                        return Object.values(lowercaseFields).some(field => field.includes(keyword));
                    });
                });

                const visibleData = computed(() => {
                    if (showAll.value) return filteredData.value;
                    return filteredData.value.slice(0, 20);
                });

                function formatTime(time) {
                    const _time = time ? new Date(time) : new Date();
                    const currentLang = languageOptions.find(option => option.value === language.value);
                    return _time.toLocaleString(currentLang.dateFormat.locale, currentLang.dateFormat.options);
                }

                function show(id) {
                    const info = newsMap.value.get(parseInt(id))?.attributes;
                    if (!info) return '';
                    const content = (info.content || info.NewContent).replace(/\<img\s/g, '<img loading="lazy" ');
                    const oriLink = `<a class="text-blue-400 underline mt-10" href="https://www.browndust2.com/zh-tw/news/view?id=${id}" target="_bd2news" title="official link">官方連結 ></a>`;
                    const closeButton = `<div class="flex justify-center pt-3"><button class="close-details mt-4 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white rounded-full text-xs" onclick="closeDetails(${id})">關閉</button></div>`;
                    return content + oriLink + closeButton;
                }

                const closeDetails = (id) => {
                    const detailsElement = document.querySelector(`details[data-detail-id="${id}"]`);
                    if (detailsElement) {
                        detailsElement.open = false;
                    }
                };

                const languageOptions = [
                    {
                        label: '繁體中文',
                        value: 'tw',
                        dateFormat: {
                            locale: 'zh-TW',
                            options: { weekday: 'narrow', year: 'numeric', month: '2-digit', day: '2-digit' }
                        }
                    },
                    {
                        label: '日本語',
                        value: 'jp',
                        dateFormat: {
                            locale: 'ja-JP',
                            options: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
                        }
                    },
                    {
                        label: 'English',
                        value: 'en',
                        dateFormat: {
                            locale: 'en-US',
                            options: { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }
                        }
                    },
                    {
                        label: '한국어',
                        value: 'kr',
                        dateFormat: {
                            locale: 'ko-KR',
                            options: { weekday: 'narrow', year: 'numeric', month: '2-digit', day: '2-digit' }
                        }
                    },
                    {
                        label: '简体中文',
                        value: 'cn',
                        dateFormat: {
                            locale: 'zh-CN',
                            options: { weekday: 'narrow', year: 'numeric', month: '2-digit', day: '2-digit' }
                        }
                    },
                ]

                const handleLangChange = () => {
                    searchInput.value = '';
                    load();
                }

                async function load() {
                    const dataUrl = `https://www.browndust2.com/api/newsData_${language.value}.json`;

                    try {
                        const response = await fetch(dataUrl);
                        const json = await response.json();
                        console.log('Data fetched successfully, item count:', json.data.length);

                        // 新增 lowercaseFields用於篩選功能
                        data.value = json.data.reverse().map(item => ({
                            ...item,
                            lowercaseFields: {
                                id: item.id.toString().toLowerCase(),
                                content: (item.attributes.content || '').toLowerCase(),
                                newContent: (item.attributes.NewContent || '').toLowerCase(),
                                tag: (item.attributes.tag || '').toLowerCase(),
                                subject: (item.attributes.subject || '').toLowerCase()
                            }
                        }));

                        // 更新 newsMap，但不需包含 lowercaseFields
                        newsMap.value.clear();
                        data.value.forEach(item => {
                            const { lowercaseFields, ...itemWithoutLowercaseFields } = item;
                            newsMap.value.set(item.id, itemWithoutLowercaseFields);
                        });
                    } catch (error) {
                        console.error('Error fetching or processing data:', error);
                    }
                }

                onMounted(() => {
                    load()
                    window.closeDetails = closeDetails;
                    const storedReadNews = JSON.parse(localStorage.getItem('readNews') || '[]');
                    readNews.value = new Set(storedReadNews);
                });

                return {
                    visibleData,
                    searchInput,
                    showAll,
                    language,
                    languageOptions,
                    formatTime,
                    show,
                    handleLangChange,
                    updateReadNews,
                    isNewsRead,
                };
            }
        });

        // Create a container for the Vue app
        const appContainer = document.createElement('div');
        appContainer.id = 'app';
        document.body.innerHTML = '';
        document.body.appendChild(appContainer);

        // Add the Vue template
        appContainer.innerHTML = `
        <div class=" w-full min-h-[100dvh] relative bg-white">
        <header class="sticky top-0 left-0 h-[60px] border-b border-slate-600 flex justify-between items-center bg-white z-10 px-3">
			<label class="flex gap-1 items-center">
				Filter
				<input v-model="searchInput" type="search" class="py-1 px-2 block w-full rounded text-sm disabled:pointer-events-none bg-white border border-neutral-300 text-black placeholder-neutral-500" tabindex="1">
			</label>
            <div class="flex gap-3 items-center">
                <label class="cursor-pointer flex gap-1 items-center">
                    <select v-model="language" @change="handleLangChange" class="py-1 px-2 block w-full rounded text-sm disabled:pointer-events-none bg-white border border-neutral-300 text-black placeholder-neutral-500" tabindex="1">
                        <option v-for="option in languageOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </option>
                    </select>
                </label>
                <label class="cursor-pointer flex gap-1 items-center">
                    <input v-model="showAll" type="checkbox" class="shrink-0 mt-0.5 bg-white border border-gray-200 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none">
                    Show all list
                </label>
            </div>
        </header>
            <div class="flex flex-col mx-auto w-full max-w-7xl py-8 px-3 space-y-4">
                <details v-for="item in visibleData" :key="item.id" :data-detail-id="item.id" class="rounded overflow-hidden shadow shadow-black/30">
                    <summary class="pl-4 pr-2 py-2 cursor-pointer transition duration-200"
                     @click="updateReadNews(item.id)"
                     :class="[isNewsRead(item.id) ? 'text-gray-500' : 'text-black','font-bold bg-slate-100 hover:bg-slate-200']">
                        <img :src="'https://www.browndust2.com/img/newsDetail/tag-' + item.attributes.tag + '.png'"
                            :alt="item.attributes.tag" :title="'#' + item.attributes.tag"
                            class="w-10 h-10 inline-block mr-2">
                        <time :datetime="item.attributes.publishedAt" :title="item.attributes.publishedAt">
                            {{ formatTime(item.attributes.publishedAt) }}
                        </time> -
                        {{ item.attributes.subject }}
                    </summary>
                    <div class="bg-white p-6 whitespace-pre-wrap content-box" v-html="show(item.id)"></div>
                </details>
            </div>
        </div>
        `;

        app.mount('#app');
    }
})();
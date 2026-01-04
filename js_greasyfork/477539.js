// ==UserScript==
// @name         e站收藏统计
// @namespace    Schwi
// @version      1.9
// @description  获取e站所有收藏，以及对所有标签进行排序以找到你最爱的标签，可按namespace分组，支持翻译
// @author       Schwi
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.5/dist/FileSaver.min.js
// @icon         https://e-hentai.org/favicon.ico
// @grant        GM_registerMenuCommand
// @noframes
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/477539/e%E7%AB%99%E6%94%B6%E8%97%8F%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/477539/e%E7%AB%99%E6%94%B6%E8%97%8F%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 在 https://e-hentai.org/ 或 https://exhentai.org/ 任意页面运行即可

    // 是否翻译标签(需下载翻译文本)
    const config = {
        translationUrl: "https://raw.githubusercontent.com/EhTagTranslation/DatabaseReleases/master/db.text.json",
        favoritesUrl: location.origin + "/favorites.php?inline_set=dm_e"
    }

    async function fetchFavorites(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.text();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function getFavoritesList(queryUrl) {
        let favList = [];
        let nextUrl = queryUrl.href;
        while (nextUrl) {
            let resp = await fetchFavorites(nextUrl);
            if (resp) {
                let doc = new DOMParser().parseFromString(resp, "text/html");
                let next = doc.scripts[3];
                let scriptContent = next.textContent || next.innerText;
                let match = scriptContent.match(/var nexturl="(.*?)"/);
                nextUrl = match && match[1];
                if (nextUrl && nextUrl.startsWith('http') && new URL(nextUrl).pathname != queryUrl.pathname) {
                    nextUrl = null;
                }
                favList = favList.concat(Array.from(doc.querySelectorAll(".itg.glte>tbody>tr")));
            }
        }
        return favList;
    }

    function parseFavorites(favList) {
        let myFavList = [];
        favList.forEach(fav => {
            let title = fav.querySelector(".glink").innerText;
            let url = fav.href;
            let reclass = fav.querySelector(".cn").innerText;
            let tags = [];
            fav.querySelectorAll("td>[title]").forEach(tag => {
                let title = tag.title;
                if (title.startsWith(":")) {
                    title = "temp" + title;
                }
                tags.push(title);
            });
            myFavList.push({ title, url, reclass, tags });
        });
        return myFavList;
    }

    async function getTranslate(translationUrl) {
        showProgress('正在获取翻译...');
        try {
            const response = await fetch(translationUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    async function translateResult(myFavList, translate) {

        const reclassList = getReclassList(myFavList);
        const tagList = getTagList(myFavList);
        const groupedTagList = getGroupedTagList(myFavList);
        showProgress('正在翻译...');

        reclassList.forEach(reclass => {
            if (reclass.reclass.toLowerCase().replace(' ', '') in translate.data[1].data) {
                reclass.translate = translate.data[1].data[reclass.reclass.toLowerCase().replace(' ', '')].name;
                reclass.intro = translate.data[1].data[reclass.reclass.toLowerCase().replace(' ', '')].intro || '';
            }
        });
        tagList.forEach(fullTag => {
            let namespace = fullTag.tag.split(":")[0];
            let tag = fullTag.tag.split(":")[1];
            let data = translate.data.filter(title => title.namespace === namespace);
            let tagTranslate = tag;
            let intro = '';
            if (data.length > 0) {
                namespace = data[0].frontMatters.name;
                if (tag in data[0].data) {
                    tagTranslate = data[0].data[tag].name;
                    intro = data[0].data[tag].intro || '';
                }
            }
            fullTag.translate = `${namespace}:${tagTranslate}`;
            fullTag.intro = intro;
        });
        groupedTagList.forEach(group => {
            let data = translate.data.filter(title => title.namespace === group.namespace);
            if (data.length > 0) {
                group.translate = data[0].frontMatters.name;
                group.tags.forEach(tag => {
                    tag.translate = tag.tag;
                    if (tag.tag in data[0].data) {
                        tag.translate = data[0].data[tag.tag].name;
                        tag.intro = data[0].data[tag.tag].intro || '';
                    }
                })
            }

        })

        return {
            reclassList,
            tagList,
            groupedTagList,
            myFavList
        };
    }

    function sortByCount(list, key) {
        return list.sort((a, b) => (b.count - a.count) * 2 + (a[key].toUpperCase() > b[key].toUpperCase() ? 1 : -1));
    }

    function getReclassList(myFavList) {
        let reclassList = {};
        myFavList.forEach(fav => {
            if (fav.reclass in reclassList) {
                reclassList[fav.reclass].count++;
            } else {
                reclassList[fav.reclass] = { reclass: fav.reclass, translate: '', count: 1 };
            }
        });
        return sortByCount(Object.values(reclassList), "reclass"); // [{reclass, translate, count}]
    }

    function getTagList(myFavList) {
        let tagList = {};
        myFavList.forEach(fav => {
            fav.tags.forEach(tag => {
                if (tag in tagList) {
                    tagList[tag].count++;
                } else {
                    tagList[tag] = { tag: tag, translate: '', count: 1 };
                }
            });
        });
        return sortByCount(Object.values(tagList), "tag");// [{tag, translate, count}]
    }

    function getGroupedTagList(myFavList) {
        let groupedTagList = {};
        myFavList.forEach(fav => {
            fav.tags.forEach(fullTag => {
                let namespace = fullTag.split(":")[0];
                let tag = fullTag.split(":")[1];
                if (!(namespace in groupedTagList)) {
                    groupedTagList[namespace] = {};
                }
                if (fullTag in groupedTagList[namespace]) {
                    groupedTagList[namespace][fullTag].count++;
                } else {
                    groupedTagList[namespace][fullTag] = { tag: tag, translate: '', count: 1 };
                }
            });
        });
        for (let namespace in groupedTagList) {
            groupedTagList[namespace] = { namespace, translate: '', tags: sortByCount(Object.values(groupedTagList[namespace]), "tag") };
        }
        return Object.values(groupedTagList); // [{namespace, translate, tags:[{tag, translate, count}]}]
    }

    function showProgress(message) {
        let progressDiv = document.querySelector('#progressDiv');
        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'progressDiv';
            progressDiv.style.position = 'fixed';
            progressDiv.style.top = '10px';
            progressDiv.style.left = '50%';
            progressDiv.style.transform = 'translateX(-50%)';
            progressDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
            progressDiv.style.color = 'white';
            progressDiv.style.padding = '10px';
            progressDiv.style.borderRadius = '5px';
            progressDiv.style.zIndex = '10001'; // 调大 z-index
            document.body.appendChild(progressDiv);
        }
        progressDiv.innerText = message;
    }

    function hideProgress() {
        const progressDiv = document.querySelector('#progressDiv');
        if (progressDiv) {
            progressDiv.remove();
        }
    }

    function showResults(result) {
        let resultDiv = document.querySelector('#resultDiv');
        if (resultDiv) {
            resultDiv.remove();
        }
        resultDiv = document.createElement('div');
        resultDiv.id = 'resultDiv';
        resultDiv.translate = false; // https://github.com/EhTagTranslation/EhSyringe/issues/1290
        resultDiv.style.position = 'fixed';
        resultDiv.style.top = '5%';
        resultDiv.style.left = '5%';
        resultDiv.style.width = '90%';
        resultDiv.style.height = '90%';
        resultDiv.style.backgroundColor = 'white';
        resultDiv.style.border = '1px solid black';
        resultDiv.style.overflow = 'auto';
        resultDiv.style.zIndex = '10000';
        document.body.appendChild(resultDiv);

        const closeButton = document.createElement('button');
        closeButton.innerText = '关闭';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => resultDiv.remove();
        resultDiv.appendChild(closeButton);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = '20px';
        buttonContainer.style.marginBottom = '10px';

        const saveRawBtnContainer = document.createElement('div');
        saveRawBtnContainer.style.flex = '1';
        saveRawBtnContainer.style.textAlign = 'center';

        const saveRawBtn = document.createElement('button');
        saveRawBtn.id = 'saveBtnJSON';
        saveRawBtn.innerText = '保存JSON结果';
        saveRawBtn.style.backgroundColor = '#4CAF50';
        saveRawBtn.style.color = 'white';
        saveRawBtn.style.border = 'none';
        saveRawBtn.style.borderRadius = '5px';
        saveRawBtn.style.padding = '10px 20px';
        saveRawBtn.style.cursor = 'pointer';
        saveRawBtnContainer.appendChild(saveRawBtn);

        const saveTranslatedBtnContainer = document.createElement('div');
        saveTranslatedBtnContainer.style.flex = '1';
        saveTranslatedBtnContainer.style.textAlign = 'center';

        const saveTranslatedBtn = document.createElement('button');
        saveTranslatedBtn.id = 'saveBtnHTML';
        saveTranslatedBtn.innerText = '保存HTML结果';
        saveTranslatedBtn.style.backgroundColor = '#008CBA';
        saveTranslatedBtn.style.color = 'white';
        saveTranslatedBtn.style.border = 'none';
        saveTranslatedBtn.style.borderRadius = '5px';
        saveTranslatedBtn.style.padding = '10px 20px';
        saveTranslatedBtn.style.cursor = 'pointer';
        saveTranslatedBtnContainer.appendChild(saveTranslatedBtn);

        buttonContainer.appendChild(saveRawBtnContainer);
        buttonContainer.appendChild(saveTranslatedBtnContainer);

        resultDiv.appendChild(buttonContainer);

        const createTable = (data, headers, total = false) => {
            const table = document.createElement('table');
            table.style.border = '1px solid';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.textAlign = 'center';

            const headerRow = document.createElement('tr');
            headerRow.style.height = '30px';
            headerRow.style.border = '1px solid';
            headers.forEach(header => {
                const th = document.createElement('th');
                th.style.border = '1px solid';
                th.innerText = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            data.forEach((row, index) => {
                const tr = document.createElement('tr');
                tr.style.height = '30px';
                tr.style.border = '1px solid';
                tr.title = row.intro || '';

                const indexTd = document.createElement('td');
                indexTd.innerText = index + 1;
                tr.appendChild(indexTd);

                headers.forEach(header => {
                    if (header === 'Index') return; // Skip index column
                    const td = document.createElement('td');
                    td.style.border = '1px solid';
                    td.innerText = row[header.toLowerCase()];
                    tr.appendChild(td);
                });

                table.appendChild(tr);
            });
            if (total) {
                const totalRow = document.createElement('tr');
                totalRow.style.height = '30px';
                totalRow.style.border = '1px solid';
                const totalTd = document.createElement('td');
                totalTd.colSpan = headers.length - 1;
                totalTd.innerText = 'Total';
                totalTd.style.fontWeight = 'bold';
                totalTd.style.border = '1px solid';
                totalRow.appendChild(totalTd);
                const countTd = document.createElement('td');
                countTd.innerText = data.reduce((sum, row) => sum + row.count, 0);
                countTd.style.fontWeight = 'bold';
                countTd.style.border = '1px solid';
                totalRow.appendChild(countTd);
                table.appendChild(totalRow);
            }

            return table;
        };

        const createGroupedTable = (data, headers) => {
            const table = document.createElement('table');
            table.style.border = '1px solid';
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.textAlign = 'center';

            const headerRow = document.createElement('tr');
            headerRow.style.height = '30px';
            headerRow.style.border = '1px solid';
            headers.forEach(header => {
                const th = document.createElement('th');
                th.style.border = '1px solid';
                th.innerText = header;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            data.forEach((group, groupIndex) => {
                const tags = group.tags;
                tags.forEach((tag, tagIndex) => {
                    const tr = document.createElement('tr');
                    tr.style.height = '30px';
                    tr.style.border = '1px solid';

                    if (tagIndex === 0) {
                        const namespaceTd = document.createElement('td');
                        namespaceTd.style.border = '1px solid';
                        namespaceTd.rowSpan = tags.length;
                        namespaceTd.innerText = group.namespace;
                        tr.appendChild(namespaceTd);
                        const namespaceTranslateTd = document.createElement('td');
                        namespaceTranslateTd.style.border = '1px solid';
                        namespaceTranslateTd.rowSpan = tags.length;
                        namespaceTranslateTd.innerText = group.translate;
                        tr.appendChild(namespaceTranslateTd);
                    }

                    const indexTd = document.createElement('td');
                    indexTd.style.border = '1px solid';
                    indexTd.innerText = tagIndex + 1;
                    indexTd.title = tag.intro || '';
                    tr.appendChild(indexTd);

                    const tagTd = document.createElement('td');
                    tagTd.style.border = '1px solid';
                    tagTd.innerText = tag.tag;
                    tagTd.title = tag.intro || '';
                    tr.appendChild(tagTd);

                    const translateTd = document.createElement('td');
                    translateTd.style.border = '1px solid';
                    translateTd.innerText = tag.translate;
                    translateTd.title = tag.intro || '';
                    tr.appendChild(translateTd);

                    const countTd = document.createElement('td');
                    countTd.style.border = '1px solid';
                    countTd.innerText = tag.count;
                    countTd.title = tag.intro || '';
                    tr.appendChild(countTd);

                    table.appendChild(tr);
                });
            })

            return table;
        };

        const resultContainer = document.createElement('div');
        resultContainer.style.display = 'flex';
        resultContainer.style.justifyContent = 'space-around';

        const rawResultDiv = document.createElement('div');
        rawResultDiv.style.width = '90%';
        rawResultDiv.style.border = '1px solid black';
        rawResultDiv.style.padding = '10px';

        const rawResultTitle = document.createElement('h3');
        rawResultTitle.innerText = '统计结果';
        rawResultDiv.appendChild(rawResultTitle);

        const rawReclassTitle = document.createElement('h4');
        rawReclassTitle.innerText = 'Reclass List';
        rawResultDiv.appendChild(rawReclassTitle);
        rawResultDiv.appendChild(createTable(result.reclassList, ['Index', 'Reclass', 'Translate', 'Count'], true));

        const rawTagTitle = document.createElement('h4');
        rawTagTitle.innerText = 'Tag List';
        rawResultDiv.appendChild(rawTagTitle);
        rawResultDiv.appendChild(createTable(result.tagList, ['Index', 'Tag', 'Translate', 'Count']));

        const rawGroupedTagTitle = document.createElement('h4');
        rawGroupedTagTitle.innerText = 'Grouped Tag List';
        rawResultDiv.appendChild(rawGroupedTagTitle);
        rawResultDiv.appendChild(createGroupedTable(result.groupedTagList, ['Namespace', 'Translate', 'Index', 'Tag', 'Translate', 'Count']));

        resultContainer.appendChild(rawResultDiv);

        resultDiv.appendChild(resultContainer);

        resultDiv.querySelector('#saveBtnJSON').onclick = () => {
            download('eh_collect.json', JSON.stringify(result, null, 2));
        };

        resultDiv.querySelector('#saveBtnHTML').onclick = () => {
            download('eh_collect.html', resultContainer.outerHTML);
        };
    }

    async function collect(config) {
        showProgress('正在获取收藏列表...');
        const queryUrl = new URL(config.favoritesUrl);
        const favList = await getFavoritesList(queryUrl);
        let myFavList = parseFavorites(favList);
        return myFavList;
    }

    function download(filename, data) {
        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
    }

    GM_registerMenuCommand("统计收藏", async () => {
        const collectList = await collect(config);
        const translate = await getTranslate(config.translationUrl);
        const result = await translateResult(collectList, translate);
        hideProgress();
        showResults(result);
    });
})();

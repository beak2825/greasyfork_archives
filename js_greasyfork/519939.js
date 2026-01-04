// ==UserScript==
// @name          AMQ Community Builder Plus
// @namespace     Racoonsaki
// @version       0.5.0
// @description   Improve AMQ Community Builder
// @match         https://animemusicquiz.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/519939/AMQ%20Community%20Builder%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/519939/AMQ%20Community%20Builder%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======[ Global Variables ]======
    let activeResultIndex = -1;
    let isInitialized = false;
    const POLLING_INTERVAL = 500;

    const createElement = (tagName, attributes = {}) => {
        const element = document.createElement(tagName);
        Object.entries(attributes).forEach(([key, value]) => { element[key] = value; });
        return element;
    };

    const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    function getInnerBlockIds(ruleBlockInstance) {
        const ids = new Set();
        if (ruleBlockInstance && ruleBlockInstance.ruleContentMap) {
            Object.values(ruleBlockInstance.ruleContentMap).forEach(block => {
                if (block.annId) ids.add(`anime-${block.annId}`);
                if (block.annSongId) ids.add(`song-${block.annSongId}`);
            });
        }
        return ids;
    }

    function createBlockFromData(blockInfo) {
        let block;
        if (blockInfo.annId) {
            const cachedAnime = libraryCacheHandler.getCachedAnime(blockInfo.annId);
            if (!cachedAnime) return null;
            block = new CustomQuizAnimeBlock(cachedAnime, cachedAnime.songs.OP.length, cachedAnime.songs.ED.length, cachedAnime.songs.INS.length, customQuizCreator.dragStartCallback, customQuizCreator.dragEndCallback, blockInfo);
        } else if (blockInfo.annSongId) {
            const annSongEntry = libraryCacheHandler.getCachedAnnSongEntry(blockInfo.annSongId);
            if (!annSongEntry) return null;
            const animeEntry = libraryCacheHandler.getCachedAnime(annSongEntry.annId);
            let typeText = customQuizCreator.builder.convertTypeIdToName(annSongEntry.type);
            if (typeText !== "IN") { typeText += annSongEntry.number; }
            block = new CustomQuizSongBlock(annSongEntry.annSongId, animeEntry.mainName, typeText, annSongEntry.songEntry, customQuizCreator.dragStartCallback, customQuizCreator.dragEndCallback, blockInfo);
        } else if (blockInfo.settings) {
            block = new CustomQuizAlgorithmBlock(blockInfo.settings, customQuizCreator.dragStartCallback, customQuizCreator.dragEndCallback, blockInfo);
        } else if (blockInfo.message != undefined) {
            block = new CustomQuizMessageBlock(customQuizCreator.dragStartCallback, customQuizCreator.dragEndCallback, blockInfo);
        } else if(blockInfo.title != undefined) {
            block = new CustomQuizTitleBlock(customQuizCreator.dragStartCallback, customQuizCreator.dragEndCallback, blockInfo);
        }
        return block;
    }

    // ======[ Feature: Quiz Statistics ]======
    const updateQuizStatistics = () => {
        const songBlocks = document.querySelectorAll('.cqcBlock.cqcSongBlock');
        const animeBlocks = document.querySelectorAll('.cqcBlock.cqcAnimeBlock');
        const algorithmSettingBlocks = document.querySelectorAll('.cqcBlock.cqcSongBlockBlock');

        const animeCounts = new Map();
        const artistCounts = new Map();
        const songTypes = { OP: 0, ED: 0, IN: 0 };
        let algorithmSongCount = 0;

        songBlocks.forEach(block => {
            const animeInfoEl = block.querySelector('.cqcSongAnimeInfo');
            const artistInfoEl = block.querySelector('.cqcSongArtist.aicTrigger');

            if (animeInfoEl) {
                const animeText = animeInfoEl.innerText.trim();
                const animeName = animeText.split(' - ')[1] || animeText;
                animeCounts.set(animeName, (animeCounts.get(animeName) || 0) + 1);

                const typeMatch = animeText.match(/^(OP|ED|IN)/);
                if (typeMatch) {
                    songTypes[typeMatch[0]]++;
                }
            }

            if (artistInfoEl) {
                const artistName = artistInfoEl.innerText.trim();
                artistCounts.set(artistName, (artistCounts.get(artistName) || 0) + 1);
            }
        });

        animeBlocks.forEach(block => {
            const animeNameEl = block.querySelector('.cqcAnimeBlockName');
            const songCountEl = block.querySelector('.cqcBlockAnimeSongCount');
            const songCount = songCountEl ? (parseInt(songCountEl.innerText, 10) || 0) : 0;

            if (animeNameEl) {
                const animeName = animeNameEl.innerText.trim();
                animeCounts.set(animeName, (animeCounts.get(animeName) || 0) + songCount);
            }
            algorithmSongCount += songCount;
        });

        algorithmSettingBlocks.forEach(block => {
            const songCountEl = block.querySelector('.cqcSongBlockBlockNumber');
            if(songCountEl) {
                algorithmSongCount += parseInt(songCountEl.innerText, 10) || 0;
            }
        });

        const getTopWithTies = (sortedList, topN = 10) => {
            if (sortedList.length === 0) return [];
            let rank = 0;
            let lastScore = -1;
            const rankedList = sortedList.map(item => {
                if (item[1] !== lastScore) {
                    rank++;
                }
                lastScore = item[1];
                return { name: item[0], count: item[1], rank: rank };
            });

            const cutoffRank = rankedList.find(item => item.rank >= topN)?.rank;
            if (!cutoffRank) {
                return rankedList;
            }

            return rankedList.filter(item => item.rank <= cutoffRank);
        };

        const sortedArtists = Array.from(artistCounts.entries()).sort((a, b) => b[1] - a[1]);
        const top10Artists = getTopWithTies(sortedArtists, 10);

        const sortedAnime = Array.from(animeCounts.entries()).sort((a, b) => b[1] - a[1]);
        const top10Anime = getTopWithTies(sortedAnime, 10);

        const stats = {
            totalSongs: songBlocks.length + algorithmSongCount,
            songBlockCount: songBlocks.length,
            animeBlockCount: animeBlocks.length,
            settingBlockCount: algorithmSettingBlocks.length,
            algorithmSongCount: algorithmSongCount,
            uniqueAnimeCount: animeCounts.size,
            uniqueArtistCount: artistCounts.size,
            songTypes: songTypes,
            top10Artists: top10Artists,
            top10Anime: top10Anime
        };

        displayStatistics(stats);
    };

    const displayStatistics = (stats) => {
        const modalBody = document.getElementById('cqcStatsModalBody');
        if (modalBody) {
            const totalSpecificSongs = stats.songBlockCount;
            const opPercent = totalSpecificSongs > 0 ? ((stats.songTypes.OP / totalSpecificSongs) * 100).toFixed(0) : 0;
            const edPercent = totalSpecificSongs > 0 ? ((stats.songTypes.ED / totalSpecificSongs) * 100).toFixed(0) : 0;
            const inPercent = totalSpecificSongs > 0 ? ((stats.songTypes.IN / totalSpecificSongs) * 100).toFixed(0) : 0;

            const maxArtistCount = stats.top10Artists.length > 0 ? stats.top10Artists[0].count : 0;
            const top10ArtistsHtml = stats.top10Artists.length > 0 ?
                stats.top10Artists.map(artist => {
                    const { name, count, rank } = artist;
                    const barWidth = maxArtistCount > 0 ? (count / maxArtistCount) * 100 : 0;
                    return `
                        <li class="cqc-stats-top-item">
                            <div class="cqc-stats-top-bar artist-bar" style="width: ${barWidth}%;"></div>
                            <span class="cqc-stats-top-rank">${rank}.</span>
                            <span class="cqc-stats-top-name" data-toggle="tooltip" title="${name}">${name}</span>
                            <span class="cqc-stats-top-count">${count} songs</span>
                        </li>
                    `;
                }).join('') :
                '<li>No songs in quiz.</li>';

            const maxAnimeCount = stats.top10Anime.length > 0 ? stats.top10Anime[0].count : 0;
            const top10AnimeHtml = stats.top10Anime.length > 0 ?
                stats.top10Anime.map(anime => {
                    const { name, count, rank } = anime;
                    const barWidth = maxAnimeCount > 0 ? (count / maxAnimeCount) * 100 : 0;
                     return `
                        <li class="cqc-stats-top-item">
                            <div class="cqc-stats-top-bar anime-bar" style="width: ${barWidth}%;"></div>
                            <span class="cqc-stats-top-rank">${rank}.</span>
                            <span class="cqc-stats-top-name" data-toggle="tooltip" title="${name}">${name}</span>
                            <span class="cqc-stats-top-count">${count} songs</span>
                        </li>
                    `;
                }).join('') :
                '<li>No anime in quiz.</li>';

            modalBody.innerHTML = `
                <div class="cqc-stats-container">
                    <div class="cqc-stats-item"><b>Total Songs:</b> <span class="cqc-stat-total">${stats.totalSongs}</span></div>
                    <div class="cqc-stats-item"><b>Unique Anime:</b> <span class="cqc-stat-anime">${stats.uniqueAnimeCount}</span></div>
                    <div class="cqc-stats-item"><b>Unique Artists:</b> <span class="cqc-stat-artist">${stats.uniqueArtistCount}</span></div>
                </div>

                <div class="cqc-stats-group">
                    <div class="cqc-stats-item-header"><b>Song Blocks:</b> <span class="cqc-stat-songblock">${stats.songBlockCount}</span></div>
                    <div class="cqc-stats-sub-list song-types">
                        <div class="cqc-stats-sub-item"><b>OPs:</b> <span class="cqc-stat-op">${stats.songTypes.OP}</span> <span class="cqc-stat-percent">(${opPercent}%)</span></div>
                        <div class="cqc-stats-sub-item"><b>EDs:</b> <span class="cqc-stat-ed">${stats.songTypes.ED}</span> <span class="cqc-stat-percent">(${edPercent}%)</span></div>
                        <div class="cqc-stats-sub-item"><b>INs:</b> <span class="cqc-stat-in">${stats.songTypes.IN}</span> <span class="cqc-stat-percent">(${inPercent}%)</span></div>
                    </div>
                </div>

                <div class="cqc-stats-group">
                    <div class="cqc-stats-item-header"><b>Algorithm</b></div>
                    <div class="cqc-stats-sub-list algo-types">
                        <div class="cqc-stats-sub-item"><b>Algorithm Blocks:</b> <span class="cqc-stat-algoblock">${stats.settingBlockCount}</span></div>
                        <div class="cqc-stats-sub-item"><b>Anime Blocks:</b> <span class="cqc-stat-animeblock">${stats.animeBlockCount}</span></div>
                        <div class="cqc-stats-sub-item"><b>Total Songs:</b> <span class="cqc-stat-algo">${stats.algorithmSongCount}</span></div>
                    </div>
                </div>

                <hr class="cqc-stats-divider">
                <div class="cqc-stats-list-container">
                    <div class="cqc-stats-list">
                        <b>Top 10 Anime:</b>
                        <ol>${top10AnimeHtml}</ol>
                    </div>
                    <div class="cqc-stats-list">
                        <b>Top 10 Artists:</b>
                        <ol>${top10ArtistsHtml}</ol>
                    </div>
                </div>
            `;

            $('#cqcStatsModalBody [data-toggle="tooltip"]').tooltip({
                container: '#cqcStatsModalBody',
                trigger: 'hover',
                placement: 'top'
            });
        }
    };


    // ======[ Feature: Search & Highlighting ]======
    const updateOtherFeatures = () => {
        let searchContainer = document.getElementById('cqcSearchContainer');
        if (!searchContainer) {
            const headerContainer = document.getElementById('cqcQuizCreatorHeader');
            if(headerContainer) searchContainer = createSearchContainer(headerContainer);
        }

        highlightDuplicates(document.querySelectorAll('.cqcBlockMainContainer'));
    };

    const createSearchContainer = (headerContainer) => {
        const searchContainer = createElement('div', { id: 'cqcSearchContainer', style: 'margin-top: 10px; display: flex; align-items: center; gap: 10px; width: 100%; position: relative;' });
        headerContainer.appendChild(searchContainer);
        const filterDropdown = createElement('select', { className: 'customFilterSearchTargetDropdown', style: 'flex: 0 0 auto; padding: 5px; background-color: #272727; color: white; border: 1px solid #555; border-radius: 4px;' });
        filterDropdown.innerHTML = `<option value="all">All</option><option value="anime">Anime</option><option value="song">Song</option><option value="artist">Artist</option>`;
        searchContainer.appendChild(filterDropdown);
        const searchInput = createElement('input', { type: 'text', id: 'cqcSearchInput', placeholder: 'Search Songs...', style: 'flex: 1; padding: 3px; background-color: #272727; color: white; border: 1px solid #555;' });
        searchContainer.appendChild(searchInput);
        const searchResults = createElement('div', { id: 'cqcSearchResults', style: 'position: absolute; background: #222; color: white; border: 1px solid #555; max-height: 240px; overflow-y: auto; width: calc(100% - 20px); left: 0; display: none; z-index: 1000; top: calc(100% + 5px);' });
        searchContainer.appendChild(searchResults);
        searchInput.addEventListener('focus', () => triggerSearch(filterDropdown, searchInput, searchResults));
        searchInput.addEventListener('input', () => triggerSearch(filterDropdown, searchInput, searchResults));
        searchInput.addEventListener('blur', () => setTimeout(() => searchResults.style.display = 'none', 200));
        searchInput.addEventListener('keydown', (event) => handleKeyboardNavigation(event, searchResults));
        filterDropdown.addEventListener('change', () => triggerSearch(filterDropdown, searchInput, searchResults));
        return searchContainer;
    };

    const triggerSearch = (filterDropdown, searchInput, searchResults) => {
        const query = searchInput.value.trim().toLowerCase();
        if (!query) {
            searchResults.style.display = 'none';
            return;
        }

        const filter = filterDropdown.value;
        const songBlocks = document.querySelectorAll('.cqcBlock.cqcSongBlock');
        const animeBlocks = document.querySelectorAll('.cqcBlock.cqcAnimeBlock');
        let blocks = [];
        if (filter === "anime") { blocks = Array.from(animeBlocks); }
        else if (filter === "song" || filter === "artist") { blocks = Array.from(songBlocks); }
        else { blocks = Array.from([...songBlocks, ...animeBlocks]); }

        const results = blocks.filter(container => {
            const animeInfo = container.querySelector('.cqcAnimeBlockName') || container.querySelector('.cqcSongAnimeInfo');
            const artistInfo = container.querySelector('.cqcSongArtist.aicTrigger');
            const songNameInfo = container.querySelector('.cqcSongName');
            const animeText = animeInfo ? animeInfo.innerText.toLowerCase() : '';
            const artistText = artistInfo ? artistInfo.innerText.toLowerCase() : '';
            const songNameText = songNameInfo ? songNameInfo.innerText.toLowerCase() : '';

            if (filter === "all") return animeText.includes(query) || artistText.includes(query) || songNameText.includes(query);
            if (filter === "anime") return animeText.includes(query);
            if (filter === "song") return songNameText.includes(query);
            if (filter === "artist") return artistText.includes(query);
            return false;
        });

        searchResults.innerHTML = '';
        if (results.length > 0) {
            const queriesForHighlight = [query];
            results.forEach((container, index) => {
                const animeInfo = container.querySelector('.cqcAnimeBlockName') || container.querySelector('.cqcSongAnimeInfo');
                const artistInfo = container.querySelector('.cqcSongArtist.aicTrigger');
                const songNameInfo = container.querySelector('.cqcSongName');
                let layout = `<div style="font-size:1em;line-height:1.4em;">`;

                if (filter === "anime") { if (animeInfo) layout += `<span style="font-weight:bold;color:#49d;">Anime:</span> ${highlightQuery(animeInfo.innerText, queriesForHighlight)}<br>`; }
                else if (filter === "song") {
                    if (songNameInfo) layout += `<span style="font-weight:bold;color:#fda;">Song:</span> ${highlightQuery(songNameInfo.innerText, queriesForHighlight)}<br>`;
                    if (animeInfo) layout += `<span style="color:#aaa;">Anime:</span> ${animeInfo.innerText}<br>`;
                    if (artistInfo) layout += `<span style="color:#aaa;">Artist:</span> ${artistInfo.innerText}<br>`;
                } else if (filter === "artist") {
                    if (artistInfo) layout += `<span style="font-weight:bold;color:#7fa;">Artist:</span> ${highlightQuery(artistInfo.innerText, queriesForHighlight)}<br>`;
                    if (songNameInfo) layout += `<span style="color:#aaa;">Song:</span> ${songNameInfo.innerText}<br>`;
                    if (animeInfo) layout += `<span style="color:#aaa;">Anime:</span> ${animeInfo.innerText}<br>`;
                } else {
                    if (animeInfo) layout += `<span style="font-weight:bold;color:#49d;">Anime:</span> ${highlightQuery(animeInfo.innerText, queriesForHighlight)}<br>`;
                    if (songNameInfo) layout += `<span style="font-weight:bold;color:#fda;">Song:</span> ${highlightQuery(songNameInfo.innerText, queriesForHighlight)}<br>`;
                    if (artistInfo) layout += `<span style="font-weight:bold;color:#7fa;">Artist:</span> ${highlightQuery(artistInfo.innerText, queriesForHighlight)}<br>`;
                }

                layout += `</div>`;
                const resultItem = createElement('div', { className: 'search-result-item', style: 'padding: 10px; cursor: pointer; border-bottom: 1px solid #555; transition: background-color 0.2s;' });
                resultItem.dataset.index = index;
                resultItem.innerHTML = layout;
                resultItem.addEventListener('mouseover', () => resultItem.style.backgroundColor = '#333');
                resultItem.addEventListener('mouseout', () => resultItem.style.backgroundColor = 'transparent');
                resultItem.addEventListener('click', () => selectResult(container, searchResults));
                searchResults.appendChild(resultItem);
            });
            activeResultIndex = -1;
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = `<div style="padding:12px;color:#888;text-align:center;">No results found.</div>`;
            searchResults.style.display = 'block';
        }
    };

    const highlightQuery = (text, queries) => {
        let html = text;
        queries.forEach(q => { if (q) html = html.replace(new RegExp(`(${escapeRegExp(q)})`, 'gi'), '<span style="color: yellow; background:#333; font-weight:bold;">$1</span>'); });
        return html;
    };

    const handleKeyboardNavigation = (event, searchResults) => {
        const results = searchResults.querySelectorAll('.search-result-item');
        if (results.length === 0) return;
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (activeResultIndex < results.length - 1) { activeResultIndex++; updateActiveResult(results); results[activeResultIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (activeResultIndex > 0) { activeResultIndex--; updateActiveResult(results); results[activeResultIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        } else if (event.key === 'Enter') {
            event.preventDefault();
            if (activeResultIndex >= 0 && activeResultIndex < results.length) { results[activeResultIndex].click(); }
        }
    };

    const updateActiveResult = (results) => {
        results.forEach((result, index) => { result.style.backgroundColor = index === activeResultIndex ? '#444' : 'transparent'; });
    };

    const selectResult = (container, searchResults) => {
        const mainContainer = container.querySelector('.cqcBlockMainContainer');
        if (mainContainer) {
            mainContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
            let originalHighlightClass = '';
            if (mainContainer.classList.contains('duplicate-highlight-red')) { originalHighlightClass = 'duplicate-highlight-red'; }
            else if (mainContainer.classList.contains('duplicate-highlight-orange')) { originalHighlightClass = 'duplicate-highlight-orange'; }
            if (originalHighlightClass) { mainContainer.classList.remove(originalHighlightClass); }
            mainContainer.classList.add('highlight-yellow');
            setTimeout(() => {
                mainContainer.classList.remove('highlight-yellow');
                if (originalHighlightClass) { mainContainer.classList.add(originalHighlightClass); }
            }, 2000);
        }
        searchResults.style.display = 'none';
    };

    const highlightDuplicates = (blockContainers) => {
        const seenSongs = new Map();
        blockContainers.forEach(container => {
            container.classList.remove('duplicate-highlight-red', 'duplicate-highlight-orange');
            const artistInfo = container.querySelector('.cqcSongArtist.aicTrigger');
            const songNameInfo = container.querySelector('.cqcSongName');
            if (artistInfo && songNameInfo) {
                const primaryKey = `${artistInfo.textContent.trim()}|${songNameInfo.textContent.trim()}`;
                let samplePointValue = 'N/A';
                const samplePointRule = container.querySelector('.cqcBlockRuleSamplePoint');
                if (samplePointRule) {
                    const isRandomActive = samplePointRule.querySelector('.cqcBlockRuleChangeSliderRandomButton.active');
                    if (isRandomActive) {
                        const randomInput = samplePointRule.querySelector('input.cqcBlockRuleChangeRandomSlider');
                        if (randomInput) samplePointValue = randomInput.value;
                    } else {
                        const baseInput = samplePointRule.querySelector('input.cqcBlockRuleChangeBaseSlider');
                        if (baseInput) samplePointValue = baseInput.value;
                    }
                }
                if (!seenSongs.has(primaryKey)) { seenSongs.set(primaryKey, []); }
                seenSongs.get(primaryKey).push({ container, samplePoint: samplePointValue });
            }
        });
        for (const songEntries of seenSongs.values()) {
            if (songEntries.length < 2) continue;
            const samplePointGroups = new Map();
            songEntries.forEach(entry => {
                if (!samplePointGroups.has(entry.samplePoint)) { samplePointGroups.set(entry.samplePoint, []); }
                samplePointGroups.get(entry.samplePoint).push(entry.container);
            });
            if (samplePointGroups.size > 1) {
                for (const containers of samplePointGroups.values()) {
                    if (containers.length > 1) { containers.forEach(c => c.classList.add('duplicate-highlight-red')); }
                    else { containers.forEach(c => c.classList.add('duplicate-highlight-orange')); }
                }
            } else { songEntries.forEach(entry => { entry.container.classList.add('duplicate-highlight-red'); }); }
        }
    };

    // ======[ Feature: Import/Export Content & Statistics UI ]======
    const injectUI = () => {
        const saveButton = document.getElementById('cqcQuizCreatorSaveButton');
        const buttonContainer = saveButton?.parentElement;
        if (!buttonContainer || document.getElementById('amq-btn-export')) return;

        const exportButton = saveButton.cloneNode(true);
        exportButton.id = 'amq-btn-export';
        const exportIcon = exportButton.querySelector('i');
        const exportText = exportButton.querySelector('div');
        if(exportIcon) exportIcon.className = 'fa fa-upload';
        if(exportText) exportText.textContent = 'Export';
        exportButton.style.backgroundColor = '#337ab7';

        const importButton = saveButton.cloneNode(true);
        importButton.id = 'amq-btn-import';
        const importIcon = importButton.querySelector('i');
        const importText = importButton.querySelector('div');
        if(importIcon) importIcon.className = 'fa fa-download';
        if(importText) importText.textContent = 'Import';
        importButton.style.backgroundColor = '#5cb85c';

        const statsButton = saveButton.cloneNode(true);
        statsButton.id = 'amq-btn-stats';
        const statsIcon = statsButton.querySelector('i');
        const statsText = statsButton.querySelector('div');
        if(statsIcon) statsIcon.className = 'fa fa-bar-chart';
        if(statsText) statsText.textContent = 'Statistics';
        statsButton.style.backgroundColor = '#f0ad4e';

        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.id = 'amq-file-input';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';

        buttonContainer.appendChild(exportButton);
        buttonContainer.appendChild(importButton);
        buttonContainer.appendChild(statsButton);
        buttonContainer.appendChild(fileInput);

        const statsModal = createElement('div', { id: 'cqcStatsModal', className: 'cqc-modal' });
        statsModal.innerHTML = `
            <div class="cqc-modal-content">
                <div class="cqc-modal-header">
                    <span id="cqcStatsModalClose" class="cqc-modal-close">&times;</span>
                    <h2>Quiz Statistics</h2>
                </div>
                <div id="cqcStatsModalBody" class="cqc-modal-body">
                    <p>Loading statistics...</p>
                </div>
            </div>
        `;
        document.getElementById('customQuizCreatorPage').appendChild(statsModal);


        addEventListeners();
    };

    const addEventListeners = () => {
        const fileInput = document.getElementById('amq-file-input');
        const exportButton = document.getElementById('amq-btn-export');
        const importButton = document.getElementById('amq-btn-import');
        const statsButton = document.getElementById('amq-btn-stats');
        const statsModal = document.getElementById('cqcStatsModal');
        const statsModalClose = document.getElementById('cqcStatsModalClose');

        $(exportButton).popover({
            placement: "bottom",
            trigger: "hover",
            content: "Export songs from the selected Rule block",
            container: "#customQuizCreatorPage"
        });

        $(importButton).popover({
            placement: "bottom",
            trigger: "hover",
            content: "Import songs into the selected Rule block",
            container: "#customQuizCreatorPage"
        });

         $(statsButton).popover({
            placement: "bottom",
            trigger: "hover",
            content: "Show a summary of the entire quiz",
            container: "#customQuizCreatorPage"
        });

        exportButton.addEventListener('click', () => {
            const selectedRuleBlock = customQuizCreator.builder.selectedRuleBlock;
            if (!selectedRuleBlock) return;

            const blockData = selectedRuleBlock.generateBlockSave();
            const contentToExport = blockData.blocks;
            const jsonString = JSON.stringify(contentToExport, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'amq-quiz-content.json';
            a.click();
            URL.revokeObjectURL(url);
        });

        importButton.addEventListener('click', () => {
            const targetRuleBlock = customQuizCreator.builder.selectedRuleBlock;
            if (!targetRuleBlock) return;
            fileInput.click();
        });

        statsButton.addEventListener('click', () => {
            updateQuizStatistics();
            statsModal.style.display = 'block';
        });

        statsModalClose.addEventListener('click', () => {
            statsModal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target == statsModal) {
                statsModal.style.display = 'none';
            }
        });

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const targetRuleBlock = customQuizCreator.builder.selectedRuleBlock;
            if (!targetRuleBlock) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedContent = JSON.parse(e.target.result);
                    if (!Array.isArray(importedContent)) throw new Error("Invalid format");
                    let newBlocksAdded = 0;
                    const targetInnerIds = getInnerBlockIds(targetRuleBlock);

                    importedContent.forEach(innerBlockInfo => {
                        const innerId = innerBlockInfo.annId ? `anime-${innerBlockInfo.annId}` : (innerBlockInfo.annSongId ? `song-${innerBlockInfo.annSongId}` : null);
                        if (innerId && !targetInnerIds.has(innerId)) {
                            const newBlock = createBlockFromData(innerBlockInfo);
                            if (newBlock) {
                                targetRuleBlock.addBlock(newBlock);
                                newBlocksAdded++;
                            }
                        }
                    });
                    console.log(`Import complete! New blocks added: ${newBlocksAdded}`);
                } catch (error) {
                    console.error("Import failed:", error);
                } finally {
                    fileInput.value = '';
                }
            };
            reader.readAsText(file);
        });
    };

    const addStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .highlight-yellow { background-color: yellow !important; z-index: 1; position: relative; }
            .duplicate-highlight-red { background-color: #ff2c2c !important; }
            .duplicate-highlight-orange { background-color: #ff8c00 !important; }
            /* Modal Styles */
            .cqc-modal { display: none; position: fixed; z-index: 1050; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
            .cqc-modal-content { background-color: #2c2c2c; margin: 5% auto; padding: 0; border: 1px solid #888; width: 80%; max-width: 800px; border-radius: 5px; color: #f1f1f1; animation-name: animatetop; animation-duration: 0.4s; }
            @keyframes animatetop { from {top: -300px; opacity: 0} to {top: 0; opacity: 1} }
            .cqc-modal-header { padding: 10px 16px; background-color: #353535; color: white; border-bottom: 1px solid #444; border-radius: 5px 5px 0 0; }
            .cqc-modal-header h2 { margin: 0; }
            .cqc-modal-body { padding: 16px; }
            .cqc-modal-close { color: #aaa; float: right; font-size: 28px; font-weight: bold; }
            .cqc-modal-close:hover, .cqc-modal-close:focus { color: white; text-decoration: none; cursor: pointer; }
            /* Stats Content Styles */
            .cqc-stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; font-size: 1.1em; margin-bottom: 15px; }
            .cqc-stats-group { background: #353535; padding: 10px; border-radius: 4px; margin-bottom: 15px; }
            .cqc-stats-item { font-size: 1.1em; padding: 5px; background: #353535; border-radius: 4px; text-align: center; }
            .cqc-stats-item-header { font-size: 1.1em; padding: 5px; font-weight: bold; }
            .cqc-stats-sub-list { border-left: 2px solid #555; margin-top: 8px; padding-left: 15px; display: grid; gap: 8px; }
            .cqc-stats-sub-list.song-types { grid-template-columns: repeat(3, 1fr); }
            .cqc-stats-sub-list.algo-types { grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
            .cqc-stats-sub-item { font-size: 0.9em; }
            .cqc-stats-list-container { display: flex; gap: 15px; align-items: flex-start; }
            .cqc-stats-list { font-size: 1.1em; flex: 1; min-width: 0; }
            .cqc-stats-list ol { list-style-type: none; padding: 0; margin-top: 5px; height: 260px; overflow-y: auto; padding-right: 5px; }
            .cqc-stats-list ol::-webkit-scrollbar { width: 8px; }
            .cqc-stats-list ol::-webkit-scrollbar-track { background: #222; border-radius: 4px; }
            .cqc-stats-list ol::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
            .cqc-stats-top-item { position: relative; display: flex; align-items: center; padding: 5px 8px; border-radius: 3px; margin-bottom: 4px; overflow: hidden; background-color: #222; }
            .cqc-stats-top-bar { position: absolute; left: 0; top: 0; height: 100%; opacity: 0.3; z-index: 1; transition: width 0.3s ease; }
            .cqc-stats-top-bar.anime-bar { background-color: #ff8ab3; }
            .cqc-stats-top-bar.artist-bar { background-color: #88e5c3; }
            .cqc-stats-top-rank, .cqc-stats-top-name, .cqc-stats-top-count { position: relative; z-index: 2; }
            .cqc-stats-top-rank { font-weight: bold; margin-right: 8px; }
            .cqc-stats-top-name { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; text-align: left; }
            .cqc-stats-top-count { font-weight: bold; font-size: 0.9em; color: #ddd; margin-left: 8px; white-space: nowrap; flex-shrink: 0; }

            .cqc-stat-total { color: gold; font-weight: bold; }
            .cqc-stat-songblock { color: #49d; font-weight: bold; }
            .cqc-stat-algoblock { color: #8c8c8c; font-weight: bold; }
            .cqc-stat-animeblock { color: #ffb300; font-weight: bold; }
            .cqc-stat-algo { color: #ab9eff; font-weight: bold; }
            .cqc-stat-anime { color: #ff8ab3; font-weight: bold; }
            .cqc-stat-artist { color: #88e5c3; font-weight: bold; }
            .cqc-stat-op { color: #ffb300; font-weight: bold; }
            .cqc-stat-ed { color: #95d5ff; font-weight: bold; }
            .cqc-stat-in { color: #90ee90; font-weight: bold; }
            .cqc-stat-percent { color: #aaa; font-size: 0.9em; }

            .cqc-stats-divider { border: 0; border-top: 1px solid #444; margin: 15px 0; }
        `;
        document.head.appendChild(style);
    };

    const setupDynamicEventListeners = () => {
        const handleSamplePointChange = (event) => {
            const randomButton = event.target.closest('.cqcBlockRuleSamplePoint .cqcBlockRuleChangeSliderRandomButton');
            const sliderInput = event.target.matches('.cqcBlockRuleSamplePoint input.sliderInput');
            if (randomButton || sliderInput) {
                setTimeout(() => requestAnimationFrame(updateOtherFeatures), 50);
            }
        };
        document.body.addEventListener('click', handleSamplePointChange);
        document.body.addEventListener('change', handleSamplePointChange);
    };

    const initializeAllFeatures = () => {
        //console.log("AMQ Enhanced Builder: UI ready, initializing all features.");
        addStyles();
        setupDynamicEventListeners();
        injectUI();
        setTimeout(updateOtherFeatures, 1000);
    };

    new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldUpdate = true;
                break;
            }
        }
        if (shouldUpdate) {
            requestAnimationFrame(updateOtherFeatures);
        }
    }).observe(document.body, { childList: true, subtree: true });

    const checkInterval = setInterval(() => {
        const saveButton = document.getElementById('cqcQuizCreatorSaveButton');
        const creatorPage = document.getElementById('customQuizCreatorPage');

        if (creatorPage && creatorPage.classList.contains('gamePage') && saveButton?.parentElement && typeof customQuizCreator !== 'undefined' && !isInitialized) {
            clearInterval(checkInterval);
            isInitialized = true;
            requestAnimationFrame(initializeAllFeatures);
        }
    }, POLLING_INTERVAL);
})();
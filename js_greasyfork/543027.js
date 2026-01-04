// ==UserScript==
// @name         HDRezka IMDb Episode Ratings (OMDB API)
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Додає рейтинги епізодів з IMDb до HDRezka через OMDB API
// @author       You
// @match        https://hdrezka.me/series/*
// @exclude      https://hdrezka.me/series/?filter=watching
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543027/HDRezka%20IMDb%20Episode%20Ratings%20%28OMDB%20API%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543027/HDRezka%20IMDb%20Episode%20Ratings%20%28OMDB%20API%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.search.includes('filter=watching')) return;

    // Ваш API ключ для OMDB
    const OMDB_API_KEY = YOU_KEY;

    // Кеш для зберігання рейтингів
    const ratingsCache = {};

    // Додаємо CSS стилі для рейтингів
    function addRatingStyles() {
        if (document.getElementById('hdrezka-rating-styles')) return;

        const style = document.createElement('style');
        style.id = 'hdrezka-rating-styles';
        style.textContent = `
            .td-rating .rating-value {
                padding-left: 29px;
                background-size: auto 24px;
                background-position: left center;
                background-repeat: no-repeat;
                background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAABmJLR0QA/wD/AP+gvaeTAAAEu0lEQVR4nO2czYscRRiHn+nxY7ORdc1ulGgQYoxGNwbEKIoHDxpQNGxEURQPQQ34D/gRCFE8hJCDIIoHz7noRTeCB4MmB0OMHxFRE0wkStCIGM0SV1fDJuOhetze2uqu/piZ7u35PfAyzLxVv3q73uma6uquASGEEEIIIYQQQgghhBBCCCGEEEIIIUTdaCT4LgM2AuPAamA5sLgXQdWAv4CfgCPAbuBd4HTayouALcAk0JJ1xE4DLwADvs6/Evi0AgHX1b4Erk7q/BMVCLLudiLs6zksAj6rQHD9YgcJh6NmmIDngSfsrIiucRUwBexvYGY7PwCXlhpS/zEJXBMAD6LOL4NhYDwANpQdSR+zIQDGyo6ijxlrAH8Cl5QdSZ8y1cBMi7LyD7ATM3W9DXiWuVd508AO4BBwR+i/MIP+v8B2zHTtduZfRbbbPwDMRD4fAJYBK4H7gTUdOp6ukmce+5Sl8bTl32T57wPOptQ+C9xr1X/S034c1wG7gHMFj6eblqvSkBXwkOV3LdptAs57dM8zP3mEeknt+1gHHC9wPJVLgAufH2CrR3drQt00+kmMAh/HtOtrrzYJAHgtRvNNT72iCQDzzf7W0bavvVoloAlMWOUnmF0WicOnvwd4D3gVuJv4ex3XA3+n0KttAgAGMTOYVvg6mKJO1g47AFwbU3ZHCr17LHsA2Iz5Uf/D0d6CSgCYMXl3+JqGPN/Y33FfaA4DZzLGG2UxsI35Z9KCSkBW8iSgBXwHXOQo/5ZHLw23Aj8ntF2pBKxLeVBx5fImoAU84yj/uEcvLWsxqwmVT8CvmCvUJFaG5fLoJ8X7kaP8Wo9eFjZ72o+1vEsRrhlGK4X/GHAn8JvDvxTYD6wqoB/HqVA/ymgkDpfeHuv9NPAhZro8bfmawNfADQkxxNKrM6Dt+4T5s57B8PNO6LvM7jAwaz159D7H3MK12eKJofQhKOr/gNnZz9LwfSf1bTvqKL+igN5OR/lbPHUqlYAWZgXySPjaDf2oveEof1cBvZOO8qOeOpVLQK/0Z4AbHeVfLhCvb0hLbUFM43ViO3DY8fnGAppfOD5blleszmfAK4DrS7a+QLznwvo2D2U8xtoOQTPAXsyCnIsAc6cuT7y/AA/HlN/lOSanXRAjthBZj1n7+ZHkJ5FfAm5OqRflFPANc2+BtlkFPJJC00ldzoA0PIb7rlwRmpiLtjz9mHsIssfVIKO/0/o+Gpgb+3H3hvNORhrA6zGaXU2AvcS7xuO/qcv6SYwB72dsLw0jwDsZjqmjCdgLLAkDWQLss/z7Iv4Rh7+oftTvYgh4FHgbM2Znac/HauBFzO9M0c7PvRgH5uneY5gfINeDXVPA96E/z9amNPpfMfeiaAQzH7+C5O1Xce3ZelFGME81X55RN5EiCRAdIMBkXpTDmQD3wpLoDScD3OskojccDjBPJohymGhvUTqOeVRD9I5JYEUTc0MkIH7xSnSHbUQeFhhAG7R7af9vU42ijdq9MedG7WgSDlYgyLraIRL+qqDNAGbjdkfWOmS0wr58DrjY7uyk9ZJhzF/VjGMeOFqONvOlZYrZv6uZCG2y1IiEEEIIIYQQQgghhBBCCCGEEEIIIYQQPeM/uURowB/mrvMAAAAASUVORK5CYII=');
                color: #666;
            }

            .td-rating .rating-value.low {
                filter: invert(30%) sepia(53%) saturate(2254%) hue-rotate(337deg) brightness(97%) contrast(95%);
            }

            .td-rating .rating-value.medium {
                filter: invert(66%) sepia(77%) saturate(1448%) hue-rotate(347deg) brightness(99%) contrast(91%);
            }

            .td-rating .rating-value.high {
                filter: invert(68%) sepia(79%) saturate(5115%) hue-rotate(105deg) brightness(99%) contrast(99%);
            }
        `;
        document.head.appendChild(style);
    }

    // Функція для отримання назви серіалу зі сторінки
    function getSeriesTitle() {
        // Шукаємо англійську назву в елементі b-post__origtitle
        const origTitleElement = document.querySelector('.b-post__origtitle');
        if (origTitleElement) {
            let titleText = origTitleElement.textContent.trim();
            if (titleText) {
                // Якщо назва містить слеш, беремо частину після слешу (англійська назва)
                if (titleText.includes(' / ')) {
                    const parts = titleText.split(' / ');
                    titleText = parts[parts.length - 1].trim(); // Остання частина після останнього слешу
                }
                console.log('🎬 Знайдено оригінальну назву:', titleText);
                return titleText;
            }
        }

        // Fallback - шукаємо в мета-тегах
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            const ogContent = ogTitle.getAttribute('content');
            // Витягуємо англійську частину з og:title
            const englishMatch = ogContent.match(/\(([^)]+)\)\s*\d{4}/);
            if (englishMatch) {
                return englishMatch[1].trim();
            }
        }

        // Якщо не знайшли, шукаємо в основній інформації
        const infoItems = document.querySelectorAll('.b-post__info tr');
        for (let item of infoItems) {
            const label = item.querySelector('td:first-child');
            const value = item.querySelector('td:last-child');

            if (label && value) {
                const labelText = label.textContent.trim().toLowerCase();
                if (labelText.includes('оригинальное название') || labelText.includes('original title')) {
                    return value.textContent.trim();
                }
            }
        }

        return null;
    }

    // Функція для пошуку серіалу через OMDB API
    async function searchSeriesOMDB(title) {
        const cacheKey = `omdb_series_${title}`;
        const cached = GM_getValue(cacheKey);

        if (cached) {
            const cachedData = JSON.parse(cached);
            if (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) { // 24 години кеш
                console.log('📋 Використовуємо кеш для серіалу:', cachedData.data);
                return cachedData.data;
            }
        }

        const searchUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&type=series`;
        console.log('🔍 Пошук серіалу через OMDB:', searchUrl);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: function(response) {
                    console.log('📥 Відповідь OMDB для серіалу:', response.status);

                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.Response === 'True' && data.imdbID) {
                            console.log('✅ Серіал знайдено:', data.Title, data.imdbID);

                            const seriesData = {
                                imdbID: data.imdbID,
                                title: data.Title,
                                totalSeasons: data.totalSeasons || 'N/A'
                            };

                            // Зберігаємо в кеш
                            GM_setValue(cacheKey, JSON.stringify({
                                data: seriesData,
                                timestamp: Date.now()
                            }));

                            resolve(seriesData);
                        } else {
                            console.log('❌ Серіал не знайдено:', data.Error || 'Невідома помилка');
                            resolve(null);
                        }
                    } catch (e) {
                        console.error('❌ Помилка парсингу відповіді OMDB:', e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error('❌ Помилка запиту до OMDB:', error);
                    resolve(null);
                }
            });
        });
    }

    // Функція для отримання рейтингів сезону через OMDB API
    async function getSeasonRatings(imdbID, season) {
        const cacheKey = `omdb_season_${imdbID}_${season}`;
        const cached = ratingsCache[cacheKey] || GM_getValue(cacheKey);

        if (cached) {
            const cachedData = typeof cached === 'string' ? JSON.parse(cached) : cached;
            if (Date.now() - cachedData.timestamp < 24 * 60 * 60 * 1000) { // 24 години кеш
                console.log(`📋 Використовуємо кеш для сезону ${season}:`, cachedData.data);
                return cachedData.data;
            }
        }

        const seasonUrl = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${imdbID}&Season=${season}`;
        console.log(`🔍 Завантажуємо сезон ${season}:`, seasonUrl);

        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: seasonUrl,
                onload: function(response) {
                    console.log(`📥 Відповідь OMDB для сезону ${season}:`, response.status);

                    try {
                        const data = JSON.parse(response.responseText);

                        if (data.Response === 'True' && data.Episodes) {
                            console.log(`✅ Сезон ${season} завантажено, епізодів: ${data.Episodes.length}`);

                            // Створюємо об'єкт для швидкого пошуку
                            const episodeRatings = {};
                            data.Episodes.forEach(episode => {
                                episodeRatings[parseInt(episode.Episode)] = {
                                    rating: episode.imdbRating !== 'N/A' ? parseFloat(episode.imdbRating) : null,
                                    title: episode.Title,
                                    imdbID: episode.imdbID
                                };
                            });

                            // Зберігаємо в кеш
                            const seasonData = {
                                episodes: episodeRatings,
                                totalEpisodes: data.Episodes.length
                            };

                            ratingsCache[cacheKey] = {
                                data: seasonData,
                                timestamp: Date.now()
                            };
                            GM_setValue(cacheKey, JSON.stringify(ratingsCache[cacheKey]));

                            resolve(seasonData);
                        } else {
                            console.log(`❌ Сезон ${season} не знайдено:`, data.Error || 'Невідома помилка');
                            resolve(null);
                        }
                    } catch (e) {
                        console.error(`❌ Помилка парсингу сезону ${season}:`, e);
                        resolve(null);
                    }
                },
                onerror: function(error) {
                    console.error(`❌ Помилка запиту сезону ${season}:`, error);
                    resolve(null);
                }
            });
        });
    }

    // Функція для отримання класу рейтингу (high/medium/low)
    function getRatingClass(rating) {
        if (rating >= 7.5) return 'high';
        if (rating >= 6.0) return 'medium';
        return 'low';
    }

    // Функція для створення HTML рейтингу
    function createRatingHTML(rating) {
        if (rating === null || rating === undefined) {
            return '<span class="rating-value">N/A</span>';
        }

        const ratingClass = getRatingClass(rating);
        return `<span class="rating-value ${ratingClass}"><b>${rating.toFixed(1)}</b></span>`;
    }

    // Функція для додавання колонки рейтингів до всіх таблиць
    function addRatingColumns() {
        const tables = document.querySelectorAll('.b-post__schedule_table');
        if (tables.length === 0) return false;

        let addedCount = 0;

        tables.forEach(table => {
            // Перевіряємо чи вже додана колонка в цій таблиці
            if (table.querySelector('.td-rating')) {
                addedCount++;
                return; // Колонка вже існує в цій таблиці
            }

            const rows = table.querySelectorAll('tbody tr');

            rows.forEach(row => {
                if (row.querySelector('.load-more')) return;

                const ratingTd = document.createElement('td');
                ratingTd.className = 'td-rating';
                ratingTd.style.cssText = 'text-align: center; min-width: 70px; padding: 5px;';
                ratingTd.innerHTML = '<span class="rating-value">⏳</span>';

                // Вставляємо між td-2 і td-3
                const td2 = row.querySelector('.td-2');
                const td3 = row.querySelector('.td-3');
                if (td2 && td3) {
                    row.insertBefore(ratingTd, td3);
                }
            });

            if (rows.length > 0) addedCount++;
        });

        console.log(`📊 Додано колонки рейтингів до ${addedCount} таблиць з ${tables.length}`);
        return addedCount > 0;
    }

    // Функція для парсингу номеру сезону та серії
    function parseEpisodeInfo(episodeText) {
        const match = episodeText.match(/(\d+)\s+сезон\s+(\d+)\s+серия/);
        if (match) {
            return {
                season: parseInt(match[1]),
                episode: parseInt(match[2])
            };
        }
        return null;
    }

    // Функція для оновлення всіх рейтингів одним значенням
    function updateAllRatings(value) {
        const ratingCells = document.querySelectorAll('.td-rating');
        ratingCells.forEach(cell => {
            cell.innerHTML = `<span class="rating-value">${value}</span>`;
        });
    }

    // Головна функція для завантаження рейтингів
    async function loadRatings() {
        const seriesTitle = getSeriesTitle();
        if (!seriesTitle) {
            console.log('❌ Не вдалося знайти назву серіалу');
            updateAllRatings('N/A');
            return;
        }

        console.log('🔍 Шукаємо серіал:', seriesTitle);

        const seriesData = await searchSeriesOMDB(seriesTitle);
        if (!seriesData || !seriesData.imdbID) {
            console.log('❌ Серіал не знайдено на OMDB');
            updateAllRatings('N/A');
            return;
        }

        console.log('✅ Знайдено серіал:', seriesData.title, seriesData.imdbID);

        const tables = document.querySelectorAll('.b-post__schedule_table');
        if (tables.length === 0) {
            console.log('❌ Таблиці серій не знайдені');
            return;
        }

        console.log(`📋 Знайдено ${tables.length} таблиць з сезонами`);
        console.log(`📋 Знайдено ${tables.length} таблиць з сезонами`);

        // Збираємо інформацію про всі епізоди з усіх таблиць
        const episodesInfo = [];
        const seasonNumbers = new Set();

        tables.forEach((table, tableIndex) => {
            const rows = table.querySelectorAll('tbody tr');
            console.log(`📊 Таблиця ${tableIndex + 1}: ${rows.length} рядків`);

            rows.forEach(row => {
                if (row.querySelector('.load-more')) return;

                const episodeCell = row.querySelector('.td-1');
                if (!episodeCell) return;

                const episodeInfo = parseEpisodeInfo(episodeCell.textContent);
                if (!episodeInfo) return;

                const ratingCell = row.querySelector('.td-rating');
                if (!ratingCell) return;

                episodesInfo.push({
                    ...episodeInfo,
                    ratingCell: ratingCell,
                    tableIndex: tableIndex
                });

                seasonNumbers.add(episodeInfo.season);
            });
        });

        console.log(`📊 Знайдено ${episodesInfo.length} епізодів у ${seasonNumbers.size} сезонах`);

        // Завантажуємо рейтинги для кожного сезону
        const seasonRatings = {};

        for (let seasonNumber of seasonNumbers) {
            console.log(`🎬 Завантажуємо сезон ${seasonNumber}...`);

            const seasonData = await getSeasonRatings(seriesData.imdbID, seasonNumber);
            if (seasonData) {
                seasonRatings[seasonNumber] = seasonData.episodes;
                console.log(`✅ Сезон ${seasonNumber} завантажено з ${seasonData.totalEpisodes} епізодами`);
            } else {
                console.log(`❌ Сезон ${seasonNumber} не завантажено`);
                seasonRatings[seasonNumber] = {};
            }

            // Затримка між сезонами
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        // Оновлюємо рейтинги для кожного епізоду
        let updatedCount = 0;

        for (let episodeInfo of episodesInfo) {
            const seasonEpisodes = seasonRatings[episodeInfo.season];
            if (seasonEpisodes && seasonEpisodes[episodeInfo.episode]) {
                const episodeData = seasonEpisodes[episodeInfo.episode];
                episodeInfo.ratingCell.innerHTML = createRatingHTML(episodeData.rating);

                if (episodeData.rating !== null) {
                    console.log(`✅ S${episodeInfo.season}E${episodeInfo.episode}: ${episodeData.rating}`);
                    updatedCount++;
                } else {
                    console.log(`❌ S${episodeInfo.season}E${episodeInfo.episode}: рейтинг недоступний`);
                }
            } else {
                episodeInfo.ratingCell.innerHTML = createRatingHTML(null);
                console.log(`❌ S${episodeInfo.season}E${episodeInfo.episode}: епізод не знайдено`);
            }
        }

        console.log(`🏁 Завершено! Оновлено ${updatedCount} з ${episodesInfo.length} епізодів`);
    }

    // Ініціалізація
    let isInitialized = false;

    function init() {
        // Запобігаємо подвійному виклику
        if (isInitialized) return;

        // Перевіряємо чи є таблиця з серіями
        const scheduleBlock = document.querySelector('.b-post__schedule_block');
        if (!scheduleBlock) return;

        // Додаємо CSS стилі
        addRatingStyles();

        const columnsAdded = addRatingColumns();
        if (!columnsAdded) return;

        isInitialized = true;
        console.log('🚀 Ініціалізація HDRezka IMDb рейтингів...');
        loadRatings();
    }

    // Запускаємо скрипт після завантаження сторінки
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Невелика затримка для динамічного контенту
        setTimeout(init, 1000);
    }

})();
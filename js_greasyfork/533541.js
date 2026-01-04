// ==UserScript==
// @name         AniList — Revisit The Moment
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Adds to the home page a list of titles completed 1, 2, 3, N years ago. Inspired by Google Photos Memories.
// @author       chabab
// @match        https://anilist.co/home
// @icon         https://memepedia.ru/wp-content/uploads/2017/08/%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%B2-%D0%BF%D1%80%D0%BE%D0%BA%D0%BB%D1%8F%D1%82%D1%8B%D1%85-%D0%BC%D0%B5%D0%BC.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533541/AniList%20%E2%80%94%20Revisit%20The%20Moment.user.js
// @updateURL https://update.greasyfork.org/scripts/533541/AniList%20%E2%80%94%20Revisit%20The%20Moment.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const userIdRough = document.querySelector('.avatar').style.backgroundImage;
    const userId = userIdRough.match(/b(\d+)-/)?.[1];

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    async function loadData(type, userId) {
        const query = `
    query($type: MediaType!, $userId: Int!) {
        MediaListCollection(type: $type, userId: $userId) {
            lists {
                entries {
                    media {
                        title {
                            userPreferred
                        }
                        type
                        coverImage {
                            medium
                        }
                    }
                    mediaId
                    completedAt {
                        year
                        month
                        day
                    }
                }
            }
        }
    }
`;

        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: {
                    type: type,
                    userId: userId,
                },
            })
        });

        const data = await response.json();
        const allEntries = data?.data?.MediaListCollection?.lists?.[0]?.entries;

        if (allEntries) {
            return filterData(allEntries);
        } else {
            console.log(`Can't get allEntries for ${type}`);
            return [];
        };
    };

    function filterData(entries) {
        const matchingEntries = [];

        for (const entry of entries) {
            const completedAtYear = entry.completedAt?.year;
            const completedAtMonth = entry.completedAt?.month - 1;
            const completedAtDay = entry.completedAt?.day;
            const completedAt = new Date(completedAtYear, completedAtMonth, completedAtDay);

            if (completedAtYear && completedAtMonth && completedAtDay) {
                if (completedAtYear != currentYear) {
                    const yearDiff = currentYear - completedAtYear;
                    const dayDiff = Math.floor(Math.abs((currentDate - completedAt))/(1000*60*60*24)) - 365.25 * yearDiff;
                    if (dayDiff >= -3 && dayDiff <= 3) {
                        //console.log(dayDiff);
                        //console.log(completedAt);
                        matchingEntries.push(entry);
                    };
                };
            }
        };

        return matchingEntries
    };

    async function insertData() {
        const [animeData, mangaData] = await Promise.all([
            loadData("ANIME", userId),
            loadData("MANGA", userId),
        ]);
        const combinedData = [...animeData, ...mangaData];

        const parentElement = document.querySelector('.list-previews').parentElement;
        const masterElement = document.querySelector('.list-previews');
        //console.log(combinedData);

        if (masterElement && parentElement && combinedData.length != 0) {
            const listPreviews = masterElement.cloneNode(false);

            const listPreviewWrap = document.createElement('div');
            listPreviewWrap.classList.add('list-preview-wrap');
            listPreviewWrap.setAttribute('data-v-6aea970d', '');
            listPreviews.appendChild(listPreviewWrap);

            const sectionHeader = document.createElement('div');
            sectionHeader.classList.add('section-header');
            sectionHeader.setAttribute('data-v-6aea970d', '');
            listPreviewWrap.appendChild(sectionHeader);

            const listPreview = document.createElement('div');
            listPreview.classList.add('list-preview');
            listPreview.setAttribute('data-v-6aea970d', '');
            listPreviewWrap.appendChild(listPreview);

            const h2Header = document.querySelector('.list-preview-wrap .section-header h2').cloneNode(true);
            h2Header.innerHTML = "Completion Anniversaries";
            const svg = document.querySelector('.list-preview-wrap .section-header svg').cloneNode(true);

            sectionHeader.appendChild(h2Header);
            sectionHeader.appendChild(svg);

            combinedData.forEach(item => {
                const options = {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                };
                const completedAt = (new Date(item.completedAt.year, item.completedAt.month - 1, item.completedAt.day)).toLocaleDateString('en-US', options);
                const yearDiff = currentYear - item.completedAt.year;

                const mediaPreviewCard = document.createElement('div');
                mediaPreviewCard.classList.add('media-preview-card', 'small');
                mediaPreviewCard.setAttribute('data-v-6dc78144', '');
                mediaPreviewCard.setAttribute('data-v-2fd80e52', '');
                mediaPreviewCard.setAttribute('data-v-6aea970d', '');
                listPreview.appendChild(mediaPreviewCard);

                const link = document.createElement('a');
                link.classList.add('cover');
                link.setAttribute('data-v-6dc78144', '');
                link.setAttribute('href', `/${item.media.type.toLowerCase()}/${item.mediaId}`);
                link.setAttribute('data-src', `${item.media.coverImage.medium}`);
                link.setAttribute('lazy', 'loaded');
                link.style.backgroundImage = `url(${item.media.coverImage.medium})`;
                mediaPreviewCard.appendChild(link);

                const imageOverlay = document.createElement('div');
                imageOverlay.classList.add('image-overlay');
                imageOverlay.setAttribute('data-v-6dc78144', '');
                link.appendChild(imageOverlay);

                const IOChild = document.createElement('div');
                IOChild.setAttribute('data-v-2fd80e52', '');
                imageOverlay.appendChild(IOChild);

                const placeholder = document.createElement('div');
                placeholder.classList.add('plus-progress');
                placeholder.setAttribute('data-v-2fd80e52', '');
                if (yearDiff == 1) {
                    placeholder.innerHTML = `${yearDiff} Year`
                } else {
                    placeholder.innerHTML = `${yearDiff} Years`
                };
                IOChild.appendChild(placeholder);

                const content = document.createElement('div');
                content.classList.add('content');
                content.setAttribute('data-v-6dc78144', '');
                mediaPreviewCard.appendChild(content);

                const contentLink = document.createElement('a');
                contentLink.classList.add('title');
                contentLink.setAttribute('href', `/${item.media.type.toLowerCase()}/${item.mediaId}`);
                contentLink.innerHTML = `${item.media.title.userPreferred}`;
                content.appendChild(contentLink);

                const contentInfo = document.createElement('div');
                contentInfo.classList.add('info');
                contentInfo.setAttribute('data-v-6dc78144', '');
                content.appendChild(contentInfo);

                const contentInfoChild = document.createElement('div')
                contentInfoChild.setAttribute('data-v-2fd80e52', '');
                contentInfoChild.setAttribute('data-v-6dc78144', '');
                contentInfoChild.innerHTML = completedAt;
                contentInfo.appendChild(contentInfoChild);

                mediaPreviewCard.appendChild(content);
            })

            masterElement.after(listPreviews);
            parentElement.prepend(listPreviews);
        };
    };

    insertData();

})();
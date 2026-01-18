// ==UserScript==
// @name         MangaDex Customizer
// @namespace    https://github.com/rRoler/UserScripts
// @version      1.0.3
// @description  Customize MangaDex title pages by adding custom alt titles, changing the main title and cover, and adding custom tags\links. All data is stored inside userscript storage.
// @author       Roler
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @match        https://mangadex.org/*
// @match        https://canary.mangadex.dev/*
// @match        https://demo.komga.org/*
// @supportURL   https://github.com/rRoler/UserScripts/issues
// @require      https://cdnjs.cloudflare.com/ajax/libs/validator/13.12.0/validator.min.js#sha256-d2c75e3159ceac9c14dcc8a7aeb09ea30970de6c321c89070e5b0157842c5c88
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526685/MangaDex%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/526685/MangaDex%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const deprecationKey = 'deprecation-acknowledged';
    const isDeprecationAcknowledged = GM_getValue(deprecationKey, false);
    if (!isDeprecationAcknowledged) {
        const message = "⚠️ Userscript Deprecation Notice!\n\n" +
            "The MangaDex Customizer userscript is no longer maintained and will not receive updates."
        alert(message);
        GM_setValue(deprecationKey, true);
    }

    const userScriptId = `mdc-${crypto.randomUUID()}`;

    const storage = {
        mangadex: {
            titles: {
                custom_sections: {
                    id: 'mangadex_titles_custom_sections',
                    defaultValue: 'array'
                },
                data: {
                    id: 'mangadex_titles_data',
                    defaultValue: 'object',
                    custom_sections: {
                        id: 'custom_sections',
                        defaultValue: 'array'
                    },
                    alt_titles: {
                        id: 'alt_titles',
                        defaultValue: 'array'
                    },
                    main_title: {
                        id: 'main_title',
                        defaultValue: 'string'
                    },
                    main_cover: {
                        id: 'main_cover',
                        defaultValue: 'string'
                    }
                },
            }
        }
    };

    const createStorageDefaultValue = (type) => {
        switch (type) {
            case 'array':
                return [];
            case 'object':
                return {};
            default:
                return '';
        }
    };
    const getStorage = (section) => GM_getValue(section.id, createStorageDefaultValue(section.defaultValue));
    const setStorage = (section, value) => GM_setValue(section.id, value);

    const isMd = /^mangadex\.org|canary\.mangadex\.dev$/.test(window.location.hostname);
    const mdTitleOptions = {
        altTitle: {
            add: mdAddAltTitleOptions
        },
        customSection: {
            add: mdAddCustomSectionOptions
        },
        volumeCover: {
            add: mdAddVolumeCoverOptions,
            tab: 'art',
            dynamic: true
        }
    };

    const mdGetTitleStorage = (titleId, section) => {
        const storedData = getStorage(storage.mangadex.titles.data);
        return storedData[titleId] && storedData[titleId][section.id] || createStorageDefaultValue(section.defaultValue);
    }
    const mdSetTitleStorage = (titleId, section, value, del = false, append = false) => {
        const storedData = getStorage(storage.mangadex.titles.data);
        if (!storedData[titleId]) storedData[titleId] = {};

        if (append) {
            if (!storedData[titleId][section.id]) storedData[titleId][section.id] = [];
            if (del) {
                const index = storedData[titleId][section.id].indexOf(value);
                if (index > -1) storedData[titleId][section.id].splice(index, 1);
            } else {
                storedData[titleId][section.id].push(value);
            }
        } else {
            if (del) delete storedData[titleId][section.id];
            else storedData[titleId][section.id] = value;
        }

        try {
            if (storedData[titleId][section.id] && Object.keys(storedData[titleId][section.id]).length < 1)
                delete storedData[titleId][section.id];
            if (Object.keys(storedData[titleId]).length < 1)
                delete storedData[titleId];
        } catch (e) {}

        setStorage(storage.mangadex.titles.data, storedData);
    }

    const mdGetTitleId = (url = window.location.pathname) => {
        const titleIdMatch = url.match(/\/(?:title|manga|covers)\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/);
        return titleIdMatch && titleIdMatch[1];
    }

    const mdGetCoverFileName = (url) => {
        const fileNameMatch = url.match(/\/covers\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[A-Za-z]+)(\.[0-9]+\.[A-Za-z]+)?/);
        return {
            fileName: fileNameMatch && fileNameMatch[1],
            size: fileNameMatch && fileNameMatch[2]
        }
    }

    const mdGetAltTitlesSectionElement = (infoElement) => {
        const fullWidthSections = infoElement.querySelectorAll('.w-full');
        return Array.from(fullWidthSections).find(section => section.querySelector('.alt-title'));
    }

    const mdGetInfoElement = (titleId) => {
        let infoElement = document.querySelector('.flex.flex-wrap.gap-x-4.gap-y-2');
        if (!infoElement) return;
        infoElement = window.getComputedStyle(infoElement).display === 'none' ? document.querySelector(`[id="${titleId}"]`) : infoElement;
        if (!infoElement) return;
        return infoElement;
    }

    const komgaGetSeriesId = (url = window.location.pathname) => {
        const seriesIdMatch = url.match(/\/series\/([0-9A-Za-z]+)/);
        return seriesIdMatch && seriesIdMatch[1];
    }

    let mdTitleOptionsLoaded = false;
    let komgaCurrentSeriesId;
    let scriptErrored = false;
    observeElement(async (mutations, observer) => {
        if (scriptErrored) {
            observer.disconnect();
            alert('The MangaDex Customizer userscript has encountered an error.\nPlease reload the page or disable the userscript if this error persists.');
            return;
        }

        if (isMd && !window.location.pathname.includes('edit')) {
            if (!document.querySelector('.md-content')) return;

            const titleId = mdGetTitleId();

            if (titleId) {
                const currentTabMatch = window.location.search.match(/tab=([a-z]+)/);
                const currentTab = currentTabMatch && currentTabMatch[1] || 'chapters';

                for (const optionId in mdTitleOptions) {
                    const option = mdTitleOptions[optionId];

                    if (!option.tab || option.tab === currentTab) {
                        if (option.dynamic || !option.loaded || option.loadedId !== titleId || option.loadedTab !== currentTab) {
                            try {
                                option.loaded = option.add(titleId);
                                if (option.loaded) {
                                    option.loadedId = titleId;
                                    option.loadedTab = currentTab;
                                    mdTitleOptionsLoaded = true;
                                }
                            } catch (e) {
                                console.error(e);
                                scriptErrored = true;
                                return;
                            }
                        }
                    }
                }
            } else if (mdTitleOptionsLoaded) {
                for (const optionId in mdTitleOptions) {
                    const option = mdTitleOptions[optionId];

                    option.loaded = false;
                    option.loadedId = '';
                    option.loadedTab = '';
                    if (option.storage) delete option.storage;
                }
                mdTitleOptionsLoaded = false;
            }

            try {
                mdReplaceTitles();
                mdReplaceVolumeCovers(titleId);
            } catch (e) {
                console.error(e);
                scriptErrored = true;
            }
        } else {
            if (!document.querySelector('.container')) return;

            const seriesId = komgaGetSeriesId();

            if (seriesId) {
                if (seriesId === komgaCurrentSeriesId) return;

                try {
                    if (komgaAutoMatch(seriesId)) komgaCurrentSeriesId = seriesId;
                } catch (e) {
                    console.error(e);
                    scriptErrored = true;
                }
            } else {
                komgaCurrentSeriesId = '';
            }
        }
    });

    function mdAddCustomSectionOptions(titleId) {
        const infoElement = mdGetInfoElement(titleId);
        if (!infoElement) return false;

        const infoSectionElement = infoElement.querySelector('.mb-2:not(.hidden)');
        if (!infoSectionElement) return false;
        const sectionInfoElement = infoSectionElement.querySelector('div.flex.flex-wrap');
        if (!sectionInfoElement) return false;
        const sectionInfoLinkElement = sectionInfoElement.querySelector('a');
        if (!sectionInfoLinkElement) return false;
        const altTitlesSectionElement = mdGetAltTitlesSectionElement(infoElement);
        if (!altTitlesSectionElement) return false;

        const createSectionElement = (sectionData, required = false) => {
            const sectionIdAttribute = `${userScriptId}-section-id`;
            const sectionExists = !!document.querySelector(`[${sectionIdAttribute}="${sectionData.id}"]`);
            if (sectionExists) return;

            const newInfoSectionElement = infoSectionElement.cloneNode(true);
            newInfoSectionElement.setAttribute(sectionIdAttribute, sectionData.id);

            const newInfoNameElement = newInfoSectionElement.querySelector('div.font-bold');
            const newInfoElement = newInfoSectionElement.querySelector('div.flex.flex-wrap');

            newInfoNameElement.textContent = sectionData.name + (required ? '' : ' ');
            newInfoElement.querySelectorAll('a').forEach(element => element.remove());

            if (required) return newInfoSectionElement;

            const newInfoRemoveElement = document.createElement('span');
            newInfoRemoveElement.textContent = '⨯';
            newInfoRemoveElement.classList.add('cursor-pointer');
            newInfoRemoveElement.addEventListener('click', () => {
                if (!confirm(`Are you sure you want to delete this section?\n\n${sectionData.name}`)) return;

                const storedSections = getStorage(storage.mangadex.titles.custom_sections);
                const storedSectionIndex = storedSections.findIndex(section => section.id === sectionData.id);

                if (storedSectionIndex > -1) {
                    storedSections.splice(storedSectionIndex, 1);
                    setStorage(storage.mangadex.titles.custom_sections, storedSections);
                }

                newInfoSectionElement.remove();
            });
            newInfoNameElement.appendChild(newInfoRemoveElement);

            return newInfoSectionElement;
        }

        const createSectionButton = (sectionData, value, sectionInfoLinkElement) => {
            const newLink = sectionInfoLinkElement.cloneNode(true);
            const newLinkText = newLink.querySelector('span');
            newLink.href = '#';
            newLink.classList.add('gap-1');
            newLinkText.textContent = value;

            const newLinkRemove = document.createElement('span');
            newLinkRemove.textContent = '⨯';
            newLinkRemove.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (!confirm(`Are you sure you want to delete this ${sectionData.name}?\n\n${value}`)) return;

                const storedTitleSections = mdGetTitleStorage(titleId, storage.mangadex.titles.data.custom_sections);
                const storedSectionIndex = storedTitleSections.findIndex(section => section.id === sectionData.id);

                if (storedSectionIndex > -1) {
                    const sectionValues = storedTitleSections[storedSectionIndex].values || [];
                    const sectionValueIndex = sectionValues.findIndex(_value => _value === value);
                    if (sectionValueIndex > -1) {
                        sectionValues.splice(sectionValueIndex, 1);
                        storedTitleSections[storedSectionIndex].values = sectionValues;
                    }
                    if (sectionValues.length < 1) {
                        storedTitleSections.splice(storedSectionIndex, 1);
                    }
                }

                mdSetTitleStorage(titleId, storage.mangadex.titles.data.custom_sections, storedTitleSections);
                newLink.remove();
            });
            newLink.appendChild(newLinkRemove);

            try {
                const valueMatch = value.match(/^\[([\s\w\-]+)]\((https?:\/\/.*)\)$/)
                const urlValue = valueMatch && valueMatch[2] ? valueMatch[2] : value
                if (!validator.isURL(urlValue)) throw new Error('Invalid URL');
                const url = new URL(urlValue);
                newLink.href = url.href;
                newLinkText.textContent = valueMatch && valueMatch[2] ? valueMatch[1] : url.hostname;
                return newLink;
            } catch (e) {}

            newLink.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                alert(value);
            });

            return newLink;
        };

        const createSectionLink = (sectionData, sectionElement) => {
            const newInfoElement = sectionElement.querySelector('div.flex.flex-wrap');
            const newInfoLinkElement = sectionInfoLinkElement.cloneNode(true);
            const newInfoLinkIconElement = newInfoLinkElement.querySelector('svg');
            const newInfoLinkTextElement = newInfoLinkElement.querySelector('span');

            newInfoLinkElement.target = '_blank';
            newInfoLinkElement.rel = 'noopener noreferrer';
            if (newInfoLinkIconElement) newInfoLinkIconElement.remove();

            const storedTitleSections = mdGetTitleStorage(titleId, storage.mangadex.titles.data.custom_sections);
            const storedSectionData = storedTitleSections.find(section => section.id === sectionData.id) || {};
            const storedSectionDataValues = storedSectionData.values || [];

            storedSectionDataValues.forEach(value => {
                const newLink = createSectionButton(sectionData, value, newInfoLinkElement);
                if (!newLink) return;
                newInfoElement.appendChild(newLink);
            });

            newInfoLinkTextElement.textContent = `+`;
            newInfoLinkElement.href = '#';
            newInfoLinkElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                const storedSections = getStorage(storage.mangadex.titles.custom_sections);
                if (!storedSections.some(section => section.id === sectionData.id)) {
                    storedSections.push(sectionData);
                    setStorage(storage.mangadex.titles.custom_sections, storedSections);
                }

                const value = prompt(`Enter new ${sectionData.name} value`);
                if (!value) return;

                const newLink = createSectionButton(sectionData, value, newInfoLinkElement);
                if (!newLink) return;

                const storedTitleSections = mdGetTitleStorage(titleId, storage.mangadex.titles.data.custom_sections);
                let storedSectionIndex = storedTitleSections.findIndex(section => section.id === sectionData.id);
                if (storedSectionIndex < 0) {
                    storedTitleSections.push({ id: sectionData.id });
                    storedSectionIndex = storedTitleSections.findIndex(section => section.id === sectionData.id);
                }
                const sectionValues = storedTitleSections[storedSectionIndex].values || [];

                sectionValues.push(value);
                storedTitleSections[storedSectionIndex].values = sectionValues;
                mdSetTitleStorage(titleId, storage.mangadex.titles.data.custom_sections, storedTitleSections);
                newInfoElement.insertBefore(newLink, newInfoLinkElement);
            });
            newInfoElement.appendChild(newInfoLinkElement);

            return newInfoElement;
        }

        const createSection = (sectionData) => {
            const newSectionElement = createSectionElement(sectionData);
            if (!newSectionElement) return;
            const newSectionLinkElement = createSectionLink(sectionData, newSectionElement);
            newSectionElement.appendChild(newSectionLinkElement);
            infoElement.insertBefore(newSectionElement, altTitlesSectionElement);
        }

        const addNewSectionElement = createSectionElement({ id: 'add_local_section', name: 'Custom Sections +' }, true);
        if (addNewSectionElement) {
            addNewSectionElement.querySelector('div.flex.flex-wrap').remove();
            const addNewSectionTextElement = addNewSectionElement.querySelector('div.font-bold');
            addNewSectionTextElement.classList.remove('mb-2');
            addNewSectionTextElement.classList.add('cursor-pointer');
            addNewSectionTextElement.style.setProperty('width', 'fit-content');
            addNewSectionElement.classList.remove('mb-2');
            addNewSectionElement.classList.add('w-full');
            addNewSectionTextElement.addEventListener('click', () => {
                const storedSections = getStorage(storage.mangadex.titles.custom_sections);
                const sectionName = prompt('Enter new section name');
                const trimmedSectionName = sectionName && sectionName.trim();
                if (!trimmedSectionName) return;

                const sectionData = {
                    id: trimmedSectionName.replace(/\s/g, '_').toLowerCase(),
                    name: trimmedSectionName
                }

                if (storedSections.some(section => section.id === sectionData.id)) return;
                storedSections.push(sectionData);
                setStorage(storage.mangadex.titles.custom_sections, storedSections);

                createSection(sectionData);
            });

            infoElement.insertBefore(addNewSectionElement, altTitlesSectionElement);
        }

        const storedSections = getStorage(storage.mangadex.titles.custom_sections);
        storedSections.forEach(createSection);

        return true;
    }

    function mdAddAltTitleOptions(titleId) {
        const infoElement = mdGetInfoElement(titleId);
        if (!infoElement) return false;

        if (!infoElement.querySelector('a')) return false;

        let altTitlesSectionElement = mdGetAltTitlesSectionElement(infoElement);
        if (!altTitlesSectionElement) {
            altTitlesSectionElement = document.createElement('div');
            altTitlesSectionElement.classList.add('w-full');
            infoElement.appendChild(altTitlesSectionElement);

            const altTitlesSectionTextElement = document.createElement('div');
            altTitlesSectionTextElement.classList.add('font-bold', 'mb-1');
            altTitlesSectionTextElement.textContent = 'Alternative Titles';
            altTitlesSectionElement.appendChild(altTitlesSectionTextElement);

            const altTitleElement = document.createElement('div');
            altTitleElement.classList.add('mb-1', 'flex', 'gap-x-2', 'alt-title');
            altTitlesSectionElement.appendChild(altTitleElement);
        }
        const altTitlesSectionLoadedAttribute = `${userScriptId}-alt-title-section-loaded`;
        if (altTitlesSectionElement.hasAttribute(altTitlesSectionLoadedAttribute)) return true;
        altTitlesSectionElement.setAttribute(altTitlesSectionLoadedAttribute, 'true');

        const altTitlesSectionTextElement = altTitlesSectionElement.querySelector('div.font-bold');
        const altTitlesElements = altTitlesSectionElement.querySelectorAll('.alt-title');
        const altTitleElement = altTitlesElements[0].cloneNode(true);
        if (!mdTitleOptions.altTitle.storage) mdTitleOptions.altTitle.storage = [];

        const addAltTitleStar = altTitleElement => {
            const storedTitle = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_title);
            const altTitleTextElement = altTitleElement.querySelector('span');
            if (!altTitleTextElement) return;
            const setTitleObject = {
                selected: storedTitle === altTitleTextElement.textContent,
                element: altTitleElement,
                starElement: document.createElement('span'),
                value: altTitleTextElement.textContent
            }

            setTitleObject.starElement.textContent = setTitleObject.selected ? '★' : '☆';
            setTitleObject.starElement.classList.add('cursor-pointer');
            if (setTitleObject.selected) mdReplaceTitles(titleId);

            setTitleObject.starElement.addEventListener('click', () => {
                mdSetTitleStorage(titleId, storage.mangadex.titles.data.main_title, setTitleObject.value, setTitleObject.selected);

                mdReplaceTitles(titleId, setTitleObject.selected);

                setTitleObject.selected = !setTitleObject.selected;
                mdTitleOptions.altTitle.storage.forEach(_setTitleObject => {
                    _setTitleObject.selected = _setTitleObject.value === setTitleObject.value && setTitleObject.selected;
                    _setTitleObject.starElement.textContent = _setTitleObject.selected ? '★' : '☆';
                });
            });

            mdTitleOptions.altTitle.storage.push(setTitleObject);
            altTitleElement.prepend(setTitleObject.starElement);
        };

        const createAltTitle = (value) => {
            if (!altTitlesElements[0].querySelector('span')) altTitlesElements[0].remove();
            const newAltTitleElement = altTitleElement.cloneNode(true);
            const newAltTitleIconElement = newAltTitleElement.querySelector('div');
            let newAltTitleTextElement = newAltTitleElement.querySelector('span');
            if (!newAltTitleTextElement) {
                newAltTitleTextElement = document.createElement('span');
                newAltTitleElement.appendChild(newAltTitleTextElement);
            }
            const removeCustomAltTitleElement = document.createElement('span');

            if (newAltTitleIconElement) newAltTitleIconElement.remove();
            newAltTitleTextElement.textContent = value;
            removeCustomAltTitleElement.textContent = '⨯';
            removeCustomAltTitleElement.classList.add('cursor-pointer');
            removeCustomAltTitleElement.addEventListener('click', () => {
                if (!confirm(`Are you sure you want to delete this title?\n\n${value}`)) return;

                mdSetTitleStorage(titleId, storage.mangadex.titles.data.alt_titles, value, true, true);

                const setTitleObjectIndex = mdTitleOptions.altTitle.storage.findIndex(setTitleObject => setTitleObject.value === value);
                if (setTitleObjectIndex > -1) mdTitleOptions.altTitle.storage.splice(setTitleObjectIndex, 1);

                const storedAltTitles = mdGetTitleStorage(titleId, storage.mangadex.titles.data.alt_titles);
                const storedMainTitle = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_title);
                if (storedMainTitle === value && !storedAltTitles.some(altTitle => altTitle === value)) {
                    mdSetTitleStorage(titleId, storage.mangadex.titles.data.main_title, value, true);
                    mdReplaceTitles(titleId, true);
                }

                newAltTitleElement.remove();
            });
            newAltTitleElement.appendChild(removeCustomAltTitleElement);
            addAltTitleStar(newAltTitleElement);
            altTitlesSectionElement.appendChild(newAltTitleElement);
        };

        altTitlesElements.forEach(addAltTitleStar);

        altTitlesSectionTextElement.textContent = `${altTitlesSectionTextElement.textContent} +`
        altTitlesSectionTextElement.classList.add('cursor-pointer');
        altTitlesSectionTextElement.style.setProperty('width', 'fit-content');
        altTitlesSectionTextElement.addEventListener('click', () => {
            const value = prompt('Enter new title');
            if (!value) return;

            mdSetTitleStorage(titleId, storage.mangadex.titles.data.alt_titles, value, false, true);

            createAltTitle(value);
        });

        const storedAltTitles = mdGetTitleStorage(titleId, storage.mangadex.titles.data.alt_titles);
        if (storedAltTitles) storedAltTitles.forEach(createAltTitle);
        const storedTitle = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_title);
        if (storedTitle && !mdTitleOptions.altTitle.storage.some(setTitleObject => setTitleObject.selected)) {
            mdSetTitleStorage(titleId, storage.mangadex.titles.data.alt_titles, storedTitle, false, true);
            createAltTitle(storedTitle);
        }

        return true;
    }

    function mdReplaceTitles(titleId, useDefaultTitle) {
        if (titleId) {
            const titlePageTitleElement = document.querySelector('div.title > p');
            if (!titlePageTitleElement) return;

            const defaultTitleAttribute = `${userScriptId}-default-title`;
            if (!titlePageTitleElement.hasAttribute(defaultTitleAttribute))
                titlePageTitleElement.setAttribute(defaultTitleAttribute, titlePageTitleElement.textContent);

            const defaultTitle = useDefaultTitle && titlePageTitleElement.getAttribute(defaultTitleAttribute);
            const storedMainTitle = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_title);
            titlePageTitleElement.textContent = defaultTitle || storedMainTitle || 'undefined';

            return;
        }

        const titleLinkElements = document.querySelectorAll(
            'a.title, a.chapter-feed__title, .dense-manga-container a, .swiper-slide a, .manga-draft-container a, a[class=""]'
        );
        titleLinkElements.forEach(titleLinkElement => {
            const titleReplacedAttribute = `${userScriptId}-title-replaced`;
            if (titleLinkElement.hasAttribute(titleReplacedAttribute)) return;
            titleLinkElement.setAttribute(titleReplacedAttribute, 'true');

            let textElement = titleLinkElement;
            const hasTextNode = () => textElement && textElement.childNodes && Array.from(textElement.childNodes).some(text => text.data);
            if (!hasTextNode()) textElement = titleLinkElement.querySelector('span, h6');
            if (!hasTextNode() && titleLinkElement.parentElement)
                textElement = titleLinkElement.parentElement.querySelector('span, h2, div.font-bold');
            if (!hasTextNode()) return;

            if (textElement.parentElement && textElement.parentElement.tagName === 'BUTTON') return;

            const mdTitleId = mdGetTitleId(titleLinkElement.getAttribute('href'));
            if (!mdTitleId) return;

            const storedMainTitle = mdGetTitleStorage(mdTitleId, storage.mangadex.titles.data.main_title);
            if (!storedMainTitle) return;

            textElement.childNodes.forEach((text) => {
                if (text.data) text.data = storedMainTitle;
            });
        });
    }

    function mdAddVolumeCoverOptions(titleId) {
        if (document.querySelector('div[role="alert"]')) return true;
        if (document.querySelectorAll(`a[href*="covers/${titleId}"]`).length < 2) return false;
        const volumeCoverLoadedAttribute = `${userScriptId}-volume-cover-loaded`;
        const volumeCoverLinkElements = document.querySelectorAll(`a[href*="covers/${titleId}"]:not([${volumeCoverLoadedAttribute}])`);
        if (!mdTitleOptions.volumeCover.storage) mdTitleOptions.volumeCover.storage = [];

        volumeCoverLinkElements.forEach(volumeCoverLinkElement => {
            volumeCoverLinkElement.setAttribute(volumeCoverLoadedAttribute, 'true');

            const volumeSubtitleElement = volumeCoverLinkElement.querySelector('.subtitle');
            if (!volumeSubtitleElement) return;
            volumeSubtitleElement.textContent = ` ${volumeSubtitleElement.textContent}`;

            const volumeCoverLink = volumeCoverLinkElement.getAttribute('href');
            if (!volumeCoverLink) return;
            const volumeCoverFilename = mdGetCoverFileName(volumeCoverLink);
            if (!volumeCoverFilename.fileName) return;

            const storedVolumeCover = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_cover);
            const setCoverObject = {
                selected: volumeCoverFilename.fileName === storedVolumeCover,
                element: volumeCoverLinkElement,
                starElement: document.createElement('span'),
                value: volumeCoverFilename.fileName
            }

            setCoverObject.starElement.textContent = setCoverObject.selected ? '★' : '☆';
            setCoverObject.starElement.classList.add('cursor-pointer');
            setCoverObject.starElement.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();

                mdSetTitleStorage(titleId, storage.mangadex.titles.data.main_cover, setCoverObject.value, setCoverObject.selected);

                setCoverObject.selected = !setCoverObject.selected;
                mdTitleOptions.volumeCover.storage.forEach(_setCoverObject => {
                    _setCoverObject.selected = _setCoverObject.value === setCoverObject.value && setCoverObject.selected;
                    _setCoverObject.starElement.textContent = _setCoverObject.selected ? '★' : '☆';
                });

                mdReplaceVolumeCovers(titleId, !setCoverObject.selected);
            });
            volumeSubtitleElement.prepend(setCoverObject.starElement);

            mdTitleOptions.volumeCover.storage.push(setCoverObject);
        });

        return true;
    }

    function mdReplaceVolumeCovers(titleId, useDefault) {
        const coverLinkElement = document.querySelector(`.md-content > .manga a[href*="covers/${titleId}"]`);
        const replaceCoverUrl = (titleId, urlToReplace, storedCover) => {
            if (!titleId || !storedCover) return;
            const urlToReplaceFilename = mdGetCoverFileName(urlToReplace);
            if (!urlToReplaceFilename.size) urlToReplaceFilename.size = '';
            const newUrl = `https://mangadex.org/covers/${titleId}/${storedCover}${urlToReplaceFilename.size}`;
            if (newUrl !== urlToReplace) return newUrl;
        }

        if (coverLinkElement) {
            const defaultCoverAttribute = `${userScriptId}-default-cover`;
            if (!coverLinkElement.hasAttribute(defaultCoverAttribute)) {
                const coverLinkFileName = mdGetCoverFileName(coverLinkElement.getAttribute('href'));
                if (coverLinkFileName.fileName) coverLinkElement.setAttribute(defaultCoverAttribute, coverLinkFileName.fileName);
            }

            const storedCover = mdGetTitleStorage(titleId, storage.mangadex.titles.data.main_cover);
            const defaultCover = useDefault && coverLinkElement.getAttribute(defaultCoverAttribute);
            const newCover = defaultCover || storedCover;

            if (newCover) {
                const newCoverLinkUrl = replaceCoverUrl(titleId, coverLinkElement.getAttribute('href'), newCover);
                if (newCoverLinkUrl) coverLinkElement.setAttribute('href', newCoverLinkUrl);

                const coverImageElement = coverLinkElement.querySelector(`img[src*="covers/${titleId}"]`);
                if (coverImageElement) {
                    const newCoverImageUrl = replaceCoverUrl(titleId, coverImageElement.getAttribute('src'), newCover);
                    if (newCoverImageUrl) coverImageElement.setAttribute('src', newCoverImageUrl);
                }

                const bannerImageElement = document.querySelector('.banner-image');
                if (bannerImageElement) {
                    const newBannerImageUrl = replaceCoverUrl(titleId, bannerImageElement.style.getPropertyValue('background-image'), newCover);
                    if (newBannerImageUrl) bannerImageElement.style.setProperty('background-image', `url("${newBannerImageUrl}")`);
                }
            }
        }

        const coverLoadedAttribute = `${userScriptId}-cover-loaded`;
        const imageElements = document.querySelectorAll(`img:not([${coverLoadedAttribute}])`);
        imageElements.forEach(imageElement => {
            imageElement.setAttribute(coverLoadedAttribute, 'true');
            const imageUrl = imageElement.getAttribute('src');
            if (!imageUrl) return;
            const mdTitleId = mdGetTitleId(imageUrl);
            if (!mdTitleId || mdTitleId === titleId) return;
            const storedCover = mdGetTitleStorage(mdTitleId, storage.mangadex.titles.data.main_cover);
            const newCoverUrl = replaceCoverUrl(mdTitleId, imageUrl, storedCover);
            if (newCoverUrl) imageElement.setAttribute('src', newCoverUrl);
        });
    }

    function komgaAutoMatch(seriesId) {
        if (!document.querySelector(`.v-image__image[style*="${seriesId}"]`)) return false;

        const linkElements = document.querySelectorAll(`a.v-chip--link`);
        if (linkElements < 1) return false;

        const sectionData = {
            id: 'local_links',
            name: 'Local Links'
        }

        const storedSections = getStorage(storage.mangadex.titles.custom_sections);
        if (!storedSections.some(section => section.id === sectionData.id)) {
            storedSections.push(sectionData);
            setStorage(storage.mangadex.titles.custom_sections, storedSections);
        }

        linkElements.forEach(link => {
            const mdTitleId = mdGetTitleId(link.href);
            if (!mdTitleId) return;

            const storedTitleSections = mdGetTitleStorage(mdTitleId, storage.mangadex.titles.data.custom_sections);
            let storedSectionIndex = storedTitleSections.findIndex(section => section.id === sectionData.id);
            if (storedSectionIndex < 0) {
                storedTitleSections.push({ id: sectionData.id });
                storedSectionIndex = storedTitleSections.findIndex(section => section.id === sectionData.id);
            }

            const sectionValues = storedTitleSections[storedSectionIndex].values || [];
            if (sectionValues.some(link => seriesId === komgaGetSeriesId(link))) return;

            const sectionLink = `[Komga](${window.location.href.replace(/\?.*$/, '')})`;
            sectionValues.push(sectionLink);
            storedTitleSections[storedSectionIndex].values = sectionValues;
            mdSetTitleStorage(mdTitleId, storage.mangadex.titles.data.custom_sections, storedTitleSections);
        });

        return true;
    }

    function observeElement(onChange, element = document.body) {
        const observer = new MutationObserver(onChange);

        onChange();
        observer.observe(element, {
            childList: true,
            subtree: true,
        });
    }
})();

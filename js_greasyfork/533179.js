// ==UserScript==
// @name         Soyjak Themer
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Select and apply themes from GitHub repositories to soyjak.st
// @author       ReignOfTea
// @match        https://www.soyjak.party/*
// @match        https://soyjak.party/*
// @match        https://www.soyjak.st/*
// @match        https://soyjak.st/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.soyjak.st
// @license AGPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533179/Soyjak%20Themer.user.js
// @updateURL https://update.greasyfork.org/scripts/533179/Soyjak%20Themer.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEYS = {
        THEME: "soyjak_selected_theme",
        USER_CSS: "soyjak_user_css",
        THEMES_CACHE: "soyjak_themes_cache",
        CACHE_TIMESTAMP: "soyjak_themes_cache_timestamp",
        FAVORITES: "soyjak_favorite_themes",
        REPOS: "soyjak_theme_repos"
    };

    const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 Days

    const DEFAULT_REPOS = [
        {
            name: "tchan",
            apiUrl: "https://api.github.com/repos/ReignOfTea/tchan/contents/?ref=master",
            basePath: "https://raw.githubusercontent.com/ReignOfTea/tchan/master/",
            isDefault: true,
        },
        {
            name: "lainchan",
            apiUrl: "https://api.github.com/repos/lainchan/lainchan/contents/stylesheets?ref=php7.4",
            basePath: "https://raw.githubusercontent.com/lainchan/lainchan/php7.4/stylesheets/",
            isDefault: true,
        },
        {
            name: "vichan",
            apiUrl: "https://api.github.com/repos/vichan-devel/vichan/contents/stylesheets?ref=master",
            basePath: "https://raw.githubusercontent.com/vichan-devel/vichan/master/stylesheets/",
            isDefault: true,
        },
    ];

    let state = {
        initialThemeApplied: false,
        originalCSS: null,
        previewingTheme: false
    };

    const repoManager = {
        getAll() {
            try {
                const repos = JSON.parse(
                    localStorage.getItem(STORAGE_KEYS.REPOS) || "null"
                );

                if (!repos) {
                    localStorage.setItem(STORAGE_KEYS.REPOS, JSON.stringify(DEFAULT_REPOS));
                    return DEFAULT_REPOS;
                }

                return repos;
            } catch (error) {
                console.error("Error getting repositories:", error);
                localStorage.setItem(STORAGE_KEYS.REPOS, JSON.stringify(DEFAULT_REPOS));
                return DEFAULT_REPOS;
            }
        },

        add(name, apiUrl, basePath) {
            try {
                const repos = this.getAll();

                const existingIndex = repos.findIndex((repo) => repo.name === name);
                if (existingIndex >= 0) {
                    if (repos[existingIndex].isDefault) {
                        uiHelper.showToast(
                            `Cannot modify default repository "${name}"`,
                            "error"
                        );
                        return false;
                    }

                    repos[existingIndex] = { name, apiUrl, basePath };
                    uiHelper.showToast(`Updated repository "${name}"`, "info");
                } else {
                    repos.push({ name, apiUrl, basePath });
                    uiHelper.showToast(`Added repository "${name}"`, "info");
                }

                localStorage.setItem(STORAGE_KEYS.REPOS, JSON.stringify(repos));
                uiHelper.updateReposList();
                return true;
            } catch (error) {
                console.error("Error adding repository:", error);
                uiHelper.showToast("Error adding repository", "error");
                return false;
            }
        },

        remove(name) {
            try {
                const repos = this.getAll();
                const repo = repos.find(r => r.name === name);

                if (!repo) return false;

                if (repo.isDefault && !confirm("This is a default repository. Are you sure you want to remove it?")) {
                    return false;
                }

                const filteredRepos = repos.filter((repo) => repo.name !== name);

                if (filteredRepos.length < repos.length) {
                    localStorage.setItem(
                        STORAGE_KEYS.REPOS,
                        JSON.stringify(filteredRepos)
                    );
                    uiHelper.showToast(`Removed repository "${name}"`, "info");
                    uiHelper.updateReposList();
                    return true;
                }

                return false;
            } catch (error) {
                console.error("Error removing repository:", error);
                uiHelper.showToast("Error removing repository", "error");
                return false;
            }
        },

        resetToDefault() {
            try {
                if (
                    confirm(
                        "Reset all repositories to default? This will remove any custom repositories you have added."
                    )
                ) {
                    localStorage.setItem(
                        STORAGE_KEYS.REPOS,
                        JSON.stringify(DEFAULT_REPOS)
                    );
                    uiHelper.showToast("Repositories reset to default", "info");
                    uiHelper.updateReposList();
                    return true;
                }
                return false;
            } catch (error) {
                console.error("Error resetting repositories:", error);
                uiHelper.showToast("Error resetting repositories", "error");
                return false;
            }
        }
    };

    const themeManager = {
        async fetchRepoContents(repo) {
            try {
                const response = await fetch(repo.apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                return data
                    .filter((item) => item.name.endsWith(".css"))
                    .map((item) => {
                        return {
                            name: item.name.replace(".css", ""),
                            url: repo.basePath + item.name,
                            repo: repo.name,
                        };
                    });
            } catch (error) {
                console.error(`Error fetching themes from ${repo.name}:`, error);
                uiHelper.showToast(`Error fetching themes from ${repo.name}`, "error");
                return [];
            }
        },

        async fetchAllThemes() {
            const statusElement = document.getElementById("theme-status");
            if (statusElement) {
                statusElement.textContent = "Fetching available themes...";
            }

            try {
                const allRepos = repoManager.getAll();
                const allThemesPromises = allRepos.map((repo) =>
                    this.fetchRepoContents(repo)
                );
                const allThemesArrays = await Promise.all(allThemesPromises);
                const allThemes = allThemesArrays.flat();

                const themesObject = {};
                allThemes.forEach((theme) => {
                    themesObject[theme.name] = theme;
                });

                localStorage.setItem(STORAGE_KEYS.THEMES_CACHE, JSON.stringify(themesObject));
                localStorage.setItem(
                    STORAGE_KEYS.CACHE_TIMESTAMP,
                    Date.now().toString()
                );

                if (statusElement) {
                    statusElement.textContent = `Found ${allThemes.length} themes from ${allRepos.length} repositories.`;
                }

                return themesObject;
            } catch (error) {
                console.error("Error fetching all themes:", error);
                if (statusElement) {
                    statusElement.textContent =
                        "Error fetching themes. Check console for details.";
                }
                uiHelper.showToast("Error fetching themes", "error");
                return {};
            }
        },

        async getThemes(forceRefresh = false) {
            try {
                const cachedThemes = localStorage.getItem(STORAGE_KEYS.THEMES_CACHE);
                const cacheTimestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);

                const now = Date.now();
                const cacheAge = cacheTimestamp
                    ? now - parseInt(cacheTimestamp)
                    : Infinity;

                if (!forceRefresh && cachedThemes && cacheAge < CACHE_DURATION) {
                    return JSON.parse(cachedThemes);
                }

                return await this.fetchAllThemes();
            } catch (error) {
                console.error("Error getting themes:", error);
                uiHelper.showToast("Error getting themes", "error");
                return {};
            }
        },

        async applyTheme(themeName, skipConfirmation = false, initialLoad = false) {
            if (
                !skipConfirmation &&
                !initialLoad &&
                !confirm(`Apply theme: ${themeName}?`)
            ) {
                return;
            }

            try {
                const themes = await this.getThemes();
                if (!themes[themeName]) {
                    uiHelper.showToast(`Theme "${themeName}" not found`, "error");
                    return false;
                }

                const response = await fetch(themes[themeName].url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let css = await response.text();

                css = this.processCSS(css);

                if (!state.originalCSS && !initialLoad) {
                    const existingStyle = document.getElementById(
                        "applied-theme-style"
                    );
                    if (existingStyle) {
                        state.originalCSS = existingStyle.textContent;
                    }
                }

                let styleElement = document.getElementById("applied-theme-style");
                if (!styleElement) {
                    styleElement = document.createElement("style");
                    styleElement.id = "applied-theme-style";
                    document.head.appendChild(styleElement);
                }

                styleElement.textContent = css;

                localStorage.setItem(STORAGE_KEYS.THEME, themeName);
                localStorage.setItem(STORAGE_KEYS.USER_CSS, css);

                if (!initialLoad) {
                    uiHelper.showToast(`Theme "${themeName}" applied`, "success");
                }

                state.previewingTheme = false;

                const cancelPreviewButton =
                    document.getElementById("cancel-preview");
                if (cancelPreviewButton) {
                    cancelPreviewButton.style.display = "none";
                }

                return true;
            } catch (error) {
                console.error("Error applying theme:", error);
                uiHelper.showToast(`Error applying theme: ${error.message}`, "error");
                return false;
            }
        },

        async previewTheme(themeName) {
            try {
                const themes = await this.getThemes();
                if (!themes[themeName]) {
                    uiHelper.showToast(`Theme "${themeName}" not found`, "error");
                    return false;
                }

                const response = await fetch(themes[themeName].url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                let css = await response.text();

                css = this.processCSS(css);

                const styleElement = document.getElementById("applied-theme-style");
                if (styleElement) {
                    state.originalCSS = styleElement.textContent;
                } else {
                    state.originalCSS = null;
                }

                let previewStyleElement = document.getElementById("applied-theme-style");
                if (!previewStyleElement) {
                    previewStyleElement = document.createElement("style");
                    previewStyleElement.id = "applied-theme-style";
                    document.head.appendChild(previewStyleElement);
                }

                previewStyleElement.textContent = css;
                state.previewingTheme = true;
                uiHelper.showToast(`Previewing "${themeName}"`, "info");

                return true;
            } catch (error) {
                console.error("Error previewing theme:", error);
                uiHelper.showToast(`Error previewing theme: ${error.message}`, "error");
                return false;
            }
        },

        processCSS(css) {
            let processedCSS = "/* Processed by Soyjak Theme Selector to ensure style overrides */\n";

            const cssRules = css.split('}');

            for (let i = 0; i < cssRules.length; i++) {
                if (cssRules[i].trim() === '') continue;

                const openBracePos = cssRules[i].indexOf('{');
                if (openBracePos === -1) {
                    processedCSS += cssRules[i] + '}\n';
                    continue;
                }

                const selector = cssRules[i].substring(0, openBracePos).trim();
                let declarations = cssRules[i].substring(openBracePos + 1).trim();

                if (selector.startsWith('@')) {
                    processedCSS += cssRules[i] + '}\n';
                    continue;
                }

                const declarationParts = declarations.split(';');
                let processedDeclarations = '';

                for (let j = 0; j < declarationParts.length; j++) {
                    const declaration = declarationParts[j].trim();
                    if (declaration === '') continue;

                    if (declaration.includes('!important')) {
                        processedDeclarations += declaration + '; ';
                    } else {
                        processedDeclarations += declaration + ' !important; ';
                    }
                }

                processedCSS += selector + ' { ' + processedDeclarations + '}\n';
            }

            return processedCSS;
        },

        cancelPreview() {
            if (!state.previewingTheme) {
                return;
            }

            const styleElement = document.getElementById("applied-theme-style");

            if (state.originalCSS === null) {
                if (styleElement) {
                    styleElement.remove();
                }
            } else {
                if (styleElement) {
                    styleElement.textContent = state.originalCSS;
                } else {
                    const newStyleElement = document.createElement("style");
                    newStyleElement.id = "applied-theme-style";
                    newStyleElement.textContent = state.originalCSS;
                    document.head.appendChild(newStyleElement);
                }
            }

            state.previewingTheme = false;
            uiHelper.showToast("Preview canceled", "info");

            const cancelPreviewButton = document.getElementById("cancel-preview");
            if (cancelPreviewButton) {
                cancelPreviewButton.style.display = "none";
            }
        },
        resetTheme() {
            try {
                if (!confirm("Reset to default theme?")) {
                    return false;
                }

                localStorage.removeItem(STORAGE_KEYS.THEME);
                localStorage.removeItem(STORAGE_KEYS.USER_CSS);

                const styleElement = document.getElementById("applied-theme-style");
                if (styleElement) {
                    styleElement.remove();
                }

                const select = document.getElementById("external-theme-select");
                if (select) {
                    select.value = "";
                }

                const themeInfo = document.getElementById("theme-info");
                if (themeInfo) {
                    themeInfo.style.display = "none";
                }

                const statusElement = document.getElementById("theme-status");
                if (statusElement) {
                    statusElement.textContent = "Theme reset to default.";
                }

                state.originalCSS = null;
                state.previewingTheme = false;

                uiHelper.showToast("Reset to default theme", "info");
                return true;
            } catch (error) {
                console.error("Error resetting theme:", error);
                uiHelper.showToast("Error resetting theme", "error");
                return false;
            }
        }
    };

    const favoritesManager = {
        getFavorites() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES) || "[]");
            } catch (error) {
                console.error("Error getting favorites:", error);
                return [];
            }
        },

        toggleFavorite(themeName) {
            try {
                const favorites = this.getFavorites();
                const index = favorites.indexOf(themeName);

                if (index === -1) {
                    favorites.push(themeName);
                    uiHelper.showToast(`Added "${themeName}" to favorites`, "success");
                } else {
                    favorites.splice(index, 1);
                    uiHelper.showToast(`Removed "${themeName}" from favorites`, "info");
                }

                localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
                return index === -1;
            } catch (error) {
                console.error("Error toggling favorite:", error);
                uiHelper.showToast("Error updating favorites", "error");
                return false;
            }
        }
    };

    const settingsManager = {
        exportSettings() {
            try {
                const settings = {
                    selectedTheme: localStorage.getItem(STORAGE_KEYS.THEME),
                    favorites: favoritesManager.getFavorites(),
                    repositories: repoManager.getAll(),
                };

                const blob = new Blob([JSON.stringify(settings, null, 2)], {
                    type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "soyjak-theme-settings.json";
                a.click();

                URL.revokeObjectURL(url);
                uiHelper.showToast("Settings exported successfully", "info");
                return true;
            } catch (error) {
                console.error("Error exporting settings:", error);
                uiHelper.showToast("Error exporting settings", "error");
                return false;
            }
        },

        importSettings(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);

                    if (settings.repositories && Array.isArray(settings.repositories)) {
                        localStorage.setItem(
                            STORAGE_KEYS.REPOS,
                            JSON.stringify(settings.repositories)
                        );
                    }

                    if (settings.favorites && Array.isArray(settings.favorites)) {
                        localStorage.setItem(
                            STORAGE_KEYS.FAVORITES,
                            JSON.stringify(settings.favorites)
                        );
                    }

                    if (settings.selectedTheme) {
                        localStorage.setItem(STORAGE_KEYS.THEME, settings.selectedTheme);
                        themeManager.applyTheme(settings.selectedTheme, true);
                    }

                    uiHelper.updateReposList();
                    uiHelper.populateThemeSelect();
                    uiHelper.updateCacheInfo();
                    uiHelper.showToast("Settings imported successfully", "success");
                    return true;
                } catch (error) {
                    console.error("Error importing settings:", error);
                    uiHelper.showToast("Error importing settings", "error");
                    return false;
                }
            };
            reader.readAsText(file);
        }
    };

    const uiHelper = {
        showToast(message, type = "info") {
            const toast = document.createElement("div");
            toast.className = `theme-toast ${type}`;
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                toast.classList.add("show");
            }, 10);

            setTimeout(() => {
                toast.classList.remove("show");
                setTimeout(() => {
                    if (document.body.contains(toast)) {
                        document.body.removeChild(toast);
                    }
                }, 500);
            }, 3000);
        },

        addStyles() {
            const styleElement = document.createElement("style");
            styleElement.textContent = `
                .theme-selector-container {
                    padding: 15px;
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .theme-selector-header {
                    margin-bottom: 20px;
                    text-align: center;
                }

                .theme-selector-tabs {
                    display: flex;
                    border-bottom: 1px solid #ccc;
                    margin-bottom: 15px;
                }

                .theme-selector-tab {
                    padding: 8px 15px;
                    cursor: pointer;
                    border: 1px solid transparent;
                    border-bottom: none;
                    margin-right: 5px;
                    border-radius: 5px 5px 0 0;
                }

                .theme-selector-tab.active {
                    border-color: #ccc;
                    background-color: #f9f9f9;
                    margin-bottom: -1px;
                    padding-bottom: 9px;
                }

                .theme-selector-tab-content {
                    display: none;
                    padding: 15px;
                    border: 1px solid #ccc;
                    border-top: none;
                    background-color: #f9f9f9;
                }

                .theme-selector-tab-content.active {
                    display: block;
                }

                .theme-selector-search {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    box-sizing: border-box;
                }

                .theme-selector-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .theme-selector-button {
                    padding: 8px 15px;
                    cursor: pointer;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    flex: 1;
                    margin: 0 5px;
                }

                .theme-selector-button:first-child {
                    margin-left: 0;
                }

                .theme-selector-button:last-child {
                    margin-right: 0;
                }

                .theme-selector-button:hover {
                    background-color: #e0e0e0;
                }

                .theme-selector-full-button {
                    width: 100%;
                    padding: 8px 15px;
                    cursor: pointer;
                    background-color: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    margin-bottom: 10px;
                }

                .theme-selector-full-button:hover {
                    background-color: #e0e0e0;
                }

                .theme-selector-info {
                    margin-top: 15px;
                    padding: 10px;
                    border: 1px solid #ddd;
                    background-color: #f9f9f9;
                    border-radius: 3px;
                }

                .theme-selector-status {
                    margin-top: 15px;
                    font-style: italic;
                    color: #666;
                }

                .theme-toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 10px 20px;
                    background-color: #333;
                    color: white;
                    border-radius: 5px;
                    z-index: 10000;
                    opacity: 0;
                    transition: opacity 0.5s;
                    max-width: 300px;
                }

                .theme-toast.show {
                    opacity: 1;
                }

                .theme-toast.info {
                    background-color: #2196F3;
                }

                .theme-toast.success {
                    background-color: #4CAF50;
                }

                .theme-toast.warning {
                    background-color: #FF9800;
                }

                .theme-toast.error {
                    background-color: #F44336;
                }

                .favorite-star {
                    cursor: pointer;
                    margin-left: 5px;
                    color: #ccc;
                }

                .favorite-star.active {
                    color: gold;
                }

                .repo-item {
                    margin-bottom: 5px;
                }

                .remove-repo-btn {
                    background-color: #f44336;
                    color: white;
                    border: none;
                    padding: 3px 8px;
                    border-radius: 3px;
                    cursor: pointer;
                }

                .remove-repo-btn:hover {
                    background-color: #d32f2f;
                }
            `;
            document.head.appendChild(styleElement);
        },

        async populateThemeSelect() {
            const select = document.getElementById("external-theme-select");
            if (!select) return;

            const themes = await themeManager.getThemes();
            const favorites = favoritesManager.getFavorites();

            select.innerHTML = "";

            const placeholderOption = document.createElement("option");
            placeholderOption.value = "";
            placeholderOption.textContent = "-- Select a theme --";
            select.appendChild(placeholderOption);

            const sortedThemeNames = Object.keys(themes).sort((a, b) => {
                const aIsFavorite = favorites.includes(a);
                const bIsFavorite = favorites.includes(b);

                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;

                return a.localeCompare(b);
            });

            const favoritesGroup = document.createElement("optgroup");
            favoritesGroup.label = "Favorites";

            const repoGroups = {};

            sortedThemeNames.forEach((themeName) => {
                const theme = themes[themeName];
                const isFavorite = favorites.includes(themeName);

                const option = document.createElement("option");
                option.value = themeName;
                option.textContent = themeName;
                option.dataset.repo = theme.repo;

                if (isFavorite) {
                    option.dataset.favorite = "true";
                    favoritesGroup.appendChild(option);
                } else {
                    if (!repoGroups[theme.repo]) {
                        repoGroups[theme.repo] = document.createElement("optgroup");
                        repoGroups[theme.repo].label = theme.repo;
                    }

                    repoGroups[theme.repo].appendChild(option);
                }
            });

            if (favoritesGroup.children.length > 0) {
                select.appendChild(favoritesGroup);
            }

            Object.values(repoGroups).forEach((group) => {
                if (group.children.length > 0) {
                    select.appendChild(group);
                }
            });

            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            if (savedTheme && themes[savedTheme]) {
                select.value = savedTheme;
            }

            this.updateThemeInfo();
        },

        filterThemes(searchText) {
            const select = document.getElementById("external-theme-select");
            if (!select) return;

            const options = select.querySelectorAll("option");
            const optgroups = select.querySelectorAll("optgroup");

            searchText = searchText.toLowerCase();

            optgroups.forEach((group) => {
                group.style.display = "";
            });

            options.forEach((option) => {
                if (option.value === "") return;
                const themeName = option.textContent.toLowerCase();
                const matches = themeName.includes(searchText);

                option.style.display = matches ? "" : "none";
            });

            optgroups.forEach((group) => {
                const visibleOptions = Array.from(
                    group.querySelectorAll("option")
                ).filter((opt) => opt.style.display !== "none");
                group.style.display = visibleOptions.length > 0 ? "" : "none";
            });
        },

        async updateThemeInfo() {
            const select = document.getElementById("external-theme-select");
            const infoDiv = document.getElementById("theme-info");

            if (!select || !infoDiv) return;

            const selectedTheme = select.value;

            if (!selectedTheme) {
                infoDiv.style.display = "none";
                return;
            }

            const themes = await themeManager.getThemes();
            const theme = themes[selectedTheme];

            if (!theme) {
                infoDiv.style.display = "none";
                return;
            }

            const favorites = favoritesManager.getFavorites();
            const isFavorite = favorites.includes(selectedTheme);

            infoDiv.innerHTML = `
                <h3>
                    ${selectedTheme}
                    <span class="favorite-star ${isFavorite ? "active" : ""
                }" data-theme="${selectedTheme}">★</span>
                </h3>
                <p><strong>Repository:</strong> ${theme.repo}</p>
                <p><strong>URL:</strong> <a href="${theme.url}" target="_blank">${theme.url
                }</a></p>
            `;

            infoDiv.style.display = "block";

            const favoriteStar = infoDiv.querySelector(".favorite-star");
            if (favoriteStar) {
                favoriteStar.addEventListener("click", (event) => {
                    const themeName = event.target.dataset.theme;
                    if (!themeName) return;

                    const isNowFavorite = favoritesManager.toggleFavorite(themeName);
                    event.target.classList.toggle("active", isNowFavorite);

                    this.populateThemeSelect();
                });
            }
        },

        updateReposList() {
            const reposList = document.getElementById("repos-list");
            if (!reposList) return;

            const repos = repoManager.getAll();
            reposList.innerHTML = "";

            if (repos.length === 0) {
                reposList.innerHTML = "<p>No repositories configured.</p>";
                return;
            }

            repos.forEach((repo) => {
                const repoItem = document.createElement("div");
                repoItem.className = "repo-item";
                repoItem.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding: 5px; border-bottom: 1px solid #ddd;">
                        <div>
                            <strong>${repo.name}</strong> ${repo.isDefault
                        ? '<span style="color: #666; font-size: 0.8em;">(Default)</span>'
                        : ""
                    }
                            <div style="font-size: 0.8em; color: #666;">API: ${repo.apiUrl}</div>
                            <div style="font-size: 0.8em; color: #666;">Base: ${repo.basePath}</div>
                        </div>
                        <button class="remove-repo-btn" data-repo="${repo.name}">Remove</button>
                    </div>
                `;
                reposList.appendChild(repoItem);

                const removeBtn = repoItem.querySelector(".remove-repo-btn");
                if (removeBtn) {
                    removeBtn.addEventListener("click", () => {
                        repoManager.remove(repo.name);
                    });
                }
            });
        },

        updateCacheInfo() {
            const cacheInfoDiv = document.getElementById("cache-info");
            if (!cacheInfoDiv) return;

            const cacheTimestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
            const themesCache = localStorage.getItem(STORAGE_KEYS.THEMES_CACHE);
            const repos = repoManager.getAll();
            const defaultRepoCount = repos.filter((repo) => repo.isDefault).length;
            const customRepoCount = repos.length - defaultRepoCount;

            if (!cacheTimestamp || !themesCache) {
                cacheInfoDiv.innerHTML = "<p>No theme cache found.</p>";
                return;
            }

            try {
                const themes = JSON.parse(themesCache);
                const themeCount = Object.keys(themes).length;
                const cacheDate = new Date(parseInt(cacheTimestamp));
                const now = new Date();
                const diffMs = now - cacheDate;
                const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                cacheInfoDiv.innerHTML = `
                    <p><strong>Themes in cache:</strong> ${themeCount}</p>
                    <p><strong>Total repositories:</strong> ${repos.length}</p>
                    <p><strong>Default repositories:</strong> ${defaultRepoCount}</p>
                    <p><strong>Custom repositories:</strong> ${customRepoCount}</p>
                    <p><strong>Last updated:</strong> ${cacheDate.toLocaleString()}</p>
                    <p><strong>Cache age:</strong> ${diffDays}d ${diffHours}h ${diffMins}m</p>
                    <p><strong>Cache expires:</strong> After 7 days</p>
                `;
            } catch (e) {
                cacheInfoDiv.innerHTML = "<p>Error reading cache information.</p>";
                console.error("Error parsing cache:", e);
            }
        },

        switchTab(tabId) {
            const tabContents = document.querySelectorAll(
                ".theme-selector-tab-content"
            );
            tabContents.forEach((content) => {
                content.classList.remove("active");
            });

            const tabs = document.querySelectorAll(".theme-selector-tab");
            tabs.forEach((tab) => {
                tab.classList.remove("active");
            });

            const selectedTab = document.getElementById(`tab-${tabId}`);
            const selectedContent = document.getElementById(`tab-content-${tabId}`);

            if (selectedTab) {
                selectedTab.classList.add("active");
            }

            if (selectedContent) {
                selectedContent.classList.add("active");
            }
        },

        createThemeSelectorUI(options) {
            const optionsHTML = `
                <div class="theme-selector-container">
                    <div class="theme-selector-header">
                        <p>Select a theme from the dropdown and apply it to change the site's appearance.</p>
                    </div>

                    <div class="theme-selector-tabs">
                        <div id="tab-themes" class="theme-selector-tab active">Themes</div>
                        <div id="tab-settings" class="theme-selector-tab">Settings</div>
                    </div>

                    <div id="tab-content-themes" class="theme-selector-tab-content active">
                        <input type="text" id="theme-search" class="theme-selector-search" placeholder="Search themes...">
                        <select id="external-theme-select" style="width: 100%; margin-bottom: 5px;"></select>

                        <div class="theme-selector-row">
                            <button id="preview-external-theme" class="theme-selector-button">Preview</button>
                            <button id="apply-external-theme" class="theme-selector-button">Apply Theme</button>
                        </div>

                        <button id="cancel-preview" class="theme-selector-full-button" style="display: none;">Cancel Preview</button>
                        <button id="reset-external-theme" class="theme-selector-full-button">Reset to Default</button>

                        <div id="theme-info" class="theme-selector-info" style="display: none;"></div>
                    </div>

                    <div id="tab-content-settings" class="theme-selector-tab-content">
                        <h3>Theme Settings</h3>

                        <div class="theme-selector-row">
                            <button id="refresh-themes" class="theme-selector-full-button">Refresh Theme List</button>
                        </div>

                        <div class="theme-selector-row">
                            <button id="export-theme-settings" class="theme-selector-button">Export Settings</button>
                            <button id="import-theme-settings" class="theme-selector-button">Import Settings</button>
                        </div>

                        <input type="file" id="import-file" style="display: none;" accept=".json">

                        <div style="margin-top: 20px;">
                            <h4>Theme Repositories</h4>
                            <p>Manage repositories to fetch themes from.</p>

                            <div style="margin-bottom: 10px;">
                                <input type="text" id="repo-name" placeholder="Repository Name" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                                <input type="text" id="repo-api-url" placeholder="GitHub API URL (e.g., https://api.github.com/repos/user/repo/contents/path)" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                                <input type="text" id="repo-base-path" placeholder="Base Path (e.g., https://raw.githubusercontent.com/user/repo/branch/path/)" style="width: 100%; margin-bottom: 5px; padding: 5px;">
                                <button id="add-repo-btn" class="theme-selector-full-button">Add Repository</button>
                            </div>

                            <div id="repos-list" style="margin-top: 10px; max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 5px;"></div>

                            <button id="reset-repos-btn" class="theme-selector-full-button" style="margin-top: 10px;">Reset to Default Repositories</button>
                        </div>

                        <div style="margin-top: 20px;">
                            <h4>Cache Information</h4>
                            <div id="cache-info"></div>
                        </div>
                    </div>

                    <div id="theme-status" class="theme-selector-status"></div>
                </div>
            `;

            options.insertAdjacentHTML("beforeend", optionsHTML);
            this.updateCacheInfo();
            this.updateReposList();
            this.populateThemeSelect();

            this.setupEventListeners();
        },

        setupEventListeners() {
            const select = document.getElementById("external-theme-select");
            const searchInput = document.getElementById("theme-search");
            const previewButton = document.getElementById("preview-external-theme");
            const cancelPreviewButton = document.getElementById("cancel-preview");
            const applyButton = document.getElementById("apply-external-theme");
            const resetButton = document.getElementById("reset-external-theme");
            const refreshButton = document.getElementById("refresh-themes");
            const exportButton = document.getElementById("export-theme-settings");
            const importButton = document.getElementById("import-theme-settings");
            const importFile = document.getElementById("import-file");
            const tabElements = document.querySelectorAll(".theme-selector-tab");
            const addRepoBtn = document.getElementById("add-repo-btn");
            const resetReposBtn = document.getElementById("reset-repos-btn");

            if (select) {
                select.addEventListener("change", () => {
                    this.updateThemeInfo();
                });
            }

            if (searchInput) {
                searchInput.addEventListener("input", (e) => {
                    this.filterThemes(e.target.value);
                });
            }

            if (previewButton) {
                previewButton.addEventListener("click", () => {
                    const selectedTheme = select?.value;
                    if (selectedTheme) {
                        themeManager.previewTheme(selectedTheme);
                        if (cancelPreviewButton) {
                            cancelPreviewButton.style.display = "block";
                        }
                    } else {
                        this.showToast("Please select a theme first", "warning");
                    }
                });
            }

            if (cancelPreviewButton) {
                cancelPreviewButton.addEventListener("click", () => {
                    themeManager.cancelPreview();
                    cancelPreviewButton.style.display = "none";
                });
            }

            if (applyButton) {
                applyButton.addEventListener("click", () => {
                    const selectedTheme = select?.value;
                    if (selectedTheme) {
                        themeManager.applyTheme(selectedTheme);
                        if (cancelPreviewButton) {
                            cancelPreviewButton.style.display = "none";
                        }
                    } else {
                        this.showToast("Please select a theme first", "warning");
                    }
                });
            }

            if (resetButton) {
                resetButton.addEventListener("click", () => {
                    themeManager.resetTheme();
                    if (cancelPreviewButton) {
                        cancelPreviewButton.style.display = "none";
                    }
                });
            }

            if (refreshButton) {
                refreshButton.addEventListener("click", async () => {
                    const statusElement = document.getElementById("theme-status");
                    if (statusElement) {
                        statusElement.textContent = "Refreshing theme list...";
                    }

                    await themeManager.getThemes(true);
                    await this.populateThemeSelect();
                    this.updateCacheInfo();

                    if (statusElement) {
                        statusElement.textContent = "Theme list refreshed.";
                    }

                    this.showToast("Theme list refreshed", "info");
                });
            }

            if (exportButton) {
                exportButton.addEventListener("click", settingsManager.exportSettings);
            }

            if (importButton && importFile) {
                importButton.addEventListener("click", () => {
                    importFile.click();
                });

                importFile.addEventListener("change", (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                        settingsManager.importSettings(e.target.files[0]);
                        e.target.value = "";
                    }
                });
            }

            if (addRepoBtn) {
                addRepoBtn.addEventListener("click", () => {
                    const nameInput = document.getElementById("repo-name");
                    const apiUrlInput = document.getElementById("repo-api-url");
                    const basePathInput = document.getElementById("repo-base-path");

                    if (!nameInput || !apiUrlInput || !basePathInput) return;

                    const name = nameInput.value.trim();
                    const apiUrl = apiUrlInput.value.trim();
                    const basePath = basePathInput.value.trim();

                    if (!name || !apiUrl || !basePath) {
                        this.showToast("Please fill in all repository fields", "error");
                        return;
                    }

                    if (repoManager.add(name, apiUrl, basePath)) {
                        nameInput.value = "";
                        apiUrlInput.value = "";
                        basePathInput.value = "";

                        const refreshThemesBtn = document.getElementById("refresh-themes");
                        if (refreshThemesBtn) {
                            refreshThemesBtn.click();
                        }
                    }
                });
            }

            if (resetReposBtn) {
                resetReposBtn.addEventListener("click", () => {
                    if (repoManager.resetToDefault()) {
                        const refreshThemesBtn = document.getElementById("refresh-themes");
                        if (refreshThemesBtn) {
                            refreshThemesBtn.click();
                        }
                    }
                });
            }

            tabElements.forEach((tab) => {
                tab.addEventListener("click", () => {
                    const tabId = tab.id.replace("tab-", "");
                    this.switchTab(tabId);
                });
            });
        }
    };

    async function init() {
        console.log("Initializing Soyjak Theme Selector");

        uiHelper.addStyles();

        try {
            const themes = await themeManager.getThemes();
            console.log(`Loaded ${Object.keys(themes).length} themes`);

            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            const savedCss = localStorage.getItem(STORAGE_KEYS.USER_CSS);

            if (savedCss && !state.initialThemeApplied) {
                const styleElement = document.createElement("style");
                styleElement.id = "applied-theme-style";
                styleElement.textContent = savedCss;
                document.head.appendChild(styleElement);
                state.initialThemeApplied = true;
                console.log("Applied saved CSS from localStorage");
            } else if (savedTheme && themes[savedTheme] && !state.initialThemeApplied) {
                console.log(`Found saved theme: ${savedTheme}`);
                state.initialThemeApplied = true;
                await themeManager.applyTheme(savedTheme, true, true);
            }
        } catch (error) {
            console.error("Error during initialization:", error);
        }

        let checkAttempts = 0;
        const maxAttempts = 100;
        const checkInterval = setInterval(() => {
            checkAttempts++;

            if (typeof Options !== "undefined") {
                clearInterval(checkInterval);
                console.log("Options object found, adding theme selector tab");

                try {
                    let options = Options.add_tab(
                        "external-themes",
                        "css3",
                        "External Themes"
                    ).content[0];
                    uiHelper.createThemeSelectorUI(options);
                } catch (error) {
                    console.error("Error creating theme selector UI:", error);
                }
            }

            if (checkAttempts >= maxAttempts) {
                clearInterval(checkInterval);
                console.log("Stopped checking for Options object (timeout)");
            }
        }, 100);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();

// ==UserScript==
// @name         ZT Better Filters
// @namespace    ZTBF
// @version      0.2.1
// @description  Ajoute une zone de filtres de recherche pour Zone-Telechargement
// @author       Drigtime
// @include      /http(|s):\/\/(|(|w|0|1|2|3|4|5|6|7|8|9)*w(|w|0|1|2|3|4|5|6|7|8|9)*\.)zone\-telechargement[.*]/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zone-telechargement.yachts
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484941/ZT%20Better%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/484941/ZT%20Better%20Filters.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // get the current url parameters
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get("id")) {
        // if we are on a movie/serie page, do nothing
        return;
    }

    const mainContainer = document.querySelector("#dle-content");

    const categories = [];
    const years = [];
    const genres = [];

    // loop on each new-cat to get the categorie filter and its sub-categories filters
    const ztCategoriesContainer = document.querySelectorAll("#new-cat");
    for (const categorieContainer of ztCategoriesContainer) {
        const categorieTitle = categorieContainer.querySelector("#new-title-cat > div:nth-child(2) > a");
        const categorie = { title: categorieTitle.innerText, value: categorieTitle.href.split("p=")[1], subCategories: [] };

        const ztSubCategoriesContainer = categorieContainer.querySelectorAll("#new-subcat > ul > li > a");
        for (const subCategorieContainer of ztSubCategoriesContainer) {
            categorie.subCategories.push({ title: subCategorieContainer.innerText, value: subCategorieContainer.href.split("s=")[1] });
        }

        categories.push(categorie);
    }

    // loop on each annee de sortie to get the year filter
    const ztYearsContainer = document.querySelectorAll("#am > div:nth-child(1) > div.s_left > div > div > div.container > div.leftside > div:nth-child(2) > div > div.dcont > div > table:nth-child(2) > tbody > tr > td > form > select > option");
    for (const yearContainer of ztYearsContainer) {
        years.push({ title: yearContainer.innerText, value: yearContainer.value.split("year=")[1] });
    }

    // loop on each movie/serie genres to get the genre filter
    const ztGenresContainer = document.querySelectorAll("#am > div:nth-child(1) > div.s_left > div > div > div.container > div.leftside > div:nth-child(2) > div > div.dcont > div > table:nth-child(4) > tbody > tr > td > a");
    for (const genreContainer of ztGenresContainer) {
        genres.push({ title: genreContainer.innerText, value: genreContainer.href.split("genre=")[1] });
    }

    // append mainContainer with a new area for filters (before the first div)
    const newContainer = document.createElement("form");
    newContainer.id = "ztbf-container";
    newContainer.style = "margin-bottom:8px; margin-bottom: 8px; border: solid; padding: 0.5rem; border-radius: 0.5rem;";
    mainContainer.insertBefore(newContainer, mainContainer.firstChild);

    // create the filters
    const filtersContainer = document.createElement("div");
    filtersContainer.id = "ztbf-filters";
    filtersContainer.style = "display: grid;grid-template-columns: repeat(4, 1fr);grid-column-gap: 1rem;grid-row-gap: .5rem;";
    newContainer.appendChild(filtersContainer);

    // create the categories filter with select element
    const categoriesContainer = document.createElement("div");
    categoriesContainer.id = "ztbf-categories";
    filtersContainer.appendChild(categoriesContainer);

    const categoriesTitle = document.createElement("div");
    categoriesTitle.id = "ztbf-categories-title";
    categoriesTitle.style = "font-weight:bold;font-family: arial; font-size: 14px;";
    categoriesTitle.innerText = "Catégories";
    categoriesContainer.appendChild(categoriesTitle);

    const categoriesSelect = document.createElement("select");
    categoriesSelect.id = "ztbf-categories-select";
    categoriesSelect.name = "p";
    categoriesSelect.style = "width:100%;";
    categoriesContainer.appendChild(categoriesSelect);

    const categoriesSelectOption = document.createElement("option");
    categoriesSelectOption.value = "";
    categoriesSelectOption.innerText = "Toutes les catégories";
    categoriesSelect.appendChild(categoriesSelectOption);

    for (const categorie of categories) {
        const categorieSelectOption = document.createElement("option");
        categorieSelectOption.value = categorie.value;
        categorieSelectOption.innerText = categorie.title;
        categoriesSelect.appendChild(categorieSelectOption);
    }

    // create the sub categorie filter with select element, change the options based on the selected categorie
    const subCategoriesContainer = document.createElement("div");
    subCategoriesContainer.id = "ztbf-sub-categories";
    filtersContainer.appendChild(subCategoriesContainer);

    const subCategoriesTitle = document.createElement("div");
    subCategoriesTitle.id = "ztbf-sub-categories-title";
    subCategoriesTitle.style = "font-weight:bold;font-family: arial; font-size: 14px;";
    subCategoriesTitle.innerText = "Sous-Catégories";
    subCategoriesContainer.appendChild(subCategoriesTitle);

    const subCategoriesSelect = document.createElement("select");
    subCategoriesSelect.id = "ztbf-sub-categories-select";
    subCategoriesSelect.name = "s";
    subCategoriesSelect.style = "width:100%;";
    subCategoriesContainer.appendChild(subCategoriesSelect);

    const subCategoriesSelectOption = document.createElement("option");
    subCategoriesSelectOption.value = "";
    subCategoriesSelectOption.innerText = "Toutes les sous-catégories";
    subCategoriesSelect.appendChild(subCategoriesSelectOption);

    // on categoriesSelect change, change the subCategoriesSelect options
    categoriesSelect.addEventListener("change", () => {
        const selectedCategorie = categories.find(categorie => categorie.value === categoriesSelect.value);
        subCategoriesSelect.innerHTML = "";
        subCategoriesSelect.appendChild(subCategoriesSelectOption);
        if (selectedCategorie) {
            if (selectedCategorie.subCategories.length > 0) {
                subCategoriesContainer.style.display = "block";
                for (const subCategorie of selectedCategorie.subCategories) {
                    const subCategorieSelectOption = document.createElement("option");
                    subCategorieSelectOption.value = subCategorie.value;
                    subCategorieSelectOption.innerText = subCategorie.title;
                    subCategoriesSelect.appendChild(subCategorieSelectOption);
                }
            } else {
                subCategoriesContainer.style.display = "none";
            }
        }
    });

    // create the year filter with select element
    const yearContainer = document.createElement("div");
    yearContainer.id = "ztbf-year";
    filtersContainer.appendChild(yearContainer);

    const yearTitle = document.createElement("div");
    yearTitle.id = "ztbf-year-title";
    yearTitle.style = "font-weight:bold;font-family: arial; font-size: 14px;";
    yearTitle.innerText = "Année de sortie";
    yearContainer.appendChild(yearTitle);

    const yearSelect = document.createElement("select");
    yearSelect.id = "ztbf-year-select";
    yearSelect.name = "year";
    yearSelect.style = "width:100%;";
    yearContainer.appendChild(yearSelect);

    const yearSelectOption = document.createElement("option");
    yearSelectOption.value = "";
    yearSelectOption.innerText = "Toutes les années";
    yearSelect.appendChild(yearSelectOption);

    for (const year of years) {
        const yearSelectOption = document.createElement("option");
        yearSelectOption.value = year.value;
        yearSelectOption.innerText = year.title;
        yearSelect.appendChild(yearSelectOption);
    }

    // create the genre filter with select element, change the options based on the selected categorie, only appear if movie/serie categorie is selected
    const genreContainer = document.createElement("div");
    genreContainer.id = "ztbf-genre";
    filtersContainer.appendChild(genreContainer);

    const genreTitle = document.createElement("div");
    genreTitle.id = "ztbf-genre-title";
    genreTitle.style = "font-weight:bold;font-family: arial; font-size: 14px;";
    genreTitle.innerText = "Genre";
    genreContainer.appendChild(genreTitle);

    const genreSelect = document.createElement("select");
    genreSelect.id = "ztbf-genre-select";
    genreSelect.name = "genre";
    genreSelect.style = "width:100%;";
    genreContainer.appendChild(genreSelect);

    const genreSelectOption = document.createElement("option");
    genreSelectOption.value = "";
    genreSelectOption.innerText = "Tous les genres";
    genreSelect.appendChild(genreSelectOption);

    for (const genre of genres) {
        const genreSelectOption = document.createElement("option");
        genreSelectOption.value = genre.value;
        genreSelectOption.innerText = genre.title;
        genreSelect.appendChild(genreSelectOption);
    }

    // on categoriesSelect change, change the genreSelect options
    categoriesSelect.addEventListener("change", () => {
        const selectedCategorie = categories.find(categorie => categorie.value === categoriesSelect.value);
        if (selectedCategorie && (selectedCategorie.value === "films" || selectedCategorie.value === "series")) {
            genreContainer.style.display = "block";
            yearContainer.style.display = "block";
        } else {
            genreContainer.style.display = "none";
            yearContainer.style.display = "none";
        }
    });

    // create the search filter
    const searchContainer = document.createElement("div");
    searchContainer.id = "ztbf-search";
    searchContainer.style = "grid-column: 1 / span 4;";
    filtersContainer.appendChild(searchContainer);

    const searchTitle = document.createElement("div");
    searchTitle.id = "ztbf-search-title";
    searchTitle.style = "font-weight:bold;font-family: arial; font-size: 14px;";
    searchTitle.innerText = "Recherche";
    searchContainer.appendChild(searchTitle);

    const searchInput = document.createElement("input");
    searchInput.id = "ztbf-search-input";
    searchInput.name = "search";
    searchInput.style = "width:100%;";
    searchInput.placeholder = "Recherche";
    searchContainer.appendChild(searchInput);

    const formButtonContainer = document.createElement("div");
    formButtonContainer.id = "ztbf-form-button-container";
    formButtonContainer.style = "display: flex; justify-content: center; gap: .5rem; margin-top: .5rem;";
    newContainer.appendChild(formButtonContainer);

    const searchButton = document.createElement("button");
    searchButton.id = "ztbf-search-button";
    searchButton.innerText = "Rechercher";
    formButtonContainer.appendChild(searchButton);

    // create the reset filter
    const resetContainer = document.createElement("div");
    resetContainer.id = "ztbf-reset";
    formButtonContainer.appendChild(resetContainer);

    const resetButton = document.createElement("button");
    resetButton.id = "ztbf-reset-button";
    resetButton.innerText = "Réinitialiser";
    resetContainer.appendChild(resetButton);

    // on searchButton click, submit the form
    searchButton.addEventListener("click", () => {
        filtersContainer.submit();
    });

    // on resetButton click, reset the filters
    resetButton.addEventListener("click", () => {
        categoriesSelect.value = "";
        categoriesSelect.dispatchEvent(new Event("change"));
        yearSelect.value = "";
        genreSelect.value = "";
        searchInput.value = "";
        filtersContainer.submit();
    });

    // set the current url parameters to the filters
    categoriesSelect.value = urlParams.get("p");
    categoriesSelect.dispatchEvent(new Event("change"));
    subCategoriesSelect.value = urlParams.get("s");
    yearSelect.value = urlParams.get("year");
    genreSelect.value = urlParams.get("genre");
    searchInput.value = urlParams.get("search");

})();
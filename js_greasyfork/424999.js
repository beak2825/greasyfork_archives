// ==UserScript==
// @name        DLsite Filter Works by Category for Circle Pages
// @namespace   Zero_G@4d7d460c-0424-11eb-adc1-0242ac120002
// @description Add a combox in circle pages to filter works by category
// @include     *.dlsite.com/*/circle/profile/=/*
// @version     1.2
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/424999/DLsite%20Filter%20Works%20by%20Category%20for%20Circle%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/424999/DLsite%20Filter%20Works%20by%20Category%20for%20Circle%20Pages.meta.js
// ==/UserScript==

(function () {
  // Define categories
  var categories = [
    {
        '---Games---': ['type_ACN', 'type_QIZ', 'type_ADV', 'type_RPG', 'type_TBL', 'type_DNV', 'type_SLN', 'type_TYP', 'type_TYP', 'type_STG', 'type_PZL', 'type_ETC'],
        'Action': 'type_ACN',
        'Quiz': 'type_QIZ',
        'Adventure': 'type_ADV',
        'RPG': 'type_RPG',
        'Table': 'type_TBL',
        'Digital Novel': 'type_DNV',
        'Simulation': 'type_SLN',
        'Typing': 'type_TYP',
        'Shooting': 'type_STG',
        'Puzzle': 'type_PZL',
        'Miscellaneous Games': 'type_ETC'
    },
    {
        '---Manga---': ['type_MNG', 'type_SCM', 'type_magazine', 'type_comic', 'type_oneshot'],
        'Manga': 'type_MNG',
        'Gekiga': 'type_SCM',
        'Magazine/Anthology': 'type_magazine',
        'Book': 'type_comic',
        'Oneshot/Standalone': 'type_oneshot'
    },
    {
        '---CG + Illustrations---': ['type_ICG'],
        'CG + Illustrations': 'type_ICG'
    },
    {
        '---Novel---': ['type_NRE', 'type_short'],
        'Novel': 'type_NRE',
        'Short Stories': 'type_short'
    },
    {
        '---Video---': ['type_MOV'],
        'Video': 'type_MOV'
    },
    {
        '---Voice / ASMR---': ['type_SOU'],
        'Voice / ASMR': 'type_SOU'
    },
    {
        '---Music---': ['type_MUS'],
        'Music': 'type_MUS'
    },
    {
        '---Tools / Accessories---': ['type_TOL', 'type_IMT', 'type_AMT'],
        'Tools / Accessories': 'type_TOL',
        'Illustration Materials': 'type_IMT',
        'Music Materials': 'type_AMT'
    },
    {
        '---Miscellaneous---': ['type_ET3', 'type_VCM'],
        'Miscellaneous': 'type_ET3',
        'Voiced Comics': 'type_VCM'
    }
  ];

  // Get 'sort by' element
  var sortbox = document.getElementsByClassName('sort_box border_b pb10')[0];

  // Check if element exits
  if (sortbox) {
    // Get all works
    let works = document.getElementsByClassName('work_category');

    // Create new sortbox
    let newSortbox = document.createElement('div');
    newSortbox.className = 'sort_box border_b pb10';

    // Put new sortbox down of 'sort by' element
    document.getElementById('main_inner').insertBefore(newSortbox, sortbox.nextSibling);

    // Create select
    let select = document.createElement('select');
    let divSelect = document.createElement('div');
    let divPadding = document.createElement('div');
    divSelect.className = 'status_select';
    divSelect.textContent = 'Filter by: ';
    divPadding.className = 'display_num_select';

    // Append select
    divSelect.appendChild(select);
    newSortbox.appendChild(divSelect);
    newSortbox.appendChild(divPadding);

    // Get categories present
    categories = filterCategories(categories, works);

    // Populate select
    populateSelect(select, categories);

    // Add event listener for change event
    select.addEventListener("change", selectChanged);
  } else {
    console.log("Error. Couldn't find sortbox element");
    return;
  }

  // Function will leave only categories that are present in current page
  // Recive categories array and works elements array
  function filterCategories(categs, works){
    let categoriesPresent = '';
    let newCategories = [];

    // Get all current works categories
    Array.from(works).forEach(work => {
        let catName = work.className;
        catName = catName.substring(14);

        if(!categoriesPresent.includes(catName)) categoriesPresent += ';' + catName;
    });

    categs.forEach(cat => {
        let categoryDictionary = {};

        // Loop subcategory, add present categories in new dictionary
        for (const key in cat){
            if(Array.isArray(cat[key])) {            // If it's the name of the subcategory add it
                categoryDictionary[key] = cat[key];
            }else{
                if(categoriesPresent.includes(cat[key])) {  // Category found, add it
                    categoryDictionary[key] = cat[key];
                }
            }
        }

        // Only add the subcategory dictionary if there are categories apart from the separator
        if(ObjectSize(categoryDictionary) >= 2) newCategories.push(categoryDictionary);
    });

    return newCategories;
  }

  // Function that triggers on select changed, will show or hide the work/releases depending on category selected
  function selectChanged(event){
      let filter = event.target.value;
      let searchResults = document.getElementById('search_result_img_box');
      let works = searchResults.getElementsByClassName('work_category');
      
      if(filter === 'none'){
        // If filter is none, show all works
        Array.from(works).forEach(work => {
            work.parentNode.parentNode.parentNode.style.display = 'block';
        });
      } else if(filter.includes(';')){
        // Check if current category is a multi one (title of subcategory selected)
        filter = filter.split(';');
        Array.from(works).forEach(work => {
            let found = false;

            // Check each work for each one of the multi category
            filter.forEach(item => {
                if(work.className.includes(item)){
                    work.parentNode.parentNode.parentNode.style.display = 'block';
                    found = true;
                }
            });
            
            // If work wasn't part of the multi category hide it
            if(!found) work.parentNode.parentNode.parentNode.style.display = 'none';
        });
      }else{
        // Simple category, check each work and hide/show it
        Array.from(works).forEach(work => {
            if(work.className.includes(filter)) work.parentNode.parentNode.parentNode.style.display = 'block';
            else work.parentNode.parentNode.parentNode.style.display = 'none';
        });
      }
  }

  function addOptionToSelect(sel, optText, value){
    let option = document.createElement('option');
    option.text = optText;
    option.value = value;
    sel.add(option);
  }

  function populateSelect(sel, categories){
    addOptionToSelect(sel, '---None---', 'none');
    categories.forEach(subcat => {
        for (const key in subcat) {
            if(Array.isArray(subcat[key])){
                addOptionToSelect(sel, key, subcat[key].join(';'));
            }else{
                addOptionToSelect(sel, key, subcat[key]);
            }
        }
    })
  }

  function ObjectSize(obj) {
    var size = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };  
})();
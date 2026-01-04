// ==UserScript==
// @name         Baselinker Multi-Page Tool
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Rozszerza funkcje Baselinkera
// @author       Paweł Kaczmarek
// @match        https://panel-a.baselinker.com/*
// @match        https://panel.baselinker.com/*
// @match        https://panel-b.baselinker.com/*
// @match        https://panel-c.baselinker.com/*
// @match        https://panel-d.baselinker.com/*
// @match        https://panel-e.baselinker.com/*
// @match        https://panel-f.baselinker.com/*
// @match        https://panel-g.baselinker.com/*
// @match        https://panel-h.baselinker.com/*
// @match        https://panel-i.baselinker.com/*
// @match        https://panel-j.baselinker.com/*
// @match        https://panel-k.baselinker.com/*
// @match        https://panel-l.baselinker.com/*
// @match        https://panel-m.baselinker.com/*
// @match        https://panel-n.baselinker.com/*
// @match        https://panel-o.baselinker.com/*
// @match        https://panel-p.baselinker.com/*
// @match        https://panel-q.baselinker.com/*
// @match        https://panel-r.baselinker.com/*
// @match        https://panel-s.baselinker.com/*
// @match        https://panel-t.baselinker.com/*
// @match        https://panel-u.baselinker.com/*
// @match        https://panel-v.baselinker.com/*
// @match        https://panel-w.baselinker.com/*
// @match        https://panel-x.baselinker.com/*
// @match        https://panel-y.baselinker.com/*
// @match        https://panel-z.baselinker.com/*


// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525580/Baselinker%20Multi-Page%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/525580/Baselinker%20Multi-Page%20Tool.meta.js
// ==/UserScript==

(function(){'use strict';function addGlobalStyles(){const style=document.createElement('style');style.id='tampermonkey-styles';style.textContent=`
            .tm-search-container {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            .tm-search-box {
                flex: 1;
                border: 1px solid #ccc;
                padding: 5px;
                color: #FF5C0A;
                font-weight: bold;
            }
            .tm-search-box::placeholder {
                color: #FF5C0A;
            }
            .tm-highlight {
                color: #FF5C0A;
                font-weight: bold;
            }
            .tm-action-buttons {
                margin-left: 10px;
                display: inline-flex;
                gap: 5px;
            }
            .tm-action-buttons a {
                background-color: #434343;
                color: #fff;
                padding: 3px 6px;
                border-radius: 3px;
                text-decoration: none;
                font-size: 12px;
            }
            .tm-action-buttons a:hover {
                background-color: #e04b07;
            }
        `;document.head.appendChild(style)}
function isCurrentPage(pathname){return window.location.pathname.includes(pathname)}
function enhanceAllegroAuctionsPage(){const themeSelector=document.querySelector('#theme');if(!themeSelector){console.warn('Theme selector not found');return}
if(document.querySelector('#theme-search-1'))return;const searchContainer=document.createElement('div');searchContainer.className='tm-search-container';const searchBox1=document.createElement('input');searchBox1.id='theme-search-1';searchBox1.className='tm-search-box';searchBox1.placeholder='Wyszukaj...';const searchBox2=document.createElement('input');searchBox2.id='theme-search-2';searchBox2.className='tm-search-box';searchBox2.placeholder='Oraz...';searchContainer.appendChild(searchBox1);searchContainer.appendChild(searchBox2);themeSelector.parentElement.insertBefore(searchContainer,themeSelector);function filterOptions(){const query1=searchBox1.value.toLowerCase();const query2=searchBox2.value.toLowerCase();const options=themeSelector.querySelectorAll('option');options.forEach(option=>{const text=option.textContent.toLowerCase();const matchesQuery1=query1?text.includes(query1):!0;const matchesQuery2=query2?text.includes(query2):!0;if(matchesQuery1&&matchesQuery2){option.style.display='';option.innerHTML=option.textContent.replace(new RegExp(`(${query1}|${query2})`,'gi'),match=>{return `<span class="tm-highlight">${match}</span>`})}else{option.style.display='none';option.innerHTML=option.textContent}})}
searchBox1.addEventListener('input',filterOptions);searchBox2.addEventListener('input',filterOptions)}
function enhanceAllegroThemesPage(){const table=document.querySelector('#table_allegro_themes');if(!table){console.warn('Allegro themes table not found');return}
if(document.querySelector('#themes-table-search'))return;const searchBox=document.createElement('input');searchBox.id='themes-table-search';searchBox.className='tm-search-box';searchBox.placeholder='Wyszukaj w szablonach...';table.parentElement.insertBefore(searchBox,table);searchBox.addEventListener('input',function(){const query=searchBox.value.toLowerCase();const rows=table.querySelectorAll('tr');rows.forEach(row=>{const nameCell=row.querySelector('td:nth-child(2) b');if(nameCell){const text=nameCell.textContent.toLowerCase();if(text.includes(query)){row.style.display='';nameCell.innerHTML=nameCell.textContent.replace(new RegExp(`(${query})`,'gi'),match=>{return `<span class="tm-highlight">${match}</span>`})}else{row.style.display='none';nameCell.innerHTML=nameCell.textContent}}})})}
function enhanceAllegroThemeButton(){const saveButton=document.querySelector('.btn_form_save');if(saveButton){saveButton.style.setProperty('z-index','9999','important');saveButton.style.setProperty('position','fixed','important');saveButton.style.setProperty('left','300px','important');saveButton.style.setProperty('bottom','20px','important');saveButton.style.setProperty('background-color','#FF5C0A','important');saveButton.style.setProperty('border-color','#FF5C0A','important')}else{console.warn('Save button not found on this page')}}
function enhanceAllegroAuctionsTable(){const table=document.querySelector('#table_auctions_allegro > table');if(!table){console.warn('Allegro auctions table not found');return}
const rows=table.querySelectorAll('tr');console.log(`Found ${rows.length} rows`);rows.forEach(row=>{const auctionLink=row.querySelector('td:nth-child(4) a');const auctionIdElement=row.querySelector('td:nth-child(4) span.cell-second-line');if(!auctionLink||!auctionIdElement){console.warn('Auction link or ID element not found in this row');return}
const auctionIdMatch=auctionIdElement.textContent.match(/\((\d+)\)/);if(auctionIdMatch){const auctionId=auctionIdMatch[1];const oldButtons=row.querySelectorAll('.tm-action-buttons');if(oldButtons){oldButtons.forEach(button=>button.remove())}
const actionButtons=document.createElement('div');actionButtons.className='tm-action-buttons';const editButton=document.createElement('a');editButton.href=`https://salescenter.allegro.com/offer/${auctionId}`;editButton.textContent='Edytuj';editButton.target='_blank';const similarButton=document.createElement('a');similarButton.href=`https://salescenter.allegro.com/offer/${auctionId}/similar`;similarButton.textContent='Wystaw podobną';similarButton.target='_blank';actionButtons.appendChild(editButton);actionButtons.appendChild(similarButton);const nameCell=row.querySelector('td:nth-child(4)');if(nameCell){nameCell.appendChild(actionButtons);console.log('Buttons successfully added to the row')}else{console.warn('td:nth-child(4) not found in this row')}}else{console.warn('Auction ID not found in the span:',auctionIdElement.textContent)}})}
function initializeEnhancements(){addGlobalStyles();if(isCurrentPage('allegro_themes.php')){enhanceAllegroThemeButton();enhanceAllegroThemesPage()}
if(isCurrentPage('allegro_auctions.php')){function debounce(func,wait){let timeout;return function(...args){clearTimeout(timeout);timeout=setTimeout(()=>func.apply(this,args),wait)}}
const debouncedEnhanceTable=debounce(enhanceAllegroAuctionsTable,3000);const open=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){this.addEventListener('load',function(){if(this.responseURL.includes('ajax_table_common.php')){console.log('Zapytanie AJAX zakończone',this.responseURL);debouncedEnhanceTable()}});open.apply(this,arguments)};const observer=new MutationObserver(mutations=>{mutations.forEach(mutation=>{const modal=document.querySelector('#auction_details_modal > div > div');if(modal&&modal.style.display!=='none'){enhanceAllegroAuctionsPage()}})});observer.observe(document.body,{childList:!0,subtree:!0});const tableObserver=new MutationObserver(()=>{console.log('Table content updated, adding buttons');debouncedEnhanceTable()});const table=document.querySelector('#table_auctions_allegro > table');if(table){tableObserver.observe(table,{childList:!0,subtree:!0})}
debouncedEnhanceTable();const paginationObserver=new MutationObserver(()=>{console.log('Pagination or table change detected');debouncedEnhanceTable()});const paginationContainer=document.querySelector('.pagination');if(paginationContainer){paginationObserver.observe(paginationContainer,{childList:!0})}}}
initializeEnhancements()})()
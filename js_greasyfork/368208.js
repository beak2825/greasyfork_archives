// ==UserScript==
// @name         Talibri Tab Cleanup
// @namespace    http://talibri.reznal.net/
// @version      0.1
// @description  A cleanup script for Talibri
// @author       Reznal
// @match        https://talibri.com/*
// @grant        none
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/368208/Talibri%20Tab%20Cleanup.user.js
// @updateURL https://update.greasyfork.org/scripts/368208/Talibri%20Tab%20Cleanup.meta.js
// ==/UserScript==

function inventoryTabs(){
  let mainPage = document.getElementsByClassName("main-page");
  let altarPanel = document.getElementsByClassName("panel-default")[0];
  let invPanel = document.getElementsByClassName("panel-success")[0];
  let componentsPanel = invPanel.getElementsByClassName("panel-heading")[0];
  let itemsPanel = invPanel.getElementsByClassName("panel")[0];

  let nav = `
    <div class="panel">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item active">
      <a class="nav-link active" id="altar-tab" data-toggle="tab" href="#altar" role="tab" aria-controls="altar" aria-selected="true">Altar</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="components-tab" data-toggle="tab" href="#components" role="tab" aria-controls="components" aria-selected="false">Components</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="items-tab" data-toggle="tab" href="#items" role="tab" aria-controls="items" aria-selected="false">Items</a>
    </li>
    </ul>
    </div>

    <div class="tab-content">
    <div class="tab-pane active" id="altar" role="tabpanel" aria-labelledby="altar-tab">${altarPanel.outerHTML}</div>
    <div class="tab-pane" id="components" role="tabpanel" aria-labelledby="components-tab">
    <div class="panel">
    ${componentsPanel.outerHTML}
    </div>
    </div>
    <div class="tab-pane" id="items" role="tabpanel" aria-labelledby="items-tab">${itemsPanel.outerHTML}</div>
    </div>`;

  mainPage[0].innerHTML = nav;
}

function craftingTabs(){
  let mainPage = document.getElementsByClassName("main-page")[0];
  let queuePanel = mainPage.getElementsByClassName("panel")[0];
  let recipePanel = mainPage.getElementsByClassName("panel-success")[0];

  let nav = `
    <div class="panel">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item active">
      <a class="nav-link active" id="altar-tab" data-toggle="tab" href="#altar" role="tab" aria-controls="altar" aria-selected="true">Queue</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="components-tab" data-toggle="tab" href="#components" role="tab" aria-controls="components" aria-selected="false">Recipes</a>
    </li>
    </ul>
    </div>

    <div class="tab-content">
    <div class="tab-pane active" id="altar" role="tabpanel" aria-labelledby="altar-tab">${queuePanel.outerHTML}</div>
    <div class="tab-pane" id="components" role="tabpanel" aria-labelledby="components-tab">${recipePanel.outerHTML}</div>
    </div>`;

  mainPage.innerHTML = nav;
}

function smithMasteryTabs(){
  let mainPage = document.getElementsByClassName("main-page")[0];
  let itemsPanel = mainPage.getElementsByClassName("row")[0];
  let componentsPanel = mainPage.getElementsByClassName("row")[1];

  let bars = [];
  let nails = [];
  let arrowheads = [];

  let items = itemsPanel.getElementsByClassName("col-md-3");

  for(let i = 0; i < items.length; i++){
    if(i == 0 || i % 3 == 0){
      bars.push(items[i].outerHTML);
      // console.log('bar ' + i);
    }else if(i - 1 == 0 || (i - 1) % 3 == 0){
      nails.push(items[i].outerHTML);
      // console.log('nails ' + i);
    }else if(i - 2 == 0 || (i - 2) % 3 == 0){
      arrowheads.push(items[i].outerHTML);
      // console.log('arrowhead ' + i);
    }
  }

  let nav = `
    <div class="panel">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item active">
      <a class="nav-link active" id="bars-tab" data-toggle="tab" href="#bars" role="tab" aria-controls="bars" aria-selected="true">Bars</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="nails-tab" data-toggle="tab" href="#nails" role="tab" aria-controls="nails" aria-selected="true">Nails</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="arrowheads-tab" data-toggle="tab" href="#arrowheads" role="tab" aria-controls="arrowheads" aria-selected="true">Arrowheads</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="components-tab" data-toggle="tab" href="#components" role="tab" aria-controls="components" aria-selected="false">Components</a>
    </li>
    </ul>
    </div>

    <div class="tab-content">
    <div class="tab-pane active" id="bars" role="tabpanel" aria-labelledby="bars-tab">${bars}</div>
    <div class="tab-pane" id="nails" role="tabpanel" aria-labelledby="nails-tab">${nails}</div>
    <div class="tab-pane" id="arrowheads" role="tabpanel" aria-labelledby="arrowheads-tab">${arrowheads}</div>
    <div class="tab-pane" id="components" role="tabpanel" aria-labelledby="components-tab">${componentsPanel.outerHTML}</div>
    </div>`;

  mainPage.innerHTML = nav;
}

function tailorMasteryTabs(){
  let mainPage = document.getElementsByClassName("main-page")[0];
  let clothPanel = mainPage.getElementsByClassName("row")[0];
  let componentsPanel = mainPage.getElementsByClassName("row")[1];

  let nav = `
    <div class="panel">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item active">
      <a class="nav-link active" id="cloth-tab" data-toggle="tab" href="#cloth" role="tab" aria-controls="cloth" aria-selected="true">Cloth</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="components-tab" data-toggle="tab" href="#components" role="tab" aria-controls="components" aria-selected="false">Components</a>
    </li>
    </ul>
    </div>

    <div class="tab-content">
    <div class="tab-pane active" id="cloth" role="tabpanel" aria-labelledby="cloth-tab">${clothPanel.outerHTML}</div>
    <div class="tab-pane" id="components" role="tabpanel" aria-labelledby="components-tab">${componentsPanel.outerHTML}</div>
    </div>`;

  mainPage.innerHTML = nav;
}

function woodworkMasteryTabs(){
  let mainPage = document.getElementsByClassName("main-page")[0];
  let itemsPanel = mainPage.getElementsByClassName("row")[0];
  let componentsPanel = mainPage.getElementsByClassName("row")[1];

  let planks = [];
  let arrows = [];

  let items = itemsPanel.getElementsByClassName("col-md-3");

  for(let i = 0; i < items.length; i++){
    if(i == 0 || i % 2 == 0){
      planks.push(items[i].outerHTML);
    }else if(i - 1 == 0 || (i - 1) % 2 == 0){
      arrows.push(items[i].outerHTML);
    }
  }

  let nav = `
    <div class="panel">
    <ul class="nav nav-tabs" id="myTab" role="tablist">
    <li class="nav-item active">
      <a class="nav-link active" id="planks-tab" data-toggle="tab" href="#planks" role="tab" aria-controls="planks" aria-selected="true">Planks</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="arrows-tab" data-toggle="tab" href="#arrows" role="tab" aria-controls="arrows" aria-selected="true">Arrows</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" id="components-tab" data-toggle="tab" href="#components" role="tab" aria-controls="components" aria-selected="false">Components</a>
    </li>
    </ul>
    </div>

    <div class="tab-content">
    <div class="tab-pane active" id="planks" role="tabpanel" aria-labelledby="planks-tab">${planks}</div>
    <div class="tab-pane" id="arrows" role="tabpanel" aria-labelledby="arrows-tab">${arrows}</div>
    <div class="tab-pane" id="components" role="tabpanel" aria-labelledby="components-tab">${componentsPanel.outerHTML}</div>
    </div>`;

  mainPage.innerHTML = nav;
}

function checkPage() {
  let page = document.URL.split('/').splice(3);

  if (page[0] === 'inventory') {
      inventoryTabs();
  }else if(page[0] === 'crafting'){
      craftingTabs();
  }else if(page[2] === 'masteries' && page[3] === '7'){
      smithMasteryTabs();
  }else if(page[2] === 'masteries' && page[3] === '10'){
    tailorMasteryTabs();
  }else if(page[2] === 'masteries' && page[3] === '8'){
    woodworkMasteryTabs();
  }
}

waitForKeyElements(".main-page", checkPage);
// ==UserScript==
// @name        GetRes - generationeuro.eu
// @namespace   Violentmonkey Scripts
// @match       https://www.generationeuro.eu/*
// @grant       none
// @version     1.0
// @author      -
// @license     MIT
// @description 25/09/2023, 16:29:18
// @downloadURL https://update.greasyfork.org/scripts/476086/GetRes%20-%20generationeuroeu.user.js
// @updateURL https://update.greasyfork.org/scripts/476086/GetRes%20-%20generationeuroeu.meta.js
// ==/UserScript==

const dataKey = 'eurogetres';
var dataDict = {};

var foundAnswer = false;
var answerClicked = false;
var reloading = false;

const freq = 1000;
var maxBeforeRefresh = 10;

var scraping = false;
var hintEnabled = false;

var guiTooltip = null;
var guiCurrentDataset = null;
var guiInfoDateset = null;

if (localStorage.getItem(dataKey)){
  dataDict = JSON.parse(localStorage.getItem(dataKey));
}

const settingsKey = 'scrapperSettingsKey';
var settingsDict = {};
if (localStorage.getItem(settingsKey)){
  settingsDict = JSON.parse(localStorage.getItem(settingsKey));
}

// utils

function settingsGet(key, def){
  if (!(key in settingsDict)){
    settingsDict[key] = def;
  }
  return settingsDict[key];
}
function saveSettings(){
  localStorage.setItem(settingsKey, JSON.stringify(settingsDict));
}
function setSettingsKey(key, value){
  settingsDict[key] = value;
  saveSettings();
  return settingsDict[key];
}

function createGui(){
  let visible = settingsGet('visible', true);
  scraping = settingsGet('scraping', false);
  hintEnabled = settingsGet('hintEnabled', false);

  guiTooltip = document.createElement('div');
  guiTooltip.style.position = 'fixed';
  guiTooltip.style.left = '500px';
  guiTooltip.style.top = '500px';
  guiTooltip.style.width = '1000px';
  guiTooltip.style.height = '50px';
  guiTooltip.style.textShadow = '1px 1px 2px white';
  guiTooltip.style.color = 'black';
  guiTooltip.style.borderRadius = '5px';
  guiTooltip.style.pointerEvents = 'none';
  guiTooltip.style.userSelect = 'none';
  guiTooltip.style.zIndex = 99999;

  const btnShow = document.createElement('div');
  btnShow.style.position = 'fixed';
  btnShow.style.left = '5px';
  btnShow.style.top = '5px';
  btnShow.style.width = '20px';
  btnShow.style.height = '20px';
  btnShow.style.background = 'rgba(0,0,0,.1)';
  btnShow.style.color = 'white';
  btnShow.style.borderRadius = '5px';
  btnShow.style.display = 'flex';
  btnShow.style.justifyContent = 'center';
  btnShow.style.alignItems = 'center';
  btnShow.style.cursor = 'pointer';
  btnShow.style.zIndex = 9999;

  const btnShowText = document.createElement('div');
  btnShowText.innerText = 'x';
  btnShowText.style.marginBottom = '4px';
  btnShowText.style.pointerEvents = 'none';
  btnShowText.style.userSelect = 'none';
  btnShow.appendChild(btnShowText);

  const box = document.createElement('div');
  box.style.position = 'fixed';
  box.style.left = '5px';
  box.style.top = '30px';
  box.style.width = '150px';
  box.style.height = '250px';
  box.style.background = 'rgba(0,0,0,.3)';
  box.style.color = 'white';
  box.style.borderRadius = '5px';
  box.style.zIndex = 9999;
  box.style.display = 'flex';
  box.style.justifyContent = 'center';
  box.style.alignItems = 'center';
  box.style.flexDirection = 'column';

  const btnHint = document.createElement('div');
  btnHint.style.userSelect = 'none';
  btnHint.style.cursor = 'pointer';
  btnHint.innerText = '[toggle answer]';
  box.appendChild(btnHint);

  const space0 = document.createElement('div');
  space0.style.height = '15px';
  box.appendChild(space0);


  guiInfoDateset = document.createElement('div');
  guiInfoDateset.style.userSelect = 'none';
  box.appendChild(guiInfoDateset);

  const text0 = document.createElement('div');
  text0.style.userSelect = 'none';
  text0.innerText = 'current dataset:';
  box.appendChild(text0);

  guiCurrentDataset = document.createElement('textarea');
  guiCurrentDataset.style.width = '140px';
  guiCurrentDataset.style.height = '30px';
  guiCurrentDataset.style.color = 'black';
  guiCurrentDataset.style.opacity = '.5';
  guiCurrentDataset.style.border = 'none';
  guiCurrentDataset.style.padding = '0';
  guiCurrentDataset.style.whiteSpace = 'pre-wrap';
  box.appendChild(guiCurrentDataset);

  const space1 = document.createElement('div');
  space1.style.height = '15px';
  box.appendChild(space1);

  const btnSetDataset = document.createElement('div');
  btnSetDataset.style.userSelect = 'none';
  btnSetDataset.style.cursor = 'pointer';
  btnSetDataset.innerText = '[set dataset]';
  box.appendChild(btnSetDataset);

  const inputDataset = document.createElement('textarea');
  inputDataset.style.width = '140px';
  inputDataset.style.height = '30px';
  inputDataset.style.color = 'black';
  inputDataset.style.opacity = '.5';
  inputDataset.style.border = 'none';
  inputDataset.style.padding = '0';
  inputDataset.style.whiteSpace = 'pre-wrap';
  box.appendChild(inputDataset);
  
  const btnScrape = document.createElement('div');
  btnScrape.style.userSelect = 'none';
  btnScrape.style.cursor = 'pointer';
  btnScrape.innerText = '[toggle scrape]';
  box.appendChild(btnScrape);

  document.body.appendChild(box);
  document.body.appendChild(btnShow);
  document.body.appendChild(guiTooltip);

  // btn scrape
  function refreshBtnScraping(){
    btnScrape.style.color = scraping ? 'rgb(0,200,255)' : 'white';

    if (scraping){
      startScraping();
    }
  }
  btnScrape.addEventListener('click', () => {
    scraping = setSettingsKey('scraping', !scraping);
    refreshBtnScraping();
  });
  setTimeout(refreshBtnScraping, 100);

  // btn show
  function refreshBtnShow(){
    box.style.display = visible ? 'flex' : 'none';
  }
  btnShow.addEventListener('click', () => {
    visible = setSettingsKey('visible', !visible);
    refreshBtnShow();
  });
  refreshBtnShow();

  // btn hint
  function refreshBtnHint(){
    btnHint.style.color = hintEnabled ? 'rgb(0,200,255)' : 'white';

    if (hintEnabled){
      startHint();
    }
  }
  btnHint.addEventListener('click', () => {
    hintEnabled = setSettingsKey('hintEnabled', !hintEnabled);
    refreshBtnHint();
  });
  refreshBtnHint();

  btnSetDataset.addEventListener('click', () => {
    let v = {};
    try {
      v = JSON.parse(inputDataset.value);
    } finally {
      dataDict = v;
      saveDict();
    }
  });
}

function refreshDataDict(){
  const v = JSON.stringify(dataDict).replaceAll(',"',',\n\n"').replaceAll(':"',':\n"');
  guiCurrentDataset.textContent = v;
  guiInfoDateset.innerText = `#Dateset: ${Object.keys(dataDict).length}`;
}

function saveDict(){
  refreshDataDict()
  localStorage.setItem(dataKey, JSON.stringify(dataDict));
}

function getChildClassName(par, className, follow){
  Array.from(par.childNodes).map((child) => {
    if (child.className == className){
      if (follow){
        return follow(child);
      }
      return child;
    }
  });
}


function cycleRegister(){
  if (!scraping){return}

  questions = document.getElementsByClassName('question');
  if (questions.length>0){
    const question = questions[0].innerText;
    if (question in dataDict){
      console.log(`Question already found (${Object.keys(dataDict).length})`);
      foundAnswer = true;
    } else {
      corrects = document.getElementsByClassName('checkmarkcorreta');
      if (corrects.length>0){
        let answer = false;
        getChildClassName(corrects[0].parentNode.parentNode.parentNode, 'col-8 divtextresposta ', (child) => {
          getChildClassName(child, 'spantextresposta spantextrespostacorreta', (child) => {
            foundAnswer = true;
            answer = child.innerText;

            dataDict[question] = answer;
            console.log(`Saved answer to:\n${question}\n${answer}`);
            console.log(`Found ${Object.keys(dataDict).length} q&a.`);
            saveDict();
            //postSavedData();
          });
        });
      }
    }

  }

  if (foundAnswer && answerClicked){
    maxBeforeRefresh--;
    if (maxBeforeRefresh>0){
      const btn = document.getElementById('next');
      if (btn){
        btn.click();
        answerClicked = false;
        foundAnswer = false;
      }
    } else {
      location.reload();
      return;
    }
  }

  setTimeout(cycleRegister, freq);
}

function cycleClick(){
  if (!scraping){return}

  if (!answerClicked){
    const elems = document.getElementsByClassName('col-md-5 optionsresposta');
    if (elems.length>0){
      elems[0].click();

      const btn = document.getElementById('resultb');
      if (btn){
        btn.click();
        answerClicked = true;
      }
    }
  }

  setTimeout(cycleClick, freq);
}

function startScraping(){
  scraping = true;
  cycleClick();
  cycleRegister();
}

function cleanString(str){
  return str.replaceAll('\n','').replaceAll(' ','').toLowerCase();
}
function matchClose(list, target){
  //lowercase querying
	target = cleanString(target);

	//cycle trough all names

  let scores = {};
  let best = null;
  for (let ori of list){
  //list.map((ori) => {
    name = cleanString(ori);

    // exact match
    if (target == name){
      return ori;
    }

    let score = 0;

    // same letters
    for (let char of target){
      const index = name.indexOf(char);
      if (index!=-1){
        score += 40;
      }
    }

    //same consecutive letters
    let pass = 0;
    for (let i=0; i<target.length; i++){
      if (pass>0){
        pass--;
        continue;
      }

      let consecutive = 0;
      for (let letter0 of name){
				let letter = target.charAt(i+consecutive);
				if (letter==letter0) {
					if (consecutive>0){
						pass++;
						score += 1000*consecutive/name.length;
          }
					consecutive++;
        } else {
					consecutive = 0
				}
      }
    }

    scores[ori] = score;
    best = ori;
  }

  for (let name of Object.keys(scores)){
    if (scores[name] > scores[best]){
      best = name;
    }
  }

  return best;
}


function getAnswerToQuestion(str){
  questions = Object.keys(dataDict);
  bestQuestion = matchClose(questions, str);

  if (cleanString(bestQuestion) == cleanString(str)){
    return [dataDict[bestQuestion], `✅ ${dataDict[bestQuestion]}`];
  }
  return [dataDict[bestQuestion], `❗ ${bestQuestion}\n❓ ${dataDict[bestQuestion]}`];
}

function searchTextInDocument(str){
  elems = [];

  function cycle(par){
    if (par.innerText == str){
      elems.push(par);
    }
    Array.from(par.childNodes).map(cycle);
  }

  cycle(document.body);
  return elems;
}

var highlightedElems = [];
function clearHighlightedElems(){
  highlightedElems.map((elem) => {
      elem.style.textShadow = 'none';
  });
  highlightedElems = [];
}
function setHighlightedText(str){
  clearHighlightedElems();

  let elems = searchTextInDocument(str);
  elems.map((elem) => {
    if (elem != guiTooltip){
      highlightedElems.push(elem);
      elem.style.textShadow = '1px 1px 2px rgba(0, 255, 100, .5)';
    }
  })
}

function startHint(){
  if (!hintEnabled){return}

  const sel = window.getSelection().toString();
  if (sel && sel!=''){
    const [res, text] = getAnswerToQuestion(sel);
    if (res != guiTooltip.innerText){
      //changed
      setHighlightedText(res);
    }
    guiTooltip.innerText = text;
  } else {
    guiTooltip.innerText = '';
    clearHighlightedElems();
  }

  setTimeout(startHint, 100);
}

document.addEventListener('mousemove', (e) => {
  const x = e.clientX;
  const y = e.clientY;
  guiTooltip.style.left = `${x+10}px`;
  guiTooltip.style.top = `${y}px`;
});

createGui();
refreshDataDict();


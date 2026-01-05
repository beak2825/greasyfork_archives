// ==UserScript==
// @name         Vocabulary for Wanikani
// @namespace    org.dimwits
// @version      1.1.7
// @description  Adds vocabulary to the wanikani dashboard
// @include        https://www.wanikani.com/dashboard
// @include        https://www.wanikani.com
// @author       Eekone
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27038/Vocabulary%20for%20Wanikani.user.js
// @updateURL https://update.greasyfork.org/scripts/27038/Vocabulary%20for%20Wanikani.meta.js
// ==/UserScript==
(function() {  
  const LEVELS_TO_RETRIEVE = 4;

  class WordElement {
    constructor(word) {
      this.word = word;
      this.el = document.createElement('a');
      this.el.setAttribute('lang', 'ja');
      this.el.setAttribute('rel', 'auto-popover');

      if (!word.isMarker) {
        this.el.setAttribute('href', `/vocabulary/${this.word.character}`);
      }

      let parent = document.createElement('li');
      parent.setAttribute('style', `
        background-color: rgba(148, 0, 255, 0.4);
        border: ${this.word.highlight}px solid red;
        border-radius: 5px;
        height: 28px;
        z-index: 2;
      `);
      this.upperBar = document.createElement('div');
      this.lowerBar = document.createElement('div');

      parent.appendChild(this.el);
      parent.appendChild(this.upperBar);
      parent.appendChild(this.lowerBar);

      this.determineProgressBarLength();

      this.setProgress(this.progressBarLength);

      let radius = `${(this.progressBarLength.top === 0) ? 5 : 0}px
      ${(this.progressBarLength.top === 100) ? 0 : 5}px
      ${(this.progressBarLength.bottom === 100) ? 0 : 5}px
      ${(this.progressBarLength.bottom > 0) ? 0 : 5}px`;

      this.el.setAttribute('style', `
        position: relative;
        float: left;
        margin: 3px;
        background-color: ${this.word.color};
        border-radius: ${radius};
        font-size: 1.2em;
        padding: 1px;
        z-index: 2;
        box-shadow: 0 0 0 0;
        -webkit-box-shadow: 0 0 0 0;
         flex-grow: 1;
      `);

      this.el.innerHTML = word.character;
      this.wrapper = document.createElement('li');
      this.wrapper.setAttribute('style', 'height: auto;');
      this.wrapper.appendChild(parent);

      if (word.isMarker) return;
      this.el.addEventListener('mouseover', this.showPopUp.bind(this));
      this.el.addEventListener('mouseleave', this.hidePopUp.bind(this));
    }

    determineProgressBarLength() {
      this.progressBarLength = {top: 50, bottom: 100};
      switch (this.word.srsLevel) {
        case 4:
          this.progressBarLength.bottom = 0;
          break;
        case 3:
          this.progressBarLength.bottom = 50;
          break;
        case 2: break;
        case 1:
          this.progressBarLength.top = 100;
          break;
        default:
          this.progressBarLength.top = 100;
      }
    }

    setProgress(barLength = {top: 0, bottom: 0}) {
      let upperTopLeftRadius = (barLength.top === 50) ? 0 : 5;
      let bottomBottomRightRadius = (barLength.bottom === 50) ? 0 : 5;

      this.upperBar.setAttribute('style', `
        background-color: ${this.word.color};
        border-radius: 5px ${upperTopLeftRadius}px 0px 0px;
        top: 0px;
        width: ${barLength.top}%;
        height: 50%;
        z-index: 1;
      `);

      this.lowerBar.setAttribute('style', `
        background-color: ${this.word.color};
        border-radius: 0px 0px ${bottomBottomRightRadius}px 5px;
        top: 50%;
        width: ${barLength.bottom}%;
        height: 50%;
        z-index: 1;
      `);
    }

    getCoordinates() {
      let coords = { left: 0, top: 0 };
      coords.left += this.el.offsetLeft;
      coords.top += this.el.offsetTop;
      return coords;
    }

    showPopUp() {
      const coords = this.getCoordinates();
      const bBox = this.el.getBoundingClientRect();
      const width = bBox.right - bBox.left;
      const height = bBox.bottom - bBox.top;
      popOverWindow.setCoordinatesAndShow(coords.left, coords.top - height-5, width);
      popOverWindow.setWord(this.word);
    }

    hidePopUp() {
      popOverWindow.hide();
    }

    attachTo(element) {
      element.appendChild(this.wrapper);
    }
  }

  class PopOverWindow {
    constructor(container) {
      this.el = document.createElement('div');
      this.style = '';
      this.container = container;
      this.buildHTML();
    }

    buildHTML() {
      this.el.setAttribute('class', 'popover lattice right in');
      this.popoverInner = document.createElement('div');
      this.popoverInner.setAttribute('class', 'popover-inner');

      let arrow = document.createElement('div');
      arrow.setAttribute('class', 'arrow');
      this.popoverInner.appendChild(arrow);

      this.popoverTitle = document.createElement('h3');
      this.popoverTitle.setAttribute('class', 'popover-title');

      this.popoverMeaning = document.createElement('span');
      this.popoverTitle.appendChild(this.popoverMeaning);

      this.popoverKana = document.createElement('span');
      this.popoverKana.setAttribute('lang', 'ja');
      this.popoverTitle.appendChild(this.popoverKana);
      this.popoverInner.appendChild(this.popoverTitle);

      let contentContainer = document.createElement('div');
      contentContainer.setAttribute('class', 'popover-content');
      this.el.appendChild(this.popoverInner);
      this.el.appendChild(contentContainer);
    }

    show() {
      this.container.appendChild(this.el);
    }

    hide() {
      this.container.removeChild(this.el);
    }

    setCoordinatesAndShow(left, top, elementWidth) {
      this.container.appendChild(this.el);
      this.width = this.el.getBoundingClientRect().right - this.el.getBoundingClientRect().left;

      if (left + this.width > window.innerWidth * 0.95) {
        this.left = left - this.width;
        this.el.setAttribute('class', 'popover lattice left in');
      } else {
        this.left = left + elementWidth;
        this.el.setAttribute('class', 'popover lattice right in');
      }

      this.el.setAttribute('style', `
        top: ${top}px;
        left: ${this.left}px;
        display: block;
      `);
    }

    setWord(word) {
      this.popoverMeaning.innerHTML = word.meaning + '<br>';
      this.popoverKana.innerHTML = word.kana + '<br>';
      this.popoverKana.innerHTML += `
        <b style="font-size: 0.75em;">
        ${word.nextReview}
      `;
    }
  }

  class Tamperer {
    constructor() {
      this.baseURL = `https://www.wanikani.com/`;
      this.vocabulary = [];
      this.getApiKey().then(() => {
        this.getLevel().then((level) => {
          this.level = level;
          let levelString = '';
          for(let i = this.level; i >= 0 && i > this.level - LEVELS_TO_RETRIEVE; i--)
            levelString += `${i},`;
          this.buildVocab(levelString.slice(0, -1)).then(() => {
            this.visualize();
          });
        });
      });
    }

    getApiKey() {
      return new Promise((resolve, reject) => {
        this.apiKey = localStorage.getItem('apiKey');
        if (this.apiKey !== null && this.apiKey.length === 32) {
          resolve();
          return;
        }

        this.sendRequest('GET', '/account').then((response) => {
          let pattern = new RegExp('<input value="([a-z0-9]{32}).*\n.*/api/user/generate_key');
          this.apiKey = pattern.exec(response)[1];
          localStorage.setItem('apiKey', this.apiKey);

          resolve();
        });
      });
    }

    getLevel() {
      return new Promise ((resolve, reject) => {
        this.sendRequest('GET', `api/user/${this.apiKey}/user-information`).then((userInfo) => {
          const info = JSON.parse(userInfo);
          resolve(info.user_information.level);
        })
        .catch(() => alert('Something has gone south when obtaining level'));
      });
    }

    getOuterContainer() {return document.querySelector('.progression');}

    buildVocab(level) {
      const currentDate = new Date();
      return new Promise((resolve, reject) => {
        this.sendRequest('GET', `api/user/${this.apiKey}/vocabulary/${level}`).then((list) => {
          const vocabList = JSON.parse(list).requested_information;
          let previousWord = null;

          //Delete all unnecessary elements
          for (let i = vocabList.length - 1; i >= 0; i--) {
            if (vocabList[i].user_specific === null) {
              vocabList.splice(i, 1);
            }
          }

          vocabList.sort((left, right) => {
              return (left.level - right.level === 0) ? left.user_specific.available_date - right.user_specific.available_date : right.level - left.level;
          });

          vocabList.forEach((value) => {
            if (value.user_specific !== null &&
                  value.user_specific.srs_numeric <= 4) {
              let word = {};
              word.character = value.character;
              word.kana = value.kana;
              word.meaning = value.meaning.charAt(0).toUpperCase() + value.meaning.split(', ')[0].slice(1);
              word.level = value.level;
              word.srsLevel = value.user_specific.srs_numeric;
              word.color = '#9400ff';
              word.highlight = (word.srsLevel > 1) ? 0 : 1;
              word.availableDate = value.user_specific.available_date;
              word.nextReview =this.formatDate(new Date(value.user_specific.available_date * 1000));                           

              if (previousWord === null || previousWord.level !== word.level) {
                let marker = {};
                marker.character = word.level;
                marker.color = '#434343';               
                marker.isMarker = true;
                this.vocabulary.push(marker);
              }

              word.isMarker = false;
              this.vocabulary.push(word);
              previousWord = word;
            }
          });
          resolve();
        })
        .catch(() => alert('Something has gone south when obtaining vocab list'));
      });
    }

    formatDate(d){
    var s = 'Next: ';
    var now = new Date();
    var YY = d.getFullYear(),
        MM = d.getMonth(),
        DD = d.getDate(),
        hh = d.getHours(),
        mm = d.getMinutes(),
        one_day = 24*60*60*1000;

    if (d < now) return "Available Now";
    var same_day = ((YY == now.getFullYear()) && (MM == now.getMonth()) && (DD == now.getDate()) ? 1 : 0);

    if (same_day) {
        s += 'Today ';
    } else {
        s += ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]+', '+
             ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][MM]+' '+DD+', ';
    }  
    s += ('0'+hh).slice(-2)+':'+('0'+mm).slice(-2);
    
    if (!same_day) {
        var days = (Math.floor((d.getTime()-d.getTimezoneOffset()*60*1000)/one_day)-Math.floor((now.getTime()-d.getTimezoneOffset()*60*1000)/one_day));
        if (days) s += ' ('+days+' day'+(days>1?'s':'')+')';
    }
	return s;
}
    
    sendRequest(method, relativeURL) {
      console.log(relativeURL);
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
       var api_key = localStorage.getItem('apiKey');
        xhr.open(method, this.baseURL + relativeURL);
        xhr.send();
        xhr.onreadystatechange = function() {
          if (xhr.readyState == 4) {
            if (this.status == 200) {resolve(xhr.responseText);} 
            else {reject();}
          }
        };
      });
    }

    visualize() {
        const outerContainer = this.getOuterContainer(); 
        const vocabProgress = document.createElement('div');
        const title = document.createElement('h3');
        title.innerHTML = `Recent Vocabulary Progression`;
        vocabProgress.appendChild(title);
        vocabProgress.setAttribute('class', 'vocabulary-progress');   
      
        let lattice =document.createElement('div');
        lattice.setAttribute('class', 'lattice-multi-character');  
        vocabProgress.appendChild(lattice);
      
        let levelList = document.createElement('ul');         
        var flag=0;
        this.vocabulary.forEach((word) => {
          if (word.isMarker && flag<3) {
            levelList = document.createElement('ul');
            levelList.setAttribute('style', `
             display: flex;
             flex-flow: row wrap;
             justify-content:space-between;
           `);
            let after = document.createElement('li');
            after.setAttribute('style', `
             content: "";
             flex: auto;
             flex-grow: 100;
             order: 1;
           `);
           levelList.appendChild(after);
            lattice.appendChild(levelList);
            flag=flag+1;
          }
          let wordElement = new WordElement(word);
          wordElement.attachTo(levelList);         
          
      });      
      outerContainer.appendChild(vocabProgress);
    }
  }

  const popOverWindow = new PopOverWindow(document.getElementsByTagName('body')[0]);
  const tamperer = new Tamperer();
})();
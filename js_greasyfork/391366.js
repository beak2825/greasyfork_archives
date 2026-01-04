// ==UserScript==
// @name         Sliddit
// @namespace    http://www.github.com/DurbanD/Sliddit/
// @version      0.9
// @description  Full-Screen Slideshow browsing for Reddit
// @author       Durban
// @match        https://www.reddit.com/*
// @match        http://www.reddit.com/*
// @match        http://old.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391366/Sliddit.user.js
// @updateURL https://update.greasyfork.org/scripts/391366/Sliddit.meta.js
// ==/UserScript==

class SlideShow {
  constructor(links=[], counter=0, url='https://www.reddit.com/') {
    this.removeDefaultListeners();
    this.mainURL = url;
    this.dissectedURL = this.dissectURL(this.mainURL);
    this.mainProtocol = this.dissectURL(this.mainURL).urlProtocol;
    this.mainDomain = this.dissectURL(this.mainURL).urlDomain;
    this.mainPath = this.dissectURL(this.mainURL).urlPath;
    this.fetchJsonDefaultString = '.json?limit=100';
    this.counter = counter;
    this.generateAsyncStartup(links,this.mainPath,this.fetchJsonDefaultString);
  }

  removeDefaultListeners = () => {
    while (document.getElementsByClassName('RES-keyNav-activeThing') || document.getElementsByClassName('res-selected')) {
      if (document.getElementsByClassName('RES-keyNav-activeThing').length > 0) {
        document.getElementsByClassName('RES-keyNav-activeThing')[0].classList.remove('RES-keyNav-activeThing');
      }
      if (document.getElementsByClassName('RES-keyNav-activeElement').length > 0) {
        document.getElementsByClassName('RES-keyNav-activeElement')[0].classList.remove('RES-keyNav-activeElement');
      }
      if (document.getElementsByClassName('res-selected').length > 0) {
        document.getElementsByClassName('res-selected')[0].classList.remove('res-selected');
      }
      if (document.getElementsByClassName('RES-keyNav-activeThing').length <= 0 && document.getElementsByClassName('res-selected').length <= 0 && document.getElementsByClassName('RES-keyNav-activeElement').length <= 0) {
        break;
      }
    }
  }

  dissectURL = (url) => {
    try {
      let urlProtocol = url.match(/https{0,1}:\/\//).join();
      let urlDomain = url.match(/\/\/[\.\w]{1,}/).join().replace('//','');
      let urlPath = url.match(/\w\/.*$/).join().replace(/\w\//,'');
      return {urlProtocol, urlDomain, urlPath}
    }
    catch (err) {
      throw err;
    }
  }
  async getUser() {
    let protocol = this.mainProtocol;
    let domain = this.mainDomain;
    let selfQuery = '/api/me.json';
    let getSelf = await fetch(`${protocol}${domain}${selfQuery}`).then(r=>r.json()).then(res=> res);
    return getSelf;
  }

  async generateUserModhash() {
    let user = await this.getUser();
    let xModHash = user.data.modhash;
    return xModHash;
  }

  async generateAsyncStartup(linksList,path,query) {
    let startupLinks = linksList;
    let startupSlideUI = new SlideShowUI(startupLinks, this.counter, this.dissectedURL);
      try {
        startupSlideUI.generateLoadNotice(document.body);
        let modhash = await this.generateUserModhash();
        this.currentModHash = modhash;
        let user = await this.getUser();
        this.currentUser = user;
        let links = await this.generateLinks(startupLinks,path,query);
        this.links = links;
        this.updateUI(this.links, this.counter);
        this.createKeyDownListeners();
      }
      catch (err) {
        throw err;
      }
  }

  async getSelectedNumberOfLinks(path, n) {
    let linkCount = n;
    let protocol = this.mainProtocol;
    let domain = this.mainDomain;
    let linkPath = path;
    let query = `.json?limit=${linkCount}`;
    let url = `${protocol}${domain}/${linkPath}${query}`;
    try {
      let links = await fetch(url).then(r=>r.json()).then(res=>res.data.children);
      if (!links[startNumber+rangeNumber]) {
        rangeNumber = links.length - startNumber;
      }
    return links.slice(startNumber, rangeNumber);
    }
    catch (err) {
      throw err;
    }
  }

  async generateLinks(linksPrimary = [], path = '', query= '.json?limit=100') {
    let linksList = linksPrimary;
    let domain = this.mainDomain;
    let protocol = this.mainProtocol;
    let linkPath;
    if (typeof path !== "string") {
      linkPath = '';
    }
    else {
      linkPath = path;
    }
    let fullPath = `${protocol}${domain}/${linkPath}${query}`;

    if (linksList.length === 0) {
      try {
        let newLinks = fetch(fullPath).then((response) => response.json()).then((result) => newLinks = result.data.children);
        await newLinks; 
        linksList = newLinks;
      } catch (err) {
        console.log(`Unable to generate links for ${fullPath}`);
        throw err;
      }
    }
    else {
      try {
        let currentLast = linksList[linksList.length - 1];
        let extraLinks = fetch(`${fullPath}&after=${currentLast.data.name}`).then((response) => response.json()).then((result) => extraLinks = result.data.children);
        await extraLinks;
        linksList = linksList.concat(extraLinks);
      }
      catch (err) {
        console.log(`Unable to generate links for ${fullPath}&after=${currentLast.data.name}`);
        throw err;
      }
    }
    linksList = this.filterOutDuplicateLinks(linksList);
    this.lastLink = linksList[linksList.length - 1];
    this.currentLink = linksList[this.counter - 1];
    this.links = linksList;
    return linksList;
  }

  async getManyMoreLinks(desiredCallCount) {
    for (let i = 0; i < desiredCallCount; i++) {
      await this.generateLinks(this.links);
    }
    return this.links;
  }

  // action = 1 || 0
  async saveOrUnsaveLink(action, link) {
    let linkID = link.data.name;
    let saveCategory = 'sliddit';
    let xModHash = await this.generateUserModhash();
    this.currentModhash = await xModHash;
    let savePath, query;
    if (action == 1) {
      savePath = '/api/save';
      query = `?id=${linkID}&category=${saveCategory}`;
    }
    if (action == 0) {
      savePath = '/api/unsave';
      query = `?id=${linkID}`;
    }
    let queryURL = `${this.mainProtocol}${this.mainDomain}${savePath}${query}`;
    let pkg = {
      method: 'POST',
      headers: {
        'X-Modhash' : xModHash
      }
    }
    try {
      let postResponse = await fetch(queryURL, pkg).then(r=>r);
      if (postResponse.statusText !== "OK") {
        console.log(`Failure to Upvote: \n`, link.data);
        console.log(`Response: \n`, postResponse);
      }
      else {
        return true;
      }
    }
    catch (err) {
      throw err;
    }
  }

  // action = "sub" || "unsub";
  async subscribeOrUnsubscribeToLinkedSubreddit(action, link) {
    let subredditID = link.data.subreddit_id;
    let xModHash = await this.generateUserModhash();
    this.currentModHash = xModHash;
    let query = `/api/subscribe?action=${action}&sr=${subredditID}&skip_initial_defaults=true`;
    let url = `${this.mainProtocol}${this.mainDomain}${query}`;
    let pkg = {
      method: "POST",
      headers: {
      'X-Modhash': xModHash
      }
    }
    try {
      let postResponse = await fetch(url, pkg).then(r=>r);
      if (postResponse.statusText !== "OK") {
        console.log(`Failure to Upvote: \n`, link.data);
        console.log(`Response: \n`, postResponse);
      }
      else {
        return true;
      }
    }
    catch (err) {
      throw err;
    }
  }

  //voteNumber = -1 || 0 || 1
  async voteOnLink(voteNumber, link) {
    let postID = link.data.name;
    let dir = voteNumber;
    let rank = 2;
    let xModHash = await this.generateUserModhash();
    this.currentModhash = await xModHash;
    let protocol = this.mainProtocol;
    let domain = this.mainDomain;
    let votePath = '/api/vote';
    let query = `?id=${postID}&dir=${dir}&rank=${rank}`;
    let queryURL = `${protocol}${domain}${votePath}${query}`;
    let pkg = {
        method: 'POST',
        headers: {
            'X-Modhash' : xModHash
        }
    }
    try {
      let attemptPost = fetch(queryURL,pkg).then(r=>attemptPost = r);
      await attemptPost;
      if (attemptPost.statusText !== "OK") {
        console.log(`Failure to Upvote: \n`, link.data);
        console.log(`Response: \n`, attemptPost);
      }
      else {
        return true;
      }
    }
    catch (err) {
      throw err;
    }
  }

  filterOutDuplicateLinks(linkList) {
    let newList = [];
    let nameList = {};
    for (let link of linkList) {
      if (nameList[link.data.name] === true) {
        continue;
      }
      else {
        nameList[link.data.name] = true;
        newList.push(link);
      }
    }
    return newList;
  }

  getLastAvailableLink() {
    return this.links[this.links.length-1];
  }

  getCurrentLink() {
    return this.links[this.counter];
  }

  nextLink() {
    this.counter++;
    let path = this.mainPath;
    if ((this.counter+1)/this.links.length >= 0.5) {
      this.generateLinks(this.links, path, this.fetchJsonDefaultString);
    }
    if (this.testLinkAgainstFilters(this.links[this.counter]) == true) {
      return this.updateUI(this.links, this.counter);
    }
    else {
      return this.nextLink();
    }
  }

  previousLink() {
    this.counter--;
    if (this.counter < 0) {
      console.log('You are at the beginning.');
      this.counter = 0;
      this.updateUI(this.links, this.counter);
    } else {
      if (this.testLinkAgainstFilters(this.links[this.counter]) == true) {
        return this.updateUI(this.links, this.counter);
      }
      return this.previousLink();
    }
  }

  createKeyDownListeners() {
    let ssContainer = document.getElementById('slideShowBG');
    ssContainer.focus();

    let keyHandler = () => {
      if (event.code == 'ArrowRight') {
        event.preventDefault();
        this.nextLink();
      }
      if (event.code == 'ArrowLeft') {
        event.preventDefault();
        this.previousLink();
      }
      if (event.code == 'Escape') {
        event.preventDefault();
        this.exitSlideShow();
      }
      if (event.code == 'Enter') {
        document.body.removeEventListener('keyup', keyHandler);
        event.stopImmediatePropagation();
        event.preventDefault();
        window.open('.'+ this.currentLink.data.permalink);
      }
      if (event.code == 'ArrowUp') {
        // document.body.removeEventListener('keyup', keyHandler);
        // let postedIn = document.getElementById('ssPostedIn');
        // postedIn.click();
        let upVoteButton = document.getElementById('ssUpVoteButton');
        upVoteButton.click();
      }
      if (event.code == 'ArrowDown') {
        // document.body.removeEventListener('keyup', keyHandler);
        // let postedBy = document.getElementById('ssPostedBy');
        // postedBy.click();
        let downVoteButton = document.getElementById('ssDownVoteButton');
        downVoteButton.click();
      }
      if (event.code == 'Space') {
        document.body.removeEventListener('keyup', keyHandler);
        event.preventDefault();
        return new SlideShow();
      }
    };
    if (document.getElementById('ssPostedBy')) {
      let postedBy = document.getElementById('ssPostedBy');
      postedBy.addEventListener('click', ()=> {
        document.body.removeEventListener('keyup',keyHandler);
      });
    }
    if (document.getElementById('ssPostedIn')) {
      let postedBy = document.getElementById('ssPostedIn');
      postedBy.addEventListener('click', ()=> {
        document.body.removeEventListener('keyup', keyHandler);
      });
    }

    let keyDownHandler = () => {
      if (event.code == 'ArrowRight') {
        let nextButton = document.getElementById('ssNextButton');
        nextButton.style.background = 'rgba(255,255,255,0.2)';
      }
      if (event.code == 'ArrowLeft') {
        event.preventDefault();
        let previousButton = document.getElementById('ssPreviousButton');
        previousButton.style.background = 'rgba(255,255,255,0.2)';
      }
      if (event.code == 'ArrowUp') {
        let upVoteButton = document.getElementById('ssUpVoteButton');
        upVoteButton.style.background = 'rgba(255,255,255,0.2)';
      }
      if (event.code == 'ArrowDown') {
        let downVoteButton = document.getElementById('ssDownVoteButton');
        downVoteButton.style.background = 'rgba(255,255,255,0.2)';
      }
    }
    document.body.addEventListener('keydown',(e)=> {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();
    });
    document.body.addEventListener('keyup', keyHandler);
    return document.body.addEventListener('keydown',keyDownHandler);
  }

  createNavigationListeners() {
    let link = this.getCurrentLink();
    let ssNext = document.getElementById('ssNextButton');
    let ssPrevious = document.getElementById('ssPreviousButton');
    let ssOptionNav = document.getElementById('ssOptionFlex');
    let ssExit = document.getElementById('ssExitButton');

    let clickToSaveOrClear = async () => {
      if (link.data.saved === true) { //If the button is clicked and the link is already saved, we want to unsave it.
        try {
          let saveState = await this.saveOrUnsaveLink(0,link);
          if (saveState === true) {
            link.data.saved = false;
            this.links[this.counter].data.saved = false;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
      else { // Otherwise, Save it and update the UI to show it's status
        try {
          let saveState = await this.saveOrUnsaveLink(1,link);
          if (saveState === true) {
            link.data.saved = true;
            this.links[this.counter].data.saved = true;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
    }

    let clickToUpVoteOrClear = async () => {
      if (link.data.likes === true) { 
        try {
          let likeState = await this.voteOnLink(0, link);
          if (likeState === true) {
            link.data.likes = null;
            this.links[this.counter].data.likes = null;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
      else { 
        try {
          let likeState = await this.voteOnLink(1, link);
          if (likeState === true) {
            link.data.likes = true;
            this.links[this.counter].data.likes = true;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
    }

    let clickToDownVoteOrClear = async () => {
      if (link.data.likes === false) { 
        try {
          let likeState = await this.voteOnLink(0, link);
          if (likeState === true) {
            link.data.likes = null;
            this.links[this.counter].data.likes = null;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
      else { 
        try {
          let likeState = await this.voteOnLink(-1, link);
          if (likeState === true) {
            link.data.likes = false;
            this.links[this.counter].data.likes = false;
            return this.updateUI(this.links, this.counter);
          }
        }
        catch (err) {
          throw err;
        }
      }
    }

    let openSettingsPanel = () => {
      let ssSettings = new SlideShowSettings(this.dissectedURL);
      ssSettings.createSettingsPanel();
    }
    let nextLinkListenerFunction = () => {
      this.nextLink();
    };
    let previousLinkListenerFunction = () => {
      this.previousLink();
    };
    if (ssNext && ssPrevious) {
      ssNext.addEventListener('click', nextLinkListenerFunction);
      ssPrevious.addEventListener('click', previousLinkListenerFunction);
    }
    if (ssOptionNav) {
      let ssOptionsSettingsNav = document.getElementById('ssSettingsWheel');
      let ssOptionsSave = document.getElementById('ssSaveButton');
      let ssOptionUpVote = document.getElementById('ssUpVoteButton');
      let ssOptionDownVote = document.getElementById('ssDownVoteButton');
      // let ssAnchorButton = document.getElementById('ssAnchorButton');
      ssOptionsSettingsNav.addEventListener('click',openSettingsPanel);
      ssOptionsSave.onclick = clickToSaveOrClear;
      ssOptionUpVote.addEventListener('click', clickToUpVoteOrClear)
      ssOptionDownVote.addEventListener('click', clickToDownVoteOrClear);
    }
    if (ssExit) {
      ssExit.addEventListener('click',this.exitSlideShow);
    }
  }

  getLinkType(link) {
    let imageExtensions = [/\.jpg$/, /\.jpeg$/, /\.png$/, /\.bmp$/, /\.tiff$/, /\.gif$/];
    let videoExtensions = [/\.webm$/, /\.gifv$/, /\.mp4$/, /\.flv$/, /\.mkv$/, /\.avi$/, /\.mpeg$/, /\.mov$/];
    for (let i = 0; i<imageExtensions.length;i++) {
      if (imageExtensions[i].test(link.data.url)) {
        return 'image';
      }
    }
    for (let i = 0; i<videoExtensions.length;i++) {
      if (videoExtensions[i].test(link.data.url)) {
        return 'video';
      }
    }
    if (/^self\./.test(link.data.domain)) {
      return 'self';
    }

    switch (link.data.domain) {
      case "imgur.com":
        if (/\/a\//.test(link.data.url)) {
          return 'other';
        } else {
          return 'image';
        }
      case "gfycat.com":
        return 'video';
      case "v.redd.it":
        return 'video';
      case 'youtu.be':
        return 'video';
      case 'youtube.com':
        return 'video';
      case 'youtube':
        return 'video';
    }

    if (/(?:viewkey=)\w+(?:&)/.test(link.data.url)) {
      return 'video';
    }
    if (/(?:v=)\w+/.test(link.data.url)) {
      return 'video';
    }
    return 'other';
  }

  testLinkAgainstFilters(link) {
    let filterList = new SlideShowSettings(this.dissectedURL).generateStartupSettings();
    let nsfwStatus = link.data.over_18;
    const getNSFWSetting = () => {
      if (filterList['nsfw-filter-hide'] === true) {
        return 'nsfw-filter-hide';
      }
      if (filterList['nsfw-filter-show'] === true) {
        return 'nsfw-filter-show';
      }
      if (filterList['nsfw-filter-show-only'] === true) {
        return 'nsfw-filter-show-only';
      }
    }
    let nsfwSetting = getNSFWSetting();
    let quarantineStatus = link.data.quarantine;
    const getQuarantineSetting = () => {
      if(filterList['quarantine-filter-show'] === true) {
        return 'quarantine-filter-show';
      }
      if(filterList['quarantine-filter-hide'] === true) {
        return 'quarantine-filter-hide';
      }
    }
    let quarantineSetting = getQuarantineSetting();
    let linkType = this.getLinkType(link);
    if (linkType === 'image') {
      if (filterList['image-filter-box'] === false) {
        return false;
      }
    }
    if (linkType === 'video') {
      if (filterList['video-filter-box'] === false) {
        return false;
      }
    }
    if (linkType === 'self') {
      if (filterList['self-post-filter-box'] === false) {
        return false;
      }
    }
    if (linkType === 'other') {
      if (filterList['other-filter-box'] === false) {
        return false;
      }
    }
    if (quarantineStatus == true && quarantineSetting === 'quarantine-filter-hide') {
      return false;
    }
    if (nsfwStatus == true && nsfwSetting === 'nsfw-filter-hide') {
      return false;
    }
    if (nsfwStatus == false && nsfwSetting === 'nsfw-filter-show-only') {
      return false;
    }
    return true;
  }

  updateUI(links, counter) {
    this.lastLink = this.getLastAvailableLink();
    this.currentLink = this.getCurrentLink();
    let dsURL = this.dissectedURL;
    try {
      if (this.testLinkAgainstFilters(this.currentLink) === true) {
        let updatedSlideUI = new SlideShowUI(links, counter, dsURL);
        if (document.getElementById('sLoadingBackground')) {
          updatedSlideUI.removeLoadNotice(document.body,'sLoadingBackground');
        }
        updatedSlideUI.generateUI();
        this.createNavigationListeners();
      }
      else {
        this.nextLink();
      }
    }
    catch (err) {
      console.log('There was an error updating the app with your current settings. Please adjust settings and try again');
      throw err;
    }
  }

  exitSlideShow() {
    let previousLinkName;
    let url;
    if (this.counter > 0 && this.links[0] != undefined) {
      previousLinkName = this.links[this.counter-1].data.name
      url = `./?limit=100&after=${previousLinkName}&count=${this.counter+1}`;
      window.location = url;
      return url;
    }
    url = `./?limit=100`;
    window.location = url;
    return url;
  }
}

//////////////////////
//////////////////
/////////////
//////////
/////
//  UI //
//////////////
////////////////
///////////
/////

class SlideShowUI {
  constructor(links, counter, dissectedURL) {
    this.links = links;
    this.counter = counter;
    this.dsURL = dissectedURL;
    this.protocol = dissectedURL.urlProtocol;
    this.domain = dissectedURL.urlDomain;
    this.path = dissectedURL.urlPath;
    this.url = `${this.protocol}${this.domain}/${this.path}`;
    this.mainLink = this.links[this.counter];
    this.lastLink = this.links[this.links.length-1];
    this.firstLink = this.links[0];
  }

  createBackground() {
    document.body.style.lineHeight = '1rem';
    let fullScreenBackground = document.createElement('div');
    fullScreenBackground.id = 'slideShowBG';
    const styleFSBackground = (content) => {
      content.style.position = 'absolute';
      content.style.left = '0';
      content.style.top = '0';
      content.style.boxSizing = 'border-box';
      content.style.zIndex = '99';
      content.style.background = '#111';
      content.style.width = '100vw';
      content.style.height = '100vh';
      content.style.overflow = 'hidden';
      content.style.padding = '1rem';
      content.style.display = 'flex';
      content.style.justifyContent = 'center';
      content.style.alignContent = 'center';
      content.style.alignItems = 'center';
      return content;
    };
    styleFSBackground(fullScreenBackground);
    return document.body.appendChild(fullScreenBackground);
  }

  createButtonByType(xPos=null,yPos=null,buttonType,parent) {
    let id, buttonText;
    switch(buttonType) {
      case "up" :
        id = 'ssUpVoteButton';
        buttonText = '▲';
        break;
      case "down":
        id = 'ssDownVoteButton';
        buttonText = '▼';
        break;
      case "save":
        id = 'ssSaveButton';
        buttonText = '♥';
        break;
      case "anchor":
        id = 'ssAnchorButton';
        buttonText = '⚓';
        break;
      case "wheel":
        id = "ssSettingsWheel";
        buttonText = '☼';
        break;
      case "exit":
        id = "ssExitButton";
        buttonText = 'X';
        break;
    }
    if (document.getElementById(id) !== null){
      document.getElementById(id).parentElement.removeChild(document.getElementById(id));
    }
    let button = document.createElement('div');
    button.id = id;
    button.innerText = buttonText;
    let stylebutton = (content) => {
      let style = content.style;
      if (xPos !== null && yPos !== null) {
        style.position = 'absolute';
        if (xPos >= 0) {
          style.left = `${xPos}px`;
        }
        if (xPos < 0) {
          xPos = xPos*-1;
          style.right = `${xPos}px`;
        }
        if (yPos >= 0) {
          style.top = `${yPos}px`;
        }
        if (yPos < 0) {
          yPos = yPos * -1;
          style.bottom = `${yPos}px`;
        }
      }
      if (content.id === "ssUpVoteButton" || content.id === "ssDownVoteButton" || content.id === "ssSaveButton" ) {
        switch (content.id) {
          case "ssUpVoteButton":
            if (this.mainLink.data.likes === true) {
              content.style.color = '#FF8b60';
            }
            break;
          case "ssDownVoteButton":
            if (this.mainLink.data.likes === false) {
              content.style.color = '#9494FF';
            }
            break;
          case "ssSaveButton":
            if (this.mainLink.data.saved === true) {
              content.style.color = '#FF63AC';
            }
            break;
          default:
            style.color = '#eee';
            break;
        }
      }
      style.fontSize = '15pt';
      style.border = '1px solid rgba(240,240,240,0.25)';
      style.padding = '3px';
      style.paddingTop = '0';
      style.margin = '2px 3px';
      style.display = 'flex';
      style.justifyContent = 'center';
      style.alignItems = 'center';
      style.borderRadius = '15px';
      style.height = '20px';
      style.width = '20px';
      style.zIndex = '255';
    }
    stylebutton(button);
    let addListeners = (content) => {
      content.onmouseover = () => {
          content.style.cursor = 'pointer';
          content.style.background = 'rgba(240,240,240,0.1)';
      }
      content.onmouseout = () => {
          content.style.background = 'rgba(240,240,240,0)';
      }
    }
    addListeners(button);
    parent.appendChild(button);
  }

  createOptionFlex(xPos=null,yPos=null,fHeight='auto',fWidth='auto',parent) {
    let id = 'ssOptionFlex';
    if (document.getElementById(id) !== null){
      document.getElementById(id).parentElement.removeChild(document.getElementById(id));
    }
    let optionFlex = document.createElement('div');
    optionFlex.id = id;
    let styleFlex = (content) => {
      let style = content.style;
      if (xPos !== null && yPos !== null) {
        style.position = 'absolute';
        style.left = `${xPos}px`;
        style.top = `${yPos}px`;
      }
      style.display = 'flex';
      style.justifyContent = 'space-evenly';
      style.alignContent = 'center';
      style.alignItems = 'center';
      style.height = `${fHeight}`;
      style.width = `${fWidth}`;
    }
    styleFlex(optionFlex);
    this.createButtonByType(null,null,'wheel',optionFlex);
    // this.createButtonByType(null,null,'anchor',optionFlex);
    this.createButtonByType(null,null,'up',optionFlex);
    this.createButtonByType(null,null,'down',optionFlex);
    this.createButtonByType(null,null,'save',optionFlex);
    parent.appendChild(optionFlex);
  }

  createContentContainer() {
    let linkMainDiv = document.createElement('div');
    linkMainDiv.id = "linkMainDiv";
    let slideBG = document.querySelector('#slideShowBG');
    const styleContainer = (content) => {
      content.style.background = 'rgba(225,225,255,0.05)';
      content.style.minHeight = '100px';
      content.style.maxHeight = '95vh';
      content.style.width = '100vw';
      content.style.zIndex = '100';
      content.style.boxSizing = 'border-box';
      content.style.textAlign = 'center';
      content.style.border = '1px dotted black';
      content.style.boxShadow = '2px 2px 6px 4px rgba(255,255,255,0.12), -2px -2px 6px 4px rgba(255,255,255,0.12)';
      content.style.borderRadius = '5px';
      content.style.overflow = 'hidden';
      content.style.display = 'grid';
      content.style.gridTemplateRows = '3rem minmax(50px,75vh) 1.5rem';
      content.style.gridTemplateRows = '3rem auto 1.5rem';
      content.style.gridTemplateColumns = '2rem minmax(auto,100%) 2rem';
      content.style.gridGap = '0.5rem';
      content.style.padding = '0.5rem 0';
      return content;
    }
    styleContainer(linkMainDiv);
    return slideBG.appendChild(linkMainDiv);
  }

  createHead(links, counter) {
    let link = links[counter];
    let linkMainDiv = document.querySelector('#linkMainDiv');
    let generateLinkHead = function(link) {
      let linkHead = document.createElement('h3');
      linkHead.innerText = link.data.title;
      linkHead.id = 'linkHead';
      const styleLinkHead = (content) => {
        content.style.width = '90%';
        content.style.fontSize = '0.9rem';
        content.style.lineHeight = '1rem';
        content.style.textAlign = 'center';
        content.style.color = '#CCF';
        content.style.overflow = 'hidden';
        return content;
      }
      styleLinkHead(linkHead);
      const addListeners = (content) => {
        content.onclick = function() {
          window.open(link.data.permalink);
        }
        content.onmouseover = function() {
          content.style.cursor = 'pointer';
        }
        return content;
      }
      addListeners(linkHead);
      return linkHead;
    }

    let generatePostedIn = () => {
      let postedInSubRedditP = document.createElement('p');
      postedInSubRedditP.id = 'ssPostedIn';
      postedInSubRedditP.innerText = `${link.data.subreddit_name_prefixed}`;
      postedInSubRedditP.style.textAlign = 'left';
      postedInSubRedditP.style.paddingLeft = '1rem';

      const addListeners = (content) => {

        content.onclick = () => {
          let url = `${this.protocol}${this.domain}/${link.data.subreddit_name_prefixed}`;
          new SlideShow([],0,url); 
        }
        content.onmouseover = () => {
          content.style.cursor = 'pointer';
          content.style.color = 'white';
        }
        content.onmouseout = () => {
          content.style.color = 'rgb(204,204,204)';
        }
        return content;
      }
      addListeners(postedInSubRedditP);
      return postedInSubRedditP;
    }

    let generateDomainOrigin = () => {
      let linkDomainP = document.createElement('p');
      linkDomainP.innerText = `${link.data.domain}`;
      linkDomainP.style.textAlign = 'right';
      linkDomainP.style.paddingRight = '1rem';
      const addListeners = (content) => {
        content.onclick = () => {
          window.open(`${link.data.url}`);
        }
        content.onmouseover = () => {
          content.style.cursor = 'pointer';
          content.style.color = 'white';
        }
        content.onmouseout = () => {
          content.style.color = 'rgb(204,204,204)';
        }
        return content;
      }
      addListeners(linkDomainP);
      return linkDomainP;
    }

    let generateLeftNav = function(counter) {
      let leftNav = document.createElement('div');
      leftNav.innerText = '<';
      leftNav.id = 'ssPreviousButton'
      const styleNav = (content) => {
        content.style.height = '100%';
        content.style.width = '100%';
        content.style.borderRight = '1px solid rgba(225,225,255, 0.3)';
        content.style.borderRadius = '5px';
        content.style.color = 'rgba(225,225,255, 0.8)';
        content.style.gridRow = '1 / 4';
        content.style.gridColumn = '1';
        content.style.display = 'flex';
        content.style.alignContent = 'center';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'center';
        return content;
      }
      styleNav(leftNav);
      const addListeners = (content) => {
        if (counter != 0) {
          leftNav.onmouseover = function() {
            leftNav.style.cursor = 'pointer';
            leftNav.style.background = 'rgba(200,200,255,0.3)';
          }
          leftNav.onmouseout = function() {
            leftNav.style.background = 'none';
          }
        }
      }
      addListeners(leftNav);
      return leftNav;
    }

    let generateRightNav = function() {
      let rightNav = document.createElement('div');
      rightNav.innerText = '>';
      rightNav.id = 'ssNextButton';
      const styleNav = (content) => {
        content.style.height = '100%';
        content.style.width = '100%';
        content.style.borderLeft = '1px solid rgba(225,225,255, 0.3)';
        content.style.borderRadius = '5px';
        content.style.color = 'rgba(225,225,255, 0.8)';
        content.style.gridRow = '1 / 4';
        content.style.gridColumn = '3';
        content.style.display = 'flex';
        content.style.alignContent = 'center';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'center';
        return content;
      }
      styleNav(rightNav);
      const setListeners = (content) => {
        content.onmouseover = function() {
          content.style.cursor = 'pointer';
          content.style.background = 'rgba(200,200,255,0.3)';
        }
        content.onmouseout = function() {
          content.style.background = 'none';
        }
        return content;
      }
      setListeners(rightNav);
      return rightNav;
    }

    let generateAlerts = function(link) {
      let nsfwStatus = link.data.over_18;
      let quarantineStatus = link.data.quarantine;
      let alertDisplayFlex = document.createElement('div');
      const styleAlertDisplay = (content) => {
        content.style.display = 'flex';
        content.style.justifyContent = 'center';
        content.style.alignItems = 'center';
        content.style.width = '30%';
        content.style.textAlign = 'center';
      }
      styleAlertDisplay(alertDisplayFlex);

      let alertNSFW = document.createElement('p');
      const styleAlertNSFW = (content) => {
        content.style.display = 'inline';
        content.innerText = 'NSFW';
        content.style.color = 'darkred';
        content.style.border = '1px solid darkred';
        content.style.borderRadius = '5px';
        content.style.padding = '0 .5rem 0 .5rem';
        return content;
      }
      styleAlertNSFW(alertNSFW);

      let alertQuarantine = document.createElement('p');
      const styleAlertQuarantine = (content) => {
        content.style.display = 'inline';
        content.innerText = 'Quarantine';
        content.style.color = 'black';
        content.style.border = '1px solid yellow';
        content.style.background = 'yellow';
        content.style.borderRadius = '5px';
        content.style.padding = '0 .5rem 0 .5rem';
        return content;
      }
      styleAlertQuarantine(alertQuarantine);

      if (nsfwStatus == true) {
        alertDisplayFlex.appendChild(alertNSFW);
      }
      if (quarantineStatus == true) {
        alertDisplayFlex.appendChild(alertQuarantine);
      }
      return alertDisplayFlex;
    }

    let generateHeaderSecondRow = function(links, counter) {
      let secondRow = document.createElement('div');
      secondRow.id = 'secondHeadRow';
      const styleSecondRow = (content) => {
        secondRow.style.width = '100%';
        secondRow.style.display = 'flex';
        secondRow.style.justifyContent = 'space-between';
        secondRow.style.alignItems = 'center';
        secondRow.style.textAlign = 'center';
        secondRow.style.marginTop = '0.5rem';
      }
      styleSecondRow(secondRow);
      secondRow.appendChild(generatePostedIn());
      secondRow.appendChild(generateAlerts(link));
      secondRow.appendChild(generateDomainOrigin());
      linkMainDiv.appendChild(generateLeftNav(counter));
      linkMainDiv.appendChild(generateRightNav());
      return secondRow;
    }

    let generateHeadContainer = function(link) {
      let headContainer = document.createElement('div');
      headContainer.id = 'headContainer';
      const styleHeadContainer = (content) => {
        content.style.display = 'flex';
        content.flexFlow = 'column';
        content.style.width = '100%';
        content.style.flexWrap = 'wrap';
        content.style.textAlign = 'center';
        content.style.justifyContent = 'center';
        content.style.flex = '0 1 auto';
        content.style.gridRow = '1';
        content.style.gridColumn = '2';
        return content;
      }
      styleHeadContainer(headContainer);
      headContainer.appendChild(generateLinkHead(link));
      headContainer.appendChild(generateHeaderSecondRow(links, counter))
      return headContainer;
    }
    linkMainDiv.appendChild(generateHeadContainer(link));
  }

  createContent(link) {
    let linkMainDiv = document.querySelector('#linkMainDiv');

    let generateContentContainer = () => {
      let contentContainer = document.createElement('div');
      contentContainer.id = 'contentContainer';
      const styleContentContainer = (content) => {
        content.style.gridRow = '2';
        content.style.gridColumn = '2';
        content.style.maxHeight = '80vh';
        content.style.height = 'auto';
        content.style.maxWidth = '100%';
        content.style.width = 'auto';
        content.style.textAlign = 'center';
        content.style.margin = '0 auto';
        content.style.display = 'flex';
        content.style.flexFlow = 'column';
        content.style.alignContent = 'center';
        content.style.alignItems = 'center';
        content.style.justifyContent = 'center';
        return content;
      }
      styleContentContainer(contentContainer);
      return contentContainer;
    }
    
    let styleImgContent = (content) => {
      content.style.maxHeight = '100%';
      content.style.maxWidth = '100%';
      content.style.border = '1px solid black';
      content.style.gridRow = '2';
      content.style.gridColumn = '2';
      return content;
    }

    let styleVideoContent = (content) => {
      content.style.maxHeight = '75vh';
      content.style.maxWidth = '100%';
      content.autoplay = true;
      content.controls = true;
      content.loop = true;
      content.muted = false;
      content.style.gridRow = '2';
      content.style.gridColumn = '2';
      return content;
    }

    let styleTextContent = (content) => {
      content.style.textAlign = 'left';
      content.style.fontSize = '0.85rem';
      content.style.maxWidth = '1200px';
      content.style.width = '80%';
      content.style.maxHeight = '90%';
      content.style.overflowY = 'auto';
      content.style.border = '1px solid rgba(200,200,200,0.3)';
      content.style.borderRadius = '5px';
      content.style.padding = '1rem';
      content.style.paddingLeft = '1rem';
      content.style.paddingTop = '1rem';
      content.style.color = 'rgb(204,204,204)';
      content.style.lineHeight = '1rem';
      content.style.gridRow = '2';
      content.style.gridColumn = '2';

      return content;
    }

    let generateContentFromGenericImageURL = () => {
      let extensions = [/\.jpg$/, /\.jpeg$/, /\.png$/, /\.bmp$/, /\.tiff$/, /\.gif$/];
      for (let i = 0; i < extensions.length; i++) {
        if (extensions[i].test(link.data.url)){
          let linkImgContainer = document.createElement('div');
          linkImgContainer.style.flex = '0 1 auto';
          linkImgContainer.id = 'ssImgDivWrapper';
          let linkImg = document.createElement('IMG');
          linkImg.src = link.data.url;
          linkImg.id = 'ssImg';
          styleImgContent(linkImg);

          linkImg.onclick = function() {
            window.open(linkImg.src);
          }
          linkImg.onmouseover = function() {
            linkImg.style.cursor = 'pointer';
          }
          let container = generateContentContainer();
          container.appendChild(linkImg);
          return container;
        }
      }
      return null;
    };

    let generateContentFromGenericVideoURL = () => {
      let extensions = [/\.webm$/, /\.gifv$/, /\.mp4$/, /\.flv$/, /\.mkv$/, /\.avi$/, /\.mpeg$/, /\.mov$/];
      for (let i = 0; i < extensions.length; i++) {
        if (extensions[i].test(link.data.url)){
          let linkVid = document.createElement('video');
          linkVid.id = 'ssVid';
          styleVideoContent(linkVid);
          let linkSource = link.data.url.replace('.gifv','.mp4');

          let vidSourceWebm = document.createElement('source');
          vidSourceWebm.src = linkSource;
          vidSourceWebm.type = 'video/webm';
          let vidSourceMp4 = document.createElement('source');
          vidSourceMp4.src = linkSource;
          vidSourceMp4.type = 'video/mp4';

          linkVid.appendChild(vidSourceMp4);
          linkVid.appendChild(vidSourceWebm);

          let container = generateContentContainer();
          container.appendChild(linkVid);
          return container;

        }
      }
      return null;
    }

    let generateContentFromImgurDomain = () => {
      if (link.data.domain == "imgur.com") {
        if (/\/a\//.test(link.data.url)) {
          let albumNotification = document.createElement('p');
          styleTextContent(albumNotification);
          albumNotification.style.width = 'auto';
          albumNotification.style.border = 'none';
          albumNotification.style.textAlign = 'center';
          albumNotification.style.marginTop = '0';
          this.createThumbNailImg(link);
          albumNotification.innerText = 'This is an album. Click the thumbnail above to view';


          let container = generateContentContainer();
          container.appendChild(albumNotification);
          return container;

        }
        else {
          let linkImg = document.createElement('IMG');
          linkImg.src = link.data.url + '.jpg';
          linkImg.id = 'ssImg';
          styleImgContent(linkImg);
          linkImg.onclick = function() {
            window.open(linkImg.src);
          }
          linkImg.onmouseover = function() {
            linkImg.style.cursor = 'pointer';
          }

          let container = generateContentContainer();
          container.appendChild(linkImg);
          return container;

        }
      }
      return null;
    }

    let generateContentFromGfycatDomain = () => {
      if (link.data.domain == "gfycat.com") {
        let linkVid = document.createElement('video');
        linkVid.id = 'ssVid';
        styleVideoContent(linkVid);

        let gfyGiantBase = 'https://giant.gfycat.com';
        let gfyThumbBase = 'https://thumbs.gfycat.com';
        let linkSource;

        if (!link.data.secure_media && !link.data.crosspost_parent_list) {
          return null;
        }
        if (link.data.secure_media != null && /\/\w+(?:-)/.test(link.data.secure_media.oembed.thumbnail_url) == true) {
          linkSource = link.data.secure_media.oembed.thumbnail_url.match(/\/\w+(?:-)/).join().replace('-','');
        } else if (link.data.secure_media == null && /\/\w+(?:-)/.test(link.data.crosspost_parent_list[0].secure_media.oembed.thumbnail_url) == true){
          linkSource = link.data.crosspost_parent_list[0].secure_media.oembed.thumbnail_url.match(/\/\w+(?:-)/).join().replace('-',''); 
        } else {
          linkSource = link.data.url;
        }

        let vidSourceMobile = document.createElement('source');
        vidSourceMobile.src = gfyThumbBase + linkSource + '-mobile.mp4';
        vidSourceMobile.type = 'video/mp4';
        let vidSourceWebm = document.createElement('source');
        vidSourceWebm.src = gfyGiantBase + linkSource + '.webm';
        vidSourceWebm.type = 'video/webm';
        let vidSourceMP4 = document.createElement('source');
        vidSourceMP4.src = gfyGiantBase + linkSource + '.mp4';
        vidSourceMP4.type = 'video/mp4';
        let vidSourceMP4Mobile = document.createElement('source');
        vidSourceMP4Mobile.src = gfyGiantBase + linkSource + '-mobile.mp4';
        vidSourceMP4Mobile.type = 'video/mp4';

        linkVid.appendChild(vidSourceMobile);
        linkVid.appendChild(vidSourceWebm);
        linkVid.appendChild(vidSourceMP4);
        linkVid.appendChild(vidSourceMP4Mobile);

        let container = generateContentContainer();
        container.appendChild(linkVid);
        return container;

      }
      return null;
    }

    let generateContentFromCommonVideoDomain = () => {
      let linkVid = document.createElement('iframe');
      let stylelinkVid = (content, parent) => {
        let linkVidWidth = parent.scrollWidth * 0.618033;
        let linkVidHeight = linkVidWidth * 0.618033;
        content.height = `${linkVidHeight}`;
        content.width = `${linkVidWidth}`;
        content.allowFullscreen = true;
        content.style.border = 'none';
        content.style.marginTop = '1.5rem';
        content.style.marginBottom = '1rem';
        content.setAttribute('loop', '');
        content.align = 'middle';
        return content;
      }
      stylelinkVid(linkVid, linkMainDiv);
      linkVid.id = 'ssVidIframe';

      let keyReg = /(?:viewkey=)\w+(?:&)/;
      if (keyReg.test(link.data.url)) {
        let embedKey = link.data.url.match(/(?:viewkey=)\w+(?:&)/).join().replace('viewkey=','').replace('&','');
        let vidSource = `https://${link.data.domain}/embed/${embedKey}`;
        linkVid.src = vidSource;

        let container = generateContentContainer();
        container.appendChild(linkVid);
        return container;

      }
      let youTubeWatchCodeReg = /(?:v=)\w+/;
      if (youTubeWatchCodeReg.test(link.data.url)) {
        let embedKey =  link.data.url.match(/(?:v=)\w+-{0,1}\w+/).join().replace('v=','');
        let vidSource = `https://${link.data.domain}/embed/${embedKey}`;
        linkVid.src = vidSource;

        let container = generateContentContainer();
        container.appendChild(linkVid);
        return container;

      }
      if (link.data.domain == 'v.redd.it') {
        if (link.data.secure_media != null) {
          let vidSource = link.data.secure_media.reddit_video.fallback_url;
          linkVid.src = vidSource;
        } else {
          let vidKey = link.data.url.match(/(?:\w\/)\w+/).join().replace(/\w\//, '');
          let vidSource = `https://${link.data.domain}/${vidKey}/DASH_720?source=fallback`;
          linkVid.src = vidSource;
        }
        let container = generateContentContainer();
        container.appendChild(linkVid);
        return container;

      }
      if (link.data.domain == 'youtu.be') {
        let embedKey = link.data.url.match(/(?:\w\/)\w+-{0,1}\w+/).join().replace(/(?:\w\/)/,'');
        let vidSource = `https://www.youtube.com/embed/${embedKey}`;
        linkVid.src = vidSource;

        let container = generateContentContainer();
        container.appendChild(linkVid);
        return container;

      }

      return null;
    }

    let generateContentFromSelfPost = () => {
      if (/^self\./.test(link.data.domain) && link.data.selftext.length > 0) {
        let selfPostParagraph = document.createElement('p');
        selfPostParagraph.innerText = link.data.selftext;
        styleTextContent(selfPostParagraph);

        let container = generateContentContainer();
        container.appendChild(selfPostParagraph);
        return container;
      } 
      else if (/^self\./.test(link.data.domain)) {
        let selfPostParagraph = document.createElement('p');
        let container = generateContentContainer();
        container.appendChild(selfPostParagraph);
        return container;
      }
      return null;
    }

    let generateThumbNailImg = (link) => {
      let thumbnailOfLink = document.createElement('IMG');
      thumbnailOfLink.src = link.data.thumbnail;
      thumbnailOfLink.id = 'ssThumbnail';
      thumbnailOfLink.style.height = `${link.data.thumbnail_height}px`;
      thumbnailOfLink.style.width = `${link.data.thumbnail_width}px`;
      thumbnailOfLink.style.maxWidth = '100%';
      thumbnailOfLink.style.margin = 'auto';
      thumbnailOfLink.style.border = '1px solid black';
      thumbnailOfLink.style.marginBottom = '0.5rem';
      thumbnailOfLink.style.borderRadius = '3px';

      thumbnailOfLink.style.gridRow = '2';
      thumbnailOfLink.style.gridColumn = '2';

      thumbnailOfLink.onclick = function() {
        window.open(link.data.url);
      }
      thumbnailOfLink.onmouseover = function() {
        thumbnailOfLink.style.cursor = 'pointer';
      }

      return thumbnailOfLink;
    }

    let contentLoadErrorParagraph = (link) => {
      let textLink = document.createElement('span');
      textLink.style.color = '#AAF';
      textLink.innerText = ` Click here to view`;
      let sorryParagraph = document.createElement('p');
      let sorryText = `Unable to load content.`;
      sorryParagraph.innerText = sorryText;
      sorryParagraph.style.padding = '2px';
      sorryParagraph.style.color = 'rgb(204,204,204)';

      textLink.onclick = function() {
        window.open('.'+link.data.permalink);
      }
      textLink.onmouseover = function() {
        textLink.style.cursor = 'pointer';
        textLink.style.color = '#EFF';
      }
      textLink.onmouseout = function() {
        textLink.style.color = '#AAF';
      }

      let container = generateContentContainer();
      try {
        let thumbnail = generateThumbNailImg(link);
        container.appendChild(thumbnail);
      } catch(error) {
        throw error;
      }

      container.appendChild(sorryParagraph);
      container.appendChild(textLink);
      console.log(`Unable to load content for: \n`, this.mainLink.data,  `\nCounter: ${this.counter} of ${this.links.length} available links`);
      return container;
      
    }
    
    let attemptCreation = () => {
      let possibleContent = [generateContentFromGenericImageURL(), generateContentFromGenericVideoURL(), generateContentFromImgurDomain(), generateContentFromGfycatDomain(), generateContentFromSelfPost(), generateContentFromCommonVideoDomain()];
      possibleContent.forEach((item)=> {
        if (item !== null) {
          linkMainDiv.appendChild(item);
          return item;
        }
      });
      if (possibleContent.filter(v=> v !== null).length === 0){
        let contentLoadError = contentLoadErrorParagraph(link);
        linkMainDiv.appendChild(contentLoadError);
      };
    }
    attemptCreation();
  }

  createFooter(links, counter) {
    let linkMainDiv = document.querySelector('#linkMainDiv');
    let currentLink = links[counter];
    let generateFooterDiv = function() {
      let footerDiv = document.createElement('div');
      footerDiv.style.width = '100%';
      footerDiv.style.height = '100%';
      footerDiv.style.display = 'flex';
      footerDiv.style.justifyContent = 'center';
      footerDiv.style.alignItems = 'center';
      footerDiv.style.color = 'rgb(204,204,204)';
      footerDiv.id = 'ssFooterDiv';

      footerDiv.style.gridRow = '3';
      footerDiv.style.gridColumn = '1/4';
      
      return footerDiv;
    }
    let generateCenterInfo = (link) => {
      let postedBy = link.data.author;
      let commentCount = link.data.num_comments;
      let karmaCount = link.data.ups;
      let centerInfoBox = document.createElement('div');
      centerInfoBox.style.width = '50%';
      centerInfoBox.style.maxWidth = '600px';
      centerInfoBox.style.paddingTop = '0.5rem';
      centerInfoBox.style.display = 'flex';
      centerInfoBox.style.justifyContent = 'space-around';
      centerInfoBox.style.alignItems = 'center';
      centerInfoBox.style.textAlign = 'center';
      centerInfoBox.style.borderTop = '1px solid rgba(150,150,250,0.2)';
      let generateKarmaCountP = function(karmaCount) {
        let karmaCountP = document.createElement('p');
        karmaCountP.innerText = `${karmaCount} Karma`;
        return karmaCountP;
      }
      let generatePostedByP = (postedBy) => {
        let postedByInfoP = document.createElement('p');
        postedByInfoP.id = 'ssPostedBy';
        postedByInfoP.innerText = `Posted by ${postedBy}`;

        postedByInfoP.onclick = () => {
          let url = `${this.protocol}${this.domain}/u/${postedBy}`;
          new SlideShow([],0,url);
        }
        postedByInfoP.onmouseover = () => {
          postedByInfoP.style.cursor = 'pointer';
          postedByInfoP.style.color = 'white';
        }
        postedByInfoP.onmouseout = () => {
          postedByInfoP.style.color = 'rgb(204,204,204)';
        }
        return postedByInfoP;
      }
      let generateCommentCountP = function(commentCount) {
        let commentInfoP = document.createElement('p');
        commentInfoP.innerText = `${commentCount} Comments`;
        commentInfoP.onclick = () => {
          window.open('.'+link.data.permalink);
        }
        commentInfoP.onmouseover = () => {
          commentInfoP.style.cursor = 'pointer';
          commentInfoP.style.color = 'white';
        }
        commentInfoP.onmouseout = () => {
          commentInfoP.style.color = 'rgb(204,204,204)';
        }
        return commentInfoP;
      }
      centerInfoBox.appendChild(generateKarmaCountP(karmaCount));
      centerInfoBox.appendChild(generatePostedByP(postedBy));
      centerInfoBox.appendChild(generateCommentCountP(commentCount));
      return centerInfoBox;
    }
    let footerDiv = generateFooterDiv();
    footerDiv.appendChild(generateCenterInfo(currentLink));
    linkMainDiv.appendChild(footerDiv);
  }

  hideAllBodyNodes() {
    for (let node of document.body.childNodes) {
      try {
        node.style.display = 'none';
      } catch(error) {
        continue;
      }
    }
  }

  showAllBodyNodes() {
    for (let node of document.body.childNodes) {
      try {
        node.style.display = 'initial';
      } catch(error) {
        continue;
      }
    }
  }

  deconstructSlideShowUi() {
    let ssBG = document.querySelector('#slideShowBG');
    ssBG.parentElement.removeChild(ssBG);
  }

  destroyContainerContents() {
    let linkMain = document.querySelector('#linkMainDiv');
    while (linkMain.hasChildNodes()) {
      linkMain.removeChild(linkMain.lastChild);
    }
  }

  generateUI() {
    if (!document.querySelector('#slideShowBG')) {
      this.hideAllBodyNodes();
      this.createBackground();
    }
    if (!document.querySelector('#linkMainDiv')) {
      this.createContentContainer();
    }
    
    this.destroyContainerContents();
    this.createHead(this.links, this.counter); 
    this.createContent(this.mainLink);
    this.createFooter(this.links, this.counter);
    this.createOptionFlex(0,0,'auto','auto',document.querySelector('#slideShowBG'));
    this.createButtonByType(-1,0,'exit',document.querySelector('#slideShowBG'));
  }

  generateLoadNotice(parent) {
    let loadBackground = document.createElement('div');
    loadBackground.id = 'sLoadingBackground';
    let styleLoadNotice = (content) => {
      content.style.position = 'absolute';
      content.style.top = '0';
      content.style.left = '0';
      content.style.background = 'rgba(0,0,0,0.65)';
      content.style.width = '100vw';
      content.style.height = '100vh';
      content.style.zIndex = '240';
      content.style.display = 'flex';
      content.style.flexDirection = 'column';
      content.style.alignContent = 'center';
      content.style.justifyContent = 'center';
      content.style.alignItems = 'center';
    }
    styleLoadNotice(loadBackground);
    let loadText = document.createElement('h1');
    loadText.innerText = 'Loading...';
    loadText.style.textAlign = 'center';
    loadText.style.color = '#f4f4f4';
    loadBackground.appendChild(loadText);
    parent.appendChild(loadBackground);
    window.setTimeout(()=> {
      if (document.getElementById(loadBackground.id)) {
        parent.removeChild(loadBackground);
      }
    }, 6000);
  }

  removeLoadNotice(parent, loadID) {
    let loadBackground = document.getElementById(loadID);
    return parent.removeChild(loadBackground);
  }
}


//////////////////
/////////////
//////////
/////
//  SETTINGS //
//////////////

class SlideShowSettings {
  constructor(dissectedURL) {
      this.savedSettings = this.generateStartupSettings();
      this.dsURL = dissectedURL;
      this.protocol = this.dsURL.urlProtocol;
      this.domain = this.dsURL.urlDomain;
      this.path = this.dsURL.urlPath;
      this.url = `${this.protocol}${this.domain}/${this.path}`;
  }
  
  createSettingsPanel() {
      const generateSettings = () => {
          let settingsBG = document.createElement('div');
          settingsBG.id = 'sliddit-settings-bg';
          const styleSettingsBG = (content) => {
              content.style.width = '100vw';
              content.style.height = '100vh';
              content.style.background = 'rgba(0,0,0,0.5)';
              content.style.position = 'absolute';
              content.style.top = '0';
              content.style.left = '0';
              content.style.display = 'flex';
              content.style.justifyContent = 'center';
              content.style.alignContent = 'center';
              content.style.alignItems = 'center';
              content.style.zIndex = '199';
              return content;
          }
          styleSettingsBG(settingsBG);
          let generateSettingsForm = () => {
              let settingsFormContainer = document.createElement('div');
              settingsFormContainer.id = 'settingsFormContainer';
              settingsFormContainer.style.maxWidth = '600px';
              settingsFormContainer.style.padding = '1rem';
              settingsFormContainer.innerHTML = `
              <form id='filter-form-main' style="padding:1rem;background:rgba(55,60,60,0.89);border:1px solid white;border-radius:10px;">
                  <div id="type-filter-container" style="padding:10px; margin:1rem; border:1px solid #aaa; background:rgba(255,255,255,0.1); text-align:center; display:flex; flex-flow:column; justify-content:center; align-items:center;>
                      <h4 id="filter-type-head">Select Links to Show: </h4>
                      <div class="filter-options" style="display:grid; grid-template-columns:repeat(4,1fr);">
                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="checkbox" id="image-filter-box">
                              <label for="image-filter-box">Images</label>
                          </div>
                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="checkbox" id="video-filter-box">
                              <label for="video-filter-box">Video</label>
                          </div>
                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="checkbox" id="self-post-filter-box">
                              <label for="self-post-filter-box">Self & Text</label>
                          </div>
                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="checkbox" id="other-filter-box">
                              <label for="other-filter-box">Other</label>
                          </div>
                      </div>
                  </div>

                  <div id="nsfw-filter-container" style="padding:10px; margin:1rem; border:1px solid #aaa; background:rgba(255,255,255,0.1); text-align:center; display:flex; flex-flow:column; justify-content:center; align-items:center;>
                      <h4 id="filter-nsfw-head">NSFW Filter Type: </h4>
                      <div class="filter-options" style="display:grid; grid-template-columns:repeat(3,1fr);">

                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="radio" name="nsfw-filter-option" id="nsfw-filter-hide">
                              <label for="nsfw-filter-hide" style="margin-top:5px">Hide NSFW</label>
                          </div>

                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="radio" name="nsfw-filter-option" id="nsfw-filter-show">
                              <label for="nsfw-filter-show" style="margin-top:5px">Show <span style="color:darkred">NSFW</span></label>
                          </div>

                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="radio" name="nsfw-filter-option" id="nsfw-filter-show-only">
                              <label for="nsfw-filter-show-only" style="margin-top:5px"><span style="color:darkred">Only NSFW</span></label>
                          </div>


                      </div>
                  </div>

                  <div id="quarantine-filter-container" style="padding:10px; margin:1rem; border:1px solid #aaa; background:rgba(255,255,255,0.1); text-align:center; display:flex; flex-flow:column; justify-content:center; align-items:center;>
                      <h4 id="filter-quarantine-head">Quarantine Filter: </h4>
                      <div class="filter-options" style="display:grid; grid-template-columns:repeat(2,1fr);">

                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="radio" name="quarantine-filter-option" id="quarantine-filter-show">
                              <label for="quarantine-filter-show" style="margin-top:5px">Show</label>
                          </div>

                          <div class="filter-option-container" style="display:flex;flex-flow:column;align-items:center; justify-content:center;padding:1rem;">
                              <input type="radio" name="quarantine-filter-option" id="quarantine-filter-hide">
                              <label for="quarantine-filter-hide" style="margin-top:5px">Hide</label>
                          </div>
                      </div>
                  </div>


                  <div id="filter-form-ok-container" style="display:flex;width:100%;justify-content:center;align-items:center;">
                      <button id="filter-form-ok-button" style="padding:0.25rem 1.5rem; border-radius:5px; background:rgba(230,230,230,0.75); color:black;border:1px solid rgba(0,0,0,0.8);" onmouseover="this.style.background='rgba(0,0,0,0.15)'; this.style.color='#ddd';" onmouseout="this.style.background='rgba(230,230,230,0.75)'; this.style.color='#111';">OK</button>
                  </div>
              </form>
              `;          
              return settingsFormContainer;
          }
          settingsBG.appendChild(generateSettingsForm());
          return settingsBG;
      }
      document.body.appendChild(generateSettings());
      
      const addListeners = () => {
          let okBtn = document.getElementById('filter-form-ok-button');
          let settingsContainer = document.getElementById('sliddit-settings-bg');
          let filterMain = document.getElementById('filter-form-main');
          let closeSettingsPanel = (event) => {
            document.body.removeChild(settingsContainer);
          }

          let storeSettingsValuesInLocalStorage = () => {
              let filterForm = document.getElementById('filter-form-main');
              let possibleInputs = filterForm.querySelectorAll('input');
              let contentSettings = {};
              for (let i of Array.from(possibleInputs)) {
                  contentSettings[`${i.id}`] = i.checked;
              }

              const contentSettingsJSONToString = (content) => {
                  let contentString = JSON.stringify(content);
                  return contentString;
              }

              let contentSettingsString = contentSettingsJSONToString(contentSettings);
              localStorage.setItem('sliddit-filter-settings', contentSettingsString);
          }

          let settingsOK = (e) => {
            storeSettingsValuesInLocalStorage();
            closeSettingsPanel();
            let url = this.url;
            new SlideShow([],0,url);
          }

          settingsContainer.addEventListener('click',closeSettingsPanel);
          filterMain.addEventListener('click',(event)=>event.stopPropagation());
          okBtn.addEventListener('click',settingsOK);
      }
      addListeners();
  
      const checkTheBoxes = () => {
        let optionDict = this.savedSettings;
        let filterForm = document.getElementById('filter-form-main');
        let possibleBoxes = filterForm.querySelectorAll('input');
        for (let box of possibleBoxes) {
            let checkedValue = this.stringToBool(optionDict[`${box.id}`]);
            box.checked = checkedValue;
        }
      }
      checkTheBoxes();
  }

  getLocalFilterSettings = () => {
      return localStorage.getItem('sliddit-filter-settings');
  }  
  
  generateDefaultJSONSettings = () => {
      let defaultSettings = `{"image-filter-box":"true","video-filter-box":"true",
      "self-post-filter-box":"true","other-filter-box":"false","nsfw-filter-hide":"false",
      "nsfw-filter-show":"true","nsfw-filter-show-only":"false","quarantine-filter-show":"true",
      "quarantine-filter-hide":"false"}`;
      return defaultSettings;
  }
  
  generateStartupSettings = () => {
      if (localStorage.getItem('sliddit-filter-settings') !== null) {
          return JSON.parse(this.getLocalFilterSettings());
      } else {
          return JSON.parse(this.generateDefaultJSONSettings());
      }
  }

  stringToBool = (string) => {
    if (typeof string == 'string'){ 
      if (string.toLowerCase() === "true") {
          return true;
      } else if (string.toLowerCase() === "false") {
          return false;
      }
      console.log(`Unable to Convert "${string}" to boolean value`)
      return null
    }
    return string;
  }      
}

const createLaunch = function() {
  let styleTab = (content) => {
    content.innerHTML = '<p>Sliddit</p>';
    content.style.color = '#8cb3d9';
    content.style.background = '#262626';
    content.style.padding = '2px 6px 0px 6px';
    content.onmouseover = function() {
      content.style.cursor = 'pointer';
    }
    content.onclick = function() {
      if(/count=\d+/.test(document.URL) == true) {
        let countUrlMethod = document.URL.match(/count=\d+/).join();
        let countNumber = countUrlMethod.match(/\d+$/).join();
        let SS_Main = new SlideShow([],parseInt(countNumber-1),document.URL);
        return SS_Main;
      }
      let Slide = new SlideShow([],0,document.URL);
      return Slide;
    }
  }
  if (document.querySelector('ul.tabmenu')) {
    let newTab = document.createElement('li');
    let tabs = document.querySelector('ul.tabmenu');
    newTab.classList = tabs.lastChild.classList;
    styleTab(newTab);
    return tabs.appendChild(newTab);
  }
  else {
    let launchButton = document.createElement('div');
    launchButton.id = 'ssLaunch';
    const styleLaunchButton = (content) => {
      content.style.width = '3rem';
      content.style.height = '1.5rem';
      content.style.position = 'fixed';
      content.style.top = '3rem';
      content.style.right = '10px';
      content.style.zIndex = '99';
      content.style.border = '1px solid rgba(225,225,255,0.2)';
      content.style.borderTop = 'none';
      content.style.borderRadius = '5px';
      return content;
    }
    styleLaunchButton(launchButton);
    styleTab(launchButton);
    return document.body.appendChild(launchButton);
  }
}

window.addEventListener('load', createLaunch());
//let Slide = new SlideShow()
// ==UserScript==
// @name         MoshMages' Cookie Clicker Mods
// @version      1.10.3.2
// @description  Makes it easier.
// @author       moshmage@gmail.com
// @match        *orteil.dashnet.org/cookieclicker/*
// @grant        none
// @namespace https://gist.github.com/moshmage/792ac013a8fb0b23d39f491261ebdb90
// @downloadURL https://update.greasyfork.org/scripts/418421/MoshMages%27%20Cookie%20Clicker%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/418421/MoshMages%27%20Cookie%20Clicker%20Mods.meta.js
// ==/UserScript==
(() => {

  const options = {
    enable: false,
    enableQueue: false,
    pauseQueue: true,
    saveQueue: false,
    autoBuyUpgrades: true,

    autoClickShimmers: true,
    avoidWrathCookie: false,

    disableBuyIfBuffs: true,
    killWrinkles: true,
    killGoldenWrinkles: false,

    preventBuildingDeBuff: true,
    preventClot: true,
    preventRuin: true,

    tickSpeedMs: 50,
    clickCookie: true,
  }

  setTimeout(() =>  {
    const bigCookie = document.querySelector(`#bigCookie`);
    const centerSection = document.querySelector(`#centerArea`);
    const game = document.querySelector(`#game`);
    const comments = document.querySelector(`#comments`);
    const _Game = window.Game || {tooltip: {}, shimmers: [], wrinklers: [], buffs: [], goldenCookieBuildingBuffs: {}, Has: (s) => {}, hasGod: (s) => {}, ObjectsById: [], cookies: 0, buyMode: 1, buyBulk: 1};
    const wrinkleEl = document.createElement(`div`);
    const wrinklerScoreToggle = document.createElement(`div`);

    const queueData = [];
    const saveQData = () => {
      options.saveQueue && localStorage.setItem(`acmq`, JSON.stringify(queueData));
    }
    const loadQData = () => options.saveQueue && queueData.push(... JSON.parse(localStorage.getItem(`acmq`) || []));

    const unwantedEffects = Object.entries(_Game.goldenCookieBuildingBuffs).map(([name, [good, bad]]) => bad.toLowerCase());

    const killWrinkle = (wrinkle) => wrinkle.hp-- && wrinkle.hp > 0 && killWrinkle(wrinkle);

    const updateWrinkleScore = () => {
      const score =
        _Game.wrinklers
          .filter(w => w.sucked > 0)
          .map(w => !w.type && w.sucked || w.sucked * 3)
          .reduce(((p, c) => p+c), 0);
      let percent = 10;

      if (_Game.Has(`Wrinklerspawn`))
        percent += 5;

      if (_Game.Has(`Sacrilegious corruption`))
        percent += 5;

      if (_Game.hasGod) {
        const level = _Game.hasGod(`scorn`);
        if (level)
          percent += +(Math.abs(level - 4) * .05).toFixed(2).substring(2);
      }

      wrinkleEl.querySelector(`div`).innerHTML = `${window.Beautify(score + ((score/100)*percent))}<br/><span style="font-size:50%">wrinkled cookies</span>`;
    }

    const killWrinkles = () => {
      _Game
        .wrinklers
        .filter(({close, phase, hp}) => phase && close === 1 && hp)
        .forEach(killWrinkle);
    }

    const tickAction = () => {
      if (!options.enable) return;

      if (options.clickCookie)
        bigCookie.click()

      const buyThing = (selector) => {
        const things = document.querySelectorAll(selector);
        if (things.length)
          things[0].click();
      }

      if (options.autoClickShimmers)
        _Game.shimmers.forEach(shimmer => (!options.avoidWrathCookie || options.avoidWrathCookie && !shimmer.wrath) && shimmer.pop());

      const hasWrinklers = _Game.wrinklers.some(w => w.phase > 0);
      if (hasWrinklers) {
        if (options.killWrinkles) killWrinkles();
        else {
          updateWrinkleScore();

          if (wrinklerScoreToggle.style.display !== `block`)
            wrinklerScoreToggle.style.display = `block`;

        }
      } else if (wrinklerScoreToggle.style.display === `block`) {
        wrinklerScoreToggle.style.display = `none`;
        wrinkleEl.style.display = `none`;
      }


      const buffs = document.querySelectorAll(`#buffs *`).length;
      if (!options.disableBuyIfBuffs || options.disableBuyIfBuffs && !buffs) {
        if (options.autoBuyUpgrades)
          buyThing(`#upgrades .enabled`);

        if (options.enableQueue && !options.pauseQueue && queueData.length) {
          const {amount, mode, id, unique} = queueData[0];
          const product = _Game.ObjectsById.find(o => o.id === id);
          const el = document.querySelector(`[data-id="${unique}"]`);

          if (product) {
            let acted = false;
            if (mode === -1) (acted = true, product.sell(amount));
            else if (mode === 1 && product.getSumPrice(amount) < _Game.cookies) (acted = true, product.buy(amount))

            if (acted) el.removeFromQueue(undefined, unique);

          } else el.removeFromQueue(null, unique);
        }

      }

      setTimeout(() => tickAction(), options.tickSpeedMs);
    }

    const onoff = (pointer) => pointer && `ON` || `OFF`;

    const makeListingOption = (name, desc, id, key, cb) => {
      const listing = document.createElement(`div`);
      listing.classList.add(`listing`);

      const option = document.createElement(`a`);
      option.classList.add(`option`);

      if (key) {
        if (!options[key]) option.classList.add(`off`);
        else option.classList.remove(`off`);
      }

      option.setAttribute(`id`, id);
      option.textContent = `${name} ${key && onoff(options[key]) || ``}`;

      option.addEventListener(`click`, (ev) => {
        if (key) {
          options[key] = !options[key];
          option.textContent = `${name} ${onoff(options[key])}`;

          localStorage.setItem(`acmoptions`, JSON.stringify(options));

          if (!options[key]) option.classList.add(`off`);
          else option.classList.remove(`off`);
        }

        if (cb) cb(ev, key);
      });

      const label = document.createElement(`label`);
      label.textContent = desc && `(${desc})` || ``;

      if (name) listing.appendChild(option);
      if (desc) listing.appendChild(label);

      return listing;
    }

    const makeSlider = (name, min, max, increment, key) => {
      const listing = document.createElement(`div`);
      listing.classList.add(`listing`);

      const slider = document.createElement(`div`);
      slider.classList.add(`sliderBox`);

      const label = document.createElement(`div`);
      label.style.float = `left`;
      label.textContent = name;

      const value = document.createElement(`div`);
      value.style.float = `right`;
      value.textContent = options[key];

      const option = document.createElement(`input`);
      option.setAttribute(`type`, `range`);
      option.setAttribute(`min`, min);
      option.setAttribute(`max`, max);
      option.setAttribute(`step`, increment);
      option.style.clear = `both`;
      option.value = options[key];

      option.addEventListener(`change`, (ev) => {
        options[key] = +ev.target.value;
        localStorage.setItem(`acmoptions`, JSON.stringify(options));
        value.textContent = options[key];
      });

      slider.appendChild(label);
      slider.appendChild(value);
      slider.appendChild(option);
      listing.appendChild(slider);

      return listing;
    }

    const makeTitle = (title) => {
      const element = document.createElement(`div`)
      element.classList.add(`title`);
      element.textContent = title;

      return element;
    }

    const makeAscensionButton = (text, style = {}) => {
      style = {position: `absolute`, fontSize: `14px`, fontWeight: `bold`, fontFamily: `Georgia`, color: `#fff`, textShadow: `0px -1px 1px #09f,0px 1px 1px #f04`, cursor: `pointer`, zIndex: `1000`, display: `block`, ...style};
      const button = document.createElement(`div`);
      button.classList.add(`roundedPanel`);
      Object.entries(style).forEach(([key, val]) => button.style[key] = val);
      button.textContent = text;
      return button;
    }

    const makePage = (title = ``, buttonText = ``, buttonStyle = {}) => {
      const style = {display: `none`, position: `absolute`, zIndex: `100`, left: `0`, right: `0`, top: `0`, bottom: `0`};

      const page = document.createElement(`div`);
      page.setAttribute(`id`, buttonText);
      Object.entries(style).forEach(([key, val]) => page.style[key] = val);

      const closePageButton = document.createElement(`div`);
      closePageButton.classList.add(`close`, `menuClose`);
      closePageButton.textContent = `x`;
      closePageButton.setAttribute(`data-close`, buttonText);

      const pageTitle = document.createElement(`div`);
      pageTitle.classList.add(`section`);
      pageTitle.textContent = title;

      const openPage = () => {
        const close = centerSection.querySelector(`.close:not([data-close="${buttonText}"])`);
        if (close) close.click();

        game.classList.add(`onMenu`);
        page.style.display = `block`;
      }

      const closePage = (removeMenu = true) => {
        if (removeMenu) game.classList.remove(`onMenu`);
        page.style.display = `none`;
      }


      closePageButton.addEventListener(`click`, closePage);

      const pageButton = makeAscensionButton(buttonText, buttonStyle);
      pageButton.setAttribute(`data-toggle`, buttonText);
      pageButton.addEventListener(`click`, () => {
        if (page.style.display === `block`)
          closePage();
        else openPage();
      });

      comments.appendChild(pageButton);
      comments
        .querySelectorAll(`.button`)
        .forEach(el => el.addEventListener(`click`, () => closePage(false)));

      page.appendChild(closePageButton);
      page.appendChild(pageTitle);

      page.closeEl = closePageButton;
      page.pageButtonEl = pageButton;
      page.openPage = openPage;

      return page;
    }

    const makeSubSection = (title = ``) => {
      const subsection = document.createElement(`div`);
      subsection.classList.add(`subsection`);
      subsection.appendChild(makeTitle(title));

      return subsection;
    }

    const makeQueuePage = () => {

      const queueEl = makePage(`Product buy queue`, `Queue`, {top: `4.5rem`, left: `10rem`});
      const queueHelp = makeSubSection(`Options`);
      const queueListEl = makeSubSection(`Queue`);

      queueHelp.appendChild(makeListingOption(`Pause`, `While paused, no action will be taken`, ``, `pauseQueue`));
      queueHelp.appendChild(makeListingOption(`Constant queue`, `Will keep the queue list between sessions, using localStorage`, ``, `saveQueue`));

      const buyCostEl = makeListingOption(``, `Buy cost`);
      const sellWorthEl = makeListingOption(``, `Sell worth`);
      queueListEl.appendChild(buyCostEl)
      queueListEl.appendChild(sellWorthEl)

      queueEl.appendChild(queueHelp);
      queueEl.appendChild(queueListEl);

      const updateCostTitles = () => {
        const buyCost = queueData.filter(e => e.mode === 1).map(e => getProduct(e.productIndex).getSumPrice(e.amount)).reduce((p, c) => p+c, 0);
        const sellWorth = queueData.filter(e => e.mode === -1).map(e => getProduct(e.productIndex).getSumPrice(e.amount)).reduce((p, c) => p+c, 0);

        const updateCost = (el, str, amount) => {
          el.querySelector(`label`).textContent = `${str}: ${window.Beautify(amount)} cookies`
          if (!amount) el.style.display = `none`;
          else el.style.display = `block`;
        }

        updateCost(buyCostEl, `Buy cost`, buyCost);
        updateCost(sellWorthEl, `Sell worth`, sellWorth)
      }

      const qEntry = (amount, mode, product, unique, cb) => {
        unique = unique || Math.random() * +new Date();
        const name = product.name;
        const action = mode === -1 && `sell` || `buy`;
        const worth = window.Beautify(product.getSumPrice(amount));
        const entry = makeListingOption(name, `${action} ${amount}, worth ${worth} cookies`, ``, ``, cb);
        entry.setAttribute(`data-product-id`, product.id);
        entry.setAttribute(`data-id`, unique.toString());
        return entry;
      }

      const getProduct = (index) => _Game.ObjectsById[index];

      const removeFromQueue = (ev, id) => {
        id = id || ev.target.parentElement.getAttribute(`data-id`);
        const index = queueData.findIndex(({unique}) => unique === id);

        if (index > -1)
          queueData.splice(index, 1);

        if (options.saveQueue)
          saveQData();

        queueListEl.removeChild(document.querySelector(`[data-id="${id}"]`));

        updateCostTitles();
      }

      const makeEntry = (product, unique) => {
        const entry = qEntry(_Game.buyBulk, _Game.buyMode, product, unique, removeFromQueue);
        entry.removeFromQueue = removeFromQueue;
        return entry;
      }

      const addToQueue = (productIndex) => {
        const product = getProduct(productIndex);
        const unique = (Math.random() * +new Date()).toFixed(0);
        queueListEl.appendChild(makeEntry(product, unique));
        queueData.push({unique, name: product.name, mode: _Game.buyMode, amount: _Game.buyBulk, id: product.id, productIndex});

        if (options.saveQueue)
          saveQData();

        updateCostTitles();
      }

      const createQButton = (productIndex) => {
        const button = makeAscensionButton(`+`, {left: `1rem`, top: `.1rem`, transform: `scale(.7)`});
        button.setAttribute(`q`, `button`);
        button.addEventListener(`click`, (ev) => {
          ev.cancelBubble = true;
          ev.preventDefault();
          addToQueue(productIndex);
          queueEl.openPage();
        });
        return button;
      }

      document.querySelectorAll(`#products .product`)
        .forEach((el, i) => el.appendChild(createQButton(i)));

      if (options.saveQueue) {
        loadQData();
        queueData.forEach((entry, i) => {
          const productIndex = _Game.ObjectsById.findIndex((o) => o.id === entry.id);
          if (productIndex < 0)
            queueData.splice(i, 1);

          queueListEl.appendChild(makeEntry(getProduct(productIndex), entry.unique));
        });
      }

      centerSection.appendChild(queueEl);
    }

    const buildUI = () => {

      const startTickAction = () => {
        if (options.enable) tickAction();
      }

      const toggleQueueUI = () => {
        const toggleDisplay = (el) => el.style.display = !options.enableQueue && `none` || `block`;
        toggleDisplay(document.querySelector(`[data-toggle="Queue"]`));
        document.querySelectorAll(`[q]`).forEach(toggleDisplay);
      }

      Object.assign(options, JSON.parse(localStorage.getItem(`acmoptions`) || `{}`));

      const modMenu = makePage(`MoshMages' Madness`, `Mod`, {top: `4.5rem`, right: `auto`, left: `6rem`});
      const subsection = makeSubSection(`Global`);

      subsection.appendChild(makeListingOption(`Enable`, `enable/disable auto click abilities`, `enable-madness`, `enable`, function() { startTickAction() }))
      subsection.appendChild(makeSlider(`Tick speed (ms)`, 50, 1000, 10, `tickSpeedMs`));

      subsection.appendChild(makeTitle(`Auto click`));
      subsection.appendChild(makeListingOption(`Big cookie`, `click the big cookie`, `enable-cookie-click`, `clickCookie`));
      subsection.appendChild(makeListingOption(`Shimmers`, ``, `auto-shimmer`, `autoClickShimmers`));
      subsection.appendChild(makeListingOption(`Avoid wrath cookies`, ``, `auto-shimmer`, `avoidWrathCookie`));

      subsection.appendChild(makeTitle(`Auto buy`));
      subsection.appendChild(makeListingOption(`Wait for buff end`, `will not buy if buffs are active`, `auto-buff-wait`, `disableBuyIfBuffs`));
      subsection.appendChild(makeListingOption(`Product queue`, `enable product buy queue`, `auto-build`, `enableQueue`, function() { toggleQueueUI(); }));
      subsection.appendChild(makeListingOption(`Upgrades`, `buy first upgrade available`, `auto-upgrade`, `autoBuyUpgrades`));

      subsection.appendChild(makeTitle(`Wrinklers`))
      subsection.appendChild(makeListingOption(`Kill wrinklers`, ``, `auto-wrinkler`, `killWrinkles`));
      subsection.appendChild(makeListingOption(`Kill Golden wrinklers`, ``, `auto-golden-wrinkler`, `killGoldenWrinkles`));

      subsection.appendChild(makeTitle(`Debuffs`));
      subsection.appendChild(makeListingOption(`Prevent clot`, ``, `auto-avoid-clot-ruin`, `preventClot`));
      subsection.appendChild(makeListingOption(`Prevent ruin`, ``, `auto-avoid-ruin`, `preventRuin`));
      subsection.appendChild(makeListingOption(`Prevent building debuffs`, ``, `auto-avoid-building-debuffs`, `preventBuildingDeBuff`));

      modMenu.appendChild(subsection);

      centerSection.appendChild(modMenu);

      modMenu.pageButtonEl.click();

      wrinkleEl.classList.add(`title`);
      wrinkleEl.setAttribute(`id`, `wrinkle-bits`);
      wrinkleEl.style.bottom = `10%`
      wrinkleEl.style.textAlign = `center`;
      wrinkleEl.style.position = `absolute`;
      wrinkleEl.style.width = `100%`;
      wrinkleEl.style.background = `rgba(0,0,0,.4)`;
      wrinkleEl.style.padding = `5px 0 5px 0`;
      wrinkleEl.style.zIndex = `2000`;
      wrinkleEl.style.display = `none`;

      wrinkleEl.appendChild(document.createElement(`div`));

      const wrinklePop = document.createElement(`a`);
      wrinklePop.classList.add(`option`);
      wrinklePop.textContent = `exterminate`;
      wrinklePop.addEventListener(`click`, () => {
        killWrinkles();
      });


      const wrinklerScoreToggleHolder = document.createElement(`div`);
      wrinklerScoreToggleHolder.style.bottom = `9rem`;
      wrinklerScoreToggleHolder.style.right = `.5rem`;
      wrinklerScoreToggleHolder.style.position = `absolute`;
      wrinklerScoreToggleHolder.style.zIndex = `2001`;
      wrinklerScoreToggleHolder.style.transform = `scale(.8)`

      wrinklerScoreToggle.classList.add(`crate`, `upgrade`, `heavenly`);
      wrinklerScoreToggle.style.backgroundPosition = `-1248px -576px`;
      wrinklerScoreToggle.style.cursor = `pointer`;
      wrinklerScoreToggle.style.display = `none`;

      wrinklerScoreToggleHolder.appendChild(wrinklerScoreToggle);


      wrinklerScoreToggle.addEventListener(`click`, () => {
        wrinkleEl.style.display = wrinkleEl.style.display === `block` ? `none` : `block`;
        updateWrinkleScore();

        if (wrinkleEl.style.display === `block`)
          wrinklerScoreToggle.classList.add(`enabled`);
        else wrinklerScoreToggle.classList.remove(`enabled`);
      });

      const leftSection = document.querySelector(`#sectionLeft`);

      wrinkleEl.appendChild(wrinklePop);
      leftSection.appendChild(wrinkleEl);
      leftSection.appendChild(wrinklerScoreToggleHolder);

      if (options.enable)
        tickAction();

      window.ochoose = window.choose;

      const filterWord = (word) => (sentence = ``) => sentence.toString().toLowerCase().indexOf(word.toLowerCase()) < 0;
      const filterBuildingDeBuffs = (k = ``) => unwantedEffects.some(t => filterWord(t)(k))

      window.ochoose = window.choose;
      window.choose = (arr) => window.ochoose(
        arr
          .filter(options.preventClot ? filterWord(`clot`) : () => true)
          .filter(options.preventRuin ? filterWord(`ruin`) : () => true)
          .filter(options.preventBuildingDeBuff ? filterBuildingDeBuffs : () => true)
      );
    }

    setTimeout(buildUI, 500);
    setTimeout(makeQueuePage, 500);
  }, 500)
})();

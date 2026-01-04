// ==UserScript==
// @name         PokeRogue - 模组菜单-中文
// @namespace    https://greasyfork.org/zh-CN/users/1067016-ack20
// @version      2024-12-31
// @description  PokeRogue的模组菜单 - 默认使用 [F2] 打开
// @author       ack20 & ApyroNox
// @match        https://pokerogue.net/
// @match        https://pokerogue.ack20.eu.org/
// @icon         https://pokerogue.ack20.eu.org/logo512.png
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522392/PokeRogue%20-%20%E6%A8%A1%E7%BB%84%E8%8F%9C%E5%8D%95-%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/522392/PokeRogue%20-%20%E6%A8%A1%E7%BB%84%E8%8F%9C%E5%8D%95-%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

function debug(message, color, level = 'log') {
  console[level](`%c ${message}`, `color:${color};`);
}

/**
 * @param {string} tagName
 * @param {object} properties
 * @returns {HTMLElement}
 */
const createElement = (tagName, properties = {}) => Object.assign(document.createElement(tagName), properties);
/**
 * @param {HTMLElement} element
 * @param {object} styles
 */
const setStyles = (element, styles) => Object.assign(element.style, styles);

function loadStyles() {
  const stylesheet = createElement('style');
  stylesheet.innerHTML = [
    ':root{--logo-border-color:#da3838;--logo-inner_dark-color:#2e4069;--logo-inner_light-color:#346485;--card-bg-color:#362d3e;--card-border-color:#c73625;--card-text-color:#f8f8f8}',
    '*,:after,:before{box-sizing:border-box;margin:0;padding:0}',
    '.noselect{-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;user-select:none}',
    'a{color:inherit;cursor:default;text-decoration:none}',
    'a[href]{cursor:pointer;text-decoration:underline}',
    'ul{list-style:none}',
    '.card{--clip-top-left:0 0%;--clip-top-right:100% 0%;--clip-bottom-right:100% 100%;--clip-bottom-left:0 100%;--clip-br:10px;--clip-brm:1.5;overflow-x:hidden;overflow-y:scroll;background-color:var(--card-border-color)!important;color:var(--card-text-color);padding:calc(var(--clip-br) * 1);max-height:50dvh;max-width:50dvw;top:-2rem;visibility:hidden;transition:all .5s ease-in-out}',
    '.card:has(.card-body.open){top:1rem;visibility:visible}',
    '.card-body input{color:var(--card-text-color);background-color:transparent}',
    '.card::before{--clip-brm:1;content:"";position:absolute;inset:0;z-index:-1;background-color:var(--card-bg-color);margin:var(--clip-br)}',
    '.card-r,.card-r::before{--clip-top-left:0 calc(0% + var(--clip-br) * var(--clip-brm)),calc(0% + var(--clip-br) * var(--clip-brm)) 0%;--clip-top-right:calc(100% - var(--clip-br) * var(--clip-brm)) 0%,100% calc(0% + var(--clip-br) * var(--clip-brm));--clip-bottom-right:100% calc(100% - var(--clip-br) * var(--clip-brm)),calc(100% - var(--clip-br) * var(--clip-brm)) 100%;--clip-bottom-left:calc(0% + var(--clip-br) * var(--clip-brm)) 100%,0% calc(100% - var(--clip-br) * var(--clip-brm))}',
    '.card-tl-s,.card-tl-s::before{--clip-top-left:0 0%}',
    '.card-tr-s,.card-tr-s::before{--clip-top-right:100% 0%}',
    '.card-br-s,.card-br-s::before{--clip-bottom-right:100% 100%}',
    '.card-bl-s,.card-bl-s::before{--clip-bottom-left:0 100%}',
    '.card-top-s,.card-top-s::before{--clip-top-left:0 0%;--clip-top-right:100% 0%;margin-top:0;padding-top:var(--clip-br)}',
    '.card-right-s,.card-right-s::before{--clip-top-right:100% 0%;--clip-bottom-right:100% 100%;margin-right:0;padding-right:var(--clip-br)}',
    '.card-bottom-s,.card-bottom-s::before{--clip-bottom-right:100% 100%;--clip-bottom-left:0 100%;margin-bottom:0;padding-bottom:var(--clip-br)}',
    '.card-left-s,.card-left-s::before{--clip-top-left:0 0%;--clip-bottom-left:0 100%;margin-left:0;padding-left:var(--clip-br)}',
    '.card,.card::before{--card-clip-path:var(--clip-top-left),var(--clip-top-right),var(--clip-bottom-right),var(--clip-bottom-left);-webkit-clip-path:polygon(var(--card-clip-path));clip-path:polygon(var(--card-clip-path))}',
  ].join('\n');
  document.head.append(stylesheet);

  document.head.append(
    (function () {
      const style = document.createElement('link');
      style.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css';
      style.rel = 'stylesheet';
      return style;
    })()
  );
  document.body.append(
    (function () {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
      return script;
    })()
  );
  document.body.style.backgroundColor = 'var(--color-base)';
}

const __config_namespace = 'pokerogue.modmenu';
function __get(key, fallback = undefined) {
  if (!localStorage.getItem(__config_namespace)) localStorage.setItem(__config_namespace, JSON.stringify({}));
  const storage = localStorage.getItem(__config_namespace) ?? {};
  try {
    const config = JSON.parse(storage);
    return config[key] ?? fallback;
  } catch (error) {}
}
function __set(key, value) {
  const storage = localStorage.getItem(__config_namespace) ?? {};
  try {
    const config = JSON.parse(storage);
    config[key] = value;
    localStorage.setItem(__config_namespace, JSON.stringify(config));
    return;
  } catch (error) {}
}

(async function (callback = (Game, SpeciesStarterCosts, keybind) => {}) {
  window.localStorage.getItem('pokerogue.modmenu');

  new Promise(function (resolve, reject) {
    var Game, SpeciesStarterCosts;
    const originalObjectDefineProperty = Object.defineProperty;
    const originalObjectEntries = Object.entries;

    Object.defineProperty = function (...definePropertyArguments) {
      if (definePropertyArguments[2].value === 'Game') {
        const originalFunction = definePropertyArguments[0];
        definePropertyArguments[0] = function (...argumentsOnFunctionCall) {
          Game = this;
          debug(`${definePropertyArguments[2].value} 对象被拦截`, '#198754');
          return originalFunction.call(this, ...argumentsOnFunctionCall);
        };
      }

      return originalObjectDefineProperty.call(this, ...definePropertyArguments);
    };

    Object.entries = function (possiblePokemonCostObject) {
      debug(`宝可梦初始花费对象被拦截`, '#198754');
      SpeciesStarterCosts = possiblePokemonCostObject;
      return originalObjectEntries.call(this, possiblePokemonCostObject);
    };

    const resolveThis = () => {
      if (typeof Game !== 'undefined' && typeof SpeciesStarterCosts !== 'undefined') {
        Object.defineProperty = originalObjectDefineProperty;
        Object.entries = originalObjectEntries;

        resolve();
        callback(Game, SpeciesStarterCosts, __get('menu_toggle_keybind', 'F2'));
      } else {
        setTimeout(function () {
          resolveThis();
        }, 1000);
      }
    };
    resolveThis();
  });
})(function (Game, SpeciesStarterCosts, keybind) {
  class PokeRogue {
    Game;
    SpeciesStarterCosts;

    constructor(Game, SpeciesStarterCosts) {
      this.Game = Game;
      this.SpeciesStarterCosts = SpeciesStarterCosts;
    }

    getScene() {
      return this.Game.scene.scenes[0];
    }

    getGameData() {
      return this.getScene().gameData;
    }

    getParty(index = -1) {
      const party = this.getScene().party;
      if (index >= 0 && index < party.length) return party[index];
      return party;
    }

    setCostOfStarterPokemens(price = 2) {
      if (typeof price != 'number') return;
      Object.keys(this.SpeciesStarterCosts).forEach((pokemonId) => {
        this.SpeciesStarterCosts[pokemonId] = price;
      });
    }

    enableFastForward() {
      const scene = this.getScene();
      scene.typeHints = true;
      scene.battleStyle = 1;
      scene.expParty = 2;
    }

    setBestStatsForParty() {
      this.getParty().forEach((pokemon) => {
        // pokemon.level = 200;
        setPokemonStats(pokemon);
      });
    }

    multiplyBoosterModifiers() {
      this.getScene()
        .modifiers.filter((item) => item.type.id === 'BASE_STAT_BOOSTER' || item.type.id === 'ATTACK_TYPE_BOOSTER')
        .forEach((item) => (item.stackCount *= 2));
    }

    getEggGachaUiHandler() {
      return this.getScene().ui.handlers.find((handler) => handler.constructor.name === 'EggGachaUiHandler');
    }

    getShopUiHandler() {
      return this.getScene().ui.handlers.find((handler) => handler.constructor.name === 'ModifierSelectUiHandler');
    }
  }

  function setPokemonStats(pokemon) {
    pokemon.luck = 2;
    pokemon.nature = 10;
    pokemon.ivs = [999, 999, 999, 999, 999, 999];
    pokemon.stats = [999, 999, 999, 999, 999, 999];
    pokemon.moveset.forEach((move) => {
      move.ppUp = 10;
      move.ppUsed = 0;
    });
  }

  const pokerogue = new PokeRogue(Game, SpeciesStarterCosts);
  globalThis['pokerogue'] = pokerogue;

  const container = (function createContainerElement() {
    const container = createElement('div', { className: 'card card-r' });

    setStyles(container, {
      position: 'absolute',
      fontFamily: 'emerald',
    });

    return container;
  })();

  const wrapper = (function createWrapperElement() {
    const wrapper = createElement('div', { className: 'card-body' });
    container.append(wrapper);
    return wrapper;
  })();

  const row = (function createFluidRowElement() {
    const row = createElement('div', { className: 'row g-3' });

    wrapper.append(row);
    return row;
  })();

  (function SectionModifyStarterCosts() {
    const container = createElement('div', { className: 'col col-6 d-grid' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '降低初始宝可梦花费' });

    button.addEventListener('click', function (event) {
      pokerogue.setCostOfStarterPokemens(1);
    });

    container.append(button);
    row.append(container);
  })();

  (function SectionModifyMoney() {
    const container = createElement('div', { className: 'col col-6' });
    const group = createElement('div', { className: 'input-group' });
    const input = createElement('input', { className: 'form-control border-secondary text-secondary', type: 'number', value: '999000', max: '999999' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '增加金钱' });

    button.addEventListener('click', function (event) {
      pokerogue.getScene().addMoney(input.value);
    });

    group.append(input, button);
    container.append(group);
    row.append(container);
  })();

  (function SectionGiveMasterballs() {
    const container = createElement('div', { className: 'col col-6 d-grid' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '增加10个大师球' });

    button.addEventListener('click', function (event) {
      pokerogue.getScene().pokeballCounts[4] += 10;
    });

    container.append(button);
    row.append(container);
  })();

  (function SectionModifyLuck() {
    const container = createElement('div', { className: 'col col-6 d-grid' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: "设置幸运值为 'SSS'" });

    button.addEventListener('click', function (event) {
      pokerogue.getParty().forEach((pokemon) => {
        pokemon.luck = 16;
      });
    });

    container.append(button);
    row.append(container);
  })();

  (function SectionShopUpdateItemRarity() {
    const hintContainer = createElement('div', { className: 'col col-12 clearfix' });
    const hintText = createElement('p', { textContent: '设置物品稀有度后，您需要锁定稀有度并重新滚动一次！', className: 'fs-4 text-danger' });
    const hintUnderstoodButton = createElement('button', { textContent: '明白了', className: 'float-end btn btn-primary' });
    hintContainer.append(hintText, hintUnderstoodButton);
    localStorage.getItem('modmenu.lockitemrarity.understood') ? null : row.append(hintContainer);

    hintUnderstoodButton.addEventListener('click', () => {
      localStorage.setItem('modmenu.lockitemrarity.understood', true);
      hintContainer.remove();
    });

    const container = createElement('div', { className: 'col col-6' });
    const group = createElement('div', { className: 'input-group' });
    const input = createElement('input', { className: 'form-control border-secondary text-secondary', type: 'number', value: '0', max: '3' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '设置物品稀有度' });

    button.addEventListener('click', function (event) {
      const shop = pokerogue.getShopUiHandler();
      const originalShopShopFunction = shop.show;

      shop.show = function customOverrideFunction(args) {
        args[1].forEach((item) => {
          item.type.tier = Number(input.value ?? 3);
          item.upgradeCount = Number(input.value ?? 3);
        });
        shop.show = originalShopShopFunction;
        return originalShopShopFunction.call(shop, args);
      };

      shop.onActionInput(0, 0);
    });

    group.append(input, button);
    container.append(group);
    row.append(container);
  })();

  (function SectionLockShopRarity() {
    const container = createElement('div', { className: 'col col-6 d-grid' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '锁定物品稀有度' });

    button.addEventListener('click', function (event) {
      const scene = pokerogue.getScene();
      scene.lockModifierTiers = !scene.lockModifierTiers;
      scene.lockModifierTiers
        ? (button.classList.add('btn-outline-success'), button.classList.remove('btn-outline-secondary'))
        : (button.classList.remove('btn-outline-success'), button.classList.add('btn-outline-secondary'));
    });

    container.append(button);
    row.append(container);
  })();

  (function SectionPullGatchas() {
    const container1 = createElement('div', { className: 'col col-4' });
    const container2 = createElement('div', { className: 'col col-4' });
    const container3 = createElement('div', { className: 'col col-4' });
    const setAmmoutInput = createElement('input', { className: 'form-control border-secondary text-secondary', type: 'number', value: '100', max: '100' });
    const addLegendaryButton = createElement('button', { className: 'btn btn-outline-secondary w-100', type: 'button', textContent: '抽取传说宝可梦' });
    const addShinyButton = createElement('button', { className: 'btn btn-outline-secondary w-100', type: 'button', textContent: '抽取闪光宝可梦' });

    addLegendaryButton.addEventListener('click', function (event) {
      const gachaContainer = pokerogue.getEggGachaUiHandler();
      gachaContainer.setCursor(0);
      gachaContainer.setGachaCursor(1);
      gachaContainer.pull(setAmmoutInput.value, 0);
    });
    addShinyButton.addEventListener('click', function (event) {
      const gachaContainer = pokerogue.getEggGachaUiHandler();
      gachaContainer.setCursor(0);
      gachaContainer.setGachaCursor(2);
      gachaContainer.pull(setAmmoutInput.value, 0);
    });

    container1.append(setAmmoutInput);
    container2.append(addLegendaryButton);
    container3.append(addShinyButton);
    row.append(container1, container2, container3);
  })();

  //
  //
  //

  const configRow = (function SectionConfiguration() {
    const configRow = createElement('div', { className: 'row g-3' });
    const container = createElement('div', { className: 'col col-12' });
    container.append(createElement('hr', { className: 'mb-0' }));
    configRow.append(container);
    row.after(configRow);
    return configRow;
  })();

  (function SectionConfiguration() {
    const container = createElement('div', { className: 'col col-6' });
    const group = createElement('div', { className: 'input-group' });
    const input = createElement('input', { className: 'form-control border-secondary text-secondary', type: 'text', placeholder: '默认 = F2' });
    const button = createElement('button', { className: 'btn btn-outline-secondary', type: 'button', textContent: '设置模组菜单快捷键' });

    button.addEventListener('click', function (event) {
      if (input.value) {
        __set('menu_toggle_keybind', input.value);
        keybind = input.value;
        container.remove();
      }
    });

    group.append(input, button);
    container.append(group);
    configRow.append(container);
  })();

  //
  //
  //

  const canvas = document.querySelector('canvas');
  canvas.after(container);
  window.addEventListener('keydown', function (event) {
    switch (String(event.key).toLowerCase()) {
      case String(keybind).toLowerCase():
        if (!wrapper.classList.contains('open')) {
          wrapper.classList.add('open');
        } else {
          wrapper.classList.remove('open');
          container.querySelectorAll('*').forEach(function (element) {
            try {
              element.blur();
            } catch (error) {}
          });
        }
        break;

      case String('*').toLowerCase():
        configRow.classList.toggle('hidden');
        break;

      default:
        break;
    }
  });
  loadStyles();

  if (!__get('menu_toggle_keybind', false)) {
    wrapper.classList.add('open');
  }
});
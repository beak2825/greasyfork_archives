// ==UserScript==
// @name         cookie-garden-helper
// @namespace    http://github.com/
// @version      0.1
// @description  Automate your garden in Cookie Clicker
// @author       yannprada
// @match        https://orteil.dashnet.org/cookieclicker/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449223/cookie-garden-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/449223/cookie-garden-helper.meta.js
// ==/UserScript==
// Ported from github without permission by ZakGhost354313
// https://github.com/yannprada/cookie-garden-helper

//https://rawgit.com/yannprada/cookie-garden-helper/master/cookie-garden-helper.js

{


const moduleName = 'cookieGardenHelper';

const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
const uncapitalize = (word) => word.charAt(0).toLowerCase() + word.slice(1);
const clone = (x) => JSON.parse(JSON.stringify(x));
const doc = {
  elId: document.getElementById.bind(document),
  qSel: document.querySelector.bind(document),
  qSelAll: document.querySelectorAll.bind(document),
}

class Config {
  static get default() {
    return {
      autoHarvest: false,
      autoHarvestNewSeeds: true,
      autoHarvestAvoidImmortals: true,
      autoHarvestWeeds: true,
      autoHarvestCleanGarden: false,
      autoHarvestCheckCpSMult: false,
      autoHarvestMiniCpSMult: { value: 1, min: 0 },
      autoHarvestDying: true,
      autoHarvestDyingSeconds: 5,
      autoHarvestCheckCpSMultDying: false,
      autoHarvestMiniCpSMultDying: { value: 1, min: 0 },
      autoPlant: false,
      autoPlantCheckCpSMult: false,
      autoPlantMaxiCpSMult: { value: 0, min: 0 },
      savedPlot: [],
    };
  }

  static get storageKey() { return moduleName; }

  static load() {
    let config = window.localStorage.getItem(this.storageKey);
    if (!config) {
      this.save(this.default);
      return this.default;
    }
    return Object.assign(this.default, JSON.parse(config));
  }

  static save(config) {
    window.localStorage.setItem(this.storageKey, JSON.stringify(config));
  }
}

class Garden {
  static get minigame() { return Game.Objects['Farm'].minigame; }
  static get isActive() { return this.minigame !== undefined; }

  static get CpSMult() {
    var res = 1
    for (let key in Game.buffs) {
        if (typeof Game.buffs[key].multCpS != 'undefined') {
            res *= Game.buffs[key].multCpS;
        }
    }
    return res;
  }

  static get secondsBeforeNextTick() {
    return (this.minigame.nextStep-Date.now()) / 1000;
  }

  static get selectedSeed() { return this.minigame.seedSelected; }
  static set selectedSeed(seedId) { this.minigame.seedSelected = seedId; }

  static clonePlot() {
    let plot = clone(this.minigame.plot);
    for (let x=0; x<6; x++) {
      for (let y=0; y<6; y++) {
        let [seedId, age] = plot[x][y];
        let plant = this.getPlant(seedId);
        if (plant != undefined && !plant.plantable) {
          plot[x][y] = [0, 0];
        }
      }
    }
    return plot;
  }

  static getPlant(id) { return this.minigame.plantsById[id - 1]; }
  static getTile(x, y) {
    let tile = this.minigame.getTile(x, y);
    return { seedId: tile[0], age: tile[1] };
  }

  static getPlantStage(tile) {
    let plant = this.getPlant(tile.seedId);
    if (tile.age < plant.mature) {
      return 'young';
    } else {
      if ((tile.age + Math.ceil(plant.ageTick + plant.ageTickR)) < 100) {
        return 'mature';
      } else {
        return 'dying';
      }
    }
  }

  static tileIsEmpty(x, y) { return this.getTile(x, y).seedId == 0; }

  static plantSeed(seedId, x, y) {
    let plant = this.getPlant(seedId + 1);
    if (plant.plantable) {
      this.minigame.useTool(seedId, x, y);
    }
  }

  static forEachTile(callback) {
    for (let x=0; x<6; x++) {
      for (let y=0; y<6; y++) {
        if (this.minigame.isTileUnlocked(x, y)) {
          callback(x, y);
        }
      }
    }
  }

  static harvest(x, y) { this.minigame.harvest(x, y); }

  static fillGardenWithSelectedSeed() {
    if (this.selectedSeed > -1) {
      this.forEachTile((x, y) => {
        if (this.tileIsEmpty(x, y)) {
          this.plantSeed(this.selectedSeed, x, y);
        }
      });
    }
  }

  static handleYoung(config, plant, x, y) {
    if (plant.weed && config.autoHarvestWeeds) {
      this.harvest(x, y);
    }
    let [seedId, age] = config.savedPlot[y][x];
    seedId--;
    if (config.autoHarvestCleanGarden &&
        ((plant.unlocked && seedId == -1) ||
         (seedId > -1 && seedId != plant.id))
        ) {
      this.harvest(x, y);
    }
  }

  static handleMature(config, plant, x, y) {
    if (!plant.unlocked && config.autoHarvestNewSeeds) {
      this.harvest(x, y);
    } else if (config.autoHarvestCheckCpSMult &&
               this.CpSMult >= config.autoHarvestMiniCpSMult.value) {
      this.harvest(x, y);
    }
  }

  static handleDying(config, plant, x, y) {
    if (config.autoHarvestCheckCpSMultDying &&
        this.CpSMult >= config.autoHarvestMiniCpSMultDying.value) {
      this.harvest(x, y);
    } else if (config.autoHarvestDying &&
        this.secondsBeforeNextTick <= config.autoHarvestDyingSeconds) {
      this.harvest(x, y);
    }
  }

  static run(config) {
    this.forEachTile((x, y) => {
      if (config.autoHarvest && !this.tileIsEmpty(x, y)) {
        let tile = this.getTile(x, y);
        let plant = this.getPlant(tile.seedId);

        if (plant.immortal && config.autoHarvestAvoidImmortals) {
          // do nothing
        } else {
          let stage = this.getPlantStage(tile);
          switch (stage) {
            case 'young':
              this.handleYoung(config, plant, x, y);
              break;
            case 'mature':
              this.handleMature(config, plant, x, y);
              break;
            case 'dying':
              this.handleDying(config, plant, x, y);
              break;
            default:
              console.log(`Unexpected plant stage: ${stage}`);
          }
        }
      }

      if (config.autoPlant &&
          (!config.autoPlantCheckCpSMult ||
          this.CpSMult <= config.autoPlantMaxiCpSMult.value) &&
          this.tileIsEmpty(x, y) &&
          config.savedPlot.length > 0
        ) {
        let [seedId, age] = config.savedPlot[y][x];
        if (seedId > 0) {
          this.plantSeed(seedId - 1, x, y);
        }
      }
    });
  }
}

class UI {
  static makeId(id) { return moduleName + capitalize(id); }
  static get css() {
    return `
#game.onMenu #cookieGardenHelper {
  display: none;
}
#cookieGardenHelper {
  background: #000 url(img/darkNoise.jpg);
  display: none;
  padding: 1em;
  position: inherit;
}
#cookieGardenHelper.visible {
  display: block;
}
#cookieGardenHelperTools:after {
  content: "";
  display: table;
  clear: both;
}

.cookieGardenHelperPanel {
  float: left;
  width: 25%;
}
.cookieGardenHelperBigPanel {
  float: left;
  width: 50%;
}
.cookieGardenHelperSubPanel {
  float: left;
  width: 50%;
}

#autoHarvestPanel { color: wheat; }
#autoHarvestPanel a { color: wheat; }

#autoPlantPanel { color: lightgreen; }
#autoPlantPanel a { color: lightgreen; }

#autoHarvestPanel a:hover,
#autoPlantPanel a:hover { color: white; }

#cookieGardenHelperTitle {
  color: grey;
  font-size: 2em;
  font-style: italic;
  margin-bottom: 0.5em;
  margin-top: -0.5em;
  text-align: center;
}
#cookieGardenHelper h2 {
  font-size: 1.5em;
  line-height: 2em;
}
#cookieGardenHelper h3 {
  color: lightgrey;
  font-style: italic;
  line-height: 2em;
}
#cookieGardenHelper p {
  text-indent: 0;
}
#cookieGardenHelper input[type=number] {
  width: 3em;
}

#cookieGardenHelper a.toggleBtn:not(.off) .toggleBtnOff,
#cookieGardenHelper a.toggleBtn.off .toggleBtnOn {
  display: none;
}
#cookieGardenHelper span.labelWithState:not(.active) .labelStateActive,
#cookieGardenHelper span.labelWithState.active .labelStateNotActive {
  display: none;
}

#cookieGardenHelperTooltip {
  width: 300px;
}
#cookieGardenHelperTooltip .gardenTileRow {
  height: 48px;
}
#cookieGardenHelperTooltip .tile {
  border: 1px inset dimgrey;
  display: inline-block;
  height: 48px;
  width: 48px;
}
#cookieGardenHelperTooltip .gardenTileIcon {
  position: inherit;
}

#cookieGardenHelper .warning {
    padding: 1em;
    font-size: 1.5em;
    background-color: orange;
    color: white;
}
#cookieGardenHelper .warning .closeWarning {
    font-weight: bold;
    float: right;
    font-size: 2em;
    line-height: 0.25em;
    cursor: pointer;
    transition: 0.3s;
}
#cookieGardenHelper .warning .closeWarning:hover {
    color: black;
}
`;
  }

  static numberInput(name, text, title, options) {
    let id = this.makeId(name);
    return `
<input type="number" name="${name}" id="${id}" value="${options.value}" step=0.5
  ${options.min !== undefined ? `min="${options.min}"` : ''}
  ${options.max !== undefined ? `max="${options.max}"` : ''} />
<label for="${id}" title="${title}">${text}</label>`;
  }

  static button(name, text, title, toggle, active) {
    if (toggle) {
      return `<a class="toggleBtn option ${active ? '' : 'off'}" name="${name}"
                 id="${this.makeId(name)}" title="${title}">
        ${text}
        <span class="toggleBtnOn">ON</span>
        <span class="toggleBtnOff">OFF</span>
      </a>`;
    }
    return `<a class="btn option" name="${name}" id="${this.makeId(name)}"
      title="${title}">${text}</a>`;
  }

  static toggleButton(name) {
    let btn = doc.qSel(`#cookieGardenHelper a.toggleBtn[name=${name}]`);
    btn.classList.toggle('off');
  }

  static labelWithState(name, text, textActive, active) {
    return `<span name="${name}" id="${this.makeId(name)}"
                  class="labelWithState ${active ? 'active' : ''}"">
      <span class="labelStateActive">${textActive}</span>
      <span class="labelStateNotActive">${text}</span>
    </span>`;
  }

  static labelToggleState(name, active) {
    let label = doc.qSel(`#cookieGardenHelper span.labelWithState[name=${name}]`);
    label.classList.toggle('active', active);
  }

  static createWarning(msg) {
    doc.elId('row2').insertAdjacentHTML('beforebegin', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <div class="warning">
    <span class="closeWarning">&times;</span>
    ${msg}
  </div>
</div>`);
    doc.qSel('#cookieGardenHelper .closeWarning').onclick = (event) => {
      doc.elId('cookieGardenHelper').remove();
    };
  }

  static get readmeLink() { return 'https://github.com/yannprada/'
      + 'cookie-garden-helper/blob/master/README.md#how-it-works'; }

  static build(config) {
    doc.qSel('#row2 .productButtons').insertAdjacentHTML('beforeend', `
        <div id="cookieGardenHelperProductButton" class="productButton">
          Cookie Garden Helper
        </div>`);
    doc.elId('row2').insertAdjacentHTML('beforeend', `
<div id="cookieGardenHelper">
  <style>${this.css}</style>
  <a href="${this.readmeLink}"
    target="new">how it works</a>
  <div id="cookieGardenHelperTitle" class="title">Cookie Garden Helper</div>
  <div id="cookieGardenHelperTools">
    <div class="cookieGardenHelperBigPanel" id="autoHarvestPanel">
      <h2>
        Auto-harvest
        ${this.button('autoHarvest', '', '', true, config.autoHarvest)}
      </h2>
      <div class="cookieGardenHelperSubPanel">
        <h3>immortal</h3>
        <p>
          ${this.button(
            'autoHarvestAvoidImmortals', 'Avoid immortals',
            'Do not harvest immortal plants', true,
            config.autoHarvestAvoidImmortals
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>young</h3>
        <p>
          ${this.button(
            'autoHarvestWeeds', 'Remove weeds',
            'Remove weeds as soon as they appear', true,
            config.autoHarvestWeeds
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCleanGarden', 'Clean Garden',
            'Only allow saved and unlocked seeds', true,
            config.autoHarvestCleanGarden
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>mature</h3>
        <p>
          ${this.button(
            'autoHarvestNewSeeds', 'New seeds',
            'Harvest new seeds as soon as they are mature', true,
            config.autoHarvestNewSeeds
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCheckCpSMult', 'Check CpS mult',
            'Check the CpS multiplier before harvesting (see below)', true,
            config.autoHarvestCheckCpSMult
          )}
        </p>
        <p>
          ${this.numberInput(
            'autoHarvestMiniCpSMult', 'Mini CpS multiplier',
            'Minimum CpS multiplier for the auto-harvest to happen',
            config.autoHarvestMiniCpSMult
          )}
        </p>
      </div>
      <div class="cookieGardenHelperSubPanel">
        <h3>dying</h3>
        <p>
          ${this.button(
            'autoHarvestDying', 'Dying plants',
            `Harvest dying plants, ${config.autoHarvestDyingSeconds}s before `
            + `the new tick occurs`, true,
            config.autoHarvestDying
          )}
        </p>
        <p>
          ${this.button(
            'autoHarvestCheckCpSMultDying', 'Check CpS mult',
            'Check the CpS multiplier before harvesting (see below)', true,
            config.autoHarvestCheckCpSMultDying
          )}
        </p>
        <p>
          ${this.numberInput(
            'autoHarvestMiniCpSMultDying', 'Mini CpS multiplier',
            'Minimum CpS multiplier for the auto-harvest to happen',
            config.autoHarvestMiniCpSMultDying
          )}
        </p>
      </div>
    </div>
    <div class="cookieGardenHelperPanel" id="autoPlantPanel">
      <h2>
        Auto-plant
        ${this.button('autoPlant', '', '', true, config.autoPlant)}
      </h2>
      <p>
        ${this.button(
          'autoPlantCheckCpSMult', 'Check CpS mult',
          'Check the CpS multiplier before planting (see below)', true,
          config.autoPlantCheckCpSMult
        )}
      </p>
      <p>
        ${this.numberInput(
          'autoPlantMaxiCpSMult', 'Maxi CpS multiplier',
          'Maximum CpS multiplier for the auto-plant to happen',
          config.autoPlantMaxiCpSMult
        )}
      </p>
      <p>
        ${this.button('savePlot', 'Save plot',
          'Save the current plot; these seeds will be replanted later')}
        ${this.labelWithState('plotIsSaved', 'No saved plot', 'Plot saved',
          Boolean(config.savedPlot.length))}
      </p>
    </div>
    <div class="cookieGardenHelperPanel" id="manualToolsPanel">
      <h2>Manual tools</h2>
      <p>
        ${this.button('fillGardenWithSelectedSeed', 'Plant selected seed',
        'Plant the selected seed on all empty tiles')}
      </p>
    </div>
  </div>
</div>`);

    doc.elId('cookieGardenHelperProductButton').onclick = (event) => {
      doc.elId('cookieGardenHelper').classList.toggle('visible');
    };

    doc.qSelAll('#cookieGardenHelper input').forEach((input) => {
      input.onchange = (event) => {
        if (input.type == 'number') {
          let min = config[input.name].min;
          let max = config[input.name].max;
          if (min !== undefined && input.value < min) { input.value = min; }
          if (max !== undefined && input.value > max) { input.value = max; }
          Main.handleChange(input.name, input.value);
        }
      };
    });

    doc.qSelAll('#cookieGardenHelper a.toggleBtn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleToggle(a.name);
      };
    });

    doc.qSelAll('#cookieGardenHelper a.btn').forEach((a) => {
      a.onclick = (event) => {
        Main.handleClick(a.name);
      };
    });

    doc.elId('cookieGardenHelperPlotIsSaved').onmouseout = (event) => {
      Main.handleMouseoutPlotIsSaved(this);
    }
    doc.elId('cookieGardenHelperPlotIsSaved').onmouseover = (event) => {
      Main.handleMouseoverPlotIsSaved(this);
    }
  }

  static getSeedIconY(seedId) {
    return Garden.getPlant(seedId).icon * -48;
  }

  static buildSavedPlot(savedPlot) {
    return `<div id="cookieGardenHelperTooltip">
      ${savedPlot.map((row) => `<div class="gardenTileRow">
        ${row.map((tile) => `<div class="tile">
          ${(tile[0] - 1) < 0 ? '' : `<div class="gardenTileIcon"
            style="background-position: 0 ${this.getSeedIconY(tile[0])}px;">
          </div>`}
        </div>`).join('')}
      </div>`).join('')}
    </div>`;
  }
}

class Main {
  static init() {
    this.timerInterval = 1000;
    this.config = Config.load();
    UI.build(this.config);

    // sacrifice garden
    let oldConvert = Garden.minigame.convert;
    Garden.minigame.convert = () => {
      this.config.savedPlot = [];
      UI.labelToggleState('plotIsSaved', false);
      this.handleToggle('autoHarvest');
      this.handleToggle('autoPlant');
      this.save();
      oldConvert();
    }

    this.start();
  }

  static start() {
    this.timerId = window.setInterval(
      () => Garden.run(this.config),
      this.timerInterval
    );
  }

  static stop() { window.clearInterval(this.timerId); }

  static save() { Config.save(this.config); }

  static handleChange(key, value) {
    if (this.config[key].value !== undefined) {
      this.config[key].value = value;
    } else {
      this.config[key] = value;
    }
    this.save();
  }

  static handleToggle(key) {
    this.config[key] = !this.config[key];
    this.save();
    UI.toggleButton(key);
  }

  static handleClick(key) {
    if (key == 'fillGardenWithSelectedSeed') {
      Garden.fillGardenWithSelectedSeed();
    } else if (key == 'savePlot') {
      this.config['savedPlot'] = Garden.clonePlot();
      UI.labelToggleState('plotIsSaved', true);
    }
    this.save();
  }

  static handleMouseoutPlotIsSaved(element) {
    Game.tooltip.shouldHide=1;
  }

  static handleMouseoverPlotIsSaved(element) {
    if (this.config.savedPlot.length > 0) {
      let content = UI.buildSavedPlot(this.config.savedPlot);
      Game.tooltip.draw(element, window.escape(content));
    }
  }
}

if (Garden.isActive) {
  Main.init();
} else {
  let msg = `You don't have a garden yet. This mod won't work without it!`;
  console.log(msg);
  UI.createWarning(msg);
}


}
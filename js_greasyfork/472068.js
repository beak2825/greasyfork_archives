// ==UserScript==
// @name         TurboToolbox
// @namespace    http://owouw.us/
// @version      1.0.0
// @description  Adds a few debug tools to Turbowarp
// @author       ToasterPanic
// @match        *://*/*
// @icon         https://turbowarp.org/images/apple-touch-icon.png
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/472068/TurboToolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/472068/TurboToolbox.meta.js
// ==/UserScript==

document.toolbox = {
  vars: {},
  sprites: {},
  baseStepTime: 33.333333333333336,
  pause: function() { vm.runtime.currentStepTime = 0 },
  unpause: function() { vm.runtime.currentStepTime = document.toolbox.baseStepTime },
  throwPizza: function() { throw "pizza" }
};

function toolboxInterval () {
  if (!vm?.runtime?._stageTarget?.variables || !vm?.runtime?.targets[0]?.sprite?.name){
    setTimeout(toolboxInterval, 100);
    return;
  }

  class turboToolboxVariable {
    constructor(item, ctx) {
      this.name = item.name;
      this.id = item.id;
      this.context = ctx;
    }
    set(val) {
      if (this.context == "stage") vm.runtime._stageTarget.variables[this.id].value = val
      else vm.runtime.targets[this.context].variables[this.id].value = val;
    }
    change(val) {
      if (this.context == "stage") vm.runtime._stageTarget.variables[this.id].value += val
      else vm.runtime.targets[this.context].variables[this.id].value  += val;
    }
    get() {
      if (this.context == "stage") return vm.runtime._stageTarget.variables[this.id].value
      else return vm.runtime.targets[this.context].variables[this.id].value;
    }
  }

  class turboToolboxSprite {
    constructor(item, vars) {
      this.name = item.sprite.name;
      this.id = item.id;
      this.variables = vars;
    }
  }

  for (var item in vm.runtime._stageTarget.variables) {
    if (!item.type) {
      document.toolbox.vars[vm.runtime._stageTarget.variables[item].name] = new turboToolboxVariable(vm.runtime._stageTarget.variables[item],"stage");
    }
  }
  for (var sprite in vm.runtime.targets) {
    if (vm.runtime.targets[sprite]?.sprite?.name != "Stage") continue;

    var items = {};
    for (var item in vm.runtime.targets[sprite].variables) {
      if (!item.type) {
        items[vm.runtime._stageTarget.variables[item].name] = new turboToolboxVariable(vm.runtime._stageTarget.variables[item],sprite);
      }
    }

    document.toolbox.sprites[vm.runtime.targets[sprite].sprite.name] = new turboToolboxSprite(vm.runtime.targets[sprite], items);
  }

  document.toolbox.baseStepTime = vm.runtime.currentStepTime;
  console.log("%cTurboToolbox",`color: hsla(0, 100%, 65%, 1); font-size: 24px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;`);
  console.log("%cBy ToasterPanic | v1.0.0",`font-size: 12px; font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;`);
};

if (document.body.innerHTML.includes(`const vm = scaffolding.vm;`)) setTimeout(toolboxInterval, 100);
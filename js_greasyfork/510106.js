// ==UserScript==
// @name        boogadex
// @match       *://idle-pixel.com/login/play*
// @grant       none
// @version     1.1
// @author      ooga  booga
// @description css bs
// @require     https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @namespace https://greasyfork.org/users/826975
// @downloadURL https://update.greasyfork.org/scripts/510106/boogadex.user.js
// @updateURL https://update.greasyfork.org/scripts/510106/boogadex.meta.js
// ==/UserScript==

let settings = {};

class BoogaDex extends IdlePixelPlusPlugin {
  constructor() {
    super("boogadex", {
      about: {
        name: GM_info.script.name,
        version: GM_info.script.version,
        author: GM_info.script.author,
        description: GM_info.script.description
      }
    });
  }

  onLogin() {
    let css = document.createElement('style');
    css.innerHTML = `
    .animal-group {
      display: flex;
    }

    .animal-controller {
      display: flex;
      flex-direction: column;
      width: 250px;
      margin: 20px;
      padding: 10px;
      border-radius: 20px;
      background-color: #4242421a;
    }

    .animal-controller-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      border-bottom: black 1px solid;
    }

    .animal-controller-body {
      height: 100%;
    }

    .horse-group {
      background-color: sky;
    }

    .animal-card {
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 250px;
      margin: 20px;
      padding: 10px;
      border-radius: 20px;
      background-color: #ffffff30;
      text-align: center;
    }

    .animal-card * {
      border-radius: 10px;
    }

    .animal-card-element {
      background-color: #4242421a;
      width: 50px;
      height: 50px;
      margin: 10px;
    }

    .animal-card-top {
      height: 100%;
      display: flex;
      justify-content: space-evenly;
    }

    .animal-card-bottom {
      text-align: center;
    }

    .animal-card-left {
      display: flex;
      flex-direction: column;
    }

    .animal-card-right {
      width: 100%;
    }

    .animal-card-thumbnail {
      width: calc(100% - 20px);
      aspect-ratio: 1 / 1;
      height: auto;
      background-size: 2000%;
      background-position: 50% 50%;
    }

    .dot-white {
      height: 10px;
      width: 10px;
      box-shadow: 0 0 10px black;
      background-color: white;
      border-radius: 50%;
      display: inline-block;
    }

    .dot-lightgrey {
      height: 10px;
      width: 10px;
      box-shadow: 0 0 10px black;
      background-color: lightslategrey;
      border-radius: 50%;
      display: inline-block;
    }

    .animal-card {
      box-shadow: 5px 5px 10px 0px #00000057;
    }
    `;
    document.head.appendChild(css);

    Breeding.objectify_animals = (raw) => {
      let animalKeys = ['slug', 'animal', 'gender', 'tier', 'playtimeActivatedOn', 'shinyType', 'sick', 'foodPerDay', 'foodConsumed', 'lootItemReady', 'lootItemAmount', 'xpGained', 'traitLabel'];
      let animalValues = raw.split('=').map(x => x.split(','));
      let animalData = animalValues.map(v => Object.fromEntries(animalKeys.map((k, i) => [k, v[i]])));
      return animalData;
    }

    Breeding.refresh_animals_data = (raw) => {
      if(window.oldAnimalData == raw) return;
      window.oldAnimalData = raw;
      document.getElementById("breeding-area").innerHTML = "";
      if(raw == "none" || raw == 0) return;
      let animalData = Breeding.objectify_animals(raw);
      let animalTypes = [...document.querySelectorAll("[data-breeding-pokedex]")].map(x => x.getAttribute("data-breeding-pokedex"));
      let hasEasyBreedingAchCompleted = Achievements.has_completed_set('breeding', 'easy');
      let breedingHTML = "";
      for(let type of animalTypes){
        let relevantAnimals = animalData.filter(x => x.animal == type);
        breedingHTML += `
        <div class='animal-group ${type}-group'>
        <div class='animal-controller'>
          <div class='animal-controller-header'>
            <p>Reproduction avg: ${(Math.floor((Breeding.getReproductionRate(type, '')*(1.1**relevantAnimals.filter(x => x.traitLabel == 'Less Fertile').length)*(0.9**relevantAnimals.filter(x => x.traitLabel == 'Fertile').length))/600/Math.min(relevantAnimals.filter(x => x.gender == '1').length, relevantAnimals.filter(x => x.gender == '2').length))*600/60/60).toFixed(2)}hrs</p>
            <p>${relevantAnimals.length}/${Items.getItem(`${type}_capacity`)}</p>
          </div>
          <div class='animal-controller-body'>
            <div>male/female</div>
            <div>buy/expand</div>
            <img src='https://cdn.idle-pixel.com/images/${Breeding.getBreedFoodLabelImage(type)}.png'>
          </div>
        </div>
        `;
        for(let animal of relevantAnimals){
          animal.playtimeActivatedOn = parseFloat(animal.playtimeActivatedOn);
          animal.shinyType = parseInt(animal.shinyType);
          animal.sick = parseInt(animal.sick);
          animal.lootItemAmount = parseInt(animal.lootItemAmount);

          let diffPlaytime = Items.getItem("playtime") - animal.playtimeActivatedOn;
          if(diffPlaytime >= 86400 && Items.getItem("ach_easy_7_days") == 0) {
            websocket.send('ACH_CHECK_7_DAYS');
          }
          breedingHTML += this.renderAnimalCard(animal);
        }
        breedingHTML += `</div>`;
      }
      document.getElementById("breeding-area").innerHTML = breedingHTML;
      [...document.querySelectorAll('#breeding-area [data-bs-toggle="tooltip"]')].forEach(x => new bootstrap.Tooltip(x))
    };

    Breeding.recycle_animal = (slug) => {
      let animals = Breeding.objectify_animals(var_animal_data);
      let animal = animals.find(x => x.slug == slug);
      websocket.send(`KILL_ANIMAL=${animal.slug}`);
      websocket.send(`ACTIVATE_ANIMAL=inactive_${animal.animal}_${animal.gender == '1' ? 'male' : 'female'}`);
    };
  };

  renderAnimalCard(data){
    let traitMap = {
      None: 'nginxtest.png',
      Fertile: 'heart.png',
      Productive: 'oil_factory.png',
      XPer: 'skills.png',
      Immunity: 'anti_disease_potion.png',
      Fasting: 'apple.png',
      Weak: 'anti_disease_potion.png',
      XPless: 'skills.png',
      Hungry: 'apple.png',
      Unproductive: 'oil_factory.png',
      'Less Fertile': 'heart.png',
      Hungerless: 'chefs_hat.png',
      Romance: 'breeding_dove_egg.png',
      Fighter: 'sword_icon.png',
      'Raids Loot (Toybox)': 'toy_ball.png'
    };
    let traitMeta = {
      grade: Breeding.getTraitDesc(data.traitLabel)[0].split('_')[0],
      icon: traitMap[data.traitLabel],
      description: Breeding.getTraitDesc(data.traitLabel)[1]
    };

    return `
    <div class='animal-card' style='background: linear-gradient(to bottom, rgb(${data.gender == '1' ? '100 149 237' : '255 105 180'} / 50%) 10%, rgba(0, 0, 0, 0) 10%)'>
      <div class='animal-card-top'>
        <div class='animal-card-left'>
          <div class='animal-card-element hover' data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" data-bs-title="<div class='tp-content'>${traitMeta.description.match(/^[^<>]+/)}</div>" onclick="${data.traitLabel == 'Fighter' ? `Modals.clicksFighterTraite('${data.slug}');event.stopPropagation();` : ''}"><img style='width: 100%; background-color: ${traitMeta.grade == 'smile' ? '#00ff007d' : traitMeta.grade == 'sad' ? '#ff00007d' : traitMeta.grade == 'none' ? '#ffffff7d' : '#ff00ff7d'}' src='https://cdn.idle-pixel.com/images/${traitMeta.icon}'></div>
          <div class='animal-card-element hover' data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" data-bs-title="<div class='tp-content'>${data.foodConsumed} consumed in total</div>" style='background-color: #ff9a507d'><div class='mt-3'>${data.foodPerDay}</div></div>
          <div class='animal-card-element hover' data-bs-toggle="tooltip" data-bs-placement="right" data-bs-html="true" data-bs-title="<div class='tp-content'>${data.lootItemAmount} ${data.lootItemReady}</div>" style='background-color: #ffd7007d'><div class='mt-3'>${data.lootItemAmount}</div></div>
        </div>
        <div class='animal-card-right'>
          <div class='animal-card-element animal-card-thumbnail' style='background-image: url(https://cdn.idle-pixel.com/images/${data.animal}_pen.png);'>
            <img style='width: 100%;' class='hover' src='https://cdn.idle-pixel.com/images/${data.animal}_${Breeding.get_gender_label(data.gender)}_${data.tier}.png' onclick='Modals.clicksActivedAnimal("${data.slug}", ${data.sick}, ${+data.lootItemAmount > 0}, ${data.xpGained})'>
            <img style='position: absolute; translate: -50px;' class='hover' src='https://cdn.idle-pixel.com/images/death.png' onclick='Breeding.recycle_animal("${data.slug}");'>
            <div class="font-small" style='text-align: center;'>
              <span class="${data.tier > 0 ? 'dot-white' : 'dot-lightgrey'}"></span> <span class="${data.tier > 1 ? 'dot-white' : 'dot-lightgrey'}"></span> <span class="${data.tier > 2 ? 'dot-white' : 'dot-lightgrey'}"></span>
            </div>
          </div>
          <p style='text-align: center; margin: 0;'>${data.slug.slice(0, 4)}</p>
        </div>
      </div>
      <div class='animal-card-bottom'>${format_time(Items.getItem("playtime") - data.playtimeActivatedOn)} - ${format_number(data.xpGained)}xp</div>
    </div>
    `;
  }
}

const plugin = new BoogaDex();
IdlePixelPlus.registerPlugin(plugin);
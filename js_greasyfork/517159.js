// ==UserScript==
// @name        Breeding Tables
// @namespace   finally.idle-pixel.breeding
// @match       https://idle-pixel.com/login/play/*
// @grant       none
// @version     1.2
// @author      finally
// @description Add summarized breeding tables
// @downloadURL https://update.greasyfork.org/scripts/517159/Breeding%20Tables.user.js
// @updateURL https://update.greasyfork.org/scripts/517159/Breeding%20Tables.meta.js
// ==/UserScript==

function refresh_animals_data(raw) {
  let breeding_area = document.getElementById("breeding-area");
  breeding_area.style.display = Breeding.select_animal_tab == "all" ? "none" : "";

  let animal_tables = document.getElementById("breeding-tables")
  animal_tables.innerHTML = "";

  if(raw == "none" || raw == 0) return;

  let animals = raw.split("=").map(data => {
    let array = data.split(",");
    return {
      slug: array[0],
      animal: array[1],
      gender: ~~array[2],
      tier: ~~array[3],
      playtimeActivatedOn: ~~array[4],
      shinyType: ~~array[5],
      sick: ~~array[6],
      foodPerDay: ~~array[7],
      foodConsumed: ~~array[8],
      lootItemReady: ~~array[9],
      lootItemAmount: ~~array[10],
      xpGained: ~~array[11],
      traitLabel: array[12],
      extraData1: array[13],
      extraData2: array[14],
      extraData3: array[15],
      extraData4: array[16],
      extraData5: array[17]
    };
  });

  let animals_by_type = Object.groupBy(animals, animal => animal.animal);
  Object.keys(animals_by_type).sort((a,b) => a.localeCompare(b)).forEach(type => {
    if (Breeding.select_animal_tab != "all" && Breeding.select_animal_tab != type) return;

    let animals = animals_by_type[type];
    let html = "";

    let sick_overlay = "";
    if(animals.some(a => a.sick == 2)) {
      sick_overlay = `<img class="w50" src="https://cdn.idle-pixel.com/images/death.png" style="opacity: 0.5;z-index:5;position:absolute" />`;
    }
    if(animals.some(a => a.sick == 1)) {
      sick_overlay = `<img class="w50" src="https://cdn.idle-pixel.com/images/heart.png" style="opacity: 0.5;z-index:5;position:absolute" />`;
    }

    let max_tier = animals.map(a => a.tier).reduce((a,b) => Math.max(a, b), 0);

    let select = Breeding.select_animal_tab == "all" ? type : "all";

    html += `
      <table style="border: 0;" class="active-animal-table hover ${sick_overlay ? "sick-animal-table" : ""}" onclick="Breeding.select_animal_tab = '${select}';Breeding.refresh_animals_data('${raw}')">
        <tr>
          <td>${capitalizeFirstLetter(get_item_name(type))}</td>
          <td>Trait</td>
          <td>Amount (T1/2/3)</td>
          <td>Sex (F/M)</td>
          <td>XP</td>
        </tr>
        <tr>
          <td rowspan="0">
            ${sick_overlay}
            <img class="w100 ${sick_overlay ? "img-rotate-90" : ""}" src="https://cdn.idle-pixel.com/images/${type}_female_${max_tier}.png" />
            <div class="font-small color:grey">
              ${`<span class="dot-green"></span> `.repeat(max_tier)}
              ${`<span class="dot-grey"></span> `.repeat(3-max_tier)}
            </div>
          </td>`;

    let sexStyle = "";
    if (animals.filter(a => a.gender == 1).length == animals.filter(a => a.gender == 2).length) sexStyle = "background-color: rgba(0, 255, 0, 0.2)";
    else sexStyle = "background-color: rgba(255, 0, 0, 0.2)";

    let animals_by_trait = Object.groupBy(animals, animal => animal.traitLabel);
    let sorted_animal_traits = Object.keys(animals_by_trait).sort((a,b) => {
      let aLabel = `${a == "None" ? "1" : Breeding.getTraitDesc(a)[0] == "smile_icon" ? "0" : "2"}${a}`;
      let bLabel = `${b == "None" ? "1" : Breeding.getTraitDesc(b)[0] == "smile_icon" ? "0" : "2"}${b}`;
      return aLabel.localeCompare(bLabel);
    });
    sorted_animal_traits.forEach(trait => {
      let animals = animals_by_trait[trait];

      let traitDesc = Breeding.getTraitDesc(trait);
      let traitStyle = "";
      if (traitDesc[0] == "smile_icon") traitStyle = "background-color: rgba(0, 255, 0, 0.2)";
      else if (traitDesc[0] == "sad_icon") traitStyle = "background-color: rgba(255, 0, 0, 0.2)";

      html += `
        ${html.endsWith("tr>") ? "<tr>" : ""}
          <td style="white-space: nowrap; ${traitStyle}">${trait}</td>
          <td>${animals.filter(a => a.tier == 1).length}/${animals.filter(a => a.tier == 2).length}/${animals.filter(a => a.tier == 3).length}</td>
          <td style="${Object.keys(animals_by_trait).length == 1 ? sexStyle : ""}">${animals.filter(a => a.gender == 2).length}/${animals.filter(a => a.gender == 1).length}</td>
          <td>${format_number(animals.reduce((a,b) => a+b.xpGained, 0))}</td>
        </tr>`;
    });

    if (Object.keys(animals_by_trait).length > 1) {
      html += `
        <tr>
          <td></td>
          <td>${animals.filter(a => a.tier == 1).length}/${animals.filter(a => a.tier == 2).length}/${animals.filter(a => a.tier == 3).length}</td>
          <td style="${sexStyle}">${animals.filter(a => a.gender == 2).length}/${animals.filter(a => a.gender == 1).length}</td>
          <td>${format_number(animals.reduce((a,b) => a+b.xpGained, 0))}</td>
        </tr>`;
    }

    animal_tables.innerHTML += html;
  });
}

(() => {
  return new Promise((resolve) => {
    function check() {
      if (document.getElementById("breeding-area")) {
        resolve();
        return;
      }
      setTimeout(check, 200);
    }
    check();
  });
})().then(() => {
  let breeding_area = document.getElementById("breeding-area");

  let breeding_tables = document.createElement("div");
  breeding_tables.id = "breeding-tables";
  breeding_tables.className = "breeding-area";

  breeding_area.parentNode.insertBefore(breeding_tables, breeding_area);

  let old_refresh_animals_data = Breeding.refresh_animals_data;
  Breeding.refresh_animals_data = (raw) => {
    old_refresh_animals_data(raw);
    refresh_animals_data(raw);
  };
});
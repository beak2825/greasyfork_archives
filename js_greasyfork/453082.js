// ==UserScript==
// @name         MH - Outside Map (Halloween)
// @version      1.0.10
// @description  Brings map information outside
// @author       Maidenless
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace    https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/453082/MH%20-%20Outside%20Map%20%28Halloween%29.user.js
// @updateURL https://update.greasyfork.org/scripts/453082/MH%20-%20Outside%20Map%20%28Halloween%29.meta.js
// ==/UserScript==

var debugging = false;

//Repetitive coding bandage
$(document).ajaxComplete(async (event, xhr, options) => {
  const maps = user.quests.QuestRelicHunter.maps;
  var index = maps.findIndex(map => map.name.includes("Halloween"));
  if (index < 0) {
    return;
  }
  var halloween_map_id = maps[index].map_id;
  if ((options.url == "https://www.mousehuntgame.com/managers/ajax/users/changetrap.php")
    && user.environment_name == "Gloomy Greenwood") {
    console.log("Trap change Trigger")
    getMapInfo(halloween_map_id)
      .then(res => {
        generate(res);
      })
  }
})

$(document).ready(function () {
  if (user.environment_name != "Gloomy Greenwood") {
    return;
  } else {
    const maps = user.quests.QuestRelicHunter.maps;
    var index = maps.findIndex(map => map.name.includes("Halloween"));
    if (index < 0) {
      return;
    }
    var halloween_map_id = maps[index].map_id;
    console.log("Page Load Trigger")
    getMapInfo(halloween_map_id)
      .then(res => {
        generate(res);
      })

    //stolen from brad
    const addStyles = (styles) => {
      const existingStyles = document.getElementById('mi-custom-styles');

      if (existingStyles) {
        existingStyles.innerHTML += styles;
      } else {
        const style = document.createElement('style');
        style.id = 'mi-custom-styles';

        style.innerHTML = styles;
        document.head.appendChild(style);
      }
    };

    //Add a mutation observer
    const observerTarget = $(".mousehuntHud-userStat.treasureMap")[0].children[2];

    if (observerTarget) {

      const observer = new MutationObserver((mutation) => {
        mutationCallback();
        //console.log(mutation)
        //observer.disconnect();
      });

      function mutationCallback() {
        console.log("Mutation Callback Change")
        getMapInfo(halloween_map_id)
          .then(res => {
            generate(res);
          })
      }

      observer.observe(observerTarget, {
        childList: true,
        subtree: true,
      });
    }


    addStyles(`
    #minluck-button {
      margin-top: 5px;
    }

    .mi-uncaught-div {
      position: absolute;
      top: 38px;
      border: 2px solid darkseagreen;
      border-radius: 20px;
      width: 15px;
      height: 15px;
      color: white;
      text-align: center;
      z-index: 1;
      background: darkgreen;
      cursor: pointer;
    }

    .mi-caught-div {
      position: absolute;
      top: 38px;
      border: 2px solid mediumvioletred;
      border-radius: 20px;
      width: 15px;
      height: 15px;
      color: white;
      text-align: center;
      z-index: 1;
      background: darkred;
      cursor: pointer;
    }

    .mi-hunter-div {
      position: absolute;
      top: 62px ;
      width: 115px;
      left: 15px;
    }

    .mi-map-hunters {
      width: 25px;
      height: 25px;
      border-radius: 20px;
      margin-left: -5px;
    }

    }`)
  }
});

function generate([cheese, hunters, mouse]) {

  document
    .querySelectorAll(".mi-uncaught-div")
    .forEach(el => el.remove())

  document
    .querySelectorAll(".mi-hunter-div")
    .forEach(el => el.remove())

  //insert
  var insertLocation = $(".halloweenBoilingCauldronHUD-bait");
  for (var i = 0; i < cheese.length; i++) {
    //div for cheese
    var mouseDiv = document.createElement("div");
    mouseDiv.className = cheese[i] == 0 ? "mi-caught-div" : "mi-uncaught-div"
    mouseDiv.innerText = cheese[i];
    var mouseTitle = "Uncaught mice: "
    for (let k = 0; k < mouse[i].length; k++) {
      mouseTitle = mouseTitle + "\n" + mouse[i][k]
    }
    mouseDiv.title = mouseTitle;
    insertLocation[i].appendChild(mouseDiv);

    //another div for hunters
    var hunterDiv = document.createElement("div");
    hunterDiv.className = "mi-hunter-div";
    insertLocation[i].appendChild(hunterDiv);
  }
  //insert hunters
  for (let i = 0; i < hunters.length; i++) {
    var hunterPic = document.createElement("img");
    hunterPic.className = "mi-map-hunters"
    hunterPic.src = hunters[i].profile_pic;
    hunterPic.title = hunters[i].name;
    var hDiv = $(".mi-hunter-div");

    if (hunters[i].bait_name == "Monterey Jack-O-Lantern") {
      hDiv[1].appendChild(hunterPic);
    } else if (hunters[i].bait_name == "Bonefort Cheese") {
      hDiv[2].appendChild(hunterPic);
    } else if (hunters[i].bait_name == "Polter-Geitost") {
      hDiv[3].appendChild(hunterPic);
    } else if (hunters[i].bait_name == "Scream Cheese") {
      hDiv[4].appendChild(hunterPic);
    } else {
      hDiv[0].appendChild(hunterPic);
    }
  }
}

function getMapInfo(map_id) {
  debugging ? console.log("Gathering map mice information") : null;
  return new Promise((resolve, reject) => {
    postReq("https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
      `sn=Hitgrab&hg_is_ajax=1&action=map_info&map_id=${map_id}&uh=${user.unique_hash}&last_read_journal_entry_id=${lastReadJournalEntryId}`
    ).then(res => {
      try {
        if (res) {
          //Step 1: Find the mice unique_ids
          var response = JSON.parse(res.responseText);
          //List of mice => try to find unique_id for comparison
          var treasure_mice = response.treasure_map.goals.mouse;
          debugging ? console.log("All mice list") : null;
          debugging ? console.log(treasure_mice) : null;

          //Step 2: Find the mice_unique ids which are caught
          var hunter_tab = response.treasure_map.hunters
          //console.log(hunter_tab);
          var caught_unique_id = [];
          for (var i = 0; i < hunter_tab.length; i++) {
            /*
              loop through an array within an array
              */
            for (var j = 0; j < hunter_tab[i].completed_goal_ids.mouse.length; j++) {
              caught_unique_id.push(hunter_tab[i].completed_goal_ids.mouse[j])
            }
          }
          debugging ? console.log("Mice caught list") : null;
          debugging ? console.log(caught_unique_id) : null;
          //Now we got all the unique_ids of mouse caught, let's get the remaining mice
          for (let i = 0; i < caught_unique_id.length; i++) {
            var index = treasure_mice.findIndex(mouse => mouse.unique_id == caught_unique_id[i])
            treasure_mice.splice(index, 1);
          }
          debugging ? console.log("Unique Id of remaining mice") : null;
          debugging ? console.log(treasure_mice) : null;

          //Step 3:Which cheese?
          var cheese = [0, 0, 0, 0, 0]
          var cheese_array = response.user.quests.QuestHalloweenBoilingCauldron.mice;
          //Afterthought: I realise that the array give is not numerical
          var mouse = {
            [0]: [],
            [1]: [],
            [2]: [],
            [3]: [],
            [4]: [],
          }
          var converted_cheese_array = {
            [0]: cheese_array.cauldron_tier_1_cheese,
            [1]: cheese_array.cauldron_tier_2_cheese,
            [2]: cheese_array.cauldron_tier_3_cheese,
            [3]: cheese_array.cauldron_tier_4_cheese,
          }
          var converted_mouse_array = {}
          //reiterate over 4 tiers
          var j = 0;
          while (treasure_mice.length != 0) {
            var index = converted_cheese_array[j].findIndex(item => item.type == treasure_mice[0].type)
            if (index > -1) {
              //add 1 to cheese
              cheese[j] = cheese[j] + 1;
              //add 1 to mice list
              var initMice = mouse[j + 1];
              initMice.push(treasure_mice[0].name);
              mouse[j + 1] = initMice;
              treasure_mice.splice(0, 1);
              j = 0;
            } else if (j < 3) {
              j++;
            } else {
              //Standard baitmi
              treasure_mice.splice(0, 1);
              cheese[4]++;
              var initMice = mouse[j];
              initMice.push(treasure_mice[0].name);
              mouse[j + 1] = initMice;
              j = 0;
            }
          };
          //rearrange, put standard bait at first position
          var std = cheese[4];
          cheese.unshift(std);
          cheese.pop();
          //mouse.unshift(stdm);
          //mouse.pop();
          debugging ? console.log("Remaining order of cheese") : null;
          debugging ? console.log(cheese) : null;
          debugging ? console.log("Names of mice") : null;
          debugging ? console.log(mouse) : null;

          //Step 4: Get the hunters
          var hunters_active = []
          for (let i = 0; i < hunter_tab.length; i++) {
            //var index = hunter_tab.findIndex(item => item.is_active == true);
            if (hunter_tab[i].is_active == true) {
              hunters_active.push(hunter_tab[i]);
            }
          }
          debugging ? console.log("Active hunters are") : null;
          debugging ? console.log(hunters_active) : null;
          resolve([cheese, hunters_active, mouse]);
        }
      } catch (error) {
        console.log(error)
      }
    })
  })
}


function postReq(url, form) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        resolve(this);
      }
    };
    xhr.onerror = function () {
      reject(this);
    };
    xhr.send(form);
  });
};

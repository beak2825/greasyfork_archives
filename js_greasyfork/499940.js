// ==UserScript==
// @name         FilterLife - Fetlife Member Filter
// @namespace    http://tampermonkey.net/
// @version      1.42
// @description  Filter member lists on FL to your liking
// @author       ceodoe
// @match        https://fetlife.com/p/*
// @match        https://fetlife.com/search/kinksters*
// @match        https://fetlife.com/users/*/friends*
// @match        https://fetlife.com/users/*/followers*
// @match        https://fetlife.com/users/*/following*
// @match        https://fetlife.com/search*
// @match        https://fetlife.com/groups/*/members*
// @match        https://fetlife.com/events/*/rsvps*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fetlife.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499940/FilterLife%20-%20Fetlife%20Member%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/499940/FilterLife%20-%20Fetlife%20Member%20Filter.meta.js
// ==/UserScript==
let ageMin = 18;
let ageMax = 120;
let genders = ["M", "F", "MtF", "FtM", "NB", "GF", "GN", "CD/TV", "TG", "GQ", "FEM", "GNC", "Cis", "TM", "TW", "Masc", "AG", "TwoS", "IS"];
let roles = ["sub", "dom", "domme", "top", "bottom", "switch", "brat", "exploring", "rubberist", "masochist", "sadist", "slut", "goddess", "daddy", "exhibitionist", "primal", "kinkster", "undecided", "cuckold", "sensualist", "master", "stag", "sissy", "kitten", "doll", "hotwife", "slave", "bull", "hedonist", "swinger", "little", "evolving", "fetishist", "babygirl", "babyboy", "service top", "owner", "rope top", "sadomasochist", "mistress", "property", "kajira", "spanko", "toy", "leathergirl", "princess", "cuckoldress", "primal predator", "leatherwoman", "rope bunny", "service switch", "vanilla", "worshipper", "kajirus", "bondmaid", "pain slut", "degrader", "degradee", "cumdump", "edge player", "disciplinarian", "service bottom", "butler", "minion", "voyeur", "mommy", "caregiver", "middle", "big", "brat tamer", "brat wrangler", "king", "queen", "prince", "bimbo", "cougar", "unicorn", "cuckcake", "steer", "cuckquean", "feminizer", "furry", "handler", "trainer", "tamer", "pet", "pup", "fox", "pony", "pig", "piggy", "hucow", "primal switch", "primal prey", "perpetrator", "victim", "chew toy", "rigger", "rope switch", "rope bottom", "bondage top", "bondage switch", "bondage bottom", "bondage slut", "spanker", "spankee", "tickler", "tickle switch", "ticklee", "needle top", "needle switch", "needle bottom", "pincushion", "electro top", "electro bottom", "electro switch", "leatherman", "leatherperson", "leather daddy", "leather mommy", "leather bottom", "leatherboy", "leatherboi", "bootblack", "drag king", "drag queen", "artist", "muse", "gentleman", "fairy kink mother", "vixen"];

genders = genders.sort();
roles = roles.sort();

let FiLiSettings = GM_getValue("FiLiSettings", {
  ageMin: ageMin,
  ageMax: ageMax,
  genders: genders,
  roles: roles,
  showNullGender: true,
  showNullRole: true,
  showOrgs: true,
  showOnlyWithPics: false,
  showOnlyWithVids: false,
  showOnlyWithWritings: false
});

GM_addStyle(`
    .FiLiHidden {
        display: none !important;
    }

    .FiLiNumeric {
        width: 30px;
    }
`);

function saveData() {
  let ageMinVal = Number(document.getElementById("FiLiAgeMin").value);
  let ageMaxVal = Number(document.getElementById("FiLiAgeMax").value);

  if(isNaN(ageMinVal)) {
    ageMinVal = ageMin;
  } else {
    if(ageMinVal < ageMin) {
      ageMinVal = ageMin;
    }
  }

  if(isNaN(ageMaxVal)) {
    ageMaxVal = ageMax;
  } else {
    if(ageMaxVal > ageMax) {
      ageMaxVal = ageMax;
    }
  }

  FiLiSettings.ageMin = ageMinVal;
  FiLiSettings.ageMax = ageMaxVal;

  let genderCheckboxes = document.getElementById("FiLiOptionsBox").querySelectorAll("input[type=checkbox][id^=FiLiGender_]");
  let genderArray = [];
  for(let i = 0; i < genderCheckboxes.length; i++) {
    if(genderCheckboxes[i].id == "FiLiGender_Null") {
      FiLiSettings.showNullGender = genderCheckboxes[i].checked;
    } else {
      if(genderCheckboxes[i].checked) {
        genderArray.push(genderCheckboxes[i].nextElementSibling.innerText.trim());
      }
    }
  }
  FiLiSettings.genders = genderArray;

  let roleCheckboxes = document.getElementById("FiLiOptionsBox").querySelectorAll("input[type=checkbox][id^=FiLiRole_]");
  let roleArray = [];
  for(let i = 0; i < roleCheckboxes.length; i++) {
    if(roleCheckboxes[i].id == "FiLiRole_Null") {
      FiLiSettings.showNullRole = roleCheckboxes[i].checked;
    } else {
      if(roleCheckboxes[i].checked) {
        roleArray.push(roleCheckboxes[i].nextElementSibling.innerText.trim());
      }
    }
  }
  FiLiSettings.roles = roleArray;

  FiLiSettings.showOrgs = document.getElementById("FiLiShowOrgs").checked;
  FiLiSettings.showOnlyWithPics = document.getElementById("FiLiShowOnlyWithPics").checked;
  FiLiSettings.showOnlyWithVids = document.getElementById("FiLiShowOnlyWithVids").checked;
  FiLiSettings.showOnlyWithWritings = document.getElementById("FiLiShowOnlyWithWritings").checked;

  GM_setValue("FiLiSettings", FiLiSettings);
  location.reload();
}

function filterPage() {
  let cards;

  if(document.location.href.includes("/members")) {
    cards = document.querySelectorAll("div.w-full.rounded-sm.bg-gray-900.cursor-pointer.transition");
  } else {
    cards = document.querySelectorAll("div.w-full.px-1");
  }

  let numHidden = 0;
  for(let i = 0; i < cards.length; i++) {
    let aslElement = cards[i].querySelector("span.text-sm.font-bold.text-gray-300");
    if(aslElement) {
      let regex = new RegExp(/^([0-9]+)([A-Za-z/]+)?( .+)?$/);
      let matches = aslElement.innerText.match(regex);

      let age = Number(matches[1]);
      let gender = "";
      let role = "";

      if(matches[2] !== undefined) {
        gender = matches[2];
      }

      if(matches[3] !== undefined) {
        role = matches[3].trim();
      }

      let hide = false;
      if(age < Number(FiLiSettings.ageMin)) {
        hide = true;
      } else if(age > Number(FiLiSettings.ageMax)) {
        hide = true;
      }

      if(gender !== "") {
        if(!FiLiSettings.genders.includes(gender)) {
          if(!genders.includes(gender)) {
            console.log("Unknown gender (" + gender + ")");
          } else {
            hide = true;
          }
        }
      } else {
        if(!FiLiSettings.showNullGender) {
          hide = true;
        }
      }

      if(role !== "") {
        if(!FiLiSettings.roles.includes(role.toLowerCase())) {
          if(!roles.includes(role.toLowerCase())) {
            console.log("Unknown role (" + role + ")");
          } else {
            hide = true;
          }
        }
      } else {
        if(!FiLiSettings.showNullRole) {
          hide = true;
        }
      }

      if(FiLiSettings.showOnlyWithPics && !cards[i].querySelector("a[href$=pictures]")) {
        hide = true;
      }

      if(FiLiSettings.showOnlyWithVids && !cards[i].querySelector("a[href$=videos]")) {
        hide = true;
      }

      if(FiLiSettings.showOnlyWithWritings && !cards[i].querySelector("a[href$=posts]")) {
        hide = true;
      }

      if(hide) {
        cards[i].classList.add("FiLiHidden");
        numHidden++;
      }
    } else {
      if(cards[i].querySelector(`span[title^="Organization"]`) && FiLiSettings.showOrgs == false) {
        cards[i].classList.add("FiLiHidden");
        numHidden++;
      }
    }
  }

  if(numHidden > 0) {
    document.getElementById("FiLiNumHidden").innerText = "(" + numHidden + " hidden profiles)";
  }
}

window.setTimeout(function() {
  let referenceNode = document.querySelector("header.items-end, header.pb-1, header.mb-2");
  let box = document.createElement("div");
  box.classList.add("rounded-sm", "transition", "hover:bg-gray-950", "focus:bg-gray-950", "bg-gray-900");
  box.style.padding = "10px";
  box.style.marginBottom = "10px";
  box.id = "FiLiOptionsBox";


  let genderHTML = "";
  let roleHTML = "";

  for(let i = 0; i < genders.length; i++) {
    genderHTML += `<input type="checkbox" id="FiLiGender_${genders[i].replaceAll(" ", "")}"${FiLiSettings.genders.includes(genders[i]) ? " checked" : ""}><label for="FiLiGender_${genders[i].replaceAll(" ", "")}"> ${genders[i]}</label> \n`;
  }

  for(let i = 0; i < roles.length; i++) {
    roleHTML += `<input type="checkbox" id="FiLiRole_${roles[i].replaceAll(" ", "")}"${FiLiSettings.roles.includes(roles[i]) ? " checked" : ""}><label for="FiLiRole_${roles[i].replaceAll(" ", "")}"> ${roles[i]}</label> \n`;

    if((i + 1) % 8 == 0) {
      roleHTML += "<br />";
    }
  }

  box.innerHTML = `
        <span class="font-bold red-500">FilterLife</span> <span id="FiLiNumHidden"></span> <span class="cursor-pointer" onclick="document.querySelector('#FiLiMainContent').classList.toggle('FiLiHidden')">[Options]</span>
        <div id="FiLiMainContent" class="FiLiHidden">
            <br />
            <b>Age range</b><br />
            From <input type="number" class="FiLiNumeric" min="18" max="120" value="${FiLiSettings.ageMin}" id="FiLiAgeMin" /> to <input type="number" class="FiLiNumeric" min="18" max="120" value="${FiLiSettings.ageMax}" id="FiLiAgeMax" /> years old
            <br /><br />
    
            <b>Genders</b> <span class="cursor-pointer" id="FiLiGendersAll">[all]</span> <span class="cursor-pointer" id="FiLiGendersNone">[none]</span> <span class="cursor-pointer" id="FiLiGendersInv">[invert]</span><br />
            ${genderHTML}<br />
            <input type="checkbox" id="FiLiGender_Null"${FiLiSettings.showNullGender ? " checked" : ""}><label for="FiLiGender_Null"> Show profiles with no specified gender</label>
            <br /><br />
    
            <b>Roles</b> <span class="cursor-pointer" id="FiLiRolesAll">[all]</span> <span class="cursor-pointer" id="FiLiRolesNone">[none]</span> <span class="cursor-pointer" id="FiLiRolesInv">[invert]</span><br />
            ${roleHTML}<br />
            <input type="checkbox" id="FiLiRole_Null"${FiLiSettings.showNullRole ? " checked" : ""}><label for="FiLiRole_Null"> Show profiles with no specified role</label>
            <br /><br />
            
            <b>Extra options</b><br />
            <input type="checkbox" id="FiLiShowOrgs"${FiLiSettings.showOrgs ? " checked" : ""}><label for="FiLiShowOrgs"> Show organization profiles</label><br />
            <input type="checkbox" id="FiLiShowOnlyWithPics"${FiLiSettings.showOnlyWithPics ? " checked" : ""}><label for="FiLiShowOnlyWithPics"> Only show profiles with pics</label><br />
            <input type="checkbox" id="FiLiShowOnlyWithVids"${FiLiSettings.showOnlyWithVids ? " checked" : ""}><label for="FiLiShowOnlyWithVids"> Only show profiles with vids</label><br />
            <input type="checkbox" id="FiLiShowOnlyWithWritings"${FiLiSettings.showOnlyWithWritings ? " checked" : ""}><label for="FiLiShowOnlyWithWritings"> Only show profiles with writings</label>
            <br /><br />
    
            <span class="cursor-pointer font-bold red-500" id="FiLiSaveButton">[Save]</span> <small><span class="cursor-pointer" id="FiLiUnhide">[Temporarily restore hidden profiles]</span></small>
        </div>
    `;

  referenceNode.insertAdjacentElement("afterend", box);

  document.getElementById("FiLiSaveButton").onclick = function() {
    saveData();
  };

  document.getElementById("FiLiGendersAll").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiGender_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
  };

  document.getElementById("FiLiRolesAll").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiRole_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = true;
    }
  };

  document.getElementById("FiLiGendersNone").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiGender_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };

  document.getElementById("FiLiRolesNone").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiRole_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = false;
    }
  };

  document.getElementById("FiLiGendersInv").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiGender_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = !checkboxes[i].checked;
    }
  };

  document.getElementById("FiLiRolesInv").onclick = function() {
    let checkboxes = document.querySelectorAll("input[type=checkbox][id^=FiLiRole_]");
    for(let i = 0; i < checkboxes.length; i++) {
      checkboxes[i].checked = !checkboxes[i].checked;
    }
  };

  document.getElementById("FiLiUnhide").onclick = function() {
    let hiddenProfiles = document.querySelectorAll(".FiLiHidden");
    for(let i = 0; i < hiddenProfiles.length; i++) {
      hiddenProfiles[i].classList.remove("FiLiHidden");
      hiddenProfiles[i].style.border = "2px solid red";
    }
    document.getElementById("FiLiNumHidden").innerText = "";
    document.getElementById("FiLiMainContent").classList.add("FiLiHidden");
  };

  filterPage();    
}, 1500);

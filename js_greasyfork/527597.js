// ==UserScript==
// @name         2025 Fetlife Member Filter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Filter members based on gender, age, location, and roles
// @author       Bull864
// @match        https://fetlife.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fetlife.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/527597/2025%20Fetlife%20Member%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/527597/2025%20Fetlife%20Member%20Filter.meta.js
// ==/UserScript==
let ageMin = 18;
let ageMax = 120;
let genders = ["M", "F", "MtF", "FtM", "NB", "GF", "GN", "CD/TV", "TG", "GQ", "FEM", "GNC", "Cis", "TM", "TW", "Masc", "AG", "TwoS", "Man", "boy", "QG", "TFem", "TMasc", "W", "GL"];
let roles = ["sub", "dom", "domme", "top", "bottom", "switch", "brat", "exploring", "rubberist", "masochist", "sadist", "slut", "goddess", "daddy", "exhibitionist", "primal", "kinkster", "undecided", "cuckold", "sensualist", "master", "stag", "sissy", "kitten", "doll", "hotwife", "slave", "bull", "hedonist", "swinger", "little", "evolving", "fetishist", "babygirl", "babyboy", "service top", "owner", "rope top", "sadomasochist", "mistress", "property", "kajira", "spanko", "toy", "leathergirl", "princess", "cuckoldress", "primal predator", "leatherwoman", "rope bunny", "service switch", "vanilla", "worshipper", "kajirus", "bondmaid", "pain slut", "degrader", "degradee", "cumdump", "edge player", "disciplinarian", "service bottom", "butler", "minion", "voyeur", "mommy", "caregiver", "middle", "big", "brat tamer", "brat wrangler", "king", "queen", "prince", "bimbo", "cougar", "unicorn", "cuckcake", "steer", "cuckquean", "feminizer", "furry", "handler", "trainer", "tamer", "pet", "pup", "fox", "pony", "pig", "piggy", "hucow", "primal switch", "primal prey", "perpetrator", "victim", "chew toy", "rigger", "rope switch", "rope bottom", "bondage top", "bondage switch", "bondage bottom", "bondage slut", "spanker", "spankee", "tickler", "tickle switch", "ticklee", "needle top", "needle switch", "needle bottom", "pincushion", "electro top", "electro bottom", "electro switch", "leatherman", "leatherperson", "leather daddy", "leather mommy", "leather bottom", "leatherboy", "leatherboi", "bootblack", "drag king", "drag queen", "artist", "muse", "gentleman", "fairy kink mother", "vixen", "witch", "dom-leaning switch", "deity", "mommy dom", "alpha submissive", "empress", "cumslut", "service slave", "attention whore", "cock whore", "plaything", "sacrificial lamb", "cuddle slut", "good girl", "soft domme"];
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
  showOnlyWithWritings: false,
    locationFilter: ""
});

console.log("Current FiLiSettings (on load):", FiLiSettings);

// Modified CSS Injection - Append to Head directly after a delay
function injectCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .FiLiHidden {
            display: none !important;
        }
        .FiLiNumeric {
            width: 30px;
        }
    `;
    document.head.appendChild(style);
    console.log("CSS injected directly into document.head");
}


function saveData() {
  console.log("saveData() called");
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
    FiLiSettings.locationFilter = document.getElementById("FiLiLocationFilter").value;

  GM_setValue("FiLiSettings", FiLiSettings);
    console.log("FiLiSettings saved:", FiLiSettings);
  location.reload();
}

function filterPage() {
    console.log("filterPage() called with settings:", FiLiSettings);
    let cards = document.querySelectorAll("div.w-full.rounded-sm.bg-gray-900.cursor-pointer.transition");

    console.log("Selected cards:", cards);

    let numHidden = 0;
    for(let i = 0; i < cards.length; i++) {
        let card = cards[i];
        console.log("Processing card:", card);

        let aslElement = card.querySelector("span.text-sm.font-bold.text-gray-300");
        let locationElement = card.querySelector("div.truncate.whitespace-nowrap.text-sm.font-normal.leading-normal.text-gray-300");

        if(aslElement) {
            let aslText = aslElement.innerText;
            console.log("  ASL Element Text:", aslText);

            let regex = new RegExp(/^([0-9]+)([A-Za-z/]+)?( .+)?$/);
            let matches = aslText.match(regex);
            let age = null;
            let gender = "";
            let role = "";

            if (matches) {
                age = Number(matches[1]);
                if(matches[2] !== undefined) {
                    gender = matches[2];
                }
                if(matches[3] !== undefined) {
                    role = matches[3].trim();
                }
                console.log("  Parsed Age:", age, "Gender:", gender, "Role:", role);
            } else {
                console.log("  ASL Regex failed to match!");
            }


            let location = "";
            if (locationElement) {
                location = locationElement.innerText.trim();
                console.log("  Location:", location);
            }


            let hide = false; // *** ORIGINAL FILTERING LOGIC - NOW WITH DEBUGGING ***

            console.log("  --- Filtering Conditions ---"); // Section separator in logs

            console.log("  Age Check: Card Age =", age, ", Min Age =", FiLiSettings.ageMin, ", Max Age =", FiLiSettings.ageMax);
            if(age < Number(FiLiSettings.ageMin)) {
                console.log("  [HIDE] Age too low");
                hide = true;
            } else if(age > Number(FiLiSettings.ageMax)) {
                console.log("  [HIDE] Age too high");
                hide = true;
            }

            console.log("  Gender Check: Card Gender =", gender, ", Allowed Genders =", FiLiSettings.genders, ", Show Null Gender =", FiLiSettings.showNullGender);
            if(gender !== "") {
                if(!FiLiSettings.genders.includes(gender)) {
                    if(!genders.includes(gender)) {
                        console.log("  Unknown gender (" + gender + ")");
                    } else {
                        console.log("  [HIDE] Gender not in allowed list");
                        hide = true;
                    }
                }
            } else {
                if(!FiLiSettings.showNullGender) {
                    console.log("  [HIDE] No gender, and not showing null gender");
                    hide = true;
                }
            }

            console.log("  Role Check: Card Role =", role, ", Allowed Roles =", FiLiSettings.roles, ", Show Null Role =", FiLiSettings.showNullRole);
            if(role !== "") {
                if(!FiLiSettings.roles.includes(role.toLowerCase())) {
                    if(!roles.includes(role.toLowerCase())) {
                        console.log("  Unknown role (" + role + ")");
                    } else {
                        console.log("  [HIDE] Role not in allowed list");
                        hide = true;
                    }
                }
            } else {
                if(!FiLiSettings.showNullRole) {
                    console.log("  [HIDE] No role, and not showing null role");
                    hide = true;
                }
            }


            console.log("  Location Filter Check: Card Location =", location, ", Location Filter =", FiLiSettings.locationFilter);
            if (FiLiSettings.locationFilter) {
                if (!location.toLowerCase().includes(FiLiSettings.locationFilter.toLowerCase())) {
                    console.log("  [HIDE] Location does not match filter");
                    hide = true;
                }
            }


            console.log("  Vids Check: Show Only With Vids =", FiLiSettings.showOnlyWithVids, ", Has Vids Link =", !!card.querySelector("a[href$=videos]"));
            if(FiLiSettings.showOnlyWithVids && !card.querySelector("a[href$=videos]")) {
                console.log("  [HIDE] Show only with vids, but no vids link found");
                hide = true;
            }

            console.log("  Writings Check: Show Only With Writings =", FiLiSettings.showOnlyWithWritings, ", Has Writings Link =", !!card.querySelector("a[href$=posts]"));
            if(FiLiSettings.showOnlyWithWritings && !card.querySelector("a[href$=posts]")) {
                console.log("  [HIDE] Show only with writings, but no writings link found");
                hide = true;
            }

             const hasPicture = card.querySelector("a.link img.ipp:not([src*='missing'])");
            console.log("  Pics Check: Show Only With Pics =", FiLiSettings.showOnlyWithPics, ", Has Picture =", !!hasPicture);
            if(FiLiSettings.showOnlyWithPics && !hasPicture) {
                console.log("  [HIDE] Show only with pics, but no picture found");
                hide = true;
            }


            if(hide) {
                card.classList.add("FiLiHidden");
                numHidden++;
                console.log("  >>> Card HIDDEN (Final Decision)");
            } else {
                console.log("  >>> Card NOT hidden (Final Decision)");
            }
        } else {
            if(card.querySelector(`span[title^="Organization"]`) && FiLiSettings.showOrgs == false) {
                card.classList.add("FiLiHidden");
                numHidden++;
                console.log("  Organization card hidden");
            } else {
                console.log("  Organization card NOT hidden (or shown)");
            }
        }
    }

    if(numHidden > 0) {
        document.getElementById("FiLiNumHidden").innerText = "(" + numHidden + " hidden profiles)";
    } else {
        document.getElementById("FiLiNumHidden").innerText = "";
    }
}


window.setTimeout(function() {
  console.log("Timeout function started");
    injectCSS(); // Inject CSS here, after timeout starts

  let referenceNode = document.querySelector("header.items-end, header.pb-1, header.mb-2");
    if (!referenceNode) {
        console.error("Reference node not found! FilterLife options box cannot be inserted.");
        return;
    }
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

                <b>Location Filter</b><br />
                <input type="text" id="FiLiLocationFilter" value="${FiLiSettings.locationFilter}" placeholder="Enter location keywords" style="width: 100%;"/><br /><small>Filter profiles by location. Only profiles with locations containing this text (case-insensitive) will be shown. Leave empty to disable.</small>
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
    console.log("Initial filterPage() call completed");
}, 3000);
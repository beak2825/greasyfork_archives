// ==UserScript==
// @name        SteamGifts Region Helper
// @namespace   Violentmonkey Scripts
// @match       https://www.steamgifts.com/giveaway/*/region-restrictions*
// @match       https://www.steamgifts.com/giveaways/new
// @grant       none
// @version     1.4.0
// @author      Lex
// @description Assists with setting regions on new giveaways.
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520676/SteamGifts%20Region%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/520676/SteamGifts%20Region%20Helper.meta.js
// ==/UserScript==


function regionRestrictionsPage() {
  const countryCodes = $("p.table__column__heading")
    .map((_, el) => $(el).text())
    .map((_, el) => el.match(/\((\w{2})\)/)?.[1])
    .get()
    .filter(code => code !== null)
    .join(" ");
  const textBox = $("<input>", {
    type: "text", value: countryCodes
  });
  $(".page__heading").first().after(textBox);
}

const inputTextBox = $("<input>", {
  type: "text", style: "margin-bottom: 0.5em",
  placeholder: "Enter regions here like US, GB, CA"
});

function getCountryCodesInput() {
  const inputText = inputTextBox.val().toUpperCase();
  // first try separating by commas OR spaces
  let userCodes = inputText.split(/[\s,]+/).filter(Boolean);
  // but if any token is longer than 2 characters, only separate by commas
  if (userCodes.some(str => str.length > 2)) {
    userCodes = inputText.split(/\s*,\s*/).filter(Boolean);
  }
  const {codes, names} = getSGCountryCodes();

  // try to convert countries to userCodes
  userCodes = userCodes.map((code) => names.get(code) ?? code)

  const invalidCodes = userCodes.filter(code => !codes.has(code));
  if (invalidCodes.length > 0) {
    alert("Some of your input country codes were not found in Steam Gifts!\n"
          + "Please fix this and try again.\nInvalid country codes: "
          + invalidCodes.join(", "));
    return [];
  }
  return userCodes;
}

let _getSGCountryCodes_cache;
function getSGCountryCodes() {
  if (_getSGCountryCodes_cache) return _getSGCountryCodes_cache;
  const codes = new Map();
  const names = new Map();
  $("div[data-input='country_item_string'] > div").each(function(){
    const code = this.dataset.name.slice(-2);
    codes.set(code, $(this));
    const name = this.dataset.name.slice(0, -3);
    names.set(name.toUpperCase(), code)
  })
  _getSGCountryCodes_cache = { codes, names }
  return _getSGCountryCodes_cache;
}

function newGiveawayPage() {
  function addRegions() {
    const sgCodes = getSGCountryCodes().codes;
    getCountryCodesInput().forEach(code => {
      const regionElement = sgCodes.get(code);
      if (!regionElement.hasClass('is-selected'))
        regionElement.click();
    })
  }

  function removeRegions() {
    const sgCodes = getSGCountryCodes().codes;
    getCountryCodesInput().forEach(code => {
      const regionElement = sgCodes.get(code);
      if (regionElement.hasClass('is-selected'))
        regionElement.click();
    })
  }

  const applyButton = $("<button>", {
    type: "button",
    text: "Add Regions",
    style: "border: 1px solid black; padding: 1px 3px; border-radius: 3px"
  }).on("click", addRegions);
  const removeButton = $("<button>", {
    type: "button",
    text: "Remove Regions",
    style: "margin-left: 1.5em; border: 1px solid black; padding: 1px 3px; border-radius: 3px"
  }).on("click", removeRegions);
  const container = $("<div>", {
    style: "display: block; width: 100%; margin-top: 0.5em;",
    class: "is-hidden"
  });
  container.append(inputTextBox, applyButton, removeButton);

  $(".form_list[data-input='country_item_string']").first().after(container);

  // add onclick handlers to the Yes/No buttons
  const checkboxContainer = $("div:has(> input[name=region_restricted])").first();
  const yesBox = checkboxContainer.find("div[data-checkbox-value=1]");
  yesBox.on("click", function() {
    $(this).closest(".form__row").find(".is-hidden").removeClass("is-hidden").addClass("is-shown");
  })
  const noBox = checkboxContainer.find("div[data-checkbox-value=0]");
  noBox.on("click", function() {
    $(this).closest(".form__row").find(".is-shown").removeClass("is-shown").addClass("is-hidden");
  })
}


if (window.location.href.includes("region-restrictions")) {
  regionRestrictionsPage();
} else {
  newGiveawayPage();
}
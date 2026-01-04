// ==UserScript==
// @name         Ranked War Reward Split
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       Daviid-P[2851873]
// @match        https://www.torn.com/war.php?step=rankreport&rankID=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/467642/Ranked%20War%20Reward%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/467642/Ranked%20War%20Reward%20Split.meta.js
// ==/UserScript==

let factionMembers; // Declare factionMembers as a global variable
let totalPoints; // Declare totalPoints as a global variable

(function () {
  "use strict";

  const isElementLoaded = async (selector) => {
    while (document.querySelector(selector) === null) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
    }
    return document.querySelector(selector);
  };

  // Wait for the faction members list to load and then execute the main function
  isElementLoaded("ul.members-list li").then((factions_members_list) => {
    main();
  });
})();

function main() {
  let factions_members_list = document.querySelectorAll("ul.members-list");
  let player_name = document
    .querySelector("script[donator]")
    .getAttribute("name");

  const our_faction_list = Array.from(factions_members_list).find(
    (faction_members_list) =>
      faction_members_list.textContent.includes(player_name)
  );

  const open_dialog_button = createDialogButton(our_faction_list);
  const clearDiv = our_faction_list.parentNode.querySelector("div div.clear");

  // Prepend the button element to the parent of our_faction_list
  if (our_faction_list && our_faction_list.parentNode) {
    our_faction_list.parentNode.insertBefore(
      open_dialog_button,
      our_faction_list
    );
  }

  factionMembers = our_faction_list.querySelectorAll("li");
  totalPoints = Array.from(factionMembers)
    .slice(0, -1)
    .reduce((sum, member) => {
      const memberPoints = parseFloat(
        member.querySelector(".status").textContent
      );
      return sum + memberPoints;
    }, 0);

  const rewardPerAttackHeader = createRewardHeader("1m x Hit");
  const rewardPercentageHeader = createRewardHeader("80/20");

  // Insert column headers before the "clear" div
  clearDiv.parentNode.insertBefore(rewardPerAttackHeader, clearDiv);
  clearDiv.parentNode.insertBefore(rewardPercentageHeader, clearDiv);

  // Initial update of rewards with default values
  updateRewards(0, 0.8, 1000000);
}

// Function to create the open dialog button
function createDialogButton(our_faction_list) {
  const open_dialog_button = document.createElement("button");
  open_dialog_button.textContent = "Open Dialog";
  open_dialog_button.className = "btn btn-primary"; // Add class names
  open_dialog_button.addEventListener("click", () => {
    createDialog();
  });
  return open_dialog_button;
}

// Function to create a column header element
function createRewardHeader(text) {
  const rewardHeader = document.createElement("div");
  rewardHeader.textContent = text;
  rewardHeader.className = "reward-header left";
  rewardHeader.style = "width: 70px; margin-right: 10px;";
  return rewardHeader;
}

// Function to create the dialog element
function createDialog() {
  const dialog = document.createElement("dialog");
  dialog.style.display = "flex";
  dialog.style.flexDirection = "column";
  dialog.style.width = "200px";
  dialog.style.height = "200px";
  dialog.style.justifyContent = "space-around";

  const cacheSellingPriceInputContainer = createNumberInput(
    "Enter reward amount",
    "Reward Amount"
  );
  const rewardDistributionSliderContainer = createSliderInput(
    0,
    100,
    1,
    80,
    "Reward Distribution"
  );
  const pricePerHitInputContainer = createNumberInput(
    "Enter price per hit",
    "Price per Hit"
  );

  const updateButton = document.createElement("button");
  updateButton.textContent = "Update Rewards";
  updateButton.className = "btn btn-primary"; // Add class names
  updateButton.addEventListener("click", () => {
    const cacheSellingPriceInput =
      cacheSellingPriceInputContainer.querySelector("input");
    const rewardDistributionSlider =
      rewardDistributionSliderContainer.querySelector("input");
    const pricePerHitInput = pricePerHitInputContainer.querySelector("input");

      console.error(cacheSellingPriceInput.value)
      console.error(parseLocaleNumber(cacheSellingPriceInput.value))
    const cacheSellingPrice = parseFloat(parseLocaleNumber(cacheSellingPriceInput.value));
    const rewardDistribution = parseFloat(parseLocaleNumber(rewardDistributionSlider.value)) / 100;
    const pricePerHit = parseFloat(parseLocaleNumber(pricePerHitInput.value));
    console.error(
      cacheSellingPrice,
      rewardDistribution,
      pricePerHit
    );

    updateRewards(cacheSellingPrice, rewardDistribution, pricePerHit);

    // Close the dialog after updating the rewards
    dialog.close();
  });

  dialog.appendChild(cacheSellingPriceInputContainer);
  dialog.appendChild(rewardDistributionSliderContainer);
  dialog.appendChild(pricePerHitInputContainer);
  dialog.appendChild(updateButton);

  document.body.appendChild(dialog);
  dialog.showModal();
}

// Function to create a number input element with a label
// Function to create a number input element with a label
function createNumberInput(placeholder, label) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.marginBottom = "10px";

  const labelText = document.createElement("label");
  labelText.textContent = label;

  const numberInput = document.createElement("input");
  numberInput.placeholder = placeholder;
  numberInput.style.padding = "5px";
  numberInput.style.fontSize = "14px";
  numberInput.style.border = "1px solid #ccc";
  numberInput.pattern = "^d{1,3}(,d{3})*(.d+)?$";
  numberInput.dataset.type = "currency";
  numberInput.placeholder = "1,000,000";

  // Add event listeners for formatting the input value with thousands separators
  numberInput.addEventListener("input", formatCurrency);

  container.appendChild(labelText);
  container.appendChild(numberInput);

  return container;
}

// Function to create a slider input element with a label
function createSliderInput(min, max, step, value, label) {
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.marginBottom = "10px";

  const labelText = document.createElement("label");
  labelText.textContent = label;

  const sliderContainer = document.createElement("div");
  sliderContainer.style.display = "flex";
  sliderContainer.style.alignItems = "center";

  const sliderInput = document.createElement("input");
  sliderInput.type = "range";
  sliderInput.min = min.toString();
  sliderInput.max = max.toString();
  sliderInput.step = step.toString();
  sliderInput.value = value.toString();
  sliderInput.style.flexGrow = "1";

  const valueSpan = document.createElement("span");
  valueSpan.textContent = value.toString();
  valueSpan.style.marginLeft = "10px";

  sliderInput.addEventListener("input", () => {
    valueSpan.textContent = sliderInput.value;
  });

  sliderContainer.appendChild(sliderInput);
  sliderContainer.appendChild(valueSpan);

  container.appendChild(labelText);
  container.appendChild(sliderContainer);

  return container;
}

// Function to update rewards based on the cache selling price, reward distribution, and price per hit
function updateRewards(cacheSellingPrice, rewardDistribution, pricePerHit) {
      const rewardPerAttackHeader = document.querySelector(".reward-header.left");
  const rewardPercentageHeader = document.querySelector(".reward-header.left + .reward-header");

  rewardPerAttackHeader.textContent = `${formatNumberShort(pricePerHit)} x Hit`;
  rewardPercentageHeader.textContent = `${(rewardDistribution * 100).toFixed(0)}/${100-(rewardDistribution * 100).toFixed(0)}`;

  const membersToIterate = Array.from(factionMembers).slice(0, -1);
  membersToIterate.forEach((member) => {
    let clearDiv = member.querySelector("div.clear");
    const memberAttacks = parseFloat(
      member.querySelector(".points").textContent
    );
    const memberPoints = parseFloat(
      member.querySelector(".status").textContent
    );
    const memberId = new URLSearchParams(document.querySelector("div.member a").href).get("ID");

    let rewardPerAttack = member.querySelector(".reward-per-attack");
    let rewardPercentage = member.querySelector(".reward-percentage");

    if (!rewardPerAttack) {
      rewardPerAttack = document.createElement("div");
      rewardPerAttack.className = "reward-per-attack left";
      rewardPerAttack.style =
        "width: 70px; height: 33px; line-height: 36px; text-align: right; padding-right: 10px; margin-right: 10px;";
      member.insertBefore(rewardPerAttack, clearDiv);
    }

    if (!rewardPercentage) {
      rewardPercentage = document.createElement("div");
      rewardPercentage.className = "reward-percentage left";
      rewardPercentage.style =
        "width: 70px; height: 33px; line-height: 36px; text-align: right; padding-right: 10px; margin-right: 10px;";
      member.insertBefore(rewardPercentage, clearDiv);
    }

    const textSpan = document.createElement("span");

    while (rewardPerAttack.firstChild) {
      rewardPerAttack.removeChild(rewardPerAttack.firstChild);
    }
    while (rewardPercentage.firstChild) {
      rewardPercentage.removeChild(rewardPercentage.firstChild);
    }

    const attacks = memberAttacks * pricePerHit;
    rewardPerAttack.textContent = attacks;
    rewardPerAttack.innerHTML = `<a href="https://www.torn.com/factions.php?step=your#/tab=controls&option=pay-day&select=${memberId}&pay=${attacks}">${attacks.toLocaleString()}</a>`;

    const reward = Math.floor(
      (memberPoints / totalPoints) * (cacheSellingPrice * rewardDistribution)
    );
    rewardPercentage.innerHTML = `<a href="https://www.torn.com/factions.php?step=your#/tab=controls&option=pay-day&select=${memberId}&pay=${reward}">${reward.toLocaleString()}</a>`;
  });
}

function parseLocaleNumber(stringNumber) {
  var thousandSeparator = Intl.NumberFormat("en-EN")
    .format(11111)
    .replace(/\p{Number}/gu, "");
  var decimalSeparator = Intl.NumberFormat("en-EN")
    .format(1.1)
    .replace(/\p{Number}/gu, "");

  return parseFloat(
    stringNumber
      .replace(new RegExp("\\" + thousandSeparator, "g"), "")
      .replace(new RegExp("\\" + decimalSeparator), ".")
  );
}

function formatNumber(n) {
  // format number 1000000 to 1,234,567
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatNumberShort(number) {
const suffixes = ["", "k", "m", "b", "t"];
let suffixIndex = 0;
while (number >= 1000 && suffixIndex < suffixes.length - 1) {
number /= 1000;
suffixIndex++;
}
return number.toLocaleString() + suffixes[suffixIndex];
}

function formatCurrency(event) {
  // appends $ to value, validates decimal side
  // and puts cursor back in right position.

  let input = event.target;
  let blur = event.type;

  // get input value
  var input_val = input.value;

  // dont validate empty input
  if (input_val === "") {
    return;
  }

  // original length
  var original_len = input_val.length;

  // initial caret position
  var caret_pos = input.selectionStart;

  // check for decimal
  if (input_val.indexOf(".") >= 0) {
    // get position of first decimal
    // this prevents multiple decimals from
    // being entered
    var decimal_pos = input_val.indexOf(".");

    // split number by decimal point
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);

    // add commas to left side of number
    left_side = formatNumber(left_side);

    // validate right side
    right_side = formatNumber(right_side);

    // On blur make sure 2 numbers after decimal
    if (blur === "blur") {
      right_side += "00";
    }

    // Limit decimal to only 2 digits
    right_side = right_side.substring(0, 2);

    // join number by .
    input_val = left_side + "." + right_side;
  } else {
    // no decimal entered
    // add commas to number
    // remove all non-digits
    input_val = formatNumber(input_val);
    input_val = input_val;

    // final formatting
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  // send updated string to input
  input.value = input_val;

  // put caret back in the right position
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input.setSelectionRange(caret_pos, caret_pos);
}

function addCustomCSS(css) {
  const styleElement = document.createElement("style");
  styleElement.textContent = css;

  const headElement = document.querySelector("head");
  headElement.appendChild(styleElement);
}

// CSS styles
const customCSS = `
  .btn {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }

  .reward-per-attack a,
  .reward-percentage a{
    text-decoration: none;
    color: inherit;
  }
`;

// Add custom CSS to the document
addCustomCSS(customCSS);

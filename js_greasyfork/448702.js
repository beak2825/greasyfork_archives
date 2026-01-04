// ==UserScript==
// @name         Add Cards on Quizlet
// @namespace    https://greasyfork.org/en/scripts/448702-automatically-add-cards-on-quizlet
// @version      1.5.0
// @description  Uses a button to add multiple cards at once on Quizlet, instead of having to click the add button for each card individually.
// @author       Andriani Perez
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none

// Chrome extension: https://chromewebstore.google.com/detail/multi-card-add-for-quizle/kjcpipbleckofommimigmbehkmpjdahg
// @downloadURL https://update.greasyfork.org/scripts/448702/Add%20Cards%20on%20Quizlet.user.js
// @updateURL https://update.greasyfork.org/scripts/448702/Add%20Cards%20on%20Quizlet.meta.js
// ==/UserScript==

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function updateAddCardButton(className, index) {
  let addcard = document.querySelector(
    `div.${className} [data-term-luid="${index}"]`
  );
  return addcard;
}

// List of studiable items are all the flash cards and appending makes it go to the very end of that list
function getStudiableItems() {
  let studiableItems = document.querySelector("div.StudiableItems");
  console.log(studiableItems);
  return studiableItems;
}

function AddCardsElement(endOfStudiableItems) {
  // Create button
  var multiAddContainer = document.createElement("div");
  //Give class to match other cards styling
  multiAddContainer.className =
    "TermContent-inner AssemblyButtonBase--xlarge AssemblyButtonBase--padding ";
  multiAddContainer.style =
    "margin-top: 1rem; margin-bottmom: 4rem; display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 1rem; cursor: default; height: 5rem;";
  endOfStudiableItems.appendChild(multiAddContainer);

  // Button/Label
  var multiAddButton = document.createElement("label");
  multiAddButton.innerText = "+ Multi-Add Cards";
  multiAddButton.className = "UILinkButton";
  multiAddButton.draggable = false;
  multiAddButton.id = "multiAddButton";

  multiAddContainer.appendChild(multiAddButton);
  // INPUT
  var multiAddInput = document.createElement("input");
  multiAddInput.className =
    "RichTextEditor ProseMirror PMEditor lang-en ugck83a notranslate pc1cm7j";
  multiAddInput.id = "multiAddInput";
  multiAddInput.style =
    "border: none; background:transparent; border-bottom: 0.275rem solid white; justify-content:center; outline: none; height: 2.25rem;";

  multiAddInput.placeholder = "# of cards to add";
  // Create a style element
  var style = document.createElement("style");

  // Define the CSS rule for the placeholder
  var placeholderStyles = `
  #multiAddInput::placeholder {
    color: grey; /* Example: Change the color */
    opacity: 0.7
    font-style: italic; /* Example: Make it italic */
    /* Add any other desired styles here */
    ;
  }
  #multi
`;
  document.head.appendChild(style);

  // Append the CSS rule to the style element
  style.appendChild(document.createTextNode(placeholderStyles));

  // Append the style element to the head of the document
  multiAddContainer.appendChild(multiAddInput);

  return multiAddButton;
}

function getMultiAddButton() {
  return document.getElementById("multiAddButton");
}

function getMultiInputvalue(getElementById) {
  let multiAddInput = document.getElementById(getElementById);
  return multiAddInput.value;
}
function addRow() {
  return document.getElementById("addRow");
}

window.onload = function () {
  let endOfStudiableItems = getStudiableItems();
  AddCardsElement(endOfStudiableItems);
  let multiAddButton = getMultiAddButton();
  multiAddButton.addEventListener("click", async function () {
    let numberOfCardsRequested = getMultiInputvalue("multiAddInput");
    for (var i = 0; i < numberOfCardsRequested; i++) {
      addRow().click();
      await sleep(1);
    }
  });
};

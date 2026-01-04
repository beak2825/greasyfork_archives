// ==UserScript==
// @name         Auto Box-Mod AFK.
// @namespace    here lol
// @version      0.2.5
// @description  Major bug fixes - Automatic Box Mod AFK.
// @author       sdoma/Ana
// @match        https://cubecollector.net/*
// @icon         https://cdn.discordapp.com/avatars/701566435423682582/7b107414960928a92922425b1b8d206e.png?size=1024
// @grant        none
// @license      Attribution
// @downloadURL https://update.greasyfork.org/scripts/461672/Auto%20Box-Mod%20AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/461672/Auto%20Box-Mod%20AFK.meta.js
// ==/UserScript==

// Create the button element and get the script started WOOOOOOO
const button = document.createElement('button');
button.id = 'toggle-btn';
button.innerHTML = 'OwO - OFF (Ctrl+Click)'; // Why did I have the placeholder text be OwO? I don't know. Stop asking questions. Loser.
button.style.position = 'fixed';
button.style.top = '10px';
button.style.borderRadius = '10px';
button.style.left = '10px';
button.style.width = '200px';
button.style.height = '30px';
button.style.fontSize = '16px';
button.style.color = 'var(--accentcolor)';
button.style.backgroundColor = 'var(--backgroundcolor)';
button.style.border = '1px solid #000';
button.style.cursor = 'pointer';
button.style.zIndex = '999999';

const uiContainer = document.createElement('div');
uiContainer.id = 'ui-container';
uiContainer.style.position = 'fixed';
uiContainer.style.top = '50px';
uiContainer.style.left = '-200px';
uiContainer.style.width = '200px';
uiContainer.style.height = '250px';
uiContainer.style.backgroundColor = 'var(--backgroundcolor)';
uiContainer.style.color = '#fff';
uiContainer.style.borderRadius = '20px';
uiContainer.style.border = '1px solid #000';
uiContainer.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.3)';
uiContainer.style.transition = 'left 0.3s ease-out';
uiContainer.style.zIndex = '999999';

// Add the UI elements to the container, more fucking awful CSS. I should have listened to aspect about vue :(
const title = document.createElement('h2');
title.innerHTML = '-- SETTINGS --';
title.style.fontSize = '24px';
title.style.marginTop = '10px';
title.style.color = '#fff';
title.style.marginLeft = '22.5px';

uiContainer.appendChild(title);


// Create an array of settings with their respective names. Don't know why I didn't do this earlier.
const settings = [
  { name: 'Exotic', value: 0, id: 'Exot' },
  { name: 'Divnes', value: 0, id: 'Divn' },
  { name: 'Stacked', value: 0, id: 'SPre' },
  { name: 'Prefix', value: 0, id: 'Pref' },
  { name: 'Unboxed', value: 0, id: 'Unbx' }
];

// Stupid fucking styling
function createSettingElement(setting) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.justifyContent = 'space-around';
  container.style.alignItems = 'center';
  container.style.margin = '10px';

  const label = document.createElement('span');
  label.innerHTML = setting.name;
  label.style.marginRight = '20px';
  label.style.width = '80px';
  label.style.color = 'var(--accentcolor)';

  const upBtn = document.createElement('button');
  upBtn.innerHTML = '+';
  upBtn.style.width = '25px';
  upBtn.style.height = '25px';
  upBtn.style.borderRadius = '50%';
  upBtn.style.backgroundColor = 'rgb(44, 44, 44)';
  upBtn.style.color = '#fff';
  upBtn.style.border = '1px solid #000';
  upBtn.style.cursor = 'pointer';
  upBtn.style.outline = 'none';

  const downBtn = document.createElement('button');
  downBtn.innerHTML = '-';
  downBtn.style.width = '25px';
  downBtn.style.height = '25px';
  downBtn.style.borderRadius = '50%';
  downBtn.style.backgroundColor = 'rgb(44, 44, 44)';
  downBtn.style.color = '#fff';
  downBtn.style.border = '1px solid #000';
  downBtn.style.cursor = 'pointer';
  downBtn.style.outline = 'none';

  const value = document.createElement('span');
  value.innerHTML = setting.value;
  value.style.color = '#fff';
  value.id = setting.id;
  value.style.paddingLeft = '3px';
  value.style.paddingRight = '3px';

  container.appendChild(label);
  container.appendChild(downBtn);
  container.appendChild(value);
  container.appendChild(upBtn);

  // Add click event listener to the up button, add value!!!!!!!!!
  upBtn.addEventListener('click', () => {
    if (setting.value < 30) {
      setting.value++;
      value.innerHTML = setting.value;
    }
  });

  // Add click event listener to the down button, sub value!!!!!
  downBtn.addEventListener('click', () => {
    if (setting.value > 0) {
      setting.value--;
      value.innerHTML = setting.value;
    }
  });

  return container;
}

// Create a container for the settings, then foreach them right in there all tight and good.. mmgh.
const settingsContainer = document.createElement('div');
settingsContainer.style.margin = '10px';


settings.forEach(setting => {
  const settingElement = createSettingElement(setting);
  settingsContainer.appendChild(settingElement);
});

uiContainer.appendChild(settingsContainer);

// Add the button and UI container to the document body, append in correct order
document.body.appendChild(button);
document.body.appendChild(uiContainer);

var toggled = false;

// I fell asleep here while working on this and forgot what I was going to do
// But i got the script working, so i guess it doesn't matter

function clickElement(args) {
  console.log(`function called. F: clickElement(${args.length} args)`);
  console.log(args);
  args.forEach((arg) => {
    const { target, times } = arg;
    for (let i = 0; i < times; i++) {
      setTimeout(() => {
        try{
          eval(opts[target]).click();
        } catch(e) {
          console.warn("You're more than likely broke. || " + e);
        }
        console.log(`Clicking ${eval(opts[target])}`);
        // debugged this for probably 45 min plus, I dont know why. Im fucking retarded
      }, 50);
    }
  });
}

// Define the options dictionary, so we can use this stupid shit. I cant wait for the AWFUL FUCKING CSS CLASS CHNANGES. THANKS FUCKSPECT.
var opts = {
  "boxA": 'document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent > div:nth-child(5) > div.pbmmibar > div:nth-child(4)")',
  "prefixC": 'document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent > div:nth-child(4) > div.pbmmibar > div:nth-child(4)")',
  "SprefixC": 'document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent > div:nth-child(3) > div.pbmmibar > div:nth-child(4)")',
  "divineC": 'document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent > div:nth-child(2) > div.pbmmibar > div:nth-child(4)")',
  "exoticC": 'document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent > div:nth-child(1) > div.pbmmibar > div:nth-child(4)")'
};

var brokelol = false; // This'll dictate whether or not its stopped due to balance

// Define the anything function. Lack of better name. Don't judge me, nerd.
function anything() {
  console.log(`function called. F: Anything()`)
  // Open the menu logic, some shit I forgot how to do

  // Get values goin
  let EXV = parseInt(document.getElementById('Exot').innerText);
  let DVV = parseInt(document.getElementById('Divn').innerText);
  let SPV = parseInt(document.getElementById('SPre').innerText);
  let PFV = parseInt(document.getElementById('Pref').innerText);
  let UBV = parseInt(document.getElementById('Unbx').innerText);

  let args = [
    { target: 'boxA', times: UBV },
    { target: 'prefixC', times: PFV },
    { target: 'SprefixC', times: SPV },
    { target: 'prefixC', times: PFV },
    { target: 'exoticC', times: EXV },
    { target: 'divineC', times: DVV }
  ];

  if (UBV == 0 && PFV == 0 && SPV == 0 && PFV == 0 && EXV == 0 && DVV == 0) { console.warn("Not buying anything. Passing.."); return; }

  if (!document.getElementsByClassName('purchasemodbutton graybutton')[0]) { console.log("Skipping, menu is open or you have already bought mods."); return; }
  document.getElementsByClassName('purchasemodbutton graybutton')[0].click();

  clickElement(args);

  // Confirm and close the menu, assuming they're able to buy
  setTimeout(function () {
    if (document.getElementsByClassName('purchaseboxmodsconfirm orangebutton')[0]) {
      document.getElementsByClassName('purchaseboxmodsconfirm orangebutton')[0].click();
    } else {
      console.warn("Button didn't show up. Guess you're too fuckin broke in tally creds.");
      // document.getElementById('closeiteminspectoverlaybutton').click(); // Edit: ''''fixed''''. Aspect sucks ass, so its a workaround.
      document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodstitle").innerHTML = `You're too <b>broke<b>, so it stopped buying.`
      if (brokelol) { return };
      document.querySelector("#chancesoverlay > div.centerme.boxmodbuyercontainer > div.purchaseboxmodscontent").remove();
      brokelol = true;
    }
  }, 250);
}

// Toggle variables and other random shit that I should have added earlier
var toggled = false;
var autoD;
var began = false;
var delay = 5000;


// Add click event listener to the button. Literally just the element 'button'
button.addEventListener('click', (e) => {
  if (e.ctrlKey) {
    console.log('Ctrl+click detected on OwO button');

    if (!began) {
      if (document.getElementsByClassName('fuchsiabutton')[0] && (document.getElementsByClassName('fuchsiabutton')[0].innerText === "AFK This Box")) {
        // correct page, do the thing
        console.log("Correct page! AFK button found.");
        began = true;
        document.getElementsByClassName('fuchsiabutton')[0].click();
      } else if (document.getElementsByClassName('fuchsiabutton')[0] && document.getElementsByClassName('fuchsiabutton')[0].innerText == "Save AFK Options") {
        console.warn("Correct page, but user is already AFKing. Bad practice.");
        began = true;
      } else {
        console.warn("You are not on the right page! There is no AFK button. Don't try to toggle this, cunt!");
        document.getElementById('toggle-btn').innerText = 'OwO - OFF (Ctrl+Click)'
        toggled = false;
        return;
      }
    }

    if (toggled) {
      toggled = false;
      clearInterval(autoD);
      console.log("Toggling OFF!")
      document.getElementById('toggle-btn').innerText = 'OwO - OFF (Ctrl+Click)'
      began = false;
    } else {
      autoD = setInterval(anything, delay);
      toggled = true;
      console.log("Toggling ON!")
      document.getElementById('toggle-btn').innerText = 'OwO - ON (Ctrl+Click)'
    }

  } else {
    uiContainer.style.left = uiContainer.style.left === '-200px' ? '10px' : '-200px';
  }
});


// visual fun stuff down below
button.addEventListener("mouseenter", function () {
  Object.assign(button.style, buttonHoverStyle);
});

// Add event listener for hover effect
button.addEventListener("mouseleave", function () {
  Object.assign(button.style, buttonStyle);
});
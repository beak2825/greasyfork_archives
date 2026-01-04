// ==UserScript==
// @name        [GC][Backup] - Underwater Map Prizes (Discord Webhook)
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/games/treasurehunt/redeemmap*
// @match       https://www.grundos.cafe/games/treasurehunt/?type=underwater
// @license     MIT
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @version     1.1
// @author      Cupkait
// @require     https://update.greasyfork.org/scripts/485703/1319674/%5BGC%5D%20-%20Map%20Prizes%20Helper.js

// @description Userscript that allows you to send your Underwater Map prize results to Discord 
// @description via a webhook. Multiple webhooks are supported.
// @downloadURL https://update.greasyfork.org/scripts/547297/%5BGC%5D%5BBackup%5D%20-%20Underwater%20Map%20Prizes%20%28Discord%20Webhook%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547297/%5BGC%5D%5BBackup%5D%20-%20Underwater%20Map%20Prizes%20%28Discord%20Webhook%29.meta.js
// ==/UserScript==

// It is not recommended to change the WebHook values below. Instead, click the 
// menu item that shows up below this script to have it added in the right place!
const webHooks = GM_getValue("webHooks", []);

GM_registerMenuCommand("Add Webhook", () => {
  var newWebhook = prompt("Paste one webhook URL to add to your script.\n\nIf you want to add multiple, do the one at a time.");
  if (newWebhook) {
    webHooks.push(newWebhook);
    GM_setValue("webHooks", webHooks);
  }
});

const userNameMatch = /user=(.*?)"/g.exec(document.body.innerHTML);
const userName = userNameMatch ? userNameMatch[1] : "A Lucky Neopian";

const itemInfo = getItemsArray();
const prizeImages = $("div.center img");
const imageInfo = prizeImages
  .map(function () {
    const fileName = new URL($(this).attr("src")).pathname.split("/").pop();
    const correspondingItem = itemInfo.find(
      (item) => item.fileName.toLowerCase() === fileName.toLowerCase()
    );
    return correspondingItem
      ? {
          fileName,
          fullImgUrl: correspondingItem.fullImgUrl,
          itemName: correspondingItem.itemName,
          itemTag: correspondingItem.itemTag,
        }
      : null;
  })
  .get();
  

const filteredImageInfo = imageInfo.filter((item) => item !== null);
const aquaticFoodCount = filteredImageInfo.filter(
  (item) => item.itemTag && item.itemTag.toLowerCase() === "aquaticfood"
).length;
const relicPrize = filteredImageInfo.find(
  (item) => item.itemTag && item.itemTag.toLowerCase() === "relic"
);
const relicName = relicPrize ? relicPrize.itemName : null;

const specialItem = filteredImageInfo.find(
  (item) => item.itemTag && item.itemTag.toLowerCase() === "special"
);
const brushItem = filteredImageInfo.find(
  (item) => item.itemTag && item.itemTag.toLowerCase() === "paintbrush"
);

const specialItemName = specialItem ? specialItem.itemName : null;
const specialItemImage = specialItem ? specialItem.fullImgUrl : null;
const brushItemName = brushItem ? brushItem.itemName : null;
const brushItemImage = brushItem ? brushItem.fullImgUrl : null;

const pointsNumber = parseInt(
  $("div.center p").eq(2).text().replace(/\D/g, ""),
  10
);

const colorMapping = {
  "Flask of Rainbow Fountain Water": "9295088",
  "Mysterious Swirly Potion": "16671195",
  "Irritable Genie-in-a-Bottle": "40341",
};

const barColor = colorMapping[specialItemName] || "#FFFFFF"; // Default to white if not found

console.log(barColor);

const brushfalseParams = {
  username: "Underwater Map Prize Tracker",
  embeds: [
    {
      title: `${userName} just gambled on an Underwater Map!`,
      description: `They received ${aquaticFoodCount} random Aquatic foods, a ${relicName}, and a ${specialItemName}!`,
      color: barColor,
      footer: {
        text: `... and they're ${pointsNumber.toLocaleString()} neopoints richer!`,
      },
      thumbnail: {
        url: specialItemImage,
      },
    },
  ],
};

const brushtrueParams = {
  username: "Underwater Map Prize Tracker",
  embeds: [
    {
      title: `${userName} just gambled on an Underwater Map!`,
      description: `They received a ${brushItemName}, a ${specialItemName}, a ${relicName}, and ${aquaticFoodCount} random Aquatic Foods!`,
      color: barColor,
      footer: {
        text: `... and they're ${pointsNumber.toLocaleString()} neopoints richer!`,
      },
      thumbnail: {
        url: brushItemImage,
      },
    },
  ],
};

webHooks.forEach((webHook) => {
  if (aquaticFoodCount === 6) {
    sendMessage(brushtrueParams, webHook);
  } else if (aquaticFoodCount === 7) {
    sendMessage(brushfalseParams, webHook);
  } else {
    console.log("Map home page, not turned in.");
  }
});

function sendMessage(params, webhook) {
  console.log("Webhook triggered.");

  const request = new XMLHttpRequest();
  request.open("POST", webhook);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(params));
}

function addWebhook() {
  var newWebhook = prompt(
    "Paste one webhook URL to add to your script.\n\nIf you want to add multiple, do one at a time."
  );
  if (newWebhook) {
    var webHooks = GM_getValue("webHooks", []);
    webHooks.push(newWebhook);
    GM_setValue("webHooks", webHooks);
  }
}
if (
  window.location.href ===
  "https://www.grundos.cafe/games/treasurehunt/?type=underwater"
) {
  const buttonArea = document.querySelector(".text-center");
  const buttonWrapper = document.createElement("div"); // Create a new div element
  var addButton = document.createElement("button");
  addButton.style.height = "35px"
  addButton.style.backgroundColor = "Navy"
  addButton.style.color = "White"
  addButton.textContent = "Add a webhook URL for Underwater Map Logging";
  addButton.addEventListener("click", addWebhook);
  buttonWrapper.appendChild(addButton); // Append the button to the div
  buttonArea.appendChild(buttonWrapper); // Append the div to the buttonArea
}




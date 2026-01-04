// ==UserScript==
// @name        osu mirror download thingy
// @namespace   https://osu.ppy.sh/users/11221442
// @match       https://osu.ppy.sh/*
// @grant       GM_getValue
// @grant       GM_setValue
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @version     1.1
// @author      Actiol
// @license     MIT
// @description lets everyone (also without account) download osumaps from mirrors directly on the beatmap page
// @downloadURL https://update.greasyfork.org/scripts/461200/osu%20mirror%20download%20thingy.user.js
// @updateURL https://update.greasyfork.org/scripts/461200/osu%20mirror%20download%20thingy.meta.js
// ==/UserScript==

//you can configure the colours yourself here idc

defaultTxtColour = GM_getValue("txtcolour", "#000000");
defaultBgColour = GM_getValue("bgcolour", "#f1a4af");

const button = document.createElement("button");
button.id = "violetmonkey-dropdown";
button.style.zIndex = 9999;
button.style.position = "fixed";
button.style.top = "0";
button.style.left = "0";
button.style.width = "117.2px";
button.style.height = "40px";
button.style.backgroundColor = defaultBgColour;
button.style.color = defaultTxtColour;
button.style.textAlign = "center";
button.style.lineHeight = "30px";
button.style.cursor = "pointer";
button.textContent = "Downloads";
button.style.display = "none";
document.body.appendChild(button);

// create the dropdown menu
const dropdown = document.createElement("div");
dropdown.style.position = "fixed";
dropdown.style.top = button.offsetHeight + "px";
dropdown.style.left = "0";
dropdown.style.zIndex = "9999";
dropdown.style.display = "none";
document.body.appendChild(dropdown);

// create the dropdown options
const optionNames = ["BeatConnect", "Sayobot", "NeriNyan", "Chimu.moe", "[Settings]"];
for (let i = 0; i < optionNames.length; i++) {
  const option = document.createElement("div");
  option.textContent = optionNames[i];
  option.style.padding = "10px";
  option.style.backgroundColor = "#0";
  option.style.borderBottom = "1px solid #000000";
  option.style.cursor = "pointer";
  if (i == 4) { option.style.color = "#888777" }
  dropdown.appendChild(option);

  // add the click event listener to each option
  option.addEventListener("click", function (event) {
    cURL = window.location.href;
    cURL = cURL.substring(31);
    end = cURL.indexOf("#");
    bmID = cURL.substring(0, end);

    switch (event.target.textContent) {
      case "BeatConnect":
        link = "https://beatconnect.io/b/" + bmID;
        break;

      case "Sayobot":
        link = "https://dl.sayobot.cn/beatmaps/download/full/" + bmID;
        break;

      case "NeriNyan":
        link = "https://api.nerinyan.moe/d/" + bmID;
        break;

      case "Chimu.moe":
        link = "https://api.chimu.moe/v1/download/" + bmID + "?n=1";
        break;

      case "[Settings]":
        link = "https://osu.ppy.sh/This_Is_The_Worst_Implementation_Of_A_Settings_Page_Imaginable";
        break;
    }

    window.open(link);

  });
}

// add the click event listener to show/hide the dropdown menu
let isDropdownVisible = false;
button.addEventListener("click", function () {
  if (isDropdownVisible) {
    dropdown.style.display = "none";
    isDropdownVisible = false;
  } else {
    dropdown.style.top = button.offsetHeight + "px";
    dropdown.style.display = "block";
    isDropdownVisible = true;
  }
});

window.onload = function () {
  if (window.location.href.includes("https://osu.ppy.sh/beatmapsets/")) {
    button.style.display = "inline";
  }
  else {
    button.style.display = "none";
    if (window.location.href == ("https://osu.ppy.sh/This_Is_The_Worst_Implementation_Of_A_Settings_Page_Imaginable")) {

      // Create the first textbox
      const textBox1 = document.createElement("input");
      textBox1.type = "text";
      textBox1.id = "textBox1";
      textBox1.style.position = "fixed";
      textBox1.style.top = "10px";
      textBox1.style.left = "10px";
      textBox1.style.zIndex = 9999;
      textBox1.style.color = "#000000";
      textBox1.placeholder = "Text Colour HEX";
      document.body.appendChild(textBox1);

      // Create the second textbox
      const textBox2 = document.createElement("input");
      textBox2.type = "text";
      textBox2.id = "textBox2";
      textBox2.style.position = "fixed";
      textBox2.style.top = "50px";
      textBox2.style.left = "10px";
      textBox2.style.zIndex = 9999;
      textBox2.style.color = "#000000";
      textBox2.placeholder = "Background Colour HEX";
      document.body.appendChild(textBox2);

      // Create the apply button
      const applyButton = document.createElement("button");
      applyButton.textContent = "Apply";
      applyButton.style.position = "fixed";
      applyButton.style.top = "90px";
      applyButton.style.left = "10px";
      applyButton.style.zIndex = 9999;
      applyButton.style.color = "#000000";
      document.body.appendChild(applyButton);

      applyButton.addEventListener("click", function () {
        const value1 = textBox1.value;
        const value2 = textBox2.value;

        if (value1.length == 6) { value1 = "#" + value1 }
        if (value2.length == 6) { value2 = "#" + value2 }

        GM_setValue("txtcolour", value1);
        GM_setValue("bgcolour", value2);
      });


    };

  }
}


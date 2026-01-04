// ==UserScript==
// @name         Wasteof Plugins
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  It's like vendetta but not for Discord, for wasteof, and it doesn't have themes or over a hundred plugins or is the cutest client mod for wasteof, and is basically nothing like vendetta
// @author       MrOwlsss
// @match        https://wasteof.money/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502531/Wasteof%20Plugins.user.js
// @updateURL https://update.greasyfork.org/scripts/502531/Wasteof%20Plugins.meta.js
// ==/UserScript==

(function() {
    "dont use strict, idiot";
const pink = "#ec4899";
const purple = "#8b5cf6";
const violet = "#8b5cf6";
const green = "#22c55e";
const blue = "#3b82f6"; // yes, default blue and theme-blue are different colors
const red = "#ef4444";
const orange = "#f97316";
if (localStorage.getItem("womplugins-ele") == null) {
  localStorage.setItem("womplugins-ele", "enabled")
}
function createSettingModule(id) {
  const settingsElement = document.createElement("div");
  const footer = document.getElementById("footer");
  settingsElement.classList.add("bg-gray-100");
  settingsElement.classList.add("dark:bg-gray-800");
  settingsElement.classList.add("p-4");
  settingsElement.classList.add("rounded-xl");
  settingsElement.classList.add("my-2");
  settingsElement.id = id;
  document.getElementsByTagName("main")[0].insertBefore(settingsElement, footer);
  return settingsElement
}
function addHeaderNode(id, content) {
  const settingsElement = document.getElementById(id);
  const header = document.createElement("h2");
  header.classList.add("font-bold");
  header.classList.add("text-2xl");
  header.classList.add("mb-2");
  header.innerHTML = content;
  settingsElement.appendChild(header);
  return settingsElement
}
function addTextNode(id, content) {
  const settingsElement = document.getElementById(id);
  const header = document.createElement("p");
  header.innerHTML = content;
  settingsElement.appendChild(header);
  return settingsElement
}
function addButtonNode(id, content, colorOrID, color) {
  const settingsElement = document.getElementById(id);
  const button = document.createElement("button");
  button.classList.add("bg-primary-500", "text-white", "block", "mt-2", "text-center", "font-bold", "p-2", "h-10", "rounded-lg", "cursor-pointer")
  button.innerHTML = content;
  if (colorOrID) {
    if (colorOrID.startsWith("#" || "rgb(" || "rgba(")) {
      button.style.background = colorOrID;
    } else {
      button.id = colorOrID
    }
  }
  if (color) {
    button.style.background = color;
  }

  settingsElement.appendChild(button);
  return button;
}
function addMenuDropdown(oldid, title, newid) {
  const settingsElement = document.getElementById(oldid);
  const menu = document.createElement("div");
  menu.classList.add("select-none");
  menu.classList.add("my-2");
  menu.id = newid;

  menu.innerHTML = `<div id="${newid}-top" class="menuDropdown bg-white dark:bg-gray-700 p-4 mb-2 rounded-xl flex cursor-pointer hover:bg-white transition-colors bg-gray-50">
  <span class="inline-block font-semibold w-full">${title}</span>
  <span class="inline-block secondary-text"
    ><span
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path></svg></span
  ></span>
</div>
<div class="bg-white dark:bg-gray-700 p-4 rounded-xl" id="${newid}-menu">
  <div id="${newid}-content" class="menuDropdownMenu">
    <span class="block">
    </span>
  </div>
</div>
`;

  settingsElement.appendChild(menu);
  document.getElementById(`${newid}-top`).onclick = function () { if (opened) { document.getElementById(`${newid}-menu`).style.display = "none"; opened = false; } else { document.getElementById(`${newid}-menu`).style.display = "block"; opened = true } }
  document.getElementById(`${newid}-menu`).style.display = "none";
  let opened = false;
  console.log(oldid)
  if (document.getElementById(oldid).classList.contains("menuDropdownMenu")) {
    document.getElementById(`${newid}-top`).classList.add("dark:bg-gray-800");
    document.getElementById(`${newid}-menu`).classList.add("dark:bg-gray-800");

  }
  return menu
}
// window.setInterval(() => {
if (window.location.href == "https://wasteof.money/settings") {
//     if (!document.getElementById("plugins")) {
      console.log("g")
        document.getElementsByClassName("w-full")[13].id = "footer";
        createSettingModule("plugins");
        addHeaderNode("plugins", "Wasteof Plugins");

        addMenuDropdown("plugins", "Wasteof Plugins", "womplugins");
        addHeaderNode("womplugins-content", "Wasteof Plugins");
        addTextNode("womplugins-content", "Wasteof Plugins Base");
        addTextNode("womplugins-content", "<b>By</b> MrOwlsss");
        addTextNode("womplugins-content", "<b>Version</b> 1.3");
        addHeaderNode("womplugins-content", "<br>Settings");
        addMenuDropdown("womplugins-content", "Element API", "womplugins-ele");
        addHeaderNode("womplugins-ele-content", "Element API");
        addTextNode("womplugins-ele-content", "This will literally break most plugins if disabled");
        addButtonNode("womplugins-ele-content", "Enable", "womplugins-eleonoff")


        addMenuDropdown("plugins", "Leaderboard Pin", "lbpin");
        addHeaderNode("lbpin-content", "Leaderboard Pin");
        addTextNode("lbpin-content", "The original. Pins the Leaderboard post to the top of the feed");
        addTextNode("lbpin-content", "<b>By</b> MrOwlsss");
        addTextNode("lbpin-content", "<b>Version</b> 1.0");
        addButtonNode("lbpin-content", "Enable", "lbpinonoff");

        addMenuDropdown("plugins", "More Images", "more-images");
        addHeaderNode("more-images-content", "More Images");
        addTextNode("more-images-content", "Adds another way to embed images in Wasteof");
        addTextNode("more-images-content", "<b>By</b> MrOwlsss");
        addTextNode("more-images-content", "<b>Version</b> 1.0");
        addButtonNode("more-images-content", "Enable", "more-imagesonoff")

        addMenuDropdown("plugins", "Wasteof Tweaks", "wasteof-tweaks");
        addHeaderNode("wasteof-tweaks-content", "Wasteof Tweaks");
        addTextNode("wasteof-tweaks-content", "Like Vanilla Tweaks for Minecraft but for Wasteof");
        addTextNode("wasteof-tweaks-content", "<b>By</b> MrOwlsss");
        addTextNode("wasteof-tweaks-content", "<b>Version</b> 1.0");
        addButtonNode("wasteof-tweaks-content", "Enable", "wasteof-tweaksonoff")
        addHeaderNode("wasteof-tweaks-content", "<br>Settings");
        //Settings!//
        addMenuDropdown("wasteof-tweaks-content", "More Badges", "wasteof-tweaks-mbs");
        addHeaderNode("wasteof-tweaks-mbs-content", "More User Badges");
        addTextNode("wasteof-tweaks-mbs-content", "Adds more badges to user pages");
        addButtonNode("wasteof-tweaks-mbs-content", "Enable", "wasteof-tweaks-mbsonoff")
        addMenuDropdown("wasteof-tweaks-content", "Search Bar in Topnav", "wasteof-tweaks-sbtn");
        addHeaderNode("wasteof-tweaks-sbtn-content", "Search Bar in Topnav");
        addTextNode("wasteof-tweaks-sbtn-content", "Adds the Wasteof search bar in the top navigation bar.");
        addButtonNode("wasteof-tweaks-sbtn-content", "Enable", "wasteof-tweaks-sbtnonoff")
        addMenuDropdown("wasteof-tweaks-content", "Hashtag Support", "wasteof-tweaks-hts");
        addHeaderNode("wasteof-tweaks-hts-content", "Hashtag Support");
        addTextNode("wasteof-tweaks-hts-content", "Enables hashtag (#) support to Wasteof");
        addButtonNode("wasteof-tweaks-hts-content", "Enable", "wasteof-tweaks-htsonoff")

        addMenuDropdown("plugins", "Push Notification Count", "pushNotifCount");
        addHeaderNode("pushNotifCount-content", "Push Notification Count");
        addTextNode("pushNotifCount-content", "Will give you desktop notifications when you receive a notification (assuming Wasteof is open)");
        addTextNode("pushNotifCount-content", "<b>By</b> MrOwlsss");
        addTextNode("pushNotifCount-content", "<b>Version</b> 1.0");
        addButtonNode("pushNotifCount-content", "Enable", "pushNotifCountonoff")

        addMenuDropdown("plugins", "Custom CSS", "custom-css");
        addHeaderNode("custom-css-content", "Custom CSS");
        addTextNode("custom-css-content", "Theme Wasteof your own way! Requires knowlege of CSS.");
        addTextNode("custom-css-content", "<b>By</b> MrOwlsss");
        addTextNode("custom-css-content", "<b>Version</b> 1.0");
        addButtonNode("custom-css-content", "Enable", "custom-cssonoff")
        addButtonNode("custom-css-content", "Edit CSS", "custom-css-edit", orange)


        // addMenuDropdown("plugins", "Sideload Plugins", "sideloadPlugins");
        // addHeaderNode("sideloadPlugins-content", "Push Notification Count");
        // addTextNode("sideloadPlugins-content", "Allows you to sideload plugins from external sources. <b>BE SURE YOU KNOW WHAT YOU'RE DOING</b>");
        // addTextNode("sideloadPlugins-content", "<b>By</b> MrOwlsss");
        // addTextNode("sideloadPlugins-content", "<b>Version</b> 1.0");
        // addButtonNode("sideloadPlugins-content", "Enable", "sideloadPluginsonoff")
        // addButtonNode("sideloadPlugins-content", "Sideload", "sideloadAPlugins")


        createSettingModule("colors");
        addMenuDropdown("colors", "Colors", "thecolors");
        addButtonNode("thecolors-content", "Default", "default");
        addButtonNode("thecolors-content", "Pink", pink);
        addButtonNode("thecolors-content", "Violet", violet);
        addButtonNode("thecolors-content", "Green", green);
        addButtonNode("thecolors-content", "Blue", blue);
        addButtonNode("thecolors-content", "Red", red);
        addButtonNode("thecolors-content", "Orange", orange);
}
//       }
//     // }
//   }
// }, 100);
function createDialog(title, id) {
  const anewDialog = document.createElement("div");
  anewDialog.id = id;
  anewDialog.innerHTML = `<div class="vfm vfm--inset vfm--fixed" style="z-index: 1000;" data-v-02823e40="" value="true"><div class="vfm__overlay vfm--overlay vfm--absolute vfm--inset" style="" data-v-02823e40=""></div> <div aria-expanded="true" role="dialog" aria-modal="true" tabindex="-1" class="vfm__container vfm--absolute vfm--inset vfm--outline-none flex justify-center items-center" style="" data-v-02823e40=""><div class="vfm__content relative flex flex-col max-h-full mx-4 rounded w-full h-full md:w-1/2 md:h-1/2" data-v-02823e40="" style="touch-action: none; position: relative; top: 23px; left: -159px; margin: unset;"><span id="modal-header" class="mr-8 w-full bg-primary-500 dark:bg-gray-800 text-white p-2 rounded-t-xl dark:border-t-2 dark:border-l-2 dark:border-r-2 border-gray-700 font-semibold cursor-move">${title}</span><div
  class="flex-grow overflow-y-auto bg-white dark:bg-gray-900 dark:border-b-2 dark:border-l-2 dark:border-r-2 border-gray-700 p-2 flex flex-col rounded-b" id="${id}-content"></div><button onclick="document.getElementById('${id}').remove();" class="absolute top-0 right-0 mt-2 mr-2 text-white"><span><svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
</svg></span></button> </div>`
  document.body.appendChild(anewDialog)
  return anewDialog;
}
//createDialog("Add account", "addAccount");
//document.getElementById("addAccount-content").innerHTML = `<p>Add an account:</p><br><input placeholder="Username"><input placeholder="Password">`;
    if (window.location.href == "https://wasteof.money/settings") {
      function pluginEnableDisable(plugin, warning) {
        if (localStorage.getItem(plugin) == "enabled") {
          document.getElementById(plugin + "onoff").style.background = "#ef4444";
          document.getElementById(plugin + "onoff").innerText = "Disable";
        } else {
          document.getElementById(plugin + "onoff").style.background = "#22c55e";
          document.getElementById(plugin + "onoff").innerText = "Enable";
        }
        document.getElementById(plugin + "onoff").addEventListener("click", () => {
          let enabled = localStorage.getItem(plugin);
          if (enabled != "enabled") {

            if (warning == "usesUserToken") {
              createDialog("Warning", plugin + "UUTWarnDialog");
              addHeaderNode(plugin + "UUTWarnDialog-content", "This plugin uses your user token")
              addTextNode(plugin + "UUTWarnDialog-content", "This plugin uses your user token, presumeably to make API calls on your behalf.<br>Are you sure you want to enable this plugin?")
              addButtonNode(plugin + "UUTWarnDialog-content", "Enable", plugin + "UUTWarnButton", green);
              // addTextNode(plugin + "UUTWarnDialog-content", "This plugin is sideloaded and contains unreviewed code. Make sure you know what you're doing.")
              addTextNode(plugin + "UUTWarnDialog-content", "This plugin has been reviewed and officially added to Wasteof Plugins.")


              document.getElementById(plugin + "UUTWarnButton").addEventListener("click", () => {
                document.getElementById(plugin + "onoff").style.background = "#ef4444";
                document.getElementById(plugin + "onoff").innerText = "Disable";
                localStorage.setItem(plugin, "enabled");
                document.getElementById(plugin + "UUTWarnDialog").remove();
              })

            } else {
              document.getElementById(plugin + "onoff").style.background = "#ef4444";
              document.getElementById(plugin + "onoff").innerText = "Disable";
              localStorage.setItem(plugin, "enabled");
            }
          } else {
            document.getElementById(plugin + "onoff").style.background = "#22c55e";
            document.getElementById(plugin + "onoff").innerText = "Enable ";
            localStorage.setItem(plugin, "disabled");
          }
        });
      }
      pluginEnableDisable("womplugins-ele");

      pluginEnableDisable("lbpin");

      pluginEnableDisable("more-images");

      pluginEnableDisable("wasteof-tweaks");
      pluginEnableDisable("wasteof-tweaks-sbtn");
      pluginEnableDisable("wasteof-tweaks-mbs");
      pluginEnableDisable("wasteof-tweaks-hts");

      pluginEnableDisable("pushNotifCount", "usesUserToken");

      // pluginEnableDisable("sideloadPlugins");

      pluginEnableDisable("custom-css");

    }

    //element api
    window.setInterval(() => {
    if (localStorage.getItem("womplugins-ele") == "enabled") {
        document.getElementsByClassName("text-2xl pl-2")[0].classList.add("wasteof-logo")
        document.getElementsByClassName("bg-primary-500 dark:bg-gray-800 shadow-md p-2 sticky w-full z-50 top-0")[0].classList.add("navbar")
        Array.from(document.getElementsByClassName("bg-gray-100 dark:bg-gray-800 px-8 mb-4 border-2 dark:border-gray-700 rounded-xl")).forEach((p) => {
            p.classList.add("post")
        })
        document.getElementsByClassName("flex w-full md:w-1/2 justify-center md:justify-start text-white font-extrabold")[0].classList.add("nav-left")
        document.getElementsByClassName("flex w-full content-center justify-between md:w-1/2 md:justify-end")[0].classList.add("nav-right")
        document.getElementsByClassName("font-bold text-4xl")[0].classList.add("feed-text")
    }
}, 100)

    //leaderboard pin
    window.setInterval(function () {
  if (window.location.href == "https://wasteof.money/" && localStorage.getItem("lbpin") == "enabled") {
    if (!document.getElementById("leaderboard")) {
      const leaderboard = document.createElement("div");
      leaderboard.id = "leaderboard"
      const postList = document.getElementsByClassName("max-w-2xl")[0];
      const lastPost = document.getElementsByClassName("max-w-2xl")[0].getElementsByClassName("rounded-xl")[0];

      leaderboard.classList.add("bg-gray-100");
      leaderboard.classList.add("dark:bg-gray-800");
      leaderboard.classList.add("px-8");
      leaderboard.classList.add("border-2");
      leaderboard.classList.add("dark:border-gray-700");
      leaderboard.classList.add("rounded-xl");
      leaderboard.style = "margin-bottom: 15px;"

      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      let postText;
      let comments;
      let loves;
      let reposts;
      const timestamp = 1666228888577;
      const date = new Date(timestamp);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      const year = date.getFullYear();
      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      fetch("https://api.wasteof.money/posts/6660af119adc44a7ef3853a2", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          postText = JSON.parse(result);
          return postText;
        })
        .then((parsedData) => {
          postText = parsedData["content"];
          comments = parsedData["comments"];
          loves = parsedData["loves"];
          reposts = parsedData["reposts"]
          leaderboard.innerHTML = `<a href="/posts/6660af119adc44a7ef3853a2" class="block"><div class="w-full mt-4 mb-2 pb-1 border-b-2 dark:border-gray-700 font-semibold"><a href="/users/leaderboard" class="w-full block"><img src="https://api.wasteof.money/users/leaderboard/picture" alt="burrito's profile picture" class="h-8 inline-block bg-white dark:border-gray-700 rounded-full border-2"> <span class="ml-1 inline-block theme-indigo">
          @leaderboard
          <span class="inline-flex h-2 w-2 rounded-full bg-primary-500 ml-1"></span> <!----></span></a></div> <span class="prose dark:prose-light max-w-none break-words"><details><summary>Leaderboard</summary>${postText}</details></span> <!----> <!----> <div class="mt-3 mb-5"><span class="block mb-2 secondary-text italic">
        Jun 5, 2024, 1:31 PM
        <span class="cursor-pointer"></span> <!----></span> <div class="select-none"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline h-5 w-5 cursor-pointer active:scale-125 active:text-red-400 hover:scale-110 transition"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg> <span class="mr-2">${loves}</span> <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" viewBox="0 0 24 24" class="inline h-5 w-5 cursor-pointer active:scale-125 active:text-yellow-400 hover:scale-110 transition"><path d="M11.6 3.4l-.8-.8c-.5-.6-.4-1.5.3-1.8.4-.3 1-.2 1.4.2a509.8 509.8 0 012.7 2.7c.5.4.5 1.2.1 1.6l-2.8 2.9c-.5.5-1.3.5-1.8-.1-.3-.5-.2-1 .2-1.5l.8-1H7a4.3 4.3 0 00-4.1 4.7 2036.2 2036.2 0 01.2 8h2.4c.5 0 .8.2 1 .6.2.4.2.9 0 1.2-.2.4-.6.6-1 .6H1.8c-.7 0-1.2-.5-1.2-1.1v-.2V10c0-1.3.3-2.5 1-3.6 1.3-2 3.2-3 5.6-3h4.4zM12.3 18.3h4.6c2.3 0 4.2-2 4.2-4.3V5.9c0-.2 0-.2-.2-.2h-2.3c-.6 0-1-.3-1.2-.8a1.2 1.2 0 011.1-1.6h3.6c.8 0 1.3.5 1.3 1.3v9c0 1.1-.1 2.2-.6 3.2a6.4 6.4 0 01-5.6 3.7l-4.6.1h-.2l.7.8c.4.4.5.9.3 1.3-.3.8-1.3 1-1.9.4L9 20.6l-.4-.5c-.3-.4-.3-1 0-1.4l2.9-3c.6-.6 1.7-.3 2 .6 0 .4 0 .7-.3 1l-.9 1z" fill="currentColor"></path></svg> <span class="mr-2">${reposts}</span> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline h-5 w-5"><path fill-rule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg> <span>${comments}</span> <span class="float-right relative inline-block z-20"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-5 w-5 cursor-pointer"><path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path></svg> <!----></span></div></div></a> <div class="v-portal" style="display: none;"></div></div>`;
        })
        .catch((error) => console.error(error));

      postList.insertBefore(leaderboard, lastPost);
    }
  }
}, 100)

    //more images
    if (localStorage.getItem("more-images") == "enabled") {
    window.setInterval(() => {
        let pElements = Array.from(document.getElementsByTagName("p"));
        pElements.forEach((ele) => {
            const pText = ele.innerText;
            if (pText.startsWith("{img}") && ele.parentElement.contentEditable != "true") {
                console.log("more image code");
                const imgURL = pText.slice(5);
                const newImg = document.createElement("img");
                newImg.src = imgURL;
                ele.innerText = "";
                ele.appendChild(newImg);
                ele.style.maxHeight = "250px";
                ele.style.maxWidth = "250px";
            }
        })
    }, 100);
}

    //custom css
    if (localStorage.getItem("custom-css") == "enabled") {
    setInterval(() => {
        if (!document.getElementById("customWOMCSS")) {
            const cCSS = document.createElement("style");
            cCSS.innerText = localStorage.getItem("customCSS");
            cCSS.id = "customWOMCSS";
            document.body.appendChild(cCSS);
        }
    }, 100)
}
if (window.location.href == "https://wasteof.money/settings") {
    document.querySelector("#custom-css-edit").addEventListener("click", () => {
        let cssdialog = createDialog("Edit Custom CSS", "editccss");
        const cssInput = document.createElement("textarea");
        cssInput.classList.add("text-input")
        cssInput.id = "cssinput";
        cssInput.value = localStorage.getItem("customCSS");
        document.querySelector("#editccss-content").appendChild(cssInput)
        let savebutton = addButtonNode("editccss-content", "Save", green);
        savebutton.style.width = "60px";
        savebutton.onclick = ()=> {
            localStorage.setItem("customCSS", cssInput.value);
            cssdialog.remove();
            document.querySelector("#customWOMCSS").innerText = localStorage.getItem("customCSS");
        }
    })
}

    //wasteof tweaks
    if (localStorage.getItem("wasteof-tweaks") == "enabled") {
    if (localStorage.getItem("wasteof-tweaks-mbs") == "enabled") {
        window.setInterval(() => {
            if (document.location.pathname.split("/")[1] == "users") {
                if (document.location.pathname == "/users/owenathletic" || document.location.pathname == "/users/markovmoney" || document.location.pathname == "/users/amyathletic") {
                    if (document.getElementById("BotIndicator")) {
                    } else {
                        const botIndicator = document.createElement("span");
                        const themeDot = document.getElementsByClassName("md:text-4xl")[0];
                        botIndicator.id = "BotIndicator"

                        botIndicator.innerHTML = `<svg fill-rule="evenodd" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 15.5C17.5 16.61 16.61 17.5 15.5 17.5S13.5 16.61 13.5 15.5 14.4 13.5 15.5 13.5 17.5 14.4 17.5 15.5M8.5 13.5C7.4 13.5 6.5 14.4 6.5 15.5S7.4 17.5 8.5 17.5 10.5 16.61 10.5 15.5 9.61 13.5 8.5 13.5M23 15V18C23 18.55 22.55 19 22 19H21V20C21 21.11 20.11 22 19 22H5C3.9 22 3 21.11 3 20V19H2C1.45 19 1 18.55 1 18V15C1 14.45 1.45 14 2 14H3C3 10.13 6.13 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2S14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C17.87 7 21 10.13 21 14H22C22.55 14 23 14.45 23 15M21 16H19V14C19 11.24 16.76 9 14 9H10C7.24 9 5 11.24 5 14V16H3V17H5V20H19V17H21V16Z"></path></svg>`;
                        botIndicator.classList.add("inline-block", "text-primary-500", "dark:text-primary-300");
                        botIndicator.title = "AI/Bot";

                        themeDot.appendChild(botIndicator);
                    }
                }
                let joinedText = document.getElementsByClassName("text-gray-400")[1].childNodes[0].title.split(" ").splice(0, 5).join(" ").split(" ");
                joinedText[4] = joinedText[4].split(":").splice(0, 2).join(":");
                joinedText = "Joined " + joinedText.join(" ")
                document.getElementsByClassName("text-gray-400")[1].childNodes[0].innerHTML = joinedText

            }
        }, 20)
    }

    const timestamp = 1666228888577;
    const date = new Date(timestamp);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const year = date.getFullYear();
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    //alert(`Joined ${month} ${day}, ${year}`);

    if (localStorage.getItem("wasteof-tweaks-sbtn") == "enabled") {
        window.setInterval(function () {
            if (!document.getElementById("inlineWOMSearch")) {
                const newSearch = document.createElement("div");
                // newSearch.action = "/search";
                // newSearch.method = "get";
                newSearch.style.marginTop = "-5px"
                newSearch.innerHTML = `<input style="height: 36px" id="inlineWOMSearch" type="text" placeholder="search anything..." name="q" autofocus="autofocus" class="text-input" style="margin-left: 10px;"> <button id="inlineWOMSearchButton" class="bg-primary-500 inline-block text-white font-bold mt-2 p-2 rounded-lg cursor-pointer" >search</button>`
                document.getElementsByClassName("nav-left")[0].appendChild(newSearch);
                document.getElementsByTagName("img")[0].style = "margin-top: 5px;"
                function search() {
                    let searchText = document.getElementById("inlineWOMSearch").value;
                    if (searchText.split(":")[0] == "user") {
                        location.href = "/search/users?q=" + searchText.split(":")[1];
                    } else if (searchText.split(":")[0] == "@") {
                        location.href = "/users/" + searchText.split(":")[1];
                    } else {
                        location.href = "/search?q=" + searchText;
                    }
                }
                document.getElementById("inlineWOMSearchButton").addEventListener("click", function() {
                    search()
                })
                document.getElementById("inlineWOMSearch").addEventListener("keypress", function (event) {
                    if (event.key === "Enter") {
                        search()
                    }
                });
            }
        })
    }

    if (localStorage.getItem("wasteof-tweaks-hts") == "enabled") {
        window.setInterval(function () {
            let pElements = Array.from(document.getElementsByTagName("p"));
            pElements.forEach((element) => {
                let pText = element.innerHTML.split(" ");
                pText.forEach((word, index) => {
                    if (word.startsWith("#")) {
                        // console.log(word);
                        pText[index] = `<a href="https://wasteof.money/search?q=${encodeURIComponent(word.split("").splice(1).join(""))}&ht=yes">${word}</a>`; // Correctly replace the word
                    }
                });
                let theText = pText.join(" ");
                // console.log(theText);
                if (!element.hasAttribute("urlified") && element.parentElement.contentEditable != "true") {
                    element.innerHTML = theText; // Update the innerHTML with the new text
                    element.setAttribute("urlified", "true");
                }
            });
        }, 100);

        // window.setInterval(function () {
        //     if (document.location.pathname == "/search") {
        //         const queryString = window.location.search;
        //         const urlParams = new URLSearchParams(queryString);

        //         if (urlParams.get("ht")) {
        //             let pElements = Array.from(document.getElementsByClassName("prose"));
        //             pElements.forEach((element) => {
        //                 if (!element.innerHTML.split(" ").includes(`#${urlParams.get("q")}`)) {
        //                     element.parentElement.parentElement.remove()
        //                 }
        //             });
        //         }
        //     }
        // }, 100)
    }

}

    // push-notifs
    if (localStorage.getItem("pushNotifCount") == "enabled") {
    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const userAuth = getCookie("token");
    let unreadCount

    const myHeaders = new Headers();
    myHeaders.append("Authorization", userAuth);

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
    };

    window.setInterval(() => {
        fetch("https://api.wasteof.money/messages/count", requestOptions)
            .then((response) => response.text())
            .then((result) => unreadCount = JSON.parse(result))
            .then((unreadCount) => alertNotifs(unreadCount["count"]))
            .catch((error) => console.error(error));

        function alertNotifs(unreads) {
            if (unreads > 0) {
                if (localStorage.getItem("unreadCount") != unreads) {
                    var title = `${unreads} Notification(s)`;
                    var icon = 'https://wasteof.money/brand/nav-logo.svg';
                    var body = `You have ${unreads} notifications!`;
                    var notification = new Notification(title, { body, icon });
                    localStorage.setItem("unreadCount", unreads)
                }
            }
        }
    }, 3000)
}


})();
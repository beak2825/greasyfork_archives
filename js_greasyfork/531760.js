// ==UserScript==
// @name         Classic Reddit++
// @namespace    https://github.com/SlippingGitty
// @version      1.6.5
// @description  Tools that restore and introduce new functionalities in the old.reddit interface (Views, vote tallies, etc.)
// @author       SlippingGitty
// @match        http://old.reddit.com/notifications
// @match        https://old.reddit.com/notifications
// @match        https://sh.reddit.com/notifications*
// @match        *://*.reddit.com/*
// @icon         https://files.catbox.moe/6e7371.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/531760/Classic%20Reddit%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/531760/Classic%20Reddit%2B%2B.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //
  // Insures sh.reddit is loaded for notifications, adds old.reddit frontpage button on logo
  //
  if (window.location.href.includes("old.reddit.com/notifications")) {
    window.location.href = window.location.href.replace(
      "old.reddit.com/notifications",
      "sh.reddit.com/notifications"
    );
  }

  if (window.location.href.includes("sh.reddit.com/notifications")) {
    window.addEventListener("load", function () {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.position = "fixed";
      container.style.top = "10px";
      container.style.left = "10px";
      container.style.zIndex = "9999";
      container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      container.style.padding = "5px 10px";
      container.style.borderRadius = "4px";
      container.style.boxShadow =
        "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)";

      const logo = document.createElement("div");
      logo.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <g>
                            <circle fill="#FF4500" cx="10" cy="10" r="10"/>
                            <path fill="#FFF" d="M16.67,10A1.46,1.46,0,0,0,14.2,9a7.12,7.12,0,0,0-3.85-1.23L11,4.65,13.14,5.1a1,1,0,1,0,.13-0.61L10.82,4a0.31,0.31,0,0,0-.37.24L9.71,7.71a7.14,7.14,0,0,0-3.9,1.23A1.46,1.46,0,1,0,4.2,11.33a2.87,2.87,0,0,0,0,.44c0,2.24,2.61,4.06,5.83,4.06s5.83-1.82,5.83-4.06a2.87,2.87,0,0,0,0-.44A1.46,1.46,0,0,0,16.67,10Zm-10,1a1,1,0,1,1,1,1A1,1,0,0,1,6.67,11Zm5.81,2.75a3.84,3.84,0,0,1-2.47.77,3.84,3.84,0,0,1-2.47-.77,0.27,0.27,0,0,1,.38-0.38A3.27,3.27,0,0,0,10,14a3.28,3.28,0,0,0,2.09-.61A0.27,0.27,0,1,1,12.48,13.79Zm-0.18-1.71a1,1,0,1,1,1-1A1,1,0,0,1,12.29,12.08Z"/>
                        </g>
                    </svg>
                `;
      logo.style.marginRight = "8px";

      const backButton = document.createElement("a");
      backButton.innerText = "Back to Old Reddit";
      backButton.href = window.location.href.replace(
        "sh.reddit.com/notifications",
        "old.reddit.com"
      );
      backButton.title = "Return to Old Reddit";

      backButton.style.display = "inline-block";
      backButton.style.padding = "5px 10px";
      backButton.style.borderRadius = "4px";
      backButton.style.backgroundColor = "#ff4500";
      backButton.style.color = "white";
      backButton.style.fontWeight = "bold";
      backButton.style.textDecoration = "none";
      backButton.style.fontSize = "12px";

      backButton.onmouseover = function () {
        this.style.backgroundColor = "#cc3700";
      };
      backButton.onmouseout = function () {
        this.style.backgroundColor = "#ff4500";
      };

      container.appendChild(logo);
      container.appendChild(backButton);
      document.body.appendChild(container);

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
          window.location.href = backButton.href;
        }
      });
    });
  }

  //
  // Classic Reddit++
  //
  ///// Trending Subs Recreation
  const config = {
    commentsRange: [20, 50],
    lastTrendingUpdateKey: "lastTrendingUpdate",
    updateInterval: 24 * 60 * 60 * 1000,
    subredditsPool: [
      "/r/AskReddit",
      "/r/funny",
      "/r/pics",
      "/r/gaming",
      "/r/science",
      "/r/worldnews",
      "/r/movies",
      "/r/videos",
      "/r/aww",
      "/r/Music",
      "/r/todayilearned",
      "/r/memes",
      "/r/sports",
      "/r/technology",
      "/r/news",
      "/r/anime",
      "/r/travel",
      "/r/food",
      "/r/space",
      "/r/interestingasfuck",
      "/r/worldpolitics",
      "/r/nfl",
      "/r/art",
      "/r/hobbies",
      "/r/personalfinance",
      "/r/books",
      "/r/history",
      "/r/photography",
      "/r/gadgets",
      "/r/television",
      "/r/wtf",
      "/r/awfuleverything",
      "/r/facepalm",
      "/r/mildlyinteresting",
      "/r/unexpected",
      "/r/dankmemes",
      "/r/publicfreakout",
      "/r/natureismetal",
      "/r/rarepuppers",
      "/r/oldschoolcool",
      "/r/blessedimages",
      "/r/madlads",
      "/r/animalsbeingjerks",
      "/r/whatcouldgowrong",
      "/r/instantkarma",
      "/r/therewasanattempt",
      "/r/wholesomememes",
      "/r/trashy",
      "/r/cringetopia",
      "/r/insaneparents",
      "/r/quityourbullshit",
      "/r/choosingbeggars",
      "/r/entitledparents",
      "/r/amitheasshole",
      "/r/relationship_advice",
      "/r/legaladvice",
      "/r/tifu",
      "/r/raisedbynarcissists",
      "/r/offmychest",
      "/r/venting",
      "/r/selfimprovement",
      "/r/getmotivated",
      "/r/loseit",
      "/r/stopdrinking",
      "/r/leaves",
      "/r/meditation",
      "/r/skincareaddiction",
      "/r/makeupaddiction",
      "/r/haircareScience",
      "/r/malefashionadvice",
      "/r/femalefashionadvice",
      "/r/streetwear",
      "/r/sneakers",
      "/r/watches",
      "/r/cars",
      "/r/buildapc",
      "/r/pcmasterrace",
      "/r/android",
      "/r/apple",
      "/r/programming",
      "/r/webdev",
      "/r/javascript",
      "/r/python",
      "/r/gamingnews",
      "/r/indiegaming",
      "/r/boardgames",
      "/r/tabletopgames",
      "/r/rpg",
      "/r/dndnext",
      "/r/pathfinder_rpg",
      "/r/magicTCG",
      "/r/yugioh",
      "/r/pokemontcg",
      "/r/hearthstone",
      "/r/gwent",
      "/r/competitivegaming",
      "/r/esports",
      "/r/gamernews",
      "/r/anime",
      "/r/manga",
      "/r/cosplay",
      "/r/kpop",
      "/r/jpop",
      "/r/cpop",
      "/r/popheads",
      "/r/indiepop",
      "/r/hiphopheads",
      "/r/rnb",
      "/r/electronicmusic",
      "/r/edm",
      "/r/techno",
      "/r/housemusic",
      "/r/trance",
      "/r/dubstep",
      "/r/jazz",
      "/r/classicalmusic",
      "/r/blues",
      "/r/folk",
      "/r/countrymusic",
      "/r/rock",
      "/r/metal",
      "/r/punk",
      "/r/alternativemusic",
      "/r/indierock",
      "/r/musicals",
      "/r/soundtracks",
      "/r/listentothis",
      "/r/newmusic",
      "/r/food",
      "/r/foodporn",
      "/r/recipes",
      "/r/baking",
      "/r/cooking",
      "/r/cocktails",
      "/r/coffee",
      "/r/tea",
      "/r/vegan",
      "/r/vegetarian",
      "/r/ketorecipes",
      "/r/paleo",
      "/r/glutenfree",
      "/r/healthyeating",
      "/r/nutrition",
      "/r/fitness",
      "/r/loseit",
      "/r/weightlifting",
      "/r/running",
      "/r/yoga",
      "/r/meditation",
      "/r/mindfulness",
      "/r/journaling",
      "/r/productivity",
      "/r/getdisciplined",
      "/r/selfimprovement",
      "/r/skincareaddiction",
      "/r/makeupaddiction",
      "/r/haircareScience",
      "/r/malefashionadvice",
      "/r/femalefashionadvice",
      "/r/streetwear",
      "/r/sneakers",
      "/r/watches",
      "/r/cars",
      "/r/motorcycles",
      "/r/aviation",
      "/r/space",
      "/r/astronomy",
      "/r/physics",
      "/r/chemistry",
      "/r/biology",
      "/r/medicine",
      "/r/science",
      "/r/technology",
      "/r/futurology",
      "/r/singularity",
      "/r/longevity",
      "/r/energy",
      "/r/renewableenergy",
      "/r/environment",
      "/r/climatechange",
      "/r/nature",
      "/r/earthporn",
      "/r/wildlifephotography",
      "/r/aww",
      "/r/animalsbeingbros",
      "/r/rarepuppers",
      "/r/corgi",
      "/r/goldenretrievers",
      "/r/cats",
      "/r/funnyanimals",
      "/r/mademesmile",
      "/r/wholesomememes",
      "/r/humansbeingbros",
      "/r/oldschoolcool",
      "/r/thewaywewere",
      "/r/nostalgia",
      "/r/retrophotos",
      "/r/vintagestyle",
      "/r/oldschoolriders",
      "/r/classiccars",
      "/r/classicfilms",
      "/r/classicrock",
      "/r/oldmovies",
      "/r/90s",
      "/r/80s",
      "/r/70s",
      "/r/60s",
      "/r/50s",
      "/r/40s",
      "/r/30s",
      "/r/20s",
      "/r/10s",
      "/r/00s",
      "/r/y2k",
      "/r/millennials",
      "/r/genz",
      "/r/genx",
      "/r/babyboomers",
      "/r/thegreatgeneration",
      "/r/silentgeneration",
      "/r/lostgeneration",
    ],
    enableTagline: "enableTagline",
    enableRenameHome: "enableRenameHome",
    enableFavicon: "enableFavicon",
    enableTrending: "enableTrending",
    viewCounterEnabled: "viewCounterEnabled",
    voteEstimatorEnabled: "voteEstimatorEnabled",
    hideMultibar: "hideMultibar",
    hideBell: "hideBell",
    hideChat: "hideChat",
    addUserPrefix: "addUserPrefix",
    hideArchivedArrows: "hideArchivedArrows",
    oldCommentFont: "oldCommentFont",
    fullUserScores: "fullUserScores",
    oldRedditIcons: "oldRedditIcons",
    expandoButtons: "expandoButtons",
    classicRESNight: "classicRESNight",
    enableSubmitUnderlay: "enableSubmitUnderlay",
    classicResBorderHighlight: "classicResBorderHighlight",
    classicFlair: "classicFlair",
  };

  const defaultSettings = {
    [config.enableTagline]: false,
    [config.enableRenameHome]: true,
    [config.enableFavicon]: true,
    [config.enableTrending]: true,
    [config.viewCounterEnabled]: true,
    [config.voteEstimatorEnabled]: true,
    [config.hideMultibar]: false,
    [config.hideBell]: true,
    [config.hideChat]: true,
    [config.addUserPrefix]: false,
    [config.hideArchivedArrows]: false,
    [config.oldCommentFont]: false,
    [config.fullUserScores]: true,
    [config.oldRedditIcons]: true,
    [config.expandoButtons]: false,
    [config.classicRESNight]: false,
    [config.enableSubmitUnderlay]: false,
    [config.classicResBorderHighlight]: true,
    [config.classicFlair]: false,
  };

  for (const key in defaultSettings) {
    if (GM_getValue(key) === undefined) {
      GM_setValue(key, defaultSettings[key]);
    }
  }

  // STATIC CSS (ALWAYS LOADS REGARDLESS OF TOGGLES)
  GM_addStyle(`

    /* Makes the post info it's classic grey */
     .linkinfo {
        border: 1px solid rgba(12, 10, 10, 0.41);
        background-color: rgba(134, 130, 130, 0.24);
    }


    /* Refered to as "RES" because I originally wanted to see if I could put the toggles in RES Settings */
#res-dashboard-container {
    display: none;
    position: fixed;
    top: 60px;
    right: 20px;
    width: 600px;
    max-height: 500px;
    background-color: #ffffff;
    border: 1px solid #5f99cf; /* Classic Reddit blue border */
    border-radius: 3px;
    z-index: 1001;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    font-family: verdana, arial, helvetica, sans-serif; /* Classic Reddit font stack */
    font-size: 12px;
    opacity: 1;
    margin: 0;
    padding: 0;
    overflow-y: auto;
}

/* Indents Trending Tab */
div.entry:nth-child(1) {
    margin-left: 75px;
}

/* Night mode styling */
.res-nightmode #res-dashboard-container {
    background-color: #262626; /* Classic RES night mode color */
    border-color: #4d4d4d;
    color: #ddd;
}

#res-dashboard-header {
    background-color: #cee3f8; /* Classic Reddit header blue */
    padding: 5px 8px;
    border-bottom: 1px solid #5f99cf;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 18px; /* Fixed height like old Reddit */
}

/* Night mode header */
.res-nightmode #res-dashboard-header {
    background-color: #2a2a2a;
    border-bottom-color: #4d4d4d;
}

#res-dashboard-title {
    font-size: 13px;
    font-weight: bold;
    color: #336699; /* Classic Reddit blue */
    margin: 0;
    text-transform: none;
    line-height: 18px;
}

/* Night mode title */
.res-nightmode #res-dashboard-title {
    color: #8cb3d9; /* Lighter blue for night mode */
}

#res-dashboard-close {
    cursor: pointer;
    font-size: 12px;
    color: #369;
    font-weight: bold;
    margin-right: 5px;
}

#res-dashboard-close:hover {
    color: #ff4500; /* Classic Reddit orangered */
    text-decoration: underline; /* Old Reddit often used underlines on hover */
}

/* Night mode close button */
.res-nightmode #res-dashboard-close {
    color: #8cb3d9;
}

.res-nightmode #res-dashboard-close:hover {
    color: #ff7247; /* Lighter orangered for night mode */
}

#res-dashboard-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 7px;
    padding: 8px;
    background-color: #f6f7f8; /* Very light gray like classic Reddit content areas */
    overflow: visible;
}

/* Night mode content area */
.res-nightmode #res-dashboard-content {
    background-color: #262626;
    overflow: visible;
}

.res-setting-section {
    background-color: #ffffff;
    border: 1px solid #c3c3c3; /* Classic light gray border */
    border-radius: 0px; /* Old Reddit had square corners */
    padding: 8px;
    margin: 0;
    position: relative;
}

/* Night mode setting sections */
.res-nightmode .res-setting-section {
    background-color: #1a1a1a;
    border-color: #4d4d4d;
}

.res-setting-section:hover {
    border-color: #a5a5a5; /* Subtle hover effect common in old interfaces */
}

/* Night mode hover effect */
.res-nightmode .res-setting-section:hover {
    border-color: #666;
}

.res-setting-section h3 {
    font-size: 12px;
    margin: 0 0 5px 0;
    padding: 0;
    color: #222222; /* Dark gray, almost black */
    font-weight: bold;
}

/* Night mode headings */
.res-nightmode .res-setting-section h3 {
    color: #ddd;
}

/* Native tooltip styling */
.res-setting-section label {
    font-size: 11px;
    color: #222;
    cursor: pointer;
}

.res-setting-section label[title] {
    text-decoration: underline dotted #777; /* Indicate tooltip on hover */
}

/* Night mode labels */
.res-nightmode .res-setting-section label {
    color: #ddd;
}

.res-nightmode .res-setting-section label[title] {
    text-decoration: underline dotted #aaa; /* Indicate tooltip on hover for night mode */
}

/* Classic toggle switch styling */
.res-toggle-container {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 5px;
}

.res-toggle-switch {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 14px;
}

.res-toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.res-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #c3c3c3;
    transition: .2s;
    border-radius: 7px;
}

/* Night mode slider */
.res-nightmode .res-slider {
    background-color: #444;
}

.res-slider:before {
    position: absolute;
    content: "";
    height: 10px;
    width: 10px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .2s;
    border-radius: 50%;
}

input:checked + .res-slider {
    background-color: #5f99cf; /* Classic Reddit blue */
}

input:focus + .res-slider {
    box-shadow: 0 0 1px #5f99cf;
}

input:checked + .res-slider:before {
    transform: translateX(18px);
}

/* Night mode checked slider */
.res-nightmode input:checked + .res-slider {
    background-color: #4c7eac; /* Darker blue for night mode */
}

/* Classic Reddit button with gradient */
#res-settings-toggle {
    position: fixed;
    top: 45px;
    right: 20px;
    opacity: 0;
    z-index: 1000;
    background: linear-gradient(to bottom, #75abff 0%, #5f99cf 100%); /* Classic button gradient */
    border: 1px solid #369;
    color: #fff;
    padding: 4px 8px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    font-weight: bold;
    text-transform: capitalize;
}

#res-settings-toggle:hover {
    background: linear-gradient(to bottom, #5f99cf 0%, #3a80c1 100%);
    opacity: 1;
    transition: .1s;
}

/* Night mode toggle button */
.res-nightmode #res-settings-toggle {
    background: linear-gradient(to bottom, #4c7eac 0%, #36648b 100%); /* Darker gradient for night mode */
    border-color: #2c5574;
}

.res-nightmode #res-settings-toggle:hover {
    background: linear-gradient(to bottom, #36648b 0%, #2c5574 100%);
}

#res-dashboard-logo {
    max-height: 14px;
    margin-right: 6px;
}

/* Additional elements to match old Reddit style */


/* Old Reddit-style scrollbars */
#res-dashboard-container::-webkit-scrollbar {
    width: 12px;
    background-color: #f5f5f5;
}

#res-dashboard-container::-webkit-scrollbar-thumb {
    background-color: #c3c3c3;
    border: 2px solid #f5f5f5;
}

#res-dashboard-container::-webkit-scrollbar-track {
    background-color: #f5f5f5;
}

/* Night mode scrollbars */
.res-nightmode #res-dashboard-container::-webkit-scrollbar {
    background-color: #1a1a1a;
}

.res-nightmode #res-dashboard-container::-webkit-scrollbar-thumb {
    background-color: #444;
    border: 2px solid #1a1a1a;
}

.res-nightmode #res-dashboard-container::-webkit-scrollbar-track {
    background-color: #1a1a1a;
}

/* Classic Reddit table styles for structured content if needed */
.res-table {
    border-collapse: collapse;
    width: 100%;
    margin: 5px 0;
    font-size: 11px;
}

.res-table th {
    background-color: #efefef;
    border: 1px solid #c3c3c3;
    padding: 3px 5px;
    text-align: left;
    font-weight: bold;
}

.res-table td {
    border: 1px solid #c3c3c3;
    padding: 3px 5px;
}

.res-nightmode .res-table th {
    background-color: #2a2a2a;
    border-color: #4d4d4d;
}

.res-nightmode .res-table td {
    border-color: #4d4d4d;
}
`);

  let dashboardContainer = document.createElement("div");
  dashboardContainer.id = "res-dashboard-container";

  let dashboardHeader = document.createElement("div");
  dashboardHeader.id = "res-dashboard-header";

  let dashboardTitle = document.createElement("h2");
  dashboardTitle.id = "res-dashboard-title";
  dashboardTitle.textContent = "Classic Reddit++ Settings";

  let logoImg = document.createElement("img");
  logoImg.id = "res-dashboard-logo";
  logoImg.src = "https://files.catbox.moe/6e7371.png";
  logoImg.alt = "Classic Reddit++ Logo";

  dashboardHeader.appendChild(logoImg);
  dashboardHeader.appendChild(dashboardTitle);

  let closeButton = document.createElement("span");
  closeButton.id = "res-dashboard-close";
  closeButton.textContent = "x";
  closeButton.addEventListener("click", () => {
    dashboardContainer.style.display = "none";
  });
  dashboardHeader.appendChild(closeButton);

  dashboardContainer.appendChild(dashboardHeader);

  let dashboardContent = document.createElement("div");
  dashboardContent.id = "res-dashboard-content";
  dashboardContainer.appendChild(dashboardContent);

  document.body.appendChild(dashboardContainer);

  function createSettingElement(settingKey, description, updateFunction) {
    let section = document.createElement("div");
    section.classList.add("res-setting-section");

    let title = document.createElement("h3");
    title.textContent =
      {
        enableTagline: "Modify Title Tag",
        enableRenameHome: "Rename Home Shortcut",
        enableFavicon: "Restore Classic Favicon",
        enableTrending: "Simulate Trending Subreddits",
        viewCounterEnabled: "Display Post View Counts",
        voteEstimatorEnabled: "Estimate Post Votes",
        hideMultibar: "Hide Subreddit Multibar",
        hideBell: "Hide Notification Bell",
        hideChat: "Hide Reddit Chat",
        addUserPrefix: "Add Username Prefix",
        hideArchivedArrows: "Hide Archived Post Arrows",
        oldCommentFont: "Use Old Comment Font",
        fullUserScores: "Show Full User Scores",
        oldRedditIcons: "Restore Old Reddit Icons",
        expandoButtons: "Use Old Expando Buttons",
        classicRESNight: "Use Classic RES Night Mode",
        enableSubmitUnderlay: "Restore Submit Link Tagline",
        classicResBorderHighlight: "Enable Classic RES Border Highlight",
        classicFlair: "Remove Flair Colors",
      }[settingKey] || settingKey;
    section.appendChild(title);

    let desc = document.createElement("p");
    desc.textContent = description;
    section.appendChild(desc);

    let toggleContainer = document.createElement("div");
    toggleContainer.classList.add("res-toggle-container");

    let toggleLabel = document.createElement("label");
    toggleLabel.classList.add("res-toggle-switch");

    let toggleInput = document.createElement("input");
    toggleInput.type = "checkbox";
    toggleInput.checked = GM_getValue(settingKey, defaultSettings[settingKey]);
    toggleInput.addEventListener("change", function () {
      GM_setValue(settingKey, this.checked);
      if (updateFunction) updateFunction(this.checked);
    });

    let toggleSlider = document.createElement("span");
    toggleSlider.classList.add("res-slider");

    toggleLabel.appendChild(toggleInput);
    toggleLabel.appendChild(toggleSlider);
    toggleContainer.appendChild(toggleLabel);

    section.appendChild(toggleContainer);
    return section;
  }

  // Populate the dashboard
  const settingsArray = [
    {
      key: config.enableTagline,
      description:
        "Modifies the title tag to say 'reddit: the front page of the internet'",
      func: setTagline,
    },
    {
      key: config.enableRenameHome,
      description:
        "Renames the 'home' shortcut to 'FRONT'. Please Disable subredditManager in RES for time being.",
      func: renameHomeButton,
    },
    {
      key: config.enableFavicon,
      description: "Brings back the classic Favicon.",
      func: changeFavicon,
    },
    {
      key: config.enableTrending,
      description:
        "Simulates a collection of 'trending' subreddits to the top of your front page.",
      func: addTrendingSubreddits,
    },
    {
      key: config.viewCounterEnabled,
      description: "Displays view counts on posts.",
      func: initializeViewCounter,
    },
    {
      key: config.voteEstimatorEnabled,
      description:
        "Estimates upvotes and downvotes on posts, and adds a counter to every post.",
      func: initializeVoteEstimator,
    },
    {
      key: config.hideMultibar,
      description: "Hide the subreddit multibar.",
      func: toggleHideMultibar,
    },
    {
      key: config.hideBell,
      description: "Hide the notification bell.",
      func: toggleHideBell,
    },
    {
      key: config.hideChat,
      description: "Hide Reddit chat.",
      func: toggleHideChat,
    },
    {
      key: config.addUserPrefix,
      description: "Add /u/ before usernames.",
      func: toggleAddUserPrefix,
    },
    {
      key: config.hideArchivedArrows,
      description: "Hide arrows on archived posts.",
      func: toggleHideArchivedArrows,
    },
    {
      key: config.oldCommentFont,
      description: "Use old comment font sizes.",
      func: toggleOldCommentFont,
    },
    {
      key: config.fullUserScores,
      description: "Show full scores on posts.",
      func: toggleFullUserScores,
    },
    {
      key: config.oldRedditIcons,
      description: "Use old Reddit icons.",
      func: toggleOldRedditIcons,
    },
    {
      key: config.expandoButtons,
      description: "Use old expando buttons.",
      func: toggleExpandoButtons,
    },
    {
      key: config.classicRESNight,
      description: "Use Classic RES Night Mode.",
      func: toggleClassicRESNight,
    },
    {
      key: config.enableSubmitUnderlay,
      description: "Restore tagline under Submit Link",
      func: toggleSubmitUnderlay,
    },
    {
      key: config.classicResBorderHighlight,
      description: "Enable Classic RES Border Highlight",
      func: toggleClassicResBorderHighlight,
    },
    {
      key: config.classicFlair,
      description: "Removes colors from flairs on posts. RES support limited.",
      func: classicFlair,
    },
  ];

  settingsArray.forEach((setting) => {
    dashboardContent.appendChild(
      createSettingElement(setting.key, setting.description, setting.func)
    );
  });

  let toggleButton = document.createElement("button");
  toggleButton.id = "res-settings-toggle";
  toggleButton.textContent = "CR++";
  toggleButton.addEventListener("click", () => {
    dashboardContainer.style.display =
      dashboardContainer.style.display === "block" ? "none" : "block";
  });
  document.body.appendChild(toggleButton);

  const refreshButton = document.createElement("button");
  refreshButton.textContent = "Refresh Trending";
  refreshButton.style.fontSize = "10px";
  refreshButton.style.marginTop = "5px";
  refreshButton.addEventListener("click", forceUpdateTrending);
  dashboardHeader.appendChild(refreshButton);

  function setTagline(enabled) {
    if (enabled) {
      document.title = "reddit: the front page of the internet";
    } else {
      const defaultTitle = document.title.split(":")[0];
      document.title = defaultTitle;
    }
  }

  function renameHomeButton(enabled) {
    const homeLink = document.querySelector(
      "ul.flat-list:nth-child(1) > li:nth-child(1) > a:nth-child(1)"
    );
    if (homeLink) {
      homeLink.textContent = enabled ? "front" : "home";
      homeLink.title = enabled
        ? "Go to front page"
        : "go to your personal reddit frontpage";
    }
  }

  function changeFavicon(enabled) {
    let icon = [...document.querySelectorAll('link[rel~="icon"]')];
    icon.forEach((x) => x.parentNode.removeChild(x));

    if (enabled) {
      let newfav = `https://b.thumbs.redditmedia.com/JeP1WF0kEiiH1gT8vOr_7kFAwIlHzRBHjLDZIkQP61Q.jpg`;
      let link = document.createElement("link");
      link.rel = "icon";
      link.href = newfav;
      document.head.appendChild(link);
    } else {
      var link = document.createElement("link");
      link.rel = "icon";
      link.href = "//www.redditstatic.com/favicon.ico";
      document.head.appendChild(link);
    }
  }

  function getRandomSubreddits() {
    const now = Date.now();
    const lastUpdate = GM_getValue(config.lastTrendingUpdateKey, 0);
    const storedSubreddits = GM_getValue("trendingSubreddits", null);

    if (now - lastUpdate > config.updateInterval || !storedSubreddits) {
      const shuffled = [...config.subredditsPool].sort(
        () => 0.5 - Math.random()
      );
      const selected = shuffled.slice(0, 5);
      const commentCount = Math.floor(
        Math.random() *
          (config.commentsRange[1] - config.commentsRange[0] + 1) +
          config.commentsRange[0]
      );
      const trendingData = {
        subreddits: selected,
        commentCount: commentCount + " comments",
      };
      GM_setValue("trendingSubreddits", JSON.stringify(trendingData));
      GM_setValue(config.lastTrendingUpdateKey, now);
      return trendingData;
    }
    return JSON.parse(storedSubreddits);
  }

  function createTrendingSubredditsElement(trendingData) {
    const container = document.createElement("div");
    container.className = "thing";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.marginBottom = "7px";
    const content = document.createElement("div");
    content.className = "entry unvoted";
    const lineContainer = document.createElement("div");
    lineContainer.style.display = "flex";
    lineContainer.style.flexWrap = "wrap";
    lineContainer.style.alignItems = "center";
    lineContainer.style.gap = "5px";
    const trendingIcon = document.createElement("span");
    trendingIcon.style.backgroundImage =
      "url(https://web.archive.org/web/20151231010236im_/https://www.redditstatic.com/sprite-reddit.akRjeb2JalM.png)";
    trendingIcon.style.backgroundPosition = "-50px -886px";
    trendingIcon.style.height = "14px";
    trendingIcon.style.width = "14px";
    trendingIcon.style.display = "inline-block";
    lineContainer.appendChild(trendingIcon);
    const headerText = document.createElement("strong");
    headerText.textContent = "trending subreddits";
    headerText.style.color = "#222";
    headerText.style.marginRight = "10px";
    lineContainer.appendChild(headerText);
    trendingData.subreddits.forEach((subreddit) => {
      const link = document.createElement("a");
      link.href = subreddit;
      link.textContent = subreddit;
      link.style.textDecoration = "none";
      link.style.color = "#0079d3";
      lineContainer.appendChild(link);
    });
    const commentsLink = document.createElement("a");
    commentsLink.href = "/r/trendingsubreddits";
    commentsLink.innerHTML = `<b>${trendingData.commentCount}</b>`;
    commentsLink.style.color = "#888";
    commentsLink.style.textDecoration = "none";
    commentsLink.style.fontSize = "11px";
    commentsLink.style.marginLeft = "10px";
    lineContainer.appendChild(commentsLink);
    content.appendChild(lineContainer);
    container.appendChild(content);

    if (document.body.classList.contains("res-nightmode")) {
      headerText.style.color = "#A9A9A9";
      const links = lineContainer.querySelectorAll("a");
      links.forEach((link) => {
        link.style.color = "#89b8e5";
      });
      commentsLink.style.color = "#b0b0b0";
    }

    return container;
  }

  function addTrendingSubreddits(enabled) {
    const isFrontPage =
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html";
    if (
      enabled &&
      isFrontPage &&
      (window.location.hostname === "old.reddit.com" ||
        window.location.hostname === "www.reddit.com")
    ) {
      const siteTable = document.getElementById("siteTable");
      if (!siteTable) {
        return;
      }
      const trendingData = getRandomSubreddits();
      const trendingElement = createTrendingSubredditsElement(trendingData);
      if (siteTable.firstChild) {
        siteTable.insertBefore(trendingElement, siteTable.firstChild);
      } else {
        siteTable.appendChild(trendingElement);
      }
    } else {
      const trendingElement = document.querySelector(".thing");
      if (trendingElement) {
        trendingElement.remove();
      }
    }
  }

  function forceUpdateTrending() {
    GM_setValue(config.lastTrendingUpdateKey, 0);
    location.reload();
  }

  function addDebugControls() {
    const debugBtn = document.createElement("button");
    debugBtn.textContent = "Update Trending Subreddits";
    debugBtn.style.position = "fixed";
    debugBtn.style.top = "5px";
    debugBtn.style.right = "5px";
    debugBtn.style.zIndex = "9999";
    debugBtn.style.fontSize = "10px";
    debugBtn.style.opacity = "0.7";
    debugBtn.onclick = forceUpdateTrending;
    document.body.appendChild(debugBtn);
  }

  function addCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function httpGet(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
          if (response.status >= 200 && response.status < 300) {
            resolve(response.responseText);
          } else {
            reject(new Error(`HTTP error! status: ${response.status}`));
          }
        },
        onerror: function () {
          reject(new Error("Network error occurred"));
        },
      });
    });
  }

  function getPostId(element) {
    if (element) {
      if (element.dataset.fullname) {
        return element.dataset.fullname.replace("t3_", "");
      }

      const idClass = Array.from(element.classList).find((c) =>
        c.startsWith("id-t3_")
      );
      if (idClass) {
        return idClass.replace("id-t3_", "");
      }

      const thingId = element.getAttribute("data-fullname");
      if (thingId && thingId.startsWith("t3_")) {
        return thingId.replace("t3_", "");
      }

      const permalink = element.querySelector("a.permalink");
      if (permalink && permalink.href) {
        const permalinkMatch = permalink.href.match(
          /\/comments\/([a-z0-9]+)\//i
        );
        if (permalinkMatch) {
          return permalinkMatch[1];
        }
      }
    }

    const urlMatch = window.location.pathname.match(
      /\/comments\/([a-z0-9]+)\//i
    );
    return urlMatch ? urlMatch[1] : null;
  }

  //
  // Makes sure the Trending subreddits and Classic tagline only works
  // on the front page
  //
  if (
    (window.location.hostname === "old.reddit.com" ||
      window.location.hostname === "www.reddit.com") &&
    (window.location.pathname === "/" ||
      window.location.pathname === "/index.html")
  ) {
    setTagline(GM_getValue(config.enableTagline));
    renameHomeButton(GM_getValue(config.enableRenameHome));
    changeFavicon(GM_getValue(config.enableFavicon));

    window.addEventListener("load", () => {
      addTrendingSubreddits(GM_getValue(config.enableTrending));
    });
  }

  //
  // View Counter Logic
  //
  function initializeViewCounter() {
    if (!GM_getValue(config.viewCounterEnabled)) return;

    const DEBUG = false;

    function debugLog(...args) {
      if (DEBUG) {
        console.log("[View Counter]", ...args);
      }
    }

    const viewCountCache = {};

    function formatNumber(num) {
      if (num === null || num === undefined || num === 0) return "? views";
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + "M views";
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + "K views";
      } else {
        return num + " views";
      }
    }

    function fetchPostData(postId, targetElements) {
      if (viewCountCache[postId]) {
        targetElements.forEach((el) => {
          insertViewCount(el, viewCountCache[postId]);
        });
        return;
      }

      const jsonUrl = `https://www.reddit.com/by_id/t3_${postId}.json`;

      debugLog("Fetching data for post", postId, "from", jsonUrl);

      GM_xmlhttpRequest({
        method: "GET",
        url: jsonUrl,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            debugLog("Received data for post", postId, data);
            const postData = data.data.children[0].data;

            let viewCount = null;

            if (postData.view_count !== undefined) {
              viewCount = postData.view_count;
            } else if (postData.viewed !== undefined) {
              viewCount = postData.viewed;
            } else if (postData.num_views !== undefined) {
              viewCount = postData.num_views;
            } else if (postData.viewCount !== undefined) {
              viewCount = postData.viewCount;
            } else {
              const score = postData.score || 0;
              const ratio = postData.upvote_ratio || 0.5;
              const estimatedUpvotes = Math.round(score / (2 * ratio - 1));
              viewCount = estimatedUpvotes * 25;
              debugLog(
                "Estimated view count:",
                viewCount,
                "based on score:",
                score,
                "and ratio:",
                ratio
              );
            }

            debugLog("View count for post", postId, ":", viewCount);

            if (!viewCount || viewCount === 0) {
              fetchNewRedditViewCount(postId, targetElements);
              return;
            }

            viewCountCache[postId] = viewCount;

            targetElements.forEach((el) => {
              insertViewCount(el, formatNumber(viewCount));
            });
          } catch (error) {
            console.error("Old Reddit View Counter error:", error);
            fetchNewRedditViewCount(postId, targetElements);
          }
        },
        onerror: function (error) {
          console.error("Failed to fetch post data:", error);
          fetchNewRedditViewCount(postId, targetElements);
        },
      });
    }

    function fetchNewRedditViewCount(postId, targetElements) {
      const newRedditUrl = `https://www.reddit.com/comments/${postId}/.json`;

      debugLog("Trying new Reddit API for post", postId);

      GM_xmlhttpRequest({
        method: "GET",
        url: newRedditUrl,
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            const postData = data[0].data.children[0].data;

            let viewCount = null;

            if (
              postData.view_count !== undefined &&
              postData.view_count !== null
            ) {
              viewCount = postData.view_count;
            } else if (
              postData.viewCount !== undefined &&
              postData.viewCount !== null
            ) {
              viewCount = postData.viewCount;
            } else if (
              postData.num_views !== undefined &&
              postData.num_views !== null
            ) {
              viewCount = postData.num_views;
            } else {
              const totalVotes = postData.ups + postData.downs;
              viewCount = totalVotes * 25;
              debugLog("Estimated view count from votes:", viewCount);
            }

            debugLog("New Reddit view count for post", postId, ":", viewCount);

            if (viewCount) {
              viewCountCache[postId] = viewCount;
              targetElements.forEach((el) => {
                insertViewCount(el, formatNumber(viewCount));
              });
            } else {
              targetElements.forEach((el) => {
                insertViewCount(el, "? views");
              });
            }
          } catch (error) {
            console.error("New Reddit View Counter error:", error);
            targetElements.forEach((el) => {
              insertViewCount(el, "? views");
            });
          }
        },
        onerror: function (error) {
          console.error("Failed to fetch from New Reddit:", error);
          targetElements.forEach((el) => {
            insertViewCount(el, "? views");
          });
        },
      });
    }

    function insertViewCount(element, formattedViews) {
      const tagline = element.querySelector(".tagline");
      if (!tagline) return;

      if (tagline.querySelector(".view-count")) return;
      const viewElement = document.createElement("span");
      viewElement.className = "view-count";
      viewElement.textContent = formattedViews;
      viewElement.style.marginRight = "6px";
      viewElement.style.color = "#888";
      viewElement.style.fontSize = "0.9em";

      tagline.insertBefore(viewElement, tagline.firstChild);
    }

    function processPost(postElement) {
      const postId = getPostId(postElement);
      if (!postId) {
        debugLog("Could not find post ID for element", postElement);
        return;
      }

      debugLog("Processing post", postId);
      fetchPostData(postId, [postElement]);
    }

    function processAllPosts() {
      if (window.location.pathname.includes("/comments/")) {
        const postId = getPostId();
        if (!postId) return;

        const selfPost = document.querySelector(".thing.self");
        if (selfPost) {
          fetchPostData(postId, [selfPost]);
        }
        return;
      }

      const posts = document.querySelectorAll(
        ".thing.link:not([data-processed-views])"
      );

      posts.forEach((post) => {
        post.setAttribute("data-processed-views", "true");
        processPost(post);
      });
    }

    function handleResExpando() {
      document.addEventListener("click", function (e) {
        setTimeout(() => {
          const expandedPosts = document.querySelectorAll(
            ".res-expando-box:not([data-processed-views])"
          );

          expandedPosts.forEach((post) => {
            post.setAttribute("data-processed-views", "true");
            const parentPost = post.closest(".thing");
            if (parentPost) {
              processPost(parentPost);
            }
          });
        }, 500);
      });
    }

    function handleNeverEndingReddit() {
      const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            processAllPosts();
          }
        });
      });

      const container = document.getElementById("siteTable") || document.body;
      observer.observe(container, { childList: true, subtree: true });
    }

    function initialize() {
      debugLog("Initializing View Counter");
      processAllPosts();
      handleResExpando();
      handleNeverEndingReddit();
      setInterval(processAllPosts, 2000);
    }

    setTimeout(initialize, 500);
  }

  //
  // Vote Estimator Logic
  //
  function initializeVoteEstimator() {
    if (!GM_getValue(config.voteEstimatorEnabled)) return;

    function addCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function estimatePostScoreVotes() {
      document.querySelectorAll(".linkinfo .score").forEach((linkinfoScore) => {
        const numberElement = linkinfoScore.querySelector(".number");
        if (!numberElement) return;

        const points = parseInt(
          numberElement.textContent.replace(/[^0-9]/g, ""),
          10
        );
        const percentageMatch =
          linkinfoScore.textContent.match(/([0-9]{1,3})\s?%/);
        const percentage = percentageMatch
          ? parseInt(percentageMatch[1], 10)
          : 0;

        if (points !== 50 && percentage !== 50) {
          const upvotes = Math.round(
            (points * percentage) / (2 * percentage - 100)
          );
          const downvotes = upvotes - points;
          const totalVotes = upvotes + downvotes;

          const css = `
                            .linkinfo .upvotes { font-size: 80%; color: orangered; margin-left: 5px; }
                            .linkinfo .downvotes { font-size: 80%; color: #5f99cf; margin-left: 5px; }
                            .linkinfo .totalvotes { font-size: 80%; margin-left: 5px; }
                        `;

          const style = document.createElement("style");
          style.innerHTML = css;
          document.head.appendChild(style);

          linkinfoScore.insertAdjacentHTML(
            "afterend",
            `
                            <span class="upvotes"><span class="number">${addCommas(
                              upvotes
                            )}</span> <span class="word">${
              upvotes > 1 ? "upvotes" : "upvote"
            }</span></span>
                            <span class="downvotes"><span class="number">${addCommas(
                              downvotes
                            )}</span> <span class="word">${
              downvotes > 1 ? "downvotes" : "downvote"
            }</span></span>
                            <span class="totalvotes"><span class="number">${addCommas(
                              totalVotes
                            )}</span> <span class="word">${
              totalVotes > 1 ? "votes" : "vote"
            }</span></span>
                        `
          );
        }
      });
    }

    async function addUpvoteDownvoteInfo() {
      const linkListing =
        document.querySelector(".linklisting") ||
        document.querySelector(".Post")?.parentElement;
      if (!linkListing) return;

      const linkDivs = linkListing.getElementsByClassName("link");

      const promises = Array.from(linkDivs).map(async (linkDiv) => {
        const commentsLink = linkDiv.querySelector(".comments");
        if (!commentsLink) return;

        const commentsPage = await httpGet(
          `${commentsLink.href}?limit=1&depth=1`
        );

        const scoreSection =
          /<div class=(\"|\')score(\"|\')[\s\S]*?<\/div>/.exec(commentsPage);
        if (!scoreSection) return;

        const scoreMatch =
          /<span class=(\"|\')number(\"|\')>([\d\,\.]*)<\/span>/.exec(
            scoreSection[0]
          );
        if (!scoreMatch) return;

        const score = parseInt(
          scoreMatch[3].replace(",", "").replace(".", ""),
          10
        );
        const upvotesPercentageMatch = /\((\d+)\s*\%[^\)]*\)/.exec(
          scoreSection[0]
        );
        if (!upvotesPercentageMatch) return;

        const upvotesPercentage = parseInt(upvotesPercentageMatch[1], 10);
        const upvotes = calcUpvotes(score, upvotesPercentage);
        const downvotes = upvotes !== "--" ? score - upvotes : "--";

        updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage);
      });

      await Promise.all(promises);
    }

    function calcUpvotes(score, upvotesPercentage) {
      if (score === 0) return "--";
      return Math.round(
        ((upvotesPercentage / 100) * score) /
          (2 * (upvotesPercentage / 100) - 1)
      );
    }

    function updateTagline(linkDiv, upvotes, downvotes, upvotesPercentage) {
      const taglineParagraph =
        linkDiv.querySelector(".tagline") ||
        linkDiv
          .querySelector(".Post div[data-test-id='post-content']")
          ?.querySelector(".tagline");
      if (!taglineParagraph) return;

      let upvoteSpan = taglineParagraph.querySelector(".res_post_ups");
      let downvoteSpan = taglineParagraph.querySelector(".res_post_downs");
      let percentageSpan = taglineParagraph.querySelector(
        ".res_post_percentage"
      );

      if (!upvoteSpan || !downvoteSpan || !percentageSpan) {
        const updownInfoSpan = document.createElement("span");

        upvoteSpan = createVoteSpan("res_post_ups", upvotes, "#FF8B24");
        downvoteSpan = createVoteSpan("res_post_downs", downvotes, "#9494FF");
        percentageSpan = createVoteSpan(
          "res_post_percentage",
          `${upvotesPercentage}%`,
          "#00A000"
        );

        updownInfoSpan.append(
          "(",
          upvoteSpan,
          "|",
          downvoteSpan,
          "|",
          percentageSpan,
          ") "
        );
        taglineParagraph.insertBefore(
          updownInfoSpan,
          taglineParagraph.firstChild
        );
      } else {
        upvoteSpan.textContent = upvotes;
        downvoteSpan.textContent = downvotes;
        percentageSpan.textContent = `${upvotesPercentage}%`;
      }
    }

    function createVoteSpan(className, textContent, color) {
      const span = document.createElement("span");
      span.classList.add(className);
      span.style.color = color;
      span.textContent = textContent;
      return span;
    }

    async function httpGet(url) {
      const response = await fetch(url);
      return response.text();
    }

    window.addEventListener("load", () => {
      estimatePostScoreVotes();
      addUpvoteDownvoteInfo();
    });

    window.addEventListener("keydown", (event) => {
      if (event.shiftKey && event.key === "P") {
        estimatePostScoreVotes();
        addUpvoteDownvoteInfo();
      }
    });
  }

  //
  // Classic Reddit Rewrite
  //
  const styleIds = {
    hideMultibar: "classicRedditMultibar",
    hideBell: "classicRedditBell",
    hideChat: "classicRedditChat",
    addUserPrefix: "classicRedditUserPrefix",
    hideArchivedArrows: "classicRedditArchivedArrows",
    oldCommentFont: "classicRedditOldCommentFont",
    fullUserScores: "classicRedditFullUserScores",
    oldRedditIcons: "classicRedditOldRedditIcons",
    expandoButtons: "classicRedditExpandoButtons",
    classicRESNight: "classicRESNightStyles",
    submitUnderlay: "classicRedditSubmitUnderlay",
    classicResBorderHighlight: "classicResBorderHighlight",
    classicFlair: "classicFlair",
  };

  function toggleHideMultibar(enabled) {
    GM_setValue(config.hideMultibar, enabled);
    const styleId = styleIds.hideMultibar;
    if (enabled) {
      GM_addStyle(
        `
                    .listing-chooser {
                        display: none;
                    }
                    .content[role=main] {
                        margin-left: 5px!important;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function classicFlair(enabled) {
    GM_setValue(config.classicFlair, enabled);
    const styleId = styleIds.classicFlair;
    if (enabled) {
      GM_addStyle(
        `
                .flair,
                .RES-flair {
                background-color: transparent !important;
                color: #888 !important;
                border: 1px solid #ddd !important;
                font-size: x-small !important;
                padding: 1px !important;
                }

                .res-flairSearch.linkflairlabel > a {
                position: absolute;
                inset: 0 0 0 0;
                background-color: ;
                color: #e3000000 !important;
                    font-size: x-small !important;
                        padding: 1px !important;
                }
                .res-flairSearch.linkflairlabel {
                cursor: pointer;
                position: relative;
                background-color: #f000 !important;
                        font-size: x-small !important;
                        padding: 1px !important;
                }

                /* Target link flairs specifically */
                .linkflairlabel,
                .res-linkFlairLabel {
                background-color: transparent !important;
                color: #888 !important;
                border: 1px solid #ddd !important;
                font-size: x-small !important;
                        padding: 1px !important;
                }

                /* Target user flairs */
                .author-flair,
                .res-userFlairText {
                background-color: transparent !important;
                color: #888 !important;
                border: 1px solid #ddd !important;
                    font-size: x-small !important;
                        padding: 1px !important;
                }

                /* RES night mode compatibility */
                .res-nightmode .flair,
                .res-nightmode .linkflairlabel,
                .res-nightmode .author-flair {
                background-color: transparent !important;
                color: #aaa !important;
                    font-size: x-small !important;
                }

                /* Target RES-specific container elements */
                .res .tagline .flair,
                .res .thing .tagline .flair,
                .res .entry .tagline .flair {
                background-color: transparent !important;
                color: #888 !important;
                border: 1px solid #ddd !important;
                    font-size: x-small !important;
                        padding: 1px !important;
                }

                /* RES user tagger compatibility */
                .RESUserTag .flair {
                background-color: transparent !important;
                color: #888 !important;
                border: 1px solid #ddd !important;
                    font-size: x-small !important;
                        padding: 1px !important;
                }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleHideBell(enabled) {
    GM_setValue(config.hideBell, enabled);
    const styleId = styleIds.hideBell;
    if (enabled) {
      GM_addStyle(
        `
                    #notifications, span.separator:nth-child(6), span.separator:nth-child(7) {
                        display: none;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleHideChat(enabled) {
    GM_setValue(config.hideChat, enabled);
    const styleId = styleIds.hideChat;
    if (enabled) {
      GM_addStyle(
        `
                    #chat-v2, span.separator:nth-child(8), span.separator:nth-child(9) {
                        display: none;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleAddUserPrefix(enabled) {
    GM_setValue(config.addUserPrefix, enabled);
    const styleId = styleIds.addUserPrefix;
    if (enabled) {
      GM_addStyle(
        `
                    a.author:before {
                        content: "/u/";
                        text-transform: none!important;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleHideArchivedArrows(enabled) {
    GM_setValue(config.hideArchivedArrows, enabled);
    const styleId = styleIds.hideArchivedArrows;
    if (enabled) {
      GM_addStyle(
        `
                    .archived-infobar ~ #siteTable .arrow,
                    .archived-infobar ~ .commentarea .arrow {
                        visibility: hidden;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleOldCommentFont(enabled) {
    GM_setValue(config.oldCommentFont, enabled);
    const styleId = styleIds.oldCommentFont;
    if (enabled) {
      GM_addStyle(
        `
                    .md {
                        font-size: inherit;
                        line-height: normal;
                    }
                    .md p {
                        line-height: normal;
                    }
                    .md pre > code {
                        font-size: small;
                    }
                    .md h1 {
                        font-size: 1.2em;
                        line-height: normal;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleFullUserScores(enabled) {
    GM_setValue(config.fullUserScores, enabled);
    const styleId = styleIds.fullUserScores;
    if (enabled) {
      GM_addStyle(
        `
                    .link .score {
                        font-size: 0;
                    }
                    .link .score::before {
                        content: attr(title);
                        font-size: 12px;
                    }
                    .link .score::first-letter {
                        font-size: 12px;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleOldRedditIcons(enabled) {
    GM_setValue(config.oldRedditIcons, enabled);
    const styleId = styleIds.oldRedditIcons;
    if (enabled) {
      GM_addStyle(
        `
                    .thumbnail.self {
                        height: 50px;
                        background-image: url(https://www.redditstatic.com/sprite-reddit.ZDiVRxCXXWg.png);
                        background-position: 0px -491px;
                        background-repeat: no-repeat;
                    }
                    .thumbnail.default {
                        background-image: url(https://www.redditstatic.com/sprite-reddit.ZDiVRxCXXWg.png);
                        background-position: 0px -434px;
                        background-repeat: no-repeat;
                        height: 50px;
                    }
                    .thumbnail.image {
                        background-image: url(https://www.redditstatic.com/sprite-reddit.ZDiVRxCXXWg.png);
                        background-position: 0px -434px;
                        background-repeat: no-repeat;
                        height: 50px;
                    }
                    .thumbnail.nsfw {
                        background-image: url(https://www.redditstatic.com/sprite-reddit.ZDiVRxCXXWg.png);
                        background-position: 0px -361px;
                        background-repeat: no-repeat;
                        height: 69px;
                    }
                    .thumbnail.spoiler {
                        background-image: url(https://imgoat.com/uploads/679091c5a8/5031.png);
                        background-position: 0px -361px;
                        background-repeat: no-repeat;
                        height: 69px;
                    }
                    img.interstitial-image[src *= "interstitial-image-banned.png"]
                    {
                       content: url("https://files.catbox.moe/28n0bn.png");
                       width: auto !important;
                       height: auto !important;
                       max-width: 100%;
                       max-height: 100%;
                    }

                    img.interstitial-image[src *= "interstitial-image-over18.png"]
                    {
                       content: url("https://files.catbox.moe/4tglxx.png");
                       width: auto !important;
                       height: auto !important;
                       max-width: 100%;
                       max-height: 100%;
                    }
                    .gilded-gid2-icon:before {
                        width: 13px;
                        height: 13px;
                        background-position: -42px -1676px !important;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleExpandoButtons(enabled) {
    GM_setValue(config.expandoButtons, enabled);
    const styleId = styleIds.expandoButtons;
    if (enabled) {
      GM_addStyle(
        `
  .expando-button {
    background-image: url("//www.redditstatic.com/sprite-reddit.5kxTB7FXse0.png") !important;
  }
  .expando-button.selftext.collapsed,
  .expando-button.crosspost.collapsed {
    background-position: -29px -1442px;
  }
  .expando-button.selftext.collapsed:hover,
  .expando-button.crosspost.collapsed:hover {
    background-position: 0 -1442px;
  }
  .expando-button.selftext.expanded,
  .expando-button.crosspost.expanded {
    background-position: -87px -1442px;
  }
  .expando-button.selftext.expanded:hover,
  .expando-button.crosspost.expanded:hover {
    background-position: -58px -1442px;
  }
  .expando-button.image.collapsed,
  .expando-button.video.collapsed,
  .expando-button.video-muted.collapsed,
  .expando-button.gallery.collapsed {
    background-position: 0 -1471px;
  }
  .expando-button.image.collapsed:hover,
  .expando-button.video.collapsed:hover,
  .expando-button.video-muted.collapsed:hover,
  .expando-button.gallery.collapsed:hover {
    background-position: -116px -1442px;
  }
  .expando-button.image.expanded,
  .expando-button.video.expanded,
  .expando-button.video-muted.expanded,
  .expando-button.gallery.expanded {
    background-position: -58px -1471px;
  }
  .expando-button.image.expanded:hover,
  .expando-button.video.expanded:hover,
  .expando-button.video-muted.expanded:hover,
  .expando-button.gallery.expanded:hover {
    background-position: -29px -1471px;
  }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleClassicRESNight(enabled) {
    GM_setValue(config.classicRESNight, enabled);
    const styleId = styleIds.classicRESNight;
    if (enabled) {
      GM_addStyle(
        `
                    /* HEADER */
                    .res-nightmode div.entry:nth-child(1) > div:nth-child(1) {
                        margin-top: 10px;
                    }
                    .res-floater-visibleAfterScroll {
                        top: 5px !important;
                        z-index: 10000000000 !important;
                    }
                    .res-nightmode #sr-header-area, .res-nightmode #sr-more-link {
                        background-color: rgb(68, 68, 68) !important;
                        color: rgb(222, 222, 222) !important;
                    }
                    .res-nightmode #RESSubredditGroupDropdown a,
                    .res-nightmode #RESSubredditGroupDropdown > .RESShortcutsEditButtons .res-icon,
                    .res-nightmode .RESNotificationContent,
                    .res-nightmode .RESNotificationFooter,
                    .res-nightmode body .sr-bar a {
                        color: rgb(222, 222, 222);
                    }
                    .res-nightmode #header, .res-nightmode .liveupdate-home .content {
                        background-color: rgb(105, 105, 105);
                        border-bottom: 1px solid rgb(160, 160, 160) !important;
                    }
                    .res-nightmode body .tabmenu li.selected a {
                        color: orangered;
                        background-color: white;
                        border: 1px solid rgb(160, 160, 160);
                        border-bottom: 1px solid white;
                        border-bottom-color: rgb(34, 34, 34) !important;
                        z-index: 100;
                    }
                    .res-nightmode div#RESShortcutsEditContainer,
                    .res-nightmode div#RESShortcutsSort,
                    .res-nightmode div#RESShortcutsRight,
                    .res-nightmode div#RESShortcutsLeft,
                    .res-nightmode div#RESShortcutsAdd,
                    .res-nightmode div#RESShortcutsTrash {
                        background: rgb(68, 68, 68) !important;
                        color: rgb(140, 179, 217) !important;
                    }
                    .res-nightmode .pagename a {
                        color: black;
                    }
                    .res-nightmode body.with-listing-chooser #header .pagename {
                        position: inherit;
                    }
                    /* FRONTPAGE */
                    .res-nightmode .trending-subreddits {
                        background-color: rgb(54, 54, 54) !important;
                        margin-top: 0px !important;
                        margin-left: 0px !important;
                        margin-bottom: 4px !important;
                        padding-bottom: 1px !important;
                    }
                    .res-nightmode body,
                    .res-nightmode body .content,
                    .res-nightmode .modal-body,
                    .res-nightmode .side,
                    .res-nightmode .icon-menu a,
                    .res-nightmode .side .leavemoderator,
                    .res-nightmode .side .leavecontributor-button,
                    .res-nightmode .side .titlebox,
.res-nightmode .side .spacer .titlebox .redditname,
                    .res-nightmode .side .titlebox .flairtoggle,
                    .res-nightmode .side .usertext-body .md ol,
                    .res-nightmode .side .usertext-body .md ol ol,
                    .res-nightmode .side .usertext-body .md ol ol li,
                    .res-nightmode .modactionlisting table *,
                    .res-nightmode .side .recommend-box .rec-item,
                    .res-nightmode .side .md ul {
                        background-color: rgb(34, 34, 34) !important;
                    }
                    .res-nightmode .titlebox form.toggle, .leavemoderator {
                        background: rgb(34, 34, 34) none no-repeat scroll center left !important;
                    }
                    .res-nightmode .side .spacer {
                        margin: 7px 0 12px 5px !important;
                    }
                    .res-nightmode .content {
                        margin-left: 0px !important;
                        margin-top: 0px !important;
                    }
                    .res-nightmode body.with-listing-chooser.listing-chooser-collapsed>.content {
                        margin-left: 0px !important;
                    }
                    .res-nightmode body.with-listing-chooser.listing-chooser-collapsed .listing-chooser {
                        padding-right: 0px !important;
                    }
                    .res-nightmode body.with-listing-chooser.listing-chooser-collapsed .listing-chooser .grippy {
                        width: 0px !important;
                    }
                    .res-nightmode .content .spacer {
                        margin-bottom: 0px !important;
                    }
                    .res-nightmode .NERPageMarker {
                        background-color: rgb(24, 24, 24);
                        margin: 0px !important;
                    }
                    .res-nightmode .thing.odd.link {
                        padding: 7px !important;
                        margin: 0;
                        background-color: rgb(34, 34, 34);
                    }
                    .res-nightmode .thing.even.link {
                        background: rgb(24, 24, 24);
                        padding: 7px !important;
                        margin: 0;
                    }
                    .res-nightmode .midcol .score, .res-nightmode .moduleButton:not(.enabled) {
                        color: #c6c6c6 !important;
                    }
                    .res-nightmode .rank .star,
                    .res-nightmode .link .score.likes,
                    .res-nightmode .linkcompressed .score.likes {
                        color: rgb(255, 69, 0) !important;
                    }
                    .res-nightmode .rank .star,
                    .res-nightmode .link .score.dislikes,
                    .res-nightmode .linkcompressed .score.dislikes {
                        color: rgb(140, 179, 217) !important;
                    }
                    .res-nightmode .content {
                        border-color: rgb(17, 17, 17);
                    }
                    .res-nightmode .wiki-page .wiki-page-content .md.wiki > .toc ul,
                    .res-nightmode .tabmenu li a,
                    .res-nightmode .tabmenu li.selected a {
                        background-color: rgb(34, 34, 34) !important;
                    }
                    .res-nightmode .link .rank {
                        color: #c6c6c6 !important;
                    }
                    .res-nightmode .domain a {
color: rgb(173, 216, 230) !important;
                    }
                    .res-nightmode .subreddit {
                        color: rgba(20, 150, 220, 0.8) !important;
                    }
                    .res-nightmode .author {
                        color: rgba(20, 150, 220, 0.8) !important;
                    }
                    .res-nightmode .live-timestamp {
                        color: #B3B375 !important;
                    }
                    .res-nightmode .RES-keyNav-activeElement > .tagline,
                    .res-nightmode .RES-keyNav-activeElement .md-container > .md,
                    .res-nightmode .RES-keyNav-activeElement .md-container > .md p {
                        color: rgb(187, 187, 187) !important;
                    }
                    .res-nightmode .flair, .res-nightmode .linkflairlabel {
                        background-color: rgb(187, 187, 187);
                        color: rgb(0, 0, 0);
                        padding: 1px;
                    }
                    .res-nightmode:not(.res-nightMode-coloredLinks) .thing:not(.stickied) .title:visited,
                    .res-nightmode:not(.res-nightMode-coloredLinks) .thing.visited:not(.stickied) .title,
                    .res-nightmode:not(.res-nightMode-coloredLinks).combined-search-page .search-result a:visited,
                    .res-nightmode:not(.res-nightMode-coloredLinks).combined-search-page .search-result a:visited>mark {
                        color: rgb(120, 120, 120);
                    }
                    .res-nightmode .md,
                    .res-nightmode .content .sitetable .thing .md,.res-nightmode .RES-keyNav-activeElement .md-container > .mdp {
                        color: rgb(222, 222, 222) !important;
                    }
                    .res-nightmode .combined-search-page .search-result a {
                        color: rgb(222, 222, 222);
                    }
                    .res-nightmode .entry .buttons li a {
                        color: rgb(150, 150, 150) !important;
                    }
                    .res-nightmode #RESSubredditGroupDropdown,
                    #RESSubredditGroupDropdown > .RESShortcutsEditButtons {
                        background-color: rgb(68, 68, 68) !important;
                        border-color: rgb(128, 128, 128) !important;
                    }
                    .res-nightmode .spoiler-stamp {
                        color: #c76700 !important;
                    }
                    .res-nightmode .entry.res-selected,
                    .res-nightmode .entry.res-selected .md-container {
                        background-color: rgba(0, 0, 0, 0)!important;
                    }
                    /* BUTTONS */
                    .res-nightmode .thing .expando-button,
                    .res-nightmode .thing .expando-button:hover,
                    .res-nightmode .expando-button,
                    .res-nightmode .expando-button:hover {
                        background-image: url("https://s3.amazonaws.com/a.thumbs.redditmedia.com/PkckcN8_3ijRUVP-GUQ6E-c8Ash_jQ3kCrEAoqKjSC4.png") !important;
                        transform: scale(1);
                        -webkit-filter: grayscale(0%) invert(0%);
                        background-color: transparent;
                    }
                    .res-nightmode .expando-button.video-muted.collapsed {
                        background-position: 0px -384px !important;
                    }
                    .res-nightmode .expando-button.video-muted.collapsed:hover {
                        background-position: 0px -408px !important;
                    }
                    .res-nightmode .expando-button.video-muted.expanded {
                        background-position: 0px -432px !important;
                    }
                    .res-nightmode .expando-button.video-muted.expanded:hover {
                        background-position: 0px -456px !important;
                    }
                    .res-nightmode .expando-button.selftext.collapsed {
                        background-position: 0px -96px !important;
                    }
                    .res-nightmode .expando-button.selftext.collapsed:hover {
                        background-position: 0px -120px !important;
                    }
                    .res-nightmode .expando-button.selftext.expanded {
                        background-position: 0px -144px !important;
                    }
                    .res-nightmode .expando-button.selftext.expanded:hover {
                        background-position: 0px -168px !important;
                    }
                    .res-nightmode .expando-button.image.gallery.collapsed {
                        background-position: 0px -288px !important;
                    }
                    .res-nightmode .expando-button.image.gallery.collapsed:hover {
                        background-position: 0px -312px !important;
                    }
                    .res-nightmode .expando-button.image.gallery.expanded {
                        background-position: 0px -336px !important;
                    }
                    .res-nightmode .expando-button.image.gallery.expanded:hover {
                        background-position: 0px -360px !important;
                    }
                    .res-nightmode .expando-button.video.collapsed {
                        background-position: 0px -192px !important;
                    }
                    .res-nightmode .expando-button.video.collapsed:hover {
                        background-position: 0px -216px !important;
                    }
                    .res-nightmode .expando-button.video.expanded {
                        background-position: 0px -240px !important;
                    }
                    .res-nightmode .expando-button.video.expanded:hover {
                        background-position: 0px -264px !important;
                    }
                    .res-nightmode .expando-button.collapsed.crosspost {
                        background-position: 0px -96px !important;
                    }
                    .res-nightmode .expando-button.collapsed.crosspost:hover {
                        background-position: 0px -120px !important;
                    }
                    .res-nightmode .expando-button.expanded.crosspost {
                        background-position: 0px -144px !important;
                    }
                    .res-nightmode .expando-button.expanded.crosspost:hover {
                        background-position: 0px -168px !important;
                    }
                    .res-nightmode .expando-button.image.collapsed {
                        background-position: 0px 0px !important;
                    }
                    .res-nightmode .expando-button.image.collapsed:hover {
                        background-position: 0px -24px !important;
                    }
                    .res-nightmode .expando-button.image.expanded {
                        background-position: 0px -48px !important;
                    }
                    .res-nightmode .expando-button.image.expanded:hover {
                        background-position: 0px -72px !important;
                    }
                    /* COMMENTS */
                    .res-nightmode .res-commentBoxes .comment {
                        border-left-width: 0px !important;
                        border-right-width: 0px !important;
                        border-top-width: 0px !important;
                        border-bottom-width: 0px !important;
                    }
                    .res-nightmode .linkflairlabel, .res-nightmode .flair {
                        padding-top: 0px !important;
                        padding-left: 2px !important;
                        padding-right: 2px !important;
                    }
                    .res-nightmode.res-commentBoxes .comment,
                    .res-nightmode.res-commentBoxes .comment .comment .comment,
                    .res-nightmode.res-commentBoxes .comment .comment .comment .comment .comment,
                    .res-nightmode.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment,
                    .res-nightmode.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment .comment .comment {
                        background-color: rgb(24, 24, 24) !important;
                    }
                    .res-nightmode.res-commentBoxes body .comment .comment,
                    .res-nightmode.res-commentBoxes body .comment .comment .comment .comment,
                    .res-nightmode.res-commentBoxes body .comment .comment .comment .comment .comment .comment,
                    .res-nightmode.res-commentBoxes body .comment .comment .comment .comment .comment .comment .comment .comment,
                    .res-nightmode.res-commentBoxes body .comment .comment .comment .comment .comment .comment .comment .comment .comment .comment {
                        background-color: rgb(34, 34, 34) !important;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  function toggleSubmitUnderlay(enabled) {
    GM_setValue(config.enableSubmitUnderlay, enabled);
    const styleId = styleIds.submitUnderlay;
    if (enabled) {
      GM_addStyle(
        `
                    .submit-link-underlay {
                        margin-top: 5px;
                        padding: 5px;
                        background-color: transparent;
                        display: flex;
                        align-items: center;
                        font-family: verdana, sans-serif;
                        font-size: 11px;
                        color: dimgray;
                    }
                    .submit-link-underlay img {
                        max-width: 40px;
                        max-height: 40px;
                        margin-right: 5px;
                    }
                    .submit-link-underlay p {
                        margin: 0;
                    }
                `,
        { id: styleId }
      );

      let underlayAdded = false;
      function addUnderlay() {
        const submitLink = document.querySelector(".submit-link");
        if (submitLink && !underlayAdded) {
          const underlay = document.createElement("div");
          underlay.className = "submit-link-underlay";

          const image = document.createElement("img");
          image.src = "https://files.catbox.moe/4zv032.png";

          const textContainer = document.createElement("div");
          textContainer.innerHTML = `<p>to anything interesting: news article, blog entry, video, picture...</p>`;

          underlay.appendChild(image);
          underlay.appendChild(textContainer);
          submitLink.parentNode.insertBefore(underlay, submitLink.nextSibling);
          underlayAdded = true;
        }
      }
      addUnderlay();
      const targetNode = document.body;
      const config = { childList: true, subtree: true };
      const observer = new MutationObserver(function (mutationsList) {
        for (const mutation of mutationsList) {
          if (mutation.addedNodes.length && !underlayAdded) {
            addUnderlay();
          }
        }
      });
      observer.observe(targetNode, config);
    } else {
      document.getElementById(styleId)?.remove();
      const underlay = document.querySelector(".submit-link-underlay");
      if (underlay) {
        underlay.remove();
      }
    }
  }

  function toggleClassicResBorderHighlight(enabled) {
    GM_setValue(config.classicResBorderHighlight, enabled);
    const styleId = styleIds.classicResBorderHighlight;
    if (enabled) {
      GM_addStyle(
        `
                    .entry.res-selected {
                        border: dimgray 2px dotted;
                    }
                `,
        { id: styleId }
      );
    } else {
      document.getElementById(styleId)?.remove();
    }
  }

  const headerArea = document.getElementById("sr-header-area");
  if (headerArea) {
    const betaOptin = headerArea.querySelector(".redesign-beta-optin");
    const premiumBanner = headerArea.querySelector(".premium-banner-outer");

    if (betaOptin) {
      betaOptin.remove();
    }
    if (premiumBanner) {
      premiumBanner.remove();
    }
  }
  const style = document.createElement("style");
  style.textContent = `
            .premium-banner {
                display: none !important;
            }
        `;
  document.head.appendChild(style);

  window.addEventListener("load", () => {
    toggleHideMultibar(GM_getValue(config.hideMultibar));
    toggleHideBell(GM_getValue(config.hideBell));
    toggleHideChat(GM_getValue(config.hideChat));
    toggleAddUserPrefix(GM_getValue(config.addUserPrefix));
    toggleHideArchivedArrows(GM_getValue(config.hideArchivedArrows));
    toggleOldCommentFont(GM_getValue(config.oldCommentFont));
    toggleFullUserScores(GM_getValue(config.fullUserScores));
    toggleOldRedditIcons(GM_getValue(config.oldRedditIcons));
    toggleExpandoButtons(GM_getValue(config.expandoButtons));
    toggleClassicRESNight(GM_getValue(config.classicRESNight));
    toggleSubmitUnderlay(GM_getValue(config.enableSubmitUnderlay));
    toggleClassicResBorderHighlight(
      GM_getValue(config.classicResBorderHighlight)
    );
    classicFlair(GM_getValue(config.classicFlair)); // Call classicFlair on load
  });

  if (
    window.location.hostname === "old.reddit.com" ||
    window.location.hostname === "www.reddit.com"
  ) {
    initializeViewCounter();
    initializeVoteEstimator();
  }
})();

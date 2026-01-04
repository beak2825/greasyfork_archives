// ==UserScript==
// @name         LemmyTools
// @namespace    https://thesimplecorner.org/c/lemmytools
// @version      0.2.1.0
// @description  A small suite of tools to make Lemmy easier.
// @author       howdy@thesimplecorner.org
// @author       @cwagner@lemmy.cwagner.me
// @grant        none
// @include      https://*
// @downloadURL https://update.greasyfork.org/scripts/469169/LemmyTools.user.js
// @updateURL https://update.greasyfork.org/scripts/469169/LemmyTools.meta.js
// ==/UserScript==

(function () {
  "use strict";
  if (!isLemmySite()) { //not lemmy
    return;
  }
  else //is Lemmy Do!
  {
  // ------------ EDIT THIS VARIABLE ---------------------
  const homeInstance = "";
	// -----------------------------------------------------
  // homeInstance - Fixes remote Instance home link. Example: const homeInstance = "https://lemmy.world";
    
    
  /* NOTHING NEEDS CHANGED BELOW */
    
    
  const LogDebug = 0;
  const LogInformation = 1;
  const LogImportant = 2;
    
  // Choose a log level for the console:
  const logLevel = LogDebug;
  // const logLevel = LogInformation;
  // const logLevel = LogImportant;
  // ------------ END EDIT AREA --------------------------
 
  //Nothing below needs editing.
  // -------------- VERSION -------------------
  const ltVer = "0.2.1.0";
  const ltTestedVer = "0.19.1";
  //--------------------------------------------

  /* Globals */

  const mobile = isltMobile();
  let remoteCommunityArray = [];
  let prevSearchCommsQueries = [];
  prevSearchCommsQueries.push("");
  let currentUrl = document.location.href;

  /**
   * @type {Map<string, {Text: string, Color: string, Url?: string}>}
   */
  let userMap;

  function isHomeInstanceSet(i2c) {
    return i2c.length > 3;
  }

  function ltLog(msg, level) {
    level = level || LogImportant;
    if (level < logLevel) return;
    console.log("[LemmyTools]", msg);
  }


  function notHomeAndInCommunity(url) {
    return (
      url.includes(settings.instance) === false &&
      (url.includes("/c/") ||
        url.includes("/post/") ||
        url.includes("/comment/") ||
        url.includes("/communities"))
    );
  }

  function isltMobile() {
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      ltLog("is mobile!");
      return true;
    } else {
      ltLog("is desktop!");
      return false;
    }
  }

  //Remote Instance
  function update(comm, commName, subString) {
    try {
      if (comm) {
        const browsedComm = `<li><h5>${comm}</h5></li>
<li>
    <a href='${homeInstance}/c/${commName}' target='_blank'><button type="button" class='ltbutton'>Browse/Sub on Home Instance</button></a>
</li>`;
        remoteCommunityArray.push(browsedComm);
      }
    } catch {}

    return remoteCommunityArray;
  }

  //Searches communityArray for results in LemmyTools Sidebar.
  function searchComms(query, full) {
    ltLog(`commsearch evt searchinput${query}${commsAreaStatic}`, LogDebug);
    const url = window.location.href;
    query = query || "";
    query = query.toLowerCase();
  
    if ((query == "-f") && (prevSearchCommsQueries.length < 2)) {
      const commsCount = localStorage.getItem("commsCount");
      if (commsCount == null || commsCount == 0 || full.length < 1) {
        commsAreaStatic[0].innerHTML = `<hr /><b>Welcome to LemmyTools! Ver ${ltVer}!</b><br /><br />
First time? Set your lemmy homeinstance in the option page and in the UserScript.<br />
No communities? Login to lemmy and reload page.`;
      } else {
        commsAreaStatic[0].innerHTML = `Communities: ${commsCount} - <hr />${full}`;
      }
    } else {
      //This searches the pushed communityArray with the query, saves it to a array, removes any duplicate values, sorts and then pushes to the commupdate function.
      commsAreaStatic[0].innerHTML = full;
      //if searchInput query, store it for use on another page
      if (query.length > 2)
      {
      prevSearchCommsQueries.push(query);
   	  localStorage.setItem("prevSearchCommsQueries", prevSearchCommsQueries);
      }
      //ltLog(`Searching for:${query}`, LogDebug);
      const children = commsAreaStatic[0].getElementsByTagName("li");
      //ltLog(`Children found: ${children.length}`, LogDebug);
      let data = [""];
      let found;
      for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML.toLowerCase().indexOf(query) !== -1) {
          found = children[i].innerHTML + "<br />";
          //ltLog(`Found: ${found}`, LogDebug);
          data.push(found);
        }
      }
      const resultSet = [...new Set(data)];
      resultSet.sort();
      
      if (currentUrl.indexOf(query) !== -1)
      {
      	commupdate(url, resultSet, query);
      }
      else
      {
        commupdate(url, resultSet, query);  
      }
    }
  }

  function commupdate(page, data, query) {
    ltLog("LTbar Update");
    let count = -1;
    data.forEach((_) => count++);
    data = data.join("");
   
    for (let i = 0; i < commsAreaSearch.length; i++)
    {
  	commsAreaSearch[i].innerHTML = `Communities: ${count}<hr /> ${data}`;
    }

    for (let i = 0; i < commsAreaStatic.length; i++)
    {
  	commsAreaStatic[i].innerHTML = `Communities: ${count}<hr /> ${data}`;
    }
    if (query.length > 2)
    {
   	searchInput.value = query;
    }
  }
  const optionsKey = "LemmyToolsOptions";

  function getSettingsFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem(optionsKey) || "{}");
    } catch (_) {
      return {};
    }
  }

  /**
   * Gets all currently tagged users
   *
   * @return {Map<string, {Text: string, Color: string, Url: string}>} A Map of tagged users
   */
  function getUserCommentsFromLocalStorage() {
    try {
      const notes = localStorage.getItem(optionsKey + "-userNotes") || "[]";
      return new Map(JSON.parse(notes));
    } catch (e) {
      console.error(e);
      return new Map();
    }
  }

  function saveUserCommentsToLocalStorage() {
    localStorage.setItem(
      optionsKey + "-userNotes",
      JSON.stringify(Array.from(userMap))
    );
  }

  function options(open) {
    const odiv = document.getElementById("ltOptions");
    ltLog(`Options Functions: ${open}`);
    let userOptions = {};
    if (open === 1) {
      odiv.style.display = "block";
    } else if (open === 2) {
      //First run set defaults or pull from localstorage.
      const mobile = isltMobile();
      userOptions = Object.assign(
        {},
        {
          commposSide: mobile ? "top" : "top",
          reverseSide: mobile ? "left" : "right",
          instance: homeInstance || window.location.origin,
          commposVertical: 0,
          expandImages: true,
          hideSideBar: false,
          expandImagesize: mobile ? 100 : 50,
          hoverCheck: false,
          unblurNSFW: false,
          widthPixels: false,
          blockContent: false,
          blockFilters: "",
          expandImageSpeed: 0.5,
          showAllImages: false,
          hideShowAllImagesButton: false,
          linksInNewTab:false,
        },
        getSettingsFromLocalStorage()
      );
      localStorage.setItem(optionsKey, JSON.stringify(userOptions));
      userMap = getUserCommentsFromLocalStorage();
    } else if (open === 3) {
      //save button
      odiv.style.display = "none";
      localStorage.setItem("currentBlockCount", 0);

      userOptions.commposSide =
        document.getElementById("option_commposSide").value;
      userOptions.instance = document.getElementById(
        "option_homeInstance"
      ).value;
      userOptions.commposVertical = parseInt(
        document.getElementById("option_commposVertical").value
      );
      userOptions.expandImages = document.getElementById(
        "option_expandImages"
      ).checked;
      userOptions.expandImagesize = parseInt(
        document.getElementById("option_expandImagesize").value,
        10
      );
      userOptions.expandImageSpeed = parseFloat(
        document.getElementById("option_expandImageSpeed").value
      );
      userOptions.hideSideBar =
        document.getElementById("option_hideSideBar").checked;
      userOptions.hoverCheck =
        document.getElementById("option_hoverCheck").checked;
      userOptions.unblurNSFW =
        document.getElementById("option_unblurNSFW").checked;
      userOptions.blockContent =
        document.getElementById("option_blockContent").checked;
      userOptions.blockFilters =
        document.getElementById("option_blockFilters").value.split(",");
      userOptions.linksInNewTab = document.getElementById(
        "option_linksInNewTab"
      ).checked;
      userOptions.widthPixels =
        document.getElementById("option_widthPixels").checked;
      userOptions.showAllImages = document.getElementById(
        "option_showAllImages"
      ).checked;
      userOptions.hideShowAllImagesButton = document.getElementById(
        "option_hideShowAllImagesButton"
      ).checked;

      if (userOptions.commposVertical > 85) {
        userOptions.commposVertical = 85;
      } else if (userOptions.commposVertical <= -1) {
        userOptions.commposVertical = 0;
      }

      if (userOptions.expandImageSpeed > 1) {
        userOptions.expandImageSpeed = 1;
      } else if (userOptions.expandImageSpeed < 0) {
        userOptions.expandImageSpeed = 0;
      }

      if (userOptions.commposSide === "left") {
        userOptions.reverseSide = "right";
      } else {
        userOptions.reverseSide = "left";
      }

      localStorage.setItem(optionsKey, JSON.stringify(userOptions));
      location.reload(true);
    }

    userOptions = getSettingsFromLocalStorage();
    ltLog(`Settings ${JSON.stringify(userOptions)}`);
    return userOptions;
  }

  //Used for offset removal
  function removeClassByWildcard(divClass) {
    // If the class ends with a "*", then it matches all classes that start with the given class name.
    if (divClass.endsWith("*")) {
      divClass = divClass.replace("*", "");
      // Get all elements with the given class name.
      const elements = document.getElementsByTagName("div");
      const re = new RegExp("(^|s)" + divClass + "(s|$)");
      const result = [];
      let className = "";

      for (let i = 0; i < elements.length; i++) {
        if (re.test(elements[i].className)) {
          console.log("Match: " + elements[i]);
          result.push(elements[i]);
          for (let y = 0; y < elements[i].classList.length; y++) {
            if (elements[i].classList[y].indexOf(divClass) !== -1) {
              className = elements[i].classList[y];
              console.log(className);
            }
          }
        }
      }
      // Remove the class from all elements.
      for (let i = 0; i < result.length; i++) {
        result[i].classList.remove(className);
      }
    } else {
      // Otherwise, the class must match exactly.
      const elements = document.querySelectorAll("[class=" + divClass + "]");

      // Remove the class from all elements.
      for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(divClass);
      }
    }
  }

  const colors = new Map([
    ["transparent", "inherit"],
    ["tomato", "white"],
    ["darkorange", "white"],
    ["gold", "black"],
    ["yellowgreen", "white"],
    ["lightseagreen", "white"],
    ["teal", "white"],
    ["indianred", "black"],
    ["lightcoral", "black"],
    ["lightpink", "black"],
    ["mistyrose", "black"],
    ["purple", "white"],
    ["crimson", "white"],
    ["teal", "white"],
    ["darkslategray", "white"],
  ]);

  function addNotesToLinks(userNodes) {
	const userNameRegex = /\/u\/(.+)$/;
    for (const node of userNodes) {
      let userName;
      try {
        userName = node.href.match(userNameRegex)[1];
      } catch (error) {
        console.error(error, node, node.href);
      }
      let alreadyHadSpan = false;
      let span;
      const existing = node.getElementsByClassName("userNote");
      if (existing.length === 1) {
        alreadyHadSpan = true;
        span = existing[0];
      } else span = document.createElement("span");

      span.innerHTML = "🏷";
      if (userMap.has(userName)) {
        span.innerHTML = userMap.get(userName).Text;
        span.style.backgroundColor = userMap.get(userName).Color;
        span.style.color = colors.get(userMap.get(userName).Color);
      }
      span.classList.add("userNote", "badge");
      span.dataset.user = userName;
      if (!alreadyHadSpan) {
        span.addEventListener("click", tagClick);
        node.appendChild(span);
      }
      node.classList.add("hasNote");
    }
  }

  function tagUsers() {
    setInterval(() => {
      const userNodes = document.querySelectorAll(
        ".person-listing:not(.hasNote)"
      );
      addNotesToLinks(userNodes);
    }, 500);
  }

  function tagClick(clickEvent) {
    clickEvent.preventDefault();
    const userName = clickEvent.currentTarget.dataset.user;
    const dialog = document.createElement("dialog");
    let colorOptions = "";
    colors.forEach(
      (val, key) =>
        (colorOptions += `<option style="color: ${val}; background-color: ${key}" value="${key}">${key}</option>`)
    );
    dialog.classList.add("userTagger");
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) {
        closeDialog(dialog);
      }
    });
    dialog.innerHTML = `<div style="width: 350px;">
  <strong>${userName}</strong>
  <form id="userTag">
    <div>
      <label for="userTagText">Text</label>
      <input type="text" id="userTagText" value="">
    </div>
    <div>
      <label for="userTagColor">Color</label>
      <select id="userTagColor">
        ${colorOptions}
      </select>
    </div>
    <div>
      <button type="submit">✓ save tag</button>
      <button formmethod="dialog">× cancel</button>
    </div>
  </form>
</div>`;

    const userTagText = dialog.querySelector("#userTagText");
    const userTagColor = dialog.querySelector("#userTagColor");
    if (userMap.has(userName)) {
      userTagText.value = userMap.get(userName).Text;
      userTagColor.value = userMap.get(userName).Color;
    }
    const form = dialog.querySelector("#userTag");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (e.submitter.formMethod === "dialog") {
        closeDialog(dialog);
        return;
      }
      if (userTagText.value.length) {
        if (!userMap.has(userName))
          userMap.set(userName, { Text: "", Color: "" });
        userMap.get(userName).Text = userTagText.value;
        userMap.get(userName).Color = userTagColor.value;
      } else {
        userMap.delete(userName);
      }
      addNotesToLinks(document.querySelectorAll(`[href="/u/${userName}"]`));
      saveUserCommentsToLocalStorage();
      closeDialog(dialog);
    });
    document.body.appendChild(dialog);
    dialog.showModal();
  }
  function closeDialog(dialog) {
    dialog.close();
    dialog.remove();
  }
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  //Expand all images on page
  function allImages(show) {
    let clickableImages = document.getElementsByClassName(
      "thumbnail rounded overflow-hidden d-inline-block position-relative p-0 border-0 bg-transparent"
    );

    //ltLog(clickableImages.length, LogDebug);
    //ltLog(clickableImages, LogDebug);
    if (show) {
      for (let i = 0; i < clickableImages.length; i++) {
        try {
          console.log(clickableImages[i]);

          clickableImages[i].click();
        } catch {}
      }
    } else {
      //lazy - need to figure out way to handle on dom iter
      location.reload(true);
      // for (let i = 0; i < clickableImages.length; i++) {
      //   try {
      //     clickableImages[i].click();
      //     clickableImages[i].click();
      //   } catch {}
      // }
    }
  }


  function linksInNewTab() {
    const links = document.getElementsByTagName("a");
    for (let i = 0; i < links.length; i++) {
      links[i].setAttribute("target", "_blank");
      links[i].setAttribute("rel", "noreferrer");
    }
  }
    
  function blockContent(filters) {
    const blockFilters = filters;
    const posts = document.getElementsByClassName("post-listing");
    const comments = document.getElementsByClassName("comment");
   
   
    var blockedCount = 0;
    for (let y = 0; y < blockFilters.length; y++) {
      if (blockFilters[y].length >= 1)
        {
          blockFilters[y] = addslashes(blockFilters[y]);
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].innerHTML.toLowerCase().indexOf(blockFilters[y].toLowerCase()) !== -1) {
            blockedCount++
            
            posts[i].setAttribute("style", "display: none !important;");
            //posts[i].innerHTML = "<div class='card small'>Post blocked due to filter: " + blockFilters[y] + "</div>"
          }
        }
        for (let x = 0; x < comments.length; x++) {
          if (comments[x].innerHTML.toLowerCase().indexOf(blockFilters[y].toLowerCase()) !== -1) {
            blockedCount++
            comments[x].setAttribute("style", "display: none !important;");
            //comments[x].innerHTML = "<div class='card small'>Post blocked due to filter: " + blockFilters[y] + "</div>"
          }
        }
         
      }
    }
    localStorage.setItem("currentBlockCount", blockedCount);
    ltLog("content blocking has blocked: " + blockedCount + " posts.", 2)
  }
    
	function addslashes( str ) {
    return (str + '').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
	}

  // LemmyTools

  //check if first run or load saved settings
  let settings = options(2);


  function checkedIfTrue(val) {
    return val ? "checked" : "";
  }
  

  /* Script */
  let url = document.location.href;
  window.onload = () => {
    if (settings.showAllImages) allImages(true); // initial expansion
    const body = document.querySelector("body");
    const observer = new MutationObserver((_) => {
      if (url !== document.location.href) {
        url = document.location.href;
        if (settings.showAllImages) {
          // todo there has to be a better way to wait for the content to be loaded …
          var imagesTimer = setTimeout(allImages, 5000);
          clearTimeout(imagesTimer);
          //allImages(true);
        }
      }
    });
    observer.observe(body, { childList: true, subtree: true });
  };
  let count = 0;
  let eIcheck = checkedIfTrue(settings.expandImages);
  let hSBcheck = checkedIfTrue(settings.hideSideBar);
  let hoverCheck = checkedIfTrue(settings.hoverCheck);
  let unblurCheck = checkedIfTrue(settings.unblurNSFW);
  let blockContentCheck = checkedIfTrue(settings.blockContent);
  let widthPixelCheck = checkedIfTrue(settings.widthPixels);
  let widthPercentCheck = checkedIfTrue(!settings.widthPixels);
  let showAllImagesCheck = checkedIfTrue(settings.showAllImages);
  let linksCheck = checkedIfTrue(settings.linksInNewTab);
  let hideShowAllImagesButtonCheck = checkedIfTrue(
    settings.hideShowAllImagesButton
  );

  //Option Divs
  //Is HomeInstance Manually Set For WorkAround

  var hIAlertString = isHomeInstanceSet(homeInstance)
    ? ""
    : "<b style='color: red;'>Your Home Instance has not been manually set in the UserScript.</b><br />";

  //Create Lemmy Tools Elements ----------------------------------------

  const odiv = document.createElement("div");
  odiv.setAttribute("id", "ltOptions");
  odiv.setAttribute("style", "display: none;")
  odiv.classList.add("card", "border-secondary", "ltoptions");
  odiv.innerHTML = `
    <h4>LemmyTools ${ltVer} Options - <button class='pointer btn btn-secondary text-bg-primary' id='LTsaveoptions'>Save&Close</button></h4>
  </hr>
  <div class='table-responsive'>
    <table class='table'>
      <thead class='pointer'>
        <tr>
          <th>Option:</th>
          <th>Value:</th>
      </thead>
      </tr>
      <tbody>
        <tr>
          <td><b>LemmyTools Settings: </b></td>
          <td></td>
        </tr>
        <tr>
          <td><b>HomeInstance URL</b><br /> Make sure to edit the homeInstance variable of<br /> the UserScript for the
            remote instance Home button fix. (Temporary workaround).<br />(Ex:
            https://yourinstance.lemmy)<br />${hIAlertString}</td>
          <td><textarea id='option_homeInstance'>${settings.instance}</textarea></td>
        </tr>
        <tr>
          <td><b>LemmyTools bar window side</b><br /> - default: right</td>
          <td><select id="option_commposSide">
              <option value='${settings.commposSide}'>${settings.commposSide}</option>
							<option value='top'>top</option>
              <option value='right'>right</option>
              <option value='left'>left</option>
            </select></td>
        </tr>
        <tr>
          <td><b>LemmyTools bar vertical position </b><br />% from top [0-85] - default: 0</td>
          <td><textarea id='option_commposVertical'>${settings.commposVertical}</textarea></td>
        </tr>
        <tr>
          <td><b>Keep LemmyTools Bar Open</b><br />Works best for widescreen desktops.</td>
          <td><input type='checkbox' id='option_hoverCheck' ${hoverCheck} /></td>
        </tr>
        <tr>
          <td><br /><br /></td>
          <td></td>
        </tr>
        <tr>
          <td><b>Site Style and Behaviors:</b></td>
          <td></td>
        </tr>
        <tr>
          <td><b>Hide Lemmy Sidebars</b><br /> (Trending, ServerInfo, Communities)<br /> 
          </td>
          <td><input type='checkbox' id='option_hideSideBar' ${hSBcheck} /></td>
        </tr>
        <tr>
          <td><b>Expandable Images</b><br />Acts as an auto-expander and adds the ability to manually<br /> expand
            images by clicking and dragging.<br />Doubleclick to open full image.</td>
          <td><input type='checkbox' id='option_expandImages' ${eIcheck} /></td>
        </tr>
        <tr>
          <td><b>Auto Expand Size</b><br />Size of post image after opening a image post.<br /> Desktop Default: 50 /
            Mobile: 100</td>
          <td><textarea id='option_expandImagesize'>${settings.expandImagesize}</textarea>
          <br /> <label for="option_widthPixels">Pixels</label> <input type='radio' id='option_widthPixels' name="widthScaler" ${widthPixelCheck}/> 
          <label for="option_widthPercent">Percent</label> <input type='radio' id='option_widthPercent' name="widthScaler" ${widthPercentCheck}/>
          </td>
        </tr>
        <tr>
          <td><b>Expand Image Speed</b><br />Speed multiplier for click&drag expanding images. If your images seem to
            expand<br /> too fast or slow, increase or decrease this value. [Values 0 to 1.0]<br /> Default: 0.50 </td>
          <td><textarea id='option_expandImageSpeed'>${settings.expandImageSpeed}</textarea></td>
        </tr>
        <tr>
            <td><b>Automatically open image posts</b><br /></td>
            <td><input type='checkbox' id='option_showAllImages'${showAllImagesCheck}/></td>
        </tr>
        <tr>
            <td><b>Hide the Show All Images button (when Auto open image posts is disabled)</b><br /></td>
            <td><input type='checkbox' id='option_hideShowAllImagesButton'${hideShowAllImagesButtonCheck}/></td>
        </tr>
        <tr>
          <td><b>Auto unblur NSFW images</b><br /></td>
          <td><input type='checkbox' id='option_unblurNSFW' ${unblurCheck} /></td>
        </tr>
        <tr>
          <td><b>Open ALL links in new tab.</b><br /></td>
          <td><input type='checkbox' id='option_linksInNewTab' ${linksCheck} /></td>
        </tr>
        <tr>
          <td><b>Content Blocking: (Blocks posts and comments matching your desired filters).</b><br /></td>
          <td><input type='checkbox' id='option_blockContent' ${blockContentCheck} /></td>
        </tr>
        <tr>
          <td>Add filters seperated by commas. Ex: filter,filter two,filter3 <br />
          <textarea style="width:100%; "id='option_blockFilters'>${settings.blockFilters}</textarea></td>
          <td>Posts/Comments blocked from filters on this page:<br />${localStorage.getItem("currentBlockCount")}</td>
        </tr>
 
        <tr>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
  <p> Tested on Lemmy Version: ${ltTestedVer} on Firefox. <br />

  <hr /><Get it here: <a
    href='https://github.com/howdy-tsc/LemmyTools'>GitHub</a> or <a
    href='https://greasyfork.org/en/scripts/469169-lemmytools'>GreasyFork</a><br />Please submit issues to the GitHub
  for feature requests and problems: <a href='https://github.com/howdy-tsc/LemmyTools/issues'>GitHub LemmyTools
    Issues</a><br /></p>

	<h5>Attributes/Credit: </h5>
	<li><b>@cwagner@lemmy.cwagner.me</b> - For coding, code cleanup, and mentoring.</li>
 	<li><b>Charles Machalow - csm10495</b> - Coding contribution(s).</li> 
  	<li><b>jimmyhiggs337</b> - Coding contribution(s).</li>
`;

  //Adjust clickable area for mobile (add brandingString if desktop)
  let brandingString = "";
  if (mobile !== true) {
    brandingString =
      "<span id='brandingText' style='vertical-align: super !important; writing-mode: vertical-lr; text-orientation: mixed;'>LemmyTools</span>";
  }

  //Comm divs


    const div = document.createElement("div");
    div.setAttribute("id", "myDiv");
    div.classList.add("ltcommsbar");

    const touchdiv = document.createElement("div");
    touchdiv.setAttribute("id", "touchdiv");

    const idiv = document.createElement("div");
    idiv.setAttribute("id", "searchdiv");
    idiv.classList.add("ltmenu", "border-secondary", "card");
 
  // todo on input

    idiv.innerHTML = `
    <div id='ltActiveSearchDiv' class='ltActiveSearchDiv'>
      <header id='ltBarHeader' class='card-header'>
        <h6><a href=${settings.instance}>Home</a> - <a href='https://lemmyverse.net/communities' target='_new'>Find
            Subs</a> - <img id="lemmyLogo" width=22 height=22 class='targetImg'
                          src='data:image/webp;base64,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' />
            <img id="lemmyOptionsIcon" width=22 height=22 class='targetImg' alt"LemmyTools Options" title="LemmyTools Options"
              src="data:image/png;base64,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AAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAII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" />

  </h6>
      </header><input type='text' id='commsearch' name='commsearchinput'
        placeholder='Search your subscriptions (or visted subs)' />
      <div id='ltBarSubHeader' class='clickAble'>LemmyTools ${ltVer}</div>
      <div style='clear:both;'></div>
    </div>
    <div id='ltPassiveSearchDiv' class='ltPassiveSearchDiv'><img width=30 height=30 class='targetImg'
        src='data:image/webp;base64,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' />${brandingString}
    </div><br />`;


    
  let styleString = `
  .ltmenu {
      position: fixed;
      top: ${settings.commposVertical}%;
      ${settings.commposSide}: 0;
      font-size: .9rem;
      display: block;
      height: 100%;
      min-height: auto;
      z-index: 999;
      overflow: scroll;
      outline: 1px solid grey !important;
    }

    .ltActiveSearchDiv {
      font-size: 0.9rem;
      width: 100%;
    }

	  .ltActiveSearchDiv img:hover{
      margin-top:-5px;
      border:10px yellow;
      }


    .ltmenu input {
      width: 100%;
    }

    .ltPassiveSearchDiv {
      display: none;
      width: 100%;
    }	

    .post-listings .img-expanded {
      width: ${settings.expandImagesize}${settings.widthPixels ? "px" : "%"};
			max-height: none !important;
    }

    #myDiv li {
      list-style-type: none;
    }

    #myDiv hr {
      display: block;
    }

    #searchdiv {
      ${settings.commposSide}: 0;
      position: fixed;
      height: 100%;
      min-height: auto;
      width: 240px;
      display: block;
      z-index: 999;
      overflow: scroll;
      transition-timing-function: ease;
      transition: ${settings.commposSide} .25s;
      transition-delay: 0, 0.25s;
      overflow: auto;
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .ltbutton {
      background-color: #ccffe5;
    }

    .ltPassiveSearchDiv {
      display: none;
    }

    .ltoptions {
      position: fixed;
      min-width: auto;
      min-height: auto;
      width: auto;
      height: 100%;
      top: 0;
      display: none;
      left: 0;
      overflow: scroll;
      z-index: 1000;
      padding: 0.5%;
			margin-top:35px;
    }

    #myDiv::-webkit-scrollbar {
      display: none;
    }

    #myDiv {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    #searchdiv::-webkit-scrollbar {
      display: none;
    }
    .userNote {
      margin-left: 0.5em;
      //padding-left: 0.25em;
      //padding-right: 0.25em;
      font-size: 0.9em;
    }
    .userTagger {
        border-radius: var(--bs-border-radius);
    }
    .userTagger::backdrop {
      background: rgba(0, 0, 0, 0.7);
    }
    form#userTag {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }
    form#userTag label {
        width: 60px;
    }
`;
  

  if (settings.unblurNSFW) {
    styleString +=
      " .img-blur {filter: none !important; -webkit-filter: none !important; -moz-filter: none !important; -o-filter: none !important; -ms-filter: none !important;} .img-blur-icon {display: none !important;} ";
  } else {
    styleString +=
      " .img-blur {filter: blur !important; -webkit-filter: blur !important; -moz-filter: blur !important; -o-filter: blur !important; -ms-filter: blur !important;} .img-blur-icon  {filter: blur !important; -webkit-filter: blur !important; -moz-filter: blur !important; -o-filter: blur !important; -ms-filter: blur !important;} ";
  }

  if (settings.hideSideBar) {
    styleString +=
      ".container, .container-lg, .container-md, .container-sm, .container-xl { }" +
      ".col-md-8 {flex: 0 0 80% !important;max-width: 80%;}";
  } else {
    styleString +=
      ".container, .container-lg, .container-md, .container-sm, .container-xl {}";
  }
  if (!settings.hoverCheck) {
    styleString += `
    #myDiv:not(:hover) {
      animation: showNavOut 500ms ease-in-out both;
      display: none;
      height: 0;
      transition-timing-function: ease;
      transition: height;
      transition-duration: 1.0;
      transition-delay: 0.5s;
    }

    .ltPassiveSearchDiv {
      display: block;
      float: ${settings.reverseSide};
      padding-${settings.commposSide}: 200px;
    }

    #ltActiveSearchDiv {
      display: none;
      animation: showNav 500ms ease-in-out both;
    }

    #sidebarSubscribed {
      display: none;
    }

    #searchdiv {
      ${settings.commposSide}: -200px;
      position: fixed;
      height: 110px;
      min-height: auto;
      width: 240px;
      display: block;
      z-index: 999;
      overflow: auto;
      display: block;
      transition-timing-function: ease;
      transition: ${settings.commposSide},
      height;
      transition-duration: 0.25s, 0.25s;
      transition-delay: 0.25s, 0.25s;
      /*animation: showNavOut 250ms ease-in-out both;*/ /*Breaks things?*/
    }

    #searchdiv:hover .ltActiveSearchDiv {
      display: block;
    }

    #searchdiv:hover .ltPassiveSearchDiv {
      display: none;
    }

    #searchdiv:hover {
      ${settings.commposSide}: 0;
      position: fixed;
      height: 100%;
      min-height: auto;
      width: 240px;
      display: block;
      z-index: 999;
      display: block;
      overflow: auto;
    }

    #searchdiv:hover>#myDiv {
      ${settings.commposSide}: 0;
      word-wrap: break-word;
      overflow: auto;
      display: block;
      height: 100%;
      width: 240px;
      animation: showNav 500ms ease-in-out both;
    }

    @keyframes showNav {
      from {
        opacity: 0;
      }

      to {
        opacity: 1;
      }
    }
    @keyframes showNavOut {  from {opacity: 1;}  to {opacity: 0;}}`;
  } else {
    styleString +=
      " myDiv {visibility: visible; height: auto; width: auto; overflow:scroll !important;}";
  }

  //For mobile layouts make the ltbar tab smaller
  styleString += `
		@media (max-width: 1199.98px) {
			#brandingText {
				display:none;
			}
			#searchdiv {
				height: 35px;
			}
		}`;




  if (settings.commposSide != "top")
  {
  div.innerHTML = "<div class='commsAreaStatic'></div>";
  document.body.appendChild(idiv);
  idiv.appendChild(div);
  ltLog("here");
  }
  else if (settings.commposSide == "top")
  {

    const topDiv = document.createElement("div");
    topDiv.setAttribute("id", "topDiv");
    topDiv.innerHTML = `
    <div class='topDivRoot card border-secondary'>

    <div class='topDivSearch'>
    <img id="lemmyLogo" width=22 height=22 class='targetImg' alt="${homeInstance}" title="${homeInstance}" 
              src='data:image/webp;base64,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' />
    <img id="lemmyOptionsIcon" width=22 height=22 class='targetImg' alt"LemmyTools Options" title="LemmyTools Options"
    src="data:image/png;base64,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AAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAAAAAIDAEEAAAAQGAIIAAAAAACQwABAAAAEBgCCAAAAIDAEEAAAAAABIYAAgAAACAwBBAAAAAAgSGAAAAAAAgMAQQAAABAYAggAAAAAAJDAAEAAAAQGAIIAAAAgMAQQAAAAAAEhgACAAAAIDAEEAAAAACBIYAAAAAACAwBBAAAAEBgCCAAAAAAAkMAAQAAABAYAggAAACAwBBAAAAAAASGAAIAAAAgMAQQAAAAAIEhgAAACsbzvFwqlfL3AABRQAABgCKWSCSktrbW3xubXC5nSxCy2Wysvr5eNz17AABQ9OL+RwBAEYrFYlJaWirLli2T6urqOebQ/84/MpzneZJMJuXgwYPy5JNPyvHjx6Wurk7Ky8v9zxg//Z7680ejj505c0aeeuqpOf/2b/92mzk035RdpvTo4wCA4sUdJwAIiQ998/ytEqZeLycObpEv/d7aMrN7S0lp2dqqqqplrWdatv/BB3/l8YqqaY+L5Mx/g28AGgZ6kzk5ePi4PPPMs7J9+3apr6+T9ZetlRuuv9p+nv18LyFevNx8zN+7yuUyksv2iWRTI76fSRF9nhxqPiHNzYdl5owZsnBhk1RVxMzX5D8nHovLU09vlocefSrZ2dGmX3rMlJdMedSULyxZ/8aTnheTK2//oDQt3yCJ0rKBrz2fT93ZfyYAABfxKg0AjhlD0JhmyiJTtNVgtikz9Jip09fHE1LTdvJk9Qs/+VzdMz/49My+7rZq81hlRe3Mrpvf+WenL73uztXZbNoc8pkfFS8tl6O7npDnfvzP8sLj3/cfELniNb8mr/6lv7aBQkwY6Os8LSf2PCGdJ3aYAzGpbJgvM1fcIBU1+uMHzzmeKJM9T39Lnr7n12TPYZEVF18r6255jyy78i2SSZnAYr5fLF4iP7/3b+WRe/7c/yor6cVibQ1zVjRPn7+2O5fNyFVv/khm3sqrk7GEdGdS0mFCSLv5vBZTTply3JQjphw0ZZ8pZ71whBIAcAevyADggHOEjnmmrDJlpSlL/f0GU2r8UmWCR4X5WNHVeqrsxP7NpScPbZH9Lz4gB1/8H8mkk+ahfH/bm3/9X2T9G34zl0kPvvabr5V0Mifbn/i2/Ogf7vCPisxdfrXc8EufkrkXXW8DiH7egZeflM0Pf0X27t4s8VhMmuYtl0tveIcsXX+zmKwwIFEisuXhb8n3/27w+22866/lqts/IGUVZZLNakgReeSrfyZP3POn/mfkaWtMadV0qW6cK7lcVpZfcbs0Nq2Q2Usul8a5qzJlFfE+87N6zffoMQ93my/pNEVDSYcp2oqiQUS7cm03RZNS/gKMQCABgMLhFRgACkAHeX/4Hn9nOG3dWGvKalOWm7LQlLl+0TEcpuqep6HAVMKlq+2knDm6S04ceFF2bbpXDpjgMVSp+by1r/1dWX3NnTJv1UYbAJQXM+Gjr08Ob/+5bP7pF2TH41+zxxdd+jq5/PW/LfMvulFKyirtMQ0MWx75pjzytT+UtuN77bHK+jly3Z0fk3Wv/d/DAoie14n9L8vmBz4vz933D/bYvItukstf99uy8OJbpKyy1n7O7md/LE9//2/l4Ev32885l/Wv/4A5n+tNgKmT8uoGaZyzQipqqiRjfq5egyG0dURbRZpNOWSKnuw2v2ggeQXCCAAEi1ddAAjQWVo6tBuVtnBo0fBxqSlrTNEw8graIpE1Ne+ezhZpP3lAju97wYSD/5Tm7Tp8YlB5VbWsfdV7pWnFBpk2b7XUzVhoAkWV/6i2fPTK0d1Py3M//kfZ+eS3/KMiN/7Sp01Y+C1JlJUNVO41gGx77DvyxHc/ISf2Pm2PNc6/WK564wfk0lvePSyA6Pll0mkTMH4g3/v0W/yjIvNX3yAb3/anJoTcbD+np7NVWo7slJMHX5IDLz8oOx77iv+Z57Ziw12yyoQp/Z1qp801QaTWhqoRQaSfHt1qio4vedEUDSI7TdEwMuwrCCIAEAxebQFgiv2+CR2jvNhqElhsyjJTrjXlVaZcbsrZmW8SM0Ur263H98q+F/5HXn7oC3Jsz7P+J+RVT5svy698i8xZdqXtutQwZ5mUlJeIDv3oH8itAeDo7mflmR98xgSLfMuHWnXt3bLute+VhWuvMyHCP2iMJ4CoeInIyQM75Pn/+aw8d9/f+0fFfO/3yY13/42UVFTZc9Dv29PRbT73RTmye5Mc379Ztj70Rf+zz23uyuvkijd+UGYuulQqa6fblhW9RmcJIv20ZeQRUx4y5WVTtIVEu24N+OQd+evDWyQATA1eXQFgiryim5W+4ubs+A0dx7HRFB0kcYsp52VbFTIZSSd7pOP0Ydn9zPflka982H80Tyvgy656mzQtv1oWrLnJBI/lkijxbDelkcOzsyYxPPGdv5Sn7v0bySR1KEW+69Wlt7xHFl78aimvqh0269R4A4ieb6qvR47u2iTP/ujvZdfT99rj0+Ysldf8ny/K7KVXDHTv6g8iyd60HNv7nBx4+WcSMwdOHd4mu568R1K9Orzj7KpqyuXVv/5f0rTiaimvbrTfV7/n0PM/iz2mfNeU+0zRlhHtvtVnyoB8GNEnDgAwWXhVBYApMKKrlS6GoQtqaGvHnab8sikaQsZEZ4PKZtLSemK/7Hn2v+X5H/yVtLe2+o/mW0VqZq+WZetulfWv+x1pmL3YVsD7x3qMpN/r1KEtcv8X3i9HdmhjgMicpevlqjf/kQkht9quWyO/diCAfOev5MS+fIvLuQKIsmNMkkk5vP0x+eaf3ewfFWlauk5u/OV/si00iZLSYUFBv0aXDtFWjJMHt8n2J+6xY1uO7XteOk/mx56cTdyUW3/ry7Jo7c1SWTfDfK+4XYdkDEFEB6rrwJkvmKIXpMs/NoDuWQAweXhFBYBJ0r96+JBWD32N1YOXmPJeU95pSp0pY6bh4/SRnbLzqW/Lvme+I0f2PO8/klc3a5mp0F8uc1ZeK0vXv0HqZy3xHxmdDR+Ht8pP/t+75Ojezf5RkTd98Nuy+LJbpayyetQuTBpAtj9+rzz5vU/KsV1P2GPnCyBKB5u3nWyWx+75mLz008/7R0Uufc175fq3/4UJCtPO3mXKXD0NI6eb95jw83U5uf8FSfZ1yfG9z0tP+7BeU8NUVopc847/K8uuuF1qppuclzVPwdhaMfRMNF190pQfmtJnnr2snoc+iZ+iNQQAJoXeMAIATILuNR+T+3W48yCdNvevTPmEKTeaMuZlxfNdiLKm8r1DHvvGH8mWn98jbScGWwD0xXvRpa+RS275P3LZre+VxWa7vKrhrBVt2yKSTtnw8dg3/j85vOMp+/2Vrs+x+rq3S92MprOHAaO0ok6SvV1yaMvP7H5F3SyZu2KjzF6y7pytDLrmR3n1NDn07Jekz29X6Gx+Rhaue7NU1s4y4ebsb0X6fSvM7zVv1XWy6tq7ZNHFt9jB9Cf2/lyyqZ5RW3lSKTFB7VnZ98J90tN5Rqobm0zQaRjZC200evGaTHmzKbo6e7M5st98zOoD+tw+fs/HzRYA4EKM/k4FABizUabU1cENHzHlblMWmFJiyvmZV2S9459O5rtIaXer/VselSPbfirZzGBNW2e1uuzW99lpcqsbZtuuRrpq+Lno9+3pbJNN3/uUPPndv/SPijTMXGC7Q+mYkfLq2nMGEG3N2PLI1+QH/6ANOWNrAemX6uu2M2594+M3+UdEVm74Rbn89R+UWUvWS0lZ+TlDjLIhKpsz55iWXhMsDm59RH76uTukOz+EZVTVM5bK7MWXySxTVm54m8xYsMo2Z5yte9oQ+htpV6yfmqIh8hlTBtAlCwAmjhYQALgAOtZjRKvHW035F1PeaIreTR/T66wGhGRvt5zYt1l2PPkt2f7EN+XlR74iZ5q32ICjtMr7hvd/Ta58wwdl9tLLpaJmmsTj+u3PXRnWbKIBRqe8/fE/3T3QEpAw5dbf+JIJMjdIeVV9vp/ROejMVqcObrPnp8baAqISJSVSXtkg7S2HzPfQGXFFTh/eJqWV9TJ9wRqprK0/Z/jpp12gYuZ31umE62YukrWv/i0bxE4dfFG620/6nzUo2X1GWpq3yYn9m01oaTXBbruUltfaWbNicXNhzn7emujKTNE+ba81ZaYpOn2vLnoo197xMVpDAGCCCCAAMEEjBpprS8efmaJjPdaZoquTn5fe1deVw5O9uiDgY/Lig1+U537wCTlx4GXJpHr8zxJZvO71ct3b/8KuoVEzrcmEAW1UOf9deBs+0hnborL5gX+Vo3vyM1jpV7/+g9/yWz4ax/KtbEg6eWDLhAKI/p5eLCFlVQ1y+tCL0tWaH8PRdvgJWXDJ7VLVMN8PU2OXKC2RssoaqW6YK8uveossuPgWSfZ0yJmjmhOG02t5Yv9zcvClBySVTkrdjEVSVT/bhqrzBC/NaTpzmY7j0fVZdJYsnTGLEAIAE0QAAYBx0uChlU+fVlBfb8pHTdEZrmaZMiYaDvq6O+1sTwe3PCTbH/+mbHv0y3bMdL9lpmJ97R0fl4uuv1tmLV4vFTWNtjJ/vgq/0s/LpFK2pWHrz78uz/7o7/xHzPe9+q2y7rb32ZYAGz7G8P20C9ZEA4jyTILRVpvTzdvk+N78TFqptEh14zw7eL6qvnFMrSAD9GeakigttS0o1fVN0mTOZ+HFr5F4WZWc3D98wH4/PR4rqZTerhbz9THbIpIoTZzvd9DxOytM0YUiTWKTfaa0699BfyGMAMDYEEAAYBxGtHroCua/YsoHTNFB5hpGzqt/qtlkT7ccfPlBeemhL8nj3/wTOX1I18XL07v5umq4jpOYs+xqU0GfbyrJpg48hop+P525qu3kYdnxxLfkiW8PVo51BfH1t73fjr3QaWrH+j3zAWSrCSD5AS/jDSAadBIl5fbHdbQclo5TB+1hXcFdQ0PD7BX22oznd7TM52tw0SBS0zBNahoXSGPTSpl30U0m1MyVY7uf8j+xX8wce0J2PfVtSaeStiWk0vwuiUR8LL/HDFOuMkVDyGlTDpliEUIAYGwIIAAwFqZm+qE1A60earkp7zfld00599y3I6R6uqT9dLMdlP3ktz8me5//kf9I3sqNd8nFN/2KLL/yTaYivVDiJWX5loFxVsz1a47u3iRPfOuPpa87v5jfzMWXy/rX/qYsvuw2KSmvNke0+WNsLrQFpJ+2upSW10hX+0npOJ0PIVUNc6W6fo6UV0+3LSUTYs5BB5fHEyVSO32mNMxZZT7ON7/zFVIzY9GQIDJ4stotK5PJmuAyx++SNaa3xVJTdNV6/RvQvmQHTLFtN4QQADg/AggAnIftcjU40Fxr7DoW4C9M+VVTdKyH1mjPWZO3YyBM6etqlUPbfy5Pf/8z8tjX/0g6zxz1P8OkmMvfLJfc8h47W5NW7Msrq/OzS40zeCgNC20nDsi+F34iuzblVyFXKze+TS57zW+YyrbeyB97+FAX3ALiKymvMMFgoXSdOSaHt+UXQjy683FJlFVKw+xlUlXXOK7vNxoNIhpkaqfNklmL10nNtPmSSvbJ6f3PD7mc+qQk5NSB5yTZ12sDSKK0yjxPMYklxtSYtdCUV5uirSBa7CrqhBAAODcCCACcw4guV1or3WjK50x5lR7wnbMmr7NYZdJp6ek4Lc07npCffvYtcmR3fiYoFS+rlSWX3iJXvvEDNiA0Ni2SeKLsgirhGnb2v/SgbLr3r6SvO79q+uwV18mKq98q81ZdPb6xFj4NIKcOmgDyxIUFEE0AZZXl0tfTJd3tp01Q2mMPd545bseCzFx82YRC12j099RrUVk304abChMyKmpnSVdHi6T7tFVIPyEhpw9tlpcf+nc7WL92xiKpbmiSmP7C51djyltM0SSp40LspMCEEAA4uwm2cwNA8RslfOjd7q+borNcjYlWfntN8Nj73I/kgS+8T374ydulvS3lP+bJzIWXyhWve59s+MU/set76DiGTFpDi/2UCdPVx4/uedZ81HX08iumr7zydllw0Y3nXbMjCHoOTcuutt3M6mboBGIi7Sf3ypFdm6T1WP6cJ0v/tZyxYI1cf9dH5Ya3/7msMkFvQM5ccN++538kP/m3/yNHdj5pngd/1cTz06TyT6b8lik6Lsga8fcDAPDRAgIAZ6F3sX0aPnR17P8wZVyzXOkd/r3P3ydPfOfP5dDWh+zqdv3mr9wgr3nPv8qqa+60lXBdMfyC7/ybwNNxulk23/9Zeea7fznw7a54w+/I2le9207hO1G2C9ZktID4Sit0LY8lEi+rlv2bf2yPnTm6VXImnTTMWZlfm2SS6XlW1jZKvbaG1EyXlkPPSDo5PGhoYDy07RHze10h1Q1zxjM9sE5EoF3ydDaBNj1AKwgAvBItIAAwiiF3r3WlCJ1e9/Om6HoQY5IPHy2y48lvy5P3/pWcGjLDlVp1zV3yql/9vzJ9wcUSL9ExzZNDx28f3PIz2bP5/oGwM2PRepm5aJ3UTp9zwS0rk0nPpbphusxadJnMWa4923RmsC7Z/cL9rxiYP5n05zbMXiobf/GP5O6/fkmuv/tT/iOD2o7vlfu/8FvSvONxO3bEzs41Nu8zRVPHYt2hFQQAXokAAgAjDKk0ajLQvjr/YMqYbsdrRVWnv+1pPyNbH/6yPPPDz0hL83b/UfNNGirlqjd/RK68/UMyY/5aO2PTZI13UB2nj5tK82NyYs/g1LOrTdjRgdiT83POOdxlQqbNWyVrrv8lf0/kzOGX5JAJUR2nD5uwMDUVeB1ori0bdbMWyepr75Sb3vW3/Y/4H0VOH3pJHvnaH0vz9sck1dtrW4DG6H+Zos1ntm8ZIQQAhiOAAMAQQyqL2u3qTaZ80pTpemAsOluOy85NP5Jn7/tneeGBz8mZI4Orcq+/7bfljR96yISP35cZCy6WmF3NfPLoeJMDLz0gR3blVztX17/jE3Zge3Vjk50Z6kLYKzPJ+UPHglTWzpSlV9wuN7/7n/2jIkf2PCv7XrjP/NCs/b2mgmYb/da10xfY9VZuepcu1Dg0LHhydOdj8tR/f9quUp/s6RlrCNHPussUbQnR6cbs39XvE0QAwCKAAIBvxJ3q20zRCuQ8u3cO/RXkrtZjsuvpe2XT9z8jj9/zJ9LSvC3/gHHlmz5sx2DMXrLedjvSweaT2fKhtenutlOy+9nvy8n9z9lDleXm5FddIw2zl+QXHLxAU5QDzLl5UjdjvsxffZ3U1uv6fiIdJ/fLlke+LF1tJ+z+lIYQ8711vZCVG94qN/6vz/iPKH0wLgc23yfP/vhfxhtCykzRrnt/YkqlHtBfgdYQACCAAIA1omKog4k/YspFdu8ctPKqlVhdz2P3sz+Up+79azm85Wf+oyLlJgXoiuarr317vtUjEbd3/SezZ1H+HLJyaNuj0rz95/5RkSve+jdSP3uprTBPxs+bqqqzDQHm3ajGhIAr3/Jn/lGRw+b32f30f0tHy1HJXmjzzTnkQ4hnW0J0dqzr3/kJ/xHDzuObkL3PfFee/8lnxxtCNHj8sikfNGXg/ZYQAiDqCCAAMNwaUz5gynV27xyGho99L/yPPPIfvy7tJ3VR7LzL3/B78trf+KqsueGXZPr8NRIvSUxo/Y3z0XPo7WqVLQ//u13cT5WXiMxfc6NU1c2a1Gl3vSlqB9F8UV5ZLwvW3iQz56/0j4rc//n3ysEtD0uqr9sOsJ8q+RAiUjtjgVx03Tvkmjv6g5CGBQ0hJbJ707fzLSE7HjchpHesA9NrTPk9U95u9wAABBAAGHJHWme50rvVOvbjnEaGj/v/37ult9d/0Lj45vfIpbf8uqzc8BaZPm+ZnelqKsKHnkcm1SfH9jwju5/5vjmnfNpY9+aPSf3MxZIojdvzdJ45x3hJzK5YvvrGX/cP5r384Oelu+34lP8e9vubolMiX3zTu+zaLCXl1eaYPnHmutqWkHvlqe99Wpp3PmFCkV34fCx0AoO/MeVKu2fQCgIgygggACJLZ1gaMTD4d035BVPOe5u/P3zoGh8PmPDR38gQN6+qa2/6Fbn6zR+Sxqb8nXxdWHDK+i8Zfd1t8uIDujh7XlWZyLLL3yDlVQ2T3PoxtbQVpKSsUpZe/kZZd+tv2HClDrz0Uzm+93np7Wofz3S4E6bPbf2shXLpzb8ql7/+A+acKvIhxIa7mBx88cfy6Nc/Kkd3bcp/wdjoWCKd79dOz6sIIQCiigACIJI0fHz4nmGVal1oUOeCzY+CPgetGOuA8z3P/kAe+vyvSf862iVlVbLqul+SDW/9Y7vQnRfz8nfVp4ieR6qvR04efFl2bvquf1Tkols/ZCrQSyVRVjKpP3/Kq8vmB8QSCRvc1puK//T5F/sPiGx+4LPS2dI8EEqmmoYhG0Je/Wty+Rs/7B/VK5BvxtLZsV782edNLhlXwtOxRe8xxc6MpaZqmmEAcBkBBEAkjajIzjRF121YYvfOQb+u88xx2fnUd+XJ7/6l9PnpQ7/diqvfKhvf9jFTcV1iPs8cmeK6pbYG9HS2yMsPfck/IlIR10UO75SS8qop6fI15TSEmOBWP2uxLDfXs6wuv3K7toJo0Ort7AikFURpCKnzW0KuufPP/aODWk/sl2N7nh1vCPlDUzSI6DTPABBJBBAAkfShb/obeX9vyuDI53PQ2Y+O7tkk25/89rAB55e8+j2y8Rf/ZDB8TDH9EToQuqV5h2x99Mv5Y/EyWfWa37ItCAkdczIVAcj84Kn+7fS8PXOhV264U+YuvsQ/KvLEtz4q+174sQkhbfb3D4KGuLqZ+TEhN4xYMV1bQX725Q+Zv4dnJJtOjeecdIS7HQ+irXAAEDUEEACRM6Tvvb4G6krnt5pSoQfORe+8d7WekSM7N8nhLT/1j4qse+1vyRW3/76d8jaI8KE0CHW1HZedT9/rHxEpLy+Xi667WxKl5/1VnKfXsXHuSmlaeZ2U1cy2x04d3iE7nvqODV262nxQNBDVz1pg13AZSls+jmx/RJ67758kk06OJ4CsNuVuU1gpHUAkEUAARNk0U3ShuPOP+zCvlj3tLfLSg1+S7Y9/wz8qdpDyutveJw1zltuuQ0HQim6yJymtx3bL3sc/a4+VVDTI6uv/V36tEVM7L4ahBfF4XJasf4MsW/9a/4jIrse/LicPvSw9HV3jqfBPisam5UO6Yg0uBLLt51+R00e2mxCSHU/3MF0fZPAXA4AIIYAAiJQhd5u1meA3TdGRzuesyupA4e7WU7LjiXvkme//jbQd32WPX/Xm/08uefWvmYrpChs+gqr0ayW37dQB2bf5J9LenrLH9GeXVtTY1o+prpgH9cahv9OM+WtkxsJLpKTcLiZuh4Af2vqInDz40lgXA5wUOsyjuqFJVl97l1x711+aI8PHfbxw/7/JiQObJZ0cc0tItSm6NsgG3aEVBECUEEAARMZAJS//QVc5/w27dQ75ymRODm17RJ7+709IZ+txe1x7AC265NV2gcFYPBZoi4MuyJfsaZdjewangZ29aK00rbzebk/luWjXqADr/XYmr7krr5XlV93hHxHZ+sh/yNHdm8w1GPM6HJNCV7FvnLNclq5/vX+knycv/fRz8vLDX5ae9lPjCUY6GP2tptivIIQAiAoCCIDo8ew0qL9iyiy7fx59usr4o1+WM8f3+0dErrrj47bblY5FCHq2qXQyJ72dZ6TrdH4QfKKkxI5PmLtyo+jUv1Nrqr//cNryoN3K1lx/t6zcOLiY+JFdTwXeCqLPs/48Xajwits/5B9V+eDw3I/+TlqP75V0ynzi2C6Tnr12w7rN7gFARBBAAETCiLvLl5ry7vzmOeRy0tPZKoe2Piq7Nw0O9l7/uvfLsitul6r6WZO60N9YaAVYu18173xSWo7ts8emL9kg8y66SSprdMHtYANCEMoqKmX+RTfIokt1roC83U99Vfa/eL8JY/2rsARDQ0hpeY2svfFdcvEt7/WPDjrw8oPScfqwxMcejHSar3eYYr/CrgsSZHMaABQAAQRA1Cw0RfvzVNm9s9BxFqlkjxzZ+YTc+2ldHD2vrr5M1tzwLpm58BJJlE7RVLfnoOd15ugu2fPs9/wjInOXXiHzVl9v160IQtARR3+vssoyc80vtgs9qrTJHYd3PCmnDm2x+0HR5zteUmLHplx+2/ukqk6XkBn0+D1/Ii1Hdo33ubjKlDfphk7LS/wAUOwIIACiZp0p+VrsefTqIn8P/4e/l7fyxt+VulmLTSU0HnjXK6U/U9ecyKa67X7D7KUyY8FFUt2gE3oFoxBtLBkTOBqbVg0bf3Fk5+Oy86l7zDUJ9onQEKJd3abNXSVLLn+TJMpq/Efyju15RtqOHxhP97Blpgy0yLE2CIBiRwABUPRst5a8+aZoP578lEpnoQPPkz3dcurQVtnRP+WuOajdrlZuvFNKy6sLEj609aPj9HE5vn+znDy41R4rqZwm8dLK4FpixjjF02TT36+iptoO+l9+tS7dItLXeUr2vfSwtBzZWZgQYp6Qy279DTtL11CPfu0P5MSBl+xkAWOkF1VnYxvoYzbkbxYAig4BBEDRG3JHeaCry7noneuu1mN24Hm/yqoaueZtH7MDouOJ4LteKa37H939lOx94X/8IyIL194k81ffUJBAFDTNGHUzFsmqa+7yj4icOrBZNt37lyaE7JBsJtgBOZ5JGLMWX2b+Jtb6RwbZyQDGl9XmmPKe/CatIACKGwEEQFRoq4euuTDX7p2FVvL7unvsatvbHv0veyxRrov8/bJMm7fa9v8vFG0ByWZSku7rsPuNc5bI7CXrTKV8XkECUdA0ZFXU1NoK/+LLXmeP6bXY8dT3TPm2ZFK9gTfQaCtIOtnj7w06dXibtJ04bp+zMSozZaMpK0wJ+LcAgGARQAAUtSGzX11jynX5zbOLJUTaTx+SPc//yD+Sr+ivuu5uEz5MHbFQFX1TJe1ubZXTJhid2PecPRQrqTbnWzaeSu4F88x/8UK+c5jrrwsCrr1pcBKzlAkhPa1HNQ0UpOq+9sZfloWX5gNRvy2P/Jcc2fmknaZ5HBpMuTu/ybogAIoXAQRAVGj4uDK/OTqtvyZ7krb1Y8v//LM9VlY9Q5ZcdqvMXHipvdtdKHpuOvXuoe2P+UfEVHpvk+nz1gTb/Urr+OOrVE8qOyNWVa3MWrJeFq59lX/Uk8PbHpHOliOSTQffF23uqmvsZABDnT64WY4f2GzOqcU+d2Okq/Nr/zL9CABFiwACIAqaTNG1P845L5HmizPHdsvBLQ9Lqv9YvERKK+ukpKzcP1IYWoftaDksbScGF0NsWrJOGuYsC2z63QFjr1BPCR1eoWuwrLnpV/0jOTlx8GU58NIDkurrCnRxQlVaUS5L1r1eFl42fIX0Q1sfsX9L48itemWXmKJdBQsY8wBgahFAABStIV1Y9Fb56vzm2emsRd1tx6V5+yP+EZE5S9fLjAWXFnyMhVZiPVPR9iSfNmYvvkQqTSW8pKwAL+MFvhYauErKqmTeqmtlwZob/KMiL9z3aek8cyTwxSGzaZH5q6+VeSu1l9+gw1t+KqcOvTye2bCUfrauU6NjQuiGBaAoFeCdCwACd60pw/vIjCKdEkl2t0tv+xG7X1peKk1LL5e5K3VscGGl+lLSZSrXnUe32/14RaPtEhb87FdeoGNOziYW96Sqfo6svObugQaZk8175MjOp6SvqzXwVpCqulqpqGn09wZlMinp6+7z98ZEr64OKKm1ewBQhAggAIqd1grXmHLOLi1aqW49vk+adz0trSeb7bFZy26SmUuukMraOrtfSCcPvixHdj8vKf+GuE5HW1I+fAG8IOgg9FjhJgIboMFLp0NefOmtMn/NTQPjc15+8PPSYYJa0C1W2ipTXj1Npi+4zD+Sd3zfC9K84wl/b0w0T+lq/atMoRsWgKJEAAFQfEztc8hCbjeZMju/eXbaTebEgRdk3wuDs1/NW7VR5q7YGHiXntHs3/wTOXbgRX9PZMmlr5VpTSuDPzetHo+zT9FUicVjUjNtnjStvE4SFfmV4A9te1RO7N8sPR1nAm2p0edhweobZNW1g2uUqH3PfV+2Pf6N8QxE7/daU2zy/X26YQEoMgQQAEVnRHVNu1/Nym+enc0rWovM5oefz1iwRmbMv0iqG6cVfPyHiiVKJZ7INz3MmjtfGmYvkfKaKifOrZByuawkSsslMWSSgG0//6q0nzoUaE7S56Fu1mwbCkfS85vA86TB2XbDGn92AQC3EUAAFB1dRXrIStI69e45+1Dp3emO08fk2L4XbFcnFSutkVi89BVpplAyfe2SSXba7coZF4tnAknBzs2R1KOnEYslZMVVvyiLL7pW4vF8VT2X6jL/BD44xp6PBqKRWo7slOP7nh/1sXO42hRdFwQAig4BBEAx04HnM/KbZ6cBRKdMPbDlIf+IyJLLXiezl10Z/BS3I2hXsrYTB+TI7mek+0x+cLy2hngT6NMzKczPjZfmuzu5wIvFpLFpuTTOXyuldfPtsX0vPWgXbOzp7JxI16cJy2VEZi+5XK696y/8I3nNOx6XF+7/nMlE5o9pfOez1pTCzv8MAFOAAAKgmF1uSnV+8xxMpTCd6pVUX4/drTD7sxaukdrpcwtxI32AVp5z2bTsee4HcuzAFv+ozojVma/MFoAOQi/oSoSj8GJxWbr+dpmzSJd6ydvz3I+k5ciOQGfD0qekfvYimWOC61Dpnlbp6Tjl743LOlNeObUWAIQcAQRAMVtvynkDiK3op3sl29tq9xuXXyNlVQ2BT+U6Gm0B6Wo9KsmeLv+I2C5H1Q1NBQlHjvRIe4Xp8y+ykwb0T4XbfmKnpPu6Ap8yOG6yWSw+fJowbaXRGbti8fh4x3NcYgrdsAAUHQIIgKIyYuE2vSVeld88O+2q03piv5w5vtfuZ02l386i5URt27NdrrTyqhobYzJn2RV2JfCCdQ/Ta+OYRGlCSitqpaQiX18/seNJ6Ww5In3dSb2EgdF5DGoam2T9Gz7oH9GWkax0tR23A+N1exwuNsWOX2JBQgDFhAACoFhptXOZKeddteLork1yZM9z/p5I08pr8y0MTtT5TBhKJwe6XDUuuU3KqxvtnfZC0Ivq6eB8x2hr0PT5F8v0BfluWDqX2aFtj0lL8/ZgZ8My51E/a4ksXadrCQ46dXCr7Nx0r2RSfeMZl6Ljl9wZcAMAk4QAAqAYaRVvnin1du88ju97Vk417/T3zBeu3CgNc5YVpIvTSLrAXrLrlAkh+fEpifL8Hf6ChSNTe/ZGdDFygV6P2UuvkKalOmwi7/DOx6T1xL7xVPgvmJ5HaUWJCbBzhq0i2NN+TDb/+G8lm0nn/zrHTv+OWZAQQFEhgAAoRlrFW2HKmF7j4iXlkigts9szZlRLTeMcW4ksdAuI/vx0sls6Tu6VTLLdHstm9N5+YU8s5+hIkIrqSqmbsUDqG/ONBiVllRIrQFORBtdsNjPsKnleXKoaF/l747LAFAaiAygqBBAAxUgDyBJTzlv71Lvj2XSf7eakquZssHf4C936oeeVMed0Yv9Lsv/lhwbGe1TVz3nFIOegje8GfnD0GiVKq6SsQWdfNuGtt9UEtvzzGjiTHl+xSL0+qeNvjmkyZUwteQAQFgQQAMVIa3l65/i881jlsjnp6zwpyY5mux8rqbR3qwtOA0iqT7Y/8Q1JJvOrs6sVV71VKutmFTAgeeLF3OuCNcBW8vNvbe0Htkiqp70gLVk6NXDdTP0THJTTVhEdpT6+85ltil0RHQCKBQEEQLGaY8o5k4TOdHXm2G45tu8l6evt84+6Radv7TdnToU0zFkipeVlhekeZn6mjkmJJ/Ld1dyVb2XQZ/RU827pOHVsAg0PE6ctMbXT5sn17/yUf0T/1jJyZNujcnT305Lq6x3P+Uw35fxr2QBAiBBAABQjrd7NMuXsAcR8ht6N3vX0vXL80Hb/oHZ76jOVxQL3vxpqSEW1csaVNgBgdBrKmpZvkMWX3uofETmw5UE5tP3RQNcD0T+fitp6mbP0CqmqHgxr+lf1+Lc+Ln09beM5Hx3/UZnfBIDiwDsZgGKld47P+xqXTvb4A7vzVl3zdqmbsWhgzEWh5dJpf0ukvH5BYQNIgK0IE6EV/9oZTTJ97nL/iP/8+uN7gqQtHLFYXLz48NairtP78klp7HT8R0V+EwCKAwEEQDHSqrLOV3v+1zhboc/XrBuqRWYtvFgq66bZymzBmYpqsvuUv6OzdVXma7aF4tebc4U8h/PQNT8SpeUDTQY2sBXgfDVj2Ms1ImzESzRLjOt8dCFN1/u8AcC4EEAAFKsaU8ZV06tfdIOUlFcHunDd2dgTj3mS7Dhm9y0XKv7mHFwehK7V/Zg5v7JphV2/T58q7crX2d7hH+k37udQL7Z7Kz8CwAUggAAoRlrLO2e/+f5qYCbZJTm/C1ZJ9cz8HXMHZDM56elokZbDgyu0p/q6XnFHPWgmfjhzjUZlLk8sUSqldQvzu7YpIvhrpi1opSbMbnzbx/wjPvOHpzNkDfwBjg0LEQIoKgQQAMVqDHeNc5LsOi3ZlKnYG3Z9DQdaGbR+n+ztlObtj8nJE2f8oyJzlm2QeEmBZsDyuboI4VBePCGJ8vzMtdl077AxPkHR56i8qkFWXv1WKRvSYNR+dJcJlqckkxrXdXRgXmgAmDwEEADFagyvb54ku1tMAOm0ewVuXBigGSjV1y17n/+hfyRfA110yS1SVlFX0PPUFhD912VDW2kyuhhhOvgplvU5SpQmpHb6AmmYv94/ap7XrMi+zT8xIeT0eLr6uX3BAWCcCCAAIkkriLrSeE/7advdyR7Lpp1JIZ5JISXlOowlb+7ipVLTOEfiCfOyXchTtGNAwtMjKN17wjy/hVoNXdcESZsyfE30B7/0O9Lb2ZKf/wAAIoiXPwDR4+kYi7ScOrRVmvdtG6jPl1XV2/75rrSEDKXjU3LZbOE7QGkAiYcngGR6UpIzz7VLykv1MvL2CyC6eAUEEDnanyWT6pPtT3xD+rpb8weNlRvukOqGOW5MwTtCadUMW/nH+GQy+VYI9ziYcgEgIAQQAJGl3Zz0PzVrmsi0puVSWlHhZAtIaZWuq+haAHE/EGnnJ13x3j2ESQDRRQABEGGDlcCyhjX56VEdobNNZdI9/p5ISXmdDUwu0dml3KzcD9LGrGxBl7XPSdfJF/3toWgBARBdBBAAMMpq55p/Harg57KS6jrt7xgurI44ku2r5n5FWhcELIT8TFiVctOvfXXYm62O4bcD+WkEARBRBBAA0ZWzHXTspl2E0KFKvi6gl+o66e8ZTtbzQ3IXv0B96vTHlpRVysKLXyVzVl03MPC8u1uk7cQ+6evuZVgPgEgigACIHlvpy0m6t9P8m6+cxhPl5l+XWkBykuxs9ndcFZbas04d7G8GTH9ueWW9lFXU5nd825+4R9pPHRKHev0BQGAIIAAiSVsYdBFCF6e8snfFzT+pdscDSC5jr6NrdN2NdHJw/ExvT6ckewq3Foh2ARt5nV584LN2LRC6YQGIIgIIgMhK9+oUvA5WoDMiqd4uaR2cIdgumugaOwDdsQCn9fyKmmkybd4a/4jI6SO75cT+zc5V9l2a9AAAgkQAARBZqZ62fI3VIdpLp7erTY7te0H6I4e2iNROX5gfQ+DU6erJuHX9NA9Nn3eRLLjoBv+IyPH9L8jh7T+nsQEAHEEAARA9ps6sK6H3dZ7I7+i/jtzJ13HwPe2nZMfjX/OPmPDR2CTLrniTJErLHavuu0fzZHl1hdQ0zvGPiCRKyk0p8/cAAIVGAAEQKdqakE4m5XTzdmk+uH+gb37cVFBdWGfDno4Xs9O3qpg5pZnzV0rdzIUSi8f785IT9No51oBk2XNy8cQAABYBBECkaMZI9rbLtse+6h/JW33tO6Wsqt69MenmhLXlw0XZdK+5Xml/DwCAsSGAAIgk7YLVb1qNKU0rpKSsvPA3zkc0wnixEomXVvl7GIv8JSx8a1Y//Zvq6z5DWAMAHwEEQDQN6W5V0dAksXjCjSrriACkK2bHSyr8PYyFvYSO5A89l3giIVe/5Y+lbtby/EEAiDgCCIBIGlo/LSmf7m85yOUA4sCYGeeZBBKLl9hZuWYtWecfzIvFYlxCAJFEAAEQefHyOvtxROND4Wil1K+Z2i5YZY52wcqkzEVz5qoN45n/XHqDK62okdLy6mGBo/10s/R29RFCAEQOAQRA5CXKaty6m28q9XaRP8OLl/gzYrlXS9VzdHEldMtcLpeuWH419OywlLvnmR9Iy5EdwnqEAKKGAAIg8mwAcaS6ms9BOcmmevz9mHixUrvtHvdC0VBun53ISz/7V+k4fZgWEACRQwABEHnxsmrn7pan+zr69/ziIlfPKy8Mb3A6+QEARA0BBED0mHpzLju44EdMB3m7dBs6m5N0b6u/465cNmX+dW3hlH46CgQA4CICCIDIyZn/MslOf8+8EMbcugs98vxclcv2ODsGhPABAO4igACIFq2Zmkpzqre/i5ODzPmle474O5gItzuHAUC0EUAARJAO8u7yt92jLSDpLocDUki42jkMAKKOAAIgcrTbUDbpbgCxLSAhyB/5aWUd7YLlecLwbgBwEwEEQCSl+9r9LRflRId3uy6X8UOIoxgHAgBuIoAAiKR08oy/5RadjEvX/ghDAMkPtHB3tAXjQADATQQQANFjB3kf9XccYsJHKpmTns4z4QggjmOBcQBwEwEEQCRluv0Nh8TMK3LXmaNyZNcm/4hINpORTKrP33OL7X3lbDOD59wbXLqvm1YZADAIIACix/Mk0+tvO0S7X3W1HZe9z/3APyJSVlkn9bOX2UHVrlVe82PQ3R0D4tb18mTmonVSNW2xvw8A0UUAARApOmmTtij0ZvwDRlZHUzvCi8WlpKLG3xOZNnuhLL70tfY4t8/DS8PlqmvulLnLr/SPAEB0EUAARIZWApPdXXLq8Dbp8Y+p0vJa86950EF1jbOkdvpc2wKCMPOksWmJ1M+iBQQACCAAIsMzr3jdHadk68+/4h8RSeid6Y13SElZpXNLWmjkiMVizp1XWLgW2fR59DyGxgMAAQRA5PS3Jui/c5deIg1zlks8kXCzi5N2vXKUXi5Xx4Docxyv9ndcphfRtaQEAFOMAAIggvwan/kQLykzlVU3Xwr1LLljXtxON2+X9lMnbescAEQFL3kAIs2Ll5p/3ezjFDMJJBYngBSzlx/5sp12WadgBoCo4CUPQGRpN51YvMTfc4/eFY/FEv4exisMrQon9z0jvZ0t5mT9AwAQAQQQABEWk1jC4QASN+cXdzeA2HUIXV0HxIRLT2cYCIGYw+N8AGAqEEAARJe2gCS0C5ajFdVYqXgOt4DkB6G72X3NipX7GwAAlxBAAESWDj6P2TEgbvJiJaa4fXfc7TYGd1dpB4AoI4AAiC4TQOLOBxDGgEwc1w4AXEQAARBhMfEcHmPhegBxu/VDx4BU+dsAAJcQQABElnbB8nQWLEdr0l7MnJ/DXbBcHoSua03GTIADALiHAAIgujSAxFzugpVghiQAQNEhgACILrsOiMNdnLy4DSGYKIdn6AKACCOAAIgunQXLTsPrFq+/T5i2ftACMkHmKnqENwBwEQEEQGR55iVQB3rrljNyOclm0nbTjlFxPYC4ug6IeUq9BOuAAICLCCAAoktbQOKlLsUPIye5bCq/qat562hqhzkZP+xJmWsX4y0OAFzEqzOAiDEV/MyQCr5rlVRtUeg/P0yMn9lyOd7iAMBFvDoDiBbbxanP33GPiUdOn98ruNgFa6AFhGl4AcBFBBAA0dF/ZzydzG+4yFToM+kQBZB8bd8tOv7DFJdnOAOAKCOAAIgOU1fO2Qp+r3/APXp+WZcD0gguNoAMZiK3x88AQFQRQABEh62Pahcnl8dY6CD0MLWAuMrtNV4AIMoIIAAiw88fkss42sKgJ5jTQfLuttCEhc4epgs5AgDcQwABEDFawXe7i1PW4S5ir+RiHywAgMsIIAAix/VZsHKZdn/PfU6OAenHKvIA4CQCCIBIsRX8dI+/5yDtgpXu9nfCwNEEYtd4YQwIALiIAAIgWnQMiMvT3JoAkglT/nB1pqmcnhdvcQDgIl6dAURMTrIpd7s4aXtCmNYhdLYPlraAxFmIEABcRAABEDmZtMtjLHJuj6sYQbu0uUhnwYrRBQsAnEQAARA5uay/4SjHT28YT/9ztRfWQDjSjyFKdQBQ5AggAKIlpyuN+9su0vPzN8Mgk0mL+d9puWxGcpmMv1dY2Zwb5wEAhUQAARAp9l6444O8wxRAzpw4KC1Hdvh7bsrlskNaQwqrtKxaEqUV/h4ARBMBBEDkpB2+Ca3V5DAFkKN7npY9z/3Q33OYCwNrzCms3Pg2WXnNO/wDABBNBBAAkeN0Bd9UlB3v0RQ+2bS5rIW/qpqBZixYJdPmrvKPAEA0EUAAREy4xli4z9ER6I7SAfsxVmgHEHEEEADRknO/i5MDnYWKSlZbQLIO9btzddowAAgIAQRA5NACEjHa98mFMSD9yB8AIo4AAiBy3A4gtH9MNjsLlkMBRNdOAYAoI4AAiBy3B6H7HzFpcrmMDSHO8HjrBRBtvAoCiBbPczqAkD+mgA0fXFkAcAUBBEBkaD00k+rz99xjO+bQO2fyZc0Tr8VRriySCABBIYAAiATt9dLT0SanDm/zjyhT9XNobIAdK51xeJXEkMrlUm51wRrJpQHyABAAAgiASIiZV7v204dk22Nf849ob6yYxOIJf6+wNCB1tZ6RlmN7/COYNDbZUckHAFcQQABEh6cV/cFF4Oqmz5OVG95mQ0ih66cakE4f3io7N33XP2LqzNmsZF1av0KZC5XNhGut9my2T7IOt4C41AoHAEEggACIrMYZTdLYtGJYKCkk7SaUTSf9PZFZiy6Vpeve4O8Vng6jmD5/jazceKd/JCxcH1hDAAEQLQQQAJEVi8dNKfH3HKArZA9ZJbth5nxpnLvK3ys8bUSoaZwt0+et9o+ERKbPpCd3x9bYroC8GwOIEF7yAETGyPvgWvFzuftLoqTUFLfu3scS+fMKFfsUu/s8t59ulo6WM0OzJwAUNQIIgMjyXK/xmTqzc/nInpO7lfnR6Om6fM77X3xADm/7OesTAogMXu4ARJbrAYQ74pNDu465PA3v4S0PyKnDW3m+AUQGAQRAZAy9B56v6zle43OwRqrX0HN+UPcIetIOBxAVLynztwCg+BFAAETGyGqzx8jfcQtZ9LDyXbDcDiAAECW8+wKIjFeOAnC7Ou1iF7FXXsOQCNm4FQAoZgQQANHl/O38MLY3uMf2wCKAAIAzCCAAIkmr9jHPjQUIMbXyAYQuWADgCgIIADhIA5KuU+KkMDbM0AACAM4ggACIJFvBZxB6JGj2yObcXQkdAKKGd18AEeburXwC0uSxjR+0gACAM3h3AxBNpobv8kKENoA4G5DcvW5nwxgQAHAHAQRAdLk6xqKfowEpfPFD0QQCAK4ggACIpnwTg7PsqTncQhM2zMILAO4ggACIpHz+cLuCT/yYRCQQAHAGAQRANJnavefwOiA2INECMnnsBc1vAgAKiwACAI7KOVxjDtubRyaTFsahA4AbCCAAIkmnuPXirIQeFa2njsmZY3skR1csACg4AgiAaPJMAHG4i1MsYUrMBCTqyxOi0+5m00l/T+T0kZ2y++nvmQeydMUCgAIjgACIjGH1Tq3Yh6Fy72Jl2QQ3l988siZj1M9cIis33ukfEcmkU5JO9fh7AIBCIoAAiIyhecOuMu7wSuN2fLyuU0ILyLhpI0dl/XSZPu8i/4hmJs8U3vIAwAW8GgOIJq2Mulwh1e5hzII1YTq8p6S03N8DALiEAAIgohys3A9p7fDipfauPSbG9rA724BzWpUAoKAIIAAiSpchdKyCP+R0vJgGEHdfokPx5kF+AwAnEUAARJOp3LtcwXd5lXY9N+cnMM7l88eoV5FgAgAFRQABEEl2FfSYw5X8eIn5x9GXaHPZwvHmEYKgBAARRAABEBnD44bjAwFiCafHgDg/jIJWDgBwFgEEQGQw9jhC9MkOTUsNAEQLr80AIkm7OMW0m5OjYrYFxNUORJ7LvdeGoQsWALiHAAIgohyvQWv4cLgLlrPZaBhPEv4WAMAdBBAAkTG8Ok+HrGKnzzdvcgDgHl6bAUTG0Mih3Zvc7eJkzk+7YMXcfYkOTXzjXQ4AnMNLM4DIGNYC4vo6IHp+rr5EmwsZL/W3XeaZKxiG8wSAiCGAAIiMUHW6cnoMiCdeSAZXxBgEAgDOIYAAiChTuXd5kHdMAwgv0RfKc3eiMwCILN7dAETG0LhhuzhpJd9ZnjlHdwNSOHgSL632twEAriCAAIiMYV2wbOXe3Qp+LFZiApK7/YfCkI30HL14pb8HAHAFAQRAZDhfZx42TZf/0UHaMhMvbfD3XGYuIqPQAcA5BBAAkTF8ELreHnerlp/LZSWXTvp7rgvBkH4NSiV0wQIA1xBAAESSrrHhXhennA0hmDxefJRR6KGaDg0Aig8BBEBEudjHSQNI2t92Wy4WjumlRg0gAICCIoAAiCgHb4PnzDllwxBAPInHq/xtd9mxKvFyf28Ih8fXAEAUEEAARIbT9U5zchqJctkwdMHSKYJdnsK4n7mooThPAIgWAgiAyBje5qFxxKFIYtNHzgSQTH7fafZk85uO8+KjjPMJx6kDQNEigACIJicXIgzHGBDPtiw4FN7OxpxjLF7m7wwRglMHgGJGAAEQSfmV0B18CXR9FixtPdD8EYLB3RqUvNEGy9MCAgAFRQABEBmvuPHtUkXUnJxOwZtN9/gHHGUvok0gdtdptgVklC5Yr/hDAAAEiQACABgnTW5haEbwTE5iJXQAcA0BBEB02HqzwxVnc27ZTFhWQg+XXC4juUzK3wMAFBIBBEBk5Mx/2Uyfv+cem48yvfkdV+lJetqyMMrgbpfZGcay9vQBAIVFAAEQLS63gFjuD1DQwd3xkK0wbltAcmmGfwCAAwggAOAKHYSeavV3XBeyqnzWXNtMihYQAHAAAQRAxLhdcc7lwjJOIVxVee1+537rFwBEAwEEQHToOABxeKVxrR+HYSF0HQMy2voaLstlbTcsAEDhEUAARIip4WddXmncBCT3F0I3dBD6KOtrOMyOAXH6uQeA6CCAAIiWrLsrjWsDiOsLoffLha07k86AlaEFBABcQAABAFeYSj036aeI7YIVknQHAEWOAAIArtAxKiG5Se954ZoFS7tgZUl3AOAEAggAYFw8Lyaxkgp/LyS09cN2v2MmLAAoNAIIADhC5+jiHv3UyC9EyBgQAHABAQQAUPx0DIgOQqcBBAAKjgACIFIYiDwV3B8PYseAhGOOYwAoegQQAJGhU8c6vRaEXSgxXPR6hmZ9DcInADiBAAIgUlxvAQldANHrGYaxFebC2rVLwjV5FwAUJQIIADgknPfoQ1Cr1wDCGBAAcAIBBAAcoXfowxZAwtKgoI0fzIIFAG4ggAAAJsyOWtHafQjYLlgAgIIjgACAM8I3CF2ymdAMQs+ZcwUAFB4BBABwgUIwDa8WAggAOIEAAiBCtLsQldCoYg0YAHADAQRAdJj8kc0k/R23aBtCGMcoaKU+S8UeADAOBBAAkRLCURZOs+M/QtCqZLtgmaDkxeIsBQIABUYAARApVD4nm4l0IWm5aW89LV1njko2SwgFgEIigAAALoBGOjdjnbZ4JHs7/D2RMyePyIGXH5RsOikeSRQACoYAAgCYuFzOxA/3WhS0UaasslbmX3STf0QkZcLIsT2bJMtsWABQUAQQAHBFSAehuzi7lJ5SVd0sE0Bu9I+IeF5cEmWV/h4AoFAIIADgAs9UmsM4QkVr+g4GJz2lRGnchJCZkvCPAQDcQAABAAdor6BsJuXvYbJo60zc3wYAuIEAAgAF5plX4o7Tx6Tl2D7/CCYTb3QA4BZelwGgwGLmlfjYnmdl7/M/9I+ERy6bcnpQt3ZqowsWALiFAAIADtAFEocO5s6kk5LNpP09h9lFCMM3eB4AUDgEEAARYirKGTfv1ueHnw8OQp+/+no7g1MIJ8Zyhr105pIyBgQA3EIAARAZWiHNZPryO45rnL1EGptWhCCAuD5zlyexMn8TAOAEAgiA6NDavO0y5L5ESZkp/o7Dcrm0+ce9dUCGipX6GwAAJxBAAESM63fs++mYEH/TZSaAuLgQ4VBeCIIcAEQJAQQAnBSOoJQzKcnZoOSfVzwMTUkAECEEEABwkBeWhhrD7XP1JJao97cBAC4ggACAk8KTQLQVxFUajrxEub/nBte7rAHAVCOAAAAmTMf05xxeiFDF4m4FkERJhZSUMDkwgOgigACAg7yw9MFy/jQ98UyF3xXZrMjiS18jl972e/4RAIgeAggAoKh5Ds3Dq72vps1dIjPmX+QfAYDoIYAAgIvCNArdZToGJOZWdyc7LsWxcwKAIBFAAMBJIQkgWdcHVXsSL3FsELotYVjkBQCmBgEEADBhdgIs11dM9BL+hju8sARMAJgCBBAAkZLN9Plb7tIX5tAMQrfcPlcv5l4AAYAoI4AAiJCcCSA9/ra7tDofrvvjLq8D4kk84c4gdJV/bsP1DAPAZCKAAIgUur5MAcfHgMTibgUQAIg6AggAOMZGpJB0wdK2j2zW7TEgLk3DqxwfMQMAU44AAgBOoqVmUpgg58UdnPKWpxdAhBFAAABFzXOwCxZdAQFEGQEEAByj9+tDNQuWF5ZORTnJppP+NgCgUAggAIAJ0+iRc3wMyIBczvyf9ncAAIVCAAEAF4VqHZDwtIBINuNvAwAKhQACAI6J5ftg5XcwaXL6Xybl7wEACoUAAgCO0ezBIOUpkNOFKLULlgMtNgRMABFGAAEA14StbqoLEYbinHPmVF0ZA0IAARBdBBAAcIyX0H94eZ4KAwGE+j8AFAzvcADgGn1lpoI8+bQLVn8ACcu4eQAoQgQQAHBMLF5m8kc4EojW48NTl9dB6CaAED4AoKAIIADgGC9Wav4JTxNILpv1t9zHLFgAUHgEEABwjOclQtMCkheWJgUdhO7oOiAhCnEAcKEIIADgGC9Rbl6dGQQy6ew0vNoCQh8sACgkAggAuMZ2v3I3gIS1+q7nnc36XbDIdwBQMAQQAHBMLFZiMoi7NeSRZ5bLhacLluQc7YJFIAIQIQQQAHBM6MaAhCaAaP5wNICE6BoCwIUigACAY7QqSnV0KvSPAXFPeFqRAODCEUAAwDFeLC4eK6FPPlPHH1iIEABQMLzDAYBjXB8D8krhuXuf6x+EDgAoGAIIALjG8VmwRspmwxJAzHnmMnRvA4ACI4AAgGO8WIn+4++5L0xtNZm0qy0gxCIA0UEAAQDXhKr7lV91Dkn9eWAdEMcwCB1AlBBAAMAxOgA9TGNAWk8fldbje0NQiTbnl02GbHwNABQfAggAOMaLaxesuL/nvpaje2T3M9+TXDbjdH8szUfHDx+VtpMHJZN261xt6OQdGUBE8HIHAI4YrA+brRDdpE8le6Sn/ZTddu60TepI9nb4OyK6DOGeZ74vqd5Op3q6tZ8+LG3Hj/l7AFDcCCAA4ADtvpQL6RoV9u59POHvuUNbPEoramTZ5W/2j+SdOb5Lspm0U2Hp0NZHZc/z9zkVigBgqhBAAMAFuWy+CxMmjbmkUlZZJ00rNsjQDm3xRLmmJn/PDacOPCcnDmwOVcsXAEwUAQQAHJDT/7TGjEkVM8mjvKpe6sv8Aw4rKTXBCAAigAACAC7Q/kIEkClhg114xvQDQNEjgACAC+wYEFcXyRs75ybi9U9IW0IAAG4ggAAAJo1zQxj8E4qFoAsWAEQFAQQAHJDLZSSb7vP3MNlipbX+FgCg0AggAIBJ42IXLG0EiXk0gQCAKwggAOAKHYiOKRGLE0AAwBUEEABwgM7UlM2GowtWNpuRZE+bvxcGnniJSn8bAFBoBBAAcEUIpuHVRpqaxrmy4uo7/CPDObmOnjmpWIIWEABwBQEEAFyg0/Dm3F8JXRdrr25skjnLrvSPhIPnMQ8vALiCAAIADshpAMmEowtWokSkrLLO3wsHL25OGgDgBAIIADghPAsRajesXDZcq7YzCB0A3EEAAQBHhKEL1gAnB3ucjReSFpBQXVQAmDACCAA4wM6Cler299wXtqqyF0v4WwCAQiOAAACKnhcPQwBhHRgA0UAAAQAX6MCKcA2rCA+m4QUApxBAAMAFOgtWOMagn5O79/CZhhcAXEEAAQBMgDfqOBAXx4bomcZC0QULAKKBAAIADsiZ/zIhmgQrbGKsAwIAziCAAEChabOBXQk9v4vJxxgQAHAHAQQAHBG6qW39j87zdB2QUn/H7jp67mH7CwCAiSGAAIADwjgJVhjeQPoblYauA6KruLvZ2EQTGIBoIIAAgBNyBJAp5Gmzhy+bSeYTn3NoAQEQDQQQAHAE1c+AZBntDwCFRAABACfoPFgIQi6b9Ldcw18AgGgggACAA3I6C5a/HQpeeN9AsmkNIFT2AaBQCCAA4AC6XwUnk0n7WwCAQiCAAIADtAUkbIPQwyqXSdEAAgAFRAABECkud3QKV504vG02uawJIHq1nfsVaAcDEA0EEAAR4kk8XuFvuyVsN+S1qhzPb4ZOLksXLAAoJAIIgEjxYoMrYjvFyXUpzm20+/Vh+C20C5Y9T+dONnx/AwAwEQQQANEyZEE6TJxWlUcbsxKGq2sXIlT8KQBAQRBAAMAJ3P0OCtPwAkBhEUAAwAFhqw5r40FY30BymV5HLzhNMgCigQACAC4I2xgQz5OScn87ZFgJHQAKiwACABg/rSuPUl8OQxU61z8GBABQEAQQAHABN78Dk0l1mX+54ABQKAQQAMDEjFKHD8Mohlymw98CABQCAQQAHODyCu2jMknDG2VNxzD8Fpk+umABQCERQACgwHRpEi+E65N4o7yDhKMFxN8AABQEAQQACqyvKyk9XW3+XniM1toRhhaQXMrfAAAUBAEEAApIWxFOHNgsJw5u9Y+EhxfSMSAZE0DcDErhawUDgIkggABAAWnPq5MHX5Jjezb5R0wFOZ2UXNb1fkKexOL+ZsjopfWo7ANAwRBAAKDA4iWlkiit9PdEqhvnSlllvfNrE3ol9f6Wu/pjRjaT9rdEdBLedKrPhLz8vjvC0IENAC4cAQQAHLPgohtkztIrHKwgj+T8CdoqvbZ2lFc35g8YGkVOHdoiyd6uUQfSAwCmFi+9AOCY2mlNUtXgfgvIYPuCw8w1LCmvlpUb3jbsbLf+/CvS09Fiu8C5g25hAKKBAAIArtHg4Xj4sFMHJwa7jblKQ1w8kZCG2ctkzvyFA1X8WCzhYH3f+cQJAJOCAAIAjgnHkiCeqcSPshKhi/R6mosaT5QPhg7z0b3LHIonHgAuGAEEABzDffBJ5l9QLx7SabsAoMgQQADAMTpoOqwhxN3zzuW7XfUzJ+reuYb1WQeA8SGAAAAmxBtaofe524nIxDpPW0Do5gQAhUYAAQBMiBcr9bfCwYuVkD8AwAEEEABwTShGoWuLwitbQFwWiyf0rP09AEChEEAAwDHhqSKHa8yCF6MLFgC4gAACAJigcFXmY3HtgkUAAYBCI4AAiBi379rb6nEYKsnmFD2t0IeJN+QtT8/f33RHCJ53AJgEBBAAwMTEwlVhzk/DSyUfAAqNAAIgMjzPk1hptb/npnz1mErylIjrrF3+tWUdEAAoGAIIgAjRmZvcrtzri3JohimErL6ss2AxBgQACo8AAgAYN53ONpYo9/cGuZpJNHbEYnF73gCAwiKAAIBD8tXjEFSStTubndZ2OJfP3K7cTgsIABQcAQQAHBKq6nGYKvPmXG0A6b/C5oN7Zx+qZx8AJowAAgAOsVXQsFTsc6/scOX0sJChCxGaE3XvXJ2+egAwaQggAOCQMK3VnV9ZPDzsNLx0wQKAgiOAAIBDwnMP3Bt1IUKXq/d2FqzQxDsAKF4EEABwiL1Bz136KaGByRu6GjoAoCB4JQYAh2ijAlPFTg0vpi02/rU1H9y7yjzvAKKBAAIALgnTOOSwtSbomJUhrUsMQgeAwiCAAIBDPHuT3v074bqifCxe5u+FgZ6vNi/lr20ul7UfAQDBI4AAgEM8O7FUSLrihGysytCubblMSlOIvwcACBIBBAAcEq4qcdjOdvB8c+k+/Te/AwAIFAEEABwSS5SHrmXBCkVrwuB1zWoAce6UQ/i8A8AEEEAAwCGxeGX4qqG5rPk/k9+0/7pq8OyymaTZc+1swxDiAODCEUAAwCE5Cd/gaB3QncvlA4jb4WlIC0gm7W+5hBYQANFAAAFQrEa9nZzLOV5F9hL6j78XFmE53yF/EjkTQJxrcKAFBEA0EEAAFKuU/3EYLz/NlLNipdXmHMMWQMJScR68rplUj/nXnLdTl/qsJ8OcwQCKCgEEQDHSGrFOczScqdjHEqX+jrtCdx88lxsYAxIWdhre8HCxvxgATBgBBECxajclfH1actpC44XszHPihWIWrMFzzGV69d/8jjNGPR89mMxvAkBxIIAAKFZtpoShVjxMvKQshF2wVP5Sh+WCZ9K9dubgEFzpblMIIACKCgEEQDHSenCLKSHtO2+qxaHLIPkTdvu0B88ul2zVf/M7zhj16mmQ1uYaACgaBBAAxeqkKeEamGB4sUR+EqywNCWoXFay2TAMUxi8qJmU1utdM+qTfsYUbQUBgKJBAAFQjLQmd9SUEAYQfwxIiOR0ELq/DojbhrSAONk2NurzftqUrvwmABQHAgiAYqQB5LApoQsgYQsfeeZy25v3o97Bd8jg+eV0VIVzA+dHPZ8TpnTkNwGgOBBAABQjrckdMCV8LSC6TkkYFyK0p+z6eQ+eX0aXAXHOqNfviCku9hcDgAkjgAAoRhpAdpkSuvUTvHipyR9he2nWLlh6yV1rURhp8PyyTnbBGvX6aUuejgMBgKJBAAFQjLQmt9uUVy5G6DjXq/Cj0gEVmXA1NmkyNbEpv+O2g6Z05jcBoDgQQAAUK+1ko3ePQ1Wnz7d+uN6VaRQhO+WQzM+sI1WO5zcBoHgQQAAUlU/d4W/kvWRKqGYQiiVKTWWel+apltJ/3I+mW0yx4z8+OfzvGgBCjXc5AMVl+ADu501hClO8QkiaxV42RVdMNH/WIWwVA4CzIIAAKGbPmOJ8AMll0qZob5tw0jVAshnbphAaOmLFi5m3QLfr9RqgdUV/ACgqBBAAxUwrcPYOsuvys0iFVEhmwEr3dZugNzhYvrPlqKR60yMazZzygilMwQug6BBAABSdIf3l9bb8VlOcbl7Iz8YUkmHRo3K/e1AslpCFl9wqFbXT/CMi+1/+mXSeOeLqkJtDpjTnNwGguBBAABS7x01xeyahXNb8H8JF2we43fqhDTSxeELmrtgg02bN84+KHNv9pCR7OhxqARl2Ig+b0p7fBIDiQgABUHR0wO6n7hyozGlF7lh+Ux+L+1sOMTVkL8xdsLQNR9cCcVnMk/LqBqmsqvMPiJSUVZu/B5feBof9DfzEFBtAhvwtA0BRIIAAKHbaBWu/bmgw8WIJ3XSLCR+5MHfBymUkl3V80XlTt+9vZXK3Oj9wZrqGzROmdNs9ACgyBBAAUbDJ1O2OaV8bF6cz1daDsM0iNZxeU8fv0tvT0wDq/NueJlFttTth9wCgCBFAABStIV1XHjS5Y5upfvq7iJz+3k0uL/KYD8faTPNtU/p0h+5XAIoRAQRAFDxr6nbaFau/kueUXDYruVC3gGj/pnCMYQlBC4iuW/PfptgAAgDFiAACIBLiCXky1de1Rwceu0cr7+GdBct2IXN9DIifO2Ne3Ml2sERJmaSTPX0mH/8oFmfxQQDFjQACIBLqZsrDnWeOPJYodzGAKLraTCm/gcYztXsXr3RJ1QxJ9rR3maD8pZLyEKdRABgDAgiAotbfh/73r/QOnTr44otZB9fb0NmZsmmd+AhTTQOIi+982jWsp+Pk6ctvkwff/vp8XGL8B4BiRQABEAlX3v57cmLfs4e6zhx1blFCnYTX+Wlsz0XHf7i+DojPi+lMaP6OQ1K9XZmO082HPvf+L6Z/+93/5B8FgOJEAAFQ9PRO8u6n7pGWw9vOnD68zQaQ7paDkkn12scLLfz3uXUhwpAMQndxIUoj3dva13psX/ND//l78tjX/4TWDwBFjQACIBLaThyUU0f3HMyk+h6vmb6gd8n6N8j0BRc7UfnXynsuE+ZJj7QFJCQBxHbBKnwIGTloP5fNxJI9Z5LJnlZJ9rb6RwGgOBFAAESCXz3e09fT/m8rN7zty5e95n/n5q26Tm+J5x8pIJ1FKtRdsELUhmMHoXsFXg3f/DFW1c2UOcs32t2S/MQIx0zZrRsAUOwIIAAiIRaPy8LL35Z+51888dydf/yZP1925W1PVtZO8x/FhQlH64ey4aPA3bCyWZHZi9fL1b/wB3LFGz7QNm/1DQ+Zw5815T/sJwBAkSOAAIiETCYjd3zkHpm7YoOcPCjHMyn5lDO9hvREQjzxqu1ClgvHL+CZIGq7YRWQjtevrJsuKze8SV7z63973/u/+MM7XvfbX/kb89DR/GcAQHEjgACIjE8PDuxNmvKIKd83xYEYohV4fzOMzLlnM+GYBcsuROjAQHR9vrMZ2ZNOyQ+O7JJTa69/p/8IABQ/AgiAaBms6J8x5aOmdNs9XJiwDAOJuzEI3fdNU76V3wSA6CCAAIiUT901UFPWW/Y7TPlbU7RFpGDyCxH6O5hSMS/hylS895vyPVPs9GdMuwsgSgggAKJMFwLRVd9eNKVgnaBC3f3KpzN5hYELY0CMLlP+3ZSn7B4ARAwBBEDkjLjbfNIU7YpVsBXSXVyZe9xCsxK6CR9ewd/6/sEUbQGxaP0AEDUEEACR9Mk7/I28H5vyBVPa7V7AdBapcFTfw0+7X3mFDSA/M+XLppyyewAQQQQQAJHkvbLZQbti/cSUwLOAncbW3w6vcNzF9+Il5p2vYF2wjpjyCVN22T2D1g8AUUQAARBZWvkbUgHULlj/bMrjdg/jE5ouWDoIPf/Wp4P/A6TjPnTCgwdNsT+Y8AEgqgggACJvSEXwYVM+Z8puuxcUU3kPcwuIDqIPyyD0obLpvqDOW2e6+q4pf2eKne+M8AEgygggADDcf5mig4Tb7F5AwlwdDeu553KBzH2srR1PmPI+UxjqAwAGAQQAjBF3pL9oivbVD0wRzMQbOrl0Mt98M7U2m/JrpgxMcEDrB4CoI4AAgG/IzFi6OrrOivVxuzfFtBtQ6ANICBczyWZT5t8pPe8XTHmvKXt1R/++Rsy+BgCRRAABAN+ImbF0fZB/M+Vv7B7OSqvwAQ/ovgCDgSOb7jG5acoCyHOmfMiUp+2eb5TZ1wAgcgggADDEiO4xzab8iyk6eHjK2EHc/nZYhWci4cHnN5fSseFTct6bTPnjkh55IL+b/7sifABAHgEEAEYYEUIOmaIBZOpCSAi7L4XX4LXOZHqn4tr/3JSPmfKTVIXdZ8wHAIxAAAGAUYwSQj5jyqdM0dvmk4wAUgjZdPdkX3lt8fgzU3RBS9b6AICzIIAAwFmMqDxqd6xPmvJpU07pgclSDPEjlw3LDLODz2ku1aH/5ncu3A9M+ZhXJvebj4QPADgHAggAnMOISqQGj780RVtD9uiBSVEEXbCmcDD3lMkmTQC58PPuNeUeUz5iymM5v32M8AEAZ0cAAYDz0MrkkOlTe0zRNUL+wpRnTQnL9E9TKjzV7cHAkem+4PaP46bowpU61e5WPaAIHwBwbgQQABgDncFoRMXyS6b8rina3/8Cx4UUQQuI/zFMctprbGItIPpF2gKmK+a/x5QWUyzCBwCcHwEEAMZhRAVTZzx6tynaJavLlInVZkOeP/T0dTHFcBh8/rJpf2N8mUG/6nFTft2Uv9YD/a1jhA8AGBsCCACMk1Y0bclXPLUbjk67+gumbNEDkaQBJGRBKp8/xnXSZ0z5e1NuN+UhDR76dzBK6xgA4BwIIAAwQR/Socd5KVN+ZsqtpujYkKQpYxbGAdyjClkd3LbZjP3S6+xWGjl1sLkGEfnw4PMPABgHAggATNCIu95anz1qinbHutmUH5oyRuEPIJ4XsyVMtAVkDCu47zXlN03RLlcPmTLQ14xWDwCYGAIIAFwArYQOmSFLtWY8ecx8/G1TdHzIE3rwXIZWgZM9HZLL9A9OCI+2lhPS0dIsWcfXA0kne6S3qz2/bco51i85bYqO8bjblP805aApAzOeET4AYOIIIABwgUaOAYjnE8U+U75migaRD5vypCmjyqUHJ9FasPZmqZ+1JHQD08+cbJa9L/xYMqk+cz38g64xJzb/optk7vwFdve6298r1fXT87NhDdK1Xv6fKRoedbyHPm86wYClzzPhAwAuDK+iADAFPvTNYQmi3JSrTXmVKTeZssGUMlMkFhPZv/mn8uKD/y5VDU1y0bVvlxkLL5FYIuFsz6y4ObVTh3bJw1/9A9n11HfsMS9WIpfc/G656V2fkbLK6pGVemckezql5cg2+7F+xlypbpwvsdIKvda7zcPaxephvxwyZQChAwAmD6+oADBFRoSQfteaooPVrzJljSnzU31dcrp5h5RV1ErdzEUSL0k4W4FXowaQeJmsv+035Pq7/lxKHQ4g2joTi+c/ZrPSacp2Ez6eNw9p+PipKTqr2QDtXqctXACAycOrKgBMsbMEkYWmvMmUm039dqmpFDflcjLNDklwvPvVuQLIdSaAuNwCYuhK9sdMOWzKJlN+YMojpgw7Y4IHAEwdXl0BIEBnCSMbTXm9KTeYssiUar+UmuKcEAaQDr+0mvK0KTqlrgaPNlMG0M0KAILBqy0AFICu/fGKdSQ0m3hymfn3tabcaIpuV5pSYoqp9tuPBX/ddjyA6ORWWnRtFl2PRVs6HjXlAVN0rRYNIsMQPAAgWLzqAoADztIyoq0gV5ii40X04zpT5pmiLSP5uJI39LV8yl/XCxxAhl6o/u3+jzp17jZTnjVFu1dp0dnIhqF7FQAUFq/AAOCAswQQpdOlx/2P+prdYMoSU5abstiU+abMMmWmKdNNqTWlyhQ7y9ZUGAwgf2gCyLftsSkehK7rb+jYDV3AQ1chP2mKDhY/YsoBU/aYssMUHduhrR56MfVr9CyGXdj+NVsIIABQOLwCA4BjNIzoOiDnqCNrINHuWFp0e2jpDyr9ZdKVVUp219MPVd//xd+5quXQi7rqe8qcbHbhJbfd+/r3fXFH3fTZqUx6Un+2hoj+MNEfLPRjf3er/i5Xw8JGPz34abpZAYAzeEUGgJA4RytJoLKZlFQ3lMjHb/MqY4nKhmy6x5yYXTrx1B98J5dKJ7Pi6QInBcKYDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAURP5/X8q7zCOU1UkAAAAASUVORK5CYII=" />
    <input type='text' id='commsearch' name='commsearchinput' placeholder='Search your subscriptions (or visted subs)' />
    <a id='dropDownComms' href="#" alt="Show All Your Communities and Manage" title="Show All Your Communities and Manage" > (Show All) </a>
    </div>
    <div class='topDivBar'>
    <div class='commsAreaStatic'>
    </div>
    </div>
    </div>
    `;
      const topDivCommsBox = document.createElement("div");
      topDivCommsBox.setAttribute("id", "topDivCommsBox");
      topDivCommsBox.style.display = "none";
      topDivCommsBox.innerHTML = `
      <header id='ltBarHeader' class='card-header'>
            <h5><a href=${settings.instance}>Home</a> - <a href='https://lemmyverse.net/communities' target='_new'>Find
                Communities</a>
            </h5>
          </header>
      LemmyTools ${ltVer}
      <div class="commsAreaSearch">
      </div>
      `;
       document.body.prepend(topDivCommsBox);
       document.body.prepend(topDiv);  

       document.getElementById("dropDownComms").addEventListener("click", (e) => {
        e.preventDefault();
        dropDownComms = e;
        window.scrollTo(0, 0);
        dropDownComms.target.innerHTML = 
          dropDownComms.target.innerHTML == " (Show All) " ? dropDownComms.target.innerHTML = " (Hide All) " : dropDownComms.target.innerHTML = " (Show All) ";
        topDivCommsBox.style.display =
          topDivCommsBox.style.display == "none" ? topDivCommsBox.style.display = "block" : topDivCommsBox.style.display = "none";
        searchComms(searchInput.value, communityArray);
      });
 
      styleString += `
      #topDiv
      {
      z-index: 99999999 !important;
      }
      #topDiv input
      {

      }
      .topDivSearch
      {
      min-width: 330px;
      overflow:hidden;
      -ms-overflow-style: none;
      scrollbar-width: none;
      z-index: 99999999 !important;
"mailx" stuck linux
      }
      #topDiv img:hover{
      margin-top:-5px;
      border:10px yellow;
      }

      .topDivBar
      {
      width: 100%;
      overflow:hidden;
      -ms-overflow-style: none;
      scrollbar-width: none;
      }
      .topDivBar br {
      display: none;
      }
      .topDivBar li, a {
      display:inline-block;
      padding-right: 5px;
      margin-top: 4px;
      }
      .topDivBar hr {
      display:none;
      }
      .topDivBar img {
      display:none;
      }
      .topDivRoot
      {
      height:35px;
      position: fixed;
      top: 0;
      left: 0;
      width:100%;
      overflow: hidden;
      white-space: nowrap;
      z-index: 99999999 !important;
      border:2px;
      display: inline-flex;
			flex-direction: row;
      }

      #topDivCommsBox
      {
      float:left;
      width: 100%;
      height: 100%;
      top: 35px;
      left: 0;
      }

      #root 
      {
      margin-top: 35px !important;
      }

      `;

  }
     // ADD MAIN CSS
  document.head.appendChild(document.createElement("style")).innerHTML = styleString;
  //add lemmytools elements to page
  document.body.appendChild(odiv); //options   
    
 let commsAreaSearch = document.getElementsByClassName("commsAreaSearch");
 let commsAreaStatic = document.getElementsByClassName("commsAreaStatic");
 let dropDownComms = document.getElementById("dropDownComms");

  const searchInput = document.getElementById("commsearch");
  searchInput.addEventListener("input", (e) => {
    e.preventDefault();
    searchComms(searchInput.value, communityArray);
  });
	document.getElementById("lemmyOptionsIcon").addEventListener("click", (e) => {
        e.preventDefault();
        options(1);
      });
  document.getElementById("LTsaveoptions").addEventListener("click", (e) => {
    e.preventDefault();
    options(3);
  });
  document.getElementById("lemmyLogo").addEventListener("click", (e) => {
    e.preventDefault();
    window.location = homeInstance;
  });    
 

  // document.onreadystatechange = () => {
  //   if (document.readyState === "interactive") {
  //     // document ready
  //     if (
  //       showImagesButton.value == "Hide All Images" ||
  //       settings.showAllImages
  //     ) {
  //       allImages(true);
  //     }
  //   }
  // };

  //Easier Subscribe Buttons ---------------------------
  ltLog("url is " + url);
  let rCommunityArray = [];
  //Browsing remote instance
  setInterval(function () {
    const broken = url.split("/c/");
    const site = broken[0].replace("https://", "");
    let community = broken[1];
    let communityName = community;
    try {
      const broken2 = community.split("?");
      community = broken2[0];
      communityName =
        community.indexOf("@") > -1 ? community : community + "@" + site;
    } catch {}

    const subString =
      `${settings.instance}/search?q=!${communityName}&type=All&listingType=All&page=1`.replace(
        "#",
        ""
      );

    if (notHomeAndInCommunity(url)) {
      ltLog(`On remote instance community - DIRECT - Button to: ${subString}`);
      rCommunityArray = update(community, communityName, subString);
      rCommunityArray = [...new Set(rCommunityArray)];
      rCommunityArray = rCommunityArray.reverse();
      commsAreaStatic[0].innerHTML = rCommunityArray;
      communityArray = rCommunityArray;
    }
  }, 1000);
  tagUsers();
  // Update homeInstance Comms for bar to use
      

  let communityArray = [];
  if (url.includes(settings.instance)) {
    ltLog("home instance do bar");
    document
      .querySelectorAll('[class="list-inline-item d-inline-block"]')
      .forEach(function (el) {
        communityArray.push("<li>" + el.innerHTML.toLowerCase() + "</li>");
      });
    communityArray = [...new Set(communityArray)];
    if (count === 0 || count == null) {
      count = communityArray.length;
    }

    communityArray = communityArray.join("");

    commsAreaStatic[0].innerHTML += communityArray;
    if ( commsAreaStatic[0].innerHTML.length >= 20) {
      ltLog("Got Results >= 20", LogDebug);
      ltLog("setting localcomms localstore", LogDebug);
      localStorage.setItem("localComms", communityArray);
      localStorage.setItem("commsCount", count.toString()); // todo why store the count? communityArray.length everywhere should be easier
      //force update the page
      searchComms(searchInput.value, communityArray);
    } else {
      ltLog("get localcomms from localstore", LogDebug);
      communityArray = localStorage.getItem("localComms");

       commsAreaStatic[0].innerHTML += communityArray;
     
      //If previous search display previous results
      try {
      	let latestQueryString = localStorage.getItem("prevSearchCommsQueries");
        let latestQueryArray = [];
        latestQueryArray = latestQueryString.split(",");
        if (currentUrl.indexOf(latestQueryArray[latestQueryArray.length - 1]) !== -1) {
         searchComms(latestQueryArray[latestQueryArray.length - 1], communityArray);
        }
        else {
         searchComms(searchInput.value, communityArray);
       		}
     		}
     	catch {
    	 searchComms(searchInput.value, communityArray);
     		}   
    }
  } 
  else {
    ltLog("On Remote Instance - Bar", LogDebug);
  }

  //Expand Images----------------------------------------------

  setInterval(function () {
    if (settings.expandImages === true) {
      let theImages = document.getElementsByClassName("img-expanded");
      for (let i = 0; i < theImages.length; i++) {
        theImages[i].addEventListener("mousedown", startDrag);
      }

      let posX;
      let node;

      function startDrag(e) {
        e.preventDefault();

        node = e.currentTarget;
        node.style.cursor = "nwse-resize";
        try {
          node.closest("a").removeAttribute("href");
          node.target.closest("a").setAttribute("overflow", "auto;");
          node.preventDefault();
        } catch {}

        posX = e.clientX;
        document.addEventListener("mousemove", resize);
        document.addEventListener("mouseup", stopDrag);
      }

      function resize(e) {
        e.preventDefault();
        const nextPosX = e.pageX;
        node.style.width =
          node.offsetWidth +
          (nextPosX - posX) * settings.expandImageSpeed +
          "px";
        posX = nextPosX;
      }

      function stopDrag(e) {
        e.preventDefault();
        node.style.cursor = "default";
        document.removeEventListener("mousemove", resize);
        document.removeEventListener("mouseup", stopDrag);
      }
    } // if expand images

    //Removes the offset from images.
    try {
      if (settings.expandImages) {
        removeClassByWildcard("offset-*");
      }
    } catch {}

    //sidebar settings do
    if (settings.hideSideBar === true) {
      try {
        const sidebarSubscribed = document.getElementById("sidebarContainer");
        sidebarSubscribed.style.display = "none";
        removeClassByWildcard("site-sideba*");

        const serverInfo = document.getElementById("sidebarInfo");
        serverInfo.style.display = "none";
      } catch {}
    }

    //Show All Images Functionality on button toggle.
    try {
      let addImageButtonArea = document.querySelector(".post-listings");
      let showImage = document.createElement("div");
      showImage.innerHTML =
        "<div class='col-auto'><input type='button' id='showAllImages' class='pointer btn btn-secondary text-bg-primary' value='Show All Images' /> </div>";
      if (
        addImageButtonArea.innerHTML.indexOf("showAllImages") === -1 &&
        !settings.showAllImages &&
        !settings.hideShowAllImagesButton
      ) {
        addImageButtonArea.prepend(showImage);
        const showImagesButton = document.getElementById("showAllImages");
        showImagesButton.addEventListener("click", function () {
          if (showImagesButton.value === "Show All Images") {
            showImagesButton.value = "Hide All Images";
            allImages(true);
          } else {
            showImagesButton.value = "Show All Images";
            allImages(false);
          }
        });
      }
    } catch {}
    //Links Open In New Tab
    if (settings.linksInNewTab == true)
    {
    	linksInNewTab();
    }
    //Block Content
    if (settings.blockContent == true)
    {
    	blockContent(settings.blockFilters);
    };
  }, 500);
    
  }
})();
  function isLemmySite() {
    const meta = document.querySelector('meta[name="Description"]');
    return (
      meta && meta.content === "Lemmy"
    );
  }

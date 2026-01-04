// ==UserScript==
// @name         MH Timers+
// @author       Warden Slayer
// @namespace    https://greasyfork.org/en/users/227259-wardenslayer
// @version      2.0.2
// @description  Handy script to keep track of the various MH location timers
// @include      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @resource     YOUR_CSS https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css
// @require      https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/js/all.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js
// @icon         https://www.mousehuntgame.com/images/items/weapons/974151e440f297f1b6d55385310ac63c.jpg?cv=2
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/388058/MH%20Timers%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/388058/MH%20Timers%2B.meta.js
// ==/UserScript==
$(document).ready(function () {
  debugLog("Timers+ Started!");
  const cssTxt = GM_getResourceText("YOUR_CSS");
  GM_addStyle(cssTxt);
  setInitialReminders();
  setInitialProps();
  loadFunction();
});

function loadFunction() {
  updateProps("currentLocation", user.environment_type);
  buildTimerBox();
  buildTinkerPanel();
  runTimers();
}

$(document).ajaxComplete(function (event, xhr, options) {
  if (
    options.url ==
    "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php"
  ) {
    updateProps("prevLocation", getTimerProps().currentLocation);
    loadFunction();
  }
});

function setInitialReminders() {
  const remindersObject = getReminders();
  let reminders = {};
  if (remindersObject) {
    reminders = remindersObject;
  } else {
    reminders = {
      grove: { master: "Y", flags: { open: "N", closed: "N" } },
      cove: { master: "Y", flags: { low: "N", mid: "N", high: "N" } },
      garden: {
        master: "Y",
        flags: { spring: "N", summer: "N", fall: "N", winter: "N" },
      },
      spill: {
        master: "Y",
        flags: {
          hero: "N",
          knight: "N",
          lord: "N",
          baron: "N",
          count: "N",
          duke: "N",
          gduke: "N",
          aduke: "N",
        },
      },
    };
  }
  setReminders(reminders);
}

function getReminders() {
  return JSON.parse(localStorage.getItem("ws.mh.timers.reminders"));
}

function setReminders(newReminders) {
  localStorage.setItem("ws.mh.timers.reminders", JSON.stringify(newReminders));
}

function updateReminders(key, newReminderObject) {
  let remindersObject = getReminders();
  remindersObject[key] = newReminderObject;
  setReminders(remindersObject);
}

//-----------------------------------------------------------------------------
function setInitialProps() {
  const propsObject = getTimerProps();
  let properties = {};
  if (propsObject) {
    properties = propsObject;
  } else {
    properties = {
      hideTimers: "N",
      currentLocation: user.environment_type,
      prevLocation: "",
      updateInterval: 5,
      killSwitch: "Y",
      disarmAfterTravel: "N",
    };
  }
  setTimerProps(properties);
}

function getTimerProps() {
  return JSON.parse(localStorage.getItem("ws.mh.timers.props"));
}

function setTimerProps(newProps) {
  localStorage.setItem("ws.mh.timers.props", JSON.stringify(newProps));
}

function updateProps(key, newPropsObject) {
  let propsObject = getTimerProps();
  propsObject[key] = newPropsObject;
  setTimerProps(propsObject);
}

//===================================== TimerBox ======================================
//
//
//===================================================================================
function buildTimerBox() {
  if ($(".timerBox").length > 0 || $(".accordion").length > 0) return;
  const container = $("#mousehuntContainer");
  const accordion = document.createElement("div");
  accordion.classList.add("accordion");
  $(accordion).css({
    background: "rgb(116,125,205)",
    width: "98%",
    height: "20px",
    padding: "5px",
    border: "2px solid black",
    cursor: "pointer",
  });
  const accordionPrompt = document.createElement("div");
  accordionPrompt.classList.add("accordionPrompt");
  const accordionTitle = document.createElement("div");
  accordionTitle.classList.add("accordionTitle");
  $(accordionTitle).text("MouseHunt Timers+").css({
    float: "left",
    "text-align": "left",
    "vertical-align": "middle",
    padding: "1px 0",
    "font-size": "12px",
    "font-weight": "bold",
  });
  $(accordionPrompt).text("Collapse").css({
    float: "right",
    padding: "1px 0",
    "font-size": "11px",
    "font-weight": "bold",
  });
  accordion.appendChild(accordionTitle);
  accordion.appendChild(accordionPrompt);
  const timerBox = document.createElement("div");
  timerBox.classList.add("timerBox");
  if (getTimerProps().hideTimers == "Y") {
    timerBox.classList.add("hide");
    $(accordionPrompt).text("Expand");
  } else {
    //dont hide
  }
  $(timerBox).css({
    background:
      "linear-gradient(90deg, rgba(215,215,215,1) 2%, rgba(213,213,215,1) 71%, rgba(228,228,228,1) 100%)",
    height: 150 + "px",
    padding: 2 + "px",
  });
  let forbiddenGrove = buildForbiddenGrove();
  let balacksCove = buildBalacksCove();
  let seasonalGarden = buildSeasonalGarden();
  let toxicSpill = buildToxicSpill();
  timerBox.appendChild(forbiddenGrove);
  timerBox.appendChild(balacksCove);
  timerBox.appendChild(seasonalGarden);
  timerBox.appendChild(toxicSpill);
  //LAST
  container.prepend(timerBox);
  container.prepend(accordion);
}

function updateSummary() {
  const fg = $(".forbiddenGroveHeaderValue").text();
  const bc = $(".balacksCoveHeaderValue").text();
  const sg = $(".seasonalGardenHeaderValue").text();
  const ts = $(".toxicSpillHeaderValue").text();
  let accordionSummary = "";
  if ($(".accordionSummary").length > 0) {
    accordionSummary = $(".accordionSummary");
  } else {
    accordionSummary = document.createElement("div");
    accordionSummary.classList.add("accordionSummary");
  }
  $(accordionSummary)
    .text("[" + fg + "/" + bc + "/" + sg + "/" + ts + "]")
    .css({
      float: "left",
      padding: "1px 0",
      "font-size": "11px",
      "font-weight": "bold",
      "margin-left": "100px",
    });
  $(".accordion").append(accordionSummary);
}

$(document).on("click", ".accordion", function () {
  const props = getTimerProps();
  if (props.hideTimers == "Y") {
    //show
    $(".timerBox").removeClass("hide");
    $(".accordionPrompt").text("Collapse");
    updateProps("hideTimers", "N");
  } else {
    //hide
    $(".timerBox").find("*").removeClass("hide");
    $(".timerBox").addClass("hide");
    $(".accordionPrompt").text("Expand");
    $(".tinkerPanel").addClass("hide");
    $(".tinkerButton").text("Tinker");
    updateProps("hideTimers", "Y");
  }
});

function buildTravelButtons(location) {
  const remindersObject = getReminders();
  const thisControlPanel = document.createElement("div");
  thisControlPanel.classList.add(location + "ControlPanel");
  const thisButton = document.createElement("button");
  thisButton.id = location + "Button";
  $(thisButton).addClass("mousehuntActionButton small");
  let title = "";
  let isChecked = "";
  let cbTitle = "";
  if (location == "forbiddenGrove") {
    title = "Travel to the Forbidden Grove";
    cbTitle = "Remind me of time changes in the Forbidden Grove.";
    if (remindersObject.grove.master == "Y") {
      isChecked = "Yes";
    }
  } else if (location == "balacksCove") {
    title = "Travel to Balack's Cove";
    cbTitle = "Remind me of time changes in Balack's Cove.";
    if (remindersObject.cove.master == "Y") {
      isChecked = "Yes";
    }
  } else if (location == "seasonalGarden") {
    title = "Travel to the Seasonal Garden";
    cbTitle = "Remind me of time changes in the Seasonal Garden.";
    if (remindersObject.garden.master == "Y") {
      isChecked = "Yes";
    }
  } else if (location == "toxicSpill") {
    title = "Travel to the Toxic Spill";
    cbTitle = "Remind me of time changes in the Toxic Spill.";
    if (remindersObject.spill.master == "Y") {
      isChecked = "Yes";
    }
  }
  $(thisButton).attr("title", title);
  const travelText = document.createElement("span");
  $(travelText).addClass("travelText").text("Travel").css({
    "font-size": "12px",
  });
  $(thisButton).append(travelText);
  thisControlPanel.append(thisButton);
  $(thisControlPanel).css({
    float: "left",
    width: "100%",
    height: "20%",
    "vertical-align": "middle",
  });
  $(thisButton).css({
    width: "75px",
    height: "100%",
    float: "left",
    marginRight: "12px",
  });
  const thisCb = document.createElement("input");
  thisCb.type = "checkbox";
  thisCb.name = location + "Cb";
  thisCb.value = "value";
  thisCb.id = location + "Cb";
  $(thisCb).addClass("friendsPage-friendRow-checkBox");
  thisCb.checked = isChecked;
  const thisCbLabel = document.createElement("label");
  thisCbLabel.htmlFor = location + "CbLabel";
  thisCbLabel.appendChild(document.createTextNode("Remind"));
  thisControlPanel.appendChild(thisCbLabel);
  thisControlPanel.appendChild(thisCb);
  $(thisCbLabel).css({
    float: "left",
    fontSize: "14px",
    width: "50px",
    height: "100%",
    "vertical-align": "middle",
  });
  $(thisCb).css({
    float: "left",
    width: "20px",
    margin: 0,
    "vertical-align": "middle",
  });
  $(thisCb).attr("title", cbTitle);
  if (location == "toxicSpill") {
    //tinker button
    const tinkerButton = document.createElement("div");
    tinkerButton.classList.add("tinkerButton");
    $(tinkerButton).text("Tinker");
    $(tinkerButton).attr("title", "Tinker Menu");
    $(tinkerButton).text("Tinker");
    $(tinkerButton).css({
      width: "30px",
      float: "right",
      padding: 3 + "px",
      color: "rgb(4, 44, 202)",
      marginRight: "5px",
      cursor: "pointer",
    });
    thisControlPanel.appendChild(tinkerButton);
  }
  return thisControlPanel;
}

//===================================== Timers ======================================
//
//
//===================================================================================
function runTimers() {
  debugLog("Timers Updating");
  updateText();
  const updateInterval = parseInt(getTimerProps().updateInterval, 10);
  if (updateInterval == null) {
    setInterval(updateText, 60000);
  } else {
    setInterval(updateText, updateInterval * 60000);
  }
}

function updateText() {
  if ($(".forbiddenGrove").length > 0) updateForbiddenGroveTimer();
  if ($(".balacksCove").length > 0) updateBalacksCoveTimer();
  if ($(".seasonalGarden").length > 0) updateSeasonalGardenTimer();
  if ($(".toxicSpill").length > 0) updateToxicSpillTimer();
  updateSummary();
}

//=========================================Generics=================================================
function genericTimerBuild(name, label, value, style, subflag) {
  const TimerName = document.createElement("div");
  TimerName.classList.add(name);
  const TimerLabel = document.createElement("div");
  TimerLabel.classList.add(name + "Label");
  const TimerLabelText = document.createTextNode(label);
  TimerLabel.appendChild(TimerLabelText);
  const TimerValue = document.createElement("div");
  TimerValue.classList.add(name + "Value");
  const TimerValueText = document.createTextNode(value);
  TimerValue.appendChild(TimerValueText);
  $(TimerLabel).css({
    float: "left",
    "font-weight": 700,
    marginRight: "5px",
  });
  if (style) {
    $(TimerName).css(style);
  }
  if (subflag) {
    $(TimerValue).css({
      float: "right",
    });
  }
  TimerName.appendChild(TimerLabel);
  TimerName.appendChild(TimerValue);
  return TimerName;
}

function getGenericLocatonDetails(location) {
  const now = todayNow();
  let first = 0;
  let rotaionLenght = 0;
  let keyTimes = {};
  if (location == "fg") {
    first = 1285704000;
    rotaionLenght = 20;
    keyTimes = { Closed: 16, Open: rotaionLenght };
  } else if (location == "bc") {
    first = 1294680060;
    rotaionLenght = 18.6667;
    keyTimes = {
      MidF: 16,
      High: 17,
      MidE: 17.6667,
      Low: rotaionLenght,
    };
  } else if (location == "sg") {
    first = 288000;
    rotaionLenght = 320;
    keyTimes = {
      Fall: 80,
      Winter: 160,
      Spring: 240,
      Summer: rotaionLenght,
    };
  } else if (location == "ts") {
    first = 1503597600;
    rotaionLenght = 302;
    keyTimes = {
      //https://mhwiki.hitgrab.com/wiki/index.php/Toxic_Spill#Pollution_Levels
      Knight: 15,
      Lord: 31,
      Baron: 49,
      Count: 67,
      Duke: 91,
      GDuke: 115,
      ADuke: 139,
      //Falling
      ADukeF: 151,
      GDukeF: 163,
      DukeF: 187,
      CountF: 211,
      BaronF: 235,
      LordF: 253,
      KnightF: 271,
      HeroF: 287,
      Hero: rotaionLenght,
    };
  }
  let timePassedHours = (now - first) / 3600;
  const rotationsExact = timePassedHours / rotaionLenght;
  const rotationsInteger = Math.trunc(rotationsExact);
  const partialrotation = (rotationsExact - rotationsInteger) * rotaionLenght;
  const details = {
    rotationLength: rotaionLenght,
    partialRotation: partialrotation,
    keyTimes: keyTimes,
  };
  return details;
}

function getGenericSublocation(currentSub) {
  let subArray = [];
  if (currentSub == "fgOpen") {
    subArray = ["Closes", "Opens"];
  } else if (currentSub == "fgClosed") {
    subArray = ["Opens", "Closes"];
  } else if (currentSub == "bcLow") {
    subArray = ["Mid", "High", "Low"];
  } else if (currentSub == "bcMidF") {
    subArray = ["High", "Mid", "Low"];
  } else if (currentSub == "bcHigh") {
    subArray = ["Mid", "Low", "High"];
  } else if (currentSub == "bcMidE") {
    subArray = ["Low", "High", "Mid"];
  } else if (currentSub == "sgFall") {
    subArray = ["Winter", "Spring", "Summer", "Fall"];
  } else if (currentSub == "sgWinter") {
    subArray = ["Spring", "Summer", "Fall", "Winter"];
  } else if (currentSub == "sgSpring") {
    subArray = ["Summer", "Fall", "Winter", "Spring"];
  } else if (currentSub == "sgSummer") {
    subArray = ["Fall", "Winter", "Spring", "Summer"];
  } else if (currentSub == "tsHero") {
    subArray = ["Knight", "Lord", "Baron", "Count", "Duke"];
  } else if (currentSub == "tsKnight") {
    subArray = ["Lord", "Baron", "Count", "Duke", "GrandDuke"];
  } else if (currentSub == "tsLord") {
    subArray = ["Baron", "Count", "Duke", "GrandDuke", "Archduke"];
  } else if (currentSub == "tsBaron") {
    subArray = ["Count", "Duke", "GrandDuke", "Archduke", "Baron"];
  } else if (currentSub == "tsCount") {
    subArray = ["Duke", "GrandDuke", "Archduke", "Count", "Baron"];
  } else if (currentSub == "tsDuke") {
    subArray = ["GrandDuke", "Archduke", "Duke", "Count", "Baron"];
  } else if (currentSub == "tsGDuke") {
    subArray = ["Archduke", "GrandDuke", "Duke", "Count", "Baron"];
  } else if (currentSub == "tsADuke") {
    //This is the same for rising and falling
    subArray = ["GrandDuke", "Duke", "Count", "Baron", "Lord"];
  } else if (currentSub == "tsGDukeF") {
    subArray = ["Duke", "Count", "Baron", "Lord", "Knight"];
  } else if (currentSub == "tsDukeF") {
    subArray = ["Count", "Baron", "Lord", "Knight", "Hero"];
  } else if (currentSub == "tsCountF") {
    subArray = ["Baron", "Lord", "Knight", "Hero", "Count"];
  } else if (currentSub == "tsBaronF") {
    subArray = ["Lord", "Knight", "Hero", "Baron", "Count"];
  } else if (currentSub == "tsLordF") {
    subArray = ["Knight", "Hero", "Lord", "Baron", "Count"];
  } else if (currentSub == "tsKnightF") {
    subArray = ["Hero", "Knight", "Lord", "Baron", "Count"];
  } else if (currentSub == "tsHeroF") {
    subArray = ["Knight", "Lord", "Baron", "Count", "Duke"];
  }
  return subArray;
}

function genericOptionsHeaderBuild(name, label, style) {
  const OptionsHeader = document.createElement("div");
  OptionsHeader.classList.add(name);
  const OptionsHeaderLabel = document.createElement("div");
  OptionsHeaderLabel.classList.add(name + "Label");
  const OptionsHeaderLabelText = document.createTextNode(label);
  OptionsHeaderLabel.appendChild(OptionsHeaderLabelText);
  $(OptionsHeaderLabel).css({
    float: "left",
    width: "100%",
    "font-weight": 700,
    marginRight: "5px",
  });
  if (style) {
    $(OptionsHeader).css(style);
  }
  OptionsHeader.appendChild(OptionsHeaderLabel);
  return OptionsHeader;
}

function genericOptionsBuild(
  parent,
  childClass,
  name,
  label,
  checked,
  labelStyle,
  childStyle,
  title
) {
  const OptionCb = document.createElement("input");
  OptionCb.type = "checkbox";
  OptionCb.name = name;
  OptionCb.value = "value";
  OptionCb.id = name;
  if (checked == "Y") {
    OptionCb.checked = "Yes";
  } else {
    OptionCb.checked = "";
  }
  const OptionCbLabel = document.createElement("label");
  OptionCbLabel.htmlFor = "" + name + "Label";
  OptionCbLabel.appendChild(document.createTextNode(label));
  if (labelStyle) {
    $(OptionCbLabel).css(labelStyle);
  } else {
    $(OptionCbLabel).css({
      float: "left",
      width: "30px",
      padding: "1px",
    });
  }
  $(OptionCb).css({
    float: "left",
    width: "20px",
  });
  if (title) {
    $(OptionCb).attr("title", title);
  } else {
    $(OptionCb).attr(
      "title",
      "Selecting these will limit the time change reminders to just those selected"
    );
  }
  const child = document.createElement("div");
  child.classList.add(childClass);
  child.append(OptionCbLabel);
  child.append(OptionCb);
  if (childStyle) {
    $(child).css(childStyle);
  } else {
    $(child).css({
      float: "left",
      height: "25%",
      width: "100%",
    });
  }
  parent.append(child);
  return child;
}

function genericTimerUpdate(selector, currentValue, diff, label) {
  const timeNext = diff.toPrecision(4);
  const timeDays = 0;
  const timeNextHours = Math.trunc(timeNext);
  const timeNextMinutes = Math.ceil((timeNext - timeNextHours) * 60);
  const timeObj = convertToDyHrMn(timeDays, timeNextHours, timeNextMinutes);
  $(selector + currentValue).show();
  $(selector + currentValue + "Label").text(label);
  $(selector + currentValue + "Value").text(
    formatOutput(timeObj.days, timeObj.hours, timeObj.minutes)
  );
  return timeObj;
}

function genericReminderCheck(timeObj, remindersObj, subLocation, interval) {
  let result = false;
  if (timeObj.days != 0 && timeObj.hours != 0) {
    //Not time yet
  } else if (timeObj.minutes > interval) {
    //Too soon to remind
  } else if (remindersObj.master != "Y") {
    //I am not Y
  } else if (remindersObj.flags[subLocation] == "Y") {
    result = true;
  } else {
    let yesCount = 0;
    for (const [key, value] of Object.entries(remindersObj.flags)) {
      if (key == subLocation) {
        //not myself
      } else if (value == "Y") {
        yesCount++;
      }
    }
    if (yesCount < 1) {
      result = true;
    }
  }
  debugLog(["ReminderCheck", subLocation, result]);
  return result;
}
function genericRadioBuild(
  parent,
  radioClass,
  name,
  label,
  children,
  checked,
  title
) {
  const thisRadioDiv = document.createElement("div");
  thisRadioDiv.classList.add(name);
  const thisRadioLabel = document.createElement("label");
  thisRadioLabel.htmlFor = "" + name + "Label";
  thisRadioLabel.appendChild(document.createTextNode(label));
  $(thisRadioLabel).css({
    "vertical-align": "middle",
  });
  thisRadioDiv.appendChild(thisRadioLabel);
  children.forEach(function (val) {
    const thisRadio = document.createElement("input");
    thisRadio.type = "radio";
    thisRadio.name = "timer" + radioClass + "Radio" + val;
    thisRadio.value = val;
    thisRadio.id = "timer" + radioClass + "Radio" + val;
    if (checked == val) {
      thisRadio.checked = true;
    }
    const thisLabel = document.createElement("label");
    thisLabel.htmlFor = "timer" + radioClass + "Radio" + val + "Label";
    thisLabel.appendChild(document.createTextNode(val));
    $(thisLabel).css({
      width: "10px",
      "vertical-align": "middle",
    });
    $(thisRadio).css({
      width: "15px",
      "vertical-align": "middle",
    });
    thisRadioDiv.appendChild(thisRadio);
    thisRadioDiv.appendChild(thisLabel);
  });
  if (title) {
    $(thisRadioDiv).attr("title", title);
  }
  parent.append(thisRadioDiv);
  return thisRadioDiv;
}

//===================================== Forbidden Grove ======================================
function buildForbiddenGrove() {
  const forbiddenGrove = document.createElement("div");
  forbiddenGrove.classList.add("forbiddenGrove");
  $(forbiddenGrove).css({
    float: "left",
    "border-left": "2px solid black",
    "border-bottom": "2px solid black",
    "border-top": "2px solid black",
    "border-radius": "2px",
    width: "22%",
    height: "95%",
    padding: 2 + "px",
  });
  const forbiddenGroveClockBox = document.createElement("div");
  forbiddenGroveClockBox.classList.add("forbiddenGroveClockBox");
  forbiddenGrove.append(forbiddenGroveClockBox);
  $(forbiddenGroveClockBox).css({
    float: "left",
    width: "100%",
    height: "80%",
  });
  //Header
  const forbiddenGroveHeader = genericTimerBuild(
    "forbiddenGroveHeader",
    "Forbidden Grove is:",
    "Open"
  );
  //Close
  const forbiddenGroveCloses = genericTimerBuild(
    "forbiddenGroveCloses",
    "Closes in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Open
  const forbiddenGroveOpens = genericTimerBuild(
    "forbiddenGroveOpens",
    "Opens in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Append
  forbiddenGroveClockBox.appendChild(forbiddenGroveHeader);
  forbiddenGroveClockBox.appendChild(forbiddenGroveCloses);
  forbiddenGroveClockBox.appendChild(forbiddenGroveOpens);
  forbiddenGrove.append(buildTravelButtons("forbiddenGrove"));
  return forbiddenGrove;
}

function updateForbiddenGroveTimer() {
  const propsObject = getTimerProps();
  const remindersObject = getReminders();
  const remindInterval = parseInt(propsObject.updateInterval, 10);
  const forbiddenGrove = $(".forbiddenGroveClockBox");
  const fgDetails = getGenericLocatonDetails("fg");
  const partialrotation = fgDetails.partialRotation;
  const keyTimes = fgDetails.keyTimes;
  let timeNext = 0;
  if (partialrotation < keyTimes.Closed) {
    //Open
    $(".forbiddenGroveHeaderValue").text(" OPEN");
    $(".forbiddenGroveHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("fgOpen");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Closes") {
        timeNext = genericTimerUpdate(
          ".forbiddenGrove",
          currentValue,
          keyTimes.Closed - partialrotation,
          "Closes in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.grove,
            "closed",
            remindInterval
          )
        ) {
          myConfirm("grove", "closing");
          if (propsObject.killSwitch == "Y") {
            $("#forbiddenGroveCb").click();
          }
        }
      } else {
        genericTimerUpdate(
          ".forbiddenGrove",
          currentValue,
          keyTimes.Open - partialrotation,
          "Opens again in:"
        );
      }
      forbiddenGrove.append($(".forbiddenGrove" + currentValue).detach());
    });
  } else {
    //Closed
    $(".forbiddenGroveHeaderValue").text("CLOSED");
    $(".forbiddenGroveHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("fgClosed");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Opens") {
        timeNext = genericTimerUpdate(
          ".forbiddenGrove",
          currentValue,
          keyTimes.Open - partialrotation,
          "Opens in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.grove,
            "open",
            remindInterval
          )
        ) {
          myAlert("The forbidden grove is opening soon");
          if (propsObject.killSwitch == "Y") {
            $("#forbiddenGroveCb").click();
          }
        }
      } else {
        genericTimerUpdate(
          ".forbiddenGrove",
          currentValue,
          keyTimes.Open - partialrotation + keyTimes.Closed,
          "Next Close in:"
        );
      }
      forbiddenGrove.append($(".forbiddenGrove" + currentValue).detach());
    });
  }
}

$(".forbiddenGrove").on("change", ":input", function () {
  if (this.checked) {
    this.checked = "Yes";
  } else {
    this.checked = "";
  }
  tinkerCbClick("grove", this.name, this.checked);
  debugLog("FG Updated");
});

//====================================== Balacks's Cove ======================================
function buildBalacksCove() {
  //if ($(".balacksCove").length > 0) return;
  const balacksCove = document.createElement("div");
  balacksCove.classList.add("balacksCove");
  $(balacksCove).css({
    float: "left",
    "border-left": "2px solid black",
    "border-bottom": "2px solid black",
    "border-top": "2px solid black",
    "border-radius": "2px",
    width: "22%",
    height: "95%",
    padding: 2 + "px",
  });
  const balacksCoveClockBox = document.createElement("div");
  balacksCoveClockBox.classList.add("balacksCoveClockBox");
  balacksCove.append(balacksCoveClockBox);
  $(balacksCoveClockBox).css({
    float: "left",
    width: "100%",
    height: "80%",
  });
  //Header
  const balacksCoveHeader = genericTimerBuild(
    "balacksCoveHeader",
    "Balack's Cove is:",
    "Low Tide"
  );
  //Low
  const balacksCoveLow = genericTimerBuild(
    "balacksCoveLow",
    "Low Tide in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Mid
  const balacksCoveMid = genericTimerBuild(
    "balacksCoveMid",
    "Mid Tide in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //High
  const balacksCoveHigh = genericTimerBuild(
    "balacksCoveHigh",
    "High Tide in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Append
  balacksCoveClockBox.appendChild(balacksCoveHeader);
  balacksCoveClockBox.appendChild(balacksCoveLow);
  balacksCoveClockBox.appendChild(balacksCoveMid);
  balacksCoveClockBox.appendChild(balacksCoveHigh);
  balacksCove.append(buildTravelButtons("balacksCove"));
  return balacksCove;
}

function updateBalacksCoveTimer() {
  const propsObject = getTimerProps();
  const remindersObject = getReminders();
  const remindInterval = parseInt(propsObject.updateInterval, 10);
  const balacksCove = $(".balacksCoveClockBox");
  const bcDetails = getGenericLocatonDetails("bc");
  const partialrotation = bcDetails.partialRotation;
  const keyTimes = bcDetails.keyTimes;
  let timeNext = 0;
  if (partialrotation < keyTimes.MidF) {
    //Low
    $(".balacksCoveHeaderValue").text("LOW");
    $(".balacksCoveHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("bcLow");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Mid") {
        timeNext = genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.MidF - partialrotation,
          "Mid Tide/F in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.cove,
            "mid",
            remindInterval
          )
        ) {
          myConfirm("cove", "mid");
          if (propsObject.killSwitch == "Y") {
            $("#balacksCoveCb").click();
          }
        }
      } else if (currentValue == "High") {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.High - partialrotation,
          "High Tide in:"
        );
      } else {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low - partialrotation,
          "Low Tide again in:"
        );
      }
      balacksCove.append($(".balacksCove" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.MidF &&
    partialrotation < keyTimes.High
  ) {
    //Mid (flooding)
    $(".balacksCoveHeaderValue").text("MID-Flooding");
    $(".balacksCoveHeaderValue").css({
      color: "orange",
    });
    const subArray = getGenericSublocation("bcMidF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "High") {
        timeNext = genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.High - partialrotation,
          "High Tide in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.cove,
            "high",
            remindInterval
          )
        ) {
          myConfirm("cove", "high");
          if (propsObject.killSwitch == "Y") {
            $("#balacksCoveCb").click();
          }
        }
      } else if (currentValue == "Mid") {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.MidE - partialrotation,
          "Mid Tide/E in:"
        );
      } else {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low - partialrotation,
          "Low Tide again in:"
        );
      }
      balacksCove.append($(".balacksCove" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.High &&
    partialrotation < keyTimes.MidE
  ) {
    //High
    $(".balacksCoveHeaderValue").text("HIGH");
    $(".balacksCoveHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("bcHigh");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Mid") {
        timeNext = genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.MidE - partialrotation,
          "Mid Tide/E in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.cove,
            "mid",
            remindInterval
          )
        ) {
          myConfirm("cove", "mid");
          if (propsObject.killSwitch == "Y") {
            $("#balacksCoveCb").click();
          }
        }
      } else if (currentValue == "Low") {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low - partialrotation,
          "Low Tide in:"
        );
      } else {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low - partialrotation + keyTimes.High,
          "High Tide again in:"
        );
      }
      balacksCove.append($(".balacksCove" + currentValue).detach());
    });
  } else if (partialrotation >= keyTimes.MidE) {
    //Mid (ebbing)
    $(".balacksCoveHeaderValue").text("MID-Ebbing");
    $(".balacksCoveHeaderValue").css({
      color: "orange",
    });
    const subArray = getGenericSublocation("bcMidE");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Low") {
        timeNext = genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low - partialrotation,
          "Low Tide in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.cove,
            "low",
            remindInterval
          )
        ) {
          myConfirm("cove", "low");
          if (propsObject.killSwitch == "Y") {
            $("#balacksCoveCb").click();
          }
        }
      } else if (currentValue == "High") {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low + keyTimes.High - partialrotation,
          "High Tide in:"
        );
      } else if (currentValue == "Mid") {
        genericTimerUpdate(
          ".balacksCove",
          currentValue,
          keyTimes.Low + keyTimes.MidF - partialrotation,
          "Mid Tide/F in:"
        );
        balacksCove.append($(".balacksCove" + currentValue).detach());
        balacksCove.append($(".balacksCoveHigh").detach());
      }
    });
  }
  debugLog("BC Updated");
}

$(".balacksCove").on("change", ":input", function () {
  if (this.checked) {
    this.checked = "Yes";
  } else {
    this.checked = "";
  }
  tinkerCbClick("cove", this.name, this.checked);
});

//====================================== Seasonal Garden ======================================
function buildSeasonalGarden() {
  const seasonalGarden = document.createElement("div");
  seasonalGarden.classList.add("seasonalGarden");
  $(seasonalGarden).css({
    float: "left",
    marginLeft: "1px",
    "border-left": "2px solid black",
    "border-bottom": "2px solid black",
    "border-top": "2px solid black",
    "border-radius": "2px",
    width: "26%",
    height: "95%",
    padding: 2 + "px",
  });
  const seasonalGardenClockBox = document.createElement("div");
  seasonalGardenClockBox.classList.add("seasonalGardenClockBox");
  seasonalGarden.append(seasonalGardenClockBox);
  $(seasonalGardenClockBox).css({
    float: "left",
    width: "100%",
    height: "80%",
  });
  //Header
  const seasonalGardenHeader = genericTimerBuild(
    "seasonalGardenHeader",
    "Seasonal Garden is:",
    "Fall"
  );
  //Fall
  const seasonalGardenFall = genericTimerBuild(
    "seasonalGardenFall",
    "Fall in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Winter
  const seasonalGardenWinter = genericTimerBuild(
    "seasonalGardenWinter",
    "Winter in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Spring
  const seasonalGardenSpring = genericTimerBuild(
    "seasonalGardenSpring",
    "Spring in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Summer
  const seasonalGardenSummer = genericTimerBuild(
    "seasonalGardenSummer",
    "Summer in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Append
  seasonalGardenClockBox.appendChild(seasonalGardenHeader);
  seasonalGardenClockBox.appendChild(seasonalGardenFall);
  seasonalGardenClockBox.appendChild(seasonalGardenWinter);
  seasonalGardenClockBox.appendChild(seasonalGardenSpring);
  seasonalGardenClockBox.appendChild(seasonalGardenSummer);
  seasonalGarden.append(buildTravelButtons("seasonalGarden"));
  return seasonalGarden;
}

function updateSeasonalGardenTimer() {
  const propsObject = getTimerProps();
  const remindersObject = getReminders();
  const remindInterval = parseInt(propsObject.updateInterval, 10);
  const seasonalGarden = $(".seasonalGardenClockBox");
  const sgDetails = getGenericLocatonDetails("sg");
  const partialrotation = sgDetails.partialRotation;
  const keyTimes = sgDetails.keyTimes;
  let timeNext = 0;
  if (partialrotation < keyTimes.Fall) {
    //Summer
    $(".seasonalGardenHeaderValue").text("SUMMER");
    $(".seasonalGardenHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("sgSummer");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Fall") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Fall - partialrotation,
          "Fall in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.garden,
            "fall",
            remindInterval
          )
        ) {
          myConfirm("garden", "fall");
          if (propsObject.killSwitch == "Y") {
            $("#seasonalGardenCb").click();
          }
        }
      } else if (currentValue == "Winter") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Winter - partialrotation,
          "Winter in:"
        );
      } else if (currentValue == "Spring") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Spring - partialrotation,
          "Spring in:"
        );
      } else {
        genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation,
          "Summer again in:"
        );
      }
      seasonalGarden.append($(".seasonalGarden" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.Fall &&
    partialrotation < keyTimes.Winter
  ) {
    //Fall
    $(".seasonalGardenHeaderValue").text("FALL");
    $(".seasonalGardenHeaderValue").css({
      color: "orange",
    });
    const subArray = getGenericSublocation("sgFall");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Winter") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Winter - partialrotation,
          "Winter in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.garden,
            "winter",
            remindInterval
          )
        ) {
          myConfirm("garden", "winter");
          if (propsObject.killSwitch == "Y") {
            $("#seasonalGardenCb").click();
          }
        }
      } else if (currentValue == "Spring") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Spring - partialrotation,
          "Spring in:"
        );
      } else if (currentValue == "Summer") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation,
          "Summer in:"
        );
      } else {
        genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Fall,
          "Fall again in:"
        );
      }
      seasonalGarden.append($(".seasonalGarden" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.Winter &&
    partialrotation < keyTimes.Spring
  ) {
    //Winter
    $(".seasonalGardenHeaderValue").text("WINTER");
    $(".seasonalGardenHeaderValue").css({
      color: "blue",
    });
    const subArray = getGenericSublocation("sgWinter");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Spring") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Spring - partialrotation,
          "Spring in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.garden,
            "spring",
            remindInterval
          )
        ) {
          myConfirm("garden", "spring");
          if (propsObject.killSwitch == "Y") {
            $("#seasonalGardenCb").click();
          }
        }
      } else if (currentValue == "Summer") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation,
          "Summer in:"
        );
      } else if (currentValue == "Fall") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Fall,
          "Fall in:"
        );
      } else {
        genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Winter,
          "Winter again in:"
        );
      }
      seasonalGarden.append($(".seasonalGarden" + currentValue).detach());
    });
  } else if (partialrotation >= keyTimes.Spring) {
    //Spring
    $(".seasonalGardenHeaderValue").text("SPRING");
    $(".seasonalGardenHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("sgSpring");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Summer") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation,
          "Summer in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.garden,
            "summer",
            remindInterval
          )
        ) {
          myConfirm("garden", "summer");
          if (propsObject.killSwitch == "Y") {
            $("#seasonalGardenCb").click();
          }
        }
      } else if (currentValue == "Fall") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Fall,
          "Fall in:"
        );
      } else if (currentValue == "Winter") {
        timeNext = genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Winter,
          "Winter in:"
        );
      } else {
        genericTimerUpdate(
          ".seasonalGarden",
          currentValue,
          keyTimes.Summer - partialrotation + keyTimes.Spring,
          "Spring again in:"
        );
      }
      seasonalGarden.append($(".seasonalGarden" + currentValue).detach());
    });
  }
  debugLog("SG Updated");
}

$(".seasonalGarden").on("change", ":input", function () {
  if (this.checked) {
    this.checked = "Yes";
  } else {
    this.checked = "";
  }
  tinkerCbClick("garden", this.name, this.checked);
});

//====================================== Toxic Spill ======================================
function buildToxicSpill() {
  const toxicSpill = document.createElement("div");
  toxicSpill.classList.add("toxicSpill");
  $(toxicSpill).css({
    float: "left",
    marginLeft: "1px",
    border: "2px solid black",
    "border-radius": "2px",
    width: "26%",
    height: "95%",
    padding: 2 + "px",
  });
  const toxicSpillClockBox = document.createElement("div");
  toxicSpillClockBox.classList.add("toxicSpillClockBox");
  toxicSpill.append(toxicSpillClockBox);
  $(toxicSpillClockBox).css({
    float: "left",
    width: "100%",
    height: "80%",
  });
  //Header
  const toxicSpillHeader = genericTimerBuild(
    "toxicSpillHeader",
    "Current Spill Level:",
    "Hero ->"
  );
  //Hero
  const toxicSpillHero = genericTimerBuild(
    "toxicSpillHero",
    "Hero in:",
    "?",
    {
      width: "100%",
      height: "12%",
    },
    "right"
  );
  //Knight
  const toxicSpillKnight = genericTimerBuild(
    "toxicSpillKnight",
    "Knight in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Lord
  const toxicSpillLord = genericTimerBuild(
    "toxicSpillLord",
    "Lord in:",
    "?",
    {
      width: "100%",
      height: "12%",
    },
    "right"
  );
  //Lord
  const toxicSpillBaron = genericTimerBuild(
    "toxicSpillBaron",
    "Baron in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Count
  const toxicSpillCount = genericTimerBuild(
    "toxicSpillCount",
    "Count in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Duke
  const toxicSpillDuke = genericTimerBuild(
    "toxicSpillDuke",
    "Duke in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //GDuke
  const toxicSpillGrandDuke = genericTimerBuild(
    "toxicSpillGrandDuke",
    "GDuke in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //ADuke
  const toxicSpillArchduke = genericTimerBuild(
    "toxicSpillArchduke",
    "ADuke in:",
    "?",
    { width: "100%", height: "12%" },
    "right"
  );
  //Append
  toxicSpillClockBox.appendChild(toxicSpillHeader);
  toxicSpillClockBox.appendChild(toxicSpillHero);
  toxicSpillClockBox.appendChild(toxicSpillKnight);
  toxicSpillClockBox.appendChild(toxicSpillLord);
  toxicSpillClockBox.appendChild(toxicSpillBaron);
  toxicSpillClockBox.appendChild(toxicSpillCount);
  toxicSpillClockBox.appendChild(toxicSpillDuke);
  toxicSpillClockBox.appendChild(toxicSpillGrandDuke);
  toxicSpillClockBox.appendChild(toxicSpillArchduke);
  toxicSpill.append(buildTravelButtons("toxicSpill"));
  return toxicSpill;
}

function updateToxicSpillTimer() {
  const propsObject = getTimerProps();
  const remindersObject = getReminders();
  const remindInterval = parseInt(propsObject.updateInterval, 10);
  const toxicSpill = $(".toxicSpillClockBox");
  $(toxicSpill).children().hide();
  $(".toxicSpillHeader").show();
  const tsDetails = getGenericLocatonDetails("ts");
  const rotaionLenght = tsDetails.rotationLength;
  const partialrotation = tsDetails.partialRotation;
  const keyTimes = tsDetails.keyTimes;
  let timeNext = 0;
  if (partialrotation < keyTimes.Knight) {
    //Hero Rising
    $(".toxicSpillHeaderValue").text("HERO-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsHero");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Knight - partialrotation,
          "Knight in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "knight",
            remindInterval
          )
        ) {
          myConfirm("spill", "knight");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Lord - partialrotation,
          "Lord in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Baron - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Count - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Duke - partialrotation,
          "Duke in:"
        );
      }
    });
  } else if (
    partialrotation >= keyTimes.Knight &&
    partialrotation < keyTimes.Lord
  ) {
    //Knight Rising
    $(".toxicSpillHeaderValue").text("KNIGHT-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsKnight");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Lord - partialrotation,
          "Lord in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "lord",
            remindInterval
          )
        ) {
          myConfirm("spill", "lord");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Baron - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Count - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Duke - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDuke - partialrotation,
          "Gduke in:"
        );
      }
    });
  } else if (
    partialrotation >= keyTimes.Lord &&
    partialrotation < keyTimes.Baron
  ) {
    //Lord Rising
    $(".toxicSpillHeaderValue").text("LORD-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsLord");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Baron - partialrotation,
          "Baron in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "baron",
            remindInterval
          )
        ) {
          myConfirm("spill", "baron");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Count - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Duke - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDuke - partialrotation,
          "Gduke in:"
        );
      } else if (currentValue == "Archduke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.ADuke - partialrotation,
          "ADuke in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.Baron &&
    partialrotation < keyTimes.Count
  ) {
    //Baron Rising
    $(".toxicSpillHeaderValue").text("BARON-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsBaron");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Count - partialrotation,
          "Count in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "count",
            remindInterval
          )
        ) {
          myConfirm("spill", "count");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Duke - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDuke - partialrotation,
          "Gduke in:"
        );
      } else if (currentValue == "Archduke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.ADuke - partialrotation,
          "ADuke in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron Falling in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.Count &&
    partialrotation < keyTimes.Duke
  ) {
    //Count Rising
    $(".toxicSpillHeaderValue").text("COUNT-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsCount");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.Duke - partialrotation,
          "Duke in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "duke",
            remindInterval
          )
        ) {
          myConfirm("spill", "duke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDuke - partialrotation,
          "Gduke in:"
        );
      } else if (currentValue == "Archduke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.ADuke - partialrotation,
          "ADuke in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count Falling in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.Duke &&
    partialrotation < keyTimes.GDuke
  ) {
    //Duke Rising
    $(".toxicSpillHeaderValue").text("DUKE-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsDuke");
    subArray.forEach(function (currentValue) {
      if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDuke - partialrotation,
          "GDuke in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "gduke",
            remindInterval
          )
        ) {
          myConfirm("spill", "grand duke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Archduke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.ADuke - partialrotation,
          "ADuke in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.DukeF - partialrotation,
          "Duke Falling in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.GDuke &&
    partialrotation < keyTimes.ADuke
  ) {
    //Grand Duke Rising
    $(".toxicSpillHeaderValue").text("GD-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsGDuke");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Archduke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.ADuke - partialrotation,
          "ADuke in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "aduke",
            remindInterval
          )
        ) {
          myConfirm("spill", "archduke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDukeF - partialrotation,
          "GDuke Falling in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.DukeF - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.ADuke &&
    partialrotation < keyTimes.ADukeF
  ) {
    //Archduke Rising
    $(".toxicSpillHeaderValue").text("AD-RISING");
    $(".toxicSpillHeaderValue").css({
      color: "red",
    });
    const subArray = getGenericSublocation("tsADuke");
    subArray.forEach(function (currentValue) {
      if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDukeF - partialrotation,
          "GDuke Falling in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "gduke",
            remindInterval
          )
        ) {
          myConfirm("spill", "grand duke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.DukeF - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.ADukeF &&
    partialrotation < keyTimes.GDukeF
  ) {
    //Archduke Falling
    $(".toxicSpillHeaderValue").text("AD-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsADuke");
    subArray.forEach(function (currentValue) {
      if (currentValue == "GrandDuke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.GDukeF - partialrotation,
          "GDuke Falling in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "gduke",
            remindInterval
          )
        ) {
          myConfirm("spill", "grand duke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.DukeF - partialrotation,
          "Duke in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.GDukeF &&
    partialrotation < keyTimes.DukeF
  ) {
    //Grand Duke Falling
    $(".toxicSpillHeaderValue").text("GD-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsGDukeF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.DukeF - partialrotation,
          "Duke in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "duke",
            remindInterval
          )
        ) {
          myConfirm("spill", "duke");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
      } else if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.KnightF - partialrotation,
          "Knight in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.DukeF &&
    partialrotation < keyTimes.CountF
  ) {
    //Duke Falling
    $(".toxicSpillHeaderValue").text("DUKE-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsDukeF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.CountF - partialrotation,
          "Count in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "count",
            remindInterval
          )
        ) {
          myConfirm("spill", "count");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
      } else if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.KnightF - partialrotation,
          "Knight in:"
        );
      } else if (currentValue == "Hero") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.HeroF - partialrotation,
          "Hero in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.CountF &&
    partialrotation < keyTimes.BaronF
  ) {
    //Count Falling
    $(".toxicSpillHeaderValue").text("COUNT-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsCountF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.BaronF - partialrotation,
          "Baron in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "baron",
            remindInterval
          )
        ) {
          myConfirm("spill", "baron");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
      } else if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.KnightF - partialrotation,
          "Knight in:"
        );
      } else if (currentValue == "Hero") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.HeroF - partialrotation,
          "Hero in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Count,
          "Count Rising in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.BaronF &&
    partialrotation < keyTimes.LordF
  ) {
    //Baron Falling
    $(".toxicSpillHeaderValue").text("BARON-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsBaronF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.LordF - partialrotation,
          "Lord in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "lord",
            remindInterval
          )
        ) {
          myConfirm("spill", "lord");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.KnightF - partialrotation,
          "Knight in:"
        );
      } else if (currentValue == "Hero") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.HeroF - partialrotation,
          "Hero in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Baron,
          "Baron Rising in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Count,
          "Count in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.LordF &&
    partialrotation < keyTimes.KnightF
  ) {
    //Lord Falling
    $(".toxicSpillHeaderValue").text("LORD-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsLordF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.KnightF - partialrotation,
          "Knight in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "knight",
            remindInterval
          )
        ) {
          myConfirm("spill", "knight");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Hero") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.HeroF - partialrotation,
          "Hero in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Lord,
          "Lord Rising in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Baron,
          "Baron in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Count,
          "Count in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.KnightF &&
    partialrotation < keyTimes.HeroF
  ) {
    //Knight Falling
    $(".toxicSpillHeaderValue").text("KNIGHT-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsKnightF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Hero") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          keyTimes.HeroF - partialrotation,
          "Hero in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "hero",
            remindInterval
          )
        ) {
          myConfirm("spill", "hero");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Knight,
          "Knight Rising in:"
        );
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Lord,
          "Lord in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Baron,
          "Baron in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Count,
          "Count in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  } else if (
    partialrotation >= keyTimes.HeroF &&
    partialrotation < keyTimes.Hero
  ) {
    //Hero Falling
    $(".toxicSpillHeaderValue").text("HERO-FALLING");
    $(".toxicSpillHeaderValue").css({
      color: "green",
    });
    const subArray = getGenericSublocation("tsHeroF");
    subArray.forEach(function (currentValue) {
      if (currentValue == "Knight") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Knight,
          "Knight Rising in:"
        );
        if (
          genericReminderCheck(
            timeNext,
            remindersObject.spill,
            "knight",
            remindInterval
          )
        ) {
          myConfirm("spill", "knight");
          if (propsObject.killSwitch == "Y") {
            $("#toxicSpillCb").click();
          }
        }
      } else if (currentValue == "Lord") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Lord,
          "Lord in:"
        );
      } else if (currentValue == "Baron") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Baron,
          "Baron in:"
        );
      } else if (currentValue == "Count") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Count,
          "Count in:"
        );
      } else if (currentValue == "Duke") {
        timeNext = genericTimerUpdate(
          ".toxicSpill",
          currentValue,
          rotaionLenght - partialrotation + keyTimes.Duke,
          "Duke in:"
        );
      }
      toxicSpill.append($(".toxicSpill" + currentValue).detach());
    });
  }
  debugLog("TS Updated");
}

$(".toxicSpill").on("change", ":input", function () {
  if (this.checked) {
    this.checked = "Yes";
  } else {
    this.checked = "";
  }
  tinkerCbClick("spill", this.name, this.checked);
});

//================================= Tinker Panel ====================================
//
function buildTinkerPanel() {
  if ($(".tinkerPanel").length > 0) return;
  const timerBox = $(".timerBox");
  const tinkerPanel = document.createElement("div");
  tinkerPanel.classList.add("tinkerPanel");
  tinkerPanel.classList.add("hide");
  $(tinkerPanel).css({
    height: "95%",
    width: "99%",
    float: "left",
    padding: 2 + "px",
    background:
      "linear-gradient(90deg, rgba(215,215,215,1) 2%, rgba(213,213,215,1) 71%, rgba(228,228,228,1) 100%)",
    border: "1px solid black",
  });
  const remindersObject = getReminders();
  const propsObject = getTimerProps();
  //FG Options
  const forbiddenGroveOptions = genericOptionsHeaderBuild(
    "forbiddenGroveOptions",
    "Forbidden Grove",
    {
      float: "left",
      width: "14%",
      padding: "2px",
    }
  );
  genericOptionsBuild(
    $(forbiddenGroveOptions),
    "Open",
    "forbiddenGroveOpenCb",
    "Open",
    remindersObject.grove.flags.open
  );
  genericOptionsBuild(
    $(forbiddenGroveOptions),
    "Closed",
    "forbiddenGroveCloseCb",
    "Closed",
    remindersObject.grove.flags.closed
  );
  //BC Options
  const balacksCoveOptions = genericOptionsHeaderBuild(
    "balacksCoveOptions",
    "Balack's Cove",
    {
      float: "left",
      width: "14%",
      padding: "2px",
    }
  );
  genericOptionsBuild(
    $(balacksCoveOptions),
    "Low",
    "balacksCoveLowCb",
    "Low",
    remindersObject.cove.flags.low
  );
  genericOptionsBuild(
    $(balacksCoveOptions),
    "Mid",
    "balacksCoveMidCb",
    "Mid",
    remindersObject.cove.flags.mid
  );
  genericOptionsBuild(
    $(balacksCoveOptions),
    "High",
    "balacksCoveHighCb",
    "High",
    remindersObject.cove.flags.high
  );
  //SG Options
  const seasonalGardenOptions = genericOptionsHeaderBuild(
    "seasonalGardenOptions",
    "Seasonal Garden",
    {
      float: "left",
      width: "15%",
      padding: "2px",
    }
  );
  genericOptionsBuild(
    $(seasonalGardenOptions),
    "Fall",
    "seasonalGardenFallCb",
    "Fall",
    remindersObject.garden.flags.Fall
  );
  genericOptionsBuild(
    $(seasonalGardenOptions),
    "Winter",
    "seasonalGardenWinterCb",
    "Winter",
    remindersObject.garden.flags.Winter
  );
  genericOptionsBuild(
    $(seasonalGardenOptions),
    "Spring",
    "seasonalGardenSpringCb",
    "Spring",
    remindersObject.garden.flags.Spring
  );
  genericOptionsBuild(
    $(seasonalGardenOptions),
    "Summer",
    "seasonalGardenSummerCb",
    "Summer",
    remindersObject.garden.flags.Summer
  );
  //TS Options
  const toxicSpillOptions = genericOptionsHeaderBuild(
    "toxicSpillOptions",
    "Toxic Spill",
    {
      float: "left",
      width: "20%",
      padding: "2px",
    }
  );
  const toxicSpillOptionsFlex = document.createElement("div");
  toxicSpillOptionsFlex.classList.add("toxicSpillOptionsFlex");
  $(toxicSpillOptionsFlex).css({
    display: "flex",
    width: "100%",
    height: "100%",
  });
  const toxicSpillOptionsL = document.createElement("div");
  toxicSpillOptionsL.classList.add("toxicSpillOptionsL");
  $(toxicSpillOptionsL).css({
    width: "50%",
  });
  const toxicSpillOptionsR = document.createElement("div");
  toxicSpillOptionsR.classList.add("toxicSpillOptionsR");
  $(toxicSpillOptionsR).css({
    width: "50%",
  });
  toxicSpillOptionsFlex.appendChild(toxicSpillOptionsL);
  toxicSpillOptionsFlex.appendChild(toxicSpillOptionsR);
  toxicSpillOptions.appendChild(toxicSpillOptionsFlex);
  genericOptionsBuild(
    $(toxicSpillOptionsL),
    "Hero",
    "toxicSpillHeroCb",
    "Hero",
    remindersObject.spill.flags.hero
  );
  genericOptionsBuild(
    $(toxicSpillOptionsL),
    "Knight",
    "toxicSpillKnightCb",
    "Knight",
    remindersObject.spill.flags.knight
  );
  genericOptionsBuild(
    $(toxicSpillOptionsL),
    "Lord",
    "toxicSpillLordCb",
    "Lord",
    remindersObject.spill.flags.lord
  );
  genericOptionsBuild(
    $(toxicSpillOptionsL),
    "Baron",
    "toxicSpillBaronCb",
    "Baron",
    remindersObject.spill.flags.baron
  );
  genericOptionsBuild(
    $(toxicSpillOptionsR),
    "Count",
    "toxicSpillCountCb",
    "Count",
    remindersObject.spill.flags.count
  );
  genericOptionsBuild(
    $(toxicSpillOptionsR),
    "GDuke",
    "toxicSpillDukeCb",
    "GDuke",
    remindersObject.spill.flags.duke
  );
  genericOptionsBuild(
    $(toxicSpillOptionsR),
    "GDuke",
    "toxicSpillGrandDukeCb",
    "GDuke",
    remindersObject.spill.flags.gduke
  );
  genericOptionsBuild(
    $(toxicSpillOptionsR),
    "ADuke",
    "toxicSpillArchdukeCb",
    "ADuke",
    remindersObject.spill.flags.aduke
  );
  //Timer Options
  const timerOptions = genericOptionsHeaderBuild(
    "timerOptions",
    "Timer Options",
    {
      float: "left",
      display: "flex",
      "flex-direction": "column",
      width: "33%",
      height: "100%",
      padding: "2px",
    }
  );
  const timerOptionsUpdateFlex = document.createElement("div");
  timerOptionsUpdateFlex.classList.add("timerOptionsUpdateFlex");
  $(timerOptionsUpdateFlex).css({
    display: "flex",
    width: "100%",
    height: "17%",
  });
  genericRadioBuild(
    $(timerOptionsUpdateFlex),
    "OptionsUpdate",
    "updateInterval",
    "Update Interval (min)",
    ["5", "10", "15"],
    propsObject.updateInterval,
    "How often the timers update."
  );
  const timerOptionsWindowFlex = document.createElement("div");
  timerOptionsWindowFlex.classList.add("timerOptionsWindoweFlex");
  $(timerOptionsWindowFlex).css({
    display: "flex",
    width: "100%",
    height: "17%",
  });
  genericRadioBuild(
    $(timerOptionsWindowFlex),
    "OptionsWindow",
    "remindInterval",
    "Remind Me Within (min)",
    ["5", "10", "15"],
    propsObject.remindInterval,
    "How far ahead of time reminder do you want to be notified?"
  );
  timerOptions.appendChild(timerOptionsUpdateFlex);
  timerOptions.appendChild(timerOptionsWindowFlex);
  //Other Options
  genericOptionsBuild(
    $(timerOptions),
    "killSwitch",
    "killSwitchCb",
    "Remind Me Only Once",
    propsObject.killSwitch,
    {
      float: "left",
      width: "110px",
      padding: "1px",
    },
    {
      float: "left",
      height: "16%",
      width: "100%",
    },
    "Stop reminders after the first to keep sanity in check."
  );
  genericOptionsBuild(
    $(timerOptions),
    "disarm",
    "disarmCb",
    "Disarm Bait After Travel",
    propsObject.disarmAfterTravel,
    {
      float: "left",
      width: "125x",
      padding: "1px",
    },
    {
      float: "left",
      height: "16%",
      width: "100%",
    },
    "Disarm bait after travel to save presious cheese from disaster."
  );
  //Panic Button
  const panicButton = document.createElement("button");
  $(panicButton).addClass("mousehuntActionButton small");
  panicButton.id = "panicButton";
  const reverseTravelText = document.createElement("span");
  $(reverseTravelText).addClass("reverseTravelText").text("Return Trip").css({
    "font-size": "12px",
  });
  $(panicButton).append(reverseTravelText);
  $(panicButton).attr("title", "Click to go back to previous location");
  timerOptions.appendChild(panicButton);
  $(panicButton).css({
    width: "100px",
    float: "left",
  });
  //tinker button
  const tinkerButton = document.createElement("div");
  tinkerButton.classList.add("tinkerButton");
  $(tinkerButton).attr("title", "Close the tinker menu");
  $(tinkerButton).css({
    width: "30px",
    padding: 3 + "px",
    color: "rgb(4, 44, 202)",
    marginLeft: "200px",
    cursor: "pointer",
  });
  timerOptions.appendChild(tinkerButton);
  //
  tinkerPanel.appendChild(forbiddenGroveOptions);
  tinkerPanel.appendChild(balacksCoveOptions);
  tinkerPanel.appendChild(seasonalGardenOptions);
  tinkerPanel.appendChild(toxicSpillOptions);
  tinkerPanel.appendChild(timerOptions);
  //Last
  timerBox.prepend(tinkerPanel);
}

$(document).on("click", ".tinkerButton", function () {
  const fg = $(".forbiddenGrove");
  const bc = $(".balacksCove");
  const sg = $(".seasonalGarden");
  const ts = $(".toxicSpill");
  const tp = $(".tinkerPanel");
  if (fg.hasClass("hide")) {
    //show
    fg.removeClass("hide");
    bc.removeClass("hide");
    sg.removeClass("hide");
    ts.removeClass("hide");
    tp.addClass("hide");
    $(".tinkerButton").text("Tinker");
  } else {
    //hide
    fg.addClass("hide");
    bc.addClass("hide");
    sg.addClass("hide");
    ts.addClass("hide");
    tp.removeClass("hide");
    $(".tinkerButton").text("Close");
  }
});

$(".tinkerPanel").on("change", ":input", function () {
  if (this.type == "radio") {
    tinkerRadioClick(this);
    return false;
  }
  if (this.checked) {
    this.checked = "Yes";
  } else {
    this.checked = "";
  }
  const name = this.name;
  let location = "";
  if (name.includes("forbiddenGrove")) {
    location = "grove";
  } else if (name.includes("balacksCove")) {
    location = "cove";
  } else if (name.includes("seasonalGarden")) {
    location = "garden";
  } else if (name.includes("toxicSpill")) {
    location = "spill";
  } else {
    location = "options";
  }
  tinkerCbClick(location, this.name, this.checked);
});

function tinkerRadioClick(thisRadio) {
  const parent = $(thisRadio).parent();
  const siblings = $(parent).find("input");
  $(siblings).each(function () {
    if (thisRadio.value == this.value) {
      updateProps(parent.attr("class"), thisRadio.value);
      this.checked = true;
    } else {
      this.checked = false;
    }
  });
}

function tinkerCbClick(location, cb, checked) {
  const remindersObject = getReminders()[location];
  if (cb == "forbiddenGroveCb" && checked == true) {
    remindersObject.master = "Y";
  } else if (cb == "forbiddenGroveCb" && checked == false) {
    remindersObject.master = "N";
  } else if (cb == "forbiddenGroveOpenCb" && checked == true) {
    remindersObject.flags.open = "Y";
  } else if (cb == "forbiddenGroveOpenCb" && checked == false) {
    remindersObject.flags.open = "N";
  } else if (cb == "forbiddenGroveCloseCb" && checked == true) {
    remindersObject.flags.closed = "Y";
  } else if (cb == "forbiddenGroveCloseCb" && checked == false) {
    remindersObject.flags.closed = "N";
    //BC
  } else if (cb == "balacksCoveCb" && checked == true) {
    remindersObject.master = "Y";
  } else if (cb == "balacksCoveCb" && checked == false) {
    remindersObject.master = "N";
  } else if (cb == "balacksCoveLowCb" && checked == true) {
    remindersObject.flags.low = "Y";
  } else if (cb == "balacksCoveLowCb" && checked == false) {
    remindersObject.flags.low = "N";
  } else if (cb == "balacksCoveMidCb" && checked == true) {
    remindersObject.flags.mid = "Y";
  } else if (cb == "balacksCoveMidCb" && checked == false) {
    remindersObject.flags.mid = "N";
  } else if (cb == "balacksCoveHighCb" && checked == true) {
    remindersObject.flags.high = "Y";
  } else if (cb == "balacksCoveHighCb" && checked == false) {
    remindersObject.flags.high = "N";
    //SG
  } else if (cb == "seasonalGardenCb" && checked == true) {
    remindersObject.master = "Y";
  } else if (cb == "seasonalGardenCb" && checked == false) {
    remindersObject.master = "N";
  } else if (cb == "seasonalGardenFallCb" && checked == true) {
    remindersObject.flags.fall = "Y";
  } else if (cb == "seasonalGardenFallCb" && checked == false) {
    remindersObject.flags.fall = "N";
  } else if (cb == "seasonalGardenWinterCb" && checked == true) {
    remindersObject.flags.winter = "Y";
  } else if (cb == "seasonalGardenWinterCb" && checked == false) {
    remindersObject.flags.winter = "N";
  } else if (cb == "seasonalGardenSpringCb" && checked == true) {
    remindersObject.flags.spring = "Y";
  } else if (cb == "seasonalGardenSpringCb" && checked == false) {
    remindersObject.flags.spring = "N";
  } else if (cb == "seasonalGardenSummerCb" && checked == true) {
    remindersObject.flags.summer = "Y";
  } else if (cb == "seasonalGardenSummerCb" && checked == false) {
    remindersObject.flags.summer = "N";
    //TS
  } else if (cb == "toxicSpillCb" && checked == true) {
    remindersObject.master = "Y";
  } else if (cb == "toxicSpillCb" && checked == false) {
    remindersObject.master = "N";
  } else if (cb == "toxicSpillHeroCb" && checked == true) {
    remindersObject.flags.hero = "Y";
  } else if (cb == "toxicSpillHeroCb" && checked == false) {
    remindersObject.flags.hero = "N";
  } else if (cb == "toxicSpillKnightCb" && checked == true) {
    remindersObject.flags.knight = "Y";
  } else if (cb == "toxicSpillKnightCb" && checked == false) {
    remindersObject.flags.knight = "N";
  } else if (cb == "toxicSpillLordCb" && checked == true) {
    remindersObject.flags.lord = "Y";
  } else if (cb == "toxicSpillLordCb" && checked == false) {
    remindersObject.flags.lord = "N";
  } else if (cb == "toxicSpillBaronCb" && checked == true) {
    remindersObject.flags.baron = "Y";
  } else if (cb == "toxicSpillBaronCb" && checked == false) {
    remindersObject.flags.baron = "N";
  } else if (cb == "toxicSpillCountCb" && checked == true) {
    remindersObject.flags.count = "Y";
  } else if (cb == "toxicSpillCountCb" && checked == false) {
    remindersObject.flags.count = "N";
  } else if (cb == "toxicSpillDukeCb" && checked == true) {
    remindersObject.flags.duke = "Y";
  } else if (cb == "toxicSpillDukeCb" && checked == false) {
    remindersObject.flags.duke = "N";
  } else if (cb == "toxicSpillGrandDukeCb" && checked == true) {
    remindersObject.flags.gduke = "Y";
  } else if (cb == "toxicSpillGrandDukeCb" && checked == false) {
    remindersObject.flags.gduke = "N";
  } else if (cb == "toxicSpillArchdukeCb" && checked == true) {
    remindersObject.flags.aduke = "Y";
  } else if (cb == "toxicSpillArchdukeCb" && checked == false) {
    remindersObject.flags.aduke = "N";
  } else if (cb == "killSwitchCb" && checked == true) {
    updateProps("killSwitch", "Y");
  } else if (cb == "killSwitchCb" && checked == false) {
    updateProps("killSwitch", "N");
  } else if (cb == "disarmCb" && checked == true) {
    updateProps("disarmAfterTravel", "Y");
  } else if (cb == "disarmCb" && checked == false) {
    updateProps("disarmAfterTravel", "N");
  }
  debugLog([location, cb, checked]);
  updateReminders(location, remindersObject);
}

//===================================== Utilities ======================================
function debugLog(message) {
  const debug = localStorage.getItem("ws.debug");
  if (debug == true) {
    console.log(message);
  }
}

function todayNow() {
  const today = new Date();
  const todayEpoch = today.getTime() / 1000.0;
  return todayEpoch;
}

function convertToDyHrMn(days, hours, minutes) {
  if (minutes == 60) {
    hours++;
    minutes = 0;
  }
  if (hours >= 24) {
    const daysExact = hours / 24;
    const daysTrunc = Math.floor(daysExact);
    const partialDays = daysExact - daysTrunc;
    hours = Math.round(partialDays * 24);
    days = daysTrunc + days;
  }
  return {
    days,
    hours,
    minutes,
  };
}

function formatOutput(days, hours, minutes) {
  let dayStr = "";
  let hourStr = "";
  let minuteStr = "";
  if (days > 0) {
    dayStr = days + "d";
  }
  if (hours > 0) {
    hourStr = hours + "h";
  }
  if (minutes > 0) {
    minuteStr = minutes + "m";
  }
  return dayStr + " " + hourStr + " " + minuteStr;
}
//============================== Travel Functions ==============================================
//Forbidden Grove
$(document).on("click", "#forbiddenGroveButton", function () {
  updateForbiddenGroveTimer();
  if ($(".forbiddenGroveHeaderValue").text() == "CLOSED") {
    myAlert("The Forbiddengrove is closed now, you cannot travel there");
  } else {
    myConfirm("grove", "button");
  }
});

function travelToGrove() {
  const disarm = getTimerProps().disarmAfterTravel;
  if (
    $("#hudLocationContent").hasClass("hudLocationContent forbidden_grove") ==
    true
  ) {
    //Do nothing you are already there
  } else if ($(".forbiddenGroveHeaderValue").text() == "CLOSED") {
    myAlert("The Forbiddengrove is closed now, you cannot travel there");
  } else {
    app.pages.TravelPage.travel("forbidden_grove");
    if (disarm == "Y") {
      hg.utils.TrapControl.disarmBait().go();
    }
  }
}
//Balack's Cove
$(document).on("click", "#balacksCoveButton", function () {
  myConfirm("cove", "button");
});

function travelToCove() {
  const disarm = getTimerProps().disarmAfterTravel;
  if (
    $("#hudLocationContent").hasClass("hudLocationContent balacks_cove") == true
  ) {
    //Do nothing, you are already there
  } else {
    app.pages.TravelPage.travel("balacks_cove");
    if (disarm == "Y") {
      hg.utils.TrapControl.disarmBait().go();
    }
  }
}
//Seasonal Garden
$(document).on("click", "#seasonalGardenButton", function () {
  myConfirm("garden", "button");
});

function travelToGarden() {
  const disarm = getTimerProps().disarmAfterTravel;
  if (
    $("#hudLocationContent").hasClass("hudLocationContent seasonal_garden") ==
    true
  ) {
    //Do nothing, you are already there
  } else {
    app.pages.TravelPage.travel("seasonal_garden");
    if (disarm == "Y") {
      hg.utils.TrapControl.disarmBait().go();
    }
  }
}
//Toxic Spill
$(document).on("click", "#toxicSpillButton", function () {
  myConfirm("spill", "button");
});

function travelToSpill() {
  const disarm = getTimerProps().disarmAfterTravel;
  if (
    $("#hudLocationContent").hasClass(
      "hudLocationContent pollution_outbreak"
    ) == true
  ) {
    //Do nothing, you are already there
  } else {
    app.pages.TravelPage.travel("pollution_outbreak");
    if (disarm == "Y") {
      hg.utils.TrapControl.disarmBait().go();
    }
  }
}
//Travel Back
$(document).on("click", "#panicButton", function () {
  const prevLoc = getTimerProps().prevLocation;
  debugLog(["prevLoc", prevLoc]);
  myConfirm("back", prevLoc);
});

function travelBack() {
  const disarm = getTimerProps().disarmAfterTravel;
  const origin = getTimerProps().prevLocation;
  if ($("#hudLocationContent").hasClass(origin) == true) {
    //Do nothing, you are already there
  } else {
    app.pages.TravelPage.travel(origin);
    if (disarm == "Y") {
      hg.utils.TrapControl.disarmBait().go();
    }
  }
}

//========== Modals ======================//
function myConfirm(location, sub) {
  let messageText = "";
  let icon = "";
  let travelFunction = "";
  let title = "";
  if (location == "grove" && sub == "closing") {
    icon = "fas fa-dungeon";
    messageText = "The Forbidden Grove is closing soon, travel there now?";
    travelFunction = travelToGrove;
    title = "Timer Reminder";
  } else if (location == "grove" && sub == "opening") {
    icon = "fas fa-dungeon";
    messageText = "The Forbidden Grove is opening soon, travel there now?";
    travelFunction = travelToGrove;
    title = "Timer Reminder";
  } else if (location == "grove" && sub == "button") {
    icon = "fas fa-dungeon";
    messageText = "Travel to the Forbidden Grove now?";
    travelFunction = travelToGrove;
    title = "Quick Travel";
  } else if (location == "cove" && sub == "low") {
    icon = "fas fa-water";
    messageText = "Balacks Cove will be low tide soon, travel there now?";
    travelFunction = travelToCove;
    title = "Timer Reminder";
  } else if (location == "cove" && sub == "mid") {
    icon = "fas fa-water";
    messageText = "Balacks Cove will be mid tide soon, travel there now?";
    travelFunction = travelToCove;
    title = "Timer Reminder";
  } else if (location == "cove" && sub == "high") {
    icon = "fas fa-water";
    messageText = "Balacks Cove will be high tide soon, travel there now?";
    travelFunction = travelToCove;
    title = "Timer Reminder";
  } else if (location == "cove" && sub == "button") {
    icon = "fas fa-water";
    messageText = "Travel to Balacks Cove now?";
    travelFunction = travelToCove;
    title = "Quick Travel";
  } else if (location == "garden" && sub == "fall") {
    icon = "fab fa-canadian-maple-leaf";
    messageText = "The Seasonal Garden will be fall soon, travel there now?";
    travelFunction = travelToGarden;
    title = "Timer Reminder";
  } else if (location == "garden" && sub == "winter") {
    icon = "fas fa-icicles";
    messageText = "The Seasonal Garden will be winter soon, travel there now?";
    travelFunction = travelToGarden;
    title = "Timer Reminder";
  } else if (location == "garden" && sub == "spring") {
    icon = "fas fa-seedling";
    messageText = "The Seasonal Garden will be spring soon, travel there now?";
    travelFunction = travelToGarden;
    title = "Timer Reminder";
  } else if (location == "garden" && sub == "summer") {
    icon = "fas fa-sun";
    messageText = "The Seasonal Garden will be summer soon, travel there now?";
    travelFunction = travelToGarden;
    title = "Timer Reminder";
  } else if (location == "garden" && sub == "button") {
    const season = $(".seasonalGardenHeaderValue").text();
    if (season == "FALL") {
      icon = "fab fa-canadian-maple-leaf";
    } else if (season == "WINTER") {
      icon = "fas fa-icicles";
    } else if (season == "SPRING") {
      icon = "fas fa-icicles";
    } else {
      icon = "fas fa-sun";
    }
    messageText = "Travel to the Seasonal Garden now?";
    travelFunction = travelToGarden;
    title = "Quick Travel";
  } else if (location == "spill" && sub == "hero") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "knight") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "lord") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "baron") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "count") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "duke") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "grand duke") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "archduke") {
    icon = "fas fa-biohazard";
    messageText =
      "The Toxic Spill will be " + sub + " rank soon, travel there now?";
    travelFunction = travelToSpill;
    title = "Timer Reminder";
  } else if (location == "spill" && sub == "button") {
    icon = "fas fa-biohazard";
    messageText = "Travel to the Toxic Spill now?";
    travelFunction = travelToSpill;
    title = "Quick Travel";
  } else if (location == "back") {
    icon = "fas fa-history";
    messageText = "Travel to the back to the " + sub + " now?";
    travelFunction = travelBack;
    title = "Quick Travel";
  }
  //
  $.confirm({
    autoClose: "cancel|120000",
    title: title,
    content: messageText,
    icon: icon,
    type: "dark",
    typeAnimated: true,
    boxWidth: "30%",
    useBootstrap: false,
    draggable: true,
    escapeKey: "cancel",
    buttons: {
      confirm: {
        text: "Yes",
        keys: ["enter", "space"],
        btnClass: "btn-green",
        action: function () {
          travelFunction("skip");
        },
      },
      cancel: {
        text: "No",
        btnClass: "btn-red",
        action: function () {},
      },
    },
  });
}

function myAlert(messageText) {
  const icon = "fas fa-exclamation-circle";
  const title = "Attention!";
  $.alert({
    autoClose: "acknowledge|60000",
    title: title,
    content: messageText,
    icon: icon,
    type: "dark",
    typeAnimated: true,
    boxWidth: "30%",
    useBootstrap: false,
    draggable: true,
    escapeKey: "aknowledge",
    buttons: {
      acknowledge: {
        text: "Ok",
        keys: ["enter", "space"],
        btnClass: "btn-blue",
        action: function () {},
      },
    },
  });
}

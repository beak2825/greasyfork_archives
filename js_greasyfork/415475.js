// ==UserScript==
// @name         BOT FARM
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Kichiyaki
// @match        *://*.plemiona.pl/game.php?*screen=am_farm*
// @require      https://cdnjs.cloudflare.com/ajax/libs/date-fns/1.30.1/date_fns.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415475/BOT%20FARM.user.js
// @updateURL https://update.greasyfork.org/scripts/415475/BOT%20FARM.meta.js
// ==/UserScript==

const defaultPrefix = "kiszkowaty_";
const localStorageKey = defaultPrefix + "farm_bot";
const defaultConfiguration = {
  minimumBreakBetweenAttacks: 500,
  maximumBreakBetweenAttacks: 1200,
  minimumBreakBetweenCycles: 15,
  maximumBreakBetweenCycles: 15,
  started: false,
  whichButton: "A",
  currentVillage: 1
};

const container = window.mobile
  ? document.querySelector("#content_value")
  : document.querySelector("#contentContainer");

const wait = (timeout = 0, func) =>
  new Promise(resolve =>
    setTimeout(() => {
      if (func && typeof func === "function") {
        func();
      }
      resolve();
    }, timeout)
  );

const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const persistStore = values =>
  localStorage.setItem(localStorageKey, JSON.stringify(values));

const loadConfiguration = () => {
  let cfg = defaultConfiguration;
  const persistedCfg = localStorage.getItem(localStorageKey);
  if (persistedCfg) {
    cfg = JSON.parse(persistedCfg);
  }
  return cfg;
};

const formField = ({
  label = "",
  select = false,
  options = [],
  value = "",
  id = "",
  type = "text",
  disabled = false,
  min = 0,
  onChange = () => {}
} = {}) => {
  const formFieldContainer = document.createElement("div");
  const formFieldLabel = document.createElement("label");
  formFieldLabel.innerHTML = label;
  formFieldContainer.appendChild(formFieldLabel);
  let formFieldInput;
  if (select) {
    formFieldInput = document.createElement("select");
    options.forEach(opt => {
      const option = document.createElement("option");
      option.innerHTML = opt;
      option.value = opt;
      formFieldInput.appendChild(option);
    });
  } else {
    formFieldInput = document.createElement("input");
  }
  formFieldInput.id = id;
  formFieldInput.value = value;
  formFieldInput.disabled = disabled;
  formFieldInput.type = type;
  formFieldInput.min = min;
  formFieldInput.addEventListener("change", onChange);
  formFieldContainer.appendChild(formFieldInput);

  return formFieldContainer;
};

const button = ({
  type = "submit",
  text = "",
  id = "",
  onClick = () => {},
  disabled = false
} = {}) => {
  const buttonContainer = document.createElement("div");
  const button = document.createElement("button");
  button.innerHTML = text;
  button.type = type;
  button.disabled = disabled;
  button.id = id;
  button.addEventListener("click", onClick);
  buttonContainer.appendChild(button);
  return buttonContainer;
};

const handleMinimumBreakBetweenAttacksChange = e => {
  persistStore({
    ...loadConfiguration(),
    minimumBreakBetweenAttacks: parseInt(e.target.value)
  });
};

const handleMaximumBreakBetweenAttacksChange = e => {
  persistStore({
    ...loadConfiguration(),
    maximumBreakBetweenAttacks: parseInt(e.target.value)
  });
};

const handleMinimumBreakBetweenCyclesChange = e => {
  persistStore({
    ...loadConfiguration(),
    minimumBreakBetweenCycles: parseInt(e.target.value)
  });
};

const handleMaximumBreakBetweenCyclesChange = e => {
  persistStore({
    ...loadConfiguration(),
    maximumBreakBetweenCycles: parseInt(e.target.value)
  });
};

const handleWhichButtonChange = e => {
  persistStore({
    ...loadConfiguration(),
    whichButton: e.target.value
  });
};

const handleStart = () => {
  const currentCfg = loadConfiguration();
  const {
    maximumBreakBetweenAttacks,
    minimumBreakBetweenAttacks,
    started,
    minimumBreakBetweenCycles,
    maximumBreakBetweenCycles,
    whichButton
  } = currentCfg;

  const parsedMinimumBreakBetweenAttacks = parseInt(minimumBreakBetweenAttacks);
  const parsedMaximumBreakBetweenAttacks = parseInt(maximumBreakBetweenAttacks);
  const parsedMinimumBreakBetweenCycles = parseInt(minimumBreakBetweenCycles);
  const parsedMaximumBreakBetweenCycles = parseInt(maximumBreakBetweenCycles);
  if (whichButton.trim().length === 0)
    return UI.ErrorMessage("Wybierz button, którym ma farmić!");
  if (isNaN(parsedMinimumBreakBetweenAttacks))
    return UI.ErrorMessage(
      `${parsedMinimumBreakBetweenAttacks} nie jest liczbą!`
    );
  if (isNaN(parsedMaximumBreakBetweenAttacks))
    return UI.ErrorMessage(
      `${parsedMaximumBreakBetweenAttacks} nie jest liczbą!`
    );
  if (isNaN(parsedMinimumBreakBetweenCycles))
    return UI.ErrorMessage(
      `${parsedMinimumBreakBetweenCycles} nie jest liczbą!`
    );
  if (isNaN(parsedMaximumBreakBetweenCycles))
    return UI.ErrorMessage(
      `${parsedMaximumBreakBetweenCycles} nie jest liczbą!`
    );
  if (parsedMinimumBreakBetweenAttacks <= 100)
    return UI.ErrorMessage("Minimalny czas między kliknięciami to 100ms!");
  if (parsedMinimumBreakBetweenAttacks > parsedMaximumBreakBetweenAttacks)
    return UI.ErrorMessage(
      `Czas minimalny pomiędzy atakami nie może być dłuższy od maksymalnego!`
    );
  if (parsedMinimumBreakBetweenCycles > maximumBreakBetweenCycles)
    return UI.ErrorMessage(
      `Czas minimalny pomiędzy cyklami nie może być dłuższy od maksymalnego!`
    );

  const newStartedValue = !started;
  const newCfg = {
    ...currentCfg,
    started: newStartedValue,
    currentVillage: 1
  };
  persistStore(newCfg);
  if (!newStartedValue) {
    return window.location.reload();
  } else {
    runBot(newCfg);
  }
  document.querySelector(
    "#" + defaultPrefix + "button"
  ).innerHTML = newStartedValue ? "Zatrzymaj" : "Rozpocznij";
  const inputs = [
    "minimumBreakBetweenAttacks",
    "maximumBreakBetweenAttacks",
    "minimumBreakBetweenCycles",
    "maximumBreakBetweenCycles",
    "whichButton"
  ];
  inputs.forEach(id => {
    document.querySelector("#" + defaultPrefix + id).disabled = newStartedValue;
  });
};

const renderUI = ({
  minimumBreakBetweenAttacks,
  maximumBreakBetweenAttacks,
  minimumBreakBetweenCycles,
  maximumBreakBetweenCycles,
  whichButton,
  started
} = {}) => {
  const UIContainer = document.createElement("div");

  const header = document.createElement("h3");
  header.innerHTML = "Konfiguracja";
  header.id = defaultPrefix + "header";
  UIContainer.appendChild(header);

  UIContainer.appendChild(
    formField({
      label: "Minimalny czas pomiędzy atakami (w ms): ",
      value: minimumBreakBetweenAttacks,
      id: defaultPrefix + "minimumBreakBetweenAttacks",
      disabled: started,
      type: "number",
      onChange: handleMinimumBreakBetweenAttacksChange
    })
  );
  UIContainer.appendChild(
    formField({
      label: "Maksymalny czas pomiędzy atakami (w ms): ",
      value: maximumBreakBetweenAttacks,
      id: defaultPrefix + "maximumBreakBetweenAttacks",
      disabled: started,
      type: "number",
      onChange: handleMaximumBreakBetweenAttacksChange
    })
  );
  UIContainer.appendChild(
    formField({
      label:
        "Minimalna długość przerwy między kolejnymi cyklami wysyłania (w minutach): ",
      value: minimumBreakBetweenCycles,
      id: defaultPrefix + "minimumBreakBetweenCycles",
      disabled: started,
      onChange: handleMinimumBreakBetweenCyclesChange,
      type: "number"
    })
  );
  UIContainer.appendChild(
    formField({
      label:
        "Maksymalna długość przerwy między kolejnymi cyklami wysyłania (w minutach): ",
      value: maximumBreakBetweenCycles,
      id: defaultPrefix + "maximumBreakBetweenCycles",
      disabled: started,
      type: "number",
      onChange: handleMaximumBreakBetweenCyclesChange
    })
  );
  UIContainer.appendChild(
    formField({
      label: "Czym ma farmić: ",
      select: true,
      options: ["A", "B", "C"],
      value: whichButton,
      id: defaultPrefix + "whichButton",
      disabled: started,
      onChange: handleWhichButtonChange
    })
  );
  UIContainer.appendChild(
    button({
      type: "submit",
      text: started ? "Zatrzymaj" : "Rozpocznij",
      id: defaultPrefix + "button",
      onClick: handleStart
    })
  );

  container.prepend(UIContainer);
};

const runBot = async (cfg = {}) => {
  let villages = 1;
  if (game_data.features.Premium.active) {
    villages = await new Promise(resolve => {
      TribalWars.get(
        "groups",
        {
          ajax: "load_group_menu"
        },
        function(t) {
          TribalWars.get(
            "api",
            {
              ajax: "count_villages_in_group",
              id: t.group_id
            },
            function(result) {
              resolve(result);
            }
          );
        }
      );
    });
  }

  if (cfg.currentVillage > villages) return startBreak(cfg);
  runAttacking(cfg);
};

const runAttacking = ({
  maximumBreakBetweenAttacks,
  minimumBreakBetweenAttacks,
  whichButton
}) => {
  const elements = document.querySelectorAll(
    ".farm_icon_" + whichButton.toLowerCase()
  );
  let timeOffset = 0;
  const promises = [];
  elements.forEach(element => {
    const ms = random(minimumBreakBetweenAttacks, maximumBreakBetweenAttacks);
    timeOffset += ms;
    promises.push(
      wait(timeOffset, () => {
        if (document.querySelector(".g-recaptcha")) return;
        const light = parseInt(document.querySelector("#light").innerHTML);
        const templates = document.querySelectorAll("[name=light]");
        if (whichButton === "A" && parseInt(templates[0].value) > light) {
          changeVillage();
          return;
        } else if (
          whichButton === "B" &&
          parseInt(templates[1].value) > light
        ) {
          changeVillage();
          return;
        } else if (whichButton === "C" && 35 > light) {
          changeVillage();
          return;
        }
        element.click();
        const tr = element.closest("tr");
        if (tr) {
          tr.remove();
        }
      })
    );
  });

  Promise.all(promises).then(() => {
    changeVillage();
  });
};

const changeVillage = () => {
  const cfg = loadConfiguration();
  const newCurrentVillage = cfg.currentVillage + 1;
  persistStore({ ...cfg, currentVillage: newCurrentVillage });
  const rightArrow = document.querySelector("#village_switch_right");
  if (rightArrow) {
    rightArrow.click();
  } else {
    window.location.reload();
  }
};

const showTimer = date => {
  setInterval(() => {
    const currentDate = new Date();
    document.querySelector(
      "#" + defaultPrefix + "header"
    ).innerHTML = `Konfiguracja (Koniec przerwy: ${dateFns.differenceInMinutes(
      date,
      currentDate
    )}:${dateFns.differenceInSeconds(date, currentDate) % 60})`;
  }, 1000);
};

const startBreak = ({
  minimumBreakBetweenCycles,
  maximumBreakBetweenCycles
}) => {
  const parsedMinimumBreakBetweenCycles = parseInt(minimumBreakBetweenCycles);
  const parsedMaximumBreakBetweenCycles = parseInt(maximumBreakBetweenCycles);
  const timeout = random(
    parsedMinimumBreakBetweenCycles,
    parsedMaximumBreakBetweenCycles
  );
  showTimer(dateFns.addMinutes(new Date(), timeout));
  setTimeout(() => {
    persistStore({ ...loadConfiguration(), currentVillage: 1 });
    window.location.reload();
  }, timeout * 60000);
};

(function() {
  const cfg = loadConfiguration();
  renderUI(cfg);
  if (cfg.started) {
    runBot(cfg);
  }
})();
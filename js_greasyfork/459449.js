// ==UserScript==
// @name         Lolzteam Radio
// @namespace    http://tampermonkey.net/
// @version      2.2 recoded
// @description  Слушай радио прямо на Lolzteam
// @author       https://lolz.live/gokent/ & https://lolz.live/smurf/
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        GM_setValue
// @license      MIT
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/459449/Lolzteam%20Radio.user.js
// @updateURL https://update.greasyfork.org/scripts/459449/Lolzteam%20Radio.meta.js
// ==/UserScript==

const stations = [
  {
    name: "Европа Плюс",
    src: "https://europaplus.hostingradio.ru:8014/europaplus320.mp3?5b8b3595",
  },
  {
    name: "Авторадио",
    src: "https://ic7.101.ru:8000/v3_1?f474e85",
  },
  {
    name: "Хит FM",
    src: "https://hitfm.hostingradio.ru/hitfm128.mp3?6823dbe",
  },
  {
    name: "Русское радио",
    src: "https://rusradio.hostingradio.ru/rusradio96.aacp?e88b",
  },
  {
    name: "Дорожное радио",
    src: "https://dorognoe.hostingradio.ru:8000/dorognoe?747b3618",
  },
  {
    name: "DFM",
    src: "https://dfm.hostingradio.ru/dfm96.aacp?2f85ca10",
  },
  {
    name: "Зайцев FM",
    src: "https://zaycevfm.cdnvideo.ru/ZaycevFM_pop_256.mp3",
  },
  {
    name: "Европа Плюс: Urban",
    src: "https://epdop.hostingradio.ru:8033/ep-urban128.mp3?32b9fa40",
  },
  {
    name: "DFM: Кальян РЭП",
    src: "https://dfm-kalianrap.hostingradio.ru/kalianrap96.aacp?7ce29bcb",
  },
  {
    name: "Шансон",
    src: "https://chanson.hostingradio.ru:8041/chanson128.mp3?md5=iUBuUESjHbLOzY4mJw9ylw&e=1673435912",
  },
  {
    name: "Phonk 24/7",
    src: "https://azurecast.ru/listen/phonkradio247/thesoundofphonk.ogg",
  },
  {
    name: "Рекорд: Phonk",
    src: "https://radiorecord.hostingradio.ru/phonk96.aacp",
  },
  {
    name: "Маятник Фуко",
    src: "https://radiorecord.hostingradio.ru/mf96.aacp",
  },
  {
    name: "Lolz FM",
    src: "https://listen1.myradio24.com/lolz",
  },
];

(async () => {
  const volume = GM_getValue("volume", 0);
  const status = GM_getValue("status", false);
  const station = GM_getValue("station", "Lolz FM");

  const audio = document.createElement("audio");
  audio.src = stations.find(({ name }) => name === station).src;
  audio.volume = volume;

  const fab = document.createElement("div");
  fab.setAttribute(
    "style",
    "background-color: rgb(39,39,39); top: 70px; left: 163px; position: fixed; width: 200px; display: flex; padding: 15px 20px; border-radius: 10px; flex-direction: column; align-content: center; gap: 10px;"
  );

  const selector = document.createElement("select");

  for (const { name } of stations) {
    const option = document.createElement("option");
    option.value = name;
    option.text = name;

    selector.appendChild(option);
  }

  selector.classList.add("textCtrl");
  selector.value = station;

  selector.onchange = (v) => {
    audio.src = stations.find(({ name }) => name === v.target.value).src;
    audio.play();
    GM_setValue("station", v.target.value);
  };

  const volumeControl = document.createElement("input");

  volumeControl.type = "range";
  volumeControl.min = 0;
  volumeControl.max = 1;
  volumeControl.step = 0.01;
  volumeControl.value = volume;

  volumeControl.oninput = (v) => {
    const vol = +v.target.value;
    audio.volume = vol;
    GM_setValue("volume", vol);
  };

  const button = document.createElement("button");

  button.textContent = !status ? "PLAY" : "STOP";
  button.classList.add("button");
  button.classList.add(!status ? "primary" : "red");

  button.onclick = (v) => {
    GM_setValue("status", !GM_getValue("status"));
    button.textContent = !GM_getValue("status") ? "PLAY" : "STOP";

    if (GM_getValue("status")) {
      audio.play();
      button.classList.remove("primary");
      button.classList.add("red");
    } else {
      audio.pause();
      button.classList.add("primary");
      button.classList.remove("red");
    }
  };

  fab.appendChild(selector);
  fab.appendChild(volumeControl);
  fab.appendChild(button);
  fab.appendChild(audio);

  document.body.appendChild(fab);

  if (status) {
    audio.play();
  }
})();

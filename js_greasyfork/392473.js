// ==UserScript==
// @name         VGP CuppaZee Expansion Pack
// @version      1.4.0
// @description  Adds the latest types, more map styles, dark mode and more to the Virtual Garden Painter
// @author       sohcah
// @match        http://gardenpainter.ide.sk/*.php
// @match        https://gardenpainter.ide.sk/*.php
// @grant        none
// @namespace https://greasyfork.org/users/398283
// @downloadURL https://update.greasyfork.org/scripts/423497/VGP%20CuppaZee%20Expansion%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/423497/VGP%20CuppaZee%20Expansion%20Pack.meta.js
// ==/UserScript==

(async function () {
  "use strict";
    const authBox = document.querySelector("#auth");
    console.log(authBox)
    if(authBox) {
        authBox.children[0].remove();
        authBox.children[0].remove();
        authBox.children[0].innerText = "You are using the CuppaZee Expansion Pack for Virtual Garden Painter. You do not need to log in for circles.";
    } else {
    authorized = 1;
    eval(calcCircles.toString().replace("function calcCircles(", "window.calcCircles = function(").replace('"ajax/getmunzees.php?', '"https://api.cuppazee.app/ajax/getmunzees.php?'));
    reloadCircles();
  const response = await fetch(
    `https://api.cuppazee.com/openapi/gardenpainter/types?version=1.4.0&list=1234${encodeURIComponent(
      munzees.map(i => i[1]).join(",")
    )}`
  );
  const data = await response.json();
  categories = data.categories;
  munzees.unshift(...data.types);
  window._initMunzeeTypes = initMunzeeTypes;
  window.initMunzeeTypes = function (c) {
    window._initMunzeeTypes(c);

    var a = document.getElementById("munzee-types");
    a.style.width = "1000px";
    a.style.maxWidth = "95vw";
    a.style.height = "auto";
    a.style.maxHeight = "160px";
    a.style.overflow = "auto";
  };
  mt = [];
  for (var c = 0; c < munzees.length; c++) {
    mt[munzees[c][0]] = [];
    mt[munzees[c][0]][0] = munzees[c][1];
    mt[munzees[c][0]][1] = munzees[c][2];
    mt[munzees[c][0]][2] = munzees[c][4];
    mt[munzees[c][0]][3] = c;
    mt[munzees[c][0]][4] = munzees[c][5];
  }
    const proxyHandler = {
        get: function(target, prop, receiver) {
            if(!target[prop]) {
                alert(`Invalid Type: ${prop}`);
                location.reload();
                throw "err"
            }
            return target[prop];
        }
    };

    let ___mt = mt;
    mt = new Proxy(___mt, proxyHandler);
  initMunzeeTypes(0);
  document.head.innerHTML =
    document.head.innerHTML +
    `<style>
    body.dark #toolbox,
body.dark #munzee-types,
body.dark div.maptilesbtn,
body.dark input.permalinktext,
body.dark input.permalinkcopy,
body.dark .permalink,
body.dark span.permalinkcopy {
  background-color: #212121;
  color: white;
}
body.dark div.maptilesbtn:hover,
body.dark span.permalinkcopy:hover {
  background-color: #111111;
  color: white;
}
body.dark span.announcement a:link,
body.dark span.announcement a:visited {
  color: #64c5ff;
}
#catalogList {
  position: sticky;
  top: -8px;
  background: white;
}
body.dark #catalogList {
  background-color: #212121;
}
body.dark img.sel,
body.dark img.sel32 {
  filter: invert(1);
}
body.dark .cat_active {
  color: white;
}
body.dark a.cat:hover {
  color: white;
}
body.darkMap img[src="cross.png"] {
  filter: invert(1);
}

body.screenshot #toolbox,
body.screenshot #maptiles,
body.screenshot #munzee-types,
body.screenshot #profile,
body.screenshot .leaflet-control-container {
  display: none;
}
    </style>
    `;
  document.getElementById("toolbox").innerHTML =
    `<div style="display: inline-block; font-size: 50px; line-height: 1; vertical-align: super;" class="btn" title="Toggle Dark Mode" onclick="document.body.classList.toggle('dark');localStorage.vgpDark = document.body.classList.contains('dark') ? '1' : '0'">🌗</div>` +
      `<div style="display: inline-block; font-size: 50px; line-height: 1; vertical-align: super;" class="btn" title="Toggle Screesnhot Mode" onclick="if(confirm('This will turn on Screenshot Mode. To exit, press Enter or Space.')) document.body.classList.toggle('screenshot');gridVisible=false;calcGrid();">📸</div>` +
    document.getElementById("toolbox").innerHTML;

    document.addEventListener("keypress", ev => {
        if(ev.key === "Enter" || ev.key === " ") {
            document.body.classList.remove("screenshot")
            gridVisible=true;calcGrid();
        }
    });

  if (localStorage.vgpDark == "1") {
    document.body.classList.add("dark");
  }

  if (
    Array.from(document.querySelectorAll(".maptilesbtn")).find(i => i.innerText.includes("Wiki"))
  ) {
    alert(
      "The VGP Satellite Userscript is no longer supported. Please disable that Userscript and enabled the VGP CuppaZee Expansion Pack userscript instead."
    );
  }

  setMapTileServer = function (a) {
    map.attributionControl.removeAttribution(attribution);
    document.body.classList.remove("darkMap");
    switch (a) {
      case 0:
        tileLayer.setUrl("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png");
        attribution =
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 2:
        tileLayer.setUrl(
          "https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=7f3cbdea0bff40f7b45139691a8c83ef"
        );
        attribution =
          'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 3:
        tileLayer.setUrl(
          "https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=7f3cbdea0bff40f7b45139691a8c83ef"
        );
        attribution =
          'Maps &copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 4:
        tileLayer.setUrl(
          "https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
        );
        attribution =
          '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 5:
        tileLayer.setUrl(
          "https://api.maptiler.com/maps/hybrid/256/{z}/{x}/{y}.jpg?key=7qsgWErAr36tSql1JHhZ"
        );
        attribution =
          '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 6:
        tileLayer.setUrl(
          "https://api.maptiler.com/maps/darkmatter/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
        );
        attribution =
          '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        document.body.classList.add("darkMap");
        break;
      case 7:
        tileLayer.setUrl(
          "https://api.maptiler.com/maps/topo/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
        );
        attribution =
          '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
      case 8:
        tileLayer.setUrl(
          "https://api.maptiler.com/maps/pastel/256/{z}/{x}/{y}.png?key=7qsgWErAr36tSql1JHhZ"
        );
        attribution =
          '&copy; <a href="https://www.maptiler.com/license/maps/" target="_blank">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        break;
    }
    map.attributionControl.addAttribution(attribution);
    setCookie("maptype", a, 365);
  };
  setMapTileServer(maptype);
  document.getElementById(
    "maptiles"
  ).innerHTML = `<div class="maptilesbtn" onclick="setMapTileServer(0)">OpenStreetMap</div>
<div class="maptilesbtn" onclick="setMapTileServer(2)">Thunderforest Outdoors</div>
<div class="maptilesbtn" onclick="setMapTileServer(3)">Thunderforest Neighbourhood</div>
<div class="maptilesbtn" onclick="setMapTileServer(4)">MapTiler Streets</div>
<div class="maptilesbtn" onclick="setMapTileServer(5)">MapTiler Satellite</div>
<div class="maptilesbtn" onclick="setMapTileServer(6)">MapTiler Dark</div>
<div class="maptilesbtn" onclick="setMapTileServer(7)">MapTiler Topo</div>
<div class="maptilesbtn" onclick="setMapTileServer(8)">MapTiler Pastel</div>
<div class="permalink">Permalink:<br><input class="permalinktext" type="text" id="permalinktext" value="" readonly="">&nbsp;<span title="Copy permalink" class="permalinkcopy" onclick="permaLinkCopy(4)">&nbsp;Copy&nbsp;</span></div>`;

  setTimeout(() => {
    if (
      Array.from(document.querySelectorAll(".maptilesbtn")).find(i => i.innerText.includes("Wiki"))
    ) {
      alert(
        "The VGP Satellite Userscript is no longer supported. Please use the VGP CuppaZee Expansion Pack which now includes an improved version of this function."
      );
    }
  }, 5000);
    }
})();

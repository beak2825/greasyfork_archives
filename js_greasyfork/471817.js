// ==UserScript==
// @name         Minimap plus
// @namespace    https://tampermonkey.net/
// @version      1.1
// @description  mmp
// @match        https://*.margonem.pl/
// @match        https://*.margonem.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471817/Minimap%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/471817/Minimap%20plus.meta.js
// ==/UserScript==

// mmp+

//obci naprawa migania mmp podczas pisania oraz click na mobiledevices
// v3.7s
// - poprawa relacji graczy

// v3.7r
// - update respów przewa, kostka, opka, smoka i dominy

// v3.7p
// - poprawka kolizji z antybotem?
// - kończą mi się literki do wersji

// v3.7o
// - update respów de pato i karma i respy .com

// v3.7n
// - update respów viviany

// v3.7m
// - update respów mulher ma i 1 resp kasima

// v3.7ł
// - update respów demonisa

// v3.7l
// - zaznaczono domki oraz jaskinie w których respi się heros młody smok

// v3.7k
// - zaktualizowano respy herosa obłąkany łowca orków 

// v3.7j
// - zaktualizowano respy herosa domina ecclesiae

// v3.7i
// - zaktualizowano respy herosa tepeyollotl

// v3.7h
// - w końcu zmieniono na używanie cdn do grafik
// - dodano wyszukiwanie mobków w grp

// v3.7g
// - naprawiono blad z pokazywaniem graczy wywolany przez niektore dodatki typu szybsze ladowanie gry na SI

// v3.7f
// - jedna z ostatnich aktualizacji chrome (a raczej chromium) powoduje brzydkie skalowanie background-image niektorych map,
//   więc dodałem ręczne skalowanie rysowaniem na canvasie

// v3.7e
// - poprawiono wyświetlanie npc z type=6
// - poprawiono niedokładność kwadratu mgły wojny
// - zmianiono MapObject na class
// - dodano małe API do dodawania respów dla innych dodatków

// v3.7d - transition zmieniony na linear

// v3.7c - http -> https dla ikonki questów, naprawiono wywalanie gry przy zmianie koloru mapy, zaktualizowane WSZYSTKIE respy

// v3.7b - zmieniono URL ikony ustawien, naprawiono blad przez ktory koordy mouseEventu na minimapie nie byly poprawnie rozpoznawane

// v3.7
// - respy herosów są teraz zaznaczane na mapie jako sprawdzone po podejściu wystarczająco blisko
// - poprawiono dziwnie wyglądający objSize na niektórych mapach
// - usunięto tipy kolizji
// - dodano opcjonalne pokazywanie koordynatów kursora
// - zmieniono glow trackingu na czerwony, żeby lepiej pasował do strzałki
// - autosave przy edytowaniu listy trackingu
// - tracking nie jest case sensitive
// - okienko z info o nowej wersji można otworzyć ponownie w ustawieniach
// - zaktualizowane respy itp

//3.6d - dodane nowe respy mrocznego patryka (dzieki Joan)
//3.6c - mały update respów, teraz można kliknąć na strzałkę trackingu żeby iść do koordów które wskazuje
//3.6b - update ksiecia kasima
//3.6 - dodano ustawienia warstw, rozdzielono niektóre kolory, lekko zmieniono css ustawień, wyszukiwarka zrobiona od nowa
//3.5c - dodane respy złodzieja
//3.5b -  dodane respy, naprawiony obrazek strzalki trackingu
//3.5 - naprawienie tipów na NI, zaktualizowanie pathfindera na SI, jakieś tam respy dodane
//3.4 - changelog był sobie w linii 53
//3.3.1 - dodanie przycisku otwierania mapy na konsoli PS4 (Mozilla/5.0 (PlayStation 4 7.00) AppleWebKit/605.1.15 (KHTML, like Gecko))
//3.3 - naprawiony bug z nieładowaniem postaci gracza po wejściu na nową mapę do momentu zrobienia kroku, dodano "mas/exit-h64c.gif" to listy grafik npc-drzwi, dodano pokazywanie "mgły wojny"
//3.2
//-(SI) ppm na gracza na minimapie -> menu takie jakie by się otworzyło po kliknięciu na mapie
//-kompatybilność z dodatkiem ccarderra pokazującym graczy z innych światów
//-naprawiony bug z grobami
//3.1.9b - nowe respy
//3.1.9 - oczywiście że 3.1.8 coś popsuło :^)
//3.1.8 - uzupełniono elity do questa dziennego na .com
//3.1.7 - czemu każdą aktualizacją coś psuję
//3.1.6 - to coś z cookie __mExts i kompatybilność z jedną rzeczą którą robię (w wersji 2.x była ale zapomniałem robiąc 3.0)
//3.1.5 - wersja na stary silnik xd
//3.1.4 - ciągle coś psuję
//3.1.3 - ._.' warto używać isset
//3.1.2 - zmiany w chodzeniu postaci po kliknięciu punktu na mapie (teraz moze iść gdziekolwiek sie kliknie), optymalizacje dla urządzeń mobilnych (toucheventy mają mniejsze opóźnienie)
//3.1.1 - naprawa głupiego błędu prezez który minimapa psuła grę
//3.1 - pokazywanie qm przy npc na minimapie, poprawione wartości przy których elementy dolnego paska są chowane, licznik instalacji (przez dislike niepublicznego dodatku)
//3.0 - dodatek napisany od nowa
window.miniMapPlus = new (function() {
  const SocietyData = {
      "RELATION": {
          "NONE": 1,
          "FRIEND": 2,
          "ENEMY": 3,
          "CLAN": 4,
          "CLAN_ALLY": 5,
          "CLAN_ENEMY": 6,
          "FRACTION_ALLY": 7,
          "FRACTION_ENEMY": 8
      },
      "TIP": {
          2: "fr",
          3: "en",
          4: "cl",
          5: "cl-fr",
          6: "cl-en",
          7: "fr-fr",
          8: "fr-en"
      }
  }

  var interface = (function() {
      if (typeof API != "undefined" && typeof Engine != "undefined" && typeof margoStorage == "undefined") {
          return "new"; //NI
      } else if (typeof dbget == "undefined" && typeof proceed == "undefined") {
          return "old"; //SI
      } else {
          return "superold"; //Stary silnik
      };
  })();
  var self = this;
  const mmp = this;
  var masks = ["obj/cos.gif", "mas/nic32x32.gif", "mas/nic64x64.gif"];
  var gws = ["mas/exit-ith.gif", "mas/exit-ith1.gif", "mas/exit.gif", "mas/drzwi.gif", "obj/drzwi.gif", "mas/exit-h64c.gif"];
  var oldPos = {x: -1, y: -1};
  var otherRanks = ["Administrator", "Super Mistrz Gry", "Mistrz Gry", "Moderator Chatu", "Super Moderator Chatu"];
  var $map,
      $wrapper,
      $info,
      $search,
      $userStyle,
      objScale,
      objSize,
      $chatInput,
      $coordText,
      $searchTxt;
  var manualMode = false;
  var innerDotKeys = ["friend", "enemy", "clan", "ally"];
  this.version = "3.7";
  this.updateString = 
`
<div style="height: 400px; overflow: auto;">
<b>miniMap+ - wersja v${this.version}</b><br><br>
Zmiany:
<ul>
  <li>- respy herosów są teraz zaznaczane na mapie jako sprawdzone po podejściu wystarczająco blisko - kolor jakimi są oznaczane można zmienić w ustawieniach</li>
  <li>- poprawiono błędny rozmiar obiektów na niektórych mapach (bywało o 1px za mało)</li>
  <li>- usunięto tipy kolizji (kolizje pokazywane są jeśli jest to włączone w ustawieniach)</li>
  <li>- dodano pokazywane koordynatów kursora w lewym dolnym rogu minimapy (można to wyłączyć w ustawieniach jak przeszkadza). Na urządzeniach mobilnych funkcja ta zawsze jest wyłączona, ponieważ nie działa zbyt dobrze.</li>
  <li>- zmieniono podświetlenie herosów/NPC z trackingu z niebieskego na czerwony, żeby lepiej pasowało do koloru strzałki</li>
  <li>- tracking teraz automatycznie zapisuje zmiany przy dodawaniu/usuwaniu NPC/przedmiotu z listy</li>
  <li>- tracking teraz nie zwraca uwagi na wielkość liter w nazwie NPC/przedmiotu</li>
  <li>- okienko z informacjami o nowej wersji można powownie otworzyć w ustawieniach (zakładka "inne")</li>
</ul>
<br>
Ewentualne błędy proszę zgłaszać w <a href="https://www.margonem.pl/?task=forum&show=posts&id=488564" target="_blank">temacie na forum</a>.
</div>
`;

  function getPath(path, defaultValue) {
      if (interface == "old") {
          return CFG[path] || defaultValue;
      } else if (interface == "new") {
          return CFG["a_"+path] || defaultValue;
      }
      return defaultValue;
  }

  function setTip($el, txt, ctip="") {
      if (interface == "new") {
          if (ctip)
              $($el).tip(txt, ctip);
          else
              $($el).tip(txt);
      } else {
          $el.setAttribute("tip", txt);
          if (ctip != "")
              $el.setAttribute("ctip", ctip);
      }
  }
  
  function getTip($el) {
      if (interface == "new") {
          return $($el).getTipData();
      } else {
          return $el.getAttribute("tip");
      }
  }

  /* Weird hack */
  function getTipIdForTxt(txt) {
      const tmpDiv = document.createElement("div");
      $(tmpDiv).tip(txt);
      return tmpDiv.getAttribute("tip-id");
  }

  var settings = new (function() {
      var path = "mmp";
      var Storage = interface != "old" ? API.Storage : margoStorage;
      this.set = function(p, val) {
          Storage.set(path + p, val);
      };
      this.get = function(p) {
          return Storage.get(path + p);
      };
      this.remove = function(p) {
          try {
              Storage.remove(path + p);
          } catch (e) {};
      };
      this.exist = function() {
          return Storage.get(path) != null;
      };
  })();

  let mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  let consoleDevice = (/PlayStation 4/i).test(navigator.userAgent) || settings.get("/forceMobileMode"); // TODO: add more consoles

  const $visibility = (function() {
      let $div = document.createElement("div");
      $div.classList.add("mmp-visibility");
      return $div;
  })();

  this.initSettings = function() {
      if (!settings.exist()) {
          this.setDefaultSettings();
      } else {
          this.fixSettings();
      };
  };

  this.fixSettings = function() {
      var loaded = settings.get("");
      var def = this.getDefaultSettings();
      if (this.fixSettingsObject(loaded, def))
          settings.set("", loaded);
  };
  
  this.fixSettingsObject = function(loaded, def) {
      let overwrite = false;
      for (let key in def) {
          if (!isset(loaded[key])) {
              loaded[key] = def[key];
              overwrite = true;
          } else {
              if (typeof def[key] == "object") {
                  const res = this.fixSettingsObject(loaded[key], def[key]);
                  if (res)
                      overwrite = true;
              }
          }
      }
      return overwrite;
  }

  this.setDefaultSettings = function() {
      settings.set("", this.getDefaultSettings());
  };

  this.convertOldSettings = function(json) {
      var sett = JSON.parse(json);
      sett.darkmode = false;
      sett.altmobilebtt = false;
      sett.mapsize = 1;
      sett.minlvl = parseInt(sett.minlvl);
      sett.opacity = 1 - sett.opacity;
      if (isNaN(sett.minlvl)) sett.minlvl = 1;
      localStorage.removeItem("miniMapPlus");
      return sett;
  };

  this.getDefaultSettings = function() {
      var oldVersion = localStorage.getItem("miniMapPlus");
      if (oldVersion) return this.convertOldSettings(oldVersion);
      return {
          show: 82,
          minlvl: "1",
          colors: {
              hero: "#FF0000",
              other: "#FFFFFF",
              rip: "#FFFFFF",
              friend: "#08ad00",
              enemy: "#FF0000",
              clan: "#08ad00",
              ally: "#9eff91",
              npc: "#ddff00",
              mob: "#222222",
              elite: "#00ffe9",
              elite2: "#039689",
              elite3: "#007500",
              heros: "#c6ba35",
              titan: "#809912",
              item: "#f56bff",
              gw: "#0000FF",
              "heros-resp": "#c6ba35",
              "heros-mark": "#64ffe9",
              col: "#400040"
          },
          layers: {
              hero: 100,
              other: 140,
              rip: 90,
              npc: 110,
              mob: 110,
              elite: 120,
              elite2: 130,
              elite3: 130,
              heros: 160,
              titan: 150,
              item: 80,
              gw: 70,
              "heros-resp": 150,
              col: 0
          },
          trackedNpcs: [],
          trackedItems: [],
          maxlvl: 13,
          mapsize: 1,
          opacity: 1,
          interpolerate: true,
          darkmode: false,
          showqm: true,
          showcol: false,
          showcoords: true,
          // chromium scaling is ugly
          manualDownscale: typeof(window.chrome) != "undefined",
          //showevonetwork: true
      };
  };

  this.getInstallSource = function() {
      if (interface != "old") return "addon";
      var panelAddons = getCookie("__mExts");
      if (panelAddons == null) return "addon";
      var srcs = {
          p: "panel dodatków (pub.)",
          d: "dev",
          v: "panel dodatków"
      };
      for (var i in srcs) {
          if (panelAddons.indexOf(i+"64196") > -1) return srcs[i];
      };
      return "addon";
  };

  this.initHTML = function() {
      $wrapper = document.createElement("div");
      $wrapper.classList.add("mmpWrapper");

      $map = document.createElement("div");
      $map.classList.add("mmpMap");
      if (!mobileDevice) $map.addEventListener("click", this.goTo);
      else $map.addEventListener("touchstart", this.goTo);
      $map.addEventListener("contextmenu", this.rclick);

      $coordText = document.createElement("div");
      $coordText.classList.add("mmpCoordText");
      $coordText.innerText = "(0,0)";
      $map.appendChild($coordText);
      $map.addEventListener("mousemove", e => {
          const coords = this.getCoordsFromEvent(e);
          if (coords) {
              $coordText.innerText = `(${coords.x},${coords.y})`;
          } else {
              // console.log(e.target);
          }
      });

      var $bottombar = document.createElement("div");
      $bottombar.classList.add("mmpBottombar");
      $info = document.createElement("span");
      $info.innerHTML = "miniMapPlus by <a href='https://www.margonem.pl/?task=profile&id=3779166' target='_blank'>Priweejt</a> |&nbsp;";
      $bottombar.appendChild($info);
      $searchTxt = document.createElement("span");
      $searchTxt.innerHTML = "Szukaj:&nbsp;";
      $bottombar.appendChild($searchTxt);
      $search = document.createElement("input");
      $search.addEventListener("keyup", this.searchBarHandler);
      $bottombar.appendChild($search);
      var $settings = document.createElement("img");
      $settings.src = "https://priw8-margonem-addon.herokuapp.com/SI-addon/mmp/img/config.png";
      $settings.classList.add("mmpSettingIcon");
      $settings.addEventListener("click", niceSettings.toggle);
      setTip($settings, "Ustawienia");
      $bottombar.appendChild($settings);

      $wrapper.appendChild($map);
      $wrapper.appendChild($bottombar);

      if (interface == "new") document.querySelector(".game-window-positioner").appendChild($wrapper);
      else if (interface == "old") document.querySelector("#centerbox2").appendChild($wrapper);
      else document.querySelector("body").appendChild($wrapper);

      this.appendMainStyles();
      this.initEventListener();
  };

  this.appendMobileButton = function () {
    if (interface == "old" && (mobileDevice || consoleDevice)) {
      //przycisk otwierania mapy dla urządzeń mobilnych/konsol
      var $btt = document.createElement("div");
      $btt.innerHTML = "MM+";
      $btt.classList.add("mmpMobileButton");
      //  $btt.addEventListener(mobileDevice ? "touchstart" : "click", event => {
      $btt.addEventListener("click", (event) => {
        // tu zmienilem na clicka
        self.toggleView();
        event.preventDefault();
      });
      document.getElementById("centerbox2").appendChild($btt);
    }
  };

  this.initEventListener = function() {
      document.addEventListener("keydown", function(e) {
          if (e.target.tagName != "INPUT" && e.target.tagName != "TEXTAREA" && e.target.tagName != "MAGIC_INPUT" && e.keyCode == settings.get("/show")) {
              self.toggleView();
          };
      }, false);
  };

  this.appendMainStyles = function() {
      var $style = document.createElement("style");
      var css = `
          .mmpMobileButton {
              z-index: 390;
              border: 1px solid black;
              opacity: 0.7;
              background: white;
              position: absolute;
              top: 240px;
              left: -1px;
              width: 32px;
              height: 32px;
              color: gray;
              text-align: center;
              line-height: 32px;
              font-size: 80%;
              border-radius: 3px;
              border-top-right-radius: 8px;
          }
          .mmpWrapper {
              position: absolute;
              z-index: 380;
              border: 3px solid black;
              border-radius: 5px;
              border-bottom-left-radius: 20px;
              overflow: hidden;
              display: none;
          }
          .mmpWrapper .mmpMap {
              overflow: hidden;
              background-size: 100%;
              position: relative;
          }
          .mmpWrapper .mmpBottombar {
              height: 19px;
              background: #CCCCCC;
              border-top: 1px solid black;
              color: #232323;
              padding-left: 8px;
              line-height: 19px;
          }
          .mmpWrapper .mmpBottombar input {
              height: 11px;
              width: 130px;
          }
          .mmpWrapper .mmpBottombar .mmpSettingIcon {
              height: 15px;
              width: 15px;
              float: right;
              background: rgba(100,100,100,.8);
              border-radius: 5px;
              cursor: pointer;
              margin-top: 2px;
          }
          .mmpMapObject {
              position: absolute;
              z-index: 1;
              box-sizing: border-box;
          }
          .mmpMapObject.hidden {
              display: none;
          }
          .mmpMapObject.hiddenBySearch {
              display: none;
          }
          .mmpMapObject .innerDot{
              position: absolute;
          }
          .mmp-visibility {
              pointer-events: none;
              border: 1px solid yellow;
              box-sizing: border-box;
          }
          .mmpCoordText {
              font-size: 12px;
              position: absolute;
              bottom: 0px;
              left: 0px;
              padding: 2px;
              background: rgba(0, 0, 0, 0.5);
              z-index: 1000;
              pointer-events: none;
              color: white;
          }
      `;
      $style.innerHTML = css;
      document.head.appendChild($style);
  };

  this.onSettingsUpdate = function() {
      self.appendUserStyles();
      self.objectMgr.manageDisplay();
      self.resetQtrack();
      message("[color=white]Zapisano[/color]");
  };

  this.appendUserStyles = function() {
      if (!$userStyle) {
          $userStyle = document.createElement("style");
          document.head.appendChild($userStyle);
      };
      $userStyle.innerHTML = this.generateUserCss();
  };

  this.generateUserCss = function() {
      var css = "";
      var colors = settings.get("/colors");
      for (var name in colors) {
          css += this.getSingleColorCssLine(name, colors[name]);
      };
      const layers = settings.get("/layers");
      for (const name in layers) {
          css += this.getSingleLayerCssLine(name, layers[name]);
      }
      css += ".mmpWrapper { opacity: "+settings.get("/opacity")+"; }\n"
      if (settings.get("/interpolerate")) css += ".mmpMapObject { transition: all .5s linear; }\n";
      if (settings.get("/darkmode")) {
          css += ".mmpWrapper .mmpBottombar { background: #222222; color: #CCCCCC; }\n";
          css += ".mmpWrapper .mmpBottombar input {background: black; border: 1px solid #333333; color: white;}\n";
          css += ".mmpWrapper .mmpBottombar a {color: #009c9c;}\n"
          css += ".mmpMobileButton {background: #222222; color: #CCCCCC;}\n"
      };
      if (settings.get("/altmobilebtt")) {
          css += ".mmpMobileButton { top: 470px; left: 665px; }\n";
      };
      if (!settings.get("/showqm")) {
          css += ".mmpQM { display: none; }\n";
      } else {
          css += ".mmpQM { display: block; position: absolute; top: -200%;}\n";
      };
      if (settings.get("/novisibility")) {
          css += ".mmp-visibility { display: none }";
      }

      if (!settings.get("/showcoords") || mobileDevice || consoleDevice) {
          css += ".mmpCoordText {display: none}";
      }

      return css;
  };

  this.getSingleColorCssLine = function(name, val) {
      if (innerDotKeys.indexOf(name) > -1) {
          return ".mmpMapObject .innerDot.mmp-"+name+" { background: "+val+";}\n";
      } else {
          return ".mmpMapObject.mmp-"+name+" { background: "+val+";}\n";
      };
  };

  this.getSingleLayerCssLine = function(name, val) {
      return `.mmpMapObject.mmp-${name} { z-index: ${val}; }\n`
  }

  //functionality
  this.rclick = function(e) {
      if (interface != "old") return; //TODO: support other interfaces
      var tar = false
      if (e.target.classList.contains("mmp-other")) tar = e.target;
      else if (e.target.parentElement.classList.contains("mmp-other")) tar = e.target.parentElement; //for others with innerdot 
      if (tar) {
          var obj = self.objectMgr.getByElem(tar);
          if (obj.d.evoNetwork) return;
          var id = obj.d.id;
          id = id.split("-")[1]; //id = OTHER-rid, where rid = char id of the other player
          var $other = document.querySelector("#other"+id);
          //hacky solution
          var sm = window.showMenu;
          var otherMenu = false;
          window.showMenu = function(e, menu) {
              otherMenu = menu;
              window.showMenu = sm;
          };
          $other.click();
          if (otherMenu) {
              for (var i in otherMenu) {
                  //idk it doesn't hide automatically for whatever reason (I mean it does, but only after it has been clicked 2 times)
                  otherMenu[i][1] += ";hideMenu();";
              };
              window.showMenu(e, otherMenu, true);
          };
          e.preventDefault();
      };
  };

  this.goTo = function(e) {
      if (e.type == "touchstart") {
          var offsets = self.getOffsets(e.target);
          e.offsetX = e.touches[0].pageX - offsets[0];     
          e.offsetY = e.touches[0].pageY - offsets[1];
          e.stopPropagation();
      };

      var coords = self.getCoordsFromEvent(e);
      if (coords) {
          self.heroGoTo(coords.x, coords.y);
      }
  };

  this.heroGoTo = function(x, y) {
      if (interface == "new") {
          Engine.hero.autoGoTo({x: x, y: y});
      } else if (interface == "old") {
          // self.searchPath.call(window.hero, x,y);
          window.hero.searchPath(x, y);
      } else {
          self.oldMargoGoTo(x, y);
      };
  }

  this.oldMargoGoTo = function(x, y) {
      //window,hero.setMousePos(x*32,y*32);
      window.hero.mx = x;
      window.hero.my = y;
      window.global.movebymouse = true;
      this.cancelMouseMovement = true;
  };

  this.getCoordsFromEvent = function(e) {
      if (e.target == $map) {
          return {
              x: Math.round(e.offsetX/(objScale*32)),
              y: Math.round(e.offsetY/(objScale*32))
          };
      } else {
          var obj = this.objectMgr.getByElem(e.target);
          if (obj) {
              return {
                  x: obj.d.x,
                  y: obj.d.y
              };
          } else {
              return null;
          }
      };
  };

  this.getOffsets = function($el, offs) {
      var offsets = offs ? offs : [0,0];
      offsets[0] += $el.offsetLeft;
      offsets[1] += $el.offsetTop;
      if ($el.parentElement != null) {
          this.getOffsets($el.parentElement, offsets);
      };
      return offsets;
  };

  this.searchBarHandler = function(e) {
      //keyup event handler
      var input = $search.value;

      const query = self.parseSearchQuery(input);
      self.objectMgr.performSearch(query);
  };
  const TOKEN = {
      ILLEGAL: 0,
      TEXT: 1,
      COMMA: 2,
      LBRACKET: 3,
      RBRACKET: 4,
      COMPARISON: 5
  }
  const tokens = [
      {
          // ignore whitespace
          regex: /^[ \n\t]+/,
          ignore: true
      },
      {
          regex: /^([^\[\]\(\)\*,=<>\n\t]+)/,
          type: TOKEN.TEXT
      },
      {
          regex: /^,/,
          type: TOKEN.COMMA
      },
      {
          regex: /^\[/,
          type: TOKEN.LBRACKET
      },
      {
          regex: /^\]/,
          type: TOKEN.RBRACKET
      },
      {
          regex: /^(<=)/,
          type: TOKEN.COMPARISON
      },
      {
          regex: /^(>=)/,
          type: TOKEN.COMPARISON
      },{
          regex: /^(\==)/,
          type: TOKEN.COMPARISON
      },
      {
          regex: /^(=|<|>)/,
          type: TOKEN.COMPARISON
      },
      {
          regex: /^./,
          type: TOKEN.ILLEGAL
      }
  ]
  const words = [
      {
          syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.COMPARISON, TOKEN.TEXT], // RBRACKET nie jest wymagany, żeby w trakcie pisania już podświetlało.
          handler: (key, comparison, value) => {
              return {
                  action: "filter",
                  key: key,
                  comparison: comparison,
                  value: value.toLowerCase()
              }
          }
      },
      {
          syntax: [TOKEN.LBRACKET, TOKEN.TEXT, TOKEN.RBRACKET],
          handler: (key) => {
              return {
                  action: "filter",
                  key: key,
                  comparison: "?"
              }
          }
      },
      {
          syntax: [TOKEN.TEXT, TOKEN.COMMA, TOKEN.TEXT],
          handler: (textX, textY) => {
              let x = parseInt(textX),
                  y = parseInt(textY);
              
              if (isNaN(x) || isNaN(y))
                  return null;

              return {
                  action: "highlight",
                  coords: [x, y]
              }
          }
      },
      {
          syntax: [TOKEN.TEXT],
          handler: (value) => {
              return {
                  action: "filter",
                  key: "name",
                  comparison: "=",
                  value: value.toLowerCase()
              }
          }
      }
  ]
  this.parseSearchQuery = function(str) {
      const tokenList = [];
      while(str.length) {
          for (let i=0; i<tokens.length; ++i) {
              const match = str.match(tokens[i].regex);
              if (match) {
                  if (!tokens[i].ignore) {
                      tokenList.push({
                          type: tokens[i].type,
                          match: match
                      });
                  }
                  str = str.substring(match[0].length);
                  break;
              }
          }
      }

      // match the tokens to words, also collect the args
      let tokenIndex = 0;
      const actions = [];
      while(tokenIndex < tokenList.length) {
          let matched = false;
          for (let i=0; i<words.length; ++i) {
              const word = words[i];
              let wordMatched = true;
              let args = [];
              for (let j=0; j<word.syntax.length; ++j) {
                  if (tokenList.length <= tokenIndex + j || word.syntax[j] != tokenList[tokenIndex + j].type) {
                      wordMatched = false;
                      break;
                  }
                  if (tokenList[tokenIndex + j].match.length > 1)
                      args.push(tokenList[tokenIndex + j].match[1].trim());
              }
              if (wordMatched) {
                  let action = word.handler.apply(null, args);
                  if (action) {
                      actions.push(action);
                      tokenIndex += word.syntax.length;
                      matched = true; 
                      break;
                  }
              }
          }
          if (!matched)
              tokenIndex += 1;
      }

      return actions;
  }

  this.makeTip = function(data) {
      var tip = data.nocenter ? "" : "<center>";
      tip += data.txt+"<div style='text-align: center;color: gray'>("+data.x+","+data.y+")</div>";
      return tip + (data.nocenter ? "" : "</center>");
  };

  this.toggleView = function() {
      $wrapper.style["display"] = $wrapper.style["display"] == "block" ? "none" : "block";
  };

  this.initResponseParser = function() {
      if (interface == "new") {
          API.priw.emmiter.on("before-game-response", data => {
              if (!manualMode) this.parseInput(data);
          })
      } else if (interface == "old") {
          var _parseInput = parseInput;
          parseInput =  function(data) {
              if (!manualMode) self.parseInput(data);
              return _parseInput.apply(this, arguments);
          };
      } else {
          API.emmiter.on("response", data => {
              if (!manualMode) self.parseInput(self.parseOldMargonemData(data));
          })
      };
  };

  self.arr2obj = function(arr) {
      var ret = {};
      for (var i=0; i<arr.length; i++) {
          ret[arr[i].id] = arr[i];
      };
      return ret;
  };

  self.parseOldMargonemData = function(data) {
      //data.gw2 = [];
      //data.townname = {};
      /*if (data.elements) {
          if (data.elements.npc) Object.assign(data.npc, this.arr2obj(data.elements.npc));
          if (data.elements.other) Object.assign(data.other, this.arr2obj(data.elements.other));
      }
      if (data.delete) {
          if (data.delete.npc) Object.assign(data.npc, this.arr2obj(data.delete.npc));
          if (data.delete.other) Object.assign(data.other, this.arr2obj(data.delete.other));
      }
      if (data.othermove) {
          Object.assign(data.other, this.arr2obj(data.othermove));	
          console.log(data.othermove);
      };*/
      return data;
  };

  this.enableManualMode = function() { //tryb w którym ignoruje wszystkie dane z silnika gry; na potrzeby mojego dodatku klanowego
      manualMode = true;
  };
  this.disableManualMode = function() { 
      manualMode = false;
  };

  this.parseInput = function(data) {
      for (var i in data) {
          if (typeof this.eventHandlers[i] == "function") this.eventHandlers[i](data[i], data);
      };
      if (data.townname) this.eventHandlers.gateways(data.gw2, data.townname);
  };

  this.eventHandlers = {
      town: function(town, full) {
          // town gets sent on map pvp mode change, not only map change
          if (typeof town.file != "undefined") {
              self.loadMap(town);
          }
          if (typeof town.visibility != "undefined") {
              self.updateVisibility(town.visibility, objScale);
          }
          if (typeof full.cl != "undefined") {
              self.loadCols(full);
          }
      },
      npc: function(npc) {
          self.parseNpc(npc);
      },
      gateways: function(gws, townname) {
          self.parseGws(gws, townname);
      },
      other: function(others) {
          self.parseOther(others);
      },
      item: function(items) {
          self.parseItem(items);
      },
      rip: function(rip) {
          self.parseRip(rip);
      }
  };
  
  this.loadCols = function(data) {
      if (!settings.get("/showcol"))
          return;
      
      if (typeof data.cl == "undefined") {
          console.error("mmp: collision data missing from town");
          return;
      }

      /* Dekompresja kolizji (mocno oparta o kod SI) */
      let index = 0;
      const cols = [];
      for (let i=0; i<data.cl.length; ++i) {
          let code = data.cl.charCodeAt(i);
          if (code > 95 && code < 123) {
              /* Wypełnij (code-95)*6 miejsc zerami */
              for (let j=95; j<code; ++j) {
                  for (let k=0; k<6; ++k) 
                      cols[index++] = 0;
              }
          } else {
              /* W tym wupadku (code-32) to 6-bitowa liczba w której każdy bit odpowiada za kolejną kolizję */
              code -= 32;
              for (let j=0; j<6; ++j) 
                  cols[index++] = (code & (1 << j)) ? 1 : 0;
          }
      }

      const townData = data.town;
      for (let x=0; x<townData.x; ++x) {
          for (let y=0; y<townData.y; ++y) {
              if (cols[y*townData.x + x]) {
                  this.objectMgr.updateObject({
                      id: `col-${x}-${y}`,
                      x: x,
                      y: y,
                      type: "col",
                      filterData: {
                          name: `Kolizja ${x} ${y}`,
                          typ: "kolizja"
                      }
                  });
              }
          }
      }
  }

  this.resetQtrack = function() {
      qTrack.reset();
      var npc = settings.get("/trackedNpcs");
      for (var i=0; i<npc.length; i++) {
          qTrack.add({
              type: "NPC",
              name: npc[i]
          });
      };
      var item = settings.get("/trackedItems");
      for (i=0; i<item.length; i++) {
          qTrack.add({
              type: "ITEM",
              name: item[i]
          });
      };
  };

  this.loadMap = function(town) {
      if (interface == "superold") town.file = town.img;
      this.resetQtrack();
      this.objectMgr.deleteAll();
      var mapsize = interface == "new" ? 700 : 440;
      mapsize = mapsize*settings.get("/mapsize");
      if (town.x > town.y) {
          var height = Math.floor(town.y/town.x * mapsize);
          var width = mapsize;
      } else {
          var width = Math.floor(town.x/town.y * mapsize);
          var height = mapsize;
      };
      objScale = width/(town.x*32);
      objSize = Math.ceil(objScale*32);

      var left = 0;
      var top = 0;
      if (interface != "new") {
          top = -30;
          left = -144;
      };

      Object.assign($wrapper.style, {
          //$map will stretch the $wrapper
          //width: width + "px", 
          //height: (height+20) + "px",
          left: "calc(50% - "+(width/2 - left)+"px)",
          top: "calc(50% - "+(height/2 - top)+"px)"
      });
      Object.assign($map.style, {
          width: width + "px",
          height: height + "px",
      });
      if (width < 385) $info.style["display"] = "none";
      else $info.style["display"] = "inline-block";
      if (width < 210) $searchTxt.style["display"] = "none";
      else $searchTxt.style["display"] = "inline-block";

      this.loadMapImg(town.file, width, height);
      if (interface != "superold") {
          this.herosCheckedRespManager.reset();
          this.addSpawnsToMap(herosDB, true, town.name, town.id);
          this.addSpawnsToMap(eliteDB, false, town.name, town.id);
      };
      this.updateHero(true);
  };

  this.updateVisibility = function(n, scale) {
      if (n) {
           let size = (n*2 + 1)*scale*32;
          Object.assign($visibility.style, {
              width: size + "px",
              height: size + "px",
              "margin-top": (size/-2) + (scale*16) + "px",
              "margin-left": (size/-2) + (scale*16) + "px",
              opacity: 1
          });
      } else {
          $visibility.style.opacity = 0;
      }
  }

  this.loadMapImg = function(file, w, h) {
      $map.style["background-image"] = "";
      $map.style["background"] = "#444444";
      var miniMapImg = new Image();
      miniMapImg.crossOrigin = "anonymous";
      if (file.indexOf("http") == -1) {
          var mpath = getPath("mpath", "/obrazki/miasta/");
          miniMapImg.src = (interface == "superold" ? "http://oldmargonem.pl" : "") + mpath + file;
      } else {
          miniMapImg.src = file;
      };
      miniMapImg.onload = function() {
          if (settings.get("/manualDownscale")) {
              // "Hacky" downscale that manages to produce a pretty solid quality
              // https://stackoverflow.com/questions/17861447/html5-canvas-drawimage-how-to-apply-antialiasing
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              canvas.width = miniMapImg.width;
              canvas.height = miniMapImg.height;
              ctx.drawImage(miniMapImg, 0, 0);
              let loops = Math.ceil(Math.log(miniMapImg.width / w) / Math.log(2)) - 1;
              let currentWidth = miniMapImg.width;
              let currentHeight = miniMapImg.height;
              while(loops-- > 0) {
                  currentWidth *= 0.5;
                  currentHeight *= 0.5;
                  ctx.drawImage(canvas, 0, 0, 0.5 * miniMapImg.width, 0.5 * miniMapImg.height);
              }

              const finalCanvas = document.createElement("canvas");
              finalCanvas.width = currentWidth;
              finalCanvas.height = currentHeight;
              const fctx = finalCanvas.getContext("2d");
              fctx.drawImage(canvas, 0, 0, currentWidth, currentHeight, 0, 0, currentWidth, currentHeight);

              $map.style["background"] = "";
              $map.style["background-image"] = `url(${finalCanvas.toDataURL()})`;
          } else {
              $map.style["background"] = "";
              $map.style["background-image"] = "url("+miniMapImg.src+")";
          }
      };
  };

  this.parseNpc = function(npcs) {
      for (var id in npcs) {
          var npc = npcs[id];
          if (!npc.del) {
              this.addNewNpcToMap(npc, id);
          } else {
              this.objectMgr.updateObject({
                  id: "NPC-"+id,
                  del: 1
              });
              if (npcTrack[id]) {
                  qTrack.remove({
                      type: "NPC",
                      nick: npcTrack[id].nick
                  });
                  delete npcTrack[id];
              };
          };
      };
  };
  this.addNewNpcToMap = function(npc, id) {
      var {type, flash} = this.getNpcType(npc, id);
      if (type == undefined) return;
      var {tip, ctip} = this.getNpcTip(npc, type, flash);
      var data = {
          id: "NPC-"+id,
          type: type,
          flash: flash,
          tip: tip,
          ctip: ctip,
          x: npc.x,
          y: npc.y,
          qm: npc.qm || (npc.actions && npc.actions & 128)
      };
      data.filterData = {
          name: npc.nick,
          typ: this.getNpcFriendlyType(type)
      }
      if (npc.qm || (npc.actions && npc.actions & 128)) {
          data.filterData.quest = true;
      }
      if (type != "npc" && type != "gw" && type != "item") {
          data.lvl = npc.lvl;
          data.filterData.lvl = npc.lvl;
      };
      if (npc.grp != 0) {
          data.filterData.grp = true;
          data.filterData.grupa = true;
      }

      
      this.objectMgr.updateObject(data)
  };
  this.getNpcTip = function(npc, type, important) {
      var tip = "";
      var mask = false;
      for (var i=0; i<masks.length; i++) {
          if (masks[i].indexOf(npc.icon) > -1) mask = true;
      };
      if (!mask) tip += "<img src='"+this.npcIconHTML(npc.icon)+"'>";
      var ctip = "t_npc";
      if (type == "gw") {
          ctip = false;
          tip = this.makeTip({
              txt: npc.nick + "<br>",
              x: npc.x,
              y: npc.y
          })
      } else if (type == "item") {
          ctip = "t_item";
          tip = this.makeTip({
              x: npc.x,
              y: npc.y,
              txt: tip + "<br>" + npc.nick
          })
      } else {
          tip = this.normalNpcTip(npc, type, important, tip);
      };
      return {
          tip: tip,
          ctip: ctip
      }
  };
  this.npcIconHTML = function(icon) {
      if (icon.indexOf("://") > -1 || icon.indexOf("obrazki/") > -1) return icon; //zapomniałem o kompatybilności z jedną rzeczą którą robię xd
      else if (interface == "superold") return "http://oldmargonem.pl/obrazki/npc/"+icon;
      else return getPath("npath", "/obrazki/npc") + icon;
  };
  this.oldNpcTip = function(npc, type, eve) {
      var icon = npc.icon;
      npc.icon = "kappa";
      if (type == "elite2" && !eve) {
          npc.wt = 30;
      };

      if (!g.tips.npc) newNpc();
      var tip = g.tips.npc(npc);

      if (type == "elite2") {
          if (!eve) {
              npc.wt = 20;
              tip = tip.replace("elita III", "elita II");
          } else {
              tip = tip.replace("elita", "specjalna elita");
          };
      };
      npc.icon = icon;
      return typeof tip == "string" ? tip : "";
  };
  this.newNpcTip = function(npc, type, eve) {
      var nick = "<div><strong>"+npc.nick+"</strong></div>";
      switch (type) {
          case "titan":
              var type = "<i>tytan</i>";
              break;
          case "heros":
              var type = "<i>heros</i>";
              break;
          case "elite3":
              var type = "<i>elita III</i>";
              break;
          case "elite2":
              if (eve) {
                  var type = "<i>specjalna elita</i>";
              } else {
                  var type = "<i>elita II</i>";
              }
              break;
          case "elite":
              var type = "<i>elita</i>";
              break;
          default:
              var type = "";
              break;
      };
      var lvl = npc.lvl ? npc.lvl + " lvl" : "";
      var grp = npc.grp ? " grp" : "";
      var lvlgrp = "<span>"+lvl+grp+"</span>";
      return nick + type + lvlgrp;
  };
  this.oldMargoNpcTip = function(npc, type, eve) {
      var nick = "<b style='color:orange;'>"+npc.nick+"</b>";
      switch (type) {
          case "titan":
              var type = "<i>tytan</i><br>";
              break;
          case "heros":
              var type = "<i>heros</i><br>";
              break;
          case "elite3":
              var type = "<i>elita III</i><br>";
              break;
          case "elite2":
              if (eve) {
                  var type = "<i>specjalna elita</i><br>";
              } else {
                  var type = "<i>elita II</i><br>";
              }
              break;
          case "elite":
              var type = "<i>elita</i><br>";
              break;
          default:
              var type = "";
              break;
      };
      var lvl = npc.lvl ? "Lvl: "+npc.lvl : "";
      var grp = npc.grp ? " grp" : "";
      var lvlgrp = "<span>"+lvl+grp+"</span>";
      return nick + type + lvlgrp;
  };
  this.normalNpcTip = function(npc, type, important, before) {
      if (interface == "old") {
          var tip = this.oldNpcTip(npc, type, important).replace("<span ></span><br>", "").replace("<span ></span>", "");
      } else if (interface == "new") {
          var tip = this.newNpcTip(npc, type, important);
      } else {
          var tip = this.oldMargoNpcTip(npc, type, important);
      };
      if (npc.lvl > 0) tip += "<br>";
      return this.makeTip({
          txt: before+tip,
          x: npc.x,
          y: npc.y
      });
  };
  var npcTrack = {};
  this.addNpcToTrack = function(npc, id, heros) {
      npcTrack[id] = npc;
      qTrack.add({
          type: "NPC",
          name: npc.nick
      });
      if (interface != "superold") this.checkForUnknownResp(npc, heros);
  };
  this.checkForUnknownResp = function(npc, heros) {
      var map = interface == "new" ? Engine.map.d : window.map;
      var db = heros ? herosDB : eliteDB;
      if (db[npc.nick] && db[npc.nick].spawns) {
          var spawns = db[npc.nick].spawns;
          if (spawns[map.name] || spawns[map.id]) {
              var spawnsOnMap = spawns[map.name] ? spawns[map.name] : spawns[map.id];
              if (spawns[map.name]) this.unknownMapId(map.name, map.id, heros);
              if (!this.coordsExistInSpawns(spawnsOnMap, npc.x, npc.y)) this.unknownResp(npc, map, heros);
          };
      };
  };
  this.coordsExistInSpawns = function(spawns, x, y) {
      for (var i=0; i<spawns.length; i++) {
          if (spawns[i][0] == x && spawns[i][1] == y) return true;
      };
      return false;
  };
  this.unknownResp = function(npc, map, heros) {
      // Disabling it because it my API has issues on NI currently
      // var log = interface == "new" ? API.priw.console.log : window.log;
      // log("<hr>"+(heros ? "Heros" : "Elita")+" znajduje się na respie, który nie jest w bazie danych minimapy.",1);
      // log("Prosiłbym o zamieszczenie poniższej informacji w <a style='color: gold' href='https://www.margonem.pl/?task=forum&show=posts&id=488564' target='_blank'>tym temacie</a><br><br>miniMap+ - Nieznany resp: "+npc.nick+", "+map.name+"(ID: "+map.id+")("+npc.x+","+npc.y+")<br><hr>");
  };
  this.unknownMapId = function(name, id, heros) {
      // var log = interface == "new" ? API.priw.console.log : window.log;
      // log("<hr>"+"Mapa, na której "+(heros ? "zrespił się heros" : "zrespiła się elita")+", nie jest zapisana w bazie danych po ID.",1);
      // log("Prosiłbym o zamieszczenie poniższej informacji w <a style='color: gold' href='https://www.margonem.pl/?task=forum&show=posts&id=488564' target='_blank'>tym temacie</a><br><br>miniMap+ - nieznane ID mapy - '"+name+"'="+id+"<br><hr>");
  };
  this.getNpcType = function(npc, id) {
      if (npc.type == 2 || npc.type == 3) {
          var flash = false;
          if (npc.wt > 99) {
              //tytan
              var type = "titan";
          } else if (npc.wt > 79) {
              //heros
              var type = "heros";
              this.addNpcToTrack(npc, id, true);
              flash = true;
          } else if (eliteDB[npc.nick]) {
              //specjalna elita
              var type = "elite2";
              this.addNpcToTrack(npc, id, false);
              flash = true;
          } else if (npc.wt > 29) {
              //e3
              var type = "elite3";
          } else if (npc.wt > 19) {
              //e2
              var type = "elite2";
          } else if (npc.wt > 9) {
              //e
              var type = "elite";
          } else {
              //nub
              var type = "mob";
          };
      } else if (npc.type == 0 || npc.type == 5 || npc.type == 6) {
          if (gws.indexOf(npc.icon) == -1) {
              var type = "npc";
          } else {
              var type = "gw";
          };
      } else if (_l() == "en" && npc.type == 7) {
          var type = "item";
      };
      return {
          type: type,
          flash: flash
      };	
  };
  this.getNpcFriendlyType = function(type) {
      return ({
          titan: "potwór: tytan",
          heros: "potwór: heros",
          elite2: "potwór: elita 2",
          elite3: "potwór: elita 3",
          elite: "potwór: elita",
          mob: "potwór: zwykły",
          npc: "npc",
          gw: "przejście",
          item: "przedmiot"
      })[type];
  }

  this.initHeroUpdating = function() {
      if (interface != "new") {
          var _run = hero.run;
          hero.run = function() {
              self.updateHero();
              var ret = _run.apply(this, arguments);
              if (interface == "superold" && self.cancelMouseMovement) {
                  self.cancelMouseMovement = false;
                  window.global.movebymouse = false;
              }
              return ret;
          };
      } else if (interface == "new") {
          var _draw = Engine.map.draw;
          Engine.map.draw = function() {
              self.updateHero();
              return _draw.apply(this, arguments);
          };
      };
  };

  this.updateHero = function(ignore) {
      qTrack.update();
      if (interface == "new") var hero = Engine.hero.d;
      else var hero = window.hero;
      if (!ignore && oldPos.x == hero.x && oldPos.y == hero.y) return;
      this.objectMgr.updateObject({
          id: "HERO",
          x: hero.x,
          y: hero.y,
          tip: "Moja postać",
          type: "hero",
          children: [$visibility]
      });
      this.herosCheckedRespManager.update(hero);
      oldPos.x = hero.x;
      oldPos.y = hero.y;
  };

  this.parseGws = function(gws, townname) {
      for (var i=0; i<gws.length; i+=5) {
          var tip = townname[gws[i]];
          if (gws[i+3]) {
              if (gws[i+3] == 2) {
                  tip += interface != "superold" ? "<br>("+_t("require_key", null , "gtw")+")" : "<br>(wymaga klucza)";
              };
          };
          if (gws[i+4]) {
              var min = (parseInt(gws[i+4]) & 65535);
              var max = ((parseInt(gws[i+4]) >> 16) & 65535);
              tip += "<br>" + _t("gateway_availavle", null , "gtw");
              tip += min ? _t("from_lvl %lvl%", {"%lvl%": min }, "gtw") : "";
              tip += max >= 1000 ? "" : _t("to_lvl %lvl%", { "%lvl%": max }, "gtw") + _t("lvl_lvl", null , "gtw");
          };
          this.objectMgr.updateObject({
              tip: this.makeTip({
                  txt: tip + "<br>",
                  x: gws[i+1],
                  y: gws[i+2]
              }),
              type: "gw",
              x: gws[i+1],
              y: gws[i+2],
              id: "GW-"+gws[i]+"-"+i,
              filterData: {
                  name: townname[gws[i]],
                  typ: "przejście"
              }
          });
      };
  };

  this.parseOther = function(others) {
      for (var id in others) {
          var other = others[id];
          if (!other.del) {
              if (!this.objectMgr.objectExists(`OTHER-${id}`)) {
                  // Failsafe for weird cases caused by certain SI addons
                  if (typeof other.nick != "undefined")
                      this.addNewOtherToMap(other, id);
              } else {
                  this.updateOther(other, id);
              };
          } else {
              this.objectMgr.updateObject({
                  id: "OTHER-"+id,
                  del: 1
              });
          };
      }
  };
  this.updateOther = function(other, id) {
      var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
      var data = {};
      var canLoadImgFromCache = !other.icon;
      var previousData = interface == "new" ? Engine.others.getById(id).d : g.other[id];
      var other = Object.assign({}, previousData, other);
      if (isset(other.x)) data.x = other.x;
      if (isset(other.y)) data.y = other.y;
      var {tip, ctip} = this.getOtherTip(other, evoNetwork);
      if (canLoadImgFromCache && this.otherImgCache[id]) {
          var img = this.otherImgCache[id];
          tip = '<center><div style="background-image: url('+img.src+'); width: '+(img.width/4)+'px; height: '+(img.height/4)+'px"></div></center>' + tip;
      } else {
          this.loadOtherImg(other, id, tip);
      }
      data.tip = tip;
      data.ctip = ctip;
      data.id = "OTHER-"+id;
      this.objectMgr.updateObject(data);
  };
  this.otherImgCache = {};
  this.checkIfOtherFromEvoNetwork = function(id) {
      //rozpoznawanie postaci z innych światów dodawanych przez dodatek ccarederra
      return String(id).split("_")[1] == "wsync";
  };
  this.addNewOtherToMap = function(other, id) {
      var type;
      var evoNetwork = this.checkIfOtherFromEvoNetwork(id);
      if (evoNetwork && !settings.get("/showevonetwork")) return;
      switch (other.relation) {
          case SocietyData.RELATION.NONE: //obcy
              type = "other";
              break;
          case SocietyData.RELATION.CLAN_ALLY: //sojusznik
          case SocietyData.RELATION.FRACTION_ALLY: //fraction friend
              type = "ally";
              break;
          case SocietyData.RELATION.CLAN: //klanowicz
              type = "clan";
              break;
          case SocietyData.RELATION.FRIEND: //znajomy
              type = "friend";
              break;
          case SocietyData.RELATION.ENEMY: //wróg
          case SocietyData.RELATION.CLAN_ENEMY: //wrogi klan
          case SocietyData.RELATION.FRACTION_ENEMY: //fraction enemy
              type = "enemy";
              break;
          default:
              type = "other";
              break;
      };
      if (evoNetwork) type = "evoNetwork";
      var {tip, ctip} = this.getOtherTip(other, evoNetwork);
      this.objectMgr.updateObject({
          tip: tip,
          ctip: ctip,
          type: "other",
          type2: type,
          x: other.x,
          y: other.y,
          id: "OTHER-"+id,
          evoNetwork: evoNetwork,
          filterData: {
              name: other.nick,
              klan: typeof other.clan == "object" ? other.clan.name : "",
              lvl: other.lvl,
              typ: "gracz"
          },
          click: function() {
              if (evoNetwork) return; //gdy ccarderr zrobi jakieś kanały prywatne w swoim chacie to kliknięcie gracza będzie taki otwierać
              if (interface != "old") {
                  $chatInput.value = "@" + other.nick.replace(/ /g, "_") + " ";
                  $chatInput.focus();
                  if (interface == "superold") {
                      //switch from eq to chat
                      if (window.chat.style.display == "none") {
                          var btt = document.querySelector("#eqbutton");
                          btt.click();
                          btt.style["background-position"] = "";
                      };
                  };
              } else if (interface == "old") {
                  chatTo(other.nick);
              };
          }
      });
      this.loadOtherImg(other, id, tip);
  };
  this.loadOtherImg = function(other, id, tip) {
      var img = new Image();
      img.src = (interface == "superold" ? "http://oldmargonem.pl" : "") + getPath("opath", "/obrazki/postacie/") + other.icon;
      img.onload = function() {
          self.otherImgCache[id] = img;
          tip = '<center><div style="background-image: url('+img.src+'); width: '+(img.width/4)+'px; height: '+(img.height/4)+'px"></div></center>' + tip;
          self.objectMgr.updateObject({
              tip: tip,
              id: "OTHER-"+id
          });
      };
  }
  this.getOtherTip = function(other, evoNetwork) {
      if (interface == "old") {
          var tip = this.oldOtherTip(other);
      } else if (interface == "new") {
          var tip = this.newOtherTip(other);
      } else {
          var tip = this.oldMargoOtherTip(other);
      };
      if (evoNetwork) {
          tip += "<i>Postać z dodatku World Sync</i>";
      };
      return {
          tip: this.makeTip({
              txt: tip + (evoNetwork ? "" : "<br>"),
              x: other.x,
              y: other.y
          }),
          ctip: "t_other" + (other.relation != SocietyData.RELATION.NONE && interface != "new" ? " t_"+SocietyData.TIP[other.relation] : "")
      };
  };
  this.oldOtherTip = function(other) {
      if (!g.tips.other) newOther({0:{}});newOther({0:{del:1}});
      var tip = g.tips.other(other); 
      return tip.replace(/'/g, "&apos;")
  };
  this.newOtherTip = function(other) {
      //pre-wrapper
      if (other.rights) {
          var rank;
          if (other.rights & 1) rank = 0;
          else if (other.rights & 16) rank = 1;
          else if (other.rights & 2) rank = 2;
          else if (other.rights & 4) rank = 4;
          else rank = 3;
          rank = "<div class='rank'>"+otherRanks[rank]+"</div>";
      } else {
          var rank = "";
      };
      var guest = isset(other.guest) ? "<div class='rank'>Zastępca</div>" : "";
      var preWrapper = rank + guest;
      //wrapper
      var nick = "<div class='nick'>" + other.nick + "</div>";
      var prof = "<div class='profs-icon "+other.prof+"'></div>";
      var bless = isset(other.ble) ? "<div class='bless'></div>" : "";
      var infoWrapper = "<div class='info-wrapper'>" + nick + bless + prof + "</div>";
      //post-wrapper
      var wanted = isset(other.wanted) ? "<div class='wanted'></div>" : "";
      var clan = (isset(other.clan) && other.clan.name != "") ? "<div class='clan-in-tip'>"+other.clan.name+"</div><div class='line'></div>" : "";
      var lvl = isset(other.lvl) ? "<div class='lvl'>"+other.lvl+" lvl</div>" : "";
      var mute = (other.attr & 1) ? "<div class='mute'></div>" : "";
      var postWrapper = wanted + clan + lvl + mute;

      return preWrapper + infoWrapper + postWrapper;
  };
  this.oldMargoOtherTip = function(other) {
      var tip = "<b style='color:yellow'>"+other.nick+"</b>";
      if (other.clan) tip += "<span style='color:#fd9;'>["+g.clanname[other.clan]+"]</span><br>";
      tip += "Lvl: "+other.lvl+other.prof;
      return tip;

  };

  this.parseItem = function(items) {
      for (var id in items) {
          var item = items[id];
          if (item.loc == "m") {
              this.addNewItemToMap(item, id);
          } else {
              var previousData = interface == "new" ? Engine.items.getItemById(id) : g.item[id];
              if (interface == "new" && previousData) previousData = previousData.d;
              if (previousData && previousData.loc == "m") {
                  this.objectMgr.updateObject({
                      id: "ITEM-"+id,
                      del: 1
                  });
              };
          }
      }
  };
  this.addNewItemToMap = function(item, id) {
      var tip = this.getItemTip(item);
      this.objectMgr.updateObject({
          id: "ITEM-"+id,
          tip: tip,
          ctip: "t_item",
          x: item.x,
          y: item.y,
          type: "item",
          filterData: {
              name: item.name,
              typ: "przedmiot"
          }
      });
  };
  this.oldMargoItemTip = function(item) {
      return "<b>"+item.name+"</b>"+item.stats;
  };
  this.getItemTip = function(item) {
      var nocenter = true;
      var tip = interface == "new" ? MargoTipsParser.getTip(item) : (interface == "old" ? itemTip(item) : this.oldMargoItemTip(item));
      if (interface == "old" && tip.indexOf("tip-section") == -1) { //kompatybilność z moim dodatkiem na nowe tipy
          tip = "<img src='"+(interface == "superold" ? "http://oldmargonem.pl" : "") + getPath("ipath", "/obrazki/itemy/") + item.icon + "'>" + tip;
          nocenter = false;
      };
      return this.makeTip({
          txt: tip,
          x: item.x,
          y: item.y,
          nocenter: nocenter
      });
  };
  var ripCount = 0;
  this.parseRip = function(rips) {
      for (var i=0; i<rips.length; i+=8) {
          this.addNewRipToMap({
              nick: rips[i],
              lvl: rips[i+1],
              prof: rips[i+2],
              x: parseInt(rips[i+3]),
              y: parseInt(rips[i+4]),
              ts: parseInt(rips[i+5]),
              desc1: rips[i+6],
              desc2: rips[i+7]
          });
          ripCount++;
      };
  };
  this.addNewRipToMap = function(rip) {
      var isHerosRip = false;
      var timeToDisappear = 300 + rip.ts - unix_time();
      if (timeToDisappear <= 0) return;
      var tip = "<b>" + _t("rip_prefix") + " " + htmlspecialchars(rip.nick) + "</b>Lvl: " + rip.lvl + rip.prof + "<i>" + htmlspecialchars(rip.desc1) + "</i><i>" + htmlspecialchars(rip.desc2) + "</i>";
      this.objectMgr.updateObject({
          tip: this.makeTip({
              txt: tip,
              x: rip.x,
              y: rip.y
          }),
          type: "rip",
          x: rip.x,
          y: rip.y,
          circle: true,
          border: true,
          id: "RIP-"+ripCount,
          ctip: "t_rip",
          filterData: {
              name: `Grób ${rip.nick}`,
              typ: "grób",
              lvl: rip.lvl
          }
      });
      var id = "RIP-"+ripCount;
      var nick;
      if (nick = this.checkHerosRip(rip.desc1)) {
          qTrack.add({type: "COORDS", name: "Grób gracza zabitego przez herosa "+nick+"<br>Możliwe, że heros tam stoi!", coords: [rip.x, rip.y] });
          isHerosRip = true;
          message("Na mapie znajduje się grób gracza zabitego przez herosa "+nick);
      };
      setTimeout(() => {
          self.objectMgr.updateObject({
              id: id,
              del: 1
          });
          if (isHerosRip) qTrack.remove({type: "COORDS", name: "Grób gracza zabitego przez herosa "+nick+"<br>Możliwe, że heros tam stoi!"});
      }, timeToDisappear*1000);
  };
  this.checkHerosRip = function(desc) {
      for (var nick in herosDB) {
          var needle = nick + "(" + herosDB[nick].lvl + herosDB[nick].prof + ")";
          if (desc.indexOf(needle) > -1) {
              return nick;
          };
      };
      return false;
  };

  this.objectMgr = new (function() {
      var self = this;
      var mgr = this;
      var objs = {};
      var flashables = [];
      class MapObject {
          constructor(data) {
              this.d = data;
              this.currentColor = settings.get("/colors")[this.d.type];

              if (data.flash)
                  flashables.push(this);

              this.initHTML();
              this.initEventListener();
              this.manageDisplay();
          }

          initHTML() {
              const data = this.d;
              this.$ = document.createElement("div");
              this.$.classList.add("mmpMapObject", "mmp-"+data.type);
              if (innerDotKeys.indexOf(data.type2) != -1) {
                  var $dot = document.createElement("div");
                  $dot.classList.add("innerDot", "mmp-"+data.type2);
                  Object.assign($dot.style, {
                      left: objSize/4 + "px",
                      top: objSize/4 + "px",
                      width: objSize/2 + "px",
                      height: objSize/2 + "px"
                  });
                  this.$.appendChild($dot);
              } else if (data.type2 == "evoNetwork") {
                  this.$.classList.add("evoNetwork");
              };
              if (data.children) {
                  // append extra children to the object
                  for (let i=0; i<data.children.length; i++) {
                      this.$.appendChild(data.children[i]);
                  }
              }
              var left = data.x * objScale * 32;
              var top = data.y * objScale * 32;
              Object.assign(this.$.style, {
                  top: top + "px",
                  left: left + "px",
                  width: objSize + "px",
                  height: objSize + "px",
                  opacity: "0"
              });
              setTimeout(() => this.$.style.opacity = "1.0", 1);

              if (typeof data.tip != "undefined")
                  setTip(this.$, data.tip, data.ctip ? data.ctip : "");

              if (data.circle) {
                  this.$.style["border-radius"] = objScale*18 + "px";
              };
              if (data.border) {
                  this.$.style["border"] = typeof data.border == "boolean" ? "1px solid black" : data.border;
              };
              if (data.qm) {
                  this.$.innerHTML = "<img class='mmpQM' width='"+objSize+"' height='"+objSize*2+"' src='https://jaruna.margonem.pl/img/quest-mark.gif'>";
              };
              $map.appendChild(this.$);
          }

          initEventListener() {
              if (this.d.click) {
                  var type = mobileDevice ? "touchstart" : "click";
                  this.$.addEventListener(type, e => {
                      this.d.click(e);
                      e.stopPropagation();
                  });
              };// else {
                  //this.$.addEventListener("click", this.goTo);
              //}
          };

          invertColor() {
              var c = this.currentColor;
              var c1 = (255 - parseInt("0x"+c.substring(1,3))).toString(16);
              var c2 = (255 - parseInt("0x"+c.substring(3,5))).toString(16);
              var c3 = (255 - parseInt("0x"+c.substring(5,7))).toString(16);
              if (c1.length < 2) c1 = "0" + c1;
              if (c2.length < 2) c2 = "0" + c2;
              if (c3.length < 2) c3 = "0" + c3;
              this.currentColor = "#"+c1+c2+c3;
              this.$.style.background = this.currentColor;
          }

          remove() {
              if (this.d.flash) 
                  flashables.splice(flashables.indexOf(this), 1);
  
              this.$.style["opacity"] = "0";

              if (settings.get("/interpolerate"))
                  setTimeout(() => this.$.remove(), 500);
              else
                  this.$.remove();
          }

          update(data) {
              Object.assign(this.d, data);
              if (typeof data.x != "undefined") {
                  this.$.style["left"] = data.x * objScale * 32 + "px";
              };
              if (typeof data.y != "undefined") {
                  this.$.style["top"] = data.y * objScale * 32 + "px";
              };
              if (data.tip) {
                  setTip(this.$, data.tip);
              };
              if (data.invertColor) {
                  this.invertColor();
              };
              if (typeof data.border != "undefined") {
                  if (typeof data.border == "boolean") {
                      this.$.style.border = data.border ? "1px solid black" : "";
                  } else {
                      this.$.style.border = data.border;
                  }
              }
          }

          manageDisplay() {
              if (!this.d.flash && isset(this.d.lvl) && this.d.lvl < settings.get("/minlvl")) {
                  this.$.classList.add("hidden");
              } else {
                  this.$.classList.remove("hidden");
              };
          }

          filter(filters) {
              this.$.classList.remove("hiddenBySearch");
              if (!this.d.filterData || this.d.filterData._alwaysShow)
                  return;
              
              let show = true;
              for (let i=0; i<filters.length; ++i) {
                  let filter = filters[i];
                  let res = false;
                  let val = this.d.filterData[filter.key];
                  if (val) {
                      let sval = String(val).toLowerCase();
                      let nval = Number(val);
                      if (filter.comparison == "==") {
                          res = sval == filter.value;
                      } else if (filter.comparison == "<") {
                          res = nval < filter.value;
                      } else if (filter.comparison == ">") {
                          res = nval > filter.value;
                      } else if (filter.comparison == ">=") {
                          res = nval >= filter.value;
                      } else if (filter.comparison == "<=") {
                          res = nval <= filter.value;
                      } else if (filter.comparison == "=") {
                          res = sval.indexOf(filter.value) > -1;
                      } else if (filter.comparison == "?") {
                          res = true;
                      }
                  }
                  if (!res) {
                      show = false;
                      break;
                  }
              }

              if (!show) {
                  this.$.classList.add("hiddenBySearch");
              }
          }
      }

      this.objectExists = function(id) {
          return typeof objs[id] != "undefined";
      }

      this.getByElem = function($el) {
          for (var i in objs) {
              // parentElement check is for innerDot specifically
              if (objs[i].$ == $el || objs[i].$ == $el.parentElement) return objs[i];
          };
      };
      this.deleteAll = function() {
          for (var i in objs) {
              objs[i].remove();
              delete objs[i];
          };
      };
      this.updateObject = function(data) {
          if (!objs[data.id] && !data.del) {
              if (!data.dontCreate) objs[data.id] = new MapObject(data);
          } else if (data.del) {
              if (objs[data.id]) {
                  objs[data.id].remove();
                  delete objs[data.id];
                  return null;
              };
          } else {
              objs[data.id].update(data);
          }

          if (objs[data.id]) {
              objs[data.id].filter(this.currentFilters);
          }

          return objs[data.id];
      };
      this.currentFilters = [];
      this.performSearch = function(actions) {
          this.removeCoordMarkers();
          this.currentFilters.splice(0, this.currentFilters.length);
          for (let i=0; i<actions.length; ++i) {
              const action = actions[i];
              if (action.action == "highlight") {
                  this.createCoordMarker(action.coords[0], action.coords[1]);
              } else if (action.action == "filter") {
                  this.currentFilters.push(action);
              }
          }
          this.runFiltersForAllObjects();
      };
      this.runFiltersForAllObjects = function() {
          for (const id in objs) {
              objs[id].filter(this.currentFilters);
          }
      };
      this.removeCoordMarkers = function() {
          const toDelete = [];
          for (const id in objs) {
              if (id.substring(0, 6) == "COORDS") {
                  toDelete.push(id);
              }
          }
          for (let i=0; i<toDelete.length; ++i) {
              this.updateObject({
                  id: toDelete[i],
                  del: 1
              });
          }
      };
      this.createCoordMarker = function(x, y) {
          this.updateObject({
              id: `COORDS-${x}-${y}`,
              x: x,
              y: y,
              tip: "koordy "+x+","+y,
              circle: true,
              type: "hero",
              flash: true,
              filterData: {
                  _alwaysShow: true
              }
          })
      };
      this.manageDisplay = function() {
          for (var id in objs) {
              objs[id].manageDisplay();
          };
      };
      this.invertFlashables = function() {
          for (var i=0; i<flashables.length; i++) {
              flashables[i].update({
                  invertColor: true
              });
          };
      };
      setInterval(this.invertFlashables, 500);
  })();

  this.herosCheckedRespManager = new (function() {
      const currentResps = [];
      this.reset = function() {
          currentResps.splice(0, currentResps.length);
      }
      this.addResp = function(obj) {
          currentResps.push(obj);
      }
      this.update = function(coords) {
          // My research shows that the distance from player must be <12 for a heros to show up
          let dist = 12*12;
          for (let i=0; i<currentResps.length; ++i) {
              const resp = currentResps[i];
              if (resp.d.id.indexOf("(") > -1) {
                  // Temporary hack
                  currentResps.splice(i, 1);
                  --i;
                  continue;
              }
              const dx = resp.d.x - coords.x;
              const dy = resp.d.y - coords.y;
              let currDist = dx*dx + dy*dy;
              if (currDist < dist) {
                  dist = currDist;
                  closest = resp;
                  
                  resp.update({
                      border: `${Math.ceil(objScale*4)}px solid ${settings.get("/colors/heros-mark")}`
                  });
                  currentResps.splice(i, 1);
                  --i;
              }
          }
      }
  })();

  this.addSpawnsToMap = function(db, heros, map, mapId) {
      map = map.toLowerCase();
      var maxlvl = settings.get("/maxlvl");
      var hero = interface == "new" ? Engine.hero.d : window.hero;
      for (var i in db) {
          var mob = db[i];
          if (mob.ver && mob.ver != _l()) continue;
          var minlvl = Math.max(mob.lvl/2, mob.lvl-50);
          if ((maxlvl+mob.lvl >= hero.lvl && minlvl <= hero.lvl) || mob.lvl >= 242 || mob.lvl == -1) {
              for (var loc in mob.spawns) {
                  if (loc.toLowerCase() == map || loc == mapId) {
                      var spawns = mob.spawns[loc];
                      for (var j=0; j<spawns.length; j++) {
                          var x = spawns[j][0];
                          var y = spawns[j][1];
                          const respObj = this.objectMgr.updateObject({
                              id: "SPAWN-"+i+"-"+j,
                              tip: this.makeTip({
                                  txt: "Resp " + (heros ? "herosa " : "elity ") + i,
                                  x: x,
                                  y: y
                              }),
                              x: x,
                              y: y,
                              type: "heros-resp",
                              circle: true,
                              filterData: {
                                  name: "Resp " + (heros ? "herosa " : "elity ") + i,
                                  typ: "resp",
                                  lvl: mob.lvl
                              }
                          });
                          this.herosCheckedRespManager.addResp(respObj);
                      };
                  };
              };
          };
      };
  };

  this.showNewVersionMsg = function() {
      window.mAlert(this.updateString, null);
  }
  
  this.checkNewVersionMsg = function() {
      if (settings.get("/prevver") != null) {
          const prevver = settings.get("/prevver");
          if (prevver < this.version)
              this.showNewVersionMsg();
      }
      settings.set("/prevver", this.version);
  }

  this.init = function() {
      this.initSettings();
      this.initHTML();
      this.appendUserStyles();
      this.initResponseParser();
      this.initHeroUpdating();
      this.appendMobileButton();
      this.installationCounter.count();
      this.checkNewVersionMsg();
      /* if (interface == "old") {
          /* Mam pytanie: dlaczego cały czas jest to badziewie co zmienia nazwę funkcji hero.searchPath na losową? xD
           * Chodzi mi oczywiście o to: https://cdn.discordapp.com/attachments/522835675201142784/742399669774188615/unknown.png
           * Raczej mało to daje biorąc pod uwagę, że można zrobić... Dokładnie to co ja robię tutaj, czyli po prostu skopiowanie funkcji z player.js /
          this.searchPath=function (dx,dy) {
              if(this.isBlockedSearchPath()) return this.blockedInfoSearchPath();
              var startPoint = map.nodes.getNode(hero.x, hero.y);
              var endPoint = map.nodes.getNode(dx, dy);
              if (!startPoint.hasSameGroup(endPoint)) {
                map.nodes.clearAllNodes();
                startPoint.setScore(0, map.hce8(endPoint, startPoint));
                endPoint =  map.nodeSetLoop(endPoint, startPoint, map.findStep);
              }
              map.nodes.clearAllNodes();
              startPoint.setScore(0, map.hce(startPoint, endPoint));
              map.nodeSetLoop(startPoint, endPoint, map.mapStep);
              var checkPoint = endPoint;
              road = [];
              while (checkPoint !== null && checkPoint.id != startPoint.id) {
                road.push({
                  x: checkPoint.x,
                  y: checkPoint.y
                });
                checkPoint = checkPoint.from;
              }
              if(checkPoint !== null) {
                road.push({x: checkPoint.x, y:checkPoint.y});
              }
              if(road.length>1 && g.playerCatcher.follow == null)
                  $('#target').stop().css({
                      left:road[0].x*32,
                      top:road[0].y*32,
                      display:'block',
                      opacity:1,
                      'z-index':1
                  }).fadeOut(1000);
            };
      }*/
      $chatInput = interface == "new" ? document.querySelector("[data-section='chat'] .input-wrapper input") : (interface == "superold" ? document.querySelector("#chatIn") : null);
  };

  //questtrack (fuzja kodu z wersji minimapy na SI i NI więc wygląda jak wygląda)
  var qTrack = new (function() {
      var self = this;
      var hero = interface == "new" ? Engine.hero : window.hero;
      var $hero = interface == "old" ? $("#hero") : (interface == "superold" ? document.querySelector("#oHero") : null);
      var $canvas = interface == "new" ? $("#GAME_CANVAS") : null;
      if (interface == "new") {
          this.npcs = {};
          API.addCallbackToEvent("newNpc", function(npc) {
              if (npc) self.npcs[npc.d.id] = npc.d;
          });
          API.addCallbackToEvent("removeNpc", function(npc) {
              if (npc) delete self.npcs[npc.d.id];
          });
      };
      this.getOldMargoHeroPos = function() {
          return {
              left: $hero.offsetLeft,
              top: $hero.offsetTop
          };
      };
      this.getHeroPos = function() {
          if (interface == "old") return $hero.position();
          if (interface == "superold") return this.getOldMargoHeroPos();
          if (!Engine.map.size) return {x: 0, y: 0};
          var tilesX = $canvas.width()/32;
          var tilesY = $canvas.height()/32;
          var pos = {
              x: Engine.hero.rx,
              y: Engine.hero.ry
          };
          var actualPos = {};
          if (pos.x < tilesX/2) {
              actualPos.x = pos.x*32;
          } else if (Engine.map.size.x - pos.x < tilesX/2) {
              actualPos.x = (pos.x - (Engine.map.size.x - tilesX/2) + tilesX/2)*32;
          } else {
              actualPos.x = (tilesX/2)*32;
          };
          if (pos.y < tilesY/2) {
              actualPos.y = pos.y*32;
          } else if (Engine.map.size.y - pos.y < tilesY/2) {
              actualPos.y = (pos.y - (Engine.map.size.y - tilesY/2) + tilesY/2)*32;
          } else {
              actualPos.y = (tilesY/2)*32;
          };
          var canvasOffset = $canvas.offset();
          return {
              left: actualPos.x + canvasOffset.left,
              top: actualPos.y + canvasOffset.top
          };
      };
      this.update = function() {
          for (var i=0; i<this.arrows.length; i++) {
              this.drawArrow(this.arrows[i]);
          };
      };
      this.drawArrow = function(objective) {
          if (objective.type == "NPC") {
              var nameKey = "nick";
              var obj = interface == "new" ? this.npcs : g.npc;
              var item = false;
          } else if (objective.type == "ITEM") { //item
              var nameKey = "name";
              if (interface == "new") {
                  var itemArr = Engine.items.fetchLocationItems("m");
                  var obj = {};
                  for (var i in itemArr) {
                      var it = itemArr[i];
                      if (it.id) obj[it.id] = it;
                      else obj[it.hid] = it;
                  };
              } else {
                  var obj = g.item;
              };
              var item = true;
          } else if (objective.type == "COORDS") { //coords
              var coords = objective.coords;
              var size = [32, 32];
              var x = Math.abs(hero.rx-coords[0]);
              var y = Math.abs(hero.ry-coords[1]);
              var closest = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
          };
          let closestName = objective.name;
          if (objective.type != "COORDS") {
              var closest = Infinity;
              var coords = false;
              var size = false;
              const objectiveNameLower = objective.name.toLowerCase();
              for (var i in obj) {
                  var entity = obj[i];
                  let entityName = entity[nameKey] ? entity[nameKey].toLowerCase() : "";
                  if (entityName == objectiveNameLower && (!item || entity.loc == "m")) {
                      var x = Math.abs(hero.rx-entity.x);
                      var y = Math.abs(hero.ry-entity.y);
                      var dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
                      if (dist < closest) {
                          closest = dist;
                          coords = [entity.x, entity.y];
                          closestName = entity[nameKey];
                          size = item ? [32,32] : [entity.fw, entity.fh];
                      };
                  };
              };
          };
          if (coords) {
              var cos = (coords[0] - hero.rx)/closest;
              var sin = (coords[1] - hero.ry)/closest;
              var heropos = this.getHeroPos();
              var top = 150*sin;
              var left = 150*cos;
              var opacity = 1;
              if (closest < 9) {
                  top = top*Math.pow(closest/9, 1.8);
                  left = left*Math.pow(closest/9, 1.8);
                  opacity = Math.pow(closest/9, 2.1);
              };
              if (interface != "new") top+=20;
              left += (interface == "new") ? -12 : 4;
              if ((cos >= 0 && sin >= 0) || (cos >= 0 && sin <= 0)) {
                  var angle = Math.asin(sin) * 180 / Math.PI;
              } else {
                  var angle = 180+Math.asin(0-sin) * 180 / Math.PI;
              };
              objective.$.css({
                  top: top + heropos.top,
                  left: left + heropos.left,
                  display: opacity > 0.09 ? "block" : "none",
                  "-ms-transform": "rotate("+angle+"deg)",
                  "-webkit-transform": "rotate("+angle+"deg)",
                  transform: "rotate("+angle+"deg)",
                  opacity: opacity
              });
              if (interface == "old") {
                  objective.$highlight.css({
                      left: coords[0]*32 - 11,
                      top: coords[1]*32 + 14,
                      display: "block",
                      opacity: 1-opacity
                  });
              };
              objective.$[0].dataset.x = coords[0];
              objective.$[0].dataset.y = coords[1];
              setTip(objective.$[0],
                  `<center>${closestName}</center>`+
                  `${Math.round(closest)} kratek (${coords[0]},${coords[1]})`
              );
          } else {
              objective.$.hide();
              if (interface == "old") objective.$highlight.hide();
          };
      };
      this.arrows = [];
      this.add = function(objective) {
          for (var i in this.arrows) {
              if (objective.type == this.arrows[i].type && objective.name == this.arrows[i].name) return;
          };

          objective.$ = this.arrowTemplate.clone()
              .appendTo(interface == "old" ? "#base" : (interface == "new" ? ".game-window-positioner" : "#oMap"))
              .click(() => mmp.heroGoTo(parseInt(objective.$[0].dataset.x), parseInt(objective.$[0].dataset.y)));

          if (interface == "old")
              objective.$highlight = this.highlightTemplate.clone().appendTo(interface == "old" ? "#ground" : "#oMap");

          objective.index = this.arrows.push(objective) -1;
          objective.remove = function() {
              self.arrows.splice(this.index, 1);
              for (var i=this.index; i<self.arrows.length; i++) {
                  self.arrows[i].index--;
              };
              this.$.remove();
              if (interface == "old") this.$highlight.remove();
          };
          this.update();
      };
      this.remove = function(objective) {
          for (var i=0; i<this.arrows.length; i++) {
              if (this.arrows[i].name == objective.name && this.arrows[i].type == objective.type) this.arrows[i].remove();
          };
      };
      this.reset = function() {
          while (this.arrows.length) {
              this.arrows[0].remove();
          };	
      };
      this.arrowTemplate = $("<div>").css({
          background: "url(https://priw8-margonem-addon.herokuapp.com/SI-addon/mmp/img/qt-arrow.png)",
          //background: "url(http://127.0.0.1:8080/SI-addon/mmp/img/qt-arrow.png)",
          width: 24,
          height: 24,
          zIndex: 250,
          position: "absolute",
          cursor: "pointer"
      });
      this.highlightTemplate = $("<div>").css({
          background: "url(/img/glow-52.png)", // Dlaczego glow-52?
            position: "absolute",
            width: 52,
            height: 24,
            zIndex: 1
      });
  })();

  this.installationCounter = new (function() {
      var self = this;
      var id = 87771;
      
      this.count = function() {
          if (interface == "superold") return;
          if (!settings.get("/counted")) {
              //extManager.toggleLike(id, 'unlike')
              $.ajax({
                  url: "/tools/addons.php?task=details&id="+id,
                  type: "POST",
                  data: {like: "unlike"}
              });
              settings.set("/counted", true);
          };
      };
      this.get = function(clb) {
          if (interface == "superold") return clb("<span tip='Niedostępne dla oldmargonem'>-</span>");
          $.ajax({
              url: "/tools/addons.php?task=details&id="+id,
              datatype: "json",
              success: function(r) {
                  clb(-r.addon.points);
              }
          });
      };
  })();

  //databases
  var herosDB = {
      "Domina Ecclesiae":{
          "lvl":21,
          "ver": "pl",
          "prof":"b",
          "spawns": {"3":[[44,9],[46,24],[52,10],[54,12],[56,22]],"12":[[56,53],[57,48],[58,25],[66,22],[73,18]],"167":[[9,8],[16,7]],"168":[[6,9],[18,7]],"169":[[7,8],[12,7]],"171":[[8,27],[11,8],[19,27],[21,8]],"173":[[14,8],[20,27]],"174":[[4,8],[22,10],[30,9],[42,29]],"175":[[12,10],[13,4]],"3741":[[2,11],[21,6]],"5733":[[4,10],[8,9],[12,14],[16,12],[17,8]],"5734":[[3,9],[5,8],[8,17],[12,8],[15,16],[17,14]],"5735":[[5,15],[8,4],[9,14],[13,12],[15,6]],"5736":[[5,36],[8,23],[9,9],[15,27],[20,22],[24,6],[26,34],[27,20],[30,8],[31,21],[31,35]],"5737":[[5,10],[5,36],[10,18],[17,34],[19,7],[21,21],[22,4],[29,28]],"5739":[[2,5],[9,6],[10,11],[13,16]]}
      },
      "Mroczny Patryk":{
          "lvl":35,
          "ver": "pl",
          "prof":"w",
          "spawns": {"3":[[7,87],[10,84],[28,92],[33,89]],"4":[[6,84],[11,62],[14,22],[14,51],[27,14],[27,43],[36,81],[40,29],[42,11],[44,75],[45,40],[46,49],[46,83],[51,62],[53,38],[55,78]],"110":[[8,44],[12,57],[14,70],[15,82],[17,49],[20,36],[21,29],[22,5],[23,91],[28,23],[29,40],[33,68],[37,24],[37,49],[39,19],[41,11],[41,57],[41,76],[45,66],[47,19],[54,42],[56,51],[57,41]],"111":[[6,54],[7,39],[16,11],[32,35]],"115":[[4,46],[8,43],[8,53],[9,50],[19,11],[34,44],[40,4],[44,46],[47,54],[54,8],[54,58]],"725":[[4,87],[6,80],[7,37],[8,18],[17,35],[20,9],[22,81],[32,87],[33,78],[36,45],[37,27],[46,38],[51,46],[52,21],[55,10]],"726":[[4,51],[8,62],[9,6],[16,35],[32,23],[46,19],[52,40],[55,8]],"727":[[4,37],[15,33],[42,4],[54,56]],"2524":[[8,25],[8,55],[10,65],[15,17],[26,73],[29,47],[37,6],[45,30],[56,4],[58,86]],"2530":[[4,15],[13,9],[14,6],[28,12]],"2531":[[7,17],[9,5],[24,13],[27,17]],"3402":[[10,30],[22,14],[23,34],[43,7]]}
      },
      "Karmazynowy Mściciel":{
          "lvl":45,
          "ver": "pl",
          "prof":"m",
          "spawns": {"155":[[6,25],[32,35]],"156":[[13,9]],"1664":[[9,26],[16,23]],"1665":[[20,6],[41,15]],"1667":[[26,12],[28,36],[51,38]],"1668":[[4,21],[34,10]],"1670":[[21,37],[22,13]],"1688":[[12,20],[32,22],[40,11]],"2536":[[15,19],[16,50],[60,48]],"2538":[[18,5]],"4546":[[32,25],[38,2],[45,56],[58,34]],"4547":[[4,40],[33,39],[35,8],[48,34],[60,31],[60,68]],"5293":[[30,36],[31,3],[42,57],[61,39]],"5948":[[4,61],[36,32],[37,15],[52,25]]}
      },
      "Złodziej":{
          "lvl":50,
          "ver": "pl",
          "prof":"h",
          "spawns": {"43":[[11,11]],"157":[[5,5]],"162":[[6,7]],"221":[[10,5]],"244":[[59,60]],"247":[[7,17]],"249":[[10,4]],"251":[[11,14]],"252":[[10,10]],"2010":[[6,5]],"2011":[[11,12]],"2016":[[6,12]],"2018":[[5,6]],"2308":[[51,12],[55,44],[8,8],[55,92]],"2324":[[5,5],[48,72],[20,28],[23,61]],"2341":[[9,5]],"2342":[[8,10]],"2349":[[5,6]],"2350":[[8,14]],"2351":[[13,5]],"2352":[[45,12],[51,53]],"4151":[[12,55],[53,51],[53,12]],"4528":[[6,4]]}
      },
      "Złodziej (parter i 1. piętro)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[51,57]]}
      },
      "Złodziej (parter i piwnica)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[47,23]]}
      },
      "Złodziej (pracownia i 2. piętro)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[57,39]]}
      },
      "Złodziej (parter)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[3,5],[31,11]],"4151":[[49,8]]}
      },
      "Złodziej (przyziemie i 1. piętro)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[41,32]]}
      },
      "Złodziej (parter, p.2, p.4, p.5)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"244":[[24,72]]}
      },
      "Złodziej (1. piętro)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"33":[[41,39]]}
      },
      "Złodziej (sala 1, sala 2, sala 3)":{
          "lvl":50,
          "ver": "pl",
          "spawns":{"244":[[60,82]]}
      },
      "Zły Przewodnik":{
          "lvl":63,
          "ver": "pl",
          "prof":"w",
          "spawns": {"8":[[6,46]],"38":[[13,26],[22,53],[80,33],[90,9],[92,50]],"140":[[15,51],[18,7],[30,24],[30,59],[42,2],[42,16],[42,34],[49,50],[56,24],[59,54]],"150":[[6,34],[17,15],[25,24],[26,49],[38,34],[41,5],[47,13],[48,60],[55,50],[58,41],[64,34],[66,48],[79,22],[86,36],[89,51]],"176":[[20,52],[37,41],[58,13]],"814":[[13,16]],"815":[[25,20],[35,9],[55,17]],"816":[[9,18]],"3869":[[10,16],[22,41],[34,16]],"4262":[[13,44],[23,18],[36,33]],"4550":[[17,40],[25,35],[44,56]],"6473":[[18,12],[19,16]],"6474":[[12,19],[33,10],[51,17],[52,43]],"6475":[[5,15],[28,42],[34,13],[34,29],[45,49]]}
      },
      "Piekielny kościej":{
          "lvl":74,
          "ver": "pl",
          "prof":"w",
          "spawns": {"263":[[10,41],[15,38],[24,11],[34,46],[35,18],[49,24],[57,55],[59,43]],"264":[[7,49],[11,39],[11,59],[19,41],[27,38],[30,22],[50,12],[52,21],[52,40],[53,62],[88,56]],"265":[[10,77],[22,30],[24,60],[31,74],[38,82],[39,25],[50,34],[51,24]]}
      },
      "Opętany paladyn":{
          "lvl":85,
          "ver": "pl",
          "prof":"w",
          "spawns": {"180":[[17,40],[23,55],[26,18],[37,20]],"1387":[[8,48],[28,60],[43,21],[44,39]],"1730":[[43,20],[46,60],[63,47],[75,55]],"6608":[[12,10],[16,26],[34,10]],"6609":[[15,16]],"6610":[[7,26]],"6611":[[4,33],[11,9],[24,21],[29,9],[41,19],[47,7]],"6612":[[12,29],[16,47],[51,7],[59,52],[61,35]],"6616":[[10,17],[12,44],[31,13],[49,20],[51,52]],"6624":[[13,35],[15,18],[30,31],[37,18]],"6625":[[9,12],[12,43],[27,14],[42,29]],"6626":[[5,41],[8,19],[30,29]]}
      },
      "Kochanka Nocy":{
          "lvl":100,
          "ver": "pl",
          "prof":"m",
          "spawns": {"246":[[12,8],[28,60],[77,60]],"253":[[88,34],[77,46],[80,59],[6,34],[6,41],[34,22],[60,7],[90,20]],"268":[[83,6],[10,15],[34,47]],"330":[[6,8],[88,6],[60,24],[14,43],[45,40],[16,19]],"331":[[22,12],[5,58],[82,41],[82,8]],"332":[[77,13],[64,7],[35,19],[19,36]],"339":[[91,41],[81,1],[44,9],[39,33],[45,56],[67,59]],"3765":[[70,34],[83,51],[9,43],[29,37]],"3766":[[5,46],[11,11],[60,11],[72,52],[53,55]]}
      },
      "Książę Kasim":{
          "lvl":116,
          "ver": "pl",
          "prof":"b",
          "spawns": {"630":[[13,44]],"1159":[[25,47],[77,35]],"1167":[[5,68],[19,7]],"1233":[[46,62],[88,27]],"1262":[[6,60],[79,54]],"1338":[[16,22]],"1340":[[19,22]],"1342":[[6,25],[11,9]],"1348":[[10,21],[11,89]],"1350":[[42,24],[61,15]],"1368":[[41,22],[61,55],[71,16]],"1525":[[26,14],[49,22]],"1526":[[7,20]],"1528":[[9,10]],"1607":[[15,16],[62,29],[79,54]],"1613":[[11,7],[33,23],[75,30]],"3081":[[9,7],[42,46],[42,79]]}
      },
      "Baca bez łowiec":{
          "lvl":123,
          "ver": "pl",
          "prof":"h",
          "spawns": {"1100":[[35,3],[50,7],[58,18],[50,32],[54,50],[14,36],[21,41],[38,53],[44,71],[23,71],[40,87]],"1101":[[19,22],[38,25],[38,33],[60,36],[34,54],[56,67],[54,78],[12,60],[15,88],[41,78]],"1104":[[50,25],[10,18],[17,60],[32,7]],"1105":[[16,28],[24,38]],"1106":[[7,5],[5,31]],"1107":[[19,17],[25,24],[34,12],[35,4]],"2761":[[56,5],[47,2],[29,2],[7,9],[33,27],[28,19],[22,39],[38,46],[6,46],[3,46],[18,53],[8,76],[48,87],[60,70],[48,70],[42,64]],"2762":[[34,8],[33,23],[20,6]],"2764":[[26,27],[13,17]]}
      },
      "Lichwiarz Grauhaz":{
          "lvl":129,
          "ver": "pl",
          "prof":"w",
          "spawns": {"285":[[34,10]],"286":[[7,16],[50,48]],"287":[[26,30]],"590":[[6,33]],"592":[[41,49]],"594":[[29,18]],"1192":[[30,54],[55,48]],"1227":[[51,21],[49,42],[6,43]],"1228":[[51,3],[5,18],[8,51],[42,37]],"1229":[[8,13],[11,43],[37,40],[53,9]],"1231":[[39,58],[12,11],[33,47]],"1232":[[33,7],[58,11],[42,25]],"1234":[[46,53],[5,39],[21,19],[6,23]],"1238":[[16,7]],"3468":[[32,32]],"3469":[[13,14]],"3470":[[30,5],[21,31],[18,27],[59,56]],"3471":[[39,6]],"3472":[[44,50]],"3473":[[36,43],[66,9]]}
      },
      "Obłąkany łowca orków":{
          "lvl":144,
          "ver": "pl",
          "prof":"w",
          "spawns": {"355":[[4,21],[16,9],[25,40],[35,3],[68,17]],"356":[[3,13],[18,40],[21,3],[22,27],[32,45],[42,6],[42,25],[49,37],[52,17],[62,5],[63,12]],"357":[[26,53],[63,56],[74,38],[77,14],[83,54]],"4764":[[15,8],[25,36],[29,3]],"5847":[[14,28],[18,13]],"5848":[[9,18],[21,10],[28,16]],"5849":[[6,16],[10,23],[12,7]],"5850":[[16,8],[18,17],[22,35]],"5852":[[7,7],[16,19],[25,19],[33,28]],"5853":[[10,12],[21,23],[34,35]],"5854":[[14,32],[17,9],[39,14]],"5855":[[15,26],[27,16],[33,39],[34,20]]},
      },
      "Czarująca Atalia":{
          "lvl":157,
          "ver": "pl",
          "prof":"m",
          "spawns": {"1202":[[78,32],[84,8],[12,11],[2,54]],"1293":[[46,56],[10,59],[89,24],[62,50],[82,4],[5,5]],"1294":[[19,51],[54,12],[34,11],[46,40],[27,16]],"1297":[[94,6],[1,43],[44,54],[75,33],[55,11],[45,4]],"1298":[[9,12]],"1299":[[23,13],[19,6]],"1301":[[2,6]],"1303":[[11,13]],"1305":[[8,9],[10,17]],"1306":[[13,13]],"1307":[[16,8],[8,6]],"1315":[[24,27],[42,58]]}
      },
      "Święty braciszek":{
          "lvl":165,
          "ver": "pl",
          "prof":"b",
          "spawns": {"1026":[[13,5]],"1117":[[6,6]],"1121":[[5,7]],"1123":[[5,7]],"1858":[[7,57],[59,43],[86,9],[17,11]],"1860":[[27,5],[26,44],[88,43]],"1876":[[46,47],[85,23],[11,30]],"1984":[[18,57],[67,38],[34,21]],"2003":[[28,17]],"2004":[[11,8]],"2337":[[6,15],[43,25]],"2391":[[8,14]],"2485":[[8,9]],"2486":[[6,9]],"2487":[[8,12]],"2488":[[9,5]],"2489":[[13,5]],"2490":[[10,6]],"2492":[[7,9]],"2493":[[5,5]],"2494":[[8,20]],"2495":[[31,6],[22,20]],"2496":[[3,15]],"2497":[[5,15]],"2498":[[4,22]],"2499":[[13,15]],"2500":[[10,6]],"2501":[[9,12]],"2502":[[12,6]],"2503":[[5,8]],"2504":[[5,8]],"2505":[[8,12]],"2506":[[12,6]],"2507":[[7,10]],"2508":[[11,5]],"2509":[[11,8]],"2510":[[7,11]],"2511":[[6,6]],"2515":[[45,41]],"2516":[[10,24]],"2526":[[52,8]],"2527":[[26,4]],"2535":[[49,18]]}
      },
      "Viviana Nandin":{
          "lvl":184,
          "ver": "pl",
          "prof":"h",
          "spawns": {"2020":[[57,31],[87,17],[87,53]],"5982":[[7,22],[17,49],[20,12],[23,58],[25,25],[29,10],[41,25],[60,37],[63,10],[68,35],[71,20],[73,23],[78,44],[88,9]],"5983":[[9,8],[16,54],[21,17],[41,56],[42,4],[48,14],[56,5]],"5984":[[7,12],[13,12],[24,93],[32,73],[41,11],[50,62],[57,91],[58,20],[59,9],[60,78]],"5985":[[6,13],[29,52],[35,15],[41,37],[49,61]],"5986":[[29,55],[51,50],[66,8],[75,11],[76,25],[80,54]]}
      },
      "Mulher Ma":{
          "lvl":197,
          "ver": "pl",
          "prof":"b",
          "spawns": {"114":[[2,53],[9,32],[89,8]],"574":[[22,3]],"575":[[17,53]],"730":[[90,9],[93,61]],"731":[[14,4],[91,33]],"865":[[11,5]],"1902":[[5,5]],"1903":[[15,8]],"1960":[[26,20]],"1985":[[8,6]],"2020":[[5,37],[11,5],[53,12],[80,13]],"2056":[[10,45],[65,38],[89,41]],"2063":[[13,49],[35,36],[56,12]],"2163":[[6,8]],"2169":[[7,7]],"2171":[[4,8]],"4548":[[54,55]],"4549":[[9,7],[30,55],[67,20]]}
      },
      "Demonis Pan Nicości":{
          "lvl":210,
          "ver": "pl",
          "prof":"m",
          "spawns": {"5938":[[9,9],[26,26]],"5939":[[42,26],[52,9]],"5940":[[10,36],[58,20],[59,51]],"5941":[[9,15],[48,45]],"5942":[[7,10],[9,51],[54,51],[57,10]],"5943":[[9,7],[17,27],[47,30],[72,26],[89,21]],"5944":[[22,31],[45,51],[52,9]],"5945":[[11,13],[13,60]],"5946":[[24,15],[70,15]]}
      },
      "Vapor Veneno":{
          "lvl":227,
          "ver": "pl",
          "prof":"w",
          "spawns": {"1399":[[63,9],[14,10]],"1448":[[91,10],[63,23],[53,7],[40,37],[81,36],[63,50]],"1449":[[32,33],[57,34],[87,59],[53,51],[14,50]],"1458":[[30,20],[51,29],[77,42],[2,25]],"1464":[[9,18]],"2902":[[20,23],[37,26]],"3135":[[50,57],[58,34],[34,19],[11,24],[14,4],[29,47]],"3136":[[29,7],[47,11],[57,28],[43,29],[37,53],[12,52],[24,43],[24,74],[54,76],[40,84]],"3137":[[49,39],[23,9],[57,14],[33,29],[57,50]],"3138":[[38,56],[37,83],[50,87],[47,46],[18,57]],"3209":[[24,46],[39,51],[52,60],[31,78],[55,80],[8,78],[8,49],[10,7]]}
      },
      "Dęborożec":{
          "lvl":242,
          "ver": "pl",
          "prof":"w",
          "spawns": {"3594":[[11,21],[41,46],[28,28],[80,50]],"3595":[[85,50],[33,28],[75,27]],"3596":[[40,8],[58,26],[60,50]],"3597":[[2,31],[31,83]],"3598":[[34,11],[46,48]],"3610":[[52,45],[7,57],[39,11]],"3611":[[30,9]],"3612":[[17,17]],"3613":[[21,8],[52,22]],"3614":[[11,15]],"3615":[[13,11]],"3620":[[7,13]],"3621":[[11,18]],"3622":[[36,22]],"3623":[[17,17]],"3624":[[12,19]],"3625":[[23,27]],"3626":[[9,12]],"3627":[[20,23]]}
      },
      "Tepeyollotl":{
          "lvl":260,
          "ver": "pl",
          "prof":"b",
          "spawns": {"1901":[[18,70],[25,9],[38,5],[39,64]],"1926":[[6,56],[7,71],[8,19],[54,5]],"5665":[[24,50],[25,11]],"5666":[[16,25],[32,30]],"5667":[[14,20],[49,41]],"5670":[[12,10]],"5678":[[19,8]],"5679":[[9,17],[20,22]],"5680":[[19,11],[20,15]],"5681":[[5,17],[7,8]],"5682":[[10,15],[29,24]],"5683":[[3,24],[29,29]],"5684":[[4,26],[23,8]],"5688":[[5,15]],"5689":[[3,11],[29,18]],"5690":[[12,18],[20,21]],"5691":[[7,11],[15,9]],"5692":[[3,22],[28,17]],"5693":[[4,6],[28,17]],"5694":[[10,15],[24,16]],"5697":[[16,18]],"5698":[[11,14],[20,14]],"5699":[[7,17],[13,6]],"5700":[[9,12],[14,11]],"5701":[[3,17],[28,17]],"5702":[[9,11],[23,26]],"5703":[[12,8]],"5704":[[3,12],[22,12]],"5705":[[6,18],[22,28]],"5706":[[2,15]],"5707":[[2,9],[6,17]]}
      },
      "Negthotep Czarny Kapłan":{
          "lvl":271,
          "ver": "pl",
          "prof":"h",
          "spawns": {"3029":[[13,7]],"3030":[[7,23],[10,17]],"3031":[[8,13],[11,22]],"3032":[[19,35],[23,40],[49,24],[52,14],[71,14]],"3033":[[11,40],[69,40],[78,25],[50,29]],"3034":[[19,20],[7,15]],"3035":[[30,31],[46,34]],"3036":[[16,20],[15,40]],"3037":[[29,26],[38,13]],"3038":[[23,6],[21,33]],"3039":[[26,38]],"3040":[[12,11]],"3041":[[15,13],[16,15]],"3042":[[18,13],[26,48],[73,20],[61,42]],"3043":[[11,16],[35,8],[52,10],[20,37],[39,45]]}
      },
      "Młody smok":{
          "lvl":282,
          "ver": "pl",
          "prof":"m",
          "spawns": {"3315":[[4,19],[26,8],[30,90],[52,38],[55,6]],"3320":[[7,5]],"3322":[[4,7]],"3325":[[5,2],[21,76],[24,61],[47,24],[55,62]],"3326":[[52,50],[67,23]],"3327":[[20,58],[29,46],[64,37]],"3328":[[30,31],[31,87],[54,70],[60,30]],"3329":[[14,19]],"3330":[[29,11],[29,41]],"3331":[[16,8]],"3332":[[5,20]],"3333":[[23,5]],"3336":[[27,11]],"3338":[[4,21]],"3339":[[26,12]]}
      },
      "Młody smok (1. piętro)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3315": [[25,72]]
          }
      },
      "Młody smok (parter)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3315": [[33,47]],
              "3325": [[47,70],[33,56]]
          }
      },
      "Młody smok (1. i 2. piętro)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3315": [[53,33]]
          }
      },
      "Młody smok (sala 1)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3325": [[11,81]]
          }
      },
      "Młody smok (przedsionek)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3325": [[40,11]]
          }
      },
      "Młody smok (obie jaskinie)": {
          "lvl": 282,
          "ver": "pl",
          "prof":"m",
          "spawns": {
              "3326": [[60,46]]
          }
      },

      // margonem.com

      "Harriet the Domina": {
          "lvl": 21,
          "ver": "en",
          "prof": "b",
          "spawns": {"3":[[19,33],[49,3]],"167":[[6,6],[6,8]],"168":[[4,7],[10,9]],"169":[[2,8],[8,9]],"171":[[1,9],[8,8],[9,11],[12,11]],"173":[[4,9],[4,11],[6,6]],"174":[[6,12],[13,9],[13,12]],"175":[[5,4]],"290":[[2,5],[5,15],[14,12]],"298":[[9,10]],"299":[[7,11]],"300":[[9,8]],"2546":[[7,11],[9,29],[24,13],[28,43],[34,5]],"2710":[[5,12],[8,7],[8,12],[8,15],[10,12]],"2712":[[7,7],[8,12],[11,7]],"2713":[[6,6],[8,12]],"2714":[[1,8],[9,8],[11,10]],"2715":[[8,17],[11,13],[11,18],[16,18]],"2718":[[1,8],[7,8]],"2719":[[6,21],[8,35],[9,10]],"2721":[[2,8],[3,10],[3,14],[18,15]],"2722":[[7,8],[8,22]],"2879":[[4,7],[4,10],[9,20]],"2880":[[6,21]],"2885":[[16,14],[18,57],[24,57],[28,15]],"2886":[[8,31],[10,8],[17,49],[19,5],[28,59]]}
      },

      "Wicked Patrick": {
          "lvl": 35,
          "ver": "en",
          "prof": "w",
          "spawns": {"3":[[2,49],[6,17],[8,23],[8,71],[12,15],[19,51],[25,11],[25,71],[28,4],[31,65],[33,56],[43,19],[48,78],[50,45],[52,26],[53,71],[55,3],[59,44],[61,72]],"4":[[4,21],[19,55],[37,91],[44,8],[52,82]],"19":[[11,10]],"110":[[0,23],[3,4],[4,77],[5,85],[9,8],[17,89],[18,2],[19,78],[25,39],[27,65],[29,42],[30,8],[31,21],[31,50],[39,61],[41,40],[46,83],[48,2],[53,77],[54,51],[55,12]],"111":[[32,13]],"115":[[7,3],[8,19],[8,52],[38,43],[41,43],[49,43],[52,29]],"634":[[25,7]],"725":[[6,20],[7,3],[13,34],[15,48],[19,21],[31,51],[41,9],[42,19],[44,53],[51,3],[69,62],[71,21],[72,6],[83,11],[91,30]],"1110":[[32,9],[52,59]],"4087":[[4,49],[6,28],[14,2],[16,35],[30,13],[30,50],[39,26],[52,50],[53,11]]}
      },

      "Walking Sam": {
          "lvl": 40,
          "ver": "en",
          "prof": "w",
          "spawns": {"1108":[[13,14],[13,60],[38,25],[43,51],[59,56],[67,21],[87,51]],"1219":[[10,41],[18,13],[28,38],[59,33],[77,21],[85,16]],"1230":[[21,40],[34,9],[73,49],[74,18]],"1235":[[14,29],[30,45],[60,53],[82,31],[87,43]],"1263":[[6,34],[24,86],[27,39],[34,7]],"1267":[[5,34],[8,73],[33,82],[46,51],[50,2],[53,44],[54,21]],"1285":[[3,41],[13,22],[15,70],[27,19],[37,91],[45,49]],"3361":[[2,29],[28,14],[48,63]]}
      },

      "Deceiver": {
          "lvl": 45,
          "ver": "en",
          "prof": "b",
          "spawns": {"8":[[14,37],[15,25],[21,2],[25,51],[35,30],[50,5],[51,23]],"10":[[3,9],[17,43],[26,11],[36,48],[53,31],[58,7],[76,55],[80,11],[80,20]],"37":[[3,17],[15,2],[31,6],[40,43],[46,57],[66,21],[78,55],[80,23],[89,3],[93,54]],"38":[[24,28],[37,52],[38,8],[63,4],[77,51],[79,37]],"84":[[18,29],[20,15],[40,16],[58,14],[64,22],[70,7],[90,15]],"1057":[[4,29],[4,42],[12,16],[18,7],[28,44],[36,5],[58,19],[72,24],[80,60],[90,8]]}
      },

      "Crimson Avenger": {
          "lvl": 45,
          "ver": "en",
          "prof": "m",
          "spawns": {"121":[[14,19],[30,61],[39,8],[46,43],[62,75]],"128":[[3,89],[4,54],[17,28],[18,45],[33,18],[43,3],[46,9]],"132":[[14,11]],"133":[[6,18]],"134":[[11,7]],"135":[[14,8]],"136":[[7,8]],"151":[[4,58],[9,5],[18,16],[26,7],[44,39],[48,8],[58,37],[59,58],[62,27]],"182":[[8,5]],"183":[[11,9]],"226":[[16,36],[17,2],[23,48],[24,71]],"227":[[10,33]],"228":[[48,13]],"229":[[16,6],[21,23],[27,40],[34,15],[46,27]],"2536":[[3,88],[4,60],[28,91],[32,94],[33,10],[36,23],[49,17]]}
      },

      "Thief": {
          "lvl": 50,
          "ver": "en",
          "prof": "h",
          "spawns": {"43":[[10,17],[11,11]],"157":[[5,5]],"162":[[6,7]],"165":[[4,7]],"244":[[17,12],[25,75],[38,12],[57,68]],"1987":[[7,14]],"2010":[[7,5]],"2011":[[7,7],[13,12]],"2016":[[5,11]],"2018":[[6,6]],"2308":[[21,4],[36,89],[51,12],[52,42]],"2324":[[5,5],[16,55],[20,28],[44,72]],"2349":[[5,6]],"2350":[[8,13]],"2351":[[13,5]],"2352":[[45,12],[51,53]]}
      },

      "Spiteful Guide": {
          "lvl": 63,
          "ver": "en",
          "prof": "w",
          "spawns": {"116":[[7,17],[14,12],[40,37],[52,30]],"122":[[19,6],[32,7],[35,20],[54,18],[54,25]],"140":[[10,49],[26,54],[44,29],[49,2],[56,27]],"150":[[3,34],[18,4],[27,50],[40,37],[57,3],[89,51]],"180":[[8,20],[16,5],[16,40],[22,20],[31,34],[32,3],[54,29]],"2730":[[6,46],[12,23],[19,13],[28,38],[38,58],[49,15],[53,6]]}
      },

      "Fiendish Koschei": {
          "lvl": 74,
          "ver": "en",
          "prof": "w",
          "spawns": {"262":[[21,6],[22,56],[67,38]],"263":[[15,38],[34,46],[35,18],[47,23],[57,55]],"264":[[8,49],[11,39],[27,38],[30,22],[50,12],[52,40],[53,62]],"265":[[10,77],[22,30],[24,60],[38,82],[51,24]]}
      },

      "Possessed Paladin": {
          "lvl": 85,
          "ver": "en",
          "prof": "w",
          "spawns": {"180":[[31,18],[48,23]],"184":[[32,29]],"203":[[15,26],[19,15],[29,18]],"204":[[17,16]],"205":[[8,17]],"210":[[11,24],[25,42],[64,12],[77,26],[82,47]],"211":[[12,7],[19,36],[28,45]],"601":[[6,41],[22,21],[26,54],[60,36],[88,6]],"602":[[16,33],[32,59]],"603":[[14,22],[16,44]]}
      },

      "Night's Mistress": {
          "lvl": 100,
          "ver": "en",
          "prof": "m",
          "spawns": {"253":[[4,35],[77,45],[85,60],[88,21]],"339":[[5,44],[7,14],[10,63],[81,1],[86,60],[91,41]],"500":[[8,5],[11,86],[18,71],[27,10],[45,4],[46,40],[48,81],[52,10],[56,41],[57,26],[58,64]],"2910":[[22,9],[48,41],[65,22],[69,44],[83,53],[88,34]],"2911":[[10,14],[29,26],[42,20],[62,58],[84,5],[85,19]],"2912":[[18,9],[35,19],[46,40],[64,7],[76,53],[77,13],[80,38]],"2913":[[22,12],[34,14],[57,30],[59,4],[83,9],[83,43]],"2914":[[12,54],[27,13],[32,54],[55,13],[55,44],[75,15]],"2915":[[12,11],[15,38],[17,58],[53,20],[57,7],[59,30],[66,40]]}
      },

      "Persian Prince": {
          "lvl": 116,
          "ver": "en",
          "prof": "b",
          "spawns": {"1338":[[4,22]],"1340":[[10,16]],"1342":[[5,25],[11,6]],"1348":[[10,21],[11,89]],"1350":[[42,24],[61,15]],"1368":[[41,22],[61,55],[71,16]],"1525":[[25,16],[51,32]],"1526":[[8,4]],"1528":[[4,14]],"1607":[[15,15],[63,29],[79,54]],"1613":[[11,7],[33,23],[75,30]],"3081":[[9,7],[42,46],[42,79]]}
      },

      "Sheepless Shepherd": {
          "lvl": 123,
          "ver": "en",
          "prof": "h",
          "spawns": {"1100":[[4,23],[7,10],[10,74],[19,41],[25,70],[27,52],[29,86],[33,1],[34,27],[34,70],[40,61],[50,32],[52,14],[53,51],[53,70],[54,88]],"1101":[[6,41],[8,81],[12,61],[13,14],[13,26],[13,44],[14,67],[17,91],[19,22],[27,10],[27,37],[30,88],[31,60],[36,25],[36,34],[36,55],[38,8],[44,27],[45,9],[45,39],[45,92],[55,27],[56,11],[58,80],[61,37]],"1104":[[4,55],[11,18],[16,42],[18,54],[21,28],[29,7],[30,55],[35,45],[43,27],[54,27],[56,7]],"1105":[[6,5],[7,12],[7,41],[11,21],[15,30],[27,4],[27,37],[29,12],[39,43],[40,5],[41,23]],"1106":[[4,32],[8,6],[12,27],[14,16],[19,35],[23,12],[23,27],[28,20],[32,31],[34,9],[34,17]],"1107":[[3,24],[6,32],[7,16],[8,5],[11,28],[17,34],[18,10],[19,6],[23,29],[27,7],[29,16],[33,12]]}
      },

      "Grauhaz the Usurer": {
          "lvl": 129,
          "ver": "en",
          "prof": "w",
          "spawns": {"285":[[34,9]],"286":[[5,21],[50,41]],"287":[[24,29]],"590":[[3,33]],"592":[[42,37]],"594":[[28,20]],"1227":[[6,43],[49,42],[50,21]],"1228":[[5,18],[42,37],[51,3]],"1229":[[8,13],[11,43],[37,40],[53,9]],"1231":[[12,11],[32,47],[39,58]],"1232":[[33,7],[58,11]],"1234":[[5,39],[6,23],[21,19],[46,53]],"1238":[[15,7]]}
      },

      "Insane Orc Hunter": {
          "lvl": 144,
          "ver": "en",
          "prof": "w",
          "spawns": {"344":[[9,43],[15,19],[46,48],[65,21],[65,57],[68,37],[85,21],[90,37]],"348":[[7,51],[12,2],[22,7],[23,26],[27,11],[57,17],[63,52]],"356":[[16,16],[52,12],[59,35],[75,47],[87,7]],"357":[[17,86],[19,23],[37,29],[43,5],[45,77],[61,47]],"358":[[12,19]],"360":[[5,7]],"550":[[6,43],[7,6],[8,33],[10,16],[37,8],[37,23],[41,39]],"552":[[10,29],[27,22]],"585":[[6,30],[6,45],[10,10],[19,36],[28,22],[32,11],[45,41],[47,39],[49,19]],"586":[[7,15],[9,18],[23,44],[27,13],[27,24],[31,35],[47,32]],"587":[[19,7]]}
      },

      "Atalia the Spellcaster": {
          "lvl": 157,
          "ver": "en",
          "prof": "m",
          "spawns": {"1293":[[26,10],[32,55],[40,5],[45,47],[58,4],[63,45],[76,28]],"1294":[[14,21],[23,20],[29,7],[29,15],[53,23]],"1297":[[1,43],[35,27],[44,54],[45,4],[55,11],[75,33],[94,6]],"1298":[[9,12]],"1299":[[19,6],[23,13]],"1301":[[2,6]],"1303":[[11,13]],"1305":[[8,9],[10,17]],"1306":[[13,13]],"1307":[[8,6],[16,8]],"1315":[[24,27],[42,58]]}
      },

      "Pious Friar": {
          "lvl": 165,
          "ver": "en",
          "prof": "b",
          "spawns": {"1984":[[10,21],[28,17],[52,44],[83,7],[94,54]],"2391":[[7,14],[17,27]],"2486":[[7,5]],"2488":[[5,12]],"2489":[[10,5]],"2492":[[8,4]],"2493":[[6,5]],"2494":[[19,18],[39,21]],"2495":[[8,19],[23,12],[23,19],[35,19],[37,21]],"2497":[[13,9]],"2498":[[4,22],[11,23],[13,8],[13,15]],"2499":[[3,16]],"2501":[[8,12]],"2502":[[7,12],[8,7],[17,12]],"2503":[[3,11],[7,5],[11,11]],"2504":[[4,9]],"2505":[[9,12]],"2509":[[4,11],[13,12]],"2511":[[5,6],[8,8],[9,6],[10,12]],"2513":[[55,12]],"2515":[[46,62],[49,22]],"2516":[[27,11]],"2527":[[14,7]],"2535":[[6,58],[10,10],[15,44],[15,67],[47,19],[50,49]],"2585":[[13,16]],"2587":[[7,12]],"2588":[[11,9]],"2589":[[8,12]]}
      },

      "Viviana Nandid": {
          "lvl": 184,
          "ver": "en",
          "prof": "h",
          "spawns": {"2055":[[5,41],[8,10],[10,45],[14,58],[37,5],[55,40],[56,20],[59,52],[62,58],[67,18],[80,1]],"2056":[[1,15],[8,9],[15,16],[22,23],[56,14],[67,21],[68,51],[84,45],[85,20]],"2064":[[1,8],[12,32],[13,55],[21,48],[27,53],[28,14],[41,8],[42,14],[46,50],[71,62],[75,26]],"2065":[[3,27],[6,44],[6,55],[15,6],[16,60],[25,26],[32,37],[32,60],[39,35],[47,57],[51,37],[53,35],[63,19],[72,5],[73,50],[77,60],[87,40],[90,27]],"2066":[[5,40],[6,26],[30,10],[31,3],[32,38],[35,26],[51,11]]}
      },

      // space needed to prevent ovewrtiting pl
      "Mulher Ma ": {
          "lvl": 197,
          "ver": "en",
          "prof": "b",
          "spawns": {"114":[[71,4]],"574":[[22,3]],"575":[[15,53]],"730":[[91,9],[94,61]],"731":[[13,4],[91,33]],"865":[[11,5]],"1992":[[19,18]],"2002":[[4,17]],"2020":[[48,41],[70,37]],"2056":[[10,45],[65,38],[89,41]],"2063":[[13,50],[34,36],[56,12]],"2126":[[7,6]],"2163":[[6,7]],"2169":[[7,8]],"2171":[[4,8]],"2183":[[9,10]],"2432":[[4,5]],"3972":[[53,56]],"3973":[[9,6],[30,55],[67,20]]}
      },

      "Ded Moroz": {
          "lvl": 210,
          "ver": "en",
          "prof": "m",
          "spawns": {"114":[[19,37]],"1132":[[7,18],[20,17],[31,35],[43,29],[47,15]],"1136":[[8,17],[15,22],[17,30],[38,9],[48,8]],"1138":[[10,31],[11,51],[24,28],[35,56]],"1140":[[40,9],[40,23],[45,36],[58,19]],"2056":[[30,30],[51,23],[51,29],[57,50],[63,40],[66,31],[68,54],[77,20],[93,39]],"2063":[[17,37],[27,17],[29,47],[36,59],[42,17],[48,3],[56,52],[58,7],[62,23],[71,17],[72,5],[77,9],[84,39],[90,48]],"2064":[[7,30],[13,30],[26,38],[33,59],[40,10],[46,47]]}
      },

      "Demonis Lord of the Void": {
          "lvl": 210,
          "ver": "en",
          "prof": "m",
          "spawns": {"4112":[[9,9],[26,26]],"4113":[[6,55],[39,30],[52,9]],"4114":[[10,19],[48,45]],"4115":[[10,36],[53,20],[59,51]],"4116":[[26,16],[71,17]],"4117":[[9,11],[9,51],[51,51],[52,11]],"4118":[[11,34],[20,7],[47,17],[47,43],[53,29],[80,35]],"4119":[[45,52],[53,10]],"4120":[[14,30],[22,57],[33,15]]}
      },

      // space needed to prevent ovewrtiting pl
      "Vapor Veneno ": {
          "lvl": 227,
          "ver": "en",
          "prof": "w",
          "spawns": {"1399":[[14,10],[38,30],[52,12],[79,38],[82,6],[85,27]],"1449":[[3,23],[20,58],[33,59],[36,33],[50,40],[79,2]],"1461":[[10,16]],"1464":[[6,38],[28,38]],"1470":[[18,29]],"1475":[[9,11]]}
      },

      "Oakhornus": {
          "lvl": 242,
          "ver": "en",
          "prof": "w",
          "spawns": {"3594":[[11,23]],"3595":[[23,25]],"3596":[[12,7]],"3597":[[85,22]],"3598":[[34,12]],"3610":[[19,24]],"3611":[[18,14]],"3612":[[21,22]],"3613":[[17,14]],"3614":[[7,10]],"3615":[[16,12]],"3616":[[11,14]],"3620":[[8,14]],"3621":[[13,25]],"3622":[[18,12]],"3623":[[18,16]],"3624":[[11,19]],"3625":[[19,21]],"3626":[[13,12]],"3627":[[20,23]]}
      },

      // space needed to prevent ovewrtiting pl
      "Tepeyollotl ": {
          "lvl": 260,
          "ver": "en",
          "prof": "b",
          "spawns": {"1058":[[13,18]],"1059":[[19,17]],"1060":[[18,51],[44,33]],"1061":[[22,30],[46,30]],"1062":[[48,27],[49,39]],"1063":[[31,48],[43,22]],"1064":[[8,15]],"1065":[[18,17]],"1066":[[15,13]],"3156":[[8,40],[33,21],[37,40],[39,4],[53,63]],"3157":[[9,17],[20,57],[25,47],[33,81],[42,31]],"3160":[[6,18]],"3161":[[10,10],[20,22]],"3162":[[9,22],[19,13]],"3163":[[9,10]],"3164":[[9,29],[22,20]],"3165":[[4,25],[28,29]],"3166":[[11,14],[22,8]],"3170":[[6,8],[18,19]],"3171":[[12,20],[29,23]],"3172":[[12,17],[20,20]],"3173":[[12,12]],"3174":[[8,16],[20,21]],"3175":[[20,29],[21,6]],"3176":[[9,16],[26,24]],"3179":[[7,12]],"3180":[[11,13],[19,20]],"3181":[[9,10]],"3182":[[8,11]],"3183":[[13,10],[20,22]],"3184":[[12,7],[24,25]],"3185":[[17,12]],"3186":[[6,10],[14,12]],"3187":[[7,13],[27,15]],"3188":[[12,6]],"3189":[[2,10],[15,17]]}
      },
      
      "Negthotep the Abyss Priest": {
          "lvl": 271,
          "ver": "en",
          "prof": "h",
          "spawns": {"3029":[[13,7]],"3030":[[7,22],[10,17]],"3031":[[8,13],[11,22]],"3032":[[19,35],[24,41],[49,24],[52,14]],"3033":[[9,40],[50,29],[69,40],[78,25]],"3034":[[7,15],[19,20]],"3035":[[30,31],[46,34]],"3036":[[15,40],[16,20]],"3037":[[29,26],[37,12]],"3038":[[21,33],[23,6]],"3039":[[26,38]],"3040":[[11,12]],"3041":[[16,13],[16,15]],"3042":[[18,13],[26,48],[61,42],[73,21]],"3043":[[11,16],[20,37],[35,8],[39,45],[52,10]]}
      },

      "Young Dragon": {
          "lvl": 282,
          "ver": "en",
          "prof": "m",
          "spawns": {"3315":[[4,19],[23,85],[52,38]],"3320":[[7,5]],"3322":[[3,6]],"3325":[[4,38],[5,2],[21,76],[24,61],[46,24]],"3326":[[52,50],[67,27]],"3327":[[20,58],[29,46],[64,37],[83,48]],"3328":[[30,31],[31,87],[54,70],[60,30]],"3329":[[14,19]],"3330":[[29,11],[31,40]],"3331":[[16,8]],"3332":[[5,20]],"3334":[[31,34]],"3335":[[25,27]],"3336":[[27,11]],"3338":[[4,21]],"3339":[[26,12]]}
      },

      "Qing Long": {
          "lvl": 295,
          "ver": "en",
          "prof": "m",
          "spawns": {"3315":[[13,20],[20,73],[25,47],[26,59],[42,39],[52,67]],"3325":[[9,59],[10,92],[12,67],[26,44],[31,89],[35,27],[45,76],[56,60],[59,79]],"3326":[[9,47],[62,53],[86,59]],"3327":[[30,52],[57,53],[62,35],[77,38],[83,20],[93,15]],"3328":[[41,83],[50,51],[53,22],[53,38]],"3953":[[10,2],[35,83],[49,63],[50,15]],"3955":[[4,60],[12,94],[14,44],[36,4],[54,79],[55,10],[58,47]],"3956":[[21,9],[22,51],[45,35],[50,94]],"3957":[[13,77],[15,24],[17,61],[43,7],[47,37]]}
      }
  };

  var eliteDB = {
      //elity do dziennego questa w margonem.com
      "Masked Blaise": {
          lvl: -1,
          ver: "en",
          //spawns: {196:[[8,5]]} w sumie to ich na całą mapę ładuje więc bez sensu
      },
      "Cula Joshua": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Mola Nito": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Toto Acirfa": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Masked Roman": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Possessed Fissit": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Soda": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Molybdenum Matityahu": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Hummopapa": {
          lvl: -1,
          ver: "en",
          spawns: {}
      },
      "Shponder":{
          lvl: -1,
          ver:"en",
          spawns:{}
      },
      "Mobile Jeecus":{
          lvl: -1,
          ver:"en",
          spawns:{}
      }
  };

  this.getHerosDB = function() {
      return herosDB;
  };

  this.fireEvent = function() {
      const ev = new CustomEvent("miniMapPlusLoad", {detail: this});
      document.dispatchEvent(ev);
  }

  this.extendHerosDB = function(data) {
      for (const herosName in data) {
          const newData = data[herosName];
          if (newData === null || newData === false) {
              delete herosDB[herosName];
          } else if (!herosDB[herosName]) {
              if (typeof newData.lvl == "undefined")
                  newData.lvl = -1;
              
              herosDB[herosName] = newData;
          } else {
              const existingData = herosDB[herosName];
              if (typeof newData.lvl != "undefined")
                  existingData.lvl = newData.lvl;

              if (typeof newData.ver != "undefined")
                  existingData.ver = newData.ver;

              for (const mapKey in newData.spawns) {
                  const mapData = newData.spawns[mapKey];
                  if (mapData === null || mapData === false) {
                      delete existingData.spawns[mapKey];
                  } else if (typeof existingData.spawns[mapKey] == "undefined") {
                      existingData.spawns[mapKey] = mapData;
                  } else {
                      const existingMapData = existingData.spawns[mapKey];
                      // TODO: prevent duplicates
                      existingMapData.push(...mapData);
                  }
              }
          }
      }
  }

  var niceSettings = new (function(options) {
  var self = this;
  var {get, set, data, header, onSave} = options;
  var panels = {};
  var $currentPanel = false;
  var $activeLPanelEntry;
  var $rpanel;
  var $wrapper;
  var currentPanel = "";
  var shown = false;
  this.toggle = function() {
      var lock = interface == "new" ? Engine.lock : (interface == "old" ? g.lock : null);
      if (shown) {
          if (lock) lock.remove("ns-"+header);
          else global.dontmove = false;
          $wrapper.style["display"] = "none";
      } else {
          if (lock) lock.add("ns-"+header);
          else global.dontmove = true;
          $wrapper.style["display"] = "block";
      };
      shown = !shown;
  };
  this.initHTML = function() {
      $wrapper = document.createElement("div");
      $wrapper.classList.add("ns-wrapper");
      document.body.appendChild($wrapper);

      var $header = document.createElement("div");
      $header.innerHTML = header + " - ustawienia";
      $header.classList.add("ns-header");
      $wrapper.appendChild($header);

      var $close = document.createElement("div");
      $close.innerHTML = "X";
      $close.classList.add("ns-close");
      $close.addEventListener("click", this.toggle);
      $wrapper.appendChild($close);

      var $panels = document.createElement("div");
      $panels.classList.add("ns-panels");
      $wrapper.appendChild($panels);

      var $lpanel = document.createElement("div");
      $lpanel.addEventListener("click", this.lPanelClick);
      $lpanel.classList.add("ns-lpanel");
      $panels.appendChild($lpanel);

      $rpanel = document.createElement("div");
      $rpanel.classList.add("ns-rpanel");
      $rpanel.addEventListener("click", this.globalRpanelHandler);
      $panels.appendChild($rpanel);

      $lpanel.innerHTML = this.generateLpanelHtml();
      this.genereteRpanels();
  };
  this.lPanelClick = function(e) {
      if (e.target.dataset["name"]) {
          self.togglePanel(e.target.dataset["name"]);
          if ($activeLPanelEntry) $activeLPanelEntry.classList.remove("active");
          $activeLPanelEntry = e.target;
          $activeLPanelEntry.classList.add("active");
      };
  };
  this.globalRpanelHandler = function(e) {
      var tar = e.target;
      if (tar.dataset["listbtt"]) {
          var key = tar.dataset["listbtt"];
          var $content = document.querySelector(".ns-list-content[data-list='"+key+"']");
          var $input = document.querySelector("input[data-list='"+key+"']");
          self.addContentToList($content, $input);
          self.savePanel(currentPanel);
      } else if (tar.dataset["listitem"]) {
          tar.remove();
          self.savePanel(currentPanel);
      };
  };
  this.addContentToList = function($content, $input) {
      var val = $input.value;
      if (val == "") return;
      $input.value = "";
      var items = this.getContentItems($content);
      if (items.indexOf(val) > -1) return 
      var $div = document.createElement("div");
      $div.classList.add("ns-list-item");
      $div.dataset["listitem"] = "1";
      $div.innerText = val;
      $content.appendChild($div);
  };
  this.getContentItems = function($content) {
      var items = [];
      for (var i=0; i<$content.children.length; i++) {
          items.push($content.children[i].innerHTML);
      };
      return items;
  };
  this.togglePanel = function(name) {
      if ($currentPanel) $currentPanel.remove();
      $currentPanel = panels[name];
      currentPanel = name;
      $rpanel.appendChild($currentPanel);
      this.setAsyncPanelContent(name);
  };
  this.setAsyncPanelContent = function(name) {
      var entries = options.data[name];
      for (var i=0; i<entries.length; i++) {
          var entry = entries[i];
          if (entry.asyncid) {
              entry.fun(val => {
                  var el = document.getElementById(entry.asyncid);
                  if (el) el.innerHTML = val;
              });
          };
      };
  };
  this.genereteRpanels = function() {
      for (var name in data) {
          this.generateRpanel(name, data[name]);
      };
  };
  this.generateRpanel = function(name, content) {
      var $panel = document.createElement("div");
      $panel.classList.add("ns-rpanel-list");
      panels[name] = $panel;
      var html = "";
      for (var i=0; i<content.length; i++) {
          html += this.generateRpanelEntryHtml(content[i]);
      };
      $panel.innerHTML = html;
      var $btt = document.createElement("div");
      $btt.innerHTML = "Zapisz";
      $btt.classList.add("ns-save-button");
      $btt.addEventListener("click", () => this.savePanel(name));
      $panel.appendChild($btt);
  };
  this.generateRpanelEntryHtml = function(entry) {
      var {type, special} = this.getEntryType(entry.type);
      if (!special) {
          var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+get(entry.key)+"'></input>";
          return this.getRpanelEntry(entry.name, input, entry);
      } else {
          if (type == "range") {
              var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+get(entry.key)*100+"' min='"+entry.data[0]*100+"' max='"+entry.data[1]*100+"'></input>";
              return this.getRpanelEntry(entry.name, input, entry);
          } else if (type == "checkbox") {
              var input = "<input data-key='"+entry.key+"' type='"+type+"' "+(get(entry.key) ? "checked" : "")+"></input>";
              return this.getRpanelEntry(entry.name, input, entry);
          } else if (special == "char") {
              var input = "<input data-key='"+entry.key+"' type='"+type+"' value='"+String.fromCharCode(get(entry.key))+"' maxlength='1' style='width: 10px; text-align: center'></input>";
              return this.getRpanelEntry(entry.name, input, entry);
          } else if (special == "noinput") {
              if (type != "async") {
                  return this.getRpanelEntry(entry.t1, entry.t2, entry);
              } else {
                  var id = "NS-async-"+Math.random()*10;
                  entry.asyncid = id;
                  return this.getRpanelEntry(entry.t1, "<div id='"+id+"'>"+entry.placeholder+"</div>", entry);
              };
          } else if (type == "list") {
              return this.generateListInput(entry);
          };
      };
  };
  this.generateListInput = function(entry) {
      var list = get(entry.key);
      var html;
      html = "<div class='ns-list-wrapper'>";
          html += "<div class='ns-list-header'>"+entry.name+"</div>";
          html += "<div class='ns-list-content' data-list='"+entry.key+"'>";
          for (var i=0; i<list.length; i++) {
              html += "<div class='ns-list-item' data-listitem='1'>"+list[i]+"</div>";
          };
          html += "</div>";
          html += "<div class='ns-list-bottombar'>";
              html += "<div class='ns-list-input'><input data-list='"+entry.key+"' type='text'></div>";
              html += "<div class='ns-list-addbtt' data-listbtt='"+entry.key+"'>+</div>";
          html += "</div>";
      html += "</div>";
      return html;
  };
  this.getRpanelEntry = function(txt, input, entry) {
      let tip = entry.tip;
      let alert = entry.alert;
      if (interface == "old")
          return "<div "+(alert ? "onclick='mAlert(`"+alert+"`, null)'" : "")+" "+(tip ? "tip='"+tip+"'" : "")+" class='" + (alert ? "ns-clickable " : "") + "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>"+txt+"</div><div class='ns-rpanel-entry-right'>"+input+"</div></div>";
      else
          return "<div "+(alert ? "onclick='mAlert(`"+alert+"`, null)'" : "")+" "+(tip ? "tip-id='"+getTipIdForTxt(tip)+"'" : "")+" class='" + (alert ? "ns-clickable " : "") + "ns-rpanel-entry'><div class='ns-rpanel-entry-left'>"+txt+"</div><div class='ns-rpanel-entry-right'>"+input+"</div></div>";
  };
  this.getEntryType = function(entrytype) {
      var special = false;
      switch (entrytype) {
          case "string":
              var type = "text";
              break;
          case "color":
              var type = "color";
              break;
          case "range":
              special = true;
              var type = "range";
              break;
          case "check":
              special = true;
              var type = "checkbox";
              break;
          case "char":
              special = "char";
              var type = "text";
              break;
          case "list":
              special = true;
              var type = "list";
              break;
          case "numstring":
              var type = "number";
              break;
          case "info-async":
              var type = "async";
              special = "noinput";
              break;
          default:
              special = "noinput";
      };
      return {
          type: type,
          special: special
      };
  }
  this.generateLpanelHtml = function() {
      var html = "";
      for (var name in data) {
          html += "<div class='ns-lpanel-entry' data-name='"+name+"'>"+name+"</div>";
      };
      return html;
  };
  this.savePanel = function(name) {
      var panel = data[name];
      for (var i=0; i<panel.length; i++) {
          this.savePanelEntry(panel[i]);
      };
      onSave();
  };
  this.savePanelEntry = function(entry) {
      var {type, special} = this.getEntryType(entry.type);
      if (!special) {
          var val = this.getEntryValue(entry.key);
          if (type == "number") {
              val = parseInt(val);
              if (isNaN(val)) return;
          };
          set(entry.key, val);
      } else {
          if (type == "range") {
              set(entry.key, this.getEntryValue(entry.key)/100);
          } else if (type == "checkbox") {
              set(entry.key, this.getCheckboxState(entry.key));
          } else if (special == "char") {
              var val = this.getEntryValue(entry.key).toUpperCase().charCodeAt(0);
              if (isNaN(val)) return;
              set(entry.key, val);
          } else if (type == "list") {
              var $content = document.querySelector(".ns-list-content[data-list='"+entry.key+"']");
              var items = this.getContentItems($content);
              set(entry.key, items);
          };
      };
  };
  this.getEntryValue = function(key) {
      return document.querySelector("input[data-key='"+key+"']").value;
  };
  this.getCheckboxState = function(key) {
      return document.querySelector("input[data-key='"+key+"']").checked;
  };
  this.initCss = function() {
      var css = `
          .ns-wrapper {
              width: 600px;
              height: 600px;
              background: rgba(0,0,0,.8);
              border: 2px solid #222222;
              border-bottom-left-radius: 20px;
              border-bottom-right-radius: 20px;
              position: absolute;
              left: calc(50% - 300px);
              top: calc(50% - 300px);
              z-index: 499;
              color: white;
              display: none;
              ${interface == "superold" ? "transform: scale(0.8, 0.8);" : ""}
          }
          .ns-wrapper .ns-close {
              width: 39px;
              height: 39px;
              font-family: sans-serif;
              font-size: 20px;
              line-height: 39px;
              text-align: center;
              background: rgba(0,0,0,.6);
              transition: background .1s ease-in-out;
              position: absolute;
              top: 0px;
              right: 0px;
              cursor: pointer;
          }
          .ns-wrapper .ns-close:hover {
              background: rgba(20, 20, 20, .6);
          }
          .ns-wrapper .ns-header {
              border-bottom: 1px solid #333333;
              font-size: 26px;
              padding-left: 15px;
              color: white;
              height: 39px;
              line-height: 40px;
              background: rgba(50,50,50,.8);
          }
          .ns-wrapper .ns-panels {
              height: 560px;
          }
          .ns-wrapper .ns-panels .ns-lpanel {
              height: 560px;
              width: 200px;
              border-right: 1px solid #333333;
              float: left;
          }
          .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry {
              width: 75%;
              height: 30px;
              line-height: 30px;
              font-size: 19px;
              padding-left: 5px;
              background: linear-gradient(to right, rgba(100,100,100,0.45) , rgba(100,100,100,0));
              transition: all .15s ease-in-out;
              cursor: pointer;
              margin-bottom: 1px;
          }
          .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry.active {
              background: linear-gradient(to right, rgba(150,150,150,0.45) , rgba(150,150,150,0));
              width: 100%;
              padding-left: 13px;
          }
          .ns-wrapper .ns-panels .ns-lpanel .ns-lpanel-entry:hover {
              width: 100%;
              padding-left: 13px;
          }
          .ns-wrapper .ns-panels .ns-rpanel {
              height: 560px;
              width: 390px;
              float: left;
          }
          .ns-wrapper .ns-panels .ns-rpanel .ns-rpanel-entry {
              height: 30px;
              margin: 3px;
              line-height: 30px;
              background: rgba(50,50,50,0.5);
              display: flex;
          }
          .ns-panels .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-left {
              cursor: inherit;
              height: 30px;
              padding-left: 6px;
          }
          .ns-panels .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right {
              cursor: inherit;
              height: 30px;
              text-align: right;
              padding-right: 6px;
              flex-grow: 1;
          }
          .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='color'] {
              background: black;
              border: none;
              transition: background .15s ease-in-out;
              cursor: pointer;
          }
          .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='color']:hover {
              background: #282828;
          }
          .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='text'], .ns-rpanel .ns-rpanel-entry .ns-rpanel-entry-right input[type='number'] {
              background: rgba(0,0,0,0.8);
              border: 1px solid black;
              width: 80px;
              color: #CCCCCC;
              text-align: right;
          }
          .ns-rpanel .ns-save-button {
              position: absolute;
              bottom: 10px;
              right: 10px;
              height: 30px;
              width: 70px;
              font-size: 20px;
              line-height: 30px;
              text-align: center;
              border: 1px solid #333333;
              font-family: sans-serif;
              padding: 3px;
              background: rgba(50,50,50,0.5);
              cursor: pointer;
              transition: background .1s ease-in-out;
          }
          .ns-rpanel .ns-save-button:hover {
              background: rgba(50,50,50,0.7);
          }
          .ns-rpanel .ns-rpanel-list {
              height: 500px;
              overflow: auto;
          }
          .ns-list-wrapper {
              background: rgba(50,50,50,0.5);
              width: 350px;
              margin: 10px;
              border: 1px solid #333333;
          }
          .ns-list-wrapper .ns-list-header {
              text-align: center;
              height: 20px;
              font-size: 15px;
              line-height: 20px;
          }
          .ns-list-wrapper .ns-list-content {
              min-height: 80px;
              max-height: 1700px;
              overflow-y: auto;
              border-top: 1px solid #333333;
              border-bottom: 1px solid #333333;
          }
          .ns-list-wrapper .ns-list-content .ns-list-item {
              cursor: pointer;
              margin: 1px;
              background: rgba(50,50,50,0.4);
              text-align: center;
              height: 15px;
              line-height: 15px;
              font-size: 12px;
          }
          .ns-list-wrapper .ns-list-bottombar {
              height: 20px;
          }
          .ns-list-wrapper .ns-list-bottombar .ns-list-input {
              float: left;
              width: 270px;
          }
          .ns-list-wrapper .ns-list-bottombar .ns-list-input input {
              background: rgba(0,0,0,0.8);
              border: 1px solid black;
              color: #CCCCCC;
              width: 320px;
          }
          .ns-list-wrapper .ns-list-bottombar .ns-list-addbtt {
              width: 20px;
              float: right;
              text-align: center;
              line-height: 20px;
              background: rgba(50,50,50,0.6);
              cursor: pointer;
          }
          .ns-list-wrapper .ns-list-bottombar .ns-list-addbtt:hover {
              background: rgba(50,50,50,0.9);	
          }
          .ns-clickable:hover {
              cursor: pointer;
              filter: brightness(120%);
          }
      `;
      var $style = document.createElement("style");
      $style.innerHTML = css;
      document.head.appendChild($style);
  };
  this.init = function() {
      this.initHTML();
      this.initCss();
  };
})({
  get: settings.get,
  set: settings.set,
  onSave: this.onSettingsUpdate,
  header: "miniMapPlus",
  data: {
      "Kolory": [
          {
              key: "/colors/hero",
              name: "Twoja postać",
              type: "color"
          },
          {
              key: "/colors/other",
              name: "Inni gracze",
              type: "color"
          },
          {
              key: "/colors/friend",
              name: "Znajomi",
              type: "color"
          },
          {
              key: "/colors/enemy",
              name: "Wrogowie",
              type: "color"
          },
          {
              key: "/colors/clan",
              name: "Klanowicze",
              type: "color"
          },
          {
              key: "/colors/ally",
              name: "Sojusznicy",
              type: "color"
          },
          {
              key: "/colors/npc",
              name: "Zwykły NPC",
              type: "color"
          },
          {
              key: "/colors/mob",
              name: "Zwykły mob",
              type: "color"
          },
          {
              key: "/colors/elite",
              name: "Elita",
              type: "color"
          },
          {
              key: "/colors/elite2",
              name: "Elita II/eventowa",
              type: "color"
          },
          {
              key: "/colors/elite3",
              name: "Elita III",
              type: "color"
          },
          {
              key: "/colors/heros",
              name: "Heros",
              type: "color"
          },
          {
              key: "/colors/heros-resp",
              name: "Miejsce respu herosa",
              type: "color"
          },
          {
              key: "/colors/heros-mark",
              name: "Oznaczenie sprawdzonego respu herosa",
              type: "color",
              tip: "Po podejściu na tyle blisko do respu żeby heros został wykryty, resp na mapie zostanie oznaczony tym kolorem."
          },
          {
              key: "/colors/titan",
              name: "Tytan",
              type: "color"
          },
          {
              key: "/colors/item",
              name: "Przedmiot",
              type: "color"
          },
          {
              key: "/colors/gw",
              name: "Przejście",
              type: "color"
          },
          {
              key: "/colors/rip",
              name: "Groby",
              type: "color"
          },
          {
              key: "/colors/col",
              name: "Kolizja",
              type: "color",
              tip: "Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka \"inne\")."
          }
      ],
      "Warstwy": [
          {
              type: "info",
              t1: "Warstwy obiektów na mapie",
              t2: "(?)",
              tip: "Obiekty na minimapie będą sortowane według wartości wpisanych niżej. Przykładowo, obiekty z wartością 100 zawsze będą pokazywane nad tymi z 90." +
                   "<br>" +
                   "W przypadku gry 2 obiekty mają tą samą wartość, kolejność jest niezdefiniowana i będzie zależeć od kolejności ładowania." +
                   "<br>" +
                   "Starałem się dobrać domyślne wartości w miarę sensownie, ale jak komuś się nie podoba, to można zmienić :)"
          },
          {
              key: "/layers/hero",
              name: "Twoja postać",
              type: "numstring"
          },
          {
              key: "/layers/other",
              name: "Inni gracze",
              type: "numstring"
          },
          {
              key: "/layers/npc",
              name: "Zwykły NPC",
              type: "numstring"
          },
          {
              key: "/layers/mob",
              name: "Zwykły mob",
              type: "numstring"
          },
          {
              key: "/layers/elite",
              name: "Elita",
              type: "numstring"
          },
          {
              key: "/layers/elite2",
              name: "Elita II/eventowa",
              type: "numstring"
          },
          {
              key: "/layers/elite3",
              name: "Elita III",
              type: "numstring"
          },
          {
              key: "/layers/heros",
              name: "Heros",
              type: "numstring"
          },
          {
              key: "/layers/heros-resp",
              name: "Miejsce respu herosa",
              type: "numstring"
          },
          {
              key: "/layers/titan",
              name: "Tytan",
              type: "numstring"
          },
          {
              key: "/layers/item",
              name: "Przedmiot",
              type: "numstring"
          },
          {
              key: "/layers/gw",
              name: "Przejście",
              type: "numstring"
          },
          {
              key: "/layers/rip",
              name: "Groby",
              type: "numstring"
          },
          {
              key: "/layers/col",
              name: "Kolizja",
              type: "numstring",
              tip: "Kolizje pokazywane są tylko jeżeli jest to włączone w ustawieniach (zakładka \"inne\")."
          }
      ],
      "Wygląd mapy": [
          {
              key: "/mapsize",
              name: "Rozmiar mapy",
              type: "range",
              tip: "Zmiany widoczne po odświeżeniu gry",
              data: [0.6, 1.4]
          },
          {
              key: "/opacity",
              name: "Widoczność mapy",
              type: "range",
              data: [0.5, 1]
          },
          {
              key: "/darkmode",
              name: "Motyw ciemny",
              type: "check"
          },
          {
              key: "/manualDownscale",
              name: "Ręczne skalowanie obrazka mapy",
              type: "check",
              tip: "Domyślnie włączone dla przeglądarek opartych o Chromium - skalowanie background-image wygląda na nich brzydko, ta opcja pozwala na włączenie ręcznego skalowania przez rysowanie obrazka mapy na elemencie canvas.",
          }
      ],
      "Tracking": [
          {
              type: "info",
              t1: "Co to jest?",
              t2: "",
              tip: "Tracking (tropienie) to alternatywna opcja wyszukiwania NPC/itemów na mapie. Polega na tym, że gdy na mapie pojawi się coś z poniższej listy, w oknie gry ukaże się strzałka, która będzie wzkazywała drogę do tej rzeczy.<br>Dodatkowo gdy na mapie pojawia się heros, automatycznie uruchamia się tracking na niego, co jest przydatne np. w podchodzeniu do herosów eventowych.<br>Wielkość liter w nazwie NPC/przedmiotu nie ma znaczenia."
          },
          {
              key: "/trackedNpcs",
              name: "Tracking NPC",
              type: "list"
          },
          {
              key: "/trackedItems",
              name: "Tracking itemów",
              type: "list"
          }

      ],
      "Inne": [
          {
              key: "/minlvl",
              name: "Min. lvl potworków",
              type: "numstring"
          },
          {
              key: "/maxlvl",
              name: "Max. przewaga",
              tip: "Maksymalna różnica poziomów między Tobą a potworkiem przy której nie niszczy się loot na świecie na którym grasz. Jeśli nie wiesz co to, zostaw 13.",
              type: "numstring"
          },
          {
              key: "/show",
              name: "Hotkey",
              type: "char"
          },
          {
              key: "/altmobilebtt",
              name: "Przesuń przycisk mobilny",
              type: "check",
              tip: "Przesuwa przycisk widoczny na urządzeniach mobilnych pomiędzy torby"
          },
          {
              key: "/forceMobileMode",
              name: "Wymuś przycisk mobilny",
              type: "check",
              tip: "Pokazuje przycisk mobilny nawet, jeśli nie jest się na odpowiednim urządzeniu"
          },
          {
              key: "/interpolerate",
              name: "Animacje na mapie",
              type: "check"
          },
          {
              key: "/showqm",
              name: "Zaznaczaj questy",
              type: "check"
          },
          {
              key: "/novisibility",
              name: "Nie pokazuj \"mgły wojny\"",
              type: "check",
              tip: "Wyłącza pokazywanie widzianego obszaru na czerwonych mapach.<br>Nie pozdrawiam klanu Game Over (Jaruna), który utrudniał testowanie tej funkcjonalności dedając mnie bez powodu."
          },
          {
              key: "/showcol",
              name: "Pokazuj kolizje",
              type: "check",
              tip: "Zmiany widoczne są po odświeżeniu gry"
          },
          {
              key: "/showcoords",
              name: "Pokazuj pozycję kursora",
              type: "check",
          },
          /*,
          {
              key: "/showevonetwork",
              name: "Pokazuj postacie z WSync",
              tip: "World Sync to dodatek stworzony przez CcarderRa, który pozwala widzieć graczy z innych światów. Jest częścią Evolution Managera, którego można znaleźć na forum w dziale Dodatki do gry.",
              type: "check"
          }*/
      ],
      "Pomoc": [
          {
              type: "info",
              t1: "Instrukcja wyszukiwarki",
              t2: "[otwórz]",
              alert: 
`
<b>Instrukcja wyszukiwarki miniMap+</b><br>
<div style="height: 400px; overflow: auto;">
Podstawową funkcją wyszukiwarki jest szukanie po nazwie. Robi się to po prostu wpisując to, co chce się wyszukać w pole "szukaj".
Obiekty, które nie mają w nazwie wpisanego tekstu zostaną ukryte (oprócz gracza). Wielkość liter nie ma znaczenia.
<br><br>
<b>Podświetlanie koordynatów</b><br>
Wpisanie koordynatów w formacie <i>x,y</i> w pole szukania wyświetli je na mapie. Jest to o tyle fajne, że można bezpośrednio wkleić listę respów z forum i powinna działać.
<br><br>
<b>Zaawansowane szukanie</b><br>
Istnieje również możliwość bardziej zaawansowanego filtrowania obiektów.
Przykładowo, wpisanie:
<br><i>[lvl < 70]</i><br>
pokaże tylko te obiekty, których poziom jest mniejszy od 70.
Takich filtrów można umieścić kilka, poniższy:<br>
<i>[lvl <= 110] [lvl >= 70] [typ=gracz]</i><br>
wyświetli tylko graczy od poziomu 70 do 110 włącznie. Dostępne są następujące porównania:<br>
- < - dana wartość numeryczna obiektu musi być mniejsza od podanej wartości.<br>
- > - dana wartość numeryczna obiektu musi być większa od podanej wartości.<br>
- <= - dana wartość numeryczna obiektu musi być mniejsza lub równa podanej wartości.<br>
- >= - dana wartość numeryczna obiektu musi być większa lub równa podanej wartości.<br>
- = - dana wartość tekstowa lub numeryczna obiektu musi zawierać podaną wartość (wielkość liter nie ma znaczenia).<br>
- == - dana wartość tekstowa lub numeryczna obiektu musi być taka, jak podana wartość (wielkość liter nie ma znaczenia).<br>
Dodatkowo, wpisanie <i>[lvl]</i> wyświetli tylko te obiekty, które w ogóle posiadają poziom.<br>
Co do wartości, które można filtrować: dostępne są następujące:<br>
- <i>lvl</i> - wartość numeryczna, poziom potwora lub gracza.<br>
- <i>typ</i> - wartość tekstowa, zależna od typu obiektu. Może to być: kolizja, resp, grób, przedmiot, gracz, przejście, potwór: tytan, potwór: heros, potwór: elita 2, potwór: elita 3, potwór: elita, potwór: zwykły, npc<br>
- <i>klan</i> - wartość tekstowa, klan, do którego należy gracz.<br>
- <i>quest</i> - wartość logiczna (można sprawdzić tylko przez <i>[quest]</i>), ustawiona jeżeli u danego NPC dostępny jest quest.<br>
- <i>grp</i> - wartość logiczna (można sprawdzić tylko przez <i>[grp]</i>), ustawiona jeżeli dany NPC posiada grupę.
</div>
`
          }
      ],
      "Informacje": [
          {
              type: "info",
              t1: "Wersja",
              t2: "v"+this.version+(interface == "new" ? " NI" : (interface == "old" ? " SI" : " OM")),
              tip: "Kliknij aby pokazać zmiany w tej wersji",
              alert: mmp.updateString
          },
          {
              type: "info",
              t1: "Źródło instalacji",
              t2: this.getInstallSource()
          },
          {
              type: "info-async",
              t1: "Licznik instalacji",
              placeholder: "wczytywanie...",
              tip: "Liczy od wersji 3.1 minimapy",
              fun: this.installationCounter.get
          }
      ]
  }
});
  this.init();
  niceSettings.init();
  this.fireEvent();
})();

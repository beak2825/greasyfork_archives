// ==UserScript==
// @name        zive.cz - ethereal skin
// @description:cs přidává hromadu nastavení - např. široký režim nebo menší font
// @namespace   monnef.tk
// @include     http://www.zive.cz/*
// @version     3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @description přidává hromadu nastavení - např. široký režim nebo menší font
// @downloadURL https://update.greasyfork.org/scripts/12225/zivecz%20-%20ethereal%20skin.user.js
// @updateURL https://update.greasyfork.org/scripts/12225/zivecz%20-%20ethereal%20skin.meta.js
// ==/UserScript==

function argumentsToArray(args) {
  return Array.prototype.slice.call(args);
}

function log(msg) {
  var prefix = "[EtherealSkin] ";
  if (arguments.length == 1) {
    console.log(prefix + msg);
  } else {
    console.log.apply(console, [prefix].concat(argumentsToArray(arguments)));
  }
}

var debug = false;

function bug() {
  if (debug) {
    log.apply(null, ["<Debug> "].concat(argumentsToArray(arguments)));
  }
}

log("by monnef (http://monnef.tk)");
log("Installing...");

styles = {
  wide: {
    title: "Široká plocha stránky",
    css: "\
    .cs-cnt, .cs-cnt-cl-l { width: auto; float: none; }\
    .ar-detail { width: auto; }\
    .cs-cnt { display: flex; }\
    .cs-cnt > .clear { flex: 0; }\
    .cs-cnt > .cs-cnt-cl-l { flex: 1; }\
    "
  },
  smallFont: {
    title: "Malé písmo",
    css: "\
    .ar-detail .ar-content,\
    .ar-detail .ar-annotation,\
    .forum-row-wrapper .forum-text p\
    { font-size: 14px; }\
    .forum-row-wrapper { margin-bottom: 10px !important; }\
    body { font-size: 0.65em; }\
    "
  },
  bigFont: {
    title: "Velké písmo",
    css: "\
    .ar-detail .ar-content,\
    .ar-detail .ar-annotation,\
    .forum-row-wrapper .forum-text p\
    { font-size: 20px; }\
    .forum-row-wrapper { margin-bottom: 10px !important; }\
    body { font-size: 1em; }\
    #article-promo #article-promo-content { height: 256px; }\
    #article-promo-lister-links .box { transform: translateY(65px); }\
    "
  },
  smallLineHeight: {
    title: "Menší výška řádků",
    css: "\
    .ar-detail .ar-content { line-height: 18px; }\
    "
  },
  smallerGapAfterCaptions: {
    title: "Menší mezera za nadpisy",
    css: "\
    .ar-detail .ar-content h2,\
    .ar-detail .ar-content h3\
    { margin-bottom: 0 !important; }\
    "
  },
  smallerGapAfterParagaphs: {
    title: "Menší mezera za odstavci",
    css: "\
    .ar-detail .ar-content p\
    { margin-bottom: 5px !important; }\
    "
  },
  smallerGapAfterImages: {
    title: "Menší mezera pod obrázky",
    css: "\
    .ar-detail .ar-content h6\
    { margin-bottom: 5px !important; }\
    "
  },
  smallerGapAfterLinkToAnotherArticle: {
    title: "Menší mezera pod odkazy na jiné články",
    css: "\
    .ar-link-to-another { margin-bottom: 5px !important; }\
    "
  },
};

function addFontStyle(name, before){
  var keyName = "font" + name.split(" ")[0];
  before = before || "";
  styles[keyName] = {
    title: "Font " + name,
    disabledByDefault: true,
    css: before + "\
    .fs-os, body { font-family: '" + name + "'; }\
    "
  };
}
addFontStyle("Arial");
addFontStyle("Verdana");
addFontStyle("Tahoma");
addFontStyle("Calibri");
addFontStyle("Times New Roman");
addFontStyle("Cambria");
addFontStyle("Courier New");
addFontStyle("Lucida Console");
addFontStyle("Roboto","@import url(https://fonts.googleapis.com/css?family=Roboto&subset=latin,latin-ext);");
addFontStyle("Lora", "@import url(https://fonts.googleapis.com/css?family=Lora&subset=latin,latin-ext);");
addFontStyle("Oswald","@import url(https://fonts.googleapis.com/css?family=Oswald&subset=latin,latin-ext);");
addFontStyle("Open Sans Condensed", "@import url(https://fonts.googleapis.com/css?family=Open+Sans+Condensed:300&subset=latin,latin-ext);");
// TODO: more fonts

styles.removeAnotherArticles =  {
  title: "Odstranit upotávky na jiné články v textu",
  disabledByDefault: true,
  css: ".ar-link-to-another { display: none; }"
};
styles.removeSocialMenu = {
  title: "Odstranit sociální svinčík (menu)",
  css: "\
  span[data-ga='Navigace;Hlavička, Menu'],\
  .ar-detail .ar-society-networks .ar-society-link\
  { display: none; }"
};

bug("Styles: ", styles);

function getFreeId() {
  var id;
  do {
    id = "s" + Math.floor(Math.random() * 1000);
  } while ($("#" + id).length != 0);
  return id;
}

function addStyle(name, css) {
  var head = $("head");
  var elem = $("<style/>").attr("id", getFreeId()).html(css);
  head.append(elem);
  return elem;
}

var SETTINGS_KEY = "settings";

function getEmptySettings(){
  return {
    mods: {}
  };
}

function getSettings() {
  var raw = GM_getValue(SETTINGS_KEY);
  bug("raw settings", raw);
  if (!raw) {
    return getEmptySettings();
  } else {
    return JSON.parse(raw);
  }
}

function isModEnabled(name) {
  var mods = getSettings().mods;
  bug("got mods:", mods, "checking if enabled:", name);
  if (!name) {
    log("Warning! isModEnabled got name = " + name);
    return false;
  }
  if (!mods.hasOwnProperty(name)) {
    var defaultVal = (function() {
      if (styles[name].disabledByDefault) return false
      else return true;
    })();
    mods[name] = defaultVal;
    bug(name, "doesn't have value, inserting default", defaultVal);
  }
  return mods[name];
}

function setModState(name, state) {
  bug("setting mod state", name, state);
  var s = getSettings();
  s.mods[name] = state;
  setSettings(s);
}

function setSettings(settings) {
  GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
  bug("saved settings", settings);
}

function applyEnabledMods() {
  for (key in styles) {
    var value = styles[key];
    bug(key);
    if (isModEnabled(key)) {
      bug("enabled");
      if (!value.elem) {
        bug("inserting");
        value.elem = addStyle(key, value.css);
      }
    } else {
      bug("disabled");
      if (value.elem) {
        bug("removing");
        value.elem.remove();
        value.elem = null;
      }
    }
    bug(key, value);
  }
}

function createDialog() {
  bug("creating dialog");
  var dialog = $("<div/>");

  dialog.css("position", "absolute").css("right", "4em").css("top", "1.2em");
  dialog.css("border", "1px solid #a8a").css("background-color", "#ece");
  dialog.css("padding", "0.5em").css("z-index", "1000").css("max-width", "350px");
  dialog.css("font-family", "calibri").css("font-size", "16px");
  dialog.hide();

  dialog.append($("<h1/>").text("Ethereal Skin by monnef").css("color", "black").css("margin", 0));
  dialog.append($("<div/>").text("Tuto porci modů Vám přinesl skript Ethereal Skin. Pokud chcete podpořit vývoj nebo jen vyjádřit svůj dík, můžete zaslat příspěvek.").css("text-align", "left")).css("margin", "1em");
  dialog.append($("<div/>").append($("<a>").attr("href", "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=U6PGB7P24WWSU&lc=CZ&item_name=Ethereal%20Skin&item_number=ethereal_skin&currency_code=CZK&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted").attr("target", "_blank").append($("<img>").attr("src", "https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"))).css("margin", "1em"));

  var options = $("<div/>").css("margin", "1em 0");

  for (key in styles) {
    var value = styles[key];
    e = $("<div>").css("text-align", "left").css("display", "flex").css("align-items", "center");
    id = getFreeId();
    e.append($("<input type='checkbox'/>").attr("id", id).data({
      styleId: key
    }));
    e.append($("<label>").attr("for", id).text(value.title));
    bug("created checkbox group", e);
    options.append(e);
  }

  dialog.append(options);


  var loadValuesFromConfig = function loadValuesFromConfig() {
    options.children().each(function() {
      var item = $(this);
      var checkBox = item.find("input");
      var modName = checkBox.data().styleId;
      bug("loading values from config for mod name = ", modName, "for item", item, "(", item[0], ")");
      checkBox.prop("checked", isModEnabled(modName));
    });
  };

  var dialogOkButton = $("<button>").text("Uložit").css("float", "right").css("font-weight", "bold");
  var dialogCancelButton = $("<button>").text("Zrušit").css("float", "left").css("opacity", "0.5");
  var dialogResetButton = $("<button>").text("Resetovat nastavení").css("color", "red").css("opacity", "0.5").css("float", "left").css("margin-left", "1em");

  dialogCancelButton.click(function() {
    dialog.hide();
  });
  dialogOkButton.click(function() {
    options.children().each(function() {
      var item = $(this);
      var checkBox = item.find("input");
      var modName = checkBox.data().styleId;
      var newState = checkBox.prop("checked");
      bug("saving values to config for mod name = ", modName,"to a new state = ", newState, "for item", item, "(", item[0], ")");
      setModState(modName, newState);
    });
    applyEnabledMods();
    dialog.hide();
  });
  dialogResetButton.click(function(){
    if(confirm("Opravdu zahodit všechna nastavení?")){
      setSettings(getEmptySettings());
      applyEnabledMods();
      loadValuesFromConfig();
    }
  });

  dialog.append($("<div/>").append(dialogCancelButton).append(dialogResetButton).append(dialogOkButton));

  var dialogData = {
    loadValuesFromConfig: loadValuesFromConfig
  };

  dialog.data(dialogData);

  return dialog;
}

function insertControls() {
  var dialog = createDialog();
  var mainButton = $("<button>").text("E");
  mainButton.css("position", "absolute").css("right", "1em").css("top", "1em");
  mainButton.css("background-color", "#cac").css("border", "1px solid #a8a");
  mainButton.css("width", "2em").css("height", "2em");
  mainButton.css("z-index", "1000").css("font-weight", "bold");
  mainButton.click(function() {
    dialog.toggle();
    if (dialog.is(":visible")) {
      dialog.data().loadValuesFromConfig();
    }
  });

  $("body").append(mainButton);
  $("body").append(dialog);
}

insertControls();
applyEnabledMods();

log("Done.");
